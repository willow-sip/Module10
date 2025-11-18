'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './style.css';
import { Cross, SuccessCheck, Warning } from '@/svgs';

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
                    {type === 'success' && <SuccessCheck />}
                    {type === 'error' && <Cross />}
                    {type === 'warning' && <Warning />}
                </span>
                <p className="notification-message">{message}</p>
                <button data-testid="close-button" className="notification-close" onClick={close}>×</button>
            </div>
        </div>
    );

    const portalRoot = typeof window !== 'undefined'
        ? document.getElementById('notification-root')
        : null;

    return portalRoot ? createPortal(notificationElement, portalRoot) : null;
};

export default Notification;
