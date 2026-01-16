import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../Styles/CustomModal.css';

const CustomModal = ({ show, onHide, onConfirm, title, message }) => {
    return (
        <Modal show={show} onHide={onHide} centered contentClassName="custom-modal-content" animation={false} enforceFocus={false}>
            <Modal.Header closeButton className="custom-modal-header">
                <Modal.Title>{title || "Confirm Action"}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <p>{message || "Are you sure you want to proceed?"}</p>
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                <Button variant="secondary" onClick={onHide} className="btn-cancel">
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm} className="btn-confirm">
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomModal;
