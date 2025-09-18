import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAssignments } from '../contexts/AssignmentsContext';

export default function Assignments() {
  const { assignments, updateAssignmentStatus } = useAssignments();
  const [activeTab, setActiveTab] = useState('all');

  const filteredAssignments = assignments.filter(assignment => {
    if (activeTab === 'pending') return assignment.status === 'pending';
    if (activeTab === 'completed') return assignment.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <Link 
            to="/dashboard" 
            className="btn-secondary"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Tasks
              <span className="ml-2 bg-gray-100 text-gray-900 text-xs font-medium px-2 py-0.5 rounded-full">
                {assignments.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {assignments.filter(a => a.status === 'pending').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {assignments.filter(a => a.status === 'completed').length}
              </span>
            </button>
          </nav>
        </div>

        {/* Assignments List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredAssignments.length === 0 ? (
            <div className="text-center p-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'all'
                  ? 'Get started by joining a course.'
                  : activeTab === 'pending'
                  ? 'You have no pending assignments.'
                  : 'You have no completed assignments.'}
              </p>
              <div className="mt-6">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Browse Courses
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredAssignments.map((assignment) => (
                <li key={`${assignment.courseId}-${assignment.lessonId}-${assignment.id}`}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary-600 truncate">
                        {assignment.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        {assignment.status === 'completed' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {assignment.courseName} • {assignment.lessonName}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Due {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      {assignment.status !== 'completed' && (
                        <button
                          onClick={() => updateAssignmentStatus(assignment.id, 'completed')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Mark as Complete
                        </button>
                      )}
                      <Link
                        to={`/course/${assignment.courseId}?lesson=${assignment.lessonId}`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        View Lesson
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
