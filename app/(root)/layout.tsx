import React from "react";

interface Props {
    children: React.ReactNode
}

export default async function SetupLayout({children}: Props) {

    return (
        <>
            {children}
        </>
    );
}