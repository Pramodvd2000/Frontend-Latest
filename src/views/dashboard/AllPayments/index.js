import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { DateTime } from 'luxon';

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
let is_test = false
import API_URL from "../../../config";
import {Card,CardHeader,CardTitle,CardBody,Button,Modal,ModalBody,Row,InputGroup,
  ModalHeader,Col,Label,Input,Form,UncontrolledButtonDropdown,DropdownToggle,DropdownMenu,DropdownItem,UncontrolledDropdown} from 'reactstrap'
import Moment from 'moment';
import { Minus, X, Maximize2, Paperclip, MoreVertical, Trash } from 'react-feather'
import Select, { components } from 'react-select'
import { selectThemeColors } from '@utils'
import { Editor } from 'react-draft-wysiwyg'
import { useForm, Controller } from 'react-hook-form'
import classnames from "classnames";

import toast from "react-hot-toast";
import Avatar from "@components/avatar";
import { Check } from "react-feather";
import { XCircle } from "react-feather";
const AvailabilityMatrix = () => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef(null);
  const gridRef1 = useRef();

  const [FirstPageLoad,setFirstPageLoad] = useState(true)
  const [debouncedPage, setDebouncedPage] = useState(0);
  const [ReceiptURL,setReceiptURL] = useState('')
  const [ShowReceiptPDF,setShowReceiptPDF] = useState(false)
  
  const formatToIST = (dateString) => {
    if (dateString) {
      // Convert the date string to a DateTime object in the UTC time zone
      const date = DateTime.fromISO(dateString, { zone: 'utc' });
      // Set the time zone to 'Asia/Kolkata' (IST) and format the date
      const istDate = date.setZone('Asia/Kolkata');
      return istDate.toFormat('dd-MM-yyyy HH:mm:ss');
      // DD-MM-YYYY hh:mm:ss
    }
    return 'No date available';
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
  const columnDefs = [
            {headerName: 'receiptNo',field: 'receiptNumber',maxWidth: 120},
            { headerName: 'Receipt', cellRendererFramework: (params) => {
              if(params.data.receiptNumber!=null){
                  
              return (
                
            <Button color='primary' style={{ width: 70 }} onClick={() =>{
              console.log(params.data.id)
              getReceipt(params.data.id)
            }} >View</Button>)}}, suppressSizeToFit: true,maxWidth:120 },
            { headerName: 'Send', cellRendererFramework: (params) => {
              if(params.data.receiptNumber!=null){
                  
              return (
                
            <Button color='primary' style={{ width: 70 }} onClick={() =>{
              console.log(params.data.email)
              setCompleteData(params.data)
              // setData({'email-to' : params.data.email})
              setguestEmail(params.data.email)
              console.log(guestEmail)
              setguestSelect(true)
              setcomposeOpen(true)
            }} >Email</Button>)}}, suppressSizeToFit: true,maxWidth:120 },

            {headerName: 'guestName',field: 'guestName',width: 260},
            // {headerName: 'Room ID',field: 'roomID'},
            {headerName: 'Cnf No',field: 'bookingID',maxWidth: 100},
            {headerName: 'accountName',field: 'accountName',width: 250},
            {headerName: 'roomNo',field: 'roomNumber',maxWidth: 110},
            {headerName: 'Amount',field: 'Amount',maxWidth: 130},
            {headerName: 'date',field: 'date',maxWidth: 120},
            {headerName: 'createdAt',field: 'createdAt',cellRenderer: (params) => {  
              // console.log(params./data.date)      
              // Ensure the arrivalDate field exists in the row data        
              if (params.data && params.data.createdAt) {          
                // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
                const formattedDate = Moment(params.data.createdAt).format("DD-MM-YYYY hh:mm:ss");          
                return formattedDate;        
            } else {          
                return ""; // Handle cases where the data is missing or invalid        
            }      }},
            // {headerName: 'TCLB',field: '5',maxWidth: 160},
            // {headerName: 'EXE',field: '6',maxWidth: 160},
        
          ]

  const onGridReady = (params) => {
    gridRef.current = params.api;
    // loadPageData(1); // Load initial data on grid ready
  };
  const getRowStyle = params => {
    console.log(params)
    if (params.data && params.data.is_cancelled === 1) {
      return { background: '#3598db' };
    }
    return null;
  };
  const loadPageData = (page) => {
    console.log(page,page+10)
    fetchx(API_URL + `/getAllPaymentTransaction?hotelID=1&startRecord=${page}&endRecord=${11}`)
      .then((result) => result.json())
      .then((response) => {
        console.log(response.data)
        console.log(response.data.length)
        console.log(response.data)
        for(let i=0 ;i<response['data'].length;i++){
                            setRowData(rowData=>[...rowData,(response['data'][i])])
                  
                          }
        // setRowData(response.data);
      });
  };

  const getReceipt =(transactionID)=>{

    // let url = 'http://122.166.2.21//PMS_Invoice/PaymentReceipt/PaymentReceipt_'+transactionID+'.pdf'

  //Live server
  // let url = API_URL+'/getinvoices/PaymentReceipt_'+transactionID+'.pdf'
          
  //       console.log(url)
  //       setReceiptURL(url)
  //       setShowReceiptPDF(true)
  if(!is_test){
    fetchx(API_URL + "/gets3DocumentIDPMS", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
        DocName:'Payment',
        transactionID:transactionID,
        reservationID:'',
        billNo:''
          })
    }).then(result => result.json())
    .then(resp => {
        console.log(resp)
        if(resp.statusCode==200){
          console.log(resp)
          setReceiptURL(API_URL+'/images/'+resp['data'])
          console.log(API_URL+'/images/'+resp['data'])
          setShowReceiptPDF(true)
    
    
        }
        
      }).catch((error) => {
        console.log(error)
      })
    }else{
      setReceiptURL(API_URL+'/imagepaths/PMS_Invoice/PaymentReceipt/PaymentReceipt_'+transactionID+'.pdf')
      setShowReceiptPDF(true)
    }
}

  useEffect(() => {
    // Only load data when debouncedPage changes
    console.log('Data loaded')
    loadPageData(debouncedPage * 10);
    // console.log(debouncedPage * 10 + 1)
  }, [debouncedPage]);

  const onPageChanged = () => {
    if (gridRef.current) {
      const currentPage = gridRef.current.paginationGetCurrentPage();
      console.log(currentPage,debouncedPage)
      //set the debounced page count on load and and 
      //when the current page is more than debounced page
      if(FirstPageLoad){
        setDebouncedPage(currentPage);
        setFirstPageLoad(false)
      }
      // currentPage==0 || 
      if(currentPage>=debouncedPage){
        setDebouncedPage(currentPage);
      }
      // else{
      //   setDebouncedPage(debouncedPage);
      // }
      
    }
  };

  const iframeRef = useRef(null);

  const handleIframeLoad = () => {
    if (iframeRef.current) {
      iframeRef.current.style.height = iframeRef.current.contentWindow.document.body.scrollHeight + 'px';
    }
  }
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef1.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);
  // ** Props & Custom Hooks

  // ** States
  const [ccOpen, setCCOpen] = useState(false)
  const [bccOpen, setBCCOpen] = useState(false)
  const [composeOpen, setcomposeOpen] = useState(false)
  const [toggleCompose, settoggleCompose] = useState(false)
  const [guestEmail,setguestEmail] = useState()
  const [CompleteData,setCompleteData] = useState()
  const [data,setData] = useState([])
  const [guestSelect,setguestSelect] = useState(false)
  const { reset, handleSubmit, control ,formState: { errors }
} = useForm({ });
   
