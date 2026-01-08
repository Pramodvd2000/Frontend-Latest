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
import { useRef, useEffect, useMemo, useCallback } from "react";
import API_URL from "../../../../config";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const id = "1";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'


const defaultValues = {

    //     hotelID: "",
    // category:"",
    // costPrice:"",
    // taxPercentage:"",

};





const MenuGroupDetails = (data1) => {
    // console.log(data1.data1);
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
    const MySwal = withReactContent(Swal);


    const statusOptions = [
        { value: '1', label: 'Active' },
        { value: '0', label: 'InActive' },
    ]

    const defaultStatus = statusOptions.find(option => option.value === String(data1.data1.isActive)) || {};


    const defaultStatus1 = {
        value: data1.data1.menuHead,
        label: data1.data1.menuHead,
    };

    const defaultStatus2 = {
        value: data1.data1.restaurantName,
        label: data1.data1.restaurantName
    }
    const storeOptions = JSON.parse(sessionStorage.getItem('storeOptions'));
    const menuHeadoptions = JSON.parse(sessionStorage.getItem('menuHeadoptions'));

    // console.log(storeOptions)
    const handleChange = (selectedOption) => {
        setSelectedValue(selectedOption.value);
        // console.log(selectedOption.value)
        // setreload(false)
        // setTimeout(()=>{setreload(true)},1)
    };
    const handleChange1 = (selectedOption1) => {
        setSelectedValue1(selectedOption1.value);
        // console.log(selectedOption1.label)
        // setreload(false)
        // setTimeout(() => { setreload(true) }, 1)
    };
    const handleChange2 = (selectedOption2) => {
        setSelectedValue2(selectedOption2.label);
        // console.log(selectedOption2.label)
        setreload(false)
        setTimeout(() => { setreload(true) }, 1)
    };
    const onSubmit = (data) => {
        let storeID;
        let menuHead;
        let status;
        if (data.storeID === undefined) {
            storeID = data1.data1.storeID
        }
        else {
            storeID = data['storeID'].value
        }
      
        if (data.status === undefined) {
            status = data1.data1.status
        }
        else {
            status = data['status'].value
        }
      
        console.log(data)

        setData(data);
      
        let menuData = JSON.stringify({
            hotelID:1,
            storeID:storeID,
            isActive: status,
            TableID: data1.data1.id
          });
        console.log(menuData);
        let res = fetchx(API_URL + `/UpdatePOSTableStatus`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: menuData,
        })
            .then((result) => result.json())
            .then((resp) => {
                if (resp['statusCode'] == 200) {
                    // console.log(resp);
                    // console.log(resp["data"])
                    const swalInstance = MySwal.fire({
                        text: 'Table status updated Successfully!',
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


            })
            .catch((error) => {
                handleError(error);
            });
        // }
    };

    // error handling for same guest addition
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

    const handleReset = () => {
        reset({
            storeID: "",
            groupName: "",
            activeItemCount: "",
            menuHead:"",
            status:"",

        });
    };

    function InputForm() {
        return (
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>

                    <Col md="4" sm="12" className="mb-1">
                        <div className="mb-1">
                            <Label className="form-label" for="storeID">
                                store Name <spam style={{ color: "red" }}>*</spam>
                            </Label>
                            <Controller
                                id="storeID"
                                control={control}
                                name="storeID"
                                
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        disabled = {true}
                                        isDisabled = {true}
                                        defaultValue={defaultStatus2}
                                        // options={sessionStorage.getItem('storeOptions')}
                                        options={storeOptions}
                                        classNamePrefix="select"
                                        theme={selectThemeColors}
                                        className={classnames("react-select",)}
                                        {...field}
                                    // onChange={handleChange1}
                                    />
                                )}
                            />
                        </div>
                    </Col>
                    <Col md="4" sm="12">
                        <div className="mb-1">
                            <Label className="form-label" for="tableNo">
                                Table No <spam style={{ color: "red" }}>*</spam>
                            </Label>
                            <Controller
                                defaultValue={data1.data1.tableNo}
                                control={control}
                                id="tableNo"
                                name="tableNo"
                                render={({ field }) => (
                                    <Input
                                        disabled = {true}
                                        required
                                        placeholder="Name"
                                        invalid={errors.tableNo && true}
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                    </Col>
                    <Col md="4" sm="12" className="mb-1">
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
                                    // onChange={handleChange}
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
                </Row>
            </Form>
        );
    }
    return (
        <div>
            <div>
            <div>
                <h4>
                    <b>Table Details </b>
                </h4>
                {/* <Button.Ripple color='warning' disabled = {enableEditBtn} size='sm' onClick={EnableEdit}>Edit</Button.Ripple> */}
                {showForm && <InputForm />}
            </div>
            </div>
        </div>
    );
};
export default MenuGroupDetails;
