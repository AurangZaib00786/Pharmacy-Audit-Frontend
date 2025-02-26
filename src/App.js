import "./App.css";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useauthcontext";
import Layout from "./Pages/home";
import User from "./Components/users/User";
import Login from "./Pages/login";
import Dashboard from "./Components/dashboard/dashboard";
import SignUp from "./Pages/signup";
import { UseaddheaderContext } from "./hooks/useaddheadercontext";
import Audit from "./Components/audit/audit";
import Fileformat from "./Components/file-format/file-format";
import Insurance from "./Components/insurance/insurance";
import Bin from "./Components/bin/bin";
import Insurancereport from "./Components/insurancereport/insurancereport";
import BillingFileformat from "./Components/billing-format/file-format";
import AuditDetails from "./Components/audit details/auditdetails";
import HomePage from "./Pages/HomePage";
import GroupsandPermissions from "./Components/groups/GroupsandPermissions";
import Support from "./Components/support/Support";
import jwtDecode from "jwt-decode";
import NoPage from "./Pages/NoPage";


function Routing() {
  const { user } = useAuthContext();
  const {  current_user } = UseaddheaderContext();


  console.log(current_user)





  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={!user ? <Login /> : <Navigate to={"/home"} />}
            ></Route>
            <Route
              path="/sign-up"
              element={!user ? <SignUp /> : <Navigate to={"/home"} />}
            ></Route>

            <Route
              path="/user"
              element={
                user ? (
                  current_user?.permissions.includes("can_view_users") ? (
                    <User />
                  ) : (
                    <Navigate to={"/no-access"} />

                    
                  )
                ) : (
                  <Navigate to={"/"} />
                )
              }
              // element={user ? <User /> : <Navigate to={"/"} />}
            ></Route>

            <Route
              path="/groups-permissions"
              element={
                user ? (
                  // current_user?.permissions.includes("can_view_groups_permissions") ? (
                    <GroupsandPermissions />
                  // ) : (
                    // <Navigate to={"/no-access"} />

                    
                  // )
                ) : (
                  <Navigate to={"/"} />
                )
              }
              // element={user ? <GroupsandPermissions /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/bin"
              element={
                user ? (
                  // current_user?.permissions.includes("can_view_bin_number") ? (
                    <Bin />
                  // ) : (
                    // <Navigate to={"/no-access"} />

                    
                  // )
                ) : (
                  <Navigate to={"/"} />
                )
              }

              // element={user ? <Bin /> : <Navigate to={"/"} />}
            ></Route>
            {/* <Route
              path="/insurance-report"
              element={user ? <Insurancereport /> : <Navigate to={"/"} />}
            ></Route> */}
            <Route
              path="/insurance"
              element={
                user ? (
                  // current_user?.permissions.includes("can_view_insurance_company") ? (
                    <Insurance />
                  // ) : (
                    // <Navigate to={"/no-access"} />

                    
                  // )
                ) : (
                  <Navigate to={"/"} />
                )
              }
              // element={user ? <Insurance /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/audit"
              element={
                user ? (
                  // current_user?.permissions.includes("can_view_reports") ? (
                    <Audit />
                  // ) : (
                    // <Navigate to={"/no-access"} />

                    
                  // )
                ) : (
                  <Navigate to={"/"} />
                )
              }
              // element={user ? <Audit /> : <Navigate to={"/"} />}
            ></Route>

            {/* <Route
              path="/audit-details"
              element={user ? <AuditDetails /> : <Navigate to={"/"} />}
            ></Route> */}
            <Route
              path="/vendor-file-format"
              element={
                user ? (
                  // current_user?.permissions.includes("can_view_vendor_file_formate") ? (
                    <Fileformat />
                  // ) : (
                    // <Navigate to={"/no-access"} />

                    
                  // )
                ) : (
                  <Navigate to={"/"} />
                )
              }
              // element={user ? <Fileformat /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/billing-file-format"
              element={
                user ? (
                  // current_user?.permissions.includes("can_view_billing_file_formate") ? (
                    <BillingFileformat />
                  // ) : (
                    // <Navigate to={"/no-access"} />

                    
                  // )
                ) : (
                  <Navigate to={"/"} />
                )
              }
              // element={user ? <BillingFileformat /> : <Navigate to={"/"} />}
            ></Route>
             <Route
            path="/home"
            element={user ? <HomePage /> : <Navigate to={"/"} />}
          ></Route>

          <Route
            path="/support"
            element={user ? <Support /> : <Navigate to={"/"} />}
          ></Route>


          </Route>

          
          
         
         

          <Route path="*" element={<Navigate to={"/"} />}></Route>
          <Route path="/no-access" element={<NoPage  />}></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default Routing;
