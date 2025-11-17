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
                        src={avatar || './imgs/default-avatar.jpg'}
                        alt="User avatar"
                        className="avatar"
                    />
                    <p>{t('whatsHappening')}</p>
                </div>
                <button onClick={() => setShowForm(true)}>{t('tellEveryone')}</button>
            </div>

            {showForm && <AddPostForm close={() => setShowForm(false)} postCreated={postCreated}/>}
        </>
    );
};

export default AddPost;