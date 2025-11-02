import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import './style.css';

interface User {
    name?: string;
    avatar?: string;
}

const Header = ({ name, avatar }: User) => {
    const { userAuth, logOut } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const navigate = useNavigate();
    const location = useLocation();
    const isMainOrProfilePage = (location.pathname === '/') || (location.pathname === '/profile') || (location.pathname === '/stats');

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleDrawer = () => setDrawerOpen(prev => !prev);

    return (
        <header className="header" data-theme={theme}>
            <img className="logo" src="./imgs/logo.png" alt="Sidekick-logo" />

            {isMainOrProfilePage && (
                isMobile ? (
                    <>
                        <button onClick={toggleDrawer} className="burger">
                            <i className="bi bi-list" />
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
                                        <button onClick={logOut}><i className="bi bi-box-arrow-right" /></button>
                                    </div>
                                )}
                                <button onClick={toggleTheme} className="theme-toggle">
                                    {theme === 'light' ? <i className="bi bi-moon-fill" /> : <i className="bi bi-sun-fill" />}
                                </button>
                            </div>

                            {!userAuth ? (
                                <>
                                    <button onClick={() => navigate('/sign-up')}>Sign Up</button>
                                    <button onClick={() => navigate('/sign-in')}>Sign In</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => navigate('/profile')}>Profile Info</button>
                                    <button onClick={() => navigate('/stats')}>Statistics</button>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    !userAuth ? (
                        <div className="sign-buttons">
                            <button onClick={toggleTheme} className="theme-toggle">
                                {theme === 'light' ? <i className="bi bi-moon-fill" /> : <i className="bi bi-sun-fill" />}
                            </button>
                            <button onClick={() => navigate('/sign-up')}>Sign Up</button>
                            <button onClick={() => navigate('/sign-in')}>Sign In</button>
                        </div>
                    ) : (
                        <div className="user-info">
                            <button onClick={toggleTheme} className="theme-toggle">
                                {theme === 'light' ? <i className="bi bi-moon-fill" /> : <i className="bi bi-sun-fill" />}
                            </button>
                            <div className="profile-link" onClick={() => navigate('/profile')}>
                                <img src={avatar || './imgs/default-avatar.jpg'} alt="User avatar" className="avatar" />
                                <p>{name}</p>
                            </div>
                            <button onClick={logOut}><i className="bi bi-box-arrow-right" /></button>
                        </div>
                    )
                )
            )}
        </header>
    );
};

export default Header;
