'use client';

import { useContext, useState, useEffect } from 'react';
import { useRouter, usePathname  } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import './style.css';
import LangToggler from '../LangToggler';
import { useTranslation } from 'react-i18next';
import { BurgerMenu, Logout, Moon, Sun } from '@/svgs';

interface User {
    name?: string;
    avatar?: string;
}

const Header = ({ name, avatar }: User) => {
    const { userAuth, logOut } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();

    const router = useRouter();
    const pathname = usePathname();
    const isMainOrProfilePage = pathname === '/' || pathname === '/profile' || pathname === '/stats';


    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleDrawer = () => setDrawerOpen(prev => !prev);

    return (
        <header className="header" data-theme={theme}>
            <img className="logo" src="./imgs/logo.png" alt="Sidekick-logo" />
            <LangToggler />

            {isMainOrProfilePage && (
                isMobile ? (
                    <>
                        <button onClick={toggleDrawer} className="burger">
                            <BurgerMenu />
                        </button>
                        {drawerOpen && <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />}
                        <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
                            <div className="drawer-header">
                                <img className="drawer-logo" src="./imgs/logo.png" alt="Sidekick-logo" />
                                {userAuth && (
                                    <div className="drawer-user">
                                        <img
                                            src={avatar || './imgs/default-avatar.jpg'}
                                            alt="User avatar"
                                            className="drawer-avatar"
                                        />
                                        <button onClick={logOut}><Logout /></button>
                                    </div>
                                )}
                                <button onClick={toggleTheme} className="theme-toggle">
                                    {theme === 'light' ? <Moon /> : <Sun />}
                                </button>
                            </div>

                            {!userAuth ? (
                                <>
                                    <button onClick={() => router.push('/sign-up')}>{t('signUp')}</button>
                                    <button onClick={() => router.push('/sign-in')}>{t('signIn')}</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => router.push('/profile')}>{t('profileLink')}</button>
                                    <button onClick={() => router.push('/stats')}>{t('statsLink')}</button>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    !userAuth ? (
                        <div className="sign-buttons">
                            <button onClick={toggleTheme} className="theme-toggle">
                                {theme === 'light' ? <Moon /> : <Sun />}
                            </button>
                            <button onClick={() => router.push('/sign-up')}>{t('signUp')}</button>
                            <button onClick={() => router.push('/sign-in')}>{t('signIn')}</button>
                        </div>
                    ) : (
                        <div className="user-info">
                            <button onClick={toggleTheme} className="theme-toggle">
                                {theme === 'light' ? <Moon /> : <Sun />}
                            </button>
                            <div className="profile-link" onClick={() => router.push('/profile')}>
                                <img src={avatar || './imgs/default-avatar.jpg'} alt="User avatar" className="avatar" />
                                <p>{name}</p>
                            </div>
                            <button onClick={logOut}><Logout /></button>
                        </div>
                    )
                )
            )}
        </header>
    );
};

export default Header;
