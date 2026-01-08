import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'

// import Profile from './profile'
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import { selectThemeColors } from '@utils'
import Moment from 'moment'
import { useNavigate } from "react-router-dom"
import * as ReactDOM from 'react-dom'
import GuestProfile from '../../dashboard/reservation/guestProfile/index'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

// ** Reactstrap Imports
import {
  AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, Accordion, UncontrolledAccordion
} from 'reactstrap'


import ConfirmedDetails from "../reservation/confirmedDetails"

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import API_URL from '../../../config'


const colourOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
]


const children = [
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
]


const defaultValues = {
  checkIn: null,
  checkOut: null,
  adult: null,
  children: null,
  quantity: null,
}


const AccordionUncontrolled = (data1) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState('1')
  const [basicModal, setBasicModal] = useState(false)
  const [guestProfileModal, setGuestProfileModal] = useState(false)
  const [data, setData] = useState(null)
  const { handleSubmit, control, watch } = useForm({ defaultValues })
  const [rowData, setRowData] = useState()
  const [assign, setAssign] = useState(false)
  const [filldata, setfilldata] = useState('')
  const gridRef = useRef()
  const [popUp, setPopUp] = useState();
  const [dailyRates, setDailyRates] = useState();
  const [adultCount, setAdultCount] = useState();
  const [confirmed, setConfirmed] = useState();
  const [MainResData, setMainResData] = useState();
  const [checkShow, setShowCheck] = useState(true);
  const [isClicked, setIsClicked] = useState(false);

const [Today, setToday] = useState()



  useEffect(() => {
    const hotelIDData = JSON.stringify({
    hotelID: 1
    })
    fetchx(API_URL + "/getBusinessDate", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: hotelIDData
    }).then((res) => res.json())
    .then(postres => {
    const today = new Date(postres['data'][0]['businessDate']);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
    })
    }, []);


  //API get main reservation details
  useEffect(() => {
    fetchx(API_URL + `/getMainReservationDetails?sharingID=${data1.data1.sharingID}`)
      .then(result => result.json())
      .then(rowData2 => {
        if (rowData2.statusCode === 200) {
          setMainResData(rowData2['data'][0])
        }
      })
  }, []);

