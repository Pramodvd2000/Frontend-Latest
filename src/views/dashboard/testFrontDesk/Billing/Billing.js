
// ** React Imports
import { Link } from 'react-router-dom'

import { useState } from "react";
// ** Third Party Components
import toast from "react-hot-toast";
import { Check, Edit2 } from "react-feather";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import ProfileViews from "./editGuestDetails/index"
import CompanyProfileViews from "./editcompanyProfile/index"
import ModificationLogs from "../../modificationLog";
import DailyDetailsView from "../dailyDetailsView";
import FixedCharges from "../fixedCharges"


import FolioTab from './FolioTab'

import API_URL from "../../../../config";

import { useNavigate } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils

// ** Reactstrap Imports
import {
  Input, Card, Form, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText, Row, Col, Modal, ModalBody,
  ModalHeader,
} from "reactstrap";
// import { Button, Modal, ModalBody, ModalHeader, Card, Form, Label, UncontrolledPopover, PopoverHeader, PopoverBody, CardBody, CardTitle, CardHeader, Row, Col, Input, DropdownMenu, ModalFooter,
// } from "reactstrap";

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
import moment from 'moment';
import CancelReservation from '../cancelReservation';



const defaultValues1 = {
  Price: '',
  quantity: 1,
  Supplements: '',
  reference: ''
}



