// // ** Custom Components
import React, { useRef,useEffect, useState , useCallback, useMemo} from 'react'
import { Link } from 'react-router-dom'
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
  import API_URL from "../../../../config";

import { Fragment } from 'react'
import TransactionTable from './OnHoldTransactionTable'

import moment from 'moment';
import { red } from '@mui/material/colors';
let is_test = false
let rowData1 =[]
let folioBalance=''
// let PaymentOptions=[]
let FinalPaymentOptions=[]
let SelectedBalance =''

      let folioNo = ''
sessionStorage.setItem('FolioTabNo',localStorage.getItem('FolioTabNo'))
let FolioOptions =[]
// let FolioAllowanceType=[]
let balance =''
// let splitFolioGroup=[]
let defaultopt =[{
  // value: sessionStorage.getItem('FolioTabNo')s,
  // label: "Folio-"+sessionStorage.getItem('FolioTabNo')s+"(Balance:"+folioBalance+")",
}]

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

const FolioTab = () => {
  // rowData1 =[]
  const navigate = useNavigate()
  let defaultReason = {}
  
  const gridRef = useRef();
  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'accountName', field: 'accountName',maxWidth:450},
    { headerName: 'accountType', field: 'accountType'},
    { headerName: 'Phone', field: 'phone'},
    { headerName: 'Country', field: 'CountryName' },
    {
      headerName: "Actions", cellRendererFramework: (params) => (
        <Button color="primary" onClick={() => setCompanyModal(false)} >
          Select
        </Button>
      ),
     
    },
  ]);

  const [FoliosToSettlecolumnDefs,setFoliosToSettlecolumnDefs] = useState([
    { headerName: 'folio No', field: 'folioNumber',maxWidth:450},
    { headerName: 'Balance', field: 'Balance'},
    { headerName: 'reservationID', field: 'reservationID'},
    {
      headerName: "Settle", cellRendererFramework: (params) => (
        <Button color="primary" onClick={() => {

          CheckBalAndSettle(params.data.folioNumber,params.data.Balance)
          // setActive(params.data.folioNumber)
          
        }
        } >
          Settle
        </Button>
      ),
     
    },
  ])

  const [active, setActive] = useState(parseInt(sessionStorage.getItem('FolioTabNo')))
  const [reload, setreload] = useState(true)
  const [roomData, setRoomData] = useState('')
  const [PostPayments,setPostPayments] = useState(false)
  const { reset, handleSubmit, control } = useForm({ defaultValues1 })
  const [data, setData] = useState(null)
  const [defaultAmount,setdefaultAmount] = useState('')
  const [show, setShow] = useState(false)
  const [ConfirmCheckOut,setConfirmCheckOut] = useState(false)
  const [PostFolioAllowance, setPostFolioAllowance] = useState(false);
  const [selectedOption,setselectedOption] = useState('')
  const [Placeholder,setPlaceholder] = useState('')
  const [AllowanceAmount,setAllowanceAmount] = useState('')
  const [TrnxSelected,setTrnxSelected] = useState('')
  const [selectedValue, setSelectedOption] = useState('');
  const [BalanceAmt, selectedBalanceAmt] = useState('');
  const [folioAllowance,setfolioAllowance] = useState('')
  const [TransactionIDs,setTransactionIDs] = useState([])
  const [SpiltTransactionIDs,setSpiltTransactionIDs] = useState([])

  const [ConfirmAllowance,setConfirmAllowance] = useState(false)
  const [showMergeFolio,setshowMergeFolio] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [showSplitFolio,setshowSplitFolio] = useState(false)

  const [errorMsg,seterrorMsg] = useState('')
  const [showErrorMsg,setshowErrorMsg] = useState(false)
  const [ReasonSelect, setReasonSelect] = useState(false)
  const [ReasonCode,setReasonCode] =  useState()
  const [reasonCodeData,setreasonCodeData] = useState('')
  const [ReasonID,setReasonID] = useState('')
  const [ReasonRemarks,setReasonRemarks] = useState('')
  const [ReloadReasonRemarks,setReloadReasonRemarks] = useState(true)
  const [AllFolioSettled,setAllFolioSettled] = useState(false)
  const [FolioHasTrxn,setFolioHasTrxn] = useState(false)
  const [showBTCfield,setshowBTCfield] = useState(false)
  const [BTCAccount,setBTCAccount] = useState([])
  const [SelectedLabel,setSelectedLabel] = useState('')
  const [SelectedValue,setSelectedValue] = useState('')
  const [Bal,setBal] = useState('')
  const [BTCAccountOptions ,setBTCAccountOptions] = useState()
  const [rowData, setRowData] = useState();
  const [CompanyLabel, setCompanyLabel] = useState('');
  const [CompanyValue, setCompanyValue] = useState(null);
  const [CompanyModal, setCompanyModal] = useState(false);
  const [FolioAllowanceType,setFolioAllowanceType] = useState([])
  //////////////////////////// Billing /////////////////////////////
  const [PostCharges, setPostCharges] = useState(false)
  const [PostTrxnPayment,setPostTrxnPayment] = useState(false)
  const [TransactionCode, setTransactionCode] = useState('')
  const [Description,setDescription] = useState('')
  const [TransactionCodeSelect, setTransactionCodeSelect] = useState(false)
  const [defaultPrice,setdefaultPrice]= useState('')
  const [ShowPaymentPreview,setShowPaymentPreview] = useState(false)
  const [ReservationData, setReservationData] = useState('')
  const [PostChargesConfirm,setPostChargesConfirm] = useState(false)
  const [TrxnRowData, setTrxnRowData] = useState()
  const [showDropdown, setShowDropdown] = useState(true)
  const [Amount,setAmount] = useState('')
  const [SelectedFolio,setSelectedFolio] = useState('0')
  const [ReloadData,setReloadData] = useState(true)
  const [showPaymentReceipt,setshowPaymentReceipt] = useState(false)
  const [showPaidOutReceipt,setshowPaidOutReceipt] = useState(false)

  const [defaultFolioOption,setdefaultFolioOption] = useState({})
  const [ShowDummyInvPDF,setShowDummyInvPDF] = useState(false)
  const [ConfirmAdvanceSettle,setConfirmAdvanceSettle] = useState(false)
  const [DummyInvURL,setDummyInvURL] = useState([])
  const [FolioTrxnCount,setFolioTrxnCount] = useState([])

  const [ShowInvPDF,setShowInvPDF] = useState(false)
  const [InvURL,setInvURL] = useState([])
  const [PaymentOptions,setPaymentOptions]= useState([])
  const [Sharers , setSharers] = useState([])
  const [UnsettledTrxn,setUnsettledTrxn] = useState(false)
  const [SharerExists,setSharerExists] = useState(false)
  const [CheckOutSharer,setCheckOutSharer] = useState(false)

  const [ConfirmPaidout,setConfirmPaidout] = useState(false)
  const [PostPaidouts,setPostPaidouts] = useState(false)
  const [ShowSettleFolioCard,setShowSettleFolioCard] = useState(false)
  const [FoliosToSettle,setFoliosToSettle] = useState([])
  const [GrpID,setGrpID] = useState([])
  const [EnableButton,setEnableButton] = useState(false)
  const [SettlementType,setSettlementType] = useState('Tonight')
  const [AdvanceSettleFlag,setAdvanceSettleFlag] = useState(0)
  const [Today,setToday] = useState()
  const [PaymentReceiptURL,setPaymentReceiptURL]=useState()
  const [PaidoutReceiptURL,setPaidoutReceiptURL]=useState()
  const [CnfViewInvoice,setCnfViewInvoice] = useState(false)
  const [InvData,setInvData] = useState([])
const gridRef1 = useRef()
  // console.log('Active tab',active)
  const toggle = (tab,balancedata) => {
    // console.log('Selected tab=-----------------',tab)
    localStorage.setItem('FolioNo',tab)
    sessionStorage.setItem('FolioTabNo',tab)
    // console.log('Active tab',parseInt(tab))
    balance= balancedata
    // handleReset()

    
    if (active !== tab ) {
      setActive(tab)  
      // console.log(tab)
      {tab==0 && setreload(false)
        setTimeout(()=>{setreload(true)},100)}
      {tab!=0 && fetchx(API_URL + "/getFolioBalance", {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                hotelID: 1,
                reservationID: sessionStorage.getItem('reservationID'),
                folioNo:tab
                  })
            }).then(result => result.json())
            .then(rowData => {
              // console.log(rowData)
                // console.log(rowData['data']['Balance'])
                // setRowData(rowData['data'])
                if(rowData['data']!=undefined){
                  folioBalance  = rowData['data']['Balance']
                  setBal(folioBalance)
                  // console.log(folioBalance)
                  defaultopt = [{
                    value: tab,
                    label: "Folio-"+tab+"(Balance:"+folioBalance+")",
                  }]
                  // console.log(defaultopt)
                  // setdefaultFolioOption({
                  //   value: tab,
                  //   label: "Folio-"+tab+"(Balance:"+folioBalance+")",
                  // });
                  setreload(false)
                  setTimeout(()=>{setreload(true)},100)
                  // // console.log(defaultFolioOption)

                }
    
              }).catch((error) => {
                // console.log(error)
              })
            }
    //         {tab!=0 && 
    // }
  }
  }
      //reset function
  const PostChargesReset = () => {
    setPostCharges(false)
    setTransactionCode('')
    setDescription('')
    setdefaultPrice('')
    reset({
      Price: '',
      Supplements:'',
      reference:'',
      TransactionCode:'',
      Description:''

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

  const CheckBalAndSettle =(tab,bal)=>{
    // console.log('active folio',tab)
    setActive(tab)
    // // console.log('active folio',active)
    toggle(tab,bal)
    folioBalance=bal
    {tab!=0 && fetchx(API_URL + "/getFolioBalance", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
        reservationID: sessionStorage.getItem('reservationID'),
        folioNo:tab
          })
    }).then(result => result.json())
    .then(rowData => {
      // console.log(rowData)
        // console.log(rowData['data']['Balance'])
        // setRowData(rowData['data'])
        if(rowData['data']!=undefined){
          folioBalance  = rowData['data']['Balance']
          setBal(folioBalance)
  
          if(folioBalance<10){
              // console.log(folioBalance)
              // setPostPayments(!PostPayments)
              // console.log('in if')
              SettleFolio(0,tab)
            }else{
              // console.log(folioBalance)
              // console.log('In else')
              setPostPayments(!PostPayments)
            }
          // // console.log(defaultFolioOption)
  
        }
  
      }).catch((error) => {
        // console.log(error)
      })
    }
  }
  function getButtonsUsingForLoop(folioarr) {

    const array = []
    for(var i = 0; i < folioarr.length; i++){
    //    <>
    //         <h3>Hello</h3>
    
        let foliocount = folioarr[i]['value']
        let foliobalance = folioarr[i]['label']
        const inputString = String(foliobalance);
        const splitArray = inputString.split(':');
        const balanceString = splitArray[1].replace(')', '');
        // if(balanceString!='0'){
        array.push(
                <NavItem>
            <NavLink 
              active={parseInt(active) === foliocount}
              onClick={() => {
                toggle(foliocount,foliobalance)
              }}
            >
              <div><b>Folio-{foliocount} </b><br></br>
              <b style={{textAlign:'right',marginRight:'20px' , color:'#228B22'}}>{'('}Bal: {balanceString}{')'}</b></div>
            </NavLink>
            </NavItem>)
     
        //   </>
        // }
      }


    return array
  }
  const [TrxncolumnDefs] = useState([
    { headerName: 'transactionCode', field: 'transactionCode'},
    // { headerName: 'Address', field: "description", valueGetter(params) {
    //     return params.data.addressLine1 + ' ' + params.data.addressLine2;
    //   },suppressSizeToFit: true, maxWidth: 600 },
    { headerName: 'description', field: 'description'},
    // { headerName: 'Mobile Number', field: 'phoneNumber', maxWidth:300 },
    // { headerName: 'Email ID', field: 'email', maxWidth:300 },
    // { headerName: 'Country', field: 'country', maxWidth:300 },
    {
      headerName: "Action",
      
      cellRenderer: () => {
        return (<Button color='primary' onClick={()=>{setTransactionCodeSelect(false)}}>Select</Button>)
      }
    },
    // {
    //   cellRenderer: () => {
    //     return (<Button color='primary' onClick={() => setAssign(!assign)} >View Profile</Button>)
    //   }
    // }
  ])
  const [reasonCodecolumnDefs] = useState([
    { headerName: 'reasonCode', field: 'reasonCode', maxWidth:300 },
  
    { headerName: 'description', field: 'description' },
  
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

  const gridOptions = {
    defaultColDef: {
      flex: 1,
      // minWidth: 150,
      filter: true,
      sortable: true,
      // floatingFilter: true,
           

    },
  };
  const reasonSelectListener = useCallback(event => {
    // console.log(event['data'])
    // setdefaultPrice('')
    // // console.log('Price null')
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
        Description:'',
        Additionaldesc:''
  
  
      })
    }
  
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
    // sessionStorage.setItem('FolioTabNo',localStorage.getItem('FolioTabNo'))
//get payments

fetchx(API_URL + "/getBusinessDate", {
  method: "POST",
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    hotelID: 1,
      })
}).then(result => result.json())
.then(resp => {
    // console.log(resp['data'])
    // console.log(resp['data'][0]['businessDate'])
    setToday(resp['data'][0]['businessDate'])
  }).catch((error) => {
    // console.log(error)
  })
