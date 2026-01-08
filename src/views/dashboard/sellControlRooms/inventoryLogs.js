import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useForm, Controller } from "react-hook-form";

import API_URL from '../../../config'

// ** Reactstrap Imports
import { Col, Label, Input, Row } from 'reactstrap'

// import 'ag-grid-enterprise'
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { DateTime } from 'luxon'; 
import Moment from "moment";
import Flatpickr from "react-flatpickr";
import { format } from "date-fns";

const InventoryLogs = (data) => {

  const gridRef = useRef();
  const [logData, setLogData] = useState(false);
  const [Today, setToday] = useState()

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
    watch
  } = useForm({  });
  // get modification log data
  useEffect(() => {
    const reservationData = JSON.stringify({
    //   reservationID: data.data.id
    })


    fetchx(API_URL + '/getInventoryLogs',)
      .then((res) => res.json())
      .then(postres => {
        setLogData(postres['data'])
      }).catch((err) => {
        console.log(err)
      })

  }, []);


  useEffect(() => {
    const hotelIDData = JSON.stringify({
        hotelID: 1
    })
    fetchx(API_URL + "/getBusinessDate", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: hotelIDData
    }).then((res) => res.json())
        .then(postres => {
            const today = new Date(postres['data'][0]['businessDate']);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
        })
}, []);

  const formatToIST = (dateString) => {
    if (dateString) {
      const date = DateTime.fromISO(dateString, { zone: 'utc' });
      const istDate = date.setZone('Asia/Kolkata');
      return istDate.toFormat('dd-MM-yyyy HH:mm:ss');
    }
    return 'No date available';
  };

  // Ag-grid options
  const gridOptions = {
    defaultColDef: {
      cellStyle: { whiteSpace: 'normal' }, // Allow text wrapping
      autoHeight: true, // Allow the cell to expand vertically
    },
  };


    const fromDate = watch('fromDate');
    const toDate = watch('toDate');
     const options = {
            minDate: Today
        };
        const optionsToDate = {
            minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
        };
    
  

  // Function to format date
  function formatDate(date) {
    const dateString = date.toString();

    // Check if the date string matches the format "MMM YYYY"
    const isMonthYearFormat = dateString.match(/^\w{3} \d{4}$/);

    if (isMonthYearFormat) {
      return dateString; // Return the date as is
    } else {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
  }


    const defaultColDef = useMemo(() => (
      {
        sortable: true,
        filter: true,
        autoHeight: true,
        wrapText: true,
        filterParams: {
          buttons: ['apply', 'reset']
        }
      }
    ));


  useEffect(() => {
        // Call the function whenever both fromDate and toDate are filled
        if (fromDate !== undefined && toDate !== undefined) {
          if (Array.isArray(fromDate) && Array.isArray(toDate) && 
          fromDate.length !== 0 && toDate.length !== 0 && 
          fromDate[0] !== '' && toDate[0] !== '') {
     
          let fromDateFormat = fromDate !== '' ? format(new Date(fromDate), 'yyyy-MM-dd') : '';
          let toDateFormat = toDate !== '' ? format(new Date(toDate), 'yyyy-MM-dd') : '';
          fetch(API_URL + "/getInventoryLogs?fromDate=" + fromDateFormat + "&toDate=" + toDateFormat)
          .then((result) => result.json())
          .then((rowData) => {
            setLogData(rowData["data"]);
            // console.log(rowData)
          });
        }
        else{
          fetch(API_URL + "/getInventoryLogs")
          .then((result) => result.json())
          .then((rowData) => {
            setLogData(rowData["data"]);
            // console.log(rowData)
          });
        }
      } 
      }, [fromDate, toDate]); 


 

  //AG-GRID columns to show daily details
  const [columnDefs1, setColumnDefs1] = useState([

    {headerName: 'Date', field: 'inventoryDate', width: 120,  sort: 'desc'},
    {headerName: 'B ID', field: 'bookingID', width: 90},
      { headerName: 'Group ID', field: 'groupID', width: 140 },

    {headerName: 'Guest', field: 'guestName', width: 140},
    {headerName: 'Room', field: 'roomNumber', width: 110},
    {headerName: 'Room Type', field: 'roomType', width: 130},
    {headerName: 'Inv. Before', field: 'actualInventory', width: 130},
    {headerName: 'Inv. After', field: 'reducedInventory', width: 140},
    {headerName: 'Qty', field: 'quantity', width: 80},
    {headerName: 'Operation', field: 'operation', width: 130},
    
    {
      headerName: 'User', field: 'createdUser', width: 120,
    },
    {
      headerName: 'Time', 
      field: 'createdAt', 
      width: 180, 
      cellRenderer: (params) => {
        if (params.data && params.data.createdAt) {
          const indianTime = new Date(params.data.createdAt).toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata'
          });
          return formatDates(new Date(indianTime));
        }
      }, 
      // cellRenderer: (params) => {
      //   if (params.data && params.data.createdAt) {
      //     return formatToIST(params.data.createdAt);
      //   }
      // }, 
    //   sort: 'desc'
    sortable: true, // Sorting enabled, but controlled dynamically

    },
  
  ])


  // On search element
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);


  // Function to format date with time
  function formatDates(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const period = (hour >= 12) ? 'PM' : 'AM';

    const formattedTime = `${(hour % 12) || 12}:${minute} ${period}`;
    return `${day}.${month}.${year} ${formattedTime}`;
  }


  return (
    <div>
      <div>
        <h3>
          Inventory Logs
        </h3>
        <br></br>
        <div>
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
              <Col md='2' sm='12' className='mb-1'>
                                    <div className="mb-1">
                                      <Label className="form-label" for="fromDate">
                                        From Date
                                      </Label>
                                      <Controller
                                        control={control}
                                        id='fromDate'
                                        name='fromDate'
                                        render={({ field }) => (
                                          <Flatpickr
                                            // required
                                            options={options}
                                            placeholder='YYYY-MM-DD'
                                            {...field}
                                            className='form-control'
                                           
                                          />
                                        )}
                                      />
                                    </div>
                                  </Col>
                                  <Col md='2' sm='12' className='mb-1'>
                                    <div className='mb-1'>
                                      <Label className='form-label' for='toDate'>
                                        To Date
                                      </Label>
                                      <Controller
                                        control={control}
                                        id='toDate'
                                        name='toDate'
                                        render={({ field }) => (
                                          <Flatpickr
                                            placeholder='YYYY-MM-DD'
                                            {...field}
                                            options={optionsToDate}
                                            // options={{ allowInput: true }}
                                            className='form-control'
                                    
                                          />
                                        )}
                                      />
                                    </div>
                                  </Col>
                                  </Row>
        </div>

        <div className="ag-theme-alpine" style={{ height: '693px', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={logData}
            columnDefs={columnDefs1}
            animateRows={true}
            defaultColDef={defaultColDef}
            rowSelection='multiple'
            pagination={true}
            paginationPageSize='10'
            gridOptions={gridOptions}
            headerColor="ddw-primary"
          />
        </div>
        <br />
      </div>
    </div>
  )
}


export default InventoryLogs 
