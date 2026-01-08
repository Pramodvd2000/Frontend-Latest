// // // import 'ag-grid-enterprise'
// // // import { AgGridReact } from 'ag-grid-react'
// // // import '/node_modules/ag-grid-community/styles/ag-grid.css'
// // // import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// // // import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
// // // import { Modal, ModalBody, ModalHeader } from 'reactstrap';

// // // import { format } from "date-fns";
// // // import { Card, CardHeader, CardText, CardTitle, Label, Col, Input, Row, Button } from 'reactstrap';
// // // import API_URL from '../../../config';
// // // import { useForm, Controller } from "react-hook-form";
// // // import Flatpickr from "react-flatpickr";
// // // import Moment from 'moment';
// // // import classnames from "classnames";
// // // import { useNavigate } from 'react-router-dom'

// // // import Swal from 'sweetalert2'
// // // import withReactContent from 'sweetalert2-react-content'
// // // const MySwal = withReactContent(Swal)
// // // import Backdrop from '@mui/material/Backdrop';
// // // import CircularProgress from '@mui/material/CircularProgress'
// // // import BlockedDynamicPricingPage from './blockedDynamicPricing';


// // // const DynamicPricingDayWise = (props) => {
// // //     let navigate = useNavigate();
// // //     const [rowData, setRowData] = useState([]);
// // //     const [Today, setToday] = useState()
// // //     const [popUp2, setPopUp2] = useState(false);
// // //     const [popUpData2, setPopUpData2] = useState();
// // //     const [open, setOpen] = useState(false);
// // //     const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
// // //     const [openModal, setOpenModal] = useState(false);

// // //     const handleSuccess = (message) => {
// // //         return MySwal.fire({
// // //             title: 'Dynamic Pricing',
// // //             text: message,
// // //             icon: 'success',
// // //             customClass: {
// // //                 confirmButton: 'btn btn-primary'
// // //             },
// // //             buttonsStyling: false
// // //         })
// // //     }


// // //     const handleError = (message) => {
// // //         return MySwal.fire({
// // //             title: 'Error!',
// // //             text: message,
// // //             icon: 'error',
// // //             customClass: {
// // //                 confirmButton: 'btn btn-danger',

// // //             },
// // //             allowOutsideClick: false,
// // //             confirmButtonText: 'Close',
// // //             confirmButtonColor: 'danger',
// // //             buttonsStyling: false
// // //         })
// // //     }

// // //     useEffect(() => {
// // //         const hotelIDData = JSON.stringify({
// // //             hotelID: 1
// // //         })
// // //         fetchx(API_URL + "/getBusinessDate", {
// // //             method: "POST",
// // //             headers: { 'Content-Type': 'application/json' },
// // //             body: hotelIDData
// // //         }).then((res) => res.json())
// // //             .then(postres => {
// // //                 const today = new Date(postres['data'][0]['businessDate']);
// // //                 const tomorrow = new Date(today);
// // //                 tomorrow.setDate(today.getDate() + 1);
// // //                 setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
// // //             })
// // //     }, []);

// // //     // ** Hooks
// // //     const { reset, handleSubmit, control, watch, formState: { errors }
// // //     } = useForm({});


// // //     const gridRef = useRef();



// // //     const defaultColDef = useMemo(() => (
// // //         {
// // //             sortable: true,
// // //             filter: true,
// // //             wrapHeaderText: true,
// // //             filterParams: {
// // //                 buttons: ['apply', 'reset']
// // //             }
// // //         }
// // //     ));

// // //     const cellClickedListener = useCallback(event => {
// // //         console.log('cellClicked', event);
// // //     }, []);


// // //     const handleModalClose = () => {
// // //         setPopUp2(false);
// // //         fetchData(); // Your API function
// // //     };


// // //     // const fetchData = () => {
// // //     //     console.log(watch('fromDate'))
// // //     //     const startDate = watch('fromDate')
// // //     //     const endDate = watch('toDate')
// // //     //     console.log(watch('fromDate'), Moment(String(new Date(watch('fromDate')))).format('YYYY-MM-DD'))
// // //     //     const FromDate = (startDate === null || startDate === undefined) ? null : (Moment(String(new Date(watch('fromDate')))).format('YYYY-MM-DD'))
// // //     //     const ToDate = (endDate === null || endDate === undefined) ? null : (Moment(String(new Date(watch('toDate')))).format('YYYY-MM-DD'))
// // //     //     const RoomID = watch('roomID') === '' ? null : watch('roomID')
// // //     //     let confirmRate = JSON.stringify({

// // //     //         hotelID: 1,
// // //     //         fromDate: FromDate,
// // //     //         toDate: ToDate,
// // //     //         roomID: RoomID,
// // //     //     })

// // //     //     fetchx(API_URL + "/getDynamicPricingDayWiseAll", {
// // //     //         // fetchx("http://122.166.2.21:14702/getOccupancyRoomWise", {
// // //     //         method: "POST",
// // //     //         headers: { 'Content-Type': 'application/json' },
// // //     //         body: confirmRate
// // //     //     }).then(result => result.json())
// // //     //         .then(res => {
// // //     //             // var rowData = res.data;
// // //     //             if (res.statusCode === 200) {
// // //     //                 setRowData(res['data'])
// // //     //                 console.log(res['data'])
// // //     //                 // const transformedData = rowData.map((item) => ({
// // //     //                 //   roomNumber: item.roomNumber,
// // //     //                 //   floorID: item.floorID,
// // //     //                 //   ...item.occupancy_dates
// // //     //                 // }));
// // //     //             }
// // //     //             // setRowData(transformedData);
// // //     //         }, []);

// // //     //     // })
// // //     // }

// // //     const onCellValueChanged = (event) => {
// // //         console.log('onCellValueChanged', event);
// // //         const field = event.colDef.field;          // e.g., "KSUP"
// // //         const newValue = event.newValue;
// // //         const oldValue = event.oldValue;
// // //         const occupancy = event.data.Occupancy;    // e.g., "<10"
// // //         const date = event.data.Date;              // e.g., "23 Sep 24"
// // //         const roomTypeID = event.data.roomTypeIDs?.[field]; // e.g., 1

// // //         console.log('Changed Room Type ID:', roomTypeID);
// // //         console.log('Occupancy:', occupancy);
// // //         console.log('Date:', date);
// // //         console.log('New Value:', newValue);


// // //         if (!isNaN(newValue) && !isNaN(oldValue)) {

// // //             setPopUp2('Do you want to change amount from ' + oldValue + ' to ' + newValue + ' for room type ' + field + ' ?');
// // //             setPopUpData2({ newValue: newValue, roomTypeID: roomTypeID, occupancy: occupancy, date: date });

// // //         } else {
// // //             handleError('Invalid amount');
// // //             fetchData();

// // //         }

// // //         // }

// // //         // }
// // //     };

// // //     function baseAmountSubmit(data) {
// // //         const unAssign = JSON.stringify({
// // //             baseAmount: data.newValue,
// // //             roomTypeID: data.roomTypeID,
// // //             occupancy: data.occupancy,
// // //             date: format(new Date(data.date), 'yyyy-MM-dd'),
// // //         });

// // //         console.log(unAssign)
// // //         fetchx(API_URL + "/updateDynamicPricingAmountEdit", {
// // //             method: "POST",
// // //             headers: { "Content-Type": "application/json" },
// // //             body: unAssign,
// // //         })
// // //             .then(result => result.json())
// // //             .then(data => {
// // //                 navigate('')
// // //                 handleSuccess('Updated successfully!!')
// // //                 setPopUpData2()
// // //             })
// // //     }

// // //     const fetchData = () => {

// // //         setOpen(true);
// // //         const timeout = setTimeout(() => {
// // //             setShowSecondaryMessage(true);
// // //         }, 5000);

// // //         const startDate = watch('fromDate');
// // //         const endDate = watch('toDate');
// // //         const FromDate = startDate ? Moment(String(new Date(startDate))).format('YYYY-MM-DD') : null;
// // //         const ToDate = endDate ? Moment(String(new Date(endDate))).format('YYYY-MM-DD') : null;
// // //         const RoomID = watch('roomID') === '' ? null : watch('roomID');

// // //         const confirmRate = JSON.stringify({
// // //             hotelID: 1,
// // //             fromDate: FromDate,
// // //             toDate: ToDate,
// // //             roomID: RoomID,
// // //         });

// // //         fetchx(API_URL + "/getDynamicPricingDayWiseAll", {
// // //             method: "POST",
// // //             headers: { 'Content-Type': 'application/json' },
// // //             body: confirmRate
// // //         })
// // //             .then(result => result.json())
// // //             .then(res => {
// // //                 if (res.statusCode === 200) {
// // //                     const data = res['data'];
// // //                     if (data.length === 0) {
// // //                         setOpen(false)
// // //                         return
// // //                     };
// // //                     const allRoomTypes = new Set();
// // //                     const occupancyKeys = [];
// // //                     const groupedByDate = {};


// // //                     data.sort((a, b) => a.roomTypeID - b.roomTypeID);

// // //                     // Step 1: Collect all room types, occupancy keys, and group by date
// // //                     data.forEach(item => {
// // //                         allRoomTypes.add(item.roomType);
// // //                         console.log(item)
// // //                         Object.keys(item).forEach(key => {
// // //                             if (!['id', 'hotelID', 'inventoryDate', 'roomTypeID', 'roomType'].includes(key)) {
// // //                                 if (!occupancyKeys.includes(key)) {
// // //                                     occupancyKeys.push(key);
// // //                                 }
// // //                             }
// // //                         });

// // //                         const date = item.inventoryDate;
// // //                         if (!groupedByDate[date]) {
// // //                             groupedByDate[date] = [];
// // //                         }
// // //                         groupedByDate[date].push(item);
// // //                     });



// // //                     const allRoomTypeList = [...allRoomTypes];
// // //                     const rows = [];
// // //                     const sortedRoomTypes = [...allRoomTypeList].sort((a, b) => a.value - b.value);
// // //                     // Step 2: Build transposed rows for each date
// // //                     Object.entries(groupedByDate).forEach(([date, entries]) => {
// // //                         occupancyKeys.forEach(occKey => {
// // //                             const row = { Date: format(new Date(date), 'dd MMM yy'), Occupancy: occKey, roomTypeIDs: {} };

// // //                             sortedRoomTypes.forEach(roomType => {
// // //                                 const match = entries.find(e => e.roomType === roomType);
// // //                                 row[roomType] = match ? match[occKey] : '';
// // //                                 if (match) {
// // //                                     row.roomTypeIDs[roomType] = match.roomTypeID;
// // //                                 }
// // //                             });

// // //                             rows.push(row);
// // //                         });
// // //                     });

// // //                     // Step 3: Build column defs
// // //                     // const columnDefs = [
// // //                     //     {
// // //                     //         headerName: 'Date', field: 'Date', width: 120, pinned: 'left', cellRenderer: (params) => {
// // //                     //             const rowIndex = params.rowIndex;
// // //                     //             const data = params.api.getDisplayedRowAtIndex(rowIndex)?.data;
// // //                     //             const prevData = params.api.getDisplayedRowAtIndex(rowIndex - 1)?.data;
// // //                     //             if (!prevData || data.Date !== prevData.Date) {
// // //                     //                 const formattedDate = format(new Date(data.Date), 'dd MMM yy');
// // //                     //                 return formattedDate;
// // //                     //             } else {
// // //                     //                 return ''; // Show empty string for duplicate dates
// // //                     //             }
// // //                     //         }
// // //                     //     },
// // //                     //     { headerName: 'Occupancy %', field: 'Occupancy', width: 140, pinned: 'left' },
// // //                     //     ...allRoomTypeList.map(roomType => ({
// // //                     //         headerName: roomType,
// // //                     //         field: roomType,
// // //                     //         editable: true,
// // //                     //         type: 'numericColumn',
// // //                     //         width: 100
// // //                     //     }))
// // //                     // ];

