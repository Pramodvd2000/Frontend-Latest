
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
import {AgGridReact} from 'ag-grid-react';
import { useForm, Controller } from 'react-hook-form'
import { format } from "date-fns";
import 'ag-grid-enterprise'

import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';// import './Assettable.css';
import { useRef, useEffect, useMemo, useCallback} from 'react';
import DASHBOARD_URL from "../../../../dashboard";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, Accordion, InputGroup, NavLink} from 'reactstrap'
import { event } from "jquery";

import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

  let defaultValues = {
   
    // FromDate: [Moment((new Date(today))).subtract(1, 'days').format('YYYY-MM-DD')],
    // ToDate: [Moment((new Date(today))).subtract(1, 'days').format('YYYY-MM-DD')]

  }
const AvailabilityMatrix = () => {

  // AG Grid
  const [rowData, setRowData] = useState([]);
  const [rowData1, setRowData1] = useState();
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [selectedOption,setselectedOption] = useState('Date')
  const [flag, setFlag] = useState(false)
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);



  const gridRef = useRef();
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
  function formatNumber(params) {
    var number = params.value;
  
    // Check if the number is undefined or not a number
    if (typeof number !== 'number' || isNaN(number)) {
      return ''; // Return empty string for undefined or non-numeric values
    }
  
    // If the number is valid, proceed with formatting
    var formattedNumber = Math.floor(number).toFixed(2); // Limit to 2 decimal places
    return formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  const [columnDefs, setColumnDefs] = useState([
    // {headerName: 'ID',field: 'id',suppressSizeToFit: true,maxWidth: 160},
    // {headerName: 'Hotel ID',field: 'hotelID',suppressSizeToFit: true},
    {headerName: 'Description',field: 'description',suppressSizeToFit: true, maxWidth: 180 },
    {headerName: 'Date',field: 'Date',suppressSizeToFit: true, width: 250,
    cellRenderer: (params) => {
      if (params.data && params.data.Date) {
        const [startDate, endDate] = params.data.Date.split(" to ");
        const formattedStartDate = Moment(startDate).format("DD.MM.YYYY");
        const formattedEndDate = Moment(endDate).format("DD.MM.YYYY");
        console.log(formattedEndDate, formattedStartDate)

        return `${formattedStartDate} to ${formattedEndDate}`;
      } else {
        return "";
      }
    },
  },
    {headerName: 'Transaction Code',field: 'transactionCode',suppressSizeToFit: true, maxWidth: 180 },
    {headerName: 'Revenue',field: 'Revenue',suppressSizeToFit: true, maxWidth: 160 ,valueFormatter: formatNumber},
    {headerName: 'TaxPercentage',field: 'totalTax',suppressSizeToFit: true, maxWidth: 160 ,valueFormatter: formatNumber},
    {headerName: 'TaxAmount',field: 'TaxAmount',suppressSizeToFit: true, maxWidth: 160 ,valueFormatter: formatNumber},
    {headerName: 'TotalAmount',field: 'TotalAmount',suppressSizeToFit: true, maxWidth: 160 ,valueFormatter: formatNumber},
   
    



  ]);


  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null);
  useEffect(() => {
  const hotelID = JSON.stringify({
    hotelID: 1
  })
  fetchx(DASHBOARD_URL + "/getBusinessDate", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: hotelID
  }).then((res) => res.json())
  .then(rowData => {
    setRowData(rowData['data'])

    sethotelAddress(rowData['data'][0].address)
    setHotelName(rowData['data'][0].name)
  })
},[])


  const createData = (count, prefix) => {
    var result = [];
    for (var i = 0; i < count; i++) {
      if(rowData.length>0){
        result.push(rowData[0]);

      }
    }
    return result;
  };
