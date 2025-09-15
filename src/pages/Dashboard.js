// Dashboard page with course, assignment, and quiz sections (protected route)
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout functionality
  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                English LMS
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {currentUser?.email}
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">
            Welcome back! Continue your English learning journey.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses Section */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">My Courses</h3>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                  <h4 className="font-medium text-gray-900 mb-1">English Grammar Fundamentals</h4>
                  <p className="text-sm text-gray-600 mb-2">Master the basics of English grammar</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary-600 bg-primary-100 px-2 py-1 rounded">In Progress</span>
                    <span className="text-xs text-gray-500">75% Complete</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                  <h4 className="font-medium text-gray-900 mb-1">Advanced Vocabulary</h4>
                  <p className="text-sm text-gray-600 mb-2">Expand your English vocabulary</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-accent-600 bg-accent-100 px-2 py-1 rounded">New</span>
                    <span className="text-xs text-gray-500">0% Complete</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                  <h4 className="font-medium text-gray-900 mb-1">Business English</h4>
                  <p className="text-sm text-gray-600 mb-2">Professional English communication</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Completed</span>
                    <span className="text-xs text-gray-500">100% Complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assignments Section */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Recent Assignments</h3>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                  <h4 className="font-medium text-gray-900 mb-1">Essay: My Future Goals</h4>
                  <p className="text-sm text-gray-600 mb-2">Write a 500-word essay about your future aspirations</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-red-600 font-medium">Due Tomorrow</span>
                    <span className="text-xs text-gray-500">Not Started</span>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                  <h4 className="font-medium text-gray-900 mb-1">Grammar Exercise Set 3</h4>
                  <p className="text-sm text-gray-600 mb-2">Complete exercises on past tense usage</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-yellow-600 font-medium">Due in 3 days</span>
                    <span className="text-xs text-gray-500">50% Complete</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                  <h4 className="font-medium text-gray-900 mb-1">Vocabulary Quiz Prep</h4>
                  <p className="text-sm text-gray-600 mb-2">Study materials for upcoming vocabulary test</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-600 font-medium">Due in 1 week</span>
                    <span className="text-xs text-gray-500">Not Started</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quizzes Section */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Available Quizzes</h3>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                  <h4 className="font-medium text-gray-900 mb-1">Present Perfect Tense</h4>
                  <p className="text-sm text-gray-600 mb-2">Test your understanding of present perfect</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">15 Questions</span>
                    <button className="text-xs bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700 transition-colors">
                      Start Quiz
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                  <h4 className="font-medium text-gray-900 mb-1">Phrasal Verbs</h4>
                  <p className="text-sm text-gray-600 mb-2">Common phrasal verbs in English</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">20 Questions</span>
                    <button className="text-xs bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700 transition-colors">
                      Start Quiz
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">Articles (a, an, the)</h4>
                  <p className="text-sm text-gray-600 mb-2">Usage of English articles</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-600 font-medium">Completed: 85%</span>
                    <button className="text-xs bg-green-600 text-white px-3 py-1 rounded">
                      Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