// // //                     const columnDefs = [
// // //                         {
// // //                             headerName: 'Date',
// // //                             field: 'Date',
// // //                             rowGroup: true,
// // //                             hide: true // hide because it's used for grouping
// // //                         },
// // //                         { headerName: 'Occupancy %', field: 'Occupancy', width: 140 },
// // //                         ...allRoomTypeList.map(roomType => ({
// // //                             headerName: roomType,
// // //                             field: roomType,
// // //                             editable: true,
// // //                             type: 'numericColumn',
// // //                             width: 100
// // //                         }))
// // //                     ];

// // //                     setOpen(false);
// // //                     setColumnDefs(columnDefs);
// // //                     console.log(rows)
// // //                     setRowData(rows);
// // //                 }
// // //             });

// // //     };


// // //     useEffect(() => {
// // //         fetchData()

// // //         if (popUp2 === false) {
// // //             fetchData()

// // //         }
// // //     }, []);


// // //     const [columnDefs, setColumnDefs] = useState([
// // //         // { headerName: 'Date', field: 'inventoryDate' },
// // //         // { headerName: 'Room Type', field: 'roomType' },


// // //     ]);

// // //     // console.log(columnDefs[1].field)


// // //     const buttonListener = useCallback(e => {
// // //         gridRef.current.api.deselectAll();
// // //     }, []);

// // //     // const onFilterTextBoxChanged10 = useCallback(() => {
// // //     //   gridRef.current.api.setQuickFilter(
// // //     //     document.getElementById('floorNumber').value
// // //     //   );
// // //     // }, []);
// // //     const [filterValue, setFilterValue] = useState('');


// // //     const onFilterTextBoxChanged10 = (event) => {
// // //         const { value } = event.target;
// // //         setFilterValue(value);
// // //         // gridRef.current?.setQuickFilter(value);
// // //         const columnId = columnDefs[1].field;
// // //         console.log(value)
// // //         gridRef.current?.setFilterModel({
// // //             [columnId]: { type: 'contains', filter: value }
// // //         });
// // //     };


// // //     const fromDate = watch('fromDate');


// // //     //// For Disabling Past Date
// // //     const options = {
// // //         minDate: Today
// // //     };
// // //     const optionsToDate = {
// // //         minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
// // //     };



// // //     const handleResetFilter = () => {
// // //         reset({
// // //             roomID: '',
// // //             fromDate: null,
// // //             toDate: null,
// // //         });
// // //         fetchData()
// // //     };



// // //     return (
// // //         <div>

// // //             <div>
// // //                 <Row>
// // //                     <Col md='3' sm='12' className='mb-1'>
// // //                         <div className="mb-1">
// // //                             <Label className="form-label" for="fromDate">
// // //                                 From Date
// // //                             </Label>
// // //                             <Controller
// // //                                 control={control}
// // //                                 id='fromDate'
// // //                                 name='fromDate'
// // //                                 render={({ field }) => (
// // //                                     <Flatpickr
// // //                                         // required
// // //                                         options={options}
// // //                                         placeholder='YYYY-MM-DD'
// // //                                         {...field}
// // //                                         className='form-control'


// // //                                     />
// // //                                 )}
// // //                             />
// // //                         </div>
// // //                     </Col>

// // //                     <Col md='3' sm='12' className='mb-1'>
// // //                         <div className='mb-1'>
// // //                             <Label className='form-label' for='toDate'>
// // //                                 To Date
// // //                             </Label>
// // //                             <Controller
// // //                                 control={control}
// // //                                 id='toDate'
// // //                                 name='toDate'
// // //                                 render={({ field }) => (
// // //                                     <Flatpickr
// // //                                         placeholder='YYYY-MM-DD'
// // //                                         {...field}
// // //                                         options={optionsToDate}
// // //                                         // options={{ allowInput: true }}
// // //                                         className='form-control'

// // //                                     />
// // //                                 )}
// // //                             />
// // //                         </div>
// // //                     </Col>

// // //                     <Col md='3' sm='12' className='mt-2'>
// // //                         <div className="d-flex">

// // //                             <Button color='primary' className='me-1' onClick={() => fetchData()}>
// // //                                 Apply Filter
// // //                             </Button>
// // //                             <Button
// // //                                 className='me-1'

// // //                                 onClick={handleResetFilter}
// // //                             >
// // //                                 Reset Filter
// // //                             </Button>
// // //                         </div>
// // //                     </Col>
// // //                 </Row>
// // //             </div>
// // //             {/* <br></br> */}
// // //             {/* <p style={{ color: "blue" }}>Double click to edit!!</p>
// // //           <Button color='primary' onClick={() => ("ss")}>Upload Sheet</Button>
// // //            */}
// // //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// // //                 <p style={{ color: "blue", margin: 0 }}>Double click to edit!!</p>
// // //                 <Button color='primary' onClick={() => setOpenModal(!openModal)}>Blocked Dynamic Pricing List</Button>
// // //             </div>

// // //             {/* <button onClick={buttonListener}>Push Me</button> */}
// // //             <div className="ag-theme-alpine" style={{ height: 660 }}>
// // //                 <AgGridReact
// // //                     ref={gridRef}
// // //                     rowData={rowData} columnDefs={columnDefs}
// // //                     animateRows={true} rowSelection='multiple'
// // //                     onCellClicked={cellClickedListener}
// // //                     // paginationAutoPageSize = 'true'
// // //                     onGridReady={params => {
// // //                         gridRef.current = params.api;
// // //                     }}
// // //                     onCellValueChanged={onCellValueChanged}
// // //                     groupDisplayType="singleColumn" // 👈 groups shown in one column
// // //                     autoGroupColumnDef={{
// // //                         headerName: 'Date',
// // //                         minWidth: 200,
// // //                         cellRendererParams: {
// // //                             suppressCount: true // don't show child count next to Date
// // //                         }
// // //                     }}
// // //                     paginationPageSize='20'
// // //                     pagination='true'
// // //                     defaultColDef={defaultColDef}
// // //                     headerColor="ddw-primary"
// // //                     masterDetail={false}

// // //                 />
// // //             </div>

// // //             {popUp2 && (
// // //                 <div className="modal-dialog-centered">
// // //                     <Modal
// // //                         isOpen={popUp2}
// // //                         // toggle={() => setPopUp2(!popUp2)}
// // //                         toggle={handleModalClose}

// // //                         className='modal-dialog-centered'
// // //                         backdrop="static"   // ⛔ disables outside click
// // //                         keyboard={false}
// // //                     >
// // //                         {" "}
// // //                         <ModalHeader
// // //                             className="modal-sm"
// // //                             // toggle={() => {
// // //                             //     setPopUp2(!popUp2);
// // //                             // }}
// // //                             toggle={handleModalClose}

// // //                         >
// // //                             Need To Check..
// // //                         </ModalHeader>
// // //                         <ModalBody className="pb-3 px-sm-2 mx-20">
// // //                             <div>
// // //                                 <b>{popUp2}</b>
// // //                                 <br></br>
// // //                                 <br></br>
// // //                                 <div className="d-flex">
// // //                                     <Button
// // //                                         color="primary"
// // //                                         className="me-1"
// // //                                         // className="text-center"
// // //                                         onClick={() => { popUpData2 && baseAmountSubmit(popUpData2) }}
// // //                                     >
// // //                                         Confirm
// // //                                     </Button>
// // //                                     <Button
// // //                                         color="danger"
// // //                                         className="me-1"
// // //                                         // className="text-center"
// // //                                         onClick={() => { setPopUp2(false), fetchData() }}
// // //                                     >
// // //                                         Cancel
// // //                                     </Button>
// // //                                 </div>
// // //                             </div>
// // //                         </ModalBody>
// // //                     </Modal>
// // //                 </div>
// // //             )}

// // //             {/* BackDrop For messages */}
// // //             <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
// // //                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // //                     <h1 style={{ fontWeight: 'bold', color: 'white' }}>
// // //                         Loading data, please wait...
// // //                     </h1>
// // //                     {showSecondaryMessage && (
// // //                         <h1 style={{ fontWeight: 'bold', color: 'white' }}>
// // //                             Loading records... This may take a few seconds if there's a lot of data.
// // //                         </h1>
// // //                     )}
// // //                     <CircularProgress color="inherit" />
// // //                 </div>
// // //             </Backdrop>


// // //             <Modal isOpen={openModal} toggle={() => setOpenModal(!openModal)} className="modal-xl">
// // //                 <ModalHeader toggle={() => setOpenModal(!openModal)} className="modal-xl">
// // //                     Blocked Dynamic Pricing List
// // //                 </ModalHeader>
// // //                 <ModalBody className="modal-xl">
// // //                     <div>
// // //                         <BlockedDynamicPricingPage />
// // //                     </div>
// // //                 </ModalBody>
// // //             </Modal>
// // //         </div>
// // //     );
// // // }

// // // export default DynamicPricingDayWise;


// // import 'ag-grid-enterprise'
// // import { AgGridReact } from 'ag-grid-react'
// // import '/node_modules/ag-grid-community/styles/ag-grid.css'
// // import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// // import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
// // import { Modal, ModalBody, ModalHeader } from 'reactstrap';

// // import { format } from "date-fns";
// // import { Card, CardHeader, CardText, CardTitle, Label, Col, Input, Row, Button } from 'reactstrap';
// // import API_URL from '../../../config';
// // import { useForm, Controller } from "react-hook-form";
// // import Flatpickr from "react-flatpickr";
// // import Moment from 'moment';
// // import classnames from "classnames";
// // import { useNavigate } from 'react-router-dom'

// // import Swal from 'sweetalert2'
// // import withReactContent from 'sweetalert2-react-content'
// // const MySwal = withReactContent(Swal)
// // import Backdrop from '@mui/material/Backdrop';
// // import CircularProgress from '@mui/material/CircularProgress'
// // import BlockedDynamicPricingPage from './blockedDynamicPricing';

// // const DynamicPricingDayWise = (props) => {
// //     let navigate = useNavigate();
// //     const [rowData, setRowData] = useState([]);
// //     const [Today, setToday] = useState()
// //     const [popUp2, setPopUp2] = useState(false);
// //     const [popUpData2, setPopUpData2] = useState();
// //     const [open, setOpen] = useState(false);
// //     const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
// //     const [openModal, setOpenModal] = useState(false);
// //     const [occupancyRanges, setOccupancyRanges] = useState([]);

// //     const handleSuccess = (message) => {
// //         return MySwal.fire({
// //             title: 'Dynamic Pricing',
// //             text: message,
// //             icon: 'success',
// //             customClass: {
// //                 confirmButton: 'btn btn-primary'
// //             },
// //             buttonsStyling: false
// //         })
// //     }

// //     const handleError = (message) => {
// //         return MySwal.fire({
// //             title: 'Error!',
// //             text: message,
// //             icon: 'error',
// //             customClass: {
// //                 confirmButton: 'btn btn-danger',
// //             },
// //             allowOutsideClick: false,
// //             confirmButtonText: 'Close',
// //             confirmButtonColor: 'danger',
// //             buttonsStyling: false
// //         })
// //     }

// //     useEffect(() => {
// //         const hotelIDData = JSON.stringify({
// //             hotelID: 1
// //         })
// //         fetchx(API_URL + "/getBusinessDate", {
// //             method: "POST",
// //             headers: { 'Content-Type': 'application/json' },
// //             body: hotelIDData
// //         }).then((res) => res.json())
// //             .then(postres => {
// //                 const today = new Date(postres['data'][0]['businessDate']);
// //                 const tomorrow = new Date(today);
// //                 tomorrow.setDate(today.getDate() + 1);
// //                 setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
// //             })
// //     }, []);

// //     // ** Hooks
// //     const { reset, handleSubmit, control, watch, formState: { errors }
// //     } = useForm({});

// //     const gridRef = useRef();

// //     const defaultColDef = useMemo(() => (
// //         {
// //             sortable: true,
// //             filter: true,
// //             wrapHeaderText: true,
// //             filterParams: {
// //                 buttons: ['apply', 'reset']
// //             }
// //         }
// //     ));

// //     const cellClickedListener = useCallback(event => {
// //         console.log('cellClicked', event);
// //     }, []);

