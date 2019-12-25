import React, { useState, useCallback, useEffect, FormEvent, ClipboardEvent, useMemo } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { PokeTarget, pokeTargetSchema } from "../api-types";
import * as yup from "yup";

interface Props {
    startPoke: (target: PokeTarget) => void;
    block: boolean;
}

const useStyles = makeStyles({
    paper: {
        padding: 10
    },
})

export const PokeForm: React.FC<Props> = ({ startPoke, block }) => {
    const classes = useStyles();
    const router = useRouter();
    const [server, setServer] = useState("");
    const [port, setPort] = useState("");

    useEffect(() => {
        if (router.query["s"]) setServer(router.query["s"] as string)
        if (router.query["p"]) setPort(router.query["p"] as string)
    }, [router])

    const canSubmit = useMemo(() => {
        return !block && pokeTargetSchema.isValidSync({ server, port });
    }, [server, port, block])

    const submit = useCallback((ev: FormEvent) => {
        if (!canSubmit) return;
        router.push("/", `/?s=${encodeURIComponent(server)}&p=${encodeURIComponent(port)}`)
        startPoke({ server, port: parseInt(port) });
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
            <Grid container justify="center" alignItems="center" spacing={2}>
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