// // ** Custom Components
import React, { useRef,useEffect, useState , useCallback, useMemo} from 'react'
import { Link } from 'react-router-dom'
import { DateTime } from 'luxon';

import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useNavigate } from 'react-router-dom'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// ** Utils
import { selectThemeColors } from "@utils";
import Cleave from "cleave.js/react";
import classnames from "classnames";
import { Nav,TabPane,Button,NavItem,NavLink,TabContent,Form,Row,Col,Label,InputGroup, Table,Modal,ModalBody,
  ModalHeader,Input, Card, CardHeader, CardTitle, CardBody} from 'reactstrap'
  import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle,UncontrolledDropdown } from 'reactstrap'

  import toast from "react-hot-toast";
  import Avatar from "@components/avatar";
  import { Check } from "react-feather";
  import API_URL from "../../../config";
let is_test = false
import { Fragment } from 'react'

import Moment from 'moment';
import { useDispatch } from 'react-redux';
let defaultopt=[]
let PaymentOptions=[]
// let folioBalance=0
const defaultValues1 = {
    Price: '',
    quantity: 1,
    Supplements: '',
    reference:'',
    Allowance:'',
    AllowanceAmount:'',
    BalanceAfter:'',
    SelectedBalance:'',
    TransactionAmount:'',
    type:'',
    BTCCompany:null
  }
fetchx(API_URL + "/getPaymentTransactionCodes", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        hotelID: 1,
          })
  }).then(result => result.json())
  .then(rowData => {
      //console.log(rowData['data'])
      // setFolioCount(rowData['data'])
      Object.entries(rowData['data']).forEach((entry, index) => {
        const [key, value] = entry
        // //console.log(entry)
        if(entry[1]['label']=='BTC'){
          //console.log('Delete BTC')
          // //console.log(index)
          delete rowData['data'][index]
        }
    })
      PaymentOptions = rowData['data']
    }).catch((error) => {
      //console.log(error)
    })
