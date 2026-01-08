// ** React Imports
import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader,  } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import {AgGridReact} from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import { useRef, useEffect, useMemo, useCallback} from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import { useNavigate } from 'react-router-dom';
import 'ag-grid-enterprise'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as XLSX from 'xlsx';
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


const MySwal = withReactContent(Swal)

const defaultValues = { 
    frmdate: ''
}

const GuestBalanceReport = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [rowData1, setRowData1] = useState();
  const gridRef = useRef();
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const { reset, handleSubmit, control , watch} = useForm({ defaultValues })
  let navigate = useNavigate();  
  const [flag1, setflag1] = useState(false)
  const [InvURL,setInvURL] = useState([])  
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
  };
  function formatNumbers(params) {
    var number = params.value;
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function formatCurrency(params) {
  var number = params.value;
  return number.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

   const [columnDefs, setColumnDefs] = useState([
    {headerName: 'Room No',field: 'roomNumber',suppressSizeToFit: true, maxWidth: 130 },
    {headerName: 'Guest Name ',field: 'guestName',suppressSizeToFit: true, maxWidth: 170,wrapText: true,autoHeight:true  },
    {headerName: 'Arrival Date',field: 'arrivalDate',suppressSizeToFit: true, maxWidth: 140,
    cellRenderer: (params) => {
      if (params.data && params.data.arrivalDate) {
        const formattedDate = Moment(params.data.arrivalDate).format("DD.MM.YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    } },
    {headerName: 'Departure Date',field: 'departureDate',suppressSizeToFit: true, maxWidth: 160,
    cellRenderer: (params) => {
      if (params.data && params.data.departureDate) {
        const formattedDate = Moment(params.data.departureDate).format("DD.MM.YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    }  },
    {headerName: 'Adults',field: 'numberOfAdults',suppressSizeToFit: true, maxWidth: 100 },
    {headerName: 'Rate',field: 'rate',suppressSizeToFit: true, maxWidth: 110 ,valueFormatter: formatCurrency},
    {headerName: 'Room Charges',field: 'room_charges',suppressSizeToFit: true, maxWidth: 150 ,valueFormatter: formatCurrency},
    {headerName: 'Other Charges',field: 'other_charges',suppressSizeToFit: true, maxWidth: 150,valueFormatter: formatCurrency }, 
    {headerName: 'Credit',field: 'payment',suppressSizeToFit: true, maxWidth: 140,valueFormatter: formatCurrency },
    {headerName: 'Balance',field: 'balance',suppressSizeToFit: true, maxWidth: 140,valueFormatter: formatCurrency },

  ]);
  const defaultColDef = useMemo( ()=> (
    {
      sortable: true, 
      filter: true,
      filterParams :{
        buttons : ['apply','reset']
      }
    }
  ));

  const cellClickedListener = useCallback( event => {
  }, []);

  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [open,setOpen] = useState(false)


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
    console.log(rowData['data'][0])
    console.log(rowData['data'][0].name)
    sethotelAddress(rowData['data'][0].address)
    setHotelName(rowData['data'][0].name)
    setHotelNo(rowData['data'][0]['phoneNumber'])
    sethotelFax(rowData['data'][0]['fax'])
    setLogo(rowData['data'][0]['logo'])
  })
},[])

  const onSubmit = data => {
    setIsButtonClicked(true)
    setOpen(true)
    const filterFromDate = Moment(data.frmdate[0]).format("DD.MM.YYYY");
    const filterToDate = Moment(data.todate[0]).format("DD.MM.YYYY");  
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    setFlag(true)

    setData(data)
      let createmarketGroup = JSON.stringify({
        "hotelID": 1,
        "startDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
        "endDate":Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
      })
      if(flag1 ==true){

      let res = fetchx(DASHBOARD_URL+"/getGuestBalanceReport", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(data => data.json())
      .then((res) => {
        setIsButtonClicked(false)
        setOpen(false)
        if(res['statusCode'] == 200) {
        setRowData1(res["data"])
        }
      }); 
    }
      
  }

  const onBtnExport = () => {
    const params = {
      fileName: 'Guest Balance Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };

  const printGrid = () => {
    if (filterFromDate && filterToDate) {
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

      pdf.addImage(DASHBOARD_URL+`/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

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
      const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo,fontSize) => {
        // Set font size and style
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', 'normal');
        
        const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const pageCenter = pdf.internal.pageSize.width / 2;
        const halfTextWidth = textWidth / 2;
        let textStartX = pageCenter - halfTextWidth;
          if (textStartX < 0) {
            textStartX = 0; // Set a minimum X-coordinate
        } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
            textStartX = pdf.internal.pageSize.width - textWidth; // Adjust to fit within the page
        }
      
        // Draw the text on the PDF
        pdf.text(`${textToCenter}`, textStartX, yLogo);
      };
      
      // Set hotel name
      setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo,14);
      setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8,12); 
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      
      const textToCenter = "Guest High Balance Report";

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

      // const pageWidth = pdf.internal.pageSize.getWidth();
      // const logoWidth = 15;
      // const xCenter = (pageWidth - logoWidth) / 2;
      // const logoHeight = 15;
      // const totalPages = uniqueArrivalDates.length;
      // let currentPage = 1; // Track the current page number
      // pdf.addImage(Logo, "JPEG", xCenter, 10, logoWidth, logoHeight);
      // pdf.setFontSize(12);
      // pdf.setFont("helvetica", "bold");
      // pdf.text(`${hotelName}`, 135, 33);
      // pdf.text(`${hotelAddress}`, 100, 39);
      // pdf.text('Guest High Balance Report', 120, 45);
      // let dateY = 10;
   
      // const margin = { left: 10, right: 10 };
      // const currentDate = new Date();
      // const formattedDate = formatDates(currentDate);
      // const paddingFromRight = 100;
      // const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
      // pdf.text("Report Generated Time " + formattedDate, dateX, dateY);
      // const pageCenter = pdf.internal.pageSize.width / 2;

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


      const totalAdultsByDate = {};

     uniqueArrivalDates
     .sort((a, b) => new Date(a) - new Date(b))
     .forEach((arrivalDate, index) => {
       const rowsForDate = rowData1
         .filter((row) => row.arrivalDate === arrivalDate)
         .map((row) => {
          const formattedArrival = formatDate(new Date(row.arrivalDate));
          const formattedDeparture = formatDate(new Date(row.departureDate));
    
          return {
            ...row,
            arrivalDate: formattedArrival,
            departureDate: formattedDeparture,
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
       let totalAdults = 0;
       for (let i = 0; i < rowsForDate.length; i++) {
         totalAdults += rowsForDate[i][4]
           ? parseInt(rowsForDate[i][4])
           : 0;
       }
       totalAdultsByDate[arrivalDate] = totalAdults;

       pdf.text(`Date: ${formattedArrivalDate}`, 10, dateY + 37, { width: 500, align: 'left' });   
       
       const columnStyles = {
        0: { columnWidth: 22 }, // Adjust the width as needed for each column
        1: { columnWidth: 40 },
        2: { columnWidth: 30 },
        3: { columnWidth: 30 },
        4: { columnWidth: 35 },
        5: { columnWidth: 22 },
        6: { columnWidth: 25 },
        7: { columnWidth: 30 },
        8: { columnWidth: 15 },
        9: { columnWidth: 25 },
        
      };
      const cleanHeaderRow = headerRow.replace(/"/g, '').replace(/sum\(([^)]+)\)/g, '$1');
      const columnsToFormat = [5,6,7,8,9,10];
 
 
      rowsForDate.forEach(row => {
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

       pdf.autoTable({
         head: [columns],
         body: rowsForDate,
         startY: dateY + 40, 
         columnStyles,
       });
      //  pdf.line(margin.left, pdf.autoTable.previous.finalY + 2, pdf.internal.pageSize.width - margin.right, pdf.autoTable.previous.finalY + 2);
      pdf.line(
        110,
        pdf.autoTable.previous.finalY , // Y-coordinate - adjust based on your layout
        150, // Adjust X coordinate to end the line within the desired width
        pdf.autoTable.previous.finalY  // Y-coordinate for the line
      );
     
      pdf.line(
        250, // Adjust X coordinate to start from where "Total drops" text starts
        pdf.autoTable.previous.finalY, // Y-coordinate - adjust based on your layout
        280, // Adjust X coordinate to end the line within the desired width
        pdf.autoTable.previous.finalY // Y-coordinate for the line
      );
       pdf.setFont('times', 'roman');
       pdf.text(`Total : ${totalCount}`, 260, pdf.autoTable.previous.finalY + 5, {
         width: 500,
         align: 'center',
       });
      //  pdf.text(`Total: ${totalCount}`, 15, pdf.autoTable.previous.finalY + 5, {
      //    width: 500,
      //    align: 'left',
      //  });

       pdf.text(
        `Total Adults: ${totalAdults}`, 140,
        pdf.autoTable.previous.finalY + 5,
        {
          width: 500,
          align: "right",
        }
      );
      // pdf.line(margin.left, pdf.autoTable.previous.finalY + 15, pdf.internal.pageSize.width - margin.right, pdf.autoTable.previous.finalY + 15);
     
      pdf.line(
        110,
        pdf.autoTable.previous.finalY + 8, // Y-coordinate - adjust based on your layout
        150, // Adjust X coordinate to end the line within the desired width
        pdf.autoTable.previous.finalY + 8 // Y-coordinate for the line
      );
     
      pdf.line(
        250,
        pdf.autoTable.previous.finalY + 8, // Y-coordinate - adjust based on your layout
        280, // Adjust X coordinate to end the line within the desired width
        pdf.autoTable.previous.finalY + 8 // Y-coordinate for the line
      );
       pdf.setFont('times', 'normal');  
       dateY = pdf.autoTable.previous.finalY - 3;
      });


      dateY = pdf.autoTable.previous.finalY + 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
       pdf.text(`Filter From Arrival Date: ${filterFromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
       pdf.text(`To Arrival Date: ${filterToDate}`, 10, dateY + 20, { width: 500, align: 'left' });
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
      pdf.save('Guest High Balance Report.pdf');
    } else {
    }  
    }

  };

  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Guest High Balance Report');
  
      const columns = [
        { header: 'Room No', key: 'roomNumber', width: 15 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Arrival Date', key: 'arrivalDate', width: 20 },
        { header: 'Departure Date', key: 'departureDate', width: 20 },
        { header: 'Adults', key: 'numberOfAdults', width: 10 },
        { header: 'Rate', key: 'rate', width: 15, valueFormatter: formatCurrency },
        { header: 'Room Charges', key: 'room_charges', width: 15, valueFormatter: formatCurrency },
        { header: 'Other Charges', key: 'other_charges', width: 15, valueFormatter: formatCurrency },
        { header: 'Credit', key: 'payment', width: 15, valueFormatter: formatCurrency },
        { header: 'Balance', key: 'balance', width: 15, valueFormatter: formatCurrency },
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'Guest High Balance Report']);
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
          arrivalDate: item.arrivalDate ? Moment(item.arrivalDate).format("DD.MM.YYYY") : '',
          departureDate: item.departureDate ? Moment(item.departureDate).format("DD.MM.YYYY") : ''
        }));
      };
  
      const sanitizedData = formattedData(rowData1);
  
      let totalAdults = 0;
      let totalRate = 0;
      let totalRoomCharges = 0;
      let totalOtherCharges = 0;
      let totalCredit = 0;
      let totalBalance = 0;
  
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          roomNumber: row.roomNumber,
          guestName: row.guestName,
          arrivalDate: row.arrivalDate,
          departureDate: row.departureDate,
          numberOfAdults: row.numberOfAdults,
          rate: row.rate,
          room_charges: row.room_charges,
          other_charges: row.other_charges,
          payment: row.payment,
          balance: row.balance
        });
  
        totalAdults += parseInt(row.numberOfAdults || 0);
        totalRate += parseFloat(row.rate || 0);
        totalRoomCharges += parseFloat(row.room_charges || 0);
        totalOtherCharges += parseFloat(row.other_charges || 0);
        totalCredit += parseFloat(row.payment || 0);
        totalBalance += parseFloat(row.balance || 0);
      });
  
      worksheet.addRow();
      worksheet.addRow({
        roomNumber: 'Totals',
        guestName: '',
        arrivalDate: '',
        departureDate: '',
        numberOfAdults: totalAdults,
        rate: totalRate.toFixed(2),
        room_charges: totalRoomCharges.toFixed(2),
        other_charges: totalOtherCharges.toFixed(2),
        payment: totalCredit.toFixed(2),
        balance: totalBalance.toFixed(2)
      });
  
      const totalRow = worksheet.lastRow;
      totalRow.font = { bold: true };
  
      worksheet.columns.forEach((column, index) => {
        column.alignment = { vertical: 'middle', horizontal: index >= 5 ? 'right' : 'left' };
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Guest High Balance Report_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };
  
  
  

  return (
    <div>
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Guest High Balance Report</CardTitle>
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
                    // options={optionsToDate} 
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

          <div align="end" className="buttons">
              <Button className='me-1' color='primary' type='submit' onClick={()=>setflag1(true)} disabled={isButtonClicked}>
              {isButtonClicked ? 'Processing...' : 'Submit'}

              </Button>
              
              {flag == true &&  
              // <Button className='me-1' color='primary' type='submit'  onClick={onBtnExport}> Download Excel </Button>
              <Button
              className='me-1'
              color='primary'
              onClick={generateExcel}
            >
              Download Excel
              </Button>
              }
              {flag == true && <Button className='me-1' color='primary'  onClick={printGrid}>Print PDF </Button>}
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
     
   { flag == true && <div className="ag-theme-alpine" >
        <AgGridReact 
            ref={gridRef}
            rowData={rowData1} 
            columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            // paginationPageSize= '10'
            // pagination = 'true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            domLayout='autoHeight'
            />
      </div>}
    {/* <App/> */}
    </div>
  )
}

export default GuestBalanceReport