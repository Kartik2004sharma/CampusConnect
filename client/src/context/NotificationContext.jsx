"use client";

import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let newSocket = null;
    
    if (user) {
      const token = localStorage.getItem('token');
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';
      newSocket = io(socketUrl, {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
      });

      const handleNotification = (data) => {
        setNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        if (data.type === 'alert') {
          toast.error(data.message, { duration: 6000, style: { minWidth: '300px' } });
        } else {
          toast.success(data.message);
        }
      };

      newSocket.on('grievance:update', handleNotification);
      newSocket.on('session:request', handleNotification);
      newSocket.on('session:approved', handleNotification);
      newSocket.on('notice:new', handleNotification);
      newSocket.on('event:new', handleNotification);
      newSocket.on('alert:emergency', (data) => handleNotification({ ...data, type: 'alert' }));
      newSocket.on('recommendation:ready', handleNotification);

      setSocket(newSocket);
    }
    
    return () => {
      if (newSocket) newSocket.disconnect();
      setSocket(null);
    };
  }, [user]);

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ socket, notifications, unreadCount, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
