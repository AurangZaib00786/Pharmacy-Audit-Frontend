import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAuthContext } from "../../hooks/useauthcontext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "react-bootstrap/Spinner";

const Alert_before_delete = ({ show, onHide, url, dis_fun, row_id }) => {
  const { user } = useAuthContext();
  const [loading, setloading] = useState(false);

  const toasts_error = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
    });
  };

  const handel_ok = async () => {
    setloading(true);

    const response = await fetch(
      `${url}?directory=billing_files,vendor_files`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
      }
    );

    if (response.ok) {
      setloading(false);
      onHide();
      dis_fun();
    }
    if (!response.ok) {
      setloading(false);
      toasts_error("Error while Deleting the files. Try Again");
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header className="p-3" closeButton>
        <Modal.Title>Delete Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-2">
        <div className="alert alert-danger">Are you sure to delete?</div>
      </Modal.Body>
      <Modal.Footer className="p-2">
        <Button variant="default" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handel_ok}>
          {loading && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Alert_before_delete;
