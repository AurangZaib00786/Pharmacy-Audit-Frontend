
import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import GlobalBackTab from "../GlobalBackTab";
import { useAuthContext } from "../../hooks/useauthcontext";
import Header from "../header";
import went_wrong_toast from "../alerts/went_wrong_toast";
import success_toast from "../alerts/success_toast";

function Support() {
    const { user, route } = useAuthContext();   
    const [isloading, setisloading] = useState(false);
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [phone, setphone] = useState("");
    const [message, setmessage] = useState("");
   
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        setisloading(true);
        const response = await fetch(`${route}/api/conatct/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access}`,
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            message,
          }),
        });
        const json = await response.json();
    
        if (!response.ok) {
          setisloading(false);
    
          went_wrong_toast();
        }
    
        if (response.ok) {
          setisloading(false);
          setname("");
          setemail("");
          setphone("");
          setmessage("");
        
          success_toast();
        }
      };
    


    return (
        <div className="home-container w-full lg:p-6 lg:px-16 h-auto">
            <Header></Header>
            <div className="p-1">
                <GlobalBackTab title=" Support" />
            </div>
            <div className=" me-3 flex justify-center mt-3">
                <div className="md:w-2/3 h-96 justify-center login-child-main md:flex">

                    <div style={{ height: "100%" }} className="md:w-1/2  login-form-bg md:ml-28 max-w-md rounde shadow-md">
                        <div className="w-full h-8 flex justify-center items-center   bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe]">
                            <h1 className="text-sm">Contac Us</h1>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 ">
                            <div class="flex items-center border-b border-white-500 py-2">
                                <input
                                    value={name}
                                    onChange={(e) => {
                                      setname(e.target.value);
                                    }}
                                    required class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 placeholder-gray-200 px-2 leading-tight focus:outline-none" type="text" placeholder="Username" aria-label="Full name" />

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-200">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>

                            </div>
                            <div class="flex items-center border-b border-white-500 py-2">
                                <input
                                    value={email}
                                    onChange={(e) => {
                                      setemail(e.target.value);
                                    }}
                                    type="email"
                                    required class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 placeholder-gray-200 px-2 leading-tight focus:outline-none" placeholder="Email" aria-label="Email " />

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-200">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                </svg>


                            </div>
                            <div class="flex items-center border-b border-white-500 py-2">
                                <input
                                    value={phone}
                                    onChange={(e) => {
                                      setphone(e.target.value);
                                    }}
                                    type="number"
                                    required class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 placeholder-gray-200 px-2 leading-tight focus:outline-none" placeholder="Phone" aria-label="Phone " />

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-200">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>



                            </div>
                            <div class="flex items-center border-b border-white-500 py-2">
                                <input
                                    value={message}
                                    onChange={(e) => {
                                      setmessage(e.target.value);
                                    }}
                                    type="textarea"
                                    required class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 placeholder-gray-200 px-2 leading-tight focus:outline-none" placeholder="Message" aria-label="Message " />

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-200">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                                </svg>



                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="w-32 py-2 flex justify-center mt-12 text-white bg-[#15e6cd] border border-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                // disabled={islodding}
                                >

                                    {isloading ? (
                                        <Spinner
                                            className="inline-block mr-2"
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            </div>




                        </form>

                    </div>
                    <div className=" md:w-1/2 md:flex justify-center items-center">


                        <ul className="flex flex-col items-center justify-center gap-4">
                            <li className="text-white items-center gap-2 flex "><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                            </svg>

                                <span><span className="text-gray-400">Phone :</span> <span className="font-bold md:text-white text-sm">0123456789</span> </span></li>
                            <li className="md:text-white gap-2 items-center flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-gray-400 ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>

                                <span><span className="text-gray-400 text-sm ">Email : </span> info@pharmacyauditpro.com</span></li>


                        </ul>

                    </div>




                </div>




                {/* Left Content */}


                {/* Right Content */}





            </div>

        </div>
    );
}

export default Support;

