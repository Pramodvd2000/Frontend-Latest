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

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Input, Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText } from 'reactstrap'
import API_URL from "../../../../config";
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import { useRef, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'react-feather'
import { useNavigate } from "react-router-dom";

// const id = '1';

// import App from './datagrid'

const defaultValues = {
    membershipType: null,
    membershipNo: '',
    name: '',
    membershipSince: '',
    level: null,
    expiryDate: null
}


const membershipType = [
    { value: "1", label: "OterraBlack" },
    { value: "2", label: "OterraGold" },
    { value: "3", label: "OterraSilver" },
    { value: "4", label: "OterraPlatinum" },
];

const levels = [
    { value: "Black", label: "Black" },
    { value: "Gold", label: "Gold" },
    { value: "Silver", label: "Silver" },
    { value: "Platinum", label: "Platinum" },
];



const Floor = ({ stepper, type, data1 }) => {
    console.log(data1.membershipDetails)
    let navigate = useNavigate();

    // Ag Grid
    const [rowData, setRowData] = useState();
    const [membershipType, setMembershipType] = useState()
    const [levels, setLevels] = useState()
    const gridRef = useRef();
    const [selectedValue, setSelectedValue] = useState()
    const [selectedValueType, setSelectedValueType] = useState()
    const [buttonClicked, setButtonClicked] = useState(false)
    const today = Moment().format('YYYY-MM-DD');

    // const [columnDefs, setColumnDefs] = useState([
    //     { headerName: 'Membership Type', field: 'membershipType', suppressSizeToFit: true, maxWidth: 160 },
    //     { headerName: 'Membership No', field: 'membershipNo', suppressSizeToFit: true },
    //     { headerName: 'Name On Card', field: 'nameOnCard', suppressSizeToFit: true, maxWidth: 160 },
    //     { headerName: 'Membership Since', field: 'membershipSince', suppressSizeToFit: true, maxWidth: 160 },
    //     { headerName: 'Membership level', field: 'level', suppressSizeToFit: true },
    //     { headerName: 'Expiry Date', field: 'expiryDate', suppressSizeToFit: true, maxWidth: 160 },
    // ]);

    // const defaultColDef = useMemo(() => (
    //     {
    //         sortable: true,
    //         filter: true,
    //         filterParams: {
    //             buttons: ['apply', 'reset']
    //         }
    //     }
    // ));


    // Success modal
    const handleSuccess = (message) => {
        return MySwal.fire({
            title: 'Guest Update !!',
            text: message,
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        })
    }


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



    useEffect(() => {



        fetchx(API_URL + "/getMembershipLevelDropDown")
            .then((result) => result.json())
            .then((resp) => {
                console.log(resp['data'])
                if (resp.statusCode = 200) {
                    const formattedLevels = resp.data.map(item => ({
                        value: item.id,  // Assuming 'id' is the unique identifier
                        label: item.membershipLevel // Assuming 'name' is the display text
                    }));
                    setLevels(formattedLevels);
                }            // console.log(room)
            })
        fetchx(API_URL + "/getMembershipTypeDropDown")
            .then((result) => result.json())
            .then((resp) => {
                if (resp.statusCode = 200) {
                    const formattedMember = resp.data.map(item => ({
                        value: item.id,  // Assuming 'id' is the unique identifier
                        label: item.membershipType // Assuming 'name' is the display text
                    }));
                    setMembershipType(formattedMember);
                }
                // console.log(resp['data'])
                // console.log(floor)
            })

    }, []);

    const cellClickedListener = useCallback(event => {
        console.log('cellClicked', event);
    }, []);



    const handleChange = (selectedOption) => {
        setSelectedValueType(selectedOption.value);

    };


    const handleChange1 = (selectedOption) => {
        setSelectedValue(selectedOption.value);

    };

    // Option for arrival date
    const options = { maxDate: today };


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
        if (localStorage.getItem('guestID') != null) {
            setButtonClicked(true)
            // Submit form data
            console.log('Submitting form data...',);
            setData(data)
            console.log(data)

            console.log(data.membershipSince)
            console.log(data.expiryDate)



            const guestID = localStorage.getItem('guestID');
            const membershipType = selectedValueType || '';
            const membershipNo = data.membershipNo || '';
            const nameOnCard = data.name || '';
            const membershipSince = (data.membershipSince === '' ? null : Moment(String(new Date(data.membershipSince[0]))).format('YYYY-MM-DD'));
            const membershipLevel = selectedValue || '';

            let missingFields = [];

            if (!guestID) missingFields.push("guest Not Created!!");
            if (!membershipType) missingFields.push("Membership Type");
            if (!membershipNo) missingFields.push("Membership No");
            if (!nameOnCard) missingFields.push("Name On Card");
            if (!membershipSince) missingFields.push("Membership Since");
            if (!membershipLevel) missingFields.push("Membership Level");

            if (missingFields.length > 0) {
                if (!guestID) {
                    handleError(`${missingFields.join(', ')}`);
                    setButtonClicked(false)

                    return;
                }
                handleError(`❌ Missing required fields: ${missingFields.join(', ')}`);
                setButtonClicked(false)

                return;
            }



            let createmarketGroup = JSON.stringify({
                // // "hotelID": data.hotelID,
                // "guestID": localStorage.getItem('guestID'),
                // "membershipType": data.membershipType === null ? null : data.membershipType.value,
                // "membershipNo": data.membershipNo,
                // "nameOnCard": data.name,
                // "membershipSince": (data.membershipSince === '' ? null : Moment(String(new Date(data.membershipSince[0]))).format('YYYY-MM-DD')),
                // "Level": data.level === null ? null : data.level.value,
                // "expiryDate": (data.expiryDate === '' ? null : Moment(String(new Date(data.expiryDate[0]))).format('YYYY-MM-DD')),


                "hotelID": data.hotelID,
                "guestID": localStorage.getItem('guestID'),
                "membershipType": selectedValueType || '',
                "membershipNo": data.membershipNo || '',
                "nameOnCard": data.name || '',
                "membershipSince": (data.membershipSince === '' ? null : Moment(String(new Date(data.membershipSince[0]))).format('YYYY-MM-DD')),
                "membershipLevel": selectedValue || '',
            })
            console.log(createmarketGroup)
            localStorage.removeItem('guestID')

            console.log("hi")
            let res = fetchx(API_URL + "/addmembershipdetails", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: createmarketGroup
            }).then((res) => {
                console.log(res);
                if (res['status'] == 200) {
                    fetchx(API_URL + '/getMembershipDetails?hotelID=1&guestId=1')
                        .then(result => result.json())
                        .then(rowData => {
                            setRowData(rowData['data'])
                            console.log(rowData['data'])
                            navigate("");
                            setButtonClicked(false)


                        })
                }

            });
        }
        else {
            setButtonClicked(false)
            handleError(`Guest Not Created!!`);

        }

    }

    const handleReset = () => {
        reset({
            membershipType: null,
            membershipNo: '',
            name: '',
            membershipSince: '',
            level: null,
            expiryDate: null
        })
    }

    return (
        <div>
            {/* <Card>              
                <CardBody> */}
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>

                    {membershipType && <Col md='4' sm='12' className='mb-1'>
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
                                        options={membershipType}
                                        classNamePrefix="select"
                                        theme={selectThemeColors}
                                        className={classnames("react-select", {
                                        //     "is-invalid": data !== null && data.membershipType === null,
                                        })}
                                        {...field}
                                        onChange={handleChange}

                                    // value={data3.data2.membershipType}
                                    // value={membershipType.find(
                                    //     (type) => type.value === (guestMembershipData ? guestMembershipData[0].membershipType : "")
                                    // )}
                                    />
                                )}
                            />
                        </div>
                    </Col>}

                    <Col md='4' sm='12'>
                        <div className='mb-1'>
                            <Label className='form-label' for='membershipNo'>
                                Membership No
                            </Label>
                            <Controller
                                defaultValue=''
                                control={control}
                                id='membershipNo'
                                name='membershipNo'
                                render={({ field }) => <Input placeholder='Membership No'
                                    invalid={errors.membershipNo && true} {...field}
                                // value={data1.membershipDetails.membershipNo} 
                                />}
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
                                render={({ field }) => <Input placeholder='Name' invalid={errors.name && true} {...field}
                                //  value={data1.membershipDetails.name} 
                                />}
                            />
                        </div>
                    </Col>

                    <Col md='4' sm='12'>
                        <div className='mb-1'>
                            <Label className='form-label' for='membershipSince'>
                                Membership Since
                            </Label>
                            <Controller
                                control={control}
                                id='membershipSince'
                                name='membershipSince'
                                render={({ field }) => (
                                    <Flatpickr
                                        {...field}
                                        // value={data1.membershipDetails.membershipSince} 

                                        options={options} placeholder='YYYY-MM-DD '
                                        className={classnames('form-control', {
                                                // 'is-invalid': data !== null && data.membershipSince === null
                                        })}
                                    />
                                )}
                            />
                        </div>
                    </Col>


                    {levels && <Col md='4' sm='12' className='mb-1'>
                        <div className="mb-1">
                            <Label className="form-label" for="level1">
                                Level
                            </Label>
                            <Controller
                                id="level1"
                                control={control}
                                name="level1"
                                render={({ field }) => (
                                    <Select
                                        // required
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
                    </Col>}

                    {/* <Col md='4' sm='12'>
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
                                        // value={data1.membershipDetails.expiryDate} 

                                        options={{ allowInput: true }} placeholder='YYYY-MM-DD '
                                        className={classnames('form-control', {
                                            //     'is-invalid': data !== null && data.expiryDate === null
                                        })}
                                    />
                                )}
                            />
                        </div>
                    </Col> */}
                </Row>
                <div className='d-flex'>
                    <Button className='me-1' color='primary' type='submit' disabled={buttonClicked}>
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
            {/* </CardBody>
            </Card> */}
            {/* <div className="ag-theme-alpine" style={{ height: 520 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData} columnDefs={columnDefs}
                    animateRows={true} rowSelection='multiple'
                    onCellClicked={cellClickedListener}
                    // paginationAutoPageSize = 'true'
                    paginationPageSize='10'
                    pagination='true'
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"

                />
            </div> */}
            {/* <App/> */}
        </div>
    )
}

export default Floor;
