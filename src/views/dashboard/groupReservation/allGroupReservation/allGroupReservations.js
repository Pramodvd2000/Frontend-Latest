// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { format } from "date-fns";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button, Modal, ModalBody, ModalHeader, Card, Form, Label, CardBody, Row, Col, Input, Badge } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import classnames from "classnames";
import { selectThemeColors } from "@utils";
import "./frontDesk.scss";
import ExcelJS from 'exceljs';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import Moment from "moment";
import API_URL from "../../../../config";
import { Check, Circle, Edit2 } from "react-feather";

sessionStorage.removeItem('groupReservationID')
import Flatpickr from 'react-flatpickr'

import DatesModification from './dateModification'
import BookingInfoModification from './bookingInfoModification';
import ModifyNumberOfRooms from './noOfRoomsModification';
import { useNavigate } from "react-router-dom"
import AssignRoomModal from './../../testFrontDesk/assignRoom'
import SharerCreate from '../../testFrontDesk/addSharer'
import RegistrationCard from '../../testFrontDesk/registrationCard';
import PreviewActionsRegCard from '../../testFrontDesk/PreviewActionsRegCard'
import AdvancePost from './advancePost';
import CheckIn from '../../testFrontDesk/check-in';
import * as XLSX from 'xlsx';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import PaymentModification from './paymentModification';
import InventoryEntryTable from './inventoryEntryTable'


// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import ReleaseInventory from './releaseInvetory'

const salutations = [
    { value: "Mr", label: "Mr." },
    { value: "Mrs", label: "Mrs." },
    { value: "Ms", label: "Ms." },
    { value: "Dr", label: "Dr." },
    { value: "Mast.", label: "Mast.." },
    { value: "Prof", label: "Prof." },
    { value: "Capt", label: "Capt." },
    { value: "Wg Cdr.", label: "Wg Cdr." },
    { value: "Major.", label: "Major." },
];


