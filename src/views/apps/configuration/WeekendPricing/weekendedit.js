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
    industry: "",

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
    const [selectedValue1, setSelectedValue1] = useState(data1.isActive);



    const [reload, setreload] = useState(true);
    const [popUp, setPopUp] = useState(false);


    //Salutation
    const handleChange1 = (selectedOption1) => {
        setSelectedValue1(selectedOption1.value);
        setreload(false);
        setTimeout(() => {
            setreload(true);
        }, 1);
    };



    //console.log(company)
    const handleSuccess = () => {
        return MySwal.fire({
            title: 'Weekend Updated',
            text: 'Weekend Updated Successfully !!',
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        })
    }





    //Salutation
    const defaultReason1 = {
        value: data1.weekends,
        label: data1.weekends == "1" ? "Active" : "In Active",
    };


    console.log("data1 in edit", data1)
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

        const createmarketGroup = JSON.stringify({
            isActive: selectedValue1,
            id: data1.id,

        })
        console.log(createmarketGroup)
        //console.log(extraValue.length, preferenceValue.length)
        let res = fetchx(API_URL + "/updateWeekendActive", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: createmarketGroup
        }).then((data) => data.json())
            .then((res) => {
                //console.log(res)
                if (res.statusCode === 200) {
                    handleSuccess()
                    setTimeout(() => { navigate(''); }, 500)
                }
            })



    };




    const handleReset = () => {
        reset({
            isActive: null,
            industry: "",

        });
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag="h4">Edit weekend</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md='10' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="salu">
                                        Is Active <spam style={{ color: "red" }}>*</spam>
                                    </Label>
                                    <Controller
                                        required
                                        id="salu"
                                        control={control}
                                        name="salu"
                                        render={({ field }) => (
                                            <Select
                                                required
                                                isClearable
                                                defaultValue={defaultReason1}
                                                options={isActiveDropDown}
                                                classNamePrefix="select"
                                                theme={selectThemeColors}
                                                className={classnames("react-select", {
                                                    "is-invalid": data !== null && data.salu === null,
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
                                // type="submit"
                                onClick={() => {
                                    console.log(data1.Weekdays, selectedValue1)
                                    if (selectedValue1 === 0 || selectedValue1 === "0") {
                                        setPopUp(`Do you want to disable ${data1.Weekdays}?. This will allow weekend pricing changes.`);

                                    } else {
                                        handleSubmit(onSubmit)();
                                    }
                                }}
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


            {popUp && (
                <div className="disabled-animation-modal">
                    <Modal
                        isOpen={popUp}
                        toggle={() => setPopUp(!popUp)}
                        className="modal-sm"
                    >
                        {" "}
                        {/*onClosed={onDiscard}*/}
                        <ModalHeader
                            className="modal-sm"
                            toggle={() => {
                                setPopUp(!popUp);
                            }}
                        >
                            Need To Check..
                        </ModalHeader>
                        <ModalBody className="pb-3 px-sm-2 mx-20">
                            <div>
                                <b>{popUp}</b>
                                <br></br>
                                <br></br>
                                <div className="d-flex">
                                    <Button
                                        color="primary"
                                        className="me-1"
                                        // className="text-center"
                                        onClick={() => handleSubmit(onSubmit)()}
                                    >
                                    Confirm
                                </Button>
                                <Button
                                    color="danger"
                                    className="me-1"
                                    // className="text-center"
                                    onClick={() => { setPopUp(false), getRoomInventoryRates() }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                </div>
    )
}

        </div >
    );
};

export default Floor;
