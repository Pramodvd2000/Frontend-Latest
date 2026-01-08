// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
// import './Assettable.css';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Button, Modal, ModalBody, Card, ModalHeader, Row, Col, Label, Input, CardBody } from 'reactstrap';
import { format } from "date-fns";
import AssignRoom from './assignRoom';
import RoomMove from './roomMove';
import { Check, Circle, Edit2, PlusCircle, Eye, ArrowRightCircle, AlertTriangle, File } from "react-feather";
import ForCheckInIdDetails from './forCheckInIdDetails'
import API_URL from '../../../config';
import ModifyReservation from "./modifyReservation";
import CancelCheckIn from './cancelCheckIn';
import AddSharer from "./addSharer";
import VisaDetails from './visaDetails'
import Confirmation from "./confirmationCard";
import PreviewActions from "./PreviewActions";
import RegistrationCard from "./registrationCard";
import PreviewActionsRegCard from "./PreviewActionsRegCard";
import Reservation from './reservation'
import ProfileViews from './profileView'
import Attachments from './attachments'
import Moment from 'moment';
import ModificationLogs from "../modificationLog";
import DailyDetailsView from "./dailyDetailsView";
import GuestPreferences from "./prefrence";
import PastStays from "./futurepaststay";
import Alerts from "./alerts";

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'

localStorage.removeItem('reservationStart');
localStorage.removeItem('reservationEnd');