const SendEmail = (data) =>{
  console.log(guestEmail)
  // if(data['email-to'] == undefined){
  //   data['email-to'] = guestEmail
  // }
  console.log(data)
  fetchx(API_URL + "/sendemailtest", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type:'Payment',
      amount:-1*CompleteData.Amount,
      toAddress:guestEmail,
      receiptNo:CompleteData.receiptNumber,
      transactionID:CompleteData.id
        })
  }).then(result => result.json())
  .then(resp => {
      console.log(resp)
      if(resp.statusCode==200){
        console.log(resp)
        setcomposeOpen(false)
        toast(
          <div className="d-flex">
            <div className="me-1">
              <Avatar size="sm" color="success" icon={<Check size={12} />} />
            </div>
            <div className="d-flex flex-column">
              <h6>Email sent successfully</h6>
              {/* <h4>Wait-List Added Successfully</h4> */}
            </div>
          </div>
        );
      }
      
    }).catch((error) => {
      console.log(error)
      setcomposeOpen(false)
      toast(
        <div className="d-flex">
          <div className="me-1">
            <Avatar size="sm" color="danger" icon={<XCircle size={12} />} />
          </div>
          <div className="d-flex flex-column">
            <h6>Could not send Email</h6>
            {/* <h4>Wait-List Added Successfully</h4> */}
          </div>
        </div>
      );
    })

 
}

  // Function to handle input change
  const handleEmailChange = (event) => {
    setguestEmail(event.target.value); // Update the guestEmail state with the input value
  };
  return (
    <div>
         <Card>
            <CardHeader>
              <CardTitle tag="h4"><b>All Payments</b></CardTitle>
            </CardHeader>
          </Card>
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
      <div className="ag-theme-alpine" style={{ height: 520 }}>

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
          // onPaginationChanged={onPageChanged} //Enable it when limit is added in query
          defaultColDef={defaultColDef}

        />
      </div>

      <Modal isOpen={ShowReceiptPDF} 
      // toggle={() => {setShowReceiptPDF(!ShowReceiptPDF)
      //   setguestSelect(false)}} 
        style={{height:'200px'}} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => {setShowReceiptPDF(!ShowReceiptPDF)
        setguestSelect(false)}}>Payment Receipt</ModalHeader>
       
          <iframe style={{ height: '85vh' }} src={ReceiptURL}> </iframe>
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
      {/* { guestSelect && <div className='compose-mail-form-field'>
           <Label for='email-to' className='form-label'>
              To:
            </Label>
            <div className='flex-grow-1'>
                <InputGroup className="input-group-merge">
                  <Controller
                    id="email-to"
                    name="email-to"
                    control={control}
                    
                    render={({ field }) => (
                      <Input
                      required
                      defaultValue={guestEmail}
                        {...field}
                      />
                    )}
                  />
                </InputGroup>
            </div>
          </div>} */}
          <div className='compose-mail-form-field'>
          <Label htmlFor='email-to' className='form-label'>
        To:
      </Label>
      <div className='flex-grow-1'>
      <InputGroup className="input-group-merge">
        <Input
            type="text"
            id="email-to"
            name="email-to"
            value={guestEmail} // Set the value to guestEmail state
            onChange={handleEmailChange} // Handle input changes
            required
          />
        </InputGroup>
      </div>
    </div>
          
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

export default AvailabilityMatrix;
