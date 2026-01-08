import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Col, Row, Button, Card, CardBody, CardTitle, CardHeader, Modal, ModalBody, ModalHeader, ModalFooter, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, Input } from 'reactstrap'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import "../../dashboard/testFrontDesk/frontDesk.scss";
import VisaDetails from './visaDetails'; //./../dashboard/testFrontDesk
import GuestProfile from './editGuestDetails'
import { format } from "date-fns";
import API_URL from '../../../config';
import CancelReservation from './cancelReservation';
import StayModification from '../../../views/dashboard/testFrontDesk/stayNotification'
// import ActionModal from './actionModal'
import { useNavigate } from 'react-router-dom'
import { AiOutlineCheckCircle } from 'react-icons/ai';
// import { ComponentResolver } from 'ag-grid/dist/lib/components/framework/componentResolver';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import Moment from 'moment';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import { param } from 'jquery'
import Select from 'react-select';
















localStorage.removeItem('reservationID')

const PillFilled = () => {
    const [startNightAudit, setStartNightAudit] = useState(false)
    const [modalOpen, setModalOpen] = useState(false);
    const [active, setActive] = useState();
    const [getNightAudit, setGetNightAudit] = useState();
    const [Today, setToday] = useState()
    const [open, setOpen] = useState(false);
    const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);

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
        let columnsToUpdate = JSON.stringify({
            date: Today,
            hotelID: 1
        })
        console.log(columnsToUpdate)
        fetchx(API_URL + "/getNightAuditCheck", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: columnsToUpdate
        }).then(result => result.json())
            .then(rowData2 => {
                if (rowData2.statusCode === 200) {
                    setGetNightAudit(rowData2.data[0])

                    if (rowData2 && rowData2.length !== 0 && rowData2.data.length !== 0 && rowData2.data[0].startedNightAudit === "1") {
                        setStartNightAudit(true)

                        setActive(active === undefined ? '4' : active)
                    }

                    if (rowData2.data.length !== 0 && rowData2.data[0]['rollingBusinessDate'] === '1') {

                        // setDisableCountry(true)
                        // setDisableArrival(true)
                        // setDisableDeparture(true)
                        // setDisableRoomPosting(true)
                        // setDisableFixedPosting(true)
                        // setDisableRoomStatus(true)
                        // setDisableReservationStatus(false)
                        handleError("Night Audit Already Completed !!")
                    }
                }
            })

        // }

    }, [active, Today]);


    function AddToNightAudit() {
        let getDailyDetails = JSON.stringify({
            hotelID: 1,
            startedNightAudit: 1,
            CountryCheck: 0,
            arrivalPending: 0,
            departurePending: 0,
            roomStatusCheck: 0,
            rollingBusinessDate: 0,
            fixedChargePosting: 0,
            roomPosting: 0,
            printingReports: 0,
            reservationStatusCheck: 0,
            unSettleBills: 0
        })
        fetchx(API_URL + "/addToNightAudit", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: getDailyDetails
        }).then(result => result.json())
            .then(rowData => {
                console.log(rowData)
            })
    }



    const toggle = tab => {
        setActive(tab)
    }

    function RefreshFunction() {
            console.log('RefreshFunction called');
    
            let getDailyDetails = JSON.stringify({
                hotelID: 1
            })
            fetchx(API_URL + "/checkCountryNightAudit", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: getDailyDetails
            }).then(result => result.json())
                .then(rowData => {
                    if (rowData.statusCode === 200) {
    
                        setRowData(rowData['data'])
                        let getDailyDetails = JSON.stringify({
                            countryAndStateCheck: 1
                        })
                        fetchx(API_URL + "/updateNightAudit?date=" + Today, {
                            method: "PUT",
                            headers: { 'Content-Type': 'application/json' },
                            body: getDailyDetails
                        }).then(result => result.json())
                            .then(rowData2 => {
                                console.log(rowData2)
                                if (rowData.statusCode === 200) {
                                    // setActive('2')
                                    // setDisableCountry(true)
                                    // setDisableArrival(false)
    
                                }
                            })
                    }
                })
    
            fetchx(API_URL + '/getReservationForFrontDeskToday?Start=' + Today)
                .then(result => result.json())
                .then(rowData => {
                    if (rowData.statusCode === 200) {
                        console.log("Called")
                        setPendingArr(rowData['data'])
                    }
                })
    
            fetchx(API_URL + '/getReservationForFrontDeskDeparturesNewNightAudit?End=' + Today)
                .then(result => result.json())
                .then(rowData => {
                    if (rowData.statusCode === 200) {
    
                        setPendingDep(rowData['data'])
                    }
                })
    
            let unSettleData = JSON.stringify({
                hotelID: 1
            })
            fetchx(API_URL + "/getPOSUnsettledOrders", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: unSettleData
            }).then(result => result.json())
                .then(rowData => {
                    if (rowData.statusCode === 200) {
    
                        setUnSettleBills(rowData['data'])
                    }
                })
    
    
            if (shouldApplyRowStyle === true) {
                // setConfirmRoomPostingLastStep(true)
                fetch(API_URL + "/GetRoomChargesPostedForReservation")
                    .then(result => result.json())
                    .then(rowData => {
                        if (rowData.statusCode === 200) {
                            condition = false
    
                            setRoomPostingCheck(rowData['data'])
                            setConfirmRoomPosting(false)
                        }
                    })
    
            }
            else {
                let unAssign = JSON.stringify({
                    hotelID: 1
                });
                let res = fetch(API_URL + "/getRoomPostings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: unAssign,
                }).then(result => result.json())
                    .then(rowData => {
                        condition = true
                        if (rowData.statusCode === 200) {
                            setRoomPosting(rowData['data'])
                        }
                    })
            }
    
            fetchx(API_URL + "/GetRoomChargesPostedForReservation")
                .then(result => result.json())
                .then(rowData => {
                    if (rowData.statusCode === 200) {
    
                        condition = false
    
                        setRoomPostingCheck(rowData['data'])
                        setOpen(false);
                        setConfirmRoomPosting(false)
                    }
                })
    
    
            fetchx(API_URL + "/getFixedChargesForDay?hotelID=1&date=" + Today)
                .then(result => result.json())
                .then(rowData => {
                    console.log(rowData)
                    if (rowData.statusCode === 200) {
    
                        setFixedCharge(rowData['data'])
                    }
                })
    
            let getDailyDetail = JSON.stringify({
                hotelID: 1,
                CheckUpdate: 0,
            })
            //   fetchx(API_URL + "/updateRoomStatusInNightAudit", {
            fetchx(API_URL + "/updateRoomStatusInNightAudit", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: getDailyDetail
            }).then(result => result.json())
                .then(rowData => {
                    if (rowData.statusCode === 200) {
                        setRoomStatus(rowData['data'])
                    }
                })
    
        }


    return (
        <div>
            {startNightAudit === false &&
                <div className="bg-white min-vh-100 d-flex justify-content-center align-items-center">
                    <Card className="w-50 text-center p-4 shadow-lg rounded">
                        <CardBody>
                            <h4 >Start Night Audit Process</h4>
                            <div>
                                <Button color="primary" onClick={() => setModalOpen(true)}>
                                    Start
                                </Button>{' '}
                            </div>
                        </CardBody>
                    </Card>
                    <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} centered>
                        <ModalHeader toggle={() => setModalOpen(!modalOpen)} className="text-center">
                            Night Audit Confirmation
                        </ModalHeader>
                        <ModalBody className="text-center">
                            <h4> <b> Confirm to start Night Audit</b></h4>
                        </ModalBody>
                        <ModalFooter className="justify-content-center">
                            {/* <Button color="primary" onClick={() => (setStartNightAudit(true), setActive('1'), AddToNightAudit())}> */}
                            <Button color="primary" onClick={() => (setStartNightAudit(true), setActive('4'), AddToNightAudit())}>
                                Confirm
                            </Button>
                            <Button color="secondary" onClick={() => setModalOpen(!modalOpen)}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>
            }