const GetPaymentData = JSON.stringify({
  hotelID: 1,
    })
fetchx(API_URL + "/getPaymentTransactionCodes", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: GetPaymentData
  }).then(result => result.json())
  .then(rowData => {
      // console.log(rowData['data'])
      let tempData = rowData['data']
      // setFolioCount(rowData['data'])
      FinalPaymentOptions = rowData['data']
      
      // console.log(FinalPaymentOptions)

    }).catch((error) => {
      // console.log(error)
    })

    fetchx(API_URL + "/getPaymentTransactionCodes", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: GetPaymentData
    }).then(result => result.json())
    .then(rowData => {
        // console.log(rowData['data'])
        // setFolioCount(rowData['data'])
       
          Object.entries(rowData['data']).forEach((entry, index) => {
            const [key, value] = entry
            // // console.log(entry)
            if(entry[1]['label']=='BTC'){
              // console.log('Delete BTC')
              // // console.log(index)
              delete rowData['data'][index]
            }
         });
          // PaymentOptions = FinalPaymentOptions
          setPaymentOptions(rowData['data'])
          // console.log(PaymentOptions)
        
      }).catch((error) => {
        // console.log(error)
      })


    fetchx(API_URL + "/getFolioOnHoldCount", {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                hotelID: 1,
                reservationID: sessionStorage.getItem('reservationID')
                  })
            }).then(result => result.json())
            .then(rowData => {
                // console.log(rowData['data'])
                rowData1=[]
                FolioOptions=[]
                // console.log(rowData['data']!=undefined)
                // setRowData(rowData['data'])
                if(rowData['data']!=undefined){
                  // console.log('===============================')
                  rowData1 = rowData['data']
                  FolioOptions = rowData['data']
                  if(rowData['data'].length==1){
                    setAllFolioSettled(false)
                    setFolioHasTrxn(true)
                    // console.log('Confirm checkout modal true')
                  }else{
                    for(let i =0 ;i<rowData['data'].length;i++){
                      if(rowData['data'][i]['isSettled']==0){
                        // setAllFolioSettled(true)
                        setAllFolioSettled(false)

                    // console.log('Confirm checkout modal false')

                      }
                    }
                  }
                  

                }
    
              }).catch((error) => {
                // console.log(error)
              })
          // console.log('================')



          fetchx(API_URL + "/getReservationDetails", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              hotelID: 1,
              reservationID: sessionStorage.getItem('reservationID') 
            })
          }).then(result => result.json())
          .then(rowData => {
              // console.log(rowData['data'][0])
              
              setReservationData(rowData['data'][0])
              if(rowData['data'][0]['reservationStatus']=='Checked Out'){
                // console.log('Guest is checked out')
                setEnableButton(true)
              }
              sessionStorage.setItem('RoomNo',rowData['data'][0]['roomNumber'])
              sessionStorage.setItem('roomID',rowData['data'][0]['room'])
              sessionStorage.setItem('departureDate',rowData['data'][0]['departureDate'])
              // console.log(sessionStorage.getItem('departureDate'),moment(String(new Date(Today))).format('YYYY-MM-DD'))
              // console.log(sessionStorage.getItem('departureDate')==moment(String(new Date(Today))).format('YYYY-MM-DD'))
              
              if(sessionStorage.getItem('departureDate')==moment(String(new Date(Today))).format('YYYY-MM-DD')){
               // console.log(API_URL + '/getAllFoliosWithTrxnForRes?hotelID=1&reservationID='+sessionStorage.getItem('reservationID'))
                fetchx(API_URL + '/getAllFoliosWithTrxnForRes?hotelID=1&reservationID='+sessionStorage.getItem('reservationID'))
            .then(result => result.json())
            .then(response => {
              // console.log(response['data'])
              if(response['data'].length>0){
                setFoliosToSettle(response['data'])
                setShowSettleFolioCard(true)

              }
            })
              }
            }).catch((error) => {
              // console.log(error)
            })

            fetchx(API_URL + `/getAllTransactionCode?hotelID=1`)
            .then(result => result.json())
            .then(rowData => {
              setTrxnRowData(rowData['data'])
              // // console.log(rowData['data'])
              // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
            })


            /////// To set the folio option on load
            fetchx(API_URL + "/getFolioBalance", {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                hotelID: 1,
                reservationID: sessionStorage.getItem('reservationID'),
                folioNo:parseInt(active)
                  })
            }).then(result => result.json())
            .then(rowData => {
              // console.log(rowData)
                // console.log(rowData['data']['Balance'])
                // setRowData(rowData['data'])
                if(rowData['data']!=undefined){
                  folioBalance  = rowData['data']['Balance']
                  setBal(folioBalance)
                  // console.log(folioBalance)
                  defaultopt = [{
                    value: active,
                    label: "Folio-"+active+"(Balance:"+folioBalance+")",
                  }]
                  // console.log(defaultopt)
                  setTimeout(()=>{setreload(true)},100)
                  // // console.log(defaultFolioOption)

                }
    
              }).catch((error) => {
                // console.log(error)
              })
            

        }, [Today!==undefined])
  const onDiscard = () => {
    setReasonSelect(!ReasonSelect)
    }
      //Search element
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef1.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    )
  }, [])

  const onDiscard2 = () => {
    setPostPayments(false)
  }

  const PostChargesSubmit = data => {
    // console.log('hiiiiiiiiiiiiiiiii')
    setData(data)
    // console.log(data)
    // console.log(data.Additionaldesc!=undefined,data.Additionaldesc!='',data.Additionaldesc!=null)
    if(data.Additionaldesc!='' && data.Additionaldesc!=null &&  data.Additionaldesc!=undefined){
      // console.log('Modifying descr')
      setDescription(data.Additionaldesc)
    }
    handleReset()
    setPostChargesConfirm(PostCharges)    
  }
  //On submit function
  const onSubmit = data => {
    // console.log('hiiiiiiiiiiiiiiiii')
    if(!data.hasOwnProperty('BTCCompany')){
      data.BTCCompany={}
      data.BTCCompany['value']=null
    }
    // console.log(CompanyLabel)
    // console.log(CompanyValue)

    // console.log(data)

    setData(data)
    // folioBalance=data.Amount
    if(data.Amount!=undefined){
      setBal(data.Amount)

    }
    // console.log(Bal)
    // console.log(data)
    setShow(true)    
  }

  const CheckOut =() =>{

    fetchx(API_URL + "/checkOutReservation", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelID: 1,
            reservationID:sessionStorage.getItem('reservationID'),
            roomID:sessionStorage.getItem('roomID')
              })
        }).then(result => result.json())
        .then(rowData => {

            if(rowData.statusCode==200){
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
    
              {FolioHasTrxn && 
                // setTimeout(()=>{navigate('/dashboard/testFrontDesk')
                //       const newTab = window.open('about:blank', '_blank');
                //        newTab.location.href = '/dashboard/testFrontDesk/BillTemplate'},1000)
                       getFinalInvoice(active)
                      // console.log(InvURL)
    
                      //  setTimeout(()=>{navigate('/dashboard/testFrontDesk')
                      //  const newTab = window.open('about:blank', '_blank');
                      //   newTab.location.href = InvURL
                      //  },1000)
                      } // Replace '/new-page' with the actual URL you want to open in the new tab
                       {!FolioHasTrxn && setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},100) }
    
            }
            else{
              setConfirmCheckOut(false)
              
              seterrorMsg(rowData.message)
              setshowErrorMsg(rowData.message)
              setTimeout(()=>{getFinalInvoice(active)},1000)
              // setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},1000)
            }

          }).catch((error) => {
            // console.log(error)
          })
          

  }
  const SettleFolio =(is_payment,active) =>{
    setEnableButton(true)

    // console.log(is_payment)
    // console.log(Bal)
    // console.log(active)
    sessionStorage.setItem('FolioNo',active)
    localStorage.setItem('FolioNo',active)

    let POSTdata
    if(is_payment==1){
       POSTdata = JSON.stringify({
        hotelID:1,
        transactionCodeID:SelectedValue,
        reservationID:sessionStorage.getItem('reservationID'),
        folioNo:active,
        baseAmt:Bal,
        supplement:data.Supplements,
        remarks:data.reference,
        description:SelectedLabel,
        is_payment:is_payment,
        BTCAccID:CompanyValue    
      })
      
    }else{
       POSTdata = JSON.stringify({
        hotelID:1,
        reservationID:sessionStorage.getItem('reservationID'),
        folioNo:active,
        is_payment:0,
        BTCAccID:null    
      })
    }
    // console.log(POSTdata)
    fetchx(API_URL + "/getOnHoldTransactionOfReservationID", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
        reservationID: sessionStorage.getItem('reservationID'),
        folio:active 
      })
    }).then(result => result.json())
    .then(rowData => {
        // console.log("=======================>")
        // console.log(sessionStorage.getItem('reservationID'))
        // console.log(active)
        // console.log(rowData['data'])
        // console.log(rowData['data'].length)

        if(rowData['data'].length>0){
          // console.log('folio has trxns')
          setFolioHasTrxn(true)
          setFolioTrxnCount(true)
          // console.log(FolioHasTrxn)

        }else{
          // console.log('folio has No trxns')

          setFolioHasTrxn(false)

        }
// console.log(FolioHasTrxn)
      }).catch((error) => {
        // console.log(error)
      })

