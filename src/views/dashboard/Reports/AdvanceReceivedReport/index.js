import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useRef, useEffect, useMemo, useCallback } from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const defaultValues = {
  frmdate: ''
}

const advanceReceived  = () => {
  const [rowData1, setRowData1] = useState();
  const gridRef = useRef();
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const [flag1, setflag1] = useState(false)
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })

  const [hotelDetails, setHotelDetails] = useState(null);
  const [hotelAddress, setHotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [LoadingVar,setLoadingVar] = useState(false)
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);

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


  function formatNumbers(params) {
    var number = params.value;
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
// const formatNumbers = (params) => {
//     console.log("params",params)
//     if (isNaN(params.value) || params.value === null) {
//       return '0.00';
//     }
//     return parseFloat(params.value).toFixed(2); // or any other format you want
//   };
    
// const formatNumbers = (params) => {
//     console.log("params",params)
//     if (!params.data || isNaN(params.data.total) || params.data.total === null) {
//       return '0.00';
//     }
//     return parseFloat(params.data.total).toFixed(2); // or any other format you want
// };
  const CustomHeaderComponentTotalCgst= () => {
    return (
      <div>
         CGST
      </div>
    );
  };
  
  const CustomHeaderComponentTotalSgst= () => {
    return (
      <div>
         SGST
      </div>
    );
  };

  const CustomHeaderComponentbaseamount= () => {
    return (
      <div>
         Base Amount
      </div>
    );
  };
  const [rowDataWithTotals, setRowDataWithTotals] = useState([]);


  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'BookingID', field: 'bookingID', suppressSizeToFit: true, width: 120 },
    { headerName: 'Room No', field: 'roomNumber', suppressSizeToFit: true, width: 120 },
    { headerName: 'Guest Name ', field: 'guestName', suppressSizeToFit: true, width: 170, wrapText: true, autoHeight: true, },
    { headerName: 'Bill No', field: 'billNo', suppressSizeToFit: true, width: 140 },
    { headerName: 'Transaction Code',field: 'transactionCode',suppressSizeToFit: true, width: 170,},
    { headerName: 'Description',field: 'description',suppressSizeToFit: true, width: 150, wrapText: true, autoHeight: true,},
    { headerName: 'Transaction Type',field: 'transaction_type',maxWidth: 160},
    { headerName: 'Base Amount',field: 'base_amount',maxWidth: 120 , aggFunc: 'sum',headerComponentFramework: CustomHeaderComponentbaseamount},
    { headerName: 'CGST',field: 'cgst',maxWidth: 100 , aggFunc: 'sum',valueFormatter: formatNumbers,headerComponentFramework: CustomHeaderComponentTotalCgst},
    { headerName: 'SGST',field: 'sgst',maxWidth: 100 , aggFunc: 'sum',valueFormatter: formatNumbers,headerComponentFramework: CustomHeaderComponentTotalSgst},
    { headerName: 'Tax Percentage',field: 'tax_percentage',maxWidth: 120 , aggFunc: 'sum',},
    { headerName: 'Total',field: 'total',maxWidth: 140,aggFunc: 'sum',valueFormatter: formatNumbers},
    { headerName: 'Supplement', field: 'supplement', suppressSizeToFit: true, maxWidth: 160, wrapText: true, autoHeight: true, },
    { headerName: 'Remarks',field: 'remarks',suppressSizeToFit: true, width: 130, wrapText: true, autoHeight: true,},

    {
      headerName: 'Date ', field: 'date', suppressSizeToFit: true, width: 140,
      cellRenderer: (params) => {
        if (params.data && params.data.date) {
          const formattedDate = Moment(params.data.date).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    {
      headerName: 'Bill Date', field: 'billDate', suppressSizeToFit: true, width: 140,
      cellRenderer: (params) => {
        if (params.data && params.data.billDate) {
          const formattedDate = Moment(params.data.billDate).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    {
        headerName: 'Invoice Date', field: 'invoiceDate', suppressSizeToFit: true, width: 140,
        cellRenderer: (params) => {
          if (params.data && params.data.invoiceDate) {
            const formattedDate = Moment(params.data.invoiceDate).format("DD.MM.YYYY");
            return formattedDate;
          } else {
            return "";
          }
        }
      },
    { headerName: 'POS Bill No.', field: 'pos_bill_number', suppressSizeToFit: true, width: 150 },
    // { headerName: 'Car Type', field: 'transportType', suppressSizeToFit: true, width: 140 },
    // { headerName: 'Flight Details', field: 'dropCarrierCode', suppressSizeToFit: true, width: 140 },
    // { headerName: 'Remarks', field: 'dropRemarks', suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true, },
  ]);
  const groupDisplayType = 'singleColumn';

//    // Function to calculate the sum of cgst, sgst, base_amount, and total
//    const calculateTotals = () => {
//     let totalCgst = 0;
//     let totalSgst = 0;
//     let totalBaseAmount = 0;
//     let grandTotal = 0;

//     // Calculate totals from rowData
//     rowData1.forEach(row => {
//       totalCgst += row.cgst || 0;
//       totalSgst += row.sgst || 0;
//       totalBaseAmount += row.base_amount || 0;
//       grandTotal += row.total || 0;
//     });

//     // Create a new row for totals
//     const totalsRow = {
//       bookingID: 'Totals',
//       cgst: totalCgst,
//       sgst: totalSgst,
//       base_amount: totalBaseAmount,
//       total: grandTotal
//     };

//     // Return the new row along with existing rowData
//     setRowDataWithTotals(...rowData1, totalsRow);

//     // return [...rowData1, totalsRow];
//   };

  const defaultColDef = useMemo(() => (
    {
      sortable: true,
    }
  ));

  const cellClickedListener = useCallback(event => {
    console.log(event["data"])
  }, []);

  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }

  const onSubmit = data => {
    console.log(data)
    if (data.frmdate === null || data.frmdate === undefined || data.frmdate === '') {
      handleError("Please select a date.");
      return;
    } 
  
    setIsButtonClicked(true)
    console.log(data)
    // setLoadingVar(false)
    const filterFromDate = Moment(data.frmdate[0]).format("YYYY-MM-DD");
    // const filterToDate = Moment(data.todate[0]).format("YYYY-MM-DD");
    setFilterFromDate(filterFromDate);
    // setFilterToDate(filterToDate);
    setFlag(true)
    setData(data)
    console.log("filterFromDate",filterFromDate)

    let createmarketGroup = JSON.stringify({
      "hotelID": 10,
      date: filterFromDate,
    //   endDate: filterToDate,
    })

    if (flag1 == true) {
      setOpen(true)
      let res = fetchx(DASHBOARD_URL + "/getAdvanceReceivedReportPMS", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(data => data.json())
        .then((res) => {
          if(res['statusCode'] == 200) {
            setIsButtonClicked(false)
            setOpen(false)
          // setLoadingVar(true)
          setRowData1(res["data"])
          }
          if (res['statusCode'] == 403 || res['statuscode'] == 403) {
            setOpen(false)
            setIsButtonClicked(false);
            let message = res['message'];
            if (!message || 
                (typeof message === 'object' && Object.keys(message).length === 0) || 
                (Array.isArray(message) && message.length === 0)) {
              message = 'Data is not available for the selected date';
            }
          
            const swalInstance = MySwal.fire({
              text: message,
              buttonsStyling: false,
              confirmButtonText: 'Close',
              customClass: {
                confirmButton: 'btn btn-danger',
              },
            });
          
            swalInstance.then((result) => {
              if (result.isConfirmed) {
                // Additional actions can be handled here if necessary
              }
            });
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
  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
  };

  const onBtnExport = () => {
    const params = {
      fileName: 'Advance Received Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };

  const printGrid = () => {
    if (filterFromDate ) {
      const gridApi = gridRef.current && gridRef.current.api;
      const uniqueDepartureDates = Array.from(new Set(rowData1.map((row) => row.transactionCode)));
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
        const textToCenter = "Advance Received Report";

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


        uniqueDepartureDates
          .sort((a, b) => new Date(a) - new Date(b))
          .forEach((transactionCode, index) => {
            const rowsForDate = rowData1
              .filter((row) => row.transactionCode === transactionCode)
              .map((row) => {
                const formattedArrival = formatDate(new Date(row.date));
                const formattedDeparture = formatDate(new Date(row.billDate));
                const formattedDropDate = formatDate(new Date(row.invoiceDate));
                const formatbase_amount = parseFloat(row.base_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                const formatcgst = parseFloat(row.cgst || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                const formatTotalData = parseFloat(row.total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                const formatsgst = parseFloat(row.sgst || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                return {
                  ...row,
                  date: formattedArrival,
                //   billDate: formattedDeparture,
                //   invoiceDate: formattedDropDate,
                  base_amount:formatbase_amount,
                  cgst:formatcgst,
                  sgst:formatsgst,
                  total:formatTotalData,
                };
              })
              .map((row) => columnDefs.map((column) => row[column.field]));

            const columns = columnDefs.map((column) => column.headerName);

            const tableHeight = 8;
            let currentPage = 1; // Track the current page number

            // Check if the content fits on the current page
            if (dateY + tableHeight > pdf.internal.pageSize.height - 20) {
              // Move to the next page if the content exceeds the page height
              pdf.addPage();
              dateY = 10; // Reset the Y position for the new page
              currentPage++; // Increment the current page number
            }

            const totalCount = rowsForDate.length;

            // const formattedArrivalDate = formatDate(new Date(departureDate));

            pdf.setFont('times', 'bold');
            // pdf.text(`Departure Date: ${(formattedArrivalDate)}`, 10, dateY + 37, { width: 500, align: 'left' });

            const columnStyles = {
                0: { columnWidth: 15 }, // Adjust the width as needed for each column
                1: { columnWidth: 15 },
                2: { columnWidth: 15 },
                3: { columnWidth: 15 },
                4: { columnWidth: 15 },
                5: { columnWidth: 15 },
                6: { columnWidth: 15 },
                7: { columnWidth: 15 },
                8: { columnWidth: 15 },
                9: { columnWidth: 15 },
                10: { columnWidth: 15 },
                11: { columnWidth: 10 },
                12: { columnWidth: 10 },
                13: { columnWidth: 10 },
                14: { columnWidth: 15 },
                15: { columnWidth: 15 },
                16: { columnWidth: 15 },
                17: { columnWidth: 15 },
                
                };  
            pdf.autoTable({
              head: [columns],
              body: rowsForDate,
              startY: dateY + 43,
              columnStyles,

            });

            // pdf.line(
            //   240, // Adjust X coordinate to start from where "Total drops" text starts
            //   pdf.autoTable.previous.finalY, // Y-coordinate - adjust based on your layout
            //   285, // Adjust X coordinate to end the line within the desired width
            //   pdf.autoTable.previous.finalY // Y-coordinate for the line
            // );

            // pdf.setFont('times', 'roman');
            // pdf.text(`Total drops: ${totalCount}`, 260, pdf.autoTable.previous.finalY + 7, {
            //   width: 500,
            //   align: 'center',
            // });

            // pdf.line(
            //   240, // Adjust X coordinate to start from where "Total drops" text starts
            //   pdf.autoTable.previous.finalY + 10, // Y-coordinate - adjust based on your layout
            //   285, // Adjust X coordinate to end the line within the desired width
            //   pdf.autoTable.previous.finalY + 10 // Y-coordinate for the line
            // );

            pdf.setFont('times', 'normal');
            dateY = pdf.autoTable.previous.finalY - 10
          });

        dateY = pdf.autoTable.previous.finalY + 20;

        const availableSpace = pdf.internal.pageSize.height - dateY;

        // Check if the available space is enough for the content
        if (availableSpace < 30) { // Adjust '30' based on your content height
          pdf.addPage(); // Move to the next page
          dateY = 10; // Set Y position for the new page
        }

        let fromDate = formatDate(new Date(filterFromDate))
        // let toDate = formatDate(new Date(filterToDate))

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');

        pdf.text(`Filter From Date: ${fromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
        // pdf.text(`To Departure Date: ${toDate}`, 10, dateY + 20, { width: 500, align: 'left' });

        for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
          pdf.setPage(i); // Set the active page
          pdf.setFontSize(10); // Set font size for page number

          const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
          const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;

          // Calculate position for center alignment
          const xPos = pageCenter - (pageNumberWidth / 2);
          const yPos = pdf.internal.pageSize.height - 5; // 10 units from the bottom

          pdf.text(pageNumber, xPos, yPos);
        }

        pdf.save('Advance Received Report.pdf');
      } else {
      }
    }
  };

  const generateExcel = () => {
    if (filterFromDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Advance Received Report');
  
      const columns = [
        { header: 'BookingID', key: 'bookingID', width: 15 },
        { header: 'Room No', key: 'roomNumber', width: 15 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Bill No', key: 'billNo', width: 20 },
        { header: 'Transaction Code', key: 'transactionCode', width: 20 },
        { header: 'Description', key: 'description', width: 25 },
        { header: 'Transaction Type', key: 'transaction_type', width: 20 },
        { header: 'Base Amount', key: 'base_amount', width: 15 },
        { header: 'CGST', key: 'cgst', width: 15 },
        { header: 'SGST', key: 'sgst', width: 15 },
        { header: 'Tax Percentage', key: 'tax_percentage', width: 15 },
        { header: 'Total', key: 'total', width: 20 },
        { header: 'Supplement', key: 'supplement', width: 20 },
        { header: 'Remarks', key: 'remarks', width: 25 },
        { header: 'Date', key: 'date', width: 20 },
        { header: 'Bill Date', key: 'billDate', width: 20 },
        { header: 'Invoice Date', key: 'invoiceDate', width: 20 },
        { header: 'POS Bill No.', key: 'pos_bill_number', width: 20 }
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'Advance Received Report']);
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
          marketCode: item.marketCode?.replace(/\r?\n|\r/g, ''),
          description: item.description?.replace(/\r?\n|\r/g, '')
        }));
      };
  
      const sanitizedData = formattedData(rowData1);
  
      let totalBaseAmount = 0;
      let totalCgst = 0;
      let totalSgst = 0;
      let totalAmount = 0;
  
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          bookingID: row.bookingID,
          roomNumber: row.roomNumber,
          guestName: row.guestName,
          billNo: row.billNo,
          transactionCode: row.transactionCode,
          description: row.description,
          transaction_type: row.transaction_type,
          base_amount: row.base_amount,
          cgst: row.cgst,
          sgst: row.sgst,
          tax_percentage: row.tax_percentage,
          total: row.total,
          supplement: row.supplement,
          remarks: row.remarks,
          date: row.date,
          billDate: row.billDate,
          invoiceDate: row.invoiceDate,
          pos_bill_number: row.pos_bill_number
        });
  
        totalBaseAmount += parseFloat(row.base_amount || 0);
        totalCgst += parseFloat(row.cgst || 0);
        totalSgst += parseFloat(row.sgst || 0);
        totalAmount += parseFloat(row.total || 0);
      });
  
      worksheet.addRow();
      worksheet.addRow({
        bookingID: 'Totals',
        roomNumber: '',
        guestName: '',
        billNo: '',
        transactionCode: '',
        description: '',
        transaction_type: '',
        base_amount: totalBaseAmount.toFixed(2),
        cgst: totalCgst.toFixed(2),
        sgst: totalSgst.toFixed(2),
        tax_percentage: '',
        total: totalAmount.toFixed(2),
        supplement: '',
        remarks: '',
        date: '',
        billDate: '',
        invoiceDate: '',
        pos_bill_number: ''
      });
  
      const totalRow = worksheet.lastRow;
      totalRow.font = { bold: true };
  
      worksheet.columns.forEach((column, index) => {
        if ([7, 8, 9, 11].includes(index + 1)) {
          column.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          column.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Advance Received Report_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };
  

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Advance Received  Report</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="frmdate">
                    Date
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
{/* 
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
              </Col> */}

              <div align="end" className="buttons">
                <Button className='me-1' color='primary' type='submit' onClick={() => setflag1(true)} disabled={isButtonClicked}>
                  {/* Submit */}
                  {isButtonClicked ? 'Processing...' : 'Submit'}

                </Button>
                {/* <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                Reset
              </Button> */}
                {flag == true && 
                // <Button className='me-1' color='primary' onClick={onBtnExport}> Download Excel </Button>
                <Button
                  className='me-1'
                  color='primary'
                  onClick={generateExcel}
              >
                  Download Excel
                  </Button>
                }
                {flag == true && <Button className='me-1' color='primary' onClick={printGrid}>Print PDF </Button>}
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
      {flag == true && <div className="ag-theme-alpine" >
        <AgGridReact
          ref={gridRef}
          rowData={rowData1}
          columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
          domLayout='autoHeight'       
        //   groupDisplayType={groupDisplayType}
        //   // rowSelection='multiple'               
        //   groupIncludeFooter={true}
        //   groupIncludeTotalFooter={true}
        />
      </div>}
    </div>
  )
}


export default advanceReceived
