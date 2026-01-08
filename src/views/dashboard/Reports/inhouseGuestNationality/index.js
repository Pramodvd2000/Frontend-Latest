// ** React Imports
import { useState } from 'react'
import { selectThemeColors } from "@utils";
import Select from "react-select";
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader} from 'reactstrap'
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
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const defaultValues = {
  frmdate: ''
}

const InhouseGuestNationality = () => {

  let navigate = useNavigate();
  const gridRef = useRef();
  const [rowData1, setRowData1] = useState();
  const [countryOptions, setCountryOptions] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [nationality, setNationality] = useState([]);
  const [data, setData] = useState(null)
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  const [flag, setFlag] = useState(false)
  const [flag1, setflag1] = useState(false)
  const [InvURL, setInvURL] = useState([])

  function timeCellRenderer(params) {
    if (params.value) {
      const time = new Date(params.value);
      const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit' });
      return formattedTime;
    }
    return null;
  }

  const [hotelDetails, setHotelDetails] = useState(null);
  const [hotelAddress, setHotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [filterFromDate, setFilterFromDate] = useState(null);

    //API to get hotel details
    useEffect(() => {
      fetchx(DASHBOARD_URL + "/getBusinessDate", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json())
        .then(postres => {
          setFilterFromDate(postres['data'][0]['businessDate'])
          setHotelDetails(postres['data'])
          setHotelAddress(postres['data'][0]['address'])
          setHotelName(postres['data'][0]['name'])
          setHotelNo(postres['data'][0]['phoneNumber'])
          sethotelFax(postres['data'][0]['fax'])
          setLogo(postres['data'][0]['logo'])
        })
  
    }, [])


  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Room No.', field: 'roomNumber', suppressSizeToFit: true, width: 140 },
    { headerName: 'Guest Name ', field: 'guestName', suppressSizeToFit: true, width: 300, wrapText: true, autoHeight: true, },
    { headerName: 'Nationality', field: 'nationalityName', suppressSizeToFit: true, width: 250 },
    {
      headerName: 'Arrival Date', field: 'arrivalDate', suppressSizeToFit: true, width: 150, cellRenderer: (params) => {
        if (params.data && params.data.arrivalDate) {
          const formattedDate = Moment(params.data.arrivalDate).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    {
      headerName: 'Departure Date ', field: 'departureDate', suppressSizeToFit: true, width: 150,
      cellRenderer: (params) => {
        if (params.data && params.data.departureDate) {
          const formattedDate = Moment(params.data.departureDate).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    { headerName: 'Arrival Time', field: 'ATA', suppressSizeToFit: true, width: 160,     
    cellRenderer: timeCellRenderer, // Using the custom cell renderer function
    },
    { headerName: 'Passport ', field: 'passportNumber', suppressSizeToFit: true, width: 200 },
    { headerName: 'isMain ', field: 'isMain', suppressSizeToFit: true, width: 200, hide: true },
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


  const cellClickedListener = useCallback(event => {
  }, []);


  useEffect(() => {
    fetchx(DASHBOARD_URL + "/getGuestProfileCountry?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        setCountryOptions(resp["data"]);
      });

    setOpen(true)
    fetchx(DASHBOARD_URL + "/getNationalityOfInHouseGuest", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: '1',
        "nationality": null,
      })
    })
      .then(result => result.json())
      .then(rowData => {
        if(rowData['statusCode'] == 200) {
          setOpen(false)
        setRowData1(rowData["data"])
        }
      })

  }, [])


  const handleChange = (selectedOption) => {
    const selectedIds = selectedOption.map(option => option.value);
    const selectedIdsString = JSON.stringify(selectedIds);
    const selectedNationalities = selectedOption.map(option => option.label);
    setCompanyData(selectedIdsString);
    setNationality(selectedNationalities)
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
    setData(data)
    setFlag(true)

    let createmarketGroup = JSON.stringify({
      "hotelID": 1,
      "nationality": companyData,
    })
    if (flag1 == true) {
      fetchx(DASHBOARD_URL + "/getNationalityOfInHouseGuest", {
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
          if(res['statusCode'] == 403){
            setOpen(false)
            navigate('')
          }
        });
    }
    else if (flag1 == false) {
      let res = fetchx(DASHBOARD_URL + `/DownloadGuestNationalityReport`, {
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


  const handleReset = () => {
    reset({
      companyID: ''
    })
  }


  const onBtnExport = () => {
    const params = {
      fileName: 'IHG Nationality Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };


  const params = {
    fileName: 'IHG Nationality Report ',
  };


  const printGrid = () => {
    const gridApi = gridRef.current && gridRef.current.api;
    const uniqueNationalities = Array.from(new Set(rowData1.map((row) => row.nationalityName)));
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
      let startY = 20;
      let grandTotalRooms = 0;
  
      // Basic PDF setup remains the same
      pdf.addImage(DASHBOARD_URL + `/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);
  
      const margin = { left: 10, right: 10 };
      const currentDate = new Date();
      const formattedDate = formatDates(currentDate);
      const paddingFromRight = 85;
      const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text("Generated Time " + formattedDate, dateX + 35, startY - 7);
      
      // Hotel info and title setup remains the same
      const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo, fontSize) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', 'normal');
        const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const pageCenter = pdf.internal.pageSize.width / 2;
        const halfTextWidth = textWidth / 2;
        let textStartX = pageCenter - halfTextWidth;
        if (textStartX < 0) {
          textStartX = 0;
        } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
          textStartX = pdf.internal.pageSize.width - textWidth;
        }
        pdf.text(`${textToCenter}`, textStartX, yLogo);
      };
      
      setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo, 14);
      setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8, 12);
  
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
  
      // Process each nationality
      uniqueNationalities
        .sort((a, b) => a.localeCompare(b)) // Sort alphabetically by nationality
        .forEach((nationalityName, index) => {
          // Filter rows for current nationality
          const rowsForNationality = rowData1.filter(row => 
            row.nationalityName === nationalityName && row.isMain === 1
          );
  
          // Get unique rooms for this nationality
          const uniqueRooms = new Set(rowsForNationality.map(row => row.roomNumber));
          const roomCount = uniqueRooms.size;
          grandTotalRooms += roomCount;
  
          // Format rows for display
          const formattedRows = rowsForNationality.map(row => [
            row.guestName,
            row.passportNumber,
            row.roomNumber,
            formatDate(new Date(row.arrivalDate)),
            formatDate(new Date(row.departureDate)),
            formatDates(new Date(row.ATA)),
            row.ETD,
            row.isMain
          ]);
  
          pdf.setFont('times', 'bold');
          pdf.text(`Nationality: ${nationalityName}`, 10, startY + 37);
  
          // Create table for this nationality
          pdf.autoTable({
            head: [[
              'Guest Name',
              'Passport Number',
              'Room Number',
              'Arrival Date',
              'Departure Date',
              'Actual Arrival',
              'ETD',
              'Main'
            ]],
            body: formattedRows,
            startY: startY + 40,
          });
  
          // Display totals for this nationality
          pdf.line(
            240,
            pdf.autoTable.previous.finalY,
            285,
            pdf.autoTable.previous.finalY
          );
  
          pdf.setFont('helvetica', 'roman');
          pdf.text(`Total Pax: ${rowsForNationality.length}`, 240, pdf.autoTable.previous.finalY + 7);
          pdf.text(`Total Rooms: ${roomCount}`, 240, pdf.autoTable.previous.finalY + 14);
  
          pdf.line(
            240,
            pdf.autoTable.previous.finalY + 17,
            285,
            pdf.autoTable.previous.finalY + 17
          );
  
          startY = pdf.autoTable.previous.finalY - 10;
        });
  
      // Add grand total section
      startY = pdf.autoTable.previous.finalY + 20;
      
      // Check if we need a new page for the summary
      if (pdf.internal.pageSize.height - startY < 60) {
        pdf.addPage();
        startY = 20;
      }
  
      // Display grand total summary
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Grand Total Rooms: ${grandTotalRooms}`, 10, startY + 15);
      pdf.text(`Grand Total Pax: ${grandTotalRooms}`, 10, startY + 25);

      pdf.line(10, startY + 30, 100, startY + 30);
  
      // Add filter information
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Filter \nSelected nationalities: ${nationality}`, 10, startY + 40);
  
      // Add page numbers
      const pageCenter = pdf.internal.pageSize.width / 2;
      for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
        const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const xPos = pageCenter - (pageNumberWidth / 2);
        const yPos = pdf.internal.pageSize.height - 10;
        pdf.text(pageNumber, xPos, yPos);
      }
  
      pdf.save('IHG Nationality Report.pdf');
    }
  };

  const generateExcel = () => {
    if (filterFromDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('In House Guest Nationality Report');
  
      const columns = [
        { header: 'Room No.', key: 'roomNumber', width: 20 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Nationality', key: 'nationalityName', width: 30 },
        { header: 'Arrival Date', key: 'arrivalDate', width: 20 },
        { header: 'Departure Date', key: 'departureDate', width: 20 },
        { header: 'Arrival Time', key: 'ATA', width: 20 },
        { header: 'Passport', key: 'passportNumber', width: 20 },
      ];
  
      worksheet.columns = columns;
      worksheet.addRow(['Report Name:', 'In House Guest Nationality Report']);
      worksheet.addRow(['Filter From Date:', filterFromDate]);
  
      let selectedFilterNationality = Array.isArray(nationality) && nationality.length > 0
        ? nationality.join(', ')
        : 'All';
      worksheet.addRow(['Filter Nationality:', selectedFilterNationality]);
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
        if ([7, 8, 11].includes(index + 1)) {
          column.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          column.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `In House Guest Nationality Report_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };

  return (
    <div>

      <Card>
        <CardHeader>
          <CardTitle tag='h4'>In House Guest Nationality</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="companyID">
                    Nationality
                  </Label>
                  <Controller
                    id="companyID"
                    control={control}
                    name="companyID"
                    render={({ field }) => (
                      <Select
                        isMulti
                        isClearable
                        options={countryOptions}
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
                <Button className='me-1' color='primary' type='submit' onClick={() => setflag1(true)} disabled={isButtonClicked}>
                {isButtonClicked ? 'Processing...' : 'Submit'} 

                </Button>
                <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                  Reset
                </Button>
                {/* <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button> */}
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
    </div>
  )
}

export default InhouseGuestNationality
