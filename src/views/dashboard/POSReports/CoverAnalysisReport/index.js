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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Logo from '@src/assets/images/logo/oterra.jpg'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'


const MySwal = withReactContent(Swal)

const defaultValues = {
  frmdate: ''
}



const CoverAnalysisReport = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [rowData1, setRowData1] = useState();
  const [flag, setFlag] = useState(false)
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
    const [filterResturant, setfilterResturant] = useState(null);
  const [filterSessionType, setfilterSessionType] = useState(null);
  const [hotelName, sethotelName] = useState('');
  const [hotelAddress, sethotelAddress] = useState('');
    const [loading, setLoading] = useState(false); 
    const [isButtonClicked, setIsButtonClicked] = useState(false);



  function formatNumber(params) {
    var number = params.value;

    if (typeof number !== 'number' || isNaN(number)) {
      return '';
    }

    var formattedNumber = Math.floor(number).toFixed(2);
    return formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  const CustomHeaderComponentCovers = () => {
    return (
      <div>
        Covers
      </div>
    );
  };
  const CustomHeaderComponentFoodCov = () => {
    return (
      <div>
        Food Cov
      </div>
    );
  };
  const CustomHeaderComponentFoodamttax = () => {
    return (
      <div>
        FoodAmount(Without Tax)
      </div>
    );
  };
  const CustomHeaderComponentFoodavgtax = () => {
    return (
      <div>
        Foodaverage(Without Tax)
      </div>
    );
  };
  const CustomHeaderComponentliqCov = () => {
    return (
      <div>
        Liquor Cov
      </div>
    );
  };
  const CustomHeaderComponentliqamttax = () => {
    return (
      <div>
        Liquor Amount (Without Tax)
      </div>
    );
  };
  const CustomHeaderComponentliqAvgtax = () => {
    return (
      <div>
        Liquor average (Without Tax)
      </div>
    );
  };
  const CustomHeaderComponentsoftDrinkCov = () => {
    return (
      <div>
        Softdrink Cov
      </div>
    );
  };
  const CustomHeaderComponentsoftdrinksAmtTax = () => {
    return (
      <div>
        Softdrink Amount (Without Tax)
      </div>
    );
  };
  const CustomHeaderComponentsoftdrinksAvgTax = () => {
    return (
      <div>
        Softdrink average (Without Tax)
      </div>
    );
  };
  const CustomHeaderComponentSmokesCov = () => {
    return (
      <div>
        Smokes Cov
      </div>
    );
  };
  const CustomHeaderComponentsmokesAmtTax = () => {
    return (
      <div>
        Smokes Amount (Without Tax)
      </div>
    );
  };
  const CustomHeaderComponentsmokesAvgTax = () => {
    return (
      <div>
        Smokes average (Without Tax)
      </div>
    );
  };
  const CustomHeaderComponentothersCov = () => {
    return (
      <div>
        Others Cov
      </div>
    );
  };
  const CustomHeaderComponentothersAmtTax = () => {
    return (
      <div>
        Others Amount (Without Tax)
      </div>
    );
  };
  const CustomHeaderComponentothersAvgTax = () => {
    return (
      <div>
        Others average (Without Tax)
      </div>
    );
  };


  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Resturant', field: 'restaurantName', suppressSizeToFit: true, maxWidth: 150, rowGroup: true },
    { headerName: 'Guest Type	', field: 'guestType', suppressSizeToFit: true, maxWidth: 150 },

    { headerName: 'Covers', field: 'Covers', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', headerComponentFramework: CustomHeaderComponentCovers },
    { headerName: 'Food Cov', field: 'FoodCov', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', headerComponentFramework: CustomHeaderComponentFoodCov },
    { headerName: 'Food Amt', field: 'FoodWithoutTax', suppressSizeToFit: true, initialWidth: 230, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentFoodamttax },
    { headerName: 'Food Avg', field: 'FoodAvgWithoutTax', suppressSizeToFit: true, initialWidth: 230, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentFoodavgtax },
    { headerName: 'Liquor Cov', field: 'LiquorCov', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', headerComponentFramework: CustomHeaderComponentliqCov },
    { headerName: 'Liquor Amt', field: 'LiquorWithoutTax', suppressSizeToFit: true, maxWidth: 230, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentliqamttax },
    { headerName: 'Liquor Avg', field: 'LiquorAvgWithoutTax', suppressSizeToFit: true, maxWidth: 230, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentliqAvgtax },
    { headerName: 'Softdrink Cov', field: 'SoftDrinksCov', suppressSizeToFit: true, maxWidth: 130, aggFunc: 'sum', headerComponentFramework: CustomHeaderComponentsoftDrinkCov },
    { headerName: 'Softdrink Amt', field: 'SoftDrinksWithoutTax', suppressSizeToFit: true, maxWidth: 230, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentsoftdrinksAmtTax },
    { headerName: 'Softdrink Avg', field: 'SoftDrinksAvgWithoutTax', suppressSizeToFit: true, maxWidth: 230, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentsoftdrinksAvgTax },
    { headerName: 'Smokes Cov', field: 'SmokesCov', suppressSizeToFit: true, maxWidth: 150, aggFunc: 'sum', headerComponentFramework: CustomHeaderComponentSmokesCov },
    { headerName: 'Smokes Amt', field: 'SmokesWithoutTax', suppressSizeToFit: true, maxWidth: 230, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentsmokesAmtTax },
    { headerName: 'Smokes Avg', field: 'SmokesAvgWithoutTax', suppressSizeToFit: true, maxWidth: 230, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentsmokesAvgTax },
    { headerName: 'Others Cov', field: 'OthersCov', suppressSizeToFit: true, maxWidth: 150, aggFunc: 'sum', headerComponentFramework: CustomHeaderComponentothersCov },
    { headerName: 'Others Amt', field: 'OthersWithoutTax', suppressSizeToFit: true, maxWidth: 230, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentothersAmtTax },
    { headerName: 'Others Avg', field: 'OthersAvgWithoutTax', suppressSizeToFit: true, maxWidth: 230, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentothersAvgTax },
    {
      headerName: 'Session Name',
      field: 'timing',
      suppressSizeToFit: true,
      maxWidth: 150,
      // rowGroup: true,
      valueFormatter: ({ value }) => value ? value : 'PMS Trxns',
    },


    // Add other columns based on your data
  ]);
  const groupDisplayType = 'singleColumn';



  const gridRef = useRef();
  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      initialWidth: 150,
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
  }, []);


  // ** State
  const [data, setData] = useState(null)
  // const [storeOptions, setStoreOptions] = useState([]);
  const [coversData, setCoversData] = useState([])
  const [hotelNo, setHotelNo] = useState(null);
  const [hotelFax, sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);

  // ** Hooks
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  let navigate = useNavigate();


  const [storeOptions, setStoreOptions] = useState([]);

  useEffect(() => {
    fetchx(DASHBOARD_URL + "/getStoreList?hotelID=10")
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



  const [sessionTypeOptions, setsessionTypeOptions] = useState([]);


  useEffect(() => {
    fetchx(DASHBOARD_URL + '/getAllsession?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        const responseData = resp['data'];
        const sessionNames = responseData.map((item) => ({
          label: item.sessionName,
          value: item.sessionName, // You can set this to the session name if needed
        }));
        setsessionTypeOptions(sessionNames);
      })
      .catch(error => {
        console.error("Error fetchxing data:", error);
      });
  }, [])

  const getcoversData = data => {
      setIsButtonClicked(true)
      setLoading(true)
    const filterFromDate = Moment(data.frmdate[0]).format("DD-MM-YYYY");
    const filterToDate = Moment(data.todate[0]).format("DD-MM-YYYY");
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    const storeIDs = Array.isArray(data.storeID) ? data.storeID.map(item => item.value) : [];
    const sessionTypes = Array.isArray(data.sessionType) ? data.sessionType.map(item => item.value) : [];
 const selectedResturants = data.storeID && data.storeID.map(item => item.label);
    const selectedsessionTypes = Array.isArray(data.sessionType) ? data.sessionType.map(item => item.label) : [];
        setfilterResturant(selectedResturants)
    setfilterSessionType(selectedsessionTypes)
    let createmarketGroup;

    createmarketGroup = JSON.stringify({
      "hotelID": 1,
      "storeID": storeIDs,
      "fromDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
      "toDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD"),
      "sessionType": sessionTypes

    })
    // }
    setData(data)
    setFlag(true)


    let res = fetchx(DASHBOARD_URL + "/getCoverAnalysReport", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then(data => data.json())
      .then((res) => {
              setIsButtonClicked(false)     
               if (res['statusCode'] == 200) {
                setLoading(false);
                setRowData(res['data'])
                setCoversData(res["data"])
               }
            });


  }

  const handleReset = () => {
    reset({

      block: ''
    })
  }

  const onBtnExport= () => {
    const params = {
      fileName: "Cover Analysis.xlsx",
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
    if (filterFromDate && filterToDate) {


      const gridApi = gridRef.current && gridRef.current.api;

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

        // pdf.addImage(Logo, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

        const margin = { left: 5, right: 5 };

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




        const textToCenter = "Cover Analysis Report";

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
        //     1: { cellWidth: 15 },
        //     2: { cellWidth: 10 },
        //     3: { cellWidth: 10 },
        //     4: { cellWidth: 18 },
        //     5: { cellWidth: 18 },
        //     6: { cellWidth: 10 },
        //     7: { cellWidth: 18 },
        //     8: { cellWidth: 18 },
        //     9: { cellWidth: 10 },
        //     10: { cellWidth: 18 },
        //     11: { cellWidth: 18 },
        //     12: { cellWidth: 10 },
        //     13: { cellWidth: 18 },
        //     14: { cellWidth: 18 },
        //     15: { cellWidth: 10 },
        //     16: { cellWidth: 15 },
        //     17: { cellWidth: 15 },
        //     18: { cellWidth: 18 }
        //   };        

        //   const billDateTimeIndex = 14;

        // if (billDateTimeIndex !== -1) {
        //     // Format billDateTime column in rows
        //     rows.forEach(row => {
        //         const billDateTimeValue = new Date(row[billDateTimeIndex]);
        //         row[billDateTimeIndex] = formatDate(billDateTimeValue);
        //     });
        // }
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
        const columnsToFormat = [4, 5, 7, 8, 10, 11, 13, 14, 16, 17];

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
        pdf.autoTable({
          head: [modifiedHeaders],
          body: rows.map(row => row.map(value => value.trim())),
          startY: dateY + 20,
          //   columnStyles

        });
        dateY = pdf.autoTable.previous.finalY + 20;

        pdf.text(`Filter From Bill Date: ${filterFromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
        pdf.text(`To Bill Date: ${filterToDate}`, 10, dateY + 20, { width: 500, align: 'left' });
        pdf.save('Cover Analysis Report.pdf');
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
        if (filterFromDate && filterToDate) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Cover Analysis Report');
    
            const columns = [
                { header: 'Resturant', key: 'restaurantName', width: 20 },
                { header: 'Covers', key: 'Covers', width: 15 },
                { header: 'Food Cov', key: 'FoodCov', width: 15 },
                { header: 'Food Amt', key: 'FoodWithoutTax', width: 15 },
                { header: 'Food Avg', key: 'FoodAvgWithoutTax', width: 15 },
                { header: 'Liquor Cov', key: 'LiquorCov', width: 15 },
                { header: 'Liquor Amt', key: 'LiquorWithoutTax', width: 15 },
                { header: 'Liquor Avg', key: 'LiquorAvgWithoutTax', width: 15 },
                { header: 'Softdrink Cov', key: 'SoftdrinkCov', width: 15 },
                { header: 'Softdrink Amt', key: 'SoftDrinksWithoutTax', width: 15 },
                { header: 'Softdrink Avg', key: 'SoftDrinksAvgWithoutTax', width: 15 },
                { header: 'Smokes Cov', key: 'SmokesCov', width: 15 },
                { header: 'Smokes Amt', key: 'SmokesWithoutTax', width: 15 },
                { header: 'Smokes Avg', key: 'SmokesAvgWithoutTax', width: 15 },
                { header: 'Others Cov', key: 'OthersCov', width: 15 },
                { header: 'Others Amt', key: 'OthersWithoutTax', width: 15 },
                { header: 'Others Avg', key: 'OthersAvgWithoutTax', width: 15 },
                { header: 'Session Name', key: 'timing', width: 20 }
            ];
    
            worksheet.columns = columns;
    
            worksheet.addRow(['Report Name:', 'Cover Analysis REPORT']);
            worksheet.addRow(['Filter From Bill Date:', filterFromDate]);
            worksheet.addRow(['To Date:', filterToDate]);
    
            let selectedFilterResturant = filterResturant && filterResturant.length !== 0
                ? filterResturant.toString()
                : 'All';
    
            worksheet.addRow(['Filter Resturants:', selectedFilterResturant]);
             let filterselectedsessionTypes = filterSessionType && filterSessionType.length !== 0
                ? filterSessionType.toString()
                : 'All';
    
            worksheet.addRow(['Filter SessionType:', filterselectedsessionTypes]);
            worksheet.addRow([]);
            worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
            worksheet.getRow(1).font = { bold: true }; 
            worksheet.getRow(2).font = { bold: true }; 
            worksheet.getRow(3).font = { bold: true }; 
            worksheet.getRow(4).font = { bold: true };
            worksheet.getRow(5).font = { bold: true };            
            worksheet.getRow(6).font = { bold: true };

    
            rowData.sort((a, b) => a.storeID - b.storeID);
    
            let totals = {
                Covers: 0,
                FoodCov: 0,
                FoodWithoutTax: 0,
                FoodAvgWithoutTax:0,
                LiquorCov: 0,
                LiquorWithoutTax: 0,
                LiquorAvgWithoutTax:0,
                SoftdrinkCov: 0,
                SoftDrinksWithoutTax: 0,
                SoftDrinksAvgWithoutTax: 0,
                SmokesCov: 0,
                SmokesWithoutTax: 0,
                SmokesAvgWithoutTax: 0,
                OthersCov: 0,
                OthersWithoutTax: 0,
                OthersAvgWithoutTax: 0
            };
    
            rowData.forEach((row) => {
                let formattedRow = {
                    restaurantName: row.restaurantName,
                    Covers: row.Covers,
                    FoodCov: row.FoodCov,
                    FoodWithoutTax: parseFloat(row.FoodWithoutTax),
                    FoodAvgWithoutTax: parseFloat(row.FoodAvgWithoutTax).toFixed(2),
                    LiquorCov: row.LiquorCov,
                    LiquorWithoutTax: parseFloat(row.LiquorWithoutTax),
                    LiquorAvgWithoutTax: parseFloat(row.LiquorAvgWithoutTax).toFixed(2),
                    SoftdrinkCov: row.SoftDrinksCov,
                    SoftDrinksWithoutTax: parseFloat(row.SoftDrinksWithoutTax),
                    SoftDrinksAvgWithoutTax: parseFloat(row.SoftDrinksAvgWithoutTax).toFixed(2),
                    SmokesCov: row.SmokesCov, 
                    SmokesWithoutTax: parseFloat(row.SmokesWithoutTax),
                    SmokesAvgWithoutTax: parseFloat(row.SmokesAvgWithoutTax).toFixed(2),
                    OthersCov: row.OthersCov,
                    OthersWithoutTax: parseFloat(row.OthersWithoutTax),
                    OthersAvgWithoutTax: parseFloat(row.OthersAvgWithoutTax).toFixed(2),
                    timing: row.timing
                };
    
                totals.Covers += row.Covers;
                totals.FoodCov += row.FoodCov;
                totals.FoodWithoutTax += parseFloat(row.FoodWithoutTax);
                totals.FoodAvgWithoutTax += parseFloat(row.FoodAvgWithoutTax);
                totals.LiquorCov += row.LiquorCov;
                totals.LiquorWithoutTax += parseFloat(row.LiquorWithoutTax);
                totals.LiquorAvgWithoutTax += parseFloat(row.LiquorAvgWithoutTax);
                totals.SoftdrinkCov += row.SoftDrinksCov;
                totals.SoftDrinksWithoutTax += parseFloat(row.SoftDrinksWithoutTax);
                totals.SoftDrinksAvgWithoutTax += parseFloat(row.SoftDrinksAvgWithoutTax);
                totals.SmokesCov += row.SmokesCov;
                totals.SmokesWithoutTax += parseFloat(row.SmokesWithoutTax);
                totals.SmokesAvgWithoutTax += parseFloat(row.SmokesAvgWithoutTax);
                totals.OthersCov += row.OthersCov;
                totals.OthersWithoutTax += parseFloat(row.OthersWithoutTax);
                totals.OthersAvgWithoutTax += parseFloat(row.OthersAvgWithoutTax);
    
                worksheet.addRow(formattedRow);
            });
    
            // Add Total row
            worksheet.spliceRows(1, 1);

            worksheet.addRow([]);

            worksheet.addRow([
                'Total',
                totals.Covers,
                totals.FoodCov,
                totals.FoodWithoutTax.toFixed(2),
                totals.FoodAvgWithoutTax.toFixed(2),
                totals.LiquorCov,
                totals.LiquorWithoutTax.toFixed(2),
                totals.LiquorAvgWithoutTax.toFixed(2),
                totals.SoftdrinkCov,
                totals.SoftDrinksWithoutTax.toFixed(2),
                totals.SoftDrinksAvgWithoutTax.toFixed(2),
                totals.SmokesCov,
                totals.SmokesWithoutTax.toFixed(2),
                totals.SmokesAvgWithoutTax.toFixed(2),
                totals.OthersCov,
                totals.OthersWithoutTax.toFixed(2),
                totals.OthersAvgWithoutTax.toFixed(2),
            ]).font = { bold: true };
    
            worksheet.getRow(worksheet.lastRow.number).font = { bold: true };
    
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 10);
    
            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/octet-stream' });
                saveAs(blob, `Cover_Analysis_Report_${formattedDate}.xlsx`);
            }).catch((error) => {
                console.error('Error generating Excel file:', error);
            });
        }
    };
    
    
      

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Cover Analysis Report</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(getcoversData)}>
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



                <Col md='4' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='sessionType'>
                      Session Type
                    </Label>
                    <Controller
                      id="sessionType"
                      control={control}
                      name="sessionType"
                      render={({ field }) => (
                        <Select
                          isMulti
                          // required
                          isClearable
                          options={sessionTypeOptions}
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </Col>
              </Row>
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

                {/* {flag && (
                                    <Button
                                        className='me-1'
                                        color='primary'
                                        onClick={downloadCSV}
                                    >
                                        Download CSV
                                    </Button>
                                )} */}
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
            onCellClicked={cellClickedListener}
            defaultColDef={defaultColDef}
            domLayout='autoHeight'
            ref={gridRef}
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

export default CoverAnalysisReport