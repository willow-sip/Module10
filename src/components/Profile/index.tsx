import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '@/context/ThemeContext';
import { AuthContext } from '@/context/AuthContext';
import { showNotification } from '@/components/notify';
import { useTranslation } from 'react-i18next';
import './style.css';

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

    const checkEmail = (email : string) : boolean => {
        const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regExp.test(email);
    };

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
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim()) {
            showNotification(t('inputUsername'), 'warning', 2000);
            return;
        }

        if (!email.trim()) {
            showNotification(t('inputEmail'), 'warning', 2000);
            return;
        }

        if (!checkEmail(email.trim())) {
            showNotification(t('inputValidEmail'), 'warning', 2000);
            return;
        }

        if (description.trim().length > 200) {
            showNotification(t('descSize'), 'warning', 2000);
            return;
        }
        
        const query = `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
        id
        username
        email
        description
        firstName
        secondName
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

                    <form id="profile-form" onSubmit={handleSubmit}>
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
                            <label htmlFor="username"><i className="bi bi-person" /> {t('username')}</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="@username123"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email"><i className="bi bi-envelope" /> {t('email')}</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="email@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description"><i className="bi bi-pencil" /> {t('description')}</label>
                            <textarea
                                id="description"
                                placeholder={t('descriptionPlaceholder')}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={200}
                                rows={4}
                            />
                            <small className="char-count"><i className="bi bi-info-circle-fill" /> {t('maxDescLength')}</small>
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