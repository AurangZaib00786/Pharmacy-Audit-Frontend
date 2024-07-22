import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const went_wrong_toast = (text) => {
  toast.error(text ? text : "Something went Wrong!", {
    position: toast.POSITION.TOP_RIGHT,
    pauseOnHover: false,
  });
};

export default went_wrong_toast;
