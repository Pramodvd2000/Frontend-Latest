// // ** React Imports
// import { useState } from "react";
// import classnames from "classnames";
// import Flatpickr from "react-flatpickr";
// import "cleave.js/dist/addons/cleave-phone.us";
// import { useForm, Controller } from "react-hook-form";
// import Moment from "moment";
// import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, } from "reactstrap";
// import "@styles/react/libs/flatpickr/flatpickr.scss";
// import "@styles/react/libs/react-select/_react-select.scss";
// import "@styles/react/pages/page-form-validation.scss";
// import { selectThemeColors } from "@utils";
// import Select from "react-select";
// import { AgGridReact } from "ag-grid-react";
// import "/node_modules/ag-grid-community/styles/ag-grid.css";
// import "/node_modules/ag-grid-community/styles/ag-theme-alpine.css";
// import { useRef, useEffect, useMemo, useCallback } from "react";
// import DASHBOARD_URL from "../../../../dashboard";
// import Logo from "../oterra.jpg";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// // import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
// import Backdrop from '@mui/material/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress'
// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';


// const defaultValues = {
//   frmdate: "",
//   todate: "",
// };

// const getArrivalsReport = () => {
//   const [rowData1, setRowData1] = useState();
//   const [companyID, setCompanyID] = useState([]);
//   const [agents, setAgents] = useState([]);
//   const [floorOptions, setFloorOptions] = useState([]);
//   const [flag, setFlag] = useState(false);
//   const [flag1, setflag1] = useState(false);
//   const [data, setData] = useState(null);
//   const { reset, handleSubmit, control, watch } = useForm({ defaultValues });
//   const gridRef = useRef();
//   const [filterFromDate, setFilterFromDate] = useState(null);
//   const [filterToDate, setFilterToDate] = useState(null);
//   const [filterFloor, setFilterFloor] = useState(null);
//   const [filterCompany, setFilterCompany] = useState(null);
//   const [rowData, setRowData] = useState([]);
//   const [hotelAddress, sethotelAddress] = useState(null);
//   const [hotelName, setHotelName] = useState(null);
//   const [hotelNo, setHotelNo] = useState(null);
//   const [hotelFax, sethotelFax] = useState(null)
//   const [image, setImage] = useState(null);
//   const [logoimage, setLogo] = useState(null);
//   const [open, setOpen] = useState(false)
//   const [isButtonClicked, setIsButtonClicked] = useState(false);
//   const [filterAgent, setfilterAgent] = useState(null)



//   const [columnDefs, setColumnDefs] = useState([
//     { headerName: "BookingID", field: "bookingID", suppressSizeToFit: true, maxWidth: 130, },
//     { headerName: "RoomNo", field: "roomNumber", suppressSizeToFit: true, maxWidth: 110, },
//     { headerName: "Guest Name", field: "guestName", suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true, },
//     { headerName: "Company", field: "accountName", suppressSizeToFit: true, maxWidth: 160, wrapText: true, autoHeight: true, },
//     // {headerName: "Agent",  field: "agentName",  suppressSizeToFit: true,  maxWidth: 140,  wrapText: true,  autoHeight: true, },
//     {
//       headerName: "Arrival",
//       field: "arrivalDate",
//       suppressSizeToFit: true,
//       maxWidth: 140,
//       cellRenderer: (params) => {
//         if (params.data && params.data.arrivalDate) {
//           const formattedDate = Moment(params.data.arrivalDate).format(
//             "DD.MM.YYYY"
//           );
//           return formattedDate;
//         } else {
//           return "";
//         }
//       },
//     },
//     { headerName: "ETA", field: "ETA", suppressSizeToFit: true, maxWidth: 120 },

//     {
//       headerName: "Departure ",
//       field: "departureDate",
//       suppressSizeToFit: true,
//       maxWidth: 140,
//       cellRenderer: (params) => {
//         if (params.data && params.data.departureDate) {
//           const formattedDate = Moment(params.data.departureDate).format(
//             "DD.MM.YYYY"
//           );
//           return formattedDate;
//         } else {
//           return "";
//         }
//       },
//     },
//     { headerName: "ETD", field: "ETD", suppressSizeToFit: true, maxWidth: 140 },
//     { headerName: "Room Type", field: "roomType", suppressSizeToFit: true, maxWidth: 130, },
//     { headerName: 'Payment Mode', field: 'paymentTypeCode', suppressSizeToFit: true, maxWidth: 160 },
//     { headerName: "Adults ", field: "numberOfAdults", suppressSizeToFit: true, maxWidth: 100, },
//     { headerName: "Nights", field: "numberOfNights", suppressSizeToFit: true, maxWidth: 120, },
//     { headerName: "Children", field: "numberOfChildren", suppressSizeToFit: true, maxWidth: 110, },
//     { headerName: "Floor", field: "floorID", suppressSizeToFit: true, maxWidth: 90, },
//     { headerName: "Comments", field: "comments", suppressSizeToFit: true, maxWidth: 140, },
//     { headerName: "Billing Instruction", field: "billingInstruction", suppressSizeToFit: true, maxWidth: 140, },
//     { headerName: "Rate", field: "rate", suppressSizeToFit: true, maxWidth: 100, },
//     { headerName: "RTC", field: "roomToChargeRoomType", suppressSizeToFit: true, maxWidth: 100, },

//     { headerName: "Notes", field: "notes", suppressSizeToFit: true, maxWidth: 120, wrapText: true, autoHeight: true, },
//     { headerName: "Guest Preference Notes", field: "guestpreferencenotes", suppressSizeToFit: true, maxWidth: 190, wrapText: true, autoHeight: true, },
//     { headerName: 'isMain', field: 'isMain', suppressSizeToFit: true, maxWidth: 140, hide: true },

//   ]);

//   const defaultColDef = useMemo(() => ({
//     sortable: true,
//     autoHeight: true,
//     wrapText: true,
//     wrapHeaderText: true,
//     cellRenderer: (params) => {
//       const value = params.value || '';
//       const style = {
//         display: '-webkit-box',
//         WebkitLineClamp: 3,
//         WebkitBoxOrient: 'vertical',
//         overflow: 'hidden',
//         textOverflow: 'ellipsis',
//         whiteSpace: 'normal',
//         lineHeight: '1.2em',
//         maxHeight: '3.6em',
//       };
//       return (
//         <div style={style} title={value}>
//           {value}
//         </div>
//       );
//     }

