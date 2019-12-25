import React, { useMemo } from "react";
import { makeStyles, Paper } from "@material-ui/core";

interface Props {
    data: Buffer;
}

const useStyles = makeStyles({
    paper: {
        padding: 10,
        marginTop: 10,
        whiteSpace: "pre",
        fontFamily: "monospace",
        fontSize: 16,
        overflowX: "auto"
    },
})


function dump(buff: Buffer): string {
    const slices = Math.floor((buff.length + 15) / 16);
    const out: string[] = []
    for (let i = 0; i < slices; i++) {
        const chunk = buff.slice(i * 16, (i + 1) * 16);
        const hex: string[] = [];
        for (let j = 0; j < 16 && j < chunk.length; j++) {
            if (j % 4 === 0) hex.push("  ");
            hex.push(chunk[j].toString(16).padStart(2, "0"));
        }
        out.push(hex.join(" ").padEnd(60, " ") + " | " + Buffer.from(chunk.map(c => c > 16 && c < 127 ? c : 46)).toString("ascii"))

    }
    return out.join("\n");
}

export const HexView: React.FC<Props> = ({ data }) => {
    const classes = useStyles();
    const content = useMemo(() => dump(data), [data]);
    return <Paper className={classes.paper}>
        {content}
    </Paper>
}