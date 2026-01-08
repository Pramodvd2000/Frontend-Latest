import { Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Button, Label, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Collapse, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { Badge } from 'reactstrap'
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

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { selectThemeColors } from "@utils";
import {
    InputGroup,
    InputGroupText,

  } from "reactstrap";

const roomTypeOptions = [
    { value: "KSUP", label: "KSUP" },
    { value: "TSUP", label: "TSUP" },
    { value: "KDLX", label: "KDLX" },
    { value: "TDLX", label: "TDLX" },
    { value: "KCLB", label: "KCLB" },
    { value: "PM", label: "PM" },
  ];

const floorOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
  ];
  
  
  
  const defaultValues = {
    clientID: "",
    bookingID: "",
    floor: null,
    guestName: "",
    roomType  : null,
    oldRoomNumber: "",
    newRoomNumber: "",
  };
  
const ChangeRoomlastForm = () =>{ 
    const [data, setData] = useState(null);

  // ** Hooks
  const { reset, handleSubmit, control ,formState: { errors }
} = useForm({ defaultValues });

  const onSubmit = (data) => {
    setData(data);
    console.log(data)
    if (
      // data.hotelID !== null &&
      data.clientID !== null &&
      data.bookingID !== null &&
      data.floor &&
      data.guestName!==null &&
      data.roomType !== null &&
      data.oldRoomNumber !== null &&
      data.newRoomNumber !== null
    ) {
      console.log(data);
      let createasset = JSON.stringify({
        // "hotelID": data.hotelID,
        "clientID": data.clientID,
        "bookingID": data.bookingID,
        "floor": data.floor.value,
        "guestName": data.guestName,
        "roomType": data.roomType.value,
        "oldRoomNumber": data.oldRoomNumber,
        "newRoomNumber": data.newRoomNumber,
      });
      console.log(createasset);
      let res = fetchx(API_URL + "/addchangeroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: createasset,
      }).then((res) => {
        console.log(res);
      });
      toast(
        <div className="d-flex">
          <div className="me-1">
            <Avatar size="sm" color="success" icon={<Check size={12} />} />
          </div>
          <div className="d-flex flex-column">
            <h6>Form Submitted!</h6>
            <h4>Room Changed Successfull</h4>
          </div>
        </div>
      );
    }
  };

  const handleReset = () => {
    reset({
        clientID: "",
        bookingID: "",
        floor: null,
        guestName: "",
        roomType  : null,
        oldRoomNumber: "",
        newRoomNumber: "",
    });
  };

  return(
    <div>
      {/* Badges */}
      <div className='demo-inline-spacing'>
      <h3><Badge color='success'>Inspected</Badge></h3>
      <h3><Badge color='primary'> Clean Occupied</Badge></h3>
      <h3><Badge color='danger'>Dirty</Badge></h3>
      <h3><Badge color='secondary'>Out Of Order</Badge></h3>
      <h3><Badge color='warning'>Out Of Service</Badge></h3>
      {/* <Badge color='info'>Info</Badge>
<Badge color='dark'>Dark</Badge> */}
    </div>

    <br></br><br></br>



  
    <div>
        {/* <CardTitle tag="h4"></CardTitle> */}
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
            <Label className="form-label" for="clientID">
            Client ID
            </Label>
            <InputGroup className="input-group-merge">
              <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && (data.clientID === null || !data.clientID.length)
                })}
              ></InputGroupText>
              <Controller
                id="clientID"
                name="clientID"
                control={control}
                render={({ field }) => (
                  <Cleave
                  placeholder="Client ID"
                    {...field}
                    className={classnames("form-control", {
                      "is-invalid":
                        data !== null && (data.clientID === null || !data.clientID.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          <Col md='6' sm='12' className='mb-1'>
          <div className='mb-1'>
            <Label className='form-label' for='bookingID'>
            Booking ID
            </Label>
            <InputGroup className='input-group-merge'>
              <InputGroupText
                className={classnames({
                  'is-invalid': data !== null && (data.bookingID=== null || !data.bookingID.length)
                })}
              >
              </InputGroupText>
              <Controller
                id='bookingID'
                name='bookingID'
                control={control}
                render={({ field }) => (
                  <Cleave
                  placeholder='Booking ID'
                    {...field}
                    className={classnames('form-control', {
                      'is-invalid': data !== null && (data.bookingID === null || !data.bookingID.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          <Col md='6' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="floor">
            Floor
            </Label>
            <Controller
              id="floor"
              control={control}
              name="floor"
              render={({ field }) => (
                <Select
                  isClearable
                  options={floorOptions}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  className={classnames("react-select", {
                    "is-invalid": data !== null && data.floor === null,
                  })}
                  {...field}
                />
              )}
            />
          </div>
          </Col>
          <Col md='6' sm='12' className='mb-1'>
          <div className='mb-1'>
            <Label className='form-label' for='guestName'>
            Guest Name
            </Label>
            <InputGroup className='input-group-merge'>
              <InputGroupText
                className={classnames({
                  'is-invalid': data !== null && (data.guestName=== null || !data.guestName.length)
                })}
              >
              </InputGroupText>
              <Controller
                id='guestName'
                name='guestName'
                control={control}
                render={({ field }) => (
                  <Cleave
                  placeholder='Guest Name'
                    {...field}
                    className={classnames('form-control', {
                      'is-invalid': data !== null && (data.guestName === null || !data.guestName.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          <Col md='6' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="roomType">
            Room Type
            </Label>
            <Controller
              id="roomType"
              control={control}
              name="roomType"
              render={({ field }) => (
                <Select
                  isClearable
                  options={roomTypeOptions}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  className={classnames("react-select", {
                    "is-invalid": data !== null && data.roomType === null,
                  })}
                  {...field}
                />
              )}
            />
          </div>
          </Col>
          <Col md='6' sm='12' className='mb-1'>
          <div className='mb-1'>
            <Label className='form-label' for='numOodRooms'>
            Old Room Number
            </Label>
            <InputGroup className='input-group-merge'>
              <InputGroupText
                className={classnames({
                  'is-invalid': data !== null && (data.oldRoomNumber=== null || !data.oldRoomNumber.length)
                })}
              >
              </InputGroupText>
              <Controller
                id='oldRoomNumber'
                name='oldRoomNumber'
                control={control}
                render={({ field }) => (
                  <Cleave
                  placeholder='Old Room Number'
                    {...field}
                    className={classnames('form-control', {
                      'is-invalid': data !== null && (data.oldRoomNumber === null || !data.oldRoomNumber.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          <Col md='6' sm='12' className='mb-1'>
          <div className='mb-1'>
            <Label className='form-label' for='newRoomNumber'>
            New Room Number
            </Label>
            <InputGroup className='input-group-merge'>
              <InputGroupText
                className={classnames({
                  'is-invalid': data !== null && (data.newRoomNumber=== null || !data.newRoomNumber.length)
                })}
              >
              </InputGroupText>
              <Controller
                id='newRoomNumber'
                name='newRoomNumber'
                control={control}
                render={({ field }) => (
                  <Cleave
                  placeholder='New Room Number'
                    {...field}
                    className={classnames('form-control', {
                      'is-invalid': data !== null && (data.newRoomNumber === null || !data.newRoomNumber.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          
          <div className="d-flex">
            <Button className="me-1" color="primary" type="submit">
              Submit
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
    </div>
    
    </div>
)

 
}

export default ChangeRoomlastForm