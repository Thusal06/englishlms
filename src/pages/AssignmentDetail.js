// Assignment detail page with submission functionality
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AssignmentDetail() {
  const { assignmentId } = useParams();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  // Drag & Drop state for interactive assignments
  const [ddAnswers, setDdAnswers] = useState({}); // {index: token}
  const [ddScore, setDdScore] = useState(null);
  const [ddShowResults, setDdShowResults] = useState(false);
  const [ddTexts, setDdTexts] = useState({}); // optional free-text per sentence for certain tasks

  // Mock assignment data
  const assignmentData = {
    'essay-future-goals': {
      id: 'essay-future-goals',
      title: 'Essay: My Future Goals',
      description: 'Write a 500-word essay about your future aspirations and how learning English will help you achieve them.',
      instructions: [
        'Write between 450-550 words',
        'Include an introduction, body paragraphs, and conclusion',
        'Use proper grammar and sentence structure',
        'Include specific examples and personal experiences',
        'Proofread your work before submission'
      ],
      dueDate: '2024-01-20',
      maxScore: 100,
      submissionType: 'text',
      status: 'pending'
    },
    // Business English Assignment 2: Dialogue completion (dragdrop)
    'business-assignment-2': {
      id: 'business-assignment-2',
      title: 'Business English Assignment 2: Complete the Dialogue',
      description: 'Complete the dialogue using the negotiation phrases from the box by dragging them into the blanks.',
      instructions: [
        'Drag each phrase from the word bank into the correct blank.',
        'Each phrase is used exactly once.',
        'Submit to check your score.'
      ],
      dueDate: '2025-10-20',
      maxScore: 4,
      submissionType: 'dragdrop',
      status: 'not-started',
      wordBank: [
        'I understand your point, but we might face challenges with…',
        'What if we tried this approach instead?',
        'Can we agree to move forward with this plan?',
        'Just to clarify, you’re suggesting…?'
      ],
      sentences: [
        { text: 'Alex: We need to deliver the new feature by Friday, or the client will be unhappy.\nRiya: __________ (1) We might need an extra day for testing.', answer: 'I understand your point, but we might face challenges with…' },
        { text: 'Alex: Okay, but we can’t delay the release. __________ (2) extending the deadline by one day?', answer: 'Can we agree to move forward with this plan?' },
        { text: 'Riya: That could work. __________ (3) keeping the current deadline but prioritizing the most critical features?', answer: 'What if we tried this approach instead?' },
        { text: 'Alex: Yes, that makes sense. __________ (4) that we focus on the priority features first?', answer: 'Just to clarify, you’re suggesting…?' }
      ]
    },
    // Business English Assignment 3: Video upload (final)
    'business-assignment-3': {
      id: 'business-assignment-3',
      title: 'Business English Assignment 3: 3-Minute Technical Presentation (Video)',
      description: 'Prepare and deliver a 3-minute short technical presentation on a topic of your choice. Record your presentation as a video and upload the file for submission.',
      instructions: [
        'Record a 3-minute video presenting a technical topic of your choice.',
        'Speak clearly, structure your talk (intro → main points → conclusion), and use signposting.',
        'Drag and drop your video below or click to browse.',
        'Accepted formats: MP4, WEBM, MOV. Max recommended size 200MB.'
      ],
      dueDate: '2025-11-30',
      maxScore: 100,
      submissionType: 'video',
      status: 'pending'
    },
    // Business English Assignment 1: Matching table
    'business-assignment-1': {
      id: 'business-assignment-1',
      title: 'Business English Assignment 1: Match the Negotiation Phrase',
      description: 'Match the negotiation phrase (Column A) with its function (Column B). Drag the function labels (A–F) into the matching rows.',
      instructions: [
        'Drag each function label (A–F) from the word bank into the correct phrase row.',
        'Each label is used exactly once.',
        'Submit to check your score.'
      ],
      dueDate: '2025-10-10',
      maxScore: 6,
      submissionType: 'match',
      status: 'not-started',
      phrases: [
        '“Let’s discuss how we can work this out.”',
        '“What if we tried this approach instead?”',
        '“That sounds reasonable, but…”',
        '“I understand your point, but we might face challenges with…”',
        '“Just to clarify, you’re suggesting…?”',
        '“Can we agree to move forward with this plan?”'
      ],
      functions: [
        { key: 'A', text: 'Opening the negotiation' },
        { key: 'B', text: 'Proposing an alternative solution' },
        { key: 'C', text: 'Expressing agreement or partial agreement' },
        { key: 'D', text: 'Expressing polite disagreement' },
        { key: 'E', text: 'Clarifying understanding' },
        { key: 'F', text: 'Closing the negotiation' }
      ],
      answers: ['A','B','C','D','E','F']
    },
    'grammar-exercise-3': {
      id: 'grammar-exercise-3',
      title: 'Grammar Exercise Set 3',
      description: 'Complete exercises on past tense usage with various scenarios.',
      instructions: [
        'Download the exercise PDF',
        'Complete all 20 questions',
        'Upload your completed work as PDF or image',
        'Show your work for partial credit'
      ],
      dueDate: '2024-01-18',
      maxScore: 50,
      submissionType: 'file',
      status: 'in-progress'
    },
    'vocabulary-prep': {
      id: 'vocabulary-prep',
      title: 'Vocabulary Quiz Prep',
      description: 'Study materials for upcoming vocabulary test covering units 1-5.',
      instructions: [
        'Review vocabulary lists from units 1-5',
        'Create flashcards for difficult words',
        'Practice using words in sentences',
        'Submit a summary of your study plan'
      ],
      dueDate: '2024-01-25',
      maxScore: 25,
      submissionType: 'text',
      status: 'not-started'
    },
    'vocab-assignment-1': {
      id: 'vocab-assignment-1',
      title: 'Task 1: Workplace Jargon — Drag & Drop',
      description: 'Complete each sentence with the correct word from the box by dragging it into the blank.',
      instructions: [
        'Drag each word from the word bank into the correct blank.',
        'Each word is used exactly once.',
        'Click a placed word to remove it back to the bank if needed.',
        'Submit to check your score.'
      ],
      dueDate: '2025-10-31',
      maxScore: 11,
      submissionType: 'dragdrop',
      status: 'pending',
      wordBank: [
        'bottleneck',
        'bandwidth',
        'blow-by-blow',
        'stand-up',
        'back to the drawing board',
        'onboarding',
        'go-to-market',
        'sprint',
        'black economy',
        'sync-up',
        'backlog'
      ],
      sentences: [
        {
          text: 'The testing phase has become a __________, slowing down the release schedule.',
          answer: 'bottleneck'
        },
        {
          text: 'We don’t have the __________ to take on an additional project this month.',
          answer: 'bandwidth'
        },
        {
          text: 'The product manager explained the new feature development in a __________ manner.',
          answer: 'blow-by-blow'
        },
        {
          text: 'The team met for their morning __________ to share updates and blockers.',
          answer: 'stand-up'
        },
        {
          text: 'After the client rejected the proposal, it was __________.',
          answer: 'back to the drawing board'
        },
        {
          text: 'Every new engineer goes through a two-week __________ process before joining their team.',
          answer: 'onboarding'
        },
        {
          text: 'The marketing team is preparing a __________ strategy for the new mobile app.',
          answer: 'go-to-market'
        },
        {
          text: 'Tasks that were not completed in the last __________ will be carried over.',
          answer: 'sprint'
        },
        {
          text: 'The finance department warns that illegal freelance work may contribute to the __________.',
          answer: 'black economy'
        },
        {
          text: 'Let’s have a quick __________ call to finalize the release plan.',
          answer: 'sync-up'
        },
        {
          text: 'The project manager checked the __________ to prioritize which tasks should be tackled first.',
          answer: 'backlog'
        }
      ]
    },
    'vocab-assignment-2': {
      id: 'vocab-assignment-2',
      title: 'Task 2: Workplace Jargon — Drag & Drop',
      description: 'Finish each sentence using your own ideas, making sure to use the given word correctly by dragging it into the blank.',
      instructions: [
        'Drag each word from the word bank into the correct blank.',
        'Each word is used exactly once.',
        'Use the sentence ending as a guide to complete it naturally once the correct term is placed.',
        'Submit to check your score.'
      ],
      dueDate: '2025-11-15',
      maxScore: 10,
      submissionType: 'dragdrop',
      status: 'pending',
      wordBank: [
        'backlog',
        'bandwidth',
        'stand-up',
        'back to the drawing board',
        'onboarding',
        'bottleneck',
        'go-to-market',
        'blow-by-blow',
        'sprint',
        'sync-up'
      ],
      sentences: [
        { text: 'The __________ is full of pending bug fixes, so…', answer: 'backlog' },
        { text: 'Our team doesn’t have enough __________ this week, which means…', answer: 'bandwidth' },
        { text: 'During the daily __________, I mentioned that…', answer: 'stand-up' },
        { text: 'The developers had to go __________ because…', answer: 'back to the drawing board' },
        { text: 'The new hire’s __________ included…', answer: 'onboarding' },
        { text: 'A major __________ in our project is…', answer: 'bottleneck' },
        { text: 'The CEO presented the __________ plan to…', answer: 'go-to-market' },
        { text: 'After the detailed __________ explanation, everyone understood…', answer: 'blow-by-blow' },
        { text: 'In the last __________, our team managed to…', answer: 'sprint' },
        { text: 'We had a quick __________ before the client meeting to…', answer: 'sync-up' }
      ]
    }
  };

  // Video drag-and-drop helpers
  function handleVideoDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleVideoDragLeave(e) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleVideoDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const dtFiles = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
    const videoFiles = dtFiles.filter((f) => f.type.startsWith('video/'));
    if (videoFiles.length === 0) {
      alert('No video file detected. Please drop an MP4, WEBM, or MOV file.');
      return;
    }
    setFiles([videoFiles[0]]);
  }

  function removePlaced(index) {
    setDdAnswers((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  }

  function resetDD() {
    setDdAnswers({});
    setDdScore(null);
    setDdShowResults(false);
    setIsSubmitted(false);
    setDdTexts({});
  }

  const handleTextChange = (index, value) => {
    setDdTexts((prev) => ({ ...prev, [index]: value }));
  };

  useEffect(() => {
    const assignmentInfo = assignmentData[assignmentId];
    if (assignmentInfo) {
      setAssignment(assignmentInfo);
      // Check if already submitted (mock data)
      if (assignmentInfo.status === 'submitted') {
        setIsSubmitted(true);
      }
    }
  }, [assignmentId]);

  const handleSubmissionChange = (e) => {
    setSubmission(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  // Drag & Drop helpers (function declarations to avoid hoisting/definition issues)
  function handleDragStart(e, token) {
    // use a consistent key for set/get
    e.dataTransfer.setData('token', token);
  }

  function handleDrop(e, index) {
    e.preventDefault();
    const token = e.dataTransfer.getData('token');
    if (token) {
      setDdAnswers((prev) => ({ ...prev, [index]: token }));
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Interactive drag & drop submission
    if (assignment.submissionType === 'dragdrop') {
      const total = assignment.sentences.length;
      const filled = Object.keys(ddAnswers).length;
      if (filled < total) {
        alert(`Please fill all blanks (${filled}/${total}) before submitting.`);
        return;
      }
      let score = 0;
      assignment.sentences.forEach((s, idx) => {
        if ((ddAnswers[idx] || '').trim().toLowerCase() === s.answer.trim().toLowerCase()) {
          score += 1;
        }
      });
      setDdScore(score);
      setDdShowResults(true);
      setIsSubmitted(true);
      return;
    }
    if (assignment.submissionType === 'match') {
      const total = assignment.phrases.length;
      const filled = Object.keys(ddAnswers).length;
      if (filled < total) {
        alert(`Please match all rows (${filled}/${total}) before submitting.`);
        return;
      }
      let score = 0;
      assignment.answers.forEach((correctKey, idx) => {
        if ((ddAnswers[idx] || '').trim().toUpperCase() === correctKey.trim().toUpperCase()) {
          score += 1;
        }
      });
      setDdScore(score);
      setDdShowResults(true);
      setIsSubmitted(true);
      return;
    }

    if (assignment.submissionType === 'text' && submission.trim().length < 50) {
      alert('Please write at least 50 characters for your submission.');
      return;
    }
    
    if (assignment.submissionType === 'file' && files.length === 0) {
      alert('Please select at least one file to upload.');
      return;
    }

    if (assignment.submissionType === 'video') {
      if (files.length === 0) {
        alert('Please add a video file to submit.');
        return;
      }
      const f = files[0];
      if (!f.type.startsWith('video/')) {
        alert('Please upload a valid video file (MP4, WEBM, MOV).');
        return;
      }
    }

    // Mock submission process
    setIsSubmitted(true);
    alert('Assignment submitted successfully!');
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignment...</p>
        </div>
      </div>
    );
  }

  const daysUntilDue = getDaysUntilDue(assignment.dueDate);
  const isOverdue = daysUntilDue < 0;

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
        {/* Assignment Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
              <p className="text-gray-600 mb-4">{assignment.description}</p>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                  </svg>
                  <span className="text-gray-600">Max Score: {assignment.maxScore} points</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                  </svg>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(assignment.status)}`}>
                    {assignment.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-lg font-semibold mb-1 ${
                isOverdue ? 'text-red-600' : daysUntilDue <= 1 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {isOverdue ? 'Overdue' : daysUntilDue === 0 ? 'Due Today' : `${daysUntilDue} days left`}
              </div>
              <div className="text-sm text-gray-500">Due: {assignment.dueDate}</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
            <ul className="space-y-2">
              {assignment.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interactive Drag & Drop UI */}
        {assignment.submissionType === 'dragdrop' && (
          <div className="card mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Task 1</h3>
            <p className="text-gray-600 mb-4">Complete each sentence with the correct word from the box.</p>

            {/* Word Bank */}
            <div className="border rounded-lg p-4 bg-gray-50 mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {assignment.wordBank.map((token, idx) => {
                  const used = Object.values(ddAnswers).includes(token);
                  return (
                    <div
                      key={idx}
                      draggable={!used}
                      onDragStart={(e) => handleDragStart(e, token)}
                      className={`px-3 py-2 rounded border bg-white text-sm text-gray-800 shadow-sm select-none ${
                        used ? 'opacity-40 cursor-not-allowed' : 'cursor-move hover:bg-primary-50'
                      }`}
                      title={used ? 'Already used' : 'Drag to a blank'}
                    >
                      {token}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sentences */}
            <div className="space-y-4">
              {assignment.sentences.map((s, index) => {
                const placed = ddAnswers[index];
                const isCorrect = ddShowResults && placed && placed.trim().toLowerCase() === s.answer.trim().toLowerCase();
                const isWrong = ddShowResults && placed && !isCorrect;
                return (
                  <div key={index} className="text-gray-800">
                    <div className="flex items-start">
                      <span className="mr-2 text-gray-500">{index + 1}.</span>
                      <div className="flex-1">
                        {s.text.split('__________').length > 1 ? (
                          <div className="flex flex-wrap items-center">
                            <span>{s.text.split('__________')[0]}</span>
                            <div
                              onDrop={(e) => handleDrop(e, index)}
                              onDragOver={handleDragOver}
                              className={`min-w-[140px] inline-flex items-center justify-between px-3 py-2 border-2 rounded-md mx-2 bg-white ${
                                ddShowResults ? (isCorrect ? 'border-green-400' : 'border-red-400') : 'border-dashed border-gray-300'
                              }`}
                            >
                              {placed ? (
                                <button type="button" onClick={() => removePlaced(index)} className="text-sm text-gray-800">
                                  {placed}
                                </button>
                              ) : (
                                <span className="text-sm text-gray-400">Drop word here</span>
                              )}
                            </div>
                            <span>{s.text.split('__________')[1]}</span>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center">
                            <span>{s.text.replace('_____', '')}</span>
                            <div
                              onDrop={(e) => handleDrop(e, index)}
                              onDragOver={handleDragOver}
                              className={`min-w-[140px] inline-flex items-center justify-between px-3 py-2 border-2 rounded-md mx-2 bg-white ${
                                ddShowResults ? (isCorrect ? 'border-green-400' : 'border-red-400') : 'border-dashed border-gray-300'
                              }`}
                            >
                              {placed ? (
                                <button type="button" onClick={() => removePlaced(index)} className="text-sm text-gray-800">
                                  {placed}
                                </button>
                              ) : (
                                <span className="text-sm text-gray-400">Drop word here</span>
                              )}
                            </div>
                          </div>
                        )}

        {/* Matching Table (Phrase ↔ Function) */}
        {assignment.submissionType === 'match' && (
          <div className="card mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Match the Negotiation Phrase</h3>
            <p className="text-gray-600 mb-6">Drag a function label (A–F) from the word bank into the matching row in Column B.</p>

            {/* Word Bank */}
            <div className="border rounded-lg p-4 bg-gray-50 mb-6">
              <div className="flex flex-wrap gap-3">
                {assignment.functions.map((fn, idx) => {
                  const used = Object.values(ddAnswers).includes(fn.key);
                  return (
                    <div
                      key={fn.key}
                      draggable={!used}
                      onDragStart={(e) => handleDragStart(e, fn.key)}
                      className={`px-3 py-2 rounded border bg-white text-sm shadow-sm select-none ${used ? 'opacity-40 cursor-not-allowed' : 'cursor-move hover:bg-primary-50'}`}
                      title={fn.text}
                    >
                      <span className="font-semibold mr-2">{fn.key}</span>
                      <span className="text-gray-700">{fn.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column A – Phrase</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column B – Function (A–F)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignment.phrases.map((phrase, index) => {
                    const placed = ddAnswers[index];
                    const correctKey = assignment.answers[index];
                    const isCorrect = ddShowResults && placed && placed.toUpperCase() === correctKey.toUpperCase();
                    return (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-500 align-top">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 align-top">{phrase}</td>
                        <td className="px-4 py-3 align-top">
                          <div
                            onDrop={(e) => handleDrop(e, index)}
                            onDragOver={handleDragOver}
                            className={`inline-flex min-w-[160px] items-center px-3 py-2 border-2 rounded-md bg-white ${ddShowResults ? (isCorrect ? 'border-green-400' : 'border-red-400') : 'border-dashed border-gray-300'}`}
                          >
                            {placed ? (
                              <button type="button" onClick={() => removePlaced(index)} className="text-sm font-semibold text-gray-800">
                                {placed}
                              </button>
                            ) : (
                              <span className="text-sm text-gray-400">Drop A–F here</span>
                            )}
                          </div>
                          {ddShowResults && (
                            <div className="mt-1 text-xs text-gray-600">Correct: <span className="font-semibold">{correctKey}</span> — {assignment.functions.find(f => f.key === correctKey)?.text}</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button type="button" onClick={resetDD} className="btn-secondary">Reset</button>
              <form onSubmit={handleSubmit}>
                <button type="submit" className="btn-primary">Submit</button>
              </form>
            </div>

            {ddShowResults && (
              <div className="mt-6 p-4 rounded bg-gray-50 border">
                <p className="font-semibold text-gray-800">Score: {ddScore} / {assignment.maxScore}</p>
              </div>
            )}
          </div>
        )}
                        {ddShowResults && (
                          <div className="mt-1 text-sm">
                            {isCorrect ? (
                              <span className="text-green-600">Correct</span>
                            ) : (
                              <span className="text-red-600">Correct answer: {s.answer}</span>
                            )}
                          </div>
                        )}

                        {/* Optional free-text completion for vocab-assignment-2 */}
                        {assignment.id === 'vocab-assignment-2' && (
                          <div className="mt-3">
                            <label className="block text-xs text-gray-500 mb-1">Complete the sentence in your own words</label>
                            <input
                              type="text"
                              className="input-field"
                              placeholder="... finish your idea here"
                              value={ddTexts[index] || ''}
                              onChange={(e) => handleTextChange(index, e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button type="button" onClick={resetDD} className="btn-secondary">Reset</button>
              <form onSubmit={handleSubmit}>
                <button type="submit" className="btn-primary">Submit</button>
              </form>
            </div>

            {ddShowResults && (
              <div className="mt-6 p-4 rounded bg-gray-50 border">
                <p className="font-semibold text-gray-800">Score: {ddScore} / {assignment.maxScore}</p>
              </div>
            )}
          </div>
        )}

        {/* Video Upload (Drag & Drop) */}
        {assignment.submissionType === 'video' && (
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Presentation Video</h3>
            <div
              className={`border-2 rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-primary-600 bg-primary-50' : 'border-dashed border-gray-300 bg-gray-50'
              }`}
              onDragOver={handleVideoDragOver}
              onDragEnter={handleVideoDragOver}
              onDragLeave={handleVideoDragLeave}
              onDrop={handleVideoDrop}
            >
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553 2.276A2 2 0 0121 14.09v.82a2 2 0 01-1.447 1.914L15 19M4 6h8m0 0V4m0 2v2" />
              </svg>
              <p className="text-gray-700 mb-2">Drag and drop your video file here</p>
              <p className="text-sm text-gray-500 mb-4">or click the button below to browse</p>
              <input
                id="videoInput"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const arr = Array.from(e.target.files || []);
                  const videoFiles = arr.filter((f) => f.type.startsWith('video/'));
                  if (videoFiles.length > 0) setFiles([videoFiles[0]]);
                }}
              />
              <label htmlFor="videoInput" className="btn-secondary cursor-pointer">Browse Video</label>

              {files.length > 0 && files[0] && (
                <div className="mt-6 text-left">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Video</h4>
                  <div className="bg-white p-4 border rounded-lg">
                    <p className="text-sm text-gray-700 mb-3">{files[0].name} <span className="text-gray-400">({(files[0].size / 1024 / 1024).toFixed(2)} MB)</span></p>
                    <video
                      controls
                      className="w-full rounded"
                      src={URL.createObjectURL(files[0])}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end mt-6">
                <form onSubmit={handleSubmit}>
                  <button type="submit" className="btn-primary">Submit Video</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Submission Section (Text/File only) */}
        {(assignment.submissionType === 'text' || assignment.submissionType === 'file') && !isSubmitted ? (
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Submit Your Work</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {assignment.submissionType === 'text' ? (
                <div>
                  <label htmlFor="submission" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Response
                  </label>
                  <textarea
                    id="submission"
                    rows={12}
                    className="input-field resize-none"
                    placeholder="Type your response here..."
                    value={submission}
                    onChange={handleSubmissionChange}
                    required
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    Character count: {submission.length}
                    {assignment.id === 'essay-future-goals' && (
                      <span className="ml-2">
                        (Approximately {Math.round(submission.split(' ').length)} words)
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Files
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <input
                      id="files"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="files" className="cursor-pointer">
                      <span className="text-primary-600 hover:text-primary-700 font-medium">
                        Click to upload files
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB each
                    </p>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                      <ul className="space-y-2">
                        {files.map((file, index) => (
                          <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  💡 Make sure to review your work before submitting
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={
                    (assignment.submissionType === 'text' && submission.trim().length < 50) ||
                    (assignment.submissionType === 'file' && files.length === 0)
                  }
                >
                  Submit Assignment
                </button>
              </div>
            </form>
          </div>
        ) : assignment.submissionType !== 'dragdrop' ? (
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Assignment Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Your assignment has been submitted successfully. You will receive feedback within 3-5 business days.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/dashboard" className="btn-primary">
                Back to Dashboard
              </Link>
              <button className="btn-secondary">
                View Submission
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
