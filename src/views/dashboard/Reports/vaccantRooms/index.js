import { useState } from 'react'
import { selectThemeColors } from "@utils";
import Select from "react-select";
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import {AgGridReact} from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import { useRef, useEffect, useMemo, useCallback} from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import 'ag-grid-enterprise';
import Moment from 'moment';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { SetFilter } from 'ag-grid-enterprise';

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const defaultValues = { 
    frmdate: ''
}

const VaccantRooms = () => {
  const [rowData1, setRowData1] = useState();
  const [floorOptions, setFloorOptions] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [data, setData] = useState(null)
  const [hotelDetails, setHotelDetails] = useState()
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [filterFloor,setFilterFloor] = useState([])


  const { reset, handleSubmit, control } = useForm({ defaultValues })
  let navigate = useNavigate();  
  const gridRef = useRef();
  const [columnDefs, setColumnDefs] = useState([
    {headerName: 'Floor',field: 'floorID',suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'Room Number',field: 'roomNumber',suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'Room Type',field: 'roomType',suppressSizeToFit: true, maxWidth: 160 },
    {headerName: 'Room Status',field: 'roomStatus',suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'FO Status',field: 'frontOfficeStatus',suppressSizeToFit: true, maxWidth: 180 },
    {headerName: 'Reservation Status',field: 'reservationStatus',suppressSizeToFit: true, maxWidth: 180 },
  ]);

  const defaultColDef = useMemo( ()=> (
    {
      sortable: true, 
      filter: true,
      filterParams :{
        buttons : ['apply','reset']
      }
    }
  ));

  const cellClickedListener = useCallback( event => {
  }, []);


  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  useEffect(() => {
    const hotelIDData = JSON.stringify({
        hotelID: 1
    })
    fetchx(DASHBOARD_URL + "/getBusinessDate", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: hotelIDData
    }).then((res) => res.json())
        .then(postres => {
            if (postres.statusCode === 200) {
                setHotelDetails(postres.data)
                sethotelAddress(postres['data'][0].address)
                setHotelName(postres['data'][0].name)
                setHotelNo(postres['data'][0]['phoneNumber'])
                sethotelFax(postres['data'][0]['fax'])
                setLogo(postres['data'][0]['logo'])
            }
        })
}, []);


  useEffect(() => {
    fetchx(DASHBOARD_URL + "/getFloorList?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        setFloorOptions(resp["data"]);
      });     

    let createmarketGroup = JSON.stringify({
      "hotelID": 1,
      "floor" :null,
    })
    setOpen(true)
    let res = fetchx(DASHBOARD_URL+"/getVaccantRooms", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then(data => data.json())
       .then((res) => {
        if(res['statusCode'] == 200) {
          setOpen(false)
      setRowData1(res["data"])
        }
    }); 
    
    },[])
   

    const handleChange = (selectedOption) => {
      const selectedIds = selectedOption.map(option => option.value);
      console.log(selectedIds)
      const selectedlabel = selectedOption.map(option => option.Label);
      console.log(selectedlabel)
      setFilterFloor(selectedIds)
      const selectedIdsString = JSON.stringify(selectedIds); // Convert to a JSON string
      setCompanyData(selectedIdsString);
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
  const onSubmit = data => {
    if ((companyData == undefined ||companyData == 0) && companyData == '' || companyData == [] || companyData.length == 0) {
      handleError("Please select any one of the filter !!!")
      return;
    }
    else{
      setOpen(true)
      setIsButtonClicked(true)
    }
    setIsButtonClicked(true)
    setOpen(true)
    setData(data)
      let createmarketGroup = JSON.stringify({
        "hotelID": 1,
        "floor" :companyData,
      })
      let res = fetchx(DASHBOARD_URL+"/getVaccantRooms", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(data => data.json())
         .then((res) => {
          setIsButtonClicked(false)
          if(res['statusCode'] == 200) {
            setOpen(false)
        setRowData1(res["data"])
          }
      });    
  }

  const handleReset = () => {
    reset({    
      companyID: ''
    })
  }

  const onBtnExport = () => {
    const params = {
      fileName: 'Vaccant Room  Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };
  const params = {
    fileName: 'Vaccant Room Report ', 
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

  
  const printGrid = (data) => {
    const gridApi = gridRef.current && gridRef.current.api;
    if (gridApi) {
      // Get unique floor IDs from rowData1
      const uniqueFloors = Array.from(new Set(rowData1.map((row) => row.floorID)));
  
      // Get CSV data from the grid
      const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
      
      // Calculate the total rooms per floorID
      const totalRoomsByFloor = rowData1.reduce((acc, room) => {
        if (!acc[room.floorID]) {
          acc[room.floorID] = 0;
        }
        acc[room.floorID] += 1; // Increment count for each room
        return acc;
      }, {});
  
      // Calculate grand total of rooms
      const grandTotalRooms = Object.values(totalRoomsByFloor).reduce((total, count) => total + count, 0);
  
      // Prepare data for the PDF
      const headerRow = rowData.substring(0, rowData.indexOf('\n'));
      const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
      const cleanData = dataRows.replace(/"/g, '');
      const rows = cleanData.split('\n').map(row => row.split(','));
      const pdf = new jsPDF({ orientation: 'landscape' });
  
      // Set logo and header
      const pageWidth = pdf.internal.pageSize.getWidth();
      const logoWidth = 20;
      const xLogo = 10; // X-coordinate for the logo
      const yLogo = 10; // Y-coordinate for the logo
      const logoHeight = 20;
      let dateY = 20;
  
      pdf.addImage(DASHBOARD_URL + `/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);
      const margin = { left: 10, right: 10 };
      const currentDate = new Date();
      const formattedDate = formatDates(currentDate);
      const paddingFromRight = 85;
      const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);
  
      // Function to set hotel info
      const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo, fontSize) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', 'normal');
        
        const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const pageCenter = pdf.internal.pageSize.width / 2;
        const halfTextWidth = textWidth / 2;
        let textStartX = pageCenter - halfTextWidth;
  
        // Adjust the text starting X-coordinate if necessary
        if (textStartX < 0) {
          textStartX = 0;
        } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
          textStartX = pdf.internal.pageSize.width - textWidth;
        }
  
        // Draw the text on the PDF
        pdf.text(`${textToCenter}`, textStartX, yLogo);
      };
  
      // Set hotel name and address
      setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo, 14);
      setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8, 12); 
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      
      // Title for the report
      const textToCenter = "Vacant Room Report";
      const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      const pageCenter = pdf.internal.pageSize.width / 2;
      const halfTextWidth = textWidth / 2;
      let textStartX = pageCenter - halfTextWidth;
  
      if (textStartX < 0) {
        textStartX = 0;
      } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
        textStartX = pdf.internal.pageSize.width - textWidth;
      }
      
      const textY = yLogo + 16;
      pdf.text(textToCenter, textStartX, textY);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
  
      // Function to format dates
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
  
      // Clean header row and format data
      const cleanHeaderRow = headerRow.replace(/"/g, '').replace(/sum\(([^)]+)\)/g, '$1');
      const columnsToFormat = [6, 7, 8, 9];
  
      rows.forEach(row => {
        columnsToFormat.forEach(columnIndex => {
          const value = row[columnIndex];
          if (value !== undefined) {
            row[columnIndex] = Number(value).toFixed(2);
          }
          if (!isNaN(Number(value))) {
            row[columnIndex] = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(Number(value));
          }
        });
      });
  
      // Add table from grid data
      pdf.autoTable({
        head: [cleanHeaderRow.split(',').map(value => value.trim())],
        body: rows.map(row => row.map(value => value.trim())),
        startY: dateY + 43,
      });
      
      dateY = pdf.autoTable.previous.finalY + 20;
  
      // Adding a section for Total Rooms by FloorID
      const totalRoomsHeader = ['Floor', 'Total Rooms'];
      const totalRoomsData = Object.entries(totalRoomsByFloor).map(([floorID, totalRooms]) => [floorID, totalRooms.toString()]);
  
      // Add total rooms table to the PDF
      pdf.autoTable({
        head: [totalRoomsHeader],
        body: totalRoomsData,
        startY: dateY + 10, // Adjust this Y-coordinate as needed
        theme: 'grid',
      });
  
      // Calculate the Y-coordinate for the grand total section
      dateY = pdf.autoTable.previous.finalY + 10;
  
      // Add grand total at the end
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Grand Total Rooms: ${grandTotalRooms}`, 14, dateY);
  
      // Add page numbers for each page
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
  
      pdf.save('Vacant Room Report.pdf');
    } else {
      // Handle case where gridApi is not available
    }
  };
  
  

  //     // Add table
  //     pdf.autoTable({
  //       head: [cleanHeaderRow.split(',').map(value => value.trim())], 
  //       body: rows.map(row => row.map(value => value.trim())), 
  //       startY: dateY + 43, 
  //     });
  //     dateY = pdf.autoTable.previous.finalY + 20;
  //     pdf.text(`Filter From Arrival Date: ${1}`, 10, dateY + 60, { width: 500, align: 'left' });
  //     pdf.text(`To Arrival Date: ${2}`, 10, dateY + 70, { width: 500, align: 'left' });
  //       pdf.save('Vaccant Room Report.pdf');
  //   } else {  
  //   }
  // };

  // const   printGrid = async (data) => {
  //   const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.arrivalDate)));
  //   let fromDate = Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD")
  //   let toDate = Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
  //   const doc = new jsPDF({ orientation: 'landscape' });

  //   try {
  //     // Add image with increased space
  //     doc.addImage(logo, 'JPEG', 143, 10, 15, 15);

  //     doc.setFont('Times-Roman');
  //     doc.setFontSize(12);
  //     const currentDate = new Date();
  //     const formattedDateTime = formatDateTimeWithAMPM(currentDate);
  //     doc.setFont('times', 'bold');
  //     doc.text(`Report Generated Time: ${formattedDateTime}`, 230, 10, { width: 500, align: 'center' });

  //     // Add text with increased space
  //     doc.setFont('times', 'bold');
  //     doc.text('THE OTERRA BENGALURU', 150, 30, { width: 500, align: 'center' });
  //     doc.setFont('times', 'normal');

  //     // Add additional space before 'Long Staying Guest Report'
  //     doc.setFont('times', 'bold');
  //     doc.text('C Form Report', 150, 40, { width: 500, align: 'center' });

  //     // Adjusted startY and margin to center the table
  //     let startY = 50; // Adjust as needed
  //     const margin = { top: 10, right: 20, bottom: 10, left: 20 }; // Adjust as needed

  //     // Iterate through each unique arrival date and generate a table
  //     uniqueArrivalDates.forEach((arrivalDate, index) => {
  //       const rows = rowData1
  //       .filter((row) => row.arrivalDate === arrivalDate)
  //       .map((row) => {
  //         // Format arrivalDate and departureDate here
  //         const formattedArrival = Moment(new Date(row.arrivalDate)).format("DD.MM.YYYY")
  //         const formattedDeparture = Moment(new Date(row.departureDate)).format("DD.MM.YYYY")
  //         // Include the formatted dates in the row
  //         return {
  //           ...row,
  //           arrivalDate: formattedArrival,
  //           departureDate: formattedDeparture,
  //         };
  //       })
  //       .map((row) => columnDefs.map((column) => row[column.field]));
  //     const columns = columnDefs.map((column) => column.headerName);

  //       // Calculate the total count for the current date

  //       // Add table title with the arrival date and total count

  //       const spaceLeftForDate = doc.internal.pageSize.height - (startY + 20 + margin.bottom);
  //       if (spaceLeftForDate < 0) {
  //         doc.addPage();
  //         startY = margin.top;
  //       }

  //       doc.setFont('times', 'bold');
  //       doc.text(`Date: ${Moment(String(new Date(arrivalDate))).format("DD.MM.YYYY")}`, 20, startY + 5, {
  //         width: 500,
  //         align: 'left',
  //       });


  //       const spaceLeft = doc.internal.pageSize.height - (startY + 20 + margin.bottom);

  //       // If the space is not enough, add a new page
  //       if (spaceLeft < 0) {
  //         doc.addPage();
  //         startY = margin.top;
  //       }


  //       doc.autoTable({
  //         head: [columns],
  //         body: rows,
  //         startY: startY + 10, // Adjust for additional space between tables
  //         margin,
  //       });
  //       doc.line(margin.left, doc.autoTable.previous.finalY + 2, doc.internal.pageSize.width - margin.right, doc.autoTable.previous.finalY + 2);






  //       const totalCount = rows.length;

  //       // Add total count below the table
  //       doc.setFont('times', 'normal');
  //       doc.text(`Total Count: ${totalCount}`, 255, doc.autoTable.previous.finalY + 10, {
  //         width: 500,
  //         align: 'left',
  //       });

  //       if (index === uniqueArrivalDates.length - 1) {
  //         if (fromDate && toDate) {
  //           const fromDateNew = Moment(new Date(fromDate)).format("DD.MM.YYYY");
  //           const toDateNew = Moment(new Date(toDate)).format("DD.MM.YYYY");
  //           doc.setFont('times', 'bold');

  //           doc.text(`Filter:`, 20, startY + 10, { width: 500, align: 'left', });
  //           doc.text(`Arrival Date: From ${fromDateNew} To ${toDateNew}`, 20, startY + 20, { width: 500, align: 'left' });
  //           doc.setFont('times', 'normal'); // Reset font style to normal for subsequent text

  //         }
  //       }

  //       doc.setFont('times', 'normal');
  //       // Update startY for the next table
  //       startY = doc.autoTable.previous.finalY + 20;

  //     });

  //     doc.setFont('times', 'bold');

  //     // doc.text(`Filter:`, 10, startY + 10, { width: 500, align: 'left' });
  //     // doc.text(`Arrival Date: From ${Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD")} to ${Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")}`, 10, startY + 20, { width: 500, align: 'left' });

  //     const pdfBlob = doc.output('blob');
  //     saveAs(pdfBlob, 'C Form Report.pdf');
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //   }
  // };

  const generateExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Vaccant Rooms Report');
  
    const columns = [
      { header: 'Floor', key: 'floorID', width: 30 },
      { header: 'Room Number', key: 'roomNumber', width: 25 },
      { header: 'Room Type', key: 'roomType', width: 25 },
      { header: 'Room Status', key: 'roomStatus', width: 20 },
      { header: 'FO Status', key: 'frontOfficeStatus', width: 20 },
      { header: 'Reservation Status', key: 'reservationStatus', width: 20 }
    ];
  
    worksheet.columns = columns;
  
    worksheet.addRow(['Report Name:', 'Vaccant Rooms Report']);
    console.log(companyData)
    let selectedFilterFloor = Array.isArray(filterFloor) && filterFloor.length > 0
    ? filterFloor.join(',')
    : 'All';
  
  worksheet.addRow(['Filter Floor:', selectedFilterFloor]);
    worksheet.addRow();
    worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
    for (let i = 1; i <= 3; i++) {
      worksheet.getRow(i).font = { bold: true };
    }
  
    worksheet.spliceRows(1, 1);
  
    const formattedData = (rowData1) => {
      return rowData1.map(item => ({
        ...item,
        dateTime: Moment(item.dateTime).format("DD-MM-YYYY")
      }));
    };
  
    const sanitizedData = formattedData(rowData1);
  
    sanitizedData.forEach((row) => {
      worksheet.addRow({
        floorID: row.floorID,
        roomNumber: row.roomNumber,
        roomType: row.roomType,
        roomStatus: row.roomStatus,
        frontOfficeStatus: row.frontOfficeStatus,
        reservationStatus: row.reservationStatus
      });
    });
  
    worksheet.columns.forEach((column, index) => {
      if ([3, 4, 5, 6].includes(index + 1)) {
        column.alignment = { vertical: 'middle', horizontal: 'right' };
      } else {
        column.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    });
  
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
  
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, `Vaccant Rooms Report_${formattedDate}.xlsx`);
    }).catch((error) => {
      console.error('Error generating Excel file:', error);
    });
  };
  

  return (
    <div> 
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Vaccant Rooms Report</CardTitle>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
          
          <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="companyID">
                    Floors
                  </Label>
                  <Controller
                    id="companyID"
                    control={control}
                    name="companyID"
                    render={({ field }) => (
                      <Select
                      isMulti
                        isClearable
                        options={floorOptions}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        {...field}
                    onChange={handleChange}

                      />
                    )}
                  />
                </div>
              </Col>

            <div align="end" className="buttons">
              <Button className='me-1' color='primary' type='submit' disabled={isButtonClicked}>
              {isButtonClicked ? 'Processing...' : 'Submit'} 
              </Button>
              {/* <Button className='me-1' outline color='secondary' type='reset' onClick={handleReset}>
                Reset
              </Button> */}
              {/* <Button className='me-1' color='primary' type='submit'  onClick={onBtnExport}> Download Excel </Button> */}
              <Button
              className='me-1'
              color='primary'
              onClick={generateExcel}
              >
              Download Excel
              </Button>
              <Button className='me-1' color='primary'  onClick={() =>printGrid(data)}>Print PDF </Button>
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
         <div className="ag-theme-alpine" >
        <AgGridReact 
            ref={gridRef}
            rowData={rowData1} 
            columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            domLayout='autoHeight'

            />
      </div>
    </div>
  )
}

export default VaccantRooms