//   const pinnedBottomRowData = useMemo(() => {
//     return createData(1, 'Bottom');
//   }, []);
  const defaultColDef = useMemo( ()=> (
    {
      sortable: true, 
      filter: true,
      filterParams :{
      buttons : ['apply','reset']
      }
    }
  ));
  

  const ConfirmSubmit = (data) => {
    setIsButtonClicked(true)
    setOpen(true)
    const filterFromDate = Moment(data.FromDate[0]).format("DD.MM.YYYY");
    const filterToDate = Moment(data.ToDate[0]).format("DD.MM.YYYY");

    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    setData(data)
    setFlag(true) 
    data.FromDate=(Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD'))
    data.ToDate=(Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD'))
    console.log(DASHBOARD_URL+'/getRevTaxForDay?hotelID=1&FromDate='+data.FromDate+'&ToDate='+data.ToDate)


    fetchx(DASHBOARD_URL+'/getRevTaxForDay', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 10,
        FromDate: data.FromDate,
        ToDate: data.ToDate
    
          })
    }).then(result => result.json())
    .then(resp => {
      setIsButtonClicked(false)
      if(resp['statusCode'] == 200) {
        setOpen(false)
             setRowData1(resp['data'])
      }
      }).catch((error) => {
        console.log(error)
      })

  }
  const cellClickedListener = useCallback( event => {
  console.log(event)
  }, []);


  // ** State
  const [data, setData] = useState(null);

 
  const handleReset = () => {
    reset({
    
      FromDate: '',
      ToDate:''
    })
  }


  const onBtnExport = () => {
    const params = {
      fileName: 'Revenue With Tax Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };

  const printGrid = () => {

    const gridApi = gridRef.current && gridRef.current.api;
    const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.arrivalDate)));

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
      let dateY = 20;

      pdf.addImage(Logo, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

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
      const hotelNameX = xLogo + logoWidth + 108; // Adjust as needed for spacing
      pdf.text(`${hotelName}`, hotelNameX, yLogo + 3);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const hotelAddressX = xLogo + logoWidth + 60; // Adjust as needed for spacing
      pdf.text(`${hotelAddress}`, hotelAddressX, yLogo + 9);
      
      const textToCenter = "Revenue With Tax Report";

      // Set font size and style
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      
      // Calculate the width of the text
      const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      
      // Calculate the starting X-coordinate to center the text
      const pageCenter = pdf.internal.pageSize.width / 2;
      const halfTextWidth = textWidth / 2;
      
      // Adjust the starting X-coordinate based on the text length
      let textStartX = pageCenter - halfTextWidth;
      
      // Ensure the text doesn't overflow the page
      if (textStartX < 0) {
        textStartX = 0; // Set a minimum X-coordinate
      } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
        textStartX = pdf.internal.pageSize.width - textWidth; // Adjust to fit within the page
      }
      
      // Y-coordinate for the text element
      const textY = yLogo + 16;
      
      // Draw the text at the calculated center position
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



      uniqueArrivalDates
        .sort((a, b) => new Date(a) - new Date(b))
        .forEach((arrivalDate, index) => {
          const rowsForDate = rowData1
            .filter((row) => row.arrivalDate === arrivalDate)
            .map((row) => {
              const formattedArrival = formatDate(new Date(row.arrivalDate));
              const formattedDeparture = formatDate(new Date(row.departureDate));
              const formattedDob = formatDate(new Date(row.dob));

              return {
                ...row,
                arrivalDate: formattedArrival,
                departureDate: formattedDeparture,
                dob: formattedDob,
              };
            })
            .map((row) => columnDefs.map((column) => row[column.field]));

          const columns = columnDefs.map((column) => column.headerName);
          // Calculate the height of the table content
          const tableHeight = 8;

          // Check if the content fits on the current page
          if (dateY + tableHeight > pdf.internal.pageSize.height - 20) {
            // Move to the next page if the content exceeds the page height
            pdf.addPage();
            dateY = 10; // Reset the Y position for the new page
            currentPage++; // Increment the current page number
          }

          const totalCount = rowsForDate.length;
          pdf.setFont('times', 'bold');
          const formattedArrivalDate = formatDate(new Date(arrivalDate));

          const columnsToFormat = [4,5,6,7];
    
          rows.forEach(row => {
            columnsToFormat.forEach(columnIndex => {
              const value = row[columnIndex];
              if (value !== undefined) {
                row[columnIndex] = Number(value).toFixed(2);
              }
              if (!isNaN(Number(value))) {
                // Format the number with maximumFractionDigits: 2
                row[columnIndex] = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(Number(value));
              }
            });
          });
          // pdf.text(`Date: ${formattedArrivalDate}`, 10, dateY + 37, { width: 500, align: 'left' });
          pdf.autoTable({
            head: [columns],
            body: rowsForDate,
            startY: dateY + 40,
          });

          pdf.setFont('times', 'normal');
          dateY = pdf.autoTable.previous.finalY - 10;
        });

      dateY = pdf.autoTable.previous.finalY + 15;
      // if (filterFromDate ) {

      const availableSpace = pdf.internal.pageSize.height - dateY;

      // Check if the available space is enough for the content
      if (availableSpace < 30) { // Adjust '30' based on your content height
        pdf.addPage(); // Move to the next page
        dateY = 10; // Set Y position for the new page
      }


      pdf.text(`Filter From Date: ${filterFromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
      // pdf.text(`Store:    `, 10, dateY + 30, {  width: 500,align: "left", });
    // }
      // pdf.text(`Status: ${(statusOptions == undefined ? '' : statusOptions)}`, 10, dateY + 30, { width: 500, align: 'left' });
      for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
        pdf.setPage(i); // Set the active page
        pdf.setFontSize(10); // Set font size for page number

        const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
        const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;

        // Calculate position for center alignment
        const xPos = pageCenter - (pageNumberWidth / 2);
        const yPos = pdf.internal.pageSize.height - 10; // 10 units from the bottom

        pdf.text(pageNumber, xPos, yPos);
      }
      // Save or display the PDF as needed
      pdf.save('Revenue With Tax Report.pdf');
    } else {
    }
   

  };

  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Revenue With Tax');
  
      const columns = [
        { header: 'Description', key: 'description', width: 30 },
        { header: 'Date', key: 'Date', width: 25 },
        { header: 'Transaction Code', key: 'transactionCode', width: 25 },
        { header: 'Revenue', key: 'Revenue', width: 20 },
        { header: 'Tax Percentage', key: 'totalTax', width: 20 },
        { header: 'Tax Amount', key: 'TaxAmount', width: 20 },
        { header: 'Total Amount', key: 'TotalAmount', width: 20 }
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'Revenue With Tax']);
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
          Date: item.Date.split(' to ').map(d => Moment(d).format("DD.MM.YYYY")).join(' to '),
          Revenue: parseFloat(item.Revenue).toFixed(2),
          totalTax: parseFloat(item.totalTax).toFixed(2),
          TaxAmount: parseFloat(item.TaxAmount).toFixed(2),
          TotalAmount: parseFloat(item.TotalAmount).toFixed(2)
        }));
      };
  
      const sanitizedData = formattedData(rowData1);
  
      // Initialize totals
      let totalRevenue = 0;
      let totalTaxAmount = 0;
      let totalAmount = 0;
  
      sanitizedData.forEach((row) => {
        // Add row to the worksheet
        worksheet.addRow({
          description: row.description,
          Date: row.Date,
          transactionCode: row.transactionCode,
          Revenue: row.Revenue,
          totalTax: row.totalTax,
          TaxAmount: row.TaxAmount,
          TotalAmount: row.TotalAmount
        });
  
        // Calculate totals
        totalRevenue += parseFloat(row.Revenue);
        totalTaxAmount += parseFloat(row.TaxAmount);
        totalAmount += parseFloat(row.TotalAmount);
      });
  
      // Add totals row
      worksheet.addRow({
        description: 'Total',
        Revenue: totalRevenue.toFixed(2),
        TaxAmount: totalTaxAmount.toFixed(2),
        TotalAmount: totalAmount.toFixed(2)
      }).font = { bold: true };
  
      // Set alignment for the columns
      worksheet.columns.forEach((column, index) => {
        if ([4,5,6,7].includes(index + 1)) {
          column.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          column.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Revenue With Tax_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };
  
  
 
  
  return (
    <div>
     <Card>
          <CardHeader>
            <CardTitle tag="h4"><b>Revenue With Tax</b></CardTitle>
          </CardHeader>
          <CardBody>
        <Form onSubmit={handleSubmit(ConfirmSubmit)}>
          
            <Row>
           
              <Col md='3' sm='12'>
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
              
              <Col md='3' sm='12'>
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
              </Row>
              <Row>
            
              {/* <div align='right'>
                <Button style={{ marginBottom: '4px'}} color='primary' className='me-1' type='submit'>
                  Submit
                </Button>
                

              </div>
               */}

            <div align="end" className="buttons">
              <Button className='me-1' color='primary' type='submit' disabled={isButtonClicked}>
              {isButtonClicked ? 'Processing...' : 'Submit'} 
              </Button>
              {/* <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                Reset
              </Button> */}
               {   flag == true&&
              //  <Button className='me-1' color='primary' type='submit'  onClick={onBtnExport}> Download Excel </Button>
              <Button
              className='me-1'
              color='primary'
              onClick={generateExcel}
              >
              Download Excel
              </Button>
               }
               {   flag == true&&<Button className='me-1' color='primary' onClick={printGrid}>Print PDF </Button>}
            </div>
          

            </Row>
            
            {/* <Row>
            <div className='inline-spacing' align="right" style={{ margin: '2px 0' }}>
            <Button.Ripple color='primary' size='sm' onClick={onBtnExport} >Download CSV file</Button.Ripple>
            </div>
            </Row> */}
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

    {   flag == true&&
      <div className="ag-theme-alpine" style={{ height: 530}}>
        <AgGridReact 
            ref={gridRef}
            rowData={rowData1} columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            // paginationAutoPageSize = 'true'
            paginationPageSize= '10'
            pagination = 'true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            // pinnedBottomRowData={pinnedBottom.RowData}
            
            />
      </div>}
    </div>
  );
};

export default AvailabilityMatrix;




