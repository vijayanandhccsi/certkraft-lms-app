import React from 'react';
import { 
  Cloud, Shield, Brain, Infinity, Cpu, Network, Award, 
  Terminal, Activity, Lock, Server, Box, Layers, Code2, 
  ClipboardCheck 
} from 'lucide-react';

// NEW: Define lesson types
export type LessonType = 'Video' | 'Lab' | 'Quiz' | 'Reading';

// NEW: Define the Lesson interface
export interface Lesson {
  id: number;
  title: string;
  type: LessonType;
}

// UPDATED: LearningPathModule now contains an array of Lessons
export interface LearningPathModule {
  id: number;
  title: string;
  lessons: Lesson[];
}

export type LearningPathStatus = 'Draft' | 'Published' | 'Scheduled'; // Updated
export type EnrollmentType = 'Free' | 'Paid' | 'Subscription' | 'Corporate'; // New

export interface LearningPath {
  id: number;
  title: string;
  slug: string;
  status: LearningPathStatus;
  scheduledDate?: string; // New
  order: number;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  desc: string;
  longDescription: string;
  banner?: string; // New: Preview Image
  
  // Taxonomy
  roles: string[];
  skills: string[];
  categories: string[]; // New
  technologies: string[];
  
  // Metrics
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed';
  totalDuration: string; // Keep for backward compatibility, mapped to estimatedHours
  estimatedHours: string; // New
  coursesCount: number; // New
  labsCount: number; // New
  
  // Commerce
  enrollmentType: EnrollmentType; // New
  price: number; // New
  discountPrice: number; // New
  
  // SEO
  seoTitle?: string; // New
  seoDescription?: string; // New
  
  // Configuration
  aiConfig: { // New
    autoOrder: boolean;
    autoLabs: boolean;
    autoSeo: boolean;
  };
  
  syllabus: LearningPathModule[]; 
  outcomes: string[];
}

export const PATHS: LearningPath[] = [];