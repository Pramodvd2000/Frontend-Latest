// ** React Imports
import { Link } from 'react-router-dom'

import { useState } from "react";
import axios from "axios";
// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Moment from 'moment';
let is_test = false
import { Fragment } from 'react'
import { Nav,TabPane,NavItem,NavLink,TabContent, Table} from 'reactstrap'

import API_URL from "../../../config";

import { useNavigate } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {Input,Card,Form,Label,Button,CardBody,CardTitle,CardHeader,InputGroup,InputGroupText,Row,Col,Modal,ModalBody,
  ModalHeader,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback} from 'react';
import { compileString } from 'sass';

// dotenv.config();
// //console.log(process.env.baseappurl)
// const apiUrl = process.env.REACT_APP_API_URL;
// //console.log(apiUrl)

let FolioOptions =[]
const GetFolioOptions = JSON.stringify({
  hotelID:1,
  reservationID:sessionStorage.getItem('reservationID')
})

let PaymentOptions=[]

const defaultValues1 = {
  Price: '',
  quantity: 1,
  Supplements: '',
  reference:''
}
sessionStorage.setItem('reasonGroupID',7)
const Companydetails = () => {
  const navigate = useNavigate()

  //console.log('---------------------------------')

  const [data, setData] = useState(null)
  const [source, setsource] = useState('')
  const [TransactionCode, setTransactionCode] = useState('')
  const [Description,setDescription] = useState('')
  const [TrxnRowData, setTrxnRowData] = useState()
  const [ReservationData, setReservationData] = useState('')
  const { reset, handleSubmit, control } = useForm({ defaultValues1 })
  const {setError, formState: { errors }} = useForm()
  const gridRef1 = useRef()
  const [showDropdown, setShowDropdown] = useState(true)
  const [TransactionCodeSelect, setTransactionCodeSelect] = useState(false)
  const [PostCharges, setPostCharges] = useState(false)
  const [defaultPrice,setdefaultPrice]= useState('')
  const [defaultAmount,setdefaultAmount] = useState('')
  const [quantity,setquantity]  =useState(1)
  const [Amount,setAmount] = useState('')
  const [FolioCount,setFolioCount] = useState('')
  const [active, setActive] = useState('2')
  const [reload, setreload] = useState(true)
  const [Confirmation,setConfirmation] = useState(false)
  const [show, setShow] = useState(false)
  const [ShowPaymentPreview,setShowPaymentPreview] = useState(false)
  const [PostTrxnPayment,setPostTrxnPayment] = useState(false)
  const [ShowReinstateCheckout,setShowReinstateCheckout] = useState(false)
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [checkboxChecked1, setCheckboxChecked1] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [showPaymentReceipt,setshowPaymentReceipt] = useState(false)
  const [ReloadData,setReloadData] = useState(true)

  const [ReasonSelect, setReasonSelect] = useState(false)
  const [ReasonCode,setReasonCode] =  useState()
  const [reasonCodeData,setreasonCodeData] = useState('')
  const [ReasonID,setReasonID] = useState('')
  const [ReasonRemarks,setReasonRemarks] = useState('')
  const [ReloadReasonRemarks,setReloadReasonRemarks] = useState(true)
  const [errorMsg,seterrorMsg] = useState('')
  const [showErrorMsg,setshowErrorMsg] = useState(false)
  const [ConfirmCheckOut,setConfirmCheckOut] = useState(false)
  const [FoliosToReinstate,setFoliosToReinstate] = useState([])
  const [ShowInvPDF,setShowInvPDF] = useState(false)
  const [InvURL,setInvURL] = useState('')
  // const gridRef1 = useRef()
  const gridOptions = {
    defaultColDef: {
      flex: 1,
      minWidth: 150,
      filter: true,
      sortable: true,
      // floatingFilter: true,
           

    },

  };
  const fetchReasonCodeData =()=>{

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
  let folioNo = ''

  //API to get company list
  useEffect(() => {
    if(localStorage.getItem('reservationID')!=null){
      //console.log('Setting reservationID in session storage',localStorage.getItem('reservationID'))
      sessionStorage.setItem('reservationID',localStorage.getItem('reservationID'))
      localStorage.removeItem('reservationID')
    
    }
    //console.log('In useEffect')


      fetchx(API_URL + "/getReservationDetails", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hotelID: 1,
                reservationID: sessionStorage.getItem('reservationID') 
              })
          }).then(result => result.json())
          .then(rowData => {
              //console.log(rowData)
              setReservationData(rowData['data'][0])
              sessionStorage.setItem('RoomNo',rowData['data'][0]['roomNumber'])
              sessionStorage.setItem('roomID',rowData['data'][0]['room'])
            }).catch((error) => {
              //console.log(error)
            })
// //console.log(JSON.stringify({
//     hotelID: 1,
//     reservationID: sessionStorage.getItem('reservationID') 
//   }))
      fetchx(API_URL + "/getFoliosToReinstate", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hotelID: 1,
                reservationID: sessionStorage.getItem('reservationID') 
              })
          }).then(result => result.json())
          .then(rowData => {
            if(rowData.statusCode==200){
                setFoliosToReinstate(rowData['data'])
                setShowReinstateCheckout(true)
            }
            //console.log(rowData['data'])
            //console.log(FoliosToReinstate)
              
            }).catch((error) => {
              //console.log(error)
            })  
  }, [])  

  const [reasonCodecolumnDefs] = useState([
    { headerName: 'reasonCode', field: 'reasonCode', maxWidth:300 },
  
    { headerName: 'description', field: 'description'},
  
    {
      headerName: "Action",
      maxWidth: 140,
      cellRenderer: (event) => {
        return (<Button color='primary' onClick={()=>{
                                                      setReasonID(event.data.id)
                                                      //console.log(ReasonID,event.data.id)
                                                      setReasonSelect(!ReasonSelect)
                                                                                }}>Select</Button>)
      }
    },
  ])    
 


  //Search element
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef1.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    )
  }, [])


  //ag-grid column defn
  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ))

  const reasonSelectListener = useCallback(event => {
    //console.log(event['data'])
    // setdefaultPrice('')
    // //console.log('Price null')
    // handleReset()
    setReasonID(event.data.id)
    setReasonCode(event['data']['reasonCode'])
    setReasonRemarks(event['data']['description'])
    setReloadReasonRemarks(false)
    setTimeout(()=>{setReloadReasonRemarks(true)},10)
    // sessionStorage.setItem('TransactionCodeID',event['data']['id'])
    // setDescription(event['data']['description'])
    // sessionStorage.setItem('TransactionCodeID',event['data']['id'])
    // setAmount('')
    setReasonSelect(!ReasonSelect)

  })

  //Modal close function
  const onDiscard = () => {
    setTransactionCodeSelect(false)
  }

  const onDiscard2 = () => {
    setPostCharges(false)
  }

  const checkisCode =(event) =>{
    //console.log("hello")
    //console.log(document.getElementById('Price').value)
    // setquantity(document.getElementById('quantity').value)
    let updatedBasePrice=document.getElementById('Price').value
    if(TransactionCode=='' && Description==''){
      alert('Select the Transaction Code')
      setdefaultPrice('')
    }else{
      setdefaultPrice(document.getElementById('Price').value)
      const company = JSON.stringify({
        hotelID: 1,
        transactionCode: sessionStorage.getItem('TransactionCodeID'),
        Price: document.getElementById('Price').value
      })
      //console.log(company)
    fetchx(API_URL + "/getTransactionCodeTaxesbyTrxnCodeID", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: company
    }).then(result => result.json())
    .then(rowData => {
        //console.log(rowData['data'])
        let tax = rowData['data']
        let taxDetails={}
        // let taxPercentage = 0
        taxDetails['sgstAmt'] = 0
        taxDetails['cgstAmt'] = 0
        taxDetails['vatAmt'] = 0
        let qty = 1
        //console.log(qty)
        for(let j=0;j<tax.length;j++){
            // let taxPercentage=parseFloat(tax[j]['taxPercentage'])
            if(tax[j]['taxName'].includes("VAT")){
                taxDetails['vatAmt'] = (qty*(parseFloat(updatedBasePrice)*parseFloat(tax[j]['taxPercentage']))/100).toFixed(2)
                // tax[j]['taxAmt'] = ((parseFloat(updatedBasePrice)*parseFloat(tax[j]['taxPercentage']))/100).toFixed(2)

            }else if(tax[j]['taxName'].includes("CGST")){
                taxDetails['cgstAmt'] = (qty*(parseFloat(updatedBasePrice)*parseFloat(tax[j]['taxPercentage']))/100).toFixed(2)
                // tax[j]['taxAmt'] = ((parseFloat(updatedBasePrice)*parseFloat(tax[j]['taxPercentage']))/100).toFixed(2)
            }else if(tax[j]['taxName'].includes("SGST")){
                taxDetails['sgstAmt'] = (qty*(parseFloat(updatedBasePrice)*parseFloat(tax[j]['taxPercentage']))/100).toFixed(2)
                // tax[j]['taxAmt'] = ((parseFloat(updatedBasePrice)*parseFloat(tax[j]['taxPercentage']))/100).toFixed(2)
            }

        }


         
        taxDetails['totalAmount'] = ((parseFloat(updatedBasePrice)*qty)+parseFloat(taxDetails['cgstAmt'])+parseFloat(taxDetails['sgstAmt'])+parseFloat(taxDetails['vatAmt'])).toFixed(2)  

        setAmount(taxDetails)
        //console.log(taxDetails)
        // setReservationData(rowData['data'])
      }).catch((error) => {
        //console.log(error)
      })
    }
  }
  const handleSelect = id => {
    //console.log(selectedRows)
    const selectedRowsArr = selectedRows
    //console.log(FoliosToReinstate[id]['folioNumber'])
    if (!selectedRowsArr.includes(FoliosToReinstate[id]['folioNumber'])) {
        selectedRowsArr.push(FoliosToReinstate[id]['folioNumber'])
    } else if (selectedRowsArr.includes(FoliosToReinstate[id]['folioNumber'])) {
        selectedRowsArr.splice(selectedRowsArr.indexOf(FoliosToReinstate[id]['folioNumber']), 1)
    } else {
        return null
    }
    //console.log(selectedRowsArr)
    setSelectedRows([...selectedRowsArr])
}

  const handleSelectAll = () => {
    let selectedRowsArr = selectedRows
    if (selectedRowsArr.length < FoliosToReinstate.length) {
        let ids = []
        for (let i = 0; i < FoliosToReinstate.length; i++) {
            ids.push(FoliosToReinstate[i]['folioNumber'])
        }

        selectedRowsArr = ids
    } 
    else if (selectedRowsArr.length === FoliosToReinstate.length) {
        selectedRowsArr = []
    } 
    else {
        return null
    }
    //console.log(selectedRowsArr)
    setSelectedRows(selectedRowsArr)
}
const CheckOut =() =>{
  // //console.log(JSON.stringify({
  //   hotelID: 1,
  //   reservationID:sessionStorage.getItem('reservationID'),
  //   roomID:sessionStorage.getItem('roomID')
  //     }))
  fetchx(API_URL + "/checkOutReservation", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: 1,
          reservationID:sessionStorage.getItem('reservationID'),
          roomID:sessionStorage.getItem('roomID')
            })
      }).then(result => result.json())
      .then(resp => {
          //console.log(resp)
          if(resp.statusCode==200){
            toast(
              <div className="d-flex">
                <div className="me-1">
                  <Avatar size="sm" color="success" icon={<Check size={12} />} />
                </div>
                <div className="d-flex flex-column">
                  <h6>Guest Checked Out Successfully</h6>
                  {/* <h4>Wait-List Added Successfully</h4> */}
                </div>
              </div>
            );
    
            {setTimeout(()=>{navigate('/dashboard/frontdesk')},1000)} // Replace '/new-page' with the actual URL you want to open in the new tab
    
          }else{
            //console.log(resp.message,showErrorMsg)
            seterrorMsg(resp.message)
            setshowErrorMsg(!showErrorMsg)
          }
          setConfirmCheckOut(!ConfirmCheckOut)

        }).catch((error) => {
          //console.log(error)
        })

        // setTimeout(()=>{navigate('/dashboard/testFrontDesk/BillTemplate')},2000)

}
const ConfirmReinstateCheckout = (data)=>{
  setReasonRemarks(data.reasonRemarks)

  //console.log(data)
  //console.log(ReasonCode)
  let ReinstateJSON = JSON.stringify({
    hotelID:1,
    reservationID:sessionStorage.getItem('reservationID'),
    folioArr:selectedRows,
    roomID:sessionStorage.getItem('roomID'),
    // roomID:1,
    reasonID: ReasonID,
    reasonRemarks:ReasonRemarks
  })
  if(selectedRows.length==0){
    // setSelectedRows(null)
    ReinstateJSON = JSON.stringify({
      hotelID:1,
      reservationID:sessionStorage.getItem('reservationID'),
      folioArr:null,
      roomID:sessionStorage.getItem('roomID'),
      // roomID:1,
      reasonID: ReasonID,
      reasonRemarks:ReasonRemarks
    })
  }
  //console.log(selectedRows)
  //console.log(ReinstateJSON)
  fetchx(API_URL + "/reInstateCheckOut", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: ReinstateJSON
        }).then(result => result.json())
        .then(rowData => {
            //console.log(rowData)
            if(rowData.statusCode == 200){
              toast(
                <div className="d-flex">
                  <div className="me-1">
                    <Avatar size="sm" color="success" icon={<Check size={12} />} />
                  </div>
                  <div className="d-flex flex-column">
                    <h6>Reinstate Checkout Successful</h6>
                    {/* <h4>Wait-List Added Successfully</h4> */}
                  </div>
                </div>
              );

              setTimeout(()=>{navigate('/dashboard/frontdesk')},100)
            }else{
              seterrorMsg(rowData.message)
              setshowErrorMsg(!showErrorMsg)
             }
           
          }).catch((error) => {
            //console.log(error)
          })
}
const getInvoice =(billNo)=>{

    // let url = 'http://122.166.2.21//PMS_Invoice/Invoice/PMSInvoice_'+sessionStorage.getItem('reservationID')+'_'+billNo+'.pdf'

  //Live server
//   let url = API_URL+'/getinvoices/PMSInvoice_'+sessionStorage.getItem('reservationID')+'_'+billNo+'.pdf'
          
// //console.log(url)
if(!is_test){
fetchx(API_URL + "/gets3DocumentIDPMS", {
  method: "POST",
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    hotelID: 1,
    DocName:'PMSInvoice',
    transactionID:'',
    reservationID:sessionStorage.getItem('reservationID'),
    billNo:billNo
      })
}).then(result => result.json())
.then(resp => {
    //console.log(resp)
    if(resp.statusCode==200){
      //console.log(resp)
      setInvURL(API_URL+'/images/'+resp['data'])
      //console.log(API_URL+'/images/'+resp['data'])
      setShowInvPDF(true)


    }
    
  }).catch((error) => {
    //console.log(error)
  })
}else{
  setInvURL(API_URL+'/imagepaths/PMS_Invoice/Invoice/PMSInvoice_'+sessionStorage.getItem('reservationID')+'_'+billNo+'.pdf')
  //console.log(API_URL+'/images/'+resp['data'])
  setShowInvPDF(true)
}
        // setInvURL(url)
        // setShowInvPDF(true)
}

  return (
    <div>
{/* {FoliosToReinstate.length!=0 ? <Form onSubmit={handleSubmit(ConfirmReinstateCheckout)}> */}
      
<Form onSubmit={handleSubmit(ConfirmReinstateCheckout)}>
          <Row>
          <Col md='6' sm='12' className='mb-1'>
       
                <Label md='12' sm='12' className="form-label">
                Reason Code
                <Input required type="text" name='TransactionCode' value={ReasonCode}  onClick={fetchReasonCodeData}/>
                </Label>
                </Col>
         {ReloadReasonRemarks &&  
         <Col md='6' sm='12' className='mb-1'>
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

          
          <h3>Select Invoice's to Open</h3>
          {ShowReinstateCheckout &&  <>
            {/*              
            <h6>Guest Name : <b>{ReservationData['name']}</b></h6> 
            <h6> Ph No. :<b>{ReservationData['phoneNumber']}</b></h6>
            <h6>Room No. : <b>{sessionStorage.getItem('RoomNo')}</b></h6> */}
            <table >
                <thead >
                    <tr></tr>
                </thead>
                <tbody>
                    {FoliosToReinstate.length!=0 && FoliosToReinstate.map((row, index) => (
                        <tr key={index}>
                            <td style={{  margin: '6px 0', paddingLeft: '10px' }} >
                                <div className='form-check'>
                                    <Input
                                        id={index}
                                        type='checkbox'
                                        onChange={() => handleSelect(index)}
                                        checked={!!selectedRows.includes(row.folioNumber)}
                                    />
                                </div>
                            </td>
                            <td style={{  margin: '0px 0', paddingLeft: '2px' }}  id={"itemID" + index}>{row.billNo}</td>
                            <td  onClick={()=>{getInvoice(row.billNo)}} style={{color: 'blue', textDecoration: 'underline', margin: '6px 0', paddingLeft: '10px' }}  id={"itemName" + index}>View Invoice</td>
                            {/* <td style={{ margin: '6px 0', paddingLeft: '10px' }}  ><InputNumber disabled="true" id={"qty" + index} value={tableData[index]['qty']}  defaultValue={tableData[index]['qty']} upHandler={<Plus onClick={() => { handlePlusClick1(index) }} />} downHandler={<Minus onClick={() => { handleMinusClick1(index) }} />} /></td>
                            <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"price" + index}>{row.amount}</td> */}

                        </tr>

                    ))}
                        {FoliosToReinstate.length!=0 &&<tr><td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"All"}>
                                <Input
                                    type='checkbox'
                                    id='select-all'
                                    label=''
                                    checked={selectedRows.length==FoliosToReinstate.length && !!selectedRows.length}
                                    onChange={() => handleSelectAll()}
                                    
                                />All</td></tr>}
                           {<tr>
                           <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"Default"}>
                                <Input
                                    type='checkbox'
                                    id='select-all'
                                    label=''
                                    checked={selectedRows.length==0}
                                    // onChange={() => handleSelectAll()}
                                    
                                />Default</td></tr>}     

                </tbody>
            </table>
            {/* <h6>Transaction Code : <b>{TransactionCode}</b></h6> */}
            {/* <h6>Payment Mode : <b>{data.Payment.label}</b></h6>
            <h6>Payment Amount : <b>{data.Amount}</b></h6>
            <h6>Supplements : <b>{data.Supplements}</b></h6>
            <h6>Reference : <b>{data.reference}</b></h6>
            {data.Folio!=undefined && <h6>Folio No: <b>{data.Folio.value}</b></h6>} */}

          </>}
            <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' >
               Confirm
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                // window.location.reload()
                // setShowReinstateCheckout(!ShowReinstateCheckout)
                navigate('/dashboard/frontdesk')
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
          </Form>

          {/* // :
          
          // <h4 className='text-center mb-1'>Cannot Reinstate Checkout as No Folio is settled today</h4>
          
          // } */}
    

       {/* Select Reason */}
       {ReasonSelect && 
            (
              <div>
                  <Modal isOpen={ReasonSelect} toggle={() => setReasonSelect(!ReasonSelect)} className='modal-dialog-centered modal-lg' onClosed={onDiscard}>
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
                                    defaultColDef={defaultColDef}
                                    headerColor="ddw-primary"
                                    gridOptions={gridOptions}
                                  />
                              </div>
                          </ModalBody>
                  </Modal>
 
              </div>
            )
            }
            <Modal
        isOpen={showErrorMsg}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent' toggle={() => {
                setshowErrorMsg(!showErrorMsg);
              }}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h3 className='text-center mb-1'>{errorMsg}</h3>
          
            
            <Row>
            <Col className='text-center mt-1' xs={12}>
             
              <Button
               color='primary'
                onClick={() => {
                // window.location.reload()
                setshowErrorMsg(!showErrorMsg)
              }}
              >
                OK
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal> 
      <Modal isOpen={ShowInvPDF} toggle={() => setShowInvPDF(!ShowInvPDF)} style={{height:'200px'}} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowInvPDF(!ShowInvPDF)}>PMS Invoice</ModalHeader>
       
          <iframe style={{ height: '85vh' }} src={InvURL}> </iframe>
      </Modal>
        {/* </CardBody>
      </Card> */}
    </div>
  )
}

export default Companydetails;
