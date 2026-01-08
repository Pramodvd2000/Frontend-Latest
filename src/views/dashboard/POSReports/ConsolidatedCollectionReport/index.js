


// ** React Imports
import { useState } from 'react'
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

// ** Utils
import { selectThemeColors } from "@utils";
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// import { DisabledByDefault } from '@mui/icons-material';
// import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Logo from '@src/assets/images/logo/oterra.jpg'
import { createRoot } from 'react-dom/client';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'

const MySwal = withReactContent(Swal)

const defaultValues = {
  frmdate: ''
}



const ConsolidatedCollectionReport = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [rowData1, setRowData1] = useState();
  const [flag, setFlag] = useState(false)

  // ** State
  const [data, setData] = useState(null)
  const [storeOptions, setStoreOptions] = useState([]);
  const [cancelBillData, setCancelBilltData] = useState([])
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [hotelName, sethotelName] = useState('');
  const [hotelAddress, sethotelAddress] = useState('');
  const [hotelNo, setHotelNo] = useState(null);
  const [hotelFax, sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [filterResturant, setfilterResturant] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [isButtonClicked, setIsButtonClicked] = useState(false);




  // ** Hooks
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  let navigate = useNavigate();

  function formatNumber(params) {
    var number = params.value;

    if (typeof number !== 'number' || isNaN(number)) {
      return '';
    }

    var formattedNumber = Math.floor(number).toFixed(2);
    return formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  const CustomHeaderComponentAmount = () => {
    return (
      <div>
        Bills Amount
      </div>
    );
  };
  const CustomHeaderComponentTax = () => {
    return (
      <div>
        Tax Amt
      </div>
    );
  };
  const CustomHeaderComponentRoundoff = () => {
    return (
      <div>
        Roundoff Amt
      </div>
    );
  };
  const CustomHeaderComponentDisc = () => {
    return (
      <div>
        Discount Amt
      </div>
    );
  };
  const CustomHeaderComponentTotalamount = () => {
    return (
      <div>
        Total Amount
      </div>
    );
  };

  const headerAMEX = () => {
    return (
      <div>
        AMEX
      </div>
    );
  };
  const headerAxisbankcard = () => {
    return (
      <div>
        AXIS BANK CARDS
      </div>
    );
  };
  const headercompany = () => {
    return (
      <div>
        Company
      </div>
    );
  };
  const headerOnline = () => {
    return (
      <div>
        Total Amount
      </div>
    );
  };
  const headerCash = () => {
    return (
      <div>
        Cash
      </div>
    );
  };
  const headerCreditcard = () => {
    return (
      <div>
        Credit Card
      </div>
    );
  };
  const headerGuest = () => {
    return (
      <div>
        Guest
      </div>
    );
  };
  const headerRazorPay = () => {
    return (
      <div>
        Razor Pay
      </div>
    );
  };
  const headerBills = () => {
    return (
      <div>
        Total Bills
      </div>
    );
  };
  const CancelledBills = () => {
    return (
      <div>
        Canc.Bills
      </div>
    );
  };


  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Resturant', field: 'restaurantName', suppressSizeToFit: true, maxWidth: 120, rowGroup: true },
    {
      headerName: 'Total Bills', field: 'TotalNoOfBills', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum',
      headerComponentFramework: headerBills
    },
    { headerName: 'Start BillNo', field: 'StartBillNo', suppressSizeToFit: true, maxWidth: 120 },
    { headerName: 'End BillNo  ', field: 'EndBillNo', suppressSizeToFit: true, maxWidth: 120 },
    {
      headerName: 'Total Amount', field: 'TotalAmount', suppressSizeToFit: true, maxWidth: 150, valueFormatter: formatNumber,
      aggFunc: 'sum', headerComponentFramework: CustomHeaderComponentTotalamount
    },
    {
      headerName: 'Bill Amount', field: 'BillAmount', suppressSizeToFit: true, maxWidth: 150, valueFormatter: formatNumber,
      aggFunc: 'sum', headerComponentFramework: CustomHeaderComponentAmount
    },
    {
      headerName: 'Discount', field: 'DiscountAmount', suppressSizeToFit: true, maxWidth: 120, valueFormatter: formatNumber,
      aggFunc: 'sum', headerComponentFramework: CustomHeaderComponentDisc
    },
    {
      headerName: 'Round off', field: 'Roundoff', suppressSizeToFit: true, maxWidth: 120, valueFormatter: formatNumber,
      aggFunc: 'sum', headerComponentFramework: CustomHeaderComponentRoundoff
    },
    {
      headerName: 'Canc.Bills', field: 'CancelledBills', suppressSizeToFit: true, maxWidth: 180, aggFunc: 'sum',
      headerComponentFramework: CancelledBills
    },
    {
      headerName: 'Taxes&Charges', field: 'TaxnCharges', suppressSizeToFit: true, maxWidth: 120, valueFormatter: formatNumber,
      aggFunc: 'sum', headerComponentFramework: CustomHeaderComponentTax
    },
    {
      headerName: 'AMEX', field: 'AMEX', suppressSizeToFit: true, maxWidth: 120, valueFormatter: formatNumber,
      aggFunc: 'sum', headerComponentFramework: headerAMEX
    },
    {
      headerName: 'AXIS CARDS', field: 'AXIS BANK CARDS', suppressSizeToFit: true, maxWidth: 120, valueFormatter: formatNumber,
      aggFunc: 'sum', headerComponentFramework: headerAxisbankcard
    },
    {
      headerName: 'Company', field: 'BTC', suppressSizeToFit: true, maxWidth: 120, valueFormatter: formatNumber,
      aggFunc: 'sum', headerComponentFramework: headercompany
    },
    {
      headerName: 'Cash', field: 'Cash', suppressSizeToFit: true, maxWidth: 120, valueFormatter: formatNumber,
      aggFunc: 'sum', headerComponentFramework: headerCash
    },
    {
      headerName: 'Credit Card', field: 'Credit Card', suppressSizeToFit: true, maxWidth: 120, valueFormatter: formatNumber,
      aggFunc: 'sum', headerComponentFramework: headerCreditcard
    },
    {
      headerName: 'Guest', field: 'Post To Room', suppressSizeToFit: true, maxWidth: 120, valueFormatter: formatNumber,
      aggFunc: 'sum', headerComponentFramework: headerGuest
    },
    {
      headerName: 'Razor Pay', field: 'Razor Pay', suppressSizeToFit: true, maxWidth: 120, valueFormatter: formatNumber,
      aggFunc: 'sum', headerComponentFramework: headerRazorPay
    },


  ]);
  const groupDisplayType = 'singleColumn';


  const gridRef = useRef();
  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));


  useEffect(() => {
    fetchx(DASHBOARD_URL + '/getStoreList?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        const responseData = resp['data'];

        // setStoreOptions(options);
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

  const getCancelBillData = data => {
    setIsButtonClicked(true)
    setLoading(true);

    const filterFromDate = Moment(data.frmdate[0]).format("DD-MM-YYYY");
    const filterToDate = Moment(data.todate[0]).format("DD-MM-YYYY");
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    const storeIDs = Array.isArray(data.storeID) ? data.storeID.map(item => item.value) : [];
    const selectedResturants = data.storeID && data.storeID.map(item => item.label);
    setfilterResturant(selectedResturants)
    let createmarketGroup;
    if (storeIDs.length === 0 || storeIDs === undefined) {
      createmarketGroup = JSON.stringify({
        "hotelID": 1,
        "fromDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
        "toDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
      })
    }
    else {
      createmarketGroup = JSON.stringify({
        "hotelID": 1,
        "storeID": storeIDs,
        "fromDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
        "toDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
      })
    }

    setData(data)
    setFlag(true)


    let res = fetchx(DASHBOARD_URL + "/getConsolidatedCollectionReport", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then(data => data.json())
      .then((res) => {
        setIsButtonClicked(false)
        if (res['statusCode'] === 200) {
          setLoading(false)
          setRowData(res["data"]);
          setCancelBilltData(res["data"])
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
      fileName: "Consolidated Collection Report.xlsx",
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

  const printGrid = async () => {
    if (filterFromDate && filterToDate) {
      const columns = columnDefs.map((column) => column.headerName);
      const doc = new jsPDF({ orientation: 'landscape' });
      try {
        const pageWidth = doc.internal.pageSize.getWidth();
        const logoWidth = 20;
        const xLogo = 10; // X-coordinate for the logo
        const yLogo = 10; // Y-coordinate for the logo
        const logoHeight = 20;
        let dateY = 20
        let startY = 20;
        const margin = { left: 10, right: 10 };

        doc.addImage(DASHBOARD_URL+`/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

        // pdf.addImage(Logo, "JPEG", xCenter, 10, logoWidth, logoHeight);
        const currentDate = new Date();
        const formattedDate = formatDateTimeWithAMPM(currentDate);
        const paddingFromRight = 85;
        const dateX = pageWidth - doc.getStringUnitWidth(formattedDate) - paddingFromRight;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);


        //   // Handle other hotelIds if needed
        const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo, fontsize) => {
          // Set font size and style
          doc.setFontSize(fontsize);
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

       const textToCenter = "Consolidated Collection Report";

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
        doc.setFont('helvetica', 'bold')
        startY = 30;


        // Group rows by 'billNoDisplay'
        let grandTotal = 0; // Add this variable to store the grand total
        let grandBillAmount = 0;
        let grandBill = 0;
        let grandDiscountAmt = 0;
        let grandRoundoff = 0;
        let grandCancelledBill = 0;
        let grandtaxCharges = 0;
        let grandAmex = 0;
        let grandAxis = 0;
        let grandCompany = 0;
        let grandCash = 0;
        let grandCreditCard = 0;
        let grandGuest = 0;
        let grandRazorPay = 0

        const groupedRows = rowData.reduce((acc, row) => {
          const key = row['restaurantName'];
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(row);
          grandTotal += parseFloat(row['TotalAmount'] || 0); // Update the grand total
          grandBillAmount += parseFloat(row['BillAmount'] || 0);
          grandBill += parseFloat(row['TotalNoOfBills'] || 0);
          grandDiscountAmt += parseFloat(row['DiscountAmount'] || 0);
          grandRoundoff += parseFloat(row['Roundoff'] || 0);
          grandCancelledBill += parseFloat(row['CancelledBills'] || 0);
          grandtaxCharges += parseFloat(row['TaxnCharges'] || 0);
          grandAmex += parseFloat(row['AMEX'] || 0);
          grandAxis += parseFloat(row['AXIS BANK CARDS'] || 0);
          grandCompany += parseFloat(row['BTC'] || 0);
          grandCash += parseFloat(row['Cash'] || 0);
          grandCreditCard += parseFloat(row['Credit Card'] || 0);
          grandGuest += parseFloat(row['Post To Room'] || 0);
          grandRazorPay += parseFloat(row['Razor Pay'] || 0);



          return acc;
        }, {});
        const formatWithCommas = (value) => value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        const formattedGrandTotal = formatWithCommas(grandTotal);
        const formattedGrandBillAmount = formatWithCommas(grandBillAmount);
        const formattedGrandBill = formatWithCommas(grandBill);
        const formattedGrandDiscountAmt = formatWithCommas(grandDiscountAmt);
        const formattedGrandRoundoff = formatWithCommas(grandRoundoff);
        const formattedGrandCancelledBill = formatWithCommas(grandCancelledBill);
        const formattedGrandTaxCharges = formatWithCommas(grandtaxCharges);
        const formattedGrandAmex = formatWithCommas(grandAmex);
        const formattedGrandAxis = formatWithCommas(grandAxis);
        const formattedGrandCompany = formatWithCommas(grandCompany);
        const formattedGrandCash = formatWithCommas(grandCash);
        const formattedGrandCreditCard = formatWithCommas(grandCreditCard);
        const formattedGrandGuest = formatWithCommas(grandGuest);
        const formattedGrandRazorPay = formatWithCommas(grandRazorPay);

        for (const restaurantName in groupedRows) {
          doc.text(`StoreName: ${restaurantName}`, 10, startY + 10, { width: 500, align: 'left' });
          const groupRows = groupedRows[restaurantName].map((row) => columnDefs.map((column) => row[column.field]));
          const totalAmount = groupedRows[restaurantName].reduce(
            (total, row) => total + parseFloat(row['TotalAmount'] || 0),
            0
          ).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          const billAmt = groupedRows[restaurantName].reduce(
            (total, row) => total + parseFloat(row['BillAmount'] || 0),
            0
          ).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          const totalBills = groupedRows[restaurantName].reduce(
            (total, row) => total + parseFloat(row['TotalNoOfBills'] || 0),
            0
          );
          const discountAmt = groupedRows[restaurantName].reduce(
            (total, row) => total + parseFloat(row['DiscountAmount'] || 0),
            0
          ).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          const roundOffAmt = groupedRows[restaurantName].reduce(
            (total, row) => total + parseFloat(row['Roundoff'] || 0),
            0
          ).toFixed(2);
          const cancelledBill = groupedRows[restaurantName].reduce(
            (total, row) => total + parseFloat(row['CancelledBills'] || 0),
            0
          );
          const taxAmt = groupedRows[restaurantName].reduce(
            (total, row) => total + parseFloat(row['TaxnCharges'] || 0),
            0
          ).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          const amexAmt = groupedRows[restaurantName].reduce(
            (total, row) => total + parseFloat(row['AMEX'] || 0),
            0
          ).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          const axixAmt = groupedRows[restaurantName].reduce(
            (total, row) => total + parseFloat(row['AXIS BANK CARDS'] || 0),
            0
          ).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          const companyAmt = groupedRows[restaurantName].reduce(
            (total, row) => total + parseFloat(row['BTC'] || 0),
            0
          ).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          const cashAmt = groupedRows[restaurantName].reduce(
            (total, row) => total + parseFloat(row['Cash'] || 0),
            0
          ).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          const credicardAmt = groupedRows[restaurantName].reduce(
            (total, row) => total + parseFloat(row['Credit Card'] || 0),
            0
          ).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          const guestAmt = groupedRows[restaurantName].reduce(
            (total, row) => total + parseFloat(row['Post To Room'] || 0),
            0
          ).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          const razorpayAmt = groupedRows[restaurantName].reduce(
            (total, row) => total + parseFloat(row['Razor Pay'] || 0),
            0
          ).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const columnsToFormat = [4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16];

          groupRows.forEach(row => {
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
          const columnStyles = {
            0: { cellWidth: 20 },
            1: { cellWidth: 15 },
            2: { cellWidth: 18 },
            3: { cellWidth: 18 },
            4: { cellWidth: 18 },
            5: { cellWidth: 18 },
            6: { cellWidth: 15 },
            7: { cellWidth: 15 },
            8: { cellWidth: 10 },
            9: { cellWidth: 18 },
            10: { cellWidth: 18 },
            11: { cellWidth: 18 },
            12: { cellWidth: 16 },
            13: { cellWidth: 16 },
            14: { cellWidth: 16 },
            15: { cellWidth: 16 },
            16: { cellWidth: 16 },

          };
          doc.autoTable({
            head: [columns],
            body: [...groupRows, ['Total Amount:', totalBills, '', '', totalAmount, billAmt, discountAmt, roundOffAmt, cancelledBill, taxAmt, amexAmt, axixAmt, companyAmt, cashAmt, credicardAmt, guestAmt, razorpayAmt]],
            startY: startY + 21,
            margin,
            columnStyles,
            didParseCell: (data) => {
              if (data.column.index == 4 || data.column.index == 5 || data.column.index == 6 || data.column.index == 7 || data.column.index == 8 || data.column.index == 9 || data.column.index == 10 || data.column.index == 11 || data.column.index == 12 || data.column.index == 13 || data.column.index == 14 || data.column.index == 15 || data.column.index == 16) {
                data.cell.styles.halign = 'right';
              }
            }
          });
          startY = doc.autoTable.previous.finalY + 5;
        }
        const columnStyles = {
          0: { cellWidth: 18 },
          1: { cellWidth: 15 },
          2: { cellWidth: 18 },
          3: { cellWidth: 18 },
          4: { cellWidth: 18 },
          5: { cellWidth: 18 },
          6: { cellWidth: 15 },
          7: { cellWidth: 15 },
          8: { cellWidth: 10 },
          9: { cellWidth: 18 },
          10: { cellWidth: 18 },
          11: { cellWidth: 18 },
          12: { cellWidth: 16 },
          13: { cellWidth: 16 },
          14: { cellWidth: 16 },
          15: { cellWidth: 16 },
          16: { cellWidth: 16 },

        };
        doc.autoTable({
          body: [['GrandTotal:', grandBill, '', '', formattedGrandTotal, formattedGrandBillAmount, formattedGrandDiscountAmt, formattedGrandRoundoff, grandCancelledBill, formattedGrandTaxCharges, formattedGrandAmex, formattedGrandAxis, formattedGrandCompany, formattedGrandCash, formattedGrandCreditCard, formattedGrandGuest, formattedGrandRazorPay]],
          startY: startY + 2,
          margin,
          columnStyles,
          didParseCell: (data) => {
            if (data.column.index == 4 || data.column.index == 5 || data.column.index == 6 || data.column.index == 7 || data.column.index == 8 || data.column.index == 9 || data.column.index == 10 || data.column.index == 11 || data.column.index == 12 || data.column.index == 13 || data.column.index == 14 || data.column.index == 15 || data.column.index == 16) {
              data.cell.styles.halign = 'right';
            }
          }
        });

        startY = doc.autoTable.previous.finalY + 20;

        doc.text(`Filter From Bill Date: ${filterFromDate}`, 10, startY + 10, { width: 500, align: 'left' });
        doc.text(`To Bill Date: ${filterToDate}`, 10, startY + 20, { width: 500, align: 'left' });

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

        // doc.setFont('times', 'bold');
        // doc.text(`Filter:`, 10, startY + 20, { width: 500, align: 'left' });
        // doc.text(
        //   ` Date: ${Moment(String(new Date(data.frmdate[0]))).format('DD.MM.YYYY')}`,
        //   10,
        //   startY + 30,
        //   { width: 500, align: 'left' }
        // );
        // Save the PDF
        const pdfBlob = doc.output('blob');

        saveAs(pdfBlob, 'Consolidated Collection Report.pdf');
      } catch (error) {
        console.error('Error creating PDF:', error);
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
    if (filterFromDate && filterToDate) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Consolidated Collection Report'); // Updated report name

        // Updated columns as per the new headers and keys
        const columns = [
            { header: 'Restaurant', key: 'restaurantName', width: 20 },
            { header: 'Total Bills', key: 'TotalNoOfBills', width: 15 },
            { header: 'Start BillNo', key: 'StartBillNo', width: 15 },
            { header: 'End BillNo', key: 'EndBillNo', width: 15 },
            { header: 'Total Amount', key: 'TotalAmount', width: 15 },
            { header: 'Bill Amount', key: 'BillAmount', width: 15 },
            { header: 'Discount', key: 'DiscountAmount', width: 10 },
            { header: 'Round off', key: 'Roundoff', width: 10 },
            { header: 'Canc.Bills', key: 'CancelledBills', width: 10 },
            { header: 'Taxes&Charges', key: 'TaxnCharges', width: 20 },
            { header: 'AMEX', key: 'AMEX', width: 10 },
            { header: 'AXIS CARDS', key: 'AXIS BANK CARDS', width: 15 },
            { header: 'Company', key: 'BTC', width: 10 },
            { header: 'Cash', key: 'Cash', width: 10 },
            { header: 'Credit Card', key: 'Credit Card', width: 15 },
            { header: 'Guest', key: 'Post To Room', width: 10 },
            { header: 'Razor Pay', key: 'Razor Pay', width: 15 }
        ];

        worksheet.columns = columns;

        worksheet.addRow(['Report Name:', 'Consolidated Collection Report']);
        worksheet.addRow(['Filter From Bill Date:', filterFromDate]);
        worksheet.addRow(['To Date:', filterToDate]);

        let selectedFilterRestaurant = filterResturant && filterResturant.length !== 0
            ? filterResturant.toString()
            : 'All';
    
        worksheet.addRow(['Filter Restaurants:', selectedFilterRestaurant]);

        worksheet.addRow([]);

        // Add header row
        worksheet.addRow(columns.map(column => column.header)).font = { bold: true };

        // Make specific rows bold
        for (let i = 1; i <= 5; i++) {
            worksheet.getRow(i).font = { bold: true };
        }

        // Process and format rowData
        rowData.sort((a, b) => a.storeID - b.storeID);
        let formattedRows = [];

        rowData.forEach((row) => {
            let formattedRow = {
                restaurantName: row.restaurantName,
                TotalNoOfBills: row.TotalNoOfBills,
                StartBillNo: row.StartBillNo,
                EndBillNo: row.EndBillNo,
                TotalAmount: parseFloat(row.TotalAmount),
                BillAmount: parseFloat(row.BillAmount),
                DiscountAmount: parseFloat(row.DiscountAmount),
                Roundoff: parseFloat(row.Roundoff).toFixed(2),
                CancelledBills: row.CancelledBills,
                TaxnCharges: parseFloat(row.TaxnCharges),
                AMEX: parseFloat(row.AMEX) || 0,
                'AXIS BANK CARDS': parseFloat(row['AXIS BANK CARDS']) || 0,
                BTC: parseFloat(row.BTC) || 0,
                Cash: parseFloat(row.Cash) || 0,
                'Credit Card': parseFloat(row['Credit Card']) || 0,
                'Post To Room': parseFloat(row['Post To Room']) || 0,
                'Razor Pay': parseFloat(row['Razor Pay']) || 0
            };
            formattedRows.push(formattedRow);
        });

        formattedRows.forEach((row) => {
            worksheet.addRow(row);
        });
        worksheet.spliceRows(1, 1);

        // Calculate totals for specified columns
        let totals = {
            TotalNoOfBills: 0,
            TotalAmount: 0,
            BillAmount: 0,
            DiscountAmount: 0,
            Roundoff: 0,
            CancelledBills: 0,
            TaxnCharges: 0,
            AMEX: 0,
            'AXIS BANK CARDS': 0,
            BTC: 0,
            Cash: 0,
            'Credit Card': 0,
            'Post To Room': 0,
            'Razor Pay': 0
        };

        formattedRows.forEach((row) => {
            totals.TotalNoOfBills += row.TotalNoOfBills || 0;
            totals.TotalAmount += row.TotalAmount || 0;
            totals.BillAmount += row.BillAmount || 0;
            totals.DiscountAmount += row.DiscountAmount || 0;
            totals.Roundoff += parseFloat(row.Roundoff) || 0;
            totals.CancelledBills += row.CancelledBills || 0;
            totals.TaxnCharges += row.TaxnCharges || 0;
            totals.AMEX += row.AMEX || 0;
            totals['AXIS BANK CARDS'] += row['AXIS BANK CARDS'] || 0;
            totals.BTC += row.BTC || 0;
            totals.Cash += row.Cash || 0;
            totals['Credit Card'] += row['Credit Card'] || 0;
            totals['Post To Room'] += row['Post To Room'] || 0;
            totals['Razor Pay'] += row['Razor Pay'] || 0;
        });

        worksheet.addRow([]);

        // Add totals row
        worksheet.addRow([
            'Total',
            totals.TotalNoOfBills,
            '', // Start BillNo
            '', // End BillNo
            totals.TotalAmount,
            totals.BillAmount,
            totals.DiscountAmount,
            totals.Roundoff.toFixed(2),
            totals.CancelledBills,
            totals.TaxnCharges,
            totals.AMEX,
            totals['AXIS BANK CARDS'],
            totals.BTC,
            totals.Cash,
            totals['Credit Card'],
            totals['Post To Room'],
            totals['Razor Pay']
        ]).font = { bold: true };

        // Adjust alignment for columns
        worksheet.columns.forEach((column, index) => {
            if ([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].includes(index)) { // Numeric columns
                column.alignment = { vertical: 'middle', horizontal: 'right' }; 
            } else {
                column.alignment = { vertical: 'middle', horizontal: 'left' };
            }
        });

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);

        // Generate Excel file and prompt download
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            saveAs(blob, `Consolidated Collection Report_${formattedDate}.xlsx`);

        }).catch((error) => {
            console.error('Error generating Excel file:', error);
        });
    }
};



  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Consolidated Collection Report</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(getCancelBillData)}>
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
            </Row>
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

              <div className='d-flex'>
              <Button className='me-1' color='primary' type='submit' disabled={isButtonClicked}>
                            {isButtonClicked ? 'Processing...' : 'Submit'}
                            </Button>
                <span style={{ margin: '10px' }}></span>

                {flag && (
                  <div>
                    {/* <Button
                      className='me-1'
                      color='primary'
                      onClick={onBtnExport}
                    >
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
            rowData={rowData}
            columnDefs={columnDefs}
            groupDisplayType={groupDisplayType}
            animateRows={true}
            rowSelection='multiple'
            // onCellClicked={cellClickedListener}
            defaultColDef={defaultColDef}
            domLayout='autoHeight'
            ref={gridRef}
            //autoGroupColumnDef={autoGroupColumnDef}
            groupIncludeFooter={true}
            groupIncludeTotalFooter={true}
          />
        </div>
      )
      )}
    </div>
  )
}

export default ConsolidatedCollectionReport