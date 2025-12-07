import React, { createContext, useState, useContext, ReactNode } from 'react';

export type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'short_answer';

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  points: number;
  options: Option[];
  explanation?: string;
}

export interface AssessmentSettings {
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  shuffleQuestions: boolean;
  maxAttempts: number;
  showExplanation: boolean;
}

export interface Assessment {
  id: number;
  title: string;
  description: string;
  type: 'Quiz' | 'Exam' | 'Practice';
  status: 'Draft' | 'Published';
  questions: Question[];
  settings: AssessmentSettings;
  createdDate: string;
}

interface AssessmentContextType {
  assessments: Assessment[];
  addAssessment: (assessment: Assessment) => void;
  updateAssessment: (assessment: Assessment) => void;
  deleteAssessment: (id: number) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: 101,
      title: 'Cloud Security Fundamentals',
      description: 'Basic knowledge check for IAM and VPC security.',
      type: 'Quiz',
      status: 'Published',
      createdDate: '2023-10-15',
      settings: {
        timeLimit: 30,
        passingScore: 70,
        shuffleQuestions: true,
        maxAttempts: 3,
        showExplanation: true
      },
      questions: [
        {
          id: 'q1',
          text: 'Which AWS service is used for Identity and Access Management?',
          type: 'single_choice',
          points: 10,
          options: [
            { id: 'opt1', text: 'AWS IAM', isCorrect: true },
            { id: 'opt2', text: 'AWS EC2', isCorrect: false },
            { id: 'opt3', text: 'AWS S3', isCorrect: false }
          ],
          explanation: 'IAM (Identity and Access Management) is the correct service.'
        }
      ]
    }
  ]);

  const addAssessment = (assessment: Assessment) => {
    setAssessments(prev => [...prev, assessment]);
  };

  const updateAssessment = (updatedAssessment: Assessment) => {
    setAssessments(prev => prev.map(a => a.id === updatedAssessment.id ? updatedAssessment : a));
  };

  const deleteAssessment = (id: number) => {
    setAssessments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AssessmentContext.Provider value={{ assessments, addAssessment, updateAssessment, deleteAssessment }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessments = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessments must be used within an AssessmentProvider');
  }
  return context;
};