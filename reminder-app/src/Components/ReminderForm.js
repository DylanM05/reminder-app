import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ReminderForm = ({ reminder, fetchReminders, handleClose, user }) => { 
  const [title, setTitle] = useState(reminder ? reminder.title : '');
  const [description, setDescription] = useState(reminder ? reminder.description : '');
  const [startDate, setStartDate] = useState(reminder ? new Date(reminder.start) : new Date());
  const [endDate, setEndDate] = useState(reminder ? new Date(reminder.end) : new Date());
  const [location, setLocation] = useState(reminder ? reminder.location : { address: '' });
  const [repeatInterval, setRepeatInterval] = useState(reminder ? reminder.repeatInterval : '');
  const [notificationType, setNotificationType] = useState(reminder ? reminder.notification.type : 'none');
  const [notificationTimeBefore, setNotificationTimeBefore] = useState(reminder ? reminder.notification.timeBefore : '');
  const [tags, setTags] = useState(reminder ? reminder.tags : []);
  const [sharedWith, setSharedWith] = useState(reminder ? reminder.sharedWith : []);
  const [users, setUsers] = useState([]);
  const [startHour, setStartHour] = useState(12); // Hour in 12-hour format
  const [startMinute, setStartMinute] = useState(0); // Minutes
  const [startAmPm, setStartAmPm] = useState('AM'); // AM/PM
  const [endHour, setEndHour] = useState(12);
  const [endMinute, setEndMinute] = useState(0);
  const [endAmPm, setEndAmPm] = useState('AM');

  useEffect(() => {
    // Fetch all registered users
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:5000/u/users');
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = user?.userId || Cookies.get('userId').replace(/^j:/, '').replace(/"/g, ''); 
    const reminderData = { 
      userId, 
      title, 
      description, 
      startDate, 
      endDate, 
      location, 
      repeatInterval, 
      notification: { 
        type: notificationType === 'none' ? null : notificationType, 
        timeBefore: notificationTimeBefore 
      },
      tags,
      sharedWith
    };
    
    try {
      if (reminder) {
        await axios.put(`http://localhost:5000/r/reminders/${reminder.id}`, reminderData);
      } else {
        await axios.post('http://localhost:5000/r/reminders', reminderData);
      }
      fetchReminders();  // Fetch reminders again
      handleClose();  // Close the modal
    } catch (error) {
      console.error("Error creating/updating reminder:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container py-4">
      {/* Title */}
      <div className="row mb-3">
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      {/* Description */}
      <div className="row mb-3">
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>
        {/* Start Date and Time */}
        <div className="row mb-3">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <div className="d-flex">
              <select
                className="form-control"
                value={startHour}
                onChange={(e) => setStartHour(parseInt(e.target.value))}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                className="form-control"
                value={startMinute}
                onChange={(e) => setStartMinute(parseInt(e.target.value))}
              >
                {[...Array(60)].map((_, i) => (
                  <option key={i} value={i}>
                    {i < 10 ? `0${i}` : i}
                  </option>
                ))}
              </select>
              <select
                className="form-control"
                value={startAmPm}
                onChange={(e) => setStartAmPm(e.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* End Date and Time */}
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <div className="d-flex">
              <select
                className="form-control"
                value={endHour}
                onChange={(e) => setEndHour(parseInt(e.target.value))}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                className="form-control"
                value={endMinute}
                onChange={(e) => setEndMinute(parseInt(e.target.value))}
              >
                {[...Array(60)].map((_, i) => (
                  <option key={i} value={i}>
                    {i < 10 ? `0${i}` : i}
                  </option>
                ))}
              </select>
              <select
                className="form-control"
                value={endAmPm}
                onChange={(e) => setEndAmPm(e.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Location */}
      <div className="row mb-3">
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              className="form-control"
              id="location"
              value={location.address}
              onChange={(e) => setLocation({ address: e.target.value })}
            />
          </div>
        </div>
      </div>
      {/* Repeat Interval */}
      <div className="row mb-3">
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="repeatInterval">Repeat Interval</label>
            <input
              type="text"
              className="form-control"
              id="repeatInterval"
              value={repeatInterval}
              onChange={(e) => setRepeatInterval(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Notification Type */}
      <div className="row mb-3">
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="notificationType">Notification Type</label>
            <select
              className="form-control"
              id="notificationType"
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
            >
              <option value="none">None</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push</option>
            </select>
          </div>
        </div>
      </div>

        {/* Notification Time Before */}
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="notificationTimeBefore">Notification Time Before</label>
            <select 
              id="notificationTimeBefore" 
              className="form-control" 
              value={notificationTimeBefore} 
              onChange={(e) => setNotificationTimeBefore(e.target.value)} 
            >
              <option value="default">Default: 2 hours before</option>
              <option value="none">None</option>
              <option value="5">5 minutes before</option>
              <option value="10">10 minutes before</option>
              <option value="15">15 minutes before</option>
              <option value="30">30 minutes before</option>
              <option value="60">1 hour before</option>
              <option value="120">2 hours before</option>
              <option value="1440">1 day before</option>
              <option value="2880">2 days before</option>
              <option value="10080">1 week before</option>
            </select>
          </div>
        </div>
      {/* Tags */}
      <div className="row mb-3">
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              className="form-control"
              id="tags"
              value={tags.join(', ')}
              onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
            />
          </div>
        </div>
      </div>
      {/* Shared With */}
      <div className="row mb-3">
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="sharedWith">Shared With</label>
            <select
              className="form-control"
              id="sharedWith"
              value={sharedWith}
              onChange={(e) => setSharedWith([e.target.value])}
            >
              <option value="">Select a user</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.username}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">{reminder ? 'Update Reminder' : 'Create Reminder'}</button>
    </form>
  );
};

export default ReminderForm;