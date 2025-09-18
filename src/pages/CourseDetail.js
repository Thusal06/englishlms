// Course detail page with PDF content viewer and lesson management
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function CourseDetail() {
  const { courseId } = useParams();
  const { currentUser, logout } = useAuth();
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState(0);

  // Mock course data - in a real app, this would come from Firebase/database
  const courseData = {
    'grammar-fundamentals': {
      id: 'grammar-fundamentals',
      title: 'English Grammar Fundamentals',
      description: 'Master the basics of English grammar with comprehensive lessons and exercises',
      instructor: 'Dr. Sarah Johnson',
      duration: '8 weeks',
      level: 'Beginner',
      lessons: [
        {
          id: 1,
          title: 'Lesson 1 - Introduction to Parts of Speech',
          type: 'pdf',
          content: '/pdfs/lesson1-parts-of-speech.pdf',
          duration: '45 min',
          completed: true
        },
        {
          id: 2,
          title: 'Lesson 2 - Nouns and Pronouns',
          type: 'pdf',
          content: '/pdfs/lesson2-nouns-pronouns.pdf',
          duration: '50 min',
          completed: true
        },
        {
          id: 3,
          title: 'Lesson 3 - Verbs and Tenses',
          type: 'pdf',
          content: '/pdfs/lesson3-verbs-tenses.pdf',
          duration: '60 min',
          completed: false
        },
        {
          id: 4,
          title: 'Lesson 4 - Adjectives and Adverbs',
          type: 'pdf',
          content: '/pdfs/lesson4-adjectives-adverbs.pdf',
          duration: '40 min',
          completed: false
        },
        {
          id: 5,
          title: 'Lesson 5 - Sentence Structure',
          type: 'pdf',
          content: '/pdfs/lesson5-sentence-structure.pdf',
          duration: '55 min',
          completed: false
        },
        {
          id: 6,
          title: 'Lesson 6 - Punctuation and Capitalization',
          type: 'pdf',
          content: '/pdfs/lesson6-punctuation.pdf',
          duration: '45 min',
          completed: false
        },
        {
          id: 7,
          title: 'Lesson 7 - Complex Sentence Patterns',
          type: 'pdf',
          content: '/pdfs/lesson7-complex-sentences.pdf',
          duration: '50 min',
          completed: false
        }
      ],
      assignments: [
        {
          id: 'grammar-assignment-1',
          title: 'Grammar Practice Assignment 1',
          description: 'Complete exercises on parts of speech and sentence structure',
          dueDate: '2024-01-15'
        },
        {
          id: 'grammar-assignment-2',
          title: 'Grammar Practice Assignment 2',
          description: 'Advanced grammar exercises and essay writing',
          dueDate: '2024-01-22'
        }
      ]
    },
    'advanced-vocabulary': {
      id: 'advanced-vocabulary',
      title: 'Advanced Vocabulary',
      description: 'Expand your English vocabulary with advanced words and expressions',
      instructor: 'Prof. Michael Chen',
      duration: '7 weeks',
      level: 'Advanced',
      lessons: [
        {
          id: 1,
          title: 'Lesson 1 - Academic Vocabulary',
          type: 'pdf',
          content: '/pdfs/vocab1-academic.pdf',
          duration: '35 min',
          completed: false
        },
        {
          id: 2,
          title: 'Lesson 2 - Business English Terms',
          type: 'pdf',
          content: '/pdfs/vocab2-business.pdf',
          duration: '40 min',
          completed: false
        },
        {
          id: 3,
          title: 'Lesson 3 - Scientific and Technical Vocabulary',
          type: 'pdf',
          content: '/pdfs/vocab3-scientific.pdf',
          duration: '45 min',
          completed: false
        },
        {
          id: 4,
          title: 'Lesson 4 - Idiomatic Expressions',
          type: 'pdf',
          content: '/pdfs/vocab4-idioms.pdf',
          duration: '50 min',
          completed: false
        },
        {
          id: 5,
          title: 'Lesson 5 - Phrasal Verbs and Collocations',
          type: 'pdf',
          content: '/pdfs/vocab5-phrasal-verbs.pdf',
          duration: '55 min',
          completed: false
        },
        {
          id: 6,
          title: 'Lesson 6 - Advanced Synonyms and Antonyms',
          type: 'pdf',
          content: '/pdfs/vocab6-synonyms.pdf',
          duration: '40 min',
          completed: false
        },
        {
          id: 7,
          title: 'Lesson 7 - Context-Based Vocabulary Usage',
          type: 'pdf',
          content: '/pdfs/vocab7-context.pdf',
          duration: '45 min',
          completed: false
        }
      ],
      assignments: [
        {
          id: 'vocab-assignment-1',
          title: 'Vocabulary Building Assignment 1',
          description: 'Create sentences using advanced vocabulary words',
          dueDate: '2024-01-18'
        },
        {
          id: 'vocab-assignment-2',
          title: 'Vocabulary Building Assignment 2',
          description: 'Write a comprehensive essay using advanced vocabulary',
          dueDate: '2024-01-25'
        }
      ]
    },
    'business-english': {
      id: 'business-english',
      title: 'Business English',
      description: 'Professional English communication skills for the workplace',
      instructor: 'Ms. Jennifer Williams',
      duration: '6 weeks',
      level: 'Intermediate',
      lessons: [
        {
          id: 1,
          title: 'Lesson 1 - Professional Email Writing',
          type: 'pdf',
          content: '/pdfs/business1-emails.pdf',
          duration: '40 min',
          completed: true
        },
        {
          id: 2,
          title: 'Lesson 2 - Meeting and Presentation Skills',
          type: 'pdf',
          content: '/pdfs/business2-meetings.pdf',
          duration: '45 min',
          completed: true
        },
        {
          id: 3,
          title: 'Lesson 3 - Negotiation Language',
          type: 'pdf',
          content: '/pdfs/business3-negotiation.pdf',
          duration: '50 min',
          completed: true
        },
        {
          id: 4,
          title: 'Lesson 4 - Report Writing',
          type: 'pdf',
          content: '/pdfs/business4-reports.pdf',
          duration: '55 min',
          completed: true
        },
        {
          id: 5,
          title: 'Lesson 5 - Customer Service Communication',
          type: 'pdf',
          content: '/pdfs/business5-customer-service.pdf',
          duration: '45 min',
          completed: true
        },
        {
          id: 6,
          title: 'Lesson 6 - Cross-Cultural Communication',
          type: 'pdf',
          content: '/pdfs/business6-cross-cultural.pdf',
          duration: '50 min',
          completed: true
        },
        {
          id: 7,
          title: 'Lesson 7 - Leadership Communication',
          type: 'pdf',
          content: '/pdfs/business7-leadership.pdf',
          duration: '45 min',
          completed: true
        }
      ],
      assignments: [
        {
          id: 'business-assignment-1',
          title: 'Business Communication Assignment 1',
          description: 'Write professional emails and meeting minutes',
          dueDate: '2024-01-20'
        },
        {
          id: 'business-assignment-2',
          title: 'Business Communication Assignment 2',
          description: 'Create a business presentation and report',
          dueDate: '2024-01-27'
        }
      ]
    }
  };

  useEffect(() => {
    const courseInfo = courseData[courseId];
    if (courseInfo) {
      setCourse(courseInfo);
      setSelectedLesson(courseInfo.lessons[0]);
      
      // Calculate progress
      const completedLessons = courseInfo.lessons.filter(lesson => lesson.completed).length;
      const progressPercentage = (completedLessons / courseInfo.lessons.length) * 100;
      setProgress(progressPercentage);
    }
  }, [courseId]);

  const handleLessonComplete = (lessonId) => {
    const updatedCourse = { ...course };
    const lesson = updatedCourse.lessons.find(l => l.id === lessonId);
    if (lesson) {
      lesson.completed = true;
      setCourse(updatedCourse);
      
      // Recalculate progress
      const completedLessons = updatedCourse.lessons.filter(l => l.completed).length;
      const progressPercentage = (completedLessons / updatedCourse.lessons.length) * 100;
      setProgress(progressPercentage);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

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
                English LMS
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
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>👨‍🏫 {course.instructor}</span>
                <span>⏱️ {course.duration}</span>
                <span>📊 {course.level}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">{Math.round(progress)}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lesson Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Lessons</h3>
              <div className="space-y-2">
                {course.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                      selectedLesson?.id === lesson.id
                        ? 'bg-primary-100 border-2 border-primary-300'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-gray-500">{lesson.duration}</p>
                      </div>
                      <div className="ml-2">
                        {lesson.completed ? (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
                
                {/* Course Assignments Section */}
                {course.assignments && course.assignments.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Course Assignments</h4>
                    <div className="space-y-2">
                      {course.assignments.map((assignment, index) => (
                        <Link
                          key={assignment.id}
                          to={`/assignment/${assignment.id}`}
                          className="block w-full text-left p-3 bg-accent-50 hover:bg-accent-100 border-2 border-accent-200 rounded-lg transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 text-sm mb-1">
                                Assignment {index + 1}
                              </h5>
                              <p className="text-xs text-gray-600 mb-1">{assignment.title}</p>
                              <p className="text-xs text-gray-500">Due: {assignment.dueDate}</p>
                            </div>
                            <div className="ml-2">
                              <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {selectedLesson && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedLesson.title}
                    </h2>
                    <p className="text-gray-600">Duration: {selectedLesson.duration}</p>
                  </div>
                  {!selectedLesson.completed && (
                    <button
                      onClick={() => handleLessonComplete(selectedLesson.id)}
                      className="btn-primary"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>

                {/* PDF Viewer */}
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="mb-4">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Content</h3>
                    <p className="text-gray-600 mb-4">
                      This lesson contains PDF material: {selectedLesson.content}
                    </p>
                  </div>
                  
                  {/* PDF Placeholder - In a real app, you'd use a PDF viewer like react-pdf */}
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                    <p className="text-gray-500 mb-4">
                      📄 PDF Viewer would be embedded here
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      File: {selectedLesson.content}
                    </p>
                    <button className="btn-primary">
                      Download PDF
                    </button>
                  </div>

                  <div className="text-sm text-gray-500">
                    <p>💡 <strong>Note:</strong> In a production environment, this would display the actual PDF content using a library like react-pdf or PDF.js</p>
                  </div>
                </div>

                {/* Lesson Actions */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex space-x-4">
                    <Link 
                      to={`/notes/${course.id}/${selectedLesson.id}`}
                      className="btn-secondary"
                    >
                      📝 Take Notes
                    </Link>
                    <Link 
                      to={`/discussion/${course.id}`}
                      className="btn-secondary"
                    >
                      💬 Discussion
                    </Link>
                  </div>
                  
                  {selectedLesson.completed && (
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Lesson Completed
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
