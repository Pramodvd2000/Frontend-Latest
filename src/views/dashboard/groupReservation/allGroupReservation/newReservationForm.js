import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Form, Label, Input, Col, Row } from "reactstrap";
import { Controller, useForm } from 'react-hook-form';
import Flatpickr from 'react-flatpickr';
//import { Card } from "reactstrap";
import Select from "react-select";
import classnames from "classnames";
import { selectThemeColors } from "@utils";
import API_URL from '../../../../config';
import Moment from 'moment';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import { useNavigate } from "react-router-dom"

const NewReservationForm = ({ isOpen, toggle, reservationData,callDefiniteReservation }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
  const [open1, setOpen1] = useState(false);
  const navigate = useNavigate()

  //console.log(reservationData.id)
  
  //const { control, handleSubmit, formState: { errors }, watch } = useForm();
  const { control, handleSubmit, formState: { errors }, watch, reset } = useForm();

  const adultsOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' }
  ];

  const salutations = [
    { value: "Mr", label: "Mr." },
    { value: "Mrs", label: "Mrs." },
    { value: "Ms", label: "Ms." },
    { value: "Dr", label: "Dr." },
    { value: "Mast.", label: "Mast.." },
    { value: "Prof", label: "Prof." },
    { value: "Capt", label: "Capt." },
    { value: "Wg Cdr.", label: "Wg Cdr." },
    { value: "Major.", label: "Major." },
    { value: "Brig", label: "Brig." },
    { value: "Col.", label: "Col." },
    { value: "Lt Col", label: "Lt Col" },
    { value: "Lt", label: "Lt." },
    { value: "Maj Gen.", label: "Maj Gen" }
  ];

  // Flatpickr options for date range
  const optionsFromDate = {
    minDate: reservationData?.arrivalDate,
    maxDate: reservationData?.departureDate,
    dateFormat: 'Y-m-d',
    allowInput: true
  };

  const optionsToDate = {
    minDate: reservationData?.arrivalDate,
    maxDate: reservationData?.departureDate,
    dateFormat: 'Y-m-d',
    allowInput: true
  };



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


  useEffect(() => {
    // Fetch room types
    const fetchRoomTypes = async () => {
      try {
        const response = await fetch(API_URL+'/getroomtype');
        const data = await response.json();
        console.log(data)
        if (data.status === 'success') {
          setRoomTypes(data.data.map(room => ({
            value: room.roomType,
            label: room.roomType
          })));
        }
      } catch (error) {
        console.error('Error fetching room types:', error);
      }
    };

    fetchRoomTypes();
  }, []);

  const clearForm = () => {
    reset({
      roomType: null,
      arrival: null,
      departure: null,
      salutation: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      salutationSharer1: null,
      firstNameSharer1: '',
      lastNameSharer1: '',
      emailSharer1: '',
      phoneSharer1: '',
      salutationSharer2: null,
      firstNameSharer2: '',
      lastNameSharer2: '',
      emailSharer2: '',
      phoneSharer2: ''
    });
    setNumberOfAdults(1);
  };
  