//   }));

//   console.log(rowData1)
//   useEffect(() => {

//     const hotelID = JSON.stringify({
//       hotelID: 1
//     })
//     fetchx(DASHBOARD_URL + "/getBusinessDate", {
//       method: "POST",
//       headers: { 'Content-Type': 'application/json' },
//       body: hotelID
//     }).then((res) => res.json())
//       .then(rowData => {
//         setRowData(rowData['data'])
//         console.log(rowData['data'][0].address)
//         sethotelAddress(rowData['data'][0].address)
//         setHotelName(rowData['data'][0].name)
//         setHotelNo(rowData['data'][0]['phoneNumber'])
//         sethotelFax(rowData['data'][0]['fax'])
//         setLogo(rowData['data'][0]['logo'])

//       })


//     fetchx(DASHBOARD_URL + "/getFloorList?hotelID=1")
//       .then((result) => result.json())
//       .then((resp) => {
//         setFloorOptions(resp["data"]);
//       });

//     fetchx(DASHBOARD_URL + "/getAgents?hotelID=1")
//       .then((result) => result.json())
//       .then((resp) => {
//         const responseData = resp["data"];
//         const agents = responseData.map((item) => ({
//           label: item.accountName,
//           value: item.companyid,
//         }));
//         setAgents(agents);
//       });

//     fetchx(DASHBOARD_URL + "/getGuestProfileCompanyID?hotelID=1")
//       .then((result) => result.json())
//       .then((resp) => {
//         setCompanyID(resp["data"]);
//       });

//     fetchx(DASHBOARD_URL + "/getGuestProfileCompanyID?hotelID=1")
//       .then((result) => result.json())
//       .then((resp) => {
//         setCompanyID(resp["data"]);
//       });
//   }, []);

//   const frmdate = watch("frmdate");
//   const optionsToDate = {
//     minDate: Moment(String(new Date(frmdate))).format("YYYY-MM-DD"), // Set the minimum date as fromDate or today if fromDate is not selected
//   };

//   const onSubmit = (data) => {
//     setIsButtonClicked(true)
//     setOpen(true)
//     console.log(data)

//     setData(data);
//     const FloorID = Array.isArray(data.floorID)
//       ? data.floorID.map((item) => item.value)
//       : [];
//     const AgentsID = Array.isArray(data.agents)
//       ? data.agents.map((item) => item.value)
//       : [];
//     const CompanyID = Array.isArray(data.companyID)
//       ? data.companyID.map((item) => item.value)
//       : [];
//     const CompanyName = Array.isArray(data.companyID)
//       ? data.companyID.map((item) => item.label)
//       : [];
//     const AgentsName = Array.isArray(data.agents)
//       ? data.agents.map((item) => item.label)
//       : [];
//     const filterFromDate = Moment(data.frmdate[0]).format("DD.MM.YYYY");
//     const filterToDate = Moment(data.todate[0]).format("DD.MM.YYYY");
//     const filterFloor = FloorID != null ? JSON.stringify(FloorID) : null;
//     const filterCompany = CompanyName != null ? JSON.stringify(CompanyName) : null;
//     const filterAgent = AgentsName != null ? JSON.stringify(AgentsName) : null;


//     console.log(filterCompany);

//     setFilterFromDate(filterFromDate);
//     setFilterToDate(filterToDate);
//     setFilterFloor(FloorID);
//     setFilterCompany(CompanyName);
//     setfilterAgent(AgentsName)
//     setFlag(true);

//     let createmarketGroup = JSON.stringify({
//       hotelID: 1,
//       startDate: Moment(data.frmdate[0]).format("YYYY-MM-DD"),
//       endDate: Moment(data.todate[0]).format("YYYY-MM-DD"),
//       floor: FloorID != null ? JSON.stringify(FloorID) : null,
//       company: CompanyID != null ? JSON.stringify(CompanyID) : null,
//       agents: AgentsID != null ? JSON.stringify(AgentsID) : null,
//     });

//     if (flag1 == true) {
//       let res = fetchx(DASHBOARD_URL + "/getArrivalsReport", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: createmarketGroup,
//       })
//         .then((data) => data.json())
//         .then((res) => {
//           setIsButtonClicked(false)
//           if (res['statusCode'] == 200) {
//             setIsButtonClicked(false)
//             setOpen(false)
//             console.log(createmarketGroup);
//             console.log(res["data"]);
//             setRowData1(res["data"]);
//           }
//         });
//     }
//   };

//   const handleReset = () => {
//     reset({
//       frmdate: "",
//       todate: "",
//       floorID: "",
//       companyID: "",
//     });
//   };

//   const onBtnExport = () => {
//     const params = {
//       fileName: "Arrivals Report.xlsx",
//       sheetName: "Sheet1",
//     };
//     gridRef.current.api.exportDataAsExcel(params);
//   };

//   const printGrid = () => {
//     if (filterFromDate && filterToDate) {
//       const gridApi = gridRef.current && gridRef.current.api;
//       const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.arrivalDate)));

//       if (gridApi) {
//         const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
//         const headerRow = rowData.substring(0, rowData.indexOf('\n'));
//         const cleanHeaderRow = headerRow.replace(/"/g, '');
//         const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
//         const cleanData = dataRows.replace(/"/g, '');
//         const rows = cleanData.split('\n').map(row => row.split(','));
//         const pdf = new jsPDF({ orientation: 'landscape' });
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const logoWidth = 20;
//         const xLogo = 10;
//         const yLogo = 10;
//         const logoHeight = 20;
//         let dateY = 20;
//         pdf.addImage(DASHBOARD_URL + `/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

//         const margin = { left: 10, right: 10 };
//         const currentDate = new Date();
//         const formattedDate = formatDates(currentDate);
//         const paddingFromRight = 85;
//         const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
//         pdf.setFontSize(8);
//         pdf.setFont('helvetica', 'normal');
//         pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);

//         const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo, fontSize) => {
//           pdf.setFontSize(fontSize);
//           pdf.setFont('helvetica', 'normal');
//           const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
//           const pageCenter = pdf.internal.pageSize.width / 2;
//           const halfTextWidth = textWidth / 2;
//           let textStartX = pageCenter - halfTextWidth;
//           if (textStartX < 0) textStartX = 0;
//           else if (textStartX + textWidth > pdf.internal.pageSize.width) textStartX = pdf.internal.pageSize.width - textWidth;
//           pdf.text(`${textToCenter}`, textStartX, yLogo);
//         };

