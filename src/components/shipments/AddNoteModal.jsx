import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "../../styles/ui/pop.css";

const AddNoteModal = ({ show, onClose, onSave }) => {
  const [note, setNote] = useState("");

  const handleSave = () => {
    if (note.trim()) {
      onSave(note);
      setNote("");
      onClose(); // Close modal after saving
    }
  };

  const handleClose = () => {
    setNote("");
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="custom-modal"
      backdrop="static"
    >
      <Modal.Header closeButton className="btn border-0 pb-1">
        <Modal.Title className="fw-bold fs-5">Add Note</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <Form>
          <Form.Group controlId="noteTextarea">
            <Form.Label className="fw-medium mb-2">Visible to Internal Staff</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              className="rounded-3 shadow-sm"
              placeholder="Text area for notes"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0 d-flex justify-content-end gap-2">
        <Button variant="outline-secondary" className="px-4" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" className="px-4" onClick={handleSave}>
          Add Notes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNoteModal;
