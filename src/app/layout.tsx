import { Poppins } from 'next/font/google';
import { Providers } from './providers';
import { Metadata } from 'next';
import AppContainer from '@/components/AppContainer';
import './globals.css';

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Social Media App',
    description: 'Social media application created with React and Next.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={poppins.className}>
            <head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" />
            </head>
            <body>
                <Providers>
                    <div id="root">
                        <div id="notification-root" />
                        <AppContainer>{children}</AppContainer>
                    </div>
                </Providers>
            </body>
        </html>
    );
}