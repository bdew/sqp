import React, { useState, useEffect } from "react";
import { PokeResult } from "../api-types";
import { LinearProgress } from "@material-ui/core";
import { DecodedView } from "./DecodedView";
import { Status } from "./Status";
import { HexView } from "./HexView";

interface Props {
    promise: Promise<PokeResult>;
}

export const PokeDisplay: React.FC<Props> = ({ promise }) => {
    const [result, setResult] = useState<PokeResult>();

    useEffect(() => {
        setResult(undefined);
        promise.then(setResult);
    }, [promise])

    if (result) {
        return <>
            {result.status === "ok" && <Status status="success" text={`Server responded after ${result.time.toFixed(0)}ms`} />}
            {result.status === "nodecode" && <Status status="warning" text={`Server responded after ${result.time.toFixed(0)}ms but decoding failed (${result.error})`} />}
            {result.status === "error" && <Status status="error" text={result.error} />}
            {result.status === "ok" && <DecodedView data={result.decoded} />}
            {result.status !== "error" && <HexView data={Buffer.from(result.raw, "hex")} />}
        </>
    } else {
        return <LinearProgress variant="indeterminate" />
    }

}