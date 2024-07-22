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

function Login() {
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
      style={{ minHeight: "100vh", zoom: ".9" }}
    >
      <div className=" text-dark  " style={{ width: "65%" }}>
        <p className="welcomback text-center">Welcome Back</p>
        <p
          className="loginaccount text-center"
          style={{ marginBottom: "25px" }}
        >
          Login into Your Account{" "}
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
        {/* <div
          className="d-flex justify-content-center align-items-center mt-3"
          style={{ marginBottom: "25px" }}
        >
          <img src="line.png" alt="image" />
          <p className="continue ms-3 me-3">or continue with</p>
          <img src="line.png" alt="image" />
        </div> */}

        <form onSubmit={handleSubmit}>
          <h6 className=" text-center text-danger mt-3">{error}</h6>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="col-10 col-md-6 ">
              <p className="label">Username</p>
              <div className="w-100" style={{ marginBottom: "14px" }}>
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

            <div className="col-10 col-md-6   ">
              <p className="label">Password</p>
              <div className="w-100" style={{ marginBottom: "14px" }}>
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

            <div className="col-10 col-md-6 d-flex justify-content-start">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="remember"
                  onChange={handleshow}
                />{" "}
                <span className="showpass">Show Password</span>
              </label>
            </div>

            <div className="col-10 col-md-6 " style={{ marginTop: "55px" }}>
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
                Sign In
              </button>
            </div>
          </div>
        </form>

        <p className="text-center mb-5 noaccount" style={{ marginTop: "91px" }}>
          Don't Have an Account?{" "}
          <Link to={"/sign-up"} className="signup">
            Sign Up!
          </Link>
        </p>
      </div>
      <div className="text-end" style={{ width: "35%" }}>
        <img src="/loginpic.png" alt="Image" className="loginpic" />
      </div>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Login;
