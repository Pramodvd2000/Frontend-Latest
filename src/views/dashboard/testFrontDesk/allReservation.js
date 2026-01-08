// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { format } from "date-fns";

// import './Assettable.css';
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Card,
  Form,
  Label,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  CardBody,
  CardTitle,
  CardHeader,
  Row,
  Col,
  Input,
  DropdownMenu,
  ModalFooter,
  DropdownItem, DropdownToggle,
  UncontrolledButtonDropdown
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import {
  Check,
  Circle,
  Edit2,
  PlusCircle,
  Eye,
  ArrowRightCircle,
  AlertTriangle,
  File,
} from "react-feather";
import AddSharer from "./addSharer";
// import ChangeRoomlastForm from './ChangeRoomformlast';
import { selectThemeColors } from "@utils";
import "./frontDesk.scss";
import { useNavigate } from "react-router-dom";
import "./frontDesk.scss";
import AssignRoom from "./assignRoom";
import CheckIn from "./check-in";
import RoomMove from "./roomMove";
import CheckOut from "./checkOut";
import CancelCheckIn from "./cancelCheckIn";
import UnAssignRoom from "./unAssign";
import RegistrationCard from "./registrationCard";
import Confirmation from "./confirmationCard";
import ProformaFolio from "./prof";
import PreviewActions from "./PreviewActions";
import PreviewActionsRegCard from "./PreviewActionsRegCard";
import PreviewActionsProforma from "./previewActionsProForma";
import PreviewActionsPayment from "./PreviewActionsPayment";
import PreviewActionsReceipt from "./previewActionsReceipt";
import Receipt from "./receipt";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import VisaDetails from './visaDetails'
import Reservation from './reservation'
const MySwal = withReactContent(Swal);
import CancelReservation from './cancelReservation'
import ProfileViews from './profileView'
import ModifyReservation from "./modifyReservation";
import ReinstateCheckOut from "./ReinstateCheckOut";
import DepositPosting from "./DepositPosting";
import ERegistrationCard from "./esignregistrationCard";
import PreviewActionsERegCard from "./PreviewERegCard";
import Attachments from './attachments'
import Alerts from "./alerts";
import Moment from "moment";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import History from '../reservation/guestHistory'

import ReservationInvoice from "./ReservationInvoices";
import "./A4style.scss";
import API_URL from "../../../config";
import ModificationLogs from "../modificationLog";
import DailyDetailsView from "./dailyDetailsView";
import GuestPreferences from "./prefrence";
import PastStays from "./futurepaststay";
import Flatpickr from "react-flatpickr";
import FixedCharges from "./fixedCharges"
import { Star } from "react-feather";

let is_test = false

// Defaults for reason
const defaultValues = {
  reason: null,
  remarks: ''
};

// Re-instate reason dropdown function
let reason = [
  fetchx(API_URL + '/getReasonByID?reasonGroupID=10')
    .then(result => result.json())
    .then(resp => {
      reason = resp['data']
    })
]


localStorage.removeItem("reservationStart");
localStorage.removeItem("reservationEnd");



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




