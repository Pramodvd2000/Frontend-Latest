
// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { format } from "date-fns";
import { Card, CardHeader, CardText, CardTitle, Label, Col, Input, Row, Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import API_URL from '../../../../config';
import { useForm, Controller } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import Moment from 'moment';
import classnames from "classnames";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)




const CancelIndividualReservation = ({ reservationData }) => {

  const [tempReservationData, setTempReservationData] = useState([]);
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [openReasonModal, setReasonModal] = useState(false);
  const [reason, setReason] = useState([]);
  const [valueReason, setValueReason] = useState();
  const [labelReason, setLabelReason] = useState();


  console.log(selectedReservations)

  const handleChange = (selectedOption) => {
    setValueReason(selectedOption.value);
    setLabelReason(selectedOption.label)
    //console.log(selectedOption.label)
  };



  const handleSuccess = () => {
    return MySwal.fire({
      title: 'Cancel Reservation!!',
      text: 'Successfully cancelled the reservation',
      icon: 'success',
    })
  }

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





  // ** Hooks
  const { reset, handleSubmit, control, watch, formState: { errors }
  } = useForm({});

  const gridRef = useRef();


  const handleReset = () => {
    reset({
      reasonText: "",
    
    });
  };



  useEffect(() => {

    fetchx(API_URL + '/getReasonByID?reasonGroupID=8')
      .then(result => result.json())
      .then(resp => {
        //console.log(resp['data'])
        setReason(resp['data'])

      })


    const jsonData = JSON.stringify({
      blockCodeID: reservationData.id
    })
    fetchx(API_URL + "/fetchGroupReservatioIndividual", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: jsonData
    }).then((res) => res.json())
      .then(result => {
        if (result.statusCode === 200) {
          setTempReservationData(result.data)
        }
      })
  }, [])


  const tempReservationColumnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
      suppressMenu: true,
      resizable: false,
    },
    {
      headerName: "Room Type",
      field: "roomType",
      maxWidth: 130,
      autoHeaderHeight: true,
      wrapHeaderText: true,
      filter: 'agTextColumnFilter',
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
      headerName: "Arrival Date",
      field: "arrivalDate",
      maxWidth: 140,
      autoHeaderHeight: true,
      wrapHeaderText: true,
      cellRenderer: (params) => {
        if (params.data && params.data.arrivalDate) {
          return Moment(params.data.arrivalDate).format("DD-MM-YYYY");
        }
        return "";
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
          return Moment(params.data.departureDate).format("DD-MM-YYYY");
        }
        return "";
      },
    },
  ];


  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));

  function cancelReservationReasonModal() {
    setReasonModal(true)

  }


  function cancelReservation() {
    const hotelID = JSON.stringify({
      reservationData: selectedReservations,
      reason: valueReason,
      reasonText: document.getElementById('reasonText').value,
      noShow: labelReason,
    })
    fetchx(API_URL + "/cancelReservationGroupInd", {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: hotelID
    }).then((res) => res.json())
      .then(result => {

        console.log(result)
        if (result.statusCode === 200) {
          setReasonModal(false)
          setSelectedReservations([]);
          setValueReason()
          setLabelReason()
          handleReset()
          const jsonData = JSON.stringify({
            blockCodeID: reservationData.id
          })
          fetchx(API_URL + "/fetchGroupReservatioIndividual", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: jsonData
          }).then((res) => res.json())
            .then(result => {
              if (result.statusCode === 200) {
                setTempReservationData(result.data)
              }
            })

          handleSuccess()
        }
        else {
          handleError(result.message)

        }
      })
  }

  return (
    <div>
      <Card>
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
              const selectedIds = selectedRows.map(row => row.id); // Extracts all 'id' values

              console.log(selectedIds)
              setSelectedReservations(selectedRows);
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
          <Button color="primary" onClick={() => cancelReservationReasonModal()}>
            Proceed
          </Button>
        </div>
      </Card>


      <Modal
        isOpen={openReasonModal}
        toggle={() => setReasonModal(!openReasonModal)}
        // toggle={openReasonModal}
        className='modal-dialog-centered'
      // style={{ maxWidth: '700px', width: '700px', margin: 'auto' }}
      >
        <ModalHeader toggle={() => setReasonModal(!openReasonModal)}>
          Select Reason for Cancellation
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md='6' sm='12' >
              <div className="mb-1">
                <Label className="form-label" for="reason">
                  Select Reason <spam style={{ color: 'red' }}>*</spam>
                </Label>
                <Controller
                  id='reason'
                  control={control}
                  name="reason"
                  render={({ field }) => (
                    <Select
                      required
                      isClearable
                      options={reason}
                      classNamePrefix="select"
                      theme={selectThemeColors}
                      className={classnames('react-select',)}
                      {...field}
                      onChange={handleChange} // Add onChange event handler
                    />
                  )}
                />
              </div>
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='reasonText'>
                  Reason Remarks
                </Label>
                <Controller
                  id='reasonText'
                  name='reasonText'
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <Input
                      // required
                      {...field}
                      id='reasonText'

                      placeholder='Reason Remarks'
                      className={classnames('form-control')}
                    //   value={document.getElementById('reason') ? document.getElementById('reason') : null
                    //  }
                    // value={labelReason ? labelReason : null}
                    // value={field.value === labelReason ? labelReason : field.value}

                    />
                  )}
                />
              </div>
            </Col>
            <Col md="6" sm="12" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button className="me-1" color="danger" style={{ whiteSpace: 'nowrap' }} onClick={() => {
                if (valueReason === null || valueReason === undefined) { handleError("Please Select the Reason") }
                else { cancelReservation() }
              }}>
                Cancel Reservation
              </Button>
              <Button outline color="secondary" className="me-1" onClick={() => setReasonModal(!openReasonModal)}>
                Cancel
              </Button>
            </Col>

          </Row>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default CancelIndividualReservation;