import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader} from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useRef, useEffect, useMemo, useCallback} from 'react';
import DASHBOARD_URL from '../../../../dashboard'
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

const PaidoutReport= () => {
  const [rowData1, setRowData1] = useState();
  const gridRef = useRef();
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const [flag1, setflag1] = useState(false)
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const { reset, handleSubmit, control,watch } = useForm({ defaultValues })
  const frmdate = watch('frmdate');
  const [rowData, setRowData] = useState();
  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);



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

// const cleanHeaderRow = headerRow.replace(/"/g, '').replace(/sum\(([^)]+)\)/g, '$1');
// const columnsToFormat = [5,6,7,8,9,10,11,12,13];


// rowsForDate.forEach(row => {
//      columnsToFormat.forEach(columnIndex => {
//        const value = row[columnIndex];
//        if (value !== undefined) {
//          row[columnIndex] = Number(value).toFixed(2);
//        }
//        if (!isNaN(Number(value))) {
//          // Format the number with maximumFractionDigits: 2
//          row[columnIndex] = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(Number(value));
//        }
//      });
//    });

   const [columnDefs, setColumnDefs] = useState([
    {headerName: 'Booking ID',field: 'bookingID',suppressSizeToFit: true, maxWidth: 130 },
    {headerName: 'Guest Name ',field: 'guestName',suppressSizeToFit: true, maxWidth: 200,wrapText: true,autoHeight:true },
    { headerName: 'Transaction Date', field: 'transactiondate', suppressSizeToFit: true, width: 200 ,
    cellRenderer: (params) => {
      if (params.data && params.data.transactiondate) {
        const formattedDate = Moment(params.data.transactiondate).format("DD.MM.YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    } 
  },
    {headerName: 'Date-Time ',field: 'DateTime',suppressSizeToFit: true, maxWidth: 190,cellRenderer: (params) => {
      if (params.data && params.data.DateTime) {
        const formattedDate = Moment(params.data.DateTime).format("DD.MM.YYYY  hh:mm");
        return formattedDate;
      } else {
        return "";     
      }
    } },
    { headerName: 'User', field: 'first_name', suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'BillNo',field: 'billNo',suppressSizeToFit: true, maxWidth: 130 },
    {headerName: 'Room No',field: 'roomNumber',suppressSizeToFit: true, maxWidth: 130 },
    {headerName: 'Amount',field: 'base_amount',suppressSizeToFit: true, maxWidth: 130,valueFormatter: formatCurrency },          
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

  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
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
    console.log(rowData['data'][0])
    console.log(rowData['data'][0].name)
    sethotelAddress(rowData['data'][0].address)
    setHotelName(rowData['data'][0].name)
    setHotelNo(rowData['data'][0]['phoneNumber'])
    sethotelFax(rowData['data'][0]['fax'])
    setLogo(rowData['data'][0]['logo'])
  })
},[])

  const onSubmit = data => {
    setIsButtonClicked(true)
    setOpen(true)
    const filterFromDate = Moment(data.frmdate[0]).format("DD.MM.YYYY");
    const filterToDate = Moment(data.todate[0]).format("DD.MM.YYYY");  
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    setFlag(true)
    setData(data)
      let createmarketGroup = JSON.stringify({
        "hotelID": 1,
        startDate:  Moment(data.frmdate[0]).format("YYYY-MM-DD"),
        endDate: Moment(data.todate[0]).format("YYYY-MM-DD"),
      })

      if(flag1 ==true){
        let res = fetchx(DASHBOARD_URL+"/getPaidOutsReport", {
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
   
  }

  const onBtnExport = () => {
    const params = {
      fileName: 'Paid Out Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };
   
  const printGrid = () => {
    if (filterFromDate && filterToDate) {
    const gridApi = gridRef.current && gridRef.current.api;
    const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.transactiondate)));

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

      pdf.addImage(DASHBOARD_URL+`/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

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
    
    // Set hotel name
    setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo,14);
    setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8,12); 
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
      const textToCenter = "Paid Out Report";

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
      pdf.setFont('helvetica', 'bold');

      dateY = 10;
      // const pageWidth = pdf.internal.pageSize.getWidth();
      // const logoWidth = 15;
      // const xCenter = (pageWidth - logoWidth) / 2;
      // const logoHeight = 15;
      // pdf.addImage(Logo, 'JPEG', xCenter, 8, logoWidth, logoHeight);
      // pdf.setFontSize(12); 
      // pdf.setFont('helvetica', 'bold');
      // pdf.text(`${hotelName}`, 135, 30);
      // pdf.text(`${hotelAddress}`, 100, 36);
      // pdf.text('Paid Out Report', 130, 42);    
      // let dateY = 10;
   
      // const margin = { left: 10, right: 10 };
      // const currentDate = new Date();
      // const formattedDate = formatDates(currentDate);
      // const paddingFromRight = 100;
      // const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
      // pdf.setFont('times', 'normal');  
      // pdf.text("Report Generated Time " + formattedDate, dateX, dateY);
      // const pageCenter = pdf.internal.pageSize.width / 2;
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
     .forEach((transactiondate, index) => {
       const rowsForDate = rowData1
         .filter((row) => row.transactiondate === transactiondate)
         .map((row) => {
          const formattedDeparture = formatDates(new Date(row.DateTime));
          const formattedtransactiondate = formatDate(new Date(row.transactiondate));
          // const formattedPickUpDate = formatDate(new Date(row.DateTime));
          const isMain = row.isMain;    

          return {
            ...row,
            DateTime: formattedDeparture,
            transactiondate: formattedtransactiondate,
            // DateTime: formattedPickUpDate,
            isMain: isMain

          };
        })
         .map((row) => columnDefs.map((column) => row[column.field]));
     
       const columns = columnDefs.map((column) => column.headerName);
    const tableHeight = 8;
    let currentPage = 1;
    if (dateY + tableHeight > pdf.internal.pageSize.height - 20) {
      pdf.addPage();
      dateY = 10;
      currentPage++; 
    }
    let totalRooms = rowsForDate.length;
    const filteredRoomRows = rowsForDate.filter(row => row[8] !== 0);
    totalRooms = filteredRoomRows.length;

    const totalCount = rowsForDate.length;
    pdf.setFont('times', 'bold');
    const formattedtransactiondate = formatDate(new Date(transactiondate));
    
    const totalAmountForDate = rowsForDate.reduce((total, row) => {
     const base_amount = parseFloat(row.find((item, index) => columnDefs[index].field === 'base_amount'));
     return total + (base_amount || 0);
   }, 0);
  
      const formattedTotalAmount = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
      }).format(Number(totalAmountForDate).toFixed(2));

      const filteredColumns = columns.filter(columnName => columnName !== 'isMain');

       pdf.text(`Transaction Date: ${formattedtransactiondate}`, 10, dateY + 30, { width: 500, align: 'left' });   
       const cleanHeaderRow = headerRow.replace(/"/g, '').replace(/sum\(([^)]+)\)/g, '$1');
        const columnsToFormat = [7];
    
    
        rowsForDate.forEach(row => {
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
       pdf.autoTable({
         head: [filteredColumns],
         body: rowsForDate,
         startY: dateY + 33, 
         didParseCell: (data) => {
          if (data.column.index == 7  ) {
            data.cell.styles.halign = 'right';
          }
        }
       });
      //  pdf.line(margin.left, pdf.autoTable.previous.finalY + 2, pdf.internal.pageSize.width - margin.right, pdf.autoTable.previous.finalY + 2);
      pdf.line(
        200, 
        pdf.autoTable.previous.finalY, 
        285, 
        pdf.autoTable.previous.finalY 
      );
       pdf.setFont('times', 'roman');
       pdf.text(` Total Amount: ${formattedTotalAmount}`, 250, pdf.autoTable.previous.finalY + 5, { width: 500, align: 'center' });     

       pdf.text(`Total : ${totalCount}`, 280, pdf.autoTable.previous.finalY + 5, {
         width: 500,
         align: 'center',
       });

       pdf.text(`Total Rooms : ${totalRooms}`,200, pdf.autoTable.previous.finalY + 5, { width: 500, align: 'left', });

     
      //  pdf.line(margin.left, pdf.autoTable.previous.finalY + 15, pdf.internal.pageSize.width - margin.right, pdf.autoTable.previous.finalY + 15);
      pdf.line(200,
        pdf.autoTable.previous.finalY + 8, 
        285,
        pdf.autoTable.previous.finalY + 8 
      );
      pdf.setFont('times', 'normal');  
       dateY = pdf.autoTable.previous.finalY ;

      });

      dateY = pdf.autoTable.previous.finalY + 20;
      const availableSpace = pdf.internal.pageSize.height - dateY;
      if (availableSpace < 30) {
      pdf.addPage(); 
      dateY = 10;
}
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
       pdf.text(`Filter From Date: ${filterFromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
       pdf.text(`To Date: ${filterToDate}`, 10, dateY + 20, { width: 500, align: 'left' });
    
       for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
        pdf.setPage(i); 
        pdf.setFontSize(10);
        
        const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
        const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const xPos = pageCenter - (pageNumberWidth / 2);
        const yPos = pdf.internal.pageSize.height - 10; 
        
        pdf.text(pageNumber, xPos, yPos);
      }

      pdf.save('Paid Out Report.pdf');
    } else {
    }  
    }
  };

  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Paidout Report');
  
      const columns = [
        { header: 'Booking ID', key: 'bookingID', width: 20 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Transaction Date', key: 'transactiondate', width: 20 },
        { header: 'Date-Time', key: 'DateTime', width: 20 },
        { header: 'User', key: 'first_name', width: 20 },
        { header: 'Bill No', key: 'billNo', width: 20 },
        { header: 'Room No', key: 'roomNumber', width: 20 },
        { header: 'Amount', key: 'base_amount', width: 20 }
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'Paidout Report']);
      worksheet.addRow(['Filter From Date:', filterFromDate]);
      worksheet.addRow(['To Date:', filterToDate]);
      worksheet.addRow();
      worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
      for (let i = 1; i <= 5; i++) {
        worksheet.getRow(i).font = { bold: true };
      }
  
      worksheet.spliceRows(1, 1);
  
      const formattedData = (rowData1) => {
        return rowData1.map(item => ({
          ...item,
          transactiondate: Moment(item.transactiondate).format("DD.MM.YYYY"),
          DateTime: Moment(item.DateTime).format("DD.MM.YYYY HH:mm"),
          base_amount: Math.abs(parseFloat(item.base_amount || 0)).toFixed(2)
        }));
      };
  
      const sanitizedData = formattedData(rowData1);
  
      // Adding rows to the worksheet
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          bookingID: row.bookingID,
          guestName: row.guestName,
          transactiondate: row.transactiondate,
          DateTime: row.DateTime,
          first_name: row.first_name,
          billNo: row.billNo,
          roomNumber: row.roomNumber,
          base_amount: row.base_amount
        });
      });
  
      // Calculate the total for the Amount column
      const totalAmount = sanitizedData.reduce((acc, row) => acc + parseFloat(row.base_amount), 0).toFixed(2);
  
      // Add the total row below the data
      worksheet.addRow([]);
      worksheet.addRow(['Total:', '', '', '', '', '', '', totalAmount]).font = { bold: true };
  
      worksheet.columns.forEach((column, index) => {
        if ([8].includes(index + 1)) {
          column.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          column.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });
  
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Paidout Report_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };
  

  return (
    <div>
       <Card>
      <CardHeader>
        <CardTitle tag='h4'>Paidout Report</CardTitle>
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
                    options={{ allowInput: true }} 
                    // options={optionsToDate} 
                    placeholder="YYYY-MM-DD "
                    className={classnames("form-control", {
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
              {/* <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}> Reset  </Button> */}
              {flag == true &&  
              // <Button className='me-1' color='primary' type='submit'  onClick={onBtnExport}> Download Excel </Button>
              <Button
              className='me-1'
              color='primary'
              onClick={generateExcel}
              >
              Download Excel
              </Button>
              }
              {flag == true && <Button className='me-1' color='primary' onClick={printGrid}>Print PDF </Button>}
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
    {/* onClick={handleDownload} */}
    {flag == true && <div className="ag-theme-alpine">
        <AgGridReact 
            ref={gridRef}
            rowData={rowData1} 
            columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            domLayout='autoHeight'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            
            />
      </div>}
    </div>
  )
}
export default PaidoutReport