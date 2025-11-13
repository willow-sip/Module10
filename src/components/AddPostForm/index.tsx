'use client';

import React, { useContext, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { AuthContext } from '@/context/AuthContext';
import { showNotification } from '@/components/notify';
import { useTranslation } from 'react-i18next';
import { Envelope, Pencil, UploadFile } from '@/svgs';
import { useMutation  } from '@tanstack/react-query';
import './style.css';

interface Props {
    close: () => void;
    postCreated: () => void;
}

const AddPostForm = ({ close, postCreated }: Props) => {
    const { theme } = useTheme();
    const { token } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const { t } = useTranslation();


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 10 * 1024 * 1024) {
                showNotification(t('fileSizeExceeded'), 'error', 3000);
                return;
            }
            
            const fileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!fileTypes.includes(selectedFile.type)) {
                showNotification(t('invalidFileType'), 'error', 3000);
                return;
            }
            
            setFile(selectedFile);
        }
    };

    const addPostLogic = async () => {
        if (!token) {
            showNotification(t('unAutorized'), 'error', 3000);
            return;
        }

        const formData: { title: string; content: string; image?: File } = {
            title: title,
            content: description,
        };

        if (file) {
            formData.image = file;
        }
        
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            showNotification('Failed to create a post.', 'error', 3000);
        }

        return response.json();
    };

    const { mutate } = useMutation({
        mutationFn: addPostLogic,
        onSuccess: () => {
            showNotification(t('postCreated'), 'success', 3000);
            postCreated();
            setTitle('');
            setDescription('');
            setFile(null);
            close();
        },
        onError: () => {
            showNotification(t('postNotCreated'), 'error', 3000);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim()) {
            showNotification(t('inputPostTitle'), 'warning', 2000);
            return;
        }
        if (!description.trim()) {
            showNotification(t('inputPostDesc'), 'warning', 2000);
            return;
        }

        mutate();
    };

    return (
        <div className="blur" data-theme={theme}>
            <div className="form-container">
                <div className="form-header">
                    <h2>{t('createNewPost')}</h2>
                    <button className="close-form-button" onClick={close}>×</button>
                </div>

                <form id="add-post" onSubmit={handleSubmit}>
                    <div className="form-group title">
                        <label htmlFor="postTitle">
                            <Envelope />
                            <p>{t('postTitle')}</p>
                        </label>
                        <input
                            id="postTitle"
                            type="text"
                            placeholder={t('postTitlePlaceholder')}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            <Pencil />
                            <p>{t('description')}</p>
                        </label>
                        <textarea
                            id="description"
                            placeholder={t('descriptionPlaceholder')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="upload-area">
                        <UploadFile />
                        <div className="upload-content">
                            <p>{file ? `Uploaded file: ${file.name}.` : t('uploadFile')}</p>
                            <p className="file-types">{t('fileTypes')}</p>
                        </div>
                        <input
                            type="file"
                            accept=".jpg,.png,.pdf"
                            onChange={handleFileChange}
                            className="file-input"
                        />
                    </div>
                    <div className="create-post-container">
                        <button type="submit" className="create-btn">{t('create')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default React.memo(AddPostForm);