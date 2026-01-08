// // import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
// // import { useForm, Controller } from "react-hook-form";

// // import API_URL from '../../../config'

// // // ** Reactstrap Imports
// // import { Col, Label, Input, Row, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

// // // import 'ag-grid-enterprise'
// // import 'ag-grid-enterprise'
// // import { AgGridReact } from 'ag-grid-react'
// // import '/node_modules/ag-grid-community/styles/ag-grid.css'
// // import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
// // import { DateTime } from 'luxon';
// // import Moment from "moment";
// // import Flatpickr from "react-flatpickr";
// // import "@styles/react/libs/flatpickr/flatpickr.scss";

// // import { format } from "date-fns";
// // import FeedBackShow from './feedbackShow';
// // const InventoryLogs = (data) => {

// //     const gridRef = useRef();
// //     const [logData, setLogData] = useState(false);
// //     const [Today, setToday] = useState()
// //     const [filldata, setfilldata] = useState()
// //     const [openFeedBackShow, setOpenFeedBackShow] = useState()


// //     const {
// //         reset,
// //         handleSubmit,
// //         control,
// //         formState: { errors },
// //         watch
// //     } = useForm({});
// //     // get modification log data
// //     useEffect(() => {
// //         const reservationData = JSON.stringify({
// //             //   reservationID: data.data.id
// //         })


// //         fetchx(API_URL + '/getAddedFeedBackByID',)
// //             .then((res) => res.json())
// //             .then(postres => {
// //                 setLogData(postres['data'])
// //             }).catch((err) => {
// //                 console.log(err)
// //             })

// //     }, []);


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

// //     const formatToIST = (dateString) => {
// //         if (dateString) {
// //             const date = DateTime.fromISO(dateString, { zone: 'utc' });
// //             const istDate = date.setZone('Asia/Kolkata');
// //             return istDate.toFormat('dd-MM-yyyy HH:mm:ss');
// //         }
// //         return 'No date available';
// //     };

// //     // Ag-grid options
// //     const gridOptions = {
// //         defaultColDef: {
// //             cellStyle: { whiteSpace: 'normal' }, // Allow text wrapping
// //             autoHeight: true, // Allow the cell to expand vertically
// //         },
// //     };


// //     const fromDate = watch('fromDate');
// //     const toDate = watch('toDate');
// //     const options = {
// //         minDate: Today
// //     };
// //     const optionsToDate = {
// //         minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
// //     };



// //     // Function to format date
// //     function formatDate(date) {
// //         const dateString = date.toString();

// //         // Check if the date string matches the format "MMM YYYY"
// //         const isMonthYearFormat = dateString.match(/^\w{3} \d{4}$/);

// //         if (isMonthYearFormat) {
// //             return dateString; // Return the date as is
// //         } else {
// //             const day = date.getDate().toString().padStart(2, '0');
// //             const month = (date.getMonth() + 1).toString().padStart(2, '0');
// //             const year = date.getFullYear();
// //             return `${day}.${month}.${year}`;
// //         }
// //     }


// //     const defaultColDef = useMemo(() => (
// //         {
// //             sortable: true,
// //             filter: true,
// //             autoHeight: true,
// //             wrapText: true,
// //             filterParams: {
// //                 buttons: ['apply', 'reset']
// //             }
// //         }
// //     ));





// //     useEffect(() => {

// //         // Call the function whenever both fromDate and toDate are filled
// //         if (fromDate !== undefined && toDate !== undefined) {
// //             if (Array.isArray(fromDate) && Array.isArray(toDate) &&
// //                 fromDate.length !== 0 && toDate.length !== 0 &&
// //                 fromDate[0] !== '' && toDate[0] !== '') {

// //                 let fromDateFormat = fromDate !== '' ? format(new Date(fromDate), 'yyyy-MM-dd') : '';
// //                 let toDateFormat = toDate !== '' ? format(new Date(toDate), 'yyyy-MM-dd') : '';
// //                 fetch(API_URL + "/getReservationWithFeedBack?fromDate=" + fromDateFormat + "&toDate=" + toDateFormat)
// //                     .then((result) => result.json())
// //                     .then((rowData) => {
// //                         setLogData(rowData["data"]);
// //                         // console.log(rowData)
// //                     });
// //             }
// //             else {
// //                 fetch(API_URL + "/getReservationWithFeedBack")
// //                     .then((result) => result.json())
// //                     .then((rowData) => {
// //                         setLogData(rowData["data"]);
// //                         // console.log(rowData)
// //                     });
// //             }
// //         }
// //     }, [fromDate, toDate]);




// //     //AG-GRID columns to show daily details
// //     const [columnDefs1, setColumnDefs1] = useState([

// //         { headerName: 'B ID', field: 'bookingID', width: 90 },
// //         { headerName: 'Guest', field: 'guestName', width: 160 },
// //         {
// //             headerName: "Comp/Agent",
// //             field: "accountName",
// //             suppressSizeToFit: true,
// //             maxWidth: 160,
// //         },
// //         {
// //             headerName: "Arrival",
// //             field: "arrivalDate",
// //             suppressSizeToFit: true,
// //             maxWidth: 120,
// //             cellRenderer: (params) => {
// //                 if (params.data && params.data.arrivalDate) {
// //                     const formattedDate = format(new Date(params.data.arrivalDate), 'dd MMM yy');
// //                     return formattedDate;
// //                 } else {
// //                     return "";
// //                 }
// //             }
// //         },
// //         {
// //             headerName: "Departure",
// //             field: "departureDate",
// //             suppressSizeToFit: true,
// //             maxWidth: 120,
// //             cellRenderer: (params) => {
// //                 if (params.data && params.data.departureDate) {
// //                     const formattedDate = format(new Date(params.data.departureDate), 'dd MMM yy');
// //                     return formattedDate;
// //                 } else {
// //                     return "";
// //                 }
// //             }
// //         },
// //         { headerName: 'Room', field: 'roomNumber', width: 110 },
// //         { headerName: 'Room Type', field: 'roomType', width: 130 },
// //         { headerName: 'Status', field: 'reservationStatus', width: 130 },
// //         {
// //             headerName: "Actions",
// //             cellRendererFramework: (params) => (
// //               <Button
// //                 color=""
// //                 style={{  backgroundColor:"#22F18B", color:"black" }}
// //                 onClick={async () => {
// //                   try {
// //                     // Fetch data based on reservationID
// //                     const reservationID = params.data.id;
// //                     const response = await fetch(API_URL + `/getReservationForFrontDeskByResID?reservationID=${reservationID}`);
// //                     const rowData = await response.json();

