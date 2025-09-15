// Main App component with routing and authentication setup
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import QuizDetail from './pages/QuizDetail';
import AssignmentDetail from './pages/AssignmentDetail';
import Discussion from './pages/Discussion';
import Notes from './pages/Notes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/course/:courseId" 
              element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/:quizId" 
              element={
                <ProtectedRoute>
                  <QuizDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assignment/:assignmentId" 
              element={
                <ProtectedRoute>
                  <AssignmentDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/discussion/:courseId?" 
              element={
                <ProtectedRoute>
                  <Discussion />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notes/:courseId?/:lessonId?" 
              element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
