import React from "react";
import { Paper, Grid, Theme } from "@mui/material";
import SuccessIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Cancel";
import { makeStyles } from "../makeStyles";

interface Props {
    status: "success" | "warning" | "error";
    start?: JSX.Element;
    end?: JSX.Element;
    text: string | JSX.Element;
}

const useStyles = makeStyles()((theme: Theme) => ({
    paper: {
        padding: 10,
        marginTop: 10,
    },
    success: {
        backgroundColor: theme.palette.success.dark
    },
    warning: {
        backgroundColor: theme.palette.warning.dark
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    grow: {
        flexGrow: 1
    },
    icon: {
        width: "1.5em",
        height: "1.5em",
        display: "block"
    }
}))

export const Status: React.FC<Props> = ({ status, text, start, end }) => {
    const { classes, cx } = useStyles();
    return <Paper className={cx(classes.paper, classes[status])}>
        <Grid container spacing={1} alignItems="center" wrap="nowrap">
            <Grid item>
                {status === "success" && <SuccessIcon className={classes.icon} />}
                {status === "warning" && <WarningIcon className={classes.icon} />}
                {status === "error" && <ErrorIcon className={classes.icon} />}
            </Grid>
            {start && <Grid item>{start}</Grid>}
            <Grid item className={classes.grow}>{text}</Grid>
            {end && <Grid item>{end}</Grid>}
        </Grid>
    </Paper>
}