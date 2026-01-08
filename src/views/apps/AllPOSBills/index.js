
// ** React Imports
import { useState } from 'react'
import Select from "react-select";

import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input, InputGroup, InputGroupText, Table, Modal, ModalHeader, ModalBody, } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'


// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import API_URL from "../../../config";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import Avatar from "@components/avatar";
import { Check } from "react-feather";
import { XCircle } from "react-feather";
// ** Utils
import { selectThemeColors } from "@utils";
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import POSAttachments from '/src/views/dashboard/BTCInvoices/POSAttachments'
import POSLogs from '../POSOrderLogs/index.js'

const MySwal = withReactContent(Swal)
let is_test = false




const AllPOSBills = () => {

  // AG Grid
  const [Today,setToday] = useState()

  const [flag, setFlag] = useState(false)
  const [rowData, setRowData] = useState([]);
  const [ShowPDF, setShowPDF] = useState(false)
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [previewData, setPreviewData] = useState('');
  // ** State
  const [stayNotification, setStayNotification] = useState(false)
  const [openPreviewBill, setopenPreviewBill] = useState(false)
  // ** State
  const [data, setData] = useState(null);
  const [ShowPOSInvPDF, setShowPOSInvPDF] = useState('')
  const [InvURL, setInvURL] = useState([])
  const [isProcessingalert, setIsProcessingalert] = useState(false)
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterResturant, setfilterResturant] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
const [FilterData,setFilterData] = useState([])

  const [open, setOpen] = useState('0')
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gridApi, setGridApi] = useState(null);
 const [loadingMessage,setloadingMessage] = useState('');
  const [LoadingVar,setLoadingVar] = useState(false)
  const [POSBillData,setPOSBillData] = useState([])
  const [AddAttachments,setAddAttachments] = useState(false)
  const [ErrorMessage,setErrorMessage] = useState('')
  const [showErrorMsg,setshowErrorMsg] = useState(false)
    const [ShowPOSLogs,setShowPOSLogs] = useState(false)
    const [OrderDetails,setOrderDetails] = useState([])
  
