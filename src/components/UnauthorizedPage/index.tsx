import { useTranslation } from 'react-i18next';
import './style.css';

const NotFoundPage = () => {

  const { t } = useTranslation();
  return (
    <div className="error-page">
      <img className="error401" src="./imgs/401error.png" alt="Image of error 401" />
      <h1>{t('oops')}<br />{t('smthWentWrong')}</h1>
    </div>
  );
}

export default NotFoundPage;
