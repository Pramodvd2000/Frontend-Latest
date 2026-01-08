// ** Third Party Components
import InputNumber from 'rc-input-number'
import { Plus, Minus } from 'react-feather'
import React, { Component } from 'react';
// ** Custom Components
import Avatar from "@components/avatar";

import { useNavigate } from "react-router-dom";

// ** React Imports
import { useState } from "react";
// import axios from "axios";
// ** Third Party Components
import * as ReactDOM from 'react-dom';
import { User, X } from 'react-feather'

import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
// import App from "./waitListDataTable";
import Moment from 'moment';
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
import { format } from "date-fns";
import API_URL from '../../../config';
import InHouseGuest from './inHouseGuest';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

let RestaurantOptions = [
  // fetchx('http://122.166.2.21:14676/getrestaurantlist')
  // .then(result => result.json())
  // .then(resp => {
  // // //console.log(resp['data'])
  // RestaurantOptions = resp['data']
  // //console.log(RestaurantOptions)
  // })
]

let reason = [

  // fetchx(API_URL + '/getReason?hotelID=1')
  //   .then(result => result.json())
  //   .then(resp => {
  //     //console.log(resp['data'])
  //     reason = resp['data']

  //   })

]
let Roomcount = [
  // fetchx('http://122.166.2.21:14676/gettablecount?hotelID=1&storeID='+storeid)
  // .then(result => result.json())
  // .then(resp => {
  // //console.log(resp['data'])
  // Tablecount = resp['data']
  // //console.log(Tablecount[0]['tableCount'])
  // })
]

// let id=1;

const defaultValues = {
  TableNo: '',
  pax: '',
  Type: '',
  guestName: '',
  Departments: '',
  KOTType: ''
}

const TypeOptions = [
  { value: "NC KOT", label: "NC KOT" },
  { value: "Normal", label: "KOT" }
];

const roomStatus = [
  { value: 'Out Of Service', label: 'Out Of Service' },
  { value: 'Out Of Order', label: 'Out Of Order' },
  { value: 'Dirty', label: 'Dirty' },
  { value: 'Inspected', label: 'Inspected' },
  { value: 'Clean', label: 'Clean' },

]

let DeptOptions = [
  // fetchx('http://122.166.2.21:14676/getdepartments?hotelID=1')
  // .then(result => result.json())
  // .then(resp => {
  // //console.log(resp['data'])
  // DeptOptions = resp['data']
  // //console.log(DeptOptions)
  // })
]

