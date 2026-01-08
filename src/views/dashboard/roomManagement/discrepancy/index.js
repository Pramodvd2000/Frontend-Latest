// ** Custom Components
import React, { Fragment, useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Input, Form, Label, CardText, CardFooter, Nav, TabPane, NavItem, NavLink, TabContent, Table, Card, CardTitle, CardHeader, CardBody
} from 'reactstrap'

import { useForm, Controller } from "react-hook-form";

import { useNavigate } from 'react-router-dom'
// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import API_URL from "../../../../config";
import Moment from 'moment'
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { selectThemeColors } from "@utils";
import classnames from "classnames";
import Cleave from 'cleave.js/react'

const MySwal = withReactContent(Swal)



sessionStorage.removeItem('activeTab')
const TableWithData = () => {
    const navigate = useNavigate()

    // ** State
    const gridRef = useRef();

    const [active, setActive] = useState(sessionStorage.getItem('activeTab') || '1');
    // const [active, setActive] = useState('1');

    const [rowData, setRowData] = useState();
    const [rowData2, setRowData2] = useState();
    const [discrepancy, setDiscrepancy] = useState(false);
    const [data, setData] = useState(null);
    const [filldata, setfilldata] = useState("");
    const [Today, setToday] = useState()
    const [dailyPAX, setDailyPAX] = useState()


    // ** Hooks
    const { reset, handleSubmit, control, formState: { errors }
    } = useForm({});

    const toggle = tab => {
        if (active !== tab) {
            setActive(tab)
        }
    }

    useEffect(() => {
        sessionStorage.setItem('activeTab', active);
    }, [active]);



    const handleSuccess = (message) => {
        return MySwal.fire({
            title: message,
            text: 'Successfully added discrepancy',
            icon: 'success',
        })
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

    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'BookingID', field: 'bookingID', suppressSizeToFit: true, maxWidth: 100 },

        { headerName: 'Room No.', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 115, sort: 'asc' },
        { headerName: 'Guest', field: 'guestName', suppressSizeToFit: true, maxWidth: 180 },
        { headerName: 'Company', field: 'accountName', suppressSizeToFit: true, maxWidth: 140 },
        {
            headerName: "Arrival",
            field: "arrivalDate",
            suppressSizeToFit: true,
            maxWidth: 140,
            cellRenderer: (params) => {
                // Ensure the arrivalDate field exists in the row data        
                if (params.data && params.data.arrivalDate) {
                    // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
                    const formattedDate = Moment(params.data.arrivalDate).format("DD-MM-YYYY");
                    return formattedDate;
                } else {
                    return ""; // Handle cases where the data is missing or invalid        
                }
            }
        },
        {
            headerName: "Departure",
            field: "departureDate",
            suppressSizeToFit: true,
            maxWidth: 140,
            cellRenderer: (params) => {
                // Ensure the arrivalDate field exists in the row data        
                if (params.data && params.data.departureDate) {
                    // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
                    const formattedDate = Moment(params.data.departureDate).format("DD-MM-YYYY");
                    return formattedDate;
                } else {
                    return ""; // Handle cases where the data is missing or invalid        
                }
            }
        },
        { headerName: 'Status', field: 'reservationStatus', suppressSizeToFit: true, maxWidth: 130 },
        {
            headerName: 'Actions', cellRendererFramework: (params) => {
                return (<Button color='primary' style={{ width: 230,align:'center' }} onClick={() => {
                    setDiscrepancy(true)
                }}  >Report Discrepancy</Button>)
            },  width: 250
        },
        { headerName: 'Balance', field: 'balance', suppressSizeToFit: true, maxWidth: 130 },

        { headerName: 'Room Type', field: 'roomType', suppressSizeToFit: true, maxWidth: 140 },
        { headerName: 'Market Code', field: 'marketCode', suppressSizeToFit: true, maxWidth: 140 },
        { headerName: 'Source Code', field: 'sourceCode', suppressSizeToFit: true, maxWidth: 140 },
        { headerName: 'Account Name', field: 'accountName', suppressSizeToFit: true, maxWidth: 140 },
        { headerName: 'Rate Code', field: 'rateCode', suppressSizeToFit: true, maxWidth: 140 },
        { headerName: 'Origin', field: 'origin', suppressSizeToFit: true, maxWidth: 140 },
    ]);


    const [columnDefs2, setColumnDefs2] = useState([

        { headerName: 'BookingID', field: 'bookingID', suppressSizeToFit: true, maxWidth: 120},
        { headerName: 'Guest', field: 'guestName', suppressSizeToFit: true, maxWidth: 180},
        { headerName: 'Room No.', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 136, sort: 'asc' },
        { headerName: 'Room Type', field: 'roomType', suppressSizeToFit: true, maxWidth: 134 },
        { headerName: 'FO PAX', field: 'frontOfficePAX', suppressSizeToFit: true, maxWidth: 110 },
        { headerName: 'HK PAX', field: 'housekeepingPAX', suppressSizeToFit: true, maxWidth: 110 },
        { headerName: 'Discrepancy', field: 'discrepancy', suppressSizeToFit: true, maxWidth: 130 },

        { headerName: 'HK Status', field: 'housekeepingStatus', suppressSizeToFit: true, maxWidth: 120 },

        {
            headerName: "Discrepancy Date",
            field: "discrepancyDate",
            suppressSizeToFit: true,
            maxWidth: 170,
            cellRenderer: (params) => {
                // Ensure the arrivalDate field exists in the row data        
                if (params.data && params.data.discrepancyDate	) {
                    // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
                    const formattedDate = Moment(params.data.discrepancyDate).format("DD-MM-YYYY");
                    return formattedDate;
                } else {
                    return ""; // Handle cases where the data is missing or invalid        
                }
            }
        },
       
        { headerName: 'Remarks', field: 'remarks', suppressSizeToFit: true, maxWidth: 130 },
    ]);
    const cellClickedListener = useCallback(event => {
        setfilldata(event["data"]);

    }, []);

    const cellClickedListener2 = useCallback(event => {
        // setfilldata(event["data"]);

    }, []);

    const getRowStyle = params => {

        if (params.data && params.data.noPost === 1) {
            return { background: 'red' };
        }
        else if (params.data && params.data.subBookingID !== null && params.data.subBookingID !== '0') {
            return { background: '#f1c40f' };
        }
        return null;
    };

    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ));


    useEffect(() => {
        fetchx(API_URL + '/getReservationForFrontDeskInHouseGuest')
            .then(result => result.json())
            .then(rowData => {
                setRowData(rowData['data'])
                //console.log(rowData)

            })
    }, []);


    useEffect(() => {
        const hotelIDData = JSON.stringify({
            sharingID:filldata.sharingID,
            hotelID: 10
        })
        fetchx(API_URL + "/getRoomDiscrepency", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: hotelIDData
        }).then((res) => res.json())
            .then(postres => {
                setRowData2(postres['data'])

            })
    }, []);

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

    useEffect(() => {


        if (Today && filldata) {

            let createasset = JSON.stringify({
                "date": Today,
                "sharingID": filldata['sharingID']
            });

            let res = fetchx(API_URL + "/getResRoomDiscrepency", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: createasset,
            }).then(data => data.json())
                .then((res) => {
                    if (res.statusCode === 200) {
                        setDailyPAX(res['data'])

                    }

                })
        }
    }, [Today, filldata]);

    const onSubmit = data =>{
        setData(data);
        //console.log(data1)

        let createasset = JSON.stringify({
            "sharingID": filldata.sharingID,
            "housekeepingPAX": data.hkPAX,
            "remarks": data.remarks
        });


        let res = fetchx(API_URL + "/addDiscrepancy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: createasset,
        }).then(data => data.json())
            .then((res) => {
                if (res.statusCode === 200) {
                    setActive('2')  

                    handleSuccess('Discrepancy Added Successful!!')
                    setTimeout(() => { navigate('')}, 500)
                   


                }
                else {
                    handleError(res.message)
                }
            }).then(res => console.log(res))
            .then((res) => {

            })


    };
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag="h4" style={{ 'align': 'center' }}>Discrepancy</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardBody>
                    <Fragment>
                        <Nav tabs filled>
                            <NavItem style={{ 'width': '50%' }}>
                                <NavLink
                                    active={active === '1'}
                                    onClick={() => {
                                        toggle('1')
                                    }}

                                >
                                    IN-HOUSE GUESTS
                                </NavLink>
                            </NavItem>
                            <NavItem style={{ 'width': '50%' }}>
                                <NavLink
                                    active={active === '2'}
                                    onClick={() => {
                                        toggle('2')
                                    }}

                                >
                                    DISCREPANCY
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Fragment>


                    <TabContent activeTab={active}>
                        <TabPane tabId='1'>
                            <Card>

                                <CardBody>
                                    <div className="ag-theme-alpine" style={{ height: 520 }}>
                                        <AgGridReact
                                            ref={gridRef}
                                            rowData={rowData} columnDefs={columnDefs}
                                            animateRows={true} rowSelection='multiple'
                                            onCellClicked={cellClickedListener}
                                            getRowStyle={getRowStyle}
                                            paginationAutoPageSize='true'
                                            paginationPageSize='10'
                                            pagination='true'
                                            defaultColDef={defaultColDef}
                                            headerColor="ddw-primary"

                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </TabPane>
                    </TabContent>


                    <TabContent activeTab={active}>
                        <TabPane tabId='2'>
                            <Card>

                                <CardBody>
                                    <div className="ag-theme-alpine" style={{ height: 520 }}>
                                        <AgGridReact
                                            ref={gridRef}
                                            rowData={rowData2} columnDefs={columnDefs2}
                                            animateRows={true} rowSelection='multiple'
                                            onCellClicked={cellClickedListener2}
                                            // getRowStyle={getRowStyle}
                                            paginationAutoPageSize='true'
                                            paginationPageSize='10'
                                            pagination='true'
                                            defaultColDef={defaultColDef}
                                            headerColor="ddw-primary"

                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </TabPane>
                    </TabContent>
                </CardBody>
            </Card>




            <Modal
                isOpen={discrepancy}
                toggle={() => setDiscrepancy(!discrepancy)}
                className='modal-xl'
            >
                <ModalHeader
                    className="bg-transparent"
                    toggle={() => setDiscrepancy(!discrepancy)}
                ></ModalHeader>
                <ModalBody className="pb-3 px-sm-1 mx-20">
                    <div><Card>
                        <CardHeader>
                            <CardTitle tag="h4">Discrepancy Form</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>


                                    <Col md='3' sm='12' className='mb-1'>
                                        <div className="mb-1">
                                            <Label className="form-label" for="SubBookingId">
                                                Booking ID
                                            </Label>
                                            <Controller
                                                id='SubBookingId'
                                                control={control}
                                                name='SubBookingId'
                                                render={({ field }) => (
                                                    <Input
                                                        isClearable
                                                        // options={subBookingId}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select', { 'is-invalid': data !== null && data.SubBookingId === null })}
                                                        {...field}
                                                        disabled={true}
                                                        value={filldata['bookingID']}
                                                    />
                                                )}
                                            />

                                        </div>
                                    </Col>


                                    <Col md='3' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='fullName'>
                                                Guest Name
                                            </Label>
                                            <Controller
                                                id='fullName'
                                                control={control}
                                                name='fullName'
                                                render={({ field }) => (
                                                    <Input
                                                        isClearable
                                                        // options={fullName}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select', { 'is-invalid': data !== null && data.fullName === null })}
                                                        {...field}
                                                        disabled={true}
                                                        value={filldata['firstName']}

                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>

                                    <Col md='3' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='assignedRoomType'>
                                                Room Type
                                            </Label>
                                            <Controller
                                                id='assignedRoomType'
                                                control={control}
                                                name='assignedRoomType'
                                                render={({ field }) => (
                                                    <Input
                                                        isClearable
                                                        // options={assignedRoomType}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select', { 'is-invalid': data !== null && data.assignedRoomType === null })}
                                                        disabled={true}
                                                        {...field}
                                                        value={filldata['roomType']}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>

                                    <Col md='3' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='RoomNumber'>
                                               Room No.
                                            </Label>
                                            <Controller
                                                id='RoomNumber'
                                                control={control}
                                                name='RoomNumber'
                                                render={({ field }) => (
                                                    <Input
                                                        isClearable
                                                        disabled={true}
                                                        //   options={Roomarr}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select', { 'is-invalid': data !== null && data.RoomNumber === null })}
                                                        {...field}
                                                        value={filldata['roomNumber']}

                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    <Col md='3' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='start'>
                                                Arrival Date
                                            </Label>
                                            <Controller
                                                id='start'
                                                name='start'
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        required
                                                        placeholder='start'
                                                        {...field}
                                                        disabled={true}
                                                        // className={classnames('form-control', {
                                                        //   'is-invalid': data !== null && (data.start === null || !data.start.length)
                                                        // })}
                                                        value={Moment(String(new Date(filldata['arrivalDate']))).format('DD-MM-YYYY')}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                    <Col md='3' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='end'>
                                                Departure Date
                                            </Label>
                                            <Controller
                                                id='end'
                                                name='end'
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        required
                                                        placeholder='End'
                                                        {...field}
                                                        disabled={true}
                                                        // className={classnames('form-control', {
                                                        //   'is-invalid': data !== null && (data.end === null || !data.end.length)
                                                        // })}
                                                        value={Moment(String(new Date(filldata['departureDate']))).format('DD-MM-YYYY')}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>

                                    {dailyPAX && <Col md='3' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='assignedRoomType'>
                                                Front Office PAX
                                            </Label>
                                            <Controller
                                                id='assignedRoomType'
                                                control={control}
                                                name='assignedRoomType'
                                                render={({ field }) => (
                                                    <Input
                                                        isClearable
                                                        // options={assignedRoomType}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select', { 'is-invalid': data !== null && data.assignedRoomType === null })}
                                                        disabled={true}
                                                        {...field}
                                                        value={dailyPAX[0]['adults']}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>}
                                    {dailyPAX && <Col md='3' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='assignedRoomType'>
                                                Housekeeping Status
                                            </Label>
                                            <Controller
                                                id='assignedRoomType'
                                                control={control}
                                                name='assignedRoomType'
                                                render={({ field }) => (
                                                    <Input
                                                        isClearable
                                                        // options={assignedRoomType}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select', { 'is-invalid': data !== null && data.assignedRoomType === null })}
                                                        disabled={true}
                                                        {...field}
                                                        value={dailyPAX[1]['roomStatus']}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>}
                                    {dailyPAX && <Col md='3' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='assignedRoomType'>
                                                Front Office Status
                                            </Label>
                                            <Controller
                                                id='assignedRoomType'
                                                control={control}
                                                name='assignedRoomType'
                                                render={({ field }) => (
                                                    <Input
                                                        isClearable
                                                        // options={assignedRoomType}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select', { 'is-invalid': data !== null && data.assignedRoomType === null })}
                                                        disabled={true}
                                                        {...field}
                                                        value={dailyPAX[1]['frontOfficeStatus']}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>}

                                    <Col md='3' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='hkPAX'>
                                                Housekeeping PAX
                                            </Label>
                                            <Controller
                                                id='hkPAX'
                                                control={control}
                                                name='hkPAX'
                                                render={({ field }) => (
                                                    <Cleave
                                                        // {...field}
                                                        id='hkPAX'
                                                        placeholder='Housekeeping PAX'
                                                        className={classnames('form-control', { 'is-invalid': errors.hkPAX })}
                                                        pattern='[0-9]{1,15}'
                                                        title="Housekeeping PAX can only contain numbers."
                                                        required
                                                        invalid={errors.hkPAX && true}
                                                        {...field}

                                                    />

                                                )}

                                            />
                                        </div>
                                    </Col>
                                    <Col md='3' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='remarks'>
                                                Remarks
                                            </Label>
                                            <Controller
                                                id='remarks'
                                                control={control}
                                                name='remarks'
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id='remarks'
                                                        placeholder='Remarks'
                                                        className={classnames('form-control')}

                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                    <div className="d-flex">
                                        <Button className="me-1" color="primary" type="submit" >
                                            Submit
                                        </Button>
                                        <Button outline color='secondary' className='me-1' onClick={() => setDiscrepancy(false)}>
                                            Cancel
                                        </Button>
                                    </div>

                                </Row>
                            </Form>

                        </CardBody>
                    </Card></div>
                </ModalBody>
            </Modal>

        </div>
    )
}
export default TableWithData