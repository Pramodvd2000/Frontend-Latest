
// ** React Imports
import { useState } from "react";
// ** Third Party Components;
import "cleave.js/dist/addons/cleave-phone.us";
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Moment from 'moment'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid

import {AgGridReact} from 'ag-grid-react';
import { useForm, Controller } from 'react-hook-form'
import { format } from "date-fns";

import 'ag-grid-enterprise'
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';// import './Assettable.css';
import { useRef, useEffect, useMemo, useCallback} from 'react';
import DASHBOARD_URL from "../../../../dashboard";
import {
    AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, Accordion, InputGroup, NavLink
  } from 'reactstrap'
import { event } from "jquery";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// let today = Moment().format('YYYY-MM-DD')
// console.log(today)
  let defaultValues = {  }
const AvailabilityMatrix = () => {

  // AG Grid
  const [rowData, setRowData] = useState([]);
  const [selectedOption,setselectedOption] = useState('Date')
  const [Today,setToday] = useState()
  const [LoadingVar,setLoadingVar] = useState(false)
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);

  const optionsToDate = {
  
    // maxDate:Moment(new Date(Today)).subtract(1, 'days')
    // maxDate:Today
    maxDate : new Date().setDate(new Date(Today).getDate() - 1)
  
  };

  useEffect(() => {
    fetchx(DASHBOARD_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
          })
    }).then(result => result.json())
    .then(resp => {
        console.log(resp['data'])
        setToday(resp['data'][0]['businessDate'])
      }).catch((error) => {
        console.log(error)
      })
    // fetchx(DASHBOARD_URL + '/getinventory?hotelID=1')
    console.log()
//     fetchx('http://122.166.2.21:14780/getGuestLedgerForDay?hotelID=1&date='+Moment(new Date(Today)).subtract(1, 'days').format('YYYY-MM-DD'))
//     .then(result => result.json())
//     .then(rowData =>{
//       // for(let i=0; i<10;i++){
//       console.log(rowData['data'])

