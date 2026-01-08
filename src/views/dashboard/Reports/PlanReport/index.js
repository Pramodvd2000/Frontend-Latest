
// ** React Imports
import { useState } from "react";
// ** Third Party Components;
import "cleave.js/dist/addons/cleave-phone.us";
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Moment from 'moment'
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
// import App from "./roomInventoryDataTable";
import { useForm, Controller } from 'react-hook-form'
import { format } from "date-fns";
import { saveAs } from 'file-saver';

// Import ag-grid
// import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from 'react';
import DASHBOARD_URL from "../../../../dashboard";
import {
  AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, Accordion, InputGroup, NavLink
} from 'reactstrap'
import * as XLSX from 'xlsx';
import logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';// let today = Moment().format('YYYY-MM-DD')
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

// console.log(today)
let defaultValues = {

  // FromDate: [Moment((new Date(today))).subtract(1, 'days').format('YYYY-MM-DD')],
  // ToDate: [Moment((new Date(today))).subtract(1, 'days').format('YYYY-MM-DD')]

}
const AvailabilityMatrix = () => {

  // AG Grid
  const [rowData, setRowData] = useState([]);
  const [selectedOption, setselectedOption] = useState('Date')
  const [hotelDetails, setHotelDetails] = useState()
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);



  const gridRef = useRef();
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })



  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Room No', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 160, sort: 'asc' },
    { headerName: 'Guest Name', field: 'guestName', suppressSizeToFit: true, width: 170, wrapText: true, autoHeight: true, },
    { headerName: 'Company', field: 'Company', suppressSizeToFit: true, width: 400 },
    // {headerName: 'Agent',field: 'Agent',suppressSizeToFit: true,width:300},
    { headerName: 'Arrival Date', field: 'arrivalDate', suppressSizeToFit: true, },
    { headerName: 'Departure Date', field: 'departureDate', suppressSizeToFit: true, },
    { headerName: 'Adults', field: 'Adults', suppressSizeToFit: true, },
    { headerName: 'Date', field: 'date', suppressSizeToFit: true, },
    { headerName: 'Plan', field: 'packageCode', suppressSizeToFit: true, },
    { headerName: 'Inclusions', field: 'Inclusions', suppressSizeToFit: true, width: 400 },
    { headerName: 'Comments', field: 'comments', wrapText: true, autoHeight: true, },






  ]);
  const createData = (count, prefix) => {
    var result = [];
    for (var i = 0; i < count; i++) {
      if (rowData.length > 0) {
        result.push(rowData[0]);

      }
    }
    return result;
  };
  //   const pinnedBottomRowData = useMemo(() => {
  //     return createData(1, 'Bottom');
  //   }, []);
  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      // filter: true,
      // filterParams :{
      // buttons : ['apply','reset']
      // }
    }
  ));
  const handleTransferTransaction = (event) => {
    console.log(event)
    setselectedOption(event.target.value)
  }


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

  // error handling for same guest addition
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
    console.log(data)
    if (!data.FromDate || !data.ToDate) {
      handleError("Please select both From Date and To Date!");
      return;
    }
    else{
      setIsButtonClicked(true)
    setOpen(true)
    console.log(data)
    setData(data)
    data.FromDate = (Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD'))
    data.ToDate = (Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD'))
    const filterFromDate = Moment(data.FromDate[0]).format("DD.MM.YYYY");
    const filterToDate = Moment(data.ToDate[0]).format("DD.MM.YYYY");  
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);

    fetchx(DASHBOARD_URL + '/getPlanReport', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
        FromDate: data.FromDate,
        ToDate: data.ToDate
      })
    }).then(result => result.json())
      .then(resp => {
        console.log(resp)
        setIsButtonClicked(false)
        if (resp.statusCode == 200) {
          setOpen(false)
          console.log(resp['data'])
          setRowData(resp['data'])

          // window.print()
        }
        if (resp.statusCode == 403) {
          setOpen(false)
        }

      }).catch((error) => {
        console.log(error)
      })
    }
  }
  const cellClickedListener = useCallback(event => {
    console.log('cellClicked', event);
  }, []);

  useEffect(() => {
    // fetchx(DASHBOARD_URL + '/getinventory?hotelID=1')
    //     console.log()
    //     fetchx('http://122.166.2.21:14780/getRevTaxForDay?hotelID=1&FromDate='+Moment().subtract(1, 'days').format('YYYY-MM-DD')+'&ToDate='+Moment().subtract(1, 'days').format('YYYY-MM-DD'))
    //     .then(result => result.json())
    //     .then(rowData =>{
    //       // for(let i=0; i<10;i++){
    //       console.log(rowData['data'])

    // console.log(rowData['data'])
    // setRowData(rowData['data'])
    //     }
    //     )

  }, []);


  // ** State
  const [data, setData] = useState(null);
  const params = {
    fileName: 'Plan Report', // Set your desired file name here
  };

  const onBtnExport = () => {
    const params = {
      fileName: 'Plan Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };

  // const printGrid = () => {
  //   const gridApi = gridRef.current && gridRef.current.api;

  //   if (gridApi) {
  //     const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
  //     const headerRow = rowData.substring(0, rowData.indexOf('\n'));
  //     const cleanHeaderRow = headerRow.replace(/"/g, '');
  //     const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
  //     const cleanData = dataRows.replace(/"/g, '');
  //     const rows = cleanData.split('\n').map(row => row.split(','));
  //     const pdf = new jsPDF({ orientation: 'landscape' });
  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const logoWidth = 15;
  //     const xCenter = (pageWidth - logoWidth) / 2;

  //     // Add logo
  //     const logoHeight = 15;
  //     pdf.addImage(Logo, 'JPEG', xCenter, 10, logoWidth, logoHeight); // Adjust the coordinates and size as needed

  //     // Add heading
  //     pdf.setFontSize(12);
  //     pdf.setFont('helvetica', 'bold');
  //     pdf.text('THE OTERRA BENGALURU', 120, 33);
  //     pdf.text('Plan Report', 123, 39); // Adjust the coordinates as needed
  //     // Add current date to the right top corner
  //     const currentDate = new Date();
  //     const formattedDate = formatDate(currentDate);
  //     const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) * 12 - 10; // Adjust the X coordinate as needed
  //     const dateY = 10;
  //     pdf.text(formattedDate, dateX, dateY);

  //     // Function to format the date as "MM/DD/YYYY"
  //     function formatDate(date) {
  //       const day = date.getDate().toString().padStart(2, '0');
  //       const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //       const year = date.getFullYear();
  //       return `${day}/${month}/${year}`;
  //     }
  //     // Add table
  //     pdf.autoTable({
  //       head: [cleanHeaderRow.split(',').map(value => value.trim())], // Use the first row as the header
  //       body: rows.map(row => row.map(value => value.trim())), // Use the remaining rows as the data
  //       startY: 45, // Adjust the starting Y coordinate for the table
  //     });

  //     // Save or display the PDF as needed
  //     pdf.save('Plan Report.pdf');
  //   } else {
  //   }
  // };

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




  const printGrid = async (data) => {
    console.log(data);
  
    let grandTotalAdults = 0;
    let grandTotalRooms = 0;
  
    const uniqueArrivalDates = Array.from(new Set(rowData
      .sort((a, b) => a.roomNumber - b.roomNumber)
      .map((row) => row.date)));
  
    let fromDate = Moment(String(new Date(data.FromDate))).format("YYYY-MM-DD");
    let toDate = Moment(String(new Date(data.ToDate))).format("YYYY-MM-DD");
  
    const doc = new jsPDF({ orientation: 'landscape' });

      // Add image with increased space
      doc.addImage(DASHBOARD_URL + `/imagepaths/${logoimage}`, 'JPEG', 143, 10, 15, 15);
  
      doc.setFont('Times-Roman');
      doc.setFontSize(12);
      const currentDate = new Date();
      const formattedDateTime = formatDateTimeWithAMPM(currentDate);
      doc.setFont('times', 'normal');
      doc.text(`Report Generated Time: ${formattedDateTime}`, 230, 10, { width: 500, align: 'center' });
  
      // Add text with increased space
      doc.setFont('times', 'bold');
      const hotelName = hotelDetails[0].name.toUpperCase(); // Convert to uppercase
      const hotelCity = hotelDetails[0].city.toUpperCase(); // Convert to uppercase
      const hotelAddress = hotelDetails[0].address.toUpperCase(); // Convert to uppercase
  
      doc.text(`${hotelName}`, 120, 33);
      doc.text(`${hotelCity}`, 150, 33);
      doc.text(`${hotelAddress}`, 80, 39);
      doc.setFont('times', 'normal');
  
      // Add additional space before 'Plan Report'
      doc.setFont('times', 'bold');
      doc.setFontSize(14); // Set the desired font size
      doc.text('Plan Report', 150, 45, { width: 510, align: 'center' });
      doc.setFontSize(12); // Reset font size to the original value
  
      // Adjusted startY and margin to center the table
      let startY = 50;
      const margin = { top: 10, right: 20, bottom: 10, left: 20 };
  
      // Iterate through each unique arrival date and generate a table
      uniqueArrivalDates.forEach((date, index) => {
        const rows = rowData
          .filter((row) => row.date === date)
          .map((row) => {
            const formattedArrival = Moment(new Date(row.arrivalDate)).format("DD.MM.YYYY");
            const formattedDeparture = Moment(new Date(row.departureDate)).format("DD.MM.YYYY");
            const formattedDate = Moment(new Date(row.date)).format("DD.MM.YYYY");
            return {
              ...row,
              arrivalDate: formattedArrival,
              departureDate: formattedDeparture,
              date: formattedDate,
            };
          })
          .map((row) => columnDefs.map((column) => row[column.field]));
  
        const columns = columnDefs.map((column) => column.headerName);
  
        const targetIndex = 5;
        let totalAdults = rows.reduce((acc, row) => acc + (parseInt(row[targetIndex], 10) || 0), 0);
        const uniqueRoomCount = new Set(rowData.map((row) => row.roomNumber)).size;
        const totalRooms = rows.length;
  
        grandTotalAdults += totalAdults;
        grandTotalRooms += totalRooms;
  
        // Render table and totals for each date
        doc.setFont('times', 'bold');
        doc.text(`Date: ${Moment(String(new Date(date))).format("DD.MM.YYYY")}`, 20, startY + 5, {
          width: 500,
          align: 'left',
        });
  
        doc.autoTable({
          head: [columns],
          body: rows,
          startY: startY + 10,
          margin,
        });
        doc.line(margin.left, doc.autoTable.previous.finalY + 2, doc.internal.pageSize.width - margin.right, doc.autoTable.previous.finalY + 2);
  
        doc.setFont('times', 'normal');
        doc.text(`Total Rooms: ${uniqueRoomCount}`, 20, doc.autoTable.previous.finalY + 10, {
          width: 500,
          align: 'left',
        });
  
        doc.text(`Total Adults: ${totalAdults}`, 148, doc.autoTable.previous.finalY + 10, {
          width: 500,
          align: 'right',
        });
  
        startY = doc.autoTable.previous.finalY + 20;
  
        // If it's the last date, print the grand totals
        if (index === uniqueArrivalDates.length - 1) {
          if (fromDate && toDate) {
            const fromDateNew = Moment(new Date(fromDate)).format("DD.MM.YYYY");
            const toDateNew = Moment(new Date(toDate)).format("DD.MM.YYYY");
  
            const grandTotalSpaceNeeded = 30;
  
            if (doc.internal.pageSize.height - startY > grandTotalSpaceNeeded) {
              // Add grand totals after the last row
  
              const grandTotalColumns = ['Grand Total', 'Total Rooms', 'Total Adults'];
              const grandTotalData = [['Grand Total', grandTotalRooms, grandTotalAdults]];
              const grandTotalY = startY + 20;
  
              doc.autoTable({
                head: [grandTotalColumns],
                body: grandTotalData,
                startY: grandTotalY,
                margin,
              });
  
              doc.setFont('times', 'bold');
  
              // Check for space and add filter information as required
              const filterInformationSpaceNeeded = 50;
              if (doc.internal.pageSize.height - (grandTotalY + 40 + filterInformationSpaceNeeded) > 0) {
                doc.text(`Filter:`, 20, grandTotalY + 30, { width: 500, align: 'left' });
                doc.text(`Arrival Date: From ${fromDateNew} To ${toDateNew}`, 20, grandTotalY + 40, { width: 500, align: 'left' });
              } else {
                doc.addPage();
                startY = margin.top;
                doc.text(`Filter:`, 20, startY + 30, { width: 500, align: 'left' });
                doc.text(`Arrival Date: From ${fromDateNew} To ${toDateNew}`, 20, startY + 40, { width: 500, align: 'left' });
              }
  
              for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                const pageNumber = `Page ${i} of ${doc.internal.getNumberOfPages()}`;
                const pageNumberWidth = doc.getStringUnitWidth(pageNumber) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                const pageCenter = doc.internal.pageSize.width / 2;
                const xPos = pageCenter - (pageNumberWidth / 2);
                const yPos = doc.internal.pageSize.height - 10;
                doc.text(pageNumber, xPos, yPos);
              }
  
            } else {
              // Add totals and filter on a new page if space is insufficient
              doc.addPage();
              startY = margin.top;
  
              const grandTotalColumns = ['Grand Total', 'Total Rooms', 'Total Adults'];
              const grandTotalData = [['Grand Total', grandTotalRooms, grandTotalAdults]];
              const grandTotalY = startY + 20;
  
              doc.autoTable({
                head: [grandTotalColumns],
                body: grandTotalData,
                startY: grandTotalY,
                margin,
              });
  
              doc.text(`Filter:`, 20, grandTotalY + 30, { width: 500, align: 'left' });
              doc.text(`Arrival Date: From ${fromDateNew} To ${toDateNew}`, 20, grandTotalY + 40, { width: 500, align: 'left' });
  
              for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                const pageNumber = `Page ${i} of ${doc.internal.getNumberOfPages()}`;
                const pageNumberWidth = doc.getStringUnitWidth(pageNumber) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                const pageCenter = doc.internal.pageSize.width / 2;
                const xPos = pageCenter - (pageNumberWidth / 2);
                const yPos = doc.internal.pageSize.height - 10;
                doc.text(pageNumber, xPos, yPos);
              }
            }
          }
        }
      });
  
      const pdfBlob = doc.output('blob');
      saveAs(pdfBlob, 'Plan Report.pdf');
   
  };
  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Plan Report');
  
      const columns = [
        { header: 'Room No', key: 'roomNumber', width: 20 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Company', key: 'Company', width: 40 },
        { header: 'Arrival Date', key: 'arrivalDate', width: 20 },
        { header: 'Departure Date', key: 'departureDate', width: 20 },
        { header: 'Adults', key: 'Adults', width: 15 },
        { header: 'Date', key: 'date', width: 20 },
        { header: 'Plan', key: 'packageCode', width: 20 },
        { header: 'Inclusions', key: 'Inclusions', width: 40 },
        { header: 'Comments', key: 'comments', width: 30 }
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'Plan Report']);
      worksheet.addRow(['Filter From Date:', filterFromDate]);
      worksheet.addRow(['To Date:', filterToDate]);
      worksheet.addRow();
      worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
      for (let i = 1; i <= 5; i++) {
        worksheet.getRow(i).font = { bold: true };
      }
  
      worksheet.spliceRows(1, 1);
  
      const formattedData = (rowData) => {
        return rowData.map(item => ({
          ...item,
          arrivalDate: Moment(item.arrivalDate).format("DD.MM.YYYY"),
          departureDate: Moment(item.departureDate).format("DD.MM.YYYY"),
          date: Moment(item.date).format("DD.MM.YYYY"),
        }));
      };
  
      const sanitizedData = formattedData(rowData);
  
      // Adding rows to the worksheet
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          roomNumber: row.roomNumber,
          guestName: row.guestName,
          Company: row.Company,
          arrivalDate: row.arrivalDate,
          departureDate: row.departureDate,
          Adults: row.Adults,
          date: row.date,
          packageCode: row.packageCode,
          Inclusions: row.Inclusions,
          comments: row.comments
        });
      });
  
      worksheet.columns.forEach((column, index) => {
        column.alignment = { vertical: 'middle', horizontal: 'left' };
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Plan Report_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };
  

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4"><b>Plan Report</b></CardTitle>
        </CardHeader>
      </Card>
      <Form onSubmit={handleSubmit(ConfirmSubmit)}>
        <Row>

          <Col md='4' sm='12'>
            <div className='mb-1'>
              <Label className='form-label' for='FromDate'>
                From Date<spam style={{ color: 'red' }}>*</spam>
              </Label>
              <Controller
                control={control}
                id='FromDate'
                name='FromDate'
                required
                render={({ field }) => (
                  <Flatpickr
                    // disabled={isSubmitted}

                    {...field}
                    // options={options}
                    required
                    options={{ allowInput: true }} 
                    placeholder='YYYY-MM-DD '
                    className={classnames('form-control', {
                      'is-invalid': data !== null && data.FromDate === null
                    })}
                  />
                )}
              />
            </div>
          </Col>
          {/* </Row> */}
          {/* <Row> */}
          <Col md='4' sm='12'>
            <div className='mb-1'>
              <Label className='form-label' for='ToDate'>
                To Date <spam style={{ color: 'red' }}>*</spam>
              </Label>
              <Controller
                control={control}
                id='ToDate'
                name='ToDate'
                required
                render={({ field }) => (
                  <Flatpickr

                    // disabled={isSubmitted}
                    {...field}
                    required
                    options={{ allowInput: true }} 
                    // options={optionsToDate}
                    placeholder='YYYY-MM-DD '
                    className={classnames('form-control', {
                      'is-invalid': data !== null && data.ToDate === null
                    })}
                  />
                )}
              />
            </div>
          </Col>
          {/* </Row> */}


          <div className='d-flex'>
            <Button className='me-1' color='primary' type='submit' disabled={isButtonClicked}>
            {isButtonClicked ? 'Processing...' : 'Submit'} 
            </Button>
            {/* <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button> */}
            <Button
              className='me-1'
              color='primary'
              onClick={generateExcel}
              >
              Download Excel
              </Button>
            <Button className='me-1' color='primary' onClick={() => printGrid(data)}>Print to PDF
            </Button>
          </div>
        </Row>
        <Row>
          {/* <Col md='4' sm='12'>
              <div align='right'>
                <Button style={{ marginBottom: '4px'}} color='primary' className='me-1' type='submit'>
                  Submit
                </Button>
                

              </div>
              </Col> */}
          {/* <Col md='8' sm='12'>
            <div className='inline-spacing' align="right" style={{ margin: '2px 0' }}>
            <Button.Ripple color='primary' style={{ marginTop: '22px'}} onClick={onBtnExport} disabled={rowData.length==0} >Download CSV file</Button.Ripple>
            </div>
            </Col> */}

        </Row>
        {/* <Row>
            <div className='inline-spacing' align="right" style={{ margin: '2px 0' }}>
            <Button.Ripple color='primary' size='sm' onClick={onBtnExport} >Download CSV file</Button.Ripple>
            </div>
            </Row> */}
      </Form>
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
      <div className="ag-theme-alpine" style={{ height: 530 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData} columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          // paginationAutoPageSize = 'true'
          paginationPageSize='10'
          pagination='true'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
        // pinnedBottomRowData={pinnedBottom.RowData}

        />
      </div>
      {/* <App/> */}
    </div>
  );
};

export default AvailabilityMatrix;