// //                     // Update state with fetched data

// //                     setfilldata(rowData.data[0]);

// //                     // Toggle options after data is fetched
// //                     setOpenFeedBackShow(!openFeedBackShow);
// //                     CallAlerts(rowData.data[0])
// //                     // Store reservation ID in sessionStorage
// //                     sessionStorage.setItem('reser_ID', reservationID);
// //                   } catch (error) {
// //                     console.error("Error fetching reservation data:", error);
// //                   }
// //                 }}
// //               >
// //                 View Feedback
// //               </Button>
// //             ),
// //             suppressSizeToFit: true,
// //             cellStyle: { textAlign: 'center' },
// //             cellClass: 'vertical-center',
// //             maxWidth: 180
// //           },
// //         { headerName: 'Grp ID', field: 'blockCodeID', width: 130 },


// //     ])


// //     // On search element
// //     const onFilterTextBoxChanged = useCallback(() => {
// //         gridRef.current.api.setQuickFilter(
// //             document.getElementById("filter-text-box").value
// //         );
// //     }, []);


// //     const customStyles = `
// //     .vertical-center {
// //       display: flex;
// //       align-items: center;
// //       justify-content: center;
// //     }
// //     `;

// //     // Function to format date with time
// //     function formatDates(date) {
// //         const day = date.getDate().toString().padStart(2, '0');
// //         const month = (date.getMonth() + 1).toString().padStart(2, '0');
// //         const year = date.getFullYear();

// //         const hour = date.getHours().toString().padStart(2, '0');
// //         const minute = date.getMinutes().toString().padStart(2, '0');
// //         const period = (hour >= 12) ? 'PM' : 'AM';

// //         const formattedTime = `${(hour % 12) || 12}:${minute} ${period}`;
// //         return `${day}.${month}.${year} ${formattedTime}`;
// //     }


// //     return (
// //         <div>
// //             <div>
// //                 <h3>
// //                     Feedback
// //                 </h3>
// //                 <br></br>
// //                 <div>
// //                     <Row>
// //                         <Col md="3" sm="12" className="mb-1">
// //                             <Label className="form-label" for="fullName">
// //                                 Search
// //                             </Label>
// //                             <Input
// //                                 type="text"
// //                                 id="filter-text-box"
// //                                 placeholder="Filter..."
// //                                 onInput={onFilterTextBoxChanged}
// //                             />
// //                         </Col>
// //                         <Col md='2' sm='12' className='mb-1'>
// //                             <div className="mb-1">
// //                                 <Label className="form-label" for="fromDate">
// //                                     From Date
// //                                 </Label>
// //                                 <Controller
// //                                     control={control}
// //                                     id='fromDate'
// //                                     name='fromDate'
// //                                     render={({ field }) => (
// //                                         <Flatpickr
// //                                             // required
// //                                             options={options}
// //                                             placeholder='YYYY-MM-DD'
// //                                             {...field}
// //                                             className='form-control'

// //                                         />
// //                                     )}
// //                                 />
// //                             </div>
// //                         </Col>
// //                         <Col md='2' sm='12' className='mb-1'>
// //                             <div className='mb-1'>
// //                                 <Label className='form-label' for='toDate'>
// //                                     To Date
// //                                 </Label>
// //                                 <Controller
// //                                     control={control}
// //                                     id='toDate'
// //                                     name='toDate'
// //                                     render={({ field }) => (
// //                                         <Flatpickr
// //                                             placeholder='YYYY-MM-DD'
// //                                             {...field}
// //                                             options={optionsToDate}
// //                                             // options={{ allowInput: true }}
// //                                             className='form-control'

// //                                         />
// //                                     )}
// //                                 />
// //                             </div>
// //                         </Col>
// //                     </Row>
// //                 </div>



// //                 <div className="ag-theme-alpine" style={{ height: '693px', width: '100%' }}>
// //                     <AgGridReact
// //                         ref={gridRef}
// //                         rowData={logData}
// //                         columnDefs={columnDefs1}
// //                         animateRows={true}
// //                         defaultColDef={defaultColDef}
// //                         rowSelection='multiple'
// //                         pagination={true}
// //                         paginationPageSize='10'
// //                         gridOptions={gridOptions}
// //                         headerColor="ddw-primary"
// //                     />
// //                 </div>
// //                 <br />
// //             </div>
// //             <div>
// //             <Modal isOpen={openFeedBackShow} toggle={() => setOpenFeedBackShow(!openFeedBackShow)} className="modal-xl"  >
// //           <ModalHeader className="modal-xl" toggle={() => setOpenFeedBackShow(!openFeedBackShow)} >
// //             Feedback
// //           </ModalHeader>
// //           <ModalBody className="pb-3 px-sm-1 mx-20">
// //            {filldata &&  <FeedBackShow data1={filldata} />}
// //           </ModalBody>
// //         </Modal>
// //         </div>
// //         </div>
// //     )
// // }


// // export default InventoryLogs 


// import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
// import { useForm, Controller } from "react-hook-form";
// import API_URL from '../../../config'
// import { Col, Label, Input, Row, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
// import 'ag-grid-enterprise'
// import { AgGridReact } from 'ag-grid-react'
// import '/node_modules/ag-grid-community/styles/ag-grid.css'
// import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
// import { DateTime } from 'luxon';
// import Moment from "moment";
// import Flatpickr from "react-flatpickr";
// import "@styles/react/libs/flatpickr/flatpickr.scss";
// import { format } from "date-fns";
// import FeedBackShow from './feedbackShow';

