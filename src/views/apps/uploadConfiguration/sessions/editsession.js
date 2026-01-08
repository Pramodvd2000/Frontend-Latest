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

  



    const handleChange = (selectedOption) => {
        setSelectedValue(selectedOption.value);

    };
    const handleChange1 = (selectedOption1) => {
        setSelectedValue1(selectedOption1.value);

    };
    const handleChange2 = (selectedOption2) => {
        setSelectedValue2(selectedOption2.label);
        // console.log(selectedOption2.label)
        setreload(false)
        setTimeout(() => { setreload(true) }, 1)
    };
    const onSubmit = (data) => {
        let category;
        let costPrice;
        let taxPercentage
        if(data.category === undefined) {
            category = data1.data1.category
        }
        else {
            category = data['category']
        }
        if(data.costPrice === undefined) {
            costPrice = data1.data1.costPrice
        }
        else {
            costPrice = data['costPrice']
        }
        if(data.taxPercentage === undefined) {
            taxPercentage = data1.data1.taxPercentage
        }
        else {
            taxPercentage = data['taxPercentage']
        }
      
        setData(data);
            let menuData = JSON.stringify({
              
                hotelID: data.hotelID,
                storeID: data.storeID,
                sessionName: data.sessionName,
                startTime: data.startTime,
                endTime: data.endTime,
                id: data1.data1.id
            });
            console.log(menuData);
            // console.log("hi");
            let res = fetchx(API_URL2 + `/updateSessionDetails`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: menuData,
            })
                .then((result) => result.json())
                .then((resp) => {
                    if (resp['statusCode'] == 200) {

                    const swalInstance = MySwal.fire({
                        text: 'Session Details updated Successfully!',
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
                    
                    // console.log('Save and exit after form submit')

                    
                  
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
                            <Label className="form-label" for="storeID">
                                StoreID <spam style={{ color: "red" }}>*</spam>
                            </Label>
                            <InputGroup className="input-group-merge">
                                <Controller
                                    defaultValue={data1.data1.storeID}
                                    control={control}
                                    id="storeID"
                                    name="storeID"
                                    render={({ field }) => (
                                        <Input
                                            placeholder="storeID"
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
                            <Label className="form-label" for="restaurantName">
                                Store Name <spam style={{ color: "red" }}>*</spam>
                            </Label>
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
                        </div>
                    </Col>

                    <Col md="3" sm="12">
                        <div className="mb-1">
                            <Label className="form-label" for="sessionName">
                                Session Name <spam style={{ color: "red" }}>*</spam>
                            </Label>
                            <Controller
                                defaultValue={data1.data1.sessionName}
                                control={control}
                                id="sessionName"
                                name="sessionName"
                                render={({ field }) => (
                                    <Input
                                        placeholder="sessionName"
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
                            <Label className="form-label" for="startTime">
                                Session start time <spam style={{ color: "red" }}>*</spam>
                            </Label>
                            <Controller
                                defaultValue={data1.data1.startTime}
                                control={control}
                                id="startTime"
                                name="startTime"
                                render={({ field }) => (
                                    <Input
                                    type="time"
                                        placeholder="startTime"
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
                            <Label className="form-label" for="endTime">
                                Session end time <spam style={{ color: "red" }}>*</spam>
                            </Label>
                            <Controller
                                defaultValue={data1.data1.endTime}
                                control={control}
                                id="endTime"
                                name="endTime"
                                render={({ field }) => (
                                    <Input
                                        placeholder="endTime"
                                        type="time"
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
                    <b> Session Details </b>
                </h4>
                {/* <Button.Ripple color='warning' disabled = {enableEditBtn} size='sm' onClick={EnableEdit}>Edit</Button.Ripple> */}
                {showForm && <InputForm />}
            </div>
        </div>
    );
};
export default MenuHeaderDetails;
