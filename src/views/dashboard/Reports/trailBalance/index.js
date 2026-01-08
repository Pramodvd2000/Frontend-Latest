import { useState } from 'react'
import { selectThemeColors } from "@utils";
import Select from "react-select";
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Table } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { AgGridReact } from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import { useRef, useEffect, useMemo, useCallback } from 'react';
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import DASHBOARD_URL from '../../../../dashboard'
import 'ag-grid-enterprise';
import Moment from 'moment';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const defaultValues = {
  frmdate: ''
}

const VaccantRooms = () => {
  const [rowData1, setRowData1] = useState();
  const [floorOptions, setFloorOptions] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [data, setData] = useState(null)
  const [hotelDetails, setHotelDetails] = useState()
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  


  const { reset, handleSubmit, control } = useForm({ defaultValues })
  let navigate = useNavigate();
  const gridRef = useRef();
  
  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Floor', field: 'floorID', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Room Number', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Room Type', field: 'roomType', suppressSizeToFit: true, maxWidth: 160 },
    { headerName: 'Room Status', field: 'roomStatus', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'FO Status', field: 'frontOfficeStatus', suppressSizeToFit: true, maxWidth: 180 },
    { headerName: 'Reservation Status', field: 'reservationStatus', suppressSizeToFit: true, maxWidth: 180 },
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


  useEffect(() => {
    const hotelIDData = JSON.stringify({
      hotelID: 1
    })
    fetchx(DASHBOARD_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelIDData
    }).then((res) => res.json())
      .then(postres => {
        if (postres.statusCode === 200) {
          setHotelDetails(postres.data)
        }
      })
  }, []);



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

  const onSubmit = data => {
    if (data.fromDate === null || data.fromDate === undefined) {
      handleError("Please select a date.");
      return;
    } 
    else {
    setIsButtonClicked(true)
    setOpen(true)
    }
    setData(data)
    let createmarketGroup = JSON.stringify({
      "hotelID": 1,
      "date": (Moment(String(new Date(data.fromDate[0]))).format('YYYY-MM-DD'))
    })
    let res = fetchx(DASHBOARD_URL + "/getTrialBalance", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then(data => data.json())
      .then((res) => {
        setIsButtonClicked(false)
        if(res['statusCode']==200) {
          setOpen(false)
        setRowData1(res["data"])
        }
        // if(res.statuscode === 403 || res.statusCode === 403) {
        //   setOpen(false)
        //   handleError("Data is not available for the selected date");
        //   return;        }

        if(res.statuscode === 403 || res.statusCode === 403) {       
          setOpen(false)   
          let message = res['message'];
          if (!message || 
              (typeof message === 'object' && Object.keys(message).length === 0) || 
              (Array.isArray(message) && message.length === 0)) {
            message = 'Data is not available for the selected date';
          }
        
          const swalInstance = MySwal.fire({
            text: message,
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-danger',
            },
          });
        
          swalInstance.then((result) => {
            if (result.isConfirmed) {
              // Additional actions can be handled here if necessary
            }
          });
        }
      });
  }

  const handleReset = () => {
    reset({
      companyID: ''
    })
  }



  function formatDateTimeWithAMPM(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12) || 12; // Convert to 12-hour format
    const formattedHours = hours.toString().padStart(2, '0');

    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}.${month}.${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  }


