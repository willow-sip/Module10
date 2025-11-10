import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { ThemeContext } from '@/context/ThemeContext';
import { showNotification } from '@/components/notify';
import { Formik, Form, Field } from 'formik';

import './style.css';

interface Mode {
  mode: 'signup' | 'signin';
}

const AuthPage = ({ mode }: Mode) => {
  const { authMode, updateAuthMode, signUp, signIn } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  useEffect(() => {
    updateAuthMode(mode);
  }, [mode, updateAuthMode]);

  const handleSubmit = (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const { email, password } = values;

    if (!email || !password) {
      showNotification('Not all required data filled.', 'warning', 2000);
      setSubmitting(false);
      return;
    }

    const success = authMode === 'signup'
      ? signUp(email, password)
      : signIn(email, password);

    if (!success) {
      showNotification(
        authMode === 'signup'
          ? 'User already exists.'
          : 'Invalid email or password',
        'error',
        3000
      );
      setSubmitting(false);
      return;
    }

    updateAuthMode(null);
    if (authMode === 'signup') {
      showNotification('Sign up successful, now sign in!', 'success', 2000);
      router.push('/sign-in');
    } else {
      showNotification('Sign in successful!', 'success', 2000);
      router.push('/');
    }
  };

  return (
    <div className="authPage" data-theme={theme}>
      <div className="mainInfo">
        <h2>{authMode === 'signup' ? 'Create an account' : 'Sign in into an account'}</h2>
        <p>
          Enter your email and password <br />
          {authMode === 'signup' ? 'to sign up for' : 'to sign in into'} this app
        </p>
      </div>

      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="authBox">
            <label htmlFor="email"><i className="bi bi-envelope" /> Email</label>
            <Field
              type="email"
              name="email"
              id="email"
              placeholder="Enter email"
            />

            <label htmlFor="password"><i className="bi bi-eye" /> Password</label>
            <Field
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
            />

            <button type="submit" disabled={isSubmitting}>
              {authMode === 'signup' ? 'Sign Up' : 'Sign In'}
            </button>

            {authMode === 'signup' && (
              <small>
                By clicking continue, you agree to our <span>Terms of Service</span><br />
                and <span>Privacy Policy</span>
              </small>
            )}

            <p className="switchLink" onClick={() => {
              router.push(authMode === 'signup' ? '/sign-in' : '/sign-up');
              updateAuthMode(authMode === 'signup' ? 'signin' : 'signup');
            }}>
              {authMode === 'signup'
                ? <>Already have an account? <span>Sign in</span></>
                : <>Forgot to create an account? <span>Sign up</span></>}
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AuthPage;