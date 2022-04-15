import React from "react";
import { Decoded } from "../api-types";
import { Paper, Grid } from "@mui/material";
import { makeStyles } from "../makeStyles";

interface Props {
    data: Decoded;
}

const useStyles = makeStyles()({
    paper: {
        padding: 10,
        marginTop: 10,
    },
    row: {
        padding: 6,
        borderBottom: "solid #999 1px"
    },
    label: {
        fontWeight: "bold"
    },
    data: {
        wordBreak: "break-all"
    }
})

interface RowProps {
    name: string | JSX.Element;
    val: string | JSX.Element;
}

const DataRow: React.FC<RowProps> = ({ name, val }) => {
    const { classes } = useStyles();
    return <Grid container className={classes.row}>
        <Grid item md={2} xs={12} className={classes.label}>{name}</Grid>
        <Grid item md={10} xs={12} className={classes.data}>{val}</Grid>
    </Grid>
}

export const DecodedView: React.FC<Props> = ({ data }) => {
    const { classes } = useStyles();
    return <Paper className={classes.paper}>
        <DataRow name="Game:" val={<>{data.game} ({data.gameId})</>} />
        <DataRow name="Name:" val={data.name} />
        <DataRow name="Map:" val={data.map} />
        <DataRow name="Folder:" val={data.folder} />
        <DataRow name="Players:" val={<>{data.players} / {data.maxPlayers} {data.bots > 0 && `+ ${data.bots} bots`}</>} />
        <DataRow name="Type:" val={data.type} />
        <DataRow name="Environment:" val={data.env} />
        <DataRow name="Visibility:" val={data.visibility} />
        <DataRow name="VAC:" val={data.vac ? "On" : "Off"} />
        <DataRow name="Version:" val={data.version} />
        {data.port && <DataRow name="Game Port:" val={data.port.toString()} />}
        {data.keywords && <DataRow name="Keywords:" val={data.keywords} />}
        {data.steamId && <DataRow name="Steam ID:" val={data.steamId} />}
    </Paper>
}