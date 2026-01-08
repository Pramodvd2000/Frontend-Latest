// ** React Imports
import { useState } from "react";
import { AlertCircle } from 'react-feather'
// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Moment from "moment";
import React from "react";
import { selectThemeColors } from "@utils";
import API_URL from "../../../config";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Card,
  Form,
  Row,
  Col,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  InputGroup,
  InputGroupText,
  Alert
} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from "react";
// const id = '1';
import { useNavigate } from "react-router-dom";
// ** Third Party Components
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const defaultValues = {
  salutation1: null,
  name1: "",
  lastName1: "",
  email1: "",
  phoneNumber: "",
  gstID: "",
  nationality: null,
  dob: "",
  vipID: null,
  addressOne1: "",
  addressTwo: "",
  anniversary1: "",
  companyID1: null,
  country1: null,
  states1: "",
  notes: "",
  city: "",
  postalCode1: "",
  guestpreferencenotes1: null,
};

let companyID = [
  fetchx(API_URL + "/getGuestProfileCompanyID?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      companyID = resp["data"];
    }),
];


let vipID = [
  fetchx(API_URL + "/getGuestProfileVipID?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      vipID = resp["data"];
    }),
];

let countryOptions = [
  fetchx(API_URL + "/getGuestProfileCountry?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      countryOptions = resp["data"];
    }),
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
];
const countryCodes = [
  { value: '+93', label: '+93'},
{ value: '+358', label: '+358'},
{ value: '+355', label: '+355'},
{ value: '+213', label: '+213'},
{ value: '+1684', label: '+1684'},
{ value: '+376', label: '+376'},
{ value: '+244', label: '+244'},
{ value: '+1264', label: '+1264'},
{ value: '+672', label: '+672'},
{ value: '+1268', label: '+1268'},
{ value: '+54', label: '+54'},
{ value: '+374', label: '+374'},
{ value: '+297', label: '+297'},
{ value: '+61', label: '+61'},
{ value: '+43', label: '+43'},
{ value: '+994', label: '+994'},
{ value: '+1242', label: '+1242'},
{ value: '+973', label: '+973'},
{ value: '+880', label: '+880'},
{ value: '+1246', label: '+1246'},
{ value: '+375', label: '+375'},
{ value: '+32', label: '+32'},
{ value: '+501', label: '+501'},
{ value: '+229', label: '+229'},
{ value: '+1441', label: '+1441'},
{ value: '+975', label: '+975'},
{ value: '+591', label: '+591'},
{ value: '+599', label: '+599'},
{ value: '+387', label: '+387'},
{ value: '+267', label: '+267'},
{ value: '+55', label: '+55'},
{ value: '+246', label: '+246'},
{ value: '+673', label: '+673'},
{ value: '+359', label: '+359'},
{ value: '+226', label: '+226'},
{ value: '+257', label: '+257'},
{ value: '+855', label: '+855'},
{ value: '+237', label: '+237'},
{ value: '+1', label: '+1'},
{ value: '+238', label: '+238'},
{ value: '+1345', label: '+1345'},
{ value: '+236', label: '+236'},
{ value: '+235', label: '+235'},
{ value: '+56', label: '+56'},
{ value: '+86', label: '+86'},
{ value: '+57', label: '+57'},
{ value: '+269', label: '+269'},
{ value: '+242', label: '+242'},
{ value: '+682', label: '+682'},
{ value: '+506', label: '+506'},
{ value: '+225', label: '+225'},
{ value: '+385', label: '+385'},
{ value: '+53', label: '+53'},
{ value: '+357', label: '+357'},
{ value: '+420', label: '+420'},
{ value: '+45', label: '+45'},
{ value: '+253', label: '+253'},
{ value: '+1767', label: '+1767'},
{ value: '+1809', label: '+1809'},
{ value: '+593', label: '+593'},
{ value: '+20', label: '+20'},
{ value: '+503', label: '+503'},
{ value: '+240', label: '+240'},
{ value: '+291', label: '+291'},
{ value: '+372', label: '+372'},
{ value: '+251', label: '+251'},
{ value: '+500', label: '+500'},
{ value: '+298', label: '+298'},
{ value: '+679', label: '+679'},
{ value: '+33', label: '+33'},
{ value: '+594', label: '+594'},
{ value: '+689', label: '+689'},
{ value: '+262', label: '+262'},
{ value: '+241', label: '+241'},
{ value: '+220', label: '+220'},
{ value: '+995', label: '+995'},
{ value: '+49', label: '+49'},
{ value: '+233', label: '+233'},
{ value: '+350', label: '+350'},
{ value: '+30', label: '+30'},
{ value: '+299', label: '+299'},
{ value: '+1473', label: '+1473'},
{ value: '+590', label: '+590'},
{ value: '+1671', label: '+1671'},
{ value: '+502', label: '+502'},
{ value: '+44', label: '+44'},
{ value: '+224', label: '+224'},
{ value: '+245', label: '+245'},
{ value: '+592', label: '+592'},
{ value: '+509', label: '+509'},
{ value: '+0', label: '+0'},
{ value: '+39', label: '+39'},
{ value: '+504', label: '+504'},
{ value: '+852', label: '+852'},
{ value: '+36', label: '+36'},
{ value: '+354', label: '+354'},
{ value: '+91', label: '+91'},
{ value: '+62', label: '+62'},
{ value: '+98', label: '+98'},
{ value: '+964', label: '+964'},
{ value: '+353', label: '+353'},
{ value: '+972', label: '+972'},
{ value: '+1876', label: '+1876'},
{ value: '+81', label: '+81'},
{ value: '+962', label: '+962'},
{ value: '+7', label: '+7'},
{ value: '+254', label: '+254'},
{ value: '+686', label: '+686'},
{ value: '+850', label: '+850'},
{ value: '+82', label: '+82'},
{ value: '+381', label: '+381'},
{ value: '+965', label: '+965'},
{ value: '+996', label: '+996'},
{ value: '+856', label: '+856'},
{ value: '+371', label: '+371'},
{ value: '+961', label: '+961'},
{ value: '+266', label: '+266'},
{ value: '+231', label: '+231'},
{ value: '+218', label: '+218'},
{ value: '+423', label: '+423'},
{ value: '+370', label: '+370'},
{ value: '+352', label: '+352'},
{ value: '+853', label: '+853'},
{ value: '+389', label: '+389'},
{ value: '+261', label: '+261'},
{ value: '+265', label: '+265'},
{ value: '+60', label: '+60'},
{ value: '+960', label: '+960'},
{ value: '+223', label: '+223'},
{ value: '+356', label: '+356'},
{ value: '+692', label: '+692'},
{ value: '+596', label: '+596'},
{ value: '+222', label: '+222'},
{ value: '+230', label: '+230'},
{ value: '+52', label: '+52'},
{ value: '+691', label: '+691'},
{ value: '+373', label: '+373'},
{ value: '+377', label: '+377'},
{ value: '+976', label: '+976'},
{ value: '+382', label: '+382'},
{ value: '+1664', label: '+1664'},
{ value: '+212', label: '+212'},
{ value: '+258', label: '+258'},
{ value: '+95', label: '+95'},
{ value: '+264', label: '+264'},
{ value: '+674', label: '+674'},
{ value: '+977', label: '+977'},
{ value: '+31', label: '+31'},
{ value: '+687', label: '+687'},
{ value: '+64', label: '+64'},
{ value: '+505', label: '+505'},
{ value: '+227', label: '+227'},
{ value: '+234', label: '+234'},
{ value: '+683', label: '+683'},
{ value: '+1670', label: '+1670'},
{ value: '+47', label: '+47'},
{ value: '+968', label: '+968'},
{ value: '+92', label: '+92'},
{ value: '+680', label: '+680'},
{ value: '+970', label: '+970'},
{ value: '+507', label: '+507'},
{ value: '+675', label: '+675'},
{ value: '+595', label: '+595'},
{ value: '+51', label: '+51'},
{ value: '+63', label: '+63'},
{ value: '+48', label: '+48'},
{ value: '+351', label: '+351'},
{ value: '+1787', label: '+1787'},
{ value: '+974', label: '+974'},
{ value: '+40', label: '+40'},
{ value: '+250', label: '+250'},
{ value: '+290', label: '+290'},
{ value: '+1869', label: '+1869'},
{ value: '+1758', label: '+1758'},
{ value: '+508', label: '+508'},
{ value: '+1784', label: '+1784'},
{ value: '+684', label: '+684'},
{ value: '+378', label: '+378'},
{ value: '+239', label: '+239'},
{ value: '+966', label: '+966'},
{ value: '+221', label: '+221'},
{ value: '+248', label: '+248'},
{ value: '+232', label: '+232'},
{ value: '+65', label: '+65'},
{ value: '+421', label: '+421'},
{ value: '+386', label: '+386'},
{ value: '+677', label: '+677'},
{ value: '+252', label: '+252'},
{ value: '+27', label: '+27'},
{ value: '+211', label: '+211'},
{ value: '+34', label: '+34'},
{ value: '+94', label: '+94'},
{ value: '+249', label: '+249'},
{ value: '+597', label: '+597'},
{ value: '+268', label: '+268'},
{ value: '+46', label: '+46'},
{ value: '+41', label: '+41'},
{ value: '+963', label: '+963'},
{ value: '+886', label: '+886'},
{ value: '+992', label: '+992'},
{ value: '+255', label: '+255'},
{ value: '+66', label: '+66'},
{ value: '+670', label: '+670'},
{ value: '+228', label: '+228'},
{ value: '+690', label: '+690'},
{ value: '+676', label: '+676'},
{ value: '+1868', label: '+1868'},
{ value: '+216', label: '+216'},
{ value: '+90', label: '+90'},
{ value: '+7370', label: '+7370'},
{ value: '+1649', label: '+1649'},
{ value: '+688', label: '+688'},
{ value: '+256', label: '+256'},
{ value: '+380', label: '+380'},
{ value: '+971', label: '+971'},
{ value: '+598', label: '+598'},
{ value: '+998', label: '+998'},
{ value: '+678', label: '+678'},
{ value: '+58', label: '+58'},
{ value: '+84', label: '+84'},
{ value: '+1284', label: '+1284'},
{ value: '+1340', label: '+1340'},
{ value: '+681', label: '+681'},
{ value: '+967', label: '+967'},
{ value: '+260', label: '+260'},
{ value: '+263', label: '+263'},
];

