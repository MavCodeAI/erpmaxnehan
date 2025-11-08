import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface SettingsCardProps {
  title: string;
  items: {
    name: string;
    path: string;
    icon: LucideIcon;
  }[];
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, items }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(({ name, path, icon: Icon }) => (
          <Link
            key={name}
            to={path}
            className="flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon className="w-5 h-5 mr-3 text-primary-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SettingsCard;
