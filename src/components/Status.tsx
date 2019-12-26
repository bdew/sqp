import React from "react";
import { Paper, Grid, Theme, makeStyles } from "@material-ui/core";
import SuccessIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";
import ErrorIcon from "@material-ui/icons/Cancel";
import clsx from "clsx";

interface Props {
    status: "success" | "warning" | "error";
    start?: JSX.Element;
    end?: JSX.Element;
    text: string | JSX.Element;
}

const useStyles = makeStyles((theme: Theme) => ({
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
    const classes = useStyles();
    return <Paper className={clsx(classes.paper, classes[status])}>
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