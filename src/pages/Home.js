// Home/Landing page with welcome message and login navigation
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Master English with
          <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Techlish
          </span>
        </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your comprehensive learning management system for mastering the English language. 
            Access courses, assignments, and quizzes all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Courses</h3>
            <p className="text-gray-600">Comprehensive English courses designed for all skill levels</p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Assignments</h3>
            <p className="text-gray-600">Practice with personalized assignments and instant feedback</p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Quizzes</h3>
            <p className="text-gray-600">Test your knowledge with engaging quizzes and assessments</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          {currentUser ? (
            <Link 
              to="/dashboard" 
              className="inline-block btn-primary text-lg px-8 py-3 rounded-xl"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <div className="space-x-4">
                <Link 
                  to="/signup" 
                  className="inline-block btn-primary text-lg px-8 py-3 rounded-xl"
                >
                  Get Started
                </Link>
                <Link 
                  to="/login" 
                  className="inline-block btn-secondary text-lg px-8 py-3 rounded-xl"
                >
                  Sign In
                </Link>
              </div>
              <p className="text-gray-500 text-sm">
                Ready to begin your English learning journey?
              </p>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link 
                  to="/teacher-login" 
                  className="text-sm text-purple-600 hover:text-purple-500 font-medium"
                >
                  🎓 Teacher Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
