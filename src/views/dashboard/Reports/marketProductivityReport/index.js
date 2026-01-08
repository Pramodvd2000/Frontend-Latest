// import { useState } from "react";
// import "cleave.js/dist/addons/cleave-phone.us";
// import Flatpickr from "react-flatpickr";
// import classnames from "classnames";
// import Moment from "moment";
// import "@styles/react/libs/flatpickr/flatpickr.scss";
// import "@styles/react/libs/react-select/_react-select.scss";
// import "@styles/react/pages/page-form-validation.scss";
// import { useForm, Controller } from "react-hook-form";
// import "ag-grid-enterprise";
// import { AgGridReact } from "ag-grid-react";
// import "/node_modules/ag-grid-community/styles/ag-grid.css";
// import "/node_modules/ag-grid-community/styles/ag-theme-alpine.css";
// import Select from "react-select";
// import { selectThemeColors } from "@utils";
// import { useRef, useEffect, useMemo, useCallback } from "react";
// import DASHBOARD_URL from "../../../../dashboard";
// import { Button, Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, } from "reactstrap";
// import Logo from "../oterra.jpg";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import Backdrop from '@mui/material/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress'
// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';

// let defaultValues = {};
// const MarketProductivity = () => {
//   const [marketID, setMarketID] = useState([]);
//   const [marketOptions, setMarketOptions] = useState([]);

//   const [rowData, setRowData] = useState([]);
//   const [selectedOption, setselectedOption] = useState("0");
//   const gridRef = useRef();
//   const { reset, handleSubmit, control, watch } = useForm({ defaultValues });
//   const [flag, setFlag] = useState(false);
//   const groupDisplayType = "singleColumn";
//   const [data, setData] = useState(null);
//   const [additionalColumnDef, setAdditionalColumnDef] = useState(null);
//   const [companyData, setCompanyData] = useState([]);
//   const [company, setCompany] = useState();
//   const [filterFromDate, setFilterFromDate] = useState(null);
//   const [filterToDate, setFilterToDate] = useState(null);
//   const [open, setOpen] = useState(false)
//   const [filterMarket, setfilterMarket] = useState(null);
//   const [isButtonClicked, setIsButtonClicked] = useState(false);




//   const CustomHeaderComponentTotalNights = () => {
//     return <div>Nights</div>;
//   };
//   const CustomHeaderComponentTotalRevenue = () => {
//     return <div>Total Revenue</div>;
//   };
//   const CustomHeaderComponentTotalRoomRevenue = () => {
//     return <div>Room Revenue</div>;
//   };
//   const CustomHeaderComponentTotalPackageRevenue = () => {
//     return <div>Package Revenue</div>;
//   };
//   const CustomHeaderComponentTotalFBRevenue = () => {
//     return <div>F_B_Revenue</div>;
//   };
//   const CustomHeaderComponentTotalTax = () => {
//     return <div>Tax</div>;
//   };
//   const CustomHeaderComponentTotalADR = () => {
//     return <div>ADR</div>;
//   };
//   function formatNumber(params) {
//     var number = params.value;

//     // Check if the number is undefined or not a number
//     if (typeof number !== 'number' || isNaN(number)) {
//       return ''; // Return empty string for undefined or non-numeric values
//     }

//     // If the number is valid, proceed with formatting
//     var formattedNumber = Math.floor(number).toFixed(2); // Limit to 2 decimal places
//     return formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
//   }

//   const autoGroupColumnDef = useMemo(() => {
//     return {
//       minWidth: 300,
//     };
//   }, []);

//   const [hotelAddress, sethotelAddress] = useState(null);
//   const [hotelName, setHotelName] = useState(null);
//   const [hotelNo, setHotelNo] = useState(null);
//   const [hotelFax, sethotelFax] = useState(null)
//   const [image, setImage] = useState(null);
//   const [logoimage, setLogo] = useState(null);
//   useEffect(() => {
//     fetchx(DASHBOARD_URL + "/getRateCodeMarketID?hotelID=1")
//       .then((result) => result.json())
//       .then((resp) => {
//         setMarketOptions(resp["data"]);
//       });

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
//   }, [])



//   const [columnDefs, setColumnDefs] = useState([
//     {
//       headerName: "MarketCode",
//       field: "marketCode",
//       maxWidth: 160,
//       rowGroup: true,
//       hide: true,
//     },
//     {
//       headerName: "Description",
//       field: "description",
//       maxWidth: 180,
//       wrapText: true,
//       autoHeight: true,
//     },
//     {
//       headerName: "Date",
//       field: "date",
//       maxWidth: 120,
//       cellRenderer: (params) => {
//         if (params.data && params.data.date) {
//           const formattedDate = Moment(params.data.date).format("DD.MM.YYYY");
//           return formattedDate;
//         } else {
//           return "";
//         }
//       },
//     },
//     {
//       headerName: "Nights",
//       field: "No_of_Nights",
//       maxWidth: 100,
//       aggFunc: "sum",

//       headerComponentFramework: CustomHeaderComponentTotalNights,
//     },

//     {
//       headerName: "Room Revenue",
//       field: "room_revenue",
//       maxWidth: 180,
//       aggFunc: "sum",
//       valueFormatter: formatNumber,
//       headerComponentFramework: CustomHeaderComponentTotalRoomRevenue,
//     },
//     {
//       headerName: "Package Revenue",
//       field: "package_revenue",
//       maxWidth: 180,
//       aggFunc: "sum",
//       valueFormatter: formatNumber,
//       headerComponentFramework: CustomHeaderComponentTotalPackageRevenue,
//     },
//     {
//       headerName: 'ARR', field: 'ADR', suppressSizeToFit: true, maxWidth: 120,      // Custom aggregation function for ADR
//       headerComponentFramework: CustomHeaderComponentTotalADR, valueGetter: params => {
//         console.log(params)
//         if (params.node.aggData) {

//           const totalRoomRevenue = params.node.aggData.room_revenue;
//           const totalNights = params.node.aggData.No_of_Nights;
//           return totalNights !== 0 ? totalRoomRevenue / totalNights : 0;
//         }
//         return params.data.ADR;

//       }, valueFormatter: formatNumber
//     },
//     {
//       headerName: "FNB_Revenue",
//       field: "f_b_revenue",
//       maxWidth: 160,
//       aggFunc: "sum",
//       valueFormatter: formatNumber,
//       headerComponentFramework: CustomHeaderComponentTotalFBRevenue,
//     },
//     {
//       headerName: "Tax",
//       field: "tax_for_future",
//       maxWidth: 140,
//       aggFunc: "sum",
//       valueFormatter: formatNumber,
//       headerComponentFramework: CustomHeaderComponentTotalTax,
//     },
//     // {
//     //   headerName: "ARR",
//     //   field: "ADR",
//     //   maxWidth: 140,
//     //   aggFunc: "sum",
//     //   valueFormatter: formatNumber,
//     //   headerComponentFramework: CustomHeaderComponentTotalADR,
//     // },

//     {
//       headerName: "Total Revenue",
//       field: "revenue",
//       maxWidth: 180,
//       aggFunc: "sum",
//       valueFormatter: formatNumber,
//       headerComponentFramework: CustomHeaderComponentTotalRevenue,
//     },
//   ]);

//   const totalRow = {
//     marketCode: "Grand Total",
//     No_of_Nights: "sum",
//     room_revenue: "sum",
//     f_b_revenue: "sum",
//     tax_for_future: "sum",
//     ADR: "sum",
//   };


//   const totalValues = rowData.reduce(
//     (total, current) => {
//       total.No_of_Nights += current.No_of_Nights;
//       total.room_revenue += current.room_revenue;
//       total.f_b_revenue += current.f_b_revenue;
//       total.tax_for_future += current.tax_for_future;
//       total.ADR += current.ADR;
//       return total;
//     },
//     {
//       No_of_Nights: 0,
//       room_revenue: 0,
//       f_b_revenue: 0,
//       tax_for_future: 0,
//       ADR: 0,
//     }
//   );

//   totalRow.No_of_Nights = totalValues.No_of_Nights;
//   totalRow.room_revenue = totalValues.room_revenue;
//   totalRow.f_b_revenue = totalValues.f_b_revenue;
//   totalRow.tax_for_future = totalValues.tax_for_future;
//   totalRow.ADR = totalValues.ADR;

//   // const updatedRowData = [...rowData, totalRow];
//   const updatedRowData = [...rowData];

