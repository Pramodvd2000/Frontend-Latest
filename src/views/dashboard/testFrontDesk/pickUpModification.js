import { useState, useEffect } from "react";
import Select from "react-select";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { selectThemeColors } from "@utils";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Moment from "moment";
import { Input, Card, Form, Row, Col, Label, Button, CardBody} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import API_URL from "../../../config";
import { useNavigate } from "react-router-dom";
// ** Third Party Components
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

let TransportTypeOptions = [
  fetchx(API_URL + '/getTransportTypeOptions?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      TransportTypeOptions = resp['data']
    })
]


const PickUpDetails = (data1) => {
  const [details, setDetails] = useState("");
  let navigate = useNavigate();
  useEffect(() => {
    fetchx(API_URL + "/getReservationGuestDetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelID: "1",
        reservationID: data1["data1"]["data1"]["id"],
      }),
    })
      .then((result) => result.json())
      .then((rowData) => {
        if (rowData.statusCode === 200) {
          setDetails(rowData["data"][0]);
        }
        if (details.pickUpDate) {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [data1["data1"]["data1"]]);

 

  const defaultReason = {
    value: details.pickUpTransportType,
    label: details.pickUpTransportype,
  };


  

  const defaultValues9 = {
    pickUpDate: "",
    pickUpTime: "",
    pickUpStationCode: "",
    pickUpCarrierCode: "",
    pickUpTransportType: null,
    pickUpRemarks: "",
    dropDate: "",
    dropTime: "",
    dropStationCode: "",
    dropCarrierCode: "",
    dropTransportType: null,
    dropRemarks: "",
  };
  const {setError,formState: { errors },} = useForm();

  const [data, setData] = useState(null);
  //console.log(details.pickUpDate);


  const { reset, handleSubmit, control, watch } = useForm({ defaultValues9 });
  
  //Flatpicker
  const today = Moment().format("YYYY-MM-DD");
    const minDate = details.arrivalDate < today ? today : details.arrivalDate;  
    const options = {
        minDate: details.arrivalDate,
        maxDate: details.departureDate
    };

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

  const onSubmit = (data) => {
    setData(data);
    if (data.pickUpDate1 !== null && data.pickUpRequired !== null && data.dropDetails !== null) {
      let pickUpTransportType; // Declare dropTransportType variable
      if (data.pickUpTransportType1 && data.pickUpTransportType1.value !== undefined) {
        pickUpTransportType = data.pickUpTransportType1.value;
      } else {
        pickUpTransportType = details.pickUpTransportType;
      }
      //console.log(details.pickUpDate);

      const createmarketGroup = JSON.stringify({
       
        reservationID: data1.data1.data1["id"],
        tempReservationID: data1.data1.data1["tempReservationID"],
        pickUpDate: (data.pickUpDate1 || details.pickUpDate),   
        pickUpTime: data.pickUpTime1 === undefined   ? details.pickUpTime   : data.pickUpTime1,
        pickUpStationCode: data.pickUpStationCode1 === undefined   ? details.pickUpStationCode   : data.pickUpStationCode1,
        dropDate: data.dropDate1 || details.departureDate,
        dropTime: data.dropTime1 === undefined ? details.dropTime : data.dropTime1,
        dropStationCode: data.dropStation === undefined   ? details.dropStationCode   : data.dropStation,
        pickUpCarrierCode: data.pickUpCarrierCode1 === undefined   ? details.pickUpCarrierCode   : data.pickUpCarrierCode1,
        pickUpTransportType: data.pickUpTransportType1.value,
        pickupRemarks: data.pickUpRemarks1 === undefined   ? details.pickupRemarks   : data.pickUpRemarks1,
        dropRemarks:data.dropRemarks1 === undefined  ? details.dropRemarks  : data.dropRemarks1,
        dropTransportType: '',
        dropCarrierCode:
          data.dropCarrier === undefined
            ? details.dropCarrierCode
            : data.dropCarrier,
      });
      
      console.log("createmarketGroup",createmarketGroup);
      let res = fetchx(API_URL+`/updateresPickupDetails`, {        
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: createmarketGroup,
      })
        .then((data) => data.json())
        .then((res) => {
          if(res.statusCode == 403){
            handleError(res.message)
          }
          else{
            const swalInstance = MySwal.fire({
              text: "PickUp Modification done Successfully!",
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
                navigate("");
              }
            });
          }
        });
    }
  };
  //console.log(localStorage.getItem("tempID"));
  //console.log(details.pickUpDate);

  const handleReset = () => {
    reset({
      pickUpDate: "",
      pickUpTime: "",
      pickUpStationCode: "",
      pickUpCarrierCode: "",
      pickUpTransportType: null,
      pickUpRemarks: "",
      dropDate: "",
      dropTime: "",
      dropStationCode: "",
      dropCarrierCode: "",
      dropTransportType: null,
      dropRemarks: "",
    });
  };

  const [popUp, setPopUp] = useState(false);

  function Confirm() {
    const updatedItem = JSON.stringify({   
      pickUpDate: null,
      pickUpTime: null,
      pickUpStationCode: null,
      pickUpCarrierCode: null,
      pickUpTransportType: null,
      pickupRemarks: null,
      reservationID: data1.data1.data1["id"],
      tempReservationID: data1.data1.data1["tempReservationID"],
      pickUpID:null
    });
    //console.log(updatedItem);
    fetchx(API_URL + `/modifyPickupDetails`, {
      method: "PUT",
      body: updatedItem,
      headers: { "Content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        // //console.log(res)
        //console.log("response", res);
        const swalInstance = MySwal.fire({
          text: "Pick Up details Updated Successfully!",
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
            navigate("");
          }
        });
      })
      .then((post) => {
        const swalInstance = MySwal.fire({
          text: "Removed PickUp Details Successfully!",
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
            navigate("");
          }
        });
        //console.log(post);
        if (post.statusCode === 200) {
          setPopUp(false);
          // fetchx(API_URL + "/getroomclass?hotelID=1")
          //   .then((result) => result.json())
          //   .then((rowData) => {
          //     //console.log(rowData["data"]);
          //   });
        }
      })
      .catch((err) => {
        //console.log(err.message);
      });
  }

  const [rateSummary, setRateSummary] = useState();

  return (
    <div>
      <div className="disabled-animation-modal">
        <Modal
          isOpen={popUp}
          toggle={() => setPopUp(!popUp)}
          className="modal-sm"
        >
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
              <b> "Do You Want to Remove PickUpDetails ?";</b>
              <br></br>
              <br></br>
              <div className="d-flex">
                <Button
                  color="primary"
                  className="me-1"
                  // className="text-center"
                  onClick={() => Confirm()}
                >
                  Confirm
                </Button>
                <Button
                  color="danger"
                  className="me-1"
                  // className="text-center"
                  onClick={() => {
                    setPopUp(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>



      {/* /////////////--------------- TopCard to Display ----------- ////////////// */}
 
      <Card>
       
       {/*       <h5>Payment Type Code: {rowData2.paymentTypeCode}</h5> */}
       {details.pickUpDate && ( 
        <div>
          <Row>
            <Col>
            <h5>PickUp Date: {details.pickUpDate}</h5>
            <h5>PickUp Time: {details.pickUpTime}</h5>
            </Col>
            <Col>
            <h5>PickUp StationCode: {details.pickUpStationCode}</h5>
            <h5>PickUp Transport : {details.pickUpTransportype}</h5>
            </Col>
            <Col>
            <h5>PickUpCarrierCode :  {details['pickUpCarrierCode']}</h5>
            <h5>PickUp Remarks: {details.pickupRemarks}</h5>
            </Col>
          </Row>
        </div>
     ) }  
    
`     </Card>

      <Card>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Pickup Details */}
            <Row>

              {/* {details && ( */}
                <Row>
                  <Col md="4" sm="12">
                    <div className="mb-1">
                      <Label className="form-label" for="pickUpDate1">
                        PickUP Date <spam style={{ color: "red" }}>*</spam>
                      </Label>
                      <Controller
                        control={control}
                        id="pickUpDate1"
                        name="pickUpDate1"
                        // defaultValue={details.pickUpDate}
                        render={({ field }) => (
                          <Flatpickr
                            {...field}
                            options={options}
                            placeholder="YYYY-MM-DD "
                            className={classnames("form-control", {
                              "is-invalid": data !== null && data.pickUpDate1 === null,
                            })}
                          />
                        )}
                      />
                    </div>
                  </Col>
                  <Col md="4" sm="8">
                    <div className="mb-1">
                      <Label className="form-label" for="pickUpTime1">
                        PickUp Time <spam style={{ color: "red" }}>*</spam>
                      </Label>
                      <Controller
                        // defaultValue=''
                        control={control}
                        id="pickUpTime1"
                        name="pickUpTime1"
                        render={({ field }) => (
                          <Input
                          required
                            type="time"
                            placeholder="ETD"
                            invalid={errors.pickUpTime1 && true}
                            // defaultValue={details.pickUpTime}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </Col>
                  <Col md="4" sm="12" className="mb-1">
                    <div className="mb-1">
                      <Label className="form-label" for="pickUpStationCode1">
                        PickUp Locaton
                      </Label>
                      <Controller
                        control={control}
                        id="pickUpStationCode1"
                        name="pickUpStationCode1"
                        render={({ field }) => (
                          <Input
                            placeholder="StationCode"
                            invalid={errors.pickUpStationCode1 && true}
                            {...field}
                            // defaultValue={details.pickUpStationCode}
                          />
                        )}
                      />
                    </div>
                  </Col>
                  <Col md="4" sm="12" className="mb-1">
                    <div className="mb-1">
                      <Label className="form-label" for="pickUpCarrierCode1">
                        Carrier Code
                      </Label>
                      <Controller
                        control={control}
                        id="pickUpCarrierCode1"
                        name="pickUpCarrierCode1"
                        render={({ field }) => (
                          <Input
                            placeholder="Carrier Code"
                            invalid={errors.pickUpCarrierCode1 && true}
                            {...field}
                            // defaultValue={details.pickUpCarrierCode}
                          />
                        )}
                      />
                    </div>
                  </Col>
                  <Col md="4" sm="8">
                    <div className="mb-1">
                      <Label className="form-label" for="pickUpTransportType1">
                        Transport Type <spam style={{ color: "red" }}>*</spam>
                      </Label>
                      <Controller
                        id="pickUpTransportType1"
                        control={control}
                        name="pickUpTransportType1"
                        render={({ field }) => (
                          <Select
                          required
                            isClearable
                            // defaultValue={defaultReason}
                            options={TransportTypeOptions}
                            classNamePrefix="select"
                            theme={selectThemeColors}
                            className={classnames("react-select", {
                              // "is-invalid":
                              //   data !== null &&
                              //   data.pickUpTransportType1 === null,
                            }
                            )}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </Col>

                  <Col md="4" sm="12" className="mb-1">
                    <div className="mb-1">
                      <Label className="form-label" for="pickUpRemarks1">
                        Remarks
                      </Label>
                      <Controller
                        control={control}
                        id="pickUpRemarks1"
                        name="pickUpRemarks1"
                        render={({ field }) => (
                          <Input
                            placeholder="Remarks"
                            invalid={errors.pickUpRemarks1 && true}
                            {...field}
                            // defaultValue={details.pickupRemarks}
                          />
                        )}
                      />
                    </div>
                  </Col>
                </Row>
              {/* // )} */}
            </Row>
            <br></br>

            <div className="d-flex">             
              <Button className="me-1" color="primary" type="submit">
                Submit
              </Button>
              <Button
                className="me-1"
                color="primary"
                onClick={() => {
                  setPopUp(!popUp);
                }}
              >
                Cancel PickUP 
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};
export default PickUpDetails;
