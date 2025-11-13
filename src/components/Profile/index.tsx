'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '@/context/ThemeContext';
import { AuthContext } from '@/context/AuthContext';
import { showNotification } from '@/components/notify';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from "react-hook-form";
import './style.css';
import { Envelope, Important, Pencil, Person } from '@/svgs';

interface FormInput {
    username: string;
    email: string;
    description: string;
}

const Profile = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user, updateUser, logOut, token } = useContext(AuthContext);
    const [location, setLocation] = useState<"profile" | "stats">("profile");

    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [description, setDescription] = useState(user?.description || '');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState(user?.profileImage || './imgs/default-avatar.jpg');
    
    const router = useRouter();
    const { t } = useTranslation();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, watch } = useForm<FormInput>({
        defaultValues: {
            username: user?.username || '',
            email: user?.email || '',
            description: user?.description || '',
        },
    });

    useEffect(() => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setPreviewImage(url);
            return () => URL.revokeObjectURL(url);
        } else if (user?.profileImage) {
            setPreviewImage(user.profileImage);
        } else {
            setPreviewImage('./imgs/default-avatar.jpg');
        }
    }, [selectedFile, user?.profileImage]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                showNotification(t('fileSizeExceeded'), 'error', 3000);
                return;
            }

            const fileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!fileTypes.includes(file.type)) {
                showNotification(t('invalidFileType'), 'error', 3000);
                return;
            }
            setSelectedFile(file);
        }
    };

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        const { username, email, description } = data;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification(t('inputValidEmail'), 'warning', 2000);
            return;
        }

        if (!username.trim()) {
            showNotification(t('inputUsername'), 'warning', 2000);
            return;
        }

        if (!email.trim()) {
            showNotification(t('inputEmail'), 'warning', 2000);
            return;
        }

        if (description.trim().length > 200) {
            showNotification(t('descSize'), 'warning', 2000);
            return;
        }
        
        const query = `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
        username
        email
        description
    }
  }
`
        const variables = {
            input: {
                username,
                email,
                description
            },
        };

        try {
            const response = await fetch('/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ query, variables }),
            });

            const result = await response.json();

            if (result.errors) {
                showNotification(t('couldntUpdateProfile'), 'error', 2000);
                console.log(result.errors);
                return;
            }
            updateUser(result.data.updateProfile);
            showNotification(t('updatedProfile'), 'success', 2000);
            reset(data);
        } catch (err) {
            showNotification(t('couldntUpdateProfile'), 'error', 2000);
            return;
        }
    };

    return (
        <>
            <div className="page-switch">
                <button className={location === "profile" ? "active" : ""} onClick={() => { router.push('/profile'); setLocation("profile") }}>Profile Info</button>
                <button className={location === "stats" ? "active" : ""} onClick={() => { router.push('/stats'); setLocation("stats") }}>Statistics</button>
            </div>
            <div className="profile" data-theme={theme}>
                <div className="edit-profile">
                    <h1>{t('editProfile')}</h1>

                    <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="profile-header">
                            <img src={previewImage} alt="Profile" className="avatar" />
                            <div className="profile-info">
                                <h3>{user?.firstName} {user?.secondName}</h3>
                                <label htmlFor="profileImage" className="change-photo">{t('changeProfilePhoto')}</label>
                                <input
                                    type="file"
                                    id="profileImage"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">
                                <Person />
                                <p>{t('username')}</p>
                            </label>
                            <input
                                type="text"
                                id="username"
                                placeholder="@username123"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="form-group">                            
                            <label htmlFor="email">
                                <Envelope />
                                <p>{t('email')}</p>
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="email@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                maxLength={200}
                                rows={4}
                            />
                            <small className="char-count">
                                <Important id="important-svg"/>
                                <p>{t('maxDescLength')}</p>
                            </small>
                        </div>

                        <button type="submit" className="save-btn">{t('saveProfile')}</button>
                    </form>
                </div>
                <div className="preferences">
                    <h1>Preferences</h1>
                    <div className="theme-toggle">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={theme === "dark"}
                                onChange={toggleTheme}
                            />
                            <span className="slider" />
                        </label>
                        <p>Dark theme</p>
                    </div>
                    <h1>Actions</h1>
                    <button className="logout-button" onClick={() => {
                        logOut();
                        router.push('/');
                    }}>Logout</button>
                </div>
            </div>
        </>
    );
};

export default Profile;