//   // const totalRow = {
//   //   marketCode: "Grand Total",
//   //   No_of_Nights: "sum",
//   //   room_revenue: "sum",
//   //   f_b_revenue: "sum",
//   //   tax_for_future: "sum",
//   //   ADR: "sum",
//   // };
//   // const totalValues = rowData.reduce(
//   //   (total, current) => {
//   //     total.No_of_Nights += current.No_of_Nights;
//   //     total.room_revenue += current.room_revenue;
//   //     total.f_b_revenue += current.f_b_revenue;
//   //     total.tax_for_future += current.tax_for_future;
//   //     total.ADR += current.ADR;
//   //     return total;
//   //   },
//   //   {
//   //     No_of_Nights: 0,
//   //     room_revenue: 0,
//   //     f_b_revenue: 0,
//   //     tax_for_future: 0,
//   //     ADR: 0,
//   //   }
//   // );

//   // totalRow.No_of_Nights = totalValues.No_of_Nights;
//   // totalRow.room_revenue = totalValues.room_revenue;
//   // totalRow.f_b_revenue = totalValues.f_b_revenue;
//   // totalRow.tax_for_future = totalValues.tax_for_future;
//   // totalRow.ADR = totalValues.ADR;

//   // const updatedRowData = [...rowData, totalRow];

//   const createData = (count, prefix) => {
//     var result = [];
//     for (var i = 0; i < count; i++) {
//       if (rowData.length > 0) {
//         result.push(rowData[0]);
//       }
//     }
//     return result;
//   };
//   const pinnedBottomRowData = useMemo(() => {
//     return createData(1, "Bottom");
//   }, []);
//   const defaultColDef = useMemo(() => ({
//     sortable: true,
//     filter: true,
//     filterParams: {
//       buttons: ["apply", "reset"],
//     },
//   }));

//   const handleTransferTransaction = (event) => {
//     const value = event.target.value;
//     setselectedOption(event.target.value);
//   };

//   const ConfirmSubmit = (data) => {
//     setIsButtonClicked(true)
//     setOpen(true)
//     const filterFromDate = Moment(data.FromDate[0]).format("DD.MM.YYYY");
//     const filterToDate = Moment(data.ToDate[0]).format("DD.MM.YYYY");
//     // const selectedMarket = selectedOption.map(option => option.label);
//     setFilterFromDate(filterFromDate);
//     setFilterToDate(filterToDate);
//     // setCompany(selectedMarket)

//     console.log(data)
//     setData(data);
//     setFlag(true);
//     data.FromDate = Moment(String(new Date(data.FromDate[0]))).format("YYYY-MM-DD");
//     data.ToDate = Moment(String(new Date(data.ToDate[0]))).format("YYYY-MM-DD");
//     const MarketID = Array.isArray(data.marketID)
//       ? data.marketID.map((item) => item.value)
//       : [];
//     const selectedCompanies = data.marketID && data.marketID.map(item => item.label);
//     console.log(selectedCompanies)
//     setfilterMarket(selectedCompanies)
//     let createmarketGroup = JSON.stringify({
//       hotelID: 10,
//       FromDate: data.FromDate,
//       ToDate: data.ToDate,
//       Month: selectedOption,
//       MarketID: MarketID != null ? JSON.stringify(MarketID) : null,
//     });

//     fetchx(DASHBOARD_URL + "/getMarketProductivity", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: createmarketGroup,
//     })
//       // console.log("createmarketGroup",createmarketGroup)
//       //   .then((result) => result.json())
//       //   .then((resp) => {
//       //     const transactionsArray = resp["data"].map((item) => item.data);
//       //     const flattenedArray = transactionsArray.flat();
//       //     setRowData(flattenedArray);     
//       //   })
//       .then((result) => result.json())
//       .then((resp) => {
//         setIsButtonClicked(false)
//         if (resp['statusCode'] == 200) {
//           setOpen(false)
//           const rowDataArray = resp.data.map((item) => item.data);
//           const flattenedArray = rowDataArray.flat();
//           setRowData(flattenedArray);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const cellClickedListener = useCallback((event) => {
//     console.log("cellClicked", event);
//   }, []);

//   const onBtnExport = () => {
//     const params = {
//       fileName: "Market Productivity Report.xlsx",
//       sheetName: "Sheet1",
//     };

//     gridRef.current.api.exportDataAsExcel(params);
//   };



//   const printGrid = () => {
//     if (filterFromDate && filterToDate) {
//       const gridApi = gridRef.current && gridRef.current.api;
//       const uniqueDepartureDates = Array.from(new Set(updatedRowData.map((row) => row.marketCode)));

//       if (gridApi) {
//         const rowData = gridApi.getDataAsCsv({
//           skipHeader: false,
//           skipFooters: false,
//           skipGroups: false,
//         });
//         const headerRow = rowData.substring(0, rowData.indexOf("\n"));
//         const cleanHeaderRow = headerRow.replace(/"/g, "");
//         const dataRows = rowData.substring(rowData.indexOf("\n") + 1);
//         const cleanData = dataRows.replace(/"/g, "");
//         const rows = cleanData.split("\n").map((row) => row.split(","));
//         const pdf = new jsPDF({ orientation: "landscape" });

//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const logoWidth = 20;
//         const xLogo = 10; // X-coordinate for the logo
//         const yLogo = 10; // Y-coordinate for the logo
//         const logoHeight = 20;
//         let dateY = 20;

//         // pdf.addImage(Logo, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

//         // const margin = { left: 10, right: 10 };
//         // const currentDate = new Date();
//         // const formattedDate = formatDates(currentDate);
//         // const paddingFromRight = 85;
//         // const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
//         // pdf.setFontSize(8);
//         // pdf.setFont('helvetica', 'normal');
//         // pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);

//         // pdf.setFontSize(14);
//         // pdf.setFont('helvetica', 'normal');
//         // const hotelNameX = xLogo + logoWidth + 108; // Adjust as needed for spacing
//         // pdf.text(`${hotelName}`, hotelNameX, yLogo + 3);

//         // pdf.setFontSize(12);
//         // pdf.setFont('helvetica', 'normal');
//         // const hotelAddressX = xLogo + logoWidth + 60; // Adjust as needed for spacing
//         // pdf.text(`${hotelAddress}`, hotelAddressX, yLogo + 9);

//         pdf.addImage(DASHBOARD_URL + `/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

//         const margin = { left: 10, right: 10 };
//         const currentDate = new Date();
//         const formattedDate = formatDates(currentDate);
//         const paddingFromRight = 85;
//         const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
//         pdf.setFontSize(8);
//         pdf.setFont('helvetica', 'normal');
//         pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);

//         pdf.setFontSize(14);
//         pdf.setFont('helvetica', 'normal');
//         const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo, fontSize) => {
//           // Set font size and style
//           pdf.setFontSize(fontSize);
//           pdf.setFont('helvetica', 'normal');

//           const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
//           const pageCenter = pdf.internal.pageSize.width / 2;
//           const halfTextWidth = textWidth / 2;
//           let textStartX = pageCenter - halfTextWidth;
//           if (textStartX < 0) {
//             textStartX = 0; // Set a minimum X-coordinate
//           } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
//             textStartX = pdf.internal.pageSize.width - textWidth; // Adjust to fit within the page
//           }

//           // Draw the text on the PDF
//           pdf.text(`${textToCenter}`, textStartX, yLogo);
//         };

//         // Set hotel name
//         setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo, 14);
//         setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8, 12);
//         pdf.setFontSize(14);
//         pdf.setFont('helvetica', 'normal');
//         const textToCenter = "Market Productivity Report";

//         // Set font size and style
//         pdf.setFontSize(14);
//         pdf.setFont('helvetica', 'bold');

//         // Calculate the width of the text
//         const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;

//         // Calculate the starting X-coordinate to center the text
//         const pageCenter = pdf.internal.pageSize.width / 2;
//         const halfTextWidth = textWidth / 2;

//         // Adjust the starting X-coordinate based on the text length
//         let textStartX = pageCenter - halfTextWidth;

//         // Ensure the text doesn't overflow the page
//         if (textStartX < 0) {
//           textStartX = 0; // Set a minimum X-coordinate
//         } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
//           textStartX = pdf.internal.pageSize.width - textWidth; // Adjust to fit within the page
//         }

//         // Y-coordinate for the text element
//         const textY = yLogo + 16;

//         // Draw the text at the calculated center position
//         pdf.text(textToCenter, textStartX, textY);
//         pdf.setFontSize(12);
//         pdf.setFont('helvetica', 'bold');

//         dateY = 10;
//         // const pageWidth = pdf.internal.pageSize.getWidth();
//         // const logoWidth = 15;
//         // const xCenter = (pageWidth - logoWidth) / 2;
//         // const logoHeight = 15;

//         // pdf.addImage(Logo, "JPEG", xCenter, 10, logoWidth, logoHeight);
//         // pdf.setFontSize(12);
//         // pdf.setFont("helvetica", "bold");
//         // pdf.text(`${hotelName}`, 135, 33);
//         // pdf.text(`${hotelAddress}`, 100, 39);
//         // pdf.text("Market Productivity Report", 120, 45);

