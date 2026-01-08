import React, { useRef, useState, useEffect } from 'react';
import { Button, Col, Input, Label, Row, Card, CardHeader, CardTitle, CardBody, Form, InputGroup } from 'reactstrap';
import { Controller, useForm } from 'react-hook-form';
import { AgGridReact } from 'ag-grid-react';
import API_URL from '../../../config';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import ExcelJS from 'exceljs';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';
import classnames from "classnames";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import Moment from 'moment';
import Flatpickr from 'react-flatpickr';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
let roomTypeID = [
    fetchx(API_URL + '/getRoomInventoryRoomTypeID?hotelID=1')
        .then(result => result.json())
        .then(resp => {
            // console.log(resp['data'])
            roomTypeID = resp['data']
            console.log(roomTypeID)
        })
]

const MySwal = withReactContent(Swal);
const UploadGuestDetailsPage = () => {
    const { reset, control, handleSubmit, watch } = useForm();
    const fileInputRef = useRef(null);
    let navigate = useNavigate();


    const [fileName, setFileName] = useState('');
    const [fileData, setFileData] = useState(null);
    const [file, setFile] = useState(null);
    const [tempData, setTempData] = useState([]); // Replace with actual parsed Excel data
    const [isUpdateWithRatesButton, setIsUpdateWithRatesButton] = useState(false);
    const [columnDefs6, setColumnDefs6] = useState([]);
    const [Today, setToday] = useState()
    const [data, setData] = useState(null);
    const [selectedRoomTypeIDs, setSelectedRoomTypeIDs] = useState();
    const [isChecked, setIsChecked] = useState(1);
    const [open, setOpen] = useState(false);
    const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);


    const gridRef2 = useRef();



    useEffect(() => {
        const hotelIDData = JSON.stringify({
            hotelID: 1
        })
        fetchx(API_URL + "/getBusinessDate", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: hotelIDData
        }).then((res) => res.json())
            .then(postres => {
                const today = new Date(postres['data'][0]['businessDate']);
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
            })
    }, []);


    const handleChange6 = (selectedOption6) => {
        console.log(selectedOption6);
        const selectedIds = selectedOption6.map(option => option.value);
        console.log(selectedIds);
        setSelectedRoomTypeIDs(selectedIds);
        //console.log(selectedIds);

    };

    const handleChangeButton = () => {
        setIsChecked(prevState => {
            const newState = prevState === 0 ? 1 : 0;
            console.log(newState);
            return newState;
        });
    };

    const onSubmit = (data) => {
        setData(data);
setOpen(true);
        console.log(data)

        const fromDate = data.fromDate?.[0];
        const toDate = data.toDate?.[0];

        if (!fromDate) return handleError('Please select From Date.');
        if (!toDate) return handleError('Please select To Date.');
        if (!selectedRoomTypeIDs?.length) return handleError('Please select at least one Room Type.');
        if (isChecked === null || isChecked === undefined) return handleError('Please select the checkbox.');


        let createasset = JSON.stringify({
            "fromDate": (Moment(String(new Date(data.fromDate[0]))).format('YYYY-MM-DD')),
            "toDate": (Moment(String(new Date(data.toDate[0]))).format('YYYY-MM-DD')),
            "roomTypeID": selectedRoomTypeIDs,
            "isAllowed": isChecked,
            "baseAmount": data.baseAmount

        });
        let res = fetchx(API_URL + "/dynamicPrisingBlocking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: createasset,
        })
            .then(data => data.json())
            .then((res) => {
                console.log(res);
                if (res['statusCode'] == 200) {
                        setOpen(false);
                    if (typeof (res.data) === "string") {
                        handleError(res.data)

                    }
                    else {
                        reset();
                        handleSuccess("Successfully blocked dynamic pricing for the selected room type(s) and date range.");
                    }

                }
                else {
                        setOpen(false);
                    if (res.message === 'failed') {
                        handleError('Access denied!!')
                    }
                    else {
                        handleError(res.message)

                    }
                }
            });


    };


    const fromDate = watch('fromDate');

    const options = {
        minDate: Today
    };
    const optionsToDate = {
        minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
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

    // Success modal for split reservation
    const handleSuccess = (message) => {
        return MySwal.fire(
            {
                title: "Success!",
                text: message,
                icon: "success",
            },
            // setBasicModal(false),
            setTimeout(() => {
                navigate("");
            }, 1000)
        );
    };







    useEffect(() => {
        if (tempData && tempData.length > 0) {
            const generatedColumnDefs = Object.keys(tempData[0]).map((key, index) => ({
                headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'), // Beautify header
                field: key,
                // editable: true,
                pinned: index === 0 ? 'left' : undefined, // Optionally pin first column
                width: 150,
            }));
            setColumnDefs6(generatedColumnDefs);
        }
    }, [tempData]);



    const handleReset = () => {
        reset({
            fromDate: null,
            toDate: null,
            roomTypeID: null,
            isOnline: 0,

        });
    };



    return (
        <div className="container mt-3">
            {/* <Card>
                <CardHeader>
                    <CardTitle tag="h4">Block Dynamic Pricing</CardTitle>
                </CardHeader>
                <CardBody> */}
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>





                    {Today !== undefined && <Col md='4' sm='12' className='mb-1'>
                        <div className="mb-1">
                            <Label className="form-label" for="fromDate">
                                From Date
                            </Label>
                            <Controller
                                control={control}
                                id='fromDate'
                                name='fromDate'
                                render={({ field }) => (
                                    <Flatpickr
                                        required
                                        placeholder="YYYY-MM-DD"
                                        options={options}

                                        {...field}
                                        // options={{ allowInput: true }} 
                                        className={classnames('form-control', {
                                            'is-invalid': data !== null && data.fromDate === null
                                        })}
                                    />
                                )}
                            />
                        </div>
                    </Col>}
                    {Today !== undefined && <Col md='4' sm='12' className='mb-1'>
                        <div className="mb-1">
                            <Label className="form-label" for="toDate">
                                To Date
                            </Label>
                            <Controller
                                control={control}
                                id='toDate'
                                name='toDate'
                                render={({ field }) => (
                                    <Flatpickr
                                        required
                                        placeholder="YYYY-MM-DD"
                                        {...field}
                                        // options={{ allowInput: true }} 
                                        options={optionsToDate}
                                        className={classnames('form-control', {
                                            'is-invalid': data !== null && data.toDate === null
                                        })}
                                    />
                                )}
                            />
                        </div>
                    </Col>
                    }
                    <Col md='4' sm='12' className='mb-1'>
                        <div className='mb-1'>
                            <Label className='form-label' for='roomTypeID'>
                                Room Type ID
                            </Label>
                            <Controller
                                id='roomTypeID'
                                control={control}
                                name='roomTypeID'
                                render={({ field }) => (
                                    <Select
                                        isMulti
                                        required
                                        isClearable
                                        options={roomTypeID}
                                        classNamePrefix='select'
                                        theme={selectThemeColors}
                                        className={classnames('react-select', { 'is-invalid': data !== null && data.roomTypeID === null })}

                                        {...field}
                                        onChange={handleChange6}

                                    />
                                )}
                            />
                        </div>
                    </Col>
                    <Col md='4' sm='12' className='mb-1'>
                        <div className="mb-1">
                            <Label className="form-label" for="baseAmount">
                                Base Amount
                            </Label>
                            <InputGroup className="input-group-merge">

                                <Controller
                                    id="baseAmount"
                                    name="baseAmount"
                                    control={control}
                                    placeholder="Base Amount"
                                    render={({ field }) => (
                                        <Input
                                            pattern="[0-9]*" title="Only Numbers Allowed" required
                                            placeholder="Base Amount"
                                            {...field}
                                            className={classnames("form-control", {
                                                "is-invalid":
                                                    data !== null && (data.baseAmount === null || !data.baseAmount.length)
                                            })}
                                        />
                                    )}
                                />
                            </InputGroup>
                        </div>
                    </Col>

                    <Col md='4' sm='12' className='mb-1'>

                        <div className='form-switch form-check-success' style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>

                            <Input
                                type='switch'
                                id='switch-success'
                                name='success'
                                checked={isChecked === 1}
                                onChange={handleChangeButton}
                                className='switch-input'
                                style={{
                                    backgroundColor: isChecked === 1 ? '#086a14' : '#fe0606', // Change color based on isChecked state
                                }}
                            />
                            <p style={{ marginLeft: '10px', marginTop: '14px', color: isChecked === 1 ? '#086a14' : '#0B3BEF' }}>
                                {isChecked === 1 ? "Block" : "Unblock"}
                            </p>

                        </div>
                    </Col>

                    {/* <Col md='4' sm='12' className='mb-1'> */}
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
                    {/* </Col> */}
                </Row>
            </Form>
            {/* </CardBody>
            </Card> */}



      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                        Loading data, please wait...
                    </h1>
                    {showSecondaryMessage && (
                        <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                            Loading records... This may take a few seconds if there's a lot of data.
                        </h1>
                    )}
                    <CircularProgress color="inherit" />
                </div>
            </Backdrop>



        </div>
    );
};

export default UploadGuestDetailsPage;