// const InventoryLogs = (data) => {
//     const gridRef = useRef();
//     const [logData, setLogData] = useState([]);
//     const [Today, setToday] = useState()
//     const [filldata, setfilldata] = useState()
//     const [openFeedBackShow, setOpenFeedBackShow] = useState()
//     const [columnDefs1, setColumnDefs1] = useState([])

//     const {
//         reset,
//         handleSubmit,
//         control,
//         formState: { errors },
//         watch
//     } = useForm({});

//     // Fetch feedback data
//     useEffect(() => {
//         fetch(API_URL + '/getAddedFeedBackByID')
//             .then((res) => res.json())
//             .then(postres => {
//                 setLogData(postres['data']);
//                 generateColumnDefs(postres['data']);
//             }).catch((err) => {
//                 console.log(err)
//             })
//     }, []);

//     // Generate dynamic column definitions based on feedback categories
//     const generateColumnDefs = (data) => {
//         if (data.length > 0) {
//             const feedbackCategories = new Set();
//             data.forEach(item => {
//                 item.feedBackJSON.forEach(feedback => {
//                     feedbackCategories.add(feedback.name);
//                 });
//             });

//             // const dynamicColumns = Array.from(feedbackCategories).map(category => ({
//             //     headerName: category,
//             //     field: category,
//             //     cellRenderer: (params) => {
//             //         const feedback = params.data.feedBackJSON.find(f => f.name === category);
//             //         return feedback ? feedback.rating : '';
//             //     },
//             //     width: 200
//             // }));

//             // const dynamicColumns = Array.from(feedbackCategories).map(category => {
//             //     const baseWidthPerChar = 11; // Adjust as needed
//             //     const minWidth = 150; // Adjust as needed
//             //     const calculatedWidth = Math.max(category.length * baseWidthPerChar, minWidth);

//             //     return {
//             //         headerName: category,
//             //         field: category,
//             //         cellRenderer: (params) => {
//             //             const feedback = params.data.feedBackJSON.find(f => f.name === category);
//             //             return feedback ? feedback.rating : '';
//             //         },
//             //         width: calculatedWidth,
//             //         headerClass: 'wrap-header', // For header text wrapping
//             //         cellStyle: { textAlign: 'center' } // Center-align cell content
//             //     };
//             // });

//             const bgColors = [
//                 "#f56565", "#ed8936", "#f6ad55", "#ecc94b", "#faf089",
//                 "#6BDA70", "#66BB6A", "#20A326", "#67C3BA", "#0EA597"
//             ];

//             const dynamicColumns = Array.from(feedbackCategories).map(category => {
//                 const baseWidthPerChar = 12; // Adjust as needed
//                 const minWidth = 150; // Adjust as needed
//                 const calculatedWidth = Math.max(category.length * baseWidthPerChar, minWidth);

//                 return {
//                     headerName: category,
//                     field: category,
//                     cellRenderer: (params) => {
//                         const feedback = params.data.feedBackJSON.find(f => f.name === category);
//                         return feedback ? feedback.rating : '';
//                     },
//                     width: calculatedWidth,
//                     headerClass: 'wrap-header', // For header text wrapping
//                     cellStyle: (params) => {
//                         const feedback = params.data.feedBackJSON.find(f => f.name === category);
//                         if (feedback && feedback.rating >= 1 && feedback.rating <= 10) {
//                             return {
//                                 textAlign: 'center', // Center-align text
//                                 backgroundColor: bgColors[feedback.rating - 1] // Set background color based on rating
//                             };
//                         }
//                         return { textAlign: 'center' }; // Default style if no rating
//                     }
//                 };
//             });

//             setColumnDefs1([
//                 { headerName: 'Guest', field: 'guestName', width: 160 },
//                 ...dynamicColumns,
//                 // {
//                 //     headerName: "Actions",
//                 //     cellRendererFramework: (params) => (
//                 //         <Button
//                 //             color=""
//                 //             style={{ backgroundColor: "#22F18B", color: "black" }}
//                 //             onClick={async () => {
//                 //                 try {
//                 //                     const reservationID = params.data.id;
//                 //                     const response = await fetch(API_URL + `/getReservationForFrontDeskByResID?reservationID=${reservationID}`);
//                 //                     const rowData = await response.json();
//                 //                     setfilldata(rowData.data[0]);
//                 //                     setOpenFeedBackShow(!openFeedBackShow);
//                 //                     sessionStorage.setItem('reser_ID', reservationID);
//                 //                 } catch (error) {
//                 //                     console.error("Error fetching reservation data:", error);
//                 //                 }
//                 //             }}
//                 //         >
//                 //             View Feedback
//                 //         </Button>
//                 //     ),
//                 //     suppressSizeToFit: true,
//                 //     cellStyle: { textAlign: 'center' },
//                 //     cellClass: 'vertical-center',
//                 //     maxWidth: 180
//                 // }
//             ]);
//         }
//     };


//         const defaultColDef = useMemo(() => (
//             {
//                 sortable: true,
//                 filter: true,
//                 autoHeight: true,
//                 wrapText: true,
//                 filterParams: {
//                     buttons: ['apply', 'reset']
//                 }
//             }
//         ));

//           // Ag-grid options
//     const gridOptions = {
//         defaultColDef: {
//             cellStyle: { whiteSpace: 'normal' }, // Allow text wrapping
//             autoHeight: true, // Allow the cell to expand vertically
//         },
//     };

//     // Rest of the code remains the same...