// //     const handleModalClose = () => {
// //         setPopUp2(false);
// //         fetchData(); // Your API function
// //     };

// //     const onCellValueChanged = (event) => {
// //         console.log('onCellValueChanged', event);
// //         const field = event.colDef.field;          // e.g., "KSUP"
// //         const newValue = event.newValue;
// //         const oldValue = event.oldValue;
// //         const occupancy = event.data.Occupancy;    // e.g., "<10"
// //         const date = event.data.Date;              // e.g., "23 Sep 24"
// //         const roomTypeID = event.data.roomTypeIDs?.[field]; // e.g., 1

// //         console.log('Changed Room Type ID:', roomTypeID);
// //         console.log('Occupancy:', occupancy);
// //         console.log('Date:', date);
// //         console.log('New Value:', newValue);

// //         if (!isNaN(newValue) && !isNaN(oldValue)) {
// //             setPopUp2('Do you want to change amount from ' + oldValue + ' to ' + newValue + ' for room type ' + field + ' ?');
// //             setPopUpData2({ newValue: newValue, roomTypeID: roomTypeID, occupancy: occupancy, date: date });
// //         } else {
// //             handleError('Invalid amount');
// //             fetchData();
// //         }
// //     };

// //     function baseAmountSubmit(data) {
// //         const unAssign = JSON.stringify({
// //             baseAmount: data.newValue,
// //             roomTypeID: data.roomTypeID,
// //             occupancy: data.occupancy,
// //             date: format(new Date(data.date), 'yyyy-MM-dd'),
// //         });

// //         console.log(unAssign)
// //         fetchx(API_URL + "/updateDynamicPricingAmountEdit", {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: unAssign,
// //         })
// //             .then(result => result.json())
// //             .then(data => {
// //                 navigate('')
// //                 handleSuccess('Updated successfully!!')
// //                 setPopUpData2()
// //             })
// //     }

// //     // Function to determine which occupancy range a value falls into
// //     // const getOccupancyRange = (value) => {
// //     //     if (value < 10) return "<10";
// //     //     if (value >= 10 && value < 15) return "10 - 15";
// //     //     if (value >= 15 && value < 20) return "15 - 20";
// //     //     if (value >= 20 && value < 25) return "20 - 25";
// //     //     if (value >= 25 && value < 30) return "25 - 30";
// //     //     if (value >= 30 && value < 35) return "30 - 35";
// //     //     if (value >= 35 && value < 40) return "35 - 40";
// //     //     if (value >= 40 && value < 45) return "40 - 45";
// //     //     if (value >= 45 && value < 50) return "45 - 50";
// //     //     if (value >= 50 && value < 55) return "50 - 55";
// //     //     if (value >= 55 && value < 60) return "55 - 60";
// //     //     if (value >= 60 && value < 65) return "60 - 65";
// //     //     if (value >= 65 && value < 70) return "65 - 70";
// //     //     if (value >= 70 && value < 75) return "70 - 75";
// //     //     if (value >= 75 && value < 80) return "75 - 80";
// //     //     if (value >= 80 && value < 85) return "80 - 85";
// //     //     if (value >= 85 && value < 90) return "85 - 90";
// //     //     if (value >= 90 && value < 95) return "90 - 95";
// //     //     return ">95";
// //     // };


// //     const getOccupancyRange = (value, occupancyKeys) => {
// //   // Sort the keys to ensure proper comparison
// //   const sortedKeys = [...occupancyKeys].sort((a, b) => {
// //     // Handle special cases first
// //     if (a === "<10") return -1;
// //     if (b === "<10") return 1;
// //     if (a === ">95") return 1;
// //     if (b === ">95") return -1;

// //     // Extract numbers from ranges like "10 - 15"
// //     const aMin = parseInt(a.split(' - ')[0] || a.split(' ')[0]);
// //     const bMin = parseInt(b.split(' - ')[0] || b.split(' ')[0]);

// //     return aMin - bMin;
// //   });

// //   // Find which range the value falls into
// //   for (const key of sortedKeys) {
// //     if (key === "<10" && value < 10) return key;
// //     if (key === ">95" && value >= 95) return key;

// //     if (key.includes(" - ")) {
// //       const [min, max] = key.split(" - ").map(Number);
// //       if (value >= min && value < max) return key;
// //     }
// //   }

// //   // Default case (shouldn't normally happen)
// //   return ">95";
// // };

// //     // const fetchData = () => {
// //     //     setOpen(true);
// //     //     const timeout = setTimeout(() => {
// //     //         setShowSecondaryMessage(true);
// //     //     }, 5000);

// //     //     const startDate = watch('fromDate');
// //     //     const endDate = watch('toDate');
// //     //     const FromDate = startDate ? Moment(String(new Date(startDate))).format('YYYY-MM-DD') : null;
// //     //     const ToDate = endDate ? Moment(String(new Date(endDate))).format('YYYY-MM-DD') : null;
// //     //     const RoomID = watch('roomID') === '' ? null : watch('roomID');

// //     //     const confirmRate = JSON.stringify({
// //     //         hotelID: 1,
// //     //         fromDate: FromDate,
// //     //         toDate: ToDate,
// //     //         roomID: RoomID,
// //     //     });

// //     //     fetchx(API_URL + "/getDynamicPricingDayWiseAll", {
// //     //         method: "POST",
// //     //         headers: { 'Content-Type': 'application/json' },
// //     //         body: confirmRate
// //     //     })
// //     //         .then(result => result.json())
// //     //         .then(res => {
// //     //             if (res.statusCode === 200) {
// //     //                 const data = res['data'];
// //     //                 if (data.length === 0) {
// //     //                     setOpen(false)
// //     //                     return
// //     //                 };

// //     //                 const allRoomTypes = new Set();
// //     //                 const occupancyKeys = [];
// //     //                 const groupedByDate = {};
// //     //                 const dateOccupancyMap = {}; // To store which occupancy range to highlight for each date

// //     //                 data.sort((a, b) => a.roomTypeID - b.roomTypeID);

// //     //                 // Step 1: Collect all room types, occupancy keys, and group by date
// //     //                 data.forEach(item => {
// //     //                     allRoomTypes.add(item.roomType);

// //     //                     Object.keys(item).forEach(key => {
// //     //                         // if (!['id', 'hotelID', 'inventoryDate', 'roomTypeID', 'roomType'].includes(key)) {
// //     //                         if (!['id', 'hotelID', 'inventoryDate', 'roomTypeID', 'roomType', 
// //     //   'isOverRightAllowed', 'totalRooms', 'totalOccupancy'].includes(key)) {
// //     //                             if (!occupancyKeys.includes(key)) {
// //     //                                 occupancyKeys.push(key);
// //     //                             }
// //     //                         }
// //     //                     });

// //     //                     const date = item.inventoryDate;
// //     //                     if (!groupedByDate[date]) {
// //     //                         groupedByDate[date] = [];
// //     //                     }
// //     //                     groupedByDate[date].push(item);

// //     //                     // Store the occupancy range for this date based on totalOccupancy
// //     //                     if (!dateOccupancyMap[date]) {
// //     //                         dateOccupancyMap[date] = getOccupancyRange(item.totalOccupancy, occupancyKeys);
// //     //                     }
// //     //                 });

// //     //                 const allRoomTypeList = [...allRoomTypes];
// //     //                 const rows = [];
// //     //                 const sortedRoomTypes = [...allRoomTypeList].sort((a, b) => a.value - b.value);

// //     //                 // Step 2: Build transposed rows for each date
// //     //                 Object.entries(groupedByDate).forEach(([date, entries]) => {
// //     //                     occupancyKeys.forEach(occKey => {
// //     //                         const row = { 
// //     //                             Date: format(new Date(date), 'dd MMM yy'), 
// //     //                             Occupancy: occKey, 
// //     //                             roomTypeIDs: {},
// //     //                             // Add a flag to indicate if this row should be highlighted
// //     //                             highlight: dateOccupancyMap[date] === occKey
// //     //                         };

// //     //                         sortedRoomTypes.forEach(roomType => {
// //     //                             const match = entries.find(e => e.roomType === roomType);
// //     //                             row[roomType] = match ? match[occKey] : '';
// //     //                             if (match) {
// //     //                                 row.roomTypeIDs[roomType] = match.roomTypeID;
// //     //                             }
// //     //                         });

// //     //                         rows.push(row);
// //     //                     });
// //     //                 });

// //     //                 // Store occupancy ranges for later use
// //     //                 setOccupancyRanges(occupancyKeys);

// //     //                 // Step 3: Build column defs
// //     //                 const columnDefs = [
// //     //                     {
// //     //                         headerName: 'Date',
// //     //                         field: 'Date',
// //     //                         rowGroup: true,
// //     //                         hide: true // hide because it's used for grouping
// //     //                     },
// //     //                     { 
// //     //                         headerName: 'Occupancy %', 
// //     //                         field: 'Occupancy', 
// //     //                         width: 140,
// //     //                         cellStyle: params => {
// //     //                             if (params.data && params.data.highlight) {
// //     //                                 return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
// //     //                             }
// //     //                             return null;
// //     //                         }
// //     //                     },
// //     //                     ...allRoomTypeList.map(roomType => ({
// //     //                         headerName: roomType,
// //     //                         field: roomType,
// //     //                         editable: true,
// //     //                         type: 'numericColumn',
// //     //                         width: 100,
// //     //                         cellStyle: params => {
// //     //                             if (params.data && params.data.highlight) {
// //     //                                 return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
// //     //                             }
// //     //                             return null;
// //     //                         }
// //     //                     }))
// //     //                 ];

// //     //                 setOpen(false);
// //     //                 setColumnDefs(columnDefs);
// //     //                 console.log(rows)
// //     //                 setRowData(rows);
// //     //             }
// //     //         });
// //     // };



// // //     const fetchData = () => {
// // //     setOpen(true);
// // //     const timeout = setTimeout(() => {
// // //         setShowSecondaryMessage(true);
// // //     }, 5000);

// // //     const startDate = watch('fromDate');
// // //     const endDate = watch('toDate');
// // //     const FromDate = startDate ? Moment(String(new Date(startDate))).format('YYYY-MM-DD') : null;
// // //     const ToDate = endDate ? Moment(String(new Date(endDate))).format('YYYY-MM-DD') : null;
// // //     const RoomID = watch('roomID') === '' ? null : watch('roomID');

// // //     const confirmRate = JSON.stringify({
// // //         hotelID: 1,
// // //         fromDate: FromDate,
// // //         toDate: ToDate,
// // //         roomID: RoomID,
// // //     });

// // //     fetchx(API_URL + "/getDynamicPricingDayWiseAll", {
// // //         method: "POST",
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: confirmRate
// // //     })
// // //         .then(result => result.json())
// // //         .then(res => {
// // //             if (res.statusCode === 200) {
// // //                 const data = res['data'];
// // //                 if (data.length === 0) {
// // //                     setOpen(false)
// // //                     return
// // //                 };
// // //                 const allRoomTypes = new Set();
// // //                 const occupancyKeys = [];
// // //                 const groupedByDate = {};
// // //                 const dateOccupancyMap = {}; // To store which occupancy range to highlight for each date

// // //                 data.sort((a, b) => a.roomTypeID - b.roomTypeID);

// // //                 // Step 1: Collect all room types, occupancy keys, and group by date
// // //                 data.forEach(item => {
// // //                     allRoomTypes.add(item.roomType);

// // //                     // Only include occupancy range keys, exclude other metadata
// // //                     Object.keys(item).forEach(key => {
// // //                         if (!['id', 'hotelID', 'inventoryDate', 'roomTypeID', 'roomType', 
// // //                               'isOverRightAllowed', 'totalRooms', 'totalOccupancy'].includes(key)) {
// // //                             if (!occupancyKeys.includes(key)) {
// // //                                 occupancyKeys.push(key);
// // //                             }
// // //                         }
// // //                     });

