import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ReminderForm = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [startHour, setStartHour] = useState(12); // Hour in 12-hour format
  const [startMinute, setStartMinute] = useState(0); // Minutes
  const [startAmPm, setStartAmPm] = useState('AM'); // AM/PM
  const [endDate, setEndDate] = useState(new Date());
  const [endHour, setEndHour] = useState(12);
  const [endMinute, setEndMinute] = useState(0);
  const [endAmPm, setEndAmPm] = useState('AM');
  const [location, setLocation] = useState({ address: '' });
  const [repeatInterval, setRepeatInterval] = useState('');
  const [notificationType, setNotificationType] = useState('none');
  const [notificationTimeBefore, setNotificationTimeBefore] = useState('2'); // Default to 2 hours before
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

  // Convert the 12-hour format to 24-hour format
  const convertTo24HourFormat = (hour, amPm) => {
    if (amPm === 'AM' && hour === 12) {
      return 0; // 12 AM is 00:00 in 24-hour format
    } else if (amPm === 'PM' && hour !== 12) {
      return hour + 12; // PM times
    }
    return hour; // For AM times, except 12
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = user?.userId || Cookies.get('userId').replace(/^j:/, '').replace(/"/g, ''); 
    const startDateTime = new Date(startDate.setHours(
      convertTo24HourFormat(startHour, startAmPm),
      startMinute
    ));
    const endDateTime = new Date(endDate.setHours(
      convertTo24HourFormat(endHour, endAmPm),
      endMinute
    ));

    const reminder = { 
      userId, 
      title, 
      description, 
      startDate: startDateTime, 
      endDate: endDateTime, 
      location, 
      repeatInterval, 
      notification: { 
        type: notificationType === 'none' ? null : notificationType, 
        timeBefore: notificationTimeBefore 
      },
      tags,
      sharedWith
    };
    await axios.post('http://localhost:5000/r/reminders', reminder);
     window.location.reload();  
  };

  return (
    <form onSubmit={handleSubmit} className="container py-4">

      {/* Title */}
      <div className="row mb-3">
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input 
              id="title" 
              type="text" 
              className="form-control" 
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
              id="description" 
              className="form-control" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows="4"
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
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input 
              id="location" 
              type="text" 
              className="form-control" 
              value={location.address} 
              onChange={(e) => setLocation({ address: e.target.value })} 
            />
          </div>
        </div>
        
        {/* Repeat Interval */}
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="repeatInterval">Repeat Interval</label>
            <input 
              id="repeatInterval" 
              type="text" 
              className="form-control" 
              value={repeatInterval} 
              onChange={(e) => setRepeatInterval(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* Notification Type */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="notificationType">Notification Type</label>
            <select 
              id="notificationType" 
              className="form-control" 
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
      </div>

      {/* Tags */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input 
              id="tags" 
              type="text" 
              className="form-control" 
              value={tags.join(', ')} 
              onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))} 
            />
          </div>
        </div>

        {/* Shared With */}
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="sharedWith">Shared With</label>
            <select 
              id="sharedWith" 
              className="form-control" 
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

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary btn-lg btn-block">Create Reminder</button>
    </form>
  );
};

export default ReminderForm;
