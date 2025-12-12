import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// --- IN-MEMORY NOSQL DATABASE (Mirrors server/index.js) ---
const DB = {
  courses: [
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
      promoVideoUrl: 'https://www.youtube.com/watch?v=Ia-UEXdRzRw',
      description: 'Comprehensive preparation for the AWS Solutions Architect Associate exam.',
      longDescription: 'This course covers all domains of the SAA-C03 exam...',
      objective: 'Pass the AWS SAA-C03 Exam',
      learningObjectives: ['Design resilient architectures', 'High performing architectures'],
      prerequisites: 'Basic IT knowledge',
      whatIsIncluded: ['Videos', 'Labs', 'Practice Exams'],
      seo: { metaTitle: '', metaDescription: '', slug: 'aws-saa-c03' },
      faqs: [],
      modules: [
        {
          id: 'mod_1',
          title: 'Introduction to Cloud Computing',
          sortOrder: 1,
          lessons: [
            { id: 'les_1', title: 'What is Cloud Computing?', type: 'Video', duration: '10 min', isPreview: true },
            { id: 'les_2', title: 'AWS Global Infrastructure', type: 'Video', duration: '15 min', isPreview: false }
          ]
        },
        {
          id: 'mod_2',
          title: 'Identity and Access Management (IAM)',
          sortOrder: 2,
          lessons: [
            { id: 'les_3', title: 'IAM Users and Groups', type: 'Video', duration: '20 min', isPreview: false },
            { id: 'les_4', title: 'IAM Policies Lab', type: 'Lab', duration: '45 min', isPreview: false }
          ]
        }
      ]
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
  ],
  users: [
    { id: 1, name: 'Demo Student', email: 'student@demo.com', role: 'Student' }
  ]
};

const sendResponse = (res, success, data = null, message = '') => {
  res.json({ success, data, message });
};

// --- API ROUTES ---

// Health Check
app.get('/health', (req, res) => {
  sendResponse(res, true, { timestamp: new Date(), mode: 'Firebase Cloud Functions' }, 'System healthy');
});

// Get All Courses
app.get('/courses', async (req, res) => {
  try {
    const publishedCourses = DB.courses.filter(c => c.status === 'Published');
    sendResponse(res, true, publishedCourses, 'Courses retrieved successfully');
  } catch (error) {
    sendResponse(res, false, null, error.message);
  }
});

// Get Specific Course
app.get('/courses/:id', async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = DB.courses.find(c => c.id === courseId);
    if (!course) return sendResponse(res, false, null, 'Course not found');
    sendResponse(res, true, course, 'Course details retrieved');
  } catch (error) {
    sendResponse(res, false, null, error.message);
  }
});

// Mock Auth
app.post('/auth/login', async (req, res) => {
  const { email } = req.body;
  try {
    const user = DB.users.find(u => u.email === email);
    if (user) {
      sendResponse(res, true, { 
        token: 'firebase-jwt-' + user.id,
        user: user
      }, 'Login successful');
    } else {
      const newUser = { id: Date.now(), name: 'New User', email, role: 'Student' };
      DB.users.push(newUser);
      sendResponse(res, true, { 
        token: 'firebase-jwt-' + newUser.id,
        user: newUser
      }, 'User registered and logged in');
    }
  } catch (error) {
    sendResponse(res, false, null, 'Login failed');
  }
});

// Profile
app.get('/me/profile', (req, res) => {
  const profileData = {
    student: { id: 1, name: 'Demo Student', email: 'student@demo.com', role: 'Student', avatar: '' },
    stats: { totalHours: 10, labsCompleted: 2, certificatesEarned: 0, badges: [], currentStreak: 1 },
    enrolledCourses: [],
    enrolledPaths: []
  };
  sendResponse(res, true, profileData, 'Profile retrieved');
});

// Expose Express App as a Cloud Function
export const api = onRequest(app);