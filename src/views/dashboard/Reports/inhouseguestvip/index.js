// ** React Imports
import { useState } from 'react'
import 'cleave.js/dist/addons/cleave-phone.us'
import Moment from 'moment'
import {  Button } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useRef, useEffect, useMemo, } from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const InhouseGuestReport = () => {
  const [rowData, setRowData] = useState([]);
  const [rowData1, setRowData1] = useState();
  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null);  
  const [open,setOpen] = useState(false)
  const [filterFromDate, setFilterFromDate] = useState(null);


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
      setFilterFromDate(rowData['data'][0].businessDate)
      setRowData(rowData['data'])
      console.log(rowData['data'][0].address)
      sethotelAddress(rowData['data'][0].address)
      setHotelName(rowData['data'][0].name)

    })
        setOpen(true)
        fetchx(DASHBOARD_URL+"/getInHouseGuestVipReport", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: '1',
        })
      })
        .then(result => result.json())
        .then(rowData => {
          if(rowData['statusCode']==200){
            setOpen(false)
          setRowData1(rowData["data"])
          }
    })
    
    },[])

  const gridRef = useRef();
   const [columnDefs, setColumnDefs] = useState([
    {headerName: 'BookingID',       field: 'bookingID',  suppressSizeToFit: true, maxWidth: 140,wrapText: true,autoHeight:true,},

    {headerName: 'Room No.',    field: 'roomNumber', suppressSizeToFit: true, maxWidth: 120 },
    {headerName: 'Guest Name ', field: 'guestName',  suppressSizeToFit: true, maxWidth: 200,wrapText: true,autoHeight:true,},
    {headerName: 'Company',     field: 'accountName',suppressSizeToFit: true, maxWidth: 220,wrapText: true,autoHeight:true,},
    {headerName: 'Arrival',field: 'arrivalDate',suppressSizeToFit: true, maxWidth: 140,
    cellRenderer: (params) => {
      if (params.data && params.data.arrivalDate) {
        const formattedDate = Moment(params.data.arrivalDate).format("DD.MM.YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    } },
    {headerName: 'Departure',field: 'departureDate',suppressSizeToFit: true, maxWidth: 180,
    cellRenderer: (params) => {
      if (params.data && params.data.departureDate) {
        const formattedDate = Moment(params.data.departureDate).format("DD.MM.YYYY");
        return formattedDate;
      } else {numberOfChildren
        return "";     
      }
    }  },
    {headerName: 'Nationality ',field: 'nationalityName' ,suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'Adults'      ,field: 'numberOfAdults'  ,sunumberOfChildrenppressSizeToFit: true, maxWidth: 100 },
    {headerName: 'Children'    ,field: 'numberOfChildren',suppressSizeToFit: true, maxWidth: 120 }, 
    {headerName: 'Vip'    ,field: 'vipType',suppressSizeToFit: true, maxWidth: 120 },  
    {headerName: 'isMain'      ,field: 'isMain',suppressSizeToFit: true, maxWidth: 140 ,hide:true},  

  ]);

  const defaultColDef = useMemo( ()=> (
    {
      sortable: true, 
    }
  ));


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
      
      const textToCenter = "InhouseGuest VIP Report";
  
      // Set font size and style
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      
      // Calculate the width of the text and center it
      const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      const pageCenter = pdf.internal.pageSize.width / 2;
      const textStartX = Math.max(0, pageCenter - textWidth / 2);
      const textY = yLogo + 16;
      pdf.text(textToCenter, textStartX, textY);
  
      // Format date function
      function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
      }
  
      // Function to calculate total rooms and adults by arrival date
      const totalAdultsByDate = {};
      const grandTotalRooms = new Set();  // Set to track unique rooms
      let grandTotalAdults = 0;
  
      uniqueArrivalDates
        .sort((a, b) => new Date(a) - new Date(b))
        .forEach((arrivalDate) => {
          const rowsForDate = rowData1
            .filter((row) => row.arrivalDate === arrivalDate)
            .map((row) => ({
              ...row,
              arrivalDate: formatDate(new Date(row.arrivalDate)),
              departureDate: formatDate(new Date(row.departureDate)),
            }));
  
          // Calculate total adults and unique rooms
          const totalAdults = rowsForDate.reduce((sum, row) => sum + (row.numberOfAdults || 0), 0);
          const uniqueRooms = new Set(rowsForDate.map(row => row.roomNumber));
          
          // Add to grand totals
          uniqueRooms.forEach(room => grandTotalRooms.add(room));
          grandTotalAdults += totalAdults;
  
          pdf.setFont('times', 'bold');
          pdf.text(`Arrivals Date: ${formatDate(new Date(arrivalDate))}`, 15, dateY + 33);
  
          // Filter and render table for the current arrival date
          const columns = columnDefs.map((column) => column.headerName);
          const filteredRows = rowsForDate.map((row) => columnDefs.map((column) => row[column.field]));
  
          const columnStyles = {
            0: { columnWidth: 21 }, 1: { columnWidth: 15 }, 2: { columnWidth: 60 }, // Column widths
          };
          
          pdf.autoTable({
            head: [columns],
            body: filteredRows,
            startY: dateY + 37,
            columnStyles,
          });
  
          pdf.setFont('times', 'roman');
          pdf.text(`Total Rooms: ${uniqueRooms.size}`, 15, pdf.autoTable.previous.finalY + 5);
          pdf.text(`Total Pax: ${totalAdults}`, 235, pdf.autoTable.previous.finalY + 5);
  
          dateY = pdf.autoTable.previous.finalY + 10;
        });
  
      // Add grand totals at the end of the report
      pdf.setFont('times', 'bold');
      pdf.text(`Grand Total Rooms: ${grandTotalRooms.size}`, 15, dateY + 10);
      pdf.text(`Grand Total Pax: ${grandTotalAdults}`, 15, dateY + 20);
  
      // Page numbers
      for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
        const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const xPos = pageCenter - pageNumberWidth / 2;
        pdf.text(pageNumber, xPos, pdf.internal.pageSize.height - 10);
      }
  
      pdf.save('InhouseGuest Vip Report.pdf');
    }
  };

  const onBtnExport = () => {
    const params = {
      fileName: 'InhouseGuest Vip Report.xlsx',
      sheetName: 'Sheet1',
    };
    gridRef.current.api.exportDataAsExcel(params);
  };

  const generateExcel = () => {
    if (filterFromDate) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('In House Guest Vip Report');

        const columns = [
            { header: 'BookingID', key: 'bookingID', width: 20 },
            { header: 'Room No.', key: 'roomNumber', width: 12 },
            { header: 'Guest Name', key: 'guestName', width: 25 },
            { header: 'Company', key: 'accountName', width: 30 },
            { header: 'Arrival', key: 'arrivalDate', width: 20 },
            { header: 'Departure', key: 'departureDate', width: 20 },
            { header: 'Nationality', key: 'nationalityName', width: 20 },
            { header: 'Adults', key: 'numberOfAdults', width: 10 },
            { header: 'Children', key: 'numberOfChildren', width: 10 },
            { header: 'VIP', key: 'vipType', width: 15 },
        ];

        worksheet.columns = columns;

        worksheet.addRow(['Report Name:', 'In House Guest Vip Report']);
        worksheet.addRow(['Filter From Date:', filterFromDate]);

        worksheet.addRow();
        worksheet.addRow(columns.map(column => column.header)).font = { bold: true };

        for (let i = 1; i <= 5; i++) {
            worksheet.getRow(i).font = { bold: true };
        }

        worksheet.spliceRows(1, 1);

        const formattedData = (rowData1) => {
            return rowData1.map(item => ({
                ...item,
                arrivalDate: Moment(item.arrivalDate).format("DD.MM.YYYY"),
                departureDate: Moment(item.departureDate).format("DD.MM.YYYY"),
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

        worksheet.columns.forEach((column, index) => {
            if ([8, 9].includes(index + 1)) {
                column.alignment = { vertical: 'middle', horizontal: 'right' };
            } else {
                column.alignment = { vertical: 'middle', horizontal: 'left' };
            }
        });

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            saveAs(blob, `In House Guest Vip Report_${formattedDate}.xlsx`);
        }).catch((error) => {
            console.error('Error generating Excel file:', error);
        });
    }
};

  
  return (
    <div>
     
    <h4> In House Guest Vip Report</h4>
          <div align="end" className="buttons">
          {/* <Button className='me-1' color='primary' type='submit'  onClick={onBtnExport}> Download Excel </Button> */}
          <Button
                className='me-1'
                color='primary'
                onClick={generateExcel}
              >
                Download Excel
                </Button>
          <Button className='me-1' color='primary' type='submit'  onClick={printGrid}>Print PDF </Button>
              </div>
              <br/>

    <br/>
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
    <div className="ag-theme-alpine">
        <AgGridReact 
            ref={gridRef}
            rowData={rowData1} 
            columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'           
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            domLayout='autoHeight'
            />
      </div>
    </div>
  )
}

export default InhouseGuestReport
