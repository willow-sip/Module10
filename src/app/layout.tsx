'use client';

import { Poppins } from 'next/font/google';
import { Providers } from './providers';
import i18n from '@/i18next';
import './globals.css';
import { useEffect } from 'react';

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        const updateHtmlLang = () => {
            document.documentElement.lang = i18n.language;
        };
        updateHtmlLang();
        i18n.on('languageChanged', updateHtmlLang);

        return () => {
            i18n.off('languageChanged', updateHtmlLang);
        };
    }, []);

    return (
        <html lang="en" className={poppins.className}>
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
    );
}