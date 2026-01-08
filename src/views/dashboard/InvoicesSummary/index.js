
// ** React Imports
import { useState } from "react";
// ** Third Party Components;
import "cleave.js/dist/addons/cleave-phone.us";
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Moment from 'moment'
import Select from "react-select";
import { selectThemeColors } from "@utils";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import toast from "react-hot-toast";

let is_test = false
// Import ag-grid

import {AgGridReact} from 'ag-grid-react';
import { useForm, Controller } from 'react-hook-form'
import { format } from "date-fns";

import 'ag-grid-enterprise'
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';// import './Assettable.css';
import { useRef, useEffect, useMemo, useCallback} from 'react';
import API_URL from "../../../config";
import {
    AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, Accordion, InputGroup, NavLink
  } from 'reactstrap'
import { event } from "jquery";
import DASHBOARD_URL from "../../../dashboard";

  let defaultValues = {  }
  let setBookerData = []
const CompanyWiseBills = () => {

  // AG Grid
  const [rowData, setRowData] = useState([]);
  const [selectedOption,setselectedOption] = useState('Date')
  const [isBooker,setisBooker] = useState(true)
  const [Today,setToday] = useState()
  const [companyID, setCompanyID] = useState([]);
  const [SelectedCompany,setSelectedCompany]= useState()
  const [SummarizedBills,setSummarizedBills] = useState([])
  const [ButtonState,setButtonState] = useState(false)
  const [ShowSummaryInv,setShowSummaryInv] = useState(false)
  const [CompanyList,setCompanyList] = useState([])
  const [CompanyModal, setCompanyModal] = useState(false);
  const [CompanyLabel, setCompanyLabel] = useState('');
  const [CompanyValue, setCompanyValue] = useState(null);
  const [ShowInv,setShowInv] = useState('')
  const [InvURL,setInvURL] = useState('')
  const [ccOpen, setCCOpen] = useState(false)
  const [CompanyEmail,setCompanyEmail] = useState()
  const [CC1_Email,setCC1_Email] = useState('')
  const [composeOpen, setcomposeOpen] = useState(false)
  const [FormData,setFormData] = useState([])

  // const [BookerData, setBookerData] = useState([]);

  const [LoadingVar,setLoadingVar] = useState(false)
  const gridRef1 = useRef()

  const optionsToDate = {
  
    // maxDate:Moment(new Date(Today)).subtract(1, 'days')
    // maxDate:Today
    maxDate : new Date().setDate(new Date(Today).getDate())
  
  };

  useEffect(() => {
    fetch(DASHBOARD_URL + "/getBusinessDate", {
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
    fileName: 'Invoice summary', // Set your desired file name here
  };
  let defaultValues = {
   
    Date: [Moment((new Date(Today))).subtract(1, 'days').format('YYYY-MM-DD')],
    
  }
  const gridRef = useRef();
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })


  const [columnDefs, setColumnDefs] = useState([
    {
        headerName: 'Sl No',
        valueGetter: 'node.rowIndex + 1',
        maxWidth: 100,
        suppressSizeToFit: true
      },
    {headerName: 'Name',field: 'Name',suppressSizeToFit: true,maxWidth: 200},
    {headerName: 'billNoDisplay',field: 'billNoDisplay',suppressSizeToFit: true},
    // {headerName: 'PONumber',field: 'PONumber'},
    {headerName: 'Date',field: 'Date',maxWidth: 140},
    {headerName: 'NatureOfBill',field: 'NatureOfBill',maxWidth: 150},
    {headerName: 'BookingID',field: 'BookingID',maxWidth: 160},
    
    {headerName: 'CheckInDate',field: 'CheckInDate',width: 150},
    {headerName: 'CheckOutDate',field: 'CheckOutDate',width: 150},
    {headerName: 'NoOfDays',field: 'NoOfDays',maxWidth: 150},
    {headerName: 'stayTotal',field: 'stayTotal',maxWidth: 150},
    { headerName: 'Food', field: 'FoodAndBeverages.Food' ,maxWidth: 150},
    { headerName: 'Beverages', field: 'FoodAndBeverages.Beverages' ,maxWidth: 150},
    { headerName: 'Smokes', field: 'FoodAndBeverages.Smokes' ,maxWidth: 150},
    { headerName: 'Liquor', field: 'FoodAndBeverages.Liquor' ,maxWidth: 150},
    { headerName: 'Others', field: 'FoodAndBeverages.Others' ,maxWidth: 150},
    { headerName: 'Total F&B', field: 'FoodAndBeverages.FnBTotal',maxWidth: 150 },
    { headerName: 'SPA', field: 'MOD.SPA' ,maxWidth: 150},
    { headerName: 'Laundry', field: 'MOD.Laundry',maxWidth: 150 },
    { headerName: 'Total MOD', field: 'MOD.MODTotal',maxWidth: 150 },
    { headerName: 'CGST_0%', field: 'GST.CGST-0%',maxWidth: 150 },
    { headerName: 'SGST_0%', field: 'GST.SGST-0%' ,maxWidth: 150},
    { headerName: 'CGST_2.5%', field: 'GST.CGST-5%',maxWidth: 150 },
    { headerName: 'SGST_2.5%', field: 'GST.SGST-5%' ,maxWidth: 150},
    { headerName: 'CGST_6%', field: 'GST.CGST-6%',maxWidth: 150 },
    { headerName: 'SGST_6%', field: 'GST.SGST-6%' ,maxWidth: 150},
    { headerName: 'CGST_9%', field: 'GST.CGST-9%' ,maxWidth: 150},
    { headerName: 'SGST_9%', field: 'GST.SGST-9%' ,maxWidth: 150},
    { headerName: 'CGST_14%', field: 'GST.CGST-14%' ,maxWidth: 150},
    { headerName: 'SGST_14%', field: 'GST.SGST-14%' ,maxWidth: 150},
    { headerName: 'ServiceCharge', field: 'ServiceCharge' ,maxWidth: 150},

    { headerName: 'Total GST', field: 'GST.GSTTotal' ,maxWidth: 150},
    {headerName: 'GrandTotal',field: 'GrandTotal',maxWidth: 150},






  ]);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef1.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    )
  }, [])

  const gridOptions = {
    defaultColDef: {
      flex: 1,
      // minWidth: 150,
      filter: true,
      sortable: true,
      // floatingFilter: true,
           

    },
  };



 


  const defaultColDef = useMemo( ()=> (
    {
      sortable: true, 
      filter: true,
      autoHeight: true,
      wrapText: true,      
      filterParams :{
      buttons : ['apply','reset']
      }
    }
  ));



  const ConfirmSubmit = (data) => {
    setFormData(data)
    

    setData(data)
    data.FromDate=(Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD'))
    data.ToDate=(Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD'))
   

   



   setLoadingVar(true)
    fetch(DASHBOARD_URL + `/getInvoicesSummary?hotelID=10&FromDate=${data.FromDate}&ToDate=${data.ToDate}`)
    .then(result => result.json())
    .then(rowData =>{
      
if(rowData.statusCode==200){
setRowData(rowData['data'])

setButtonState('true')
}
   setLoadingVar(false)

    }).catch((error) => {
          console.log(error)
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



  return (
    <div>
     <Card>
          <CardHeader>
            <CardTitle tag="h4"><b>Invoices Summary</b></CardTitle>
          </CardHeader>
        </Card>
        <Form onSubmit={handleSubmit(ConfirmSubmit)}>
            <Row>


                
           {/* </Row> */}
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
                        options={optionsToDate}
                        placeholder='YYYY-MM-DD '
                        className={classnames('form-control', {
                          'is-invalid': data !== null && data.FromDate === null
                        })}
                      />
                    )}
                  />
                </div>
              </Col>
              {/* </Row> */}
              {/* <Row> */}
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
                        
                        options={optionsToDate}
                        placeholder='YYYY-MM-DD '
                        className={classnames('form-control', {
                          'is-invalid': data !== null && data.ToDate === null
                        })}
                      />
                    )}
                  />
                </div>
              </Col>
              
              <Col md='4' sm='12'>

             
              <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>

              <Button color='primary' className='me-1' type='submit'>
    Submit
  </Button>
  <Button color='primary' onClick={onBtnExport} disabled={rowData.length === 0} style={{ marginRight: '10px' }}>
    Download CSV file
  </Button>

 

</div>    </Col>
</Row>
   

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



     


  

                       
    </div>
  );
};

export default CompanyWiseBills;