//         // let dateY = 20;
//         // const margin = { left: 10, right: 10 };
//         // const currentDate = new Date();
//         // const formattedDate = formatDates(currentDate);
//         // const paddingFromRight = 100;
//         // const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
//         // pdf.text("Report Generated Time " + formattedDate, dateX, dateY);

//         // const pageCenter = pdf.internal.pageSize.width / 2;

//         function formatDate(date) {
//           const dateString = date.toString();

//           // Check if the date string matches the format "MMM YYYY"
//           const isMonthYearFormat = dateString.match(/^\w{3} \d{4}$/);

//           if (isMonthYearFormat) {
//             return dateString; // Return the date as is
//           } else {
//             const day = date.getDate().toString().padStart(2, '0');
//             const month = (date.getMonth() + 1).toString().padStart(2, '0');
//             const year = date.getFullYear();
//             return `${day}.${month}.${year}`;
//           }
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


//         function formatDateString(dateString) {
//           const inputDate = new Date(dateString);
//           const formattedDate = new Date(inputDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
//           return formattedDate;
//         }


//         uniqueDepartureDates
//           .sort((a, b) => new Date(a) - new Date(b))
//           .forEach((marketCode, index) => {
//             const rowsForDate = updatedRowData
//               .filter((row) => row.marketCode === marketCode)
//               .map((row) => {
//                 let formattedArrival;
//                 if (selectedOption == '1') {
//                   formattedArrival = formatDateString(new Date(row.date));
//                 }
//                 else {
//                   formattedArrival = formatDate(new Date(row.date));
//                 }
//                 const formatNights = parseFloat(row.No_of_Nights || 0).toLocaleString("en-IN")
//                 const formatRoomRevenue = parseFloat(row.room_revenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                 const formatFnBRevenue = parseFloat(row.f_b_revenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                 const formatTax = parseFloat(row.tax_for_future || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                 const formatARR = parseFloat(row.ADR || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

//                 //  let totalArr;
//                 //  if(totalNights == 0){
//                 //    totalArr = totalRoomRevenue
//                 //  }

//                 //  else{
//                 //    totalArr = parseFloat(parseFloat(totalRoomRevenue) / parseFloat(totalNights)) 
//                 //  }

//                 return {
//                   ...row,
//                   date: formattedArrival,
//                   No_of_Nights: formatNights,
//                   room_revenue: formatRoomRevenue,
//                   f_b_revenue: formatFnBRevenue,
//                   tax_for_future: formatTax,
//                   ADR: formatARR

//                 };
//               })
//               .map((row) => columnDefs.map((column) => row[column.field]));

//             const columns = columnDefs.map((column) => column.headerName);

//             const tableHeight = 8;
//             let currentPage = 1; // Track the current page number

//             // Check if the content fits on the current page
//             if (dateY + tableHeight > pdf.internal.pageSize.height - 20) {
//               // Move to the next page if the content exceeds the page height
//               pdf.addPage();
//               dateY = 10; // Reset the Y position for the new page
//               currentPage++; // Increment the current page number
//             }
//             const totalCount = rowsForDate.length;

//             // Calculate totals (using Indian formatted numbers)
//             const totalNights = rowsForDate.reduce((acc, row) => {
//               const val = row[3];
//               const formattedValue = (typeof val === 'string' ? val : String(val || '0')).replace(/[^0-9.-]+/g, '');
//               return acc + parseFloat(formattedValue || 0);
//             }, 0);

//             const totalRoomRevenue = rowsForDate.reduce((acc, row) => {
//               const val = row[4];
//               const formattedValue = (typeof val === 'string' ? val : String(val || '0')).replace(/[^0-9.-]+/g, '');
//               return acc + parseFloat(formattedValue || 0);
//             }, 0);

//             const totalFnBRevenue = rowsForDate.reduce((acc, row) => {
//               const val = row[5];
//               const formattedValue = (typeof val === 'string' ? val : String(val || '0')).replace(/[^0-9.-]+/g, '');
//               return acc + parseFloat(formattedValue || 0);
//             }, 0);

//             const totalTax = rowsForDate.reduce((acc, row) => {
//               const val = row[6];
//               const formattedValue = (typeof val === 'string' ? val : String(val || '0')).replace(/[^0-9.-]+/g, '');
//               return acc + parseFloat(formattedValue || 0);
//             }, 0);


//             const totalARR = rowsForDate.reduce((acc, row) => {
//               const val = row[7];
//               const formattedValue = (typeof val === 'string' ? val : String(val || '0')).replace(/[^0-9.-]+/g, '');
//               return acc + parseFloat(formattedValue || 0);
//             }, 0);

//             let totalArr;
//             if (totalNights == 0) {
//               totalArr = totalRoomRevenue
//             }

//             else {
//               totalArr = parseFloat(parseFloat(totalRoomRevenue) / parseFloat(totalNights))
//             }


//             // Format totals (keeping the Indian formatted style)
//             const formattedTotalNights = totalNights.toLocaleString("en-IN");
//             const formattedTotalRoomRevenue = totalRoomRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//             const formattedTotalFnBRevenue = totalFnBRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//             const formattedTotalTax = totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//             const formattedARR = totalArr.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//             pdf.setFont('times', 'bold');

//             if (marketCode == undefined) {
//               pdf.text(`Grand Total`, 10, dateY + 37, { width: 500, align: 'left' });
//               pdf.autoTable({
//                 head: [columns],
//                 body: [['', '', 'Total', formattedTotalNights, formattedTotalRoomRevenue, formattedTotalFnBRevenue, formattedTotalTax, formattedARR]],
//                 startY: dateY + 43,
//                 margin
//               })
//             }
//             else {
//               pdf.text(`Market: ${(marketCode)}`, 10, dateY + 37, { width: 500, align: 'left' });
//               const columnStyles = {
//                 0: { columnWidth: 30 }, // Adjust the width as needed for each column
//                 1: { columnWidth: 30 },
//                 2: { columnWidth: 30 },
//                 3: { columnWidth: 30 },
//                 4: { columnWidth: 35 },
//                 5: { columnWidth: 35 },
//                 6: { columnWidth: 35 },
//                 7: { columnWidth: 35 },

//               };
//               pdf.autoTable({
//                 head: [columns],
//                 body: [...rowsForDate, ['', '', 'Total', formattedTotalNights, formattedTotalRoomRevenue, formattedTotalFnBRevenue, formattedTotalTax, formattedARR]],
//                 startY: dateY + 43,
//                 margin,
//                 columnStyles,
//                 didParseCell: (data) => {
//                   if (data.column.index == 3 || data.column.index == 4 || data.column.index == 5 || data.column.index == 6 || data.column.index == 7) {
//                     data.cell.styles.halign = 'right';
//                   }
//                 }
//               })
//             }


//             pdf.setFont('times', 'normal');
//             dateY = pdf.autoTable.previous.finalY - 25
//           });

//         dateY = pdf.autoTable.previous.finalY + 20;

//         const availableSpace = pdf.internal.pageSize.height - dateY;

//         // Check if the available space is enough for the content
//         if (availableSpace < 30) { // Adjust '30' based on your content height
//           pdf.addPage(); // Move to the next page
//           dateY = 10; // Set Y position for the new page
//         }

//         pdf.text(`Filter From Date: ${filterFromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
//         pdf.text(`To Date: ${filterToDate}`, 10, dateY + 20, { width: 500, align: 'left' });
//         pdf.text(`Selected Market: `, 10, dateY + 30, { width: 500, align: 'left' });


//         for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
//           pdf.setPage(i); // Set the active page
//           pdf.setFontSize(10); // Set font size for page number

//           const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
//           const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;

//           // Calculate position for center alignment
//           const xPos = pageCenter - (pageNumberWidth / 2);
//           const yPos = pdf.internal.pageSize.height - 5; // 10 units from the bottom

//           pdf.text(pageNumber, xPos, yPos);
//         }

//         pdf.save("Market Productivity Report.pdf");
//       } else {
//       }
//     }
//   };

//   //   const generateExcel = () => {
//   //     if (filterFromDate && filterToDate) {
//   //         const workbook = new ExcelJS.Workbook();
//   //         const worksheet = workbook.addWorksheet('Market Productivity Report');
//   //         const columns = [
//   //             { header: 'MarketCode', key: 'marketCode', width: 15 },
//   //             { header: 'Description', key: 'description', width: 25 },
//   //             { header: 'Date', key: 'date', width: 15 },
//   //             { header: 'Nights', key: 'No_of_Nights', width: 10 },
//   //             { header: 'Room Revenue', key: 'room_revenue', width: 20 },
//   //             { header: 'FNB_Revenue', key: 'f_b_revenue', width: 20 },
//   //             { header: 'Tax', key: 'tax_for_future', width: 15 },
//   //             { header: 'ARR', key: 'ADR', width: 15 },
//   //         ];
//   //         worksheet.columns = columns;
//   //         worksheet.addRow(['Report Name:', 'Market Productivity Report']);
//   //         worksheet.addRow(['Filter From Date:', filterFromDate]);
//   //         worksheet.addRow(['To Date:', filterToDate]);
//   //         let selectedFilterMarket = filterMarket && filterMarket.length !== 0
//   //             ? filterMarket.join(', ')
//   //             : 'All';
//   //         worksheet.addRow(['Filter Market:', selectedFilterMarket]);
//   //         worksheet.addRow(); 

