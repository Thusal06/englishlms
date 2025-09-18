import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AssignmentsContext = createContext();

export function AssignmentsProvider({ children }) {
  const { currentUser } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load assignments from localStorage on initial load
  useEffect(() => {
    if (currentUser) {
      const savedAssignments = JSON.parse(localStorage.getItem(`assignments_${currentUser.uid}`)) || [];
      setAssignments(savedAssignments);
    }
    setLoading(false);
  }, [currentUser]);

  // Save assignments to localStorage whenever they change
  useEffect(() => {
    if (currentUser && !loading) {
      localStorage.setItem(`assignments_${currentUser.uid}`, JSON.stringify(assignments));
    }
  }, [assignments, currentUser, loading]);

  const addAssignment = (assignment) => {
    setAssignments(prev => {
      // Check if assignment already exists
      const exists = prev.some(a => 
        a.id === assignment.id && 
        a.courseId === assignment.courseId &&
        a.lessonId === assignment.lessonId
      );
      
      if (!exists) {
        return [...prev, { ...assignment, status: 'pending', submitted: false }];
      }
      return prev;
    });
  };

  const updateAssignmentStatus = (id, status, submissionData = null) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === id 
          ? { 
              ...assignment, 
              status, 
              submitted: status === 'completed',
              submittedAt: status === 'completed' ? new Date().toISOString() : assignment.submittedAt,
              submissionData: submissionData || assignment.submissionData
            }
          : assignment
      )
    );
  };

  const addSubmission = (assignmentId, submissionData) => {
    updateAssignmentStatus(assignmentId, 'completed', submissionData);
  };

  const getCourseAssignments = (courseId) => {
    return assignments.filter(a => a.courseId === courseId);
  };

  const getPendingAssignments = () => {
    return assignments.filter(a => a.status === 'pending');
  };

  const getCompletedAssignments = () => {
    return assignments.filter(a => a.status === 'completed');
  };

  return (
    <AssignmentsContext.Provider 
      value={{
        assignments,
        addAssignment,
        updateAssignmentStatus,
        addSubmission,
        getCourseAssignments,
        getPendingAssignments,
        getCompletedAssignments,
        loading
      }}
    >
      {children}
    </AssignmentsContext.Provider>
  );
}

export function useAssignments() {
  const context = useContext(AssignmentsContext);
  if (context === undefined) {
    throw new Error('useAssignments must be used within an AssignmentsProvider');
  }
  return context;
}
