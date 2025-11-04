import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationContextClass } from './context/NotificationContext';
import { BrowserRouter } from 'react-router-dom';
import ErrorHandler from './components/ErrorHandler'
import { startMockingSocial } from '@sidekick-monorepo/internship-backend';
import { Provider } from 'react-redux';
import { store } from './store';

async function enableMocking() {
  await startMockingSocial();
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root')!);

  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <ErrorHandler>
          <AuthProvider>
            <NotificationContextClass>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </NotificationContextClass>
          </AuthProvider>
        </ErrorHandler>
      </BrowserRouter>
    </Provider>
  );

  reportWebVitals();
});