//   //         worksheet.addRow(columns.map(column => column.header)).font = { bold: true };

//   //         for (let i = 1; i <= 5; i++) {
//   //             worksheet.getRow(i).font = { bold: true };
//   //         }
//   //         const formattedData = (rowData) => {
//   //             return rowData.map(item => ({
//   //                 ...item,
//   //                 marketCode: item.marketCode.replace(/\r?\n|\r/g, ''),
//   //                 description: item.description.replace(/\r?\n|\r/g, '')
//   //             }));
//   //         };
//   //         const sanitizedData = formattedData(rowData);
//   //         let formattedRows = [];
//   //         sanitizedData.forEach((row) => {
//   //             let formattedRow = {
//   //                 marketCode: row.marketCode,
//   //                 description: row.description,
//   //                 date: row.date,
//   //                 No_of_Nights: row.No_of_Nights,
//   //                 room_revenue: row.room_revenue,
//   //                 f_b_revenue: row.f_b_revenue,
//   //                 tax_for_future: row.tax_for_future,
//   //                 ADR: row.ADR,
//   //             };
//   //             formattedRows.push(formattedRow);
//   //         });
//   //         formattedRows.forEach((row) => {
//   //             worksheet.addRow(row);
//   //         });

//   //         worksheet.spliceRows(1, 1); 
//   //         worksheet.columns.forEach((column, index) => {
//   //             if ([4, 5, 6, 7, 8].includes(index + 1)) { 
//   //                 column.alignment = { vertical: 'middle', horizontal: 'right' }; 
//   //             } else {
//   //                 column.alignment = { vertical: 'middle', horizontal: 'left' };
//   //             }
//   //         });
//   //         workbook.xlsx.writeBuffer().then((buffer) => {
//   //             const blob = new Blob([buffer], { type: 'application/octet-stream' });
//   //             saveAs(blob, 'Market Productivity Report.xlsx');
//   //         }).catch((error) => {
//   //             console.error('Error generating Excel file:', error);
//   //         });
//   //     }
//   // };

//   const getExcelFileForRes = () => {
//     setOpen(true)

//     fetch(DASHBOARD_URL + `/getReservationWiseRevenue?hotelID=10`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Failed to download file');
//         }
//         setOpen(false)

//         return response.blob();
//         // Get the response as a Blob (binary large object)
//       })
//       .then(blob => {
//         // Create a download link for the Excel file
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', 'ReservationWiseRevenue_10.xlsx'); // Set the file name
//         document.body.appendChild(link);
//         link.click();
//         link.parentNode.removeChild(link); // Clean up the link after download
//       })
//       .catch(error => {
//         console.error('Error during file download:', error);
//       });
//   };

//   const generateExcel = () => {
//     if (filterFromDate && filterToDate) {
//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Market Productivity Report');

//       const columns = [
//         { header: 'MarketCode', key: 'marketCode', width: 15 },
//         { header: 'Description', key: 'description', width: 25 },
//         { header: 'Date', key: 'date', width: 15 },
//         { header: 'Nights', key: 'No_of_Nights', width: 10 },
//         { header: 'Room Revenue', key: 'room_revenue', width: 20 },
//         { header: 'FNB Revenue', key: 'f_b_revenue', width: 20 },
//         { header: 'Tax', key: 'tax_for_future', width: 15 },
//         { header: 'ARR', key: 'ADR', width: 15 },
//       ];

//       worksheet.columns = columns;

//       worksheet.addRow(['Report Name:', 'Market Productivity Report']);
//       worksheet.addRow(['Filter From Date:', filterFromDate]);
//       worksheet.addRow(['To Date:', filterToDate]);

//       let selectedFilterMarket = filterMarket && filterMarket.length !== 0
//         ? filterMarket.join(', ')
//         : 'All';
//       worksheet.addRow(['Filter Market:', selectedFilterMarket]);
//       worksheet.addRow();

//       worksheet.addRow(columns.map(column => column.header)).font = { bold: true };

//       for (let i = 1; i <= 5; i++) {
//         worksheet.getRow(i).font = { bold: true };
//       }
//       worksheet.spliceRows(1, 1);

//       const formattedData = (rowData) => {
//         return rowData.map(item => ({
//           ...item,
//           // marketCode: item.marketCode.replace(/\r?\n|\r/g, ''),
//           // description: item.description.replace(/\r?\n|\r/g, '')
//           marketCode: item.marketCode?.replace(/\r?\n|\r/g, '') ?? item.marketCode,
//           description: item.description?.replace(/\r?\n|\r/g, '') ?? item.description,

//         }));
//       };

//       const sanitizedData = formattedData(rowData);

//       let totalNights = 0;
//       let totalRoomRevenue = 0;
//       let totalFnbRevenue = 0;
//       let totalTax = 0;
//       let totalArr = 0;

//       sanitizedData.forEach((row) => {
//         worksheet.addRow({
//           marketCode: row.marketCode,
//           description: row.description,
//           date: row.date,
//           No_of_Nights: row.No_of_Nights,
//           room_revenue: row.room_revenue,
//           f_b_revenue: row.f_b_revenue,
//           tax_for_future: row.tax_for_future,
//           ADR: row.ADR,
//         });

//         totalNights += parseFloat(row.No_of_Nights || 0);
//         totalRoomRevenue += parseFloat(row.room_revenue || 0);
//         totalFnbRevenue += parseFloat(row.f_b_revenue || 0);
//         totalTax += parseFloat(row.tax_for_future || 0);
//         totalArr += parseFloat(row.ADR || 0);
//       });

//       worksheet.addRow();
//       worksheet.addRow({
//         marketCode: 'Totals',
//         description: '',
//         date: '',
//         No_of_Nights: totalNights,
//         room_revenue: totalRoomRevenue.toFixed(2),
//         f_b_revenue: totalFnbRevenue.toFixed(2),
//         tax_for_future: totalTax.toFixed(2),
//         ADR: totalArr.toFixed(2),
//       });

//       const totalRow = worksheet.lastRow;
//       totalRow.font = { bold: true };

//       worksheet.columns.forEach((column, index) => {
//         if ([4, 5, 6, 7, 8].includes(index + 1)) {
//           column.alignment = { vertical: 'middle', horizontal: 'right' };
//         } else {
//           column.alignment = { vertical: 'middle', horizontal: 'left' };
//         }
//       });

//       const currentDate = new Date();
//       const formattedDate = currentDate.toISOString().slice(0, 10);

//       workbook.xlsx.writeBuffer().then((buffer) => {
//         const blob = new Blob([buffer], { type: 'application/octet-stream' });
//         // saveAs(blob, 'Market Productivity Report.xlsx');
//         saveAs(blob, `Market Productivity Report_${formattedDate}.xlsx`);
//       }).catch((error) => {
//         console.error('Error generating Excel file:', error);
//       });
//     }
//   };



//   return (
//     <div>
//       <Card>
//         <CardHeader>
//           <CardTitle tag="h4">
//             <b>Market Productivity Report</b>
//           </CardTitle>
//         </CardHeader>
//         <CardBody>
//           <Form onSubmit={handleSubmit(ConfirmSubmit)}>
//             <Row>
//               <Col md="4" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="FromDate">
//                     From Date<spam style={{ color: "red" }}>*</spam>
//                   </Label>
//                   <Controller
//                     control={control}
//                     id="FromDate"
//                     name="FromDate"
//                     required
//                     render={({ field }) => (
//                       <Flatpickr
//                         {...field}
//                         required
//                         options={{ allowInput: true }}
//                         placeholder="YYYY-MM-DD "
//                         className={classnames("form-control", {
//                           "is-invalid": data !== null && data.FromDate === null,
//                         })}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>

//               <Col md="4" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="ToDate">
//                     To Date <spam style={{ color: "red" }}>*</spam>
//                   </Label>
//                   <Controller
//                     control={control}
//                     id="ToDate"
//                     name="ToDate"
//                     required
//                     render={({ field }) => (
//                       <Flatpickr
//                         {...field}
//                         required
//                         options={{ allowInput: true }}
//                         placeholder="YYYY-MM-DD "
//                         className={classnames("form-control", {
//                           "is-invalid": data !== null && data.ToDate === null,
//                         })}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>
//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="marketID">
//                     Market
//                   </Label>
//                   <Controller
//                     id="marketID"
//                     control={control}
//                     name="marketID"
//                     render={({ field }) => (
//                       <Select
//                         isMulti
//                         isClearable
//                         options={marketOptions}
//                         classNamePrefix="select"
//                         theme={selectThemeColors}
//                         {...field}
//                       // onChange={handleChange}

