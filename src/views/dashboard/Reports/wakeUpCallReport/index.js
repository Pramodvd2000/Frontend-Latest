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
import { AgGridReact } from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import { useRef, useEffect, useMemo, useCallback } from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'ag-grid-enterprise';
import 'jspdf-autotable';
import * as jspdf from 'jspdf';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import logo from '@src/assets/images/logo/oterra.jpg'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';

const MySwal = withReactContent(Swal)

const defaultValues = {
  frmdate: ''
}

const WakeUpCallReport = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [rowData1, setRowData1] = useState();
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const [flag1, setflag1] = useState(false)
  const [ShowDummyInvPDF, setShowDummyInvPDF] = useState(false)
  const [DummyInvURL, setDummyInvURL] = useState([])
  const [InvURL, setInvURL] = useState([])

  const [hotelName, sethotelName] = useState('');
  const [hotelAddress, sethotelAddress] = useState('');
  const [hotelNo, setHotelNo] = useState(null);
  const [hotelFax, sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);



  // ** Hooks
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  let navigate = useNavigate();


  const gridRef = useRef();



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

  const [columnDefs, setColumnDefs] = useState([
    // {headerName: 'Hotel ID',field: 'hotelID',suppressSizeToFit: true,maxWidth: 160},
    { headerName: 'Room Number', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 160 },
    { headerName: 'Guest Name ', field: 'GuestName', suppressSizeToFit: true, maxWidth: 170 },
    {
      headerName: 'Wake Date', field: 'WakeDate', suppressSizeToFit: true, maxWidth: 170, cellRenderer: (params) => {
        // Ensure the arrivalDate field exists in the row data        
        if (params.data && params.data.WakeDate) {
          // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
          const formattedDate = Moment(params.data.WakeDate).format("DD-MM-YYYY");
          return formattedDate;
        } else {
          return ""; // Handle cases where the data is missing or invalid        
        }
      }
    },
    { headerName: 'Wake Time', field: 'WakeTime', suppressSizeToFit: true, maxWidth: 170 },

    { headerName: 'Status', field: 'status', suppressSizeToFit: true, maxWidth: 140 },
    // { headerName: 'OverDue ', field: 'overdue', suppressSizeToFit: true, maxWidth: 110 },
    // { headerName: 'BlockCode', field: 'blockCode', suppressSizeToFit: true, maxWidth: 110 },
    // { headerName: 'BlockName ', field: 'blockName', suppressSizeToFit: true, maxWidth: 110 },
    { headerName: 'Room Type', field: 'roomType', suppressSizeToFit: true, maxWidth: 140 },

    { headerName: 'VIP ', field: 'VIP', suppressSizeToFit: true, maxWidth: 140 },
    {
      headerName: 'Set Date', field: 'setDate', suppressSizeToFit: true, maxWidth: 110, cellRenderer: (params) => {
        // Ensure the arrivalDate field exists in the row data        
        if (params.data && params.data.setDate) {
          // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
          const formattedDate = Moment(params.data.setDate).format("DD-MM-YYYY");
          return formattedDate;
        } else {
          return ""; // Handle cases where the data is missing or invalid        
        }
      }
    },
    { headerName: 'Set Time', field: 'setTime', suppressSizeToFit: true, maxWidth: 110 },
    { headerName: 'Set By', field: 'SetBy', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Follow Up', field: 'isFollowUp', suppressSizeToFit: true, maxWidth: 150 },

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


  const onButtonExport = () => {
    const params = {
      fileName: 'WakeUp Call Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };

  const downloadPDF = async () => {
    let fromDate = Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD");
    let toDate = Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD");

    const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.WakeDate)));
    const doc = new jsPDF({ orientation: 'landscape' });
    const pageCenter = doc.internal.pageSize.width / 2;

    try {
      let filterText = ''; // Variable to store filter information
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 20;
      const xLogo = 10; // X-coordinate for the logo
      const yLogo = 10; // Y-coordinate for the logo
      const logoHeight = 20;
      let dateY = 20
      let startY = 20;
      const margin = { left: 10, right: 10 };

      doc.addImage(DASHBOARD_URL+`/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

      // pdf.addImage(Logo, "JPEG", xCenter, 10, logoWidth, logoHeight);
      const currentDate = new Date();
      const formattedDate = formatDateTimeWithAMPM(currentDate);
      const paddingFromRight = 85;
      const dateX = pageWidth - doc.getStringUnitWidth(formattedDate) - paddingFromRight;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);


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

      // Determine the width of the hotel name and address
      const hotelNameWidth = doc.getStringUnitWidth(hotelName) * 14;
      const hotelAddressWidth = doc.getStringUnitWidth(hotelAddress) * 12;

      // Set hotel name
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      setHotelInfo(doc, hotelName, xLogo, logoWidth, yLogo, 14);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      setHotelInfo(doc, hotelAddress, xLogo, logoWidth, yLogo + 8, 12); // Adjust the y position as needed
      const textToCenter = "Wakeup Call Report";

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
      doc.setFont('helvetica', 'bold')
      startY = 30;

      // Group rows by 'billNoDisplay'

      uniqueArrivalDates.forEach((WakeDate, index) => {
        const formattedArrivalDate = formatDate(new Date(WakeDate));

        const rows = rowData1
          .filter((row) => row.WakeDate === WakeDate)
          .map((row) => {
            const formattedArrival = formatDate(new Date(row.WakeDate));
            const formattedDeparture = formatDate(new Date(row.setDate));

            return {
              ...row,
              WakeDate: formattedArrival,
              setDate: formattedDeparture,
            };
          })
          .map((row) => columnDefs.map((column) => row[column.field]));
        const columns = columnDefs.map((column) => column.headerName);

        if (rows.length === 0) {
          return;
        }

        const firstArrivalDate = formatDate(new Date(uniqueArrivalDates[0]));
        const lastArrivalDate = formatDate(new Date(uniqueArrivalDates[uniqueArrivalDates.length - 1]));

        const totalCount = rows.length;

        doc.setFont('times', 'bold');
        doc.text(`Date: ${formattedArrivalDate}`, 10, startY + 8, { width: 500, align: 'left' });

        const spaceLeft = doc.internal.pageSize.height - (startY + 20 + margin.bottom);

        // If the space is not enough, add a new page
        if (spaceLeft < 0) {
          doc.addPage();
          startY = margin.top;
        }

        doc.autoTable({
          head: [columns],
          body: rows,
          startY: startY + 12,
          margin,
        });

        doc.line(margin.left, doc.autoTable.previous.finalY + 2, doc.internal.pageSize.width - margin.right, doc.autoTable.previous.finalY + 2);

        doc.setFont('times', 'roman');
        doc.text(`Total Count: ${totalCount}`, 255, doc.autoTable.previous.finalY + 10, { width: 500, align: 'left' });
        doc.setFont('times', 'normal');

        startY = doc.autoTable.previous.finalY + 20;

        const availableSpace = doc.internal.pageSize.height - startY;
        if (availableSpace < 30) {
          doc.addPage();
          startY = 10;
        }

        if (index === uniqueArrivalDates.length - 1) {
          if (fromDate && toDate) {
            const fromDateNew = Moment(new Date(fromDate)).format("DD.MM.YYYY");
            const toDateNew = Moment(new Date(toDate)).format("DD.MM.YYYY");
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Filter:`, 20, startY + 10, { width: 500, align: 'left' });
            doc.text(`Date: From ${fromDateNew} To ${toDateNew}`, 20, startY + 20, { width: 500, align: 'left' });
            doc.setFont('times', 'normal'); // Reset font style to normal for subsequent text
          }
        }
      });

      for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
        doc.setPage(i); // Set the active page
        doc.setFontSize(10); // Set font size for page number

        const pageNumber = `Page ${i} of ${doc.internal.getNumberOfPages()}`;
        const pageNumberWidth = doc.getStringUnitWidth(pageNumber) * doc.internal.getFontSize() / doc.internal.scaleFactor;

        // Calculate position for center alignment
        const xPos = pageCenter - (pageNumberWidth / 2);
        const yPos = doc.internal.pageSize.height - 10; // 10 units from the bottom

        doc.text(pageNumber, xPos, yPos);
      }

      // Save the PDF
      const pdfBlob = doc.output('blob');
      saveAs(pdfBlob, 'WakeUp Call Report.pdf');
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
  // ** State

  const onSubmit = data => {
    setIsButtonClicked(true)
    setOpen(true)
    setFlag(true)
    setData(data)
    const filterFromDate = Moment(data.frmdate[0]).format("DD.MM.YYYY");
    const filterToDate = Moment(data.todate[0]).format("DD.MM.YYYY");

    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    let createmarketGroup = JSON.stringify({

      "fromDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
      "toDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD"),
      "hotelID": 1,

    })
    if (flag1 == true) {
      let res = fetchx(DASHBOARD_URL + "/getwakeUpCallReportDetails", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(data => data.json())
        .then((res) => {
          setIsButtonClicked(false)
          if(res['statusCode'] == 200){
            setOpen(false)
          setRowData1(res["data"])
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

  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('WakeUp Call Report');
  
    const columns = [
      { header: 'Room Number', key: 'roomNumber', width: 30 },
      { header: 'Guest Name', key: 'GuestName', width: 25 },
      { header: 'Wake Date', key: 'WakeDate', width: 20 },
      { header: 'Wake Time', key: 'WakeTime', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Room Type', key: 'roomType', width: 20 },
      { header: 'VIP', key: 'VIP', width: 20 },
      { header: 'Set Date', key: 'setDate', width: 20 },
      { header: 'Set Time', key: 'setTime', width: 20 },
      { header: 'Set By', key: 'SetBy', width: 20 },
      { header: 'Follow Up', key: 'isFollowUp', width: 20 }
    ];
  
    worksheet.columns = columns;
  
    worksheet.addRow(['Report Name:', 'WakeUp Call Report']);
    worksheet.addRow(['Filter From Date:', filterFromDate]);
    worksheet.addRow(['To Date:', filterToDate]);
    
    worksheet.addRow();
    worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
    for (let i = 1; i <= 4; i++) {
      worksheet.getRow(i).font = { bold: true };
    }
  
    worksheet.spliceRows(1, 1);
  
    const formattedData = (rowData1) => {
      return rowData1.map(item => ({
        ...item,
        WakeDate: Moment(item.WakeDate).format("DD-MM-YYYY"),
        setDate: Moment(item.setDate).format("DD-MM-YYYY"),
      }));
    };
  
    const sanitizedData = formattedData(rowData1);
  
    sanitizedData.forEach((row) => {
      worksheet.addRow({
        roomNumber: row.roomNumber,
        GuestName: row.GuestName,
        WakeDate: row.WakeDate,
        WakeTime: row.WakeTime,
        status: row.status,
        roomType: row.roomType,
        VIP: row.VIP,
        setDate: row.setDate,
        setTime: row.setTime,
        SetBy: row.SetBy,
        isFollowUp: row.isFollowUp,
      });
    });
  
    worksheet.columns.forEach((column) => {
      column.alignment = { vertical: 'middle', horizontal: 'left' };
    });
  
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
  
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, `WakeUp Call Report_${formattedDate}.xlsx`);
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
          <CardTitle tag='h4'>WakeUp Call </CardTitle>
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
      {/* onClick={handleDownload} */}
      {flag == true && <div className="ag-theme-alpine" >
        <AgGridReact
          ref={gridRef}
          rowData={rowData1}
          columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}

          domLayout='autoHeight'

          defaultColDef={defaultColDef}
          headerColor="ddw-primary"

        />
      </div>}
      {/* <App/> */}
    </div>
  )
}

export default WakeUpCallReport