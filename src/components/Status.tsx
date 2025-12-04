import ErrorIcon from "@mui/icons-material/Cancel";
import SuccessIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import React from "react";
import { makeStyles } from "tss-react/mui";

interface Props {
    status: "success" | "warning" | "error";
    start?: React.ReactNode;
    end?: React.ReactNode;
    text: string | React.ReactNode;
}

const useStyles = makeStyles()(theme => ({
    paper: {
        padding: 10,
        marginTop: 10,
    },
    success: {
        backgroundColor: theme.palette.success.dark,
    },
    warning: {
        backgroundColor: theme.palette.warning.dark,
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    grow: {
        flexGrow: 1,
    },
    icon: {
        width: "1.5em",
        height: "1.5em",
        display: "block",
    },
}));

export const Status: React.FC<Props> = ({ status, text, start, end }) => {
    const { classes, cx } = useStyles();
    return (
        <Paper className={cx(classes.paper, classes[status])}>
            <Grid container spacing={1} alignItems="center" wrap="nowrap">
                <Grid>
                    {status === "success" && <SuccessIcon className={classes.icon} />}
                    {status === "warning" && <WarningIcon className={classes.icon} />}
                    {status === "error" && <ErrorIcon className={classes.icon} />}
                </Grid>
                {start && <Grid>{start}</Grid>}
                <Grid className={classes.grow}>{text}</Grid>
                {end && <Grid>{end}</Grid>}
            </Grid>
        </Paper>
    );
};
