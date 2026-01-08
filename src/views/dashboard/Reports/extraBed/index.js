import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader,  } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import 'ag-grid-enterprise';
import {AgGridReact} from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
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

const ExtraBed = () => {

  // AG Grid
  const [rowData1, setRowData1] = useState();
  const gridRef = useRef();
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const { reset, handleSubmit, control,watch } = useForm({ defaultValues })
  const [flag1, setflag1] = useState(false)
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const frmdate = watch('frmdate');

  const [hotelDetails, setHotelDetails] = useState(null);
  const [hotelAddress, setHotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);


  
    //API to get hotel details
    useEffect(() => {

      fetchx(DASHBOARD_URL + "/getBusinessDate", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json())
        .then(postres => {
          setHotelDetails(postres['data'])
          setHotelAddress(postres['data'][0]['address'])
          setHotelName(postres['data'][0]['name'])
          setHotelNo(postres['data'][0]['phoneNumber'])
          sethotelFax(postres['data'][0]['fax'])
          setLogo(postres['data'][0]['logo'])
        })
        console.log(logoimage)
  
    }, [])


    function formatRate(rate) {
      // Convert rate to a number if it's a string
      const numericRate = parseFloat(rate);
    
      // Check if the rate is a valid number
      if (!isNaN(numericRate)) {
        // Apply formatting: add commas and fix to two decimal places
        const formattedRate = numericRate.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return formattedRate;
      } else {
        // Return the original value if it's not a valid number
        return rate;
      }
    }


   const [columnDefs, setColumnDefs] = useState([
    {headerName: 'billNo',field: 'billNo',suppressSizeToFit: true, maxWidth: 100 },
    {headerName: 'Room No.',field: 'roomNumber',suppressSizeToFit: true, maxWidth: 140 },
    {headerName: 'Guest Name ',field: 'guestName',suppressSizeToFit: true, maxWidth: 170, wrapText: true,autoHeight:true },
    {headerName: 'Users',field: 'users',suppressSizeToFit: true, maxWidth: 100 },
    {headerName: 'Date',field: 'appliedDate',suppressSizeToFit: true, maxWidth: 140, 
    cellRenderer: (params) => {
      if (params.data && params.data.appliedDate) {
        const formattedDate = Moment(params.data.appliedDate).format("DD.MM.YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    } },
    {headerName: 'Arrival Date',field: 'arrivalDate',suppressSizeToFit: true, maxWidth: 140,
    cellRenderer: (params) => {
      if (params.data && params.data.arrivalDate) {
        const formattedDate = Moment(params.data.arrivalDate).format("DD.MM.YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    }  },
    {headerName: 'Departure Date',field: 'departureDate',suppressSizeToFit: true, maxWidth: 160,cellRenderer: (params) => {
      if (params.data && params.data.departureDate) {
        const formattedDate = Moment(params.data.departureDate).format("DD.MM.YYYY");
        return formattedDate;
      } else {
        return "";     
      }
    }  },
    {headerName: 'Adults',field: 'numberOfAdults',suppressSizeToFit: true, maxWidth: 110 },
    {headerName: 'Children',field: 'numberOfChildren',suppressSizeToFit: true, maxWidth: 130 },
    {headerName: 'Base Rate',field: 'baseRate',suppressSizeToFit: true, maxWidth: 140, 
      valueFormatter: (params) => {
        return formatRate(params.value);
      }, 
    },
  ]);
  



  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
  };
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

  const onSubmit = data => {
    setIsButtonClicked(true)
    setOpen(true)
    const filterFromDate = Moment(data.frmdate[0]).format("YYYY-MM-DD");
    const filterToDate = Moment(data.todate[0]).format("YYYY-MM-DD");  
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    setFlag(true)
    setData(data)
      let createmarketGroup = JSON.stringify({
        "hotelID": 1,
        startDate: filterFromDate,
       endDate: filterToDate,
      })
      if(flag1 ==true){

      let res = fetchx(DASHBOARD_URL+"/getExtrabedReport", {
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
      frmdate: '',
      todate:''
    })
  }

  const onBtnExport = () => {
    const params = {
      fileName: 'Extra Bed Report.xlsx',
      sheetName: 'Sheet1',
    };
    gridRef.current.api.exportDataAsExcel(params);
  };
  const printGrid = () => {
    if (filterFromDate && filterToDate) {
    const gridApi = gridRef.current && gridRef.current.api;
    const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.appliedDate)));

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
      console.log(logoimage)
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
      
      const textToCenter = "Extra bed Report";

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
      .forEach((appliedDate, index) => {
        const rowsForDate = rowData1
          .filter((row) => row.appliedDate === appliedDate)
          .map((row) => {
            const formattedApplied = formatDate(new Date(row.appliedDate));
            const formattedArrival = formatDate(new Date(row.arrivalDate));
            const formattedDeparture = formatDate(new Date(row.departureDate));
            const formattedDob = formatDate(new Date(row.dob));
    
            return {
              ...row,
              appliedDate: formattedApplied,
              arrivalDate: formattedArrival,
              departureDate: formattedDeparture,
              dob: formattedDob,
            };
          })
          .map((row) => columnDefs.map((column) => row[column.field]));
    
        const columns = columnDefs.map((column) => column.headerName);
        const tableHeight = 8;
        if (dateY + tableHeight > pdf.internal.pageSize.height - 20) {
          pdf.addPage();
          dateY = 10;
          currentPage++;
        }
    
        const totalAmountForDate = rowsForDate.reduce((total, row) => {
          const baseRate = parseFloat(row.find((item, index) => columnDefs[index].field === 'baseRate'));
          return total + (baseRate || 0);
        }, 0);
    
        const formattedArrivalDate = formatDate(new Date(appliedDate));
    
        let formattedTotalAmount = new Intl.NumberFormat('en-IN', {
          maximumFractionDigits: 2,
        }).format(Number(totalAmountForDate).toFixed(2));

                // Checking and appending '00' if there are no decimal points
        const indexOfDecimal = formattedTotalAmount.indexOf('.');
        if (indexOfDecimal === -1) {
          // If no decimal point is found, add '.00' to the end of the string
          formattedTotalAmount += '.00';
        } else {
          // If there is a decimal point, check the length after the decimal
          const decimalLength = formattedTotalAmount.length - indexOfDecimal - 1;
          if (decimalLength === 1) {
            // If only one digit after the decimal, add another '0'
            formattedTotalAmount += '0';
          }
        }
        

        pdf.setFont('times', 'bold');
        pdf.text(`Date: ${formattedArrivalDate}`, 10, dateY + 37, { width: 500, align: 'left' });
        pdf.autoTable({
          head: [columns],
          body: rowsForDate,
          startY: dateY + 40,
          didParseCell: (data) => {
            if (data.column.index == 7 || data.column.index == 10 ) {
              data.cell.styles.halign = 'right';
            }
            
          }
        });

        pdf.line(
          235, // Adjust X coordinate to start from where "Total drops" text starts
          pdf.autoTable.previous.finalY, // Y-coordinate - adjust based on your layout
          285, // Adjust X coordinate to end the line within the desired width
          pdf.autoTable.previous.finalY // Y-coordinate for the line
        );

        pdf.setFont('times', 'roman');
        pdf.text(`Total Base Rate: ${(formattedTotalAmount)}`, 260, pdf.autoTable.previous.finalY + 7, {
          width: 500,
          align: 'center',
        });

        pdf.line(
          235, // Adjust X coordinate to start from where "Total drops" text starts
          pdf.autoTable.previous.finalY + 10, // Y-coordinate - adjust based on your layout
          285, // Adjust X coordinate to end the line within the desired width
          pdf.autoTable.previous.finalY + 10 // Y-coordinate for the line
        );

        pdf.setFont('times', 'normal');
        dateY = pdf.autoTable.previous.finalY - 10;
      });

      dateY = pdf.autoTable.previous.finalY + 10;

      const availableSpace = pdf.internal.pageSize.height - dateY;

      // Check if the available space is enough for the content
      if (availableSpace < 30) { // Adjust '30' based on your content height
        pdf.addPage(); // Move to the next page
        dateY = 10; // Set Y position for the new page
      }

      let fromDate = formatDate(new Date(filterFromDate))
      let toDate = formatDate(new Date(filterToDate))
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      pdf.text(`Filter From Arrival Date: ${fromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
      pdf.text(`To Arrival Date: ${toDate}`, 10, dateY + 20, { width: 500, align: 'left' });
      for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
      pdf.setPage(i); 
      pdf.setFontSize(10); 
      
      const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
      const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      
      // Calculate position for center alignment
      const xPos = pageCenter - (pageNumberWidth / 2);
      const yPos = pdf.internal.pageSize.height - 10; // 10 units from the bottom
      
      pdf.text(pageNumber, xPos, yPos);
    }
      // Save or display the PDF as needed
      pdf.save('Extra Bed Report.pdf');
    } else {
    }  
    }

  };

  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Extra Bed Report');
  
      const columns = [
        { header: 'Bill No', key: 'billNo', width: 20 },
        { header: 'Room No', key: 'roomNumber', width: 15 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Users', key: 'users', width: 15 },
        { header: 'Date', key: 'appliedDate', width: 20 },
        { header: 'Arrival Date', key: 'arrivalDate', width: 20 },
        { header: 'Departure Date', key: 'departureDate', width: 20 },
        { header: 'Adults', key: 'numberOfAdults', width: 10 },
        { header: 'Children', key: 'numberOfChildren', width: 10 },
        { header: 'Base Rate', key: 'baseRate', width: 15 }
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'Extra Bed Report']);
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
          marketCode: item.marketCode?.replace(/\r?\n|\r/g, ''),
          description: item.description?.replace(/\r?\n|\r/g, '')
        }));
      };
  
      const sanitizedData = formattedData(rowData1);
  
      let totalBaseRate = 0;
      let totalAdults = 0;
      let totalChildren = 0;
  
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          billNo: row.billNo,
          roomNumber: row.roomNumber,
          guestName: row.guestName,
          users: row.users,
          appliedDate: row.appliedDate,
          arrivalDate: row.arrivalDate,
          departureDate: row.departureDate,
          numberOfAdults: row.numberOfAdults,
          numberOfChildren: row.numberOfChildren,
          baseRate: row.baseRate
        });
  
        totalBaseRate += parseFloat(row.baseRate || 0);
        totalAdults += parseInt(row.numberOfAdults || 0);
        totalChildren += parseInt(row.numberOfChildren || 0);
      });
  
      worksheet.addRow();
      worksheet.addRow({
        billNo: 'Totals',
        roomNumber: '',
        guestName: '',
        users: '',
        appliedDate: '',
        arrivalDate: '',
        departureDate: '',
        numberOfAdults: totalAdults,
        numberOfChildren: totalChildren,
        baseRate: totalBaseRate.toFixed(2)
      });
  
      const totalRow = worksheet.lastRow;
      totalRow.font = { bold: true };
  
      worksheet.columns.forEach((column, index) => {
        column.alignment = { vertical: 'middle', horizontal: index >= 5 && index <= 9 ? 'right' : 'left' };
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Extra Bed Report_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };
  
  

  return (
    <div>
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Extra Bed Report</CardTitle>
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
                    // value={data1['dob']}
                    // options={doboptions}
                    // options={optionsToDate}
                    required
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
          <Button className='me-1' color='primary'  onClick={printGrid}>Print PDF </Button>
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
   { flag == true && <div className="ag-theme-alpine" >
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
      </div>}
    </div>
  )
}

export default ExtraBed
