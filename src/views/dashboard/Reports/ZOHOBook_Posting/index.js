
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
// import App from "./roomInventoryDataTable";
import { useForm, Controller } from 'react-hook-form'
import { format } from "date-fns";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

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
        setToday(resp['data'][0]['businessDate'])
      }).catch((error) => {
        console.log(error)
      })
   
    
  }, []);
  const params = {
    fileName: 'Zoho Posting - Revenue ', // Set your desired file name here
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
    {headerName: 'Journal Number Prefix',field: 'Journal_Number_Prefix',width: 200},
    {headerName: 'Journal Number Suffix',field: 'Journal_Number_Suffix',width: 200},
    {headerName: 'Date',field: 'Date',maxWidth: 120},
    {headerName: 'Notes',field: 'Notes'},
    {headerName: 'Debit',field: 'debit',maxWidth: 150},
    {headerName: 'Credit',field: 'credit',maxWidth: 150},
    {headerName: 'Account',field: 'Account',width: 250},
    {headerName: 'Currency',field: 'Currency',maxWidth: 120},
    {headerName: 'Is Inclusive Tax',field: 'IsInclusiveTax',maxWidth: 150},
    {headerName: 'Exchange Rate',field: 'ExchangeRate'},
    {headerName: 'Tax Type',field: 'TaxType'},
    {headerName: 'Tax Basis',field: 'TaxBasis',maxWidth: 130},
    {headerName: 'Status',field: 'Statuss',maxWidth: 130},
    {headerName: 'Journal Type',field: 'JournalType',maxWidth: 150},
    {headerName: 'Description',field: 'Description',width: 300},
    {headerName: 'Cost Centers-Others',field: 'CostCenter_Others',width: 250},
    {headerName: 'Month for MIS',field: 'Month_for_MIS',maxWidth: 170},


  ]);
  const defaultColDef = useMemo( ()=> (
    {
      sortable: true, 
      filter: true,
      wraptext:true,
      filterParams :{
      buttons : ['apply','reset']
      }
    }
  ));
  const handleTransferTransaction=(event)=>{
    setselectedOption(event.target.value)
  }

  const[credit, setCredit]= useState(0)
  const[debit, setDebit] = useState(0)
  const ConfirmSubmit = (data) => {
    setIsButtonClicked(true)
    setOpen(true)
    setData(data)
    data.Date=(Moment(String(new Date(data.Date[0]))).format('YYYY-MM-DD'))
    const filterFromDate = Moment(data.Date).format("DD.MM.YYYY");
    setFilterFromDate(filterFromDate)

    setRowData([]);
    setLoadingVar(true)
fetchx(DASHBOARD_URL+'/getJournalEntries', {
  method: "POST",
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    hotelID: 1,
    date: data.Date
      })
    }).then(result => result.json())
    .then(resp => {
      setIsButtonClicked(false)
        if(resp.statusCode == 200){
          setOpen(false)
          let totalcredit=0;
          let totaldebit = 0;
            resp.data.forEach(item => {
              if(item.credit!= null){
                (totalcredit += item.credit).toFixed(2)
              }
              if(item.debit!= null){
                (totaldebit += item.debit).toFixed(2)
              }
        
            });
            totalcredit= totalcredit.toFixed(2)
            totaldebit = totaldebit.toFixed(2)
            setCredit(totalcredit);
            setDebit(totaldebit);
            setRowData(resp.data); // Setting rowData with the 'data' array
        }

        setLoadingVar(false)
    // });
    
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
    if (filterFromDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('ZOHO Posting Report');
  
      const columns = [
        { header: 'Journal Number Prefix', key: 'Journal_Number_Prefix', width: 10 },
        { header: 'Journal Number Suffix', key: 'Journal_Number_Suffix', width: 10 },
        { header: 'Date', key: 'Date', width: 20 },
        { header: 'Notes', key: 'Notes' ,width: 20},
        { header: 'Debit', key: 'debit', width: 20 },
        { header: 'Credit', key: 'credit', width: 20 },
        { header: 'Account', key: 'Account', width: 35 },
        { header: 'Currency', key: 'Currency', width: 15 },
        { header: 'Is Inclusive Tax', key: 'IsInclusiveTax', width: 15 },
        { header: 'Exchange Rate', key: 'ExchangeRate' , width: 10 },
        { header: 'Tax Type', key: 'TaxType', width: 15 },
        { header: 'Tax Basis', key: 'TaxBasis', width: 15 },
        { header: 'Status', key: 'Statuss', width: 20 },
        { header: 'Journal Type', key: 'JournalType', width: 20 },
        { header: 'Description', key: 'Description', width: 35 },
        { header: 'Cost Centers-Others', key: 'CostCenter_Others', width: 25 },
        { header: 'Month for MIS', key: 'Month_for_MIS', width: 15 }
      ];
  
      worksheet.columns = columns;
  
      worksheet.addRow(['Report Name:', 'ZOHO Posting Report']);
      worksheet.addRow(['Filter From Date:', filterFromDate]);
  
      worksheet.addRow();
      worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
  
      for (let i = 1; i <= 4; i++) {
        worksheet.getRow(i).font = { bold: true };
      }
  
      worksheet.spliceRows(1, 1);
  
      const formattedData = (rowData) => {
        return rowData.map(item => ({
          ...item,
          Date: Moment(item.Date).format("DD-MM-YYYY")
        }));
      };
  
      const sanitizedData = formattedData(rowData);
  
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          Journal_Number_Prefix: row.Journal_Number_Prefix,
          Journal_Number_Suffix: row.Journal_Number_Suffix,
          Date: row.Date,
          Notes: row.Notes,
          debit: row.debit,
          credit: row.credit,
          Account: row.Account,
          Currency: row.Currency,
          IsInclusiveTax: row.IsInclusiveTax,
          ExchangeRate: row.ExchangeRate,
          TaxType: row.TaxType,
          TaxBasis: row.TaxBasis,
          Statuss: row.Statuss,
          JournalType: row.JournalType,
          Description: row.Description,
          CostCenter_Others: row.CostCenter_Others,
          Month_for_MIS: row.Month_for_MIS,
        });
      });
  
      // Calculate total for Debit and Credit
      const totalDebit = sanitizedData.reduce((sum, row) => sum + parseFloat(row.debit), 0);
      const totalCredit = sanitizedData.reduce((sum, row) => sum + parseFloat(row.credit), 0);
  
      // Add total row
      worksheet.addRow({
        Journal_Number_Prefix: 'Total',
        debit: totalDebit,
        credit: totalCredit
      }).font = { bold: true };
  
      worksheet.columns.forEach((column, index) => {
        if ([5, 6].includes(index + 1)) {
          column.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          column.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `ZOHO_Posting_Report_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  };
  

  return (
    <div>
     <Card>
          <CardHeader>
            <CardTitle tag="h4"><b>ZOHO Posting</b></CardTitle>
          </CardHeader>
        </Card>
        <Form onSubmit={handleSubmit(ConfirmSubmit)}>
            <Row>
           
              <Col md='4' sm='12'>
                <div className='mb-1'>
                  <Label className='form-label' for='Date'>
                    Date<spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id='Date'
                    name='Date'
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
                          'is-invalid': data !== null && data.Date === null
                        })}
                      />
                    )}
                  />
                </div>
              </Col>
             
             
             
              
              <Col md='4' sm='12'>
              <div align='right'>
                <Button style={{ marginTop: '22px'}} color='primary' className='me-1' type='submit' disabled={isButtonClicked}>
                {isButtonClicked ? 'Processing...' : 'Submit'} 
                </Button>
                

              </div>
              </Col>
           
        
                      <Col md='4' sm='12'>
            <div className='inline-spacing' align="right" style={{ margin: '2px 0' }}>
            {/* <Button.Ripple color='primary' style={{ marginTop: '22px'}} onClick={onBtnExport} disabled={rowData.length==0} >Download CSV file</Button.Ripple> */}
            <Button.Ripple color='primary' style={{ marginTop: '22px'}} onClick={generateExcel} disabled={rowData.length==0} >Download Excel</Button.Ripple>

            </div>
            </Col>

            <Row>
            <Col>
            <h5 style={{ fontWeight: 'bold' }}> Credit : {credit} </h5>
            </Col>
              <Col>
            <h5 style={{ fontWeight: 'bold' }}> Debit : {debit} </h5>
            </Col>
            <Col>
            <h5 style={{ fontWeight: 'bold' }}> Credit - Debit : {(credit-debit).toFixed(2)} </h5>
            </Col>
            </Row>
           
            </Row>
          </Form>

           {/* <Col>
          <h4>Summary of the Guest Ledger: </h4>
           {  
           details !== "" && <div>
            <Row>
            <Col>
            <h5>Room Revenue  </h5>
            </Col>
            <Col>
            <h5>FNB Revenue  </h5>
            </Col>
            <Col>
            <h5>Other Revenue  </h5>
            </Col>
            <Col>
            <h5>Payments </h5>
            </Col>
            <Col>
            <h5>Ledger Balance </h5>
            </Col> */}

          

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
    {/* <App/> */}
    </div>
  );
};

export default AvailabilityMatrix;





