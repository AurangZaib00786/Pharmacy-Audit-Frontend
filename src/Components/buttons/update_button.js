import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'

function Update_button(props) {
  return (
    <Button  type='submit' variant='outline-primary' >{props.isloading && <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />}<FontAwesomeIcon icon={faRotate} />  Update</Button>
  )
}

export default Update_button