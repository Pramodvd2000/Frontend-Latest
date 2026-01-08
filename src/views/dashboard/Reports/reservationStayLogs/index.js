import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader,Input, InputGroup, InputGroupText } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

// Import ag-grid
// import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback} from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { format } from 'date-fns'


const defaultValues = { 
    frmdate: ''
}

const NoShowReport = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [rowData1, setRowData1] = useState();
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);

  const gridRef = useRef();
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const { reset, handleSubmit, control,watch } = useForm({ defaultValues })
  const [flag1, setflag1] = useState(false)
  const [InvURL,setInvURL] = useState([])
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);



  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "B_ID",
      field: "bookingID",
      valueGetter: (params) => {
        if (params.data && params.data.bookingID && params.data.isMain === 0) {
          return `${params.data.bookingID}*`;
        }
        return params.data.bookingID;
      },
      suppressSizeToFit: true,
      maxWidth: 102,
      filter: 'agTextColumnFilter'
    },
    // {
    //   headerName: "B_ID",
    //   field: "bookingID",
    //   valueGetter: (params) => params.data?.bookingID || '',
    //   cellRenderer: BookingIdRenderer,  // Use the React component
    //   suppressSizeToFit: true,
    //   width: 150,
    //   filter: 'agTextColumnFilter'
    // },
    {
      headerName: "Guest",
      field: "guestName",
      suppressSizeToFit: true,
      style: { marginLeft: '-2px' },
      maxWidth: 150
    },
    {
      headerName: "Comp/Agent",
      field: "accountName",
      suppressSizeToFit: true,
      maxWidth: 132,
    },
    {
      headerName: "Arrival",
      field: "arrivalDate",
      suppressSizeToFit: true,
      maxWidth: 120,
      cellRenderer: (params) => {
        if (params.data && params.data.arrivalDate) {
          const formattedDate = format(new Date(params.data.arrivalDate), 'dd MMM yy');
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
          const formattedDate = format(new Date(params.data.departureDate), 'dd MMM yy');
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    {
        headerName: "Old Value",
        field: "oldValue",
        suppressSizeToFit: true,
        maxWidth: 120,
        cellRenderer: (params) => {
          if (params.data && params.data.oldValue) {
            const formattedDate = format(new Date(params.data.oldValue), 'dd MMM yy');
            return formattedDate;
          } else {
            return "";
          }
        }
      },
      {
        headerName: "New Value",
        field: "newValue",
        suppressSizeToFit: true,
        maxWidth: 120,
        cellRenderer: (params) => {
          if (params.data && params.data.newValue) {
            const formattedDate = format(new Date(params.data.newValue), 'dd MMM yy');
            return formattedDate;
          } else {
            return "";
          }
        }
      },
    // {
    //   headerName: "R_Type",
    //   field: "roomType",
    //   suppressSizeToFit: true,
    //   maxWidth: 98,
    // },
    {
      headerName: "R_Type/No.Rms",
      field: "roomTypeRooms",
      valueGetter: (params) => {
        const roomType = params.data.roomType ? params.data.roomType : '';
        const numberOfRooms = params.data.numberOfRooms ? params.data.numberOfRooms : '';
        return `${roomType} - ${numberOfRooms}`;
      },
      suppressSizeToFit: true,
      maxWidth: 152,
    },
    {
      headerName: "Status",
      field: "reservationStatus",
      suppressSizeToFit: true,
      maxWidth: 120,
    },
    // {
    //   headerName: "Actions",
    //   cellRendererFramework: (params) => (
    //     <Button
    //       color="primary"
    //       style={{ width: 100 }}
    //       onClick={() => {
    //         setOptions(!options);
    //         sessionStorage.setItem('reser_ID', params['data']['id']);
    //       }}
    //     >
    //       Actions
    //     </Button>
    //   ),
    //   suppressSizeToFit: true,
    //   cellStyle: { textAlign: 'center' },
    //   cellClass: 'vertical-center',
    //   maxWidth: 120
    // },

  
    {
      headerName: "SubID",
      field: "subBookingID",
      suppressSizeToFit: true,
      maxWidth: 90,
    },
    {
      headerName: "Room",
      field: "roomNumber",
      suppressSizeToFit: true,
      maxWidth: 90,
      filter: 'agTextColumnFilter'
    },
    {
      headerName: "Grp ID",
      field: "blockCodeID",
      suppressSizeToFit: true,
      maxWidth: 94,
    },
    // {
    //   headerName: "Rooms",
    //   field: "numberOfRooms",
    //   suppressSizeToFit: true,
    //   maxWidth: 96,
    // },
    {
      headerName: "Market",
      field: "marketCode",
      suppressSizeToFit: true,
      maxWidth: 110,
    },
    {
      headerName: "Source",
      field: "sourceCode",
      suppressSizeToFit: true,
      maxWidth: 110,
    },
    {
      headerName: "ID/ShID",
      field: "idSharingID",
      valueGetter: (params) => {
        const id = params.data.id ? params.data.id : '';
        const sharingID = params.data.sharingID ? params.data.sharingID : '';
        return `${id}/${sharingID}`;
      },
      suppressSizeToFit: true,
      maxWidth: 122,
    },
    {
      headerName: "Created By",
      field: "createdByName",
      suppressSizeToFit: true,
      maxWidth: 132,
    },
    {
      headerName: "Created At",
      field: "createdAt",
      suppressSizeToFit: true,
      maxWidth: 170,
    },
  ]);

  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
  };
  const defaultColDef = useMemo( ()=> (
    {
      sortable: true, 
    }
  ));

  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
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
        "fromDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
        "toDate":Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
      })
      if(flag1 ==true){

      let res = fetchx(DASHBOARD_URL+"/getReservationStayModifiedLogs", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(data => data.json())
      .then((res) => {
        setIsButtonClicked(false)
        if(res['statusCode'] == 200) {
          setOpen(false)
        console.log(res);
        console.log(res["data"][0]);
        setRowData1(res["data"])
        }
      }); 
    } 
    
  }

  const handleReset = () => {
    reset({    
      frmdate: '',
      todate: ''
    })
  }
  
  const onBtnExport = () => {
    const params = {
      fileName: 'No Show Report.xlsx',
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
      // const pageWidth = pdf.internal.pageSize.getWidth();
      // const logoWidth = 15;
      // const xCenter = (pageWidth - logoWidth) / 2;
      // const logoHeight = 15;
      // pdf.addImage(Logo, 'JPEG', xCenter, 6, logoWidth, logoHeight);
      // pdf.setFontSize(12); 
      // pdf.setFont('helvetica', 'bold');
      // pdf.text(`${hotelName}`, 135, 26);
      // pdf.text(`${hotelAddress}`, 100, 32);
      // pdf.text('No Show Report', 132, 39); 
      // let dateY = 10;
   
      // const margin = { left: 10, right: 10 };
      // const currentDate = new Date();
      // const formattedDate = formatDates(currentDate);
      // const paddingFromRight = 100;
      // const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
      // pdf.text("Report Generated Time " + formattedDate, dateX, dateY);
      // const pageCenter = pdf.internal.pageSize.width / 2;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const logoWidth = 20;
      const xLogo = 10; // X-coordinate for the logo
      const yLogo = 10; // Y-coordinate for the logo
      const logoHeight = 20;
      let dateY = 20;
    
      // pdf.addImage(Logo, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);
    
      // const margin = { left: 10, right: 10 };
      // const currentDate = new Date();
      // const formattedDate = formatDates(currentDate);
      // const paddingFromRight = 85;
      // const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
      // pdf.setFontSize(8);
      // pdf.setFont('helvetica', 'normal');
      // pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);
      
      // pdf.setFontSize(14);
      // pdf.setFont('helvetica', 'normal');
      // const hotelNameX = xLogo + logoWidth + 108; // Adjust as needed for spacing
      // pdf.text(`${hotelName}`, hotelNameX, yLogo + 3);
      
      // pdf.setFontSize(12);
      // pdf.setFont('helvetica', 'normal');
      // const hotelAddressX = xLogo + logoWidth + 60; // Adjust as needed for spacing
      // pdf.text(`${hotelAddress}`, hotelAddressX, yLogo + 9);
      
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
      const textToCenter = "No Show Report";
    
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
          const formattedPickUpDate = formatDate(new Date(row.createdAt));
          // const isMain = row.isMain;    

          return {
            ...row,
            arrivalDate: formattedArrival,
            departureDate: formattedDeparture,
            createdAt: formattedPickUpDate,
            // isMain: isMain

          };
        })
         .map((row) => columnDefs.map((column) => row[column.field]));
     
       const columns = columnDefs.map((column) => column.headerName);
             // Calculate the height of the table content
    const tableHeight = 8;
    let currentPage = 1; // Track the current page number

    // Check if the content fits on the current page
    if (dateY + tableHeight > pdf.internal.pageSize.height - 20) {
      // Move to the next page if the content exceeds the page height
      pdf.addPage();
      dateY = 10; // Reset the Y position for the new page
      currentPage++; // Increment the current page number
    }

        //  // Initialize totalCount before filtering rowsForDate
        //  let totalRooms = rowsForDate.length;

        //  // Filter rowsForDate to exclude rows where isMain is zero
        //  const filteredRoomRows = rowsForDate.filter(row => row[9] !== 0);
 
        //  // Calculate totalCount based on the filtered rows
        //  totalRooms = filteredRoomRows.length;
        //  console.log("totalRooms",totalRooms)


       const totalCount = rowsForDate.length;
       pdf.setFont('times', 'bold');
       const formattedArrivalDate = formatDate(new Date(arrivalDate));
       

       pdf.text(`Date: ${formattedArrivalDate}`, 10, dateY + 26, { width: 500, align: 'left' });  
       const columnStyles = {
        0: { columnWidth: 21 }, // Adjust the width as needed for each column
        1: { columnWidth: 40 },
        2: { columnWidth: 20 },
        3: { columnWidth: 25 },
        4: { columnWidth: 40 },
        5: { columnWidth: 23 },
        6: { columnWidth: 23 },
        7: { columnWidth: 22 },
        8: { columnWidth: 50 },
        // 9: { columnWidth: 30 },

      };   
     
      // const filteredColumns = columns.filter(columnName => columnName !== 'isMain');
    // console.log("filteredColumns",filteredColumns)
       pdf.autoTable({
         head: [columns],
         body: rowsForDate,
         startY: dateY + 30, 
         columnStyles,
       });
      //  pdf.line(margin.left, pdf.autoTable.previous.finalY + 2, pdf.internal.pageSize.width - margin.right, pdf.autoTable.previous.finalY + 2);

      pdf.line(
        240, // Adjust X coordinate to start from where "Total drops" text starts
        pdf.autoTable.previous.finalY, // Y-coordinate - adjust based on your layout
        275, // Adjust X coordinate to end the line within the desired width
        pdf.autoTable.previous.finalY // Y-coordinate for the line
      ); 
      
      // pdf.line(
      //   40, // Adjust X coordinate to start from where "Total drops" text starts
      //   pdf.autoTable.previous.finalY, // Y-coordinate - adjust based on your layout
      //   80, // Adjust X coordinate to end the line within the desired width
      //   pdf.autoTable.previous.finalY // Y-coordinate for the line
      // ); 


      pdf.setFont('times', 'roman');
      // pdf.text(`Total Rooms : ${totalRooms}`,50, pdf.autoTable.previous.finalY + 5, { width: 500, align: 'left', });

       pdf.text(`Total: ${totalCount}`, 260, pdf.autoTable.previous.finalY + 5, {
         width: 500,
         align: 'center',
       });
  
      // pdf.line(
      //   40, // Adjust X coordinate to start from where "Total drops" text starts
      //   pdf.autoTable.previous.finalY  + 8, // Y-coordinate - adjust based on your layout
      //   80, // Adjust X coordinate to end the line within the desired width
      //   pdf.autoTable.previous.finalY + 8 // Y-coordinate for the line
      // ); 
      pdf.line(240,
        pdf.autoTable.previous.finalY + 8, // Y-coordinate - adjust based on your layout
        275, // Adjust X coordinate to end the line within the desired width
        pdf.autoTable.previous.finalY + 8 // Y-coordinate for the line
      );
      pdf.setFont('times', 'normal');  
       dateY = pdf.autoTable.previous.finalY ;

      });

      dateY = pdf.autoTable.previous.finalY + 20;
      const availableSpace = pdf.internal.pageSize.height - dateY;

      // Check if the available space is enough for the content
      if (availableSpace < 30) { // Adjust '30' based on your content height
        pdf.addPage(); // Move to the next page
        dateY = 10; // Set Y position for the new page
      }
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
      pdf.save('No Show Report.pdf');
    } else {
    }  
    }

  };

  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reservation Stay Modified Report');
   
      const columns = [
        { header: 'Booking ID', key: 'bookingID', width: 20 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Company/Agent', key: 'accountName', width: 30 },
        { header: 'Arrival', key: 'arrivalDate', width: 20 },
        { header: 'Departure', key: 'departureDate', width: 20 },
        { header: 'Old Departure', key: 'oldValue', width: 20 },
        { header: 'New Departure', key: 'newValue', width: 20 },
        { header: 'Room Type/Rooms', key: 'roomTypeRooms', width: 25 },
        { header: 'Status', key: 'reservationStatus', width: 15 },
        { header: 'Sub ID', key: 'subBookingID', width: 15 },
        { header: 'Room No', key: 'roomNumber', width: 15 },
        { header: 'Group ID', key: 'blockCodeID', width: 15 },
        { header: 'Market', key: 'marketCode', width: 15 },
        { header: 'Source', key: 'sourceCode', width: 15 },
        { header: 'Reservation ID / Sharing ID', key: 'idSharingID', width: 25 },
        { header: 'Created By', key: 'createdByName', width: 20 },
        { header: 'Created At', key: 'createdAt', width: 20 }
      ];
      
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'Reservation Stay Modified Report']);
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
          arrivalDate:format(new Date(item.arrivalDate), 'dd MMM yy'),
          departureDate: format(new Date(item.departureDate), 'dd MMM yy'),
        }));
      };
  
      const sanitizedData = formattedData(rowData1);
  
      sanitizedData.forEach((row) => {
        worksheet.addRow({
            bookingID: row.isMain === 0 ? `${row.bookingID}*` : row.bookingID,
            guestName: row.guestName,
            accountName: row.accountName,
            arrivalDate: row.arrivalDate,
            departureDate: row.departureDate,
            oldValue: row.oldValue ? format(new Date(row.oldValue), 'dd MMM yy') : '',
            newValue: row.newValue ? format(new Date(row.newValue), 'dd MMM yy') : '',
            roomTypeRooms: `${row.roomType || ''} - ${row.numberOfRooms || ''}`,
            reservationStatus: row.reservationStatus,
            subBookingID: row.subBookingID,
            roomNumber: row.roomNumber,
            blockCodeID: row.blockCodeID,
            marketCode: row.marketCode,
            sourceCode: row.sourceCode,
            idSharingID: `${row.id}/${row.sharingID}`,
            createdByName: row.createdByName,
            createdAt: row.createdAt
          });
      });
  
      worksheet.columns.forEach((column) => {
        column.alignment = { vertical: 'middle', horizontal: 'left' };
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Reservation Stay Modified_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };


//   const getPastelColorFromString = (str) => {
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//       hash = str.charCodeAt(i) + ((hash << 5) - hash);
//     }
  
//     const hue = Math.abs(hash % 360);
//     const saturation = 60 + (Math.abs(hash) % 20); // 60% to 80%
//     const lightness = 75 + (Math.abs(hash) % 10); // 75% to 85%
  
//     return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
//   };
  
  
//   const getRowStyle = (params) => {
//     const sharingID = params.data?.sharingID || '';
//     console.log("sharingID",sharingID)
//     const backgroundColor = getPastelColorFromString(sharingID.toString());
//     return { backgroundColor };
//   };


  const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h2 = Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };
  
  const getPastelColorFromString = (str) => {
    const hash = cyrb53(str);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`; // Fixed saturation/lightness for pastel
  };
  const colorCache = {};

const getRowStyle = (params) => {
  const sharingID = params.data?.sharingID?.toString() || '';
  if (!colorCache[sharingID]) {
    colorCache[sharingID] = getPastelColorFromString(sharingID);
  }
  return { backgroundColor: colorCache[sharingID] };
};
  


  return (
    <div>
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Reservation Stay Modified Report</CardTitle>
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

          <div align="end" className="buttons">
              <Button className='me-1' color='primary' type='submit' onClick={()=>setflag1(true)} disabled={isButtonClicked}>
              {isButtonClicked ? 'Processing...' : 'Submit'}
              </Button>
              {/* <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                Reset
              </Button> */}
               {flag == true &&  
              //  <Button className='me-1' color='primary' type='submit'  onClick={onBtnExport}> Download Excel </Button>
              <Button
              className='me-1'
              color='primary'
              onClick={generateExcel}
              >
              Download Excel
              </Button>
               }
              {/* {flag == true && <Button className='me-1' color='primary' onClick={printGrid}>Print PDF </Button>} */}
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
            defaultColDef={defaultColDef}
            // getRowStyle={getRowStyle}

            headerColor="ddw-primary"
            domLayout='autoHeight'
            paginationPageSize="10"
          pagination="true"
            />
      </div>}
    </div>
  )
}

export default NoShowReport