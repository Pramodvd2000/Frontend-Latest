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

// ** Custom Components
import Avatar from "@components/avatar";

import { ArrowLeft, ArrowRight } from "react-feather";

// ** Utils
import { selectThemeColors } from "@utils";

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

import ViewModal from "./preference";
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
import API_URL from "../../../../config";
import { useNavigate } from "react-router-dom";
// ** Third Party Components
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const defaultValues = {
    salutation: null,
    name: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gstID: "",
    nationality: "",
    dob: "",
    vipID: null,
    addressOne: "",
    addressTwo: "",
    anniversary: "",
    companyID: null,
    country: null,
    state: null,
    notes: "",
    city: "",
    postalCode: "",
    guestpreferencenotes: null,
};

let companyID = [];

let lastRate = [
    // fetchx(API_URL +'/getGuestProfileLastRateID?hotelID=1')
    // .then(result => result.json())
    // .then(resp => {
    // lastRate = resp['data']
    // })
];

let lastRoomID = [];

let negotiated = [
    // fetchx(API_URL +'/getGuestProfileLastRoomID?hotelID=1')
    // .then(result => result.json())
    // .then(resp => {
    // negotiated = resp['data']
    // })
];

let vipID = [
    // fetchx(API_URL +'/getGuestProfileVipID?hotelID=1')
    // .then(result => result.json())
    // .then(resp => {
    // // console.log(resp['data'])
    // vipID = resp['data']
    // // console.log(vipID)
    // })
];

let countryOptions = [
    // fetchx(API_URL+'/getGuestProfileCountry?hotelID=1')
    // .then(result => result.json())
    // .then(resp => {
    // countryOptions = resp['data']
    // // console.log(vipID)
    // })
];
const isBlackListed = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
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

localStorage.removeItem("guestID");

