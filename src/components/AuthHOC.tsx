import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '@/store';

interface AuthProps {
    user: RootState['auth']['user'];
    token: RootState['auth']['token'];
    userAuth: RootState['auth']['userAuth'];
}

const enableAuth = <T extends object>(
    Component: React.ComponentType<T & AuthProps>
) => {
    return connect((state: RootState) => ({
        user: state.auth.user,
        token: state.auth.token,
        userAuth: state.auth.userAuth,
    }))(Component as React.ComponentType);
};
export default enableAuth;