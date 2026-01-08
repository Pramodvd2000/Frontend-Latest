// ** React Imports
import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Modal, ModalBody, ModalHeader } from 'reactstrap'
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
import Select from "react-select";
import { selectThemeColors } from "@utils";

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import logo from '@src/assets/images/logo/oterra.jpg'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';

const MySwal = withReactContent(Swal)

const defaultValues = {
  frmdate: ''
}

const CformReport = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [rowData1, setRowData1] = useState();
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);

  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })

  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD'))
  };
  const gridRef = useRef();

  // const gridRef = useRef();


  // useEffect(() => {
  //   setOpen(true)
  //   fetchx(API_URL + "/getCFormReport", {
  //     method: "POST",
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       hotelID: '10',
  //       //   "startDate" :null,
  //     })
  //   })
  //     .then(result => result.json())
  //     .then(rowData => {
  //       if(rowData['statusCode'] == 200) {
  //         setOpen(false)
  //       // console.log(rowData['data']);
  //       // console.log(res["data"][0]);
  //       setRowData1(rowData["data"])
  //       }
  //     })

  // }, [])

  const [columnDefs, setColumnDefs] = useState([
    // {headerName: 'Hotel ID',field: 'hotelID',suppressSizeToFit: true,maxWidth: 160},
    { headerName: 'Passport', field: 'maskedPassportNumber', suppressSizeToFit: true, maxWidth: 180 },
    { headerName: 'Room Number ', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 180 },
    { headerName: 'Guest Name', field: 'guestName', suppressSizeToFit: true, maxWidth: 190 },
    //{headerName: 'BillNo',field: 'arrivalDate',suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Address', field: 'AddressOne', suppressSizeToFit: true, width: 300 },
    // {headerName: 'Nights',field: 'numberOfNights',suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Nationality', field: 'nationalityName', suppressSizeToFit: true, maxWidth: 200 },
    {
      headerName: "Arrival",
      field: "arrivalDate",
      suppressSizeToFit: true,
      maxWidth: 140,
      cellRenderer: (params) => {
        // Ensure the arrivalDate field exists in the row data        
        if (params.data && params.data.arrivalDate) {
          // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
          const formattedDate = Moment(params.data.arrivalDate).format("DD-MM-YYYY");
          return formattedDate;
        } else {
          return ""; // Handle cases where the data is missing or invalid        
        }
      }
    },

    {
      headerName: 'Departure  ', field: 'departureDate', suppressSizeToFit: true, maxWidth: 170, cellRenderer: (params) => {
        // Ensure the arrivalDate field exists in the row data        
        if (params.data && params.data.departureDate) {
          // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
          const formattedDate = Moment(params.data.departureDate).format("DD-MM-YYYY");
          return formattedDate;
        } else {
          return ""; // Handle cases where the data is missing or invalid        
        }
      }
    },


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
    // console.log('cellClicked', event);

  }, []);


  // ** State
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const [flag1, setflag1] = useState(false)
  const [ShowDummyInvPDF, setShowDummyInvPDF] = useState(false)
  const [DummyInvURL, setDummyInvURL] = useState([])
  const [InvURL, setInvURL] = useState([])
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedIdsString, setSelectedIdsString] = useState('');
  const [companyData, setCompanyData] = useState([]);


  // ** Hooks
  let navigate = useNavigate();




  const onButtonExport = () => {
    const params = {
      fileName: 'C form Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };


 
  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null); 
  // const [rowData, setRowData] = useState();
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
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
      setRowData(rowData['data'])
      console.log(rowData['data'][0])
      console.log(rowData['data'][0].name)
      sethotelAddress(rowData['data'][0].address)
      setHotelName(rowData['data'][0].name)
      setHotelNo(rowData['data'][0]['phoneNumber'])
      sethotelFax(rowData['data'][0]['fax'])
      setLogo(rowData['data'][0]['logo'])
    })
  },[])
console.log(hotelName)

