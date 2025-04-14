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
  const [company_name, setcompany_name] = useState("");
  const [contact_number, setcontact_number] = useState("");
  const [address, setaddress] = useState("");
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
          group_details : [],
          profile : {
            contact_number : last_name,
            company : company_name,
            address : address,
            package : "Free",
            is_active : false
          }
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
    <div className="min-h-screen login-main md:flex items-center p-4 md:p-0 justify-center ">
    <div className="md:w-2/3 h-auto login-child-main md:flex">

      <div style={{ height: "100%" }} className="md:w-1/2  login-form-bg md:ml-28 max-w-md rounde shadow-md">
        <div className="w-full h-8 flex justify-center items-center   bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe]">
          <h1 className="text-sm">SIGN UP</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 ">
          {/* <div className="row p-2 ">
        <div class="flex items-center   col-md-6 border-b border-white-500 py-2">
            <input
              value={first_name}
              onChange={(e) => {
                setfirst_name(e.target.value);
              }}
              required class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 placeholder-gray-200 px-2 leading-tight focus:outline-none" type="text" placeholder="First name" aria-label="Full name" />

          </div>
          <div class="flex items-center col-md-6 border-b border-white-500 py-2">
            <input
              value={last_name}
              onChange={(e) => {
                setlast_name(e.target.value);
              }}
              required class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 placeholder-gray-200 px-2 leading-tight focus:outline-none" type="text" placeholder="Last name" aria-label="Full name" />

          </div>
          </div> */}
          <div class="flex items-center border-b border-white-500 py-2">
            <input
              value={company_name}
              onChange={(e) => {
                setcompany_name(e.target.value);
              }}
              required class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 placeholder-gray-200 px-2 leading-tight focus:outline-none" type="text" placeholder="Company name" aria-label="Full name" />

          </div>
          <div class="flex items-center border-b border-white-500 py-2">
            <input
              value={contact_number}
              onChange={(e) => {
                setcontact_number(e.target.value);
              }}
              required class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 placeholder-gray-200 px-2 leading-tight focus:outline-none" type="number" placeholder="Contact number" aria-label="Full name" />

           
          </div>
          <div class="flex items-center border-b border-white-500 py-2">
            <input
              value={address}
              onChange={(e) => {
                setaddress(e.target.value);
              }}
              required class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 placeholder-gray-200 px-2 leading-tight focus:outline-none" type="text" placeholder="Address" aria-label="Full name" />

           
          </div>
          <div class="flex items-center border-b border-white-500 py-2">
            <input
              value={username}
              onChange={(e) => {
                setusername(e.target.value);
              }}
              required class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 placeholder-gray-200 px-2 leading-tight focus:outline-none" type="text" placeholder="Username" aria-label="Full name" />

            

          </div>
          <div class="flex items-center border-b border-white-500 py-2">
            <input
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
              required class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 placeholder-gray-200 px-2 leading-tight focus:outline-none" type="text" placeholder="Email" aria-label="Full name" />

           

          </div>
          <div class="flex items-center border-b border-white-500 py-2">
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
              className="w-32 py-2 flex justify-center mt-8 text-white bg-[#15e6cd] border border-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
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
                "Sign Up"
              )}
            </button>
          </div>




        </form>

      </div>
      <div className="">
        <div className="mt-16 md:flex justify-center items-center">


          <ul className="flex flex-col gap-4">
            <li className="md:text-white flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
              <span><span className="text-gray-400">Streamline File Comparisons with</span> <span className="font-bold md:text-white">Precision</span> and <span className="font-bold md:text-white">Speed</span></span></li>
            <li className="md:text-white flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
              <span className="md:text-white "><span className="font-bold md:text-white  ">Uncover Discrepancies</span> Instantly</span></li>
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

        <div className="mb-2 ">
        <div className="mt-4 flex justify-center">
        <span className="md:text-white text-xs">Already have an account?</span>
          </div>
        <div className="flex mt-2 justify-center">
        <Link to="/sign-in">    
        <span
            className="w-32 py-2 flex justify-center text-white bg-[#0b1c1b] border border-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
                  Sign In
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

export default SignUp;
