//////Allowance  Report/////////////////////////////


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

import logo from '@src/assets/images/logo/oterra.jpg'
// import { createRoot } from 'react-dom/client';

const MySwal = withReactContent(Swal)


import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';


const defaultValues = {
  frmdate: '',
  todate: '',
}


const Block = () => {


  // AG Grid
  const [rowData1, setRowData1] = useState();
  const [companyID, setCompanyID] = useState([]);
  const [flag, setFlag] = useState(false)
  const [flag1, setflag1] = useState(false)
  const [companyData, setCompanyData] = useState([]);
  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null); 
  const [rowData, setRowData] = useState();
  const [data, setData] = useState(null)
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);


  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })

  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
  };

  let navigate = useNavigate();
  const gridRef = useRef();
  const [InvURL, setInvURL] = useState([])

  const CustomHeaderComponentTotalBaseAmount = () => {
    return <div>Base Amount</div>;
  };
  const CustomHeaderComponentTotalCGST = () => {
    return <div>CGST</div>;
  };
  const CustomHeaderComponentTotalSGST = () => {
    return <div>SGST</div>;
  };
  const CustomHeaderComponentTotal = () => {
    return (<div>Total</div>)
  };

  function formatNumber(params) {
    const formattedNumber = Number(params.value).toLocaleString('en-IN');
    return formattedNumber;
  }
  

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Booking ID', field: 'bookingID', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'User', field: 'first_name', suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true },
    { headerName: 'Room Number', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 170 },
    { headerName: 'Guest', field: 'guestName', suppressSizeToFit: true, maxWidth: 200 },

    { headerName: 'Bill No', field: 'billNoDisplay', suppressSizeToFit: true, maxWidth: 170 },
    // { headerName: 'Date', field: 'date', suppressSizeToFit: true, maxWidth: 140 },
    {
      headerName: "Date",
      field: "date",
      suppressSizeToFit: true,
      maxWidth: 140,
      cellRenderer: (params) => {
        // Ensure the arrivalDate field exists in the row data        
        if (params.data && params.data.date) {
          // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
          const formattedDate = Moment(params.data.date).format("DD-MM-YYYY");
          return formattedDate;
        } else {
          return ""; // Handle cases where the data is missing or invalid        
        }
      }
    },

    { headerName: 'Transaction Code', field: 'transactionCode', suppressSizeToFit: true, maxWidth: 190 },
    {
      headerName: 'Description', field: 'description', suppressSizeToFit: true, maxWidth: 180, wrapText: true, autoHeight: true, groupIncludeFooter: (params) => {
        return `Total ${params.colDef.headerName}`;
      }
    },
    // { headerName: 'Payment Type', field: ' ', suppressSizeToFit: true, maxWidth: 170, wrapText: true, autoHeight: true },
    // {headerName: 'Debit '          ,field:'debit'           ,suppressSizeToFit: true, maxWidth: 90 },
    {
      headerName: 'Base Amount     ',
      field: 'base_amount',
      suppressSizeToFit: true,
      maxWidth: 150,
      aggFunc: "sum",
      valueFormatter: (params) => {
        // Format the value to fixed 2 decimal places
        return Number(params.value).toFixed(2);
      },
      headerComponentFramework: CustomHeaderComponentTotalBaseAmount
    },
    
    {
      headerName: 'CGST ', field: 'cgst', suppressSizeToFit: true, maxWidth: 110, aggFunc: "sum",
      valueFormatter: (params) => {
        // Format the value to fixed 2 decimal places
        return Number(params.value).toFixed(2);
      },
      headerComponentFramework: CustomHeaderComponentTotalCGST
    },
    {
      headerName: 'SGST ', field: 'sgst', suppressSizeToFit: true, maxWidth: 110, aggFunc: "sum",
      valueFormatter: (params) => {
        // Format the value to fixed 2 decimal places
        return Number(params.value).toFixed(2);
      },
      headerComponentFramework: CustomHeaderComponentTotalSGST
    },
    {
      headerName: 'Total', field: 'total', suppressSizeToFit: true, maxWidth: 170, aggFunc: "sum",
      valueFormatter: (params) => {
        // Format the value to fixed 2 decimal places
        return Number(params.value).toFixed(2);
      },
      headerComponentFramework: CustomHeaderComponentTotal,
    },
    { headerName: 'Remarks', field: 'remarks', suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true },

  ]);
  const [hotelNo, setHotelNo] = useState(null);
  const [hotelFax, sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);


  useEffect(() => {
    const hotelID = JSON.stringify({
      hotelID: 10
    })
    fetchx(DASHBOARD_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelID
    }).then((res) => res.json())
    .then(rowData => {
      const logo = rowData.data[0].logo
      const number = rowData.data[0].phoneNumber
      const fax = rowData.data[0].fax
      setRowData(rowData['data'])
      sethotelAddress(rowData['data'][0].address)
      setHotelName(rowData['data'][0].name)
      setHotelNo(number)
      sethotelFax(fax)
      setLogo(logo)
    })
  },[])
