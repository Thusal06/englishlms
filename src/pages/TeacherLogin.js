// Teacher login page for admin access
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function TeacherLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Mock teacher credentials
  const teacherCredentials = [
    { email: 'teacher@englishlms.com', password: 'teacher123' },
    { email: 'admin@englishlms.com', password: 'admin123' },
    { email: 'sarah.johnson@englishlms.com', password: 'teacher123' },
    { email: 'michael.chen@englishlms.com', password: 'teacher123' },
    { email: 'jennifer.williams@englishlms.com', password: 'teacher123' }
  ];

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);

      // Check if credentials match teacher accounts
      const isTeacher = teacherCredentials.some(
        cred => cred.email === email && cred.password === password
      );

      if (!isTeacher) {
        throw new Error('Invalid teacher credentials');
      }

      // Mock login for teacher
      await login(email, password);
      navigate('/admin');
    } catch (error) {
      setError('Failed to log in as teacher. Please check your credentials.');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Teacher Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access the admin panel to review student submissions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Teacher Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="teacher@englishlms.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Signing in...' : 'Sign in as Teacher'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
              </div>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Test Teacher Accounts:</h4>
              <div className="text-xs text-blue-800 space-y-1">
                <div><strong>Email:</strong> teacher@englishlms.com <strong>Password:</strong> teacher123</div>
                <div><strong>Email:</strong> admin@englishlms.com <strong>Password:</strong> admin123</div>
                <div><strong>Email:</strong> sarah.johnson@englishlms.com <strong>Password:</strong> teacher123</div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500">
              Student Login
            </Link>
            <span className="mx-2 text-gray-300">|</span>
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-500">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
