import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import './style.css';

const Footer = () => {
    const { theme } = useContext(ThemeContext);
    return (
        <header className="footer" data-theme={theme}>
            <p>© 2024 sidekick</p>
        </header>
    );
}

export default Footer;
