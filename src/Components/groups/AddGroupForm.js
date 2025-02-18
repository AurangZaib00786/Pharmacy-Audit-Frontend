

import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useauthcontext";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Modal from "react-bootstrap/Modal";
import TextField from "@mui/material/TextField";
import Select from "react-select"
import went_wrong_toast from "../alerts/went_wrong_toast";
import success_toast from "../alerts/success_toast";
import Save_button from "../buttons/save_button";
import { UseaddDataContext } from "../../hooks/useadddatacontext";
// import "./user.css";
function AddGroupForm(
    show, onHide,callagain, setcallagain
) {
  const { dispatch } = UseaddDataContext();
  const { user, route } = useAuthContext();
  const [username, setusername] = useState("");
  const [name, setname] = useState("");
  const [type, settype] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isloading, setisloading] = useState(false);
  const [usernameerror, setusernameerror] = useState("");
  const [emailerror, setemailerror] = useState("");
  const [passworderror, setpassworderror] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [allpermissions, setallpermissions] = useState([]);


  useEffect(() => {
    const fetchbranches = async () => {
      var url = `${route}/api/permissions/`;
      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setallpermissions(
          json.map((item) => {
            return { value: item.id, label: item.name };
          })
        );
      }
    };
    if (user) {
      fetchbranches();
    }
  }, [permissions]);

  console.log(permissions)


  const handleSubmit = async (e) => {
    e.preventDefault();

    setisloading(true);
    const response = await fetch(`${route}/api/groups/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access}`,
      },
      body: JSON.stringify({
        name,
        extended: { type: type },
        permissions : permissions.map((items)=> items.value)
      }),
    });
    const json = await response.json();

    if (!response.ok) {
      setisloading(false);
    //   Object.keys(json).map((key) => {
    //     switch (key) {
    //       case "username":
    //         setusernameerror(json.username);

    //       case "email":
    //         setemailerror(json.email);

    //       case "password":
    //         setpassworderror(json.password);
    //     }
    //   });

      went_wrong_toast();
    }

    if (response.ok) {
      dispatch({ type: "Create_data", payload: json });
      setisloading(false);
      setname("");
      settype("");
      setPermissions("");
      success_toast();
      setcallagain(!callagain)
    }
  };

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  return (
    <Modal  show={show}
    onHide={onHide} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          <PersonAddIcon className="me-2" />
          Add Group & Permissions
        </Modal.Title>
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

          <TextField
            className="form-control mt-3"
            label="Type"
            value={type}
            onChange={(e) => {
              settype(e.target.value);
            }}
            size="small"
          />
        

        
        <Select
        isMulti
        className="mt-3"
        options={allpermissions}
        value={permissions}
        onChange={(e)=>setPermissions(e)}
        styles={selectStyles}
        placeholder="Select permissions"
      />

          <div className=" d-flex flex-row-reverse mt-3 me-2">
            <Save_button isloading={isloading} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default AddGroupForm;
