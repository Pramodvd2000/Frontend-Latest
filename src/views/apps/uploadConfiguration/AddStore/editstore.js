import { useState } from "react";
import Select from "react-select";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { selectThemeColors } from "@utils";
import { Input, Card, Form, Label, Button, InputGroup, Row, Col, } from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from "react";
import API_URL2 from "../../../../config2";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
const id = "1";

const discountAllowedOptions = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
];

const defaultValues = {
    // storeID: "",
    // restaurantName: "",
    // tableCount:"",
    // status: null,
    // IRD: null,
    // KOTprint:null,
    // DisplayCode: "",

};

const RestaurantDetails = (data1) => {
    const [open, setOpen] = useState("");
    const toggle = (id) => {
        open === id ? setOpen() : setOpen(id);
    };
    const [rowData, setRowData] = useState();
    const [filldata, setfilldata] = useState({ transactionCode: "" });
    const [editable, seteditable] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const gridRef = useRef();

    // ** State
    const [data, setData] = useState(null);
    // ** Hooks
    const { reset, handleSubmit, control, formState: { errors }, } = useForm({ defaultValues });
    let navigate = useNavigate();
    const [selectedValue, setSelectedValue] = useState(data1.data1.status);
    const [selectedValue1, setSelectedValue1] = useState(data1.data1.IRD);
    const [selectedValue2, setSelectedValue2] = useState(data1.data1.KOTprint);
    const [reload, setreload] = useState(true)
    const [load, setload] = useState(true)
    const [checkboxChecked, setCheckboxChecked] = useState(data1.data1.IRD === "Enable");
    const [checkboxChecked1, setCheckboxChecked1] = useState(data1.data1.KOTprint === "Enable");


    const handleCheckboxChange = () => {
        setCheckboxChecked(prevState => !prevState);
      };

    const handleCheckboxChange1 = () => {
            setCheckboxChecked1(prevState1 => !prevState1)
        }

    const defaultStatus = {
        value: data1.data1.status,
        label: data1.data1.status,
    };
    const defaultStatus1 = {
        value: data1.data1.IRD,
        label: data1.data1.IRD,
    };
    const defaultStatus2 = {
        value: data1.data1.KOTprint,
        label: data1.data1.KOTprint,
    };
    const statusOptions = [
        { value: 'Enable', label: 'Enable' },
        { value: 'Disable', label: 'Disable' },
    ]

    const kotprintoptions = [
        { value: "Enable", label: "Enable" },
        { value: "Disable", label: "Disable" },

    ];

    const irdptions = [
        { value: "Enable", label: "Enable" },
        { value: "Disable", label: "Disable" },
    ];


    const handleChange = (selectedOption) => {
        setSelectedValue(selectedOption.value);
    
    };
    const handleChange1 = (selectedOption1) => {
        setSelectedValue1(selectedOption1.value);
    
    };
    const handleChange2 = (selectedOption2) => {
        setSelectedValue2(selectedOption2.label);
        setreload(false)
        setTimeout(() => { setreload(true) }, 1)
    };
    const onSubmit = (data) => {
      
        data.IRD = checkboxChecked ? "Enable" : "Disable";
     data.KOTprint = checkboxChecked1 ? "Enable" : "Disable";
        setData(data);
     
        let createStoreData = JSON.stringify({
            hotelID: data1.data1.hotelID,
            storeID: data1.data1.storeID,
            restaurantName: data.restaurantName,
            tableCount: data.tableCount,
            status: selectedValue,
            IRD: data.IRD,
            KOTprint: data.KOTprint,
            DisplayCode: data.DisplayCode,
            id: data1.data1.id
        });
        let res = fetchx(API_URL2 + `/updateRestaurant`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: createStoreData,
        })
            .then((result) => result.json())
            .then((resp) => {
                if (resp['statusCode'] == 200) {

                    const swalInstance = MySwal.fire({
                        text: 'Store Details Edited Successfully!',
                        icon: 'success',
                        buttonsStyling: false,
                        confirmButtonText: 'Close',
                        allowOutsideClick: false,
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
                else {

                }
               
            })
            .catch((error) => {
                console.log(error);
            });
        // }
    };


    const handleReset = () => {
        reset({
            
            storeID: "",
            restaurantName: "",
            tableCount: "",
            status: null,
            IRD: null,
            KOTprint: null,
            DisplayCode: "",



        });
    };

    function InputForm() {
        return (
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>

                    {/* <Col md="4" sm="12">
                        <div className="mb-1">
                            <Label className="form-label" for="storeID">
                                Store ID<spam style={{ color: "red" }}>*</spam>
                            </Label>
                            <Controller
                                defaultValue={data1.data1.storeID}
                                control={control}
                                id="storeID"
                                name="storeID"
                                render={({ field }) => (
                                    <Input
                                    readOnly
                                        placeholder="storeID"
                                        required
                                        className={classnames({})}
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                    </Col> */}
                    <Col md="4" sm="12" className="mb-1">
                        <div className="mb-1">
                            <Label className="form-label" for="restaurantName">
                                Store Name <spam style={{ color: "red" }}>*</spam>
                            </Label>
                            <InputGroup className="input-group-merge">
                                <Controller
                                    defaultValue={data1.data1.restaurantName}
                                    control={control}
                                    id="restaurantName"
                                    name="restaurantName"
                                    render={({ field }) => (
                                        <Input
                                            placeholder="restaurantName"
                                            required
                                            className={classnames({})}
                                            {...field}
                                        />
                                    )}
                                />
                            </InputGroup>
                        </div>
                    </Col>

                    <Col md="4" sm="12">
                        <div className="mb-1">
                            <Label className="form-label" for="tableCount">
                                Table Count <spam style={{ color: "red" }}>*</spam>
                            </Label>
                            <Controller
                                defaultValue={data1.data1.tableCount}
                                control={control}
                                id="tableCount"
                                name="tableCount"
                                render={({ field }) => (
                                    <Input
                                        pattern="[0-9]*" title="Type Only Numbers"

                                        placeholder="tableCount"
                                        required
                                        className={classnames({})}
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                    </Col>
                    {/* <Col md="4" sm="12" className="mb-1">
                        <div className="mb-1">
                            <Label className="form-label" for="status">
                                Status <spam style={{ color: "red" }}>*</spam>
                            </Label>
                            <Controller
                                id="status"
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        defaultValue={defaultStatus}
                                        options={statusOptions}
                                        classNamePrefix="select"
                                        theme={selectThemeColors}
                                        className={classnames("react-select",)}
                                        {...field}
                                        onChange={handleChange}
                                    />
                                )}
                            />
                        </div>
                    </Col> */}
                    <Col md="4" sm="12">
                        <div className="mb-1">
                            <Label className="form-label" for="DisplayCode">
                                Display Code <spam style={{ color: "red" }}>*</spam>
                            </Label>
                            <Controller
                                defaultValue={data1.data1.DisplayCode}
                                control={control}
                                id="DisplayCode"
                                name="DisplayCode"
                                render={({ field }) => (
                                    <Input
                                        required
                                        placeholder="Name"
                                        invalid={errors.transactionCode1 && true}
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                    </Col>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Col md='2' sm='8' className='pt-3'>
        <div className='form-check form-check-inline'>
            <Input
                type='checkbox'
                id='basic-cb-unchecked'
                checked={checkboxChecked}
                onChange={handleCheckboxChange}
            />
            <Label for='IRD' className='form-check-label'>
                Include Inhouse guests
            </Label>
        </div>
    </Col>

    <Col md='2' sm='8' className='pt-3'>
        <div className='form-check form-check-inline'>
            <Input 
                type='checkbox'
                id='basic-cb-unchecked'
                checked={checkboxChecked1}
                onChange={handleCheckboxChange1}
            />
            <Label for='KOTprint' className='form-check-label'>
                KOT Print
            </Label>
        </div>
    </Col>
</div>


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
        );
    }
    return (
        <div>
            <div>
                <h4>
                    <b> Store Details </b>
                </h4>
                {showForm && <InputForm />}
            </div>
        </div>
    );
};
export default RestaurantDetails;
