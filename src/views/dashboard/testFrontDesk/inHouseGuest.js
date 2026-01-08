// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
let is_test = false

// import './Assettable.css';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Button, Modal, ModalBody, Card, ModalHeader, Row, Col, Label, Input, CardBody } from 'reactstrap';
import AssignRoom from './assignRoom';
import RoomMove from './roomMove';
import { Check, Circle, Edit2, PlusCircle, Eye, ArrowRightCircle, AlertTriangle, File } from "react-feather";
import CancelCheckIn from './cancelCheckIn';
import ForCheckInIdDetails from './forCheckInIdDetails'
import API_URL from '../../../config';
import toast from "react-hot-toast";
import Avatar from "@components/avatar";
import { useNavigate } from 'react-router-dom'
import AddSharer from "./addSharer";
import { format } from "date-fns";
import VisaDetails from './visaDetails'
import ERegistrationCard from "./esignregistrationCard";
import Confirmation from "./confirmationCard";
import PreviewActions from "./PreviewActions";
import RegistrationCard from "./esignregistrationCard";
import PreviewActionsRegCard from "./PreviewActionsRegCard";
import PreviewActionsERegCard from "./PreviewERegCard";
import ModifyReservation from "./modifyReservation";
import FixedCharges from "./fixedCharges"
import Reservation from './reservation'
import ProfileViews from './profileView'
import ReservationInvoice from "./ReservationInvoices";
import Alerts from "./alerts";
import Attachments from './attachments'
import Moment from 'moment';
import ModificationLogs from "../modificationLog";
import DailyDetailsView from "./dailyDetailsView";
import GuestPreferences from "./prefrence";
import PastStays from "./futurepaststay";
import WakeUpCall from "./wakeUpCall";

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'

localStorage.removeItem('reservationStart');
localStorage.removeItem('reservationEnd');
localStorage.removeItem('reservationRoomType')

