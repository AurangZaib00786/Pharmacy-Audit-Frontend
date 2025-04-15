
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
import { Link, useParams, useNavigate } from "react-router-dom";


function NewPassword() {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [Confirmpassword, setConfirmpassword] = useState("");

    const {uid, token} = useParams();
    const navigate = useNavigate()


    const [error, seterror] = useState("");

    const [islodding, setislodding] = useState(null);
    const { user, dispatch_auth, route } = useAuthContext();
    const [show, setshow] = useState(false);
    const [showConfirm, setshowConfirm] = useState(false);
    const [showForgetPassword, setshowForgetPassword] = useState(false);

    const handleSubmit = async (e) => {
      
        e.preventDefault();
        try {
            setislodding(true);
            const response = await fetch(`${route}/api/reset-password/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({  new_password : password, uid, token  }),
            });
            const json = await response.json();
            setislodding(false);
            if (!response.ok) {
                toast.error(json.error, {
                    position: toast.POSITION.TOP_RIGHT,
                    pauseOnHover: false,
                });
            }

            if (response.ok) {
              successtoasts();
              navigate("/")
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
    const successtoasts = () => {
        toast.success("Password has been reset successfully", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
        });
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setpassword(value);
        if (Confirmpassword && value !== Confirmpassword) {
            seterror("password do not matched")

        }else{
            seterror("")
        }
      };
      
      const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmpassword(value);
        if (password && value !== password) {
            seterror("password do not matched")
        } else{
            seterror("")
        }
      };


    return (

        <div className="md:min-h-screen  h-screen login-main md:flex md:p-0 p-4 items-center justify-center ">
            <div className="md:w-2/3  h-96 login-child-main md:flex justify-center items-center ">

                <div style={{ height: "auto" }} className="md:w-1/2  login-form-bg  max-w-md rounde shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className=" mt-10 p-4">
                        <div class="flex items-center border-b border-white-500 mt-4 py-2">
                            <input
                                value={password}
                                onChange={handlePasswordChange}
                                required


                                class="appearance-none bg-transparent border-none w-full text-white mr-3 py-2  placeholder-gray-200 px-2 leading-tight focus:outline-none" type={show ? "text" : "password"}
                                placeholder="Enter New Password" aria-label="Full name" />

                            <button
                                type="button"
                                onClick={() => setshow(!show)}
                                className=""
                            >
                                {show ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-200">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                }
                            </button>

                        </div>
                        <div class="flex items-center border-b border-white-500 mt-4 py-2">
                            <input
                                value={Confirmpassword}
                                onChange={handleConfirmPasswordChange}
                                required


                                class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 placeholder-gray-200 px-2 leading-tight focus:outline-none" type={showConfirm ? "text" : "password"}
                                placeholder="Confirm New Password" aria-label="Full name" />

                            <button
                                type="button"
                                onClick={() => setshowConfirm(!showConfirm)}
                                className=""
                            >
                                {showConfirm ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>

                                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-200">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                }
                            </button>

                        </div>

                    </div>
                    <div className="p-2">
                    {error && (
                        <div class="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 " role="alert">
                        <svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span class="sr-only">Info</span>
                        <div>
                          <span class="font-medium"> alert!</span> {error}
                        </div>
                      </div>
                    )}
                    </div>
                    <div className="flex justify-center mb-4">
                        <button
                            type="submit"
                            className="w-auto px-2 py-2 text-xs  flex justify-center mt-8 text-white bg-[#15e6cd] border border-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
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
                                                                " Create New Password"
                                                            )}

                           

                        </button>
                    </div>
                    </form>

                </div>



            </div>




            {/* Left Content */}


            {/* Right Content */}


            <ToastContainer autoClose={2000} hideProgressBar={true} theme="colored" />
        </div>
    );
}

export default NewPassword;
