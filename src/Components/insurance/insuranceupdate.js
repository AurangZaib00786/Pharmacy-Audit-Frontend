import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useauthcontext";
import Modal from "react-bootstrap/Modal";
import TextField from "@mui/material/TextField";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Update_button from "../buttons/update_button";
import "./insurance.css";
import custom_toast from "../alerts/custom_toast";
import { UseaddDataContext } from "../../hooks/useadddatacontext";

function Insuranceupdate({ show, onHide, data, fun }) {
  const { user, route } = useAuthContext();
  const [isloading, setisloading] = useState(false);
  const { dispatch } = UseaddDataContext();
  const [name, setname] = useState(data.name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisloading(true);

    const response = await fetch(
      `${route}/api/insurance-companies/${data.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({ name }),
      }
    );
    const json = await response.json();

    if (!response.ok) {
      setisloading(false);

      went_wrong_toast();
    }

    if (response.ok) {
      setisloading(false);
      dispatch({ type: "Update_data", payload: json });
      onHide();
      custom_toast("Update ");
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title className="model-heading">Edit Insurance</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <TextField
            className="form-control"
            label=" Name"
            value={name}
            onChange={(e) => {
              setname(e.target.value);
            }}
            size="small"
            required
          />

          <hr />
          <div className="d-flex flex-row-reverse mt-2 me-2">
            <Update_button isloading={isloading} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Insuranceupdate;
