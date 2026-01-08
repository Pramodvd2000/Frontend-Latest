// ** React Imports
import { useState } from "react";
import axios from "axios";
// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Moment from 'moment';
import { useNavigate } from "react-router-dom";
// ** Custom Components
import Avatar from "@components/avatar";

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
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AssignRoom from "./assignRoom";
const MySwal = withReactContent(Swal)



let Roomarr = []












const CheckIn = ({ data1, toggleModal, toggleModal3, reservationID }) => {
  //console.log(data1.sharingID)
  let navigate = useNavigate();



  const [selectedValue, setSelectedValue] = useState("");
  const [RoomData, setRoomData] = useState("");
  const [popUp, setPopUp] = useState();
  const [refresh, setRefresh] = useState(false);


  function modalClose() {
    toggleModal3()
  }


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
    // fetchx(API_URL+'/getRoomNumberByFloorID')
    //   .then(result => result.json())
    //   .then(resp => {
    //     //console.log(resp['data'])


    //     setRoomData(resp['data'])

    //   })
  }, []);

  //console.log(RoomData)

  //console.log(data1['id'])
  let id = data1['id'];
  let guestID = data1['guestID']
  let roomID = data1['room']
  let sharingID = data1['sharingID']

  const handleSuccess = (message) => {
    return MySwal.fire({
      title: message,
      text: 'Successfully checkin the reservation',
      icon: 'success',
    })
  }



  // Hooks
  const {
    clearErrors
  } = useForm({})

  // AG Grid
  const [rowData, setRowData] = useState();


  // ** State
  const [data, setData] = useState(null);
  const [checkIn, setCheckIn] = useState(true);
  const [checkinSharer, setCheckinSharer] = useState();
  const [checkBoxValue, setCheckBoxValue] = useState(0);
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [showAssignRoom, setShowAssignRoom] = useState(false);

  // ** Hooks
  const { reset, handleSubmit, control, formState: { errors }
  } = useForm({});


  function Cancel() {
    // Call the toggleModal function to close the modal
    // props.toggleModal();
    toggleModal();
  }


  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const checkboxValue = isChecked ? 1 : 0;
    //console.log(checkboxValue)
    setCheckBoxValue(checkboxValue)
    setCheckboxChecked(!checkboxChecked)
  }


  const onSubmit = (data1) => {
    setData(data1);
    //console.log(data1)

    let createasset = JSON.stringify({
      "reservationStatus": 'Checked In',
      "id": id,
      "guestID": guestID,
      "roomID": roomID,
      "sharingID": sharingID,
      "checkBox": checkBoxValue,
      "hotelID": 1

    });

    // //console.log(data1['SubBookingId'])


    //console.log(createasset);
    let res = fetchx(API_URL + "/updateReservationBookingCheckInNew", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: createasset,
    }).then(data => data.json())
      .then((res) => {
        //console.log(res);
        //console.log(res.statusCode);
        if (res.statusCode === 200) {
          if(toggleModal3!==undefined){
            handleSuccess("Check-In Successfull !!")
            modalClose()
            reservationID()
            return;
            }
          // setTimeout(() => { navigate('/dashboard/testFrontDesk'); }, 1000)
          // if(res.data=="Do you want to checkIn sharer also?"){
          // setCheckinSharer(res.data)
          // }else{
          // setTimeout(() => { navigate('/dashboard/testFrontDesk'); }, 500)

          // }
          handleSuccess('Checkin Successful!!')
          // toggleModal()
          setTimeout(() => { navigate('/dashboard/frontdesk'); }, 500)

        }
        else {
          console.log(res.data)
          setPopUp(res.data)
        }
      }).then(res => console.log(res))
      .then((res) => {
        console.log(res);

      })


  };



  function GetSharer() {

    let sharer = JSON.stringify({
      "sharingID": sharingID,
      "hotelID": 1
    });

    let res = fetchx(API_URL + "/getSharerDetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: sharer,
    }).then(data => data.json())
      .then((res) => {
        //console.log(res.data[0]['id']);
        let createasset = JSON.stringify({
          "reservationStatus": 'Checked In',
          "id": res.data[0]['id'],
          "guestID": res.data[0]['guestID'],
          "roomID": res.data[0]['room'],
          "sharingID": res.data[0]['sharingID'],
          "hotelID": 1

        });
        //console.log(createasset);
        let result = fetchx(API_URL + "/updateReservationBookingCheckInNew", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: createasset,
        }).then(data => data.json())
          .then((res) => {
            //console.log(res)
            if (res.statusCode === 200) {
              setTimeout(() => { navigate('/dashboard/frontdesk'); }, 500)
            }

          })
      })


  }

  // function Cancel() {
  //   // alert("Do You Really Want To CheckIn")
  //   // setTimeout(() => { navigate('/dashboard/testFrontDesk');},1000)
  //   setCheckIn(false)

  // }

  function variable() {
    // onDiscard
    setPopUp(false)
    // setTimeout(() => { navigate('/dashboard/testFrontDesk'); }, 500)

  }


  useEffect(() => {
    if (refresh) {
      setTimeout(() => { navigate('/dashboard/frontdesk'); }, 1000)

    }
  }, [refresh]);


  const callAssignRoom = () => {
    setShowAssignRoom(true);
  };

  function toggleCloseAssign (){
  setShowAssignRoom(!showAssignRoom)
  }
  
  return (
    <div>
      {/* <Modal isOpen={checkIn} toggle={() => setCheckIn(!checkIn)} className='demo-inline-spacing'>
        <ModalHeader className='bg-transparent' toggle={() => setCheckIn(!checkIn)}></ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'> */}
      <Card>

        <CardHeader>
          {/* {showAssignRoom && <AssignRoom data1={data1}/>} */}

          <CardTitle tag="h4">Check-In Form {'  '}  </CardTitle>
          <Button color="primary" type="submit" onClick={callAssignRoom} >
            Assign Other Room
          </Button>
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
              <Col >
                <div className='mb-1'>
                  <Label className='form-label' for='comments'>
                    Comments
                  </Label>
                  <Controller
                    id='comments'
                    name='comments'
                    control={control}
                    render={({ field }) => (
                      <Input
                        required
                        // placeholder='comments'
                        type="longText"
                        {...field}
                        disabled={true}
                        // className={classnames('form-control', {
                        //   'is-invalid': data !== null && (data.end === null || !data.end.length)
                        // })}
                        value={data1['comments']}
                      />
                    )}
                  />
                </div>
              </Col>
              <Row>
                <Col md='6' sm='12' className='mb-1'>

                  <div className='form-check form-check-inline'>
                    <Input type='checkbox' id='basic-cb-unchecked' checked={checkboxChecked} onChange={handleCheckboxChange} />
                    <Label for='noPost' className='form-check-label'>
                      No Post
                    </Label>
                  </div>
                </Col>
              </Row>

              <div>
                <Modal
                  isOpen={showAssignRoom}
                  toggle={() => setShowAssignRoom(!showAssignRoom)}
                  className="modal-xl"
                >
                  <ModalHeader
                    className="modal-xl"
                    toggle={() => {
                      setShowAssignRoom(!showAssignRoom);
                    }}
                  ></ModalHeader>
                  <ModalBody className="pb-3 px-sm-2 mx-20">
                    <div>
                      <AssignRoom data1={data1} toggleModal={toggleModal} assignUnassign={true} toggleCloseAssign={toggleCloseAssign} />

                    </div>

                  </ModalBody>
                </Modal>
              </div>
              <div className="d-flex">
                <Button className="me-1" color="primary" type="submit" >
                  Complete Check In
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
      {/* </ModalBody>
      </Modal> */}



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
                <Button color="primary" className='text-center' onClick={() => setPopUp(false)} >
                  Ok
                </Button>
              </div>
            </ModalBody>
          </Modal>

        </div>
      }




      {checkinSharer && <Modal isOpen={checkinSharer} toggle={() => setCheckinSharer(!checkinSharer)} className='modal-dialog-centered'>
        <ModalHeader className='bg-transparent' toggle={() => setCheckinSharer(!checkinSharer)}></ModalHeader>
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>{checkinSharer}</h1>
            {/* <p>you want to submit this form ? </p> */}
          </div>
          <Col>
            <div className="button-container text-center">
              <Button className="me-1" color="primary" type="submit" onClick={GetSharer}>
                Yes
              </Button>
              <Button className="me-1" color="danger" onClick={variable} >
                No
              </Button>
            </div>
          </Col>
        </ModalBody>

      </Modal>}

    </div>
  );
};

export default CheckIn;