{console.log("startNightAudit", startNightAudit)}
            {startNightAudit == true &&
                <div className="container-fluid">

                    <div className="row">
                        <div className="col">
                            <Nav pills fill style={{ overflowX: 'auto' }}>
                                <NavItem style={{ flex: 1 }}>
                                    <NavLink
                                        active={active === '1'}
                                        onClick={() => {
                                            toggle('1')
                                        }}
                                    // disabled={disableUnSettleBillData}

                                    >
                                        POS Pending Bills
                                    </NavLink>
                                    {getNightAudit && getNightAudit.unSettleBills === '1' && <AiOutlineCheckCircle
                                        style={{
                                            fontSize: '24px',
                                            color: 'green',
                                        }}
                                        className="attractive-checkmark" />}
                                </NavItem>

                            </Nav>
                        </div>
                    </div>
                </div>

            }



                {/* Un-Settle Bills */}
                <TabContent className='py-50' activeTab={active}>

                    <TabPane tabId='4' style={{ marginTop: '-77px' }}>
                        <Card>
                            <CardHeader>
                                {/* <CardTitle tag="h4">Un-Settled Bills</CardTitle> */}
                                <CardTitle tag="h4">POS Unsettled Bills</CardTitle>
                                <Button outline color="primary" onClick={RefreshFunction}>
                                    <span style={{ marginRight: '8px' }}>↻</span>
                                    Refresh
                                </Button>
                                {/* <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'black', paddingLeft: '10%' }}>
                                            Please verify if there are any pending room postings for the date :- {Today !== undefined && format(new Date(Today), 'E MMM dd yyyy')}
                                        </div> */}
                            </CardHeader>
                          

                        </Card>
                    </TabPane>
                </TabContent>


        </div>
    )
}
export default PillFilled