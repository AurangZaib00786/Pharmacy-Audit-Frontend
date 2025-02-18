

import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useauthcontext";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Modal from "react-bootstrap/Modal";
import TextField from "@mui/material/TextField";
import Select from "react-select"
import went_wrong_toast from "../alerts/went_wrong_toast";
import Update_button from "../buttons/update_button";
import { UseaddDataContext } from "../../hooks/useadddatacontext";
// import "./user.css";
import custom_toast from "../alerts/custom_toast";
import { UseaddheaderContext } from "../../hooks/useaddheadercontext";

function EditGroupForm({ show, onHide, data, fun,callagain, setcallagain }) {
  const { user, route } = useAuthContext();
  const [isloading, setisloading] = useState(false);
  const { dispatch } = UseaddheaderContext();
   const [name, setname] = useState(data.name);
    const [type, settype] = useState(data.extended.type);
    const [last_name, setlast_name] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [usernameerror, setusernameerror] = useState("");
    const [emailerror, setemailerror] = useState("");
    const [passworderror, setpassworderror] = useState("");
    const [permissions, setPermissions] = useState(
       []
    );
    
    const [allpermissions, setallpermissions] = useState([]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setisloading(true);
  
    const response = await fetch(`${route}/api/groups/${data.id}/`, {
      method: "PATCH",
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
        setcallagain(!callagain)
      setisloading(false);
      dispatch({ type: "Set_Current_user", payload: json });
      onHide();
      custom_toast("Update ");
    }
  };
  useEffect(() => {
    if (data.permission_details) {
        setPermissions(data.permission_details.map((item) => ({ value: item.id, label: item.name })));
    }
}, [data.permission_details]);


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
  
    const selectStyles = {
        menu: (base) => ({
          ...base,
          zIndex: 100,
        }),
      };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="model-heading">Edit Groups & Permissions</Modal.Title>
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
            <Update_button isloading={isloading} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default EditGroupForm;

