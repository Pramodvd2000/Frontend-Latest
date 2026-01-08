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
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
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
      setHotelNo(rowData['data'][0]['phoneNumber'])
      sethotelFax(rowData['data'][0]['fax'])
      setLogo(rowData['data'][0]['logo'])
    })
        setOpen(true)
        fetchx(DASHBOARD_URL+"/getInHouseGuestReport", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: '1',
        })
      })
        .then(result => result.json())
        .then(rowData => {
          if(rowData['statusCode'] == 200){
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
    {headerName: 'Adults'      ,field: 'numberOfAdults'  ,sunumberOfChildrenppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'Children'    ,field: 'numberOfChildren',suppressSizeToFit: true, maxWidth: 140 },  
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
  
      pdf.addImage(DASHBOARD_URL + `/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);
  
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
      const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo, fontSize) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', 'normal');
  
        const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const pageCenter = pdf.internal.pageSize.width / 2;
        const halfTextWidth = textWidth / 2;
        let textStartX = pageCenter - halfTextWidth;
        if (textStartX < 0) {
          textStartX = 0;
        } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
          textStartX = pdf.internal.pageSize.width - textWidth;
        }
  
        pdf.text(`${textToCenter}`, textStartX, yLogo);
      };
  
      setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo, 14);
      setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8, 12);
  
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      const textToCenter = "InhouseGuest Report";
  
      const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      const pageCenter = pdf.internal.pageSize.width / 2;
      const halfTextWidth = textWidth / 2;
      let textStartX = pageCenter - halfTextWidth;
  
      if (textStartX < 0) {
        textStartX = 0;
      } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
        textStartX = pdf.internal.pageSize.width - textWidth;
      }
  
      const textY = yLogo + 16;
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
  
      let grandTotalRooms = 0;
      let grandTotalAdults = 0;
  
      const totalAdultsByDate = {};
  
      uniqueArrivalDates
        .sort((a, b) => new Date(a) - new Date(b))
        .forEach((arrivalDate) => {
          const rowsForDate = rowData1
            .filter((row) => row.arrivalDate === arrivalDate);
  
          const totalRooms = new Set(rowsForDate.map(row => row.roomNumber)).size; // Unique room numbers
          const totalAdults = rowsForDate.reduce((total, row) => total + row.numberOfAdults, 0); // Total adults for that date
  
          totalAdultsByDate[arrivalDate] = totalAdults;
  
          grandTotalRooms += totalRooms;
          grandTotalAdults += totalAdults;
  
          pdf.setFont('times', 'bold');
          const formattedArrivalDate = formatDate(new Date(arrivalDate));
  
          pdf.text(`Arrivals Date: ${formattedArrivalDate}`, 10, dateY + 33, { width: 500, align: 'left' });
          const columnStyles = {
            0: { columnWidth: 21 },
            1: { columnWidth: 15 },
            2: { columnWidth: 60 },
            3: { columnWidth: 45 },
            4: { columnWidth: 30 },
            5: { columnWidth: 23 },
            6: { columnWidth: 23 },
            7: { columnWidth: 22 },
            8: { columnWidth: 21 },
          };
  
          const columns = columnDefs.map(col => col.headerName);
          const rowsData = rowsForDate.map(row => columnDefs.map(col => row[col.field]));
  
          pdf.autoTable({
            head: [columns],
            body: rowsData,
            startY: dateY + 37,
            columnStyles,
          });
  
          pdf.setFont('times', 'roman');
          pdf.text(`Total Rooms: ${totalRooms}`, 15, pdf.autoTable.previous.finalY + 5, { align: 'left' });
          pdf.text(`Total Pax: ${totalAdults}`, 235, pdf.autoTable.previous.finalY + 5, { align: 'right' });
  
          dateY = pdf.autoTable.previous.finalY + 10;
        });
  
      // Add grand totals at the end
      pdf.setFont('times', 'bold');
      pdf.text(`Grand Total Rooms: ${grandTotalRooms}`, 15, dateY + 5, { align: 'left' });
      pdf.text(`Grand Total Pax: ${grandTotalAdults}`, 235, dateY + 5, { align: 'right' });
  
      pdf.save('InhouseGuest Report.pdf');
    }
  };
  const onBtnExport = () => {
    const params = {
      fileName: 'InhouseGuest Report.xlsx',
      sheetName: 'Sheet1',
    };
    gridRef.current.api.exportDataAsExcel(params);
  };

  const generateExcel = () => {
    if (filterFromDate) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('In House Guest Report');

        const columns = [
            { header: 'BookingID', key: 'bookingID', width: 20 },
            { header: 'Room No.', key: 'roomNumber', width: 12 },
            { header: 'Guest Name', key: 'guestName', width: 25 },
            { header: 'Company', key: 'accountName', width: 30 },
            { header: 'Arrival', key: 'arrivalDate', width: 20 },
            { header: 'Departure', key: 'departureDate', width: 20 },
            { header: 'Nationality', key: 'nationalityName', width: 20 },
            { header: 'Adults', key: 'numberOfAdults', width: 20 },
            { header: 'Children', key: 'numberOfChildren', width: 20 },
        ];

        worksheet.columns = columns;

        worksheet.addRow(['Report Name:', 'In House Guest Report']);
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
          if ([8,9].includes(index + 1)) {
            column.alignment = { vertical: 'middle', horizontal: 'right' };
          } else {
            column.alignment = { vertical: 'middle', horizontal: 'left' };
          }
        });

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            saveAs(blob, `In House Guest Report_${formattedDate}.xlsx`);
        }).catch((error) => {
            console.error('Error generating Excel file:', error);
        });
    }
};

  
  return (
    <div>
     
    <h4> In House Guest Report</h4>
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
