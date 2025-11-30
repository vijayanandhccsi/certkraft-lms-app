import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '../services/apiClient';

// Interfaces for Student State
export interface EnrolledPath {
  pathId: number;
  progress: number; // 0-100
  status: 'In Progress' | 'Completed' | 'Not Started';
  lastAccessed: string;
}

export interface EnrolledCourse {
  courseId: number;
  progress: number; // 0-100
  completedLessons: string[]; // IDs of completed lessons
  lastAccessedLessonId?: string;
  status: 'In Progress' | 'Completed' | 'Not Started';
}

export interface ActiveLab {
  id: string;
  name: string;
  status: 'Running' | 'Expired' | 'Scheduled';
  timeLeft?: string;
  startTime?: string;
}

export interface UpcomingLab {
  id: string;
  name: string;
  startTime: string;
  duration: string;
}

export interface UserStats {
  totalHours: number;
  labsCompleted: number;
  certificatesEarned: number;
  badges: string[]; 
  currentStreak: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  role: string; 
  avatar: string;
}

export interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  date: string;
}

export interface SmartSheet {
  id: string;
  title: string;
  type: 'PDF' | 'Sheet' | 'Cheatsheet';
  size: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string; 
  type: 'Lesson' | 'Lab' | 'Quiz' | 'Badge';
  score?: string;
}

export interface DailyProgress {
  day: string; 
  hours: number; 
  active: boolean; 
}

export interface Certificate {
  id: string;
  title: string;
  type: 'Course' | 'Learning Path';
  issueDate: string;
  instructor?: string;
  validationId: string;
  thumbnail: string; 
}

export interface Badge {
  id: string;
  name: string;
  type: 'Skill' | 'Lab' | 'Achievement';
  icon: string; 
  color: string;
  earnedDate: string;
  description: string;
}

export interface BadgeGoal {
  id: string;
  name: string;
  progress: number; 
  tasksRemaining: string[];
  icon: string;
}

interface StudentContextType {
  student: Student;
  enrolledPaths: EnrolledPath[];
  enrolledCourses: EnrolledCourse[];
  activeLabs: ActiveLab[];
  upcomingLabs: UpcomingLab[];
  stats: UserStats;
  announcements: Announcement[];
  smartSheets: SmartSheet[];
  learningTimeline: TimelineEvent[];
  weeklyActivity: DailyProgress[];
  certificates: Certificate[];
  earnedBadges: Badge[];
  upcomingBadges: BadgeGoal[];
  
  isLoading: boolean; // New state
  isBackendLive: boolean; // Status indicator