//     return (
//         <div>
//             <div>
//                 <h3>Feedback</h3>
//                 <br></br>
//                 <div>
//                     {/* <Row>
//                         <Col md="3" sm="12" className="mb-1">
//                             <Label className="form-label" for="fullName">Search</Label>
//                             <Input
//                                 type="text"
//                                 id="filter-text-box"
//                                 placeholder="Filter..."
//                                 onInput={onFilterTextBoxChanged}
//                             />
//                         </Col>
//                         <Col md='2' sm='12' className='mb-1'>
//                             <div className="mb-1">
//                                 <Label className="form-label" for="fromDate">From Date</Label>
//                                 <Controller
//                                     control={control}
//                                     id='fromDate'
//                                     name='fromDate'
//                                     render={({ field }) => (
//                                         <Flatpickr
//                                             options={options}
//                                             placeholder='YYYY-MM-DD'
//                                             {...field}
//                                             className='form-control'
//                                         />
//                                     )}
//                                 />
//                             </div>
//                         </Col>
//                         <Col md='2' sm='12' className='mb-1'>
//                             <div className='mb-1'>
//                                 <Label className='form-label' for='toDate'>To Date</Label>
//                                 <Controller
//                                     control={control}
//                                     id='toDate'
//                                     name='toDate'
//                                     render={({ field }) => (
//                                         <Flatpickr
//                                             placeholder='YYYY-MM-DD'
//                                             {...field}
//                                             options={optionsToDate}
//                                             className='form-control'
//                                         />
//                                     )}
//                                 />
//                             </div>
//                         </Col>
//                     </Row> */}
//                 </div>

//                 <div className="ag-theme-alpine" style={{ height: '693px', width: '100%' }}>
//                     <AgGridReact
//                         ref={gridRef}
//                         rowData={logData}
//                         columnDefs={columnDefs1}
//                         animateRows={true}
//                         defaultColDef={defaultColDef}
//                         rowSelection='multiple'
//                         pagination={true}
//                         paginationPageSize='10'
//                         gridOptions={gridOptions}
//                         headerColor="ddw-primary"
//                     />
//                 </div>
//                 <br />
//             </div>
//             <div>
//                 <Modal isOpen={openFeedBackShow} toggle={() => setOpenFeedBackShow(!openFeedBackShow)} className="modal-xl">
//                     <ModalHeader className="modal-xl" toggle={() => setOpenFeedBackShow(!openFeedBackShow)}>Feedback</ModalHeader>
//                     <ModalBody className="pb-3 px-sm-1 mx-20">
//                         {filldata && <FeedBackShow data1={filldata} />}
//                     </ModalBody>
//                 </Modal>
//             </div>
//         </div>
//     )
// }

// export default InventoryLogs;


// import React, { useState, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { saveAs } from "file-saver";
// import { FaFileCsv } from "react-icons/fa";
// import Papa from "papaparse";
// import API_URL from "../../../config";
// const FeedbackTable = ({ feedbackData }) => {
//   const [rowData, setRowData] = useState([]);
//   const [columnDefs, setColumnDefs] = useState([]);

//      useEffect(() => {
//         fetch(API_URL + '/getAddedFeedBackByID')
//             .then((res) => res.json())
//             .then(postres => {
//                 setRowData(postres['data']);
//                 transformData(postres['data'])
//                 // generateColumnDefs(postres['data']);
//             }).catch((err) => {
//                 console.log(err)
//             })
//     }, []);


//   const transformData = (data) => {
//     let transformedRows = [];
//     let departmentMap = new Map(); // To store department-wise columns

//     data.forEach((feedback) => {
//       let row = {
//         guestName: feedback.guestName,
//         date: feedback.createdAt,
//         hotel: feedback.hotelID,
//       };

//       feedback.feedBackJSON.forEach((item) => {
//         const dept = item.departmentName;
//         const criteria = item.name;
//         row[`${dept}_${criteria}`] = item.rating;

//         if (!departmentMap.has(dept)) {
//           departmentMap.set(dept, new Set());
//         }
//         departmentMap.get(dept).add(criteria);
//       });

//       transformedRows.push(row);
//     });

//     setRowData(transformedRows);

//     // Generate column definitions with grouped headers
//     const baseColumns = [
//       { headerName: "Guest Name", field: "guestName", width: 200 },
//       { headerName: "Date", field: "date", width: 180 },
//     ];

//     const groupedColumns = Array.from(departmentMap.entries()).map(
//       ([dept, criteriaSet]) => ({
//         headerName: dept,
//         children: Array.from(criteriaSet).map((criteria) => ({
//           headerName: criteria,
//           field: `${dept}_${criteria}`,
//           width: 150,
//         })),
//       })
//     );

//     setColumnDefs([...baseColumns, ...groupedColumns]);
//   };

//   // CSV Export Function
//   const exportToCSV = () => {
//     const csvData = Papa.unparse(rowData);
//     const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "FeedbackData.csv");
//   };

//   return (
//     <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//       <button onClick={exportToCSV} style={{ marginBottom: 10 }}>
//         <FaFileCsv /> Export CSV
//       </button>
//       <AgGridReact rowData={rowData} columnDefs={columnDefs} defaultColDef={{ resizable: true }} />
//     </div>
//   );
// };

// export default FeedbackTable;

// import React, { useState, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { saveAs } from "file-saver";
// import { FaFileCsv } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import API_URL from "../../../config";

// const FeedbackTable = ({ feedbackData }) => {
//   const [rowData, setRowData] = useState([]);
//   const [columnDefs, setColumnDefs] = useState([]);
//   const [departments, setDepartments] = useState([]);

//   useEffect(() => {
//     fetch(API_URL + '/getAddedFeedBackByID')
//       .then((res) => res.json())
//       .then(postres => {
//         setRowData(postres['data']);
//         transformData(postres['data']);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   const transformData = (data) => {
//     let transformedRows = [];
//     let departmentMap = new Map(); // To store department-wise columns

//     data.forEach((feedback) => {
//       let row = {
//         guestName: feedback.guestName,
//         date: feedback.createdAt,
//         hotel: feedback.hotelID,
//       };

//       feedback.feedBackJSON.forEach((item) => {
//         const dept = item.departmentName;
//         const criteria = item.name;
//         row[`${dept}_${criteria}`] = item.rating;

