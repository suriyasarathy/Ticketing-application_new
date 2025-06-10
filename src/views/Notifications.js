import React, { useEffect, useState } from 'react';
import { ListGroup, Badge, Spinner, Button } from 'react-bootstrap';
import moment from 'moment';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000'); // Your backend URL

const NotificationPage = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Join user-specific room
  useEffect(() => { 
    if (userId) {
      socket.emit('join', userId);
    }
  }, [userId]);

  // Load old notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/api/notifications/${userId}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [userId]);

  // Listen for real-time notifications
  useEffect(() => {
    socket.on('notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  const markAllAsRead = async () => {
    try {
      await axios.put(`/api/notifications/mark-read/${userId}`);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: 1 }))
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">🔔 Notifications</h3>

      <div className="d-flex justify-content-between mb-2">
        <div>
          <Badge bg="primary">
            Unread: {notifications.filter((n) => !n.is_read).length}
          </Badge>
        </div>
        <Button variant="outline-secondary" size="sm" onClick={markAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ListGroup>
          {notifications.map((n) => (
            <ListGroup.Item
              key={n.id}
              className={n.is_read ? '' : 'bg-light fw-bold'}
            >
              <div>{n.content}</div>
              <small className="text-muted">
                {moment(n.created_at).fromNow()}
              </small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default NotificationPage;
