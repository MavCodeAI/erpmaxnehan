import React from 'react';

interface SkeletonLoaderProps {
  type?: 'text' | 'title' | 'card' | 'table' | 'avatar' | 'button';
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'text', 
  count = 1,
  className = '' 
}) => {
  const baseClass = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

  const skeletonTypes = {
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    card: 'h-32 w-full',
    table: 'h-12 w-full',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${baseClass} ${skeletonTypes[type]} ${className} ${
            index > 0 ? 'mt-2' : ''
          }`}
        />
      ))}
    </>
  );
};

// Predefined skeleton layouts
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    <SkeletonLoader type="table" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        <SkeletonLoader type="text" className="w-1/4" />
        <SkeletonLoader type="text" className="w-1/4" />
        <SkeletonLoader type="text" className="w-1/4" />
        <SkeletonLoader type="text" className="w-1/4" />
      </div>
    ))}
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <SkeletonLoader type="title" />
    <SkeletonLoader type="text" count={3} className="mt-4" />
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    <SkeletonLoader type="title" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SkeletonLoader type="card" className="h-64" />
      <SkeletonLoader type="card" className="h-64" />
    </div>
  </div>
);

export default SkeletonLoader;
