import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LearningPaths from './pages/LearningPaths'; 
import CourseLandingPage from './pages/CourseLandingPage'; // Import public course page
import Login from './pages/Login'; // Import Login page
import Signup from './pages/Signup'; // Import Signup page
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLearningPaths from './pages/admin/AdminLearningPaths';
import AdminCourses from './pages/admin/AdminCourses';
import AdminInstructors from './pages/admin/AdminInstructors'; 
import AdminContent from './pages/admin/AdminContent'; 
import AdminLabs from './pages/admin/AdminLabs';
import AdminMediaLibrary from './pages/admin/AdminMediaLibrary';
import AdminStudents from './pages/admin/AdminStudents'; 
import AdminSettings from './pages/admin/AdminSettings'; // New Import
import AdminInteractiveDesigner from './pages/admin/AdminInteractiveDesigner'; // New Import

// Student Imports
import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentPathView from './pages/student/StudentPathView';
import StudentCoursePlayer from './pages/student/StudentCoursePlayer';
import StudentMyPaths from './pages/student/StudentMyPaths'; 
import StudentMyCourses from './pages/student/StudentMyCourses'; 
import StudentCertificates from './pages/student/StudentCertificates'; 

import { LearningPathProvider } from './contexts/LearningPathContext';
import { InstructorProvider } from './contexts/InstructorContext';
import { CourseProvider } from './contexts/CourseContext'; 
import { StudentProvider } from './contexts/StudentContext'; 
import { AdminStudentProvider } from './contexts/AdminStudentContext'; 

// Public Layout to include Navbar and Footer
const PublicLayout = () => (
  <>
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </>
);

const App: React.FC = () => {
  return (
    <LearningPathProvider>
      <InstructorProvider>
        <CourseProvider>
          <StudentProvider>
            <AdminStudentProvider>
              <HashRouter>
                <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 flex flex-col">
                  <Routes>
                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/learning-paths" element={<LearningPaths />} />
                      <Route path="/courses/:courseId" element={<CourseLandingPage />} /> 
                    </Route>

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Student Routes */}
                    <Route path="/student" element={<StudentLayout />}>
                      <Route index element={<StudentDashboard />} />
                      <Route path="dashboard" element={<StudentDashboard />} />
                      <Route path="paths" element={<StudentMyPaths />} />
                      <Route path="paths/:id" element={<StudentPathView />} />
                      <Route path="courses" element={<StudentMyCourses />} />
                      <Route path="certificates" element={<StudentCertificates />} /> 
                    </Route>
                    {/* Dedicated Player Route (No Layout) */}
                    <Route path="/student/courses/:courseId" element={<StudentCoursePlayer />} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="paths" element={<AdminLearningPaths />} />
                      <Route path="courses" element={<AdminCourses />} />
                      <Route path="instructors" element={<AdminInstructors />} />
                      <Route path="content" element={<AdminContent />} />
                      <Route path="labs" element={<AdminLabs />} />
                      <Route path="media" element={<AdminMediaLibrary />} />
                      <Route path="students" element={<AdminStudents />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="interactive" element={<AdminInteractiveDesigner />} />
                    </Route>
                  </Routes>
                </div>
              </HashRouter>
            </AdminStudentProvider>
          </StudentProvider>
        </CourseProvider>
      </InstructorProvider>
    </LearningPathProvider>
  );
};

export default App;