// // //                     const date = item.inventoryDate;
// // //                     if (!groupedByDate[date]) {
// // //                         groupedByDate[date] = [];
// // //                     }
// // //                     groupedByDate[date].push(item);

// // //                     // Store the occupancy range for this date based on totalOccupancy
// // //                     if (!dateOccupancyMap[date]) {
// // //                         dateOccupancyMap[date] = getOccupancyRange(item.totalOccupancy, occupancyKeys);
// // //                     }
// // //                 });

// // //                 const allRoomTypeList = [...allRoomTypes];
// // //                 const rows = [];
// // //                 const sortedRoomTypes = [...allRoomTypeList].sort((a, b) => a.value - b.value);

// // //                 // Step 2: Build transposed rows for each date
// // //                 Object.entries(groupedByDate).forEach(([date, entries]) => {
// // //                     const formattedDate = format(new Date(date), 'dd MMM yy');
// // //                     const monthYear = format(new Date(date), 'MMM yyyy'); // Extract month and year for grouping

// // //                     occupancyKeys.forEach(occKey => {
// // //                         const row = { 
// // //                             Date: formattedDate,
// // //                             MonthYear: monthYear, // Add month-year for additional grouping
// // //                             Occupancy: occKey, 
// // //                             roomTypeIDs: {},
// // //                             // Add a flag to indicate if this row should be highlighted
// // //                             highlight: dateOccupancyMap[date] === occKey
// // //                         };

// // //                         sortedRoomTypes.forEach(roomType => {
// // //                             const match = entries.find(e => e.roomType === roomType);
// // //                             row[roomType] = match ? match[occKey] : '';
// // //                             if (match) {
// // //                                 row.roomTypeIDs[roomType] = match.roomTypeID;
// // //                             }
// // //                         });

// // //                         rows.push(row);
// // //                     });
// // //                 });

// // //                 // Store occupancy ranges for later use
// // //                 setOccupancyRanges(occupancyKeys);

// // //                 // Step 3: Build column defs with both Date and Month grouping options
// // //                 const columnDefs = [
// // //                     {
// // //                         headerName: 'Month',
// // //                         field: 'MonthYear',
// // //                         rowGroup: true,
// // //                         hide: true,
// // //                         comparator: (valueA, valueB) => {
// // //                             // Custom comparator to sort months chronologically
// // //                             const dateA = new Date(valueA);
// // //                             const dateB = new Date(valueB);
// // //                             return dateA - dateB;
// // //                         }
// // //                     },
// // //                     {
// // //                         headerName: 'Date',
// // //                         field: 'Date',
// // //                         rowGroup: true,
// // //                         hide: true,
// // //                         comparator: (valueA, valueB) => {
// // //                             // Custom comparator to sort dates chronologically
// // //                             const dateA = new Date(valueA);
// // //                             const dateB = new Date(valueB);
// // //                             return dateA - dateB;
// // //                         }
// // //                     },
// // //                     { 
// // //                         headerName: 'Occupancy %', 
// // //                         field: 'Occupancy', 
// // //                         width: 140,
// // //                         cellStyle: params => {
// // //                             if (params.data && params.data.highlight) {
// // //                                 return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
// // //                             }
// // //                             return null;
// // //                         }
// // //                     },
// // //                     ...allRoomTypeList.map(roomType => ({
// // //                         headerName: roomType,
// // //                         field: roomType,
// // //                         editable: true,
// // //                         type: 'numericColumn',
// // //                         width: 100,
// // //                         cellStyle: params => {
// // //                             if (params.data && params.data.highlight) {
// // //                                 return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
// // //                             }
// // //                             return null;
// // //                         }
// // //                     }))
// // //                 ];

// // //                 setOpen(false);
// // //                 setColumnDefs(columnDefs);
// // //                 console.log(rows)
// // //                 setRowData(rows);
// // //             }
// // //         });
// // // };

// // const fetchData = () => {
// //     setOpen(true);
// //     const timeout = setTimeout(() => {
// //         setShowSecondaryMessage(true);
// //     }, 5000);

// //     const startDate = watch('fromDate');
// //     const endDate = watch('toDate');
// //     const FromDate = startDate ? Moment(String(new Date(startDate))).format('YYYY-MM-DD') : null;
// //     const ToDate = endDate ? Moment(String(new Date(endDate))).format('YYYY-MM-DD') : null;
// //     const RoomID = watch('roomID') === '' ? null : watch('roomID');

// //     const confirmRate = JSON.stringify({
// //         hotelID: 1,
// //         fromDate: FromDate,
// //         toDate: ToDate,
// //         roomID: RoomID,
// //     });

// //     fetchx(API_URL + "/getDynamicPricingDayWiseAll", {
// //         method: "POST",
// //         headers: { 'Content-Type': 'application/json' },
// //         body: confirmRate
// //     })
// //         .then(result => result.json())
// //         .then(res => {
// //             if (res.statusCode === 200) {
// //                 const data = res['data'];
// //                 if (data.length === 0) {
// //                     setOpen(false)
// //                     return
// //                 };
// //                 const allRoomTypes = new Set();
// //                 const occupancyKeys = [];
// //                 const groupedByDate = {};
// //                 const dateOccupancyMap = {}; // To store which occupancy range to highlight for each date
// //                 const dateTotalOccupancyMap = {}; // To store totalOccupancy for each date

// //                 data.sort((a, b) => a.roomTypeID - b.roomTypeID);

// //                 // Step 1: Collect all room types, occupancy keys, and group by date
// //                 data.forEach(item => {
// //                     allRoomTypes.add(item.roomType);

// //                     // Only include occupancy range keys, exclude other metadata
// //                     Object.keys(item).forEach(key => {
// //                         if (!['id', 'hotelID', 'inventoryDate', 'roomTypeID', 'roomType', 
// //                               'isOverRightAllowed', 'totalRooms', 'totalOccupancy'].includes(key)) {
// //                             if (!occupancyKeys.includes(key)) {
// //                                 occupancyKeys.push(key);
// //                             }
// //                         }
// //                     });

// //                     const date = item.inventoryDate;
// //                     if (!groupedByDate[date]) {
// //                         groupedByDate[date] = [];
// //                     }
// //                     groupedByDate[date].push(item);

// //                     // Store the occupancy range for this date based on totalOccupancy
// //                     if (!dateOccupancyMap[date]) {
// //                         dateOccupancyMap[date] = getOccupancyRange(item.totalOccupancy, occupancyKeys);
// //                     }

// //                     // Store the totalOccupancy value for this date
// //                     if (!dateTotalOccupancyMap[date]) {
// //                         dateTotalOccupancyMap[date] = item.totalOccupancy;
// //                     }
// //                 });

// //                 const allRoomTypeList = [...allRoomTypes];
// //                 const rows = [];
// //                 const sortedRoomTypes = [...allRoomTypeList].sort((a, b) => a.value - b.value);

// //                 // Step 2: Build transposed rows for each date
// //                 Object.entries(groupedByDate).forEach(([date, entries]) => {
// //                     const formattedDate = format(new Date(date), 'dd MMM yy');
// //                     const monthYear = format(new Date(date), 'MMM yyyy'); // Extract month and year for grouping

// //                     occupancyKeys.forEach(occKey => {
// //                         const row = { 
// //                             Date: formattedDate,
// //                             MonthYear: monthYear, // Add month-year for additional grouping
// //                             Occupancy: occKey, 
// //                             CurrentOcc: dateTotalOccupancyMap[date], // Add current occupancy percentage
// //                             roomTypeIDs: {},
// //                             // Add a flag to indicate if this row should be highlighted
// //                             highlight: dateOccupancyMap[date] === occKey
// //                         };

// //                         sortedRoomTypes.forEach(roomType => {
// //                             const match = entries.find(e => e.roomType === roomType);
// //                             row[roomType] = match ? match[occKey] : '';
// //                             if (match) {
// //                                 row.roomTypeIDs[roomType] = match.roomTypeID;
// //                             }
// //                         });

// //                         rows.push(row);
// //                     });
// //                 });

// //                 // Store occupancy ranges for later use
// //                 setOccupancyRanges(occupancyKeys);

// //                 // Step 3: Build column defs with both Date and Month grouping options
// //                 const columnDefs = [
// //                     {
// //                         headerName: 'Month',
// //                         field: 'MonthYear',
// //                         rowGroup: true,
// //                         hide: true,
// //                         comparator: (valueA, valueB) => {
// //                             // Custom comparator to sort months chronologically
// //                             const dateA = new Date(valueA);
// //                             const dateB = new Date(valueB);
// //                             return dateA - dateB;
// //                         }
// //                     },
// //                     {
// //                         headerName: 'Date',
// //                         field: 'Date',
// //                         rowGroup: true,
// //                         hide: true,
// //                         comparator: (valueA, valueB) => {
// //                             // Custom comparator to sort dates chronologically
// //                             const dateA = new Date(valueA);
// //                             const dateB = new Date(valueB);
// //                             return dateA - dateB;
// //                         }
// //                     },
// //                     { 
// //                         headerName: 'Occupancy %', 
// //                         field: 'Occupancy', 
// //                         width: 140,
// //                         cellStyle: params => {
// //                             if (params.data && params.data.highlight) {
// //                                 return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
// //                             }
// //                             return null;
// //                         }
// //                     },
// //                     { 
// //                         headerName: 'Current Occ %', 
// //                         field: 'CurrentOcc', 
// //                         width: 120,
// //                         valueFormatter: params => {
// //                             // Format the value to show 2 decimal places with a % sign
// //                             return params.value !== undefined && params.value !== null 
// //                                 ? `${parseFloat(params.value).toFixed(2)}%` 
// //                                 : '';
// //                         },
// //                         cellStyle: params => {
// //                             if (params.data && params.data.highlight) {
// //                                 return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
// //                             }
// //                             return null;
// //                         }
// //                     },
// //                     ...allRoomTypeList.map(roomType => ({
// //                         headerName: roomType,
// //                         field: roomType,
// //                         editable: true,
// //                         type: 'numericColumn',
// //                         width: 100,
// //                         cellStyle: params => {
// //                             if (params.data && params.data.highlight) {
// //                                 return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
// //                             }
// //                             return null;
// //                         }
// //                     }))
// //                 ];

// //                 setOpen(false);
// //                 setColumnDefs(columnDefs);
// //                 console.log(rows)
// //                 setRowData(rows);
// //             }
// //         });
// // };

// //     useEffect(() => {
// //         fetchData()

// //         if (popUp2 === false) {
// //             fetchData()
// //         }
// //     }, []);

// //     const [columnDefs, setColumnDefs] = useState([]);

// //     const buttonListener = useCallback(e => {
// //         gridRef.current.api.deselectAll();
// //     }, []);

// //     const [filterValue, setFilterValue] = useState('');

// //     const onFilterTextBoxChanged10 = (event) => {
// //         const { value } = event.target;
// //         setFilterValue(value);
// //         const columnId = columnDefs[1]?.field;
// //         if (columnId) {
// //             console.log(value)
// //             gridRef.current?.setFilterModel({
// //                 [columnId]: { type: 'contains', filter: value }
// //             });
// //         }
// //     };

// //     const fromDate = watch('fromDate');

// //     //// For Disabling Past Date
// //     const options = {
// //         minDate: Today
// //     };
// //     const optionsToDate = {
// //         minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
// //     };

// //     const handleResetFilter = () => {
// //         reset({
// //             roomID: '',
// //             fromDate: null,
// //             toDate: null,
// //         });
// //         fetchData()
// //     };



// //     const handleExport = () => {
// //         if (gridRef.current) {
// //             gridRef.current.exportDataAsExcel({
// //                 fileName: "Dynamic_PricingList.xlsx",
// //                 sheetName: "Dynamic_PricingList",
// //                 processRowGroupCallback: (params) => {
// //                     return params.node.key;
// //                 },
// //             });
// //         }
// //     };



