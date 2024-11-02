import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ReminderForm = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState({ address: '' });
  const [repeatInterval, setRepeatInterval] = useState('');
  const [notificationType, setNotificationType] = useState('none');
  const [notificationTimeBefore, setNotificationTimeBefore] = useState('');
  const [tags, setTags] = useState([]);
  const [sharedWith, setSharedWith] = useState([]);
  const [users, setUsers] = useState([]);

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
    const reminder = { 
      userId, 
      title, 
      description, 
      startDate, 
      endDate, 
      location, 
      repeatInterval, 
      notification: { type: notificationType === 'none' ? null : notificationType, timeBefore: notificationTimeBefore },
      tags,
      sharedWith
    };
    await axios.post('http://localhost:5000/r/reminders', reminder);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Start Date</label>
        <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>End Date</label>
        <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Location</label>
        <input type="text" value={location.address} onChange={(e) => setLocation({ address: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Repeat Interval</label>
        <input type="text" value={repeatInterval} onChange={(e) => setRepeatInterval(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Notification Type</label>
        <select value={notificationType} onChange={(e) => setNotificationType(e.target.value)}>
          <option value="none">None</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="push">Push</option>
        </select>
      </div>
      <div className="form-group">
        <label>Notification Time Before (minutes)</label>
        <input type="number" value={notificationTimeBefore} onChange={(e) => setNotificationTimeBefore(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Tags</label>
        <input type="text" value={tags.join(', ')} onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))} />
      </div>
      <div className="form-group">
        <label>Shared With</label>
        <select value={sharedWith} onChange={(e) => setSharedWith([e.target.value])}>
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.username}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Create Reminder</button>
    </form>
  );
};

export default ReminderForm;