const Floor = ({ stepper, type, data1 }) => {
    const [companyID, setCompanyID] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [vipID, setVipID] = useState([]);
    const [negotiated, setNegotiated] = useState([]);
    const [lastRoomID, setLastRoomID] = useState([]);
    const [lastRate, setLastRate] = useState([]);
    const { reset, handleSubmit, control, watch } = useForm({ defaultValues });

    useEffect(() => {
        fetchx(API_URL + "/getGuestProfileCompanyID?hotelID=1")
            .then((result) => result.json())
            .then((resp) => {
                setCompanyID(resp["data"]);
            });

        fetchx(API_URL + "/getGuestProfileCountry?hotelID=1")
            .then((result) => result.json())
            .then((resp) => {
                setCountryOptions(resp["data"]);
                // console.log(countryOptions.length)
            });

        fetchx(API_URL + "/getGuestProfileVipID?hotelID=1")
            .then((result) => result.json())
            .then((resp) => {
                // console.log(resp['data'])
                setVipID(resp["data"]);
                // console.log(vipID)
            });
        fetchx(API_URL + "/getGuestProfileLastRoomID?hotelID=1")
            .then((result) => result.json())
            .then((resp) => {
                setNegotiated(resp["data"]);
            });

        fetchx(API_URL + "/getGuestProfileLastRoomID?hotelID=1")
            .then((result) => result.json())
            .then((resp) => {
                setLastRoomID(resp["data"]);
            });

        fetchx(API_URL + "/getGuestProfileLastRateID?hotelID=1")
            .then((result) => result.json())
            .then((resp) => {
                setLastRate(resp["data"]);
            });
    }, []);

    console.log(data1);

    // Ag Grid
    const [rowData, setRowData] = useState();
    const [centeredModal, setCenteredModal] = useState(false);
    const [gstNumber,setgstNumber] = useState()
    const [isValidating, setIsValidating] = useState(false);
     const [showGSTModal, setShowGSTModal] = useState(false);
     const [tagCompany,settagCompany] = useState(false)
     const [gstDetails, setGstDetails] = useState(null);
     const [reload, setreload] = useState(true);
   const {  clearErrors } = useForm();
   const [selectedValue3, setSelectedValue3] = useState(data1.companyID);
 
   const [defaultReason3,setdefaultReason3] = useState()
    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        filterParams: {
            buttons: ["apply", "reset"],
        },
    }));

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

    // ** Hooks
    const {
        setError,
        formState: { errors },
    } = useForm();
    // ** State
    const [data, setData] = useState(null);
    const [flag, setflag] = useState(false);
    // ** Hooks
    let navigate = useNavigate();

    const handleSaveAndNext = () => {
        stepper.next();
        onSubmit(data);
    };

    const handleSaveAndExit = () => {
        onSubmit(data);
        navigate("/dashboard/reservation");
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

    const onSubmit = (data) => {
        if (data.firstName !== null && data.name !== null) {
            console.log(data.dob);
            let createmarketGroup = JSON.stringify({
                salutation: data.salutation.label,
                firstName: data.name,
                lastName: data.lastName,
                email: data.emailBasic,
                phoneNumber: data.phoneNumber,
                gstID: data.gst,
                nationality: data.nationality === null ? null : data.nationality.value,
                dob:
                    data.dob === ""
                        ? null
                        : Moment(String(new Date(data.dob[0]))).format("YYYY-MM-DD"),
                vipID: data.vipID === null ? null : data.vipID.value,
                addressOne: data.addressOne,
                addressTwo: data.addressTwo,
                anniversary:
                    data.anniversary === ""
                        ? null
                        : Moment(String(new Date(data.anniversary[0]))).format(
                            "YYYY-MM-DD"
                        ),
                companyID: selectedValue3,
                country: data.country === null ? null : data.country.value,
                state: data.state,
                notes: data.notes,
                city: data.city,
                postalCode: data.postalCode,
                guestpreferencenotes: data.guestpreferencenotes,
            });
            console.log(createmarketGroup);
            console.log("hi");
            let res = fetchx(API_URL + "/guestProfile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: createmarketGroup,
            })
                .then((result) => result.json())
                .then((resp) => {
                    localStorage.setItem("guestID", resp["data"]);
                    console.log(resp);
                    // stepper.next()
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
                                text: "Guest Added Successfully!",
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
                            // navigate('');
                            console.log("Save and exit after form submit");
                        } else if (flag == false) {
                            const swalInstance = MySwal.fire({
                                text: "Guest Added Successfully!Please do add ID Details",
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
                                    stepper.next();
                                }
                            });
                            // stepper.next();
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
            salutation: null,
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            gstID: "",
            nationality: "",
            dob: "",
            vipID: null,
            addressOne: "",
            addressTwo: "",
            anniversary: "",
            companyID: null,
            country: null,
            state: "",
            notes: "",
            city: "",
            postalCode: "",
            guestpreferencenotes: null,
        });
    };

    window.onload = function () {
        localStorage.clear();
    };

    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col md="3" sm="12" className="mb-1">
                        <div className="mb-1">
                            <Label className="form-label" for="salutation">
                                Salutation <spam style={{ color: "red" }}>*</spam>
                            </Label>
                            <Controller
                                id="salutation"
                                control={control}
                                name="salutation"
                                render={({ field }) => (
                                    <Select
                                        required
                                        isClearable
                                        options={salutations}
                                        classNamePrefix="select"
                                        theme={selectThemeColors}
                                        className={classnames("react-select", {
                                            "is-invalid": data !== null && data.salutation === null,
                                        })}
                                        {...field}
                                    // value={data1['salutation']}
                                    />
                                )}
                            />
                        </div>
                    </Col>

                    <Col md="3" sm="12">
                        <div className="mb-1">
                            <Label className="form-label" for="name">
                                First Name <spam style={{ color: "red" }}>*</spam>
                            </Label>
                            <Controller
                                defaultValue=""
                                control={control}
                                id="name"
                                name="name"
                                render={({ field }) => (
                                    <Input
                                        required
                                        // pattern='[A-Za-z]{1,15}'
                                        // title="Name should contain alphabets. Cannot contain numbers and special characters."
                                        placeholder="Name"
                                        invalid={errors.name && true}
                                        {...field}
                                    // value={data1['name']}
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
                                defaultValue=""
                                control={control}
                                id="lastName"
                                name="lastName"
                                render={({ field }) => (
                                    <Input
                                        required
                                        // pattern='[A-Za-z]{1,15}'
                                        // title="Name should contain alphabets. Cannot contain numbers and special characters."
                                        placeholder="lastName"
                                        invalid={errors.lastName && true}
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
                                    // value={data1['email']}
                                    />
                                )}
                            />
                        </div>
                    </Col>
                    {/* <Col md="3" sm="12">
 <div className="mb-1">
 <Label className="form-label" for="phoneNumber">
 Phone Number
 </Label>
 <InputGroup className="input-group-merge">
 <Controller
 id="phoneNumber"
 name="phoneNumber"
 control={control}
 placeholder="1 234 567 8900"
 render={({ field }) => (
 <Cleave
 {...field}
 className={classnames("form-control", {
 // 'is-invalid': data !== null && (data.phoneNumber === null || !data.phoneNumber.length)
 })}
 options={{ phone: true, phoneRegionCode: "IN" }}
 />
 )}
 />
 </InputGroup>
 </div>
 </Col> */}
                    <Col md='3' sm='12'>
                        <div className='mb-1'>
                            <Label className='form-label' for='phoneNumber'>
                                Phone Number
                            </Label>
                            <Controller
                                defaultValue=''
                                control={control}
                                id='phoneNumber'
                                name='phoneNumber'
                                render={({ field }) => <Input
                                    pattern="^(?:\+[0-9]{10,13}|[0-9]{10,13})$"
                                    title="Phone number Can take Max 12 digits with Country Code, 10 digits without Country Code"
                                    placeholder=' Phone Number ' invalid={errors.name && true} {...field}
                                />}
                            />
                        </div>
                    </Col>
                    <Col md="3" sm="12">
                        <div className="mb-1">
                            <Label className="form-label" for="vipID">
                                VIP Status
                            </Label>
                            <Controller
                                id="vipID"
                                control={control}
                                name="vipID"
                                render={({ field }) => (
                                    <Select
                                        // required
                                        isClearable
                                        options={vipID}
                                        classNamePrefix="select"
                                        theme={selectThemeColors}
                                        // className={classnames("react-select", {
                                        // "is-invalid": data !== null && data.vipID === null,
                                        // })}
                                        {...field}
                                    // value={data1['vipID']}
                                    />
                                )}
                            />
                        </div>
                    </Col>
                    <Col md="3" sm="12">
                        <div className="mb-1">
                            <Label className="form-label" for="dob">
                                Date Of Birth
                            </Label>
                            <Controller
                                control={control}
                                id="dob"
                                name="dob"
                                render={({ field }) => (
                                    <Flatpickr
                                        {...field}
                                        // value={data1['dob']}
                                        options={doboptions}
                                        placeholder="YYYY-MM-DD "
                                        className={classnames("form-control", {
                                            // 'is-invalid': data !== null && data.dob === null
                                        })}
                                    />
                                )}
                            />
                        </div>
                    </Col>
                    <Col md="3" sm="12">
                        <div className="mb-1">
                            <Label className="form-label" for="anniversary">
                                Anniversary
                            </Label>
                            <Controller
                                control={control}
                                id="anniversary"
                                name="anniversary"
                                render={({ field }) => (
                                    <Flatpickr
                                        {...field}
                                        // value={data1['anniversary']}
                                        options={options}
                                        placeholder="YYYY-MM-DD "
                                        className={classnames("form-control", {
                                            "is-invalid": data !== null && data.anniversary === null,
                                        })}
                                    />
                                )}
                            />
                        </div>
                    </Col>
                    <Col md="3" sm="12">
                        <div className="mb-1">
                            <Label className="form-label" for="addressOne">
                                Address Line One
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
                    <Col md="3" sm="12">
                        <div className="mb-1">
                            <Label className="form-label" for="addressTwo">
                                Address Line Two
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
                                    // value={data1['addressTwo']}
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
                                        invalid={errors.city && true}
                                        {...field}
                                    // value={data1['city']}
                                    />
                                )}
                            />
                        </div>
                    </Col>
                    <Col md="3" sm="12">
                        <div className="mb-1">
                            <Label className="form-label" for="state">
                                State
                            </Label>
                            <Controller
                                defaultValue=""
                                control={control}
                                id="state"
                                name="state"
                                render={({ field }) => (
                                    <Input
                                        // required
                                        // pattern='[Aa-Zz ]{1,15}'
                                        // title="state should contain alphabets. Cannot contain numbers and special characters."
                                        placeholder="state"
                                        invalid={errors.state && true}
                                        {...field}
                                    // value={data1['state']}
                                    />
                                )}
                            />
                        </div>
                    </Col>

                    {/* <Col md='3' sm='12'>
 <div className='mb-1'>
 <Label className='form-label' for='state'>
 State
 </Label>
 <Controller
 id='state'
 control={control}
 name='state'
 render={({ field }) => (
 <Select
 isClearable
 options={stateOptions}
 classNamePrefix='select'
 theme={selectThemeColors}
 // className={classnames('react-select', { 'is-invalid': data !== null && data.state === null })}
 {...field}
 />
 )}
 />
 </div>
 </Col> */}
                    <Col>
                        <Row md="4" sm="12">
                            {countryOptions && (
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
                                                    // className={classnames('react-select', { 'is-invalid': data !== null && data.country === null })}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                            )}

                            <Col md="3" sm="12">
                                <div className="mb-1">
                                    <Label className="form-label" for="postalCode">
                                        PostalCode
                                    </Label>
                                    <Controller
                                        defaultValue=""
                                        control={control}
                                        id="postalCode"
                                        name="postalCode"
                                        render={({ field }) => (
                                            <Input
                                                pattern="[0-9\-]+"
                                                title="Postal Code can contain numbers and hyphens only"
                                                placeholder="postalCode"
                                                invalid={errors.postalCode && true}
                                                {...field}
                                            // value={data1['postalCode']}
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
                      // validate: async (value) => {
                      //   if (value && value.length === 15) {
                      //     try {
                      //       const response = await getGSTINData(value);
                      //       if (!response.valid || response.message === "GSTIN Doesn't Exist") {
                      //         setIsValidating(true);
              
                      //         return response.message || "Invalid GST Number";
                      //       }
                      //       return true;
                      //     } catch (error) {
                      //       setIsValidating(true);
              
                      //       return error.message || "Invalid GST Number";
                      //     }
                      //   }
                      //   return true; // Validation passes if the field is empty
                      // },
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
                          defaultValue={data1["gstID"] || ''}
                          placeholder="Enter GST Number"
                          invalid={isValidating}
                        />
              
                         {/* Eye Icon - Shows Only When GST is Valid */}
                        {/* Eye Icon Inside Input Field */}
                        {!isValidating &&  gstDetails &&  (
                          <span
                            className="position-absolute"
                            style={{
                              paddingTop : '110px',
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
                                    <Label className="form-label" for="nationality">
                                        Nationality
                                    </Label>
                                    <Controller
                                        id="nationality"
                                        control={control}
                                        name="nationality"
                                        render={({ field }) => (
                                            <Select
                                                isClearable
                                                options={countryOptions}
                                                classNamePrefix="select"
                                                theme={selectThemeColors}
                                                {...field}
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
                        defaultValue={defaultReason3 || null}
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
                                    {/* <Label className='form-label' for='notes'>
 Profile Notes
 </Label> */}
                                    <Controller
                                        defaultValue=""
                                        control={control}
                                        id="notes"
                                        name="notes"
                                        render={({ field }) => (
                                            // <textarea rows="4" cols="23">
                                            // Notes
                                            // </textarea>
                                            <InputGroup>
                                                <InputGroupText>Profile Notes</InputGroupText>
                                                <Input
                                                    placeholder=" notes"
                                                    type="textarea"
                                                    pattern="[A-Za-z_]{1,15}"
                                                    title=" notes can contain alphabets . It cannnot contain numbers and special characters."
                                                    invalid={errors.notes && true}
                                                    {...field}
                                                // value={data1['notes']}
                                                />
                                            </InputGroup>
                                        )}
                                    />
                                </div>
                            </Col>

                            <Col md="5" sm="12" className="mb-1">
                                <div className="mb-1">
                                    <Controller
                                        defaultValue=""
                                        control={control}
                                        id="guestpreferencenotes"
                                        name="guestpreferencenotes"
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupText>Guest Preference Notes</InputGroupText>
                                                <Input
                                                    placeholder=" guestpreferencenotes"
                                                    type="textarea"
                                                    // pattern='[A-Za-z_]{1,15}'
                                                    // title=" guestpreferencenotes can contain alphabets . It cannnot contain numbers and special characters." required
                                                    invalid={errors.guestpreferencenotes && true}
                                                    {...field}
                                                // value={data1['guestpreferencenotes']}
                                                />
                                            </InputGroup>
                                        )}
                                    />
                                </div>
                            </Col>
                        </Row>
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
                        <ModalBody>
                            <ViewModal />
                        </ModalBody>
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
                        <Button className='me-1' color='primary' type='submit' onClick={()=>setflag(false)}>
 Save And Next
 </Button>
                        <Button
                            className="me-1"
                            color="primary"
                            type="submit"
                            onClick={() => setflag(true)}
                        >
                            Create Guest
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

             {/* GST Details Modal */}
             {showGSTModal && gstDetails && (
              <Modal isOpen={showGSTModal} >
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
                    // setSelectedValue3()
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






// // ** React Imports
// import { useState } from "react";
// import { FaEye } from "react-icons/fa"; // Import eye icon

// // ** Third Party Components
// import Select from "react-select";
// import toast from "react-hot-toast";
// import classnames from "classnames";
// import Cleave from "cleave.js/react";
// import { Check } from "react-feather";
// import Flatpickr from "react-flatpickr";
// import "cleave.js/dist/addons/cleave-phone.us";
// import { useForm, Controller } from "react-hook-form";
// import Moment from "moment";
// import React from "react";
// import { selectThemeColors } from "@utils";
// import API_URL from '../../../../config'
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Input,
//   Card,
//   Form,
//   Row,
//   Col,
//   Label,
//   Button,
//   CardBody,
//   CardTitle,
//   CardHeader,
//   InputGroup,
//   InputGroupText,
// } from "reactstrap";
// import "@styles/react/libs/flatpickr/flatpickr.scss";
// import "@styles/react/libs/react-select/_react-select.scss";
// import "@styles/react/pages/page-form-validation.scss";

// // Import ag-grid
// import 'ag-grid-enterprise'
// import { AgGridReact } from 'ag-grid-react'
// import '/node_modules/ag-grid-community/styles/ag-grid.css'
// import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// import { useRef, useEffect, useMemo, useCallback } from "react";
// // const id = '1';
// import { useNavigate } from "react-router-dom";
// // ** Third Party Components
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";

// const MySwal = withReactContent(Swal);

// const defaultValues = {
//   salutation1: null,
//   name1: "",
//   lastName1: "",
//   email1: "",
//   phoneNumber: "",
//   gstID: "",
//   nationality: null,
//   dob: "",
//   vipID: null,
//   addressOne1: "",
//   addressTwo: "",
//   anniversary1: "",
//   companyID1: null,
//   country1: null,
//   states1: "",
//   notes: "",
//   city: "",
//   postalCode1: "",
//   guestpreferencenotes1: null,
// };

// let companyID = [
//   fetchx(API_URL + "/getGuestProfileCompanyID?hotelID=1")
//     .then((result) => result.json())
//     .then((resp) => {
//       companyID = resp["data"];
//     }),
// ];

// let lastRate = [
//   fetchx(API_URL + "/getGuestProfileLastRateID?hotelID=1")
//     .then((result) => result.json())
//     .then((resp) => {
//       lastRate = resp["data"];
//     }),
// ];

// let lastRoomID = [
//   fetchx(API_URL + "/getGuestProfileLastRoomID?hotelID=1")
//     .then((result) => result.json())
//     .then((resp) => {
//       lastRoomID = resp["data"];
//     }),
// ];

// let vipID = [
//   fetchx(API_URL + "/getGuestProfileVipID?hotelID=1")
//     .then((result) => result.json())
//     .then((resp) => {
//       vipID = resp["data"];
//     }),
// ];

// let countryOptions = [
//   fetchx(API_URL + "/getGuestProfileCountry?hotelID=1")
//     .then((result) => result.json())
//     .then((resp) => {
//       countryOptions = resp["data"];
//     }),
// ];

// const salutations = [
//   { value: "Mr", label: "Mr." },
//   { value: "Mrs", label: "Mrs." },
//   { value: "Ms", label: "Ms." },
//   { value: "Dr", label: "Dr." },
//   { value: "Mast.", label: "Mast.." },
//   { value: "Prof", label: "Prof." },
//   { value: "Capt", label: "Capt." },
//   { value: "Wg Cdr.", label: "Wg Cdr." },
//   { value: "Major.", label: "Major." },
//   { value: "Brig", label: "Brig." },
//   { value: "Col.", label: "Col." },
//   { value: "Lt Col", label: "Lt Col" },
//   { value: "Lt", label: "Lt." },
//   { value: "Maj Gen.", label: "Maj Gen" },
// ];

// const Floor = ({ stepper, type, data1 }) => {

//   const [defaultValue, setDefaultValue] = useState(null);
//   const [gstNumber,setgstNumber] = useState()
//   const [selectedValue1, setSelectedValue1] = useState(data1.salutation);
//   const [selectedValue3, setSelectedValue3] = useState(data1.companyID);
//   const [selectedValue4, setSelectedValue4] = useState(data1.vipID);
//   const [isValidating, setIsValidating] = useState(false);
//   const [showGSTModal, setShowGSTModal] = useState(false);
//   const [tagCompany,settagCompany] = useState(false)
//   const [gstDetails, setGstDetails] = useState(null);
//   const [defaultReason3,setdefaultReason3] = useState({
//     value: data1.companyID,
//     label: data1.accountName,
//   })
//   const [reload, setreload] = useState(true);
//   const [load, setload] = useState(true);
//   const {  clearErrors } = useForm();
//   //Salutation
//   const handleChange1 = (selectedOption1) => {
//     setSelectedValue1(selectedOption1.value);
//     localStorage.removeItem("salutation");
//     localStorage.setItem("salutation", selectedOption1.label);
//     localStorage.setItem("salutation", selectedOption1.value);
//     setreload(false);
//     setTimeout(() => {
//       setreload(true);
//     }, 1);
//   };

// const TagGuestCompany  =() =>{
//   fetch(API_URL + "/findOrCreateCompanyByGST", {
//     method: "POST",
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//      GSTIN:gstNumber
//     })
//   })
//   .then(result => result.json())
//   .then(resp => {
//     if(resp.statusCode==200){
//     console.log(resp['data'])
//     let default1 = {
//       value: resp['data'][0]['companyid'],
//       label: resp['data'][0]['accountName'],
//     };

//     console.log(default1)
//     setdefaultReason3(default1)
//     handleChange3(default1)
//     settagCompany(false)}
//     else{

//     }
//   })
//   .catch((error) => {
//     console.log(error);
    
//   });

  
      
// }
//  const onChange=(e) => {
//     const newValue = e.target.value.toUpperCase();
//     onChange(newValue);
    
//     if (newValue.length === 15) {
//       // setIsValidating(true);
//       getGSTINData(newValue)
//         .then(response => {
//           console.log('GST Validation Success:', response);
//           // setIsValidating(false);
//         })
//         .catch(error => {
//           console.error('GST Validation Error:', error);
//           // setIsValidating(false);
//         });
//     }else if (newValue.length != 0 && newValue.length < 15){
//       setIsValidating(true);
//       setError('gst', {
//         type: 'manual',
//         message: "Invalid GST Number",
//       });
//     }
//   }


//   const getGSTINData = async (GSTIN) => {
//     try {
//       const response = await fetch(API_URL+'/verify-gst', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ GSTIN })
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         setError('gst', {
//           type: 'manual',
//           message: data.data.message || "Invalid GST Number",
//         });
//         throw new Error(data.error);

//       }
     
//       setGstDetails(data.data)
//       if(data.data.message === 'GSTIN Exists'){
//         console.log('validGST')
//         settagCompany(true)
        
//       }
//       return data.data;
//     } catch (error) {
      
//       setError('gst', {
//         type: 'manual',
//         message: error.message || "Invalid GST Number",
//       });
//       throw error.message || 'GST validation failed';
//     }
//   };
  
  
  
//   const handleChange3 = (selectedOption3) => {
//     console.log(selectedOption3)
//     if(selectedOption3!=null){
//     setdefaultReason3(selectedOption3)

//     console.log('handle hnage 23')
//     setSelectedValue3(selectedOption3.value);
 
//     localStorage.removeItem("companyID");
//     localStorage.setItem("companyID", selectedOption3.label);
//     localStorage.setItem("companyID", selectedOption3.value);


//     setreload(false);
//     setTimeout(() => {
//       setreload(true);
//     },);
//   }else{
//     setdefaultReason3()
//     setSelectedValue3()
//   }
//   };

//   const handleChange4 = (selectedOption4) => {
//     setSelectedValue4(selectedOption4.value);

//     localStorage.removeItem("vipID");
//     localStorage.setItem("vipID", selectedOption4.label);
//     localStorage.setItem("vipID", selectedOption4.value);

//     setreload(false);
//     setTimeout(() => {
//       setreload(true);
//     }, 1);
//   };

//   const defaultReason = {
//     value: data1.country,
//     label: data1.countryName,
//   };
//   //Salutation
//   const defaultReason1 = {
//     value: data1.salutation,
//     label: data1.salutation,
//   };

//   const defaultReason2 = {
//     value: data1.nationality,
//     label: data1.nationalityName,
//   };

//   // let defaultReason3 = {
//   //   value: data1.companyID,
//   //   label: data1.accountName,
//   // };

//   const defaultReason4 = {
//     value: data1.vipID,
//     label: data1.vipType,
//   };
//   // Ag Grid
//   const [rowData, setRowData] = useState();

//   const [centeredModal, setCenteredModal] = useState(false);

//   const gridRef = useRef();
//   const cellClickedListener = useCallback((event) => {
//     localStorage.setItem("id", data1["id"]);
//     setautofill(true);
//     setShowForm(false);
//     seteditable(true);
//     setTimeout(() => {
//       setShowForm(true);
//     }, 200);
//     setenableEditBtn(false);
//   }, []);

//   // ** Hooks
//   const {
//     setError,
//     formState: { errors },
//     setValue,
//   } = useForm();

//   // ** State
//   const [data, setData] = useState(null);

//   // ** Hooks
//   const { reset, handleSubmit, control, watch } = useForm({ defaultValues });
//   let navigate = useNavigate();

//   const beginDate = watch("beginDate");
//   const today = Moment().format("YYYY-MM-DD");
//   const options = {
//     maxDate: today,
//   };
//   const twelveYearsAgo = Moment().subtract(12, "years").format("YYYY-MM-DD");

//   const doboptions = {
//     maxDate: twelveYearsAgo,
//   };

//   const [flag, setflag] = useState(false);

//   // const onSubmit = (data) => {
//   //   // if(data.gst.length!=0 && data.gst.length<15){
//   //   //   setIsValidating(true)
//   //   // }
//   //   setData(data);
//   //   if (data.firstName !== null && data.lastName !== null) {
//   //     let createmarketGroup = JSON.stringify({
//   //       salutation: selectedValue1,
//   //       firstName: data.names,
//   //       lastName: data.surname,
//   //       email: data.emailBasic,
//   //       phoneNumber: data.phonenumber,
//   //       gstID: data.gst,
//   //       nationality:
//   //         (data.nationalities === undefined)
//   //         ? data1.nationality
//   //         : (data.nationalities === null)
//   //           ? null
//   //           : data.nationalities.value,
//   //       dob:
//   //         data.beginDate1 === data1.dob
//   //           ? data.beginDate1
//   //           : Moment(String(new Date(data.beginDate1[0]))).format("YYYY-MM-DD"),
//   //       vipID: 
//   //       (data.vip1 === undefined)
//   //       ? data1.vipID
//   //       : (data.vip1 === null)
//   //         ? null
//   //         : data.vip1.value,
//   //       addressOne: data.addresses,
//   //       addressTwo: data.addressTwo2,
//   //       anniversary:
//   //         data.aniver1 === data1.anniversary
//   //           ? data.aniver1
//   //           : Moment(String(new Date(data.aniver1[0]))).format("YYYY-MM-DD"),
//   //       companyID: selectedValue3,
//   //       country:
//   //       (data.countries === undefined)
//   //       ? data1.country
//   //       : (data.countries === null)
//   //         ? null
//   //         : data.countries.value,
//   //       state: data.states11,
//   //       city: data.city1,
//   //       postalCode: data.postalCode2,
//   //       notes: data.notes1,
//   //       guestpreferencenotes: data.guestnotes1,
//   //     });
//   //     let columnsToUpdate = createmarketGroup;
//   //     let res = fetchx(API_URL + `/updateguestprofile?id=${data1.id}`, {
//   //       method: "PUT",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: columnsToUpdate,
//   //     })
//   //       .then((result) => result.json())
//   //       .then((resp) => {
          
//   //         localStorage.setItem("id", data1["id"]);
          
//   //         if (flag == true) {
//   //           const swalInstance = MySwal.fire({
//   //             text: "Guest Edited Successfully!",
//   //             icon: "success",
//   //             buttonsStyling: false,
//   //             confirmButtonText: "Close",
//   //             allowOutsideClick: false,
//   //             customClass: {
//   //               confirmButton: "btn btn-danger",
//   //             },
//   //           });
//   //           swalInstance.then((result) => {
//   //             if (result.isConfirmed) {
//   //               navigate("");
//   //             }
//   //           });
           
//   //         } else if (flag == false) {
//   //           const swalInstance = MySwal.fire({
//   //             text: "Guest Edited Successfully. Edit ID Details!",
//   //             icon: "success",
//   //             buttonsStyling: false,
//   //             confirmButtonText: "Close",
//   //             allowOutsideClick: false,
//   //             customClass: {
//   //               confirmButton: "btn btn-danger",
//   //             },
//   //           });
//   //           swalInstance.then((result) => {
//   //             if (result.isConfirmed) {
//   //               stepper.next();
//   //             }
//   //           });

//   //         }
//   //       })
//   //       .catch((error) => {
//   //       });
//   //   }
//   // };


//    const onSubmit = (data) => {
//           if (data.firstName !== null && data.name !== null) {
//               console.log(data.dob);
//               let createmarketGroup = JSON.stringify({
//                   salutation: data.salutation.label,
//                   firstName: data.name,
//                   lastName: data.lastName,
//                   email: data.emailBasic,
//                   phoneNumber: data.phoneNumber,
//                   gstID: data.gst,
//                   nationality: data.nationality === null ? null : data.nationality.value,
//                   dob:
//                       data.dob === ""
//                           ? null
//                           : Moment(String(new Date(data.dob[0]))).format("YYYY-MM-DD"),
//                   vipID: data.vipID === null ? null : data.vipID.value,
//                   addressOne: data.addressOne,
//                   addressTwo: data.addressTwo,
//                   anniversary:
//                       data.anniversary === ""
//                           ? null
//                           : Moment(String(new Date(data.anniversary[0]))).format(
//                               "YYYY-MM-DD"
//                           ),
//                   companyID: selectedValue3,
//                   country: data.country === null ? null : data.country.value,
//                   state: data.state,
//                   notes: data.notes,
//                   city: data.city,
//                   postalCode: data.postalCode,
//                   guestpreferencenotes: data.guestpreferencenotes,
//               });
//               console.log(createmarketGroup);
//               console.log("hi");
//               let res = fetchx(API_URL + "/guestProfile", {
//                   method: "POST",
//                   headers: { "Content-Type": "application/json" },
//                   body: createmarketGroup,
//               })
//                   .then((result) => result.json())
//                   .then((resp) => {
//                       localStorage.setItem("guestID", resp["data"]);
//                       console.log(resp);
//                       // stepper.next()
//                       // navigate('')
//                       if (resp.statusCode == 200) {
//                           fetchx(API_URL + `/getGuestProfileNew?hotelID=1`)
//                               .then((result) => result.json())
//                               .then((rowData) => {
//                                   setRowData(rowData["data"]);
//                                   console.log(rowData["data"]);
//                               });
  
//                           console.log(flag == true);
//                           console.log(flag);
//                           console.log(flag == false);
//                           if (flag == true) {
//                               const swalInstance = MySwal.fire({
//                                   text: "Guest Added Successfully!",
//                                   icon: "success",
//                                   buttonsStyling: false,
//                                   confirmButtonText: "Close",
//                                   allowOutsideClick: false,
//                                   customClass: {
//                                       confirmButton: "btn btn-danger",
//                                   },
//                               });
//                               swalInstance.then((result) => {
//                                   if (result.isConfirmed) {
//                                       navigate("");
//                                   }
//                               });
//                               // navigate('');
//                               console.log("Save and exit after form submit");
//                           } else if (flag == false) {
//                               const swalInstance = MySwal.fire({
//                                   text: "Guest Added Successfully!Please do add ID Details",
//                                   icon: "success",
//                                   buttonsStyling: false,
//                                   confirmButtonText: "Close",
//                                   allowOutsideClick: false,
//                                   customClass: {
//                                       confirmButton: "btn btn-danger",
//                                   },
//                               });
//                               swalInstance.then((result) => {
//                                   if (result.isConfirmed) {
//                                       stepper.next();
//                                   }
//                               });
//                               // stepper.next();
//                               console.log("Save and next after form submit");
//                           }
//                       }
//                   })
//                   .catch((error) => {
//                       console.log(error);
//                   });
//           }
//       };

  
//   const handleReset = () => {
//     reset({
//       salutation1: null,
//       name1: "",
//       lastName1: "",
//       email1: "",
//       phoneNumber: "",
//       gstID: "",
//       nationality: "",
//       dob: "",
//       vipID: null,
//       addressOne1: "",
//       addressTwo: "",
//       anniversary1: "",
//       companyID1: null,
//       country1: null,
//       states11: "",
//       notes: "",
//       city: "",
//       postalCode1: "",
//       guestpreferencenotes11: "",
//     });
//   };

//   window.onload = function () {
//     localStorage.clear();
//   };

//   return (
//     <div>
//       <Card>
//         <CardBody>
//           <Form onSubmit={handleSubmit(onSubmit)}>
//             <Row>
//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="salu">
//                     Salutation <spam style={{ color: "red" }}>*</spam>
//                   </Label>
//                   <Controller
//                     required
//                     id="salu"
//                     control={control}
//                     name="salu"
//                     render={({ field }) => (
//                       <Select
//                         required
//                         isClearable
//                         defaultValue={defaultReason1}
//                         options={salutations}
//                         classNamePrefix="select"
//                         theme={selectThemeColors}
//                         className={classnames("react-select", {
//                           "is-invalid": data !== null && data.salu === null,
//                         })}
//                         {...field}
//                         onChange={handleChange1}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>

//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="names">
//                     First Name <spam style={{ color: "red" }}>*</spam>
//                   </Label>
//                   <Controller
//                     defaultValue={data1["firstName"]}
//                     control={control}
//                     id="names"
//                     name="names"
//                     render={({ field }) => (
//                       <Input
//                         required
//                         placeholder="Name"
//                         invalid={errors.names && true}
//                         {...field}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>

//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="surname">
//                     Last Name <spam style={{ color: "red" }}>*</spam>
//                   </Label>
//                   <Controller
//                     defaultValue={data1["lastName"]}
//                     control={control}
//                     id="surname"
//                     name="surname"
//                     render={({ field }) => (
//                       <Input
//                         required
//                         placeholder="Last Name"
//                         invalid={errors.surname && true}
//                         {...field}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>
//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="emailBasic">
//                     Email
//                   </Label>
//                   <Controller
//                     defaultValue={data1["email"]}
//                     control={control}
//                     id="emailBasic"
//                     name="emailBasic"
//                     render={({ field }) => (
//                       <Input
//                         placeholder="emailBasic"
//                         invalid={errors.emailBasic && true}
//                         {...field}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>
//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="phonenumber">
//                     Phone Number
//                   </Label>

//                   <Controller
//                     id="phonenumber"
//                     name="phonenumber"
//                     control={control}
//                     placeholder="1 234 567 8900"
//                     render={({ field }) => (
//                       <Cleave
//                         pattern="^(?:\+[0-9]{10,13}|[0-9]{10,13})$"
//                         title="Phone number Can take Max 12 digits with Country Code, 10 digits without Country Code"
//                         {...field}
//                         value={data1["phoneNumber"]}
//                         className={classnames("form-control")}
//                         options={{ phone: true, phoneRegionCode: "IN" }}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>
//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="vip1">
//                     VIP Status
//                   </Label>
//                   <Controller
//                     id="vip1"
//                     control={control}
//                     name="vip1"
//                     render={({ field }) => (
//                       <Select
//                         defaultValue={defaultReason4}
//                         isClearable
//                         options={vipID}
//                         classNamePrefix="select"
//                         theme={selectThemeColors}
//                         className={classnames("react-select", {
//                           // "is-invalid": data !== null && data.vip1 === null,
//                         })}
//                         {...field}
//                         // onChange={handleChange4}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>

//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="beginDate1">
//                     Date Of Birth
//                   </Label>
//                   <Controller
//                     defaultValue={data1["dob"]}
//                     control={control}
//                     id="beginDate1"
//                     name="beginDate1"
//                     render={({ field }) => (
//                       <Flatpickr
//                         {...field}
//                         options={doboptions}
//                         placeholder="YYYY-MM-DD "
//                         className={classnames("form-control", {})}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>

//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="aniver1">
//                     Anniversary
//                   </Label>
//                   <Controller
//                     defaultValue={data1["anniversary"]}
//                     control={control}
//                     id="aniver1"
//                     name="aniver1"
//                     render={({ field }) => (
//                       <Flatpickr
//                         {...field}
//                         options={options}
//                         placeholder="YYYY-MM-DD "
//                         className={classnames("form-control", {
//                           // 'is-invalid': data !== null && data.aniver1 === null
//                         })}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>

//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="addresses">
//                     Address One
//                   </Label>
//                   <Controller
//                     defaultValue={data1["addressOne"]}
//                     control={control}
//                     id="addresses"
//                     name="addresses"
//                     render={({ field }) => (
//                       <Input
//                         placeholder="Address One"
//                         invalid={errors.addresses && true}
//                         {...field}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>
//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="addressTwo2">
//                     Address 2
//                   </Label>
//                   <Controller
//                     control={control}
//                     id="addressTwo2"
//                     name="addressTwo2"
//                     render={({ field }) => (
//                       <Input
//                         defaultValue={data1["addressTwo"]}
//                         placeholder="Address Two"
//                         invalid={errors.addressTwo2 && true}
//                         {...field}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>
//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="city1">
//                     City
//                   </Label>
//                   <Controller
//                     control={control}
//                     id="city1"
//                     name="city1"
//                     render={({ field }) => (
//                       <Input
//                         defaultValue={data1["city"]}
//                         placeholder="city1"
//                         invalid={errors.city1 && true}
//                         {...field}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>

//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="states11">
//                     State
//                   </Label>
//                   <Controller
//                     control={control}
//                     id="states11"
//                     name="states11"
//                     render={({ field }) => (
//                       <Input
//                         defaultValue={data1["state"]}
//                         placeholder="State"
//                         invalid={errors.states11 && true}
//                         {...field}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>

//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="countries">
//                     Country
//                   </Label>
//                   <Controller
//                     // defaultValue={defaultReason}
//                     id="countries"
//                     control={control}
//                     name="countries"
//                     render={({ field }) => (
//                       <Select
//                         isClearable
//                         defaultValue={defaultReason}
//                         options={countryOptions}
//                         classNamePrefix="select"
//                         theme={selectThemeColors}
//                         className={classnames("react-select")}
//                         {...field}
//                         // onChange={handleChange}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>
//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="postalCode2">
//                     PostalCode
//                   </Label>
//                   <Controller
//                     control={control}
//                     id="postalCode2"
//                     name="postalCode2"
//                     render={({ field }) => (
//                       <Input
//                         defaultValue={data1["postalCode"]}
//                         //     pattern='[0-9-]{1,15}'
//                         // title="Postal Code can contain numbers . It cannnot contain alphabets and special characters."
//                         pattern="[a-zA-Z0-9\-]+"
//                         title="Postal Code can contain numbers, alphabets and hyphens only"
//                         placeholder="postalCode"
//                         invalid={errors.postalCode2 && true}
//                         {...field}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>
//               <Col md="3" sm="12">
//   <div className="mb-1">
//     <Label className="form-label" for="gst">
//       GST Number
//     </Label>
//     <Controller
//       control={control}
//       id="gst"
//       name="gst"
//       rules={{
//         pattern: {
//           value: /^[0-9A-Z]{15}$/,
//           message: 'GST number must be 15 characters',
//         },
//         // validate: async (value) => {
//         //   if (value && value.length === 15) {
//         //     try {
//         //       const response = await getGSTINData(value);
//         //       if (!response.valid || response.message === "GSTIN Doesn't Exist") {
//         //         setIsValidating(true);

//         //         return response.message || "Invalid GST Number";
//         //       }
//         //       return true;
//         //     } catch (error) {
//         //       setIsValidating(true);

//         //       return error.message || "Invalid GST Number";
//         //     }
//         //   }
//         //   return true; // Validation passes if the field is empty
//         // },
//       }}
//       render={({ field: { onChange, value, ...field } }) => (
//         <>
//           <Input
//             {...field}
//             value={gstNumber || ''}
//             onChange={(e) => {
//               setgstNumber(e.target.value)
//               const newValue = e.target.value.toUpperCase();
//               onChange(newValue);

//               // ✅ Clear error if field is empty
//               if (newValue.length === 0) {
//                 setIsValidating(false);

//                 clearErrors('gst');
//                 return;
//               }

//               // ✅ Validate GST when it reaches 15 characters
//               if (newValue.length === 15) {
//                 getGSTINData(newValue)
//                   .then((response) => {
//                     if (response.valid && response.message === "GSTIN Exists") {
//                       setIsValidating(false);

//                       clearErrors('gst'); // ✅ Clear error when GST is valid
//                     } else {
//                       setIsValidating(true);

//                       setError('gst', {
//                         type: 'manual',
//                         message: response.message || "Invalid GST Number",
//                       });
//                     }
//                   })
//                   .catch((error) => {
//                     setIsValidating(true);

//                     setError('gst', {
//                       type: 'manual',
//                       message: error.message || "Invalid GST Number",
//                     });
//                   });
//               }
//               else if (newValue.length != 0 && newValue.length < 15){
//                 setIsValidating(true)
//               }else{
//                 setIsValidating(false)
//               }
//             }}
//             defaultValue={data1["gstID"] || ''}
//             placeholder="Enter GST Number"
//             invalid={isValidating}
//           />

//            {/* Eye Icon - Shows Only When GST is Valid */}
//           {/* Eye Icon Inside Input Field */}
//           {!isValidating &&  gstDetails &&  (
//             <span
//               className="position-absolute"
//               style={{
//                 paddingTop : '100px',
//                 paddingRight :'400px',
//                 right: "10px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 cursor: "pointer",
//                 fontSize: "1.2rem",
//                 color: "#6c757d",
//               }}
//               onClick={() => setShowGSTModal(true)}
//               // onClick={() => alert('Hiii')}
//             >
//               <FaEye />
//             </span>
//           )}
//         </>
//       )}
//     />
//   </div>
// </Col>


//               <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="nationalities">
//                     Nationality
//                   </Label>
//                   <Controller
//                     // defaultValue={defaultReason}
//                     id="nationalities"
//                     control={control}
//                     name="nationalities"
//                     render={({ field }) => (
//                       <Select
//                         isClearable
//                         defaultValue={defaultReason2}
//                         options={countryOptions}
//                         classNamePrefix="select"
//                         theme={selectThemeColors}
//                         className={classnames("react-select")}
//                         {...field}
//                         // onChange={handleChange}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>

//               {reload && <Col md="3" sm="12">
//                 <div className="mb-1">
//                   <Label className="form-label" for="membershipType1">
//                     Company Name
//                   </Label>
//                   <Controller
//                     id="membershipType1"
//                     control={control}
//                     name="membershipType1"
//                     render={({ field }) => (
//                       <Select
//                         // required
//                         isClearable
//                         isDisabled = {gstNumber ? gstNumber.length==15 : false}
//                         defaultValue={defaultReason3}
//                         options={companyID}
//                         classNamePrefix="select"
//                         theme={selectThemeColors}
//                         className={classnames("react-select", {
//                           "is-invalid":
//                             data !== null && data.membershipType1 === null,
//                         })}
//                         {...field}
//                         onChange={handleChange3}
//                       />
//                     )}
//                   />
//                 </div>
//               </Col>}

//               <Col md="4" sm="12" className="mb-1">
//                 <div className="mb-1">
//                   <Controller
//                     defaultValue={data1["notes"]}
//                     control={control}
//                     id="notes1"
//                     name="notes1"
//                     render={({ field }) => (
//                       <InputGroup>
//                         <InputGroupText>Profile Notes</InputGroupText>
//                         <Input
//                           isClearable
//                           placeholder=" Profile Notes"
//                           type="textarea"
//                           // pattern='[A-Za-z_]{1,15}'
//                           // title=" guestpreferencenotes can contain alphabets . It cannnot contain numbers and special characters." required
//                           invalid={errors.notes1 && true}
//                           {...field}
//                         />
//                       </InputGroup>
//                     )}
//                   />
//                 </div>
//               </Col>

//               <Col md="5" sm="12" className="mb-1">
//                 <div className="mb-1">
//                   <Controller
//                     defaultValue={data1["guestpreferencenotes"]}
//                     control={control}
//                     id="guestnotes1"
//                     name="guestnotes1"
//                     render={({ field }) => (
//                       <InputGroup>
//                         <InputGroupText>Guest Preference Notes</InputGroupText>
//                         <Input
//                           isClearable
//                           placeholder=" Guest Preference Notes"
//                           type="textarea"
//                           // pattern='[A-Za-z_]{1,15}'
//                           // title=" guestpreferencenotes can contain alphabets . It cannnot contain numbers and special characters." required
//                           invalid={errors.guestnotes1 && true}
//                           {...field}
//                         />
//                       </InputGroup>
//                     )}
//                   />
//                 </div>
//               </Col>
//             </Row>

//             <div className="vertically-centered-modal">
//               <Modal
//                 isOpen={centeredModal}
//                 toggle={() => setCenteredModal(!centeredModal)}
//                 className="modal-xl"
//               >
//                 <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
//                   Vertically Centered
//                 </ModalHeader>
//                 <ModalBody>{/* <ViewModal /> */}</ModalBody>
//                 <ModalFooter>
//                   <Button
//                     color="primary"
//                     onClick={() => setCenteredModal(!centeredModal)}
//                   >
//                     Accept
//                   </Button>
//                 </ModalFooter>
//               </Modal>
//             </div>
//             <div align='end' className='buttons' >
//               {/* <div className="d-flex"> */}
//                 <Button
//                   className="me-1"
//                   color="primary"
//                   type="submit"
//                   disabled = {isValidating}
//                   onClick={() => setflag(false)}
//                 >
//                   Save And Next
//                 </Button>
//                 <Button
//                   className="me-1"
//                   color="primary"
//                   type="submit"
//                   disabled = {isValidating}
//                   onClick={() => setflag(true)}
//                 >
//                   Save And Exit
//                 </Button>
//                 <Button
//                   outline
//                   color="secondary"
//                   type="reset"
//                   onClick={handleReset}
//                 >
//                   Reset
//                 </Button>
//               {/* </div> */}
//             </div>
//           </Form>
//         </CardBody>
//       </Card>

//             {/* GST Details Modal */}
//   {showGSTModal && gstDetails && (
//     <Modal isOpen={showGSTModal} toggle={() => setShowGSTModal(false)}>
//       <ModalHeader toggle={() => setShowGSTModal(false)}>
//         GST Details
//       </ModalHeader>
//       <ModalBody>
//         <p><strong>Legal Name:</strong> {gstDetails.legal_name_of_business}</p>
//         <p><strong>Trade Name:</strong> {gstDetails.trade_name_of_business}</p>

        
//         <p><strong>GST Number:</strong> {gstDetails.GSTIN}</p>
//         <p><strong>Address:</strong> {gstDetails.principal_place_address}</p>
//       </ModalBody>
//       <ModalFooter>
//         <Button color="secondary" onClick={() => setShowGSTModal(false)}>
//           Close
//         </Button>
//       </ModalFooter>
//     </Modal>
//   )}

// {tagCompany && gstDetails && (
//     <Modal isOpen={tagCompany}>
//       <ModalHeader toggle={() => {settagCompany(false)
//                   setgstNumber()}
//                 }>
//         GST Details
//       </ModalHeader>
//       <ModalBody>
//         <h3>        Do you want to tag this company to this profile?
//         </h3>
//         <p><strong>Legal Name:</strong> {gstDetails.legal_name_of_business}</p>
//         <p><strong>Trade Name:</strong> {gstDetails.trade_name_of_business}</p>

//         <p><strong>GST Number:</strong> {gstDetails.GSTIN}</p>
//         <p><strong>Address:</strong> {gstDetails.principal_place_address}</p>
//       </ModalBody>
//       <ModalFooter>
//       <Button color="primary" onClick={() => TagGuestCompany()}>
//           OK
//         </Button>
//         <Button color="danger" onClick={() => {settagCompany(false)
//                     setgstNumber()
//                     // setdefaultReason3()
//                     // setreload(false);
//                     // setTimeout(() => {
//                     //   setreload(true);
//                     // },);
//                   }
//                   }>
//                     Close
//                   </Button>
//       </ModalFooter>
//     </Modal>
//   )}
//     </div>
//   );
// };

// export default Floor;
