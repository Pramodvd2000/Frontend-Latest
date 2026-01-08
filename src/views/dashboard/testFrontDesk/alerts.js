import { useState } from "react";
import Select from "react-select";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import {Input,Card,Row,Col,Button,CardHeader, Modal,ModalHeader,ModalBody,} from "reactstrap";
import API_URL from "../../../config";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
// AG Grid
import "/node_modules/ag-grid-community/styles/ag-grid.css";
import "/node_modules/ag-grid-community/styles/ag-theme-alpine.css";
import { useRef, useEffect} from "react";
import ResAlert from "./reservationAlert";
import AddCheckInAlert from "./checkInAlert";
import CheckOutAlert from "./checkOutAlert";
import {UncontrolledDropdown,DropdownMenu,DropdownItem,DropdownToggle,} from "reactstrap";
import { MoreVertical,List, Grid } from "react-feather";
import EditResAlert from "./editReservationAlert";
import EditCheckInAlertForm from "./editCheckInAlert"
import EditCheckOutAlert from "./editCheckOutAlert"
import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
const Alerts = ({ data1 }) => {
  let navigate = useNavigate();

  const [reservationAlert, setreservationAlert] = useState();
  const [resAlert, setresAlert] = useState();
  const [checkInAlertData, setCheckInAlertData] = useState(false);
  const [checkInAlert, setCheckInAlert] = useState(false);
  const [checkOutAlert, setCheckOutAlert] = useState();
  const [checkOutAlertData, setCheckOutAlertData] = useState(false);

  const [editReservationAlert, seteditReservationAlert] = useState(false)
  const [editCheckInAlert,  seteditCheckInAlert] = useState(false)
  const [editCheckOutAlert, seteditCheckOutAlert] = useState(false)
  const [removeResAlert, setRemoveResAlert] = useState(false)
  const [removecheckInAlert,  setRemovecheckInAlert] = useState(false)
  const [removecheckOutAlert, setRemovecheckOutAlert] = useState(false)
  const [details, setDetails] = useState("");
  const [alertsData, setAlertsData] = useState([]);
  const [a, setA] = useState([]);
  const [b, setB] = useState([]);
  const {setError,formState: { errors }, } = useForm();
  const [gridViewList, setGridViewList] = useState();

  useEffect(() => {
    // Fetch reservation guest details
    fetchx(API_URL + "/getReservationGuestDetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelID: "1",
        reservationID: data1.id,
      }),
    })
      .then((result) => result.json())
      .then((rowData) => {
        setDetails(rowData["data"][0]);
      })
      .catch((error) => {
      });
  
    // Fetch all alerts
    fetchx(API_URL + "/getAllAlerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelID: "1",
        reservationID: data1.id,
      }),
    })
      .then((result) => result.json())
      .then((rowData) => {
        setAlertsData(rowData.data);
  
        const checkOutAlerts = [];
        const checkInAlerts = [];
  
        for (let i = 0; i < rowData.data.length; i++) {
          if (rowData.data[i]["checkInAlert"] !== null) {
            checkInAlerts.push(rowData.data[i]["checkInAlert"]);
          }
  
          if (rowData.data[i]["checkOutAlert"] !== null) {
            checkOutAlerts.push(rowData.data[i]["checkOutAlert"]);
          }
        }
  
        setA(checkOutAlerts);
        setB(checkInAlerts);
      })
      .catch((error) => {
      });


      //Get Reservation Alerts
      fetchx(API_URL + `/getReservationAlerts?hotelID=10&reservationID=${data1.id}`)
      .then((result) => result.json())
      .then((resp) => {
        setreservationAlert(resp["data"][0]["reservationAlert"])
      })

      //Get CheckIn Alerts
      fetchx(API_URL + `/getCheckInAlerts?hotelID=10&reservationID=${data1.id}`)
      .then((result) => result.json())
      .then((resp) => {
        setCheckInAlertData(resp["data"][0]["checkInAlert"])
      })


      //Get CheckOut Alerts
      fetchx(API_URL + `/getCheckOutAlerts?hotelID=10&reservationID=${data1.id}`)
      .then((result) => result.json())
      .then((resp) => {
       console.log(resp["data"][0]["checkOutAlert"])
        setCheckOutAlertData(resp["data"][0]["checkOutAlert"])
      })

  }, [data1.id]);
  
  //  useEffect(() => {
  //   if (alertsData.length > 0) {
  //  }
  // }, [alertsData]);



  
  function ConfirmReservation() {
    const updatedItem = JSON.stringify({   
      "reservationID": data1.id,
      "sharingID":data1.sharingID,
      "alertCode" : null, 
      "reservationAlert": null,
    });
    //console.log(updatedItem);
    fetchx(API_URL + `/updateReservationAlert`, {
      method: "PUT",
      body: updatedItem,
      headers: { "Content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        //console.log(res)
        navigate("");

        //console.log("response", res);
        const swalInstance = MySwal.fire({
          text:" Removed Reservation Alert Successfully!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Close",
          allowOutsideClick: false,
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            setRemovecheckInAlert(false);
            navigate("");
          }
        });
      })
       .catch((err) => {
        //console.log(err.message);
      });
  }
 

  function ConfirmCheckIn() {
    const updatedItem = JSON.stringify({   
      "reservationID": data1.id,
      "sharingID":data1.sharingID,
      "alertCode" : null, 
      "checkInAlert": null,
    });
    //console.log(updatedItem);
    fetchx(API_URL + `/updateCheckInAlert`, {
      method: "PUT",
      body: updatedItem,
      headers: { "Content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        navigate("");

        // //console.log(res)
        //console.log("response", res);
        const swalInstance = MySwal.fire({
          text:" Removed CheckIn Alert Successfully!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Close",
          allowOutsideClick: false,
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            setRemovecheckInAlert(false);
            navigate("");
          }
        });
      })
       .catch((err) => {
        //console.log(err.message);
      });
  }
 
  function ConfirmCheckOut() {
    const updatedItem = JSON.stringify({   
      "reservationID": data1.id,
      "sharingID":data1.sharingID,
      "alertCode" : null, 
      "checkOutAlert": null,
    });
    //console.log(updatedItem);
    fetchx(API_URL + `/updateCheckOutAlert`, {
      method: "PUT",
      body: updatedItem,
      headers: { "Content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        navigate("");

        // //console.log(res)
        //console.log("response", res);
        const swalInstance = MySwal.fire({
          text:" Removed CheckOut Alert Successfully!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Close",
          allowOutsideClick: false,
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            setRemovecheckOutAlert(false);
            navigate("");
          }
        });
      })
       .catch((err) => {
        //console.log(err.message);
      });
  }
  return (
    <div>
    {/* Remove Reservation Alert */}
    <div>
        <Modal isOpen={removeResAlert} toggle={() => setRemoveResAlert(!removeResAlert)} className="modal-sm" >
          <ModalHeader className="modal-sm" toggle={() => {   setRemoveResAlert(!removeResAlert); }}>
            Need To Check..
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-2 mx-20">
            <div>
              <b> Do You Want to Remove Reservation Alert ?</b>
              <br></br>
              <br></br>
              <div className="d-flex">
                <Button
                  color="primary"
                  className="me-1"
                  onClick={() => ConfirmReservation()}
                >
                  Confirm
                </Button>
                <Button
                  color="danger"
                  className="me-1"
                  // className="text-center"
                  onClick={() => {
                    setRemoveResAlert(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>

    {/* Remove Checkin Alert */}

      <div>
        <Modal isOpen={removecheckInAlert} toggle={() => setRemovecheckInAlert(!removecheckInAlert)} className="modal-sm" >
          <ModalHeader className="modal-sm" toggle={() => {setRemovecheckInAlert(!removecheckInAlert); }}>
            Need To Check..
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-2 mx-20">
            <div>
              <b> Do You Want to Remove CheckIn Alert ?</b>
              <br></br>
              <br></br>
              <div className="d-flex">
                <Button
                  color="primary"
                  className="me-1"
                  onClick={() => ConfirmCheckIn()}
                >
                  Confirm
                </Button>
                <Button
                  color="danger"
                  className="me-1"
                  // className="text-center"
                  onClick={() => {
                    setRemovecheckInAlert(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>

    {/* Remove Checkout Alert */}

      <div>
        <Modal isOpen={removecheckOutAlert} toggle={() => setRemovecheckOutAlert(!removecheckOutAlert)} className="modal-sm" >
          <ModalHeader className="modal-sm" toggle={() => {   setRemovecheckOutAlert(!removecheckOutAlert); }}>
            Need To Check..
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-2 mx-20">
            <div>
              <b> Do You Want to Remove CheckOut Alert ?</b>
              <br></br>
              <br></br>
              <div className="d-flex">
                <Button
                  color="primary"
                  className="me-1"
                  // className="text-center"
                  onClick={() => ConfirmCheckOut()}
                >
                  Confirm
                </Button>
                <Button
                  color="danger"
                  className="me-1"
                  // className="text-center"
                  onClick={() => {
                    setRemovecheckOutAlert(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>


    {/* Add Reservation Alert */}

      <div>
        <Modal
          isOpen={resAlert}
          toggle={() => setresAlert(!resAlert)}
          className="modal-sm"
        >
          <ModalHeader
            className="modal-lg"
            toggle={() => setresAlert(!resAlert)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <ResAlert data1={details} />
          </ModalBody>
        </Modal>
      </div>

    {/* Add Checkin Alert */}

      <div>
        <Modal
          isOpen={checkInAlert}
          toggle={() => setCheckInAlert(!checkInAlert)}
          className="modal-sm"
        >
          <ModalHeader
            className="modal-lg"
            toggle={() => setCheckInAlert(!checkInAlert)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <AddCheckInAlert data1={details} />
          </ModalBody>
        </Modal>
      </div>

    {/* Add Checkout Alert */}

      <div>
        <Modal
          isOpen={checkOutAlert}
          toggle={() => setCheckOutAlert(!checkOutAlert)}
          className="modal-sm"
        >
          <ModalHeader
            className="modal-lg"
            toggle={() => setCheckOutAlert(!checkOutAlert)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <CheckOutAlert data1={details} />
          </ModalBody>
        </Modal>
      </div>

      {/* Card decricption header */}

      <Row>
        <Col md="3" sm="12">
          Arrival :<b> {details["arrivalDate"] + " " + details["ETA"]} </b>{" "}
          <br></br>
          Departure:
          <b>
           
            {details["departureDate"] + " " + " " + " " + details["ETD"]}{" "}
          </b>{" "}
          <br></br>
        </Col>
        <Col md="3" sm="12">
          Adults : <b> {details["numberOfAdults"]} </b> <br></br>
          Children : <b> {details["numberOfChildren"]} </b> <br></br>
        </Col>
        <Col md="3" sm="12">
          Number Of Rooms : <b> {details["numberOfRooms"]} </b> <br></br>
          Package : <b> {details["packageCode"]} </b>
          <br></br>
          Rate: <b>{details["totalCostOfStay"]} </b>
          <br></br>
        </Col>
        <Col md="3" sm="12">
          GuestName :{" "}
          <b>
           
            {details["salutation"] + details["firstName"] + details["lastName"]}
          </b>
          <br></br>
          Company Name :<b> {details["accountName"]} </b> <br></br>
          Confirmation Number :<b> {details["bookingID"]} </b> <br></br>
        </Col>
      </Row>
      <br />
      <br />
      <Row>
        {/* ---------------------------------Reservation Alert----------------------------- */}

        <Col md="4" sm="12">
            <Card>
              <CardHeader>
                <h4>
                  <b>
                    <Row>
                      <Col md="10" sm="12">Reservation Alert</Col>
                      <Col md="2" sm="12">
                        <div align="right" className="buttons">
                         
                          <div>
                            <div className="d-flex justify-content-end">
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  className="icon-btn hide-arrow"
                                  color="transparent"
                                  size="sm"
                                  caret
                                >
                                  <MoreVertical size={20} />
                                </DropdownToggle>
                                <DropdownMenu>
                                { reservationAlert == undefined &&
                                  <DropdownItem
                                    href="/"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setGridViewList(false);
                                      setresAlert(!resAlert)
                                    }}
                                  >
                                    <List className="me-50" size={15} />
                                    <span className="align-middle">Add Alert</span>
                                  </DropdownItem>
                                  }


                                  
                                 {reservationAlert && reservationAlert.length > 0 &&  <DropdownItem
                                    // href="/"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setGridViewList(true); 
                                      seteditReservationAlert(!editReservationAlert)// Set to false when "Add Alert" is clicked.
                                    }}
                                    // onClick={()=> seteditReservationAlert(!editReservationAlert)}
                                  >
                                    <Grid className="me-50" size={15} />
                                    <span className="align-middle">Edit Alert</span>
                                  </DropdownItem>}
                                 {reservationAlert && reservationAlert.length > 0 && <DropdownItem
                                    // href="/"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setGridViewList(true);
                                      setRemoveResAlert(!removeResAlert) 
                                    }}
                                    // onClick={()=> seteditReservationAlert(!editReservationAlert)}
                                  >
                                    <Grid className="me-50" size={15} />
                                    <span className="align-middle">Delete Alert</span>
                                  </DropdownItem>}
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </div>



                            <div>
                              {gridViewList === true && 
                               <Modal isOpen={editReservationAlert} toggle={() => seteditReservationAlert(!editReservationAlert)} className='modal-sm'>
                               <ModalHeader className='bg-transparent' toggle={() => seteditReservationAlert(!editReservationAlert)}></ModalHeader>
                               <ModalBody className='pb-3 px-sm-1 mx-20'>
                                 <div>
                                 <EditResAlert data1={details} />
                                 </div>
                               </ModalBody>
                             </Modal> 
                              // <EditResAlert data1={details} />
                              }
                              {gridViewList === false && 
                              
                              // <ResAlert data1={details} />
                              <Modal isOpen={resAlert}  toggle={() => setresAlert(!resAlert)} className="modal-sm"                            >
                              <ModalHeader
                                className="modal-lg"
                                toggle={() => setresAlert(!resAlert)}
                              ></ModalHeader>
                              <ModalBody className="pb-3 px-sm-1 mx-20">
                                <ResAlert data1={details} />
                              </ModalBody>
                            </Modal>                              
                              }
                              <div>
                            
                              </div>
                            </div>  
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </b>
                </h4>
              </CardHeader>
              <Row>
                {alertsData.length > 0 && (
                  <Col md="12" sm="12">
                    <b> {alertsData[0]["reservationAlert"]} </b>
                  </Col>
                )}
              </Row>
            </Card>
          </Col>

        {/* ------------------------------Check In Alert-------------------------------------- */}
        <Col md="4" sm="12">
          <Card>
            <CardHeader>
             
              <h4>
                <b>Check In Alert</b>
              </h4>
              <div align="end" className="buttons">
             
              <div>
                            <div className="d-flex justify-content-end">
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  className="icon-btn hide-arrow"
                                  color="transparent"
                                  size="sm"
                                  caret
                                >
                                  <div align = 'end'> <MoreVertical size={20} /></div>
                                  
                                </DropdownToggle>
                                <DropdownMenu>
                                {(checkInAlertData == null || checkInAlertData == '' ) && <DropdownItem
                                    href="/"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setGridViewList(false); // Set to false when "Add Alert" is clicked.
                                      setCheckInAlert(!checkInAlert)
                                    }}
                                  >
                                    <List className="me-50" size={15} />
                                    <span className="align-middle">Add Alert</span>
                                  </DropdownItem>}

                                  {checkInAlertData && checkInAlertData.length > 0 && <DropdownItem
                                    // href="/"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setGridViewList(true); 
                                      seteditCheckInAlert(!editCheckInAlert)
                                    }}
                                  >
                                    <Grid className="me-50" size={15} />
                                    <span className="align-middle">Edit Alert</span>
                                  </DropdownItem>}
                                  {checkInAlertData && checkInAlertData.length > 0 && <DropdownItem
                                    // href="/"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setGridViewList(true); 
                                      setRemovecheckInAlert(true)
                                    }}
                                  >
                                    <Grid className="me-50" size={15} />
                                    <span className="align-middle">Delete Alert</span>
                                  </DropdownItem>}
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </div>
                            <div>
                              {gridViewList === true && 
                               <Modal isOpen={editCheckInAlert} toggle={() => seteditCheckInAlert(!editCheckInAlert)} className='modal-sm'>
                               <ModalHeader className='bg-transparent' toggle={() => seteditCheckInAlert(!editCheckInAlert)}></ModalHeader>
                               <ModalBody className='pb-3 px-sm-1 mx-20'>
                                 <div>
                                 <EditCheckInAlertForm data1={details} />
                                 </div>
                               </ModalBody>
                             </Modal> 
                              // <EditResAlert data1={details} />
                              }
                              {gridViewList === false && 
                                   // <ResAlert data1={details} />
                                  <Modal isOpen={checkInAlert} toggle={() => setCheckInAlert(!checkInAlert)} className="modal-sm"
                                >
                                  <ModalHeader className="modal-lg" toggle={() => setCheckInAlert(!checkInAlert)}
                                  ></ModalHeader>
                                  <ModalBody className="pb-3 px-sm-1 mx-20">
                                    <AddCheckInAlert data1={details} />
                                  </ModalBody>
                                </Modal>                            
                              }
                              <div>
                            
                              </div>
                            </div>  
                          </div>
            </div>

            </CardHeader>
            
            <Row>
                {alertsData && b.length > 0 ? (
                <Col md="12" sm="12">
                  <b>{b[0]}</b>
                </Col>
              ) : (
                <Col md="12" sm="12">
                  {/* <b>No check-In alert available</b> */}
                </Col>
              )}
            </Row>
          </Card>
        </Col>

        {/* --------------------------------------Check Out Alert---------------------------------------------- */}
        <Col md="4" sm="12">
          <Card>
            <CardHeader>
             
              <h4>
                <b>Check Out Alert</b>
              </h4>


            <div align="end" className="buttons">
              {/* <PiDotsThreeVerticalBold
                size={25}
                onClick={() => {
                  setCheckOutAlert(!checkOutAlert);
                }}
              /> */}
              <div>
                            <div className="d-flex justify-content-end">
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  className="icon-btn hide-arrow"
                                  color="transparent"
                                  size="sm"
                                  caret
                                >
                                  <MoreVertical size={20} />
                                </DropdownToggle>
                                <DropdownMenu>
                                 {(checkOutAlertData == null || checkOutAlertData == '' ) && <DropdownItem
                                    href="/"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setGridViewList(false); // Set to false when "Add Alert" is clicked.
                                      setCheckOutAlert(!checkOutAlert)
                                    }}
                                  >
                                    <List className="me-50" size={15} />
                                    <span className="align-middle">Add Alert</span>
                                  </DropdownItem>}
                                 {checkOutAlertData && checkOutAlertData.length > 0 && <DropdownItem
                                    // href="/"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setGridViewList(true); 
                                      seteditCheckOutAlert(!editCheckOutAlert)
                                    }}
                                    // onClick={()=> seteditReservationAlert(!editReservationAlert)}
                                  >
                                    <Grid className="me-50" size={15} />
                                    <span className="align-middle">Edit Alert</span>
                                  </DropdownItem>}
                                 { checkOutAlertData && checkOutAlertData.length > 0 &&<DropdownItem
                                    // href="/"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setGridViewList(true); 
                                      setRemovecheckOutAlert(true)
                                    }}
                                    // onClick={()=> seteditReservationAlert(!editReservationAlert)}
                                  >
                                    <Grid className="me-50" size={15} />
                                    <span className="align-middle">Delete Alert</span>
                                  </DropdownItem>}
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </div>
                            <div>
                            {gridViewList === true && 
                               <Modal isOpen={editCheckOutAlert} toggle={() => seteditCheckOutAlert(!editCheckOutAlert)} className='modal-sm'>
                               <ModalHeader className='bg-transparent' toggle={() => seteditCheckOutAlert(!editCheckOutAlert)}></ModalHeader>
                               <ModalBody className='pb-3 px-sm-1 mx-20'>
                                 <div>
                                 <EditCheckOutAlert data1={details} />
                                 </div>
                               </ModalBody>
                             </Modal> 
                              // <EditResAlert data1={details} />
                              }
                              {gridViewList === false && 
                                   // <ResAlert data1={details} />
                                   <Modal
                                   isOpen={checkOutAlert}
                                   toggle={() => setCheckOutAlert(!checkOutAlert)}
                                   className="modal-sm"
                                 >
                                   <ModalHeader
                                     className="modal-lg"
                                     toggle={() => setCheckOutAlert(!checkOutAlert)}
                                   ></ModalHeader>
                                   <ModalBody className="pb-3 px-sm-1 mx-20">
                                     <CheckOutAlert data1={details} />
                                   </ModalBody>
                                 </Modal>                         
                              }
                              <div>
                            
                              </div>
                            </div>  
                          </div>
            </div>
            </CardHeader>

            <Row>
              {alertsData && a.length > 0 ? (
                <Col md="12" sm="12">
                  <b>{a[0]}</b>
                </Col>
              ) : (
                <Col md="12" sm="12">
                  {/* <b>No check-out alert available</b> */}
                </Col>
              )}
              {/* {rowData.data[i]['checkOutAlert']} */}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Alerts;