  markLessonComplete: (courseId: number, lessonId: string) => Promise<void>;
  enrollInCourse: (courseId: number) => Promise<void>;
  dismissAnnouncement: (id: string) => void;
  login: (name: string, email: string) => Promise<void>;
  logout: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

// --- MOCK DATA CONSTANTS (Fallback / Simulated DB) ---
const DEFAULT_STUDENT: Student = {
  id: 'guest',
  name: 'Guest User',
  email: '',
  role: 'Aspiring Engineer',
  avatar: '',
};

const MOCK_STATS: UserStats = {
  totalHours: 45,
  labsCompleted: 12,
  certificatesEarned: 2,
  badges: ['VPC Ninja', 'Linux Explorer'],
  currentStreak: 7,
};

const MOCK_PATHS: EnrolledPath[] = [
  { pathId: 1, progress: 35, status: 'In Progress', lastAccessed: '2 hours ago' },
  { pathId: 2, progress: 100, status: 'Completed', lastAccessed: '1 week ago' },
  { pathId: 3, progress: 0, status: 'Not Started', lastAccessed: 'Never' },
];

const MOCK_COURSES: EnrolledCourse[] = [
  { courseId: 101, progress: 45, status: 'In Progress', completedLessons: ['l1', 'l2'], lastAccessedLessonId: 'l3' },
  { courseId: 102, progress: 10, status: 'In Progress', completedLessons: ['l1'], lastAccessedLessonId: 'l2' },
  { courseId: 103, progress: 100, status: 'Completed', completedLessons: ['l1', 'l2', 'l3'] }
];

const MOCK_LABS: ActiveLab[] = [
  { id: 'lab-1', name: 'Configure IAM Roles', status: 'Running', timeLeft: '25m', startTime: '10:00 AM' },
];

const MOCK_UPCOMING_LABS: UpcomingLab[] = [
  { id: 'ulab-1', name: 'Linux File Permissions', startTime: 'Tomorrow, 10:00 AM', duration: '45m' },
  { id: 'ulab-2', name: 'K8s Cluster Setup', startTime: 'Fri, 2:00 PM', duration: '60m' },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', message: 'New "DevOps Masterclass" course is now available!', type: 'success', date: 'Today' },
  { id: 'a2', message: 'Scheduled maintenance: Saturday 10 PM EST.', type: 'warning', date: 'Yesterday' }
];

const MOCK_SHEETS: SmartSheet[] = [
  { id: 'ss1', title: 'AWS IAM Cheatsheet', type: 'PDF', size: '1.2 MB' },
  { id: 'ss2', title: 'Linux Commands Reference', type: 'Cheatsheet', size: '0.8 MB' },
  { id: 'ss3', title: 'VPC Design Pattern', type: 'Sheet', size: '2.4 MB' },
];

const MOCK_TIMELINE: TimelineEvent[] = [
  { id: 't1', title: 'Completed "IAM Roles Quiz"', date: 'Today', type: 'Quiz', score: '90%' },
  { id: 't2', title: 'Finished "VPC Subnets Lesson"', date: 'Yesterday', type: 'Lesson' },
  { id: 't3', title: 'Completed "Configure S3 Bucket Lab"', date: '3 days ago', type: 'Lab' },
  { id: 't4', title: 'Earned "VPC Ninja" Badge', date: '4 days ago', type: 'Badge' },
];

const MOCK_WEEKLY: DailyProgress[] = [
  { day: 'M', hours: 1.5, active: true },
  { day: 'T', hours: 2.0, active: true },
  { day: 'W', hours: 0.5, active: true },
  { day: 'T', hours: 3.0, active: true },
  { day: 'F', hours: 4.5, active: true },
  { day: 'S', hours: 0, active: false },
  { day: 'S', hours: 1.0, active: true },
];

const MOCK_CERTS: Certificate[] = [
  { id: 'cert-103', title: 'DevOps CI/CD with Jenkins', type: 'Course', issueDate: 'Jan 12, 2025', instructor: 'Sarah Connor', validationId: 'CK-8829-JENK', thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=400' },
  { id: 'path-2', title: 'Cyber Security Specialist', type: 'Learning Path', issueDate: 'Dec 20, 2024', validationId: 'CK-PATH-9921', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400' }
];

const MOCK_BADGES: Badge[] = [
  { id: 'b1', name: 'VPC Ninja', type: 'Skill', icon: '🛡️', color: 'bg-indigo-100 text-indigo-600', earnedDate: '2 days ago', description: 'Mastered VPC Peering & Subnets' },
  { id: 'b2', name: 'Linux Explorer', type: 'Lab', icon: '🐧', color: 'bg-yellow-100 text-yellow-600', earnedDate: '1 week ago', description: 'Completed 5 Linux Labs' },
  { id: 'b3', name: '7-Day Streak', type: 'Achievement', icon: '🔥', color: 'bg-orange-100 text-orange-600', earnedDate: 'Today', description: 'Consistent learning for a week' },
  { id: 'b4', name: 'Lab Master', type: 'Lab', icon: '🧪', color: 'bg-emerald-100 text-emerald-600', earnedDate: 'Last Month', description: 'Completed 10 Labs' },
];

const MOCK_GOALS: BadgeGoal[] = [
  { id: 'g1', name: 'Cloud IAM Pro', icon: '☁️', progress: 60, tasksRemaining: ['Complete 2 more IAM Labs', 'Finish Module 3 of AWS Path'] },
  { id: 'g2', name: '50h Learning Club', icon: '🎓', progress: 90, tasksRemaining: ['5 hours of learning remaining'] }
];

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State initialization
  const [student, setStudent] = useState<Student>(DEFAULT_STUDENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendLive, setIsBackendLive] = useState(false);
  
  // Data States
  const [enrolledPaths, setEnrolledPaths] = useState<EnrolledPath[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [activeLabs, setActiveLabs] = useState<ActiveLab[]>([]);
  const [upcomingLabs, setUpcomingLabs] = useState<UpcomingLab[]>([]);
  const [stats, setStats] = useState<UserStats>(MOCK_STATS);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [smartSheets, setSmartSheets] = useState<SmartSheet[]>([]);
  const [learningTimeline, setLearningTimeline] = useState<TimelineEvent[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<DailyProgress[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [upcomingBadges, setUpcomingBadges] = useState<BadgeGoal[]>([]);

  // Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let backendData = null;

        // 1. Attempt Real Backend Connection
        try {
          const response = await api.get('/me/profile', { timeout: 2000 });
          if (response.data) {
            backendData = response.data;
            setIsBackendLive(true);
            console.log("Connected to Real Backend");
          }
        } catch (apiError) {
          console.log("Backend offline or not reachable, switching to Mock Mode.");
          setIsBackendLive(false);
        }

        if (backendData) {
          // --- USE REAL DATA ---
          setStudent(backendData.student || DEFAULT_STUDENT);
          setEnrolledPaths(backendData.enrolledPaths || []);
          setEnrolledCourses(backendData.enrolledCourses || []);
          setActiveLabs(backendData.activeLabs || []);
          setUpcomingLabs(backendData.upcomingLabs || []);
          setStats(backendData.stats || MOCK_STATS);
          setAnnouncements(backendData.announcements || []);
          setSmartSheets(backendData.smartSheets || []);
          setLearningTimeline(backendData.learningTimeline || []);
          setWeeklyActivity(backendData.weeklyActivity || []);
          setCertificates(backendData.certificates || []);
          setEarnedBadges(backendData.earnedBadges || []);
          setUpcomingBadges(backendData.upcomingBadges || []);
        } else {
          // --- USE MOCK DATA & LOCALSTORAGE ---
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading

          const token = localStorage.getItem('ck_auth_token');
          if (token) {
            const savedProfile = localStorage.getItem('student_profile');
            if (savedProfile) setStudent(JSON.parse(savedProfile));
            else setStudent({ ...DEFAULT_STUDENT, name: 'Returned User' });

            // Load all Mock Data
            setEnrolledPaths(MOCK_PATHS);
            setEnrolledCourses(MOCK_COURSES);
            setActiveLabs(MOCK_LABS);
            setUpcomingLabs(MOCK_UPCOMING_LABS);
            setStats(MOCK_STATS);
            setAnnouncements(MOCK_ANNOUNCEMENTS);
            setSmartSheets(MOCK_SHEETS);
            setLearningTimeline(MOCK_TIMELINE);
            setWeeklyActivity(MOCK_WEEKLY);
            setCertificates(MOCK_CERTS);
            setEarnedBadges(MOCK_BADGES);
            setUpcomingBadges(MOCK_GOALS);
          } else {
            setStudent(DEFAULT_STUDENT);
          }
        }
      } catch (error) {
        console.error("Failed to fetch student data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- ACTIONS ---

  const login = async (name: string, email: string) => {
    setIsLoading(true);
    try {
      if (isBackendLive) {
        // Real Login
        await api.post('/auth/login', { email, name }); // Assuming simplified flow or mock endpoint accepts name for signup
        // Fetch fresh data after login
        const response = await api.get('/me/profile');
        setStudent(response.data.student);
        // ... set other data
      } else {
        // Mock Login
        await new Promise(resolve => setTimeout(resolve, 800));
        const token = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('ck_auth_token', token);

        const newProfile = {
          ...student,
          id: 'user-' + Date.now(),
          name,
          email,
          role: 'Cloud Security Engineer',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
        };
        
        setStudent(newProfile);
        localStorage.setItem('student_profile', JSON.stringify(newProfile));

        // Reset to full mock state
        setEnrolledPaths(MOCK_PATHS);
        setEnrolledCourses(MOCK_COURSES);
        setActiveLabs(MOCK_LABS);
        setUpcomingLabs(MOCK_UPCOMING_LABS);
        setStats(MOCK_STATS);
        setAnnouncements(MOCK_ANNOUNCEMENTS);
        setSmartSheets(MOCK_SHEETS);
        setLearningTimeline(MOCK_TIMELINE);
        setWeeklyActivity(MOCK_WEEKLY);
        setCertificates(MOCK_CERTS);
        setEarnedBadges(MOCK_BADGES);
        setUpcomingBadges(MOCK_GOALS);
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ck_auth_token');
    localStorage.removeItem('student_profile');
    setStudent(DEFAULT_STUDENT);
    setEnrolledPaths([]);
    setEnrolledCourses([]);
    setActiveLabs([]);
    // ... clear other states
  };

  const markLessonComplete = async (courseId: number, lessonId: string) => {
    // Optimistic Update
    setEnrolledCourses(prev => prev.map(c => {
      if (c.courseId === courseId) {
        if (c.completedLessons.includes(lessonId)) return c;
        const newCompleted = [...c.completedLessons, lessonId];
        const newProgress = Math.min(c.progress + 10, 100);
        return {
          ...c,
          completedLessons: newCompleted,
          progress: newProgress,
          status: newProgress === 100 ? 'Completed' : 'In Progress'
        };
      }
      return c;
    }));

    if (isBackendLive) {
      try {
        await api.patch(`/me/progress/${courseId}/lessons/${lessonId}`, { completed: true });
      } catch (error) {
        console.error("Failed to sync progress", error);
      }
    }
  };

  const enrollInCourse = async (courseId: number) => {
    if (enrolledCourses.find(c => c.courseId === courseId)) return;
    
    // Optimistic
    setEnrolledCourses(prev => [
      ...prev, 
      { courseId, progress: 0, status: 'In Progress', completedLessons: [] }
    ]);

    if (isBackendLive) {
      try {
        await api.post('/me/enrollments', { courseId });
      } catch (error) {
        console.error("Enrollment failed", error);
      }
    }
  };

  const dismissAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  return (
    <StudentContext.Provider value={{ 
      student, enrolledPaths, enrolledCourses, activeLabs, upcomingLabs, stats, 
      announcements, smartSheets, learningTimeline, weeklyActivity,
      certificates, earnedBadges, upcomingBadges,
      isLoading, isBackendLive,
      markLessonComplete, enrollInCourse, dismissAnnouncement, login, logout
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};