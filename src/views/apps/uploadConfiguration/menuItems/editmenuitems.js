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



const defaultValues = {
 
//     hotelID: "",
// category:"",
// costPrice:"",
// taxPercentage:"",

};



const MenuHeaderDetails = (data1) => {

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
const[storename, setstorename] = useState('')
const[itemname, setitemname]= useState('')
 
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
     console.log(data)
        setData(data);
    
            let menuData = JSON.stringify({
                basePrice:data.basePrice,
                hotelID: data1.data1.hotelID,
                storeID:data1.data1.storeID,
                itemID:data1.data1.itemID,
                status:data1.data1.status,
                // id: data1.data1.id
            });
            console.log(menuData);
            // console.log("hi");
            let res = fetchx(API_URL2 + `/updateMenuItem`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: menuData,
            })
                .then((result) => result.json())
                .then((resp) => {
                    console.log(resp)
                    if (resp['statusCode'] == 200) {
               
                    const swalInstance = MySwal.fire({
                        text: 'Menu Item Details updated Successfully!',
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
               hotelID: "",
category:"",
costPrice:"",
taxPercentage:"",

        });
    };
    
    function InputForm() {
        return (
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>

                    <Col md="3" sm="12" className="mb-1">
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
                                        // readOnly
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

                    <Col md="3" sm="12">
                        <div className="mb-1">
                            <Label className="form-label" for="itemName">
                            Item Name <spam style={{ color: "red" }}>*</spam>
                            </Label>
                            <Controller
                                defaultValue={data1.data1.itemName}
                                control={control}
                                id="itemName"
                                name="itemName"
                                render={({ field }) => (
                                    <Input
                                    // readOnly
                                        placeholder="itemName"
                                        required
                                        className={classnames({})}
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                    </Col>

                    <Col md="3" sm="12">
                        <div className="mb-1">
                            <Label className="form-label" for="basePrice">
                                Base Price  <spam style={{ color: "red" }}>*</spam>
                            </Label>
                            <Controller
                                defaultValue={data1.data1.basePrice}
                                control={control}
                                id="basePrice"
                                name="basePrice"
                                render={({ field }) => (
                                    <Input
                                        placeholder="basePrice"
                                        required
                                        className={classnames({})}
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
                </Row>
            </Form>
        );
    }
    return (
        <div>
            <div>
                <h4>
                    <b> MenuItems Details </b>
                </h4>
                {/* <Button.Ripple color='warning' disabled = {enableEditBtn} size='sm' onClick={EnableEdit}>Edit</Button.Ripple> */}
                {showForm && <InputForm />}
            </div>
        </div>
    );
};
export default MenuHeaderDetails;
