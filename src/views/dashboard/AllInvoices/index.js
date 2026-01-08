
import { useState,useRef, useEffect, useMemo, useCallback} from 'react';

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'


import API_URL from "../../../config";
import {Row,Card,CardHeader,CardTitle,CardBody,Button,Modal,ModalBody,
  ModalHeader,Col,Label,Input,Form,InputGroup} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import toast from "react-hot-toast";
import Avatar from "@components/avatar";
import { Check } from "react-feather";
import { XCircle } from "react-feather";
import Moment from 'moment';
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
let is_test = false
const AvailabilityMatrix = () => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef(null);
  const gridRef1 = useRef();

  const [FirstPageLoad,setFirstPageLoad] = useState(true)
  const [debouncedPage, setDebouncedPage] = useState(0);
  const [InvURL,setInvURL] = useState('')
  const [ShowInvPDF,setShowInvPDF] = useState(false)
  const [Today,setToday] = useState()
  const [data, setData] = useState([]);
  const [LoadingVar,setLoadingVar] = useState(false)
  
  const columnDefs = [
            {headerName: 'Invoice No',field: 'billNoDisplay',maxWidth: 130},
            { headerName: 'Invoice', cellRendererFramework: (params) => {
              return (
            <Button color='primary' style={{ width: 70 }} onClick={() =>{
              console.log(params.data)
              getInvoice(params.data.reservationID,params.data.billNo)} } >View</Button>)},maxWidth: 120 },
              { headerName: 'Send', cellRendererFramework: (params) => {        
                return (
                  
              <Button color='primary' style={{ width: 70 }} onClick={() =>{
                console.log(params.data)
                setCompleteData(params.data)
                
                
                if(params.data.BTCAccount == null){
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
              }} >Email</Button>)}, suppressSizeToFit: true,maxWidth:120 },
            {headerName: 'roomNo',field: 'roomNumber',maxWidth: 110},
            {headerName: 'guestName',field: 'guestName',width: 260},
            {headerName: 'Amount',field: 'invoiceAmount',maxWidth: 130},
            {headerName: 'booking ID',field: 'bookingID',maxWidth: 130},
            {headerName: 'invoiceDate',field: 'invoiceDate',maxWidth: 130},
            {headerName: 'SettlementType',field: 'SettlementType',maxWidth: 160},
            {headerName: 'GuestGST',field: 'GuestGST',width: 230},
            {headerName: 'BTCCompanyName',field: 'BTCCompanyName',width: 230},
            {headerName: 'BTCCompanyGST',field: 'CompanyGST',width: 230},

          ]

  const onGridReady = (params) => {
    gridRef.current = params.api;
  };
  const getRowStyle = params => {
    if (params.data && params.data.isCancelled === 1) {
      return { background: '#3598db' };
    }
    return null;
  };

  const ConfirmSubmit = (data) => {
    console.log(data)
    data.FromDate=(Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD'))
    data.ToDate=(Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD'))
    setData(data)
    loadPageData(data)
  }
  const loadPageData = (data) => {
    let FromDate  = data.FromDate
    let ToDate  =data.ToDate


    if(FromDate != undefined && ToDate != undefined){
    fetchx(API_URL + `/getAllInvoices?hotelID=1&FromDate=${FromDate}&ToDate=${ToDate}`)
      .then((result) => result.json())
      .then((response) => {
        setRowData(response['data'])

        // for(let i=0 ;i<response['data'].length;i++){
        //     setRowData(rowData=>[...rowData,(response['data'][i])])
        //   }
      });
  };
};
  const getInvoice =(reservationID,billNo)=>{

    if(!is_test){
      fetchx(API_URL + "/gets3DocumentIDPMS", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: 10,
          DocName:'PMSInvoice',
          transactionID:'',
          reservationID:reservationID,
          billNo:billNo
            })
      }).then(result => result.json())
      .then(resp => {
          if(resp.statusCode==200){
            setInvURL(API_URL+'/images/'+resp['data'])
            setShowInvPDF(true)
      
      
          }else if(resp.message==='Document does not exists'){
            // call getinvoicejson api to regenerate
              console.log('Regenrating Inv')
              fetchx(API_URL +`/getInvoiceJSON?hotelID=10&reservationID=${reservationID}&folioNo=${folioNo}`)
              .then(result => result.json())
              .then(rowData => {
                console.log(rowData)
                if(resp.statuscode==200){
                  let docID = rowData['s3url']
                  setInvURL(API_URL+'/images/'+docID)
                  setShowInvPDF(true)
                  
                }
                          
              }).catch((error) => {
                console.log(error)
              })
            }
          
        }).catch((error) => {
          console.log(error)
        })
    }else{
      setInvURL(API_URL+'/imagepaths/PMS_Invoice/Invoice/PMSInvoice_' + reservationID + '_' + billNo + '.pdf')
      setShowInvPDF(true)
    }
}

const defaultColDef = useMemo( ()=> (
  {
    sortable: true, 
    filter: true,
    filterParams :{
    buttons : ['apply','reset']
    }
  }
));
useEffect(() => {
  // fetchx data only on initial component mount
  if (FirstPageLoad) {
    fetchx(API_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
      })
    })
    .then(result => result.json())
    .then(resp => {
      console.log(resp['data'])
      let date = new Date(resp['data'][0]['businessDate']);
      setToday(resp['data'][0]['businessDate'])
      let tempJSON = {
        'FromDate': resp['data'][0]['businessDate'],
        'ToDate': resp['data'][0]['businessDate']
      }
      setData(tempJSON)
      loadPageData(tempJSON);
    })
    .catch((error) => {
      console.log(error)
    });

    // Update FirstPageLoad state to prevent subsequent calls
    setFirstPageLoad(false);
  }
}, [FirstPageLoad]); // Only run effect when FirstPageLoad changes
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


    fetchx(API_URL + "/sendemailtest", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type:'PMSInvoice',
        amount:CompleteData.invoiceAmount,
        toAddress:guestEmail,
        receiptNo:CompleteData.billNoDisplay,
        ccAddress:CC1_Email+';'+CC2_Email,
        billID:CompleteData.id,
        BillNo:CompleteData.billNo,
        reservationID:CompleteData.reservationID
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
    fileName: 'All Invoices', // Set your desired file name here
  };
  const onBtnExport = useCallback(() => {
    gridRef1.current.api.exportDataAsCsv(params);
  }, []);
  return (
    <div>
         <Card>
            <CardHeader>
              <CardTitle tag="h4"><b>All Invoices</b>
              {data.length !== 0 && (
                <p style={{ display: 'inline', marginLeft: '10px' }}>
                  from {data.FromDate} to {data.ToDate}
                </p>
              )}
              </CardTitle>
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
        <Col md='3' sm='6' className="mb-1">
            <div className='inline-spacing' align="right" style={{ margin: '2px 0' }}>
            <Button.Ripple color='primary' style={{ marginTop: '22px'}} onClick={onBtnExport}  >Download CSV file</Button.Ripple>
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
        />
      </div>

      <Modal isOpen={ShowInvPDF} toggle={() => setShowInvPDF(!ShowInvPDF)} style={{height:'200px'}} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowInvPDF(!ShowInvPDF)}>PMS Invoice</ModalHeader>
       
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
    </div>
  );
};

export default AvailabilityMatrix;
