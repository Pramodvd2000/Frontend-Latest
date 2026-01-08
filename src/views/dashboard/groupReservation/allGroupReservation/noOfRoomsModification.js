import { Button, Form, Label, Input, Card, CardBody, Row, Col} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import API_URL from '../../../../config';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import { useNavigate } from "react-router-dom"

const ModifyNumberOfRooms = (data1) => {
    const { reset, handleSubmit, control, formState: { errors } } = useForm({})
    const navigate = useNavigate()

    const onSubmit = data => {
        const updateRooms = JSON.stringify({
            numberOfRooms: data.numberOfRooms,
            reservationID: data1.data.id
        })
        MySwal.fire({
            title: "Confirmation Required",
            text: `By doing this, number of rooms will be changed to ${data.numberOfRooms}`,
            icon: "question",
            buttonsStyling: false,
            showCancelButton: true,
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "No",
            reverseButtons: true,
            allowOutsideClick: false,
            customClass: { 
            confirmButton: 'btn btn-primary ms-1',
            cancelButton: 'btn btn-outline-danger ms-1'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                fetchx(API_URL + "/updateRoomsForGroup", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: updateRooms
                }).then((data) => data.json())
                    .then((res) => {
                        if(typeof res['data'] === 'string'){
                            return handleError(res['data'])
                        }
                        handleSuccess(res['message'])
                        setTimeout(() => { navigate('/dashboard/groupreservation/allgroupreservations') }, 500)
                    }).catch((err) => {
                        console.log(err.message)
                    })
            }
        })
    }


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


    // Success card
    const handleSuccess = async (message) => {
        await MySwal.fire({
            title: 'Number Of rooms modification',
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
                        <h4>
                            Reservation Details
                        </h4>
                        <div>
                            <b>Arrival Date</b>:- {data1.data.arrivalDate}  <br></br>
                            <b>Departure Date</b>:- {data1.data.departureDate} <br></br>
                            <b>Number of rooms booked</b>:- {data1.data.totalRooms} <br></br><br></br>
                        </div>
                        <Row>
                            <Col md='8' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='numberOfRooms'>
                                        Number Of Rooms<spam style={{ color: 'red' }}>*</spam>
                                    </Label>
                                    <Controller
                                        control={control}
                                        id='numberOfRooms'
                                        name='numberOfRooms'
                                        render={({ field }) =>
                                            <Input
                                                required
                                                placeholder='enter number of rooms'
                                                invalid={errors.numberOfRooms && true}
                                                {...field}
                                            />
                                        }
                                    />
                                </div>
                            </Col>
                        </Row>
                        <br></br>

                        {/* On submit buttons */}
                        <div align='end'>
                            <Button outline className='me-1' color='secondary' type='reset'>
                                Reset
                            </Button>
                            <Button className='me-1' color='primary' type='submit'>
                                Update
                            </Button>
                        </div>
                    </Form>
                </CardBody>
            </Card>
        </div>
    )
}

export default ModifyNumberOfRooms