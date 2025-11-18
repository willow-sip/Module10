'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { showNotification } from '@/components/notify';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import { signUp, signIn, updateAuthMode } from '@/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';

import './style.css';
import { Envelope, Eye } from '@/svgs';

interface Mode {
  mode: 'signup' | 'signin';
}

const INITIAL_VALUES = { email: '', password: '' };

const AuthPage = ({ mode }: Mode) => {
  const { authMode } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(updateAuthMode(mode));
  }, [mode, dispatch]);

  const validate = (values: { email: string; password: string }) => {
    const errors: { email?: string; password?: string } = {};

    if (!values.email) {
      errors.email = t('inputEmail');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = t('invalidCredentials');
    }

    if (!values.password) {
      errors.password = t('inputPassword');
    } else if (values.password.length < 6) {
      errors.password = t('passwordTooShort');
    }

    return errors;
  }

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {

    const { email, password } = values;

    try {
      if (authMode === 'signup') {
        await dispatch(signUp({ email, password })).unwrap();
        showNotification(t('signUpSuccess'), 'success', 2000);
        router.push('/sign-in');
      } else {
        await dispatch(signIn({ email, password })).unwrap();
        showNotification(t('signInSuccess'), 'success', 2000);
        router.push('/');
      }

      dispatch(updateAuthMode(null));
    } catch (err) {
      showNotification(
        authMode === 'signup'
          ? t('userExists')
          : t('invalidCredentials'),
        'error',
        3000
      );
    }

    setSubmitting(false);
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
        initialValues={INITIAL_VALUES}
        onSubmit={handleSubmit}
        validate={validate}
        validateOnMount={true}
      >
        {({ errors, touched, isSubmitting }) => {
          const prevErrorsRef = useRef(errors);

          useEffect(() => {
            if (touched.email && errors.email && errors.email !== prevErrorsRef.current.email) {
              showNotification(errors.email, 'warning', 3000);
            }
            if (touched.password && errors.password && errors.password !== prevErrorsRef.current.password) {
              showNotification(errors.password, 'warning', 3000);
            }
            prevErrorsRef.current = { ...errors };
          }, [errors.email, errors.password, touched.email, touched.password]);


          return (
            <Form className="authBox">
              <label htmlFor="email">
                <Envelope />
                <p>{t('email')}</p>
              </label>
              <Field
              data-testid="email"
                type="email"
                name="email"
                id="email"
                placeholder={t('emailPlaceholder')}
              />

              <label htmlFor="password">
                <Eye />
                <p>{t('password')}</p>
              </label>
              <Field
              data-testid="password"
                type="password"
                name="password"
                id="password"
                placeholder={t('passwordPlaceholder')}
              />

              <button data-testid="submit-button" type="submit" disabled={isSubmitting}>
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
          )
        }}
      </Formik>
    </div>
  );
};

export default AuthPage;