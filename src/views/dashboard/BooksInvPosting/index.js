
import { useState,useRef, useEffect, useMemo, useCallback} from 'react';

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Moment from 'moment'
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

import API_URL from "../../../config";
import {Row,Card,CardHeader,CardTitle,CardBody,Button,Modal,ModalBody,
  ModalHeader,Col,Label,Input,Form,InputGroup} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import toast from "react-hot-toast";
import Avatar from "@components/avatar";
import { Check } from "react-feather";
import { XCircle } from "react-feather";
import { data } from 'jquery';
let is_test = false
const AvailabilityMatrix = () => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef(null);
  const gridRef1 = useRef();

  const [FirstPageLoad,setFirstPageLoad] = useState(true)
  const [debouncedPage, setDebouncedPage] = useState(0);
  const [InvURL,setInvURL] = useState('')
  const [ShowInv,setShowInv] = useState(false)
  const [Today,setToday] = useState()
  const [data, setData] = useState([]);
  const [LoadingVar,setLoadingVar] = useState(false)
  const [DisableButton,setDisableButton] = useState(false)


  const columnDefs = [
    {headerName: 'POS/PMS',field: 'Type',maxWidth: 130},
{headerName: 'Invoice Date',field: 'invoiceDate',maxWidth: 150},
            {headerName: 'Invoice No',field: 'billNoDisplay',wrapText:true},
            { headerName: 'Invoice', cellRendererFramework: (params) => {
              return (
            <Button color='primary' style={{ width: 80 }} onClick={() =>{
              console.log(params.data)
              getInvoice(params.data)} } >View</Button>)},maxWidth: 120 },
              // { headerName: 'Post Manual', cellRendererFramework: (params) => {
              //   if ((params.data.isPosted ==null || params.data.isPosted ==0)) {
              //   return (
              // <Button color='primary' style={{ width: 140 }} onClick={() =>{
              //   console.log(params.data)
              //   getIRNInvoice(params.data)} } >Post to Books</Button>)}},maxWidth: 160 },

              { headerName: 'IRN Invoice', cellRendererFramework: (params) => {
                if ((params.data.isPosted !=null && params.data.isPosted !=0)) {
                return (
              <Button color='primary' style={{ width: 110 }} onClick={() =>{
                console.log(params.data)
                getIRNInvoice(params.data)} } >View IRN</Button>)}},maxWidth: 160 },
              
              { headerName: 'Send Email', cellRendererFramework: (params) => {       
                if ((params.data.isPosted !=null && params.data.isPosted !=0)) { 
                return (
                  
              <Button color='primary' style={{ width: 100 }} onClick={() =>{
                console.log(params.data)
                setCompleteData(params.data)
                
               
                if(params.data.SettlementType != 'BTC'){
                  setguestEmail(params.data.guestEmail)
                  setCCOpen(false)
                }else{
                  setguestEmail(params.data.BTCCompanyEmail)
                  let EMail = params.data.guestEmail+' '+params.data.bookerEmail
                  setCC1_Email(params.data.guestEmail)
                  setCC2_Email(params.data.bookerEmail)

                  console.log(params.data.guestEmail,params.data.bookerEmail)
                  setCCOpen(true)
                }
                setcomposeOpen(true)
              }} >Email</Button>)}}, suppressSizeToFit: true,maxWidth:150 },
            {headerName: 'RoomNo/TableNo',field: 'RoomTableNo',maxWidth: 170},
            {headerName: 'GuestName/OutletName',field: 'GuestOutletName',width: 260},
            {headerName: 'Amount',field: 'invoiceAmount',maxWidth: 130},
            {headerName: 'BookingID/OrderID',field: 'BookOrderID',maxWidth: 190},
            
            {headerName: 'Settlement Type',field: 'SettlementType',maxWidth: 160},
            {headerName: 'ZOHO Books RecordID',field: 'zohoBooksRecordID',width: 230},

            {headerName: 'Company GST',field: 'CompanyGST',width: 230},

            {headerName: 'Guest GST',field: 'GuestGST',width: 230},
            {headerName: 'BTC Company Name',field: 'BTCCompanyName',width: 230},
            {headerName: 'BTC Company Email',field: 'BTCCompanyEmail',width: 230},
            {headerName: 'Booker Email',field: 'bookerEmail',width: 230},


            {headerName: 'BTC Company GST',field: 'CompanyGST',width: 230},
            {headerName: 'is Posted',field: 'isPosted',width: 230},
            {headerName: 'Error Response',field: 'ErrorResponse',wrapText:true, suppressSizeToFit: true},
            {headerName: 'Bill No',field: 'billNo',width: 230},


            
            




              
          ]

