import React, { useState, useCallback, useEffect, FormEvent, ClipboardEvent, useMemo } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import { PokeTarget, pokeTargetSchema } from "../api-types";
import * as yup from "yup";
import { makeStyles } from "../makeStyles";

interface Props {
    startPoke: (target: PokeTarget) => void;
    block: boolean;
}

const useStyles = makeStyles()({
    paper: {
        padding: 10
    },
})

export const PokeForm: React.FC<Props> = ({ startPoke, block }) => {
    const { classes } = useStyles();
    const router = useRouter();
    const [server, setServer] = useState("");
    const [port, setPort] = useState("");

    useEffect(() => {
        if (router.query["s"]) setServer(router.query["s"] as string);
        if (router.query["p"]) setPort(router.query["p"] as string);
    }, [router])

    const canSubmit = useMemo(() => {
        return !block && pokeTargetSchema.isValidSync({ server, port });
    }, [server, port, block])

    const submit = useCallback((ev: FormEvent) => {
        if (!canSubmit) return;
        const clean = pokeTargetSchema.validateSync({ server: server.trim(), port })
        setServer(clean.server);
        setPort(clean.port.toString());
        router.push({ pathname: "/", query: { s: clean.server, p: clean.port } }, `/?s=${encodeURIComponent(clean.server)}&p=${encodeURIComponent(clean.port)}`);
        startPoke(clean);
        ev.preventDefault();
    }, [router, server, port, startPoke, canSubmit])

    const paste = useCallback((ev: ClipboardEvent) => {
        const txt = ev.clipboardData.getData('Text')
        if (txt.includes(":")) {
            const [server, rest] = txt.split(":", 2)
            setServer(server);
            const port = parseInt(rest);
            if (port > 0)
                setPort(port.toFixed(0));
            ev.preventDefault();
        }
    }, [])

    return <form onSubmit={submit}>
        <Paper className={classes.paper}>
            <Grid container justifyContent="center" alignItems="center" spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Server"
                        value={server}
                        onChange={(ev) => setServer(ev.currentTarget.value)}
                        error={server > "" && !yup.reach(pokeTargetSchema, "server").isValidSync(server)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        onPaste={paste}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        type="number"
                        label="Port"
                        value={port}
                        onChange={(ev) => setPort(ev.currentTarget.value)}
                        error={port > "" && !yup.reach(pokeTargetSchema, "port").isValidSync(port)}
                        variant="outlined"
                        size="small"
                        fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button type="submit" disabled={!canSubmit} variant="contained" color="primary" fullWidth>Poke 👆</Button>
                </Grid>
            </Grid>
        </Paper>
    </form>
}