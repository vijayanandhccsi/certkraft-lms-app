import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Layers, Award, Bell, 
  Menu, X, Settings, LogOut, Search, ChevronDown
} from 'lucide-react';
import Logo from '../../components/Logo';
import { useStudent } from '../../contexts/StudentContext';

const StudentLayout: React.FC = () => {
  const { student, logout } = useStudent();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
    { icon: BookOpen, label: 'My Learning Paths', path: '/student/paths' }, 
    { icon: Layers, label: 'My Courses', path: '/student/courses' }, 
    { icon: Award, label: 'Certificates', path: '/student/certificates' },
  ];

  const getLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "text-indigo-600 border-b-2 border-indigo-600 font-semibold flex items-center gap-2 px-1 py-4 text-sm"
      : "text-slate-500 hover:text-slate-800 border-b-2 border-transparent font-medium flex items-center gap-2 px-1 py-4 text-sm transition-colors";
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Left: Logo & Desktop Nav */}
            <div className="flex">
              {/* Public Home Page Link */}
              <Link to="/" className="flex-shrink-0 flex items-center">
                <Logo />
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {navItems.map((item) => (
                  <NavLink key={item.path} to={item.path} className={getLinkClass}>
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right: Search, Notifs, Profile */}
            <div className="hidden md:flex items-center gap-4">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search..." 
                   className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 w-48 transition-all focus:w-64"
                 />
               </div>
               
               <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                 <Bell className="h-5 w-5" />
                 <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
               </button>

               <div className="h-8 w-px bg-slate-200 mx-2"></div>

               {/* Profile Dropdown */}
               <div className="relative">
                 <button 
                   onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                   className="flex items-center gap-3 cursor-pointer group focus:outline-none"
                 >
                    <div className="text-right hidden lg:block">
                      <div className="text-sm font-bold text-slate-800">{student.name}</div>
                      <div className="text-xs text-slate-500">{student.role}</div>
                    </div>
                    <div className="h-9 w-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 group-hover:ring-2 group-hover:ring-indigo-500/20 transition-all">
                      {student.name.charAt(0)}
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                 </button>

                 {/* Dropdown Menu */}
                 {isProfileMenuOpen && (
                   <>
                     <div 
                       className="fixed inset-0 z-10 cursor-default" 
                       onClick={() => setIsProfileMenuOpen(false)}
                     ></div>
                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 animate-fade-in origin-top-right">
                        <div className="px-4 py-3 border-b border-slate-100 lg:hidden">
                          <p className="text-sm font-bold text-slate-800">{student.name}</p>
                          <p className="text-xs text-slate-500 truncate">{student.email}</p>
                        </div>
                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                           <Settings className="h-4 w-4" /> Account Settings
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                           <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                     </div>
                   </>
                 )}
               </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100">
            <div className="pt-2 pb-3 space-y-1 px-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium
                    ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="pt-4 pb-4 border-t border-slate-100 px-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <div className="text-base font-bold text-slate-800">{student.name}</div>
                  <div className="text-sm text-slate-500">{student.email}</div>
                </div>
              </div>
              <div className="space-y-2">
                <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 w-full py-2">
                  <Settings className="h-5 w-5" /> Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full py-2"
                >
                  <LogOut className="h-5 w-5" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;