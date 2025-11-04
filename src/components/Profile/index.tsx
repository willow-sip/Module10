import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
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
    const [errors, setErrors] = useState<{ username?: string; email?: string }>({});

    const navigate = useNavigate();

    const checkEmail = (email : string) : boolean => {
        const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regExp.test(email);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formErrors: { username?: string; email?: string } = {};

        if (!username.trim()){
            formErrors.username = 'Please input a username.';
        }

        if (!email.trim()){
            formErrors.email = 'Please input an email.';
        }
        
        if (!checkEmail(email)){
            formErrors.email = 'Please input an email in correct form.';
        }

        setErrors(formErrors);
        if (Object.keys(formErrors).length > 0) return;

        const query = `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
        id
        username
        email
        description
        firstName
        secondName
        profileImage
    }
  }
`
        const variables = {
            input: {
                username,
                email,
                description,
                selectedFile
            },
        };

        try {
            const response = await fetch('http://localhost:3000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ query, variables }),
            });

            const result = await response.json();

            if (result.errors) {
                console.error(result.errors);
                return;
            }
            updateUser(result.data.updateProfile);
        } catch (err) {
            console.error('Couldnt update profile:', err);
        }
    };

    return (
        <>
            <div className="page-switch">
                <button className={location === "profile" ? "active" : ""} onClick={() => { navigate('/profile'); setLocation("profile") }}>Profile Info</button>
                <button className={location === "stats" ? "active" : ""} onClick={() => { navigate('/stats'); setLocation("stats") }}>Statistics</button>
            </div>
            <div className="profile" data-theme={theme}>
                <div className="edit-profile">
                    <h1>Edit profile</h1>

                    <form id="profile-form" onSubmit={handleSubmit}>
                        <div className="profile-header">
                            <img src={previewImage} alt="Profile" className="avatar" />
                            <div className="profile-info">
                                <h3>{user?.firstName} {user?.secondName}</h3>
                                <label htmlFor="profileImage" className="change-photo">Change profile photo</label>
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
                            <label htmlFor="username"><i className="bi bi-person" /> Username</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="@username123"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email"><i className="bi bi-envelope" /> Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="email@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description"><i className="bi bi-pencil" /> Description</label>
                            <textarea
                                id="description"
                                placeholder="Tell us about yourself..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={200}
                                rows={4}
                            />
                            <small className="char-count"><i className="bi bi-info-circle-fill" /> Max 200 chars</small>
                        </div>

                        <button type="submit" className="save-btn">Save Profile Changes</button>
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
                        navigate('/');
                    }}>Logout</button>
                </div>
            </div>
        </>
    );
};

export default Profile;