const Floor = ({ stepper2, type, data1 }) => {

  const [defaultValue, setDefaultValue] = useState(null);
  //console.log(data1);
  const [selectedValue1, setSelectedValue1] = useState(data1.salutation);
  const [selectedValue3, setSelectedValue3] = useState(data1.companyID);
  const [selectedValue4, setSelectedValue4] = useState(data1.vipID);
  const [defaultCountryCode, setDefaultCountryCode] = useState(data1.countryCode);
const [defaultPhoneNumber, setDefaultPhoneNumber] = useState(data1.phoneNumber);

  const [reload, setreload] = useState(true);
  // const [load, setload] = useState(true);
  const [isDisabled, setDisable ] = useState(true);
  const [inputTerm, setInputTerm] = useState('');
  const [visible, setVisible] = useState(false);
  const [dobAlertVisible, setDobAlertVisible] = useState(false);

  const handleInput = e => {
    const value = e.target ? e.target.value : e;
    if (e.target) {
      setInputTerm(value);
      if (value.length > 0 && isNaN(value)) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    } else {
      if (!value) {
        setDobAlertVisible(true);
      } else {
        setDobAlertVisible(false);
      }
    }
  };

  const handleChange1 = (selectedOption1) => {
    setSelectedValue1(selectedOption1.value);
    localStorage.removeItem("salutation");
    localStorage.setItem("salutation", selectedOption1.label);
    localStorage.setItem("salutation", selectedOption1.value);
    setreload(false);
    setTimeout(() => {
      setreload(true);
    }, 1);
  };

  const handleChangeCountryCode = (selectedOption) => {
    setDefaultCountryCode(selectedOption.value);
  };
  

  const handleChange3 = (selectedOption3) => {
    setSelectedValue3(selectedOption3.value);
 
    localStorage.removeItem("companyID");
    localStorage.setItem("companyID", selectedOption3.label);
    localStorage.setItem("companyID", selectedOption3.value);


    setreload(false);
    setTimeout(() => {
      setreload(true);
    }, 1);
  };

  const handleChange4 = (selectedOption4) => {
    setSelectedValue4(selectedOption4.value);

    localStorage.removeItem("vipID");
    localStorage.setItem("vipID", selectedOption4.label);
    localStorage.setItem("vipID", selectedOption4.value);

    setreload(false);
    setTimeout(() => {
      setreload(true);
    }, 1);
  };

  const defaultReason = {
    value: data1.country,
    label: data1.countryName,
  };
  //Salutation
  const defaultReason1 = {
    value: data1.salutation,
    label: data1.salutation,
  };

  const defaultReason2 = {
    value: data1.nationalityID,
    label: data1.nationality,
  };

  const defaultReason3 = {
    value: data1.companyID,
    label: data1.companyName,
  };

  const defaultReason4 = {
    value: data1.VipID,
    label: data1.vipName,
  };

  // Ag Grid
  const [rowData, setRowData] = useState();

  const [centeredModal, setCenteredModal] = useState(false);

  const gridRef = useRef();
  // const cellClickedListener = useCallback((event) => {
  //   localStorage.setItem("id", data1["id"]);
  //   setautofill(true);
  //   setShowForm(false);
  //   seteditable(true);
  //   setTimeout(() => {
  //     setShowForm(true);
  //   }, 200);
  //   setenableEditBtn(false);
  // }, []);

  // ** Hooks
  const {
    setError,
    formState: { errors },
    setValue,
  } = useForm();

  // ** State
  const [data, setData] = useState(null);
  const [code, setcountryCode] = useState();

  // ** Hooks
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues });
  let navigate = useNavigate();

  const beginDate = watch("beginDate");
  const today = Moment().format("YYYY-MM-DD");
  const options = {
    maxDate: today,
  };
  const twelveYearsAgo = Moment().subtract(12, "years").format("YYYY-MM-DD");

  const doboptions = {
    maxDate: twelveYearsAgo,
  };

  const [flag, setflag] = useState(false);

  const onSubmit = (data) => {
    setData(data);
  
    if (data.firstName !== null && data.lastName !== null) {
      //console.log(data.beginDate1);
      let createmarketGroup = JSON.stringify({
        salutation: selectedValue1,
        firstName: data.names,
        lastName: data.surname,
        email: data.emailBasic,
        phoneNumber: data.phonenumber,
        gstID: data.gst,
        nationality:
          data.nationalities === undefined
            ? data1.nationalityID
            : data.nationalities === null
            ? null
            : data.nationalities.value,
        dob:
          data.beginDate1 === data1.dob
            ? data.beginDate1
            : Moment(String(new Date(data.beginDate1[0]))).format("YYYY-MM-DD"),
        anniversary:
          data.aniver1 === data1.anniversary
            ? data.aniver1
            : data.aniver1 && data.aniver1[0] && !isNaN(new Date(data.aniver1[0]).getTime())
            ? Moment(String(new Date(data.aniver1[0]))).format("YYYY-MM-DD")
            : null,
        vipID:
          data.vip1 === undefined
            ? data1.vipID
            : data.vip1 === null
            ? null
            : data.vip1.value,
        addressOne: data.addresses,
        addressTwo: data.addressTwo2,
        companyID: selectedValue3,
        country:
          data.countries === undefined
            ? data1.country
            : data.countries === null
            ? null
            : data.countries.value,
        state: data.states11,
        city: data.city1,
        postalCode: data.postalCode2,
        notes: data.notes1,
        guestpreferencenotes: data.guestnotes1,
      });
  
      fetchx(API_URL + `/updateLoyaltyMembership?id=${data1.guestID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: createmarketGroup,
      })
        .then(async (response) => {
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Something went wrong');
          }
          return response.json();
        })
        .then((resp) => {
          if (resp.status === "Failed" && resp.statusCode === 403) {
            throw new Error(resp.message);
          }
  
          const successMessage = flag
            ? "Membership details Edited Successfully!"
            : "Membership details Edited Successfully. Edit ID Details!";
  
          const swalInstance = MySwal.fire({
            text: successMessage,
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
              flag ? navigate("") : stepper2.next();
            }
          });
        })
        .catch((error) => {
          console.error('Error updating membership:', error);
          MySwal.fire({
            text: error.message,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Close",
            allowOutsideClick: false,
            customClass: {
              confirmButton: "btn btn-danger",
            },
          });
        });
    }
  };
  


  const handleReset = () => {
    reset({
      salutation1: null,
      name1: "",
      lastName1: "",
      email1: "",
      phoneNumber: "",
      gstID: "",
      nationality: "",
      dob: "",
      vipID: null,
      addressOne1: "",
      addressTwo: "",
      anniversary1: "",
      companyID1: null,
      country1: null,
      states11: "",
      notes: "",
      city: "",
      postalCode1: "",
      guestpreferencenotes11: "",
    });
  };

  window.onload = function () {
    localStorage.clear();
  };

  return (
    <div>
      <Card>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="salu">
                    Salutation <spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    required
                    id="salu"
                    control={control}
                    name="salu"
                    render={({ field }) => (
                      <Select
                        required
                        isClearable
                        defaultValue={defaultReason1}
                        options={salutations}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select", {
                          "is-invalid": data !== null && data.salu === null,
                        })}
                        {...field}
                        onChange={handleChange1}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="names">
                    First Name <spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    defaultValue={data1["firstName"]}
                    control={control}
                    id="names"
                    name="names"
                    render={({ field }) => (
                      <Input
                        required
                        placeholder="Name"
                        invalid={errors.names && true}
                        disabled={isDisabled}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="surname">
                    Last Name <spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    defaultValue={data1["lastName"]}
                    control={control}
                    id="surname"
                    name="surname"
                    render={({ field }) => (
                      <Input
                        required
                        placeholder="Last Name"
                        invalid={errors.surname && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="emailBasic">
                    Email<spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    defaultValue={data1["email"]}
                    control={control}
                    id="emailBasic"
                    name="emailBasic"
                    render={({ field }) => (
                      <Input
                      required
                        placeholder="emailBasic"
                        invalid={errors.emailBasic && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>



{/* <Col md='3' sm='12'>
    <div className='mb-1'>
        <Label className='form-label' for='phoneNumber'>
            Phone Number<span className="text-danger">*</span>
        </Label>
        <Controller
            control={control}
            id='phoneNumber'
            name='phoneNumber'
            defaultValue={data1["phoneNumber"]}
            render={({ field }) => (
                <Input
                    pattern="^(?:\+[0-9]{10,13}|[0-9]{10,13})$"
                    title="Phone number Can take Max 12 digits with Country Code, 10 digits without Country Code"
                    placeholder='Phone Number'
                    invalid={errors.name && true}
                    required
                    {...field}
                />
            )}
        />
    </div>
</Col> */}

{data1 && <Col md="3" sm="12">
  <div className="mb-1">
    <Label className="form-label" for="phonenumber">
      Phone Number<spam style={{ color: "red" }}>*</spam>
    </Label>
    <div className="d-flex">
      <Controller
        id="phonenumber"
        name="phonenumber"
        control={control}
        placeholder="123 456 7890"
        render={({ field }) => (
          <Cleave
            // pattern="[0-9]{10}"
            title="Phone number should be in the format: 123 456 7890"
            {...field}
            required
            value={data1["phoneNumber"]}
            className={classnames("form-control")}
          />
        )}
      />
    </div>
  </div>
</Col>}




              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="vip1">
                    VIP Status
                  </Label>
                  <Controller
                    id="vip1"
                    control={control}
                    name="vip1"
                    render={({ field }) => (
                      <Select
                        defaultValue={defaultReason4}
                        isClearable
                        options={vipID}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select", {
                          // "is-invalid": data !== null && data.vip1 === null,
                        })}
                        {...field}
                        // onChange={handleChange4}
                      />
                    )}
                  />
                </div>
              </Col>

             {data1 && <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="beginDate1">
                    Date Of Birth <spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    defaultValue={data1["dob"]}
                    
                    control={control}
                    required
                    id="beginDate1"
                    name="beginDate1"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                       // required
                        options={doboptions}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {'is-invalid': errors.beginDate1})}
                      />
                    )}
                  />
                </div>
              </Col>}

{/* <Col md="3" sm="12">
        <div className="mb-1">
          <Label className="form-label" htmlFor="beginDate1">
            Date Of Birth <span style={{ color: "red" }}>*</span>
          </Label>
          <Controller
            defaultValue={data1["dob"]}
            control={control}
            required
            id="beginDate1"
            name="beginDate1"
            render={({ field }) => (
              <Flatpickr
                {...field}
                options={doboptions}
                placeholder="YYYY-MM-DD"
                className={classnames("form-control", { 'is-invalid': errors.beginDate1 })}
                onChange={(date) => {
                  field.onChange(date);
                  handleInput(date[0] ? date[0].toISOString().split('T')[0] : '');
                }}
              />
            )}
          />
        </div>
      
      <Alert color="danger" className="mt-2" style={{ maxWidth: '300px' }}>
      <div className="alert-body">
        <AlertCircle size={15} />
        <span className="ms-1">Date of Birth is Required!</span>
      </div>
    </Alert>
    </Col> */}
      



              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="aniver1">
                    Anniversary
                  </Label>
                  <Controller
                    defaultValue={data1["anniversary"]}
                    control={control}
                    id="aniver1"
                    name="aniver1"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        // required
                        options={options}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                          // 'is-invalid': data !== null && data.aniver1 === null
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="addresses">
                    Address One
                  </Label>
                  <Controller
                    defaultValue={data1["addressOne"]}
                    control={control}
                    id="addresses"
                    name="addresses"
                    render={({ field }) => (
                      <Input
                        placeholder="Address One"
                        invalid={errors.addresses && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="addressTwo2">
                    Address 2
                  </Label>
                  <Controller
                    control={control}
                    id="addressTwo2"
                    name="addressTwo2"
                    render={({ field }) => (
                      <Input
                        defaultValue={data1["addressTwo"]}
                        placeholder="Address Two"
                        invalid={errors.addressTwo2 && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="city1">
                    City
                  </Label>
                  <Controller
                    control={control}
                    id="city1"
                    name="city1"
                    render={({ field }) => (
                      <Input
                        defaultValue={data1["city"]}
                        placeholder="city1"
                        invalid={errors.city1 && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="states11">
                    State
                  </Label>
                  <Controller
                    control={control}
                    id="states11"
                    name="states11"
                    render={({ field }) => (
                      <Input
                        defaultValue={data1["state"]}
                        placeholder="State"
                        invalid={errors.states11 && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="countries">
                    Country
                  </Label>
                  <Controller
                    // defaultValue={defaultReason}
                    id="countries"
                    control={control}
                    name="countries"
                    render={({ field }) => (
                      <Select
                        isClearable
                        defaultValue={defaultReason}
                        options={countryOptions}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select")}
                        {...field}
                        // onChange={handleChange}
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="postalCode2">
                    PostalCode
                  </Label>
                  <Controller
                    control={control}
                    id="postalCode2"
                    name="postalCode2"
                    render={({ field }) => (
                      <Input
                        defaultValue={data1["postalCode"]}
                        pattern="[a-zA-Z0-9\-]+"
                        title="Postal Code can contain numbers, alphabets and hyphens only"
                        placeholder="postalCode"
                        invalid={errors.postalCode2 && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="gst">
                    GST Number
                  </Label>
                  <Controller
                    control={control}
                    id="gst"
                    name="gst"
                    render={({ field }) => (
                      <Input
                        defaultValue={data1["gstID"]}
                        placeholder="gst"
                        invalid={errors.gst && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="nationalities">
                    Nationality
                  </Label>
                  <Controller
                    // defaultValue={defaultReason}
                    id="nationalities"
                    control={control}
                    name="nationalities"
                    render={({ field }) => (
                      <Select
                        isClearable
                        defaultValue={defaultReason2}
                        options={countryOptions}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select")}
                        {...field}
                        // onChange={handleChange}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="membershipType1">
                    Company Name
                  </Label>
                  <Controller
                    id="membershipType1"
                    control={control}
                    name="membershipType1"
                    render={({ field }) => (
                      <Select
                        // required
                        isClearable
                        defaultValue={defaultReason3}
                        options={companyID}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select", {
                          "is-invalid":
                            data !== null && data.membershipType1 === null,
                        })}
                        {...field}
                        onChange={handleChange3}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="4" sm="12" className="mb-1">
                <div className="mb-1">
                  <Controller
                    defaultValue={data1["notes"]}
                    control={control}
                    id="notes1"
                    name="notes1"
                    render={({ field }) => (
                      <InputGroup>
                        <InputGroupText>Profile Notes</InputGroupText>
                        <Input
                          isClearable
                          placeholder=" Profile Notes"
                          type="textarea"
                          invalid={errors.notes1 && true}
                          {...field}
                        />
                      </InputGroup>
                    )}
                  />
                </div>
              </Col>

              <Col md="5" sm="12" className="mb-1">
                <div className="mb-1">
                  <Controller
                    defaultValue={data1["guestpreferencenotes"]}
                    control={control}
                    id="guestnotes1"
                    name="guestnotes1"
                    render={({ field }) => (
                      <InputGroup>
                        <InputGroupText>Guest Preference Notes</InputGroupText>
                        <Input
                          isClearable
                          placeholder=" Guest Preference Notes"
                          type="textarea"
                          // pattern='[A-Za-z_]{1,15}'
                          // title=" guestpreferencenotes can contain alphabets . It cannnot contain numbers and special characters." required
                          invalid={errors.guestnotes1 && true}
                          {...field}
                        />
                      </InputGroup>
                    )}
                  />
                </div>
              </Col>
            </Row>

            <div className="vertically-centered-modal">
              <Modal
                isOpen={centeredModal}
                toggle={() => setCenteredModal(!centeredModal)}
                className="modal-xl"
              >
                <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
                  Vertically Centered
                </ModalHeader>
                <ModalBody>{/* <ViewModal /> */}</ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onClick={() => setCenteredModal(!centeredModal)}
                  >
                    Accept
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
            <div align='end' className='buttons' >
             
                <Button
                  className="me-1"
                  color="primary"
                  type="submit"
                  onClick={() => setflag(true)}
                >
                  Save And Exit
                </Button>
                <Button
                  outline
                  color="secondary"
                  type="reset"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              {/* </div> */}
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Floor;