const printGrid = (data) => {
  if (!rowData1) {
    // Handle case when data is not available
    return;
  }

  const pdf = new jsPDF({ orientation: 'landscape' });
  let fromDate = Moment(String(new Date(data.fromDate[0]))).format('DD.MM.YYYY');

  const pageWidth = pdf.internal.pageSize.getWidth();
        const logoWidth = 20;
        const xLogo = 10; // X-coordinate for the logo
        const yLogo = 10; // Y-coordinate for the logo
        const logoHeight = 20;
        let dateY = 20;

  const hotelName = hotelDetails[0].name.toUpperCase();
  const hotelCity = hotelDetails[0].city.toUpperCase();
  const hotelAddress = hotelDetails[0].address.toUpperCase();

 

  pdf.addImage(Logo, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

  const margin = { left: 10, right: 10 };
  const currentDate = new Date();
  const formattedDate = formatDateTimeWithAMPM(currentDate);
  const paddingFromRight = 85;
  const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  const hotelNameX = xLogo + logoWidth + 108; // Adjust as needed for spacing
  pdf.text(`${hotelName}`, hotelNameX, yLogo + 3);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const hotelAddressX = xLogo + logoWidth + 60; // Adjust as needed for spacing
  pdf.text(`${hotelAddress}`, hotelAddressX, yLogo + 9);
  
  const textToCenter = "Trail Balance Report";

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
  let tableY = 10; // Initialize tableY

  // Define columns to show for each sectionKey
  const columnsToShowMap = {

    "BalanceBroughtForward": [
      { header: "Balance Brought Forward", key: "GuestLedger Yesterday" }
    ],
    "Revenue": [
      { header: "Transaction Code", key: "transactionCode" },
      { header: "Description", key: "description" },
      { header: "Revenue", key: "revenue" },
    ],
    "Allowance": [
      { header: "Transaction Code", key: "transactionCode" },
      { header: "Description", key: "description" },
      { header: "Revenue", key: "revenue" },
    ],
    "PaidOuts": [
      { header: "Transaction Code", key: "transactionCode" },
      { header: "Description", key: "description" },
      { header: "Revenue", key: "revenue" },
    ],
    "RoundOff": [
      { header: "Transaction Code", key: "transactionCode" },
      { header: "Description", key: "description" },
      { header: "Revenue", key: "revenue" },
    ],
    "Tips": [
      { header: "Transaction Code", key: "transactionCode" },
      { header: "Description", key: "description" },
      { header: "Revenue", key: "revenue" },
    ]
    , "NonRevenue": [
      { header: "Tax Code", key: "taxCode" },
      { header: "Tax Name", key: "taxName" },
      { header: "Tax Amount", key: "taxAmount" },
    ],
    "Payments": [
      { header: "Transaction Code", key: "transactionCode" },
      { header: "Description", key: "description" },
      { header: "Revenue", key: "revenue" },
    ],
    "GuestLedger": [
      { header: "Balance Brought Forward", key: "GuestLedgerYesterday" },
      { header: "Charges", key: "Charges" },
      { header: "Debits", key: "Debits" },
    ],
    // Add more sections as needed
  };

  let startNewPage = false;

// Add this function to format the sectionKey
function formatSectionKey(sectionKey) {
  switch (sectionKey) {
    case 'BalanceBroughtForward':
      return 'Balance Brought Forward';
    case 'PaidOuts':
      return 'Paid Outs';
      case 'NonRevenue':
        return 'Non Revenue';
    case 'RoundOff':
      return 'Round Off';
    case 'GuestLedger':
      return 'Guest Ledger Today';
    // Add more cases as needed
    default:
      return sectionKey;
  }
}
Object.keys(rowData1).forEach((sectionKey, index) => {
  if (rowData1[sectionKey] && Array.isArray(rowData1[sectionKey]) && rowData1[sectionKey].length > 0) {
    pdf.setFont('times', 'bold');

    // Calculate the space required for the table and text
    const spaceRequired = pdf.getTextDimensions(sectionKey.toUpperCase(), { fontSize: 12 }).h;
    let spaceForTable = 0;

    // Check if there is enough space for the table and text on the current page
    if (pdf.internal.pageSize.height - dateY < spaceRequired) {
      // Move to the next page
      dateY = 10; // Reset Y position for the new page
      tableY = 10; // Reset tableY for the new page

      pdf.addPage();

      // After adding a new page, set the starting Y position for the section
      // const sectionDate = rowData1[sectionKey][0].date; // Assuming the date is the same for all entries in a section

      
      // pdf.text(sectionDate !== undefined ? `Date: ${sectionDate}` : '', 283, tableY, { align: 'right' });

      // Add table
      tableY += 40; // Adjust for the space between title and table

      // Check if there is enough space for the section title on the new page
      const remainingSpace = pdf.internal.pageSize.height - tableY;
      if (remainingSpace < spaceRequired + 14) {
        // If not enough space, move to the next page
        tableY = 10; // Reset tableY for the new page
        pdf.addPage();
      }

      // Set the starting Y position for the section
      pdf.setFont('times', 'bold');
      pdf.text(formatSectionKey(sectionKey).toUpperCase(), 15, tableY + 13, { width: 500, align: 'left' });
      console.log(sectionKey)
    } 
    else {
      // Calculate space required for the table
      spaceForTable = pdf.autoTable.headHeight + (pdf.autoTable.body ? pdf.autoTable.body.length : 0) * pdf.autoTable.rowHeight;

      // const sectionDate = rowData1[sectionKey][0].date; // Assuming the date is the same for all entries in a section

      const balanceBroughtForwardSection = rowData1['BalanceBroughtForward'];
// if (balanceBroughtForwardSection && balanceBroughtForwardSection.length > 0) {
//   console.log("In side")
    // const sectionDate = balanceBroughtForwardSection[0].date; // Assuming the date is the same for all entries in the section
    // pdf.text(sectionDate !== undefined ? `Date: ${sectionDate}` : '', 283, tableY, { align: 'right' });
// }
      // Add table
      tableY += 40; // Adjust for the space between title and table

      // Check if there is enough space for the section title on the current page
      const remainingSpace = pdf.internal.pageSize.height - tableY;
      console.log(remainingSpace , spaceRequired)
      if (remainingSpace < spaceRequired +14) {
        console.log("Came inside of add page")
        // If not enough space, move to the next page
        tableY = 10; // Reset tableY for the new page
        pdf.addPage();
      }

      // Set the starting Y position for the section
      pdf.setFont('times', 'bold');
      pdf.text(formatSectionKey(sectionKey).toUpperCase(), 15, tableY + 5, { width: 500, align: 'left' });
      console.log(sectionKey)

    }


    // Get the columns to show based on the sectionKey
    const columnsToShow = columnsToShowMap[sectionKey] || [];

    // Map the columns to their corresponding header and key
    const tableHeaders = columnsToShow.map(column => column.header);
    let headersToShow = columnsToShow.map(column => column.header);

    let dataToShow = rowData1[sectionKey].map(row =>
      columnsToShow.reduce((obj, column) => {
        const rawValue = row[column.key];
        obj[column.header] = column.key === 'revenue' || column.key === 'taxAmount'
          ? parseFloat(rawValue).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : rawValue;
        return obj;
      }, {})
    );

    // Add total row for Revenue, Allowance, PaidOuts, RoundOff, Tips, and Payments sections
    if (sectionKey === 'Revenue' || sectionKey === 'Allowance' || sectionKey === 'PaidOuts' || sectionKey === 'RoundOff' || sectionKey === 'Tips' || sectionKey === 'Payments') {
      let totalRevenue = 0;

      rowData1[sectionKey].forEach((row) => {
        totalRevenue += row.revenue || 0;
      });

      const formattedTotalRevenue = totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      const totalRow = ['','Total', formattedTotalRevenue, '', '', '']; // Start directly with the total revenue value at index 0

      // Define the table properties
      const tableProps = {
        head: [tableHeaders],
        body: [...dataToShow.map(row => headersToShow.map(header => String(row[header]).trim())), totalRow],
        startY: tableY + 6, //15
        didParseCell: (data) => {
          if (data.column.index == 2) {
            data.cell.styles.halign = 'right';
          }
          const isTotalRow = data.row.index !== null && data.row.index !== undefined && data.row.index === data.table.body.length - 1;
          if (isTotalRow) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = '#d3d3d3'; // Light grey color
          }
        }
      };

      // Add the table using addTable method
      pdf.autoTable(tableProps);
      tableY = pdf.autoTable.previous.finalY - 34; // Adjust the value as needed, reducing the space after the table
      tableY += 5; // Add a small space between table headers and table body

      dateY = tableY;

    } else if (sectionKey === 'NonRevenue') {
      // For NonRevenue section, calculate total of taxAmount key
      const totalRow = ['','Total', '', '', '', '', '', ''];
      let totalTaxAmount = 0;

      rowData1[sectionKey].forEach((row) => {
        totalTaxAmount += row.taxAmount || 0;
      });

      totalRow[2] = totalTaxAmount.toFixed(2); // Assuming taxAmount is at index 4

      // Define the table properties
      const tableProps = {
        head: [tableHeaders],
        body: [...dataToShow.map(row => headersToShow.map(header => String(row[header]).trim())), totalRow],
        startY: tableY + 6, //15
        didParseCell: (data) => {
          if (data.column.index == 2) {
            data.cell.styles.halign = 'right';
          }
          const isTotalRow = data.row.index !== null && data.row.index !== undefined && data.row.index === data.table.body.length - 1;
          if (isTotalRow) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = '#d3d3d3'; // Light grey color
          }
        }
      };

      // Add the table using addTable method
      pdf.autoTable(tableProps);
      tableY = pdf.autoTable.previous.finalY - 34; // Adjust the value as needed, reducing the space after the table
      tableY += 5; // Add a small space between table headers and table body

      dateY = tableY + 15;
    } else if (sectionKey === 'GuestLedger') {
      let totalGuestLedgerToday = 0;

      dataToShow = rowData1[sectionKey].map(row => {
        const guestLedgerToday = row['GuestLedger Yesterday'] + row.Charges + row.Debits;
        totalGuestLedgerToday += guestLedgerToday;

        return {
          ...row,
          'GuestLedger Today': guestLedgerToday.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        };
      });

      const formattedTotalGuestLedgerToday = totalGuestLedgerToday.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      // const totalRowGuestLedgerToday = ['', '', '                                                                                                    ', '', '', '','', '','', '','', '','', '','', '', 'Guest Ledger', '','', '','', '                                                                                                          ', formattedTotalGuestLedgerToday];
      const totalRowGuestLedgerToday = ['Guest Ledger Today', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '','', '','', '','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', formattedTotalGuestLedgerToday];
      // Define the table properties
      const tableProps = {
        head: sectionKey === 'GuestLedger' ? [] : [tableHeaders],
        body: sectionKey === 'GuestLedger' ? [...dataToShow.map(row => totalRowGuestLedgerToday)] : [...dataToShow.map(row => headersToShow.map(header => String(row[header]).trim())), totalRowGuestLedgerToday],
        startY: tableY + 6, //15
        didParseCell: (data) => {
          if (data.column.index == 2) {
            data.cell.styles.halign = 'right';
          }
          data.cell.styles.fillColor = '#d3d3d3'; // Light grey color
          if (data.row.index !== null && data.row.index !== undefined) {
            data.cell.styles.fontStyle = 'bold';
          }
   
        }
      };

      // Add the table using addTable method
      pdf.autoTable(tableProps);
      tableY = pdf.autoTable.previous.finalY - 34; // Adjust the value as needed, reducing the space after the table
      tableY += 5; // Add a small space between table headers and table body

      dateY = tableY;
    } else {
      // For other sections, use the existing code to add the table
      // Define the table properties

      pdf.text(`Date: ${fromDate}`, 283, tableY, { align: 'right' });
      const tableProps = {
        // head: [tableHeaders],
        // body: [ ["", '','','','','','','                              ','                           ','','','','','','','','','','Balance Brought Forward','','','',String(dataToShow[0][headersToShow[0]]).trim()]],
        body: [ ["Balance Brought Forward", '','', '','', '','','','','','','                                                                                                     ','','','','','','','','','','','','','','',String(dataToShow[0][headersToShow[0]]).trim()]],
        startY: tableY + 6, //15
        didParseCell: (data) => {
         
          data.cell.styles.fillColor = '#d3d3d3'; // Light grey color
          if (data.row.index !== null && data.row.index !== undefined) {
            data.cell.styles.fontStyle = 'bold';
          }
   
        }
      };
      console.log(dataToShow.map(row => headersToShow.map(header => String(row[header]).trim())))
      // Add the table using addTable method
      pdf.autoTable(tableProps);
      tableY = pdf.autoTable.previous.finalY - 34; // Adjust the value as needed, reducing the space after the table
      tableY += 5; // Add a small space between table headers and table body

      dateY = tableY;
    }
  }
});

