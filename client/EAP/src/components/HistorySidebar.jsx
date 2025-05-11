import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function HistorySidebar({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('charts'); // 'charts' or 'logins'
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Load chart history from localStorage
    const savedChartHistory = localStorage.getItem('chartHistory');
    const savedLoginHistory = localStorage.getItem('loginHistory');
    
    if (savedChartHistory) {
      setHistory(prev => ({
        ...prev,
        charts: JSON.parse(savedChartHistory)
      }));
    }
    
    if (savedLoginHistory) {
      setHistory(prev => ({
        ...prev,
        logins: JSON.parse(savedLoginHistory)
      }));
    }
  }, []);

  const clearHistory = (type) => {
    if (type === 'charts') {
      localStorage.removeItem('chartHistory');
      setHistory(prev => ({ ...prev, charts: [] }));
    } else if (type === 'logins') {
      localStorage.removeItem('loginHistory');
      setHistory(prev => ({ ...prev, logins: [] }));
    }
  };

  return (
    <div className={`fixed right-0 top-0 h-full w-80 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    } ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg z-50`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            History
          </h2>
          <button
            onClick={onClose}
            className={`px-3 py-1 rounded ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ✕
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'charts'
                ? 'bg-blue-500 text-white'
                : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Charts
          </button>
          <button
            onClick={() => setActiveTab('logins')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'logins'
                ? 'bg-blue-500 text-white'
                : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Logins
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto h-[calc(100%-8rem)]">
        {activeTab === 'charts' ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className={`text-md font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Chart History
              </h3>
              <button
                onClick={() => clearHistory('charts')}
                className={`px-3 py-1 rounded ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Clear
              </button>
            </div>
            {(!history.charts || history.charts.length === 0) ? (
              <div className={`p-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No chart history available
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {history.charts?.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700`}
                  >
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.chartType} Chart
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                    <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.fileName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className={`text-md font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Login History
              </h3>
              <button
                onClick={() => clearHistory('logins')}
                className={`px-3 py-1 rounded ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Clear
              </button>
            </div>
            {(!history.logins || history.logins.length === 0) ? (
              <div className={`p-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No login history available
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {history.logins?.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700`}
                  >
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.status === 'success' ? '✅ Login Successful' : '❌ Login Failed'}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                    <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.email}
                    </div>
                    {item.device && (
                      <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Device: {item.device}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 