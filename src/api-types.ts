import { z } from "zod";

export interface PokeTarget {
    server: string;
    port: number;
}

export interface Decoded {
    protocol: number;
    name: string;
    map: string;
    folder: string;
    game: string;
    gameId: string;
    players: number;
    maxPlayers: number;
    bots: number;
    type: string;
    env: string;
    visibility: string;
    vac: boolean;
    version: string;
    port: number | undefined;
    steamId: string | undefined;
    keywords: string | undefined;
}

export interface PokeResultOK {
    status: "ok";
    challenge: boolean;
    decoded: Decoded;
    raw: string;
    time: number;
}

export interface PokeResultFailedDecode {
    status: "nodecode";
    error: string;
    raw: string;
    time: number;
}

export interface PokeResultError {
    status: "error";
    error: string;
}

export type PokeResult = PokeResultOK | PokeResultFailedDecode | PokeResultError;

export const pokeTargetSchema = z.object({
    server: z.string().trim(),
    port: z.coerce.number().positive().max(65535),
});
