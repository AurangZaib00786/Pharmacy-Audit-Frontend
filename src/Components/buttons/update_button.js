import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

function Update_button(props) {
  return (
    <button type="submit" className=" w-full rounded border-2 py-1.5 hover:bg-[#15e6cd] hover:text-white hover:border-2 hover:border-white border-black" >
      {props.isloading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      )}
      <FontAwesomeIcon icon={faRotate} /> Update
    </button>
  );
}

export default Update_button;