// console.log("Innnnnnnnnnnnnnnnnnnnnn")
    localStorage.setItem('FolioNo',active)
    // console.log(Bal)
            fetchx(API_URL + "/SettleFolio", {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: POSTdata
            }).then(result => result.json())
            .then(rowData => {
                // console.log(rowData['data'])
                // console.log(!AllFolioSettled)
                // console.log(FolioHasTrxn)
                if(rowData.statusCode==200){
                  sessionStorage.setItem('FolioTabNo',0)
// // console.log(ReservationData['departureDate'],moment(String(new Date(Today))).format('YYYY-MM-DD'))
                // if(rowData['data']>0 || FolioHasTrxn){
                //   {!AllFolioSettled  && 
                //     // setTimeout(()=>{ navigate('/dashboard/testFrontDesk')
                //     // const newTab = window.open('about:blank', '_blank');
                //     //  newTab.location.href = '/dashboard/testFrontDesk/BillTemplate'},1000)
                //     getFinalInvoice()
                //   // console.log(InvURL)

                //     // setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')
                //     // const newTab = window.open('about:blank', '_blank');
                //     //  newTab.location.href = InvURL
                //     // },1000)
                    
                //     } // Replace '/new-page' with the actual URL you want to open in the new tab
                //     {!FolioHasTrxn && setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},100) }
                // }else{
                  // setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},100)
                  // {FolioHasTrxn && 
                    getFinalInvoice(active)
                    // console.log(InvURL)
                   
                  // } // Replace '/new-page' with the actual URL you want to open in the new tab
                  //    {!FolioHasTrxn && setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},100) }
                  // if(ReservationData['departureDate']==moment(String(new Date(Today))).format('YYYY-MM-DD')){
                    
                  // // ConfirmCheckoutGuest()
                  // }
                // }
                
      setShow(false)
              }else{
                setshowErrorMsg(rowData.message)
                setPostPayments(false)
                setShow(false)
              }
        
              }).catch((error) => {
                // console.log(error)
              })
              // console.log('In else')
            setPostPayments(false)
            setShow(false)
            
            
            setEnableButton(false)

            
          }
        

     
          const AddPayment =() =>{
            setEnableButton(true)

            // setData(data)
            // // console.log(data)
            let folioNo = ''
            if(data.Folio!=undefined && active=='0'){
              folioNo = data.Folio.value
            }
            else if(data.Folio==undefined && active!='0'){
              folioNo = defaultopt[0]['value']
            }
            // console.log('folioNo',folioNo)
            
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
            // console.log(POSTdata)
            const res = fetchx(API_URL + "/postTransaction", {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: POSTdata
            }).then(result => result.json())
              .then(resp => {
               // console.log(resp)
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
                    // console.log(resp)
                    if(resp.statusCode==200){
                      // console.log(resp)
                      setPaymentReceiptURL(API_URL+'/images/'+resp['data'])
                      // console.log(API_URL+'/images/'+resp['data'])
                
                
                    }
                    
                  }).catch((error) => {
                    // console.log(error)
                  })
                setShowPaymentPreview(!ShowPaymentPreview)
                          setPostTrxnPayment(!PostTrxnPayment)
                          setshowPaymentReceipt(true)
                          setEnableButton(false)
                }else{
                
                    setPaymentReceiptURL(API_URL+'/imagepaths/PMS_Invoice/PaymentReceipt/PaymentReceipt_'+resp.data+'.pdf')
                    setShowPaymentPreview(!ShowPaymentPreview)
                    setPostTrxnPayment(!PostTrxnPayment)
                    setshowPaymentReceipt(true)
                    setEnableButton(false)
                  
                }
                // setTimeout(()=>{window.location.reload()},2000)
               }else{
                seterrorMsg(resp.message)
                setshowErrorMsg(resp.message)
                setEnableButton(false)

               }
              }).catch((error) => {
                // console.log(error)
                setEnableButton(false)

              })
              
          
          }
  const ConfirmPostAllowance =(data) =>{
  //  setData(data['reasonRemarks'])
  // console.log(data)
  if(data.ReasonRemarks!=undefined){
    setReasonRemarks(data.reasonRemarks)
  }
  
   // console.log(ReasonRemarks)  
  //  setReasonRemarks(data['reasonRemarks'])
   setConfirmAllowance(true)
  }
  function handleRadioChange(event) {
    setselectedOption(event.target.value)
    sessionStorage.setItem('AllowanceType',event.target.value)
    // // console.log('============================================')
    // // console.log(document.getElementById('Allowance').value)
  
    if (event.target.value === 'Amount') {
      
      setPlaceholder('Enter Amount')
      // setShowDropdown(true)
    } else {
      setPlaceholder('Enter Percentage')
  
      // setShowDropdown(false)
    }
    // document.getElementById('Allowance').value =10
    // setsource(event.target.value)
  }

  const UpdateAllowanceAmt =()=>{

    // console.log(document.getElementById('Allowance').value)
    // let tempTaxPercentage = TrnxSelected.tax_percentage
    // if(selectedOption=='Amount'){
      // let amount = document.getElementById('Allowance').value
    //   let taxAmt = (amount*tempTaxPercentage)/100
    //   if(TrnxSelected.base_amount >= amount){
    //     document.getElementById('AllowanceAmount').value = amount;
    //     document.getElementById('AllowanceWithTax').value = parseFloat(amount)+parseFloat(taxAmt)
    //   }else{
    //     alert("Allowance Amount selected is more then the transaction amount")
    //     document.getElementById('AllowanceAmount').value = ""
    //     document.getElementById('AllowanceWithTax').value = ""

    //   }
      
    //   // setAllowanceAmount(amount)
    // }else{
      let amount = (BalanceAmt)*(document.getElementById('Allowance').value/100)
      setAllowanceAmount(amount)
      // console.log(amount)
      setfolioAllowance(BalanceAmt-amount)
      // let taxAmt = (amount*tempTaxPercentage)/100

      // if(TrnxSelected.base_amount >= amount){
      //   document.getElementById('AllowanceAmount').value = amount;
      //   document.getElementById('AllowanceWithTax').value = parseFloat(amount)+parseFloat(taxAmt)
      // }else{
      //   alert("Allowance percenetage is more then 100%")
      //   document.getElementById('AllowanceAmount').value = ""
      //   document.getElementById('AllowanceWithTax').value = ""
        
      // }
    // }
    
    // // setAllowanceWithTax(1000)
    // // console.log('AllowanceAmount')
    // // console.log(AllowanceAmount)

  }

  const handlecheckboxChange = (event) => {
    // SelectedBalance=''
    selectedBalanceAmt('')
    // console.log(event)
    setselectedOption(event);

    fetchx(API_URL + "/getFolioBalanceByGrpID", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
        reservationID:sessionStorage.getItem('reservationID'),
        folioNo:active,
        GrpID:event
          })
    }).then(result => result.json())
    .then(rowData => {
        // console.log(rowData['data'])
        // setFolioCount(rowData['data'])
        if(rowData.statusCode==200){
          // console.log(rowData['data'][0]['ID'])
          // console.log(SpiltTransactionIDs)
          setSpiltTransactionIDs([...JSON.parse(rowData['data'][0]['ID'])])
          // setTransactionIDs(TransactionIDs=>[...TransactionIDs,rowData['data'][0]['ID']])

          // console.log(SpiltTransactionIDs)
          
        }
      }).catch((error) => {
        // console.log(error)
      })
      setTimeout(()=>{setreload(true)},1)
      // SelectedBalance = 1000000
    
  }
  const handleDropdownChange = (event) => {
    selectedBalanceAmt('')
    // console.log(event.value)
    sessionStorage.setItem('reasonGroupID',6)
    setselectedOption(event.value);


    // if(event.label=='All'){
    //   for(let j=0 ; j<FolioAllowanceType.length;j++){
    //     if(FolioAllowanceType[j]['value']!=0){
    //       setGrpID(GrpID=>[...GrpID,FolioAllowanceType[j].value])
    //     }
    //   }
      
      
    // }else{
      setGrpID(event.value)
    // }
    // SelectedBalance=''
    
    // console.log(GrpID)

    if(event.value!=0){
    fetchx(API_URL + "/getFolioBalanceByGrpID", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
        reservationID:sessionStorage.getItem('reservationID'),
        folioNo:active,
        GrpID:event.value
          })
    }).then(result => result.json())
    .then(rowData => {
        // console.log(rowData['data'])
        // setFolioCount(rowData['data'])
        if(rowData.statusCode==200){

          if(rowData['data'][0]['ID'] == null){
            setshowErrorMsg('Allowance cannot be applied to the selected Grp')
            setPostFolioAllowance(false)
          }else{
          selectedBalanceAmt(rowData['data'][0]['balance'])
          // console.log(rowData['data'][0]['ID'])
          // console.log(TransactionIDs)
          setTransactionIDs(TransactionIDs=>[...TransactionIDs,...JSON.parse(rowData['data'][0]['ID'])])
          // setTransactionIDs(TransactionIDs=>[...TransactionIDs,rowData['data'][0]['ID']])

          // console.log(TransactionIDs)
          }
        }
      }).catch((error) => {
        // console.log(error)
      })
      setTimeout(()=>{setreload(true)},1)
      // SelectedBalance = 1000000
    }else{
      selectedBalanceAmt(folioBalance)
    }
  }
  const checkisCode =(event) =>{
    // console.log("hello")
    // console.log(document.getElementById('Price').value)
    // setquantity(document.getElementById('quantity').value)
    let updatedBasePrice=document.getElementById('Price').value
    if(TransactionCode=='' && Description==''){
      setshowErrorMsg('Select the Transaction Code')
      // setdefaultPrice('')
      // setAmount('')
      
    }else{
      // console.log(document.getElementById('Price').value)
      setdefaultPrice(document.getElementById('Price').value)
      const company = JSON.stringify({
        hotelID: 1,
        transactionCode: sessionStorage.getItem('TransactionCodeID'),
        Price: document.getElementById('Price').value
      })
      // console.log(company)
    fetchx(API_URL + "/getTransactionCodeTaxesbyTrxnCodeID", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: company
    }).then(result => result.json())
    .then(rowData => {
        // console.log(rowData['data'])
        let tax = rowData['data']
        let taxDetails={}
        // let taxPercentage = 0
        taxDetails['sgstAmt'] = 0
        taxDetails['cgstAmt'] = 0
        taxDetails['vatAmt'] = 0
        let qty = 1
        // console.log(qty)
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
        // console.log(taxDetails)
        // setReservationData(rowData['data'])
      }).catch((error) => {
        // console.log(error)
      })
    }
  }

    //ag-grid cell clcked value
    const TrxnClickedListener = useCallback(event => {
      // console.log(event['data'])
      setdefaultPrice('')
      // console.log('Price null')
      // handleReset()
      setTransactionCode(event['data']['transactionCode'])
      sessionStorage.setItem('TransactionCodeID',event['data']['id'])
      setDescription(event['data']['description'])
      sessionStorage.setItem('TransactionCodeID',event['data']['id'])
      setAmount('')
      setTransactionCodeSelect(false)

  
    })
  const cellClickedListener = useCallback((event) => {
    // console.log("cellClicked", event);
    // setfilldata(event["data"]);
    setCompanyValue(event.data.companyid)
    setCompanyLabel(event.data.accountName)
  }, []);
  
  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption.value);
    setSelectedLabel(selectedOption.label)
    // console.log(selectedOption.value)
    // console.log(selectedOption.label)
    if(selectedOption.label=='BTC'){
      setshowBTCfield(true)
      const company = JSON.stringify({
        hotelID: 1,
        reservationID: sessionStorage.getItem('reservationID') 
      })
      // console.log(company)
      fetchx(API_URL + '/getBTCCompanies?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        // setBTCAccountOptions(resp['data'])
        setRowData(resp['data'])
        // marketCode = resp['data']
        // console.log(resp['data'])
      }).catch((error) => {
        // console.log(error)
      })
      fetchx(API_URL + "/getBTCAccByReservationID", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: company
          }).then(result => result.json())
          .then(rowData => {
            // console.log(rowData)
            if(rowData.statusCode==200){
              // setBTCAccountOptions(rowData['data'])
              // console.log(rowData['data'])
              // console.log(rowData['data'].length)
              // // console.log(BTCAccountOptions)

              // for(let i=0;i<rowData['data'].length;i++){
                
              //   // console.log(rowData.data[i]['isBTCApproved'])
              //   if(rowData.data[i]['isBTCApproved']==1){
              //     let tempOption={}

              //     if(rowData.data[i]['companyID']!=null){
              //       // console.log('IN companyID')
              //       // tempOption = {value:rowData.data[0]['companyID'] , label:rowData.data[0]['accountName']}
              //       tempOption['value'] = rowData.data[0]['companyID']
              //       tempOption['label'] = rowData.data[0]['accountName']
              //       // console.log(tempOption)
              //       setBTCAccountOptions(tempOption)
              //     }
              //     if(rowData.data[i]['agentID']!=null){
              //       // console.log('IN agentID')

              //       tempOption = {'value':rowData.data[0]['agentID'] , 'label':rowData.data[0]['accountName']}
              //       setBTCAccountOptions(BTCAccountOptions => [...BTCAccountOptions, tempOption]);
              //     }
              //   }
              // }
              if(rowData['data'].length!=0){
                setCompanyLabel(rowData['data'][0].label)
                setCompanyValue(rowData['data'][0].value)
                defaultReason = {
                  value: rowData['data'][0].value,
                  label: rowData['data'][0].label,
                };
                // console.log(defaultReason)
                setshowBTCfield(true)

              }
              else if(rowData['data'].length==0){
               

                setshowErrorMsg('Reservation has no BTC Approved Account tagged')
                setshowBTCfield(true)
              }
              // if(rowData.data[0]['BTCAccount']==null && rowData.data[0]['companyID']==null && rowData.data[0]['agentID']==null){
                // fetchx(API_URL+'/getBTCCompanies?hotelID=1')
                // .then(result => result.json())
                // .then(resp => {
                //   // console.log(resp['data'])
                //   setBTCAccountOptions(resp['data'])
                //   // console.log(BTCAccountOptions)
                //   setshowBTCfield(true)
            
                // })
              //   setshowErrorMsg('BTC Account is not tagged,BTC Settlement not possible')
              //   setshowBTCfield(false)
              // }
              // else if(BTCAccountOptions.length==0){
               

              //   setshowErrorMsg('Reservation has no BTC Approved Account')
              //   setshowBTCfield(false)
              // }
              // else{
              //   // console.log(rowData.data[0]['companyID'],rowData.data[0]['agentID'])
              //   if(rowData.data[0]['companyID']!=null){
              //     tempOption = {value:rowData.data[0]['companyID'] , label:rowData.data[0]['accountName']}
              //     setBTCAccountOptions(tempOption)
              //   }
              //   if(rowData.data[0]['agentID']!=null){
              //     tempOption = {value:rowData.data[0]['agentID'] , label:rowData.data[0]['accountName']}
              //     setBTCAccountOptions(BTCAccountOptions => [...BTCAccountOptions, tempOption]);
              //   }
              //   // console.log(rowData.data[0]['accountName'])
              //   // setBTCAccount(rowData.data[0]['accountName'])
              //   setshowBTCfield(true)
              // }

            }
            else{
              setshowBTCfield(false)
            }
           
              // setReservationData(rowData['data'][0])
              // sessionStorage.setItem('RoomNo',rowData['data'][0]['roomNumber'])
              // sessionStorage.setItem('roomID',rowData['data'][0]['room'])
            }).catch((error) => {
              // console.log(error)
            })
      //get reservation details and check if btc account is tagged
      //If yes then check if the company is btc approved
      //If not display alert (BTC settlement not possible)
      
    }else{
      setshowBTCfield(false)

    }
    // // console.log(localStorage.getItem('reservationRoomType'))
    // localStorage.removeItem('reservationRoomType')
    // localStorage.setItem('reservationRoomType', selectedOption.label);
    // localStorage.setItem('reservationNewRoomTypeID', selectedOption.value);

    // // console.log(localStorage.getItem('reservationRoomType'))
    // // console.log(localStorage.getItem('reservationRoomTypeID'))
    // setreload(false)
    // setTimeout(() => { setreload(true) }, 1)

  };


  const fetchxDataFromApi=async(i) =>{
    return new Promise((resolve,reject)=>{
      let IDarr = TransactionIDs
      // console.log(IDarr)
      // console.log(i)
      // // console.log(IDarr[i])
      // Make an asynchronous API call here
      let POSTdata = JSON.stringify({
        hotelID:1,
        transactionID:i,
        type: 'Percentage',
        Amount:0,
        Percentage:document.getElementById('Allowance').value,
        folioNo:active,
        reasonID:ReasonID,
        reasonRemarks:ReasonRemarks,
        reservationID:sessionStorage.getItem('reservationID'),
        GrpID:GrpID
      })
    
      // console.log(POSTdata)
    
    
        const res = fetchx(API_URL + "/postFolioAllowance", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: POSTdata
        }).then(result => result.json())
          .then(resp => {
           // console.log(resp)
           if(resp.statusCode==200){
            toast(
              <div className="d-flex">
                <div className="me-1">
                  <Avatar size="sm" color="success" icon={<Check size={12} />} />
                </div>
                <div className="d-flex flex-column">
                  <h6>Allowance Added Successfully</h6>
                  {/* <h4>Wait-List Added Successfully</h4> */}
                </div>
              </div>
            );
            resolve('success')
           }else{
            
            // console.log('error message---------------')
            // console.log(resp.message)
            setshowErrorMsg(resp.message)
            reject(resp.message)
            
           }
          }).catch((error) => {
            // console.log(error)
          })
        //   // console.log("i,IDarr.length",i,IDarr.length)
        //   if(i==IDarr.length-1){
        //     // console.log('Folio Allowance posted')
        // localStorage.setItem('FolioNo',active)
    
        //     setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},100)
    
        //   }

      // You can process the data here or update the component state
        })
  }
  const AddAllowance =() =>{
    setEnableButton(true)

    // console.log("================================>")
    // console.log(document.getElementById('Allowance').value)
    // // console.log(document.getElementById('AllowanceAmount').value)
    // // console.log(document.getElementById('Allowance').value)
    // // console.log(TrnxSelected.base_amount)
    // // console.log(TrnxSelected.tax_percentage)
    // let IDarr = TransactionIDs
    // // console.log(IDarr)
    

    // console.log("ReasonRemarks-----------------------------",ReasonRemarks)
    let POSTdata = JSON.stringify({
      hotelID:1,
      type: 'Percentage',
      Amount:0,
      Percentage:document.getElementById('Allowance').value,
      folioNo:active,
      reasonID:ReasonID,
      reasonRemarks:ReasonRemarks,
      reservationID:sessionStorage.getItem('reservationID'),
      GrpID:GrpID
    })
  
    // console.log(POSTdata)
  
  
      const res = fetchx(API_URL + "/postFolioAllowance", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: POSTdata
      }).then(result => result.json())
        .then(resp => {
         // console.log(resp)
         if(resp.statusCode==200){
          toast(
            <div className="d-flex">
              <div className="me-1">
                <Avatar size="sm" color="success" icon={<Check size={12} />} />
              </div>
              <div className="d-flex flex-column">
                <h6>Allowance Added Successfully</h6>
                {/* <h4>Wait-List Added Successfully</h4> */}
              </div>
            </div>
          );
        // console.log('Folio Allowance posted and Active folio is',active)
    localStorage.setItem('FolioNo',active)
    sessionStorage.setItem('FolioNo',active)

    // setConfirmAllowance(false)
    // setPostFolioAllowance(false)
    setEnableButton(false)

        setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},100)
}else{
          
          // console.log('error message---------------')
          // console.log(resp.message)
          setConfirmAllowance(false)
          setPostFolioAllowance(false)

          setshowErrorMsg(resp.message)
          setEnableButton(false)

         }
        }).catch((error) => {
          // console.log(error)
          setEnableButton(false)

        })

  }
