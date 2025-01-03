import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import React, { ClipboardEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { PokeTarget, pokeTargetSchema } from "../api-types";

interface Props {
    startPoke: (target: PokeTarget) => void;
    block: boolean;
}

const useStyles = makeStyles()({
    paper: {
        padding: 10,
    },
});

export const PokeForm: React.FC<Props> = ({ startPoke, block }) => {
    const { classes } = useStyles();
    const router = useRouter();
    const [server, setServer] = useState("");
    const [port, setPort] = useState("");

    useEffect(() => {
        if (router.query["s"]) setServer(router.query["s"] as string);
        if (router.query["p"]) setPort(router.query["p"] as string);
    }, [router]);

    const canSubmit = useMemo(() => {
        return !block && pokeTargetSchema.safeParse({ server, port }).success;
    }, [server, port, block]);

    const submit = useCallback((ev: FormEvent) => {
        const { data, success } = pokeTargetSchema.safeParse({ server, port });
        if (!success) return;
        setServer(data.server);
        setPort(data.port.toString());
        router.push({ pathname: "/", query: { s: data.server, p: data.port } }, `/?s=${encodeURIComponent(data.server)}&p=${encodeURIComponent(data.port)}`);
        startPoke(data);
        ev.preventDefault();
    }, [router, server, port, startPoke]);

    const paste = useCallback((ev: ClipboardEvent) => {
        const txt = ev.clipboardData.getData("Text");
        if (txt.includes(":")) {
            const [server, rest] = txt.split(":", 2);
            setServer(server);
            const port = parseInt(rest);
            if (port > 0)
                setPort(port.toFixed(0));
            ev.preventDefault();
        }
    }, []);

    return (
        <form onSubmit={submit}>
            <Paper className={classes.paper}>
                <Grid container justifyContent="center" alignItems="center" spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Server"
                            value={server}
                            onChange={ev => setServer(ev.currentTarget.value)}
                            error={server > "" && !pokeTargetSchema.pick({ server: true }).safeParse({ server }).success}
                            variant="outlined"
                            size="small"
                            fullWidth
                            onPaste={paste}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            type="number"
                            label="Port"
                            value={port}
                            onChange={ev => setPort(ev.currentTarget.value)}
                            error={port > "" && !pokeTargetSchema.pick({ port: true }).safeParse({ port }).success}
                            variant="outlined"
                            size="small"
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Button type="submit" disabled={!canSubmit} variant="contained" color="primary" fullWidth>Poke 👆</Button>
                    </Grid>
                </Grid>
            </Paper>
        </form>
    );
};
