// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// import './Assettable.css';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
// import { Button, Modal, ModalBody, ModalHeader} from 'reactstrap';
import { Button, Modal, ModalBody, ModalHeader, Card, Form, Label, CardBody, CardTitle, CardHeader, Row, Col, Input, DropdownMenu } from 'reactstrap';
import { Check, Circle, Edit2, PlusCircle, Eye, ArrowRightCircle, AlertTriangle, File } from "react-feather";

import { format } from "date-fns";
import AssignRoom from './assignRoom';
import RoomMove from './roomMove';
// import ForCheckInIdDetails from './forCheckInIdDetails'
import CancelCheckIn from './cancelCheckIn';
import UnAssignRoom from './unAssign';
import API_URL from '../../../config';
import CheckIn from './check-in';
import AddSharer from "./addSharer";
import ModifyReservation from "./modifyReservation";
import RegistrationCard from "./registrationCard";
import PreviewActionsRegCard from "./PreviewActionsRegCard";
import Confirmation from "./confirmationCard";
import PreviewActions from "./PreviewActions";
import PreviewActionsProforma from "./previewActionsProForma";
import PreviewActionsPayment from "./PreviewActionsPayment";
import PreviewActionsReceipt from "./previewActionsReceipt";
import VisaDetails from './visaDetails'
import Reservation from './reservation'
import ProfileViews from './profileView'
import CancelReservation from './cancelReservation'
import ERegistrationCard from "./esignregistrationCard";
import PreviewActionsERegCard from "./PreviewERegCard";
import Alerts from "./alerts";
import Moment from 'moment'
import Attachments from './attachments'
import ModificationLogs from "../modificationLog";
import DailyDetailsView from "./dailyDetailsView";
import GuestPreferences from "./prefrence";
import PastStays from "./futurepaststay";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
let is_test = false

localStorage.removeItem('reservationStart');
localStorage.removeItem('reservationEnd');




