// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// import './Assettable.css';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Button, Modal, ModalBody, Card, ModalHeader, Row, Col, Label, Input } from 'reactstrap';
// import AssignRoom from './assignRoom';
import RoomMove from '../testFrontDesk/roomMove';
import { Check, Circle, Edit2, PlusCircle, Eye, ArrowRightCircle, AlertTriangle, File } from "react-feather";
// import CancelCheckIn from './cancelCheckIn';
import CancelCheckIn from '../testFrontDesk/cancelCheckIn'
import ForCheckInIdDetails from '../testFrontDesk/forCheckInIdDetails'
import API_URL from '../../../config';
import toast from "react-hot-toast";
import Avatar from "@components/avatar";
import { useNavigate } from 'react-router-dom'
import AddSharer from "../testFrontDesk/addSharer";
import { format } from "date-fns";
import VisaDetails from '../testFrontDesk/visaDetails'
import ERegistrationCard from "../testFrontDesk/esignregistrationCard";
import Confirmation from "../testFrontDesk/confirmationCard";
import PreviewActions from "../testFrontDesk/PreviewActions";
import RegistrationCard from "../testFrontDesk/registrationCard";
import PreviewActionsRegCard from "../testFrontDesk/PreviewActionsRegCard";
import PreviewActionsERegCard from "../testFrontDesk/PreviewERegCard";
import ModifyReservation from "../testFrontDesk/modifyReservation";
import FixedCharges from "../testFrontDesk/fixedCharges"
import Reservation from '../testFrontDesk/reservation'
import ProfileViews from '../testFrontDesk/profileView'
import ReservationInvoice from "../testFrontDesk/ReservationInvoices";
import Alerts from "../testFrontDesk/alerts";


