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

        let unSettleData = JSON.stringify({
            hotelID: 1
        })
        fetchx(API_URL + "/getPOSUnsettledOrders", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: unSettleData
        }).then(result => result.json())
            .then(rowData => {
                setUnSettleBills(rowData['data'])
                if (rowData['data'].length === 0) {

                    // setActive('5')
                    let getDailyDetails = JSON.stringify({
                        unSettleBills: 1
                    })
                    fetchx(API_URL + "/updateNightAudit?date=" + Today, {
                        method: "PUT",
                        headers: { 'Content-Type': 'application/json' },
                        body: getDailyDetails
                    }).then(result => result.json())
                        .then(rowData2 => {
                            console.log(rowData2)
                            if (rowData.statusCode === 200) {
                                // setDisableUnsettleBillData(true)
                                // setDisableRoomPosting(false)
                                // setActive('5')

                            }
                        })
                }

            })

    }, []);

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
     
                    <Card>
             
                        <CardBody>
                            <div>
                                <div className="ag-theme-alpine" style={{ height: 450 }}>
                                    <AgGridReact
                                        ref={gridRef6}
                                        rowData={unSettleBills} columnDefs={columnDefs6}
                                        animateRows={true} rowSelection='multiple'
                                        onCellClicked={cellClickedUnSettleBills}
                                        //  paginationAutoPageSize='true'
                                        paginationPageSize='10'
                                        pagination='true'
                                        overlayNoRowsTemplate={'No records found'}
                                        defaultColDef={defaultColDef6}
                                        headerColor="ddw-primary"

                                    />
                                </div>
                            </div>
                            <br></br>
                            <div align='end'>
                                <Button className='me-1' color='primary' align='end'
                                    // onClick={() => { (unSettleBills !== undefined && unSettleBills.length === 0) ? setActive('5') : handleError("Complete Existing Process") }}
                                    onClick={() => {
                                        if (unSettleBills !== undefined && unSettleBills.length === 0) {
                                            // setActive('5');
                                            // setActive('1');
                                            // setDisableCountry(false)

                                            // setDisableUnsettleBillData(true);
                                            // setDisableRoomPosting(false);
                                        } else {
                                            handleError("Complete Existing Process");
                                        }
                                    }}
                                >
                                    Proceed
                                </Button>
                            </div>
                        </CardBody>

                    </Card>
       



        </div>
    )
}
export default PillFilled