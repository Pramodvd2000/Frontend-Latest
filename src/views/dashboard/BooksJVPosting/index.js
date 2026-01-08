
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

  const columnDefs = [
{headerName: 'Date',field: 'date',maxWidth: 130},
            {headerName: 'JournalNo',field: 'JournalNo',wrapText:true},
              { headerName: 'Post Manually', cellRendererFramework: (params) => {
                if ((params.data.isPosted ==null || params.data.isPosted ==0)) {
                return (
              <Button color='primary' style={{ width: 80 }} onClick={() =>{
                console.log(params.data)
                postJVManual(params.data)} } >Post</Button>)}},maxWidth: 160 },
              

            {headerName: 'journalRecordID',field: 'journalRecordID',width: 230},
            {headerName: 'isPosted',field: 'isPosted',width: 230},
            {headerName: 'ErrorResponse',field: 'errorResponse',wrapText:true, suppressSizeToFit: true,width: 350},

            





              
          ]


  const onGridReady = (params) => {
    gridRef.current = params.api;
  };
  const getRowStyle = params => {
    if (params.data && params.data.isPosted === null || params.data.isPosted===0) {
    // if (params.data && params.data.AllBooksReqExists === 0 ) {

      return { background: '#EDCF48' };
    }
    return null;
  };
  const loadPageData = (page) => {
    let FromDate  = Today
    let ToDate  =Today
    console.log(data)
    if(FromDate != undefined && ToDate != undefined){
    fetchx(API_URL + `/getZOHOJournalStatus?hotelID=1&FromDate=${FromDate}&ToDate=${ToDate}`)
      .then((result) => result.json())
      .then((response) => {
        
        for(let i=0 ;i<response['data'].length;i++){
          
            if(response['data'][i]['errorResponse']!=null){
              // console.log(response['data'][i]['errorResponse'])
            const jsonObject = JSON.parse((response['data'][i]['errorResponse']));
// console.log(typeof(jsonObject))
// Extract the value associated with the "message" key
const errorMessage = jsonObject.error.message;
console.log(errorMessage)
response['data'][i]['errorResponse'] = errorMessage
          }
        }
          setRowData(response['data'])
      });
    }
  };
const postJVManual = (data) =>{
  setLoadingVar(true)
  fetchx(API_URL + "/postZOHOBooksJVManually", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hotelID : data.hotelID,
      date : data.date,
      isPosted:data.isPosted
     
        })
  }).then(result => result.json())
  .then(resp => {
  setLoadingVar(false)
  setRowData([])
  loadPageData()
      if(resp.statusCode==200){
       
        toast(
          <div className="d-flex">
            <div className="me-1">
              <Avatar size="sm" color="success" icon={<Check size={12} />} />
            </div>
            <div className="d-flex flex-column">
              <h6>{resp.data}</h6>
            </div>
          </div>
        );
  
  
      }else{
        toast(
          <div className="d-flex">
            <div className="me-1">
              <Avatar size="sm" color="danger" icon={<XCircle size={12} />} />
            </div>
            <div className="d-flex flex-column">
              <h6>{resp.data}</h6>
            </div>
          </div>
        );
      }
    }).catch((error) => {
      console.log(error)
      setLoadingVar(false)

    })
}
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
        //  date.setDate(date.getDate() - 1)
        // let oneLessDate = Moment(new Date(date)).format("YYYY-MM-DD");
        // console.log(oneLessDate)
        setToday(resp['data'][0]['businessDate'])
        let tempJSON = {
          'FromDate'  : resp['data'][0]['businessDate'] ,
          'ToDate': resp['data'][0]['businessDate'] 
        }
        setData(tempJSON)
        loadPageData(debouncedPage * 10);
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
        toAddress:guestEmail,
        ccAddress:CC1_Email+';'+CC2_Email,
        InvID:CompleteData.id,
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
    fileName: 'Books_JournalEntries', // Set your desired file name here
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
  // for(let i=0 ;i<response['data'].length;i++){
      setRowData(response['data'])
    // }
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

        loadPageData(debouncedPage * 10);
        if(resp.statusCode==200){
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
              <CardTitle tag="h4"><b>Books Journal Posting</b></CardTitle>
            </CardHeader>
          </Card>
          {/* <Form onSubmit={handleSubmit(ConfirmSubmit)}>
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
          </Form> */}
<Row >
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
  <Col>
    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
      <Button color='primary' onClick={onBtnExport} disabled={rowData.length === 0} style={{ marginRight: '10px' }}>
        Download CSV file
      </Button>
      {/* <Button color='success' className='me-1' onClick={postInvManually}>
        Post Invoice Manually
      </Button> */}
    </div>
  </Col>
</Row>
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
