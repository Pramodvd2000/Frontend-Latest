// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import Select from 'react-select'
import toast from 'react-hot-toast'
import classnames from 'classnames'
import Cleave from 'cleave.js/react'
import { Check } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from "react-router-dom";

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { selectThemeColors } from '@utils'
import Moment from 'moment';

// ** Reactstrap Imports
import { Input, Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText } from 'reactstrap'
import { Plus } from 'react-feather'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from 'react';


import { ArrowLeft, ArrowRight } from 'react-feather'
import API_URL from '../../../config'
// const id = '1';



const defaultValues = {
 IDType: null,
 idNumber:'',
 issueDate:'',
 expiryDate: '',
 issuePlace:'', 
 firstName: '',
 idFile:'',
}


const IDTypes = [
 { value: 'adharCard', label: 'Adhar Card' },
 { value: 'panCard', label: 'PanCard' },
 { value: 'drivingLicense', label: 'DrivingLicense' },
 { value: 'passport', label: 'Passport' },
 { value: 'visaDetails', label: 'Visa Details' },
];

const type = [
 { value: "Black", label: "Black" },
 { value: "Gold", label: "Gold" },
 { value: "Silver", label: "Silver" },
 { value: "Platinum", label: "Platinum" },
];



const EditIdDetails = ({ stepper, type ,data1}) => {
 // //console.log(data1)
 // //console.log(data1.idDetails.IDType)
 let navigate = useNavigate();


 // Ag Grid
 const [rowData, setRowData] = useState();

 const gridRef = useRef();

 const [columnDefs, setColumnDefs] = useState([
 { headerName: 'IDType', field: 'IDType', suppressSizeToFit: true, maxWidth: 160 },
 { headerName: 'idNumber ', field: 'idNumber', suppressSizeToFit: true },
 // { headerName: 'panNumber ', field: 'panNumber', suppressSizeToFit: true },
 // { headerName: 'driving License Number ', field: 'drivingLicenseNumber', suppressSizeToFit: true },
 { headerName: 'Name', field: 'firstName', suppressSizeToFit: true, maxWidth: 160 },
 { headerName: 'expiryDate ', field: 'expiryDate', suppressSizeToFit: true },

 // "idNumber": data.idNumber,
 // "panNumber": data.panNumber,
 // "drivingLicenseNumber": data.drivingLicence,
 // "passportNumber": data.passportNumber,
 // "expiryDate": data.expiryDate,
 // "name": data.name,

 ]);

 const defaultColDef = useMemo(() => (
 {
 sortable: true,
 filter: true,
 filterParams: {
 buttons: ['apply', 'reset']
 }
 }
 ));

 const cellClickedListener = useCallback(event => {
 //console.log('cellClicked', event);
 }, []);

 useEffect(() => {
 fetchx(API_URL + '/getiddetails?hotelID=1')
 .then(result => result.json())
 .then(rowData => setRowData(rowData['data']))
 }, []);


 // ** Hooks
 const {
 setError,
 formState: { errors }
 } = useForm()



 // ** State
 const [data, setData] = useState(null)

 const [selectedValue, setSelectedOption] = useState('');

 const handleDropdownChange = (event) => {
 setSelectedOption(event.value);

 //console.log(event.value); // print the selected value to console
 if (selectedValue == 'drivingLicense') {
 //console.log("hi")
 //         setitemOptions([{ value: "1", label: "Active" }]) 
 }
 // else if (selectedValue == 'passport') {
 // //console.log("hi")
 // //         setitemOptions([{ value: "1", label: "Active" }]) 
 // }
 else {

 //         setitemOptions({ value: "0", label: "InActive" })
 }
 };



 // ** Hooks
 const { reset, handleSubmit, control } = useForm({ defaultValues })

 const onSubmit = data => {
 //console.log(localStorage.getItem('guestID'))
//  if (localStorage.getItem('guestID')!=null) {
//  // Submit form data
//  //console.log('Submitting form data...', );
 setData(data)
 data['IDType'] = selectedValue
 //console.log(data)
//  if (
//  data.IDType !== null &&
//  data.name !== null
//  ) 
//  {
 //console.log(data)
 let createmarketGroup = JSON.stringify({
 // "hotelID": data.hotelID,
 // "reservationID":localStorage.getItem('reservationid'),
 "guestID":data1['guestID'],
 "IDType": data.IDType,
 "idNumber": data.idNumber,
 "issueDate": (Moment(String(new Date(data.issueDate[0]))).format('YYYY-MM-DD')),
 "expiryDate": (Moment(String(new Date(data.expiryDate[0]))).format('YYYY-MM-DD')), 
 "issuePlace": data.issuePlace,
 "firstName": data.name,
//  "idFile": data.idFile, 
 "idFile": 'file.pdf', 

 })
 //console.log(createmarketGroup)
 // localStorage.removeItem('guestID')
 //console.log("hi")
 let res = fetchx(API_URL + "/addIdDetails", {
 method: "POST",
 headers: { 'Content-Type': 'application/json' },
 body: createmarketGroup
 }).then((res) => {
 //console.log(res);
 if (res['status'] == 200) {
 fetchx(API_URL + '/getiddetails?hotelID=1')
 .then(result => result.json())
 .then(rowData => {
 setRowData(rowData['data'])
 //console.log(rowData['data'])
 })
 }

 });
 toast(
 <div className='d-flex'>
 <div className='me-1'>
 <Avatar size='sm' color='success' icon={<Check size={12} />} />
 </div>
 <div className='d-flex flex-column'>
 <h6>Form Submitted!</h6>
 <h4>Floor Added Successfull</h4>
 </div>
 </div>
 )
//  }
//  } else {
//  //console.log(' Please Fill Basic Details ');
//  // <alert> Please Fill Basic Details</alert>
//  alert("Please Fill Basic Details First")
//  } 
 }

 // window.onload = function() {
 // localStorage.clear();
 // };

 function Refresh(){
    setTimeout(() => { navigate('/dashboard/TestAvailability');},1000)
 }

 const handleReset = () => {
 reset({
 IDType: null,
 idNumber:'',
 issueDate:'',
 expiryDate: '',
 issuePlace:'', 
 firstName: '',
 idFile:'',
 })
 }
 const [modal, setModal] = useState(false)

 const handleModal = () => setModal(!modal)
 
 return (
 <div>
 <Card>

 <CardBody>
 <Form onSubmit={handleSubmit(onSubmit)}>
 <Row>
 <Col md='4' sm='12' className='mb-1'>
 <div className="mb-1">
 <Label className="form-label" for="IDType">
 ID Type
 </Label>
 <Controller
 id="IDType"
 control={control}
 name="IDType"
 render={({ field }) => (
 <Select
 theme={selectThemeColors}
 className='react-select'
 classNamePrefix='select'
 // defaultValue={colourOptions[1]}
 name='IDType'
 options={IDTypes}
 isClearable
 onChange={handleDropdownChange}


 />
 )}
 />
 </div>
 </Col>

 {selectedValue === 'drivingLicense' && (
 <div>
 <Col md='4' sm='12'>
 <div className='mb-1'>
 <Label className='form-label' for='expiryDate'>
 Expiry Date
 </Label>
 <Controller
 control={control}
 id='expiryDate'
 name='expiryDate'
 render={({ field }) => (
 <Flatpickr
 {...field}
 options={{ allowInput: true }} placeholder='YYYY-MM-DD '
 className={classnames('form-control', {
 'is-invalid': data !== null && data.expiryDate === null
 })}
 />
 )}
 />
 </div>
 </Col>

 </div>
 )}

 {selectedValue === 'passport' && (
 <div>
 <Col md='4' sm='12'>
 <div className='mb-1'>
 <Label className='form-label' for='expiryDate'>
 Expiry Date
 </Label>
 <Controller
 control={control}
 id='expiryDate'
 name='expiryDate'
 render={({ field }) => (
 <Flatpickr
 {...field}
 options={{ allowInput: true }} placeholder='YYYY-MM-DD '
 className={classnames('form-control', {
 'is-invalid': data !== null && data.expiryDate === null
 })}
 />
 )}
 />
 </div>
 </Col>
 </div>
 )}
 <Col md='4' sm='12' className='mb-1'>
 <div className="mb-1">
 <Label className="form-label" for="idNumber">
 ID Number
 </Label>
 <Controller
 defaultValue=''
 control={control}
 id='idNumber'
 name='idNumber'
 render={({ field }) => <Input placeholder='idNumber'
 pattern='[0-9_]{1,15}'
 title="Adhar Number can contain numbers . It cannnot contain alphabets and special characters." required
 invalid={errors.idNumber && true} {...field}
 // value={data1.idDetails.idNumber} 
 />}
 />
 </div>
 </Col>
 <Col md='3' sm='12'>
 <div className='mb-1'>
 <Label className='form-label' for='issueDate'>
 Issue Date
 </Label>
 <Controller
 control={control}
 id='issueDate'
 name='issueDate'
 render={({ field }) => (
 <Flatpickr
 {...field}
 // value={data1.idDetails.idNumber} 

 options={{ allowInput: true }} placeholder='YYYY-MM-DD '
 className='form-control'
 />
 )}
 />
 </div>
 </Col>
 <Col md='4' sm='12' className='mb-1'>
 <div className="mb-1">
 <Label className="form-label" for="issuePlace">
 Issue Place
 </Label>
 <Controller
 defaultValue=''
 control={control}
 id='issuePlace'
 name='issuePlace'
 render={({ field }) => <Input placeholder='issuePlace'
 // pattern='[0-9_]{1,15}'
 // title="Adhar Number can contain numbers . It cannnot contain alphabets and special characters." required
 invalid={errors.issuePlace && true} {...field} />}
 />
 </div>
 </Col>

 <Col md='4' sm='12' className='mb-1'>
 <div className='mb-1'>
 <Label className='form-label' for='name'>
 Name On Card
 </Label>
 <Controller
 defaultValue=''
 control={control}
 id='name'
 name='name'
 render={({ field }) => <Input placeholder='Name' invalid={errors.name && true} 
 {...field} 
 // value={data1.idDetails.name} 
 />}
 />
 </div>
 </Col>
 </Row>
 <Col md='4' sm='12' className='mb-1'>
 <div className='mb-1'>
 <Label className='form-label' for='idFile'>
 Upload idFile
 </Label>
 <InputGroup className="input-group-merge">
 <Controller
 defaultValue=''
 control={control}
 id='idFile'
 name='idFile'
 placeholder='Add idFile'
 render={({ field }) => <Input type='file' className={classnames({
 "is-invalid": data !== null && (data.idFile === null || !data.idFile.length)
 })} {...field} />}
 />
 </InputGroup>
 </div>
 </Col>
 <div className='d-flex'>
 <Button className='me-1' color='primary' type='submit' onClick={Refresh}>
 Submit
 </Button>
 <Button outline color='secondary' type='reset' onClick={handleReset}>
 Reset
 </Button>
 </div>
 
 </Form>
 </CardBody>
 </Card>

 </div>
 )
}

export default EditIdDetails;