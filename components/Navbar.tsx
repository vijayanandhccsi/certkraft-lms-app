import React, { useState } from 'react';
import { Menu, X, User, Bell } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const getLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
  };

  const getMobileLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium";
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center cursor-pointer">
              <Logo />
            </NavLink>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <NavLink to="/" className={getLinkClass}>
                Home
              </NavLink>
              <NavLink to="/learning-paths" className={getLinkClass}>
                Learning Paths
              </NavLink>
              <a href="/#labs" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Labs
              </a>
              <a href="/#ai-advisor" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                AI Advisor
              </a>
              <a href="/#assessments" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Assessments
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium text-sm px-3 py-2 rounded-md hover:bg-gray-50">
              Log in
            </Link>
            <Link to="/signup" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
              Sign up
            </Link>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink to="/" className={getMobileLinkClass} onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/learning-paths" className={getMobileLinkClass} onClick={() => setIsOpen(false)}>
              Learning Paths
            </NavLink>
            <a href="/#labs" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Labs
            </a>
            <a href="/#ai-advisor" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              AI Advisor
            </a>
            <a href="/#assessments" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Assessments
            </a>
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200">
            <div className="px-4 space-y-3">
              <Link to="/login" className="block w-full text-center px-4 py-2 text-base font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50" onClick={() => setIsOpen(false)}>
                Log in
              </Link>
              <Link to="/signup" className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700" onClick={() => setIsOpen(false)}>
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;