//         setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo, 14);
//         setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8, 12);

//         pdf.setFontSize(14);
//         pdf.setFont('helvetica', 'bold');
//         const textToCenter = "Arrivals Report";
//         const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
//         const pageCenter = pdf.internal.pageSize.width / 2;
//         const halfTextWidth = textWidth / 2;
//         let textStartX = pageCenter - halfTextWidth;
//         if (textStartX < 0) textStartX = 0;
//         else if (textStartX + textWidth > pdf.internal.pageSize.width) textStartX = pdf.internal.pageSize.width - textWidth;

//         const textY = yLogo + 16;
//         pdf.text(textToCenter, textStartX, textY);
//         pdf.setFontSize(12);
//         pdf.setFont('helvetica', 'bold');
//         dateY = 10;

//         function formatDate(date) {
//           const day = date.getDate().toString().padStart(2, '0');
//           const month = (date.getMonth() + 1).toString().padStart(2, '0');
//           const year = date.getFullYear();
//           return `${day}.${month}.${year}`;
//         }


//         function formatDates(date) {
//           const day = date.getDate().toString().padStart(2, '0');
//           const month = (date.getMonth() + 1).toString().padStart(2, '0');
//           const year = date.getFullYear();

//           const hour = date.getHours().toString().padStart(2, '0');
//           const minute = date.getMinutes().toString().padStart(2, '0');
//           const period = (hour >= 12) ? 'PM' : 'AM';

//           const formattedTime = `${(hour % 12) || 12}:${minute} ${period}`;
//           return `${day}.${month}.${year} ${formattedTime}`;
//         }

//         let grandTotalRooms = 0;
//         let grandTotalAdults = 0;

//         uniqueArrivalDates
//           .sort((a, b) => new Date(a) - new Date(b))
//           .forEach((arrivalDate, index) => {
//             const rowsForDate = rowData1
//               .filter((row) => row.arrivalDate === arrivalDate)
//               .map((row) => {
//                 const formattedArrival = formatDate(new Date(row.arrivalDate));
//                 const formattedDeparture = formatDate(new Date(row.departureDate));
//                 const formattedPickUpDate = formatDate(new Date(row.pickUpDate));
//                 const isMain = row.isMain;

//                 return {
//                   ...row,
//                   arrivalDate: formattedArrival,
//                   departureDate: formattedDeparture,
//                   pickUpDate: formattedPickUpDate,
//                   isMain: isMain
//                 };
//               })
//               .map((row) => columnDefs.map((column) => row[column.field]));

//             const columns = columnDefs.map((column) => column.headerName);
//             const tableHeight = 8;
//             let currentPage = 1;
//             if (dateY + tableHeight > pdf.internal.pageSize.height - 20) {
//               pdf.addPage();
//               dateY = 10;
//               currentPage++;
//             }

//             let totalRooms = rowsForDate.length;
//             const filteredRoomRows = rowsForDate.filter(row => row.isMain !== 0);
//             totalRooms = filteredRoomRows.length;
//             const totalCount = rowsForDate.length;

//             let totalAdults = 0;
//             for (let i = 0; i < rowsForDate.length; i++) {
//               totalAdults += rowsForDate[i][10] ? parseInt(rowsForDate[i][10]) : 0;
//             }

//             // Add the totals for the current date to the grand totals
//             grandTotalRooms += totalRooms;
//             grandTotalAdults += totalAdults;

//             pdf.text(`Date: ${formatDate(new Date(arrivalDate))}`, 10, dateY + 30, { width: 500, align: 'left' });
//             const columnStyles = {
//               0: { columnWidth: 12 },
//               1: { columnWidth: 12 },
//               2: { columnWidth: 25 },
//               // Add other column styles as needed
//             };
//             // const filteredColumns = columns.filter(columnName => columnName !== 'isMain');
//             const excludedFields = ["isMain", "comments", "billingInstruction", "rate", "roomToChargeRoomType"];
// const filteredColumns = columnDefs
//   .filter(col => !excludedFields.includes(col.field))
//   .map(col => col.headerName);

//             pdf.autoTable({
//               head: [filteredColumns],
//               body: rowsForDate,
//               startY: dateY + 35,
//               columnStyles,
//             });

//             pdf.text(`Total Rooms: ${totalRooms}`, 15, pdf.autoTable.previous.finalY + 5, { width: 500, align: 'left' });
//             pdf.text(`Total Pax: ${totalAdults}`, 192, pdf.autoTable.previous.finalY + 5, { width: 500, align: "right" });
//             dateY = pdf.autoTable.previous.finalY;
//           });

//         // Ensure enough space for the grand totals
//         dateY = pdf.autoTable.previous.finalY + 20;
//         const availableSpace = pdf.internal.pageSize.height - dateY;
//         if (availableSpace < 30) {
//           pdf.addPage();
//           dateY = 10;
//         }

//         // Add the grand totals to the last page
//         pdf.setFontSize(12);
//         pdf.setFont('helvetica', 'bold');
//         pdf.text(`Grand Total Rooms: ${grandTotalRooms}`, 15, dateY + 10);
//         pdf.text(`Grand Total Pax: ${grandTotalAdults}`, 15, dateY + 20);


//         pdf.setFontSize(10);
//         pdf.setFont('helvetica', 'normal');
//         pdf.text(`Filter From Arrival Date: ${filterFromDate}`, 10, dateY + 30, { width: 500, align: 'left' });
//         pdf.text(`To Arrival Date:  ${filterToDate}  `, 10, dateY + 40, { width: 500, align: 'left' });
//         pdf.text(`Floor: ${filterFloor}   `, 10, dateY + 50, { width: 500, align: "left", });
//         pdf.text(`Company: ${filterCompany} `, 10, dateY + 60, { width: 500, align: "left", });

//         for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
//           pdf.setPage(i);
//           pdf.setFontSize(10);
//           const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
//           const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
//           const xPos = pageCenter - (pageNumberWidth / 2);
//           const yPos = pdf.internal.pageSize.height - 10;
//           pdf.text(pageNumber, xPos, yPos);
//         }





