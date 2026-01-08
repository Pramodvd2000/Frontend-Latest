// ** React Imports
import { Link } from 'react-router-dom'

import { useState } from "react";
import axios from "axios";
// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check,Edit2 } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Moment from 'moment';
import ProfileViews from "./editGuestDetails/index"
import CompanyProfileViews from "./editcompanyProfile/index"

// if(localStorage.getItem('reservationID')!=null){
//   console.log('Setting reservationID in session s6torage',localStorage.getItem('reservationID'))
//   sessionStorage.setItem('reservationID',localStorage.getItem('reservationID'))

//   localStorage.removeItem('reservationID')

// }
import FolioTab from './OnHoldFolioTab'
import { Fragment } from 'react'
import { Nav,TabPane,NavItem,NavLink,TabContent, Table} from 'reactstrap'

import API_URL from "../../../../config";

import { useNavigate } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {Input,Card,Form,Label,Button,CardBody,CardTitle,CardHeader,InputGroup,InputGroupText,Row,Col,Modal,ModalBody,
  ModalHeader,
} from "reactstrap";
// import { Button, Modal, ModalBody, ModalHeader, Card, Form, Label, UncontrolledPopover, PopoverHeader, PopoverBody, CardBody, CardTitle, CardHeader, Row, Col, Input, DropdownMenu, ModalFooter,
// } from "reactstrap";

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
import moment from 'moment';

// dotenv.config();
// console.log(process.env.baseappurl)
// const apiUrl = process.env.REACT_APP_API_URL;
// console.log(apiUrl)

let FolioOptions =[]
const GetFolioOptions = JSON.stringify({
  hotelID:1,
  reservationID:sessionStorage.getItem('reservationID')
})

let PaymentOptions=[]
  const GetPaymentData = JSON.stringify({
    hotelID: 1,
      })
fetchx(API_URL + "/getPaymentTransactionCodes", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: GetPaymentData
    }).then(result => result.json())
    .then(rowData => {
        console.log(rowData['data'])
        Object.entries(rowData['data']).forEach((entry, index) => {
          const [key, value] = entry
          console.log(entry)
          if(entry[1]['label']=='BTC'){
            console.log('Delete BTC')
            console.log(index)
            delete rowData['data'][index]
          }
       });
        // setFolioCount(rowData['data'])
        PaymentOptions = rowData['data']
      }).catch((error) => {
        console.log(error)
      })

const defaultValues1 = {
  Price: '',
  quantity: 1,
  Supplements: '',
  reference:''
}



const Companydetails = () => {
  const navigate = useNavigate()

  console.log('---------------------------------')
  
  console.log('In INDEX')

  console.log('---------------------------------')
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
  const [errorMsg,seterrorMsg] = useState('')
  const [showErrorMsg,setshowErrorMsg] = useState(false)
  const [ConfirmCheckOut,setConfirmCheckOut] = useState(false)
  const [SelectedFolio,setSelectedFolio] = useState('0')
  const [ShowSharer,setShowSharer] = useState(false)
  const [AllGuests,setAllGuests] = useState([])
  const [Sharers , setSharers] = useState([])
  const [UnsettledTrxn,setUnsettledTrxn] = useState(false)
  const [SharerExists,setSharerExists] = useState(false)
  const [CheckOutSharer,setCheckOutSharer] = useState(false)
  const [CommentsHovered, setCommentsHovered] = useState(false);
  const [BillingInstHovered, setBillingInstHovered] = useState(false);
  const [AddressHovered, setAddressHovered] = useState(false);
  const [CompanyHovered, setCompanyHovered] = useState(false);
  const [profileView, setProfileView] = useState();
  const [companyprofileView, setCompanyProfileView] = useState();
  const [EnableButton,setEnableButton] = useState(false)
  const [FoliosToSettle,setFoliosToSettle] = useState([])
  const [Today,setToday] = useState()
  const gridOptions = {
    defaultColDef: {
      flex: 1,
      minWidth: 150,
      filter: true,
      sortable: true,
      // floatingFilter: true,
           

    },

  };
  // const gridRef1 = useRef()
  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked)
  }
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
        console.log(rowData['data'])
        setreasonCodeData(rowData['data'])
      }).catch((error) => {
        console.log(error)
      })
    setReasonSelect(!ReasonSelect)
  }
  let folioNo = ''
const AddCharges =() =>{
  setEnableButton(true)
  setDescription('')

  
  if(data.Folio!=undefined){
    folioNo = data.Folio.value
  }
  console.log('folioNo',folioNo)
  setSelectedFolio(folioNo)
  const POSTdata = JSON.stringify({
    hotelID:1,
    transactionCode:sessionStorage.getItem('TransactionCodeID'),
    type: 'Bill',
    reservationID:sessionStorage.getItem('reservationID'),
    folioNo:folioNo,
    baseAmt:defaultPrice,
    supplement:data.Supplements,
    remarks:data.reference,
    posBillNo:'',
    description:Description,
    discountPercentage:0,
    isDeposit:0,
    quantity:1

  })
  console.log('POST Trxn===========================')
  console.log(POSTdata)
  const res = fetchx(API_URL + "/postTransaction", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: POSTdata
  }).then(result => result.json())
    .then(resp => {
     console.log(resp)
     if(resp.statusCode==200){
      toast(
        <div className="d-flex">
          <div className="me-1">
            <Avatar size="sm" color="success" icon={<Check size={12} />} />
          </div>
          <div className="d-flex flex-column">
            <h6>Transaction Posted Successfully</h6>
            {/* <h4>Wait-List Added Successfully</h4> */}
          </div>
        </div>
      );
      // setTimeout(()=>{window.location.reload()},2000)
      ReloadContent()
      setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},10)
      setEnableButton(false)
     }else{
      seterrorMsg(resp.message)
      setshowErrorMsg(!showErrorMsg)
      setEnableButton(false)
     }
    }).catch((error) => {
      setEnableButton(false)
      console.log(error)
    })
    
    handleReset()
    setShow(!show)
    setPostCharges(!PostCharges)
  
}

