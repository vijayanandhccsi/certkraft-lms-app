import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Layers, Settings, LogOut, 
  Bell, Search, Terminal, FileVideo, Users, ChevronRight, BookOpen, GraduationCap,
  Brain
} from 'lucide-react';
import Logo from '../../components/Logo';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Map, label: 'Learning Paths', path: '/admin/paths' },
    { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
    { icon: GraduationCap, label: 'Instructors', path: '/admin/instructors' },
    { icon: Layers, label: 'Course Content', path: '/admin/content' },
    { icon: Brain, label: 'Interactive Designer', path: '/admin/interactive' },
    { icon: Terminal, label: 'Labs & Sessions', path: '/admin/labs' },
    { icon: FileVideo, label: 'Media Library', path: '/admin/media' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];
  
  const getBreadcrumb = () => {
    const pathParts = location.pathname.split('/').filter(p => p);
    if (pathParts.length < 2) return 'Dashboard';
    const main = pathParts[1];
    return main.charAt(0).toUpperCase() + main.slice(1).replace(/-/g, ' ');
  };


  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] text-white flex flex-col fixed h-full z-20 transition-all duration-300">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
           <Logo variant="light" />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Main Menu</div>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin/dashboard'}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon className={`h-5 w-5 ${location.pathname.startsWith(item.path) ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors px-3 py-2 w-full rounded-lg hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen transition-all duration-300">
        
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between">
           <div className="flex items-center gap-2 text-slate-500 text-sm">
             <span>Admin</span>
             <ChevronRight className="h-4 w-4" />
             <span className="font-semibold text-slate-800">{getBreadcrumb()}</span>
           </div>

           <div className="flex items-center gap-6">
             <div className="relative hidden md:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Global Search..." 
                 className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 w-64 bg-slate-50 focus:bg-white transition-colors"
               />
             </div>
             
             <div className="relative cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-colors">
               <Bell className="h-5 w-5 text-slate-500 hover:text-slate-700" />
               <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
             </div>

             <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
               <div className="text-right hidden md:block">
                 <div className="text-sm font-bold text-slate-900">Admin User</div>
                 <div className="text-xs text-slate-500">Super Admin</div>
               </div>
               <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 shadow-sm">
                 AD
               </div>
             </div>
           </div>
        </header>

        {/* Page Content */}
        <main className="p-8 flex-grow overflow-y-auto">
          <Outlet />
        </main>

      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111827;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;