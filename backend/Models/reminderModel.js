const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  location: {
    address: { type: String, required: false }
  },
  repeatInterval: { type: String, required: false },
  notification: {
    type: { type: String, enum: ['email', 'sms', 'push'], required: false },
    timeBefore: { type: Number, required: false } // in minutes
  },
  tags: [{ type: String, required: false }],
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }]
});

module.exports = mongoose.model('Reminder', reminderSchema);