// //     return (
// //         <div>
// //             <div>
// //                 <Row>
// //                     <Col md='3' sm='12' className='mb-1'>
// //                         <div className="mb-1">
// //                             <Label className="form-label" for="fromDate">
// //                                 From Date
// //                             </Label>
// //                             <Controller
// //                                 control={control}
// //                                 id='fromDate'
// //                                 name='fromDate'
// //                                 render={({ field }) => (
// //                                     <Flatpickr
// //                                         // required
// //                                         options={options}
// //                                         placeholder='YYYY-MM-DD'
// //                                         {...field}
// //                                         className='form-control'
// //                                     />
// //                                 )}
// //                             />
// //                         </div>
// //                     </Col>

// //                     <Col md='3' sm='12' className='mb-1'>
// //                         <div className='mb-1'>
// //                             <Label className='form-label' for='toDate'>
// //                                 To Date
// //                             </Label>
// //                             <Controller
// //                                 control={control}
// //                                 id='toDate'
// //                                 name='toDate'
// //                                 render={({ field }) => (
// //                                     <Flatpickr
// //                                         placeholder='YYYY-MM-DD'
// //                                         {...field}
// //                                         options={optionsToDate}
// //                                         // options={{ allowInput: true }}
// //                                         className='form-control'
// //                                     />
// //                                 )}
// //                             />
// //                         </div>
// //                     </Col>

// //                     <Col md='3' sm='12' className='mt-2'>
// //                         <div className="d-flex">
// //                             <Button color='primary' className='me-1' onClick={() => fetchData()}>
// //                                 Apply Filter
// //                             </Button>
// //                             <Button
// //                                 className='me-1'
// //                                 onClick={handleResetFilter}
// //                             >
// //                                 Reset Filter
// //                             </Button>
// //                         </div>
// //                     </Col>
// //                 </Row>
// //             </div>

// //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// //                 <p style={{ color: "blue", margin: 0 }}>Double click to edit!!</p>
// //                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
// //                      <Button color="primary" onClick={handleExport}>Download Excel</Button>
// //                      <Button color="primary" onClick={() => setOpenModal(!openModal)}>
// //                          Blocked Dynamic Pricing List
// //                      </Button>
// //                  </div>
// //             </div>

// //             <div className="ag-theme-alpine" style={{ height: 660 }}>
// //                 {/* <AgGridReact
// //                     ref={gridRef}
// //                     rowData={rowData} 
// //                     columnDefs={columnDefs}
// //                     animateRows={true} 
// //                     rowSelection='multiple'
// //                     onCellClicked={cellClickedListener}
// //                     onGridReady={params => {
// //                         gridRef.current = params.api;
// //                     }}
// //                     onCellValueChanged={onCellValueChanged}
// //                     groupDisplayType="singleColumn"
// //                     autoGroupColumnDef={{
// //                         headerName: 'Date',
// //                         minWidth: 200,
// //                         cellRendererParams: {
// //                             suppressCount: true
// //                         }
// //                     }}
// //                     paginationPageSize='20'
// //                     pagination='true'
// //                     defaultColDef={defaultColDef}
// //                     headerColor="ddw-primary"
// //                     masterDetail={false}
// //                 /> */}


// //                 <div className="ag-theme-alpine" style={{ height: 660 }}>
// //     <AgGridReact
// //         ref={gridRef}
// //         rowData={rowData} 
// //         columnDefs={columnDefs}
// //         animateRows={true} 
// //         rowSelection='multiple'
// //         onCellClicked={cellClickedListener}
// //         onGridReady={params => {
// //             gridRef.current = params.api;
// //         }}
// //         onCellValueChanged={onCellValueChanged}
// //         groupDisplayType="multipleColumns"
// //         autoGroupColumnDef={{
// //             headerName: 'Date/Month',
// //             minWidth: 200,
// //             cellRendererParams: {
// //                 suppressCount: false,
// //                 innerRenderer: (params) => {
// //                     // Custom renderer to show either Date or Month based on grouping
// //                     return params.value;
// //                 }
// //             }
// //         }}
// //         paginationPageSize='20'
// //         pagination='true'
// //         defaultColDef={{
// //             ...defaultColDef,
// //             enableRowGroup: true, // Enable row grouping in column menu
// //             menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'] // Include general menu for grouping
// //         }}
// //         headerColor="ddw-primary"
// //         masterDetail={false}
// //         sideBar={{
// //             toolPanels: [
// //                 {
// //                     id: 'columns',
// //                     labelDefault: 'Columns',
// //                     labelKey: 'columns',
// //                     iconKey: 'columns',
// //                     toolPanel: 'agColumnsToolPanel',
// //                     toolPanelParams: {
// //                         suppressRowGroups: false,
// //                         suppressValues: true,
// //                         suppressPivots: true,
// //                         suppressPivotMode: true
// //                     }
// //                 }
// //             ]
// //         }}
// //     />
// // </div>
// //             </div>

// //             {popUp2 && (
// //                 <div className="modal-dialog-centered">
// //                     <Modal
// //                         isOpen={popUp2}
// //                         toggle={handleModalClose}
// //                         className='modal-dialog-centered'
// //                         backdrop="static"
// //                         keyboard={false}
// //                     >
// //                         {" "}
// //                         <ModalHeader
// //                             className="modal-sm"
// //                             toggle={handleModalClose}
// //                         >
// //                             Need To Check..
// //                         </ModalHeader>
// //                         <ModalBody className="pb-3 px-sm-2 mx-20">
// //                             <div>
// //                                 <b>{popUp2}</b>
// //                                 <br></br>
// //                                 <br></br>
// //                                 <div className="d-flex">
// //                                     <Button
// //                                         color="primary"
// //                                         className="me-1"
// //                                         onClick={() => { popUpData2 && baseAmountSubmit(popUpData2) }}
// //                                     >
// //                                         Confirm
// //                                     </Button>
// //                                     <Button
// //                                         color="danger"
// //                                         className="me-1"
// //                                         onClick={() => { setPopUp2(false), fetchData() }}
// //                                     >
// //                                         Cancel
// //                                     </Button>
// //                                 </div>
// //                             </div>
// //                         </ModalBody>
// //                     </Modal>
// //                 </div>
// //             )}

// //             {/* BackDrop For messages */}
// //             <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
// //                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// //                     <h1 style={{ fontWeight: 'bold', color: 'white' }}>
// //                         Loading data, please wait...
// //                     </h1>
// //                     {showSecondaryMessage && (
// //                         <h1 style={{ fontWeight: 'bold', color: 'white' }}>
// //                             Loading records... This may take a few seconds if there's a lot of data.
// //                         </h1>
// //                     )}
// //                     <CircularProgress color="inherit" />
// //                 </div>
// //             </Backdrop>

// //             <Modal isOpen={openModal} toggle={() => setOpenModal(!openModal)} className="modal-xl">
// //                 <ModalHeader toggle={() => setOpenModal(!openModal)} className="modal-xl">
// //                     Blocked Dynamic Pricing List
// //                 </ModalHeader>
// //                 <ModalBody className="modal-xl">
// //                     <div>
// //                         <BlockedDynamicPricingPage />
// //                     </div>
// //                 </ModalBody>
// //             </Modal>
// //         </div>
// //     );
// // }

// // export default DynamicPricingDayWise;





// import 'ag-grid-enterprise'
// import { AgGridReact } from 'ag-grid-react'
// import '/node_modules/ag-grid-community/styles/ag-grid.css'
// import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
// import { Modal, ModalBody, ModalHeader } from 'reactstrap';

// import { format } from "date-fns";
// import { Card, CardHeader, CardText, CardTitle, Label, Col, Input, Row, Button } from 'reactstrap';
// import API_URL from '../../../config';
// import { useForm, Controller } from "react-hook-form";
// import Flatpickr from "react-flatpickr";
// import Moment from 'moment';
// import classnames from "classnames";
// import { useNavigate } from 'react-router-dom'

// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
// const MySwal = withReactContent(Swal)
// import Backdrop from '@mui/material/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress'
// import BlockedDynamicPricingPage from './blockedDynamicPricing';

// const DynamicPricingDayWise = (props) => {
//     let navigate = useNavigate();
//     const [rowData, setRowData] = useState([]);
//     const [Today, setToday] = useState()
//     const [popUp2, setPopUp2] = useState(false);
//     const [popUpData2, setPopUpData2] = useState();
//     const [open, setOpen] = useState(false);
//     const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
//     const [openModal, setOpenModal] = useState(false);
//     const [occupancyRanges, setOccupancyRanges] = useState([]);

//     const handleSuccess = (message) => {
//         return MySwal.fire({
//             title: 'Dynamic Pricing',
//             text: message,
//             icon: 'success',
//             customClass: {
//                 confirmButton: 'btn btn-primary'
//             },
//             buttonsStyling: false
//         })
//     }

//     const handleError = (message) => {
//         return MySwal.fire({
//             title: 'Error!',
//             text: message,
//             icon: 'error',
//             customClass: {
//                 confirmButton: 'btn btn-danger',
//             },
//             allowOutsideClick: false,
//             confirmButtonText: 'Close',
//             confirmButtonColor: 'danger',
//             buttonsStyling: false
//         })
//     }

//     useEffect(() => {
//         const hotelIDData = JSON.stringify({
//             hotelID: 1
//         })
//         fetchx(API_URL + "/getBusinessDate", {
//             method: "POST",
//             headers: { 'Content-Type': 'application/json' },
//             body: hotelIDData
//         }).then((res) => res.json())
//             .then(postres => {
//                 const today = new Date(postres['data'][0]['businessDate']);
//                 const tomorrow = new Date(today);
//                 tomorrow.setDate(today.getDate() + 1);
//                 setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
//             })
//     }, []);

//     // ** Hooks
//     const { reset, handleSubmit, control, watch, formState: { errors }
//     } = useForm({});

//     const gridRef = useRef();

//     const defaultColDef = useMemo(() => (
//         {
//             sortable: true,
//             filter: true,
//             wrapHeaderText: true,
//             filterParams: {
//                 buttons: ['apply', 'reset']
//             }
//         }
//     ));

//     const cellClickedListener = useCallback(event => {
//         console.log('cellClicked', event);
//     }, []);

//     const handleModalClose = () => {
//         setPopUp2(false);
//         fetchData(); // Your API function
//     };

//     const onCellValueChanged = (event) => {
//         console.log('onCellValueChanged', event);
//         const field = event.colDef.field;          // e.g., "KSUP"
//         const newValue = event.newValue;
//         const oldValue = event.oldValue;
//         const occupancy = event.data.Occupancy;    // e.g., "<10"
//         const date = event.data.Date;              // e.g., "23 Sep 24"
//         const roomTypeID = event.data.roomTypeIDs?.[field]; // e.g., 1

//         console.log('Changed Room Type ID:', roomTypeID);
//         console.log('Occupancy:', occupancy);
//         console.log('Date:', date);
//         console.log('New Value:', newValue);

//         if (!isNaN(newValue) && !isNaN(oldValue)) {
//             setPopUp2('Do you want to change amount from ' + oldValue + ' to ' + newValue + ' for room type ' + field + ' ?');
//             setPopUpData2({ newValue: newValue, roomTypeID: roomTypeID, occupancy: occupancy, date: date });
//         } else {
//             handleError('Invalid amount');
//             fetchData();
//         }
//     };

//     function baseAmountSubmit(data) {
//         const unAssign = JSON.stringify({
//             baseAmount: data.newValue,
//             roomTypeID: data.roomTypeID,
//             occupancy: data.occupancy,
//             date: format(new Date(data.date), 'yyyy-MM-dd'),
//         });

//         console.log(unAssign)
//         fetchx(API_URL + "/updateDynamicPricingAmountEdit", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: unAssign,
//         })
//             .then(result => result.json())
//             .then(data => {
//                 navigate('')
//                 handleSuccess('Updated successfully!!')
//                 setPopUpData2()
//             })
//     }

