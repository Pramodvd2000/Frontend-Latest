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



const CancelBillReport = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [rowData1, setRowData1] = useState();
  const [flag, setFlag] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);


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
        Amount
      </div>
    );
  };
  const CustomHeaderComponentTax = () => {
    return (
      <div>
        Tax/SC
      </div>
    );
  };
  const CustomHeaderComponentRoundoff = () => {
    return (
      <div>
        Roundoff
      </div>
    );
  };
  const CustomHeaderComponentDisc = () => {
    return (
      <div>
        Discount
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

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Resturant', field: 'restaurantName', suppressSizeToFit: true, maxWidth: 200, rowGroup: true },
    { headerName: 'BillNo', field: 'billNoDisplay', suppressSizeToFit: true, maxWidth: 200 },
    { headerName: 'Table/Room', field: 'TableNo', suppressSizeToFit: true, maxWidth: 140 },
    // { headerName: 'Bill Date', field: 'BillDate', suppressSizeToFit: true, maxWidth: 200 },
    {
      headerName: 'Bill Date  ', field: 'BillDate', suppressSizeToFit: true, maxWidth: 170, cellRenderer: (params) => {
        if (params.data && params.data.BillDate) {
          const formattedDate = Moment(params.data.BillDate).format("DD-MM-YYYY");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    { headerName: 'Amount', field: 'Amount', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentAmount },
    { headerName: 'Tax Amount', field: 'TaxAmount', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTax },
    { headerName: 'Discount', field: 'Discount', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentDisc },
    { headerName: 'Round off', field: 'RoundOff', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentRoundoff },
    { headerName: 'Total Amt', field: 'TotalAmount', suppressSizeToFit: true, maxWidth: 140, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTotalamount },
    { headerName: 'User Id', field: 'UserId', suppressSizeToFit: true, maxWidth: 120 },
    { headerName: 'Reason', field: 'Reason', suppressSizeToFit: true, maxWidth: 120 },
    { headerName: 'Remarks', field: 'Remarks', suppressSizeToFit: true, maxWidth: 120 },
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
  const [storeOptions, setStoreOptions] = useState([]);
  const [cancelBillData, setCancelBilltData] = useState([])
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [filterResturant, setfilterResturant] = useState(null);
  const [hotelName, sethotelName] = useState('');
  const [hotelAddress, sethotelAddress] = useState('');
  const [hotelNo, setHotelNo] = useState(null);
  const [hotelFax, sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [loading, setLoading] = useState(false); 



  // ** Hooks
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  let navigate = useNavigate();


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
      setLoading(true);
      setIsButtonClicked(true)
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


    let res = fetchx(DASHBOARD_URL + "/getCancelBillReport", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then(data => data.json())
      .then((res) => {
              setIsButtonClicked(false)
        if (res['statusCode'] === 200) {
                  setLoading(false);
          const formattedData = res.data.cancelledBillData.flatMap((restaurant) => {
            const restaurantData = restaurant.BillData.map((bill) => ({
              restaurantName: restaurant.restaurantName,
              billNoDisplay: bill.BillNo,
              TableNo: bill.TableNo,
              BillDate: Moment(bill.BillDate).format('YYYY-MM-DD HH:mm:ss'),
              Amount: bill.Amount,
              TaxAmount: bill.TaxAmount,
              Discount: bill.Discount,
              RoundOff: bill.RoundOff,
              TotalAmount: bill.TotalAmount,
              UserId: bill.UserId,
              Reason: bill.Reason,
              Remarks: "",
            }));
            return restaurantData;
          });

          setRowData(formattedData);
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
      fileName: "CancelledBill_Report.xlsx",
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
        const xLogo = 10; // X-coordinate for the logo
        const yLogo = 10;
        // Calculate center for the logo
        const pageWidth = pdf.internal.pageSize.getWidth();
        const logoWidth = 15;
        const xCenter = (pageWidth - logoWidth) / 2;
        let dateY = 20;

        // Add logo
        const logoHeight = 15;
        pdf.addImage(DASHBOARD_URL+`/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

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




        const textToCenter = "Cancel Bill Report";

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

        const billDateTimeIndex = 4;

        if (billDateTimeIndex !== -1) {
          // Format billDateTime column in rows
          rows.forEach(row => {
            const billDateTimeValue = new Date(row[billDateTimeIndex]);
            row[billDateTimeIndex] = formatDate(billDateTimeValue);
          });
        }
        const columnsToFormat = [5, 6, 7, 8, 9];

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
          // columnStyles

        });
        dateY = pdf.autoTable.previous.finalY + 20;

        pdf.text(`Filter From Bill Date: ${filterFromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
        pdf.text(`To Bill Date: ${filterToDate}`, 10, dateY + 20, { width: 500, align: 'left' });
        pdf.save('Cancelled Bill Report.pdf');
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
      const worksheet = workbook.addWorksheet('Cancel Bill Report');
  
      const columns = [
        { header: 'Resturant', key: 'restaurantName', width: 20 },
        { header: 'BillNo', key: 'billNoDisplay', width: 25 },
        { header: 'Table/Room', key: 'TableNo', width: 20 },
        { header: 'Bill Date', key: 'BillDate', width: 20 },
        { header: 'Amount', key: 'Amount', width: 15 },
        { header: 'Tax Amount', key: 'TaxAmount', width: 15 },
        { header: 'Discount', key: 'Discount', width: 15 },
        { header: 'Round off', key: 'RoundOff', width: 15 },
        { header: 'Total Amt', key: 'TotalAmount', width: 20 },
        { header: 'User Id', key: 'UserId', width: 15 },
        { header: 'Reason', key: 'Reason', width: 20 },
        { header: 'Remarks', key: 'Remarks', width: 30 }
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'Cancel Bill REPORT']);
      worksheet.addRow(['Filter From Bill Date:', filterFromDate]);
      worksheet.addRow(['To Date:', filterToDate]);
  
      let selectedFilterResturant = filterResturant && filterResturant.length !== 0
        ? filterResturant.toString()
        : 'All';
        
      worksheet.addRow(['Filter Resturants:', selectedFilterResturant]);
      worksheet.addRow([]);
      worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
      worksheet.getRow(1).font = { bold: true }; 
      worksheet.getRow(2).font = { bold: true }; 
      worksheet.getRow(3).font = { bold: true }; 
      worksheet.getRow(4).font = { bold: true };
      worksheet.getRow(5).font = { bold: true };
  
      worksheet.getColumn(9).alignment = { vertical: 'middle', horizontal: 'right' };
  
      rowData.sort((a, b) => a.storeID - b.storeID);
  
      // Add sorted data to worksheet
      rowData.forEach((row) => {
        worksheet.addRow(row);
      });
  
      worksheet.spliceRows(1, 1);
      worksheet.addRow([]);
      worksheet.addRow([]);
      // Calculate totals
      const totalRow = {
        restaurantName: 'Total',
        Amount: rowData.reduce((sum, row) => sum + row.Amount, 0),
        TaxAmount: rowData.reduce((sum, row) => sum + row.TaxAmount, 0),
        Discount: rowData.reduce((sum, row) => sum + row.Discount, 0),
        RoundOff: rowData.reduce((sum, row) => sum + row.RoundOff, 0),
        TotalAmount: rowData.reduce((sum, row) => sum + row.TotalAmount, 0)
      };
  
      worksheet.addRow(totalRow);
      worksheet.getRow(worksheet.lastRow._number).font = { bold: true }; // Bold for the total row
  
      worksheet.columns.forEach((column, index) => {
        if (index !== 4 && index !== 5 && index !== 6 && index !== 7 && index !== 8) {
          column.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Cancel_Bill_Report_${formattedDate}.xlsx`); // Updated report name
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };
  
  

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>Cancel Bill Report</CardTitle>
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
                                    <Button
                                        className='me-1'
                                        color='primary'
                                        onClick={generateExcel}
                                    >
                                        Download Excel
                                    </Button>
                                    <Button className='me-1' color='primary'  onClick={printGrid}>
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

export default CancelBillReport