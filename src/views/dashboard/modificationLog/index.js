import React, { useState, useRef, useEffect, useCallback } from 'react'

import API_URL from '../../../config'

// ** Reactstrap Imports
import { Col, Label, Input, Row } from 'reactstrap'

// import 'ag-grid-enterprise'
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { DateTime } from 'luxon';
import { useForm, Controller } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import Moment from 'moment';
import { format } from 'date-fns';
const ModificationLogs = (data) => {
  console.log("data", data)
  const gridRef = useRef();
  const [logData, setLogData] = useState(false)
 // ** Hooks
  const {
    reset,
    handleSubmit,
    control,
    watch
  } = useForm({ });
  // get modification log data
  useEffect(() => {

    if (Object.keys(data).length === 0) {

      const reservationData = JSON.stringify({
      })
      fetchx(API_URL + '/getModificationLogsByDate', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        },
        body: reservationData,
      })
        .then((res) => res.json())
        .then(postres => {
          setLogData(postres['data'])
        }).catch((err) => {
          console.log(err)
        })

    }
    else {
      const reservationData = JSON.stringify({
        reservationID: data.data.id || null
      })


      fetchx(API_URL + '/getModificationLogsByDate', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        },
        body: reservationData,
      })
        .then((res) => res.json())
        .then(postres => {
          setLogData(postres['data'])
        }).catch((err) => {
          console.log(err)
        })
    }

  }, []);



  const fromDate = watch('fromDate');
  const toDate = watch('toDate');


  const optionsFilter = {
  };
    const optionsToDate = {
      minDate: fromDate && fromDate.length !== 0 ? Moment(String(new Date(fromDate))).format('YYYY-MM-DD') : null
    };

    useEffect(() => {
      // Call the function whenever both fromDate and toDate are filled
      if (fromDate !== undefined && toDate !== undefined) {
        if (Array.isArray(fromDate) && Array.isArray(toDate) &&
          fromDate.length !== 0 && toDate.length !== 0 &&
          fromDate[0] !== '' && toDate[0] !== '') {
  
          let fromDateFormat = fromDate !== '' ? format(new Date(fromDate), 'yyyy-MM-dd') : '';
          let toDateFormat = toDate !== '' ? format(new Date(toDate), 'yyyy-MM-dd') : '';
          fetch(API_URL + "/getModificationLogsByDate?fromDate=" + fromDateFormat + "&toDate=" + toDateFormat)
            .then((result) => result.json())
            .then((rowData) => {
              setLogData(rowData["data"]);
              // console.log(rowData)
            });
        }
        else {
          fetch(API_URL + "/getModificationLogsByDate?hotelID=1")
            .then((result) => result.json())
            .then((rowData) => {
              setRowData(rowData["data"]);
              // console.log(rowData)
            });
        }
      }
    }, [fromDate, toDate]);

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


  //AG-GRID columns to show daily details
  const [columnDefs1, setColumnDefs1] = useState([
    {
      headerName: 'BookingID', field: 'bookingID', width: 130,
    },
    {
      headerName: 'Data',
      field: 'modificationLog',
      width: 600,
      cellStyle: { whiteSpace: 'normal' },
      cellRenderer: params => {
        let modificationLog = [];
        try {
          modificationLog = JSON.parse(params.data.modificationLog || '[]');
        } catch (error) {
          console.error('Error parsing modificationLog:', error);
        }

        const cellContent = modificationLog.map((mod, index) => {
          const { "Modified field name": field, "Old value": oldValue, "New value": newValue, "Effect": effect, "ArrivalDate": ArrivalDate, "DepartureDate": DepartureDate, "Pax": PAX } = mod;
          let changeDescription = '';

          if (oldValue === '' && newValue === '' && Array.isArray(effect)) {
            changeDescription = `Reservation created from ${formatDate(new Date(ArrivalDate))} to ${formatDate(new Date(DepartureDate))} With PAX count ${PAX} `;
          }
          else if (oldValue === '' && newValue === '' && field.includes('Assign')) {
            changeDescription = ""
          }
          else if (oldValue === '' && newValue === '' && field.includes('Check-in')) {
            changeDescription = ""
          }
          else if (oldValue === '' && newValue === '' && field.includes('Cancel Check-In')) {
            changeDescription = ""
          }
          else if (oldValue === '' && newValue === '' && field.includes('Re-instate')) {
            changeDescription = `Reservation Re-instated`
          }
          else if (oldValue === '' && newValue === '') {
            changeDescription = `Reservation cancelled`
          }
          else if (oldValue !== '' && oldValue !== null) {
            changeDescription = `Modified from ${oldValue} to ${newValue}`;
          } else {
            changeDescription = `Newly added ${field} ${newValue}`;
          }

          let effectDescription = '';

          if (oldValue === '' && newValue === '' && Array.isArray(effect)) {
            effectDescription = (
              <div>
                {effect.map((item, i) => (
                  <div key={i}>
                    {Object.keys(item).map((prop, j) => (
                      <span key={j}>
                        {`${prop}: ${prop.includes('Date') ? formatDate(new Date(item[prop])) : item[prop]} `} {j < Object.keys(item).length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            );
          } else if (effect && typeof effect === 'object') {
            effectDescription = (
              <div>
                {Object.keys(effect).map((prop) => (
                  <span key={prop}>
                    {`${prop}: ${prop.includes('Date') ? formatDate(new Date(effect[prop])) : effect[prop]} `}
                  </span>
                ))}
              </div>
            );
          } else {
            effectDescription = effect;
          }

          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontWeight: 'bold' }}>{field}:</div>
              <div>{changeDescription}</div>
              {effectDescription && <div>{effectDescription}</div>}
            </div>
          );
        });

        return <div style={{ display: 'flex', flexDirection: 'column' }}>{cellContent}</div>;
      }
    },
    {
      headerName: 'Operation Type', field: 'modificationType', width: 250,
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
      sort: 'desc'
    },
    {
      headerName: 'User', field: 'first_name', maxWidth: 150
    }
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
          Reservation Logs
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
                              options={optionsFilter}
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


export default ModificationLogs 