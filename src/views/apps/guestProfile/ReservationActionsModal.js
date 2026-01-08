import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, Row, Col, Card, Button, CardBody } from "reactstrap";
import { Edit2, PlusCircle, Eye, ArrowRightCircle, File } from "react-feather";
import Attachments from "../../dashboard/testFrontDesk/attachments";
import { format } from 'date-fns';
import ERegistrationCard from "../../dashboard/testFrontDesk/esignregistrationCard";
import PreviewActionsERegCard from "../../dashboard/testFrontDesk/PreviewERegCard";
import RegistrationCard from "../../dashboard/testFrontDesk/registrationCard";
import PreviewActionsRegCard from "../../dashboard/testFrontDesk/PreviewActionsRegCard";
import FixedCharges from "../../dashboard/testFrontDesk/fixedCharges"
import ModificationLogs from "../../dashboard/modificationLog/index";
import ReservationInvoice from "../../dashboard/testFrontDesk/ReservationInvoices";
import PastStays from "../../dashboard/testFrontDesk/futurepaststay";
import GuestPreferences from "../../dashboard/testFrontDesk/prefrence";
import DailyDetailsView from "../../dashboard/testFrontDesk/dailyDetailsView";
import ProfileViews from '../../dashboard/testFrontDesk/profileView'
import Reservation from '../../dashboard/testFrontDesk/reservation'
import { useNavigate } from "react-router-dom";
import Confirmation from "../../dashboard/testFrontDesk/confirmationCard";
import PreviewActions from "../../dashboard/testFrontDesk/PreviewActions";
import History from '../../dashboard/reservation/guestHistory'

import API_URL from "../../../config";

let is_test = false



