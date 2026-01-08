import React from 'react';
import { Row, Col, Card, CardBody, CardText, Modal, ModalBody, ModalHeader, Label, Input, Button } from 'reactstrap';
import { FaBed, FaCalendarCheck, FaSignOutAlt } from 'react-icons/fa';
import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "/node_modules/ag-grid-community/styles/ag-grid.css";
import "/node_modules/ag-grid-community/styles/ag-theme-alpine.css";
import Moment from "moment";

import API_URL from '../../../config';

const Dashboard = () => {

    const [ExpectedArrivalCount, setExpectedArrivalCount] = useState(null)
    const [StayOverCount, setStayOverCount] = useState(null)
    const [actualArrivalCount, setActualArrivalCount] = useState(null)
    const [DayUseCount, setDayUseCount] = useState(null)
    const [ExpectedDepartureCount, setExpectedDepartureCount] = useState(null)
    const [ActualDepartureCount, setActualDepartureCount] = useState(null)

    const [rowData, setRowData] = useState([]);
    const [rowDataStayOver, setRowDataStayOver] = useState([]);
    const [rowDataActualArrival, setRowDataActualArrival] = useState([]);
    const [rowDataDayUse, setRowDataDayUse] = useState([]);
    const [rowDataExpectedDeparture, setRowDataExpectedDeparture] = useState([]);
    const [rowDataActualDeparture, setRowDataActualDeparture] = useState([]);


    const [openArrivalModal, setOpenArrivalModal] = useState(false)
    const [openStayOverModal, setOpenStayOverModal] = useState(false)
    const [openActualArrivalModal, setOpenActualArrivalModal] = useState(false)
    const [openDepartureModal, setOpenDepartureModal] = useState(false)
    const [openActualDepartureModal, setOpenActualDepartureModal] = useState(false)
    const [openDayUseModal, setOpenDayUseModal] = useState(false)


    const gridRef = useRef();


    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "BookingID",
            field: "bookingID",
            suppressSizeToFit: true,
            width: 120,
        },
        {
            headerName: "Guest Name",
            field: "guestName",
            suppressSizeToFit: true,
            width: 200,
        },
        {
            headerName: "Company",
            field: "accountName",
            suppressSizeToFit: true,
            width: 200,
        },
        {
            headerName: "Arrival",
            field: "arrivalDate",
            suppressSizeToFit: true,
            maxWidth: 140,
            cellRenderer: (params) => {
                // Ensure the arrivalDate field exists in the row data        
                if (params.data && params.data.arrivalDate) {
                    // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
                    const formattedDate = Moment(params.data.arrivalDate).format("DD.MM.YYYY");
                    return formattedDate;
                } else {
                    return ""; // Handle cases where the data is missing or invalid        
                }
            },
        },
        {
            headerName: "Departure",
            field: "departureDate",
            suppressSizeToFit: true,
            maxWidth: 140,
            cellRenderer: (params) => {
                if (params.data && params.data.departureDate) {
                    const formattedDate = Moment(params.data.departureDate).format("DD.MM.YYYY");
                    return formattedDate;
                } else {
                    return ""; // Handle cases where the data is missing or invalid        
                }
            },
        },
        {
            headerName: "Room Type",
            field: "roomType",
            suppressSizeToFit: true,
            maxWidth: 130, 
        },
        {
            headerName: "Status",
            field: "reservationStatus",
            suppressSizeToFit: true,
            maxWidth: 130,
        },
        {
            headerName: "SubBookingID",
            field: "subBookingID",
            suppressSizeToFit: true,
            width: 150,
        },
        {
            headerName: "Room No.",
            field: "roomNumber",
            suppressSizeToFit: true,
            width: 130,
        },
        {
            headerName: "Market Code",
            field: "marketCode",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
        {
            headerName: "Source Code",
            field: "sourceCode",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
        {
            headerName: "Rate Code",
            field: "rateCode",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
        {
            headerName: "Origin",
            field: "origin",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
    ]);


    useEffect(() => {

        // Expected Arrivals
        fetchx(API_URL + "/getExpectedArrivals", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json())
        .then(postres => {
            setExpectedArrivalCount(postres['data'][0]['expected_arrival'] || 0)
            setRowData(postres['data'])
        })


        // Stay over
        fetchx(API_URL + "/getStayOversForFrontdesk", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json())
        .then(postres => {
            setStayOverCount(postres['data'][0]['expected_arrival'] || 0)
            setRowDataStayOver(postres['data'])
        })


        // Actual Arrivals
        fetchx(API_URL + "/getActualArrivals", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json())
        .then(postres => {
            setActualArrivalCount(postres['data'][0]['expected_arrival'] || 0)
            setRowDataActualArrival(postres['data'])
        })


        // Expected Departures
        fetchx(API_URL + "/getExpectedDepartures", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json())
        .then(postres => {
            setExpectedDepartureCount(postres['data'][0]['expected_arrival'] || 0)
            setRowDataExpectedDeparture(postres['data'])
        })


        // Day use
        fetchx(API_URL + "/getDayUseReservation", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json())
        .then(postres => {
            setDayUseCount(postres['data'][0]['expected_arrival'] || 0)
            setRowDataDayUse(postres['data'])
        })


        // Actual Departures
        fetchx(API_URL + "/getActualDepartures", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json())
        .then(postres => {
            setActualDepartureCount(postres['data'][0]['expected_arrival'] || 0)
            setRowDataActualDeparture(postres['data'])
        })

    }, []);


    const getRowStyle = params => {
        if (params.data && params.data.reservationStatus === 'Cancelled') {
            return { background: '#3598db' };
        }
        else if (params.data && params.data.subBookingID !== null && params.data.subBookingID !== '0') {
            return { background: '#f1c40f' };
        }
        return null;
    };


    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        autoHeight: true,
        wrapText: true,
        filterParams: {
            buttons: ["apply", "reset"],
        },
    }));


    const cellClickedListener = useCallback((event) => {
    })


    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById("filter-text-box").value
        );
    }, []);

    
    return (
        <div>


<Row>
 
  <Col lg='4' md='12'>
  <Card className='mb-1' style={{ maxHeight: '120px' }}>
    <CardBody className='text-center' style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <FaBed size={30} color='#7367f0' className='mb-2' style={{ cursor: 'pointer' }} onClick={() => setOpenStayOverModal(!openStayOverModal)}/><br></br>
        <CardText className='font-weight-bold' style={{ fontSize: '16px', color: '#000000', marginLeft: '5px' }}><strong>Stayover {StayOverCount || 0}</strong></CardText>
      </div>
    </CardBody>
  </Card>
</Col>


<Col lg='4' md='12'>
  <Card className='mb-1' style={{ maxHeight: '120px' }}>
    <CardBody className='text-center' style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <FaCalendarCheck size={30} color='#7367f0' className='mb-2' style={{ cursor: 'pointer' }} onClick={() => setOpenArrivalModal(!openArrivalModal)} />
        <CardText className='font-weight-bold' style={{ fontSize: '16px', color: '#000000', marginLeft: '5px' }}> <strong>Arrivals Expected {ExpectedArrivalCount || 0} </strong></CardText>
      </div>
      {/* <CardText style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{ExpectedArrivalCount || 0}</CardText> */}
    </CardBody>
  </Card>
</Col>

<Col lg='4' md='12'>
  <Card className='mb-1' style={{ maxHeight: '120px' }}>
    <CardBody className='text-center' style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <FaCalendarCheck size={30} color='#7367f0' className='mb-2' style={{ cursor: 'pointer' }} onClick={() => setOpenActualArrivalModal(!openActualArrivalModal)}/>
        <CardText className='font-weight-bold' style={{ fontSize: '16px', color: '#000000', marginLeft: '5px' }}><strong>Arrivals Actual {actualArrivalCount || 0}</strong></CardText>
      </div>
      {/* <CardText style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{actualArrivalCount || 0}</CardText> */}
    </CardBody>
  </Card>
</Col>

</Row>

            {/* <Row>
                <Col lg='4' md='12'>
                    <Card className='mb-1' >
                        <CardBody className='text-center'>
                            <FaBed size={30} color='#7367f0' className='mb-2' style={{ cursor: 'pointer' }} onClick={() => setOpenDayUseModal(!openDayUseModal)}/>
                            <CardText className='font-weight-bold' style={{ fontSize: '16px', color: '#000000' }}><strong>Day Use Rooms (Included In Arrival)</strong></CardText>
                            <CardText style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{DayUseCount || 0}</CardText>


                        </CardBody>
                    </Card>

                </Col>


                <Col lg='4' md='12'>
                    <Card className='mb-1'>
                        <CardBody className='text-center'>
                            <FaSignOutAlt size={30} color='#7367f0' className='mb-2' style={{ cursor: 'pointer' }} onClick={() => setOpenDepartureModal(!openDepartureModal)}/>
                            <CardText className='font-weight-bold' style={{ fontSize: '16px', color: '#000000' }}><strong>Departures Expected</strong></CardText>
                            <CardText style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{ExpectedDepartureCount || 0}</CardText>
                        </CardBody>
                    </Card>
                </Col>


                <Col lg='4' md='12'>
                    <Card className='mb-1'>
                        <CardBody className='text-center'>
                            <FaSignOutAlt size={30} color='#7367f0' className='mb-2' style={{ cursor: 'pointer' }} onClick={() => setOpenActualDepartureModal(!openActualDepartureModal)}/>
                            <CardText className='font-weight-bold' style={{ fontSize: '16px', color: '#000000' }}><strong>Departures Actual</strong></CardText>
                            <CardText style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{ActualDepartureCount || 0}</CardText>

                        </CardBody>
                    </Card>
                </Col>
            </Row> */}

{/* <Row>
  <Col lg='4' md='12'>
    <Card className='mb-1' style={{ maxHeight: '120px' }}>
      <CardBody className='text-center' style={{ padding: '10px' }}>
        <FaBed size={30} color='#7367f0' className='mb-2' style={{ cursor: 'pointer' }} onClick={() => setOpenDayUseModal(!openDayUseModal)}/>
        <CardText className='font-weight-bold' style={{ fontSize: '16px', color: '#000000' }}><strong>Day Use Rooms (Included In Arrival)</strong></CardText>
        <CardText style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{DayUseCount || 0}</CardText>
      </CardBody>
    </Card>
  </Col>

  <Col lg='4' md='12'>
    <Card className='mb-1' style={{ maxHeight: '120px' }}>
      <CardBody className='text-center' style={{ padding: '10px' }}>
        <FaSignOutAlt size={30} color='#7367f0' className='mb-2' style={{ cursor: 'pointer' }} onClick={() => setOpenDepartureModal(!openDepartureModal)}/>
        <CardText className='font-weight-bold' style={{ fontSize: '16px', color: '#000000' }}><strong>Departures Expected</strong></CardText>
        <CardText style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{ExpectedDepartureCount || 0}</CardText>
      </CardBody>
    </Card>
  </Col>

  <Col lg='4' md='12'>
    <Card className='mb-1' style={{ maxHeight: '120px' }}>
      <CardBody className='text-center' style={{ padding: '10px' }}>
        <FaSignOutAlt size={30} color='#7367f0' className='mb-2' style={{ cursor: 'pointer' }} onClick={() => setOpenActualDepartureModal(!openActualDepartureModal)}/>
        <CardText className='font-weight-bold' style={{ fontSize: '16px', color: '#000000' }}><strong>Departures Actual</strong></CardText>
        <CardText style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{ActualDepartureCount || 0}</CardText>
      </CardBody>
    </Card>
  </Col>
</Row> */}


<Row>
  <Col lg='4' md='12'>
    <Card className='mb-1' style={{ maxHeight: '120px' }}>
      <CardBody className='text-center' style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <FaBed size={28} color='#7367f0' className='mb-2' style={{ cursor: 'pointer' }} onClick={() => setOpenDayUseModal(!openDayUseModal)}/>
          <CardText className='font-weight-bold' style={{ fontSize: '16px', color: '#000000', marginLeft: '5px' }}><strong>Day Use Rooms (Incl. In Arrival) {DayUseCount || 0}</strong></CardText>
        </div>
        {/* <CardText style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{DayUseCount || 0}</CardText> */}
      </CardBody>
    </Card>
  </Col>


  <Col lg='4' md='12'>
    <Card className='mb-1' style={{ maxHeight: '120px' }}>
      <CardBody className='text-center' style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <FaSignOutAlt size={28} color='#7367f0' className='mb-2' style={{ cursor: 'pointer' }} onClick={() => setOpenDepartureModal(!openDepartureModal)}/>
          <CardText className='font-weight-bold' style={{ fontSize: '16px', color: '#000000', marginLeft: '5px' }}><strong>Departures Expected {ExpectedDepartureCount || 0}</strong></CardText>
        </div>
        {/* <CardText style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{ExpectedDepartureCount || 0}</CardText> */}
      </CardBody>
    </Card>
  </Col>

  <Col lg='4' md='12'>
    <Card className='mb-1' style={{ maxHeight: '120px' }}>
      <CardBody className='text-center' style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <FaSignOutAlt size={28} color='#7367f0' className='mb-2' style={{ cursor: 'pointer' }} onClick={() => setOpenActualDepartureModal(!openActualDepartureModal)}/>
          <CardText className='font-weight-bold' style={{ fontSize: '16px', color: '#000000', marginLeft: '5px' }}><strong>Departures Actual {ActualDepartureCount || 0}</strong></CardText>
        </div>
        {/* <CardText style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{ActualDepartureCount || 0}</CardText> */}
      </CardBody>
    </Card>
  </Col>
</Row>

            <Modal
                isOpen={openArrivalModal}
                toggle={() => setOpenArrivalModal(!openArrivalModal)}
                style={{ maxWidth: '1400px', maxHeight: '70vh' }}
            >
                <ModalHeader toggle={() => setOpenArrivalModal(!openArrivalModal)} className='bg-transparent'></ModalHeader>
                <ModalBody className='px-sm-4'>

                <div>
                <Col md="3" sm="12" className="mb-1">
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

                    <div className="ag-theme-alpine" style={{ height: 550 }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            animateRows={true}
                            getRowStyle={getRowStyle}
                            rowSelection="multiple"
                            onCellClicked={cellClickedListener}
                            paginationAutoPageSize="true"
                            paginationPageSize="10"
                            pagination="true"
                            defaultColDef={defaultColDef}
                            headerColor="ddw-primary"
                        />
                    </div>
                </ModalBody>
            </Modal>


            <Modal
                isOpen={openStayOverModal}
                toggle={() => setOpenStayOverModal(!openStayOverModal)}
                style={{ maxWidth: '1400px', maxHeight: '70vh' }}
            >
                <ModalHeader toggle={() => setOpenStayOverModal(!openStayOverModal)} className='bg-transparent'></ModalHeader>
                <ModalBody className='px-sm-4'>

                <div>
                <Col md="3" sm="12" className="mb-1">
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

                    <div className="ag-theme-alpine" style={{ height: 550 }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowDataStayOver}
                            columnDefs={columnDefs}
                            animateRows={true}
                            getRowStyle={getRowStyle}
                            rowSelection="multiple"
                            onCellClicked={cellClickedListener}
                            paginationAutoPageSize="true"
                            paginationPageSize="10"
                            pagination="true"
                            defaultColDef={defaultColDef}
                            headerColor="ddw-primary"
                        />
                    </div>
                </ModalBody>
            </Modal>


            <Modal
                isOpen={openActualArrivalModal}
                toggle={() => setOpenActualArrivalModal(!openActualArrivalModal)}
                style={{ maxWidth: '1400px', maxHeight: '70vh' }}
            >
                <ModalHeader toggle={() => setOpenActualArrivalModal(!openActualArrivalModal)} className='bg-transparent'></ModalHeader>
                <ModalBody className='px-sm-4'>

                <div>
                <Col md="3" sm="12" className="mb-1">
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

                    <div className="ag-theme-alpine" style={{ height: 550 }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowDataActualArrival}
                            columnDefs={columnDefs}
                            animateRows={true}
                            getRowStyle={getRowStyle}
                            rowSelection="multiple"
                            onCellClicked={cellClickedListener}
                            paginationAutoPageSize="true"
                            paginationPageSize="10"
                            pagination="true"
                            defaultColDef={defaultColDef}
                            headerColor="ddw-primary"
                        />
                    </div>
                </ModalBody>
            </Modal>


            <Modal
                isOpen={openDepartureModal}
                toggle={() => setOpenDepartureModal(!openDepartureModal)}
                style={{ maxWidth: '1400px', maxHeight: '70vh' }}
            >
                <ModalHeader toggle={() => setOpenDepartureModal(!openDepartureModal)} className='bg-transparent'></ModalHeader>
                <ModalBody className='px-sm-4'>

                <div>
                <Col md="3" sm="12" className="mb-1">
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

                    <div className="ag-theme-alpine" style={{ height: 550 }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowDataExpectedDeparture}
                            columnDefs={columnDefs}
                            animateRows={true}
                            getRowStyle={getRowStyle}
                            rowSelection="multiple"
                            onCellClicked={cellClickedListener}
                            paginationAutoPageSize="true"
                            paginationPageSize="10"
                            pagination="true"
                            defaultColDef={defaultColDef}
                            headerColor="ddw-primary"
                        />
                    </div>
                </ModalBody>
            </Modal>


            <Modal
                isOpen={openActualDepartureModal}
                toggle={() => setOpenActualDepartureModal(!openActualDepartureModal)}
                style={{ maxWidth: '1400px', maxHeight: '70vh' }}
            >
                <ModalHeader toggle={() => setOpenActualDepartureModal(!openActualDepartureModal)} className='bg-transparent'></ModalHeader>
                <ModalBody className='px-sm-4'>

                <div>
                <Col md="3" sm="12" className="mb-1">
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

                    <div className="ag-theme-alpine" style={{ height: 550 }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowDataActualDeparture}
                            columnDefs={columnDefs}
                            animateRows={true}
                            getRowStyle={getRowStyle}
                            rowSelection="multiple"
                            onCellClicked={cellClickedListener}
                            paginationAutoPageSize="true"
                            paginationPageSize="10"
                            pagination="true"
                            defaultColDef={defaultColDef}
                            headerColor="ddw-primary"
                        />
                    </div>
                </ModalBody>
            </Modal>


            <Modal
                isOpen={openDayUseModal}
                toggle={() => setOpenDayUseModal(!openDayUseModal)}
                style={{ maxWidth: '1400px', maxHeight: '70vh' }}
            >
                <ModalHeader toggle={() => setOpenDayUseModal(!openDayUseModal)} className='bg-transparent'></ModalHeader>
                <ModalBody className='px-sm-4'>

                <div>
                <Col md="3" sm="12" className="mb-1">
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

                    <div className="ag-theme-alpine" style={{ height: 550 }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowDataDayUse}
                            columnDefs={columnDefs}
                            animateRows={true}
                            getRowStyle={getRowStyle}
                            rowSelection="multiple"
                            onCellClicked={cellClickedListener}
                            paginationAutoPageSize="true"
                            paginationPageSize="10"
                            pagination="true"
                            defaultColDef={defaultColDef}
                            headerColor="ddw-primary"
                        />
                    </div>
                </ModalBody>
            </Modal>

        </div>
    );
};

export default Dashboard;