localStorage.removeItem('id')
localStorage.removeItem('reservationStart')
localStorage.removeItem('reservationEnd')
const ValidationThirdPartyComponents = ({ floorid, roomAssign, RoomData, toggleModal, assignUnassign, toggleCloseAssign, toggleModal2, reservationID }) => {



  let navigate = useNavigate();
  const [assign, setAssign] = useState(false)

  const [orderbtn, setorderbtn] = useState(true);
  const [modaldata, setmodaldata] = useState('')
  const [checkdata, setcheckdata] = useState(false)
  const [tableorders, settableorders] = useState();
  const [reloadtable, setreloadtable] = useState(false);
  const [selectedRows, setSelectedRows] = useState([])
  const [show, setShow] = useState(false)
  const [data, setData] = useState(null);
  const [selectedValue, setSelectedOption] = useState('');
  const [showNCfields, setNCfields] = useState(false)
  const [selecteditem, setselecteditem] = useState("");
  const [rowData, setRowData] = useState();
  const [valueReason, setValueReason] = useState();
  const [ID, setId] = useState();
  const [RoomNumber, setRoomNumber] = useState(false)
  const [roomMove, setRoomMove] = useState(false)
  const [orderIDdisplay, setorderIDdisplay] = useState(false)
  const [roomMoveError, setRoomMoveError] = useState(false);
  const [assignRoomError, setAssignRoomError] = useState(false);
  const [reason, setReason] = useState([]);
  const [isRoomMoveButton, setIsRoomMoveButton] = useState(false);



  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      html: message.replace(/\n/g, '<br />'),
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }


  useEffect(() => {
    fetchx(API_URL + '/getReason?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        //console.log(resp['data'])
        setReason(resp['data'])

      })
  }, []);


  function modalClose() {
    toggleModal2()
  }

  const [checkBoxValue, setCheckBoxValue] = useState(0);
  const [checkboxChecked, setCheckboxChecked] = useState(false)

  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleDropdownChange = (event) => {
    setSelectedOption(event.value);

    //console.log(event.value); // print the selected value to console
    if (selectedValue == 'Out Of Service') {
      //console.log("hi")

    }
    else if (selectedValue == 'Out Of Order') {
      //console.log("hi")
    }

    else {

    }
  };


  const handleSuccess = (message) => {
    return MySwal.fire({
      title: message.message1,
      text: message.message2,
      icon: 'success',
    })
  }


  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const checkboxValue = isChecked ? 1 : 0;
    // //console.log(checkboxValue)
    setCheckBoxValue(checkboxValue)
    setCheckboxChecked(!checkboxChecked)
  }

  const onSubmit = (data) => {
    setData(data);

    let id = localStorage.getItem('id')
    //console.log(id)
    //console.log(data)
    if (data.floorID !== null && data.blockID !== null) {
      //console.log(data)
      let createmarketGroup = JSON.stringify({

        "roomStatus": selectedValue,

      })
      //console.log(createmarketGroup)
      let res = fetchx(API_URL + "/updateRoomStatus?id=" + localStorage.getItem('id'), {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then((res) => {
        //console.log(res);
        // if (res['status'] == 200) {
        // fetchx(API_URL + '/addOutOfOrderOrService')
        // .then(result => result.json())
        // .then(rowData => {
        // setRowData(rowData['data'])
        // //console.log(rowData['data'])
        // })
        // }
        if (res['status'] == 200) {
          if (data.fromDate !== null && data.toDate !== null) {
            //console.log(data)
            let createmarketGroup = JSON.stringify({
              "fromDate": (Moment(String(new Date(data.fromDate[0]))).format('YYYY-MM-DD')),
              "toDate": (Moment(String(new Date(data.toDate[0]))).format('YYYY-MM-DD')),
              "status": data.status,
              "returnStatus": 1,
              "remarks": data.remarks,
              "reasonID": data.reason.value,
              "roomID": localStorage.getItem('id')

            })
            //console.log(createmarketGroup)
            let res = fetchx(API_URL + "/addOutOfOrderOrService", {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: createmarketGroup
            }).then((res) => {
              //console.log(res);
            })
          }
        }
      });

    }


  };


  const RoomAssignSubmit = () => {

    if (assignUnassign === true) {

      let createasset = JSON.stringify({
        "sharingID": RoomData['sharingID'],
        "roomID": localStorage.getItem('roomid'),
        "fromDate": localStorage.getItem('reservationStart'),
        "toDate": localStorage.getItem('reservationEnd'),
        "frontOfficeStatus": 'Arrivals',
        "reservationID": RoomData.id,
        "checkBox": checkBoxValue,
        "hotelID": 1,
        "reasonID": valueReason,
        "reasonText": document.getElementById('reasonText').value
      });


      console.log(createasset);
      let res = fetchx(API_URL + "/assignRoomDuringCheckIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: createasset,
      }).then(data => data.json())
        .then((res) => {
          if (res.statusCode === 200) {
            if (toggleModal2 !== undefined) {
              handleSuccess({ message1: 'Assign Room Successful!!', message2: 'Successfully assigned the room' })
              modalClose()
              reservationID()
              return;
            }
            // toggleModal('assigned')
            toggleModal('assignedDuringCheckIn')
            toggleCloseAssign()
            setRoomNumber(false)
            handleSuccess({ message1: 'Assign Room Successful!!', message2: 'Successfully assigned the room' })

            // setTimeout(() => { navigate('/dashboard/frontdesk'); }, 500)

          }
          else {
            // toggleModal(1)
            setAssignRoomError(res.message)
          }
        });

    }


    else {

      let createasset = JSON.stringify({
        "sharingID": RoomData['sharingID'],
        "roomID": localStorage.getItem('roomid'),
        "fromDate": localStorage.getItem('reservationStart'),
        "toDate": localStorage.getItem('reservationEnd'),
        "frontOfficeStatus": 'Arrivals',
        "reservationID": RoomData.id,
        "checkBox": checkBoxValue,
        "hotelID": 1
      });

      // //console.log(data1['SubBookingId'])


      //console.log(createasset);
      let res = fetchx(API_URL + "/UpdateAssignRoom", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: createasset,
      }).then(data => data.json())
        .then((res) => {
          //console.log(res);
          if (res.statusCode === 200) {
            // if (toggleModal2 !== undefined) {
            //   handleSuccess({ message1: 'Assign Room Successful!!', message2: 'Successfully assigned the room' })
            //   modalClose()
            //   reservationID()
            //   return;
            // }
            handleSuccess({ message1: 'Assign Room Successful!!', message2: 'Successfully assigned the room' })
            // toggleModal('assigned')

            setTimeout(() => { navigate(''); }, 500)

          }
          else {
            setAssignRoomError(res.data)
          }
        });
    }

  }


  const RoomMoveSubmit = () => {
    if(valueReason === undefined){
return handleError("Please select reason!!")
    }


    setIsRoomMoveButton(true)
    var Today = format(new Date(), "yyyy-MM-dd")

    let RoomMoveJson = JSON.stringify({
      // "RoomTypeID": localStorage.getItem('reservationNewRoomTypeID'),
      "roomTypeID": localStorage.getItem('reservationOldRoomTypeID'),
      "RoomTypeID": String(RoomData.selectedValue),
      "reservationID": RoomData.data1.id,
      "newRoomID": localStorage.getItem('roomid'),
      "oldRoomID": RoomData.data1.room,
      "fromDate": Today,
      "toDate": RoomData.data1.departureDate,
      "hotelID": 1

    });

    // //console.log(data1['SubBookingId'])


    //console.log(RoomMoveJson);
    // let res = fetchx("http://122.166.2.21:14700/updateRoomMoveAssign", {
    let res = fetchx(API_URL + "/updateRoomMoveAssign", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: RoomMoveJson,
    }).then(data => data.json())
      .then((res) => {
        //console.log(res);
        // //console.log(document.querySelector('#reason'))
        // let all=document.getElementById('reason').value
        // //console.log(valueReason)
        if (res.statusCode === 200) {

          // if (res['status'] == 200) {

          let UpdateRoomMove = JSON.stringify({
            "hotelID": "1",
            "reservationID": RoomData.data1.id,
            "sharingID": RoomData.data1.sharingID,
            "roomTypeID": localStorage.getItem('reservationOldRoomTypeID'),
            "RoomTypeID": RoomData.selectedValue,
            "oldRoomID": RoomData.data1.room,
            "newRoomID": localStorage.getItem('roomid'),
            "reasonID": valueReason,
            "reasonText": document.getElementById('reasonText').value
          });
          //console.log(UpdateRoomMove)
          let res = fetchx(API_URL + `/addroommove`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: UpdateRoomMove,
          }).then((res) => {
            //console.log(res);
            if (res.status === 200) {
              handleSuccess({ message1: 'Room Move Successful!!', message2: 'Successfully moved the room' })
              setTimeout(() => { navigate('/dashboard/frontdesk'); }, 1000)
              setIsRoomMoveButton(false)


            }
          })
          setRoomMoveError(false)

          // setTimeout(() => { navigate('/dashboard/testFrontDesk'); }, 1000)

        }
        else {
          setIsRoomMoveButton(false)
          setRoomMoveError(res.message)
        }

      });
  }


  const AssignCancel = () => {
    setRoomNumber(false)
  }

  const RoomMoveCancel = () => {
    setRoomMove(false)
  }

  const RoomMoveCancelAndError = () => {
    setRoomMove(false)
    setRoomMoveError(false)
  }

  const AssignRoomMoveCancelAndError = () => {
    setRoomNumber(false)
    setAssignRoomError(false)
  }

  if (roomAssign == false) {
    useEffect(() => {
      let url = API_URL + `/getRoomsForRoomMove?fromDate=${localStorage.getItem('reservationStart')}&toDate=${localStorage.getItem('reservationEnd')}&floorID=${floorid}&roomType=${localStorage.getItem('reservationRoomType')}`;
      //console.log(url)
      fetchx(url)
        .then(result => result.json())
        .then(resp => {
          //console.log(resp)
          Roomcount = resp['data']
          //console.log(Roomcount)
          setcheckdata(true)


        })

    }, []);
  }
  else if (roomAssign == true) {

    useEffect(() => {

      let url = API_URL + `/getRoomBasedOnStatusNew?fromDate=${localStorage.getItem('reservationStart')}&toDate=${localStorage.getItem('reservationEnd')}&floorID=${floorid}&roomType=${localStorage.getItem('reservationRoomType')}&sharingID=${RoomData['sharingID']}`;
      //console.log(url)
      fetchx(url)
        .then(result => result.json())
        .then(resp => {
          //console.log(resp)
          Roomcount = resp['data']
          //console.log(Roomcount)
          setcheckdata(true)


        })


    }, []);
  }






  function Alert() {
    alert("Do You Really Want to Change Room Status from " + localStorage.getItem('roomstatus') + " to " + selectedValue + " for Room Number " + localStorage.getItem('roomno') + " ?")
    setTimeout(() => { navigate('/dashboard/availability'); }, 200)
  }

  function AlertForAssign() {
    // alert("Do You Really Want To Assign Room No."+localStorage.getItem('roomno'))
    RoomAssignSubmit();
    // setTimeout(() => { navigate('/dashboard/testFrontDesk');},1000)


  }


  function AlertForRoomMove() {
    // alert("Do You Really Want To Assign Room No."+localStorage.getItem('roomno'))
    RoomMoveSubmit();
    // setTimeout(() => { navigate('/dashboard/testFrontDesk');},1000)


  }

  const handleChange = (selectedOption) => {
    setValueReason(selectedOption.value);
    //console.log(selectedOption.value)
  };


  function getButtonsUsingForLoop(num) {
    let color = '';
    const array = []

    for (var i = 1; i <= num; i++) {

      if (Roomcount[i - 1]['roomStatus'] == 'Occupied' || Roomcount[i - 1]['roomStatus'] == 'Clean') {
        color = 'primary'
      }
      else if (Roomcount[i - 1]['roomStatus'] == 'Dirty') {
        color = 'danger'
      }
      else if (Roomcount[i - 1]['roomStatus'] == 'Out Of Order') {
        color = 'secondary'

      }
      else if (Roomcount[i - 1]['roomStatus'] == 'Out Of Service') {
        color = 'warning'

      }
      // }
      else if (Roomcount[i - 1]['roomStatus'] == 'Inspected') {
        color = 'success'
      }
      const tableid = i
      //console.log(Roomcount[i - 1]['roomNumber'])
      const roomno = Roomcount[i - 1]['roomNumber']
      const roomtype = Roomcount[i - 1]['roomType']
      const fstatus = Roomcount[i - 1]['frontOfficeStatus']
      const roomstatus = Roomcount[i - 1]['roomStatus']
      const id = Roomcount[i - 1]['id']
      // localStorage.setItem('id', id)
      // setId(id)
      // //console.log(id)
      array.push(
        <Button color={color} className="me-0.5" style={{
          'margin-right': '10px', height: '150px', width: '130px',
          'margin-bottom': '10px'
        }}
          id={tableid}
          name="bt"
          // onClick={alert("test")}
          // onClick={handleClick}
          onClick={() => {
            handleClick(roomno, roomtype, fstatus, roomstatus, id)
          }}
        >
          <p><h5 style={{ color: 'white', fontWeight: 'bold' }}>{Roomcount[i - 1]['roomNumber']}</h5> ({Roomcount[i - 1]['roomType']})</p>
          {/* <p>{Roomcount[i - 1]['roomType']}</p> */}
          <p>{Roomcount[i - 1]['frontOfficeStatus']}</p>
          <p>{Roomcount[i - 1]['roomStatus']}</p>



        </Button>)
    }

    return array
  }
  function handleClick(roomno, roomtype, fstatus, roomstatus, id) {
    //console.log(roomno, roomtype, fstatus, roomstatus, id)
    localStorage.setItem('roomid', id)
    let myJson = { "roomno": roomno, "roomtype": roomtype, "fstatus": fstatus, "roomstatus": roomstatus, "id": id }
    localStorage.setItem('roomstatus', roomstatus)
    localStorage.setItem('roomno', roomno)
    // localStorage.setItem('id', id)
    //console.log(localStorage.getItem('roomid'))
    localStorage.setItem('reload', true)
    setmodaldata(myJson)
    //console.log(roomAssign)
    // if(roomMove==true){
    // setRoomMove(true)

    // }
    if (roomAssign == false) {
      // setAssign(true)
      setRoomMove(true)

    }
    else {
      setRoomNumber(true)
    }
    //console.log(myJson)

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
              <Button.Ripple style={{ 'margin-right': '10px', 'margin-bottom': '10px' }} color='danger' size='sm' >Dirty</Button.Ripple>
              <Button.Ripple style={{ 'margin-right': '10px', 'margin-bottom': '10px' }} color='primary' size='sm' >Clean/Occupied</Button.Ripple>
              <Button.Ripple style={{ 'margin-right': '10px', 'margin-bottom': '10px' }} color='secondary' size='sm' >Out of order</Button.Ripple>
              <Button.Ripple style={{ 'margin-right': '10px', 'margin-bottom': '10px' }} color='warning' size='sm' >Out of service</Button.Ripple>
            </div>
          </Card>
        </Col>

      </Row>

      <Modal isOpen={assign} toggle={() => setAssign(!assign)} className='demo-inline-spacing'>

        <ModalHeader className='bg-transparent' toggle={() => setAssign(!assign)}></ModalHeader>

        <ModalBody className='pb-3 px-sm-1 mx-20'>
          <div>
            {/* <AssignRoom/> */}
            {modaldata.length != 0 &&
              <>
                <h2>Room Data </h2>
                <h5>Room Number : {modaldata['roomno']}</h5>
                <h5>Room Type : {modaldata['roomtype']}</h5>
                <h5>Room Status : {modaldata['roomstatus']}</h5>
                <h5>Front Office Status : {modaldata['fstatus']}</h5>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <br></br>
                  <Col md='6' sm='12' className='mb-1'>
                    <div className='mb-1'>
                      {/* <Label className='form-label' for='roomStatus'>
 
 </Label> */}
                      <Controller
                        id='roomStatus'
                        control={control}
                        name='roomStatus'
                        render={({ }) => (
                          <Select
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
                  {selectedValue === 'Out Of Service' && (
                    <div>
                      <Row>
                        <Col md='6' sm='12' className='mb-1'>
                          <div className="mb-1">
                            <Label className="form-label" for="fromDate">
                              From Date
                            </Label>
                            <Controller
                              control={control}
                              id='fromDate'
                              name='fromDate'
                              render={({ field }) => (
                                <Flatpickr
                                  // required
                                  placeholder='YYYY-MM-DD'
                                  {...field}
                                  options={{ allowInput: true }}
                                  className={classnames('form-control', {
                                    'is-invalid': data !== null && data.fromDate === null
                                  })}
                                />
                              )}
                            />
                          </div>
                        </Col>
                        <Col md='6' sm='12' className='mb-1'>
                          <div className='mb-1'>
                            <Label className='form-label' for='toDate'>
                              To Date
                            </Label>
                            <Controller
                              control={control}
                              id='toDate'
                              name='toDate'
                              render={({ field }) => (
                                <Flatpickr
                                  placeholder='YYYY-MM-DD'
                                  {...field}
                                  options={{ allowInput: true }}
                                  className={classnames('form-control', {
                                    'is-invalid': data !== null && data.toDate === null
                                  })}
                                />
                              )}
                            />
                          </div>

                        </Col>
                        <Col md='6' sm='12' className='mb-1'>
                          <div className="mb-1">
                            <Label className="form-label" for="status">
                              Status
                            </Label>
                            <Controller
                              id='status'
                              control={control}
                              name='status'
                              render={({ field }) => (
                                <Input
                                  placeholder='Status'
                                  isClearable
                                  // options={subBookingId}
                                  classNamePrefix='select'
                                  theme={selectThemeColors}
                                  className={classnames('react-select', { 'is-invalid': data !== null && data.status === null })}
                                  {...field}
                                />
                              )}
                            />

                          </div>
                        </Col>
                        <Col md='6' sm='12' className='mb-1'>
                          <div className="mb-1">
                            <Label className="form-label" for="remarks">
                              Remarks
                            </Label>
                            <Controller
                              id='remarks'
                              control={control}
                              name='remarks'
                              render={({ field }) => (
                                <Input
                                  placeholder='Remarks'
                                  isClearable
                                  // options={subBookingId}
                                  classNamePrefix='select'
                                  theme={selectThemeColors}
                                  className={classnames('react-select', { 'is-invalid': data !== null && data.remarks === null })}
                                  {...field}
                                />
                              )}
                            />

                          </div>
                        </Col>
                        <Col md='6' sm='12' className='mb-1'>
                          <div className='mb-1'>
                            <Label className='form-label' for='reason'>
                              Reason
                            </Label>
                            <Controller
                              id='reason'
                              control={control}
                              name='reason'
                              render={({ field }) => (
                                <Select
                                  isClearable
                                  options={reason}
                                  classNamePrefix='select'
                                  theme={selectThemeColors}
                                  className={classnames('react-select', { 'is-invalid': data !== null && data.reason === null })}
                                  {...field}
                                />
                              )}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>

                  )}
                  {selectedValue === 'Out Of Order' && (
                    <div>
                      <Row>
                        <Col md='6' sm='12' className='mb-1'>
                          <div className="mb-1">
                            <Label className="form-label" for="fromDate">
                              From Date
                            </Label>
                            <Controller
                              control={control}
                              id='fromDate'
                              name='fromDate'
                              render={({ field }) => (
                                <Flatpickr
                                  // required
                                  placeholder='YYYY-MM-DD'
                                  {...field}
                                  options={{ allowInput: true }}
                                  className={classnames('form-control', {
                                    'is-invalid': data !== null && data.fromDate === null
                                  })}
                                />
                              )}
                            />
                          </div>
                        </Col>
                        <Col md='6' sm='12' className='mb-1'>
                          <div className='mb-1'>
                            <Label className='form-label' for='toDate'>
                              To Date
                            </Label>
                            <Controller
                              control={control}
                              id='toDate'
                              name='toDate'
                              render={({ field }) => (
                                <Flatpickr
                                  placeholder='YYYY-MM-DD'
                                  {...field}
                                  options={{ allowInput: true }}
                                  className={classnames('form-control', {
                                    'is-invalid': data !== null && data.toDate === null
                                  })}
                                />
                              )}
                            />
                          </div>

                        </Col>
                        <Col md='6' sm='12' className='mb-1'>
                          <div className="mb-1">
                            <Label className="form-label" for="status">
                              Status
                            </Label>
                            <Controller
                              id='status'
                              control={control}
                              name='status'
                              render={({ field }) => (
                                <Input
                                  placeholder='Status'
                                  isClearable
                                  // options={subBookingId}
                                  classNamePrefix='select'
                                  theme={selectThemeColors}
                                  className={classnames('react-select', { 'is-invalid': data !== null && data.status === null })}
                                  {...field}
                                />
                              )}
                            />

                          </div>
                        </Col>
                        <Col md='6' sm='12' className='mb-1'>
                          <div className="mb-1">
                            <Label className="form-label" for="remarks">
                              Remarks
                            </Label>
                            <Controller
                              id='remarks'
                              control={control}
                              name='remarks'
                              render={({ field }) => (
                                <Input
                                  placeholder='Remarks'
                                  isClearable
                                  // options={subBookingId}
                                  classNamePrefix='select'
                                  theme={selectThemeColors}
                                  className={classnames('react-select', { 'is-invalid': data !== null && data.remarks === null })}
                                  {...field}
                                />
                              )}
                            />

                          </div>
                        </Col>
                        <Col md='6' sm='12' className='mb-1'>
                          <div className='mb-1'>
                            <Label className='form-label' for='reason'>
                              Reason
                            </Label>
                            <Controller
                              id='reason'
                              control={control}
                              name='reason'
                              render={({ field }) => (
                                <Select
                                  isClearable
                                  options={reason}
                                  classNamePrefix='select'
                                  theme={selectThemeColors}
                                  className={classnames('react-select', { 'is-invalid': data !== null && data.reason === null })}
                                  {...field}
                                />
                              )}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>

                  )}
                  <Col md='4' sm='12' className='mb-1'>
                    <div className="d-flex">
                      <Button className="me-1" color="primary" type="submit" onClick={Alert}>
                        Assign
                      </Button>
                    </div>
                  </Col>
                </Form>
              </>
            }
          </div>
        </ModalBody>
      </Modal>

      {/* Room Assign */}
      <Modal isOpen={RoomNumber} toggle={() => setRoomNumber(!RoomNumber)} className='modal-dialog-centered'>
        <ModalHeader className='bg-transparent' toggle={() => setRoomNumber(!RoomNumber)}></ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>

          <div>
            {/* <Card> */}
            {/* <Col md='4' sm='12' className='mb-1'> */}
            <Col md='6' sm='12' className='mb-1'>

              <h5>Do You Want Assign Room Number : <></><b>{localStorage.getItem('roomno')}</b></h5>
            </Col>
            {/* <Col md='4' sm='12' > */}
            <Col md='6' sm='12' className='mb-1'>

              <div className='form-check form-check-inline'>
                <Input type='checkbox' id='basic-cb-unchecked' checked={checkboxChecked} onChange={handleCheckboxChange} />
                <Label for='dnm' className='form-check-label'>
                  DNM
                </Label>
              </div>
            </Col>
            {assignUnassign === true &&
              <div>
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
              </div>
            }
            <ModalFooter>
              <div className="d-flex">
                <Button className="me-1" color="primary" type="submit" onClick={AlertForAssign}>
                  Assign
                </Button>
                <Button outline color='secondary' className='me-1' onClick={AssignCancel}>
                  Cancel
                </Button>
                {/* <Button
 outline
 color="secondary"
 type="reset"
 onClick={handleReset}
 >
 Reset
 </Button> */}
              </div>
            </ModalFooter>
            {/* </Col> */}

            {/* </Card> */}
          </div>
        </ModalBody>
      </Modal>

      {/* Room Move */}
      <Modal isOpen={roomMove} toggle={() => setRoomMove(!roomMove)} className='modal-dialog-centered'>
        <ModalHeader className='bg-transparent' toggle={() => setRoomMove(!roomMove)}></ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>

          <div>
            {/* <Card> */}
            {/* <Col md='4' sm='12' className='mb-1'> */}
            {roomMove && <h5>Would You like to Move Room from <b>{RoomData.data1.roomNumber}</b> to <b>{localStorage.getItem('roomno')}</b></h5>}
            <h5>RoomType <b>{localStorage.getItem('reservationRoomType')}</b></h5>
            <Row>
              <Col md='5' sm='12'>
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
              <Col md='5' sm='12' className='mb-1'>
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
            </Row>
            {/* </Col> */}
            {/* <Col md='4' sm='12' > */}

            <ModalFooter>
              <div className="d-flex">
                <Button className="me-1" color="primary" type="submit" onClick={AlertForRoomMove} disabled={isRoomMoveButton}
                >
                  Room Move
                </Button>
                <Button outline color='secondary' className='me-1' onClick={RoomMoveCancel}>
                  Cancel
                </Button>
                {/* <Button
 outline
 color="secondary"
 type="reset"
 onClick={handleReset}
 >
 Reset
 </Button> */}
              </div>
            </ModalFooter>
            {/* </Col> */}

            {/* </Card> */}
          </div>
        </ModalBody>
      </Modal>
      {/* Room move Error message */}
      {roomMoveError &&
        <div className='disabled-animation-modal'>
          <Modal isOpen={roomMoveError} toggle={() => setRoomMoveError(!roomMoveError)} className='modal-sm' > {/*onClosed={onDiscard}*/}
            <ModalHeader className='modal-sm' toggle={() => {
              setRoomMoveError(!roomMoveError)
            }}>Need To Check..</ModalHeader>
            <ModalBody className='pb-3 px-sm-2 mx-20'>
              <div>
                <b>{roomMoveError}</b>
                <br></br>
                <br></br>
                <Button color="primary" className='text-center' onClick={RoomMoveCancelAndError} >
                  Ok
                </Button>
              </div>
            </ModalBody>
          </Modal>

        </div>
      }

      {assignRoomError &&
        <div className='disabled-animation-modal'>
          <Modal isOpen={assignRoomError} toggle={() => setAssignRoomError(!assignRoomError)} className='modal-sm' > {/*onClosed={onDiscard}*/}
            <ModalHeader className='modal-sm' toggle={() => {
              setAssignRoomError(!assignRoomError)
            }}>Need To Check..</ModalHeader>
            <ModalBody className='pb-3 px-sm-2 mx-20'>
              <div>
                <b>{assignRoomError}</b>
                <br></br>
                <br></br>
                <Button color="primary" className='text-center' onClick={AssignRoomMoveCancelAndError} >
                  Ok
                </Button>
              </div>
            </ModalBody>
          </Modal>

        </div>
      }
    </div>
  )
}

export default ValidationThirdPartyComponents;
