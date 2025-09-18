// Interactive quiz page with questions, answers, and scoring
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function QuizDetail() {
  const { quizId } = useParams();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [hasStarted, setHasStarted] = useState(true); // default true for normal quizzes, false for audio-fill
  const [audioPlays, setAudioPlays] = useState(0);
  const audioRef = useRef(null);
  const [fillAnswers, setFillAnswers] = useState({}); // {index: text}

  // Mock quiz data
  const quizData = {
    'present-perfect': {
      id: 'present-perfect',
      title: 'Present Perfect Tense',
      description: 'Test your understanding of present perfect tense usage',
      timeLimit: 900, // 15 minutes in seconds
      questions: [
        {
          id: 1,
          question: 'Which sentence correctly uses the present perfect tense?',
          options: [
            'I have visited Paris last year.',
            'I have visited Paris before.',
            'I visited Paris before.',
            'I am visiting Paris before.'
          ],
          correctAnswer: 1,
          explanation: 'Present perfect is used for experiences without specific time references. "Before" indicates an indefinite time in the past.'
        },
        {
          id: 2,
          question: 'Complete the sentence: "She _____ her homework yet."',
          options: [
            "didn't finish",
            "hasn't finished",
            "don't finish",
            "isn't finishing"
          ],
          correctAnswer: 1,
          explanation: 'Present perfect negative with "yet" uses "hasn\'t/haven\'t + past participle".'
        },
        {
          id: 3,
          question: 'Which time expression is commonly used with present perfect?',
          options: [
            'yesterday',
            'last week',
            'already',
            'two hours ago'
          ],
          correctAnswer: 2,
          explanation: '"Already" is commonly used with present perfect to show that something happened before now.'
        },
        {
          id: 4,
          question: 'Choose the correct form: "How long _____ you _____ English?"',
          options: [
            'do / study',
            'are / studying',
            'have / studied',
            'did / study'
          ],
          correctAnswer: 2,
          explanation: 'Present perfect is used with "How long" to ask about duration from past to present.'
        },
        {
          id: 5,
          question: 'Which sentence is incorrect?',
          options: [
            'I have lived here for five years.',
            'I have been to Japan twice.',
            'I have seen that movie yesterday.',
            'I have never eaten sushi.'
          ],
          correctAnswer: 2,
          explanation: 'Present perfect cannot be used with specific past time expressions like "yesterday".'
        }
      ]
    },
    'phrasal-verbs': {
      id: 'phrasal-verbs',
      title: 'Phrasal Verbs',
      description: 'Common phrasal verbs in English',
      timeLimit: 600, // 10 minutes
      questions: [
        {
          id: 1,
          question: 'What does "give up" mean?',
          options: [
            'to surrender or quit',
            'to give something as a gift',
            'to move upward',
            'to become angry'
          ],
          correctAnswer: 0,
          explanation: '"Give up" means to stop trying or to surrender.'
        },
        {
          id: 2,
          question: 'Complete: "Please _____ the lights when you leave."',
          options: [
            'turn up',
            'turn down',
            'turn off',
            'turn on'
          ],
          correctAnswer: 2,
          explanation: '"Turn off" means to switch off or stop something from operating.'
        }
      ]
    },
    'quiz-1': {
      id: 'quiz-1',
      title: 'Polite Communication, Articles, and Reported Speech',
      description: 'Test polite disagreement, requests, intercultural etiquette, hedging, articles, and reported speech.',
      timeLimit: 300, // 5 minutes
      questions: [
        {
          id: 1,
          question: 'Which phrase best shows polite disagreement?',
          options: [
            '“You are wrong.”',
            '“I see it differently because…”',
            '“No, that’s not right.”'
          ],
          correctAnswer: 1,
          explanation: 'Using “I see it differently because…” shows respectful disagreement with justification.'
        },
        {
          id: 2,
          question: 'How would you politely ask a colleague to review your code by Friday in an email?',
          options: [
            '“Review my code by Friday.”',
            '“Could you please review my code by Friday?”',
            '“You must review my code by Friday.”'
          ],
          correctAnswer: 1,
          explanation: '“Could you please…” is a polite request form suitable for emails.'
        },
        {
          id: 3,
          question: 'When working with colleagues from India, which of these is true about meeting times?',
          options: [
            'Meetings always start exactly on time.',
            'Meetings may start a bit later and respect for seniority is important.',
            'Interrupting others is acceptable.'
          ],
          correctAnswer: 1,
          explanation: 'Cultural expectations may differ; showing respect and flexibility is important.'
        },
        {
          id: 4,
          question: 'Which of the following is appropriate email closing?',
          options: [
            '“Cheers!”',
            '“Best regards,”',
            '“Bye!”'
          ],
          correctAnswer: 1,
          explanation: '“Best regards,” is a professional closing for business emails.'
        },
        {
          id: 5,
          question: 'Which sentence uses a hedging phrase to soften a criticism?',
          options: [
            '“Your code is wrong.”',
            '“I think there might be some errors in your code.”',
            '“Fix this immediately.”'
          ],
          correctAnswer: 1,
          explanation: 'Hedging (e.g., “might”, “I think”) softens the message.'
        },
        {
          id: 6,
          question: 'Complete the sentence with a hedging word: “We ______ need to update the documentation.”',
          options: ['might', 'must', 'will'],
          correctAnswer: 0,
          explanation: '“Might” hedges the statement and sounds less forceful.'
        },
        {
          id: 7,
          question: 'Choose the best phrase to make a polite suggestion:',
          options: [
            '“Change the design.”',
            '“Perhaps we could consider a new design.”',
            '“Do this now.”'
          ],
          correctAnswer: 1,
          explanation: '“Perhaps we could…” is a polite, collaborative suggestion.'
        },
        {
          id: 8,
          question: 'Convert this direct speech to reported speech: The manager said, “We will launch the app next month.”',
          options: ['will', 'would', 'can'],
          correctAnswer: 1,
          explanation: 'In reported speech, “will” typically changes to “would”.'
        },
        {
          id: 9,
          question: 'How would you report this question? Direct: “Have you fixed the bug?”',
          options: ['had fixed', 'have fixed', 'fixed'],
          correctAnswer: 0,
          explanation: 'Past perfect “had fixed” is used after “asked if”.'
        },
        {
          id: 10,
          question: 'Choose the correct reported speech for this command: “Please update the code.”',
          options: ['to update', 'updating', 'update'],
          correctAnswer: 0,
          explanation: 'Commands/requests are reported with an infinitive: “asked me to update…”.'
        },
        {
          id: 11,
          question: 'Fill in the blank with the correct article: “I found ___ error in the system.”',
          options: ['an', 'a', 'the', '(no article)'],
          correctAnswer: 0,
          explanation: '“Error” begins with a vowel sound; use “an”.'
        },
        {
          id: 12,
          question: 'Which sentence is correct?',
          options: [
            '“Please review a documentation.”',
            '“Please review the documentation.”',
            '“Please review documentation.”'
          ],
          correctAnswer: 1,
          explanation: '“The documentation” is the correct definite reference in this context.'
        },
        {
          id: 13,
          question: 'Choose the right article: “___ server needs to restart after the update.”',
          options: ['A', 'An', 'The', '(no article)'],
          correctAnswer: 2,
          explanation: 'Use “The” to refer to a specific known server.'
        },
        {
          id: 14,
          question: 'Fill in the blank: “Bugs are common in ___ software development process.”',
          options: ['a', 'an', 'the', '(no article)'],
          correctAnswer: 2,
          explanation: '“the software development process” refers to a known concept/process.'
        },
        {
          id: 15,
          question: 'When communicating with a Japanese colleague who prefers indirect communication, which phrase is most appropriate?',
          options: [
            '“You made a mistake in the code.”',
            '“It might be helpful to review the code together.”',
            '“Fix your mistakes immediately.”'
          ],
          correctAnswer: 1,
          explanation: 'An indirect, collaborative tone is culturally appropriate.'
        }
      ]
    },
    'quiz-2': {
      id: 'quiz-2',
      title: 'Negotiation and Workplace Jargon',
      description: 'Assess your understanding of negotiation phrases and common workplace terminology.',
      timeLimit: 300, // 5 minutes
      questions: [
        {
          id: 1,
          question: 'Which phrase is used to politely disagree in a negotiation?',
          options: [
            '“Can we agree to move forward with this plan?”',
            '“I understand your point, but we might face challenges with…”',
            '“Let’s discuss how we can work this out.”',
            '“Just to clarify, you’re suggesting…?”'
          ],
          correctAnswer: 1,
          explanation: 'This acknowledges the point while presenting concerns—polite disagreement.'
        },
        {
          id: 2,
          question: 'What does backlog mean in software projects?',
          options: [
            'A detailed report of project risks',
            'A list of tasks and features to complete',
            'A daily stand-up meeting',
            'A project delay'
          ],
          correctAnswer: 1,
          explanation: 'The backlog contains prioritized work items for upcoming sprints.'
        },
        {
          id: 3,
          question: 'Which phrase helps clarify understanding in a meeting?',
          options: [
            '“Just to clarify, you’re suggesting…?”',
            '“That sounds reasonable, but…”',
            '“What if we tried this approach instead?”',
            '“Can we agree to move forward with this plan?”'
          ],
          correctAnswer: 0,
          explanation: '“Just to clarify…” is used to confirm or restate understanding.'
        },
        {
          id: 4,
          question: 'A bottleneck in a project refers to:',
          options: [
            'A point where progress slows due to constraints',
            'A marketing strategy',
            'A team meeting',
            'A final project report'
          ],
          correctAnswer: 0,
          explanation: 'A bottleneck restricts flow and slows progress.'
        },
        {
          id: 5,
          question: 'The term bandwidth in project management refers to:',
          options: [
            'Network speed',
            'Team or individual capacity to take on work',
            'The number of meetings per week',
            'Budget allocation'
          ],
          correctAnswer: 1,
          explanation: '“Bandwidth” is figurative capacity to do work.'
        },
        {
          id: 6,
          question: 'Which phrase is used to suggest an alternative solution politely?',
          options: [
            '“I understand your point, but…”',
            '“What if we tried this approach instead?”',
            '“Can we agree to move forward with this plan?”',
            '“Just to clarify, you’re suggesting…?”'
          ],
          correctAnswer: 1,
          explanation: '“What if we tried…” proposes an alternative respectfully.'
        },
        {
          id: 7,
          question: 'Stand-up meetings are:',
          options: [
            'Weekly team reviews',
            'Daily short meetings to share updates',
            'Negotiation sessions',
            'Formal project reports'
          ],
          correctAnswer: 1,
          explanation: 'Stand-ups are daily, time-boxed updates.'
        },
        {
          id: 8,
          question: '“Back to the drawing board” means:',
          options: [
            'Proceeding with the current plan',
            'Starting over after failure',
            'Delegating tasks to others',
            'Completing a project successfully'
          ],
          correctAnswer: 1,
          explanation: 'It means returning to planning after a setback.'
        },
        {
          id: 9,
          question: 'Which phrase signals agreement in negotiation?',
          options: [
            '“That sounds reasonable, but…”',
            '“I understand your point, but…”',
            '“Just to clarify, you’re suggesting…?”',
            '“What if we tried this approach instead?”'
          ],
          correctAnswer: 0,
          explanation: 'It indicates conditional agreement or partial acceptance.'
        },
        {
          id: 10,
          question: 'Go-to-market strategy involves:',
          options: [
            'Launching a product, including marketing, sales, and pricing',
            'Daily updates on project tasks',
            'Writing a backlog',
            'Testing software features'
          ],
          correctAnswer: 0,
          explanation: 'A GTM strategy covers how a product is taken to market.'
        }
      ]
    },
    'quiz-4': {
      id: 'quiz-4',
      title: 'Stand-ups, Clarification, Collaboration',
      description: 'Mix of multi-select and single-select on agile and communication best practices.',
      timeLimit: 300,
      questions: [
        // 1. Multi-select (A, C, E)
        {
          id: 1,
          type: 'multi',
          question: 'In a daily stand-up meeting, which of the following are considered best practices?',
          options: [
            'Keeping updates concise (1–2 minutes)',
            'Giving a detailed technical demo of your work',
            'Sharing blockers that prevent progress',
            'Discussing long-term company strategy',
            'Actively listening to teammates’ updates'
          ],
          correctAnswers: [0, 2, 4]
        },
        // 2. Multi-select (A, B, D)
        {
          id: 2,
          type: 'multi',
          question: 'Which of the following are examples of clarification techniques used in software engineering communication?',
          options: [
            '“Could you explain that again, please?”',
            '“Just to confirm, we’re deploying on Friday, right?”',
            '“I’ll handle this task alone without telling anyone.”',
            '“Can you give me an example of how this API works?”',
            '“I think I understood, no need to check.”'
          ],
          correctAnswers: [0, 1, 3]
        },
        // 3. Multi-select (A, B, D, E)
        {
          id: 3,
          type: 'multi',
          question: 'Effective collaboration and teamwork in a software project involves which of the following?',
          options: [
            'Sharing knowledge openly with the team',
            'Using version control tools like Git',
            'Blaming others when bugs appear',
            'Respecting diverse perspectives',
            'Coordinating tasks using agile boards (e.g., Jira, Trello)'
          ],
          correctAnswers: [0, 1, 3, 4]
        },
        // 4. Multi-select (A, B, D)
        {
          id: 4,
          type: 'multi',
          question: 'During a stand-up, a teammate says something unclear. Which responses show good communication skills?',
          options: [
            '“Sorry, I didn’t catch that—could you repeat it?”',
            '“Just to clarify, are you saying the bug appears only on mobile?”',
            'Staying silent even though you’re confused',
            '“Can you show an example scenario so I can better understand?”',
            'Ignoring it and waiting until the sprint ends'
          ],
          correctAnswers: [0, 1, 3]
        },
        // 5. Single-select (B)
        {
          id: 5,
          question: 'In a daily stand-up meeting, the main purpose is:',
          options: [
            'To solve technical problems in detail',
            'To update the team on progress and blockers',
            'To review company policies',
            'To finalize long-term project budgets'
          ],
          correctAnswer: 1
        },
        // 6. Single-select (C)
        {
          id: 6,
          question: 'Which of the following is an example of a clarification technique?',
          options: [
            '“Let’s move this discussion to the next sprint.”',
            '“I’ll just continue without asking.”',
            '“Can you give me an example of how that error occurs?”',
            '“I’ll assign myself this task silently.”'
          ],
          correctAnswer: 2
        },
        // 7. Single-select (B)
        {
          id: 7,
          question: 'A key aspect of effective collaboration in a software team is:',
          options: [
            'Avoiding feedback to prevent conflict',
            'Sharing knowledge and supporting teammates',
            'Working in isolation for faster results',
            'Ignoring others’ coding styles'
          ],
          correctAnswer: 1
        },
        // 8. Single-select (B)
        {
          id: 8,
          question: 'If you didn’t understand a teammate’s explanation during a stand-up, the best response is:',
          options: [
            'Stay quiet to save time',
            'Ask for clarification politely',
            'Pretend you understood and continue',
            'Wait until the sprint ends to ask'
          ],
          correctAnswer: 1
        }
      ]
    },
    'quiz-3': {
      id: 'quiz-3',
      title: 'Audio Fill-in-the-Blanks',
      description: 'Listen to the audio (max 3 plays), then fill in the blanks.',
      timeLimit: 300, // 5 minutes
      type: 'audio-fill',
      audioSrc: '/quiz3.mpeg',
      blanksCount: 10,
      // Template text with placeholders to render inputs below the audio
      prompt: `Hi team, thanks for joining. I wanted to give you a heads-up on the new project. We’ve had a few concerns about the project ____________, and there's a lot of ____________ on how we should approach the ____________. The backlog has grown significantly, and we're seeing some bottlenecks in the ____________. My guess is that the team is going to be a little ____________ to meet the deadlines. We also have to decide on the new software ____________. It’s a pretty big investment, and we have to get it right. I'm hoping to have a final decision on that by the end of the ____________. Please let me know your thoughts on this. The ____________ is that we need to address these issues ____________ to avoid any further delays. We have a lot of work to do, but I'm confident we can get it done.`,
      // Provide correct answers in order for scoring (case-insensitive). Placeholder values here.
      answers: [
        // TODO: replace with the exact expected words, e.g. 'requirements', 'debate', 'strategy', ...
      ]
    }
  };

  useEffect(() => {
    const quizInfo = quizData[quizId];
    if (quizInfo) {
      setQuiz(quizInfo);
      // For audio-fill, do not start timer until user clicks Start
      if (quizInfo.type === 'audio-fill') {
        setHasStarted(false);
        setTimeLeft(quizInfo.timeLimit);
        setAudioPlays(0);
        setFillAnswers({});
      } else {
        setHasStarted(true);
        setTimeLeft(quizInfo.timeLimit);
      }
    }
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (!hasStarted) return; // don't run timer until started (for audio-fill)
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResults, hasStarted]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    });
  };

  const handleMultiToggle = (questionId, answerIndex) => {
    const prev = Array.isArray(selectedAnswers[questionId]) ? selectedAnswers[questionId] : [];
    let next;
    if (prev.includes(answerIndex)) {
      next = prev.filter((i) => i !== answerIndex);
    } else {
      next = [...prev, answerIndex].sort((a, b) => a - b);
    }
    setSelectedAnswers({ ...selectedAnswers, [questionId]: next });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (quiz.type === 'audio-fill') {
      // Score based on fill answers vs answers array (if provided)
      const keys = Array.isArray(quiz.answers) ? quiz.answers : [];
      let correct = 0;
      if (keys.length > 0) {
        keys.forEach((ans, idx) => {
          const user = (fillAnswers[idx] || '').trim().toLowerCase();
          const expected = (ans || '').trim().toLowerCase();
          if (expected && user === expected) correct += 1;
        });
      }
      setScore(correct);
      setShowResults(true);
      return;
    }

    // MCQ + Multi-select scoring
    let correctCount = 0;
    quiz.questions.forEach(question => {
      if (question.type === 'multi') {
        const picked = Array.isArray(selectedAnswers[question.id]) ? selectedAnswers[question.id] : [];
        const expected = Array.isArray(question.correctAnswers) ? question.correctAnswers : [];
        const a = [...picked].sort().join(',');
        const b = [...expected].sort().join(',');
        if (a === b && expected.length > 0) correctCount++;
      } else {
        if (selectedAnswers[question.id] === question.correctAnswer) correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const handleAudioPlay = () => {
    if (!quiz || quiz.type !== 'audio-fill') return;
    setAudioPlays((prev) => {
      const next = prev + 1;
      // If reached limit, pause and disable further plays
      if (next >= 3 && audioRef.current) {
        // We allow the 3rd play, but after it ends, prevent more plays
        audioRef.current.onended = () => {
          if (audioRef.current) {
            audioRef.current.controls = false;
          }
        };
      }
      return next;
    });
  };

  const startAudioFillQuiz = () => {
    setHasStarted(true);
  };

  const handleFillChange = (index, value) => {
    setFillAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const totalQs = quiz.type === 'audio-fill' ? (Array.isArray(quiz.answers) ? quiz.answers.length : 0) : quiz.questions.length;
    const percentage = totalQs > 0 ? Math.round((score / totalQs) * 100) : 0;
    const passed = percentage >= 70;

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
                  Techlish
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{currentUser?.email}</span>
                <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center">
            <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {passed ? (
                <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-gray-600 mb-6">{quiz.title}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{score}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{percentage}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {passed ? 'PASS' : 'FAIL'}
                </div>
                <div className="text-sm text-gray-600">Result</div>
              </div>
            </div>

            {/* Review Answers */}
            {quiz.type !== 'audio-fill' ? (
              <div className="text-left mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Answers</h3>
                <div className="space-y-4">
                  {quiz.questions.map((question, index) => {
                    const isMulti = question.type === 'multi';
                    const userAnswer = selectedAnswers[question.id];
                    let isCorrect = false;
                    if (isMulti) {
                      const picked = Array.isArray(userAnswer) ? userAnswer : [];
                      const expected = Array.isArray(question.correctAnswers) ? question.correctAnswers : [];
                      isCorrect = [...picked].sort().join(',') === [...expected].sort().join(',') && expected.length > 0;
                    } else {
                      isCorrect = userAnswer === question.correctAnswer;
                    }
                    return (
                      <div key={question.id} className={`p-4 rounded-lg border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{index + 1}. {question.question}</h4>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Your answer:</strong> {isMulti
                            ? (Array.isArray(userAnswer) && userAnswer.length ? userAnswer.map(i => question.options[i]).join(', ') : 'Not answered')
                            : (userAnswer !== undefined ? question.options[userAnswer] : 'Not answered')}
                        </div>
                        {!isCorrect && (
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Correct answer:</strong> {isMulti
                              ? (Array.isArray(question.correctAnswers) ? question.correctAnswers.map(i => question.options[i]).join(', ') : '')
                              : question.options[question.correctAnswer]}
                          </div>
                        )}
                        <div className="text-sm text-gray-700"><strong>Explanation:</strong> {question.explanation}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="flex justify-center space-x-4">
              <Link to="/dashboard" className="btn-primary">
                Back to Dashboard
              </Link>
              <button 
                onClick={() => window.location.reload()} 
                className="btn-secondary"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.type !== 'audio-fill' ? quiz.questions[currentQuestion] : null;
  const progress = quiz.type !== 'audio-fill' ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0;

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
                Techlish
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-lg font-medium ${
                timeLeft < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                ⏰ {formatTime(timeLeft)}
              </div>
              <span className="text-sm text-gray-600">{currentUser?.email}</span>
              <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
          <p className="text-gray-600 mb-4">{quiz.description}</p>
          
          {quiz.type !== 'audio-fill' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {quiz.questions.length}</span>
                <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </>
          )}
        </div>

        {/* Question / Audio Gate / Fill UI */}
        {quiz.type !== 'audio-fill' ? (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQ.question}</h2>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => {
                const isMulti = currentQ.type === 'multi';
                const picked = isMulti
                  ? (Array.isArray(selectedAnswers[currentQ.id]) && selectedAnswers[currentQ.id].includes(index))
                  : selectedAnswers[currentQ.id] === index;
                return (
                  <button
                    key={index}
                    onClick={() => (isMulti ? handleMultiToggle(currentQ.id, index) : handleAnswerSelect(currentQ.id, index))}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 ${picked ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center">
                      <div className={`mr-3 flex items-center justify-center ${isMulti ? 'w-5 h-5 border-2 rounded-sm' : 'w-6 h-6 rounded-full border-2'} ${picked ? 'border-primary-500 bg-primary-500' : 'border-gray-300'}`}>
                        {!isMulti && picked && (<div className="w-2 h-2 bg-white rounded-full"></div>)}
                        {isMulti && picked && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        )}
                      </div>
                      <span className="text-gray-900">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card mb-8">
            {!hasStarted ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Listen to the audio (max 3 plays)</h2>
                <audio ref={audioRef} controls onPlay={handleAudioPlay} src={quiz.audioSrc} className="w-full mb-4"></audio>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plays used: {audioPlays}/3</span>
                  <button
                    onClick={startAudioFillQuiz}
                    className="btn-primary"
                  >
                    Start Quiz
                  </button>
                </div>
                {audioPlays >= 3 && audioRef.current && (
                  <p className="mt-2 text-sm text-yellow-700">Audio plays limit reached. You can now start the quiz.</p>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Fill in the blanks</h2>
                <p className="text-sm text-gray-600 mb-4">Type the missing words into each blank field.</p>
                <div className="space-y-4">
                  {/* Render prompt split by blanks */}
                  <div className="leading-8 text-gray-800">
                    {quiz.prompt.split('____________').map((chunk, idx, arr) => (
                      <span key={idx}>
                        {chunk}
                        {idx < arr.length - 1 && (
                          <input
                            type="text"
                            className="mx-2 px-2 py-1 border rounded text-sm"
                            placeholder={`Blank ${idx + 1}`}
                            value={fillAnswers[idx] || ''}
                            onChange={(e) => handleFillChange(idx, e.target.value)}
                          />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        {quiz.type !== 'audio-fill' ? (
          <div className="flex justify-between items-center">
            <button onClick={handlePreviousQuestion} disabled={currentQuestion === 0} className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">← Previous</button>
            <div className="flex space-x-4">
              {currentQuestion === quiz.questions.length - 1 ? (
                <button onClick={handleSubmitQuiz} className="btn-primary" disabled={Object.keys(selectedAnswers).length === 0}>Submit Quiz</button>
              ) : (
                <button onClick={handleNextQuestion} className="btn-primary">Next →</button>
              )}
            </div>
          </div>
        ) : (
          hasStarted && (
            <div className="flex justify-end">
              <button onClick={handleSubmitQuiz} className="btn-primary">Submit Quiz</button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
