import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import { useAuthContext } from "../hooks/useauthcontext";
import "./login.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PersonIcon from "@material-ui/icons/Person";
import HttpsIcon from "@material-ui/icons/Https";
import logo from "./logo.png";
import Spinner from "react-bootstrap/Spinner";
import { Link, useNavigate } from "react-router-dom";
import custom_toast from "../Components/alerts/custom_toast";

function SignUp() {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const navigate = useNavigate();
  const [error, seterror] = useState("");

  const [islodding, setislodding] = useState(null);
  const { user, dispatch_auth, route } = useAuthContext();
  const [show, setshow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setislodding(true);
      const response = await fetch(`${route}/api/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          email,
          first_name,
          last_name,
          password,
        }),
      });
      const json = await response.json();
      setislodding(false);
      if (!response.ok) {
        seterror(json.detail);
        toasts();
      }

      if (response.ok) {
        custom_toast("Save ");
        navigate("/");
      }
    } finally {
      setislodding(false);
    }
  };

  const toasts = () => {
    toast.error("Something went Wrong!", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
    });
  };

  const handleshow = (e) => {
    setshow(!show);
  };

  return (
    <div
      className=" d-flex align-items-center justify-content-center body"
      style={{ minHeight: "100vh", zoom: ".9" }}
    >
      <div className="  text-dark  " style={{ width: "65%" }}>
        <p className="welcomback text-center" style={{ marginBottom: "25px" }}>
          SignUp into Your Account
        </p>

        {/* <div className="text-center " style={{ marginTop: "37px" }}>
          <block className="google p-3 me-3">
            <img src="/google.png" className="me-3" alt="image" />
            <span className="text-box">Google</span>
          </block>
          <block className="google p-3">
            <img src="/facebook.png" className="me-3" alt="image" />
            <span className="text-box">Facebook</span>
          </block>
        </div> */}
        {/* <div className="d-flex justify-content-center align-items-center mt-3">
          <img src="line.png" alt="image" />
          <p className="continue ms-3 me-3">or continue with</p>
          <img src="line.png" alt="image" />
        </div> */}

        <form onSubmit={handleSubmit}>
          <h6 className=" text-center text-danger mt-3">{error}</h6>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="col-10 col-md-6 " style={{ marginBottom: "14px" }}>
              <p className="label">Company Name</p>
              <div className="w-100">
                <input
                  className="form-control"
                  style={{
                    background: "#FFFFFF",
                    color: "#4A4A4A",
                    borderColor: "#CED4DA",
                  }}
                  placeholder="Enter Name"
                  value={first_name}
                  onChange={(e) => {
                    setfirst_name(e.target.value);
                  }}
                  size="small"
                  required
                />
              </div>
            </div>
            <div className="col-10 col-md-6 " style={{ marginBottom: "14px" }}>
              <p className="label">Contact Number</p>
              <div className="w-100">
                <input
                  className="form-control"
                  style={{
                    background: "#FFFFFF",
                    color: "#4A4A4A",
                    borderColor: "#CED4DA",
                  }}
                  placeholder="Enter Number"
                  value={last_name}
                  onChange={(e) => {
                    setlast_name(e.target.value);
                  }}
                  size="small"
                />
              </div>
            </div>
            <div className="col-10 col-md-6 " style={{ marginBottom: "14px" }}>
              <p className="label">Username</p>
              <div className="w-100">
                <input
                  className="form-control"
                  style={{
                    background: "#FFFFFF",
                    color: "#4A4A4A",
                    borderColor: "#CED4DA",
                  }}
                  placeholder="Enter Name"
                  value={username}
                  onChange={(e) => {
                    setusername(e.target.value);
                    seterror("");
                  }}
                  size="small"
                  required
                />
              </div>
            </div>
            <div className="col-10 col-md-6 " style={{ marginBottom: "14px" }}>
              <p className="label">Email</p>
              <div className="w-100">
                <input
                  type="email"
                  className="form-control"
                  style={{
                    background: "#FFFFFF",
                    color: "#4A4A4A",
                    borderColor: "#CED4DA",
                  }}
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                  size="small"
                  required
                />
              </div>
            </div>

            <div className="col-10 col-md-6  " style={{ marginBottom: "55px" }}>
              <p className="label">Password</p>
              <div className="w-100">
                <input
                  type={show ? "text" : "password"}
                  className="form-control"
                  style={{
                    background: "#FFFFFF",
                    color: "#4A4A4A",
                    borderColor: "#CED4DA",
                  }}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => {
                    setpassword(e.target.value);
                    seterror("");
                  }}
                  size="small"
                  required
                />
              </div>
            </div>

            <div className="col-10 col-md-6 ">
              <button
                type="submit"
                style={{ backgroundColor: "#0D6EFD" }}
                className="button btn  form-control text-white"
                disabled={islodding}
              >
                {islodding && (
                  <Spinner
                    className="me-2"
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                Sign Up
              </button>
            </div>
          </div>
        </form>

        <p
          className="text-center mb-5  noaccount"
          style={{ marginTop: "91px" }}
        >
          Have an Account?{" "}
          <Link to={"/"} className="signup">
            Sign In!
          </Link>
        </p>
      </div>
      <div className=" text-end" style={{ width: "35%" }}>
        <img src="/loginpic.png" alt="Image" className="signuppic" />
      </div>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default SignUp;
