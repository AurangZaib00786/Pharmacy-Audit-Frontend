import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.png';
import profile from '../assets/profile.png';
import "./home.css";
import calender from '../assets/icons/cal2.png';
import call from '../assets/icons/call2.png';
import vendorIcon from '../assets/icons/file.png';
import vendorImage from '../assets/icons/fileimg.png';
import billingIcon from '../assets/icons/recp.png';
import billingImage from '../assets/icons/receipt.png';
import binIcon from '../assets/icons/qr.png';
import userIcon from '../assets/icons/user.png';
import securityIcon from '../assets/icons/sec.png';
import binImage from '../assets/icons/qr-code.png';
import InsuranceIcon from '../assets/icons/insu.png';
import { useAuthContext } from "../hooks/useauthcontext";
import { UseaddheaderContext } from "../hooks/useaddheadercontext";
import InsuranceImage from '../assets/icons/insurance.png';
import reportsIcon from '../assets/icons/repo.png';
import reportsImage from '../assets/icons/reports.png';
import supportIcon from '../assets/icons/sup.png';
import contactIcon from '../assets/icons/contact-icon.png';
import supportImage from '../assets/icons/support.png';
import userImage from '../assets/icons/team.png';
import reportHistory from '../assets/icons/history.png';
import securityImage from '../assets/icons/security.png';
import contactImage from '../assets/icons/contact-book.png';
import { Link } from 'react-router-dom';
import Header from '../Components/header';



