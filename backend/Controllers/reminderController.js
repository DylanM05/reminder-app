const Reminder = require('../Models/reminderModel');

// Create a new reminder
exports.createReminder = async (req, res) => {
  try {
    const reminder = await Reminder.create(req.body);
    res.status(201).json(reminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read all reminders for a user
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.params.userId });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a reminder
exports.updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(reminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};