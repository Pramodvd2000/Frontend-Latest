import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Modal, ModalBody, ModalHeader, Input } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
// import API_URL from '../../../../config'

import DASHBOARD_URL from '../../../../dashboard'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'



import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import logo from '@src/assets/images/logo/oterra.jpg'
// import { createRoot } from 'react-dom/client';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const MySwal = withReactContent(Swal)


import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';



const defaultValues = {
  frmdate: '',
  todate: '',
}


const ResEntryReport = () => {


  // AG Grid
  const [rowData1, setRowData1] = useState();
  const [flag, setFlag] = useState(false)
  const [flag1, setflag1] = useState(false)
  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null); 
  const [rowData, setRowData] = useState();
  const [data, setData] = useState(null)

  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [excelButton,setExcelButton] = useState(false);
  const [pdfButton,setPdfButton] = useState(false);
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })






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
  

  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
  };

  let navigate = useNavigate();
  const gridRef = useRef();
  const [InvURL, setInvURL] = useState([])


  function formatNumber(params) {
    const formattedNumber = Number(params.value).toLocaleString('en-IN');
    return formattedNumber;
  }
  

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Guest', field: 'Name', suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true },

    { headerName: 'B_ID', field: 'confirmationNumber', suppressSizeToFit: true, maxWidth: 102 },
    {
      headerName: "Arrival",
      field: "arrivalDate",
      suppressSizeToFit: true,
      maxWidth: 120,
      cellRenderer: (params) => {
        if (params.data && params.data.arrivalDate) {  
          const formattedDate = Moment(params.data.arrivalDate).format('DD MMM YY'); 
          return formattedDate;
        } else {
          return "";        
        }
      }
    },
    
    {
      headerName: "Departure",
      field: "departureDate",
      suppressSizeToFit: true,
      maxWidth: 120,
      cellRenderer: (params) => {
        if (params.data && params.data.departureDate) { 
          const formattedDate1 = Moment(params.data.departureDate).format('DD MMM YY'); 
          return formattedDate1;
        } else {
          return "";       
        }
      }
    }
    ,

    { headerName: 'Nts', field: 'numberOfNights', suppressSizeToFit: true, maxWidth: 75 },
    { headerName: 'Rms', field: 'numberOfRooms', suppressSizeToFit: true, maxWidth: 85 },

    { headerName: 'Room Rate', field: 'basePrice', suppressSizeToFit: true, maxWidth: 100,  autoHeaderHeight: true ,wrapHeaderText: true, },
    { headerName: 'Room Type', field: 'roomType', suppressSizeToFit: true, maxWidth: 90 , autoHeaderHeight: true ,wrapHeaderText: true},
  
   
    { headerName: 'Room Code', field: 'rateCode', suppressSizeToFit: true, maxWidth: 110 , autoHeaderHeight: true ,wrapHeaderText: true},

    { headerName: 'Mkt Code', field: 'marketCode', suppressSizeToFit: true, maxWidth: 90 , wrapText: true, autoHeaderHeight: true ,wrapHeaderText: true},
    { headerName: 'Reservation Status', field: 'reservationStatus', suppressSizeToFit: true, maxWidth: 120, wrapText: true, autoHeight: true ,  autoHeaderHeight: true ,wrapHeaderText: true },
    { headerName: 'Adlts', field: 'numberOfAdults', suppressSizeToFit: true, maxWidth: 85 },
    { headerName: 'Child', field: 'numberOfChildren', suppressSizeToFit: true, maxWidth: 85 },
    { headerName: 'Company', field: 'accountName', suppressSizeToFit: true, maxWidth: 120, wrapText: true, autoHeight: true  },
    { headerName: 'Group', field: 'groupName', suppressSizeToFit: true, maxWidth: 120 , wrapText: true},
    { headerName: 'Created At', field: 'createdAt', maxWidth: 200, autoHeaderHeight: true ,wrapHeaderText: true,autoHeight:true,wrapText:true },
    
    { headerName: 'Created By', field: 'createdBy', suppressSizeToFit: true, maxWidth: 150, wrapText: true, autoHeight: true , autoHeaderHeight: true ,wrapHeaderText: true}
   
   
  ]);



  const [hotelNo, setHotelNo] = useState(null);
  const [hotelFax, sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [businessDate,setBusinessDate] = useState(null);



  console.log(businessDate)


  useEffect(() => {
    const hotelID = JSON.stringify({
      hotelID: 10
    })
    fetchx(DASHBOARD_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelID
    }).then((res) => res.json())
    .then(rowData => {
      const logo = rowData.data[0].logo
      const number = rowData.data[0].phoneNumber
      const fax = rowData.data[0].fax
      setRowData(rowData['data'])
      sethotelAddress(rowData['data'][0].address)
      setHotelName(rowData['data'][0].name)
      setHotelNo(number)
      sethotelFax(fax)
      setLogo(logo)
      setBusinessDate(rowData.data[0].businessDate)
    })
  },[])
