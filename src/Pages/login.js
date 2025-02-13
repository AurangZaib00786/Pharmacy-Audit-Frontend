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
    // <div
    //   className=" d-flex align-items-center justify-content-center body"
    //   style={{ minHeight: "100vh", zoom: ".9" }}
    // >
    //   <div className=" text-dark  " style={{ width: "65%" }}>
    //     <p className="welcomback text-center">Welcome Back</p>
    //     <p
    //       className="loginaccount text-center"
    //       style={{ marginBottom: "25px" }}
    //     >
    //       Login into Your Account{" "}
    //     </p>
    //     {/* <div className="text-center " style={{ marginTop: "37px" }}>
    //       <block className="google p-3 me-3">
    //         <img src="/google.png" className="me-3" alt="image" />
    //         <span className="text-box">Google</span>
    //       </block>
    //       <block className="google p-3">
    //         <img src="/facebook.png" className="me-3" alt="image" />
    //         <span className="text-box">Facebook</span>
    //       </block>
    //     </div> */}
    //     {/* <div
    //       className="d-flex justify-content-center align-items-center mt-3"
    //       style={{ marginBottom: "25px" }}
    //     >
    //       <img src="line.png" alt="image" />
    //       <p className="continue ms-3 me-3">or continue with</p>
    //       <img src="line.png" alt="image" />
    //     </div> */}



    //     <p className="text-center mb-5 noaccount" style={{ marginTop: "91px" }}>
    //       Don't Have an Account?{" "}
    //       <Link to={"/sign-up"} className="signup">
    //         Sign Up!
    //       </Link>
    //     </p>
    //   </div>
    //   <div className="text-end" style={{ width: "35%" }}>
    //     <img src="/loginpic.png" alt="Image" className="loginpic" />
    //   </div>
    //   <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    // </div>
    <div className="md:min-h-screen  h-screen login-main md:flex md:p-0 p-4 items-center justify-center ">
      <div className="md:w-2/3 h-96 login-child-main md:flex">

        <div style={{ height: "100%" }} className="md:w-1/2  login-form-bg md:ml-28 max-w-md rounde shadow-md">
          <div className="w-full h-8 flex justify-center items-center   bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe]">
            <h1 className="text-sm">LOG IN</h1>
          </div>
          <form onSubmit={handleSubmit} className="p-8 ">
            <div class="flex items-center border-b border-white-500 py-2">
              <input
                value={email}
                onChange={(e) => {
                  setemail(e.target.value);
                }}
                required class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 placeholder-gray-200 px-2 leading-tight focus:outline-none" type="text" placeholder="Username" aria-label="Full name" />

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>

            </div>
            <div class="flex items-center border-b border-white-500 mt-4 py-2">
              <input
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                required


                class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 placeholder-gray-200 px-2 leading-tight focus:outline-none" type={show ? "text" : "password"}
                placeholder="Password" aria-label="Full name" />

              <button
                type="button"
                onClick={() => setshow(!show)}
                className=""
              >
                {show ? "🙈" : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-200">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                }
              </button>

            </div>
            {/* <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                type="text"
                placeholder="Enter Username"
                value={email}
                onChange={(e) => {
                  setemail(e.target.value);
                }}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                  type={show ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => {
                    setpassword(e.target.value);
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setshow(!show)}
                  className="absolute right-3 top-2 text-gray-500 focus:outline-none"
                >
                  {show ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-teal-400 focus:ring-teal-400 border-gray-300 rounded"
                  onChange={() => setshow(!show)}
                />
                <span className="ml-2 text-gray-600 text-sm">Show Password</span>
              </label>
            </div> */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-32 py-2 flex justify-center mt-12 text-white bg-[#15e6cd] border border-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                disabled={islodding}
              >
                {islodding ? (
                  <Spinner
                    className="inline-block mr-2"
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "Sign In"
                )}
              </button>
            </div>




          </form>

        </div>
        <div className="">
          <div className="mt-8 md:flex justify-center items-center">


            <ul className="flex flex-col gap-4">
              <li className="text-white flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
                <span><span className="text-gray-400">Streamline File Comparisons with</span> <span className="font-bold md:text-white">Precision</span> and <span className="font-bold md:text-white">Speed</span></span></li>
              <li className="md:text-white flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
                <span><span className="font-bold ">Uncover Discrepancies</span> Instantly</span></li>
              <li className="md:text-white flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
                <span><span className="text-gray-400">Intuitive</span> interface <span className="font-bold md:text-white">pwerful</span> Results</span></li>
              <li className="md:text-white flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
                <span><span className="text-gray-400">Stay in Control with</span>  <span className="font-bold md:text-white">Detailed Audit Reports</span> </span></li>
            </ul>
           
          </div>

          <div className="mb-2">
          <div className="mt-4  flex justify-center">
          <span className="md:text-white text-xs">Don't have an account?</span>
            </div>
          <div className="flex mt-2 justify-center">
          <Link to="/sign-up">    
          <span
              className="w-32 py-2 flex justify-center text-white bg-[#0b1c1b] border border-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
                    Sign Up
            </span>
              </Link>
            </div>
           
          </div>
        </div>


      </div>




      {/* Left Content */}


      {/* Right Content */}


      <ToastContainer autoClose={2000} hideProgressBar={true} theme="colored" />
    </div>
  );
}

export default Login;
