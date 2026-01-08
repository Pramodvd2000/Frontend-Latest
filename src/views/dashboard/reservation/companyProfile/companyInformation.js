import { useState } from "react";
import Select from "react-select";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { selectThemeColors } from "@utils";
import { Input, Card, Form, Row, Col, Label, Button, InputGroup } from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import API_URL from '../../../../config'
const defaultValues = {
  accountsName: "",
  addressLine1: "",
  accountType: null,
  commision: null,
  accountManagerID: null,
  email: null,
  addressTwo: null,
  gstID: null,
  financialAssociateID: null,
  secondaryemail: null,
  country: null,
  isActive: null,
  notes: null,
  phoneNumber: null,
  state: null,
  iataNumber: null,
  postalcode: null,
  // rateCode: null,
  city: null,
};

let accountManager = [
  fetchx(API_URL + "/getAccountUser?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      // console.log(resp['data'])
      accountManager = resp["data"];
      // console.log(accountManager)
    }),
];



let countryOptions = [
  fetchx(API_URL + "/getGuestProfileCountry?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      // console.log(resp['data'])
      countryOptions = resp["data"];
      // console.log(countryOptions)
    }),
];


const accountType = [
  { value: "agent", label: "Agent" },
  { value: "company", label: "Company" },
  { value: "group", label: "Group" },
];

localStorage.removeItem('companyData')

