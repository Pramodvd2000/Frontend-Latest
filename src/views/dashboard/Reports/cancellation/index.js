// ** React Imports
import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input, InputGroup, InputGroupText } from 'reactstrap'
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
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
const MySwal = withReactContent(Swal)
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import API_URL from '../../../../config'

const defaultValues = {
  frmdate: ''
}

const Block = () => {

  // AG Grid
  const [rowData1, setRowData1] = useState();
  const [flag, setFlag] = useState(false)

  const gridRef = useRef();

  const [hotelDetails, setHotelDetails] = useState(null);
  const [hotelAddress, setHotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [logoimage, setLogo] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [excelButton,setExcelButton] = useState(false);
  const [pdfButton,setPdfButton] = useState(false);
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);


  const [picker, setPicker] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0); 
    return date;
  });

  const [todatepicker, settoDatePicker] = useState(() => {
    const date = new Date();
    date.setHours(23, 59, 59, 999); 
    return date;
  });

  useEffect(() => {
    if (picker > todatepicker) {
      settoDatePicker(picker); 
    }
  }, [picker]); 

  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      html: message.replace(/\n/g, '<br />'),
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }
  
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

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Booking ID', field: 'bookingID', suppressSizeToFit: true, width: 120 , autoHeaderHeight: true ,wrapHeaderText: true },
    { headerName: 'Guest Name ', field: 'guestName', suppressSizeToFit: true, width: 170, wrapText: true, autoHeight: true,  autoHeaderHeight: true ,wrapHeaderText: true},
    {
      headerName: 'Arrival Date', field: 'arrivalDate', suppressSizeToFit: true, width: 120 , autoHeaderHeight: true ,wrapHeaderText: true,
      cellRenderer: (params) => {
        if (params.data && params.data.arrivalDate) {
          const formattedDate = Moment(params.data.arrivalDate).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    // { headerName: 'ETA', field: 'ETA', suppressSizeToFit: true, width: 100 },
    { headerName: 'Cancellation Date', field: 'cancellationDate', suppressSizeToFit: true, width: 120,  autoHeaderHeight: true ,wrapHeaderText: true,
    cellRenderer: (params) => {
      if (params.data && params.data.cancellationDate) {
        const formattedDate = Moment(params.data.cancellationDate).format("DD.MM.YYYY");
        return formattedDate;
      } else {
        return "";
      }
    }
    },
    {
      headerName: 'Departure Date', field: 'departureDate', suppressSizeToFit: true, width: 160,
      cellRenderer: (params) => {
        if (params.data && params.data.departureDate) {
          const formattedDate = Moment(params.data.departureDate).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    // { headerName: 'ETD', field: 'ETD', suppressSizeToFit: true, width: 100 },
    { headerName: 'Room Type', field: 'roomType', suppressSizeToFit: true, width: 100 , autoHeaderHeight: true ,wrapHeaderText: true },
    { headerName: 'Rate ', field: 'rate', suppressSizeToFit: true, width: 100, autoHeaderHeight: true ,wrapHeaderText: true },
     { headerName: 'Nights', field: 'numberOfNights', suppressSizeToFit: true, width: 100 },
    { headerName: 'No Of Rooms ', field: 'numberOfRooms', suppressSizeToFit: true, width: 90 , autoHeaderHeight: true ,wrapHeaderText: true },
     { headerName: 'Cancellation Date & Time', field: 'CancelledDateTime', suppressSizeToFit: true, width: 170 , autoHeaderHeight: true ,wrapHeaderText: true,},
    { headerName: 'isMain', field: 'isMain', suppressSizeToFit: true, width: 180, hide:true },
    { headerName: 'Company/TA', field: 'accountName', suppressSizeToFit: true, width: 170, wrapText: true, autoHeight: true },
     { headerName: 'Source', field: 'Source', suppressSizeToFit: true, width: 170, wrapText: true, autoHeight: true },
     { headerName: 'Reason Code', field: 'description', suppressSizeToFit: true, width: 130 , autoHeaderHeight: true ,wrapHeaderText: true },
     { headerName: 'Remarks for description', field: 'reasonText', width: 180 ,   autoHeight: true,autoHeaderHeight: true ,wrapHeaderText: true , wrapText: true },
     { headerName: 'Cancelled By', field: 'createdBy', suppressSizeToFit: true, width: 170, wrapText: true, autoHeight: true },

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


  // ** State
  const [data, setData] = useState(null)
  const [flag1, setflag1] = useState(false)

  // ** Hooks
  const { reset, handleSubmit, control } = useForm({ defaultValues })



  const onSubmit = async (data) => {
    if (!picker || !todatepicker) {
      setflag1(false);
      return handleError("Enter the Mandatory fields");
    }

    const filterFromDate = Moment(new Date(picker)).format("YYYY-MM-DD");
    const filterToDate = Moment(new Date(todatepicker)).format("YYYY-MM-DD");
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate)

    setPdfButton(true);
    setExcelButton(true);
    setIsLoading(true);
    setFlag(true);
    setData(data);

    let createmarketGroup = JSON.stringify({
      "hotelID": 1,
      "startDate": Moment(new Date(picker)).format("YYYY-MM-DD HH:mm:ss"),
      "endDate": Moment(new Date(todatepicker)).format("YYYY-MM-DD HH:mm:ss")
    });

    try {
      const response = await fetch(DASHBOARD_URL + "/getCancellationDetails", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      setRowData1(res["data"]);
      setflag1(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      handleError("Failed fetching data. Please try again.");
      setflag1(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setExcelButton(false);
    setPdfButton(false);
    setRowData1();
    reset({
      block: ''
    })
  }



  const printGrid = () => {

    if(!rowData1 || rowData1 === undefined || (rowData1.length === 0)  ){
      return handleError("No records are present for printing")
    }
    const gridApi = gridRef.current && gridRef.current.api;
    const uniqueDepartureDates = Array.from(new Set(rowData1.map((row) => row.cancellationDate))); 
  
    if (gridApi) {
      const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
      const headerRow = rowData.substring(0, rowData.indexOf('\n'));
      const cleanHeaderRow = headerRow.replace(/"/g, '');
      const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
      const cleanData = dataRows.replace(/"/g, '');
  
      // Split the cleaned data into rows
      const rows = cleanData.split('\n').map(row => row.split(','));
  
      const pdf = new jsPDF({ orientation: 'landscape' });
  
      const pageWidth = pdf.internal.pageSize.getWidth();
      const logoWidth = 20;
      const xLogo = 10; // X-coordinate for the logo
      const yLogo = 10; // Y-coordinate for the logo
      const logoHeight = 20;
      let dateY = 20;
  
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
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', 'normal');
        
        const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const pageCenter = pdf.internal.pageSize.width / 2;
        const halfTextWidth = textWidth / 2;
        let textStartX = pageCenter - halfTextWidth;
  
        if (textStartX < 0) {
          textStartX = 0;
        } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
          textStartX = pdf.internal.pageSize.width - textWidth;
        }
        
        pdf.text(`${textToCenter}`, textStartX, yLogo);
      };
  
      setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo, 14);
      setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8, 12);
  
      const textToCenter = "Cancellation Report";
      const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      const pageCenter = pdf.internal.pageSize.width / 2;
      const halfTextWidth = textWidth / 2;
      let textStartX = pageCenter - halfTextWidth;
  
      if (textStartX < 0) {
        textStartX = 0;
      } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
        textStartX = pdf.internal.pageSize.width - textWidth;
      }
  
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
  
      uniqueDepartureDates
        .sort((a, b) => new Date(a) - new Date(b))
        .forEach((cancellationDate) => {
          const rowsForDate = rowData1
            .filter((row) => row.cancellationDate === cancellationDate)
            .map((row) => {
              const formattedArrival = formatDate(new Date(row.arrivalDate));
              const formattedCancelledDate = formatDate(new Date(row.cancellationDate));
              const formatteddepartureDate = formatDate(new Date(row.departureDate));
  
              return {
                bookingID: row.bookingID,
                guestName: row.guestName,
                arrivalDate: formattedArrival,
                cancellationDate: formattedCancelledDate,
                departureDate:formatteddepartureDate,
                roomType: row.roomType,
                rate:row.rate,
                numberOfNights: row.numberOfNights,
                numberOfRooms: row.numberOfRooms,
                CancelledDateTime: row.CancelledDateTime,
                accountName: row.accountName,
                 Source:row.Source,
                reasonText: row.reasonText,
                createdBy: row.createdBy
              };
            });
  
          const columns = [
            'Booking ID', 'Guest Name', 'Arrival Date', 'Cancellation Date', 'Departure Date',
            'Room Type','Rate', 'Nights', 'No Of Rooms', 'Cancellation Date & Time', 
            'Company/TA', 'Source','Remarks for Cancellation','Cancelled By'
          ];
  
          const totalRooms = rowsForDate.reduce((sum, row) => sum + row.numberOfRooms, 0);
  
          pdf.setFont('times', 'bold');
          const formattedCancellationDate = formatDate(new Date(cancellationDate));
          pdf.text(`Cancellation Date: ${formattedCancellationDate}`, 10, dateY + 37, { width: 500, align: 'left' });
  
          pdf.autoTable({
            head: [columns],
            body: rowsForDate.map((row) => [
              row.bookingID, row.guestName, row.arrivalDate, row.cancellationDate, row.departureDate,
              row.roomType,row.rate, row.numberOfNights, row.numberOfRooms, row.CancelledDateTime,
              row.accountName,row.Source, row.reasonText,row.createdBy
            ]),
            startY: dateY + 43,
          });
  
          pdf.setFont('times', 'roman');
          pdf.text(`Total Rooms: ${totalRooms}`, 260, pdf.autoTable.previous.finalY + 7, { width: 500, align: 'center' });
          
          pdf.line(
            170, 
            pdf.autoTable.previous.finalY + 10, 
            285, 
            pdf.autoTable.previous.finalY + 10 
          );
  
          dateY = pdf.autoTable.previous.finalY - 10;
        });
  
      dateY = pdf.autoTable.previous.finalY + 20;
  
      if (dateY + 20 > pdf.internal.pageSize.height - margin.bottom) {
        pdf.addPage();
        dateY = margin.top;
      }
  
      let fromDate = formatDates(new Date(picker));
      let toDate = formatDates(new Date(todatepicker));
  
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Filter From Cancelled Date: ${fromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
      pdf.text(`To Cancelled Date: ${toDate}`, 10, dateY + 20, { width: 500, align: 'left' });
  
      for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
        pdf.setPage(i);
        pdf.setFontSize(12);
  
        const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
        const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const xPos = pageCenter - (pageNumberWidth / 2);
        const yPos = pdf.internal.pageSize.height - 10;
  
        pdf.text(pageNumber, xPos, yPos);
      }
  
      pdf.save('Cancellation Report.pdf');
    }
  };

  
  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reservation Cancellation Report'); // Changed report name

      function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      }
  
      const columns = [
        { header: 'Booking ID', key: 'bookingID', width: 15 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Arrival Date', key: 'arrivalDate', width: 20 },
        { header: 'Departure Date', key: 'departureDate', width: 20 },
        { header: 'Cancellation Date', key: 'cancellationDate', width: 20 },
        { header: 'Room Type', key: 'roomType', width: 20 },
        { header: 'Nights', key: 'numberOfNights', width: 15 },
        { header: 'Rate', key: 'rate', width: 15 },
        { header: 'No Of Rooms', key: 'numberOfRooms', width: 20 },
        { header: 'Cancellation Date & Time', key: 'CancelledDateTime', width: 25 },
        { header: 'Company/TA', key: 'accountName', width: 25 },
        { header: 'Source', key: 'Source', width: 25 },
       { header: 'Reason Code', key: 'description', width: 25 },
       {header: 'Remarks for description', key: 'reasonText', width: 80 },
       { header: 'Cancelled By', key: 'createdBy', width: 25}
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'Reservation Cancellation Report']);
      worksheet.addRow(['Filter From Date:', filterFromDate]);
      worksheet.addRow(['Filter To Date:', filterToDate]);

      worksheet.addRow();
      worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
      for (let i = 1; i <= 5; i++) {
        worksheet.getRow(i).font = { bold: true };
      }
  
      worksheet.spliceRows(1, 1);
  
      const formattedData = (rowData1) => {
        return rowData1.map(item => ({
          ...item,
          marketCode: item.marketCode?.replace(/\r?\n|\r/g, ''),
          description: item.description?.replace(/\r?\n|\r/g, '')
        }));
      };
  
      const sanitizedData = formattedData(rowData1);

  
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          bookingID: row.bookingID,
          guestName: row.guestName,
          arrivalDate: row.arrivalDate,
          departureDate:row.departureDate,
          cancellationDate:formatDate(new Date(row.cancellationDate)),
          roomType: row.roomType,
          rate:row.rate,
          numberOfNights: row.numberOfNights,
          numberOfRooms: row.numberOfRooms,
          CancelledDateTime: row.CancelledDateTime,
          accountName: row.accountName,
          Source:row.Source,
          description:row.description,
          reasonText: row.reasonText,
          createdBy: row.createdBy

        });
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Reservation Cancellation Report_${formattedDate}.xlsx`); // Changed report name
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };
  

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Reservation Cancellation Report </CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
            <Col md="3" sm="12">
        <div className="mb-1">
          <Label className="form-label" htmlFor="frmdate">
            From Date <spam style={{ color: 'red' }}>*</spam>
          </Label>
          <Controller
            control={control}
            id="frmdate"
            name="frmdate"
            render={({ field }) => (
              <Flatpickr
                value={picker}
                data-enable-time
                id="frmdate"
                className="form-control"
                onChange={(date) => setPicker(date[0])} // Use date[0] for single date selection
              />
            )}
          />
        </div>
      </Col>

      <Col md="3" sm="12">
        <div className="mb-1">
          <Label className="form-label" htmlFor="todate">
            To Date <spam style={{ color: 'red' }}>*</spam>
          </Label>
          <Controller
            control={control}
            id="todate"
            name="todate"
            render={({ field }) => (
              <Flatpickr
                value={todatepicker}
                data-enable-time
                id="todate"
                className="form-control"
                options={{
                  minDate: picker, // Set minimum date to the "From Date"
                }}
                onChange={(date) => settoDatePicker(date[0])} // Use date[0] for single date selection
              />
            )}
          />
        </div>
      </Col>
            

              <div align="end" className="buttons">
              

<Button 
                  className='me-1' 
                  color='primary' 
                  type='submit'
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
                <Button className='me-1' outline color='secondary' type='reset' onClick={handleReset}>
                  Reset
                </Button>
                {excelButton && 
                // <Button className='me-1' color='primary' onClick={onBtnExport}> Download Excel </Button>
                <Button
                className='me-1'
                color='primary'
                onClick={generateExcel}
            >
                Download Excel
                </Button>
                }
                {pdfButton && <Button className='me-1' color='primary'  onClick={printGrid}>Print PDF </Button>}
              </div>
            </Row>
          </Form>
        </CardBody>
      </Card>

      {flag == true && <div className="ag-theme-alpine" >
        <AgGridReact
          ref={gridRef}
          rowData={rowData1}
          columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
          domLayout='autoHeight'
        />
      </div>}

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>
            Processing your request, please hold on...
          </h2>
          <CircularProgress color="inherit" />
        </div>
      </Backdrop>
    </div>
  )
}

export default Block
