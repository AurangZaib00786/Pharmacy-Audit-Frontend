import React, { useState, useEffect, useMemo } from "react";
import "./home.css";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
} from "react-pro-sidebar";
import { Outlet } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import PersonIcon from "@material-ui/icons/Person";
import DashboardIcon from "@material-ui/icons/Dashboard";
import StoreIcon from "@material-ui/icons/Store";
import ColorizeIcon from "@material-ui/icons/Colorize";
import { Link } from "react-router-dom";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { useAuthContext } from "../hooks/useauthcontext";
import Header from "../Components/header";
import Footer from "../Components/footer";
import MoneyIcon from "@material-ui/icons/Money";
import { UseaddheaderContext } from "../hooks/useaddheadercontext";
import BusinessIcon from "@material-ui/icons/Business";
import jwtDecode from "jwt-decode";
import useLogout from "../hooks/uselogout";
import TableChartIcon from "@material-ui/icons/TableChart";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import GlobalBackTab from "../Components/GlobalBackTab";
function Layout() {
  const { user, route, menu_status } = useAuthContext();

  const { collapseSidebar, toggleSidebar, broken, collapsed } = useProSidebar();

  const { selected_branch, current_user } = UseaddheaderContext();
  const [check_collapse, setcheck_collapse] = useState(true);
  const [open, setopen] = useState("");
  // useEffect(() => {
  //   const getuser = async () => {
  //     const decodedToken = jwtDecode(user.access);
  //     const userId = decodedToken.user_id;
  //     const response = await fetch(
  //       `${route}/api/users/${userId}/assign-permission/`,
  //       {
  //         headers: { Authorization: `Bearer ${user.access}` },
  //       }
  //     );
  //     const json = await response.json();
  //     if (json.code === "token_not_valid") {
  //       logout();
  //     }

  //     if (response.ok) {
  //     }
  //   };

  //   if (user) {
  //     getuser();
  //   }
  // }, [user]);

  const handlemouseleave = () => {
    if (check_collapse && !collapsed) {
      collapseSidebar();
    }
  };

  const handlemouseenter = () => {
    if (check_collapse && collapsed) {
      collapseSidebar();
    }
  };

  const handleopen = (e) => {
    if (e === open) {
      setopen("null");
    } else {
      setopen(e);
    }
  };

  return (
    <div
      id="app"
      className={user && "d-flex "}
      style={{ zoom: user ? "0.8" : "1" }}
    >
      {user ? (
        <>


          <div className=" home-container   lg:px-24 " style={{ width: "100%" }}>
            <div className="header ">
              {user && (
                <Header
                  togglefun={toggleSidebar}
                  collapsefun={collapseSidebar}
                  broken={broken}
                  statefun={() => setcheck_collapse(!check_collapse)}
                />
              )}
            </div>
            {/* <GlobalBackTab /> */}


            <div
              style={{
                height: "105vh",
                overflow: "auto",
                backgroundColor: "transparent",
                scrollbarWidth: "thin", // For Firefox

                scrollbarColor: "#1ccad8 #f0f0f0", // Thumb and track color for Firefox
              }}
              className="mt-6 custom-scrollbar"
            >
              <Outlet />
            </div>

            <div className="footer">{user && <Footer />}</div>
          </div>
        </>
      ) : (
        <div>
          <Outlet />
        </div>
      )}
    </div>
  );
}

export default Layout;
