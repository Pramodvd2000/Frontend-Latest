import { Row, Col, Form, Button, Label, Input, Modal, ModalBody, ModalHeader } from 'reactstrap'
// ** React Imports
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useNavigate } from "react-router-dom"

import classnames from "classnames"
import "cleave.js/dist/addons/cleave-phone.us"
import { useForm, Controller } from "react-hook-form"


// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import API_URL from '../../../../config'


const MySwal = withReactContent(Swal)


let ServiceRecoveryOption = [
    { value: '1', label: 'Yes' },
    { value: '0', label: 'No' }
]


let RecoveryChargebleOption = [
    { value: '1', label: 'Yes' },
    { value: '0', label: 'No' }
]


let RoomNumberOptions = [
    { value: 'Checked In', label: 'Checked In' },
    { value: 'Checked Out', label: 'Checked Out' }
]


let GuestTypeSelection = [
    { value: 'Resident', label: 'Resident' },
    { value: 'Non-Resident', label: 'Non-Resident' }
]


let StatusOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'Closed', label: 'Closed' }
]


let DepartmentOptions = [
    fetch(API_URL + '/getGuestComplaintDepartmentOptions')
        .then(result => result.json())
        .then(resp => {
            DepartmentOptions = resp['data']
            return DepartmentOptions
        })
]



let MetByNames = [
    fetch(API_URL + '/getMetByOptions')
        .then(result => result.json())
        .then(resp => {
            MetByNames = resp['data']
            return MetByNames
        })
]


let SourceOptions = [
    fetch(API_URL + '/getGuestComplaintSource')
        .then(result => result.json())
        .then(resp => {
            SourceOptions = resp['data']
            return SourceOptions
        })
]


