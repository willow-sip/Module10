import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './styles/Header.css';

const Header = ({ user }) => {
    const { theme, toggleTheme, userAuth, logOut } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const isMainPage = location.pathname === '/';

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleDrawer = () => setDrawerOpen(prev => !prev);

    return (
        <header className="header" data-theme={theme}>
            <img className="logo" src="./imgs/logo.png" alt="Sidekick-logo" />

            {isMainPage && (
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
                                            src={user.avatar || './imgs/default-avatar.jpg'}
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
                            <img src={user.avatar || './imgs/default-avatar.jpg'} alt="User avatar" className="avatar" />
                            <p>{user.name}</p>
                            <button onClick={logOut}><i className="bi bi-box-arrow-right" /></button>
                        </div>
                    )
                )
            )}
        </header>
    );
};

export default Header;
