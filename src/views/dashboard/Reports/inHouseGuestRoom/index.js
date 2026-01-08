// ** React Imports
import { useState } from 'react'
import { selectThemeColors } from "@utils";
import Select from "react-select";
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader,Input, InputGroup, InputGroupText } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback} from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as XLSX from 'xlsx';
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const MySwal = withReactContent(Swal)
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


const defaultValues = { 
    frmdate: ''
}

const Block = () => {

  // AG Grid
  const [rowData1, setRowData1] = useState();
  const [floorOptions, setFloorOptions] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [floors, setFloor] = useState([]);
  const [open,setOpen] = useState(false)

  const [data, setData] = useState(null)
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  let navigate = useNavigate();  
  const gridRef = useRef();
  const [companyID, setCompanyID] = useState([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [filterFloor, setFilterFloor] = useState(null);



  const [columnDefs, setColumnDefs] = useState([
    {headerName: 'Room No'     ,field: 'roomNumber' ,suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'Guest Name ' ,field: 'guestName'  ,suppressSizeToFit: true, maxWidth: 200,wrapText: true,autoHeight:true, },
    {headerName: 'Company/Agent'     ,field: 'accountName',suppressSizeToFit: true, maxWidth: 200,wrapText: true,autoHeight:true, },
    // {headerName: 'Agent'       ,field: 'agentName'  ,suppressSizeToFit: true, maxWidth: 180,wrapText: true,autoHeight:true,},
    {headerName: 'Arrival Date',field: 'arrivalDate',suppressSizeToFit: true, maxWidth: 150,
    cellRenderer: (params) => {
      if (params.data && params.data.arrivalDate) {
        const formattedDate = Moment(params.data.arrivalDate).format("DD.MM.YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    }},
    {headerName: 'Departure Date ',field: 'departureDate',suppressSizeToFit: true, maxWidth: 160,
    cellRenderer: (params) => {
      if (params.data && params.data.departureDate) {
        const formattedDate = Moment(params.data.departureDate).format("DD.MM.YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    }   },
    { headerName: 'Adults ',field:   'numberOfAdults',suppressSizeToFit: true, maxWidth: 100 },
    { headerName: 'Nights',field: 'numberOfNights',suppressSizeToFit: true, maxWidth: 120 },
    { headerName: 'Children ',field: 'numberOfChildren',suppressSizeToFit: true, maxWidth: 110 },
    { headerName: 'Floor', field: 'floor', suppressSizeToFit: true, maxWidth: 140 }, 
    { headerName: 'RateCode', field: 'rateCode', suppressSizeToFit: true, maxWidth: 140 }, 
    { headerName: 'VIP', field: 'vipType', suppressSizeToFit: true, maxWidth: 100 ,wrapText: true,autoHeight:true,},    
    { headerName: 'Source', field: 'sourceCode', suppressSizeToFit: true, maxWidth: 100 ,wrapText: true,autoHeight:true,},
    { headerName: 'Market', field: 'marketCode', suppressSizeToFit: true, maxWidth: 100 ,wrapText: true,autoHeight:true,},
    { headerName: 'Plan', field: 'packageCode', suppressSizeToFit: true, maxWidth: 100 ,wrapText: true,autoHeight:true,},
    { headerName: 'Payment Method', field: 'paymentTypeCode', suppressSizeToFit: true, maxWidth: 180,  wrapText: true,autoHeight:true },
    { headerName: 'ETD',field: 'ETD',suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'isMain'      ,field: 'isMain',suppressSizeToFit: true, maxWidth: 140 ,hide:true},  

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

  const [rowData, setRowData] = useState([]);
  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null); 
  useEffect(() => {
    const hotelID = JSON.stringify({
      hotelID: 1
    })
    fetchx(DASHBOARD_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelID
    }).then((res) => res.json())
    .then(rowData => {
      setRowData(rowData['data'])
      console.log(rowData['data'][0].address)
      sethotelAddress(rowData['data'][0].address)
      setHotelName(rowData['data'][0].name)

    })


    fetchx(DASHBOARD_URL + "/getFloorList?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        // console.log(resp["data"])
        setFloorOptions(resp["data"]);
      });     


      fetchx(DASHBOARD_URL + "/getGuestProfileCompanyID?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        setCompanyID(resp["data"]);
      });
      setOpen(true)
// console.log(floorOptions)
      fetchx(DASHBOARD_URL+"/getInHouseGuestRoom", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: '1',
          "floor" :null,
        })
      })
        .then(result => result.json())
        .then(rowData => {
          if(rowData['statusCode']==200){
            setOpen(false)
          // console.log(rowData['data']);
          // // console.log(res["data"][0]);
          setRowData1(rowData["data"])
          }
    })
    
    },[])
   
    // const handleChange = (selectedOption) => {
    //   const selectedIds = selectedOption.map(option => option.value);
    //   // console.log(selectedIds)  
    //   setCompanyData(selectedIds)
    // };

    const handleChange = (selectedOption) => {
      const selectedIds = selectedOption.map(option => option.value);
      const selectedFloors= selectedOption.map(option => option.label);

      const selectedFloorIds = JSON.stringify(selectedIds); // Convert to a JSON string
      // console.log(selectedIdsString);
      setCompanyData(selectedFloorIds);
      setFloor(selectedFloors)
      setFilterFloor(selectedFloors)

    };
    
    // console.log(companyData)

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
    if ((companyData == undefined ||companyData == 0) && companyData == '') {
      handleError("Please select any one of the filter !!!")
      return;
    }
    setIsButtonClicked(true)
    setOpen(true)
    setData(data)
      // console.log(data)
      let createmarketGroup = JSON.stringify({
        "hotelID": 1,
        "floor" :companyData,
        // "arrivalDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
      })
      let res = fetchx(DASHBOARD_URL+"/getInHouseGuestRoom", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(data => data.json())
         .then((res) => {
          setIsButtonClicked(false)
          if(res['statusCode'] == 200){
            setOpen(false)
        // console.log(res);
        // console.log(res["data"][0]);
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
      fileName: 'IHG Room Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };

  const params = {
    fileName: 'IHG Room Report ', 
  };

   
  const printGrid = () => {
    const gridApi = gridRef.current && gridRef.current.api;
    const uniqueFloors = Array.from(new Set(rowData1.map((row) => row.floor)));
  
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
      const xLogo = 10;
      const yLogo = 10;
      const logoHeight = 20;
      let dateY = 20;
      let startY = 10;
  
      pdf.addImage(Logo, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);
  
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
      const hotelNameX = xLogo + logoWidth + 108;
      pdf.text(`${hotelName}`, hotelNameX, yLogo + 3);
  
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const hotelAddressX = xLogo + logoWidth + 60;
      pdf.text(`${hotelAddress}`, hotelAddressX, yLogo + 9);
  
      const textToCenter = "Inhouse Guest Room Report";
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      const pageCenter = pdf.internal.pageSize.width / 2;
      const halfTextWidth = textWidth / 2;
      let textStartX = pageCenter - halfTextWidth;
      if (textStartX < 0) textStartX = 0;
      else if (textStartX + textWidth > pdf.internal.pageSize.width) textStartX = pdf.internal.pageSize.width - textWidth;
      const textY = yLogo + 16;
      pdf.text(textToCenter, textStartX, textY);
  
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      dateY = 10;
  
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
  
      // Tracking grand totals for rooms and adults
      let grandTotalRooms = 0;
      let grandTotalAdults = 0;
      let uniqueRoomNumbers = new Set(); // Set to store unique room numbers
  
      uniqueFloors
        .sort((a, b) => new Date(a) - new Date(b))
        .forEach((floor, index) => {
          const rowsForDate = rowData1
            .filter((row) => row.floor === floor)
            .map((row) => {
              const formattedArrival = formatDate(new Date(row.arrivalDate));
              const formattedDeparture = formatDate(new Date(row.departureDate));
              const formattedArrivalTime = formatDates(new Date(row.ATA));
              const isMain = row.isMain;
              const roomNumber = row.roomNumber;
              const numberOfRooms = row.numberOfRooms || 0;
              const numberOfAdults = row.numberOfAdults || 0;
  
              // Only add unique room numbers and count rooms where isMain = 1
              if (isMain === 1) {
                uniqueRoomNumbers.add(roomNumber);
                grandTotalRooms += numberOfRooms;
              }
  
              // Always add adults, regardless of isMain value
              grandTotalAdults += numberOfAdults;
  
              return {
                ...row,
                arrivalDate: formattedArrival,
                departureDate: formattedDeparture,
                ATA: formattedArrivalTime,
                isMain,
                roomNumber,
                numberOfRooms,
                numberOfAdults,
              };
            })
            .map((row) => columnDefs.map((column) => row[column.field]));
  
          const columns = columnDefs.map((column) => column.headerName);
          const tableHeight = 8;
  
          if (startY + tableHeight > pdf.internal.pageSize.height - 20) {
            pdf.addPage();
            startY = 10;
          }
  
          const availableSpace = pdf.internal.pageSize.height - startY;
  
          if (availableSpace < 30) {
            pdf.addPage();
            startY = 10;
          }
  
          pdf.setFont('times', 'bold');
          pdf.text(`Floor: ${floor}`, 10, startY + 30, { width: 500, align: 'left' });
  
          const filteredColumns = columns.filter(columnName => columnName !== 'isMain');
  
          pdf.autoTable({
            head: [filteredColumns],
            body: rowsForDate,
            startY: startY + 35,
          });
  
          pdf.setFont('times', 'roman');
          pdf.text(`Total Rooms: ${grandTotalRooms}`, 260, pdf.autoTable.previous.finalY + 5, {
            width: 500,
            align: 'center',
          });
  
          pdf.text(`, Total Pax: ${grandTotalAdults}`, 180, pdf.autoTable.previous.finalY + 5, {
            width: 500,
            align: 'center',
          });
  
          
  
          startY = pdf.autoTable.previous.finalY;
        });
  
      // Add grand totals to the end of the last row
      startY = pdf.autoTable.previous.finalY + 20;
      const availableSpace = pdf.internal.pageSize.height - startY;
      if (availableSpace < 30) {
        pdf.addPage();
        startY = 10;
      }
  
      pdf.setFont('times', 'bold');
      pdf.text(`Grand Total Rooms: ${grandTotalRooms}`, 10, startY + 10, { width: 500, align: 'left' });
      pdf.text(` Grand Total Pax: ${grandTotalAdults}`, 10, startY + 20, { width: 500, align: 'left' });
      for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
        const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const xPos = pageCenter - (pageNumberWidth / 2);
        const yPos = pdf.internal.pageSize.height - 10;
        pdf.text(pageNumber, xPos, yPos);
      }
  
      pdf.save('IHG Room Report.pdf');
    }
  };
  

  const generateExcel = () => {
    // if (filterFromDate && filterToDate) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('In House Guest Rooms');

        const columns = [
            { header: 'Room No.', key: 'roomNumber', width: 20 },
            { header: 'Guest Name', key: 'guestName', width: 25 },
            { header: 'Company/Agent', key: 'accountName', width: 30 },
            { header: 'Arrival Date', key: 'arrivalDate', width: 20 },
            { header: 'Departure Date', key: 'departureDate', width: 20 },
            { header: 'Adults', key: 'numberOfAdults', width: 10 },
            { header: 'Nights', key: 'numberOfNights', width: 10 },
            { header: 'Children', key: 'numberOfChildren', width: 10 },
            { header: 'Floor', key: 'floor', width: 15 },
            { header: 'RateCode', key: 'rateCode', width: 15 },
            { header: 'VIP', key: 'vipType', width: 10 },
            { header: 'Source', key: 'sourceCode', width: 15 },
            { header: 'Market', key: 'marketCode', width: 15 },
            { header: 'Plan', key: 'packageCode', width: 15 },
            { header: 'Payment Method', key: 'paymentTypeCode', width: 20 },
            { header: 'ETD', key: 'ETD', width: 20 },
        ];

        worksheet.columns = columns;
        worksheet.addRow(['Report Name:', 'In House Guest Rooms']);
        let selectedFilterFloor = Array.isArray(filterFloor) && filterFloor.length > 0
        ? filterFloor.join(', ')
        : 'All';
        worksheet.addRow(['Filter Floor:', selectedFilterFloor]);
        worksheet.addRow();
        worksheet.addRow(columns.map(column => column.header)).font = { bold: true };

        for (let i = 1; i <= 5; i++) {
            worksheet.getRow(i).font = { bold: true };
        }

        worksheet.spliceRows(1, 1);

        const formattedData = (rowData1) => {
            return rowData1.map(item => ({
                ...item,
                arrivalDate: Moment(item.arrivalDate).format("DD.MM.YYYY"),
                departureDate: Moment(item.departureDate).format("DD.MM.YYYY"),
            }));
        };

        const sanitizedData = formattedData(rowData1);

        sanitizedData.forEach((row) => {
            const newRow = {};
            columns.forEach(col => {
                newRow[col.key] = row[col.key] || '';
            });

            worksheet.addRow(newRow);
        });

        worksheet.columns.forEach((column, index) => {
          if ([6,7,8].includes(index + 1)) {
            column.alignment = { vertical: 'middle', horizontal: 'right' };
          } else {
            column.alignment = { vertical: 'middle', horizontal: 'left' };
          }
        });

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            saveAs(blob, `In House Guest Rooms_${formattedDate}.xlsx`);
        }).catch((error) => {
            console.error('Error generating Excel file:', error);
        });
    // }
};

  
  return (
    <div>
 
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>In House Guest Rooms</CardTitle>
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
                        // required
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
              {/* <Button className='me-1' outline color='secondary' type='reset' onClick={handleReset}> Reset  </Button> */}
              {/* <Button className='me-1' color='primary' type='submit'  onClick={onBtnExport}> Download Excel </Button> */}
              <Button
                className='me-1'
                color='primary'
                onClick={generateExcel}
              >
                Download Excel
                </Button>
              <Button className='me-1' color='primary' type='submit'  onClick={printGrid}>Print PDF </Button>
            </div>
          </Row>
        </Form>
      </CardBody>
    </Card>
      {/* <div>
        <Col md="3" sm="12" className="mb-1">
          <Label className="form-label" for="fullName">
            Search
          </Label>
          <Input
            type="text"
            id="filter-text-box"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
          />
        </Col>
      </div> */}
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
    <div className="ag-theme-alpine">
        <AgGridReact 
            ref={gridRef}
            rowData={rowData1} 
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
    {/* <App/> */}
    </div>
  )
}

export default Block
