// Interactive quiz page with questions, answers, and scoring
import React, { useState, useEffect } from 'react';
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
    }
  };

  useEffect(() => {
    const quizInfo = quizData[quizId];
    if (quizInfo) {
      setQuiz(quizInfo);
      setTimeLeft(quizInfo.timeLimit);
    }
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResults]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    });
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
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);
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
    const percentage = Math.round((score / quiz.questions.length) * 100);
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
                  English LMS
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
            <div className="text-left mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Answers</h3>
              <div className="space-y-4">
                {quiz.questions.map((question, index) => {
                  const userAnswer = selectedAnswers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className={`p-4 rounded-lg border-2 ${
                      isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {index + 1}. {question.question}
                        </h4>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Your answer:</strong> {
                          userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'
                        }
                      </div>
                      
                      {!isCorrect && (
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-700">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

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

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

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
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQ.id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 ${
                  selectedAnswers[currentQ.id] === index
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedAnswers[currentQ.id] === index
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQ.id] === index && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex space-x-4">
            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="btn-primary"
                disabled={Object.keys(selectedAnswers).length === 0}
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="btn-primary"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