// Add page numbers for each page
for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
  pdf.setPage(i);
  pdf.setFont('times', 'normal');
  pdf.text(`Page ${i} of ${pdf.internal.getNumberOfPages()}`, pageWidth / 2, pdf.internal.pageSize.height - 5, { align: 'center' });
 

  if (i === pdf.internal.getNumberOfPages()) {
    // Add other filter information as needed
    pdf.setFont('times', 'normal');

    // Display Date
    const dateTextOptions = { width: 500, align: 'left' };
    const dateTextHeight = pdf.getTextDimensions(`Date: ${fromDate}`, dateTextOptions).h;

    if (pdf.internal.pageSize.height - 40 - dateTextHeight > 0) {
      pdf.text(`Date: ${fromDate}`, 15, pdf.internal.pageSize.height - 40, dateTextOptions);
    } else {
      // Move to the next page and display Date
      pdf.text(`Date`, 15, pdf.internal.pageSize.height - 60, 'dateTextOptions');
      pdf.addPage();
      pdf.text(`Date page1: ${fromDate}`, 15, pdf.internal.pageSize.height - 40, dateTextOptions);
    }

    // Display Filter
    const filterTextOptions = { width: 500, align: 'left' };
    const filterTextHeight = pdf.getTextDimensions('Filter:', filterTextOptions).h;

    if (pdf.internal.pageSize.height - 50 - filterTextHeight > 0) {
      pdf.text('Filter:', 15, pdf.internal.pageSize.height - 50, filterTextOptions);
    } else {
      // Move to the next page and display Filter
      pdf.addPage();
      pdf.text(`Date page13: ${fromDate}`, 15, pdf.internal.pageSize.height - 40, dateTextOptions);
      pdf.text('Filter:', 15, pdf.internal.pageSize.height - 50, filterTextOptions);
    }
  }
}

