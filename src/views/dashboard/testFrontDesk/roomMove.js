// ** React Imports
import { useState } from "react";
import axios from "axios";
// ** Third Party Components
import Select from "react-select";
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







let roomTypeID = [
  // fetchx(API_URL + '/getRoomInventoryRoomTypeID?hotelID=1')
  //   .then(result => result.json())
  //   .then(resp => {
  //     // //console.log(resp['data'])
  //     roomTypeID = resp['data']
  //     //console.log(roomTypeID)
  //   })
]



// {filldata.length!=0 && <AssignRoom data1={filldata}/>}
localStorage.removeItem('id')
localStorage.removeItem('roomno')
localStorage.removeItem('reservationNewRoomTypeID')
const RoomMove = ({ data1 }) => {
  //console.log(data1['bookingID'])


  localStorage.setItem('RoomCellID', data1['id'])

  let navigate = useNavigate();




  const [selectedValue, setSelectedValue] = useState(data1.roomTypeID);
  const [RoomData, setRoomData] = useState("");
  const [assign, setAssign] = useState(false)
  const [RoomCellData, setRoomCellData] = useState('')
  const [roomTypeID, setRoomTypeID] = useState([])



  useEffect(() => {
    setRoomCellData(data1)
    fetchx(API_URL + '/getRoomInventoryRoomTypeID?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      // //console.log(resp['data'])
      setRoomTypeID(resp['data'])
      //console.log(roomTypeID)
    })
  }, []);






  // AG Grid
  const [rowData, setRowData] = useState();


  // ** State
  const [data, setData] = useState(null);
  const [roomStatus, setRoomStatus] = useState(false)
  const [reload, setreload] = useState(true)
  const [load, setload] = useState(true)

  localStorage.setItem('reload', false)
  // ** Hooks
  const { reset, handleSubmit, control, formState: { errors }
  } = useForm({});

  // //console.log(RoomNumber)




  const onSubmit = (data1) => {
    setData(data1);
    //console.log(data1)

  };


  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption.value);
    //console.log(selectedOption.value)
    //console.log(localStorage.getItem('reservationRoomType'))
    localStorage.removeItem('reservationRoomType')
    localStorage.setItem('reservationRoomType', selectedOption.label);
    localStorage.setItem('reservationNewRoomTypeID', selectedOption.value);

    //console.log(localStorage.getItem('reservationRoomType'))
    //console.log(localStorage.getItem('reservationRoomTypeID'))
    setreload(false)
    setTimeout(() => { setreload(true) }, 1)

  };




  function HandleRoomNumber() {
    setRoomStatus(true)
    // (typeof(localStorage.getItem('id'))=='undefined' && (setTimeout(()=>{setRoomStatus(false)},1000)))
    //console.log(typeof (localStorage.getItem('id')))
    //console.log(localStorage.getItem('id'))
    // setTimeout(()=>{setRoomStatus(false)},1000)
  }

  const defaultReason = {
    value: data1.roomTypeID,
    label: data1.roomType,
  };



  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Room Move Form</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>

            <Row>
              <Col md='' sm='12' >
                <Card>
                  {/* <p></p>
          <p></p>
          <p></p>
          <p></p>
          <h5><b>BookingID : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['bookingID']}</b></h5>
          <h5><b>Guest  Name    :  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['name']}</b></h5>
          <h5><b>Room Type : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['roomType']}</b></h5>
          <h5><b>Room Number :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['roomNumber']}</b></h5>
          <h5><b>Start Date   :  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['arrivalDate']}</b></h5>
          <h5><b>End Date     :  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['departureDate']}</b></h5> */}

                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <h5><b>BookingID : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['bookingID']}</b></h5>
                  <h5><b>Guest  Name      :  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['firstName']}</b></h5>
                  <h5><b> Room Type : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['roomType']}</b></h5>
                  <h5><b>Room Number :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['roomNumber']}</b></h5>
                  <h5><b>Arrival Date   :  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['arrivalDate']}</b></h5>
                  <h5><b>Departure Date : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data1['departureDate']}</b></h5>

                </Card>
                <Col md='8' sm='12'>
                  <div className="mb-1">
                    <Label className="form-label" for="isActive">
                      Change Room Type
                    </Label>
                    <Controller
                      id="isActive"
                      control={control}
                      name="isActive"
                      render={({ field }) => (
                        <Select
                          required
                          defaultValue={defaultReason}
                          isClearable
                          options={roomTypeID}
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          {...field}
                          onChange={handleChange} // Add onChange event handler
                        // value={selectedValue || defaultReason}
                        // onChange={(selectedOption) => {
                        //   handleChange(selectedOption);
                        //   field.onChange(selectedOption);
                        // }}
                        />
                      )}
                    />
                  </div>
                </Col>

              </Col>

              {load && <Col md='8' sm='12'>
                {reload && <Card>
                  {RoomCellData.length != 0 && <Availability RoomData={{ data1, selectedValue }} roomAssign={false} />}
                </Card>}
              </Col>}

              {/* {roomStatus &&( <><Availability roomAssign={true} /> {Alert()}</>)} */}
            </Row>
          </Form>
        </CardBody>
      </Card>



    </div>
  );
};

export default RoomMove;