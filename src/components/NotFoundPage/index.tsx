'use client';
import './style.css';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className="error-page">
      <img className="error404" src="./imgs/404error.png" alt="Symbol of error 404" />
      <h1>{t('notFound')}</h1>
    </div>
  );
}

export default NotFoundPage;
