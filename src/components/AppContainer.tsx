'use client';

import { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import i18n from '@/i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function AppContainer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const updateHtmlLang = () => {
      document.documentElement.lang = i18n.language;
    };
    updateHtmlLang();
    i18n.on('languageChanged', updateHtmlLang);

    return () => {
      i18n.off('languageChanged', updateHtmlLang);
    };
  }, []);

  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();

  return (
    <div className="app" data-theme={theme}>
      <Header name={user ? `${user.firstName} ${user.secondName}` : undefined} avatar={user?.profileImage} />
      {children}
      <Footer />
    </div>
  );
}