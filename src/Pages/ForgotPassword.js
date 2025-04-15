

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
import EmailSuccess from "./EmailSuccess";

function ForgotPassword() {
    const [email, setemail] = useState("");

    const [error, seterror] = useState("");
    const [islodding, setislodding] = useState(null);
    const { user, dispatch_auth, route } = useAuthContext();
    const [successMsg, setSuccessMsg] = useState("");
    const [OpenSuccess, setOpenSuccess] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setislodding(true);
            const response = await fetch(`${route}/api/send-reset-email/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email }),
            });
            const json = await response.json();
            setislodding(false);
            if (!response.ok) {
                seterror(json.detail);
                toasts();
            }

            if (response.ok) {
                setSuccessMsg(json.message);
                setOpenSuccess(true)
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

    console.log(successMsg, "success msggg")


    return (
<>
{OpenSuccess ? <EmailSuccess successMsg={successMsg}/> :   <div className="md:min-h-screen  h-screen login-main md:flex md:p-0 p-4 items-center justify-center ">
            <div className="md:w-2/3  h-96 login-child-main md:flex justify-center items-center ">

                <div style={{ height: "auto" }} className="md:w-1/2 p-4  login-form-bg  max-w-md rounde shadow-md">
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-center items-center mt-10 ">
                            <div class="flex items-center border-b border-white-500 py-2 px-2 ">
                                <input
                                    value={email}
                                    onChange={(e) => {
                                        setemail(e.target.value);
                                    }}
                                    required class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 placeholder-gray-200 px-2 leading-tight focus:outline-none" type="text" placeholder="Enter Your Email" aria-label="Full name" />

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>


                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-36 py-2 flex justify-center mt-8 text-white bg-[#15e6cd] border border-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
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
                                    "Reset Password"
                                )}

                            </button>
                        </div>
                    </form>
                  
                 




                </div>



            </div>




            {/* Left Content */}


            {/* Right Content */}


            <ToastContainer autoClose={2000} hideProgressBar={true} theme="colored" />
        </div>}
       
        </>
    );
}

export default ForgotPassword;
