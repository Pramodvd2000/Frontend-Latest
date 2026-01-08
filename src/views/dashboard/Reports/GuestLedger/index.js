import { useState } from "react";
import "cleave.js/dist/addons/cleave-phone.us";
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Moment from 'moment'
import 'ag-grid-enterprise'
import Logo from "../oterra.jpg";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import { useForm, Controller } from 'react-hook-form'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useRef, useEffect, useMemo, useCallback} from 'react';
import DASHBOARD_URL from "../../../../dashboard";
import {Button,Card, CardHeader, CardTitle,  Row, Col, Input, Form, Label, CardBody, } from 'reactstrap'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


const GuestLedger = () => {
  const [data, setData] = useState(null);
  const [rowData, setRowData] = useState();
  const [Today,setToday] = useState()
  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null); 
  let defaultValues = {  Date: [Moment((new Date(Today))).subtract(1, 'days').format('YYYY-MM-DD')], } 
  const gridRef = useRef();
  const {  handleSubmit, control } = useForm({ defaultValues })
  const [details, setDetails] = useState("");
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [filterFromDate, setFilterFromDate] = useState(null);




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
      setFilterFromDate(rowData['data'][0].businessDate)
      sethotelAddress(rowData['data'][0].address)
      setHotelName(rowData['data'][0].name)
      setToday(rowData['data'][0].businessDate)
      setHotelNo(rowData['data'][0]['phoneNumber'])
      sethotelFax(rowData['data'][0]['fax'])
      setLogo(rowData['data'][0]['logo'])
    })

//     // fetchx(DASHBOARD_URL + '/getinventory?hotelID=1')
//     fetchx(DASHBOARD_URL+'/getGuestLedgerForDay?hotelID=1&date='+Moment(new Date(Today)).subtract(1, 'days').format('YYYY-MM-DD'))
//     console.log(Today)
//     .then(result => result.json())
//     .then(rowData =>{
//       // for(let i=0; i<10;i++){
//       console.log(rowData['data'])

// console.log(rowData['data'])
// setRowData(rowData['data'])
//     }
//     )

