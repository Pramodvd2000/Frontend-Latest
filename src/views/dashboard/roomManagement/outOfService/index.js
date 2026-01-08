// ** React Imports
import { Fragment, useState } from "react";
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
import { format } from "date-fns";


// ** Utils
import { selectThemeColors } from "@utils";

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
  Col,  
  Modal,
  ModalBody,
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

import { useNavigate } from "react-router-dom";

import { useRef, useEffect, useMemo, useCallback } from 'react';
import API_URL from "../../../../config";
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const id = '1';

const status = [
  { value: "Out Of Order", label: "Out Of Order" },
  { value: "Out Of Service", label: "Out Of Service" },

];






const defaultValues = {
  // hotelID: "",
  roomID: "",
  fromDate: null,
  startTime: "",
  toDate: null,
  endTime: "",
  status: null,
  returnStatus: "",
  remarks: "",
  reason: null,
}


let reason = [


  fetchx(API_URL+'/getReasonByID?reasonGroupID=1')
    .then(result => result.json())
    .then(resp => {
      //console.log(resp['data'])
      reason = resp['data']

    })

]


const outOfOrderOrService = () => {
  // var Today = format(new Date(), "dd-MM-yyyy")
  // //console.log(Today)

  // AG Grid
  const [rowData, setRowData] = useState();
  const [service, setService] = useState();
  const [outService, setOutService] = useState();
  const [openForm, setOpenForm] = useState();
  const [basic, setBasic] = useState(new Date());
  const [room, setRoom] = useState([]);
  const [roomIDs, setRoomID] = useState()
  const [release, setRelease] = useState()
  const [filldata, setfilldata] = useState('')
const [Today, setToday] = useState()
const [confirmRelease, setConfirmRelease] = useState()
const [isOODButton, setIsOODButton] = useState(false);

  let navigate = useNavigate();

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
  // //console.log(Today) 


  const handleSuccess = (message) => {
    return MySwal.fire({
      title: 'OOD / OOS!!',
      text: message,
      icon: 'success',
    })
  }



  const onDiscard = () => {


    // clearErrors()
    setOpenForm(false)
    reset()
  }


  const gridRef1 = useRef();
  const gridRef2 = useRef();

  const cellClickedListener1 = useCallback(event => {
    //console.log('cellClicked', event);
    //console.log(event['data'])
    //console.log(event['rowIndex'])
    //console.log(event['data'])
    setfilldata(event['data'])
    localStorage.removeItem('releaseData')
    localStorage.setItem('releaseData', JSON.stringify(event['data']))

  }, []);


  const [columnDefs, setColumnDefs] = useState([

    { headerName: 'Room No.', field: 'roomNumber', maxWidth: 140 },
    { headerName: 'Room Type', field: 'roomType', maxWidth: 140 },
    { headerName: 'Status', field: 'status', maxWidth: 140 },
    { headerName: 'From Date', field: 'fromDate', maxWidth: 140 },
    { headerName: 'To Date', field: 'toDate', maxWidth: 140 },
    { headerName: 'Reason', field: 'reasonCode', maxWidth: 140 },
    { headerName: 'Remarks', field: 'remarks', maxWidth: 140 },
    {
      headerName: 'Actions', cellRenderer: (event) => {

        return (
          <Button color='primary' onClick={() => {
            //console.log(event.data)
setConfirmRelease(event.data)
            // setfilldata(event.data)
            // Release(event.data)
          }}>Release</Button>
        )
      }, maxWidth: 150
    },
    { headerName: 'Return Status', field: 'returnStatus', maxWidth: 140 },
  //  { headerName: 'Start Time', field: 'startTime', maxWidth: 140 },
  //  { headerName: 'End Time', field: 'endTime', maxWidth: 140 },





  ]);

  const [columnDefsOutService, setColumnDefsOutOfService] = useState([

    { headerName: 'Room No', field: 'roomNumber', checkboxSelection: true, headerCheckboxSelection: true, width: 200, filter: 'agNumberColumnFilter',
    },
    { headerName: 'Room Status', field: 'roomStatus', width: 180 },
    { headerName: 'FO Status', field: 'frontOfficeStatus', maxWidth: 150 },
    { headerName: 'Reservation Status', field: 'reservationStatus', width: 180 },
    { headerName: 'Room Type', field: 'roomType', width: 180, filter: 'agTextColumnFilter' },
    {
      headerName: 'Floor', field: 'floorID', maxWidth: 150, filter: 'agMultiColumnFilter',

      filterParams: {
        filters: [
          {
            filter: 'agTextColumnFilter',
            display: 'accordion',
            title: 'Expand Me for Text Filters'
          },
          {
            filter: 'agSetColumnFilter',
            display: 'accordion'
          }
        ]
      }
    },


  ]);

  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      // filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      },
      floatingFilter: true
    }
  ));








  const cellClickedListener = useCallback(event => {
    //console.log('cellClicked', event);
    //console.log(event['data'])
    //console.log(event['rowIndex'])
    //console.log(event['data'])

  }, []);


  useEffect(() => {
    fetchx(API_URL + '/getOutOfOrderOrService?hotelID=' + id)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
        //console.log(rowData['data'])
      })
    fetchx(API_URL + '/room?hotelID=' + id)
      .then(result => result.json())
      .then(outService => {
        setOutService(outService['data'])
        //console.log(outService['data'])
      })
  }, []);



  // ** State
  const [data, setData] = useState(null);
  const [value, setValue] = useState('')
  const [checkboxData, setCheckBox] = useState()
  const [popUp, setPopUp] = useState();



  // ** Hooks
  const { reset, handleSubmit, control, watch, formState: { errors }
  } = useForm({ defaultValues });


  //// OncheckBox Click
  const onSelectionChanged = (event) => {
    let allRooms = event.api.getSelectedRows()
    //console.log(allRooms)
    let roomArr = [];
    let roomIDArr = []

    const filterInstance = gridRef2.current.api.getFilterInstance("floorID");
    const filterModel = filterInstance.getModel();
    //console.log(filterInstance);
    if (filterInstance.activeFilterIndices.length != 0) {
      let FloorNo = filterModel['filterModels'][0]['filter'];
      //console.log(FloorNo)


      allRooms.forEach(element => {
        if (FloorNo !== null) {
          if (FloorNo == element.floorID) {
            roomArr.push(element.roomNumber)
            roomIDArr.push(element.id)

          }
        }
      });
      //console.log(roomArr)
      //console.log(roomIDArr)

    }
    else {

      allRooms.forEach(element => {

        roomArr.push(element.roomNumber)
        roomIDArr.push(element.id)
        //console.log(element.id)

        //console.log(roomArr)
        //console.log(roomIDArr)
      });
    }
    setRoomID(roomIDArr)
    setRoom(roomArr)
  }

  const onSubmit = (data) => {
setIsOODButton(true)
    setData(data);
    //console.log(data)
    if (
      data.fromDate !== null &&
      data.toDate !== null &&
      data.roomID !== null
    ) {
      //console.log(data);

      //console.log(roomIDs)
      let createasset = JSON.stringify({
        // "hotelID": data.hotelID,
        "roomID": roomIDs,
        "fromDate": (Moment(String(new Date(data.fromDate[0]))).format('YYYY-MM-DD')),
        "startTime": data.startTime,
        "toDate": (Moment(String(new Date(data.toDate[0]))).format('YYYY-MM-DD')),
        "endTime": data.endTime,
        "status": data.status.value,
        "returnStatus": 'Dirty',
        "remarks": data.remarks,
        "reasonID": data.reason.value,
        "hotelID": 1
      });
      //console.log(createasset);
      let res = fetchx(API_URL + "/addOutOfOrderAndService", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: createasset,
      }).then(data => data.json())
        .then((res) => {
          //console.log(res);
          if (res.statusCode == 200) {
            setIsOODButton(false)
            handleSuccess("Successfully added")
            fetchx(API_URL + '/getOutOfOrderOrService?hotelID=' + id)
              .then(result => result.json())
              .then(rowData => {
                setRowData(rowData['data'])
                //console.log(rowData['data'])
                setTimeout(() => { navigate('/dashboard/roomManagement/outOfService'); }, 500)

              })
          }
          else {
setIsOODButton(false)
            //console.log(res.data)
            setPopUp(res.data)

          }
        });

    }
    else{
      console.log("Came here")
      setIsOODButton(false)

    }
  };


  const fromDate = watch('fromDate');
