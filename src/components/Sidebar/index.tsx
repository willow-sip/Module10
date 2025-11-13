'use client';

import React, { Component } from 'react';
import { useTheme } from '@/context/ThemeContext';
import './style.css';

import { User, Group } from '@/data/datatypes';
import enableAuth from '../AuthHoc';

interface SidebarProps {
    t: (key: string) => string;
    user: User | null;
    token: string | null;
    userAuth: boolean;
}

interface SidebarState {
    groups: Group[];
    suggestedUsers: User[];
    loading: boolean;
}


const fetchGroups = async (token: string): Promise<Group[]> => {
    const query = `
    query {
      allGroups {
        id
        title
        membersCount
        photo
      }
    }
  `;

    const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.errors) {
        console.error('Error fetching groups:', data.errors);
    }
    return data.data.allGroups;
};

const fetchSuggestedUsers = async (token: string): Promise<User[]> => {
    const response = await fetch('/api/getSuggested', {
        headers: { Authorization: `Bearer ${token}`, },
    });

    const data = await response.json();

    if (data.errors) {
        console.error('Error fetching users:', data.errors);
    }

    return data;
}

class Sidebar extends Component<SidebarProps, SidebarState> {
    constructor(props: SidebarProps) {
        super(props);
        this.state = {
            groups: [],
            suggestedUsers: [],
            loading: true,
        };
    }

    componentDidMount() {
        const { token } = this.props;

        if (token) {
            Promise.all([
                fetchGroups(token),
                fetchSuggestedUsers(token)
            ])
                .then(([groups, suggestedUsers]) => {
                    this.setState({ groups, suggestedUsers, loading: false });
                })
                .catch(error => {
                    console.error('HTTP error!', error);
                    this.setState({ loading: false });
                });
        }
    }

    render() {
        const { groups, suggestedUsers } = this.state;
        const t = this.props.t;
        const theme = useTheme.getState().theme;

        return (
            <aside className="sidebar" data-theme={theme}>
                <div className="recPeople">
                    <h4>{t('sugPeople')}</h4>
                    {this.state.loading ? (<p>{t('loadSugPeople')}</p>) : (
                        <>
                            {suggestedUsers?.map(user => (
                                <div className="person" key={user.id}>
                                    <img
                                        src={`${user.profileImage}` || './imgs/default-avatar.jpg'}
                                        alt="Person avatar"
                                        className="avatar"
                                    />
                                    <div className="personalInfo">
                                        <p>{user.firstName} {user.secondName}</p>
                                        <small>@{user.username}</small>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <div className="recCommunities">
                    <h4>{t('sugGroups')}</h4>
                    {this.state.loading ? (<p>{t('loadSugGroups')}</p>) : (
                        <>
                            {groups.map(group => (
                                <div className="community" key={group.id}>
                                    <img
                                        src={group.photo}
                                        alt="Community avatar"
                                        className="avatar"
                                    />
                                    <div className="communityInfo">
                                        <p>{group.title}</p>
                                        <small>{group.membersCount} {t('members')}</small>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </aside>
        );
    }
}

export default enableAuth(Sidebar);
