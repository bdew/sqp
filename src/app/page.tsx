"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React, { Suspense, useActionState } from "react";
import { makeStyles } from "tss-react/mui";
import { pokeAction } from "../actions/poke";
import { PokeResult, PokeTarget } from "../api-types";
import { GithubBadge } from "../components/GithubBadge";
import { PokeDisplay } from "../components/PokeDisplay";
import { PokeForm } from "../components/PokeForm";

const useStyles = makeStyles()({
    title: {
        textAlign: "center",
        fontSize: 30,
        padding: 20,
    },
});

export default function Index(): React.ReactNode {
    const { classes } = useStyles();

    const [result, startPoke, pending] = useActionState<PokeResult | null, PokeTarget>(async (_, target) => {
        try {
            return await pokeAction(target);
        } catch (err) {
            console.error(err);
            return { status: "error", error: `${err}` };
        }
    }, null);

    return (
        <Container maxWidth="md">
            <GithubBadge slug="bdew/sqp" fill="white" />
            <Typography variant="h1" className={classes.title}>Steam Query Poke</Typography>
            <Suspense>
                <PokeForm startPoke={startPoke} block={pending} />
                <PokeDisplay result={result} pending={pending} />
            </Suspense>
        </Container>
    );
}
