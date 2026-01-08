// ** Reactstrap Imports
import { Button, Card, CardBody, Row, Col, Form, Label, Input, CardHeader, Modal, ModalBody, ModalHeader } from 'reactstrap'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'

import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Moment from 'moment'


// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import API_URL from '../../../config'

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";


const UnMappedCompanies = () => {
    const { formState: { errors } } = useForm();
    const { handleSubmit, control, watch, setValue } = useForm({})
    const gridRef1 = useRef();
    const gridRef2 = useRef();
    const [rowData, setRowData] = useState()
    const [arrivalDate, setArrivalDate] = useState();
    const [companyData, setCompanyData] = useState();
    const [mapModal, setMapModal] = useState(false);
    const [accountID, setAccountID] = useState();


    const columnDefs = [
        { headerName: 'Account Group', field: 'accountName', width: 230 },
        { headerName: 'Email ID', field: 'email', width: 230 },
        {
            headerName: 'Address',
            field: 'address', // This can be any field name not present in the data set
            width: 400,
            valueGetter: params => `${params.data.addressLine1 || ''} ${params.data.addressLine2 || ''}`
        },
        { headerName: 'Mapping status', field: 'mappingStatus', width: 230 },
        { headerName: 'Mapped to', field: 'mappedTo', width: 230 },
        {
            headerName: 'Actions',
            field: 'mappingStatus', // Ensure this field is included in your data
            cellRendererFramework: (params) => (
                params.data.mappingStatus === 'Not Mapped' ? (
                    <Button
                        color="primary"
                        style={{ width: 165 }}
                        onClick={() => { mapAccountsToGroup(params); setAccountID(params.data.companyid) }}
                    >
                        Map To Company Group
                    </Button>
                ) : null
            ),
        }
    ]


    const columnDefs2 = [
        { headerName: 'Account Group', field: 'accountName', width: 230 },
        { headerName: 'Room Nights', field: 'ForecastedRNS', width: 123 },
        { headerName: 'Start Date', field: 'startDate', width: 230 },
        { headerName: 'End Date', field: 'endDate', width: 230 },
        {
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 140 }}
                    onClick={() => mapAccountToAccountGroup(params)}
                >
                    Select
                    {/* Accounts */}
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            // width: 120
        },
    ]


    const mapAccountsToGroup = (params) => {
        setMapModal(true)
        fetchx(API_URL + `/getAllAccountGroupList`)
            .then(result => result.json())
            .then(rowData => {
                setCompanyData(rowData.data)
            })
    }


    const handleSuccess = async (message) => {
        await MySwal.fire({
            title: 'Account Group',
            text: message,
            icon: 'success',
        });
        fetchx(API_URL + `/getTodayCreatedCompanies`)
            .then((result) => result.json())
            .then((response) => {
                setRowData(response.data)
            });
    }


    const mapAccountToAccountGroup = (params) => {
        MySwal.fire({
            title: "Confirmation Required",
            text: "By confirming, you are mapping to selected account group. Are you sure?",
            icon: "question",
            buttonsStyling: false,
            showCancelButton: true,
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "No",
            reverseButtons: true,
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'btn btn-primary ms-1',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const accountJson = JSON.stringify({
                    companyID: accountID,
                    accountGroupID: params.data.id
                })
                fetchx(API_URL + "/mapCompanyToAccountGroup", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: accountJson
                }).then(result => result.json())
                    .then(resp => {
                        if (resp.statusCode === 403) {
                            return handleError(resp.message)
                        }
                        handleSuccess(resp.message)
                        setMapModal(!mapModal)
                    })
            }
        })
    }


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
    ));


    useEffect(() => {

        const hotelID = JSON.stringify({
            hotelID: 1
        })
        fetchx(API_URL + "/getBusinessDate", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: hotelID
        }).then((res) => res.json())
            .then(postres => {
                setArrivalDate((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
            })

        fetchx(API_URL + `/getTodayCreatedCompanies`)
            .then((result) => result.json())
            .then((response) => {
                setRowData(response.data)
            });
    }, [])


    //Search element
    const onFilterTextBoxChanged2 = useCallback(() => {
        gridRef1.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        )
    }, [])


    const onFilterTextBoxChanged1 = useCallback(() => {
        gridRef2.current.api.setQuickFilter(
            document.getElementById('filter-text-box1').value
        )
    }, [])


    const submitMapData = () => {

        const selectedNodes = gridRef3.current.api.getSelectedNodes();
        const allDisplayedNodes = gridRef3.current.api.getModel().rowsToDisplay;

        // Create a map of displayed rows for quick lookup
        const displayedRowMap = new Map();
        allDisplayedNodes.forEach(node => {
            displayedRowMap.set(node.id, node.data);
        });

        // Filter selected nodes to only include those that are displayed
        const filteredSelectedRows = selectedNodes
            .filter(node => displayedRowMap.has(node.id))
            .map(node => node.data);

        if (filteredSelectedRows.length === 0) {
            return handleError("Please select atleast one entry to map the account")
        }
        MySwal.fire({
            title: "Confirmation Required",
            text: "By confirming, you are mapping the selected accounts. Are you sure?",
            icon: "question",
            buttonsStyling: false,
            showCancelButton: true,
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "No",
            reverseButtons: true,
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'btn btn-primary ms-1',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const fullData = JSON.stringify({
                    jsonData: filteredSelectedRows,
                })
                fetchx(API_URL + "/mapAccountsToAccountGroup", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: fullData
                }).then(result => result.json())
                    .then(resp => {
                        if (resp.statusCode === 403) {
                            return handleError(resp.data)
                        }
                        handleSuccess(resp.data)
                    })
            }
        })
    }


    const resetData = () => {
        fetch(API_URL + '/getTodayCreatedCompanies')
            .then(result => result.json())
            .then(resp => {
                setRowData(resp['data'])
            })
        setValue('incomeDate', null)
        setValue('outGoData', null)
    }


    const GetComplaintList = (data) => {
        if (data.incomeDate === undefined) {
            return handleError("Please select the from date")
        }
        if (data.outGoData === undefined) {
            return handleError("Please select the to date")
        }
        if ((Moment(String(new Date(data.departure))).format('YYYY-MM-DD')) < (Moment(String(new Date(data.coming))).format('YYYY-MM-DD'))) {
            return handleError("Please select the to date")
        }
        let fromDate = (Moment(String(new Date(data.incomeDate))).format('YYYY-MM-DD'))
        let toDate = (Moment(String(new Date(data.outGoData))).format('YYYY-MM-DD'))

        fetch(API_URL + `/getTodayCreatedCompanies?startDate=${fromDate}&endDate=${toDate}`)
            .then(result => result.json())
            .then(resp => {
                setRowData(resp['data'])
            })
    }


    const checkIn = watch('incomeDate');


    const optionsToDate = {
        minDate: (checkIn === null ? arrivalDate : (Moment(String(new Date(checkIn))).format('YYYY-MM-DD'))) // Set the minimum date as fromDate or today if fromDate is not selected
    };


    return (
        <div>

            <div>
                <Card>
                    <CardHeader>
                        <h4>Select Dates</h4>
                    </CardHeader>
                    <CardBody>
                        <Form onSubmit={handleSubmit(GetComplaintList)}>
                            <Row>
                                <Col md='4' sm='12'>
                                    <div className='mb-1'>
                                        <Label className='form-label' for='incomeDate'>
                                            From Date <spam style={{ color: 'red' }}>*</spam>
                                        </Label>
                                        <Controller
                                            control={control}
                                            id='incomeDate'
                                            name='incomeDate'
                                            render={({ field }) => (
                                                <Flatpickr
                                                    required
                                                    {...field}
                                                    // options={options1}
                                                    placeholder='YYYY-MM-DD '
                                                    className={classnames('form-control')}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                                <Col md='4' sm='12'>
                                    <div className='mb-1'>
                                        <Label className='form-label' for='outGoData'>
                                            To Date <spam style={{ color: 'red' }}>*</spam>
                                        </Label>
                                        <Controller
                                            control={control}
                                            id='outGoData'
                                            name='outGoData'
                                            render={({ field }) => (
                                                <Flatpickr
                                                    required
                                                    {...field}
                                                    options={optionsToDate}
                                                    placeholder='YYYY-MM-DD '
                                                    className={classnames('form-control')}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <div align='end'>
                                <Button outline color='secondary' className='me-1' onClick={resetData}>
                                    Reset
                                </Button>
                                <Button color='primary' className='me-1' type='submit'>
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </div>


            {rowData &&
                <div>
                    <Row>
                        <Col md='3' sm='12' className='mb-1'>
                            <Label className='form-label' for='fullName'>
                                Search
                            </Label>
                            <Input
                                type="text"
                                id="filter-text-box"
                                placeholder="Filter..."
                                onInput={onFilterTextBoxChanged2}
                            />
                        </Col>
                    </Row>
                    <div className="ag-theme-alpine" style={{ height: 540 }}>
                        <AgGridReact
                            ref={gridRef1}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            animateRows={true}
                            rowSelection="multiple"
                            pagination={true}
                            paginationPageSize={10}
                            defaultColDef={defaultColDef}
                        />
                    </div>
                </div>
            }

            <div>
                {companyData && <Modal isOpen={mapModal} toggle={() => setMapModal(!mapModal)} className="modal-xl">
                    <ModalHeader className="modal-lg" toggle={() => { setMapModal(!mapModal) }}>
                        Account Groups
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <Row>
                            <Col md='3' sm='12' className='mb-1'>
                                <Label className='form-label' for='fullName'>
                                    Search
                                </Label>
                                <Input
                                    type="text"
                                    id="filter-text-box1"
                                    placeholder="Filter..."
                                    onInput={onFilterTextBoxChanged1}
                                />
                            </Col>
                        </Row>
                        <br></br>
                        <div className="ag-theme-alpine" style={{ height: 600 }}>
                            <AgGridReact
                                ref={gridRef2}
                                rowData={companyData}
                                columnDefs={columnDefs2}
                                animateRows={true}
                                rowSelection="multiple"
                                paginationPageSize={10}
                                singleClickEdit={true}
                                pagination={true}
                                defaultColDef={defaultColDef}
                                headerColor="ddw-primary"
                            />
                        </div>
                        <br></br>
                        <div align='end'>
                            <Button outline className='me-1' color='secondary' onClick={() => setMapModal(!mapModal)}> Close</Button>
                            <Button className='me-1' color='primary' onClick={submitMapData}> Submit</Button>
                        </div>
                    </ModalBody>
                </Modal>}
            </div>

        </div>
    )

}


export default UnMappedCompanies