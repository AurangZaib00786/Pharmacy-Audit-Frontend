
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

function EmailSuccess({successMsg}) {
 

  



    return (

        <div className="md:min-h-screen  h-screen login-main md:flex md:p-0 p-4 items-center justify-center ">
            <div className="md:w-2/3 p-4 h-96 login-child-main md:flex justify-center items-center ">
<div>
              <div className=" bg-green-400 rounded-lg p-2 text-white gap-2 flex justify-center items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
</svg>
<span>{successMsg}.</span></div>

              <div className=" ">   
                <Link to="/sign-up">
                <button
                                type="submit"
                                className="w-36 py-2 mx-auto flex justify-center mt-8 text-white bg-[#15e6cd] border border-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            >


                               Back to Continue

                            </button></Link></div>
                            </div>



            </div>




            {/* Left Content */}


            {/* Right Content */}


            <ToastContainer autoClose={2000} hideProgressBar={true} theme="colored" />
        </div>
    );
}

export default EmailSuccess;