const HomePage = (props) => {
    const { user, route, dispatch_auth } = useAuthContext();
    const { selected_branch, current_user, dispatch } = UseaddheaderContext();
    const [countdown, setCountdown] = useState(null);
    const [showBanner, setShowBanner] = useState(true);

    useEffect(() => {
        if (current_user?.profile?.package === "Free" && current_user?.profile?.created_date) {
            const startTime = new Date(current_user.profile.created_date);
            const endTime = new Date(startTime.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days

            const updateCountdown = () => {
                const now = new Date();
                const diff = endTime - now;

                if (diff <= 0) {
                    setCountdown("00d 00h 00m 00s");
                    return;
                }

                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / 1000 / 60) % 60);
                const seconds = Math.floor((diff / 1000) % 60);

                setCountdown(
                    `${days.toString().padStart(2, "0")}d ${hours
                        .toString()
                        .padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds
                            .toString()
                            .padStart(2, "0")}s`
                );
            };

            updateCountdown(); // Set initially
            const interval = setInterval(updateCountdown, 1000);

            return () => clearInterval(interval);
        }
    }, [current_user]);


    const isTrialExpired = countdown === "00d 00h 00m 00s";


    // if (current_user?.profile?.package !== "Free") return null;


    return (
        <div>

            <div className="home-container w-full lg:p-6 lg:px-16 h-auto ">
                {current_user?.profile?.package === "Free" && countdown && (
                    <div className="w-full p-4 bg-red-400 text-white font-semibold text-center rounded">
                        Your free trial for 14 days has started now. Time left:
                        <span className="font-bold mx-2">{countdown}</span>
                    </div>
                )}


                {/* <div className='top-container p-2 flex justify-between w-full  h-22'>
                    <div className='top-container-inner w-64 h-full flex justify-start items-center '>
                        <img src={logo} />
                    </div>
                    <div className='top-container-inner w-32 flex justify-center items-center h-full '>
                        <img src={profile} />
                    </div>
                </div> */}
                <Header />
                {/* <div className="search-container p-2  flex justify-start w-full h-24">
                    <div className="input-container-inner  w-1/2 h-full flex justify-start items-center">
                        <form className="w-full">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    id="voice-search"
                                    className="text-black text-sm rounded-lg focus:outline-none w-full p-2.5 border-2 border-green-200 bg-transparent placeholder-gray-600 "
                                    placeholder="Search"
                                    required
                                />
                                <button type="button" className="absolute inset-y-0 end-0 flex items-center pe-3">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div> */}
                <div className="search-container md:gap-8 mt-8  md:flex p-2 justify-start w-full md:h-48">
                    <div className="child-container-inner-1  bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] border-2 border-green-200 rounded-lg md:w-1/2 h-full ">
                        {/* Content for the first child */}
                        <div className='w-full  mt-3 mx-3 '>

                            <h5 className=''>Recent activities</h5>
                        </div>
                        <div className='w-full mx-3 '>
                            <div className='flex gap-2 '>
                                <img className='w-6 h-6' src={calender} />

                                <span className='text-lg    '>Sent payment</span><br></br>
                            </div>
                            <span className='text-xs  ml-8   '><span className='font-semibold text-gray-600'>Jessy Johnson </span><span className='text-gray-500'>sent a payment.</span></span>
                        </div>
                        <div className='w-full  mx-3 mt-2 '>
                            <div className='flex gap-2 '>
                                <img className='w-6 h-6' src={call} />

                                <span className='text-lg    '>Meeting about the contract</span><br></br>
                            </div>
                            <span className='text-xs  ml-8   '><span className='font-semibold text-gray-600'>John Doe  </span><span className='text-gray-500'>google meets.</span></span>
                        </div>
                    </div>
                    <div className="child-container-inner-2   border-2 border-green-200 bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] rounded-lg md:w-1/2 h-full ">
                        <div className='w-full  mt-4 mx-3 '>

                            <h5 className=''>Overview</h5>
                        </div>
                        <div className='w-full flex mt-6'>
                            <div className='w-1/2 '>
                                <div className='flex gap-2  justify-center items-center'>
                                    <div className='text-xl w-2 h-2 rounded-full bg-green-400   '></div>
                                    <span className='text-sm    '>Total Vendors</span>
                                </div>
                                <div className='flex mt-2 justify-center items-center'>
                                    <h4>28</h4>
                                </div>

                            </div>
                            <div className='w-1/2 '>
                                <div className='flex gap-2  justify-center items-center'>
                                    <div className='text-xl w-2 h-2 rounded-full bg-blue-400   '></div>
                                    <span className='text-sm    '>Billing Files</span>
                                </div>
                                <div className='flex mt-2 justify-center items-center'>
                                    <h4>35</h4>
                                </div>

                            </div>
                            <div className='w-1/2 '>
                                <div className='flex gap-2  justify-center items-center'>
                                    <div className='text-xl w-2 h-2 rounded-full bg-red-400   '></div>
                                    <span className='text-sm    '>Reports Generated</span>
                                </div>
                                <div className='flex mt-2 justify-center items-center'>
                                    <h4>30</h4>
                                </div>

                            </div>


                        </div>
                    </div>
                </div>

                <div className="search-container grid md:grid-cols-4  gap-8 p-2 mt-4 w-full h-full">
                    {!current_user ? (
                        <div role="status" className="max-w-sm animate-pulse">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) : (!isTrialExpired || current_user?.permissions?.includes("can_view_vendor_file_formate"))  && (
                        <Link to="/vendor-file-format">
                            <div className="child-container-inner-1 group cursor-pointer hover:shadow-xl bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] border-2 border-green-200 rounded-lg h-44">
                                <div className="w-full mt-3 flex justify-between items-center px-2">
                                    <span className="text-lg text-gray-600">Vendor file format</span>
                                    <img className="w-8 h-8" src={vendorIcon} alt="Vendor Icon" />
                                </div>
                                <div className="w-full mx-3">
                                    <span className="text-xs text-gray-500">
                                        Manage vendor file format <br /> add, view, edit, or delete records.
                                    </span>
                                </div>
                                <div className="w-full flex justify-center">
                                    <img
                                        className="w-32 h-20 transform transition-transform duration-300 group-hover:translate-y-[-10px]"
                                        src={vendorImage}
                                        alt="Vendor"
                                    />
                                </div>
                            </div>
                        </Link>
                    )  
                    }


                    {!current_user ? (
                        <div role="status" className="max-w-sm animate-pulse">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) : (!isTrialExpired || current_user?.permissions?.includes("can_view_billing_file_formate"))  && (
                        <Link to="/billing-file-format">
                            <div className="child-container-inner-1 group cursor-pointer hover:shadow-xl bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] border-2 border-green-200 rounded-lg h-44">
                                <div className="w-full mt-3 flex justify-between items-center px-2">
                                    <span className="text-lg text-gray-600">Billing file format</span>
                                    <img className="w-8 h-8" src={billingIcon} alt="Billing Icon" />
                                </div>
                                <div className="w-full mx-3">
                                    <span className="text-xs text-gray-500">
                                        Manage Billing file format <br /> add, view, edit, or delete records.
                                    </span>
                                </div>
                                <div className="w-full flex justify-center">
                                    <img
                                        className="w-20 h-20 transform transition-transform duration-300 group-hover:translate-y-[-10px]"
                                        src={billingImage}
                                        alt="Billing"
                                    />
                                </div>
                            </div>
                        </Link>
                    )  
                    }

                    {!current_user ? (
                        <div role="status" className="max-w-sm animate-pulse">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) : (!isTrialExpired || current_user?.permissions?.includes("can_view_bin_number"))  && (
                        <Link to="/bin">
                            <div className="child-container-inner-1 group cursor-pointer hover:shadow-xl bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] border-2 border-green-200 rounded-lg h-44">
                                <div className="w-full mt-3 flex justify-between items-center px-2">
                                    <span className="text-lg text-gray-600">Bin Number</span>
                                    <img className="w-8 h-8" src={binIcon} alt="Bin Icon" />
                                </div>
                                <div className="w-full mx-3">
                                    <span className="text-xs text-gray-500">
                                        Manage Bin Numbers <br /> add, view, edit, or delete records.
                                    </span>
                                </div>
                                <div className="w-full flex justify-center">
                                    <img
                                        className="w-20 h-20 transform transition-transform duration-300 group-hover:translate-y-[-10px]"
                                        src={binImage}
                                        alt="Bin"
                                    />
                                </div>
                            </div>
                        </Link>
                    )  
                    }

                    {!current_user ? (
                        <div role="status" className="max-w-sm animate-pulse">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) :(!isTrialExpired || current_user?.permissions?.includes("can_view_insurance_company"))
                         && (

                            <Link to="/insurance">
                                <div className="child-container-inner-1 group cursor-pointer hover:shadow-xl bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] border-2 border-green-200 rounded-lg h-44">
                                    <div className="w-full mt-3 flex justify-between items-center px-2">
                                        <span className="text-lg text-gray-600">Insurance company</span>
                                        <img className="w-8 h-8" src={InsuranceIcon} alt="Insurance Icon" />
                                    </div>
                                    <div className="w-full mx-3">
                                        <span className="text-xs text-gray-500">
                                            Manage insurance company details <br /> add, view, edit, or delete records.
                                        </span>
                                    </div>
                                    <div className="w-full flex justify-center">
                                        <img
                                            className="w-24 h-24 transform transition-transform duration-300 group-hover:translate-y-[-10px]"
                                            src={InsuranceImage}
                                            alt="Insurance"
                                        />
                                    </div>
                                </div>
                            </Link>) }

                    {!current_user ? (
                        <div role="status" className="max-w-sm animate-pulse">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) : (
                        (!isTrialExpired || current_user?.permissions?.includes("can_view_users")) && (
                            <Link to="/user">
                                <div className="child-container-inner-1 group cursor-pointer hover:shadow-xl bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] border-2 border-green-200 rounded-lg h-44">
                                    <div className="w-full mt-3 flex justify-between items-center px-2">
                                        <span className="text-lg text-gray-600">Users</span>
                                        <img className="w-8 h-8" src={userIcon} alt="Report Icon" />
                                    </div>
                                    <div className="w-full mx-3">
                                        <span className="text-xs text-gray-500">
                                            Manage Users <br /> add, view, edit, or delete records.
                                        </span>
                                    </div>
                                    <div className="w-full flex justify-center">
                                        <img
                                            className="w-24 h-20 transform transition-transform duration-300 group-hover:translate-y-[-10px]"
                                            src={userImage}
                                            alt="Reports"
                                        />
                                    </div>
                                </div>
                            </Link>
                        )
                    )}


                    {!current_user ? (
                        <div role="status" className="max-w-sm animate-pulse">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) :
                       (!isTrialExpired || current_user?.permissions?.includes("can_view_groups_permissions"))  && (

                            <Link to="/groups-permissions">
                                <div className="child-container-inner-1 group cursor-pointer hover:shadow-xl bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] border-2 border-green-200 rounded-lg  h-44">
                                    <div className="w-full mt-3 flex justify-between items-center px-2">
                                        <span className="text-lg text-gray-600">Groups and Permissions</span>
                                        <img className="w-8 h-8" src={securityIcon} alt="Report Icon" />
                                    </div>
                                    <div className="w-full mx-3">
                                        <span className="text-xs text-gray-500">
                                            Manage Groups and Permission <br /> Allow user to access the features.

                                        </span>
                                    </div>
                                    <div className="w-full flex justify-center">
                                        <img
                                            className="w-24 h-20 transform transition-transform duration-300 group-hover:translate-y-[-10px]"
                                            src={securityImage}
                                            alt="Reports"
                                        />
                                    </div>
                                </div>
                            </Link>) }
                    {!current_user ? (
                        <div role="status" className="max-w-sm animate-pulse">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) :
                        (!isTrialExpired || current_user?.permissions?.includes("can_view_reports")) && (

                            <Link to="/audit">
                                <div className="child-container-inner-1 group cursor-pointer hover:shadow-xl bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] border-2 border-green-200 rounded-lg  h-44">
                                    <div className="w-full mt-3 flex justify-between items-center px-2">
                                        <span className="text-lg text-gray-600">Reports</span>
                                        <img className="w-8 h-8" src={reportsIcon} alt="Report Icon" />
                                    </div>
                                    <div className="w-full mx-3">
                                        <span className="text-xs text-gray-500">
                                            Generate and manage reports <br /> audit, audit detailed & Insurance Reports.

                                        </span>
                                    </div>
                                    <div className="w-full flex justify-center">
                                        <img
                                            className="w-24 h-20 transform transition-transform duration-300 group-hover:translate-y-[-10px]"
                                            src={reportsImage}
                                            alt="Reports"
                                        />
                                    </div>
                                </div>
                            </Link>) }

                        

                            <Link to="/history">
                                <div className="child-container-inner-1 group cursor-pointer hover:shadow-xl bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] border-2 border-green-200 rounded-lg  h-44">
                                    <div className="w-full mt-3 flex justify-between items-center px-2">
                                        <span className="text-lg text-gray-600">Reports History</span>
                                        <img className="w-8 h-8" src={reportsIcon} alt="Report Icon" />
                                    </div>
                                    <div className="w-full mx-3">
                                        <span className="text-xs text-gray-500">
                                        review generated reports, audits, <br />  detailed audits, and insurance reports.

                                        </span>
                                    </div>
                                    <div className="w-full flex justify-center">
                                        <img
                                            className="w-24 h-20 transform transition-transform duration-300 group-hover:translate-y-[-10px]"
                                            src={reportHistory}
                                            alt="Reports"
                                        />
                                    </div>
                                </div>
                            </Link>

                    {current_user && (<Link to="/support">

                        <div className="child-container-inner-1 group cursor-pointer hover:shadow-xl bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] border-2 border-green-200 rounded-lg  h-44">
                            <div className="w-full mt-3 flex justify-between items-center px-2">
                                <span className="text-lg text-gray-600">Support</span>
                                <img className="w-8 h-8" src={supportIcon} alt="Support Icon" />
                            </div>
                            <div className="w-full mx-3">
                                <span className="text-xs text-gray-500">
                                    Lorem ipsum dolor sit <br /> amet consectetur.
                                </span>
                            </div>
                            <div className="w-full flex justify-center">
                                <img
                                    className="w-24 h-24 transform transition-transform duration-300 group-hover:translate-y-[-10px]"
                                    src={supportImage}
                                    alt="Support"
                                />
                            </div>
                        </div>
                    </Link>)}
                    {!current_user ? (
                        <div role="status" className="max-w-sm animate-pulse">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) : (!isTrialExpired || current_user?.permissions?.includes("can_view_contacts"))  && (

                        <Link to="/contacts">

                            <div className="child-container-inner-1 group cursor-pointer hover:shadow-xl bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] border-2 border-green-200 rounded-lg  h-44">
                                <div className="w-full mt-3 flex justify-between items-center px-2">
                                    <span className="text-lg text-gray-600">Contacts</span>
                                    <img className="w-8 h-8" src={contactIcon} alt="Support Icon" />
                                </div>
                                <div className="w-full mx-3">
                                    <span className="text-xs text-gray-500">
                                        Lorem ipsum dolor sit <br /> amet consectetur.
                                    </span>
                                </div>
                                <div className="w-full flex justify-center">
                                    <img
                                        className="w-24 h-24 transform transition-transform duration-300 group-hover:translate-y-[-10px]"
                                        src={contactImage}
                                        alt="Support"
                                    />
                                </div>
                            </div>
                        </Link>)}
                </div>





            </div>
            {/* <h1>Home page</h1> */}

        </div>
    )
}

export default HomePage
