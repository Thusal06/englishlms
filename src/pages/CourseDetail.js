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
            <ul class="space-y-3">
              <li>
                <p><strong>Backlog:</strong> A list of all the work a team needs to complete (features, bug fixes, tasks), prioritized for development.</p>
                <p><em>Example:</em> “We’ll pick the next task from the backlog.”</p>
              </li>
              <li>
                <p><strong>Bandwidth:</strong> A team’s or individual’s capacity to take on new work.</p>
                <p><em>Example:</em> “We don’t have the bandwidth to add that feature this sprint.”</p>
              </li>
              <li>
                <p><strong>Black economy:</strong> Unrecorded and untaxed economic activity, often informal or illegal.</p>
                <p><em>Example:</em> “Some freelance jobs done without invoices contribute to the black economy.”</p>
              </li>
              <li>
                <p><strong>Blow-by-blow:</strong> A detailed, step-by-step account of an event or process.</p>
                <p><em>Example:</em> “The team lead gave us a blow-by-blow explanation of the release issue.”</p>
              </li>
              <li>
                <p><strong>Bottleneck:</strong> A point where the flow of work slows or halts due to constraints.</p>
                <p><em>Example:</em> “Code reviews are creating a bottleneck in our process.”</p>
              </li>
              <li>
                <p><strong>Go‑to‑market (GTM):</strong> The strategy to launch a new product or service (marketing, sales, distribution, pricing).</p>
                <p><em>Example:</em> “The go‑to‑market plan for our app targets small businesses first.”</p>
              </li>
              <li>
                <p><strong>Onboarding:</strong> The process of welcoming and integrating a new employee into the company and team.</p>
                <p><em>Example:</em> “The onboarding program includes training sessions and mentorship.”</p>
              </li>
              <li>
                <p><strong>Stand‑up:</strong> A short, daily team meeting where members share updates, plans, and blockers.</p>
                <p><em>Example:</em> “During today’s stand‑up, I’ll update on the bug fix progress.”</p>
              </li>
              <li>
                <p><strong>Sprint:</strong> A short, fixed period (usually 1–4 weeks) for completing selected tasks from the backlog.</p>
                <p><em>Example:</em> “This sprint focuses on developing the payment feature.”</p>
              </li>
              <li>
                <p><strong>Sync‑up:</strong> A quick meeting to align on status, progress, or plans.</p>
                <p><em>Example:</em> “Let’s have a quick sync‑up before the client call.”</p>
              </li>
              <li>
                <p><strong>Back to the drawing board:</strong> Start over after a failed or flawed attempt.</p>
                <p><em>Example:</em> “The prototype didn’t work, so it’s back to the drawing board.”</p>
              </li>
            </ul>
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
            <ul class="space-y-3">
              <li>
                <p><strong>Bug:</strong> An error or flaw in software that causes unexpected or incorrect results.</p>
                <p><em>Example:</em> “We need to fix this login bug before the next release.”</p>
              </li>
              <li>
                <p><strong>Debugging:</strong> The process of finding and fixing bugs in a program.</p>
                <p><em>Example:</em> “She spent the afternoon debugging the payment module.”</p>
              </li>
              <li>
                <p><strong>Root cause:</strong> The main underlying reason for a problem or issue.</p>
                <p><em>Example:</em> “The root cause of the crash was a memory leak.”</p>
              </li>
              <li>
                <p><strong>Workaround:</strong> A temporary solution to bypass a problem until a permanent fix is applied.</p>
                <p><em>Example:</em> “As a workaround, restart the server every two hours.”</p>
              </li>
              <li>
                <p><strong>Patch:</strong> A small update designed to fix bugs or vulnerabilities in software.</p>
                <p><em>Example:</em> “The security team released a patch for the critical vulnerability.”</p>
              </li>
              <li>
                <p><strong>Escalate:</strong> Transfer a problem to a higher level of support or authority when it can’t be resolved at the current level.</p>
                <p><em>Example:</em> “If the issue persists, we’ll escalate it to the senior developer.”</p>
              </li>
              <li>
                <p><strong>Troubleshoot:</strong> Systematically identify and solve problems using a step‑by‑step process.</p>
                <p><em>Example:</em> “Let’s troubleshoot the network connection before calling IT.”</p>
              </li>
              <li>
                <p><strong>Rollback:</strong> Revert a system, application, or codebase to a previous stable version.</p>
                <p><em>Example:</em> “We had to rollback the update because of unexpected errors.”</p>
              </li>
              <li>
                <p><strong>System crash:</strong> When a computer or application stops functioning completely and often requires a restart.</p>
                <p><em>Example:</em> “The server had a system crash during peak hours.”</p>
              </li>
              <li>
                <p><strong>Hotfix:</strong> An immediate, urgent software update that solves a specific critical problem.</p>
                <p><em>Example:</em> “The team deployed a hotfix to resolve the login issue overnight.”</p>
              </li>
            </ul>
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
          title: 'Lesson 3 - Delivering Technical Presentations',
          type: 'content',
          content: `
            <h3>Delivering Technical Presentations</h3>

            <h4>1. Clarity</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>Use short, precise sentences.</li>
              <li>Avoid jargon unless essential; define terms immediately.</li>
              <li>Explain acronyms on first use (e.g., API = Application Programming Interface).</li>
              <li>Repeat key points for emphasis.</li>
            </ul>
            <p class="mt-2"><strong>Example:</strong> "The system uses a REST API (Representational State Transfer Application Programming Interface) so applications can communicate efficiently over the internet."</p>

            <h4 class="mt-6">2. Structure</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>Plan: introduction → main points → conclusion.</li>
              <li>Use linking words: first of all, next, finally.</li>
              <li>Split content into clear sections.</li>
            </ul>
            <p class="mt-2"><strong>Example:</strong> "First of all, I’ll describe the architecture. Next, I’ll explain deployment. Finally, I’ll summarize the advantages."</p>

            <h4 class="mt-6">3. Guidance (Signposting)</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>Introduce sections: "Now, I’d like to move on to…"</li>
              <li>Highlight key points: "It’s important to note that…"</li>
              <li>Summarize before moving on: "So far, we’ve seen…"</li>
            </ul>
            <p class="mt-2"><strong>Example:</strong> "Now, let’s move on to testing. It’s important to note that automated tests cover over 80% of the code."</p>

            <h4 class="mt-6">4. Support (Visual Aids)</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>Keep slides uncluttered; prefer bullet points, diagrams, and screenshots.</li>
              <li>Label diagrams clearly.</li>
              <li>Don’t read slides verbatim; use them as prompts.</li>
              <li>Use animations sparingly to highlight steps.</li>
            </ul>
            <p class="mt-2"><strong>Example:</strong> Show a deployment flowchart while explaining each step.</p>

            <h4 class="mt-6">5. Engagement</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>Ask rhetorical questions: "What happens if the server fails here?"</li>
              <li>Pause to let key points sink in.</li>
              <li>Summarize takeaways at the end of sections.</li>
              <li>Invite questions at suitable moments.</li>
            </ul>
            <p class="mt-2"><strong>Example:</strong> "To sum up, automating code review reduces errors significantly."</p>

            <h4 class="mt-6">Integrated Mini‑Presentation</h4>
            <p>"Good morning. Today, I’ll cover our automated testing framework. First, the architecture. Next, a live test run. It’s important to note this reduces manual testing by 50%. Now, dashboards for results. Finally, I’ll summarize benefits and take questions."</p>

            <h4 class="mt-6">Key Takeaways</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Clarity</strong> makes your message understandable.</li>
              <li><strong>Structure</strong> organizes ideas logically.</li>
              <li><strong>Guidance</strong> helps the audience follow your flow.</li>
              <li><strong>Support</strong> with visuals reinforces key points.</li>
              <li><strong>Engagement</strong> keeps attention and invites interaction.</li>
            </ul>
          `,
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
          title: 'Lesson 7 – Negotiation',
          type: 'content',
          content: `
            <h3>Negotiation</h3>
            <p>Use clear, professional language to propose solutions, align expectations, and reach agreements.</p>

            <h4>1. Opening</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>“Let’s discuss how we can work this out.”</li>
              <li>“I’d like to explore possible solutions.”</li>
              <li>“Can we review the requirements together?”</li>
            </ul>

            <h4 class="mt-4">2. Proposals</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>“What if we tried this approach instead?”</li>
              <li>“We could consider adjusting the timeline to…”</li>
              <li>“One option might be to…”</li>
            </ul>

            <h4 class="mt-4">3. Agreement (Full/Partial)</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>“That sounds reasonable, but …”</li>
              <li>“I can work with that if we …”</li>
              <li>“We’re aligned on X; now let’s look at Y.”</li>
            </ul>

            <h4 class="mt-4">4. Polite Disagreement</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>“I’m not sure that will work because …”</li>
              <li>“I understand your point, but we might face challenges with …”</li>
              <li>“That could be difficult to implement due to …”</li>
            </ul>

            <h4 class="mt-4">5. Clarifying / Summarizing</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>“Just to clarify, you’re suggesting … ?”</li>
              <li>“If I understand correctly, we agree on …”</li>
              <li>“Let’s make sure we’re on the same page regarding …”</li>
            </ul>

            <h4 class="mt-4">6. Closing</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>“Can we agree to move forward with this plan?”</li>
              <li>“Let’s document the agreed points and proceed.”</li>
              <li>“I think we have a workable solution.”</li>
            </ul>

            <h4 class="mt-4">Tips for Software Engineers</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>Use neutral, professional language; avoid emotional phrasing.</li>
              <li>Focus on facts and solutions, not personalities.</li>
              <li>Pair phrases with technical rationale when discussing timelines, features, or resources.</li>
            </ul>
          `,
          duration: '45 min',
          completed: false
        }
      ],
      assignments: [
        {
          id: 'business-assignment-1',
          title: 'Assignment 1: Match the Negotiation Phrase',
          description: 'Match negotiation phrases (Column A) to their functions (Column B).',
          dueDate: '2025-10-10'
        },
        {
          id: 'business-assignment-2',
          title: 'Assignment 2: Complete the Dialogue',
          description: 'Drag phrases from the word bank to complete a negotiation dialogue.',
          dueDate: '2025-10-20'
        },
        {
          id: 'business-assignment-3',
          title: 'Final Assignment: 3‑Minute Technical Presentation (Video)',
          description: 'Record and upload a 3-minute technical presentation video.',
          dueDate: '2025-11-30'
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
