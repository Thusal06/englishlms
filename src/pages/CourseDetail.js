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
          type: 'content',
          content: 'Content will be added here...',
          duration: '45 min',
          completed: false
        },
        {
          id: 2,
          title: 'Lesson 2 - Nouns and Pronouns',
          type: 'content',
          content: 'Content will be added here...',
          duration: '50 min',
          completed: false
        },
        {
          id: 3,
          title: 'Lesson 3 - Verbs and Tenses',
          type: 'content',
          content: 'Content will be added here...',
          duration: '60 min',
          completed: false
        },
        {
          id: 4,
          title: 'Lesson 4 - Adjectives and Adverbs',
          type: 'content',
          content: 'Content will be added here...',
          duration: '40 min',
          completed: false
        },
        {
          id: 5,
          title: 'Lesson 5 - Sentence Structure',
          type: 'content',
          content: 'Content will be added here...',
          duration: '55 min',
          completed: false
        },
        {
          id: 6,
          title: 'Lesson 6 - Punctuation and Capitalization',
          type: 'content',
          content: 'Content will be added here...',
          duration: '45 min',
          completed: false
        },
        {
          id: 7,
          title: 'Lesson 7 - Complex Sentence Patterns',
          type: 'content',
          content: 'Content will be added here...',
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
          title: 'Lesson 1 - Workplace Jargon',
          type: 'content',
          content: `
            <h3>Workplace Jargon</h3>
            <p>Workplace jargon refers to the special words and expressions used in professional environments. Knowing these terms helps software engineers and other professionals communicate effectively in meetings, projects, and team discussions.</p>
            <ol>
              <li>
                <strong>Backlog</strong><br/>
                A list of all the work that a team needs to complete, including features, bug fixes, and other tasks, prioritized for development.<br/>
                <em>Example:</em> “We’ll pick the next task from the backlog.”
              </li>
              <li>
                <strong>Bandwidth</strong><br/>
                Refers to a team’s or individual’s capacity to take on new work.<br/>
                <em>Example:</em> “We don’t have the bandwidth to add that feature this sprint.”
              </li>
              <li>
                <strong>Black Economy</strong><br/>
                Economic activity that is unrecorded and untaxed by the government, often linked to informal or illegal transactions.<br/>
                <em>Example:</em> “Some freelance jobs done without invoices contribute to the black economy.”
              </li>
              <li>
                <strong>Blow-by-blow</strong><br/>
                A detailed, step-by-step account of an event or process.<br/>
                <em>Example:</em> “The team lead gave us a blow-by-blow explanation of the release issue.”
              </li>
              <li>
                <strong>Bottleneck</strong><br/>
                A point where the flow of work slows or halts due to constraints.<br/>
                <em>Example:</em> “Code reviews are creating a bottleneck in our process.”
              </li>
              <li>
                <strong>Go-to-Market (GTM)</strong><br/>
                The strategy a company uses to launch a new product or service, covering marketing, sales, distribution, and pricing.<br/>
                <em>Example:</em> “The go-to-market plan for our app targets small businesses first.”
              </li>
              <li>
                <strong>Onboarding</strong><br/>
                The process of welcoming and integrating a new employee into the company and team.<br/>
                <em>Example:</em> “The onboarding program includes training sessions and mentorship.”
              </li>
              <li>
                <strong>Stand-up</strong><br/>
                A short, daily team meeting where members share updates, plans, and blockers.<br/>
                <em>Example:</em> “During today’s stand-up, I’ll update on the bug fix progress.”
              </li>
              <li>
                <strong>Sprint</strong><br/>
                A short, fixed period (usually 1–4 weeks) in which a team completes a set of tasks from the backlog.<br/>
                <em>Example:</em> “This sprint focuses on developing the payment feature.”
              </li>
              <li>
                <strong>Sync-up</strong><br/>
                A meeting or discussion to align the team on project status, progress, or plans.<br/>
                <em>Example:</em> “Let’s have a quick sync-up before the client call.”
              </li>
              <li>
                <strong>Back to the Drawing Board</strong><br/>
                An expression meaning to start over after a failed or flawed attempt.<br/>
                <em>Example:</em> “The prototype didn’t work, so it’s back to the drawing board.”
              </li>
            </ol>
          `,
          duration: '35 min',
          completed: false
        },
        {
          id: 2,
          title: 'Lesson 2 - Business English Terms',
          type: 'content',
          content: 'Content will be added here...',
          duration: '40 min',
          completed: false
        },
        {
          id: 3,
          title: 'Lesson 3 - Scientific and Technical Vocabulary',
          type: 'content',
          content: 'Content will be added here...',
          duration: '45 min',
          completed: false
        },
        {
          id: 4,
          title: 'Lesson 4 - Idiomatic Expressions',
          type: 'content',
          content: 'Content will be added here...',
          duration: '50 min',
          completed: false
        },
        {
          id: 5,
          title: 'Lesson 5 - Phrasal Verbs and Collocations',
          type: 'content',
          content: 'Content will be added here...',
          duration: '55 min',
          completed: false
        },
        {
          id: 6,
          title: 'Lesson 6 - Problem-Solving & Troubleshooting Vocabulary',
          type: 'content',
          content: `
            <h3>Problem-Solving & Troubleshooting Vocabulary</h3>
            <p>Problem-solving and troubleshooting are essential skills in software engineering. These words and phrases help professionals identify issues, analyze causes, and propose solutions effectively.</p>
            <ol>
              <li>
                <strong>Bug</strong><br/>
                An error or flaw in software that causes unexpected or incorrect results.<br/>
                <em>Example:</em> “We need to fix this login bug before the next release.”
              </li>
              <li>
                <strong>Debugging</strong><br/>
                The process of finding and fixing bugs in a program.<br/>
                <em>Example:</em> “She spent the afternoon debugging the payment module.”
              </li>
              <li>
                <strong>Root Cause</strong><br/>
                The main underlying reason for a problem or issue.<br/>
                <em>Example:</em> “The root cause of the crash was a memory leak.”
              </li>
              <li>
                <strong>Workaround</strong><br/>
                A temporary solution to bypass a problem until a permanent fix is applied.<br/>
                <em>Example:</em> “As a workaround, restart the server every two hours.”
              </li>
              <li>
                <strong>Patch</strong><br/>
                A small update designed to fix bugs or vulnerabilities in software.<br/>
                <em>Example:</em> “The security team released a patch for the critical vulnerability.”
              </li>
              <li>
                <strong>Escalate</strong><br/>
                To transfer a problem to a higher level of support or authority when it cannot be resolved at the current level.<br/>
                <em>Example:</em> “If the issue persists, we’ll escalate it to the senior developer.”
              </li>
              <li>
                <strong>Troubleshoot</strong><br/>
                To systematically identify and solve problems, often using a step-by-step process.<br/>
                <em>Example:</em> “Let’s troubleshoot the network connection before calling IT.”
              </li>
              <li>
                <strong>Rollback</strong><br/>
                Reverting a system, application, or codebase to a previous stable version.<br/>
                <em>Example:</em> “We had to rollback the update because of unexpected errors.”
              </li>
              <li>
                <strong>System Crash</strong><br/>
                When a computer or application stops functioning completely, often requiring a restart.<br/>
                <em>Example:</em> “The server had a system crash during peak hours.”
              </li>
              <li>
                <strong>Hotfix</strong><br/>
                An immediate and urgent software update designed to solve a specific critical problem.<br/>
                <em>Example:</em> “The team deployed a hotfix to resolve the login issue overnight.”
              </li>
            </ol>
          `,
          duration: '40 min',
          completed: false
        },
        {
          id: 7,
          title: 'Lesson 7 - Context-Based Vocabulary Usage',
          type: 'content',
          content: 'Content will be added here...',
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
          type: 'content',
          content: 'Content will be added here...',
          duration: '40 min',
          completed: false
        },
        {
          id: 2,
          title: 'Lesson 2 - Meeting and Presentation Skills',
          type: 'content',
          content: 'Content will be added here...',
          duration: '45 min',
          completed: false
        },
        {
          id: 3,
          title: 'Lesson 3 - Negotiation Language',
          type: 'content',
          content: 'Content will be added here...',
          duration: '50 min',
          completed: false
        },
        {
          id: 4,
          title: 'Lesson 4 - Report Writing',
          type: 'content',
          content: 'Content will be added here...',
          duration: '55 min',
          completed: false
        },
        {
          id: 5,
          title: 'Lesson 5 - Customer Service Communication',
          type: 'content',
          content: 'Content will be added here...',
          duration: '45 min',
          completed: false
        },
        {
          id: 6,
          title: 'Lesson 6 - Cross-Cultural Communication',
          type: 'content',
          content: 'Content will be added here...',
          duration: '50 min',
          completed: false
        },
        {
          id: 7,
          title: 'Lesson 7 - Leadership Communication',
          type: 'content',
          content: 'Content will be added here...',
          duration: '45 min',
          completed: false
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

                {/* Lesson Content */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-6">
                    {selectedLesson.content === 'Content will be added here...' ? (
                      <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Lesson Content</h3>
                        <p className="text-gray-600 mb-4">
                          Content for this lesson will be added soon.
                        </p>
                        <div className="text-sm text-gray-500">
                          <p>📝 This area will display the lesson content including text, tables, and other educational materials.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-lg max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                      </div>
                    )}
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
