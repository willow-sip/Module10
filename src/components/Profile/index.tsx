'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { showNotification } from '@/components/notify';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { logOut, updateUser } from '@/slices/authSlice'
import './style.css';
import { Envelope, Important, Pencil, Person } from '@/svgs';

interface FormInput {
    username: string;
    email: string;
    description: string;
    profileImage: string;
    firstName: string;
    secondName: string;
}

const Profile = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const [location, setLocation] = useState<"profile" | "stats">("profile");

    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [description, setDescription] = useState(user?.description || '');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState(user?.profileImage || './imgs/default-avatar.jpg');
    
    const router = useRouter();
    const { t } = useTranslation();

    const { handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormInput>({
        defaultValues: {
            username: user?.username || '',
            email: user?.email || '',
            description: user?.description || '',
            profileImage: user?.profileImage || './imgs/default-avatar.jpg',
            firstName: user?.firstName || '',
            secondName: user?.secondName || ''
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

    const updateUserRequest = useMutation({
        mutationFn: async (data: FormInput) => {
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
                        profileImage
                        firstName
                        secondName
                    }
                }
            `;
            
            const variables = { input: data };

            const response = await fetch('/api/graphql', {
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
                return;
            }
            return result.data.updateProfile;
        },
        onSuccess: (updatedUser) => {
             dispatch(updateUser(updatedUser));
            showNotification(t('updatedProfile'), 'success', 2000);
            reset({
                username: updatedUser.username,
                email: updatedUser.email,
                description: updatedUser.description,
                profileImage: updatedUser.profileImage
            });
        },
        onError: () => {
            showNotification(t('couldntUpdateProfile'), 'error', 2000);
            return;
        }
    });

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        updateUserRequest.mutate( {
            ...data,
            profileImage: user?.profileImage || './imgs/default-avatar.jpg',
            firstName: user?.firstName || '',
            secondName: user?.secondName || ''
        } );
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
                        dispatch(logOut());
                        router.push('/');
                    }}>Logout</button>
                </div>
            </div>
        </>
    );
};

export default Profile;