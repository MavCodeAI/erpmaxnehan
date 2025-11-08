import React, { useState, useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface DropdownItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
}

interface DropdownProps {
  button: React.ReactElement;
  items: DropdownItem[];
}

const Dropdown: React.FC<DropdownProps> = ({ button, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {React.cloneElement(button, { onClick: toggleDropdown })}

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {items.map(({ label, icon: Icon, onClick }) => (
              <button
                key={label}
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                  setIsOpen(false);
                }}
                className="w-full text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center px-4 py-2 text-sm"
                role="menuitem"
              >
                {Icon && <Icon className="mr-3 h-4 w-4" />}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