//   const gridApiRef = useRef(null);
  const [activeButton, setActiveButton] = useState('viewAll'); // Default active button

  const gridRef = useRef();
  
  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));
  const onGridReady = params => {
    setGridApi(params.api);
    gridRef.current = params.api;
};
  const cellClickedListener = useCallback(event => {
    // console.log('cellClicked', event);
  }, []);


  // ** State
  const [storeOptions, setStoreOptions] = useState([]);
  const [colSummaryData, setColSummaryData] = useState([])
  


  let navigate = useNavigate();

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Outlet', field: 'restaurantName',maxWidth: 160 },
    { headerName: 'Bill No', field: 'billNoDisplay', suppressSizeToFit: true, maxWidth: 160 },
    {
      headerName: 'View Invoice', cellRendererFramework: (params) => <Button color='primary' style={{ width: 140 }} onClick={() => {
        getFinalInvoice(params.data)


      }} >View Invoice</Button>, suppressSizeToFit: true, maxWidth: 180
    },
    { headerName: 'Attachments', cellRendererFramework: (params) => {
          return (
        <Button color='primary' style={{ width: 130 }} onClick={() =>{
          console.log(params.data)
          params.data.GuestOutletName = params.data.restaurantName

            getPOSAttachments(params.data)
          
          // 
        } } >Attachments</Button>)},maxWidth: 210 },
            {
              headerName: 'Logs', cellRendererFramework: (params) => <Button color='primary' style={{ width: 80 }} onClick={() => {
                setOrderDetails(params.data)
                setShowPOSLogs(true)
        
              }} >Logs</Button>, suppressSizeToFit: true, maxWidth: 100
            },
    {
      headerName: 'Send', cellRendererFramework: (params) => {
      
          
        {
          if (params.data.billStatus !== 'cancelled') {
            return (
        
              <Button color='primary' style={{ width: 90 }} onClick={() => {
      setCompleteData(params.data)

      setguestEmail('')

      setguestSelect(true)
      setcomposeOpen(true)
              }} >Email</Button>)
          }
        }
      }, suppressSizeToFit: true, maxWidth: 160
    },
    { headerName: 'Order No', field: 'orderID', maxWidth: 120 },
    { headerName: 'Table No', field: 'tableNo', maxWidth: 120 },
    { headerName: 'Amount', field: 'totalAmount', maxWidth: 120 },


    { headerName: 'Payment', field: 'paymentModes', maxWidth: 150 },
    { headerName: 'Customer Name', field: 'guestName', maxWidth: 180 },
    { headerName: "guest GST", field: 'guestCompanyGSTno', maxWidth: 160 },

    { headerName: 'Company Name', field: 'BTCCompany', maxWidth: 150 },
    { headerName: 'BTCCompanyGST', field: 'BTCgstID', width: 230 },

    { headerName: 'Status', field: 'billStatus', maxWidth: 120 },
    { headerName: 'Bill Date', field: 'billDateTime', maxWidth: 180 },

    // { headerName: 'Steward', field: 'stewardName', maxWidth: 120 },
    // { headerName: 'subTotalAfterDisc', field: 'subTotalAfterDisc', width: 250 },
    // { headerName: 'GuestGST', field: 'GuestGST', width: 230 },
    // { headerName: 'BTCCompanyGST', field: 'BTCgstID', width: 230 },
    // { headerName: 'Resettle Reason', field: 'resettleReason' },
    // { headerName: 'isVoid', field: 'isVoid', maxWidth: 120 },
    // { headerName: 'Void Reason', field: 'voidReason' },

  ]);
  useEffect(() => {
    setIsProcessingalert(true)
    fetchx(API_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
          })
    }).then(result => result.json())
    .then(resp => {
       // console.log(resp['data'])
        setToday(resp['data'][0]['businessDate'])
        const filterFromDate = Moment(resp['data'][0]['businessDate']).format("DD-MM-YYYY");
        setFilterFromDate(filterFromDate);
        let res = fetchx(API_URL + "/getAllPOSBills", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "hotelID": 1,
            "fromDate": Moment(String(new Date(resp['data'][0]['businessDate']))).format("YYYY-MM-DD"),
            "toDate": Moment(String(new Date(resp['data'][0]['businessDate']))).format("YYYY-MM-DD")
          })
        }).then(data => data.json())
          .then((res) => {

            // console.log(res);
            setActiveButton('viewAll');
            removeFilters()
            // console.log(res["data"][0]);
            
            if (res['statusCode'] == 200) {
              setIsProcessingalert(false)
              const modifiedData = res["data"].map(item => {
                // console.log(item);
                item.billDateTime = Moment(String(new Date(item.billDateTime))).format("YYYY-MM-DD")
                // Check if item.paymentBreakup is not null and is an array
                const paymentBreakupArray = item.paymentBreakup ? JSON.parse(item.paymentBreakup) : [];
                
                const combinedPaymentModes = paymentBreakupArray.map(payment => payment.paymentMode).join(', ');
    
                // console.log(combinedPaymentModes);
    
                return { ...item, paymentModes: combinedPaymentModes };
              });
    
              // console.log(modifiedData);
              setRowData(modifiedData)
              if (modifiedData.length > 0) {
                setIsProcessingalert(false);
              }
            }
            if ((res['statusCode'] == 403) || res['statuscode'] == 403) {
              setIsProcessingalert(false)
              const swalInstance = MySwal.fire({
                text: data['message'],
                buttonsStyling: false,
                confirmButtonText: 'Close',
                customClass: {
                  confirmButton: 'btn btn-danger',
                },
              });
              swalInstance.then((result) => {
                if (result.isConfirmed) {
                  setRowData([]);

                }
              });
            }
          });
      }).catch((error) => {
       // console.log(error)
      })
    fetchx(API_URL + '/getStoreList?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        const responseData = resp['data'];
        // console.log(responseData);

        // setStoreOptions(options);
        setStoreOptions(responseData);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });

    }, [])
     
  // }, [Today != undefined])
  // ** Hooks

  let defaultValues = {
   
    frmdate: Moment((new Date(Today))).format('YYYY-MM-DD'),
    todate : Moment((new Date(Today))).format('YYYY-MM-DD'),
    
  }
    const { reset, handleSubmit, control } = useForm({ defaultValues })

  const GetAllPOSBills = data => {
    setIsButtonClicked(true)
    setIsProcessingalert(true)
    const storeIDs = data.storeID && data.storeID.map(item => item.value);
    // console.log(storeIDs)
    let createmarketGroup;
    const selectedResturants = data.storeID ? data.storeID.map(item => item.label) : [];
    setfilterResturant(selectedResturants.length > 0 ? selectedResturants : ['All']);
    
    const filterFromDate = Moment(data.frmdate[0]).format("DD-MM-YYYY");
    setFilterFromDate(filterFromDate);

    if (storeIDs && storeIDs.length === 0) {
      // console.log("In if")
      createmarketGroup = JSON.stringify({
        "hotelID": 1,
        "fromDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
        "toDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD")
      })
    }
    else {
      // console.log("In Else")
      createmarketGroup = JSON.stringify({
        "hotelID": 1,
        "storeID": storeIDs,
        "fromDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
        "toDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD")
      })
    }
    // console.log(storeIDs)

    setData(data)
    setFlag(true)

    // console.log(createmarketGroup)

    let res = fetchx(API_URL + "/getAllPOSBills", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then(data => data.json())
      .then((res) => {
        setIsButtonClicked(false)
           // console.log(res);
           setActiveButton('viewAll');
           removeFilters()
        // console.log(res);
        // console.log(res["data"][0]);
        if (res['statusCode'] == 200) {
          setIsProcessingalert(false)
          const modifiedData = res["data"].map(item => {
            item.billDateTime =  Moment(String(new Date(item.billDateTime))).format("YYYY-MM-DD")

            // Check if item.paymentBreakup is not null and is an array
            const paymentBreakupArray = item.paymentBreakup ? JSON.parse(item.paymentBreakup) : [];
            
            const combinedPaymentModes = paymentBreakupArray.map(payment => payment.paymentMode).join(', ');


            return { ...item, paymentModes: combinedPaymentModes };
          });

          console.log(modifiedData);
          setRowData(modifiedData)
        }
        if ((res['statusCode'] == 403) || (res['statusCode'] == 403)) {
          setIsProcessingalert(false)
        }

      });


  }
  const getFinalInvoice = (data) => {
    if(!is_test){
      fetchx(API_URL + "/gets3DocumentIDPOS", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: 1,
          DocName:'POSInvoice',
          transactionID:'',
          billNo:data.billNoDisplay.replaceAll("/", "_").replaceAll("-", "")
            })
      }).then(result => result.json())
      .then(resp => {
          if(resp.statusCode==200){
           
            setInvURL(API_URL+'/images/'+resp['data'])
            setShowPOSInvPDF(true)
      
      
          }
          
        }).catch((error) => {
        })
  
      }else{
        let url = API_URL+'/imagepaths/POS_Invoice/POSInvoice_'+data.hotelID+'_'+data.billNoDisplay.replaceAll("/","_").replaceAll("-","")+'.pdf'
          setInvURL(url)
          setShowPOSInvPDF(true)
      }



  }

  const params = {
    fileName: 'POSInvoices ', // Set your desired file name here
  };

  const onBtnExport = useCallback(() => {
    gridApi.exportDataAsCsv(params);
  }, []);
  const handleReset = () => {
    reset({

      block: ''
    })
  }
  const downloadCSV = () => {
    const csvData = [];
    // Get the table
    const table = document.querySelector('table');

    // Include the header row from the <thead>
    const headerRow = table.querySelector('thead tr');
    const headerData = [];
    const headerCells = headerRow.querySelectorAll('th');
    headerCells.forEach((headerCell) => {
        headerData.push(headerCell.textContent.trim());
    });
    csvData.push(headerData.join(','));

    // Iterate through rows and cells of the <tbody>
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((row) => {
        const rowData = [];
        const cells = row.querySelectorAll('td');
        cells.forEach((cell) => {
            rowData.push(cell.textContent.trim());
        });
        csvData.push(rowData.join(','));
    });

    // Combine all rows into a CSV string
    const csvString = csvData.join('\n');

    // Create a Blob and download link
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table_data.csv';

    // Trigger the download
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
};
  const [composeOpen, setcomposeOpen] = useState(false)
  const [toggleCompose, settoggleCompose] = useState(false)
  const [guestEmail,setguestEmail] = useState()
  const [CompleteData,setCompleteData] = useState()
  const [guestSelect,setguestSelect] = useState(false)
  const [loading, setLoading] = useState(false);

   
