// ** React Imports
import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Table, Modal, ModalBody, ModalHeader } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'ag-grid-enterprise';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import logo from '@src/assets/images/logo/oterra.jpg'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';

const MySwal = withReactContent(Swal)

const defaultValues = {
  frmdate: ''
}

const CashsettlementReport = () => {
  // ** State
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const [coversData, setCoversData] = useState([])
  const [amount, setAmount] = useState()
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [flag1, setflag1] = useState(false)
  const [ShowDummyInvPDF, setShowDummyInvPDF] = useState(false)
  const [DummyInvURL, setDummyInvURL] = useState([])
  const [InvURL, setInvURL] = useState([])
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);


  // ** Hooks
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
  let navigate = useNavigate();

  // AG Grid
  const [rowData, setRowData] = useState();
  const [rowData1, setRowData1] = useState();
  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD'))
  };

  const groupDisplayType = 'singleColumn';

  const gridRef = useRef();

  const [hotelDetails, setHotelDetails] = useState(null);
  const [hotelAddress, setHotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
    //API to get hotel details
    useEffect(() => {

      fetchx(DASHBOARD_URL + "/getBusinessDate", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json())
        .then(postres => {
          setHotelDetails(postres['data'])
          setHotelAddress(postres['data'][0]['address'])
          setHotelName(postres['data'][0]['name'])
          setHotelNo(postres['data'][0]['phoneNumber'])
          sethotelFax(postres['data'][0]['fax'])
          setLogo(postres['data'][0]['logo'])
        })
  
    }, [])



    function formatRate(rate) {
      // Convert rate to a number if it's a string
      const numericRate = parseFloat(rate);
    
      // Check if the rate is a valid number
      if (!isNaN(numericRate)) {
        // Apply formatting: add commas and fix to two decimal places
        const formattedRate = numericRate.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return formattedRate;
      } else {
        // Return the original value if it's not a valid number
        return rate;
      }
    }

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Booking ID', field: 'bookingID', suppressSizeToFit: true, width: 130 },
    { headerName: 'Receipt No', field: 'receiptNumber', suppressSizeToFit: true, width: 130 },

    { headerName: 'User', field: 'createdBy', suppressSizeToFit: true, width: 140 },
    {
      headerName: 'Transaction Date',
      field: 'transactiondate',
      suppressSizeToFit: true,
      width: 170,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: (params) => {
          let content;
          if (params.value === null) {
            content = '';
          } else {
            const date = Moment(params.value);
            content = date.isValid() ? date.format('DD.MM.YYYY') : 'Grand Total';
          }
          return content;
        },
      },
      rowGroup: true,
      // aggFunc: () => 'Grand Total', // Set aggregation function to display 'Grand Total'
    },
    { headerName: 'BillNo', field: 'billNoDisplay', suppressSizeToFit: true, width: 160 },
    { headerName: 'Room No', field: 'roomNumber', suppressSizeToFit: true, width: 130 },
    {
      headerName: 'Guest Name',
      field: 'guestName',
      suppressSizeToFit: true,
      width: 300,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: 'Amount',
      field: 'base_amount',
      suppressSizeToFit: true,
      width: 140,
      valueFormatter: (params) => {
        return formatRate(params.value);
      },
      valueGetter: function (params) {
        // Check if params and params.data exist before accessing properties
        if (params && params.data && typeof params.data.base_amount !== 'undefined') {
          return Math.abs(params.data.base_amount); // Display absolute value of base_amount
        }
        return null; // Return null or handle this scenario according to your requirement
      },
    },
    {
      headerName: 'Date-Time',
      field: 'DateTime',
      suppressSizeToFit: true,
      width: 170,
      cellRenderer: (params) => {
        if (params.data && params.data.DateTime) {
          const dateTime = params.data.DateTime;
          const formattedDate = Moment(dateTime, 'DD-MM-YYYY HH:mm:ss').format('DD.MM.YYYY HH:mm:ss');
          return formattedDate;
        }
        return '';
      },
    },
    { headerName: 'Payment Type', field: 'transactionDescription', suppressSizeToFit: true, width: 140 },
  ]);


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
  }, []);


  const onSubmit = data => {
    setIsButtonClicked(true)
    setOpen(true)
    const filterFromDate = Moment(data.frmdate[0]).format("YYYY-MM-DD");
    const filterToDate = Moment(data.todate[0]).format("YYYY-MM-DD");
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);

    setFlag(true)
    setData(data)
    let createmarketGroup = JSON.stringify({
      "hotelID": 1,
      "startDate": filterFromDate,
      "endDate": filterToDate
    })

    if (flag1 == true) {
      fetchx(DASHBOARD_URL + "/getCashSettlementReport", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(data => data.json())
        .then((res) => {
          if(res['statusCode'] == 200) {
            setIsButtonClicked(false)
            setOpen(false)
          setRowData1(res.data[0]["transactions"])
          setCoversData(res["data"])
          setAmount(res.data[0]["totalAmount"])
          }
        });
    }

  }


  const handleReset = () => {
    reset({
      frmdate: '',
      todate: '',
    })
  }


  const totalAmountRow = {
    billNoDisplay: 'Total Amount',
    hotelId: '',
    createdBy: '',
    date: '',
    roomNumber: '',
    guestName: '',
    bookingID: '',
    base_amount: amount,
    description: '',
    DateTime: '',
  };


  // const rowDataWithTotal = [rowData1,totalAmountRow];
  const rowDataWithTotal = Array.isArray(rowData1) ? [...rowData1, totalAmountRow] : [totalAmountRow];


  const onButtonExport = () => {
    const params = {
      fileName: 'Cash settlement report.xlsx',
      sheetName: 'Sheet1',
    };
    gridRef.current.api.exportDataAsExcel(params);
  };


  // const downloadPDF = async () => {
  //   const gridApi = gridRef.current && gridRef.current.api;
  //   const uniqueNationalities = Array.from(new Set(rowData1.map((row) => row.transactiondate)));
  //   if (gridApi) {
  //     const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
  //     const headerRow = rowData.substring(0, rowData.indexOf('\n'));
  //     const cleanHeaderRow = headerRow.replace(/"/g, '');
  //     const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
  //     const cleanData = dataRows.replace(/"/g, '');
  //     const rows = cleanData.split('\n').map(row => row.split(','));
  //     const pdf = new jsPDF({ orientation: 'landscape' });
  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const logoWidth = 20;
  //     const xLogo = 10; // X-coordinate for the logo
  //     const yLogo = 10; // Y-coordinate for the logo
  //     const logoHeight = 20;
  //     let startY = 20;

  //     pdf.addImage(`https://testpms.ms-tech.in/v8/pms-backend-prod/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

  //   const margin = { left: 10, right: 10 };
  //   const currentDate = new Date();
  //   const formattedDate = formatDates(currentDate);
  //   const paddingFromRight = 85;
  //   const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
  //   pdf.setFontSize(8);
  //   pdf.setFont('helvetica', 'normal');
  //   pdf.text("Generated Time " + formattedDate, dateX + 35, startY - 7);
    
  //   pdf.setFontSize(14);
  //   pdf.setFont('helvetica', 'normal');
  //   const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo,fontSize) => {
  //     // Set font size and style
  //     pdf.setFontSize(fontSize);
  //     pdf.setFont('helvetica', 'normal');
      
  //     const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
  //     const pageCenter = pdf.internal.pageSize.width / 2;
  //     const halfTextWidth = textWidth / 2;
  //     let textStartX = pageCenter - halfTextWidth;
  //       if (textStartX < 0) {
  //         textStartX = 0; // Set a minimum X-coordinate
  //     } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
  //         textStartX = pdf.internal.pageSize.width - textWidth; // Adjust to fit within the page
  //     }
    
  //     // Draw the text on the PDF
  //     pdf.text(`${textToCenter}`, textStartX, yLogo);
  //   };
    
  //   // Set hotel name
  //   setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo,14);
  //   setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8,12); 
  //   pdf.setFontSize(14);
  //   pdf.setFont('helvetica', 'normal');
  //     const textToCenter = "Cash Settlement Report";

  //     // Set font size and style
  //     pdf.setFontSize(14);
  //     pdf.setFont('helvetica', 'bold');
      
  //     // Calculate the width of the text
  //     const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      
  //     // Calculate the starting X-coordinate to center the text
  //     const pageCenter = pdf.internal.pageSize.width / 2;
  //     const halfTextWidth = textWidth / 2;
      
  //     // Adjust the starting X-coordinate based on the text length
  //     let textStartX = pageCenter - halfTextWidth;
      
  //     // Ensure the text doesn't overflow the page
  //     if (textStartX < 0) {
  //       textStartX = 0; // Set a minimum X-coordinate
  //     } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
  //       textStartX = pdf.internal.pageSize.width - textWidth; // Adjust to fit within the page
  //     }
      
  //     // Y-coordinate for the text element
  //     const textY = yLogo + 16;
      
  //     // Draw the text at the calculated center position
  //     pdf.text(textToCenter, textStartX, textY);
  //     pdf.setFontSize(12);
  //     pdf.setFont('helvetica', 'bold');

  //     startY = 10;

  //     uniqueNationalities
  //       .sort((a, b) => new Date(a) - new Date(b))
  //       .forEach((transactiondate, index) => {
  //         const rowsForDate = rowData1
  //           .filter((row) => row.transactiondate === transactiondate)
  //           .map((row) => {
  //             const formattedArrival = formatDate(new Date(row.transactiondate));
  //             const formattedDeparture = (Moment(String(new Date(row.DateTime))).format('DD.MM.YYYY hh:mm:ss'))
  //             let formattedTotalAmount = Math.abs(parseFloat(row.base_amount || 0)).toFixed(2);
  //             formattedTotalAmount = new Intl.NumberFormat('en-IN', {
  //               minimumFractionDigits: 2,
  //               maximumFractionDigits: 2,
  //             }).format(formattedTotalAmount);
            
  //             // Check if there are no decimal points, then add '00' at the end
  //             if (!formattedTotalAmount.includes('.')) {
  //               formattedTotalAmount += '.00';
  //             }
  //             return {
  //               ...row,
  //               transactiondate: formattedArrival,
  //               base_amount: formattedTotalAmount, // Convert amount to absolute value
  //             };
  //           })
  //           .map((row) => columnDefs.map((column) => row[column.field]));

  //         const columns = columnDefs.map((column) => column.headerName);

  //         const tableHeight = 8;
  //         let currentPage = 1; // Track the current page number

  //         // Check if the content fits on the current page
  //         if (startY + tableHeight > pdf.internal.pageSize.height - 20) {
  //           // Move to the next page if the content exceeds the page height
  //           pdf.addPage();
  //           startY = 10; // Reset the Y position for the new page
  //           currentPage++; // Increment the current page number
  //         }

  //         const totalCount = rowsForDate.length;
  //         pdf.setFont('times', 'bold');

  //         const formattedArrivalDate = formatDate(new Date(transactiondate));

  //         pdf.text(`Transaction Date: ${formattedArrivalDate}`, 10, startY + 37, { width: 500, align: 'left' });

  //         const totalAmount = rowsForDate.reduce((total, row) => {
  //           const baseAmountValue = parseFloat(row[columnDefs.findIndex(col => col.field === 'base_amount')].replaceAll(',', '')) || 0; // Replace comma and parse to float
  //           return total + Math.abs(baseAmountValue);
  //         }, 0).toFixed(2);

  //         const formattedTotalAmount = new Intl.NumberFormat('en-IN', {
  //           minimumFractionDigits: 2,
  //           maximumFractionDigits: 2,
  //         }).format(totalAmount.replace(',', '')); // Remove commas before formatting

  //         const totalRow = ['', '', '', '', '', 'Total Amount:', formattedTotalAmount, 'Total Count:', totalCount];

  //         pdf.autoTable({
  //           head: [columns],
  //           body: [...rowsForDate, totalRow],
  //           startY: startY + 43,
  //           didParseCell: (data) => {
  //             if (data.column.index == 6 ) {
  //               data.cell.styles.halign = 'right';
  //             }

  //             if (data.row.raw.some(cellData => typeof cellData === 'string' && cellData.includes('Total'))) { // Assuming 'Grand Total' is in the first column
  //               data.cell.styles.fillColor = [220, 220, 220]; // Highlighting with a yellow background color
  //               data.cell.styles.fontStyle = 'bold'; // Making the text bold
  //             }
              
  //           }
  //         });

  //         startY = pdf.autoTable.previous.finalY - 22;

  //         const availableSpace = pdf.internal.pageSize.height - startY;

  //         // Check if the available space is enough for the content
  //         if (availableSpace < 30) { // Adjust '30' based on your content height
  //           pdf.addPage(); // Move to the next page
  //           startY = 10; // Set Y position for the new page
  //         }

  //       });

  //     startY = pdf.autoTable.previous.finalY + 20;

  //     const availableSpace = pdf.internal.pageSize.height - startY;

  //     // Check if the available space is enough for the content
  //     if (availableSpace < 30) { // Adjust '30' based on your content height
  //       pdf.addPage(); // Move to the next page
  //       startY = 10; // Set Y position for the new page
  //     }

  //     let fromDate = formatDate(new Date(filterFromDate))
  //     let toDate = formatDate(new Date(filterToDate))

  //     pdf.setFontSize(10);
  //     pdf.setFont('helvetica', 'normal');

  //     pdf.text(`Filter From Transaction Date: ${fromDate}`, 10, startY + 10, { width: 500, align: 'left' });
  //     pdf.text(`To Transaction Date: ${toDate}`, 10, startY + 20, { width: 500, align: 'left' });

  //     pdf.setFont('times', 'normal');
  //     for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
  //       pdf.setPage(i); // Set the active page
  //       pdf.setFontSize(10); // Set font size for page number

  //       const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
  //       const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;

  //       // Calculate position for center alignment
  //       const xPos = pageCenter - (pageNumberWidth / 2);
  //       const yPos = pdf.internal.pageSize.height - 5; // 10 units from the bottom

  //       pdf.text(pageNumber, xPos, yPos);
  //     }

  //     // Function to format the date as "MM/DD/YYYY"
  //     function formatDate(date) {
  //       const day = date.getDate().toString().padStart(2, '0');
  //       const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //       const year = date.getFullYear();
  //       return `${day}.${month}.${year}`;
  //     }

  //     function formatDates(dateString) {
  //       const date = new Date(dateString);
      
  //       if (isNaN(date.getTime())) {
  //         return 'Invalid Date';
  //       }
      
  //       const day = String(date.getDate()).padStart(2, '0');
  //       const month = String(date.getMonth() + 1).padStart(2, '0');
  //       const year = date.getFullYear();
      
  //       let hour = date.getHours();
  //       const minute = String(date.getMinutes()).padStart(2, '0');
  //       const period = hour >= 12 ? 'PM' : 'AM';
      
  //       // Convert to 12-hour format and update period
  //       if (hour > 12) {
  //         hour -= 12;
  //       } else if (hour === 0) {
  //         hour = 12;
  //       }
      
  //       const formattedTime = `${String(hour).padStart(2, '0')}:${minute} ${period}`;
  //       return `${day}.${month}.${year} ${formattedTime}`;
  //     }
      
  //     pdf.save('Cash_Settlement_Report.pdf');
  //   } else {
  //   }
  // };

  const downloadPDF = async () => {
    const gridApi = gridRef.current && gridRef.current.api;
    const uniqueNationalities = Array.from(new Set(rowData1.map((row) => row.transactiondate)));
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
      const xLogo = 10; // X-coordinate for the logo
      const yLogo = 10; // Y-coordinate for the logo
      const logoHeight = 20;

      let dateY = 20
      let startY = 20;
      const margin = { left: 10, right: 10 };

      pdf.addImage(DASHBOARD_URL+`/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

      // pdf.addImage(Logo, "JPEG", xCenter, 10, logoWidth, logoHeight);
      const currentDate = new Date();
      const formattedDate = formatDates(currentDate);
      const paddingFromRight = 85;
      const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);


      //   // Handle other hotelIds if needed
      const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo, fontsize) => {
        // Set font size and style
        pdf.setFontSize(fontsize);
        pdf.setFont('helvetica', 'normal');

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

        // Draw the text on the pdf
        pdf.text(`${textToCenter}`, textStartX, yLogo); // Adjust the y position as needed
      };

      // Determine the width of the hotel name and address
      const hotelNameWidth = pdf.getStringUnitWidth(hotelName) * 14;
      const hotelAddressWidth = pdf.getStringUnitWidth(hotelAddress) * 12;

      // Set hotel name
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo, 14);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8, 12); // Adjust the y position as needed
      const textToCenter = "Cash Settlement Report";

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
      pdf.setFont('helvetica', 'bold')
      startY = 10;


      uniqueNationalities
        .sort((a, b) => new Date(a) - new Date(b))
        .forEach((transactiondate, index) => {
          const rowsForDate = rowData1
            .filter((row) => row.transactiondate === transactiondate)
            .map((row) => {
              const formattedArrival = formatDate(new Date(row.transactiondate));
              const formattedDeparture = (Moment(String(new Date(row.DateTime))).format('DD.MM.YYYY hh:mm:ss'))
              let formattedTotalAmount = Math.abs(parseFloat(row.base_amount || 0)).toFixed(2);
              formattedTotalAmount = new Intl.NumberFormat('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(formattedTotalAmount);
            
              // Check if there are no decimal points, then add '00' at the end
              if (!formattedTotalAmount.includes('.')) {
                formattedTotalAmount += '.00';
              }
              return {
                ...row,
                transactiondate: formattedArrival,
                base_amount: formattedTotalAmount, // Convert amount to absolute value
              };
            })
            .map((row) => columnDefs.map((column) => row[column.field]));

          const columns = columnDefs.map((column) => column.headerName);

          const tableHeight = 8;
          let currentPage = 1; // Track the current page number

          // Check if the content fits on the current page
          if (startY + tableHeight > pdf.internal.pageSize.height - 20) {
            // Move to the next page if the content exceeds the page height
            pdf.addPage();
            startY = 10; // Reset the Y position for the new page
            currentPage++; // Increment the current page number
          }

          const totalCount = rowsForDate.length;
          pdf.setFont('times', 'bold');

          const formattedArrivalDate = formatDate(new Date(transactiondate));

          pdf.text(`Transaction Date: ${formattedArrivalDate}`, 10, startY + 37, { width: 500, align: 'left' });

          const totalAmount = rowsForDate.reduce((total, row) => {
            const baseAmountValue = parseFloat(row[columnDefs.findIndex(col => col.field === 'base_amount')].replaceAll(',', '')) || 0; // Replace comma and parse to float
            return total + Math.abs(baseAmountValue);
          }, 0).toFixed(2);

          const formattedTotalAmount = new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(totalAmount.replace(',', '')); // Remove commas before formatting

          const totalRow = ['', '', '', '', '', 'Total Amount:', formattedTotalAmount, 'Total Count:', totalCount];

          pdf.autoTable({
            head: [columns],
            body: [...rowsForDate, totalRow],
            startY: startY + 43,
            didParseCell: (data) => {
              if (data.column.index == 6 ) {
                data.cell.styles.halign = 'right';
              }

              if (data.row.raw.some(cellData => typeof cellData === 'string' && cellData.includes('Total'))) { // Assuming 'Grand Total' is in the first column
                data.cell.styles.fillColor = [220, 220, 220]; // Highlighting with a yellow background color
                data.cell.styles.fontStyle = 'bold'; // Making the text bold
              }
              
            }
          });

          startY = pdf.autoTable.previous.finalY - 22;

          const availableSpace = pdf.internal.pageSize.height - startY;

          // Check if the available space is enough for the content
          if (availableSpace < 30) { // Adjust '30' based on your content height
            pdf.addPage(); // Move to the next page
            startY = 10; // Set Y position for the new page
          }

        });

      startY = pdf.autoTable.previous.finalY + 20;

      const availableSpace = pdf.internal.pageSize.height - startY;

      // Check if the available space is enough for the content
      if (availableSpace < 30) { // Adjust '30' based on your content height
        pdf.addPage(); // Move to the next page
        startY = 10; // Set Y position for the new page
      }

      let fromDate = formatDate(new Date(filterFromDate))
      let toDate = formatDate(new Date(filterToDate))

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      pdf.text(`Filter From Transaction Date: ${fromDate}`, 10, startY + 10, { width: 500, align: 'left' });
      pdf.text(`To Transaction Date: ${toDate}`, 10, startY + 20, { width: 500, align: 'left' });

      pdf.setFont('times', 'normal');
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

      // Function to format the date as "MM/DD/YYYY"
      function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
      }

      function formatDates(dateString) {
        const date = new Date(dateString);
      
        if (isNaN(date.getTime())) {
          return 'Invalid Date';
        }
      
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
      
        let hour = date.getHours();
        const minute = String(date.getMinutes()).padStart(2, '0');
        const period = hour >= 12 ? 'PM' : 'AM';
      
        // Convert to 12-hour format and update period
        if (hour > 12) {
          hour -= 12;
        } else if (hour === 0) {
          hour = 12;
        }
      
        const formattedTime = `${String(hour).padStart(2, '0')}:${minute} ${period}`;
        return `${day}.${month}.${year} ${formattedTime}`;
      }
      
      pdf.save('Cash_Settlement_Report.pdf');
    } else {
    }
  };

  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Cashsettlement Report');
  
      const columns = [
        { header: 'Booking ID', key: 'bookingID', width: 15 },
        { header: 'Receipt No', key: 'receiptNumber', width: 15 },
        { header: 'User', key: 'createdBy', width: 20 },
        { header: 'Transaction Date', key: 'transactiondate', width: 20 },
        { header: 'BillNo', key: 'billNoDisplay', width: 20 },
        { header: 'Room No', key: 'roomNumber', width: 15 },
        { header: 'Guest Name', key: 'guestName', width: 30 },
        { header: 'Amount', key: 'base_amount', width: 15 },
        { header: 'Date-Time', key: 'DateTime', width: 20 },
        { header: 'Payment Type', key: 'transactionDescription', width: 20 }
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'Cashsettlement Report']);
      worksheet.addRow(['Filter From Date:', filterFromDate]);
      worksheet.addRow(['To Date:', filterToDate]);
      worksheet.addRow();
      worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
      for (let i = 1; i <= 5; i++) {
        worksheet.getRow(i).font = { bold: true };
      }
  
      worksheet.spliceRows(1, 1);
  
      const formattedData = (rowData1) => {
        return rowData1.map(item => ({
          ...item,
          description: item.description?.replace(/\r?\n|\r/g, '')
        }));
      };
  
      const sanitizedData = formattedData(rowData1);
  
      let totalAmount = 0;
  
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          bookingID: row.bookingID,
          receiptNumber: row.receiptNumber,
          createdBy: row.createdBy,
          transactiondate: row.transactiondate,
          billNoDisplay: row.billNoDisplay,
          roomNumber: row.roomNumber,
          guestName: row.guestName,
          base_amount: row.base_amount,
          DateTime: row.DateTime,
          transactionDescription: row.transactionDescription
        });
        
        totalAmount += row.base_amount ? Math.abs(row.base_amount) : 0;
      });
  
      worksheet.addRow();
      worksheet.addRow({
        bookingID: 'Total',
        base_amount: totalAmount
      }).font = { bold: true };
  
      worksheet.columns.forEach((column, index) => {
        if ([1, 2, 3, 4, 5, 6, 7].includes(index + 1)) {
          column.alignment = { vertical: 'middle', horizontal: 'left' };
        } else {
          column.alignment = { vertical: 'middle', horizontal: 'right' };
        }
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Cashsettlement_Report_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };
  
  
  

  return (
    <div>
      <div>
        <Modal isOpen={ShowDummyInvPDF} toggle={() => setShowDummyInvPDF(!ShowDummyInvPDF)} style={{ height: '200px' }} className='modal-dialog-centered modal-lg'>
          <ModalHeader className='bg-transparent' toggle={() => setShowDummyInvPDF(!ShowDummyInvPDF)}>PMS Dummy Invoice</ModalHeader>

          <iframe style={{ height: '85vh' }} src={DummyInvURL}> </iframe>
        </Modal>
      </div>

      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Cashsettlement report </CardTitle>
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
                        className={classnames("form-control", {
                        })}
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
                        required
                        // options={optionsToDate}
                        options={{ allowInput: true }}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <div className='d-flex'>
                <Button className='me-1 ms-auto' color='primary' type='submit' onClick={() => setflag1(true)} disabled={isButtonClicked}>
                {isButtonClicked ? 'Processing...' : 'Submit'}
                </Button>
                <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                  Reset
                </Button>
                {/* <Button className='me-1' color='primary' onClick={onButtonExport}>
                  Download Excel
                </Button> */}
                <Button
              className='me-1'
              color='primary'
              onClick={generateExcel}
            >
              Download Excel
              </Button>
                <Button className='me-1' color='primary' onClick={downloadPDF}>
                  Print PDF
                </Button>

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
      {flag == true && <div className="ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={rowDataWithTotal}
          columnDefs={columnDefs}
          groupDisplayType={groupDisplayType}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          domLayout='autoHeight'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"

        />
      </div>}

    </div>
  )
}


export default CashsettlementReport