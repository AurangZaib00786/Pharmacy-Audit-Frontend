import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useauthcontext';
import Layout from '../../Pages/home';
import Login from '../../Pages/login';
import SignUp from '../../Pages/signup';
import User from '../users/User';
import GroupsandPermissions from '../groups/GroupsandPermissions';
import { UseaddheaderContext } from '../../hooks/useaddheadercontext';
import Bin from '../bin/bin';
import Insurance from '../insurance/insurance';
import Audit from '../audit/audit';
import Fileformat from '../file-format/file-format';
import BillingFileformat from '../billing-format/file-format';
import HomePage from '../../Pages/HomePage';
import Support from '../support/Support';
import Header from '../header';

const AppRouting = () => {
      const { user } = useAuthContext();

    
  return (
    <div className=''>    
        {/* <Header/> */}
          <Routes>
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
              element={user ? <User /> : <Navigate to={"/"} />}
            ></Route>

              <Route
              path="/groups-permissions"
              element={user ? <GroupsandPermissions /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/bin"
              element={user ? <Bin /> : <Navigate to={"/"} />}
            ></Route>
            {/* <Route
              path="/insurance-report"
              element={user ? <Insurancereport /> : <Navigate to={"/"} />}
            ></Route> */}
            <Route
              path="/insurance"
              element={user ? <Insurance /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/audit"
              element={user ? <Audit /> : <Navigate to={"/"} />}
            ></Route>
           
            {/* <Route
              path="/audit-details"
              element={user ? <AuditDetails /> : <Navigate to={"/"} />}
            ></Route> */}
            <Route
              path="/vendor-file-format"
              element={user ? <Fileformat /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/billing-file-format"
              element={user ? <BillingFileformat /> : <Navigate to={"/"} />}
            ></Route>
            
          <Route
              path="/home"
              element={user ? <HomePage /> : <Navigate to={"/"} />}
            ></Route>

<Route
              path="/support"
              element={user ? <Support /> : <Navigate to={"/"} />}
            ></Route>

          <Route path="*" element={<Navigate to={"/"} />}></Route>
        </Routes>
      
    </div>
  )
}

export default AppRouting
