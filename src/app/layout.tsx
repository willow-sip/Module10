'use client';

import { Poppins } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin']
});


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={poppins.className} >
            <head>
                <title>Social Media App</title>
                <meta name="description" content="Social media application created using Next.js" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" />
            </head>
            <body>
                <Providers>
                    <div id="root">
                        <div id="notification-root" />
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    )
};