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
import Moment from 'moment';
import API_URL from '../../../../config'
// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Input, Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText } from 'reactstrap'

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
// const id = '1';

// import App from './datagrid'

const defaultValues = {
    membershipType: null,
    membershipNo: '',
    name: '',
    membershipSince: '',
    membershipLevel: null,
    expiryDate: null
}


const membershipType = [
    { value: "1", label: "OterraBlack" },
    { value: "2", label: "OterraGold" },
    { value: "3", label: "OterraSilver" },
    { value: "4", label: "OterraPlatinum" },
];

const levels = [
    { value: "1", label: "Black" },
    { value: "2", label: "Gold" },
    { value: "3", label: "Silver" },
    { value: "4", label: "Platinum" },
];



const Floor = ({stepper, type,data3 }) => {
    const [reload, setreload] = useState(true)
    const [load, setload] = useState(true)
  
    const handleChange = (selectedOption) => {
        setSelectedValue(selectedOption.label);
        console.log(selectedOption.label)
        console.log(localStorage.getItem('data3.data2.membershipType'))
        localStorage.removeItem('data3.data2.membershipType')
        localStorage.setItem('data3.data2.membershipType', selectedOption.label);
        localStorage.setItem('data3.data2.membershipType', selectedOption.value);
    
        console.log(localStorage.getItem('data3.data2.membershipType'))
        console.log(localStorage.getItem('data3.data2.membershipType'))
        setreload(false)
        setTimeout(()=>{setreload(true)},1)
      };
  
      const defaultReason = {
        value: data3.data2.membershipType,
        label: data3.data2.membershipType,    
      };
    
      const handleChange1 = (selectedOption) => {
        setSelectedValue(selectedOption.label);
        console.log(selectedOption.label)
        console.log(localStorage.getItem('data3.data2.membershipLevel'))
        localStorage.removeItem('data3.data2.membershipLevel')
        localStorage.setItem('data3.data2.membershipLevel', selectedOption.label);
        localStorage.setItem('data3.data2.membershipLevel', selectedOption.value);
    
        console.log(localStorage.getItem('data3.data2.membershipLevel'))
        console.log(localStorage.getItem('data3.data2.membershipLevel'))
        setreload(false)
        setTimeout(()=>{setreload(true)},1)
      };
  
      const defaultReason1 = {
        value: data3.data2.membershipLevel,
        label: data3.data2.membershipLevel,    
      };

    // console.log(data3.data2)

    // Ag Grid
    const [rowData, setRowData] = useState();

    const gridRef = useRef();

    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Membership Type', field: 'membershipType', suppressSizeToFit: true, maxWidth: 160 },
        { headerName: 'Membership No', field: 'membershipNo', suppressSizeToFit: true },
        { headerName: 'Name On Card', field: 'nameOnCard', suppressSizeToFit: true, maxWidth: 160 },
        { headerName: 'Membership Since', field: 'membershipSince', suppressSizeToFit: true, maxWidth: 160 },
        { headerName: 'Membership level', field: 'level', suppressSizeToFit: true },
        { headerName: 'Expiry Date', field: 'expiryDate', suppressSizeToFit: true, maxWidth: 160 },
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
        console.log('cellClicked', event);
    }, []);

    useEffect(() => {
        fetchx(API_URL +'/floor?hotelID=1&floor=1&blockID=1')
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

    // ** Hooks
    const { reset, handleSubmit, control } = useForm({ defaultValues })

    const onSubmit = data => {
        // if (localStorage.getItem('guestID')!=null) {
            // Submit form data
            console.log('Submitting form data...', );
        setData(data)
        console.log(data)
        // if (
        //     data.membershipNo !== null &&
        //     data.expiryDate !== null
        // ) {
            console.log(data)
            let createmarketGroup = JSON.stringify({
                // "hotelID": data.hotelID,
                "guestID":localStorage.getItem('id'),
                "membershipType":selectedValue,
                "membershipNo": data.membershipNo1,
                "nameOnCard": data.name2,
                "membershipSince": (Moment(String(new Date(data.membershipSince1[0]))).format('YYYY-MM-DD')),
                "membershipLevel": selectedValue,
                "expiryDate": (Moment(String(new Date(data.expiryDate1[0]))).format('YYYY-MM-DD')),
            })
            console.log(createmarketGroup)
                              localStorage.removeItem('guestID')

            console.log("hi")
            let res = fetchx(API_URL +`/updatemembershipdetails?id=${localStorage.getItem("id")}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: createmarketGroup
            }).then((res) => {
                localStorage.setItem("id", data1["id"]);
                console.log(res);
                if (res['status'] == 200) {
                    fetchx(API_URL +'/getGuestProfileNew?hotelID=1')
                        .then(result => result.json())
                        .then(rowData => {
                            setRowData(rowData['data'])
                            // console.log(rowData['data'])
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
                        <h4>Membership Details Added Successfull</h4>
                    </div>
                </div>
            )
        // }
    // } 
    // else {
    //     console.log('User is not logged in. Form data not submitted.');
    //     alert("Please Fill Basic Details First")
    //   }    
    }

    const handleReset = () => {
        reset({
            membershipType: null,
            membershipNo: '',
            name: '',
            membershipSince: '',
            membershipLevel: null,
            expiryDate: null
        })
    }

    return (
        <div>
            <Card>
                   <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="membershipType1">
                                        Membership Type
                                    </Label>
                                    <Controller
                                        id="membershipType1"
                                        control={control}
                                        name="membershipType1"
                                        render={({ field }) => (
                                            <Select
                                                // required
                                                isClearable
                                                defaultValue={defaultReason}
                                                options={membershipType}
                                                classNamePrefix="select"
                                                theme={selectThemeColors}
                                                className={classnames("react-select", {
                                                    "is-invalid": data !== null && data.membershipType === null,
                                                })}
                                                {...field}
                                                onChange={handleChange}
                                                value={data3.data2.membershipType} 
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                           

                            <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='membershipNo1'>
                                        Membership No
                                    </Label>
                                    <Controller
                                        defaultValue={data3.data2.membershipNo}
                                        control={control}
                                        id='membershipNo1'
                                        name='membershipNo1'
                                        render={({ field }) => <Input placeholder='Membership No' 
                                        invalid={errors.membershipNo1 && true} {...field} 
                                        />}
                                    />
                                </div>
                            </Col>

                            <Col md='4' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='name2'>
                                        Name On Card
                                    </Label>
                                    <Controller
                                        defaultValue={data3.data2.nameOnCard} 
                                        control={control}
                                        id='name2'
                                        name='name2'
                                        render={({ field })=> <Input placeholder='Name' invalid={errors.name2 && true} {...field} 
                                         />}
                                    />
                                </div>
                            </Col>

                            <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='membershipSince1'>
                                        Membership Since
                                    </Label>
                                    <Controller
                                      defaultValue={data3.data2.membershipSince} 
                                        control={control}
                                        id='membershipSince1'
                                        name='membershipSince1'
                                        render={({ field }) => (
                                            <Flatpickr
                                                {...field}
                                                options={{ allowInput: true }} placeholder='YYYY-MM-DD '
                                                className={classnames('form-control', {
                                                    'is-invalid': data !== null && data.membershipSince1 === null
                                                })}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>


                            <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="level1">
                                        Level
                                    </Label>
                                    <Controller
                                    defaultValue={levels[1]} 
                                        id="level1"
                                        control={control}
                                        name="level1"
                                        render={({ field }) => (
                                            <Select
                                                // required
                                                defaultValue={defaultReason1}
                                                isClearable
                                                options={levels}
                                                classNamePrefix="select"
                                                theme={selectThemeColors}
                                                className={classnames("react-select", {
                                                    "is-invalid": data !== null && data.level1 === null,
                                                })}
                                                {...field}
                                                onChange={handleChange1}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>

                            <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='expiryDate1'>
                                        Expiry Date
                                    </Label>
                                    <Controller
                                      defaultValue={data3.data2.expiryDate} 
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
                        </Row>
                        <div className='d-flex'>
                            <Button className='me-1' color='primary' type='submit'>
                                Submit
                            </Button>
                            <Button outline color='secondary' type='reset' onClick={handleReset}>
                                Reset
                            </Button>
                        </div>

                        <br></br>
                        <br></br>

                        <div className='d-flex justify-content-between'>
                            <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
                                <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                                <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                            </Button>
                            
                        </div>

                    </Form>
                </CardBody>
            </Card>
         
        </div>
    )
}

export default Floor;
