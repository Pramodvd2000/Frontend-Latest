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

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import logo from '@src/assets/images/logo/oterra.jpg'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
const MySwal = withReactContent(Swal)

const defaultValues = {
  fromdate: ''
}

const HouseUseGuestReport = () => {


  // ** State
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const [flag1, setflag1] = useState(false)
  const [open, setOpen] = useState(false);
  const [ShowDetails, setShowDetails] = useState(false)
  const [SelectedRowData,setSelectedRowData] = useState([])

  const [ShowDummyInvPDF, setShowDummyInvPDF] = useState(false)
  const [DummyInvURL, setDummyInvURL] = useState([])
  const [InvURL, setInvURL] = useState([])
  const [ErrorMessage,setErrorMessage] = useState('')
  const [showErrorMsg,setshowErrorMsg] = useState(false)
  // ** Hooks
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
  let navigate = useNavigate();

  // AG Grid
  const [rowData2, setRowData2] = useState();
  const [rowData1, setRowData1] = useState();

  const frmdate = watch('fromdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD'))
  };
  const gridRef = useRef();
  {
  }


  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'date', field: 'date', suppressSizeToFit: true, width:140 ,  valueFormatter: (params) => formatDateNew(params.value),  },

    // { headerName: 'Outlet', field: 'Outlet', suppressSizeToFit: true, width: 250 },
    // { headerName: 'Lunch', field: 'Lunch', suppressSizeToFit: true, maxWidth: 140 },
    // { headerName: 'Dinner', field: 'Dinner', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Occ Rooms', field: 'Occupancy', maxWidth: 140 },

    { headerName: 'In House Guests', field: 'GuestCnt', maxWidth: 180 },

    { headerName: 'Total Covers', field: 'Total', maxWidth: 140 },


    { headerName: 'Capture Ratio', field: 'Percentage', maxWidth: 140 },
    {
      headerName: 'Detailed View', 
      cellRendererFramework: (params) => {
        // Check if date is not 'Total'
        if (params.data.date !== 'Total') {
          return (
            <Button 
              color="primary" 
              style={{ width: 128 }} 
              onClick={() => {
                setSelectedRowData(params.data);
                GetOutletWiseCovers(params.data);
              }}
            >
              View
            </Button>
          );
        }
        return null; // Return null if the condition is not met
      },
      suppressSizeToFit: true, 
      maxWidth: 148, 
      cellStyle: { textAlign: 'center' },
      cellClass: 'vertical-center',
    }
    
   

  ]);

  const [columnDefs2, setColumnDefs2] = useState([
    // { headerName: 'date', field: 'date', suppressSizeToFit: true, width:110 ,  },

    { headerName: 'Outlet', field: 'Outlet', suppressSizeToFit: true, maxWidth: 150 },
    { headerName: 'Lunch', field: 'Lunch', suppressSizeToFit: true, maxWidth: 110 },
    { headerName: 'Lunch Ratio', field: 'LunchRatio', maxWidth: 140 },

    { headerName: 'Dinner', field: 'Dinner', suppressSizeToFit: true, maxWidth: 110 },



    { headerName: 'Dinner Ratio', field: 'DinnerRatio', maxWidth: 140 },   

  ]);
  
  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));

  const gridOptions = {
    // groupDefaultExpanded: -1, // Collapse groups by default
    autoGroupColumnDef: {
        headerName: 'Summary',
        width: 250, // Adjust this value to change the group column width
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
            suppressCount: true, // Hide the count in the group row label
            innerRenderer: (params) => {
                // Display the 'Outlet' or other first row information when the group is collapsed
                const firstRowData = params.node.allLeafChildren[0]?.data;
                return firstRowData
                    ? `${firstRowData.date}, Ratio: ${firstRowData.CaptureRatio}`
                    : params.value; // Fallback to default label if no data
            },
        }
    }
};


