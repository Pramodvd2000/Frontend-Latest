import React, { Fragment, useState, Component, useRef, useEffect, useMemo, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Moment from 'moment'
import "@styles/react/libs/flatpickr/flatpickr.scss"
import DASHBOARD_URL from "../../../../dashboard";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '@src/assets/images/logo/oterra.jpg'
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// ** Reactstrap Imports
import { AccordionBody, AccordionHeader, AccordionItem, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, Accordion, InputGroup, NavLink, UncontrolledAccordion } from 'reactstrap'
import { fontStyle } from '@mui/system'

const defaultValues = {
};
const FlashReport = () => {
  const [FlashData, setFlashData] = useState([])
  const [data, setData] = useState(null);
  const [Today, setToday] = useState()
  const [ReqFormatedData, setReqFormatedData] = useState({})
  const [roomData, setRoomData] = useState({})
  const [roomDataForMonth, setRoomDataForMonth] = useState({})

  const [hotelDetails, setHotelDetails] = useState(null);
  const [hotelAddress, setHotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);

  const optionsToDate = {
    maxDate: new Date().setDate(new Date(Today).getDate() - 1)
  };
  const { reset, handleSubmit, control, formState: { errors }
  } = useForm({ defaultValues });
  const [filterFromDate, setFilterFromDate] = useState(null);


  const GetFlashData = (data) => {
    const filterFromDate = Moment(data.Date[0]).format("YYYY-MM-DD");
    setFilterFromDate(filterFromDate);
    data.Date = (Moment(String(new Date(data.Date[0]))).format('YYYY-MM-DD'))
    setData(data)
    fetchx(DASHBOARD_URL + '/getPMSFlashReport', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
        date: data.Date
      })
    }).then(result => result.json())
      .then(resp => {
        if (resp.statusCode == 200) {
          setFlashData(resp['data'])
          let array = []
          let array2 = []
          let array3 = []


          for (let i = 0; i < resp['data']['subGrpData'].length; i++) {


            let tempJSON = {
              Description: resp['data']['subGrpData'][i]['subGroupName'],
              DayDiscount: null,
              DaySubTotal: null,
              DayTotal: null,
              MonthDiscount: null,
              MonthSubTotal: null,
              MonthTotal: null,
              YearDiscount: null,
              YearSubTotal: null,
              YearTotal: null,
              IsBold: 1,
              Underline: 1
            }

            array.push(tempJSON)

            Object.entries(resp['data']['subGrpData'][i]['TrxnCodes']).forEach(([key, value], index) => {
              let tempJSON = {
                Description: resp['data']['subGrpData'][i]['TrxnCodes'][index]['Description'],
                DayDiscount: resp['data']['subGrpData'][i]['TrxnCodes'][index]['DayDiscount'],
                DaySubTotal: resp['data']['subGrpData'][i]['TrxnCodes'][index]['DaySubTotal'],
                DayTotal: resp['data']['subGrpData'][i]['TrxnCodes'][index]['DayTotal'],
                MonthDiscount: resp['data']['subGrpData'][i]['TrxnCodes'][index]['MonthDiscount'],
                MonthSubTotal: resp['data']['subGrpData'][i]['TrxnCodes'][index]['MonthSubTotal'],
                MonthTotal: resp['data']['subGrpData'][i]['TrxnCodes'][index]['MonthTotal'],
                YearDiscount: resp['data']['subGrpData'][i]['TrxnCodes'][index]['YearDiscount'],
                YearSubTotal: resp['data']['subGrpData'][i]['TrxnCodes'][index]['YearSubTotal'],
                YearTotal: resp['data']['subGrpData'][i]['TrxnCodes'][index]['YearTotal'],
                IsBold: resp['data']['subGrpData'][i]['TrxnCodes'][index]['date'] == null ? 1 : 0,
                Underline: resp['data']['subGrpData'][i]['TrxnCodes'][index]['date'] == null ? 1 : 0
              }
              array.push(tempJSON)
            })
          }

          let FnBJSON = {
            Description: "F&B Total",
            DayDiscount: resp['data']['FnBTotal']['FnBTotalDayDiscount'],
            DaySubTotal: resp['data']['FnBTotal']['FnBTotalDaySubTotal'],
            DayTotal: resp['data']['FnBTotal']['FnBTotalDayTotal'],
            MonthDiscount: resp['data']['FnBTotal']['FnBTotalMonthDiscount'],
            MonthSubTotal: resp['data']['FnBTotal']['FnBTotalMonthSubTotal'],
            MonthTotal: resp['data']['FnBTotal']['FnBTotalMonthTotal'],
            YearDiscount: resp['data']['FnBTotal']['FnBTotalYearDiscount'],
            YearSubTotal: resp['data']['FnBTotal']['FnBTotalYearSubTotal'],
            YearTotal: resp['data']['FnBTotal']['FnBTotalYearTotal'],
            IsBold: 1,
            Underline: 1
          }

          array.push(FnBJSON)

          let grandTotalJSON = {
            Description: "Grand Total",
            DayDiscount: resp['data']['grandTotal']['GrandDayDiscount'],
            DaySubTotal: resp['data']['grandTotal']['GrandDaySubTotal'],
            DayTotal: resp['data']['grandTotal']['GrandDayTotal'],
            MonthDiscount: resp['data']['grandTotal']['GrandMonthDiscount'],
            MonthSubTotal: resp['data']['grandTotal']['GrandMonthSubTotal'],
            MonthTotal: resp['data']['grandTotal']['GrandMonthTotal'],
            YearDiscount: resp['data']['grandTotal']['GrandYearDiscount'],
            YearSubTotal: resp['data']['grandTotal']['GrandYearSubTotal'],
            YearTotal: resp['data']['grandTotal']['GrandYearTotal'],
            IsBold: 1,
            Underline: 1
          }
          array.push(grandTotalJSON)

          // For the day
          Object.entries(resp['data']['roomOccupancy']['day']).forEach(([key, value], index) => {
            let tempJSON = {
              RoomType: resp['data']['roomOccupancy']['day'][index]['roomType'],
              ROM: resp['data']['roomOccupancy']['day'][index]['ROM'],
              TOCC: resp['data']['roomOccupancy']['day'][index]['OCC'],
              HUCOMP:resp['data']['roomOccupancy']['day'][index]['UnpaidRooms'],
              POCC:resp['data']['roomOccupancy']['day'][index]['PaidRooms'],
              SGL: resp['data']['roomOccupancy']['day'][index]['SGL'],
              DBL: resp['data']['roomOccupancy']['day'][index]['DBL'],
              TPL: resp['data']['roomOccupancy']['day'][index]['TPL'],
              PAX: resp['data']['roomOccupancy']['day'][index]['PAX'],
              Revenue: resp['data']['roomOccupancy']['day'][index]['roomRevenue'],
              ARR: resp['data']['roomOccupancy']['day'][index]['ARR'],
              OCCPer: resp['data']['roomOccupancy']['day'][index]['OCCPer'],
              RevPAR: resp['data']['roomOccupancy']['day'][index]['RevPAR'],
              RevPAX: resp['data']['roomOccupancy']['day'][index]['RevPAX'],
              IsBold: resp['data']['roomOccupancy']['day'][index]['date'] == null ? 1 : 0,
              Underline: resp['data']['roomOccupancy']['day'][index]['date'] == null ? 1 : 0
            }
            array2.push(tempJSON)
          })

          // For the month
          Object.entries(resp['data']['roomOccupancy']['month']).forEach(([key, value], index) => {
            let tempJSON = {
              RoomType: resp['data']['roomOccupancy']['month'][index]['roomType'],
              ROM: resp['data']['roomOccupancy']['month'][index]['ROM'],
              TOCC:resp['data']['roomOccupancy']['month'][index]['OCC'],
              HUCOMP:resp['data']['roomOccupancy']['month'][index]['UnpaidRooms'],
              POCC:resp['data']['roomOccupancy']['month'][index]['PaidRooms'],
             // OCC: resp['data']['roomOccupancy']['month'][index]['OCC'],
              SGL: resp['data']['roomOccupancy']['month'][index]['SGL'],
              DBL: resp['data']['roomOccupancy']['month'][index]['DBL'],
              TPL: resp['data']['roomOccupancy']['month'][index]['TPL'],
              PAX: resp['data']['roomOccupancy']['month'][index]['PAX'],
              Revenue: resp['data']['roomOccupancy']['month'][index]['roomRevenue'],
              ARR: resp['data']['roomOccupancy']['month'][index]['ARR'],
              OCCPer: resp['data']['roomOccupancy']['month'][index]['OCCPer'],
              RevPAR: resp['data']['roomOccupancy']['month'][index]['RevPAR'],
              RevPAX: resp['data']['roomOccupancy']['month'][index]['RevPAX'],
              IsBold: resp['data']['roomOccupancy']['month'][index]['date'] == null ? 1 : 0,
              Underline: resp['data']['roomOccupancy']['month'][index]['date'] == null ? 1 : 0
            }
            array3.push(tempJSON)
          })

          setReqFormatedData(array)
          setRoomData(array2)
          setRoomDataForMonth(array3)

        }

      }).catch((error) => {
        console.log(error)
      })

  }

  useEffect(() => {
    fetchx(DASHBOARD_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 10,
      })
    }).then(result => result.json())
      .then(resp => {
        setHotelDetails(resp['data'])
        setHotelAddress(resp['data'][0]['address'])
        setHotelName(resp['data'][0]['name'])
        setToday(resp['data'][0]['businessDate'])
      }).catch((error) => {
        console.log(error)
      })


  }, []);


  const getFactorial = (num) => {
    let factorial = 1;
    for (let i = 1; i <= num; i++) {
      factorial *= i;
    }
    return factorial;
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


  const formatIndianComma = (value) => {
    // Check if value is numeric
    if (!isNaN(value)) {
      const formattedValue = Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
      return formattedValue;
    }
    return value;
  };


  const generatePDF = () => {

    let columns1 = [
      'Description',
      'DaySubTotal',
      'DayDiscount',
      'DayTotal',
      'MonthSubTotal',
      'MonthDiscount',
      'MonthTotal',
      'YearSubTotal',
      'YearDiscount',
      'YearTotal'
    ]

    let columns2 = [
      'Description',
      'DaySubTotal',
      'DayDiscount',
      'DayTotal',
      'MonthSubTotal',
      'MonthDiscount',
      'MonthTotal',
      'YearSubTotal',
      'YearDiscount',
      'YearTotal',
      'IsBold',
      'Underline'
    ]

    let columns3 = [
      'RoomType',
      'ROM',
      'TOCC',
      'HUCOMP',
      'POCC',
      'SGL',
      'DBL',
      'TPL',
      'PAX',
      'Revenue',
      'ARR',
      'OCCPer',
      'RevPAR',
      'RevPAX',
    ]

    const rows = (ReqFormatedData).map((row) => columns2.map((column) => row[column]));
    const rows2 = (roomData).map((row) => columns3.map((column) => row[column]));
    const rows3 = (roomDataForMonth).map((row) => columns3.map((column) => row[column]));

    const doc = new jsPDF({ orientation: 'landscape' })

    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 20;
    const xLogo = 10; // X-coordinate for the logo
    const yLogo = 10; // Y-coordinate for the logo
    const logoHeight = 20;
    let startY = 20;
    
    doc.addImage(logo, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);
    
    const margin = { left: 10, right: 10 };
    const currentDate = new Date();
    const formattedDate = formatDateTimeWithAMPM(currentDate);
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
    
    const textToCenter = "Flash Report";
    
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

    let boldRowEncountered = false; // Flag to track bold rows
    let remainingSpace = doc.internal.pageSize.height - doc.autoTable.previous.finalY;

    // Calculate the estimated height of the row based on font size and padding
    const estimatedRowHeight = 15; // Adjust as needed
    let lineHeight = 10; // Adjust as needed

    doc.autoTable({
      head: [columns1],
      body: rows,
      startY,
      margin,
      didParseCell: (data) => {
        const rowIdx = data.row.index;
    
        const containsTotal = rows[rowIdx].some(cell => {
          if (cell && typeof cell === 'string') {
            return cell.toLowerCase().includes('total');
          }
          return false;
        });
    
        if (containsTotal) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [220, 220, 220];
        }
    
        if (rows[rowIdx][rows[rowIdx].length - 2] === 1) {
          data.cell.styles.fontStyle = 'bold';
          doc.setFontSize(data.cell.styles.fontSize - 2);
          boldRowEncountered = true;
        }
    
        const columns1ToFormatIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        if (columns1ToFormatIndices.includes(data.column.index) && !isNaN(data.cell.raw) && typeof data.cell.raw === 'number') {
          data.cell.text = formatIndianComma(data.cell.raw);
        }
    
        // Right-align all cells except the first column
        if (data.column.index !== 0) {
          data.cell.styles.halign = 'right';
        }
      }
    });
    
    
    let tableHeight = doc.previousAutoTable.finalY;
    doc.text('', 30, 30); // Adjust the space as needed
    doc.setFont('helvetica', 'bold'); // Set the font to Times-Roman and normal weight
    doc.setFontSize(12); // Set the font size
    doc.text('For The Day', 10, tableHeight + 15); //   
    doc.autoTable({
      head: [columns3],
      body: rows2,
      startY: doc.previousAutoTable.finalY + 20,
      margin,
      didParseCell: (data) => {
        if (data.row.raw[0] === 'Grand Total') { // Assuming 'Grand Total' is in the first column
          data.cell.styles.fillColor = [220, 220, 220]; // Highlighting with a yellow background color
          data.cell.styles.fontStyle = 'bold';
        }

        // Format numeric cells in specific columns by their indices using Indian comma system to have exactly two decimal places
        const specificColumnIndices = [7, 8, 10, 11]; // Indices of 'Revenue', 'ARR', 'RevPAR', 'RevPAX' columns
        if (specificColumnIndices.includes(data.column.index) && !isNaN(data.cell.raw) && typeof data.cell.raw === 'number') {
          data.cell.text = formatIndianComma(data.cell.raw);
        }

        // Right-align all cells except the first column
        if (data.column.index !== 0) {
          data.cell.styles.halign = 'right';
        }
      },
    });
    tableHeight = doc.previousAutoTable.finalY;
    doc.text('', 19, tableHeight + 20); // Adjust the space as needed
    doc.setFont('helvetica', 'bold'); // Set the font to Times-Roman and normal weight
    doc.setFontSize(12); // Set the font size
    doc.text('For The Month', 10, tableHeight + 15); // 

    doc.autoTable({
      head: [columns3],
      body: rows3,
      startY: doc.previousAutoTable.finalY + 20,
      margin,
      didParseCell: (data) => {
        if (data.row.raw[0] === 'Grand Total') { // Assuming 'Grand Total' is in the first column
          data.cell.styles.fillColor = [220, 220, 220]; // Highlighting with a yellow background color
          data.cell.styles.fontStyle = 'bold'; // Making the text bold
        }

        // Format numeric cells in specific columns by their indices using Indian comma system to have exactly two decimal places
        const specificColumnIndices = [7, 8, 10, 11]; // Indices of 'Revenue', 'ARR', 'RevPAR', 'RevPAX' columns
        if (specificColumnIndices.includes(data.column.index) && !isNaN(data.cell.raw) && typeof data.cell.raw === 'number') {
          data.cell.text = formatIndianComma(data.cell.raw);
        }

        // Right-align all cells except the first column
        if (data.column.index !== 0) {
          data.cell.styles.halign = 'right';
        }
      },
    });

    startY = doc.autoTable.previous.finalY + 5;


    const contentHeight = 30; // Total height of the content being added
      const availableSpace = doc.internal.pageSize.height - (startY + contentHeight);

      // Check if the available space is enough for the content
      if (availableSpace < contentHeight) {
        doc.addPage(); // Move to the next page
        startY = 10; // Set Y position for the new page
      }

    let fromDate = formatDate(new Date(filterFromDate))
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Filter Date: ${fromDate}`, 10, startY + 10, { width: 500, align: 'left' });

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

    doc.save('FlashReport.pdf');
  };


  function formatDateString(dateString) {

    if (!dateString) {
      return dateString; // Return empty string if dateString is null or empty
    }

    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0], 10);
    const day = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10);

    const formattedDate = new Date(year, month - 1, day);

    function getOrdinalSuffix(day) {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];

    const formattedDay = `${day}${getOrdinalSuffix(day)}`;
    const formattedMonth = monthNames[month - 1];
    const formattedYear = year;
    const formattedDayOfWeek = dayNames[formattedDate.getDay()];

    const finalFormattedDate = `${formattedDay} ${formattedMonth} ${formattedYear}, ${formattedDayOfWeek}`;

    return finalFormattedDate;
  }

  // Function to format the date as "MM/DD/YYYY"
  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  // Function to format numbers with Indian system commas
  const formatNumber = (number) => {
    return parseFloat(number).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  

  const generateExcel = () => {
    if (filterFromDate) {
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Flash Report');
  
    const columns = [
        { header: 'Description', key: 'subGroupName', width: 20 },
        { header: 'Day SubTotal', key: 'DaySubTotal', width: 15 },
        { header: 'Day Discount', key: 'DayDiscount', width: 15 },
        { header: 'Day Total', key: 'DayTotal', width: 15 },
        { header: 'Month subtotal', key: 'MonthSubTotal', width: 15 },
        { header: 'Month Discount', key: 'MonthDiscount', width: 15 },
        { header: 'Month Total ', key: 'MonthTotal', width: 15 },
        { header: 'Year Subtotal', key: 'YearSubTotal', width: 15 },
        { header: 'Year Discount', key: 'YearDiscount', width: 15 },
        { header: 'Year Total', key: 'YearTotal', width: 15 },
        { header: '', key: 'RevPAR', width: 15 },
        { header: '', key: 'RevPAX', width: 15 },
  
    ];
  
    worksheet.columns = columns;
  
    worksheet.addRow(['Report Name:', 'Flash Report']);
    worksheet.addRow(['Filter From Date:', filterFromDate]);
    worksheet.addRow([]);
    worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(2).font = { bold: true };
    worksheet.getRow(3).font = { bold: true };
    worksheet.getRow(4).font = { bold: true };
    worksheet.getRow(5).font = { bold: true };
  
    if (FlashData && Array.isArray(FlashData['subGrpData'])) {
        FlashData['subGrpData'].forEach((subGroupData) => {
            worksheet.addRow([subGroupData.subGroupName]).font = { bold: true };
  
            if (subGroupData['TrxnCodes'] && Array.isArray(subGroupData['TrxnCodes'])) {
                subGroupData['TrxnCodes'].forEach((row) => {
                    let formattedRow = {
                        subGroupName: row.Description,
                        DaySubTotal: row.DaySubTotal,
                        DayDiscount: row.DayDiscount,
                        DayTotal: row.DayTotal,
                        MonthSubTotal: row.MonthSubTotal,
                        MonthDiscount: row.MonthDiscount,
                        MonthTotal: row.MonthTotal,
                        YearSubTotal: row.YearSubTotal,
                        YearDiscount: row.YearDiscount,
                        YearTotal: row.YearTotal
                    };
  
                    // if (row.Description && row.Description.toLowerCase().includes('total')) {
                    //     formattedRow = { ...formattedRow, font: { bold: true } };
                    // }
                    // worksheet.addRow(formattedRow);  
                    if (row.Description && row.Description.toLowerCase().includes('total')) {
                      worksheet.addRow(formattedRow).font = { bold: true };
                      } else {
                          worksheet.addRow(formattedRow);
                    }
                });
            } else {
                console.warn(`No transactions found for subGroup: ${subGroupData.subGroupName}`);
            }
  
        });
   
        // Adding FnBTotal
        if (FlashData.FnBTotal) {
            const FnBTotalRow = {
                subGroupName: 'FnB Total',
                DaySubTotal: FlashData.FnBTotal.FnBTotalDaySubTotal,
                DayDiscount: FlashData.FnBTotal.FnBTotalDayDiscount,
                DayTotal: FlashData.FnBTotal.FnBTotalDayTotal,
                MonthSubTotal: FlashData.FnBTotal.FnBTotalMonthSubTotal,
                MonthDiscount: FlashData.FnBTotal.FnBTotalMonthDiscount,
                MonthTotal: FlashData.FnBTotal.FnBTotalMonthTotal,
                YearSubTotal: FlashData.FnBTotal.FnBTotalYearSubTotal,
                YearDiscount: FlashData.FnBTotal.FnBTotalYearDiscount,
                YearTotal: FlashData.FnBTotal.FnBTotalYearTotal
            };
  
            worksheet.addRow(FnBTotalRow).font = { bold: true };
        }
        if (FlashData.grandTotal) {
          const grandTotalRow = {
              subGroupName: 'Grand Total',
              DaySubTotal: FlashData.grandTotal.GrandDaySubTotal,
              DayDiscount: FlashData.grandTotal.GrandDayDiscount,
              DayTotal: FlashData.grandTotal.GrandDayTotal,
              MonthSubTotal: FlashData.grandTotal.GrandMonthSubTotal,
              MonthDiscount: FlashData.grandTotal.GrandMonthDiscount,
              MonthTotal: FlashData.grandTotal.GrandMonthTotal,
              YearSubTotal: FlashData.grandTotal.GrandYearSubTotal,
              YearDiscount: FlashData.grandTotal.GrandYearDiscount,
              YearTotal: FlashData.grandTotal.GrandYearTotal
          };
  
          worksheet.addRow(grandTotalRow).font = { bold: true };
      }
      worksheet.addRow([]);
  
      // Adding Room Occupancy section for 'day'
  if (FlashData.roomOccupancy['day'] && Array.isArray(FlashData.roomOccupancy['day'])) {
    const roomOccupancyHeaderDay = ['Room Type', 'ROM', 'OCC', 'SGL', 'DBL', 'TPL', 'PAX', 'Revenue', 'ARR', '%', 'RevPAR', 'RevPAX'];
    worksheet.addRow(['For the Day']).font = { bold: true,fontSize:16 };
    worksheet.addRow(roomOccupancyHeaderDay).font = { bold: true };
  
    FlashData.roomOccupancy.day.forEach((occupancy) => {
        const roomOccupancyRow = {
            subGroupName: occupancy.roomType,
            DaySubTotal: occupancy.ROM,
            DayDiscount: occupancy.OCC,
            DayTotal: occupancy.SGL,
            MonthSubTotal: occupancy.DBL,
            MonthDiscount: occupancy.TPL,
            MonthTotal: occupancy.PAX,
            YearSubTotal: occupancy.roomRevenue,
            YearDiscount: occupancy.ARR,
            YearTotal: occupancy.OCCPer,
            RevPAR:occupancy.RevPAR,
            RevPAX:occupancy.RevPAX
        };
        // worksheet.addRow(roomOccupancyRow);
        if (occupancy.roomType && occupancy.roomType.toLowerCase().includes('total')) {
          worksheet.addRow(roomOccupancyRow).font = { bold: true };
          } else {
              worksheet.addRow(roomOccupancyRow);
        }
    });
  }
  worksheet.addRow([]);
  
  // Adding Room Occupancy section for 'month'
  if (FlashData.roomOccupancy['month'] && Array.isArray(FlashData.roomOccupancy['month'])) {
    const roomOccupancyHeaderMonth = ['Room Type', 'ROM', 'OCC', 'SGL', 'DBL', 'TPL', 'PAX', 'Revenue', 'ARR', '%', 'RevPAR', 'RevPAX'];
    worksheet.addRow(['For the Month']).font = { bold: true };
    worksheet.addRow(roomOccupancyHeaderMonth).font = { bold: true };
  
    FlashData.roomOccupancy.month.forEach((occupancy) => {
        const roomOccupancyRow = {
            subGroupName: occupancy.roomType,
            DaySubTotal: occupancy.ROM,
            DayDiscount: occupancy.OCC,
            DayTotal: occupancy.SGL,
            MonthSubTotal: occupancy.DBL,
            MonthDiscount: occupancy.TPL,
            MonthTotal: occupancy.PAX,
            YearSubTotal: occupancy.roomRevenue,
            YearDiscount: occupancy.ARR,
            YearTotal: occupancy.OCCPer,
            RevPAR:occupancy.RevPAR,
            RevPAX:occupancy.RevPAX
        };
        // worksheet.addRow(roomOccupancyRow);
        if (occupancy.roomType && occupancy.roomType.toLowerCase().includes('total')) {
          worksheet.addRow(roomOccupancyRow).font = { bold: true };
          } else {
              worksheet.addRow(roomOccupancyRow);
        }
    });
  }
  
  
    } else {
        console.error("Invalid or empty FlashData['subGrpData']");
    }
  
    worksheet.spliceRows(1, 1);
  
    worksheet.columns.forEach((column, index) => {
        if ([1, 2, 3, 4, 5, 6, 7, 8, 9,10,11].includes(index)) {
            column.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
            column.alignment = { vertical: 'middle', horizontal: 'left' };
        }
    });
  
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
  
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Flash Report_${formattedDate}.xlsx`);
    }).catch((error) => {
        console.error('Error generating Excel file:', error);
    });
  }
  };
  
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4"><b>Flash Report of {FlashData.length != 0 && formatDateString(FlashData.subGrpData[0]['TrxnCodes'][0]['date'])}  </b></CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(GetFlashData)}>
            <Row>

              <Col md='4' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='Date'>
                    Date
                  </Label>
                  <Controller
                    control={control}
                    id='Date'
                    name='Date'
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        required
                        options={optionsToDate}
                        className={classnames('form-control', {
                          'is-invalid': data !== null && (data.Date === null || data.Date === '')
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <div align="end">
                <Button style={{ marginTop: '22px' }} type='submit' color='primary' >
                  Submit
                </Button>
                <Button align="left" style={{ marginTop: '22px', marginLeft: '10px' }} onClick={generatePDF} color='primary' >
                  Print PDF
                </Button>
                <Button onClick={generateExcel} style = {{ marginTop: '22px',marginLeft: '10px'}} color='primary'>Export to Excel</Button>

              </div>
            </Row>
          </Form>
        </CardBody>
      </Card>
      <Table className="m-0" style={{ width: '100px' }} bordered responsive>


      <table style={{ width: '100%', tableLayout: 'auto', border: '1px solid #ddd' }} >
        <thead>
          <tr>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis'  , border: '1px solid #ddd'}} >Description</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', border: '1px solid #ddd' }} >Day
              SubTotal</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', border: '1px solid #ddd' }} >Day
              Discount</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', border: '1px solid #ddd' }} >Day
              Total</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', border: '1px solid #ddd' }} >Month
              SubTotal</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', border: '1px solid #ddd' }} >Month
              Discount</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', border: '1px solid #ddd' }} >Month
              Total</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', border: '1px solid #ddd' }} >Year
              SubTotal</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', border: '1px solid #ddd' }} >Year
              Discount</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', border: '1px solid #ddd' }} >Year
              Total</th>

          </tr>
        </thead>
        {FlashData.length != 0 && FlashData.subGrpData.map((row, index) => (
          <>

            <h4 className="m-0" style={{ paddingLeft: '20px', paddingTop: '5px', textDecoration: 'underline' }}>{row.subGroupName}</h4>
            <br></br>
            <tbody>
              {FlashData.length != 0 && FlashData.subGrpData[index]['TrxnCodes'].map((row, cnt) => (
                <React.Fragment key={cnt}>

                  {cnt != FlashData.subGrpData[index]['TrxnCodes'].length - 1 && <tr key={cnt}>
                    <td style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.Description}<br /></td>
                    <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.DaySubTotal)}<br /></td>
                    <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.DayDiscount)}<br /></td>
                    <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.DayTotal)}<br /></td>
                    <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.MonthSubTotal)}<br /></td>
                    <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.MonthDiscount)}<br /></td>
                    <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.MonthTotal)}<br /></td>
                    <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.YearSubTotal)}<br /></td>
                    <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.YearDiscount)}<br /></td>
                    <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.YearTotal)}<br /></td>

                  </tr>}

                  {cnt == FlashData.subGrpData[index]['TrxnCodes'].length - 1 &&
                    <><tr key={cnt}>
                      <td style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{row.Description}</b><br /></td>
                      <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{formatNumber(row.DaySubTotal)}</b><br /></td>
                      <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{formatNumber(row.DayDiscount)}</b><br /></td>
                      <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{formatNumber(row.DayTotal)}</b><br /></td>
                      <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{formatNumber(row.MonthSubTotal)}</b><br /></td>
                      <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{formatNumber(row.MonthDiscount)}</b><br /></td>
                      <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{formatNumber(row.MonthTotal)}</b><br /></td>
                      <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{formatNumber(row.YearSubTotal)}</b><br /></td>
                      <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{formatNumber(row.YearDiscount)}</b><br /></td>
                      <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{formatNumber(row.YearTotal)}</b><br /></td>

                    </tr><br></br></>}

                </React.Fragment>
              ))}
            </tbody>

          </>


        ))}
        <tbody>
          {FlashData.length != 0 && <>
            <tr>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>F&B Total</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.FnBTotal.FnBTotalDaySubTotal)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.FnBTotal.FnBTotalDayDiscount)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.FnBTotal.FnBTotalDayTotal)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.FnBTotal.FnBTotalMonthSubTotal)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.FnBTotal.FnBTotalMonthDiscount)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.FnBTotal.FnBTotalMonthTotal)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.FnBTotal.FnBTotalYearSubTotal)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.FnBTotal.FnBTotalYearDiscount)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.FnBTotal.FnBTotalYearTotal)}</b><br /></td>

            </tr>
            <tr>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>Grand Total</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.grandTotal.GrandDaySubTotal)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.grandTotal.GrandDayDiscount)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.grandTotal.GrandDayTotal)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.grandTotal.GrandMonthSubTotal)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.grandTotal.GrandMonthDiscount)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.grandTotal.GrandMonthTotal)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.grandTotal.GrandYearSubTotal)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.grandTotal.GrandYearDiscount)}</b><br /></td>
              <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }} ><b>{formatNumber(FlashData.grandTotal.GrandYearTotal)}</b><br /></td>

            </tr>

          </>
          }</tbody>
          </table>
      </Table>

      <br></br>


      <h4 style={{ textDecoration: 'underline' }}>For the Day</h4>
      <Table className="m-0" style={{ width: '100px' }} bordered responsive>


      <table style={{ width: '100%', tableLayout: 'auto', border: '1px solid #ddd' }} >

        <thead>
          <tr>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} >Room Type</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} >ROM</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} >TOCC</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} >HU/COMP</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} >POCC</th>

            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} >SGL</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} >DBL</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} >TPL</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} >PAX</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} >Revenue</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} >ARR</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} >Occ%</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} >RevPAR</th>
            <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }} >RevPAX</th>


          </tr>
        </thead>


        <tbody>
          {FlashData.length != 0 && FlashData.roomOccupancy.day.map((row, index) => (
            <React.Fragment key={index}>
              {index != FlashData.roomOccupancy.day.length - 1 && <tr key={index}>
                <td style={{ padding: '5px', fontSize: '13px', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.roomType}<br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.ROM}<br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.OCC}<br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.UnpaidRooms}<br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.PaidRooms}<br /></td>


                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.SGL}<br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.DBL}<br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.TPL}<br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.PAX}<br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.roomRevenue)}<br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.ARR)}<br /></td>

                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.OCCPer)}<br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.RevPAR)}<br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.RevPAX)}<br /></td>


              </tr>}
              {index == FlashData.roomOccupancy.day.length - 1 && <tr key={index}>
                <td style={{ padding: '5px', fontSize: '13px', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{row.roomType}</b><br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{row.ROM}</b><br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{row.OCC}</b><br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{row.UnpaidRooms}</b><br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{row.PaidRooms}</b><br /></td>


                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{row.SGL}</b><br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{row.DBL}</b><br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{row.TPL}</b><br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{row.PAX}</b><br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{formatNumber(row.roomRevenue)}</b><br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{formatNumber(row.ARR)}</b><br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{formatNumber(row.OCCPer)}</b><br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{formatNumber(row.RevPAR)}</b><br /></td>
                <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}><b>{formatNumber(row.RevPAX)}</b><br /></td>


              </tr>}

            </React.Fragment>
          ))}
        </tbody>