// console.log(rowData['data'])
// setRowData(rowData['data'])
//     }
//     )


    // fetchx('http://122.166.2.21:14900/v4/getZOHOSummaryReport', {
    //   method: "POST",
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     hotelID: 1,
    //     date: Moment(new Date(Today)).subtract(1, 'days').format('YYYY-MM-DD')
    //       })
    // }).then(result => result.json())
    // .then(resp => {
    //     console.log(resp['data'])
    //     console.log(resp['data'])
    //     setRowData(resp['data'])
    //   }).catch((error) => {
    //     console.log(error)
    //   })
    
  }, []);
  const params = {
    fileName: 'Zoho Posting - Invoice ', // Set your desired file name here
  };
  let defaultValues = {
   
    Date: [Moment((new Date(Today))).subtract(1, 'days').format('YYYY-MM-DD')],
    
  }
  const gridRef = useRef();
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
  
  
  const [columnDefs, setColumnDefs] = useState([
    // {headerName: 'ID',field: 'id',suppressSizeToFit: true,maxWidth: 160},
    // {headerName: 'Hotel ID',field: 'hotelID',suppressSizeToFit: true},
    // {headerName: 'Room ID',field: 'roomID'},
    {headerName: 'Company Name',field: 'CompanyName',width: 250,wrapText:true},
    {
      headerName: 'Date',
      field: 'invoiceDate',
      maxWidth: 140,
      cellRenderer: function(params) {
          // Get the original date value
          const originalDate = params.value;
          
          // Convert the original date string to a JavaScript Date object
          const dateObject = new Date(originalDate);
          
          // Get the day, month, and year from the date object
          const day = String(dateObject.getDate()).padStart(2, '0');
          const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
          const year = dateObject.getFullYear();
          
          // Create the formatted date string
          const formattedDate = `${day}-${month}-${year}`;
          
          // Return the formatted date string
          return formattedDate;
      }
  },
    // {headerName: 'Journal Number Suffix.',field: 'roomNumber',maxWidth: 120},
    {headerName: 'Bill',field: 'Invoice_No',maxWidth: 160},
    {headerName: 'Amount',field: 'Amount',maxWidth: 130},
    {headerName: 'Item Name',field: 'Account',width: 370},
    {headerName: 'Account',field: 'AccountName',width: 370},
    {headerName: 'Item Tax',field: 'Item_Tax',maxWidth: 130},
    {headerName: 'Item Tax %',field: 'Item_Tax_Per' ,maxWidth: 130},
    {
      headerName: 'Item Tax Amount',
      valueGetter: '0',
      maxWidth: 180,
      suppressSizeToFit: true
    },
    {headerName: 'Item Tax Type',field: 'Item_Type_Tax'},
    {headerName: 'HSN/SAC',field: 'SAC_Codes',maxWidth: 130},
    {headerName: 'Month for MIS',field: 'Month_for_MIS',maxWidth: 180},


    // {headerName: 'Guest Name',field: 'guestName',width: 260},
    // {headerName: 'Customer Name',field: 'customerName',width: 180},
    // {headerName: 'GST Treatment',field: 'GST_Treatment',maxWidth: 200},
    // {headerName: 'GST Identification No',field: 'GST_IdentificationNo',maxWidth: 200},
    // {headerName: 'Place of Supply',field: 'Place_Of_Supply',maxWidth: 160},
    // {headerName: 'Currency Code',field: 'Currency_Code',maxWidth: 140},
    // {headerName: 'Exchange Rate',field: 'Exchange_Rate'},

    // {headerName: 'Item Description',field: 'Item_Description',width: 200},
    // {headerName: 'Item Type',field: 'Item_Type',maxWidth: 140},
   
    // {headerName: 'Quantity',field: 'Quantity',maxWidth: 110},

   
    // {headerName: 'Is Inclusive Tax',field: 'Inclusive_Of_Tax'},
   







  ]);
  const defaultColDef = useMemo( ()=> (
    {
      sortable: true, 
      filter: true,
      wrapText:true,
      filterParams :{
      buttons : ['apply','reset']
      }
    }
  ));
  const handleTransferTransaction=(event)=>{
    console.log(event)
    setselectedOption(event.target.value)
  }
  const ConfirmSubmit = (data) => {
    setIsButtonClicked(true)
    setOpen(true)
    console.log(data)
    setData(data)
    data.FromDate=(Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD'))
    data.ToDate=(Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD'))
//     console.log('http://122.166.2.21:14780/getGuestLedgerForDay?hotelID=1&date='+data.Date)
//     fetchx('http://122.166.2.21:14780/getGuestLedgerForDay?hotelID=1&date='+data.Date)
//     .then(result => result.json())
//     .then(rowData =>{
//       // for(let i=0; i<10;i++){
//       console.log(rowData['data'])

// console.log(rowData['data'])
// setRowData(rowData['data'])
//     }
//     )
const filterFromDate = Moment(data.FromDate).format("DD.MM.YYYY");
const filterToDate = Moment(data.ToDate).format("DD.MM.YYYY");

setFilterFromDate(filterFromDate);
setFilterToDate(filterToDate);
setRowData([]);
setLoadingVar(true)

fetchx(DASHBOARD_URL+'/getInvoicesSummary', {
  method: "POST",
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    hotelID: 1,
    FromDate: data.FromDate,
    ToDate: data.ToDate
      })
}).then(result => result.json())
.then(resp => {
  setIsButtonClicked(false)
    console.log(resp)
    

    if(resp.statusCode==200){
      setOpen(false)
      console.log(resp['data'])
      setRowData(resp['data'])

    }
    setLoadingVar(false)

  }).catch((error) => {
    console.log(error)
    setLoadingVar(false)

  })


  }
  const cellClickedListener = useCallback( event => {
    console.log('cellClicked', event);
  }, []);

 
 

  // ** State
  const [data, setData] = useState(null);

  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv(params);
  }, []);

  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('ZOHO Invoice Posting Report');
    
      const columns = [
        { header: 'Company Name', key: 'CompanyName', width: 30 },
        { header: 'Date', key: 'invoiceDate', width: 20 },
        { header: 'Bill', key: 'Invoice_No', width: 25 },
        { header: 'Amount', key: 'Amount', width: 20 },
        { header: 'Item Name', key: 'Account', width: 30 },
        { header: 'Account', key: 'AccountName', width: 30 },
        { header: 'Item Tax', key: 'Item_Tax', width: 20 },
        { header: 'Item Tax %', key: 'Item_Tax_Per', width: 20 },
        { header: 'Item Tax Amount', key: 'Item_Tax_Amount', width: 20 },
        { header: 'Item Tax Type', key: 'Item_Type_Tax', width: 20 },
        { header: 'HSN/SAC', key: 'SAC_Codes', width: 20 },
        { header: 'Month for MIS', key: 'Month_for_MIS', width: 20 }
      ];
    
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'ZOHO Invoice Posting Report']);
      worksheet.addRow(['Filter From Date:', filterFromDate]);
      worksheet.addRow(['To Date:', filterToDate]);
      
      worksheet.addRow();
      worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
    
      for (let i = 1; i <= 4; i++) {
        worksheet.getRow(i).font = { bold: true };
      }
    
      worksheet.spliceRows(1, 1);
    
      const formattedData = (rowData) => {
        return rowData.map(item => ({
          ...item,
          invoiceDate: Moment(item.invoiceDate).format("DD-MM-YYYY")
        }));
      };
    
      const sanitizedData = formattedData(rowData);
    
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          CompanyName: row.CompanyName,
          invoiceDate: row.invoiceDate,
          Invoice_No: row.Invoice_No,
          Amount: row.Amount,
          Account: row.Account,
          AccountName: row.AccountName,
          Item_Tax: row.Item_Tax,
          Item_Tax_Per: row.Item_Tax_Per,
          Item_Tax_Amount: row.Item_Tax_Amount,
          Item_Type_Tax: row.Item_Type_Tax,
          SAC_Codes: row.SAC_Codes,
          Month_for_MIS: row.Month_for_MIS,
        });
      });
    
      // Calculate total for Amount
      const totalAmount = sanitizedData.reduce((sum, row) => sum + parseFloat(row.Amount), 0);
    
      // Add total row
      worksheet.addRow({
        CompanyName: 'Total',
        Amount: totalAmount
      }).font = { bold: true };
    
      worksheet.columns.forEach((column, index) => {
        if ([4].includes(index + 1)) {
          column.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          column.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });
      
    
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
    
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `ZOHO_Invoice_Posting_Report_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };
  

  return (
    <div>
     <Card>
          <CardHeader>
            <CardTitle tag="h4"><b>ZOHO Invoice Posting</b></CardTitle>
          </CardHeader>
        </Card>
        <Form onSubmit={handleSubmit(ConfirmSubmit)}>
            <Row>
           
            <Row>
           
              <Col md='4' sm='12'>
                <div className='mb-1'>
                  <Label className='form-label' for='FromDate'>
                    From Date<spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id='FromDate'
                    name='FromDate'
                    required
                    render={({ field }) => (
                      <Flatpickr
                        // disabled={isSubmitted}
                        
                        {...field}
                        required
                        options={{ allowInput: true }}
                        // options={optionsToDate}
                        placeholder='YYYY-MM-DD '
                        className={classnames('form-control', {
                          'is-invalid': data !== null && data.FromDate === null
                        })}
                      />
                    )}
                  />
                </div>
              </Col>
              </Row>
              <Row>
              <Col md='4' sm='12'>
                <div className='mb-1'>
                  <Label className='form-label' for='ToDate'>
                    To Date <spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id='ToDate'
                    name='ToDate'
                    required
                    render={({ field }) => (
                      <Flatpickr

                        // disabled={isSubmitted}
                        {...field}
                        required
                        options={{ allowInput: true }}
                        // options={optionsToDate}
                        placeholder='YYYY-MM-DD '
                        className={classnames('form-control', {
                          'is-invalid': data !== null && data.ToDate === null
                        })}
                      />
                    )}
                  />
                </div>
              </Col>
              </Row>
              
             
             
             
              
              <Col md='4' sm='12'>
              <div align='right'>
                <Button style={{ marginTop: '22px'}} color='primary' className='me-1' type='submit' disabled={isButtonClicked}>
                {isButtonClicked ? 'Processing...' : 'Submit'} 
                </Button>
                

              </div>
              </Col>

              <Col md='8' sm='12'>
            <div className='inline-spacing' align="right" style={{ margin: '2px 0' }}>
            {/* <Button.Ripple color='primary' style={{ marginTop: '22px'}} onClick={onBtnExport} disabled={rowData.length==0} >Download CSV file</Button.Ripple> */}
            <Button.Ripple color='primary' style={{ marginTop: '22px'}} onClick={generateExcel} disabled={rowData.length==0} >Download Excel</Button.Ripple>

            </div>
            </Col>
            </Row>
          </Form>
    <div className="ag-theme-alpine" style={{ height: 530}}>
        <AgGridReact 
            ref={gridRef}
            rowData={rowData} columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            // paginationAutoPageSize = 'true'
            paginationPageSize= '10'
            pagination = 'true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            
            />
      </div>
    {/* <App/> */}

    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={LoadingVar}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                    Please wait... We're processing your request,
                    </h1>
                    {(
                      <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                       which may take a little longer due to additional data. Please be patient!
                      </h1>
                    )}
                    <CircularProgress color="inherit" />
                  </div>
                </Backdrop>
    </div>
  );
};

export default AvailabilityMatrix;

