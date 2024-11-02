import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import Cookies from 'js-cookie';

const ReminderForm = () => {
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('day');
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = user?.userId || Cookies.get('userId').replace(/^j:/, '').replace(/"/g, ''); 
    const reminder = { userId, title, description, startDate, endDate, type, location };
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
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
          <option value="time-limited">Time-limited</option>
        </select>
      </div>
      <div className="form-group">
        <button type="button" onClick={handleLocation}>Get Location</button>
      </div>
      <button type="submit">Create Reminder</button>
    </form>
  );
};

export default ReminderForm;