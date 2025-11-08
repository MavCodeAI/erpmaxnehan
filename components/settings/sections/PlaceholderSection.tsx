import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PlaceholderSectionProps {
  title: string;
  description?: string;
}

const PlaceholderSection: React.FC<PlaceholderSectionProps> = ({ title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4">
          <AlertCircle className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            {description}
          </p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
          This feature is coming soon. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
};

export default PlaceholderSection;