const RegenerateInv = (data) => {
  console.log(data)

fetchx(API_URL + "/getS3DocumentData", {
  method: "POST",
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    hotelID: 1,
    DocName:'PMSInvoice',
    transactionID:'',
    reservationID:data.reservationID,
    billNo:data.billNo
      })
}).then(result => result.json())
.then(resp => {
  console.log(resp)
    if(resp.statusCode==200 && resp.data==0){
     
      // call getinvoicejson api to regenerate
      console.log('Regenrating Inv')
      fetchx(API_URL +`/getInvoiceJSON?hotelID=10&reservationID=${data.reservationID}&folioNo=${data.folioID}`)
      .then(result => result.json())
      .then(rowData => {
        console.log(rowData)
                  
      }).catch((error) => {
        console.log(error)
      })

    }else{
      // Invoice exists. It cannot be regenerated
      console.log("Invoice exists. It cannot be regenerated")
    }
    
  }).catch((error) => {
    console.log(error)
  })
}
  const onGridReady = (params) => {
    gridRef.current = params.api;
  };
  const getRowStyle = params => {
    if(params.data.GuestGST!=null && params.data.GuestGST!="" && params.data.GuestGST.length>0 && (params.data.AllBooksReqExists === 0 || params.data.isPosted===0)){
      return {
        color: '#0057FF' ,
        background: '#EDCF48'// Change '#000000' to the desired color code for text
      };
    }
    else if(params.data.GuestGST!=null  && params.data.GuestGST!="" && (params.data.AllBooksReqExists === 1 || params.data.isPosted===1)){
      return {
        color: '#0057FF' ,
      };
    }
    if (params.data && params.data.AllBooksReqExists === 0 || params.data.isPosted===0) {
    // if (params.data && params.data.AllBooksReqExists === 0 ) {

      return { background: '#EDCF48' };
    }
   
    return null;
  };
  const loadPageData = (page) => {
    let FromDate  = Today
    let ToDate  =Today
    // console.log(data)
    if(FromDate != undefined && ToDate != undefined){
    fetchx(API_URL + `/getPMSAndPOSReq?hotelID=1&FromDate=${FromDate}&ToDate=${ToDate}`)
      .then((result) => result.json())
      .then((response) => {
        for(let i=0 ;i<response['data'].length;i++){
            if(response['data'][i]['ErrorResponse']!=null){
             
            const jsonObject = JSON.parse(JSON.parse(response['data'][i]['ErrorResponse']));

// Extract the value associated with the "message" key
const errorMessage = jsonObject.platform_error.message;

response['data'][i]['ErrorResponse'] = errorMessage
          }
        }
          setRowData(response['data'])
      });
    }
  };

  const getIRNInvoice = (data) => {
    fetchx(API_URL + "/getIRNInvoice", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Type : data.Type,
        InvoiceID:data.id,
        billNoDisplay:data.billNoDisplay
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
  }
  const getInvoice = (data)=>{
    if(data.Type=='POS'){
    
      if(!is_test){
      fetchx(API_URL + "/gets3DocumentIDPMS", {
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
        fetchx(API_URL + "/gets3DocumentIDPMS", {
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

const defaultColDef = useMemo( ()=> (
  {
    sortable: true, 
    filter: true,
    autoHeight: true,
    wrapText:true,
    filterParams :{
    buttons : ['apply','reset']
    }
  }
));

  useEffect(() => {
    

    fetchx(API_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
          })
    }).then(result => result.json())
    .then(resp => {
        console.log(resp['data'])
        let date = new Date(resp['data'][0]['businessDate']);
         date.setDate(date.getDate() - 1)
        let oneLessDate = Moment(new Date(date)).format("YYYY-MM-DD");
        console.log(oneLessDate)
        setToday(oneLessDate)
        let tempJSON = {
          'FromDate'  : oneLessDate ,
          'ToDate': oneLessDate 
        }
        // setData(tempJSON)
        // loadPageData(debouncedPage * 10);
      }).catch((error) => {
        console.log(error)
      })

      
     
  }, [Today]);

  const optionsToDate = {

    // maxDate:Moment(new Date(Today)).subtract(1, 'days')
    // maxDate:Today
    maxDate : Today
  
  };

  const onPageChanged = () => {
    if (gridRef.current) {
      const currentPage = gridRef.current.paginationGetCurrentPage();
      if(FirstPageLoad){
        setDebouncedPage(currentPage);
        setFirstPageLoad(false)
      }
      if(currentPage>=debouncedPage){
        setDebouncedPage(currentPage);
      }   
    }
  };
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef1.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);
    // ** States
    const [ccOpen, setCCOpen] = useState(false)
    const [bccOpen, setBCCOpen] = useState(false)
    const [composeOpen, setcomposeOpen] = useState(false)
    const [toggleCompose, settoggleCompose] = useState(false)
    const [guestEmail,setguestEmail] = useState()
    const [CC1_Email,setCC1_Email] = useState('')
    const [CC2_Email,setCC2_Email] = useState('')


    const [CompleteData,setCompleteData] = useState()
    const { reset, handleSubmit, control ,formState: { errors }
  } = useForm({ });
     
  const SendEmail = (data) =>{
    
    if(data['email-to'] == undefined){
      data['email-to'] = guestEmail
    }
    if(data['email-cc'] == undefined){
      data['email-cc'] = CC1_Email+' '+CC2_Email
    }


    fetchx(API_URL + "/sendBTCInv", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Type:CompleteData.Type,
        BTCAccID:CompleteData.BTCAccID,
        toAddress:guestEmail,
        ccAddress:CC1_Email+';'+CC2_Email,
        InvID:CompleteData.id,
        billNoDisplay:CompleteData.billNoDisplay
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
    setguestEmail(event.target.value); // Update the guestEmail state with the input value
  };

  const handleCC1EmailChange = (event) => {
    setCC1_Email(event.target.value); // Update the guestEmail state with the input value
  };
  const handleCC2EmailChange = (event) => {
    setCC2_Email(event.target.value); // Update the guestEmail state with the input value
  };

  const params = {
    fileName: 'Books_Invoice_Postings', // Set your desired file name here
  };
  const onBtnExport = useCallback(() => {
    gridRef1.current.api.exportDataAsCsv(params);
  }, []);
  const ConfirmSubmit = (data) => {
    console.log(data)
    setData(data)
    data.FromDate=(Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD'))
    data.ToDate=(Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD'))

setRowData([]);
setLoadingVar(true)

fetchx(API_URL + `/getPMSAndPOSReq?hotelID=1&FromDate=${data.FromDate}&ToDate=${data.ToDate}`)
.then((result) => result.json())
.then((response) => {
  for(let i=0 ;i<response['data'].length;i++){
    if(response['data'][i]['ErrorResponse']!=null){
     
    const jsonObject = JSON.parse(JSON.parse(response['data'][i]['ErrorResponse']));

// Extract the value associated with the "message" key
const errorMessage = jsonObject.platform_error.message;

response['data'][i]['ErrorResponse'] = errorMessage
  }
}
  setRowData(response['data'])
    setLoadingVar(false)
})
   

  .catch((error) => {
    console.log(error)
    setLoadingVar(false)

  })


  }
  const postInvManually = () =>{
    console.log(data)
    setLoadingVar(true)
    fetchx(API_URL + "/postInvToBooksManually", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         FromDate : data['FromDate'],
         ToDate : data['ToDate']  
      
          })
    }).then(result => result.json())
    .then(resp => {
        console.log(resp)
        setLoadingVar(false)
        setRowData([]);

        // loadPageData(debouncedPage * 10);
        if(resp.statusCode==200){
          setDisableButton(false)
          toast(
            <div className="d-flex">
              <div className="me-1">
                <Avatar size="sm" color="success" icon={<Check size={12} />} />
              </div>
              <div className="d-flex flex-column">
                <h6>All Invoices posted successfully</h6>
              </div>
            </div>
          );
        }
        
      }).catch((error) => {
        setLoadingVar(false)
      })
  }

  return (
    <div>
         <Card>
            <CardHeader>
              <CardTitle tag="h4"><b>Books Invoice Posting</b></CardTitle>
            </CardHeader>
          </Card>
          <Form onSubmit={handleSubmit(ConfirmSubmit)}>
          <Row>


<Col md='4' sm='8'>
           
    
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
<Col md='4' sm='8'>


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
                <Col md='4' sm='8'>

                
              <div align='right'>
                <Button style={{ marginTop: '22px'}} color='primary' className='me-1' type='submit'>
                  Submit
                </Button>
                

              </div>
              </Col>
</Row>
          </Form>
          <Row>
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
        <Button color='primary' onClick={onBtnExport} disabled={rowData.length === 0} style={{ marginRight: '10px' }}>
    Download CSV file
  </Button>
  <Button color='success' className='me-1' disabled={DisableButton} onClick={ ()=> { setDisableButton(true)
                postInvManually()
                }}>
   Post All Invoices Manually
  </Button>
  </div>
        
        {/* <Col md='3' sm='6' className="mb-1">
            <div className='inline-spacing' align="right" style={{ margin: '2px 0' }}>
            <Button.Ripple color='primary' style={{ marginTop: '22px'}} onClick={onBtnExport}  >Download CSV file</Button.Ripple>
            </div>
            </Col>
           
            <Col md='3' sm='6' className="mb-1">
            <div className='inline-spacing' align="right" style={{ margin: '2px 0' }}>
            <Button.Ripple color='primary' style={{ marginTop: '22px'}} onClick={postInvManually}  ></Button.Ripple>
            </div>
            </Col> */}
     </Row>
     {data.length!=0 && <p>Invoice postings From {data.FromDate} to {data.ToDate}</p>}
      <div className="ag-theme-alpine" style={{ height: 540 }}>

        <AgGridReact
        ref={gridRef1}
          onGridReady={onGridReady}
          getRowStyle={getRowStyle}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={10}
          defaultColDef={defaultColDef}
          // onPaginationChanged={onPageChanged}
        />
      </div>

      <Modal isOpen={ShowInv} toggle={() => setShowInv(!ShowInv)} style={{height:'200px'}} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowInv(!ShowInv)}>Invoice</ModalHeader>
       
          <iframe style={{ height: '85vh' }} src={InvURL}> </iframe>
      </Modal>

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
            value={guestEmail} // Set the value to guestEmail state
            onChange={handleEmailChange} // Handle input changes
            required
          />
        </InputGroup>
      </div>
    </div>
            {ccOpen === true && (
                    <div className='compose-mail-form-field'>
                    <Label htmlFor='email-cc' className='form-label'>
                  guest Email(cc) :
                </Label>
                <div className='flex-grow-1'>
                <InputGroup className="input-group-merge">
                  <Input
                      type="email"
                      placeholder='guest Email'
                      id="email-cc"
                      name="email-cc"
                      value={CC1_Email} // Set the value to guestEmail state
                      onChange={handleCC1EmailChange} // Handle input changes
                      
                    />
                  </InputGroup>
                </div>
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
                      value={CC2_Email} // Set the value to guestEmail state
                      onChange={handleCC2EmailChange} // Handle input changes
                      
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
