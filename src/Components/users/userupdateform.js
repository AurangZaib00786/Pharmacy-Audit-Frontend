import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useauthcontext";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Modal from "react-bootstrap/Modal";
import TextField from "@mui/material/TextField";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Update_button from "../buttons/update_button";
import { UseaddDataContext } from "../../hooks/useadddatacontext";
function Userupdate({ show, onHide, data, fun }) {
  const { dispatch } = UseaddDataContext();
  const { user, route } = useAuthContext();
  const [isloading, setisloading] = useState(false);
  const [username, setusername] = useState(data.username);
  const [first_name, setfirst_name] = useState(data.first_name);
  const [last_name, setlast_name] = useState(data.last_name);
  const [email, setemail] = useState(data.email);
  const [password, setpassword] = useState("");
  const [usernameerror, setusernameerror] = useState("");
  const [emailerror, setemailerror] = useState("");
  const [passworderror, setpassworderror] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisloading(true);
    if (password.length > 0) {
      var updated_data = {
        username: username,
        first_name,
        last_name,
        email,
        password,
      };
    } else {
      updated_data = { username: username, first_name, last_name, email };
    }

    const response = await fetch(`${route}/api/users/${data.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access}`,
      },
      body: JSON.stringify(updated_data),
    });
    const json = await response.json();

    if (!response.ok) {
      setisloading(false);
      Object.keys(json).map((key) => {
        switch (key) {
          case "username":
            setusernameerror(json.username);

          case "email":
            setemailerror(json.email);

          case "password":
            setpassworderror(json.password);
        }
      });
      went_wrong_toast();
    }

    if (response.ok) {
      setisloading(false);
      dispatch({ type: "Update_data", payload: json });
      onHide();
      fun("Update");
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
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          <PersonAddIcon className="me-2" />
          Edit User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <TextField
            className="form-control"
            label="First Name"
            value={first_name}
            onChange={(e) => {
              setfirst_name(e.target.value);
            }}
            size="small"
            required
          />

          <TextField
            className="form-control mt-3"
            label="Last Name"
            value={last_name}
            onChange={(e) => {
              setlast_name(e.target.value);
            }}
            size="small"
          />
          <TextField
            className="form-control mt-3"
            label="Username"
            value={username}
            onChange={(e) => {
              setusername(e.target.value);
              setusernameerror("");
            }}
            size="small"
            required
          />
          <div className="text-danger">{usernameerror}</div>
          <TextField
            type="email"
            className="form-control  mt-3"
            label="Email"
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
              setemailerror("");
            }}
            size="small"
            required
          />
          <div className="text-danger">{emailerror}</div>
          <TextField
            type="password"
            className="form-control  mt-3"
            label="Password"
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
              setpassworderror("");
            }}
            size="small"
          />
          <div className="text-danger">{passworderror}</div>

          <hr />
          <div className="d-flex flex-row-reverse mt-2 me-2">
            <Update_button isloading={isloading} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Userupdate;
