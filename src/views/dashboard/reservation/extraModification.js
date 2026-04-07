import { useState } from "react";
import Select from "react-select";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { selectThemeColors } from "@utils";
import { Input, Card, Form, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText, Row, Col, Modal, ModalHeader, ModalBody, } from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import { useRef, useEffect, useMemo, useCallback } from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, UncontrolledAccordion } from 'reactstrap'
import API_URL from "../../../config";
import { use } from "react";
import { auto } from "@popperjs/core";
import Moment from 'moment'


const defaultValues = {
  // hotelID: "",
  extraCode: '',
  description: "",
  remarks: "",
  type: null,
  percentage: "",
  amount: "",
  pieces: '',
  trips: "",
  isActive: null
};

const Extras = ({ data1, eta, etd, toggleModal }) => {
  console.log(data1,  eta, etd)
  const [open, setOpen] = useState('')
  const toggle = id => { open === id ? setOpen() : setOpen(id) }
  let navigate = useNavigate();
  const [selectedValue, setSelectedOption] = useState('');
  const [rowData, setRowData] = useState();
  const [extraData, setExtraData] = useState();
  const gridRef = useRef();
  const [show, actionButton] = useState(false);
  const [data, setData] = useState(null);
  const [value, setValue] = useState('')
  const { reset, handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
  const [filldata, setfilldata] = useState({});
  const [extraName, setExtraName] = useState([])
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [confirmRemove, setCofirmRemove] = useState(false)
    const [tempReservationData, setTempReservationData] = useState([]);
    const [tempReservationModal, setTempReservationModal] = useState(false);
    const [selectedReservations, setSelectedReservations] = useState([]);

  useEffect(() => {
    fetchx(API_URL + `/getExtraForReservation?reservationID=${sessionStorage.getItem('reservationid') || null}&operation=Creation`)
      .then(result => result.json())
      .then(resp => {
        // //console.log(resp['data'])
        setExtraName(resp['data'])
        //console.log(extraName)
      })
  }, [])

  useEffect(() => {
    const ExtraParams = JSON.stringify({
      rateCodeID: sessionStorage.getItem('rateCodeCorporate'),
      hotelID: 1
    })
    const fetchData = async () => {
      try {
        const response = await fetchx(API_URL + '/getDefaultExtras', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: ExtraParams
        });

        if (response.ok) {
          const data = await response.json();
          const defaultOptionsFromAPI = data['data'];

            let createExtra = JSON.stringify({

      extraID: data.extras.value,
      reservationID: sessionStorage.getItem('reservationid'),
      operation: 'Creation'
    });

    let res = fetchx(API_URL + "/addReservationExtrasByExtraID", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: createExtra,
    })
      .then(result => result.json())
      .then((res) => {
        // navigate('');

        if (res.statusCode === 200) {
          handleReset()
          fetchx(API_URL + `/getExtraForReservationBYID?reservationID=${sessionStorage.getItem('reservationid') || null}&operation=Creation`)
            .then(result => result.json())
            .then(rowData => {
              setRowData(rowData['data'])
toggleModal(rowData['data'])

            })

              fetchx(API_URL + `/getExtraForReservation?reservationID=${sessionStorage.getItem('reservationid') || null}&operation=Creation`)
      .then(result => result.json())
      .then(resp => {
        // //console.log(resp['data'])
        setExtraName(resp['data'])
        //console.log(extraName)
      })
            
            setConfirmSubmit(false)
          handleSuccess({ title: "Extra Added Successfully", text: "The extra has been added to the reservation successfully." })
        } else {
          console.log(res)
          handleError(res.message)
        }


      });
          
        } else { }
      } catch (error) { }
    };

    fetchData();
  }, [sessionStorage.getItem('rateCodeCorporate')]);


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

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Extra Code', field: 'extraCode', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Description', field: 'description', width: 380 },
    // { headerName: 'Type', field: 'type', suppressSizeToFit: true,  maxWidth: 140 },
    {
      headerName: "Action", field: "numAvlRooms", suppressSizeToFit: true, maxWidth: 140,
      cellRendererFramework: (params) => (
        <Button color="primary" onClick={() => setCofirmRemove(!confirmRemove)}> Remove  </Button>),
    },

  ]);

    const tempReservationColumnDefs = [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 50,
        suppressMenu: true,
        resizable: false,
      },
      {
        headerName: "Guest Name",
        field: "fullName",
        maxWidth: 150,
        autoHeaderHeight: true,
        wrapHeaderText: true,
      },
      {
        headerName: "Booking ID",
        field: "bookingID",
        maxWidth: 130,
        autoHeaderHeight: true,
        wrapHeaderText: true,
      },
      {
        headerName: "Sharing ID",
        field: "sharingID",
        maxWidth: 130,
        autoHeaderHeight: true,
        wrapHeaderText: true,
      },
  
      {
        headerName: "Arrival Date",
        field: "arrivalDate",
        maxWidth: 140,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        cellRenderer: (params) => {
          if (params.data && params.data.arrivalDate) {
            const formattedDate = Moment(params.data.arrivalDate).format(
              "DD-MM-YYYY"
            );
            return formattedDate;
          } else {
            return "";
          }
        },
      },
      {
        headerName: "Departure Date",
        field: "departureDate",
        suppressSizeToFit: true,
        maxWidth: 140,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        cellRenderer: (params) => {
          if (params.data && params.data.departureDate) {
            const formattedDate = Moment(params.data.departureDate).format(
              "DD-MM-YYYY"
            );
            return formattedDate;
          } else {
            return "";
          }
        },
      },
    ];


  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      wrapText: true,
      autoHeight: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));

  const cellClickedListener = useCallback(event => {
    console.log(event["data"])
    setExtraData(event['data'])
    setfilldata(event['data']['extraID'])
  }, []);

  useEffect(() => {
    fetchx(API_URL + `/getExtraForReservationBYID?reservationID=${sessionStorage.getItem('reservationid') || null}&operation=Creation`)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
toggleModal(rowData['data'])

      })
  }, []);

