import AuthForm from '../components/AuthForm';
import { register } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function RegisterPage() {
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
      <AuthForm type="register" onSubmit={register} />
    </div>
  );
}