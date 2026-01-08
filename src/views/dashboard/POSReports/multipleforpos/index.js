// ** React Imports
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

const MySwal = withReactContent(Swal)
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import logo from '@src/assets/images/logo/oterra.jpg'
import ExcelJS from 'exceljs';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'


const defaultValues = {
  frmdate: ''
}

const MultipleForPOSReport = () => {

  // ** State
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const [flag1, setflag1] = useState(false)
  const [ShowDummyInvPDF, setShowDummyInvPDF] = useState(false)
  const [DummyInvURL, setDummyInvURL] = useState([])
  const [InvURL, setInvURL] = useState([])
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [isButtonClicked, setIsButtonClicked] = useState(false);
   const [posBilldata,setposBilldata] = useState();

  // ** Hooks
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
  let navigate = useNavigate();

  // AG Grid
  const [rowData, setRowData] = useState();
  const [rowData1, setRowData1] = useState();

 const [hotelName, sethotelName] = useState('');
 const [hotelAddress, sethotelAddress] = useState('');
 const [hotelNo, setHotelNo] = useState(null);
 const [hotelFax, sethotelFax] = useState(null)
 const [image, setImage] = useState(null);
 const [logoimage, setLogo] = useState(null);
  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD'))
  };

  const gridRef = useRef();



  const CustomHeaderComponentRate = () => {
    return (
      <div>
        Total Amount
      </div>
    );
  };


  const CustomHeaderComponentRate1 = () => {
    return (
      <div>
        Total Amount
      </div>
    );
  };



  function formatNumber(params) {
    var number = params.value;

    // Check if the number is undefined or not a number
    if (typeof number !== 'number' || isNaN(number)) {
      return ''; // Return empty string for undefined or non-numeric values
    }

    // If the number is valid, proceed with formatting
    var formattedNumber = Math.floor(number).toFixed(2); // Limit to 2 decimal places
    return formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }


  const [columnDefs, setColumnDefs] = useState([
 { headerName: 'Bill No Display', field: 'billNoDisplay', suppressSizeToFit: true, maxWidth: 170, rowGroup: true, hide: true },

    { headerName: 'Payment Type', field: 'paymentType', suppressSizeToFit: true, maxWidth: 170 },
    // { headerName: 'Total Amount', field: 'totalAmount', suppressSizeToFit: true, maxWidth: 170 , aggFunc: 'sum', headerComponentFramework: CustomHeaderComponentRate1, valueFormatter: formatNumber,},

    {
      headerName: 'Total Amount',
      field: 'totalAmount',
      suppressSizeToFit: true,
      maxWidth: 190,
      headerComponentFramework: CustomHeaderComponentRate,
      // aggFunc: 'sum', // Use a custom aggregation function

    },
    {
      headerName: 'Bill Date-Time  ', field: 'billDateTime', suppressSizeToFit: true, maxWidth: 170, cellRenderer: (params) => {
        // Ensure the arrivalDate field exists in the row data        
        if (params.data && params.data.billDateTime) {
          // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
          const formattedDate = Moment(params.data.billDateTime).format("DD-MM-YYYY");
          return formattedDate;
        } else {
          return ""; // Handle cases where the data is missing or invalid        
        }
      }
    },
    { headerName: 'Guest Name', field: 'guestName', suppressSizeToFit: true, maxWidth: 140 },

    { headerName: 'Order ID', field: 'orderID', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Steward Name', field: 'stewardName', suppressSizeToFit: true, maxWidth: 170 },

    { headerName: 'Table No ', field: 'tableNo', suppressSizeToFit: true, maxWidth: 190 },
    // {headerName: 'Subtotal',field: 'subTotal',suppressSizeToFit: true, maxWidth: 140 },
    // { headerName: 'Round Off', field: 'roundOff', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Bill Status', field: 'billStatus', suppressSizeToFit: true, maxWidth: 140 }
 ]);

  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      wrapText: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));

  const cellClickedListener = useCallback(event => {

  }, []);


  const onButtonExport = () => {
    const params = {
      fileName: 'Multiple Settlement POS Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };
  // const [rowData, setRowData] = useState();

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
        sethotelName(hotelName1);
        sethotelAddress(hotelAddress1);
        setHotelNo(number)
        sethotelFax(fax)
        setLogo(logo)
      })
  }, [])
  console.log(hotelName)

  console.log(hotelAddress)

  const downloadPDF = async () => {
    const columns = columnDefs.map((column) => column.headerName);
    const doc = new jsPDF({ orientation: 'landscape' });

    try {
      // Add image with increased space
      // doc.addImage(logo, 'JPEG', 143, 10, 15, 15);
      // doc.setFontSize(12);

      // const currentDate = new Date();
      // const formattedDateTime = formatDateTimeWithAMPM(currentDate);// Adjust the formatting as needed
      // doc.setFont('times', 'normal');
      // doc.text(`Report Generated Time: ${formattedDateTime}`, 230, 10, { width: 500, align: 'center' });
      // doc.addImage(logo, 'JPEG', 143, 10, 15, 15);
      // doc.setFontSize(14);
      // // doc.setFont('helvetica', 'bold');
      // doc.setFont('times', 'bold');

      // doc.text(`${hotelName}`, 140, 33);
      // doc.text(`${hotelAddress}`, 95, 39);
      // doc.text('Multiple settlement For Single Bill POS  Report', 130, 45);

      // // Adjusted startY and margin to center the table
      // let startY = 50; // Adjust as needed
      // const margin = { top: 10, right: 20, bottom: 10, left: 20 }; // Adjust as needed


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




      const textToCenter = "Multiple Settlements For Single Bill Report";

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
      const groupedRows = rowData1.reduce((acc, row) => {
        const key = row['billNoDisplay'];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(row);
        return acc;
      }, {});

      // Iterate through grouped rows and add tables for each group
      for (const billNoDisplay in groupedRows) {
        // Add text for the current group
        doc.text(`Bill No: ${billNoDisplay}`, 10, startY + 10, { width: 500, align: 'left' });
        const groupRows = groupedRows[billNoDisplay].map((row) => columnDefs.map((column) => row[column.field]));

        // Convert rows of the current group to table format
        // const groupRows = groupedRows[billNoDisplay].map((row) => {
        //   // Format the 'billdatetime' field using Moment.js
        //   const formattedBillDateTime = moment(row['billdatetime']).format('DD.MM.YYYY H:mm:ss');

        //   // Update the row with the formatted date
        //   return {
        //     ...row,
        //     billdatetime: formattedBillDateTime,
        //   };
        // });

        // Calculate the total base_amount for the current group
        const totalAmount = groupedRows[billNoDisplay].reduce(
          (total, row) => total + parseFloat(row['totalAmount'] || 0),
          0
        ).toFixed(2);

        // Add table for the current group, including the total amount row
        doc.autoTable({
          head: [columns],
          // body: [...groupRows, ['', 'Total Amount: ', totalAmount,'', '', '', ' ', ' ', ' ', ]], // Add the total amount row

          body: [...groupRows], // Add the total amount row
          startY: startY + 20,
          margin,
        });

        // Update startY for the next group
        startY = doc.autoTable.previous.finalY + 5;
      }


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
      doc.text(`Filter:`, 10, startY + 10, { width: 500, align: 'left' });
      doc.text(
        ` Date:${Moment(String(new Date(data.frmdate[0]))).format('DD.MM.YYYY')}`,
        10,
        startY + 20,
        { width: 500, align: 'left' }
      );
      // Save the PDF
      const pdfBlob = doc.output('blob');
      saveAs(pdfBlob, 'Multiple Settlements For Single Bill.pdf');
    } catch (error) {
      console.error('Error creating PDF:', error);
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






  const downloadPDF6 = async () => {
    const columns = columnDefs.map((column) => column.headerName);
    const doc = new jsPDF({ orientation: 'landscape' });

    try {
      // Add image with increased space
      doc.addImage(logo, 'JPEG', 143, 10, 15, 15);
      doc.setFontSize(12);

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString(); // Adjust the formatting as needed
      doc.text(`Date: ${formattedDate}`, 10, 40, { width: 500, align: 'left' });
      doc.addImage(logo, 'JPEG', 143, 10, 15, 15);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${hotelName}`, 140, 33);
      doc.text(`${hotelAddress}`, 95, 39);
      doc.text('Multiple POS Report', 130, 45);

      // Adjusted startY and margin to center the table
      let startY = 50; // Adjust as needed
      const margin = { top: 10, right: 20, bottom: 10, left: 20 }; // Adjust as needed

      // Combine data and remove a specific row
      const combinedData = res.data.map(item => {
        const transactions = item.transactions.map(transaction => ({
          billNoDisplay: item.billNoDisplay,
          orderID: item.orderID,
          tableNo: item.tableNo,
          stewardName: item.stewardName,
          paymentType: transaction.paymentType,
          totalAmount: transaction.Amount,
          guestName: item.guestName,
          billStatus: item.billStatus,
          billDateTime: item.billDateTime,
        }));

        return [...transactions, item];
      });

      // Remove a specific row based on a condition
      const filteredData = combinedData.filter(item => item.transactions);

      // Iterate through filtered data and add tables for each group
      filteredData.forEach((item, index) => {
        // Add text for the current item
        doc.text(`Bill No: ${item.billNoDisplay}`, 10, startY + 10, { width: 500, align: 'left' });

        // Convert rows of the current item to table format
        const itemRows = item.map((row) => columnDefs.map((column) => row[column.field]));

        // Calculate the total base_amount for the current item
        const totalAmount = item.reduce((total, row) => total + parseFloat(row['base_amount'] || 0), 0).toFixed(2);

        // Add table for the current item, including the total amount row
        doc.autoTable({
          head: [columns],
          body: [...itemRows, ['', '', '', '', '', ' ', ' ', 'Total Amount: ', totalAmount]],
          startY: startY + 20,
          margin,
        });

        // Update startY for the next item
        startY = doc.autoTable.previous.finalY + 5;
      });

      // Save the PDF
      const pdfBlob = doc.output('blob');
      saveAs(pdfBlob, 'Multiple Settlements For Single Bill.pdf');
    } catch (error) {
      console.error('Error creating PDF:', error);
    }
  };


  const [totaldata, setTotalData] = useState()

  const onSubmit = data => {
    setIsButtonClicked(true)
    setLoading(true);

    console.log("hiiiii.....................")
    setFlag(true)
    setData(data)
    let createmarketGroup = JSON.stringify({
      "hotelID": 10,
      "date": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
      //   "endDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
    })
    const filterFromDate = Moment(data.frmdate[0]).format("DD.MM.YYYY");
    setFilterFromDate(filterFromDate);
    console.log(createmarketGroup)
    if (flag1 == true) {
      let res = fetchx(DASHBOARD_URL + "/getMultipleBillSettlementPOS", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      })
      .then(data => data.json())
        //   console.log(data)
        .then((res) => {
          console.log(res.data)
       setIsButtonClicked(false)
          
          if (res['statusCode'] == 200) {
            setLoading(false);

          const combinedData = res.data.map(item => {

            const transactions = item.transactions.map(transaction => ({
              billNoDisplay: item.billNoDisplay,
              orderID: item.orderID,
              tableNo: item.tableNo,
              stewardName: item.stewardName,
              paymentType: transaction.paymentType,
              totalAmount: transaction.Amount,
              guestName: item.guestName,
              // roundOff: item.roundOff,
              billStatus: item.billStatus,
              billDateTime: item.billDateTime,
              // paymentType: transaction.paymentType,

            }));
            // item.billNoDisplay=''

            item.paymentType = 'Total'
            item.guestName = ''
            item.billStatus = ''
            item.orderID = ''
            item.billDateTime = ''
            item.tableNo = ''
            item.stewardName = ''
            setposBilldata(transactions)

            return [...transactions, item];
          });


          // console.log(item)

          // const data2= [...transactions]
          console.log(combinedData)
          const flattenedData = combinedData.flat();
          // const flattenedData = combinedData
          console.log(flattenedData);

          // setRowData1(agGridData);

          //   console.log("---------------");
          // });

          setTotalData(combinedData)
          setRowData(res["data"]);
          setRowData1(flattenedData)
          // setRowData1(res["data"])
        }

        });
    }


  }
  console.log(totaldata)


  console.log(rowData1)
  const handleReset = () => {
    reset({
      frmdate: '',
      todate: '',
    })
  }

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().
      padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const generateExcel = () => {
    if (filterFromDate) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Multiple Settlement For Single Bill POS');

        const columns = [
            { header: 'Bill No Display', key: 'billNoDisplay', width: 20 },
            { header: 'Payment Type', key: 'paymentType', width: 20 },
            { header: 'Total Amount', key: 'totalAmount', width: 15 },
            { header: 'Bill Date-Time', key: 'billDateTime', width: 20 },
            { header: 'Guest Name', key: 'guestName', width: 20 },
            { header: 'Order ID', key: 'orderID', width: 15 },
            { header: 'Steward Name', key: 'stewardName', width: 20 },
            { header: 'Table No', key: 'tableNo', width: 10 },
            { header: 'Bill Status', key: 'billStatus', width: 15 }
        ];

        worksheet.columns = columns;

        worksheet.addRow(['Report Name:', 'Multiple Settlement For Single Bill POS']);
        worksheet.addRow(['Filter From Bill Date:', filterFromDate]);    
        worksheet.addRow([]);

        worksheet.addRow(columns.map(column => column.header)).font = { bold: true };

        for (let i = 1; i <= 5; i++) {
            worksheet.getRow(i).font = { bold: true };
        }

        let formattedRows = [];
        let totalAmountSum = 0;

        posBilldata.forEach((row) => {
            let formattedRow = {
                billNoDisplay: row.billNoDisplay || '',
                paymentType: row.paymentType || '',
                totalAmount: parseFloat(row.totalAmount) || 0, // Ensure totalAmount is treated as a number
                billDateTime: row.billDateTime || '',
                guestName: row.guestName || '',
                orderID: row.orderID || '',
                stewardName: row.stewardName || '',
                tableNo: row.tableNo || '',
                billStatus: row.billStatus || ''
            };

            totalAmountSum += formattedRow.totalAmount; // Accumulate totalAmount
            formattedRows.push(formattedRow);
        });

        formattedRows.forEach((row) => {
            worksheet.addRow(row);
        });

        worksheet.addRow([]); // Add an empty row before the total row

        // Add total row for Total Amount
        worksheet.addRow(['Total', '', totalAmountSum, '', '', '', '', '', '']).font = { bold: true };

        worksheet.spliceRows(1, 1);

        worksheet.columns.forEach((column) => {
            column.alignment = { vertical: 'middle', horizontal: 'left' };
        });

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            saveAs(blob, `Multiple Settlement For Single Bill POS_${formattedDate}.xlsx`);
        }).catch((error) => {
            console.error('Error generating Excel file:', error);
        });
    }
};



  return (
    <div>
      <div>
        <Modal isOpen={ShowDummyInvPDF} toggle={() => setShowDummyInvPDF(!ShowDummyInvPDF)} style={{ height: '200px' }} className='modal-dialog-centered modal-lg'>
          <ModalHeader className='bg-transparent' toggle={() => setShowDummyInvPDF(!ShowDummyInvPDF)}>PMS Dummy Invoice</ModalHeader>

          <iframe style={{ height: '85vh' }} src={DummyInvURL}> </iframe>
        </Modal>
      </div>


      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Multiple settlement For Single Bill POS  </CardTitle>
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
          <div align="end" className="buttons">
              <Button className='me-1' color='primary' type='submit' disabled={isButtonClicked} onClick={()=>setflag1(true)}>
                            {isButtonClicked ? 'Processing...' : 'Submit'}
                            </Button>
                            {/* <Button className='me-1' color='primary' type='submit' onClick={()=>setflag1(true)}>
                Submit
              </Button> */}
              {/* <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}> Reset  </Button> */}
              {/* {flag == true &&  <Button className='me-1' color='primary' type='submit'  onClick={onButtonExport}> Download Excel </Button>} */}
              {flag == true &&<Button className='me-1' color='primary' onClick={generateExcel}>
                      Download Excel
                      </Button>}
              {flag == true && <Button className='me-1' color='primary' onClick={downloadPDF}>Print PDF </Button>}
            </div>
            </Row>
          </Form>
        </CardBody>
      </Card>
      {/* onClick={handleDownload} */}
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

      flag == true && <div className="ag-theme-alpine" >
        <AgGridReact
          ref={gridRef}
          rowData={rowData1}
          columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          // paginationPageSize= '10'
          // pagination = 'true'
          domLayout='autoHeight'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"

        />
      </div>
      )}
      {/* <App/> */}
    </div>
  )
}

export default MultipleForPOSReport