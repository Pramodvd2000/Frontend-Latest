// ** React Imports
import { useState } from "react";
import axios from "axios";
// ** Third Party Components
import Select from "react-select";
import classnames from "classnames";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Moment from 'moment';
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



import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


// let reason = [

//   fetchx(API_URL+'/getReasonByID?reasonGroupID=1')
//     .then(result => result.json())
//     .then(resp => {
//       //console.log(resp['data'])
//       reason = resp['data']

//     })

// ]




const UnAssignRoom = ({ data1, toggleModal }) => {
    //console.log(data1)
  let navigate = useNavigate();

  const [selectedValue, setSelectedValue] = useState("");
  const [RoomData, setRoomData] = useState("");
  const [popUp, setPopUp] = useState();
  const [refresh, setRefresh] = useState(false);

  const [reason, setReason] = useState([]);


  useEffect(() => {
    fetchx(API_URL+'/getReasonByID?reasonGroupID=1')
    .then(result => result.json())
    .then(resp => {
      //console.log(resp['data'])
      setReason(resp['data'])

    })
  }, []);

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
    fetchx(API_URL+'/getRoomNumberByFloorID')
      .then(result => result.json())
      .then(resp => {
        //console.log(resp['data'])

        setRoomData(resp['data'])

      })
  }, []);


  // Hooks
  const {
    clearErrors
  } = useForm({  })

  // AG Grid
  const [rowData, setRowData] = useState();


  // ** State
  const [data, setData] = useState(null);
  const [checkIn, setCheckIn] = useState(true);
  const [valueReason, setValueReason] = useState();


  // ** Hooks
  const { reset, handleSubmit, control, formState: { errors }
  } = useForm({  });


  const handleSuccess = (message) => {
    return MySwal.fire({
      title: message,
      text: 'Successfully unassign the reservation',
      icon: 'success',
    })
  }

  const onSubmit = (data) => {
    let createasset = JSON.stringify({
      "sharingID": data1.sharingID,
      "roomID": data1.room,
      "hotelID": 1,
      "reasonID": valueReason,
      "reasonText": document.getElementById('reasonText').value,

    });

    //console.log(valueReason,document.getElementById('reasonText').value)


    //console.log(createasset);
    let res = fetchx(API_URL + "/UnAssignRoom", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: createasset,  
    }).then(data => data.json())
      .then((res) => {
        //console.log(res);
        //console.log(res.statusCode);
        if (res.statusCode === 200) {
	  // toggleModal('unassign')
          handleSuccess("Unassign room successful !!")
          setTimeout(() => { navigate(''); }, 500)

        }
        else {
          setPopUp(res.message)

        }
      }).then(res => 
        console.log(res)
        )
      .then((res) => {
        //console.log(res);
        // if(response['status']===200){
        //   setTimeout(() => { navigate('/dashboard/TestAvailability');},1000)

        // }
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

  const handleChange = (selectedOption) => {
    setValueReason(selectedOption.value);
    //console.log(selectedOption.value)
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
              <CardTitle tag="h4">Un-Assign Room Form</CardTitle>
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
                            // className={classnames('form-control', {
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
                    <Button className="me-1" color="primary" type="submit" >
                      Un-Assign
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
          <Modal isOpen={popUp} toggle={() => setPopUp(!popUp)} className='modal-sm'  >   {/*onClosed={onDiscard}*/}
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


    </div>
  );
};

export default UnAssignRoom;
