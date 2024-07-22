import React from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";

function Widget({ name, icon_widget, link, color, text_1, text_2 }) {
  return (
    <div className="card border-0">
      <div
        className=" card-body p-2 d-flex justify-content-start "
        style={{ height: "85px" }}
      >
        <div
          className="icon text-white d-flex justify-content-center align-items-center"
          style={{ backgroundColor: `${color}` }}
        >
          {icon_widget}
        </div>

        <div className="ms-3 d-flex flex-column justify-content-between">
          <Link to={link}>
            <h6
              className="text-dark m-0  bordered-0"
              style={{ textDecoration: "none" }}
            >
              {name}
            </h6>
          </Link>
          <div className="mt-2">
            <strong className="text-dark">{text_1}</strong>
            <br />
            <strong className="text-dark">{text_2}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Widget;
