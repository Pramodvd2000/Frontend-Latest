// ** React Imports
import { useState } from "react";
import axios from "axios";
// ** Third Party Components
import Select from "react-select";
import classnames from "classnames";

import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";


// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import { Input, Card, Form, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText, Row, Col, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";

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
import API_URL from "../../../config";

let Roomarr = []



let reason = [

  // fetchx(API_URL + '/getReasonByID?reasonGroupID=3')
  //   .then(result => result.json())
  //   .then(resp => {
  //     console.log(resp['data'])
  //     reason = resp['data']

  //   })

]


const CancelCheckIn = ({ data1 }) => {
  //console.log(data1.id)
  let navigate = useNavigate();

  const [selectedValue, setSelectedValue] = useState("");
  const [RoomData, setRoomData] = useState("");
  const [popUp, setPopUp] = useState();
  const [refresh, setRefresh] = useState(false);
  const [reason, setReason] = useState([])



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
    fetchx(API_URL + '/getReasonByID?reasonGroupID=3')
    .then(result => result.json())
    .then(resp => {
      //console.log(resp['data'])
      setReason(resp['data'])

    })

      
  }, []);

  useEffect(() => {
    fetchx(API_URL + '/getRoomNumberByFloorID')
      .then(result => result.json())
      .then(resp => {
        //console.log(resp['data'])
        setRoomData(resp['data'])

      })

      
  }, []);

  //console.log(RoomData)

  //console.log(data1['id'])
  let id = data1['id'];
  let guestID = data1['guestID']
  let roomID = data1['room']

  const defaultValues = {
    SubBookingId: '',
    fullName: "",
    // assignedRoomType: "",
    floor: "",
    // RoomNumber : "",
    // comments: ""
  };


  // Hooks
  const {
    clearErrors
  } = useForm({ defaultValues })

  // AG Grid
  const [rowData, setRowData] = useState();


  // ** State
  const [data, setData] = useState(null);
  const [checkIn, setCheckIn] = useState(true);
  const [valueReason, setValueReason] = useState();
  const [unAssign, setUnAssign] = useState(false);
  const [cancelSharer, setCancelSharer] = useState(false);


  // ** Hooks
  const { reset, handleSubmit, control, formState: { errors }
  } = useForm({ defaultValues });

  // //console.log(RoomNumber)


  // const onDiscard = () => {
  //   clearErrors()
  //   setPopUp(false)
  //   reset()
  // }


  const onSubmit = (data) => {
    setData(data);
    //console.log(data)

    //console.log(data);
    let createasset = JSON.stringify({
      "hotelID": 1,
      "reservationID": data1.id,
      "sharerID": data1.sharingID,
      "roomID": data1.room,
      "reasonID": valueReason,
      "reasonText": document.getElementById('reasonText').value,
      "cancelSharer":0,
      "checkCancel":1

    });

    // //console.log(data1['SubBookingId'])


    //console.log(createasset);
    let res = fetchx(API_URL + "/UpdateCancelCheckIn", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: createasset,
    }).then(data => data.json())
      .then((res) => {
        // console.log(res.data.length)
        // console.log(res.message);
        // console.log(res.statusCode);
        if (res.statusCode === 200) {
          if(typeof(res.data)==='string'){
          //console.log(typeof(res.data))
          // setPopUp(res.data)
          setCancelSharer(true)
          }
          else{
          // setTimeout(() => { navigate('/dashboard/testFrontDesk'); }, 1000)
          if(data1.isMain === 1 && res.data.length === 1){

          setUnAssign(true)
          }
          else{
            setTimeout(() => { navigate('/dashboard/frontdesk'); }, 1000)
          }
        }
        }
        else {
          setPopUp(res.message)

        }
      }).then(res => 
        console.log(res)
        )

      .then((res) => {
        //console.log(res);
    
      })
  

  };


  function Cancel() {
    // alert("Do You Really Want To CheckIn")
    // setTimeout(() => { navigate('/dashboard/testFrontDesk');},1000)
    setCheckIn(false)

  }

  function variable() {
    // onDiscard

    setTimeout(() => { navigate('/dashboard/frontdesk'); }, 500)

  }

  function ifYesUnAssign(){
    let unAssign = JSON.stringify({
      "reservationID": data1.id,
      "roomID": data1.room,
    });
    let res = fetchx(API_URL + "/UnAssignforCancelCheckin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: unAssign,
    }).then(data => data.json())
      .then((res) => {
        //console.log(res)
      })
    setTimeout(() => { navigate('/dashboard/frontdesk'); }, 500)

  }


  function cancelSharerAlso(){
    let createasset = JSON.stringify({
      "hotelID": 1,
      "reservationID": data1.id,
      "sharerID": data1.sharingID,
      "roomID": data1.room,
      "reasonID": valueReason,
      "reasonText": document.getElementById('reasonText').value,
      "cancelSharer":1,
      "checkCancel": 0

    });



    //console.log(createasset);
    let res = fetchx(API_URL + "/UpdateCancelCheckIn", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: createasset,
    }).then(data => data.json())
      .then((res) => {
        // console.log(res.data.length)
        // console.log(res.message);
        // console.log(res.statusCode);
        if (res.statusCode === 200) {
          if(typeof(res.data)==='string'){
          //console.log(typeof(res.data))
          setPopUp(res.data)
          }
          // setTimeout(() => { navigate('/dashboard/testFrontDesk'); }, 1000)
          if(data1.isMain === 1 && res.data.length === 1){

          setUnAssign(true)
          }
          else{
            setTimeout(() => { navigate('/dashboard/frontdesk'); }, 1000)
          }
          
        }
        else {
          setPopUp(res.message)

        }
      }).then(res => console.log(res))

      .then((res) => {
        console.log(res);
    
      })
  

  }

  const handleChange = (selectedOption) => {
    setValueReason(selectedOption.value);
    console.log(selectedOption.value)
  };

  useEffect(() => {
    if (refresh) {
      setTimeout(() => { navigate('/dashboard/frontdesk'); }, 1000)

    }
  }, [refresh]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Cancel Check-In Form</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>


              <Col md='6' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="SubBookingId">
                    Booking Id
                  </Label>
                  <Controller
                    id='SubBookingId'
                    control={control}
                    name='SubBookingId'
                    render={({ field }) => (
                      <Input
                        isClearable
                        // options={subBookingId}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.SubBookingId === null })}
                        {...field}
                        disabled={true}
                        value={data1['bookingID']}
                      />
                    )}
                  />

                </div>
              </Col>


              <Col md='6' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='fullName'>
                    Guest Name
                  </Label>
                  <Controller
                    id='fullName'
                    control={control}
                    name='fullName'
                    render={({ field }) => (
                      <Input
                        isClearable
                        // options={fullName}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.fullName === null })}
                        {...field}
                        disabled={true}
                        value={data1['firstName']}

                      />
                    )}
                  />
                </div>
              </Col>

              <Col md='6' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='assignedRoomType'>
                    Assigned Room Type
                  </Label>
                  <Controller
                    id='assignedRoomType'
                    control={control}
                    name='assignedRoomType'
                    render={({ field }) => (
                      <Input
                        isClearable
                        // options={assignedRoomType}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.assignedRoomType === null })}
                        disabled={true}
                        {...field}
                        value={data1['roomType']}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md='6' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='RoomNumber'>
                    Select Room
                  </Label>
                  <Controller
                    id='RoomNumber'
                    control={control}
                    name='RoomNumber'
                    render={({ field }) => (
                      <Input
                        isClearable
                        disabled={true}
                        options={Roomarr}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.RoomNumber === null })}
                        {...field}
                        value={data1['roomNumber']}

                      />
                    )}
                  />
                </div>
              </Col>


              <Col md='6' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='start'>
                    Arrival Date
                  </Label>
                  <Controller
                    id='start'
                    name='start'
                    control={control}
                    render={({ field }) => (
                      <Input
                        required
                        placeholder='start'
                        {...field}
                        disabled={true}
                        // className={classnames('form-control', {
                        //   'is-invalid': data !== null && (data.start === null || !data.start.length)
                        // })}
                        value={data1['arrivalDate']}
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='end'>
                    Departure Date
                  </Label>
                  <Controller
                    id='end'
                    name='end'
                    control={control}
                    render={({ field }) => (
                      <Input
                        required
                        placeholder='End'
                        {...field}
                        disabled={true}
                        // className={clascheckInsnames('form-control', {
                        //   'is-invalid': data !== null && (data.end === null || !data.end.length)
                        // })}
                        value={data1['departureDate']}
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="reason">
                    Select Reason
                  </Label>
                  <Controller
                    control={control}
                    name="reason"
                    render={({ field }) => (
                      <Select
                        required
                        isClearable
                        options={reason}
                        id='reason'
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        {...field}
                        onChange={handleChange} // Add onChange event handler
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='reasonText'>
                    Reason Remarks
                  </Label>
                  <Controller
                    id='reasonText'
                    name='reasonText'
                    control={control}
                    render={({ field }) => (
                      <Input
                        id='reasonText'
                        required
                        {...field}
                        placeholder='Reason Remarks'
                        className={classnames('form-control', {
                          'is-invalid': data !== null && (data.reasonText === null || !data.reasonText.length)
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <div className="d-flex">
                <Button className="me-1" color="danger" type="submit" >
                  Cancel Check In
                </Button>
                <Button outline color='secondary' className='me-1' onClick={Cancel}>
                  Cancel
                </Button>
              </div>
              {
                refresh &&
                setTimeout(() => { navigate('/dashboard/TestAvailability'); }, 1000)


              }
            </Row>
          </Form>

        </CardBody>
      </Card>




      {popUp &&
        <div className='disabled-animation-modal'>
          <Modal isOpen={popUp} toggle={() => setPopUp(!popUp)} className='modal-sm'  >  
            <ModalHeader className='modal-sm' toggle={() => {
              setPopUp(!popUp)
            }}>Need To Check..</ModalHeader>
            <ModalBody className='pb-3 px-sm-2 mx-20'>
              <div>
                <b>{popUp}</b>
                <br></br>
                <br></br>
                <Button color="primary" className='text-center' onClick={variable} >
                  Ok
                </Button>
              </div>
            </ModalBody>
          </Modal>

        </div>
      }

      <Modal isOpen={unAssign} toggle={() => setUnAssign(!unAssign)} className='modal-dialog-centered'>
        <ModalHeader className='bg-transparent' toggle={() => setUnAssign(!unAssign)}></ModalHeader>
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Un-Assign room also?</h1>
            {/* <p>you want to submit this form ? </p> */}
          </div>
          <Col>
            <div className="button-container text-center">
              <Button className="me-1" color="primary" type="submit" onClick={ifYesUnAssign} >
                Yes
              </Button>
              <Button className="me-1" color="danger" onClick={variable} >
                No
              </Button>
            </div>
          </Col>
        </ModalBody>
        {/* <hr /> */}

      </Modal>

      <div className='disabled-animation-modal'>
        <Modal isOpen={cancelSharer} toggle={() => setCancelSharer(!cancelSharer)} className='modal-dialog-centered'>
        <ModalHeader className='bg-transparent' toggle={() => setCancelSharer(!cancelSharer)}></ModalHeader>
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Cancel checkIn sharer also ?</h1>
            {/* <p>you want to submit this form ? </p> */}
          </div>
          <Col>
            <div className="button-container text-center">
              <Button className="me-1" color="primary" type="submit" onClick={cancelSharerAlso} >
                Confirm
              </Button>
              <Button className="me-1" color="danger" onClick={()=>setCancelSharer(false)} >
                Cancel
              </Button>
            </div>
          </Col>
        </ModalBody>

      </Modal>
      </div>

    </div>
  );
};

export default CancelCheckIn;
