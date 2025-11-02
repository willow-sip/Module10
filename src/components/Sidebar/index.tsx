import React, { Component } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import './style.css';

import { User, Group } from '../../data/datatypes';

interface SidebarState {
    groups: Group[];
    suggestedUsers: User[];
}

class Sidebar extends Component<{}, SidebarState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;

    constructor(props: {}) {
        super(props);
        this.state = {
            groups: [],
            suggestedUsers: [],
        };
    }

    componentDidMount() {
        const { token } = this.context;

        if (token) {
            fetch('http://localhost:3000/api/groups', {
                headers: {
                    Authorization: `${token}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data: Group[]) => {
                    this.setState({ groups: data });
                })
                .catch(error => {
                    console.error('Error fetching groups:', error);
                });

            fetch('http://localhost:3000/api/getSuggested', {
                headers: {
                    Authorization: `${token}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data: User[]) => {
                    this.setState({ suggestedUsers: data });
                })
                .catch(error => {
                    console.error('Error fetching suggested users:', error);
                });
        }

    }

    render() {
        const { groups, suggestedUsers } = this.state;

        return (

            <ThemeContext.Consumer>
                {theme => (
                    <aside className="sidebar" data-theme={theme}>
                        <div className="recPeople">
                            <h4>Suggested people</h4>
                            {suggestedUsers.map(user => (
                                <div className="person" key={user.id}>
                                    <img
                                        src={`http://localhost:3000${user.profileImage}` || './imgs/default-avatar.jpg'}
                                        alt="Person avatar"
                                        className="avatar"
                                    />
                                    <div className="personalInfo">
                                        <p>{user.firstName} {user.secondName}</p>
                                        <small>@{user.username}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="recCommunities">
                            <h4>Communities you might like</h4>
                            {groups.map(group => (
                                <div className="community" key={group.id}>
                                    <img
                                        src={group.photo}
                                        alt="Community avatar"
                                        className="avatar"
                                    />
                                    <div className="communityInfo">
                                        <p>{group.title}</p>
                                        <small>{group.membersCount} members</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                )}
            </ThemeContext.Consumer>
        );
    }
}

export default Sidebar;
