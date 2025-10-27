import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import './style.css';

interface User {
    avatar?: string;
}

const AddPost = ({ avatar } : User) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div id="addPost" data-theme={theme}>
            <div>
                <img
                    src={avatar || './imgs/default-avatar.jpg'}
                    alt="User avatar"
                    className="avatar"
                />
                <p>What's happening?</p>
            </div>
            <button>Tell everyone</button>
        </div>
    );
};

export default AddPost;