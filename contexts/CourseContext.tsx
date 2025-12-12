import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '../services/apiClient';

export interface FAQ {
  question: string;
  answer: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  type: 'Video' | 'Quiz' | 'Lab' | 'SCORM' | 'Interactive Page' | 'HTML';
  duration: string;
  isPreview: boolean; // For free preview
  content?: string; // URL for content (HTML file, etc.)
  fileName?: string; // Display name for uploaded file
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseSEO {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  ogImage?: string;
}

export interface Course {
  id: number;
  // Basic Info
  title: string;
  subtitle: string; // New
  courseType: 'Self-Paced' | 'Smart Sheets' | 'Certification Course';
  language: string;
  instructorId: string;
  learningPathId: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed'; // New
  status: 'Published' | 'Draft' | 'Scheduled';
  
  // Taxonomy
  categories: string[]; // New
  tags: string[]; // New

  // Metrics
  durationHours: number; // New
  lessonsCount: number; // New
  labsCount: number; // New

  // Media
  thumbnail: string;
  promoVideoUrl: string;
  banner?: string; // New

  // Details
  description: string; // Short description
  longDescription: string; // HTML friendly
  objective: string; // "What you'll learn" summary
  learningObjectives: string[]; // List of outcomes
  prerequisites: string;
  examObjectives?: string;
  whatIsIncluded: string[]; // List of included items (SCORM, Cert, etc)

  // Structure
  modules: CourseModule[]; // New

  // SEO
  seo: CourseSEO; // New

  faqs: FAQ[];
}

interface CourseContextType {
  courses: Course[];
  isLoading: boolean;
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: number) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Initial Mock Data (Fallback)
const MOCK_COURSES: Course[] = [
    {
      id: 101,
      title: 'AWS Certified Solutions Architect Associate',
      subtitle: 'Master AWS architecture and pass the SAA-C03 exam.',
      courseType: 'Certification Course',
      language: 'English',
      instructorId: '1',
      learningPathId: '1',
      level: 'Intermediate',
      status: 'Published',
      categories: ['Cloud'],
      tags: ['AWS', 'Architecture', 'Cloud'],
      durationHours: 24,
      lessonsCount: 45,
      labsCount: 12,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1080',
      promoVideoUrl: '',
      description: 'Comprehensive preparation for the AWS Solutions Architect Associate exam.',
      longDescription: 'This course covers all domains of the SAA-C03 exam...',
      objective: 'Pass the AWS SAA-C03 Exam',
      learningObjectives: ['Design resilient architectures', 'High performing architectures'],
      prerequisites: 'Basic IT knowledge',
      whatIsIncluded: ['Videos', 'Labs', 'Practice Exams'],
      modules: [],
      seo: { metaTitle: '', metaDescription: '', slug: 'aws-saa-c03' },
      faqs: []
    },
    {
      id: 102,
      title: 'Python for Cyber Security',
      subtitle: 'Automate security tasks and build tools with Python.',
      courseType: 'Self-Paced',
      language: 'English',
      instructorId: '2',
      learningPathId: '2',
      level: 'Beginner',
      status: 'Published',
      categories: ['Cybersecurity', 'Software Development'],
      tags: ['Python', 'Security', 'Automation'],
      durationHours: 12,
      lessonsCount: 20,
      labsCount: 8,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1080',
      promoVideoUrl: '',
      description: 'Learn Python programming specifically for security applications.',
      longDescription: '',
      objective: 'Build custom security tools',
      learningObjectives: [],
      prerequisites: 'None',
      whatIsIncluded: [],
      modules: [],
      seo: { metaTitle: '', metaDescription: '', slug: 'python-security' },
      faqs: []
    },
    {
      id: 103,
      title: 'DevOps CI/CD with Jenkins',
      subtitle: 'Build robust pipelines with Jenkins and Docker.',
      courseType: 'Self-Paced',
      language: 'English',
      instructorId: '3',
      learningPathId: '3',
      level: 'Advanced',
      status: 'Published',
      categories: ['DevOps'],
      tags: ['Jenkins', 'CI/CD', 'Docker'],
      durationHours: 18,
      lessonsCount: 30,
      labsCount: 15,
      thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1080',
      promoVideoUrl: '',
      description: 'Master Jenkins for continuous integration and delivery.',
      longDescription: '',
      objective: 'Implement CI/CD pipelines',
      learningObjectives: [],
      prerequisites: 'Linux basics',
      whatIsIncluded: [],
      modules: [],
      seo: { metaTitle: '', metaDescription: '', slug: 'jenkins-cicd' },
      faqs: []
    }
];

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            // Standard Response Format: { success: true, data: [...] }
            if (response && response.data && response.data.success) {
                if (Array.isArray(response.data.data) && response.data.data.length > 0) {
                    setCourses(response.data.data);
                }
            } else {
                console.warn("API connected but returned no data. Using local cache.");
            }
        } catch (error) {
            console.log("Offline mode: Using cached course data.");
        } finally {
            setIsLoading(false);
        }
    };

    fetchCourses();
  }, []);

  const addCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
    // In production, also POST to API
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    // In production, also PUT to API
  };

  const deleteCourse = (id: number) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    // In production, also DELETE from API
  };

  return (
    <CourseContext.Provider value={{ courses, isLoading, addCourse, updateCourse, deleteCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};