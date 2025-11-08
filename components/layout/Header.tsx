
import React from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import SearchBar from '../ui/SearchBar';
import NotificationsDropdown from '../ui/NotificationsDropdown';
import UserProfileMenu from '../ui/UserProfileMenu';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="relative z-10 py-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-blue-600 dark:text-blue-300">
        {/* Mobile hamburger */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-blue"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Menu"
        >
          {sidebarOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6" />}
        </button>
        {/* Search input */}
        <div className="flex justify-center flex-1 lg:mr-32">
          <div className="w-full mr-6">
            <SearchBar />
          </div>
        </div>
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* Theme toggler */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-blue"
              onClick={toggleTheme}
              aria-label="Toggle color mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </li>
          {/* Notifications menu */}
          <li className="relative">
            <NotificationsDropdown />
          </li>
          {/* Profile menu */}
          <li className="relative">
            <UserProfileMenu />
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
