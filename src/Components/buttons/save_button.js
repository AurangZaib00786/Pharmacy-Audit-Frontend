import React from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import SaveIcon from "@material-ui/icons/Save";

function Save_button(props) {
  return (
    <Button type="submit" variant="primary" style={{ borderRadius: "33px" }}>
      {props.isloading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      )}
      <SaveIcon /> Save
    </Button>
  );
}

export default Save_button;
