const express = require('express');
const router = express.Router();
const reminderController = require('../Controllers/reminderController'); 

// Create a new reminder
router.post('/reminders', reminderController.createReminder);

// Read all reminders for a user
router.get('/reminders/:userId', reminderController.getReminders);

// Update a reminder
router.put('/reminders/:id', reminderController.updateReminder);

// get shared reminders
router.get('/reminders/shared/:userId', reminderController.getSharedReminders);

module.exports = router;