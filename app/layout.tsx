import type {Metadata} from "next";
import './index.css'


export const metadata: Metadata = {
    title: "Admin",
    description: "Admin dashboard",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {

    return (
        <html lang="en">
        <body className={'min-h-screen'}>
        {children}
        </body>
        </html>
    );
}
