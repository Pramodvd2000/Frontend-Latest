import React, { useState, useEffect } from 'react'

// import Profile from './profile'
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Moment from 'moment'

import API_URL from '../../../../config'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { selectThemeColors } from '@utils'

const MySwal = withReactContent(Swal)

// ** Reactstrap Imports
import { Button, Card, CardBody, Row, Col, Form, Label } from 'reactstrap'

import { useNavigate } from "react-router-dom"

// import 'ag-grid-enterprise'
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import Select from 'react-select'


// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'


const defaultValues = {
    checkIn: '',
    checkOut: '',
    adults: null,
    children: null,
    quantity: null
}


const colourOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
]


const children = [
    { value: '0', label: '0' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
]



const DatesModification = (reservationData) => {
    const { setError, formState: { errors } } = useForm();
    const navigate = useNavigate()
    const { handleSubmit, control, watch } = useForm({ defaultValues })
    const [arrivalDate, setArrivalDate] = useState();
    const [departureDate, setDepartureDate] = useState()
    const [apiData, setApiData] = useState()
    const [open, setOpen] = useState(false);
    const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
    const [data, setData] = useState(null)


    // get sharingID count
    useEffect(() => {

        const hotelID = JSON.stringify({
            hotelID: 1
        })

        fetchx(API_URL + "/getBusinessDate", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: hotelID
        }).then((res) => res.json())
            .then(postres => {
                const today = new Date(postres['data'][0]['businessDate']);
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                setDepartureDate(tomorrow)
                setArrivalDate((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
            })
    }, []);

    // const checkIn = watch('coming');


    // // Arrival date condition
    // let options = {
    //     minDate: arrivalDate
    // }


    // // Departure date condition
    // const optionsToDate = {
    //     minDate: (checkIn === null ? arrivalDate : (Moment(String(new Date(checkIn))).format('YYYY-MM-DD'))) // Set the minimum date as fromDate or today if fromDate is not selected
    // };




    const checkIn = watch('coming');
    const checkIn1 = watch('incomeDate')
    const shStartDate = watch('shStartDate');
    const shEndDate = watch('shEndDate');

    console.log(Moment(String(new Date(shStartDate))).format('YYYY-MM-DD'),Moment(String(new Date(shEndDate))).format('YYYY-MM-DD'),Moment(String(new Date(checkIn))).format('YYYY-MM-DD'))
    //Flatpickr condition for Arrival date
    const options = {
        minDate: arrivalDate
    }

    const options1 = {
        minDate: shStartDate
            ? Moment(String(new Date(shStartDate))).format('YYYY-MM-DD') // Set minimum date to Shoulder Start Date
            : arrivalDate, // Fallback to Arrival Date
        maxDate: shEndDate
            ? Moment(String(new Date(shEndDate))).format('YYYY-MM-DD') // Set maximum date to Shoulder End Date
            : departureDate, // Fallback to Departure Date
    };

    // Flatpickr condition for Departure Date (departure)
    const optionsToDate = {
        minDate: checkIn
            ? Moment(String(new Date(checkIn))).format('YYYY-MM-DD') // Use selected Arrival Date
            : (shStartDate
                ? Moment(String(new Date(shStartDate))).format('YYYY-MM-DD') // Fallback to Shoulder Start Date
                : arrivalDate), // Fallback to Arrival Date
        maxDate: shEndDate
            ? Moment(String(new Date(shEndDate))).format('YYYY-MM-DD') // Set maximum date to Shoulder End Date
            : departureDate, // Fallback to Departure Date
    };


    // shoiulder end date
    const optionsShoulderStart = {
        minDate:  (Moment(String(new Date(shStartDate))).format('YYYY-MM-DD'))
    }


    //Flatpickr condition for shoulder end date
    const optionsShoulderEnd = {
        minDate: (shStartDate === null ? arrivalDate : (Moment(String(new Date(shStartDate))).format('YYYY-MM-DD'))) // Set the minimum date as fromDate or today if fromDate is not selected
    };

    
    const optionForYesterDay = {
        // minDate: ((Moment(String(new Date(checkIn))).format('YYYY-MM-DD')) === undefined || (Moment(String(new Date(checkIn))).format('YYYY-MM-DD')) === arrivalDate)
        //     ? arrivalDate
        //     : Moment(String(new Date(checkIn)))
        //         .subtract(1, 'days')
        //         .format('YYYY-MM-DD')
        minDate: arrivalDate

        ,
        maxDate: ((Moment(String(new Date(checkIn))).format('YYYY-MM-DD')) === undefined || (Moment(String(new Date(checkIn))).format('YYYY-MM-DD')) === arrivalDate)
            ? arrivalDate
            : Moment(String(new Date(checkIn)))
                .subtract(1, 'days')
                .format('YYYY-MM-DD')
    };



    //Flatpickr condition for departure date
    const optionsToDate1 = {
        minDate: (checkIn1 === null ? arrivalDate : (Moment(String(new Date(checkIn1))).format('YYYY-MM-DD'))) // Set the minimum date as fromDate or today if fromDate is not selected
    };

    // error handling function
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


    // on submit 
    const onSubmit = data => {
        setData(data)

        let adultCount = data.adultCount.value;
        let childCount = data.childCount.value;
        let count = 3;
        if (data.adultCount.label === '3') {
            count = 3;
        }
        if (data.adultCount.label === '2') {
            count = 4
        }
        let totalCount = Number(adultCount) + Number(childCount);
        if (totalCount > count) {
            let message = '<b>You have Exceeded PAX Count. \n Please Select adults or children properly. </b> \n (You can select maximum 2 adults and 2 children or maximum 3 adults)'
            return handleError(message)
        }

        const CheckAvailablity = JSON.stringify({
            shoulderStartDate: (Moment(String(new Date(data.shStartDate))).format('YYYY-MM-DD')),
            shoulderEndDate: (Moment(String(new Date(data.shEndDate))).format('YYYY-MM-DD')),
            adults: data.adultCount.value,
            children: data.childCount.value,
            cutOfDate: (Moment(String(new Date(data.cutOfDate))).format('YYYY-MM-DD')),
            newCheckInDate: (Moment(String(new Date(data.coming))).format('YYYY-MM-DD')),
            newCheckOutDate: (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')),
            reservationID: reservationData['data']['id']
        })
        //send data and take updated dates
        fetchx(API_URL + '/dateModificationCheckForGroup', {
            method: 'POST',
            body: CheckAvailablity,
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then((res) => res.json()).then(postres => {
            if (typeof postres['data'] === 'string') {
                handleError(postres['data'])
            }
            else {
                setApiData(postres['data'])
                MySwal.fire({
                    title: "Confirmation Required",
                    text: ` <b> Number Of Nights = </b> ${postres['data']['Nights']} <br></br> <b> Total Cost Of Stay = </b> ${postres['data'].totalCostOfStay}. <br /> <b>Please note that these date changes will be effected to entire group booking for all the reservations. </b> <br /> Do you want to continue?`, // Display message from response
                    icon: "question",
                    showCancelButton: true,
                    html: ` <b> Number Of Nights = </b> ${postres['data']['Nights']} <br /> <b> Total Cost Of Stay = </b> ${postres['data'].totalCostOfStay}. <br /> <b>Please note that these date changes will be effected to entire group booking for all the reservations. </b> <br /> Do you want to continue?`, // Replace newline characters
                    confirmButtonText: 'Yes, Continue',
                    cancelButtonText: 'No',
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: 'btn btn-primary ms-1',
                        cancelButton: 'btn btn-outline-danger ms-1'
                    },
                    reverseButtons: true // Move "Yes" button to the right side
                }).then((result) => {
                    if (result.isConfirmed) {

                        setOpen(true);
                        // Start a timer to check if the response takes more than 5 seconds
                        const timeout = setTimeout(() => {
                            setShowSecondaryMessage(true);
                        }, 5000);

                        fetchx(API_URL + '/updateDatesForGroup', {
                            method: 'POST',
                            body: CheckAvailablity,
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8'
                            }
                        }).then((res) => res.json())
                        .then(postres => {
                            console.log(postres)
                            if(postres.statusCode === 200){
                            handleSuccess("Successfully modified the dates.")
                            setOpen(false);
                        }
                        else{
                            handleError(postres.data)
                            setOpen(false);

                        }
                        }).catch((err) => {
                            console.log(err.message)
                        })
                    }
                })
            }
        }).catch((err) => {
            console.log(err.message)
        })
    }


    // Success card
    const handleSuccess = async (message) => {
        await MySwal.fire({
            title: 'Stay modification',
            text: message,
            icon: 'success',
        });
        setTimeout(() => { navigate('/dashboard/groupreservation/allgroupreservations') }, 500);
    }

    
    return (
        <div>
            <Card>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {/* <Row>
                            
                            {
                                reservationData  &&
                                <Col md='3' sm='12'>
                                    <div className='mb-1'>
                                        <Label className='form-label' for='shStartDate'>
                                            Shoulder Start Date <spam style={{ color: 'red' }}>*</spam>
                                        </Label>
                                        <Controller
                                            control={control}
                                            id='shStartDate'
                                            name='shStartDate'
                                            // defaultValue={arrivalDate}
                                            defaultValue={reservationData.data.shoulderStartDate}

                                            render={({ field }) => (
                                                <Flatpickr
                                                    required
                                                    {...field}
                                                    options={optionsShoulderStart}
                                                    onChange={(date) => field.onChange(date)} 
                                                    placeholder='YYYY-MM-DD '
                                                    className={classnames('form-control')}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                            }

                            {
                                reservationData  &&
                                <Col md='3' sm='12'>
                                    <div className='mb-1'>
                                        <Label className='form-label' for='coming'>
                                            Arrival Date <spam style={{ color: 'red' }}>*</spam>
                                        </Label>
                                        <Controller
                                            control={control}
                                            id='coming'
                                            name='coming'
                                            defaultValue={reservationData.data.arrivalDate}
                                            render={({ field }) => (
                                                <Flatpickr
                                                    required
                                                    {...field}
                                                    options={options1}
                                                    placeholder='YYYY-MM-DD '
                                                    className={classnames('form-control')}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                            }

                            {
                                reservationData &&
                                <Col md='3' sm='12'>
                                    <div className='mb-1'>
                                        <Label className='form-label' for='departure'>
                                            Departure Date <spam style={{ color: 'red' }}>*</spam>
                                        </Label>
                                        <Controller
                                            control={control}
                                            id='departure'
                                            name='departure'
                                            defaultValue={reservationData.data.departureDate}
                                            render={({ field }) => (
                                                <Flatpickr
                                                    required
                                                    {...field}
                                                    options={optionsToDate}
                                                    placeholder='YYYY-MM-DD '
                                                    className={classnames('form-control', {
                                                        'is-invalid': data !== null && data.departure === null
                                                    })}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                            }

                            {
                                reservationData &&
                                <Col md='3' sm='12'>
                                    <div className='mb-1'>
                                        <Label className='form-label' for='shEndDate'>
                                            Shoulder End Date <spam style={{ color: 'red' }}>*</spam>
                                        </Label>
                                        <Controller
                                            control={control}
                                            id='shEndDate'
                                            name='shEndDate'
                                            defaultValue={reservationData.data.shoulderEndDate}
                                            render={({ field }) => (
                                                <Flatpickr
                                                    required
                                                    {...field}
                                                    options={optionsShoulderEnd}
                                                    placeholder='YYYY-MM-DD '
                                                    className={classnames('form-control', {
                                                        'is-invalid': data !== null && data.shEndDate === null
                                                    })}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                            }

                            {
                                arrivalDate !== undefined &&

                                <Col md='3' sm='12'>
                                    <div className='mb-1'>
                                        <Label className='form-label' for='cutOfDate'>
                                            Cut Off Date <spam style={{ color: 'red' }}>*</spam>
                                        </Label>
                                        <Controller
                                            control={control}
                                            id='cutOfDate'
                                            defaultValue={arrivalDate}
                                            name='cutOfDate'
                                            render={({ field }) => (
                                                <Flatpickr
                                                    {...field}
                                                    options={optionForYesterDay}
                                                    placeholder='YYYY-MM-DD '
                                                    className={classnames('form-control', {
                                                        'is-invalid': data !== null && data.cutOfDate === null
                                                    })}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                            }
                            <Col md='3' sm='12'>
                                <div>
                                    <Label className='form-label' for='adultCount'>
                                        Adults <spam style={{ color: 'red' }}>*</spam>
                                    </Label>
                                    <Controller
                                        id='adultCount'
                                        control={control}
                                        name='adultCount'
                                        defaultValue={colourOptions[0]}
                                        render={({ field }) => (
                                            <Select
                                                isClearable
                                                required
                                                options={colourOptions}
                                                classNamePrefix='select'
                                                theme={selectThemeColors}
                                                className={classnames('react-select', { 'is-invalid': data !== null && data.adultCount === null })}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>


                            <Col md='3' sm='3'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='childCount'>
                                        Children <spam style={{ color: 'red' }}>*</spam>
                                    </Label>
                                    <Controller
                                        id='childCount'
                                        control={control}
                                        name='childCount'
                                        defaultValue={children[0]}
                                        render={({ field }) => (
                                            <Select
                                                required
                                                disabled={true}
                                                isClearable
                                                options={children}
                                                classNamePrefix='select'
                                                theme={selectThemeColors}
                                                className={classnames('react-select', { 'is-invalid': data !== null && data.childCount === null })}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>

                        </Row> */}


                        <Row>
                            <Col md="6" sm="12">
                                <div className="mb-1">
                                    {console.log(reservationData)}
                                    <Label className="form-label" for="shStartDate">
                                        Shoulder Start Date <span style={{ color: "red" }}>*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        id="shStartDate"
                                        name="shStartDate"
                                        defaultValue={reservationData?.data?.shoulderStartDate}
                                        render={({ field }) => (
                                            <Flatpickr
                                                required
                                                {...field}
                                                options={optionsShoulderStart}
                                                onChange={(date) => field.onChange(date)}
                                                placeholder="YYYY-MM-DD"
                                                className={classnames("form-control")}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                            <Col md="6" sm="12">
                                <div className="mb-1">
                                    <Label className="form-label" for="shEndDate">
                                        Shoulder End Date <span style={{ color: "red" }}>*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        id="shEndDate"
                                        name="shEndDate"
                                        defaultValue={reservationData?.data?.shoulderEndDate}
                                        render={({ field }) => (
                                            <Flatpickr
                                                required
                                                {...field}
                                                options={optionsShoulderEnd}
                                                placeholder="YYYY-MM-DD"
                                                className={classnames("form-control", {
                                                    "is-invalid": data !== null && data.shEndDate === null
                                                })}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md="6" sm="12">
                                <div className="mb-1">
                                    <Label className="form-label" for="coming">
                                        Arrival Date <span style={{ color: "red" }}>*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        id="coming"
                                        name="coming"
                                        defaultValue={reservationData?.data?.arrivalDate}
                                        render={({ field }) => (
                                            <Flatpickr
                                                required
                                                {...field}
                                                options={options1}
                                                placeholder="YYYY-MM-DD"
                                                className={classnames("form-control")}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                            <Col md="6" sm="12">
                                <div className="mb-1">
                                    <Label className="form-label" for="departure">
                                        Departure Date <span style={{ color: "red" }}>*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        id="departure"
                                        name="departure"
                                        defaultValue={reservationData?.data?.departureDate}
                                        render={({ field }) => (
                                            <Flatpickr
                                                required
                                                {...field}
                                                options={optionsToDate}
                                                placeholder="YYYY-MM-DD"
                                                className={classnames("form-control", {
                                                    "is-invalid": data !== null && data.departure === null
                                                })}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                        </Row>



                        <Row>
                            <Col md="6" sm="12">
                                <div>
                                    <Label className="form-label" for="adultCount">
                                        Adults <span style={{ color: "red" }}>*</span>
                                    </Label>
                                    <Controller
                                        id="adultCount"
                                        control={control}
                                        name="adultCount"
                                        defaultValue={colourOptions[0]}
                                        render={({ field }) => (
                                            <Select
                                                isClearable
                                                required
                                                options={colourOptions}
                                                classNamePrefix="select"
                                                theme={selectThemeColors}
                                                className={classnames("react-select", {
                                                    "is-invalid": data !== null && data.adultCount === null
                                                })}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                            <Col md="6" sm="12">
                                <div className="mb-1">
                                    <Label className="form-label" for="childCount">
                                        Children <span style={{ color: "red" }}>*</span>
                                    </Label>
                                    <Controller
                                        id="childCount"
                                        control={control}
                                        name="childCount"
                                        defaultValue={children[0]}
                                        render={({ field }) => (
                                            <Select
                                                required
                                                disabled={true}
                                                isClearable
                                                options={children}
                                                classNamePrefix="select"
                                                theme={selectThemeColors}
                                                className={classnames("react-select", {
                                                    "is-invalid": data !== null && data.childCount === null
                                                })}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            {
                                arrivalDate !== undefined &&
                                <Col md="6" sm="12">
                                    <div className="mb-1">
                                        <Label className="form-label" for="cutOfDate">
                                            Cut Off Date <span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Controller
                                            control={control}
                                            id="cutOfDate"
                                            name="cutOfDate"
                                            defaultValue={arrivalDate}
                                            render={({ field }) => (
                                                <Flatpickr
                                                    {...field}
                                                    options={optionForYesterDay}
                                                    placeholder="YYYY-MM-DD"
                                                    className={classnames("form-control", {
                                                        "is-invalid": data !== null && data.cutOfDate === null
                                                    })}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                            }
                        </Row>
                        <div align='end'>
                            <Button color='primary' className='me-1' type='submit'>
                                Update
                            </Button>
                        </div>

                        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
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
                </CardBody>
            </Card>
        </div>
    )
}


export default DatesModification
