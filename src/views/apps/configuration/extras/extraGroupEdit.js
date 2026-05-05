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
    extraGroupID: null,

};

let companyID = [
    fetchx(API_URL + "/getGuestProfileCompanyID?hotelID=1")
        .then((result) => result.json())
        .then((resp) => {
            companyID = resp["data"];
        }),
];

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

const isActiveDropDown = [
    { value: "1", label: "Active" },
    { value: "0", label: "In Active" },

];


const Floor = ({ data1 }) => {
    console.log("data1", data1)
    const [gstNumber, setgstNumber] = useState()
    const [selectedValue1, setSelectedValue1] = useState(data1.isActive);

    const [showGSTModal, setShowGSTModal] = useState(false);
    const [tagCompany, settagCompany] = useState(false)
    const [gstDetails, setGstDetails] = useState(null);
    const [newIndustry, setIndustry] = useState()
  const [groupExtraName, setGroupExtraName] = useState()

    const [reload, setreload] = useState(true);
  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      html: message.replace(/\n/g, '<br />'),
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }


    //Salutation
    const handleChange1 = (selectedOption1) => {
        setSelectedValue1(selectedOption1.value);
        setreload(false);
        setTimeout(() => {
            setreload(true);
        }, 1);
    };

  useEffect(() => {
  
    fetchx(API_URL + `/getGroupExtra`)
      .then(result => result.json())
      .then(resp => {
        // //console.log(resp['data'])
         const formatted = resp['data']?.map(item => ({
        value: item.id,                 
        label: item.extraGroupName,     
        ...item                         // keep full object if needed
      }));

      setGroupExtraName(formatted);
        // setGroupExtraName(resp['data'])
        //console.log(extraName)
      })
  }, [])

    //console.log(company)
    const handleSuccess = () => {
        return MySwal.fire({
            title: 'Extra Group Updated',
            text: 'Extra Group Updated Successfully !!',
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        })
    }





    //Salutation
    const defaultReason1 = {
        value: data1.extraGroupID,
        label: data1.extraGroupName,
    };



    // ** Hooks
    const {
        setError,
        formState: { errors },
        setValue,
    } = useForm();

    // ** State
    const [data, setData] = useState(null);

    // ** Hooks
    const { reset, handleSubmit, control, watch } = useForm({ defaultValues });
    let navigate = useNavigate();

    const onSubmit = (data) => {

        setData(data);
console.log("data", data1)
        const createmarketGroup = JSON.stringify({
            extraGroupID: selectedValue1,
         extraID: data1.id,

        })
        console.log(createmarketGroup)
        //console.log(extraValue.length, preferenceValue.length)
        let res = fetchx(API_URL + "/updateExtrasExtraGroup", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: createmarketGroup
        }).then((data) => data.json())
            .then((res) => {
                //console.log(res)
                if(res.statusCode === 200){
  handleSuccess()
                setTimeout(() => { navigate(''); }, 500)
                }
                else{
    handleError(res.message)
                }
              
            })



    };


    const handleChange9 = (event) => {
        // //console.log(event.target.value)
        setIndustry(event.target.value);
        // //console.log(selectedOption8.label);

    };

    const handleReset = () => {
        reset({
            extraGroup: null,

        });
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag="h4">Edit Extra Group</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md='10' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="extraGroup">
                                        Extra Group <spam style={{ color: "red" }}>*</spam>
                                    </Label>
                                    <Controller
                                        required
                                        id="extraGroup"
                                        control={control}
                                        name="extraGroup"
                                        render={({ field }) => (
                                            <Select
                                                required
                                                isClearable
                                                defaultValue={defaultReason1}
                                                options={groupExtraName}
                                                classNamePrefix="select"
                                                theme={selectThemeColors}
                                                className={classnames("react-select", {
                                                    "is-invalid": data !== null && data.extraGroup === null,
                                                })}
                                                {...field}
                                                onChange={handleChange1}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                        </Row>
                     


                        <div align='start' className='buttons' >
                            {/* <div className="d-flex"> */}

                            <Button
                                className="me-1"
                                color="primary"
                                type="submit"

                            >
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
                            {/* </div> */}
                        </div>
                    </Form>
                </CardBody>
            </Card>

            {/* GST Details Modal */}
            {showGSTModal && gstDetails && (
                <Modal isOpen={showGSTModal} toggle={() => setShowGSTModal(false)}>
                    <ModalHeader toggle={() => setShowGSTModal(false)}>
                        GST Details
                    </ModalHeader>
                    <ModalBody>
                        <p><strong>Legal Name:</strong> {gstDetails.legal_name_of_business}</p>
                        <p><strong>Trade Name:</strong> {gstDetails.trade_name_of_business}</p>


                        <p><strong>GST Number:</strong> {gstDetails.GSTIN}</p>
                        <p><strong>Address:</strong> {gstDetails.principal_place_address}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => setShowGSTModal(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
            )}

            {tagCompany && gstDetails && (
                <Modal isOpen={tagCompany}>
                    <ModalHeader toggle={() => {
                        settagCompany(false)
                        setgstNumber()
                    }
                    }>
                        GST Details
                    </ModalHeader>
                    <ModalBody>
                        <h3>        Do you want to tag this company to this profile?
                        </h3>
                        <p><strong>Legal Name:</strong> {gstDetails.legal_name_of_business}</p>
                        <p><strong>Trade Name:</strong> {gstDetails.trade_name_of_business}</p>

                        <p><strong>GST Number:</strong> {gstDetails.GSTIN}</p>
                        <p><strong>Address:</strong> {gstDetails.principal_place_address}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => TagGuestCompany()}>
                            OK
                        </Button>
                        <Button color="danger" onClick={() => {
                            settagCompany(false)
                            setgstNumber()
                            // setdefaultReason3()
                            // setreload(false);
                            // setTimeout(() => {
                            //   setreload(true);
                            // },);
                        }
                        }>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </div>
    );
};

export default Floor;
