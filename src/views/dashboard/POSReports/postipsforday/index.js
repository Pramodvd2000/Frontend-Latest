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
import Select from 'react-select';
import { selectThemeColors } from '@utils'

import { useRef, useEffect, useMemo, useCallback } from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import logo from '@src/assets/images/logo/oterra.jpg'
// import { createRoot } from 'react-dom/client';
import ExcelJS from 'exceljs';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'


const MySwal = withReactContent(Swal)


import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';



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
  const [data, setData] = useState(null)
  const [storeOptions, setStoreOptions] = useState([]);

  const [hotelAddress, sethotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [rowData, setRowData] = useState();
  const [hotelNo, setHotelNo] = useState(null);
  const [hotelFax, sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
   const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [loading, setLoading] = useState(false); 
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })

  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
  };

  let navigate = useNavigate();
  const gridRef = useRef();
  const [InvURL, setInvURL] = useState([])

  const CustomHeaderComponentRate = () => {
    return (
      <div>
        Tip Amount
      </div>
    );
  };

  function formatNumber(params) {
    const formattedNumber = Number(params.value).toLocaleString('en-IN');
    return formattedNumber;
  }

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Restaurant', field: 'restaurantName', suppressSizeToFit: true, maxWidth: 170, rowGroup: true },

    { headerName: 'Bill No', field: 'billNoDisplay', suppressSizeToFit: true, maxWidth: 170 },
    // { headerName: 'Tip Amount', field: 'TipAmount', suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true, aggFunc: 'sum',groupIncludeFooter: (params) => {
    //   return `Total ${params.colDef.headerName}`;
    // },  },
    {
      headerName: 'Tip Amount', field: 'TipAmount', suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true, headerComponentFramework: CustomHeaderComponentRate,
      valueGetter: (params) => {
        // Assuming the 'TipAmount' property exists in your data
        return params.data.TipAmount
      },
      aggFunc: 'sum',

    },
    { headerName: 'Payment Type', field: 'paymentType', suppressSizeToFit: true, maxWidth: 170, wrapText: true, autoHeight: true },
    { headerName: 'Guest', field: 'guestName', suppressSizeToFit: true, maxWidth: 170, wrapText: true, autoHeight: true },
    { headerName: 'Table No', field: 'tableNo', suppressSizeToFit: true, maxWidth: 110 },


    // { headerName: 'OrderID', field: 'orderID', suppressSizeToFit: true, maxWidth: 110, wrapText: true, autoHeight: true },


    // {
    //   headerName: 'Description', field: 'totalAmount', suppressSizeToFit: true, maxWidth: 180, wrapText: true, autoHeight: true, groupIncludeFooter: (params) => {
    //     return `Total ${params.colDef.headerName}`;
    //   }
    // },
    // {
    //   // headerName: 'Total Amount', field: 'totalAmount', suppressSizeToFit: true, maxWidth: 180, wrapText: true, autoHeight: true,

    // },
    // { headerName: 'Round Off', field: 'roundOff', suppressSizeToFit: true, maxWidth: 170, wrapText: true, autoHeight: true },
    { headerName: 'Bill Status', field: 'billStatus', suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true },
    {
      headerName: 'Bill Date ', field: 'billDateTime', suppressSizeToFit: true, maxWidth: 170, cellRenderer: (params) => {
        // Ensure the arrivalDate field exists in the row data        
        if (params.data && params.data.billDateTime) {
          // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
          const formattedDate = Moment(params.data.billDateTime).format("DD-MM-YYYY");
          return formattedDate;
        } else {
          return ""; // Handle cases where the data is missing or invalid        
        }
      }
    }, { headerName: 'Steward Name', field: 'stewardName', suppressSizeToFit: true, maxWidth: 170, wrapText: true, autoHeight: true },


  ]);

  useEffect(() => {
    const hotelID = JSON.stringify({
      hotelID: 10
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
        setHotelName(hotelName1);
        sethotelAddress(hotelAddress1);
        setHotelNo(number)
        sethotelFax(fax)
        setLogo(logo)
      })
  }, [])

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
      fileName: 'Tips Summary Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };

  const downloadPDF = async () => {
    const columns = columnDefs.map((column) => column.headerName);
    const doc = new jsPDF({ orientation: 'landscape' });

    try {
      // Add image with increased space

      const pageWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 20;
      const xLogo = 10; // X-coordinate for the logo
      const yLogo = 10; // Y-coordinate for the logo
      const logoHeight = 20;
      let dateY = 20
      let startY = 20;
      const margin = { left: 10, right: 10 };

      doc.addImage(DASHBOARD_URL+`/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);
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
      const textToCenter = "Tips Summary Report";

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

      let grandTotal = 0; // Add this variable to store the grand total

      const groupedRows = rowData1.reduce((acc, row) => {
        const key = row['restaurantName'];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(row);
        grandTotal += parseFloat(row['TipAmount'] || 0); // Update the grand total

        return acc;
      }, {});

      // Iterate through grouped rows and add tables for each group
      for (const restaurantName in groupedRows) {
        // Add text for the current group
        doc.setFont('times', 'bold');

        doc.text(`Resturant: ${restaurantName}`, 10, startY + 10, { width: 500, align: 'left' });

        // Convert rows of the current group to table format
        const groupRows = groupedRows[restaurantName].map((row) => columnDefs.map((column) => row[column.field]));

        // Calculate the total base_amount for the current group
        const totalAmount = groupedRows[restaurantName].reduce(
          (total, row) => total + parseFloat(row['TipAmount'] || 0),
          0
        ).toFixed(2);


        const columnStyles = {
          0: { columnWidth: 25 }, // Adjust the width as needed for each column
          1: { columnWidth: 40 },
          2: { columnWidth: 20 },
          3: { columnWidth: 30 },
          4: { columnWidth: 42 },
          5: { columnWidth: 15 },
          6: { columnWidth: 30 },
          7: { columnWidth: 30 },
          8: { columnWidth: 40 },
          // 9: { columnWidth: 25 }
          // 9: { columnWidth: 18 },
          // 10: { columnWidth: 21 },
        };
        // Add table for the current group, including the total amount row
        doc.autoTable({
          head: [columns],
          body: [...groupRows, ['', 'Total Amount: ', totalAmount, '', '', '', ' ', ' ', ' ',]], // Add the total amount row

          // body: [...groupRows], // Add the total amount row
          startY: startY + 20,
          margin,
          columnStyles,
          didParseCell: (data) => {
            if (data.column.index == 8 || data.column.index == 6) {
              data.cell.styles.halign = 'right';
            }
          }

        });

        // Update startY for the next group
        startY = doc.autoTable.previous.finalY + 5;
      }


      const columnStyles = {
        0: { columnWidth: 25 }, // Adjust the width as needed for each column
        1: { columnWidth: 40 },
        2: { columnWidth: 20 },
        3: { columnWidth: 30 },
        4: { columnWidth: 42 },
        5: { columnWidth: 15 },
        6: { columnWidth: 30 },
        7: { columnWidth: 30 },
        8: { columnWidth: 40 },
        // 9: { columnWidth: 25 },
        // 10: { columnWidth: 21 },
      };
      doc.autoTable({
        body: [['', 'Grand Total:', grandTotal.toFixed(2), '', '', '', ' ', ' ', ' ',]],
        startY: startY + 2,
        margin,
        columnStyles,
        didParseCell: (data) => {
          if (data.column.index == 8 || data.column.index == 6) {
            data.cell.styles.halign = 'right';
          }
        }

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

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Filter:`, 10, startY + 20, { width: 500, align: 'left' });
      doc.text(
        ` Date: ${Moment(String(new Date(data.frmdate[0]))).format('DD.MM.YYYY')} to ${Moment(String(new Date(data.todate[0]))).format("DD.MM.YYYY")}`,
        10,
        startY + 30,
        { width: 500, align: 'left' }
      );
      // Save the doc
      const docBlob = doc.output('blob');
      saveAs(docBlob, 'Tips Summary Report.pdf');
    } catch (error) {
      console.error('Error creating doc:', error);
    }
  };
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [filterResturant, setfilterResturant] = useState(null);





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
        setRowData1(rowData["data"])
      })

  }, [])


  const handleChange = (selectedOption) => {
    const selectedIds = selectedOption.map(option => option.value);
    const selectedIdsString = JSON.stringify(selectedIds); // Convert to a JSON string
    // console.log(selectedIdsString);
    setCompanyData(selectedIdsString);
  };

  useEffect(() => {
    fetchx(DASHBOARD_URL + "/getStoreList?hotelID=10")
      .then(result => result.json())
      .then(resp => {
        const responseData = resp['data'];
        console.log(responseData)
        setStoreOptions(responseData);
      })
      .catch(error => {
        console.error("Error fetchxing data:", error);
      });
  }, [])

  const onSubmit = data => {
    setIsButtonClicked(true)
    setLoading(true);

    // console.log("flag1",flag1)
    setFlag(true)
    setData(data)
    const storeIDs = Array.isArray(data.storeID) ? data.storeID.map(item => item.value) : [];

    let createmarketGroup = JSON.stringify({
      "hotelID": 10,
      "FromDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
      "ToDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD"),
      "storeID": storeIDs

    })
    const filterFromDate = Moment(data.frmdate[0]).format("DD-MM-YYYY");
    const filterToDate = Moment(data.todate[0]).format("DD-MM-YYYY");
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    const selectedResturants = data.storeID && data.storeID.map(item => item.label);
    setfilterResturant(selectedResturants)
    console.log(createmarketGroup)

    if (flag1 == true) {
      let res = fetchx(DASHBOARD_URL + "/getPOSTipsForTheDay", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(data => data.json())
        .then((res) => {
          if (res['statuscode'] == 200) {
            setIsButtonClicked(false)
            setLoading(false)
          console.log(res);
          setRowData1(res["data"])
          }
        });
    }
    else if (flag1 == false) {
      let res = fetchx(DASHBOARD_URL + `/DownloadAirportDropReport`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(data => data.json())
        .then((res) => {
          setInvURL(res['url'])
          setTimeout(() => {
            navigate('/dashboard/frontdesk')
            const newTab = window.open('about:blank', '_blank');
            newTab.location.href = res['url']
          }, 1000)
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
        const worksheet = workbook.addWorksheet('Tips Summary Report');

        const columns = [
            { header: 'Restaurant', key: 'restaurantName', width: 20 },
            { header: 'Bill No', key: 'billNoDisplay', width: 20 },
            { header: 'Tip Amount', key: 'TipAmount', width: 15 },
            { header: 'Payment Type', key: 'paymentType', width: 20 },
            { header: 'Guest', key: 'guestName', width: 20 },
            { header: 'Table No', key: 'tableNo', width: 15 },
            { header: 'Bill Status', key: 'billStatus', width: 20 },
            { header: 'Bill Date ', key: 'billDateTime', width: 20 },
            { header: 'Steward Name', key: 'stewardName', width: 20 }
        ];

        worksheet.columns = columns;

        worksheet.addRow(['Report Name:', 'Tips Summary Report']);
        worksheet.addRow(['Filter From Bill Date:', filterFromDate]);
        worksheet.addRow(['To Date:', filterToDate]);

        let selectedFilterRestaurant = filterResturant && filterResturant.length !== 0
            ? filterResturant.toString()
            : 'All';
    
        worksheet.addRow(['Filter Restaurants:', selectedFilterRestaurant]);
        worksheet.addRow([]);

        worksheet.addRow(columns.map(column => column.header)).font = { bold: true };

        for (let i = 1; i <= 5; i++) {
            worksheet.getRow(i).font = { bold: true };
        }

        // Process and format rowData
        let formattedRows = rowData1.map((row) => ({
            restaurantName: row.restaurantName,
            billNoDisplay: row.billNoDisplay,
            TipAmount: row.TipAmount || 0,
            paymentType: row.paymentType || '',
            guestName: row.guestName || '',
            tableNo: row.tableNo,
            billStatus: row.billStatus || '',
            billDateTime: row.billDateTime || '',
            stewardName: row.stewardName || ''
        }));

        // Add formatted rows to the worksheet
        formattedRows.forEach((row) => {
            worksheet.addRow(row);
        });

        worksheet.spliceRows(1, 1);

        // Calculate total Tip Amount
        const totalTipAmount = formattedRows.reduce((sum, row) => sum + (parseFloat(row.TipAmount) || 0), 0);

        // Add total row
        worksheet.addRow([]);

        worksheet.addRow(['Total', '', totalTipAmount, '', '', '', '', '', '']).font = { bold: true };

        // Adjust alignment for columns
        worksheet.columns.forEach((column, index) => {
            if ([2].includes(index)) { // Right align 'Tip Amount'
                column.alignment = { vertical: 'middle', horizontal: 'right' };
            } else { 
                column.alignment = { vertical: 'middle', horizontal: 'left' };
            }
        });

        // Generate Excel file and prompt download
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            saveAs(blob, `Tips Summary Report_${formattedDate}.xlsx`);
        }).catch((error) => {
            console.error('Error generating Excel file:', error);
        });
    }
};


  return (
    <div>

      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Tips Summary Report</CardTitle>
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
                        options={{ allowInput: true }}

                        // value={data1['dob']}
                        // options={doboptions}
                        // options={optionsToDate}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                          // 'is-invalid': data !== null && data.dob === null
                        })}
                      />
                    )}
                  />
                </div>
              </Col>







              <Col md='4' sm='12'>
                <div className='mb-1'>
                  <Label className='form-label' for='storeID'>
                    Store Name
                  </Label>
                  <Controller
                    id="storeID"
                    control={control}
                    name="storeID"
                    render={({ field }) => (
                      <Select
                        isMulti

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


              <div align="end" className="buttons">
                <Button className='me-1' color='primary' type='submit' onClick={() => setflag1(true)}>
                            {isButtonClicked ? 'Processing...' : 'Submit'}
                </Button>
                <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                  Reset
                </Button>
                {/* <Button className='me-1' color='primary' type='submit' onClick={onButtonExport}> Download Excel </Button> */}
                <Button className='me-1' color='primary'  onClick={generateExcel}>
                      Download Excel
                      </Button>

                <Button className='me-1' color='primary' onClick={downloadPDF}>Print to PDF
                </Button>
                {/* <Button className='me-1' color='primary' type='submit' onClick={()=>setflag1(false)}>
                Download
              </Button> */}
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

      flag1 == true && <div className="ag-theme-alpine" >
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
        />
      </div>
        )}
    </div>
  )

}


export default Block
