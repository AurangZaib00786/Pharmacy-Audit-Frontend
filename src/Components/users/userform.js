import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useauthcontext";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Modal from "react-bootstrap/Modal";
import Select from "react-select"
import TextField from "@mui/material/TextField";
import went_wrong_toast from "../alerts/went_wrong_toast";
import success_toast from "../alerts/success_toast";
import Save_button from "../buttons/save_button";
import { UseaddDataContext } from "../../hooks/useadddatacontext";
import "./user.css";
function Userform({
  callagain, setcallagain,
  show, onHide }
) {
  const { dispatch } = UseaddDataContext();
  const { user, route } = useAuthContext();
  const [username, setusername] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setemail] = useState("");
  const [company_name, setcompany_name] = useState("");
  const [contact_number, setcontact_number] = useState("");
  const [address, setaddress] = useState("");
  const [password, setpassword] = useState("");
  const [isloading, setisloading] = useState(false);
  const [usernameerror, setusernameerror] = useState("");
  const [emailerror, setemailerror] = useState("");
  const [passworderror, setpassworderror] = useState("");
  const [groups, setgroups] = useState([]);
  const [Package, setPackage] = useState(null);
  const [userActive, setUserActive] = useState(null);
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
    const response = await fetch(`${route}/api/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access}`,
      },
      body: JSON.stringify({
        username: username,
        email,
        first_name,
        last_name,
        password,
        groups: groups.map((item) => item.value),
        profile: {
          contact_number: contact_number,
          company: company_name,
          address: address,
          package: Package.value,
          is_active: userActive.value,
        }
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
      setcompany_name("");
      setcontact_number("");
      setaddress("");
      setPackage(null);
      setUserActive(null);
      setemail("");
      setfirst_name("");
      setlast_name("");
      setpassword("");
      setcallagain(!callagain)
      setgroups([])
      success_toast();
    }
  };


  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
    control: (base) => ({
      ...base,
      minHeight: '30px',
      height: '30px',
      fontSize: '0.75rem', // optional: make font smaller to match
    }),
    valueContainer: (base) => ({
      ...base,
      height: '30px',
      padding: '0 8px',
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '30px',
    }),
  };
  

  const PackageOptions = [
    {label : "Free", value : "Free"},
    {label : "Paid", value : "Paid"},
  ]

  const ActiveOptions = [
    {label : "Active", value : true},
    {label : "In Active", value : false},
  ]

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md" aria-labelledby="contained-modal-title-vcenter" centered>
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
          <div className="row">
            <div className="">
            <TextField
            fullWidth
  label="Company Name"
  value={company_name}
  onChange={(e) => setcompany_name(e.target.value)}
  required
  size="small"
  style={{
    height: '30px',
  }}
  InputProps={{
    style: {
      height: '30px',
      fontSize: '0.75rem', // optional: to match smaller height
    },
  }}
  InputLabelProps={{
    style: {
      fontSize: '0.75rem', // optional: smaller label
    },
  }}
/>

          </div>
           <div className="">
          <TextField
          fullWidth
            className="form-control mt-3 "
            label="Contact Number"
            value={contact_number}
            onChange={(e) => {
              setcontact_number(e.target.value);
            }}
            size="small"
            style={{
              height: '30px',
            }}
            InputProps={{
              style: {
                height: '30px',
                fontSize: '0.75rem', // optional: to match smaller height
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: '0.75rem', // optional: smaller label
              },
            }}
          />
          </div>
        
          <div className="">

          <TextField
            className="form-control mt-3"
            label="Username"
            value={username}
            onChange={(e) => {
              setusername(e.target.value);
              setusernameerror("");
            }}
            size="small"
            style={{
              height: '30px',
            }}
            InputProps={{
              style: {
                height: '30px',
                fontSize: '0.75rem', // optional: to match smaller height
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: '0.75rem', // optional: smaller label
              },
            }}
            required
          />
          </div>
          <div className="text-danger">{usernameerror}</div>
          <div className=" ">

          <TextField
            type="email"
            className="form-control mt-3  "
            label="Email"
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
              setemailerror("");
            }}
            size="small"
            style={{
              height: '30px',
            }}
            InputProps={{
              style: {
                height: '30px',
                fontSize: '0.75rem', // optional: to match smaller height
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: '0.75rem', // optional: smaller label
              },
            }}
            required
          />
          </div>
          <div className="text-danger mb-1">{emailerror}</div>
          <div className="">

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
            style={{
              height: '30px',
            }}
            InputProps={{
              style: {
                height: '30px',
                fontSize: '0.75rem', // optional: to match smaller height
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: '0.75rem', // optional: smaller label
              },
            }}
          />
          </div>
          <div className="">

<TextField
  className="form-control mt-3"
  label="Address"
  value={address}
  onChange={(e) => {
    setaddress(e.target.value);
  }}
  size="small"
  style={{
    height: '30px',
  }}
  InputProps={{
    style: {
      height: '30px',
      fontSize: '0.75rem', // optional: to match smaller height
    },
  }}
  InputLabelProps={{
    style: {
      fontSize: '0.75rem', // optional: smaller label
    },
  }}
/>
</div>
           <Select
            className="mt-3"
            options={PackageOptions}
            value={Package}
            onChange={(e) => setPackage(e)}
            styles={selectStyles}
            placeholder="Select Package"
            
          />
           <Select
            className="mt-3"
            options={ActiveOptions}
            value={userActive}
            onChange={(e) => setUserActive(e)}
            styles={selectStyles}
            placeholder="Status"
          />
          <div className="text-danger mb-1">{passworderror}</div>
          <Select
            isMulti
            className="mt-3"
            options={allgroups}
            value={groups}
            onChange={(e) => setgroups(e)}
            styles={selectStyles}
            placeholder="Select Groups"
          />
          </div>
          <div className=" d-flex flex-row-reverse mt-3 me-2">
            <Save_button isloading={isloading} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Userform;