//         pdf.save('Arrivals Report Report.pdf');
//       }
//     }
//   };


//   const generateExcel = () => {
//     if (filterFromDate && filterToDate) {
//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Arrivals Report'); // Updated report name

//       const columns = [
//         { header: 'BookingID', key: 'bookingID', width: 15 },
//         { header: 'Room No', key: 'roomNumber', width: 15 },
//         { header: 'Guest Name', key: 'guestName', width: 25 },
//         { header: 'Company', key: 'accountName', width: 20 },
//         { header: 'Arrival', key: 'arrivalDate', width: 20 },
//         { header: 'ETA', key: 'ETA', width: 15 },
//         { header: 'Departure', key: 'departureDate', width: 20 },
//         { header: 'ETD', key: 'ETD', width: 15 },
//         { header: 'Room Type', key: 'roomType', width: 15 },
//         { header: 'Payment Mode', key: 'paymentTypeCode', width: 20 },
//         { header: 'Adults', key: 'numberOfAdults', width: 10 },
//         { header: 'Nights', key: 'numberOfNights', width: 10 },
//         { header: 'Children', key: 'numberOfChildren', width: 10 },
//         { header: 'Floor', key: 'floorID', width: 15 },
//         { header: "Comments", key: "comments", suppressSizeToFit: true, maxWidth: 140, },
//         { header: "Billing Instruction", key: "billingInstruction", suppressSizeToFit: true, maxWidth: 140, },
//         { header: "Rate", key: "rate", suppressSizeToFit: true, maxWidth: 100, },
//         { header: "RTC", key: "roomToChargeRoomType", suppressSizeToFit: true, maxWidth: 100, },
//         { header: 'Notes', key: 'notes', width: 25 },
//         { header: 'Guest Preference Notes', key: 'guestpreferencenotes', width: 30 }
//       ];

//       worksheet.columns = columns;

//       worksheet.addRow(['Report Name:', 'Arrivals Report']); // Updated report name
//       worksheet.addRow(['Filter From Date:', filterFromDate]);
//       worksheet.addRow(['To Date:', filterToDate]);
//       let selectedFilterFloor = Array.isArray(filterFloor) && filterFloor.length > 0
//         ? filterFloor.join(',')
//         : 'All';

//       worksheet.addRow(['Filter Floor:', selectedFilterFloor]);
//       console.log(filterCompany)

//       let selectedFilterCompany = Array.isArray(filterCompany) && filterCompany.length > 0
//         ? filterCompany.join(',')
//         : 'All';
//       worksheet.addRow(['Filter Company:', selectedFilterCompany]);
//       let selectedFilterAgents = Array.isArray(filterAgent) && filterAgent.length > 0
//         ? filterAgent.join(',')
//         : 'All';
//       worksheet.addRow(['Filter Agents:', selectedFilterAgents]);
//       worksheet.addRow();
//       worksheet.addRow(columns.map(column => column.header)).font = { bold: true };

//       for (let i = 1; i <= 7; i++) {
//         worksheet.getRow(i).font = { bold: true };
//       }

//       worksheet.spliceRows(1, 1);

//       const formattedData = (rowData1) => {
//         return rowData1.map(item => ({
//           ...item,
//           arrivalDate: item.arrivalDate?.replace(/\r?\n|\r/g, ''),
//           departureDate: item.departureDate?.replace(/\r?\n|\r/g, '')
//         }));
//       };

//       const sanitizedData = formattedData(rowData1);

//       sanitizedData.forEach((row) => {
//         worksheet.addRow({
//           bookingID: row.bookingID,
//           roomNumber: row.roomNumber,
//           guestName: row.guestName,
//           accountName: row.accountName,
//           arrivalDate: row.arrivalDate,
//           ETA: row.ETA,
//           departureDate: row.departureDate,
//           ETD: row.ETD,
//           roomType: row.roomType,
//           paymentTypeCode: row.paymentTypeCode,
//           numberOfAdults: row.numberOfAdults,
//           numberOfNights: row.numberOfNights,
//           numberOfChildren: row.numberOfChildren,
//           floorID: row.floorID,
//           comments: row.comments,
//           billingInstruction: row.billingInstruction,
//           rate: row.rate,
//           roomToChargeRoomType: row.roomToChargeRoomType,
//           notes: row.notes,
//           guestpreferencenotes: row.guestpreferencenotes
//         });
//       });
 
//       worksheet.columns.forEach((column, index) => {
//         if ([10, 11, 12].includes(index + 1)) {
//           column.alignment = { vertical: 'middle', horizontal: 'right' };
//         } else {
//           column.alignment = { vertical: 'middle', horizontal: 'left' };
//         }
//       });

//       const currentDate = new Date();
//       const formattedDate = currentDate.toISOString().slice(0, 10);

//       workbook.xlsx.writeBuffer().then((buffer) => {
//         const blob = new Blob([buffer], { type: 'application/octet-stream' });
//         saveAs(blob, `Arrivals Report_${formattedDate}.xlsx`); // Updated report name
//       }).catch((error) => {
//         console.error('Error generating Excel file:', error);
//       });
//     }
//   };


//   return (
//     <div>
//       <Card>
//         <CardHeader>
//           <CardTitle tag="h4">Arrivals Report</CardTitle>
//         </CardHeader>
//         <CardBody>
//           <Form onSubmit={handleSubmit(onSubmit)}>
//             <Row>
//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="frmdate">
//                     From Date
//                   </Label>
//                   <Controller
//                     control={control}
//                     id="frmdate"
//                     name="frmdate"
//                     render={({ field }) => (
//                       <Flatpickr
//                         {...field}
//                         required
//                         options={{ allowInput: true }}
//                         placeholder="YYYY-MM-DD "
//                         className={classnames("form-control", {})}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>

//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="todate">
//                     To Date
//                   </Label>
//                   <Controller
//                     control={control}
//                     id="todate"
//                     name="todate"
//                     render={({ field }) => (
//                       <Flatpickr
//                         {...field}
//                         // options={optionsToDate}
//                         required
//                         options={{ allowInput: true }}
//                         placeholder="YYYY-MM-DD "
//                         className={classnames("form-control", {})}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>

