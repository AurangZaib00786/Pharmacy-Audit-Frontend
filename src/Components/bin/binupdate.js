import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useauthcontext";
import Modal from "react-bootstrap/Modal";
import TextField from "@mui/material/TextField";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Update_button from "../buttons/update_button";
import "./bin.css";
import custom_toast from "../alerts/custom_toast";
import Select_field from "../selectfield/select";
import { UseaddDataContext } from "../../hooks/useadddatacontext";

function Binupdate({ show, onHide, data, allinsurance }) {
  const { user, route } = useAuthContext();
  const [isloading, setisloading] = useState(false);
  const { dispatch } = UseaddDataContext();
  const [name, setname] = useState(data.number);
  const [insurance, setinsurance] = useState({
    value: data.insurance_company,
    label: data.insurance_company_name,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisloading(true);

    const response = await fetch(`${route}/api/bin-numbers/${data.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access}`,
      },
      body: JSON.stringify({
        number: name,
        insurance_company: insurance.value,
      }),
    });
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
          <Select_field
            options={allinsurance}
            value={insurance}
            funct={(e) => setinsurance(e)}
            placeholder={"Insurance Company"}
            required={true}
          />
          <TextField
            type="number"
            className="form-control"
            label=" Number"
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

export default Binupdate;