const MergeFolio =(data)=>{
  // console.log(data)

  fetchx(API_URL + "/mergeFolio", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
        reservationID:sessionStorage.getItem('reservationID'),
        prevFolio:active,
        newFolio:data.Folio.value
          })
    }).then(result => result.json())
    .then(rowData => {
        // console.log(rowData)
        // setFolioCount(rowData['data'])
        if(rowData.statusCode==200){
         setshowMergeFolio(!showMergeFolio)
         toast(
          <div className="d-flex">
            <div className="me-1">
              <Avatar size="sm" color="success" icon={<Check size={12} />} />
            </div>
            <div className="d-flex flex-column">
              <h6>Folio Merged Successfully</h6>
              {/* <h4>Wait-List Added Successfully</h4> */}
            </div>
          </div>
        );
         setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},100)
        }
      }).catch((error) => {
        // console.log(error)
      })

}

const handleSelect = id => {
  // console.log(selectedRows)
  
  let selectedRowsArr = selectedRows
  // console.log(FolioAllowanceType[id]['value'])
  if(FolioAllowanceType[id]['value']==0){
    // console.log('hi')
    if (selectedRowsArr.length < FolioAllowanceType.length) {
        let ids = []
        for (let i = 0; i < FolioAllowanceType.length; i++) {
            ids.push(FolioAllowanceType[i]['value'])
        }
  
        selectedRowsArr = ids
    } 
    else if (selectedRowsArr.length === FolioAllowanceType.length) {
        selectedRowsArr = []
    }
  }else if (!selectedRowsArr.includes(FolioAllowanceType[id]['value'])) {
      selectedRowsArr.push(FolioAllowanceType[id]['value'])
  } else if (selectedRowsArr.includes(FolioAllowanceType[id]['value'])) {
      selectedRowsArr.splice(selectedRowsArr.indexOf(FolioAllowanceType[id]['value']), 1)
  } 
  else {
      return null
  }
  // console.log(selectedRowsArr)
  setSelectedRows([...selectedRowsArr])
  // console.log(selectedRows)
  // // console.log(FolioAllowanceType[id])
  // handleDropdownChange(selectedRows)
  handlecheckboxChange(selectedRows)

}
const fetchxReasonCodeData =()=>{
  // console.log(selectedValue)
  fetchx(API_URL + "/getReasonCodes", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hotelID: 1,
      groupID:sessionStorage.getItem('reasonGroupID')
        })
  }).then(result => result.json())
  .then(rowData => {
      // console.log(rowData['data'])
      setreasonCodeData(rowData['data'])
    }).catch((error) => {
      // console.log(error)
    })
  setReasonSelect(!ReasonSelect)
}

const handleSelectAll = () => {
  let selectedRowsArr = selectedRows
  if (selectedRowsArr.length < FolioAllowanceType.length) {
      let ids = []
      for (let i = 0; i < FolioAllowanceType.length; i++) {
          ids.push(FolioAllowanceType[i]['value'])
      }

      selectedRowsArr = ids
  } 
  else if (selectedRowsArr.length === FolioAllowanceType.length) {
      selectedRowsArr = []
  } 
  else {
      return null
  }
  // console.log(selectedRowsArr)
  setSelectedRows(selectedRowsArr)
  
}

const ConfirmSplitFolio =() =>{
  // console.log('Spliyyyyyyy Folio')
  // console.log(SpiltTransactionIDs)
  
  fetchx(API_URL + "/splitFolio", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID:1,
        transactionID:SpiltTransactionIDs,
        reservationID:sessionStorage.getItem('reservationID'),
        folioNo:active
      })
    }).then(result => result.json())
    .then(rowData => {
        // console.log(rowData)
        if(rowData.statusCode==200){
          toast(
            <div className="d-flex">
              <div className="me-1">
                <Avatar size="sm" color="success" icon={<Check size={12} />} />
              </div>
              <div className="d-flex flex-column">
                <h6>Split Folio Successful</h6>
                {/* <h4>Wait-List Added Successfully</h4> */}
              </div>
            </div>
          );
          setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},100)
         }
         else{
          seterrorMsg(rowData.message)
          setshowErrorMsg(rowData.message)
         }

  
      }).catch((error) => {
        // console.log(error)
      })
}
const ConfirmPostTrxnPayment = data => {
  // console.log('hiiiiiiiiiiiiiiiii')
  setData(data)
  // console.log(data)
  setShowPaymentPreview(true)    
}
const ReloadContent = ()=>{
  setReloadData(false)
  
  setTimeout(()=> setReloadData(true),100)
  // console.log('In Reload function')
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
          // console.log(rowData['data'])
          // setFolioCount(rowData['data'])
          FolioOptions = rowData['data']
        }).catch((error) => {
          // console.log(error)
        })
    // ReactDOM.render(<CardData />, document.getElementById("displayCard"))
    fetchx(API_URL + `/getAllTransactionCode?hotelID=1`)
      .then(result => result.json())
      .then(rowData => {
        setTrxnRowData(rowData['data'])
        // // console.log(rowData['data'])
        // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
      })
    const company = JSON.stringify({
      hotelID: 1,
      reservationID: sessionStorage.getItem('reservationID') 
    })
    // console.log(company)
    fetchx(API_URL + "/getReservationDetails", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: company
        }).then(result => result.json())
        .then(rowData => {
            // console.log(rowData['data'][0])
            setReservationData(rowData['data'][0])
            if(rowData['data'][0]['reservationStatus']=='Checked Out'){
              // console.log('Guest is checked out')
              setEnableButton(true)
            }
            sessionStorage.setItem('RoomNo',rowData['data'][0]['roomNumber'])
            sessionStorage.setItem('roomID',rowData['data'][0]['room'])
            sessionStorage.setItem('departureDate',rowData['data'][0]['departureDate'])
              if(sessionStorage.getItem('departureDate')==moment(String(new Date(Today))).format('YYYY-MM-DD')){
                fetchx(API_URL + '/getAllFoliosWithTrxnForRes?hotelID=1&reservationID='+sessionStorage.getItem('reservationID'))
            .then(result => result.json())
            .then(response => {
              // console.log(response['data'])
            })
              }
          }).catch((error) => {
            // console.log(error)
          })

          const GetFolioOptions = JSON.stringify({
            hotelID:1,
            reservationID:sessionStorage.getItem('reservationID')
          })
     
}

