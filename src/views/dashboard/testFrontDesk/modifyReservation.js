// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { format } from "date-fns";

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardTitle, CardBody, Row, Col } from 'reactstrap'
import { Check, Circle, Edit2, PlusCircle, Eye, ArrowRightCircle, AlertTriangle } from "react-feather";
import StayNotification from "./stayNotification"
import PackageModification from './packageModification';
import PaymentModification from "./paymentModification"
import PickUpModifications from './pickUpModification';
import DropModifications from './dropModification';
import DailyDetailsModification from './dailyDetailsModification';
import RoomModification from './roomModification'
import GuestModification from './guestModification'
import API_URL from '../../../config';
import ModifyBookingInfo from './modifyBookingInfo';
import ModifyRateCode from './modifyRateCode';
import RateSummary from './viewrateSummary'
import ModifyDiscount from './modifyDiscount'
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const ModifyReservation = (data1) => {
  const [stayNotification, setStayNotification] = useState();
  const [roomModification, setRoomModification] = useState();
  const [packageModification, setPackageModification] = useState();
  const [paymentMethodModification, setPaymentMethodModification] = useState();
  const [pickUpDropModification, setPickUpDropModification] = useState();
  const [dropModification, setDropModification] = useState();
  const [rateSummary, setRateSummary] = useState();
  const [dailyDetails, setDailyDetails] = useState();
  const [guestModification, setGuestModification] = useState();
  const [bookingInfo, setBookingInfo] = useState();
  const [rateCodes, setRateCode] = useState();
  const gridRef = useRef()
  
  const [rowData, setRowData] = useState();
  const [modifyDiscount, setModifyDiscount] = useState();
  const [rowData1, setRowData2] = useState()


  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ))

  const cellClickedListener = useCallback(event => {
    //console.log('cellClicked', event)
  }, [])

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

  const [details, setDetails] = useState('')
  const [pytDetails, setPytDetails] = useState('');
  
  const [ReservationAlerts, setReservationAlerts] = useState([]);
  const [resAlert ,setResAlert]= useState(null);
  const [disResAlert ,setdisResAlert]= useState(false);
  const fetchReservationAlerts = async () => {
    try {
      const result = await fetchx(API_URL + `/getReservationAlerts?hotelID=10&reservationID=${data1.data1.id}`);
      const resp = await result.json();
      console.log(resp['data'].length)
      if(resp['data'][0]['reservationAlert'].length !== 0){
        setdisResAlert(true)
        setResAlert(resp['data'][0]['reservationAlert']);
        setReservationAlerts(resp['data'][0]['reservationAlert']);
      }
      else{
        setdisResAlert(false)
      }
    } catch (error) {
      console.error('Error fetching reservation alerts:', error);
    }
  };

  function toggleModal() {
    setDailyDetails(!dailyDetails);
  }

  useEffect(() => {
      fetchReservationAlerts();

    fetchx(API_URL + `/getMainReservationDetails?sharingID=${data1['data1']['sharingID']}`)
      .then(result => result.json())
      .then(rowData2 => {
        setRowData2(rowData2['data'])
      })

    
    fetchx(API_URL + "/getReservationGuestDetails", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: '1',
        reservationID: data1['data1']['id'],
      })
    })
          .then(result => result.json())
	  .then(rowData => {
        setDetails(rowData['data'][0]);

        fetchx(API_URL + `/getResPaymentInformations?hotelID=1&reservationID=${data1['data1']['tempReservationID']}`)
          .then((result) => result.json())
          .then((rowData) => {
            setPytDetails(rowData["data"][0]);
          })
          .catch((error) => {
            //console.log(error);
          });
      })
      .catch((error) => {
        //console.log(error);
      });
    }, [data1])



  return (
    <div>
{/* new */}
    <div>
        <Modal isOpen={disResAlert}
          toggle={() => setdisResAlert(!disResAlert)} className="modal-sm">
          <ModalHeader className="modal-lg" toggle={() => setdisResAlert(!disResAlert)} ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              {resAlert}
           <br/>
              <Button
                  color="primary"
                  className="me-1"
                  // className="text-center"
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
        <Modal isOpen={stayNotification} toggle={() => setStayNotification(!stayNotification)} className='modal-lg'>
          <ModalHeader className='modal-lg' toggle={() => setStayNotification(!stayNotification)}>Modify Stay Notification</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <StayNotification data1={[data1, rowData1]} />
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal isOpen={roomModification} toggle={() => setRoomModification(!roomModification)} className='modal-lg'>
          <ModalHeader className='modal-lg' toggle={() => setRoomModification(!roomModification)}> Room Modifiation</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <RoomModification data1={data1} />
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal isOpen={packageModification} toggle={() => setPackageModification(!packageModification)} className='modal-lg'>
          <ModalHeader className='modal-lg' toggle={() => setPackageModification(!packageModification)}>Modify Package Details</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <PackageModification data1={data1} />
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal isOpen={paymentMethodModification} toggle={() => setPaymentMethodModification(!paymentMethodModification)} className=''>
          <ModalHeader className='modal-lg' toggle={() => setPaymentMethodModification(!paymentMethodModification)}>Modify Payment Methods</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <PaymentModification data1={data1} />
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal isOpen={pickUpDropModification} toggle={() => setPickUpDropModification(!pickUpDropModification)} className='modal-xl'>
          <ModalHeader className='modal-lg' toggle={() => setPickUpDropModification(!pickUpDropModification)}>Modify PickUp Details</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <PickUpModifications data1={data1} />
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal isOpen={dropModification} toggle={() => setDropModification(!dropModification)} className='modal-xl'>
          <ModalHeader className='modal-lg' toggle={() => setDropModification(!dropModification)}>Modify Drop Details</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <DropModifications data1={data1} />
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal isOpen={dailyDetails} toggle={() => setDailyDetails(!dailyDetails)} className='modal-xl'>
          <ModalHeader className='modal-lg' toggle={() => setDailyDetails(!dailyDetails)}>Modify Daily Details</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
         <DailyDetailsModification data1={data1} toggleModal={toggleModal}/> 
         <ModalFooter>
         <div className="d-flex flex-row justify-content-center">
         {/* <Button outline className="me-1" onClick={() => setDailyDetails(false)}>
              Cancel
            </Button>        */}
            </div>
            </ModalFooter>
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal isOpen={guestModification} toggle={() => setGuestModification(!guestModification)} className='modal-lg'>
          <ModalHeader className='modal-lg' toggle={() => setGuestModification(!guestModification)}>Modify Guests</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <GuestModification data1={data1} />
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal isOpen={rateCodes} toggle={() => setRateCode(!rateCodes)} className='modal-lg'>
          <ModalHeader className='modal-lg' toggle={() => setRateCode(!rateCodes)}> Modify Rate Codes</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <ModifyRateCode data1={data1} />
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal isOpen={bookingInfo} toggle={() => setBookingInfo(!bookingInfo)} className='modal-lg'>
          <ModalHeader className='modal-lg' toggle={() => setBookingInfo(!bookingInfo)}> Modify Booking Information</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <ModifyBookingInfo data1={data1} />
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal isOpen={rateSummary} toggle={() => setRateSummary(!rateSummary)} className='modal-lg'>
          <ModalHeader className='modal-lg' toggle={() => setRateSummary(!rateSummary)}> Modify Rate Summary</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <RateSummary data1={data1} />
          </ModalBody>
        </Modal>
      </div>

      {/* Upsell/Discount modification */}
      <div>
        <Modal isOpen={modifyDiscount} toggle={() => setModifyDiscount(!modifyDiscount)} className='modal-lg'>
          <ModalHeader className='modal-lg' toggle={() => setModifyDiscount(!modifyDiscount)}> Modify Discount/Upsell</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <ModifyDiscount data1={data1} />
          </ModalBody>
        </Modal>
      </div>




      <Card style={{ backgroundColor: '#F2E5D9' }}>
        <Row className='cardBody'>
          <div><h5><Edit2 style={{ height: '20px' }} />Modify/Update</h5></div>

          {
            data1.data1['isMain'] === 0 &&
            <div>
              <Row>
                <Col md='3' sm='12' className='mb-1'>
                  <div className='hoverUnderline' onClick={() => { setStayNotification(!stayNotification) }}>Modify Stay Duration</div>
                </Col>
                <Col md='3' sm='12' className='mb-1'>
                  <div className='hoverUnderline' onClick={() => { setBookingInfo(!bookingInfo) }}>Modify Booking Information </div>
                </Col>
                <Col md='3' sm='12' className='mb-1'>
                  <div className='hoverUnderline' onClick={() => { setRateSummary(!rateSummary) }}> View Rate Summary </div> 
                </Col>
                <Col md='3' sm='12' className='mb-1'>
                  <div className='hoverUnderline' onClick={() => { setGuestModification(!guestModification) }}>Modify Guest </div>
                </Col>
              </Row>
            </div>
          }

{
            data1.data1['isMain'] !== 0 &&
            <div>
              <Row>
                <Col md='2' sm='12' className='mb-1'>
                  <div className='hoverUnderline' onClick={() => { setStayNotification(!stayNotification) }}>Modify Stay Duration</div>
                  <div className='hoverUnderline' onClick={() => { setRoomModification(!roomModification) }}>Modify Room Type  </div>
                </Col>
                <Col md='2' sm='12' className='mb-1'>    
                  <div className='hoverUnderline' onClick={() =>  {data1.data1.blockCodeID=== null ? setPaymentMethodModification(!paymentMethodModification) : handleError('Since this reservation is created from group, these modification is not allowed !!') }}
                  >Modify Payment Method  </div>
                  <div className='hoverUnderline' onClick={() => {data1.data1.blockCodeID=== null ? setDailyDetails(!dailyDetails) : handleError('Since this reservation is created from group, these modification is not allowed !!') } }>Modify Daily Details  </div>
                </Col>
                <Col md='2' sm='12' className='mb-1'>
                <div className='hoverUnderline' onClick={() => { setPickUpDropModification(!pickUpDropModification) }}>Modify PickUp Details </div>
                <div className='hoverUnderline' onClick={() => { setDropModification(!dropModification) }}>Modify Drop Details</div>

                </Col>
                <Col md='2' sm='12' className='mb-1'>
                  <div className='hoverUnderline' onClick={() => { setGuestModification(!guestModification) }}>Modify Guest </div>
                  <div className='hoverUnderline' onClick={() => { setBookingInfo(!bookingInfo) }}>Modify Booking Information </div>
                </Col>
                <Col md='2' sm='12' className='mb-1'>
                  <div className='hoverUnderline' onClick={() => { setRateSummary(!rateSummary) }}> View Rate Summary </div>
                  <div className='hoverUnderline' onClick={() => {data1.data1.blockCodeID=== null ? setPackageModification(!packageModification) : handleError('Since this reservation is created from group, these modification is not allowed !!') }  }>Modify Package </div>
                </Col>
                <Col md='2' sm='12' className='mb-1'>
                {data1.data1['subBookingID'] === null && <div className='hoverUnderline' onClick={() => {data1.data1.blockCodeID=== null ? setModifyDiscount(!modifyDiscount) : handleError('Since this reservation is created from group, these modification is not allowed !!')   }}>
                    Modify Discount/Upsell </div>}
                </Col>
              </Row>
            </div>
          }

        </Row>

      </Card>


      <Card>
        <CardBody>
          <div>
            <Row>
              <Col md='3' sm='12'>
                <h3>
                  Stay Information
                </h3>
                Arrival  :        <b> { details && format(new Date(details['arrivalDate']), 'dd MMM  yy') + ' ' + details['ETA']}             </b> <br></br>
                Departure:        <b> {details && format(new Date(details['departureDate']), 'dd MMM  yy') + ' ' + ' ' + ' ' + details['ETD']}  </b> <br></br>
                Checked in At: <b>{details && details['ATA'] ? format(new Date(details['ATA']), 'dd MMM yy HH:mm:ss') : 'NA'}</b> <br />
                Checked out At:         <b> {details && details['ATD'] ? format(new Date(details['ATD']), 'dd MMM yy HH:mm:ss') : 'NA'}</b> <br></br>                Adults   :        <b> {details['numberOfAdults']}                              </b> <br></br>
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
                Agent :           <b> {details['agentName']}                </b><br></br>
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
                Membership Expiry:<b> {details['membershipexpiry']}     </b>
              </Col>
              <Col md='3' sm='12'>
                <h3>
                  Payment Information
                </h3>
                Payment Type:   <b> {details['paymentTypeCode']}</b><br></br>
           {(pytDetails && pytDetails.cardHolderName)&& <div> Card Holder Name:<b> {pytDetails.cardHolderName}</b> </div> }  
           {(pytDetails && pytDetails.cardHolderName )&& <div> Card Number:   {pytDetails.cardNumber}</div>}
           {(pytDetails && pytDetails.cardHolderName )&& <div> Expiry Date:  {pytDetails.expiryDate}</div>}
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
      </Card>
    </div>
  )
}

export default ModifyReservation
