
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { DateTime } from 'luxon';

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import API_URL from "../../../config";
import {Row,Card,CardHeader,CardTitle,CardBody,Button,Modal,ModalBody,
  ModalHeader,Col,Label,Input,Form,InputGroup} from 'reactstrap'
import Moment from 'moment';
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
const AvailabilityMatrix = () => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef(null);
  const gridRef1 = useRef();

  const [FirstPageLoad,setFirstPageLoad] = useState(true)
  const [debouncedPage, setDebouncedPage] = useState(0);
  const [Today,setToday] = useState()
  const [data, setData] = useState([]);
  const [LoadingVar,setLoadingVar] = useState(false)
  const { reset, handleSubmit, control ,formState: { errors }
} = useForm({ });
  const defaultColDef = useMemo( ()=> (
    {
      sortable: true, 
      filter: true,
      filterParams :{
      buttons : ['apply','reset']
      }
    }
  ));

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

  const columnDefs = [
            // {headerName: 'ID',field: 'id',suppressSizeToFit: true,maxWidth: 80},
            {headerName: 'Room No',field: 'roomNumber',maxWidth: 130},
            {headerName: 'guestName',field: 'guestName',width: 300},
            {headerName: 'bookingID',field: 'bookingID',maxWidth: 120},
            {headerName: 'TrxnCode',field: 'transactionCode',suppressSizeToFit: true,maxWidth: 120},
            {headerName: 'Description',field: 'description'},
            {headerName: 'Type',field: 'transaction_type',maxWidth: 100},
            {headerName: 'Amount',field: 'base_amount',maxWidth: 130},
            {headerName: 'Tax%',field: 'tax_percentage',maxWidth: 100},
            {headerName: 'CGST',field: 'cgst',maxWidth: 100},
            {headerName: 'SGST',field: 'sgst',maxWidth: 100},
            {headerName: 'Total',field: 'total',maxWidth: 110},
            {headerName: 'Supplement',field: 'supplement',maxWidth: 160},
            {headerName: 'Remarks',field: 'remarks',maxWidth: 160},
            {headerName: 'Date',field: 'date',maxWidth: 120},
            {headerName: 'createdAt',field: 'createdAt',cellRenderer: (params) => {  
              console.log(params.data.date)      
              // Ensure the arrivalDate field exists in the row data        
              if (params.data && params.data.createdAt) {          
                  // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
                  const formattedDate = Moment(params.data.createdAt).format("DD-MM-YYYY hh:mm:ss");          
                  return formattedDate;        
              } else {          
                  return ""; // Handle cases where the data is missing or invalid        
              }      },maxWidth: 180},
            {headerName: 'ModifiedTime',field: 'modifiedTime',maxWidth: 180},
            {headerName: 'BillNo',field: 'billNo'},
            {headerName: 'Invoice Date',field:'invoiceDate',maxWidth:150},
            {headerName: 'Folio',field: 'folio_id',maxWidth: 100},
            // {headerName: 'BillDate',field: 'billDate',maxWidth: 180},
            {headerName: 'Linked Bill No',field: 'pos_bill_number',maxWidth: 200},
            {headerName: 'is_deposit',field: 'is_deposit',maxWidth: 130},
            {headerName: 'is_cancelled',field: 'is_cancelled',maxWidth: 140},
            {headerName: 'ReservationID',field: 'reservation_id',maxWidth: 150},
            
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
    fetchx(API_URL + `/gettransaction?hotelID=1&FromDate=${FromDate}&ToDate=${ToDate}`)
      .then((result) => result.json())
      .then((response) => {
        console.log(response.data)
        // console.log(response.data.length)
        console.log(response.data)
        // for(let i=0 ;i<response['data'].length;i++){
        //                     setRowData(rowData=>[...rowData,(response['data'][i])])
                  
        //                   }
        setRowData(response.data);
      });
  };
};

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
  
  const cellClickedListener = useCallback( event => {
    console.log('cellClicked', event);
  }, []);
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef1.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);

  const params = {
    fileName: 'All Transactions', // Set your desired file name here
  };
  const onBtnExport = useCallback(() => {
    gridRef1.current.api.exportDataAsCsv(params);
  }, []);
  return (
    <div>
         <Card>
            <CardHeader>
            <CardTitle tag="h4">
            <div style={{ display: 'inline-block' }}>
              <b>All Transactions</b>
              {data.length !== 0 && (
                <p style={{ display: 'inline', marginLeft: '10px' }}>
                  from {data.FromDate} to {data.ToDate}
                </p>
              )}
            </div>
          </CardTitle>
            </CardHeader>
          </Card>
          <Row>
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

        <Col md="3" sm="6" className="mb-1">
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

      <div className="ag-theme-alpine" style={{ height: 520 }}>

        {/* <AgGridReact
          onGridReady={onGridReady}
          rowData={rowData}
          getRowStyle={getRowStyle}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={10}
          onPaginationChanged={onPageChanged}
          defaultColDef={defaultColDef}

        /> */}
                <AgGridReact 
            ref={gridRef1}
            rowData={rowData} columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            // paginationAutoPageSize = 'true'
            paginationPageSize= '10'
            pagination = 'true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
          getRowStyle={getRowStyle}

            
            />
      </div>
    </div>
  );
};

export default AvailabilityMatrix;
