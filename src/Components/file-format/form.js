import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useauthcontext";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Modal from "react-bootstrap/Modal";
import TextField from "@mui/material/TextField";
import went_wrong_toast from "../alerts/went_wrong_toast";
import success_toast from "../alerts/success_toast";
import Save_button from "../buttons/save_button";
import { UseaddDataContext } from "../../hooks/useadddatacontext";
import "./file-format.css";
function Form(props) {
  const { dispatch } = UseaddDataContext();
  const { user, route } = useAuthContext();
  const [name, setname] = useState("");
  const [row_number, setrow_number] = useState("");
  const [ndc_column, setndc_column] = useState("");
  const [date_column, setdate_column] = useState("");
  const [description_column, setdescription_column] = useState("");
  const [quantity_column, setquantity_column] = useState("");
  const [isloading, setisloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setisloading(true);
    const response = await fetch(`${route}/api/vendor-file-formats/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access}`,
      },
      body: JSON.stringify({
        name,
        row_number,
        ndc_column,
        reference: "vendor",
        date_column,
        description_column,
        quantity_column,
      }),
    });
    const json = await response.json();

    if (!response.ok) {
      setisloading(false);

      went_wrong_toast();
    }

    if (response.ok) {
      dispatch({ type: "Create_data", payload: json });
      setisloading(false);
      setname("");
      setdescription_column("");
      setrow_number("");
      setndc_column("");
      setquantity_column("");
      success_toast();
    }
  };
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          Add Vendor File Format
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
          <hr />
          <div className=" d-flex flex-row-reverse mt-2 me-2">
            <Save_button isloading={isloading} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Form;