const AllGroupReservations = () => {

    const navigate = useNavigate()
    const [rowData, setRowData] = useState();
    const [options, setOptions] = useState();
    const [definiteOptions, setDefiniteOptions] = useState();
    const [definiteOptionsActions, setDefiniteOptionsActions] = useState(false);
    const [definiteData, setDefiniteData] = useState();
    const [gridData, setGridData] = useState([]); // Initialize gridData with an empty array
    const [editedRows, setEditedRows] = useState(new Set());
    const gridRef = useRef(null);
    const gridRef2 = useRef(null);
    const [reservationData, setReservationData] = useState();
    const [modalOpen, setModalOpen] = useState();
    const [roomCountChange, setRoomCountChange] = useState();
    const [datesModification, setDatesModification] = useState();
    const [bookingInfoMod, setBookingInfoMod] = useState();
    const [numberOfRooms, setNumberOfRooms] = useState();
    const [cancelBooking, setCancelBooking] = useState();
    const [reason, setReason] = useState([]);
    const [valueReason, setValueReason] = useState();
    const [labelReason, setLabelReason] = useState();
    const { reset, control, watch, handleSubmit } = useForm({});
    const [mainModal, setMainModal] = useState(false)
    const [assignRoomData, setAssignRoomData] = useState()
    const [openRegCard, setOpenRegCard] = useState(false)
    const [regCardData, setRegCardData] = useState()
    const [groupRevenue, setGroupRevenue] = useState(false)
    const [groupRevenueData, setGroupRevenueData] = useState([])
    const [openCheckInForm, setOpenCheckInForm] = useState(false)
    const [checkInData, setCheckInData] = useState()
    const [sharerForm, setSharerForm] = useState(false)
    const [sharerData, setSharerData] = useState(false)
    const [uploadForm, setUploadForm] = useState(false);
    const [fileData, setFileData] = useState(null);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);
    const [openGridData, setOpenGridData] = useState(false);
    const [definiteReservationData, setDefiniteReservation] = useState();
    const [fileNameList, setFileNameList] = useState("");
    const [gridOpenForm, setGridOpenForm] = useState(false)
    const [open, setOpen] = useState(false);
    const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
    const [openAdvancePost, setOpenAdvancePost] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [paymentTypeMod, setPaymentTypeMod] = useState();
    const [selectedReservationID, setSelectedReservationID] = useState();
    const [isUpdateWithRatesButton, setIsUpdateWithRatesButton] = useState(false);
    const [invOpen, setInvOpen] = useState();
    const [filldata, setfilldata] = useState();
    const [openReleaseInventory, setOpenReleaseInventory] = useState();
    const [tempData,setTempData] = useState(null);


 function closeReleaseInventoryModal() {
        setOpenReleaseInventory(!openReleaseInventory)
    }


    function closeInventoryModal(){
        setInvOpen(!invOpen)
          }

          
    useEffect(() => {
        if (!selectedReservationID || !uploadForm) return;
      
        const fetchGroupReservationData = async () => {
          try {
            const response = await fetch(API_URL + "/getGroupResData", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ groupReservationID: selectedReservationID }),
            });
      
            const result = await response.json();
            if (response.ok && result.status === "success") {
              setTempData(result.data);
              console.log(result.data);
            } else {
              console.error(result.message || "Failed to fetch data");
            }
          } catch (error) {
            console.error("Error fetching group reservation data:", error);
          }
        };
      
        fetchGroupReservationData();
      }, [selectedReservationID, uploadForm]);
      

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        autoHeight: true,
        wrapText: true,
        filterParams: {
            buttons: ["apply", "reset"],
        },
    }));


    // All reservation data
    const [columnDefs] = useState([
        {
            headerName: "Block Code ID",
            field: "id",
            suppressSizeToFit: true,
            maxWidth: 145
        },
        {
            headerName: "Group Name",
            field: "groupName",
            suppressSizeToFit: true,
            maxWidth: 180
        },
        {
            headerName: "Arrival",
            field: "arrivalDate",
            suppressSizeToFit: true,
            maxWidth: 140,
            cellRenderer: (params) => {
                // Ensure the arrivalDate field exists in the row data        
                if (params.data && params.data.arrivalDate) {
                    // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
                    const formattedDate = Moment(params.data.arrivalDate).format("DD-MM-YYYY");
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
                    const formattedDate = Moment(params.data.departureDate).format("DD-MM-YYYY");
                    return formattedDate;
                } else {
                    return ""; // Handle cases where the data is missing or invalid        
                }
            }
        },
        {
            headerName: "Status",
            field: "status",
            suppressSizeToFit: true,
            maxWidth: 130,
        },
        {
            headerName: "Reservation Status",
            field: "newStatus",
            suppressSizeToFit: true,
            maxWidth: 180,
        },
      
        {
            headerName: "Actions",
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 110 }}
                    onClick={() => {
                        setModalOpen(!modalOpen)
                    }}
                >
                    Actions
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            maxWidth: 148
        },
        {
            headerName: "Creation Status",
            field: "creationStatus",
            suppressSizeToFit: true,
            maxWidth: 180,
            cellRenderer: (params) => {
                if (params.data && params.data.creationStatus) {
                    switch (params.data.creationStatus) {
                        case 'Not Started':
                            return <Badge color="secondary">Not Started</Badge>;
                        case 'Processing':
                            return <Badge color="warning">Processing</Badge>;
                        case 'Completed':
                            return <Badge color="success">Completed</Badge>;
                        // default:
                        //     return <Badge color="light">{params.data.creationStatus}</Badge>;
                    }
                } else {
                    return "";
                }
            },
        },
        {
            headerName: "Nights",
            field: "nights",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
        {
            headerName: "Market Code",
            field: "marketCode",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
        {
            headerName: "Source Code",
            field: "sourceCode",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
        {
            headerName: "PAX",
            field: "PAXno",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
        {
            headerName: "Origin",
            field: "originName",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
    ]);


    // roomtype data
    const [columnDefs2] = useState([
        {
            headerName: "Room Type",
            field: "roomType",
            suppressSizeToFit: true,
            maxWidth: 140
        },
        {
            headerName: "Availability",
            field: "min_availability",
            suppressSizeToFit: true,
            maxWidth: 130,
        },
        {
            headerName: "Number of Rooms",
            field: "numberOfPickedRooms",
            editable: params => params.data.min_availability >= 0,
            suppressSizeToFit: true,
            valueParser: params => {
                const sanitizedValue = sanitizeNumericInput(params.newValue);
                return sanitizedValue === '' ? params.oldValue : parseFloat(sanitizedValue, 10);
            },
            maxWidth: 150,
        },
        {
            headerName: "Base Rate",
            field: "baseAmount",
            editable: params => params.data.min_availability >= 0,
            suppressSizeToFit: true,
            valueParser: params => {
                const sanitizedValue = sanitizeNumericInput2(params.newValue);
                return sanitizedValue === '' ? params.oldValue : parseFloat(sanitizedValue, 10);
            },
            maxWidth: 130
        },
        {
            headerName: "Extra Adult Price",
            field: "extraAdultPrice",
            editable: params => params.data.min_availability >= 0,
            suppressSizeToFit: true,
            valueParser: params => {
                const sanitizedValue = sanitizeNumericInput2(params.newValue);
                return sanitizedValue === '' ? params.oldValue : parseFloat(sanitizedValue, 10);
            },
            maxWidth: 170
        },
        {
            headerName: "Extra Child Price",
            field: "extraChildPrice",
            editable: params => params.data.min_availability >= 0,
            suppressSizeToFit: true,
            valueParser: params => {
                const sanitizedValue = sanitizeNumericInput2(params.newValue);
                return sanitizedValue === '' ? params.oldValue : parseFloat(sanitizedValue, 10);
            },
            maxWidth: 170
        },
        {
            headerName: "Package Rate(total)",
            field: "packageRate",
            editable: params => params.data.min_availability >= 0,
            suppressSizeToFit: true,
            valueParser: params => {
                const sanitizedValue = sanitizeNumericInput2(params.newValue);
                return sanitizedValue === '' ? params.oldValue : parseFloat(sanitizedValue, 10);
            },
            maxWidth: 180
        },
        {
            headerName: "Total(per room)",
            valueGetter: params => {
                const { baseAmount, extraAdultPrice, extraChildPrice, packageRate } = params.data;
                return (Number(baseAmount) || 0) + (Number(extraAdultPrice) || 0) + (Number(extraChildPrice) || 0) + (Number(packageRate) || 0);
            },
            suppressSizeToFit: true,
            maxWidth: 160
        },
        {
            headerName: "Action",
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 110 }}
                    onClick={() => handleSubmit1(params.data)} // Pass row data to handleSubmit
                >
                    Save
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            maxWidth: 148
        }, 
        {
            // headerName: "Action",
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 110 }}
                    onClick={() => handleSubmit2(params.data)} // Pass row data to handleSubmit
                >
                    clear
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            maxWidth: 148
        }
    ]);


    const sanitizeNumericInput = (input) => {
        // Remove all non-numeric characters except for the decimal point
        input = input.replace(/[^\d]/g, '');
        // If there is more than one decimal point, keep only the first one
        const parts = input.split('.');
        if (parts.length > 2) {
            input = parts[0] + '.' + parts.slice(1).join('');
        }
        return input;
    };


    const sanitizeNumericInput2 = (input) => {
        // Remove all non-numeric characters except for the decimal point
        input = input.replace(/[^\d.]/g, '');
        // If there is more than one decimal point, keep only the first one
        const parts = input.split('.');
        if (parts.length > 2) {
            input = parts[0] + '.' + parts.slice(1).join('');
        }
        return input;
    };

    // rooming list
    const [columnDefs3] = useState([
        {
            headerName: "Sl.No",
            valueGetter: "node.rowIndex + 1",
            suppressSizeToFit: true,
            maxWidth: 90
        },
        {
            headerName: "Saln",
            field: "salutation",
            editable: params => !params.data.bookingID, // Allow editing if bookingID is empty
            maxWidth: 100,
            cellEditor: "agSelectCellEditor", // Use ag-Grid built-in select cell editor
            cellEditorParams: params => {
                // Customize options based on conditions if needed
                return { values: salutations.map(salutation => salutation.label) };
            },
            valueFormatter: params => {
                const salutation = salutations.find(s => s.label === params.value);
                return salutation ? salutation.label : ""; // Format displayed value
            }
        },
        {
            headerName: "First Name",
            field: "firstName",
            editable: function (params) {
                return !params.data.bookingID; // Allow editing if bookingID is empty
            },
            maxWidth: 180,
        },
        {
            headerName: "Last Name",
            field: "lastName",
            editable: function (params) {
                return !params.data.bookingID; // Allow editing if bookingID is empty
            },
            maxWidth: 250,
        },
        {
            headerName: "Booking ID",
            field: "bookingID",
            suppressSizeToFit: true,
            maxWidth: 130
        },
        {
            headerName: "Room Number",
            field: "roomNumber",
            suppressSizeToFit: true,
            maxWidth: 160,
        },
        {
            headerName: "Group Name",
            field: "groupName",
            suppressSizeToFit: true,
            maxWidth: 200,
        },
        {
            headerName: "Status",
            field: 'reservationStatus',
            suppressSizeToFit: true,
            maxWidth: 120
        },
        {
            headerName: "Room Type",
            field: "roomTypeName",
            suppressSizeToFit: true,
            maxWidth: 130
        },
        {
            headerName: "Actions",
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 110 }}
                    onClick={() => createReservation(params)}
                    disabled={!!params.data.bookingID} // Use params.data.bookingID
                >
                    Confirm Booking
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            maxWidth: 148
        },
        {
            cellRendererFramework: (params) => (
                <Button
                    color='primary'
                    style={{ width: 110 }}
                    disabled={(params.data.bookingID == undefined || !!params.data.roomNumber)}
                >
                    Assign Room
                </Button>
            ),
            suppressSizeToFit: true,
            maxWidth: 148,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
        },
        {
            cellRendererFramework: (params) => (
                <Button
                    color='primary'
                    style={{ width: 110 }}
                    disabled={params.data.roomNumber == null || (params.data.reservationStatus == 'Checked In' || params.data.reservationStatus == 'Due Out')}
                >
                    Check In
                </Button>
            ),
            suppressSizeToFit: true,
            maxWidth: 148,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
        },
        {
            cellRendererFramework: (params) => (
                <Button
                    color='primary'
                    style={{ width: 110 }}
                    disabled={params.data.bookingID == undefined}
                >
                    View Reg Card
                </Button>
            ),
            suppressSizeToFit: true,
            maxWidth: 148,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
        },
        {
            cellRendererFramework: (params) => (
                <Button
                    color='primary'
                    style={{ width: 110 }}
                    disabled={params.data.bookingID == undefined}
                >
                    Add Sharer
                </Button>
            ),
            suppressSizeToFit: true,
            maxWidth: 148,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
        },
        {
            headerName: "Arrival Date",
            field: "arrivalDate",
            suppressSizeToFit: true,
            maxWidth: 130,
        },
        {
            headerName: "Departure Date",
            field: 'departureDate',
            suppressSizeToFit: true,
            maxWidth: 160
        },
    ]);


    // Rooming list entry for all guest details
    const [columnDefs6] = useState([
        {
            headerName: "Sl.No",
            valueGetter: "node.rowIndex + 1",
            suppressSizeToFit: true,
            maxWidth: 70,
            autoHeaderHeight: true,
            wrapHeaderText: true
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
            cellStyle: params => {
                let borderColor = 'transparent'; // Default color for the border
        
                if (params.data.bookingID && (params.data.bookingID !== null)) {
                  borderColor = '#f1c40f'; // Blue color
                }
        
                return {
                  backgroundColor: borderColor,
                  // borderLeft: `5px solid ${borderColor}`,
                  // paddingLeft: '10px', // Add some left padding to separate content from border
                };
              },
            suppressSizeToFit: true,
            maxWidth: 102,
            filter: 'agTextColumnFilter'
          },
        {
            headerName: "Room Type",
            field: "roomType",
            suppressSizeToFit: true,
            maxWidth: 130,
            autoHeaderHeight: true,
            wrapHeaderText: true
        },
        {
            headerName: "Arrival Date",
            field: "arrival_date",
            cellRenderer: (params) => {
                // Ensure the arrivalDate field exists in the row data        
                if (params.data && params.data.arrival_date) {

                    const formattedDate = format(new Date(params.data.arrival_date), 'dd MMM  yy');

                    return formattedDate;
                } else {
                    return ""; // Handle cases where the data is missing or invalid        
                }
            },
            maxWidth: 120,
            autoHeaderHeight: true,
            wrapHeaderText: true
        },
        {
            headerName: "Departure Date",
            field: "departure_date",
            cellRenderer: (params) => {
                // Ensure the arrivalDate field exists in the row data        
                if (params.data && params.data.departure_date) {

                    const formattedDate = format(new Date(params.data.departure_date), 'dd MMM  yy');

                    return formattedDate;
                } else {
                    return ""; // Handle cases where the data is missing or invalid        
                }
            },
            maxWidth: 120,
            autoHeaderHeight: true,
            wrapHeaderText: true
        },
        {
            headerName: "Saln",
            field: "salutation",
            maxWidth: 80,
            autoHeaderHeight: true,
            wrapHeaderText: true
        },
        {
            headerName: "First Name",
            field: "firstName",
            maxWidth: 150,
            autoHeaderHeight: true,
            wrapHeaderText: true
        },
        {
            headerName: "Last Name",
            field: "lastName",
            maxWidth: 150,
            autoHeaderHeight: true,
            wrapHeaderText: true
        },
        {
            headerName: "Email ID",
            field: "emailID",
            suppressSizeToFit: true,
            maxWidth: 130,
            autoHeaderHeight: true,
            wrapHeaderText: true
        }, {
            headerName: "Phone Number",
            field: "mobileNumber",
            suppressSizeToFit: true,
            maxWidth: 150,
            autoHeaderHeight: true,
            wrapHeaderText: true
        },

        {
            headerName: "S1 Saln",
            field: "sharer1_salutation",
            maxWidth: 80,
            autoHeaderHeight: true,
            wrapHeaderText: true
        },
        {
            headerName: "S1 First Name",
            field: "sharer1_firstName",
            maxWidth: 180,
            autoHeaderHeight: true,
            wrapHeaderText: true
        },
        {
            headerName: "S1 Last Name",
            field: "sharer1_lastName",
            maxWidth: 250,
            autoHeaderHeight: true,
            wrapHeaderText: true
        },
        {
            headerName: "S1 Email ID",
            field: "sharer1_emailId",
            suppressSizeToFit: true,
            maxWidth: 130,
            autoHeaderHeight: true,
            wrapHeaderText: true
        }, {
            headerName: "S1 Phone Number",
            field: "sharer1_phoneNumber",
            suppressSizeToFit: true,
            maxWidth: 150,
            autoHeaderHeight: true,
            wrapHeaderText: true
        },
        {
            headerName: "S2 Saln",
            field: "sharer2_salutation",
            maxWidth: 80,
            autoHeaderHeight: true,
            wrapHeaderText: true
        },
        {
            headerName: "S2 First Name",
            field: "sharer2_firstName",
            maxWidth: 150,
            autoHeaderHeight: true,
            wrapHeaderText: true
        },
        {
            headerName: "S2 Last Name",
            field: "sharer2_lastName",
            maxWidth: 150,
            autoHeaderHeight: true,
            wrapHeaderText: true
        },
        {
            headerName: "S2 Email ID",
            field: "sharer2_emailId",
            suppressSizeToFit: true,
            maxWidth: 130,
            autoHeaderHeight: true,
            wrapHeaderText: true
        }, {
            headerName: "S2 Phone Number",
            field: "sharer2_phoneNumber",
            suppressSizeToFit: true,
            maxWidth: 150,
            autoHeaderHeight: true,
            wrapHeaderText: true
        }

    ]);


    // Define column definitions for ag-Grid
    const columnDefs4 = [
        { headerName: "", field: "Category" },
        { headerName: "Total", field: "Total" },
        { headerName: "Picked", field: "Picked" },
        { headerName: "Remaining", field: "Remaining" }
    ];


    // Rooming list entry for all guest details
    const [columnDefs7] = useState([
        {
            headerName: "Bkng ID",
            field: "bookingID",
            suppressSizeToFit: true,
            width: 110
        },
        {
            headerName: "Saln",
            field: "salutation",
            width: 80,
        },
        {
            headerName: "First Name",
            field: "firstName",
            width: 150,
        },
        {
            headerName: "Last Name",
            field: "lastName",
            width: 150,
        },
        {
            headerName: "Status",
            field: "reservationStatus",
            suppressSizeToFit: true,
            width: 100
        },
        {
            headerName: "Group Name",
            field: "groupName",
            suppressSizeToFit: true,
            width: 180
        },
        {
            headerName: "Room No",
            field: "room",
            suppressSizeToFit: true,
            width: 130
        },
    ]);


    const [columnDefs8] = useState([
        {
            headerName: "Room Type",
            field: "roomType",
            suppressSizeToFit: true,
            maxWidth: 140
        },
        {
            headerName: "Availability",
            field: "min_availability",
            suppressSizeToFit: true,
            maxWidth: 130,
        },

    ]);

    // Get all the reservations on page load
    useEffect(() => {
        fetchx(API_URL + "/getAllGroupReservations")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData(rowData["data"]);
            });


        fetchx(API_URL + '/getReasonByID?reasonGroupID=8')
            .then(result => result.json())
            .then(resp => {
                setReason(resp['data'])
            })

    }, []);


    // on click cell click listener in rooming list
    const cellClickedListener2 = useCallback((event) => {
        // Check if event contains cell information
        if (event && event.event && event.event.target) {
            const clickedElement = event.event.target;
            if (clickedElement.tagName === 'BUTTON') {
                const buttonName = clickedElement.innerText;
                // Disable the button if its name is "Assign Room"
                if (buttonName === 'Confirm Booking' && event.data.salutation !== undefined && event.data.firstName !== undefined && event.data.lastName !== undefined && event.data.status === 'Definite') {
                    clickedElement.disabled = true;
                }
                if (buttonName === 'Confirm Booking' && event.data.bookingID) {
                    clickedElement.disabled = true;
                }
                if (buttonName === 'Check In' && (event.data.reservationStatus == 'Checked In' || event.data.reservationStatus == 'Due Out' || event.data.roomNumber == null)) {
                    clickedElement.disabled = true;
                }
                if ((buttonName === 'Assign Room' || buttonName === 'View Reg Card' || buttonName === 'Check In' || buttonName === 'Add Sharer') && event.data.bookingID == undefined) {
                    return handleError("Since reservation is not created, can't perform this operation")
                }
                else if (buttonName === 'Assign Room' && event.data.bookingID !== undefined) {
                    fetchx(API_URL + `/getReservationForFrontDeskGroup?bookingID=${event.data.bookingID}`)
                        .then(result => result.json())
                        .then(resp => {
                            setMainModal(true)
                            setAssignRoomData(resp['data'][0])
                            localStorage.setItem('reservationStart', resp['data'][0]['arrivalDate']);
                            localStorage.setItem('reservationEnd', resp['data'][0]['departureDate']);
                            localStorage.setItem('reservationRoomType', resp['data'][0]['roomType']);
                        })
                }
                else if (buttonName === 'View Reg Card' && event.data.bookingID !== undefined) {
                    fetchx(API_URL + `/getReservationForFrontDeskGroup?bookingID=${event.data.bookingID}`)
                        .then(result => result.json())
                        .then(resp => {
                            setOpenRegCard(true)
                            setRegCardData(resp['data'][0])
                        })
                }
                else if (buttonName === 'Check In' && event.data.bookingID !== undefined) {
                    if (event.data.roomNumber == null) {
                        return handleError("Assign the room first")
                    }
                    if (event.data.reservationStatus == 'Checked In' || event.data.reservationStatus == 'Due Out') {
                        return handleError("Guest is already checked in")
                    }
                    fetchx(API_URL + `/getReservationForFrontDeskGroup?bookingID=${event.data.bookingID}`)
                        .then(result => result.json())
                        .then(resp => {
                            setOpenCheckInForm(true)
                            setCheckInData(resp['data'][0])
                            localStorage.setItem('reservationStart', resp['data'][0]['arrivalDate']);
                            localStorage.setItem('reservationEnd', resp['data'][0]['departureDate']);
                            localStorage.setItem('reservationRoomType', resp['data'][0]['roomType']);
                        })
                }
                else if (buttonName === 'Add Sharer' && event.data.bookingID !== undefined) {
                    fetchx(API_URL + `/getReservationForFrontDeskGroup?bookingID=${event.data.bookingID}`)
                        .then(result => result.json())
                        .then(resp => {
                            setSharerForm(true)
                            setSharerData(resp['data'][0])
                        })
                }
            } else {
                // console.log("Clicked element is not a button.");
            }
        } else {
            // console.log("Clicked cell information not available.");
        }
    }, []);


    // Confirm booking button action
    const confirmBooking2 = async (message) => {
        await MySwal.fire({
            title: 'Reservation Creation',
            text: 'Reservations will be created, please check after some minutes!!',
            icon: 'success',
        });
        setTimeout(() => { navigate('/dashboard/groupreservation/allgroupreservations') }, 1000);
    };


    // Create reservation via excel
    // const createReservationInBulk = (params) => {
    //     setOpen(true);
    //     // Start a timer to check if the response takes more than 5 seconds
    //     const timeout = setTimeout(() => {
    //         setShowSecondaryMessage(true);
    //     }, 5000);

    //     const groupData = JSON.stringify({
    //         reservationData: fileData,
    //         reservationID: reservationData.id
    //     })

    //     fetchx(API_URL + `/createReservationForGroupInBulk`, {
    //         method: "POST",
    //         headers: { 'Content-Type': 'application/json' },
    //         body: groupData
    //     })
    //         .then(result => result.json())
    //         .then(response => {
    //             if (response.statusCode === 403) {
    //                 return handleError(response['message'])
    //             }
    //             confirmBooking2(response['message'])
    //             setOpen(false);
    //             callDefiniteReservation()
    //         })
    // };
    const createReservationInBulk = () => {
        // setOpen1(true);
        let elapsedTime = 0;
        
        // Start a timer to check if the response takes more than 5 seconds
        const messageTimeout = setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);
    
        setIsUpdateWithRatesButton(true);
        const dataJson = JSON.stringify({
            groupID: reservationData.id
        });
    
        // Start elapsed time counter
        const timerInterval = setInterval(() => {
            elapsedTime += 1;
            // Update the SweetAlert message with current elapsed time
            const content = Swal.getHtmlContainer();
            if (content) {
                const timerElement = content.querySelector('#timer');
                if (timerElement) {
                    timerElement.textContent = elapsedTime;
                }
            }
        }, 1000);
    
        MySwal.fire({
            title: 'Reservation Creation under progress!!',
            html: `Please wait... Time elapsed: <span id="timer">0</span> seconds`,
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false
        });
    
        fetch(API_URL + "/createReservationFromStoredGroupData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: dataJson,
        })
            .then((res) => res.json())
            .then((data) => {
                clearInterval(timerInterval);
                clearTimeout(messageTimeout);
    
                if (data.statusCode === 403) {
                    setIsUpdateWithRatesButton(false);
                    handleError(data.message);
                    setOpen1(false);
                    return;
                }
    
                if (data.statusCode === 200) {
                    setIsUpdateWithRatesButton(false);
                    MySwal.fire({
                        title: `Reservation Creation successful for ${reservationData.groupName}!!`,
                        html: `Process completed!!`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                            })
                }
    
                // Refresh grid data with validated API response
                return fetch(API_URL + "/getGroupResCompletedData", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ groupReservationID: reservationData.id }),
                });
            })
            .then((res) => res?.json())
            .then((gridData) => {
                if (gridData) {
                    setTempData(gridData.data);
                    setFileName("");
                    setFileData([]);
                }
            })
            .catch((err) => {
                clearInterval(timerInterval);
                clearTimeout(messageTimeout);
                handleError(err.message);
                setOpen1(false);
            })
            .finally(() => {
                setOpen1(false);
                setShowSecondaryMessage(false);
            });
    };


    // Create individual reservation
    const createReservation = (params) => {
        // Validation checks
        if (params.data.bookingID !== undefined) {
            handleError('Already reservation got created !!');
            return;
        }
        if (!params.data.salutation) {
            handleError("Salutation is mandatory");
            return;
        }
        if (!params.data.firstName) {
            handleError("First name is mandatory");
            return;
        }
        if (!params.data.lastName) {
            handleError("Last name is mandatory");
            return;
        }


        // Prepare data for API call
        const rowData = params.data;
        const groupData = JSON.stringify({
            reservationData: rowData
        });

        // Make API call
        fetchx(API_URL + `/createReservationForGroup`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: groupData
        })
            .then(result => result.json())
            .then(response => {
                // Re-enable the button

                // Handle API response
                if (typeof response['data'] === 'string') {
                    handleError(response['data']);
                    return;
                }
                handleSuccess();
                confirmBooking(response['message']);
                callDefiniteReservation();
            })
            .catch(error => {
                // Re-enable the button if there's an error
                handleError(error.message); // Handle network errors or API failure
            });
    };


    // Reason for cancel
    const handleChange = (selectedOption) => {
        setValueReason(selectedOption.value);
        setLabelReason(selectedOption.label)
    };


    // Definite reservation function call 
    const callDefiniteReservation = () => {
        fetchx(API_URL + "/definiteGroupReservation", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reservationID: sessionStorage.getItem('groupReservationID') })
        })
            .then(result => result.json())
            .then(response => {
                if (response.statusCode === 200) {
                    setDefiniteData(response['data'])
                }
                else {
                    handleError('Something  went wrong! Please try again later.');
                }
            })
    }


    // Function to get data for inventory with room types
    const getLatestData = (reservationID) => {
        // Fetch data from the first API endpoint
        fetchx(API_URL + `/getCurrentInventory?reservationID=${reservationID}`)
            .then(result => result.json())
            .then(firstApiResponse => {
                if (!firstApiResponse || !Array.isArray(firstApiResponse.data)) {
                    console.error("Invalid response format from first API");
                    return;
                }

                // Fetch data from the second API endpoint
                fetchx(API_URL + "/getGroupReservationRoomTypes", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reservationID: reservationID })
                })
                    .then(result => result.json())
                    .then(secondApiResponse => {
                        if (!secondApiResponse || !Array.isArray(secondApiResponse.data)) {
                            console.error("Invalid response format from second API");
                            return;
                        }

                        // Create a map of roomTypeID to row data from the second API response
                        const roomTypeMap = {};
                        secondApiResponse.data.forEach(row => {
                            roomTypeMap[row.roomType] = row;
                        });

                        // Replace rows in the first API response with corresponding rows from the second API response
                        const updatedGridData = firstApiResponse.data.map(row => {
                            const matchingRow = roomTypeMap[row.roomTypeID];
                            if (matchingRow) {
                                // Add specified columns from the second API response to the corresponding row in the first API response
                                return { ...row, baseAmount: matchingRow.baseAmount, extraAdultPrice: matchingRow.extraAdultPrice, extraChildPrice: matchingRow.extraChildPrice, packageRate: matchingRow.packageRate, numberOfPickedRooms: matchingRow.numberOfPickedRooms };
                            }
                            return row;
                        });

                        setGridData(updatedGridData);
                    })
                    .catch(error => {
                        console.log("Error fetching from second API:", error);
                    });
            })
            .catch(error => {
                console.log("Error fetching from first API:", error);
            });
    }


    // On cell click get the data
    // const cellClickedListener = useCallback((event) => {
    //     fetchx(API_URL + "/getGroupReservationBasedOnID", {
    //         method: "POST",
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ reservationID: event.data.id })
    //     }).then(result => result.json())
    //         .then(rowData => {
    //             setReservationData(rowData["data"])
    //         })
    //     sessionStorage.setItem('groupReservationID', event.data.id);
    //     getLatestData(event.data.id)

    //     fetchx(API_URL + "/definiteGroupReservation", {
    //         method: "POST",
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ reservationID: sessionStorage.getItem('groupReservationID') })
    //     })
    //         .then(result => result.json())
    //         .then(response => {
    //             if (response.statusCode === 200) {
    //                 setDefiniteData(response['data'])
    //             }
    //             else {
    //                 handleError("Something  went wrong! please try again later")
    //             }
    //         })
    // }, []);

    const cellClickedListener = useCallback((event) => {
        setfilldata(event.data)

        fetchx(API_URL + "/getGroupReservationBasedOnID", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reservationID: event.data.id })
        }).then(result => result.json())
            .then(rowData => {
                setReservationData(rowData["data"])
            })
        sessionStorage.setItem('groupReservationID', event.data.id);
        getLatestData(event.data.id)
        setSelectedReservationID(event.data.id)

        fetchx(API_URL + "/definiteGroupReservation", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reservationID: sessionStorage.getItem('groupReservationID') })
        })
            .then(result => result.json())
            .then(response => {
                if (response.statusCode === 200) {
                    setDefiniteData(response['data'])
                }
                else {
                    handleError("Something  went wrong! please try again later")
                }
            })
    }, []);


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


    // On cell click data
    const handleCellEdit = (event) => {
        const { data } = event;
        let newCount = Number(event.newValue);

        if (event.colDef.field === "numberOfPickedRooms") {
            fetchx(API_URL + "/getReservationCountFromRoomType", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reservationID: sessionStorage.getItem('groupReservationID'), roomType: data.roomTypeID, selectedRooms: newCount })
            })
                .then(result => result.json())
                .then(response => {
                    if (response.statusCode === 200 && response.data.flag === 0) {
                        handleError(response['data']['Comment'])
                    }
                    else if (response.statusCode === 200 && response.data.flag === 1) {
                        if (editedRows.has(data)) {
                            setEditedRows(prevState => {
                                const updatedRows = new Set(prevState);
                                updatedRows.delete(data);
                                updatedRows.add(data);
                                return updatedRows;
                            });
                        } else {
                            setEditedRows(prevState => new Set(prevState.add(data)));
                        }

                    }
                    else {
                        handleError('Something went wrong!');
                    }
                });
        } else {
            if (editedRows.has(data)) {
                setEditedRows(prevState => {
                    const updatedRows = new Set(prevState);
                    updatedRows.delete(data);
                    updatedRows.add(data);
                    return updatedRows;
                });
            } else {
                setEditedRows(prevState => new Set(prevState.add(data)));
            }
        }
    };


    //Success card
    const handleSuccess = async (message) => {
        await MySwal.fire({
            title: 'Tentative Booking',
            text: `Successfully converted reservation into tentative. By doing this, you have blocked the rooms.`,
            icon: 'success',
        });
        setTimeout(() => { }, 1000);
    };


    //Success card
    const handleSuccessSave = async (message) => {
        await MySwal.fire({
            title: 'Room Blocking',
            text: `Successfully blocked the rooms`,
            icon: 'success',
        });
        setTimeout(() => { }, 1000);
    };


    //Success card
    const handleSuccessOfCancel = async (message) => {
        await MySwal.fire({
            title: 'Cancel Booking',
            text: `Successfully cancelled reservation`,
            icon: 'success',
        });
        setTimeout(() => { navigate('/dashboard/groupreservation/allgroupreservations') }, 500);
    };


    // Success card for definite reservation
    const handleSuccessDefinite = async (message) => {
        await MySwal.fire({
            title: 'Definite Booking',
            text: message,
            icon: 'success',
        });
        setTimeout(() => { navigate('/dashboard/groupreservation/allgroupreservations') }, 500);
    }


    // Success card for definite reservation
    const handleSuccessTentative = async (message) => {
        await MySwal.fire({
            title: 'Tentative Booking',
            text: message,
            icon: 'success',
        });
        setTimeout(() => { navigate('/dashboard/groupreservation/allgroupreservations') }, 500);
    }


    // Success card for definite reservation
    const handleSuccessAssignRoom = async (message) => {
        await MySwal.fire({
            title: 'Room Asisgnment',
            text: message,
            icon: 'success',
        });
        setTimeout(() => { navigate('/dashboard/groupreservation/allgroupreservations') }, 500);
    }


    // Confirm booking button action
    const confirmBooking = async (message) => {
        await MySwal.fire({
            title: 'Reservation Creation',
            text: message,
            icon: 'success',
        });
        setTimeout(() => { }, 1000);
    };


    // Storing data for tentative to definite
    const handleSubmit1 = (row) => {


        if ((row.numberOfPickedRooms === undefined) || (row.baseAmount === undefined) || (row.extraAdultPrice === undefined) || (row.extraChildPrice === undefined) || (row.packageRate === undefined)) {
            handleError('Please edit all columns in each row before submitting.');
        }


        else {
            fetchx(API_URL + "/getReservationCountFromRoomType", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reservationID: sessionStorage.getItem('groupReservationID'), roomType: row.roomTypeID, selectedRooms: Number(row.numberOfPickedRooms) })
            })
                .then(result => result.json())
                .then(response => {
                    if (response.statusCode === 200 && response.data.flag === 0) {
                        handleError(response['data']['Comment'])
                    }
                    else if (response.statusCode === 200 && response.data.flag === 1) {
                        const editedData = row;
                        const groupData = JSON.stringify({
                            reservationID: sessionStorage.getItem('groupReservationID'),
                            jsonData: editedData
                        })
                        MySwal.fire({
                            title: "Confirmation Required",
                            text: response['data']['Comment'], // Display message from response
                            icon: "question",
                            buttonsStyling: false,
                            showCancelButton: true,
                            confirmButtonText: "Yes, Continue",
                            cancelButtonText: "No",
                            reverseButtons: true,
                            allowOutsideClick: false,
                            customClass: {
                                confirmButton: 'btn btn-primary ms-1',
                                cancelButton: 'btn btn-outline-danger ms-1'
                            },
                        }).then((result) => {
                            if (result.isConfirmed) {
                                fetchx(API_URL + "/storeRoomTypeWiseDataForGR", {
                                    method: "POST",
                                    headers: { 'Content-Type': 'application/json' },
                                    body: groupData
                                }).then(result => result.json())
                                    .then(resp => {
                                        handleSuccessSave("Success")
                                        getLatestData(sessionStorage.getItem('groupReservationID'))
                                        fetchx(API_URL + "/getGroupReservationBasedOnID", {
                                            method: "POST",
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ reservationID: sessionStorage.getItem('groupReservationID') })
                                        }).then(result => result.json())
                                            .then(rowData => {
                                                setReservationData(rowData["data"])
                                            })
                                        fetchx(API_URL + "/getAllGroupReservations")
                                            .then((result) => result.json())
                                            .then((rowData) => {
                                                setRowData(rowData["data"]);
                                            });
                                    }).catch((error) => {
                                        console.log(error);
                                    });
                            }
                        });
                    }
                    else {
                        handleError('Something went wrong!');
                    }
                });
        }
    };


    // Storing data for tentative to definite
    const handleSubmit2 = (row) => {

        if((Number(row.numberOfPickedRooms) > 0 || (Number(row.numberOfPickedRooms) < 0))){
            return handleError('This is not allowed');

        }

        if ((row.numberOfPickedRooms === undefined) || (row.baseAmount === undefined) || (row.extraAdultPrice === undefined) || (row.extraChildPrice === undefined) || (row.packageRate === undefined)) {
            return handleError('Without data, it is not allowed');
        }


        else {
            fetchx(API_URL + "/getReservationCountFromRoomType", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reservationID: sessionStorage.getItem('groupReservationID'), roomType: row.roomTypeID, selectedRooms: 0 })
            })
                .then(result => result.json())
                .then(response => {
                    if (response.statusCode === 200 && response.data.flag === 0) {
                        handleError(response['data']['Comment'])
                    }
                    else if (response.statusCode === 200 && response.data.flag === 1) {
                        row.numberOfPickedRooms = 0;
                        const editedData = row;
                        const groupData = JSON.stringify({
                            reservationID: sessionStorage.getItem('groupReservationID'),
                            jsonData: editedData
                        })
                        MySwal.fire({
                            title: "Confirmation Required",
                            text: "By doing this, blocked rooms will be released. Are you sure?", // Display message from response
                            icon: "question",
                            buttonsStyling: false,
                            showCancelButton: true,
                            confirmButtonText: "Yes, Continue",
                            cancelButtonText: "No",
                            reverseButtons: true,
                            allowOutsideClick: false,
                            customClass: {
                                confirmButton: 'btn btn-primary ms-1',
                                cancelButton: 'btn btn-outline-danger ms-1'
                            },
                        }).then((result) => {
                            if (result.isConfirmed) {
                                fetchx(API_URL + "/storeRoomTypeWiseDataForGR", {
                                    method: "POST",
                                    headers: { 'Content-Type': 'application/json' },
                                    body: groupData
                                }).then(result => result.json())
                                    .then(resp => {
                                        handleSuccessSave("Success")
                                        getLatestData(sessionStorage.getItem('groupReservationID'))
                                        fetchx(API_URL + "/getGroupReservationBasedOnID", {
                                            method: "POST",
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ reservationID: sessionStorage.getItem('groupReservationID') })
                                        }).then(result => result.json())
                                            .then(rowData => {
                                                setReservationData(rowData["data"])
                                            })
                                        fetchx(API_URL + "/getAllGroupReservations")
                                            .then((result) => result.json())
                                            .then((rowData) => {
                                                setRowData(rowData["data"]);
                                            });
                                    }).catch((error) => {
                                        console.log(error);
                                    });
                            }
                        });
                    }
                    else {
                        handleError('Something went wrong!');
                    }
                });
        }
    };


    // Modal for definite reservation conversion
    const convertToDefinite = () => {


        if (reservationData['status'] === 'Enquiry') {
            return handleError("You cannot convert enquiry to definite, first convert into tentative !!")
        }
        else if (reservationData['status'] === 'Definite') {
            return handleError("Already converted to definite !!")
        }
        else if (reservationData['status'] === 'Cancelled') {
            return handleError("This Operation is not allowed !!")
        }
        MySwal.fire({
            title: "Confirmation Required",
            text: "You are converting group reservation status into Definite, do you want to continue?", // Display message from response
            icon: "question",
            buttonsStyling: false,
            showCancelButton: true,
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "No",
            reverseButtons: true,
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'btn btn-primary ms-1',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const groupData = JSON.stringify({
                    reservationID: sessionStorage.getItem('groupReservationID'),
                    status: 'Definite'
                })
                fetchx(API_URL + "/updateGroupReservationStatus", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: groupData
                }).then(result => result.json())
                    .then(resp => {
                        handleSuccessDefinite(resp['message'])
                        fetchx(API_URL + "/getAllGroupReservations")
                            .then((result) => result.json())
                            .then((rowData) => {
                                setRowData(rowData["data"]);
                            });
                    }).catch((error) => {
                        handleError(error);
                    });
            }
        });
    }


    // Modal for tentative reservation conversion
    const convertToTentative = () => {
        if (reservationData['status'] === 'Tentative') {
            return handleError("Already converted to Tentative !!")
        }
        else if (reservationData['status'] === 'Cancelled') {
            return handleError("This Operation is not allowed !!")
        }
        else {
            const groupData = JSON.stringify({
                reservationID: sessionStorage.getItem('groupReservationID'),
                status: 'Tentative'
            })
            fetchx(API_URL + "/confirmationForTentative", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: groupData
            }).then(result => result.json())
                .then(resp => {
                    if (resp.statusCode === 403) {
                        return handleError(resp['data']);
                    }
                    MySwal.fire({
                        title: "Confirmation Required",
                        text: resp['data'], // Display message from response
                        icon: "question",
                        buttonsStyling: false,
                        showCancelButton: true,
                        confirmButtonText: "Yes, Continue",
                        cancelButtonText: "No",
                        reverseButtons: true,
                        allowOutsideClick: false,
                        customClass: {
                            confirmButton: 'btn btn-primary ms-1',
                            cancelButton: 'btn btn-outline-danger ms-1'
                        },
                    }).then((result) => {
                        if (result.isConfirmed) {
                            fetchx(API_URL + "/updateStatusToTentative", {
                                method: "POST",
                                headers: { 'Content-Type': 'application/json' },
                                body: groupData
                            }).then(result => result.json())
                                .then(resp => {
                                    handleSuccessTentative(resp['message'])
                                    fetchx(API_URL + "/getAllGroupReservations")
                                        .then((result) => result.json())
                                        .then((rowData) => {
                                            setRowData(rowData["data"]);
                                        });
                                }).catch((error) => {
                                    handleError(error);
                                });
                        }
                    })
                })
        }
    }


    // Function handling for rooming list
    const roomingList = () => {
        if (reservationData.status === 'Cancelled') {
            return handleError("This operation is not allowed")
        }
        setDefiniteOptions(true)
        callDefiniteReservation()
    }


    // Function handling for rooming list
    const roomingListActions = () => {
        setDefiniteOptionsActions(true)
    }


    // Function handling for dates modification
    const datesModify = () => {
        if (reservationData.status === 'Cancelled') {
            return handleError("This operation is not allowed")
        }
        setDatesModification(!datesModification)
    }


    // Function handling for dates modification
    const advancePost = () => {
        if (reservationData.status === 'Cancelled') {
            return handleError("This operation is not allowed")
        }
        setOpenAdvancePost(!openAdvancePost)
    }


    // Function handling for room type modification
    const roomTypeModify = () => {
        if (reservationData.status === 'Cancelled') {
            return handleError("This operation is not allowed")
        }
        getLatestData(sessionStorage.getItem('groupReservationID'))
        setRoomCountChange(!roomCountChange)
    }


    // Function handling booking info modifcation
    const bookingInfoModify = () => {
        if (reservationData.status === 'Cancelled') {
            return handleError("This operation is not allowed")
        }
        setBookingInfoMod(!bookingInfoMod)
    }


    // Function handling payment type modifcation
    const paymentTypeModification = () => {
        if (reservationData.status === 'Cancelled') {
            return handleError("This operation is not allowed")
        }
        setPaymentTypeMod(!paymentTypeMod)
    }


    // Function handling for rooming list
    const cancelBookingModal = () => {
        if (reservationData.status === 'Cancelled') {
            return handleError("This operation is not allowed")
        }
        setCancelBooking(!cancelBooking)
    }


    // Function handling for number of rooms modify
    const numberOfRoomsModify = () => {
        if (reservationData.status === 'Cancelled') {
            return handleError("This operation is not allowed")
        }
        setNumberOfRooms(!numberOfRooms)
    }


    // Row style for cancel bookings
    const getRowStyle = params => {
        if (params.data && params.data.status === 'Cancelled') {
            return { background: '#3598db' };
        }
        return null;
    };


    // Function for cancelling booking 
    const openCancelModal = () => {
        let cancelJson = JSON.stringify({
            reason: valueReason,
            reasonText: document.getElementById('reasonText').value,
            reservationID: reservationData.id,
            reasonName: labelReason
        })
        MySwal.fire({
            title: "Confirmation Required",
            text: "You are cancelling the group booking, this will clear all the blocking rooms if any. Do you want to continue ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "No",
            reverseButtons: true,
            customClass: {
                confirmButton: 'btn btn-primary ms-1',
                cancelButton: 'btn btn-outline-danger ms-1'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setOpen1(true);
                fetchx(API_URL + "/cancelGroupReservation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: cancelJson,
                }).then(data => data.json())
                    .then((res) => {
                        if (typeof res['data'] === 'string') {
                            handleError(res['data'])
                            setOpen1(false);
                        }
                        else {
                            handleSuccessOfCancel()
                            setOpen1(false);
                        }
                    })
            }
        })
    }

    // Function to show group revenue
    const openGroupRevenue = () => {
        setGroupRevenue(true)
        let dataJson = JSON.stringify({
            reservationID: reservationData.id,
        })
        fetchx(API_URL + "/getGroupRevenueDetails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: dataJson,
        }).then(data => data.json())
            .then((data) => {
                setGroupRevenueData(data['data']);
            })
    }


    // Search box
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById("filter-text-box").value
        );
    }, []);


    // Assign room modal close
    function toggleModal() {
        setMainModal(!mainModal)
    }


    // Checkin modal close
    function toggleModal2() {
        setOpenCheckInForm(!openCheckInForm)
    }


    // Modal opening file
    function toggleModalSharer() {
        setSharerForm(!sharerForm)
    }


    // Modal toggle function for rooming list opening
    function uploadRoomingList() {
        setUploadForm(true)
    }


    // File upload option for reservation creation.
    // const handleFileUpload = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             const data = new Uint8Array(e.target.result);
    //             const workbook = XLSX.read(data, { type: 'array' });
    //             const sheetName = workbook.SheetNames[0];
    //             const worksheet = workbook.Sheets[sheetName];
    //             const jsonData = XLSX.utils.sheet_to_json(worksheet);

    //             const requiredColumns = ["First_Name", "Last_Name", "Salutation", "Room_Type"];
    //             const invalidRows = jsonData.filter((row) => {
    //                 return requiredColumns.some(column => !row[column]);
    //             });

    //             if (invalidRows.length > 0) {
    //                 setFileName()
    //                 handleError("The uploaded file contains rows with missing required data. Please check and try again.");
    //                 setFileData([]);
    //             } else {
    //                 let dataJson = JSON.stringify({
    //                     reservationID: reservationData.id,
    //                     jsonData: jsonData
    //                 })
    //                 fetchx(API_URL + "/checkAvailableRoomTypeCount", {
    //                     method: "POST",
    //                     headers: { "Content-Type": "application/json" },
    //                     body: dataJson,
    //                 }).then(data => data.json())
    //                     .then((data) => {
    //                         if (data.statusCode == 403) {
    //                             return handleError(data.message)
    //                         }
    //                         setOpenGridData(true)
    //                         setFileName(file.name)
    //                         setFileData(jsonData);
    //                     })
    //             }
    //         };
    //         reader.readAsArrayBuffer(file);
    //     }
    //     event.target.value = null;
    // };
       
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // Helper function to convert Excel serial date to JavaScript date
                const excelSerialToDate = (serial) => {
                    const excelEpoch = new Date(1899, 11, 30); // Excel base date
                    return new Date(excelEpoch.getTime() + (serial + 1) * 24 * 60 * 60 * 1000);
                };

                // Convert Arrival_date and Departure_date if they are in numeric format
                jsonData.forEach((row) => {
                    if (typeof row.Arrival_date === "number") {
                        console.log("Arrival_date", row.Arrival_date)
                        row.Arrival_date = excelSerialToDate(row.Arrival_date).toISOString().split("T")[0];
                        console.log("Arrival_date", row.Arrival_date)
                    }
                    if (typeof row.Departure_date === "number") {
                        console.log("Departure_date", row.Departure_date)
                        row.Departure_date = excelSerialToDate(row.Departure_date).toISOString().split("T")[0];
                        console.log("Departure_date", row.Departure_date)
                    }
                });

                // Validate required columns
                const requiredColumns = [
                    "Room_Type",
                    "Arrival_date",
                    "Departure_date",
                    "Number_Of_Adults",
                    "Salutation",
                    "First_Name",
                    "Last_Name"
                ];
                const invalidRows = jsonData.filter((row) =>
                    requiredColumns.some((column) => !row[column])
                );

                if (invalidRows.length > 0) {
                    setFileName("");
                    setFileData([]);
                    handleError("Uploaded file contains rows with missing required data.");

                    return;
                }

                // Set valid file and data
                setFileName(file.name);
                setFileData(jsonData);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleValidateAndFetchGridData = (jsonData) => {
        if (tempData && tempData.length > 0) {
            // setOpen1(true);
            // Start a timer to check if the response takes more than 5 seconds
            const timeout = setTimeout(() => {
                setShowSecondaryMessage(true);
            }, 5000);
            // Show confirmation modal
            MySwal.fire({
                title: "It will overwrite the existing data. Do you wish to continue?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                buttonsStyling: true,
                customClass: {
                    confirmButton: "btn btn-success me-3", // Add margin to the "Yes" button
                    cancelButton: "btn btn-danger",
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    // If "Yes" is clicked, proceed
                    setOpen1(true)
                    validateAndFetchGridData(jsonData);
                } else {
                    // If "No" is clicked, do nothing
                    MySwal.close();
                }
            });
        } else {
            // setOpen1(true);

            // No existing data, proceed directly
            setOpen1(true)

            validateAndFetchGridData(jsonData);
        }
    };

    const validateAndFetchGridData = (jsonData) => {
        // setOpen1(true);
        // Start a timer to check if the response takes more than 5 seconds
        const timeout = setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);
        const dataJson = JSON.stringify({
            reservationID: reservationData.id,
            jsonData: jsonData,
        });

        fetch(API_URL + "/validateGuestUploadThroughExcel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: dataJson,
        })
            .then((res) => {
                if (!res.ok) {
                    setOpen1(false)

                    return res.json().then((errorData) => {
                        throw new Error(errorData.message || 'An error occurred during validation');
                    });
                }
                return res.json();
            })
            .then((data) => {
                if (data.statusCode === 403) {
                    handleError(data.message);

                    // Clear attachment field
                    setFileName("");
                    setOpen1(false);

                    if (fileInputRef.current) {
                        fileInputRef.current.value = ""; // Reset file input
                    }
                    setFileData([]);
                    return;
                }
                if (data.statusCode === 200) {
                    setOpen1(false);

                }

                // Success flow
                return fetch(API_URL + "/getGroupResData", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ groupReservationID: reservationData.id }),
                })
                    .then((res) => res.json())
                    .then((gridData) => {
                        MySwal.fire({
                            title: 'Guest Details uploaded Successfully',
                            icon: 'success',
                        });

                        // Update tempData
                        setTempData(gridData.data);

                        // Clear attachment field
                        setFileName("");
                        if (fileInputRef.current) {
                            console.log("File input ref exists:", fileInputRef.current);
                            fileInputRef.current.value = ""; // Reset the file input
                        } else {
                            console.error("File input ref is not attached");
                        }

                        setFileData([]);
                        if (data.statusCode === 200) {
                            // setOpen1(false);

                        }
                    });
            })
            .catch((err) => {
                handleError(err.message);

                // Clear attachment field
                setFileName("");
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Reset file input
                }
                setFileData([]);

                // setOpen1(false);


            });
    };


    // File upload option for room number assignment
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                const requiredColumns = ["room"];
                const invalidRows = jsonData.filter((row) => {
                    return requiredColumns.some(column => !row[column]);
                });

                if (invalidRows.length > 0) {
                    setFileNameList();
                    handleError("The uploaded file contains rows with missing required data. Please check and try again.");
                    setFileData([]);
                    return;
                }
                else {
                    // Check for duplicate rooms
                    const roomSet = new Set();
                    const duplicateRooms = jsonData.filter((row) => {
                        if (roomSet.has(row.room)) {
                            return true;
                        } else {
                            roomSet.add(row.room);
                            return false;
                        }
                    });

                    if (duplicateRooms.length > 0) {
                        setFileNameList();
                        handleError("The uploaded file contains duplicate room values. Please check and try again.");
                        setFileData([]);
                        return;
                    } else {
                        let dataJson = JSON.stringify({
                            reservationID: reservationData.id,
                            jsonData: jsonData
                        })
                        fetchx(API_URL + "/checkAssignRoomRoomingList", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: dataJson,
                        }).then(data => data.json())
                            .then((data) => {
                                if (typeof data.data === 'string') {
                                    return handleError(data.data)
                                }
                                setGridOpenForm(true)
                                setFileNameList(file.name);
                                setDefiniteReservation(jsonData);
                            })
                    }
                }
            };
            reader.readAsArrayBuffer(file);
        }
        event.target.value = null;
    };


    // Download excel of rooming list
    function DownloadRoomingList() {
        let dataJson = JSON.stringify({
            reservationID: reservationData.id,
        })
        fetchx(API_URL + "/getGroupReservationFromGroup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: dataJson,
        }).then(data => data.json())
            .then((data) => {
                if (data.statusCode == 403) {
                    return handleError(data.message)
                }
                if (data.data.length == 0) {
                    return handleError("Either room is assigned to all the reservations created or no reservations are created to assign the room.")
                }
                generateExcelAndDownload(data.data);
            })
    };


    // Download excel of rooming list
    // function DownloadSampleExcel() {

    //     fetchx(API_URL + "/definiteGroupReservation", {
    //         method: "POST",
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ reservationID: reservationData.id })
    //     })
    //         .then(result => result.json())
    //         .then(response => {
    //             if (response.statusCode === 200) {
    //                 const filteredData = response.data.filter(item => !item.bookingID);
    //                 console.log(filteredData)
    //                 if (filteredData.length == 0) {
    //                     return handleError("Either all the reservations are created using rooming list or no rooms are blocked in tentative yet.")
    //                 }
    //                 // Transform data to only include the required fields
    //                 const transformedData = filteredData.map(item => ({
    //                     Room_Type: item.roomTypeName,
    //                     Salutation: item.salutation,
    //                     First_Name: item.firstName,
    //                     Last_Name: item.lastName,
    //                     Email_ID: "",
    //                     Phone_Number: ""
    //                 }));
    //                 generateExcelAndDownload1(transformedData);
    //             }
    //             else {
    //                 handleError('Something  went wrong! Please try again later.');
    //             }
    //         })
    // };

    async function DownloadSampleExcel() {
        // Create a new workbook using ExcelJS
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('Reservations');
    
        // Define columns and add the data
        worksheet.columns = [
            { header: 'Room_Type', key: 'Room_Type', width: 10 },
            { header: 'Salutation', key: 'Salutation', width: 10 },
            { header: 'First_Name', key: 'First_Name', width: 15 },
            { header: 'Last_Name', key: 'Last_Name', width: 15 },
            { header: 'Email_ID', key: 'Email_ID', width: 25 },
            { header: 'Phone_Number', key: 'Phone_Number', width: 15 },
            { header: 'Salutation_Sharer1', key: 'Salutation', width: 10 },
            { header: 'First_Name_Sharer1', key: 'First_Name', width: 15 },
            { header: 'Last_Name_Sharer1', key: 'Last_Name', width: 15 },
            { header: 'Email_ID_Sharer1', key: 'Email_ID', width: 25 },
            { header: 'Phone_Number_Sharer1', key: 'Phone_Number', width: 15 },
            { header: 'Salutation_Sharer2', key: 'Salutation', width: 10 },
            { header: 'First_Name_Sharer2', key: 'First_Name', width: 15 },
            { header: 'Last_Name_Sharer2', key: 'Last_Name', width: 15 },
            { header: 'Email_ID_Sharer2', key: 'Email_ID', width: 25 },
            { header: 'Phone_Number_Sharer2', key: 'Phone_Number', width: 15 }
        ];
    
        // Protect the worksheet
        worksheet.protect('password', {
            selectLockedCells: true,
            selectUnlockedCells: true
        });
    
        // Lock cells without headers
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, colNumber) => {
                const columnHeader = worksheet.getColumn(colNumber).header;
                cell.protection = {
                    locked: !columnHeader // Lock if no header
                };
            });
        });
    
        // Create a binary string representation of the workbook
        let buffer = await workbook.xlsx.writeBuffer();
    
        // Create a Blob from the binary string
        let blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    
        // Create a link element and trigger a download
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Sample_Rooming_List.xlsx";
        document.body.appendChild(link);
        link.click();
    
        // Clean up and remove the link
        document.body.removeChild(link);
    }


    // Supporting function which helps to form excel to download rooming list
    async function generateExcelAndDownload(data) {
        // Create a new workbook using ExcelJS
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('Reservations');

        // Define columns and add the data
        worksheet.columns = [
            { header: 'bookingID', key: 'bookingID', width: 10 },
            { header: 'Arrival Date', key: 'arrivalDate', width: 10 },
            { header: 'Departure Date', key: 'departureDate', width: 10 },
            { header: 'salutation', key: 'salutation', width: 10 },
            { header: 'firstName', key: 'firstName', width: 15 },
            { header: 'lastName', key: 'lastName', width: 15 },
            { header: 'reservationStatus', key: 'reservationStatus', width: 25 },
            { header: 'groupName', key: 'groupName', width: 15 },
            { header: 'roomType', key: 'roomType', width: 15 },
            { header: 'room', key: 'room', width: 15 },
        ];


        worksheet.addRows(data);

        // Protect the worksheet
        worksheet.protect('password', {
            selectLockedCells: true,
            selectUnlockedCells: true
        });

        // Lock all cells
        worksheet.columns.forEach(column => {
            column.eachCell(cell => {
                cell.protection = {
                    locked: true
                };
            });
        });

        // Ensure the "Room_Type" column is locked (not editable)
        worksheet.getColumn('room').eachCell(cell => {
            cell.protection = {
                locked: false
            };
        });

        // Step 4: Create the final Excel file from ExcelJS
        let buffer = await workbook.xlsx.writeBuffer();

        // Step 5: Create a Blob and trigger the download
        let blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Rooming_List.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    // Function to generate excel for sample rooming list
    async function generateExcelAndDownload1(data) {
        // Create a new workbook using ExcelJS
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('Reservations');

        // Define columns and add the data
        worksheet.columns = [
            { header: 'Room_Type', key: 'Room_Type', width: 10 },
            { header: 'Salutation', key: 'Salutation', width: 10 },
            { header: 'First_Name', key: 'First_Name', width: 15 },
            { header: 'Last_Name', key: 'Last_Name', width: 15 },
            { header: 'Email_ID', key: 'Email_ID', width: 25 },
            { header: 'Phone_Number', key: 'Phone_Number', width: 15 }
        ];

        worksheet.addRows(data);

        // Protect the worksheet
        worksheet.protect('password', {
            selectLockedCells: true,
            selectUnlockedCells: true
        });

        // Lock all cells
        worksheet.columns.forEach(column => {
            column.eachCell(cell => {
                cell.protection = {
                    locked: false
                };
            });
        });

        // Ensure the "Room_Type" column is locked (not editable)
        worksheet.getColumn('Room_Type').eachCell(cell => {
            cell.protection = {
                locked: true
            };
        });

        // Create a binary string representation of the workbook
        let buffer = await workbook.xlsx.writeBuffer();

        // Create a Blob from the binary string
        let blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        // Create a link element and trigger a download
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Sample_Rooming_List.xlsx";
        document.body.appendChild(link);
        link.click();

        // Clean up and remove the link
        document.body.removeChild(link);
    }


    // Final file upload save for rooming list room number assign
    function AssignRoomOnRoomingListUpload() {
        let dataJson = JSON.stringify({
            reservationID: reservationData.id,
            jsonData: definiteReservationData
        })
        MySwal.fire({
            title: "Confirmation Required",
            text: "By doing this, provided rooms will be assigned to respective reservations. Are you sure?",
            icon: "question",
            buttonsStyling: false,
            showCancelButton: true,
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "No",
            reverseButtons: true,
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'btn btn-primary ms-1',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                fetchx(API_URL + "/updateReservationDetailsOnRoomingListUpload", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: dataJson
                }).then(result => result.json())
                    .then(resp => {
                        handleSuccessAssignRoom(resp['message'])
                    }).catch((error) => {
                        handleError(error);
                    });
            }
        })
    }

    const [latestInventory, setLatestInventory] = useState();
    const [options3, setOptions3] = useState();
    const [options2, setOptions2] = useState();
    const [arrivalDate, setArrivalDate] = useState();
    const [departureDate, setDepartureDate] = useState()


    const checkIn1 = watch('incomeDate')


    //Flatpickr condition for Arrival date
    const options1 = {
        minDate: arrivalDate
    }


    //Flatpickr condition for departure date
    const optionsToDate1 = {
        minDate: (checkIn1 === null ? arrivalDate : (Moment(String(new Date(checkIn1))).format('YYYY-MM-DD'))) // Set the minimum date as fromDate or today if fromDate is not selected
    };

    const getCurrentInventory = data => {
        let arrivalDate = (Moment(String(new Date(data.incomeDate))).format('YYYY-MM-DD'))
        let departureDate = (Moment(String(new Date(data.outGoData))).format('YYYY-MM-DD'))
        fetchx(API_URL + `/getLatestInventory?arrivalDate=${arrivalDate}&departureDate=${departureDate}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            // body: availabilityCheck
        }).then((res) => res.json())
            .then(postres => {
                setLatestInventory(postres['data'])
            })
    }


    // Default dates setting based on business date
    useEffect(() => {
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

    return (
        <div>

            <div>
                <Col md="2" sm="12" className="mb-1">
                    <Label className="form-label" for="fullName">
                        Search
                    </Label>
                    <Input
                        type="text"
                        id="filter-text-box"
                        placeholder="Filter..."
                        onInput={onFilterTextBoxChanged}
                    />
                </Col>
            </div>


            {/* Main modal with all reservation data */}
            <div className="ag-theme-alpine" style={{ height: 520 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    animateRows={true}
                    getRowStyle={getRowStyle}
                    rowSelection="multiple"
                    onCellClicked={cellClickedListener}
                    paginationPageSize="10"
                    pagination="true"
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"
                />
            </div>


            {/* Tentative room type list */}
            <div>
                {reservationData && <Modal isOpen={options} toggle={() => setOptions(!options)} className="modal-xl">
                    <ModalHeader className="modal-lg" toggle={() => { setOptions(!options) }}>
                        Convert enquiry into tentative
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <br></br>
                        <p><b>Note:- Click on cells to enter the data and don't forget to save the before going to next row.</b></p>
                        <p>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Row>
                                <Col md='3' sm='12'>
                                    <b>Group Name</b> :- {reservationData['groupName']} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Arrival Date</b> :- {reservationData['arrivalDate']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Departure Date</b> :- {reservationData['departureDate']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Cut Off Date</b> :- {reservationData['cutOfDate']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                            </Row>
                        </p>
                        <p>
                            <Row>
                                <Col md='3' sm='12'>
                                    <b>Number of rooms booked</b> :- {reservationData['totalRooms']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Number of rooms Picked</b> :- {reservationData['picked_rooms']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Number of rooms Remaining</b> :- {reservationData['totalRooms'] - reservationData['picked_rooms']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    {gridData.length && <b> Total Available Rooms: {gridData[0].total_min_availability}</b>}
                                </Col>
                            </Row>
                        </p>
                        <div className="ag-theme-alpine" style={{ height: 400 }}>
                            <AgGridReact
                                ref={gridRef}
                                rowData={gridData}
                                columnDefs={columnDefs2}
                                animateRows={true}
                                rowSelection="multiple"
                                onCellEditingStopped={handleCellEdit}
                                paginationPageSize={10}
                                singleClickEdit={true}
                                pagination={true}
                                defaultColDef={defaultColDef}
                                headerColor="ddw-primary"
                            />
                        </div>
                        <br></br>
                        <div align='end'>
                            <Button outline className='me-1' color='secondary' onClick={() => setOptions(!options)}> Close</Button>
                            <Button color='primary' className='me-1' onClick={convertToTentative}>Convert to Tentative</Button>
                        </div>
                    </ModalBody>
                </Modal>}
            </div>


            {/* Assign room modal */}
            <div>
                {assignRoomData && <Modal isOpen={mainModal} toggle={() => setMainModal(!mainModal)} className="modal-xl">
                    <ModalHeader className="modal-xl" toggle={() => { setMainModal(!mainModal) }}>
                        Assign Room
                        {/* Convert enquiry into tentative */}
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <AssignRoomModal data1={assignRoomData} toggleModal2={toggleModal} reservationID={callDefiniteReservation} />
                    </ModalBody>
                </Modal>}
            </div>


            {/* reg card modal */}
            <div>
                {regCardData && <Modal isOpen={openRegCard} toggle={() => setOpenRegCard(!openRegCard)} className="modal-xl">
                    <ModalHeader className="modal-xl" toggle={() => { setOpenRegCard(!openRegCard) }}>
                        {/* Convert enquiry into tentative */}
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <Row>
                            <Col sm={6}>
                                <RegistrationCard data1={regCardData} />
                            </Col>
                            <Col sm={6}>
                                <PreviewActionsRegCard data1={regCardData} />
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>}
            </div>


            {/* Check in modal */}
            <div>
                {checkInData && <Modal isOpen={openCheckInForm} toggle={() => setOpenCheckInForm(!openCheckInForm)} className="modal-xl">
                    <ModalHeader className="modal-xl" toggle={() => { setOpenCheckInForm(!openCheckInForm) }}>
                        {/* Convert enquiry into tentative */}
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <CheckIn data1={checkInData} toggleModal3={toggleModal2} reservationID={callDefiniteReservation} />
                    </ModalBody>
                </Modal>}
            </div>


            {/* Sharer modal */}
            <div>
                {sharerData && <Modal isOpen={sharerForm} toggle={() => setSharerForm(!sharerForm)} className="modal-xl">
                    <ModalHeader className="modal-xl" toggle={() => { setSharerForm(!sharerForm) }}>
                        {/* Convert enquiry into tentative */}
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <SharerCreate data1={sharerData} toggleModal3={toggleModalSharer} reservationID={callDefiniteReservation} />
                    </ModalBody>
                </Modal>}
            </div>


            {/* Check availability between dates */}
            <Modal isOpen={options2} toggle={() => setOptions2(!options2)} className="modal-lg">
                <ModalHeader toggle={() => setOptions2(!options2)} className="modal-lg">
                    Availability check
                </ModalHeader>
                <ModalBody className="modal-lg">
                    <Card>
                        <CardBody>
                            <Form onSubmit={handleSubmit(getCurrentInventory)}>
                                <br></br>
                                <Row>
                                    {
                                        arrivalDate !== undefined &&
                                        <Col md='4' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='incomeDate'>
                                                    Arrival Date <spam style={{ color: 'red' }}>*</spam>
                                                </Label>
                                                <Controller
                                                    control={control}
                                                    id='incomeDate'
                                                    name='incomeDate'
                                                    defaultValue={arrivalDate}
                                                    render={({ field }) => (
                                                        <Flatpickr
                                                            required
                                                            {...field}
                                                            options={options1}
                                                            placeholder='YYYY-MM-DD '
                                                            className={classnames('form-control')}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>
                                    }

                                    {
                                        departureDate !== undefined &&
                                        <Col md='4' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='outGoData'>
                                                    Departure Date <spam style={{ color: 'red' }}>*</spam>
                                                </Label>
                                                <Controller
                                                    control={control}
                                                    id='outGoData'
                                                    name='outGoData'
                                                    defaultValue={departureDate}
                                                    render={({ field }) => (
                                                        <Flatpickr
                                                            required
                                                            {...field}
                                                            options={optionsToDate1}
                                                            placeholder='YYYY-MM-DD '
                                                            className={classnames('form-control')}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>
                                    }
                                </Row>
                                <div align='end'>
                                    <Button color='primary' className='me-1' type='submit'>
                                        Check Availability
                                    </Button>
                                </div>
                            </Form>
                            <br></br>
                            <br />
                            {
                                latestInventory &&
                                <div className="ag-theme-alpine" style={{ height: 350, width: 450 }}>
                                    <p>     Total Availability : {latestInventory[0].total_min_availability}</p>
                                    <AgGridReact
                                        ref={gridRef}
                                        rowData={latestInventory}
                                        columnDefs={columnDefs8}
                                        animateRows={true}
                                        rowSelection="multiple"
                                        paginationPageSize={10}
                                        pagination={true}
                                        defaultColDef={defaultColDef}
                                        headerColor="ddw-primary"
                                    />
                                </div>}
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>


            {/* number of rooms change modal */}
            <div>
                {reservationData && <Modal isOpen={roomCountChange} toggle={() => setRoomCountChange(!roomCountChange)} className="modal-xl">
                    <ModalHeader className="modal-lg" toggle={() => { setRoomCountChange(!roomCountChange) }}>
                        Modify/Update number of rooms
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <br></br>
                        <p>
                            <b>Note:- Click on cells to enter the data and don't forget to save the before going to next row.</b>
                            <div align='end'>
                                <Button color='primary' className='me-1' onClick={() => { setOptions2(!options2) }}>
                                    Check Availability
                                </Button>
                            </div>
                        </p>
                        <p>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Row>
                                <Col md='3' sm='12'>
                                    <b>Group Name</b> :- {reservationData['groupName']} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Arrival Date</b> :- {reservationData['arrivalDate']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Departure Date</b> :- {reservationData['departureDate']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Cut Off Date</b> :- {reservationData['cutOfDate']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                            </Row>
                        </p>
                        <p>
                            <Row>
                                <Col md='3' sm='12'>
                                    <b>Number of rooms booked</b> :- {reservationData['totalRooms']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Number of rooms Picked</b> :- {reservationData['picked_rooms']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Number of rooms Remaining</b> :- {reservationData['totalRooms'] - reservationData['picked_rooms']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    {gridData.length && <b> Total Available Rooms: {gridData[0].total_min_availability}</b>}
                                </Col>
                            </Row>
                        </p>
                        <div className="ag-theme-alpine" style={{ height: 400 }}>
                            <AgGridReact
                                ref={gridRef}
                                rowData={gridData}
                                columnDefs={columnDefs2}
                                animateRows={true}
                                rowSelection="multiple"
                                onCellEditingStopped={handleCellEdit}
                                paginationPageSize={10}
                                singleClickEdit={true}
                                pagination={true}
                                defaultColDef={defaultColDef}
                                headerColor="ddw-primary"
                            />
                        </div>
                        <br></br>
                        <div align='end'>
                            <Button outline className='me-1' color='secondary' onClick={() => setRoomCountChange(!roomCountChange)}> Close</Button>
                        </div>
                    </ModalBody>
                </Modal>}


            </div>


            <div>
                {reservationData && <Modal isOpen={openReleaseInventory} toggle={() => setOpenReleaseInventory(!openReleaseInventory)} className="modal-xl">
                    <ModalHeader className="modal-lg" toggle={() => { setOpenReleaseInventory(!openReleaseInventory) }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Release Pending Inventory</h2>
                    <p style={{ fontSize: '12px' }}>Wash out the pending room inventory</p>
                    
                                        </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                    
                        <p>
                            <Row>
                                <Col md='3' sm='12'>
                                    <b>Group Name</b> :- {reservationData['groupName']} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Arrival Date</b> :- {reservationData['arrivalDate']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Departure Date</b> :- {reservationData['departureDate']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Cut Off Date</b> :- {reservationData['cutOfDate']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                            </Row>
                        </p>
                        <p>
                            <Row>
                                <Col md='3' sm='12'>
                                    <b>Number of rooms booked</b> :- {reservationData['totalRooms']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Number of rooms Picked</b> :- {reservationData['picked_rooms']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Number of rooms Remaining</b> :- {reservationData['totalRooms'] - reservationData['picked_rooms']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    {gridData.length && <b> Total Available Rooms: {gridData[0].total_min_availability}</b>}
                                </Col>
                            </Row>
                        </p>
                        {/* <div className="ag-theme-alpine" style={{ height: 400 }}>
                            <AgGridReact
                                ref={gridRef}
                                rowData={gridData}
                                columnDefs={columnDefs2}
                                animateRows={true}
                                rowSelection="multiple"
                                onCellEditingStopped={handleCellEdit}
                                paginationPageSize={10}
                                singleClickEdit={true}
                                pagination={true}
                                defaultColDef={defaultColDef}
                                headerColor="ddw-primary"
                            />
                        </div> */}

                        {filldata &&
                            <ReleaseInventory filldata={filldata} closeReleaseInventoryModal={closeReleaseInventoryModal} />

                        }
                        <br></br>
                        {/* <div align='end'>
                            <Button outline className='me-1' color='secondary' onClick={() => setOptions(!options)}> Close</Button>
                            <Button color='primary' className='me-1' onClick={convertToTentative}>Convert to Tentative</Button>
                        </div> */}
                    </ModalBody>
                </Modal>}


            </div>


            {/* Confirmation to create reservation via file */}
            {openGridData == true && <div>
                <Modal isOpen={openGridData} toggle={() => {
                    setOpenGridData(!openGridData)
                    setFileName()
                }} className="custom-modal-size">
                    <ModalHeader className="modal-lg" toggle={() => {
                        setOpenGridData(!openGridData)
                        setFileName()
                    }}>
                        Rooming List Confirmation
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <div className="ag-theme-alpine" style={{ height: 660 }}>
                            <AgGridReact
                                ref={gridRef2}
                                rowData={fileData}
                                columnDefs={columnDefs6}
                                animateRows={true}
                                rowSelection="multiple"
                                onCellClicked={cellClickedListener2}
                                paginationPageSize={10}
                                singleClickEdit={true}
                                pagination={true}
                                defaultColDef={defaultColDef}
                                headerColor="ddw-primary"
                            />
                        </div>
                        <br></br>
                        <div align="end">
                            <Button color="primary" className="me-1" onClick={createReservationInBulk}>
                                Create Reservations
                            </Button>
                        </div>
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
                    </ModalBody>
                </Modal>
            </div>}


            {/* Upload rooming list via file */}
            {
                uploadForm == true && (
                    <div>
                      
<Modal isOpen={uploadForm} toggle={() => setUploadForm(!uploadForm)} className="modal-xl">
  <ModalHeader toggle={() => setUploadForm(!uploadForm)}>
    Guest Details Upload Page
  </ModalHeader>
  <ModalBody className="pb-3 px-sm-2 mx-20">
    {/* Upload Button and File Input */}
    <div align="end" className="mb-3">
      <Button color="primary" className="me-1" onClick={DownloadSampleExcel}>
        Download Sample Excel
      </Button>
    </div>
    <Col md="4" sm="12" className="mb-3">
      <Label className="form-label" htmlFor="attachments">
        Upload Guest Details
      </Label>
      

<Controller
  defaultValue=""
  control={control}
  name="attachments"
  render={({ field }) => (
    <Input
      type="file"
      accept=".xlsx, .xls"
      placeholder={fileName ? fileName : "Upload file"}
      onChange={(e) => {
        const file = e.target.files[0];
        handleFileUpload(e);
        field.onChange(e); // Update form state
        
        // If file is selected, set the filename
        if (file) {
          setFileName(file.name);
        }
      }}
    //   ref={fileInputRef}
    innerRef={fileInputRef}
    />
  )}
/>

                        <Button
                            color="primary"
                            className="mt-2"
                            disabled={!fileData || fileData.length === 0 || !fileName}
                            onClick={() => handleValidateAndFetchGridData(fileData)}
                        >
                            Upload
                        </Button>
                    </Col>

    {/* AG Grid Section */}
    <div className="ag-theme-alpine mt-4" style={{ height: 500 }}>
      <AgGridReact
        ref={gridRef2}
        rowData={tempData}
        columnDefs={columnDefs6}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        rowSelection="multiple"
        animateRows={true}
        singleClickEdit={true}
        onCellClicked={cellClickedListener2}
      />
    </div>

                    {/* Create Reservations Button */}
                    <div align="end" className="mt-3">
                        <Button
                            color="primary"
                            className="me-1"
                            onClick={() => createReservationInBulk()}
                            disabled={(!tempData || tempData.length === 0) || isUpdateWithRatesButton}
                        >
                            Create Reservations
                        </Button>
                    </div>
                </ModalBody>
            </Modal>
                    </div>
                )
            }


            {/* Definite rooming list */}
            {definiteData !== undefined && <div>
                <Modal isOpen={definiteOptions} toggle={() => setDefiniteOptions(!definiteOptions)} className="modal-xl">
                    <ModalHeader className="modal-lg" toggle={() => { setDefiniteOptions(!definiteOptions) }}>
                        Rooming List
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <p><b>Note:- Please click on cell to enter the data and don't forget to confirm the booking for each row, before going to next row.</b></p>
                        <div className="ag-theme-alpine" style={{ height: 660 }}>
                            <AgGridReact
                                ref={gridRef2}
                                rowData={definiteData}
                                columnDefs={columnDefs3}
                                animateRows={true}
                                rowSelection="multiple"
                                onCellClicked={cellClickedListener2}
                                paginationPageSize={10}
                                singleClickEdit={true}
                                pagination={true}
                                defaultColDef={defaultColDef}
                                headerColor="ddw-primary"
                            />
                        </div>
                        <br></br>
                        <div align='end'>
                            <Button color='primary' className='me-1' onClick={() => setDefiniteOptions(false)}> Close </Button>
                        </div>
                    </ModalBody>
                </Modal>
            </div>}


            {/* Confirmation data */}
            {definiteOptionsActions == true && <div>
                <Modal isOpen={definiteOptionsActions} toggle={() => {
                    setDefiniteOptionsActions(!definiteOptionsActions)
                    setDefiniteReservation()
                    setFileNameList()
                }} className="modal-lg">
                    <ModalHeader className="modal-lg" toggle={() => {
                        setDefiniteOptionsActions(!definiteOptionsActions)
                        setDefiniteReservation()
                        setFileNameList()
                    }}>
                        Assign Rooms to rooming list
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">

                        <div align='end'>
                            <Button color='primary' className='me-1' onClick={DownloadRoomingList}> Download Rooming List </Button>
                        </div>

                        <br></br>

                        <Col md='6' sm='12' className='mb-1'>
                            <div className='mb-1'>
                                <Label className='form-label' for='attachments'>
                                    Upload assigned rooming list
                                </Label>
                                <Controller
                                    defaultValue=''
                                    control={control}
                                    id='attachments'
                                    name='attachments'
                                    render={({ field }) =>
                                        <Input
                                            type='file'
                                            accept=".xlsx, .xls"
                                            placeholder='attachments'
                                            onChange={(e) => {
                                                handleFileChange(e);
                                                field.onChange(e);  // Update form state
                                            }}
                                            ref={fileInputRef}  // Attach ref
                                        />
                                    }
                                />
                                <br></br>
                                {fileNameList && <div> Uploaded file : <b>{fileNameList}</b></div>}
                            </div>
                        </Col>
                        <br></br>

                        {definiteReservationData && gridOpenForm == true && <Modal isOpen={gridOpenForm} toggle={() => {
                            setGridOpenForm(!gridOpenForm)
                            setDefiniteReservation()
                            setFileNameList()
                        }} className="custom-modal-size">
                            <ModalHeader className="modal-lg" toggle={() => {
                                setGridOpenForm(!gridOpenForm)
                                setDefiniteReservation()
                                setFileNameList()
                            }}>
                                Uploaded Rooming List With Room Number
                            </ModalHeader>
                            <ModalBody className="pb-3 px-sm-2 mx-20">
                                <div className="ag-theme-alpine" style={{ height: 660 }}>
                                    <AgGridReact
                                        ref={gridRef2}
                                        rowData={definiteReservationData}
                                        columnDefs={columnDefs7}
                                        animateRows={true}
                                        rowSelection="multiple"
                                        paginationPageSize={10}
                                        singleClickEdit={true}
                                        pagination={true}
                                        defaultColDef={defaultColDef}
                                        headerColor="ddw-primary"
                                    />
                                </div>
                                <br></br>
                                <div align="end">
                                    {/* <Button color="primary" className="me-1" onClick={setGridOpenForm(false)}>
                                        Close
                                    </Button> */}
                                    <Button color="primary" className="me-1" onClick={AssignRoomOnRoomingListUpload}>
                                        Assign Room
                                    </Button>
                                </div>
                            </ModalBody>
                        </Modal>
                        }


                    </ModalBody>
                </Modal>
            </div>}


            {/* Action button cloud */}
            <div>
                {reservationData && <Modal
                    isOpen={modalOpen}
                    toggle={() => setModalOpen(!modalOpen)}
                    className="modal-lg"
                >
                    <ModalHeader
                        className="modal-lg"
                        toggle={() => {
                            setModalOpen(!modalOpen);
                        }}
                    >
                        I Want To..
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <div>

                            {/* Cloud modal for action button */}
                            <Card style={{ backgroundColor: "#F2E5D9" }}>
                                <Row className="cardBody">
                                    <div>
                                        <h5>
                                            <Edit2 style={{ height: "20px" }} />
                                            Reservation Operations
                                        </h5>
                                    </div>
                                    {/* Convert bookings */}
                                    <Col md="6" sm="12" className="mb-1">

                                        {/* onclick={tentativaModal} */}
                                        {reservationData && reservationData.status === 'Enquiry' && <div onClick={() => {
                                            if (reservationData.status === 'Cancelled' || reservationData.status === 'Definite' || reservationData.status === 'Tentative' || reservationData.status === 'Checked In' || reservationData.status === 'Checked Out') {
                                                return handleError("This operation is not allowed")
                                            }
                                            setOptions(!options)
                                        }} className="hoverUnderline">
                                            Convert Into Tentative
                                        </div>}

                                        {reservationData && reservationData.status === 'Tentative' && <div onClick={convertToDefinite} className="hoverUnderline">
                                            Convert Into Definite
                                        </div>}

                                        <div onClick={advancePost} className="hoverUnderline">
                                            Post Advance.
                                        </div>

                                        <div onClick={cancelBookingModal} className="hoverUnderline" >
                                            Cancel Booking
                                        </div>

                                        <div onClick={openGroupRevenue} className="hoverUnderline" >
                                            View group revenue
                                        </div>

                                        {reservationData && reservationData.status === 'Definite' && <div onClick={paymentTypeModification} className="hoverUnderline" >
                                            Modify Payment Type
                                        </div>}
                                        {reservationData  && <div onClick={() => {
                                            if (reservationData.status === 'Cancelled'  || reservationData.status === 'Checked In' || reservationData.status === 'Checked Out') {
                                                return handleError("This operation is not allowed")
                                            }
                                            setInvOpen(!invOpen)
                                        }} className="hoverUnderline">
                                            Inventory Blocking
                                        </div>}
                                        {reservationData && reservationData.status === 'Enquiry' && <div onClick={numberOfRoomsModify} className="hoverUnderline" >
                                            Modify Number of Rooms
                                        </div>}

                                        {reservationData && reservationData.status === 'Definite' && <div onClick={bookingInfoModify} className="hoverUnderline" >
                                            Modify Booking information.
                                        </div>}
                                        {reservationData && reservationData.status === 'Definite' && <div onClick={() => setOpenReleaseInventory(!openReleaseInventory)} className="hoverUnderline" >
                                            Release Inventory
                                        </div>}

                                    </Col>

                                    {/* Modify/Update */}
                                    <Col md="6" sm="12" className="mb-1">

                                        {/* Upload rooming list */}
                                        {
                                            reservationData && reservationData.status === 'Definite' && <div onClick={uploadRoomingList} className="hoverUnderline" >
                                                Upload Guest Details
                                            </div>}


                                        {/* Assigning rooms via file */}
                                        {reservationData && reservationData.status === 'Definite' && <div onClick={roomingListActions} className="hoverUnderline">
                                            Upload Rooming List
                                        </div>}


                                        {/* Rooming list view */}
                                        {reservationData && reservationData.status === 'Definite' && <div onClick={roomingList} className="hoverUnderline">
                                            Rooming List
                                        </div>}

                                        {/* {
                                            reservationData && reservationData.status === 'Definite' &&
                                            <div onClick={roomTypeModify} className="hoverUnderline">
                                                Room Type Modifications
                                            </div>
                                        } */}

                                        <div onClick={datesModify} className="hoverUnderline">
                                            Modify Stay Duration
                                        </div>

                                        {reservationData && reservationData.status !== 'Definite' && <div onClick={paymentTypeModification} className="hoverUnderline" >
                                            Modify Payment Type
                                        </div>}

                                        {reservationData && reservationData.status !== 'Definite' && <div onClick={bookingInfoModify} className="hoverUnderline" >
                                            Modify Booking information.
                                        </div>}

                                    </Col>

                                </Row>
                            </Card>
                        </div>

                        {/* Reservation details */}
                        {reservationData && <Card>
                            <CardBody>
                                <div>
                                    <Row>
                                        <Col md='6' sm='12' >
                                            <h3>
                                                Stay Information
                                            </h3>
                                            Group name :      <b> {reservationData['groupName']}                  </b><br></br>
                                            Arrival  :        <b> {reservationData['arrivalDate'] + ' ' + reservationData['ETA']}             </b> <br></br>
                                            Departure:        <b> {reservationData['departureDate'] + ' ' + ' ' + ' ' + reservationData['ETD']}  </b> <br></br>
                                            Adults   :        <b> {reservationData['numberOfAdults']}                              </b> <br></br>
                                            Children :        <b> {reservationData['numberOfChildren']}                            </b> <br></br>
                                            Number Of Rooms : <b> {reservationData['totalRooms']}                               </b> <br></br>
                                            Package :         <b> {reservationData['packageName']}                                 </b><br></br>
                                            RateCode:         <b> {reservationData['rateCode']}</b>                              <br></br>
                                            Payment Type:   <b> {reservationData['paymentTypeCode']}</b><br></br>
                                            Credit Card Amount: <b>{reservationData['amount']}</b><br></br>
                                            Cut Off Date: <b> {reservationData['cutOfDate']}</b><br></br>
                                            Extras: <b> {reservationData['extraName']}</b><br></br>

                                        </Col>
                                        <Col md='6' sm='12'>
                                            <h3>
                                                Booking Information
                                            </h3>
                                            Company Name :    <b> {reservationData['companyName']}             </b> <br></br>
                                            ResType :         <b> {reservationData['reservationType']} </b><br></br>
                                            source :          <b> {reservationData['sourceCode']}                 </b><br></br>
                                            Agent :           <b> {reservationData['agentName']}                </b><br></br>
                                            Origin :          <b> {reservationData['originName']}                     </b><br></br>
                                            Market :          <b> {reservationData['marketCode']}                 </b><br></br>
                                            Block CodeID:         <b> {reservationData['id']}                </b><br></br>
                                            Comments:        <b> {reservationData['comments']}                       </b><br></br>
                                            Billing Instructions:  <b> {reservationData['billingInstruction']}       </b><br></br>
                                            Advance Payment:  <b> {reservationData['advanceAmount']}       </b><br></br>
                                            Preferences: <b> {reservationData['preferenceName']}</b><br></br>

                                        </Col>
                                    </Row>
                                </div>
                            </CardBody>
                        </Card>}
                    </ModalBody>
                </Modal>}
            </div>


            {/* Stay modification */}
            {reservationData !== "" && <Modal
                isOpen={datesModification}
                toggle={() => setDatesModification(!datesModification)}
                className="modal-lg"
            // style={{ maxWidth: '1400px', maxHeight: '60vh' }}
            >
                <ModalHeader toggle={() => setDatesModification(!datesModification)} className="modal-lg">
                    Modify Stay Duration
                </ModalHeader>
                <ModalBody className="modal-lg">
                    <DatesModification data={reservationData} />

                </ModalBody>
            </Modal>}


            {/* Advance posting component */}
            {
                reservationData !== "" && <Modal
                    isOpen={openAdvancePost}
                    toggle={() => setOpenAdvancePost(!openAdvancePost)}
                    className="modal-lg"
                >
                    <ModalHeader toggle={() => setOpenAdvancePost(!openAdvancePost)} className="modal-lg">
                        Post Advance
                    </ModalHeader>
                    <ModalBody className="modal-lg">
                        <AdvancePost data={reservationData} />
                    </ModalBody>
                </Modal>
            }


            {/* Booking information modification */}
            {reservationData !== "" && <Modal
                isOpen={bookingInfoMod}
                toggle={() => setBookingInfoMod(!bookingInfoMod)}
                className="modal-lg"
            >
                <ModalHeader toggle={() => setBookingInfoMod(!bookingInfoMod)} className="modal-lg">
                    Modify Booking Information
                </ModalHeader>
                <ModalBody className="modal-lg">
                    <BookingInfoModification data={reservationData} />

                </ModalBody>
            </Modal>}


            {/* Payment Type modification */}
            {reservationData !== "" && <Modal
                isOpen={paymentTypeMod}
                toggle={() => setPaymentTypeMod(!paymentTypeMod)}
                className="modal-lg"
            >
                <ModalHeader toggle={() => setPaymentTypeMod(!paymentTypeMod)} className="modal-lg">
                    Modify Payment Method
                </ModalHeader>
                <ModalBody className="modal-lg">
                    <PaymentModification data={reservationData} />
                </ModalBody>
            </Modal>}


            {/* Number of rooms modification */}
            {reservationData !== "" && <Modal
                isOpen={numberOfRooms}
                toggle={() => setNumberOfRooms(!numberOfRooms)}
                className="modal-sm"
            >
                <ModalHeader toggle={() => setNumberOfRooms(!numberOfRooms)} className="modal-sm">
                    Modify Number of rooms
                </ModalHeader>
                <ModalBody className="modal-sm">
                    <ModifyNumberOfRooms data={reservationData} />
                </ModalBody>
            </Modal>}


            {/* Cancel details */}
            {reservationData !== "" && <Modal
                isOpen={cancelBooking}
                toggle={() => setCancelBooking(!cancelBooking)}
                className="modal-lg"
            >
                <ModalHeader toggle={() => setCancelBooking(!cancelBooking)} className="modal-lg">
                    Cancel group booking
                </ModalHeader>
                <ModalBody className="modal-lg">
                    <Card>
                        <CardBody>
                            <Form>
                                <Row >
                                    <Col md='6' sm='12' className='mb-1'>
                                        <div className="mb-1">
                                            <Label className="form-label" for="reason">
                                                Select Reason <spam style={{ color: 'red' }}>*</spam>
                                            </Label>
                                            <Controller
                                                id='reason'
                                                control={control}
                                                name="reason"
                                                render={({ field }) => (
                                                    <Select
                                                        // required
                                                        required
                                                        isClearable
                                                        options={reason}
                                                        classNamePrefix="select"
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select',)}
                                                        {...field}
                                                        onChange={handleChange} // Add onChange event handler
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                    <Col md='6' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='reasonText'>
                                                Reason Remarks
                                            </Label>
                                            <Controller
                                                id='reasonText'
                                                name='reasonText'
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        // required
                                                        {...field}
                                                        id='reasonText'

                                                        placeholder='Reason Remarks'
                                                        className={classnames('form-control')}
                                                    //   value={document.getElementById('reason') ? document.getElementById('reason') : null
                                                    //  }
                                                    // value={labelReason ? labelReason : null}
                                                    // value={field.value === labelReason ? labelReason : field.value}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                </Row>

                                <div align='end'>
                                    <Button outline className='me-1' color='secondary' toggle={() => setCancelBooking(!cancelBooking)}>
                                        Close
                                    </Button>
                                    <Button className='me-1' color='primary' onClick={openCancelModal} disabled={open1}>
                                        Cancel Booking
                                    </Button>
                                </div>

                                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open1}>
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

                            </Form>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>}




            <div>
                {reservationData && <Modal isOpen={invOpen} toggle={() => setInvOpen(!invOpen)} className="modal-xl">
                    <ModalHeader className="modal-lg" toggle={() => { setInvOpen(!invOpen) }}>
                        Inventory Blocking
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <br></br>
                        <p><b>Note:- Click on cells to enter the data and don't forget to save the before going to next row.</b></p>
                        <p>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Row>
                                <Col md='3' sm='12'>
                                    <b>Group Name</b> :- {reservationData['groupName']} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Arrival Date</b> :- {reservationData['arrivalDate']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Departure Date</b> :- {reservationData['departureDate']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Cut Off Date</b> :- {reservationData['cutOfDate']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                            </Row>
                        </p>
                        {/* <p>
                            <Row>
                                <Col md='3' sm='12'>
                                    <b>Number of rooms booked</b> :- {reservationData['totalRooms']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Number of rooms Picked</b> :- {reservationData['picked_rooms']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    <b>Number of rooms Remaining</b> :- {reservationData['totalRooms'] - reservationData['picked_rooms']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Col>
                                <Col md='3' sm='12'>
                                    {gridData.length && <b> Total Available Rooms: {gridData[0].total_min_availability}</b>}
                                </Col>
                            </Row>
                        </p> */}
                        {/* <div className="ag-theme-alpine" style={{ height: 400 }}>
                            <AgGridReact
                                ref={gridRef}
                                rowData={gridData}
                                columnDefs={columnDefs2}
                                animateRows={true}
                                rowSelection="multiple"
                                onCellEditingStopped={handleCellEdit}
                                paginationPageSize={10}
                                singleClickEdit={true}
                                pagination={true}
                                defaultColDef={defaultColDef}
                                headerColor="ddw-primary"
                            />
                        </div> */}

                        {filldata &&
                            <InventoryEntryTable filldata={filldata} closeInventoryModal={closeInventoryModal} />

                        }
                        <br></br>
                        {/* <div align='end'>
                            <Button outline className='me-1' color='secondary' onClick={() => setOptions(!options)}> Close</Button>
                            <Button color='primary' className='me-1' onClick={convertToTentative}>Convert to Tentative</Button>
                        </div> */}
                    </ModalBody>
                </Modal>}


            </div>

            
            {reservationData !== "" && <Modal
                isOpen={groupRevenue}
                toggle={() => setGroupRevenue(!groupRevenue)}
                className="modal-lg"
            >
                <ModalHeader toggle={() => setGroupRevenue(!groupRevenue)} className="modal-lg">
                    Group Revenue Details
                </ModalHeader>
                <ModalBody className="modal-lg">
                    <h4>Please find the group revenue details below</h4>
                    <br></br>
                    <div className="ag-theme-alpine" style={{ height: 300 }}>
                        <AgGridReact
                            rowData={groupRevenueData}
                            columnDefs={columnDefs4}
                            animateRows={true}
                            groupUseEntireRow={true}
                            groupDefaultExpanded={-1}
                            autoGroupColumnDef={{
                                headerName: "Category",
                                minWidth: 200,
                                cellRendererParams: {
                                    suppressCount: true
                                }
                            }}
                            defaultColDef={defaultColDef}
                        />
                    </div>
                    <br></br>
                </ModalBody>
            </Modal>}

        </div>
    )
}


export default AllGroupReservations
