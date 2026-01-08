// ** React Imports
import { useState } from 'react'
import { StrictMode } from 'react'

import Select from "react-select";
import 'ag-grid-enterprise';
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input, InputGroup, InputGroupText, Table } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { AgGridReact } from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import { useNavigate } from 'react-router-dom';
import { selectThemeColors } from "@utils";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Logo from '@src/assets/images/logo/oterra.jpg'
import { createRoot } from 'react-dom/client';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'


const defaultValues = {
  frmdate: ''
}



const SalesReport = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [flag, setFlag] = useState(false)
  const gridRef = useRef();
  const [data, setData] = useState(null)
  const [isButtonClicked, setIsButtonClicked] = useState(false);


  // function formatNumber(params) {
  //   var number = params.value;
  //   return Math.floor(number)
  //     .toString()
  //     .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  // }
  function formatNumber(params) {
    var number = params.value;

    if (typeof number !== 'number' || isNaN(number)) {
      return '';
    }

    var formattedNumber = Math.floor(number).toFixed(2);
    return formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  const [storeOptions, setStoreOptions] = useState([]);
  const [colSummaryData, setColSummaryData] = useState([])
  const [salesData, setSalesData] = useState([])

  const [filterFromDate, setFilterFromDate] = useState(null);
  const [hotelName, sethotelName] = useState('');
  const [hotelAddress, sethotelAddress] = useState('');
  const [hotelNo, setHotelNo] = useState(null);
  const [hotelFax, sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [filterResturant, setfilterResturant] = useState(null);
  const [loading, setLoading] = useState(false); 
  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      wrapText: true,
      autoHeight: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 300,
      cellRendererParams: {
        footerValueGetter: (params) => {
          const isRootLevel = params.node.level === -1;
          if (isRootLevel) {
            return 'Grand Total';
          }
          return `${params.value} Total`;
        },
      },
    };
  }, []);

  const cellClickedListener = useCallback(event => {
    console.log('cellClicked', event);
  }, []);

  const { reset, handleSubmit, control } = useForm({ defaultValues })

  const headerFoodAmt = () => {
    return (
      <div>
        Food Base Amount
      </div>
    );
  };
  const headerLiquorBaseAmt = () => {
    return (
      <div>
        Liquor Base Amt
      </div>
    );
  };
  const headerSoftdrinkBaseAmt = () => {
    return (
      <div>
        Softdrinks Base Amt
      </div>
    );
  };
  const headerSmokesBaseAmt = () => {
    return (
      <div>
        Smokes Base Amt
      </div>
    );
  };
  const headerOthersBaseAmount = () => {
    return (
      <div>
        Others Base Amount
      </div>
    );
  };
  const headersubTotal = () => {
    return (
      <div>
        Sub Total
      </div>
    );
  };
  const headerdiscount = () => {
    return (
      <div>
        Discount
      </div>
    );
  };
  const headerFinalAmt = () => {
    return (
      <div>
        Final Amount
      </div>
    );
  };
  const headerGst18Amt = () => {
    return (
      <div>
        GST 18%
      </div>
    );
  };
  const headerGst22Amt = () => {
    return (
      <div>
        GST 22%
      </div>
    );
  };
  const headerGst5Amt = () => {
    return (
      <div>
        GST 5%
      </div>
    );
  };
  const headerGst0Amt = () => {
    return (
      <div>
        GST 0%
      </div>
    );
  };
  const headerTips = () => {
    return (
      <div>
        Tips
      </div>
    );
  };

  const columnDefs = [
    { headerName: 'Bill Number', field: 'billNoDisplay', suppressSizeToFit: true, maxWidth: 130 },
    { headerName: 'StoreName', field: 'restaurantName', suppressSizeToFit: true, maxWidth: 130, rowGroup: true },
    { headerName: 'Food Base Amt', field: 'FoodBaseAmount', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', headerComponentFramework: headerFoodAmt, valueFormatter: formatNumber },
    { headerName: 'Liquor Base Amt', field: 'LiquorBaseAmount', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', headerComponentFramework: headerLiquorBaseAmt, valueFormatter: formatNumber },
    { headerName: 'Softdrink Base Amt', field: 'SoftDrinksBaseAmount', suppressSizeToFit: true, maxWidth: 120, wrapText: true, autoHeight: true, aggFunc: 'sum', headerComponentFramework: headerSoftdrinkBaseAmt, valueFormatter: formatNumber },
    {
      headerName: 'Smokes Base Amt',
      field: 'SmokesBaseAmount',
      suppressSizeToFit: true,
      maxWidth: 120,
      aggFunc: 'sum', headerComponentFramework: headerSmokesBaseAmt, valueFormatter: formatNumber
    },
    {
      headerName: 'Others Base Amt', field: 'OthersBaseAmount', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', headerComponentFramework: headerOthersBaseAmount, valueFormatter: formatNumber
    },
    { headerName: 'Sub Total', field: 'subTotal', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', headerComponentFramework: headersubTotal, valueFormatter: formatNumber },
    { headerName: 'Discount Amt', field: 'DiscountAmount', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', headerComponentFramework: headerdiscount, valueFormatter: formatNumber },
    { headerName: 'GST 18%', field: 'GST 18', suppressSizeToFit: true, maxWidth: 100, aggFunc: 'sum', headerComponentFramework: headerGst18Amt, valueFormatter: formatNumber },
    { headerName: 'GST 22%', field: 'GST 22', suppressSizeToFit: true, maxWidth: 100, aggFunc: 'sum', headerComponentFramework: headerGst22Amt, valueFormatter: formatNumber },
    { headerName: 'GST 5%', field: 'GST 5', suppressSizeToFit: true, maxWidth: 100, aggFunc: 'sum', headerComponentFramework: headerGst5Amt, valueFormatter: formatNumber },
    { headerName: 'GST 0%', field: 'GST 0', suppressSizeToFit: true, maxWidth: 100, aggFunc: 'sum', headerComponentFramework: headerGst0Amt, valueFormatter: formatNumber },
    { headerName: 'Tips', field: 'Tips', suppressSizeToFit: true, maxWidth: 100, aggFunc: 'sum', headerComponentFramework: headerTips, valueFormatter: formatNumber },
    { headerName: 'Final Amt', field: 'FinalAmount', suppressSizeToFit: true, maxWidth: 100, aggFunc: 'sum', headerComponentFramework: headerFinalAmt, valueFormatter: formatNumber },
    { headerName: 'Bill Status', field: 'billStatus', suppressSizeToFit: true, maxWidth: 100 },
    { headerName: 'PayMode', field: 'PaymentMode', suppressSizeToFit: true, maxWidth: 200 },
 ];

  useEffect(() => {
    fetchx(DASHBOARD_URL + '/getStoreList?hotelID=10')
      .then(result => result.json())
      .then(resp => {
        const responseData = resp['data'];
        setStoreOptions(responseData);
      })
      .catch(error => {
        console.error("Error fetchxing data:", error);
      });
  }, [])
  useEffect(() => {
    // fetchx today's date from your API
    fetchx(DASHBOARD_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hotelID: 1 })
    })
      .then((res) => res.json())
      .then(postres => {
        const hotelName1 = postres.data[0].name;
        const hotelAddress1 = postres.data[0].address;
        const logo = postres.data[0].logo
        const number = postres.data[0].phoneNumber
        const fax = postres.data[0].fax
        console.log(hotelName)
        console.log(postres)
        sethotelName(hotelName1);
        sethotelAddress(hotelAddress1);
        setHotelNo(number)
        sethotelFax(fax)
        setLogo(logo)

      })
      .catch(error => {
        console.error("Error fetchxing business date:", error);
      });
  }, []);
  const getKotData = data => {
    setIsButtonClicked(true)
    setLoading(true);
    console.log(data)
    const filterFromDate = Moment(data.frmdate[0]).format("DD-MM-YYYY");
    // const filterToDate = Moment(data.todate[0]).format("DD-MM-YYYY");


    setFilterFromDate(filterFromDate);
    // setFilterToDate(filterToDate);
    const storeIDs = data.storeID && data.storeID.map(item => item.value);
    const selectedResturants = data.storeID && data.storeID.map(item => item.label);
    setfilterResturant(selectedResturants)
    let createmarketGroup;
    if (storeIDs && storeIDs.length === 0) {
      createmarketGroup = JSON.stringify({
        "hotelID": 10,
        "date": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
      })
    }
    else {
      console.log("In Else")
      createmarketGroup = JSON.stringify({
        "hotelID": 10,
        "storeID": storeIDs,
        "date": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
      })
    }
    console.log(storeIDs)

    setData(data)
    setFlag(true)

    console.log(createmarketGroup)

    let res = fetchx(DASHBOARD_URL + "/getSalesReportForDay", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then(data => data.json())
      .then((res) => {
        setIsButtonClicked(false)
        if (res['statusCode'] == 200) {
          setLoading(false)
        console.log(res);
        setRowData(res.data);
        // setColSummaryData(res["data"])
        setSalesData(res["data"])
        }

      });
}

  const handleReset = () => {
    reset({

      block: ''
    })
  }

  const onBtnExport = () => {
    const params = {
      fileName: "Sale Report of the Day Report.xlsx",
      sheetName: "Sheet1",
      processHeaderCallback: (params) => {
        return params.column.getColDef().headerName;
      },
      processCellCallback: (params) => {
        if (params.column && params.column.getColDef().aggFunc === 'sum') {
          if (!isNaN(params.value)) {
            return Number(params.value).toFixed(2);
          }
        }
        return params.value;
      },
    };

    gridRef.current.api.exportDataAsExcel(params);
  };
  const printGrid = () => {
    if (filterFromDate) {


      const gridApi = gridRef.current && gridRef.current.api;

      if (gridApi) {

        const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
        const headerRow = rowData.substring(0, rowData.indexOf('\n'));
        const cleanHeaderRow = headerRow.replace(/"/g, '');
        const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
        const cleanData = dataRows.replace(/"/g, '');
        const rows = cleanData.split('\n').map(row => row.split(','));
        const pdf = new jsPDF({ orientation: 'landscape' });

        // Calculate center for the logo
        // Add logo
        const xLogo = 10; // X-coordinate for the logo
        const yLogo = 10;
        // Calculate center for the logo
        const pageWidth = pdf.internal.pageSize.getWidth();
        const logoWidth = 15;
        const xCenter = (pageWidth - logoWidth) / 2;
        // Add logo
        const logoHeight = 15;
        let dateY = 20;

        pdf.addImage(DASHBOARD_URL+`/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

        // pdf.addImage(Logo, "JPEG", xCenter, 10, logoWidth, logoHeight);
        const currentDate = new Date();
        const formattedDate = formatDateTimeWithAMPM(currentDate);
        const paddingFromRight = 85;
        const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);


        //   // Handle other hotelIds if needed
        const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo, fontsize) => {
          // Set font size and style
          pdf.setFontSize(fontsize);
          pdf.setFont('helvetica', 'normal');

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

          // Draw the text on the PDF
          pdf.text(`${textToCenter}`, textStartX, yLogo); // Adjust the y position as needed
        };

        // Determine the width of the hotel name and address
        const hotelNameWidth = pdf.getStringUnitWidth(hotelName) * 14;
        const hotelAddressWidth = pdf.getStringUnitWidth(hotelAddress) * 12;

        // Set hotel name
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo, 14);

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8, 12); // Adjust the y position as needed




        const textToCenter = "Sale Report of the Day Report";

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
        pdf.setFont('helvetica', 'bold')


        function formatDate(date) {
          if (!(date instanceof Date) || isNaN(date.getTime())) {
            return ''; // Return empty string if date is not a valid Date object
          }

          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          return `${day}.${month}.${year}`;
        }


        const headers = cleanHeaderRow.split(',').map(value => value.trim());
        const modifiedHeaders = headers.map(header => {
          const matches = header.match(/sum\((.*)\)/i);
          return matches ? matches[1] : header;
        });
        // const columnStyles = {
        //     0: { cellWidth: 21 }, 
        //     1: { cellWidth: 18 },
        //     2: { cellWidth: 18 },
        //     3: { cellWidth: 22 },
        //     4: { cellWidth: 18 },
        //     5: { cellWidth: 30 },
        //     6: { cellWidth: 15 },
        //     7: { cellWidth: 10 },
        //     8: { cellWidth: 21 },
        //     9: { cellWidth: 10 },
        //     10: { cellWidth: 21 },
        //     11: { cellWidth: 21 },
        //     12: { cellWidth: 21 },
        //     13: { cellWidth: 21 },
        //     14: { cellWidth: 21 },
        //   };        


        // const columnsToFormat = [4,5,6,7,8];

        // rows.forEach(row => {
        //     columnsToFormat.forEach(columnIndex => {
        //         const value = row[columnIndex];
        //         if (value !== undefined) {
        //             row[columnIndex] = Number(value).toFixed(2);
        //         }
        //         if (!isNaN(Number(value))) {
        //             // Format the number with maximumFractionDigits: 2
        //             row[columnIndex] = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(Number(value));
        //         }
        //     });
        // });
        const columnsToFormat = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

        rows.forEach(row => {
          columnsToFormat.forEach(columnIndex => {
            const value = row[columnIndex];
            if (value !== undefined) {
              row[columnIndex] = Number(value).toFixed(2);
            }
            if (!isNaN(Number(value))) {
              // Format the number with maximumFractionDigits: 2
              row[columnIndex] = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(Number(value));
            }
          });
        });
        pdf.autoTable({
          head: [modifiedHeaders],
          body: rows.map(row => row.map(value => value.trim())),
          startY: dateY + 20,
          // columnStyles
          didParseCell: (data) => {
            if (data.column.index == 3 || data.column.index == 4 || data.column.index == 5 || data.column.index == 6 || data.column.index == 7 || data.column.index == 8 || data.column.index == 9 || data.column.index == 10 || data.column.index == 11 || data.column.index == 12 || data.column.index == 13 || data.column.index == 14 || data.column.index == 15) {
              data.cell.styles.halign = 'right';
            }
          }

        });
        dateY = pdf.autoTable.previous.finalY + 20;

        pdf.text(`Filter From Bill Date: ${filterFromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
        pdf.save('Sale Report of the Day Report.pdf');
      } else {
      }
    }
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
  
  const generateExcel = () => {
    if (filterFromDate) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales for the day'); 

        const columns = [
            { header: 'Bill Number', key: 'billNoDisplay', width: 15 },
            { header: 'StoreName', key: 'restaurantName', width: 20 },
            { header: 'Food Base Amt', key: 'FoodBaseAmount', width: 15 },
            { header: 'Liquor Base Amt', key: 'LiquorBaseAmount', width: 15 },
            { header: 'Softdrink Base Amt', key: 'SoftDrinksBaseAmount', width: 20 },
            { header: 'Smokes Base Amt', key: 'SmokesBaseAmount', width: 15 },
            { header: 'Others Base Amt', key: 'OthersBaseAmount', width: 15 },
            { header: 'Sub Total', key: 'subTotal', width: 15 },
            { header: 'Discount Amt', key: 'DiscountAmount', width: 15 },
            { header: 'GST 18%', key: 'GST18', width: 10 },
            { header: 'GST 22%', key: 'GST22', width: 10 },
            { header: 'GST 5%', key: 'GST5', width: 10 },
            { header: 'GST 0%', key: 'GST0', width: 10 },
            { header: 'Tips', key: 'Tips', width: 10 },
            { header: 'Final Amt', key: 'FinalAmount', width: 15 },
            { header: 'Bill Status', key: 'billStatus', width: 15 },
            { header: 'PayMode', key: 'PaymentMode', width: 15 }
        ];

        worksheet.columns = columns;

        worksheet.addRow(['Report Name:', 'Sales for the day']);
        worksheet.addRow(['Filter From Bill Date:', filterFromDate]);

        let selectedFilterRestaurant = filterResturant && filterResturant.length !== 0
            ? filterResturant.toString()
            : 'All';

        worksheet.addRow(['Filter Restaurants:', selectedFilterRestaurant]);

        worksheet.addRow([]);
        worksheet.addRow(columns.map(column => column.header)).font = { bold: true };

        for (let i = 1; i <= 5; i++) {
            worksheet.getRow(i).font = { bold: true };
        }

        rowData.sort((a, b) => a.storeID - b.storeID);
        let formattedRows = [];
        let totals = {
            FoodBaseAmount: 0,
            LiquorBaseAmount: 0,
            SoftDrinksBaseAmount: 0,
            SmokesBaseAmount: 0,
            OthersBaseAmount: 0,
            subTotal: 0,
            DiscountAmount: 0,
            GST18: 0,
            GST22: 0,
            GST5: 0,
            GST0: 0,
            Tips: 0,
            FinalAmount: 0
        };

        rowData.forEach((row) => {
            let formattedRow = {
                billNoDisplay: row.billNoDisplay,
                restaurantName: row.restaurantName,
                FoodBaseAmount: parseFloat(row.FoodBaseAmount) || 0,
                LiquorBaseAmount: parseFloat(row.LiquorBaseAmount) || 0,
                SoftDrinksBaseAmount: parseFloat(row.SoftDrinksBaseAmount) || 0,
                SmokesBaseAmount: parseFloat(row.SmokesBaseAmount) || 0,
                OthersBaseAmount: parseFloat(row.OthersBaseAmount) || 0,
                subTotal: parseFloat(row.subTotal) || 0,
                DiscountAmount: parseFloat(row.DiscountAmount) || 0,
                GST18: parseFloat(row['GST 18']) || 0,
                GST22: parseFloat(row['GST 22']) || 0,
                GST5: parseFloat(row['GST 5']) || 0,
                GST0: parseFloat(row['GST 0']) || 0,
                Tips: parseFloat(row.Tips) || 0,
                FinalAmount: parseFloat(row.FinalAmount) || 0,
                billStatus: row.billStatus,
                PaymentMode: row.PaymentMode
            };

            totals.FoodBaseAmount += formattedRow.FoodBaseAmount;
            totals.LiquorBaseAmount += formattedRow.LiquorBaseAmount;
            totals.SoftDrinksBaseAmount += formattedRow.SoftDrinksBaseAmount;
            totals.SmokesBaseAmount += formattedRow.SmokesBaseAmount;
            totals.OthersBaseAmount += formattedRow.OthersBaseAmount;
            totals.subTotal += formattedRow.subTotal;
            totals.DiscountAmount += formattedRow.DiscountAmount;
            totals.GST18 += formattedRow.GST18;
            totals.GST22 += formattedRow.GST22;
            totals.GST5 += formattedRow.GST5;
            totals.GST0 += formattedRow.GST0;
            totals.Tips += formattedRow.Tips;
            totals.FinalAmount += formattedRow.FinalAmount;

            formattedRows.push(formattedRow);
        });

        formattedRows.forEach((row) => {
            worksheet.addRow(row);
        });
        worksheet.addRow([]); 

        // Add total row
        worksheet.addRow([
            'Total',
            '',
            totals.FoodBaseAmount,
            totals.LiquorBaseAmount,
            totals.SoftDrinksBaseAmount,
            totals.SmokesBaseAmount,
            totals.OthersBaseAmount,
            totals.subTotal,
            totals.DiscountAmount,
            totals.GST18,
            totals.GST22,
            totals.GST5,
            totals.GST0,
            totals.Tips,
            totals.FinalAmount,
            '',
            ''
        ]).font = { bold: true };

        worksheet.spliceRows(1, 1);

        worksheet.columns.forEach((column, index) => {
            if ([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].includes(index)) {
                column.alignment = { vertical: 'middle', horizontal: 'right' }; 
            } else {
                column.alignment = { vertical: 'middle', horizontal: 'left' };
            }
        });

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            saveAs(blob, `Sales for the day_${formattedDate}.xlsx`);
        }).catch((error) => {
            console.error('Error generating Excel file:', error);
        });
    }
};




  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Sale Report of the Day Report</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(getKotData)}>
            <Row>
              <Col md='4' sm='12'>
                <div className='mb-1'>
                  <Label className='form-label' for='storeID'>
                    Store Name <spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    id="storeID"
                    control={control}
                    name="storeID"
                    render={({ field }) => (
                      <Select
                        isMulti
                        // required
                        isClearable
                        options={storeOptions}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>
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
            </Row>
            <Row>
              <div className='d-flex'>
              <Button className='me-1' color='primary' type='submit' disabled={isButtonClicked}>
                            {isButtonClicked ? 'Processing...' : 'Submit'}
                            </Button>
                {/* <Button outline color='secondary' type='reset' onClick={handleReset}>
                  Reset
                </Button> */}
                <span style={{ margin: '10px' }}></span>

                {flag && (
                  <div>
                    {/* <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}>
                      Download Excel
                    </Button> */}
                    <Button className='me-1' color='primary' onClick={generateExcel}>
                      Download Excel
                      </Button>
                    <Button className='me-1' color='primary' onClick={printGrid}>
                      Print PDF
                    </Button>
                  </div>
                )}

              </div>
            </Row>
          </Form>
        </CardBody>
      </Card>
      {loading == true ? (
          // <div style={{ textAlign: 'center', padding: '20px' }}>
          //   <h1 style={{ fontWeight: 'bold', color: 'grey' }}>Loading data, please wait...</h1>
          // </div>
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
        ):(

      flag && (
        <div className='ag-theme-alpine'>
          <AgGridReact
            ref={gridRef}

            rowData={rowData}
            columnDefs={columnDefs}
            animateRows={true}
            rowSelection='multiple'
            onCellClicked={cellClickedListener}
            defaultColDef={defaultColDef}
            domLayout='autoHeight'
            // groupIncludeTotalFooter={true}
            autoGroupColumnDef={autoGroupColumnDef}
            groupIncludeFooter={true}
            groupIncludeTotalFooter={true}

          />
        </div>
      )
      )}

    </div>
  )
}

export default SalesReport