import CssBaseline from "@mui/material/CssBaseline";
import MuiThemeProvider from "@mui/material/styles/ThemeProvider";
import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { createEmotionSsrAdvancedApproach } from "tss-react/next/pagesDir";
import theme from "../theme";

function App({ Component, pageProps }: AppProps): React.ReactElement {
    return (
        <>
            <Head>
                <title>Steam Query Poke</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
            </Head>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...pageProps} />
            </MuiThemeProvider>
        </>
    );
}

const {
    augmentDocumentWithEmotionCache,
    withAppEmotionCache,
} = createEmotionSsrAdvancedApproach({ key: "css" });

export { augmentDocumentWithEmotionCache };

export default withAppEmotionCache(App);