function InHouseGuest() {

  const [stayNotification, setStayNotification] = useState();
  const navigate = useNavigate()
  const [rowData, setRowData] = useState();
  const [form, setSharer] = useState();
  const [checkIn, setCheckIn] = useState();
  const [viewDailyDetails, setViewDailyDetails] = useState(false)
  const [show, setShow] = useState();
  const [checkOut, setCheckOut] = useState();
  const [assign, setAssign] = useState();
  const [eregistrationCard, setERegistrationCard] = useState();
  const [filldata, setfilldata] = useState('');
  const [roomMove, setRoomMove] = useState();
  const [options, setOptions] = useState();
  const [cancelCheckIn, setCancelCheckIn] = useState();
  const [popUp, setPopUp] = useState();
  const [modificationLogs, setModificationLogs] = useState(false)
  const [addSharer, setAddSharer] = useState(false);
  const [visaDetails, setVisaDetails] = useState();
  const [confirmationCard, setConfirmationCard] = useState();
  const [registrationCard, setRegistrationCard] = useState();
  const [modifyRegistration, setModifyRegistration] = useState();
  const [ConfirmCheckOut, setConfirmCheckOut] = useState(false)
  const [showfixedcharges, setshowfixedcharges] = useState(false)
  const [profileView, setProfileView] = useState();
  const [reservationDetails, setReservation] = useState();
  const [ShowResInvoice, setShowResInvoice] = useState(false)
  const [alerts, setAlerts] = useState();
  const [Today, setToday] = useState()
  const [details, setDetails] = useState()
  const [futureStays, setfutureStays] = useState();
  const [preferenceData, setpreferenceData] = useState();
  const [pytDetails, setPytDetails] = useState();
  const [InvURL, setInvURL] = useState('')
  const [ShowInvPDF, setShowInvPDF] = useState(false)
  const [wakeUpCall, setWakeUpCall] = useState(false);
  const [roomNumberFilter, setRoomNumberFilter] = useState('');
  const [bookingIDFilter, setBookingIDFilter] = useState('');

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
        // setToday((moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
        setToday(format(today, format(today, 'E MMM dd yyyy')))
      })
  }, [Today !== undefined]);

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

  function CallAlerts(filldata) {
    console.log(filldata);

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
      // Log the actual values fetched
      console.log('Fetched Check-in Alert:', checkInAlertValue);
      console.log('Fetched Reservation Alert:', reservationAlertValue);

      // Call the alerts function after both fetches have completed
      callingAlerts(checkInAlertValue, reservationAlertValue);
    });
  }

  function callingAlerts(checkInAlertValue, reservationAlertValue) {
    console.log('Reservation Alert:', reservationAlertValue);
    console.log('Check-in Alert:', checkInAlertValue);

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
        paddingTop:'10px',
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

  const [columnDefs, setColumnDefs] = useState([

    { headerName: 'Room', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 90, filter: 'agTextColumnFilter' },
    { headerName: 'Guest', field: 'guestName', suppressSizeToFit: true, maxWidth: 180,      cellRenderer: BookingIdRenderer,  // Use the React component
    },
    { headerName: 'Comp/Agt', field: 'accountName', suppressSizeToFit: true, maxWidth: 140 },
    {
      headerName: "Arrival",
      field: "arrivalDate",
      suppressSizeToFit: true,
      maxWidth: 100,
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
      maxWidth: 120,
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
    { headerName: 'Status', field: 'reservationStatus', suppressSizeToFit: true, maxWidth: 110 },
    { headerName: 'Balance', field: 'balance', suppressSizeToFit: true, maxWidth: 110 },
    // {
    //   headerName: 'Actions', cellRendererFramework: (params) => {
    //     return (<Button color='primary' style={{ width: 128 }} onClick={() => {
    //       setOptions(!options)
    //       sessionStorage.setItem('reser_ID', params['data']['id'])
    //     }}  >Actions</Button>)
    //   },
    //   suppressSizeToFit: true,
    //   cellStyle: { textAlign: 'center' },
    //   cellClass: 'vertical-center',
    //   maxWidth: 148
    // },
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
      headerName: 'Billing', cellRendererFramework: (params) => <Button color='primary' style={{ width: 100 }} onClick={() => {
        localStorage.setItem('FolioTabNo', 0)
        setTimeout(() => { navigate('/dashboard/frontdesk/Billing') }, 600)
      }} >Billing</Button>,
      suppressSizeToFit: true,
      maxWidth: 100,
      cellStyle: { textAlign: 'center' },
      cellClass: 'vertical-center',
    },
    {
      headerName: "B_ID",
      field: "bookingID",
      valueGetter: (params) => {
        if (params.data && params.data.bookingID && params.data.isMain === 0) {
          return `${params.data.bookingID}*`;
        }
        return params.data.bookingID;
      },
      suppressSizeToFit: true,
      maxWidth: 90,
      filter: 'agTextColumnFilter'
    },
    { headerName: 'R_Type', field: 'roomType', suppressSizeToFit: true, maxWidth: 98 },
    {
      headerName: "Grp ID",
      field: "blockCodeID",
      suppressSizeToFit: true,
      maxWidth: 98,
    },
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
      maxWidth: 120,
    },
    {
      headerName: "Created At",
      field: "createdAt",
      suppressSizeToFit: true,
      maxWidth: 170,
    }
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


  const onGridReady = (params) => {
    // Save the grid API reference
    gridRef.current = params.api;
  };


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
    localStorage.setItem('reservationRoomType', event['data']['roomType'])
    localStorage.setItem('reservationOldRoomTypeID', event['data']['roomTypeID'])
    localStorage.setItem('reservationStart', event['data']['arrivalDate']);
    localStorage.setItem('reservationEnd', event['data']['departureDate']);
    localStorage.setItem('reservationID', event['data']['id'])
    sessionStorage.setItem('reservationID', event['data']['id'])
    localStorage.setItem('RoomNo', event['data']['roomNumber'])
    localStorage.setItem('departureDate', event['data']['departureDate'])
  }, []);

  useEffect(() => {
    fetchx(API_URL + '/getReservationForFrontDeskInHouseGuest')
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
        //console.log(rowData)

      })
  }, []);



  const buttonListener = useCallback(e => {
    gridRef.current.api.deselectAll();
  }, []);

  const onFilterTextBoxChanged3 = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box4').value
    );
  }, []);


  // const handleInputChange = (e) => {
  //   setRoomNumberFilter(e.target.value);
  //   if (gridRef.current) {
  //     const filterModel = gridRef.current.getFilterModel();
  //     filterModel['roomNumber'] = {
  //       filter: e.target.value,
  //       type: 'text',
  //     };
  //     gridRef.current.setFilterModel(filterModel);
  //   }
  // };