const ReloadContent = ()=>{
  setReloadData(false)
  
  setTimeout(()=> setReloadData(true),100)
  console.log('In Reload function')
    const FolioCount = JSON.stringify({
      hotelID: 1,
      reservationID: sessionStorage.getItem('reservationID')
        })
  fetchx(API_URL + "/getFolioOnHoldCount", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: FolioCount
      }).then(result => result.json())
      .then(rowData => {
          console.log(rowData['data'])
          setFolioCount(rowData['data'])
          FolioOptions = rowData['data']
        }).catch((error) => {
          console.log(error)
        })
    // ReactDOM.render(<CardData />, document.getElementById("displayCard"))
    fetchx(API_URL + `/getAllTransactionCode?hotelID=1`)
      .then(result => result.json())
      .then(rowData => {
        setTrxnRowData(rowData['data'])
        // console.log(rowData['data'])
        // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
      })
    const company = JSON.stringify({
      hotelID: 1,
      reservationID: sessionStorage.getItem('reservationID') 
    })
    console.log(company)
    fetchx(API_URL + "/getReservationDetails", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: company
        }).then(result => result.json())
        .then(rowData => {
            console.log(rowData['data'][0])
            setReservationData(rowData['data'][0])
            if(ReservationData['reservationStatus']=='Checked Out'){
              setEnableButton(true)
            }
            sessionStorage.setItem('RoomNo',rowData['data'][0]['roomNumber'])
            sessionStorage.setItem('roomID',rowData['data'][0]['room'])
          }).catch((error) => {
            console.log(error)
          })

          const GetFolioOptions = JSON.stringify({
            hotelID:1,
            reservationID:sessionStorage.getItem('reservationID')
          })

}
const AddPayment =() =>{

  // setData(data)
  // console.log(data)
  let folioNo = ''
  if(data.Folio!=undefined){
    folioNo = data.Folio.value
  }
  const POSTdata = JSON.stringify({
    hotelID:1,
    transactionCode:data.Payment.value,
    type: 'Payments',
    reservationID:sessionStorage.getItem('reservationID'),
    folioNo:folioNo,
    baseAmt:data.Amount,
    supplement:data.Supplements,
    remarks:data.reference,
    posBillNo:'',
    description:data.Payment.label,
    discountPercentage:0,
    isDeposit:0,
    quantity:1

  })
  console.log(POSTdata)
  const res = fetchx(API_URL + "/postTransaction", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: POSTdata
  }).then(result => result.json())
    .then(resp => {
     console.log(resp)
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
      setShowPaymentPreview(!ShowPaymentPreview)
                setPostTrxnPayment(!PostTrxnPayment)
                setshowPaymentReceipt(true)

      // setTimeout(()=>{window.location.reload()},2000)
     }else{
      seterrorMsg(resp.message)
      setshowErrorMsg(!showErrorMsg)
     }
    }).catch((error) => {
      console.log(error)
    })
    

}

  //On submit function
  const onSubmit = data => {
    console.log('hiiiiiiiiiiiiiiiii')
    setData(data)
    console.log(data)
    handleReset()
    setShow(PostCharges)    
  }


  const ConfirmPostTrxnPayment = data => {
    console.log('hiiiiiiiiiiiiiiiii')
    setData(data)
    console.log(data)
    setShowPaymentPreview(true)    
  }
  //API to get company list
  useEffect(() => {
    if(localStorage.getItem('reservationID')!=null){
      console.log('Setting reservationID in session s6torage',localStorage.getItem('reservationID'))
      sessionStorage.setItem('reservationID',localStorage.getItem('reservationID'))
    
      localStorage.removeItem('reservationID')
    
    }
    
    fetchx(API_URL + "/getBusinessDate", {
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
    // sessionStorage.setItem('reservationID',localStorage.getItem('reservationID'))
    // sessionStorage.setItem('RoomNo',localStorage.getItem('RoomNo'))
    // sessionStorage.setItem('departureDate',localStorage.getItem('departureDate'))
    
    console.log('In useEffect')
    const FolioCount = JSON.stringify({
      hotelID: 1,
      reservationID: sessionStorage.getItem('reservationID')
        })
  fetchx(API_URL + "/getFolioOnHoldCount", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: FolioCount
      }).then(result => result.json())
      .then(rowData => {
          console.log(rowData['data'])
          FolioOptions = rowData['data']
          setFolioCount(rowData['data'])
        }).catch((error) => {
          console.log(error)
        })
    // ReactDOM.render(<CardData />, document.getElementById("displayCard"))
    fetchx(API_URL + `/getAllTransactionCode?hotelID=1`)
      .then(result => result.json())
      .then(rowData => {
        setTrxnRowData(rowData['data'])
        // console.log(rowData['data'])
        // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
      })
    const company = JSON.stringify({
      hotelID: 1,
      reservationID: sessionStorage.getItem('reservationID') 
    })
    console.log(company)
    fetchx(API_URL + "/getReservationDetails", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: company
        }).then(result => result.json())
        .then(rowData => {
            console.log(rowData['data'][0])
            if(rowData['data'][0]['reservationStatus']=='Checked Out'){
              console.log('Guest is checked out')
              setEnableButton(true)
            }
            sessionStorage.setItem('RoomNo',rowData['data'][0]['RoomNumber'])
            sessionStorage.setItem('departureDate',rowData['data'][0]['departureDate'])
            // if(rowData['data'][0].length!=0 && rowData['data'][0]['isMain']==1){

              //Call an api to get AllGuests

              fetchx(API_URL + `/getAllGuestsBySharingID?hotelID=1&sharingID=`+rowData['data'][0]['sharingID'])

              .then(result => result.json())
              .then(response => {
                console.log(response['data'])

                setAllGuests(response.data)
                // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
              })
              // fetchx(API_URL + "/checkIfSharerExists", {
              //   method: "GET",
              //   headers: { 'Content-Type': 'application/json' },
              //   body: JSON.stringify({
              //     hotelID: 1,
              //     sharingID: rowData['data'][0]['sharingID']
              //       })
              // }).then(result => result.json())
              // .then(response => {
              //     console.log(response['data'])
              //     setAllGuests[response.data]
                  
              //   }).catch((error) => {
              //     console.log(error)
              //   })
            // }
            setReservationData(rowData['data'][0])
            
            sessionStorage.setItem('RoomNo',rowData['data'][0]['roomNumber'])
            sessionStorage.setItem('roomID',rowData['data'][0]['room'])
          }).catch((error) => {
            console.log(error)
          })
          // console.log(AllGuests)
          fetchx(API_URL + '/getAllFoliosWithTrxnForRes?hotelID=1&reservationID='+sessionStorage.getItem('reservationID'))
          .then(result => result.json())
          .then(response => {
            console.log(response['data'])
            if(response['data'].length>0){
              setFoliosToSettle(response['data'])

            }
          })
            

  }, [])  

  const [reasonCodecolumnDefs] = useState([
    { headerName: 'reasonCode', field: 'reasonCode', maxWidth:300 },
  
    { headerName: 'description', field: 'description'},
  
    {
      headerName: "Action",
      maxWidth: 140,
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
  //Ag-grid column definition
  const [TrxncolumnDefs] = useState([
    { headerName: 'transactionCode', field: 'transactionCode', maxWidth:300 },
    // { headerName: 'Address', field: "description", valueGetter(params) {
    //     return params.data.addressLine1 + ' ' + params.data.addressLine2;
    //   },suppressSizeToFit: true, maxWidth: 600 },
    { headerName: 'description', field: 'description', maxWidth:300 },
    // { headerName: 'Mobile Number', field: 'phoneNumber', maxWidth:300 },
    // { headerName: 'Email ID', field: 'email', maxWidth:300 },
    // { headerName: 'Country', field: 'country', maxWidth:300 },
    {
      headerName: "Action",
      maxWidth: 140,
      cellRenderer: () => {
        return (<Button color='primary' onClick={onDiscard}>Select</Button>)
      }
    },
    // {
    //   cellRenderer: () => {
    //     return (<Button color='primary' onClick={() => setAssign(!assign)} >View Profile</Button>)
    //   }
    // }
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


  //ag-grid cell clcked value
  const cellClickedListener = useCallback(event => {
    console.log(event['data'])
    setdefaultPrice('')
    console.log('Price null')
    // handleReset()
    setTransactionCode(event['data']['transactionCode'])
    sessionStorage.setItem('TransactionCodeID',event['data']['id'])
    setDescription(event['data']['description'])
    sessionStorage.setItem('TransactionCodeID',event['data']['id'])
    setAmount('')


  })
  const reasonSelectListener = useCallback(event => {
    console.log(event['data'])
    // setdefaultPrice('')
    // console.log('Price null')
    // handleReset()
    setReasonCode(event['data']['reasonCode'])
    setReasonID(event.data.id)

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



  //reset function
  const handleReset = () => {
    setTransactionCode('')
    // setDescription('')
    // setdefaultPrice('')
    reset({
      Price: '',
      Folio:'',
      Supplements:'',
      reference:'',
      TransactionCode:'',
      Description:''

    })
  }
  function getButtonsUsingForLoop(folioarr) {
    console.log(folioarr)
    const array = []
    if(typeof(folioarr)!='undefined')
    for(var i = 0; i < folioarr.length; i++){
    //    <>
    //         <h3>Hello</h3>

        let foliocount = folioarr[i]['value']
        let folioBalance = folioarr[i]['label']
            array.push(
                <NavItem>
            <NavLink
              active={active === foliocount}
              onClick={() => {
                toggle(foliocount)
              }}
            >
              <b>Folio-{foliocount}<br/>Balance(INR)<br/>{folioBalance}</b>
            </NavLink>
            </NavItem>)
     
        //   </>
    }

    return array
  }

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)  
      console.log(tab)
      sessionStorage.setItem('FolioNo',tab)
    localStorage.setItem('FolioNo',tab)

      // Object.entries(FolioCount).forEach(([key, value]) => {
      //          console.log(key,value)
      //       });
      setreload(false)
      setTimeout(()=>{setreload(true)},1)
    }
  }
  const checkisCode =(event) =>{
    console.log("hello")
    console.log(document.getElementById('Price').value)
    // setquantity(document.getElementById('quantity').value)
    let updatedBasePrice=document.getElementById('Price').value
    if(TransactionCode=='' && Description==''){
      seterrorMsg('Select the Transaction Code')
      setshowErrorMsg(!showErrorMsg)
      setdefaultPrice('')
    }else{
      setdefaultPrice(document.getElementById('Price').value)
      const company = JSON.stringify({
        hotelID: 1,
        transactionCode: sessionStorage.getItem('TransactionCodeID'),
        Price: document.getElementById('Price').value
      })
      console.log(company)
    fetchx(API_URL + "/getTransactionCodeTaxesbyTrxnCodeID", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: company
    }).then(result => result.json())
    .then(rowData => {
        console.log(rowData['data'])
        let tax = rowData['data']
        let taxDetails={}
        // let taxPercentage = 0
        taxDetails['sgstAmt'] = 0
        taxDetails['cgstAmt'] = 0
        taxDetails['vatAmt'] = 0
        let qty = 1
        console.log(qty)
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
        console.log(taxDetails)
        // setReservationData(rowData['data'])
      }).catch((error) => {
        console.log(error)
      })
    }
  }
  const handleSelect = id => {
    console.log(selectedRows)
    const selectedRowsArr = selectedRows
    console.log(FolioOptions[id]['value'])
    if (!selectedRowsArr.includes(FolioOptions[id]['value'])) {
        selectedRowsArr.push(FolioOptions[id]['value'])
    } else if (selectedRowsArr.includes(FolioOptions[id]['value'])) {
        selectedRowsArr.splice(selectedRowsArr.indexOf(FolioOptions[id]['value']), 1)
    } else {
        return null
    }
    console.log(selectedRowsArr)
    setSelectedRows([...selectedRowsArr])
}

  const handleSelectAll = () => {
    let selectedRowsArr = selectedRows
    if (selectedRowsArr.length < FolioOptions.length) {
        let ids = []
        for (let i = 0; i < FolioOptions.length; i++) {
            ids.push(FolioOptions[i]['value'])
        }

        selectedRowsArr = ids
    } 
    else if (selectedRowsArr.length === FolioOptions.length) {
        selectedRowsArr = []
    } 
    else {
        return null
    }
    console.log(selectedRowsArr)
    setSelectedRows(selectedRowsArr)
}
const CheckOut =() =>{
  console.log(JSON.stringify({
    hotelID: 1,
    reservationID:sessionStorage.getItem('reservationID'),
    roomID:sessionStorage.getItem('roomID'),
    checkOutSharer:CheckOutSharer
      }))

  fetchx(API_URL + "/checkOutReservation", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: 1,
          reservationID:sessionStorage.getItem('reservationID'),
          roomID:sessionStorage.getItem('roomID'),
          checkOutSharer:CheckOutSharer
            })
      }).then(result => result.json())
      .then(resp => {
          console.log(resp)
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
    
            {setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},1000)} // Replace '/new-page' with the actual URL you want to open in the new tab
    
          }else{
            console.log(resp.message,showErrorMsg)
            seterrorMsg(resp.message)
            setshowErrorMsg(!showErrorMsg)
          }
          setConfirmCheckOut(!ConfirmCheckOut)

        }).catch((error) => {
          console.log(error)
        })

        // setTimeout(()=>{navigate('/dashboard/testFrontDesk/BillTemplate')},2000)

}
const ConfirmReinstateCheckout = (data)=>{
  console.log(data)
  console.log(ReasonCode)
  fetchx(API_URL + "/reInstateCheckOut", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelID:1,
            reservationID:sessionStorage.getItem('reservationID'),
            folioArr:selectedRows,
            roomID:sessionStorage.getItem('roomID'),
            reasonID: ReasonID,
            reasonRemarks:data.reasonRemarks
          })
        }).then(result => result.json())
        .then(rowData => {
            console.log(rowData)
            if(rowData.statusCode == 200){
              setShowReinstateCheckout(!ShowReinstateCheckout)
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
            }else{
              seterrorMsg(resp.message)
              setshowErrorMsg(!showErrorMsg)
             }
           
          }).catch((error) => {
            console.log(error)
          })
}

