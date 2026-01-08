
import { useState,useRef, useEffect, useMemo, useCallback} from 'react';
import Select from "react-select";
import { selectThemeColors } from "@utils";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import Moment from 'moment'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import API_URL from "../../../config";
import {Row,Card,CardHeader,CardTitle,CardBody,Button,Modal,ModalBody,CardText
,  ModalHeader,Col,Label,Input,Form,InputGroup} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import toast from "react-hot-toast";
import Avatar from "@components/avatar";
import { Check } from "react-feather";
import { XCircle } from "react-feather";
import { data } from 'jquery';
let is_test = false
import Attachments from '../testFrontDesk/attachments'
import POSAttachments from '../BTCInvoices/POSAttachments'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)



const AvailabilityMatrix = () => {
  const [rowData, setRowData] = useState([]);
  const [loadingMessage,setloadingMessage] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [AggridData,setAggridData] = useState([])
  const gridRef = useRef(null);
  const gridRef1 = useRef();

  const [FirstPageLoad,setFirstPageLoad] = useState(true)
  const [debouncedPage, setDebouncedPage] = useState(0);
  const [InvURL,setInvURL] = useState('')
  const [ShowInv,setShowInv] = useState(false)
  const [LoadingVar,setLoadingVar] = useState(false)
const [ShowAttachments,setShowAttachments] = useState(false)
const [AddAttachments,setAddAttachments] = useState(false)
const [ShowBTCEmailHistory,setShowBTCEmailHistory] = useState(false)

const [ReservationData,setReservationData] = useState([])
const [POSBillData,setPOSBillData] = useState([])
const [ShowActions,setShowActions] = useState(false)
const [SelectedRowData,setSelectedRowData] = useState([])
  const [Today,setToday] = useState()
  const [data, setData] = useState([]);
  const [BTCEmailHistory,setBTCEmailHistory] = useState([])
  const [roomNoOptions,setroomNoOptions] = useState([{}])
  const [ErrorMessage,setErrorMessage] = useState('')
  const [showErrorMsg,setshowErrorMsg] = useState(false)
  const[IsVerifiedRows,setIsVerifiedRows] = useState(false)
const [BTCCompanyDetails,setBTCCompanyDetails] = useState([])
const [BTCEmailConfig,setBTCEmailConfig] = useState([])
const [BTCFromEmailIDs,setBTCFromEmailIDs] = useState([])
const [htmlData, setHtmlData] = useState(''); // State to hold the converted HTML data
const [SelectedFromEmail,setSelectedFromEmail] = useState('')
const [FromAddressField,setFromAddressField] = useState('')
const [selectedFilter, setSelectedFilter] = useState("View All");
const [Subject,setSubject] = useState('')
const [editableText, setEditableText] = useState('')
const [InvoicesSelected,setInvoicesSelected] = useState([])
const [PMSInvoiceIDArr,setPMSInvoiceIDArr] = useState([])
const [POSInvoiceIDArr,setPOSInvoiceIDArr] = useState([])
const [PMSInvoicesSelected,setPMSInvoicesSelected]= useState([])
const [POSInvoicesSelected,setPOSInvoicesSelected]= useState([])
const [allInv,setallInv] = useState([])
// Handler to update the body state
const handleBodyChange = (event) => {
  setBody(event.target.value);
};
  // Filter data based on condition
  const handleFilter = (filterFunc,label) => {
    const filtered = rowData.filter(filterFunc); 
    setSelectedFilter(label); // Set selected button

  console.log(filtered)
    if (filtered.length === 0) {
      setFilteredData([]); // Ensure no rows are returned if no conditions match
    } else {
      setFilteredData(filtered);
    }
  };

    // Reset filtered data to view all rows
    const handleShowAllRows = () => {
      setFilteredData(rowData);
      setSelectedFilter("View All"); // Default highlight

    };

  const CustomDropdown = ({ rowData }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const handleSuccess = (message) => {
        return MySwal.fire({
            text: message,
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        })
    }






    const handleOptionChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedOption(selectedValue);
        updateGuestProfile(selectedValue);
    };

    const dropdownStyle = {
        padding: '8px 12px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        outline: 'none',
        backgroundColor: '#fff',
        color: '#333',
        transition: 'border-color 0.3s ease',
        width: '150px' // Adjust width as needed

    };

    const optionStyle = {
        backgroundColor: '#fff',
        color: '#333',
    };

    const hoverStyle = {
        borderColor: '#007bff',
    };
  
};

  const columnDefs = [
    {headerName:'' , field:'',checkboxSelection: true, headerCheckboxSelection: true,maxWidth:40},
            {headerName: 'Invoice No',field: 'billNoDisplay',maxWidth: 180},
            {headerName: 'invoiceDate',field: 'invoiceDate',maxWidth: 130},
            {
              headerName:'Actions' , 
              field:'extras',
              editable:true,
              
              cellEditorParams: {
                
                values: ['Select','View Invoice', 'View IRN Invoice', 'View Merged Invoice', 'Regenerate IRN','View/Add Attachments','View/Add POS Attachments','Send Email','View Email History'] // Provide the options here
    
                // if(!params.data.hasOwnProperty('id')){
                //   values :[]
                // }else{
                //   values :[]
                // }
               
              },defaultValue: 'Select',
              cellEditor: 'agSelectCellEditor',
              cellRenderer: (event) => {
               
                  // setSelectedRowData(event.data)
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
            // { headerName: 'Actions', cellRendererFramework: (params) => {
            //   return (
            // <Button color='primary' style={{ width: 100 }} onClick={() =>{
            //   setSelectedRowData(params.data)
            //   getBTCEmailHistory(params.data)
            //   setBody(params.data.emailBody)
            //   setShowActions(true)} } >Actions</Button>)},maxWidth: 140 },


            { headerName: 'Merged Doc', cellRendererFramework: (params) => {
              return (
            <Button color='primary' style={{ width: 130 }} onClick={() =>{
              console.log(params.data)
              getMergedFile(params.data)} } >Merged Doc</Button>)},maxWidth: 210 },


            //   { headerName: 'IRN Invoice', cellRendererFramework: (params) => {
            //     return (
            //   <Button color='primary' style={{ width: 100 }} onClick={() =>{
            //     console.log(params.data)
            //     getIRNInvoice(params.data)} } >View</Button>)},maxWidth: 150 },
              
              { headerName: 'Send', cellRendererFramework: (params) => {        
                return (
                  
              <Button color='primary' style={{ width: 80 }} onClick={() =>{
                console.log(params.data)
                getBtcInvByID(params.data)
                
              }} >Email</Button>)}, suppressSizeToFit: true,maxWidth:120 },
              { headerName: 'Attachments', cellRendererFramework: (params) => {
                return (
              <Button color='primary' style={{ width: 130 }} onClick={() =>{
                console.log(params.data)
                if(params.data.Type=='PMS'){
                getAttachments(params.data)
                }else{
                  getPOSAttachments(params.data)
                }
                // 
              } } >Attachments</Button>)},maxWidth: 210 },
            {headerName: 'RoomNo/TableNo',field: 'RoomTableNo',maxWidth: 180},
            {headerName: 'GuestName/OutletName',field: 'GuestOutletName',width: 260},
            {headerName: 'Amount',field: 'invoiceAmount',maxWidth: 130},
            {headerName: 'BookingID/OrderID',field: 'BookOrderID',maxWidth: 180},
            
          
            {headerName: 'CompanyGST',field: 'CompanyGST',width: 230},

            {headerName: 'GuestGST',field: 'GuestGST',width: 230},
            {headerName: 'BTCCompanyName',field: 'BTCCompanyName',width: 230},
            {headerName: 'BTCCompanyEmail',field: 'BTCCompanyEmail',width: 230},
            {headerName: 'bookerEmail',field: 'bookerEmail',width: 230},
            {headerName: 'Email To',field: 'EmailSentTo',width: 230},
            {headerName: 'Email CC',field: 'EmailSentCC',width: 230},

            {headerName: 'BTCCompanyGST',field: 'CompanyGST',width: 230},
            {headerName: 'billNo',field: 'billNo',width: 230},


            {headerName: 'Type',field: 'Type',width: 230},
            {headerName: 'SettlementType',field: 'SettlementType',maxWidth: 160},
            {headerName: 'isVerified',field: 'isVerified',maxWidth: 160},


              
          ]

          const BTCEMailColDefs = [
            {headerName: 'Invoice No',field: 'billNoDisplay',maxWidth: 180},
            {headerName: 'Company Name',field: 'BTCAccName',width: 300},
            {headerName: 'DateTime',field: 'createdAt',maxWidth: 180},
            {headerName: 'To Address',field: 'toAddress',width: 260},
            {headerName: 'CC Address',field: 'ccAddress',maxWidth: 180},
            {headerName: 'Email Body',field: 'emailBody',width: 260, wrapText:true,},
          ]
          const optionsToDate = {

            // maxDate:Moment(new Date(Today)).subtract(1, 'days')
            // maxDate:Today
            maxDate : Today
          
          };

  const onGridReady = (params) => {
    gridRef.current = params.api;
   
  };
  const cellClickedListener = useCallback( event => {
    console.log('cellClickedListener', event);
setSelectedRowData(event.data)
  }, []);



  const onSelectionChanged = (event) => {
    let allInvoices = event.api.getSelectedRows();
    console.log(allInvoices);
    setallInv(allInvoices)
    console.log(PMSInvoicesSelected)
    console.log(POSInvoicesSelected)
    setInvoicesSelected(allInvoices[0]); // Set the first selected invoice
  
    let PMSIDArr = [];
    let POSIDArr = [];
    let PMSInvoices = [];
    let POSInvoices = [];
  
    if (allInvoices.length !== 0) {
      allInvoices.forEach((invoice) => {
        console.log(invoice)
        if (invoice.Type === 'PMS') {
          PMSIDArr.push(invoice.id);
          PMSInvoices.push(invoice);
        } else if (invoice.Type === 'POS') {
          POSIDArr.push(invoice.id);
          POSInvoices.push(invoice);
        }
      });
  
      setPMSInvoiceIDArr(PMSIDArr);
      setPOSInvoiceIDArr(POSIDArr);
      setPMSInvoicesSelected(PMSInvoices);
      setPOSInvoicesSelected(POSInvoices);
    } else {
      setPMSInvoiceIDArr([]);
      setPOSInvoiceIDArr([]);
      setPMSInvoicesSelected([]);
      setPOSInvoicesSelected([]);
    }
  };
  

  
  const onCellValueChanged = useCallback( event => {
    console.log('CellValueChanged', event);
    // setSelectedRowData(event.data)
        if (event.colDef.field === 'extras' ) {
          const updatedValue = event.data.extras;
          if(event.data.isPosted==1){
            
            if(updatedValue=='View Invoice'){
              getInvoice(event.data)
            }
            if(updatedValue=='View/Add Attachments'){
              if(event.data.Type=='PMS'){
                getAttachments(event.data)
              }else{
                setErrorMessage('Not allowed for POS bills')
                setshowErrorMsg(true)
              }
              
            }
            if(updatedValue == 'View/Add POS Attachments'){
              if(event.data.Type=='POS'){
              getPOSAttachments(event.data)
              }else{
                setErrorMessage('Not allowed for PMS bills')
                setshowErrorMsg(true)
              }
            }
          
            if(updatedValue=='View IRN Invoice'){
              getIRNInvoice(event.data)
            }

            if(updatedValue=='View Merged Invoice'){
              getMergedFile(event.data)
            }
            if(updatedValue=='Regenerate IRN'){
              RegenerateIRNInvoice(event.data)
            }
            if(updatedValue=='Send Email'){
              getBtcInvByID(event.data)
            //   setCompleteData(event.data)
            //   getCompanyData(event.data)
                                                            
            //   // setBody(event.data.emailBody)
                                  
            //   setguestEmail(event.data.BTCCompanyEmail)
            //   let EMail = event.data.guestEmail+' '+event.data.bookerEmail
            //   setCC1_Email(event.data.guestEmail)
            //   setCC2_Email(event.data.bookerEmail)
      
            //   setCCOpen(true)
            
            // setcomposeOpen(true)
            }
            if(updatedValue == 'View Email History'){
              setloadingMessage('Please wait while we load Email History');
              setLoadingVar(true);
              getBTCEmailHistory(event.data)
                    setShowActions(true)
            }
          }else{


            if(updatedValue=='View Invoice'){
              getInvoice(event.data)
            }
            else if(updatedValue=='View/Add Attachments'){
              if(event.data.Type=='PMS'){
                getAttachments(event.data)
              }else{
                setErrorMessage('Not allowed for POS bills')
                setshowErrorMsg(true)
              }
              
            }
            else if(updatedValue == 'View/Add POS Attachments'){
              if(event.data.Type=='POS'){
                getPOSAttachments(event.data)
                }else{
                  setErrorMessage('Not allowed for PMS bills')
                  setshowErrorMsg(true)
                }
            }
           
            else if(updatedValue !='Select'){
            setErrorMessage('Invoice not posted. You cannot perform this action')
            setshowErrorMsg(true)
            }
          }

           // Reset the dropdown to default value
           event.data.extras = 'Select';
           // Refresh the grid
           setRowData([...rowData]);
    
    }
   
  }, [rowData]);

  //   useEffect(() => {
  //   loadPageData(debouncedPage * 10);
  // }, [debouncedPage]);

  useEffect(() => {  // getBTCEmailSenders
  fetch(API_URL + `/getBTCEmailSenders?billNoDisplay=${data['billNoDisplay']}`)
    .then(result => result.json())
    .then(response => {
        setBTCFromEmailIDs(response['data'])
        // setShowBTCEmailHistory(true)
      
    })
  }, []);

const getBtcInvByID = (data)=>{
  setloadingMessage('Please wait while we load the Email Template');
  setLoadingVar(true);
  let invoiceID
  if(data.Type == 'PMS'){
    invoiceID = data.PMSInvID
  }else{
    invoiceID = data.POSInvID
  }
  
  fetch(API_URL + `/getBTCInvoiceByID?invoiceID=${invoiceID}&Type=${data.Type}`)
  .then(result => result.json())
  .then(response => {
      console.log(response['data'])
      let data = response['data'][0]
      setCompleteData(data)
      setSelectedFromEmail(BTCFromEmailIDs.find(option => option.value === data.fromAddress)); // Capture the value in a state for formData

                getCompanyData(data)
                  setguestEmail(data.BTCCompanyEmail)
                  let EMail = data.guestEmail+' '+data.bookerEmail
                  setCC1_Email(data.guestEmail)
                  setCC2_Email(data.bookerEmail)

                  console.log(data.guestEmail,data.bookerEmail)
                  setCCOpen(true)
                  setLoadingVar(false);
                setcomposeOpen(true)
      // setShowBTCEmailHistory(true)
    
  })
}

const getMergedBtcInvByID = (data)=>{
  setloadingMessage('Please wait while we load the Email Template');
  setLoadingVar(true);
  let invoiceID
  if(data.Type == 'PMS'){
    invoiceID = data.PMSInvID
  }else{
    invoiceID = data.POSInvID
  }
  
  fetch(API_URL + `/getBTCInvoiceByID?invoiceID=${invoiceID}&Type=${data.Type}`)
  .then(result => result.json())
  .then(response => {
      console.log(response['data'])
      let data = response['data'][0]
      setCompleteData(data)
      setSelectedFromEmail(BTCFromEmailIDs.find(option => option.value === data.fromAddress)); // Capture the value in a state for formData

                getCompanyData(data)
                  setguestEmail(data.BTCCompanyEmail)
                  let EMail = data.guestEmail+' '+data.bookerEmail
                  setCC1_Email(data.guestEmail)
                  setCC2_Email(data.bookerEmail)

                  console.log(data.guestEmail,data.bookerEmail)
                  setCCOpen(true)
                  setLoadingVar(false);
                setcomposeOpen(true)
      // setShowBTCEmailHistory(true)
    
  })
}
  const getBTCEmailHistory = (data) => {

  
    fetch(API_URL + `/getBTCEmailHistory?billNoDisplay=${data['billNoDisplay']}`)
      .then((result) => {
        if (!result.ok) {
          throw new Error('Network response was not ok');
        }
        return result.json();
      })
      .then((response) => {
        setBTCEmailHistory(response['data']);
        setLoadingVar(false); // Hide the loading indicator after success
      })
      .catch((error) => {
        console.error('Error fetching BTC Email History:', error);
  
        // Hide the loading indicator and show the popup error message
        setLoadingVar(false);
        setErrorMessage('Could not process your request. Please try again.');
        setshowErrorMsg(true);
      });
  };
// getBTCEmailConfig
  const getCompanyData = (data) =>{
    console.log('inside here')
    fetch(API_URL + `/getBTCEmailConfig?`)
    .then(result => result.json())
    .then(BTCEmailCon => {
        setBTCEmailConfig(BTCEmailCon['data'])
        // setShowBTCEmailHistory(true)
   


    fetch(API_URL + `/getAccountsByID?companyid=${data['BTCAccID']}`)
    .then(result => result.json())
    .then(response => {
      let extraString = ''
      if(data.Type == 'PMS'){
        extraString = 'Room Stay Invoice for '+String(data.invoiceDate)
      }else{
        extraString = 'Food Invoice for '+String(data.invoiceDate)

      }
      let BTCConfig = BTCEmailCon['data'][0]
        setBTCCompanyDetails(response['data'])
        console.log("BTCEmailConfig",BTCEmailConfig)
        // setBody(`
        //   Dear Sir/Ma’am,
    
        //   I hope this message finds you well. Please find attached ${response['data'][0]['accountName']} ${extraString}. Kindly arrange for payment at your earliest convenience.
        //   For your convenience in processing the payment, please find our bank details and the Razorpay payment link below:
        //   Bank Account Information
          
        //     ${BTCConfig.bankName ? `Bank Name: ${BTCConfig.bankName}` : ''}
        //     ${BTCConfig.accountName ? `Account Name: ${BTCConfig.accountName}` : ''}
        //     ${BTCConfig.accountNumber ? `Account Number: ${BTCConfig.accountNumber}` : ''}
        //     ${BTCConfig.SWIFTCode ? `SWIFT Code: ${BTCConfig.SWIFTCode}` : ''}
        //     ${BTCConfig.IFSCCode ? `IFSC Code: ${BTCConfig.IFSCCode}` : ''}

        //     ${BTCConfig.razorPayLink ? `Razorpay Link: ${BTCConfig.razorPayLink}` : ''}
    
        //   If you have any queries regarding this invoice or need further assistance, please do not hesitate to contact us. We appreciate your prompt attention to this matter.
        //   Thank you for your continued business.
        // `)
setEditableText(` I hope this message finds you well. Please find attached ${response['data'][0]['accountName']} ${extraString}. Kindly arrange for payment at your earliest convenience.`)
        setBody(`For your convenience in processing the payment, please find our bank details and the Razorpay payment link below:

Bank Account Information

${BTCConfig.bankName ? `Bank Name: ${BTCConfig.bankName}` : ''}
${BTCConfig.accountName ? `Account Name: ${BTCConfig.accountName}` : ''}
${BTCConfig.accountNumber ? `Account Number: ${BTCConfig.accountNumber}` : ''}
${BTCConfig.SWIFTCode ? `SWIFT Code: ${BTCConfig.SWIFTCode}` : ''}
${BTCConfig.IFSCCode ? `IFSC Code: ${BTCConfig.IFSCCode}` : ''}

${BTCConfig.razorPayLink ? `Razorpay Link: ${BTCConfig.razorPayLink}` : ''}

If you have any queries regarding this invoice or need further assistance, please do not hesitate to contact us. We appreciate your prompt attention to this matter.

Thank you for your continued business.
  `)

        console.log('subject is',response['data'][0]['accountName'] +extraString )
        setSubject(response['data'][0]['accountName']+' ' +extraString )

        setBody1(`
          <p>Dear Sir/Ma’am,</p><br></br>
          <p>I hope this message finds you well. Please find attached ${response['data'][0]['accountName']} Room Stay invoice for 16-01-2025. Kindly arrange for payment at your earliest convenience.</p>
          <p>For your convenience in processing the payment, please find our bank details and the Razorpay payment link below:</p>
          <p><strong>Bank Account Information</strong></p><br></br>
          <ul>
            ${BTCConfig.bankName ? `<li><strong>Bank Name:</strong> ${BTCConfig.bankName}</li>` : ''}
            ${BTCConfig.accountName ? `<li><strong>Account Name:</strong> ${BTCConfig.accountName}</li>` : ''}
            ${BTCConfig.accountNumber ? `<li><strong>Account Number:</strong> ${BTCConfig.accountNumber}</li>` : ''}
            ${BTCConfig.SWIFTCode ? `<li><strong>SWIFT Code:</strong> ${BTCConfig.SWIFTCode}</li>` : ''}
            ${BTCConfig.IFSCCode ? `<li><strong>IFSC Code:</strong> ${BTCConfig.IFSCCode}</li>` : ''}
          </ul><br></br>
            ${BTCConfig.razorPayLink ? `
    <p><strong>Razorpay Link</strong></p>
    <p><a href="${BTCConfig.razorPayLink}">${BTCConfig.razorPayLink}</a></p><br>
  ` : ''}<br></br>
          <p>If you have any queries regarding this invoice or need further assistance, please do not hesitate to contact us. We appreciate your prompt attention to this matter.</p>
          <p>Thank you for your continued business.</p>
        `)
        // setShowBTCEmailHistory(true)
      
    })
       
  })
  }

  const getAttachments = (data) => {
    setloadingMessage('Please wait while we load the Reservation Attachments');
    setLoadingVar(true);

    let tempJSON = {
        "tempReservationID": data.tempReservationID,
        "bookingID": data.bookingID,
        "guestName": data.GuestOutletName
    };

    setReservationData(tempJSON);
    
    // Delay turning off the loading state until the modal is shown
    setShowAttachments(true);

    // Use a setTimeout or similar mechanism to delay the loading state update
    setTimeout(() => {
        setLoadingVar(false);
    }, 300); // Adjust delay time as needed for modal rendering
}

const getPOSAttachments = (data) => {
  setloadingMessage('Please wait while we load the POS Attachments');
  setLoadingVar(true);

  if (data.Type === 'POS') {
    setPOSBillData(data);

    // Delay showing the modal to ensure the loading message stays visible
    setTimeout(() => {
      setAddAttachments(true);
      setLoadingVar(false);
    }, 300); // Adjust the timeout as needed for modal rendering
  } else {
    setErrorMessage('Attachments to be added only for POS Bills');

    // Delay showing the error message
    setTimeout(() => {
      setshowErrorMsg(true);
      setLoadingVar(false);
    }, 300); // Adjust the timeout as needed for error message rendering
  }
};


//   isPosted IS NULL OR isPosted=0 AND ErrorResponse IS NULL
// isPosted = 1 AND isPostedIRN = 0 
// isPosted  = 0 AND ErrorResponse IS NOT NULL
  const getRowStyle = params => {
    if ((params.data && params.data.isPosted === null || params.data.isPosted===0) && params.data.ErrorResponse === null) {
      return { background: '#9C9BAB' }; // grey
    }
    if(params.data && params.data.isPosted === 1 && params.data.PostIRN===1 && params.data.isPostedIRN === 0){
      return {background : '#EE963D'};  // orange
    }
    if(params.data && params.data.isPosted  === 0 && params.data.ErrorResponse!= null){
      return {background : '#EF2B2B'};  // red

    }
    if(params.data && params.data.isPosted === 1 && params.data.EmailSent==='No'){
      return {background : '#EACB1A'};  // yellow
    }
    if(params.data && params.data.isPosted === 1 && params.data.EmailSent === 'Yes'){
      return {background : '#52ED3F'}  // green

    }
    return null;
  };


  // Conditions mapped to colors and labels
const conditions = [
  {
    label: 'Not Posted',
    color: '#9C9BAB',
    filter: (data) => (data.isPosted === null || data.isPosted === 0) && data.ErrorResponse === null,
  },
  {
    label: 'Email Not Sent',
    color: '#EACB1A',
    filter: (data) => data.isPosted === 1 && data.EmailSent === 'No' && data.PostIRN === 0 && data.isPostedIRN === 0,
  },
  {
    label: 'IRN Not Pushed',
    color: '#EE963D',
    filter: (data) => data.isPosted === 1 && data.PostIRN === 1 && data.isPostedIRN === 0,
  },
  {
    label: 'Error Posting',
    color: '#EF2B2B',
    filter: (data) => data.isPosted === 0 && data.ErrorResponse !== null,
  },

  {
    label: 'Email Sent',
    color: '#52ED3F',
    filter: (data) => data.isPosted === 1 && data.EmailSent === 'Yes',
  },
];

const handleError = (message) => {
  return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      customClass: {
          confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
  })
}


  const loadPageData = (page) => {
    fetch(API_URL + `/getBTCInvoicesByDate?hotelID=1&FromDate=2024-09-01&ToDate=2024-09-01&isVerified=0`)
      .then((result) => result.json())
      .then((response) => {
        for(let i=0 ;i<response['data'].length;i++){
            setRowData(rowData=>[...rowData,(response['data'][i])])
            setFilteredData(rowData=>[...rowData,(response['data'][i])])
          }
      });
  };

  const getIRNInvoice = (data) => {
    setloadingMessage('Please wait while we load your IRN Invoice');
    setLoadingVar(true);
    
    fetch(API_URL + "/getIRNInvoice", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Type: data.Type,
        InvoiceID: data.id,
        billNoDisplay: data.billNoDisplay
      })
    })
    .then(result => result.json())
    .then(resp => {
      if (resp.statusCode === 200) {
        setInvURL(API_URL + '/images/' + resp['data']);
        setShowInv(true);
        setLoadingVar(false); // Hide loading when successful
      } else {
        // In case the statusCode is not 200, handle the error
        setErrorMessage('Could not process your request, please try again');
        setshowErrorMsg(true);
        setLoadingVar(false); // Hide loading when error occurs
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage('Could not process your request, please try again');
      setshowErrorMsg(true);
      setLoadingVar(false); // Hide loading when an error occurs
    });
  };
  

  const RegenerateIRNInvoice = (data) => {
    setloadingMessage('Please wait while we Regenerate your IRN Invoice');
    setLoadingVar(true);
    fetch(API_URL + "/regenerateIRN", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        billNoDisplay:data.billNoDisplay,
        zohoRecordID:data.zohoBooksRecordID
          })
    }).then(result => result.json())
    .then(resp => {
        if(resp.statusCode==200){
          handleSuccess("IRN Invoice Regenerated successfully");
          setLoadingVar(false);
    
        }else{
          handleError("Error in Regenerating IRN")
          setLoadingVar(false);

        }
      }).catch((error) => {
        console.log(error)
      })
  }
  const getInvoice = (data) => {
    setloadingMessage('Please wait while we load your Invoice document');
    setLoadingVar(true);
  
    const showError = () => {
      setErrorMessage('Could not process your request, please try again');
      setshowErrorMsg(true);
      setTimeout(() => {
        setErrorMessage('');
        // setshowErrorMsg(false);
      }, 2000); // Show the error message for 2 seconds
    };
  
    if (data.Type == 'POS') {
      if (!is_test) {
        fetch(API_URL + "/gets3DocumentIDPMS", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelID: 1,
            DocName: 'POSInvoice',
            transactionID: '',
            reservationID: '',
            billNo: String(data.billNoDisplay).replaceAll("/", "_").replaceAll("-", ""),
          }),
        })
          .then((result) => result.json())
          .then((resp) => {
            if (resp.statusCode === 200) {
              setInvURL(API_URL + '/images/' + resp['data']);
              setShowInv(true);
              setloadingMessage('');
              setLoadingVar(false);
            } else {
              showError();
            }
          })
          .catch((error) => {
            console.error(error);
            showError();
          });
      } else {
        let url =
          API_URL +
          '/imagepaths/POS_Invoice/POSInvoice_' +
          data.hotelID +
          '_' +
          String(data.billNoDisplay).replaceAll("/", "_").replaceAll("-", "") +
          '.pdf';
        setInvURL(url);
        setShowInv(true);
        setloadingMessage('');
        setLoadingVar(false);
      }
    } else {
      if (!is_test) {
        fetch(API_URL + "/gets3DocumentIDPMS", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelID: 10,
            DocName: 'PMSInvoice',
            transactionID: '',
            reservationID: data.reservationID,
            billNo: data.billNo,
          }),
        })
          .then((result) => result.json())
          .then((resp) => {
            if (resp.statusCode === 200) {
              setInvURL(API_URL + '/images/' + resp['data']);
              setShowInv(true);
              setloadingMessage('');
              setLoadingVar(false);
            } else {
              showError();
            }
          })
          .catch((error) => {
            console.error(error);
            showError();
          });
      } else {
        setInvURL(
          API_URL +
            '/imagepaths/PMS_Invoice/Invoice/PMSInvoice_' +
            data.reservationID +
            '_' +
            data.billNo +
            '.pdf'
        );
        setShowInv(true);
        setloadingMessage('');
        setLoadingVar(false);
      }
    }
  };
  


    const getMergedFile = (formdata) => {
      console.log('Multiple invoices',allInv)
      console.log(formdata);
      console.log(data)
      setloadingMessage('Please wait while we load your merged document');
      setLoadingVar(true);
    
      // Timeout handler
      const timeout = () => {
        setshowErrorMsg(true)
        setErrorMessage('Could not complete your request. Please try again.');
       
      }; // 2-minute timeout
    
      const handleError = (error) => {
        console.error(error);
        clearTimeout(timeout);
        setshowErrorMsg(true)

        setErrorMessage('Could not complete your request. Please try again.');
        setLoadingVar(false);

        
      };
    
      const handleSuccess = (resp, url) => {
        clearTimeout(timeout);
        if (resp.statusCode === 200) {
          setInvURL(url);
          setShowInv(true);
          setLoadingVar(false)
        } else {
          handleError('Non-200 response: ' + resp.statusCode);
          setLoadingVar(false);

        }
      };   
   if(allInv.length==0){

    
      if (formdata.Type === 'POS') {
        if (!is_test) {
          fetch(API_URL + "/getMergedFileBTC", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              Type: formdata.Type,
              InvID: formdata.POSInvID,
              billNoDisplay: formdata.billNoDisplay,
            }),
          })
            .then((result) => result.json())
            .then((resp) => {
              handleSuccess(resp, API_URL + '/images/' + resp['data']);
            })
            .catch(handleError);
        } else {
          setloadingMessage('');
          setLoadingVar(false);
        }
      } else {
        if (!is_test) {
          fetch(API_URL + "/getMergedFileBTC", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              Type: formdata.Type,
              InvID: formdata.PMSInvID,
              billNoDisplay: formdata.billNoDisplay,
            }),
          })
            .then((result) => result.json())
            .then((resp) => {
              handleSuccess(resp, API_URL + '/images/' + resp['data']);
            })
            .catch(handleError);
        } else {
          setloadingMessage('');
          setLoadingVar(false);
        }
      }
    }else{
      // data.FromDate = '2024-09-01'
      // data.ToDate = '2024-09-01'
      fetch(API_URL + "/MergeSelectedInvoices", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromDate : data.FromDate,
          toDate : data.ToDate,
          AllInvoices : allInv,
          POSInvoices:POSInvoicesSelected,
          PMSInvoices : PMSInvoicesSelected,
          PMSInvIDArr : PMSInvoiceIDArr,
          POSInvIDArr:POSInvoiceIDArr
        }),
      })
        .then((result) => result.json())
        .then((resp) => {
          handleSuccess(resp, API_URL + '/images/' + resp['data']);
          // handleSuccess(resp,'file:///var/www/html/GRN1.pdf')
          console.log(resp)
        })
        .catch(handleError);
   
    }
    };
    

    

