import React, { useState } from 'react'

// import Profile from './profile'
import { useForm, Controller } from 'react-hook-form'
import classnames from 'classnames'

import API_URL from '../../../../config'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

// ** Reactstrap Imports
import { Button, Card, CardBody, Row, Col, Form, Label, Input } from 'reactstrap'

import { useNavigate } from "react-router-dom"
import Select from 'react-select'
import { selectThemeColors } from '@utils'


let paymentName = [
    fetchx(API_URL + '/getPayment?hotelID=1')
        .then(result => result.json())
        .then(resp => {
            paymentName = resp['data']
        })
]


const AdvancePost = (reservationData) => {
    const { formState: { errors } } = useForm();
    const navigate = useNavigate()
    const { handleSubmit, control, watch } = useForm({ })

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
        const CheckAvailablity = JSON.stringify({
            advanceAmount: data.advanceAmount,
            advanceType:data.paymentType.value,
            groupReservationID: reservationData['data']['id']
        })
        fetchx(API_URL + '/postAdvanceForGroupReservation', {
            method: 'POST',
            body: CheckAvailablity,
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then((res) => res.json()).then(postres => {
            if(postres.statusCode == 200){
                handleSuccess()
            }
            else{
                handleError(postres.data)
            }
        }).catch((err) => {
            console.log(err.message)
        })
    }


    // Success card
    const handleSuccess = async (message) => {
        await MySwal.fire({
            title: 'Post Advance',
            text: "Advance posted successfully!",
            icon: 'success',
        });
        setTimeout(() => { navigate('/dashboard/groupreservation/allgroupreservations') }, 500);
    }


    return (
        <div>
            <Card>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>

                            {/* Payment type */}
                            <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='paymentType'>
                                        Payment Type <spam style={{ color: 'red' }}>*</spam>
                                    </Label>
                                    <Controller
                                        id='paymentType'
                                        control={control}
                                        name='paymentType'
                                        render={({ field }) => (
                                            <Select
                                                required
                                                isClearable
                                                options={paymentName}
                                                classNamePrefix='select'
                                                theme={selectThemeColors}
                                                className={classnames('react-select',)}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>

                            {/* Advacnce Amount  */}
                            <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='advanceAmount'>
                                       Advance Amount <spam style={{ color: 'red' }}>*</spam>
                                    </Label>
                                    <Controller
                                        control={control}
                                        id='advanceAmount'
                                        name='advanceAmount'
                                        render={({ field }) =>
                                            <Input required type='text' placeholder='Enter advance amount' {...field} />}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <div align='end'>
                            <Button color='primary' className='me-1' type='submit'>
                                Update
                            </Button>
                        </div>

                    </Form>
                </CardBody>
            </Card>
        </div>
    )
}


export default AdvancePost