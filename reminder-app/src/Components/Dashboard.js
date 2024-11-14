import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Calendar from './Calender';
import ReminderForm from './ReminderForm';

function Dashboard() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Calendar />
      <Button variant="primary" onClick={handleShow}>
        New Reminder
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create a New Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReminderForm />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Dashboard;
