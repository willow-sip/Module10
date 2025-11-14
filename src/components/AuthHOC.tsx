import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '@/store';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

interface AuthProps {
    user: RootState['auth']['user'];
    userAuth: RootState['auth']['userAuth'];
    t: TFunction; 
}

const enableAuth = <T extends object>(
    Component: React.ComponentType<T & AuthProps>
) => {
    const ComponentWithT = withTranslation()(Component as any);

    return connect((state: RootState) => ({
        user: state.auth.user,
        userAuth: state.auth.userAuth,
    }))(ComponentWithT);
};

export default enableAuth;