toggleModal(rowData)

      const toggleTempReservationModal = () => {
    setTempReservationModal(prev => !prev);
    
    // Reset selectedReservations when closing the modal
    if (tempReservationModal) {
      setSelectedReservations([]);
    }
  };

 const handleUpdateRates = async () => {
        // Check if any reservations are selected
        if (selectedReservations.length === 0) {
          Swal.fire({
            title: "Error",
            text: "Please select at least one reservation",
            icon: "error",
          });
          return;
        }
      
        try {

          const sharingIDs = selectedReservations.map(reservation => reservation.sharingID);
          const reservationIDs =  selectedReservations.map(reservation => reservation.id);
      
          const requestBody = {
            reservationIDs:reservationIDs,
            sharingIDs: sharingIDs,
            reservationID: data1.id
          };
      
          const response = await fetch(`${API_URL}/modifyBookingInfoOfGroupReservations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
          });
      
          const result = await response.json();
      
          if (result.statusCode === 200) {
            Swal.fire({
              title: "Success",
              text: result.message || "Reservations updated successfully",
              icon: "success",
            });
      
            // Close the modal
            setTempReservationModal(false);
          } else {
            Swal.fire({
              title: "Error",
              text: result.message || "Failed to update reservations",
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Error updating reservations:", error);
          Swal.fire({
            title: "Error",
            text: "An unexpected error occurred",
            icon: "error",
          });
        }
      };

      
  const onSubmit = (data) => {

    setData(data);
    console.log(data.extras.value)
    let createExtra = JSON.stringify({

      extraID: data.extras.value,
      reservationID: sessionStorage.getItem('reservationid'),
      operation: 'Creation'
    });

    let res = fetchx(API_URL + "/addReservationExtrasByExtraID", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: createExtra,
    })
      .then(result => result.json())
      .then((res) => {
        // navigate('');

        if (res.statusCode === 200) {
          handleReset()
          fetchx(API_URL + `/getExtraForReservationBYID?reservationID=${sessionStorage.getItem('reservationid') || null}&operation=Creation`)
            .then(result => result.json())
            .then(rowData => {
              setRowData(rowData['data'])
toggleModal(rowData['data'])

            })

              fetchx(API_URL + `/getExtraForReservation?reservationID=${sessionStorage.getItem('reservationid') || null}&operation=Creation`)
      .then(result => result.json())
      .then(resp => {
        // //console.log(resp['data'])
        setExtraName(resp['data'])
        //console.log(extraName)
      })
            
            setConfirmSubmit(false)
          handleSuccess({ title: "Extra Added Successfully", text: "The extra has been added to the reservation successfully." })
        } else {
          console.log(res)
          handleError(res.message)
        }


      });


  };


   const handleRemoveExtra = (data) => {

    setData(data);
    let createExtra = JSON.stringify({

      extraID: filldata,
      reservationID: sessionStorage.getItem('reservationid'),
      operation: 'Creation'
    });

    let res = fetchx(API_URL + "/deleteReservationExtrasBYID", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: createExtra,
    })
      .then(result => result.json())
      .then((res) => {
        // navigate('');

        if (res.statusCode === 200) {
          fetchx(API_URL + `/getExtraForReservationBYID?reservationID=${sessionStorage.getItem('reservationid') || null}&operation=Creation`)
            .then(result => result.json())
            .then(rowData => {
              setRowData(rowData['data'])
toggleModal(rowData['data'])

            })
             fetchx(API_URL + `/getExtraForReservation?reservationID=${sessionStorage.getItem('reservationid') || null}&operation=Creation`)
      .then(result => result.json())
      .then(resp => {
        // //console.log(resp['data'])
        setExtraName(resp['data'])
        //console.log(extraName)
      })
            setCofirmRemove(false)
          handleSuccess({ title: "Extra Added Successfully", text: "The extra has been added to the reservation successfully." })
        } else {
          console.log(res)
          handleError(res.message)
        }


      });


  };


  const handleChange = event => {
    console.log(event)
    setValue(event.value)
  }

  const handleReset = () => {
    reset({

      extras: null
    });
  };

  return (
    <div>

      <div>

        <Card>
          <CardHeader>
            <CardTitle tag="h4">Extras</CardTitle>
          </CardHeader>
     
          <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>

                <Col md='4' sm='8'>
                  <div className='mb-1'>
                    <Label className='form-label' for='extras' >
                      Select Extra
                    </Label>
                    <Controller
                      id='extras'
                      control={control}
                      name='extras'
                      rules={{ required: "Extra is required" }}

                      render={({ field }) => (
                        <Select
                          // isMulti
                          required
                          isClearable
                          // defaultValue={defaultReason}
                          options={extraName}
                          classNamePrefix='select'
                          theme={selectThemeColors}
                          // className={classnames('react-select', { 'is-invalid': data !== null && data.extras === null })}
                          className={classnames('react-select', {
                            'is-invalid': errors.extras
                          })}
                          {...field}
                          // onChange={handleChange}
                          onChange={(selected) => {
                            field.onChange(selected)   // important for react-hook-form
                            handleChange(selected)     // your custom function
                          }}

                        />
                      )}
                    />
                  </div>
                </Col>



                <div className="d-flex">
                  <Button className="me-1" color="primary" onClick={handleSubmit(() => setConfirmSubmit(true))}>
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
          </CardBody>
        </Card>

      </div>

      <br></br>
      {/* AG Grid */}
      <div className="ag-theme-alpine" style={{ height: 540 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData} columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          paginationPageSize='10'
          pagination='true'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"

        />
      </div>

      <Modal isOpen={confirmSubmit} toggle={() => setConfirmSubmit(!confirmSubmit)} className='modal-dialog-centered'>
        <ModalHeader className='bg-transparent' toggle={() => setConfirmSubmit(!confirmSubmit)}></ModalHeader>
        <ModalBody className='text-center mb-2'>

          <div className='text-center mb-2'>
            <h5><b>"Do You Want Add Extra ?"</b></h5>

            <div className="button-container text-center">
              <Button className="me-1" color="primary" onClick={handleSubmit(onSubmit)}>
                Confirm
              </Button>
              <Button className="me-1" color="primary" onClick={() => setConfirmSubmit(false)}>
                Back
              </Button>

            </div>

          </div>
        </ModalBody>
      </Modal>

        <Modal isOpen={confirmRemove} toggle={() => setCofirmRemove(!confirmRemove)} className='modal-dialog-centered'>
        <ModalHeader className='bg-transparent' toggle={() => setCofirmRemove(!confirmRemove)}></ModalHeader>
        <ModalBody className='text-center mb-2'>

          <div className='text-center mb-2'>
            <h5><b>"Do You Want to Remove Extra ?"</b></h5>

            <div className="button-container text-center">
              <Button className="me-1" color="primary" onClick={handleRemoveExtra}>
                Confirm
              </Button>
              <Button className="me-1" color="primary" onClick={() => setCofirmRemove(false)}>
                Back
              </Button>

            </div>

          </div>
        </ModalBody>
      </Modal>


        
          {/* Temporary Reservations Modal */}
      <Modal
        isOpen={tempReservationModal}
        //toggle={() => setTempReservationModal(!tempReservationModal)}
        toggle={toggleTempReservationModal}
        className="modal-dialog-centered modal-lg"
        // style={{ maxWidth: '700px', width: '700px', margin: 'auto' }}
      >
        <ModalHeader
         toggle={toggleTempReservationModal}
        >
          Select Reservations
        </ModalHeader>
        <ModalBody>
          <div
            className="ag-theme-alpine"
            style={{ height: 500, width: "100%" }}
          >
            <AgGridReact
              rowData={tempReservationData}
              columnDefs={tempReservationColumnDefs}
              rowSelection="multiple"
              suppressRowClickSelection={true} // This can help prevent unintended deselections
              onSelectionChanged={(params) => {
                const selectedRows = params.api.getSelectedRows();
                setSelectedReservations(selectedRows);
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <Button 
                color="primary" 
                onClick={handleUpdateRates}
                disabled={selectedReservations.length === 0}
                >
                Update
                </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Extras;