function StayOver() {
  const [stayNotification, setStayNotification] = useState();
  const [rowData, setRowData] = useState();
  const [form, setSharer] = useState();
  const [pytDetails, setPytDetails] = useState();
  const [checkIn, setCheckIn] = useState();
  const [viewDailyDetails, setViewDailyDetails] = useState(false)
  const [modificationLogs, setModificationLogs] = useState(false)
  const [checkOut, setCheckOut] = useState();
  const [assign, setAssign] = useState();
  const [filldata, setfilldata] = useState('');
  const [roomMove, setRoomMove] = useState();
  const [options, setOptions] = useState();
  const [popUp, setPopUp] = useState();
  const [addSharer, setAddSharer] = useState(false);
  const [modifyRegistration, setModifyRegistration] = useState();
  const [cancelCheckIn, setCancelCheckIn] = useState();
  const [visaDetails, setVisaDetails] = useState();
  const [confirmationCard, setConfirmationCard] = useState();
  const [registrationCard, setRegistrationCard] = useState();
  const [profileView, setProfileView] = useState();
  const [reservationDetails, setReservation] = useState();
  const [details, setDetails] = useState()
  const [futureStays, setfutureStays] = useState();
  const [preferenceData, setpreferenceData] = useState();
  const [show, setShow] = useState();
  const [alerts, setAlerts] = useState();


  var Today = format(new Date(), "yyyy-MM-dd")
  let yesterday = new Date(Today)
  yesterday.setDate(yesterday.getDate() + 1)
  var Tomorrow = format(new Date(yesterday), "yyyy-MM-dd")

  //console.log(Today)
  //   //console.log(Tomorrow)

  const gridRef = useRef();


  const BookingIdRenderer = (params) => {
    return (
      // <div style={{ display: 'flex', alignItems: 'start', gap: '4px' }}>
      <div style={{ alignItems: 'start'}}>
        {params.data?.hasMembership === 1 ? (
          <>
          {/* <Star style={{
            height: '20px',
            width: '20px',
  
          }}/> */}
            <span style={{
              backgroundColor: '#000',
              color: '#FFD700',
              padding: '5px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 'bold',
              marginRight:'10px'
         
            }}>
              OX
            </span>
        <span>{params.value}</span>
        </>
  
        ) : <span>{params.value}</span>}
      </div>
    );
  };



  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "BookingID",
      field: "bookingID",
      valueGetter: (params) => {
        if (params.data && params.data.bookingID && params.data.isMain === 0) {
          return `${params.data.bookingID}*`;
        }
        return params.data.bookingID;
      },
      suppressSizeToFit: true,
      maxWidth: 100,
    },
    { headerName: 'Guest', field: 'guestName', suppressSizeToFit: true, maxWidth: 125, cellRenderer: BookingIdRenderer },
    { headerName: 'Comp/Agt', field: 'accountName', suppressSizeToFit: true, maxWidth: 140 },
    {
      headerName: "Arrival",
      field: "arrivalDate",
      suppressSizeToFit: true,
      maxWidth: 140,
      cellRenderer: (params) => {
        // Ensure the arrivalDate field exists in the row data        
        if (params.data && params.data.arrivalDate) {
          // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
          // const formattedDate = Moment(params.data.arrivalDate).format("DD-MM-YYYY");
          const formattedDate =format(new Date(params.data.arrivalDate), 'dd MMM  yy');

          return formattedDate;
        } else {
          return ""; // Handle cases where the data is missing or invalid        
        }
      }
    },
    {
      headerName: "Departure",
      field: "departureDate",
      suppressSizeToFit: true,
      maxWidth: 140,
      cellRenderer: (params) => {
        // Ensure the arrivalDate field exists in the row data        
        if (params.data && params.data.departureDate) {
          // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
          // const formattedDate = Moment(params.data.departureDate).format("DD-MM-YYYY");
          const formattedDate =format(new Date(params.data.departureDate), 'dd MMM  yy');

          return formattedDate;
        } else {
          return ""; // Handle cases where the data is missing or invalid        
        }
      }
    },
    { headerName: 'Room Type', field: 'roomType', suppressSizeToFit: true, maxWidth: 130 },
    { headerName: 'Status', field: 'reservationStatus', suppressSizeToFit: true, maxWidth: 130 },
    { headerName: 'Room No.', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 120 },
    {
      headerName: 'Actions', cellRendererFramework: (params) => <Button color='primary' style={{ width: 128 }} onClick={() => setOptions(!options)} >Actions</Button>, suppressSizeToFit: true, cellStyle: { textAlign: 'center' },
      cellClass: 'vertical-center',
    },
    {
      headerName: "No. Adults",
      field: "numberOfAdults",
      suppressSizeToFit: true,
      maxWidth: 140,
    },
    {
      headerName: "No. Rooms",
      field: "numberOfRooms",
      suppressSizeToFit: true,
      maxWidth: 140,
    },
    {
      headerName: "Block Code ID",
      field: "blockCodeID",
      suppressSizeToFit: true,
      maxWidth: 150,
    },
    {
      headerName: "Payment Method",
      field: "paymentTypeCode",
      suppressSizeToFit: true,
      maxWidth: 140,

    },
    { headerName: 'Market Code', field: 'marketCode', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Source Code', field: 'sourceCode', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Account Name', field: 'accountName', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Rate Code', field: 'rateCode', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Origin', field: 'origin', suppressSizeToFit: true, maxWidth: 140 },

  ]);


  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      autoHeight: true,
      wrapText: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));

  // CSS for vertical centering
  const customStyles = `
.vertical-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
`;

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const getRowStyle = params => {

    if (params.data && params.data.subBookingID !== null && params.data.subBookingID !== '0') {
      return { background: '#f1c40f' };
    }
    return null;
  };

  const cellClickedListener = useCallback(event => {
    fetchx(API_URL + "/getReservationGuestDetails", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: '1',
        reservationID: event['data']['id'],
      })
    })
      .then(result => result.json())
      .then(rowData => {
        //console.log(rowData['data']);
        setDetails(rowData['data'][0]);
        //console.log(rowData['data'][0]['guestID']);

        fetchx(API_URL + `/getResPaymentInformations?hotelID=1&reservationID=${event['data']['tempReservationID']}`)
          .then((result) => result.json())
          .then((rowData) => {
            setPytDetails(rowData["data"][0]);
            //console.log(rowData["data"]);
          })
          .catch((error) => {
            //console.log(error);
          });
      })
      .catch((error) => {
        //console.log(error);
      });
    setfilldata(event['data'])
    localStorage.setItem('reservationStart', event['data']['Start']);
    localStorage.setItem('reservationEnd', event['data']['End']);
  }, []);

  useEffect(() => {
    fetchx(API_URL + '/getReservationForFrontDeskStayOverBWToday?Start=' + Today + '&End=' + Today + '')
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
        //console.log(rowData)

      })
  }, []);



  const buttonListener = useCallback(e => {
    gridRef.current.api.deselectAll();
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box5').value
    );
  }, []);

  return (
    <div>
      {/* <button onClick={buttonListener}>Push Me</button> */}
      <div>
        <Col md='3' sm='12' className='mb-1'>
          <Label className='form-label' for='fullName'>
            Search
          </Label>
          <Input
            type="text"
            id="filter-text-box5"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
          />
        </Col>
      </div>
      <div className="ag-theme-alpine" style={{ height: 520 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData} columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          getRowStyle={getRowStyle}
          onCellClicked={cellClickedListener}
          paginationPageSize='10'
          pagination='true'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"

        />
      </div>
      <div>
        <Modal isOpen={assign} toggle={() => setAssign(!assign)} className='modal-xl'>
          <ModalHeader className='modal-xl' toggle={() => setAssign(!assign)}></ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <div>
              {/* <AssignRoom/> */}
              {filldata.length != 0 && <AssignRoom data1={filldata} />}
            </div>
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
      {/* <div>
    <Modal isOpen={checkIn} toggle={() => setCheckIn(!checkIn)} className='demo-inline-spacing'>
        <ModalHeader className='bg-transparent' toggle={() => setCheckIn(!checkIn)}></ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>
          <div>
          {filldata.length!=0 && <CheckIn data1={filldata} />}
          </div>
        </ModalBody>
      </Modal>
      </div> */}
      <div>
        <Modal isOpen={checkIn} toggle={() => setCheckIn(!checkIn)} className='modal-lg'>
          <ModalHeader className='modal-lg' toggle={() => setCheckIn(!checkIn)}></ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <div>
              {filldata.length != 0 && <ForCheckInIdDetails data1={filldata} />}
            </div>
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal isOpen={roomMove} toggle={() => setRoomMove(!roomMove)} className='modal-xl'>
          <ModalHeader className='bg-transparent' toggle={() => setRoomMove(!roomMove)}></ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <div>
              {filldata.length != 0 && <RoomMove data1={filldata} />}
            </div>
          </ModalBody>
        </Modal>
      </div>

      <div>
        <div>
          <Modal
            isOpen={addSharer}
            toggle={() => setAddSharer(!addSharer)}
            className="modal-xl"
          >
            <ModalHeader
              className="bg-transparent"
              toggle={() => setAddSharer(!addSharer)}
            ></ModalHeader>
            <ModalBody className="pb-3 px-sm-1 mx-20">
              <div>
                {/* {filldata.length!=0 &&  filldata.numberOfRooms > 1 ? (setPopUp("You have selected more then 1 room need to split the reservation")) : <AddSharer data1={filldata} />} */}
                {filldata.length != 0 && <AddSharer data1={filldata} />}
              </div>
            </ModalBody>
          </Modal>
        </div>
        <Modal isOpen={cancelCheckIn} toggle={() => setCancelCheckIn(!cancelCheckIn)} className='demo-inline-spacing'>
          <ModalHeader className='bg-transparent' toggle={() => setCancelCheckIn(!cancelCheckIn)}></ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <div>
              {filldata.length != 0 && <CancelCheckIn data1={filldata} />}
            </div>
          </ModalBody>
        </Modal>
      </div>
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
                    <RegistrationCard data1={filldata} />
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

      <div>
        <Modal
          isOpen={modifyRegistration}
          toggle={() => setModifyRegistration(!modifyRegistration)}
          className="modal-xl"
        >
          <ModalHeader
            className="modal-lg"
            toggle={() => setModifyRegistration(!modifyRegistration)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              <ModifyReservation data1={filldata} />
            </div>
          </ModalBody>
        </Modal>
      </div>

      <div>
        <Modal isOpen={alerts}
          toggle={() => setAlerts(!alerts)} className="modal-xl">
          <ModalHeader className="modal-lg" toggle={() => setAlerts(!alerts)} ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              <Alerts data1={filldata} />
            </div>
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal isOpen={options} toggle={() => setOptions(!options)} className='modal-xl' >
          <ModalHeader className='modal-lg' toggle={() => { setOptions(!options) }}>I Want To..</ModalHeader>
          <ModalBody className='pb-3 px-sm-2 mx-20'>
            <div >
              <Card style={{ backgroundColor: '#F2E5D9' }}>
                <Row className='cardBody'>
                  <Col md='2' sm='12' className='mb-1'>
                    <div><h5><Edit2 style={{ height: '20px' }} />Modify/Update</h5></div>
                    <div>
                      <div className='hoverUnderline' onClick={() => setRoomMove(!roomMove)}>Room Move</div>
                      <div className='hoverUnderline' onClick={() => setCancelCheckIn(!cancelCheckIn)}>Cancel CheckIn</div>
                      <div
                        className="hoverUnderline"
                        onClick={() => {
                          if (filldata.numberOfRooms > 1) {
                            setPopUp(
                              "You have selected more then 1 room need to split the reservation"
                            );
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
                      </div>
                      <div
                        onClick={() =>
                          setModifyRegistration(!modifyRegistration)
                        }
                        className="hoverUnderline"
                      >
                        Modify Reservation
                      </div>
                    </div>
                  </Col>
                  <Col md='2' sm='12' className='mb-1'>
                    <div><h5><PlusCircle style={{ height: '20px' }} />Create</h5></div>

                    <div className='hoverUnderline'>Copy Reservation</div>
                    <div className='hoverUnderline'>e-Sign Registration Card</div>
                    <div
                      onClick={() => setRegistrationCard(!registrationCard)}
                      className="hoverUnderline"
                    >
                      Registration Card
                    </div>

                  </Col>
                  <Col md='2' sm='12' className='mb-1'>
                    <div><h5><Eye style={{ height: '20px' }} />View</h5></div>

                    <div className='hoverUnderline' onClick={() => { setModificationLogs(true) }}>Changes Log</div>
                    <div className='hoverUnderline'>Invoice</div>
                    <div className='hoverUnderline'>Payment instructions</div>
                    <div className='hoverUnderline'>Communication</div>
                    <div className='hoverUnderline' onClick={() => { setfutureStays(true) }}>Future & Past Stays</div>
                    <div className='hoverUnderline' onClick={() => { setpreferenceData(true) }}>Preferences</div>
                    <div className="hoverUnderline" onClick={() => { setViewDailyDetails(true) }}>
                      Daily Details
                    </div>
                  </Col>
                  <Col md='2' sm='12' className='mb-1'>
                    <div><h5><ArrowRightCircle style={{ height: '20px' }} />Go To</h5></div>

                    <div onClick={() => setProfileView(!profileView)} className="hoverUnderline">Profile</div>
                    <div onClick={() => setReservation(!reservationDetails)} className="hoverUnderline">Reservation</div>
                    <div onClick={() => setAlerts(!alerts)} className="hoverUnderline">
                      Alerts</div>
                  </Col>
                  <Col md='2' sm='12' className='mb-1'>
                    <div><h5><File style={{ height: '20px' }} />Documents</h5></div>
                    <div
                      onClick={() => setConfirmationCard(!confirmationCard)}
                      className="hoverUnderline"
                    >
                      Confirmation Letter
                    </div>
                    <div className='hoverUnderline'>Proforma Folio</div>
                    {/* <h5>Attachments</h5> */}
                    <div className="hoverUnderline" onClick={() => { setStayNotification(!stayNotification) }}>
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
                        Membership Expiry:<b> {details['membershipexpiry']}     </b>
                        Number of Nights :<b> {details['numOfNights']}</b><br></br>
                        Number of Stay :<b> {details['numOfStay']}</b><br></br>
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
              Need To Check..
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

    </div>
  );
}

export default StayOver;
