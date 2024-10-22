import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProSidebarProvider } from "react-pro-sidebar";
import { useAuthContext } from "./hooks/useauthcontext";
import Layout from "./Pages/home";
import User from "./Components/users/User";
import Login from "./Pages/login";
import Dashboard from "./Components/dashboard/dashboard";
import SignUp from "./Pages/signup";
import Audit from "./Components/audit/audit";
import Fileformat from "./Components/file-format/file-format";
import Insurance from "./Components/insurance/insurance";
import Bin from "./Components/bin/bin";
import Insurancereport from "./Components/insurancereport/insurancereport";
import BillingFileformat from "./Components/billing-format/file-format";

function Routing() {
  const { user } = useAuthContext();

  return (
    <BrowserRouter>
      <ProSidebarProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={!user ? <Login /> : <Navigate to={"/audit"} />}
            ></Route>
            <Route
              path="/sign-up"
              element={!user ? <SignUp /> : <Navigate to={"/audit"} />}
            ></Route>

            <Route
              path="/user"
              element={user ? <User /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/bin"
              element={user ? <Bin /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/insurance-report"
              element={user ? <Insurancereport /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/insurance"
              element={user ? <Insurance /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/audit"
              element={user ? <Audit /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/vendor-file-format"
              element={user ? <Fileformat /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/billing-file-format"
              element={user ? <BillingFileformat /> : <Navigate to={"/"} />}
            ></Route>
          </Route>

          <Route path="*" element={<Navigate to={"/"} />}></Route>
        </Routes>
      </ProSidebarProvider>
    </BrowserRouter>
  );
}

export default Routing;
