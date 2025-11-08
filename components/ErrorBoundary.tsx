import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './ui/Button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4 mb-6">
                <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Oops! Something went wrong
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We're sorry for the inconvenience. The application encountered an unexpected error.
              </p>

              {this.state.error && (
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Error Details:
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400 font-mono break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={this.handleReset} icon={RefreshCw}>
                  Try Again
                </Button>
                <Button onClick={this.handleGoHome} variant="secondary" icon={Home}>
                  Go to Home
                </Button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-500 mt-6">
                If this problem persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
