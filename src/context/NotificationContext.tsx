import React, { Component, createContext, ReactNode } from 'react';
import Notification from '../components/Notification';


interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'warning';
  isVisible: boolean;
  autoHide: number | null;
}

interface Props {
  showNotification: (message: string, type: 'success' | 'error' | 'warning', autoHide?: number) => void;
}

export const NotificationContext = createContext<Props>({
  showNotification: () => {},
});

export class NotificationContextClass extends React.Component<{children: ReactNode}, NotificationState> {
    constructor(props: {children: ReactNode}) {
        super(props);
        this.state = {
            message: '',
            type: 'success',
            isVisible: false,
            autoHide: 4000,
        };
    }

    private clearTimer = () => {
        if (this.state.autoHide !== null) {
            clearTimeout(this.state.autoHide);
        }
    };

    showNotification = (
        message: string,
        type: 'success' | 'error' | 'warning',
        duration?: number
    ) => {
        this.clearTimer();

        this.setState({
            message,
            type,
            isVisible: true,
            autoHide: null,
        });

        const timer = window.setTimeout(() => {
            this.hideNotification();
        }, duration ?? 4000);

        this.setState({ autoHide: timer });
    };

    hideNotification = () => {
        this.clearTimer();
        this.setState({
            isVisible: false,
            autoHide: null,
        });
    };

    componentWillUnmount() {
        this.clearTimer();
    }

    render() {
        const { children } = this.props;
        const { message, type, isVisible } = this.state;

        return (
            <NotificationContext.Provider value={{ showNotification: this.showNotification }}>
                {children}
                <Notification
                    message={message}
                    type={type}
                    isVisible={isVisible}
                    close={this.hideNotification}
                />
            </NotificationContext.Provider>
        );
    }
}


export const useNotification = () => {
    const context = React.useContext(NotificationContext);
    if (!context) {
        throw new Error('add NotificationProvider to use useNotification custom hook');
    }
    return context;
};