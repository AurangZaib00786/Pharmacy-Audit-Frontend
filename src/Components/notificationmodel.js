import React from "react";
import Modal from "react-bootstrap/Modal";
import "./header.css";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
function NotificationModal({
  show,
  onHide,
  user,
  route,
  allremainders,
  setallremainders,
}) {
  const navigate = useNavigate();
  const handlestatuschange = async (item, text) => {
    if (!item.read_status) {
      const response = await fetch(
        `${route}/api/customer-messages-reminder/${item.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access}`,
          },
          body: JSON.stringify({
            status: text,
          }),
        }
      );
      const json = await response.json();
      if (!response.ok) {
      }

      if (response.ok) {
        setallremainders(
          allremainders.map((row) => {
            if (row.id === item.id) {
              return json;
            } else {
              return row;
            }
          })
        );
        if (text === "follow up") {
          navigate(`/customermessage/${json.message}/null`);
        }
      }
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      style={{ zoom: ".8" }}
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-md-center"
        >
          Notifications
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {allremainders?.map((item) => {
          return (
            <div
              className=" p-2 pb-1 border-bottom d-flex justify-content-between align-items-center"
              key={item.id}
            >
              <p
                className=" mb-0"
                style={{
                  fontWeight: item.status !== "pending" ? "normal" : "bold",
                  opacity: ".7",
                  fontSize: "14px",
                }}
              >
                {item.follow_up_message
                  ? item.follow_up_message
                  : "No notes for this remainder!"}
                <span className="text-muted ms-5">({item.status})</span>
              </p>
              <div>
                <Button
                  onClick={() => handlestatuschange(item, "follow up")}
                  className="me-2"
                  variant="success"
                  disabled={item.status === "pending" ? false : true}
                >
                  Take Action
                </Button>
                <Button
                  onClick={() => handlestatuschange(item, "cancel")}
                  className="me-2"
                  variant="danger"
                  disabled={item.status === "pending" ? false : true}
                >
                  Cancel
                </Button>
              </div>
            </div>
          );
        })}
      </Modal.Body>
    </Modal>
  );
}

export default NotificationModal;
