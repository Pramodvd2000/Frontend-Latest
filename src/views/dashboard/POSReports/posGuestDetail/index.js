
// ** React Imports
import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input, InputGroup, InputGroupText } from 'reactstrap'
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
import 'ag-grid-enterprise';
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'

const defaultValues = {
  frmdate: ''
}

let optionsStatus = [
  { value: 'Checked In', label: 'Checked In' },
  { value: 'Due Out', label: 'Due Out' },
  { value: 'Due In', label: 'Due In' },
]

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const PosGuestDetail = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [rowData1, setRowData1] = useState([]);
  const gridRef = useRef();
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD'))
  };
  const [flag1, setflag1] = useState(false)

  const [hotelName, sethotelName] = useState('');
  const [hotelAddress, sethotelAddress] = useState('');
  const [hotelNo, setHotelNo] = useState(null);
  const [hotelFax, sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [storeNames, setStoreOptions] = useState();
  const [dateOption, setDateOption] = useState();
  const [floorOptions, setFloorOptions] = useState([]);
  const [filterResturant, setfilterResturant] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [isButtonClicked, setIsButtonClicked] = useState(false);


  //API to get hotel details
  useEffect(() => {

    fetchx(DASHBOARD_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
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
    fetchx(DASHBOARD_URL + '/getStoreList?hotelID=10')
      .then(result => result.json())
      .then(resp => {
        const responseData = resp['data'];
        setFloorOptions(responseData);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });




  }, [])

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Bill No. Display.', field: 'billNoDisplay', suppressSizeToFit: true, width: 180 },
    { headerName: 'Guest Name ', field: 'guestName', suppressSizeToFit: true, width: 270, wrapText: true, autoHeight: true, },
    { headerName: 'Bill DateTime', field: 'billDateTime', suppressSizeToFit: true, width: 270, wrapText: true, autoHeight: true },
    { headerName: 'RestaurantName.', field: 'restaurantName', suppressSizeToFit: true, width: 180, wrapText: true, autoHeight: true, },
    { headerName: 'Guest Company GST No.', field: 'guestCompanyGSTno', suppressSizeToFit: true, width: 270, wrapText: true, autoHeight: true, },
    { headerName: 'MobileNo', field: 'mobileNo', suppressSizeToFit: true, width: 270, wrapText: true, autoHeight: true },
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


  // error handling for same guest addition
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

  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [filterFloor, setFilterFloor] = useState(null);
  const onSubmit = (data) => {
  setIsButtonClicked(true)
  setLoading(true);
  setFlag(true);
  const FloorID = Array.isArray(data.floorID)
  ? data.floorID.map((item) => item.value)
  : [];
  const filterFloor = FloorID != null ? JSON.stringify(FloorID) : null;
  const storeName = Array.isArray(data.FloorID)
  ? data.FloorID.map((item) => item.label)
  : [];
  const selectedResturants = data.floorID && data.floorID.map(item => item.label);
    setfilterResturant(selectedResturants)
    const filterFromDate = Moment(data.frmdate[0]).format("DD.MM.YYYY");
    setFilterFloor(filterFloor);
    setFilterFromDate(filterFromDate);
    setStoreOptions(storeName)
    // setFilterToDate(filterToDate);
    setData(data);
    const createmarketGroup = JSON.stringify({
      hotelID: 1,
      date: Moment(data.frmdate[0]).format("YYYY-MM-DD"),
      storeID: FloorID != null ? JSON.stringify(FloorID) : null,

    });

    fetchx(DASHBOARD_URL + "/getPOSGuestDetailsReport", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup,
    })
      .then((data) => data.json())
      .then((res) => {
        setIsButtonClicked(false)
        if (res['statuscode'] == 200) {
          setLoading(false)
        console.log(createmarketGroup)

        console.log(res["data"])
        setRowData1(res["data"]);
        }
        // printGrid(filterFromDate, filterToDate); // Pass values to printGrid function
      });

  };


  const onBtnExport = () => {
    const params = {
      fileName: 'POS Guest Report.xlsx',
      sheetName: 'Sheet1',
    };
    gridRef.current.api.exportDataAsExcel(params);
  };

  const printGrid = () => {

    const gridApi = gridRef.current && gridRef.current.api;
    const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.arrivalDate)));

    if (gridApi) {
      const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
      const headerRow = rowData.substring(0, rowData.indexOf('\n'));
      const cleanHeaderRow = headerRow.replace(/"/g, '');
      const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
      const cleanData = dataRows.replace(/"/g, '');
      const rows = cleanData.split('\n').map(row => row.split(','));
      const pdf = new jsPDF({ orientation: 'landscape' });

      const xLogo = 10; // X-coordinate for the logo
      const yLogo = 10; // Y-coordinate for the logo
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

      const textToCenter = "POS Guest Details Report";

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
        .forEach((arrivalDate, index) => {
          const rowsForDate = rowData1
            .filter((row) => row.arrivalDate === arrivalDate)
            .map((row) => {
              const formattedArrival = formatDate(new Date(row.arrivalDate));
              const formattedDeparture = formatDate(new Date(row.departureDate));
              const formattedDob = formatDate(new Date(row.dob));

              return {
                ...row,
                arrivalDate: formattedArrival,
                departureDate: formattedDeparture,
                dob: formattedDob,
              };
            })
            .map((row) => columnDefs.map((column) => row[column.field]));

          const columns = columnDefs.map((column) => column.headerName);
          // Calculate the height of the table content
          const tableHeight = 8;

          // Check if the content fits on the current page
          if (dateY + tableHeight > pdf.internal.pageSize.height - 20) {
            // Move to the next page if the content exceeds the page height
            pdf.addPage();
            dateY = 10; // Reset the Y position for the new page
            currentPage++; // Increment the current page number
          }

          const totalCount = rowsForDate.length;
          pdf.setFont('times', 'bold');
          const formattedArrivalDate = formatDate(new Date(arrivalDate));


          // pdf.text(`Date: ${formattedArrivalDate}`, 10, dateY + 37, { width: 500, align: 'left' });
          pdf.autoTable({
            head: [columns],
            body: rowsForDate,
            startY: dateY + 20,
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


        pdf.text(`Filter From Date: ${filterFromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
      }
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
      pdf.save('POS Guest Details Report.pdf');
    } else {
    }


  };

  const generateExcel = () => {
    if (filterFromDate) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('POS Guest Details Report'); // Updated report name

        // Updated columns as per the new headers and keys
        const columns = [
            { header: 'Bill No. Display', key: 'billNoDisplay', width: 20 },
            { header: 'Guest Name', key: 'guestName', width: 20 },
            { header: 'Bill DateTime', key: 'billDateTime', width: 20 },
            { header: 'RestaurantName', key: 'restaurantName', width: 20 },
            { header: 'Guest Company GST No.', key: 'guestCompanyGSTno', width: 25 },
            { header: 'MobileNo', key: 'mobileNo', width: 15 }
        ];

        worksheet.columns = columns;

        // Update report name and other static details
        worksheet.addRow(['Report Name:', 'POS Guest Details Report']);
        worksheet.addRow(['Filter From Bill Date:', filterFromDate]);

        let selectedFilterRestaurant = filterResturant && filterResturant.length !== 0
            ? filterResturant.toString()
            : 'All';
    
        worksheet.addRow(['Filter Restaurants:', selectedFilterRestaurant]);

        worksheet.addRow([]);

        // Add header row with updated columns
        worksheet.addRow(columns.map(column => column.header)).font = { bold: true };

        // Make specific rows bold
        for (let i = 1; i <= 5; i++) {
            worksheet.getRow(i).font = { bold: true };
        }

        // Process and format rowData
        let formattedRows = [];

        rowData1.forEach((row) => {
            let formattedRow = {
                billNoDisplay: row.billNoDisplay || '',
                guestName: row.guestName || '',
                billDateTime: row.billDateTime || '',
                restaurantName: row.restaurantName || '',
                guestCompanyGSTno: row.guestCompanyGSTno || '',
                mobileNo: row.mobileNo || ''
            };
            formattedRows.push(formattedRow);
        });

        formattedRows.forEach((row) => {
            worksheet.addRow(row);
        });

        worksheet.spliceRows(1, 1);

        // Adjust alignment for columns
        worksheet.columns.forEach((column, index) => {
          column.alignment = { vertical: 'middle', horizontal: 'left' };
        });

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        // Generate Excel file and prompt download
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            // saveAs(blob, 'POS Guest Details Report.xlsx'); // Updated filename
            saveAs(blob, `POS Guest Details Report_${formattedDate}.xlsx`);

        }).catch((error) => {
            console.error('Error generating Excel file:', error);
        });
    }
};


  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>POS Guest Details Report</CardTitle>
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
                        // options={{ }}
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
                  <Label className="form-label" for="floorID">
                    Store
                  </Label>
                  <Controller
                    id="floorID"
                    control={control}
                    name="floorID"
                    render={({ field }) => (
                      <Select
                        isMulti
                        isClearable
                        options={floorOptions}
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
            <div align="end" className="buttons">
            <Button className='me-1' color='primary' type='submit' disabled={isButtonClicked}>
                            {isButtonClicked ? 'Processing...' : 'Submit'}
                            </Button>
              {/* <Button className='me-1' color='primary' onClick={onBtnExport}> Download Excel </Button> */}
              <Button className='me-1' color='primary'  onClick={generateExcel}>
                      Download Excel
                      </Button>
              <Button className='me-1' color='primary' onClick={printGrid}>Print PDF </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
      <br />

      <br />
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
      flag == true && 
      <div className="ag-theme-alpine" >
        <AgGridReact
          ref={gridRef}
          rowData={rowData1}
          columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          defaultColDef={defaultColDef}
          
          headerColor="ddw-primary"
          domLayout='autoHeight'

        />
      </div>
        )
       } 
    </div>
  )
}

export default PosGuestDetail