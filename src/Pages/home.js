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
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import { Link } from "react-router-dom";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { useAuthContext } from "../hooks/useauthcontext";
import Header from "../Components/header";
import Footer from "../Components/footer";
import ApartmentIcon from "@material-ui/icons/Apartment";
import { UseaddheaderContext } from "../hooks/useaddheadercontext";
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";
import jwtDecode from "jwt-decode";
import useLogout from "../hooks/uselogout";
import ArchiveIcon from "@material-ui/icons/Archive";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import ReplayIcon from "@material-ui/icons/Replay";

function Layout() {
  const { user, route, menu_status } = useAuthContext();

  const { collapseSidebar, toggleSidebar, broken, collapsed } = useProSidebar();
  const { logout } = useLogout();
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
      style={{ zoom: user ? ".7" : "1" }}
    >
      {user ? (
        <>
          <Sidebar
            breakPoint="md"
            defaultCollapsed={true}
            rootStyles={{ color: "#fbfbfb" }}
            backgroundColor="#003049"
          >
            <div
              style={{
                textAlign: "center",
                borderBottom: "1px solid #dee2e6",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar
                className="mt-1 mb-1 ms-3 me-4"
                src={selected_branch?.logo}
              />
              {current_user && <h5>{current_user.username}</h5>}
            </div>
            <Menu
              onMouseEnter={handlemouseenter}
              onMouseLeave={handlemouseleave}
              closeOnClick={true}
              className="sidebarclass"
              style={{ height: "134vh", overflow: "auto" }}
              menuItemStyles={{
                button: ({ level, active, disabled }) => {
                  if (level === 0 || level === 1) {
                    return {
                      color: active ? "#DA251C" : undefined,
                      "&:hover": {
                        backgroundColor: "#DA251C !important",
                        color: "#fbfbfb !important",
                        borderRadius: "8px !important",
                        fontWeight: "bold !important",
                      },
                    };
                  }
                },
              }}
            >
              {/* <MenuItem
                active={menu_status === "dashboard"}
                icon={<DashboardIcon />}
                onClick={() => handleopen("dashboard")}
                component={<Link to="/dashboard" />}
              >
                Dashboard
              </MenuItem> */}

              <MenuItem
                active={menu_status === "user"}
                icon={<PersonIcon />}
                component={<Link to="/user" />}
                rootStyles={{
                  color: "#fbfbfb",
                  backgroundColor: "#003049",
                }}
              >
                User
              </MenuItem>

              {/* <SubMenu
                active={menu_status === "user"}
                open={open === "user"}
                onClick={() => handleopen("user")}
                label="Basic Menu"
                icon={<MenuIcon />}
              >
                <MenuItem
                  active={menu_status === "user"}
                  icon={<PersonIcon />}
                  component={<Link to="/user" />}
                  rootStyles={{
                    color: "#fbfbfb",
                    backgroundColor: "#003049",
                  }}
                >
                  User
                </MenuItem>
              </SubMenu> */}
            </Menu>
          </Sidebar>

          <div className="content" style={{ width: "95%" }}>
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
            {/* {user && (
              <>
                {!selected_branch && (
                  <h6
                    className="text-center text-danger m-0"
                    style={{ backgroundColor: "rgb(241, 245, 245)" }}
                  >
                    {" "}
                    Please select Project first !!
                  </h6>
                )}
              </>
            )} */}
            <div
              style={{
                height: "122vh",
                overflow: "auto",
                backgroundColor: "rgb(241, 245, 245)",
              }}
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
