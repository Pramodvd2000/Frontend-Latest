//////Arrival VIP Report/////////////////////////////


import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader,Modal, ModalBody, ModalHeader } from 'reactstrap'
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

import logo from '@src/assets/images/logo/oterra.jpg'

const MySwal = withReactContent(Swal)


import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';




const defaultValues = { 
    frmdate: '',
    todate:'',
}


const Block = () => {


  // AG Grid
  const [rowData1, setRowData1] = useState();
  const [companyID, setCompanyID] = useState([]);
  const [flag, setFlag] = useState(false)
  const [flag1, setflag1] = useState(false)
  const [companyData, setCompanyData] = useState([]);
  const [data, setData] = useState(null)
  const { reset, handleSubmit, control ,watch} = useForm({ defaultValues })
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);

  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
  };
  
  let navigate = useNavigate();  
  const gridRef = useRef();
  const [InvURL,setInvURL] = useState([])


   const [columnDefs, setColumnDefs] = useState([
    // {headerName: 'Hotel ID',field: 'hotelID',suppressSizeToFit: true,maxWidth: 160},
    {headerName: 'BookingID',field: 'bookingID',suppressSizeToFit: true, maxWidth: 130 },
    {headerName: 'Guest Name ',    field: 'guestName',suppressSizeToFit: true, maxWidth: 140 ,wrapText: true,autoHeight:true,},
    {headerName: 'Company',field: 'accountName',suppressSizeToFit: true, maxWidth: 140 ,wrapText: true,autoHeight:true,},
    // {headerName: 'Source',field: 'sourceCode',suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'Arrival Date',  field: 'arrivalDate'  ,suppressSizeToFit: true, maxWidth: 140,cellRenderer: (params) => {
      // Ensure the arrivalDate field exists in the row data        
      if (params.data && params.data.arrivalDate) {
        const formattedDate = Moment(params.data.arrivalDate).format("DD-MM-YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    } },
    {headerName: 'ETA',field: 'ETA',suppressSizeToFit: true, maxWidth: 100 },


    {headerName: 'Departure Date',field: 'departureDate',suppressSizeToFit: true, maxWidth: 170,cellRenderer: (params) => {
      if (params.data && params.data.departureDate) {
        const formattedDate = Moment(params.data.departureDate).format("DD-MM-YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    }  },
    {headerName: 'ETD',field: 'ETD',suppressSizeToFit: true, maxWidth: 120 },
    {headerName: 'Room Type',field: 'roomType',suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'Adults ',field:   'numberOfAdults',suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'Children ',field: 'numberOfChildren',suppressSizeToFit: true, maxWidth: 140 },
    // {headerName: 'Payment Mode',field: 'paymentType',suppressSizeToFit: true, maxWidth: 140 },
    // {headerName: 'Rate Code',field: 'rateCode',suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'VIP',field: 'vipType',suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'ETD',field: 'ETD',suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'Notes',field: 'notes',suppressSizeToFit: true, maxWidth: 120 ,wrapText: true,autoHeight:true,},


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
    // console.log('cellClicked', event);
  }, []);




  const onButtonExport = () => {
    const params = {
      fileName: 'Arrival VIP Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };




 
  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null); 
  const [rowData, setRowData] = useState();

  useEffect(() => {
    const hotelID = JSON.stringify({
      hotelID: 10
    })
    fetchx(DASHBOARD_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelID
    }).then((res) => res.json())
    .then(rowData => {
      setRowData(rowData['data'])
      console.log(rowData['data'][0])
      console.log(rowData['data'][0].name)
      sethotelAddress(rowData['data'][0].address)
      setHotelName(rowData['data'][0].name)
      setHotelNo(rowData['data'][0]['phoneNumber'])
      sethotelFax(rowData['data'][0]['fax'])
      setLogo(rowData['data'][0]['logo'])
    })
  },[])
console.log(hotelName)

console.log(hotelAddress)


const downloadPDF = async () => {
  const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.arrivalDate)));

  const doc = new jsPDF({ orientation: 'landscape' });

  try {
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 20;
    const xLogo = 10; // X-coordinate for the logo
    const yLogo = 10; // Y-coordinate for the logo
    const logoHeight = 20;
    let startY = 20;
    const margin = { left: 10, right: 10 };

    doc.addImage(DASHBOARD_URL + `/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

    const currentDate = new Date();
    const formattedDate = formatDateTimeWithAMPM(currentDate);
    const paddingFromRight = 85;
    const dateX = pageWidth - doc.getStringUnitWidth(formattedDate) - paddingFromRight;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text("Generated Time " + formattedDate, dateX + 35, startY - 7);

    // Set hotel information
    const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo, fontsize) => {
      doc.setFontSize(fontsize);
      doc.setFont('helvetica', 'normal');
      const textWidth = doc.getStringUnitWidth(textToCenter) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const pageCenter = doc.internal.pageSize.width / 2;
      const halfTextWidth = textWidth / 2;
      let textStartX = pageCenter - halfTextWidth;

      if (textStartX < 0) {
        textStartX = 0;
      } else if (textStartX + textWidth > doc.internal.pageSize.width) {
        textStartX = doc.internal.pageSize.width - textWidth;
      }

      doc.text(`${textToCenter}`, textStartX, yLogo);
    };

    doc.setFontSize(14);
    setHotelInfo(doc, hotelName, xLogo, logoWidth, yLogo, 14);
    doc.setFontSize(12);
    setHotelInfo(doc, hotelAddress, xLogo, logoWidth, yLogo + 8, 12);

    const textToCenter = "Arrival VIP Report";
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const textWidth = doc.getStringUnitWidth(textToCenter) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const pageCenter = doc.internal.pageSize.width / 2;
    const halfTextWidth = textWidth / 2;
    let textStartX = pageCenter - halfTextWidth;
    const textY = yLogo + 16;
    doc.text(textToCenter, textStartX, textY);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    startY = 40;

    // Iterate through each unique arrival date and generate a table
    uniqueArrivalDates.forEach((arrivalDate, index) => {
      const formattedArrivalDate = formatDate(new Date(arrivalDate));

      const rows = rowData1
        .filter((row) => row.arrivalDate === arrivalDate)
        .map((row) => {
          const formattedArrival = formatDate(new Date(row.arrivalDate));
          const formattedDeparture = formatDate(new Date(row.departureDate));

          return {
            ...row,
            arrivalDate: formattedArrival,
            departureDate: formattedDeparture,
          };
        })
        .map((row) => columnDefs.map((column) => row[column.field]));

      const totalUniqueRooms = new Set(rowData1.filter(row => row.arrivalDate === arrivalDate).map(row => row.roomNumber)).size;
      const totalAdults = rowData1.filter(row => row.arrivalDate === arrivalDate).reduce((acc, row) => acc + row.numberOfAdults, 0);

      const spaceLeftForDate = doc.internal.pageSize.height - (startY + 20 + margin.bottom);
      if (spaceLeftForDate < 0) {
        doc.addPage();
        startY = margin.top;
      }

      doc.setFont('times', 'bold');
      doc.text(`Date: ${formattedArrivalDate}`, 10, startY + 5, {
        width: 500,
        align: 'left',
      });

      const spaceLeft = doc.internal.pageSize.height - (startY + 20 + margin.bottom);
      if (spaceLeft < 0) {
        doc.addPage();
        startY = margin.top;
      }

      doc.autoTable({
        head: [columnDefs.map((column) => column.headerName)],
        body: rows,
        startY: startY + 10,
        margin,
      });

      doc.line(margin.left, doc.autoTable.previous.finalY + 2, doc.internal.pageSize.width - margin.right, doc.autoTable.previous.finalY + 2);

      // Add total unique rooms and total adults below the table
      doc.setFont('times', 'normal');
      doc.text(`Total Rooms: ${totalUniqueRooms}`, 15, doc.autoTable.previous.finalY + 10, { width: 500, align: 'left' });
      doc.text(`Total Pax: ${totalAdults}`, 225, doc.autoTable.previous.finalY + 10, { width: 500, align: 'left' });

      startY = doc.autoTable.previous.finalY + 20;
    });

    // Add grand totals at the end
    const grandTotalRooms =  rowData1.reduce((acc, row) => acc + row.numberOfRooms, 0);
    const grandTotalAdults = rowData1.reduce((acc, row) => acc + row.numberOfAdults, 0);

    doc.setFont('times', 'bold');
    doc.text(`Grand Total Rooms: ${grandTotalRooms}`, 15, startY + 10, { width: 500, align: 'left' });
    doc.text(`Grand Total Pax: ${grandTotalAdults}`, 15, startY + 0, { width: 500, align: 'left' });

    // Add filter information at the end of the PDF
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');  
    doc.text(`Filter:`, 10, startY + 30, { width: 500, align: 'left' });
    doc.text(`Arrival Date: From ${Moment(String(new Date(data.frmdate[0]))).format("DD.MM.YYYY")} to ${Moment(String(new Date(data.todate[0]))).format("DD.MM.YYYY")}`, 10, startY + 40, { width: 500, align: 'left' });

    // Add page number for the last page
    for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      const pageNumber = `Page ${i} of ${doc.internal.getNumberOfPages()}`;
      const pageNumberWidth = doc.getStringUnitWidth(pageNumber) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const pageCenter = doc.internal.pageSize.width / 2;
      const xPos = pageCenter - (pageNumberWidth / 2);
      const yPos = doc.internal.pageSize.height - 10;
      doc.text(pageNumber, xPos, yPos);
    }

    const pdfBlob = doc.output('blob');
    saveAs(pdfBlob, 'Arrival VIP Report.pdf');
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

  useEffect(() => {
    fetchx(DASHBOARD_URL + "/getGuestProfileCompanyID?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        setCompanyID(resp["data"]);
      });



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
          // console.log(rowData['data']);
          // // console.log(res["data"][0]);
          setRowData1(rowData["data"])
    })
    
    },[])
   
   
    const handleChange = (selectedOption) => {
      const selectedIds = selectedOption.map(option => option.value);
      const selectedIdsString = JSON.stringify(selectedIds); // Convert to a JSON string
      // console.log(selectedIdsString);
      setCompanyData(selectedIdsString);
    };
    

    // console.log(companyData)


  
    const onSubmit = data => {
      setIsButtonClicked(true)
      setOpen(true)
      // console.log("flag1",flag1)
      setFlag(true)
      setData(data)
      const filterFromDate = Moment(data.frmdate[0]).format("DD.MM.YYYY");
      const filterToDate = Moment(data.todate[0]).format("DD.MM.YYYY");
  
      setFilterFromDate(filterFromDate);
      setFilterToDate(filterToDate);
        let createmarketGroup = JSON.stringify({
          "hotelID": 10,    
          "startDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
          "endDate":Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
        })
        console.log(createmarketGroup)
  
        if(flag1 ==true){
          let res = fetchx(DASHBOARD_URL+"/getArrivalVip", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: createmarketGroup
          }).then(data => data.json())
          .then((res) => {
            setIsButtonClicked(false)
            if(res['statusCode'] == 200) {
              setOpen(false)
            console.log(res);
            // // console.log(res["data"][0]);
            setRowData1(res["data"])
            }
          });      
        }
        else if(flag1 == false){
          let res = fetchx(DASHBOARD_URL+`/DownloadAirportDropReport`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: createmarketGroup
          }).then(data => data.json())
          .then((res) => {
            // console.log(res);
            // // console.log(res["data"][0]);
            // setRowData1(res["data"])
            setInvURL(res['url'])
            // setShowInvPDF(true)
    
            setTimeout(()=>{navigate('/dashboard/frontdesk')
                      const newTab = window.open('about:blank', '_blank');
                       newTab.location.href = res['url']
                      },1000)
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
      fileName: 'Arrivals VIP Report.xlsx',
      sheetName: 'Sheet1',
    };


    gridRef.current.api.exportDataAsExcel(params);
  };




  // const printGrid = () => {
  //   const gridApi = gridRef.current && gridRef.current.api;
  
  //   if (gridApi) {
  //     // Get ag-Grid data
  //     const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
  
  //     // Remove double quotes from the header row
  //     const headerRow = rowData.substring(0, rowData.indexOf('\n'));
  //     const cleanHeaderRow = headerRow.replace(/"/g, '');
  
  //     // Remove double quotes from the rest of the data
  //     const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
  //     const cleanData = dataRows.replace(/"/g, '');
  
  //     // Split the cleaned data into rows
  //     const rows = cleanData.split('\n').map(row => row.split(','));
  
  //     // Create PDF
  //     const pdf = new jsPDF({ orientation: 'landscape' });
  
  //     // Calculate center for the logo
  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const logoWidth = 15;
  //     const xCenter = (pageWidth - logoWidth) / 2;
  
  //     // Add logo
  //     const logoHeight = 15;
  //     pdf.addImage(logo, 'JPEG', xCenter, 10, logoWidth, logoHeight); // Adjust the coordinates and size as needed
  
  //     // Add heading
  //     pdf.setFontSize(12);
  //     pdf.setFont('helvetica', 'bold');
  //     pdf.text('THE OTERRA BENGALURU', 120, 33);
  //     pdf.text('Arrivals VIP Report', 123, 39); // Adjust the coordinates as needed
  


  //     // Add current date to the right top corner
  //     const currentDate = new Date();
  //     const formattedDate = formatDate(currentDate);
  //     const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) * 12 - 10; // Adjust the X coordinate as needed
  //     const dateY = 10;
  //     pdf.text(formattedDate, dateX, dateY);
        
  //     // Function to format the date as "MM/DD/YYYY"
  //     function formatDate(date) {
  //       const day = date.getDate().toString().padStart(2, '0');
  //       const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //       const year = date.getFullYear();
  //       return `${day}/${month}/${year}`;
  //     }
  //     // Add table
  //     pdf.autoTable({
  //       head: [cleanHeaderRow.split(',').map(value => value.trim())], // Use the first row as the header
  //       body: rows.map(row => row.map(value => value.trim())), // Use the remaining rows as the data
  //       startY: 45, // Adjust the starting Y coordinate for the table
  //     });
  
  //     // Save or display the PDF as needed
  //     pdf.save('Arrivals VIP Report.pdf');
  //   } 
  // };


  const exportToExcel = () => {
    const gridApi = gridRef.current.api;


    // Use ag-Grid's CSV export to get the data
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      fileName: 'Arrivals VIP Report.csv',
      columnGroups: true,
      skipPinnedTop: false,
      skipPinnedBottom: false,
    };


    // gridApi.exportDataAsCsv(params).then((csvData) => {
    //   // Convert CSV data to Excel format using xlsx
    //   const workbook = XLSX.utils.book_new();
    //   const ws = XLSX.utils.aoa_to_sheet(csvData.split('\n').map(row => row.split(',')));
    //   XLSX.utils.book_append_sheet(workbook, ws, 'Sheet 1');


    //   // Create a Blob and set the content type
    //   const blob = XLSX.write(workbook, { bookType: 'csv', type: 'blob', mimeType: 'application/vnd.ms-excel' });


    //   // Trigger the download
    //   const link = document.createElement('a');
    //   link.href = URL.createObjectURL(blob);
    //   link.download = 'Arrivals Report.xls';
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // });
  };

  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Arrivals VIP Report');
  
      const columns = [
        { header: 'BookingID', key: 'bookingID', width: 30 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Company', key: 'accountName', width: 30 },
        { header: 'Arrival Date', key: 'arrivalDate', width: 20 },
        { header: 'ETA', key: 'ETA', width: 20 },
        { header: 'Departure Date', key: 'departureDate', width: 20 },
        { header: 'ETD', key: 'ETD', width: 20 },
        { header: 'Room Type', key: 'roomType', width: 20 },
        { header: 'Adults', key: 'numberOfAdults', width: 20 },
        { header: 'Children', key: 'numberOfChildren', width: 20 },
        { header: 'VIP', key: 'vipType', width: 20 },
        { header: 'Notes', key: 'notes', width: 20 }
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'Arrivals VIP Report']);
      worksheet.addRow(['Filter From Date:', filterFromDate]);
      worksheet.addRow(['To Date:', filterToDate]);
  
      worksheet.addRow();
      worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
      for (let i = 1; i <= 4; i++) {
        worksheet.getRow(i).font = { bold: true };
      }
  
      worksheet.spliceRows(1, 1);
  
      const formattedData = (rowData1) => {
        return rowData1.map(item => ({
          ...item,
          arrivalDate: Moment(item.arrivalDate).format("DD-MM-YYYY"),
          departureDate: Moment(item.departureDate).format("DD-MM-YYYY"),
        }));
      };
  
      const sanitizedData = formattedData(rowData1);
  
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          bookingID: row.bookingID,
          guestName: row.guestName,
          accountName: row.accountName,
          arrivalDate: row.arrivalDate,
          ETA: row.ETA,
          departureDate: row.departureDate,
          ETD: row.ETD,
          roomType: row.roomType,
          numberOfAdults: row.numberOfAdults,
          numberOfChildren: row.numberOfChildren,
          vipType: row.vipType,
          notes: row.notes,
        });
      });
  
      worksheet.columns.forEach((column) => {
        column.alignment = { vertical: 'middle', horizontal: 'left' };
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Arrivals VIP Report_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };

  return (
    <div>
     
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Arrivals VIP Report</CardTitle>
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
                    // value={data1['dob']}
                    // options={doboptions}
                    // options={optionsToDate} 
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
              <Button className='me-1' color='primary' type='submit' onClick={()=>setflag1(true)} disabled={isButtonClicked}>
              {isButtonClicked ? 'Processing...' : 'Submit'} 
              </Button>
              {flag1 == true && 
              // <Button className='me-1' color='primary' onClick={onButtonExport}> Download Excel </Button>
              <Button
              className='me-1'
              color='primary'
              onClick={generateExcel}
              >
              Download Excel
              </Button>
              }
             {flag1 == true && <Button className='me-1' color='primary'  onClick={downloadPDF}>Print to PDF
              </Button>}
              {/* <Button className='me-1' color='primary' type='submit' onClick={()=>setflag1(false)}>
                Download
              </Button> */}
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
   {flag1 == true && <div className="ag-theme-alpine" >
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
            // modules={[CsvExportModule]} // Use modules property directly


            />
      </div>}
    </div>
  )
}


export default Block
