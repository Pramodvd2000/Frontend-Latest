// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
    Card, CardHeader, CardTitle, Label, Col, Input, Row, Button,
    Accordion, AccordionBody, AccordionHeader, AccordionItem,
    CardBody, Form, InputGroup, Modal, ModalBody, ModalHeader
} from 'reactstrap';
import API_URL from '../../../config';
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

import classnames from "classnames";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import { selectThemeColors } from "@utils";
import { useNavigate } from 'react-router-dom';


const RateCodeDiscount = () => {

    const [rowData, setRowData] = useState();
    const [open, setOpen] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rateCodeOptions, setRateCodeOptions] = useState([]);

    let navigate = useNavigate();

    // Form for Insert (Accordion)
    const {
        handleSubmit: handleInsertSubmit,
        control: insertControl,
        reset: resetInsert
    } = useForm();

    // Form for Edit (Modal)
    const {
        handleSubmit: handleEditSubmit,
        control: editControl,
        reset: resetEdit,
        watch
    } = useForm();

    const gridRef = useRef();

    // ── Alerts ──────────────────────────────────────────────────────────────
    const handleError = (message) => {
        return MySwal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            customClass: { confirmButton: 'btn btn-danger' },
            allowOutsideClick: false,
            confirmButtonText: 'Close',
            buttonsStyling: false
        });
    };

    const handleSuccess = (text = 'Operation completed successfully!') => {
        return MySwal.fire({
            title: 'Success!',
            text,
            icon: 'success',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
        });
    };

    // ── Default Col Def ─────────────────────────────────────────────────────
    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeight: true,
        filterParams: { buttons: ['apply', 'reset'] }
    }), []);

    // ── Fetch Rate Code Options ─────────────────────────────────────────────
    const fetchRateCodeOptions = () => {
        fetchx(API_URL + '/getFitRateCodeIDAndDiscount', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(resp => {
                const options = (resp.data || []).map(item => ({
                    label: item.rateCode,
                    value: item.id          // rateCodeID
                }));
                setRateCodeOptions(options);
            })
            .catch(err => console.error('Failed to load rate codes:', err));
    };

    // ── Fetch Grid Data ─────────────────────────────────────────────────────
    const fetchData = () => {
        fetchx(API_URL + '/getFitRateCodeIDAndDiscount', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(resp => {
                setRowData(resp.data || []);
            })
            .catch(err => console.error('Failed to fetch grid data:', err));
    };

    useEffect(() => {
        fetchRateCodeOptions();
        fetchData();
    }, []);

    // ── Cell Click → open Edit Modal ────────────────────────────────────────
    const cellClickedListener = useCallback((params) => {
        if (!params.data) return;
        console.log('Clicked Row Data:', params.data);
        setSelectedRow(params.data);

        resetEdit({
            rateCodeID: {
                label: params.data.rateCode,
                value: params.data.id
            },
            percentageDiscount: params.data.percentageDiscount,
            discountDescription: params.data.discountDescription
        });

        setOpenModal(true);
    }, [resetEdit]);

    // ── Column Definitions ──────────────────────────────────────────────────
    const [columnDefs] = useState([
        {
            headerName: 'Rate Code',
            field: 'rateCode',
            maxWidth: 200,
            cellStyle: { textAlign: 'center' }
        },
        {
            headerName: 'Discount (%)',
            field: 'percentageDiscount',
            maxWidth: 150,
            cellStyle: { textAlign: 'center' }
        },
        {
            headerName: 'Discount Description',
            field: 'discountDescription',
            // flex: 1
        },
        {
            headerName: 'Actions',
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 100 }}
                    onClick={() => {
                        setSelectedRow(params.data);
                        resetEdit({
                            rateCodeID: {
                                label: params.data.rateCode,
                                value: params.data.id
                            },
                            percentageDiscount: params.data.percentageDiscount,
                            discountDescription: params.data.discountDescription
                        });
                        setOpenModal(true);
                    }}
                >
                    Edit
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            maxWidth: 140
        }
    ]);

    const toggle = (id) => {
        open === id ? setOpen('') : setOpen(id);
    };

    // ── INSERT Submit ───────────────────────────────────────────────────────
    const onInsertSubmit = (formData) => {
        console.log('Insert Form Data:', formData);

        if (!formData.rateCodeID || formData.percentageDiscount === undefined || formData.percentageDiscount === '') {
            handleError('Please fill in all required fields.');
            return;
        }

        const payload = JSON.stringify({
            rateCodeID: formData.rateCodeID.value,
            percentageDiscount: Number(formData.percentageDiscount),
            discountDescription: formData.discountDescription || ''
        });

        console.log('Insert Payload:', payload);

        fetchx(API_URL + '/addRateCodeDiscount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload
        })
            .then(res => res.json())
            .then(res => {
                console.log('Insert Response:', res);
                if (res.statusCode === 200) {
                    handleSuccess('Rate Code Discount Added Successfully!');
                    setSelectedRow(null);
                    resetInsert({ rateCodeID: null, percentageDiscount: '', discountDescription: '' })
                    fetchData();
                    setOpen('')
                } else {
                    setOpen('')
                    setSelectedRow(null);
                    resetInsert({ rateCodeID: null, percentageDiscount: '', discountDescription: '' })
                    handleError(res.message);
                    resetInsert();

                }
            })
            .catch(err => {
                console.error('Insert Error:', err);
                handleError('Something went wrong. Please try again.');
            });
    };

    // ── UPDATE Submit ───────────────────────────────────────────────────────
    const onEditSubmit = (formData) => {
        if (!selectedRow) return;
        console.log('Edit Form Data:', formData);

        const payload = JSON.stringify({
            rateCodeID: formData.rateCodeID?.value || selectedRow.id,
            percentageDiscount: Number(formData.percentageDiscount),
            discountDescription: formData.discountDescription || ''
        });

        console.log('Update Payload:', payload);

        fetchx(API_URL + '/updateRateCodeDiscount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload
        })
            .then(res => res.json())
            .then(res => {
                console.log('Update Response:', res);
                if (res.statusCode === 200) {
                    handleSuccess('Rate Code Discount Updated Successfully!');
                    setOpenModal(false);
                    fetchData();
                } else {
                    handleError(res.message);
                }
            })
            .catch(err => {
                console.error('Update Error:', err);
                handleError('Something went wrong. Please try again.');
            });
    };

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div>
            {/* ── INSERT Accordion ── */}
            <Accordion open={open} toggle={toggle}>
                <AccordionItem>
                    <AccordionHeader targetId="1">
                        <h4 className="mb-0 me-2">
                            <b>Rate Code Discount</b>
                        </h4>
                        <Button color="primary" style={{ width: 160 }}>
                            Add New
                        </Button>
                    </AccordionHeader>

                    <AccordionBody accordionId="1">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Add Rate Code Discount</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleInsertSubmit(onInsertSubmit)}>
                                    <Row>

                                        {/* Rate Code Dropdown */}
                                        <Col md="4" sm="12" className="mb-1">
                                            <div className="mb-1">
                                                <Label className="form-label" for="rateCodeID">
                                                    Rate Code <span className="text-danger">*</span>
                                                </Label>
                                                <Controller
                                                    id="rateCodeID"
                                                    control={insertControl}
                                                    name="rateCodeID"
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <Select
                                                            isClearable
                                                            options={rateCodeOptions}
                                                            classNamePrefix="select"
                                                            theme={selectThemeColors}
                                                            className="react-select"
                                                            placeholder="Select Rate Code"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>

                                        {/* Percentage Discount */}
                                        <Col md="4" sm="12" className="mb-1">
                                            <div className="mb-1">
                                                <Label className="form-label" for="percentageDiscount">
                                                    Percentage Discount (%) <span className="text-danger">*</span>
                                                </Label>
                                                <Controller
                                                    name="percentageDiscount"
                                                    control={insertControl}
                                                    defaultValue=""
                                                    rules={{ required: true, min: 0, max: 100 }}
                                                    render={({ field }) => (
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            max={100}
                                                            placeholder="Enter discount %"
                                                            className="form-control"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>

                                        {/* Discount Description */}
                                        <Col md="4" sm="12" className="mb-1">
                                            <div className="mb-1">
                                                <Label className="form-label" for="discountDescription">
                                                    Discount Description
                                                </Label>
                                                <Controller
                                                    name="discountDescription"
                                                    control={insertControl}
                                                    defaultValue=""
                                                    render={({ field }) => (
                                                        <Input
                                                            type="textarea"
                                                            rows={3}
                                                            placeholder="Enter discount description"
                                                            className="form-control"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>

                                    </Row>

                                    <div className="d-flex">
                                        <Button className="me-1" color="primary" type="submit">
                                            Submit
                                        </Button>
                                        <Button
                                            outline
                                            color="secondary"
                                            type="reset"
                                            onClick={() => resetInsert()}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </AccordionBody>
                </AccordionItem>
            </Accordion>

            {/* ── EDIT Modal ── */}
            <Modal isOpen={openModal} toggle={() => setOpenModal(!openModal)} className="modal-lg">
                <ModalHeader toggle={() => setOpenModal(!openModal)}>
                    Edit Rate Code Discount
                </ModalHeader>
                <ModalBody className="pb-3 px-sm-1 mx-20">
                    <Form onSubmit={handleEditSubmit(onEditSubmit)}>
                        <Row>

                            {/* Rate Code (read-only in edit — shown but disabled) */}
                            <Col md="4" sm="12" className="mb-1">
                                <div className="mb-1">
                                    <Label className="form-label" for="rateCodeID">
                                        Rate Code
                                    </Label>
                                    <Controller
                                        id="rateCodeID"
                                        control={editControl}
                                        name="rateCodeID"
                                        render={({ field }) => (
                                            <Select
                                                isClearable
                                                options={rateCodeOptions}
                                                classNamePrefix="select"
                                                theme={selectThemeColors}
                                                className="react-select"
                                                isDisabled={true}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>

                            {/* Percentage Discount (editable) */}
                            <Col md="4" sm="12" className="mb-1">
                                <div className="mb-1">
                                    <Label className="form-label" for="percentageDiscount">
                                        Percentage Discount (%) <span className="text-danger">*</span>
                                    </Label>
                                    <Controller
                                        name="percentageDiscount"
                                        control={editControl}
                                        defaultValue=""
                                        rules={{ required: true, min: 0, max: 100 }}
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                min={0}
                                                max={100}
                                                placeholder="Enter discount %"
                                                className="form-control"
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>

                            {/* Discount Description (editable) */}
                            <Col md="4" sm="12" className="mb-1">
                                <div className="mb-1">
                                    <Label className="form-label" for="discountDescription">
                                        Discount Description
                                    </Label>
                                    <Controller
                                        name="discountDescription"
                                        control={editControl}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <Input
                                                type="textarea"
                                                rows={3}
                                                placeholder="Enter discount description"
                                                className="form-control"
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>

                        </Row>

                        <div className="d-flex">
                            <Button className="me-1" color="primary" type='submit'>
                                Submit
                            </Button>
                            <Button
                                outline
                                color="secondary"
                                type="button"
                                onClick={() => setOpenModal(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>

            <br />

            {/* ── AG Grid ── */}
            <div className="ag-theme-alpine" style={{ height: 520 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    animateRows={true}
                    rowSelection="multiple"
                    onCellClicked={cellClickedListener}
                    paginationPageSize="10"
                    pagination="true"
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"
                    masterDetail={true}
                    onGridReady={(params) => {
                        gridRef.current = params.api;
                    }}
                />
            </div>
        </div>
    );
};

export default RateCodeDiscount;