const GetOutletWiseCovers = (Data) =>{
  setShowDetails(true)
  fetch(DASHBOARD_URL + `/getInHouseMapPOSCoversOutletWise?hotelID=10&date=${Data.date}`)  
  .then(result => result.json())
  .then(response => {
      setRowData2(response['data'])
    
  })
}
  const cellClickedListener = useCallback(event => {
    // console.log('cellClicked', event);

  }, []);


  const onButtonExport = () => {
    const params = {
      fileName: 'Complementry/Houseuse guest Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };

  const [hotelName, sethotelName] = useState('');
  const [hotelAddress, sethotelAddress] = useState('');
  const [hotelNo, setHotelNo] = useState(null);
  const [hotelFax, sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
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

        sethotelName(hotelName1);
        sethotelAddress(hotelAddress1);
        setHotelNo(number)
        sethotelFax(fax)
        setLogo(logo)
      })

    
  }, [])

  // const getExcelFileForRes = ()=>{
  //   fetch(DASHBOARD_URL + `/getReservationWiseRevenue?hotelID=10`)
  //   .then(result => result.json())
  //   .then(response => {
  //       setRowData1(response['data'])
      
  //   })
  // }

  const getRowStyle = params => {

    if(params.data && params.data.date === 'Total'){
      return { background: '#C2C9D1' };
    }
   
    return null;
  };


  const getExcelFileForRes = (fromDate,toDate) => {
    // setOpen(true)


    fetch(DASHBOARD_URL + `/getInHouseMapPOSCovers?hotelID=10&FromDate=${fromDate}&ToDate=${toDate}`)  
        .then(result => result.json())
        .then(response => {


          // "date": "2024-11-03",
          // "Outlet": "IN HOUSE COVERS",
          // "storeID": 0,
          // "Lunch": 0,
          // "Dinner": 0,
          // "Total": 45,
          // "GuestCnt": 96,
          // "Occupancy": 89,
          // "Percentage": "46.88 %"


          const summaryRow = {
            date: 'Total',
            storeID: '',
            GuestCnt: response['data'].reduce((acc, row) => acc + (row.GuestCnt || 0), 0),
            Occupancy: response['data'].reduce((acc, row) => acc + (row.Occupancy || 0), 0),
            Total: response['data'].reduce((acc, row) => acc + (row.Total || 0), 0),
            Percentage: ((response['data'].reduce((acc, row) => acc + (row.Total || 0), 0)/response['data'].reduce((acc, row) => acc + (row.GuestCnt || 0), 0))*100).toFixed(2)+' %' // or you can calculate some overall ratio if necessary
          };



        let resp = []
        resp.push(summaryRow,...response['data'])
        console.log('Resp is',resp)
            setRowData1(resp)
          
        })
  };
  
 

  const downloadPDF = async () => {
    const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.arrivalDate)));

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
      const textToCenter = "Complementary/House Use Guest Report";

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

      // Object to store total adults for each date
      const totalAdultsByDate = {};

      const totalRoomssByDate = {};


      // Set to keep track of unique room numbers for which total adults are already calculated
      const processedRoomNumbers = new Set();

      // Iterate through each unique arrival date and generate a table
      uniqueArrivalDates.forEach((arrivalDate, index) => {
        const formattedArrivalDate = formatDate(new Date(arrivalDate));

        const rows = rowData1
          .filter((row) => row.arrivalDate === arrivalDate)
          .map((row) => {
            // Format arrivalDate and departureDate here
            const formattedArrival = formatDate(new Date(row.arrivalDate));
            const formattedDeparture = formatDate(new Date(row.departureDate));
            const isMain = row.isMain;
            // Include the formatted dates in the row
            return {
              ...row,
              arrivalDate: formattedArrival,
              departureDate: formattedDeparture,
              isMain: isMain
            };
          })
          // .map((row) => columnDefs.map((column) => row[column.field]));
          .map((row) => columnDefs.map((column) => {
            if (column.field === 'bookingID' && row.isMain === 0) {
              // Append asterisk to bookingID when isMain is 0
              return `${row.bookingID}*`;
            }
            return row[column.field];
          }));
        const columns = columnDefs.map((column) => column.headerName);

        // Calculate the total count for the current date
        const totalCount = rows.length;

        // Get the total number of adults for the current date
        let totalAdults = 0;
        // let totalRooms = 0;

        // Iterate through rows to calculate total adults only once for each room number
        for (let i = 0; i < rows.length; i++) {
          const roomNumber = rows[i][0]; // Assuming the room number is at the first position in the row

          // Check if the room number is already processed
          if (!processedRoomNumbers.has(roomNumber)) {
            // Calculate total adults and add the room number to the set
            totalAdults += rows[i][3] ? parseInt(rows[i][3]) : 0;
            processedRoomNumbers.add(roomNumber);
          }
        }

        const processedBookingIDsByDate = {};

        // Iterate through rows to calculate total count of unique booking IDs for each date
        for (let i = 0; i < rows.length; i++) {
          const date = rows[i][1]; // Assuming the date is at the second position in the row
          const bookingID = rows[i][0]; // Assuming the booking ID is at the first position in the row

          // Initialize a set for the current date if it doesn't exist
          processedBookingIDsByDate[date] = processedBookingIDsByDate[date] || new Set();

          // Check if the booking ID is already processed for the current date
          if (!processedBookingIDsByDate[date].has(bookingID)) {
            // If the booking ID is not processed for the current date, increment the count
            processedBookingIDsByDate[date].add(bookingID);
          }
        }

        // Calculate total count of unique booking IDs for each date
        const totalCountByDate = {};
        for (const date in processedBookingIDsByDate) {
          if (processedBookingIDsByDate.hasOwnProperty(date)) {
            totalCountByDate[date] = processedBookingIDsByDate[date].size;
          }
        }
        // Store the total adults count for the current date
        totalAdultsByDate[arrivalDate] = totalAdults;


        // Check available space before adding the date
        const spaceLeftForDate = doc.internal.pageSize.height - (startY + 20 + margin.bottom);
        if (spaceLeftForDate < 0) {
          doc.addPage();
          startY = margin.top;
        }
        // if (spaceLeft < 0) {
        //   doc.addPage();
        //   startY = margin.top;
        // }

        // Add table title with the arrival date and total count
        doc.setFont('times', 'bold');
        doc.text(`Date: ${formattedArrivalDate}`, 10, startY + 9, { width: 500, align: 'left' });


        const columnStyles = {
          0: { columnWidth: 18 }, // Adjust the width as needed for each column
          1: { columnWidth: 22 },
          2: { columnWidth: 20 },
          3: { columnWidth: 20 },
          4: { columnWidth: 28 },
          5: { columnWidth: 24 },
          6: { columnWidth: 28 },
          7: { columnWidth: 28 },
          8: { columnWidth: 28 },
          9: { columnWidth: 18 },
          10: { columnWidth: 21 },
        };

        const spaceLeft = doc.internal.pageSize.height - (startY + 24 + margin.bottom);

        // If the space is not enough, add a new page
        if (spaceLeft < 0) {
          doc.addPage();
          startY = margin.top;
        }

        doc.autoTable({
          head: [columns],
          body: rows,
          startY: startY + 12, // Adjust for additional space between tables
          margin,
          columnStyles,
        });



        doc.line(margin.left, doc.autoTable.previous.finalY + 2, doc.internal.pageSize.width - margin.right, doc.autoTable.previous.finalY + 2);

        // Add total count, room count, and total adults below the table
        doc.setFont('times', 'roman');
        doc.text(`Total: `, 15, doc.autoTable.previous.finalY + 10, {
          width: 500,
          align: 'center',
        });
        doc.setFont('times', 'roman');
        doc.text(`Total Count: ${totalCount}`, 260, doc.autoTable.previous.finalY + 8, {
          width: 500,
          align: 'center',
        });
        // doc.text(`${totalAdults}`, 24, doc.autoTable.previous.finalY + 10, {
        //   width: 500,
        //   align: 'left',
        // });
        // doc.text(`${totalRooms}`,24, doc.autoTable.previous.finalY + 10, { width: 500, align: 'left', });

        doc.text(`${totalAdults}`, 72, doc.autoTable.previous.finalY + 12, {
          width: 500,
          align: 'left',
        });


        // Update startY for the next table
        startY = doc.autoTable.previous.finalY + 20;
      });

      // Add filter information at the end of the PDF
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Filter:`, 10, startY + 10, { width: 500, align: 'left' });
      doc.text(`Arrival Date: From ${Moment(String(new Date(data.frmdate[0]))).format("DD.MM.YYYY")} to  ${Moment(String(new Date(data.todate[0]))).format("DD.MM.YYYY")}`, 10, startY + 20, { width: 500, align: 'left' });

      for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
        doc.setPage(i); // Set the active page
        doc.setFontSize(10); // Set font size for page number

        const pageNumber = `Page ${i} of ${doc.internal.getNumberOfPages()}`;
        const pageNumberWidth = doc.getStringUnitWidth(pageNumber) * doc.internal.getFontSize() / doc.internal.scaleFactor;

        // Calculate position for center alignment
        const pageCenter = doc.internal.pageSize.width / 2;
        const xPos = pageCenter - (pageNumberWidth / 2);
        const yPos = doc.internal.pageSize.height - 10; // 10 units from the bottom

        doc.text(pageNumber, xPos, yPos);
      }

      const pdfBlob = doc.output('blob');
      saveAs(pdfBlob, 'Complementary_House_Use_Report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const formatDateNew = (dateString) => {
    if (dateString === 'Total') return dateString;  // Return 'Total' as-is
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const weekday = date.toLocaleString('en-US', { weekday: 'short' });
    
    return `${day} ${month}, ${weekday}`;
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






  const onSubmit = data => {
    setFlag(true)
    setData(data)

    getExcelFileForRes((Moment(String(new Date(data.fromdate))).format('YYYY-MM-DD')),(Moment(String(new Date(data.todate))).format('YYYY-MM-DD')))
  }


  const handleReset = () => {
    reset({
      formdate: '',
      todate: '',
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
    <div>
    <CardTitle tag='h4'>In House Capture Ratio                          </CardTitle>
    <div>
    <p style={{ marginBottom: '-20px',marginTop:'5px' }}> NOTE : Occ Rooms and In House Guests does not include HOUSE USE and COMPLIMENTARY Rooms</p>
    </div>
    </div>
  </CardHeader>
  <CardBody>
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="align-items-end">
        <Col md="3" sm="12">
          <div className="mb-1">
            <Label className="form-label" for="fromdate"><b>
              From Date
              </b></Label>
            <Controller
              control={control}
              id="fromdate"
              name="fromdate"
              render={({ field }) => (
                <Flatpickr
                  {...field}
                  options={{ allowInput: true }}
                  placeholder="YYYY-MM-DD "
                  className="form-control"
                />
              )}
            />
          </div>
        </Col>
        <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="todate"><b>
                    To Date
                  </b></Label>
                  <Controller
                    control={control}
                    id="todate"
                    name="todate"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        options={optionsToDate}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                        })}
                      />
                    )}
                  />
                </div>
              </Col>
        <Col md="auto" className="d-flex" style = {{paddingBottom:'15px' , paddingLeft:'40px'}}>
          <Button color="primary">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  </CardBody> 
</Card>

      {flag == true && <div className="ag-theme-alpine" style={{width:'65%'}}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData1}
          columnDefs={columnDefs}
          getRowStyle={getRowStyle}

          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          // gridOptions={gridOptions}

          // paginationPageSize='10'
          // pagination='true'
          domLayout='autoHeight'

          defaultColDef={defaultColDef}
          headerColor="ddw-primary"

        />
      </div>}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                      Please wait while we are fetching the data
                    </h1>
                    
                      <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                        We're processing your request, which may take a little longer due to additional data. Please be patient!
                      </h1>
                    
                    <CircularProgress color="inherit" />
                  </div>
                </Backdrop>
      {/* <App/> */}

      {/* Show Error message */}

      <Modal
        isOpen={showErrorMsg}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent' toggle={() => {
                setshowErrorMsg(!showErrorMsg);
              }}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h3 className='text-center mb-1'>{ErrorMessage}</h3>
         
            <Row>
            <Col className='text-center mt-1' xs={12}>
            
              <Button
               color='primary'
                onClick={() => {
                // window.location.reload()
                setshowErrorMsg(!showErrorMsg)
              }}
              >
                OK
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>  


      <Modal
        isOpen={ShowDetails}
        // toggle={() => setShow(!show)}
        className='modal-lg'
      >
        <ModalHeader className="modal-lg" toggle={() => {
                setShowDetails(!ShowDetails);
              }}>Detailed View</ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          {/* <h3 className='text-center mb-1'>Detailed View Of the date {SelectedRowData['date']} with Occupancy {SelectedRowData.Occupancy} and Ratio {SelectedRowData.Percentage}</h3> */}
          <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
  <div style={{ flex: 1 }}>
    <h6><b>Date: {SelectedRowData['date']}</b></h6>
  </div>
  <div style={{ flex: 1 }}>
    <h6><b>In House Guests: {SelectedRowData.GuestCnt}</b></h6>
  </div>
  <div style={{ flex: 1 }}>
    <h6><b>Ratio: {SelectedRowData.Percentage}</b></h6>
  </div>
</div>
<div className="ag-theme-alpine" >
          <AgGridReact
          // ref={gridRef}
          rowData={rowData2}
          columnDefs={columnDefs2}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
         
          domLayout='autoHeight'
          headerColor="ddw-primary"

        />

</div>
        </ModalBody>
      </Modal>  
    </div>
  )
}

export default HouseUseGuestReport