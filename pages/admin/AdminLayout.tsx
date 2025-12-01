import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Layers, Settings, LogOut, 
  Bell, Search, Terminal, FileVideo, Users, ChevronRight, BookOpen, GraduationCap,
  Brain, ChevronDown, PieChart, Shield, PanelLeftClose, PanelLeftOpen, MousePointer2, Image
} from 'lucide-react';
import Logo from '../../components/Logo';

// --- Navigation Config ---
type NavItem = {
  label: string;
  path?: string;
  icon: React.ElementType;
  children?: { label: string; path: string; icon?: React.ElementType }[];
};

const NAVIGATION: NavItem[] = [
  { 
    label: 'Dashboard', 
    path: '/admin/dashboard', 
    icon: LayoutDashboard 
  },
  {
    label: 'Academy',
    icon: BookOpen,
    children: [
      { label: 'Learning Paths', path: '/admin/paths', icon: Map },
      { label: 'Courses', path: '/admin/courses', icon: Layers },
      { label: 'Instructors', path: '/admin/instructors', icon: GraduationCap },
    ]
  },
  {
    label: 'Content Studio',
    icon: Layers,
    children: [
      { label: 'Content Tools', path: '/admin/content', icon: FileVideo },
      { label: 'Interactive Designer', path: '/admin/interactive', icon: MousePointer2 },
      { label: 'Media Library', path: '/admin/media', icon: Image },
    ]
  },
  {
    label: 'Operations',
    icon: Shield,
    children: [
      { label: 'Labs & Sessions', path: '/admin/labs', icon: Terminal },
      { label: 'Students', path: '/admin/students', icon: Users },
    ]
  },
  { 
    label: 'Settings', 
    path: '/admin/settings', 
    icon: Settings 
  },
];

const SidebarGroup: React.FC<{ item: NavItem; isCollapsed: boolean }> = ({ item, isCollapsed }) => {
  const location = useLocation();
  // Auto-expand if a child is active
  const isActiveGroup = item.children?.some(child => location.pathname.startsWith(child.path));
  const [isOpen, setIsOpen] = useState(isActiveGroup);

  useEffect(() => {
    if (isActiveGroup) setIsOpen(true);
  }, [isActiveGroup]);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
          ${isActiveGroup ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}
          ${isCollapsed ? 'justify-center' : 'justify-between'}
        `}
        title={isCollapsed ? item.label : ''}
      >
        <div className="flex items-center gap-3">
          <item.icon className={`h-5 w-5 ${isActiveGroup ? 'text-indigo-400' : 'text-slate-500'}`} />
          {!isCollapsed && <span>{item.label}</span>}
        </div>
        {!isCollapsed && <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
      </button>

      {/* Submenu */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
        <div className={`${isCollapsed ? '' : 'bg-slate-800/50 rounded-lg py-1 ml-3 border-l-2 border-slate-700'}`}>
          {item.children?.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) => `
                flex items-center gap-2 py-2 text-sm transition-colors relative group
                ${isCollapsed ? 'justify-center px-0' : 'pl-4'}
                ${isActive ? 'text-white font-medium' : 'text-slate-400 hover:text-slate-200'}
              `}
              title={isCollapsed ? child.label : ''}
            >
              {({ isActive }) => (
                <>
                  {!isCollapsed && isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-indigo-50 -ml-[3px]"></div>}
                  {child.icon && <child.icon className={`h-4 w-4 ${isCollapsed && isActive ? 'text-indigo-400' : ''}`} />}
                  {!isCollapsed && <span>{child.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{ item: NavItem; isCollapsed: boolean }> = ({ item, isCollapsed }) => {
  if (!item.path) return null;
  
  return (
    <NavLink
      to={item.path}
      end={item.path === '/admin/dashboard'}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2.5 mb-2 rounded-lg transition-all duration-200 group
        ${isCollapsed ? 'justify-center' : ''}
        ${isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
      `}
      title={isCollapsed ? item.label : ''}
    >
      <item.icon className="h-5 w-5" />
      {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
    </NavLink>
  );
};

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
  
  const getBreadcrumb = () => {
    const pathParts = location.pathname.split('/').filter(p => p);
    if (pathParts.length < 2) return 'Dashboard';
    const main = pathParts[1];
    return main.charAt(0).toUpperCase() + main.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#0f172a] text-white flex flex-col fixed h-full z-20 transition-all duration-300 border-r border-slate-800 ease-in-out`}>
        <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'} border-b border-slate-800 bg-[#0f172a]`}>
           <Logo variant="light" collapsed={isCollapsed} />
           {!isCollapsed && (
             <button onClick={() => setIsCollapsed(true)} className="text-slate-500 hover:text-white transition-colors p-1">
                <PanelLeftClose className="h-5 w-5" />
             </button>
           )}
        </div>
        
        {/* Toggle Button for collapsed state (Visible only when collapsed) */}
        {isCollapsed && (
           <div className="flex justify-center py-2 border-b border-slate-800 bg-slate-900/50">
              <button onClick={() => setIsCollapsed(false)} className="text-slate-500 hover:text-white transition-colors p-1">
                 <PanelLeftOpen className="h-5 w-5" />
              </button>
           </div>
        )}

        <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
          {!isCollapsed && <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Main Menu</div>}
          
          {NAVIGATION.map((item, index) => (
            item.children ? (
              <SidebarGroup key={index} item={item} isCollapsed={isCollapsed} />
            ) : (
              <SidebarItem key={index} item={item} isCollapsed={isCollapsed} />
            )
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors px-3 py-2 w-full rounded-lg hover:bg-slate-800/50 ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? "Sign Out" : ""}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'} flex flex-col min-h-screen transition-all duration-300 ease-in-out`}>
        
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
          background: #0f172a;
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