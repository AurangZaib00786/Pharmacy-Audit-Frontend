import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useauthcontext";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Modal from "react-bootstrap/Modal";
import TextField from "@mui/material/TextField";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Update_button from "../buttons/update_button";
import { UseaddDataContext } from "../../hooks/useadddatacontext";
import "./file-format.css";
import custom_toast from "../alerts/custom_toast";

function Update({ show, onHide, data }) {
  const { user, route } = useAuthContext();
  const [isloading, setisloading] = useState(false);
  const { dispatch } = UseaddDataContext();
  const [name, setname] = useState(data.name);
  const [date_column, setdate_column] = useState(data.date_column);
  const [row_number, setrow_number] = useState(data.row_number);
  const [ndc_column, setndc_column] = useState(data.ndc_column);
    const [amount_column, setamount_column] = useState(data.amount_column);
  
  const [description_column, setdescription_column] = useState(
    data.description_column
  );
  const [quantity_column, setquantity_column] = useState(data.quantity_column);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisloading(true);

    const response = await fetch(
      `${route}/api/vendor-file-formats/${data.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({
          name,
          row_number,
          ndc_column,
          date_column,
          description_column,
          quantity_column,
          amount_column
        }),
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
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="custom-modal" 
    >
      <Modal.Header closeButton>
        <Modal.Title className="model-heading">
          Edit Vendor File Format
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <TextField
                className="form-control "
                label="name"
                value={name}
                onChange={(e) => {
                  setname(e.target.value);
                }}
                size="small"
                required
              />
            </div>{" "}
            <div className="col-md-6 mb-3">
              <TextField
                type="number"
                className="form-control"
                label="Row Number"
                value={row_number}
                onChange={(e) => {
                  setrow_number(e.target.value);
                }}
                size="small"
                required
              />
            </div>{" "}
            <div className="col-md-6 mb-3">
              <TextField
                className="form-control "
                label="NDC Column"
                value={ndc_column}
                onChange={(e) => {
                  setndc_column(e.target.value);
                }}
                size="small"
              />
            </div>{" "}
            <div className="col-md-6 mb-3">
              <TextField
                className="form-control "
                label="Date Column"
                value={date_column}
                onChange={(e) => {
                  setdate_column(e.target.value);
                }}
                size="small"
              />
            </div>
            <div className="col-md-6 mb-3">
              <TextField
                className="form-control  "
                label="Description Column"
                value={description_column}
                onChange={(e) => {
                  setdescription_column(e.target.value);
                }}
                size="small"
                required
              />

            </div>{" "}
              <div className="col-md-6 mb-3">
                        <TextField
                          className="form-control"
                          label="Amount"
                          value={amount_column}
                          onChange={(e) => setamount_column(e.target.value)}
                          size="small"
                        />
                      </div>
            <div className="col-md-6 mb-3">
              <TextField
                className="form-control  "
                label="Qty Column"
                value={quantity_column}
                onChange={(e) => {
                  setquantity_column(e.target.value);
                }}
                size="small"
                required
              />
            </div>
          </div>

          <div className="d-flex flex-row-reverse mt-2 me-2">
          <Update_button isloading={isloading} />
        </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Update;
