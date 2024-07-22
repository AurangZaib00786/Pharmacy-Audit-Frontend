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
import ForgetPassword from "./Pages/forget-password";

function Routing() {
  const { user } = useAuthContext();

  return (
    <BrowserRouter>
      <ProSidebarProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={!user ? <Login /> : <Navigate to={"/user"} />}
            ></Route>
            <Route
              path="/sign-up"
              element={!user ? <SignUp /> : <Navigate to={"/user"} />}
            ></Route>
            <Route
              path="/forget-password"
              element={!user ? <ForgetPassword /> : <Navigate to={"/user"} />}
            ></Route>
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/user"
              element={user ? <User /> : <Navigate to={"/"} />}
            ></Route>
          </Route>

          <Route path="*" element={<Navigate to={"/"} />}></Route>
        </Routes>
      </ProSidebarProvider>
    </BrowserRouter>
  );
}

export default Routing;
