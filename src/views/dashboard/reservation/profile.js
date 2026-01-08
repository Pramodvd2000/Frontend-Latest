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

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Alert, Input, Row, Col, Card, Form, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

import GuestProfile from "./guestProfile"
// import Datagridprofile from "./datagridprofile"
import { useNavigate } from "react-router-dom";

const colourOptions = [
    { value: 'adharCard', label: 'Adhar Card' },
    { value: 'panCard', label: 'PanCard' },
    { value: 'drivingLicense', label: 'DrivingLicense' },
    //   { value: 'red', label: 'Red' },
    //   { value: 'orange', label: 'Orange' }
]

const countryOptions = [

    { value: 'Afghanistan', label: 'Afghanistan' },
    { value: 'Albania', label: 'Albania' },
    { value: 'Anguilla', label: 'Anguilla' },
    { value: 'Antarctica', label: 'Antarctica' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Bahamas', label: 'Bahamas' },
    { value: 'India', label: 'India' },
    { value: 'Others', label: 'Others' },
    //   { value: 'red', label: 'Red' },
    //   { value: 'orange', label: 'Orange' }
]




const defaultValues = {
    firstNameBasic: '',
    lastNameBasic: '',
    emailBasic: '',
    phoneNumber: '',
    idType: null,
    idNumber: '',
    addressOne: '',
    addressTwo: '',
    country: '',
    state: '',
    postalcode: '',
    gst: ''

}

const ValidationThirdPartyComponents = () => {
    let navigate = useNavigate();

    // ** Hooks
    const {
        setError,
        formState: { errors }
    } = useForm()

    // ** States
    const [basicModal, setBasicModal] = useState(false)
    const [centeredModal, setCenteredModal] = useState(false)
    const [disabledModal, setDisabledModal] = useState(false)
    const [disabledAnimation, setDisabledAnimation] = useState(false)
    // ** State
    const [data, setData] = useState(null)

    // ** Hooks
    const { reset, handleSubmit, control } = useForm({ defaultValues })

    // const onPress = data => {
    //     console.log("I'm in")
    //     setData(data)
    //     if (data.firstNameBasic.length && data.lastNameBasic !== null && data.idType !== null && data.phoneNumber.length) {

    //         console.log(data)
    //         let createmarketGroup = JSON.stringify({
    //             "firstName": data.firstNameBasic,
    //             "lastName": data.lastNameBasic,
    //             "phoneNumber": data.phoneNumber,
    //             "emailID": data.emailBasic,
    //             "IDType": data.idType.value,
    //             "IDNumber": data.idNumber,
    //             "addressOne": data.addressOne,
    //             "addressTwo": data.addressTwo,
    //             "country": data.country.value,
    //             "state": data.state.value,
    //             "postalCode": data.postalcode,
    //             "GSTNumber": data.gst,

    //         })
    //         console.log(createmarketGroup)
    //         let res = fetchx(API_URL + "/guestProfile", {
    //             method: "POST",
    //             headers: { 'Content-Type': 'application/json' },
    //             body: createmarketGroup
    //         }).then((res) => {
    //             console.log(res)
    //         });
    //     }
    //     toast(
    //         <div className='d-flex'>
    //             <p> Submitted</p>
    //         </div>
    //     )
    // }


    const onSubmit = data => {
        setData(data)
        if (data.firstNameBasic.length && data.lastNameBasic !== null) {

            console.log(data)
            let createmarketGroup = JSON.stringify({
                "firstName": data.firstNameBasic,
                "lastName": data.lastNameBasic,


            })
            console.log(createmarketGroup)
            let res = fetchx(API_URL + '/GuestName?firstName=' + data.firstNameBasic + '&lastName=' + data.lastNameBasic)
                .then(result => result.json())
                .then(rowData => {
                    console.log(rowData['data'])
                    if (rowData['data'] == '') {
                        console.log("No data")
                        setBasicModal(!basicModal)

                    }
                    else {
                        console.log("Data present")
                        console.log(rowData['data'])
                        setCenteredModal(!centeredModal)

                    }
                    // setRowData(rowData['data'])
                })

        }
        // toast(
        //     <div className='d-flex'>
        //         <p> Submitted</p>
        //     </div>
        // )
    }


    const handleReset = () => {
        reset({
            firstNameBasic: '',
            lastNameBasic: '',


        })
    }

    return (
        <div>
            {/* <Card>
                <CardHeader>
                    <CardTitle tag='h4'>Guest Profile Details</CardTitle>
                </CardHeader>
                </Card> */}


                {/* <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        < Row>
                            <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='firstNameBasic'>
                                        First Name
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='firstNameBasic'
                                        name='firstNameBasic'
                                        render={({ field }) => <Input placeholder='First Name' invalid={errors.firstNameBasic && true} {...field} />}
                                    />
                                </div>
                            </Col>
                            <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='lastNameBasic'>
                                        Last Name
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='lastNameBasic'
                                        name='lastNameBasic'
                                        render={({ field }) => <Input placeholder='Last Name' invalid={errors.lastNameBasic && true} {...field} />}
                                    />
                                </div>
                            </Col>
                            <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='emailBasic'>
                                        Email
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='emailBasic'
                                        name='emailBasic'
                                        render={({ field }) => (
                                            <Input
                                                type='email'
                                                placeholder='bruce.wayne@email.com'
                                                invalid={errors.emailBasic && true}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                            <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='phonenumber'>
                                        Phone Number
                                    </Label>
                                    <InputGroup className='input-group-merge'>
                                        <InputGroupText
                                            className={classnames({
                                                'is-invalid': data !== null && (data.phoneNumber === null || !data.phoneNumber.length)
                                            })}
                                        >
                                            IN (+91)
                                        </InputGroupText>
                                        <Controller
                                            id='phone-number'
                                            name='phoneNumber'
                                            control={control}
                                            placeholder='1 234 567 8900'
                                            render={({ field }) => (
                                                <Cleave
                                                    {...field}
                                                    className={classnames('form-control', {
                                                        'is-invalid': data !== null && (data.phoneNumber === null || !data.phoneNumber.length)
                                                    })}
                                                    options={{ phone: true, phoneRegionCode: 'IN' }}
                                                />
                                            )}
                                        />
                                    </InputGroup>
                                </div>
                            </Col>
                            
                            <Col>
                                <div className='d-flex'>
                                    <br></br>
                                    <Button className='me-1' color='primary' type='submit'>
                                        Search
                                    </Button>
                                    <Button outline color='secondary' type='reset' onClick={handleReset}>
              Reset
            </Button>
                                </div>
                            </Col>



                        </Row>
                    </Form>
                </CardBody> */}
          

            <div className='demo-inline-spacing'>

                <div className='basic-modal'>
                    {/* <Button color='primary' outline onClick={() => setBasicModal(!basicModal)}>
                        New Customer
                    </Button> */}
                    <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
                        <ModalHeader toggle={() => setBasicModal(!basicModal)}> Welcome...  </ModalHeader>
                        <ModalBody>
                            <p>Your our New Customer. Please do fill Your Details</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color='primary' onClick={() => setDisabledModal(!disabledModal)}>
                                Continue
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>
                {/* onClick={() => <GuestProfile />} */}
                {/* onClick={alert("Hello World!")}  */}


                <div className='vertically-centered-modal'>
                    {/* <Button color='primary' outline onClick={() => setCenteredModal(!centeredModal)}>
                        Vertically Centered
                    </Button> */}
                    <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered'>
                        <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Vertically Centered</ModalHeader>
                        <ModalBody>
                            <Form>
                                <Row>
                                    <Col md='6' sm='12' className='mb-1'>
                                        <p> Welcome... </p>
                                        <p>Your our Existing Customer. Please do Check Your Details</p>

                                    </Col>
                                    <Col sm='12'>
                                    </Col>
                                </Row>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color='primary' onClick={() => setCenteredModal(!centeredModal)}>
                                Submit
                            </Button>{' '}
                            {/* <Button outline color='primary' onClick={() => setCenteredModal(!centeredModal)}>
              Reset
            </Button> */}
                        </ModalFooter>
                    </Modal>
                </div>

                <div className='disabled-backdrop-modal'>
                    <Button color='primary' outline onClick={() => navigate('/apps/configuration/guestProfile')}  >
                        Create New Profile
                    </Button>
                    <Modal
                        isOpen={disabledModal}
                        toggle={() => setDisabledModal(!disabledModal)}
                        className="modal-lg" 
                        backdrop={false}                    >
                        {/* <ModalHeader toggle={() => setDisabledModal(!disabledModal)}>Disabled Backdrop</ModalHeader> */}
                        {/* <ModalBody> */}
                        
                        {/* <GuestProfile /> */}
                        {/* </ModalBody> */}
                        <ModalFooter>
                            <Button color='primary' onClick={() => setDisabledModal(!disabledModal)}>
                                Back
                            </Button>{' '}
                        </ModalFooter>
                    </Modal>
                </div>

                <div className='disabled-animation-modal'>
                    {/* <Button color='primary' outline onClick={() => setDisabledAnimation(!disabledAnimation)}>
                        Get user details
                    </Button> */}
                    <Modal
                        isOpen={disabledAnimation}
                        toggle={() => setDisabledAnimation(!disabledAnimation)}
                        className='modal-dialog-centered'
                        fade={false}
                    >
                        <ModalHeader toggle={() => setDisabledAnimation(!disabledAnimation)}>Disabled Fade</ModalHeader>
                        <ModalBody>
                            {/* <Datagridprofile /> */}

                        </ModalBody>
                        {/* <ModalFooter>
                            <Button color='primary' onClick={() => setDisabledAnimation(!disabledAnimation)}>
                                Back
                            </Button>{' '}
                        </ModalFooter> */}
                    </Modal>
                </div>


            </div>
        </div>
    )
}

export default ValidationThirdPartyComponents
