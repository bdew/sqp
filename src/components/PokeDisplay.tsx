import React, { useState, useEffect } from "react";
import { PokeResult } from "../api-types";
import { LinearProgress } from "@mui/material";
import { DecodedView } from "./DecodedView";
import { Status } from "./Status";
import { HexView } from "./HexView";
import { makeStyles } from "tss-react/mui";

interface Props {
    promise: Promise<PokeResult>;
}

const useStyles = makeStyles()({
    prog: {
        height: 10,
        marginTop: -3,
    },
});

export const PokeDisplay: React.FC<Props> = ({ promise }) => {
    const { classes } = useStyles();
    const [result, setResult] = useState<PokeResult>();

    useEffect(() => {
        setResult(undefined);
        promise.then(setResult);
    }, [promise]);

    if (result) {
        return (
            <>
                {result.status === "ok" && <Status status="success" text={`Server responded after ${result.time.toFixed(0)}ms${result.challenge && " (after challenge)"}`} />}
                {result.status === "nodecode" && <Status status="warning" text={`Server responded after ${result.time.toFixed(0)}ms but decoding failed (${result.error})`} />}
                {result.status === "error" && <Status status="error" text={result.error} />}
                {result.status === "ok" && <DecodedView data={result.decoded} />}
                {result.status !== "error" && <HexView data={Buffer.from(result.raw, "hex")} />}
            </>
        );
    } else {
        return <LinearProgress className={classes.prog} variant="indeterminate" />;
    }
};
