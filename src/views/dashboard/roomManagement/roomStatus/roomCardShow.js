
// ** Third Party Components
import React, { Component } from 'react';
// ** Custom Components
import Avatar from "@components/avatar";
import { useNavigate } from "react-router-dom";
// ** React Imports
import { useState } from "react";
import Select from "react-select";
import classnames from "classnames";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, ModalFooter } from 'reactstrap'
// ** Reactstrap Imports
import {
  Input,
  Card,
  Form,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  InputGroup,
  InputGroupText,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader
} from "reactstrap";
// ** Utils
import { selectThemeColors } from '@utils'

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
import API_URL from '../../../../config';

let Roomcount = []


const defaultValues = {
  TableNo: '',
  pax: '',
  Type: '',
  guestName: '',
  Departments: '',
  KOTType: ''
}



const roomStatus = [

  { value: 'Dirty', label: 'Dirty' },
  { value: 'Inspected', label: 'Inspected' },
  { value: 'Clean', label: 'Clean' }

]


localStorage.removeItem('id')
const ValidationThirdPartyComponents = ({ floorid, roomAssign, RoomData }) => {


  let navigate = useNavigate();
  const [assign, setAssign] = useState(false)

  const [modaldata, setmodaldata] = useState('')
  const [checkdata, setcheckdata] = useState(false)
  const [errorMsg, setErrorMsg] = useState(false)
  const [data, setData] = useState(null);
  const [selectedValue, setSelectedOption] = useState(null);
  const [RoomNumber, setRoomNumber] = useState(false)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [guestDetails, setGuestDetails] = useState()

  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleDropdownChange = (event) => {
    setSelectedOption(event.value);

    // console.log(event.value); // print the selected value to console
    // if (selectedValue == 'Out Of Service') {
    //   console.log("hi")

    // }
    // else if (selectedValue == 'Out Of Order') {
    //   console.log("hi")
    // }

    // else {

    // }
  };


  const onSubmit = (data) => {
    setData(data);

    let id = localStorage.getItem('id')
    //console.log(id)
    //console.log(data)
    //console.log("ghishn" + selectedValue + "")
    //console.log(data)
    let createmarketGroup = JSON.stringify({

      "roomStatus": selectedValue,
      "id": localStorage.getItem('id')
    })
    //console.log(createmarketGroup)
    let res = fetchx(API_URL + "/updateRoomStatus", {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    })
      .then(result => result.json())
      .then((res) => {
        //console.log(res);
        if (res.statusCode === 200) {
          setTimeout(() => { navigate('/dashboard/roomManagement/roomStatus'); }, 200)
        }
        else if (res.message) {
          setErrorMsg(res.message)
        }
      });

    // }


  };


  const RoomAssignSubmit = () => {
    let createasset = JSON.stringify({
      // "hotelID": data.hotelID,
      // "SubBookingId": data1.SubBookingId,
      // "fullName": data1.fullName,
      // "assignedRoomType": data1.assignedRoomType,
      // "floorID": data1.floor.label,
      // "RoomNumber": data1.RoomNumber.value,
      "RoomNumber": localStorage.getItem('roomno'),
      "PmsStatus": 'Assigned'
    });

    // //console.log(data1['SubBookingId'])


    //console.log(createasset);
    let res = fetchx(API_URL + "/updateReservationBooking?id=" + localStorage.getItem('RoomCellID'), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: createasset,
    }).then((res) => {
      // //console.log(res);


    });
  }


  useEffect(() => {

    fetchx(API_URL + '/getRoomInformation?floorID=' + floorid)
      .then(result => result.json())
      .then(resp => {
        // //console.log(resp)
        Roomcount = resp['data']
        //console.log(Roomcount)
        setcheckdata(true)


      })

    if (modaldata) {
      const addTempTables = JSON.stringify({
        hotelID: 1,
        roomID: modaldata['id']
      })
      // fetchx(`http://122.166.2.21:14702/RoomStatusGuestView`,{
      fetchx(API_URL + `/RoomStatusGuestView`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: addTempTables
      }).then(data => data.json())
        .then(resp => {
          //console.log(resp)
        })
    }

  }, []);

  function Alert() {
    // alert("Do You Really Want to Change Room Status from " + localStorage.getItem('roomstatus') + " to " + selectedValue + " for Room Number " + localStorage.getItem('roomno')+" ?")
    // setTimeout(() => { navigate('/dashboard/roomManagement/roomStatus'); }, 200)
    setErrorMsg(false)
  }

  function AlertForAssign() {
    // alert("Do You Really Want To Assign Room No."+localStorage.getItem('roomno'))
    RoomAssignSubmit();
    setTimeout(() => { navigate('/dashboard/frontDesk'); }, 1000)


  }

  function getButtonsUsingForLoop(num) {

    let color = '';
    const array = []
    let backgroundColor = '';
    for (var i = 1; i <= num; i++) {

      if (Roomcount[i - 1]['frontOfficeStatus'] == 'Occupied' || Roomcount[i - 1]['roomStatus'] == 'Clean') {
        // color = 'primary'
        backgroundColor='#3C5EFC'

        // let Icons=<Circle/>
      }
      else if (Roomcount[i - 1]['roomStatus'] == 'Dirty') {
        // color = 'danger'
        backgroundColor='#CD5354'
      }
      else if (Roomcount[i - 1]['roomStatus'] == 'Out Of Order') {
        // color = 'secondary'
        backgroundColor='#82868b'

      }
      else if (Roomcount[i - 1]['roomStatus'] == 'Out Of Service') {
        // color = 'warning'
        backgroundColor='#D0AD0F'

      }
      // }
      else if (Roomcount[i - 1]['roomStatus'] == 'Inspected') {
        // color = 'success'
        backgroundColor='#28C76F'
      }
      const tableid = i
      const roomno = Roomcount[i - 1]['roomNumber']
      const roomtype = Roomcount[i - 1]['roomType']
      const fstatus = Roomcount[i - 1]['frontOfficeStatus']
      const roomstatus = Roomcount[i - 1]['roomStatus']
      const id = Roomcount[i - 1]['id']
      const resReservationStatus = Roomcount[i - 1]['resReservationStatus']

      array.push(
        <Button color={color} className="me-0.5" 
        style={{
          'margin-right': '10px', height: '150px', width: '130px',
          'margin-bottom': '10px',
          backgroundColor
        }}
          id={tableid}
          name="bt"
          onClick={() => {
            handleClick(roomno, roomtype, fstatus, roomstatus, id,resReservationStatus)
          }}
        >
          <div>
            <p style={{fontWeight: 'bold', color: 'white'}}><h5 style={{ color: 'white', fontWeight: 'bold', margin: '0' ,marginBottom: '2%'}}>{Roomcount[i - 1]['roomNumber']}</h5>
              ({Roomcount[i - 1]['roomType']})<h6 style={{ color: 'white', fontWeight: 'bold', margin: '0',marginBottom: '2px' }}>{Roomcount[i - 1]['frontOfficeStatus']}</h6><h6 style={{ color: 'white'}}>{Roomcount[i - 1]['roomStatus']}</h6>
              {/* <h6 style={{ color: 'white', fontWeight: 'bold', margin: '0',marginBottom: '2px' }}>{Roomcount[i - 1]['reservationStatus']}</h6> */}
              {Roomcount[i - 1]['resReservationStatus']}
              </p>
            {/* <p ><h6 style={{ color: 'white', fontWeight: 'bold', margin: '0',marginBottom: '2px' }}>{Roomcount[i - 1]['frontOfficeStatus']}</h6></p>
            <p >{Roomcount[i - 1]['roomStatus']}</p>
            <p style={{color: 'black', margin: '0'}}>{Roomcount[i - 1]['reservationStatus']}</p> */}
          </div>


        </Button>)
    }

    return array
  }
  function handleClick(roomno, roomtype, fstatus, roomstatus, id,resReservationStatus) {
    //console.log(roomno, roomtype, fstatus, roomstatus, id)
    localStorage.setItem('id', id)
    let myJson = { "roomno": roomno, "roomtype": roomtype, "fstatus": fstatus, "roomstatus": roomstatus, "id": id, "resReservationStatus":resReservationStatus }
    localStorage.setItem('roomstatus', roomstatus)
    localStorage.setItem('roomno', roomno)
    localStorage.setItem('id', id)
    //console.log(localStorage.getItem('id', id))
    localStorage.setItem('reload', true)
    setmodaldata(myJson)
    //console.log(roomAssign)

    // useEffect(() => {

    const addTempTables = JSON.stringify({
      hotelID: 1,
      roomID: id
    })
    //console.log(addTempTables)
    // fetchx(`http://122.166.2.21:14702/RoomStatusGuestView`,{
    fetchx(API_URL + `/RoomStatusGuestView`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: addTempTables
    }).then(data => data.json())
      .then(resp => {
        //console.log(resp['data'])
        setGuestDetails(resp['data'])
      })



    if (roomAssign == false) {
      setAssign(true)
      setSelectedOption(null)

    }
    else {
      setRoomNumber(true)
    }
    //console.log(myJson)

  }



  // For checking the Conditions
  function SubmitAndError() {
    //console.log(localStorage.getItem("roomstatus"))
    let roomPrevStatus = localStorage.getItem("roomstatus")
    //console.log(selectedValue)
    if (selectedValue === null || selectedValue === undefined || selectedValue === '') {
      let ErrorMessage = "Please Select Room Status"
      setErrorMsg(ErrorMessage)
    }
    else if (selectedValue === roomPrevStatus) {
      let ErrorMessage = "Room is already " + selectedValue + ""
      setErrorMsg(ErrorMessage)
    }
    else if (roomPrevStatus === "Out Of Service") {
      let ErrorMessage = "Room is already Out Of Service please release room first"
      setErrorMsg(ErrorMessage)
    } else if (roomPrevStatus === "Out Of Order") {
      let ErrorMessage = "Room is already Out Of Order please release room first"
      setErrorMsg(ErrorMessage)
    }

    else {
      setConfirmSubmit(true)

    }
  }

  return (
    <div>
      <Row className='match-height'>
        <Col xl='12' >
          <Card>
            <br />
            <h4 style={{ margin: '6px 0', paddingLeft: '10px' }}>Select Room</h4>
            <div class='demo-space-x' style={{ margin: '6px 0', paddingLeft: '10px' }}>

              {checkdata && getButtonsUsingForLoop(Roomcount.length)}
            </div>
            <div class='demo-space-x' style={{ margin: '6px 0', paddingLeft: '10px' }}>
              <Button.Ripple style={{ 'margin-right': '10px', 'margin-bottom': '10px' }} color='success' size='sm' >Inspected</Button.Ripple>
              <Button.Ripple style={{ 'margin-right': '10px', 'margin-bottom': '10px' }} color='danger' size='sm'  >Dirty</Button.Ripple>
              <Button.Ripple style={{ 'margin-right': '10px', 'margin-bottom': '10px' }} color='primary' size='sm' >Clean/Occupied</Button.Ripple>
              <Button.Ripple style={{ 'margin-right': '10px', 'margin-bottom': '10px' }} color='secondary' size='sm'  >Out of order</Button.Ripple>
              <Button.Ripple style={{ 'margin-right': '10px', 'margin-bottom': '10px' }} color='warning' size='sm' >Out of service</Button.Ripple>
            </div>
          </Card>
        </Col>

      </Row>

      <Modal isOpen={assign} toggle={() => setAssign(!assign)} className='demo-inline-spacing'>

        <ModalHeader className='bg-transparent' toggle={() => setAssign(!assign)}></ModalHeader>

        <ModalBody className='pb-3 px-sm-1 mx-20'>
          <div>
            {modaldata.length != 0 &&
              <>
                <Row>
                  <Col md='6' sm='12' className='mb-1'>
                    <div>
                      <h2>Room Data  </h2>
                      <br></br>
                      <h5>Room Number         : <b>{modaldata['roomno']}    </b></h5>
                      <h5>Room Type           :   <b>{modaldata['roomtype']}  </b></h5>
                      <h5>Room Status         : <b>{modaldata['roomstatus']}</b> </h5>
                      <h5>Front Office Status : <b>{modaldata['fstatus']}</b></h5>
                    </div>
                  </Col>
                  {guestDetails != undefined && guestDetails.length > 0 &&
                    <Col md='6' sm='12' className='mb-1'>
                      <div>
                        <h2>Guest Details </h2>
                        <br></br>
                        <h5>Guest Name         : <b>{guestDetails[0]['guestName']}    </b></h5>
                        <h5>Arrival           :   <b>{guestDetails[0]['arrivalDate']}  </b></h5>
                        <h5>Departure         : <b>{guestDetails[0]['departureDate']}</b> </h5>
                        <h5>Status : <b>{guestDetails[0]['reservationStatus']}</b></h5>
                        <h5>Company : <b>{guestDetails[0]['accountName']}</b></h5>
                        <h5>Extras : <b>{guestDetails[0]['extra']}</b></h5>
                        <h5>Specials : <b>{guestDetails[0]['preference']}</b></h5>

                      </div>
                    </Col>}
                </Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <br></br>
                  <Col md='6' sm='12' className='mb-1'>
                    <div className='mb-1'>

                      <Controller
                        id='roomStatus'
                        control={control}
                        name='roomStatus'
                        render={({ }) => (
                          <Select
                            required
                            isClearable
                            options={roomStatus}
                            classNamePrefix='select'
                            theme={selectThemeColors}
                            className={classnames('react-select', { 'is-invalid': data !== null && data.roomStatus === null })}
                            onChange={handleDropdownChange}

                          />
                        )}
                      />
                    </div>
                  </Col>

                  <Col md='4' sm='12' className='mb-1'>
                    <div className="d-flex">
                      <Button className="me-1" color="primary" onClick={SubmitAndError}>
                        {/* onClick={Alert} */}
                        Submit
                      </Button>
                    </div>
                  </Col>

                  <Modal isOpen={confirmSubmit} toggle={() => setConfirmSubmit(!confirmSubmit)} className='modal-dialog-centered'>
                    <ModalHeader className='bg-transparent' toggle={() => setConfirmSubmit(!confirmSubmit)}></ModalHeader>
                    <ModalBody className='text-center mb-2'>

                      <div className='text-center mb-2'>
                        <h5><b>"Do You Want to Change Room Status from {localStorage.getItem('roomstatus')} to {selectedValue} for Room Number {localStorage.getItem('roomno')} ?"</b></h5>

                        <div className="button-container text-center">
                          <Button className="me-1" color="primary" type='submit' onClick={onSubmit}>
                            Confirm
                          </Button>
                          <Button className="me-1" color="primary" onClick={() => setConfirmSubmit(false)}>
                            Back
                          </Button>

                        </div>

                      </div>
                    </ModalBody>
                  </Modal>
                </Form>
              </>
            }
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={RoomNumber} toggle={() => setRoomNumber(!RoomNumber)} className='modal-dialog-centered'>
        <ModalHeader className='bg-transparent' toggle={() => setRoomNumber(!RoomNumber)}></ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>

          <div>

            <h5>Do Really You Want Assign Room Number  : <></><b>{localStorage.getItem('roomno')}</b></h5>

            <ModalFooter>
              <div className="d-flex">
                <Button className="me-1" color="primary" type="submit" >
                  {/* onClick={AlertForAssign} */}
                  Submit
                </Button>


              </div>
            </ModalFooter>

          </div>
        </ModalBody>
      </Modal>




      {errorMsg &&
        <div className='disabled-animation-modal'>
          <Modal isOpen={errorMsg} toggle={() => setErrorMsg(!errorMsg)} className='modal-sm'>
            <ModalHeader className='modal-sm' toggle={() => setErrorMsg(!errorMsg)}></ModalHeader>
            <ModalBody className='pb-3 px-sm-1 mx-20'>

              <div>

                <h5><b>{errorMsg}</b></h5>

                <div className="d-flex">
                  <Button className="me-1" color="primary" onClick={Alert}>
                    Ok
                  </Button>


                </div>

              </div>
            </ModalBody>
          </Modal>
        </div>}
    </div>
  )
}

export default ValidationThirdPartyComponents;