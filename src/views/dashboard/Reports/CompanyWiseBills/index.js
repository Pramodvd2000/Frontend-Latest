
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
import API_URL from "../../../../config";
import {
    AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, Accordion, InputGroup, NavLink
  } from 'reactstrap'
import { event } from "jquery";

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
  const [ViewHistory,setViewHistory] = useState(false)
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
    fetch(API_URL + "/getBusinessDate", {
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



    fetch(API_URL + "/getBTCCompanyList?hotelID=10")
      .then((result) => result.json())
      .then((resp) => {
        if(resp.statusCode==200){
          
            resp["data"].forEach((item,index) => {
                resp["data"][index]['value'] = item["companyid"];
                resp["data"][index]['label'] = item["accountName"];

      });
      setCompanyList(resp["data"]);
        }
       
      });


  }, []);
  const params = {
    fileName: 'Company Wise Bills', // Set your desired file name here
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
    {headerName: 'FileAttachment',field: 'billNoDisplay',maxWidth: 200,
    cellRenderer: (params) => {
      // Get the data for the cell
      // params.preventDefault(); // Prevent the default behavior
      return (<a style={{color:'#3366CC'}} onClick={()=>{getInvoice(params.data) 
                                  }}>{params.data.billNoDisplay+'.pdf'}</a>)
}
     
  },
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

  const [BillsColumnDefs, setBillsColumnDefs] = useState([

    {headerName: 'Company Name',field: 'CompanyName',suppressSizeToFit: true},
    {headerName: 'From Date',field: 'fromDate',suppressSizeToFit: true,width: 150},
    {headerName: 'To Date',field: 'toDate',suppressSizeToFit: true,width: 150},
    {headerName: 'Address', field: 'address' , wrapText:true, width: 400, suppressSizeToFit: true,},
    {headerName: 'Combined File',field: 'CompanyName', wrapText:true, width: 200, suppressSizeToFit: true,
      cellRenderer: (params) => {
        // Get the data for the cell
        // params.preventDefault(); // Prevent the default behavior
        return (<a style={{color:'#3366CC'}} onClick={()=>{getMergedFile(params.data) 
                                    }}>{params.data.CompanyName+'_MergedFile'}</a>)
  }
       
    },
    {headerName: 'summaryFile',field: 'CompanyName', wrapText:true, width: 200, suppressSizeToFit: true,
    cellRenderer: (params) => {
      // Get the data for the cell
      // params.preventDefault(); // Prevent the default behavior
      return (<a style={{color:'#3366CC'}} onClick={()=>{getSummaryFile(params.data) 
                                  }}>{params.data.CompanyName+'_Summary'}</a>)
}
     
  },
  { headerName: 'Send', cellRendererFramework: (params) => {        
    return (
      
  <Button color='primary' style={{ width: 80 }} onClick={() =>{

    
      setCompanyEmail(params.data.CompanyEmail)
      setCC1_Email(params.data.BookerEmail)

      setCCOpen(true)
    
    setcomposeOpen(true)
  }} >Email</Button>)}, suppressSizeToFit: true,maxWidth:120 },
  {headerName: 'Company Email',field: 'CompanyEmail',suppressSizeToFit: true},
  {headerName: 'Booker Email',field: 'BookerEmail',suppressSizeToFit: true},
  {headerName: 'BTCAccID',field: 'BTCAccID',maxWidth: 160},

  ]);

  const [CompanyListColDefs, setCompanyListColDefs] = useState([
    { headerName: 'Comapny', field: 'accountName',width: 400,},
    { headerName: 'Address', field: 'address' , wrapText:true, width: 400, suppressSizeToFit: true,},
    { headerName: 'Phone No', field: 'phone'},
    { headerName: 'Country', field: 'CountryName' },
    {
      headerName: "Actions", cellRendererFramework: (params) => (
        <Button color="primary" onClick={() => setCompanyModal(false)} >
          Select
        </Button>
      ),
     
    },
  ]);


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

  const getInvoice = (data)=>{
if(data.Type=='POS'){

  if(!is_test){
  fetch(API_URL + "/gets3DocumentIDPMS", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hotelID: 1,
      DocName:'POSInvoice',
      transactionID:'',
      reservationID:'',
      billNo:(String(data.billNoDisplay).replaceAll("/","_").replaceAll("-",""))
        })
  }).then(result => result.json())
  .then(resp => {
      if(resp.statusCode==200){
        setInvURL(API_URL+'/images/'+resp['data'])
        setShowInv(true)
      }
      
    }).catch((error) => {
    })
  }else{
     let url = API_URL+'/imagepaths/POS_Invoice/POSInvoice_'+data.hotelID+'_'+(String(data.billNoDisplay).replaceAll("/","_").replaceAll("-",""))+'.pdf'
     setInvURL(url)
     setShowInv(true)
    }
}else{
  if(!is_test){
    fetch(API_URL + "/gets3DocumentIDPMS", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 10,
        DocName:'PMSInvoice',
        transactionID:'',
        reservationID:data.reservationID,
        billNo:data.billNo
          })
    }).then(result => result.json())
    .then(resp => {
        if(resp.statusCode==200){
          setInvURL(API_URL+'/images/'+resp['data'])
          setShowInv(true)
    
    
        }
      }).catch((error) => {
        console.log(error)
      })
  }else{
    setInvURL(API_URL+'/imagepaths/PMS_Invoice/Invoice/PMSInvoice_' + data.reservationID + '_' + data.billNo + '.pdf')
    setShowInv(true)
  }
}
}

