import { DateTime } from 'luxon';
// ** React Imports
import { useState } from "react";
import { ButtonDropdown, } from 'reactstrap'
// import axios from "axios";
// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check, XOctagon } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle,UncontrolledDropdown } from 'reactstrap'
import { MoreVertical, Edit, Trash } from 'react-feather'

// import App from "./waitListDataTable";
import Moment from 'moment';

// ** Reactstrap Imports
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap'

// ** Custom Components
import Avatar from "@components/avatar";
import API_URL from "../../../../config";

// ** Utils
import { selectThemeColors } from "@utils";
let is_test = false
// ** Reactstrap Imports
import {
  Input,
  Card,
  Form,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  InputGroup,
  InputGroupText,
  Row,
  Col,Modal,ModalBody,
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
import { event } from "jquery";

import { useNavigate } from 'react-router-dom'
// let TrxnIDArr = [];

const defaultValues1 = {
  Price: '',
  quantity: 1,
  Supplements: '',
  reference:''
}
// let roomNo =''
// let bookingID =''
// let FolioOptions =[]
let guestNameOptions =[]
let id=1;
let reservationID ={}
let roomNoarr1
const ValidationThirdPartyComponents = ({ folio, folioIsSettled,reservationStatus }) => {

  console.log(folio, folioIsSettled,reservationStatus)
  const navigate = useNavigate()
  const isRowSelectable = useMemo(() => {
    return (params) => {
      return params.data.hotelID ? !undefined : false
    };
  }, []);
    // console.log(folio)
  const [rowData, setRowData] = useState();
  const [PostAllowance,setPostAllowance] = useState(false)
  const { reset, handleSubmit, control } = useForm({ defaultValues1 })
  const [data, setData] = useState(null)
  const [TrnxSelected,setTrnxSelected] = useState('')
  const [selectedOption,setselectedOption] = useState('')
  const [Placeholder,setPlaceholder] = useState('')
  const [AllowanceAmount,setAllowanceAmount] = useState('')
  // const [SplitAmount,setSplitAmount] = useState('')
  const [AllowanceWithTax,setAllowanceWithTax] = useState('')
  const [CancelTrnx,setCancelTrnx] = useState('')
  const [TransferTrnx,setTransferTrnx] = useState(false)
  const [SameGuestForm,setSameGuestForm] = useState(false)
  const [OthersForm,setOthersForm] =  useState(false)
  const [roomNo,setroomNo] = useState('')
  const [roomNoOptions,setroomNoOptions] = useState([{}])
  const [bookingID,setbookingID] = useState('')
  const [guestBalance,setguestBalance] = useState('')
  const [FolioOptions,setFolioOptions]  = useState()
  const [ReservationID,setReservationID] = useState()
  const [ConfirmTransferTrnx,setConfirmTransferTrnx] = useState(false)
  const [FolioNumber,setFolioNumber] = useState()
  const [errorMsg,seterrorMsg] = useState('')
  const [showErrorMsg,setshowErrorMsg] = useState(false)
  const [ShowSplitTrnx,setShowSplitTrnx] = useState(false)
  const [ReasonSelect, setReasonSelect] = useState(false)
  const [ReasonCode,setReasonCode] =  useState()
  const [reasonCodeData,setreasonCodeData] = useState('')
  const [ReasonID,setReasonID] = useState('')
  const [ChildData,setChildData] = useState()
  const [TrxnIDArr,setTrxnIDArr] = useState([])
  const [reloadGuest, setreloadGuest] = useState(true)
  const [defaultGuest,setdefaultGuest] = useState([])
  const gridRef1 = useRef()
  const [ReasonRemarks,setReasonRemarks] = useState('')
  const [ReloadReasonRemarks,setReloadReasonRemarks] = useState(true)
  const [ShowPOSInv,setShowPOSInv] = useState('')
  const [POSInvURL,setPOSInvURL] = useState('')


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
const getRowStyle = params => {
if (!params.data.hasOwnProperty('id')) {
    return { background: 'lightgrey' };
  }

  if (params.data && params.data.is_cancelled === 1) {
    return { background: '#3598db' };
  }
};


// ** State
const [open, setOpen] = useState('0')

const toggle = id => {
  open === id ? setOpen() : setOpen(id)
}

  const gridRef = useRef();
//function to fetchx the value of radio button
function handleRadioChange(event) {
  
  setselectedOption(event.target.value)
  sessionStorage.setItem('AllowanceType',event.target.value)
  // console.log('============================================')
  // console.log(document.getElementById('Allowance').value)

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

const [dropdownOpen, setDropdownOpen] = useState(false)

const toggleDropdown = () => {
  setDropdownOpen(!dropdownOpen)
}
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

// pos_bill_number
  const [columnDefs, setColumnDefs] = useState([
    {headerName:'' , field:'',checkboxSelection: true, headerCheckboxSelection: true,maxWidth:40},
    {headerName:'Description' , field:'description',maxWidth: 500},
    {headerName:'BaseAmt' , field:'base_amount',maxWidth: 160},
    {headerName:'Total' , field:'total',maxWidth: 120},
    {headerName: 'FolioNo',field: 'folioNumber',suppressSizeToFit: true,maxWidth: 100, },

    {headerName: 'remarks',field: 'remarks',suppressSizeToFit: true,maxWidth: 200},
    {headerName: 'supplement',field: 'supplement',maxWidth: 130},
    
        {
          headerName:'Actions' , 
          field:'extras',
          editable:true,
          cellEditorParams: {
            values: ['Select','Post Allowance', 'Transfer Transactions', 'Split Transaction', 'Cancel Transaction'] // Provide the options here

            // if(!params.data.hasOwnProperty('id')){
            //   values :[]
            // }else{
            //   values :[]
            // }
           
          },defaultValue: 'Select',
          cellEditor: 'agSelectCellEditor',
          cellRenderer: (event) => {
          return (event.data.hasOwnProperty('id') ?
    <Select
                      name="roomNo"
                      className="react-select"
                      options={roomNoOptions}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      isClearable                      
                      /> : ' ' 
          )
        }
      },
      {headerName: 'Date',field: 'date',cellRenderer: (params) => {  
        // Ensure the arrivalDate field exists in the row data        
        if (params.data && params.data.date) {          
            // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"    
            const formattedDate = Moment(params.data.date).format("DD-MM-YYYY");                
            // const formattedDate = formatToIST(params.data.date);      
                
            return formattedDate;        
        } else {          
            return ""; // Handle cases where the data is missing or invalid        
        }      
    },maxWidth: 150},
    {headerName: 'POS Bill No.',field: 'pos_bill_number',maxWidth: 150,
    cellRenderer: (params) => {
      // Get the data for the cell
      // params.preventDefault(); // Prevent the default behavior
      return (<a style={{color:'#3366CC'}} onClick={()=>{getPOSInvoice(params.data) 
                                  }}>{params.data.pos_bill_number}</a>)
}
     
  },
      {headerName: 'createdAt',field: 'createdAt',cellRenderer: (params) => {  
        // Ensure the arrivalDate field exists in the row data        
        if (params.data && params.data.createdAt) {          
          // Convert to IST (Indian Standard Time)
          const date = new Date(params.data.createdAt);
          const formattedDate = date.toLocaleString("en-IN", { 
              timeZone: "Asia/Kolkata", 
              day: "2-digit", 
              month: "2-digit", 
              year: "numeric", 
              hour: "2-digit", 
              minute: "2-digit", 
              second: "2-digit",
              hour12: false  // Use 24-hour format
          }).replace(/\//g, '-'); // Replace '/' with '-'
      
          return formattedDate;        
      } else {          
          return ""; // Handle cases where the data is missing or invalid        
      }
           }},
      {headerName: 'created By',field: 'createdUser',maxWidth: 150},

      {headerName: 'transactionType',field: 'transaction_type',maxWidth: 150},

  ]);
  const gridApiRef = useRef(null);

  const gridOptions = {
    defaultColDef: {
      flex: 1,
      minWidth: 150,
      filter: true,
      sortable: true,
      // floatingFilter: true,
           

    },

  };

  const getPOSInvoice = (data)=>{
      //Live server
  // let url = API_URL+'/getinvoices/POSInvoice_'+data.hotelID+'_'+(String(data.pos_bill_number).replaceAll("/","_").replaceAll("-",""))+'.pdf'
  //     // let billNo = data.billNoDisplay.replaceAll("/","_").replaceAll("-","")
  //     //Local server
  //     // let url = 'http://122.166.2.21//POS_Invoice/POSInvoice_'+data.hotelID+'_'+(String(data.pos_bill_number).replaceAll("/","_").replaceAll("-",""))+'.pdf'
  //     console.log(url)
  //     setPOSInvURL(url)
  //     setShowPOSInv(true)
  if(!is_test){
  fetchx(API_URL + "/gets3DocumentIDPMS", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hotelID: 1,
      DocName:'POSInvoice',
      transactionID:'',
      reservationID:'',
      billNo:(String(data.pos_bill_number).replaceAll("/","_").replaceAll("-",""))
        })
  }).then(result => result.json())
  .then(resp => {
      if(resp.statusCode==200){
        setPOSInvURL(API_URL+'/images/'+resp['data'])
        setShowPOSInv(true)
      }
      
    }).catch((error) => {
    })
  }else{
     let url = API_URL+'/imagepaths/POS_Invoice/POSInvoice_'+data.hotelID+'_'+(String(data.pos_bill_number).replaceAll("/","_").replaceAll("-",""))+'.pdf'
     setPOSInvURL(url)
     setShowPOSInv(true)
    }
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

  const PostAllowanceReset = () => {
    setPostAllowance(false)
    setReasonCode()
    setselectedOption('')
    
    reset({
      TransactionAmount: '',
      AllowanceAmount:'',
      Allowance:'',
      AllowanceWithTax:'',
      reasonRemarks:'',
      

    })
  }
  const CancelTransactionReset = () => {
    setCancelTrnx(false)
    setReasonCode()
    
    reset({
      reasonRemarks:'',
      

    })
  }
  
  const TransferTransactionReset = () => {
    setSameGuestForm(false)
    setselectedOption('')
    setTransferTrnx(false)
    setTrxnIDArr([])
    setFolioNumber('')
    setReservationID('')
    setroomNo('')
    setdefaultGuest([])
    setbookingID('')
    setroomNoOptions([])
    setguestBalance('')
    setConfirmTransferTrnx(false)
    reset({
      Folio:'',
      

    })
  }
  const onSelectionChanged = (event) => {
    
    let allRooms = event.api.getSelectedRows()
    setTrnxSelected(allRooms[0])
    let IDArr = []
    if (allRooms.length != 0) {
     
      allRooms.forEach(element => {
                  IDArr.push(element.id)
                  // roomIDStatus.push(element.id)

          
      });
      setTrxnIDArr(IDArr)
     

  }
  else {

      allRooms.forEach(element => {
        IDArr.push(element.id)
         
      });
  }
  if (allRooms.length === 0) {
    setTrxnIDArr([])

}

  }
  const onDiscard = () => {
    setReasonSelect(!ReasonSelect)
    }
    const onCellValueChanged = useCallback( event => {

      setTrnxSelected(event.data)
      // setTrxnIDArr(event.data.id)
      // sharath
      if (event.colDef.field === 'extras' && folio!=0) {
        const updatedValue = event.data.extras;
        if(updatedValue == 'Cancel Transaction'){
          setCancelTrnx(!CancelTrnx)
          sessionStorage.setItem('reasonGroupID',5)
        }else if(updatedValue == 'Split Transaction'){
          setShowSplitTrnx(true)
          
        }else if(updatedValue == 'Transfer Transactions'){
         
                    
              setTrnxSelected(event.data)
              setTrxnIDArr(event.data.id)
              setTransferTrnx(true)
            
          
          
        }else if(event.data.transaction_type== 'Payments' && updatedValue == 'Post Allowance'){
          seterrorMsg("Allowance cannot be posted for payments")
          setshowErrorMsg(!showErrorMsg)
        }else if(event.data.transaction_type== 'Allowance' && updatedValue == 'Post Allowance'){
          seterrorMsg("Allowance cannot be posted for Allowance")
          setshowErrorMsg(!showErrorMsg)
        }
        else if(event.data.transaction_type!= 'Payments' && updatedValue == 'Post Allowance'){
          if(event.data.transaction_type=='Bill'){
            setTrnxSelected(event.data)
            // setTrxnIDArr(event.data.id)
            setPostAllowance(!PostAllowance)
            sessionStorage.setItem('reasonGroupID',6)
          }

          
        }

        fetchx(API_URL + "/getTransactionOfReservationID", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelID: 1,
            reservationID: sessionStorage.getItem('reservationID'),
            folio:folio 
          })
        }).then(result => result.json())
        .then(rowData => {

            for(let i=0 ;i<rowData['data'].length;i++){
              rowData['data'][i]['Newtotal'] = rowData['data'][i]['total']
            }
            setRowData(rowData['data'])
          }).catch((error) => {
          })
        // setreload(false)
        // setTimeout(()=>{setreload(true),1000})
        
      }
     
      // sharath
    }, []);
    const expandParentRow = (data) => {
      setChildData([])

      // 
      fetchx(API_URL + "/getReservationTaxTrxn", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id:data.id,
            hotelID: 1,
          })
        }).then(result => result.json())
        .then(Data => {
            setChildData(Data['data'])
            const parentRowIndex = rowData.findIndex((row) => row.id === data.id);
            rowData[parentRowIndex]['total'] = rowData[parentRowIndex]['base_amount']
            if (parentRowIndex > -1) {
              const parentRow = rowData[parentRowIndex];
              if (!parentRow.expanded) {
                
                const childRows = [
                  { id: data.id + 0.1, name: 'Child 1' },
                  { id: data.id + 0.2, name: 'Child 2'},
                
                ];

                const updatedRowData = [...rowData];
                
      
                updatedRowData.splice(parentRowIndex + 1, 0, ...Data['data']);

                parentRow.expanded = true;
        
                setRowData(updatedRowData);
            
        
              }  else {
                // Remove child Rows
                parentRow.expanded = false;
                
                rowData[parentRowIndex]['total'] = rowData[parentRowIndex]['Newtotal']
        
                setRowData((prevRowData) => {
                  const updatedRowData = [...prevRowData];
                  const startRowIndex = parentRowIndex + 1;
                  const endRowIndex = startRowIndex + 2; // Assuming three child rows are present
                  updatedRowData.splice(startRowIndex, endRowIndex - startRowIndex);
                  return updatedRowData;
                });
                
              }
            }
            
          }).catch((error) => {
          })
      // const parentRowIndex = rowData.findIndex((row) => row.id === data.id);
      // if (parentRowIndex > -1) {
      //   const parentRow = rowData[parentRowIndex];
      //   if (!parentRow.expanded) {
          
      //     const childRows = [
      //       { id: data.id + 0.1, name: 'Child 1',folioNumber: 1 },
      //       { id: data.id + 0.2, name: 'Child 2',folioNumber: 1 },
          
      //     ];
      //     console.log('Child Rows=================')
      //     console.log(ChildData)
      //     console.log('rowData=================')
      //     console.log(rowData)
      //     const updatedRowData = [...rowData];
          

      //     updatedRowData.splice(parentRowIndex + 1, 0, ...ChildData);
      //     console.log('updatedRowData=================')
      //     console.log(updatedRowData)
      //     parentRow.expanded = true;
  
      //     setRowData(updatedRowData);
      
  
      //   }  else {
      //     // Remove child Rows
      //     parentRow.expanded = false;
  
      //     setRowData((prevRowData) => {
      //       const updatedRowData = [...prevRowData];
      //       const startRowIndex = parentRowIndex + 1;
      //       const endRowIndex = startRowIndex + 2; // Assuming three child rows are present
      //       updatedRowData.splice(startRowIndex, endRowIndex - startRowIndex);
      //       return updatedRowData;
      //     });
          
      //   }
      // }
    };
  const cellClickedListener = useCallback( event => {
    var column = event.column;
    var colDef = column.getColDef();
    var isEditable = colDef.editable;
    const colId = event.column.getId();

    // If the clicked cell is not the checkbox cell, prevent selection
    if (colId == '') {
      // console.log('Checknox clicked')
      // setTrxnIDArr([])
      // params.api.deselectNode(params.node);
    } 
    if (isEditable) {
      event.api.startEditingCell({
        rowIndex: event.rowIndex,
        colKey: colDef.field
      });
    }

  }, []);

  const reasonSelectListener = useCallback(event => {

    setReasonCode(event['data']['reasonCode'])
    setReasonRemarks(event['data']['description'])
    setReloadReasonRemarks(false)
    setTimeout(()=>{setReloadReasonRemarks(true)},10)
    setReasonID(event.data.id)


    setReasonSelect(!ReasonSelect)

  })

  //Search element
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef1.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    )
  }, [])


  useEffect(() => {

    const company = JSON.stringify({
        hotelID: 1,
        reservationID: sessionStorage.getItem('reservationID'),
        folio:folio 
      })
    fetchx(API_URL + "/getTransactionOfReservationID", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: company
        }).then(result => result.json())
        .then(rowData => {
           
            for(let i=0 ;i<rowData['data'].length;i++){
              rowData['data'][i]['Newtotal'] = rowData['data'][i]['total']
            }
            setRowData(rowData['data'])
          }).catch((error) => {
          })


          if(folio ==0 || folioIsSettled==1 || !((reservationStatus==='Checked In' || reservationStatus === 'Due Out') || reservationStatus== undefined)){
            setColumnDefs( [{headerName:'Description' , field:'description',maxWidth: 400},
            {headerName:'BaseAmt' , field:'base_amount',maxWidth: 120},
            {headerName:'Total' , field:'total',maxWidth: 120},
            {headerName: 'FolioNo',field: 'folioNumber',suppressSizeToFit: true,maxWidth: 100, },
        
            {headerName: 'remarks',field: 'remarks',suppressSizeToFit: true,maxWidth: 200},
            {headerName: 'supplement',field: 'supplement',maxWidth: 130},
              {headerName: 'Date',field: 'date',cellRenderer: (params) => {  
                // Ensure the arrivalDate field exists in the row data        
                if (params.data && params.data.date) {          
                    // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
                    const formattedDate = Moment(params.data.date).format("DD-MM-YYYY");          
                    // const formattedDate = formatToIST(params.data.date);          
                    return formattedDate;        
                } else {          
                    return ""; // Handle cases where the data is missing or invalid        
                }      },maxWidth: 150},
                {headerName: 'POS Bill No.',field: 'pos_bill_number',maxWidth: 150,
    cellRenderer: (params) => {
      // Get the data for the cell
      // params.preventDefault(); // Prevent the default behavior
      return (<a style={{color:'#3366CC'}} onClick={()=>{getPOSInvoice(params.data) 
                                  }}>{params.data.pos_bill_number}</a>)
}
     
  },
              {headerName: 'createdAt',field: 'createdAt',cellRenderer: (params) => {  
                // Ensure the arrivalDate field exists in the row data        
                if (params.data && params.data.createdAt) {          
                  // Convert to IST (Indian Standard Time)
                  const date = new Date(params.data.createdAt);
                  const formattedDate = date.toLocaleString("en-IN", { 
                      timeZone: "Asia/Kolkata", 
                      day: "2-digit", 
                      month: "2-digit", 
                      year: "numeric", 
                      hour: "2-digit", 
                      minute: "2-digit", 
                      second: "2-digit",
                      hour12: false  // Use 24-hour format
                  }).replace(/\//g, '-'); // Replace '/' with '-'
              
                  return formattedDate;        
              } else {          
                  return ""; // Handle cases where the data is missing or invalid        
              }
                   }},
      {headerName: 'created By',field: 'createdUser',maxWidth: 150},
                
              {headerName: 'transactionType',field: 'transaction_type',maxWidth: 150}])
          }
  },[]);  


  const onDiscard2 = () => {
    setPostAllowance(false)
  }
  const UpdateAllowanceAmt =()=>{

    let tempTaxPercentage = TrnxSelected.tax_percentage
    if(selectedOption=='Amount'){
      let amount = document.getElementById('Allowance').value
      let taxAmt = (amount*tempTaxPercentage)/100
      if(TrnxSelected.base_amount >= amount){
        document.getElementById('AllowanceAmount').value = amount;
        document.getElementById('AllowanceWithTax').value = parseFloat(amount)+parseFloat(taxAmt)
      }else{
        // alert("Allowance Amount selected is more then the transaction amount")
        seterrorMsg("Allowance Amount selected is more then the transaction amount")
        setshowErrorMsg(!showErrorMsg)
        document.getElementById('AllowanceAmount').value = ""
        document.getElementById('AllowanceWithTax').value = ""

      }
      
      // setAllowanceAmount(amount)
    }else{
      let amount = (TrnxSelected.base_amount)*(document.getElementById('Allowance').value/100)
      // setAllowanceAmount(amount)
      let taxAmt = (amount*tempTaxPercentage)/100

      if(TrnxSelected.base_amount >= amount){
        document.getElementById('AllowanceAmount').value = amount;
        document.getElementById('AllowanceWithTax').value = parseFloat(amount)+parseFloat(taxAmt)
      }else{
        // alert("Allowance percenetage is more then 100%")
        seterrorMsg("Allowance percenetage is more then 100%")
        setshowErrorMsg(!showErrorMsg)
        document.getElementById('AllowanceAmount').value = ""
        document.getElementById('AllowanceWithTax').value = ""
        
      }
    }
    
    // setAllowanceWithTax(1000)

  }
  const UpdateSplitAmt =()=>{

    let tempTaxPercentage = TrnxSelected.tax_percentage
    if(selectedOption=='Amount'){
      let amount = document.getElementById('Split').value
      let taxAmt = (amount*tempTaxPercentage)/100
        document.getElementById('SplitAmount').value = amount;
        document.getElementById('SplitWithTax').value = parseFloat(amount)+parseFloat(taxAmt)

    }else{
      let amount = (TrnxSelected.base_amount)*(document.getElementById('Split').value/100)
      let taxAmt = (amount*tempTaxPercentage)/100

        document.getElementById('SplitAmount').value = amount;
        document.getElementById('SplitWithTax').value = parseFloat(amount)+parseFloat(taxAmt)

    }
    
  }
  const CancelTransaction =(data) =>{

    if(data.reasonRemarks!=undefined){
      setReasonRemarks(data.reasonRemarks)

    }

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
          setTimeout(()=>{navigate('/dashboard/frontdesk/Billing')},1000)
         }else{
          // alert(resp.message)
          seterrorMsg(resp.message)
        setshowErrorMsg(!showErrorMsg)
         }
         setCancelTrnx(!CancelTrnx)
        }).catch((error) => {
        })
      
    
    }
  const AddAllowance =(data) =>{
    setReasonRemarks(data.reasonRemarks)
   

let POSTdata
    // setData(data)
    if(selectedOption=='Amount'){
     POSTdata = JSON.stringify({
      hotelID:1,
      transactionID:TrnxSelected.id,
      type: selectedOption,
      Amount:document.getElementById('Allowance').value,
      Percentage:0,
      folioNo:TrnxSelected.folio_id,
      reasonID:ReasonID,
      // reasonRemarks:data.reasonRemarks
      reasonRemarks : ReasonRemarks
    })
  }else{
     POSTdata = JSON.stringify({
      hotelID:1,
      transactionID:TrnxSelected.id,
      type: selectedOption,
      Amount:0,
      Percentage:document.getElementById('Allowance').value,
      folioNo:TrnxSelected.folio_id,
      reasonID:ReasonID,
      // reasonRemarks:data.reasonRemarks
      reasonRemarks : ReasonRemarks
    })
  }
    const res = fetchx(API_URL + "/postAllowance", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: POSTdata
    }).then(result => result.json())
      .then(resp => {
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
        setTimeout(()=>{navigate('/dashboard/frontdesk/Billing')},1000)
       }else{
        // alert(resp.message)
        seterrorMsg(resp.message)
        setshowErrorMsg(!showErrorMsg)
       }
      }).catch((error) => {
        console.log(error)
      })
    
  
  }
  const ConfirmTransferTransaction=(data)=>{
    fetchx(API_URL + "/checkDailyTrnxPosting", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
        reservationID:ReservationID
      })
    }).then(result => result.json())
    .then(resp => {
        if(resp.statusCode==200){
          // setFolioNumber(data.Folio.value)
          // setConfirmTransferTrnx(true)

         }else{
          seterrorMsg(resp.message)
          setshowErrorMsg(!showErrorMsg)
         }
        }).catch((error) => {
          console.log(error)
        }) 


    // 
    // seterrorMsg()
    setFolioNumber(data.Folio.value)
    // setroomNo(data.roomNo.value)
    setConfirmTransferTrnx(true)

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
        setreasonCodeData(rowData['data'])
      }).catch((error) => {
        console.log(error)
      })
    setReasonSelect(!ReasonSelect)
  }

  // function handleTransferTransaction(event) {
  //   setselectedOption(event.target.value)
   
  //     console.log('Others')
  //     setSameGuestForm(true)
  //     fetchx(API_URL + "/getReservationForFrontDeskInHouseGuest?reservationStatus=Checked In")
  //     .then(result => result.json())
  //     .then(resp => {
  //         console.log(resp)
  //         console.log(resp.statusCode)
  //         if(resp.statusCode==200){
  //           console.log('Heyyy')
           
  //          for(let i=0 ;i<resp['data'].length ;i++){
  //           console.log(resp['data'][i])
            
  //           console.log('=>>>>>>>>>>>>>>>>>>>>>')
            
  //           if(event.target.value === 'SameGuest' && TrnxSelected.roomNumber== resp['data'][i]['roomNumber']){
  //             if(roomNoarr1[resp['data'][i]['roomNumber']] == undefined){
  //               roomNoarr1[resp['data'][i]['roomNumber']] = ''
  //               roomNoarr1[resp['data'][i]['roomNumber']] = [{"balance":resp['data'][i]['balance'],"bookingID":resp['data'][i]['bookingID'],"ReservationID":resp['data'][i]['id'],"name":resp['data'][i]['firstName']}]
  //             }else{
  //               roomNoarr1[resp['data'][i]['roomNumber']].push({"balance":resp['data'][i]['balance'],"bookingID":resp['data'][i]['bookingID'],"ReservationID":resp['data'][i]['id'],"name":resp['data'][i]['firstName']})

  //             }
  //             let roomNoarr  = {"value":resp['data'][i]['roomNumber'],"label":resp['data'][i]['roomNumber']}
  //           setroomNoOptions(roomNoOptions=> [...roomNoOptions, roomNoarr])
  //           console.log(roomNoOptions)
  //           }else if(event.target.value != 'SameGuest'){
  //             if(roomNoarr1[resp['data'][i]['roomNumber']] == undefined){
  //               roomNoarr1[resp['data'][i]['roomNumber']] = ''
  //               roomNoarr1[resp['data'][i]['roomNumber']] = [{"balance":resp['data'][i]['balance'],"bookingID":resp['data'][i]['bookingID'],"ReservationID":resp['data'][i]['id'],"name":resp['data'][i]['firstName']}]
  //             }else{
  //               roomNoarr1[resp['data'][i]['roomNumber']].push({"balance":resp['data'][i]['balance'],"bookingID":resp['data'][i]['bookingID'],"ReservationID":resp['data'][i]['id'],"name":resp['data'][i]['firstName']})

  //             }
  //             let roomNoarr  = {"value":resp['data'][i]['roomNumber'],"label":resp['data'][i]['roomNumber']}
  //             setroomNoOptions(roomNoOptions=> [...roomNoOptions, roomNoarr])
  //           }


  //           reservationID[resp['data'][i]['name']] = resp['data'][i]['reservationID']

           
  //           if(i==resp['data'].length-1){
  //             console.log(roomNoOptions)
  //           }
  //          }
  //          console.log(roomNoarr1)
          
  //          }
  //         }).catch((error) => {
  //           console.log(error)
  //         }) 
  // }

  function handleTransferTransaction(event) {
    fetchx(API_URL +'/getRoomDetailsForTransferTrxn?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      roomNoarr1 = resp['data'][0]
      // setroomNoOptions(resp['data'])
    
    let tempRoomNoOptions
    setselectedOption(event.target.value)
    fetchx(API_URL +'/getInHouseRoomNos?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      tempRoomNoOptions = resp['data']
      // setroomNoOptions(resp['data'])
   


      // setSameGuestForm(true)
      // fetchx(API_URL + "/getReservationForFrontDeskInHouseGuest?reservationStatus=Checked In")
      // .then(result => result.json())
      // .then(resp => {
      //     console.log(resp)
      //     console.log(resp.statusCode)
      //     if(resp.statusCode==200){
      //       console.log('Heyyy')
           
           for(let i=0 ;i<tempRoomNoOptions.length ;i++){
            // console.log(tempRoomNoOptions[i])
            
            // console.log('=>>>>>>>>>>>>>>>>>>>>>')
            
            if(event.target.value === 'SameGuest' && TrnxSelected.roomNumber== tempRoomNoOptions[i]['value']){
             

              // if(roomNoarr1[resp['data'][i]['roomNumber']] == undefined){
              //   roomNoarr1[resp['data'][i]['roomNumber']] = ''
              //   roomNoarr1[resp['data'][i]['roomNumber']] = [{"balance":resp['data'][i]['balance'],"bookingID":resp['data'][i]['bookingID'],"ReservationID":resp['data'][i]['id'],"name":resp['data'][i]['firstName']}]
              // }else{
              //   roomNoarr1[resp['data'][i]['roomNumber']].push({"balance":resp['data'][i]['balance'],"bookingID":resp['data'][i]['bookingID'],"ReservationID":resp['data'][i]['id'],"name":resp['data'][i]['firstName']})

              // }
              // let roomNoarr  = {"value":resp['data'][i]['roomNumber'],"label":resp['data'][i]['roomNumber']}
              
              setroomNoOptions([tempRoomNoOptions[i]])
              handleroomNoChange(tempRoomNoOptions[i])
              setSameGuestForm(false)
              setTimeout(()=>{setSameGuestForm(true)},10)
              
            // console.log(roomNoOptions)
            }else if(event.target.value != 'SameGuest'){
             

              // if(roomNoarr1[resp['data'][i]['roomNumber']] == undefined){
              //   roomNoarr1[resp['data'][i]['roomNumber']] = ''
              //   roomNoarr1[resp['data'][i]['roomNumber']] = [{"balance":resp['data'][i]['balance'],"bookingID":resp['data'][i]['bookingID'],"ReservationID":resp['data'][i]['id'],"name":resp['data'][i]['firstName']}]
              // }else{
              //   roomNoarr1[resp['data'][i]['roomNumber']].push({"balance":resp['data'][i]['balance'],"bookingID":resp['data'][i]['bookingID'],"ReservationID":resp['data'][i]['id'],"name":resp['data'][i]['firstName']})

              // }
              // let roomNoarr  = {"value":resp['data'][i]['roomNumber'],"label":resp['data'][i]['roomNumber']}
              setroomNoOptions(tempRoomNoOptions)
              setbookingID('')
              setguestBalance('')
              setSameGuestForm(false)
              setTimeout(()=>{setSameGuestForm(true)},10)
            }
            
            


            // reservationID[resp['data'][i]['name']] = resp['data'][i]['reservationID']

           
            if(i==resp['data'].length-1){
             
              // setSameGuestForm(true)
              // setTimeout(()=>{setSameGuestForm(true)},10)
            }
           }
          
          
          //  }
          // }).catch((error) => {
          //   console.log(error)
          // }) 
        })
      })
  }
