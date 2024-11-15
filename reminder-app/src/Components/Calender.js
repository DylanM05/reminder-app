import React, { useState, useEffect, useContext } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { UserContext } from './UserContext';
import Cookies from 'js-cookie';
import { Modal, Button } from 'react-bootstrap';
import ReminderForm from './ReminderForm';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const { user, setUser } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [sharedByUsername, setSharedByUsername] = useState('');

  const getUserIdFromCookie = () => {
    const cookieValue = Cookies.get('userId');
    if (cookieValue) {
      try {
        const decodedValue = decodeURIComponent(cookieValue);
        const userId = decodedValue.replace(/^j:/, '').replace(/"/g, ''); // Remove the "j:" prefix and quotes if present
        return userId;
      } catch (error) {
        console.error('Error parsing user ID cookie:', error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const userId = getUserIdFromCookie();
    if (userId) {
      setUser({ userId });
      console.log('User ID set from cookie:', userId);
    }
  }, []); 

  const fetchReminders = async () => {
    if (user?.userId) {
      try {
        // Fetch the user's reminders
        const remindersResponse = await axios.get(`http://localhost:5000/r/reminders/${user.userId}`, { withCredentials: true });
        console.log("Fetched reminders:", remindersResponse.data);
        // Fetch the shared reminders
        const sharedRemindersResponse = await axios.get(`http://localhost:5000/r/reminders/shared/${user.userId}`, { withCredentials: true });
        // Combine the reminders and shared reminders
        const reminders = remindersResponse.data.map(reminder => ({
          id: reminder._id,
          title: reminder.title,
          start: new Date(reminder.startDate),
          end: reminder.endDate ? new Date(reminder.endDate) : new Date(reminder.startDate),
          allDay: reminder.type === 'day' || reminder.type === 'month',
          location: reminder.location || { address: '' }, // Ensure location is defined
          notification: reminder.notification || { type: 'none', timeBefore: '' }, // Ensure notification is defined
          tags: reminder.tags || [], // Ensure tags is defined
          sharedWith: reminder.sharedWith || [], // Ensure sharedWith is defined
          creator: user.userId // Add creator information
        }));

        const sharedReminders = await Promise.all(sharedRemindersResponse.data.map(async reminder => {
          const username = await fetchUsername(reminder.userId);
          return {
            id: reminder._id,
            title: reminder.title,
            start: new Date(reminder.startDate),
            end: reminder.endDate ? new Date(reminder.endDate) : new Date(reminder.startDate),
            allDay: reminder.type === 'day' || reminder.type === 'month',
            location: reminder.location || { address: '' }, // Ensure location is defined
            notification: reminder.notification || { type: 'none', timeBefore: '' }, // Ensure notification is defined
            tags: reminder.tags || [], // Ensure tags is defined
            sharedWith: reminder.sharedWith || [], // Ensure sharedWith is defined
            creator: reminder.userId, // Add creator information
            sharedByUsername: username // Add shared by username
          };
        }));

        setEvents([...reminders, ...sharedReminders]);
        setLoading(false); // Set loading to false after fetching reminders
      } catch (error) {
        console.error("Error fetching reminders:", error);
        setLoading(false); // Set loading to false even if there is an error
      }
    }
  };

  const fetchUsername = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/u/user/${userId}`);
      return response.data.username;
    } catch (error) {
      console.error("Error fetching username:", error);
      return '';
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [user]);

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setSharedByUsername('');
  };

  const handleShow = (reminder) => {
    setSelectedReminder(reminder);
    if (reminder.creator !== user.userId) {
      setSharedByUsername(reminder.sharedByUsername);
    }
    setShow(true);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZoneName: 'short'
    });
  };

  if (loading) return <div>Loading reminders...</div>;

  return (
    <div>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleShow}
      />

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Reminder' : 'Reminder Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editMode ? (
            <ReminderForm
              reminder={selectedReminder}
              fetchReminders={fetchReminders}
              handleClose={handleClose}
            />
          ) : (
            selectedReminder && (
              <div>
                <p><strong>Title:</strong> {selectedReminder.title}</p>
                <p><strong>Description:</strong> {selectedReminder.description}</p>
                <p><strong>Start Date:</strong> {formatDateTime(selectedReminder.start)}</p>
                <p><strong>End Date:</strong> {formatDateTime(selectedReminder.end)}</p>
                <p><strong>Location:</strong> {selectedReminder.location?.address}</p>
                <p><strong>Repeat Interval:</strong> {selectedReminder.repeatInterval}</p>
                <p><strong>Notification Type:</strong> {selectedReminder.notification?.type}</p>
                <p><strong>Notification Time Before:</strong> {selectedReminder.notification?.timeBefore}</p>
                <p><strong>Tags:</strong> {selectedReminder.tags?.join(', ')}</p>
                {selectedReminder.creator === user.userId ? (
                  <p><strong>Shared With:</strong> {selectedReminder.sharedWith?.join(', ')}</p>
                ) : (
                  <p><strong>Shared By:</strong> {sharedByUsername}</p>
                )}
                {selectedReminder.creator === user.userId && (
                  <Button variant="primary" onClick={handleEdit}>Edit</Button>
                )}
              </div>
            )
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Calendar;