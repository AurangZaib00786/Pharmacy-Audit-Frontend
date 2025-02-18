import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useauthcontext";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Modal from "react-bootstrap/Modal";
import Select from "react-select"
import TextField from "@mui/material/TextField";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Update_button from "../buttons/update_button";
import { UseaddDataContext } from "../../hooks/useadddatacontext";
import "./user.css";
import custom_toast from "../alerts/custom_toast";
import { UseaddheaderContext } from "../../hooks/useaddheadercontext";
function Userupdate({ show, onHide, data, fun,callagain, setcallagain }) {
  const { user, route } = useAuthContext();
  const [isloading, setisloading] = useState(false);
  const { dispatch } = UseaddheaderContext();
  const [username, setusername] = useState(data.username);
  const [first_name, setfirst_name] = useState(data.first_name);
  const [last_name, setlast_name] = useState(data.last_name);
  const [email, setemail] = useState(data.email);
  const [password, setpassword] = useState("");
  const [usernameerror, setusernameerror] = useState("");
  const [emailerror, setemailerror] = useState("");
  const [passworderror, setpassworderror] = useState("");
     const [groups, setgroups] = useState([]);
      const [allgroups, setallgroups] = useState([]);


      useEffect(() => {
              const fetchbranches = async () => {
                var url = `${route}/api/groups/`;
                const response = await fetch(`${url}`, {
                  headers: { Authorization: `Bearer ${user.access}` },
                });
                const json = await response.json();
          
                if (response.ok) {
                  setallgroups(
                    json.map((item) => {
                      return { value: item.id, label: item.name };
                    })
                  );
                }
              };
              if (user) {
                fetchbranches();
              }
            }, [groups]);

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
        groups : groups.map((items)=>items.value)

      };
    } else {
      updated_data = { username: username, first_name, last_name, email,
        groups : groups.map((items)=>items.value)

       };
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
      dispatch({ type: "Set_Current_user", payload: json });
      onHide();
      setcallagain(!callagain)
      custom_toast("Update ");
    }
  };

    useEffect(() => {
      if (data.group_details) {
          setgroups(data.group_details.map((item) => ({ value: item.id, label: item.name })));
      }
  }, [data.group_details]);
  
  
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
        <Modal.Title className="model-heading">Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <TextField
            className="form-control"
            label="Company Name"
            value={first_name}
            onChange={(e) => {
              setfirst_name(e.target.value);
            }}
            size="small"
            required
          />

          <TextField
            className="form-control mt-3"
            label="Contact Number"
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
          <Select
        isMulti
        className="mt-3"
        options={allgroups}
        value={groups}
        onChange={(e)=>setgroups(e)}
        styles={selectStyles}
        placeholder="Select Groups"
      />
          <div className="d-flex flex-row-reverse mt-2 me-2">
            <Update_button isloading={isloading} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Userupdate;