const defaultColDef = useMemo( ()=> (
  {
    sortable: true, 
    autoHeight:true,
    filter: true,
    wrapText:true,
    filterParams :{
    buttons : ['apply','reset']
    }
  }
));
  // useEffect(() => {
  //   loadPageData(debouncedPage * 10);
  // }, [debouncedPage]);

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
    const bankDetails = {
      bankName: "STATE BANK OF INDIA",
      accountName: "THE OTERRA A UNIT IF VISPL ESCROW A/C",
      accountNumber: "42146451387",
      swiftCode: "SBININBB112",
      ifscCode: "SBIN0006861"
    };
    let [body, setBody] =  useState('');
    let [body1, setBody1] = useState('');
    const [ExtraBody,setExtraBody] = useState('')
    const [isVerified, setIsVerified] = useState(true);

    const [CompleteData,setCompleteData] = useState()
    const { reset, handleSubmit, control ,formState: { errors }
  } = useForm({ });
     
  const SendEmail = (formData) =>{
    setloadingMessage(`Please wait... We're sending the email,
      which may take a little longer. Please be patient!`)
setLoadingVar(true)
    
    formData.FromEmailID = SelectedFromEmail
    const convertedHtml = `<p>${editableText.replace(/\n/g, '<br>')+body.replace(/\n/g, '<br>')}</p>`;
        setHtmlData(convertedHtml); // Store the converted HTML in state

    // You can now use the HTML data as needed, e.g., send it in an API request
    console.log('Submitted HTML Data:', convertedHtml);


    if(ExtraBody!=''){
      body1 = body1+'<br></br><p>For any Further assistance Please contact: '+ExtraBody+'</p>'
    }
    let ccAddress = ''
    if(formData['email-to'] == undefined){
      formData['email-to'] = guestEmail
    }
    if(formData['email-cc'] == undefined){
      formData['email-cc'] = CC1_Email+' '+CC2_Email
    }

    if(CC1_Email!=undefined || CC1_Email != null){
      ccAddress = CC1_Email + ';'
    }
    if(CC2_Email!=undefined || CC2_Email != null){
      ccAddress +=CC2_Email
    }

    if(allInv.length==0){

    fetch(API_URL + "/sendBTCInv", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Type:CompleteData.Type,
        BTCAccID:CompleteData.BTCAccID,
        fromAddress : formData.FromEmailID.value,
        toAddress:guestEmail,
        ccAddress:ccAddress,
        InvID:CompleteData.id,
        billNoDisplay:CompleteData.billNoDisplay,
        EmailBody:convertedHtml,
        Subject:Subject
          })
    }).then(result => result.json())
    .then(resp => {
      setExtraBody('')
        if(resp.statusCode==200){
          setLoadingVar(false)
          setcomposeOpen(false)
          handleSuccess("Email sent successfully")
        }else{
          setLoadingVar(false)
          setcomposeOpen(false)
            handleError("Could not send Email")
        }
        
      }).catch((error) => {
        setcomposeOpen(false)
        setLoadingVar(false)
        handleError("Could not send Email")
      })
    }else{
      fetch(API_URL + "/emailSelectedBTCInv", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromDate : data.FromDate,
          toDate : data.ToDate,
          fromAddress : formData.FromEmailID.value,
          toAddress:guestEmail,
          ccAddress:ccAddress,
          EmailBody:convertedHtml,
          Subject:Subject,
          AllInvoices : allInv,
            POSInvoices:POSInvoicesSelected,
            PMSInvoices : PMSInvoicesSelected,
            PMSInvIDArr : PMSInvoiceIDArr,
            POSInvIDArr:POSInvoiceIDArr
            })
      }).then(result => result.json())
      .then(resp => {
        setExtraBody('')
          if(resp.statusCode==200){
            setLoadingVar(false)
            setcomposeOpen(false)
            handleSuccess("Email sent successfully")
          }else{
            setLoadingVar(false)
            setcomposeOpen(false)
              handleError("Could not send Email")
          }
          
        }).catch((error) => {
          setcomposeOpen(false)
          setLoadingVar(false)
          handleError("Could not send Email")
        })
    }
   
  }

  const SendMergedEmail = (data) =>{
    setloadingMessage(`Please wait... We're sending the email,
      which may take a little longer. Please be patient!`)
setLoadingVar(true)
    console.log(data)
    console.log(SelectedFromEmail)
    data.FromEmailID = SelectedFromEmail
    const convertedHtml = `<p>${editableText.replace(/\n/g, '<br>')+body.replace(/\n/g, '<br>')}</p>`;
        setHtmlData(convertedHtml); // Store the converted HTML in state

    // You can now use the HTML data as needed, e.g., send it in an API request
    console.log('Submitted HTML Data:', convertedHtml);


    if(ExtraBody!=''){
      body1 = body1+'<br></br><p>For any Further assistance Please contact: '+ExtraBody+'</p>'
    }
    let ccAddress = ''
    if(data['email-to'] == undefined){
      data['email-to'] = guestEmail
    }
    if(data['email-cc'] == undefined){
      data['email-cc'] = CC1_Email+' '+CC2_Email
    }

    if(CC1_Email!=undefined || CC1_Email != null){
      ccAddress = CC1_Email + ';'
    }
    if(CC2_Email!=undefined || CC2_Email != null){
      ccAddress +=CC2_Email
    }

    fetch(API_URL + "/emailSelectedBTCInv", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromDate : data.FromDate,
        toDate : data.ToDate,
        fromAddress : data.FromEmailID.value,
        toAddress:guestEmail,
        ccAddress:ccAddress,
        EmailBody:convertedHtml,
        Subject:Subject,
        AllInvoices : allInv,
          POSInvoices:POSInvoicesSelected,
          PMSInvoices : PMSInvoicesSelected,
          PMSInvIDArr : PMSInvoiceIDArr,
          POSInvIDArr:POSInvoiceIDArr
          })
    }).then(result => result.json())
    .then(resp => {
      setExtraBody('')
        if(resp.statusCode==200){
          setLoadingVar(false)
          setcomposeOpen(false)
          handleSuccess("Email sent successfully")
        }else{
          setLoadingVar(false)
          setcomposeOpen(false)
            handleError("Could not send Email")
        }
        
      }).catch((error) => {
        setcomposeOpen(false)
        setLoadingVar(false)
        handleError("Could not send Email")
      })
  
   
  }


  const handleCheckboxChange = (event) => {
    setIsVerified(event.target.checked);
};

