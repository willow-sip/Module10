'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './style.css';

import dynamic from 'next/dynamic';

const AddPostForm = dynamic(() => import('../AddPostForm'), {
    loading: () => <p>Loading form to add a post...</p>, 
    ssr: false, 
});

interface Props {
    avatar?: string;
    postCreated: () => void;
}

const AddPost = ({ avatar, postCreated } : Props) => {
    const { theme } = useTheme();
    const [showForm, setShowForm] = useState(false);
    const { t } = useTranslation();

    return (
        <>
        <div id="addPost" data-theme={theme}>
            <div>
                <img
                        data-testid="user-avatar"
                        src={avatar || './imgs/default-avatar.jpg'}
                        alt="User avatar"
                        className="avatar"
                    />
                    <p data-testid="whats-happening">{t('whatsHappening')}</p>
                </div>
                <button data-testid="tell-everyone" onClick={() => setShowForm(true)}>{t('tellEveryone')}</button>
            </div>

            {showForm && <AddPostForm data-testid="add-post-form" close={() => setShowForm(false)} postCreated={postCreated}/>}
        </>
    );
};

export default AddPost;