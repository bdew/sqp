import LinearProgress from "@mui/material/LinearProgress";
import React from "react";
import { makeStyles } from "tss-react/mui";
import { PokeResult } from "../api-types";
import { DecodedView } from "./DecodedView";
import { HexView } from "./HexView";
import { Status } from "./Status";

interface Props {
    result: PokeResult | null;
    pending: boolean;
}

const useStyles = makeStyles()({
    prog: {
        height: 10,
        marginTop: -3,
    },
});

export const PokeDisplay: React.FC<Props> = ({ result, pending }) => {
    const { classes } = useStyles();
    if (pending) {
        return <LinearProgress className={classes.prog} variant="indeterminate" />;
    } else if (result) {
        return (
            <>
                {result.status === "ok" && <Status status="success" text={`Server responded after ${result.time.toFixed(0)}ms${result.challenge && " (after challenge)"}`} />}
                {result.status === "nodecode" && <Status status="warning" text={`Server responded after ${result.time.toFixed(0)}ms but decoding failed (${result.error})`} />}
                {result.status === "error" && <Status status="error" text={result.error} />}
                {result.status === "ok" && <DecodedView data={result.decoded} />}
                {result.status !== "error" && <HexView data={Buffer.from(result.raw, "hex")} />}
            </>
        );
    }
};
