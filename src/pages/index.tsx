import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React, { useCallback, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { PokeResult, PokeTarget } from "../api-types";
import { GithubBadge } from "../components/GithubBadge";
import { PokeDisplay } from "../components/PokeDisplay";
import { PokeForm } from "../components/PokeForm";
import { callPoke } from "../poke";

const useStyles = makeStyles()({
    title: {
        textAlign: "center",
        fontSize: 30,
        padding: 20,
    },
});

export default function Index(): React.ReactNode {
    const { classes } = useStyles();
    const [poke, setPoke] = useState<Promise<PokeResult>>();
    const [block, setBlock] = useState(false);
    const startPoke = useCallback((target: PokeTarget) => {
        setBlock(true);
        setPoke(callPoke(target).finally(() => setBlock(false)));
    }, []);
    return (
        <Container maxWidth="md">
            <GithubBadge slug="bdew/sqp" fill="white" />
            <Typography variant="h1" className={classes.title}>Steam Query Poke</Typography>
            <PokeForm startPoke={startPoke} block={block} />
            {poke && <PokeDisplay promise={poke} />}
        </Container>
    );
}