const CloseComplaint = ({ data, toggleModal }) => {

    const navigate = useNavigate()
    const { reset, handleSubmit, control, setValue } = useForm({})
    const [Roomarrs, setRoomarrs] = useState([])
    let roomlist = []
    const [show, actionButton] = useState(false)
    const [departmentType, setDepartmentType] = useState(data[0]['departmentID']);
    const [complaintID, setComplaintID] = useState(data[0]['complaint']);
    const [guestType, setGuestType] = useState(data[0]['guestType']);
    const [guestName, setGuestName] = useState(data[0]['guestName'])
    const [guestEmail, setGuestEmail] = useState(data[0]['guestEmail'])
    const [guestPhone, setGuestPhone] = useState(data[0]['guestPhone'])
    const [guestDetails, setGuestDetails] = useState(data[0]['s'] ? data[0]['s'] + " " + data[0]['f'] + " " + data[0]['l'] : data[0]['f'] + " " + data[0]['l'])
    const [sourceIDData, setSourceID] = useState(data[0]['sourceID'])
    const [RoomDatas, setRoomDatas] = useState("")
    const [metByOption, setMetByOption] = useState(data[0]['metBy'])
    const [serviceRecoveryOptions, setServiceRecoveryOptions] = useState(data[0].serviceRecovery)
    const [guestModalShow, setGuestModalShow] = useState(data[0]['guestType'] === 'Resident' ? true : false)
    const [guestModalShow1, setGuestModalShow1] = useState(data[0]['guestType'] === 'Non-Resident' ? true : false)
    const [chargableAmount, setCharagableAmount] = useState(data[0].recoveryChargable == 1 ? true : false)
    const [chargedAmount, setChargedAmount] = useState(data[0].recoveryAmount)
    const [resolution, setResolution] = useState(data[0].resolution)
    const [rca, setRCA] = useState(data[0].rootCauseAnalysis)
    const [commentsData, setComments] = useState(data[0].comments)
    const [complaintData, setComplaintData] = useState(true)
    const [recoveryOption, setRecoveryOption] = useState(data[0].recoveryChargable)
    const [complaiantDataID, setComplaintDataID] = useState(data[0].id)


    function modalClose() {
        toggleModal()
    }


    // On submit function
    const onSubmit = () => {

        if((defaultReasonDepartment.label === null || defaultComplaintID.label === null)){
            handleError("Please fill all the required fields")
            return
        }


        const jsonData = JSON.stringify({
            id: complaiantDataID,
            serviceRecovery: serviceRecoveryOptions,
            recoveryChargable: recoveryOption,
            recoveryAmount: recoveryOption === '0' ? 0.00 : chargedAmount,
            comments: commentsData,
            metBYOptions: metByOption,
            resolution: resolution,
            root_cause_aanalysis: rca,
        })

        fetch(API_URL + "/closeGuestComplaint", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonData
        }).then((res) => {
            if (res.status == 200) {
                handleSuccess()
            }
            else {
                handleError("Something went wrong !!!")
            }
        })
    }


    // Default reason for department selection
    const defaultReasonDepartment = {
        value: data[0].departmentID,
        label: data[0].departmentName,
    };

    console.log(defaultReasonDepartment)


    // Default reason for complaint selection
    const defaultComplaintID = {
        value: data[0].complaint,
        label: data[0].complaint,
    };


    // Default reason for source
    const defaultSourceID = {
        value: data[0].sourceID,
        label: data[0].sourceName,
    };


    // Default reason for met by
    const defaultMetBy = {
        value: data[0].metBy,
        label: data[0].roleName,
    };


    // Default reason for service recovery
    const defaultServiceRecovery = {
        value: data[0].serviceRecovery,
        label: data[0].serviceRecovery === 1 ? 'Yes' : 'No',
    };


    // Default reason for recovery chargable
    const defaultRecoveryChargable = {
        value: data[0].recoveryChargable,
        label: data[0].recoveryChargable === 1 ? 'Yes' : 'No',
    };


    // Default reason for guest type
    const defaultGuestType = {
        value: data[0].guestType,
        label: data[0].guestType,
    };


    //department selection handle change
    const handleChangeDepartment = (selectedOption) => {
        setDepartmentType(selectedOption.value);
    };


    //complaint selection handle change
    const handleChangeComplaint = (selectedOption) => {
        setComplaintID(selectedOption.value);
    };


    //source selection handle change
    const handleChangeSource = (selectedOption) => {
        setSourceID(selectedOption.value);
    };


    //met by selection handle change
    const handleChangeMetBY = (selectedOption) => {
        setMetByOption(selectedOption.value);
    };


    //service recovery selection handle change
    const handleChangeServiceRecovery = (selectedOption) => {
        setServiceRecoveryOptions(selectedOption.value);
    };


    //recovery chargable selection handle change
    const handleChangeChargedAmount = (event) => {
        setChargedAmount(event.target.value);
    };


    //handle change of resolution
    const handleChangeResolution = (event) => {
        setResolution(event.target.value);
    };


    //handle change of RCA
    const handleChangeRCA = (event) => {
        setRCA(event.target.value);
    };


    //handle change of comments
    const handleChangeComments = (event) => {
        setComments(event.target.value);
    };


    //handle change of guest name
    const handleChangeGuestName = (event) => {
        setGuestName(event.target.value);
    };


    //handle change of guest email
    const handleChangeGuestEmail = (event) => {
        setGuestEmail(event.target.value);
    };


    //handle change of guest phone number
    const handleChangeGuestPhone = (event) => {
        setGuestPhone(event.target.value);
    };


    useEffect(() => {
        fetch(API_URL + '/getjobnamebasedondepartment')
            .then(result => result.json())
            .then(resp => {
                setDepartmentType(data[0]['departmentID'])
                for (let j = 0; j < JSON.parse(resp['data'][data[0]['departmentID']]).length; j++) {
                    const RoomNumbers = { value: JSON.parse(resp['data'][data[0]['departmentID']])[j], label: JSON.parse(resp['data'][data[0]['departmentID']])[j] }
                    roomlist.push(RoomNumbers)
                }
                setRoomarrs(roomlist);
                setRoomDatas(resp['data'])
            })

    }, [data[0]['departmentID']])


    // On select of department complaint set
    const handleSelectChanges = (event) => {
        if (event) {
            setDepartmentType(event.value)
            for (let i = 0; i < 1; i++) {
                for (let j = 0; j < JSON.parse(RoomDatas[event.value]).length; j++) {
                    const RoomNumbers = { value: JSON.parse(RoomDatas[event.value])[j], label: JSON.parse(RoomDatas[event.value])[j] }
                    roomlist.push(RoomNumbers)
                }
                setRoomarrs(roomlist)
            }
        }
    }


    // Type of guest selection 
    const ChargableRecovery = (event) => {
        if (event !== null && event.label === 'Yes') {
            setRecoveryOption(event.value)
            return setCharagableAmount(true)
        }
        else {
            setRecoveryOption(event.value)
            setCharagableAmount(false)
        }
    }


    // error handling for same guest addition
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


    //Success card
    const handleSuccess = () => {
        return MySwal.fire({
            title: 'Guest Complaint !!',
            text: 'Successfully Closed the guest complaint',
            icon: 'success',
        },
            actionButton(false),
            setTimeout(() => { navigate('/dashboard/guestcomplaint') }, 1000)
        )
    }


    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>

                    {/* Department selection */}
                    <Col md='3' sm='8'>
                        <div className='mb-1'>
                            <Label className='form-label' for='jobDepartmentOptions'>
                                Department <span style={{ color: 'red' }}> * </span>
                            </Label>
                            <Controller
                                id='jobDepartmentOptions'
                                control={control}
                                name='jobDepartmentOptions'
                                render={({ field }) => (
                                    <Input
                                        isClearable
                                        required
                                        disabled
                                        // options={DepartmentOptions}
                                        // classNamePrefix='select'
                                        defaultValue={defaultReasonDepartment.label}
                                        // theme={selectThemeColors}
                                        // className={classnames('react-select')}
                                        {...field}
                                        onChange={handleSelectChanges}
                                    />
                                )}
                            />
                        </div>
                    </Col>


                    {/* complaint selection */}
                    <Col md='3' sm='12' className='mb-1'>
                        <div className='mb-1'>
                            <Label className='form-label' for='jobName'>
                                Complaint <span style={{ color: 'red' }}> * </span>
                            </Label>
                            <Controller
                                id='jobName'
                                control={control}
                                name='jobName'
                                render={({ field }) => (
                                    <Input
                                        disabled
                                        required
                                        isClearable
                                        // options={Roomarrs}
                                        defaultValue={defaultComplaintID.label}
                                        // classNamePrefix='select'
                                        // theme={selectThemeColors}
                                        // className={classnames('react-select')}
                                        {...field}
                                        onChange={handleChangeComplaint}
                                    />
                                )}
                            />
                        </div>
                    </Col>


                    {/* Guest Type */}
                    <Col md='3' sm='12' className='mb-1'>
                        <div className='mb-1'>
                            <Label className='form-label' for='guestType'>
                                Guest Type <span style={{ color: 'red' }}> * </span>
                            </Label>
                            <Controller
                                id='guestType'
                                control={control}
                                name='guestType'
                                render={({ field }) => (
                                    <Input
                                        required
                                        isClearable
                                        disabled
                                        // options={GuestTypeSelection}
                                        // classNamePrefix='select'
                                        defaultValue={data[0]['guestType']}
                                        // theme={selectThemeColors}
                                        // className={classnames('react-select')}
                                        {...field}
                                    // onChange={GuestType}
                                    />
                                )}
                            />
                        </div>
                    </Col>


                    {/* Guest selection */}
                    {guestModalShow === true && <Col md='3' sm='12' className='mb-1'>
                        <div className='mb-1'>
                            <Label className='form-label' for='roomNumber'>
                                Select Guest <span style={{ color: 'red' }}> * </span>
                            </Label>
                            <Controller
                                id='roomNumber'
                                control={control}
                                name='roomNumber'
                                render={({ field }) => (
                                    <Input
                                        required
                                        isClearable
                                        disabled
                                        defaultValue={guestDetails}
                                        // options={RoomNumberOptions}
                                        // classNamePrefix='select'
                                        // theme={selectThemeColors}
                                        // onChange={GuestSelection}
                                        // className={classnames('react-select')}
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                    </Col>}


                    {/* Guest name for non-resident guest */}
                    {
                        guestModalShow1 === true &&
                        <Col md='3' sm='12' className='mb-1'>
                            <div className='mb-1'>
                                <Label className='form-label' for='guestName'>
                                    Guest Name <span style={{ color: 'red' }}> * </span>
                                </Label>
                                <Controller
                                    id='guestName'
                                    name='guestName'
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type='text'
                                            placeholder='Guest name'
                                            disabled
                                            defaultValue={data[0].guestName}
                                            {...field}
                                            onInput={handleChangeGuestName}
                                        />
                                    )}
                                />
                            </div>
                        </Col>
                    }


                    {/* Email ID for non-resident guest */}
                    {
                        guestModalShow1 === true &&
                        <Col md='3' sm='12' className='mb-1'>
                            <div className='mb-1'>
                                <Label className='form-label' for='emailID'>
                                    Email ID
                                </Label>
                                <Controller
                                    id='emailID'
                                    name='emailID'
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            disabled
                                            type='text'
                                            placeholder='Guest email ID'
                                            defaultValue={data[0].guestEmail}
                                            {...field}
                                            onInput={handleChangeGuestEmail}
                                        />
                                    )}
                                />
                            </div>
                        </Col>
                    }


                    {/* Phone number for non-resident guest */}
                    {
                        guestModalShow1 === true &&
                        <Col md='3' sm='12' className='mb-1'>
                            <div className='mb-1'>
                                <Label className='form-label' for='phoneNumber'>
                                    Phone Number
                                </Label>
                                <Controller
                                    id='phoneNumber'
                                    name='phoneNumber'
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type='text'
                                            disabled
                                            placeholder='Guest mobile number'
                                            defaultValue={data[0].guestPhone}
                                            {...field}
                                            onInput={handleChangeGuestPhone}
                                        />
                                    )}
                                />
                            </div>
                        </Col>
                    }


                    {/* Source option selection */}
                    <Col md='3' sm='12' className='mb-1'>
                        <div className='mb-1'>
                            <Label className='form-label' for='complaintSource'>
                                Source <span style={{ color: 'red' }}> * </span>
                            </Label>
                            <Controller
                                id='complaintSource'
                                control={control}
                                name='complaintSource'
                                render={({ field }) => (
                                    <Input
                                        required
                                        isClearable
                                        disabled
                                        // options={SourceOptions}
                                        defaultValue={defaultSourceID.label}
                                        // classNamePrefix='select'
                                        // theme={selectThemeColors}
                                        // className={classnames('react-select')}
                                        {...field}
                                        onChange={handleChangeSource}
                                    />
                                )}
                            />
                        </div>
                    </Col>


                    {/* Met by option selection */}
                    <Col md='3' sm='12' className='mb-1'>
                        <div className='mb-1'>
                            <Label className='form-label' for='metByName'>
                                Met By <span style={{ color: 'red' }}> * </span>
                            </Label>
                            <Controller
                                id='metByName'
                                control={control}
                                name='metByName'
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        required
                                        options={MetByNames}
                                        defaultValue={defaultMetBy}
                                        classNamePrefix='select'
                                        theme={selectThemeColors}
                                        className={classnames('react-select')}
                                        {...field}
                                        onChange={handleChangeMetBY}
                                    />
                                )}
                            />
                        </div>
                    </Col>


                    {/* Status Options */}
                    <Col md='3' sm='12' className='mb-1'>
                        <div className='mb-1'>
                            <Label className='form-label' for='statusOptions'>
                                Status <span style={{ color: 'red' }}> * </span>
                            </Label>
                            <Controller
                                id='statusOptions'
                                control={control}
                                name='statusOptions'
                                render={({ field }) => (
                                    <Input
                                        required
                                        disabled
                                        defaultValue={StatusOptions[1].label}
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                    </Col>


                    {/* Service Recovery options */}
                    <Col md='3' sm='12' className='mb-1'>
                        <div className='mb-1'>
                            <Label className='form-label' for='serviceRecovery'>
                                Service Recovery <span style={{ color: 'red' }}> * </span>
                            </Label>
                            <Controller
                                id='serviceRecovery'
                                control={control}
                                name='serviceRecovery'
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        required
                                        options={ServiceRecoveryOption}
                                        defaultValue={defaultServiceRecovery}
                                        classNamePrefix='select'
                                        theme={selectThemeColors}
                                        className={classnames('react-select')}
                                        onChange={handleChangeServiceRecovery}
                                    />
                                )}
                            />
                        </div>
                    </Col>


                    {/* Recovery Chargable options */}
                    <Col md='3' sm='12' className='mb-1'>
                        <div className='mb-1'>
                            <Label className='form-label' for='recoveryChargable'>
                                Recovery Chargable <span style={{ color: 'red' }}> * </span>
                            </Label>
                            <Controller
                                id='recoveryChargable'
                                control={control}
                                name='recoveryChargable'
                                render={({ field }) => (
                                    <Select
                                        required
                                        isClearable
                                        defaultValue={defaultRecoveryChargable}
                                        options={RecoveryChargebleOption}
                                        classNamePrefix='select'
                                        theme={selectThemeColors}
                                        className={classnames('react-select')}
                                        {...field}
                                        onChange={ChargableRecovery}
                                    />
                                )}
                            />
                        </div>
                    </Col>


                    {/* Chargable Amount */}
                    {chargableAmount === true && <Col md='3' sm='12'>
                        <div className='mb-1'>
                            <Label className='form-label' for='chargableAmount'>
                                Chargable Amount <spam style={{ color: 'red' }}>*</spam>
                            </Label>
                            <Controller
                                control={control}
                                id='chargableAmount'
                                name='chargableAmount'
                                render={({ field }) =>
                                    <Input
                                        required
                                        type='text'
                                        placeholder='Enter chargable amount'
                                        // pattern='^(1[6-9]|[2-9]\d+|\d{3,})$'
                                        // title='Please enter a number above 15'
                                        defaultValue={data[0].recoveryAmount}
                                        {...field}
                                        onInput={handleChangeChargedAmount}
                                    />}
                            />
                        </div>
                    </Col>}


                    {/* resolution */}
                    <Col md='3' sm='12'>
                        <div className='mb-1'>
                            <Label className='form-label' for='resolution'>
                                Resolution
                            </Label>
                            <Controller
                                control={control}
                                id='resolution'
                                name='resolution'
                                render={({ field }) =>
                                    <Input
                                        required
                                        type='textarea'
                                        placeholder='Enter resolution'
                                        defaultValue={data[0].resolution}
                                        {...field}
                                        onInput={handleChangeResolution}
                                    />}
                            />
                        </div>
                    </Col>


                    {/* root cause analysis */}
                    <Col md='3' sm='12'>
                        <div className='mb-1'>
                            <Label className='form-label' for='rootCauseAnalysis'>
                                Root Cause Analysis
                            </Label>
                            <Controller
                                control={control}
                                id='rootCauseAnalysis'
                                name='rootCauseAnalysis'
                                render={({ field }) =>
                                    <Input
                                        required
                                        type='textarea'
                                        placeholder='Enter root cause analysis'
                                        defaultValue={data[0].rootCauseAnalysis}
                                        {...field}
                                        onInput={handleChangeRCA}
                                    />}
                            />
                        </div>
                    </Col>


                    {/* Comments */}
                    <Col md='3' sm='12' className='mb-1'>
                        <div className='mb-1'>
                            <Label className='form-label' for='description'>
                                Comments
                            </Label>
                            <Controller
                                id='description'
                                name='description'
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type='textarea'
                                        placeholder='Enter the comments here'
                                        defaultValue={data[0].comments}
                                        {...field}
                                        onInput={handleChangeComments}
                                    />
                                )}
                            />
                        </div>
                    </Col>


                    <div align='end'>
                        <Button className="me-1" outline color="secondary" onClick={modalClose}>
                            Exit
                        </Button>
                        <Button className="me-1" type="submit" color="primary">
                            Close Complaint
                        </Button>
                    </div>
                </Row>
            </Form>
        </div>
    )
}


export default CloseComplaint