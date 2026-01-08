// ** React Imports
import { useState } from "react";
import { FaEye } from "react-icons/fa"; // Import eye icon

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

// ** Custom Components
import Avatar from "@components/avatar";

import { ArrowLeft, ArrowRight } from "react-feather";

// ** Utils
import { selectThemeColors } from "@utils";
import API_URL from "../../../../config";

// ** Reactstrap Imports
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
} from "reactstrap";

// ** Styles
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
  nationality: "",
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

  // guestType: null,
  // lastVisit: '',
  // isActive: null,
  // isBlackListed: null,
  // lastRateID: null,
  // lastRoomID: null,
  // negotiatedRateID: null,
};

let companyID = [
  fetchx(API_URL + "/getGuestProfileCompanyID?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      // console.log(resp['data'])
      companyID = resp["data"];
      // console.log(companyID)
    }),
];

let lastRate = [
  fetchx(API_URL + "/getGuestProfileLastRateID?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      // console.log(resp['data'])
      lastRate = resp["data"];
      // console.log(lastRate)
    }),
];

let lastRoomID = [
  fetchx(API_URL + "/getGuestProfileLastRoomID?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      // console.log(resp['data'])
      lastRoomID = resp["data"];
      // console.log(lastRoomID)
    }),
];

let negotiated = [
  fetchx(API_URL + "/getGuestProfileLastRoomID?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      // console.log(resp['data'])
      negotiated = resp["data"];
      // console.log(negotiated)
    }),
];

let vipID = [
  fetchx(API_URL + "/getGuestProfileVipID?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      // console.log(resp['data'])
      vipID = resp["data"];
      // console.log(vipID)
    }),
];

let countryOptions = [
  fetchx(API_URL + "/getGuestProfileCountry?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      // console.log(resp['data'])
      countryOptions = resp["data"];
      // setOptions(response.data);

      // console.log(vipID)
    }),
];
const isBlackListed = [
  { value: "1", label: "Yes" },
  { value: "0", label: "No" },
];

const activeoptions = [
  { value: "1", label: "Active" },
  { value: "0", label: "InActive" },
];

const guestTypes = [
  { value: "FIT", label: "FIT" },
  { value: "Corporate", label: "Corporate" },
];

const guestStatus = [
  { value: "CheckedIn", label: "CheckedIn" },
  { value: "CheckedOut", label: "CheckedOut" },
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
  { value: "Maj Gen.", label: "Maj Gen" },
];