const handleroomNoChange = (event) =>{
  guestNameOptions=[]

  setroomNo(event.value)
 
  for(let i=0 ;i<roomNoarr1[event.value].length;i++){
  let guestName = {"bookingID":roomNoarr1[event.value][i]['bookingID'],"ReservationID":roomNoarr1[event.value][i]['ReservationID'],"value":roomNoarr1[event.value][i]['balance'] ,"label":roomNoarr1[event.value][i]['name']} 
      guestNameOptions.push(guestName)
  }
  setdefaultGuest([])
  setreloadGuest(false)
    setTimeout(()=>{setreloadGuest(true),1})
 
  if(guestNameOptions.length==1){
    setdefaultGuest([guestNameOptions[0]])
    handleDropdownChange(guestNameOptions[0])
    setreloadGuest(false)
    setTimeout(()=>{setreloadGuest(true),1})
  }
}

const handleFolioChange = (event) =>{

  if(selectedOption ==='SameGuest' && folio==event.value){
    seterrorMsg('Same Folio Selected')
    setshowErrorMsg(!showErrorMsg)
  }
  setFolioNumber(folio.folio)
}
  const handleDropdownChange = (event) => {
  
  setguestBalance(event.value)
  // data.Folio.clearValue()  
  // document.getElementById("Folio").options.length=0
    

  setReservationID(event.ReservationID)
  setbookingID(event.bookingID)


fetchx(API_URL + "/getFolioCount", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID:1,
        reservationID:event.ReservationID
      })
    }).then(result => result.json())
    .then(rowData => {
       
        // setFolioCount(rowData['data'])
        setFolioOptions(rowData['data'])
      }).catch((error) => {
        console.log(error)
      })
  
  }

  const TransferTransaction =()=>{
   
    // /TransferTransaction
    fetchx(API_URL + "/TransferMultipleTransaction", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID:1,
        transactionID:TrxnIDArr,
        reservationID:ReservationID,
        folioNo:FolioNumber,
        prevRoomNo:TrnxSelected.roomNumber,
        newRoomNo:roomNo
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
                <h6>Transaction transferred Successfully</h6>
                {/* <h4>Wait-List Added Successfully</h4> */}
              </div>
            </div>
          );
          setTimeout(()=>{navigate('/dashboard/frontdesk/Billing')},1000)
         }

  
      }).catch((error) => {
        console.log(error)
      })

      setConfirmTransferTrnx(false)

  }


  const SplitTransaction =() =>{
   
    let SplitAmount = document.getElementById('Split').value
    if(TrnxSelected.base_amount<0){
      SplitAmount=(-1)*SplitAmount
    }
  

    let POSTdata
    // setData(data)
    // console.log(data)
    if(selectedOption=='Amount'){
     POSTdata = JSON.stringify({
      hotelID:1,
      transactionID:TrnxSelected.id,
      type: selectedOption,
      Amount:SplitAmount,
      Percentage:0,
    })
  }else{
     POSTdata = JSON.stringify({
      hotelID:1,
      transactionID:TrnxSelected.id,
      type: selectedOption,
      Amount:0,
      Percentage:document.getElementById('Split').value,
    })
  }

    const res = fetchx(API_URL + "/splitTransaction", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: POSTdata
    }).then(result => result.json())
      .then(resp => {
      
       if(resp.statusCode==200){
        toast(
          <div className="d-flex">
            <div className="me-1">
              <Avatar size="sm" color="success" icon={<Check size={12} />} />
            </div>
            <div className="d-flex flex-column">
              <h6>Split Transaction Successful</h6>
              {/* <h4>Wait-List Added Successfully</h4> */}
            </div>
          </div>
        );
        setTimeout(()=>{navigate('/dashboard/frontdesk/Billing')},1000)
       }else{

        seterrorMsg(resp.message || 'split transaction failed ')
        setshowErrorMsg(!showErrorMsg)
        // alert(resp.message)
       }
      }).catch((error) => {
        console.log(error)
      })
    // fetchx(API_URL + "/splitTransaction", {
    //   method: "POST",
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     hotelID:1,
    //     transactionID:TrnxSelected.id,
    //   })
    // }).then(result => result.json())
    // .then(rowData => {
    //     console.log(rowData)
    //     if(rowData.statusCode==200){
    //       toast(
    //         <div className="d-flex">
    //           <div className="me-1">
    //             <Avatar size="sm" color="success" icon={<Check size={12} />} />
    //           </div>
    //           <div className="d-flex flex-column">
    //             <h6>Split Transaction Successful</h6>
    //             {/* <h4>Wait-List Added Successfully</h4> */}
    //           </div>
    //         </div>
    //       );
    //       setTimeout(()=>{window.location.reload()},1000)
    //      }

  
    //   }).catch((error) => {
    //     console.log(error)
    //   })
  }
