import React from 'react'
import { toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const success_toast=()=>{
    toast.success("Save  Successfully !", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,

      });
}


export default success_toast