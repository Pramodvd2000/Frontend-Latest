// ** React Imports
import { useState } from "react";
import { FaEye } from "react-icons/fa"; // Import eye icon

// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Moment from "moment";
import React from "react";
import { selectThemeColors } from "@utils";
import API_URL from "../../../../config";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Card,
  Form,
  Row,
  Col,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from "react";
// const id = '1';
import { useNavigate } from "react-router-dom";
// ** Third Party Components
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const defaultValues = {
  isActive: null,
  extraGroup: "",

};



let lastRate = [
  fetchx(API_URL + "/getGuestProfileLastRateID?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      lastRate = resp["data"];
    }),
];

let lastRoomID = [
  fetchx(API_URL + "/getGuestProfileLastRoomID?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      lastRoomID = resp["data"];
    }),
];

let vipID = [
  fetchx(API_URL + "/getGuestProfileVipID?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      vipID = resp["data"];
    }),
];

let countryOptions = [
  fetchx(API_URL + "/getGuestProfileCountry?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      countryOptions = resp["data"];
    }),
];




const Floor = ({ data1 }) => {
  const [selectedValue1, setSelectedValue1] = useState(data1.isActive);
  const [extraGroupName, setExtraGroupName] = useState(data1.extraGroupName);
  const [extraName, setExtraName] = useState([])
  const [data, setData] = useState(null);


  const ExtraFromDatabase = data1.extra ? data1.extra.split(",").map((extra) => extra.trim()) : [];
  const ExtraIDFromDatabase = data1.extraID ? data1.extraID.split(",").map((id) => parseInt(id)) : [];

  const isExtra = ExtraFromDatabase != undefined && ExtraIDFromDatabase != undefined;


  const defaultReason = isExtra ? ExtraFromDatabase.map((extra, index) => ({
    value: parseInt(ExtraIDFromDatabase[index]),
    label: extra,
  }))
    : [];
  const [extraValue, setExtraOption] = useState(defaultReason.map((option) => option.value));

  const navigate = useNavigate();

  const handleSuccess = () => {
    return MySwal.fire({
      title: 'Extra Group Updated',
      text: 'Extra Group Updated Successfully !!',
      icon: 'success',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    });
  };



  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }

  useEffect(() => {
    fetchx(API_URL + '/getExtraDescription')
      .then(result => result.json())
      .then(resp => {
        // //console.log(resp['data'])
        setExtraName(resp['data'])
        //console.log(extraName)
      })
  }, [])


  const {
    formState: { errors },
    reset,
    handleSubmit,
    control
  } = useForm({
    defaultValues: {
      names: data1.extraGroupName
    }
  });

  const onSubmit = () => {
    const payload = JSON.stringify({
      extraIDs: extraValue == null ? null : extraValue,
      extraGroupName: extraGroupName,
      extraGroupID: data1.id
    });

    fetchx(API_URL + "/updateGroupExtra", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: payload
    })
      .then(res => res.json())
      .then((res) => {
        if (res.statusCode === 200) {
          handleSuccess();
          setTimeout(() => navigate(''), 500);
        } else {
          handleError(res.message);
          console.error(res);
        }
      });
  };

  const handleReset = () => {
    reset({
      names: data1.extraGroupName
    });
    setExtraGroupName(data1.extraGroupName);
  };

  const handleChange = (selectedOption) => {
    const selectedIds = selectedOption.map(option => option.value);
    //console.log(selectedIds)
    setExtraOption(selectedIds);
    //console.log(selectedOption.label);

  };
  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Edit Extra Group</CardTitle>
      </CardHeader>

      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md='10' sm='12' className='mb-1'>
              <Label className="form-label">
                Extra Group Name <span style={{ color: "red" }}>*</span>
              </Label>

              <Controller
                name="names"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={extraGroupName}
                    onChange={(e) => {
                      field.onChange(e);
                      setExtraGroupName(e.target.value);
                    }}
                    placeholder="Enter Extra Group Name"
                    invalid={errors.names && true}
                    required
                  />
                )}
              />
            </Col>
          </Row>
          <Row>
            <Col md='10' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='extras' >
                  Select Extra
                </Label>
                <Controller
                  id='extras'
                  control={control}
                  name='extras'
                  render={({ field }) => (
                    <Select
                      // required
                      isMulti
                      isClearable
                      defaultValue={defaultReason}
                      options={extraName}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.extras === null })}
                      {...field}
                      onChange={handleChange}

                    />
                  )}
                />
              </div>
            </Col>


          </Row>

          <div className='buttons'>
            <Button className="me-1" color="primary" type="submit">
              Submit
            </Button>

            <Button outline color="secondary" type="button" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Floor;
