import { useState } from "react";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Moment from "moment";
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input, InputGroup, InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter,} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { format } from 'date-fns';
import { useRef, useEffect, useMemo, useCallback } from "react";
import API_URL from "../../../config";
import { useNavigate } from "react-router-dom";
// ** Third Party Components
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import EditVisa from "./editVisaDetails";
const MySwal = withReactContent(Swal);
const defaultValues = {
  reservation: "",
  visaNumber: "",
  guestProfileID: "",
  issueDate: null,
  expiryDate: null,
  attachment: "",
};

const VisaDetails = (data1) => {
  //console.log(data1.data1);
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [idDetail, setIDDetails] = useState();
  const [editVisa, setEditVisaDetails] = useState();
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Reservation",
      field: "reservationID",
      suppressSizeToFit: true,
      // editable: true,
      maxWidth: 160,
    },
    {
      headerName: "Visa Number",
      field: "visaNumber",
      suppressSizeToFit: true,
      // editable: true,
      maxWidth: 160,
    },
    {
      headerName: "Issue Date",
      field: "issueDate",
      suppressSizeToFit: true,
      // editable: true,
      maxWidth: 160,
    },
    {
      headerName: "Expiry Date",
      field: "ExpiryDate",
      suppressSizeToFit: true,
      // editable: true,
      maxWidth: 160,
    },

  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));

  const cellClickedListener = useCallback((event) => {
    //console.log("cellClicked", event);
  }, []);
  //console.log(data1.data1.guestID);

  useEffect(() => {
    // Fetch image URLs when the component mounts
    fetchImageUrls();
  }, []);
  

  useEffect(() => {
    fetchx( API_URL +   `/getGuestVisaDetails?hotelID=1&guestProfileID=${data1.data1.guestID}`)
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData["data"]));
  }, []);

  // useEffect(() => {
  //   if (rowData && Array.isArray(rowData)) {
  //     //console.log(rowData.length);
  //   } else {
  //     //console.log("rowData is undefined or not an array.");
  //   }
  // }, [rowData]);

  const onCellValueChanged = useCallback((event) => {
    //console.log("onCellValueChanged", event);
    //console.log("hiii");
    // const ID = event.data.id
    // const PCODE = event.data.packageCode
    //console.log(event.data);
    const updatedItem = JSON.stringify({
      guestID: event.data.guestID,
      visaNumber: event.data.visaNumber,
      issueDate: event.data.issueDate,
      ExpiryDate: event.data.ExpiryDate,
      // idFile:event.data.idFile,
    });
    
  }, []);

  const [details, setDetails] = useState("");

  
  // Function to fetch image URLs
  const fetchImageUrls = async () => {
    try {
      const response = await fetchx(
        API_URL +`/getS3ImageID?hotelID=1&source=2&documentTypeID=12&docReferenceID=guest_${data1.data1.guestID}` );
      const data = await response.json();
      const imageIDs = data["data"];

      // Fetch each image URL separately
      const imageUrls = await Promise.all(
        imageIDs.map(async (imageID) => {
          const imageResponse = await fetchx(
            API_URL + `/images/${imageID["documentID"]}`
          );
        // const imageResponse = await fetchx(`http://13.234.187.190:14702/v4/images/${imageID['documentID']}`);
        const clonedImageResponse = imageResponse.clone(); // Clone the response
        const blob = await clonedImageResponse.blob()
          if (blob.type !== "text/html") {
            // Create a URL for the blob data
            const fileUrl = URL.createObjectURL(blob);
            return fileUrl;
          }
          return null; // Skip non-image data
        })
      );

      // Filter out null values (non-image data)
      const filteredImageUrls = imageUrls.filter((url) => url !== null);

      // Set the images state with the filtered image URLs
      setImages(filteredImageUrls);
      //console.log("All images fetched successfully");
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };



  const handleFileChange = (event) => {
    //console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  //console.log(details);
  // ** State
  const [data, setData] = useState(null);
  const [bookingInfo, setBookingInfo] = useState();

  // ** Hooks
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues });
  const beginDate = watch("beginDate");
  //console.log(beginDate);
  const today = Moment().format("YYYY-MM-DD");
  const options = {
    maxDate: today,
  };
  const options1 = {
    minDate: today,
  };

  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("hotelID", 1);
  formData.append("source", 2);
  formData.append("doctype", 12);
  formData.append("docrefno", "guest_" + data1.data1.guestID);

  const handleViewImageClick = (imageData, index) => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const windowWidth = 800; // Set your desired width
    const windowHeight = 600; // Set your desired height
    const left = (screenWidth - windowWidth) / 2;
    const top = (screenHeight - windowHeight) / 2;

    const imagePopup = window.open(
      "",
      "ImagePopup",
      `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`
    );
    if (imagePopup) {
      imagePopup.document.open();
      imagePopup.document.write(`
        <img src="${imageData}" alt="File" style="max-width: 100%;">
        <br>
        <a href="${imageData}" download="attachment_${
        index + 1
      }.png">Download PNG</a>
        <a href="${imageData}" download="attachment_${
        index + 1
      }.pdf">Download PDF</a>
      `);
      imagePopup.document.close();
    }
  };

  let navigate = useNavigate();
  const onSubmit = (data) => {
    //console.log(formData);

    fetchx(API_URL + "/imgupload", {
    // fetchx('http://13.234.187.190:14702/v4/imgupload', {

      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        fetchImageUrls();
        // const imageBody = JSON.stringify({
        //   hotelID: 1,
        //   source: 2,
        //   documentTypeID: 12,
        //   docReferenceID: "guest_" + data1.data1.guestID,
        //   documentID:
        //     result["message"] === undefined
        //       ? null
        //       : result["message"]["uploadedimagelink"],
        // });

        // fetchx(API_URL + "/insertImageToS3", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: imageBody,
        // })
        //   .then((response) => response.json())
        //   .then((result) => {
        //     fetchImageUrls();
        //     //console.log(result);
        //   })
        //   .catch((error) => {
        //     console.error("Error:", error);
        //   });
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    setData(data);
      console.log(data)
    if (
      data.reservation !== null &&
      data.visaNumber !== null &&
      data.guestProfileID !== null &&
      (data.issueDate !== null) & (data.expiryDate !== null)
    ) {
      //console.log(data);
      let createmarketGroup = JSON.stringify({
        reservationID: data1.data1.id,
        visaNumber: data.visaNumber,
        guestProfileID: data1.data1.guestID,
        // issueDate: Moment(String(new Date(data.issueDate[0]))).format(
        //   "YYYY-MM-DD"
        // ),
        issueDate:format(new Date(data.issueDate[0]), 'yyyy-MM-dd'),
        ExpiryDate:format(new Date(data.expiryDate[0]), 'yyyy-MM-dd'),
        // ExpiryDate: Moment(String(new Date(data.expiryDate[0]))).format(
        //   "YYYY-MM-DD"
        // ),
        // attachment: file.pdf
      });
      //console.log(createmarketGroup);
      let res = fetchx(API_URL + "/visaDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: createmarketGroup,
      })
        .then((result) => result.json())
        .then((res) => {
          //console.log(res);
          // navigate('')
          if (res["statusCode"] == 200) {
            const swalInstance = MySwal.fire({
              text: res.message,
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
                fetchx(
                  API_URL +
                    `/getGuestVisaDetails?hotelID=1&guestProfileID=${data1.data1.guestID}`
                )
                  .then((result) => result.json())
                  .then((rowData) => {
                    setRowData(rowData["data"]);
                    //console.log(rowData["data"]);
                  });
                setIDDetails(false);
              }
            });
          }
          if (res["statusCode"] == 403) {
            const swalInstance = MySwal.fire({
              text: res.message,
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Close",
              allowOutsideClick: false,
              customClass: {
                confirmButton: "btn btn-danger",
              },
            });
            swalInstance.then((result) => {
              if (result.isConfirmed) {
                setIDDetails(false);
              }
            });
          }
        });
    }
  };

  const navigatepage = () => {
    navigate("");
  };

  const handleReset = () => {
    reset({
      reservation: "",
      visaNumber: "",
      guestProfileID: "",
      issueDate: null,
      expiryDate: null,
      attachment: "",
    });
  };

  return (
    <div>
      <div>
        <Modal
          isOpen={editVisa}
          toggle={() => setEditVisaDetails(!editVisa)}
          className="modal-lg"
        >
          <ModalHeader
            className="modal-lg"
            toggle={() => setEditVisaDetails(!editVisa)}
          >
            {" "}
            Modify Visa Information
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <EditVisa data1={data1.data1} />
          </ModalBody>
        </Modal>
      </div>

      <Modal
        isOpen={idDetail}
        toggle={() => setIDDetails(!idDetail)}
        className="modal-lg"
      >
        <ModalHeader
          className="modal-lg"
          toggle={() => setIDDetails(!idDetail)}
        >
          Add Visa Details
        </ModalHeader>
        <ModalBody className="pb-3 px-sm-5 mx-20">
          <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md="4" sm="12">
                  <div className="mb-1">
                    <Label className="form-label" for="visaNumber">
                      Visa Number
                    </Label>
                    <InputGroup className="input-group-merge">
                      <Controller
                        id="visaNumber"
                        name="visaNumber"
                        control={control}
                        placeholder="visaNumber"
                        render={({ field }) => (
                          <Cleave
                            {...field}
                            className={classnames("form-control", {
                              // 'is-invalid': data !== null && (data.visaNumber === null || !data.visaNumber.length)
                            })}
                            // options={{ phone: true, phoneRegionCode: 'US' }}y
                          />
                        )}
                      />
                    </InputGroup>
                  </div>
                </Col>

                <Col md="4" sm="12">
                  <div className="mb-1">
                    <Label className="form-label" for="issueDate">
                      Issue Date
                    </Label>
                    <Controller
                      control={control}
                      id="issueDate"
                      name="issueDate"
                      render={({ field }) => (
                        <Flatpickr
                          {...field}
                          options={options}
                          className={classnames("form-control", {
                            "is-invalid":
                              data !== null && data.issueDate === null,
                          })}
                        />
                      )}
                    />
                  </div>
                </Col>

                <Col md="4" sm="12">
                  <div className="mb-1">
                    <Label className="form-label" for="expiryDate">
                      Expiry Date
                    </Label>
                    <Controller
                      control={control}
                      id="expiryDate"
                      name="expiryDate"
                      render={({ field }) => (
                        <Flatpickr
                          {...field}
                          options={options1}
                          className={classnames("form-control", {
                            "is-invalid":
                              data !== null && data.expiryDate === null,
                          })}
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col md="6" sm="12" className="mb-1">
                  <div className="mb-1">
                    <Label className="form-label" for="attachment">
                      Upload File
                    </Label>
                    <Controller
                    
                      control={control}
                      id="attachment"
                      name="attachment"
                      placeholder="Add Attachment"
                      render={({}) => (
                        <Input type="file" onChange={handleFileChange} />
                      )}
                    />
                  </div>
                </Col>

                <br />

                <br />
                <h3> &nbsp;&nbsp;List of Visa Attachments </h3>
                <br />

                {images.map((imageData, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <h4>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Visa Attachment{" "}
                      {index + 1}: &nbsp;&nbsp;
                    </h4>
                    <br />
                    <Button
                      onClick={() => handleViewImageClick(imageData)}
                      color="primary"
                    >
                      View Attachment {index + 1}
                    </Button>
                    <br></br>
                    <br></br>
                    <br></br>
                  </div>
                ))}

                {/* <Attachments/> */}
                <div className="d-flex">
                  {/* <Button className='me-1' color='primary'   onClick={() =>{ setBookingInfo(!bookingInfo)}}>
                  View Visa Details
                </Button> */}
                  <Button className="me-1" color="primary" type="submit">
                    Submit
                  </Button>
                  <Button
                    outline
                    color="secondary"
                    type="reset"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
              </Row>
            </Form>
          </div>
        </ModalBody>
      </Modal>

      <div>
        <Row>
          <Col md="3" sm="12">
            Arrival :<b> {data1.data1["arrivalDate"] + " " + data1.data1["ETA"]} </b>{" "}
            <br></br>
            Departure:
            <b>
              {" "}
              {data1.data1["departureDate"] + " " + " " + " " + data1.data1["ETD"]}{" "}
            </b>{" "}
            <br></br>
          </Col>
          <Col md="3" sm="12">
            Adults : <b> {data1.data1["numberOfAdults"]} </b> <br></br>
            Children : <b> {data1.data1["numberOfChildren"]} </b> <br></br>
          </Col>
          <Col md="3" sm="12">
            Number Of Rooms : <b> {data1.data1["numberOfRooms"]} </b> <br></br>
            {/* Package : <b> {data1.data1["packageCode"]} </b> */}
            {/* <br></br> */}
            Rate: <b>{data1.data1["totalCostOfStay"]} </b>
            <br></br>
          </Col>
          <Col md="3" sm="12">
            GuestName :
            <b>
              
              {data1.data1["guestName"] }
            </b>
            <br></br>
            Company Name :<b> {data1.data1["accountName"]} </b> <br></br>
          </Col>
        </Row>

        <div className="ag-theme-alpine" style={{ height: 220 }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            animateRows={true}
            rowSelection="multiple"
            onCellClicked={cellClickedListener}
            // paginationAutoPageSize = 'true'
            onCellValueChanged={onCellValueChanged}
            // paginationPageSize='10'
            // pagination='true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
          />
        </div>

        <br></br>
        <br></br>
        <br />
                <h3> &nbsp;&nbsp;List of Visa Attachments </h3>
                <br />

                {images.map((imageData, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <h4>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Visa Attachment{" "}
                      {index + 1}: &nbsp;&nbsp;
                    </h4>
                    <br />
                    <Button
                      onClick={() => handleViewImageClick(imageData)}
                      color="primary"
                    >
                      View Attachment {index + 1}
                    </Button>
                    <br></br>
                    <br></br>
                    <br></br>
                  </div>
                ))}


        <div align="end" className="buttons">
          {
            rowData !== undefined && rowData.length !==0 && 
            <Button
            color="primary"
            className="me-1"
            type="submit"
            onClick={() => {
              setEditVisaDetails(!editVisa);
            }}
          >
            Edit Visa Details
          </Button>
          }

          {rowData !== undefined && rowData.length ===0 && <Button
            color="primary"
            className="me-1"
            type="submit"
            onClick={() => {
              setIDDetails(!idDetail);
            }}
          >
            Add Visa Details
          </Button> }
          <Button
            color="primary"
            className="me-1"
            type="button"
            onClick={navigatepage}
          >
            Exit
          </Button>
        </div>
      </div>

      
    </div>
  );
};
export default VisaDetails;