console.log(MainResData)

  // Success modal
  const handleSuccess = () => {
    return MySwal.fire({
      title: 'Sharer Added !!',
      text: 'Sharer Added Successfully !!',
      icon: 'success',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    })
  }


  //ag-grid column definition
  const defaultColDef1 = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ))


  //Reservation API
  const onSubmit = data => {
    console.log(data)
    if (data.checkIn1 === null && data.checkOut1 === null) {
      handleError("Arrival Date and Departure Date is Mandatory")
      setShowCheck(false)
    }
    else if (data.checkIn1 === null || data.checkIn1.length === 0) {
      handleError("Arrival Date is Mandatory")
      setShowCheck(false)
      
    }
    else if (data.checkOut1 === null || data.checkOut1.length === 0) {
      handleError("Departure Date is Mandatory")
      setShowCheck(false)
    }

    else {
      setShowCheck(true)

      const fetchDailyDetails = JSON.stringify({
        hotelID: data1.data1.hotelID,
        fromDate: (Moment(String(new Date(checkIn))).format('YYYY-MM-DD')) ? (Moment(String(new Date(checkIn))).format('YYYY-MM-DD')) : MainResData.arrivalDate,
        toDate: (Moment(String(new Date(checkOut))).format('YYYY-MM-DD')) ? (Moment(String(new Date(checkOut))).format('YYYY-MM-DD')) : MainResData.departureDate,
        reservationID: data1.data1.id,
        Adults: data1.data1.numberOfAdults,
        source: data1.data1.Type,
        sharingID: data1.data1.sharingID
      })
      fetchx(API_URL + `/fetchDailyDetailsSharer`, {
        // fetch(`http://122.166.2.21:14702/fetchDailyDetailsSharer`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: fetchDailyDetails
      }).then(result => result.json())
        .then(rowData => {
          setDailyRates(rowData['data'])
          if (rowData.message && rowData.statusCode !== 200) {
            handleError(rowData.message)
          }
        })
    }
  }


  // Final submit 
  function AddFinalReservation() {
    setIsClicked(true)
    const addTempTables = JSON.stringify({
      hotelID: data1.data1.hotelID,
      tempReservationID: data1.data1.tempReservationID,
      guestProfileID: localStorage.getItem('guestProfileIDAddSharer'),
      fromDate: (Moment(String(new Date(checkIn))).format('YYYY-MM-DD')),
      toDate: (Moment(String(new Date(checkOut))).format('YYYY-MM-DD')),
      Adults: data1.data1.numberOfAdults,
      Childrens: data1.data1.numberOfChildren,
      reservationID: data1.data1.id,
      source: data1.data1.Type,
      sharingID: data1.data1.sharingID
    })
    // fetch(`http://122.166.2.21:14702/companyInfoBookingInfoDummyResSharer`, {
    fetchx(API_URL + `/companyInfoBookingInfoDummyResSharer`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: addTempTables
    }).then(data => data.json())
      .then(res => {
        if (res.statusCode === 200) {
          handleSuccess()
          
          setTimeout(() => { navigate('/dashboard/frontdesk'); }, 500)
          setIsClicked(false)
        }
        else if (res.message) {
          handleError(res.message)
          setIsClicked(false)

          // setPopUp(res.message)
        }
      })
  }


  const modalClose = () => {
    setBasicModal(false)
  }


  //cell click listener
  const cellClickedListener1 = useCallback(event => {
    //console.log('cellClicked', event)
  }, [])


  const handleReset1 = () => {
    window.location.reload()
  }


  //Accordian toggle button
  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }


  //Guest Profile search ag-grid Button
  const [columnDefs] = useState([
    {
      headerName: 'Guest Name',
      suppressSizeToFit: true,
      width: 280,
      valueGetter: function (params) {
        const salutation = params.data.s;
        const firstName = params.data.f;
        const lastName = params.data.l;
        // Check if salutation is present and add a dot
        const fullName = salutation ? `${salutation} ${firstName} ${lastName}` : `${firstName} ${lastName}`;
        return fullName;
      },
    },    
    { headerName: 'Company Name', field: 'c', suppressSizeToFit: true, width: 240 },
    {
      headerName: "Action",
      maxWidth: 140,
      cellRenderer: () => {
        return (<Button required color='primary' onClick={() => setOpen('3')} >Proceed</Button>)
      }

    },
    {
      cellRenderer: () => {
        return (<Button color='primary' onClick={() => setAssign(!assign)} >View Profile</Button>)
      }
    }
  ])


  const [DailyRates] = useState([
    { headerName: 'Date', field: 'date', maxWidth: 128 },
    { headerName: 'RateCode', field: 'rateCode', suppressSizeToFit: true, maxWidth: 125 },
    { headerName: 'RoomType', field: 'roomType', suppressSizeToFit: true, maxWidth: 125 },
    { headerName: 'Package', field: 'packageCode', suppressSizeToFit: true, maxWidth: 125 },
    { headerName: 'Total Before Discount', field: 'totalBeforeDiscount', maxWidth: 195 },
    { headerName: 'Total Discount', field: 'totalDiscount', suppressSizeToFit: true, maxWidth: 150 },
    { headerName: 'Total After Discount', field: 'total', suppressSizeToFit: true, maxWidth: 195 },
    { headerName: 'Base Rate', field: 'baseprice', suppressSizeToFit: true, maxWidth: 150 },
    { headerName: 'Extra Adult Rate', field: 'extraAdultPrice', suppressSizeToFit: true, maxWidth: 170 },
    { headerName: 'Children Rate', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 150 },
    { headerName: 'Package Rate', field: 'packageRate', suppressSizeToFit: true, maxWidth: 150 },
  ])


  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ))


  // error handling for same guest addition
  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }




  //ag-grid cell clcked value
  const cellClickedListener = useCallback(event => {
    fetchx(API_URL + `/getAllGuestDetails?guestID=${event['data'].id}`)
    .then(result => result.json())
    .then(rowData => {
      setfilldata(rowData['data'][0])
    })
    localStorage.setItem('CompanyNameIDAddSharer', event['data']['accountName'])
    localStorage.setItem('guestProfileIDAddSharer', event['data']['id'])
    localStorage.setItem('companyIDAddSharer', event['data']['companyID'])
    let guest = localStorage.getItem('guestProfileIDAddSharer')
    if (data1.data1.guestID === parseInt(guest)) {
      handleError('You cannot add main guest as sharer !!')
      setOpen('1')
    }
  })


  //API to get all the guests
  useEffect(() => {
    ReactDOM.render(<CardData />, document.getElementById("displayCard"))
    fetchx(API_URL + `/getGuestList`)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
        if (data1.data1.numberOfRooms > 1) {
          setPopUp("You have selected more then 1 room need to split the reservation")
        }
      })
  }, [])


  //Search element
  const onFilterTextBoxChanged1 = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box1').value
    )
  }, [])


  //Flatpicker 
  const today = Today
  const checkIn = watch('checkIn1');
  const checkOut = watch('checkOut1')

  const options = {};
  const optionsToDate = {};

  if (MainResData && MainResData.arrivalDate && MainResData.departureDate) {
    options.minDate = MainResData.arrivalDate;
    options.maxDate = MainResData.departureDate;

    optionsToDate.minDate = MainResData.arrivalDate;
    optionsToDate.maxDate = MainResData.departureDate;
  }

  if (optionsToDate.minDate < today) {
    optionsToDate.minDate = today;
  }

  if (options.minDate < today) {
    options.minDate = today;
  }

  useEffect(() => {
    if (options.maxDate < today && optionsToDate.maxDate < today) {
      setPopUp("message");
    }
  // }, []);
}, [options.maxDate, optionsToDate.maxDate, today]);


  //on click of new guest navigate
  const onclickButton = () => {
    setGuestProfileModal(true)
  }


  // Horizontal line styling
  const horizontalLineStyle = {
    borderBottom: '0.1px dashed #000',
    margin: '10px 0',
  };


  //Main guest details
  // function CardData(data) {
  //   console.log(data)
    // return (
    //   <div>
    //     <br></br>
    //     <b><h3>Sharer Details</h3></b>
        
    //     <b> <small>Name :</small>  </b>&nbsp; {filldata['salutation']} {filldata['firstName']} {filldata['lastName']}<br></br>
    //     <b><small>Arrival:</small></b>&nbsp;{ (data.arrivalDate !== undefined && data.arrivalDate !== null) ? Moment(String(new Date(data.arrivalDate))).format('YYYY-MM-DD') : null}<br></br>
    //     <b><small>Departure:</small></b>&nbsp;{(data.departureDate !== undefined && data.departureDate !== null) ? Moment(String(new Date(data.departureDate))).format('YYYY-MM-DD') : null}<br></br>
    //     <div style={horizontalLineStyle}></div> {/* Add the horizontal line */}

    //     <br></br>
    //     <b><h3>Main reservation arrival details</h3></b>
    //     <b><small>Booking ID:</small></b>&nbsp;{data1.data1.bookingID}<br></br>
    //     <b><small>Arrival:</small></b>&nbsp;{data1.data1.arrivalDate}<br></br>
    //     <b><small>Departure:</small></b>&nbsp;{data1.data1.departureDate}<br></br>
    //     <b><small>PAX:</small></b>&nbsp;{data1.data1.numberOfAdults}{"+"}{data1.data1.numberOfChildren}<br></br>
    //     <b><small>Rooms:</small></b>&nbsp;{data1.data1.numberOfRooms}<br></br>
    //     <b><small>Room Type:</small></b>&nbsp;{data1.data1.roomType}<br></br>
    //     <b><small>Market:</small></b>&nbsp;{data1.data1.marketCode}<br></br>
    //     <b><small>Source:</small></b>&nbsp;{data1.data1.sourceCode}<br></br>
    //     <b><small>Company/Agent:</small></b>&nbsp;{data1.data1.accountName}<br></br>
    //     <b><small>Rate Code:</small></b>&nbsp;{data1.data1.rateCode}<br></br>
    //     <b><small>Room No.:</small></b>&nbsp;{data1.data1.roomNumber }<br></br>

    //   </div>
    // )
  // }

  function CardData(data) {
    return (
      <div>
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Sharer Details</h3>
          <b><large>Name:</large></b>&nbsp;{filldata['salutation']} {filldata['firstName']} {filldata['lastName']}<br />
          <b><large>Arrival:</large></b>&nbsp;{data.arrivalDate ? Moment(String(new Date(data.arrivalDate))).format('YYYY-MM-DD') : 'Not available'}<br />
          <b><large>Departure:</large></b>&nbsp;{data.departureDate ? Moment(String(new Date(data.departureDate))).format('YYYY-MM-DD') : 'Not available'}<br />
        </div>
    
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Main reservation arrival details</h3>
          <b><large>Booking ID:</large></b>&nbsp;{data1.data1?.bookingID || 'Not available'}<br />
          <b><large>Arrival:</large></b>&nbsp;{data1.data1?.arrivalDate || 'Not available'}<br />
          <b><large>Departure:</large></b>&nbsp;{data1.data1?.departureDate || 'Not available'}<br />
          <b><large>PAX:</large></b>&nbsp;{data1.data1?.numberOfAdults && data1.data1?.numberOfChildren ? `${data1.data1.numberOfAdults}+${data1.data1.numberOfChildren}` : 'Not available'}<br />
          <b><large>Rooms:</large></b>&nbsp;{data1.data1?.numberOfRooms || 'Not available'}<br />
          <b><large>Room Type:</large></b>&nbsp;{data1.data1?.roomType || 'Not available'}<br />
          <b><large>Market:</large></b>&nbsp;{data1.data1?.marketCode || 'Not available'}<br />
          <b><large>Source:</large></b>&nbsp;{data1.data1?.sourceCode || 'Not available'}<br />
          <b><large>Company/Agent:</large></b>&nbsp;{data1.data1?.accountName || 'Not available'}<br />
          <b><large>Rate Code:</large></b>&nbsp;{data1.data1?.rateCode || 'Not available'}<br />
          <b><large>Room No.:</large></b>&nbsp;{data1.data1?.roomNumber || 'Not available'}<br />
        </div>
      </div>
    )
    
    
    
  };




  return (
    <div>

      {/* Guest profile modal */}
      <Modal isOpen={guestProfileModal} toggle={() => setGuestProfileModal(!guestProfileModal)} className='modal-xl'>
        <ModalHeader toggle={() => setGuestProfileModal(!guestProfileModal)}>Guest Profile</ModalHeader>
        <ModalBody>
          <GuestProfile />
        </ModalBody>
      </Modal>


      {/* View Guest Profile */}
      {/* <div>
        <Modal isOpen={assign} toggle={() => setAssign(!assign)} className='demo-inline-spacing'>
          <ModalHeader className='bg-transparent' toggle={() => setAssign(!assign)}></ModalHeader>
          {filldata && <ModalBody className='pb-3 px-sm-1 mx-20'>
            <h1>
              Guest Profile
            </h1>
            <br></br>
            <strong>Guest Name : </strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{filldata['name']}<br></br>
            <strong> Mobile Number : </strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{filldata['phoneNumber']}<br></br>
            <strong> Email ID : </strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{filldata['email']}<br></br>
            <strong> Date of Birth : </strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{filldata['dob']}<br></br>
            <strong> Nationality : </strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{filldata['nationality']}<br></br>
            <strong> Company Name : </strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{filldata['accountName']}<br></br>
            <strong> Country:  </strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {filldata['country']} <br></br>
            <strong> Postal Code:   </strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; {filldata['postalCode']} <br></br>
            <strong>State:  </strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {filldata['state']} <br></br>
          </ModalBody>}
        </Modal>
      </div> */}

      <div>
        <Modal isOpen={assign} toggle={() => setAssign(!assign)} className='modal-lg'>
          <ModalHeader className='bg-transparent' toggle={() => setAssign(!assign)}></ModalHeader>
          {filldata && <ModalBody className='pb-3 px-sm-1 mx-20'>


            <Row>
              <Col md='3' sm='12' className='mb-1' l>
                <div >
                  <Card style={{ backgroundColor: '#F2E5D9' }}>
                    <Row className='cardBody'>
                      <Col md='10' sm='12' className='mb-1'>
                        <div>
                          <ul>
                            <li>  <div className='hoverUnderline' onClick={() => {
                              setAssign(!assign)
                              sessionStorage.removeItem('id')
                            }}>Overview</div>  </li>
                            <li> <div className='hoverUnderline'>CompanyID & GST ID</div> </li>
                            <li> <div className='hoverUnderline'>ID Details</div> </li>
                            <li> <div className='hoverUnderline'>Membership Details</div></li>
                            <li> <div className='hoverUnderline'>Other Details</div> </li>
                          </ul>
                        </div>
                      </Col>
                    </Row>
                  </Card>


                </div>
              </Col>
              <Col>

                <Col>
                  <Row>
                    <Col>
                      <div className="mb-1">
                        <Row>
                          <UncontrolledAccordion defaultOpen='1'>
                            <AccordionItem>
                              <AccordionHeader
                                style={{ backgroundColor: "#F2E5D9" }}
                                targetId="1"
                              >
                                <b> Overview </b>
                              </AccordionHeader>
                              <AccordionBody accordionId="1">
                                <Row>
                                  <Col>
                                    <div>
                                      <h5>
                                        <b> Basic Details </b>
                                      </h5>
                                      <br></br>
                                      <h6> Name:<b>{filldata["salutation"]} {filldata["firstName"]} {filldata["lastName"]}
                                      </b> </h6>
                                      <h6>Email: <b>{filldata["email"]}</b>  </h6>
                                      <h6> Phone Number: <b> {filldata["phoneNumber"]}</b></h6>
                                    </div>
                                  </Col>

                                  <Col>
                                    <div>
                                      <h5>
                                        <b> Address Details</b>
                                      </h5>
                                      <br></br>

                                      <h6>
                                        Address One: <b>{filldata["addressOne"]}</b>
                                      </h6>
                                      <h6>
                                        Address Two: <b>{filldata["addressTwo"]}</b>
                                      </h6>

                                      <h6>
                                        Country: <b>{filldata["countryName"]}</b>
                                      </h6>
                                      <h6>
                                        State: <b>{filldata["state"]}</b>
                                      </h6>
                                      <h6>
                                        City: <b>{filldata["city"]}</b>
                                      </h6>
                                      <h6>
                                        PostalCode: <b>{filldata["postalCode"]}</b>
                                      </h6>
                                    </div>
                                  </Col>
                                </Row>
                              </AccordionBody>
                            </AccordionItem>
                          </UncontrolledAccordion>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <br></br>

                <Col>
                  <Row>
                    <Col>
                      <div className="mb-1">
                        <Row>
                          <UncontrolledAccordion defaultOpen='1'>
                            <AccordionItem>
                              <AccordionHeader
                                style={{ backgroundColor: "#F2E5D9" }}
                                targetId="1" >
                                <b> Company Details and GST </b>
                              </AccordionHeader>
                              <AccordionBody accordionId="1">
                                <Row>
                                  <Col>

                                    <Row>
                                      <Col> <h6>
                                        Company: <b>{filldata["accountName"]}</b>
                                      </h6> </Col>

                                      <Col> <h6> GST Number: <b>{filldata["gstID"]}</b> </h6>  </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </AccordionBody>
                            </AccordionItem>
                          </UncontrolledAccordion>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <br></br>

                <Col>
                  <Row>
                    <Col>
                      <div className="mb-1">
                        <Row>
                          <UncontrolledAccordion defaultOpen='1'>
                            <AccordionItem>
                              <AccordionHeader
                                style={{ backgroundColor: "#F2E5D9" }}
                                targetId="1" >
                                <b>  ID Details </b>
                              </AccordionHeader>
                              <AccordionBody accordionId="1">
                                <Row>
                                  <Col> <h6>
                                    ID Type: <b>{filldata["idType"]}</b>
                                  </h6> </Col>

                                  <Col> <h6> ID Number: <b>{filldata["idNumber"]}</b> </h6>  </Col>
                                  {/* <DataGrid/> */}
                                </Row>
                              </AccordionBody>
                            </AccordionItem>
                          </UncontrolledAccordion>
                        </Row>
                      </div>
                    </Col>
                  </Row>


                </Col>

                <br></br>

                <Col>
                  <Row>
                    <Col>
                      <div className="mb-1">
                        <Row>
                          <UncontrolledAccordion defaultOpen='1'>
                            <AccordionItem>
                              <AccordionHeader
                                style={{ backgroundColor: "#F2E5D9" }}
                                targetId="1" >
                                <b>Membership Details </b>
                              </AccordionHeader>
                              <AccordionBody accordionId="1">
                                <Row>
                                  <Col>
                                    <Row>
                                      {filldata &&
                                        <>
                                          {/* console.log(filldata["membershipType"]) */}
                                          <Col> <h6>Membership Type: {filldata["membershipType"]} </h6> </Col>
                                          <Col> <h6>Membership Number: {filldata["membershipNo"]} </h6> </Col>
                                          <Col> <h6> Membership Level: {filldata["membershipLevel"]}</h6> </Col>
                                        </>
                                      }
                                    </Row>

                                  </Col>
                                </Row>
                              </AccordionBody>
                            </AccordionItem>
                          </UncontrolledAccordion>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <br></br>

                <Col>
                  <Row>
                    <Col>
                      <div className="mb-1">
                        <Row>
                          <UncontrolledAccordion defaultOpen='1'>
                            <AccordionItem>
                              <AccordionHeader
                                style={{ backgroundColor: "#F2E5D9" }}
                                targetId="1" >
                                <b>Other Details </b>
                              </AccordionHeader>
                              <AccordionBody accordionId="1">
                                <Row>
                                  <Col>

                                    <Row>
                                      <Col> <h6>DOB: <b> {filldata["dob"]}</b> </h6></Col>
                                      <Col> <h6>Anniversary Date: <b>{filldata["anniversary"]}</b> </h6></Col>
                                      <Col> <h6> Guest Preference Notes: <b>{filldata["guestpreferencenotes"]} </b> </h6> </Col>

                                    </Row>
                                  </Col>
                                </Row>
                              </AccordionBody>
                            </AccordionItem>
                          </UncontrolledAccordion>
                        </Row>
                      </div>
                    </Col>
                  </Row>


                </Col>


              </Col>
            </Row>
          </ModalBody>}
        </Modal>
      </div>

      <Row>

        {/* Guest Card */}
        <Col md='4' sm='12'>
          <Card>
            <CardHeader style={{ background: '#8c82f2', textAlign: 'center' }}>
              <CardTitle>
                <h3 style={{ color: 'white', textAlign: 'center' }}>Stay Information</h3>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div id="displayCard"></div>
            </CardBody>
          </Card>
        </Col>

        <Col md='8' sm='12'>
          <Card >
            <Accordion className='accordion-margin' open={open} toggle={toggle}>

              {/* Guest Search Accordian */}
              <div >
                <AccordionItem open={open}>
                  <AccordionHeader targetId='1'> <h5><b>Guest Profile Search</b></h5></AccordionHeader>
                  <AccordionBody accordionId='1'>
                    <div>
                      <Row className='mb-1'>
                        <Col md='3' sm='12' className='mb-1'>
                          <Label className='form-label' for='fullName'>
                            Search
                          </Label>
                          <Input
                            type="text"
                            id="filter-text-box1"
                            placeholder="Filter..."
                            onInput={onFilterTextBoxChanged1}
                          />
                        </Col>
                        <Col md='8' sm='12' className='mb-1'>
                          <br></br>
                          &nbsp;&nbsp;&nbsp;
                          <Button color='primary' onClick={onclickButton} style={{ float: 'right' }}>
                            Add New Guest
                          </Button>
                        </Col>
                      </Row>
                    </div>
                    <div className="ag-theme-alpine" style={{ height: 520 }}>
                      <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        animateRows={true}
                        rowSelection='multiple'
                        onCellClicked={cellClickedListener}
                        paginationPageSize='10'
                        pagination='true'
                        defaultColDef={defaultColDef}
                        headerColor="ddw-primary"
                      />
                    </div>
                  </AccordionBody>
                </AccordionItem>
              </div>


              {/* Arrival Details */}
              <div>
                <AccordionItem>
                  <AccordionHeader targetId='3'>
                    <h5><b>Arrival Details</b></h5>
                  </AccordionHeader>
                  <AccordionBody accordionId='3'>
                    <div>

                      {/* Arrival details card */}
                      <Card>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                          {/* <Form> */}
                          <Row>

                            {today !== undefined &&
                              MainResData &&
                              <Col md='4' sm='12'>
                                <div className='mb-1'>
                                  <Label className='form-label' for='checkIn1'>
                                    Arrival Date<spam style={{ color: 'red' }}>*</spam>
                                    {console.log(MainResData.arrivalDate)}
                                  </Label>
                                  <Controller
                                    // required
                                    control={control}
                                    id='checkIn1'
                                    name='checkIn1'
                                    // defaultValue={MainResData.arrivalDate}
                                    defaultValue={MainResData.arrivalDate < today ? today : MainResData.arrivalDate}
                                    render={({ field }) => (
                                      <Flatpickr
                                      {...field}
                                        options={options}
                                        // required
                                        placeholder='YYYY-MM-DD'
                                        className={classnames('form-control', {
                                          'is-invalid': data !== null && data.checkIn === null
                                        })}
                                      />
                                    )}
                                  />
                                </div>
                              </Col>
                       
                            }

                            {today !== undefined &&
                              MainResData &&
                              <Col md='4' sm='12'>
                                <div className='mb-1'>
                                  <Label className='form-label' for='checkOut1'>
                                    Departure Date <spam style={{ color: 'red' }}>*</spam>
                                  </Label>
                                  <Controller
                                    control={control}
                                    id='checkOut1'
                                    name='checkOut1'
                                    defaultValue={MainResData.departureDate}

                                    render={({ field }) => (
                                      <Flatpickr
                                        // required
                                        // disabled={isSubmitted}
                                        {...field}

                                        options={optionsToDate}
                                        placeholder='YYYY-MM-DD '
                                        // className={classnames('form-control', {
                                        //   'is-invalid': data !== null && data.checkOut === null
                                        // })}
                                        className={classnames('form-control', {
                                          'is-invalid': data !== null && data.checkOut === null
                                        })}
                                      />
                                    )}
                                  />
                                </div>
                              </Col>
                            }

                            <Col md='4' sm='12'>
                              <div>
                                <Label className='form-label' for='adult'>
                                  Extra Adults <spam style={{ color: 'red' }}>*</spam>
                                </Label>
                                <Controller
                                  id='adult'
                                  control={control}
                                  name='adult'
                                  render={({ field }) => (
                                    <Input
                                      isClearable
                                      disabled={true}
                                      required
                                      options={colourOptions}
                                      classNamePrefix='select'
                                      theme={selectThemeColors}
                                      className={classnames('react-select', { 'is-invalid': data !== null && data.adult === null })}
                                      value={data1.data1.numberOfAdults}
                                    />
                                  )}
                                />
                              </div>
                            </Col>

                            <Col md='4' sm='5'>
                              <div className='mb-1'>
                                <Label className='form-label' for='children'>
                                  Children <spam style={{ color: 'red' }}>*</spam>
                                </Label>
                                <Controller
                                  id='children'
                                  control={control}
                                  name='children'
                                  render={({ field }) => (
                                    <Input
                                      required
                                      disabled={true}
                                      isClearable
                                      options={children}
                                      classNamePrefix='select'
                                      theme={selectThemeColors}
                                      className={classnames('react-select', { 'is-invalid': data !== null && data.children === null })}
                                      {...field}
                                      value={data1.data1.numberOfChildren}

                                    />
                                  )}
                                />
                              </div>
                            </Col>

                            <Col md='4' sm='5'>
                              <div className='mb-1'>
                                <Label className='form-label' for='quantity'>
                                  Number Of Rooms <spam style={{ color: 'red' }}>*</spam>
                                </Label>
                                <Controller
                                  id='quantity'
                                  control={control}
                                  name='quantity'
                                  render={({ field }) => (
                                    <Input
                                      required
                                      disabled={true}
                                      isClearable
                                      options={colourOptions}
                                      classNamePrefix='select'
                                      theme={selectThemeColors}
                                      className={classnames('react-select', { 'is-invalid': data !== null && data.quantity === null })}
                                      {...field}
                                      value={data1.data1.numberOfRooms}

                                    />
                                  )}
                                />
                              </div>
                            </Col>

                            {
                              (MainResData && MainResData.blockCodeID) &&
                              < div align='end'>
                                <Button className='me-1' color='primary' align='end' onClick={() => setConfirmed(true)}>
                                  Proceed
                                </Button>
                              </div>
                            }

                            {MainResData && MainResData.blockCodeID === null && <div align='end'>
                              <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset1}>
                                Start Over
                              </Button>
                              <Button color='primary' className='me-1' type='submit'> {/*onClick={ClickonSubmit}*/}
                                Get Rates
                              </Button>
                            </div>}

                          </Row>
                        </Form>
                      </Card>


                      {
                        dailyRates !== undefined && checkShow === true &&
                        <div className="ag-theme-alpine" style={{ height: 220 }}>
                          <h3>
                            Rates
                          </h3>
                          <AgGridReact
                            ref={gridRef}
                            rowData={dailyRates}
                            columnDefs={DailyRates}
                            animateRows={true}
                            rowSelection='multiple'
                            onCellClicked={cellClickedListener1}
                            paginationPageSize='10'
                            defaultColDef={defaultColDef1}
                            headerColor="ddw-primary"
                          />
                        </div>
                      }
                      <br></br><br></br><br></br><br></br>

                    </div>
                    {open === '3' && setTimeout(() => { ReactDOM.render(<CardData arrivalDate={watch('checkIn1')} departureDate={watch('checkOut1')}/>, document.getElementById("displayCard")) })}
                  </AccordionBody>
                </AccordionItem>
              </div>

            </Accordion>
          </Card>
        </Col>
      </Row>

      {/* Final Submit Buttons */}
      {
        dailyRates !== undefined && checkShow === true &&
        < div align='end'>
      <Button className='me-1' color='primary' align='end' onClick={() => setConfirmed(true)}>
        Proceed
      </Button>
    </div>
}


