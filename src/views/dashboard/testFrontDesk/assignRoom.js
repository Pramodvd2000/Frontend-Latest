// ** React Imports
import { useState } from "react";
import axios from "axios";
// ** Third Party Components
import toast from "react-hot-toast";

import { Check } from "react-feather";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";

import { useNavigate } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {
  Input, Card, Form, Label, Button, CardBody, CardTitle, CardHeader, Modal, ModalBody, ModalHeader, InputGroup, InputGroupText, Row, Col
} from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from 'react';
import Availability from "./availabilityForAssignRoom";
import API_URL from "../../../config";




let Roomarr = []





localStorage.removeItem('id')
localStorage.removeItem('roomno')
const AssignRoom = ({ data1,toggleModal,assignUnassign,toggleCloseAssign, toggleModal2, reservationID }) => {
 


  //console.log(localStorage.getItem['reservationStart'])
  //console.log(localStorage.getItem['reservationEnd'])
  localStorage.setItem('RoomCellID', data1['id'])


  const [roomNumber, setRoomNumber] = useState(localStorage.getItem('id') || '');

  let navigate = useNavigate();

  //console.log(data1['SubBookingId'])
  //console.log(data1['FirstName'] + ' ' + data1['LastName'])
  //console.log(data1['RoomTypeName'])


  const [selectedValue, setSelectedValue] = useState("");
  const [RoomData, setRoomData] = useState("");
  const [assign, setAssign] = useState(false)
  const [RoomCellData, setRoomCellData] = useState('')

  // //console.log(RoomCellData)
  const handleSelectChange = (event) => {
    Roomarr = []
    //console.log("In this function")
    if (event) {
      //console.log("Here")
      setSelectedValue(event.value);
      //console.log(event.value)
      for (let i = 0; i < 1; i++) {
        //console.log(RoomData[event.value])
        for (let j = 0; j < JSON.parse(RoomData[event.value]).length; j++) {
          //console.log()
          let RoomNumber = { 'value': JSON.parse(RoomData[event.value])[j], 'label': JSON.parse(RoomData[event.value])[j] }
          Roomarr.push(RoomNumber)
        }
      }
      //console.log(Roomarr);
    }
  };



 

  useEffect(() => {
    setRoomCellData(data1)

  }, []);

  //console.log(RoomData)
  //console.log(RoomCellData)






  // AG Grid
  const [rowData, setRowData] = useState();


  // ** State
  const [data, setData] = useState(null);
  const [roomStatus, setRoomStatus] = useState(false)
  const [reload, setreload] = useState(true)
  localStorage.setItem('reload', false)
  // ** Hooks
  const { reset, handleSubmit, control, formState: { errors }
  } = useForm({  });






  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Assignment Form</CardTitle>
        </CardHeader>
        <CardBody>
          <Form>

            <Row>
              <Col md='' sm='12' >
                <Card>
                <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <h5><b>BookingId : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['bookingID']}</b></h5>
                  <h5><b>Guest  Name      :  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['firstName']}</b></h5>
                  <h5><b> Room Type : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['roomType']}</b></h5>
                  <h5><b>Arrival Date   :  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['arrivalDate']}</b></h5>
                  <h5><b>Departure Date : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['departureDate']}</b></h5>
                  <h5><b>Room Number: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['roomNumber']}</b></h5>
                
                </Card>
              </Col>



              <Col md='8' sm='12'>
                <Card>
                  {RoomCellData.length != 0 && <Availability RoomData={RoomCellData} roomAssign={true} toggleModal={toggleModal} assignUnassign={assignUnassign} toggleCloseAssign={toggleCloseAssign} toggleModal2={toggleModal2} reservationID={reservationID}/>}
                </Card>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>



    </div>
  );
};

export default AssignRoom;