const handleSettlementType = (event)=>{
  setSettlementType(event.target.value)
  // console.log(event.target.value)
}
const AdvanceSettleConfirm =()=>{
  setAdvanceSettleFlag(1)
  setConfirmAdvanceSettle(false)
  // console.log(Bal)
  if(SettlementType!='No Charges'){
    fetchx(API_URL + "/PostAdvanceRoomCharges", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
        reservationID: sessionStorage.getItem('reservationID'),
        TonightOrFull:SettlementType,
        folioNo:active
          })
    }).then(result => result.json())
    .then(rowData => {
      // console.log('Start ----------------------------')
      // console.log(rowData)
      if(rowData.statusCode==200){
      setTimeout(()=>{
        
        
        
        fetchx(API_URL + "/getFolioOnHoldCount", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelID: 1,
            reservationID: sessionStorage.getItem('reservationID')
              })
        }).then(result => result.json())
        .then(rowData => {
            // console.log(rowData['data'])
            rowData1=[]
            FolioOptions=[]
            // console.log(rowData['data']!=undefined)
            // setRowData(rowData['data'])
            if(rowData['data']!=undefined){
              // console.log('===============================')
              rowData1 = rowData['data']
              FolioOptions = rowData['data']
              if(rowData['data'].length==1){
                // setAllFolioSettled(false)
                setFolioHasTrxn(true)
                // console.log('Confirm checkout modal true')
              }
              else{
                // for(let i =0 ;i<rowData['data'].length;i++){
                //   if(rowData['data'][i]['isSettled']==0){
                //     // setAllFolioSettled(true)
                //     // setAllFolioSettled(false)

                // // console.log('Confirm checkout modal false')

                //   }
                // }
              }
              

            }

          }).catch((error) => {
            // console.log(error)
          })
        
       
        
        fetchx(API_URL + "/getFolioBalance", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: 1,
          reservationID: sessionStorage.getItem('reservationID'),
          folioNo:active
            })
      }).then(result => result.json())
      .then(rowData => {
        // console.log(rowData)
          // console.log(rowData['data']['Balance'])
          // setRowData(rowData['data'])
          if(rowData['data']!=undefined){
            folioBalance  = rowData['data']['Balance']
            setBal(folioBalance)
            // console.log(folioBalance)
          // console.log('End ----------------------------')
    
            defaultopt = [{
              value: active,
              label: "Folio-"+active+"(Balance:"+folioBalance+")",
            }]
            // console.log(defaultopt)
            setreload(false)
            setTimeout(()=>{setreload(true)},100)

            if(folioBalance<10){
              // setPostPayments(!PostPayments)
              // console.log('in if')
              AdvanceFolioSettle(0,active)
              // SettleFolio(0,active)
            }else{
              // console.log('In else')
              setPostPayments(!PostPayments)
            }
          
    
          }
    
        }).catch((error) => {
          // console.log(error)
        })},1000)

      }else{
        seterrorMsg(rowData.message)
        setshowErrorMsg(rowData.message)
      }
      }).catch((error) => {
        // console.log(error)
        

      })
  }else{
 
  fetchx(API_URL + "/getFolioBalance", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hotelID: 1,
      reservationID: sessionStorage.getItem('reservationID'),
      folioNo:active
        })
  }).then(result => result.json())
  .then(rowData => {
    // console.log(rowData)
      // console.log(rowData['data']['Balance'])
      // setRowData(rowData['data'])
      if(rowData['data']!=undefined){
        folioBalance  = rowData['data']['Balance']
        setBal(folioBalance)
        // console.log(folioBalance)
      // console.log('End ----------------------------')

        defaultopt = [{
          value: active,
          label: "Folio-"+active+"(Balance:"+folioBalance+")",
        }]
        // console.log(defaultopt)
        if(Bal<10){
          // setPostPayments(!PostPayments)
          // console.log('in if')
          // SettleFolio(0,active)
          AdvanceFolioSettle(0,active)

        }else{
          // console.log('In else')
          setPostPayments(!PostPayments)
        }
        // setreload(false)
        // setTimeout(()=>{setreload(true)},100)
        // // console.log(defaultFolioOption)

      }

    }).catch((error) => {
      // console.log(error)
     
    })
  }

}

const AdvanceFolioSettle = (is_payment,active)=>{
  setEnableButton(true)

  // console.log(is_payment)
  // console.log(Bal)
  // console.log(active)
  sessionStorage.setItem('FolioNo',active)
  localStorage.setItem('FolioNo',active)

  let POSTdata
  if(is_payment==1){
     POSTdata = JSON.stringify({
      hotelID:1,
      transactionCodeID:SelectedValue,
      reservationID:sessionStorage.getItem('reservationID'),
      folioNo:active,
      baseAmt:Bal,
      supplement:data.Supplements,
      remarks:data.reference,
      description:SelectedLabel,
      is_payment:is_payment,
      BTCAccID:CompanyValue    
    })
    
  }else{
     POSTdata = JSON.stringify({
      hotelID:1,
      reservationID:sessionStorage.getItem('reservationID'),
      folioNo:active,
      is_payment:0,
      BTCAccID:null    
    })
  }
  // console.log(POSTdata)


// console.log("Innnnnnnnnnnnnnnnnnnnnn")
  localStorage.setItem('FolioNo',active)
  // console.log(Bal)
          fetchx(API_URL + "/SettleFolio", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: POSTdata
          }).then(result => result.json())
          .then(rowData => {
              // console.log(rowData['data'])
              // console.log(!AllFolioSettled)
              // console.log(FolioHasTrxn)
              if(rowData.statusCode==200){
                sessionStorage.setItem('FolioTabNo',0)
// console.log(ReservationData['departureDate'],moment(String(new Date(Today))).format('YYYY-MM-DD'))
              if(SettlementType!='No Charges' || is_payment==1){
                
                  // setTimeout(()=>{ navigate('/dashboard/testFrontDesk')
                  // const newTab = window.open('about:blank', '_blank');
                  //  newTab.location.href = '/dashboard/testFrontDesk/BillTemplate'},1000)
                  getFinalInvoice(active)
                // console.log(InvURL)

                  // setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')
                  // const newTab = window.open('about:blank', '_blank');
                  //  newTab.location.href = InvURL
                  // },1000)
              //  {!FolioHasTrxn && setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},100) }
              }else{
                
                setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},100)
              }
              
    setShow(false)
            }else{
              setshowErrorMsg(rowData.message)
              setPostPayments(false)
              setShow(false)
            }
      
            }).catch((error) => {
              // console.log(error)
            })
            // console.log('In else')
          setPostPayments(false)
          setShow(false)
          
          
          setEnableButton(false)

}
const AddCharges =() =>{
  setEnableButton(true)
  setDescription('')

  
  if(data.Folio!=undefined && active=='0'){
    folioNo = data.Folio.value
    // console.log(" folioNo is ---------------------- ",folioNo)
  }
  else if(data.Folio==undefined && active!='0'){
    folioNo = defaultopt[0]['value']
    // console.log(" folioNo is ---------------------- ",folioNo)

  }
  // console.log('folioNo',folioNo)
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
  // console.log('POST Trxn===========================')
  // console.log(POSTdata)
  const res = fetchx(API_URL + "/postTransaction", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: POSTdata
  }).then(result => result.json())
    .then(resp => {
     // console.log(resp)
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
      setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},100)
      setEnableButton(false)
     }else{
      // console.log(resp.message)
      seterrorMsg(resp.message)
      setshowErrorMsg(resp.message)
      setEnableButton(false)
     }
    }).catch((error) => {
      // console.log(error)
      setEnableButton(false)
    })
    
    handleReset()
    setPostChargesConfirm(!PostChargesConfirm)
    setPostCharges(!PostCharges)
  
}

const AddPaidout =()=>{
  setEnableButton(true)

  // console.log('Post paidout')
  if(data.Folio!=undefined && active=='0'){
    folioNo = data.Folio.value
  }
  else if(data.Folio==undefined && active!='0'){
    folioNo = defaultopt[0]['value']
  }
  // console.log('folioNo',folioNo)
  setSelectedFolio(folioNo)
  const POSTdata = JSON.stringify({
    hotelID:1,
    transactionCode:147,
    type: 'PaidOuts',
    reservationID:sessionStorage.getItem('reservationID'),
    folioNo:folioNo,
    baseAmt:defaultPrice,
    supplement:data.Supplements,
    remarks:data.reference,
    posBillNo:'',
    description:'Paid Outs',
    discountPercentage:0,
    isDeposit:0,
    quantity:1

  })
  // console.log('POST Trxn===========================')
  // console.log(POSTdata)
  const res = fetchx(API_URL + "/postTransaction", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: POSTdata
  }).then(result => result.json())
    .then(resp => {
     // console.log(resp)
     if(resp.statusCode==200){
      sessionStorage.setItem('TransactionID',resp.data)
                localStorage.setItem('TransactionID',resp.data)
      toast(
        <div className="d-flex">
          <div className="me-1">
            <Avatar size="sm" color="success" icon={<Check size={12} />} />
          </div>
          <div className="d-flex flex-column">
            <h6>PaidOut Posted Successfully</h6>
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
          DocName:'Paidout',
          transactionID:resp.data,
          reservationID:'',
          billNo:''
            })
      }).then(result => result.json())
      .then(resp => {
          // console.log(resp)
          if(resp.statusCode==200){
            // console.log(resp)
            setPaidoutReceiptURL(API_URL+'/images/'+resp['data'])
            // console.log(API_URL+'/images/'+resp['data'])
      
      
          }
          
        }).catch((error) => {
          // console.log(error)
        })
      setshowPaidOutReceipt(true)
      setEnableButton(false)
      }else{
        setPaidoutReceiptURL(API_URL+'/imagepaths/PMS_Invoice/PaidOutReceipt/PaidOutReceipt_'+resp.data+'.pdf')
        setshowPaidOutReceipt(true)
        setEnableButton(false)
      }
      // setTimeout(()=>{window.location.reload()},2000)
      // ReloadContent()
      // setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},100)

     }else{
      // console.log(resp.message)
      seterrorMsg(resp.message)
      setshowErrorMsg(resp.message)
      setEnableButton(false)

     }
    }).catch((error) => {
      // console.log(error)
      setEnableButton(false)

    })
  setConfirmPaidout(false)
  setPostPaidouts(false)
}
const ConfirmPostPaidOuts = data =>{
  setData(data)
  // console.log(data)
  setdefaultPrice(document.getElementById('Price').value)

  // handleReset()
  setConfirmPaidout(true)
}
const getFinalInvoice =(folioSettled)=>{
  // // console.log('Generating invoice for folio ',folioSettled,active)
  fetchx(API_URL + "/getTransactionOfReservationID", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hotelID: 1,
      reservationID: sessionStorage.getItem('reservationID'),
      folio:folioSettled 
    })
  }).then(result => result.json())
  .then(rowData => {
      // // console.log("=======================>")
      // // console.log(sessionStorage.getItem('reservationID'))
      // // console.log(folioSettled)
      // // console.log(rowData['data'])
      // // console.log(rowData['data'].length)

      if(rowData['data'].length>0){
        // // console.log('folio has trxns')
        fetchx(API_URL +'/getPMSInvoiceDetails?hotelID=10&reservationID='+sessionStorage.getItem('reservationID')+'&folioNo='+folioSettled)
        .then(result => result.json())
        .then(rowData => {
          // // console.log(rowData)
          if(rowData.statuscode==200){
            setInvData(rowData['data'])
    
    if(!is_test){
    
            // // console.log(rowData)
            fetchx(API_URL + "/gets3DocumentIDPMS", {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                hotelID: 1,
                DocName:'PMSInvoice',
                transactionID:'',
                reservationID:sessionStorage.getItem('reservationID'),
                billNo:rowData['data'][0]['billNo']
                  })
            }).then(result => result.json())
            .then(resp => {
                // // console.log(resp)
                if(resp.statusCode==200){
                  // // console.log(resp)
                  setInvURL(API_URL+'/images/'+resp['data'])
                }
                
              }).catch((error) => {
                // // console.log(error)
                setshowErrorMsg(error)
              })
              
            setCnfViewInvoice(true)

            // ReloadContent()
          }
          else{
            setInvURL(API_URL+'/imagepaths/PMS_Invoice/Invoice/PMSInvoice_' + sessionStorage.getItem('reservationID') + '_' + rowData['data'][0]['billNo'] + '.pdf')
            setCnfViewInvoice(true)
            // ReloadContent()
            
          }
        }
    
        })

      }else{
        // // // console.log('folio has No trxns')
        // setshowErrorMsg('Folio has No transactions')
        setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')})
        

      }
    }).catch((error) => {
      // // console.log(error)
    })
}
const GetDummyInvoice=()=>{


  fetchx(API_URL + "/getOnHoldTransactionOfReservationID", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hotelID: 1,
      reservationID: sessionStorage.getItem('reservationID'),
      folio:active 
    })
  }).then(result => result.json())
  .then(rowData => {
      // console.log("=======================>")
      // console.log(sessionStorage.getItem('reservationID'))
      // console.log(active)
      // console.log(rowData['data'])
      // console.log(rowData['data'].length)

      if(rowData['data'].length>0){
        // console.log('folio has trxns')
        fetchx(API_URL +'/getDummyInvoiceJSON?hotelID=1&reservationID='+sessionStorage.getItem('reservationID')+'&folioNo='+active)
    .then(result => result.json())
    .then(rowData => {
      // console.log(rowData)

      if(rowData.statuscode==200){
        // console.log(rowData['url'])
        setDummyInvURL(rowData['url'])
        setShowDummyInvPDF(true)
      }
      

    })

      }else{
        // console.log('folio has No trxns')
        setshowErrorMsg('Folio has No transactions')
        

      }
    }).catch((error) => {
      // console.log(error)
    })



    
}
const ConfirmCheckoutGuest=()=>{

  // console.log(ReservationData)
  if(ReservationData['isMain']==1){
    // console.log(API_URL + `/checkIfSharerExists?hotelID=1&sharingID=`+ReservationData['sharingID'])
    fetchx(API_URL + `/checkIfSharerExists?hotelID=1&sharingID=`+ReservationData['sharingID'])

          .then(result => result.json())
          .then(response => {
            // console.log(response['data'])
            if(response.statusCode==200){
              setSharers(response.data.AllSharers)
              setUnsettledTrxn(response.data.UnsettledTrxn)
              setCheckOutSharer(!response.data.UnsettledTrxn)
              setSharerExists(true)

            }
            else{
              setCheckOutSharer(false)
              setSharerExists(false)

            }
            // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
          })
  }
  setConfirmCheckOut(!ConfirmCheckOut)
}

