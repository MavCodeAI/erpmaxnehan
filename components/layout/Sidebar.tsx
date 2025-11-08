
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants';
import { NavItem } from '../../types';
import { ChevronDown, Zap } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
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
            className={`w-full flex items-center justify-between p-2 my-1 text-sm font-medium rounded-lg transition-colors duration-150 hover:bg-primary-100 dark:hover:bg-gray-700 ${isSubMenuOpen ? 'text-primary-600 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}
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
          className={`w-full flex items-center p-2 my-1 text-sm font-medium rounded-lg transition-colors duration-150 hover:bg-primary-100 dark:hover:bg-gray-700 ${isActive ? 'bg-primary-100 dark:bg-gray-700 text-primary-600 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <item.icon className="w-5 h-5" />
          <span className="ml-4">{item.label}</span>
        </NavLink>
      </li>
    );
  };

  return (
    <aside className={`z-20 flex-shrink-0 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block transition-all duration-300 ${open ? 'w-64' : 'w-0'}`}>
      <div className="py-4 text-gray-500 dark:text-gray-400">
        <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center" href="#">
          <Zap className="w-6 h-6 text-primary-500" />
          <span className="ml-2">ERPMAX</span>
        </a>
        <ul className="mt-6 px-4">
          {NAV_ITEMS.map(renderNavItem)}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
