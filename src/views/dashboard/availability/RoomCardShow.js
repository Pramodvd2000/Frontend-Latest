

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
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import API_URL from '../../../config';
let RestaurantOptions = [
  // fetchx('http://122.166.2.21:14676/getrestaurantlist')
  //   .then(result => result.json())
  //   .then(resp => {
  //     // console.log(resp['data'])
  //     RestaurantOptions = resp['data']
  //     console.log(RestaurantOptions)
  //   })
]

let reason = [

  fetchx(API_URL + '/getReason?hotelID=1')
  .then(result => result.json())
  .then(resp => {
    console.log(resp['data'])
    reason = resp['data']

  })

]
let Roomcount = [
  //   fetchx('http://122.166.2.21:14676/gettablecount?hotelID=1&storeID='+storeid)
  //   .then(result => result.json())
  //   .then(resp => {
  //     console.log(resp['data'])
  //     Tablecount = resp['data']
  //     console.log(Tablecount[0]['tableCount'])
  //   })
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
  //   .then(result => result.json())
  //   .then(resp => {
  //     console.log(resp['data'])
  //     DeptOptions = resp['data']
  //     console.log(DeptOptions)
  //   })
]

localStorage.removeItem('id')
const ValidationThirdPartyComponents = ({ floorid,roomAssign,RoomData }) => {
// console.log(RoomData)
  // console.log(sessionStorage.getItem('Rest_name'))


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
  const [ID, setId] = useState();
  const [RoomNumber,setRoomNumber] = useState(false)
  const [orderIDdisplay, setorderIDdisplay] = useState(false)
  const [tableData, setTableData] = useState([
    // {id: 1, menuitem: 'item1', qty: 1},
    // {id: 2, menuitem: 'item2', qty: 1},
  ]);

  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleDropdownChange = (event) => {
    setSelectedOption(event.value);

    console.log(event.value); // print the selected value to console
    if (selectedValue == 'Out Of Service') {
      console.log("hi")
      
    }
    else if (selectedValue == 'Out Of Order') {
      console.log("hi")
    }

    else {

    }
  };


  const onSubmit = (data) => {
    setData(data);

    let id = localStorage.getItem('id')
    console.log(id)
    console.log(data)
    if (data.floorID !== null && data.blockID !== null) {
      console.log(data)
      let createmarketGroup = JSON.stringify({

        "roomStatus": selectedValue,
 
      })
      console.log(createmarketGroup)
      let res = fetchx(API_URL + "/updateRoomStatus?id=" + localStorage.getItem('id'), {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then((res) => {
        console.log(res);
        // if (res['status'] == 200) {
        //   fetchx(API_URL + '/addOutOfOrderOrService')
        //     .then(result => result.json())
        //     .then(rowData => {
        //       setRowData(rowData['data'])
        //       console.log(rowData['data'])
        //     })
        // }
        if (res['status'] == 200) {
        if (data.fromDate !== null && data.toDate !== null) {
          console.log(data)
          let createmarketGroup = JSON.stringify({
            "fromDate":(Moment(String(new Date(data.fromDate[0]))).format('YYYY-MM-DD')),
            "toDate":(Moment(String(new Date(data.toDate[0]))).format('YYYY-MM-DD')),
            "status":data.status,
            "returnStatus":1,
            "remarks":data.remarks,
            "reasonID":data.reason.value,
            "roomID":localStorage.getItem('id')
     
          })
          console.log(createmarketGroup)
          let res = fetchx(API_URL + "/addOutOfOrderOrService", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: createmarketGroup
          }).then((res) => {
            console.log(res);
          })
      }
    }
      });
     
  }

  
  };


  const RoomAssignSubmit=()=>{
    let createasset = JSON.stringify({
      // "hotelID": data.hotelID,
      // "SubBookingId": data1.SubBookingId,
      // "fullName": data1.fullName,
        // "assignedRoomType": data1.assignedRoomType,
        // "floorID": data1.floor.label,
        // "RoomNumber": data1.RoomNumber.value,
        "RoomNumber":localStorage.getItem('roomno'),
        "PmsStatus": 'Assigned'
      });
  
    // console.log(data1['SubBookingId'])
  
        
      console.log(createasset);
      let res = fetchx(API_URL + "/updateReservationBooking?id="+localStorage.getItem('RoomCellID'), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: createasset,
      }).then((res) => {
        console.log(res);
  
        
      });
  }


  useEffect(() => {
    // console.log(localStorage.getItem('RestaurantSelected'))
    // console.log(localStorage.getItem('storeID'))
    fetchx(API_URL + '/getRoomInformation?floorID=' + floorid)
      .then(result => result.json())
      .then(resp => {
        console.log(resp)
        Roomcount = resp['data']
        console.log(Roomcount)
        setcheckdata(true)


      })
    //   .then(data=>{
    //   fetchx('http://122.166.2.21:14676/getAllTableOrderStatus?hotelID=1&storeID='+localStorage.getItem('storeID'))
    //   .then(result => result.json())
    //   .then(resp => {
    //     console.log(resp['data'])
    //     tablestatus = resp['data']
    //     setcheckdata(true)
    //   })
    // })
  }, []);

  function Alert() {
    alert("Do You Really Want to Change Room Status from " + localStorage.getItem('roomstatus') + " to " + selectedValue + " for Room Number " + localStorage.getItem('roomno')+" ?")
    setTimeout(() => { navigate('/dashboard/availability'); }, 200)
  }

  function AlertForAssign(){
    // alert("Do You Really Want To Assign Room No."+localStorage.getItem('roomno'))
    RoomAssignSubmit();
    setTimeout(() => { navigate('/dashboard/frontDesk');},1000)


  }

  function getButtonsUsingForLoop(num) {
    // console.log(Roomcount.length)
    // console.log(tablestatus[0])
    let color = '';
    const array = []

    for (var i = 1; i <= num; i++) {
      // console.log(i)
      // console.log(tablestatus[i-1])
      // console.log(RestaurantOptions[i])
      // console.log((RestaurantOptions[i]['value']))
      //   let Restaurant = RestaurantOptions[i]['restaurantName']
      // if(tablestatus.length==num){
      if (Roomcount[i - 1]['roomStatus'] == 'Occupied' ||Roomcount[i - 1]['roomStatus'] == 'Clean') {
        color = 'primary'
      }
      else if (Roomcount[i - 1]['roomStatus'] == 'Dirty') {
        color = 'danger'
      }
      else if (Roomcount[i - 1]['roomStatus'] == 'Out Of Order') {
        color = 'info'

      }
      else if (Roomcount[i - 1]['roomStatus'] == 'Out Of Service') {
        color = 'warning'

      }
      // }
      else if (Roomcount[i - 1]['roomStatus'] == 'Inspected') {
        color = 'success'
      }
      const tableid = i
      const roomno = Roomcount[i - 1]['roomNumber']
      const roomtype = Roomcount[i - 1]['roomType']
      const fstatus = Roomcount[i - 1]['frontOfficeStatus']
      const roomstatus = Roomcount[i - 1]['roomStatus']
      const id = Roomcount[i - 1]['id']
      // localStorage.setItem('id', id)
      // setId(id)
      // console.log(id)
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
         <p><h5 style={{color: 'white', fontWeight: 'bold'}}>{Roomcount[i - 1]['roomNumber']}</h5> ({Roomcount[i - 1]['roomType']})</p>
          {/* <p>{Roomcount[i - 1]['roomType']}</p> */}
          <p>{Roomcount[i - 1]['frontOfficeStatus']}</p>
          <p>{Roomcount[i - 1]['roomStatus']}</p>



        </Button>)
    } 

    return array
  }
  function handleClick(roomno, roomtype, fstatus, roomstatus, id) {
    console.log(roomno, roomtype, fstatus, roomstatus, id)
    localStorage.setItem('id', id)
    let myJson = { "roomno": roomno, "roomtype": roomtype, "fstatus": fstatus, "roomstatus": roomstatus, "id": id }
    localStorage.setItem('roomstatus', roomstatus)
    localStorage.setItem('roomno', roomno)
    localStorage.setItem('id', id)
    console.log(localStorage.getItem('id', id))
    localStorage.setItem('reload',true)
    setmodaldata(myJson)
    console.log(roomAssign)
    if(roomAssign==false){
    setAssign(true)
}
else{
  setRoomNumber(true)
}
    console.log(myJson)

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
              <Button.Ripple style={{ 'margin-right': '10px', 'margin-bottom': '10px' }} color='info' size='sm'  >Out of order</Button.Ripple>
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
                <h2>Room Data  </h2>
                <h5>Room Number : <h4>{modaldata['roomno']}</h4></h5>
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
                {selectedValue === 'Out Of Service'  && (
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
                      Submit
                    </Button>
                  </div>
                </Col>
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
          {/* <Card> */}
        {/* <Col md='4' sm='12' className='mb-1'> */}
          <h5>Do Really You Want Assign Room Number  : <></><b>{localStorage.getItem('roomno')}</b></h5>
          {/* </Col> */}
          {/* <Col md='4' sm='12' > */}
          <ModalFooter>
        <div className="d-flex">
            <Button className="me-1" color="primary" type="submit" onClick={AlertForAssign}>
              Submit
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

    </div>
  )
}

export default ValidationThirdPartyComponents;