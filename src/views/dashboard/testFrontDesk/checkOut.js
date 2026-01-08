// ** React Imports
import { useState } from "react";
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

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {Input,Card,Form,Label,Button,CardBody,CardTitle,CardHeader,InputGroup,InputGroupText,Row,Col
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
import API_URL from "../../../config";
// const id='1'
// const date='2023-02-02'
// const roomID='30'


const activeoptions = [
  { value: "1", label: "Active" },
  { value: "0", label: "InActive" },
];





let Roomarr =[]
       
  // let floor = [
  //   fetchx(API_URL + '/getRoomFloorID?hotelID=1')
  //     .then(result => result.json())
  //     .then(resp => {
  //       // console.log(resp['data'])
  //       floor = resp['data'] 
  //       console.log(floor)
  //     })
  //   ]
    
        
    

        // {filldata.length!=0 && <AssignRoom data1={filldata}/>}

const CheckOut = ({data1}) => {


//console.log(data1['SubBookingId'])
//console.log(data1['FirstName']+' '+ data1['LastName'])
//console.log(data1['RoomTypeName'])


  const [selectedValue, setSelectedValue] = useState("");
  const [RoomData, setRoomData] = useState("");
  const [floor, setFloor] = useState([]);


  useEffect(() => {
    fetchx(API_URL + '/getRoomFloorID?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      // //console.log(resp['data'])
      setFloor(resp['data']) 
      //console.log(floor)
    })
  }, []);


  const handleSelectChange = (event) => {
    Roomarr=[]
    //console.log("In this function")
    if (event) {
      //console.log("Here")
       setSelectedValue(event.value);
       //console.log(event.value)
       for(let i =0;i<1;i++){
        //console.log(RoomData[event.value])
        for(let j=0;j<JSON.parse(RoomData[event.value]).length;j++){
          //console.log()
          let RoomNumber = {'value':JSON.parse(RoomData[event.value])[j] , 'label' : JSON.parse(RoomData[event.value])[j]}
          Roomarr.push(RoomNumber)
        }
       }
      //console.log(Roomarr);
    }
  };

  useEffect(() => {
    fetchx(API_URL + '/getRoomNumberByFloorID')
        .then(result => result.json())
        .then(resp => {
        //console.log(resp['data'])
        // //console.log("Hello")
        // //console.log(resp['data'])
        // //console.log(resp['data'][1])
        // //console.log(resp['data'][2])

        // for(let i=0; i<resp['data'].length; i++){
        //   //console.log(resp['data'][i])
        //   //console.log(resp['data'][i+1])
    
        // }

        setRoomData(resp['data'])

        })
      }, []);

        //console.log(RoomData)
    
//console.log(data1['id'])
let id=data1['id'];

const defaultValues = {
  SubBookingId: '',
  fullName: "",
  // assignedRoomType: "",
  floor: "" ,
  // RoomNumber : "",
  // comments: ""
};

  // AG Grid
  const [rowData, setRowData] = useState();


  // ** State
  const [data, setData] = useState(null);

  // ** Hooks
  const { reset, handleSubmit, control ,formState: { errors }
} = useForm({ defaultValues });

// console.log(RoomNumber)

  const onSubmit = (data1) => {
    setData(data1);
    //console.log(data1)
    if (
      // data.hotelID !== null &&
      data1.SubBookingId !== null &&
      data1.fullName !== null
      // data1.assignedRoomType &&
      // data1.floor!==null &&
      // data1.room !== null 
      // data1.comments !== null
    ) {
      //console.log(data);
      let createasset = JSON.stringify({
        // "hotelID": data.hotelID,
        // "SubBookingId": data1.SubBookingId,
        // "fullName": data1.fullName,
        // "assignedRoomType": data1.assignedRoomType,
        // "floorID": data1.floor.label,
        "RoomNumber": null,
        "PmsStatus": 'Checked Out'
      });

//console.log(data1['SubBookingId'])

         
      //console.log(createasset);
      let res = fetchx(API_URL + "/updateReservationBooking?id="+id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: createasset,
      }).then((res) => {
        //console.log(res);
   
         
      });
      toast(
        <div className="d-flex">
          <div className="me-1">
            <Avatar size="sm" color="success" icon={<Check size={12} />} />
          </div>
          <div className="d-flex flex-column">
            <h6>Form Submitted!</h6>
            <h4>Room Assign Successfull</h4>
          </div>
        </div>
      );
    }
    
  };

  const handleReset = () => {
    reset({
      SubBookingId: "",
        fullName: "",
        // assignedRoomType: "",
        floor: "",
        // RoomNumber: "",
        // comments: ""
    });
  };

  function Alert(){
    alert("Are You Really Want To CheckOut")
  }

  return (
    <div>
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Check-Out Form</CardTitle>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
          {/* <Col md='6' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="hotelID">
              Hotel ID
            </Label>
            <InputGroup className="input-group-merge">
              <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && data.IsActive === null,
                })}
              ></InputGroupText>
              <Controller
                id="hotelID"
                name="hotelID"
                control={control}
                placeholder="hotel ID"
                render={({ field }) => (
                  <Cleave
                    {...field}
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.hotelID === null,
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col> */}
         
          <Col md='6' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="SubBookingId">
            Sub Booking Id
            </Label>         
               <Controller
                    id='SubBookingId'
                    control={control}
                    name='SubBookingId'
                    render={({ field }) => (
                      <Input
                        isClearable
                        // options={subBookingId}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.SubBookingId === null })}
                        {...field}
                        disabled={true}
                        value={data1['SubBookingId']}
                      />
                    )}
                  />
            
          </div>
          </Col>
        
         
          <Col md='6' sm='12' className='mb-1'>
          <div className='mb-1'>
            <Label className='form-label' for='fullName'>
            Guest Name
            </Label>
            <Controller
                    id='fullName'
                    control={control}
                    name='fullName'
                    render={({ field }) => (
                      <Input
                        isClearable
                        // options={fullName}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.fullName === null })}
                        {...field}
                        disabled={true}
                        value={data1['FirstName']+' '+ data1['LastName']}

                      />
                    )}
                  />
          </div>
          </Col>

          <Col md='6' sm='12' className='mb-1'>
          <div className='mb-1'>
            <Label className='form-label' for='assignedRoomType'>
            Assigned Room Type
            </Label>
            <Controller
                    id='assignedRoomType'
                    control={control}
                    name='assignedRoomType'
                    render={({ field }) => (
                      <Input
                        isClearable
                        // options={assignedRoomType}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.assignedRoomType === null })}
                        disabled={true}
                        {...field}
                        value={data1['RoomTypeName']}
                      />
                    )}
                  />
          </div>
          </Col>
          {/* <Col md='6' sm='12'>
          <div className='mb-1'>
            <Label className='form-label' for='floor'>
            Select Floor
            </Label>          
            <Controller
                    id='floor'
                    control={control}
                    name='floor'
                    render={({ }) => (
                      <Select
                        isClearable
                        // value={selectedValue}
                        options={floor}
                        classNamePrefix='select'
                        onChange={handleSelectChange}
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.floor === null })}
                        // {...field}
                      />
                    )}
                  />          
          </div>
          </Col> */}

          <Col md='6' sm='12' className='mb-1'>
          <div className='mb-1'>
            <Label className='form-label' for='RoomNumber'>
            Select Room
            </Label>        
            <Controller
                    id='RoomNumber'
                    control={control}
                    name='RoomNumber'
                    render={({ field }) => (
                      <Input
                        isClearable
                        disabled={true}
                        options={Roomarr}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.RoomNumber === null })}
                        {...field}
                        value={data1['RoomNumber']}

                      />
                    )}
                  />          
          </div>
          </Col>
        

          <Col md='6' sm='12' className='mb-1'>
          <div className='mb-1'>
            <Label className='form-label' for='start'>
            Start Date
            </Label>        
              <Controller
                id='start'
                name='start'
                control={control}
                render={({ field }) => (
                  <Input
                   required
                   placeholder='start'
                    {...field}
                    disabled={true}
                    // className={classnames('form-control', {
                    //   'is-invalid': data !== null && (data.start === null || !data.start.length)
                    // })}
                    value={data1['Start']}
                  />
                )}
              />         
          </div>
          </Col>
          <Col md='6' sm='12' className='mb-1'>
          <div className='mb-1'>
            <Label className='form-label' for='end'>
            End Date
            </Label>        
              <Controller
                id='end'
                name='end'
                control={control}
                render={({ field }) => (
                  <Input
                   required
                   placeholder='End'
                    {...field}
                    disabled={true}
                    // className={classnames('form-control', {
                    //   'is-invalid': data !== null && (data.end === null || !data.end.length)
                    // })}
                    value={data1['End']}
                  />
                )}
              />         
          </div>
          </Col>
          
          
          <div className="d-flex">
            <Button className="me-1" color="primary" type="submit" onClick={Alert}>
              Check Out
            </Button>
            <Button
              outline
              color="secondary"
              type="reset"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
          
          </Row>
        </Form>
      </CardBody>
    </Card>
    {/* <div className="ag-theme-alpine" style={{ height: 520}}>
        <AgGridReact 
            ref={gridRef}
            rowData={rowData} columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            // paginationAutoPageSize = 'true'
            paginationPageSize= '10'
            pagination = 'true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            
            />
      </div> */}
    {/* <App/> */}
    </div>
  );
};

export default CheckOut;