const handleLinkClick =(sharerID,roomID,roomNumber,departureDate)=>{
  console.log(sharerID)
  sessionStorage.setItem('reservationID',sharerID)
  sessionStorage.setItem('RoomNo',roomNumber)
  sessionStorage.setItem('departureDate',shadepartureDatererID)

  setShowSharer(true)
}



const ConfirmCheckoutGuest=()=>{
  setEnableButton(true)
  console.log(ReservationData)
  if(ReservationData['isMain']==1){
    console.log(API_URL + `/checkIfSharerExists?hotelID=1&sharingID=`+ReservationData['sharingID'])
    fetchx(API_URL + `/checkIfSharerExists?hotelID=1&sharingID=`+ReservationData['sharingID'])

          .then(result => result.json())
          .then(response => {
            console.log(response['data'])
            if(response.statusCode==200){
              setSharers(response.data.AllSharers)
              setUnsettledTrxn(response.data.UnsettledTrxn)
              setCheckOutSharer(!response.data.UnsettledTrxn)
              setSharerExists(true)
              setEnableButton(false)
            }
            else{
              setCheckOutSharer(false)
              setSharerExists(false)
              setEnableButton(false)
            }
            // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
          })
  }
  setConfirmCheckOut(!ConfirmCheckOut)
}