const SendEmail = (data) =>{
    
  if(data['email-to'] == undefined){
    data['email-to'] = CompanyEmail
  }
  if(data['email-cc'] == undefined){
    data['email-cc'] = CC1_Email
  }


  fetch(API_URL + "/emailCompanyBills", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hotelID:10,
      BTCAccountID:CompanyValue,
      FromDate:FormData.FromDate,
      ToDate:FormData.ToDate,
      toAddress:CompanyEmail,
      booker:[],
      ccAddress:CC1_Email,
      MergedFile:'',
      SummaryFile:'',
      type:'Stored File'
        })
  }).then(result => result.json())
  .then(resp => {
      console.log(resp)
      if(resp.statusCode==200){
        setcomposeOpen(false)
        toast(
          <div className="d-flex">
            <div className="me-1">
              <Avatar size="sm" color="success" icon={<Check size={12} />} />
            </div>
            <div className="d-flex flex-column">
              <h6>Email sent successfully</h6>
            </div>
          </div>
        );
      }
      
    }).catch((error) => {
      setcomposeOpen(false)
      toast(
        <div className="d-flex">
          <div className="me-1">
            <Avatar size="sm" color="danger" icon={<XCircle size={12} />} />
          </div>
          <div className="d-flex flex-column">
            <h6>Could not send Email</h6>
          </div>
        </div>
      );
    })

 
}


const handleEmailChange = (event) => {
  setCompanyEmail(event.target.value); // Update the CompanyEmail state with the input value
};

const handleCC1EmailChange = (event) => {
  setCC1_Email(event.target.value); // Update the CompanyEmail state with the input value
};

const getMergedFile = (data)=>{
  console.log(data)
    if(!is_test){
    fetch(API_URL + "/getBTCFileKeynamesFile", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        BTCAccID:data.CompanyID,
        FromDate:data.fromDate,
        ToDate:data.toDate,
        bookerIDArr:data.bookerIDArr
          })
    }).then(result => result.json())
    .then(resp => {
        if(resp.statusCode==200){
          setInvURL(API_URL+'/images/'+resp['data'][0]['mergedFileKeyName'])
          setShowSummaryInv(true)
        }
        
      }).catch((error) => {
      })
    }else{
      //  let url = API_URL+'/imagepaths/BTCSummaryFiles/'+(data.CompanyName).replace(' ','_')+'_'+'Summary'+'_'+data.hotelID+'_'+data.CompanyID+'_'+data.fromDate+'_'+data.toDate+'.pdf'
      //  console.log(url)
       
      //  setInvURL(url)
      //  setShowSummaryInv(true)
      }
  
  }
  