const Floor = ({ stepper, data1, toggleModal }) => {
  const [selectedValue, setSelectedOption] = useState("");
  let navigate = useNavigate();
  const { reset, handleSubmit, control } = useForm({ defaultValues });
  const [flag, setflag] = useState(false)
  const { setError, formState: { errors }, } = useForm();
  const handleDropdownChange = (event) => {
    setSelectedOption(event.value);

    console.log(event.value); // print the selected value to console
    if (selectedValue == "agent") {
      console.log("hi");
      //         setitemOptions([{ value: "1", label: "Active" }])
    } else if (selectedValue == "company") {
      console.log("hi");
      //         setitemOptions([{ value: "1", label: "Active" }])
    } else {
      //         setitemOptions({ value: "0", label: "InActive" })
    }
  };


  function modalClose() {
    toggleModal()
  }



  const onSubmit = data => {
    data["accountType"] = selectedValue;
    
    if (
      data.maskedCVVCVC !== null &&
      data.expiryDate !== null
    ) {
      let createmarketGroup = {};
      createmarketGroup = {
        accountName: data.accountsName,
        accountType: selectedValue,
        commision: data.commision ? data.commision : null,
        email: data.email,
        phoneNumber: data.phoneNumber ? data.phoneNumber : null,
        addressLine1: data.addressOne,
        addressLine2: data.addressTwo,
        country: data.country === null ? null : data.country.value,
        state: data.state,
        city: data.city,
        postalCode: data.postalcode,
        isActive: 1,
        gstID: data.gst,
        IATA: data.iataNumber,
        isBTCApproved: null,
        secondaryEmail: data.secondaryemail,
        createdBy: null,
        modifiedBy: null,
        notes: data.notes,
        accountManagerID: data.accountManagerID === null ? null : data.accountManagerID.value,
        financialAssociateID: data.financialAssociateID === null ? null : data.financialAssociateID.value,
        creditLimit: null,
        tenure: null,
        attachment: null,

        // isActive:data.isActive === null ? null : data.isActive.value, 
        // rateCode: data.rateCode === null ? null : data.rateCode.value, 

      };


      // Send the data to the server using fetch
      fetchx(API_URL + "/addAccounts", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createmarketGroup)
      })
        .then(result => result.json())
        .then(resp => {
          localStorage.setItem("companyID", JSON.stringify(resp["data"]));
          if (flag == true) {
            const swalInstance = MySwal.fire({
              text: 'Company Created Successfully!',
              icon: 'success',
              buttonsStyling: false,
              confirmButtonText: 'Close',
              allowOutsideClick: false,
              customClass: {
                confirmButton: 'btn btn-danger'
              }
            });
            swalInstance.then((result) => {
              if (result.isConfirmed) {
                // toggleModal()
                modalClose()
                // navigate('');
              }
            });
            // navigate('');
          }
          else if (flag == false) {
            const swalInstance = MySwal.fire({
              text: 'Company Created Successfully! Please add BTC Details',
              icon: 'success',
              buttonsStyling: false,
              confirmButtonText: 'Close',
              allowOutsideClick: false,
              customClass: {
                confirmButton: 'btn btn-danger'
              }
            });
            swalInstance.then((result) => {
              if (result.isConfirmed) {
                stepper.next();
              }
            });
            // stepper.next(); 
            console.log('Save and next after form submit')
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };



  const handleReset = () => {
    reset({
      accountsName: "",
      addressLine1: "",
      accountType: null,
      commision: null,
      accountManagerID: null,
      email: null,
      addressLine2: null,
      gstID: null,
      financialAssociateID: null,
      secondaryemail: null,
      country: null,
      isActive: null,
      notes: null,
      phoneNumber: null,
      state: null,
      iataNumber: null,
      postalcode: null,
      // rateCode: null,
      city: null,
    });
  };

  return (
    <div>
      <div> <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="accountsName">
                Accounts Name <spam style={{ color: 'red' }}>*</spam>
              </Label>
              <Controller
                defaultValue=""
                control={control}
                id="accountsName"
                name="accountsName"
                render={({ field }) => (
                  <Input
                    required
                    placeholder="Accounts Name"
                    invalid={errors.name && true}
                    {...field}
                    value={data1["accountsName"]}
                  />
                )}
              />
            </div>
          </Col>

          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="addressOne">
                Address 1
              </Label>
              <Controller
                defaultValue=""
                control={control}
                id="addressOne"
                name="addressOne"
                render={({ field }) => (
                  <Input
                    placeholder="Address 1"
                    invalid={errors.addressOne && true}
                    {...field}
                  />
                )}
              />
            </div>
          </Col>

          <Col md="3" sm="12" className="mb-1">
            <div className="mb-1">
              <Label className="form-label" for="accountType">
                Account Types <spam style={{ color: 'red' }}>*</spam>
              </Label>
              <Controller
                id="accountType"
                control={control}
                name="accountType"
                render={({ field }) => (
                  <Select
                    required
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    // defaultValue={colourOptions[1]}
                    name="accountType"
                    options={accountType}
                    isClearable
                    onChange={handleDropdownChange}
                  />
                )}
              />
            </div>
          </Col>
          {selectedValue === "agent" && (
            <Col md="3" sm="12" className="mb-1">
              <div className="mb-1">
                <Label className="form-label" for="commision">
                  commision
                </Label>
                <Controller
                  defaultValue=""
                  control={control}
                  id="commision"
                  name="commision"
                  render={({ field }) => (
                    <Input
                      placeholder="commision"
                      pattern='[0-9]{3}'
                      title='Type Only number.'
                      invalid={errors.commision && true}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col>
          )}

          <Col md="3" sm="12" className="mb-1">
            <div className="mb-1">
              <Label className="form-label" for="accountManagerID">
                Account Manager
              </Label>
              <Controller
                id="accountManagerID"
                control={control}
                name="accountManagerID"
                render={({ field }) => (
                  <Select
                    isClearable
                    options={accountManager}
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    className={classnames("react-select", {
                      // "is-invalid":
                      // data !== null && data.accountManagerID === null,
                    })}
                    {...field}
                  />
                )}
              />
            </div>
          </Col>
          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="emailBasic">
                Email
              </Label>
              <Controller
                defaultValue=""
                control={control}
                id="emailBasic"
                name="emailBasic"
                render={({ field }) => (
                  <Input
                    type="email"
                    placeholder="bruce.wayne@email.com"
                    invalid={errors.emailBasic && true}
                    {...field}
                  />
                )}
              />
            </div>
          </Col>

          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="addressTwo">
                Address 2
              </Label>
              <Controller
                defaultValue=""
                control={control}
                id="addressTwo"
                name="addressTwo"
                render={({ field }) => (
                  <Input
                    placeholder="Address 2"
                    invalid={errors.addressTwo && true}
                    {...field}
                  />
                )}
              />
            </div>
          </Col>
          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="gst">
                GST ID
              </Label>
              <Controller
                defaultValue=""
                control={control}
                id="gst"
                name="gst"
                render={({ field }) => (
                  <Input
                    placeholder="gst"
                    invalid={errors.gst && true}
                    {...field}
                  />
                )}
              />
            </div>
          </Col>
          <Col md="3" sm="12" className="mb-1">
            <div className="mb-1">
              <Label className="form-label" for="financialAssociateID">
                Financial Associate
              </Label>
              <Controller
                id="financialAssociateID"
                control={control}
                name="financialAssociateID"
                render={({ field }) => (
                  <Select
                    // required
                    isClearable
                    options={accountManager}
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    className={classnames("react-select", {
                      // "is-invalid":
                      // data !== null && data.financialAssociateID === null,
                    })}
                    {...field}
                  />
                )}
              />
            </div>
          </Col>
          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="secondaryemail">
                Secondary Email
              </Label>
              <Controller
                defaultValue=""
                control={control}
                id="secondaryemail"
                name="secondaryemail"
                render={({ field }) => (
                  <Input
                    type="secondaryemail"
                    placeholder="Alternative Email"
                    invalid={errors.secondaryemail && true}
                    {...field}
                  />
                )}
              />
            </div>
          </Col>
          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="country">
                Country
              </Label>
              <Controller
                id="country"
                control={control}
                name="country"
                render={({ field }) => (
                  <Select
                    isClearable
                    options={countryOptions}
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    className={classnames("react-select", {
                      // "is-invalid": data !== null && data.country === null,
                    })}
                    {...field}
                  />
                )}
              />
            </div>
          </Col>

          <Col md="3" sm="12" className="mb-1">
            <div className="mb-1">
              <Label className="form-label" for="notes">
                Notes
              </Label>
              <Controller
                defaultValue=""
                control={control}
                id="notes"
                name="notes"
                render={({ field }) => (
                  <Input
                    placeholder=" notes"
                    // pattern="[A-Za-z_]{1,15}"
                    // title=" notes can contain alphabets . It cannnot contain numbers and special characters."
                    // invalid={errors.notes && true}
                    {...field}
                  />
                )}
              />
            </div>
          </Col>
          <Col md='3' sm='12'>
            <div className='mb-1'>
              <Label className='form-label' for='phonenumber'>
                Phone Number
              </Label>
              <InputGroup className='input-group-merge'>

                <Controller
                  id='phone-number'
                  name='phoneNumber'
                  control={control}
                  placeholder='1 234 567 8900'
                  render={({ field }) => (
                    <Cleave
                      {...field}
                      // value={data1['phoneNumber']}
                      className={classnames('form-control', {
                        // 'is-invalid': data !== null && (data.phoneNumber === null || !data.phoneNumber.length)
                      })}
                    // options={{ phone: true, phoneRegionCode: 'IN' }}
                    />
                  )}
                />
              </InputGroup>
            </div>
          </Col>

          <Col md='3' sm='12'>
            <div className='mb-1'>
              <Label className='form-label' for='state'>
                State
              </Label>
              <Controller
                defaultValue=''
                control={control}
                id='state'
                name='state'
                render={({ field }) => <Input
                  // required
                  // pattern='[Aa-Zz ]{1,15}'
                  // title="state should contain alphabets. Cannot contain numbers and special characters." 
                  placeholder='state' invalid={errors.state && true} {...field}
                // value={data1['state']} 
                />}
              />
            </div>
          </Col>

          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="iataNumber">
                IATA Number
              </Label>
              <Controller
                defaultValue=""
                control={control}
                id="iataNumber"
                name="iataNumber"
                render={({ field }) => (
                  <Input
                    placeholder="Last Name"
                    // invalid={errors.iataNumber && true}
                    {...field}
                  />
                )}
              />
            </div>
          </Col>
          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="postalcode">
                Postalcode
              </Label>
              <Controller
                defaultValue=""
                control={control}
                id="postalcode"
                name="postalcode"
                render={({ field }) => (
                  <Input
                    placeholder="postalcode"
                    // invalid={errors.postalcode && true}
                    {...field}
                  />
                )}
              />
            </div>
          </Col>



          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="city">
                City
              </Label>
              <Controller
                defaultValue=""
                control={control}
                id="city"
                name="city"
                render={({ field }) => (
                  <Input
                    placeholder="City"
                    // invalid={errors.city && true}
                    {...field}
                  />
                )}
              />
            </div>
          </Col>
        </Row>
        <div className='d-flex justify-content-between'>
          <div className='d-flex'>
            <Button className='me-1' color='primary' type='submit' onClick={() => setflag(false)}>
              Save And Next
            </Button>
            <Button className="me-1" color="primary" type='submit' onClick={() => setflag(true)}>
              Create Company
            </Button>
            <Button outline color='secondary' type='reset' onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
        {/* <div className="d-flex">
 <Button className="me-1" color="primary" type="submit">
 Save
 </Button>
 <Button className="me-1" outline color="secondary" type="reset" onClick={handleReset}> 
 Reset
 </Button>
 
 </div> */}
      </Form></div>

    </div>
  );
};

export default Floor;