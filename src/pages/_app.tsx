import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createCache from '@emotion/cache';
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

let muiCache: EmotionCache | undefined = undefined;

export const createMuiCache = (): EmotionCache =>
    muiCache = createCache({ 
        "key": "mui", 
        "prepend": true 
    });


function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <>
      <Head>
        <title>Steam Query Poke</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
      </Head>
      <CacheProvider value={muiCache ?? createMuiCache()}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </MuiThemeProvider>
      </CacheProvider>
    </>
  );
}

export default App