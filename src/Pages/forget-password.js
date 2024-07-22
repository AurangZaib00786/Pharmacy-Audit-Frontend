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
import { Link } from "react-router-dom";

function ForgetPassword() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const [error, seterror] = useState("");

  const [islodding, setislodding] = useState(null);
  const { user, dispatch_auth, route } = useAuthContext();
  const [show, setshow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setislodding(true);
      const response = await fetch(`${route}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      const json = await response.json();
      setislodding(false);
      if (!response.ok) {
        seterror(json.detail);
        toasts();
      }

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(json));
        dispatch_auth({ type: "LOGIN", payload: json });
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
      style={{ minHeight: "100vh" }}
    >
      <div className=" col-7 text-dark  " style={{ zoom: ".7" }}>
        <p className="welcomback text-center">Forget Password</p>

        <form onSubmit={handleSubmit}>
          <h6 className=" text-center text-danger mt-3">{error}</h6>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="col-10 col-md-6 mb-3 mt-2 ">
              <p className="label">Generate Password</p>
              <div className="w-100">
                <input
                  className="form-control"
                  style={{
                    background: "#FFFFFF",
                    color: "#4A4A4A",
                    borderColor: "#CED4DA",
                  }}
                  placeholder="Enter Name"
                  value={email}
                  onChange={(e) => {
                    setemail(e.target.value);
                    seterror("");
                  }}
                  size="small"
                  required
                />
              </div>
            </div>

            <div className="col-10 col-md-6  mb-3 mt-2 ">
              <p className="label">Confirm Password</p>
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

            <div className="col-10 col-md-6 mt-5">
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
                Reset Password
              </button>
            </div>
          </div>
        </form>

        <p className="text-center mt-4 mb-0 noaccount">
          Don't Have an Account?{" "}
          <Link to={"/sign-up"} className="signup">
            Sign Up!
          </Link>
        </p>
      </div>
      <div className="col-5 text-end">
        <img src="/loginpic.png" alt="Image" className="loginpic" />
      </div>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default ForgetPassword;
