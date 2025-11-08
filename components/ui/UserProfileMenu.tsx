import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, HelpCircle, LogOut, Building, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toast';

const UserProfileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: 'Admin User',
    email: 'admin@erpmax.com',
    role: 'Administrator',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff',
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    showToast.success('Logged out successfully');
    setIsOpen(false);
    // Add actual logout logic here
  };

  const menuItems = [
    {
      icon: User,
      label: 'My Profile',
      onClick: () => {
        navigate('/settings/organization/profile');
        setIsOpen(false);
      },
    },
    {
      icon: Building,
      label: 'Organization',
      onClick: () => {
        navigate('/settings/organization/profile');
        setIsOpen(false);
      },
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => {
        navigate('/settings');
        setIsOpen(false);
      },
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onClick: () => {
        showToast.info('Help documentation coming soon!');
        setIsOpen(false);
      },
    },
  ];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center align-middle rounded-full focus:shadow-outline-blue focus:outline-none"
        aria-label="Account"
        aria-haspopup="true"
      >
        <img
          className="object-cover w-8 h-8 rounded-full"
          src={user.avatar}
          alt={user.name}
        />
        <ChevronDown className="ml-1 w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 overflow-hidden">
          {/* User Info */}
          <div className="px-4 py-3 border-b dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {user.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {user.role}
            </p>
          </div>

          {/* Menu Items */}
          <ul className="py-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={item.onClick}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Logout */}
          <div className="border-t dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