//     // Function to determine which occupancy range a value falls into
//     // const getOccupancyRange = (value) => {
//     //     if (value < 10) return "<10";
//     //     if (value >= 10 && value < 15) return "10 - 15";
//     //     if (value >= 15 && value < 20) return "15 - 20";
//     //     if (value >= 20 && value < 25) return "20 - 25";
//     //     if (value >= 25 && value < 30) return "25 - 30";
//     //     if (value >= 30 && value < 35) return "30 - 35";
//     //     if (value >= 35 && value < 40) return "35 - 40";
//     //     if (value >= 40 && value < 45) return "40 - 45";
//     //     if (value >= 45 && value < 50) return "45 - 50";
//     //     if (value >= 50 && value < 55) return "50 - 55";
//     //     if (value >= 55 && value < 60) return "55 - 60";
//     //     if (value >= 60 && value < 65) return "60 - 65";
//     //     if (value >= 65 && value < 70) return "65 - 70";
//     //     if (value >= 70 && value < 75) return "70 - 75";
//     //     if (value >= 75 && value < 80) return "75 - 80";
//     //     if (value >= 80 && value < 85) return "80 - 85";
//     //     if (value >= 85 && value < 90) return "85 - 90";
//     //     if (value >= 90 && value < 95) return "90 - 95";
//     //     return ">95";
//     // };


//     const getOccupancyRange = (value, occupancyKeys) => {
//         // Sort the keys to ensure proper comparison
//         const sortedKeys = [...occupancyKeys].sort((a, b) => {
//             // Handle special cases first
//             if (a === "<10") return -1;
//             if (b === "<10") return 1;
//             if (a === ">95") return 1;
//             if (b === ">95") return -1;

//             // Extract numbers from ranges like "10 - 15"
//             const aMin = parseInt(a.split(' - ')[0] || a.split(' ')[0]);
//             const bMin = parseInt(b.split(' - ')[0] || b.split(' ')[0]);

//             return aMin - bMin;
//         });

//         // Find which range the value falls into
//         for (const key of sortedKeys) {
//             if (key === "<10" && value < 10) return key;
//             if (key === ">95" && value >= 95) return key;

//             if (key.includes(" - ")) {
//                 const [min, max] = key.split(" - ").map(Number);
//                 if (value >= min && value < max) return key;
//             }
//         }

//         // Default case (shouldn't normally happen)
//         return ">95";
//     };


//     const fetchData = () => {
//         setOpen(true);
//         const timeout = setTimeout(() => {
//             setShowSecondaryMessage(true);
//         }, 5000);

//         const startDate = watch('fromDate');
//         const endDate = watch('toDate');
//         const FromDate = startDate ? Moment(String(new Date(startDate))).format('YYYY-MM-DD') : null;
//         const ToDate = endDate ? Moment(String(new Date(endDate))).format('YYYY-MM-DD') : null;
//         const RoomID = watch('roomID') === '' ? null : watch('roomID');

//         const confirmRate = JSON.stringify({
//             hotelID: 1,
//             fromDate: FromDate,
//             toDate: ToDate,
//             roomID: RoomID,
//         });

//         fetchx(API_URL + "/getDynamicPricingDayWiseAll", {
//             method: "POST",
//             headers: { 'Content-Type': 'application/json' },
//             body: confirmRate
//         })
//             .then(result => result.json())
//             .then(res => {
//                 if (res.statusCode === 200) {
//                     const data = res['data'];
//                     if (data.length === 0) {
//                         setOpen(false)
//                         return
//                     };
//                     const allRoomTypes = new Set();
//                     const occupancyKeys = [];
//                     const groupedByDate = {};
//                     const dateOccupancyMap = {}; // To store which occupancy range to highlight for each date
//                     const dateTotalOccupancyMap = {}; // To store totalOccupancy for each date

//                     data.sort((a, b) => a.roomTypeID - b.roomTypeID);

//                     // Step 1: Collect all room types, occupancy keys, and group by date
//                     data.forEach(item => {
//                         allRoomTypes.add(item.roomType);

//                         // Only include occupancy range keys, exclude other metadata
//                         Object.keys(item).forEach(key => {
//                             if (!['id', 'hotelID', 'inventoryDate', 'roomTypeID', 'roomType',
//                                 'isOverRightAllowed', 'totalRooms', 'totalOccupancy'].includes(key)) {
//                                 if (!occupancyKeys.includes(key)) {
//                                     occupancyKeys.push(key);
//                                 }
//                             }
//                         });

//                         const date = item.inventoryDate;
//                         if (!groupedByDate[date]) {
//                             groupedByDate[date] = [];
//                         }
//                         groupedByDate[date].push(item);

//                         // Store the occupancy range for this date based on totalOccupancy
//                         if (!dateOccupancyMap[date]) {
//                             dateOccupancyMap[date] = getOccupancyRange(item.totalOccupancy, occupancyKeys);
//                         }

//                         // Store the totalOccupancy value for this date
//                         if (!dateTotalOccupancyMap[date]) {
//                             dateTotalOccupancyMap[date] = item.totalOccupancy;
//                         }
//                     });

//                     const allRoomTypeList = [...allRoomTypes];
//                     const rows = [];
//                     const sortedRoomTypes = [...allRoomTypeList].sort((a, b) => a.value - b.value);

//                     // Step 2: Build transposed rows for each date
//                     Object.entries(groupedByDate).forEach(([date, entries]) => {
//                         const formattedDate = format(new Date(date), 'dd MMM yy');
//                         const monthYear = format(new Date(date), 'MMM yyyy'); // Extract month and year for grouping

//                         occupancyKeys.forEach(occKey => {
//                             const row = {
//                                 Date: formattedDate,
//                                 MonthYear: monthYear, // Add month-year for additional grouping
//                                 Occupancy: occKey,
//                                 CurrentOcc: dateTotalOccupancyMap[date], // Add current occupancy percentage
//                                 roomTypeIDs: {},
//                                 // Add a flag to indicate if this row should be highlighted
//                                 highlight: dateOccupancyMap[date] === occKey
//                             };

//                             sortedRoomTypes.forEach(roomType => {
//                                 const match = entries.find(e => e.roomType === roomType);
//                                 row[roomType] = match ? match[occKey] : '';
//                                 if (match) {
//                                     row.roomTypeIDs[roomType] = match.roomTypeID;
//                                 }
//                             });

//                             rows.push(row);
//                         });
//                     });

//                     // Store occupancy ranges for later use
//                     setOccupancyRanges(occupancyKeys);

//                     // Step 3: Build column defs with both Date and Month grouping options
//                     const columnDefs = [
//                         {
//                             headerName: 'Month',
//                             field: 'MonthYear',
//                             rowGroup: true,
//                             hide: true,
//                             comparator: (valueA, valueB) => {
//                                 // Custom comparator to sort months chronologically
//                                 const dateA = new Date(valueA);
//                                 const dateB = new Date(valueB);
//                                 return dateA - dateB;
//                             }
//                         },
//                         {
//                             headerName: 'Date',
//                             field: 'Date',
//                             rowGroup: true,
//                             hide: true,
//                             comparator: (valueA, valueB) => {
//                                 // Custom comparator to sort dates chronologically
//                                 const dateA = new Date(valueA);
//                                 const dateB = new Date(valueB);
//                                 return dateA - dateB;
//                             }
//                         },
//                         {
//                             headerName: 'Occupancy %',
//                             field: 'Occupancy',
//                             width: 140,
//                             // cellStyle: params => {
//                             //     if (params.data && params.data.highlight) {
//                             //         return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
//                             //     }
//                             //     return null;
//                             // }
//                             cellStyle: params => {
//                                 if (params.data && (params.data.highlight || params.data.isGroupHeader)) {
//                                     return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
//                                 }
//                                 return null;
//                             }

//                         },
//                         {
//                             headerName: 'Current Occ %',
//                             field: 'CurrentOcc',
//                             width: 120,
//                             valueFormatter: params => {
//                                 // Format the value to show 2 decimal places with a % sign
//                                 return params.value !== undefined && params.value !== null
//                                     ? `${parseFloat(params.value).toFixed(2)}%`
//                                     : '';
//                             },
//                             // cellStyle: params => {
//                             //     if (params.data && params.data.highlight) {
//                             //         return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
//                             //     }
//                             //     return null;
//                             // }
//                             cellStyle: params => {
//                                 if (params.data && (params.data.highlight || params.data.isGroupHeader)) {
//                                     return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
//                                 }
//                                 return null;
//                             }

//                         },
//                         ...allRoomTypeList.map(roomType => ({
//                             headerName: roomType,
//                             field: roomType,
//                             editable: true,
//                             type: 'numericColumn',
//                             width: 100,
//                             // cellStyle: params => {
//                             //     if (params.data && params.data.highlight) {
//                             //         return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
//                             //     }
//                             //     return null;
//                             // }
//                             cellStyle: params => {
//                                 if (params.data && (params.data.highlight || params.data.isGroupHeader)) {
//                                     return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
//                                 }
//                                 return null;
//                             }

//                         }))
//                     ];

//                     setOpen(false);
//                     setColumnDefs(columnDefs);
//                     console.log(rows)
//                     setRowData(rows);
//                 }
//             });
//     };

//     useEffect(() => {
//         fetchData()

//         if (popUp2 === false) {
//             fetchData()
//         }
//     }, []);

//     const [columnDefs, setColumnDefs] = useState([]);

//     const buttonListener = useCallback(e => {
//         gridRef.current.api.deselectAll();
//     }, []);

//     const [filterValue, setFilterValue] = useState('');

//     const onFilterTextBoxChanged10 = (event) => {
//         const { value } = event.target;
//         setFilterValue(value);
//         const columnId = columnDefs[1]?.field;
//         if (columnId) {
//             console.log(value)
//             gridRef.current?.setFilterModel({
//                 [columnId]: { type: 'contains', filter: value }
//             });
//         }
//     };

//     const fromDate = watch('fromDate');

//     //// For Disabling Past Date
//     const options = {
//         minDate: Today
//     };
//     const optionsToDate = {
//         minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
//     };

//     const handleResetFilter = () => {
//         reset({
//             roomID: '',
//             fromDate: null,
//             toDate: null,
//         });
//         fetchData()
//     };

//     const transformedData = [];

//     const groupedByDate = rowData.reduce((acc, row) => {
//         if (!acc[row.Date]) acc[row.Date] = [];
//         acc[row.Date].push(row);
//         return acc;
//     }, {});

//     Object.keys(groupedByDate).forEach(date => {
//         const groupRows = groupedByDate[date];
//         const highlightRow = groupRows.find(r => r.highlight);

//         if (highlightRow) {
//             // Use highlight row as the group header itself
//             transformedData.push({
//                 ...highlightRow,
//                 DateMonth: date,  // show date here
//                 isGroupHeader: true
//             });

//             // push the rest (except highlight row)
//             transformedData.push(...groupRows.filter(r => !r.isHighlight));
//         } else {
//             // if no highlight, just push rows
//             transformedData.push(...groupRows);
//         }
//     });




//     // const groupRowRenderer = (params) => {
//     //   if (params.node.group) {
//     //     const highlightRow = params.node.allLeafChildren.find(
//     //       child => child.data?.isHighlight
//     //     )?.data;

//     //     return (
//     //       <div className="custom-group-header">
//     //         <span>{params.value}</span>
//     //         {highlightRow && (
//     //           <span style={{ background: "#ffeb3b", padding: "2px 6px", marginLeft: "10px" }}>
//     //             {highlightRow["Current Occ %"]}
//     //           </span>
//     //         )}
//     //       </div>
//     //     );
//     //   }
//     //   return null;
//     // };

//     const groupRowRenderer = (params) => {
//         if (params.node.group) {
//             // Find highlighted row under this group
//             const highlightRow = params.node.allLeafChildren.find(
//                 child => child.data?.highlight
//             )?.data;

//             return (
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                     {/* Show group key (inventoryDate) */}
//                     <span style={{ fontWeight: "bold" }}>{params.value}</span>

//                     {/* If highlighted row exists, display its values beside inventoryDate */}
//                     {highlightRow && (
//                         <div style={{ display: "flex", marginLeft: "10px", gap: "8px" }}>
//                             {/* Current Occupancy */}
//                             <span style={{ background: "#ffeb3b", padding: "2px 6px", borderRadius: "4px" }}>
//                                 Current Occ: {highlightRow.CurrentOcc}%
//                             </span>

