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


const UpdateComplaint = ({ data, toggleModal }) => {

    const navigate = useNavigate()
    const { reset, handleSubmit, control, setValue } = useForm({})
    const [Roomarrs, setRoomarrs] = useState([])
    let roomlist = []
    const [show, actionButton] = useState(false)
    const [departmentType, setDepartmentType] = useState(data[0]?.departmentID || '')
    const [complaintID, setComplaintID] = useState(data[0]?.complaint || '')
    const [guestType, setGuestType] = useState(data[0]?.guestType || '')
    const [guestName, setGuestName] = useState(data[0]?.guestName || '')
    const [guestEmail, setGuestEmail] = useState(data[0]?.guestEmail || '')
    const [guestPhone, setGuestPhone] = useState(data[0]?.guestPhone || '')
    const [guestDetails, setGuestDetails] = useState(data[0]?.s ? data[0].s + " " + data[0].f + " " + data[0].l : data[0]?.f + " " + data[0]?.l || '')
    const [sourceIDData, setSourceID] = useState(data[0]?.sourceID || '')
    const [RoomDatas, setRoomDatas] = useState({})
    const [metByOption, setMetByOption] = useState(data[0]?.metBy || '')
    const [serviceRecoveryOptions, setServiceRecoveryOptions] = useState(data[0]?.serviceRecovery || '')
    const [guestModalShow, setGuestModalShow] = useState(data[0]?.guestType === 'Resident' ? true : false)
    const [guestModalShow1, setGuestModalShow1] = useState(data[0]?.guestType === 'Non-Resident' ? true : false)
    const [chargableAmount, setCharagableAmount] = useState(data[0]?.recoveryChargable == 1 ? true : false)
    const [chargedAmount, setChargedAmount] = useState(data[0]?.recoveryAmount || '')
    const [resolution, setResolution] = useState(data[0]?.resolution || '')
    const [rca, setRCA] = useState(data[0]?.rootCauseAnalysis || '')
    const [commentsData, setComments] = useState(data[0]?.comments || '')
    const [complaintData, setComplaintData] = useState(true)
    const [recoveryOption, setRecoveryOption] = useState(data[0]?.recoveryChargable || '')
    const [complaiantDataID, setComplaintDataID] = useState(data[0]?.id || '')


    function modalClose() {
        toggleModal()
    }


    // On submit function
    const onSubmit = () => {

        const jsonData = JSON.stringify({
            id: complaiantDataID,
            departmentOption: departmentType,
            compaintName: complaintID,
            source: sourceIDData,
            // serviceRecovery: serviceRecoveryOptions,
            // recoveryChargable: recoveryOption,
            // recoveryAmount: recoveryOption === '0' ? 0.00 : chargedAmount,
            comments: commentsData,
            // metBYOptions: metByOption,
            // resolution: resolution,
            // root_cause_aanalysis: rca,
        })

        fetch(API_URL + "/updateGuestComplaintData", {
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


    // Prepare default values for dropdowns
    const defaultReasonDepartment = data[0]?.departmentID ? {
        value: data[0].departmentID,
        label: data[0].departmentName,
    } : null;
    
    const defaultComplaintID = data[0]?.complaint ? {
        value: data[0].complaint,
        label: data[0].complaint,
    } : null;
    
    const defaultSourceID = data[0]?.sourceID ? {
        value: data[0].sourceID,
        label: data[0].sourceName,
    } : null;
    
    const defaultMetBy = data[0]?.metBy ? {
        value: data[0].metBy,
        label: data[0].roleName,
    } : null;
    
    const defaultServiceRecovery = data[0]?.serviceRecovery !== undefined ? {
        value: data[0].serviceRecovery,
        label: data[0].serviceRecovery === 1 ? 'Yes' : 'No',
    } : null;
    
    const defaultRecoveryChargable = data[0]?.recoveryChargable !== undefined ? {
        value: data[0].recoveryChargable,
        label: data[0].recoveryChargable === 1 ? 'Yes' : 'No',
    } : null;
    
    const defaultGuestType = data[0]?.guestType ? {
        value: data[0].guestType,
        label: data[0].guestType,
    } : null;


    // Department selection handle change with proper update of complaint options
    const handleSelectChanges = (selectedOption) => {
        if (selectedOption === null) {
            setDepartmentType('');
            setRoomarrs([]);
            setValue('jobName', null);
            return;
        }
        
        setDepartmentType(selectedOption.value);
        setValue('jobName', null); // Reset complaint dropdown
        
        // If RoomDatas contains data for this department, update complaint options
        if (RoomDatas && RoomDatas[selectedOption.value]) {
            const newRoomList = [];
            const departmentData = RoomDatas[selectedOption.value];
            
            // Check if departmentData is a string (JSON) that needs parsing
            const dataArray = typeof departmentData === 'string' 
                ? JSON.parse(departmentData) 
                : departmentData;
                
            for (let j = 0; j < dataArray.length; j++) {
                const option = { 
                    value: dataArray[j], 
                    label: dataArray[j] 
                };
                newRoomList.push(option);
            }
            setRoomarrs(newRoomList);
        } else {
            // If no data for this department, clear complaint options
            setRoomarrs([]);
        }
    };


    // Complaint selection handle change
    const handleChangeComplaint = (selectedOption) => {
        if (selectedOption === null) {
            setComplaintID('');
            setValue('jobName', null);
            return;
        }
        
        setValue('jobName', selectedOption);
        setComplaintID(selectedOption.value);
    };


    // Source selection handle change
    const handleChangeSource = (selectedOption) => {
        if (selectedOption === null) {
            setSourceID('');
            return;
        }
        setSourceID(selectedOption.value);
    };


    // Met by selection handle change
    const handleChangeMetBY = (selectedOption) => {
        if (selectedOption === null) {
            setMetByOption('');
            return;
        }
        setMetByOption(selectedOption.value);
    };


    // Service recovery selection handle change
    const handleChangeServiceRecovery = (selectedOption) => {
        if (selectedOption === null) {
            setServiceRecoveryOptions('');
            return;
        }
        setServiceRecoveryOptions(selectedOption.value);
    };


    // Recovery chargable selection handle change
    const handleChangeChargedAmount = (event) => {
        setChargedAmount(event.target.value);
    };


    // Handle change of resolution
    const handleChangeResolution = (event) => {
        setResolution(event.target.value);
    };


    // Handle change of RCA
    const handleChangeRCA = (event) => {
        setRCA(event.target.value);
    };


    // Handle change of comments
    const handleChangeComments = (event) => {
        setComments(event.target.value);
    };


    // Handle change of guest name
    const handleChangeGuestName = (event) => {
        setGuestName(event.target.value);
    };


    // Handle change of guest email
    const handleChangeGuestEmail = (event) => {
        setGuestEmail(event.target.value);
    };


    // Handle change of guest phone number
    const handleChangeGuestPhone = (event) => {
        setGuestPhone(event.target.value);
    };


    // Load department and complaint data on component mount
    useEffect(() => {
        fetch(API_URL + '/getjobnamebasedondepartment')
            .then(result => result.json())
            .then(resp => {
                setRoomDatas(resp['data']);
                
                // Only proceed if departmentID exists
                if (data[0]?.departmentID) {
                    setDepartmentType(data[0].departmentID);
                    
                    // Set department in react-hook-form if it exists
                    if (defaultReasonDepartment) {
                        setValue('jobDepartmentOptions', defaultReasonDepartment);
                    }
                    
                    // Only set complaint options if department data exists
                    if (resp['data'][data[0].departmentID]) {
                        const departmentData = resp['data'][data[0].departmentID];
                        const dataArray = typeof departmentData === 'string' 
                            ? JSON.parse(departmentData) 
                            : departmentData;
                            
                        const newRoomList = [];
                        for (let j = 0; j < dataArray.length; j++) {
                            const RoomNumbers = { 
                                value: dataArray[j], 
                                label: dataArray[j] 
                            };
                            newRoomList.push(RoomNumbers);
                        }
                        setRoomarrs(newRoomList);
                        
                        // Set complaint in react-hook-form if it exists
                        if (defaultComplaintID) {
                            setValue('jobName', defaultComplaintID);
                        }
                    }
                }
                
                // Set source in react-hook-form if it exists
                if (defaultSourceID) {
                    setValue('complaintSource', defaultSourceID);
                }
            })
            .catch(error => {
                console.error("Error fetching department data:", error);
            });
    }, []);


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


    // Error handling for same guest addition
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


    // Success card
    const handleSuccess = () => {
        return MySwal.fire({
            title: 'Guest Complaint Update !!',
            text: 'Successfully updated the guest complaint',
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
                                    <Select
                                        isClearable
                                        required
                                        options={DepartmentOptions}
                                        classNamePrefix='select'
                                        defaultValue={defaultReasonDepartment}
                                        theme={selectThemeColors}
                                        className={classnames('react-select')}
                                        {...field}
                                        onChange={(option) => {
                                            field.onChange(option);
                                            handleSelectChanges(option);
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </Col>

                    {/* Complaint selection */}
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
                                    <Select
                                        required
                                        isClearable
                                        options={Roomarrs}
                                        defaultValue={defaultComplaintID}
                                        classNamePrefix='select'
                                        theme={selectThemeColors}
                                        className={classnames('react-select')}
                                        {...field}
                                        onChange={(option) => {
                                            field.onChange(option);
                                            handleChangeComplaint(option);
                                        }}
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
                                        disabled
                                        defaultValue={data[0]?.guestType || ''}
                                        {...field}
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
                                        disabled
                                        defaultValue={guestDetails}
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
                                            defaultValue={data[0]?.guestName || ''}
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
                                            defaultValue={data[0]?.guestEmail || ''}
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
                                            defaultValue={data[0]?.guestPhone || ''}
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
                                    <Select
                                        required
                                        isClearable
                                        options={SourceOptions}
                                        defaultValue={defaultSourceID}
                                        classNamePrefix='select'
                                        theme={selectThemeColors}
                                        className={classnames('react-select')}
                                        {...field}
                                        onChange={(option) => {
                                            field.onChange(option);
                                            handleChangeSource(option);
                                        }}
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
                                        defaultValue={StatusOptions[0].label}
                                        {...field}
                                    />
                                )}
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
                                        defaultValue={data[0]?.comments || ''}
                                        {...field}
                                        onInput={handleChangeComments}
                                    />
                                )}
                            />
                        </div>
                    </Col>


                    <div align='end'>
                        <Button className="me-1" outline color="secondary" onClick={modalClose}>
                            Close
                        </Button>
                        <Button className="me-1" type="submit" color="primary">
                            Update
                        </Button>
                    </div>
                </Row>
            </Form>
        </div>
    )
}


export default UpdateComplaint