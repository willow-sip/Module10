import React, { Component } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import './style.css';

class Sidebar extends Component {
    static contextType = ThemeContext;

    render() {
        const { theme } = this.context;
        const { recPeople, recCommunities } = this.props;

        return (
            <aside className="sidebar" data-theme={theme}>
                <div className="recPeople">
                    <h4>Suggested people</h4>
                    {recPeople.map((person, index) => (
                        <div className="person" key={index}>
                            <img
                                src={person.avatar || './imgs/default-avatar.jpg'}
                                alt="Person avatar"
                                className="avatar"
                            />
                            <div className="personalInfo">
                                <p>{person.name}</p>
                                <small>{person.nickname}</small>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="recCommunities">
                    <h4>Communities you might like</h4>
                    {recCommunities.map((community, index) => (
                        <div className="community" key={index}>
                            <img
                                src={community.avatar || './imgs/default-avatar.jpg'}
                                alt="Community avatar"
                                className="avatar"
                            />
                            <div className="communityInfo">
                                <p>{community.name}</p>
                                <small>{community.members} members</small>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        );
    }
}

export default Sidebar;
