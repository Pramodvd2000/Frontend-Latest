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

const HouseUseGuestReport = () => {


  // ** State
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const [flag1, setflag1] = useState(false)
  const [ShowDummyInvPDF, setShowDummyInvPDF] = useState(false)
  const [DummyInvURL, setDummyInvURL] = useState([])
  const [InvURL, setInvURL] = useState([])
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);


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
  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "BookingID",
      field: "bookingID",
      valueGetter: (params) => {
        if (params.data && params.data.bookingID && params.data.isMain === 0) {
          console.log("Asterisk added");
          return `${params.data.bookingID}*`;
        }
        console.log("Asterisk not added");
        return params.data.bookingID;
      },
      suppressSizeToFit: true,
      maxWidth: 140,
    }, { headerName: 'Room No.', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 120 },
    { headerName: 'Guest Name ', field: 'GuestName', suppressSizeToFit: true, maxWidth: 190 },
    { headerName: 'Adults', field: 'Adults', suppressSizeToFit: true, maxWidth: 110 },
    { headerName: 'Children', field: 'Children', maxWidth: 110 },

    { headerName: 'Company', field: 'Company', suppressSizeToFit: true, maxWidth: 170 },
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
    { headerName: 'Room Type', field: 'RoomType', suppressSizeToFit: true, maxWidth: 150 },
    { headerName: 'Market Code', field: 'MarketCode', suppressSizeToFit: true, maxWidth: 160 },
    { headerName: 'VIP', field: 'vipType', suppressSizeToFit: true, maxWidth: 90 },
    // { headerName: 'Travel Agent', field: 'TravelAgent', suppressSizeToFit: true, maxWidth: 190 },

    { headerName: 'Source', field: 'Source', suppressSizeToFit: true, maxWidth: 110 },

    { headerName: 'isMain', field: 'isMain', suppressSizeToFit: true, maxWidth: 140, hide: true },

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


  const onButtonExport = () => {
    const params = {
      fileName: 'Complementry/Houseuse guest Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };

  const [hotelName, sethotelName] = useState('');
  const [hotelAddress, sethotelAddress] = useState('');
  const [hotelNo, setHotelNo] = useState(null);
  const [hotelFax, sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  // const [rowData, setRowData] = useState();

  useEffect(() => {
    const hotelID = JSON.stringify({
      hotelID: 10
    })
    fetchx(DASHBOARD_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelID
    }).then((res) => res.json())
      .then(postres => {
        const hotelName1 = postres.data[0].name;
        const hotelAddress1 = postres.data[0].address;
        const logo = postres.data[0].logo
        console.log(logo)
        const number = postres.data[0].phoneNumber
        const fax = postres.data[0].fax
        console.log(hotelName)
        console.log(postres)
        sethotelName(hotelName1);
        sethotelAddress(hotelAddress1);
        setHotelNo(number)
        sethotelFax(fax)
        setLogo(logo)
      })
  }, [])

  const downloadPDF = async () => {
    const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.arrivalDate)));
    
    const doc = new jsPDF({ orientation: 'landscape' });
    
    try {
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 20;
      const xLogo = 10;
      const yLogo = 10;
      const logoHeight = 20;
      let dateY = 20;
      let startY = 20;
      const margin = { left: 10, right: 10 };
    
      // Add hotel logo
      doc.addImage(DASHBOARD_URL + `/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);
    
      // Add current date and time
      const currentDate = new Date();
      const formattedDate = formatDateTimeWithAMPM(currentDate);
      const paddingFromRight = 85;
      const dateX = pageWidth - doc.getStringUnitWidth(formattedDate) - paddingFromRight;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);
    
      // Set hotel information
      const setHotelInfo = (pdf, textToCenter, yPos, fontSize) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', 'normal');
        const textWidth = doc.getStringUnitWidth(textToCenter) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const pageCenter = doc.internal.pageSize.width / 2;
        let textStartX = pageCenter - textWidth / 2;
    
        if (textStartX < 0) textStartX = 0;
        else if (textStartX + textWidth > doc.internal.pageSize.width) textStartX = doc.internal.pageSize.width - textWidth;
    
        doc.text(`${textToCenter}`, textStartX, yPos);
      };
    
      setHotelInfo(doc, hotelName, yLogo, 14);
      setHotelInfo(doc, hotelAddress, yLogo + 8, 12);
    
      // Report title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Complementary/House Use Guest Report", pageWidth / 2 - doc.getStringUnitWidth("Complementary/House Use Guest Report") / 2, yLogo + 16);
    
      let grandTotalRooms = 0;
      let grandTotalAdults = 0;
    
      uniqueArrivalDates.forEach((arrivalDate) => {
        const formattedArrivalDate = formatDate(new Date(arrivalDate));
    
        // Filter and map rowData1 based on arrivalDate and reformat the dates
        const rows = rowData1
          .filter((row) => row.arrivalDate === arrivalDate)
          .map((row) => ({
            ...row,
            arrivalDate: formatDate(new Date(row.arrivalDate)),
            departureDate: formatDate(new Date(row.departureDate))
          }));
    
        let totalUniqueRooms = 0;
        let totalAdults = 0;
    
        const processedRoomNumbers = new Set();
        rows.forEach((row) => {
          if (!processedRoomNumbers.has(row.roomNumber)) {
            totalAdults += row.Adults ? parseInt(row.Adults) : 0;
            processedRoomNumbers.add(row.roomNumber);
          }
        });
    
        totalUniqueRooms = processedRoomNumbers.size;
    
        grandTotalRooms += totalUniqueRooms;
        grandTotalAdults += totalAdults;
    
        // Table column headers
        const columns = columnDefs.map((column) => column.headerName);
    
        // Check if space is left for the date
        const spaceLeftForDate = doc.internal.pageSize.height - (startY + 20 + margin.bottom);
        if (spaceLeftForDate < 0) {
          doc.addPage();
          startY = margin.top;
        }
    
        // Add the arrival date header
        doc.setFont('times', 'bold');
        doc.text(`Date: ${formattedArrivalDate}`, 10, startY + 9, { width: 500, align: 'left' });
    
        const columnStyles = {
          0: { columnWidth: 18 },
          1: { columnWidth: 22 },
          2: { columnWidth: 20 },
          3: { columnWidth: 20 },
          4: { columnWidth: 28 },
          5: { columnWidth: 24 },
          6: { columnWidth: 28 },
          7: { columnWidth: 28 },
          8: { columnWidth: 28 },
          9: { columnWidth: 18 },
          10: { columnWidth: 21 },
        };
    
        // Create the table
        doc.autoTable({
          head: [columns],
          body: rows.map((row) => columnDefs.map((column) => {
            if (column.field === 'bookingID' && row.isMain === 0) return `${row.bookingID}*`;
            return row[column.field];
          })),
          startY: startY + 12,
          margin,
          columnStyles,
        });
    
        // Line and totals for the current date's data
        doc.setFontSize(12);
        doc.setFont('times', 'normal');
        doc.line(margin.left, doc.autoTable.previous.finalY + 2, doc.internal.pageSize.width - margin.right, doc.autoTable.previous.finalY + 2);
        doc.text(`Total Rooms: ${totalUniqueRooms}`, 225, doc.autoTable.previous.finalY + 12);
        doc.text(`Total Pax: ${totalAdults}`, 15, doc.autoTable.previous.finalY + 12);
    
        startY = doc.autoTable.previous.finalY + 20;
      });
    
      // Add grand totals at the end of the PDF
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Grand Total Rooms: ${grandTotalRooms}`, 70, startY+10);
      doc.text(`Grand Total Pax: ${grandTotalAdults}`, 10, startY + 10);
    
      // Generate and save the PDF
      const pdfBlob = doc.output('blob');
      saveAs(pdfBlob, 'Complimentary_House_Use_Report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
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

  console.log(formattedDateTimeWithAMPM);





  const onSubmit = data => {
    setIsButtonClicked(true)
    setOpen(true)
    // console.log("flag1", flag1)
    setFlag(true)
    setData(data)
    let createmarketGroup = JSON.stringify({
      // "hotelID": 1,
      "startDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
      "endDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD"),
      "hotelID": 10,


    })
    const filterFromDate = Moment(data.frmdate[0]).format("DD.MM.YYYY");
    const filterToDate = Moment(data.todate[0]).format("DD.MM.YYYY");
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);

    console.log(createmarketGroup)
    if (flag1 == true) {

      let res = fetchx(DASHBOARD_URL + "/getHouseUseGuestDetails", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      })
        .then(data => data.json())
        .then((res) => {
          setIsButtonClicked(false)
          if(res['statusCode'] == 200) {
            setOpen(false)
          const modifiedData = res["data"].map(row => {
            if (row.isMain === 0) {
              row.Adults = 0;
            }
            return row;
          });

          setRowData1(modifiedData);
          console.log(modifiedData);
        }
        });
    }


  }

  console.log(rowData1)


  const handleReset = () => {
    reset({
      frmdate: '',
      todate: '',
    })
  }

  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Complimentary House Use Report');

        const columns = [
            { header: 'BookingID', key: 'bookingID', width: 20 },
            { header: 'Room No.', key: 'roomNumber', width: 12 },
            { header: 'GuestName', key: 'GuestName', width: 25 },
            { header: 'Adults', key: 'Adults', width: 10 },
            { header: 'Children', key: 'Children', width: 10 },
            { header: 'Company', key: 'Company', width: 30 },
            { header: 'Arrival', key: 'arrivalDate', width: 20 },
            { header: 'Departure', key: 'departureDate', width: 20 },
            { header: 'Room Type', key: 'RoomType', width: 10 },
            { header: 'Market Code', key: 'MarketCode', width: 20 },
            { header: 'VIP', key: 'vipType', width: 30 },
            { header: 'Source', key: 'Source', width: 30 },
        ];

        worksheet.columns = columns;

        worksheet.addRow(['Report Name:', 'Complimentary House Use Report']);
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
                arrivalDate: Moment(item.arrivalDate).format("DD-MM-YYYY"),
                departureDate: Moment(item.departureDate).format("DD-MM-YYYY"),
            }));
        };

        const sanitizedData = formattedData(rowData1);

        sanitizedData.forEach((row) => {
            const newRow = {};
            columns.forEach(col => {
                newRow[col.key] = row[col.key] || '';
            });

            worksheet.addRow(newRow);
        });

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            saveAs(blob, `Complimentary House Use Report_${formattedDate}.xlsx`);
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
          <CardTitle tag='h4'>Complimentry / House Use Report</CardTitle>
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
                        // value={data1['dob']}
                        // options={doboptions}
                        required
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
                        // value={data1['dob']}
                        // options={optionsToDate}
                        required
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
                <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                  Reset
                </Button>

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

export default HouseUseGuestReport