pdf.save('Trail Balance Report.pdf');



};


  // Define the columns you want to display for each section
  const allowedColumns = {
    BalanceBroughtForward: ['GuestLedger Yesterday'],
    Revenue: ['date', 'transactionCode', 'description', 'revenue'],
    Allowance: ['date', 'transactionCode', 'description', 'revenue'],
    PaidOuts: ['date', 'transactionCode', 'description', 'revenue'],
    RoundOff: ['date', 'transactionCode', 'description', 'revenue'],
    Tips: ['date', 'transactionCode', 'description', 'revenue'],
    NonRevenue: ['date', 'taxCode', 'taxName', 'taxAmount', "createdAt", "modifiedAt", "createdBy"],
    Payments: ['date', 'transactionCode', 'description', 'revenue'],
    GuestLedger: ['GuestLedger Yesterday', 'Charges', 'Debits'],
    // Add more sections as needed with their respective allowed columns
  };



  const sectionDisplayNames = {
    BalanceBroughtForward:'Balance Brought Forward',
    Revenue: 'Revenue',
    Allowance: 'Allowance',
    PaidOuts: 'Paid Outs',
    RoundOff: 'Round Off',
    Tips: 'Tips',
    NonRevenue: 'Non Revenue',
    Payments: 'Payments',
    GuestLedger: 'Guest Ledger Today',
    // Add more section display names as needed
  };

  // Define a mapping for column display names
  const columnDisplayNames = (sectionKey) => ({
    date: 'Date',
    transactionCode: 'Transaction Code',
    description: 'Description',
    revenue: 'Revenue',
    taxCode: 'Tax Code',
    taxName: 'Tax Name',
    taxAmount: 'Tax Amount',
    createdAt: 'Created At',
    modifiedAt: 'Modified At',
    createdBy: 'Created By',
    Charges:"Charges",
    Debits:"Debits",
    // 'GuestLedger Yesterday': 'Guest Ledger'
    'GuestLedger Yesterday': sectionKey === 'BalanceBroughtForward' ? 'Balance Brought Forward' : 'Guest Ledger',
    // Add more column display names as needed
  });


  const formatDecimal = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // Add commas for thousands separator
    }
    return value;
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Trail Balance Report</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="fromDate">
                    From Date
                  </Label>
                  <Controller
                    control={control}
                    id="fromDate"
                    name="fromDate"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        required
                        // value={data1['dob']}
                        // options={doboptions}
                        options={{ allowInput: true }}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                          // 'is-invalid': data !== null && data.dob === null
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <div align="end" className="buttons">
                <Button className='me-1' color='primary' type='submit' disabled={isButtonClicked}>
                {isButtonClicked ? 'Processing...' : 'Submit'} 
                </Button>
                <Button className='me-1' outline color='secondary' type='reset' onClick={handleReset}>
                  Reset
                </Button>
                {/* <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button> */}
                <Button className='me-1' color='primary' onClick={() => printGrid(data)}>Print PDF </Button>
              </div>
            </Row>
          </Form>
        </CardBody>
      </Card>


      {rowData1 &&
        Object.keys(rowData1).map((sectionKey, index) => {
          const sectionDisplayName = sectionDisplayNames[sectionKey] || sectionKey;
          const sectionColumnDisplayNames = columnDisplayNames(sectionKey);

          return (
            <div key={index} style={{ marginBottom: '20px' }}>
              <h4 style={{ textDecoration: 'underline' }}>{sectionDisplayName}</h4>
              {allowedColumns[sectionKey] && rowData1[sectionKey] && Array.isArray(rowData1[sectionKey]) && rowData1[sectionKey].length > 0 ? (
                <Table className="m-0" style={{ width: '100%' }} bordered responsive>
                  <thead style={{ marginBottom: '10px', marginTop: '10px' }}>
                    <tr>
                      {allowedColumns[sectionKey].map((column, columnIndex) => (
                        <th key={columnIndex}>{sectionColumnDisplayNames[column]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rowData1[sectionKey].map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {allowedColumns[sectionKey].map((column, columnIndex) => (
                          <td key={columnIndex} style={{ textAlign: column === 'revenue' ? 'right' : 'left' }}>
                            {column === 'revenue' || column === 'taxAmount' ? formatDecimal(row[column]) : row[column]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                allowedColumns[sectionKey] && rowData1[sectionKey] && Array.isArray(rowData1[sectionKey]) ? (
                  <p>No data available for {sectionDisplayName}</p>
                ) : (
                  <p>Data not available for {sectionDisplayName}</p>
                )
              )}
            </div>
          );
        })}
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

    </div>
  )
}

export default VaccantRooms