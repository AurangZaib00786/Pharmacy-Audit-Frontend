import React from 'react'
import { toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const custom_toast=(msg)=>{
    toast.success(`${msg}  Successfully !`, {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,

      });
}


export default custom_toast