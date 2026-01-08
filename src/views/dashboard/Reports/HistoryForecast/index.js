import { useState } from "react";
import "cleave.js/dist/addons/cleave-phone.us";
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Moment from 'moment'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import { useForm, Controller } from 'react-hook-form'

// Import ag-grid
// import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from 'react';
import DASHBOARD_URL from "../../../../dashboard";
import { Button, Card, CardHeader, CardTitle, Row, Col, Input, Form, Label, CardBody } from 'reactstrap'
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)


const AvailabilityMatrix = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedOption, setselectedOption] = useState('Date')
  const [data, setData] = useState(null);
  const gridRef = useRef();
  const [flag, setFlag] = useState(false);
  const { reset, handleSubmit, control, watch } = useForm({})
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [hotelAddress, setHotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [DataForPDF, setDataForPDF] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [LoadingVar,setLoadingVar] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [businessDate,setbusinessDate] = useState (null)



  //API to get hotel details
  useEffect(() => {

    fetchx(DASHBOARD_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())
      .then(postres => {
        setbusinessDate(postres['data'][0]['businessDate'])
        setHotelDetails(postres['data'])
        setHotelAddress(postres['data'][0]['address'])
        setHotelName(postres['data'][0]['name'])
        setHotelNo(postres['data'][0]['phoneNumber'])
        sethotelFax(postres['data'][0]['fax'])
        setLogo(postres['data'][0]['logo'])
      })

  }, [])


  function getMonthName(monthNumber) {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return monthNames[monthNumber - 1] || '';
  }

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ''; // Return empty string if the date is invalid
    }
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getRowStyle = (params) => {
    console.log(params)
    if (params.data.date ==="Total") { // Assuming 'Total' row can be identified with a specific field
      return { fontWeight: 'bold' };
    }
    if (params.data.date ==="SubTotal") { // Assuming 'Total' row can be identified with a specific field
      return { fontWeight: 'bold' };
    }
    if (params.data.date === businessDate) {
      return { fontWeight: 'bold', backgroundColor: '#8F9AB3' }; 
    }
    
    return null;
  };
  
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Date',
      field: 'date',
      maxWidth: 90,
      cellRenderer: (params) => {
        const dateValue = params.value;
        if (!dateValue) return '';
        
        const isYearMonthFormat = /^\d{4}.\d{2}$/.test(dateValue);
        const isYearMonthDayFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateValue);
  
        if (isYearMonthDayFormat) {
          const [year, month, day] = dateValue.split('-');
          return `${day}.${month}.${year}`;
        } else if (isYearMonthFormat) {
          const [year, month] = dateValue.split('-');
          const monthName = getMonthName(Number(month));
          return `${monthName} ${year}`;
        }
  
        return dateValue;
      },
    },
    {
      headerName: 'Day',
      field: 'date',
      maxWidth: 70,
      cellStyle: { textAlign: 'center' },
      cellRenderer: (params) => {
        return getDayOfWeek(params.value);
      },
      
    },
    { 
      headerName: 'TOCC', 
      field: 'TotalOcc', 
      maxWidth: 80, 
      cellStyle: { textAlign: 'right' },
    },
    { headerName: 'POCC', field: 'PaidRooms', maxWidth: 80  ,cellStyle: { textAlign: 'right' },},
    { headerName: 'Grp', field: 'GrpCount', maxWidth: 80  ,cellStyle: { textAlign: 'right' },},


    { headerName: 'AR', field: 'ArrRooms', maxWidth: 70 ,cellStyle: { textAlign: 'right' }, },
    { headerName: 'DU', field: 'DayUse', maxWidth: 70  ,cellStyle: { textAlign: 'right' },},
    { headerName: 'HU', field: 'HouseUse', maxWidth: 70 ,cellStyle: { textAlign: 'right' }, },
    { headerName: 'Comp', field: 'Complimentary', maxWidth: 80 ,cellStyle: { textAlign: 'right' }, },
    { headerName: 'OOD', field: 'OOD', maxWidth: 70  ,cellStyle: { textAlign: 'right' },},
    { headerName: 'OOS', field: 'OOS', maxWidth: 70  ,cellStyle: { textAlign: 'right' },},
    // { headerName: 'Occ%', field: 'OccPercentage', maxWidth: 80 ,cellStyle: { textAlign: 'right' }, },
    {
      headerName: 'Occ%',
      field: 'OccPercentage',
      maxWidth: 80,
      cellStyle: { textAlign: 'right' },
      valueFormatter: params => params.value != null ? `${params.value}%` : '',
  },
    {
      headerName: 'Room Rev',
      field: 'roomRevenue',
      cellStyle: { textAlign: 'right' },
      width: 100,
      valueFormatter: (params) => {
        const amount = params.value; // Assuming the revenue value is in the 'Revenue' field

        if (typeof amount !== 'number') {
          return amount; // Return original value if it's not a number
        }

        const formattedAmount = amount.toLocaleString('en-IN'); // Format number based on Indian system
        return formattedAmount;
      },
    },
    {
      headerName: 'Pkg Rev',
      field: 'packageRevenue'
      ,cellStyle: { textAlign: 'right' },
      width: 100,
      valueFormatter: (params) => {
        const amount = params.value; // Assuming the revenue value is in the 'Revenue' field

        if (typeof amount !== 'number') {
          return amount; // Return original value if it's not a number
        }

        const formattedAmount = amount.toLocaleString('en-IN'); // Format number based on Indian system
        return formattedAmount;
      },
    },
    {
      headerName: 'AvgRate', field: 'AvgRate', maxWidth: 100 ,cellStyle: { textAlign: 'right' },
      valueFormatter: (params) => {
        const amount = params.value; // Assuming the revenue value is in the 'Revenue' field

        if (typeof amount !== 'number') {
          return amount; // Return original value if it's not a number
        }

        const formattedAmount = amount.toLocaleString('en-IN'); // Format number based on Indian system
        return formattedAmount;
      },
    },
    {
      headerName: 'Total Rev',
      field: 'Revenue'
      ,cellStyle: { textAlign: 'right' },
      width: 120,
      valueFormatter: (params) => {
        const amount = params.value; // Assuming the revenue value is in the 'Revenue' field

        if (typeof amount !== 'number') {
          return amount; // Return original value if it's not a number
        }

        const formattedAmount = amount.toLocaleString('en-IN'); // Format number based on Indian system
        return formattedAmount;
      },
    },
    
    { headerName: 'Dept', field: 'Departures', maxWidth: 70  ,cellStyle: { textAlign: 'right' },},
    { headerName: 'NS', field: 'NoShow', width: 70 ,cellStyle: { textAlign: 'right' }, },
    { headerName: 'Can', field: 'Cancelled', width: 70 ,cellStyle: { textAlign: 'right' }, },
    {
      headerName: "Adl.& Chl.",
      field: "AdultsChildren",
      valueGetter: (params) => {
        const Adults = params.data.Adults != null ? params.data.Adults : '';  // If Adults is null/undefined, use an empty string
        const Clrn = params.data.Children != null ? params.data.Children : '';  // Handle null/undefined for Children
        console.log(Clrn);
        return `${Adults} / ${Clrn}`;
      },
      suppressSizeToFit: true,
      maxWidth: 120,
      cellStyle: { textAlign: 'right' }
    }
    // { headerName: 'Adults', field: 'Adults', maxWidth: 80  ,cellStyle: { textAlign: 'right' },},
    // { headerName: 'Clrn', field: 'Children', maxWidth: 70 ,cellStyle: { textAlign: 'right' }, },
    // { headerName: 'Comp', field: 'Complimentary', maxWidth: 80 ,cellStyle: { textAlign: 'right' }, },

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


  const pinnedBottomRowData = useMemo(() => {
    return createData(1, 'Bottom');
  }, []);


  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      // filter: true,
      // filterParams: {
      //   buttons: ['apply', 'reset']
      // }
    }
  ));


  const handleTransferTransaction = (event) => {
    console.log(event)
    setselectedOption(event.target.value)
  }


  const ConfirmSubmit = (data) => {
    setIsButtonClicked(true)
    const filterFromDate = Moment(data.FromDate[0]).format("YYYY-MM-DD");
    const filterToDate = Moment(data.ToDate[0]).format("YYYY-MM-DD");
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    setData(data);
    setFlag(true);
    setRowData([]);
  
    let loadingTimeout = setTimeout(() => {
      setLoadingVar(true);
    }, 1000); // Set loadingVar to true if the API call takes more than 2 seconds
  
    fetchx(DASHBOARD_URL + '/getHistoryandForecast', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
        FromDate: filterFromDate,
        ToDate: filterToDate,
        DateOrMonth: selectedOption,
      }),
    })
      .then(result => result.json())
      .then(resp => {
        if(resp['statusCode'] == 200) {
          setIsButtonClicked(false)
        clearTimeout(loadingTimeout); // Clear the timeout if the response comes before 2 seconds
        setLoadingVar(false);
        setDataForPDF(resp['data']);
        setRowData(resp['data']);
        }
        // if(resp['statusCode'] == 403 || resp['statuscode'] == 403) {
        //   setLoadingVar(false)
        //   setIsButtonClicked(false)
        //   clearTimeout(loadingTimeout); 
        //   setLoadingVar(false);
        //   const swalInstance = MySwal.fire({
        //     text: resp['message'],
        //     buttonsStyling: false,
        //     confirmButtonText: 'Close',
        //     customClass: {
        //       confirmButton: 'btn btn-danger',
        //     },
        //   });
        //   swalInstance.then((result) => {
        //     if (result.isConfirmed) {

        //     }
        //   });
        // }
        if (resp['statusCode'] == 403 || resp['statuscode'] == 403) {
          setLoadingVar(false);
          setIsButtonClicked(false);
          clearTimeout(loadingTimeout); 
          setLoadingVar(false);
          
          let message = resp['message'];
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

            }
          });
        }
        
      })
      .catch((error) => {
        setIsButtonClicked(false)
        clearTimeout(loadingTimeout); // Clear the timeout in case of an error
        console.log(error);
        setLoadingVar(false);
      });
  };
  


  const cellClickedListener = useCallback(event => {

  }, []);


  const params = {
    fileName: 'HistoryForecast', // Set your desired file name here
  };



  // const onBtnExport = useCallback(() => {
  //   gridRef.current.api.exportDataAsCsv(params);
  // }, []);

  const onBtnExport = useCallback(() => {
    const gridApi = gridRef.current && gridRef.current.api;
  
    if (gridApi) {
      let rowData = gridApi.getDataAsCsv(params);
      const headerRow = rowData.substring(0, rowData.indexOf('\n'));
      const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
      const cleanDataRows = dataRows.replace(/"/g, '');
      let rows = cleanDataRows.split('\n').map(row => row.split(','));
      const getDayOfWeek = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return ''; 
        }
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      };
  
      const formatDate = (dateString) => {
        const dateParts = dateString.split('-');
        
        if (dateParts.length === 2) {
          // Format: YYYY-MM
          const year = dateParts[0];
          const month = parseInt(dateParts[1], 10);
          return new Date(year, month - 1).toLocaleString('en-US', { month: 'short', year: 'numeric' });
        } else if (dateParts.length === 3) {
          // Format: YYYY-MM-DD
          const year = dateParts[0];
          const month = String(parseInt(dateParts[1], 10)).padStart(2, '0');
          const day = String(dateParts[2]).padStart(2, '0');
          return `${day}.${month}.${year}`;
        }
        return dateString; // Return as is if format doesn't match
      };
  
      rows = rows.map(row => {
        const dateField = row[1];
        row[1] = getDayOfWeek(dateField);
  
        // Format date based on the string format
        if (row[0]) {
          row[0] = formatDate(row[0]);
        }
  
        // Add a marker (*) to rows with 'Total' or 'businessdate' in the first column
        if (row[0].toLowerCase().includes('total') || row[0].toLowerCase().includes('businessdate')) {
          row[0] = '*' + row[0];
        }
        const occPercentageIndex = 11;
        if (occPercentageIndex < row.length && !isNaN(parseFloat(row[occPercentageIndex]))) {
            row[occPercentageIndex] += '%';
        }
        return row;
      });
      const updatedRowData = [headerRow, ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([updatedRowData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'History_And_Forecast_Report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);
  

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
      const pageWidth = pdf.internal.pageSize.getWidth();
      const logoWidth = 20;
      const xLogo = 10; // X-coordinate for the logo
      const yLogo = 10; // Y-coordinate for the logo
      const logoHeight = 20;
      let dateY = 10;

      // Add logo
      pdf.addImage(DASHBOARD_URL + `/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);
      const formatDates = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedTime = `${(hour % 12) || 12}:${minute} ${period}`;
        return `${day}.${month}.${year} ${formattedTime}`;
      };
    const margin = { left: 10, right: 10 };
    const currentDate = new Date();
    const formattedDate = formatDates(currentDate);
    const paddingFromcenter = 85;
    const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromcenter;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);
    
      // Helper function to get the day of the week from a date string
      const getDayOfWeek = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return ''; // Return empty string if the date is invalid
        }
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      };
  
      // Set hotel information
      const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo, fontSize) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'normal');
      
      const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      const pageCenter = pdf.internal.pageSize.width / 2;
        const textStartX = Math.max(0, pageCenter - textWidth / 2);
      pdf.text(`${textToCenter}`, textStartX, yLogo);
    };
    
      // Set hotel name and address
      setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo, 14);
      setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8, 12);
  
      // Set report title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      const reportTitle = "History and Forecast Report";
      const reportTitleWidth = pdf.getStringUnitWidth(reportTitle) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      const reportTitleX = (pageWidth - reportTitleWidth) / 2;
      pdf.text(reportTitle, reportTitleX, yLogo + 16);
  
      const formatDate = (dateString) => {
        const dateParts = dateString.split('-');
        if (dateParts.length === 2) {
          // For "YYYY-MM" format
          const [year, month] = dateParts;
          const date = new Date(year, parseInt(month) - 1);
          return date.toLocaleString('default', { month: 'short', year: 'numeric' });
        } else if (dateParts.length === 3) {
          // For full date format
          const date = new Date(dateString);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear().toString().slice(-2); 
          return `${month}/${day}/${year}`;
        }
        // Return original string if it doesn't match expected formats
        return dateString;
      };
  
    
  
      // Modify rows: convert 'Day' field from date to day of the week
      rows.forEach(row => {
        const dateField = row[1]; // Assuming the 'Day' field is at index 1
        row[1] = getDayOfWeek(dateField); // Replace date with day of the week
  
        row[0] = formatDate(row[0]);
  
        for (let i = 10; i < row.length - 4; i++) {
          if (!isNaN(parseFloat(row[i])) && isFinite(row[i])) {
            let formattedValue = parseFloat(row[i]).toLocaleString('en-IN');
            // Check if there are no decimals and add '.00' if needed
            if (!/\./.test(formattedValue)) {
              formattedValue += '.00';
            } else if (/\.(\d)$/.test(formattedValue)) {
              // Check if there's only one decimal and add another zero
              formattedValue += '0';
            }
            row[i] = formattedValue;
          }
        }
        const occPercentageIndex = 11; // Adjust this index based on the actual column position
            if (!isNaN(parseFloat(row[occPercentageIndex]))) {
                row[occPercentageIndex] += '%'; // Append % symbol
            }
      });

      // Create the table with autoTable
      pdf.autoTable({
        head: [cleanHeaderRow.split(',').map(value => value.trim())],
        body: rows,
        startY: 40,
         columnStyles: {
            0: { cellWidth: 18 } 
          },
        didParseCell: (data) => {
          if (data.row.raw[0] === 'Total') {
            // data.cell.styles.fillColor = [220, 220, 220];
            data.cell.styles.fontStyle = 'bold';
          }
          // if (params.data.date ==="SubTotal") { // Assuming 'Total' row can be identified with a specific field
          //   return { fontWeight: 'bold' };
          // }
           if (data.row.raw[0] === 'SubTotal') {
            // data.cell.styles.fillColor = [220, 220, 220];
            data.cell.styles.fontStyle = 'bold';
          }
          if (data.column.index !== 0) {
            data.cell.styles.halign = 'right';
          }
  
          const businessDateIndex = 0; 
          if (data.row.raw[businessDateIndex] === formatDate(businessDate)) {
            data.cell.styles.fontStyle = 'bold'; // Bold the text
            data.cell.styles.fillColor = [143, 154, 179];
          }
        }
      });

      const availableSpace = pdf.internal.pageSize.height - dateY;

      if (availableSpace < 30) {
        pdf.addPage();
        dateY = 10;
      }

      dateY = pdf.autoTable.previous.finalY + 15;
  
      const fromDate = formatDate(filterFromDate);
      const toDate = formatDate(filterToDate);
  
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      pdf.text(`Filter From Date: ${fromDate}`, 10, dateY + 10);
      pdf.text(`To Date: ${toDate}`, 10, dateY + 20);
  
      // Add page numbers
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        const pageNumber = `Page ${i} of ${totalPages}`;
        const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const xPos = (pageWidth - pageNumberWidth) / 2;
        pdf.text(pageNumber, xPos, pdf.internal.pageSize.height - 10);
      }

      pdf.save('History_And_Forecast_Report.pdf');
    }
  };
  





  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4"><b>History And Forecast</b></CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(ConfirmSubmit)}>
            <Row>
              <Col md='2' sm='2'>
                <div className='mb-1'>
                  <Label className='form-label' for='FromDate'>
                    From Date <spam style={{ color: 'red' }}>*</spam>
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
                        placeholder='YYYY-MM-DD '
                        className={classnames('form-control', {
                          'is-invalid': data !== null && data.FromDate === null
                        })}
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md='2' sm='2' >
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
              <Col md='2' sm='2' className='mb-1'style={{paddingTop:'20px'}}>
              <Row>
             
                <Label className='form-check-label' for='ex1-active'>
                  <Input type="radio" name='ex1' value="Date" checked={selectedOption === 'Date'} onChange={handleTransferTransaction} />
                  &nbsp;&nbsp;Date wise
                </Label>
              {/* </Col>
              <br></br>
              <Col md='2' sm='2' className='mb-1'> */}
                <Label className='form-check-label'>
                  <Input type="radio" name='ex1' value="Month" checked={selectedOption === 'Month'} onChange={handleTransferTransaction} />
                  &nbsp;&nbsp;Month wise
                </Label>
              
              </Row>
              </Col>
              <Col md='4' sm='4' className='mb-1' style={{paddingTop:'30px'}}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button className="me-1" color="primary" type="submit" disabled={isButtonClicked}>
              {/* Submit */}
              {isButtonClicked ? 'Processing...' : 'Submit'}

            </Button>

  {flag == true && (
    <div style={{ display: 'flex' }}>
      <Button
        style={{marginRight:'15px'}}
        color="primary"
        
        onClick={onBtnExport}
      >
        Download Excel
      </Button>
      <Button
       
        color="primary"
        onClick={printGrid}
      >
        Print to PDF
      </Button>
    </div>
  )}
</div>

              </Col>
            </Row>

            <Row>
              {/* <Col md='3' sm='3' className='mb-1'>
                <Label className='form-check-label' for='ex1-active'>
                  <Input type="radio" name='ex1' value="Date" checked={selectedOption === 'Date'} onChange={handleTransferTransaction} />
                  &nbsp;&nbsp;Date wise
                </Label>
              </Col>
              <br></br>
              <Col md='3' sm='3' className='mb-1'>
                <Label className='form-check-label'>
                  <Input type="radio" name='ex1' value="Month" checked={selectedOption === 'Month'} onChange={handleTransferTransaction} />
                  &nbsp;&nbsp;Month wise
                </Label>
              </Col> */}
              {/* <Col md='6' sm='6' className='mb-1'>
              <div align="end" className="buttons">
                <Button className="me-1" color="primary" type="submit">
                  Submit
                </Button>

                {flag == true && (
                  <Button
                    className="me-1"
                    color="primary"
                    type="submit"
                    onClick={onBtnExport}
                  >
                    {" "}
                    Download Excel{" "}
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
              </Col> */}
            </Row>
          </Form>
        </CardBody>
      </Card>

     {flag == true &&  <div className="ag-theme-alpine" style={{ height: 'auto' }}>
     <AgGridReact
  ref={gridRef}
  rowData={rowData}
  columnDefs={columnDefs}
  animateRows={true}
  rowSelection="multiple"
  onCellClicked={cellClickedListener}
  paginationPageSize={10}
  defaultColDef={{
    headerClass: 'header-right',
    cellStyle: { padding: '0px', margin: '0px' }, // Remove padding/margin from cells
    resizable:true
  }}
  headerColor="ddw-primary"
  pinnedBottomRowData={pinnedBottomRowData}
  rowHeight={25} // Set the row height here
  headerHeight={30} // Set the header row height
  domLayout="autoHeight" // Enable auto height
  gridOptions={{
    suppressCellSelection: true,
    rowStyle: { padding: '0px', margin: '0px' }, // Remove padding/margin from rows
  }}
  style={{
    padding: '0px', // Remove padding for the entire grid
    margin: '0px',
  }}
  components={{
    headerComponentFramework: () => (
      <div style={{ padding: '0px', margin: '0px' }}>Header</div>
    ), // Example header component with no padding/margin
  }}
  getRowStyle={getRowStyle}

/>


      </div>}

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={LoadingVar}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                    Please wait... We're processing your request,
                    </h1>
                    {(
                      <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                       which may take a little longer due to additional data. Please be patient!
                      </h1>
                    )}
                    <CircularProgress color="inherit" />
                  </div>
                </Backdrop>
    </div>
  );
};

export default AvailabilityMatrix;
