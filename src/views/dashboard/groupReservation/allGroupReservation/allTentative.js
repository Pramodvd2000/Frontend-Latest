// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button, Modal, ModalBody, ModalHeader, Card, Form, Label, CardBody, Row, Col, Input, Badge } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import classnames from "classnames";
import { selectThemeColors } from "@utils";
import "./frontDesk.scss";
import "./frontDesk.scss";
import PaymentModification from './paymentModification';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import Moment from "moment";
import API_URL from "../../../../config";
import { Check, Circle, Edit2 } from "react-feather";

sessionStorage.removeItem('groupReservationID')

import DatesModification from './dateModification'
import BookingInfoModification from './bookingInfoModification';
import ModifyNumberOfRooms from './noOfRoomsModification';
import AdvancePost from './advancePost';
import { useNavigate } from "react-router-dom"

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import RoomRatePage from './roomRate';
import InventoryEntryTable from './inventoryEntryTable'

const AllTentativeReservations = () => {

    const navigate = useNavigate()
    const [rowData, setRowData] = useState();
    const [options, setOptions] = useState();
    const [definiteOptions, setDefiniteOptions] = useState();
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
    const { reset, control, watch } = useForm({});
    const [groupRevenue, setGroupRevenue] = useState(false)
    const [groupRevenueData, setGroupRevenueData] = useState([])
    const [openAdvancePost, setOpenAdvancePost] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
    const [paymentTypeMod, setPaymentTypeMod] = useState();
    const [options1, setOptions1] = useState();
    const [invOpen, setInvOpen] = useState();
    const [filldata, setfilldata] = useState();
    
    function closeInventoryModal(){
        setInvOpen(!invOpen)
          }






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
        // {
        //     headerName: "Reservation Status",
        //     field: "newStatus",
        //     suppressSizeToFit: true,
        //     maxWidth: 180,
        // },
      
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
                    onClick={() => handleSubmit(params.data)} // Pass row data to handleSubmit
                >
                    Save
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
            headerName: "Booking ID",
            field: "bookingID",
            suppressSizeToFit: true,
            maxWidth: 130
        },

        {
            headerName: "Saln",
            field: "salutation",
            editable: params => !params.data.bookingID, // Allow editing if bookingID is empty
            maxWidth: 100,
            cellEditor: "agSelectCellEditor", // Use ag-Grid built-in select cell editor
            cellEditorParams: params => {
                // Customize options based on conditions if needed
                return { values: salutations.map(salutation => salutation.value) };
            },
            valueFormatter: params => {
                const salutation = salutations.find(s => s.value === params.value);
                return salutation ? salutation.label : ""; // Format displayed value
            }
        },
        {
            headerName: "First Name",
            field: "firstName",
            editable: function (params) {
                return !params.data.firstName; // Allow editing if firstName is empty
            },
            maxWidth: 180,
        },
        {
            headerName: "Last Name",
            field: "lastName",
            editable: function (params) {
                return !params.data.lastName; // Allow editing if lastName is empty
            },
            maxWidth: 250,
        },
        // {
        //     headerName: "EmailID",
        //     field: "emailID",
        //     editable: true,             
        //     Width: 250
        // },
        {
            headerName: "Group Name",
            field: "groupName",
            suppressSizeToFit: true,
            maxWidth: 200,
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
                // onClick={definiteFunctionCall} 
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
                // onClick={definiteFunctionCall} 
                >
                    Reg Card
                </Button>
            ),
            suppressSizeToFit: true,
            maxWidth: 148,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
        },

    ]);


    // Define column definitions for ag-Grid
    const columnDefs4 = [
        { headerName: "", field: "Category" },
        { headerName: "Total", field: "Total" },
        { headerName: "Picked", field: "Picked" },
        { headerName: "Remaining", field: "Remaining" }
    ];


    // Create individual reservation
    const createReservation = (params) => {

        if (params.data.bookingID !== undefined) {
            return handleError('Already reservation got created !!')
        }

        if (params.data.salutation === undefined || params.data.salutation === '') {
            return handleError("Salutation is mandatory")
        }
        if ((params.data.firstName === undefined || params.data.firstName === '')) {
            return handleError("First name is mandatory")
        }
        if ((params.data.lastName === undefined || params.data.lastName === '')) {
            return handleError("Last name is mandatory")
        }

        const rowData = params.data
        const groupData = JSON.stringify({
            reservationData: rowData
        })
        fetchx(API_URL + `/createReservationForGroup`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: groupData
        })
            .then(result => result.json())
            .then(response => {
                handleSuccess()
                confirmBooking(response['message'])
                callDefiniteReservation()
            })
    };


    // Get all the reservations on page load
    useEffect(() => {
        fetchx(API_URL + "/getAllGroupReservations?filterKey=Tentative")
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
                    setDefiniteOptions(!definiteOptions)
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


    // Confirm booking button action
    const confirmBooking = async (message) => {
        await MySwal.fire({
            text: message,
            icon: 'success',
        });
        setTimeout(() => { }, 1000);
    };


    // Storing data for tentative to definite
    const handleSubmit = (row) => {


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
                        if(resp.statusCode === 200){
                            handleSuccessDefinite(resp['message'])
                            fetchx(API_URL + "/getAllGroupReservations")
                                .then((result) => result.json())
                                .then((rowData) => {
                                    setRowData(rowData["data"]);
                                });
                        }
                        else{
                        handleError(resp.message);
                            
                        }
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


    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById("filter-text-box").value
        );
    }, []);


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
                    // getRowStyle={getRowStyle}
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


            {/* number of rooms change modal */}
            <div>
                {reservationData && <Modal isOpen={roomCountChange} toggle={() => setRoomCountChange(!roomCountChange)} className="modal-xl">
                    <ModalHeader className="modal-lg" toggle={() => { setRoomCountChange(!roomCountChange) }}>
                        Modify/Update number of rooms
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
                            <Button outline className='me-1' color='secondary' onClick={() => setRoomCountChange(!roomCountChange)}> Close</Button>
                        </div>
                    </ModalBody>
                </Modal>}


            </div>


            {/* Definite rooming list */}
            {definiteData !== undefined && <div>
                <Modal isOpen={definiteOptions} toggle={() => setDefiniteOptions(!definiteOptions)} className="modal-xl">
                    <ModalHeader className="modal-lg" toggle={() => { setDefiniteOptions(!definiteOptions) }}>
                        Rooming List
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <div className="ag-theme-alpine" style={{ height: 660 }}>
                            <AgGridReact
                                ref={gridRef2}
                                rowData={definiteData}
                                columnDefs={columnDefs3}
                                animateRows={true}
                                rowSelection="multiple"
                                // onCellEditingStopped={handleCellEdit}
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
                            {/* <Button color='primary' className='me-1' onClick={handleSubmit}>Submit</Button> */}
                        </div>
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
                                        {reservationData && reservationData.status === 'Tentative' && <div onClick={() => {
                                            if (reservationData.status === 'Cancelled' || reservationData.status === 'Checked In' || reservationData.status === 'Checked Out') {
                                                return handleError("This operation is not allowed")
                                            }
                                            setOptions1(!options1)
                                        }} className="hoverUnderline">
                                            Modify/Add Room Rates
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

                                        {reservationData  && <div onClick={() => {
                                            if (reservationData.status === 'Cancelled'  || reservationData.status === 'Checked In' || reservationData.status === 'Checked Out') {
                                                return handleError("This operation is not allowed")
                                            }
                                            setInvOpen(!invOpen)
                                        }} className="hoverUnderline">
                                            Inventory Blocking
                                        </div>}
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
            // style={{ maxWidth: '1400px', maxHeight: '60vh' }}
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





            <div>
                {reservationData && (
                    <Modal isOpen={options1} toggle={() => setOptions1(!options1)} className="modal-xl" style={{ maxWidth: '800px', width: '800px', margin: 'auto' }} >
                        <ModalHeader className="modal-lg" toggle={() => { setOptions1(!options1); }}>
                            Add Room Rates
                        </ModalHeader>
                        <ModalBody>
                            <RoomRatePage reservationData={reservationData} />
                        </ModalBody>
                    </Modal>
                )}
            </div>



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
                                <Row>
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



            {/* Group revenue details */}
            {reservationData !== "" &&
                <Modal
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
                </Modal>
            }

        </div>
    )
}

export default AllTentativeReservations