const fetchxFolioAllowanceType =()=>{

  fetchx(API_URL + "/getFolioAllowanceType", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hotelID: 1,
      reservationID:sessionStorage.getItem('reservationID'),
      folioNo:active
        })
  }).then(result => result.json())
  .then(rowData => {
      // console.log(rowData)
      // setFolioCount(rowData['data'])
      // FolioAllowanceType = rowData['data']
      setFolioAllowanceType(rowData['data'])
      setPostFolioAllowance(!PostFolioAllowance)

      
    }).catch((error) => {
      // console.log(error)
    })
    setTimeout(()=>{setreload(true)},1)
}
  return (
    <div>
      {/* {parseInt(active)!=0 && <p style={{textAlign:'right',marginRight:'20px' , color:'#228B22'}}><b>{balance}</b></p>} */}
     
     {ShowSettleFolioCard && FoliosToSettle.length>0 && <>
     <Card>
      <CardBody>
      <div className="ag-theme-alpine" style={{ height: 141}}>
     <AgGridReact
                  ref={gridRef1}
                  rowData={FoliosToSettle}
                  columnDefs={FoliosToSettlecolumnDefs}
                  animateRows={true}
                  onCellClicked={cellClickedListener}
                  paginationAutoPageSize="true"
                  paginationPageSize="10"
                  pagination="true"
                  headerColor="ddw-primary"
                  // gridOptions={gridOptions}
                />
</div>
      </CardBody>
     </Card>
     </>}
     
     <Card>
      <Row>
        <Col sm='12'>
         <Fragment>
        <Nav tabs className='tab'>
        <NavItem>
        <NavLink
          active={parseInt(active) === 0}
          onClick={() => {
            toggle('0','')
          }}
        >
          <p><b>All Trxns</b><br></br><b></b></p>
        </NavLink>
      </NavItem>
     {typeof(rowData1)!='undefined'&&rowData1.length!=0 && getButtonsUsingForLoop(rowData1)}
     
     </Nav>
     </Fragment>
     </Col>
     </Row>
     <Row>
     <Col sm='8'>
     <div className='inline-spacing' align="left" style={{ margin: '4px 0' }}>
     {/* {parseInt(active) === 0 && <>
     {<Button color='primary' disabled={ReservationData['noPost']==1 || EnableButton} style={{'margin-left' : '20px' }} className='sharer' onClick={() => {setPostCharges(!PostCharges)
  }} >Post Charges to any folio</Button>} */}
   {/* <Button color='primary' disabled={EnableButton} style={{'margin-left' : '10px'}} className='sharer' onClick={() => {setPostTrxnPayment(!PostTrxnPayment)
  }} >Post Payments to any folio</Button>
  <Button color='primary' disabled={EnableButton} style={{'margin-left' : '20px' }} className='sharer' onClick={() => {setPostPaidouts(true)
  }} >Post PaidOuts to any folio</Button> */}
  {/* </>} */}
   {/* {parseInt(active) != '0' && <>
   { <Button color='primary' disabled={ReservationData['noPost']==1} style={{'margin-left' : '20px' }} className='sharer' onClick={() => {setPostCharges(!PostCharges)
  }} >Post Charges</Button>}
   <Button color='primary' style={{'margin-left' : '10px'}} className='sharer' onClick={() => {setPostTrxnPayment(!PostTrxnPayment)
  }} >Post Payments</Button></>} */}
  </div>
  </Col>
  <Col sm='4'>
       <div className='inline-spacing' align="right"  style={{ margin: '4px 0' ,marginRight:'20px' }}>

     {parseInt(active) != '0' &&  <UncontrolledDropdown>
          <DropdownToggle  color = 'primary' caret >Folio Actions</DropdownToggle>
          {/* {parseInt(active) == 0 && <DropdownMenu>

            {ReservationData['noPost']==0 && <DropdownItem onClick={() => {setPostCharges(!PostCharges)}} >Post Charges to any folio</DropdownItem>}
            <DropdownItem onClick={() => {setPostTrxnPayment(!PostTrxnPayment)}} >Post Payments to any folio</DropdownItem>
            <DropdownItem onClick={() => {setPostPaidouts(true)}} >Post PaidOuts to any folio</DropdownItem>
            
            </DropdownMenu>} */}
          {parseInt(active) != '0' && <DropdownMenu>

            {/* {ReservationData['noPost']==0 && <DropdownItem onClick={() => {setPostCharges(!PostCharges)}} >Post Charges</DropdownItem>} */}
            {/* <DropdownItem onClick={() => {setPostTrxnPayment(!PostTrxnPayment)}} >Post Payments</DropdownItem> */}

            <DropdownItem onClick={() => {fetchxFolioAllowanceType()}} >Folio Allowance</DropdownItem>
            {/* <DropdownItem onClick={() => {setshowMergeFolio(!showMergeFolio)}} >Merge Folio</DropdownItem> */}
            {/* {ReservationData['departureDate']!=moment(String(new Date(Today))).format('YYYY-MM-DD') && <DropdownItem onClick={() => {setConfirmAdvanceSettle(true)}} >Advance Settle</DropdownItem>} */}

            
            {/* <DropdownItem onClick={() => {FolioAllowanceType!=undefined && setshowSplitFolio(!showSplitFolio)}
            FolioAllowanceType!=undefined  } >Split Folio</DropdownItem> */}
            {/* <DropdownItem onClick={() => {FolioAllowanceType!=undefined ? setshowSplitFolio(!showSplitFolio) : setshowErrorMsg('No Transactions in Folio') }  } >Split Folio</DropdownItem> */}
            {/* <DropdownItem tag={Link} to='/dashboard/testFrontDesk/BillTemplate' target='_blank' >Preview Dummy Invoice</DropdownItem> */}
            <DropdownItem onClick={() => {GetDummyInvoice()}} >Preview Dummy Invoice</DropdownItem>

            
            {<DropdownItem onClick={() => {
              if(Bal<10){
                // setPostPayments(!PostPayments)
                SettleFolio(0,active)
              }else{
                setPostPayments(!PostPayments)
              }
                
              // SettleFolio(0)
              
              }} >Settle Folio</DropdownItem>}
            
          </DropdownMenu>}
        </UncontrolledDropdown>}
        </div>
     {/* <div className='inline-spacing' align="right" style={{ margin: '2px 0' }}>
     {active!='0' && sessionStorage.getItem('departureDate')==moment(String(new Date(Today))).format('YYYY-MM-DD') && <Button color='success' style={{'margin-right' : '10px' , 'margin-top' : '10px'}} onClick={() => {setPostPayments(!PostPayments)}} >Settle Folio</Button>}
     {active!='0' && <Button color='success' style={{'margin-right' : '30px' , 'margin-top' : '10px'}} onClick={() => {setPostFolioAllowance(!PostFolioAllowance)}} >Folio Allowance</Button>}
     {active!='0' && <Button color='success' style={{'margin-right' : '30px' , 'margin-top' : '10px'}} onClick={() => {setshowMergeFolio(!showMergeFolio)}} >Merge Folio</Button>}
     {active!='0' && <Button color='success' style={{'margin-right' : '30px' , 'margin-top' : '10px'}} onClick={() => {setshowSplitFolio(!showSplitFolio)}} >Split Folio</Button>}

     </div>     */}
     </Col>
     </Row> 
      
    {reload && <TabContent  activeTab={active}>
        <TabPane tabId={active}>
        {<TransactionTable folio={active}/>}
        </TabPane>
        </TabContent>}

        <Modal isOpen={PostPayments} toggle={() => setPostPayments(!PostPayments)} className='modal-dialog-centered modal-lg' onClosed={()=>{setPostPayments(false)
          setshowBTCfield(false)}}>
                      <ModalHeader toggle={() => setPostPayments(!PostPayments)}>Settle Folio {active}</ModalHeader>
                          <ModalBody>
                          
                              <Fragment>
                                  <Nav tabs className='tab'>
                                     {/* {getButtonsUsingForLoop(FolioCount)} */}
                              
                                  </Nav>
                              </Fragment>
                      <Form onSubmit={handleSubmit(onSubmit)}>
                              <Row>  
                          
                {/* <Col md='4' sm='12' className='mb-1'>
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
                required
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
          </Col>  */}
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
                  options={FinalPaymentOptions}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  className={classnames("react-select", {
                    "is-invalid": data !== null && data.Payment === null,
                  })}
                  {...field}
                  onChange={handleChange}
                  
                />
              )}
            />
          </div>
          </Col> 
{/* {showBTCfield  && <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="BTCCompany">
            BTC Company
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
                id="BTCCompany"
                name="BTCCompany"
                control={control}
                
                render={({ field }) => (
                  <Input
                  // pattern="[aA-zZ]*" title="Only Alphabets Allowed" 
                  // required
                  // placeholder="Enter Items"
                    disabled={true}
                    {...field}
                    value={BTCAccount}
                    className={classnames("form-control", {
                      // "is-invalid":
                      //   data !== null && (data.BTCCompany === null || !data.BTCCompany.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>} */}
          {showBTCfield  && 
          <Col md='4' sm='8'>
          <div className='mb-1'>
            <Label className='form-label' for='BTCCompany'>
            BTC Company
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
          // <Col md='4' sm='12'>
          //       <div>
          //         <Label className='form-label' for='BTCCompany'>
          //         BTC Company <spam style={{ color: 'red' }}>*</spam>
          //         </Label>
          //         <Controller
          //           id='BTCCompany'
          //           control={control}
          //           name='BTCCompany'
          //           render={({ field }) => (
          //             <Select
          //               required
          //               // isClearable
          //               defaultValue={defaultReason}
          //               isClearable
          //               options={BTCAccountOptions}
          //               classNamePrefix='select'
          //               theme={selectThemeColors}
          //               className={classnames('react-select', { 'is-invalid': data !== null && data.frequency2 === null })}
          //               {...field}
          //             // onChange={handleChange123}

          //             />
          //           )}
          //         />
          //       </div>
          //     </Col>
              
              
              
              }
            <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Amount">
            Folio Amount
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
              
                name="Amount"
                control={control}
                render={({ field }) => (
                  <Cleave
                  // disabled={true}
                    {...field}
                    value={folioBalance}
                    // onChange={checkisCode}
                    // pattern="[0-9]*" title="Only Numbers Allowed" required
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
              <Button className="me-1" color="primary" type="submit" >
              Settle
            </Button>
            <Button className="me-1" color="primary"  onClick={()=>{setPostPayments(!PostPayments)
                            setshowBTCfield(false)
                          }} >
              Cancel
            </Button>
            </div>
            </Row>
          </Form>
                          </ModalBody>
            </Modal> 

      {/* Booker modal */}
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
                  rowData={rowData}
                  columnDefs={columnDefs}
                  animateRows={true}
                  // rowSelection="multiple"
                  onCellClicked={cellClickedListener}
                  paginationAutoPageSize="true"
                  paginationPageSize="10"
                  pagination="true"
                  // defaultColDef={defaultColDef}
                  headerColor="ddw-primary"
                  gridOptions={gridOptions}
                />
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
            <Modal
        isOpen={show}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Confirm Folio Settle</h1>
          {show &&  <>
            <h6>Folio No: <b>{active}</b></h6>
            <h6>Folio Amount : <b>{Bal}</b></h6>
            <h6>Payment : <b>{SelectedLabel}</b></h6>
            {/* <h6>Unit Price :<b>{defaultPrice}</b></h6> */}
            <h6>Supplements : <b>{data.Supplements}</b></h6>
            <h6>Reference : <b>{data.reference}</b></h6>
            {/* <h6>CGST: <b>{Amount['cgstAmt']}</b></h6> */}
            {/* <h6>SGST: <b>{Amount['sgstAmt']}</b></h6> */}
            {/* <h6>Total: <b>{Amount['totalAmount']}</b></h6> */}
            

          </>}
            <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' onClick={()=>{
                if(AdvanceSettleFlag==1){
                  AdvanceFolioSettle(1,active)
                }else{
                  SettleFolio(1,active)
                }
                }}>
                Confirm
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                  setShow(false)
                setPostPayments(false)           
                   }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>
      <Modal
        isOpen={ConfirmCheckOut}
        toggle={() => setConfirmCheckOut(!ConfirmCheckOut)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent'></ModalHeader>
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
                          setConfirmCheckOut(false)
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
                                      setCheckOutSharer(!CheckOutSharer)
                                    }}
                                    
                                /><b>CheckOut All Sharers</b></td></tr>}
                 </table>}
            
            <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' onClick={()=>{CheckOut()}}>
                Confirm
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                  {FolioHasTrxn && 
                  // setTimeout(()=>{navigate('/dashboard/testFrontDesk')
                  // const newTab = window.open('about:blank', '_blank');
                  //  newTab.location.href = '/dashboard/testFrontDesk/BillTemplate'
                  // },1000)
                  getFinalInvoice(active)
                  // setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')
                  // const newTab = window.open('about:blank', '_blank');
                  //  newTab.location.href = InvURL
                  // },1000)
                  
                  
                
                } // Replace '/new-page' with the actual URL you want to open in the new tab
                   {!FolioHasTrxn && setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},100) }

                setPostPayments(false)           
                setConfirmCheckOut(!ConfirmCheckOut)  
                // setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},100)   
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>
          {/*Post folio Allowance*/}