const SendEmail = (data) =>{
  setLoading(true)
  // console.log(guestEmail)
  // console.log(CompleteData)
  // if(data['email-to'] == undefined){
  //   data['email-to'] = guestEmail
  // }

  let billno = CompleteData.billNoDisplay.replaceAll("/", "_").replaceAll("-", "")

  // console.log(data)

  fetchx(API_URL + "/sendemailtestPOS", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type:'POSInvoice',
      amount:CompleteData.totalAmount,
      toAddress:guestEmail,
      ccAddress:'',
      BillNo:billno,
      orderID:CompleteData.orderID,
      BillDate:CompleteData.billDateTime,
      hotelID:1,
      storeID:CompleteData.storeID
        })
  }).then(result => result.json())
  .then(resp => {
    setLoading(false)
      if(resp.statusCode==200){
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
      if ((resp['statusCode'] == 403) || resp['statuscode'] == 403) {
        setIsProcessingalert(false)
        const swalInstance = MySwal.fire({
          text: "Could not send Email",
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            setcomposeOpen(false)
          }
        });
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
            {/* <h4>Wait-List Added Successfully</h4> */}
          </div>
        </div>
      );
    })

 
}
const applySettledFilter = () => {
  setFilterData([])

  if (gridApi) {
    gridApi.setQuickFilter('settled'); // Filters rows where billStatus is 'cancelled'
}
}

