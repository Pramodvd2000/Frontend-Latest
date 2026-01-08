
// ** React Imports
import { useState } from "react";
import "cleave.js/dist/addons/cleave-phone.us";
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Moment from 'moment'
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import { useForm, Controller } from 'react-hook-form'
import { saveAs } from 'file-saver';

// Import ag-grid
// import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from 'react';
import DASHBOARD_URL from "../../../../config";
import { Button, Card, CardHeader, CardTitle, CardBody, Row, Col, Form, Label } from 'reactstrap'
import logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';// let today = Moment().format('YYYY-MM-DD')
import { FALSE } from "sass";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';

const AvailabilityMatrix = () => {

  // AG Grid
  const [rowData, setRowData] = useState([]);
  const [hotelDetails, setHotelDetails] = useState()
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [open,setOpen] = useState(false)



  const gridRef = useRef();
  const { handleSubmit, control } = useForm({})



  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Room No', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 160, sort: 'asc' },
    { headerName: 'Booking ID', field: 'bookingID', suppressSizeToFit: true, maxWidth: 160 },
    { headerName: 'Guest Name', field: 'guestName', suppressSizeToFit: true, width: 170, wrapText: true, autoHeight: true },
    { headerName: 'Package Revenue', field: 'packageRevenue', suppressSizeToFit: true, maxWidth: 160 },
    { headerName: 'Room Revenue', field: 'roomRevenue', suppressSizeToFit: true, maxWidth: 160 },
    { headerName: 'Total Revenue', field: 'base_amount', suppressSizeToFit: true, maxWidth: 160 },
    { headerName: 'Company', field: 'accountName', suppressSizeToFit: true, width: 400 },
    { headerName: 'Arrival Date', field: 'arrivalDate', suppressSizeToFit: true },
    { headerName: 'Departure Date', field: 'departureDate', suppressSizeToFit: true },
    { headerName: 'Adults', field: 'adults', suppressSizeToFit: true },
    { headerName: 'Date', field: 'date', suppressSizeToFit: true },
    { headerName: 'Plan', field: 'packageCode', suppressSizeToFit: true },
    { headerName: 'Transaction Remarks', field: 'remarks', suppressSizeToFit: true, width: 220 },
    { headerName: 'Comments', field: 'comments', wrapText: true, autoHeight: true }
  ]);


  // Define the row style function
  const getRowStyle = params => {
    if (params.data.packageRevenue === 0) {
      return { backgroundColor: 'lightcoral' }; // Highlight row with light coral color
    }
    return null;
  };


  const calculateFooterData = (data) => {
    let totalPackageRevenue = 0;
    let totalRoomRevenue = 0;
    let totalRevenue = 0;
  
    data.forEach(row => {
      totalPackageRevenue += parseFloat(row.packageRevenue) || 0;
      totalRoomRevenue += parseFloat(row.roomRevenue) || 0;
      totalRevenue += parseFloat(row.base_amount) || 0;
    });
  
    const formatNumber = (value) => isNaN(value) ? '0.00' : value.toFixed(2);
  
    return [{
      roomNumber: 'Total',
      packageRevenue: formatNumber(totalPackageRevenue),
      roomRevenue: formatNumber(totalRoomRevenue),
      base_amount: formatNumber(totalRevenue),
      accountName: '',
      guestName: '',
      arrivalDate: '',
      departureDate: '',
      adults: '',
      date: '',
      packageCode: '',
      Inclusions: '',
      comments: ''
    }];
  };
  

  const pinnedBottomRowData = calculateFooterData(rowData);


  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams :{
      buttons : ['apply','reset']
      }
    }
  ));

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


  const ConfirmSubmit = (data) => {
    setOpen(true)
    setIsButtonClicked(true)
    setData(data)
    let startDate = (Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD'))

    fetchx(DASHBOARD_URL + '/getTransactionRevenueDetails', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: startDate,
      })
    }).then(result => result.json())
      .then(resp => {
        setIsButtonClicked(false)
        if (resp.statusCode == 200) {
          setOpen(false)
          setRowData(resp['data'])
        }
        else {
        }
      }).catch((error) => {
        console.log(error)
      })

  }


  // ** State
  const [data, setData] = useState(null);


  const onBtnExport = () => {
    const params = {
      fileName: 'Plan Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };


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

    let grandTotalAdults = 0;
    let grandTotalRooms = 0;

    const uniqueArrivalDates = Array.from(new Set(rowData
      .sort((a, b) => a.roomNumber - b.roomNumber)
      .map((row) => row.date)));
    let fromDate = Moment(String(new Date(data.FromDate))).format("YYYY-MM-DD");
    let toDate = Moment(String(new Date(data.ToDate))).format("YYYY-MM-DD");
    const doc = new jsPDF({ orientation: 'landscape' });

    try {
      // Add image with increased space
      doc.addImage(logo, 'JPEG', 143, 10, 15, 15);

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

      // Add additional space before 'Long Staying Guest Report'
      doc.setFont('times', 'bold');
      doc.setFontSize(14); // Set the desired font size (adjust as needed)
      doc.text('Plan Report', 150, 45, { width: 510, align: 'center' });
      doc.setFontSize(12); // Reset font size to the original value (adjust if needed)

      // Adjusted startY and margin to center the table
      let startY = 50; // Adjust as needed
      const margin = { top: 10, right: 20, bottom: 10, left: 20 }; // Adjust as needed

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
        let totalAdults;
        totalAdults = rows.reduce((acc, row) => acc + (parseInt(row[targetIndex], 10) || 0), 0);

        const uniqueRoomCount = new Set(rows.map((row) => row[0])).size;
        const totalRooms = rows.length;

        grandTotalAdults += totalAdults;
        grandTotalRooms += totalRooms;
        const spaceLeftForDate = doc.internal.pageSize.height - (startY + 20 + margin.bottom);
        if (spaceLeftForDate < 0) {
          doc.addPage();
          startY = margin.top;
        }

        doc.setFont('times', 'bold');
        doc.text(`Date: ${Moment(String(new Date(date))).format("DD.MM.YYYY")}`, 20, startY + 5, {
          width: 500,
          align: 'left',
        });

        const spaceLeft = doc.internal.pageSize.height - (startY + 20 + margin.bottom);
        if (spaceLeft < 0) {
          doc.addPage();
          startY = margin.top;
        }

        doc.autoTable({
          head: [columns],
          body: rows,
          startY: startY + 10,
          margin,
        });
        doc.line(margin.left, doc.autoTable.previous.finalY + 2, doc.internal.pageSize.width - margin.right, doc.autoTable.previous.finalY + 2);

        const totalCount = rows.length;

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

        if (index === uniqueArrivalDates.length - 1) {
          if (fromDate && toDate) {
            const fromDateNew = Moment(new Date(fromDate)).format("DD.MM.YYYY");
            const toDateNew = Moment(new Date(toDate)).format("DD.MM.YYYY");

            // Calculate the space needed for the "Grand Total" and filter information
            const grandTotalSpaceNeeded = 30;

            // Check if there is enough space for "Grand Total" and filter
            if (doc.internal.pageSize.height - startY > grandTotalSpaceNeeded) {
              const grandTotalColumns = ['Grand Total', 'Total Adults'];
              const grandTotalData = [['Grand Total', grandTotalAdults]];
              // Adjust the starting Y position for the grand total section
              const grandTotalY = startY + 20;

              doc.autoTable({
                head: [grandTotalColumns],
                body: grandTotalData,
                startY: grandTotalY,
                margin,
              });

              doc.setFont('times', 'bold');

              const filterInformationSpaceNeeded = 50; // Adjust the value as needed
              if (doc.internal.pageSize.height - (grandTotalY + 40 + filterInformationSpaceNeeded) > 0) {

                doc.text(`Filter:`, 20, grandTotalY + 30, { width: 500, align: 'left' });
                doc.text(`Arrival Date: From ${fromDateNew} To ${toDateNew}`, 20, grandTotalY + 40, { width: 500, align: 'left' });
                doc.setFont('times', 'normal');

              } else {

                doc.addPage();
                startY = margin.top;

                doc.setFont('times', 'bold');
                doc.text(`Filter:`, 20, startY + 30, { width: 500, align: 'left' });
                doc.text(`Date:  ${fromDateNew} `, 20, startY + 40, { width: 500, align: 'left' });
                doc.setFont('times', 'normal');

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
            }

            else {
              // If there is not enough space, add a new page
              doc.addPage();
              startY = margin.top;

              const grandTotalColumns = ['Grand Total', 'Total Rooms', 'Total Adults'];
              const grandTotalData = [['Grand Total', grandTotalRooms, grandTotalAdults]];

              // Adjust the starting Y position for the grand total section
              const grandTotalY = startY + 20;

              doc.autoTable({
                head: [grandTotalColumns],
                body: grandTotalData,
                startY: grandTotalY,
                margin,
              });
              doc.setFont('times', 'bold');

              // Add filter information
              doc.text(`Filter:`, 20, grandTotalY + 30, { width: 500, align: 'left' });
              doc.text(`Arrival Date: From ${fromDateNew} To ${toDateNew}`, 20, grandTotalY + 40, { width: 500, align: 'left' });
              doc.setFont('times', 'normal');
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
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div>

      <Card>
        <CardHeader>
          <CardTitle tag="h4"><b>Meal Plan Revenue</b></CardTitle>
        </CardHeader>
      </Card>
      <Form onSubmit={handleSubmit(ConfirmSubmit)}>
        <Row>

          <Col md='4' sm='12'>
            <div className='mb-1'>
              <Label className='form-label' for='FromDate'>
                Select Date<spam style={{ color: 'red' }}>*</spam>
              </Label>
              <Controller
                control={control}
                id='FromDate'
                name='FromDate'
                required
                render={({ field }) => (
                  <Flatpickr
                    {...field}
                    required
                    options={{ allowInput: true }}
                    // options={options}
                    placeholder='YYYY-MM-DD '
                    className={classnames('form-control', {
                      'is-invalid': data !== null && data.FromDate === null
                    })}
                  />
                )}
              />
            </div>
          </Col>


          <div className='d-flex'>
            <Button className='me-1' color='primary' type='submit' disabled={isButtonClicked}>
            {isButtonClicked ? 'Processing...' : 'Submit'} 
            </Button>
            <Button className='me-1' color='primary'  onClick={onBtnExport}> Download Excel </Button>
            <Button className='me-1' color='primary' onClick={() => printGrid(data)}>Print to PDF
            </Button>
          </div>

        </Row>
        <Row>

        </Row>
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
      <br></br>
      <div className="ag-theme-alpine" style={{height:550}}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          getRowStyle={getRowStyle}
          animateRows={true}
          rowSelection='multiple'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
          pinnedBottomRowData={pinnedBottomRowData}
        />
      </div>
    </div>
  );
};

export default AvailabilityMatrix;