const FolioTab = () => {
    const navigate = useNavigate()
    const gridRef = useRef();
    const gridRef1 = useRef()
    const [ShowPaymentPreview,setShowPaymentPreview] = useState(false)
    const { reset, handleSubmit, control } = useForm({ defaultValues1 })
    const [data, setData] = useState(null)
    const [errorMsg,seterrorMsg] = useState('')
    const [showErrorMsg,setshowErrorMsg] = useState(false)
    const [defaultAmount,setdefaultAmount] = useState('')
    const [ReservationData,setReservationData] = useState([])
    const [rowData,setRowData] = useState([])
    const [showPaymentReceipt,setshowPaymentReceipt] = useState(false)
    const [ReasonRemarks,setReasonRemarks] = useState('')
  const [ReloadReasonRemarks,setReloadReasonRemarks] = useState(true)
  const [CancelTrnx,setCancelTrnx] = useState('')
  const [TrnxSelected,setTrnxSelected] = useState('')
  const [ReasonCode,setReasonCode] =  useState()
  const [reasonCodeData,setreasonCodeData] = useState('')
  const [ReasonSelect, setReasonSelect] = useState(false)
  const [ReasonID,setReasonID] = useState('')
  const [folioBalance,setfolioBalance] = useState(0)
  const [ReceiptURL,setReceiptURL] = useState('')
 



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

  const [reasonCodecolumnDefs, setreasonCodecolumnDefs] = useState([
    { headerName: 'reasonCode', field: 'reasonCode' },
  
    { headerName: 'description', field: 'description' },
  
    {
      headerName: "Action",
      
      cellRenderer: (event) => {
        return (<Button color='primary' onClick={()=>{setReasonSelect(!ReasonSelect)
                                                      setReasonID(event.data.id)
                                                                                }}>Select</Button>)
      }
    },
    // {
    //   cellRenderer: () => {
    //     return (<Button color='primary' onClick={() => setAssign(!assign)} >View Profile</Button>)
    //   }
    // }
  ])

  const reasonSelectListener = useCallback(event => {
    //console.log(event['data'])
    // setdefaultPrice('')
    // //console.log('Price null')
    // handleReset()
    setReasonCode(event['data']['reasonCode'])
    setReasonRemarks(event['data']['description'])
    setReloadReasonRemarks(false)
    setTimeout(()=>{setReloadReasonRemarks(true)},10)
    setReasonID(event.data.id)

    // sessionStorage.setItem('TransactionCodeID',event['data']['id'])
    // setDescription(event['data']['description'])
    // sessionStorage.setItem('TransactionCodeID',event['data']['id'])
    // setAmount('')
    setReasonSelect(!ReasonSelect)

  })
    const cellClickedListener = useCallback( event => {
        //console.log('cellClicked', event);

      }, []);
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
    useEffect(() => {
      sessionStorage.setItem('reasonGroupID',5)
      if(localStorage.getItem('reservationID')!=null){
        //console.log('Setting reservationID in session storage',localStorage.getItem('reservationID'))
        sessionStorage.setItem('reservationID',localStorage.getItem('reservationID'))
        localStorage.removeItem('reservationID')
      
      }
        const company = JSON.stringify({
            hotelID: 1,
            reservationID: sessionStorage.getItem('reservationID') 
          })
          //console.log(company)
          fetchx(API_URL + "/getReservationDetails", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: company
              }).then(result => result.json())
              .then(rowData => {
                  //console.log(rowData['data'][0])
                  setReservationData(rowData['data'][0])
                  sessionStorage.setItem('RoomNo',rowData['data'][0]['roomNumber'])
                  sessionStorage.setItem('roomID',rowData['data'][0]['room'])
                }).catch((error) => {
                  //console.log(error)
                })
    fetchx(API_URL + "/getFolioBalance", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: 1,
          reservationID: sessionStorage.getItem('reservationID'),
          folioNo:1
            })
      }).then(result => result.json())
      .then(rowData => {
        //console.log(rowData)
          // //console.log(rowData['data']['Balance'])
          // setRowData(rowData['data'])
          if(rowData['data']!=undefined){
            // folioBalance  = rowData['data']['Balance']
            setfolioBalance(rowData['data']['Balance'])
            
            //console.log(folioBalance)
            defaultopt = [{
              value: 1,
              label: "Folio-1 (Balance:"+folioBalance+")",
            }]
            //console.log(defaultopt)
          }

        }).catch((error) => {
          //console.log(error)
        })

        fetchx(API_URL + "/getTransactionOfReservationID", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              hotelID: 1,
              reservationID: sessionStorage.getItem('reservationID'),
              folio:'1' 
            })
          }).then(result => result.json())
          .then(rowData => {
              //console.log("=======================>")
              setRowData(rowData['data'])
            }).catch((error) => {
              //console.log(error)
            })
          // setreload(false)
          // setTimeout(()=>{setreload(true),1000})
          
        
    }, [])

    const [columnDefs, setColumnDefs] = useState([

        {headerName:'Description' , field:'description'},
        {headerName:'BaseAmount' , field:'base_amount',maxWidth: 120},
        {headerName:'Total' , field:'total',maxWidth: 120},
        {headerName: 'FolioNo',field: 'folioNumber',suppressSizeToFit: true,maxWidth: 100, },
    
        {headerName: 'remarks',field: 'remarks',suppressSizeToFit: true,maxWidth: 200},
        {headerName: 'supplement',field: 'supplement',maxWidth: 130},
        { headerName: 'Cancel', cellRendererFramework: (params) => {
          return (
        <Button color='primary' style={{ width: 128 }} onClick={() =>{
          //console.log(params.data)
          setTrnxSelected(params.data)
          setCancelTrnx(true)
        } } >Cancel</Button>)}, suppressSizeToFit: true,maxWidth:148 },

            
          {headerName: 'Date',field: 'date',maxWidth: 150},
          {headerName: 'createdAt',field: 'createdAt',cellRenderer: (params) => {  
            //console.log(params.data.date)      
            // Ensure the arrivalDate field exists in the row data        
            if (params.data && params.data.createdAt) {          
                // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
                // const formattedDate = formatToIST(params.data.createdAt);  
                const formattedDate = Moment(params.data.createdAt).format("DD-MM-YYYY hh:mm:ss");                  
                return formattedDate;        
            } else {          
                return ""; // Handle cases where the data is missing or invalid        
            }      }},
          {headerName: 'transactionType',field: 'transaction_type',maxWidth: 150},
    
      ]);
    const ConfirmPostTrxnPayment = data => {
        //console.log('hiiiiiiiiiiiiiiiii')
        setData(data)
        //console.log(data)
        setShowPaymentPreview(true)    
      }
      
      const AddPayment =() =>{

        // setData(data)
        // //console.log(data)
        //console.log('folioNo',1)
        
        const POSTdata = JSON.stringify({
          hotelID:1,
          transactionCode:data.Payment.value,
          type: 'Payments',
          reservationID:sessionStorage.getItem('reservationID'),
          folioNo:1,
          baseAmt:data.Amount,
          supplement:data.Supplements,
          remarks:data.reference,
          posBillNo:'',
          description:data.Payment.label,
          discountPercentage:0,
          isDeposit:1,
          quantity:1
      
        })
        //console.log(POSTdata)
        const res = fetchx(API_URL + "/postTransaction", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: POSTdata
        }).then(result => result.json())
          .then(resp => {
           //console.log(resp)
           if(resp.statusCode==200){
            sessionStorage.setItem('TransactionID',resp.data)
            localStorage.setItem('TransactionID',resp.data)
      
            toast(
              <div className="d-flex">
                <div className="me-1">
                  <Avatar size="sm" color="success" icon={<Check size={12} />} />
                </div>
                <div className="d-flex flex-column">
                  <h6>Payments Posted Successfully</h6>
                  {/* <h4>Wait-List Added Successfully</h4> */}
                </div>
              </div>
            );
            if(!is_test){
            fetchx(API_URL + "/gets3DocumentIDPMS", {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                hotelID: 1,
                DocName:'Payment',
                transactionID:resp.data,
                reservationID:'',
                billNo:''
                  })
            }).then(result => result.json())
            .then(resp => {
                //console.log(resp)
                if(resp.statusCode==200){
                  //console.log(resp)
                  setReceiptURL(API_URL+'/images/'+resp['data'])
                  //console.log(API_URL+'/images/'+resp['data'])
                  // setShowReceiptPDF(true)
            
            
                }
                
              }).catch((error) => {
                //console.log(error)
              })
            setShowPaymentPreview(!ShowPaymentPreview)
            }else{
              setReceiptURL(API_URL+'/imagepaths/PMS_Invoice/PaymentReceipt/PaymentReceipt_'+resp.data+'.pdf')
              setShowPaymentPreview(!ShowPaymentPreview)
            }
            fetchx(API_URL + "/getTransactionOfReservationID", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  hotelID: 1,
                  reservationID: sessionStorage.getItem('reservationID'),
                  folio:'1' 
                })
              }).then(result => result.json())
              .then(rowData => {
                  //console.log("=======================>")
                  setRowData(rowData['data'])
                }).catch((error) => {
                  //console.log(error)
                })
            // setTimeout(()=>{navigate('/dashboard/testFrontDesk')},100)

                    //   setPostTrxnPayment(!PostTrxnPayment)

                      setshowPaymentReceipt(true)
      
            // setTimeout(()=>{window.location.reload()},2000)
           }else{
            seterrorMsg(resp.message)
            setshowErrorMsg(resp.message)
           }
          }).catch((error) => {
            //console.log(error)
          })
          
      
      }
      const CancelTransactionReset = () => {
        setCancelTrnx(false)
        setReasonCode()
        
        reset({
          reasonRemarks:'',
          
    
        })
      }
      const PostPaymentsReset = () => {
        setPostTrxnPayment(false)
        
        reset({
          Amount: '',
          Payment:'',
          Supplements:'',
          reference:'',
          
    
        })
      }

        const gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
      flex: 1,
      minWidth: 150,
      filter: true,
      sortable: true,
      // floatingFilter: true,
           

    },}


    const CancelTransaction =(data) =>{
      //console.log(data)
      //console.log(ReasonCode)
      setReasonRemarks(data.reasonRemarks)
      
      fetchx(API_URL + "/cancelTransaction", {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: 1,
          transactionID:TrnxSelected.id,
          reasonID:ReasonID,
          // reasonRemarks:data.reasonRemarks
          reasonRemarks : ReasonRemarks
        })
      }).then(result => result.json())
      .then(resp => {
          //console.log(resp['data'])
          if(resp.statusCode==200){
            toast(
              <div className="d-flex">
                <div className="me-1">
                  <Avatar size="sm" color="success" icon={<Check size={12} />} />
                </div>
                <div className="d-flex flex-column">
                  <h6>Transaction cancelled Successfully</h6>
                </div>
              </div>
            );
            setTimeout(()=>{navigate('/dashboard/frontdesk')},1000)
           }else{
            // alert(resp.message)
            seterrorMsg(resp.message)
          setshowErrorMsg(!showErrorMsg)
           }
           setCancelTrnx(!CancelTrnx)
          }).catch((error) => {
            //console.log(error)
          })
        
      
      }

      const fetchxReasonCodeData =()=>{

        fetchx(API_URL + "/getReasonCodes", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelID: 1,
            groupID:sessionStorage.getItem('reasonGroupID')
              })
        }).then(result => result.json())
        .then(rowData => {
            //console.log(rowData['data'])
            setreasonCodeData(rowData['data'])
          }).catch((error) => {
            //console.log(error)
          })
        setReasonSelect(!ReasonSelect)
      }

      const onFilterTextBoxChanged = useCallback(() => {
        //console.log('search....')
        gridRef1.current.api.setQuickFilter(
          document.getElementById('filter-text-box').value
        )
      }, [])
    return (    
        <>
        <div>
        {/* <Card>
        <CardBody> */}
         {ReservationData.length!=0 && 
         <>
         <Row>
            <Col sm='5'>
              <h5>Guest Name : <b>{ReservationData['salutation']+' '}{ReservationData['firstName']+' '}{ReservationData['lastName']}</b></h5>
              <h5>Confirmation No : <b>{ReservationData['bookingID']}</b></h5>
            </Col>
            
            <Col sm='5'>
            <h5>Company : <b>{ReservationData['accountName']}</b></h5>
            <h5>Balance(INR) : <b>{ReservationData['balance']}</b></h5>
            </Col>
            <Col sm='2'>
            <h5>Arrival : <b>{ReservationData['arrivalDate']}</b></h5>
            <h5>Departure : <b>{ReservationData['departureDate']}</b></h5>
            
            </Col>
        </Row>
         
        <div style={{'border-bottom': '1px solid #E8E8E8','margin-bottom': '10px'}} ></div>
   
        
              
         </>}
            

        {/* </CardBody>
      </Card> */}
                      <Form onSubmit={handleSubmit(ConfirmPostTrxnPayment)}>
                              <Row>  
                             
          {/* <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Folio">
            Select Folio
            </Label>
            <Controller
              id="Folio"
              control={control}
              // defaultValue={defaultopt}
              name="Folio"
              render={({ field }) => (
                <Select
                // required
                  isClearable
                  options={defaultopt}
                  defaultValue={defaultopt}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  className={classnames("react-select", {
                    "is-invalid": data !== null && data.Folio === null,
                  })}
                  {...field}
                  
                />
              )}
            />
          </div>
          </Col>  */}
           <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Folio">
            Folio
            </Label>
            <InputGroup className="input-group-merge">
             
              <Controller
                id="Folio"
                name="Folio"
                control={control}
                
                render={({ field }) => (
                  <Input
                  
                  disabled={true}
                    {...field}
                    value={'Folio 1(Balance : '+folioBalance+')'}
                    className={classnames("form-control", {
                      })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
             <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Payment">
            Payment Mode
            </Label>
            <Controller
              id="Payment"
              control={control}
              name="Payment"
              render={({ field }) => (
                <Select
                required
                  isClearable
                  options={PaymentOptions}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  className={classnames("react-select", {
                    "is-invalid": data !== null && data.Payment === null,
                  })}
                  {...field}
                  
                />
              )}
            />
          </div>
          </Col> 
            <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Amount">
            Amount
            </Label>
            <InputGroup className="input-group-merge">
              {/* <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && data.IsActive === null,
                })}
              ></InputGroupText> */}
              <Controller
                name="Amount"
                control={control}
                render={({ field }) => (
                  <Cleave
                    {...field}
                    value={defaultAmount}
                    // onChange={checkisCode}
                    pattern="[0-9.0-9]*" title="Only Numbers Allowed" required
                    id="Price"
                    // placeholder="Enter Price"
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.Amount === null,
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>

          <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Supplements">
            Supplements
            </Label>
            <InputGroup className="input-group-merge">
             
              <Controller
                id="Supplements"
                name="Supplements"
                control={control}
                
                render={({ field }) => (
                  <Input
                    {...field}
                    className={classnames("form-control", {
                      })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="reference">
            Reference
            </Label>
            <InputGroup className="input-group-merge">
             
              <Controller
                id="reference"
                name="reference"
                control={control}
                
                render={({ field }) => (
                  <Input
                    {...field}
                    className={classnames("form-control", {
                     })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          
          

          <br></br>
            <div>
              {/* <Button className='me-1' style={{align:'right'}} color='primary' type='submit'>
                Post Charges
              </Button> */}
              <Button className="me-1" color="primary" type="submit" >
              Submit
            </Button>
            <Button className="me-1" color="primary" type="submit" onClick={()=>{PostPaymentsReset()}} >
              Cancel
            </Button>
            </div>
            </Row>
          </Form>
          <br></br>
          <div className="ag-theme-alpine" style={{  height: 200}}>
        <AgGridReact
                    overlayNoRowsTemplate={'No record found'} 
            ref={gridRef}
            rowData={rowData} columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            
            paginationAutoPageSize = 'true'
            paginationPageSize= '10'
            pagination = 'true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            gridOptions={gridOptions}
            suppressRowClickSelection={true}

            // onGridReady={onGridReady}
            
            />
      </div>   
      </div> 
              {/* Confirm Payments */}
      <Modal
        isOpen={ShowPaymentPreview}
        toggle={() => setShowPaymentPreview(!ShowPaymentPreview)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Preview Payments</h1>
          {ShowPaymentPreview &&  <>
            <h6>Folio No: <b>1</b></h6>            
            <h6>Guest Name : <b>{ReservationData['firstName']}</b></h6> 
            <h6>Payment Mode : <b>{data.Payment.label}</b></h6>
            <h6>Payment Amount : <b>{data.Amount}</b></h6>
            <h6>Supplements : <b>{data.Supplements}</b></h6>
            <h6>Reference : <b>{data.reference}</b></h6>
            

          </>}
            <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' onClick={AddPayment}>
               Confirm
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                // window.location.reload()
                setShowPaymentPreview(!ShowPaymentPreview)
                setPostTrxnPayment(!PostTrxnPayment)
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>
        

        {/* //Error modal */}

        <Modal
        isOpen={showErrorMsg}
        toggle={() => setshowErrorMsg(!showErrorMsg)}
        className='modal-dialog-centered'
      >
        
        <ModalHeader className='bg-transparent' toggle={() => {
                setshowErrorMsg(!showErrorMsg);
              }}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h3 className='text-center mb-1'>{showErrorMsg}</h3>
          
           
            <Row>
            <Col className='text-center mt-1' xs={12}>
              
              <Button
               color='primary'
                onClick={() => {
                setshowErrorMsg(!showErrorMsg)
              }}
              >
                OK
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal> 


                  {/* /////////////// Payment Receipt //////////////////////// */}
                  <Modal
        isOpen={showPaymentReceipt}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h3 className='text-center mb-1'>Do you want to view the Payment Receipt?</h3>

            <Row>
            <Col className='text-center mt-1' xs={12}>
              {/* Live server */}
              <Button type='submit' className='me-1' color='primary'  href= {ReceiptURL} target='_blank' 
              // {/* Local server */}
              // <Button type='submit' className='me-1' color='primary' target="_blank" href= {'http://122.166.2.21//PMS_Invoice/PaymentReceipt/PaymentReceipt_'+sessionStorage.getItem('TransactionID')+'.pdf'} 
               onClick={() => {
                // window.location.reload()

                // ReloadContent()
                setTimeout(()=>{navigate('/dashboard/frontdesk')},10)
                setshowPaymentReceipt(!showPaymentReceipt)
              
              }}>
               Confirm
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                // window.location.reload()

                // ReloadContent()
                setTimeout(()=>{navigate('/dashboard/frontdesk')},10)
                setshowPaymentReceipt(!showPaymentReceipt)
              
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>

      <Modal
        isOpen={CancelTrnx}
        toggle={() => setCancelTrnx(!CancelTrnx)}
        className='modal-dialog-centered'
      onClosed={()=>{CancelTransactionReset()}}>
        <ModalHeader className='bg-transparent' toggle={() => setCancelTrnx(!CancelTrnx)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <Form onSubmit={handleSubmit(CancelTransaction)}>
          <h1 className='text-center mb-1'>Cancel Transaction</h1>
          <Row>
          <Col md='6' sm='12' className='mb-1'>
       
                <Label className="form-label">
                Reason Code
                <Input required type="text" name='TransactionCode'  value={ReasonCode} onClick={fetchxReasonCodeData}/>
                </Label>
                </Col>
          {ReloadReasonRemarks && <Col md='6' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="reasonRemarks">
            Reason Remarks
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
                name="reasonRemarks"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    defaultValue={ReasonRemarks}
                    // onChange={checkisCode}
                    id="reasonRemarks"
                    pattern="[Aa-Zz]*" title="Only Alphabets Allowed" required
                    // placeholder="Enter Store ID"
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.reasonRemarks === null,
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>}
          </Row>
          {CancelTrnx &&  <>
            {/* <h5>Do you want to Cancel Transaction</h5> */}
            <h6>Description : {TrnxSelected.description}</h6>
            <h6>Final Amount : {TrnxSelected.total}</h6>
            <h6>Transaction Date : {TrnxSelected.date}</h6>

            {/* {data.Folio!=undefined && <h6>Folio No: <b>{data.Folio.value}</b></h6>} */}

          </>}
          
            <Row>
              
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary'>
               Confirm
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                // window.location.reload()
                CancelTransactionReset()
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
          </Form>
        </ModalBody>
      </Modal> 

      {/* Select Reason */}
      {ReasonSelect && 
            (
              <div>
                  <Modal isOpen={ReasonSelect} toggle={() => setReasonSelect(!ReasonSelect)} className='modal-dialog-centered modal-lg' onClosed={()=>{setReasonSelect(!ReasonSelect)}}>
                      <ModalHeader toggle={() => setReasonSelect(!ReasonSelect)}>Search and Select Code</ModalHeader>
                          <ModalBody>
                              <div>
                                  <Row className='mb-1'>
                                      <Col md='3' sm='12' className='me-1'>
                                        <Label className='form-label' for='fullName'>
                                          Search
                                        </Label>
                                        <Input
                                          type="text"
                                          id="filter-text-box"
                                          placeholder="Filter..."
                                          onInput={onFilterTextBoxChanged}
                                          />
                                      </Col>
                                      {/* <Col md='3' sm='12' className='me-1'>
                                        <br></br> &nbsp;&nbsp;&nbsp;
                                        <Button align='right' color='primary' onClick={onclickButton}> Add New Guest</Button>
                                      </Col> */}
                                  </Row>
                              </div>
                              <div className="ag-theme-alpine" style={{ height: 520 }}>
                                  <AgGridReact
                                    overlayNoRowsTemplate={'No record found'}
                                    ref={gridRef1}
                                    rowData={reasonCodeData}
                                    columnDefs={reasonCodecolumnDefs}
                                    animateRows={true}
                                    onCellClicked={reasonSelectListener}
                                    paginationPageSize='10'
                                    pagination='true'
                                    // defaultColDef={defaultColDef}
                                    headerColor="ddw-primary"
                                     gridOptions={gridOptions}

                                  />
                                        
                              </div>
                          </ModalBody>
                  </Modal>
              </div>
            )
            }
        </>
    
        )
}

export default FolioTab