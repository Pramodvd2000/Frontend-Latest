// ** React Imports
import { useState } from 'react'
import Select from "react-select";

import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input, InputGroup, InputGroupText, Table, Modal, ModalBody, ModalHeader } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { AgGridReact } from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import { useNavigate } from 'react-router-dom';
import 'ag-grid-enterprise';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import logo from '@src/assets/images/logo/oterra.jpg'
// ** Utils
import { selectThemeColors } from "@utils";
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// import { DisabledByDefault } from '@mui/icons-material';
// import Papa from 'papaparse';

const MySwal = withReactContent(Swal)

const defaultValues = {
  frmdate: ''
}



const ForexReport = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [rowData1, setRowData1] = useState();
  const [flag, setFlag] = useState(false)
  //  const [flag, setFlag] = useState(false)
  const [flag1, setflag1] = useState(false)

  // ** State
  const [data, setData] = useState(null)
  const [storeOptions, setStoreOptions] = useState([]);
  const [coversData, setCoversData] = useState([])
  const [ShowDummyInvPDF, setShowDummyInvPDF] = useState(false)
  const [DummyInvURL, setDummyInvURL] = useState([])
  const [InvURL, setInvURL] = useState([])
  const [currencies, setCurrencies] = useState()
  const [date, setDate] = useState()
  const [daytotal, setdayTotal] = useState()
  const [grandtotal, setGrandTotal] = useState()

  const [hotelName, sethotelName] = useState('');
  const [hotelAddress, sethotelAddress] = useState('');
  const [hotelNo, setHotelNo] = useState(null);
  const [hotelFax, sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  // ** Hooks
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  let navigate = useNavigate();

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


  function formatNumber(params) {
    const formattedNumber = Number(params.value).toLocaleString('en-IN');
    return formattedNumber;
  }

  const [columnDefs, setColumnDefs] = useState([


    { headerName: 'Date', field: 'date', rowGroup: true, hide: true, maxWidth: 140, },
    { headerName: 'Currency Code', field: 'currencyCode', rowGroup: true, maxWidth: 170 },
    { headerName: 'Currency Name', field: 'currencyName', maxWidth: 170 },
    // ... Add other columns as needed
    { headerName: 'Booking ID', field: 'bookingID', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Room No ', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Certi.No', field: 'certificateNo', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Guest Name', field: 'GuestName', suppressSizeToFit: true, maxWidth: 180 },

    { headerName: 'discription', field: 'Discription', suppressSizeToFit: true, maxWidth: 140 },
    {
      headerName: 'Amount Currency',
      field: 'Amountcurrency',
      suppressSizeToFit: true,
      maxWidth: 180,
      // agg:"sum",
      valueFormatter: params => {
        // Check if params.value is defined before using toFixed
        if (typeof params.value === 'number') {
          return params.value.toFixed(2);
        } else {
          return ''; // or any default value you prefer for undefined/null values
        }
      },
    }

    ,
    { headerName: 'Rate Of The Day', field: 'RateOfTheDay', suppressSizeToFit: true, maxWidth: 180 },
    {
      headerName: 'Amount', field: 'Amount', suppressSizeToFit: true, maxWidth: 140,
      valueFormatter: params => {
        // Check if params.value is defined before using toFixed
        if (typeof params.value === 'number') {
          return params.value.toFixed(2);
        } else {
          return ''; // or any default value you prefer for undefined/null values
        }
      }
    },
    {
      headerName: 'CGST', field: 'CGST', suppressSizeToFit: true, maxWidth: 140,
      valueFormatter: params => {
        // Check if params.value is defined before using toFixed
        if (typeof params.value === 'number') {
          return params.value.toFixed(2);
        } else {
          return ''; // or any default value you prefer for undefined/null values
        }
      }
    },
    {
      headerName: 'SGST', field: 'SGST', suppressSizeToFit: true, maxWidth: 140,
      valueFormatter: params => {
        // Check if params.value is defined before using toFixed
        if (typeof params.value === 'number') {
          return params.value.toFixed(2);
        } else {
          return ''; // or any default value you prefer for undefined/null values
        }
      }
    },
    {
      headerName: 'Total', field: 'total', suppressSizeToFit: true, maxWidth: 140,
      valueFormatter: params => {
        // Check if params.value is defined before using toFixed
        if (typeof params.value === 'number') {
          return params.value.toFixed(2);
        } else {
          return ''; // or any default value you prefer for undefined/null values
        }
      }
    },
  ]);

  const onButtonExport = () => {
    const params = {
      fileName: 'Forex Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };



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
        console.log(logo)
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


  const downloadPDF = async () => {
    let fromDate = Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD");
    let toDate = Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD");

    const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.date)));

    const doc = new jsPDF({ orientation: 'landscape' });
    const pageCenter = doc.internal.pageSize.width / 2;

    try {
      let filterText = ''; // Variable to store filter information
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
      const textToCenter = "Forex Report";

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
      // uniqueArrivalDatesAndCurrencies.forEach(([date, currencyName]) => {

      uniqueArrivalDates.forEach((date, index) => {
        const formattedArrivalDate = date ? formatDate(new Date(date)) : ''

        const rows = rowData1
          .filter((row) => row.date === date)
          // .filter((row) => row.date === date && row.currencyName === currencyName)

          .map((row) => {
            const formattedArrival = row.date ? formatDate(new Date(row.date)) : ''

            return {
              ...row,
              date: formattedArrival,
            };
          })
          .map((row) => columnDefs.map((column) => row[column.field]));
        const columns = columnDefs.map((column) => column.headerName);

        if (rows.length === 0) {
          return;
        }

        const totalCount = rows.length;

        doc.setFont('times', 'bold');

        if (formattedArrivalDate) {
          doc.text(`Date: ${formattedArrivalDate}`, 10, startY + 8, { width: 500, align: 'left' });
        }

        const spaceLeft = doc.internal.pageSize.height - (startY + 20 + margin.bottom);

        // If the space is not enough, add a new page
        if (spaceLeft < 0) {
          doc.addPage();
          startY = margin.top;
        }

        const columnsToFormat = [8, 10, 11, 12, 13];

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
          head: [columns],
          body: rows,
          startY: startY + 12,
          margin,
        });

        doc.line(margin.left, doc.autoTable.previous.finalY + 2, doc.internal.pageSize.width - margin.right, doc.autoTable.previous.finalY + 2);

        doc.setFont('times', 'roman');
        doc.text(`Total Count: ${totalCount}`, 255, doc.autoTable.previous.finalY + 10, { width: 500, align: 'left' });
        doc.setFont('times', 'normal');

        startY = doc.autoTable.previous.finalY + 20;

        const availableSpace = doc.internal.pageSize.height - startY;
        if (availableSpace < 30) {
          doc.addPage();
          startY = 10;
        }

        if (index === uniqueArrivalDates.length - 1) {
          if (fromDate && toDate) {
            const fromDateNew = Moment(new Date(fromDate)).format("DD.MM.YYYY");
            const toDateNew = Moment(new Date(toDate)).format("DD.MM.YYYY");
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Filter:`, 20, startY + 10, { width: 500, align: 'left' });
            doc.text(`Date: From ${Moment(new Date(fromDate)).format("DD.MM.YYYY")} To ${Moment(new Date(toDate)).format("DD.MM.YYYY")}`, 20, startY + 20, { width: 500, align: 'left' });
            doc.setFont('times', 'normal'); // Reset font style to normal for subsequent text
          }
        }
      });

      for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
        doc.setPage(i); // Set the active page
        doc.setFontSize(10); // Set font size for page number

        const pageNumber = `Page ${i} of ${doc.internal.getNumberOfPages()}`;
        const pageNumberWidth = doc.getStringUnitWidth(pageNumber) * doc.internal.getFontSize() / doc.internal.scaleFactor;

        // Calculate position for center alignment
        const xPos = pageCenter - (pageNumberWidth / 2);
        const yPos = doc.internal.pageSize.height - 10; // 10 units from the bottom

        doc.text(pageNumber, xPos, yPos);
      }

      // Save the PDF
      const pdfBlob = doc.output('blob');
      saveAs(pdfBlob, 'Forex Report.pdf');
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
  const cellClickedListener = useCallback(event => {
  }, []);




  const onSubmit = data => {
    setFlag(true)
    setData(data)
    let createmarketGroup = JSON.stringify({
      "startDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
      "endDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD"),
      "hotelID": 1,

    })

    if (flag1 == true) {
      let res = fetchx(DASHBOARD_URL + "/getForexReportDetails", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(data => data.json())
        .then((res) => {

          // Assuming res is your response object
          const forexDetails = res.data.forexDetails;
          const currencies = res.data.forexDetails.map(detail => detail.currencies).flat();
          const entries = currencies.map(currency => currency.entries).flat()
          const totals = currencies.map(Total => Total.totals).flat()
          const dayTotal = forexDetails.map(entry => entry.dayTotal).flat()
          const grandTotal = res.data.grandTotal


          setRowData1(entries);
          setCurrencies(currencies)
          setDate(forexDetails)
          setdayTotal(dayTotal)
          setGrandTotal(grandTotal)

          const totalrowData = res.data.forexDetails.flatMap(date => {
            // Assuming date.date is a JavaScript Date object

            const currencyEntries = date.currencies.flatMap(currency => {
              const entryDetails = currency.entries.map(entry => {
                return {
                  date: date.date,
                  currencyCode: currency.currencyCode,
                  currencyName: currency.currencyName,
                  bookingID: entry.bookingID,
                  roomNumber: entry.roomNumber,
                  certificateNo: entry.certificateNo,
                  GuestName: entry.GuestName,
                  Discription: entry.Discription,
                  Amountcurrency: parseFloat(entry.Amountcurrency),
                  RateOfTheDay: entry.RateOfTheDay,
                  Amount: parseFloat(entry.Amount),
                  CGST: parseFloat(entry.CGST),
                  SGST: parseFloat(entry.SGST),
                  total: parseFloat(entry.total),
                };
              });

              // Include currency totals
              const currencyTotals = {
                date: date.date,
                // date:  `${currency.currencyCode} Total`,

                currencyCode: `${currency.currencyCode} Total`,
                // currencyCode: '',

                currencyName: '',
                bookingID: '',
                roomNumber: '',
                certificateNo: '',
                GuestName: '',
                Discription: '',
                Amountcurrency: currency.totals.Amountcurrency,
                RateOfTheDay: '',
                Amount: currency.totals.Amount,
                CGST: currency.totals.CGST,
                SGST: currency.totals.SGST,
                total: currency.totals.total,
              };

              return [...entryDetails, currencyTotals];
            });

            // // Include dayTotal in currencyEntries
            const dayTotalEntry = {
              date: date.date,
              currencyCode: 'Day Total',
              currencyName: '',
              bookingID: '',
              roomNumber: '',
              certificateNo: '',
              GuestName: '',
              Discription: '',
              Amountcurrency: date.dayTotal.Amountcurrency,
              RateOfTheDay: '',
              Amount: date.dayTotal.Amount,
              CGST: date.dayTotal.CGST,
              SGST: date.dayTotal.SGST,
              total: date.dayTotal.total,
            };

            // return [...currencyEntries];
            return [...currencyEntries, dayTotalEntry];

          });

          // Include grandTotal in totalrowData
          // Include grandTotal in totalrowData
          const grandTotalEntry = {
            date: '',
            currencyCode: 'Grand Total',
            currencyName: '',
            bookingID: '',
            roomNumber: '',
            certificateNo: '',
            GuestName: '',
            Discription: '',
            Amountcurrency: res.data.grandTotal.Amountcurrency,
            RateOfTheDay: '',
            Amount: res.data.grandTotal.Amount,
            CGST: res.data.grandTotal.CGST,
            SGST: res.data.grandTotal.SGST,
            total: res.data.grandTotal.total,
          };

          totalrowData.push(grandTotalEntry);



          // Set the formatted data as the rowData for Ag-Grid
          setRowData1(totalrowData)

        });
    }

  }


  const handleReset = () => {
    reset({

      block: ''
    })
  }



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
          <CardTitle tag='h4'>Forex Report</CardTitle>
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
                <Button className='me-1 ms-auto' color='primary' type='submit' onClick={() => setflag1(true)}>
                  Submit
                </Button>
                <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                  Reset
                </Button>

                <Button className='me-1' color='primary' type='submit' onClick={onButtonExport}>
                  Download Excel
                </Button>

                <Button className='me-1' color='primary' type='submit' onClick={downloadPDF}>
                  Print PDF
                </Button>

              </div>
            </Row>
          </Form>
        </CardBody>
      </Card>

      {flag == true && <div className="ag-theme-alpine" style={{ height: 520 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData1}
          columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          // paginationPageSize='10'
          // pagination='true'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
          // gridOptions={gridOptions}
          groupAllowUnbalanced="true"


        />
      </div>}
    </div>
  )
}


export default ForexReport;