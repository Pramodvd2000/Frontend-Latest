// ** React Imports
import { useState } from "react";
import axios from "axios";
// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Moment from 'moment';

// ** Custom Components
import Avatar from "@components/avatar";


import API_URL from "../../../config";
// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {
    Input, Card, Form, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, Modal, ModalBody, ModalHeader, InputGroupText, Row, Col,
    Accordion, AccordionBody, AccordionHeader, AccordionItem
} from "reactstrap";


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
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import InventoryLogs from "./inventoryLogs";
import SellControlLogs from "./sellControlLogs";
const MySwal = withReactContent(Swal)
const id = '1'
const date = '2023-02-02'
const roomID = '30'

const activeoptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "InActive" },
];



const defaultValues = {
    roomID: "",
    numAvlRooms: "",
    numSellCtrlRooms: "",
    numOodRooms: "",
    numOverbookedRooms: "",
    sellLimit: "",
    date: null,
    roomTypeID: "",
};


// let roomTypeID = [
//     fetchx(API_URL + '/getRoomInventoryRoomTypeID?hotelID=1')
//         .then(result => result.json())
//         .then(resp => {
//             // console.log(resp['data'])
//             roomTypeID = resp['data']
//             console.log(roomTypeID)
//         })
// ]



const RoomInventory = () => {

    const [open, setOpen] = useState('')
    const [Today, setToday] = useState()
const [roomTypeID, setRoomTypes] = useState([]);



useEffect(() => {
    fetchx(`${API_URL}/getRoomInventoryRoomTypeID?hotelID=1`)
        .then(res => res.json())
        .then(resp => {
            setRoomTypes(resp.data || []);
        });
}, []);


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

    const toggle = id => {
        open === id ? setOpen() : setOpen(id)
    }

    function CustomCellRenderer(props) {
        const value = props.value;

        // Split the value into the "5000" and "(9)" parts
        const number = value.split("(")[0];
        const suffix = value.split("(")[1].replace(")", "");

        return (
            <div>
                <span style={{ color: 'red' }}>{number}</span>
                <span style={{ color: 'green' }}> ({suffix})</span>
            </div>
        );
    }
    // AG Grid
    const [rowData, setRowData] = useState();
    const [columnDefs, setColumnDefs] = useState([]);
    const [openForm, setOpenForm] = useState();

    const gridRef = useRef();

    // const [columnDefs, setColumnDefs] = useState([
    //     // {headerName: 'ID',field: 'id',suppressSizeToFit: true,maxWidth: 160},
    //     // {headerName: 'Hotel ID',field: 'hotelID',suppressSizeToFit: true},
    //     // {headerName: 'Room ID',field: 'roomID'},
    //     {
    //         headerName: 'Inventory Date', field: 'date', maxWidth: 150,
    //         filter: 'agDateColumnFilter'
    //     },
    //     {
    //         headerName: 'KSUP(Avl)'

    //     },

    //     {
    //         headerName: 'TSUP(Avl)'

    //     },
    //     {
    //         headerName: 'KDLX(Avl)'

    //     },
    //     {
    //         headerName: 'TDLX(Avl)'

    //     },
    //     {
    //         headerName: 'KCLB(Avl)'

    //     },
    //     {
    //         headerName: 'TCLB(Avl)'

    //     },
    //     {
    //         headerName: 'EXE(Avl)'

    //     },




    // ]);


    console.log(roomTypeID)
    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ));

    const cellClickedListener = useCallback(event => {
        console.log('cellClicked', event);

    }, []);

    // 

    const CustomHeader = (props) => {
        return (
            <div>
                <div>{props.displayName}</div>
                {/* Conditionally render (Avl + SellCtrl) when displayName is 'Total' */}
                {props.displayName === 'Total' && (
                    <div>(Avl + SellCtrl)</div>
                )}            </div>
        );
    };


    useEffect(() => {

        let createasset = JSON.stringify({

            fromDate: fromDateFilter,
            toDate: toDateFilter
        });
        let res = fetchx(API_URL + "/getSellControlRooms?hotelID=1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: createasset,
        })
            .then(result => result.json())
            .then(rowData => {
                if (rowData.statusCode === 200) {

                    let jsonData = rowData['data']
                    // Extract unique room types from the JSON data
                    const roomTypes = [...new Set(jsonData.map((item) => item.roomType))];

                    // Update columnDefs based on roomTypes
                    // const newColumnDefs = [ 
                    //     { headerName: 'Inventory Date', field: 'date', maxWidth: 150, filter: 'agDateColumnFilter' },
                    //     ...roomTypes.map((roomType) => ({
                    //         headerName: `${roomType}(Avl)`,
                    //         valueGetter: (params) => {
                    //             const matchingRoom = jsonData.find((item) => item.inventory_date === params.data.date && item.roomType === roomType);
                    //             return matchingRoom ? matchingRoom.numAvlRooms : '';
                    //         },
                    //     })),
                    // ];

                    // Update columnDefs based on roomTypes
                    const newColumnDefs = [
                        {
                            headerName: 'Inventory Date', field: 'date', maxWidth: 150, filter: 'agDateColumnFilter',
                            // cellRenderer: (params) => {
                            //     // Ensure the arrivalDate field exists in the row data        
                            //     if (params.data && params.data.date) {
                            //         // Assuming date is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
                            //         const formattedDate = Moment(params.data.date).format("DD-MM-YYYY");
                            //         return formattedDate;
                            //     } else {
                            //         return ""; // Handle cases where the data is missing or invalid        
                            //     }
                            // }
                            valueFormatter: (params) => {
                                const dateValue = params.value;

                                if (!dateValue) return '';

                                // Check if the date is in "YYYY-MM-DD" format
                                if (Moment(dateValue, 'YYYY-MM-DD', true).isValid()) {
                                    return Moment(dateValue, 'YYYY-MM-DD').format('DD MMM YYYY, ddd');
                                }

                                // If it doesn't match the format, return the original value
                                return dateValue;
                            },
                            maxWidth: 180
                        },
                        {
                            headerName: 'Occupancy %',
                            headerComponentFramework: CustomHeader,
                            field: 'occupancyPercentage',
                            valueGetter: (params) => {
                                const matchingRooms = jsonData.filter((item) => item.inventory_date === params.data.date);
                                const totalNumAvlRooms = matchingRooms.reduce((sum, room) => sum + room.numAvlRooms, 0);
                                const totalRooms = matchingRooms.length > 0 ? matchingRooms[0].totalRooms || 0 : 0;
                                return totalRooms > 0 ? ((totalNumAvlRooms / totalRooms) * 100).toFixed(1) + '%' : '0%';
                            },
                            width: 120,
                        },
                        {
                            headerName: 'Total',
                            headerComponentFramework: CustomHeader,

                            field: 'Total',
                            valueGetter: (params) => {
                                const matchingRooms = jsonData.filter((item) => item.inventory_date === params.data.date);
                                const totalNumAvlRooms = matchingRooms.reduce((sum, room) => sum + room.numAvlRooms, 0);
                                const totalNumSellCtrlRooms = matchingRooms.reduce((sum, room) => sum + room.numSellCtrlRooms, 0);
                                const totalOccupancy = matchingRooms.reduce((sum, room) => sum + room.numSellCtrlRooms, 0);
                                const totalRooms = matchingRooms.length > 0 ? matchingRooms[0].totalRooms || 0 : 0;
                                // calculate percentage (avoid divide by zero)
                                const percentage = totalRooms > 0 ? ((totalNumAvlRooms / totalRooms) * 100).toFixed(1) : 0;
                                return totalNumSellCtrlRooms !== 0
                                    ? `${totalNumAvlRooms} (+${totalNumSellCtrlRooms})`
                                    : `${totalNumAvlRooms} `;
                            },
                            width: 140, // Set the width as per your requirement
                        },

                        // ...roomTypes.flatMap((roomType) => [
                        ...jsonData
                            .sort((a, b) => a.roomTypeID - b.roomTypeID) // Sorting jsonData by roomTypeID
                            .map(item => item.roomType)
                            .filter((value, index, self) => self.indexOf(value) === index) // Removing duplicates
                            .flatMap((roomType) => [
                                {
                                    headerName: `${roomType}`,
                                    headerComponentFramework: CustomHeader,

                                    valueGetter: (params) => {
                                        const matchingRoom = jsonData.find((item) => item.inventory_date === params.data.date && item.roomType === roomType);
                                        return matchingRoom ? (
                                            matchingRoom.numSellCtrlRooms !== 0
                                                ? `${matchingRoom.numAvlRooms} (+${matchingRoom.numSellCtrlRooms})`
                                                : `${matchingRoom.numAvlRooms}`
                                        ) : '';
                                    },
                                    cellStyle: (params) => {

                                        const matchingRoom = jsonData.find(
                                            (item) => item.inventory_date === params.data.date && item.roomType === roomType
                                        );

                                        return {
                                            color: matchingRoom && matchingRoom.isOnline === 1 ? '#007c00' : 'black', // Change color based on isOnline for the specific room type
                                        };
                                    },
                                    width: 120, // Set the width as per your requirement

                                },


                            ]),

                    ];


                    setColumnDefs(newColumnDefs);

                    // Process jsonData to match the new column structure
                    const processedData = jsonData.reduce((acc, item) => {
                        const existingRow = acc.find((row) => row.date === item.inventory_date);
                        if (existingRow) {
                            existingRow[item.roomType] = item.numAvlRooms;
                            existingRow[`${item.roomType}(SellCtrl)`] = item.numSellCtrlRooms;
                            existingRow.isOnline = item.isOnline; // Ensure isOnline is included here

                        } else {
                            const newRow = {
                                date: item.inventory_date,
                                [`${item.roomType}(Avl)`]: item.numAvlRooms,
                                [`${item.roomType}(SellCtrl)`]: item.numSellCtrlRooms,
                                Total: { numAvlRooms: item.numAvlRooms, numSellCtrlRooms: item.numSellCtrlRooms },
                                isOnline: item.isOnline,

                            };
                            acc.push(newRow);
                        }
                        return acc;
                    }, []);


                    setRowData(processedData);
                }
            }
            )


    }, []);


    function getRoomInventoryRates(nullDate) {
        let createasset = JSON.stringify({

            fromDate: fromDateFilter,
            toDate: toDateFilter
        });
        let res = fetchx(API_URL + "/getSellControlRooms?hotelID=1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: createasset,
        })
            .then(result => result.json())
            .then(rowData => {
                if (rowData.statusCode === 200) {

                    let jsonData = rowData['data']
                    // Extract unique room types from the JSON data
                    const roomTypes = [...new Set(jsonData.map((item) => item.roomType))];

                    // Update columnDefs based on roomTypes
                    const newColumnDefs = [
                        {
                            headerName: 'Inventory Date', field: 'date', maxWidth: 150, filter: 'agDateColumnFilter',
                            // cellRenderer: (params) => {
                            //     // Ensure the arrivalDate field exists in the row data        
                            //     if (params.data && params.data.date) {
                            //         // Assuming date is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
                            //         const formattedDate = Moment(params.data.date).format("DD-MM-YYYY");
                            //         return formattedDate;
                            //     } else {
                            //         return ""; // Handle cases where the data is missing or invalid        
                            //     }
                            // }
                            valueFormatter: (params) => {
                                const dateValue = params.value;

                                if (!dateValue) return '';

                                // Check if the date is in "YYYY-MM-DD" format
                                if (Moment(dateValue, 'YYYY-MM-DD', true).isValid()) {
                                    return Moment(dateValue, 'YYYY-MM-DD').format('DD MMM YYYY, ddd');
                                }

                                // If it doesn't match the format, return the original value
                                return dateValue;
                            },
                            maxWidth: 180
                        },
                        {
                            headerName: 'Occupancy %',
                            headerComponentFramework: CustomHeader,
                            field: 'occupancyPercentage',
                            valueGetter: (params) => {
                                const matchingRooms = jsonData.filter((item) => item.inventory_date === params.data.date);
                                const totalNumAvlRooms = matchingRooms.reduce((sum, room) => sum + room.numAvlRooms, 0);
                                const totalRooms = matchingRooms.length > 0 ? matchingRooms[0].totalRooms || 0 : 0;
                                return totalRooms > 0 ? ((totalNumAvlRooms / totalRooms) * 100).toFixed(1) + '%' : '0%';
                            },
                            width: 120,
                        },
                        {
                            headerName: 'Total',
                            headerComponentFramework: CustomHeader,

                            field: 'Total',
                            valueGetter: (params) => {
                                const matchingRooms = jsonData.filter((item) => item.inventory_date === params.data.date);
                                const totalNumAvlRooms = matchingRooms.reduce((sum, room) => sum + room.numAvlRooms, 0);
                                const totalNumSellCtrlRooms = matchingRooms.reduce((sum, room) => sum + room.numSellCtrlRooms, 0);

                                return totalNumSellCtrlRooms !== 0
                                    ? `${totalNumAvlRooms} (+${totalNumSellCtrlRooms})`
                                    : `${totalNumAvlRooms}`;
                            },
                            width: 130, // Set the width as per your requirement
                        },

                        // ...roomTypes.flatMap((roomType) => [
                        ...jsonData
                            .sort((a, b) => a.roomTypeID - b.roomTypeID) // Sorting jsonData by roomTypeID
                            .map(item => item.roomType)
                            .filter((value, index, self) => self.indexOf(value) === index) // Removing duplicates
                            .flatMap((roomType) => [
                                {
                                    headerName: `${roomType}`,
                                    headerComponentFramework: CustomHeader,

                                    valueGetter: (params) => {
                                        const matchingRoom = jsonData.find((item) => item.inventory_date === params.data.date && item.roomType === roomType);
                                        return matchingRoom ? (
                                            matchingRoom.numSellCtrlRooms !== 0
                                                ? `${matchingRoom.numAvlRooms} (+${matchingRoom.numSellCtrlRooms})`
                                                : `${matchingRoom.numAvlRooms}`
                                        ) : '';
                                    },
                                    cellStyle: (params) => {

                                        const matchingRoom = jsonData.find(
                                            (item) => item.inventory_date === params.data.date && item.roomType === roomType
                                        );

                                        return {
                                            color: matchingRoom && matchingRoom.isOnline === 1 ? '#007c00' : 'black', // Change color based on isOnline for the specific room type
                                        };
                                    },
                                    width: 120, // Set the width as per your requirement

                                },


                            ]),

                    ];


                    setColumnDefs(newColumnDefs);

                    // Process jsonData to match the new column structure
                    const processedData = jsonData.reduce((acc, item) => {
                        const existingRow = acc.find((row) => row.date === item.inventory_date);
                        if (existingRow) {
                            existingRow[item.roomType] = item.numAvlRooms;
                            existingRow[`${item.roomType}(SellCtrl)`] = item.numSellCtrlRooms;
                            existingRow.isOnline = item.isOnline; // Ensure isOnline is included here

                        } else {
                            const newRow = {
                                date: item.inventory_date,
                                [`${item.roomType}(Avl)`]: item.numAvlRooms,
                                [`${item.roomType}(SellCtrl)`]: item.numSellCtrlRooms,
                                Total: { numAvlRooms: item.numAvlRooms, numSellCtrlRooms: item.numSellCtrlRooms },
                                isOnline: item.isOnline,

                            };
                            acc.push(newRow);
                        }
                        return acc;
                    }, []);


                    setRowData(processedData);
                }
            }
            )


    }


    const onCellValueChanged = useCallback(event => {
        console.log('onCellValueChanged', event)

    }, [])


    // error handling for same guest addition
    const handleError = (message) => {
        return MySwal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            customClass: {
                confirmButton: 'btn btn-danger',

            },
            allowOutsideClick: false,
            confirmButtonText: 'Close',
            confirmButtonColor: 'danger',
            buttonsStyling: false
        })
    }

    const handleSuccess = (message) => {
        return MySwal.fire({
            title: 'Sell Control Rooms!!',
            text: message,
            icon: 'success',
        })
    }





    // ** State
    const [data, setData] = useState(null);
    const [popUp, setPopUp] = useState(false);
    const [fromDateFilter, setFromDateFilter] = useState(null);
    const [toDateFilter, setToDateFilter] = useState(null);
    const [isChecked, setIsChecked] = useState(0);
    const [invLogs, setOpenLogs] = useState(false);
    const [openSellLogs, setOpenSellLogs] = useState(false);
    const [roomTypeIDs, setRoomTypeID] = useState([]);


    // ** Hooks
    const { reset, handleSubmit, control, watch, formState: { errors }
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        setData(data);

        console.log(data)


        let createasset = JSON.stringify({
            "numSellCtrlRooms": data.numSellControl,
            "fromDate": (Moment(String(new Date(data.fromDate[0]))).format('YYYY-MM-DD')),
            "toDate": (Moment(String(new Date(data.toDate[0]))).format('YYYY-MM-DD')),
            // "roomTypeID": data.roomTypeID.value,
            "roomTypeID": roomTypeIDs,
            "isOnline": isChecked

        });
        console.log(createasset);
        let res = fetchx(API_URL + "/addSellControlRooms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: createasset,
        })
            .then(data => data.json())
            .then((res) => {
                console.log(res);
                if (res['statusCode'] == 200) {
                    if (typeof (res.data) === "string") {
                        handleError(res.data)

                    }
                    else {
                        reset();
                        setOpenForm(false)
                        handleSuccess("Successfully update sell control room")
                        getRoomInventoryRates()
                        setOpen('')
                    }

                }
                else {
                    if (res.message === 'failed') {
                        handleError('Access denied!!')
                    }
                    else {
                        handleError(res.message)

                    }   
                }
            });


    };


    const [gridApi, setGridApi] = useState(null);

    const onGridReady = (params) => {
        setGridApi(params.api);
    };



    const fromDate = watch('fromDate');

    const options = {
        minDate: Today
    };
    const optionsToDate = {
        minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
    };


    const handleReset = () => {
        reset({
            numSellCtrlRooms: '',
            fromDate: null,
            toDate: null,
            roomTypeID: null,
            isOnline: 0,

        });
    };


    const handleChange6 = (selectedOption6) => {
        const selectedIds = selectedOption6.map(option => option.value);

        setRoomTypeID(selectedIds);
        console.log(selectedIds);

    };

    const handleChangeButton = () => {
        setIsChecked(prevState => {
            const newState = prevState === 0 ? 1 : 0;
            console.log(newState);
            return newState;
        });
    };


    return (
        <div>
            {/* <Accordion open={open} toggle={toggle}>
                <AccordionItem>
                    <AccordionHeader targetId='1'><h4><b>Sell Control Rooms</b></h4></AccordionHeader>
                    <AccordionBody accordionId='1'> */}
            <Modal isOpen={openForm} toggle={() => setOpenForm(!openForm)} className='modal-lg'>
                <ModalHeader className='modal-lg' toggle={() => setOpenForm(!openForm)}></ModalHeader>
                <ModalBody className='pb-3 px-sm-1 mx-20'>
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h4">Sell Control Rooms</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>



                                    <Col md='4' sm='12' className='mb-1'>
                                        <div className="mb-1">
                                            <Label className="form-label" for="numSellControl">
                                                No. of sell control
                                            </Label>
                                            <InputGroup className="input-group-merge">

                                                <Controller
                                                    id="numSellControl"
                                                    name="numSellControl"
                                                    control={control}
                                                    placeholder="Base Amount"
                                                    render={({ field }) => (
                                                        <Cleave
                                                            pattern='[0-9]{1,15}' title="Only Numbers Allowed" required
                                                            placeholder="No. sell control"
                                                            {...field}
                                                            className={classnames("form-control", {
                                                                "is-invalid":
                                                                    data !== null && (data.numSellControl === null || !data.numSellControl.length)
                                                            })}
                                                        />
                                                    )}
                                                />
                                            </InputGroup>
                                        </div>
                                    </Col>

                                    {Today !== undefined && <Col md='4' sm='12' className='mb-1'>
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
                                                        required
                                                        placeholder="YYYY-MM-DD"
                                                        options={options}

                                                        {...field}
                                                        // options={{ allowInput: true }} 
                                                        className={classnames('form-control', {
                                                            'is-invalid': data !== null && data.fromDate === null
                                                        })}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>}
                                    {Today !== undefined && <Col md='4' sm='12' className='mb-1'>
                                        <div className="mb-1">
                                            <Label className="form-label" for="toDate">
                                                To Date
                                            </Label>
                                            <Controller
                                                control={control}
                                                id='toDate'
                                                name='toDate'
                                                render={({ field }) => (
                                                    <Flatpickr
                                                        required
                                                        placeholder="YYYY-MM-DD"
                                                        {...field}
                                                        // options={{ allowInput: true }} 
                                                        options={optionsToDate}
                                                        className={classnames('form-control', {
                                                            'is-invalid': data !== null && data.toDate === null
                                                        })}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                    }
                                    <Col md='4' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='roomTypeID'>
                                                Room Type ID
                                            </Label>
                                            <Controller
                                                id='roomTypeID'
                                                control={control}
                                                name='roomTypeID'
                                                render={({ field }) => (
                                                    <Select
                                                        isMulti
                                                        required
                                                        isClearable
                                                        options={roomTypeID}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select', { 'is-invalid': data !== null && data.roomTypeID === null })}
                                                        {...field}
                                                        // onChange={handleChange6}
                                                             onChange={(selectedOptions) => {
            field.onChange(selectedOptions); // ✅ updates RHF state
            handleChange6(selectedOptions);  // ✅ your custom logic
          }}

                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>

                                    <Col md='5' sm='12' className='mb-1'>

                                        <div className='form-switch form-check-success' style={{ display: 'flex', alignItems: 'center' }}>

                                            <Input
                                                type='switch'
                                                id='switch-success'
                                                name='success'
                                                checked={isChecked === 1}
                                                onChange={handleChangeButton}
                                                className='switch-input'
                                                style={{
                                                    backgroundColor: isChecked === 1 ? '#086a14' : '#fe0606', // Change color based on isChecked state
                                                }}
                                            />
                                            <p style={{ marginLeft: '10px', marginTop: '14px', color: isChecked === 1 ? '#086a14' : '#0B3BEF' }}>
                                                {isChecked === 1 ? "Online" : "Offline"}
                                            </p>

                                        </div>
                                    </Col>

                                    {/* <Col md='4' sm='12' className='mb-1'> */}
                                    <div className="d-flex">
                                        <Button className="me-1" color="primary" type="submit">
                                            Submit
                                        </Button>
                                        <Button
                                            outline
                                            color="secondary"
                                            type="reset"
                                            onClick={handleReset}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                    {/* </Col> */}
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
            {/* </AccordionBody>
                </AccordionItem>
            </Accordion> */}

            <Card>
                <CardHeader>
                    <CardTitle tag="h4">Room Inventory</CardTitle>
                    <Button className="d-flex justify-content-end" color="primary" onClick={() => setOpenForm(true)}>Add Sell Control Rooms</Button>

                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md='3' sm='12' className='mb-1'>
                            <Label className='form-label' for='fullName'>
                                From Date
                            </Label>
                            <Flatpickr
                                isClearable
                                options={options}
                                type="text"
                                className='form-control'
                                value={fromDateFilter}
                                id="filter-text-box1"
                                placeholder="Filter..."
                                onInput={(event) => {
                                    setFromDateFilter(event.target.value); // Update the state when the input changes
                                }}

                            />
                        </Col>
                        <Col md='3' sm='12' className='mb-1'>
                            <Label className='form-label' for='fullName'>
                                To Date
                            </Label>
                            <Flatpickr

                                // options={{
                                // dateFormat: "j-n-Y",
                                // }}
                                value={toDateFilter}
                                options={optionsToDate}
                                type="text"
                                className='form-control'

                                id="filter-text-box2"
                                placeholder="Filter..."
                                onInput={(event) => {
                                    setToDateFilter(event.target.value); // Update the state when the input changes
                                }}

                            />



                        </Col>


                        <Col md='6' sm='12' className='mt-2'>
                            <Button color='primary' className='me-1' onClick={() => getRoomInventoryRates()}>
                                Apply Filter
                            </Button>
                            <Button
                                className='me-1'
                                onClick={function (e) { e.preventDefault(); setFromDateFilter(null); setToDateFilter(null); getRoomInventoryRates(1) }}
                            >
                                Reset Filter
                            </Button>
                            <Button
                                color='primary'
                                className='me-1'
                                onClick={() => setOpenLogs(true)}
                            >
                                Logs
                            </Button>

                            <Button
                                color='primary'
                                className='me-1'
                                onClick={() => setOpenSellLogs(true)}
                            >
                                Sell Control Logs
                            </Button>
                        </Col>
                    </Row>

                    <Modal
                        isOpen={invLogs}
                        toggle={() => setOpenLogs(!invLogs)}
                        style={{ maxWidth: '1400px', maxHeight: '60vh' }}
                    >
                        <ModalHeader toggle={() => setOpenLogs(!invLogs)} className='bg-transparent'></ModalHeader>
                        <ModalBody className='px-sm-4'>
                            <InventoryLogs />

                        </ModalBody>
                    </Modal>

                    <Modal
                        isOpen={openSellLogs}
                        toggle={() => setOpenSellLogs(!openSellLogs)}
                        style={{ maxWidth: '1400px', maxHeight: '60vh' }}
                    >
                        <ModalHeader toggle={() => setOpenSellLogs(!openSellLogs)} className='bg-transparent'></ModalHeader>
                        <ModalBody className='px-sm-4'>
                            <SellControlLogs />

                        </ModalBody>
                    </Modal>


                    <div className="ag-theme-alpine" style={{ height: 520 }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowData} columnDefs={columnDefs}
                            animateRows={true} rowSelection='multiple'
                            onCellClicked={cellClickedListener}
                            // paginationAutoPageSize = 'true'
                            onCellValueChanged={onCellValueChanged}
                            paginationPageSize='10'
                            pagination='true'
                            defaultColDef={defaultColDef}
                            headerColor="ddw-primary"
                            onGridReady={onGridReady}
                        />
                    </div>
                </CardBody>
            </Card>
            {/* <App/> */}
        </div>
    );
};

export default RoomInventory;
