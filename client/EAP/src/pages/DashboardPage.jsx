import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Excel Analytics Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {userData?.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Your Analytics Dashboard</h2>
            
            {/* Role-based content */}
            {userData?.role === 'admin' ? (
              <div className="mt-4">
                <h3 className="text-md font-medium">Admin Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <DashboardCard title="User Management" icon="👥" />
                  <DashboardCard title="System Settings" icon="⚙️" />
                  <DashboardCard title="Analytics Reports" icon="📊" />
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <h3 className="text-md font-medium">User Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <DashboardCard title="Upload Files" icon="📤" />
                  <DashboardCard title="View Reports" icon="📈" />
                </div>
              </div>
            )}

            {/* Recent Activity Section */}
            <div className="mt-8">
              <h3 className="text-md font-medium">Recent Activity</h3>
              <div className="mt-2 space-y-2">
                <ActivityItem text="Logged in successfully" time="Just now" />
                <ActivityItem text="System updated to v1.0.0" time="2 hours ago" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Reusable Dashboard Card Component
function DashboardCard({ title, icon }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="text-2xl">{icon}</div>
      <h4 className="mt-2 font-medium">{title}</h4>
    </div>
  );
}

// Reusable Activity Item Component
function ActivityItem({ text, time }) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 h-5 w-5 text-green-500">•</div>
      <div className="ml-3">
        <p className="text-sm text-gray-700">{text}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}