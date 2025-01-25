import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAuthContext } from "../../hooks/useauthcontext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "react-bootstrap/Spinner";

const Alert_before_delete = ({ show, onHide, url, dis_fun, row_id }) => {
  const { user } = useAuthContext();
  const [loading, setloading] = useState(false);

  const toasts_error = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
    });
  };

  const handel_ok = async () => {
    setloading(true);

    const response = await fetch(`${url}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.access}`,
      },
    });

    if (response.ok) {
      setloading(false);
      onHide();
      dis_fun(row_id);
    }
    if (!response.ok) {
      setloading(false);
      toasts_error("Error while Deleting the files. Try Again");
    }
  };

  return (
    <Modal
    show={show}
    onHide={onHide}
    size="md"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    dialogClassName="custom-modal"
  >

      <Modal.Body className="p-2">
        <div className="flex justify-center mt-2">Are you sure you want to clear all the records?</div>
        <div className="flex justify-center items-center mt-4 mb-2 gap-4">
          <button className="border-2 px-2 py-1 flex justify-center items-center gap-2 rounded border-red-400 text-red-400  shadow bg-white " onClick={handel_ok}>
            {loading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>

            Clear
          </button>
          <button
            className="border-2 px-2 py-1 flex justify-center items-center gap-2 rounded border-gray-500  shadow bg-white text-black"
            onClick={onHide}
          >

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>

            Cancel
          </button>
        </div>
      </Modal.Body>


    </Modal>
  );
};

export default Alert_before_delete;
