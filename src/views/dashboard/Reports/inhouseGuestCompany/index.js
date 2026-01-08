// ** React Imports
import { useState } from 'react'
import { selectThemeColors } from "@utils";
import Select from "react-select";
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader,Input, InputGroup, InputGroupText } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useRef, useEffect, useMemo, useCallback} from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import Moment from 'moment'
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const defaultValues = {
    frmdate: ''
}
const Block = () => {
  const [rowData1, setRowData1] = useState();
  const [rowData, setRowData] = useState();

  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null);
  const [companyID, setCompanyID] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [data, setData] = useState(null)
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  const gridRef = useRef();
  const [flag1, setflag1] = useState(false)
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [filterFromDate, setFilterFromDate] = useState(null);




  function formatNumbers(params) {
    var number = params.value;
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function formatCurrency(params) {
  var number = params.value;
  return number.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
   const [columnDefs, setColumnDefs] = useState([
    // {headerName: 'Hotel ID',field: 'hotelID',suppressSizeToFit: true,maxWidth: 160},
    {headerName: 'Room No.',field: 'roomNumber',suppressSizeToFit: true, maxWidth: 130 },
    {headerName: 'Guest Name ',field: 'guestName',suppressSizeToFit: true, maxWidth: 140 ,wrapText: true,  autoHeight: true, },
    {headerName: 'Company',field: 'accountName',suppressSizeToFit: true, maxWidth: 140,wrapText: true,  autoHeight: true,  },
    {headerName: 'Arrival',field: 'arrivalDate',suppressSizeToFit: true, maxWidth: 140 ,
    cellRenderer: (params) => {
      if (params.data && params.data.arrivalDate) {
        const formattedDate = Moment(params.data.arrivalDate).format("DD.MM.YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    }},
    {headerName: 'Departure',field: 'departureDate',suppressSizeToFit: true, maxWidth: 150,
    cellRenderer: (params) => {
      if (params.data && params.data.departureDate) {
        const formattedDate = Moment(params.data.departureDate).format("DD.MM.YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    }  },
    {headerName: 'Room Type',field: 'roomType',suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'Adults ',field:   'numberOfAdults',suppressSizeToFit: true, maxWidth: 120 },
    {headerName: 'Children ',field: 'numberOfChildren',suppressSizeToFit: true, maxWidth: 120 },
    {headerName: 'Payment Mode',field: 'paymentTypeData',suppressSizeToFit: true, maxWidth: 150 },
    {headerName: 'Rate Code',field: 'rateCode',suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'Rate',field: 'rate',suppressSizeToFit: true, maxWidth: 140 ,valueFormatter: formatCurrency },
    {headerName: 'VIP',field: 'vip',suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'Source',field: 'sourceCode',suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'ETD',field: 'ETD',suppressSizeToFit: true, maxWidth: 140 },
  ]);
  const defaultColDef = useMemo( ()=> (
    {
      sortable: true,
    }
  ));
  const cellClickedListener = useCallback( event => {
  }, []);
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
      setFilterFromDate(rowData['data'][0]['businessDate'])

      sethotelAddress(rowData['data'][0].address)
      setHotelName(rowData['data'][0].name)
      setHotelNo(rowData['data'][0]['phoneNumber'])
      sethotelFax(rowData['data'][0]['fax'])
      setLogo(rowData['data'][0]['logo'])
    })



    fetchx(DASHBOARD_URL + "/getGuestProfileCompanyID?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        setCompanyID(resp["data"]);
      });
    setOpen(true)
      fetchx(DASHBOARD_URL+"/getInHouseGuestCompany", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: '1',
          "companyID" :null,
        })
      })
        .then(result => result.json())
        .then(rowData => {
          if(rowData['statusCode'] == 200){
            setOpen(false)
          setRowData1(rowData["data"])
          }
    })
    },[])
    const [company, setCompany] = useState();

    const handleChange = (selectedOption) => {
      const selectedIds = selectedOption.map(option => option.value);
      const selectedIdsString = JSON.stringify(selectedIds); // Convert to a JSON string
      const selectedCompany = selectedOption.map(option => option.label);
      setCompanyData(selectedIdsString);
      setCompany(selectedCompany)

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
    console.log(data)
    if ((companyData == undefined ||companyData == 0) && companyData == '') {
      handleError("Please select any one of the filter !!!")
      return;
    }
    else{
      setOpen(true)
      setIsButtonClicked(true)
    }
        setData(data)
      // console.log(data)
      let createmarketGroup = JSON.stringify({
        "hotelID": 1,
        "companyID" :companyData,
      })
      if (flag1 == true){
        let res = fetchx(DASHBOARD_URL +"/getInHouseGuestCompany", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: createmarketGroup
        }).then(data => data.json())
           .then((res) => {
            setIsButtonClicked(false)
            if(res['statusCode'] == 200){
              setOpen(false)
          setRowData1(res["data"])
            }
        });
      }
  
  }
  const handleReset = () => {
    reset({
      companyID: ''
    })
  }
  const printGrid = () => {
    const gridApi = gridRef.current && gridRef.current.api;
    const uniqueCompanies = Array.from(new Set(rowData1.map((row) => row.accountName)));
    
    if (gridApi) {
      const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
      const headerRow = rowData.substring(0, rowData.indexOf('\n'));
      const cleanHeaderRow = headerRow.replace(/"/g, '');
      const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
      const cleanData = dataRows.replace(/"/g, '');
      const rows = cleanData.split('\n').map(row => row.split(','));
      const pdf = new jsPDF({ orientation: 'landscape' });
      let startY = 10; 
      
      // Logo and hotel info settings
      const pageWidth = pdf.internal.pageSize.getWidth();
      const logoWidth = 20;
      const xLogo = 10;
      const yLogo = 10;
      const logoHeight = 20;
      let dateY = 20;
      
      pdf.addImage(DASHBOARD_URL+`/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);
      
      const currentDate = new Date();
      const formattedDate = formatDates(currentDate);
      const paddingFromRight = 85;
      const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
      pdf.setFontSize(8);
      pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);


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
      
      // Hotel name and address
      setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo, 14);
      setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8, 12); 
      
      pdf.setFontSize(14);
      const textToCenter = "InHouse Guest Company Report";
      const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      const textX = xLogo + (pageWidth - xLogo - logoWidth - textWidth) / 2;
      pdf.text(textToCenter, textX, yLogo + 16);
      
      // Function to format dates
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
  
      let grandTotalRooms = 0;
      let grandTotalAdults = 0;
  
      uniqueCompanies.forEach((accountName) => {
        const rowsForCompany = rowData1
          .filter((row) => row.accountName === accountName)
          .map((row) => {
            const formattedArrival = formatDate(new Date(row.arrivalDate));
            const formattedDeparture = formatDate(new Date(row.departureDate));      
            const formattedArrivalTime = formatDates(new Date(row.ATA));      
  
            return {
              ...row,
              arrivalDate: formattedArrival,
              departureDate: formattedDeparture,
              ATA: formattedArrivalTime,
            };
          });
  
        const uniqueRooms = new Set(rowsForCompany.map(row => row.roomNumber)).size;
        const totalAdults = rowsForCompany.reduce((sum, row) => sum + row.numberOfAdults, 0);
  
        grandTotalRooms += uniqueRooms;
        grandTotalAdults += totalAdults;
  
        const columns = columnDefs.map((column) => column.headerName);
  
        pdf.setFont('times', 'bold');
       
        pdf.text(`Company: ${accountName}`, 15, startY + 30, { width: 500, align: 'left' });
        
        pdf.autoTable({
          head: [columns],
          body: rowsForCompany.map((row) => columnDefs.map((column) => row[column.field])),
          startY: startY + 35,
        });


        pdf.setFontSize(12);
        pdf.setFont('times', 'normal');
        // Add unique room and adult totals for the company
        pdf.text(`Total Rooms: ${uniqueRooms}`, 240, pdf.autoTable.previous.finalY + 5);
        pdf.text(`Total Pax: ${totalAdults}`, 15, pdf.autoTable.previous.finalY + 5);
  
        startY = pdf.autoTable.previous.finalY + 20;
      });
  
      // Grand total
      pdf.setFont('times', 'bold');
      pdf.setFontSize(12);
      pdf.text(`Grand Total Rooms: ${grandTotalRooms}`, 15, startY + 5);
      pdf.text(`Grand Total Pax: ${grandTotalAdults}`, 15, startY + 15);
  
      // Page numbering
      for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
        const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const xPos = pageWidth / 2 - (pageNumberWidth / 2);
        const yPos = pdf.internal.pageSize.height - 10;
        pdf.text(pageNumber, xPos, yPos);
      }
  
      pdf.save('IHG Company Report.pdf');
    }
  };

  const onBtnExport = () => {
    const params = {
      fileName: 'IHG Company Report.xlsx',
      sheetName: 'Sheet1',
    };
    gridRef.current.api.exportDataAsExcel(params);
  };

  const generateExcel = () => {
    if (filterFromDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('In House Guest Company');
  
      const columns = [
        { header: 'Room No.', key: 'roomNumber', width: 20 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Company', key: 'accountName', width: 30 },
        { header: 'Arrival', key: 'arrivalDate', width: 20 },
        { header: 'Departure', key: 'departureDate', width: 20 },
        { header: 'Room Type', key: 'roomType', width: 15 },
        { header: 'Adults', key: 'numberOfAdults', width: 10 },
        { header: 'Children', key: 'numberOfChildren', width: 10 },
        { header: 'Payment Mode', key: 'paymentTypeData', width: 20 },
        { header: 'Rate Code', key: 'rateCode', width: 15 },
        { header: 'Rate', key: 'rate', width: 15 },
        { header: 'VIP', key: 'vip', width: 10 },
        { header: 'Source', key: 'sourceCode', width: 15 },
        { header: 'ETD', key: 'ETD', width: 15 },
      ];
  
      worksheet.columns = columns;
      worksheet.addRow(['Report Name:', 'In House Guest Company']);
      worksheet.addRow(['Filter From Date:', filterFromDate]);
  
      let selectedFilterCompany = Array.isArray(company) && company.length > 0
        ? company.join(', ')
        : 'All';
      worksheet.addRow(['Filter Company:', selectedFilterCompany]);
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
        if ([7, 8,11].includes(index + 1)) {
          column.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          column.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `In House Guest Company_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };
  
  
  
  
  return (
    <div>
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>In House Guest Company</CardTitle>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
          <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="companyID">
                    Company Name
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
                        options={companyID}
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
              <Button className='me-1' color='primary' type='submit' onClick={()=>setflag1(true)} disabled={isButtonClicked}>
              {isButtonClicked ? 'Processing...' : 'Submit'} 
              </Button>
              {/* <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
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
              <Button className='me-1' color='primary' onClick={printGrid}>Print PDF </Button>
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
    {/* <App/> */}
    </div>
  )
}
export default Block