function Today() {
  const [rowData, setRowData] = useState();
  const [form, setSharer] = useState();
  const [checkIn, setCheckIn] = useState();
  const [stayNotification, setStayNotification] = useState();
  const [show, setShow] = useState();
  const [assign, setAssign] = useState(false)
  const [details, setDetails] = useState()
  const [filldata, setfilldata] = useState('');
  const [componentRendered, setComponentRendered] = useState(false);
  const [roomMove, setRoomMove] = useState();
  const [options, setOptions] = useState();
  const [unAssign, setUnAssign] = useState()
  const [viewDailyDetails, setViewDailyDetails] = useState(false)
  const [modificationLogs, setModificationLogs] = useState(false)
  const [cancelCheckIn, setCancelCheckIn] = useState();
  const [popUp, setPopUp] = useState();
  const [addSharer, setAddSharer] = useState(false);
  const [modifyRegistration, setModifyRegistration] = useState();
  const [registrationCard, setRegistrationCard] = useState();
  const [confirmationCard, setConfirmationCard] = useState();
  const [proFormaFolio, setProFormaFolio] = useState();
  const [paymentCard, setPaymentCard] = useState();
  const [receipt, setReceipt] = useState();
  const [visaDetails, setVisaDetails] = useState();
  const [profileView, setProfileView] = useState();
  const [reservationDetails, setReservation] = useState();
  const [cancelReservation, setCancelReservation] = useState(false)
  const [eregistrationCard, setERegistrationCard] = useState();
  const [alerts, setAlerts] = useState();
  const [Today, setToday] = useState()
  const [pytDetails, setPytDetails] = useState();
  const [InvURL, setInvURL] = useState('')
  const [ShowInvPDF, setShowInvPDF] = useState(false)
  const [futureStays, setfutureStays] = useState();
  const [preferenceData, setpreferenceData] = useState();


  // function handleAlert(message) {
  //   Swal.fire({
  //     title: message,
  //     text: "Reservation checkin alert!",
  //     icon: "warning",
  //     showCancelButton: false,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Okay"
  //   })
  // }



  function CallAlerts(filldata) {

    Promise.all([
      fetch(API_URL + `/getCheckInAlerts?reservationID=${filldata.id}`)
        .then((result) => result.json())
        .then((resp) => {
          console.log(resp['data']);
          if (resp['data'].length !== 0) {
            const checkInAlertValue = resp['data'][0]['checkInAlert'];
            return checkInAlertValue; // Return the value for logging later

          }
          return null; // Return null if no alert

        }),

      fetchx(API_URL + "/getReservationAlerts?reservationID=" + filldata['id'])
        .then((result) => result.json())
        .then((resp) => {
          console.log(resp['data']);
          if (resp['data'].length !== 0) {
            const reservationAlertValue = resp['data'][0]['reservationAlert'];
            return reservationAlertValue; // Return the value for logging later

          }
          return null; // Return null if no alert

        })
    ]).then(([checkInAlertValue, reservationAlertValue]) => {
      // Call the alerts function after both fetches have completed
      callingAlerts(checkInAlertValue, reservationAlertValue);
    });
  }


  const BookingIdRenderer = (params) => {
    return (
      // <div style={{ display: 'flex', alignItems: 'start', gap: '4px' }}>
      <div style={{ alignItems: 'start' }}>
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
              marginRight: '10px'

            }}>
              OX
            </span>
            <span>{params.value}</span>
          </>

        ) : <span>{params.value}</span>}
      </div>
    );
  };


  function callingAlerts(checkInAlertValue, reservationAlertValue) {


    if (checkInAlertValue && reservationAlertValue) {
      // Both alerts are available
      Swal.fire({
        title: '',
        html: `
      <div style="padding: 10px;">
  <div style="margin-bottom: 10px; min-width: 200px; max-width: 300px; border: 1px solid #d3d3d3; border-radius: 8px; padding: 10px; background-color: #f9f9f9;">
    <h3 style="color: #ff9800;">Check-in Alert</h3>
    <p style="font-size: 16px;">${checkInAlertValue}</p>
  </div>
  <div style="min-width: 200px; max-width: 300px; border: 1px solid #d3d3d3; border-radius: 8px; padding: 10px; background-color: #f9f9f9;">
    <h3 style="color: #f44336;">Reservation Alert</h3>
    <p style="font-size: 16px;">${reservationAlertValue}</p>
  </div>
</div>
          `,

        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Okay',
        paddingTop: '10px',
        position: 'center',
        customClass: {
          popup: 'alert-popup',
        },
        width: 'auto', // Set width to auto to adjust based on content
        padding: '20', // Optional: Remove default padding for the modal
      })
    } else if (checkInAlertValue) {
      // Show only check-in alert
      Swal.fire({
        title: "Check-in Alert",
        text: checkInAlertValue,
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Okay",
        position: "center",
      })
    } else if (reservationAlertValue) {
      // Show only reservation alert
      Swal.fire({
        title: "Reservation Alert",
        text: reservationAlertValue,
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Okay",
        position: "center",
      })
    }
  }


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



  const [isModalOpen, setIsModalOpen] = useState(false);

  function toggleModal(data) {
    if (data === 'assigned') {

      setAssign(false)
      setOptions(false)
    }
    if (data === 'unassign') {
      setUnAssign(false)
      setOptions(false)

    }
    if (data === 'assignedDuringCheckIn') {
      setAssign(false)
    }
    setERegistrationCard(false);
    setRegistrationCard(false)
    fetchx(API_URL + '/getReservationForFrontDeskToday?Start=' + Today)
      .then(result => result.json())
      .then((newData) => {
        setRowData(newData["data"]);
        // Merge previous filldata with new data based on their IDs
        if (filldata !== null) {
          const updatedData = newData.data.find(item => item.id === filldata.id);
          if (updatedData) {
            // Update filldata by merging previous and new data
            setfilldata((prevFillData) => ({ ...prevFillData, ...updatedData }));
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching data from API:", error);
      });
  }

  const gridRef = useRef();


  const getRowStyle = params => {
    if (params.data && params.data.doNotMove === 1) {
      return { background: '#CD5354' };
    }
    else if (params.data && params.data.subBookingID !== null && params.data.subBookingID !== '0') {
      return { background: '#f1c40f' };
    }
    return null;
  };


  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "B_ID",
      field: "bookingID",
      valueGetter: (params) => {
        if (params.data && params.data.bookingID && params.data.isMain === 0) {
          return `${params.data.bookingID}*`;
        }
        return params.data.bookingID;
      },
      cellRenderer: (params) => {
        if (!params.data) return null;

        return (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <>
              <span>{params.data.bookingID}</span>
              {params.data.isWebCheckIn === 1 && (
                <img
                  src="/src/assets/images/icons/webCheckin.png"
                  alt="secondary"
                  style={{ width: "40px", height: "25px" }}
                />
              )}
            </>
          </div>
        );
      },

      suppressSizeToFit: true,
      maxWidth: 140,
      filter: 'agTextColumnFilter'
    },
    {
      headerName: "Guest",
      field: "guestName",
      suppressSizeToFit: true,
      style: { marginLeft: '-2px' },
      maxWidth: 150,
      cellRenderer: BookingIdRenderer
    },
    {
      headerName: "Comp/Agent",
      field: "accountName",
      suppressSizeToFit: true,
      maxWidth: 132,
    },
    {
      headerName: "Arrival",
      field: "arrivalDate",
      suppressSizeToFit: true,
      maxWidth: 120,
      cellRenderer: (params) => {
        if (params.data && params.data.arrivalDate) {
          const formattedDate = format(new Date(params.data.arrivalDate), 'dd MMM yy');
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    {
      headerName: "Departure",
      field: "departureDate",
      suppressSizeToFit: true,
      maxWidth: 120,
      cellRenderer: (params) => {
        if (params.data && params.data.departureDate) {
          const formattedDate = format(new Date(params.data.departureDate), 'dd MMM yy');
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    {
      headerName: 'Room No.', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 120, cellStyle: params => {
        let borderColor = 'transparent'; // Default color for the border

        if (params.data.roomStatus === "Inspected") {
          borderColor = '#28C76F'; // Blue color
        } else if (params.data.roomStatus === 'Dirty') {
          borderColor = '#E34E4E'; // Red color
        } else if (params.data.roomStatus === 'Clean') {
          borderColor = '#3C5EFC'; // Yellow color
        } else if (params.data.roomStatus === 'Occupied') {
          borderColor = '#3C5EFC'; // Yellow color
        } else if (params.data.roomStatus === 'Out Of Order') {
          borderColor = '#82868b'; // Yellow color
        } else if (params.data.roomStatus === 'Out Of Service') {
          borderColor = '#D0AD0F'; // Yellow color
        }

        return {
          backgroundColor: borderColor,
          // borderLeft: `5px solid ${borderColor}`,
          // paddingLeft: '10px', // Add some left padding to separate content from border
        };
      },

    },

    {
      headerName: "Status",
      field: "reservationStatus",
      suppressSizeToFit: true,
      minWidth: 110,
    
    },


    {
      headerName: "Actions",
      cellRendererFramework: (params) => (
        <Button
          color="primary"
          style={{ width: 100 }}
          onClick={async () => {
            try {
              // Fetch data based on reservationID
              const reservationID = params.data.id;
              const response = await fetch(API_URL + `/getReservationForFrontDeskByResID?reservationID=${reservationID}`);
              const rowData = await response.json();

              // Update state with fetched data

              setfilldata(rowData.data[0]);

              // Toggle options after data is fetched
              setOptions(!options);
              CallAlerts(rowData.data[0])
              // Store reservation ID in sessionStorage
              sessionStorage.setItem('reser_ID', reservationID);
            } catch (error) {
              console.error("Error fetching reservation data:", error);
            }
          }}
        >
          Actions
        </Button>
      ),
      suppressSizeToFit: true,
      cellStyle: { textAlign: 'center' },
      cellClass: 'vertical-center',
      maxWidth: 120
    },
    {
      headerName: "R_Type/No.Rms",
      field: "roomTypeRooms",
      valueGetter: (params) => {
        const roomType = params.data.roomType ? params.data.roomType : '';
        const numberOfRooms = params.data.numberOfRooms ? params.data.numberOfRooms : '';
        return `${roomType} - ${numberOfRooms}`;
      },
      suppressSizeToFit: true,
      maxWidth: 152,
    },
    {
      headerName: "SubID",
      field: "subBookingID",
      suppressSizeToFit: true,
      maxWidth: 90,
    },
    {
      headerName: "Grp ID",
      field: "blockCodeID",
      suppressSizeToFit: true,
      maxWidth: 94,
    },
    // {
    //   headerName: "Rooms",
    //   field: "numberOfRooms",
    //   suppressSizeToFit: true,
    //   maxWidth: 96,
    // },
    {
      headerName: "Market",
      field: "marketCode",
      suppressSizeToFit: true,
      maxWidth: 110,
    },
    {
      headerName: "Source",
      field: "sourceCode",
      suppressSizeToFit: true,
      maxWidth: 110,
    },
    {
      headerName: "Created By",
      field: "createdByName",
      suppressSizeToFit: true,
      maxWidth: 132,
    },
    {
      headerName: "Created At",
      field: "createdAt",
      suppressSizeToFit: true,
      maxWidth: 170,
    },
  ]);


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
    // setfilldata(event['data'])
    // fetch(API_URL + `/getCheckInAlerts?reservationID=${event['data'].id}`)
    //   .then((result) => result.json())
    //   .then((resp) => {
    //     console.log(resp['data']);
    //     handleAlert(resp['data'][0]['checkInAlert'])
    //     // setResAlert(resp['data'][0]['checkInAlert']);
    //   });
    localStorage.setItem('reservationStart', event['data']['arrivalDate']);
    localStorage.setItem('reservationEnd', event['data']['departureDate']);
    localStorage.setItem('reservationRoomType', event['data']['roomType']);

  }, []);
  //console.log(filldata)

  //console.log(localStorage.getItem('reservationStart'));
  //console.log(localStorage.getItem('reservationEnd'));
  useEffect(() => {

    fetchx(API_URL + '/getReservationForFrontDeskToday?Start=' + Today)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
        //console.log(rowData)

      })

  }, [Today !== undefined]);

  const [resAlert, setResAlert] = useState(null);
  const [disResAlert, setdisResAlert] = useState(false);

  // useEffect(() => {
  //   if (disResAlert) {
  //     //console.log(filldata.id)
  //     fetchx(API_URL + `/getCheckInAlerts?reservationID=${filldata.id}`)
  //       .then((result) => result.json())
  //       .then((resp) => {
  //         //console.log(resp['data']);
  //         setResAlert(resp['data'][0]['checkInAlert']);
  //       });
  //   }
  // }, [disResAlert , filldata]); 
  // //console.log(resAlert);
  // if (resAlert ){
  //   //console.log(resAlert);
  // } else {
  //   //console.log("No Alert ");
  // }



  // Function to handle modal close
  const handleModalClose = () => {
    setResAlert(null);
    setdisResAlert(false);
  };




  const buttonListener = useCallback(e => {
    gridRef.current.api.deselectAll();
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box2').value
    );
  }, []);



  const GetproformaInv = () => {
    fetchx(API_URL + `/getProFormaInv?reservationID=${sessionStorage.getItem('reser_ID')}`)
      .then(result => result.json())
      .then(resp => {
        let reason = resp['data']
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
    <div>
      {/* <button onClick={buttonListener}>Push Me</button> */}
      <div>
        <Col md='3' sm='12' className='mb-1'>
          <Label className='form-label' for='fullName'>
            Search
          </Label>
          <Input
            type="text"
            id="filter-text-box2"
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
          onCellClicked={cellClickedListener}
          getRowStyle={getRowStyle}
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
              {filldata.length != 0 && <AssignRoom data1={filldata} toggleModal={toggleModal} assignUnassign={false} />}
            </div>
          </ModalBody>
        </Modal>
      </div>

      <div>
        <Modal isOpen={checkIn} toggle={() => setCheckIn(!checkIn)} className='demo-inline-spacing'>
          <ModalHeader className='bg-transparent' toggle={() => setCheckIn(!checkIn)}></ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <div>
              {filldata.length != 0 && <CheckIn data1={filldata} toggleModal={toggleModal} />}
            </div>
          </ModalBody>
        </Modal>
      </div>





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
          isOpen={visaDetails}
          toggle={() => setVisaDetails(!visaDetails)}
          className="modal-xl"
        >
          <ModalHeader
            className="bg-transparent"
            toggle={() => setVisaDetails(!visaDetails)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              <VisaDetails data1={filldata} />
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
    <Modal isOpen={checkIn} toggle={() => setCheckIn(!checkIn)} className='modal-lg'>
        <ModalHeader className='modal-lg' toggle={() => setCheckIn(!checkIn)}></ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>
          <div>
          {filldata.length!=0 && <ForCheckInIdDetails data1={filldata}  />}
          </div>
        </ModalBody>
      </Modal>
      </div> */}
      <div>
        <Modal isOpen={roomMove} toggle={() => setRoomMove(!roomMove)} className='demo-inline-spacing'>
          <ModalHeader className='bg-transparent' toggle={() => setRoomMove(!roomMove)}></ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <div>
              {filldata.length != 0 && <RoomMove data1={filldata} />}
            </div>
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal isOpen={unAssign} toggle={() => setUnAssign(!unAssign)} className='demo-inline-spacing'>
          <ModalHeader className='bg-transparent' toggle={() => setUnAssign(!unAssign)}></ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <div>
              {filldata.length != 0 && <UnAssignRoom data1={filldata} toggleModal={toggleModal} />}
            </div>
          </ModalBody>
        </Modal>
      </div>
      <div>
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
        <Modal isOpen={cancelReservation} toggle={() => setCancelReservation(!cancelReservation)} className='modal-xl'>
          <ModalHeader className='bg-transparent' toggle={() => setCancelReservation(!cancelReservation)}></ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <div>
              {filldata.length != 0 && <CancelReservation data1={filldata} />}
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
        <Modal isOpen={options} toggle={() => setOptions(!options)} className='modal-xl' >
          <ModalHeader className='modal-lg' toggle={() => { setOptions(!options) }}>I Want To..</ModalHeader>
          <ModalBody className='pb-3 px-sm-2 mx-20'>
            <div >
              <Card style={{ backgroundColor: '#F2E5D9' }}>
                <Row className='cardBody'>

                  <Col md='2' sm='12' className='mb-1'>
                    <div><h5><Edit2 style={{ height: '20px' }} />Modify/Update</h5></div>
                    <div>
                      <div className='hoverUnderline' onClick={() => {
                        setAssign(!assign)
                        localStorage.removeItem('id')
                      }}>Assign Room</div>


                      <div onClick={() => {

                        if (filldata.room === null) {
                          setPopUp(
                            "Assign the room to check In"
                          );
                        } else {
                          setdisResAlert(!disResAlert);
                          setCheckIn(!checkIn)
                        }
                      }} className='hoverUnderline'>Begin CheckIn
                      </div>



                      {/* <div className='hoverUnderline' onClick={() => setCancelCheckIn(!cancelCheckIn)}>Cancel CheckIn</div> */}
                      {filldata.isMain != 0 && <div className='hoverUnderline' onClick={() => {
                        if (filldata.room === null) {
                          setPopUp(
                            "Assign the room first"
                          );
                        } else {
                          setUnAssign(!unAssign)
                        }
                      }}>Un-Assign Room</div>}
                      {filldata && filldata.isMain === 1 &&
                        <div className="hoverUnderline"
                          onClick={() => {
                            if (filldata.numberOfRooms > 1) {
                              setPopUp(
                                "You have selected more then 1 room need to split the reservation"
                              );
                            } else if (Today !== undefined && (
                              filldata.arrivalDate < Today &&
                              filldata.departureDate < Today)
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
                        </div>}
                      <div
                        onClick={() =>
                          setModifyRegistration(!modifyRegistration)
                        }
                        className="hoverUnderline"
                      >
                        Modify Reservation
                      </div>
                      {filldata.isMain != 0 && <div className='hoverUnderline' onClick={() => setCancelReservation(!cancelReservation)}>Cancel Reservation <br></br> / No Show</div>}
                      {/* <div
                        className="hoverUnderline">
                        Re-Instate Reservation
                      </div>
                      <div
                        className="hoverUnderline">
                          Re-Instate Check Out
                        </div> */}
                      {/* <div
                        className="hoverUnderline">
                          No Show
                        </div> */}
                    </div>
                  </Col>

                  <Col md='2' sm='12' className='mb-1'>
                    <div><h5><PlusCircle style={{ height: '20px' }} />Create</h5></div>

                    <div className='hoverUnderline'>Copy Reservation</div>
                    <div onClick={() => setERegistrationCard(!eregistrationCard)} className='hoverUnderline'>e-Sign Registration Card</div>
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
                    <div className="hoverUnderline" onClick={() => setAlerts(!alerts)}> Alerts</div>
                  </Col>

                  <Col md='2' sm='12' className='mb-1'>
                    <div><h5><File style={{ height: '20px' }} />Documents</h5></div>
                    <div
                      onClick={() => setConfirmationCard(!confirmationCard)}
                      className="hoverUnderline"
                    >
                      Confirmation Letter
                    </div>
                    <div onClick={() => { GetproformaInv() }} className='hoverUnderline'>Proforma Invoice</div>

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


      {/* Proforma folio */}
      <Modal isOpen={ShowInvPDF} toggle={() => setShowInvPDF(!ShowInvPDF)} style={{ height: '200px' }} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowInvPDF(!ShowInvPDF)}>Proforma Invoice</ModalHeader>

        <iframe style={{ height: '85vh' }} src={InvURL}> </iframe>
      </Modal>

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

export default Today;