function ActionModal() {
    //Nayana
    var Today = format(new Date(), "yyyy-MM-dd");

    const navigate = useNavigate()
    //Nayana
    const [rowData, setRowData] = useState();
    const [form, setSharer] = useState();
    const [checkIn, setCheckIn] = useState();
    const [show, setShow] = useState();
    const [checkOut, setCheckOut] = useState();
    const [assign, setAssign] = useState();
    const [eregistrationCard, setERegistrationCard] = useState();
    const [filldata, setfilldata] = useState('');
    const [roomMove, setRoomMove] = useState();
    const [options, setOptions] = useState();
    const [cancelCheckIn, setCancelCheckIn] = useState();
    const [popUp, setPopUp] = useState();
    const [addSharer, setAddSharer] = useState(false);
    const [visaDetails, setVisaDetails] = useState();
    const [confirmationCard, setConfirmationCard] = useState();
    const [registrationCard, setRegistrationCard] = useState();
    const [modifyRegistration, setModifyRegistration] = useState();
    const [ConfirmCheckOut, setConfirmCheckOut] = useState(false)
    const [showfixedcharges, setshowfixedcharges] = useState(false)
    const [profileView, setProfileView] = useState();
    const [reservationDetails, setReservation] = useState();
    const [ShowResInvoice, setShowResInvoice] = useState(false)
    const [alerts, setAlerts] = useState();

















    return (
        <div>
            <div>
                <Modal isOpen={roomMove} toggle={() => setRoomMove(!roomMove)} className='modal-xl'>
                    <ModalHeader className='modal-xl' toggle={() => setRoomMove(!roomMove)}></ModalHeader>
                    <ModalBody className='pb-3 px-sm-1 mx-20'>
                        <div>
                            {filldata.length != 0 && <RoomMove data1={filldata} />}
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={visaDetails}
                    toggle={() => setVisaDetails(!visaDetails)}
                    className="modal-xl"
                >
                    <ModalHeader
                        className="bg-transparent"
                        toggle={() => setVisaDetails(!visaDetails)}
                    ></ModalHeader>
                    <ModalBody className="pb-3 px-sm-1 mx-20">
                        <div>
                            <VisaDetails data1={filldata} />
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={confirmationCard}
                    toggle={() => setConfirmationCard(!confirmationCard)}
                    className="modal-xl"
                >
                    <ModalHeader
                        className="modal-lg"
                        toggle={() => setConfirmationCard(!confirmationCard)}
                    ></ModalHeader>
                    <ModalBody className="pb-3 px-sm-1 mx-20">
                        <div>
                            {filldata.length != 0 && (
                                <Row>
                                    <Col md="8" sm="12">
                                        <Confirmation data1={filldata} />
                                    </Col>
                                    <Col md="4" sm="12">
                                        <PreviewActions data1={filldata} />
                                    </Col>
                                </Row>
                            )}
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal isOpen={alerts}
                    toggle={() => setAlerts(!alerts)} className="modal-xl">
                    <ModalHeader className="modal-lg" toggle={() => setAlerts(!alerts)} ></ModalHeader>
                    <ModalBody className="pb-3 px-sm-1 mx-20">
                        <div>
                            <Alerts data1={filldata} />
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={registrationCard}
                    toggle={() => setRegistrationCard(!registrationCard)}
                    className="modal-xl"
                >
                    <ModalHeader
                        className="modal-lg"
                        toggle={() => setRegistrationCard(!registrationCard)}
                    ></ModalHeader>
                    <ModalBody className="pb-3 px-sm-1 mx-20">
                        <div>
                            {filldata.length != 0 && (
                                <Row>
                                    <Col md="8" sm="12">
                                        <RegistrationCard data1={filldata} />
                                    </Col>
                                    <Col md="4" sm="12">
                                        <PreviewActionsRegCard data1={filldata} />
                                    </Col>
                                </Row>
                            )}
                        </div>
                    </ModalBody>
                </Modal>
            </div>

            <div>
                <Modal
                    isOpen={modifyRegistration}
                    toggle={() => setModifyRegistration(!modifyRegistration)}
                    className="modal-xl"
                >
                    <ModalHeader
                        className="modal-lg"
                        toggle={() => setModifyRegistration(!modifyRegistration)}
                    ></ModalHeader>
                    <ModalBody className="pb-3 px-sm-1 mx-20">
                        <div>
                            <ModifyReservation data1={filldata} />
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={eregistrationCard}
                    toggle={() => setERegistrationCard(!eregistrationCard)}
                    className="modal-xl"
                >
                    <ModalHeader
                        className="modal-lg"
                        toggle={() => setERegistrationCard(!eregistrationCard)}
                    ></ModalHeader>
                    <ModalBody className="pb-3 px-sm-1 mx-20">
                        <div>
                            {filldata.length != 0 && (
                                <Row>
                                    <Col md="8" sm="12">
                                        <ERegistrationCard data1={filldata} />
                                    </Col>
                                    <Col md="4" sm="12">
                                        <PreviewActionsERegCard data1={filldata} />
                                    </Col>
                                </Row>
                            )}
                        </div>
                    </ModalBody>
                </Modal>
            </div>

            <div>
                <div>
                    <Modal
                        isOpen={addSharer}
                        toggle={() => setAddSharer(!addSharer)}
                        className="modal-xl"
                    >
                        <ModalHeader
                            className="bg-transparent"
                            toggle={() => setAddSharer(!addSharer)}
                        ></ModalHeader>
                        <ModalBody className="pb-3 px-sm-1 mx-20">
                            <div>
                                {/* {filldata.length!=0 && filldata.numberOfRooms > 1 ? (setPopUp("You have selected more then 1 room need to split the reservation")) : <AddSharer data1={filldata} />} */}
                                {filldata.length != 0 && <AddSharer data1={filldata} />}
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
                <Modal isOpen={cancelCheckIn} toggle={() => setCancelCheckIn(!cancelCheckIn)} className='demo-inline-spacing'>
                    <ModalHeader className='bg-transparent' toggle={() => setCancelCheckIn(!cancelCheckIn)}></ModalHeader>
                    <ModalBody className='pb-3 px-sm-1 mx-20'>
                        <div>
                            {filldata.length != 0 && <CancelCheckIn data1={filldata} />}
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal isOpen={profileView} toggle={() => setProfileView(!profileView)} className="modal-lg"  >
                    <ModalHeader className="modal-lg" toggle={() => setProfileView(!profileView)} >
                        View Profile
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-1 mx-20">
                        <ProfileViews data1={filldata} />
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={reservationDetails}
                    toggle={() => setReservation(!reservationDetails)}
                    className="modal-xl"
                >
                    <ModalHeader
                        className="bg-transparent"
                        toggle={() => setReservation(!reservationDetails)}
                    ></ModalHeader>
                    <ModalBody className="pb-3 px-sm-1 mx-20">
                        <div>
                            {filldata.length != 0 && <Reservation data1={filldata} />}
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal isOpen={options} toggle={() => setOptions(!options)} className='modal-lg' >
                    <ModalHeader className='modal-lg' toggle={() => { setOptions(!options) }}>I Want To..</ModalHeader>
                    <ModalBody className='pb-3 px-sm-2 mx-20'>
                        <div >
                            <Card style={{ backgroundColor: '#F2E5D9' }}>
                                <Row className='cardBody'>
                                    <Col md='3' sm='12' className='mb-1'>
                                        <div><h5><Edit2 style={{ height: '20px' }} />Modify/Update</h5></div>
                                        <div>

                                            <div className='hoverUnderline' onClick={() => setRoomMove(!roomMove)}>Room Move</div>
                                            <div className='hoverUnderline' onClick={() => setCancelCheckIn(!cancelCheckIn)}>Cancel CheckIn</div>
                                            <div
                                                className="hoverUnderline"
                                                onClick={() => {
                                                    if (filldata.numberOfRooms > 1) {
                                                        setPopUp(
                                                            "You have selected more then 1 room need to split the reservation"
                                                        );
                                                    } else if (
                                                        filldata.arrivalDate < Today &&
                                                        filldata.departureDate < Today
                                                    ) {
                                                        setPopUp(
                                                            "You can't add sharer because you crossed the departure date"
                                                        );
                                                    } else {
                                                        setAddSharer(true);
                                                    }
                                                }}
                                            >
                                                Add Sharer
                                            </div>
                                            <div className='hoverUnderline' onClick={() => setConfirmCheckOut(!ConfirmCheckOut)}>CheckOut</div>

                                            <div
                                                onClick={() =>
                                                    setModifyRegistration(!modifyRegistration)
                                                }
                                                className="hoverUnderline"
                                            >
                                                Modify Reservation
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md='3' sm='12' className='mb-1'>
                                        <div><h5><PlusCircle style={{ height: '20px' }} />Create</h5></div>

                                        <div className='hoverUnderline'>Copy Reservation</div>
                                        <div
                                            onClick={() => setRegistrationCard(!registrationCard)}
                                            className="hoverUnderline"
                                        >
                                            Registration Card
                                        </div>
                                        <div className='hoverUnderline'>Fixed Charges Posting</div>

                                        <div
                                            onClick={() => setVisaDetails(!visaDetails)}
                                            className="hoverUnderline"
                                        >
                                            Add Visa Details
                                        </div>
                                    </Col>
                                    <Col md='3' sm='12' className='mb-1'>
                                        <div><h5><Eye style={{ height: '20px' }} />View</h5></div>

                                        <div className='hoverUnderline'>Changes Log</div>
                                        <div className='hoverUnderline' onClick={() => { setShowResInvoice(true) }}>Invoice</div>

                                    </Col>
                                    <Col md='3' sm='12' className='mb-1'>
                                        <div><h5><ArrowRightCircle style={{ height: '20px' }} />Go To</h5></div>
                                        <div className='hoverUnderline' onClick={() => {
                                            localStorage.setItem('FolioTabNo', 0)
                                            setTimeout(() => { navigate('/dashboard/frontdesk/Billing') }, 600)
                                        }}>Billing</div>
                                        <div onClick={() => setProfileView(!profileView)} className="hoverUnderline">Profile</div>
                                        <div onClick={() => setReservation(!reservationDetails)} className="hoverUnderline">Reservation</div>
                                    </Col>
                                </Row>

                            </Card>

                            <Row className='cardBody'>
                                <Col md='6' sm='12' className='mb-1'>
                                    <h5>Reservation</h5>
                                    <div
                                        onClick={() => setConfirmationCard(!confirmationCard)}
                                        className="hoverUnderline"
                                    >
                                        <b>Confirmation Letter</b>
                                    </div>
                                    <div className='hoverUnderline'><b>Pro-Form Folio</b></div>
                                    {/* <div className='hoverUnderline'><b>Stay Details</b></div> */}
                                    <br></br>

                                    <h5>Notifications</h5>
                                    <div onClick={() => setAlerts(!alerts)} className="hoverUnderline">
                                        <AlertTriangle style={{ height: "20px" }} />
                                        <b>Alerts</b>
                                    </div>
                                    <h5>Attachments</h5>
                                    <div className="hoverUnderline">
                                        <File style={{ height: "20px" }} />
                                        <b>File</b>
                                    </div>

                                </Col>
                                <Col md='6' sm='12' className='mb-1'>
                                    <h5>Billing</h5>
                                    {/* <div className='hoverUnderline'><b>Deposit Cancellation</b></div> */}
                                    <div className='hoverUnderline'><b>Payment instructions</b></div>
                                    <div className='hoverUnderline' onClick={() => { setshowfixedcharges(!showfixedcharges) }}><b>Fixed Charges Posting</b></div>

                                    <br></br>
                                    <h5>Profile</h5>
                                    <div className='hoverUnderline'><b>Communication</b></div>
                                    <div className='hoverUnderline'><b>Future & Past Stays</b></div>
                                    <div className='hoverUnderline'><b>Preferences</b></div>

                                </Col>
                            </Row>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            {popUp && (
                <div className="disabled-animation-modal">
                    <Modal
                        isOpen={popUp}
                        toggle={() => setPopUp(!popUp)}
                        className="modal-sm"
                    >
                        {" "}
                        {/*onClosed={onDiscard}*/}
                        <ModalHeader
                            className="modal-sm"
                            toggle={() => {
                                setPopUp(!popUp);
                            }}
                        >
                            Need To Check..
                        </ModalHeader>
                        <ModalBody className="pb-3 px-sm-2 mx-20">
                            <div>
                                <b>{popUp}</b>
                                <br></br>
                                <br></br>
                                <Button
                                    color="primary"
                                    className="text-center"
                                    onClick={() => setPopUp(false)}
                                >
                                    Ok
                                </Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            )}

            <Modal isOpen={showfixedcharges} toggle={() => setshowfixedcharges(!showfixedcharges)} className='modal-lg' >
                <ModalHeader className='modal-lg' toggle={() => { setshowfixedcharges(!showfixedcharges) }}></ModalHeader>
                <ModalBody className='pb-3 px-sm-2 mx-20'>
                    <div >
                        <FixedCharges />
                    </div>
                </ModalBody>
            </Modal>
            {/* {Nayana} */}

            <Modal
                isOpen={ShowResInvoice}
                toggle={() => setShowResInvoice(!ShowResInvoice)}
                className="modal-xl"
            >
                <ModalHeader toggle={() => setShowResInvoice(!ShowResInvoice)} className='bg-transparent'>Re-instate Invoice</ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>


                    <ReservationInvoice />

                </ModalBody>
            </Modal>


        </div>
    );
}

export default ActionModal;

