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
import CheckIn from './check-in'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { selectThemeColors } from '@utils'
import Moment from 'moment';

// ** Reactstrap Imports
import { Input, Card, Form, Row, Col, Label, Button, CardBody, Modal, ModalBody, ModalHeader, CardTitle, CardHeader, InputGroup, InputGroupText } from 'reactstrap'
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
import { padding } from '@mui/system'
import { left } from '@popperjs/core'
// const id = '1';


const defaultValues = {
    IDType: null,
    idNumber: '',
    issueDate1: '',
    expiryDate: '',
    issuePlace: '',
    firstName: '',
    idFile: '',
}


const IDTypes = [
    { value: 'Adhar Card', label: 'Adhar Card' },
    { value: 'Pan Card', label: 'Pan Card' },
    { value: 'Driving License', label: 'Driving License' },
    { value: 'Passport', label: 'Passport' },
    { value: 'Visa Details', label: 'Visa Details' },
];

const type = [
    { value: "Black", label: "Black" },
    { value: "Gold", label: "Gold" },
    { value: "Silver", label: "Silver" },
    { value: "Platinum", label: "Platinum" },
];



const ForCheckInIdDetails = ({ stepper, type, data1 }) => {
    //console.log(data1)
    // //console.log(data1.idDetails.IDType)
    let navigate = useNavigate();


    // Ag Grid
    const [checkIn, setCheckIn] = useState();
    const [rowData, setRowData] = useState();
    const [FullData, setFullData] = useState([]);

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
        fetchx(API_URL + '/getIDDetailsBasedOnGuestID?guestID=' + data1['guestID'],)
            .then(result => result.json())
            .then((res) => {
                //console.log(res['data']['0']['idDetails']['name'])
                // setFullData(res['data']['0'])
                setFullData(res['data']['0'])
                //  //console.log(FullData.idDetails)
                //    //console.log(FullData.idDetails.name)

            })


    }, []);
    if (FullData.length != 0) {
        //console.log(FullData.idDetails)
        //console.log(FullData.idDetails.name)

    }
    //  //console.log(FullData.idDetails.name)


    //  //console.log(FullData.idNumber)

    // ** Hooks
    const {
        setError,
        formState: { errors }
    } = useForm()



    // ** State
    const [data, setData] = useState(null)

    const [selectedValue, setSelectedOption] = useState('');

    const handleDropdownChange = (event) => {
        setSelectedOption(event.label);

        //console.log(event.value); // print the selected value to console
        if (selectedValue == 'Driving License') {
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
            "guestID": data1['guestID'],
            "IDType": selectedValue,
            "idNumber": data.idNumber1,
            "issueDate": (Moment(String(new Date(data.issueDate1))).format('YYYY-MM-DD')),
            "expiryDate": (Moment(String(new Date(data.expiryDate1))).format('YYYY-MM-DD')),
            "issuePlace": data.issuePlace1,
            "firstName": data.name1,
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
            //  if (res['status'] == 200) {
            //  fetchx(API_URL + '/getiddetails?hotelID=1')
            //  .then(result => result.json())
            //  .then(rowData => {
            //  setRowData(rowData['data'])
            //  //console.log(rowData['data'])
            //  })
            //  }

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

    function Refresh() {
        setTimeout(() => { navigate('/dashboard/TestAvailability'); }, 1000)
    }

    const handleReset = () => {
        reset({
            IDType: null,
            idNumber: '',
            issueDate1: '',
            expiryDate: '',
            issuePlace: '',
            firstName: '',
            idFile: '',
        })
    }
    const [modal, setModal] = useState(false)

    const handleModal = () => setModal(!modal)


    const defaultReason = {
        // value: FullData.idDetails.name,
        // label: FullData.idDetails.IDType,

    };
    // //console.log(FullData.idDetails)

    return (
        <div>

            {FullData.length != 0 && <Card>
                <CardHeader>
                    <CardTitle>ID Details</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            {FullData.length !== 0 &&<Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="IDType1">
                                        ID Type
                                    </Label>
                                    <Controller
                                        // defaultValue={IDTypes[1]}
                                        id="IDType1"
                                        control={control}
                                        name="IDType1"
                                        render={({ field }) => (
                                            <Select
                                            defaultValue={{
                                                value: FullData.idDetails?.name || '',
                                                label: FullData.idDetails?.IDType || '',
                                              }}
                                  
                                                theme={selectThemeColors}
                                                className='react-select'
                                                classNamePrefix='select'
                                                name='IDType1'
                                                options={IDTypes}
                                                isClearable
                                                onChange={handleDropdownChange}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>}
                            {selectedValue === 'drivingLicense' && (
                                <div>
                                    <Col md='4' sm='12'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='expiryDate1'>
                                                Expiry Date
                                            </Label>
                                            <Controller
                                                defaultValue={FullData.idDetails.expiryDate}
                                                control={control}
                                                id='expiryDate1'
                                                name='expiryDate1'
                                                render={({ field }) => (
                                                    <Flatpickr
                                                        {...field}
                                                        options={{ allowInput: true }} placeholder='YYYY-MM-DD '
                                                        className={classnames('form-control', {
                                                            'is-invalid': data !== null && data.expiryDate1 === null
                                                        })}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                </div>
                            )}

                            {/* {selectedValue === 'passport' && (
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
                            )} */}
                            <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="idNumber1">
                                        ID Number
                                    </Label>
                                    <Controller
                                        defaultValue={FullData.idDetails.idNumber}
                                        control={control}
                                        id='idNumber1'
                                        name='idNumber1'
                                        render={({ field }) => <Input placeholder='idNumber'
                                            pattern='[0-9_]{1,15}'
                                            title="Adhar Number can contain numbers . It cannnot contain alphabets and special characters." required
                                            {...field}
                                        // value={data1.idDetails.idNumber} 
                                        />}
                                    />
                                </div>
                            </Col>
                            {FullData.length !== 0 && <Col md='3' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='issueDate1'>
                                        Issue Date
                                    </Label>
                                    <Controller
                                        control={control}
                                        id='issueDate1'
                                        name='issueDate1'
                                        render={({ field }) => (
                                            <Flatpickr
                                                // {...field}
                                        defaultValue={FullData.idDetails.issueDate}

                                                options={{ allowInput: true }} placeholder='YYYY-MM-DD '
                                                className={classnames('form-control', {
                                                    'is-invalid': data !== null && data.issueDate1 === null
                                                })}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
            }
                            <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="issuePlace1">
                                        Issue Place
                                    </Label>
                                    <Controller
                                        defaultValue={FullData.idDetails.issuePlace}
                                        control={control}
                                        id='issuePlace1'
                                        name='issuePlace1'
                                        render={({ field }) => <Input placeholder='issuePlace1'
                                            // pattern='[0-9_]{1,15}'
                                            // title="Adhar Number can contain numbers . It cannnot contain alphabets and special characters." required
                                            invalid={errors.issuePlace1 && true} {...field} />}
                                    />
                                </div>
                            </Col>

                            <Col md='4' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='name1'>
                                        Name On Card
                                    </Label>
                                    <Controller
                                        defaultValue={FullData.idDetails.name}
                                        control={control}
                                        id='name1'
                                        name='name1'
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
                                <Label className='form-label' for='idFile1'>
                                    Upload idFile
                                </Label>
                                <InputGroup className="input-group-merge">
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='idFile1'
                                        name='idFile1'
                                        placeholder='Add idFile'
                                        render={({ field }) => <Input type='file' className={classnames({
                                            "is-invalid": data !== null && (data.idFile1 === null || !data.idFile1.length)
                                        })} {...field} />}
                                    />
                                </InputGroup>
                            </div>
                        </Col>
                        <div className='d-flex'>
                            <Button className='me-1' color='primary' type='submit'>
                                Submit
                            </Button>
                            <Button outline color='secondary' type='reset' onClick={handleReset}>
                                Reset
                            </Button>
                        </div>
                        {/* <br></br>
                        <br></br> */}

                        {/* <div className='d-flex justify-content-between'>
                            <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
                                <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                                <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                            </Button>
                            <Button color='primary' className='btn-next' onClick={() => stepper.next()}>
                                <span className='align-middle d-sm-inline-block d-none'>Next</span>
                                <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                            </Button>
                        </div> */}
                        {checkIn &&
                            <div>{data1.length != 0 && <CheckIn data1={data1} />}</div>}

                    </Form>
                </CardBody>
            </Card>}
            <Button className="me-1" color='primary' onClick={() => setCheckIn(!checkIn)}>Continue Check-In</Button>
            <div>
                {/* <Modal isOpen={checkIn} toggle={() => setCheckIn(!checkIn)} className='demo-inline-spacing'>
        <ModalHeader className='bg-transparent' toggle={() => setCheckIn(!checkIn)}></ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'> */}
                <div>
                    {/* {filldata.length!=0 && <CheckIn data1={filldata}  />} */}
                    {/* {data1.length!=0 && <CheckIn data1={data1}  />} */}
                </div>
                {/* </ModalBody>
      </Modal> */}
            </div>

        </div>
    )
}

export default ForCheckInIdDetails;