// ** React Imports
import { useState } from "react";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Moment from "moment";
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, } from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { AgGridReact } from "ag-grid-react";
import "/node_modules/ag-grid-community/styles/ag-grid.css";
import "/node_modules/ag-grid-community/styles/ag-theme-alpine.css";
import { useRef, useEffect, useMemo } from "react";
import DASHBOARD_URL from "../../../../dashboard";
import Logo from "../../Reports/oterra.jpg";
import jsPDF from "jspdf";
import "jspdf-autotable";
// import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import 'ag-grid-enterprise'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'

const defaultValues = {
  frmdate: "",
  todate: "",
};

const StewardSaleReport = () => {
  const [rowData1, setRowData1] = useState();
  const [companyID, setCompanyID] = useState([]);
  const [stores, setStoreList] = useState([]);
  const [StewardOptions, setStewardOptions] = useState([]);
  const [flag, setFlag] = useState(false);
  const [flag1, setflag1] = useState(false);
  const [data, setData] = useState(null);
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues });
  const gridRef = useRef();
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [filterRestaurant,setfilterRestaurant] = useState(null)
  const [filterSteward,setfilterSteward] = useState(null)

  const [filterFloor, setFilterFloor] = useState(null);
  const [filterCompany, setFilterCompany] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [hotelAddress, sethotelAddress] = useState(null);
  const [hotelName, sethotelName] = useState(null);

  const [hotelNo, setHotelNo] = useState(null);
  const [hotelFax, sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
   const [loading, setLoading] = useState(false); 
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  function formatNumber(params) {
    var number = params.value;

    // Check if the number is undefined or not a numbers
    if (typeof number !== 'number' || isNaN(number)) {
      return ''; // Return empty string for undefined or non-numeric values
    }

    // If the number is valid, proceed with formatting
    var formattedNumber = Math.floor(number).toFixed(2); // Limit to 2 decimal places
    return formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  const CustomHeaderComponentBillAmount = () => {
    return (
      <div>
        BillAmount
      </div>
    );
  };
  const CustomHeaderComponentTotalTaxAmt = () => {
    return (
      <div>
        TaxAmt
      </div>
    );
  };
  const CustomHeaderComponentTotalDiscount = () => {
    return (
      <div>
        Discount
      </div>
    );
  };

  const CustomHeaderComponentTotalGrossAmount = () => {
    return (
      <div>
        GrossAmount
      </div>
    );
  };
  const CustomHeaderComponentTotalNetAmount = () => {
    return (
      <div>
        NetAmount
      </div>
    );
  };
  const CustomHeaderComponentTotalAPC = () => {
    return (
      <div>
        APC
      </div>
    );
  };
  const CustomHeaderComponentTotalCreditCard = () => {
    return (
      <div>
        CreditCard
      </div>
    );
  };
  const CustomHeaderComponentTotalCash = () => {
    return (
      <div>
        Cash
      </div>
    );
  };

  const CustomHeaderComponentTotalAMEX = () => {
    return (
      <div>
        AMEX
      </div>
    );
  };
  const CustomHeaderComponentTotalBTC = () => {
    return (
      <div>
        BTC
      </div>
    );
  };
  const CustomHeaderComponentTotalPostToRoom = () => {
    return (
      <div>
        Post To Room
      </div>
    );
  };

  const CustomHeaderComponentTotalGuest = () => {
    return (
      <div>
        Guest
      </div>
    );
  };
  const CustomHeaderComponentTotalONLINE = () => {
    return (
      <div>
        ONLINE
      </div>
    );
  };
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Bill Date", field: "BillDate", suppressSizeToFit: true, maxWidth: 180,
      cellRenderer: (params) => {
        if (params.data && params.data.BillDate) {
          const formattedDate = Moment(params.data.BillDate).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      },
    },
    { headerName: "StewardName", field: "stewardName", suppressSizeToFit: true, maxWidth: 160, wrapText: true, autoHeight: true, rowGroup: true, hide: true },
    { headerName: "Restaurant", field: "restaurantName", suppressSizeToFit: true, maxWidth: 160, wrapText: true, autoHeight: true, rowGroup: true },
    { headerName: "tableNo", field: "tableNo", suppressSizeToFit: true, maxWidth: 120, wrapText: true, autoHeight: true, },
    { headerName: "Covers", field: "Covers", suppressSizeToFit: true, maxWidth: 120, wrapText: true, autoHeight: true, },
    { headerName: "BillAmount", field: "BillAmount", suppressSizeToFit: true, maxWidth: 140, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentBillAmount },
    { headerName: "Tax Amout", field: "TaxAmt", suppressSizeToFit: true, maxWidth: 130, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTotalTaxAmt },
    { headerName: "Discount ", field: "Discount", suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTotalDiscount },
    { headerName: "Gross Amount", field: "GrossAmount", suppressSizeToFit: true, maxWidth: 140, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTotalGrossAmount },
    { headerName: "Net Amount ", field: "NetAmount", suppressSizeToFit: true, maxWidth: 140, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTotalNetAmount },
    { headerName: "APC", field: "APC", suppressSizeToFit: true, maxWidth: 110, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTotalAPC },
    { headerName: "Credit Card", field: "Credit Card", suppressSizeToFit: true, maxWidth: 140, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTotalCreditCard, wrapText: true, autoHeight: true, },
    { headerName: "Cash", field: "Cash", suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTotalCash, wrapText: true, autoHeight: true, },
    { headerName: "AMEX", field: "AMEX", suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTotalAMEX, wrapText: true, autoHeight: true, },
    { headerName: "ONLINE", field: "ONLINE", suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTotalONLINE, wrapText: true, autoHeight: true, },
    { headerName: "BTC", field: "BTC", suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTotalBTC, wrapText: true, autoHeight: true, },
    { headerName: "Post To Room", field: "Post To Room", suppressSizeToFit: true, maxWidth: 140, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTotalPostToRoom, wrapText: true, autoHeight: true, },
    { headerName: 'Guest', field: 'Guest', suppressSizeToFit: true, maxWidth: 140, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTotalGuest },
  ]);
  const groupDisplayType = 'singleColumn';

  const defaultColDef = useMemo(() => ({
    sortable: true,
  }));

  useEffect(() => {
    const hotelID = JSON.stringify({
      hotelID: 1
    })
    fetchx(DASHBOARD_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelID
    }).then((res) => res.json())
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

   fetchx(DASHBOARD_URL + "/getallstewardlist?hotelID=10")
      .then((result) => result.json())
      .then((resp) => {
        const responseData = resp["data"];
        const steward = responseData.map((item) => ({
          label: item.stewardName,
          value: item.user_id,
        }));
        setStewardOptions(steward);
      });


    fetchx(DASHBOARD_URL + "/getStoreList?hotelID=10")
      .then((result) => result.json())
      .then((resp) => {
        const responseData = resp["data"];
        const stores = responseData.map((item) => ({
          label: item.label,
          value: item.value,
        }));
        setStoreList(stores);
      });

    fetchx(DASHBOARD_URL + "/getGuestProfileCompanyID?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        setCompanyID(resp["data"]);
      });

    fetchx(DASHBOARD_URL + "/getGuestProfileCompanyID?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        setCompanyID(resp["data"]);
      });
  }, []);

  const frmdate = watch("frmdate");
  const optionsToDate = {
    minDate: Moment(String(new Date(frmdate))).format("YYYY-MM-DD"), // Set the minimum date as fromDate or today if fromDate is not selected
  };


  const onSubmit = (data) => {
      setIsButtonClicked(true)
      setLoading(true);

      const filterFromDate = Moment(data.frmdate[0]).format("DD.MM.YYYY");
      const filterToDate = Moment(data.todate[0]).format("DD.MM.YYYY");

    console.log(filterCompany);

    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    // console.log(data)
    setData(data);
    const StewardID = Array.isArray(data.stewardID)
      ? data.stewardID.map((item) => item.label)
      : [];
    const StoreListID = Array.isArray(data.storeLists)
      ? data.storeLists.map((item) => item.value)
      : [];
      const selectedResturants = data.storeLists && data.storeLists.map(item => item.label);
      console.log(selectedResturants)
      setfilterRestaurant(selectedResturants)
      const selectedSteward = data.stewardID && data.stewardID.map(item => item.label);
        setfilterSteward(selectedSteward)
       setFlag(true);
      console.log("",StewardID,StoreListID)
    let createmarketGroup = JSON.stringify({
      hotelID: 10,
      FromDate: Moment(data.frmdate[0]).format("YYYY-MM-DD"),
      ToDate: Moment(data.todate[0]).format("YYYY-MM-DD"),
      storeID: StoreListID != null || StoreListID.length == 0 ? StoreListID : [],
      stewardName: StewardID != null || StewardID.length == 0 ? StewardID : [],
    });

    if (flag1 == true) {
      let res = fetchx(DASHBOARD_URL + "/getStewardSalesReport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: createmarketGroup,
      })
        .then((data) => data.json())
        .then((res) => {
          setIsButtonClicked(false)
          if (res['statuscode'] == 200) {
            setLoading(false);

      console.log(createmarketGroup);
          console.log(res["data"]);
          setRowData1(res["data"]);
          }
        });
    }
  };

  const onBtnExport = () => {
    const params = {
      fileName: "Steward Sales.xlsx",
      sheetName: "Sheet1",
    };
    gridRef.current.api.exportDataAsExcel(params);
  };


  const printGrid = () => {
    if (filterFromDate && filterToDate) {

      const gridApi = gridRef.current && gridRef.current.api;
      const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.stewardName)));
      if (gridApi) {
        const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
        const headerRow = rowData.substring(0, rowData.indexOf('\n'));
        const cleanHeaderRow = headerRow.replace(/"/g, '');
        const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
        const cleanData = dataRows.replace(/"/g, '');
        const rows = cleanData.split('\n').map(row => row.split(','));
        const pdf = new jsPDF({ orientation: 'landscape' });
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
        const formattedDate = formatDates(currentDate);
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




        const textToCenter = "Steward Sales Report";

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
          .forEach((stewardName, index) => {
            const rowsForDate = rowData1
              .filter((row) => row.stewardName === stewardName)
              .map((row) => {
                // const formattedArrival = formatDate(new Date(row.arrivalDate));
                const formattedBillDate = formatDate(new Date(row.BillDate));
                const formattedDob = formatDate(new Date(row.dob));

                return {
                  ...row,
                  // arrivalDate: formattedArrival,
                  BillDate: formattedBillDate,
                  dob: formattedDob,
                };
              })
              .map((row) => columnDefs.map((column) => row[column.field]));

            // const columns = columnDefs.map((column) => column.headerName);

            // Calculate the height of the table content
            const tableHeight = 8;

            // Check if the content fits on the current page
            if (dateY + tableHeight > pdf.internal.pageSize.height - 20) {
              // Move to the next page if the content exceeds the page height
              pdf.addPage();
              dateY = 20; // Reset the Y position for the new page
              currentPage++; // Increment the current page number
            }

            const totalCount = rowsForDate.length;
            pdf.setFont('times', 'bold');
            // const formattedArrivalDate = formatDate(new Date(arrivalDate));

            const cleanHeaderRow = headerRow.replace(/"/g, '').replace(/sum\(([^)]+)\)/g, '$1');
            const columnsToFormat = [5, 6, 7, 8, 9, 10, 11, 12, 13];


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

            pdf.text(`Steward: ${(stewardName)}`, 10, dateY + 37, { width: 500, align: 'left' });

            const columnStyles = {
              0: { columnWidth: 12 }, // Adjust the width as needed for each column
              1: { columnWidth: 14 },
              2: { columnWidth: 18 },
              3: { columnWidth: 16 },
              4: { columnWidth: 18 },
              5: { columnWidth: 18 },
              6: { columnWidth: 13 },
              7: { columnWidth: 12 },
              8: { columnWidth: 18 },
              9: { columnWidth: 15 },
              10: { columnWidth: 18 },
              11: { columnWidth: 12 },
              12: { columnWidth: 16 },
              13: { columnWidth: 14 },
              14: { columnWidth: 18 },
              15: { columnWidth: 12 },
              16: { columnWidth: 18 },
              17: { columnWidth: 18 },
            };

            const columns = cleanHeaderRow.split(',').map(value => value.trim());
            // const modifiedColumns = columns.map(column => column.replace(/\bGroup\b/g, ''));

            // Find the index of "Bill Date" in the columns array
            const billDateIndex = columns.findIndex(column => column.includes('Bill Date'));

            // Move "Bill Date" to the beginning of the modifiedColumns array
            const modifiedColumns = [
              columns[billDateIndex],
              ...columns.slice(0, billDateIndex),
              ...columns.slice(billDateIndex + 1),
            ];
            const replacedColumns = modifiedColumns.map(column => column.replace(/\bGroup\b/g, 'Steward'));

            // pdf.text(`Date: ${formattedArrivalDate}`, 10, dateY + 37, { width: 500, align: 'left' });
            pdf.autoTable({
              // head: [columns],
              // head: [cleanHeaderRow.split(',').map(value => value.trim())], 
              head: [replacedColumns],
              body: rowsForDate,
              startY: dateY + 40,
              columnStyles,
              didParseCell: (data) => {
                if (data.column.index == 5 || data.column.index == 6 || data.column.index == 7 || data.column.index == 8) {
                  data.cell.styles.halign = 'right';
                }
              }
            });

            pdf.setFont('times', 'normal');
            dateY = pdf.autoTable.previous.finalY - 10;
          });

        dateY = pdf.autoTable.previous.finalY + 15;
        if (filterFromDate) {

          const availableSpace = pdf.internal.pageSize.height - dateY;

          // Check if the available space is enough for the content
          if (availableSpace < 30) { // Adjust '30' based on your content height
            pdf.addPage(); // Move to the next page
            dateY = 10; // Set Y position for the new page
          }

          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Filter From  Date: ${filterFromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
          pdf.text(`To  Date:  ${filterToDate}  `, 10, dateY + 20, { width: 500, align: 'left' });
          // pdf.text(`Filter From Date: ${filterFromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
          // pdf.text(`Store:    `, 10, dateY + 30, {  width: 500,align: "left", });
        }
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
        pdf.save('Steward Sales Report.pdf');
      } else {
      }
    }
  };

  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Steward Sale Report'); // Updated report name
    
        const columns = [
            { header: 'Steward Name', key: 'stewardName', width: 20 },
            { header: 'Restaurant', key: 'restaurantName', width: 20 },
            { header: 'Table No', key: 'tableNo', width: 15 },
            { header: 'Covers', key: 'Covers', width: 15 },
            { header: 'Bill Amount', key: 'BillAmount', width: 15 },
            { header: 'Tax Amount', key: 'TaxAmt', width: 15 },
            { header: 'Discount', key: 'Discount', width: 15 },
            { header: 'Gross Amount', key: 'GrossAmount', width: 15 },
            { header: 'Net Amount', key: 'NetAmount', width: 15 },
            { header: 'APC', key: 'APC', width: 15 },
            { header: 'Credit Card', key: 'CreditCard', width: 15 },
            { header: 'Cash', key: 'Cash', width: 15 },
            { header: 'AMEX', key: 'AMEX', width: 15 },
            { header: 'ONLINE', key: 'ONLINE', width: 15 },
            { header: 'BTC', key: 'BTC', width: 15 },
            { header: 'Post To Room', key: 'PostToRoom', width: 15 },
            { header: 'Guest', key: 'Guest', width: 20 }
        ];
    
        worksheet.columns = columns;
    
        worksheet.addRow(['Report Name:', 'Steward Sale REPORT']);
        worksheet.addRow(['Filter From Bill Date:', filterFromDate]);
        worksheet.addRow(['To Date:', filterToDate]);
    
        let selectedFilterRestaurant = filterRestaurant && filterRestaurant.length !== 0 ? filterRestaurant.toString() : 'All';
        worksheet.addRow(['Filter Restaurants:', selectedFilterRestaurant]);
        let selectedFilterSteward = filterSteward && filterSteward.length !== 0 ? filterSteward.toString() : 'All';
        worksheet.addRow(['Filter Stewards:', selectedFilterSteward]);

        worksheet.addRow([]);
        worksheet.addRow(columns.map(column => column.header)).font = { bold: true };

        for (let i = 1; i <= 6; i++) {
            worksheet.getRow(i).font = { bold: true };
        }
    
        rowData1.sort((a, b) => a.StoreID - b.StoreID);
        let formattedRows = [];
        let totals = {
            BillAmount: 0,
            TaxAmt: 0,
            Discount: 0,
            GrossAmount: 0,
            NetAmount: 0,
            APC: 0,
            CreditCard: 0,
            Cash: 0,
            AMEX: 0,
            ONLINE: 0,
            BTC: 0,
            PostToRoom: 0,
            Guest:0
        };

        rowData1.forEach((row) => {
            let formattedRow = {
                stewardName: row.stewardName,
                restaurantName: row.restaurantName,
                tableNo: row.tableNo,
                Covers: row.Covers,
                BillAmount: parseFloat(row.BillAmount),
                TaxAmt: parseFloat(row.TaxAmt),
                Discount: parseFloat(row.Discount),
                GrossAmount: parseFloat(row.GrossAmount),
                NetAmount: parseFloat(row.NetAmount),
                APC: parseFloat(row.APC).toFixed(2),
                CreditCard: parseFloat(row['Credit Card']),
                Cash: parseFloat(row.Cash),
                AMEX: parseFloat(row.AMEX),
                ONLINE: parseFloat(row.ONLINE),
                BTC: parseFloat(row.BTC),
                PostToRoom: parseFloat(row['Post To Room']),
                Guest:parseFloat(row['Guest']),
            };

            totals.BillAmount += formattedRow.BillAmount;
            totals.TaxAmt += formattedRow.TaxAmt;
            totals.Discount += formattedRow.Discount;
            totals.GrossAmount += formattedRow.GrossAmount;
            totals.NetAmount += formattedRow.NetAmount;
            totals.APC += parseFloat(formattedRow.APC);
            totals.CreditCard += formattedRow.CreditCard;
            totals.Cash += formattedRow.Cash;
            totals.AMEX += formattedRow.AMEX;
            totals.ONLINE += formattedRow.ONLINE;
            totals.BTC += formattedRow.BTC;
            totals.PostToRoom += formattedRow.PostToRoom;
            totals.Guest += formattedRow.Guest;


            formattedRows.push(formattedRow);
        });

        formattedRows.forEach((row) => {
            worksheet.addRow(row);
        });

        worksheet.spliceRows(1, 1);
    
        worksheet.columns.forEach((column, index) => {
            if (index >= 3 && index <= 16) {
                column.alignment = { vertical: 'middle', horizontal: 'right' };
            } else {
                column.alignment = { vertical: 'middle', horizontal: 'left' };
            }
        });

        worksheet.addRow([]); // Empty row before totals

        // Add totals row
        worksheet.addRow([
            'Totals',
            '',
            '',
            '',
            totals.BillAmount.toFixed(2),
            totals.TaxAmt.toFixed(2),
            totals.Discount.toFixed(2),
            totals.GrossAmount.toFixed(2),
            totals.NetAmount.toFixed(2),
            totals.APC.toFixed(2),
            totals.CreditCard.toFixed(2),
            totals.Cash.toFixed(2),
            totals.AMEX.toFixed(2),
            totals.ONLINE.toFixed(2),
            totals.BTC.toFixed(2),
            totals.PostToRoom.toFixed(2),
            totals.Guest.toFixed(2),
            ''
        ]).font = { bold: true }; // Make totals row bold

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
    
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            saveAs(blob, `Steward Sale Report_${formattedDate}.xlsx`);
        }).catch((error) => {
            console.error('Error generating Excel file:', error);
        });
    }
};

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Steward Sales Report</CardTitle>
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
                        className={classnames("form-control", {})}
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
                        // options={optionsToDate}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {})}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="stewardID">
                    Steward
                  </Label>
                  <Controller
                    id="stewardID"
                    control={control}
                    name="stewardID"
                    render={({ field }) => (
                      <Select
                        isMulti
                        isClearable
                        options={StewardOptions}
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
                  <Label className="form-label" for="storeLists">
                    Store List
                  </Label>
                  <Controller
                    id="storeLists"
                    control={control}
                    name="storeLists"
                    render={({ field }) => (
                      <Select
                        isMulti
                        isClearable
                        options={stores}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

              <div align="end" className="buttons">
                {/* <Button
                  className="me-1"
                  color="primary"
                  type="submit"
                  onClick={() => setflag1(true)}
                >
                  Submit
                </Button> */}
                <Button className='me-1' color='primary' type='submit' disabled={isButtonClicked} onClick={()=>setflag1(true)}>
                            {isButtonClicked ? 'Processing...' : 'Submit'}
                            </Button>
              
                {flag == true && (
                  // <Button
                  //   className="me-1"
                  //   color="primary"
                  //   type="submit"
                  //   onClick={onBtnExport}
                  // >
                  //   {" "}
                  //   Download Excel{" "}
                  // </Button>
                  <Button className='me-1' color='primary' onClick={generateExcel}>
                                    Download Excel
                                </Button>
                )}
                {flag == true && (
                  <Button
                    className="me-1"
                    color="primary"
                    onClick={printGrid}
                  >
                    Print to PDF
                  </Button>
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
      flag == true && (
        <div className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={rowData1}
            columnDefs={columnDefs}
            animateRows={true}
            rowSelection="multiple"
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            domLayout="autoHeight"
            groupIncludeFooter={true}
            groupIncludeTotalFooter={true}
          />
        </div>
      )
      )}
    </div>
  );
};
export default StewardSaleReport;