<div className='demo-inline-spacing'>
  <div className='basic-modal'>
    <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-xl'>
      <ModalHeader toggle={() => setBasicModal(!basicModal)}>Reservation Page</ModalHeader>
      <ModalBody>
        <ConfirmedDetails />
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' outline onClick={modalClose}>
          Cancel
        </Button>
        {/* <Button color='primary' onClick={masterReservation}>
                Confirm
              </Button> */}
      </ModalFooter>
    </Modal>
  </div>
</div>

{
  confirmed &&
    <div className='disabled-animation-modal'>
      <Modal isOpen={confirmed} toggle={() => setConfirmed(!confirmed)} className='modal-dialog-centered'  >
        <ModalHeader className='modal-sm' toggle={() => {
          setConfirmed(!confirmed)
        }}>
          Need To Check..</ModalHeader>
        <ModalBody className='pb-3 px-sm-2 mx-20'>
          <div>
            <h3><b>Confirm Sharer</b></h3>
            <br></br>
            <br></br>
            <div className="d-flex">
              <Button color="primary" className="me-1" onClick={AddFinalReservation} disabled={isClicked} >
                Confirm
              </Button>
              <Button outline className="me-1" onClick={() => setConfirmed(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

    </div>
}
    </div >
  )
}


export default AccordionUncontrolled
