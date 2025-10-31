import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter } from 'react-router-dom';
import ErrorHandler from './components/ErrorHandler'
import { startMockingSocial } from '@sidekick-monorepo/internship-backend';

async function enableMocking() {
  await startMockingSocial();
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root')!);

  root.render(
    <BrowserRouter>
      <ErrorHandler>
        <AuthProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AuthProvider>
      </ErrorHandler>
    </BrowserRouter>
  );

  reportWebVitals();
});

