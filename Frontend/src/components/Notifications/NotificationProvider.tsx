'use client';

import { createContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence, motion } from 'framer-motion';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationContextType {
  notify: (notification: { title: string; message: string; type: Notification['type'] }) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback(
    ({ title, message, type }: { title: string; message: string; type: Notification['type'] }) => {
      const id = uuidv4();
      setNotifications((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 2500);
    },
    []
  );

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      case 'info':
        return 'bg-blue-600';
      case 'warning':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-800';
    }
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className={`text-white px-4 py-2 rounded-lg shadow-lg relative w-80 ${getColor(notification.type)}`}
            >
              <button
                onClick={() => removeNotification(notification.id)}
                className="absolute top-1 right-2 text-white text-sm"
              >
                &#x2715;
              </button>
              <div className="font-bold">{notification.title}</div>
              <div className="text-sm mt-1">{notification.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