const Companydetails = ({Today}) => {

  const navigate = useNavigate()

  const [errorMsg, seterrorMsg] = useState('')
  const [showErrorMsg, setshowErrorMsg] = useState(false)
  const [ConfirmCheckOut, setConfirmCheckOut] = useState(false)
  const [Sharers, setSharers] = useState([])
  const [UnsettledTrxn, setUnsettledTrxn] = useState(false)
  const [SharerExists, setSharerExists] = useState(false)
  const [CheckOutSharer, setCheckOutSharer] = useState(false)
  const [CommentsHovered, setCommentsHovered] = useState(false);
  const [BillingInstHovered, setBillingInstHovered] = useState(false);
  const [AddressHovered, setAddressHovered] = useState(false);
  const [CompanyHovered, setCompanyHovered] = useState(false);
  const [profileView, setProfileView] = useState();
  const [companyprofileView, setCompanyProfileView] = useState();
  const [FoliosToSettle, setFoliosToSettle] = useState([])
  // const [Today, setToday] = useState()

  const [AllGuests, setAllGuests] = useState([])
  const [ReservationData, setReservationData] = useState('')
  const [EnableButton, setEnableButton] = useState(false)
  //new
  const [resAlert, setResAlert] = useState(null);
  const [disResAlert, setdisResAlert] = useState(false);
  const [showLinkedGuests,setshowLinkedGuests] = useState(false);
  const [modificationLogs, setModificationLogs] = useState(false)
  const [viewDailyDetails, setViewDailyDetails] = useState(false)
  const [showfixedcharges, setshowfixedcharges] = useState(false)
  const [popUp, setPopUp] = useState();
  const [cancelReservation, setCancelReservation] = useState(false)
  const [filldata, setfilldata] = useState("");
  const [sharerDetails, setSharerDetails] = useState()

  const fetchReservationAlerts = async () => {
    try {
      const result = await fetchx(API_URL + `/getCheckOutAlerts?hotelID=10&reservationID=${sessionStorage.getItem('reservationID')}`);
      const resp = await result.json();
      if (resp['data'][0]['checkOutAlert'].length !== 0) {
        setdisResAlert(true)
        setResAlert(resp['data'][0]['checkOutAlert']);
        // setReservationAlerts(resp['data'][0]['checkOutAlert']);
      }
      else {
        setdisResAlert(false)
      }
    } catch (error) {
    }
  };


  //API to get company list
  useEffect(() => {
    //New
    fetchReservationAlerts();



    if (localStorage.getItem('reservationID') != null) {
      // console.log('Setting reservationID in session s6torage',localStorage.getItem('reservationID'))
      sessionStorage.setItem('reservationID', localStorage.getItem('reservationID'))

      localStorage.removeItem('reservationID')

    }

    fetchx(API_URL + "/updateResandFolioBal", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
        reservationID: sessionStorage.getItem('reservationID')
      })
    }).then(result => result.json())
      .then(resp => {
        // console.log(resp['data'])
      }).catch((error) => {
        console.log(error)
      })


    const company = JSON.stringify({
      hotelID: 1,
      reservationID: sessionStorage.getItem('reservationID') 
    })
    // console.log(company)
    fetch(API_URL + "/getReservationDetails", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: company
        }).then(result => result.json())
        .then(rowData => {
            // console.log(rowData['data'][0])
            if(rowData['data'][0]['reservationStatus']=='Checked Out'){
              // console.log('Guest is checked out')
              setEnableButton(true)
            }
            sessionStorage.setItem('RoomNo',rowData['data'][0]['RoomNumber'])
            sessionStorage.setItem('departureDate',rowData['data'][0]['departureDate'])
            // if(rowData['data'][0].length!=0 && rowData['data'][0]['isMain']==1){

              //Call an api to get AllGuests

              fetch(API_URL + `/getAllGuestsBySharingID?hotelID=1&sharingID=`+rowData['data'][0]['sharingID'])

              .then(result => result.json())
              .then(response => {
                // console.log(response['data'])

                setAllGuests(response.data)
                // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
              })

            setReservationData(rowData['data'][0])
            
            sessionStorage.setItem('RoomNo',rowData['data'][0]['roomNumber'])
            sessionStorage.setItem('roomID',rowData['data'][0]['room'])
          }).catch((error) => {
            // console.log(error)
          })

    fetchx(API_URL + '/getAllFoliosWithTrxnForRes?hotelID=1&reservationID=' + sessionStorage.getItem('reservationID'))
      .then(result => result.json())
      .then(response => {
        if (response['data'].length > 0) {
          setFoliosToSettle(response['data'])

        }
      })


  }, [])



  useEffect(() => {
    const fetchAllReservations = () => {
      const allDetails = [];

      // Fetch reservation details for each guest when AllGuests data changes
      AllGuests.forEach((row) => {
        fetch(API_URL + '/getReservationForFrontDeskByResID?reservationID=' + row.id)
          .then((result) => result.json())
          .then((response) => {
            if (response.statusCode === 200) {
              console.log(response.data);
              allDetails.push(response.data);

              // If all requests are completed, update state
              if (allDetails.length === AllGuests.length) {
                setSharerDetails(allDetails);
              }
            }
          })
          .catch((error) => console.error('Error fetching reservation data:', error));
      });
    };

    fetchAllReservations();
  }, [AllGuests]); // Runs whenever AllGuests changes

  
  const CheckOut = () => {



    fetchx(API_URL + "/checkOutReservation", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
        reservationID: sessionStorage.getItem('reservationID'),
        roomID: sessionStorage.getItem('roomID'),
        checkOutSharer: CheckOutSharer
      })
    }).then(result => result.json())
      .then(resp => {
        // console.log(resp)
        if (resp.statusCode == 200) {
          toast(
            <div className="d-flex">
              <div className="me-1">
                <Avatar size="sm" color="success" icon={<Check size={12} />} />
              </div>
              <div className="d-flex flex-column">
                <h6>Guest Checked Out Successfully</h6>
              </div>
            </div>
          );

          { setTimeout(() => { navigate('/dashboard/frontdesk/Billing') }, 1000) } // Replace '/new-page' with the actual URL you want to open in the new tab

        } else {
          seterrorMsg(resp.message)
          setshowErrorMsg(!showErrorMsg)
        }
        setConfirmCheckOut(!ConfirmCheckOut)

      }).catch((error) => {
      })


  }





  const ConfirmCheckoutGuest = () => {
    setEnableButton(true)
    if (ReservationData['isMain'] == 1) {
      fetchx(API_URL + `/checkIfSharerExists?hotelID=1&sharingID=` + ReservationData['sharingID'])

        .then(result => result.json())
        .then(response => {
          if (response.statusCode == 200) {
            setSharers(response.data.AllSharers)
            setUnsettledTrxn(response.data.UnsettledTrxn)
            setCheckOutSharer(!response.data.UnsettledTrxn)
            setSharerExists(true)
            setEnableButton(false)
          }
          else {
            setCheckOutSharer(false)
            setSharerExists(false)
            setEnableButton(false)
          }
        })
    }
    setConfirmCheckOut(!ConfirmCheckOut)


  }

  const handleMouseEnterComments = () => {
    setCommentsHovered(true);
  };

  const handleMouseLeaveComments = () => {
    setCommentsHovered(false);
  };

  const handleMouseEnterBillingInst = () => {
    setBillingInstHovered(true);
  };

  const handleMouseLeaveBillingInst = () => {
    setBillingInstHovered(false);
  };

  const handleMouseEnterAddress = () => {
    setAddressHovered(true);
  };

  const handleMouseLeaveAddress = () => {
    setAddressHovered(false);
  };

  const handleMouseEnterCompany = () => {
    setCompanyHovered(true);
  };

  const handleMouseLeaveCompany = () => {
    setCompanyHovered(false);
  };


  return (
    <div>
      <div>
        <Modal isOpen={disResAlert}
          toggle={() => setdisResAlert(!disResAlert)} className="modal-sm">
          <ModalHeader className="modal-lg" toggle={() => setdisResAlert(!disResAlert)} ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              {resAlert}
              <br />
              <Button
                color="primary"
                className="me-1"
                onClick={() => {
                  setdisResAlert(false);
                }}
              >
                OK
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </div>








      <div>
        {
          ReservationData &&
          <Modal isOpen={profileView} toggle={() => setProfileView(!profileView)} className="modal-xl"  >
            <ModalHeader className="modal-lg" toggle={() => setProfileView(!profileView)} >
              View Profile
            </ModalHeader>
            <ModalBody className="pb-3 px-sm-1 mx-20">
              <ProfileViews ReservationData={ReservationData} />
            </ModalBody>
          </Modal>}
      </div>

      <div>
        {
          ReservationData &&
          <Modal isOpen={companyprofileView} toggle={() => setCompanyProfileView(!companyprofileView)} className="modal-xl"  >
            <ModalHeader className="modal-lg" toggle={() => setCompanyProfileView(!companyprofileView)} >
              View  Company Profile
            </ModalHeader>
            <ModalBody className="pb-3 px-sm-1 mx-20">
              <CompanyProfileViews ReservationData={ReservationData} />
            </ModalBody>
          </Modal>}
      </div>






      <Row className='match-height'>

        <Col md='7' sm='7'>
          <Card>

            <Row>
              <Col md='6' sm='6'>
                <h4 style={{ marginLeft: '10px', marginTop: '10px', color: '#7367f0' }}>Guest Details</h4>
              </Col>
              <Col md='6' sm='6'>
                <h5 style={{ marginLeft: '10px', marginTop: '10px' }}>{ReservationData['reservationStatus']}</h5>

              </Col>
            </Row>
            <CardBody>
              {ReservationData.length != 0 &&
                <>
                  { <Row>
                    <Col sm='6'>
                      <h5><b>{ReservationData['salutation'] + ' '}{ReservationData['firstName'] + ' '}{ReservationData['lastName']}</b><Edit2 style={{ marginLeft: '30px', height: "20px", color: '#7367f0' }} onClick={() => setProfileView(!profileView)} /></h5>
                      {/* <h5>{ReservationData['addressOne']}</h5> */}
                      <h5>Arrival : <b>{ReservationData['arrivalDate']} {ReservationData['ATA'] ? ReservationData['ATA'].split(' ')[1] : ''}</b></h5>

                      <h5>Departure : <b>{ReservationData['departureDate']} {ReservationData['ATD'] ? ReservationData['ATA'].split(' ')[1] : ''}</b></h5>
                    </Col>
                    <Col sm='6'>
                      <h5>Confirmation :<b>{ReservationData['bookingID']}</b></h5>
                      <h5>Room No :<b>{sessionStorage.getItem('RoomNo')}</b></h5>
                      <h5>Balance(INR) : <b>{ReservationData['balance']}</b></h5>
                    </Col>

                  </Row>}
                  <div style={{ 'border-bottom': '1px solid #E8E8E8', 'margin-bottom': '10px' }} ></div>
                  <Row>
                    <Col sm='6'>
                      <h5 style={{
                        position: 'relative',
                        display: 'inline-block'
                      }}>Address : <span
                        style={{ cursor: 'pointer', color: '#7367f0', textDecoration: 'underline' }}
                        onMouseEnter={handleMouseEnterAddress}
                        onMouseLeave={handleMouseLeaveAddress}

                      >

                          {ReservationData['addressOne'] != null && ReservationData['addressOne'].substring(0, 20)}...</span> </h5>
                      {AddressHovered && <div style={{
                        position: 'absolute',
                        top: '180px',
                        // height:'20px',
                        width: '600px',
                        // left: '8',
                        backgroundColor: '#e6e6fa',
                        border: '1px solid #ccc',
                        padding: '5px',
                        // display: 'inline-block',
                        zIndex: 1,


                      }}><b>Address1 : {ReservationData['addressOne']}<br></br>
                          Address2 : {ReservationData['addressTwo']}<br></br>
                          City     : {ReservationData['city']}<br></br>
                          State    : {ReservationData['state']}<br></br>
                          Country  : {ReservationData['guestCountryName']}<br></br>
                          PostalCode : {ReservationData['postalCode']}<br></br>
                          GSTIN : {ReservationData['gstID']}


                        </b></div>}
                    </Col>

                    <Col sm='6'>

                      <h5 style={{
                        position: 'relative',
                        display: 'inline-block'
                      }}>Company : <span
                        style={{ cursor: 'pointer', color: '#7367f0', textDecoration: 'underline' }}
                        onMouseEnter={handleMouseEnterCompany}
                        onMouseLeave={handleMouseLeaveCompany}

                      >{(ReservationData['accountName'] != null && ReservationData['accountName'] != "") && ReservationData['accountName'].substring(0, 15)}...
                        </span>
                        {/* <Edit2 style={{ marginLeft:'30px', height: "20px",color:'#7367f0' }} onClick={()=>setCompanyProfileView(!companyprofileView)}/> */}
                      </h5>


                      {CompanyHovered && <div style={{
                        position: 'absolute',
                        top: '180px',
                        // height:'20px',
                        width: '600px',
                        // left: '8',
                        backgroundColor: '#e6e6fa',
                        border: '1px solid #ccc',
                        padding: '5px',
                        // display: 'inline-block',
                        zIndex: 1,


                      }}><b>Company  : {ReservationData['accountName']}<br></br>
                          Address1 : {ReservationData['addressLine1']}<br></br>
                          Address2 : {ReservationData['addressLine2']}<br></br>
                          City     : {ReservationData['CompanyCity']}<br></br>
                          State    : {ReservationData['CompanyState']}<br></br>
                          Country  : {ReservationData['CompanyCountryName']}<br></br>
                          PostalCode : {ReservationData['CompanyPostalCode']}<br></br>
                          GSTIN : {ReservationData['companyGST']}



                        </b></div>}
                    </Col>
                  </Row>

                  <div style={{ 'border-bottom': '1px solid #E8E8E8', 'margin-bottom': '10px' }} ></div>
                  <Row>
                    <Col sm='6'>
                      <h5 style={{
                        position: 'relative',
                        display: 'inline-block'
                      }}>Billing Instructions :<span
                        style={{ cursor: 'pointer', color: '#7367f0', textDecoration: 'underline' }}
                        onMouseEnter={handleMouseEnterBillingInst}
                        onMouseLeave={handleMouseLeaveBillingInst}

                      > {ReservationData['billingInstruction'].length > 0 && (ReservationData['billingInstruction']).substring(0, 10) + '...'}   </span></h5>
                      {ReservationData['billingInstruction'].length > 0 && BillingInstHovered && <div style={{
                        position: 'absolute',
                        top: '210px',
                        // height:'20px',
                        width: '600px',
                        // left: '8',
                        backgroundColor: '#e6e6fa',
                        border: '1px solid #ccc',
                        padding: '5px',
                        // display: 'inline-block',
                        zIndex: 1,


                      }}><b>{ReservationData['billingInstruction']}</b></div>}
                    </Col>



                    <Col sm='6'>
                      <h5 style={{
                        position: 'relative',
                        display: 'inline-block'
                      }} >Comments :      <span
                        style={{ cursor: 'pointer', color: '#7367f0', textDecoration: 'underline' }}
                        onMouseEnter={handleMouseEnterComments}
                        onMouseLeave={handleMouseLeaveComments}

                      > {ReservationData['comments'].length > 0 && (ReservationData['comments']).substring(0, 25) + '...'}  </span></h5>
                      {ReservationData['comments'].length > 0 && CommentsHovered && <div style={{
                        position: 'absolute',
                        top: '210px',
                        // height:'20px',
                        width: '600px',
                        // left: '18',
                        backgroundColor: '#e6e6fa',
                        border: '1px solid #ccc',
                        padding: '5px',
                        // display: 'inline-block',
                        zIndex: 1,


                      }}><b>{ReservationData['comments']}</b></div>}
                    </Col>
                    <Col sm='3'>
                      <h5></h5>
                    </Col>
                  </Row>


                  <Row>
                    <Col md='6' sm='6'>
                      {ReservationData['noPost'] == 1 && <p style={{ color: '#FF0000' }}>Alert : No post is enabled </p>}
                    </Col>
                    <Col md='6' sm='6'>
                      <div className='inline-spacing' align="right" style={{ margin: '5px 0' }}>
                        <Button color='primary' style={{ 'margin-right': '10px' }} className='sharer' disabled={EnableButton || !(ReservationData['reservationStatus'] == 'Checked In' || ReservationData['reservationStatus'] == 'Due Out')} onClick={() => {
                          if (ReservationData['departureDate'] != moment(String(new Date(Today))).format('YYYY-MM-DD')) {
                            seterrorMsg('Departue date is not today')
                            setshowErrorMsg(true)
                          } else if (FoliosToSettle.length > 0) {
                            seterrorMsg('All Folios are not settled')
                            setshowErrorMsg(true)
                          } else if (ReservationData['departureDate'] == moment(String(new Date(Today))).format('YYYY-MM-DD')) {
                            ConfirmCheckoutGuest()
                          }
                        }} >Check Out</Button>
                      </div>
                    </Col>
                  </Row>



                </>}
            </CardBody>
          </Card>
        </Col>
        <Col md='5' sm='5' >
        <Row>
             {/* <Row> */}
             <Card>
              <CardBody>
              <table>
  <tbody>
    <tr>
      <td style={{ color: 'blue', textDecoration: 'underline',  paddingRight: '60px' }}>
        <a onClick={() => { { setModificationLogs(true) }}}>Modification Logs</a>
      </td>
      <td style={{ color: 'blue', textDecoration: 'underline',  paddingRight: '60px' }}>
        <a onClick={() => {setViewDailyDetails(true) }}>Daily Details</a>
      </td>
      <td style={{ color: 'blue', textDecoration: 'underline',  paddingRight: '60px' }}>
        <a onClick={() => { 
           if (ReservationData.departureDate != ReservationData.arrivalDate) {
            localStorage.setItem('reservationID',sessionStorage.getItem('reservationID'))
            setshowfixedcharges(!showfixedcharges)

          } else {
            seterrorMsg('Fixed Charges cannot be posted')
          }

        }}>Fixed Charges</a>
      </td>
    </tr>
  </tbody>
</table>



              </CardBody>
              
            </Card>
          {/* </Row> */}
          <Card>
           
            <h4 style={{ marginLeft: '10px', marginTop: '10px' }}>Linked Guests</h4>

            <CardBody>
              <table >
                <thead >
                  <tr>
                    <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Name</b></td>
                    <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Link</b></td>
                    <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Bal</b></td>
                    <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Type</b></td>

                  </tr>
                </thead>
                <tbody>
                  {/* {AllGuests.length != 0 && AllGuests.map((row, index) => (
                    <tr style={row.id == sessionStorage.getItem('reservationID') ? { backgroundColor: '#e6e6fa' } : {}} key={index}>
                      <td style={{ margin: '6px 0', paddingLeft: '10px' }} id={"itemName" + index}>{row.guestName}</td>
                      <td style={{ color: 'blue', textDecoration: 'underline', margin: '6px 0', paddingLeft: '10px' }} id={"link" + index}><a onClick={() => {
                        localStorage.setItem('reservationID', row.id)
                        localStorage.setItem('FolioTabNo', 0)
                      }}
                        target="_blank" href='/dashboard/frontdesk/Billing'>Go To billing</a></td>
                      <td style={{ margin: '6px 0', paddingLeft: '10px' }} id={"itemName" + index}>{row.balance}</td>
                      <td style={{ margin: '6px 0', paddingLeft: '10px' }} id={"itemName" + index}>{row.isMain == 1 ? 'Main Guest' : 'Sharer'}</td>

                    </tr>
                  ))} */}


{AllGuests.length !== 0 && sharerDetails && sharerDetails.length !== 0 &&
                      AllGuests.map((row, index) => {
                        // const guestDetails = sharerDetails.filter((detail) => {console.log("--------------",detail.idrow.id)});
                        // const guestDetails = sharerDetails.filter((detail) => detail.id === row.id);
                        // const guestDetails = sharerDetails.find((detail) => detail.id === row.id);
                        const guestDetails = sharerDetails
                          .flat() // Flatten the array of arrays into a single array
                          .find((detail) => detail.id === row.id);


                        console.log(sharerDetails)
                        console.log('Guest Details for Row:', row.guestName, guestDetails); // Debugging

                        return (
                          <tr
                            style={row.id === sessionStorage.getItem('reservationID') ? { backgroundColor: '#e6e6fa' } : {}}
                            key={index}
                          >
                            <td style={{ margin: '6px 0', paddingLeft: '10px' }} id={"itemName" + index}>
                              {row.guestName}
                            </td>
                            <td
                              style={{ color: 'blue', textDecoration: 'underline', margin: '6px 0', paddingLeft: '10px' }}
                              id={"link" + index}
                            >
                              <a
                                onClick={() => {
                                  localStorage.setItem('reservationID', row.id);
                                  localStorage.setItem('FolioTabNo', 0);
                                }}
                                target="_blank"
                                href='/dashboard/frontdesk/Billing'
                              >
                                Go To billing
                              </a>
                            </td>
                            <td style={{ margin: '6px 0', paddingLeft: '10px' }} id={"itemName" + index}>
                              {row.balance}
                            </td>
                            <td style={{ margin: '6px 0', paddingLeft: '10px' }} id={"itemName" + index}>
                              {row.isMain === 1 ? 'Main Guest' : 'Sharer'}
                            </td>
                            {/* Check if the button should render */}
                            {row.isMain === 0 && guestDetails &&
                              ['Due In', 'Reserved'].includes(guestDetails.reservationStatus) && (
                                <td style={{ margin: '6px 0', paddingLeft: '10px' }}>
                                  <button
                                    style={{
                                      marginRight: '10px',
                                      backgroundColor: '#0057ff',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 10px',
                                      cursor: 'pointer',
                                      borderRadius: '6px'
                                    }}
                                    onClick={() => {
                                      // Handle edge cases for invalid reservation status
                                      if (['Cancelled', 'Checked Out', 'No Show'].includes(guestDetails.reservationStatus)) {
                                        setPopUp('This operation is not allowed for this reservation.');
                                      } else {
                                        // const validDetail = guestDetails.find(g => ['Due In', 'Reserved'].includes(g.reservationStatus));
                                        setfilldata(guestDetails); // Use the valid sharer detail
                                        setCancelReservation(!cancelReservation);
                                      }
                                    }}
                                  >
                                    Cancel / No Show
                                  </button>
                                </td>
                              )}
                          </tr>
                        );
                      })
                    }
                </tbody>
              </table>

            </CardBody>
          </Card>
          </Row>
       
        </Col>
      </Row>



      {/* Select Reason */}

      <Modal
        isOpen={showErrorMsg}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent' toggle={() => {
          setshowErrorMsg(!showErrorMsg);
        }}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h3 className='text-center mb-1'>{errorMsg}</h3>

          <Row>
            <Col className='text-center mt-1' xs={12}>
            
              <Button
                color='primary'
                onClick={() => {
                  setshowErrorMsg(!showErrorMsg)
                }}
              >
                OK
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>

      {/* COnfirm Checkout modal */}
      <Modal
        isOpen={ConfirmCheckOut}
        toggle={() => setConfirmCheckOut(!ConfirmCheckOut)}
        className='modal-dialog-centered'
      >
        <ModalHeader toggle={() => setConfirmCheckOut(!ConfirmCheckOut)} className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h4 className='text-center mb-1'>Do you want to checkOut <b>{ReservationData['salutation'] + ' '}{ReservationData['firstName'] + ' '}{ReservationData['lastName']}</b> {!UnsettledTrxn && CheckOutSharer && <h4> and sharer also </h4>}</h4>

          <p className='text-center mb-1' style={{ color: '#FF0000' }}>Alert : Empty folios will be closed</p>
          {UnsettledTrxn && <p className='text-center mb-1' ><b>Sharer has unsettled transactions. CheckOut Individually</b></p>}

          {ReservationData['isMain'] == 1 && Sharers.length != 0 &&


            <table >

              <thead >
                <tr>

                  {/* <td style={{  margin: '0px 0', paddingLeft: '2px' }}><b>SharerID</b></td> */}
                  <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Name</b></td>
                  <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Link</b></td>
                  <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Bal</b></td>

                </tr>
              </thead>
              <tbody>
                {Sharers.length != 0 && Sharers.map((row, index) => (
                  <tr key={index}>
                    <td style={{ margin: '6px 0', paddingLeft: '10px' }} id={"itemName" + index}>{row.guestName}</td>
                    <td style={{ color: 'blue', textDecoration: 'underline', margin: '6px 0', paddingLeft: '10px' }} id={"link" + index}><a onClick={() => {
                      localStorage.setItem('reservationID', row.id)
                    }}
                      target="_blank" href='/dashboard/frontdesk/Billing'>Go To billing</a></td>
                    <td style={{ margin: '6px 0', paddingLeft: '10px' }} id={"itemName" + index}>{row.balance}</td>

                  </tr>
                ))}
              </tbody>
              <br></br>
              {!UnsettledTrxn && SharerExists && <tr>
                <td style={{ margin: '6px 0', paddingLeft: '10px' }} id={"Default"}>
                  <Input
                    type='checkbox'
                    id='select-all'
                    label=''
                    checked={CheckOutSharer}
                    onChange={() => {
                      setCheckOutSharer(!CheckOutSharer)
                    }}

                  /><b>CheckOut All Sharers</b></td></tr>}
            </table>}


          <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' onClick={CheckOut}>
                Confirm
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                  setConfirmCheckOut(!ConfirmCheckOut)
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>
      {/* <Modal
        isOpen={showLinkedGuests}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent' toggle={() => {
          setshowLinkedGuests(!showLinkedGuests);
        }}></ModalHeader>
        <ModalBody >
         
          <Row>
            <Col  xs={12}>
            
<Card>
  <table >
                <thead >
                  <tr>
                    <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Name</b></td>
                    <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Link</b></td>
                    <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Bal</b></td>
                    <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Type</b></td>

                  </tr>
                </thead>
                <tbody>
                  {AllGuests.length != 0 && AllGuests.map((row, index) => (
                    <tr style={row.id == sessionStorage.getItem('reservationID') ? { backgroundColor: '#e6e6fa' } : {}} key={index}>
                      <td style={{ margin: '6px 0', paddingLeft: '10px' }} id={"itemName" + index}>{row.guestName}</td>
                      <td style={{ color: 'blue', textDecoration: 'underline', margin: '6px 0', paddingLeft: '10px' }} id={"link" + index}><a onClick={() => {
                        localStorage.setItem('reservationID', row.id)
                        localStorage.setItem('FolioTabNo', 0)
                      }}
                        >Go To billing</a></td>
                      <td style={{ margin: '6px 0', paddingLeft: '10px' }} id={"itemName" + index}>{row.balance}</td>
                      <td style={{ margin: '6px 0', paddingLeft: '10px' }} id={"itemName" + index}>{row.isMain == 1 ? 'Main Guest' : 'Sharer'}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
</Card>
            </Col>
          </Row>

        </ModalBody>
      </Modal> */}

      <Modal
        isOpen={modificationLogs}
        toggle={() => setModificationLogs(!modificationLogs)}
        style={{ maxWidth: '1400px', maxHeight: '40vh' }}
      >
        <ModalHeader toggle={() => setModificationLogs(!modificationLogs)} className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-4'>
          <ModificationLogs data={{"id":sessionStorage.getItem('reservationID')}} />

        </ModalBody>
      </Modal>
      <Modal
        isOpen={viewDailyDetails}
        toggle={() => setViewDailyDetails(!viewDailyDetails)}
        style={{ maxWidth: '1400px', maxHeight: '60vh' }}
      >
        <ModalHeader toggle={() => setViewDailyDetails(!viewDailyDetails)} className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-4'>
          <DailyDetailsView data={ReservationData['sharingID']} />
        </ModalBody>
      </Modal>

      <Modal isOpen={showfixedcharges} toggle={() => setshowfixedcharges(!showfixedcharges)}  style={{ maxWidth: '1400px', maxHeight: '60vh' }} >
        <ModalHeader className='modal-lg' toggle={() => { setshowfixedcharges(!showfixedcharges) }}></ModalHeader>
        <ModalBody className='pb-3 px-sm-2 mx-20'>
          <div >
            <FixedCharges />
          </div>
        </ModalBody>
      </Modal>
      {<FolioTab Today={Today} />}

      <div>
        <Modal isOpen={cancelReservation} toggle={() => setCancelReservation(!cancelReservation)} className='modal-xl'>
          <ModalHeader className='bg-transparent' toggle={() => setCancelReservation(!cancelReservation)}></ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <div>
              {filldata.length != 0 && <CancelReservation data1={filldata} />}
            </div>
          </ModalBody>
        </Modal>
      </div>

      {popUp && (
        <div className="disabled-animation-modal">
          <Modal
            isOpen={popUp}
            toggle={() => setPopUp(!popUp)}
            className="modal-sm"
          >
            {" "}
            {/*onClosed={onDiscard}*/}
            <ModalHeader
              className="modal-sm"
              toggle={() => {
                setPopUp(!popUp);
              }}
            >
              Alert !!
            </ModalHeader>
            <ModalBody className="pb-3 px-sm-2 mx-20">
              <div>
                <b>{popUp}</b>
                <br></br>
                <br></br>
                <Button
                  color="primary"
                  className="text-center"
                  onClick={() => setPopUp(false)}
                >
                  Ok
                </Button>
              </div>
            </ModalBody>
          </Modal>
        </div>
      )}
    </div>
  )
}

export default Companydetails;
