// ** React Imports
import { useState } from "react";
import axios from "axios";
// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import API_URL from "../../../config";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {
  Input,
  Card,
  Form,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  InputGroup,
  InputGroupText,
  Row,
  Col
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

import {useRef, useEffect, useMemo, useCallback} from 'react';
const id='1'
import { useNavigate } from 'react-router-dom';

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const countryoptions = [
  { value: "Afghanistan", label: "Afghanistan" },
  { value: "Australia", label: "Australia" },
  { value: "Bangladesh", label: "Bangladesh" },
  { value: "Bhutan", label: "Bhutan" },
  { value: "Hong Kong", label: "Hong Kong" },
  { value: "India", label: "India" },
  { value: "Japan", label: "Japan" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "United States", label: "United States" },
];

const stateOptions = [
  { value: 'Daman', label: 'Daman' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Goa', label: 'Goa' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Haryana', label: 'Haryana' },
  { value: 'HimachalPradesh', label: 'Himachal Pradesh' },
  { value: 'Jammu Kashmir', label: 'Jammu Kashmir' },
  { value: 'Jharkhand', label: 'Jharkhand' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Kerala', label: 'Kerala' },
  { value: 'Ladakh', label: 'Ladakh' },
  { value: 'Lakshadweep', label: 'Lakshadweep' },
  { value: 'MadhyaPradesh', label: 'Madhya Pradesh' },
  { value: 'Maharastra', label: 'Maharastra' },
  { value: 'Manipur', label: 'Manipur' },
  { value: 'Meghalaya', label: 'Meghalaya' },
  { value: 'Mizoram', label: 'Mizoram' },
  { value: 'Nagaland', label: 'Nagaland' },
  { value: 'Odisha', label: 'Odisha' },
  { value: 'Puducherry', label: 'Puducherry' },
  { value: 'Punjab', label: 'Punjab' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Sikkim', label: 'Sikkim' },
  { value: 'TamilNaidu', label: 'TamilNaidu' },
  { value: 'Telangana', label: 'Telangana' },
  { value: 'Uttarpradesh', label: 'Uttarpradesh' },
]

const activeoptions = [
  { value: "1", label: "Active" },
  { value: "0", label: "InActive" },
];


const defaultValues = {
  accountID: "",
  name: "",
  emailID: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  country: null,
  state: null,
  city: "",
  postalCode: "",
  isActive: null,
};

const ValidationThirdPartyComponents = ({stepper,data1}) => {
     // ** Hooks
  const {
    setError,
    formState: { errors }
  } = useForm()


  const [rowData, setRowData] = useState();

  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
     {headerName: 'Name',field: 'name'},
    {headerName: 'Email ID',field: 'emailID'},
    {headerName: 'Phone',field: 'phone'},
    {headerName: 'Address Line1',field: 'addressLine1'},
    {headerName: 'Address Line2',field: 'addressLine2'},
    {headerName: 'Country',field: 'country'},
    {headerName: 'State',field: 'state'},
    {headerName: 'City',field: 'city'},
    {headerName: 'Postal Code',field: 'postalCode'},
    {headerName: 'Is Active',field: 'isActive'},

  ]);

  const defaultColDef = useMemo( ()=> (
    {
      sortable: true, 
      filter: true,
      filterParams :{
      buttons : ['apply','reset']
      }
    }
  ));

  const gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
      flex: 1,
      minWidth: 150,
      filter: true,
      sortable: true,
      floatingFilter: true,
    },
  };

  useEffect(() => {
    fetchx(API_URL + '/getbooker?hotelID='+id)
    .then(result => result.json())
    .then(rowData => {setRowData(rowData['data'])
    console.log(rowData['data'])
    })
  }, []);
  
  const cellClickedListener = useCallback( event => {
    console.log('cellClicked', event);
  }, []);


  // ** State
  const [data, setData] = useState(null);

  // ** Hooks
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  let navigate = useNavigate();  

  const [flag,setflag] = useState(false)
  const onSubmit = (data) => {
    console.log("flag",flag)
    setData(data);
    console.log(data)
   {
      console.log(data);
      let createasset = JSON.stringify({
        // "hotelID": data.hotelID,
        "accountID":localStorage.getItem('companyData'),
        "name": data.name,
        "emailID": data.emailID,
        "phone": data.phone,
        "addressLine1": data.addressLine1,
        "addressLine2": data.addressLine2,
        "country": data.country.value,
        "state": data.state.value,
        "city": data.city,
        "postalCode": data.postalCode,
        "isActive": 1,
      });
      console.log(createasset);
      let res = fetchx(API_URL + "/addbooker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: createasset,
      }).then(data => data.json())
      .then((res) => {
        console.log(res);
        console.log(flag==true)
            console.log(flag)
            console.log(flag==false)
           if(flag==true){
            if(res['statusCode']==200){
              // setTimeout(() => {  window.location.reload(true); }, 4000);          
              fetchx(API_URL + '/getbooker?hotelID='+id)
        .then(result => result.json())
        .then(rowData => {setRowData(rowData['data'])
        console.log(rowData['data'])
        const swalInstance = MySwal.fire({
          text: 'Booker Details Added Successfully!',
          // icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          allowOutsideClick: false,
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            navigate('');
          }
        }); 
        })
            }
            else{ const swalInstance = MySwal.fire({
              text: res.message,
              icon: 'error',
              buttonsStyling: false,
              confirmButtonText: 'Close',
              allowOutsideClick: false,
              customClass: {
                confirmButton: 'btn btn-danger'
              }
            });
            swalInstance.then((result) => {
              if (result.isConfirmed) {
                navigate('');
              }
            });}
             
           //  navigate('');
            console.log('Save and exit after form submit')           
           }
            else if(flag==false){
             
              if(res['statusCode']==200){
                // setTimeout(() => {  window.location.reload(true); }, 4000);          
                fetchx(API_URL + '/getbooker?hotelID='+id)
          .then(result => result.json())
          .then(rowData => {setRowData(rowData['data'])
          console.log(rowData['data'])
          const swalInstance = MySwal.fire({
            text: 'Booker Details Added Successfully! Please Map Rate Codes ',
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
              navigate('');
            }
          }); 
          })
              }
              else{ const swalInstance = MySwal.fire({
                text: res.message,
                icon: 'error',
                buttonsStyling: false,
                confirmButtonText: 'Close',
                allowOutsideClick: false,
                customClass: {
                  confirmButton: 'btn btn-danger'
                }
              });
              swalInstance.then((result) => {
                if (result.isConfirmed) {
                  navigate('');
                }
              });}
          //  stepper.next(); 
           console.log('Save and next after form submit')
          }
      
      });
      // toast(
      //   <div className="d-flex">
      //     <div className="me-1">
      //       <Avatar size="sm" color="success" icon={<Check size={12} />} />
      //     </div>
      //     <div className="d-flex flex-column">
      //       <h6>Form Submitted!</h6>
      //       <h4>Booker Details Added Successfull</h4>
      //     </div>
      //   </div>
      // );
    }
  };
  const handleReset = () => {
    reset({
      accountID: "",
      name: "",
      emailID: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      country: null,
      state: null,
      city: "",
      postalCode: "",
      isActive: null,
    });
  };

  return (
    <div>
   <div>
   <Form onSubmit={handleSubmit(onSubmit)}>
               <Row>
              
             
               <Col md='3' sm='12'>
                     <div className='mb-1'>
                       <Label className='form-label' for='name'>
                         Name <spam style={{color:'red'}}>*</spam>
                       </Label>
                       <Controller
                         defaultValue=''
                         control={control}
                         id='name'
                         name='name'
                         render={({ field }) => 
                         <Input 
                         required
                         placeholder='Name' invalid={errors.name && true} {...field}
                         // value={data1['name']} 
                         />}
                       />
                     </div>
                   </Col>

               <Col md='3' sm='12' className='mb-1'>
               <div className="mb-1">
                 <Label className="form-label" for="emailID">
                   Email <spam style={{color:'red'}}>*</spam>
                 </Label>
                 <InputGroup className="input-group-merge">
                    <Controller
                     id="emailID"
                     name="emailID"
                     control={control}
                     type="email"
                     render={({ field }) => (
                       <Cleave
                       required
                       placeholder="emailID"
                       pattern="[^@\s]+@[^@\s]+\.[^@\s]+" title="Invalid email address" 
                       
                         {...field}
                         className={classnames("form-control", {
                         })}
                       />
                     )}
                   />
                 </InputGroup>
               </div>
               </Col>

               <Col md='3' sm='12' className='mb-1'>
               <div className='mb-1'>
                 <Label className='form-label' for='phone'>
                   Phone <spam style={{color:'red'}}>*</spam>
                 </Label>
                 <InputGroup className='input-group-merge'>
                   <Controller
                     id='phone'
                     name='phone'
                     control={control}
                     render={({ field }) => (
                       <Cleave
                       required
                       pattern="[6-9]{1}[0-9]{9}" 
                       title="Phone number with 7-9 and remaing 9 digit with 0-9" 
                       placeholder='8234567892'
                         {...field}
                         className={classnames('form-control', {
                          //  'is-invalid': data !== null && (data.phone === null || !data.phone.length)
                         })}
                       />
                     )}
                   />
                 </InputGroup>
               </div>
               </Col>

               <Col md='3' sm='12' className='mb-1'>
                 <div className='mb-1'>
                 <Label className='form-label' for='addressLine1'>
                 Address Line 1
                 </Label>
                 <InputGroup className="input-group-merge">
                 <Controller
                   defaultValue=''
                   control={control}
                   id='addressLine1'
                   name='addressLine1'
                   render={({ field }) => <Input 
                   required
                  className={classnames({
                    //  "is-invalid": data !== null && (data.addressLine1 === null || !data.addressLine1.length)
                   })} {...field}/>}
                 />
                 </InputGroup>
               </div>
               </Col>

               <Col md='3' sm='12' className='mb-1'>
                 <div className='mb-1'>
                 <Label className='form-label' for='addressLine2'>
                 Address Line 2
                 </Label>
                 <InputGroup className="input-group-merge">
                 <Controller
                   defaultValue=''
                   control={control}
                   id='addressLine2'
                   name='addressLine2'
                   render={({ field }) => <Input 
                   required
                  className={classnames({
                    //  "is-invalid": data !== null && (data.addressLine2 === null || !data.addressLine2.length)
                   })} {...field}/>}
                 />
                 </InputGroup>
               </div>
               </Col>
               
               <Col md='3' sm='12' className='mb-1'>
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
                     required
                       isClearable
                       options={countryoptions}
                       classNamePrefix="select"
                       theme={selectThemeColors}
                       className={classnames("react-select", {
                        //  "is-invalid": data !== null && data.country === null,
                       })}
                       {...field}
                     />
                   )}
                 />
               </div>
               </Col>

               <Col md='3' sm='12' className='mb-1'>
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
                   required
                  pattern="[a-zA-Z ]*" title="Type Only Alphabets" 
                    placeholder='state' invalid={errors.state && true} {...field}
                    />}
                  />
                </div>
               </Col>

               <Col md='3' sm='12' className='mb-1'>
               <div className="mb-1">
                 <Label className="form-label" for="city">
                   City
                 </Label>                
                   <Controller
                     id="city"
                     name="city"
                     control={control}
                     placeholder="city"
                     render={({ field }) => (
                       <Cleave
                       required
                       pattern="[a-zA-Z ]*" title="Type Only Alphabets" 
                         {...field}
                         className={classnames("form-control", {
                          //  "is-invalid":
                            //  data !== null && (data.city === null || !data.city.length)
                         })}
                       />
                     )}
                   />
                 {/* </InputGroup> */}
               </div>
               </Col>

               <Col md='3' sm='12' className='mb-1'>
               <div className="mb-1">
                 <Label className="form-label" for="postalCode">
                   Postal Code <spam style={{color:'red'}}>*</spam>
                 </Label>
                 <InputGroup className="input-group-merge">
                  
                   <Controller
                     id="postalCode"
                     name="postalCode"
                     control={control}
                     placeholder="postalCode"
                     render={({ field }) => (
                       <Cleave
                       pattern="[0-9]{6}" title="Contains Only Numbers Max 6 Character" required
                         {...field}
                         className={classnames("form-control", {
                          //  "is-invalid":
                          //    data !== null && (data.postalCode === null || !data.postalCode.length)
                         })}
                       />
                     )}
                   />
                 </InputGroup>
               </div>
               </Col>
               
               {/* <Col md='3' sm='12' className='mb-1'>
               <div className="mb-1">
                 <Label className="form-label" for="isActive">
                   Is Active
                 </Label>
                 <Controller
                   id="isActive"
                   control={control}
                   name="isActive"
                   render={({ field }) => (
                     <Select
                     required
                       isClearable
                       options={activeoptions}
                       classNamePrefix="select"
                       theme={selectThemeColors}
                       className={classnames("react-select", {
                         "is-invalid": data !== null && data.isActive === null,
                       })}
                       {...field}
                     />
                   )}
                 />
               </div>
               </Col> */}
              
           <div className='d-flex justify-content-between'>
                        <div className='d-flex'>
                        <Button className='me-1' color='primary' type='submit' onClick={()=>setflag(false)}>
                        Save And Next
                        </Button>
                        <Button className="me-1" color="primary" type='submit' onClick={()=>setflag(true)}>
                          Create Booker
                        </Button>
                        <Button outline color='secondary' type='reset' onClick={handleReset}>
                        Reset
                        </Button>
                        </div> 
                    </div>
          </Row>
          </Form>
   </div>
   <br></br>
 
    </div>
  );
};

export default ValidationThirdPartyComponents;
