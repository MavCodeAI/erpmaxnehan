import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, AlertCircle, Package, DollarSign, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'overdue' | 'low_stock' | 'payment' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

const NotificationsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'overdue',
      title: 'Overdue Invoice',
      message: 'Invoice INV-001 is 5 days overdue (PKR 15,000)',
      time: '2 hours ago',
      read: false,
      link: '/sales/invoices/1',
    },
    {
      id: '2',
      type: 'low_stock',
      title: 'Low Stock Alert',
      message: 'Office Chair stock is below reorder point (5 units remaining)',
      time: '5 hours ago',
      read: false,
      link: '/inventory/items/1',
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of PKR 10,000 received from John Doe',
      time: '1 day ago',
      read: true,
      link: '/payments',
    },
    {
      id: '4',
      type: 'info',
      title: 'System Update',
      message: 'ERPMAX has been updated to version 1.0.1',
      time: '2 days ago',
      read: true,
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'low_stock':
        return <Package className="w-5 h-5 text-orange-500" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
        aria-label="Notifications"
        aria-haspopup="true"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white transform translate-x-1 -translate-y-1 bg-red-600 rounded-full dark:border-gray-800">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <ul>
                {notifications.map(notification => (
                  <li
                    key={notification.id}
                    className={`border-b dark:border-gray-700 last:border-b-0 ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        <button
                          onClick={(e) => deleteNotification(notification.id, e)}
                          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No notifications</p>
                <p className="text-xs mt-1">You're all caught up!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button className="w-full text-xs text-center text-blue-600 dark:text-blue-400 hover:underline">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