const stateOptions = [
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Assam", label: "Assam" },
  { value: "Bihar", label: "Bihar" },
  { value: "Chandigarh", label: "Chandigarh" },
  { value: "Chhattisgarh", label: "Chhattisgarh" },
  { value: "Goa", label: "Goa" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Haryana", label: "Haryana" },
  { value: "HimachalPradesh", label: "Himachal Pradesh" },
  { value: "Jammu Kashmir", label: "Jammu Kashmir" },
  { value: "Jharkhand", label: "Jharkhand" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Ladakh", label: "Ladakh" },
  { value: "Lakshadweep", label: "Lakshadweep" },
  { value: "MadhyaPradesh", label: "Madhya Pradesh" },
  { value: "Maharastra", label: "Maharastra" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Odisha", label: "Odisha" },
  { value: "Punjab", label: "Punjab" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "TamilNaidu", label: "TamilNaidu" },
  { value: "Telangana", label: "Telangana" },
  { value: "Uttarpradesh", label: "Uttarpradesh" },
  { value: "WestBengal", label: "West Bengal" },
];

const Floor = ({ stepper2, type, data3 }) => {
  console.log(data3);
  console.log(data3.data1["firstName"]);
  const [defaultValue, setDefaultValue] = useState(null);

  const [selectedValue, setSelectedValue] = useState(data3.data1.country);
  const [selectedValue1, setSelectedValue1] = useState(data3.data1.salutation);
  const [selectedValue2, setSelectedValue2] = useState(data3.data1.state);
  const [selectedValue3, setSelectedValue3] = useState(
    data3.data1.guestCompany
  );
  const [selectedValue4, setSelectedValue4] = useState(data3.data1.vipID);
    const [gstNumber,setgstNumber] = useState()
  
  const [isValidating, setIsValidating] = useState(false);
  const [showGSTModal, setShowGSTModal] = useState(false);
  const [tagCompany,settagCompany] = useState(false)
  const [gstDetails, setGstDetails] = useState(null);
  const [defaultReason3,setdefaultReason3] = useState({
    value: data3.data1.companyID,
    label: data3.data1.accountName,
  })

  const {  clearErrors } = useForm();
  const [reload, setreload] = useState(true);
  const [load, setload] = useState(true);

  //Country And Nationality
  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption.value);
    console.log(selectedOption.value);
    console.log(localStorage.getItem("country"));
    localStorage.removeItem("country");
    localStorage.setItem("country", selectedOption.label);
    localStorage.setItem("country", selectedOption.value);

    console.log(localStorage.getItem("country"));
    console.log(localStorage.getItem("country"));
    setreload(false);
    setTimeout(() => {
      setreload(true);
    }, 1);
  };

  //Salutation
  const handleChange1 = (selectedOption1) => {
    setSelectedValue1(selectedOption1.value);
    console.log(selectedOption1.label);
    console.log(localStorage.getItem("salutation"));
    localStorage.removeItem("salutation");
    localStorage.setItem("salutation", selectedOption1.label);
    localStorage.setItem("salutation", selectedOption1.value);

    console.log(localStorage.getItem("salutation"));
    console.log(localStorage.getItem("salutation"));
    setreload(false);
    setTimeout(() => {
      setreload(true);
    }, 1);
  };

  const handleChange2 = (selectedOption2) => {
    setSelectedValue2(selectedOption2.label);
    console.log(selectedOption2.label);
    console.log(localStorage.getItem("state"));
    localStorage.removeItem("state");
    localStorage.setItem("state", selectedOption2.label);
    localStorage.setItem("state", selectedOption2.value);

    console.log(localStorage.getItem("state"));
    console.log(localStorage.getItem("state"));
    setreload(false);
    setTimeout(() => {
      setreload(true);
    }, 1);
  };

  const TagGuestCompany  =() =>{
    fetch(API_URL + "/findOrCreateCompanyByGST", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
       GSTIN:gstNumber
      })
    })
    .then(result => result.json())
    .then(resp => {
      if(resp.statusCode==200){
      console.log(resp['data'])
      let default1 = {
        value: resp['data'][0]['companyid'],
        label: resp['data'][0]['accountName'],
      };
  
      console.log(default1)
      setdefaultReason3(default1)
      handleChange3(default1)
      settagCompany(false)}
      else{
  
      }
    })
    .catch((error) => {
      console.log(error);
      
    });
  
    
        
  }
   const onChange=(e) => {
      const newValue = e.target.value.toUpperCase();
      onChange(newValue);
      
      if (newValue.length === 15) {
        // setIsValidating(true);
        getGSTINData(newValue)
          .then(response => {
            console.log('GST Validation Success:', response);
            // setIsValidating(false);
          })
          .catch(error => {
            console.error('GST Validation Error:', error);
            // setIsValidating(false);
          });
      }else if (newValue.length != 0 && newValue.length < 15){
        setIsValidating(true);
        setError('gst', {
          type: 'manual',
          message: "Invalid GST Number",
        });
      }
    }
  
  
    const getGSTINData = async (GSTIN) => {
      try {
        const response = await fetch(API_URL+'/verify-gst', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ GSTIN })
        });
        const data = await response.json();
        if (!response.ok) {
          setError('gst', {
            type: 'manual',
            message: data.data.message || "Invalid GST Number",
          });
          throw new Error(data.error);
  
        }
       
        setGstDetails(data.data)
        if(data.data.message === 'GSTIN Exists'){
          console.log('validGST')
          settagCompany(true)
          
        }
        return data.data;
      } catch (error) {
        
        setError('gst', {
          type: 'manual',
          message: error.message || "Invalid GST Number",
        });
        throw error.message || 'GST validation failed';
      }
    };
    
    
    
    const handleChange3 = (selectedOption3) => {
      console.log(selectedOption3)
      if(selectedOption3!=null){
      setdefaultReason3(selectedOption3)
  
      console.log('handle hnage 23')
      setSelectedValue3(selectedOption3.value);
   
      localStorage.removeItem("companyID");
      localStorage.setItem("companyID", selectedOption3.label);
      localStorage.setItem("companyID", selectedOption3.value);
  
  
      setreload(false);
      setTimeout(() => {
        setreload(true);
      },);
    }else{
      setdefaultReason3()
      setSelectedValue3()
    }
    };

  const handleChange4 = (selectedOption4) => {
    setSelectedValue4(selectedOption4.value);
    console.log(selectedOption4.label);
    console.log(localStorage.getItem("vipID"));
    localStorage.removeItem("vipID");
    localStorage.setItem("vipID", selectedOption4.label);
    localStorage.setItem("vipID", selectedOption4.value);
    console.log(localStorage.getItem("vipID"));
    console.log(localStorage.getItem("vipID"));
    setreload(false);
    setTimeout(() => {
      setreload(true);
    }, 1);
  };

  const defaultReason = {
    value: data3.data1.country,
    label: data3.data1.countriesname,
  };
  console.log(defaultReason);
  //Salutation
  const defaultReason1 = {
    value: data3.data1.salutation,
    label: data3.data1.salutation,
  };

  const defaultReason2 = {
    value: data3.data1.state,
    label: data3.data1.state,
  };



  const defaultReason4 = {
    value: data3.data1.vipID,
    label: data3.data1.vipType,
  };

  console.log(data3.data1);

  // Ag Grid
  const [rowData, setRowData] = useState();

  const [centeredModal, setCenteredModal] = useState(false);

  const gridRef = useRef();

  const [disabledModal, setDisabledModal] = useState(false);

  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
    console.log(event["data"]);
    console.log(event["rowIndex"]);

    console.log(localStorage.getItem(data3.data1["id"]));
    localStorage.setItem("id", data3.data1["id"]);
    setautofill(true);
    setShowForm(false);
    seteditable(true);
    setTimeout(() => {
      setShowForm(true);
    }, 200);
    setenableEditBtn(false);
  }, []);

  // ** Hooks
  const {
    setError,
    formState: { errors },
    setValue,
  } = useForm();

  const updateRecord = async (formData) => {
    let res = fetchx(API_URL + "/updateguestprofile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: createmarketGroup,
    })
      .then((result) => result.json())
      .then((resp) => {
        localStorage.setItem("id", data3.data1["id"]);
        console.log(resp);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // ** State
  const [data, setData] = useState(null);

  // ** Hooks
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues });
  let navigate = useNavigate();

  //   useEffect(()=>{

  const beginDate = watch("beginDate");
  console.log(beginDate);
  const today = Moment().format("YYYY-MM-DD");
  const options = {
    maxDate: today,
  };
  const twelveYearsAgo = Moment().subtract(12, "years").format("YYYY-MM-DD"); // Calculate 12 years ago

  const doboptions = {
    maxDate: twelveYearsAgo,
  };

  const [flag, setflag] = useState(false);

  const onSubmit = (data) => {
    console.log("flag", flag);
    setData(data);
    console.log(data.beginDate1);
    console.log(data.aniver1);
    if (data.firstName !== null && data.lastName !== null) {
      console.log(data.dob1);
      let createmarketGroup = JSON.stringify({
        id: data3.data1.guestID,
        salutation: selectedValue1,
        firstName: data.names,
        lastName: data.surname,
        email: data.emailBasic,
        phoneNumber: data.phonenumber,
        gstID: data.gst,
        nationality: selectedValue,
        dob:
          data.beginDate1 === null
            ? null
            : Moment(String(new Date(data.beginDate1[0]))).format("YYYY-MM-DD"),
        vipID: selectedValue4,
        addressOne: data.addresses,
        addressTwo: data.addressTwo2,
        anniversary:
          data.aniver1 === null
            ? null
            : Moment(String(new Date(data.aniver1[0]))).format("YYYY-MM-DD"),
        companyID: selectedValue3,
        country: selectedValue,
        state: data.states11,
        city: data.city1,
        postalCode: data.postalCode2,
        notes: data.notes1,
        guestpreferencenotes: data.guestnotes1,
      });

      console.log(createmarketGroup);
      console.log("hi");
      console.log(data3.data1.guestID);

      let columnsToUpdate = createmarketGroup;
      let res = fetchx(
        API_URL + `/updateguestprofile?id=${data3.data1.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: columnsToUpdate,
        }
      )
        .then((result) => result.json())
        .then((resp) => {
          console.log(resp);
          // localStorage.setItem(data3.data1['id'])
          localStorage.setItem("id", data3.data1["id"]);
          console.log(data3.data1["id"]);
          // navigate('')
          if (resp.statusCode == 200) {
            fetchx(API_URL + `/getGuestProfileNew?hotelID=1`)
              .then((result) => result.json())
              .then((rowData) => {
                setRowData(rowData["data"]);
                console.log(rowData["data"]);
              });

            console.log(flag == true);
            console.log(flag);
            console.log(flag == false);
            if (flag == true) {
              const swalInstance = MySwal.fire({
                text: "Guest Edited Successfully!",
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
              //  navigate('');
              console.log("Save and exit after form submit");
            } else if (flag == false) {
              const swalInstance = MySwal.fire({
                text: "Guest Edited Successfully. Edit ID Details!",
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
                  stepper2.next();
                }
              });

              console.log("Save and next after form submit");
            }
          }
        })
        .catch((error) => {
          console.log(error);
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
                    defaultValue={data3.data1["firstName"]}
                    control={control}
                    id="names"
                    name="names"
                    render={({ field }) => (
                      <Input
                        required
                        placeholder="Name"
                        invalid={errors.names && true}
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
                    defaultValue={data3.data1["lastName"]}
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
                    Email
                  </Label>
                  <Controller
                    defaultValue={data3.data1["email"]}
                    control={control}
                    id="emailBasic"
                    name="emailBasic"
                    render={({ field }) => (
                      <Input
                        placeholder="emailBasic"
                        invalid={errors.emailBasic && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="phonenumber">
                    Phone Number
                  </Label>

                  <Controller
                    id="phonenumber"
                    name="phonenumber"
                    control={control}
                    placeholder="+919847665433"
                    render={({ field }) => (
                      <Cleave
                      pattern="^(?:\+[0-9]{10,13}|[0-9]{10,13})$" 
                      title="Phone number Can take Max 12 digits with Country Code, 10 digits without Country Code"  
                        {...field}
                        value={data3.data1["guestNumbers"]}
                        className={classnames("form-control")}
                        options={{ phone: true, phoneRegionCode: "IN" }}
                      />
                    )}
                  />
                </div>
              </Col>
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
                          "is-invalid": data !== null && data.vip1 === null,
                        })}
                        {...field}
                        onChange={handleChange4}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="beginDate1">
                    Date Of Birth
                  </Label>
                  <Controller
                    defaultValue={data3.data1["dob"]}
                    control={control}
                    id="beginDate1"
                    name="beginDate1"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        options={doboptions}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                          // 'is-invalid': data !== null && data.beginDate1 === null
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="aniver1">
                    Anniversary
                  </Label>
                  <Controller
                    defaultValue={data3.data1["anniversary"]}
                    control={control}
                    id="aniver1"
                    name="aniver1"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
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
                    defaultValue={data3.data1["addressOne"]}
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
                        defaultValue={data3.data1["addressTwo"]}
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
                        defaultValue={data3.data1["city"]}
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
                        defaultValue={data3.data1["state"]}
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
                        onChange={handleChange}
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
                        defaultValue={data3.data1["postalCode"]}
                        pattern="[1-9][0-9]{5}"
                        title="Postal Code can contain numbers and can take 6 digits"
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
                  rules={{
                    pattern: {
                      value: /^[0-9A-Z]{15}$/,
                      message: 'GST number must be 15 characters',
                    },
                    
                  }}
                  render={({ field: { onChange, value, ...field } }) => (
                    <>
                      <Input
                        {...field}
                        value={gstNumber || ''}
                        onChange={(e) => {
                          setgstNumber(e.target.value)
                          const newValue = e.target.value.toUpperCase();
                          onChange(newValue);
            
                          // ✅ Clear error if field is empty
                          if (newValue.length === 0) {
                            setIsValidating(false);
            
                            clearErrors('gst');
                            return;
                          }
            
                          // ✅ Validate GST when it reaches 15 characters
                          if (newValue.length === 15) {
                            getGSTINData(newValue)
                              .then((response) => {
                                if (response.valid && response.message === "GSTIN Exists") {
                                  setIsValidating(false);
            
                                  clearErrors('gst'); // ✅ Clear error when GST is valid
                                } else {
                                  setIsValidating(true);
            
                                  setError('gst', {
                                    type: 'manual',
                                    message: response.message || "Invalid GST Number",
                                  });
                                }
                              })
                              .catch((error) => {
                                setIsValidating(true);
            
                                setError('gst', {
                                  type: 'manual',
                                  message: error.message || "Invalid GST Number",
                                });
                              });
                          }
                          else if (newValue.length != 0 && newValue.length < 15){
                            setIsValidating(true)
                          }else{
                            setIsValidating(false)
                          }
                        }}
                        defaultValue={data3.data1["gstID"] || ''}
                        placeholder="Enter GST Number"
                        invalid={isValidating}
                      />
            
                       {/* Eye Icon - Shows Only When GST is Valid */}
                      {/* Eye Icon Inside Input Field */}
                      {!isValidating &&  gstDetails &&  (
                        <span
                          className="position-absolute"
                          style={{
                            paddingTop : '100px',
                            paddingRight :'400px',
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            fontSize: "1.2rem",
                            color: "#6c757d",
                          }}
                          onClick={() => setShowGSTModal(true)}
                          // onClick={() => alert('Hiii')}
                        >
                          <FaEye />
                        </span>
                      )}
                    </>
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
                        defaultValue={defaultReason}
                        options={countryOptions}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select")}
                        {...field}
                        onChange={handleChange}
                      />
                    )}
                  />
                </div>
              </Col>

              {reload && <Col md="3" sm="12">
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
                        isDisabled = {gstNumber ? gstNumber.length==15 : false}
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
              </Col>}

              <Col md="4" sm="12" className="mb-1">
                <div className="mb-1">
                  <Controller
                    defaultValue={data3.data1["notes"]}
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
                          // pattern='[A-Za-z_]{1,15}'
                          // title=" guestpreferencenotes can contain alphabets . It cannnot contain numbers and special characters." required
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
                    defaultValue={data3.data1["guestpreferencenotes"]}
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
                  </Button>{" "}
                </ModalFooter>
              </Modal>
            </div>
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <Button
                  className="me-1"
                  color="primary"
                  type="submit"
                  onClick={() => setflag(false)}
                >
                  Save And Next
                </Button>
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
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>



                  {/* GST Details Modal */}
        {showGSTModal && gstDetails && (
          <Modal isOpen={showGSTModal} toggle={() => setShowGSTModal(false)}>
            <ModalHeader toggle={() => setShowGSTModal(false)}>
              GST Details
            </ModalHeader>
            <ModalBody>
              <p><strong>Legal Name:</strong> {gstDetails.legal_name_of_business}</p>
              <p><strong>Trade Name:</strong> {gstDetails.trade_name_of_business}</p>
      
              
              <p><strong>GST Number:</strong> {gstDetails.GSTIN}</p>
              <p><strong>Address:</strong> {gstDetails.principal_place_address}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={() => setShowGSTModal(false)}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        )}
      
      {tagCompany && gstDetails && (
          <Modal isOpen={tagCompany}>
            <ModalHeader toggle={() => {settagCompany(false)
                        setgstNumber()}
                      }>
              GST Details
            </ModalHeader>
            <ModalBody>
              <h3>        Do you want to tag this company to this profile?
              </h3>
              <p><strong>Legal Name:</strong> {gstDetails.legal_name_of_business}</p>
              <p><strong>Trade Name:</strong> {gstDetails.trade_name_of_business}</p>
      
              <p><strong>GST Number:</strong> {gstDetails.GSTIN}</p>
              <p><strong>Address:</strong> {gstDetails.principal_place_address}</p>
            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={() => TagGuestCompany()}>
                OK
              </Button>
              <Button color="danger" onClick={() => {settagCompany(false)
                          setgstNumber()
                          // setdefaultReason3()
                          // setreload(false);
                          // setTimeout(() => {
                          //   setreload(true);
                          // },);
                        }
                        }>
                          Close
                        </Button>
            </ModalFooter>
          </Modal>
        )}
    </div>
  );
};

export default Floor;