//         if (!departmentMap.has(dept)) {
//           departmentMap.set(dept, new Set());
//         }
//         departmentMap.get(dept).add(criteria);
//       });

//       transformedRows.push(row);
//     });

//     setRowData(transformedRows);

//     // Generate column definitions with grouped headers
//     const baseColumns = [
//       { headerName: "Guest Name", field: "guestName", width: 200 },
//       { headerName: "Date", field: "date", width: 180 },
//     ];

//     const groupedColumns = Array.from(departmentMap.entries()).map(
//       ([dept, criteriaSet]) => ({
//         headerName: dept,
//         headerClass: 'department-header', // Add class for department headers
//         children: Array.from(criteriaSet).map((criteria) => ({
//           headerName: criteria,
//           field: `${dept}_${criteria}`,
//           width: 150,
//           headerClass: 'criteria-header', // Add class for criteria headers
//           cellClass: 'criteria-cell', // Add class for criteria cells
//         })),
//       })
//     );
//     setDepartments(Array.from(departmentMap.keys())); // Store department names

//     setColumnDefs([...baseColumns, ...groupedColumns]);
//   };
//   console.log(rowData)

//   // Excel Export Function
//   const exportToExcel = () => {
//     if (!rowData || rowData.length === 0) {
//       console.error("No data available for export.");
//       return;
//     }

//     let departmentMap = new Map();

//     // Extract headers dynamically from API data
//     rowData.forEach((row) => {
//       Object.keys(row).forEach((header) => {
//         if (header.includes("_")) {
//           const [dept, criteria] = header.split("_");
//           if (!departmentMap.has(dept)) {
//             departmentMap.set(dept, []);
//           }
//           if (!departmentMap.get(dept).includes(criteria)) {
//             departmentMap.get(dept).push(criteria);
//           }
//         }
//       });
//     });

//     // Fixed headers
//     let departmentRow = ["Guest Name", "Date"];
//     let criteriaRow = ["", ""];
//     let headers = ["guestName", "date"];
//     let merges = [];

//     let colIndex = 2; // Start from column index 2 (C)

//     departmentMap.forEach((criteria, dept) => {
//       departmentRow.push(dept, ...Array(criteria.length - 1).fill(""));
//       criteriaRow.push(...criteria);
//       headers.push(...criteria.map((c) => `${dept}_${c}`));

//       // Merge department headers if repeated
//       if (criteria.length > 1) {
//         merges.push({
//           s: { r: 0, c: colIndex },
//           e: { r: 0, c: colIndex + criteria.length - 1 },
//         });
//       }
//       colIndex += criteria.length;
//     });

//     // Map row data and align center
//     let excelData = rowData.map((row) =>
//       headers.map((h) => ({ v: row[h] ?? "", t: "s", s: { alignment: { horizontal: "center" } } }))
//     );

//     // Insert headers at the top
//     excelData.unshift(criteriaRow.map((h) => ({ v: h, t: "s", s: { alignment: { horizontal: "center", vertical: "center" } } })));
//     excelData.unshift(departmentRow.map((h) => ({ v: h, t: "s", s: { alignment: { horizontal: "center", vertical: "center" }, font: { bold: true } } })));

//     // Generate Excel sheet
//     const ws = XLSX.utils.aoa_to_sheet(excelData);
//     ws["!merges"] = merges;

//     // Auto-adjust column width
//     ws["!cols"] = headers.map((_, index) => ({
//       wch: Math.min(Math.max((criteriaRow[index]?.length || 5) * 10, 15), 50),
//     }));

//     // Create and download the Excel file
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Feedback Data");
//     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(blob, "FeedbackData_Grouped.xlsx");
//   };








//   return (
//     <div>
//       {/* Add CSS directly in the component */}
//       <style>
//         {`
//           /* Center-align department headers */
//           .department-header {
//             text-align: center !important;
//             font-weight: bold !important;
//             background-color: #f0f0f0 !important; /* Optional: Add background color */
//           }

//           /* Wrap criteria headers and center-align text */
//           .criteria-header {
//             white-space: normal !important; /* Allow text wrapping */
//             text-align: center !important;
//             line-height: 1.5 !important; /* Adjust line height for better readability */
//           }

//           /* Center-align criteria cells */
//           .criteria-cell {
//             text-align: center !important;
//           }
//         `}
//       </style>

//       <button onClick={exportToExcel} style={{ marginBottom: 10 }}>
//         <FaFileCsv /> Export CSV
//       </button>
//       <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//         <AgGridReact
//           rowData={rowData}
//           columnDefs={columnDefs}
//           defaultColDef={{ resizable: true }}
//         />
//       </div>
//     </div>
//   );
// };

// export default FeedbackTable;

// const bgColors = [
//                   "#f56565", "#ed8936", "#f6ad55", "#ecc94b", "#faf089",
//                   "#6BDA70", "#66BB6A", "#20A326", "#67C3BA", "#0EA597"
//               ];

//               const dynamicColumns = Array.from(feedbackCategories).map(category => {
//                   const baseWidthPerChar = 12; // Adjust as needed
//                   const minWidth = 150; // Adjust as needed
//                   const calculatedWidth = Math.max(category.length * baseWidthPerChar, minWidth);

//                   return {
//                       headerName: category,
//                       field: category,
//                       cellRenderer: (params) => {
//                           const feedback = params.data.feedBackJSON.find(f => f.name === category);
//                           return feedback ? feedback.rating : '';
//                       },
//                       width: calculatedWidth,
//                       headerClass: 'wrap-header', // For header text wrapping
//                       cellStyle: (params) => {
//                           const feedback = params.data.feedBackJSON.find(f => f.name === category);
//                           if (feedback && feedback.rating >= 1 && feedback.rating <= 10) {
//                               return {
//                                   textAlign: 'center', // Center-align text
//                                   backgroundColor: bgColors[feedback.rating - 1] // Set background color based on rating
//                               };
//                           }
//                           return { textAlign: 'center' }; // Default style if no rating
//                       }
//                   };
// });

