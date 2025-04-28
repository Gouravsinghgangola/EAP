import { useState } from 'react';
import FormInput from './FormInput';
import { useNavigate } from 'react-router-dom';

export default function AuthForm({ type, onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    ...(type === 'register' && { name: '' }),
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      navigate('/dashboard'); // Redirect after successful auth
    } catch (error) {
      setErrors(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {type === 'login' ? 'Login' : 'Register'}
      </h2>
      {errors.message && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{errors.message}</div>
      )}
      <form onSubmit={handleSubmit}>
        {type === 'register' && (
          <FormInput
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
        )}
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : type === 'login' ? 'Login' : 'Register'}
          </button>
          {type === 'login' ? (
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="/register"
            >
              Create account
            </a>
          ) : (
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="/login"
            >
              Already have an account?
            </a>
          )}
        </div>
      </form>
    </div>
  );
}