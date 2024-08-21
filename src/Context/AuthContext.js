import { useReducer, createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload,
        menu_status: state.menu_status,
      };
    case "LOGOUT":
      return {
        user: null,
        menu_status: "dashboard",
      };

    case "Set_menuitem":
      return {
        menu_status: action.payload,
        user: state.user,
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const user_token = JSON.parse(localStorage.getItem("user"));
  if (user_token) {
    var uservalue = user_token;
  } else {
    uservalue = null;
  }
  // https://api.pharmacyauditpro.com
  const [state, dispatch_auth] = useReducer(authReducer, {
    user: uservalue,
    menu_status: "dashboard",
  });
  const [route, setroute] = useState("http://127.0.0.1:8000");

  return (
    <AuthContext.Provider value={{ ...state, dispatch_auth, route, setroute }}>
      {children}
    </AuthContext.Provider>
  );
};