// import React, { useState, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { saveAs } from "file-saver";
// import { FaFileCsv } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import API_URL from "../../../config";
// import { Button } from "reactstrap";

// const FeedbackTable = ({ feedbackData }) => {
//   const [rowData, setRowData] = useState([]);
//   const [columnDefs, setColumnDefs] = useState([]);
//   const [departments, setDepartments] = useState([]);

//   useEffect(() => {
//     fetch(API_URL + "/getAddedFeedBackByID")
//       .then((res) => res.json())
//       .then((postres) => {
//         setRowData(postres["data"]);
//         transformData(postres["data"]);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   const transformData = (data) => {
//     console.log(data)
//     let transformedRows = [];
//     let departmentMap = new Map();

//     data.forEach((feedback) => {
//       let row = {
//         guestName: feedback.guestName,
//         date: feedback.createdAt,
//         hotel: feedback.hotelID,
//       };

//       feedback.feedBackJSON.forEach((item) => {
//         const dept = item.departmentName;
//         const criteria = item.name;
//         row[`${dept}_${criteria}`] = item.rating;

//         if (!departmentMap.has(dept)) {
//           departmentMap.set(dept, new Set());
//         }
//         departmentMap.get(dept).add(criteria);
//       });

//       transformedRows.push(row);
//     });

//     setRowData(transformedRows);

//     const baseColumns = [
//       { headerName: "Guest Name", field: "guestName", width: 200, headerClass: "center-header" },
//       { headerName: "Date", field: "date", width: 180, headerClass: "center-header" },
//     ];

//     const bgColors = [
//       "#f56565", "#ed8936", "#f6ad55", "#ecc94b", "#faf089",
//       "#6BDA70", "#66BB6A", "#20A326", "#67C3BA", "#0EA597"
//     ];
//     // const groupedColumns = Array.from(departmentMap.entries()).map(
//     //   ([dept, criteriaSet]) => ({
//     //     headerName: dept,
//     //     headerClass: "center-header department-header",
//     //     children: Array.from(criteriaSet).map((criteria) => ({
//     //       headerName: criteria,
//     //       field: `${dept}_${criteria}`,
//     //       width: 150,
//     //       headerClass: "center-header criteria-header",
//     //       cellClass: "criteria-cell",
//     //     })),
//     //   })
//     // );

//     // const groupedColumns = Array.from(departmentMap.entries()).map(
//     //   ([dept, criteriaSet]) => ({
//     //     headerName: dept,
//     //     headerClass: "center-header department-header",
//     //     headerWrapText: true, // Wrap text
//     //     autoHeaderHeight: true, // Auto adjust height
//     //     children: Array.from(criteriaSet).map((criteria) => ({
//     //       headerName: criteria,
//     //       field: `${dept}_${criteria}`,
//     //       width: 150,
//     //       headerClass: "center-header criteria-header",
//     //       headerWrapText: true, // Wrap text
//     //       autoHeaderHeight: true, // Auto adjust height
//     //     })),
//     //   })
//     // );


//     const groupedColumns = Array.from(departmentMap.entries()).map(
//       ([dept, criteriaSet]) => ({
//         headerName: dept,
//         headerClass: `center-header ${
//           criteriaSet.size > 1 ? "multi-column-header" : ""
//         }`,
//         children: Array.from(criteriaSet).map((criteria) => ({
//           headerName: criteria,
//           field: `${dept}_${criteria}`,
//           width: 150,
//           headerClass: "center-header",
//         })),
//       })
//     );






//     setDepartments(Array.from(departmentMap.keys()));
//     console.log([...baseColumns])
//     console.log([ ...groupedColumns])
//     setColumnDefs([...baseColumns, ...groupedColumns]);
//   };


//   const exportToExcel = () => {
//     if (!rowData || rowData.length === 0) {
//       console.error("No data available for export.");
//       return;
//     }

//     let departmentMap = new Map();

//     rowData.forEach((row) => {
//       Object.keys(row).forEach((header) => {
//         if (header.includes("_")) {
//           const [dept, criteria] = header.split("_");
//           if (!departmentMap.has(dept)) {
//             departmentMap.set(dept, []);
//           }
//           if (!departmentMap.get(dept).includes(criteria)) {
//             departmentMap.get(dept).push(criteria);
//           }
//         }
//       });
//     });

//     let departmentRow = ["Guest Name", "Date"];
//     let criteriaRow = ["", ""];
//     let headers = ["guestName", "date"];
//     let merges = [];

//     let colIndex = 2;

//     departmentMap.forEach((criteria, dept) => {
//       departmentRow.push(dept, ...Array(criteria.length - 1).fill(""));
//       criteriaRow.push(...criteria);
//       headers.push(...criteria.map((c) => `${dept}_${c}`));

//       if (criteria.length > 1) {
//         merges.push({
//           s: { r: 0, c: colIndex },
//           e: { r: 0, c: colIndex + criteria.length - 1 },
//         });
//       }
//       colIndex += criteria.length;
//     });

//     let excelData = rowData.map((row) =>
//       headers.map((h) => ({ v: row[h] ?? "", t: "s", s: { alignment: { horizontal: "center" } } }))
//     );

//     excelData.unshift(criteriaRow.map((h) => ({ v: h, t: "s", s: { alignment: { horizontal: "center", vertical: "center" } } })));
//     excelData.unshift(departmentRow.map((h) => ({ v: h, t: "s", s: { alignment: { horizontal: "center", vertical: "center" }, font: { bold: true } } })));

//     const ws = XLSX.utils.aoa_to_sheet(excelData);
//     ws["!merges"] = merges;

//     ws["!cols"] = headers.map((_, index) => ({
//       wch: Math.min(Math.max((criteriaRow[index]?.length || 5) * 10, 15), 50),
//     }));

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Feedback Data");
//     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(blob, "FeedbackData_Grouped.xlsx");
//   };



