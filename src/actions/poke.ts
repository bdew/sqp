"use server";

import { createSocket } from "dgram";
import { Decoded, PokeResult, PokeTarget, pokeTargetSchema } from "../api-types";

function query(host: string, port: number, challenge?: string): Promise<Buffer> {
    const sock = createSocket("udp4");
    const buffer = Buffer.concat([
        Buffer.from("ffffffff", "hex"),
        Buffer.from("TSource Engine Query"),
        Buffer.from("00", "hex"),
        challenge ? Buffer.from(challenge, "hex") : Buffer.alloc(0),
    ]);
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error("The server didn't respond within the time limit."));
            sock.close();
        }, 10000);

        sock.on("error", (err) => {
            reject(err);
            sock.close();
            clearTimeout(timeout);
        });

        sock.on("message", (msg) => {
            resolve(msg);
            sock.close();
            clearTimeout(timeout);
        });

        sock.bind(0);

        sock.send(buffer, port, host);
    });
}

function readZStr(buf: Buffer, start: number): [string, number] {
    const s = buf.subarray(start);
    const e = s.findIndex(v => v === 0);
    return [s.toString(undefined, 0, e), start + e + 1];
}

function decodeEnv(s: string): string {
    if (s === "l") return "Linux";
    if (s === "w") return "Windows";
    if (s === "m" || s === "o") return "Mac";
    return `Unknown (${s})`;
}

function decodeType(s: string): string {
    if (s === "d") return "Dedicated";
    if (s === "l") return "Non-dedicated";
    return `Unknown (${s})`;
}

function getChallenge(msg: Buffer): string | null {
    if (msg.subarray(0, 4).toString("hex") !== "ffffffff") throw new Error("Header mismatch");
    if (msg.subarray(4, 5).toString() === "A") {
        return msg.subarray(5, 9).toString("hex");
    } else {
        return null;
    }
}

function decode(msg: Buffer): Decoded {
    if (msg.subarray(0, 4).toString("hex") !== "ffffffff") throw new Error("Header mismatch");
    if (msg.subarray(4, 5).toString() !== "I") throw new Error("Unexpected packet type");

    const protocol = msg.readUInt8(5);
    const [name, mapStart] = readZStr(msg, 6);
    const [map, folderStart] = readZStr(msg, mapStart);
    const [folder, gameStart] = readZStr(msg, folderStart);
    const [game, next] = readZStr(msg, gameStart);
    let gameId = msg.readUInt16LE(next).toString();
    const players = msg.readUInt8(next + 2);
    const maxPlayers = msg.readUInt8(next + 3);
    const bots = msg.readUInt8(next + 4);
    const type = decodeType(msg.toString(undefined, next + 5, next + 6));
    const env = decodeEnv(msg.toString(undefined, next + 6, next + 7));
    const visibility = msg.readUInt8(next + 7) === 0 ? "Public" : "Private";
    const vac = msg.readUInt8(next + 8) === 1;
    const [version, next2] = readZStr(msg, next + 9);
    const edf = msg.readUInt8(next2);

    let ptr = next2 + 1;

    let port: number | undefined;
    let steamId: string | undefined;
    let keywords: string | undefined;

    if (edf & 0x80) {
        port = msg.readUInt16LE(ptr);
        ptr += 2;
    }

    if (edf & 0x10) {
        steamId = msg.readBigUInt64LE(ptr).toString();
        ptr += 8;
    }

    if (edf & 0x20) {
        [keywords, ptr] = readZStr(msg, ptr);
    }

    if (edf & 0x01) {
        gameId = msg.readBigUInt64LE(ptr).toString();
        ptr += 8;
    }

    return { protocol, name, map, folder, game, gameId, players, maxPlayers, bots, type, env, visibility, vac, version, port, steamId, keywords };
}

async function doQuery(target: PokeTarget, challenge?: string): Promise<PokeResult> {
    const start = process.hrtime();
    const r = await query(target.server, target.port, challenge);
    const time = process.hrtime(start);
    const msec = time[0] * 1000 + time[1] / 1e6;
    try {
        const chreq = getChallenge(r);
        if (chreq) {
            if (challenge)
                throw new Error("Failed to get challenge");
            else
                return doQuery(target, chreq);
        } else {
            return { status: "ok", decoded: decode(r), raw: r.toString("hex"), time: msec, challenge: !!challenge };
        }
    } catch (e) {
        if (e instanceof Error)
            return { status: "nodecode", error: e.toString(), raw: r.toString("hex"), time: msec };
        else throw e;
    }
}

export async function pokeAction(target: PokeTarget): Promise<PokeResult> {
    const { data, success, error } = pokeTargetSchema.safeParse(target);

    if (!success) {
        console.error(error);
        return { status: "error", error: "invalid request" };
    }

    try {
        return await doQuery(data);
    } catch (e) {
        if (e instanceof Error) {
            console.error(e);
            return { status: "error", error: e.toString() };
        } else {
            console.error(e);
            return { status: "error", error: "unknown error" };
        }
    }
}
