import { useTheme } from './ThemeContext';

describe('tests for zustand theme storage', () => {
  afterEach(() => {
    localStorage.clear();
    document.body.setAttribute('data-theme', '');
  });

  it('sets the theme to dark by default', () => {
    const { theme } = useTheme.getState();
    expect(theme).toBe('dark');
    expect(document.body.getAttribute('data-theme')).toBe('dark');
  });

  it('if theme is stored in local storage, sets it by default', () => {
    jest.resetModules();
    localStorage.setItem('theme', 'light');
    const { useTheme } = require('./ThemeContext');
    
    expect(useTheme.getState().theme).toBe('light');
    expect(document.body.getAttribute('data-theme')).toBe('light');
  });

  it('updates theme', () => {
    useTheme.getState().updateTheme('light');
    expect(useTheme.getState().theme).toBe('light');
    expect(document.body.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('toggles theme to light', () => {
    useTheme.getState().updateTheme('dark');
    useTheme.getState().toggleTheme();
    expect(useTheme.getState().theme).toBe('light');
  });

  it('toggles theme to dark', () => {
    useTheme.getState().updateTheme('light');
    useTheme.getState().toggleTheme();
    expect(useTheme.getState().theme).toBe('dark');
  });
});
