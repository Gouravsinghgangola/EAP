import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import HistorySidebar from '../components/HistorySidebar';
import { useTheme } from '../context/ThemeContext';

export default function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className={`p-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation Bar */}
      <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Excel Analytics Dashboard
              </h1>
              <div className={`h-6 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {userData?.role === 'admin' ? 'Admin Panel' : 'User Dashboard'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Welcome, {userData?.name}
              </span>
              <button
                onClick={() => setIsHistoryOpen(true)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title="View History"
              >
                📋
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {userData?.role === 'admin' ? (
          <div className="space-y-8">
            <div className={`rounded-xl shadow-lg overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-6">
                <h2 className={`text-xl font-semibold mb-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Admin Tools
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <AdminCard 
                    title="User Management" 
                    icon="👥" 
                    description="Manage user accounts and permissions"
                    isDarkMode={isDarkMode}
                  />
                  <AdminCard 
                    title="System Settings" 
                    icon="⚙️" 
                    description="Configure system preferences and options"
                    isDarkMode={isDarkMode}
                  />
                  <AdminCard 
                    title="Analytics Reports" 
                    icon="📊" 
                    description="View system-wide analytics and reports"
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className={`rounded-xl shadow-lg overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-6">
                <h2 className={`text-xl font-semibold mb-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Data Analysis Tools
                </h2>
                <div className="space-y-6">
                  <div className={`p-6 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <FileUpload />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className={`rounded-xl shadow-lg overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-6">
                <h2 className={`text-xl font-semibold mb-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  <ActivityItem 
                    text="Logged in successfully" 
                    time="Just now" 
                    isDarkMode={isDarkMode}
                    icon="✅"
                  />
                  <ActivityItem 
                    text="System updated to v1.0.0" 
                    time="2 hours ago" 
                    isDarkMode={isDarkMode}
                    icon="🔄"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* History Sidebar */}
      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
      />
    </div>
  );
}

// Updated Admin Card Component
function AdminCard({ title, icon, description, isDarkMode }) {
  return (
    <div className={`p-6 rounded-lg transition-all duration-200 ${
      isDarkMode 
        ? 'bg-gray-700 hover:bg-gray-600' 
        : 'bg-gray-50 hover:bg-gray-100'
    }`}>
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Updated Activity Item Component
function ActivityItem({ text, time, isDarkMode, icon }) {
  return (
    <div className={`flex items-start p-4 rounded-lg ${
      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
    }`}>
      <div className="flex-shrink-0 text-xl mr-4">{icon}</div>
      <div>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {text}
        </p>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {time}
        </p>
      </div>
    </div>
  );
}