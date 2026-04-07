
// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { format } from "date-fns";
import { Card, CardHeader, CardText, CardTitle, Label, Col, Input, Row, Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import API_URL from '../../../config';
import { useForm, Controller } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import Moment from 'moment';
import classnames from "classnames";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import { useNavigate } from 'react-router-dom';
import UnAssignRoom from '../testFrontDesk/unAssign';
import AssignRoom from '../testFrontDesk/assignRoom';
const id = '1';
const SubMatrix = ({ operation }) => {
    console.log(operation)
    let navigate = useNavigate();
    const [rowData, setRowData] = useState();

    const [open, setOpen] = useState(false);
    const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [assign, setAssign] = useState(false)
    const [filldata, setfilldata] = useState('')
    const [unAssign, setUnAssign] = useState()

    const gridRef = useRef();


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

    const handleSuccess = (message) => {
        return MySwal.fire({
            title: message.title,
            text: message.text,
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        })
    }


    const BookingIdRenderer = (params) => {
        return (
            // <div style={{ display: 'flex', alignItems: 'start', gap: '4px' }}>
            <div style={{ alignItems: 'start' }}>
                {params.data?.hasMembership === 1 ? (
                    <>
                        {/* <Star style={{
            height: '20px',
            width: '20px',
  
          }}/> */}
                        <span style={{
                            backgroundColor: '#000',
                            color: '#FFD700',
                            padding: '5px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            marginRight: '10px'

                        }}>
                            OX
                        </span>
                        <span>{params.value}</span>
                    </>

                ) : <span>{params.value}</span>}
            </div>
        );
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

    const cellClickedListener = useCallback(event => {
        console.log('cellClicked', event);

    }, []);

    const fetchData = () => {
        setOpen(true)
        setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);
        let confirmRate = JSON.stringify({
            operation: operation
        })
        console.log(confirmRate)
        fetchx(API_URL + "/getAutoAssignRooms", {
            // fetchx("http://122.166.2.21:14702/getOccupancyRoomWise", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: confirmRate
        }).then(result => result.json())
            .then(res => {
                if (res.statusCode === 200) {
                    setRowData(res['data'])
                    console.log(res['data'])
                    setOpen(false)
                }
                else {
                    setOpen(false)
                }
            }, []);

        // })
    }

    useEffect(() => {
        fetchData()
    }, []);



    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "B_ID",
            field: "bookingID",
            valueGetter: (params) => {
                if (params.data && params.data.bookingID && params.data.isMain === 0) {
                    return `${params.data.bookingID}*`;
                }
                return params.data.bookingID;
            },
            cellRenderer: (params) => {
                if (!params.data) return null;

                return (
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            whiteSpace: "nowrap",
                        }}
                    >
                        <>
                            <span>{params.data.bookingID}</span>
                            {params.data.isWebCheckIn === 1 && (
                                <img
                                    src="/src/assets/images/icons/webCheckin.png"
                                    alt="secondary"
                                    style={{ width: "40px", height: "25px" }}
                                />
                            )}
                        </>
                    </div>
                );
            },

            suppressSizeToFit: true,
            maxWidth: 140,
            filter: 'agTextColumnFilter'
        },
        {
            headerName: "Guest",
            field: "guestName",
            suppressSizeToFit: true,
            style: { marginLeft: '-2px' },
            maxWidth: 150,
            cellRenderer: BookingIdRenderer
        },
        {
            headerName: "Comp/Agent",
            field: "accountName",
            suppressSizeToFit: true,
            maxWidth: 132,
        },
        {
            headerName: "Arrival",
            field: "arrivalDate",
            suppressSizeToFit: true,
            maxWidth: 120,
            cellRenderer: (params) => {
                if (params.data && params.data.arrivalDate) {
                    const formattedDate = format(new Date(params.data.arrivalDate), 'dd MMM yy');
                    return formattedDate;
                } else {
                    return "";
                }
            }
        },
        {
            headerName: "Departure",
            field: "departureDate",
            suppressSizeToFit: true,
            maxWidth: 120,
            cellRenderer: (params) => {
                if (params.data && params.data.departureDate) {
                    const formattedDate = format(new Date(params.data.departureDate), 'dd MMM yy');
                    return formattedDate;
                } else {
                    return "";
                }
            }
        },
        {
            headerName: 'Room No.', field: 'autoAssignRoom', suppressSizeToFit: true, maxWidth: 120, cellStyle: params => {
                let borderColor = 'transparent'; // Default color for the border

                if (params.data.roomStatus === "Inspected") {
                    borderColor = '#28C76F'; // Blue color
                } else if (params.data.roomStatus === 'Dirty') {
                    borderColor = '#E34E4E'; // Red color
                } else if (params.data.roomStatus === 'Clean') {
                    borderColor = '#3C5EFC'; // Yellow color
                } else if (params.data.roomStatus === 'Occupied') {
                    borderColor = '#3C5EFC'; // Yellow color
                } else if (params.data.roomStatus === 'Out Of Order') {
                    borderColor = '#82868b'; // Yellow color
                } else if (params.data.roomStatus === 'Out Of Service') {
                    borderColor = '#D0AD0F'; // Yellow color
                }

                return {
                    backgroundColor: borderColor,
                    // borderLeft: `5px solid ${borderColor}`,
                    // paddingLeft: '10px', // Add some left padding to separate content from border
                };
            },

        },

        {
            headerName: "Status",
            field: "reservationStatus",
            suppressSizeToFit: true,
            minWidth: 80,

        },

        {
            headerName: "Actions",
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 130 }}
                    onClick={async () => {
                        try {
                            // Fetch data based on reservationID
                            const reservationID = params.data.id;
                            const response = await fetch(API_URL + `/getReservationForFrontDeskByResID?reservationID=${reservationID}`);
                            const rowData = await response.json();

                            // Update state with fetched data

                            setfilldata(rowData.data[0]);
                            if (rowData.data[0].room !== null) {
                                handleError(
                                    "Room is already assigned. Please unassign the room first"
                                );
                            } else {
                                setAssign(!assign)
                            }
                          
                        } catch (error) {
                            console.error("Error fetching reservation data:", error);
                        }
                    }}
                >
                    Assign Room
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            width: 140
        },
        {
            headerName: "Actions",
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 154 }}
                    onClick={async () => {
                        try {
                            // Fetch data based on reservationID
                            const reservationID = params.data.id;
                            const response = await fetch(API_URL + `/getReservationForFrontDeskByResID?reservationID=${reservationID}`);
                            const rowData = await response.json();

                            // Update state with fetched data

                            setfilldata(rowData.data[0]);
                            if (rowData.data[0].room === null) {
                                handleError(
                                    "Assign the room first"
                                );
                            } else {
                                setUnAssign(!unAssign)
                            }
                        ;
                        } catch (error) {
                            console.error("Error fetching reservation data:", error);
                        }
                    }}
                >
                    Un-Assign Room
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            width: 160
        },

        {
            headerName: "R_Type/No.Rms",
            field: "roomTypeRooms",
            valueGetter: (params) => {
                const roomType = params.data.roomType ? params.data.roomType : '';
                const numberOfRooms = params.data.numberOfRooms ? params.data.numberOfRooms : '';
                return `${roomType} - ${numberOfRooms}`;
            },
            suppressSizeToFit: true,
            maxWidth: 152,
        },
        {
            headerName: "SubID",
            field: "subBookingID",
            suppressSizeToFit: true,
            maxWidth: 90,
        },
        {
            headerName: "Grp ID",
            field: "blockCodeID",
            suppressSizeToFit: true,
            maxWidth: 94,
        },
        // {
        //   headerName: "Rooms",
        //   field: "numberOfRooms",
        //   suppressSizeToFit: true,
        //   maxWidth: 96,
        // },
        {
            headerName: "Market",
            field: "marketCode",
            suppressSizeToFit: true,
            maxWidth: 110,
        },
        {
            headerName: "Source",
            field: "sourceCode",
            suppressSizeToFit: true,
            maxWidth: 110,
        },
        {
            headerName: "Created By",
            field: "createdByName",
            suppressSizeToFit: true,
            maxWidth: 132,
        },
        {
            headerName: "Created At",
            field: "createdAt",
            suppressSizeToFit: true,
            maxWidth: 170,
        },
    ]);




    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.setQuickFilter(
            document.getElementById('filter-text-box4').value
        );
    }, []);


    const handleAutoAssign = () => {

        const allRoomsEmpty = rowData?.every(
            row => !row.autoAssignRoom || row.autoAssignRoom === ""
        );

        if (allRoomsEmpty) {
            handleError("No rooms assigned. Please check room type and availability.");
            return;
        }


        setOpen(true)
        let createExtra = JSON.stringify({
            operation: operation

        });
        setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);
        let res = fetchx(API_URL + "/autoAssignRooms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: createExtra,
        })
            .then(result => result.json())
            .then((res) => {
                // navigate('');

                if (res.statusCode === 200) {
                    setOpen(false)
                    fetchData()
                    setOpenConfirm(false)
                    navigate()
                    handleSuccess({ title: "Auto Assign Successful", text: "Rooms have been assigned successfully." })
                } else {
                    setOpen(false)
                    console.log(res)
                    handleError(res.message)
                }


            });


    };


    function toggleModal(data) {
        if (data === 'assigned') {

            setAssign(false)
        }
        if (data === 'unassign') {
            setUnAssign(false)

        }
        if (data === 'assignedDuringCheckIn') {
            setAssign(false)
        }

    }


    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag="h4"><b>Automatic Room Assignment Preview </b></CardTitle>
                </CardHeader>

            </Card>
            <Row>
                <Col md='3' sm='12' className='mb-1'>
                    <Label className='form-label' for='fullName'>
                        Search
                    </Label>
                    <Input
                        type="text"
                        id="filter-text-box4"
                        placeholder="Filter..."
                        onInput={onFilterTextBoxChanged}
                    />
                </Col>
                <Col md='3' sm='12' className='mb-1'>
                    <Button color='primary' onClick={() => setOpenConfirm(true)} style={{ marginTop: '24px' }}>Complete Auto Assign Room</Button>

                </Col>
            </Row>
            <br></br>
            <p style={{ color: 'blue', fontWeight: '' }}>
                If no room number is assigned, rooms are unavailable. Please check room type and availability.
            </p>
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


            <Modal isOpen={openConfirm} toggle={() => setOpenConfirm(!openConfirm)} className='modal-dialog-centered'>
                <ModalHeader className='bg-transparent' toggle={() => setOpenConfirm(!openConfirm)}></ModalHeader>
                <ModalBody className='text-center mb-2'>

                    <div className='text-center mb-2'>
                        <h5><b>"Do You Want to Auto Assign Rooms ?"</b></h5>

                        <div className="button-container text-center">
                            <Button className="me-1" color="primary" onClick={handleAutoAssign}>
                                Confirm
                            </Button>
                            <Button className="me-1" color="primary" onClick={() => setOpenConfirm(false)}>
                                Back
                            </Button>

                        </div>
                        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                                    Please wait, data is loading...
                                </h1>
                                {showSecondaryMessage && (
                                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                                        We're processing your request, which may take a little longer due to additional data. Please be patient!
                                    </h1>
                                )}
                                <CircularProgress color="inherit" />
                            </div>
                        </Backdrop>
                    </div>
                </ModalBody>
            </Modal>

            {/* BackDrop For messages */}
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                        Please wait, data is loading...
                    </h1>
                    {showSecondaryMessage && (
                        <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                            We're processing your request, which may take a little longer due to additional data. Please be patient!
                        </h1>
                    )}
                    <CircularProgress color="inherit" />
                </div>
            </Backdrop>


            <div>
                <Modal isOpen={assign} toggle={() => setAssign(!assign)} className='modal-xl'>
                    <ModalHeader className='modal-xl' toggle={() => setAssign(!assign)}></ModalHeader>
                    <ModalBody className='pb-3 px-sm-1 mx-20'>
                        <div>
                            {/* <AssignRoom/> */}
                            {filldata.length != 0 && <AssignRoom data1={filldata} toggleModal={toggleModal} assignUnassign={false} />}
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal isOpen={unAssign} toggle={() => setUnAssign(!unAssign)} className='demo-inline-spacing'>
                    <ModalHeader className='bg-transparent' toggle={() => setUnAssign(!unAssign)}></ModalHeader>
                    <ModalBody className='pb-3 px-sm-1 mx-20'>
                        <div>
                            {filldata.length != 0 && <UnAssignRoom data1={filldata} toggleModal={toggleModal} />}
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        </div>
    );
}

export default SubMatrix;