//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="floorID">
//                     Floor
//                   </Label>
//                   <Controller
//                     id="floorID"
//                     control={control}
//                     name="floorID"
//                     render={({ field }) => (
//                       <Select
//                         isMulti
//                         isClearable
//                         options={floorOptions}
//                         classNamePrefix="select"
//                         theme={selectThemeColors}
//                         {...field}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>

//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="companyID">
//                     Company
//                   </Label>
//                   <Controller
//                     id="companyID"
//                     control={control}
//                     name="companyID"
//                     render={({ field }) => (
//                       <Select
//                         isMulti
//                         isClearable
//                         options={companyID}
//                         classNamePrefix="select"
//                         theme={selectThemeColors}
//                         {...field}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>

//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="agents">
//                     Agents
//                   </Label>
//                   <Controller
//                     id="agents"
//                     control={control}
//                     name="agents"
//                     render={({ field }) => (
//                       <Select
//                         isMulti
//                         isClearable
//                         options={agents}
//                         classNamePrefix="select"
//                         theme={selectThemeColors}
//                         {...field}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>

//               <div align="end" className="buttons">
//                 <Button
//                   className="me-1"
//                   color="primary"
//                   type="submit"
//                   disabled={isButtonClicked}
//                   onClick={() => setflag1(true)}
//                 >
//                   {isButtonClicked ? 'Processing...' : 'SUBMIT'}
//                 </Button>
//                 {/* <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
//                 Reset
//               </Button> */}
//                 {flag == true && (
//                   <Button
//                     className='me-1'
//                     color='primary'
//                     onClick={generateExcel}
//                   >
//                     Download Excel
//                   </Button>
//                 )}
//                 {flag == true && (
//                   <Button
//                     className="me-1"
//                     color="primary"
//                     type="submit"
//                     onClick={printGrid}
//                   >
//                     Print to PDF
//                   </Button>
//                 )}
//               </div>
//             </Row>
//           </Form>
//         </CardBody>
//       </Card>
//       <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//           <h1 style={{ fontWeight: 'bold', color: 'white' }}>
//             Please wait... We're processing your request,
//           </h1>
//           <h1 style={{ fontWeight: 'bold', color: 'white' }}>
//             which may take a little longer due to additional data. Please be patient!
//           </h1>
//           <CircularProgress color="inherit" />
//         </div>
//       </Backdrop>
//       {flag == true && (
//         <div className="ag-theme-alpine">
//           <AgGridReact
//             ref={gridRef}
//             rowData={rowData1}
//             columnDefs={columnDefs}
//             animateRows={true}
//             paginationPageSize="10"
//             pagination="true"
//             rowSelection="multiple"
//             defaultColDef={defaultColDef}
//             headerColor="ddw-primary"
//             domLayout="autoHeight"
//           />
//         </div>
//       )}
//     </div>
//   );
// };
// export default getArrivalsReport;

// ** React Imports
import { useState } from "react";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Moment from "moment";
import {Card,Form,Row,Col,Label,Button,CardBody,CardTitle,CardHeader,} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { AgGridReact } from "ag-grid-react";
import "/node_modules/ag-grid-community/styles/ag-grid.css";
import "/node_modules/ag-grid-community/styles/ag-theme-alpine.css";
import { useRef, useEffect, useMemo, useCallback } from "react";
import DASHBOARD_URL from "../../../../dashboard";
import Logo from "../oterra.jpg";
import jsPDF from "jspdf";
import "jspdf-autotable";
// import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


const defaultValues = {
  frmdate: "",
  todate: "",
};

