
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants';
import { NavItem } from '../../types';
import { ChevronDown, Zap, X } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const toggleSubMenu = (label: string) => {
    setOpenSubMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  React.useEffect(() => {
    const currentPath = location.pathname;
    const parentNav = NAV_ITEMS.find(item => item.subItems?.some(sub => currentPath.startsWith(sub.path)));
    if (parentNav) {
      setOpenSubMenus(prev => ({ ...prev, [parentNav.label]: true }));
    }
  }, [location.pathname]);

  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
    const isSubMenuOpen = openSubMenus[item.label] ?? false;

    if (item.subItems) {
      return (
        <li key={item.label}>
          <button
            onClick={() => toggleSubMenu(item.label)}
            className={`w-full flex items-center justify-between p-2 my-1 text-sm font-medium rounded-lg transition-colors duration-150 hover:bg-blue-100 dark:hover:bg-gray-700 ${isSubMenuOpen ? 'text-blue-600 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}
          >
            <span className="flex items-center">
              <item.icon className="w-5 h-5" />
              <span className="ml-4">{item.label}</span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isSubMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {isSubMenuOpen && (
            <ul className="pl-6 mt-2 space-y-2 text-sm font-medium text-gray-500" aria-label="submenu">
              {item.subItems.map(renderNavItem)}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={item.path}>
        <NavLink
          to={item.path}
          className={`w-full flex items-center p-2 my-1 text-sm font-medium rounded-lg transition-colors duration-150 hover:bg-blue-100 dark:hover:bg-gray-700 ${isActive ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <item.icon className="w-5 h-5" />
          <span className="ml-4">{item.label}</span>
        </NavLink>
      </li>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex-shrink-0 overflow-y-auto bg-white dark:bg-gray-800 transition-all duration-300 md:relative md:z-20 ${
        open ? 'w-64' : 'w-0 md:w-64'
      }`}>
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-between px-6 mb-6">
            <a className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center" href="#">
              <Zap className="w-6 h-6 text-blue-500" />
              <span className="ml-2">ERPMAX</span>
            </a>
            <button
              className="p-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-blue"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <ul className="px-4">
            {NAV_ITEMS.map(renderNavItem)}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