//   const gridOptions = {
//     autoHeaderHeight: true,
//   };


//   return (
//     <div>
//       <style>
//         {`
//         .multi-column-header {
//   display: flex !important;
//   align-items: center !important;
//   justify-content: center !important;
//   text-align: center !important;
//   font-weight: bold !important;
// }


//           .center-header {
//             text-align: center !important;
//             justify-content: center !important;
//             display: flex !important;
//             align-items: center !important;
//           }

//           .department-header {
//             font-weight: bold !important;
//             background-color: #f0f0f0 !important;
//           }

//           .criteria-header {
//             white-space: normal !important;
//             text-align: center !important;
//             line-height: 1.5 !important;
//           }

//           .criteria-cell {
//             text-align: center !important;
//           }
// .ag-header-group-cell-label {
//   justify-content: center !important;
//   text-align: center !important;
//   font-weight: bold !important;
//   display: flex !important;
//   align-items: center !important;
// }

// .ag-header-cell-label {
//   justify-content: center !important;
//   text-align: center !important;
//   display: flex !important;
//   align-items: center !important;
// }




//         `}
//       </style>
//       {/* 
//       <Button onClick={exportToExcel} style={{ marginBottom: 10 }} color='primary'>
//         <FaFileCsv /> Export CSV
//       </Button> */}
//       <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
//         <Button onClick={exportToExcel} color="primary">
//           <FaFileCsv /> Export CSV
//         </Button>
//       </div>

//       <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//         {/* <AgGridReact
//           rowData={rowData}
//           columnDefs={columnDefs}
//           defaultColDef={{ resizable: true }}

//         /> */}
//         <AgGridReact
//           columnDefs={columnDefs}
//           rowData={rowData}
//           domLayout="autoHeight"
//           gridOptions={gridOptions}
//           defaultColDef={{
//             resizable: true,
//             wrapText: true,
//             autoHeaderHeight: true, // Ensure dynamic header height
//           }}
//         />



//       </div>
//     </div>
//   );
// };

// export default FeedbackTable;



import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { saveAs } from "file-saver";
import { FaFileCsv } from "react-icons/fa";
import * as XLSX from "xlsx";
import API_URL from "../../../config";
import { Button, Row, Col, Label } from "reactstrap";
import Moment from "moment";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";

