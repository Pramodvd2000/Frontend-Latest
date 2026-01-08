
import API_URL from '../../../../config'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

// ** Reactstrap Imports
import { useNavigate } from "react-router-dom"
import Select from 'react-select'
import { selectThemeColors } from '@utils'


// ** React Imports
import { useState, useEffect } from 'react'
import Moment from "moment";
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
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


const PaymentModification = (reservationData) => {
    const { formState: { errors } } = useForm();
    const navigate = useNavigate()
    const { handleSubmit, control, watch } = useForm({})
    const [paymentName, setPaymentName] = useState([]);
    const [paymentType, setPaymentType] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const today = Moment().format('YYYY-MM-DD');

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


    const options = {
        minDate: today
    };


    useEffect(() => {
        fetchx(API_URL + '/getPayment?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setPaymentName(resp['data']);
            });
    }, []);


    const handleOptionChange = (event) => {
        if (event) {
            console.log(event)
            setPaymentType(event.value)
            setSelectedOption(event.paymentMode);
        } else {
            setSelectedOption('');
        }
    };


    // on submit 
    const onSubmit = (data) => {

        if(paymentType === 14 || paymentType === 2){

        if (data.cardNumber.length < 15){
            handleError("Card number must be atleast 15 digit")
        }
    }
    
          const createmarketGroup = JSON.stringify({
            reservationID: reservationData.data.id,
            paymentTypeID: paymentType,
            cardNumber: (data.cardNumber || ''),
            cardHolderName: (data.cardHolderName || ''),
            expiryDate: Array.isArray(data.expiryDate) && data.expiryDate[0]
              ? Moment(String(new Date(data.expiryDate[0]))).format('YYYY-MM-DD')
              : null,
          });


        fetchx(API_URL + '/updatePaymentMethodForGroup', {
            method: 'POST',
            body: createmarketGroup,
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then((res) => res.json()).then(postres => {
            if (postres.statusCode == 200) {
                handleSuccess()
            }
            else {
                handleError(postres.data)
            }
        }).catch((err) => {
            console.log(err.message)
        })
    }


    // Success card
    const handleSuccess = async (message) => {
        await MySwal.fire({
            title: 'Payment Method',
            text: "Payment method updated successfully!!",
            icon: 'success',
        });
        setTimeout(() => { navigate('/dashboard/groupreservation/allgroupreservations') }, 500);
    }


    return (
        <div>
            <Card>
                <CardBody>
                        <Row>

                            <h5>Payment Type : {reservationData.data.paymentTypeCode}</h5>
                            {reservationData.data.cardHolderName && <h5>Card Holder Name: {reservationData.data.cardHolderName}</h5>}
                            {reservationData.data.cardNumber && <h5>Card Number: {reservationData.data.cardNumber}</h5>}
                            {reservationData.data.expiryDate && reservationData.data.expiryDate !== 'Invalid date' ? (
                            <h5>Expiry Date: {reservationData.data.expiryDate}</h5>
                            ) : null}


                            <br></br>
                            <br></br>
                            <br></br>


                            <Card>
                                <CardBody>
                                    <Form onSubmit={handleSubmit(onSubmit)}>

                                        {/* payment type selection */}
                                        <Row>
                                            <Col md='6' sm='12' className='mb-1'>
                                                <div className='mb-1'>
                                                    <Label className='form-label' for='paymentTypeID1' >
                                                        Select Payment Type
                                                    </Label>
                                                    <Controller
                                                        id='paymentTypeID1'
                                                        control={control}
                                                        name='paymentTypeID1'
                                                        render={({ field }) => (
                                                            <Select
                                                                isClearable
                                                                options={paymentName}
                                                                classNamePrefix='select'
                                                                theme={selectThemeColors}
                                                                className={classnames('react-select', {
                                                                })}
                                                                {...field}
                                                                onChange={handleOptionChange}

                                                            />
                                                        )}
                                                    />
                                                </div>
                                                {/* } */}
                                            </Col>
                                        </Row>

                                        {/* Selection Based on credit card and Amex Card */}
                                        <Row>
                                            {(selectedOption === 2) && (
                                                <div>
                                                    <Row>

                                                        <Col md='4' sm='12' className='mb-1'>
                                                            <div className='mb-1'>
                                                                <Label className='form-label' for='cardNumber'>
                                                                    Card Number
                                                                </Label>
                                                                <Controller
                                                                    control={control}
                                                                    id='cardNumber'
                                                                    name='cardNumber'
                                                                    render={({ field }) => <Input placeholder='Card Number'
                                                                        maxLength='16'
                                                                        {...field} />}
                                                                />
                                                            </div>
                                                        </Col>

                                                        <Col md='4' sm='12' className='mb-1'>
                                                            <div className='mb-1'>
                                                                <Label className='form-label' for='cardHolderName'>
                                                                    Card Holder Name
                                                                </Label>
                                                                <InputGroup className="input-group-merge">
                                                                    <Controller
                                                                        control={control}
                                                                        id='cardHolderName'
                                                                        name='cardHolderName'
                                                                        render={({ field }) => <Input placeholder='Card Holder Name'
                                                                            {...field} />}
                                                                    />
                                                                </InputGroup>
                                                            </div>
                                                        </Col>

                                                        <Col md='4' sm='12' className='mb-1'>
                                                            <div className='mb-1'>
                                                                <Label className='form-label' for='expiryDate'>
                                                                    Expiry Date
                                                                </Label>
                                                                <Controller
                                                                    // defaultValue={details.expiryDate} 
                                                                    control={control}
                                                                    id='expiryDate'
                                                                    name='expiryDate'
                                                                    render={({ field }) => (
                                                                        <Flatpickr
                                                                            {...field}
                                                                            options={options}
                                                                            placeholder='YYYY-MM-DD '
                                                                            className={classnames('form-control', {
                                                                                // 'is-invalid': data !== null && data.expiryDate === null
                                                                            })}
                                                                        />
                                                                    )}
                                                                />
                                                            </div>
                                                        </Col>

                                                    </Row>
                                                </div>)}
                                        </Row>

                                        {(selectedOption === 3) && (
                                            <Col md="4" sm="12" className="mb-1">
                                                <div className="mb-1">
                                                    <Label className="form-label" for="transactionID">
                                                        Transaction ID
                                                    </Label>
                                                    <Controller
                                                        control={control}
                                                        id="transactionID"
                                                        name="transactionID"
                                                        render={({ field }) => (
                                                            <Input
                                                                placeholder="Transaction ID" // Corrected placeholder value
                                                                invalid={errors.transactionID && true}
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </Col>
                                        )}

                                        <div align='end'>
                                            <Button color='primary' className='me-1' type='submit'>
                                                Update
                                            </Button>
                                        </div>
                                        {/* <br></br> */}
                                        {/* submit button */}
                                        {/* <div className='d-flex'>
                                            <Button className='me-1' color='primary' type='submit'>
                                                Submit
                                            </Button>
                                            <Button outline color='secondary' type='reset'>
                                                Reset
                                            </Button>
                                        </div> */}

                                    </Form>
                                </CardBody>
                            </Card>
                        </Row>

                </CardBody>
            </Card>
        </div>
    )
}


export default PaymentModification