//                             {/* Show all room type values */}
//                             {Object.keys(highlightRow.roomTypeIDs || {}).map((roomType) => (
//                                 <span
//                                     key={roomType}
//                                     style={{ background: "#ffeb3b", padding: "2px 6px", borderRadius: "4px" }}
//                                 >
//                                     {roomType}: {highlightRow[roomType]}
//                                 </span>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             );
//         }
//         return null;
//     };


//     const handleExport = () => {
//         if (gridRef.current) {
//             gridRef.current.exportDataAsExcel({
//                 fileName: "Dynamic_PricingList.xlsx",
//                 sheetName: "Dynamic_PricingList",
//                 processRowGroupCallback: (params) => {
//                     return params.node.key;
//                 },
//             });
//         }
//     };



//     return (
//         <div>
//             <div>
//                 <Row>
//                     <Col md='3' sm='12' className='mb-1'>
//                         <div className="mb-1">
//                             <Label className="form-label" for="fromDate">
//                                 From Date
//                             </Label>
//                             <Controller
//                                 control={control}
//                                 id='fromDate'
//                                 name='fromDate'
//                                 render={({ field }) => (
//                                     <Flatpickr
//                                         // required
//                                         options={options}
//                                         placeholder='YYYY-MM-DD'
//                                         {...field}
//                                         className='form-control'
//                                     />
//                                 )}
//                             />
//                         </div>
//                     </Col>

//                     <Col md='3' sm='12' className='mb-1'>
//                         <div className='mb-1'>
//                             <Label className='form-label' for='toDate'>
//                                 To Date
//                             </Label>
//                             <Controller
//                                 control={control}
//                                 id='toDate'
//                                 name='toDate'
//                                 render={({ field }) => (
//                                     <Flatpickr
//                                         placeholder='YYYY-MM-DD'
//                                         {...field}
//                                         options={optionsToDate}
//                                         // options={{ allowInput: true }}
//                                         className='form-control'
//                                     />
//                                 )}
//                             />
//                         </div>
//                     </Col>

//                     <Col md='3' sm='12' className='mt-2'>
//                         <div className="d-flex">
//                             <Button color='primary' className='me-1' onClick={() => fetchData()}>
//                                 Apply Filter
//                             </Button>
//                             <Button
//                                 className='me-1'
//                                 onClick={handleResetFilter}
//                             >
//                                 Reset Filter
//                             </Button>
//                         </div>
//                     </Col>
//                 </Row>
//             </div>

//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <p style={{ color: "blue", margin: 0 }}>Double click to edit!!</p>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                     <Button color="primary" onClick={handleExport}>Download Excel</Button>
//                     <Button color="primary" onClick={() => setOpenModal(!openModal)}>
//                         Blocked Dynamic Pricing List
//                     </Button>
//                 </div>
//             </div>

//             <div className="ag-theme-alpine" style={{ height: 660 }}>
//                 {/* <AgGridReact
//                     ref={gridRef}
//                     rowData={rowData} 
//                     columnDefs={columnDefs}
//                     animateRows={true} 
//                     rowSelection='multiple'
//                     onCellClicked={cellClickedListener}
//                     onGridReady={params => {
//                         gridRef.current = params.api;
//                     }}
//                     onCellValueChanged={onCellValueChanged}
//                     groupDisplayType="singleColumn"
//                     autoGroupColumnDef={{
//                         headerName: 'Date',
//                         minWidth: 200,
//                         cellRendererParams: {
//                             suppressCount: true
//                         }
//                     }}
//                     paginationPageSize='20'
//                     pagination='true'
//                     defaultColDef={defaultColDef}
//                     headerColor="ddw-primary"
//                     masterDetail={false}
//                 /> */}


//                 <div className="ag-theme-alpine" style={{ height: 660 }}>
//                     <AgGridReact
//                         ref={gridRef}
//                         rowData={transformedData}
//                         columnDefs={columnDefs}
//                         animateRows={true}
//                         rowSelection='multiple'
//                         onCellClicked={cellClickedListener}
//                         onGridReady={params => {
//                             gridRef.current = params.api;
//                         }}
//                         onCellValueChanged={onCellValueChanged}
//                         groupDisplayType="multipleColumns"
//                         autoGroupColumnDef={{
//                             headerName: 'Date/Month',
//                             minWidth: 200,
//                             cellRendererParams: {
//                                 suppressCount: false,
//                                 innerRenderer: (params) => {
//                                     // Custom renderer to show either Date or Month based on grouping
//                                     return params.value;
//                                 }
//                             }
//                         }}
//                         paginationPageSize='20'
//                         pagination='true'
//                         defaultColDef={{
//                             ...defaultColDef,
//                             enableRowGroup: true, // Enable row grouping in column menu
//                             menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'] // Include general menu for grouping
//                         }}
//                         headerColor="ddw-primary"
//                         masterDetail={false}
//                         sideBar={{
//                             toolPanels: [
//                                 {
//                                     id: 'columns',
//                                     labelDefault: 'Columns',
//                                     labelKey: 'columns',
//                                     iconKey: 'columns',
//                                     toolPanel: 'agColumnsToolPanel',
//                                     toolPanelParams: {
//                                         suppressRowGroups: false,
//                                         suppressValues: true,
//                                         suppressPivots: true,
//                                         suppressPivotMode: true
//                                     }
//                                 }
//                             ]
//                         }}
//                         groupRowRenderer={groupRowRenderer}

//                     />
//                 </div>
//             </div>

//             {popUp2 && (
//                 <div className="modal-dialog-centered">
//                     <Modal
//                         isOpen={popUp2}
//                         toggle={handleModalClose}
//                         className='modal-dialog-centered'
//                         backdrop="static"
//                         keyboard={false}
//                     >
//                         {" "}
//                         <ModalHeader
//                             className="modal-sm"
//                             toggle={handleModalClose}
//                         >
//                             Need To Check..
//                         </ModalHeader>
//                         <ModalBody className="pb-3 px-sm-2 mx-20">
//                             <div>
//                                 <b>{popUp2}</b>
//                                 <br></br>
//                                 <br></br>
//                                 <div className="d-flex">
//                                     <Button
//                                         color="primary"
//                                         className="me-1"
//                                         onClick={() => { popUpData2 && baseAmountSubmit(popUpData2) }}
//                                     >
//                                         Confirm
//                                     </Button>
//                                     <Button
//                                         color="danger"
//                                         className="me-1"
//                                         onClick={() => { setPopUp2(false), fetchData() }}
//                                     >
//                                         Cancel
//                                     </Button>
//                                 </div>
//                             </div>
//                         </ModalBody>
//                     </Modal>
//                 </div>
//             )}

//             {/* BackDrop For messages */}
//             <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
//                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                     <h1 style={{ fontWeight: 'bold', color: 'white' }}>
//                         Loading data, please wait...
//                     </h1>
//                     {showSecondaryMessage && (
//                         <h1 style={{ fontWeight: 'bold', color: 'white' }}>
//                             Loading records... This may take a few seconds if there's a lot of data.
//                         </h1>
//                     )}
//                     <CircularProgress color="inherit" />
//                 </div>
//             </Backdrop>

//             <Modal isOpen={openModal} toggle={() => setOpenModal(!openModal)} className="modal-xl">
//                 <ModalHeader toggle={() => setOpenModal(!openModal)} className="modal-xl">
//                     Blocked Dynamic Pricing List
//                 </ModalHeader>
//                 <ModalBody className="modal-xl">
//                     <div>
//                         <BlockedDynamicPricingPage />
//                     </div>
//                 </ModalBody>
//             </Modal>
//         </div>
//     );
// }

// export default DynamicPricingDayWise;


import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import { format } from "date-fns";
import { Card, CardHeader, CardText, CardTitle, Label, Col, Input, Row, Button } from 'reactstrap';
import API_URL from '../../../config';
import { useForm, Controller } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import Moment from 'moment';
import classnames from "classnames";
import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import BlockedDynamicPricingPage from './blockedDynamicPricing';

