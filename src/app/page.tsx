import React from "react";
import Index from "./page.client";

interface PageProps {
    searchParams: Promise<{
        s: string;
        p: string;
    }>;
}

export default async function Page(props: PageProps): Promise<React.ReactElement> {
    const search = await props.searchParams;

    return (
        <Index
            server={search?.s}
            port={search?.p}
        />
    );
}
