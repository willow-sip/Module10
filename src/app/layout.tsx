import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import { Providers } from './providers';
import { MSWWrapper } from '@/components/MswWrapper'
import './globals.css';

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin']
});

export const metadata: Metadata = {
    title: 'Social Media App',
    description: 'Social media application created using Next.js',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={poppins.className} >
            <head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" />
            </head>
            <body>
                <Providers>
                    <div id="root">
                        <MSWWrapper>{children}</MSWWrapper>
                    </div>
                </Providers>
            </body>
        </html>
    )
};