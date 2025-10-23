import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter } from 'react-router-dom';
import ErrorHandler from './components/ErrorHandler'

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <ErrorHandler>
          <App />
        </ErrorHandler>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

reportWebVitals();
