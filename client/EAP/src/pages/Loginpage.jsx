import AuthForm from '../components/AuthForm';
import { login } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex justify-end p-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </div>
      <AuthForm type="login" onSubmit={login} />
    </div>
  );
}