const getArrivalsReport = () => {
  const [rowData1, setRowData1] = useState();
  const [companyID, setCompanyID] = useState([]);
  const [agents, setAgents] = useState([]);
  const [floorOptions, setFloorOptions] = useState([]);
  const [flag, setFlag] = useState(false);
  const [flag1, setflag1] = useState(false);
  const [data, setData] = useState(null);
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues });
  const gridRef = useRef();
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [filterFloor, setFilterFloor] = useState(null);
  const [filterCompany, setFilterCompany] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null);  
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [filterAgent,setfilterAgent] = useState(null)


  
  const [columnDefs, setColumnDefs] = useState([
    {headerName: "BookingID",  field: "bookingID",  suppressSizeToFit: true,  maxWidth: 130,},
    {headerName: "RoomNo",  field: "roomNumber",  suppressSizeToFit: true,  maxWidth: 110,},
    {headerName: "Guest Name",  field: "guestName",  suppressSizeToFit: true,  maxWidth: 140,  wrapText: true,  autoHeight: true, },
    {headerName: "Company",  field: "accountName",  suppressSizeToFit: true,  maxWidth: 160,  wrapText: true,  autoHeight: true, },
    // {headerName: "Agent",  field: "agentName",  suppressSizeToFit: true,  maxWidth: 140,  wrapText: true,  autoHeight: true, },
    {
      headerName: "Arrival",
      field: "arrivalDate",
      suppressSizeToFit: true,
      maxWidth: 140,
      cellRenderer: (params) => {
        if (params.data && params.data.arrivalDate) {
          const formattedDate = Moment(params.data.arrivalDate).format(
            "DD.MM.YYYY"
          );
          return formattedDate;
        } else {
          return "";
        }
      },
    },
    { headerName: "ETA", field: "ETA", suppressSizeToFit: true, maxWidth: 120 },

    {
      headerName: "Departure ",
      field: "departureDate",
      suppressSizeToFit: true,
      maxWidth: 140,
      cellRenderer: (params) => {
        if (params.data && params.data.departureDate) {
          const formattedDate = Moment(params.data.departureDate).format(
            "DD.MM.YYYY"
          );
          return formattedDate;
        } else {
          return "";
        }
      },
    },
    {headerName: "ETD", field: "ETD", suppressSizeToFit: true, maxWidth: 140 },
    {headerName: "Room Type",  field: "roomType",  suppressSizeToFit: true,  maxWidth: 130,},
    {headerName: 'Payment Mode',field: 'paymentTypeCode',suppressSizeToFit: true, maxWidth: 160 },
    {headerName: "Adults ",  field: "numberOfAdults",  suppressSizeToFit: true,  maxWidth: 100,},
    {headerName: "Nights",  field: "numberOfNights",  suppressSizeToFit: true,  maxWidth: 120,},
    {headerName: "Children ",  field: "numberOfChildren",  suppressSizeToFit: true,  maxWidth: 110, cellRenderer: params => {
    // console.log("Cell renderer params:", params.data.numberOfChildren);
    return params.data.numberOfChildren ?? '0';
  }},
//   {
//   headerName: "Children",
//   field: "numberOfChildren", // Must match exactly
//   suppressSizeToFit: true,
//   maxWidth: 110,
//   // Explicit value formatter
//   valueFormatter: params => {
//     // Handles null, undefined, 0, and falsy values
//     return params.value != null ? params.value.toString() : '0';
//   },
//   // For proper sorting/filtering
//   filterValueGetter: params => params.data.numberOfChildren || 0
// },
    {headerName: "Floor",  field: "floorID",  suppressSizeToFit: true,  maxWidth: 140,},
 { headerName: "Comments", field: "comments", suppressSizeToFit: true, maxWidth: 140, },
    { headerName: "Billing Instruction", field: "billingInstruction", suppressSizeToFit: true, maxWidth: 140, },
    { headerName: "Rate", field: "rate", suppressSizeToFit: true, maxWidth: 100, },
    { headerName: "RTC", field: "roomToChargeRoomType", suppressSizeToFit: true, maxWidth: 100, },
    
{headerName: "Notes",  field: "notes",  suppressSizeToFit: true,  maxWidth: 120,  wrapText: true,  autoHeight: true,},
    {headerName: "Guest Preference Notes",  field: "guestpreferencenotes",  suppressSizeToFit: true,  maxWidth: 190,  wrapText: true,  autoHeight: true,},
    {headerName: 'isMain'      ,field: 'isMain',suppressSizeToFit: true, maxWidth: 140 ,hide:true},  

  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    autoHeight: true,
    wrapText: true,
    wrapHeaderText: true,
    cellRenderer: (params) => {
      const value = params.value || '';
      const style = {
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        lineHeight: '1.2em',
        maxHeight: '3.6em',
      };
      return (
        <div style={style} title={value}>
          {value}
        </div>
      );
    }

  }));

  useEffect(() => {

    const hotelID = JSON.stringify({
      hotelID: 1
    })
    fetchx(DASHBOARD_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelID
    }).then((res) => res.json())
    .then(rowData => {
      setRowData(rowData['data'])
      console.log(rowData['data'][0].address)
      sethotelAddress(rowData['data'][0].address)
      setHotelName(rowData['data'][0].name)
      setHotelNo(rowData['data'][0]['phoneNumber'])
      sethotelFax(rowData['data'][0]['fax'])
      setLogo(rowData['data'][0]['logo'])

    })


    fetchx(DASHBOARD_URL + "/getFloorList?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        setFloorOptions(resp["data"]);
      });

    fetchx(DASHBOARD_URL + "/getAgents?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        const responseData = resp["data"];
        const agents = responseData.map((item) => ({
          label: item.accountName,
          value: item.companyid,
        }));
        setAgents(agents);
      });

    fetchx(DASHBOARD_URL + "/getGuestProfileCompanyID?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        setCompanyID(resp["data"]);
      });

    fetchx(DASHBOARD_URL + "/getGuestProfileCompanyID?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        setCompanyID(resp["data"]);
      });
  }, []);

  const frmdate = watch("frmdate");
  const optionsToDate = {
    minDate: Moment(String(new Date(frmdate))).format("YYYY-MM-DD"), // Set the minimum date as fromDate or today if fromDate is not selected
  };

    const onSubmit = (data) => {
      setIsButtonClicked(true)
      setOpen(true)
      console.log(data)

    setData(data);
    const FloorID = Array.isArray(data.floorID)
      ? data.floorID.map((item) => item.value)
      : [];
    const AgentsID = Array.isArray(data.agents)
      ? data.agents.map((item) => item.value)
      : [];
    const CompanyID = Array.isArray(data.companyID)
      ? data.companyID.map((item) => item.value)
      : [];
      const CompanyName = Array.isArray(data.companyID)
      ? data.companyID.map((item) => item.label)
      : [];
      const AgentsName = Array.isArray(data.agents)
      ? data.agents.map((item) => item.label)
      : [];
    const filterFromDate = Moment(data.frmdate[0]).format("DD.MM.YYYY");
    const filterToDate = Moment(data.todate[0]).format("DD.MM.YYYY");
    const filterFloor = FloorID != null ? JSON.stringify(FloorID) : null;
    const filterCompany = CompanyName != null ? JSON.stringify(CompanyName) : null;
    const filterAgent = AgentsName != null ? JSON.stringify(AgentsName) : null;

    
    console.log(filterCompany);

    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    setFilterFloor(FloorID);
    setFilterCompany(CompanyName);
    setfilterAgent(AgentsName)
    setFlag(true);

    let createmarketGroup = JSON.stringify({
      hotelID: 1,
      startDate:  Moment(data.frmdate[0]).format("YYYY-MM-DD"),
    endDate: Moment(data.todate[0]).format("YYYY-MM-DD"),
      floor: FloorID != null ? JSON.stringify(FloorID) : null,
      company: CompanyID != null ? JSON.stringify(CompanyID) : null,
      agents: AgentsID != null ? JSON.stringify(AgentsID) : null,
    });

    if (flag1 == true) {
      let res = fetchx(DASHBOARD_URL + "/getArrivalsReport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: createmarketGroup,
      })
        .then((data) => data.json())
        .then((res) => {
          setIsButtonClicked(false)
          if(res['statusCode'] == 200) {
            setIsButtonClicked(false)
            setOpen(false)
      console.log(createmarketGroup);
          console.log(res["data"]);
          setRowData1(res["data"]);
          }
        });
    }
  };

  const handleReset = () => {
    reset({
      frmdate: "",
      todate: "",
      floorID: "",
      companyID: "",
    });
  };

  const onBtnExport = () => {
    const params = {
      fileName: "Arrivals Report.xlsx",
      sheetName: "Sheet1",
    };
    gridRef.current.api.exportDataAsExcel(params);
  };

  const printGrid = () => {
    if (filterFromDate && filterToDate) {
      const gridApi = gridRef.current && gridRef.current.api;
      const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.arrivalDate)));
      
      if (gridApi) {
        const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
        const headerRow = rowData.substring(0, rowData.indexOf('\n'));
        const cleanHeaderRow = headerRow.replace(/"/g, '');
        const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
        const cleanData = dataRows.replace(/"/g, '');
        const rows = cleanData.split('\n').map(row => row.split(','));
        const pdf = new jsPDF({ orientation: 'landscape' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const logoWidth = 20;
        const xLogo = 10;
        const yLogo = 10;
        const logoHeight = 20;
        let dateY = 20;
        pdf.addImage(DASHBOARD_URL+`/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);
  
        const margin = { left: 10, right: 10 };
        const currentDate = new Date();
        const formattedDate = formatDates(currentDate);
        const paddingFromRight = 85;
        const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);
  
        const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo,fontSize) => {
          pdf.setFontSize(fontSize);
          pdf.setFont('helvetica', 'normal');
          const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
          const pageCenter = pdf.internal.pageSize.width / 2;
          const halfTextWidth = textWidth / 2;
          let textStartX = pageCenter - halfTextWidth;
          if (textStartX < 0) textStartX = 0;
          else if (textStartX + textWidth > pdf.internal.pageSize.width) textStartX = pdf.internal.pageSize.width - textWidth;
          pdf.text(`${textToCenter}`, textStartX, yLogo);
        };
  
        setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo,14);
        setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8,12);
  
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        const textToCenter = "Arrivals Report";
        const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const pageCenter = pdf.internal.pageSize.width / 2;
        const halfTextWidth = textWidth / 2;
        let textStartX = pageCenter - halfTextWidth;
        if (textStartX < 0) textStartX = 0;
        else if (textStartX + textWidth > pdf.internal.pageSize.width) textStartX = pdf.internal.pageSize.width - textWidth;
  
        const textY = yLogo + 16;
        pdf.text(textToCenter, textStartX, textY);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        dateY = 10;

      function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
      }


      function formatDates(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
      
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const period = (hour >= 12) ? 'PM' : 'AM';
      
        const formattedTime = `${(hour % 12) || 12}:${minute} ${period}`;
        return `${day}.${month}.${year} ${formattedTime}`;
      }
  
        let grandTotalRooms = 0;
        let grandTotalAdults = 0;
  
        uniqueArrivalDates
          .sort((a, b) => new Date(a) - new Date(b))
          .forEach((arrivalDate, index) => {
            const rowsForDate = rowData1
              .filter((row) => row.arrivalDate === arrivalDate)
              .map((row) => {
                const formattedArrival = formatDate(new Date(row.arrivalDate));
                const formattedDeparture = formatDate(new Date(row.departureDate));
                const formattedPickUpDate = formatDate(new Date(row.pickUpDate));
                const isMain = row.isMain;    
  
                return {
                  ...row,
                  arrivalDate: formattedArrival,
                  departureDate: formattedDeparture,
                  pickUpDate: formattedPickUpDate,
                  isMain: isMain
                };
              })
              .map((row) => columnDefs.map((column) => row[column.field]));
  
            const columns = columnDefs.map((column) => column.headerName);
            const tableHeight = 8;
            let currentPage = 1;
            if (dateY + tableHeight > pdf.internal.pageSize.height - 20) {
              pdf.addPage();
              dateY = 10; 
              currentPage++;
            }
  
            let totalRooms = rowsForDate.length;
            const filteredRoomRows = rowsForDate.filter(row => row.isMain !== 0);
            totalRooms = filteredRoomRows.length;
            const totalCount = rowsForDate.length;
  
            let totalAdults = 0;
            for (let i = 0; i < rowsForDate.length; i++) {
              totalAdults += rowsForDate[i][10] ? parseInt(rowsForDate[i][10]) : 0;
            }
  
            // Add the totals for the current date to the grand totals
            grandTotalRooms += totalRooms;
            grandTotalAdults += totalAdults;
  
            pdf.text(`Date: ${formatDate(new Date(arrivalDate))}`, 10, dateY + 30, { width: 500, align: 'left' });
            const columnStyles = {
              0: { columnWidth: 12 },
              1: { columnWidth: 12 },
              2: { columnWidth: 25 },
              // Add other column styles as needed
            };
            // const filteredColumns = columns.filter(columnName => columnName !== 'isMain');
            const excludedFields = ["isMain", "comments", "billingInstruction", "rate", "roomToChargeRoomType"];
const filteredColumns = columnDefs
  .filter(col => !excludedFields.includes(col.field))
  .map(col => col.headerName);

            pdf.autoTable({
              head: [filteredColumns],
              body: rowsForDate,
              startY: dateY + 35, 
              columnStyles,
            });
  
            pdf.text(`Total Rooms: ${totalRooms}`, 15, pdf.autoTable.previous.finalY + 5, { width: 500, align: 'left' });
            pdf.text(`Total Pax: ${totalAdults}`, 192, pdf.autoTable.previous.finalY + 5, { width: 500, align: "right" });
            dateY = pdf.autoTable.previous.finalY;
          });
  
        // Ensure enough space for the grand totals
        dateY = pdf.autoTable.previous.finalY + 20;
        const availableSpace = pdf.internal.pageSize.height - dateY;
        if (availableSpace < 30) { 
          pdf.addPage(); 
          dateY = 10; 
        }
  
        // Add the grand totals to the last page
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Grand Total Rooms: ${grandTotalRooms}`, 15, dateY + 10);
        pdf.text(`Grand Total Pax: ${grandTotalAdults}`, 15, dateY + 20);


        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
           pdf.text(`Filter From Arrival Date: ${filterFromDate}`, 10, dateY + 30, { width: 500, align: 'left' });
           pdf.text(`To Arrival Date:  ${filterToDate}  `, 10, dateY + 40, { width: 500, align: 'left' });
           pdf.text(`Floor: ${filterFloor}   `, 10, dateY + 50, {  width: 500,align: "left", });
           pdf.text(`Company: ${filterCompany} `, 10, dateY + 60, {  width: 500,align: "left", });
  
        for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
          pdf.setPage(i);
          pdf.setFontSize(10); 
          const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
          const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
          const xPos = pageCenter - (pageNumberWidth / 2);
          const yPos = pdf.internal.pageSize.height - 10;
          pdf.text(pageNumber, xPos, yPos);
        }

    
      
    
  
        pdf.save('Arrivals Report Report.pdf');
      }
    }
  };
  

  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Arrivals Report'); // Updated report name
  
      const columns = [
        { header: 'BookingID', key: 'bookingID', width: 15 },
        { header: 'Room No', key: 'roomNumber', width: 15 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Company', key: 'accountName', width: 20 },
        { header: 'Arrival', key: 'arrivalDate', width: 20 },
        { header: 'ETA', key: 'ETA', width: 15 },
        { header: 'Departure', key: 'departureDate', width: 20 },
        { header: 'ETD', key: 'ETD', width: 15 },
        { header: 'Room Type', key: 'roomType', width: 15 },
        { header: 'Payment Mode', key: 'paymentTypeCode', width: 20 },
        { header: 'Adults', key: 'numberOfAdults', width: 10 },
        { header: 'Nights', key: 'numberOfNights', width: 10 },
        { header: 'Children', key: 'numberOfChildren', width: 10 },
        { header: 'Floor', key: 'floorID', width: 15 },
        { header: "Comments", key: "comments", suppressSizeToFit: true, maxWidth: 140, },
        { header: "Billing Instruction", key: "billingInstruction", suppressSizeToFit: true, maxWidth: 140, },
        { header: "Rate", key: "rate", suppressSizeToFit: true, maxWidth: 100, },
        { header: "RTC", key: "roomToChargeRoomType", suppressSizeToFit: true, maxWidth: 100, },
        { header: 'Notes', key: 'notes', width: 25 },
        { header: 'Guest Preference Notes', key: 'guestpreferencenotes', width: 30 }
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'Arrivals Report']); // Updated report name
      worksheet.addRow(['Filter From Date:', filterFromDate]);
      worksheet.addRow(['To Date:', filterToDate]);
      let selectedFilterFloor = Array.isArray(filterFloor) && filterFloor.length > 0
      ? filterFloor.join(',')
      : 'All';
    
      worksheet.addRow(['Filter Floor:', selectedFilterFloor]);
      console.log(filterCompany)

      let selectedFilterCompany = Array.isArray(filterCompany) && filterCompany.length > 0
      ? filterCompany.join(',')
      : 'All';
      worksheet.addRow(['Filter Company:', selectedFilterCompany]);
      let selectedFilterAgents = Array.isArray(filterAgent) && filterAgent.length > 0
      ? filterAgent.join(',')
      : 'All';
      worksheet.addRow(['Filter Agents:', selectedFilterAgents]);
      worksheet.addRow();
      worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
      for (let i = 1; i <= 7; i++) {
        worksheet.getRow(i).font = { bold: true };
      }
  
      worksheet.spliceRows(1, 1);
  
      const formattedData = (rowData1) => {
        return rowData1.map(item => ({
          ...item,
          arrivalDate: item.arrivalDate?.replace(/\r?\n|\r/g, ''),
          departureDate: item.departureDate?.replace(/\r?\n|\r/g, '')
        }));
      };
  
      const sanitizedData = formattedData(rowData1);
  
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          bookingID: row.bookingID,
          roomNumber: row.roomNumber,
          guestName: row.guestName,
          accountName: row.accountName,
          arrivalDate: row.arrivalDate,
          ETA: row.ETA,
          departureDate: row.departureDate,
          ETD: row.ETD,
          roomType: row.roomType,
          paymentTypeCode: row.paymentTypeCode,
          numberOfAdults: row.numberOfAdults,
          numberOfNights: row.numberOfNights,
          numberOfChildren: row.numberOfChildren,
          floorID: row.floorID,
          comments: row.comments,
          billingInstruction: row.billingInstruction,
          rate: row.rate,
          roomToChargeRoomType: row.roomToChargeRoomType,
          notes: row.notes,
          guestpreferencenotes: row.guestpreferencenotes
        });
      });
  
      worksheet.columns.forEach((column, index) => {
        if ([10, 11, 12].includes(index + 1)) {
          column.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          column.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Arrivals Report_${formattedDate}.xlsx`); // Updated report name
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };
  

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Arrivals Report</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="frmdate">
                    From Date
                  </Label>
                  <Controller
                    control={control}
                    id="frmdate"
                    name="frmdate"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        required
                        options={{ allowInput: true }}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {})}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="todate">
                    To Date
                  </Label>
                  <Controller
                    control={control}
                    id="todate"
                    name="todate"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        // options={optionsToDate}
                        required
                        options={{ allowInput: true }}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {})}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="floorID">
                    Floor
                  </Label>
                  <Controller
                    id="floorID"
                    control={control}
                    name="floorID"
                    render={({ field }) => (
                      <Select
                        isMulti
                        isClearable
                        options={floorOptions}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="companyID">
                    Company
                  </Label>
                  <Controller
                    id="companyID"
                    control={control}
                    name="companyID"
                    render={({ field }) => (
                      <Select
                        isMulti
                        isClearable
                        options={companyID}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="agents">
                    Agents
                  </Label>
                  <Controller
                    id="agents"
                    control={control}
                    name="agents"
                    render={({ field }) => (
                      <Select
                        isMulti
                        isClearable
                        options={agents}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

              <div align="end" className="buttons">
                <Button
                  className="me-1"
                  color="primary"
                  type="submit"
                  disabled={isButtonClicked}
                  onClick={() => setflag1(true)}
                >
               {isButtonClicked ? 'Processing...' : 'SUBMIT'}
                </Button>
                {/* <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                Reset
              </Button> */}
                {flag == true && (
                  <Button
                  className='me-1'
                  color='primary'
                  onClick={generateExcel}
                >
                  Download Excel
                  </Button>
                )}
                {flag == true && (
                  <Button
                    className="me-1"
                    color="primary"
                    type="submit"
                    onClick={printGrid}
                  >
                    Print to PDF
                  </Button>
                )}
              </div>
            </Row>
          </Form>
        </CardBody>
      </Card>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
    Please wait... We're processing your request,      
    </h1>
      <h1 style={{ fontWeight: 'bold', color: 'white' }}>
        which may take a little longer due to additional data. Please be patient!
      </h1>
    <CircularProgress color="inherit" />
  </div>
</Backdrop>
      {flag == true && (
        <div className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={rowData1}
            columnDefs={columnDefs}
            animateRows={true}
            paginationPageSize="10"
            pagination="true"
            rowSelection="multiple"
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            domLayout="autoHeight"
          />
        </div>
      )}
    </div>
  );
};
export default getArrivalsReport;