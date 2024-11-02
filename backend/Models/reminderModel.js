const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  location: {
    latitude: Number,
    longitude: Number,
  },
  type: { type: String, enum: ['month', 'week', 'day', 'time-limited'], required: true }
});

module.exports = mongoose.model('Reminder', reminderSchema);