function ReservationActionsModal({ isOpen, toggle, filldata, details, pytDetails }) {
  // Local states that belong only to modal (if needed)
  const [addSharer, setAddSharer] = useState(false);
  const [modifyRegistration, setModifyRegistration] = useState(false);
  const [cancelReservation, setCancelReservation] = useState(false);
  const [reInstateModal, setReInstateModal] = useState(false);
  const [showReinstateCheckout, setShowReinstateCheckout] = useState(false);
  const [basicModal, setBasicModal] = useState(false);
  const [eregistrationCard, setERegistrationCard] = useState(false);
  const [registrationCard, setRegistrationCard] = useState(false);
  const [showfixedcharges, setshowfixedcharges] = useState(false);
  const [visaDetails, setVisaDetails] = useState(false);
  const [showDepositPost, setShowDepositPost] = useState(false);
  const [modificationLogs, setModificationLogs] = useState(false);
  const [ShowResInvoice, setShowResInvoice] = useState(false)
  const [futureStays, setfutureStays] = useState(false);
  const [preferenceData, setpreferenceData] = useState(false);
  const [viewDailyDetails, setViewDailyDetails] = useState(false);
  const [profileView, setProfileView] = useState(false);
  const [reservationDetails, setReservation] = useState(false);
  const [forex, setForex] = useState(false);
  const [alerts, setAlerts] = useState(false);
  const [confirmationCard, setConfirmationCard] = useState(false);
  const [stayNotification, setStayNotification] = useState();
    const [guestHistory, setOpenGuestHistory] = useState();
  
  // const [details, setDetails] = useState()
  const [popUp, setPopUp] = useState();
  const [disResAlert, setdisResAlert] = useState(false);
  const navigate = useNavigate()



  function toggleModal() {
    setERegistrationCard(false);
    setRegistrationCard(false)
  }



    const GetproformaInv = () => {
      fetchx(API_URL + `/getProFormaInv?reservationID=${sessionStorage.getItem('reser_ID')}`)
        .then(result => result.json())
        .then(resp => {
          if (resp.statusCode == 200 || resp.statusCode == 304) {
  
            if (!is_test) {
  
  
              fetchx(API_URL + "/gets3DocumentIDPMS", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  hotelID: 1,
                  DocName: 'ProformaInvoice',
                  reservationID: sessionStorage.getItem('reser_ID')
                })
              }).then(result => result.json())
                .then(resp => {
                  if (resp.statusCode == 200) {
                    // setInvURL(API_URL + '/images/' + resp['data'])
                    // setShowInvPDF(true)
                    setTimeout(() => {
                      const newTab = window.open('about:blank', '_blank');
                      newTab.location.href = API_URL + '/images/' + resp['data']
                    }, 1000)
                  }
                }).catch((error) => {
                  console.log(error)
                })
  
            } else {
              console.log(API_URL + '/PMS_Invoice/proformaInv_' + sessionStorage.getItem('reser_ID') + '.pdf')
              // setInvURL(API_URL+'/PMS_Invoice/proformaInv_'+sessionStorage.getItem('reser_ID')+'.pdf')
              // setShowInvPDF(true)
  
              setTimeout(() => {
                const newTab = window.open('about:blank', '_blank');
                newTab.location.href = API_URL + '/imagepaths/PMS_Invoice/proformaInv_' + sessionStorage.getItem('reser_ID') + '.pdf'
              }, 1000)
  
  
            }
          }
  
        }).catch((error) => {
          console.log(error)
        })
    }



  return (
    <>
      <div>
        <Modal
          isOpen={isOpen}
          toggle={toggle}
          className="modal-xl"
        >
          <ModalHeader
            className="modal-lg"
            toggle={toggle}
          >
            I Want To..
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-2 mx-20">
            <div>
              <Card style={{ backgroundColor: "#F2E5D9" }}>
                <Row className="cardBody">
                  <Col md="2" sm="12" className="mb-1">
                    <div>
                      <h5>
                        <Edit2 style={{ height: "20px" }} />
                        Modify/Update
                      </h5>
                    </div>
                    <div>
                      {/* <div
                            className="hoverUnderline"
                            onClick={() => {
                              {
                                if (filldata.numberOfRooms > 1) {
                                  setPopUp(
                                    "You have selected more then 1 room need to split the reservation"
                                  );
                                } else {
                                  setAssign(!assign);
                                }
                              }
                              localStorage.removeItem("id");
                            }}
                          >
                            Assign Room
                          </div> */}
                      {/* <div onClick={() => setCheckIn(!checkIn)} className='hoverUnderline'>Begin CheckIn</div>
     <div className='hoverUnderline' onClick={() => setCancelCheckIn(!cancelCheckIn)}>Cancel CheckIn</div> */}
                      {/* <div
                            className="hoverUnderline"
                            onClick={() => {
                              {
                                if (filldata.room === null) {
                                  setPopUp("Assign the room first");
                                } else {
                                  setUnAssign(!unAssign);
                                }
                              }
                            }}
                          >
                            Un-Assign Room
                          </div> */}
                      {/* {filldata && filldata.isMain === 1 && <div
                        className="hoverUnderline"
                        onClick={() => {
                          if (filldata.numberOfRooms > 1) {
                            let message = `Since this reservation has more than one room, cannot add sharer. \n  First split the reservation, and then add the sharer`
                            handleError(message)
                            // setPopUp(
                            //   "You have selected more then 1 room need to split the reservation"
                            // );
                          } else if (
                            filldata.arrivalDate < Today &&
                            filldata.departureDate < Today
                          ) {
                            setPopUp(
                              "You can't add sharer because you crossed the departure date"
                            );
                          } else {
                            setAddSharer(true);
                          }
                        }}
                      >
                        Add Sharer
                      </div>} */}
                      <div
                        onClick={() => {
                          if (filldata.reservationStatus == 'Cancelled' || filldata.reservationStatus == 'Checked Out' || filldata.reservationStatus == 'No Show') {
                            setPopUp('Cannot modify this reservation !!')
                          } else {
                            setModifyRegistration(!modifyRegistration)
                          }
                          setdisResAlert(!disResAlert);
                        }
                        }
                        className="hoverUnderline"
                      >
                        Modify Reservation
                      </div>
                      {/* {filldata.isMain !=0 &&  */}
                      <div className='hoverUnderline' onClick={() => {
                        if (filldata.reservationStatus == 'Cancelled' || filldata.reservationStatus == 'Checked Out' || filldata.reservationStatus == 'No Show') {
                          setPopUp('This operation is not allowed for this reservation.')
                        } else {
                          setCancelReservation(!cancelReservation)
                        }
                      }}>
                        Cancel Reservation <br></br>/ No Show</div>
                      {
                        (filldata.reservationStatus == 'No Show' || filldata.reservationStatus == 'Cancelled') &&
                        <div className="hoverUnderline" onClick={() => setReInstateModal(!reInstateModal)}>
                          Re-Instate Reservation

                        </div>}
                      {/* {filldata.reservationStatus === 'Checked Out' && <div
                            onClick={() => {
                              if (filldata.departureDate == Today) {
                                setShowReinstateCheckout(true)
    
                              } else {
                                setPopUp('Previous days Checkout cannot be reinstated')
                              }
                            }}
                            className="hoverUnderline">
                            Re-Instate Check Out
                          </div>} */}
                      {/* <div
                            className="hoverUnderline">
                              No Show
                            </div> */}
                    </div>
                  </Col>
                  <Col md="2" sm="12" className="mb-1">
                    <div>
                      <h5>
                        <PlusCircle style={{ height: "20px" }} />
                        Create
                      </h5>
                    </div>

                    {filldata["numberOfRooms"] > 1 && (
                      <div
                        className="hoverUnderline"
                        onClick={() => setBasicModal(!basicModal)}
                      >
                        Split Reservation
                      </div>
                    )}
                    <div className="hoverUnderline">Copy Reservation</div>
                    <div onClick={() => setERegistrationCard(!eregistrationCard)} className="hoverUnderline"
                    >
                      e-Sign Registration Card
                    </div>
                    <div
                      onClick={() => setRegistrationCard(!registrationCard)}
                      className="hoverUnderline"
                    >
                      Registration Card
                    </div>
                    <div className='hoverUnderline' onClick={() => {
                      console.log(filldata)
                      if (filldata.reservationStatus == 'Cancelled' || filldata.reservationStatus == 'Checked Out' || filldata.reservationStatus == 'No Show') {
                        setPopUp('This operation is not allowed for this reservation.')
                      } else {
                        if (filldata.departureDate != filldata.arrivalDate) {
                          setshowfixedcharges(!showfixedcharges)

                        } else {
                          setPopUp('Fixed Charges cannot be posted')
                        }
                      }

                    }}>Fixed Charges Posting</div>
                    <div
                      onClick={() => {
                        if (filldata.reservationStatus == 'Cancelled' || filldata.reservationStatus == 'Checked Out' || filldata.reservationStatus == 'No Show') {
                          setPopUp('This operation is not allowed for this reservation.')
                        } else {
                          setVisaDetails(!visaDetails)

                        }
                      }}
                      className="hoverUnderline"
                    >
                      Add Visa Details
                    </div>
                    <div

                      className="hoverUnderline"
                      onClick={() => {


                        if (filldata.reservationStatus == 'Reserved' || filldata.reservationStatus == 'Due In') {
                          setShowDepositPost(true)

                        } else {
                          setPopUp('Deposit cannot be posted')
                        }
                      }}
                    >
                      Deposit / Cancellation
                    </div>
                  </Col>
                  <Col md="2" sm="12" className="mb-1">
                    <div>
                      <h5>
                        <Eye style={{ height: "20px" }} />
                        View
                      </h5>
                    </div>

                    <div className="hoverUnderline" onClick={() => { setModificationLogs(true) }}>Changes Log</div>
                    <div className="hoverUnderline" onClick={() => { setShowResInvoice(true) }}>Invoice</div>
                    <div
                      className="hoverUnderline"
                    >

                      Communication
                    </div>
                    <div
                      className="hoverUnderline"
                      onClick={() => { setfutureStays(true) }}
                    >
                      Future & Past Stays
                    </div>
                    <div
                      className="hoverUnderline"
                      onClick={() => { setpreferenceData(true) }}
                    >
                      Preferences
                    </div>
                    <div className="hoverUnderline" onClick={() => { setViewDailyDetails(true) }}>
                      Daily Details
                    </div>

                  </Col>
                  <Col md="2" sm="12" className="mb-1">
                    <div>
                      <h5>
                        <ArrowRightCircle style={{ height: "20px" }} />
                        Go To
                      </h5>
                    </div>
                    <div className='hoverUnderline' onClick={() => {
                      localStorage.setItem('FolioTabNo', 0)
                      console.log('Setting reservationID in session s6torage', filldata)
                      localStorage.setItem('reservationID', filldata.id)
                      // setTimeout(() => { navigate('/dashboard/frontdesk/Billing') }, 600)
                      setTimeout(() => { window.open('/dashboard/frontdesk/Billing') }, 400)

                    }}>Billing</div>
                    <div onClick={() => setProfileView(!profileView)} className="hoverUnderline">Profile</div>
                    <div onClick={() => {
                      setdisResAlert(!disResAlert);
                      setReservation(!reservationDetails)
                    }
                    }
                      className="hoverUnderline">Reservation</div>

                    <div
                      onClick={() => setForex(!forex)}
                      className="hoverUnderline"
                    >
                      Payment instructions
                    </div>
                    <div className="hoverUnderline" onClick={() => {
                      if (filldata.reservationStatus == 'Cancelled' || filldata.reservationStatus == 'Checked Out' || filldata.reservationStatus == 'No Show') {
                        setPopUp('This operation is not allowed for this reservation.')
                      } else {
                        setAlerts(!alerts)
                      }
                    }}
                      >

                        {/* <AlertTriangle style={{ height: "20px" }} /> */ }
                      Alerts
                    </div>

                </Col>
                <Col md="2" sm="12" className="mb-1">
                  {/* <Col md="6" sm="12" className="mb-1"> */}
                  <div>
                    <h5>
                      <File style={{ height: "20px" }} />
                      Documents
                    </h5>
                  </div>

                  <div
                    onClick={() => setConfirmationCard(!confirmationCard)}
                    className="hoverUnderline"
                  >
                    Confirmation Letter
                  </div>
                  <div
                    // onClick={() => setProFormaFolio(!proFormaFolio)}
                    onClick={() => { GetproformaInv() }}

                    className="hoverUnderline"
                  >
                    Proforma Invoice
                  </div>

                  {/* <br></br> */}
                  {/* <h5>Attachments</h5> */}
                  <div className="hoverUnderline" onClick={() => { setStayNotification(!stayNotification) }}>
                    {/* <File style={{ height: "20px" }} /> */}
                    Reservation attachments
                  </div>
                  <div>
                    <Modal isOpen={stayNotification} toggle={() => setStayNotification(!stayNotification)} className='modal-lg'>
                      <ModalHeader className='modal-lg' toggle={() => setStayNotification(!stayNotification)}>Reservation Attachments</ModalHeader>
                      <ModalBody className='pb-3 px-sm-1 mx-20'>
                        <Attachments data1={filldata} />
                      </ModalBody>
                    </Modal>
                  </div>
                  {/* </Col>
                    <Col md="6" sm="12" className="mb-1"> */}


                  {/* </Col> */}

                </Col>
              </Row>
            </Card>

            {details !== undefined && <Card>
              <CardBody>
                <div>
                  <Row>
                    <Col md='3' sm='12' >
                      <h3>
                        Stay Information
                      </h3>
                      Arrival  :        <b> {details && format(new Date(details['arrivalDate']), 'dd MMM  yy') + ' ' + details['ETA']}             </b> <br></br>
                      Departure:        <b> {details && format(new Date(details['departureDate']), 'dd MMM  yy') + ' ' + ' ' + ' ' + details['ETD']}  </b> <br></br>
                      Checked in At: <b>{details && details['ATA'] ? format(new Date(details['ATA']), 'dd MMM yy HH:mm:ss') : 'NA'}</b> <br />
                      Checked out At:         <b> {details && details['ATD'] ? format(new Date(details['ATD']), 'dd MMM yy HH:mm:ss') : 'NA'}</b> <br></br>
                      Adults   :        <b> {details['numberOfAdults']}                              </b> <br></br>
                      Children :        <b> {details['numberOfChildren']}                            </b> <br></br>
                      Number Of Rooms : <b> {details['numberOfRooms']}                               </b> <br></br>
                      Package :         <b> {details['packageCode']}                                 </b><br></br>
                      RoomType:         <b> {details['roomType']}                                    </b><br></br>
                      RTC :             <b> {details['roomToChargeName']}                                    </b><br></br>
                      Rate:             <b> {details['rate']}                                        </b><br></br>
                      RateCode:         <b> {details['rateCode']}</b>
                    </Col>
                    <Col md='3' sm='12'>
                      <h3>
                        Booking Information
                      </h3>
                      Company Name :    <b> {details['Companyname']}             </b> <br></br>
                      ResType :         <b> {details['reservationTypeDescription']} </b><br></br>
                      ExtraDescription :<b> {details['extra']}                      </b><br></br>
                      source :          <b> {details['sourceCode']}                 </b><br></br>
                      Agent :           <b> {details['accountName']}                </b><br></br>
                      Origin :          <b> {details['origin']}                     </b><br></br>
                      Market :          <b> {details['marketCode']}                 </b><br></br>
                      Group name :      <b> {details['groupName']}                  </b><br></br>
                      Block Code        <b> {details['blockCodeID']}                </b><br></br>
                    </Col>
                    <Col md='3' sm='12'>
                      <h3>
                        Other Information
                      </h3>
                      Preferences :    <b> {details['preference']}                     </b><br></br>
                      DNM :            <b> {details['doNotMove'] === 0 ? 'NO' : 'YES'} </b><br></br>
                      PrintRate :      <b> {details['printRate'] === 0 ? 'NO' : 'YES'} </b><br></br>
                      No Post :        <b> {details['noPost'] === 0 ? 'NO' : 'YES'}   </b><br></br>
                      Booker :         <b> {details['bookerName']}                     </b><br></br>
                      Booker Number :  <b> {details['bookerNumber']}                   </b><br></br>
                      Booker Email:    <b> {details['bookeremail']}                    </b><br></br>
                      Comments:        <b> {details['comments']}                       </b><br></br>
                      Billing Instructions:  <b> {details['billingInstruction']}       </b><br></br>

                    </Col>
                    <Col md='3' sm='12'>
                      <h3>
                        PickUp and Drop Details
                      </h3>
                      PickUpDate :         <b> {details['pickUpDate']}         </b><br></br>
                      PickUpTime :         <b> {details['pickUpTime']}         </b><br></br>
                      PickUpStationCode :  <b> {details['pickUpStationCode']}  </b><br></br>
                      PickUpCarrierCode :  <b> {details['pickUpCarrierCode']}  </b><br></br>
                      PickUpTransportType :<b> {details['pickUpTransportype']}</b><br></br>
                      PickupRemarks :      <b> {details['pickupRemarks']}      </b><br></br>
                      DropDate :           <b> {details['dropDate']}           </b><br></br>
                      DropTime :           <b> {details['dropTime']}           </b><br></br>
                      DropStationCode :    <b> {details['dropStationCode']}    </b><br></br>
                      DropCarrierCode :    <b> {details['dropCarrierCode']}    </b><br></br>
                      DropTransportType :  <b> {details['dropTransporttype']}  </b><br></br>
                      DropRemarks :        <b> {details['dropRemarks']}        </b><br></br>
                    </Col>

                  </Row>
                  <Row>
                    <Col md='3' sm='12'>
                      <h3>
                        Guest Details
                      </h3>
                      GuestName :   <b> {details["salutation"] + ' ' + details["firstName"] + ' ' + details["lastName"]}</b><br></br>
                      Email :       <b> {details['email']}      </b><br></br>
                      Phone Number :<b> {details['guestNumbers']}</b><br></br>
                      Address One : <b> {details['addressOne']} </b><br></br>
                      City :        <b> {details['city']}       </b><br></br>
                      State :       <b> {details['state']}      </b><br></br>
                      Country :     <b> {details['countriesname']}    </b><br></br>
                      PostalCode :  <b> {details['postalCode']} </b><br></br>
                    </Col>

                    <Col md='3' sm='12'>
                      <h3>
                        Membership Details
                      </h3>
                      Membership Type:  <b> {details["membershipName"]} </b><br></br>
                      Membership Since :<b> {details['membershipSince'] === 'Invalid Date' ? '' : details['membershipSince']}</b><br></br>
                      Membership Number:<b> {details['membershipNo']}   </b><br></br>
                      Membership Level :<b> {details['levelname']}</b><br></br>
                      Past Nights  :<b> {details['numOfNights']}</b><br></br>
                      Past Stay :<b> {details['numOfStay']}</b><br></br>
                      {/* <link  onClick={() => setOpenGuestHistory(true)} >
    
                              Guest History
                            </link> */}
                      <span
                        style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                        onClick={() => setOpenGuestHistory(true)}
                      >
                        Guest History
                      </span>
                      {/* Membership Expiry:<b> {details['membershipexpiry']}     </b> */}
                    </Col>
                    <Col md='3' sm='12'>
                      <h3>
                        Payment Information
                      </h3>
                      Payment Type:   <b> {details['paymentTypeCode']}</b><br></br>
                      {(pytDetails && pytDetails.cardHolderName) && <div> Card Holder Name:<b> {pytDetails.cardHolderName}</b> </div>}
                      {(pytDetails && pytDetails.cardHolderName) && <div> Card Number:   {pytDetails.cardNumber}</div>}
                      {(pytDetails && pytDetails.cardHolderName) && <div> Expiry Date:  {pytDetails.expiryDate}</div>}
                      {(pytDetails && pytDetails.upiID) && <div>Transaction ID: {pytDetails.upiID}</div>}
                    </Col>
                    <Col md='3' sm='12'>
                      <h3>
                        Attachments Information
                      </h3>
                      Attachments:   <b> {details['attachments']}</b><br></br>
                    </Col>
                  </Row>
                </div>
              </CardBody>
            </Card>}
          </div>
        </ModalBody>
      </Modal>



      <div>
        <Modal
          isOpen={eregistrationCard}
          toggle={() => setERegistrationCard(!eregistrationCard)}
          className="modal-xl"
        >
          <ModalHeader
            className="modal-lg"
            toggle={() => setERegistrationCard(!eregistrationCard)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              {filldata.length != 0 && (
                <Row>
                  <Col md="8" sm="12">
                    <ERegistrationCard data1={filldata} toggleModal={toggleModal} />
                  </Col>
                  <Col md="4" sm="12">
                    <PreviewActionsERegCard data1={filldata} />
                  </Col>
                </Row>
              )}
            </div>
          </ModalBody>
        </Modal>
      </div>

  <div>
                      <Modal isOpen={stayNotification} toggle={() => setStayNotification(!stayNotification)} className='modal-lg'>
                        <ModalHeader className='modal-lg' toggle={() => setStayNotification(!stayNotification)}>Reservation Attachments</ModalHeader>
                        <ModalBody className='pb-3 px-sm-1 mx-20'>
                          <Attachments data1={filldata} />
                        </ModalBody>
                      </Modal>
                    </div>

      <div>
        <Modal
          isOpen={registrationCard}
          toggle={() => setRegistrationCard(!registrationCard)}
          className="modal-xl"
        >
          <ModalHeader
            className="modal-lg"
            toggle={() => setRegistrationCard(!registrationCard)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              {filldata.length != 0 && (
                <Row>
                  <Col md="8" sm="12">
                    <RegistrationCard data1={filldata} toggleModal={toggleModal} />
                  </Col>
                  <Col md="4" sm="12">
                    <PreviewActionsRegCard data1={filldata} />
                  </Col>
                </Row>
              )}
            </div>
          </ModalBody>
        </Modal>
      </div>

      {filldata !== "" && <Modal
        isOpen={modificationLogs}
        toggle={() => setModificationLogs(!modificationLogs)}
        style={{ maxWidth: '1400px', maxHeight: '60vh' }}
      >
        <ModalHeader toggle={() => setModificationLogs(!modificationLogs)} className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-4'>
          <ModificationLogs data={filldata} />

        </ModalBody>
      </Modal>}


      {filldata !== "" && <Modal
        isOpen={viewDailyDetails}
        toggle={() => setViewDailyDetails(!viewDailyDetails)}
        style={{ maxWidth: '1400px', maxHeight: '60vh' }}
      >
        <ModalHeader toggle={() => setViewDailyDetails(!viewDailyDetails)} className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-4'>
          <DailyDetailsView data={filldata.sharingID} />
        </ModalBody>
      </Modal>}

      <Modal
        isOpen={ShowResInvoice}
        toggle={() => setShowResInvoice(!ShowResInvoice)}
        className="modal-xl"
      >
        <ModalHeader toggle={() => setShowResInvoice(!ShowResInvoice)} className='bg-transparent'>Re-instate Folio</ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>


          <ReservationInvoice />

        </ModalBody>
      </Modal>


      <div>
        <Modal
          isOpen={futureStays}
          toggle={() => setfutureStays(!futureStays)}
          className="modal-xl"
        >
          <ModalHeader
            className="modal-xl"
            toggle={() => setfutureStays(!futureStays)}
          >
            View Future Stays
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <PastStays data1={filldata} />
          </ModalBody>
        </Modal>
      </div>


    <div>
        <Modal
          isOpen={confirmationCard}
          toggle={() => setConfirmationCard(!confirmationCard)}
          className="modal-xl"
        >
          <ModalHeader
            className="modal-lg"
            toggle={() => setConfirmationCard(!confirmationCard)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              {filldata.length != 0 && (
                <Row>
                  <Col md="8" sm="12">
                    <Confirmation data1={filldata} />
                  </Col>
                  <Col md="4" sm="12">
                    <PreviewActions data1={filldata} />
                  </Col>
                </Row>
              )}
            </div>
          </ModalBody>
        </Modal>
      </div>

      <div>
        <Modal
          isOpen={reservationDetails}
          toggle={() => setReservation(!reservationDetails)}
          className="modal-xl"
        >
          <ModalHeader
            className="bg-transparent"
            toggle={() => setReservation(!reservationDetails)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              {filldata.length != 0 && <Reservation data1={filldata} />}
            </div>
          </ModalBody>
        </Modal>
      </div>

      <div>
        <Modal
          isOpen={preferenceData}
          toggle={() => setpreferenceData(!preferenceData)}
          className="modal-md"
        >
          <ModalHeader
            className="modal-md"
            toggle={() => setpreferenceData(!preferenceData)}
          >
            View Guest Preferences
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <GuestPreferences data1={filldata} />
          </ModalBody>
        </Modal>
      </div>


      <div>
        <Modal isOpen={profileView} toggle={() => setProfileView(!profileView)} className="modal-lg"  >
          <ModalHeader className="modal-lg" toggle={() => setProfileView(!profileView)} >
            View Profile
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <ProfileViews data1={filldata} />
          </ModalBody>
        </Modal>
      </div>

   <div className="vertically-centered-modal">

        <Modal
          isOpen={guestHistory}
          toggle={() => setOpenGuestHistory(!guestHistory)}
          className="modal-xl"
        >
          <ModalHeader toggle={() => setOpenGuestHistory(!guestHistory)}>
            Welcome...
          </ModalHeader>
          <ModalBody>


            {filldata.length != 0 && guestHistory !== false && <History data1={filldata} operation='reservationHistory' />}

          </ModalBody>

        </Modal>
      </div>


      {filldata !== "" && <Modal isOpen={showfixedcharges} toggle={() => setshowfixedcharges(!showfixedcharges)} className='modal-lg' >
        <ModalHeader className='modal-lg' toggle={() => { setshowfixedcharges(!showfixedcharges) }}></ModalHeader>
        <ModalBody className='pb-3 px-sm-2 mx-20'>
          <div >
            <FixedCharges />
          </div>
        </ModalBody>
      </Modal>}
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
    </div >
    </>
  );
}

export default ReservationActionsModal;