const handleSuccess = (message) => {
  return MySwal.fire({
      text: message,
      icon: 'success',
      customClass: {
          confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
  })
}

const updateEmailBodyChange = (data) =>{
  console.log(data)
let InvID
let Verification = 0
  if(SelectedRowData.Type=='PMS'){
    InvID = SelectedRowData.PMSInvID
  }else{
    InvID= SelectedRowData.POSInvID
  }

if(isVerified==true){
  Verification = 1

}

if(ExtraBody!=''){
  body1 = body1+'<br></br><p>For any Further assistance Please contact: '+ExtraBody+'</p>'
}

    setExtraBody('')
  fetch(API_URL + "/updateEmailBody", {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Type:SelectedRowData.Type,
      InvoiceID:InvID,
      EmailBody:data.body,
      isVerified:Verification,
      fromAddress:data.fromAddress,
      toAddress:data.guestEmail,
      guestEmail : data.CC1_Email,
      bookerEmail : data.CC2_Email
        })
  }).then(result => result.json())
  .then(resp => {
        // Clear the form fields
        reset();

      if(resp.statusCode==200){
        handleSuccess("Email Saved successfully");
  
  
      }

      setcomposeOpen(false)
    }).catch((error) => {
      console.log(error)
    })
}

  const handleEmailChange = (event) => {
    setguestEmail(event.target.value); // Update the guestEmail state with the input value
  };

  const handleSubjectChange = (event) =>{
    setSubject(event.target.value)
  }
  const handleCC1EmailChange = (event) => {
    setCC1_Email(event.target.value); // Update the guestEmail state with the input value
  };
  const handleCC2EmailChange = (event) => {
    setCC2_Email(event.target.value); // Update the guestEmail state with the input value
  };
  const handleExtraBodyChange = (e) => setExtraBody(e.target.value);

  const params = {
    fileName: 'BTC Invoices', // Set your desired file name here
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Convert text to HTML by wrapping it in a paragraph tag (for simplicity)
    const convertedHtml = `<p>${body.replace(/\n/g, '<br>')}</p>`;
    setHtmlData(convertedHtml); // Store the converted HTML in state

    // You can now use the HTML data as needed, e.g., send it in an API request
    console.log('Submitted HTML Data:', convertedHtml);
    handleSubmit(SendEmail, { guestEmail, CC1_Email, CC2_Email, body });
  };

  const onBtnExport = useCallback(() => {
    gridRef1.current.api.exportDataAsCsv(params);
  }, []);

  const ConfirmSubmit = (data) => {
    setData(data)
    data.FromDate=(Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD'))
    data.ToDate=(Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD'))
setloadingMessage(`Please wait... We're processing your request,
                    which may take a little longer due to additional data. Please be patient!`)
setLoadingVar(true)


fetch(API_URL + `/getBTCInvoicesByDate?hotelID=1&FromDate=${data.FromDate}&ToDate=${data.ToDate}&isVerified=0`)
.then((result) => result.json())
.then((response) => {
  setFilteredData([])
  setRowData(response['data'])
  setFilteredData(response['data'])
  setloadingMessage('')
    setLoadingVar(false)
})
   

  .catch((error) => {
    console.log(error)
    setloadingMessage('')
    setLoadingVar(false)

  })


  
  }
  

  const getVerfiedEmails = () => {
    data.FromDate=(Moment(String(new Date(data.FromDate))).format('YYYY-MM-DD'))
    data.ToDate=(Moment(String(new Date(data.ToDate))).format('YYYY-MM-DD'))
setloadingMessage(`Please wait... We're processing your request,
                    which may take a little longer due to additional data. Please be patient!`)
setLoadingVar(true)

fetch(API_URL + `/getBTCInvoicesByDate?hotelID=1&FromDate=${data.FromDate}&ToDate=${data.ToDate}&isVerified=1`)
.then((result) => result.json())
.then((response) => {

  setRowData(response['data'])
  setFilteredData(response['data'])
  setloadingMessage('')
    setLoadingVar(false)
})
   

  .catch((error) => {
    console.log(error)
    setloadingMessage('')
    setLoadingVar(false)

  })


  
  }
  

  return (
    <div>
   
        {/* <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={filteredData.length > 0 ? filteredData : rowData}
          columnDefs={columnDefs}
          getRowStyle={getRowStyle}
        />
      </div> */}
  
         <Card>
            <CardHeader>
              <CardTitle tag="h4"><b>All BTC Invoices</b></CardTitle>
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
                    <Col md="4" sm="12" className="mb-1">
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
        <Col md='2' sm='3' className="mb-1">
            <div  style={{ margin: '2px 0' }}>
            <Button.Ripple color='primary' style={{ marginTop: '22px'}} onClick={onBtnExport}  >Download CSV file</Button.Ripple>
            </div>
            </Col>
            <Col md='2' sm='3' className="mb-1">
            <div  style={{ margin: '2px 0' }}>
            <Button.Ripple color='primary' style={{ marginTop: '22px'}} disabled={data.length===0} onClick={()=>{getVerfiedEmails(data)
              setIsVerifiedRows(true)
            }}  >View verified Email</Button.Ripple>
            </div>
            </Col>
     </Row>
     {data.length!=0 && IsVerifiedRows==false && <p>Invoices from {data.FromDate} to {data.ToDate}</p>}
      {data.length!=0 && IsVerifiedRows==true && <p>Verified Invoices from {data.FromDate} to {data.ToDate}</p>}

 {/* Buttons to Filter Data */}
    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {conditions.map((condition, index) => (
          <button
            key={index}
            style={{
              backgroundColor: condition.color,
              borderRadius: '4px',

              color: 'black',
              padding: '8px',
              border: 'none',
              cursor: 'pointer',
              outline: selectedFilter === condition.label ? '2px solid black' : 'none',
            }}
            onClick={() => handleFilter(condition.filter, condition.label)}
            >
            {condition.label}
          </button>
        ))}
         {/* Button to View All Rows */}
         <button
 style={{
  backgroundColor: '#D359DD',
  borderRadius: '4px',

  color: 'black',
  padding: '8px',
  border: 'none',
  cursor: 'pointer',
  outline: selectedFilter === "View All" ? '2px solid black' : 'none',
}}
          onClick={handleShowAllRows}
        >
          View All
        </button>
      </div>

      <div className='inline-spacing' align="right"  style={{ margin: '2px 0' }}>
    {(PMSInvoiceIDArr.length!=0 || POSInvoiceIDArr.length!=0) && <Button style={{ margin: '2px 2px' ,marginLeft:16,marginRight:16 }} align='right'  color="primary" onClick={() => {getMergedBtcInvByID(allInv[0])}}>Send Email</Button>}
    </div>
      <div className="ag-theme-alpine" style={{ height: 540 }}>

      {/* {setAggridData(rowData)} */}
      
         <AgGridReact
        ref={gridRef1}
        
          onGridReady={onGridReady}
          getRowStyle={getRowStyle}
          rowData={filteredData}
          columnDefs={columnDefs}
          onCellValueChanged={onCellValueChanged}
          onCellClicked={cellClickedListener}

          singleClickEdit={true}
          animateRows={true}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={10}
          defaultColDef={defaultColDef}
          suppressRowClickSelection={true} // Ensure row selection is suppressed

          onSelectionChanged={onSelectionChanged}

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
      <div className="compose-mail-form-field">
      <Label className="form-label" htmlFor="FromEmailID">
  From<span className="text-danger">*</span>
</Label>
<Controller
  id="FromEmailID"
  control={control}
  name="FromEmailID"
  rules={{ required: "From Email is required" }}
  render={({ field, fieldState: { error } }) => (
    <Select
      {...field}
      isClearable
      options={BTCFromEmailIDs}
      classNamePrefix="select"
      className={classnames("react-select", {
        "is-invalid": !!error,
      })}
      value={BTCFromEmailIDs.find(option => option.value === field.value) || null} // Ensure the value is displayed correctly
      onChange={(selectedOption) => {
        field.onChange(selectedOption ? selectedOption.value : null); // Update field value directly
        setSelectedFromEmail(selectedOption || BTCFromEmailIDs.find(option => option.value === CompleteData.fromAddress)); // Capture the value in a state for 
      }}
    />
  )}
/>
  {data && data.FromEmailID === null && (
    <span className="text-danger">This field is required.</span>
  )}
</div>
      <div className='compose-mail-form-field'>
        <Label htmlFor='email-to' className='form-label'>To:</Label>
        <div className='flex-grow-1'>
          <InputGroup className="input-group-merge">
            <Input
              type="text"
              id="email-to"
              name="email-to"
              value={guestEmail}
              onChange={handleEmailChange}
              required
            />
          </InputGroup>
        </div>
      </div>

      {ccOpen && (
        <div className='compose-mail-form-field'>
          <Label htmlFor='email-cc' className='form-label'>Guest Email (cc):</Label>
<div className='flex-grow-1'>
  <InputGroup className="input-group-merge">
    <Input
      type="text"  // The email input type is still used to ensure correct format
      placeholder='Guest Email'
      id="email-cc"
      name="email-cc"
      value={CC1_Email}
      onChange={handleCC1EmailChange}
      // Optional: Add a custom validation to allow semicolons in the email
      // pattern="^[a-zA-Z0-9._%+-;]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"  // Regex that allows semicolons
    />
  </InputGroup>
</div>
          <Label htmlFor='email-cc' className='form-label'>Booker Email (cc):</Label>
<div className='flex-grow-1'>
  <InputGroup className="input-group-merge">
    <Input
      type="text"  // The email input type is still used to ensure correct format
      placeholder='Booker Email'
      id="email-cc"
      name="email-cc"
      value={CC2_Email}
      onChange={handleCC2EmailChange}
      // Optional: Add a custom validation to allow semicolons in the email
      // pattern="^[a-zA-Z0-9._%+-;]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"  // A regex that allows semicolons in email addresses
    />
  </InputGroup>
</div>
</div>

      )}
      <div className='compose-mail-form-field'>
        <Label htmlFor='Subject' className='form-label'>Subject:</Label>
        <div className='flex-grow-1'>
          <InputGroup className="input-group-merge">
            <Input
              type="text"
              id="Subject"
              name="Subject"
              value={Subject}
              onChange={handleSubjectChange}
              required
            />
          </InputGroup>
        </div>
      </div>

{/* <Label htmlFor='Body' className='form-label'>Body:</Label>
      <div className='flex-grow-1'>
        <InputGroup className="input-group-merge">
          <Input
          disabled={true}
            type='textarea'
            name='text'
            id='exampleText'
            rows='3'
            placeholder='Textarea'
            value={body}
            onChange={handleBodyChange}
          />
        </InputGroup>
      </div> */}

<div>
      <Label htmlFor="editableBody" className="form-label">Body:</Label>
      {/* Editable Part */}
      <InputGroup className="input-group-merge mb-2">
        <Input
          type="textarea"
          id="editableBody"
          rows="3"
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
        />
      </InputGroup>

      {/* Non-Editable (Fixed) Part */}
      <InputGroup className="input-group-merge">
        <Input
          type="textarea"
          id="fixedBody"
          rows="6"
          value={body}
          disabled={true}
        />
      </InputGroup>
    </div>

                          
                           

      <div className='compose-mail-form-field' style={{ display: 'flex', alignItems: 'center', marginTop: '10px', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label htmlFor='verified' className='form-label' style={{ marginRight: '10px', marginTop: '10px' }}><b>Verified:</b></Label>
          <InputGroup className="input-group-merge">
            <Input
              type="checkbox"
              id="verified"
              name="verified"
              checked={isVerified}
              onChange={handleCheckboxChange}
            />
          </InputGroup>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
        <Button color='primary' style={{ marginTop: '22px' ,width: 150 , height:40 }} onClick={() =>{
              console.log(params.data)
              getMergedFile(CompleteData)} } >Merged Doc</Button>
          {/* <Button style={{ marginTop: '22px' }} color='primary' type='submit' onClick={updateEmailBodyChange}>
            Save
          </Button> */}
          {allInv.length==0 && <Button
  style={{ marginTop: '22px' }}
  color='primary'
  onClick={() => {
    const formData = {
      fromAddress: SelectedFromEmail ? SelectedFromEmail.value : null,
      guestEmail,
      CC1_Email,
      CC2_Email,
      body,
      isVerified,
    };

    console.log('Form Data:', formData); // Debugging: Check the data being passed
    updateEmailBodyChange(formData); // Pass the form data directly
  }}
>
  Save
</Button>}
          <Button style={{ marginTop: '22px' }} type='submit' color='primary'>
            Send
          </Button>
        </div>
      </div>
    </Form>
      </ModalBody>
    </Modal>


    <div>
                      <Modal isOpen={ShowAttachments} toggle={() => setShowAttachments(!ShowAttachments)} className='modal-lg'>
                        <ModalHeader className='modal-lg' toggle={() => setShowAttachments(!ShowAttachments)}>Reservation Attachments</ModalHeader>
                        <ModalBody className='pb-3 px-sm-1 mx-20'>
                          <Attachments data1={ReservationData} />
                        </ModalBody>
                      </Modal>
                    </div>

                    <div>
                      <Modal isOpen={AddAttachments} toggle={() => setAddAttachments(!AddAttachments)} className='modal-lg'>
                        <ModalHeader className='modal-lg' toggle={() => setAddAttachments(!AddAttachments)}>POS Bill Attachments</ModalHeader>
                        <ModalBody className='pb-3 px-sm-1 mx-20'>
                          <POSAttachments data1={POSBillData} />
                        </ModalBody>
                      </Modal>
                    </div>
                    <div className="disabled-animation-modal">
                <Modal
                    isOpen={ShowActions}
                    toggle={() => setShowActions(!ShowActions)}
                    className='modal-xl'
                >
                    {" "}
                    {/*onClosed={onDiscard}*/}
                    <ModalHeader
                        className="modal-sm"
                        toggle={() => {
                            setShowActions(!ShowActions);
                        }}
                    >
                        {/* Need To Check.. */}
                    </ModalHeader>
                    <ModalBody  className="pb-3 px-sm-2 mx-20">
                        <div>
                            <div >
                                {/* <Card style={{  backgroundColor: '#F2E5D9' }}>
                                    <Row className='cardBody'>
                                        <Col  md='2' sm='12' className='mb-1'>
                                            <div style={{padding:'10px'}}
                                                onClick={() => getInvoice(SelectedRowData)}
                                                className="hoverUnderline"
                                            >
                                                View Invoice
                                            </div>
                                            </Col>
                                            <Col  md='2' sm='12' className='mb-1'>
                                            <div style={{padding:'10px'}}
                                                onClick={() => getIRNInvoice(SelectedRowData)}
                                                className="hoverUnderline"
                                            >
                                                View IRN Invoice
                                            </div>
                                            </Col>
                                            <Col  md='2' sm='12' className='mb-1'>
                                            <div style={{padding:'10px'}}
                                                onClick={() => getAttachments(SelectedRowData)}
                                                className="hoverUnderline"
                                            >
                                                View Attachments
                                            </div>
                                            </Col>
                                    
                                        <Col md='2' sm='12' className='mb-1'>
                                        <div style={{padding:'10px'}}
                                                className="hoverUnderline"
                                            >
                                                View Merged File
                                            </div>
                                          </Col>
                                          <Col md='2' sm='12' className='mb-1'>
                                        <div style={{padding:'10px'}}
                                                onClick={() => RegenerateIRNInvoice(SelectedRowData)}
                                                className="hoverUnderline"
                                            >
                                                Regenerate IRN
                                            </div>
                                          </Col>
                                          
                                             <Col  md='2' sm='12' className='mb-1'>
                                            <div style={{padding:'10px'}}
                                                onClick={() =>{
                                                      setCompleteData(SelectedRowData)
                                                      
                                                     
                                                        setguestEmail(SelectedRowData.BTCCompanyEmail)
                                                        let EMail = SelectedRowData.guestEmail+' '+SelectedRowData.bookerEmail
                                                        setCC1_Email(SelectedRowData.guestEmail)
                                                        setCC2_Email(SelectedRowData.bookerEmail)
                                      
                                                        setCCOpen(true)
                                                      
                                                      setcomposeOpen(true)
                                                    }}
                                                className="hoverUnderline"
                                            >
                                                Send Email
                                            </div>
                                        </Col>

                                    </Row>
                                 
                                </Card> */}
                                 {/* <Card style={{ backgroundColor: '#F2E5D9' }}> */}
    {/* <Row className='cardBody' style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'left', padding: '10px' }}>
      <Col md='12' sm='12' className='mb-1'>
        <Button
          color="primary"
          style={{marginRight:'10px'}}
          onClick={() => getInvoice(SelectedRowData)}
          className="hoverUnderline"
        >
          View Invoice
        </Button>
     
        <Button
          color="primary"
          style={{marginRight:'10px'}}
          onClick={() => getIRNInvoice(SelectedRowData)}
          className="hoverUnderline"
        >
          View IRN Invoice
        </Button>
     
        <Button
          color="primary"
          style={{marginRight:'10px'}}

          onClick={() => getAttachments(SelectedRowData)}
          className="hoverUnderline"
        >
          View Attachments
        </Button>

        <Button
          color="primary"
          style={{marginRight:'10px'}}

          className="hoverUnderline"
        >
          View Merged File
        </Button>
     
        <Button
          color="primary"
          style={{marginRight:'10px'}}

          onClick={() => RegenerateIRNInvoice(SelectedRowData)}
          className="hoverUnderline"
        >
          Regenerate IRN
        </Button>

        <Button
          color="primary"
          style={{marginRight:'10px'}}

          onClick={() => {
            setCompleteData(SelectedRowData);
            setguestEmail(SelectedRowData.BTCCompanyEmail);
            setCC1_Email(SelectedRowData.guestEmail);
            setCC2_Email(SelectedRowData.bookerEmail);
            setCCOpen(true);
            setcomposeOpen(true);
          }}
          className="hoverUnderline"
        >
          Send Email
        </Button>
      </Col>
    </Row> */}
  {/* </Card> */}
                                <Row>
                                  <h4>Email History</h4>
                                    <div className="ag-theme-alpine" style={{ height: 540 }}>

<AgGridReact
ref={gridRef1}
onGridReady={onGridReady}
rowData={BTCEmailHistory}
columnDefs={BTCEMailColDefs}
animateRows={true}
rowSelection="multiple"
pagination={true}
paginationPageSize={10}
defaultColDef={defaultColDef}
// onPaginationChanged={onPageChanged}
/>
</div>
                                    </Row>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>

            {/* EmailHistory */}


    <div>
                      <Modal isOpen={ShowBTCEmailHistory} toggle={() => setShowBTCEmailHistory(!ShowBTCEmailHistory)} className='modal-xl'>
                        <ModalHeader className='modal-lg' toggle={() => setShowBTCEmailHistory(!ShowBTCEmailHistory)}>BTC Email History</ModalHeader>
                        <ModalBody className='pb-3 px-sm-1 mx-20'>
      <div className="ag-theme-alpine" style={{ height: 540 }}>

                        <AgGridReact
        ref={gridRef1}
          onGridReady={onGridReady}
          rowData={BTCEmailHistory}
          columnDefs={BTCEMailColDefs}
          animateRows={true}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={10}
          defaultColDef={defaultColDef}
          // onPaginationChanged={onPageChanged}
        />
 </div>


                        </ModalBody>
                      </Modal>
                    </div>
{/* Show Error message */}

                    <Modal
        isOpen={showErrorMsg}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent' toggle={() => {
                setshowErrorMsg(!showErrorMsg);
              }}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h3 className='text-center mb-1'>{ErrorMessage}</h3>
          
          

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

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={LoadingVar}>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column', // Ensures elements are stacked vertically
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Makes the div span the full viewport height
    }}
  >
    <h1
      style={{
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center', // Centers text horizontally
        marginBottom: '20px', // Adds space between the text and the progress spinner
      }}
    >
      {loadingMessage}
    </h1>
    <div>
      <CircularProgress color="inherit" />
    </div>
  </div>
</Backdrop>
    </div>

  );
};

export default AvailabilityMatrix;
