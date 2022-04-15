import { createMakeStyles } from "tss-react";
import theme from "./theme";

export const {
    makeStyles,
} = createMakeStyles({ useTheme: () => theme });