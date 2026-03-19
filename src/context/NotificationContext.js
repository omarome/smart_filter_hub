import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification as deleteNotificationApi,
  deleteAllNotifications as deleteAllNotificationsApi,
} from '../services/userApi';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Load from backend on mount ───────────────────────────────────────────
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await fetchNotifications();
        // Normalize backend field names (isRead / timestamp)
        setNotifications(data);
      } catch (err) {
        console.error('Failed to load notifications:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // ── Optimistic helpers ───────────────────────────────────────────────────
  const markAsRead = useCallback(async (id) => {
    // Optimistic update first for instant UI response
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    try {
      await markNotificationRead(id);
    } catch (err) {
      // Rollback on failure
      console.error('Failed to mark notification as read:', err);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: false } : n));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const previous = notifications;
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsRead();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      setNotifications(previous); // rollback
    }
  }, [notifications]);

  const removeNotification = useCallback(async (id) => {
    const previous = notifications;
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await deleteNotificationApi(id);
    } catch (err) {
      console.error('Failed to delete notification:', err);
      setNotifications(previous); // rollback
    }
  }, [notifications]);

  const clearAll = useCallback(async () => {
    const previous = notifications;
    setNotifications([]);
    try {
      await deleteAllNotificationsApi();
    } catch (err) {
      console.error('Failed to clear all notifications:', err);
      setNotifications(previous); // rollback
    }
  }, [notifications]);

  // Keep addNotification for future use (e.g. SSE/WebSocket push)
  const addNotification = useCallback((notification) => {
    const newNotif = {
      id: Math.random().toString(36).substr(2, 9),
      isRead: false,
      timestamp: new Date().toISOString(),
      ...notification
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    clearAll,
    addNotification,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
