// Note-taking functionality for courses and lessons
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Notes() {
  const { courseId, lessonId } = useParams();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock notes data
  const mockNotes = [
    {
      id: 1,
      content: 'Present perfect is used for actions that happened at an unspecified time in the past. Key indicators: already, yet, never, ever, just, since, for.',
      courseId: 'grammar-fundamentals',
      lessonId: '3',
      lessonTitle: 'Verbs and Tenses',
      timestamp: '2024-01-15T10:30:00Z',
      tags: ['present-perfect', 'grammar', 'tenses']
    },
    {
      id: 2,
      content: 'Remember: Use "have/has + past participle" for present perfect. Examples:\n- I have finished my homework.\n- She has lived here for 5 years.\n- They have never been to Japan.',
      courseId: 'grammar-fundamentals',
      lessonId: '3',
      lessonTitle: 'Verbs and Tenses',
      timestamp: '2024-01-15T11:15:00Z',
      tags: ['present-perfect', 'examples']
    },
    {
      id: 3,
      content: 'Adjectives describe nouns. They can come before the noun (a red car) or after linking verbs (the car is red). Order matters when using multiple adjectives: opinion, size, age, shape, color, origin, material, purpose.',
      courseId: 'grammar-fundamentals',
      lessonId: '4',
      lessonTitle: 'Adjectives and Adverbs',
      timestamp: '2024-01-14T14:20:00Z',
      tags: ['adjectives', 'word-order', 'grammar']
    }
  ];

  useEffect(() => {
    // Filter notes by course and lesson if specified
    let filteredNotes = mockNotes;
    if (courseId) {
      filteredNotes = filteredNotes.filter(note => note.courseId === courseId);
    }
    if (lessonId) {
      filteredNotes = filteredNotes.filter(note => note.lessonId === lessonId);
    }
    setNotes(filteredNotes);
  }, [courseId, lessonId]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const note = {
      id: notes.length + 1,
      content: newNote,
      courseId: courseId || 'general',
      lessonId: lessonId || null,
      lessonTitle: lessonId ? `Lesson ${lessonId}` : 'General Notes',
      timestamp: new Date().toISOString(),
      tags: extractTags(newNote)
    };

    setNotes([note, ...notes]);
    setNewNote('');
  };

  const handleEditNote = (noteId, newContent) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, content: newContent, tags: extractTags(newContent) }
        : note
    );
    setNotes(updatedNotes);
    setEditingNote(null);
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
    }
  };

  const extractTags = (content) => {
    // Simple tag extraction based on common English learning terms
    const commonTerms = [
      'grammar', 'vocabulary', 'pronunciation', 'tenses', 'present-perfect',
      'past-simple', 'adjectives', 'adverbs', 'nouns', 'verbs', 'phrasal-verbs',
      'prepositions', 'articles', 'conditionals', 'passive-voice'
    ];
    
    const contentLower = content.toLowerCase();
    return commonTerms.filter(term => contentLower.includes(term.replace('-', ' ')));
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

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPageTitle = () => {
    if (courseId && lessonId) return `Notes - Lesson ${lessonId}`;
    if (courseId) return `Notes - Course`;
    return 'My Notes';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to={courseId ? `/course/${courseId}` : '/dashboard'} 
                className="text-primary-600 hover:text-primary-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                {getPageTitle()}
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
          <p className="text-gray-600">
            {courseId && lessonId 
              ? 'Notes for this specific lesson'
              : courseId 
                ? 'All notes for this course'
                : 'All your study notes in one place'
            }
          </p>
        </div>

        {/* Add New Note */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Note</h2>
          <form onSubmit={handleAddNote}>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write your note here... (tags will be automatically detected)"
              rows={4}
              className="input-field resize-none mb-4"
              required
            />
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">
                Save Note
              </button>
            </div>
          </form>
        </div>

        {/* Search Notes */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes by content or tags..."
              className="input-field pl-10"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {filteredNotes.length === 0 ? (
            <div className="card text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'Start taking notes to see them here'}
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div key={note.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {editingNote === note.id ? (
                      <div>
                        <textarea
                          defaultValue={note.content}
                          rows={4}
                          className="input-field resize-none mb-2"
                          onBlur={(e) => handleEditNote(note.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setEditingNote(null);
                            if (e.key === 'Enter' && e.ctrlKey) {
                              handleEditNote(note.id, e.target.value);
                            }
                          }}
                          autoFocus
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingNote(null)}
                            className="text-sm text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <span className="text-sm text-gray-400">Press Ctrl+Enter to save</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700 whitespace-pre-wrap mb-4">{note.content}</p>
                        
                        {/* Tags */}
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {note.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Note Info */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div>
                            {note.lessonTitle && (
                              <span className="font-medium">{note.lessonTitle}</span>
                            )}
                          </div>
                          <div>{formatTimeAgo(note.timestamp)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {editingNote !== note.id && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setEditingNote(note.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded"
                        title="Edit note"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded"
                        title="Delete note"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notes Tips */}
        <div className="mt-8 card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Note-Taking Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use keywords like "grammar", "vocabulary", "tenses" for automatic tagging</li>
            <li>• Press Ctrl+Enter while editing to save quickly</li>
            <li>• Search through all your notes using the search bar</li>
            <li>• Notes are automatically organized by course and lesson</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