//                       />
//                     )}
//                   />
//                 </div>
//               </Col>
//               {/* <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="marketID">
//                     Market 
//                   </Label>
//                   <Controller
//                     id="marketID"
//                     control={control}
//                     name="marketID"
//                     render={({ field }) => (
//                       <Select
//                       isMulti
//                         // required
//                         isClearable
//                         options={marketID}
//                         classNamePrefix="select"
//                         theme={selectThemeColors}
//                         {...field}
//                     onChange={handleChange}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col> */}
//             </Row>
//             <Row>
//               <Col md="12" sm="12" className="mb-1">
//                 <Label className="form-check-label" for="ex1-active">
//                   <Input
//                     type="radio"
//                     name="ex1"
//                     value="0"
//                     checked={selectedOption === "0"}
//                     onChange={handleTransferTransaction}
//                   />
//                   Date wise
//                 </Label>
//               </Col>
//               <br></br>

//               <Col md="12" sm="12" className="mb-1">
//                 <Label className="form-check-label">
//                   <Input
//                     type="radio"
//                     name="ex1"
//                     value="1"
//                     checked={selectedOption === "1"}
//                     onChange={handleTransferTransaction}
//                   />
//                   Month wise
//                 </Label>
//               </Col>

//               <div className="button-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 {/* <Button className='me-1' color='primary' onClick={() => getExcelFileForRes()}>
//     Download Reservation Data
//   </Button> */}

//                 <div className="button-group" style={{ display: 'flex', gap: '10px' }}>
//                   <Button className="me-1" color="primary" type="submit" disabled={isButtonClicked}>
//                     {isButtonClicked ? 'Processing...' : 'Submit'}
//                   </Button>

//                   {flag && (
//                     <>
//                       <Button className='me-1' color='primary' onClick={generateExcel}>
//                         Download Excel
//                       </Button>

//                       <Button className="me-1" color="primary" onClick={printGrid}>
//                         Print to PDF
//                       </Button>
//                     </>
//                   )}
//                 </div>
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
//             rowData={updatedRowData}
//             columnDefs={[...columnDefs, additionalColumnDef].filter(Boolean)} // Filter out null values
//             animateRows={true}
//             rowSelection="multiple"
//             onCellClicked={cellClickedListener}
//             defaultColDef={defaultColDef}
//             domLayout="autoHeight"
//             // autoGroupColumnDef={autoGroupColumnDef}
//             groupIncludeFooter={true}
//             groupIncludeTotalFooter={true}
//             groupDisplayType={groupDisplayType}
//             headerColor="ddw-primary"
//             pinnedBottomRowData={pinnedBottomRowData}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default MarketProductivity;


import { useState } from "react";
import "cleave.js/dist/addons/cleave-phone.us";
import Flatpickr from "react-flatpickr";
import classnames from "classnames";
import Moment from "moment";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import { useForm, Controller } from "react-hook-form";
import "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import "/node_modules/ag-grid-community/styles/ag-grid.css";
import "/node_modules/ag-grid-community/styles/ag-theme-alpine.css";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { useRef, useEffect, useMemo, useCallback } from "react";
import DASHBOARD_URL from "../../../../dashboard";
import { Button, Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, } from "reactstrap";
import Logo from "../oterra.jpg";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

