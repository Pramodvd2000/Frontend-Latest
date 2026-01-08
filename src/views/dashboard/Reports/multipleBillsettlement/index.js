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
import React from 'react';
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

const MultiplebillSettlementReport = () => {

  let navigate = useNavigate();
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const [coversData, setCoversData] = useState([])
  const [flag1, setflag1] = useState(false)
  const [ShowDummyInvPDF, setShowDummyInvPDF] = useState(false)
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [DummyInvURL, setDummyInvURL] = useState([])
  const [allData, setAllData] = useState()
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
  const [rowData1, setRowData1] = useState();
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);




  const gridRef = useRef();
  const groupDisplayType = 'singleColumn';
  const frmdate = watch('frmdate');

  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD'))
  };

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


// Define the function to calculate group totals
const groupRowAggNodes = (nodes) => {
  const total = nodes.reduce((sum, node) => {
    const value = node.data ? parseFloat(node.data.base_amount) || 0 : 0;
    return sum + value;
  }, 0);
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(Math.abs(total));
};


  const gridOptions = {
    // ... other grid options ...
    groupRowAggNodes: groupRowAggNodes,
  };

  const [hotelDetails, setHotelDetails] = useState(null);
  const [hotelAddress, setHotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);

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
        })
  
    }, [])


  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'BillNo', field: 'billNoDisplay', suppressSizeToFit: true, width: 140, rowGroup: true },
    { headerName: 'Payment Type ', field: 'transaction_type', suppressSizeToFit: true, width: 150 },
    {
      headerName: 'Bill Date', field: 'invoiceDate', suppressSizeToFit: true, width: 140,
      cellRenderer: (params) => {
        if (params.data && params.data.invoiceDate) {
          const formattedDate = Moment(params.data.invoiceDate).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    { headerName: 'Description', field: 'description', suppressSizeToFit: true, width: 140 },
    { headerName: 'Bill No', field: 'billNoDisplay', suppressSizeToFit: true, width: 140 },
    { headerName: 'Booking ID', field: 'bookingID', suppressSizeToFit: true, width: 140 },
    { headerName: 'Room No', field: 'room', suppressSizeToFit: true, width: 140 },
    { headerName: 'Guest Name', field: 'guestName', suppressSizeToFit: true, width: 250, wrapText: true, autoHeight: true },
    {
      headerName: 'Transaction Date', field: 'Trxdate', suppressSizeToFit: true, width: 180,
      cellRenderer: (params) => {
        if (params.data && params.data.Trxdate) {
          const formattedDate = Moment(params.data.Trxdate).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    {
      headerName: 'Amount',
      field: 'base_amount',
      suppressSizeToFit: true,
      width: 150,
      valueGetter: function (params) {
        if (params && params.node.group) {
          return '';
        }
        return Math.abs(parseFloat(params.data.base_amount || 0)).toFixed(2);
      },
      aggFunc: 'sum', // This will calculate the sum for each group
      enableRowGroup: true,
    },
  ]);


  const onButtonExport = () => {
    const params = {
      fileName: 'Multiple Bill Settlement Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };


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


  const downloadPDF = async () => {
    const columns = columnDefs.map((column) => column.headerName);
    const rows = rowData1.map((row) => columnDefs.map((column) => row[column.field]));

    // Group rows by 'billNoDisplay'
    const groupedRows = rowData1.reduce((acc, row) => {
      const key = row['billNoDisplay'];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(row);
      return acc;
    }, {});

    const doc = new jsPDF({ orientation: 'landscape' });

    try {
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 20;
      const xLogo = 10; // X-coordinate for the logo
      const yLogo = 10; // Y-coordinate for the logo
      const logoHeight = 20;
      let startY = 20;
      
      doc.addImage(logo, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);
      
      const margin = { left: 10, right: 10 };
      const currentDate = new Date();
      const formattedDate = formatDates(currentDate);
      const paddingFromRight = 85;
      const dateX = pageWidth - doc.getStringUnitWidth(formattedDate) - paddingFromRight;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text("Generated Time " + formattedDate, dateX + 35, startY - 7);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      const hotelNameX = xLogo + logoWidth + 108; // Adjust as needed for spacing
      doc.text(`${hotelName}`, hotelNameX, yLogo + 3);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const hotelAddressX = xLogo + logoWidth + 60; // Adjust as needed for spacing
      doc.text(`${hotelAddress}`, hotelAddressX, yLogo + 9);
      
      const textToCenter = "Multiple Settlement for single bill Report";
      
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
      
      startY = 35;

      // Iterate through grouped rows and add tables for each group
      for (const billNo in groupedRows) {
        // Add text for the current group
        doc.text(`Bill No: ${billNo}`, 10, startY + 10, { width: 500, align: 'left' });

        const groupRows = groupedRows[billNo].map((row) => {
          const absoluteAmount = Math.abs(parseFloat(String(row['base_amount']).replace(/,/g, '')) || 0).toFixed(2);
          row['base_amount'] = new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 2,
          }).format(absoluteAmount);
        
          // Map the row's columns and convert date columns to dd.mm.yyyy format
          return columnDefs.map((column) => {
            if (column.field === 'invoiceDate' || column.field === 'Trxdate') {
              const dateParts = row[column.field].split('-');
              const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
              return formattedDate;
            }
        
            return row[column.field];
          });
        });
        
        // Remove commas and calculate the total amount
        const totalAmount = Math.abs(groupedRows[billNo].reduce((total, row) => total + parseFloat(String(row['base_amount']).replace(/,/g, '')) || 0, 0)).toFixed(2);
        
        // Format the total amount with commas
        const formattedTotalAmount = new Intl.NumberFormat('en-IN', {
          maximumFractionDigits: 2,
        }).format(totalAmount);

        // Add table for the current group, including the total amount row
        doc.autoTable({
          head: [columns],
          body: [...groupRows, ['', '', '', '', '', ' ', ' ', ' ', 'Total Amount:', formattedTotalAmount]], // Add the total amount row
          startY: startY + 20,
          margin,
          didParseCell: (data) => {
            if (data.column.index == 9 ) {
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

      doc.text(`Filter From Transaction Date: ${fromDate}`, 10, startY + 10, { width: 500, align: 'left' });
      doc.text(`To Transaction Date: ${toDate}`, 10, startY + 20, { width: 500, align: 'left' });

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
      saveAs(pdfBlob, 'Multiple Settlements For single Bill.pdf');
    } catch (error) {
      console.error('Error creating PDF:', error);
    }
  };

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


  const onSubmit = data => {
    setIsButtonClicked(true)
    setOpen(true)
    setFlag(true)
    setData(data)
    const filterFromDate = Moment(data.frmdate[0]).format("YYYY-MM-DD");
    const filterToDate = Moment(data.todate[0]).format("YYYY-MM-DD");
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);

    let createmarketGroup = JSON.stringify({
      "hotelID": 1,
      "startDate": filterFromDate,
      "endDate": filterToDate
    })

    if (flag1 == true) {
      fetchx(DASHBOARD_URL + "/getMultipleStettlementBillReport", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(data => data.json())
        .then((res) => {
          setIsButtonClicked(false)
          if(res['statusCode'] == 200) {
            setOpen(false)
          const transactionsArray = res.data.map(item => item.Transactions).flat();
          setRowData1(transactionsArray);
          setAllData(res.data)
          setCoversData(res["data"])
          }
        })
    }

  }


  const handleReset = () => {
    reset({
      frmdate: '',
      todate: ''
    })
  }

  
  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Multiple Settlements For Single Bill Report');
  
      const columns = [
        { header: 'Bill No', key: 'billNoDisplay', width: 20 },
        { header: 'Payment Type', key: 'transaction_type', width: 20 },
        { header: 'Bill Date', key: 'invoiceDate', width: 20 },
        { header: 'Description', key: 'description', width: 30 },
        { header: 'Booking ID', key: 'bookingID', width: 20 },
        { header: 'Room No', key: 'room', width: 15 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Transaction Date', key: 'Trxdate', width: 20 },
        { header: 'Amount', key: 'base_amount', width: 15 }
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'Multiple Settlements For Single Bill Report']);
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
          invoiceDate: Moment(item.invoiceDate).format("DD.MM.YYYY"),
          Trxdate: Moment(item.Trxdate).format("DD.MM.YYYY"),
          base_amount: Math.abs(parseFloat(item.base_amount || 0)).toFixed(2)
        }));
      };
  
      const sanitizedData = formattedData(rowData1);
  
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          billNoDisplay: row.billNoDisplay,
          transaction_type: row.transaction_type,
          invoiceDate: row.invoiceDate,
          description: row.description,
          bookingID: row.bookingID,
          room: row.room,
          guestName: row.guestName,
          Trxdate: row.Trxdate,
          base_amount: row.base_amount
        });
      });
  
      worksheet.columns.forEach((column, index) => {
        column.alignment = { vertical: 'middle', horizontal: 'left' };
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Multiple Settlements For Single Bill Report_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };

  return (
    <div>
      <Card>

        <CardHeader>
          <CardTitle tag='h4'>Multiple Settlements For single Bill </CardTitle>
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
                        options={optionsToDate}
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
                <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                  Reset
                </Button>
                {/* <Button className='me-1' color='primary' type='submit' onClick={onButtonExport}>
                  Export Excel
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

      {flag == true && <div className="ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={rowData1}
          groupDisplayType={groupDisplayType}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          domLayout='autoHeight'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"

        />
      </div>}

    </div>
  )
}


export default MultiplebillSettlementReport
