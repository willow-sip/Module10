import React, { Component } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import './style.css';

import { User, Group } from '../../data/datatypes';

let groups: Group[];
let suggestedUsers: User[];

fetch('http://localhost:3000/api/groups')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        groups = data;
    })
    .catch(error => {
        console.error(error);
    });

fetch('http://localhost:3000/api/getSuggested')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        suggestedUsers = data;
    })
    .catch(error => {
        console.error(error);
    });



class Sidebar extends Component {
    static contextType = ThemeContext;
    context!: React.ContextType<typeof ThemeContext>;

    render() {
        const { theme } = this.context;

        return (
            <aside className="sidebar" data-theme={theme}>
                <div className="recPeople">
                    <h4>Suggested people</h4>
                    {suggestedUsers.map((user, i) => (
                        <div className="person" key={user.id}>
                            <img
                                src={user.profileImage || './imgs/default-avatar.jpg'}
                                alt="Person avatar"
                                className="avatar"
                            />
                            <div className="personalInfo">
                                <p>{user.firstName} {user.secondName}</p>
                                <small>{user.username}</small>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="recCommunities">
                    <h4>Communities you might like</h4>
                    {groups.map((group, i) => (
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
        );
    }
}

export default Sidebar;
