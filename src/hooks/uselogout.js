import { useState } from "react";
import { useAuthContext } from "./useauthcontext";
import { UseaddheaderContext } from "../hooks/useaddheadercontext";

const useLogout = () => {
  const { dispatch_auth } = useAuthContext();
  const { dispatch } = UseaddheaderContext();
  const logout = () => {
    dispatch({ type: "Set_selected_branch_first", payload: null });
    dispatch({ type: "Set_Current_user", payload: null });
    // remove user from storage
    localStorage.removeItem("user");
    localStorage.removeItem("selected_branch");

    // dispatch logout action

    dispatch_auth({ type: "LOGOUT" });
  };

  return { logout };
};

export default useLogout;
