import { useState, useEffect } from "react";
import Select from "react-select";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { selectThemeColors } from "@utils";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Moment from "moment";
import { Input, Card, Form, Row, Col, Label, Button, CardBody, } from "reactstrap";
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
        // //console.log(rowData);      
        if (rowData.statusCode === 200) {
          setDetails(rowData["data"][0]);
        }
        if (details.pickUpDate) {
        }
      })
      .catch((error) => {
      });
  }, [data1["data1"]["data1"]]);
  //console.log(details);rowData1
  const [selectedValue1, setSelectedValue1] = useState(details.dropTransportType);
  const handleChange1 = (selectedOption1) => {
    setSelectedValue1(selectedOption1.value);
    setTimeout(() => { setreload(true); }, 1);
  };

  const defaultValues9 = {
    dropDate: "",
    dropTime: "",
    dropStationCode: "",
    dropCarrierCode: "",
    dropTransportType: null,
    dropRemarks: "",
  };
  const { setError, formState: { errors }, } = useForm();
  const [data, setData] = useState(null);
  //console.log(details.pickUpDate); 
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues9 });
  const optionsToDate = {
    minDate: details.arrivalDate,
    maxDate: details.departureDate,
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
    //console.log(data.dropDate1);
    //console.log(details.departureDate);
    if (data.pickUpRequired !== null && data.dropDetails !== null) {
      let dropTransportType; // Declare dropTransportType variable
      if (data.dropTransport1 && data.dropTransport1.value !== undefined) {
        dropTransportType = data.dropTransport1.value;
      } else {
        dropTransportType = selectedValue1;
      }

      console.log(data);
      const createmarketGroup = JSON.stringify({
        reservationID: data1.data1.data1["id"],
        tempReservationID: data1.data1.data1["tempReservationID"],
        pickUpDate: data.pickUpDate1 === undefined ? null : Moment(String(new Date(data.pickUpDate1[0]))).format("YYYY-MM-DD"),
        pickUpTime: data.pickUpTime1,
        pickUpStationCode: data.pickUpStationCode1,
        dropDate: data.dropDate1 || details.departureDate,
        dropTime: data.dropTime1 === undefined ? details.dropTime : data.dropTime1,
        dropStationCode: data.dropStation === undefined ? details.dropStationCode : data.dropStation,
        pickUpCarrierCode: data.pickUpCarrierCode1,
        pickUpTransportType: '',
        pickupRemarks: data.pickUpRemarks1,
        // dropDate:(Moment(String(new Date(data.dropDate1[0]))).format("YYYY-MM-DD") || details.departureDate),
        dropRemarks: data.dropRemarks1 === undefined ? details.dropRemarks : data.dropRemarks1,
        dropTransportType: data.dropTransport1.value,
        dropCarrierCode:
          data.dropCarrier === undefined
            ? details.dropCarrierCode
            : data.dropCarrier,
      });
      //console.log(createmarketGroup);
      //console.log(data1.data1.data1["tempReservationID"]);
      let res = fetchx(API_URL + `/updateresDropDetails`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: createmarketGroup,
      })
        .then((data) => data.json())
        .then((res) => {
          if (res.statusCode == 403) {
            handleError(res.message)
          }
          else {
            const swalInstance = MySwal.fire({
              text: "Drop Modification done Successfully!",
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
            })
          }
        });
    }
  };


  function Confirm1() {
    const updatedItem = JSON.stringify({
      dropDate: null,
      dropTime: null,
      dropStationCode: null,
      dropCarrierCode: null,
      dropTransportType: null,
      dropRemarks: null,
      reservationID: data1.data1.data1["id"],
      tempReservationID: data1.data1.data1["tempReservationID"],
      dropID: null
    });
    //console.log(updatedItem)
    fetchx(API_URL + `/modifydrop`, {
      method: "PUT",
      body: updatedItem,
      headers: { "Content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        // //console.log(res)
        //console.log("response", res);
        const swalInstance = MySwal.fire({
          text: "Drop Details Updated Successfully!",
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
      // .then((post) => {
      //  const swalInstance = MySwal.fire({
      //         text: 'Updated Active Status Successfully!',
      //         icon: 'success',
      //         buttonsStyling: false,
      //         confirmButtonText: 'Close',
      //         allowOutsideClick: false,
      //         customClann          ss: {
      //           confirmButton: 'btn btn-danger'
      //         }
      //       });
      //       swalInstance.then((result) => {
      //         if (result.isConfirmed) {
      //           navigate('');
      //         }
      //       });
      // //console.log(post)
      // if(post.statusCode === 200){
      // setPopUp(false)
      // fetchx(API_URL + '/getroomclass?hotelID=1')
      // .then(result => result.json())
      // .then(rowData =>{
      // //console.log(rowData['data'])
      // }
      // )
      // }
      // })
      .catch((err) => {
        //console.log(err.message);
      });
  }
  const [rateSummary, setRateSummary] = useState();

  return (
    <div>

      <div>
        <Modal isOpen={rateSummary} toggle={() => setRateSummary(!rateSummary)} className="modal-lg">
          <ModalHeader className="modal-lg" toggle={() => setRateSummary(!rateSummary)}>
            Modify Rate Summary
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              <b> "Do You Want to Remove Drop Details ?";</b>
              <br></br>
              <br></br>
              <div className="d-flex">
                <Button color="primary" className="me-1" onClick={() => Confirm1()}                >
                  Confirm
                </Button>
                <Button color="danger" className="me-1" onClick={() => { setRateSummary(false); }}  >
                  Cancel
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>

      <Card>
        {details.dropDate && (
          <div>
            <Row>
              <Col>
                <h5>Drop Date :{details['dropDate']}</h5>
                <h5>Drop Time :{details['dropTime']}</h5>
              </Col>
              <Col>
                <h5>Drop StationCode: {details.dropStationCode}</h5>
                <h5>Drop Transport : {details.dropTransporttype}</h5>
              </Col>
              <Col>
                <h5>DropCarrierCode :  {details['dropCarrierCode']}</h5>
                <h5>Drop Remarks: {details.dropRemarks}</h5>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      <Card>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Drop Details */}
            <Row>
              {/* {details && ( */}
              <Row>
                <Col md="4" sm="12">
                  <div className="mb-1">
                    <Label className="form-label" for="dropDate1">
                      Drop Date <spam style={{ color: "red" }}>*</spam>
                    </Label>
                    <Controller
                      // defaultValue={details ? details.dropDate : ''}
                      control={control}
                      id="dropDate1"
                      name="dropDate1"
                      render={({ field }) => (
                        <Flatpickr
                          required
                          {...field}
                          options={optionsToDate}
                          placeholder="YYYY-MM-DD "
                          className={classnames("form-control", {
                            // 'is-invalid': data !== null && data.dropDate1 === null
                          })}
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col md="4" sm="12" className="mb-1">
                  <div className="mb-1">
                    <Label className="form-label" for="dropTime1">
                      Drop Time <spam style={{ color: "red" }}>*</spam>
                    </Label>
                    <Controller
                      // defaultValue=""
                      control={control}
                      id="dropTime1"
                      name="dropTime1"
                      render={({ field }) => (
                        <Input
                          required
                          placeholder="dropTime1"
                          type="time"
                          invalid={errors.dropTime1 && true}
                          // defaultValue={details.dropTime}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col md="4" sm="12" className="mb-1">
                  <div className="mb-1">
                    <Label className="form-label" for="dropStation">
                      Drop Locaton
                    </Label>
                    <Controller
                      control={control}
                      id="dropStation"
                      name="dropStation"
                      render={({ field }) => (
                        <Input
                          placeholder="StationCode"
                          invalid={errors.dropStation && true}
                          {...field}
                        // defaultValue={details.dropStationCode}
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col md="4" sm="12" className="mb-1">
                  <div className="mb-1">
                    <Label className="form-label" for="dropCarrier">
                      Carrier Code
                    </Label>
                    <Controller
                      // defaultValue=''
                      control={control}
                      id="dropCarrier"
                      name="dropCarrier"
                      render={({ field }) => (
                        <Input
                          placeholder="Carrier Code"
                          invalid={errors.dropCarrier && true}
                          {...field}
                        // defaultValue={details.dropCarrierCode}
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col md="4" sm="8">
                  <div className="mb-1">
                    <Label className="form-label" for="dropTransport1">
                      Transport Type <spam style={{ color: "red" }}>*</spam>
                    </Label>
                    <Controller
                      id="dropTransport1"
                      control={control}
                      name="dropTransport1"
                      render={({ field }) => (
                        <Select
                          required
                          isClearable
                          // defaultValue={defaultReason1}
                          options={TransportTypeOptions}
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          className={classnames("react-select", {
                            // "is-invalid":
                            //   data !== null && data.dropTransport1 === null,
                          })}
                          {...field}
                        // onChange={handleChange1}
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col md="4" sm="12" className="mb-1">
                  <div className="mb-1">
                    <Label className="form-label" for="dropRemarks1">
                      Remarks
                    </Label>
                    <Controller
                      // defaultValue=""
                      control={control}
                      id="dropRemarks1"
                      name="dropRemarks1"
                      render={({ field }) => (
                        <Input
                          placeholder="Remarks"
                          invalid={errors.dropRemarks1 && true}
                          {...field}
                        // defaultValue={details.dropRemarks}
                        />
                      )}
                    />
                  </div>
                </Col>
              </Row>
              {/* // )} */}
            </Row>
            <br></br>
            <br></br>
            <div className="d-flex">
              <Button className="me-1" color="primary" type="submit">
                Submit
              </Button>
              <Button className="me-1" color="primary" onClick={() => { setRateSummary(!rateSummary); }}>
                Cancel Drop
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};
export default PickUpDetails;