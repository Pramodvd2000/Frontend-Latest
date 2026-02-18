
// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { format } from "date-fns";
import { Card, CardHeader, CardText, CardTitle, Label, Col, Input, Row, Button, Accordion, AccordionBody, AccordionHeader, AccordionItem, CardBody, Form, InputGroup, Modal, ModalBody, ModalHeader } from 'reactstrap';
import API_URL from '../../../config';
import { useForm, Controller } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import Moment from 'moment';
import Select from "react-select";
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

import classnames from "classnames";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
// import {
//     Input, Card, Form, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, Modal, ModalBody, ModalHeader, InputGroupText, Row, Col,
//     Accordion, AccordionBody, AccordionHeader, AccordionItem
// } from "reactstrap";
import { selectThemeColors } from "@utils";
import { useNavigate } from 'react-router-dom';



let roomTypeID = [
    fetchx(API_URL + '/getRoomInventoryRoomTypeID?hotelID=1')
        .then(result => result.json())
        .then(resp => {
            // console.log(resp['data'])
            roomTypeID = resp['data']
            console.log(roomTypeID)
        })
]


const SubMatrix = (props) => {

    const [rowData, setRowData] = useState();
    const [data, setData] = useState(null);
    const [open, setOpen] = useState('')
    const [openModal, setOpenModal] = useState();
    const [selectedRow, setSelectedRow] = useState(null);

let navigate = useNavigate();

    // ** Hooks
    const { reset, handleSubmit, control, watch, formState: { errors }
    } = useForm({});

    // INSERT (Accordion)
const {
  handleSubmit: handleInsertSubmit,
  control: insertControl,
  reset: resetInsert
} = useForm();


    const gridRef = useRef();


    // error handling for same guest addition
    const handleError = (message) => {
        return MySwal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            customClass: {
                confirmButton: 'btn btn-danger',

            },
            allowOutsideClick: false,
            confirmButtonText: 'Close',
            confirmButtonColor: 'danger',
            buttonsStyling: false
        })
    }


    const handleSuccess = () => {
        return MySwal.fire({
            title: 'Room Type Details Updated',
            text: 'Room Type Details Updated Successfully !!',
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        })
    }



    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            wrapText: true,
            autoHeight: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ));

    const cellClickedListener = useCallback((params) => {
        if (!params.data) return;

        setSelectedRow(params.data);

        reset({
            roomTypeID: {
                label: params.data.roomType,
                value: params.data.roomTypeID
            },
            roomTypeName: params.data.roomTypeName,
            description: params.data.description
        });

        setOpenModal(true);
    }, []);


    const fetchData = () => {
        let confirmRate = JSON.stringify({
        })
        console.log(confirmRate)
        fetchx(API_URL + "/getWebRoomWiseDetails", {
            // fetchx("http://122.166.2.21:14702/getOccupancyRoomWise", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: confirmRate
        }).then(result => result.json())
            .then(res => {
                // var rowData = res.data;

                setRowData(res['data'])

            }, []);

        // })
    }

    useEffect(() => {
        fetchData()
    }, []);



    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Room Type', field: 'roomType', maxWidth: 130 },

        { headerName: 'Room Type Name', field: 'roomTypeName', maxWidth: 180 },
        { headerName: 'Description', field: 'description', width: 800 },

        {
            headerName: "Actions",
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 100 }}
                    onClick={async () => {
                        setOpenModal(!openModal)
                    }}
                >
                    Edit
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            maxWidth: 140
        },

    ]);


    const toggle = id => {
        open === id ? setOpen() : setOpen(id)
    }



    const onSubmit = (formData) => {
        // setData(data);
        console.log(formData)
        if (
            // data.hotelID !== null &&

            formData.roomTypeID !== null &&
            formData.roomTypeName !== null &&
            formData.description !== null 
        ) {

                let createasset = JSON.stringify({
                    // "hotelID": data.hotelID,

                    "roomTypeID": formData.roomTypeID.value,
                    "roomTypeName": formData.roomTypeName,
                    "description": formData.description,
                });
                console.log(createasset);
                let res = fetchx(API_URL + "/addWebRoomTypeWiseDetails", {
                    method: "PosT",
                    headers: { "Content-Type": "application/json" },
                    body: createasset,
                }).then(result => result.json())
                .then((res) => {
                    console.log(res);
                    if (res['statusCode'] === 200) {

                        handleSuccess("Updated Successfully")
            navigate('');

                    }
                    else{
                        handleError(res.message)
                    }
                });
            

        }
    };

    const updateData = () => {
        if (!selectedRow) return;

        const updatedData = {
            ...selectedRow,
            roomTypeID: watch('roomTypeID') ? watch('roomTypeID').value : null,
            roomTypeName: watch('roomTypeName'),
            description: watch('description')
        };

        let updatePayload = JSON.stringify({
            id: updatedData.id,
            roomTypeID: updatedData.roomTypeID,
            roomTypeName: updatedData.roomTypeName,
            description: updatedData.description
        });

        console.log(updatePayload);

        fetchx(API_URL + "/updateWebRoomTypeWiseDetails", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: updatePayload
        }).then(result => result.json())
            .then(res => {
                if (res.statusCode === 200) {
                    fetchData();
                    setOpenModal(false);
                        handleSuccess("Updated Successfully")
                    
                }
                else {
                    handleError(res.message)
                }
            });
    };




    return (
        <div>
            <Accordion open={open} toggle={toggle}>
                <AccordionItem>
                    {/* <AccordionHeader targetId='1'><h4><b>Room Type Wise</b></h4> <Button color="primary" style={{ width: 100 }}
                    // onClick={async () => {

                    // }}
                    >
                        Edit
                    </Button></AccordionHeader> */}

                    <AccordionHeader targetId="1">
                        <h4 className="mb-0 me-2">
                            <b>Room Type Wise</b>
                        </h4>
                        <Button color="primary" style={{ width: 160 }}>
                            Add New
                        </Button>
                    </AccordionHeader>


                    <AccordionBody accordionId='1'>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Room Type Wise</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleInsertSubmit(onSubmit)}>
                                    <Row>

                                        <Col md='4' sm='12' className='mb-1'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='roomTypeID'>
                                                    Room Type ID
                                                </Label>
                                                <Controller
                                                    id='roomTypeID'
                                                    control={insertControl}
                                                    name='roomTypeID'
                                                    render={({ field }) => (
                                                        <Select
                                                        required
                                                            isClearable
                                                            options={roomTypeID}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select', { 'is-invalid': data !== null && data.roomTypeID === null })}
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>

                                        <Col md='4' sm='12' className='mb-1'>
                                            <div className="mb-1">
                                                <Label className="form-label" for="roomTypeName">
                                                    Room Type Name
                                                </Label>
                                                <InputGroup className="input-group-merge">

                                                    <Controller
                                                        id="roomTypeName"
                                                        name="roomTypeName"
                                                        control={insertControl}
                                                        placeholder="Room Type Name"
                                                        render={({ field }) => (
                                                            <Input
                                                                required
                                                                placeholder="Room Type Name"
                                                                {...field}
                                                                className={classnames("form-control", {
                                                                    "is-invalid":
                                                                        data !== null && (data.roomTypeName === null || !data.roomTypeName.length)
                                                                })}
                                                            />
                                                        )}
                                                    />
                                                </InputGroup>
                                            </div>
                                        </Col>






                                        <Col md='4' sm='12' className='mb-1'>
                                            <div className="mb-1">
                                                <Label className="form-label" for="description">
                                                    Room Type Description
                                                </Label>
                                                <InputGroup className="input-group-merge">

                                                    <Controller
                                                        id="description"
                                                        name="description"
                                                        control={insertControl}
                                                        placeholder="Room Type Name Description"
                                                        render={({ field }) => (
                                                            <Input
                                                                type="textarea"

                                                                required
                                                                placeholder="Room Type Name Description"
                                                                {...field}
                                                                className={classnames("form-control", {
                                                                    "is-invalid":
                                                                        data !== null && (data.description === null || !data.description.length)
                                                                })}
                                                            />
                                                        )}
                                                    />
                                                </InputGroup>
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
                                            // onClick={handleReset}
                                            >
                                                Reset
                                            </Button>

                                        </div>
                                        {/* </Col> */}
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </AccordionBody>
                </AccordionItem>
            </Accordion>

            <Modal isOpen={openModal} toggle={() => setOpenModal(!openModal)} className='modal-lg'>
                <ModalHeader className='modal-lg' toggle={() => setOpenModal(!openModal)}>Room Type Wise</ModalHeader>
                <ModalBody className='pb-3 px-sm-1 mx-20'>
                    <Row>

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
                                            isClearable
                                            options={roomTypeID}
                                            classNamePrefix='select'
                                            theme={selectThemeColors}
                                            className={classnames('react-select', { 'is-invalid': data !== null && data.roomTypeID === null })}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </Col>

                        <Col md='4' sm='12' className='mb-1'>
                            <div className="mb-1">
                                <Label className="form-label" for="roomTypeName">
                                    Room Type Name
                                </Label>
                                <InputGroup className="input-group-merge">

                                    <Controller
                                        id="roomTypeName"
                                        name="roomTypeName"
                                        control={control}
                                        placeholder="Room Type Name"
                                        render={({ field }) => (
                                            <Input
                                                required
                                                placeholder="Room Type Name"
                                                {...field}
                                                className={classnames("form-control", {
                                                    "is-invalid":
                                                        data !== null && (data.roomTypeName === null || !data.roomTypeName.length)
                                                })}
                                            />
                                        )}
                                    />
                                </InputGroup>
                            </div>
                        </Col>






                        <Col md='4' sm='12' className='mb-1'>
                            <div className="mb-1">
                                <Label className="form-label" for="description">
                                    Room Type Description
                                </Label>
                                <InputGroup className="input-group-merge">

                                    <Controller
                                        id="description"
                                        name="description"
                                        control={control}
                                        placeholder="Room Type Name Description"
                                        render={({ field }) => (
                                            <Input
                                                type="textarea"

                                                required
                                                placeholder="Room Type Name Description"
                                                {...field}
                                                className={classnames("form-control", {
                                                    "is-invalid":
                                                        data !== null && (data.description === null || !data.description.length)
                                                })}
                                            />
                                        )}
                                    />
                                </InputGroup>
                            </div>
                        </Col>

                        {/* <Col md='4' sm='12' className='mb-1'> */}
                        <div className="d-flex">
                            <Button className="me-1" color="primary" onClick={() => updateData()}>
                                Submit
                            </Button>
                            <Button
                                outline
                                color="secondary"
                                type="reset"
                            // onClick={handleReset}
                            >
                                Reset
                            </Button>

                        </div>
                        {/* </Col> */}
                    </Row>
                </ModalBody>
            </Modal>

            <div>
                <Row>

                </Row>
            </div>
            <br></br>

            {/* <button onClick={buttonListener}>Push Me</button> */}
            <div className="ag-theme-alpine" style={{ height: 520 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData} columnDefs={columnDefs}
                    animateRows={true} rowSelection='multiple'
                    onCellClicked={cellClickedListener}
                    // paginationAutoPageSize = 'true'
                    onGridReady={params => {
                        gridRef.current = params.api;
                    }}
                    paginationPageSize='10'
                    pagination='true'
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"
                    masterDetail={true}

                />
            </div>
        </div>
    );
}

export default SubMatrix;