<Modal isOpen={PostFolioAllowance} toggle={() => setPostFolioAllowance(!PostFolioAllowance)} className='modal-dialog-centered modal-lg' onClosed={onDiscard2}>
                      <ModalHeader toggle={() => setPostFolioAllowance(!PostFolioAllowance)}>Allowance for Folio {active}</ModalHeader>
                          <ModalBody>
                          
                              {/* <Fragment>
                                  <Nav tabs className='tab'>
                                     {getButtonsUsingForLoop(FolioCount)}
                              
                                  </Nav>
                              </Fragment> */}
                      <Form onSubmit={handleSubmit(ConfirmPostAllowance)}>
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
             {/* <Col md='4' sm='12' className='mb-1'>
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
          </Col>  */}
                    <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="TransactionAmount">
            Folio Balance
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
              
                
                name="TransactionAmount"
                control={control}
                render={({ field }) => (
                  <Cleave
                  disabled={true}
                    {...field}
                    value={folioBalance}
                    // onChange={checkisCode}
                    id="quantity"
                    pattern="[0-9]*" title="Only Numbers Allowed" required
                    // placeholder="Enter Store ID"
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.TransactionAmount === null,
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          {/* <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="TransactionAmountWithTax">
            Amount With Tax
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
              
                
                name="TransactionAmountWithTax"
                control={control}
                render={({ field }) => (
                  <Cleave
                    {...field}
                    value={TrnxSelected.total}
                    // onChange={checkisCode}
                    id="quantity"
                    pattern="[0-9]*" title="Only Numbers Allowed" required
                    // placeholder="Enter Store ID"
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.TransactionAmountWithTax === null,
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col> */}
                                        {/* <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Folio">
            Allowance Type
            </Label>
            <Controller
              id="Folio"
              control={control}
              name="Folio"
              render={({ field }) => (
                <Select
                // required
                  isClearable
                  options={FolioAllowanceType}
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
 <Label className="form-label" for="type">
 type
 </Label>
 <Controller
 id='type'
 control={control}
 name='type'
 render={({ field }) => (
 <Select
 required
 name="type"
 className="react-select"
 options={FolioAllowanceType}
 classNamePrefix='select'
 theme={selectThemeColors}
 // className={classnames('react-select', { 'is-invalid': data !== null && data.type === null })}
 
 isClearable
 onChange={handleDropdownChange}
 
 />
 )}
 />
 </div>
 </Col>
          <Col className='name'>
                <div className='demo-inline-spacing'>
                  <div className='form-check'>

                    {/* Amount */}
                    {/* <Label className='form-check-label' for='ex1-active'>
                      <Input type="radio" name='ex1' value="Amount" checked={selectedOption ==='Amount'} onChange={handleRadioChange} />
                      Amount
                    </Label>

                    <br></br>
                    <br></br> */}

                    {/* Percentage */}
                    <Label className='form-check-label'>
                      <Input  type="radio" name='ex1' value="Percentage" checked={true}  onChange={handleRadioChange} />
                      Percentage
                    </Label>
                  </div>
                </div>
              </Col>
            {<Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Allowance">
            Percentage
            </Label>
            <InputGroup className="input-group-merge">
              {/* <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && data.IsActive === null,
                })}
              ></InputGroupText> */}
              <Controller
                name="Allowance"
                control={control}
                render={({ field }) => (
                  <Cleave
                    {...field}
                    // value={defaultAmount}
                    onChange={UpdateAllowanceAmt}
                    pattern="[0-9]*" title="Only Numbers Allowed" required
                    id="Allowance"
                    placeholder={'Enter Percentage'}
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.Allowance === null,
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>}
          {BalanceAmt!='' && <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="SelectedBalance">
            Selected group balance
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
               
                name="SelectedBalance"
                control={control}
                
                render={({ field }) => (
                  <Cleave
                  disabled={true}
                  
                  id="SelectedBalance"
                  pattern="[0-9]*" title="Only Numbers Allowed"
                  required
                  // placeholder="Enter Items"
                    {...field}
                    value={BalanceAmt}
                    className={classnames("form-control", {
                      "is-invalid":
                        data !== null && (data.SelectedBalance === null || !data.SelectedBalance.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>}
          <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="AllowanceAmount">
            Allowance Amount
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
               
                name="AllowanceAmount"
                control={control}
                
                render={({ field }) => (
                  <Cleave
                  disabled={true}
                  id="AllowanceAmount"
                  pattern="[0-9]*" title="Only Numbers Allowed"
                  required
                  // placeholder="Enter Items"
                    {...field}
                    value={AllowanceAmount}
                    className={classnames("form-control", {
                      "is-invalid":
                        data !== null && (data.AllowanceAmount === null || !data.AllowanceAmount)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          {/* <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="BalanceAfter">
            Folio Balance after Allowance
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
                
                name="BalanceAfter"
                control={control}
                
                render={({ field }) => (
                  <Cleave
                  disabled={true}
                  id="BalanceAfter"
                  pattern="[0-9]*" title="Only Numbers Allowed"
                  // required
                  // placeholder="Enter Items"
                    {...field}
                    value={folioAllowance}
                    className={classnames("form-control", {
                      "is-invalid":
                        data !== null && (data.BalanceAfter === null || !data.BalanceAfter.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col> */}

          <Col md='4' sm='12' className='mb-1'>
       
       <Label className="form-label">
       Reason Code
       <Input required type="text" name='TransactionCode' value={ReasonCode} onClick={fetchxReasonCodeData}/>
       </Label>
       </Col>
                 {/* <Col md='4' sm='8'>
            <div className='mb-1'>
              <Label className='form-label' for='TransactionCode'>
              Reason Code
              </Label>
              <Controller
                // defaultValue={DefaultAgent[0]}
                id='TransactionCode'
                control={control}
                name='TransactionCode'
                render={({ field }) => (
                  <Input
                    // required
                    onClick={() => fetchxReasonCodeData}
                    value={ReasonCode}
                  />
                )}
              />
            </div>
          </Col> */}
{ReloadReasonRemarks && <Col md='4' sm='12' className='mb-1'>
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
         
          
          
         <p className='mb-1' style={{color:'#FF0000'}}>Alert : Allowanced Transactions will not be considered</p>

          <br></br>
            <div>
              {/* <Button className='me-1' style={{align:'right'}} color='primary' type='submit'>
                Post Charges
              </Button> */}
              <Button className="me-1" color="primary" type="submit" >
              Add Allowance
            </Button>
            <Button className="me-1" color="primary" type="submit" onClick={()=>{
              setPostFolioAllowance(!PostFolioAllowance)
              }} >
              Cancel
            </Button>
            </div>
            </Row>
          </Form>
                          </ModalBody>
            </Modal> 

                  {/* Confirm Folio ALlowance */}
      <Modal
        isOpen={ConfirmAllowance}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Preview Allowance</h1>
          {ConfirmAllowance &&  <>
            <h6>Do you want to post Allowance for folio {active}</h6>
            {/* {data.Folio!=undefined && <h6>Folio No: <b>{data.Folio.value}</b></h6>} */}

          </>}
            <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' onClick={AddAllowance}>
               Confirm
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                // window.location.reload()
                setConfirmAllowance(!ConfirmAllowance)
                // setPostFolioAllowance(!PostFolioAllowance)
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal> 


      {/* Merge Folio */}
      <Modal isOpen={showMergeFolio} toggle={() => setshowMergeFolio(!showMergeFolio)} className='modal-dialog-centered' onClosed={onDiscard2}>
                      <ModalHeader toggle={() => setshowMergeFolio(!showMergeFolio)}>Merge Folio {active} to</ModalHeader>
                          <ModalBody>
                          
                              <Fragment>
                                  <Nav tabs className='tab'>
                                     {/* {getButtonsUsingForLoop(FolioCount)} */}
                              
                                  </Nav>
                              </Fragment>
                      <Form onSubmit={handleSubmit(MergeFolio)}>
                              <Row>  
                          
                {/* <Col md='4' sm='12' className='mb-1'> */}
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
                required
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
          {/* </Col>  */}
   
            <br></br> 
            <div>
              <Button className="me-1" color="primary" type="submit" >
              Merge
            </Button>
            <Button className="me-1" color="primary" type="submit" onClick={()=>{setshowMergeFolio(!showMergeFolio)}} >
              Cancel
            </Button>
            </div>
            </Row>
          </Form>
                          </ModalBody>
            </Modal> 

            {/* Split Folio */}

            <Modal
        isOpen={showSplitFolio}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent' toggle={() => setshowSplitFolio(!showSplitFolio)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Split Folio</h1>
          <h3>Select Group to Split</h3>
          {showSplitFolio &&  <>
            {/*              
            <h6>Guest Name : <b>{ReservationData['name']}</b></h6> 
            <h6> Ph No. :<b>{ReservationData['phoneNumber']}</b></h6>
            <h6>Room No. : <b>{sessionStorage.getItem('RoomNo')}</b></h6> */}

            <table >
                <thead >
                    <tr></tr>
                </thead>
                <tbody>
               
                    {FolioAllowanceType!=undefined && FolioAllowanceType.slice(0, FolioAllowanceType.length - 1).map((row, index) => (
                      
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
                            <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"itemID" + index}>{row.label}</td>
                      
                            {/* <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"itemName" + index}>{row.itemName}</td>
                            <td style={{ margin: '6px 0', paddingLeft: '10px' }}  ><InputNumber disabled="true" id={"qty" + index} value={tableData[index]['qty']}  defaultValue={tableData[index]['qty']} upHandler={<Plus onClick={() => { handlePlusClick1(index) }} />} downHandler={<Minus onClick={() => { handleMinusClick1(index) }} />} /></td>
                            <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"price" + index}>{row.amount}</td> */}

                        </tr>

                    ))}

                        {/* <td style={{ margin: '6px 0', paddingLeft: '10px' }}  id={"All"}>
                                <Input
                                    type='checkbox'
                                    id='select-all'
                                    label=''
                                    checked={selectedRows.length==FolioOptions.length && !!selectedRows.length}
                                    onChange={() => handleSelectAll()}
                                    
                                />All</td> */}

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
              <Button type='submit' className='me-1' color='primary' onClick={ConfirmSplitFolio}>
               Confirm
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                // window.location.reload()
                setshowSplitFolio(!showSplitFolio)
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>
      <Modal
        isOpen={showErrorMsg}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        
        <ModalHeader className='bg-transparent' toggle={() => {
                setshowErrorMsg(!showErrorMsg);
              }}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          {/* <h3 className='text-center mb-1'>{errorMsg}</h3> */}
          <h3 className='text-center mb-1'>{showErrorMsg}</h3>
          
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

      {/* Select Reason */}
      {ReasonSelect && 
            (
              <div>
                  <Modal isOpen={ReasonSelect} toggle={() => setReasonSelect(!ReasonSelect)} className='modal-dialog-centered modal-lg' onClosed={() => setReasonSelect(!ReasonSelect)}>
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

                              {/* <div className="ag-theme-alpine" style={{ height: 520 }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={rowData}
                  columnDefs={columnDefs}
                  animateRows={true}
                  rowSelection="multiple"
                  onCellClicked={cellClickedListener}
                  paginationAutoPageSize="true"
                  paginationPageSize="10"
                  pagination="true"
                  defaultColDef={defaultColDef}
                  headerColor="ddw-primary"
                  gridOptions={gridOptions}
                />
              </div> */}
                          </ModalBody>
                  </Modal>
              </div>
            )
            }

{/* ///////////////// Post Charges ////////////////////////////// */}
<Modal isOpen={PostCharges} toggle={() => setPostCharges(!PostCharges)} className='modal-dialog-centered modal-lg' onClosed={()=>{PostChargesReset()}}>
                      <ModalHeader toggle={() => setPostCharges(!PostCharges)}>Post Charges to Room No. {sessionStorage.getItem('RoomNo')}</ModalHeader>
                          <ModalBody>
                              <div>
                              <Fragment>
        <Nav tabs className='tab'>
     {/* {getButtonsUsingForLoop(FolioCount)} */}
     
     </Nav>
     </Fragment>
                        <Form onSubmit={handleSubmit(PostChargesSubmit)}>
                              <Row>  
                               
                             {reload && parseInt(active)==0 && <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Folio">
            Select Folio
            </Label>
            <Controller
              id="Folio"
              control={control}
              defaultValue={FolioOptions[0]}
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
          </Col> }
          {reload && parseInt(active)!=0 && <Col md='4' sm='12' className='mb-1'>
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
          </Col> }
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
                    disabled={TransactionCode==''}
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
          <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Additionaldesc">
            Additional description
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
                id="Additionaldesc"
                name="Additionaldesc"
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
            <Button className="me-1" color="primary" type="submit" onClick={()=>{PostChargesReset()}} >
              Cancel
            </Button>
            </div>
            </Row>
          </Form>
                              </div>
                            
                          </ModalBody>
            </Modal>  


            {/* ///////////////////////// Post Payments /////////////////////////////////////// */}


            <Modal isOpen={PostTrxnPayment} toggle={() => setPostTrxnPayment(!PostTrxnPayment)} className='modal-dialog-centered modal-lg' onClosed={()=>{PostPaymentsReset()}}>
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
               {reload && parseInt(active)===0 && <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Folio">
            Select Folio
            </Label>
            <Controller
              id="Folio"
              control={control}
              defaultValue={FolioOptions[0]}
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
          </Col> }
          {reload && parseInt(active)!=0 && <Col md='4' sm='12' className='mb-1'>
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
          </Col> }
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
            <Button className="me-1" color="primary" type="submit" onClick={()=>{PostPaymentsReset()}} >
              Cancel
            </Button>
            </div>
            </Row>
          </Form>
                          </ModalBody>
            </Modal>  
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
            {data.Folio!=undefined && active==0 && <h6>Folio No: <b>{data.Folio.value}</b></h6>}
            {defaultopt.length!=0 && data.Folio==undefined && active!=0 && <h6>Folio No: <b>{defaultopt[0]['value']}</b></h6>}
            
            <h6>Guest Name : <b>{ReservationData['firstName']}</b></h6> 
            <h6> Ph No. :<b>{ReservationData['phoneNumber']}</b></h6>
            <h6>Room No. : <b>{sessionStorage.getItem('RoomNo')}</b></h6>
            {/* <h6>Transaction Code : <b>{TransactionCode}</b></h6> */}
            <h6>Payment Mode : <b>{data.Payment.label}</b></h6>
            <h6>Payment Amount : <b>{data.Amount}</b></h6>
            <h6>Supplements : <b>{data.Supplements}</b></h6>
            <h6>Reference : <b>{data.reference}</b></h6>
            

          </>}
            <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' disabled={EnableButton} onClick={AddPayment}>
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

      <Modal
        isOpen={PostChargesConfirm}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Preview Transaction</h1>
          {PostChargesConfirm &&  <>
            {data.Folio!=undefined && active==0 && <h6>Folio No: <b>{data.Folio.value}</b></h6>}
            {defaultopt.length!=0 && data.Folio==undefined && active!=0 && <h6>Folio No: <b>{defaultopt[0]['value']}</b></h6>}
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
                setPostChargesConfirm(!PostChargesConfirm)
                setPostCharges(!PostCharges)
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>

      {/* /////////////////////////// Trxn Select //////////////////////////////// */}

      {showDropdown && 
            (
              <div>
                  <Modal isOpen={TransactionCodeSelect} toggle={() => setTransactionCodeSelect(false)} className='modal-dialog-centered modal-lg' onClosed={()=>{ setTransactionCodeSelect(false)}}>
                      <ModalHeader toggle={() => setTransactionCodeSelect(false)}>Search and Select Code</ModalHeader>
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
                                    onCellClicked={TrxnClickedListener}
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
              <Button type='submit' className='me-1' color='primary'  href= {PaymentReceiptURL} target='_blank' 
              // {/* Local server */}
              // <Button type='submit' className='me-1' color='primary' target="_blank" href= {'http://122.166.2.21//PMS_Invoice/PaymentReceipt/PaymentReceipt_'+sessionStorage.getItem('TransactionID')+'.pdf'} 
              
              onClick={() => {
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

      <Modal isOpen={ShowDummyInvPDF} toggle={() => setShowDummyInvPDF(!ShowDummyInvPDF)} style={{height:'200px'}} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowDummyInvPDF(!ShowDummyInvPDF)}>PMS Dummy Invoice</ModalHeader>
       
          <iframe style={{ height: '85vh' }} src={DummyInvURL}> </iframe>
      </Modal>


      <Modal isOpen={ShowInvPDF} toggle={() => setShowInvPDF(!ShowInvPDF)} style={{height:'200px'}} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowInvPDF(!ShowInvPDF)}>PMS Invoice</ModalHeader>
       
          <iframe style={{ height: '85vh' }} src={InvURL}> </iframe>
      </Modal>

      <Modal
        isOpen={ConfirmAdvanceSettle}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        
        <ModalHeader className='bg-transparent' toggle={() => {
                setConfirmAdvanceSettle(!ConfirmAdvanceSettle);
              }}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          {/* <h3 className='text-center mb-1'>{errorMsg}</h3> */}
          <h3 className='text-center mb-1'>Departure date is not today, Do you want to settle folio?</h3>
          
          
            {/* <h6>Room No : {TrnxSelected.description}</h6>
            <h6>Booking ID : {TrnxSelected.total}</h6>
            <h6>Guest Name : {TrnxSelected.date}</h6> */}

            {/* {data.Folio!=undefined && <h6>Folio No: <b>{data.Folio.value}</b></h6>} */}
          {/* <h4 className='text-center mb-1'>Post daily details</h4> */}
            
            <Col md='12' sm='12' className='mb-1'>
                    <Label className='form-check-label' for='ex1-active'>
                      <Input type="radio" name='ex1' value="Tonight" checked={SettlementType ==='Tonight'} onChange={handleSettlementType} />
                      Tonight Charges
                    </Label>
                    </Col>
                    {/* <br></br> */}
                    {/* <br></br> */}

                    {/* Percentage */}
                    <Col md='12' sm='12' className='mb-1'>
                    <Label className='form-check-label'>
                      <Input type="radio" name='ex1' value="Full" checked={SettlementType ==='Full'}  onChange={handleSettlementType} />
                      Full Charges
                    </Label>
                    </Col>
                    <Col md='12' sm='12' className='mb-1'>
                    <Label className='form-check-label' for='ex1-active'>
                      <Input type="radio" name='ex1' value="No Charges" checked={SettlementType ==='No Charges'} onChange={handleSettlementType} />
                      No Charges
                    </Label>
                    </Col>
            <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' onClick={()=>{AdvanceSettleConfirm()}}>
               Confirm
              </Button>
              <Button
               color='primary'
                onClick={() => {
                // window.location.reload()
                setConfirmAdvanceSettle(!ConfirmAdvanceSettle)
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>  


               
{/* Post paidouts          */}

<Modal isOpen={PostPaidouts} toggle={() => setPostPaidouts(!PostPaidouts)} className='modal-dialog-centered modal-lg' onClosed={()=>{setPostPaidouts(false)}}>
                      <ModalHeader toggle={() => setPostPaidouts(!PostPaidouts)}>Post PaidOuts to Room No. {sessionStorage.getItem('RoomNo')}</ModalHeader>
                          <ModalBody>
                              <div>
                              <Fragment>
        <Nav tabs className='tab'>
     {/* {getButtonsUsingForLoop(FolioCount)} */}
     
     </Nav>
     </Fragment>
                        <Form onSubmit={handleSubmit(ConfirmPostPaidOuts)}>
                              <Row>  
                              <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Folio">
            Select Folio
            </Label>
            <Controller
              id="Folio"
              control={control}
              defaultValue={FolioOptions[0]}
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
                <Input disabled={true} type="text" name='TransactionCode' value={'9014'} />
                </Label>
                </Col>
                <Col md='4' sm='12' className='mb-1'>
                <Label className="form-label">
                Description
                <Input disabled={true} type="text" name='Description' value={'Paid Outs'}/>
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
                    // onChange={checkisCode}
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
            <Button className="me-1" color="primary" onClick={()=>{setPostPaidouts(false)}} >
              Cancel
            </Button>
            </div>
            </Row>
          </Form>
                              </div>
                              
                          </ModalBody>
            </Modal> 


            {/* Confirm Paidouts */}
      <Modal
        isOpen={ConfirmPaidout}
        toggle={() => setConfirmPaidout(!ConfirmPaidout)}
        className='modal-dialog-centered'
      >
        <ModalHeader toggle={() => setConfirmPaidout(!ConfirmPaidout)}className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Preview PaidOuts</h1>
         
          {ConfirmPaidout &&  <>
            {data.Folio!=undefined && active==0 && <h6>Folio No: <b>{data.Folio.value}</b></h6>}
            <h6>Guest Name : <b>{ReservationData['firstName']}</b></h6> 
            <h6> Ph No. :<b>{ReservationData['phoneNumber']}</b></h6>
            <h6>Room No. : <b>{sessionStorage.getItem('RoomNo')}</b></h6>
            {/* <h6>Transaction Code : <b>{TransactionCode}</b></h6> */}
            <h6>Description : <b>{'Paidouts'}</b></h6>
            <h6>Unit Price :<b>{defaultPrice}</b></h6>
            <h6>Supplements : <b>{data.Supplements}</b></h6>
            <h6>Reference : <b>{data.reference}</b></h6>
            
            

          </>}
            <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' disabled={EnableButton} onClick={AddPaidout}>
               Confirm
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                // window.location.reload()
                setConfirmPaidout(false)
                // setPostTrxnPayment(!PostTrxnPayment)
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>

                  {/* /////////////// PaidOut Receipt //////////////////////// */}
                  <Modal
        isOpen={showPaidOutReceipt}
        toggle={() => setshowPaidOutReceipt(!showPaidOutReceipt)}
        className='modal-dialog-centered'
      >
        <ModalHeader toggle={() => setshowPaidOutReceipt(!showPaidOutReceipt)} className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h3 className='text-center mb-1'>Do you want to view the PaidOut Receipt?</h3>

            <Row>
            <Col className='text-center mt-1' xs={12}>
              {/* Live server */}
              <Button type='submit' className='me-1' color='primary'  href= {PaidoutReceiptURL} target='_blank' 
              // {/* Local server */}
              // <Button type='submit' className='me-1' color='primary' target="_blank" href= {'http://122.166.2.21//PMS_Invoice/PaidOutReceipt/PaidOutReceipt_'+sessionStorage.getItem('TransactionID')+'.pdf'} 
              
              onClick={() => {
                ReloadContent()
                setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},10)
                setshowPaidOutReceipt(!showPaidOutReceipt)
              
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
                setshowPaidOutReceipt(!showPaidOutReceipt)
              
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>
                      {/* /////////////// Invoice //////////////////////// */}
                      <Modal
        isOpen={CnfViewInvoice}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h3 className='text-center mb-1'>Do you want to view the Invoice?</h3>

            <Row>
            <Col className='text-center mt-1' xs={12}>
              {/* Live server */}
              <Button type='submit' className='me-1' color='primary'  href= {InvURL} target='_blank' 
              // {/* Local server */}
              // <Button type='submit' className='me-1' color='primary' target="_blank" href= {'http://122.166.2.21//PMS_Invoice/PaymentReceipt/PaymentReceipt_'+sessionStorage.getItem('TransactionID')+'.pdf'} 
              
              onClick={() => {
                ReloadContent()
                setTimeout(()=>{navigate('/dashboard/OnHoldFolioBilling')},10)
                setCnfViewInvoice(!CnfViewInvoice)
              
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
                setCnfViewInvoice(!CnfViewInvoice)
              
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>
      </Card>
    </div>

  )
}

export default FolioTab
