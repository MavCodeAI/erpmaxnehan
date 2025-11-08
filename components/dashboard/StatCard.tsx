
import React from 'react';
import Card from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <Card className="flex items-center">
      <div className={`p-3 mr-4 text-white bg-${color}-500 rounded-full`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{value}</p>
      </div>
    </Card>
  );
};

export default StatCard;