const DynamicPricingDayWise = (props) => {
    let navigate = useNavigate();
    const [rowData, setRowData] = useState([]);
    const [Today, setToday] = useState()
    const [popUp2, setPopUp2] = useState(false);
    const [popUpData2, setPopUpData2] = useState();
    const [open, setOpen] = useState(false);
    const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [occupancyRanges, setOccupancyRanges] = useState([]);

    const handleSuccess = (message) => {
        return MySwal.fire({
            title: 'Dynamic Pricing',
            text: message,
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        })
    }

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

    useEffect(() => {
        const hotelIDData = JSON.stringify({
            hotelID: 1
        })
        fetch(API_URL + "/getBusinessDate", {
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

    // ** Hooks
    const { reset, handleSubmit, control, watch, formState: { errors }
    } = useForm({});

    const gridRef = useRef();

    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            wrapHeaderText: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ));

    const cellClickedListener = useCallback(event => {
        console.log('cellClicked', event);
    }, []);

    const handleModalClose = () => {
        setPopUp2(false);
        fetchData(); // Your API function
    };

    const onCellValueChanged = (event) => {
        console.log('onCellValueChanged', event);
        const field = event.colDef.field;          // e.g., "KSUP"
        const newValue = event.newValue;
        const oldValue = event.oldValue;
        const occupancy = event.data.Occupancy;    // e.g., "<10"
        const date = event.data.Date;              // e.g., "23 Sep 24"
        const roomTypeID = event.data.roomTypeIDs?.[field]; // e.g., 1

        console.log('Changed Room Type ID:', roomTypeID);
        console.log('Occupancy:', occupancy);
        console.log('Date:', date);
        console.log('New Value:', newValue);

        if (!isNaN(newValue) && !isNaN(oldValue)) {
            setPopUp2('Do you want to change amount from ' + oldValue + ' to ' + newValue + ' for room type ' + field + ' ?');
            setPopUpData2({ newValue: newValue, roomTypeID: roomTypeID, occupancy: occupancy, date: date });
        } else {
            handleError('Invalid amount');
            fetchData();
        }
    };

    function baseAmountSubmit(data) {
        const unAssign = JSON.stringify({
            baseAmount: data.newValue,
            roomTypeID: data.roomTypeID,
            occupancy: data.occupancy,
            date: format(new Date(data.date), 'yyyy-MM-dd'),
        });

        console.log(unAssign)
        fetch(API_URL + "/updateDynamicPricingAmountEdit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: unAssign,
        })
            .then(result => result.json())
            .then(data => {
                navigate('')
                handleSuccess('Updated successfully!!')
                setPopUpData2()
            })
    }

    const getOccupancyRange = (value, occupancyKeys) => {
        // Sort the keys to ensure proper comparison
        const sortedKeys = [...occupancyKeys].sort((a, b) => {
            // Handle special cases first
            if (a === "<10") return -1;
            if (b === "<10") return 1;
            if (a === ">95") return 1;
            if (b === ">95") return -1;

            // Extract numbers from ranges like "10 - 15"
            const aMin = parseInt(a.split(' - ')[0] || a.split(' ')[0]);
            const bMin = parseInt(b.split(' - ')[0] || b.split(' ')[0]);

            return aMin - bMin;
        });

        // Find which range the value falls into
        for (const key of sortedKeys) {
            if (key === "<10" && value < 10) return key;
            if (key === ">95" && value >= 95) return key;

            if (key.includes(" - ")) {
                const [min, max] = key.split(" - ").map(Number);
                if (value >= min && value < max) return key;
            }
        }

        // Default case (shouldn't normally happen)
        return ">95";
    };

    const fetchData = () => {
        setOpen(true);
        const timeout = setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);

        const startDate = watch('fromDate');
        const endDate = watch('toDate');
        const FromDate = startDate ? Moment(String(new Date(startDate))).format('YYYY-MM-DD') : null;
        const ToDate = endDate ? Moment(String(new Date(endDate))).format('YYYY-MM-DD') : null;
        const RoomID = watch('roomID') === '' ? null : watch('roomID');

        const confirmRate = JSON.stringify({
            hotelID: 1,
            fromDate: FromDate,
            toDate: ToDate,
            roomID: RoomID,
        });

        fetch(API_URL + "/getDynamicPricingDayWiseAll", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: confirmRate
        })
            .then(result => result.json())
            .then(res => {
                if (res.statusCode === 200) {
                    const data = res['data'];
                    if (data.length === 0) {
                        setOpen(false)
                        return
                    };
                    const allRoomTypes = new Set();
                    const occupancyKeys = [];
                    const groupedByDate = {};
                    const dateOccupancyMap = {}; // To store which occupancy range to highlight for each date
                    const dateTotalOccupancyMap = {}; // To store totalOccupancy for each date

                    data.sort((a, b) => a.roomTypeID - b.roomTypeID);

                    // Step 1: Collect all room types, occupancy keys, and group by date
                    data.forEach(item => {
                        allRoomTypes.add(item.roomType);

                        // Only include occupancy range keys, exclude other metadata
                        Object.keys(item).forEach(key => {
                            if (!['id', 'hotelID', 'inventoryDate', 'roomTypeID', 'roomType',
                                'isOverRightAllowed', 'totalRooms', 'totalOccupancy'].includes(key)) {
                                if (!occupancyKeys.includes(key)) {
                                    occupancyKeys.push(key);
                                }
                            }
                        });

                        const date = item.inventoryDate;
                        if (!groupedByDate[date]) {
                            groupedByDate[date] = [];
                        }
                        groupedByDate[date].push(item);

                        // Store the occupancy range for this date based on totalOccupancy
                        if (!dateOccupancyMap[date]) {
                            dateOccupancyMap[date] = getOccupancyRange(item.totalOccupancy, occupancyKeys);
                        }

                        // Store the totalOccupancy value for this date
                        if (!dateTotalOccupancyMap[date]) {
                            dateTotalOccupancyMap[date] = item.totalOccupancy;
                        }
                    });

                    const allRoomTypeList = [...allRoomTypes];
                    const rows = [];
                    const sortedRoomTypes = [...allRoomTypeList].sort((a, b) => a.value - b.value);

                    // Step 2: Build transposed rows for each date with highlighted row first
                    Object.entries(groupedByDate).forEach(([date, entries]) => {
                        const formattedDate = format(new Date(date), 'dd MMM yy');
                        const monthYear = format(new Date(date), 'MMM yyyy');
                        const highlightedOccupancy = dateOccupancyMap[date];

                        // Create rows for this date, but put highlighted row first
                        const dateRows = [];

                        occupancyKeys.forEach(occKey => {
                            const row = {
                                Date: formattedDate,
                                MonthYear: monthYear,
                                Occupancy: occKey,
                                CurrentOcc: dateTotalOccupancyMap[date],
                                roomTypeIDs: {},
                                highlight: highlightedOccupancy === occKey,
                                isPinnedHighlight: highlightedOccupancy === occKey // Add this flag for special handling
                            };

                            sortedRoomTypes.forEach(roomType => {
                                const match = entries.find(e => e.roomType === roomType);
                                row[roomType] = match ? match[occKey] : '';
                                if (match) {
                                    row.roomTypeIDs[roomType] = match.roomTypeID;
                                }
                            });

                            dateRows.push(row);
                        });

                        // Sort so highlighted row comes first for each date
                        dateRows.sort((a, b) => {
                            if (a.highlight && !b.highlight) return -1;
                            if (!a.highlight && b.highlight) return 1;
                            return 0;
                        });

                        rows.push(...dateRows);
                    });

                    // Store occupancy ranges for later use
                    setOccupancyRanges(occupancyKeys);

                    // Step 3: Build column defs
                    const columnDefs = [
                        {
                            headerName: 'Month',
                            field: 'MonthYear',
                            rowGroup: true,
                            hide: true,
                            comparator: (valueA, valueB) => {
                                const dateA = new Date(valueA);
                                const dateB = new Date(valueB);
                                return dateA - dateB;
                            }
                        },
                        {
                            headerName: 'Date',
                            field: 'Date',
                            rowGroup: true,
                            hide: true,
                            comparator: (valueA, valueB) => {
                                const dateA = new Date(valueA);
                                const dateB = new Date(valueB);
                                return dateA - dateB;
                            }
                        },
                        {
                            headerName: 'Occupancy %',
                            field: 'Occupancy',
                            width: 140,
                            cellStyle: params => {
                                if (params.data && params.data.highlight) {
                                    return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
                                }
                                return null;
                            }
                        },
                        {
                            headerName: 'Current Occ %',
                            field: 'CurrentOcc',
                            width: 120,
                            valueFormatter: params => {
                                return params.value !== undefined && params.value !== null
                                    ? `${parseFloat(params.value).toFixed(2)}%`
                                    : '';
                            },
                            cellStyle: params => {
                                if (params.data && params.data.highlight) {
                                    return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
                                }
                                return null;
                            }
                        },
                        ...allRoomTypeList.map(roomType => ({
                            headerName: roomType,
                            field: roomType,
                            editable: true,
                            type: 'numericColumn',
                            width: 100,
                            cellStyle: params => {
                                if (params.data && params.data.highlight) {
                                    return { backgroundColor: '#ffeb3b', fontWeight: 'bold' };
                                }
                                return null;
                            }
                        }))
                    ];

                    setOpen(false);
                    setColumnDefs(columnDefs);
                    console.log(rows)
                    setRowData(rows);
                }
            });
    };

    useEffect(() => {
        fetchData()

        if (popUp2 === false) {
            fetchData()
        }
    }, []);

    const [columnDefs, setColumnDefs] = useState([]);

    const buttonListener = useCallback(e => {
        gridRef.current.api.deselectAll();
    }, []);

    const [filterValue, setFilterValue] = useState('');

    const onFilterTextBoxChanged10 = (event) => {
        const { value } = event.target;
        setFilterValue(value);
        const columnId = columnDefs[1]?.field;
        if (columnId) {
            console.log(value)
            gridRef.current?.setFilterModel({
                [columnId]: { type: 'contains', filter: value }
            });
        }
    };

    const fromDate = watch('fromDate');

    //// For Disabling Past Date
    const options = {
        minDate: Today
    };
    const optionsToDate = {
        minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD'))
    };

    const handleResetFilter = () => {
        reset({
            roomID: '',
            fromDate: null,
            toDate: null,
        });
        fetchData()
    };

    // Custom group row renderer to show highlighted data inline
    const groupRowRenderer = (params) => {
        if (params.node.group) {
            // Find highlighted row under this group
            const highlightRow = params.node.allLeafChildren.find(
                child => child.data?.highlight
            )?.data;

            return (
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    {/* Show group key (Date) */}
                    <span style={{ fontWeight: "bold", minWidth: "100px" }}>{params.value}</span>

                    {/* If highlighted row exists, display its values inline */}
                    {highlightRow && (
                        <div style={{
                            display: "flex",
                            marginLeft: "20px",
                            gap: "15px",
                            alignItems: "center",
                            backgroundColor: "#ffeb3b",
                            padding: "2px 8px",
                            borderRadius: "4px"
                        }}>
                            {/* Current Occupancy */}
                            <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                                Current: {highlightRow.CurrentOcc}%
                            </span>

                            {/* Occupancy Range */}
                            <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                                Range: {highlightRow.Occupancy}
                            </span>

                            {/* Show room type values */}
                            {Object.keys(highlightRow.roomTypeIDs || {}).map((roomType) => (
                                <span
                                    key={roomType}
                                    style={{
                                        fontSize: "11px",
                                        border: "1px solid #ddd",
                                        padding: "1px 4px",
                                        borderRadius: "2px",
                                        backgroundColor: "white"
                                    }}
                                >
                                    {roomType}: {highlightRow[roomType]}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    const handleExport = () => {
        if (gridRef.current) {
            gridRef.current.exportDataAsExcel({
                fileName: "Dynamic_PricingList.xlsx",
                sheetName: "Dynamic_PricingList",
                processRowGroupCallback: (params) => {
                    return params.node.key;
                },
            });
        }
    };

    return (
        <div>
            <div>
                <Row>
                    <Col md='3' sm='12' className='mb-1'>
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
                                        options={options}
                                        placeholder='YYYY-MM-DD'
                                        {...field}
                                        className='form-control'
                                    />
                                )}
                            />
                        </div>
                    </Col>

                    <Col md='3' sm='12' className='mb-1'>
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
                                        className='form-control'
                                    />
                                )}
                            />
                        </div>
                    </Col>

                    <Col md='3' sm='12' className='mt-2'>
                        <div className="d-flex">
                            <Button color='primary' className='me-1' onClick={() => fetchData()}>
                                Apply Filter
                            </Button>
                            <Button
                                className='me-1'
                                onClick={handleResetFilter}
                            >
                                Reset Filter
                            </Button>
                           
                        </div>


                    </Col>

                </Row>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: "blue", margin: 0 }}>Double click to edit!!</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Button color="primary" onClick={handleExport}>Download Excel</Button>
                    <Button color="primary" onClick={() => setOpenModal(!openModal)}>
                        Blocked Dynamic Pricing List
                    </Button>
                </div>
            </div>

            <div className="ag-theme-alpine" style={{ height: 660 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    animateRows={true}
                    rowSelection='multiple'
                    onCellClicked={cellClickedListener}
                    onGridReady={params => {
                        gridRef.current = params.api;
                    }}
                    onCellValueChanged={onCellValueChanged}
                    groupDisplayType="multipleColumns"
                    autoGroupColumnDef={{
                        headerName: 'Date/Month',
                        minWidth: 300,  // Increased width to accommodate inline data
                        cellRendererParams: {
                            suppressCount: false
                        }
                    }}
                    paginationPageSize='20'
                    pagination='true'
                    defaultColDef={{
                        ...defaultColDef,
                        enableRowGroup: true,
                        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab']
                    }}
                    headerColor="ddw-primary"
                    masterDetail={false}
                    sideBar={{
                        toolPanels: [
                            {
                                id: 'columns',
                                labelDefault: 'Columns',
                                labelKey: 'columns',
                                iconKey: 'columns',
                                toolPanel: 'agColumnsToolPanel',
                                toolPanelParams: {
                                    suppressRowGroups: false,
                                    suppressValues: true,
                                    suppressPivots: true,
                                    suppressPivotMode: true
                                }
                            }
                        ]
                    }}
                    groupRowRenderer={groupRowRenderer}
                    // Ensure groups are initially collapsed to show pinned data at group level
                    groupDefaultExpanded={0}
                />
            </div>

            {popUp2 && (
                <div className="modal-dialog-centered">
                    <Modal
                        isOpen={popUp2}
                        toggle={handleModalClose}
                        className='modal-dialog-centered'
                        backdrop="static"
                        keyboard={false}
                    >
                        <ModalHeader
                            className="modal-sm"
                            toggle={handleModalClose}
                        >
                            Need To Check..
                        </ModalHeader>
                        <ModalBody className="pb-3 px-sm-2 mx-20">
                            <div>
                                <b>{popUp2}</b>
                                <br></br>
                                <br></br>
                                <div className="d-flex">
                                    <Button
                                        color="primary"
                                        className="me-1"
                                        onClick={() => { popUpData2 && baseAmountSubmit(popUpData2) }}
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        color="danger"
                                        className="me-1"
                                        onClick={() => { setPopUp2(false), fetchData() }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            )}

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                        Loading data, please wait...
                    </h1>
                    {showSecondaryMessage && (
                        <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                            Loading records... This may take a few seconds if there's a lot of data.
                        </h1>
                    )}
                    <CircularProgress color="inherit" />
                </div>
            </Backdrop>

            <Modal isOpen={openModal} toggle={() => setOpenModal(!openModal)} className="modal-xl">
                <ModalHeader toggle={() => setOpenModal(!openModal)} className="modal-xl">
                    Blocked Dynamic Pricing List
                </ModalHeader>
                <ModalBody className="modal-xl">
                    <div>
                        <BlockedDynamicPricingPage />
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default DynamicPricingDayWise;