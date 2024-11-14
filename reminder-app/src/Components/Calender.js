import React, { useState, useEffect, useContext } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { UserContext } from './UserContext';
import Cookies from 'js-cookie';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const { user, setUser } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
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
          }));
  
       
          const sharedReminders = sharedRemindersResponse.data.map(reminder => ({
            id: reminder._id,
            title: reminder.title,
            start: new Date(reminder.startDate),
            end: reminder.endDate ? new Date(reminder.endDate) : new Date(reminder.startDate),
            allDay: reminder.type === 'day' || reminder.type === 'month',
          }));
       
  
          setEvents([...reminders , ...sharedReminders]);
          setLoading(false); // Set loading to false after fetching reminders
        } catch (error) {
          console.error("Error fetching reminders:", error);
          setLoading(false); // Set loading to false even if there is an error
        }
      }
    };

    fetchReminders();
  }, [user]);

  if (loading) return <div>Loading reminders...</div>;

  return (
    <div>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default Calendar;