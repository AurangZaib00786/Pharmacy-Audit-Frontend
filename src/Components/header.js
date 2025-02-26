import React, { useState, useRef, useEffect } from "react";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import MenuIcon from "@material-ui/icons/Menu";
import { IconButton, Avatar } from "@material-ui/core";
import "../Pages/home.css";
import "./header.css";
import Dropdown from "react-bootstrap/Dropdown";
import { useAuthContext } from "../hooks/useauthcontext";
import { UseaddheaderContext } from "../hooks/useaddheadercontext";
import jwtDecode from "jwt-decode";
import useLogout from "../hooks/uselogout";
import custom_toast from "./alerts/custom_toast";
import Userupdate from "./users/userupdateform";
import logo from '../assets/logo.png';
import profile from '../assets/profile.png';
import GlobalBackTab from "./GlobalBackTab";
import { Link } from "react-router-dom";
function Header(props) {
  const { user, route, dispatch_auth } = useAuthContext();
  const { selected_branch, current_user, dispatch } = UseaddheaderContext();
  const [show, setshow] = useState(false);
  const [target, setTarget] = useState(null);
  const [allremainders, setallremainders] = useState([]);
  const [showmodelupdate, setshowmodelupdate] = useState(false);
  const ref = useRef(null);
  const { logout } = useLogout();

  const decodedToken = jwtDecode(user.access);
  const userId = decodedToken.user_id;

  useEffect(() => {
    const refreshtoken = async () => {
      const refresh_token = user.refresh;
      const response = await fetch(`${route}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refresh: user.refresh,
        }),
      });
      const json = await response.json();

      if (!response.ok) {
        logout();
      }

      if (response.ok) {
        json["refresh"] = refresh_token;
        localStorage.setItem("user", JSON.stringify(json));
        dispatch_auth({ type: "LOGIN", payload: json });
      }
    };

    const timer = setInterval(refreshtoken, 1000 * 60 * 29.8);
    return () => {
      clearInterval(timer); // Clean up the timer on component unmount
    };
  }, []);

  useEffect(() => {
    const getuser = async () => {
      const response = await fetch(`${route}/api/users/${userId}/`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();
      if (!response.ok) {
      }

      if (response.ok) {
        getpermission(json);
        // dispatch({ type: "Set_Current_user", payload: json });
      }
    };
    getuser();
  }, []);

  const getpermission = async (input) => {
    var url = `${route}/api/user-permissions/${input.id}/`;

    const response = await fetch(`${url}`, {
      headers: { Authorization: `Bearer ${user.access}` },
    });
    const json = await response.json();
    if (!response.ok) {
    }

    if (response.ok) {
      dispatch({
        type: "Set_Current_user",
        payload: { ...input, permissions: json.permissions },
      });
    }
  };
  // console.log("user logged in", current_user)
  // useEffect(() => {
  //   const getproject = async () => {
  //     var url = `${route}/api/projects/${current_user.projects_list[0].id}/`;

  //     const response = await fetch(`${url}`, {
  //       headers: { Authorization: `Bearer ${user.access}` },
  //     });
  //     const json = await response.json();
  //     if (!response.ok) {
  //     }

  //     if (response.ok) {
  //       localStorage.setItem("selected_branch", JSON.stringify(json));
  //       dispatch({ type: "Set_selected_branch_first", payload: json });
  //     }
  //   };
  //   if (current_user && !selected_branch) {
  //     getproject();
  //   }
  // }, [current_user]);

  const handlestate = (event) => {
    setshow(!show);
    setTarget(event.target);
  };

  const handlecollapsefun = () => {
    props.collapsefun();
    props.statefun();
  };

  const handledropdown = async (e) => {
    const obj = current_user.projects_list.filter((item) => {
      return item.name === e.target.innerText;
    });
    const response = await fetch(`${route}/api/projects/${obj[0].id}/`, {
      headers: { Authorization: `Bearer ${user.access}` },
    });
    const json = await response.json();
    if (!response.ok) {
    }

    if (response.ok) {
      localStorage.setItem("selected_branch", JSON.stringify(json));
      dispatch({ type: "Set_selected_branch_first", payload: json });
    }
  };

  // useEffect(() => {
  //   const notificationstatus = async () => {
  //     const response = await fetch(
  //       `${route}/api/customer-messages-reminder/?user_id=${
  //         current_user?.id
  //       }&status=pending&date=${new Date().toISOString().substring(0, 10)}`,
  //       {
  //         headers: { Authorization: `Bearer ${user.access}` },
  //       }
  //     );
  //     const json = await response.json();

  //     if (!response.ok) {
  //     }

  //     if (response.ok) {
  //       if (json.length > 0) {
  //         setallremainders(json);
  //         setshownotification(true);
  //       }
  //     }
  //   };

  //   const timer = setInterval(notificationstatus, 1000 * 60 * 10);
  //   notificationstatus();
  //   return () => {
  //     clearInterval(timer); // Clean up the timer on component unmount
  //   };
  // }, [current_user]);

  const [isOpen, setIsOpen] = useState(false);


  return (
  
    <div className=" w-full pt-16 h-auto ">
   <div className="top-container p-2 flex justify-between w-full h-22 relative">
      {/* Logo Section */}
      <Link to="/">
      <div className="top-container-inner w-64 h-full flex justify-start items-center">
        <img src={logo} alt="Logo" className="h-12 w-auto" />
      </div></Link>

      {/* Profile Section */}
      <div className="relative">
      <div
  className="top-container-inner w-32 flex justify-center items-center h-full cursor-pointer"
  onClick={() => setIsOpen(!isOpen)}
>
 
    <div
      className="h-12 w-12 flex justify-center items-center rounded-full text-white font-semibold text-lg"
      style={{ backgroundColor: "#15E6CD" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
</svg>

    </div>
</div>


        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
            <ul className="py-2 text-gray-700">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setshowmodelupdate(true);
                  setshow(false);
                }}
              >
                Profile
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={logout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>

    {/* <div className="d-flex justify-content-between header"> */}
      {/* {props.broken ? (
        <IconButton onClick={() => props.togglefun()}>
          <MenuIcon />
        </IconButton>
      ) : (
        <IconButton onClick={handlecollapsefun}>
          <MenuIcon />
        </IconButton>
      )}
      <div className="d-flex align-items-center  ">
        {selected_branch && (
          <span className="fw-bold">{selected_branch.name}</span>
        )}
        {current_user && (
          <Dropdown className="me-3">
            <Dropdown.Toggle split variant="" />

            <Dropdown.Menu>
              {current_user.projects_list?.map((item) => (
                <Dropdown.Item key={item.id} onClick={handledropdown}>
                  {item.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}

        <div
          ref={ref}
          onClick={handlestate}
          className="cursor-pointer d-flex align-items-center header_right pb-1 me-3 ps-1"
        >
          <Avatar className="mt-1" src={selected_branch?.logo} />
          <h6 className="mt-2 me-5 ms-4 fw-bold">
            {current_user?.username?.toUpperCase()}
          </h6>
        </div> 
      </div> */}
{/* 
       <Overlay
        show={show}
        target={target}
        placement="bottom"
        container={ref}
        containerPadding={20}
        rootClose
        onHide={() => setshow(false)}
      >
        <Popover id="popover-contained" className="pop_over">
          <Popover.Header className="bg-primary pop_over_header">
            <>
              <Avatar style={{ width: "50px", height: "50px" }} />
              <p className="mt-2 text-white">{current_user?.username}</p>
            </>
          </Popover.Header>
          <Popover.Body>
            <div className="row ">
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="border"
                  onClick={() => {
                    setshowmodelupdate(true);
                    setshow(false);
                  }}
                >
                  Profile
                </button>

                <button type="button" className="border" onClick={logout}>
                  Signout
                </button>
              </div>
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>  */}

      {showmodelupdate && (
        <Userupdate
          show={showmodelupdate}
          onHide={() => setshowmodelupdate(false)}
          data={current_user}
          fun={custom_toast}
        />
      )}
    </div>
    // </div>
  );
}

export default Header;
