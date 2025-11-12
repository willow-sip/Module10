'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './style.css';

interface Props {
    message: string;
    type: 'success' | 'error' | 'warning';
    isVisible: boolean;
    close: () => void;
    autoHide?: number;
}

const Notification = ({ message, type, isVisible = false, close, autoHide = 4000 }: Props) => {
    useEffect(() => {
        if (!isVisible) return;

        const timer = setTimeout(() => {
            close();
        }, autoHide);

        return () => clearTimeout(timer);
    }, [isVisible, autoHide, close]);

    if (!isVisible) return null;

    const notificationElement = (
        <div className={`notification notification-${type}`}>
            <div className="notification-content">
                <span className="notification-icon">
                    {type === 'success' && <i className="bi bi-check-circle-fill" />}
                    {type === 'error' && <i className="bi bi-x-lg" />}
                    {type === 'warning' && <i className="bi bi-exclamation-circle-fill" />}
                </span>
                <p className="notification-message">{message}</p>
                <button className="notification-close" onClick={close}>×</button>
            </div>
        </div>
    );

    const portalRoot = typeof window !== 'undefined'
        ? document.getElementById('notification-root')
        : null;

    return portalRoot ? createPortal(notificationElement, portalRoot) : null;
};

export default Notification;
