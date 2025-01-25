import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useauthcontext";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Modal from "react-bootstrap/Modal";
import TextField from "@mui/material/TextField";
import went_wrong_toast from "../alerts/went_wrong_toast";
import success_toast from "../alerts/success_toast";
import Save_button from "../buttons/save_button";
import { UseaddDataContext } from "../../hooks/useadddatacontext";
import "./bin.css";
import Select_field from "../selectfield/select";
import Select from "react-select"
function Binform(props) {
  const { dispatch } = UseaddDataContext();
  const { user, route } = useAuthContext();
  const [name, setname] = useState("");
  const [insurance, setinsurance] = useState("");
  const [isloading, setisloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setisloading(true);
    const response = await fetch(`${route}/api/bin-numbers/`, {
      method: "POST",
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
      dispatch({ type: "Create_data", payload: json });
      setisloading(false);
      setname("");

      success_toast();
    }
  }; const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };



  return (
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          <PersonAddIcon className="me-2" />
          Add Bin Number
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <Select
            options={props.allinsurance}
            value={insurance}
            styles={selectStyles}
            funct={(e) => setinsurance(e)}
            placeholder={"Insurance Company"}
            required={true}
          />
          <TextField
            type="number"
            className="form-control mt-3"
            label=" Number"
            value={name}
            onChange={(e) => {
              setname(e.target.value);
            }}
            size="small"
            required
          />

          <hr />
          <div className=" d-flex flex-row-reverse mt-2 me-2">
            <Save_button isloading={isloading} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Binform;
