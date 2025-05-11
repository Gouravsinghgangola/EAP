import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import * as XLSX from 'xlsx-js-style';
import DataVisualization from './DataVisualization';
import { useTheme } from '../context/ThemeContext';

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const { isDarkMode } = useTheme();
  const [currentFileName, setCurrentFileName] = useState('');

  const processExcelFile = (file) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          
          if (!workbook.SheetNames.length) {
            throw new Error('No sheets found in the file');
          }

          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (!jsonData.length) {
            throw new Error('No data found in the file');
          }
          
          if (jsonData.length < 2) {
            throw new Error('File must contain at least a header row and one data row');
          }

          // Validate header row
          const headers = jsonData[0];
          if (headers.some(header => !header)) {
            throw new Error('All columns must have headers');
          }
          
          setPreviewData(jsonData);
        } catch (error) {
          setUploadStatus(`Error processing file: ${error.message}`);
        }
      };
      reader.onerror = () => {
        setUploadStatus('Error reading file. The file might be corrupted.');
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      setUploadStatus(`Error processing file: ${error.message}`);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      setUploadStatus('No file selected');
      return;
    }

    const file = acceptedFiles[0];
    
    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('File is too large. Maximum size is 5MB.');
      return;
    }

    setUploading(true);
    setUploadStatus('');
    setPreviewData(null);

    try {
      setCurrentFileName(file.name);
      processExcelFile(file);

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await axios.post('http://localhost:5000/api/upload/file', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000, // 30 second timeout
      });

      setUploadStatus('File uploaded successfully!');
    } catch (error) {
      let errorMessage = 'Error uploading file. Please try again.';
      
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = 'Upload endpoint not found. Please contact support.';
            break;
          case 401:
            errorMessage = 'Authentication failed. Please login again.';
            localStorage.removeItem('token');
            window.location.href = '/login';
            break;
          case 413:
            errorMessage = 'File is too large. Please choose a smaller file.';
            break;
          case 400:
            errorMessage = error.response.data?.message || 'Invalid file format.';
            break;
          default:
            errorMessage = error.response.data?.message || 'Server error occurred.';
        }
      } else if (error.request) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please try again.';
        } else {
          errorMessage = 'No response from server. Please check your connection.';
        }
      } else {
        errorMessage = error.message;
      }
      
      setUploadStatus(errorMessage);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    }
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        <div className="text-4xl mb-4">📁</div>
        {isDragActive ? (
          <p className="text-blue-500">Drop files here...</p>
        ) : (
          <div>
            <p className="text-gray-600">Drag and drop files here, or click to select</p>
            <p className="text-sm text-gray-500 mt-2">Supported files: .xlsx, .xls, .csv</p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Uploading...</p>
        </div>
      )}

      {uploadStatus && (
        <div className={`mt-4 p-4 rounded-lg ${
          uploadStatus.includes('successfully') 
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
        }`}>
          <div className="flex items-center">
            {uploadStatus.includes('successfully') ? (
              <span className="mr-2">✅</span>
            ) : (
              <span className="mr-2">❌</span>
            )}
            <p className="flex-1">{uploadStatus}</p>
            {!uploadStatus.includes('successfully') && (
              <button
                onClick={() => setUploadStatus('')}
                className="ml-2 text-sm hover:underline"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      {previewData && (
        <div className="mt-8">
          <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Data Preview
          </h3>
          <div className={`overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
            <table className="min-w-full">
              <thead>
                <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  {previewData[0].map((header, index) => (
                    <th key={index} className={`px-6 py-3 text-left text-xs font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.slice(1, 6).map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 
                    (isDarkMode ? 'bg-gray-800' : 'bg-white') : 
                    (isDarkMode ? 'bg-gray-700' : 'bg-gray-50')}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className={`px-6 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8">
            <DataVisualization 
              data={previewData} 
              isDarkMode={isDarkMode} 
              fileName={currentFileName}
            />
          </div>
        </div>
      )}
    </div>
  );
} 