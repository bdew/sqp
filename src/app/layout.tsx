import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import React from "react";
import theme from "../theme";

interface LayoutProps {
    children: React.ReactNode;
}

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
});

export default function RootLayout({ children }: LayoutProps): React.ReactNode {
    return (
        <html lang="en">
            <head></head>
            <body className={roboto.variable}>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        {children}
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}

export const metadata: Metadata = {
    title: "Steam Query Poke",
    description: "Steam Query Poke",
    manifest: "/manifest.json",
    icons: {
        icon: [
            {
                type: "image/png",
                sizes: "32x32",
                url: "/favicon-32x32.png",
            },
            {
                type: "image/png",
                sizes: "16x16",
                url: "/favicon-16x16.png",
            },
        ],
        apple: {
            url: "/apple-touch-icon.png",
            sizes: "180x180",
        },
    },
};

export const viewport: Viewport = {
    themeColor: "#90caf9",
    minimumScale: 1,
    maximumScale: 1,
    initialScale: 1,
    width: "device-width",
};
