import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import './style.css';

const Profile = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user, logOut } = useContext(AuthContext);
    const [location, setLocation] = useState<"profile" | "stats">("profile");
    const navigate = useNavigate();

    return (
        <>
            <div className="page-switch">
                <button className={location === "profile" ? "active" : ""} onClick={() => { navigate('/profile'); setLocation("profile") }}>Profile Info</button>
                <button className={location === "stats" ? "active" : ""} onClick={() => { navigate('/stats'); setLocation("stats") }}>Statistics</button>
            </div>
            <div className="profile" data-theme={theme}>
                <div className="edit-profile">
                    <h1>Edit profile</h1>

                    <form className="profile-form">
                        <div className="profile-header">
                            <img src={user?.profileImage || './imgs/default-avatar.jpg'} alt="Profile" className="avatar" />
                            <div className="profile-info">
                                <h3>{user?.firstName} {user?.secondName}</h3>
                                <button type="button" className="change-photo">Change profile photo</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="username"><i className="bi bi-person" /> Username</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="@username123"
                                defaultValue={user?.username || ''}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email"><i className="bi bi-envelope" /> Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="email@domain.com"
                                defaultValue={user?.email || ''}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description"><i className="bi bi-pencil" /> Description</label>
                            <textarea
                                id="description"
                                placeholder="Tell us about yourself..."
                                defaultValue={user?.description || ''}
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