</table>
      </Table>
      <br></br>
      <h4 style={{ textDecoration: 'underline' }}>For the Month</h4>
      <Table className="m-0" style={{ width: '100px' }} bordered responsive>




        
        <table style={{ width: '100%', tableLayout: 'auto', border: '1px solid #ddd' }} >
  <thead>
    <tr>
      <th style={{ padding: '5px', fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>Room Type</th>
      <th style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>ROM</th>
      <th style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>TOCC</th>
      <th style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>HU/COMP</th>
      <th style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>POCC</th>
      <th style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>SGL</th>
      <th style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>DBL</th>
      <th style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>TPL</th>
      <th style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>PAX</th>
      <th style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>Revenue</th>
      <th style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>ARR</th>
      <th style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>Occ%</th>
      <th style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>RevPAR</th>
      <th style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>RevPAX</th>
    </tr>
  </thead>

  <tbody>
    {FlashData.length !== 0 && FlashData.roomOccupancy.month.map((row, index) => (
      <React.Fragment key={index}>
        {index !== FlashData.roomOccupancy.month.length - 1 && 
          <tr>
            <td style={{ margin: '2px 0', paddingLeft: '5px', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: '1px solid #ddd' }}>{row.roomType}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.ROM}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.OCC}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.UnpaidRooms}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.PaidRooms}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.SGL}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.DBL}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.TPL}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{row.PAX}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.roomRevenue)}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.ARR)}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.OCCPer)}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.RevPAR)}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', border: '1px solid #ddd' }}>{formatNumber(row.RevPAX)}</td>
          </tr>
        }

        {index === FlashData.roomOccupancy.month.length - 1 && 
          <tr>
            <td style={{ padding: '5px', fontSize: '13px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>{row.roomType}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', border: '1px solid #ddd' }}>{row.ROM}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', border: '1px solid #ddd' }}>{row.OCC}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', border: '1px solid #ddd' }}>{row.UnpaidRooms}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', border: '1px solid #ddd' }}>{row.PaidRooms}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', border: '1px solid #ddd' }}>{row.SGL}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', border: '1px solid #ddd' }}>{row.DBL}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', border: '1px solid #ddd' }}>{row.TPL}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', border: '1px solid #ddd' }}>{row.PAX}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', fontWeight: 'bold', border: '1px solid #ddd' }}>{formatNumber(row.roomRevenue)}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', fontWeight: 'bold', border: '1px solid #ddd' }}>{formatNumber(row.ARR)}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', fontWeight: 'bold', border: '1px solid #ddd' }}>{formatNumber(row.OCCPer)}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', fontWeight: 'bold', border: '1px solid #ddd' }}>{formatNumber(row.RevPAR)}</td>
            <td style={{ padding: '5px', fontSize: '13px', textAlign: 'right', whiteSpace: 'nowrap', fontWeight: 'bold', border: '1px solid #ddd' }}>{formatNumber(row.RevPAX)}</td>
          </tr>
        }
      </React.Fragment>
    ))}
  </tbody>
</table>



      </Table>



    </div>
  );
};

export default FlashReport;
