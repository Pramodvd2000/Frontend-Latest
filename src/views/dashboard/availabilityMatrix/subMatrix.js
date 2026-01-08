
// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { format } from "date-fns";
import { Card, CardHeader, CardText, CardTitle, Label, Col, Input, Row, Button } from 'reactstrap';
import API_URL from '../../../config';
import { useForm, Controller } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import Moment from 'moment';
import classnames from "classnames";



const id = '1';
const SubMatrix = (props) => {

  const [rowData, setRowData] = useState();


  // ** Hooks
  const { reset, handleSubmit, control, watch, formState: { errors }
  } = useForm({});

  var blk1 = format(new Date(), 'yyyy-MM-dd')
  let yesterday = new Date(blk1)
  yesterday.setDate(yesterday.getDate() + 1)
  var blk2 = format(new Date(yesterday), 'yyyy-MM-dd')
  yesterday = new Date(blk2)
  yesterday.setDate(yesterday.getDate() + 1)
  var blk3 = format(new Date(yesterday), 'yyyy-MM-dd')
  yesterday = new Date(blk3)
  yesterday.setDate(yesterday.getDate() + 1)
  var blk4 = format(new Date(yesterday), 'yyyy-MM-dd')
  yesterday = new Date(blk4)
  yesterday.setDate(yesterday.getDate() + 1)
  var blk5 = format(new Date(yesterday), 'yyyy-MM-dd')
  yesterday = new Date(blk5)
  yesterday.setDate(yesterday.getDate() + 1)
  var blk6 = format(new Date(yesterday), 'yyyy-MM-dd')
  yesterday = new Date(blk6)
  yesterday.setDate(yesterday.getDate() + 1)
  var blk7 = format(new Date(yesterday), 'yyyy-MM-dd')

  const gridRef = useRef();

  // var headers = ['Room Number', 'Floor ID', blk1, blk2, blk3, blk4, blk5, blk6, blk7];

  // // Create the column definitions
  // var columnDefs = headers.map(function (header) {
  //   return { headerName: header, field: 'header' };
  // });


  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));

  const cellClickedListener = useCallback(event => {
    console.log('cellClicked', event);
  }, []);

  const fetchData = () => {
    console.log(watch('fromDate'))
    const startDate = watch('fromDate')
    const endDate = watch('toDate')
    console.log(watch('fromDate'),Moment(String(new Date(watch('fromDate')))).format('YYYY-MM-DD'))
    const FromDate = (startDate === null || startDate === undefined) ? null : (Moment(String(new Date(watch('fromDate')))).format('YYYY-MM-DD'))
    const ToDate = (endDate === null || endDate === undefined) ? null : (Moment(String(new Date(watch('toDate')))).format('YYYY-MM-DD'))
    const RoomID = watch('roomID') === '' ? null : watch('roomID')
    let confirmRate = JSON.stringify({

      hotelID: 1,
      fromDate: FromDate,
      toDate: ToDate,
      roomID: RoomID,
    })
    console.log(confirmRate)
    fetchx(API_URL+"/getOccupancyRoomWise", {
    // fetchx("http://122.166.2.21:14702/getOccupancyRoomWise", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: confirmRate
    }).then(result => result.json())
      .then(res => {
        // var rowData = res.data;

        setRowData(res['data'])
        console.log(res['data'])
        // const transformedData = rowData.map((item) => ({
        //   roomNumber: item.roomNumber,
        //   floorID: item.floorID,
        //   ...item.occupancy_dates
        // }));

        // setRowData(transformedData);
      }, []);

    // })
  }

  useEffect(() => {
    fetchData()
  }, []);


  // const onFilterTextBoxChanged10 = (event, columnId) => {
  //   const { value } = event.target;
  //   setFilterValue(value);
  //   gridRef.current?.onFilterTextBoxChanged(columnId, value);
  // };


  // const customFilterFunction = (value, filter) => {
  //   // Implement your custom filtering logic here
  //   // Return true if the value matches the filter, otherwise false
  //   return value.toLowerCase().includes(filter.toLowerCase());
  // };

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Date', field: 'occupancy_date' },
    { headerName: 'Room Number', field: 'roomNumber' },
    { headerName: 'BookingID', field: 'bookingID' },
    { headerName: 'Guest', field: 'guestName' },
    { headerName: 'Status', field: 'assignStatus' },

  ]);

  // console.log(columnDefs[1].field)


  const buttonListener = useCallback(e => {
    gridRef.current.api.deselectAll();
  }, []);

  // const onFilterTextBoxChanged10 = useCallback(() => {
  //   gridRef.current.api.setQuickFilter(
  //     document.getElementById('floorNumber').value
  //   );
  // }, []);
  const [filterValue, setFilterValue] = useState('');


  const onFilterTextBoxChanged10 = (event) => {
    const { value } = event.target;
    setFilterValue(value);
    // gridRef.current?.setQuickFilter(value);
    const columnId = columnDefs[1].field;
    console.log(value)
    gridRef.current?.setFilterModel({
      [columnId]: { type: 'contains', filter: value }
    });
  };


  const fromDate = watch('fromDate');
  console.log(fromDate)
  //// For Disabling Past Date
  const today = Moment().format('YYYY-MM-DD');
  const options = {
    minDate: today
  };
  const optionsToDate = {
    minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
  };



  const handleResetFilter = () => {
    reset({
      roomID: '',
      fromDate: null,
      toDate: null,
    }); 
    fetchData()
  };


  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4"><b>Roomwise Occupancy View</b></CardTitle>
        </CardHeader>
      </Card>
      <div>
      <Row>
      <Col md='3' sm='12' className='mb-1'>
                          <div className="mb-1">
                            <Label className="form-label" for="roomID">
                              Room Number
                            </Label>
                            {/* <Controller
                              id='roomID'
                              control={control}
                              name='roomID'
                              render={({ field }) => (
                                <Input
                                  placeholder='Room Number'
                                  // isClearable
                                  // options={subBookingId}
                                  className='form-control'
                                  {...field}
                                />
                              )}
                            /> */}
                              <Controller
                              control={control}
                              id='roomID'
                              name='roomID'
                              render={({ field }) => <Input type='number' placeholder='Room Number'  {...field} />}
                            />

                          </div>
                        </Col>
        <Col md='3' sm='12' className='mb-1'>
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

                        <Col md='3' sm='12' className='mb-1'>
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

        <Col md='3' sm='12' className='mt-2'>
        <div className="d-flex">

          <Button color='primary' className='me-1' onClick={() => fetchData()}>
            Apply Filter
          </Button>
          <Button
            className='me-1'

            onClick={handleResetFilter}
          >
            Reset Filter
          </Button>
          </div>
        </Col>
      </Row>
      </div>
      <br></br>

      {/* <button onClick={buttonListener}>Push Me</button> */}
      <div className="ag-theme-alpine" style={{ height: 520 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData} columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          // paginationAutoPageSize = 'true'
          onGridReady={params => {
            gridRef.current = params.api;
          }}
          paginationPageSize='10'
          pagination='true'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
          masterDetail={true}

        />
      </div>
    </div>
  );
}

export default SubMatrix;