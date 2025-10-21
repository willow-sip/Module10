import React, {useContext} from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import './style.css';

const AddPost = ({ user }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <form action='#' id='addPostForm' data-theme={theme}>
            <div>
                <img src={user.avatar || './imgs/default-avatar.jpg'} alt='User avatar' className='avatar' />
                <p>What's happening?</p>
            </div>
            <button>Tell everyone</button>
        </form>
    );
};

export default AddPost;