console.log(hotelAddress)

  const downloadPDF = async (data) => {
    const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.arrivalDate)));
    let fromDate = Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD");
    let toDate = Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD");
    const doc = new jsPDF({ orientation: 'landscape' });
  
    try {
      
  const pageWidth = doc.internal.pageSize.getWidth();
const logoWidth = 20;
const xLogo = 10; // X-coordinate for the logo
const yLogo = 10; // Y-coordinate for the logo
const logoHeight = 20;
let startY = 20;

// doc.addImage(logo, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

const margin = { left: 10, right: 10 };
// const currentDate = new Date();
//       const formattedDateTime = formatDateTimeWithAMPM(currentDate);
// const paddingFromRight = 85;
// const dateX = pageWidth - doc.getStringUnitWidth(formattedDateTime) - paddingFromRight;
// doc.setFontSize(8);
// doc.setFont('helvetica', 'normal');
// doc.text("Generated Time " + formattedDateTime, dateX + 35, startY - 7);

// doc.setFontSize(14);
// doc.setFont('helvetica', 'normal');
// const hotelNameX = xLogo + logoWidth + 108; // Adjust as needed for spacing
// doc.text(`${hotelName}`, hotelNameX, yLogo + 3);

// doc.setFontSize(12);
// doc.setFont('helvetica', 'normal');
// const hotelAddressX = xLogo + logoWidth + 60; // Adjust as needed for spacing
// doc.text(`${hotelAddress}`, hotelAddressX, yLogo + 9);
doc.addImage(`https://testpms.ms-tech.in/v8/pms-backend-prod/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

// pdf.addImage(Logo, "JPEG", xCenter, 10, logoWidth, logoHeight);
const currentDate = new Date();
const formattedDate = formatDateTimeWithAMPM(currentDate);
const paddingFromRight = 85;
const dateX = pageWidth - doc.getStringUnitWidth(formattedDate) - paddingFromRight;
doc.setFontSize(8);
doc.setFont('helvetica', 'normal');
doc.text("Generated Time " + formattedDate, dateX + 35, startY - 7);


//   // Handle other hotelIds if needed
const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo, fontsize) => {
  // Set font size and style
  doc.setFontSize(fontsize);
  doc.setFont('helvetica', 'normal');

  // Calculate the width of the text
  const textWidth = doc.getStringUnitWidth(textToCenter) * doc.internal.getFontSize() / doc.internal.scaleFactor;

  // Calculate the starting X-coordinate to center the text
  const pageCenter = doc.internal.pageSize.width / 2;
  const halfTextWidth = textWidth / 2;

  // Adjust the starting X-coordinate based on the text length
  let textStartX = pageCenter - halfTextWidth;

  // Ensure the text doesn't overflow the page
  if (textStartX < 0) {
    textStartX = 0; // Set a minimum X-coordinate
  } else if (textStartX + textWidth > doc.internal.pageSize.width) {
    textStartX = doc.internal.pageSize.width - textWidth; // Adjust to fit within the page
  }

  // Draw the text on the doc
  doc.text(`${textToCenter}`, textStartX, yLogo); // Adjust the y position as needed
};



// Set hotel name
doc.setFontSize(14);
doc.setFont('helvetica', 'normal');
setHotelInfo(doc, hotelName, xLogo, logoWidth, yLogo, 14);

doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
setHotelInfo(doc, hotelAddress, xLogo, logoWidth, yLogo + 8, 12); // Adjust the y position as needed
const textToCenter = "C Form Report";

// Set font size and style
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');

// Calculate the width of the text
const textWidth = doc.getStringUnitWidth(textToCenter) * doc.internal.getFontSize() / doc.internal.scaleFactor;

// Calculate the starting X-coordinate to center the text
const pageCenter = doc.internal.pageSize.width / 2;
const halfTextWidth = textWidth / 2;

// Adjust the starting X-coordinate based on the text length
let textStartX = pageCenter - halfTextWidth;

// Ensure the text doesn't overflow the page
if (textStartX < 0) {
  textStartX = 0; // Set a minimum X-coordinate
} else if (textStartX + textWidth > doc.internal.pageSize.width) {
  textStartX = doc.internal.pageSize.width - textWidth; // Adjust to fit within the page
}

// Y-coordinate for the text element
const textY = yLogo + 16;

// Draw the text at the calculated center position
doc.text(textToCenter, textStartX, textY);
doc.setFontSize(12);
doc.setFont('helvetica', 'bold');

startY = 40;
  
      // Iterate through each unique arrival date and generate a table
      uniqueArrivalDates.forEach((arrivalDate, index) => {
        const rows = rowData1
          .filter((row) => row.arrivalDate === arrivalDate)
          .map((row) => {
            // Format arrivalDate and departureDate here
            const formattedArrival = Moment(new Date(row.arrivalDate)).format("DD.MM.YYYY")
            const formattedDeparture = Moment(new Date(row.departureDate)).format("DD.MM.YYYY")
            // Include the formatted dates in the row
            return {
              ...row,
              arrivalDate: formattedArrival,
              departureDate: formattedDeparture,
            };
          })
          .map((row) => columnDefs.map((column) => row[column.field]));
        const columns = columnDefs.map((column) => column.headerName);
  
        // Calculate the total count for the current date
  
        // Add table title with the arrival date and total count
  
        const spaceLeftForDate = doc.internal.pageSize.height - (startY + 20 + margin.bottom);
        if (spaceLeftForDate < 0) {
          doc.addPage();
          startY = margin.top;
        }
  
        doc.setFont('times', 'bold');
        doc.text(`Date: ${Moment(String(new Date(arrivalDate))).format("DD.MM.YYYY")}`, 10, startY + 5, {
          width: 500,
          align: 'left',
        });
  
        const spaceLeft = doc.internal.pageSize.height - (startY + 20 + margin.bottom);
  
        // If the space is not enough, add a new page
        if (spaceLeft < 0) {
          doc.addPage();
          startY = margin.top;
        }
  
        doc.autoTable({
          head: [columns],
          body: rows,
          startY: startY + 10, // Adjust for additional space between tables
          margin,
        });
        doc.line(margin.left, doc.autoTable.previous.finalY + 2, doc.internal.pageSize.width - margin.right, doc.autoTable.previous.finalY + 2);
  
        const totalCount = rows.length;
  
        // Add total count below the table
        doc.setFont('times', 'normal');
        doc.text(`Total Count: ${totalCount}`, 255, doc.autoTable.previous.finalY + 10, {
          width: 500,
          align: 'left',
        });
  
        // Update startY for the next table
        startY = doc.autoTable.previous.finalY + 20;
  
        if (index === uniqueArrivalDates.length - 1) {
          if (fromDate && toDate) {
            const fromDateNew = Moment(new Date(fromDate)).format("DD.MM.YYYY");
            const toDateNew = Moment(new Date(toDate)).format("DD.MM.YYYY");
  
            // Add page number for the last page
            for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
              doc.setPage(i); // Set the active page
              doc.setFontSize(10); // Set font size for page number
  
              const pageNumber = `Page ${i} of ${doc.internal.getNumberOfPages()}`;
              const pageNumberWidth = doc.getStringUnitWidth(pageNumber) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  
              // Calculate position for center alignment
              const pageCenter = doc.internal.pageSize.width / 2;
              const xPos = pageCenter - (pageNumberWidth / 2);
              const yPos = doc.internal.pageSize.height - 10; // 10 units from the bottom
  
              doc.text(pageNumber, xPos, yPos);
            }

            const availableSpace = doc.internal.pageSize.height - startY;
            if (availableSpace < 30) {
            doc.addPage(); 
            startY = 10;
      }
  
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');  

            doc.text(`Filter:`, 20, startY + 10, { width: 500, align: 'left', });
            doc.text(`Arrival Date: From ${fromDateNew} To ${toDateNew}`, 20, startY + 20, { width: 500, align: 'left' });
            doc.setFont('times', 'normal'); // Reset font style to normal for subsequent text
          }
        } 
      });
  
      const pdfBlob = doc.output('blob');
      saveAs(pdfBlob, 'C Form Report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
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

  const currentDate = new Date();
  const formattedDateTimeWithAMPM = formatDateTimeWithAMPM(currentDate);

  console.log(formattedDateTimeWithAMPM);



  const onSubmit = data => {
    setIsButtonClicked(true)
    setOpen(true)
    setFlag(true);
    setData(data);



    let createmarketGroup = JSON.stringify({
      "hotelID": 10,
      "startDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
      "endDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD"),
    });

    const filterFromDate = Moment(data.frmdate[0]).format("YYYY-MM-DD");
    const filterToDate = Moment(data.todate[0]).format("YYYY-MM-DD");
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);

    if (flag1) {
      fetchx(DASHBOARD_URL + "/getCFormReport", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      })
        .then(data => data.json())
        .then((res) => {
          if(res['statusCode'] == 200) {
            setIsButtonClicked(false)
            setOpen(false)
          setRowData1(res["data"]);
          }
        })
        .catch(error => {
          setIsButtonClicked(false)
          console.error('Error fetching data:', error);
        });
    }
  };


  const handleReset = () => {
    reset({
      frmdate: '',
      todate: '',
      // "nationality": ''
    })
  }
  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('C Form Report'); // Updated report name
  
      // Use the columnDefs to define the columns for the Excel sheet
      const columns = [
        { header: 'Passport', key: 'maskedPassportNumber', width: 15 },
        { header: 'Room Number', key: 'roomNumber', width: 10 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Address', key: 'AddressOne', width: 30 },
        { header: 'Nationality', key: 'nationalityName', width: 20 },
        { header: 'Arrival', key: 'arrivalDate', width: 20 },
        { header: 'Departure', key: 'departureDate', width: 20 },
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'C Form Report']); // Updated report name
      worksheet.addRow(['Filter From Date:', filterFromDate]);
      worksheet.addRow(['To Date:', filterToDate]);
  
      worksheet.addRow();
      worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
      for (let i = 1; i <= 5; i++) {
        worksheet.getRow(i).font = { bold: true };
      }
  
      worksheet.spliceRows(1, 1);

      rowData1.forEach((row) => {
        worksheet.addRow({
          maskedPassportNumber: row.maskedPassportNumber, // Ensure this key matches your data
          roomNumber: row.roomNumber,
          guestName: row.guestName,
          AddressOne: row.AddressOne,
          nationalityName: row.nationalityName,
          arrivalDate: row.arrivalDate,
          departureDate: row.departureDate,
        });
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `C Form Report_${formattedDate}.xlsx`); // Updated report name
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
      {/* <img className='fallback-logo' src={logo} alt='logo' /> */}


      <Card>
        <CardHeader>
          <CardTitle tag='h4'>C Form Report</CardTitle>
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
                      required
                        {...field}
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
                        // value={data1['dob']}
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

              <div className='d-flex'>
                <Button className='me-1 ms-auto' color='primary' type='submit' onClick={() => setflag1(true)} disabled={isButtonClicked}>
                {isButtonClicked ? 'Processing...' : 'Submit'}
                </Button>
                {/* <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                  Reset
                </Button> */}

                {/* <Button className='me-1 ms-auto' color='primary' type='submit' onClick={onBtnExport}>
  CSV 
</Button> */}
                {/* <Button className='me-1' color='primary' type='submit' onClick={onButtonExport}>
                  Download Excel
                </Button> */}
                 <Button
              className='me-1'
              color='primary'
              onClick={generateExcel}
            >
              Download Excel
              </Button>
                <Button className='me-1' color='primary' type='submit' onClick={() => downloadPDF(data)}>
                  Print PDF
                </Button>

                {/* <Button className='me-1' color='primary' type='submit' onClick={() => setflag1(false)}>
                  Download
                </Button> */}
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
      {/* onClick={handleDownload} */}
      {flag == true && <div className="ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={rowData1}
          columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          // paginationPageSize='10'
          // pagination='true'
          domLayout='autoHeight'

          defaultColDef={defaultColDef}
          headerColor="ddw-primary"

        />
      </div>}
      {/* <App/> */}
    </div>
  )
}


export default CformReport