const TransferMultipleTrxn=()=>{


  // setTrnxSelected(event.data)
  setTransferTrnx(true)
}
  
   return (
    <div>
    {/* <Card> */}
    <div className='inline-spacing' align="right"  style={{ margin: '2px 0' }}>
    {TrxnIDArr.length!=0 && <Button style={{ margin: '2px 2px' ,marginLeft:16,marginRight:16 }} align='right'  color="primary" onClick={() => {TransferMultipleTrxn()}}>Transfer Selected Trxns</Button>}
    </div>
    <div className="ag-theme-alpine" style={{ marginLeft:20,marginRight:20, height: 500}}>
        <AgGridReact
                    overlayNoRowsTemplate={'No record found'} 
            ref={gridRef}
            rowData={rowData} columnDefs={columnDefs}
            getRowStyle={getRowStyle}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            onCellValueChanged={onCellValueChanged}
            onCellDoubleClicked = {(event)=> (
              event.colDef.field!='extras' && event.data.transaction_type!='Payments' && event.data.transaction_type!='PaidOuts' && expandParentRow(event.data))}
            // onCellDoubleClicked = {(event)=> (expandParentRow(event.data))}
            paginationAutoPageSize = 'true'
            paginationPageSize= '10'
            pagination = 'true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            gridOptions={gridOptions}
            isRowSelectable={isRowSelectable}
            suppressRowClickSelection={true}
            onSelectionChanged={onSelectionChanged}

            // onGridReady={onGridReady}
            
            />
      </div>
      {/* </Card> */}
    {/* <App/> */}
    {/*Post Allowance*/}
<Modal isOpen={PostAllowance} toggle={() => setPostAllowance(!PostAllowance)} className='modal-dialog-centered modal-lg' onClosed={()=>{PostAllowanceReset()}}>
                      <ModalHeader toggle={() => setPostAllowance(!PostAllowance)}>Transaction Allowance </ModalHeader>
                          <ModalBody>
                          
                              {/* <Fragment>
                                  <Nav tabs className='tab'>
                                     {getButtonsUsingForLoop(FolioCount)}
                              
                                  </Nav>
                              </Fragment> */}
                      <Form onSubmit={handleSubmit(AddAllowance)}>
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
            Transaction Amount
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
              
                
                name="TransactionAmount"
                control={control}
                render={({ field }) => (
                  <Cleave
                  disabled={true}

                    {...field}
                    value={TrnxSelected.base_amount}
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
          <Col md='4' sm='12' className='mb-1'>
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
                  disabled={true}

                    {...field}
                    value={TrnxSelected.total}
                    // onChange={checkisCode}
                    id="quantity"
                    pattern="[0-9].*" title="Only Numbers Allowed" required
                    // placeholder="Enter Store ID"
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.TransactionAmountWithTax === null,
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          <Col className='name'>
                <div className='demo-inline-spacing'>
                  <div className='form-check'>

                    {/* Amount */}
                    <Label className='form-check-label' for='ex1-active'>
                      <Input type="radio" name='ex1' value="Amount" checked={selectedOption ==='Amount'} onChange={handleRadioChange} />
                      Amount
                    </Label>

                    <br></br>
                    <br></br>

                    {/* Percentage */}
                    <Label className='form-check-label'>
                      <Input type="radio" name='ex1' value="Percentage" checked={selectedOption ==='Percentage'}  onChange={handleRadioChange} />
                      Percentage
                    </Label>
                  </div>
                </div>
              </Col>
            {selectedOption.length!=0 && <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Allowance">
            {sessionStorage.getItem('AllowanceType')}
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
                    placeholder={Placeholder}
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.Allowance === null,
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
                value={AllowanceAmount}
                render={({ field }) => (
                  <Cleave
                  disabled={true}

                  id="AllowanceAmount"
                  pattern="[0-9]*" title="Only Numbers Allowed"
                  required
                  // placeholder="Enter Items"
                    {...field}
                    className={classnames("form-control", {
                      "is-invalid":
                        data !== null && (data.AllowanceAmount === null || !data.AllowanceAmount.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="AllowanceWithTax">
            Allowance With Tax
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
                
                name="AllowanceWithTax"
                control={control}
                disabled={true}
                render={({ field }) => (
                  <Cleave
                  disabled={true}

                  id="AllowanceWithTax"
                  pattern="[0-9].*" title="Only Numbers Allowed"
                  // required
                  // placeholder="Enter Items"
                    {...field}
                    className={classnames("form-control", {
                      "is-invalid":
                        data !== null && (data.AllowanceWithTax === null || !data.AllowanceWithTax.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          
                              <Col md='4' sm='12' className='mb-1'>
       
                <Label className="form-label">
                Reason Code
                <Input required type="text" name='TransactionCode' value={ReasonCode} onClick={fetchReasonCodeData}/>
                </Label>
                </Col>
          {ReloadReasonRemarks && <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="reasonRemarks">
            Reason Remarks
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
                name="reasonRemarks"
                control={control}
                value={'ReasonRemarks'}
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

          <br></br>
            <div>
              {/* <Button className='me-1' style={{align:'right'}} color='primary' type='submit'>
                Post Charges
              </Button> */}
              <Button className="me-1" color="primary" type="submit" >
              Submit
            </Button>
            <Button className="me-1" color="primary" type="submit" onClick={()=>{PostAllowanceReset()}} >
              Cancel
            </Button>
            </div>
            </Row>
          </Form>
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
                <Input required type="text" name='TransactionCode' value={ReasonCode} onClick={fetchReasonCodeData}/>
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
      {/* Transfer Transaction */}
      <Modal isOpen={TransferTrnx} className='modal-dialog-centered modal-lg' onClosed={()=>{TransferTransactionReset()}}>
                      <ModalHeader toggle={() => setTransferTrnx(!TransferTrnx)}>Transfer Transaction </ModalHeader>
                          <ModalBody>
                            <Form onSubmit={handleSubmit(ConfirmTransferTransaction)}>
                              <Row>  
                              {/* <Col className='name'> */}
                <div className='demo-inline-spacing'>
                  <div className='form-check'>

                    {/* Amount */}
                    <Col md='4' sm='12' className='mb-1'>
                    <Label className='form-check-label' for='ex1-active'>
                      <Input type="radio" name='ex1' value="SameGuest" checked={selectedOption ==='SameGuest'} onChange={handleTransferTransaction} />
                      Same Room
                    </Label>
                    </Col>
                    {/* <br></br> */}
                    {/* <br></br> */}

                    {/* Percentage */}
                    <Col md='4' sm='12' className='mb-1'>
                    <Label className='form-check-label'>
                      <Input type="radio" name='ex1' value="Others" checked={selectedOption ==='Others'}  onChange={handleTransferTransaction} />
                      Others
                    </Label>
                    </Col>
                  </div>
                </div>
              {/* </Col> */}
                
            
            {/* <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Amount">
            Amount
            </Label>
            <InputGroup className="input-group-merge">
            
              <Controller
                name="Amount"
                control={control}
                render={({ field }) => (
                  <Cleave
                    {...field}
                    value={defaultAmount}
                    // onChange={checkisCode}
                    pattern="[0-9]*" title="Only Numbers Allowed" required
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
          </Col> */}
         
         {SameGuestForm && <>
         {/* <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="roomNo">
            Room No
            </Label>
            <InputGroup className="input-group-merge">
          
              <Controller
                id="roomNo"
                name="roomNo"
                control={control}
                
                render={({ field }) => (
                  <Cleave
                  // pattern="[aA-zZ]*" title="Only Alphabets Allowed" 
                  
                    {...field}
                    value={roomNo}
                    className={classnames("form-control", {
                      "is-invalid":
                        data !== null && (data.roomNo === null || !data.roomNo.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col> */}


          {/* { console.log(roomNoOptions[0]['value'])} */}
          <Col md='4' sm='12' className='mb-1'>
              <div className="mb-1">
              <Label className="form-label" for="roomNo">
              room No
              </Label>
                  <Controller
                  id='roomNo'
                  control={control}

                  name='roomNo'
                  render={({ field }) => (
                      <Select
                      name="roomNo"
                      className="react-select"
                      defaultValue={selectedOption=='SameGuest' ?roomNoOptions[0]:null}

                      options={roomNoOptions}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      // className={classnames('react-select', { 'is-invalid': data !== null && data.type === null })}
                      
                      isClearable
                      onChange={handleroomNoChange}
                      // {...field}
                      
                      />
                  )}
                  />
              </div>
          </Col>
          <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="bookingID">
            bookingID
            </Label>
            <InputGroup className="input-group-merge">
          
              <Controller
                id="bookingID"
                name="bookingID"
                control={control}
                
                render={({ field }) => (
                  <Cleave
                  // pattern="[aA-zZ]*" title="Only Alphabets Allowed" 
                    disabled={true} 
                    {...field}
                    value={bookingID}
                    className={classnames("form-control", {
                      "is-invalid":
                        data !== null && (data.bookingID === null || !data.bookingID.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          {reloadGuest && <Col md='4' sm='12' className='mb-1'>
              <div className="mb-1">
              <Label className="form-label" for="guestName">
              Guest Name
              </Label>
                  <Controller
              id="guestName"
              control={control}
              name="guestName"
              render={({ field }) => (
                <Select
                required
                defaultValue={defaultGuest[0]}

                  isClearable
                  options={guestNameOptions}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  className={classnames("react-select", {
                    "is-invalid": data !== null && data.guestName === null,
                  })}
                  {...field}
                  onChange={handleDropdownChange}

                  
                />
              )}
            />
              </div>
          </Col>}
          <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="guestBalance">
            guest Balance
            </Label>
            <InputGroup className="input-group-merge">
          
              <Controller
                id="guestBalance"
                name="guestBalance"
                control={control}
                
                render={({ field }) => (
                  <Cleave
                  // pattern="[aA-zZ]*" title="Only Alphabets Allowed" 
                  disabled={true} 
                  
                    {...field}
                    value = {guestBalance}
                    className={classnames("form-control", {
                      "is-invalid":
                        data !== null && (data.guestBalance === null || !data.guestBalance.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
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
                required
                  isClearable
                  // defaultValue={FolioOptions[0]}
                  options={FolioOptions}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  className={classnames("react-select", {
                    "is-invalid": data !== null && data.Folio === null,
                  })}
                  {...field}
                  
                />
                // <Select
                // name="guestName"
                // className="react-select"
                // options={FolioOptions}
                // classNamePrefix='select'
                // theme={selectThemeColors}
                // // className={classnames('react-select', { 'is-invalid': data !== null && data.type === null })}
                
                // isClearable
                // onChange={handleFolioChange}
                
                // />
              )}
            />
          </div>
          </Col>
          </>}
          {OthersForm && <Col md='4' sm='12' className='mb-1'>
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
                  <Cleave
                  pattern="[aA-zZ]*" title="Only Alphabets Allowed" 
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
}
          
          

          <br></br>
            <div>
              {/* <Button className='me-1' style={{align:'right'}} color='primary' type='submit'>
                Post Charges
              </Button> */}
              <Button className="me-1" color="primary" type="submit" >
              Transfer
            </Button>
            <Button className="me-1" color="primary"  onClick={()=>{TransferTransactionReset()}} >
              Cancel
            </Button>
            </div>
            </Row>
          </Form>
                          </ModalBody>
            </Modal>  

            {/* confirm transfer transaction */}
            <Modal
        isOpen={ConfirmTransferTrnx}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Transfer Transaction</h1>
          {ConfirmTransferTrnx &&  <>
            <h5>Do you want to Transfer Transaction</h5>
            {/* <h6>Room No : {TrnxSelected.description}</h6>
            <h6>Booking ID : {TrnxSelected.total}</h6>
            <h6>Guest Name : {TrnxSelected.date}</h6> */}

            {/* {data.Folio!=undefined && <h6>Folio No: <b>{data.Folio.value}</b></h6>} */}

          </>}
            <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' onClick={TransferTransaction}>
               Confirm
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                // window.location.reload()
                setConfirmTransferTrnx(false)
                setTransferTrnx(false)
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal> 

      {/* AlertManualPosting */}
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
      {/* SplitTransaction */}
      <Modal isOpen={ShowSplitTrnx} toggle={() => setShowSplitTrnx(!ShowSplitTrnx)} className='modal-dialog-centered modal-lg' onClosed={onDiscard2}>
                      <ModalHeader toggle={() => setShowSplitTrnx(!ShowSplitTrnx)}>Split Transaction </ModalHeader>
                          <ModalBody>
                          
                              {/* <Fragment>
                                  <Nav tabs className='tab'>
                                     {getButtonsUsingForLoop(FolioCount)}
                              
                                  </Nav>
                              </Fragment> */}
                      <Form onSubmit={handleSubmit(SplitTransaction)}>
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
            Transaction Amount
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
              
                
                name="TransactionAmount"
                control={control}
                render={({ field }) => (
                  <Cleave
                  disabled={true}
                    {...field}
                    value={TrnxSelected.base_amount}
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
          <Col md='4' sm='12' className='mb-1'>
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
                  disabled={true}

                    value={TrnxSelected.total}
                    // onChange={checkisCode}
                    id="quantity"
                    pattern="[0-9].*" title="Only Numbers Allowed" required
                    // placeholder="Enter Store ID"
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.TransactionAmountWithTax === null,
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          <Col className='name'>
                <div className='demo-inline-spacing'>
                  <div className='form-check'>

                    {/* Amount */}
                    <Label className='form-check-label' for='ex1-active'>
                      <Input type="radio" name='ex1' value="Amount" checked={selectedOption ==='Amount'} onChange={handleRadioChange} />
                      Amount
                    </Label>

                    <br></br>
                    <br></br>

                    {/* Percentage */}
                    <Label className='form-check-label'>
                      <Input type="radio" name='ex1' value="Percentage" checked={selectedOption ==='Percentage'}  onChange={handleRadioChange} />
                      Percentage
                    </Label>
                  </div>
                </div>
              </Col>
            {selectedOption.length!=0 && <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Split">
            {sessionStorage.getItem('AllowanceType')}
            </Label>
            <InputGroup className="input-group-merge">
              {/* <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && data.IsActive === null,
                })}
              ></InputGroupText> */}
              <Controller
                name="Split"
                control={control}
                render={({ field }) => (
                  <Cleave
                    {...field}
                    id="Split"
                    // value={defaultAmount}
                    onChange={UpdateSplitAmt}
                    pattern="[0-9]*" title="Only Numbers Allowed" 
                    required
                    
                    placeholder={Placeholder}
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.Split === null,
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>}
          <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="SplitAmount">
            Split Amount
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
               
                name="SplitAmount"
                control={control}
                render={({ field }) => (
                  <Cleave
                  disabled={true}

                  id="SplitAmount"
                  pattern="[0-9]*" title="Only Numbers Allowed"
                  required
                  // placeholder="Enter Items"
                    {...field}
                    className={classnames("form-control", {
                      "is-invalid":
                        data !== null && (data.SplitAmount === null || !data.SplitAmount.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="SplitWithTax">
            Split With Tax
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
                
                name="SplitWithTax"
                control={control}
                disabled={true}
                render={({ field }) => (
                  <Cleave
                  disabled={true}

                  id="SplitWithTax"
                  // pattern="[0-9]*" title="Only Numbers Allowed"
                  // required
                  // placeholder="Enter Items"
                    {...field}
                    className={classnames("form-control", {
                      "is-invalid":
                        data !== null && (data.SplitWithTax === null || !data.SplitWithTax.length)
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
         
          
          

          <br></br>
            <div>
              {/* <Button className='me-1' style={{align:'right'}} color='primary' type='submit'>
                Post Charges
              </Button> */}
              <Button className="me-1" color="primary" type="submit" >
              Split
            </Button>
            <Button className="me-1" color="primary" type="submit" onClick={()=>{setShowSplitTrnx(!ShowSplitTrnx)}} >
              Cancel
            </Button>
            </div>
            </Row>
          </Form>
                          </ModalBody>
            </Modal> 

            <Modal isOpen={ShowPOSInv} toggle={() => setShowPOSInv(!ShowPOSInv)} style={{height:'200px'}} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowPOSInv(!ShowPOSInv)}>POS Invoice</ModalHeader>
       
          <iframe style={{ height: '85vh' }} src={POSInvURL}> </iframe>
      </Modal>
      {/* <Modal
        isOpen={ShowSplitTrnx}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h3 className='text-center mb-1'>{errorMsg}</h3>
          
            <h6>Room No : {TrnxSelected.description}</h6>
            <h6>Booking ID : {TrnxSelected.total}</h6>
            <h6>Guest Name : {TrnxSelected.date}</h6>

            {data.Folio!=undefined && <h6>Folio No: <b>{data.Folio.value}</b></h6>}

            <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' onClick={SplitTransaction}>
               Confirm
              </Button>
              <Button
               color='primary'
                onClick={() => {
                // window.location.reload()
                setShowSplitTrnx(!ShowSplitTrnx)
              }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>       */}
    </div>
  );
};

export default ValidationThirdPartyComponents;
