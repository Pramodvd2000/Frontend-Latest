import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Chart from "chart.js/auto";
import API_URL from '../../../../config'
import { Row, Col, Form, Button, Label, InputGroup, InputGroupText, Input, Modal, ModalBody, ModalHeader, Card, CardHeader, CardBody, Accordion, AccordionBody, AccordionItem, AccordionHeader } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import Moment from 'moment'
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import { useNavigate } from "react-router-dom"
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

let DepartmentOptions = [
    fetch(API_URL + '/getGuestComplaintDepartmentOptions')
        .then(result => result.json())
        .then(resp => {
            DepartmentOptions = resp['data']
            return DepartmentOptions
        })
]

const BarChart = () => {

    const gridRef = useRef(null);
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [data4, setData4] = useState([]);
    const { reset, handleSubmit, control, watch, setValue } = useForm({})
    const [open, setOpen] = useState(false);
    const [arrivalDate, setArrivalDate] = useState();
    const navigate = useNavigate()

    const handleReset = () => {
        reset({
            jobDepartmentOptions: ''
        })
    }

    //Success card
    const handleSuccess = () => {
        return MySwal.fire({
            title: 'Complaint List',
            text: 'Successfully added new complaint',
            icon: 'success',
        },
            // actionButton(false),
            setTimeout(() => { navigate('/dashboard/departmentconfiguration') }, 1000)
        )
    }

    //Success card
    const handleSuccess2 = () => {
        return MySwal.fire({
            title: 'Department Addition',
            text: 'Successfully added new department',
            icon: 'success',
        },
            // actionButton(false),
            setTimeout(() => { navigate('/dashboard/departmentconfiguration') }, 1000)
        )
    }

    // error handling for same guest addition
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


    const onSubmit = (data) => {
        const jsonData = JSON.stringify({
            complaintName: data.description,
            departmentID: data.jobDepartmentOptions.value
        })
        fetch(API_URL + "/addNewGuestComplaint", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonData
        }).then((res) => res.json()).then(data => {
            if (data.statusCode == 200) {
                handleSuccess()
            }
            else {
                handleError("Something went wrong !!!")
            }
        })
    }


    useEffect(() => {
        fetch(API_URL + '/getComplaintList')
            .then(result => result.json())
            .then(resp => {
                setData(resp['data'])
            })
    }, [])

    const [columnDef] = useState([
        {
            headerName: "Department Name",
            field: "departmentName",
            // suppressSizeToFit: true,
            width: 300
        },
        {
            headerName: "Complaint Name",
            field: "complaint",
            // suppressSizeToFit: true,
            width: 500
        }
    ])


    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            autoHeight: true,
            wrapText: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ))

    // Search box
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById("filter-text-box").value
        );
    }, []);


    const handleButtonClick = () => {
        setOpen(true)
    }

    const submitDpet = data => {
        const jsonData = JSON.stringify({
            departmentName: data.depName
        })
        fetch(API_URL + "/addGuestComplaintDepartments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonData
        }).then((res) => res.json()).then(data => {
            if (data.statusCode == 200) {
                handleSuccess2()
            }
            else {
                handleError(data.data)
            }
        })
    }

    return (

        <div>

            {open && (
                <Modal isOpen={open} toggle={() => setOpen(!open)} className="modal-lg">
                    <ModalHeader className="modal-lg" toggle={() => setOpen(!open)}>
                        Complaint Department
                    </ModalHeader>
                    <ModalBody className="modal-lg">
                        <Form onSubmit={handleSubmit(submitDpet)}>
                            <Col md='6' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='depName'>
                                        Department Name
                                    </Label>
                                    <Controller
                                        id='depName'
                                        name='depName'
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type='text'
                                                required
                                                placeholder='Enter the department name here'
                                                {...field}
                                                className={classnames('form-control')}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                            <div align='end'>
                                <Button color='secondary' className='me-1' onClick={() => setOpen(!open)}> Close </Button>
                                <Button color='primary' className='me-1' type="submit"> Submit </Button>
                            </div>
                            <br />
                        </Form>
                    </ModalBody>
                </Modal>
            )}


            <Card>
                <CardHeader>
                    <h4>Add New Complaint</h4>
                    <Button color="primary" onClick={handleButtonClick}>Add Department</Button>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md='4' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='jobDepartmentOptions'>
                                        Department <span style={{ color: 'red' }}> * </span>
                                    </Label>
                                    <Controller
                                        id='jobDepartmentOptions'
                                        control={control}
                                        name='jobDepartmentOptions'
                                        render={({ field }) => (
                                            <Select
                                                required
                                                isClearable
                                                options={DepartmentOptions}
                                                classNamePrefix='select'
                                                theme={selectThemeColors}
                                                className={classnames('react-select')}
                                                {...field}
                                            // onChange={handleSelectChanges}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                            <Col md='4' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='description'>
                                        Complaint Description
                                    </Label>
                                    <Controller
                                        id='description'
                                        name='description'
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type='text'
                                                required
                                                placeholder='Enter the complaint name here'
                                                {...field}
                                                className={classnames('form-control')}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>

                        </Row>
                        <div align='end'>
                            <Button className="me-1" outline color="secondary" type="reset" onClick={handleReset}>
                                Reset
                            </Button>
                            <Button className="me-1" type="submit" color="primary">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </CardBody>
            </Card>

            <div>
                <Col md="2" sm="12" className="mb-1">
                    <Label className="form-label" for="fullName">
                        Search
                    </Label>
                    <Input
                        type="text"
                        id="filter-text-box"
                        placeholder="Filter..."
                        onInput={onFilterTextBoxChanged}
                    />
                </Col>
            </div>
            <div className="ag-theme-alpine" style={{ height: 550, width: 800 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={data}
                    columnDefs={columnDef}
                    animateRows={true}
                    rowSelection="multiple"
                    paginationPageSize={10}
                    pagination={true}
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"
                />
            </div>

        </div>

    );
};

export default BarChart;