console.log(logoimage)

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
      fileName: 'Allowance Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };



  

  const downloadPDF = async () => {
    const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.date)));
    const doc = new jsPDF({ orientation: 'landscape' });
  
    try {
const pageWidth = doc.internal.pageSize.getWidth();
const logoWidth = 20;
const xLogo = 10; // X-coordinate for the logo
const yLogo = 10; // Y-coordinate for the logo
const logoHeight = 20;
let startY = 20;
doc.addImage(DASHBOARD_URL+`/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

// doc.addImage(logo, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

const margin = { left: 2, right: 2};
const currentDate = new Date();
      const formattedDateTime = formatDateTimeWithAMPM(currentDate);
const paddingFromRight = 85;
const dateX = pageWidth - doc.getStringUnitWidth(formattedDateTime) - paddingFromRight;
doc.setFontSize(8);
doc.setFont('helvetica', 'normal');
doc.text("Generated Time " + formattedDateTime, dateX + 35, startY - 7);

// doc.setFontSize(14);
// doc.setFont('helvetica', 'normal');
// const hotelNameX = xLogo + logoWidth + 108; // Adjust as needed for spacing
// doc.text(`${hotelName}`, hotelNameX, yLogo + 3);

// doc.setFontSize(12);
// doc.setFont('helvetica', 'normal');
// const hotelAddressX = xLogo + logoWidth + 60; // Adjust as needed for spacing
// doc.text(`${hotelAddress}`, hotelAddressX, yLogo + 9);


const setHotelInfo = (doc, textToCenter, xLogo, logoWidth, yLogo, fontSize) => {
  // Set font size and style
  doc.setFontSize(fontSize);
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
// }

const textToCenter = "Allowance Report";

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

startY = 40;
  
      uniqueArrivalDates.forEach((date, index) => {
        const formattedArrivalDate = formatDate(new Date(date));
  
        const rows = rowData1
          .filter((row) => row.date === date)
          .map((row) => {
            return {
              ...row,
              date: formatDate(new Date(row.date)),
            };
          })
          .map((row) => columnDefs.map((column) => row[column.field]));

          console.log(rows)
          const baseAmountColumnIndex = columnDefs.findIndex((column) => column.field === "base_amount");

          const cgstColumnIndex = columnDefs.findIndex((column) => column.field === "cgst");
          const sgstColumnIndex = columnDefs.findIndex((column) => column.field === "sgst");
          const totalColumnIndex = columnDefs.findIndex((column) => column.field === "total");
      
      
          const totals = {
            base_amount: rows.reduce((sum, row) => sum + (parseFloat(row[baseAmountColumnIndex]) || 0), 0),

            cgst: rows.reduce((sum, row) => sum + (parseFloat(row[cgstColumnIndex]) || 0), 0),
            sgst: rows.reduce((sum, row) => sum + (parseFloat(row[sgstColumnIndex]) || 0), 0),
            total: rows.reduce((sum, row) => sum + (parseFloat(row[totalColumnIndex]) || 0), 0),
          };

const formattedBaseAmount = totals.base_amount.toLocaleString('en-IN');
const formattedCgst = totals.cgst.toLocaleString('en-IN');
const formattedSgst = totals.sgst.toLocaleString('en-IN');
const formattedTotal = totals.total.toLocaleString('en-IN');


        const spaceLeftForDate = doc.internal.pageSize.height - (startY + 20 + margin.bottom);
        if (spaceLeftForDate < 0) {
          doc.addPage();
          startY = margin.top;
        }
  
        doc.setFont('times', 'bold');
        doc.text(`Date: ${formattedArrivalDate}`, 10, startY + 5, { width: 500, align: 'left' });
  
        const spaceLeft = doc.internal.pageSize.height - (startY + 20 + margin.bottom);
        if (spaceLeft < 0) {
          doc.addPage();
          startY = margin.top;
        }

        const totalCount = rows.length;

        const columnStyles = {
          0: { columnWidth: 18 }, // Adjust the width of the first column
          1: { columnWidth: 20 },
          2: { columnWidth: 20 }, // Adjust the width of the first column
          3: { columnWidth: 24 }, // Adjust the width of the first column
          4: { columnWidth: 20 }, // Adjust the width of the first column
          5: { columnWidth: 20 }, // Adjust the width of the first column
          6: { columnWidth: 20 }, // Adjust the width of the first column
          7: { columnWidth: 20 }, // Adjust the width of the first column
          8: { columnWidth: 25 }, // Adjust the width of the first column
          9: { columnWidth: 25 }, // Adjust the width of the first column
         10: { columnWidth: 25 }, // Adjust the width of the first column
         11: { columnWidth: 25 }, // Adjust the width of the first column
         12: { columnWidth: 30 }, // Adjust the width of the first column

        // Adjust the width of the second column
          // ... Add entries for each column as needed
        };



        const columnsToFormat = [ 8,9,10,11];

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

  
        doc.autoTable({
          head: [columnDefs.map((column) => column.headerName)],
          body: rows,
          startY: startY + 10,
          margin,
          styles: { columnWidth: 'wrap' }, // Allow column content to wrap
      columnStyles: columnStyles,
      didParseCell: (data) => {
        if (data.column.index == 8 || data.column.index == 6 ) {
          data.cell.styles.halign = 'right';
        }
      }
        });


        doc.setFont('times', 'roman');
        doc.text(`Total Count: ${totalCount}`, 10, doc.autoTable.previous.finalY + 10, { width: 500, align: 'left' });
        doc.setFont('times', 'Bold');
  
        doc.line(margin.left+130, doc.autoTable.previous.finalY + 2, doc.internal.pageSize.width - margin.right-30, doc.autoTable.previous.finalY + 2);

        doc.line(margin.left+130, doc.autoTable.previous.finalY + 12, doc.internal.pageSize.width - margin.right-30, doc.autoTable.previous.finalY + 12);

        doc.setFont('times', 'Bold');



        doc.setFontSize(11);

  doc.text(`${formattedBaseAmount}`,177, doc.autoTable.previous.finalY + 10, {
    width: 500,
    align: 'left',
  });

  doc.text(`${formattedCgst}`, 197, doc.autoTable.previous.finalY + 10, {
    width: 500,
    align: 'left',
  });
        doc.text(`${formattedSgst}`, 220, doc.autoTable.previous.finalY + 10, {
          width: 500,
          align: 'left',
        });

    
        doc.text(`${formattedTotal}`, 247, doc.autoTable.previous.finalY + 10, {
          width: 500,
          align: 'left',
        });


        startY = doc.autoTable.previous.finalY + 15;

      });
  


      for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
        doc.setPage(i);
        doc.setFontSize(10);
  
        const pageNumber = `Page ${i} of ${doc.internal.getNumberOfPages()}`;
        const pageNumberWidth = (doc.getStringUnitWidth(pageNumber) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
  
        const pageCenter = doc.internal.pageSize.width / 2;
        const xPos = pageCenter - pageNumberWidth / 2;
        const yPos = doc.internal.pageSize.height - 10;
  
        doc.text(pageNumber, xPos, yPos);
      }
  
    // Add filter information at the end of the doc
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');   
        doc.text(`Filter:`, 10, startY + 10, { width: 500, align: 'left' });
      doc.text(
        `Arrival Date: From ${Moment(String(new Date(data.frmdate[0]))).format('DD.MM.YYYY')} to ${Moment(
          String(new Date(data.todate[0]))
        ).format('DD.MM.YYYY')}`,
        10,
        startY + 20,
        { width: 500, align: 'left' }
      );
  
      const pdfBlob = doc.output('blob');
      saveAs(pdfBlob, 'Allowance Report.pdf');
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

    useEffect(() => {
      fetchx(DASHBOARD_URL + "/getGuestProfileCompanyID?hotelID=1")
        .then((result) => result.json())
        .then((resp) => {
          setCompanyID(resp["data"]);
        });

      fetchx(DASHBOARD_URL + "/getInHouseGuestCompany", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: '1',
          "companyID": null,
        })
      })
        .then(result => result.json())
        .then(rowData => {
          // setRowData1(rowData["data"])
        })

    }, [])


    const handleChange = (selectedOption) => {
      const selectedIds = selectedOption.map(option => option.value);
      const selectedIdsString = JSON.stringify(selectedIds); // Convert to a JSON string
      // console.log(selectedIdsString);
      setCompanyData(selectedIdsString);
    };
    const onSubmit = data => {
      const filterFromDate = Moment(data.frmdate[0]).format("YYYY-MM-DD");
      const filterToDate = Moment(data.todate[0]).format("YYYY-MM-DD");
      setFilterFromDate(filterFromDate);
      setFilterToDate(filterToDate);
      // console.log("flag1",flag1)
      setIsButtonClicked(true)
      setOpen(true)
      setFlag(true)
      setData(data)
      let createmarketGroup = JSON.stringify({
        "hotelID": 10,
        "startDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
        "endDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
      })
      console.log(createmarketGroup)

      if (flag1 == true) {
        let res = fetchx(DASHBOARD_URL + "/getAllowanceReport", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: createmarketGroup
        }).then(data => data.json())
          .then((res) => {
            setIsButtonClicked(false)
            if(res['statusCode'] == 200) {
              setOpen(false)
            console.log(res);
            // // console.log(res["data"][0]);
            setRowData1(res["data"])
            }
          });
      }
    }
    console.log(rowData1)

    const handleReset = () => {
      reset({
        companyID: ''
      })
    }

    const exportToExcel = () => {
      const gridApi = gridRef.current.api;


      // Use ag-Grid's CSV export to get the data
      const params = {
        skipHeader: false,
        skipFooters: false,
        skipGroups: false,
        fileName: 'Arrivals VIP Report.csv',
        columnGroups: true,
        skipPinnedTop: false,
        skipPinnedBottom: false,
      };


    };

    const generateExcel = () => {
      if (filterFromDate && filterToDate) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Allowance Report'); // Updated report name
    
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
    
        worksheet.addRow(['Report Name:', 'Allowance Report']); // Updated report name
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
          saveAs(blob, `Allowance Report_${formattedDate}.xlsx`); // Updated report name
        }).catch((error) => {
          console.error('Error generating Excel file:', error);
        });
      }
    };
    
    

    return (
      <div>

        <Card>
          <CardHeader>
            <CardTitle tag='h4'>Allowance Report</CardTitle>
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
                  <Button className='me-1' color='primary' type='submit' onClick={() => setflag1(true)} disabled={isButtonClicked}>
                  {isButtonClicked ? 'Processing...' : 'Submit'}
                  </Button>
                  <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                    Reset
                  </Button>
                  {/* <Button className='me-1' color='primary' type='submit' onClick={onButtonExport}> Download Excel </Button> */}
                  <Button
              className='me-1'
              color='primary'
              onClick={generateExcel}
            >
              Download Excel
              </Button>
                  <Button className='me-1' color='primary'  onClick={downloadPDF}>Print to PDF
                  </Button>
                  {/* <Button className='me-1' color='primary' type='submit' onClick={()=>setflag1(false)}>
                Download
              </Button> */}
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
        {flag1 == true && <div className="ag-theme-alpine" >
          <AgGridReact
            ref={gridRef}
            rowData={rowData1}
            // rowData={updatedRowData}

            columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            // paginationPageSize= '10'
            // pagination = 'true'            
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            domLayout='autoHeight'
            // autoGroupColumnDef={autoGroupColumnDef}
            groupIncludeFooter={true}
            groupIncludeTotalFooter={true}

          />
        </div>}
      </div>
    )

  }


  export default Block