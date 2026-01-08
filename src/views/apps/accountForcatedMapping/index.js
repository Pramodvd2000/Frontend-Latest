// ** Reactstrap Imports
import { Button, Card, CardBody, Row, Col, Form, Label, Input, CardHeader, Modal, ModalBody, ModalHeader } from 'reactstrap'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'

import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import classnames from 'classnames'
import Moment from 'moment'
import { useNavigate } from "react-router-dom"


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


const AdvancePost = (reservationData) => {
    const { formState: { errors } } = useForm();
    const navigate = useNavigate()
    const { handleSubmit, control, watch, reset } = useForm({})
    const [arrivalDate, setArrivalDate] = useState();
    const [departureDate, setDepartureDate] = useState()
    const [rowData, setRowData] = useState()
    const gridRef1 = useRef();
    const gridRef2 = useRef();
    const gridRef3 = useRef()
    const [viewModal, setViewModal] = useState(false);
    const [mapModal, setMapModal] = useState(false);
    const [removeModal, setRemoveModal] = useState(false);
    const [viewModalData, setViewModalData] = useState();
    const [mapModalData, setMapModalData] = useState();
    const [removeModalData, setRemoveModalData] = useState();
    const [confirmRemoveData, setConfirmRemoveData] = useState();
    const [confirmModal, setConfirm] = useState();
    const [companyData, setCompanyData] = useState();
    const [modifyAccount, setModifyAccount] = useState(false);
    const checkIn = watch('coming');
    const checkInDate = watch('startingDate');
    const [defaultDate, setDefaultDate] = useState(null);
    const [defaultDateDep, setDefaultDateDep] = useState(null);
    const [accountID, setAccountID] = useState();

    //Flatpickr condition for Arrival date
    const options = {
        minDate: arrivalDate
    }

    //Flatpickr condition for departure date
    const optionsToDate = {
        minDate: (checkIn === null ? arrivalDate : (Moment(String(new Date(checkIn))).format('YYYY-MM-DD'))) // Set the minimum date as fromDate or today if fromDate is not selected
    };

    //Flatpickr condition for departure date

    let optionsToDateModify;
    optionsToDateModify = {
        minDate: checkInDate === undefined ? (mapModalData && mapModalData[0].startDate) : Moment(String(new Date(checkInDate))).format('YYYY-MM-DD')
    };


    const columnDefs = [
        { headerName: 'Account Name', field: 'accountName', width: 210 },
        { headerName: 'Room Night Stay', field: 'ForecastedRNS', width: 160 },
        { headerName: 'Start Date', field: 'startDate', width: 150 },
        { headerName: 'End Date', field: 'endDate', width: 150 },
        {
            // headerName: "Actions",
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 120 }}
                    onClick={() => viewMappedCompany(params)}
                >
                    View List
                    {/* Mapped Accounts */}
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            // width: 120
        },
        {
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 140 }}
                    onClick={() => mapAccountsToGroup(params)}
                >
                    Map Company
                    {/* Accounts */}
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            // width: 120
        },
        {
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 160 }}
                    onClick={() => removeMappedAccounts(params)}
                >
                    Remove Company
                    {/* /Mapped Accounts */}
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            // width: 120
        },
        {
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 120 }}
                    onClick={() => { modifyAccountGroup(params) }}
                >
                    Modify
                    {/* /Mapped Accounts */}
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            // width: 120
        },
    ]


    const columnDefs2 = [
        { headerName: 'Account Group', field: 'accountGroupName', width: 230 },
        { headerName: 'Account Name', field: 'accountName', width: 230 },
        { headerName: 'Room Night Stay', field: 'ForecastedRNS', width: 200 },
        { headerName: 'Start Date', field: 'startDate', width: 200 },
        { headerName: 'End Date', field: 'endDate', width: 200 },
    ]


    const columnDefs4 = [
        {
            headerCheckboxSelection: true, // Enable header checkbox selection
            checkboxSelection: true, // Enable row checkbox selection
            width: 75
        },
        { headerName: 'Account Group', field: 'accountGroupName', width: 230 },
        { headerName: 'Account Name', field: 'accountName', width: 230 },
        { headerName: 'Room Night Stay', field: 'ForecastedRNS', width: 200 },
        { headerName: 'Start Date', field: 'startDate', width: 200 },
        { headerName: 'End Date', field: 'endDate', width: 200 },
    ]


    // Ag-grid column of company
    const [columnDefs3] = useState([
        {
            headerCheckboxSelection: true, // Enable header checkbox selection
            checkboxSelection: true, // Enable row checkbox selection
            width: 75
        },
        { headerName: 'Company Name', field: 'accountName', width: 300 },
        { headerName: 'Company Address', field: 'address', width: 300 },
        { headerName: 'Email ID', field: 'email', width: 300 },
        { headerName: 'Phone Number', field: 'phoneNumber', width: 200 },
        { headerName: 'GSTID', field: 'gstID', width: 300 },
    ])


    const removeMappedAccounts = (params) => {
        setRemoveModal(true)
        fetchx(API_URL + `/getMappedForecastedAccountDetails?accountForecastedID=${params.data.id}`)
            .then((result) => result.json())
            .then((response) => {
                setRemoveModalData(response.data)
            });
    }


    const mapAccountsToGroup = (params) => {
        setMapModal(true)
        fetchx(API_URL + `/getNonMappedAccountNames?accountMapID=${params.data.id}`)
            .then(result => result.json())
            .then(rowData => {
                const updatedData = rowData.data.map(item => ({
                    ...item,
                    accountMappingID: params.data.id
                }));
                setCompanyData(updatedData)
            })
    }


    const viewMappedCompany = (params) => {
        setViewModal(true)
        fetchx(API_URL + `/getMappedForecastedAccountDetails?accountForecastedID=${params.data.id}`)
            .then((result) => result.json())
            .then((response) => {
                setViewModalData(response.data)
            });
    }


    const modifyAccountGroup = (params) => {
        // Reset the state before fetching new data
        setModifyAccount(false);
        setAccountID(params.data.id)
        fetchx(API_URL + `/getAccountGroupDetails?accountID=${params.data.id}`)
            .then((result) => result.json())
            .then((response) => {
                setMapModalData(response.data);
                setModifyAccount(true);
            });
    };



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


    // Default dates setting based on business date
    useEffect(() => {

        fetchx(API_URL + `/getAccountGroupList`)
            .then((result) => result.json())
            .then((response) => {
                setRowData(response.data)
            });


        const hotelID = JSON.stringify({
            hotelID: 1
        })
        fetchx(API_URL + "/getBusinessDate", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: hotelID
        }).then((res) => res.json())
            .then(postres => {
                const today = new Date(postres['data'][0]['businessDate']);
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                setDepartureDate(tomorrow)
                setArrivalDate((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
            })
    }, [])


    //Search element
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef3.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        )
    }, [])


    //Search element
    const onFilterTextBoxChanged2 = useCallback(() => {
        gridRef1.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        )
    }, [])

    // error handling function
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


    // on submit 
    const onSubmit = data => {
        if (data.coming.length == 0) {
            return handleError("Please select the start date")
        }
        if (data.departure.length == 0) {
            return handleError("Please select the end date")
        }
        if ((Moment(String(new Date(data.departure))).format('YYYY-MM-DD')) < (Moment(String(new Date(data.coming))).format('YYYY-MM-DD'))) {
            return handleError("Please select the end date")
        }
        const AccountGroup = JSON.stringify({
            companyName: data.accountName,
            forcastedRoomNightSell: data.forcastedRNS,
            startDate: (Moment(String(new Date(data.coming))).format('YYYY-MM-DD')),
            endDate: (Moment(String(new Date(data.departure))).format('YYYY-MM-DD'))
        })

        // console.log(CheckAvailablity)
        fetchx(API_URL + '/createAccountGroup', {
            method: 'POST',
            body: AccountGroup,
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then((res) => res.json()).then(postres => {
            if (postres.statusCode == 200) {
                handleSuccess(postres.data)
            }
            else {
                handleError(postres.data)
            }
        }).catch((err) => {
            console.log(err.message)
        })
    }


    // Success card
    const handleSuccess = async (message) => {
        await MySwal.fire({
            title: 'Account Group',
            text: message,
            icon: 'success',
        });
        setTimeout(() => { navigate('/dashboard/accountmap') }, 500);
    }


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


    const submitRemoveData = () => {
        const selectedRows = gridRef2.current.api.getSelectedRows();
        if (selectedRows.length === 0) {
            return handleError("Please select atleast one entry to remove the data.")
        }
        MySwal.fire({
            title: "Confirmation Required",
            text: "By confirming, you are removing selected accounts from account group mapping. Are you sure?",
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
                    jsonData: selectedRows,
                })
                fetchx(API_URL + "/removeMappedAccountsFromGroup", {
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
    };


    const updateData = (data) => {
        if (Moment(String(new Date(data.startingDate))).format('YYYY-MM-DD') === 'Invalid date') {
            return handleError("Please select the start date")
        }
        if (Moment(String(new Date(data.endingDate))).format('YYYY-MM-DD') === 'Invalid date') {
            return handleError("Please select the end date")
        }
        MySwal.fire({
            title: "Confirmation Required",
            text: "By confirming, you are changing the details of account group. Are you sure?",
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
                const modifyJson = JSON.stringify({
                    startDate: Moment(String(new Date(data.startingDate))).format('YYYY-MM-DD'),
                    endDate: Moment(String(new Date(data.endingDate))).format('YYYY-MM-DD'),
                    accountName: data.accountName2,
                    forcastedNights: data.forcastedRNS2,
                    groupID: accountID
                })
                fetchx(API_URL + "/modifyAccountGroupDetails", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: modifyJson
                }).then(result => result.json())
                    .then(resp => {
                        if (resp.statusCode === 403) {
                            return handleError(resp.data)
                        }
                        handleSuccess("Successfully updated the account group details")
                    })
            }
        })
    }

    useEffect(() => {
        // Reset form values when mapModalData changes
        if (mapModalData) {
            reset({
                accountName2: mapModalData[0]?.accountName || '',
                forcastedRNS2: mapModalData[0]?.ForecastedRNS || '',
                startingDate: mapModalData[0]?.startDate || '',
                endingDate: mapModalData[0]?.endDate || ''
            });
        }
    }, [mapModalData, reset, defaultDateDep]);



    return (
        <div>

            <Card>
                <CardHeader>
                    <h4>
                        Account Group Creation
                    </h4>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>


                            {/* Account name */}
                            <Col md='3' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='accountName'>
                                        Account Name <span style={{ color: 'red' }}>*</span>
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='accountName'
                                        name='accountName'
                                        render={({ field }) =>
                                            <Input
                                                required
                                                placeholder='Type account name...'
                                                {...field}
                                            />}
                                    />
                                </div>
                            </Col>


                            {/* Forecasted RNS */}
                            <Col md='3' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='forcastedRNS'>
                                        Room Night Stay <span style={{ color: 'red' }}>*</span>
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='forcastedRNS'
                                        name='forcastedRNS'
                                        render={({ field }) =>
                                            <Input
                                                required
                                                placeholder='Enter room night stay amount...'
                                                {...field}
                                            />}
                                    />
                                </div>
                            </Col>


                            {/* Start Date */}
                            {
                                arrivalDate !== undefined &&
                                <Col md='3' sm='12'>
                                    <div className='mb-1'>
                                        <Label className='form-label' for='coming'>
                                            Start Date <spam style={{ color: 'red' }}>*</spam>
                                        </Label>
                                        <Controller
                                            control={control}
                                            id='coming'
                                            name='coming'
                                            defaultValue={arrivalDate}
                                            render={({ field }) => (
                                                <Flatpickr
                                                    required
                                                    {...field}
                                                    options={options}
                                                    placeholder='YYYY-MM-DD '
                                                    className={classnames('form-control')}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                            }


                            {/* End Date */}
                            {
                                departureDate !== undefined &&
                                <Col md='3' sm='12'>
                                    <div className='mb-1'>
                                        <Label className='form-label' for='departure'>
                                            End Date <spam style={{ color: 'red' }}>*</spam>
                                        </Label>
                                        <Controller
                                            control={control}
                                            id='departure'
                                            name='departure'
                                            defaultValue={departureDate}
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
                            }

                        </Row>

                        <div align='end'>
                            <Button outline className='me-1' color='secondary' type='reset'>
                                Reset
                            </Button>
                            <Button color='primary' className='me-1' type='submit'>
                                Submit
                            </Button>
                        </div>

                    </Form>
                </CardBody>
            </Card>

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
                </div>}


            <div>
                {reservationData && <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)} className="modal-xl">
                    <ModalHeader className="modal-lg" toggle={() => { setViewModal(!viewModal) }}>
                        View Account Group Mapping
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <div className="ag-theme-alpine" style={{ height: 600 }}>
                            <AgGridReact
                                ref={gridRef1}
                                rowData={viewModalData}
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
                            <Button outline className='me-1' color='secondary' onClick={() => setViewModal(!viewModal)}> Close</Button>
                        </div>
                    </ModalBody>
                </Modal>}
            </div>


            <div>
                {reservationData && <Modal isOpen={mapModal} toggle={() => setMapModal(!mapModal)} className="modal-xl">
                    <ModalHeader className="modal-lg" toggle={() => { setMapModal(!mapModal) }}>
                        Add Account group Mapping
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <Row>
                            <Col md='3' sm='12' className='mb-1'>
                                <Label className='form-label' for='fullName'>
                                    Search
                                </Label>
                                <Input
                                    type="text"
                                    id="filter-text-box"
                                    placeholder="Filter..."
                                    onInput={onFilterTextBoxChanged}
                                />
                            </Col>
                        </Row>
                        <br></br>
                        <div className="ag-theme-alpine" style={{ height: 600 }}>
                            <AgGridReact
                                ref={gridRef3}
                                rowData={companyData}
                                columnDefs={columnDefs3}
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


            <div>
                {reservationData && <Modal isOpen={removeModal} toggle={() => setRemoveModal(!removeModal)} className="modal-xl">
                    <ModalHeader className="modal-lg" toggle={() => { setRemoveModal(!removeModal) }}>
                        Remove Account Group Mapping
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <div className="ag-theme-alpine" style={{ height: 600 }}>
                            <AgGridReact
                                ref={gridRef2}
                                rowData={removeModalData}
                                columnDefs={columnDefs4}
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
                            <Button outline className='me-1' color='secondary' onClick={() => setRemoveModal(!removeModal)}> Close</Button>
                            <Button className='me-1' color='primary' onClick={submitRemoveData}> Submit</Button>
                        </div>
                    </ModalBody>
                </Modal>}
            </div>


            {modifyAccount && <div>
                {modifyAccount !== undefined &&
                    <Modal isOpen={modifyAccount} toggle={() => {
                        setModifyAccount(!modifyAccount)
                        setMapModalData()
                    }} className="modal-lg">
                        <ModalHeader className="modal-lg" toggle={() => {
                            setMapModalData()
                            setModifyAccount(!modifyAccount)
                        }}>
                            Modify Account group details
                        </ModalHeader>
                        {console.log(mapModalData)}
                        <ModalBody className="pb-3 px-sm-2 mx-20">
                            <Form onSubmit={handleSubmit(updateData)}>
                                <Row>
                                    <Col md='3' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='accountName2'>
                                                Account Name <span style={{ color: 'red' }}>*</span>
                                            </Label>
                                            <Controller
                                                control={control}
                                                id='accountName2'
                                                name='accountName2'
                                                render={({ field }) =>
                                                    <Input
                                                        required
                                                        defaultValue={mapModalData[0].accountName}
                                                        placeholder='Type account name...'
                                                        {...field}
                                                    />}
                                            />
                                        </div>
                                    </Col>


                                    <Col md='3' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='forcastedRNS2'>
                                                Room Night Stay <span style={{ color: 'red' }}>*</span>
                                            </Label>
                                            <Controller
                                                control={control}
                                                id='forcastedRNS2'
                                                name='forcastedRNS2'
                                                render={({ field }) =>
                                                    <Input
                                                        required
                                                        defaultValue={mapModalData[0].ForecastedRNS}
                                                        placeholder='Enter room night stay amount...'
                                                        {...field}
                                                    />}
                                            />
                                        </div>
                                    </Col>


                                    <Col md='3' sm='12' className='mb-1' >
                                        <div className='mb-1'>
                                            <Label className='form-label' for='startingDate'>
                                                Start Date <spam style={{ color: 'red' }}>*</spam>
                                            </Label>
                                            <Controller
                                                control={control}
                                                id='startingDate'
                                                name='startingDate'
                                                defaultValue={mapModalData && mapModalData[0].startDate}
                                                render={({ field }) => (
                                                    <Flatpickr
                                                        options={options}
                                                        placeholder='YYYY-MM-DD '
                                                        className={classnames('form-control')}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    <Col md='3' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='endingDate'>
                                                End Date <spam style={{ color: 'red' }}>*</spam>
                                            </Label>
                                            <Controller
                                                control={control}
                                                id='endingDate'
                                                name='endingDate'
                                                defaultValue={mapModalData[0].endDate}
                                                render={({ field }) => (
                                                    <Flatpickr
                                                        options={optionsToDateModify}
                                                        placeholder='YYYY-MM-DD '
                                                        className={classnames('form-control')}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>

                                </Row>
                                <br></br>
                                <div align='end'>
                                    <Button outline className='me-1' color='secondary' onClick={() => {
                                        setModifyAccount(!modifyAccount)
                                        setMapModalData()
                                    }}> Close</Button>
                                    <Button className='me-1' color='primary' type='submit'> Modify</Button>
                                </div>
                            </Form>
                        </ModalBody>
                    </Modal>}
            </div>}

        </div>
    )
}


export default AdvancePost