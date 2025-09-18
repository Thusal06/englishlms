import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AssignmentsContext = createContext();

export function AssignmentsProvider({ children }) {
  const { currentUser } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  // Bump this when assignment schema/ids change to invalidate old cached states
  const STORAGE_VERSION = 'v2-2025-09-19';

  // Load assignments from localStorage on initial load
  useEffect(() => {
    if (currentUser) {
      const versionKey = `assignments_version_${currentUser.uid}`;
      const storedVersion = localStorage.getItem(versionKey);
      if (storedVersion !== STORAGE_VERSION) {
        // Invalidate old cache to avoid stale "completed" statuses or schema mismatches
        localStorage.removeItem(`assignments_${currentUser.uid}`);
        localStorage.setItem(versionKey, STORAGE_VERSION);
        setAssignments([]);
      } else {
        const savedAssignments = JSON.parse(localStorage.getItem(`assignments_${currentUser.uid}`)) || [];
        setAssignments(savedAssignments);
      }
    }
    setLoading(false);
  }, [currentUser]);

  // Save assignments to localStorage whenever they change
  useEffect(() => {
    if (currentUser && !loading) {
      localStorage.setItem(`assignments_${currentUser.uid}`, JSON.stringify(assignments));
      localStorage.setItem(`assignments_version_${currentUser.uid}`, STORAGE_VERSION);
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

  // Admin/maintenance: clear all cached assignments for current user
  const resetAllAssignments = () => {
    if (!currentUser) return;
    localStorage.removeItem(`assignments_${currentUser.uid}`);
    setAssignments([]);
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
        loading,
        resetAllAssignments
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
