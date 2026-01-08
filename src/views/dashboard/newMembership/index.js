import React, { Fragment, useState, Component, useRef, useEffect, useMemo, useCallback } from 'react'

//import Profile from './profile'
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Moment from 'moment'
import { useNavigate } from "react-router-dom"

import * as ReactDOM from 'react-dom'
import GuestProfile from './guestProfile/index'
import MembershipProfile from './membershipProfile/index'

import GuestDataGrid from './guestDatagrid'
//import History from './guestHistory'



// ** Reactstrap Imports
import {
  AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, Accordion, InputGroup, NavLink, UncontrolledAccordion
} from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

// import ConfirmedDetails from "./confirmedDetails"

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'



import API_URL from '../../../config'


const AccordionUncontrolled = () => {
  const gridRef = useRef()
  const gridRefs = useRef()
  const navigate = useNavigate()
  //const [rowData1, setRowData1] = useState()
  const [open, setOpen] = useState('1')
 // const [show, actionButton] = useState(false)
 // const [basicModal, setBasicModal] = useState(false)
  const [guestProfileModal, setGuestProfileModal] = useState(false)
  const [membershipModal, setMembershipModal] = useState()
 // const [data, setData] = useState(null)
  //const [isSubmitted, setIsSubmitted] = useState(false)
 // const { reset1, handleSubmit, control, watch } = useForm({ defaultValues })
  const [rowData, setRowData] = useState()
  const [assign, setAssign] = useState(false)
  const [filldata, setfilldata] = useState('')
  //console.log(filldata);
  // const [Rate2, setRate2] = useState()
  // const [ChildrenCheck, setChildrenCheck] = useState(false)
  // const [Rate3, setRate3] = useState()
  // const [toggleCount, setToggleCount] = useState(false)
  // const [rowData4, setRowData4] = useState()
  // const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
  // const [showAdditionalOptions1, setShowAdditionalOptions1] = useState(false);
  // const [showAdditionalOptions2, setShowAdditionalOptions2] = useState(false);
  // const [buttonSelect, setButtonSelect] = useState();
  // const [typeOfButton, settypeOfButton] = useState();
  const [arrivalDate, setArrivalDate] = useState();
  const [departureDate, setDepartureDate] = useState()
  //const [guestHistory, setOpenGuestHistory] = useState();

  // const [rate, setRate] = useState('');
  // const [showButtons, setShowButtons] = useState(false);


  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }


  const openGuestModal = (rowval) => {
    setAssign(!assign)
  }


  const [columnDefs] = useState([
    {
      headerName: 'Guest Name',
      suppressSizeToFit: true,
      width: 280,
      valueGetter: function (params) {
        const salutation = params.data.s;
        const firstName = params.data.f;
        const lastName = params.data.l;
        const fullName = salutation ? `${salutation} ${firstName} ${lastName}` : `${firstName} ${lastName}`;
        return fullName;
      },
      cellStyle: (params) => {
        if (params.data.is_loyalty_member === 1) {
          return { backgroundColor: '#F1C40F' };
        }
        return null;
      }
    },
    {
      headerName: 'Company',
      field: 'c',
      suppressSizeToFit: true,
      width: 250,
      cellStyle: (params) => {
        if (params.data.is_loyalty_member === 1) {
          return { backgroundColor: '#F1C40F' };
        }
        return null;
      }
    },
    {
      headerName: 'Email ID',
      field: 'e',
      suppressSizeToFit: true,
      width: 220,
      cellStyle: (params) => {
        if (params.data.is_loyalty_member === 1) {
          return { backgroundColor: '#F1C40F' };
        }
        return null;
      }
    },
    {
      headerName: 'Actions',
      maxWidth: 200,
      cellRenderer: (params) => {
        if (params.data.is_loyalty_member === 1) {
          return (
            <div>
              <Button disabled color='primary'>
                Add Membership
              </Button>
            </div>
          );
        } else {
          return (
            <div>
              <Button color='primary' onClick={() => setMembershipModal(params.data.id)}>
                Add Membership
              </Button>
            </div>
          );
        }
      },
    },
    {
      maxWidth: 140,
      cellRendererFramework: (params) => (
        <div>
          <Button color='primary' onClick={() => openGuestModal(params)}>
            View Profile
          </Button>
        </div>
      ),
    },
   
  ]);
  
  
  
  

  
  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ))


  //ag-grid cell clcked value
  const cellClickedListener = useCallback(event => {
    fetchx(API_URL + `/getAllGuestDetailsForPosLoyalty?guestID=${event['data'].id}`)
      .then(result => result.json())
      .then(rowData => {
        setfilldata(rowData['data'][0])
        ////console.log(rowData['data'][0]);
        
      })
    sessionStorage.setItem('CompanyNameID', event['data']['accountName'])
    sessionStorage.setItem('guestProfileID', event['data']['id'])
    sessionStorage.setItem('companyID', event['data']['companyID'])
  })


 
  


  //API to get all the guests
  useEffect(() => {
    fetchx(API_URL + `/getGuestListForPosLoyalty`)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
      })

    const hotelID = JSON.stringify({
      hotelID: 1
    })
    fetchx(API_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelID
    }).then((res) => res.json())
      .then(postres => {
        const today = new Date(postres['data'][0]['businessDate']);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        setDepartureDate(tomorrow)
        setArrivalDate((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
      })

  

  }, [])


  const onFilterTextBoxChanged1 = useCallback(() => {
    gridRefs.current.api.setQuickFilter(
      document.getElementById('filter-text-box1').value
    )
  }, [])


  //Flatpicker 
  const today = Moment().format('YYYY-MM-DD ')
 


  //on click of new guest navigate
  const onclickButton = () => {
    setGuestProfileModal(true)
  }


  return (
    <div>

      <Modal isOpen={guestProfileModal} toggle={() => setGuestProfileModal(!guestProfileModal)} className='modal-xl'>
        <ModalHeader toggle={() => setGuestProfileModal(!guestProfileModal)}>Guest Profile</ModalHeader>
        <ModalBody>
          <GuestProfile />
        </ModalBody>
      </Modal>

      
      <Modal isOpen={membershipModal} toggle={() => setMembershipModal(!membershipModal)} className='modal-xl'>
        <ModalHeader toggle={() => setMembershipModal(!membershipModal)}>Membership Profile</ModalHeader>
        {membershipModal &&
         <ModalBody>
          <MembershipProfile data1 = {membershipModal}/>
          
        </ModalBody>
       } 
      </Modal>


      {/* View Guest Profile */}
      <div>
        <Modal isOpen={assign} toggle={() => setAssign(!assign)} className='modal-lg'>
          <ModalHeader className='bg-transparent' toggle={() => setAssign(!assign)}></ModalHeader>
          {filldata && <ModalBody className='pb-3 px-sm-1 mx-20'>


            <Row>
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
                                  <GuestDataGrid data1 = {filldata} />
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
                                          {/* //console.log(filldata["membershipType"]) */}
                                          <Col> <h6>Membership Number: {filldata["membershipNo"]} </h6> </Col>
                                          <Col> <h6>Membership Expiry: {filldata["expiryDate"]} </h6> </Col>
                                          
                                          {/* <Col> <h6> Membership Level: {filldata["membershipLevel"]}</h6> </Col> */}
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
       

        <Col md='12' sm='12'>
          <Card >

            <Accordion className='accordion-margin' open={open} >

              <div>
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
                        ref={gridRefs}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        //getRowStyle={getRowStyle}
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

              <div className="vertically-centered-modal">


</div>


            </Accordion>
          </Card>

        </Col>

      </Row>

     


    </div>
  )
}


export default AccordionUncontrolled