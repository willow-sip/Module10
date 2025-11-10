import { createRoot } from 'react-dom/client';
import Notification from '@/components/Notification';

let id = 0;

export const showNotification = (message: string, type: 'success' | 'error' | 'warning', autoHide: number = 4000) => {
    const container = document.createElement('div');
    container.id = `notification-${++id}`;
    document.getElementById('notification-root')?.appendChild(container);

    const root = createRoot(container);
    const close = () => {
        root.unmount();
        container.remove();
    };

    root.render(
        <Notification
            message={message}
            type={type}
            isVisible={true}
            close={close}
            autoHide={autoHide}
        />
    );

    return close;
};