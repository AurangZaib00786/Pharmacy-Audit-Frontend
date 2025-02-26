import React from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

function BinNumberModal({ show, onHide, data, company }) {
  return (
    <Modal show={show} onHide={onHide} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="d-flex align-items-center">
          <h6>{company}</h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-3">Bin Numbers</h5>

        {data && data.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Bin Number</th>
              </tr>
            </thead>
            <tbody>
              {data.map((bin, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{bin}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">No Bin Numbers</p>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default BinNumberModal;