const applyCancelledFilter = () => {
  setFilterData([])
  console.log(gridApi)
  if (gridApi) {
      gridApi.setQuickFilter('cancelled'); // Filters rows where billStatus is 'cancelled'
  }
};

const applyGSTInvoices = () =>{
  if (gridApi) {
    gridApi.setFilterModel(null);  // ✅ Clears column filters
    gridApi.setQuickFilter('');    // ✅ Clears global quick filter
    gridApi.onFilterChanged();     // ✅ Refresh the grid to apply changes
}
  if (!gridApi) return;

  const allData = [];
  gridApi.forEachNode((node) => {
    allData.push(node.data);
  });

  const filteredData = allData.filter(row => row.guestCompanyGSTno?.trim() || row.BTCgstID?.trim());

  setFilterData(filteredData); // Update the grid with filtered rows
}



const removeFilters = () => {
  setFilterData([])

  console.log('Removing all filters...');
  
  if (gridApi) {
      gridApi.setFilterModel(null);  // ✅ Clears column filters
      gridApi.setQuickFilter('');    // ✅ Clears global quick filter
      gridApi.onFilterChanged();     // ✅ Refresh the grid to apply changes
  }
};

const getPOSAttachments = (data) => {
  setloadingMessage('Please wait while we load the POS Attachments');
  setLoadingVar(true);
  data.GuestOutletName = data.restaurantName

    setPOSBillData(data);

    // Delay showing the modal to ensure the loading message stays visible
    setTimeout(() => {
      setAddAttachments(true);
      setLoadingVar(false);
    }, 300); // Adjust the timeout as needed for modal rendering
 
};
  // Function to handle input change
  const handleEmailChange = (event) => {
    setguestEmail(event.target.value); // Update the guestEmail state with the input value
  };

  // const onFilterTextBoxChanged = useCallback(() => {
  //   gridApi.setQuickFilter(
  //     document.getElementById("filter-text-box").value
  //   );
  // }, []);
  const onFilterTextBoxChanged = useCallback(() => {
    if (gridApi) {
      gridApi.setQuickFilter(
        document.getElementById("filter-text-box").value
      );
    }
  }, [gridApi]);

  const getRowStyle = params => {

    if (params.data && params.data.billStatus === 'cancelled') {
      return { background: '#E3C020' };
    }
    if (params.data && ((params.data.GuestGST != "" && params.data.GuestGST != null)  ||  (params.data.BTCgstID != "" && params.data.BTCgstID != null))) {
      return { background: '#EA9E34' };
    }
    if (params.data && params.data.isVoid === 1) {
      // return { background: '#3598db' };
      return { background: '#E73131' };

      

    }
    return null;
  };


  return (
    <div>
            <Card>
        <CardHeader>
          <CardTitle tag='h4'>All POS Bills</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(GetAllPOSBills)}>
            <Row>
              <Col md='4' sm='12'>
                <div className='mb-1'>
                  <Label className='form-label' for='storeID'>
                    Store Name <spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    id="storeID"
                    control={control}
                    name="storeID"
                    render={({ field }) => (
                      <Select
                        isMulti
                        // required
                        isClearable
                        options={storeOptions}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>
              {Today != undefined && 
              <>
              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="frmdate1">
                   Date<spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id="frmdate"
                    name="frmdate"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        required
                        defaultValue={defaultValues['todate']}

                        options={{ allowInput: true }}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                        })}
                      />
                    )}
                  />
                </div>
              </Col>
              </>
              }
            </Row>
            <Row>
              {/* {Today != undefined && <><Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="frmdate1">
                    From Date<spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id="frmdate"
                    name="frmdate"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        required
                        
                        options={{ allowInput: true }}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="todate1">
                    To Date<spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id="todate"
                    name="todate"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        required
                        defaultValue={defaultValues['todate']}

                        options={{ allowInput: true }}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                        })}
                      />
                    )}
                  />
                </div>
              </Col>
              </>
              } */}
              <div className='d-flex'>
                <Button className='me-1' color='primary' type='submit' disabled={isButtonClicked}>
                {isButtonClicked ? 'Processing...' : 'submit'}
                </Button>
                <Button outline color='secondary' type='reset' onClick={handleReset}>
                  Reset
                </Button>
                <span style={{ margin: '10px' }}></span>
                {/* <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> */}
                {/* <div className='inline-spacing' align="right" style={{ margin: '2px 0' }}> */}
            {/* <Button.Ripple color='primary' style={{ marginTop: '22px'}} onClick={onBtnExport} disabled={rowData.length==0} >Download CSV file</Button.Ripple> */}
            {/* </div> */}
                <Button className='me-1' color='primary' onClick={onBtnExport} >

