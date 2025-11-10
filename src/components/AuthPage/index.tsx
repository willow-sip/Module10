import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { ThemeContext } from '@/context/ThemeContext';
import { showNotification } from '@/components/notify';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';

import './style.css';

interface Mode {
  mode: 'signup' | 'signin';
}

const AuthPage = ({ mode }: Mode) => {
  const { authMode, updateAuthMode, signUp, signIn } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    updateAuthMode(mode);
  }, [mode, updateAuthMode]);

  const handleSubmit = (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const { email, password } = values;

    if (!email || !password) {
      showNotification(t('fillAllFields'), 'warning', 2000);
      setSubmitting(false);
      return;
    }

    const success = authMode === 'signup'
      ? signUp(email, password)
      : signIn(email, password);

    if (!success) {
      showNotification(
        authMode === 'signup'
          ? t('userExists')
          : t('invalidCredentials'),
        'error',
        3000
      );
      setSubmitting(false);
      return;
    }

    updateAuthMode(null);
    if (authMode === 'signup') {
      showNotification(t('signUpSuccess'), 'success', 2000);
      router.push('/sign-in');
    } else {
      showNotification(t('signInSuccess'), 'success', 2000);
      router.push('/');
    }
  };

  return (
    <div className="authPage" data-theme={theme}>
      <div className="mainInfo">
        <h2>{authMode === 'signup' ? t('createAccount') : t('signInAccount')}</h2>
        <p>
          {t('enterEmailPassword')} <br />
          {authMode === 'signup' ? t('toSignUp') : t('toSignIn')} {t('thisApp')}
        </p>
      </div>

      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="authBox">
            <label htmlFor="email"><i className="bi bi-envelope" /> {t('email')}</label>
            <Field
              type="email"
              name="email"
              id="email"
              placeholder={t('emailPlaceholder')}
            />

            <label htmlFor="password"><i className="bi bi-eye" /> {t('password')}</label>
            <Field
              type="password"
              name="password"
              id="password"
              placeholder={t('passwordPlaceholder')}
            />

            <button type="submit" disabled={isSubmitting}>
              {authMode === 'signup' ? t('signUp') : t('signIn')}
            </button>

            {authMode === 'signup' && (
              <small>
                {t('termsAgreement')} <span>{t('termsOfService')}</span><br />
                {t('and')} <span>{t('privacyPolicy')}</span>
              </small>
            )}

            <p className="switchLink" onClick={() => {
              router.push(authMode === 'signup' ? '/sign-in' : '/sign-up');
              updateAuthMode(authMode === 'signup' ? 'signin' : 'signup');
            }}>
              {authMode === 'signup'
                ? <>{t('alreadyHaveAccount')} <span>{t('signInLink')}</span></>
                : <>{t('dontHaveAccount')} <span>{t('signUpLink')}</span></>}
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AuthPage;