setOpen(true)
      
    fetchx(DASHBOARD_URL+'/getGuestLedgerForDay', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 10,
        date: '2023-12-10'
          })
    }).then(result => result.json())
    .then(resp => {
      if(resp['statusCode'] == 200) {
        setOpen(false)
             setDetails(resp['data'].summary)
            setRowData(resp['data'].Brief)
      }
      }).catch((error) => {
        // console.log(error)
      })
    
  }, []);

 
  function formatNumbers(params) {
    var number = params.value;
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

const CustomHeaderComponentTotalCgst= () => {
  return (
    <div>
       CGST
    </div>
  );
};

const CustomHeaderComponentTotalSgst= () => {
  return (
    <div>
       SGST
    </div>
  );
};

  const [columnDefs, setColumnDefs] = useState([
    {headerName: 'BookingID',field: 'CheckInID',maxWidth: 120},
    {headerName: 'Room No.',field: 'roomNumber',maxWidth: 120},
    {headerName: 'Transaction Details',field: 'TransactionDetails'},
    {headerName: 'Guest Name',field: 'guestName', wrapText: true, autoHeight: true },
    {headerName: 'Department',field: 'Department'},
    {headerName: 'SubTotal',field: 'SubTotal',maxWidth: 120,valueFormatter: formatNumbers},
    {headerName: 'CGST',field: 'CGST',maxWidth: 100 , aggFunc: 'sum',valueFormatter: formatNumbers,headerComponentFramework: CustomHeaderComponentTotalCgst},
    {headerName: 'SGST',field: 'sgst',maxWidth: 100 , aggFunc: 'sum',valueFormatter: formatNumbers,headerComponentFramework: CustomHeaderComponentTotalSgst},
    {headerName: 'Total',field: 'Total',maxWidth: 140,valueFormatter: formatNumbers},
    {headerName: 'Company',field: 'Company', wrapText: true, autoHeight: true },
    {headerName: 'Remarks',field: 'remarks',width:300, wrapText: true, autoHeight: true },
    {headerName: 'Arrival',field: 'arrivalDate',maxWidth: 130,
    cellRenderer: (params) => {
      if (params.data && params.data.arrivalDate) {
        const formattedDate = Moment(params.data.arrivalDate).format("DD.MM.YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    } },
    {headerName: 'Departure',field: 'departureDate',maxWidth: 130,
    cellRenderer: (params) => {
      if (params.data && params.data.departureDate) {
        const formattedDate = Moment(params.data.departureDate).format("DD.MM.YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    } },
    {headerName: 'Room Type',field: 'roomType',maxWidth: 130},
    {headerName: 'Status',field: 'reservationStatus',maxWidth: 130},
    {headerName: 'DateTime',field: 'Date',cellRenderer: (params) => {
      if (params.data && params.data.Date) {
        const formattedDate = Moment(params.data.Date).format("DD.MM.YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    } },
    {headerName: 'billNo',field: 'billNo',maxWidth: 130},
    {headerName: 'InvoiceDate',field: 'invoiceDate',maxWidth: 130},
    ]);


    const totalRow = {
      Department: "Total",
      SubTotal: "sum",
      CGST: "sum",
      sgst: "sum",
      Total: "sum",
      ADR: "sum",
    };
  
  // Check if rowData is defined and it is an array before performing reduce operation
const totalValues = Array.isArray(rowData)
  ? rowData.reduce(
      (total, current) => {
        total.SubTotal += current.SubTotal || 0;
        total.CGST += current.CGST || 0;
        total.sgst += current.sgst || 0;
        total.Total += current.Total || 0;
        // total.ADR += current.ADR || 0;
        return total;
      },
      {
        SubTotal: 0,
        CGST: 0,
        sgst: 0,
        Total: 0,
        // ADR: 0,
      }
    )
  : {
      SubTotal: 0,
      CGST: 0,
      sgst: 0,
      Total: 0,
      // ADR: 0,
    };

    const fixedDecimalPlaces = 2; // Specify the number of decimal places you want

    totalRow.SubTotal = totalValues.SubTotal.toFixed(fixedDecimalPlaces);
    totalRow.CGST = totalValues.CGST.toFixed(fixedDecimalPlaces);
    totalRow.sgst = totalValues.sgst.toFixed(fixedDecimalPlaces);
    totalRow.Total = totalValues.Total.toFixed(fixedDecimalPlaces);
   
    const updatedRowData = Array.isArray(rowData) ? [...rowData, totalRow] : [totalRow];

  const defaultColDef = useMemo( ()=> (
    {
      sortable: true, 
      filter: true,
      wraptext:true,
      filterParams :{
      buttons : ['apply','reset']
      }
    }
  ));
 
  const ConfirmSubmit = (data) => {

    setIsButtonClicked(true)
    setOpen(true)
    setData(data)
    // data.Date=(Moment(String(new Date(data.frmdate[0]))).format('YYYY-MM-DD'))
    const filterFromDate = Moment(data.frmdate[0]).format("YYYY-MM-DD");
    setFilterFromDate(filterFromDate);

fetchx(DASHBOARD_URL+'/getGuestLedgerForDay', {
  method: "POST",
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    hotelID: 10,
    date: Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD")
      })
}).then(result => result.json())
.then(resp => {
  setIsButtonClicked(false)
  if(resp['statusCode'] == 200) {
    setOpen(false)
  setDetails(resp['data'].summary)
    setRowData(resp['data'].Brief)
  }
  }).catch((error) => {
  })


  }

  const cellClickedListener = useCallback( event => {
    console.log('cellClicked', event);
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);

  const onBtnExport = () => {
    const params = {
      fileName: 'Guest Ledger Report.xlsx',
      sheetName: 'Sheet1',
    };
    gridRef.current.api.exportDataAsExcel(params);
  };

  const printGrid = () => {
    const gridApi = gridRef.current && gridRef.current.api;
  
    if (gridApi) {
      const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
      const headerRow = rowData.substring(0, rowData.indexOf('\n'));
      const cleanHeaderRow = headerRow.replace(/"/g, '');
      const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
      const cleanData = dataRows.replace(/"/g, '');
      const rows = cleanData.split('\n').map(row => row.split(','));
     const pdf = new jsPDF({ orientation: 'landscape' });
  
      // Calculate center for the logo
  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const logoWidth = 15;
  //     const xCenter = (pageWidth - logoWidth) / 2;
  //     // Add logo
  //     const logoHeight = 15;
  //     pdf.addImage(Logo, 'JPEG', xCenter, 10, logoWidth, logoHeight); 
  //     pdf.setFontSize(12);
  //     pdf.setFont('helvetica', 'bold');
  //     pdf.text(`${hotelName}`, 135, 33);
  //     pdf.text(`${hotelAddress}`, 100, 39);
  //     pdf.text('Guest Ledger  Report', 120, 45);   
      
    
  // // Add current date to the right top corner
  // let dateY = 10;
  // const margin = { left: 10, right: 10 };
  // const currentDate = new Date();
  // const formattedDate = formatDates(currentDate);
  // const paddingFromRight = 100;

  // // const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) * 12 - 10; // Adjust the X coordinate as needed
  // const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;

  // pdf.text("Report Generated Time " + formattedDate, dateX, dateY);
  // const pageCenter = pdf.internal.pageSize.width / 2;
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
  
  pdf.addImage(DASHBOARD_URL+`/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

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
  const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo,fontSize) => {
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
  setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo,14);
  setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8,12); 
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  const textToCenter = "Guest Ledger  Report";

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

  // pdf.text(formattedDate, dateX, dateY);
    
  // Function to format the date as "MM/DD/YYYY"
  pdf.setFontSize(10);
  pdf.setFont('times', 'bold');  
  pdf.text(`Summary:`, 10, 48);
  pdf.text(`Room Revenue ` , 20, 60);
  pdf.text(`FNB Revenue `  , 70, 60);
  pdf.text(`Other Revenue` ,120, 60);
  pdf.text(`Payments`      ,190, 60);
  pdf.text(`Ledger Balance`,240, 60);

  const fixedDecimalPlace = 2;

  pdf.text(`${details[0].room_revenue.toLocaleString("en-IN", { minimumFractionDigits: fixedDecimalPlace, maximumFractionDigits: fixedDecimalPlace })} `, 20, 66);
  pdf.text(`${details[0].f_b_revenue.toLocaleString("en-IN", { minimumFractionDigits: fixedDecimalPlace, maximumFractionDigits: fixedDecimalPlace })} `, 70, 66);
  pdf.text(`${details[0].other_revenue.toLocaleString("en-IN", { minimumFractionDigits: fixedDecimalPlace, maximumFractionDigits: fixedDecimalPlace })} `, 120, 66);
  pdf.text(`${details[0].payments.toLocaleString("en-IN", { minimumFractionDigits: fixedDecimalPlace, maximumFractionDigits: fixedDecimalPlace })} `, 190, 66);
  pdf.text(`${details[0].ledger_balance.toLocaleString("en-IN", { minimumFractionDigits: fixedDecimalPlace, maximumFractionDigits: fixedDecimalPlace })}`, 240, 66);


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

   function formatDateString(dateString) {
    const inputDate = new Date(dateString);
    const formattedDate = new Date(inputDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return formattedDate;
  }

  
    const columnStyles = {
      0: { columnWidth: 12 }, // Adjust the width as needed for each column
      1: { columnWidth: 12 },
      2: { columnWidth: 16 },
      3: { columnWidth: 16 },
      4: { columnWidth: 18 },
      5: { columnWidth: 18 },
      6: { columnWidth: 18 },
      7: { columnWidth: 18 },
      8: { columnWidth: 18 },
      9: { columnWidth: 18 },
     10: { columnWidth: 16 }, 
     11: { columnWidth: 16 },
     12: { columnWidth: 18 },
     13: { columnWidth: 14 },
     14: { columnWidth: 16 },
     15: { columnWidth: 16 },
     16: { columnWidth: 14 },
    //  17: { columnWidth: 12 },
    };
    // const filteredColumns = columns.filter(columnName => columnName !== 'CheckInID');
    const headerRowArray = cleanHeaderRow.split(',').map(value => value.trim());
    const filteredHeaderRowArray = headerRowArray.slice(1); // Exclude the first column
  
    const bodyRowsArray = rows.map(row => row.slice(1)); // Exclude the first column from each row
  
      // Add table
      pdf.autoTable({
        // head: [cleanHeaderRow.split(',').map(value => value.trim())], 
        head: [filteredHeaderRowArray],
        body: bodyRowsArray,

        // body: rows.map(row => row.map(value => value.trim())), 
        startY: 70, 
        columnStyles
      });

      for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
        pdf.setPage(i); // Set the active page
        pdf.setFontSize(10); // Set font size for page number
        
        const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
        const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        
        // Calculate position for center alignment
        const xPos = pageCenter - (pageNumberWidth / 2);
        const yPos = pdf.internal.pageSize.height - 10; // 10 units from the bottom
        
        pdf.text(pageNumber, xPos, yPos);
      }
        pdf.save('Guest Ledger Report.pdf');
    } else {
    }
  };

  const generateExcel = () => {
    if (filterFromDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Guest Ledger Report');
  
      const columns = [
        { header: 'BookingID', key: 'CheckInID', width: 20 },
        { header: 'Room No.', key: 'roomNumber', width: 12 },
        { header: 'Transaction Details', key: 'TransactionDetails', width: 35 },
        { header: 'Guest Name', key: 'guestName', width: 30 },
        { header: 'Department', key: 'Department',width: 30},
        { header: 'SubTotal', key: 'SubTotal', width: 20 },
        { header: 'CGST', key: 'CGST', width: 20,},
        { header: 'SGST', key: 'sgst', width: 20, },
        { header: 'Total', key: 'Total', width: 20,},
        { header: 'Company', key: 'Company', width: 30 },
        { header: 'Remarks', key: 'remarks', width: 30 },
        { header: 'Arrival', key: 'arrivalDate', width: 20 },
        { header: 'Departure', key: 'departureDate', width: 20 },
        { header: 'Room Type', key: 'roomType', width: 10 },
        { header: 'Status', key: 'reservationStatus', width: 20 },
        { header: 'DateTime', key: 'Date',width:20 },
        { header: 'billNo', key: 'billNo', width: 20 },
        { header: 'InvoiceDate', key: 'invoiceDate', width: 10 }
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'Guest Ledger Report']);
      worksheet.addRow(['Filter From Date:', filterFromDate]);
      worksheet.addRow();
      worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
      for (let i = 1; i <= 5; i++) {
        worksheet.getRow(i).font = { bold: true };
      }
  
      worksheet.spliceRows(1, 1);
  
      const formattedData = (rowData) => {
        return rowData.map(item => ({
          ...item,
          Date: Moment(item.Date).format("DD.MM.YYYY"),
          arrivalDate: Moment(item.arrivalDate).format("DD.MM.YYYY"),
          departureDate: Moment(item.departureDate).format("DD.MM.YYYY"),
          description: item.description?.replace(/\r?\n|\r/g, '')
        }));
      };
  
      const sanitizedData = formattedData(rowData);
  
    let totalSubTotal = 0;
    let totalCGST = 0;
    let totalSGST = 0;
      let totalAmount = 0;
  
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          CheckInID: row.CheckInID,
          roomNumber: row.roomNumber,
          TransactionDetails: row.TransactionDetails,
          guestName: row.guestName,
          Department: row.Department,
          SubTotal: row.SubTotal,
          CGST: row.CGST,
          sgst: row.sgst,
          Total: row.Total,
          Company: row.Company,
          remarks: row.remarks,
          arrivalDate: row.arrivalDate,
          departureDate: row.departureDate,
          roomType: row.roomType,
          reservationStatus: row.reservationStatus,
          Date: row.Date,
          billNo: row.billNo,
          invoiceDate: row.invoiceDate
        });
  
      totalSubTotal += parseFloat(row.SubTotal || 0);
      totalCGST += parseFloat(row.CGST || 0);
      totalSGST += parseFloat(row.sgst || 0);
        totalAmount += parseFloat(row.SubTotal || 0);
      });
  
      worksheet.addRow();
      worksheet.addRow({
        CheckInID: 'Totals',
        roomNumber: '',
        TransactionDetails: '',
        guestName: '',
        Department: '',
      SubTotal: totalSubTotal.toFixed(2),
      CGST: totalCGST.toFixed(2),
      sgst: totalSGST.toFixed(2),
      Total: totalAmount.toFixed(2),
      Company: '',
      remarks: '',
      arrivalDate: '',
      departureDate: '',
      roomType: '',
      reservationStatus: '',
      Date: '',
      billNo: '',
      invoiceDate: ''
    });

    const totalRow = worksheet.lastRow;
    totalRow.font = { bold: true };

    worksheet.columns.forEach((column, index) => {
      column.alignment = { vertical: 'middle', horizontal: index === 8 ? 'right' : 'left' };
    });

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, `Guest Ledger Report_${formattedDate}.xlsx`);
    }).catch((error) => {
      console.error('Error generating Excel file:', error);
    });
  }
};

  

  return (
    <div>
     <Card>
     <CardHeader><CardTitle tag="h4"><b>Guest Ledger</b></CardTitle> </CardHeader>          
     <CardBody>
      
        <div>
        <Col md="3" sm="12" className="mb-1">
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
        <Form onSubmit={handleSubmit(ConfirmSubmit)}>
            <Row>
           
              <Col md='4' sm='12'>
              <div className="mb-1">
              <Label className="form-label" for="frmdate">
                 Date
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
             
             
              <div align="end" className="buttons">
              <Button  color='primary' className='me-1' type='submit' disabled={isButtonClicked}>
              {isButtonClicked ? 'Processing...' : 'Submit'}
                </Button>
          {/* <Button className='me-1' color='primary' type='submit'  onClick={onBtnExport}> Download Excel </Button> */}
          <Button
                className='me-1'
                color='primary'
                onClick={generateExcel}
              >
                Download Excel
                </Button>
          <Button className='me-1' color='primary' onClick={printGrid}>Print PDF </Button>
              </div>
<br/><br/>
           
            </Row>
          </Form>

          </CardBody> 
          </Card>
          <Col>
          <h4>Summary of the Guest Ledger: </h4>
           {  
           details !== "" && <div>
            <Row>
            <Col>
            <h5>Room Revenue  </h5>
            </Col>
            <Col>
            <h5>FNB Revenue  </h5>
            </Col>
            <Col>
            <h5>Other Revenue  </h5>
            </Col>
            <Col>
            <h5>Payments </h5>
            </Col>
            <Col>
            <h5>Ledger Balance </h5>
            </Col>


            </Row>
            <Row>
            <Col>
            <h5>{details[0].room_revenue} </h5>
            </Col>
            <Col>
            <h5>{details[0].f_b_revenue} </h5>
            </Col>
            <Col>
            <h5>{details[0].other_revenue} </h5>
            </Col>
            <Col>
            <h5>{details[0].payments} </h5>
            </Col>
            <Col>
            <h5>{details[0].ledger_balance} </h5>
            </Col>
            </Row>
            </div>}
            </Col>

            <br/><br/>
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

    <div className="ag-theme-alpine" >
        <AgGridReact 
            ref={gridRef}
            rowData={updatedRowData} 
            columnDefs={columnDefs}
            animateRows={true} 
            rowSelection='multiple'
            onCellClicked={cellClickedListener}
            defaultColDef={defaultColDef}
            paginationPageSize="15"
            pagination="true"
            headerColor="ddw-primary"
            domLayout='autoHeight'

            />
      </div>
    </div>
  );
};

export default GuestLedger;
