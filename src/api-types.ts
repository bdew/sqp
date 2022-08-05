import * as yup from "yup";

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

export type PokeResult = PokeResultOK | PokeResultFailedDecode | PokeResultError

export const pokeTargetSchema: yup.SchemaOf<PokeTarget> = yup.object().shape({
    server: yup.string().required(),
    port: yup.number().required().integer().positive().lessThan(65536)
}).required()