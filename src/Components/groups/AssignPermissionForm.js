import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useauthcontext";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Modal from "react-bootstrap/Modal";
import TextField from "@mui/material/TextField";
import went_wrong_toast from "../alerts/went_wrong_toast";
import success_toast from "../alerts/success_toast";
import Save_button from "../buttons/save_button";
import { UseaddDataContext } from "../../hooks/useadddatacontext";
// import "./user.css";
function AssignPermissionForm(props) {
  const { dispatch } = UseaddDataContext();
  const { user, route } = useAuthContext();
  const [username, setusername] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isloading, setisloading] = useState(false);
  const [usernameerror, setusernameerror] = useState("");
  const [emailerror, setemailerror] = useState("");
  const [passworderror, setpassworderror] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setisloading(true);
    const response = await fetch(`${route}/api/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access}`,
      },
      body: JSON.stringify({
        username,
        first_name,
        last_name,
        email,
        password,
      }),
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
      dispatch({ type: "Create_data", payload: json });
      setisloading(false);
      setusername("");
      setemail("");
      setfirst_name("");
      setlast_name("");
      setpassword("");
      success_toast();
    }
  };
  return (
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          <PersonAddIcon className="me-2" />
          Add User
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
          <div className="text-danger mb-1">{emailerror}</div>
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
            required
          />
          <div className="text-danger mb-1">{passworderror}</div>

          <div className=" d-flex flex-row-reverse mt-3 me-2">
            <Save_button isloading={isloading} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default AssignPermissionForm;

