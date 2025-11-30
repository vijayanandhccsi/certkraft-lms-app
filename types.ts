// Enums
// Fix: Uncommented CourseLevel enum as it is used by the Course interface.
export enum CourseLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

// Interfaces
// Fix: Uncommented Course interface to resolve build error in CourseCard.tsx.
export interface Course {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  price: number;
  thumbnail: string;
  level: CourseLevel;
  category: string;
}

export interface LearningStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedDuration: string;
}

export interface LearningPathResponse {
  careerGoal: string;
  steps: LearningStep[];
}