//console.log(fromDate)
  //// For Disabling Past Date
  // const today = Moment().format('YYYY-MM-DD');
  const options = {
    minDate: Today
  };
  const optionsToDate = {
    minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
  };



  

  //// For Filter
  const onFilterTextBoxChanged1 = useCallback(() => {
    gridRef1.current.api.setQuickFilter(
      document.getElementById('filter-text-box1').value
    );
  }, []);


  function Release(data) {
    //console.log(data)
    // //console.log(localStorage.getItem('releaseData'))
    let release = JSON.parse(localStorage.getItem('releaseData'))
    //console.log(release)
    let Release = JSON.stringify({
      "roomID": data.roomID,
      "fromDate": data.fromDate,
      "toDate": data.toDate,
      "roomTypeID": data.roomTypeID,
      "OODSID": data.id,
      "hotelID": 1
    });
    //console.log(Release)
    let res = fetchx(API_URL + "/outOfOrderAndServiceRelease", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: Release,
    }).then(data => data.json())
      .then((res) => {
        //console.log(res)
        if (res.statusCode === 200) {
          handleSuccess("Successfully released")

          setTimeout(() => { navigate('/dashboard/roomManagement/outOfService'); }, 500)


        }
        else {
          setPopUp(res.data)
        }


      })

  }


  // const onFilterTextBoxChanged2 = useCallback(() => {
  //   gridRef2.current.api.setQuickFilter(
  //     document.getElementById('filter-text-box2').value

  //   );
  // }, []);

  const rowClassRules = {
    // apply green to 2008
    'rag-green-outer': function (params) { return params.data.year === 2008; },

    // apply amber 2004
    'rag-amber-outer': function (params) { return params.data.year === 2004; },

    // apply red to 2000
    'rag-red-outer': function (params) { return params.data.year === 2000; }
  };


  function Alert() {

    setTimeout(() => { navigate('/dashboard/roomManagement/outOfService'); }, 1000)


  }

  const getRowStyle = params => {
    if (params.data && params.data.roomStatus === 'Dirty') {
      if (params.data && params.data.frontOfficeStatus === 'Occupied') {
        return { background: '#0247FE' };
      } else {
        return { background: '#FF2400' };
      }
    } else if (params.data && params.data.roomStatus === 'Out Of Order') {
      return { background: '#808080' };
    } else if (params.data && params.data.roomStatus === 'Out Of Service') {
      return { background: 'yellow' };
    } else if (params.data && params.data.roomStatus === 'Out Of Order') {
      return { background: 'lightgrey' };
    } else if (params.data && params.data.roomStatus === 'Clean') {
      return { background: '#0247FE' };
    } else if (params.data && params.data.roomStatus === 'Inspected') {
      return { background: '#00FF00' };
    }
    return null;
  };



  const handleChange = event => {
    setValue(event.target.value)
  }

  const handleReset = () => {
    reset({
      // hotelID: "",

    });
  };

  function HandleModal(){
    //console.log(roomIDs)
    if(roomIDs=== undefined || roomIDs===null || roomIDs===''){
      let msg = "Please select room to continue";
      setPopUp(msg)
    }
    else{
    setOpenForm(true)
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <Button color="primary" onClick={setService}>Add Out Of Service / Order</Button>
        </CardHeader>
      </Card>
      <Col md='3' sm='12' className='mb-1'>
        <Label className='form-label' for='fullName'>
          Room Number
        </Label>
        <Input
          type="text"
          id="filter-text-box1"
          placeholder="Filter..."
          onInput={onFilterTextBoxChanged1}
        />
      </Col>

      <div className="ag-theme-alpine" style={{ height: 520 }}>

        <AgGridReact
          ref={gridRef1}
          rowData={rowData} columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener1}
          // paginationAutoPageSize = 'true'
          paginationPageSize='10'
          pagination='true'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"

        />
      </div>
      <div>
        <Fragment>
          <Modal isOpen={openForm} toggle={() => setOpenForm(!openForm)} onClosed={onDiscard} className='modal-lg'>
            <ModalHeader className='modal-lg' toggle={() => setOpenForm(!openForm)}></ModalHeader>
            <ModalBody className='pb-3 px-sm-1 mx-20'>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">Out Of Service / Order</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <Row>
                        <Card>
                          <p>
                            Room Number:{" "}
                            {room.map((num) => (
                              <b>{num} </b>
                            ))}
                          </p>
                        </Card>
                        {Today !== undefined && <Col md='4' sm='12' className='mb-1'>
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
                                  // options={{ allowInput: true }}
                                  className={classnames('form-control', {
                                    'is-invalid': data !== null && data.fromDate === null
                                  })}
                                />
                              )}
                            />
                          </div>
                        </Col>}
                        {/* <Col md='4' sm='12' className='mb-1'>
                        <div className='mb-1'>
                        <Label className='form-label' id='startTime'>
                            Start Time
                            </Label>
                            <Flatpickr
                            className='form-control'
                            value={basic}
                            id='startTime'
                            options={{
                                enableTime: true,
                                noCalendar: true,
                                dateFormat: 'H:i',
                                // time_24hr: true
                            }}
                            />
                            </div>
                            </Col> */}
                        {/* <Col md='4' sm='8'>
                          <div className='mb-1'>
                            <Label className='form-label' for='startTime'>
                            Start Time
                            </Label>
                            <Controller
                              control={control}
                              id='startTime'
                              name='startTime'
                              render={({ field }) => <Input type='time' placeholder='Agent' invalid={errors.eta && true} {...field} />}
                            />
                          </div>
                        </Col> */}
                        {Today !== undefined && <Col md='4' sm='12' className='mb-1'>
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
                                  className={classnames('form-control', {
                                    'is-invalid': data !== null && data.toDate === null
                                  })}
                                />
                              )}
                            />
                          </div>
                        </Col>
}
                        {/* <Col md='4' sm='12' className='mb-1'>
                          <div className='mb-1'>
                            <Label className='form-label' id='endTime'>
                              End Time
                            </Label>
                            <Flatpickr
                              className='form-control'
                              value={basic}
                              id='endTime'
                              options={{
                                enableTime: true,
                                noCalendar: true,
                                dateFormat: 'H:i',
                                // time_24hr: true
                              }}
                            />
                          </div>
                        </Col> */}
                         {/* <Col md='4' sm='8'>
                          <div className='mb-1'>
                            <Label className='form-label' for='endTime'>
                            End Time
                            </Label>
                            <Controller
                              control={control}
                              id='endTime'
                              name='endTime'
                              render={({ field }) => <Input type='time' placeholder='Agent' invalid={errors.endTime && true} {...field} />}
                            />
                          </div>
                        </Col> */}
                        <Col md='4' sm='12' className='mb-1'>
                          <div className="mb-1">
                            <Label className="form-label" for="status">
                              Status
                            </Label>
                            <Controller
                              id='status'
                              control={control}
                              name='status'
                              render={({ field }) => (
                                <Select
                                  isClearable
                                  options={status}
                                  classNamePrefix='select'
                                  theme={selectThemeColors}
                                  className={classnames('react-select', { 'is-invalid': data !== null && data.status === null })}
                                  {...field}

                                />
                              )}
                            />
                          </div>
                        </Col>
                        <Col md='4' sm='12' className='mb-1'>
                          <div className="mb-1">
                            <Label className="form-label" for="returnStatus">
                              Return Status
                            </Label>
                            <Controller
                              id='returnStatus'
                              control={control}
                              name='returnStatus'
                              render={({ field }) => (
                                <Input
                                  placeholder='Return Status'
                                  isClearable
                                  disabled={true}
                                  // options={returnSt}
                                  classNamePrefix='select'
                                  theme={selectThemeColors}
                                  className={classnames('react-select', { 'is-invalid': data !== null && data.status === null })}
                                  {...field}
                                  value={'Dirty'}
                                />
                              )}
                            />

                          </div>
                        </Col>
                        <Col md='4' sm='12' className='mb-1'>
                          <div className="mb-1">
                            <Label className="form-label" for="remarks">
                              Remarks
                            </Label>
                            <Controller
                              id='remarks'
                              control={control}
                              name='remarks'
                              render={({ field }) => (
                                <Input
                                  placeholder='Remarks'
                                  isClearable
                                  // options={subBookingId}
                                  classNamePrefix='select'
                                  theme={selectThemeColors}
                                  className={classnames('react-select', { 'is-invalid': data !== null && data.remarks === null })}
                                  {...field}
                                />
                              )}
                            />

                          </div>
                        </Col>
                        <Col md='4' sm='12' className='mb-1'>
                          <div className='mb-1'>
                            <Label className='form-label' for='reason'>
                              Reason
                            </Label>
                            <Controller
                              id='reason'
                              control={control}
                              name='reason'
                              render={({ field }) => (
                                <Select
                                  isClearable
                                  options={reason}
                                  classNamePrefix='select'
                                  theme={selectThemeColors}
                                  className={classnames('react-select', { 'is-invalid': data !== null && data.reason === null })}
                                  {...field}
                                />
                              )}
                            />
                          </div>
                          <Col md='4' sm='12' className='mb-1'>
                            {/* <div className="d-flex">
                  <Button type='submit' className='mt-2' color='primary' >
                Submit
              </Button>
              </div>
                <div className="d-flex">
                  <Button type='reset' className='mt-2' color='secondary' outline onClick={onDiscard}>
                Clear
              </Button>
              </div> */}

                            <div className="d-flex">
                              <Button className="me-1" color="primary" type="submit" disabled={isOODButton} > {/* onClick={Alert}*/}
                                Submit
                              </Button>
                              {/* <Button type='reset' color='danger' outline onClick={onDiscard}>
              Close
            </Button> */}
                            </div>

                          </Col>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            </ModalBody>
          </Modal>
          {/* </Fragment>
                 <Fragment> */}



          <Modal isOpen={service} toggle={() => setService(!service)} className='modal-lg'>
            <ModalHeader className='modal-xl' toggle={() => setService(!service)}></ModalHeader>
            <ModalBody className='pb-3 px-sm-1 mx-20'>
              <div>
                <Card>
                  <CardBody>
                    <Button color="primary" onClick={HandleModal}>Add Out Of Service / Order   </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {/* <Button color="primary" onClick={setOpenForm}>Add Out Of Order</Button> */}
                  </CardBody>
                </Card>
                {/* <Col md='3' sm='12' className='mb-1'>
      <Label className='form-label' for='fullName'>
            Floor
      </Label>
      <Input
            type="text"
            id="filter-text-box2"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged2}
          />
          </Col> */}
                <div className="ag-theme-alpine" style={{ height: 520 }}>
                  <AgGridReact
                    ref={gridRef2}
                    rowData={outService} columnDefs={columnDefsOutService}
                    animateRows={true}
                    onCellClicked={cellClickedListener}
                    // paginationAutoPageSize = 'true'
                    onGridReady={params => {
                      params.api.sizeColumnsToFit();
                    }}
                    getRowStyle={getRowStyle}
                    rowSelection='multiple'
                    onSelectionChanged={onSelectionChanged}
                    rowMultiSelectWithClick={true}
                    paginationPageSize='10'
                    pagination='true'
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"

                  />
                </div>
              </div>
            </ModalBody>
          </Modal>


          {/* For Release */}
          <Modal isOpen={release} toggle={() => setRelease(!release)} className='modal-lg'>
            <ModalHeader className='modal-lg' toggle={() => setRelease(!release)}></ModalHeader>
            <ModalBody className='pb-3 px-sm-1 mx-20'>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">Out Of Service / Order</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <Row>
                        {/* <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="roomID">
            Room ID
            </Label>         
               <Controller
                    id='roomID'
                    control={control}
                    name='roomID'
                    render={({ field }) => (
                      <Input
                      placeholder='RoomID'
                        isClearable
                        // options={subBookingId}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.roomID === null })}
                        {...field}
                      />
                    )}
                  />
            
          </div>
          </Col> */}
                        <Card>
                          <p>Room Number:<b>{filldata['roomNumber']}</b></p>
                          {/* <p>
    Room Number:{" "}
    {room.map((num) => (
      <b>{num} </b>
    ))}
  </p> */}
                          {/* <p>
      Room Number:{" "}
      {room.split("").map((num) => (
        <b key={num}>{num} </b>
      ))}
    </p> */}
                        </Card>
                        <Col md='4' sm='12' className='mb-1'>
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
                                  // options={{ allowInput: true }}
                                  className={classnames('form-control', {
                                    'is-invalid': data !== null && data.fromDate === null
                                  })}
                                  value={filldata['fromDate']}
                                />
                              )}
                            />
                          </div>
                        </Col>
                        <Col md='4' sm='12' className='mb-1'>
                          <div className='mb-1'>
                            <Label className='form-label' id='startTime'>
                              Start Time
                            </Label>
                            <Input
                              className='form-control'
                              // value={basic}
                              id='startTime'
                              // options={{
                              //     enableTime: true,
                              //     noCalendar: true,
                              //     dateFormat: 'H:i',
                              //     // time_24hr: true
                              // }}
                              value={filldata['startTime']}

                            />
                          </div>
                        </Col>
                        <Col md='4' sm='12' className='mb-1'>
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
                                  options={options}
                                  // options={{ allowInput: true }}
                                  className={classnames('form-control', {
                                    'is-invalid': data !== null && data.toDate === null
                                  })}
                                  value={filldata['toDate']}

                                />
                              )}
                            />
                          </div>
                        </Col>
                        <Col md='4' sm='12' className='mb-1'>
                          <div className='mb-1'>
                            <Label className='form-label' id='endTime'>
                              End Time
                            </Label>
                            <Input
                              className='form-control'
                              // value={basic}
                              id='endTime'
                              options={{
                                enableTime: true,
                                noCalendar: true,
                                dateFormat: 'H:i',
                                // time_24hr: true
                              }}
                              value={filldata['endTime']}

                            />
                          </div>
                        </Col>
                        <Col md='4' sm='12' className='mb-1'>
                          <div className="mb-1">
                            <Label className="form-label" for="status">
                              Status
                            </Label>
                            <Controller
                              id='status'
                              control={control}
                              name='status'
                              render={({ field }) => (
                                <Input
                                  isClearable
                                  options={status}
                                  classNamePrefix='select'
                                  theme={selectThemeColors}
                                  className={classnames('react-select', { 'is-invalid': data !== null && data.status === null })}
                                  {...field}
                                  value={filldata['status']}

                                />
                              )}
                            />
                          </div>
                        </Col>
                        <Col md='4' sm='12' className='mb-1'>
                          <div className="mb-1">
                            <Label className="form-label" for="returnStatus">
                              Return Status
                            </Label>
                            <Controller
                              id='returnStatus'
                              control={control}
                              name='returnStatus'
                              render={({ field }) => (
                                <Input
                                  placeholder='Return Status'
                                  isClearable
                                  disabled={true}
                                  // options={returnSt}
                                  classNamePrefix='select'
                                  theme={selectThemeColors}
                                  className={classnames('react-select', { 'is-invalid': data !== null && data.status === null })}
                                  {...field}
                                  value={filldata['returnStatus']}
                                />
                              )}
                            />

                          </div>
                        </Col>
                        <Col md='4' sm='12' className='mb-1'>
                          <div className="mb-1">
                            <Label className="form-label" for="remarks">
                              Remarks
                            </Label>
                            <Controller
                              id='remarks'
                              control={control}
                              name='remarks'
                              render={({ field }) => (
                                <Input
                                  placeholder='Remarks'
                                  isClearable
                                  // options={subBookingId}
                                  classNamePrefix='select'
                                  theme={selectThemeColors}
                                  className={classnames('react-select', { 'is-invalid': data !== null && data.remarks === null })}
                                  {...field}

                                />
                              )}
                            />

                          </div>
                        </Col>
                        <Col md='4' sm='12' className='mb-1'>
                          <div className='mb-1'>
                            <Label className='form-label' for='reason'>
                              Reason
                            </Label>
                            <Controller
                              id='reason'
                              control={control}
                              name='reason'
                              render={({ field }) => (
                                <Input
                                  isClearable
                                  options={reason}
                                  classNamePrefix='select'
                                  theme={selectThemeColors}
                                  className={classnames('react-select', { 'is-invalid': data !== null && data.reason === null })}
                                  {...field}
                                  value={filldata['reasonCode']}

                                />
                              )}
                            />
                          </div>
                          <Col md='4' sm='12' className='mb-1'>
                            {/* <div className="d-flex">
                  <Button type='submit' className='mt-2' color='primary' >
                Submit
              </Button>
              </div>
                <div className="d-flex">
                  <Button type='reset' className='mt-2' color='secondary' outline onClick={onDiscard}>
                Clear
              </Button>
              </div> */}

                            <div className="d-flex">
                              <Button className="me-1" color="primary" type="submit" onClick={Alert}  >
                                Submit
                              </Button>
                              {/* <Button type='reset' color='danger' outline onClick={onDiscard}>
              Close
            </Button> */}
                            </div>

                          </Col>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            </ModalBody>
          </Modal>
        </Fragment>
      </div>


       {/* For Room Status Confirmation */}
       <Modal isOpen={confirmRelease} toggle={() => setConfirmRelease(!confirmRelease)} className='modal-dialog-centered'>
                <ModalHeader className='bg-transparent' toggle={() => setConfirmRelease(!confirmRelease)}></ModalHeader>
                <ModalBody className='px-5 pb-2'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>Confirm with room release?</h1>
                        {/* <p>you want to submit this form ? </p> */}
                    </div>
                    <Col>
                        <div className="button-container text-center">
                            <Button className="me-1" color="primary" type="submit" onClick={() => Release(confirmRelease)} >
                                Confirm
                            </Button>
                            <Button className="me-1" color="danger" onClick={() => setConfirmRelease(false)} >
                                Cancel
                            </Button>
                        </div>
                    </Col>
                </ModalBody>

            </Modal>


      {popUp &&
        <div className='disabled-animation-modal'>
          <Modal isOpen={popUp} toggle={() => setPopUp(!popUp)} className='modal-sm'  >   {/*onClosed={onDiscard}*/}
            <ModalHeader className='modal-sm' toggle={() => {
              setPopUp(!popUp)
            }}>Need To Check..</ModalHeader>
            <ModalBody className='pb-3 px-sm-2 mx-20'>
              <div>
                <b>{popUp}</b>
                <br></br>
                <br></br>
                <Button color="primary" className='text-center' onClick={()=>setPopUp(false)} >
                  Ok
                </Button>
              </div>
            </ModalBody>
          </Modal>

        </div>
      }

    </div>
  );
};

export default outOfOrderOrService;


