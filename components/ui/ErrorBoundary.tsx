import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

// Fixed: Comprehensive Error Boundary for better frontend error handling
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Fixed: Enhanced error logging
    console.error('Error Boundary caught an error:', {
      errorId: this.state.errorId,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    // Fixed: Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Fixed: Auto-retry for connection errors
    if (this.isConnectionError(error)) {
      setTimeout(() => {
        this.handleRetry();
      }, 2000);
    }
  }

  private isConnectionError(error: Error): boolean {
    const connectionErrorPatterns = [
      'network',
      'connection',
      'database',
      'supabase',
      'fetch'
    ];
    
    return connectionErrorPatterns.some(pattern => 
      error.message.toLowerCase().includes(pattern)
    );
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Fixed: Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fixed: Default error UI with better UX
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
              We apologize for the inconvenience. An unexpected error occurred.
            </p>
            
            {/* Fixed: Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Error Details (Error ID: {this.state.errorId})
                </summary>
                <div className="mt-2 space-y-2">
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Error:</strong>
                    <pre className="mt-1 text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap">
                      {this.state.error.message}
                    </pre>
                  </div>
                  
                  {this.state.error.stack && (
                    <div>
                      <strong className="text-gray-700 dark:text-gray-300">Stack Trace:</strong>
                      <pre className="mt-1 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-x-auto">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={this.handleRetry}
                className="flex-1 flex items-center justify-center gap-2"
                variant="primary"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2"
                variant="secondary"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Fixed: Hook-based error boundary for functional components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default ErrorBoundary;
