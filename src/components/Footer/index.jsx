import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import './style.css';

const Footer = () => {
    const { theme } = useContext(AppContext);
    return (
        <header className="footer" data-theme={theme}>
            <p>© 2024 sidekick</p>
        </header>
    );
}

export default Footer;