let defaultValues = {};
const MarketProductivity = () => {
  const [marketID, setMarketID] = useState([]);
  const [marketOptions, setMarketOptions] = useState([]);

  const [rowData, setRowData] = useState([]);
  const [selectedOption, setselectedOption] = useState("0");
  const gridRef = useRef();
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues });
  const [flag, setFlag] = useState(false);
  const groupDisplayType = "singleColumn";
  const [data, setData] = useState(null);
  const [additionalColumnDef, setAdditionalColumnDef] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [company, setCompany] = useState();
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [open, setOpen] = useState(false)
  const [filterMarket, setfilterMarket] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);




  const CustomHeaderComponentTotalNights = () => {
    return <div>Nights</div>;
  };
  const CustomHeaderComponentTotalRevenue = () => {
    return <div>Total Revenue</div>;
  };
  const CustomHeaderComponentTotalRoomRevenue = () => {
    return <div>Room Revenue</div>;
  };
  const CustomHeaderComponentTotalPackageRevenue = () => {
    return <div>Package Revenue</div>;
  };
  const CustomHeaderComponentTotalFBRevenue = () => {
    return <div>F_B_Revenue</div>;
  };
  const CustomHeaderComponentTotalTax = () => {
    return <div>Tax</div>;
  };
  const CustomHeaderComponentTotalADR = () => {
    return <div>ADR</div>;
  };
  function formatNumber(params) {
    var number = params.value;

    // Check if the number is undefined or not a number
    if (typeof number !== 'number' || isNaN(number)) {
      return ''; // Return empty string for undefined or non-numeric values
    }

    // If the number is valid, proceed with formatting
    var formattedNumber = Math.floor(number).toFixed(2); // Limit to 2 decimal places
    return formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 300,
    };
  }, []);

  const [hotelAddress, sethotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const [hotelFax, sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  useEffect(() => {
    fetchx(DASHBOARD_URL + "/getRateCodeMarketID?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        setMarketOptions(resp["data"]);
      });

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
  }, [])



  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "MarketCode",
      field: "marketCode",
      maxWidth: 160,
      rowGroup: true,
      hide: true,
    },
    {
      headerName: "Description",
      field: "description",
      maxWidth: 180,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: "Date",
      field: "date",
      maxWidth: 120,
      cellRenderer: (params) => {
        if (params.data && params.data.date) {
          const formattedDate = Moment(params.data.date).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      },
    },
    {
      headerName: "Nights",
      field: "No_of_Nights",
      maxWidth: 100,
      aggFunc: "sum",

      headerComponentFramework: CustomHeaderComponentTotalNights,
    },

    {
      headerName: "Room Revenue",
      field: "room_revenue",
      maxWidth: 180,
      aggFunc: "sum",
      valueFormatter: formatNumber,
      headerComponentFramework: CustomHeaderComponentTotalRoomRevenue,
    },
    {
      headerName: "Package Revenue",
      field: "package_revenue",
      maxWidth: 180,
      aggFunc: "sum",
      valueFormatter: formatNumber,
      headerComponentFramework: CustomHeaderComponentTotalPackageRevenue,
    },
    {
      headerName: 'ARR', field: 'ADR', suppressSizeToFit: true, maxWidth: 120,      // Custom aggregation function for ADR
      headerComponentFramework: CustomHeaderComponentTotalADR, valueGetter: params => {
        console.log(params)
        if (params.node.aggData) {

          const totalRoomRevenue = params.node.aggData.room_revenue;
          const totalNights = params.node.aggData.No_of_Nights;
          return totalNights !== 0 ? totalRoomRevenue / totalNights : 0;
        }
        return params.data.ADR;

      }, valueFormatter: formatNumber
    },
    {
      headerName: "FNB_Revenue",
      field: "f_b_revenue",
      maxWidth: 160,
      aggFunc: "sum",
      valueFormatter: formatNumber,
      headerComponentFramework: CustomHeaderComponentTotalFBRevenue,
    },
    {
      headerName: "Tax",
      field: "tax_for_future",
      maxWidth: 140,
      aggFunc: "sum",
      valueFormatter: formatNumber,
      headerComponentFramework: CustomHeaderComponentTotalTax,
    },
    // {
    //   headerName: "ARR",
    //   field: "ADR",
    //   maxWidth: 140,
    //   aggFunc: "sum",
    //   valueFormatter: formatNumber,
    //   headerComponentFramework: CustomHeaderComponentTotalADR,
    // },

    {
      headerName: "Total Revenue",
      field: "revenue",
      maxWidth: 180,
      aggFunc: "sum",
      valueFormatter: formatNumber,
      headerComponentFramework: CustomHeaderComponentTotalRevenue,
    },
  ]);

  const totalRow = {
    marketCode: "Grand Total",
    No_of_Nights: "sum",
    room_revenue: "sum",
    f_b_revenue: "sum",
    tax_for_future: "sum",
    ADR: "sum",
  };


  const totalValues = rowData.reduce(
    (total, current) => {
      total.No_of_Nights += current.No_of_Nights;
      total.room_revenue += current.room_revenue;
      total.f_b_revenue += current.f_b_revenue;
      total.tax_for_future += current.tax_for_future;
      total.ADR += current.ADR;
      return total;
    },
    {
      No_of_Nights: 0,
      room_revenue: 0,
      f_b_revenue: 0,
      tax_for_future: 0,
      ADR: 0,
    }
  );

  totalRow.No_of_Nights = totalValues.No_of_Nights;
  totalRow.room_revenue = totalValues.room_revenue;
  totalRow.f_b_revenue = totalValues.f_b_revenue;
  totalRow.tax_for_future = totalValues.tax_for_future;
  totalRow.ADR = totalValues.ADR;

  // const updatedRowData = [...rowData, totalRow];
  const updatedRowData = [...rowData];

  // const totalRow = {
  //   marketCode: "Grand Total",
  //   No_of_Nights: "sum",
  //   room_revenue: "sum",
  //   f_b_revenue: "sum",
  //   tax_for_future: "sum",
  //   ADR: "sum",
  // };
  // const totalValues = rowData.reduce(
  //   (total, current) => {
  //     total.No_of_Nights += current.No_of_Nights;
  //     total.room_revenue += current.room_revenue;
  //     total.f_b_revenue += current.f_b_revenue;
  //     total.tax_for_future += current.tax_for_future;
  //     total.ADR += current.ADR;
  //     return total;
  //   },
  //   {
  //     No_of_Nights: 0,
  //     room_revenue: 0,
  //     f_b_revenue: 0,
  //     tax_for_future: 0,
  //     ADR: 0,
  //   }
  // );

  // totalRow.No_of_Nights = totalValues.No_of_Nights;
  // totalRow.room_revenue = totalValues.room_revenue;
  // totalRow.f_b_revenue = totalValues.f_b_revenue;
  // totalRow.tax_for_future = totalValues.tax_for_future;
  // totalRow.ADR = totalValues.ADR;

  // const updatedRowData = [...rowData, totalRow];

  const createData = (count, prefix) => {
    var result = [];
    for (var i = 0; i < count; i++) {
      if (rowData.length > 0) {
        result.push(rowData[0]);
      }
    }
    return result;
  };
  const pinnedBottomRowData = useMemo(() => {
    return createData(1, "Bottom");
  }, []);
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));

  const handleTransferTransaction = (event) => {
    const value = event.target.value;
    setselectedOption(event.target.value);
  };

  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }


  const ConfirmSubmit = (data) => {
    setIsButtonClicked(true)
    setOpen(true)
    const filterFromDate = Moment(data.FromDate[0]).format("DD.MM.YYYY");
    const filterToDate = Moment(data.ToDate[0]).format("DD.MM.YYYY");
    // const selectedMarket = selectedOption.map(option => option.label);
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    // setCompany(selectedMarket)

    console.log(data)
    setData(data);
    setFlag(true);
    data.FromDate = Moment(String(new Date(data.FromDate[0]))).format("YYYY-MM-DD");
    data.ToDate = Moment(String(new Date(data.ToDate[0]))).format("YYYY-MM-DD");
    const MarketID = Array.isArray(data.marketID)
      ? data.marketID.map((item) => item.value)
      : [];
    const selectedCompanies = data.marketID && data.marketID.map(item => item.label);
    console.log(selectedCompanies)
    setfilterMarket(selectedCompanies)
    let createmarketGroup = JSON.stringify({
      hotelID: 10,
      FromDate: data.FromDate,
      ToDate: data.ToDate,
      Month: selectedOption,
      MarketID: MarketID != null ? JSON.stringify(MarketID) : null,
    });

    fetchx(DASHBOARD_URL + "/getMarketProductivity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: createmarketGroup,
    })
      // console.log("createmarketGroup",createmarketGroup)
      //   .then((result) => result.json())
      //   .then((resp) => {
      //     const transactionsArray = resp["data"].map((item) => item.data);
      //     const flattenedArray = transactionsArray.flat();
      //     setRowData(flattenedArray);     
      //   })
      .then((result) => result.json())
      .then((resp) => {
        setIsButtonClicked(false)
        if (resp['statusCode'] == 200) {
          setOpen(false)
          const rowDataArray = resp.data.map((item) => item.data);
          const flattenedArray = rowDataArray.flat();
          setRowData(flattenedArray);
        }
        else {
          setOpen(false)
          handleError(resp.message || 'Failed to fetch report data')
        }
      })
      .catch((error) => {
        console.log(error);
        handleError(error.message || 'Failed to fetch report data')
      });
  };

  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);

  const onBtnExport = () => {
    const params = {
      fileName: "Market Productivity Report.xlsx",
      sheetName: "Sheet1",
    };

    gridRef.current.api.exportDataAsExcel(params);
  };



  const printGrid = () => {
    if (filterFromDate && filterToDate) {
      const gridApi = gridRef.current && gridRef.current.api;
      const uniqueDepartureDates = Array.from(new Set(updatedRowData.map((row) => row.marketCode)));

      if (gridApi) {
        const rowData = gridApi.getDataAsCsv({
          skipHeader: false,
          skipFooters: false,
          skipGroups: false,
        });
        const headerRow = rowData.substring(0, rowData.indexOf("\n"));
        const cleanHeaderRow = headerRow.replace(/"/g, "");
        const dataRows = rowData.substring(rowData.indexOf("\n") + 1);
        const cleanData = dataRows.replace(/"/g, "");
        const rows = cleanData.split("\n").map((row) => row.split(","));
        const pdf = new jsPDF({ orientation: "landscape" });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const logoWidth = 20;
        const xLogo = 10; // X-coordinate for the logo
        const yLogo = 10; // Y-coordinate for the logo
        const logoHeight = 20;
        let dateY = 20;

        // pdf.addImage(Logo, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

        // const margin = { left: 10, right: 10 };
        // const currentDate = new Date();
        // const formattedDate = formatDates(currentDate);
        // const paddingFromRight = 85;
        // const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
        // pdf.setFontSize(8);
        // pdf.setFont('helvetica', 'normal');
        // pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);

        // pdf.setFontSize(14);
        // pdf.setFont('helvetica', 'normal');
        // const hotelNameX = xLogo + logoWidth + 108; // Adjust as needed for spacing
        // pdf.text(`${hotelName}`, hotelNameX, yLogo + 3);

        // pdf.setFontSize(12);
        // pdf.setFont('helvetica', 'normal');
        // const hotelAddressX = xLogo + logoWidth + 60; // Adjust as needed for spacing
        // pdf.text(`${hotelAddress}`, hotelAddressX, yLogo + 9);

        pdf.addImage(DASHBOARD_URL + `/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

        const margin = { left: 10, right: 10 };
        const currentDate = new Date();
        const formattedDate = formatDates(currentDate);
        const paddingFromRight = 85;
        const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo, fontSize) => {
          // Set font size and style
          pdf.setFontSize(fontSize);
          pdf.setFont('helvetica', 'normal');

          const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
          const pageCenter = pdf.internal.pageSize.width / 2;
          const halfTextWidth = textWidth / 2;
          let textStartX = pageCenter - halfTextWidth;
          if (textStartX < 0) {
            textStartX = 0; // Set a minimum X-coordinate
          } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
            textStartX = pdf.internal.pageSize.width - textWidth; // Adjust to fit within the page
          }

          // Draw the text on the PDF
          pdf.text(`${textToCenter}`, textStartX, yLogo);
        };

        // Set hotel name
        setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo, 14);
        setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8, 12);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        const textToCenter = "Market Productivity Report";

        // Set font size and style
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');

        // Calculate the width of the text
        const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;

        // Calculate the starting X-coordinate to center the text
        const pageCenter = pdf.internal.pageSize.width / 2;
        const halfTextWidth = textWidth / 2;

        // Adjust the starting X-coordinate based on the text length
        let textStartX = pageCenter - halfTextWidth;

        // Ensure the text doesn't overflow the page
        if (textStartX < 0) {
          textStartX = 0; // Set a minimum X-coordinate
        } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
          textStartX = pdf.internal.pageSize.width - textWidth; // Adjust to fit within the page
        }

        // Y-coordinate for the text element
        const textY = yLogo + 16;

        // Draw the text at the calculated center position
        pdf.text(textToCenter, textStartX, textY);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');

        dateY = 10;
        // const pageWidth = pdf.internal.pageSize.getWidth();
        // const logoWidth = 15;
        // const xCenter = (pageWidth - logoWidth) / 2;
        // const logoHeight = 15;

        // pdf.addImage(Logo, "JPEG", xCenter, 10, logoWidth, logoHeight);
        // pdf.setFontSize(12);
        // pdf.setFont("helvetica", "bold");
        // pdf.text(`${hotelName}`, 135, 33);
        // pdf.text(`${hotelAddress}`, 100, 39);
        // pdf.text("Market Productivity Report", 120, 45);

        // let dateY = 20;
        // const margin = { left: 10, right: 10 };
        // const currentDate = new Date();
        // const formattedDate = formatDates(currentDate);
        // const paddingFromRight = 100;
        // const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
        // pdf.text("Report Generated Time " + formattedDate, dateX, dateY);

        // const pageCenter = pdf.internal.pageSize.width / 2;

        function formatDate(date) {
          const dateString = date.toString();

          // Check if the date string matches the format "MMM YYYY"
          const isMonthYearFormat = dateString.match(/^\w{3} \d{4}$/);

          if (isMonthYearFormat) {
            return dateString; // Return the date as is
          } else {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
          }
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


        function formatDateString(dateString) {
          const inputDate = new Date(dateString);
          const formattedDate = new Date(inputDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          return formattedDate;
        }


        uniqueDepartureDates
          .sort((a, b) => new Date(a) - new Date(b))
          .forEach((marketCode, index) => {
            const rowsForDate = updatedRowData
              .filter((row) => row.marketCode === marketCode)
              .map((row) => {
                let formattedArrival;
                if (selectedOption == '1') {
                  formattedArrival = formatDateString(new Date(row.date));
                }
                else {
                  formattedArrival = formatDate(new Date(row.date));
                }
                const formatNights = parseFloat(row.No_of_Nights || 0).toLocaleString("en-IN")
                const formatRoomRevenue = parseFloat(row.room_revenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                const formatFnBRevenue = parseFloat(row.f_b_revenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                const formatTax = parseFloat(row.tax_for_future || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                const formatARR = parseFloat(row.ADR || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

                //  let totalArr;
                //  if(totalNights == 0){
                //    totalArr = totalRoomRevenue
                //  }

                //  else{
                //    totalArr = parseFloat(parseFloat(totalRoomRevenue) / parseFloat(totalNights)) 
                //  }

                return {
                  ...row,
                  date: formattedArrival,
                  No_of_Nights: formatNights,
                  room_revenue: formatRoomRevenue,
                  f_b_revenue: formatFnBRevenue,
                  tax_for_future: formatTax,
                  ADR: formatARR

                };
              })
              .map((row) => columnDefs.map((column) => row[column.field]));

            const columns = columnDefs.map((column) => column.headerName);

            const tableHeight = 8;
            let currentPage = 1; // Track the current page number

            // Check if the content fits on the current page
            if (dateY + tableHeight > pdf.internal.pageSize.height - 20) {
              // Move to the next page if the content exceeds the page height
              pdf.addPage();
              dateY = 10; // Reset the Y position for the new page
              currentPage++; // Increment the current page number
            }
            const totalCount = rowsForDate.length;

            // Calculate totals (using Indian formatted numbers)
            const totalNights = rowsForDate.reduce((acc, row) => {
              const val = row[3];
              const formattedValue = (typeof val === 'string' ? val : String(val || '0')).replace(/[^0-9.-]+/g, '');
              return acc + parseFloat(formattedValue || 0);
            }, 0);

            const totalRoomRevenue = rowsForDate.reduce((acc, row) => {
              const val = row[4];
              const formattedValue = (typeof val === 'string' ? val : String(val || '0')).replace(/[^0-9.-]+/g, '');
              return acc + parseFloat(formattedValue || 0);
            }, 0);

            const totalFnBRevenue = rowsForDate.reduce((acc, row) => {
              const val = row[5];
              const formattedValue = (typeof val === 'string' ? val : String(val || '0')).replace(/[^0-9.-]+/g, '');
              return acc + parseFloat(formattedValue || 0);
            }, 0);

            const totalTax = rowsForDate.reduce((acc, row) => {
              const val = row[6];
              const formattedValue = (typeof val === 'string' ? val : String(val || '0')).replace(/[^0-9.-]+/g, '');
              return acc + parseFloat(formattedValue || 0);
            }, 0);


            const totalARR = rowsForDate.reduce((acc, row) => {
              const val = row[7];
              const formattedValue = (typeof val === 'string' ? val : String(val || '0')).replace(/[^0-9.-]+/g, '');
              return acc + parseFloat(formattedValue || 0);
            }, 0);

            let totalArr;
            if (totalNights == 0) {
              totalArr = totalRoomRevenue
            }

            else {
              totalArr = parseFloat(parseFloat(totalRoomRevenue) / parseFloat(totalNights))
            }


            // Format totals (keeping the Indian formatted style)
            const formattedTotalNights = totalNights.toLocaleString("en-IN");
            const formattedTotalRoomRevenue = totalRoomRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const formattedTotalFnBRevenue = totalFnBRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const formattedTotalTax = totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const formattedARR = totalArr.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            pdf.setFont('times', 'bold');

            if (marketCode == undefined) {
              pdf.text(`Grand Total`, 10, dateY + 37, { width: 500, align: 'left' });
              pdf.autoTable({
                head: [columns],
                body: [['', '', 'Total', formattedTotalNights, formattedTotalRoomRevenue, formattedTotalFnBRevenue, formattedTotalTax, formattedARR]],
                startY: dateY + 43,
                margin
              })
            }
            else {
              pdf.text(`Market: ${(marketCode)}`, 10, dateY + 37, { width: 500, align: 'left' });
              const columnStyles = {
                0: { columnWidth: 30 }, // Adjust the width as needed for each column
                1: { columnWidth: 30 },
                2: { columnWidth: 30 },
                3: { columnWidth: 30 },
                4: { columnWidth: 35 },
                5: { columnWidth: 35 },
                6: { columnWidth: 35 },
                7: { columnWidth: 35 },

              };
              pdf.autoTable({
                head: [columns],
                body: [...rowsForDate, ['', '', 'Total', formattedTotalNights, formattedTotalRoomRevenue, formattedTotalFnBRevenue, formattedTotalTax, formattedARR]],
                startY: dateY + 43,
                margin,
                columnStyles,
                didParseCell: (data) => {
                  if (data.column.index == 3 || data.column.index == 4 || data.column.index == 5 || data.column.index == 6 || data.column.index == 7) {
                    data.cell.styles.halign = 'right';
                  }
                }
              })
            }


            pdf.setFont('times', 'normal');
            dateY = pdf.autoTable.previous.finalY - 25
          });

        dateY = pdf.autoTable.previous.finalY + 20;

        const availableSpace = pdf.internal.pageSize.height - dateY;

        // Check if the available space is enough for the content
        if (availableSpace < 30) { // Adjust '30' based on your content height
          pdf.addPage(); // Move to the next page
          dateY = 10; // Set Y position for the new page
        }

        pdf.text(`Filter From Date: ${filterFromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
        pdf.text(`To Date: ${filterToDate}`, 10, dateY + 20, { width: 500, align: 'left' });
        pdf.text(`Selected Market: `, 10, dateY + 30, { width: 500, align: 'left' });


        for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
          pdf.setPage(i); // Set the active page
          pdf.setFontSize(10); // Set font size for page number

          const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
          const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;

          // Calculate position for center alignment
          const xPos = pageCenter - (pageNumberWidth / 2);
          const yPos = pdf.internal.pageSize.height - 5; // 10 units from the bottom

          pdf.text(pageNumber, xPos, yPos);
        }

        pdf.save("Market Productivity Report.pdf");
      } else {
      }
    }
  };

  //   const generateExcel = () => {
  //     if (filterFromDate && filterToDate) {
  //         const workbook = new ExcelJS.Workbook();
  //         const worksheet = workbook.addWorksheet('Market Productivity Report');
  //         const columns = [
  //             { header: 'MarketCode', key: 'marketCode', width: 15 },
  //             { header: 'Description', key: 'description', width: 25 },
  //             { header: 'Date', key: 'date', width: 15 },
  //             { header: 'Nights', key: 'No_of_Nights', width: 10 },
  //             { header: 'Room Revenue', key: 'room_revenue', width: 20 },
  //             { header: 'FNB_Revenue', key: 'f_b_revenue', width: 20 },
  //             { header: 'Tax', key: 'tax_for_future', width: 15 },
  //             { header: 'ARR', key: 'ADR', width: 15 },
  //         ];
  //         worksheet.columns = columns;
  //         worksheet.addRow(['Report Name:', 'Market Productivity Report']);
  //         worksheet.addRow(['Filter From Date:', filterFromDate]);
  //         worksheet.addRow(['To Date:', filterToDate]);
  //         let selectedFilterMarket = filterMarket && filterMarket.length !== 0
  //             ? filterMarket.join(', ')
  //             : 'All';
  //         worksheet.addRow(['Filter Market:', selectedFilterMarket]);
  //         worksheet.addRow(); 

  //         worksheet.addRow(columns.map(column => column.header)).font = { bold: true };

  //         for (let i = 1; i <= 5; i++) {
  //             worksheet.getRow(i).font = { bold: true };
  //         }
  //         const formattedData = (rowData) => {
  //             return rowData.map(item => ({
  //                 ...item,
  //                 marketCode: item.marketCode.replace(/\r?\n|\r/g, ''),
  //                 description: item.description.replace(/\r?\n|\r/g, '')
  //             }));
  //         };
  //         const sanitizedData = formattedData(rowData);
  //         let formattedRows = [];
  //         sanitizedData.forEach((row) => {
  //             let formattedRow = {
  //                 marketCode: row.marketCode,
  //                 description: row.description,
  //                 date: row.date,
  //                 No_of_Nights: row.No_of_Nights,
  //                 room_revenue: row.room_revenue,
  //                 f_b_revenue: row.f_b_revenue,
  //                 tax_for_future: row.tax_for_future,
  //                 ADR: row.ADR,
  //             };
  //             formattedRows.push(formattedRow);
  //         });
  //         formattedRows.forEach((row) => {
  //             worksheet.addRow(row);
  //         });

  //         worksheet.spliceRows(1, 1); 
  //         worksheet.columns.forEach((column, index) => {
  //             if ([4, 5, 6, 7, 8].includes(index + 1)) { 
  //                 column.alignment = { vertical: 'middle', horizontal: 'right' }; 
  //             } else {
  //                 column.alignment = { vertical: 'middle', horizontal: 'left' };
  //             }
  //         });
  //         workbook.xlsx.writeBuffer().then((buffer) => {
  //             const blob = new Blob([buffer], { type: 'application/octet-stream' });
  //             saveAs(blob, 'Market Productivity Report.xlsx');
  //         }).catch((error) => {
  //             console.error('Error generating Excel file:', error);
  //         });
  //     }
  // };

  const getExcelFileForRes = () => {
    setOpen(true)

    fetch(DASHBOARD_URL + `/getReservationWiseRevenue?hotelID=10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to download file');
        }
        setOpen(false)

        return response.blob();
        // Get the response as a Blob (binary large object)
      })
      .then(blob => {
        // Create a download link for the Excel file
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ReservationWiseRevenue_10.xlsx'); // Set the file name
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link); // Clean up the link after download
      })
      .catch(error => {
        console.error('Error during file download:', error);
      });
  };

  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Market Productivity Report');

      const columns = [
        { header: 'MarketCode', key: 'marketCode', width: 15 },
        { header: 'Description', key: 'description', width: 25 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Nights', key: 'No_of_Nights', width: 10 },
        { header: 'Room Revenue', key: 'room_revenue', width: 20 },
        { header: 'FNB Revenue', key: 'f_b_revenue', width: 20 },
        { header: 'Tax', key: 'tax_for_future', width: 15 },
        { header: 'ARR', key: 'ADR', width: 15 },
      ];

      worksheet.columns = columns;

      worksheet.addRow(['Report Name:', 'Market Productivity Report']);
      worksheet.addRow(['Filter From Date:', filterFromDate]);
      worksheet.addRow(['To Date:', filterToDate]);

      let selectedFilterMarket = filterMarket && filterMarket.length !== 0
        ? filterMarket.join(', ')
        : 'All';
      worksheet.addRow(['Filter Market:', selectedFilterMarket]);
      worksheet.addRow();

      worksheet.addRow(columns.map(column => column.header)).font = { bold: true };

      for (let i = 1; i <= 5; i++) {
        worksheet.getRow(i).font = { bold: true };
      }
      worksheet.spliceRows(1, 1);

      const formattedData = (rowData) => {
        return rowData.map(item => ({
          ...item,
          // marketCode: item.marketCode.replace(/\r?\n|\r/g, ''),
          // description: item.description.replace(/\r?\n|\r/g, '')
          marketCode: item.marketCode?.replace(/\r?\n|\r/g, '') ?? item.marketCode,
          description: item.description?.replace(/\r?\n|\r/g, '') ?? item.description,
        }));
      };

      const sanitizedData = formattedData(rowData);

      let totalNights = 0;
      let totalRoomRevenue = 0;
      let totalFnbRevenue = 0;
      let totalTax = 0;
      let totalArr = 0;

      sanitizedData.forEach((row) => {
        worksheet.addRow({
          marketCode: row.marketCode,
          description: row.description,
          date: row.date,
          No_of_Nights: row.No_of_Nights,
          room_revenue: row.room_revenue,
          f_b_revenue: row.f_b_revenue,
          tax_for_future: row.tax_for_future,
          ADR: row.ADR,
        });

        totalNights += parseFloat(row.No_of_Nights || 0);
        totalRoomRevenue += parseFloat(row.room_revenue || 0);
        totalFnbRevenue += parseFloat(row.f_b_revenue || 0);
        totalTax += parseFloat(row.tax_for_future || 0);
        totalArr += parseFloat(row.ADR || 0);
      });

      worksheet.addRow();
      worksheet.addRow({
        marketCode: 'Totals',
        description: '',
        date: '',
        No_of_Nights: totalNights,
        room_revenue: totalRoomRevenue.toFixed(2),
        f_b_revenue: totalFnbRevenue.toFixed(2),
        tax_for_future: totalTax.toFixed(2),
        ADR: totalArr.toFixed(2),
      });

      const totalRow = worksheet.lastRow;
      totalRow.font = { bold: true };

      worksheet.columns.forEach((column, index) => {
        if ([4, 5, 6, 7, 8].includes(index + 1)) {
          column.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          column.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);

      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        // saveAs(blob, 'Market Productivity Report.xlsx');
        saveAs(blob, `Market Productivity Report_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };



  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">
            <b>Market Productivity Report</b>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(ConfirmSubmit)}>
            <Row>
              <Col md="4" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="FromDate">
                    From Date<spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id="FromDate"
                    name="FromDate"
                    required
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        required
                        options={{ allowInput: true }}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                          "is-invalid": data !== null && data.FromDate === null,
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="4" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="ToDate">
                    To Date <spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id="ToDate"
                    name="ToDate"
                    required
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        required
                        options={{ allowInput: true }}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                          "is-invalid": data !== null && data.ToDate === null,
                        })}
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="marketID">
                    Market
                  </Label>
                  <Controller
                    id="marketID"
                    control={control}
                    name="marketID"
                    render={({ field }) => (
                      <Select
                        isMulti
                        isClearable
                        options={marketOptions}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        {...field}
                      // onChange={handleChange}

                      />
                    )}
                  />
                </div>
              </Col>
              {/* <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="marketID">
                    Market 
                  </Label>
                  <Controller
                    id="marketID"
                    control={control}
                    name="marketID"
                    render={({ field }) => (
                      <Select
                      isMulti
                        // required
                        isClearable
                        options={marketID}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        {...field}
                    onChange={handleChange}
                      />
                    )}
                  />
                </div>
              </Col> */}
            </Row>
            <Row>
              <Col md="12" sm="12" className="mb-1">
                <Label className="form-check-label" for="ex1-active">
                  <Input
                    type="radio"
                    name="ex1"
                    value="0"
                    checked={selectedOption === "0"}
                    onChange={handleTransferTransaction}
                  />
                  Date wise
                </Label>
              </Col>
              <br></br>

              <Col md="12" sm="12" className="mb-1">
                <Label className="form-check-label">
                  <Input
                    type="radio"
                    name="ex1"
                    value="1"
                    checked={selectedOption === "1"}
                    onChange={handleTransferTransaction}
                  />
                  Month wise
                </Label>
              </Col>

              <div className="button-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* <Button className='me-1' color='primary' onClick={() => getExcelFileForRes()}>
    Download Reservation Data
  </Button> */}

                <div className="button-group" style={{ display: 'flex', gap: '10px' }}>
                  <Button className="me-1" color="primary" type="submit" disabled={isButtonClicked}>
                    {isButtonClicked ? 'Processing...' : 'Submit'}
                  </Button>

                  {flag && (
                    <>
                      <Button className='me-1' color='primary' onClick={generateExcel}>
                        Download Excel
                      </Button>

                      <Button className="me-1" color="primary" onClick={printGrid}>
                        Print to PDF
                      </Button>
                    </>
                  )}
                </div>
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
            rowData={updatedRowData}
            columnDefs={[...columnDefs, additionalColumnDef].filter(Boolean)} // Filter out null values
            animateRows={true}
            rowSelection="multiple"
            onCellClicked={cellClickedListener}
            defaultColDef={defaultColDef}
            domLayout="autoHeight"
            // autoGroupColumnDef={autoGroupColumnDef}
            groupIncludeFooter={true}
            groupIncludeTotalFooter={true}
            groupDisplayType={groupDisplayType}
            headerColor="ddw-primary"
            pinnedBottomRowData={pinnedBottomRowData}
          />
        </div>
      )}
    </div>
  );
};

export default MarketProductivity;