const getSummaryFile = (data)=>{
console.log(data)
  if(!is_test){
  fetch(API_URL + "/getBTCFileKeynamesFile", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      BTCAccID:data.CompanyID,
      FromDate:data.fromDate,
      ToDate:data.toDate,
      bookerIDArr:data.bookerIDArr
        })
  }).then(result => result.json())
  .then(resp => {
      if(resp.statusCode==200){
        setInvURL(API_URL+'/images/'+resp['data'][0]['summaryFileKeyName'])
        setShowSummaryInv(true)
      }
      
    }).catch((error) => {
    })
  }else{
     let url = API_URL+'/imagepaths/BTCSummaryFiles/'+(data.CompanyName).replace(' ','_')+'_'+'Summary'+'_'+data.hotelID+'_'+data.CompanyID+'_'+data.fromDate+'_'+data.toDate+'.pdf'
     console.log(url)
     
     setInvURL(url)
     setShowSummaryInv(true)
    }

}

  const handleChange = (selectedOption) => {
    setBookerData = []

    setSelectedCompany(selectedOption.value)
    fetch(API_URL + `/getbookerByCompanyId?hotelID=10&accountID=${selectedOption.value}`)
    .then(result => result.json())
    .then(resp =>{
      if(resp.statusCode==200){
        resp["data"].forEach((item,index) => {
            resp["data"][index]['value'] = item["id"];
            resp["data"][index]['label'] = item["name"];


  });

setBookerData = (resp['data'])
setisBooker(false)
setTimeout(()=>{setisBooker(true)},10)
      }
    }).catch((error) => {
          console.log(error)
        })

    
  };
  const ConfirmSubmit = (data) => {
    setFormData(data)
    

console.log(CompanyValue)
let BookerIDs = Array.isArray(data.Booker) ? data.Booker.map(item => item.value) : [];
    setData(data)
    data.FromDate=(Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD'))
    data.ToDate=(Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD'))
   

    fetch(API_URL + `/getCompanyandBookerEmailByID?hotelID=10&BTCAccountID=${CompanyValue}`)
    .then(result => result.json())
    .then(rowData =>{
      if(rowData['data'].length>0){

    setCompanyEmail(rowData['data'][0]['CompanyEmail'])
    setCC1_Email(rowData['data'][0]['BookerEmail'])


      }

    }).catch((error) => {
          console.log(error)
        })



   setLoadingVar(true)
    fetch(API_URL + `/getCompanyWiseBills?hotelID=10&FromDate=${data.FromDate}&ToDate=${data.ToDate}&BTCAccountID=${CompanyValue}&bookerID=${JSON.stringify(BookerIDs)}`)
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


  const getBTCSummarizedBills = () => {
    

    setViewHistory(!ViewHistory)
   
        fetch(API_URL + `/getBTCSummarizedBills?hotelID=10&BTCAccountID=${CompanyValue}`)
        .then(result => result.json())
        .then(rowData =>{
    
    if(rowData.statusCode==200){
      setSummarizedBills(rowData['data'])
    }
       setLoadingVar(false)
    
        }).catch((error) => {
              console.log(error)
            })
    
    
      }

  const cellClickedListener = useCallback( event => {
    console.log('cellClicked', event);
  }, []);

  const CompaniesListener = useCallback((event) => {
    // console.log("cellClicked", event);
    // setfilldata(event["data"]);
    setCompanyValue(event.data.companyid)
    setCompanyLabel(event.data.accountName)
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
            <CardTitle tag="h4"><b>Company Wise Bills</b></CardTitle>
          </CardHeader>
        </Card>
        <Form onSubmit={handleSubmit(ConfirmSubmit)}>
            <Row>


            <Col md='4' sm='8'>
          <div className='mb-1'>
            <Label className='form-label' for='BTCCompany'>
            Company Name
            </Label>
            <Controller
              // defaultValue={localStorage.getItem('sourcecode')}
              id='BTCCompany'
              control={control}
              name='BTCCompany'
              render={({ field }) => (
                <Input
                  required
                  onClick={() => { setCompanyModal(true) }}
                  // onChange={handleChange5}
                  value={CompanyLabel ? CompanyLabel : null}
                />
              )}
            />
          </div>
        </Col>

            {isBooker && <Col md='4' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='Booker'>
                 Booker 
                </Label>
                <Controller
                  id='Booker'
                  control={control}
                  name='Booker'
                  render={({ field }) => (
                    <Select
                    isMulti
                      isClearable
                      options={setBookerData}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.Booker === null })}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col>}
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
              </Row>
              
             
             
              <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
              <Button color='primary' className='me-1' type='submit'>
    Submit
  </Button>
  <Button color='primary' onClick={onBtnExport} disabled={rowData.length === 0} style={{ marginRight: '10px' }}>
    Download CSV file
  </Button>
              <Button color='success' className='me-1' disabled={!ButtonState} onClick={ ()=> {getBTCSummarizedBills()
                }}>
    Historical Downloads
  </Button>

  <Button color='success' className='me-1' disabled={!ButtonState} onClick={ ()=> {    setCCOpen(true)
  
  setcomposeOpen(true)
                }}>
   Send Email
  </Button>

</div>    
              
<Modal isOpen={ShowInv} toggle={() => setShowInv(!ShowInv)} style={{height:'200px'}} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowInv(!ShowInv)}>Invoice</ModalHeader>
       
          <iframe style={{ height: '85vh' }} src={InvURL}> </iframe>
      </Modal>
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



      <Modal isOpen={ViewHistory} toggle={() => setViewHistory(!ViewHistory)} style={{height:'200px'}} className='modal-dialog-centered modal-xl'>
        <ModalHeader className='bg-transparent' toggle={() => setViewHistory(!ViewHistory)}>Previous Downloads</ModalHeader>
  <div className="ag-theme-alpine" style={{ height: '80vh' ,padding:'20px' }}>
    <AgGridReact 
      ref={gridRef}
      rowData={SummarizedBills} 
      columnDefs={BillsColumnDefs}
      animateRows={true} 
      rowSelection='multiple'
      onCellClicked={cellClickedListener}
      paginationPageSize='10'
      pagination='true'
      defaultColDef={defaultColDef}
      headerColor="ddw-primary"
    />
</div>
          {/* <iframe style={{ height: '85vh' }} src={InvURL}> </iframe> */}
      </Modal>


      <Modal isOpen={ShowSummaryInv} toggle={() => setShowSummaryInv(!ShowSummaryInv)} style={{height:'200px'}} className='modal-dialog-centered modal-xl'>
        <ModalHeader className='bg-transparent' toggle={() => setShowSummaryInv(!ShowSummaryInv)}>BTC Document</ModalHeader>
       
          <iframe style={{ height: '85vh'  }} src={InvURL}> </iframe>
      </Modal>
    {/* <App/> */}

    <div>
        <Modal
          isOpen={CompanyModal} toggle={() => setCompanyModal(!CompanyModal)} className="modal-xl"
        >
          <ModalHeader className="bg-transparent" toggle={() => setCompanyModal(!CompanyModal)}>Select Company</ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
             <div>
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
              </div>

              {/* <button onClick={buttonListener}>Push Me</button> */}
              <div className="ag-theme-alpine" style={{ height: 520 }}>
                <AgGridReact
                  ref={gridRef1}
                  rowData={CompanyList}
                  columnDefs={CompanyListColDefs}
                  animateRows={true}
                  // rowSelection="multiple"
                  onCellClicked={CompaniesListener}
                  paginationAutoPageSize="true"
                  paginationPageSize="10"
                  pagination="true"
                  defaultColDef={defaultColDef}
                  headerColor="ddw-primary"
                  gridOptions={gridOptions}
                />
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>


                        {/* //Email Template */}
                        <Modal
      style={{height:'200px'}}
      className='modal-dialog-centered modal-lg'
      isOpen={composeOpen}
      toggle={() => setcomposeOpen(!composeOpen)}
    >
      <ModalHeader toggle={() => setcomposeOpen(!composeOpen)} className='bg-transparent'>Send Email</ModalHeader>
      <ModalBody >

      <Form className='compose-form' onSubmit={handleSubmit(SendEmail)}>

                  <div className='compose-mail-form-field'>
          <Label htmlFor='email-to' className='form-label'>
        To:
      </Label>
      <div className='flex-grow-1'>
      <InputGroup className="input-group-merge">
        <Input
            type="email"
            id="email-to"
            name="email-to"
            value={CompanyEmail} // Set the value to CompanyEmail state
            onChange={handleEmailChange} // Handle input changes
            required
          />
        </InputGroup>
      </div>
    </div>
            {ccOpen === true && (
                    <div className='compose-mail-form-field'>
                    {/* <Label htmlFor='email-cc' className='form-label'>
                  guest Email(cc) :
                </Label>
                <div className='flex-grow-1'>
                <InputGroup className="input-group-merge">
                  <Input
                      type="email"
                      placeholder='guest Email'
                      id="email-cc"
                      name="email-cc"
                      value={CC1_Email} // Set the value to CompanyEmail state
                      onChange={handleCC1EmailChange} // Handle input changes
                      
                    />
                  </InputGroup>
                </div> */}
                <Label htmlFor='email-cc' className='form-label'>
                  booker Email(cc) :
                </Label>
                <div className='flex-grow-1'>
                <InputGroup className="input-group-merge">
                  <Input
                      placeholder='booker Email'
                      type="email"
                      id="email-cc"
                      name="email-cc"
                      value={CC1_Email} // Set the value to CompanyEmail state
                      onChange={handleCC1EmailChange} // Handle input changes
                      
                    />
                  </InputGroup>
                </div>
              </div>
)}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button style={{ marginTop: '22px' }} type='submit' color='primary'>
               Send
               </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
    </div>
  );
};

export default CompanyWiseBills;

