import { Button, Form, Label, Input, Card, CardBody, Row, Col, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import API_URL from '../../../../config';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import { useNavigate } from "react-router-dom"
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import PackageCode from '../enquiryCreate/packageConfig';
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'


const PackageModification = (data1) => {
    const { reset, handleSubmit, control, formState: { errors } } = useForm({})
    const navigate = useNavigate()
    const [packageModal, setPackageModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState();
    const [openPackageModal, setOpenPackageModal] = useState(false)
    const [packageData, setPackageData] = useState()
    const gridRef1 = useRef()

    useEffect(() => {
        fetchx(API_URL + '/getPackageForGroup')
            .then(result => result.json())
            .then(resp => {
                setPackageData(resp['data'])
            })
    }, [])


    const onSubmit = data => {

        if(selectedPackage.packageCode === data1.data.packageName){
            return handleError("Please select different package type than current package plan")
        }
        const allowedModification = JSON.stringify({
            groupReservationID: data1.data.id,
            arrivalDate: data1.data.arrivalDate
        })

        fetchx(API_URL + "/isAllowedPackageUpdate", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: allowedModification
        }).then((data) => data.json())
            .then((res) => {
                if (res.statusCode == 403) {
                    return handleError(res.message)
                }
                else {
                    MySwal.fire({
                        title: "Confirmation Required",
                        text: `By doing this, package type will be change to ${selectedPackage.packageCode} for entire group booking. Are you sure?`,
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
                        const packageData = JSON.stringify({
                            groupReservationID: data1.data.id,
                            packageType: selectedPackage.id,
                            packageCode: selectedPackage.packageCode
                        })

                        if (result.isConfirmed) {
                            fetchx(API_URL + "/modifyPackageTypeOfGroup", {
                                method: "POST",
                                headers: { 'Content-Type': 'application/json' },
                                body: packageData
                            }).then((data) => data.json())
                                .then((res) => {
                                    if (res.statusCode === 403) {
                                        return handleError(res.message)
                                    }
                                    handleSuccess(res['message'])
                                    setTimeout(() => { navigate('/dashboard/groupreservation/allgroupreservations') }, 500)
                                }).catch((err) => {
                                    console.log(err.message)
                                })
                        }
                    })
                }
            })
    }

    
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


    // Success card
    const handleSuccess = async (message) => {
        await MySwal.fire({
            title: 'Package Type Modification',
            text: message,
            icon: 'success',
        });
        setTimeout(() => { navigate('/dashboard/groupreservation/allgroupreservations') }, 500);
    }


    // To clear selected booker
    const handlePackageClear = () => {
        setSelectedPackage()
    };


    // company selection
    const onPackageSelect = (rowData) => {
        setSelectedPackage(rowData);
        setPackageModal(false);
    };


    //Search element
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef1.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        )
    }, [])


    //on click of new company profile
    const onclickButton4 = () => {
        setOpenPackageModal(true)
    }


    // Ag-grid column of company
    const [columnDefsPackage] = useState([
        { headerName: 'Package Code', field: 'packageCode', width: 145 },
        { headerName: 'Description', field: 'description', width: 300 },
        {
            headerName: "Action",
            maxWidth: 140,
            cellRenderer: (params) => {
                return (
                    <Button
                        color='primary'
                        onClick={() => onPackageSelect(params.data)}>
                        Select
                    </Button>
                )
            }
        },
        { headerName: 'Start Date', field: 'beginSellDate', width: 140 },
        { headerName: 'End Date', field: 'endSellDate', width: 140 },
        { headerName: 'Breakfast', field: 'breakfast', width: 140 },
        { headerName: 'Lunch', field: 'lunch', width: 140 },
        { headerName: 'Dinner', field: 'dinner', width: 140 },
        { headerName: 'Total', field: 'basePrice', width: 140 },

    ])


    //ag-grid column defn
    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ))


    // Agent onsubmit modal close
    function packageToggle() {
        fetchx(API_URL + '/getPackageForGroup')
            .then(result => result.json())
            .then(resp => {
                setPackageData(resp['data'])
            })

        setOpenPackageModal(!openPackageModal)

    }


    return (
        <div>

            {/* Package Modal */}
            <Modal isOpen={openPackageModal} toggle={() => setOpenPackageModal(!openPackageModal)} className='modal-xl'>
                <ModalHeader toggle={() => setOpenPackageModal(!openPackageModal)}>Package Addition</ModalHeader>
                <ModalBody>
                    <PackageCode packageToggle={packageToggle} />
                </ModalBody>
            </Modal>

            <Card>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <h4>
                            Reservation Details
                        </h4>
                        <br></br>
                        <div>
                            <Row>
                                <Col>
                                    <b>Arrival Date</b>:- {data1.data.arrivalDate}  <br></br>
                                </Col>
                                <Col>
                                    <b>Departure Date</b>:- {data1.data.departureDate} <br></br>
                                </Col>
                                <Col>
                                    <b>Package Type</b>:- {data1.data.packageName} <br></br><br></br>
                                </Col>
                            </Row>
                            <Row>
                                <Col md='6' sm='12'>
                                    <b>Group Name</b>:- {data1.data.groupName} <br></br>
                                </Col>
                                <Col md='6' sm='12'>
                                    <b>BlockCodeID</b>:- {data1.data.id} <br></br><br></br>
                                </Col>
                                <Col>
                                </Col>
                            </Row>
                        </div>
                        <Row>
                            <Col md='6' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='packageID'>
                                        Package Type <span style={{ color: 'red' }}>*</span>
                                    </Label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Input
                                            type="text"
                                            name='packageID'
                                            required
                                            placeholder='Select Package type'
                                            value={selectedPackage !== undefined ? selectedPackage.packageCode : ''}
                                            onClick={() => setPackageModal(!packageModal)}
                                        /> &nbsp;&nbsp;
                                        <span
                                            style={{
                                                color: 'red',
                                                cursor: 'pointer',
                                                border: 'none',
                                                background: 'none',
                                                padding: '0',
                                                fontSize: 'inherit',
                                                marginLeft: '5px',
                                            }}
                                            size="sm"
                                            onClick={handlePackageClear}
                                        >
                                            X
                                        </span>
                                    </div>
                                </div>
                            </Col>


                            {
                                packageModal &&
                                <div>
                                    <Modal isOpen={packageModal} toggle={() => setPackageModal(!packageModal)} className='modal-xl'>
                                        <ModalHeader toggle={() => setPackageModal(!packageModal)}>Package Details</ModalHeader>
                                        <ModalBody>
                                            <div>
                                                <Row className='mb-1'>
                                                    <Col md='3' sm='12' className='me-1'>
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
                                                    <Col md='3' sm='12' className='me-1'>
                                                        <br></br>
                                                        <div align='end' >
                                                            <Button color='primary' onClick={onclickButton4}>Add Package</Button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="ag-theme-alpine" style={{ height: 520 }}>
                                                <AgGridReact
                                                    ref={gridRef1}
                                                    rowData={packageData}
                                                    columnDefs={columnDefsPackage}
                                                    animateRows={true}
                                                    paginationPageSize='10'
                                                    pagination='true'
                                                    defaultColDef={defaultColDef}
                                                    headerColor="ddw-primary"
                                                />
                                            </div>
                                        </ModalBody>
                                    </Modal>
                                </div>
                            }
                        </Row>
                        <br></br>

                        {/* On submit buttons */}
                        <div align='end'>
                            <Button outline className='me-1' color='secondary' type='reset'>
                                Reset
                            </Button>
                            <Button className='me-1' color='primary' type='submit'>
                                Update
                            </Button>
                        </div>
                    </Form>
                </CardBody>
            </Card>
        </div>
    )
}

export default PackageModification