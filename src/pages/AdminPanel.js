// Admin panel for teachers to review student submissions
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminPanel() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submissions');
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);

  // Mock data for student submissions
  const mockSubmissions = [
    {
      id: 'sub-001',
      studentName: 'John Doe',
      studentEmail: 'john.doe@example.com',
      assignmentId: 'grammar-assignment-1',
      assignmentTitle: 'Task 1: Linking Words Practice',
      courseName: 'Grammar Fundamentals',
      submittedAt: '2025-01-15T10:30:00Z',
      status: 'pending',
      score: null,
      feedback: '',
      submissionType: 'quiz',
      answers: {
        q1: 2,
        q2: 'moreover',
        q3: { 0: 'f', 1: 'd', 2: 'e', 3: 'b', 4: 'a' },
        q4: false,
        q5: 2
      }
    },
    {
      id: 'sub-002',
      studentName: 'Jane Smith',
      studentEmail: 'jane.smith@example.com',
      assignmentId: 'business-assignment-1',
      assignmentTitle: 'Task 1: Match Negotiation Phrases',
      courseName: 'Business English',
      submittedAt: '2025-01-14T15:45:00Z',
      status: 'graded',
      score: 85,
      feedback: 'Good understanding of negotiation phrases. Work on clarity in explanations.',
      submissionType: 'match',
      answers: {
        0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F'
      }
    },
    {
      id: 'sub-003',
      studentName: 'Mike Johnson',
      studentEmail: 'mike.johnson@example.com',
      assignmentId: 'vocabulary-assignment-1',
      assignmentTitle: 'Task 1: Academic Vocabulary Practice',
      courseName: 'Advanced Vocabulary',
      submittedAt: '2025-01-13T09:20:00Z',
      status: 'pending',
      score: null,
      feedback: '',
      submissionType: 'text',
      textSubmission: 'Academic vocabulary is essential for professional communication. Words like "analyze," "synthesize," and "evaluate" help express complex ideas clearly...'
    }
  ];

  const mockStudents = [
    {
      id: 'student-001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      enrolledCourses: ['Grammar Fundamentals', 'Business English'],
      completedAssignments: 5,
      pendingAssignments: 3,
      averageScore: 87
    },
    {
      id: 'student-002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      enrolledCourses: ['Business English', 'Advanced Vocabulary'],
      completedAssignments: 8,
      pendingAssignments: 2,
      averageScore: 92
    },
    {
      id: 'student-003',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      enrolledCourses: ['Advanced Vocabulary'],
      completedAssignments: 3,
      pendingAssignments: 4,
      averageScore: 78
    }
  ];

  useEffect(() => {
    setSubmissions(mockSubmissions);
    setStudents(mockStudents);
  }, []);

  const handleGradeSubmission = (submissionId, score, feedback) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId 
        ? { ...sub, status: 'graded', score, feedback }
        : sub
    ));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-primary-600 hover:text-primary-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Teacher Admin Panel
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentUser?.email}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">
            Review student submissions and manage course progress.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'submissions'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Student Submissions
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {submissions.filter(s => s.status === 'pending').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Student Overview
              <span className="ml-2 bg-gray-100 text-gray-900 text-xs font-medium px-2 py-0.5 rounded-full">
                {students.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {submission.assignmentTitle}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {submission.courseName} • {submission.studentName} ({submission.studentEmail})
                    </p>
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(submission.status)}`}>
                    {submission.status.toUpperCase()}
                  </span>
                </div>

                {/* Submission Content */}
                <div className="border-t border-gray-200 pt-4">
                  {submission.submissionType === 'text' && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Text Submission:</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded">
                        {submission.textSubmission}
                      </p>
                    </div>
                  )}

                  {submission.submissionType === 'quiz' && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Quiz Answers:</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        {Object.entries(submission.answers).map(([qId, answer]) => (
                          <div key={qId} className="mb-2">
                            <span className="font-medium">{qId}:</span> {JSON.stringify(answer)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {submission.submissionType === 'match' && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Matching Answers:</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        {Object.entries(submission.answers).map(([index, answer]) => (
                          <div key={index} className="mb-2">
                            <span className="font-medium">Item {parseInt(index) + 1}:</span> {answer}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Grading Section */}
                {submission.status === 'pending' && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Grade Submission</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Score (out of 100)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="input-field"
                          placeholder="Enter score"
                          id={`score-${submission.id}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Feedback
                        </label>
                        <textarea
                          className="input-field"
                          rows="3"
                          placeholder="Enter feedback for student"
                          id={`feedback-${submission.id}`}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const score = document.getElementById(`score-${submission.id}`).value;
                        const feedback = document.getElementById(`feedback-${submission.id}`).value;
                        if (score) {
                          handleGradeSubmission(submission.id, parseInt(score), feedback);
                        }
                      }}
                      className="mt-3 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
                    >
                      Submit Grade
                    </button>
                  </div>
                )}

                {/* Already Graded */}
                {submission.status === 'graded' && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Score: </span>
                        <span className="text-lg font-bold text-primary-600">{submission.score}/100</span>
                      </div>
                      {submission.feedback && (
                        <div className="max-w-md">
                          <span className="text-sm font-medium text-gray-700">Feedback: </span>
                          <span className="text-sm text-gray-600">{submission.feedback}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {students.map((student) => (
                <li key={student.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-primary-600">{student.name}</p>
                          </div>
                          <div className="flex items-center">
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="text-center">
                          <p className="font-medium text-gray-900">{student.completedAssignments}</p>
                          <p>Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900">{student.pendingAssignments}</p>
                          <p>Pending</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900">{student.averageScore}%</p>
                          <p>Average</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <p>Enrolled in: {student.enrolledCourses.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