const onSubmit = async (formData) => {
  if(formData.arrival === undefined || formData.departure === undefined){
    return handleError("Arrival/Departure date is mandatory")
   
  }
  setOpen1(true);
  
  const timeout = setTimeout(() => {
    setShowSecondaryMessage(true);
  }, 5000);

  

  // Create base object with common fields
  let jsonDataObj = {
    Room_Type: formData.roomType?.value,
    Arrival_date: Moment(String(new Date(formData.arrival[0]))).format('YYYY-MM-DD'),
    Departure_date: Moment(String(new Date(formData.departure[0]))).format('YYYY-MM-DD'),
    Number_Of_Adults: numberOfAdults,
    Salutation: formData.salutation?.value || '',
    First_Name: formData.firstName,
    Last_Name: formData.lastName || '',
    Email_ID: formData.email || '',
    Phone_Number: formData.phone || ''
  };

  // Add sharer fields based on number of adults
  if (numberOfAdults === 1) {
    // If only 1 adult, set all sharer fields to empty
    jsonDataObj = {
      ...jsonDataObj,
      Salutation_Sharer1: null,
      First_Name_Sharer1: null,
      Last_Name_Sharer1: null,
      Email_ID_Sharer1: null,
      Phone_Number_Sharer1: '',
      Salutation_Sharer2: '',
      First_Name_Sharer2: null,
      Last_Name_Sharer2: null,
      Email_ID_Sharer2: '',
      Phone_Number_Sharer2: ''
    };
  } else if (numberOfAdults === 2) {
    // If 2 adults, include sharer 1 fields and empty sharer 2 fields
    jsonDataObj = {
      ...jsonDataObj,
      Salutation_Sharer1: formData.salutationSharer1?.value || '',
      First_Name_Sharer1: formData.firstNameSharer1 || null,
      Last_Name_Sharer1: formData.lastNameSharer1 || null,
      Email_ID_Sharer1: formData.emailSharer1 || '',
      Phone_Number_Sharer1: formData.phoneSharer1 || '',
      Salutation_Sharer2: '',
      First_Name_Sharer2: '',
      Last_Name_Sharer2: '',
      Email_ID_Sharer2: '',
      Phone_Number_Sharer2: ''
    };
  } else {
    // If 3 adults, include all sharer fields
    jsonDataObj = {
      ...jsonDataObj,
      Salutation_Sharer1: formData.salutationSharer1?.value || '',
      First_Name_Sharer1: formData.firstNameSharer1 || null,
      Last_Name_Sharer1: formData.lastNameSharer1 || null,
      Email_ID_Sharer1: formData.emailSharer1 || '',
      Phone_Number_Sharer1: formData.phoneSharer1 || '',
      Salutation_Sharer2: formData.salutationSharer2?.value || '',
      First_Name_Sharer2: formData.firstNameSharer2 || '',
      Last_Name_Sharer2: formData.lastNameSharer2 || '',
      Email_ID_Sharer2: formData.emailSharer2 || '',
      Phone_Number_Sharer2: formData.phoneSharer2 || ''
    };
  }

  const jsonData = [jsonDataObj];

  try {
    const response = await fetch(API_URL + "/validateGuestUploadForReservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reservationID: reservationData.id,
        jsonData,
      }),
    });

    if (response.status === 200) {
      setShowSecondaryMessage(false);
      setOpen1(false);

      const reservationResponse = await fetch(API_URL + "/definiteGroupReservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationID: reservationData.id,
        }),
      });

      if (reservationResponse.status === 200) {
        MySwal.fire({
          title: "Reservation Creation Successful",
          icon: "success",
        });
        toggle();
       clearForm();
        callDefiniteReservation();
      }
    } else {
      const error = await response.json();
      setShowSecondaryMessage(false);
      setOpen1(false);
      handleError(error.message);
    }
  } catch (error) {
    setOpen1(false);
    handleError(error.message || error);
  } finally {
    clearTimeout(timeout);
  }
};
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-lg">
    <ModalHeader toggle={toggle}>Add New Reservation</ModalHeader>
    <ModalBody>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
         

<Col md='3' sm='12' className='mb-1'>
    <div className="mb-1">
      <Label className="form-label" for="roomType">
        Room Type<spam style={{ color: "red" }}>*</spam>
      </Label>
    <Controller
     id='roomType'
      control={control}
      name='roomType'
      render={({ field }) => (
        <Select
          isClearable
          required
          options={roomTypes}
          classNamePrefix='select'
          theme={selectThemeColors}
        //  className={classnames('react-select', { 'is-invalid': data !== null && data.roomType === null })}
          {...field}
        />
      )}
    />
  </div>
</Col>

          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="numberOfAdults">
                Number of Adults <spam style={{ color: "red" }}>*</spam>
              </Label>
              <Controller
                control={control}
                id="numberOfAdults"
                name="numberOfAdults"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={adultsOptions}
                    placeholder="Select Number"
                    value={adultsOptions.find(opt => opt.value === numberOfAdults)}
                    onChange={(val) => {
                      field.onChange(val);
                      setNumberOfAdults(val.value);
                     // clearSharerFields(val.value);
                    }}
                  />
                )}
              />
            </div>
          </Col>

          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="arrival">
                Arrival Date <spam style={{ color: "red" }}>*</spam>
              </Label>
              <Controller
                control={control}
                id="arrival"
                name="arrival"
                render={({ field }) => (
                  <Flatpickr
                    {...field}
                    required
                    options={optionsFromDate}
                    placeholder="YYYY-MM-DD"
                    className={`form-control ${errors.arrival && 'is-invalid'}`}
                  />
                )}
              />
            </div>
          </Col>

          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="departure">
                Departure Date <spam style={{ color: "red" }}>*</spam>
              </Label>
              <Controller
                control={control}
                id="departure"
                name="departure"
                render={({ field }) => (
                  <Flatpickr
                    {...field}
                    required
                    options={optionsToDate}
                    placeholder="YYYY-MM-DD"
                    className={`form-control ${errors.departure && 'is-invalid'}`}
                  />
                )}
              />
            </div>
          </Col>


