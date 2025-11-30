import React, { createContext, useState, useContext, ReactNode } from 'react';

export type StudentStatus = 'Active' | 'Inactive' | 'Suspended' | 'Invited';

export interface ActivityLog {
  id: string;
  action: string;
  date: string;
  details: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface StudentCertificate {
  id: string;
  title: string;
  issueDate: string;
  url: string;
}

export interface StudentLabUsage {
  id: string;
  name: string;
  hoursUsed: number;
  lastSession: string;
  status: 'Running' | 'Expired' | 'Completed';
}

export interface EnrolledItem {
  id: number;
  title: string;
  progress: number;
  status: 'In Progress' | 'Completed' | 'Not Started';
  lastAccessed: string;
}

export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: string; // Target Role / Goal
  status: StudentStatus;
  joinDate: string;
  lastLogin: string;
  
  // Progress Metrics
  learningPath: string; // Main active path name
  coursesCompleted: number;
  coursesTotal: number;
  labsCompleted: number;
  progress: number; // Overall progress percentage
  totalLearningHours: number;
  
  // Collections
  certificates: StudentCertificate[];
  labUsage: StudentLabUsage[];
  activityLogs: ActivityLog[];
  enrolledPaths: EnrolledItem[];
  enrolledCourses: EnrolledItem[];
}

interface AdminStudentContextType {
  students: AdminStudent[];
  addStudent: (student: AdminStudent) => void;
  updateStudent: (student: AdminStudent) => void;
  deleteStudent: (id: string) => void;
  getStudent: (id: string) => AdminStudent | undefined;
}

const AdminStudentContext = createContext<AdminStudentContextType | undefined>(undefined);

export const AdminStudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with empty array as requested
  const [students, setStudents] = useState<AdminStudent[]>([]);

  const addStudent = (student: AdminStudent) => {
    setStudents(prev => [...prev, student]);
  };

  const updateStudent = (updatedStudent: AdminStudent) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const getStudent = (id: string) => students.find(s => s.id === id);

  return (
    <AdminStudentContext.Provider value={{ students, addStudent, updateStudent, deleteStudent, getStudent }}>
      {children}
    </AdminStudentContext.Provider>
  );
};

export const useAdminStudents = () => {
  const context = useContext(AdminStudentContext);
  if (!context) {
    throw new Error('useAdminStudents must be used within a AdminStudentProvider');
  }
  return context;
};