import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ElementType;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeClasses = {
    sm: children ? 'px-3 py-1.5 text-sm' : 'p-2',
    md: children ? 'px-4 py-2 text-base' : 'p-2.5',
    lg: children ? 'px-6 py-3 text-lg' : 'p-3',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${props.className || ''}`;

  return (
    <button {...props} disabled={loading || props.disabled} className={classes}>
      {loading ? (
        <Loader2 className={`${iconSizeClasses[size]} ${children ? 'mr-2' : ''} animate-spin`} />
      ) : (
        Icon && <Icon className={`${iconSizeClasses[size]} ${children ? 'mr-2' : ''}`} />
      )}
      {children}
    </button>
  );
};

export default Button;