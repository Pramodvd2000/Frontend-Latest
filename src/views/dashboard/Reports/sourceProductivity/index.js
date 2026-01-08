import { useState } from "react";
import "cleave.js/dist/addons/cleave-phone.us";
import Flatpickr from "react-flatpickr";
import classnames from "classnames";
import Moment from "moment";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import { useForm, Controller } from "react-hook-form";
import "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import "/node_modules/ag-grid-community/styles/ag-grid.css";
import "/node_modules/ag-grid-community/styles/ag-theme-alpine.css";
import Select from "react-select";
import { selectThemeColors } from "@utils";

import { useRef, useEffect, useMemo, useCallback } from "react";
import DASHBOARD_URL from "../../../../dashboard";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Input,
  Form,
  Label,
} from "reactstrap";
import Logo from "../oterra.jpg";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

let defaultValues = {};


const SourceProductivity = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedOption, setselectedOption] = useState("0");
  const [SelectedForColumn, setSelectedForColumn] = useState();
  const gridRef = useRef();
  const { handleSubmit, control } = useForm({ defaultValues });
  const [flag, setFlag] = useState(false);
  const groupDisplayType = "singleColumn";
  const [data, setData] = useState(null);
  const [additionalColumnDef, setAdditionalColumnDef] = useState(null);

  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [hotelAddress, setHotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [marketOptions, setMarketOptions] = useState([]);
  const [sourceName, setSourceName] = useState();
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [open,setOpen] = useState(false)
  const [filterSource,setfilterSource] = useState();
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

    fetchx(DASHBOARD_URL + "/getSourceName")
      .then((result) => result.json())
      .then((resp) => {
        setMarketOptions(resp["data"]);
      });

  }, [])


  const CustomHeaderComponentTotalNights = () => {
    return <div>Nights</div>;
  };


  const CustomHeaderComponentTotalRevenue = () => {
    return <div>Total Revenue</div>;
  };


  const CustomHeaderComponentTotalFBRevenue = () => {
    return <div>F_B_Revenue</div>;
  };


  const CustomHeaderComponentTotalTax = () => {
    return <div>Tax</div>;
  };


  const CustomHeaderComponentTotalADR = () => {
    return <div>ARR</div>;
  };

  const CustomHeaderComponentTotalRoomRevenue = () => {
    return <div>Room Revenue</div>;
  };
  const CustomHeaderComponentTotalPackageRevenue = () => {
    return <div>Package Revenue</div>;
  };

  function formatNumber(params) {
    var number = params.value;

    // Check if the number is undefined or not a number
    if (typeof number !== 'number' || isNaN(number)) {
      return ''; // Return empty string for undefined or non-numeric values
    }

    // If the number is a whole number, append '.00' to show two decimal places
    if (Number.isInteger(number)) {
      return number.toFixed(2);
    }

    // If the number has decimals, display normally with comma separators
    var formattedNumber = number.toFixed(2);
    return formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }


  const columnDefs = useMemo(() => {
    return [
      {
        headerName: "SourceCode",
        field: "sourceCode",
        maxWidth: 160,
        rowGroup: true,
        hide: true,
      },
      {
        headerName: "Date",
        field: "date",
        maxWidth: 120,
        sort:'asc',
        cellRenderer: (params) => {
          if (params.data && params.data.date) {
            let formattedDate = "";
            if (SelectedForColumn === '0' && SelectedForColumn !== undefined) {
              formattedDate = Moment(params.data.date).format("DD.MM.YYYY");
            } else if (SelectedForColumn === '1' && SelectedForColumn !== undefined) {
              formattedDate = Moment(params.data.date).format("MMM YYYY");
            } else {
              formattedDate = Moment(params.data.date).format("DD.MM.YYYY");
            }
            return formattedDate;
          } else {
            return "";
          }
        },
      },
      {
        headerName: "Description",
        field: "description",
        maxWidth: 180,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Nights",
        field: "No_of_Nights",
        maxWidth: 100,
        aggFunc: "sum",
        sort:'desc',
        headerComponentFramework: CustomHeaderComponentTotalNights,
      },
      {
        headerName: "Room Revenue",
        field: "room_revenue",
        maxWidth: 180,
        aggFunc: "sum",
        valueFormatter: formatNumber,
        headerComponentFramework: CustomHeaderComponentTotalRoomRevenue,
      },
      {
        headerName: "Package Revenue",
        field: "package_revenue",
        maxWidth: 180,
        aggFunc: "sum",
        valueFormatter: formatNumber,
        headerComponentFramework: CustomHeaderComponentTotalPackageRevenue,
      },
      {
        headerName: "FNB_Revenue",
        field: "f_b_revenue",
        maxWidth: 160,
        aggFunc: "sum",
        valueFormatter: formatNumber,
        headerComponentFramework: CustomHeaderComponentTotalFBRevenue,
      },
      {
        headerName: "Tax(for future)",
        field: "tax_for_future",
        maxWidth: 140,
        aggFunc: "sum",
        valueFormatter: formatNumber,
        headerComponentFramework: CustomHeaderComponentTotalTax,
      },
      {
        headerName: "ARR",
        field: "ADR",
        maxWidth: 140,
        aggFunc: "sum",
        valueFormatter: formatNumber,
        headerComponentFramework: CustomHeaderComponentTotalADR,
      },
      {
        headerName: "Revenue",
        field: "revenue",
        maxWidth: 180,
        aggFunc: "sum",
        valueFormatter: formatNumber,
        headerComponentFramework: CustomHeaderComponentTotalRevenue,
      },
    ];
  }, [SelectedForColumn]);


  const totalRow = {
    marketCode: "Grand Total",
    No_of_Nights: "sum",
    room_revenue: "sum",
    package_revenue: "sum",

    f_b_revenue: "sum",
    tax_for_future: "sum",
    ADR: "sum",
    revenue: "sum",

  };


  const totalValues = rowData.reduce(
    (total, current) => {
      total.No_of_Nights += current.No_of_Nights;
     
      total.room_revenue += current.room_revenue;
      total.package_revenue += current.package_revenue;

      total.f_b_revenue += current.f_b_revenue;
      total.tax_for_future += current.tax_for_future;
      total.ADR += current.ADR;
      total.revenue += current.revenue;
      return total;
    },
    {
      No_of_Nights: 0,
      
      room_revenue: 0,
      package_revenue: 0,

      f_b_revenue: 0,
      tax_for_future: 0,
      ADR: 0,
      revenue: 0,
    }
  );

  totalRow.No_of_Nights = totalValues.No_of_Nights;
  totalRow.room_revenue = totalValues.room_revenue;
  totalRow.package_revenue = totalValues.package_revenue;

  totalRow.f_b_revenue = totalValues.f_b_revenue;
  totalRow.tax_for_future = totalValues.tax_for_future;
  totalRow.ADR = totalValues.ADR;
  totalRow.revenue = totalValues.revenue;

  const updatedRowData = [...rowData, totalRow];


  const createData = (count, prefix) => {
    var result = [];
    for (var i = 0; i < count; i++) {
      if (rowData.length > 0) {
        result.push(rowData[0]);
      }
    }
    return result;
  };


  const pinnedBottomRowData = useMemo(() => {
    return createData(1, "Bottom");
  }, []);


  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));


  const handleTransferTransaction = (event) => {
    setselectedOption(event.target.value);
    setSelectedForColumn(event.target.value)
    console.log(event.target.value)
  };


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

  const ConfirmSubmit = (data) => {
    if (!data.FromDate || !data.ToDate) {
      handleError("Please select both From Date and To Date.");
      return;
    } 
    
    setIsButtonClicked(true);
    setOpen(true);
    // setIsButtonClicked(true)
    // setOpen(true)
    const filterFromDate = Moment(data.FromDate[0]).format("YYYY-MM-DD");
    const filterToDate = Moment(data.ToDate[0]).format("YYYY-MM-DD");
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    setData(data);
    setFlag(true);
    data.FromDate = filterFromDate
    data.ToDate = filterToDate
    const sourceID = Array.isArray(data.sourceID)
      ? data.sourceID.map((item) => item.value)
      : null;

    const sourceName = Array.isArray(data.sourceID)
      ? data.sourceID.map((item) => item.label)
      : [];

    setSourceName(sourceName)
    setfilterSource(sourceName)
    let createmarketGroup = JSON.stringify({
      hotelID: 10,
      FromDate: data.FromDate,
      ToDate: data.ToDate,
      Month: selectedOption,
      SourceID: sourceID != null ? JSON.stringify(sourceID) : null,
    });

    fetchx(DASHBOARD_URL + "/getSourceProductivity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: createmarketGroup,
    })
      .then((result) => result.json())
      .then((resp) => {
        setIsButtonClicked(false)
        if(resp['statusCode'] == 200){
          setOpen(false)
        const transactionsArray = resp["data"].map((item) => item.data);
        const flattenedArray = transactionsArray.flat();
        setRowData(flattenedArray);
        }
      })

      .catch((error) => {
      });
  };


  const cellClickedListener = useCallback((event) => {

  }, []);


  const onBtnExport = () => {
    const params = {
      fileName: "Source Productivity Report.xlsx",
      sheetName: "Sheet1",
    };

    gridRef.current.api.exportDataAsExcel(params);
  };


  const printGrid = () => {
    const gridApi = gridRef.current && gridRef.current.api;
    const uniqueDepartureDates = Array.from(new Set(updatedRowData.map((row) => row.sourceCode)));

    if (gridApi) {
      const rowData = gridApi.getDataAsCsv({
        skipHeader: false,
        skipFooters: false,
        skipGroups: false,
      });
      const headerRow = rowData.substring(0, rowData.indexOf("\n"));
      const cleanHeaderRow = headerRow.replace(/"/g, "");
      const dataRows = rowData.substring(rowData.indexOf("\n") + 1);
      const cleanData = dataRows.replace(/"/g, "");
      const rows = cleanData.split("\n").map((row) => row.split(","));
      const pdf = new jsPDF({ orientation: "landscape" });
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
      const textToCenter = "Source Productivity Report";

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
        const dateString = date.toString();

        // Check if the date string matches the format "MMM YYYY"
        const isMonthYearFormat = dateString.match(/^\w{3} \d{4}$/);

        if (isMonthYearFormat) {
          return dateString; // Return the date as is
        } else {
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          return `${day}.${month}.${year}`;
        }
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


      function formatDateString(dateString) {
        const inputDate = new Date(dateString);
        const formattedDate = new Date(inputDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return formattedDate;
      }


      const sourceCodeTotalNights = {};

      updatedRowData.forEach(row => {
        const sourceCode = row.sourceCode;
        const nights = parseFloat(row.No_of_Nights || 0);
        sourceCodeTotalNights[sourceCode] = (sourceCodeTotalNights[sourceCode] || 0) + nights;
      });

      // Sort uniqueDepartureDates based on maximum total nights for each sourceCode
      uniqueDepartureDates.sort((a, b) => sourceCodeTotalNights[b] - sourceCodeTotalNights[a]);


      uniqueDepartureDates
        .sort((a, b) => new Date(a) - new Date(b))
        .forEach((sourceCode, index) => {
          const rowsForDate = updatedRowData
            .filter((row) => row.sourceCode === sourceCode)
            .map((row) => {
              let formattedArrival;
              if (selectedOption == '1') {
                formattedArrival = formatDateString(new Date(row.date));
              }
              else {
                formattedArrival = formatDate(new Date(row.date));
              }
              const formatNights = parseFloat(row.No_of_Nights || 0).toLocaleString("en-IN")
              const formatRoomRevenue = parseFloat(row.room_revenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              const formatPackageRevenue = parseFloat(row.package_revenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              const formatFnBRevenue = parseFloat(row.f_b_revenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              const formatTax = parseFloat(row.tax_for_future || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              const formatARR = parseFloat(row.ADR || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              const formatTotalRevenue = parseFloat(row.revenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              return {
                ...row,
                date: formattedArrival,
                No_of_Nights: formatNights,
                room_revenue: formatRoomRevenue,
                package_revenue: formatPackageRevenue,

                f_b_revenue: formatFnBRevenue,
                tax_for_future: formatTax,
                ADR: formatARR,
                revenue: formatTotalRevenue,


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

          // Calculate totals (using Indian formatted numbers)
          const totalNights = rowsForDate.reduce((acc, row) => {
            const formattedValue = row[3].replace(/[^0-9.-]+/g, ''); // Remove non-numeric characters, keep the decimal point
            return acc + parseFloat(formattedValue || 0);
          }, 0);

          const totalRoomRevenue = rowsForDate.reduce((acc, row) => {
            const formattedValue = row[4].replace(/[^0-9.-]+/g, ''); // Remove non-numeric characters, keep the decimal point
            return acc + parseFloat(formattedValue || 0);
          }, 0);
          const totalPackageRevenue = rowsForDate.reduce((acc, row) => {
            const formattedValue = row[5].replace(/[^0-9.-]+/g, ''); // Remove non-numeric characters, keep the decimal point
            return acc + parseFloat(formattedValue || 0);
          }, 0);

          const totalFnBRevenue = rowsForDate.reduce((acc, row) => {
            const formattedValue = row[6].replace(/[^0-9.-]+/g, ''); // Remove non-numeric characters, keep the decimal point
            return acc + parseFloat(formattedValue || 0);
          }, 0);

          const totalTax = rowsForDate.reduce((acc, row) => {
            const formattedValue = row[7].replace(/[^0-9.-]+/g, ''); // Remove non-numeric characters, keep the decimal point
            return acc + parseFloat(formattedValue || 0);
          }, 0);


          const totalARR = rowsForDate.reduce((acc, row) => {
            const formattedValue = row[8].replace(/[^0-9.-]+/g, '');; // Remove non-numeric characters, keep the decimal point
            return acc + parseFloat(formattedValue || 0);
          }, 0);
          const totalTotalRevenue = rowsForDate.reduce((acc, row) => {
            const formattedValue = row[9].replace(/[^0-9.-]+/g, ''); // Remove non-numeric characters, keep the decimal point
            return acc + parseFloat(formattedValue || 0);
          }, 0);

          let totalArr;
          if (totalNights == 0) {
            totalArr = totalRoomRevenue
          }

          else {
            totalArr = parseFloat(parseFloat(totalRoomRevenue) / parseFloat(totalNights))
          }


          // Format totals (keeping the Indian formatted style)
          const formattedTotalNights = totalNights.toLocaleString("en-IN");
          const formattedTotalRoomRevenue = totalRoomRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const formattedTotalPackageRevenue = totalPackageRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          const formattedTotalFnBRevenue = totalFnBRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const formattedTotalTax = totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const formattedARR = totalArr.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const formattedTotalRevenue = totalTotalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          pdf.setFont('times', 'bold');

          if (sourceCode == undefined) {
            pdf.text(`Grand Total`, 10, dateY + 37, { width: 500, align: 'left' });
            pdf.autoTable({
              head: [columns],
              body: [['', '', 'Total', formattedTotalNights, formattedTotalRoomRevenue, formattedTotalPackageRevenue, formattedTotalFnBRevenue, formattedTotalTax, formattedARR, formattedTotalRevenue]],
              startY: dateY + 43,
              margin,
              didParseCell: (data) => {
                if (data.column.index !== 0 && data.column.index !== 1 && data.column.index !== 2 ) {
                  data.cell.styles.halign = 'right';
                }

                if (data.row.raw.some(cellData => typeof cellData === 'string' && cellData.includes('Total'))) { // Assuming 'Grand Total' is in the first column
                  data.cell.styles.fillColor = [220, 220, 220]; // Highlighting with a yellow background color
                  data.cell.styles.fontStyle = 'bold'; // Making the text bold
                }
              }
            })
          }
          else {
            pdf.text(`Source: ${(sourceCode)}`, 10, dateY + 37, { width: 500, align: 'left' });
            pdf.autoTable({
              head: [columns],
              body: [...rowsForDate, ['', '', 'Total', formattedTotalNights, formattedTotalRoomRevenue, formattedTotalPackageRevenue, formattedTotalFnBRevenue, formattedTotalTax, formattedARR, formattedTotalRevenue]],
              startY: dateY + 43,
              margin, 
              didParseCell: (data) => {
                if (data.column.index !== 0 && data.column.index !== 1 && data.column.index !== 2 ) {
                  data.cell.styles.halign = 'right';
                }

                if (data.row.raw.some(cellData => typeof cellData === 'string' && cellData.includes('Total'))) { // Assuming 'Grand Total' is in the first column
                  data.cell.styles.fillColor = [220, 220, 220]; // Highlighting with a yellow background color
                  data.cell.styles.fontStyle = 'bold'; // Making the text bold
                }
              }
            })
          }

          pdf.setFont('times', 'normal');
          dateY = pdf.autoTable.previous.finalY - 25
        });

      dateY = pdf.autoTable.previous.finalY + 20;

      const availableSpace = pdf.internal.pageSize.height - dateY;

      // Check if the available space is enough for the content
      if (availableSpace < 30) { // Adjust '30' based on your content height
        pdf.addPage(); // Move to the next page
        dateY = 10; // Set Y position for the new page
      }

      let fromDate = formatDate(new Date(filterFromDate))
      let toDate = formatDate(new Date(filterToDate))

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      pdf.text(`Filter From Date: ${fromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
      pdf.text(`To Date: ${toDate}`, 10, dateY + 20, { width: 500, align: 'left' });
      pdf.text(`Source: ${sourceName}`, 10, dateY + 30, { width: 500, align: 'left' })

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

      pdf.save("Source Productivity Report.pdf");
    } else {
    }
  };
  
  
  // const generateExcel = () => {
  //   if (filterFromDate && filterToDate) {
  //     const workbook = new ExcelJS.Workbook();
  //     const worksheet = workbook.addWorksheet('Source Productivity Report');
  //     const columns = [
  //       { header: 'Source Code', key: 'sourceCode', width: 15 },
  //       { header: 'Description', key: 'description', width: 25 },
  //       { header: 'Date', key: 'date', width: 15 },
  //       { header: 'Nights', key: 'No_of_Nights', width: 10 },
  //       { header: 'Room Revenue', key: 'room_revenue', width: 20 },
  //       { header: 'FNB Revenue', key: 'f_b_revenue', width: 20 },
  //       { header: 'Tax', key: 'tax_for_future', width: 15 },
  //       { header: 'ARR', key: 'ADR', width: 15 },
  //     ];
  //     worksheet.columns = columns;
  //     worksheet.addRow(['Report Name:', 'Source Productivity Report']);
  //     worksheet.addRow(['From Date:', filterFromDate]);
  //     worksheet.addRow(['To Date:', filterToDate]);
  //     let selectedFilterSource = filterSource && filterSource.length !== 0
  //       ? filterSource.join(', ')
  //       : 'All';
  //     worksheet.addRow(['Filter Source:', selectedFilterSource]);
  //     worksheet.addRow(); 
  //     worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
  //     for (let i = 1; i <= 5; i++) {
  //       worksheet.getRow(i).font = { bold: true };
  //     }
  //     worksheet.spliceRows(1, 1); 

  
  //     const formattedData = (rowData) => {
  //       return rowData.map(item => ({
  //         ...item,
  //         sourceCode: item.sourceCode.replace(/\r?\n|\r/g, ''),
  //         description: item.description.replace(/\r?\n|\r/g, '')
  //       }));
  //     };
  
  //     const sanitizedData = formattedData(rowData);
  
  //     sanitizedData.forEach((row) => {
  //       worksheet.addRow({
  //         sourceCode: row.sourceCode,
  //         description: row.description,
  //         date: row.date,
  //         No_of_Nights: row.No_of_Nights,
  //         room_revenue: row.room_revenue,
  //         f_b_revenue: row.f_b_revenue,
  //         tax_for_future: row.tax_for_future,
  //         ADR: row.ADR,
  //       });
  //     });
  
  //     worksheet.columns.forEach((column, index) => {
  //       if ([4, 5, 6, 7, 8].includes(index + 1)) { 
  //         column.alignment = { vertical: 'middle', horizontal: 'right' };
  //       } else {
  //         column.alignment = { vertical: 'middle', horizontal: 'left' };
  //       }
  //     });
  
  //     workbook.xlsx.writeBuffer().then((buffer) => {
  //       const blob = new Blob([buffer], { type: 'application/octet-stream' });
  //       saveAs(blob, 'Source Productivity Report.xlsx');
  //     }).catch((error) => {
  //       console.error('Error generating Excel file:', error);
  //     });
  //   }
  // };
  
  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Source Productivity Report');
      
      const columns = [
        { header: 'Source Code', key: 'sourceCode', width: 15 },
        { header: 'Description', key: 'description', width: 25 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Nights', key: 'No_of_Nights', width: 10 },
        { header: 'Room Revenue', key: 'room_revenue', width: 20 },
        { header: 'FNB Revenue', key: 'f_b_revenue', width: 20 },
        { header: 'Tax', key: 'tax_for_future', width: 15 },
        { header: 'ARR', key: 'ADR', width: 15 },
      ];
      
      worksheet.columns = columns;
      
      worksheet.addRow(['Report Name:', 'Source Productivity Report']);
      worksheet.addRow(['From Date:', filterFromDate]);
      worksheet.addRow(['To Date:', filterToDate]);
      
      let selectedFilterSource = filterSource && filterSource.length !== 0
        ? filterSource.join(', ')
        : 'All';
      worksheet.addRow(['Filter Source:', selectedFilterSource]);
      
      worksheet.addRow();
      worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
      for (let i = 1; i <= 5; i++) {
        worksheet.getRow(i).font = { bold: true };
      }
  
      worksheet.spliceRows(1, 1);
  
      const formattedData = (rowData) => {
        return rowData.map(item => ({
          ...item,
          sourceCode: item.sourceCode.replace(/\r?\n|\r/g, '') ?? item.sourceCode,
          description: item.description.replace(/\r?\n|\r/g, '') ?? item.description
        }));
      };
      
      const sanitizedData = formattedData(rowData);
      
      let totalNights = 0;
      let totalRoomRevenue = 0;
      let totalFnbRevenue = 0;
      let totalTax = 0;
      let totalArr = 0;
  
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          sourceCode: row.sourceCode,
          description: row.description,
          date: row.date,
          No_of_Nights: row.No_of_Nights,
          room_revenue: row.room_revenue,
          f_b_revenue: row.f_b_revenue,
          tax_for_future: row.tax_for_future,
          ADR: row.ADR,
        });
  
        totalNights += parseFloat(row.No_of_Nights || 0);
        totalRoomRevenue += parseFloat(row.room_revenue || 0);
        totalFnbRevenue += parseFloat(row.f_b_revenue || 0);
        totalTax += parseFloat(row.tax_for_future || 0);
        totalArr += parseFloat(row.ADR || 0);
      });
      
      worksheet.addRow();
      worksheet.addRow({
        sourceCode: 'Totals',
        description: '',
        date: '',
        No_of_Nights: totalNights,
        room_revenue: totalRoomRevenue.toFixed(2),
        f_b_revenue: totalFnbRevenue.toFixed(2),
        tax_for_future: totalTax.toFixed(2),
        ADR: totalArr.toFixed(2),
      });
      
      const totalRow = worksheet.lastRow;
      totalRow.font = { bold: true };
      
      worksheet.columns.forEach((column, index) => {
        if ([4, 5, 6, 7, 8].includes(index + 1)) {
          column.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          column.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10); 
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        // saveAs(blob, 'Source Productivity Report.xlsx');
        saveAs(blob, `Source Productivity Report_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };
  

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">
            <b>Source Productivity Report</b>
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Form onSubmit={handleSubmit(ConfirmSubmit)}>
            <Row>
              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="FromDate">
                    From Date<spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id="FromDate"
                    name="FromDate"
                    
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        required
                        options={{ allowInput: true }} 
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                          "is-invalid": data !== null && data.FromDate === null,
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="ToDate">
                    To Date <spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id="ToDate"
                    name="ToDate"
                    required
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        required
                        options={{ allowInput: true }} 
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                          "is-invalid": data !== null && data.ToDate === null,
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="sourceID">
                    Source
                  </Label>
                  <Controller
                    id="sourceID"
                    control={control}
                    name="sourceID"
                    render={({ field }) => (
                      <Select
                        isMulti
                        isClearable
                        options={marketOptions}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>
            </Row>
            <br></br>

            <Row>
              <Col md="12" sm="12" className="mb-1">
                <Label className="form-check-label" for="ex1-active">
                  <Input
                    type="radio"
                    name="ex1"
                    value="0"
                    checked={selectedOption === "0"}
                    onChange={handleTransferTransaction}
                  />
                  &nbsp; Date wise
                </Label>
              </Col>
              <br></br>
              <br></br>

              <Col md="12" sm="12" className="mb-1">
                <Label className="form-check-label">
                  <Input
                    type="radio"
                    name="ex1"
                    value="1"
                    checked={selectedOption === "1"}
                    onChange={handleTransferTransaction}
                  />
                  &nbsp; Month wise
                </Label>
              </Col>

              <div align="end" className="buttons">
                <Button className="me-1" color="primary" type="submit" disabled={isButtonClicked}>
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
                  <Button
                  className='me-1'
                  color='primary'
                  onClick={generateExcel}
              >
                  Download Excel
              </Button>
                )}

                {flag == true && (
                  <Button
                    className="me-1"
                    color="primary"
                    // type="submit"
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
      {flag == true && (
        <div className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            groupDisplayType={groupDisplayType}
            onCellClicked={cellClickedListener}
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            pinnedBottomRowData={pinnedBottomRowData}
            domLayout="autoHeight"
            rowData={rowData}
            columnDefs={[...columnDefs].filter(Boolean)}
            animateRows={true}
            rowSelection="multiple"
            groupIncludeFooter={true}
            groupIncludeTotalFooter={true}
          />
        </div>
      )}

    </div>
  );
};

export default SourceProductivity;
