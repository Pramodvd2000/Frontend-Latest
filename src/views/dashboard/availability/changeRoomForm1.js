import { Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Button, Label, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Collapse, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { useState } from "react";
// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { selectThemeColors } from "@utils";


const roomTypeOptions = [
  { value: "KSUP", label: "KSUP" },
  { value: "TSUP", label: "TSUP" },
  { value: "KDLX", label: "KDLX" },
  { value: "TDLX", label: "TDLX" },
  { value: "KCLB", label: "KCLB" },
  { value: "PM", label: "PM" },
];

const roomStatusOptions  = [
  { value: "Inspected", label: "Inspected" },
  { value: "Dirty", label: "Dirty" },
  { value: "Clean", label: "Clean" },
];

const defaultValues = {
  roomType  : null,
  roomStatus: null,

};


const ChangeRoom = () =>{
  const [data, setData] = useState(null);

  // ** Hooks
  const { reset, handleSubmit, control ,formState: { errors }
} = useForm({ defaultValues });

  const onSubmit = (data) => {
    setData(data);
    console.log(data)
    if (
      // data.hotelID !== null &&
      data.roomType !== null &&
      data.roomStatus !== null
    ) {
      console.log(data);
      let createasset = JSON.stringify({
        // "hotelID": data.hotelID,
        "roomType": data.roomType.value,
        "roomStatus": data.roomStatus,
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
        
        roomType  : null,
        roomStatus: null,
        
    });
  };

  return(
    <div>
      <Form>
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
                  isClearable
                  options={roomStatusOptions}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  className={classnames("react-select", {
                    "is-invalid": data !== null && data.roomStatus === null,
                  })}
                  {...field}
                />
              )}
            />
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
          </Form>
    </div>
      // <Form>
      //   <Col md='12'>
      //     <Row>
      //       <Col md='10' sm='22' className='label'>
      //         <Label className='label' for='cityMulti'>
      //           Room Type
      //         </Label>
      //         <Input type='select' id='Select Room Type'>
      //           <option>---Select Room Type---</option>
      //           <option>KSUP</option>
      //           <option>TSUP</option>
      //           <option>EXE</option>
      //           <option>KDLX</option>
      //           <option>TDLX</option>
      //           <option>KCLB</option>
      //           <option>PM</option>
      //         </Input>
      //       </Col>
      //       <br></br>
      //       <Col md='10' sm='22' className='label'>
      //         <Label className='label' for='EmailMulti'>
      //           Room Status
      //         </Label>
      //         <Input type='select' id='Resevation Status Type'>
      //           <option>---Select Status---</option>
      //           <option>Inspected</option>
      //           <option>Dirty</option>
      //           <option>Clean</option>
      //         </Input>
      //       </Col>
      //     </Row>
      //     </Col>
      //     </Form>
)

 
}

export default ChangeRoom