function AllReservation(props) {
  const [pytDetails, setPytDetails] = useState();
  const [stayNotification, setStayNotification] = useState();
  const [room, setRoomID] = useState([])
  const [floor, setFloor] = useState([])
  const [rowData, setRowData] = useState();
  const [rowData2, setRowData2] = useState();
  const [checkIn, setCheckIn] = useState();
  const [options, setOptions] = useState();
  const [assign, setAssign] = useState(false);
  const [unAssign, setUnAssign] = useState();
  const [cancelCheckIn, setCancelCheckIn] = useState();
  const [modificationLogs, setModificationLogs] = useState(false)
  const [modifyRegistration, setModifyRegistration] = useState();
  const [registrationCard, setRegistrationCard] = useState();
  const [confirmationCard, setConfirmationCard] = useState();
  const [proFormaFolio, setProFormaFolio] = useState();
  const [paymentCard, setPaymentCard] = useState();
  const [receipt, setReceipt] = useState();
  const [filldata, setfilldata] = useState("");
  const [viewDailyDetails, setViewDailyDetails] = useState(false)
  const [basicModal, setBasicModal] = useState(false);
  const [roomMove, setRoomMove] = useState();
  const [checkOut, setCheckOut] = useState();
  const [popUp, setPopUp] = useState();
  const [addSharer, setAddSharer] = useState(false);
  const [reservationDetails, setReservation] = useState();
  const [cancelReservation, setCancelReservation] = useState(false)
  const [profileView, setProfileView] = useState();
  const [visaDetails, setVisaDetails] = useState();
  const [ShowReinstateCheckout, setShowReinstateCheckout] = useState(false)
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [ShowDepositPost, setShowDepositPost] = useState(false)
  const [eregistrationCard, setERegistrationCard] = useState();
  const [resAlert, setResAlert] = useState(null);
  const [disResAlert, setdisResAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
  const [Today, setToday] = useState()
  const [ShowResInvoice, setShowResInvoice] = useState(false)
  const [InvURL, setInvURL] = useState('')
  const [ShowInvPDF, setShowInvPDF] = useState(false)
  const [futureStays, setfutureStays] = useState();
  const [preferenceData, setpreferenceData] = useState();
  const [alerts, setAlerts] = useState();
  const [roomNumberFilter, setRoomNumberFilter] = useState('');
  const [bookingIDFilter, setBookingIDFilter] = useState('');
  const [isUpdateWithRatesButton, setIsUpdateWithRatesButton] = useState(false);
  const [showfixedcharges, setshowfixedcharges] = useState(false)
  const [guestHistory, setOpenGuestHistory] = useState();

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


  // Re-instate modal setter
  const [reInstateModal, setReInstateModal] = useState(false);



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



  let navigate = useNavigate();


  useEffect(() => {
    fetchx(API_URL + "/getroomnumberfromroommanagement")
      .then((result) => result.json())
      .then((resp) => {
        // console.log(resp['data'])
        setRoomID(resp["data"])
        // console.log(room)
      })
    fetchx(API_URL + "/getRoomFloorID?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        // console.log(resp['data'])
        setFloor(resp["data"])
        // console.log(floor)
      })
    // fetchx(API_URL + "/getReservationAlerts?reservationID=597")
    //   .then((result) => result.json())
    //   .then((resp) => {
    //     //console.log(resp['data'])
    //     setFloor(resp["data"])
    //     // console.log(floor)
    //   })

  }, []);
  const [data, setData] = useState(null);

  // ** Hooks
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
    watch
  } = useForm({ defaultValues });

  // var Today = format(new Date(), "yyyy-MM-dd");

  const gridRef = useRef();
  const gridColumnApiRef = useRef(null); // Optional: in case you need column API too

  const [details, setDetails] = useState()

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
      suppressSizeToFit: true,
      maxWidth: 140,
      filter: 'agTextColumnFilter',
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
    },
    // {
    //   headerName: "B_ID",
    //   field: "bookingID",
    //   valueGetter: (params) => params.data?.bookingID || '',
    //   cellRenderer: BookingIdRenderer,  // Use the React component
    //   suppressSizeToFit: true,
    //   width: 150,
    //   filter: 'agTextColumnFilter'
    // },
    {
      cellRenderer: BookingIdRenderer,  // Use the React component
      headerName: "Guest",
      field: "guestName",
      suppressSizeToFit: true,
      style: { marginLeft: '-2px' },
      maxWidth: 150
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
    // {
    //   headerName: "R_Type",
    //   field: "roomType",
    //   suppressSizeToFit: true,
    //   maxWidth: 98,
    // },
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
      headerName: "Status",
      field: "reservationStatus",
      suppressSizeToFit: true,
      maxWidth: 120,
    },
    // {
    //   headerName: "Actions",
    //   cellRendererFramework: (params) => (
    //     <Button
    //       color="primary"
    //       style={{ width: 100 }}
    //       onClick={() => {
    //         setOptions(!options);
    //         sessionStorage.setItem('reser_ID', params['data']['id']);
    //       }}
    //     >
    //       Actions
    //     </Button>
    //   ),
    //   suppressSizeToFit: true,
    //   cellStyle: { textAlign: 'center' },
    //   cellClass: 'vertical-center',
    //   maxWidth: 120
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
      headerName: "Bill",
      cellRendererFramework: (params) => (
        <Button
          color='primary'
          style={{ width: 100 }}
          onClick={() => {
            localStorage.setItem('FolioTabNo', 0);
            setTimeout(() => {
              navigate('/dashboard/frontdesk/Billing');
            }, 1000);
          }}
        >
          Billing
        </Button>
      ),
      suppressSizeToFit: true,
      maxWidth: 120,
      cellStyle: { textAlign: 'center' },
      cellClass: 'vertical-center',
    },
    {
      headerName: "Mod Logs",
      cellRendererFramework: (params) => (
        <Button
          color="primary"
          style={{ width: 80 }}
          onClick={() => {
            setfilldata(params.data);
            setModificationLogs(true)
          }}
        >
          Logs
        </Button>
      ),
      suppressSizeToFit: true,
      cellStyle: { textAlign: 'center' },
      cellClass: 'vertical-center',
      maxWidth: 148
    },
    {
      headerName: "SubID",
      field: "subBookingID",
      suppressSizeToFit: true,
      maxWidth: 90,
    },
    {
      headerName: "Room",
      field: "roomNumber",
      suppressSizeToFit: true,
      maxWidth: 90,
      filter: 'agTextColumnFilter'
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
      headerName: "ID/ShID",
      field: "idSharingID",
      valueGetter: (params) => {
        const id = params.data.id ? params.data.id : '';
        const sharingID = params.data.sharingID ? params.data.sharingID : '';
        return `${id}/${sharingID}`;
      },
      suppressSizeToFit: true,
      maxWidth: 122,
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

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    autoHeight: true,
    wrapText: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));


  const onGridReady = (params) => {
    // Save the grid API reference
    gridRef.current = params.api;
    gridColumnApiRef.current = params.columnApi;

  };


  const handleReset = () => {
    reset({
      subBookingId: "",
      guestName: "",
      assignedRoomType: "",
      floor: "",
      room: "",
      comments: "",
    });
  };

  const modalClose = () => {
    setReInstateModal(false)
    setBasicModal(false);
  };


  // error handling for same guest addition
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


  const handleInputChange = (e) => {
    setRoomNumberFilter(e.target.value);
    if (gridRef.current) {
      const filterModel = gridRef.current.getFilterModel();
      filterModel['roomNumber'] = {
        filter: e.target.value,
        type: 'text',
      };
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



  const cellClickedListener = useCallback((event) => {

    fetchx(API_URL + `/getMainReservationDetails?sharingID=${event["data"]['sharingID']}`)
      .then(result => result.json())
      .then(rowData2 => {
        setRowData2(rowData2['data'])
      })

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


    // setfilldata(event["data"]);
    localStorage.setItem("data1", JSON.stringify(event["data"]));
    localStorage.setItem("reservationStart", event["data"]["arrivalDate"]);
    localStorage.setItem("reservationEnd", event["data"]["departureDate"]);
    localStorage.setItem("reservationRoomType", event["data"]["roomType"]);
    localStorage.setItem("SubBookingId", event["data"]["SubBookingId"]);
    localStorage.setItem("reservationGuest", event["data"]["End"]);
    localStorage.setItem("reservationID", event["data"]["id"]);
    sessionStorage.setItem("reservationID", event["data"]["id"]);
  }, []);


  // Success modal for split reservation
  const handleSuccess = () => {
    return MySwal.fire(
      {
        title: "Split Reservation",
        text: "Successfully Split the reservation !!",
        icon: "success",
      },
      setBasicModal(false),
      setTimeout(() => {
        navigate("/dashboard/frontdesk");
      }, 1000)
    );
  };


  // Success modal for re-instate reservation
  const handleSuccessForReinstate = () => {
    return MySwal.fire(
      {
        title: "Re-Instate Reservation",
        text: "Successfully re-instated the reservation !!",
        icon: "success",
      },
      setBasicModal(false),
      setTimeout(() => {
        navigate("/dashboard/frontdesk");
      }, 1000)
    );
  };


  //Function to split reservation
  const masterReservation = () => {
    setOpen(true);
    const timeout = setTimeout(() => {
      setShowSecondaryMessage(true);
    }, 5000);
    setButtonDisabled(true);
    const createmarketGroup = JSON.stringify({
      fullData: filldata["tempReservationID"],
      quantity: filldata["numberOfRooms"],
      reservationID: filldata["id"],
    });

    fetchx(API_URL + "/splitReservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: createmarketGroup,
    })
      .then((res) => res.json())
      .then((postres) => {
        if (postres.statusCode === 200) {
          setButtonDisabled(false);
          setOpen(false);
          handleSuccess();
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };


  //Function to re-instate reservation
  const reInstateReservation = data => {
    setIsUpdateWithRatesButton(true)
    setOpen(true);
    const timeout = setTimeout(() => {
      setShowSecondaryMessage(true);
    }, 5000);
    const reinstateJson = JSON.stringify({
      hotelID: 1,
      reservationID: filldata["id"],
      arrivalDate: filldata["arrivalDate"],
      departureDate: filldata["departureDate"],
      sharingID: filldata["sharingID"],
      roomTypeID: filldata["roomTypeID"],
      numberOfRooms: filldata["numberOfRooms"],
      reason: data.reasonSelection.value,
      remarks: data.inputRemark,
      tempReservationID: filldata['tempReservationID'],
      isMain: filldata['isMain'],
      mainReservationID: rowData2[0]['id'],
      mainReservationTempID: rowData2[0]['tempReservationID']
    });


    fetchx(API_URL + '/reInstateReservation', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: reinstateJson,
    })
      .then((res) => res.json())
      .then((postres) => {
        if (typeof (postres['data']) == 'string') {
          handleError(postres['data'])
        }
        else if (postres.statusCode === 200) {
          setOpen(false);
          handleSuccessForReinstate();
          setIsUpdateWithRatesButton(false)
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };


  useEffect(() => {
    // fetchx(API_URL + "/getReservationForFrontDesk?hotelID=1",{}, true)
    fetchx("/getReservationForFrontDesk?hotelID=1", {}, true)
      .then((result) => result.json())
      .then((rowData) => {
        setRowData(rowData["data"]);
        // console.log(rowData)
      });
  }, []);





  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.setQuickFilter(
      document.getElementById("filter-text-box2").value
    );
  }, []);


  const fromDate = watch('fromDate');
  const toDate = watch('toDate');
  const optionsFilter = {
  };
  const optionsToDate = {
    minDate: fromDate && fromDate.length !== 0 ? Moment(String(new Date(fromDate))).format('YYYY-MM-DD') : null
  };


  useEffect(() => {
    // Call the function whenever both fromDate and toDate are filled
    if (fromDate !== undefined && toDate !== undefined) {
      if (Array.isArray(fromDate) && Array.isArray(toDate) &&
        fromDate.length !== 0 && toDate.length !== 0 &&
        fromDate[0] !== '' && toDate[0] !== '') {

        let fromDateFormat = fromDate !== '' ? format(new Date(fromDate), 'yyyy-MM-dd') : '';
        let toDateFormat = toDate !== '' ? format(new Date(toDate), 'yyyy-MM-dd') : '';
        fetch(API_URL + "/getReservationForFrontDesk?fromDate=" + fromDateFormat + "&toDate=" + toDateFormat)
          .then((result) => result.json())
          .then((rowData) => {
            setRowData(rowData["data"]);
            // console.log(rowData)
          });
      }
      else {
        fetch(API_URL + "/getReservationForFrontDesk?hotelID=1")
          .then((result) => result.json())
          .then((rowData) => {
            setRowData(rowData["data"]);
            // console.log(rowData)
          });
      }
    }
  }, [fromDate, toDate]);


  const getRowStyle = params => {
    if (params.data && params.data.reservationStatus === 'Cancelled') {
      return { background: '#3598db' };
    }
    else if (params.data && params.data.subBookingID !== null && params.data.subBookingID !== '0') {
      return { background: '#f1c40f' };
    }
    return null;
  };


  const onFilterTextBoxChanged3 = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);


  // Function to handle modal close
  const handleModalClose = () => {
    setResAlert(null);
    setdisResAlert(false);
  };



  function toggleModal() {
    setERegistrationCard(false);
    setRegistrationCard(false)
  }

  // const sortByColumn = (colId) => {
  //   gridRef.current = params.api;

  //   gridRef.current.api.setSortModel([
  //     { colId: colId, sort: 'asc' } // or 'desc'
  //   ]);
  // };
  // const sortByColumn = (colId) => {
  //   console.log(gridRef.current)
  //   if (gridRef.current) {
  //     gridRef.current.setSortModel([{ colId, sort: 'asc' }]);
  //   } else {
  //     console.warn('Grid API not available yet.');
  //   }
  // };

  // const sortByColumn = (colId) => {
  //   if (gridRef.current?.setSortModel) {
  //     gridRef.current.setSortModel([{ colId, sort: 'asc' }]);
  //   } else {
  //     console.warn('Grid API not available or setSortModel not defined.');
  //   }
  // };
  const sortByColumn = (columnName) => {
    if (!gridRef.current || !gridColumnApiRef.current) return;

    const columnApi = gridColumnApiRef.current;

    // Get current column state
    const columnState = columnApi.getColumnState();
    let sortDirection = 'asc';

    // Check if column is already sorted
    const currentSort = columnState.find(col => col.colId === columnName && col.sort);
    if (currentSort) {
      sortDirection = currentSort.sort === 'asc' ? 'desc' : 'asc';
    }

    // Clear all existing sorts
    columnApi.applyColumnState({
      defaultState: { sort: null },
    });

    // Apply new sort
    columnApi.applyColumnState({
      state: [{
        colId: columnName,
        sort: sortDirection
      }],
      defaultState: { sort: null },
    });
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

          <Col md='2' sm='12' className='mb-1'>
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
                    options={optionsFilter}
                    placeholder='YYYY-MM-DD'
                    {...field}
                    className='form-control'

                  />
                )}
              />
            </div>
          </Col>
          <Col md='2' sm='12' className='mb-1'>
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
                    options={optionsToDate}
                    // options={{ allowInput: true }}
                    className='form-control'

                  />
                )}
              />
            </div>
          </Col>
          <Col md='2' sm='12' className='mb-1'>

            <div className='demo-inline-spacing'>
              <UncontrolledButtonDropdown>
                <DropdownToggle color='primary' caret>
                  <b>Sort By</b>
                </DropdownToggle>
                <DropdownMenu>
                  {/* <DropdownItem href='/' tag='a'><b>Booking ID</b></DropdownItem>
                  <DropdownItem href='/' tag='a'><b>Room No.</b></DropdownItem>
                  <DropdownItem href='/' tag='a'><b>Arrival Date</b></DropdownItem>
                  <DropdownItem href='/' tag='a'><b>Departure Date</b></DropdownItem> */}
                  <DropdownItem tag='button' onClick={() => sortByColumn('bookingID')}><b>Booking ID</b></DropdownItem>
                  <DropdownItem tag='button' onClick={() => sortByColumn('roomNumber')}><b>Room No.</b></DropdownItem>
                  <DropdownItem tag='button' onClick={() => sortByColumn('arrivalDate')}><b>Arrival Date</b></DropdownItem>
                  <DropdownItem tag='button' onClick={() => sortByColumn('departureDate')}><b>Departure Date</b></DropdownItem>

                  {/* <DropdownItem href='/' tag='a'>Option 3</DropdownItem> */}
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </div>
          </Col>

        </Row>
      </div>

      {/* <button onClick={buttonListener}>Push Me</button> */}
      <div className="ag-theme-alpine" style={{ height: 520 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={true}
          getRowStyle={getRowStyle}
          rowSelection="multiple"
          onCellClicked={cellClickedListener}
          onGridReady={onGridReady}
          paginationPageSize="10"
          pagination="true"
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
        />
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

      {/* <div>
        <Modal isOpen={forex}
          toggle={() => setForex(!forex)} className="modal-xl">
          <ModalHeader className="modal-lg" toggle={() => setForex(!forex)} ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              <Forex data1={filldata} />
            </div>
          </ModalBody>
        </Modal>
      </div> */}
      <div>
        <Modal
          isOpen={assign}
          toggle={() => setAssign(!assign)}
          className="modal-xl"
        >
          <ModalHeader
            className="modal-xl"
            toggle={() => {
              setAssign(!assign);
            }}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-2 mx-20">
            <div>
              {filldata.length != 0 && (
                <AssignRoom
                  data1={filldata}
                  Start={localStorage.getItem("reservationStart")}
                  End={localStorage.getItem("reservationEnd")}
                />
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
        <Modal
          isOpen={checkIn}
          toggle={() => setCheckIn(!checkIn)}
          className="demo-inline-spacing"
        >
          <ModalHeader
            className="bg-transparent"
            toggle={() => setCheckIn(!checkIn)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>{filldata.length != 0 && <CheckIn data1={filldata} />}</div>
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
          isOpen={receipt}
          toggle={() => setReceipt(!receipt)}
          className="modal-xl"
        >
          <ModalHeader
            className="modal-lg"
            toggle={() => setReceipt(!receipt)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              {filldata.length != 0 && (
                <Row>
                  {/* <Col md='8' sm='12'>
 <Receipt data1={filldata} />
 </Col> */}
                  <Col md="4" sm="12">
                    <PreviewActionsReceipt data1={filldata} />
                  </Col>
                </Row>
              )}
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

      <div>
        <Modal
          isOpen={proFormaFolio}
          toggle={() => setProFormaFolio(!proFormaFolio)}
          className="modal-xl"
        >
          <ModalHeader
            className="modal-lg"
            toggle={() => setProFormaFolio(!proFormaFolio)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              {filldata.length != 0 && (
                <Row>
                  <Col md="8" sm="12">
                    <ProformaFolio data1={filldata} />
                  </Col>
                  <Col md="4" sm="12">
                    <PreviewActionsProforma data1={filldata} />
                  </Col>
                </Row>
              )}
            </div>
          </ModalBody>
        </Modal>
      </div>

      <div>      {/* Add Assign Room */}

        <Modal
          isOpen={paymentCard}
          toggle={() => setPaymentCard(!paymentCard)}
          className="modal-xl"
        >
          <ModalHeader
            className="modal-lg"
            toggle={() => setPaymentCard(!paymentCard)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              {filldata.length != 0 && (
                <Row>
                  <Col md="8" sm="12">
                    <Confirmation data1={filldata} />
                  </Col>
                  <Col md="4" sm="12">
                    <PreviewActionsPayment data1={filldata} />
                  </Col>
                </Row>
              )}
            </div>
          </ModalBody>
        </Modal>
      </div>

      <div>
        <Modal
          isOpen={roomMove}
          toggle={() => setRoomMove(!roomMove)}
          className="demo-inline-spacing"
        >
          <ModalHeader
            className="bg-transparent"
            toggle={() => setRoomMove(!roomMove)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>{filldata.length != 0 && <RoomMove data1={filldata} />}</div>
          </ModalBody>
        </Modal>
      </div>

      <div>
        <Modal
          isOpen={cancelCheckIn}
          toggle={() => setCancelCheckIn(!cancelCheckIn)}
          className="demo-inline-spacing"
        >
          <ModalHeader
            className="bg-transparent"
            toggle={() => setCancelCheckIn(!cancelCheckIn)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              {filldata.length != 0 && <CancelCheckIn data1={filldata} />}
            </div>
          </ModalBody>
        </Modal>
      </div>

      <div>
        <Modal
          isOpen={unAssign}
          toggle={() => setUnAssign(!unAssign)}
          className="demo-inline-spacing"
        >
          <ModalHeader
            className="bg-transparent"
            toggle={() => setUnAssign(!unAssign)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              {filldata.length != 0 && <UnAssignRoom data1={filldata} />}
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
          isOpen={checkOut}
          toggle={() => setCheckOut(!checkOut)}
          className="demo-inline-spacing"
        >
          <ModalHeader
            className="bg-transparent"
            toggle={() => setCheckOut(!checkOut)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>{filldata.length != 0 && <CheckOut data1={filldata} />}</div>
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
          isOpen={options}
          toggle={() => setOptions(!options)}
          className="modal-xl"
        >
          <ModalHeader
            className="modal-lg"
            toggle={() => {
              setOptions(!options);
            }}
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
                      {filldata && filldata.isMain === 1 && <div
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
                      </div>}
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
                      {filldata.reservationStatus === 'Checked Out' && <div
                        onClick={() => {
                          if (filldata.departureDate == Today) {
                            setShowReinstateCheckout(true)

                          } else {
                            setPopUp('Previous days Checkout cannot be reinstated')
                          }
                        }}
                        className="hoverUnderline">
                        Re-Instate Check Out
                      </div>}
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
                    <div className="hoverUnderline" onClick={() => setAlerts(!alerts)} >

                      {/* <AlertTriangle style={{ height: "20px" }} /> */}
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
      </div>

      {basicModal && (
        <div className="demo-inline-spacing">
          <div className="basic-modal">
            <Modal
              isOpen={basicModal}
              toggle={() => setBasicModal(!basicModal)}
            >
              <ModalHeader toggle={() => setBasicModal(!basicModal)}>
                Split Reservation Page
              </ModalHeader>
              <ModalBody>
                <p>
                  This reservation will be split into{" "}
                  {filldata["numberOfRooms"]} reservations
                </p>
              </ModalBody>
              {/* <div align='end'> */}
              <ModalFooter>
                <Button color="secondary" outline onClick={modalClose}>
                  Cancel
                </Button>
                <Button color="primary" disabled={isButtonDisabled} onClick={masterReservation}>
                  Split
                </Button>

                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                      Please wait while we are updating your reservation
                    </h1>
                    {showSecondaryMessage && (
                      <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                        We're processing your request, which may take a little longer due to additional data. Please be patient!
                      </h1>
                    )}
                    <CircularProgress color="inherit" />
                  </div>
                </Backdrop>
              </ModalFooter>
              {/* </div> */}
            </Modal>
          </div>
        </div>
      )}

      {/* Re-instate reservation module */}
      {reInstateModal && (
        <div className="demo-inline-spacing">
          <div className="basic-modal">
            <Modal
              isOpen={reInstateModal}
              toggle={() => setReInstateModal(!reInstateModal)}
            >
              <ModalHeader toggle={() => setReInstateModal(!reInstateModal)}>
                Re-Instate Reservation Page
              </ModalHeader>
              <ModalBody>
                <br></br>
                <Form onSubmit={handleSubmit(reInstateReservation)}>
                  <Row>
                    <Col md='6' sm='12'>
                      <div className='mb-1'>
                        <Label className='form-label' for='reasonSelection' >
                          Select Reason <spam style={{ color: 'red' }}>*</spam>
                        </Label>
                        <Controller
                          required
                          id='reasonSelection'
                          control={control}
                          name='reasonSelection'
                          render={({ field }) => (
                            <Select
                              required
                              isClearable
                              options={reason}
                              classNamePrefix='select'
                              theme={selectThemeColors}
                              className={classnames('react-select')}
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </Col>
                    <Col md='6' sm='12'>
                      <div>
                        <Label className='form-label' for='inputRemark'>
                          Remarks <spam style={{ color: 'red' }}>*</spam>
                        </Label>
                        <Controller
                          id='inputRemark'
                          name='inputRemark'
                          control={control}
                          render={({ field }) => (
                            <Input
                              id='reasonText'
                              required
                              {...field}
                              placeholder='Reason Remarks'
                              className={classnames('form-control'
                              )}
                            />
                          )}
                        />
                      </div>
                    </Col>
                  </Row>
                  <br></br>
                  <div align='end'>
                    <Button color="secondary" outline onClick={modalClose}>
                      Cancel
                    </Button> &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button color="primary" type='submit' disabled={isUpdateWithRatesButton}>
                      Confirm
                    </Button>
                  </div>
                </Form>
              </ModalBody>


              {/* <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                      Please wait while we are re-instating your reservation
                    </h1>
                    {showSecondaryMessage && (
                      <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                        We're processing your request, which may take a little longer due to additional data. Please be patient!
                      </h1>
                    )}
                    <CircularProgress color="inherit" />
                  </div>
                </Backdrop> */}
              {/* </div> */}
            </Modal>
          </div>
        </div>
      )}


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

      {/* {Nayana} */}

      <Modal
        isOpen={ShowReinstateCheckout}
        toggle={() => setShowReinstateCheckout(!ShowReinstateCheckout)}
        className='modal-dialog-centered modal-lg'
      >
        <ModalHeader toggle={() => setShowReinstateCheckout(!ShowReinstateCheckout)} className='bg-transparent'>Re-instate Checkout</ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>


          <ReinstateCheckOut />

        </ModalBody>
      </Modal>

      <Modal
        isOpen={ShowDepositPost}
        toggle={() => setShowDepositPost(!ShowDepositPost)}
        className='modal-dialog-centered modal-xl'
      >
        <ModalHeader toggle={() => setShowDepositPost(!ShowDepositPost)} className='bg-transparent'>Depost Posting</ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>


          <DepositPosting />

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

      {filldata !== "" && <Modal isOpen={showfixedcharges} toggle={() => setshowfixedcharges(!showfixedcharges)} className='modal-lg' >
        <ModalHeader className='modal-lg' toggle={() => { setshowfixedcharges(!showfixedcharges) }}></ModalHeader>
        <ModalBody className='pb-3 px-sm-2 mx-20'>
          <div >
            <FixedCharges />
          </div>
        </ModalBody>
      </Modal>}
      {/* {Nayana} */}

    </div>
  );
}

export default AllReservation;
