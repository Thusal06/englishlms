// Login page with email/password authentication form
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error('Login error:', error);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              English LMS
            </h1>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue your learning journey</p>
        </div>

        {/* Login Form */}
        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="input-field"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="input-field"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Additional Options */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <span className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
                Contact your administrator
              </span>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
