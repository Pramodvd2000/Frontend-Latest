import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useRef, useEffect, useMemo, } from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Logo from '../oterra.jpg'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


const defaultValues = {
  frmdate: ''
}

const DepartureReport = () => {
  const [rowData1, setRowData1] = useState();
  const [floorOptions, setFloorOptions] = useState();
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const [flag1, setflag1] = useState(false)
  const [companyID, setCompanyID] = useState([]);
  const [agents, setAgents] = useState([]);
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD'))
  };
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [filterFloor, setFilterFloor] = useState(null);
  const [filterCompany, setFilterCompany] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null);  
  const gridRef = useRef();
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [open,setOpen] = useState(false)
  const [filterCompanies,setFilterCompanies] = useState([])
  const [agentNames,setAgentNames] = useState([])
  const [isButtonClicked, setIsButtonClicked] = useState(false);



  const onButtonExport = () => {
    const params = {
      fileName: 'departure.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };

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
      setHotelNo(rowData['data'][0]['phoneNumber'])
      sethotelFax(rowData['data'][0]['fax'])
      setLogo(rowData['data'][0]['logo'])

    })

    fetchx(DASHBOARD_URL + "/getFloorList?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        setFloorOptions(resp["data"]);
      });

    fetchx(DASHBOARD_URL + "/getAgents?hotelID=1")
      .then(result => result.json())
      .then(resp => {
        const responseData = resp['data'];
        const agents = responseData.map((item) => ({
          label: item.accountName,
          value: item.companyid,
        }));
        setAgents(agents);
      })

    fetchx(DASHBOARD_URL + "/getGuestProfileCompanyID?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        setCompanyID(resp["data"]);
      });
  }, []);;

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'BookingID', field: 'bookingID', suppressSizeToFit: true, maxWidth: 120 },
    { headerName: 'RoomNo', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 100 },
    { headerName: 'GuestName ', field: 'guestName', suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true },
    {
      headerName: 'Arrival', field: 'arrivalDate', suppressSizeToFit: true, maxWidth: 130, cellRenderer: (params) => {
        if (params.data && params.data.arrivalDate) {
          const formattedDate = Moment(params.data.arrivalDate).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    {
      headerName: 'Departure', field: 'departureDate', suppressSizeToFit: true, maxWidth: 130, cellRenderer: (params) => {
        if (params.data && params.data.departureDate) {
          const formattedDate = Moment(params.data.departureDate).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    { headerName: 'RoomType', field: 'roomType', suppressSizeToFit: true, maxWidth: 120 },
    { headerName: 'Adult', field: 'numberOfAdults', suppressSizeToFit: true, maxWidth: 100 },
    { headerName: 'VIP', field: 'vipType', suppressSizeToFit: true, maxWidth: 60, wrapText: true, autoHeight: true, autoHeaderHeight: true ,wrapHeaderText: true },
    { headerName: 'Children', field: 'numberOfChildren', suppressSizeToFit: true, maxWidth: 110 },
    { headerName: 'Floor', field: 'floorID', suppressSizeToFit: true, maxWidth: 110 },
    { headerName: 'Company', field: 'accountName', maxWidth: 160, wrapText: true, autoHeight: true, },
    // { headerName: 'Agent', field: 'agentName', suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true, },
    { headerName: 'Res.Status', field: 'reservationStatus', suppressSizeToFit: true, maxWidth: 120 },
    {
      headerName: 'DateTime', field: 'DateTime', suppressSizeToFit: true, maxWidth: 1240,
      cellRenderer: (params) => {
        if (params.data && params.data.DateTime) {
          const formattedDate = Moment(params.data.DateTime).format("DD.MM.YYYY  hh:mm");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    { headerName: 'Payment Method', field: 'paymentTypeCode', suppressSizeToFit: true, maxWidth: 180, wrapText: true, autoHeight: true },
    { headerName: 'EmailID', field: 'email', suppressSizeToFit: true, maxWidth: 120, wrapText: true, autoHeight: true },

  ]);

  const defaultColDef = useMemo(() => (
    {
      sortable: true,
    }
  ));

  const onSubmit = data => {
    setIsButtonClicked(true)
    setOpen(true)
    const filterFromDate = Moment(data.frmdate[0]).format("DD.MM.YYYY");
    const filterToDate = Moment(data.todate[0]).format("DD.MM.YYYY");
    const floorIDs = Array.isArray(data.floorID) ? data.floorID.map(item => item.value) : [];
    const CompanyID = Array.isArray(data.companyID) ? data.companyID.map(item => item.value) : [];
    const AgentsID = Array.isArray(data.agents) ? data.agents.map(item => item.value) : [];
    const agentName = Array.isArray(data.agents) ? data.agents.map((item) => item.label) : [];
    const CompanyName = Array.isArray(data.companyID) ? data.companyID.map((item) => item.label) : [];
    const filterCompany = CompanyName != null ? JSON.stringify(CompanyName) : null;
    setFilterCompanies(CompanyName)
    setAgentNames(agentName);
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    setFilterFloor(floorIDs);
    setFilterCompany(filterCompany);

    setFlag(true);
    setData(data);



    let createmarketGroup = JSON.stringify({
      "hotelID": 1,
      startDate:  Moment(data.frmdate[0]).format("YYYY-MM-DD"),
    endDate: Moment(data.todate[0]).format("YYYY-MM-DD"),
      "floor": floorIDs != null ? JSON.stringify(floorIDs) : null,
      "company": CompanyID != null ? JSON.stringify(CompanyID) : null,
      "agents": AgentsID != null ? JSON.stringify(AgentsID) : null,
    });
    if (flag1 === true) {
      console.log(flag1);
      let res = fetchx(DASHBOARD_URL + "/getDeparturesReport", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(data => data.json())
        .then((res) => {
          setIsButtonClicked(false)
          if(res['statusCode'] == 200){
            setOpen(false)
          setRowData1(res["data"]);
          }
        });
    }
  }

  const handleReset = () => {
    reset({
      frmdate: '',
      todate: '',
      floorID: '',
      companyID: ''

    })
  }

  const printGrid = () => {
    if (filterFromDate && filterToDate) {
      const gridApi = gridRef.current && gridRef.current.api;
      const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.departureDate)));
  
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
        const xLogo = 10; // X-coordinate for the logo
        const yLogo = 10; // Y-coordinate for the logo
        const logoHeight = 20;
        let dateY = 20;
  
        // Add logo and hotel info
        pdf.addImage(DASHBOARD_URL + `/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        
        const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo, fontSize) => {
          pdf.setFontSize(fontSize);
          pdf.setFont('helvetica', 'normal');
          const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
          const pageCenter = pdf.internal.pageSize.width / 2;
          let textStartX = pageCenter - (textWidth / 2);
          textStartX = Math.max(0, textStartX); // Prevent text overflow
          pdf.text(`${textToCenter}`, textStartX, yLogo);
        };
  
        setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo, 14);
        setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8, 12);
        
        // Report title
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        const textToCenter = "Departures Report";
        const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const textStartX = pageWidth / 2 - textWidth / 2;
        const textY = yLogo + 16;
        pdf.text(textToCenter, textStartX, textY);


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
  
        // Initialize grand totals
        let grandTotalRooms = 0;
        let grandTotalAdults = 0;
  
        // Iterate over unique arrival dates
        uniqueArrivalDates.sort((a, b) => new Date(a) - new Date(b)).forEach((departureDate) => {
          const rowsForDate = rowData1
            .filter((row) => row.departureDate === departureDate)
            .map((row) => {
              const formattedArrival = formatDate(new Date(row.arrivalDate));
              const formattedDeparture = formatDate(new Date(row.departureDate));
              const formattedPickUpDate = formatDate(new Date(row.DateTime));
  
              return {
                ...row,
                arrivalDate: formattedArrival,
                departureDate: formattedDeparture,
                DateTime: formattedPickUpDate,
              };
            })
            .map((row) => columnDefs.map((column) => row[column.field]));
  
          const totalCount = rowsForDate.length;
          grandTotalRooms += totalCount;
  
          let totalAdults = 0;
          rowsForDate.forEach((row) => {
            totalAdults += row[6] ? parseInt(row[6]) : 0; // Assuming the number of adults is in the 6th index
          });
          grandTotalAdults += totalAdults;
  
          // Render table for each departure date
          const columns = columnDefs.map((column) => column.headerName);
          pdf.autoTable({
            head: [columns],
            body: rowsForDate,
            startY: dateY + 33,
            columnStyles: {
              // column styles if needed
            },
          });
  
          dateY = pdf.autoTable.previous.finalY + 20; // Update Y position for the next section
  
          pdf.setFont('times', 'roman');
          pdf.text(`Total Rooms: ${totalCount}`, 220, pdf.autoTable.previous.finalY + 5);
          pdf.text(`Total Pax: ${totalAdults}`, 80, pdf.autoTable.previous.finalY + 5);
        });
  
        // Add Grand Totals at the end
        const availableSpace = pdf.internal.pageSize.height - dateY;
        if (availableSpace < 30) {
          pdf.addPage();
          dateY = 10;
        }
        
        pdf.setFontSize(12);
        pdf.setFont('times', 'bold');
        pdf.text(`Grand Total Rooms: ${grandTotalRooms}`, 220, dateY + 10);
        pdf.text(`Grand Total Pax: ${grandTotalAdults}`, 80, dateY + 10);


        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
           pdf.text(`Filter From Arrival Date: ${filterFromDate}`, 15, dateY + 20, { width: 500, align: 'left' });
           pdf.text(`To Arrival Date:  ${filterToDate}  `, 15, dateY + 30, { width: 500, align: 'left' });
           pdf.text(`Floor: ${filterFloor}   `, 15, dateY + 40, {  width: 500,align: "left", });
           pdf.text(`Company: ${filterCompany} `, 15, dateY + 50, {  width: 500,align: "left", });
  
        // Footer and Page numbers
        for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
          pdf.setPage(i);
          const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
          const pageCenter = pageWidth / 2;
          const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
          const xPos = pageCenter - (pageNumberWidth / 2);
          const yPos = pdf.internal.pageSize.height - 10;
          pdf.text(pageNumber, xPos, yPos);
        }
  
        // Save the PDF
        pdf.save('Departures Report.pdf');
      }
    }
  };
  
  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Departure Report');
  
      const columns = [
        { header: 'BookingID', key: 'bookingID', width: 15 },
        { header: 'RoomNo', key: 'roomNumber', width: 15 },
        { header: 'GuestName', key: 'guestName', width: 30 },
        { header: 'Arrival', key: 'arrivalDate', width: 20 },
        { header: 'Departure', key: 'departureDate', width: 20 },
        { header: 'RoomType', key: 'roomType', width: 15 },
        { header: 'Adult', key: 'numberOfAdults', width: 10 },
        { header: 'VIP', key: 'vipType', width: 10 },
        { header: 'Children', key: 'numberOfChildren', width: 15 },
        { header: 'Floor', key: 'floorID', width: 15 },
        { header: 'Company', key: 'accountName', width: 20 },
        { header: 'Res.Status', key: 'reservationStatus', width: 15 },
        { header: 'DateTime', key: 'DateTime', width: 20 },
        { header: 'Payment Method', key: 'paymentTypeCode', width: 20 },
        { header: 'EmailID', key: 'email', width: 20 }
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'Departure Report']);
      worksheet.addRow(['Filter From Date:', filterFromDate]);
      worksheet.addRow(['To Date:', filterToDate]);
      let selectedFilterFloor = Array.isArray(filterFloor) && filterFloor.length > 0
      ? filterFloor.join(', ')
      : 'All';
      worksheet.addRow(['Filter Floor:', selectedFilterFloor]);
      let selectedFilterCompany = Array.isArray(filterCompanies) && filterCompanies.length > 0
      ? filterCompanies.join(', ')
      : 'All';
      worksheet.addRow(['Filter Company:', selectedFilterCompany]); 
      
      let selectedFilterAgent = Array.isArray(agentNames) && agentNames.length > 0
      ? agentNames.join(', ')
      : 'All';
      worksheet.addRow(['Filter Agent:', selectedFilterAgent]);   
      
    
      worksheet.addRow();
      worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
      for (let i = 1; i <= 7; i++) {
        worksheet.getRow(i).font = { bold: true };
      }
  
      worksheet.spliceRows(1, 1);
  
      const formattedData = (rowData1) => {
        return rowData1.map(item => ({
          ...item,
          description: item.description?.replace(/\r?\n|\r/g, '')
        }));
      };
  
      const sanitizedData = formattedData(rowData1);
  
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          bookingID: row.bookingID,
          roomNumber: row.roomNumber,
          guestName: row.guestName,
          arrivalDate: row.arrivalDate,
          departureDate: row.departureDate,
          roomType: row.roomType,
          numberOfAdults: row.numberOfAdults,
          vipType: row.vipType,
          numberOfChildren: row.numberOfChildren,
          floorID: row.floorID,
          accountName: row.accountName,
          reservationStatus: row.reservationStatus,
          DateTime: row.DateTime,
          paymentTypeCode: row.paymentTypeCode,
          email: row.email
        });
      });
  
      worksheet.columns.forEach((column, index) => {
        if ([1, 2, 3, 4, 5, 6, 7].includes(index + 1)) {
          column.alignment = { vertical: 'middle', horizontal: 'left' };
        } else {
          column.alignment = { vertical: 'middle', horizontal: 'right' };
        }
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Departure_Report_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };
  

return (
  <div>
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Departures Report</CardTitle>
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
                      // options={optionsToDate}
                      options={{ allowInput: true }}
                      placeholder="YYYY-MM-DD "
                      className={classnames("form-control", {
                      })}
                    />
                  )}
                />
              </div>
            </Col>


            <Col md='3' sm='12'>
              <div className='mb-1'>
                <Label className='form-label' for='floorID'>
                  Floor
                </Label>
                <Controller
                  id="floorID"
                  control={control}
                  name="floorID"
                  render={({ field }) => (
                    <Select
                      isMulti
                      // required
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

            <Col md='3' sm='12'>
              <div className='mb-1'>
                <Label className='form-label' for='companyID'>
                  Company
                </Label>
                <Controller
                  id="companyID"
                  control={control}
                  name="companyID"
                  render={({ field }) => (
                    <Select
                      isMulti
                      isClearable
                      options={companyID}
                      classNamePrefix="select"
                      theme={selectThemeColors}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col>
            <Col md='3' sm='12'>
              <div className='mb-1'>
                <Label className='form-label' for='agents'>
                  Agents
                </Label>
                <Controller
                  id="agents"
                  control={control}
                  name="agents"
                  render={({ field }) => (
                    <Select
                      isMulti
                      isClearable
                      options={agents}
                      classNamePrefix="select"
                      theme={selectThemeColors}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col>


            <div className='d-flex'>
              <Button className='me-1 ms-auto' color='primary' type='submit' onClick={() => setflag1(true)} disabled={isButtonClicked}>
              {isButtonClicked ? 'Processing...' : 'SUBMIT'}
              </Button>
              {/* <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                Reset
              </Button> */}
              {flag == true && 
              // <Button className='me-1' color='primary' onClick={onButtonExport}>
              //   Download Excel
              // </Button>
              <Button
              className='me-1'
              color='primary'
              onClick={generateExcel}
            >
              Download Excel
              </Button>
              }

              {flag == true && <Button className='me-1' color='primary' onClick={printGrid}>
                Print PDF
              </Button>}

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
    {flag == true && <div className="ag-theme-alpine" style={{ width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData1}
        columnDefs={columnDefs}
        animateRows={true}
        rowSelection='multiple'
        domLayout='autoHeight'
        defaultColDef={defaultColDef}
        headerColor="ddw-primary"

      />
    </div>}
  </div>
)
}

export default DepartureReport;
