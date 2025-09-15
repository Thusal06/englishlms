// Discussion forum page with Quora-style Q&A functionality
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Discussion() {
  const { courseId } = useParams();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', tags: '' });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Mock discussion data
  const mockQuestions = [
    {
      id: 1,
      title: 'What is the difference between present perfect and past simple?',
      content: 'I am confused about when to use present perfect vs past simple tense. Can someone explain with examples?',
      author: 'student@example.com',
      authorName: 'Sarah Johnson',
      timestamp: '2024-01-15T10:30:00Z',
      tags: ['grammar', 'tenses', 'present-perfect'],
      votes: 15,
      answers: [
        {
          id: 1,
          content: 'Present perfect is used for actions that happened at an unspecified time in the past or have relevance to the present. For example: "I have visited Paris" (sometime in my life). Past simple is for specific times: "I visited Paris last year".',
          author: 'teacher@example.com',
          authorName: 'Dr. Michael Chen',
          timestamp: '2024-01-15T11:00:00Z',
          votes: 12,
          isAccepted: true
        },
        {
          id: 2,
          content: 'Think of present perfect as a bridge between past and present. It shows the result of a past action that affects now. "I have lost my keys" means I lost them in the past and still don\'t have them now.',
          author: 'student2@example.com',
          authorName: 'Emma Wilson',
          timestamp: '2024-01-15T14:20:00Z',
          votes: 8,
          isAccepted: false
        }
      ]
    },
    {
      id: 2,
      title: 'How do I improve my English pronunciation?',
      content: 'I have been studying English for 2 years but still struggle with pronunciation. What are some effective methods to improve?',
      author: 'learner@example.com',
      authorName: 'Ahmed Hassan',
      timestamp: '2024-01-14T16:45:00Z',
      tags: ['pronunciation', 'speaking', 'practice'],
      votes: 23,
      answers: [
        {
          id: 3,
          content: 'Practice with phonetic symbols, listen to native speakers, record yourself speaking, and use apps like Forvo for word pronunciation. Consistency is key!',
          author: 'teacher2@example.com',
          authorName: 'Prof. Lisa Anderson',
          timestamp: '2024-01-14T18:30:00Z',
          votes: 18,
          isAccepted: true
        }
      ]
    },
    {
      id: 3,
      title: 'Phrasal verbs are confusing - any tips?',
      content: 'There are so many phrasal verbs in English and they seem to have multiple meanings. How can I learn them effectively?',
      author: 'confused@example.com',
      authorName: 'Maria Rodriguez',
      timestamp: '2024-01-13T09:15:00Z',
      tags: ['phrasal-verbs', 'vocabulary', 'learning-tips'],
      votes: 19,
      answers: [
        {
          id: 4,
          content: 'Group them by particle (up, down, out, etc.) and learn them in context through sentences rather than isolated meanings. Create your own example sentences.',
          author: 'helper@example.com',
          authorName: 'John Smith',
          timestamp: '2024-01-13T12:00:00Z',
          votes: 14,
          isAccepted: false
        }
      ]
    }
  ];

  useEffect(() => {
    setQuestions(mockQuestions);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleNewQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) return;

    const question = {
      id: questions.length + 1,
      title: newQuestion.title,
      content: newQuestion.content,
      author: currentUser.email,
      authorName: currentUser.email.split('@')[0],
      timestamp: new Date().toISOString(),
      tags: newQuestion.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      votes: 0,
      answers: []
    };

    setQuestions([question, ...questions]);
    setNewQuestion({ title: '', content: '', tags: '' });
    setShowNewQuestion(false);
  };

  const handleNewAnswer = (e) => {
    e.preventDefault();
    if (!newAnswer.trim() || !selectedQuestion) return;

    const answer = {
      id: Date.now(),
      content: newAnswer,
      author: currentUser.email,
      authorName: currentUser.email.split('@')[0],
      timestamp: new Date().toISOString(),
      votes: 0,
      isAccepted: false
    };

    const updatedQuestions = questions.map(q => 
      q.id === selectedQuestion.id 
        ? { ...q, answers: [...q.answers, answer] }
        : q
    );

    setQuestions(updatedQuestions);
    setSelectedQuestion({ ...selectedQuestion, answers: [...selectedQuestion.answers, answer] });
    setNewAnswer('');
  };

  const handleVote = (questionId, answerId = null, direction) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        if (answerId) {
          // Vote on answer
          const updatedAnswers = q.answers.map(a => 
            a.id === answerId 
              ? { ...a, votes: a.votes + (direction === 'up' ? 1 : -1) }
              : a
          );
          return { ...q, answers: updatedAnswers };
        } else {
          // Vote on question
          return { ...q, votes: q.votes + (direction === 'up' ? 1 : -1) };
        }
      }
      return q;
    });
    
    setQuestions(updatedQuestions);
    if (selectedQuestion && selectedQuestion.id === questionId) {
      const updated = updatedQuestions.find(q => q.id === questionId);
      setSelectedQuestion(updated);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return time.toLocaleDateString();
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    switch (sortBy) {
      case 'votes':
        return b.votes - a.votes;
      case 'answers':
        return b.answers.length - a.answers.length;
      default:
        return new Date(b.timestamp) - new Date(a.timestamp);
    }
  });

  if (selectedQuestion) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setSelectedQuestion(null)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Discussion Forum
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
          {/* Question Detail */}
          <div className="card mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex flex-col items-center space-y-2">
                <button 
                  onClick={() => handleVote(selectedQuestion.id, null, 'up')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <span className="text-lg font-semibold text-gray-900">{selectedQuestion.votes}</span>
                <button 
                  onClick={() => handleVote(selectedQuestion.id, null, 'down')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedQuestion.title}</h1>
                <p className="text-gray-700 mb-4">{selectedQuestion.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      {selectedQuestion.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Asked by <span className="font-medium">{selectedQuestion.authorName}</span> • {formatTimeAgo(selectedQuestion.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Answers */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedQuestion.answers.length} Answer{selectedQuestion.answers.length !== 1 ? 's' : ''}
            </h2>
            
            <div className="space-y-6">
              {selectedQuestion.answers.map((answer) => (
                <div key={answer.id} className="card">
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center space-y-2">
                      <button 
                        onClick={() => handleVote(selectedQuestion.id, answer.id, 'up')}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <span className="text-sm font-semibold text-gray-900">{answer.votes}</span>
                      <button 
                        onClick={() => handleVote(selectedQuestion.id, answer.id, 'down')}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {answer.isAccepted && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-gray-700 mb-4">{answer.content}</p>
                      <div className="flex items-center justify-between">
                        {answer.isAccepted && (
                          <span className="text-sm text-green-600 font-medium">✓ Accepted Answer</span>
                        )}
                        <div className="text-sm text-gray-500">
                          Answered by <span className="font-medium">{answer.authorName}</span> • {formatTimeAgo(answer.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Answer */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
            <form onSubmit={handleNewAnswer}>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Write your answer here..."
                rows={6}
                className="input-field resize-none mb-4"
                required
              />
              <div className="flex justify-end">
                <button type="submit" className="btn-primary">
                  Post Answer
                </button>
              </div>
            </form>
          </div>
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
                Discussion Forum
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{currentUser?.email}</span>
              <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Forum Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Discussion Forum</h1>
            <p className="text-gray-600">Ask questions, share knowledge, and help fellow learners</p>
          </div>
          <button
            onClick={() => setShowNewQuestion(true)}
            className="btn-primary"
          >
            Ask Question
          </button>
        </div>

        {/* New Question Modal */}
        {showNewQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ask a Question</h2>
              <form onSubmit={handleNewQuestion}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    placeholder="What's your question?"
                    className="input-field"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newQuestion.content}
                    onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                    placeholder="Provide more details about your question..."
                    rows={4}
                    className="input-field resize-none"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={newQuestion.tags}
                    onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                    placeholder="grammar, vocabulary, pronunciation (comma separated)"
                    className="input-field"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowNewQuestion(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Post Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sort Options */}
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <button
            onClick={() => setSortBy('recent')}
            className={`text-sm px-3 py-1 rounded ${
              sortBy === 'recent' ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Most Recent
          </button>
          <button
            onClick={() => setSortBy('votes')}
            className={`text-sm px-3 py-1 rounded ${
              sortBy === 'votes' ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Most Voted
          </button>
          <button
            onClick={() => setSortBy('answers')}
            className={`text-sm px-3 py-1 rounded ${
              sortBy === 'answers' ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Most Answered
          </button>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {sortedQuestions.map((question) => (
            <div
              key={question.id}
              onClick={() => setSelectedQuestion(question)}
              className="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center space-y-1 text-sm text-gray-500">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{question.votes}</div>
                    <div>votes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{question.answers.length}</div>
                    <div>answers</div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600">
                    {question.title}
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{question.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {question.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Asked by <span className="font-medium">{question.authorName}</span> • {formatTimeAgo(question.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
