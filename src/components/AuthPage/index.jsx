import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import './style.css';

const AuthPage = ({ mode }) => {
    const { theme, authMode, setAuthMode, signUp, signIn } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    setAuthMode(mode);
    const navigate = useNavigate();

    useEffect(() => {
        setAuthMode(mode);
    }, [mode, setAuthMode]);


    const handleSubmit = () => {
        if (!email || !password || (authMode === 'signup' && !username)) {
            alert('Please fill in all required fields');
            return;
        }
        const success = authMode === 'signup'
            ? signUp(email, username, password)
            : signIn(email, password);
        if (!success) {
            alert('Invalid credentials or user already exists');
            return;
        }
        setAuthMode(null);
        navigate('/');
    };

    return (
        <div className="authPage" data-theme={theme}>
            <div className="mainInfo">
                <h2>{authMode === 'signup' ? 'Create an account' : 'Sign in into an account'}</h2>
                <p>Enter your email and password <br />
                    {authMode === 'signup' ? 'to sign up for' : 'to sign in into'} this app</p>
            </div>

            <fieldset className="authBox">
                <label htmlFor="email"><i class="bi bi-envelope" /> Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                {authMode === 'signup' && (
                    <>
                        <label htmlFor="username"><i class="bi bi-person" /> Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Enter username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </>
                )}

                <label htmlFor="password"><i class="bi bi-eye" /> Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <button onClick={handleSubmit}>
                    {authMode === 'signup' ? 'Sign Up' : 'Sign In'}
                </button>

                {authMode === 'signup' &&
                    <small>
                        By clicking continue, you agree to our <span>Terms of Service</span><br />and <span>Privacy Policy</span>
                    </small>
                }

                <p className="switchLink" onClick={() => {
                    navigate(authMode === 'signup' ? '/sign-in' : '/sign-up');
                    setAuthMode(authMode === 'signup' ? 'signin' : 'signup')
                }}>
                    {authMode === 'signup' ? <>Already have an account? <span>Sign in</span></> : <>Forgot to create an account? <span>Sign up</span></>}
                </p>
            </fieldset >
        </div>
    );
};

export default AuthPage;