console.log(logoimage)

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




  const onButtonExport = () => {
    const rowData = [];
    gridRef.current.api.forEachNode((node) => rowData.push(node.data));
  
    if (rowData.length === 0) {
      handleError("No data available for export.");
      return; 
    }
  
    const params = {
      fileName: 'Reservation Pickup Report.xlsx',
      sheetName: 'Sheet1',
    };
  
    gridRef.current.api.exportDataAsExcel(params);
  };
  




const downloadPDF = async () => {

  if(!rowData1 || rowData1 === undefined || (rowData1.length === 0)  ){
    return handleError("No records are present for printing")
  }
  const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.date)));
  const doc = new jsPDF({ orientation: 'landscape' });

  try {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const logoWidth = 20;
    const xLogo = 10;
    const yLogo = 10;
    const logoHeight = 20;
    let startY = 40; // Start position for tables after headers

    doc.addImage(DASHBOARD_URL + `/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

    const margin = { left: 2, right: 2 };
    const currentDate = new Date();
    const formattedDateTime = formatDateTimeWithAMPM(currentDate);
    const paddingFromRight = 85;
    const dateX = pageWidth - doc.getStringUnitWidth(formattedDateTime) - paddingFromRight;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text("Generated Time " + formattedDateTime, dateX + 35, yLogo - 7);

    const setHotelInfo = (doc, textToCenter, yPosition, fontSize) => {
      doc.setFontSize(fontSize);
      const textWidth = doc.getStringUnitWidth(textToCenter) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const pageCenter = doc.internal.pageSize.width / 2;
      const textStartX = pageCenter - (textWidth / 2);
      doc.text(textToCenter, textStartX, yPosition);
    };

    setHotelInfo(doc, hotelName, yLogo, 16);
    setHotelInfo(doc, hotelAddress, yLogo + 8, 14);
    setHotelInfo(doc, "Reservation Entered On & By Report", yLogo + 16, 16);

    startY = 50; 

    const rowStructure = [
      ['Name', 'arrivalDate', 'numberOfNights', 'basePrice', 'rateCode', 'numberOfAdults', 'accountName', 'createdAt'],
      ['confirmationNumber', 'departureDate', 'numberOfRooms', 'roomType', 'marketCode', 'numberOfChildren', 'groupName', 'createdBy']
    ];

    const headerRow1 = ['Name', 'Arrival', 'Nights', 'Room Rate', 'Rate Code', 'Adults', 'Company / TA', 'Created At'];
    const headerRow2 = ['Confirmation No.', 'Departure', 'Rooms', 'Room Type', 'Market Code', 'Children', 'Group', 'Created By'];

    uniqueArrivalDates.forEach((date) => {
      const formattedArrivalDate = formatDate(new Date(date));
      const formattedbusinessDate = formatDate(new Date(businessDate));
      const formattedFrom = formatDateTimeWithAMPM(new Date(picker));
      const formattedTo = formatDateTimeWithAMPM(new Date(todatepicker));

      // Check if a new page is required for each section
      if (startY + 30 > pageHeight) {
        doc.addPage();
        startY = 20; // Set a lower Y for content on the new page
      }

      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.text(`Business Date: ${formattedbusinessDate}`, 10, startY - 5);
      doc.text(`Date: ${formattedArrivalDate}`, 10, startY + 5);
      doc.text(`Filters: [From Date : ${formattedFrom} To Date: ${formattedTo} ]`, 162, startY + 5);

      const rows = [];
      rowData1
        .filter((row) => row.date === date)
        .forEach((row) => {
          const entryRow = rowStructure.map(fields => 
            fields.map(field => field ? row[field] : '')
          );

          rows.push(...entryRow);

          // Add a blank row for spacing
          if (entryRow[1][0]) {
            rows.push(['', '', '', '', '', '', '', '']); // Blank row after each entry
          }
        });

      const columnStyles = {
        0: { cellWidth: 55, cellPadding: 1, overflow: 'linebreak' }, // Name
        1: { cellWidth: 25 }, // Arrival
        2: { cellWidth: 20, halign: 'center' }, // Nights
        3: { cellWidth: 30 }, // Room Rate
        4: { cellWidth: 30 }, // Rate Code
        5: { cellWidth: 25 , halign: 'center' },
        6: { cellWidth: 65, cellPadding: 1, overflow: 'linebreak' }, // Account Name
        7: { cellWidth: 55, cellPadding: 1, overflow: 'linebreak' }, // Group Name
      };

      doc.autoTable({
        head: [headerRow1, headerRow2],
        body: rows,
        startY: startY + 10,
        margin,
        styles: {
          cellPadding: 0.1,
          fontSize: 10,
          overflow: 'linebreak',
          fillColor: [255, 255, 255], // Body rows white
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255], // No alternate row colors for the body
        },
        headStyles: {
          fillColor: [69, 124, 169], // Blue background for header row
          textColor: [255, 255, 255], // White text for better contrast
        },
        columnStyles,
        didDrawPage: function(data) {
          const y = doc.internal.pageSize.getHeight() - 10;
          const x = doc.internal.pageSize.getWidth() - 150;
          doc.setFontSize(10);
          doc.text(`Page ${data.pageCount}`, x, y);
        },
      });

      // Adjust startY based on content height, maintaining the table fill on new pages
      startY = doc.autoTable.previous.finalY;
    });

    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Reservation Pickup Report.pdf';
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
};




function formatDate(date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().
        padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
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

    const currentDate = new Date();
    const formattedDateTimeWithAMPM = formatDateTimeWithAMPM(currentDate);


   


    const onSubmit = async (data) => {
        if (!picker || !todatepicker) {
          setflag1(false);
          return handleError("Enter the Mandatory fields");
        }
        
        setIsSubmitting(true);
        setOpen(true);
        setFlag(true);
        setData(data);
    
        let createmarketGroup = JSON.stringify({
          "startDate": Moment(new Date(picker)).format("YYYY-MM-DD HH:mm:ss"),
          "endDate": Moment(new Date(todatepicker)).format("YYYY-MM-DD HH:mm:ss")
        });
    
        try {
          const response = await fetch(DASHBOARD_URL + "/getReservationReport", {
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
          setIsSubmitting(false);
          setOpen(false);
        }
      };


    const handleReset = () => {
        setExcelButton(false)
        setPdfButton(false)
      setRowData1();
     // setflag1(false)
      reset({
        companyID: '',
      })
    }

  

 

    return (
      <div>

        <Card>
          <CardHeader>
            <CardTitle tag='h4'>Reservation Entry Report</CardTitle>
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
                  {/* <Button className='me-1' color='primary' type='submit' onClick={() => setflag1(true)}>
                    Submit
                  </Button> */}

<Button 
                className='me-1' 
                color='primary' 
                type='submit' 
                disabled={isSubmitting}
                onClick={() => {
                    setflag1(true);
                    setExcelButton(true);
                    setPdfButton(true);
                  }}
                  
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
                  <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                    Reset
                  </Button>
                  {excelButton && <Button className='me-1' color='primary' type='submit' onClick={onButtonExport}> Download Excel </Button>}
                  {pdfButton &&<Button className='me-1' color='primary' type='submit' onClick={downloadPDF}>Print to PDF
                  </Button>}
                  {/* <Button className='me-1' color='primary' type='submit' onClick={()=>setflag1(false)}>
                Download
              </Button> */}
                </div>
              </Row>
            </Form>
          </CardBody>
        </Card>

        {flag1 == true && <div className="ag-theme-alpine" >
          <AgGridReact
            ref={gridRef}
            rowData={rowData1}
            // rowData={updatedRowData}

            columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            paginationPageSize= '10'
            pagination = 'true'            
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            domLayout='autoHeight'
            autoHeaderHeight={true}
            autoHeight={true}
            // autoGroupColumnDef={autoGroupColumnDef}
            groupIncludeFooter={true}
            groupIncludeTotalFooter={true}

          />
        </div>}
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
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


  export default ResEntryReport
  
  
 
