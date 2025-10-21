import React, {useContext} from 'react';
import { AppContext } from '../context/AppContext';
import './styles/AddPost.css';

const AddPost = ({ user }) => {
    const { theme } = useContext(AppContext);

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
