import fetch from "cross-fetch";
import { PokeTarget, PokeResult } from "./api-types";

export async function callPoke(target: PokeTarget): Promise<PokeResult> {
    try {
        const res = await fetch("/api/poke", { method: "POST", body: JSON.stringify(target) })
        if (!res.ok) {
            try {
                return await res.json() as PokeResult;
            } catch (err) {
                console.error(err);
                return { status: "error", error: `${res.status} - ${res.statusText}` }
            }
        }
        return await res.json() as PokeResult;
    } catch (e) {
        return { status: "error", error: `${e}` }
    }
}