<Col md='3' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="salutation">
                    Salutation 
                  </Label>
                  <Controller
                    id="salutation"
                    control={control}
                    name="salutation"
                    render={({ field }) => (
                      <Select
                       // required
                        isClearable
                        options={salutations}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                       
                        {...field}
                        // value={data1['salutation']}
                      />
                    )}
                  />
                </div>
              </Col>

          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="firstName">
                First Name <spam style={{ color: "red" }}>*</spam>
              </Label>
              <Controller
                control={control}
                id="firstName"
                name="firstName"
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="First Name"
                    invalid={errors.firstName && true}
                  />
                )}
              />
            </div>
          </Col>

          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="lastName">
                Last Name <spam style={{ color: "red" }}>*</spam>
              </Label>
              <Controller
                control={control}
                id="lastName"
                name="lastName"
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Last Name"
                    invalid={errors.lastName && true}
                    
                  />
                )}
              />
            </div>
          </Col>

          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="email">
                Email ID
              </Label>
              <Controller
                control={control}
                id="email"
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email"
                  />
                )}
              />
            </div>
          </Col>

          {numberOfAdults >= 2 && (
            <>
      

              <Col md='3' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="salutationSharer1">
                    Salutation Sharer 1
                  </Label>
                  <Controller
                    id="salutationSharer1"
                    control={control}
                    name="salutationSharer1"
                    render={({ field }) => (
                      <Select
                        //required
                        isClearable
                        options={salutations}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                       
                        {...field}
                        // value={data1['salutation']}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="firstNameSharer1">
                    First Name (Sharer 1) <spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id="firstNameSharer1"
                    name="firstNameSharer1"
                    rules={{ required: numberOfAdults >= 2 }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="First Name"
                        invalid={errors.firstNameSharer1 && true}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="lastNameSharer1">
                    Last Name (Sharer 1)<spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id="lastNameSharer1"
                    name="lastNameSharer1"
                    rules={{ required: numberOfAdults >= 2 }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Last Name"
                        invalid={errors.lastNameSharer1 && true}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="emailSharer1">
                    Email ID (Sharer 1)
                  </Label>
                  <Controller
                    control={control}
                    id="emailSharer1"
                    name="emailSharer1"
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="Email"
                      />
                    )}
                  />
                </div>
              </Col>
            </>
          )}

          {numberOfAdults === 3 && (
            <>
<Col md='3' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="salutationSharer2">
                    Salutation Sharer 2
                  </Label>
                  <Controller
                    id="salutationSharer2"
                    control={control}
                    name="salutationSharer2"
                    render={({ field }) => (
                      <Select
                        //required
                        isClearable
                        options={salutations}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                       
                        {...field}
                        // value={data1['salutation']}
                      />
                    )}
                  />
                </div>
              </Col>

              

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="firstNameSharer2">
                    First Name (Sharer 2) <spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id="firstNameSharer2"
                    name="firstNameSharer2"
                    rules={{ required: numberOfAdults === 3 }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="First Name"
                        invalid={errors.firstNameSharer2 && true}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="lastNameSharer2">
                    Last Name (Sharer 2)<spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id="lastNameSharer2"
                    name="lastNameSharer2"
                    rules={{ required: numberOfAdults === 3 }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Last Name"
                        invalid={errors.lastNameSharer2 && true}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="emailSharer2">
                    Email ID (Sharer 2)
                  </Label>
                  <Controller
                    control={control}
                    id="emailSharer2"
                    name="emailSharer2"
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="Email"
                      />
                    )}
                  />
                </div>
              </Col>
            </>
          )}
        </Row>

        <div className="d-flex justify-content-end gap-2 mt-2">
          <Button color="secondary" onClick={toggle}>Cancel</Button>
          <Button color="primary" type="submit">Create Reservation</Button>
        </div>

        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open1}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                                            Please wait while we are updating your reservation
                                        </h1>
                                        {showSecondaryMessage && (
                                            <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                                                We're processing your request, which may take a little longer due to additional data. Please be patient!
                                            </h1>
                                        )}
                                        <CircularProgress color="inherit" />
                                    </div>
                                </Backdrop>
      </Form>
    </ModalBody>
  </Modal>

  
  );
};

export default NewReservationForm;
