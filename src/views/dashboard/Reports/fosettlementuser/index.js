// ** React Imports
import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Table, Modal, ModalBody, ModalHeader } from 'reactstrap'
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



import 'ag-grid-enterprise';


const MySwal = withReactContent(Swal)

const defaultValues = {
  frmdate: ''
}

const FOSettlementuserReport = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [rowData1, setRowData1] = useState();



  // ** State
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const [coversData, setCoversData] = useState([])

  const [flag1, setflag1] = useState(false)
  const [ShowDummyInvPDF, setShowDummyInvPDF] = useState(false)
  const [DummyInvURL, setDummyInvURL] = useState([])
  const [InvURL, setInvURL] = useState([])
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  // ** Hooks
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
  let navigate = useNavigate();
  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD'))
  };



  const gridRef = useRef();


  const [amount, setAmount] = useState()

  const [hotelDetails, setHotelDetails] = useState(null);
  const [hotelAddress, setHotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
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
    { headerName: 'User', field: 'first_name', suppressSizeToFit: true, maxWidth: 140, rowGroup: true, },
    {
      headerName: 'Date-Time ', field: 'DateTime', suppressSizeToFit: true, maxWidth: 190,
      cellRenderer: (params) => {
        if (params.data && params.data.DateTime) {
          const formattedDate = Moment(params.data.DateTime).format("DD.MM.YYYY  hh:mm");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    { headerName: 'BillNo', field: 'billNoDisplay', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Receipt No', field: 'receiptNumber', suppressSizeToFit: true, width: 130 },
    { headerName: 'Room No.', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Booking ID', field: 'bookingID', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Guest Name ', field: 'guestName', suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true, },
    { headerName: 'Amount', field: 'base_amount', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Payment Type', field: 'description', suppressSizeToFit: true, maxWidth: 180 },
  ]);


  const onButtonExport = () => {
    const params = {
      fileName: 'FO settlement userwise Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };


  // Function to format the date as "MM/DD/YYYY"
  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
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

  
  const downloadPDF = async () => {
    const columns = columnDefs.map((column) => column.headerName);
    const totalAmountRow = {
      billNoDisplay: 'Total Amount',
      hotelId: '',
      createdBy: '',
      date: '',
      roomNumber: '',
      guestName: '',
      bookingID: '',
      base_amount: amount, // Placeholder for total amount
      description: '',
      DateTime: '',
    };
    const rows = [...rowData1, totalAmountRow].map((row) => columnDefs.map((column) => row[column.field]));
    const doc = new jsPDF({ orientation: 'landscape' });

    const groupedRows = rowData1.reduce((acc, row) => {
      const key = row['first_name'];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(row);
      return acc;
    }, {});

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
      // const formattedDate = formatDateTimeWithAMPM(currentDate);
      // const paddingFromRight = 85;
      // const dateX = pageWidth - doc.getStringUnitWidth(formattedDate) - paddingFromRight;
      // doc.setFontSize(8);
      // doc.setFont('helvetica', 'normal');
      // doc.text("Generated Time " + formattedDate, dateX + 35, startY - 7);
      
      // doc.setFontSize(14);
      // doc.setFont('helvetica', 'normal');
      // const hotelNameX = xLogo + logoWidth + 108; // Adjust as needed for spacing
      // doc.text(`${hotelName}`, hotelNameX, yLogo + 3);
      
      // doc.setFontSize(12);
      // doc.setFont('helvetica', 'normal');
      // const hotelAddressX = xLogo + logoWidth + 60; // Adjust as needed for spacing
      // doc.text(`${hotelAddress}`, hotelAddressX, yLogo + 9);
      doc.addImage(DASHBOARD_URL+`/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

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
      setHotelInfo(doc, hotelAddress, xLogo, logoWidth, yLogo + 8, 12);
      const textToCenter = "FO Settlement Userwise Report";
      
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
      
      startY = 30;

      // Iterate through grouped rows and add tables for each group
      for (const first_name in groupedRows) {
        // Add text for the current group
        doc.text(`User: ${first_name}`, 10, startY + 10, { width: 500, align: 'left' });
        // Convert rows of the current group to table format
        const groupRows = groupedRows[first_name].map((row) =>
          columnDefs.map((column) => {
            const absoluteAmount = Math.abs(parseFloat(String(row['base_amount']).replace(/,/g, '')) || 0).toFixed(2);
        
            // Replace the original amount with the absolute value formatted with commas
            row['base_amount'] = new Intl.NumberFormat('en-IN', {
              maximumFractionDigits: 2,
            }).format(absoluteAmount);
            
            if (column.field === 'DateTime') {
              return convertDateFormat(row[column.field]);
            }
            return row[column.field];
          })
        );
        // Calculate the total base_amount for the current group
        // Remove commas and calculate the total amount
        const totalAmount = Math.abs(groupedRows[first_name].reduce((total, row) => total + parseFloat(String(row['base_amount']).replace(/,/g, '')) || 0, 0)).toFixed(2);
        

        const formattedTotalAmount = new Intl.NumberFormat('en-IN', {
          maximumFractionDigits: 2,
        }).format(totalAmount);

        doc.autoTable({
          head: [columns],
          body: [...groupRows, ['', '', '', '', '', 'Total Amount: ',formattedTotalAmount]], // Add the total amount row
          startY: startY + 15,
          margin,
          didParseCell: (data) => {
            if (data.column.index == 6) {
              data.cell.styles.halign = 'right';
            }

            if (data.row.raw.some(cellData => typeof cellData === 'string' && cellData.includes('Total'))) { // Assuming 'Grand Total' is in the first column
              data.cell.styles.fillColor = [220, 220, 220]; // Highlighting with a yellow background color
              data.cell.styles.fontStyle = 'bold'; // Making the text bold
            }
            
          }
        });

        // Update startY for the next group
        startY = doc.autoTable.previous.finalY + 5;
      }

      const contentHeight = 30; // Total height of the content being added
      const availableSpace = doc.internal.pageSize.height - (startY + contentHeight);

      // Check if the available space is enough for the content
      if (availableSpace < contentHeight) {
        doc.addPage(); // Move to the next page
        startY = 10; // Set Y position for the new page
      }
      
      let fromDate = formatDate(new Date(filterFromDate))
      let toDate = formatDate(new Date(filterToDate))

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      doc.text(`Filter From Date: ${fromDate}`, 10, startY + 10, { width: 500, align: 'left' });
      doc.text(`To Date: ${toDate}`, 10, startY + 20, { width: 500, align: 'left' });

      for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
        doc.setPage(i); // Set the active page
        doc.setFontSize(10); // Set font size for page number

        const pageNumber = `Page ${i} of ${doc.internal.getNumberOfPages()}`;
        const pageNumberWidth = doc.getStringUnitWidth(pageNumber) * doc.internal.getFontSize() / doc.internal.scaleFactor;

        // Calculate position for center alignment
        const xPos = pageCenter - (pageNumberWidth / 2);
        const yPos = doc.internal.pageSize.height - 5; // 10 units from the bottom

        doc.text(pageNumber, xPos, yPos);
      }


      const pdfBlob = doc.output('blob');
      saveAs(pdfBlob, 'FO settlement userwise Report.pdf');
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };


  // Function to convert 'yyyy-mm-dd hh:mm:ss' to 'dd.mm.yyyy hh:mm:ss'
  const convertDateFormat = (datetimeString) => {
    const [datePart, timePart] = datetimeString.split(' ');
    const [year, month, day] = datePart.split('-');
    return `${day}.${month}.${year} ${timePart}`;
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

  const totalAmountRow = {
    billNoDisplay: 'Total Amount',
    hotelId: '',
    createdBy: '',
    date: '',
    roomNumber: '',
    guestName: '',
    bookingID: '',
    base_amount: amount,
    description: '',
    DateTime: '',
  };

  // const rowDataWithTotal = [rowData1,totalAmountRow];
  const rowDataWithTotal = Array.isArray(rowData1) ? [...rowData1, totalAmountRow] : [totalAmountRow];

  const onSubmit = data => {
    setIsButtonClicked(true)
    setOpen(true)
    const filterFromDate = Moment(data.frmdate[0]).format("YYYY-MM-DD");
    const filterToDate = Moment(data.todate[0]).format("YYYY-MM-DD");  
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    setFlag(true)
    setData(data)
    let createmarketGroup = JSON.stringify({
      "hotelID": 1,
      "startDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
      "endDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
    })

    if (flag1 == true) {
      let res = fetchx(DASHBOARD_URL + "/getFOSettlementsUserwiseReport", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(data => data.json())
        .then((res) => {
          setIsButtonClicked(false)
          if(res['statusCode'] == 200) {
            setOpen(false)
          setRowData1(res.data[0]["transactions"])
          setCoversData(res["data"])
          setAmount(res.data[0]["totalAmount"])
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
      const worksheet = workbook.addWorksheet('FO Settlements User wise Report');
  
      const columns = [
        { header: 'User', key: 'first_name', width: 25 },
        { header: 'Date-Time', key: 'DateTime', width: 20 },
        { header: 'Bill No', key: 'billNoDisplay', width: 20 },
        { header: 'Receipt No', key: 'receiptNumber', width: 15 },
        { header: 'Room No.', key: 'roomNumber', width: 15 },
        { header: 'Booking ID', key: 'bookingID', width: 20 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Amount', key: 'base_amount', width: 15 },
        { header: 'Payment Type', key: 'description', width: 20 }
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'FO Settlements User wise Report']);
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
          description: item.description?.replace(/\r?\n|\r/g, ''),
          DateTime: Moment(item.DateTime).format("DD.MM.YYYY hh:mm:ss")
        }));
      };
  
      const sanitizedData = formattedData(rowData1);
  
      let totalAmount = 0;
  
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          first_name: row.first_name,
          DateTime: row.DateTime,
          billNoDisplay: row.billNoDisplay,
          receiptNumber: row.receiptNumber,
          roomNumber: row.roomNumber,
          bookingID: row.bookingID,
          guestName: row.guestName,
          base_amount: row.base_amount,
          description: row.description
        });
  
        totalAmount += parseFloat(row.base_amount || 0);
      });
  
      worksheet.addRow();
      worksheet.addRow({
        first_name: 'Totals',
        DateTime: '',
        billNoDisplay: '',
        receiptNumber: '',
        roomNumber: '',
        bookingID: '',
        guestName: '',
        base_amount: totalAmount.toFixed(2),
        description: ''
      });
  
      const totalRow = worksheet.lastRow;
      totalRow.font = { bold: true };
  
      worksheet.columns.forEach((column, index) => {
        column.alignment = { vertical: 'middle', horizontal: index === 7 ? 'right' : 'left' };
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `FO Settlements User wise Report_${formattedDate}.xlsx`);
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
          <CardTitle tag='h4'>FO Settlements User wise Report </CardTitle>
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
                        options={{ allowInput: true }}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
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
                        // options={optionsToDate}
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

              <div className='d-flex'>
                <Button className='me-1 ms-auto' color='primary' type='submit' onClick={() => setflag1(true)} disabled={isButtonClicked}>
                {isButtonClicked ? 'Processing...' : 'Submit'}
                </Button>
               {flag == true && 
                <Button
                className='me-1'
                color='primary'
                onClick={generateExcel}
              >
                Download Excel
                </Button>
                }

               {flag == true && <Button className='me-1' color='primary' onClick={downloadPDF}>
                  Print PDF
                </Button>}

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

      {flag == true && <div className="ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={rowDataWithTotal}
          columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          domLayout='autoHeight'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
        />
      </div>
      }

    </div>
  )
}

export default FOSettlementuserReport