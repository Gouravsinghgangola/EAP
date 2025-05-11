import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function AuthForm({ type, onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: type === 'register' ? '' : undefined
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      
      // Save login history
      const loginHistory = {
        timestamp: new Date().toISOString(),
        email: formData.email,
        status: 'success',
        device: navigator.userAgent
      };
      
      const savedLoginHistory = localStorage.getItem('loginHistory');
      const history = savedLoginHistory ? JSON.parse(savedLoginHistory) : [];
      history.unshift(loginHistory);
      
      // Keep only last 50 login records
      if (history.length > 50) {
        history.pop();
      }
      
      localStorage.setItem('loginHistory', JSON.stringify(history));
      
      navigate('/dashboard');
    } catch (err) {
      // Save failed login attempt
      const loginHistory = {
        timestamp: new Date().toISOString(),
        email: formData.email,
        status: 'failed',
        device: navigator.userAgent
      };
      
      const savedLoginHistory = localStorage.getItem('loginHistory');
      const history = savedLoginHistory ? JSON.parse(savedLoginHistory) : [];
      history.unshift(loginHistory);
      
      if (history.length > 50) {
        history.pop();
      }
      
      localStorage.setItem('loginHistory', JSON.stringify(history));
      
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className={`max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
      }`}>
        <div>
          <h2 className="text-center text-3xl font-extrabold">
            {type === 'login' ? 'Sign in to your account' : 'Create new account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {type === 'register' && (
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="space-y-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {type === 'login' ? 'Sign in' : 'Sign up'}
            </button>

            {/* Navigation Button */}
            <div className="text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {type === 'login' ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Link
                to={type === 'login' ? '/register' : '/login'}
                className={`mt-2 inline-block text-sm font-medium ${
                  isDarkMode 
                    ? 'text-indigo-400 hover:text-indigo-300' 
                    : 'text-indigo-600 hover:text-indigo-500'
                }`}
              >
                {type === 'login' ? 'Create new account' : 'Sign in to existing account'}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}