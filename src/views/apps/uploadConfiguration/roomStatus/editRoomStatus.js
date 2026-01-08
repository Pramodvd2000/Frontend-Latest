import { useState } from 'react'
import Select from "react-select";
import classnames from "classnames";
import { selectThemeColors } from "@utils";

import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import { Input, Card, Form, Row, Col, Label, Button ,Modal,InputGroup} from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { useRef, useEffect} from 'react';
import API_URL2 from '../../../../config2'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
const MySwal = withReactContent(Swal)

  const defaultValues = { 
    block: ''
  }

  const colourOptions = [
    { value: "1", label: "Smoking" },
    { value: "0", label: "NonSmoking" },
  ];
  

  const roomStatus = [
    { value: "Inspected", label: "Inspected" },
    { value: "Dirty", label: "Dirty" },
    { value: "Clean", label: "Clean" },
  ];
  
  const reservationStatus = [
    { value: "Arrival", label: "Arrival" },
    { value: "Reserved", label: "Reserved" },
    { value: "Not Reserved", label: "Not Reserved" },
    { value: "Checked In", label: "Checked In" },
    { value: "Due Out", label: "Due Out" },
  ];
  
  const frontOfficeStatus = [
    { value: "Vacant", label: "Vacant" },
    { value: "Occupied", label: "Occupied" },
  ];

  let blockID = [
    fetchx(API_URL2 + "/getfloorblockid?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        // console.log(resp['data'])
        blockID = resp["data"];
        // console.log(blockID);
      }),
  ];
  
  let floorID = [
    fetchx(API_URL2 + "/getRoomFloorID?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        console.log(resp['data'])
        floorID = resp["data"];
        // console.log(floorID);
      }),
  ];
  
  let roomTypeID = [
    fetchx(API_URL2 + "/getRoomRoomTypeID?hotelID=1")
      .then((result) => result.json())
      .then((resp) => {
        console.log(resp['data'])
        roomTypeID = resp["data"];
        // console.log(roomTypeID);
      }),
  ];
  

  
   const editBlock = ({data1}) => {
    console.log(data1)
       
    const {setError,formState: { errors }} = useForm()
    const [rowData, setRowData] = useState();
    const [data, setData] = useState(null)
    const { reset, handleSubmit, control } = useForm({ defaultValues })
    let navigate = useNavigate();  
    const [flag,setflag] = useState(false)  
    const [reload, setreload] = useState(true)

      const [TransactionCodeData,setTransactionCodeData] = useState([])


  useEffect(() => {
    fetchx(API_URL2 + '/getRateCode?hotelID=1')
      .then(result => result.json())
      .then(rowData => setRowData(rowData['data']))

      fetchx(API_URL2 +"/getAccomadationTransactionCode?hotelID=1")
      .then((result) => result.json())
      .then((rowData) => setTransactionCodeData(rowData["data"][0]['id']));
  }, []);
  const defaultReason = {
    value: data1.frontOfficeStatus,
    label: data1.frontOfficeStatus,
  }; 

  const defaultReason1 = {
    value: data1.reservationStatus,
    label: data1.reservationStatus,
  }; 

  const defaultReason2 = {
    value: data1.floorID,
    label: data1.floorID,
  }; 

  const defaultReason3 = {
    value: data1.roomTypeID,
    label: data1.roomType,
  }; 

  const defaultReason4 = {
    value: data1.roomStatus,
    label: data1.roomStatus,
  }; 

  const onSubmit = (data) => {
    console.log(data)
    setData(data);
      let createmarketGroup = JSON.stringify({
        // "id": data1.id,
        roomNumber: data.roomNumber1,
        "roomStatus": (data.roomStatus === undefined)
        ? data1.roomStatus
        : (data.roomStatus === null)
          ? null
          : data.roomStatus.value,
        "frontOfficeStatus": (data.frontOfficeStatus1 === undefined)
        ? data1.frontOfficeStatus
        : (data.frontOfficeStatus1 === null)
          ? null
          : data.frontOfficeStatus1.value,
        "reservationStatus": (data.reservationStatus1 === undefined)
        ? data1.reservationStatus
        : (data.reservationStatus1 === null)
          ? null
          : data.reservationStatus1.value,
        "floorID": (data.floorID1 === undefined)
        ? data1.floorID
        : (data.floorID1 === null)
          ? null
          : data.floorID1.value,
        // isSmoking: data.smokingType === null ? null : data.smokingType.value,
        "roomTypeID": (data.roomTypeID1 === undefined)
        ? data1.roomTypeID
        : (data.roomTypeID1 === null)
          ? null
          : data.roomTypeID1.value,
                  
          }); 
      let columnsToUpdate = createmarketGroup
      let resp = fetchx(API_URL2 + `/updateRoomsData?id=${data1.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: columnsToUpdate,
        }
      )
        .then((result) => result.json())
        .then((resp) => {
                 if(resp['statusCode']==200){
            const swalInstance = MySwal.fire({
             text: 'Room Details Updated Successfully!',
             icon: 'success',
             buttonsStyling: false,
             confirmButtonText: 'Close',
             customClass: {
               confirmButton: 'btn btn-danger'
             }
         });
         swalInstance.then((result) => {
           if (result.isConfirmed) {      
             navigate('');
           }
         }); 
        
         }
         else{
            const swalInstance = MySwal.fire({
                text: 'Room Details Not Updated!',
                icon: 'error',
                buttonsStyling: false,
                confirmButtonText: 'Close',
                customClass: {
                  confirmButton: 'btn btn-danger'
                }
            });
            swalInstance.then((result) => {
              if (result.isConfirmed) {      
                navigate('');
              }
            });  
         }
    
        })
        .catch((error) => {
        });
        
  };
 
 

  return (
    <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Row>            
              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="roomNumber1">
                  Room Number 
                  </Label>
                  <Controller
                    defaultValue={data1["roomNumber"]}
                    control={control}
                    id="roomNumber1"
                    name="roomNumber1"
                    render={({ field }) => (
                      <Input
                        required
                        placeholder="Name"
                        invalid={errors.roomNumber1 && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>
                      <Col md="3" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="roomStatus">
                            Room Status 
                          </Label>
                          <Controller
                            id="roomStatus"
                            control={control}
                            name="roomStatus"
                            render={({ field }) => (
                              <Select
                              defaultValue={defaultReason4}
                                isClearable
                                options={roomStatus}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  // "is-invalid":
                                    // data !== null && data.roomStatus === null,
                                })}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col md="3" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="frontOfficeStatus1">
                            Front Office Status
                          </Label>
                          <Controller
                            id="frontOfficeStatus1"
                            control={control}
                            name="frontOfficeStatus1"
                            render={({ field }) => (
                              <Select
                              defaultValue={defaultReason}
                                isClearable
                                options={frontOfficeStatus}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  // "is-invalid":
                                    // data !== null &&
                                    // data.frontOfficeStatus === null,
                                })}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col>

                      <Col md="3" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="reservationStatus1">
                            Reservation Status
                          </Label>
                          <Controller
                            id="reservationStatus1"
                            control={control}
                            name="reservationStatus1"
                            render={({ field }) => (
                              <Select
                              defaultValue={defaultReason1}
                                isClearable
                                options={reservationStatus}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  // "is-invalid":
                                  //   data !== null &&
                                  //   data.reservationStatus === null,
                                })}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col>
                     
                      <Col md="3" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="floorID">
                            Floor <spam style={{color:'red'}}>*</spam>
                          </Label>
                          <Controller
                            id="floorID"
                            control={control} 
                            name="floorID"
                            render={({ field }) => (
                              <Select
                              defaultValue={defaultReason2}
                              required
                                isClearable
                                options={floorID}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  // "is-invalid":
                                    // data !== null && data.floorID === null,
                                })}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col>

                      {/* <Col md="3" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="smokingType">
                            Smoking Type <spam style={{color:'red'}}>*</spam>
                          </Label>
                          <Controller
                            id="smokingType"
                            control={control}
                            name="smokingType"
                            render={({ field }) => (
                              <Select
                              required
                                isClearable
                                options={colourOptions}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  "is-invalid":
                                    data !== null && data.smokingType === null,
                                })}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col> */}

                      <Col md="3" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="roomTypeID1">
                            Room Type ID <spam style={{color:'red'}}>*</spam>
                          </Label>
                          <Controller
                            id="roomTypeID1"
                            control={control}
                            name="roomTypeID1"
                            render={({ field }) => (
                              <Select
                              defaultValue={defaultReason3}
                              required
                                isClearable
                                options={roomTypeID}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  // "is-invalid":
                                  //   data !== null && data.roomTypeID === null,
                                })}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col>
      
              </Row>
            </div>

                          <br/>
           <div align='end' className='buttons'>
            <Button className="me-1" color="primary" type='submit' onClick={()=>setflag(true)}>
           Update And Exit
           </Button>
                    </div>           

          </Form>
    </div>
  )
}

export default editBlock;