Download
</Button>
              </div>
            </Row>
          </Form>
        </CardBody>
      </Card>
      {/* <Col md="3" sm="12" className="mb-1">
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
      {filterFromDate && (
      <div className="mb-2">
        <h5>
          {filterFromDate ? ` Filter Bill Date: ${filterFromDate}` : ''} {' & '}
          {filterResturant && filterResturant.length > 0 && filterResturant[0] !== 'All'
            ? `Filter Restaurants: ${filterResturant.join(', ')}`
            : 'Filter Restaurants: All'}
        </h5>
      </div>
    )} */}
{/* <Row className="align-items-center"> */}
<Row className="d-flex align-items-center " >
  {/* Search Input */}
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

  {/* Settled Button */}
        <Col md="auto" sm="6" className="mb-1">
          <button
            style={{
              marginTop: '22px',
              backgroundColor: '#42A83F',
              borderRadius: '4px',
              padding: '10px 20px',
              border: activeButton === 'settled' ? '2px solid #191A1A' : 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
            onClick={() => {
              setActiveButton('settled');
              applySettledFilter();
            }}
          >
            Settled
          </button>
        </Col>
  
        {/* Cancelled Button */}
        <Col md="auto" sm="12" className="mb-1">
          <button
            style={{
              marginTop: '22px',
              backgroundColor: '#E3C020',
              borderRadius: '4px',
              padding: '10px 20px',
              border: activeButton === 'cancelled' ? '2px solid #191A1A' : 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
            onClick={() => {
              setActiveButton('cancelled');
              applyCancelledFilter();
            }}
          >
            Cancelled
          </button>
        </Col>
  
        {/* GST Invoices Button */}
        <Col md="auto" sm="12" className="mb-1">
          <button
            style={{
              marginTop: '22px',
              backgroundColor: '#EA9E34',
              borderRadius: '4px',
              padding: '10px 20px',
              border: activeButton === 'gst' ? '2px solid #191A1A' : 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
            onClick={() => {
              setActiveButton('gst');
              applyGSTInvoices();
            }}
          >
            GST Invoices
          </button>
        </Col>
  
        {/* View All Button */}
        <Col md="auto" sm="12" className="mb-1">
          <button
            style={{
              marginTop: '22px',
              backgroundColor: '#BAC0C5',
              borderRadius: '4px',
              padding: '10px 20px',
              border: activeButton === 'viewAll' ? '2px solid #191A1A' : 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
            onClick={() => {
              setActiveButton('viewAll');
              removeFilters();
            }}
          >
            View All
          </button>
        </Col>
</Row>

<Row>
  <Col md="6" >
    {filterFromDate && (
      <div >
        <h5 className="mb-0">
          {filterFromDate ? `Filter Bill Date: ${filterFromDate}` : ''} {' & '}
          {filterResturant && filterResturant.length > 0 && filterResturant[0] !== 'All'
            ? `Filter Restaurants: ${filterResturant.join(', ')}`
            : 'Filter Restaurants: All'}
        </h5>
      </div>
    )}
  </Col>
</Row>
{/* </Row> */}




         <div className="ag-theme-alpine" style={{ height: 520 }}>
           <AgGridReact
            ref={gridRef}
            rowData={FilterData.length > 0 ? FilterData : rowData}
            columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            paginationAutoPageSize='true'
            paginationPageSize='10'
            pagination='true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            getRowStyle={getRowStyle}
            // gridOptions={gridOptions}
          onGridReady={onGridReady}

          />
          </div>
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
              <Button style={{ marginTop: '22px' }} type='submit' color='primary' disabled={loading}>
               {/* Send */}
               {loading ? "Processing..." : "Send"}
               </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
          
      <Modal isOpen={ShowPOSInvPDF} toggle={() => setShowPOSInvPDF(!ShowPOSInvPDF)} style={{ height: '200px' }} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowPOSInvPDF(!ShowPOSInvPDF)}>PMS Invoice</ModalHeader>

        <iframe style={{ height: '85vh' }} src={InvURL}> </iframe>
      </Modal>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isProcessingalert}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ fontWeight: 'bold', color: 'white' }}>
            Please wait... We're processing your request,
          </h1>
          <h1 style={{ fontWeight: 'bold', color: 'white' }}>
            which may take a little longer due to additional data. Please be patient!
          </h1>
          <CircularProgress color="inherit" />
        </div>
      </Backdrop>
      <div>
                            <Modal isOpen={AddAttachments} toggle={() => setAddAttachments(!AddAttachments)} className='modal-lg'>
                              <ModalHeader className='modal-lg' toggle={() => setAddAttachments(!AddAttachments)}>POS Bill Attachments</ModalHeader>
                              <ModalBody className='pb-3 px-sm-1 mx-20'>
                                <POSAttachments data1={POSBillData} />
                              </ModalBody>
                            </Modal>
                          </div>
                          <div>
                      <Modal isOpen={ShowPOSLogs} toggle={() => setShowPOSLogs(!ShowPOSLogs)} className='modal-xl'>
                        <ModalHeader className='modal-lg' toggle={() => setShowPOSLogs(!ShowPOSLogs)}>      <h4 className="text-2xl font-bold "><b>Logs for the bill {OrderDetails.billNoDisplay}  </b></h4>
                        </ModalHeader>
                        <ModalBody className='pb-3 px-sm-1 mx-20'>
                          <POSLogs data={OrderDetails} />
                        </ModalBody>
                      </Modal>
                    </div>
    </div>
  )

  }
export default AllPOSBills

