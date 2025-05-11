import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DataVisualization({ data, isDarkMode, fileName }) {
  const [selectedChart, setSelectedChart] = useState('line');
  const [chartData, setChartData] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState({ x: 0, y: 1 });
  const chartRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 1) {
      const headers = data[0];
      const xData = data.slice(1).map(row => row[selectedColumns.x]);
      const yData = data.slice(1).map(row => row[selectedColumns.y]);

      setChartData({
        labels: xData,
        datasets: [{
          label: headers[selectedColumns.y],
          data: yData,
          borderColor: isDarkMode ? '#60A5FA' : '#2563EB',
          backgroundColor: isDarkMode ? 'rgba(96, 165, 250, 0.5)' : 'rgba(37, 99, 235, 0.5)',
        }]
      });
    }
  }, [data, isDarkMode, selectedColumns]);

  const handleColumnChange = (axis, value) => {
    setSelectedColumns(prev => ({
      ...prev,
      [axis]: parseInt(value)
    }));
  };

  const downloadChartAsPNG = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `chart-${selectedChart}-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    }
  };

  const downloadChartAsPDF = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`chart-${selectedChart}-${new Date().toISOString().split('T')[0]}.pdf`);
    }
  };

  const saveToHistory = (chartType) => {
    const historyItem = {
      chartType,
      timestamp: new Date().toISOString(),
      fileName: fileName || 'Untitled',
    };

    const savedHistory = localStorage.getItem('chartHistory');
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    history.unshift(historyItem);
    
    // Keep only last 50 items
    if (history.length > 50) {
      history.pop();
    }
    
    localStorage.setItem('chartHistory', JSON.stringify(history));
  };

  const handleChartTypeChange = (type) => {
    setSelectedChart(type);
    saveToHistory(type);
  };

  const renderChart = () => {
    if (!chartData) return null;

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: isDarkMode ? '#fff' : '#000'
          }
        },
        title: {
          display: true,
          text: 'Data Visualization',
          color: isDarkMode ? '#fff' : '#000'
        }
      },
      scales: {
        y: {
          ticks: {
            color: isDarkMode ? '#fff' : '#000'
          },
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          ticks: {
            color: isDarkMode ? '#fff' : '#000'
          },
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        }
      }
    };

    const chartContainer = (
      <div className="relative h-[400px] w-full" ref={chartRef}>
        {selectedChart === 'line' && <Line data={chartData} options={options} />}
        {selectedChart === 'bar' && <Bar data={chartData} options={options} />}
        {selectedChart === 'pie' && <Pie data={chartData} options={options} />}
        {selectedChart === '3d' && (
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls />
            <DataPoints data={chartData.datasets[0].data} />
          </Canvas>
        )}
      </div>
    );

    return (
      <div>
        {chartContainer}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={downloadChartAsPNG}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Download PNG
          </button>
          <button
            onClick={downloadChartAsPDF}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Download PDF
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {data && data.length > 1 && (
        <div className="mb-4 flex gap-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              X-Axis Column
            </label>
            <select
              value={selectedColumns.x}
              onChange={(e) => handleColumnChange('x', e.target.value)}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
              } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            >
              {data[0].map((header, index) => (
                <option key={index} value={index}>{header}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Y-Axis Column
            </label>
            <select
              value={selectedColumns.y}
              onChange={(e) => handleColumnChange('y', e.target.value)}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
              } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            >
              {data[0].map((header, index) => (
                <option key={index} value={index}>{header}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex gap-4 mb-4 overflow-x-auto">
        <button
          onClick={() => handleChartTypeChange('line')}
          className={`px-4 py-2 rounded ${
            selectedChart === 'line' 
              ? 'bg-blue-500 text-white' 
              : isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'
          }`}
        >
          Line Chart
        </button>
        <button
          onClick={() => handleChartTypeChange('bar')}
          className={`px-4 py-2 rounded ${
            selectedChart === 'bar' 
              ? 'bg-blue-500 text-white' 
              : isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'
          }`}
        >
          Bar Chart
        </button>
        <button
          onClick={() => handleChartTypeChange('pie')}
          className={`px-4 py-2 rounded ${
            selectedChart === 'pie' 
              ? 'bg-blue-500 text-white' 
              : isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'
          }`}
        >
          Pie Chart
        </button>
        <button
          onClick={() => handleChartTypeChange('3d')}
          className={`px-4 py-2 rounded ${
            selectedChart === '3d' 
              ? 'bg-blue-500 text-white' 
              : isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'
          }`}
        >
          3D Visualization
        </button>
      </div>
      
      <div className="mt-4">
        {renderChart()}
      </div>
    </div>
  );
}

// 3D Data Points Component
function DataPoints({ data }) {
  return (
    <group>
      {data.map((value, index) => (
        <mesh key={index} position={[index - data.length/2, value/10, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#60A5FA" />
        </mesh>
      ))}
    </group>
  );
} 