const handleMouseEnterComments = () => {
  setCommentsHovered(true);
};

const handleMouseLeaveComments = () => {
  setCommentsHovered(false);
};

const handleMouseEnterBillingInst = () => {
  setBillingInstHovered(true);
};

const handleMouseLeaveBillingInst = () => {
  setBillingInstHovered(false);
};

const handleMouseEnterAddress = () => {
  setAddressHovered(true);
};

const handleMouseLeaveAddress = () => {
  setAddressHovered(false);
};

const handleMouseEnterCompany = () => {
  setCompanyHovered(true);
};

const handleMouseLeaveCompany = () => {
  setCompanyHovered(false);
};


  return (
    <div>
<div>
    {console.log(ReservationData)}
    {
ReservationData && 
        <Modal  isOpen={profileView} toggle={() => setProfileView(!profileView)}className="modal-xl"  >
          <ModalHeader className="modal-lg"toggle={() => setProfileView(!profileView)} >
            View Profile
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">            
            <ProfileViews ReservationData ={ReservationData}/>            
          </ModalBody>
        </Modal>}
      </div>

      <div>
    {console.log(ReservationData)}
    {
ReservationData && 
        <Modal  isOpen={companyprofileView} toggle={() => setCompanyProfileView(!companyprofileView)}className="modal-xl"  >
          <ModalHeader className="modal-lg"toggle={() => setCompanyProfileView(!companyprofileView)} >
            View  Company Profile
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">            
            <CompanyProfileViews ReservationData ={ReservationData}/>            
          </ModalBody>
        </Modal>}
      </div>






<Row className='match-height'>
{console.log(ReservationData)}
<Col md='12' sm='12'>
      <Card>
      {/* <CardHeader style={{ height:'50px',background: '#8c82f2', textAlign: 'center' }}> */}
              {/* <CardTitle>
                <h3 style={{ color: 'white', textAlign: 'center' }}>Guest Details</h3>
              </CardTitle> */}
            {/* </CardHeader> */}
            <Row>
              <Col md='6' sm='6'>
            <h4 style={{marginLeft:'10px' ,marginTop:'10px' ,color:'#7367f0'}}>Guest Details</h4>
            </Col>
            <Col md='6' sm='6'>
              <h5 style={{marginLeft:'10px' ,marginTop:'10px'}}>{ReservationData['reservationStatus']}</h5>
            {/* <div className='inline-spacing' align="right" style={{ margin: '5px 0' }}>
            <Button color='primary' style={{'margin-right' : '10px'}} className='sharer'  onClick={() => {
              if(sessionStorage.getItem('departureDate')==moment(String(new Date(Today))).format('YYYY-MM-DD')){
                ConfirmCheckoutGuest()        
              }else if(sessionStorage.getItem('departureDate')!=moment(String(new Date(Today))).format('YYYY-MM-DD')){
                seterrorMsg('Departue date is not today')
                setshowErrorMsg(true)
              }
}} >Check Out</Button>
</div> */}
</Col>
</Row>
        <CardBody>
         {ReservationData.length!=0 && 
         <>
         {ReloadData && <Row>
            <Col sm='6'>
              <h5><b>{ReservationData['salutation']+' '}{ReservationData['firstName']+' '}{ReservationData['lastName']}</b><Edit2  style={{ marginLeft:'30px',height: "20px" ,color:'#7367f0'}} onClick={()=>setProfileView(!profileView)}/></h5>
              {/* <h5>{ReservationData['addressOne']}</h5> */}
              <h5>Arrival : <b>{ReservationData['arrivalDate']}</b></h5>
              <h5>Departure : <b>{ReservationData['departureDate']}</b></h5>
            </Col>
            <Col sm='6'>
              <h5>Confirmation :<b>{ReservationData['bookingID']}</b></h5>
              <h5>Room No :<b>{sessionStorage.getItem('RoomNo')}</b></h5>
              <h5>Balance(INR) : <b>{ReservationData['balance']}</b></h5>
            </Col>
           
        </Row>}
        <div style={{'border-bottom': '1px solid #E8E8E8','margin-bottom': '10px'}} ></div>
        <Row>
            <Col sm='6'>
            <h5 style={{ position: 'relative',
  display: 'inline-block'}}>Address : <span
  style={{cursor: 'pointer' , color:'#7367f0',textDecoration: 'underline'}}
  onMouseEnter={handleMouseEnterAddress}
  onMouseLeave={handleMouseLeaveAddress}
  
>
  
{ReservationData['addressOne']!=null && ReservationData['addressOne'].substring(0, 20)}...</span> </h5>
{AddressHovered && <div style={{
  position: 'absolute',
  top: '180px',
  // height:'20px',
  width:'600px',
  // left: '8',
  backgroundColor: '#e6e6fa',
  border: '1px solid #ccc',
  padding: '5px',
  // display: 'inline-block',
  zIndex:1,
  
  
}}><b>Address1 : {ReservationData['addressOne']}<br></br>
      Address2 : {ReservationData['addressTwo']}<br></br>
      City     : {ReservationData['city']}<br></br>
      State    : {ReservationData['state']}<br></br>
      Country  : {ReservationData['guestCountryName']}<br></br>
      PostalCode : {ReservationData['postalCode']}<br></br>
      GSTIN : {ReservationData['gstID']}
      
      
      </b></div>}
            </Col>
           
            <Col sm='6'>
              
              <h5 style={{ position: 'relative',
  display: 'inline-block'}}>Company : <span
  style={{cursor: 'pointer' , color:'#7367f0',textDecoration: 'underline'}}
  onMouseEnter={handleMouseEnterCompany}
  onMouseLeave={handleMouseLeaveCompany}
  
>{(ReservationData['accountName']!=null && ReservationData['accountName']!="") && ReservationData['accountName'].substring(0, 15)}...
</span>
{/* <Edit2 style={{ marginLeft:'30px', height: "20px",color:'#7367f0' }} onClick={()=>setCompanyProfileView(!companyprofileView)}/> */}
</h5>

{CompanyHovered && <div style={{
  position: 'absolute',
  top: '180px',
  // height:'20px',
  width:'600px',
  // left: '8',
  backgroundColor: '#e6e6fa',
  border: '1px solid #ccc',
  padding: '5px',
  // display: 'inline-block',
  zIndex:1,
  
  
}}><b>Company  : {ReservationData['accountName']}<br></br>
      Address1 : {ReservationData['addressLine1']}<br></br>
      Address2 : {ReservationData['addressLine2']}<br></br>
      City     : {ReservationData['CompanyCity']}<br></br>
      State    : {ReservationData['CompanyState']}<br></br>
      Country  : {ReservationData['CompanyCountryName']}<br></br>
      PostalCode : {ReservationData['CompanyPostalCode']}<br></br>
      GSTIN : {ReservationData['companyGST']}

      
      
      </b></div>}
            </Col>
        </Row>

        <div style={{'border-bottom': '1px solid #E8E8E8','margin-bottom': '10px'}} ></div>
        <Row>
            <Col sm='6'>
              <h5 style={{ position: 'relative',
  display: 'inline-block'}}>Billing Instructions :<span
  style={{cursor: 'pointer' , color:'#7367f0',textDecoration: 'underline'}}
  onMouseEnter={handleMouseEnterBillingInst}
  onMouseLeave={handleMouseLeaveBillingInst}
  
> {ReservationData['billingInstruction'].length>0 && (ReservationData['billingInstruction']).substring(0, 10)+'...'}   </span></h5>
{ReservationData['billingInstruction'].length>0 && BillingInstHovered && <div style={{
  position: 'absolute',
  top: '210px',
  // height:'20px',
  width:'600px',
  // left: '8',
  backgroundColor: '#e6e6fa',
  border: '1px solid #ccc',
  padding: '5px',
  // display: 'inline-block',
  zIndex:1,
  
  
}}><b>{ReservationData['billingInstruction']}</b></div>}
            </Col>



            <Col sm='6'>
              <h5 style={{ position: 'relative',
  display: 'inline-block'}} >Comments :      <span
        style={{cursor: 'pointer' , color:'#7367f0',textDecoration: 'underline'}}
        onMouseEnter={handleMouseEnterComments}
        onMouseLeave={handleMouseLeaveComments}
        
      > {ReservationData['comments'].length>0 && (ReservationData['comments']).substring(0, 25)+'...'}  </span></h5>
      {ReservationData['comments'].length>0 && CommentsHovered && <div style={{
  position: 'absolute',
  top: '210px',
  // height:'20px',
  width:'600px',
  // left: '18',
  backgroundColor: '#e6e6fa',
  border: '1px solid #ccc',
  padding: '5px',
  // display: 'inline-block',
  zIndex:1,
  
  
}}><b>{ReservationData['comments']}</b></div>}
            </Col>
            
        </Row>

        {/* <div className='inline-spacing' align="right" style={{ margin: '2px 0' }}> */}

        <Row>
              <Col md='12' sm='12'>
              {ReservationData['noPost']==1 && <p  style={{color:'#FF0000'}}>Alert : No post is enabled </p>}
            </Col>
            {/* <Col md='6' sm='6'>
            <div className='inline-spacing' align="right" style={{ margin: '5px 0' }}>
            <Button color='primary' style={{'margin-right' : '10px'}} className='sharer' disabled={EnableButton} onClick={() => {
             if(ReservationData['departureDate']!=moment(String(new Date(Today))).format('YYYY-MM-DD')){
                seterrorMsg('Departue date is not today')
                setshowErrorMsg(true)
              }else if(FoliosToSettle.length>0){
                seterrorMsg('All Folios are not settled')
                setshowErrorMsg(true)
              }else  if(ReservationData['departureDate']==moment(String(new Date(Today))).format('YYYY-MM-DD')){
                ConfirmCheckoutGuest()        
              }
}} >Check Out</Button>
</div>
</Col> */}
</Row>
        
        
         </>}
         </CardBody>
      </Card>
     </Col>
     {/* <Col md='5' sm='5' >
<Card>

            <h4 style={{marginLeft:'10px' ,marginTop:'10px'}}>Linked Guests</h4>

        <CardBody>
        <table >
                <thead >
                    <tr>
                      <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Name</b></td>
                      <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Link</b></td>
                      <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Bal</b></td>
                      <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Type</b></td>

                    </tr>
                </thead>
                <tbody>
                    {AllGuests.length!=0 && AllGuests.map((row, index) => (
                        <tr style={row.id==sessionStorage.getItem('reservationID') ? {backgroundColor: '#e6e6fa'} : {}} key={index}>
                            <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"itemName" + index}>{row.guestName}</td>
                            <td style={{color: 'blue', textDecoration: 'underline',margin: '6px 0', paddingLeft: '10px'}} id={"link"+index}><a onClick={()=>{
                              localStorage.setItem('reservationID',row.id)
                              localStorage.setItem('FolioTabNo',0)
                              }} 
                            target="_blank" href='/dashboard/OnHoldFolioBilling'>Go To billing</a></td>
                            <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"itemName" + index}>{row.balance}</td>
                            <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"itemName" + index}>{row.isMain==1? 'Main Guest' : 'Sharer'}</td>
                            
                    </tr>
                    ))}
                    </tbody>
                    </table>
          
        </CardBody>
      </Card>
</Col> */}
      </Row>
            {showDropdown && 
            (
              <div>
                  <Modal isOpen={TransactionCodeSelect} toggle={() => setTransactionCodeSelect(!TransactionCodeSelect)} className='modal-dialog-centered modal-lg' onClosed={onDiscard}>
                      <ModalHeader toggle={() => setTransactionCodeSelect(!TransactionCodeSelect)}>Search and Select Code</ModalHeader>
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
                                    rowData={TrxnRowData}
                                    columnDefs={TrxncolumnDefs}
                                    animateRows={true}
                                    onCellClicked={cellClickedListener}
                                    paginationPageSize='10'
                                    pagination='true'
                                    defaultColDef={defaultColDef}
                                    headerColor="ddw-primary"
                                  />
                              </div>
                          </ModalBody>
                  </Modal>
              </div>
            )
            }
            
            <Modal isOpen={PostCharges} toggle={() => setPostCharges(!PostCharges)} className='modal-dialog-centered modal-lg' onClosed={onDiscard2}>
                      <ModalHeader toggle={() => setPostCharges(!PostCharges)}>Post Charges to Room No. {sessionStorage.getItem('RoomNo')}</ModalHeader>
                          <ModalBody>
                              <div>
                              <Fragment>
        <Nav tabs className='tab'>
     {/* {getButtonsUsingForLoop(FolioCount)} */}
     
     </Nav>
     </Fragment>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                              <Row>  
                              <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Folio">
            Select Folio
            </Label>
            <Controller
              id="Folio"
              control={control}
              // defaultValue={FolioOptions[0]}
              name="Folio"
              render={({ field }) => (
                <Select
                // required
                  isClearable
                  options={FolioOptions}
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
          </Col> 
                              <Col md='4' sm='12' className='mb-1'>
       
                <Label className="form-label">
                Code
                <Input type="text" name='TransactionCode' value={TransactionCode} onClick={() => setTransactionCodeSelect(true)}/>
                </Label>
                </Col>
                <Col md='4' sm='12' className='mb-1'>
                <Label className="form-label">
                Description
                <Input type="text" name='Description' value={Description}/>
                </Label>
                </Col>

            <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Price">
            Price
            </Label>
            <InputGroup className="input-group-merge">
              {/* <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && data.IsActive === null,
                })}
              ></InputGroupText> */}
              <Controller
                name="Price"
                control={control}
                render={({ field }) => (
                  <Cleave
                    {...field}
                    value={defaultPrice}
                    onChange={checkisCode}
                    pattern="[0-9.0-9]*" title="Only Numbers Allowed" required
                    id="Price"
                    // placeholder="Enter Price"
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.Price === null,
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          {/* <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="quantity">
              Quantity
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
              
                
                name="quantity"
                control={control}
                render={({ field }) => (
                  <Cleave
                    {...field}
                    value={1}
                    onChange={checkisCode}
                    id="quantity"
                    pattern="[0-9]*" title="Only Numbers Allowed" required
                    // placeholder="Enter Store ID"
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.quantity === null,
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col> */}
          <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Supplements">
            Supplements
            </Label>
            <InputGroup className="input-group-merge">
              {/* <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && (data.Items === null || !data.Items.length)
                })}
              ></InputGroupText> */}
              <Controller
                id="Supplements"
                name="Supplements"
                control={control}
                
                render={({ field }) => (
                  <Input
                  // pattern="[aA-zZ]*" title="Only Alphabets Allowed" 
                  // required
                  // placeholder="Enter Items"
                    {...field}
                    className={classnames("form-control", {
                      // "is-invalid":
                      //   data !== null && (data.Supplements === null || !data.Supplements.length)
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
              {/* <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && (data.Items === null || !data.Items.length)
                })}
              ></InputGroupText> */}
              <Controller
                id="reference"
                name="reference"
                control={control}
                
                render={({ field }) => (
                  <Input
                  // pattern="[aA-zZ]*" title="Only Alphabets Allowed" 
                  // required
                  // placeholder="Enter Items"
                    {...field}
                    className={classnames("form-control", {
                      // "is-invalid":
                      //   data !== null && (data.reference === null || !data.reference.length)
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
            <Button className="me-1" color="primary" type="submit" onClick={()=>{setPostCharges(!PostCharges)}} >
              Cancel
            </Button>
            </div>
            </Row>
          </Form>
                              </div>
                              {/* <div className="ag-theme-alpine" style={{ height: 520 }}>
                                  <AgGridReact
                    overlayNoRowsTemplate={'No record found'}
                                    ref={gridRef1}
                                    rowData={rowData}
                                    columnDefs={columnDefs}
                                    animateRows={true}
                                    onCellClicked={cellClickedListener}
                                    paginationPageSize='10'
                                    pagination='true'
                                    defaultColDef={defaultColDef}
                                    headerColor="ddw-primary"
                                  />
                              </div> */}
                          </ModalBody>
            </Modal>  




<Modal isOpen={PostTrxnPayment} toggle={() => setPostTrxnPayment(!PostTrxnPayment)} className='modal-dialog-centered modal-lg' onClosed={onDiscard2}>
                      <ModalHeader toggle={() => setPostTrxnPayment(!PostTrxnPayment)}>Post Payments to Room No. {sessionStorage.getItem('RoomNo')}</ModalHeader>
                          <ModalBody>
                          
                              <Fragment>
                                  <Nav tabs className='tab'>
                                     {/* {getButtonsUsingForLoop(FolioCount)} */}
                              
                                  </Nav>
                              </Fragment>
                      <Form onSubmit={handleSubmit(ConfirmPostTrxnPayment)}>
                              <Row>  
                              {/* <Col md='4' sm='12' className='mb-1'>
       
                <Label className="form-label">
                Code
                <Input type="text" name='TransactionCode' value={TransactionCode} onClick={() => setTransactionCodeSelect(true)}/>
                </Label>
                </Col>
                <Col md='4' sm='12' className='mb-1'>
                <Label className="form-label">
                Description
                <Input type="text" name='Description' value={Description}/>
                </Label>
                </Col> */}
                <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Folio">
            Select Folio
            </Label>
            <Controller
              id="Folio"
              control={control}
              name="Folio"
              render={({ field }) => (
                <Select
                // required
                  isClearable
                  options={FolioOptions}
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
          {/* <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="quantity">
              Quantity
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
              
                
                name="quantity"
                control={control}
                render={({ field }) => (
                  <Cleave
                    {...field}
                    value={1}
                    onChange={checkisCode}
                    id="quantity"
                    pattern="[0-9]*" title="Only Numbers Allowed" required
                    // placeholder="Enter Store ID"
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.quantity === null,
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col> */}
          <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Supplements">
            Supplements
            </Label>
            <InputGroup className="input-group-merge">
              {/* <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && (data.Items === null || !data.Items.length)
                })}
              ></InputGroupText> */}
              <Controller
                id="Supplements"
                name="Supplements"
                control={control}
                
                render={({ field }) => (
                  <Input
                  // pattern="[aA-zZ]*" title="Only Alphabets Allowed" 
                  // required
                  // placeholder="Enter Items"
                    {...field}
                    className={classnames("form-control", {
                      // "is-invalid":
                      //   data !== null && (data.Supplements === null || !data.Supplements.length)
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
              {/* <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && (data.Items === null || !data.Items.length)
                })}
              ></InputGroupText> */}
              <Controller
                id="reference"
                name="reference"
                control={control}
                
                render={({ field }) => (
                  <Input
                  // pattern="[aA-zZ]*" title="Only Alphabets Allowed" 
                  // required
                  // placeholder="Enter Items"
                    {...field}
                    className={classnames("form-control", {
                      // "is-invalid":
                      //   data !== null && (data.reference === null || !data.reference.length)
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
            <Button className="me-1" color="primary" type="submit" onClick={()=>{setPostTrxnPayment(!PostTrxnPayment)}} >
              Cancel
            </Button>
            </div>
            </Row>
          </Form>
                          </ModalBody>
            </Modal>  

 
                  <Modal
        isOpen={show}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Preview Transaction</h1>
          {show &&  <>
            {data.Folio!=undefined && <h6>Folio No: <b>{data.Folio.value}</b></h6>}
            <h6>Guest Name : <b>{ReservationData['firstName']}</b></h6> 
            <h6> Ph No. :<b>{ReservationData['phoneNumber']}</b></h6>
            <h6>Room No. : <b>{sessionStorage.getItem('RoomNo')}</b></h6>
            {/* <h6>Transaction Code : <b>{TransactionCode}</b></h6> */}
            <h6>Description : <b>{Description}</b></h6>
            <h6>Unit Price :<b>{defaultPrice}</b></h6>
            <h6>Supplements : <b>{data.Supplements}</b></h6>
            <h6>Reference : <b>{data.reference}</b></h6>
            <h6>CGST: <b>{Amount['cgstAmt']}</b></h6>
            <h6>SGST: <b>{Amount['sgstAmt']}</b></h6>
            <h6>Total: <b>{Amount['totalAmount']}</b></h6>
            

          </>}
            <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' disabled={EnableButton} onClick={AddCharges}>
                Post charges
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                // window.location.reload()
                setShow(!show)
                setPostCharges(!PostCharges)
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>


      <Modal
        isOpen={ShowReinstateCheckout}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Reinstate Checkout</h1>
          <Form onSubmit={handleSubmit(ConfirmReinstateCheckout)}>
          <Row>
          <Col md='6' sm='12' className='mb-1'>
       
                <Label className="form-label">
                Reason Code
                <Input required type="text" name='TransactionCode' value={ReasonCode}  onClick={fetchReasonCodeData}/>
                </Label>
                </Col>
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
                    // value={1}
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
          </Col>
          </Row>

          
          <h3>Select Folio's to Open</h3>
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
                    {FolioOptions.length!=0 && FolioOptions.map((row, index) => (
                        <tr key={index}>
                            <td style={{ margin: '6px 0', paddingLeft: '10px' }} >
                                <div className='form-check'>
                                    <Input
                                        id={index}
                                        type='checkbox'
                                        onChange={() => handleSelect(index)}
                                        checked={!!selectedRows.includes(row.value)}
                                    />
                                </div>
                            </td>
                            <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"itemID" + index}>Folio-{row.value}</td>
                            {/* <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"itemName" + index}>{row.itemName}</td>
                            <td style={{ margin: '6px 0', paddingLeft: '10px' }}  ><InputNumber disabled="true" id={"qty" + index} value={tableData[index]['qty']}  defaultValue={tableData[index]['qty']} upHandler={<Plus onClick={() => { handlePlusClick1(index) }} />} downHandler={<Minus onClick={() => { handleMinusClick1(index) }} />} /></td>
                            <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"price" + index}>{row.amount}</td> */}

                        </tr>

                    ))}
                        <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"All"}>
                                <Input
                                    type='checkbox'
                                    id='select-all'
                                    label=''
                                    checked={selectedRows.length==FolioOptions.length && !!selectedRows.length}
                                    onChange={() => handleSelectAll()}
                                    
                                />All</td>

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
                setShowReinstateCheckout(!ShowReinstateCheckout)
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
          </Form>
        </ModalBody>
      </Modal>

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
              <Button type='submit' className='me-1' color='primary' tag={Link} to='/dashboard/frontdesk/PaymentReceipt' target='_blank' onClick={() => {
                // window.location.reload()

                ReloadContent()
                setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},10)
                setshowPaymentReceipt(!showPaymentReceipt)
              
              }}>
               Confirm
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                // window.location.reload()

                ReloadContent()
                setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},10)
                setshowPaymentReceipt(!showPaymentReceipt)
              
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>
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
          
            {/* <h6>Room No : {TrnxSelected.description}</h6>
            <h6>Booking ID : {TrnxSelected.total}</h6>
            <h6>Guest Name : {TrnxSelected.date}</h6> */}

            {/* {data.Folio!=undefined && <h6>Folio No: <b>{data.Folio.value}</b></h6>} */}

            <Row>
            <Col className='text-center mt-1' xs={12}>
              {/* <Button type='submit' className='me-1' color='primary' onClick={TransferTransaction}>
               OK
              </Button> */}
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

      {/* COnfirm Checkout modal */}
      <Modal
        isOpen={ConfirmCheckOut}
        toggle={() => setConfirmCheckOut(!ConfirmCheckOut)}
        className='modal-dialog-centered'
      >
        <ModalHeader toggle={() => setConfirmCheckOut(!ConfirmCheckOut)} className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h4 className='text-center mb-1'>Do you want to checkOut <b>{ReservationData['salutation']+' '}{ReservationData['firstName']+' '}{ReservationData['lastName']}</b> {!UnsettledTrxn && CheckOutSharer && <h4> and sharer also </h4>}</h4>
          
          <p className='text-center mb-1' style={{color:'#FF0000'}}>Alert : Empty folios will be closed</p>
          {UnsettledTrxn && <p className='text-center mb-1' ><b>Sharer has unsettled transactions. CheckOut Individually</b></p> }

            {ReservationData['isMain']==1 && Sharers.length!=0 &&

            
             <table >
              
             <thead >
                 <tr>
                 
                   {/* <td style={{  margin: '0px 0', paddingLeft: '2px' }}><b>SharerID</b></td> */}
                   <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Name</b></td>
                   <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Link</b></td>
                   <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Bal</b></td>

                 </tr>
             </thead>
             <tbody>
                 {Sharers.length!=0 && Sharers.map((row, index) => (
                     <tr key={index}>
                         <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"itemName" + index}>{row.guestName}</td>
                         <td style={{color: 'blue', textDecoration: 'underline',margin: '6px 0', paddingLeft: '10px'}} id={"link"+index}><a onClick={()=>{
                           localStorage.setItem('reservationID',row.id)
                           }} 
                         target="_blank" href='/dashboard/OnHoldFolioBilling'>Go To billing</a></td>
                         <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"itemName" + index}>{row.balance}</td>
                         
                 </tr>
                 ))}
                 </tbody>
                 <br></br>
                 {!UnsettledTrxn && SharerExists && <tr>
                           <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"Default"}>
                                <Input
                                    type='checkbox'
                                    id='select-all'
                                    label=''
                                    checked={CheckOutSharer}
                                    onChange={() => {
                                      console.log('before',CheckOutSharer)
                                      setCheckOutSharer(!CheckOutSharer)
                                    console.log('after',CheckOutSharer)}}
                                    
                                /><b>CheckOut All Sharers</b></td></tr>}
                 </table>}
            
          
            <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' onClick={CheckOut}>
                Confirm
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                  setConfirmCheckOut(!ConfirmCheckOut)        
                   }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>

      {/* <Card> */}
        {ReloadData && <FolioTab/>}
      {/* </Card> */}
      { 
      // <Card>
      //   <CardBody>
      //   <h4>All guests</h4>
      //   <table >
      //           <thead >
      //               <tr>
      //                 <td style={{  margin: '0px 0', paddingLeft: '2px' }}><b>SharerID</b></td>
      //                 <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Name</b></td>
      //                 <td style={{ margin: '6px 0', paddingLeft: '10px' }}><b>Link</b></td>

      //               </tr>
      //           </thead>
      //           <tbody>
      //               {AllGuests.length!=0 && AllGuests.map((row, index) => (
      //                   <tr key={index}>
      //                       {/* <td style={{  margin: '6px 0', paddingLeft: '10px' }} >
      //                           <div className='form-check'>
      //                               <Input
      //                                   id={index}
      //                                   type='checkbox'
      //                                   onChange={() => handleSelect(index)}
      //                                   checked={!!selectedRows.includes(row.folioNumber)}
      //                               />
      //                           </div>
      //                       </td> */}
      //                       <td style={{  margin: '0px 0', paddingLeft: '2px' }}  id={"itemID" + index}>{row.id}</td>
      //                       <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"itemName" + index}>{row.guestName}</td>
      //                       <td style={{color: 'blue', textDecoration: 'underline',margin: '6px 0', paddingLeft: '10px'}} id={"link"+index}><a onClick={()=>{
      //                         localStorage.setItem('reservationID',row.id)
      //                         // sessionStorage.setItem('RoomNo',row.SharerDetails.roomNumber)
      //                         // sessionStorage.setItem('departureDate',row.SharerDetails.departureDate)
                              
      //                         // handleLinkClick(row.SharerDetails.id,row.SharerDetails.roomID,row.SharerDetails.roomNumber,row.SharerDetails.departureDate)
      //                       }} 
      //                       target="_blank" href='/dashboard/OnHoldFolioBilling'>Go To billing</a></td>
      //                       <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"itemName" + index}>{row.isMain==1? 'Main Guest' : 'Sharer'}</td>
                            
      //               </tr>
      //               ))}
      //               </tbody>
      //               </table>
          
      //     {/* <a onClick={()=>{handleLinkClick()}} >Go To billing</a> */}
      //      {/* setTimeout(()=>{
      //             const newTab = window.open('about:blank', '_blank');
      //              newTab.location.href = '/dashboard/OnHoldFolioBilling'
      //             },1000) */}
      //   </CardBody>
      // </Card>
      }

<Modal
        isOpen={ShowSharer}
        toggle={() => setShowSharer(!ShowSharer)}
        className='modal-dialog-centered modal-xl'
      >
        <ModalHeader toggle={() => setShowSharer(!ShowSharer)} className='bg-transparent'>Sharer</ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
       
        <iframe style={{ width: '100%',  height: '85vh' , border: 'none' }} src={"/dashboard/OnHoldFolioBilling"} title="Modal Content" className="modal-iframe" />
         {/* <DepositPosting/> */}
        
        </ModalBody>
      </Modal>
    </div>
  )
}

export default Companydetails;