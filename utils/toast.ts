import toast from 'react-hot-toast';

// Fixed: Enhanced toast utility for better UX
export const showToast = {
  success: (message: string, options?: any) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options
    });
  },
  
  error: (message: string, options?: any) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options
    });
  },
  
  loading: (message: string, options?: any) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options
    });
  },
  
  info: (message: string, options?: any) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options
    });
  },
  
  warning: (message: string, options?: any) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options
    });
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages, {
      position: 'top-right',
      style: {
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  },
  
  dismiss: (toastId?: string) => {
    return toast.dismiss(toastId);
  }
};

// Fixed: Custom toast for specific ERP operations
export const showERPTask = {
  creating: (entity: string) => {
    return showToast.loading(`Creating ${entity}...`);
  },

  updating: (entity: string) => {
    return showToast.loading(`Updating ${entity}...`);
  },

  deleting: (entity: string) => {
    return showToast.loading(`Deleting ${entity}...`);
  },

  saved: (entity: string) => {
    return showToast.success(`${entity} saved successfully!`);
  },

  deleted: (entity: string) => {
    return showToast.success(`${entity} deleted successfully!`);
  },

  error: (operation: string, entity: string) => {
    return showToast.error(`Failed to ${operation} ${entity}`);
  }
};