const handleInputChange = (e) => {
  const value = e.target.value.trim();
  setRoomNumberFilter(value);

  if (gridRef.current) {
    const filterModel = gridRef.current.getFilterModel();

    if (value === '') {
      // Clear filter when input is empty
      delete filterModel['roomNumber'];
    } else {
      filterModel['roomNumber'] = {
        type: 'equals', // ✅ Exact match
        filter: value,
        filterType: 'text'
      };
    }

    gridRef.current.setFilterModel(filterModel);
  }
};


  const handleInputChange2 = (e) => {
    const inputValue = e.target.value.trim(); // Trim any leading or trailing spaces
    setBookingIDFilter(inputValue);
    if (gridRef.current) {
      const filterModel = gridRef.current.getFilterModel();
      if (inputValue) {
        // If there's an input value, filter for left-to-right match
        filterModel['bookingID'] = {
          filter: inputValue,
          type: 'startsWith', // Use 'startsWith' for left-to-right match
        };
      } else {
        // If input is empty, remove the filter
        delete filterModel['bookingID'];
      }
      gridRef.current.setFilterModel(filterModel);
    }
  };

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.setQuickFilter(
      document.getElementById("filter-text-box2").value
    );
  }, []);



  const CheckoutGuest = () => {
    //console.log('CheckOut Guest')
    // //console.log(JSON.stringify({
    //   hotelID: 1,
    //   reservationID: sessionStorage.getItem('reservationID'),
    //   roomID: sessionStorage.getItem('roomID')
    // }))
    fetchx(API_URL + "/checkOutReservation", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
        reservationID: sessionStorage.getItem('reservationID'),
        roomID: sessionStorage.getItem('roomID')
      })
    }).then(result => result.json())
      .then(resp => {
        //console.log(resp)
        if (resp.statusCode == 200) {
          toast(
            <div className="d-flex">
              <div className="me-1">
                <Avatar size="sm" color="success" icon={<Check size={12} />} />
              </div>
              <div className="d-flex flex-column">
                <h6>Guest Checked Out Successfully</h6>
                {/* <h4>Wait-List Added Successfully</h4> */}
              </div>
            </div>
          );
          setTimeout(() => { navigate('/dashboard/frontdesk') }, 1000)
        } else {
          setTimeout(() => { navigate('/dashboard/frontdesk/Billing') }, 1000)
        }

        setConfirmCheckOut(!ConfirmCheckOut)

      }).catch((error) => {
        //console.log(error)
      })

    // setTimeout(()=>{navigate('/dashboard/frontdesk/BillTemplate')},2000)

  }


  const getRowStyle = params => {

    if (params.data && params.data.noPost === 1) {
      return { background: '#CD5354' };
    }
    else if (params.data && params.data.subBookingID !== null && params.data.subBookingID !== '0') {
      return { background: '#f1c40f' };
    }
    return null;
  };

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
    <div>
      {/* <button onClick={buttonListener}>Push Me</button> */}
      <div>
        <Row>
          {/* Room filter */}
          <Col md="2" sm="12" className="mb-1">
            <Label className="form-label" for="fullName">
              Room Number Filter:
            </Label>
            <Input
              type="text"
              id="roomNumberFilter"
              value={roomNumberFilter}
              onChange={handleInputChange}
              placeholder='Type room number'

            />
          </Col>

          {/* BookingID filter */}
          <Col md="2" sm="12" className="mb-1">
            <Label className="form-label" for="fullName">
              BookingID Filter:
            </Label>
            <Input
              type="text"
              id="bookingIDFilter"
              value={bookingIDFilter}
              onChange={handleInputChange2}
              placeholder='Type bookingID'
            />
          </Col>

          <Col md="2" sm="12" className="mb-1">
          <Label className="form-label" for="fullName">
            Search
          </Label>
          <Input
            type="text"
            id="filter-text-box2"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
          />
        </Col>
        </Row>
      </div>
      <div className="ag-theme-alpine" style={{ height: 520 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData} columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          getRowStyle={getRowStyle}
          onGridReady={onGridReady}
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
          <ModalHeader className='modal-xl' toggle={() => setRoomMove(!roomMove)}></ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <div>
              {filldata.length != 0 && <RoomMove data1={filldata} />}
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
                    <PreviewActionsERegCard data1={filldata} />
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
                    <ERegistrationCard data1={filldata} />
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
                {/* {filldata.length!=0 && filldata.numberOfRooms > 1 ? (setPopUp("You have selected more then 1 room need to split the reservation")) : <AddSharer data1={filldata} />} */}
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
                      {filldata && filldata.isMain === 1 && 

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
}
                      {/* <div className='hoverUnderline' onClick={() => setConfirmCheckOut(!ConfirmCheckOut)}>CheckOut</div> */}

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
                    <div
                      onClick={() => setRegistrationCard(!registrationCard)}
                      className="hoverUnderline"
                    >
                      Registration Card
                    </div>
                    <div className='hoverUnderline' onClick={() => {
                      if (filldata.departureDate != filldata.arrivalDate) {
                        setshowfixedcharges(!showfixedcharges)

                      } else {
                        setPopUp('Fixed Charges cannot be posted')
                      }
                    }}>Fixed Charges Posting</div>
                    <div
                      onClick={() => setVisaDetails(!visaDetails)}
                      className="hoverUnderline"
                    >
                      Add Visa Details
                    </div>
                    <div onClick={() => setAlerts(!alerts)} className="hoverUnderline">
                      Alerts
                    </div>
                    <div
                      onClick={() => setWakeUpCall(!wakeUpCall)}
                      className="hoverUnderline"
                    >
                      Wakeup Call
                    </div>
                  </Col>


                  <Col md='2' sm='12' className='mb-1'>
                    <div><h5><Eye style={{ height: '20px' }} />View</h5></div>

                    <div className='hoverUnderline' onClick={() => { setModificationLogs(true) }}>Changes Log</div>
                    <div className='hoverUnderline' onClick={() => { setShowResInvoice(true) }}>Invoice</div>
                    <div className='hoverUnderline'>Communication</div>
                    <div className='hoverUnderline' onClick={() => { setfutureStays(true) }}>Future & Past Stays</div>
                    <div className='hoverUnderline' onClick={() => { setpreferenceData(true) }}>Preferences</div>
                    <div className="hoverUnderline" onClick={() => { setViewDailyDetails(true) }}>
                      Daily Details
                    </div>
                  </Col>


                  <Col md='2' sm='12' className='mb-1'>
                    <div><h5><ArrowRightCircle style={{ height: '20px' }} />Go To</h5></div>
                    <div className='hoverUnderline' onClick={() => {
                      localStorage.setItem('FolioTabNo', 0)
                      setTimeout(() => { navigate('/dashboard/frontdesk/Billing') }, 600)
                    }}>Billing</div>
                    <div onClick={() => setProfileView(!profileView)} className="hoverUnderline">Profile</div>
                    <div onClick={() => setReservation(!reservationDetails)} className="hoverUnderline">Reservation</div>
                    <div className='hoverUnderline'>Payment instructions</div>
                  </Col>


                  <Col md='2' sm='12' className='mb-1'>
                    <div><h5><File style={{ height: '20px' }} />Documents</h5></div>
                    <div
                      onClick={() => setConfirmationCard(!confirmationCard)}
                      className="hoverUnderline"
                    >
                      Confirmation Letter
                    </div>
                    <div onClick={() => { GetproformaInv() }}
                      className='hoverUnderline'>Proforma Invoice</div>

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

              {/* <Row className='cardBody'>
                <Col md='6' sm='12' className='mb-1'>
                  <h5>Reservation</h5>

                  <h5>Notifications</h5>
                  <div onClick={() => setAlerts(!alerts)} className="hoverUnderline">
                    <AlertTriangle style={{ height: "20px" }} />
                    <b>Alerts</b>
                  </div>
                  
                    <div
  onClick={() => setWakeUpCall(!wakeUpCall)}
  className="hoverUnderline"
  >
   Wakeup Call 
  </div>
                  <h5>Attachments</h5>
                  <div className="hoverUnderline" onClick={() => { setStayNotification(!stayNotification) }}>
                    <File style={{ height: "20px" }} />
                    <b>File</b>
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
                <Col md='6' sm='12' className='mb-1'>
                  <h5>Billing</h5>
                  <div className='hoverUnderline'><b>Deposit Cancellation</b></div>
                  <div className='hoverUnderline'><b>Payment instructions</b></div>
                  <div className='hoverUnderline' onClick={() => { setshowfixedcharges(!showfixedcharges) }}><b>Fixed Charges Posting</b></div>

                  <br></br>
                  <h5>Profile</h5>
                  <div className='hoverUnderline'><b>Communication</b></div>
                  <div className='hoverUnderline'><b>Future & Past Stays</b></div>
                  <div className='hoverUnderline'><b>Preferences</b></div>

                </Col>
              </Row> */}


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

      {/* COnfirm Checkout modal */}
      <Modal
        isOpen={ConfirmCheckOut}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h4 className='text-center mb-1'>Do you want to checkOut the guest?</h4>
          <p className='text-center mb-1' style={{ color: '#FF0000' }}>Alert : Empty folios will be closed</p>
          <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' onClick={CheckoutGuest}>
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


      <div>
        <Modal
          isOpen={wakeUpCall}
          toggle={() => setWakeUpCall(!wakeUpCall)}
          className="modal-xl"
        >
          <ModalHeader
            className="bg-transparent"
            toggle={() => setWakeUpCall(!wakeUpCall)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              <WakeUpCall data1={filldata} />
            </div>
          </ModalBody>
        </Modal>
      </div>

      <Modal isOpen={showfixedcharges} toggle={() => setshowfixedcharges(!showfixedcharges)} className='modal-lg' >
        <ModalHeader className='modal-lg' toggle={() => { setshowfixedcharges(!showfixedcharges) }}></ModalHeader>
        <ModalBody className='pb-3 px-sm-2 mx-20'>
          <div >
            <FixedCharges />
          </div>
        </ModalBody>
      </Modal>
      {/* {Nayana} */}

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

export default InHouseGuest;