const FeedbackTable = ({ feedbackData }) => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const {
    reset,
    handleSubmit,
    control,
    watch
  } = useForm({});

  useEffect(() => {
    fetch(API_URL + "/getAddedFeedBackByID")
      .then((res) => res.json())
      .then((postres) => {
        setRowData(postres["data"]);
        transformData(postres["data"]);
      })
      .catch((err) => {
        console.log(err);
      });
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
        fetch(API_URL + "/getAddedFeedBackByID?fromDate=" + fromDateFormat + "&toDate=" + toDateFormat)
          .then((result) => result.json())
          .then((rowData) => {
            setRowData(rowData["data"]);
            transformData(rowData["data"]);
            // console.log(rowData)
          });
      }
      else {
        fetch(API_URL + "/getAddedFeedBackByID?hotelID=1")
          .then((result) => result.json())
          .then((rowData) => {
            setRowData(rowData["data"]);
            transformData(rowData["data"]);
            // console.log(rowData)
          });
      }
    }
  }, [fromDate, toDate]);

  const transformData = (data) => {
    console.log(data)
    let transformedRows = [];
    let departmentMap = new Map();

    data.forEach((feedback) => {
      let row = {
        guestName: feedback.guestName,
        date: feedback.createdAt,
        hotel: feedback.hotelID,
        businessDate: feedback.businessDate,
        feedBack: feedback.feedBack,
        suggesation: feedback.suggesation,
        roomNumber: feedback.roomNumber,
        bookingID: feedback.bookingID,
      };

      feedback.feedBackJSON.forEach((item) => {
        const dept = item.departmentName;
        const criteria = item.name;
        row[`${dept}_${criteria}`] = item.rating;

        if (!departmentMap.has(dept)) {
          departmentMap.set(dept, new Set());
        }
        departmentMap.get(dept).add(criteria);
      });

      transformedRows.push(row);
    });
    console.log(transformedRows)
    setRowData(transformedRows);

    const baseColumns = [
      { headerName: "Guest Name", field: "guestName", width: 200, headerClass: "center-header"},
      { headerName: "Room", field: "roomNumber", width: 200, headerClass: "center-header", cellClass: "center-cell"  },
      // { headerName: "Date", field: "businessDate", width: 180, headerClass: "center-header", cellClass: "center-cell", },
          {
            headerName: "Business Date",
            field: "businessDate",
            suppressSizeToFit: true,
            maxWidth: 120,
            cellClass: "center-cell", 
            cellRenderer: (params) => {
              if (params.data && params.data.businessDate) {
                const formattedDate = format(new Date(params.data.businessDate), 'dd MMM yy');
                return formattedDate;
              } else {
                return "";
              }
            }
          },
      // { headerName: "Date Time", field: "date", width: 180, headerClass: "center-header" },

    ];

    const bgColors = [
      "#f56565", "#ed8936", "#f6ad55", "#ecc94b", "#faf089",
      "#6BDA70", "#66BB6A", "#20A326", "#67C3BA", "#0EA597"
    ];
    // const groupedColumns = Array.from(departmentMap.entries()).map(
    //   ([dept, criteriaSet]) => ({
    //     headerName: dept,
    //     headerClass: "center-header department-header",
    //     children: Array.from(criteriaSet).map((criteria) => ({
    //       headerName: criteria,
    //       field: `${dept}_${criteria}`,
    //       width: 150,
    //       headerClass: "center-header criteria-header",
    //       cellClass: "criteria-cell",
    //     })),
    //   })
    // );

    // const groupedColumns = Array.from(departmentMap.entries()).map(
    //   ([dept, criteriaSet]) => ({
    //     headerName: dept,
    //     headerClass: "center-header department-header",
    //     headerWrapText: true, // Wrap text
    //     autoHeaderHeight: true, // Auto adjust height
    //     children: Array.from(criteriaSet).map((criteria) => ({
    //       headerName: criteria,
    //       field: `${dept}_${criteria}`,
    //       width: 150,
    //       headerClass: "center-header criteria-header",
    //       headerWrapText: true, // Wrap text
    //       autoHeaderHeight: true, // Auto adjust height
    //     })),
    //   })
    // );


    const groupedColumns = Array.from(departmentMap.entries()).map(
      ([dept, criteriaSet]) => ({
        headerName: dept,
        headerClass: `center-header multi-column-header`,
        // children: Array.from(criteriaSet).map((criteria) => ({
        //   headerName: criteria,
        //   field: `${dept}_${criteria}`,
        //   width: 150,
        //   headerClass: "center-header",
        //   wrapText: true, // ✅ Enables text wrapping
        //   autoHeaderHeight: true, // ✅ Adjusts height dynamically
        // })),
        children: Array.from(criteriaSet).map((criteria) => ({
          headerName: criteria,
          field: `${dept}_${criteria}`,
          width: 150,
          headerClass: "center-header",
          cellClass: "center-cell", // Apply a class
        })),

      })
    );





    const finalColumns = [...baseColumns, ...groupedColumns,
    { headerName: "Feedback", field: "feedBack", width: 180, headerClass: "center-header", cellClass: "center-cell", },
    { headerName: "Suggestion", field: "suggesation", width: 180, headerClass: "center-header", cellClass: "center-cell", },
    { headerName: "Booking ID", field: "bookingID", width: 180, headerClass: "center-header", cellClass: "center-cell", },
    { headerName: "Date Time", field: "date", width: 180, headerClass: "center-header" },
    ];

    setDepartments(Array.from(departmentMap.keys()));
    console.log([...baseColumns])
    console.log([...groupedColumns])
    setColumnDefs(finalColumns);
  };


  const exportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      console.error("No data available for export.");
      return;
    }

    let departmentMap = new Map();

    rowData.forEach((row) => {
      Object.keys(row).forEach((header) => {
        if (header.includes("_")) {
          const [dept, criteria] = header.split("_");
          if (!departmentMap.has(dept)) {
            departmentMap.set(dept, []);
          }
          if (!departmentMap.get(dept).includes(criteria)) {
            departmentMap.get(dept).push(criteria);
          }
        }
      });
    });

    let departmentRow = ["Guest Name", "Business Date"];
    let criteriaRow = ["", ""];
    let headers = ["guestName", "businessDate"];
    let merges = [];

    let colIndex = 2;

    departmentMap.forEach((criteria, dept) => {
      departmentRow.push(dept, ...Array(criteria.length - 1).fill(""));
      criteriaRow.push(...criteria);
      headers.push(...criteria.map((c) => `${dept}_${c}`));

      if (criteria.length > 1) {
        merges.push({
          s: { r: 0, c: colIndex },
          e: { r: 0, c: colIndex + criteria.length - 1 },
        });
      }
      colIndex += criteria.length;
    });


    // Add new columns: Feedback, Suggestion, Date
    departmentRow.push("Feedback", "Suggestion", "Booking ID", "Date");
    criteriaRow.push("", "", "");
    headers.push("feedBack", "suggesation", "bookingID","date");


    let excelData = rowData.map((row) =>
      headers.map((h) => ({ v: row[h] ?? "", t: "s", s: { alignment: { horizontal: "center" } } }))
    );

    excelData.unshift(criteriaRow.map((h) => ({ v: h, t: "s", s: { alignment: { horizontal: "center", vertical: "center" } } })));
    excelData.unshift(departmentRow.map((h) => ({ v: h, t: "s", s: { alignment: { horizontal: "center", vertical: "center" }, font: { bold: true } } })));

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    ws["!merges"] = merges;

    ws["!cols"] = headers.map((_, index) => ({
      wch: Math.min(Math.max((criteriaRow[index]?.length || 5) * 10, 15), 50),
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Feedback Data");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "FeedbackData_Grouped.xlsx");
  };



  const gridOptions = {
    autoHeaderHeight: true,
  };



  return (
    <div>
      <style>
        {`
        .multi-column-header {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  font-weight: bold !important;
}


          .center-header {
            text-align: center !important;
            justify-content: center !important;
            display: flex !important;
            align-items: center !important;
          }

          .department-header {
            font-weight: bold !important;
            background-color: #f0f0f0 !important;
          }

          .criteria-header {
            white-space: normal !important;
            text-align: center !important;
            line-height: 1.5 !important;
          }

          .criteria-cell {
            text-align: center !important;
          }
            .center-cell {
  text-align: center !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ag-header-cell-label {
  white-space: normal !important;
  word-wrap: break-word !important;
  text-align: center !important;
  justify-content: center !important;
  display: flex !important;
  align-items: center !important;
}

.ag-header-group-cell-label {
  white-space: normal !important;
  word-wrap: break-word !important;
  text-align: center !important;
  justify-content: center !important;
  display: flex !important;
  align-items: center !important;
}





        `}
      </style>
      {/* 
      <Button onClick={exportToExcel} style={{ marginBottom: 10 }} color='primary'>
        <FaFileCsv /> Export CSV
      </Button> */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <Button onClick={exportToExcel} color="primary">
          <FaFileCsv /> Export CSV
        </Button>
      </div>

      <Row>
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

      </Row>
      <div className="ag-theme-alpine" style={{ width: "100%" }}>
        {/* <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ resizable: true }}
          
        /> */}
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          domLayout="autoHeight"
          gridOptions={gridOptions}
  paginationPageSize="10"
          pagination="true"
          defaultColDef={{
            resizable: true,
            wrapText: true, // ✅ Wraps text inside headers
            autoHeaderHeight: true, // ✅ Adjusts header height dynamically
            autoHeight: true,
            wrapText: true,
          }}
        />




      </div>
    </div>
  );
};

export default FeedbackTable;
