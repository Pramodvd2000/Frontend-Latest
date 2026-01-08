import { Row, Col, Form, Button, Label, InputGroup, Input, Modal, ModalBody, ModalHeader, Accordion, AccordionBody, AccordionItem, AccordionHeader, CardHeader, CardBody, Card } from 'reactstrap'
// ** React Imports
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useNavigate } from "react-router-dom"
import Flatpickr from 'react-flatpickr'
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import classnames from "classnames"
import "cleave.js/dist/addons/cleave-phone.us"
import { useForm, Controller } from "react-hook-form"

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import API_URL from '../../../../config'
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import UpdateComplaint from './updateComplaint'
import CloseComplaint from './closeComplaint'
import Moment from 'moment'


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


const defaultValues = {
    jobType: "Guest Complaint",
    jobDepartment: null,
    jobName: null,
    floorNumber: null,
    roomNumber: null,
    isHighPriority: null,
    description: '',
    createdBy: null
}


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


let Roomarrs = []


const Modalform = () => {


    const navigate = useNavigate()
    const [show, actionButton] = useState(false)
    const [SelectedValues, setSelectedValues] = useState(null)
    const { reset, handleSubmit, control, setValue, watch } = useForm({ defaultValues })
    const [RoomDatas, setRoomDatas] = useState("")
    const [reservationData, setReservationData] = useState()
    const [reservationModal, setReservationModal] = useState(false)
    const gridRef = useRef(null);
    const [guestData, setGuestData] = useState()
    const [guestSet, setGuest] = useState()
    const [complaintList, setComplaintList] = useState()
    const [open, setOpen] = useState([]);
    const [updateModal, setUpdateModal] = useState(false);
    const [closeModal, setCloseModal] = useState(false);
    const [complaintData, setComplaintData] = useState()
    const [guestModalShow, setGuestModalShow] = useState(false)
    const [guestModalShow1, setGuestModalShow1] = useState(false)
    const [chargableAmount, setCharagableAmount] = useState(false)
    const [guestType, setGuestType] = useState()
    const [recoveryOption, setRecoveryOption] = useState()
    const [guestID, setGuestID] = useState()
    const [roomID, setRoomID] = useState()
    const [roomNumber, setRoomNumber] = useState()
    const [residentTrue, serResidentTrue] = useState(false)
    const [nonResidentTrue, setNonResidentTrue] = useState(false)
    const [selectTypeOfGuest, setSelectTypeOfGuest] = useState(false)
    const [arrivalDate, setArrivalDate] = useState();


    // Arrival date condition
    let options = {
        maxDate: arrivalDate
    }



    useEffect(() => {

        fetch(API_URL + '/getjobnamebasedondepartment')
            .then(result => result.json())
            .then(resp => {
                setRoomDatas(resp['data'])
            })

        fetch(API_URL + '/getAllGuestComplaintList')
            .then(result => result.json())
            .then(resp => {
                setComplaintList(resp['data'])
            })

        const hotelID = JSON.stringify({
            hotelID: 1
        })
        fetchx(API_URL + "/getBusinessDate", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: hotelID
        }).then((res) => res.json())
            .then(postres => {
                setArrivalDate((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
            })
    }, [])


    const GetComplaintList = (data) => {
        if (data.incomeDate === undefined) {
            return handleError("Please select the from date")
        }
        if (data.outGoData === undefined) {
            return handleError("Please select the to date")
        }
        if ((Moment(String(new Date(data.departure))).format('YYYY-MM-DD')) < (Moment(String(new Date(data.coming))).format('YYYY-MM-DD'))) {
            return handleError("Please select the to date")
        }
        let fromDate = (Moment(String(new Date(data.incomeDate))).format('YYYY-MM-DD'))
        let toDate = (Moment(String(new Date(data.outGoData))).format('YYYY-MM-DD'))

        fetch(API_URL + `/getAllGuestComplaintList?startDate=${fromDate}&endDate=${toDate}`)
            .then(result => result.json())
            .then(resp => {
                setComplaintList(resp['data'])
            })
    }


    const resetData = () => {
        fetch(API_URL + '/getAllGuestComplaintList')
            .then(result => result.json())
            .then(resp => {
                setComplaintList(resp['data'])
            })
        setValue('incomeDate', null)
        setValue('outGoData', null)
    }


    // guest data
    const [columnDefs2] = useState([
        {
            headerName: "Room Number",
            field: "roomNumber",
            suppressSizeToFit: true,
            maxWidth: 140
        },
        {
            headerName: 'Guest Name',
            suppressSizeToFit: true,
            width: 280,
            valueGetter: function (params) {
                const salutation = params.data.s;
                const firstName = params.data.f;
                const lastName = params.data.l;
                const fullName = salutation ? `${salutation} ${firstName} ${lastName}` : `${firstName} ${lastName}`;
                return fullName;
            },
        },
        {
            headerName: "Check-In Date",
            field: 'arrivalDate',
            suppressSizeToFit: true,
            maxWidth: 170
        },
        {
            headerName: "Check-Out Date",
            field: 'departureDate',
            suppressSizeToFit: true,
            maxWidth: 170
        },
        {
            headerName: 'Action',
            field: 'numAvlRooms',
            suppressSizeToFit: true,
            maxWidth: 125,
            cellRendererFramework: (params) => <Button color='primary' onClick={() => actionButton1(params)}> Select </Button>
        },
    ]);


    // guest complaint list
    const [columnDefs3] = useState([
        {
            headerName: "Room No/Non Resident",
            field: 'roomNumber',
            suppressSizeToFit: true,
            maxWidth: 220
        },
        {
            headerName: "Guest Name",
            field: 'guestName',
            suppressSizeToFit: true,
            maxWidth: 150
        },
        {
            headerName: "Company/Agent",
            field: 'companyName',
            suppressSizeToFit: true,
            maxWidth: 200
        },
        {
            headerName: "Check in",
            field: 'checkin',
            suppressSizeToFit: true,
            maxWidth: 150
        },
        {
            headerName: "Check out",
            field: 'checkout',
            suppressSizeToFit: true,
            maxWidth: 150
        },
        {
            headerName: "Complaint type",
            field: 'complaintName',
            suppressSizeToFit: true,
            maxWidth: 150
        },
        {
            headerName: "Source",
            field: 'sourceName',
            suppressSizeToFit: true,
            width: 220
        },
        {
            headerName: 'Complaint details',
            field: 'comments',
            suppressSizeToFit: true,
            width: 200
        },
          {
            headerName: 'Actions',
            suppressSizeToFit: true,
            maxWidth: 135,
            cellRendererFramework: (params) => (
                <Button color='primary' onClick={() => {
                    if (params.data.compalintStatus !== 'Closed') {
                        UpdateComplaintDetails(params);
                    }
                }} disabled={params.data.compalintStatus === 'Closed'}>
                    Update
                </Button>
            )
        },
        {
            suppressSizeToFit: true,
            maxWidth: 135,
            cellRendererFramework: (params) => (
                <Button color='primary' onClick={() => {
                    if (params.data.compalintStatus !== 'Closed') {
                        CloseComplaintDetails(params);
                    }
                }} disabled={params.data.compalintStatus === 'Closed'}>
                    Close
                </Button>
            )
        },
        {
            headerName: 'Resolution',
            field: 'resolution',
            suppressSizeToFit: true,
            maxWidth: 125,
        },
        {
            headerName: 'Root Cause Analysis',
            field: 'rootCauseAnalysis',
            suppressSizeToFit: true,
            width: 220,
        },

        {
            headerName: 'Met By',
            field: 'roleName',
            suppressSizeToFit: true,
            width: 190,
        },
        {
            headerName: 'Status',
            field: 'compalintStatus',
            suppressSizeToFit: true,
            width: 110,
        },
        {
            headerName: "Received Date",
            field: 'complaintDate',
            suppressSizeToFit: true,
            width: 220
        },
        {
            headerName: "Received Time",
            field: 'time',
            suppressSizeToFit: true,
            width: 220
        },
        {
            headerName: "Department",
            field: "departmentName",
            suppressSizeToFit: true,
            maxWidth: 140
        },  
        // {
        //     headerName: 'Guest Type',
        //     field: "guestType",
        //     suppressSizeToFit: true,
        //     width: 150
        // },
        // {
        //     headerName: 'Comments',
        //     field: 'comments',
        //     suppressSizeToFit: true,
        //     width: 220,
        // },
    
      
       
    
    ]);


    const checkIn = watch('incomeDate');

    //Flatpickr condition for departure date
    const optionsToDate = {
        minDate: (checkIn === null ? arrivalDate : (Moment(String(new Date(checkIn))).format('YYYY-MM-DD'))) // Set the minimum date as fromDate or today if fromDate is not selected
    };



    // On select of guest modal
    const actionButton1 = (rowval) => {
        setGuestData(rowval.data.id)
        setGuest(rowval.data.s ? rowval.data.s + " " + rowval.data.f + " " + rowval.data.l : rowval.data.f + " " + rowval.data.l)
        setGuestID(rowval.data.guestID)
        setRoomNumber(rowval.data.roomNumber)
        setRoomID(rowval.data.roomID)
        setReservationModal(false)
    }


    // update complaint details
    const UpdateComplaintDetails = (rowval) => {
        fetch(API_URL + `/getComplaintDetailsBasedOnID?complaintID=${rowval.data.id}`)
            .then(result => result.json())
            .then(resp => {
                setComplaintData(resp['data'])
                setUpdateModal(true)
            })
    }


    // update complaint details
    const CloseComplaintDetails = (rowval) => {
        fetch(API_URL + `/getComplaintDetailsBasedOnID?complaintID=${rowval.data.id}`)
            .then(result => result.json())
            .then(resp => {
                setComplaintData(resp['data'])
                setCloseModal(true)
            })
    }


    // On select of department complaint set
    const handleSelectChanges = (event) => {
        if (event == null) {
            return
        }
        Roomarrs = []
        setValue('jobName', null)
        if (event) {
            setSelectedValues(event.value)
            let y = RoomDatas[event.value]
            for (let i = 0; i < 1; i++) {
                for (let j = 0; j < y.length; j++) {
                    const RoomNumbers = { value: y[j], label: y[j] }
                    Roomarrs.push(RoomNumbers)
                }
            }
        }
    }


    const handleChange = (selectedOption) => {
        setValue('jobName', selectedOption); // Assuming you are using react-hook-form
    };


    // Type of guest selection 
    const GuestSelection = (event) => {
        if (event == null) {
            setSelectTypeOfGuest(false)
            return
        }
        setSelectTypeOfGuest(true)
        fetch(API_URL + `/getReservationDetailsForGuestComplaint?status=${event.value}`)
            .then(result => result.json())
            .then(resp => {
                setReservationModal(true)
                setReservationData(resp['data'])
            })
    }


    // Type of guest selection 
    const GuestType = (event) => {
        setGuestType()
        setGuest()
        setRoomNumber()
        setReservationData()
        setGuestModalShow(false)
        setGuestModalShow1(false)
        setSelectTypeOfGuest(false)
        if (event !== null && event.value === 'Resident') {
            serResidentTrue(true)
            setNonResidentTrue(false)
            setGuestType(event.value)
            setGuestModalShow1(false)
            setGuestModalShow(true)
            setSelectTypeOfGuest(true)
            return;
        }
        else if (event !== null && event.value === 'Non-Resident') {
            serResidentTrue(false)
            setNonResidentTrue(true)
            setGuestType(event.value)
            setGuestModalShow(false)
            setGuestModalShow1(true)
            setSelectTypeOfGuest(true)
            return
        }
        else {
            setGuestType()
            setGuest()
            setReservationData()
            setGuestModalShow(false)
            setRoomNumber()
            setGuestModalShow1(false)
            setSelectTypeOfGuest(false)
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


    // On submit function
    const onSubmit = (data) => {
        if (SelectedValues === undefined) {
            return handleError("Please select department type")
        }
        if(Moment(String(new Date(data.complaintDate))).format('YYYY-MM-DD') === 'Invalid date'){
            return handleError('Please select the date')
        }
        else if (guestType === undefined) {
            return handleError("Please select guest type")
        }
        else if (selectTypeOfGuest === false || (guestType === 'Resident' && guestID == null)) {
            return handleError("Please select guest")
        }
        else if (data.risedTime === undefined) {
            return handleError("Please select the time")
        }
        const jsonData = JSON.stringify({
            departmentOption: SelectedValues,
            compaintName: data.jobName.value,
            reservationID: residentTrue === false ? null : guestData,
            sourceID: data.complaintSource.value,
            comments: data.description,
            status: StatusOptions[0].value,
            guestType: guestType,
            guestName: (residentTrue === false ? data.guestName : ''),
            time: data.risedTime,
            guestEmailID: (residentTrue === false ? data.emailID : ''),
            guestPhoneNumber: (residentTrue === false ? data.phoneNumber : ''),
            guestID: residentTrue === false ? null : guestID,
            roomID: residentTrue === false ? null : roomID,
            complaintDate:(Moment(String(new Date(data.complaintDate))).format('YYYY-MM-DD'))
        })

        fetch(API_URL + "/createNewGuestComplaint", {
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


    // On click reset function
    const handleReset = () => {
        reset({
            jobType: "",
            jobDepartment: "",
            jobName: '',
            floorNumber: '',
            roomNumber: '',
            isHighPriority: "",
            createdTime: '',
            description: '',
            createdBy: null
        })
    }


    //Success card
    const handleSuccess = () => {
        return MySwal.fire({
            title: 'Guest Complaint !!',
            text: 'Successfully raised guest complaint',
            icon: 'success',
        },
            // actionButton(false),
            setTimeout(() => { navigate('/dashboard/guestcomplaint') }, 1000)
        )
    }


    //AG-GRID default column defn
    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            autoHeight: true,
            wrapText: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ))


    //Search element
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById('filter-text-box1').value
        )
    }, [])


    const onFilterTextBoxChanged1 = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById('filter-text-box2').value
        )
    }, [])


    const toggle = id => {
        setOpen(prevOpen => {
            if (prevOpen.includes(id)) {
                return prevOpen.filter(item => item !== id);
            } else {
                return [...prevOpen, id];
            }
        });

    };


    function toggleModal() {
        setUpdateModal(!updateModal)
    }


    function toggleModal1() {
        setCloseModal(!closeModal)
    }


    return (
        <div>

            <div>
                <Accordion open={open} toggle={toggle}>
                    <AccordionItem>
                        <AccordionHeader targetId="1" className="d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">
                                <b>
                                    Guest Complaint Form
                                    <span style={{ fontSize: '0.7rem', verticalAlign: 'super', color: 'blue', marginLeft: '0.2rem' }}>
                                        Click here to open form
                                    </span>
                                </b>
                            </h4>
                        </AccordionHeader>
                        <AccordionBody accordionId="1">
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>

                                    {/* Department selection */}
                                    <Col md='3' sm='12' className='mb-1'>
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
                                                        required
                                                        isClearable
                                                        options={DepartmentOptions}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select')}
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
                                                    <Select
                                                        required
                                                        isClearable
                                                        options={Roomarrs}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select')}
                                                        onChange={handleChange}
                                                        {...field}
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
                                                render={({ }) => (
                                                    <Select
                                                        required
                                                        isClearable
                                                        options={GuestTypeSelection}
                                                        onChange={GuestType}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select')}
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
                                                    <Select
                                                        required
                                                        isClearable
                                                        options={RoomNumberOptions}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select')}
                                                        onChange={GuestSelection}
                                                    // {...field}

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
                                                            required
                                                            className={classnames('form-control')}
                                                            placeholder='Enter guest name' {...field}
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
                                                            // required
                                                            className={classnames('form-control')}
                                                            placeholder='Enter guest email id' {...field}
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
                                                            // required
                                                            className={classnames('form-control')}
                                                            placeholder='Enter guest mobile number' {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>
                                    }


                                    {/* Guest name */}
                                    {
                                        guestSet && guestModalShow === true &&
                                        <Col md='3' sm='12' className='mb-1'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='guestName'>
                                                    Guest Name
                                                </Label>
                                                <InputGroup className='input-group-merge'>
                                                    <Controller
                                                        id='guestName'
                                                        name='guestName'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                disabled
                                                                value={guestSet}
                                                                className={classnames('form-control')}
                                                            />
                                                        )}
                                                    />
                                                </InputGroup>
                                            </div>
                                        </Col>
                                    }


                                    {/* Room number */}
                                    {roomNumber && guestModalShow === true &&
                                        <Col md='3' sm='12' className='mb-1'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='guestRoomNumber'>
                                                    Room Number
                                                </Label>
                                                <InputGroup className='input-group-merge'>
                                                    <Controller
                                                        id='guestRoomNumber'
                                                        name='guestRoomNumber'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                disabled
                                                                value={roomNumber}
                                                                className={classnames('form-control')}
                                                            />
                                                        )}
                                                    />
                                                </InputGroup>
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
                                                        isClearable
                                                        required
                                                        options={SourceOptions}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select')}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>



                                    {/* Complaint Rised time */}
                                    <Col md='3' sm='8' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='risedTime'>
                                                Time <span style={{ color: 'red' }}> * </span>
                                            </Label>
                                            <Controller
                                                required
                                                control={control}
                                                id='risedTime'
                                                name='risedTime'
                                                render={({ field }) => <Input type='time' placeholder='Enter time' {...field} />}
                                            />
                                        </div>
                                    </Col>


                                    {arrivalDate && <Col md='3' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='complaintDate'>
                                                Complaint Date
                                            </Label>
                                            <Controller
                                                control={control}
                                                id='complaintDate'
                                                name='complaintDate'
                                                defaultValue={arrivalDate}
                                                render={({ field }) => (
                                                    <Flatpickr
                                                        required
                                                        options={options}
                                                        placeholder='YYYY-MM-DD '
                                                        className={classnames('form-control')}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>}


                                    {/* Met by option selection */}
                                    {/* <Col md='3' sm='12' className='mb-1'>
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
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select')}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col> */}


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


                                    {/* Service Recovery options */}
                                    {/* <Col md='3' sm='12' className='mb-1'>
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
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select')}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col> */}


                                    {/* Recovery Chargable options */}
                                    {/* <Col md='3' sm='12' className='mb-1'>
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
                                                        options={RecoveryChargebleOption}
                                                        onChange={ChargableRecovery}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select')}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col> */}


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
                                                        // pattern='^(1[6-9]|[2-9]\d+|\d{3,})$'
                                                        // title='Please enter a number above 15'
                                                        placeholder='Enter chargable amount' {...field} />}
                                            />
                                        </div>
                                    </Col>}


                                    {/* resolution */}
                                    {/* <Col md='3' sm='12'>
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
                                                        type='textarea'
                                                        placeholder='Enter resolution' {...field} />}
                                            />
                                        </div>
                                    </Col> */}


                                    {/* root cause analysis */}
                                    {/* <Col md='3' sm='12'>
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
                                                        // required
                                                        type='textarea'
                                                        placeholder='Enter root cause analysis' {...field} />}
                                            />
                                        </div>
                                    </Col> */}


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
                                                        {...field}
                                                        className={classnames('form-control')}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    <div className="d-flex">
                                        <Button className="me-1" type="submit" color="primary">
                                            Submit
                                        </Button>
                                        <Button
                                            outline
                                            color="secondary"
                                            type="reset"
                                            onClick={handleReset}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </Row>
                            </Form>
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </div>


            <br></br>

            <div>
                <Card>
                    <CardBody>
                        <Form onSubmit={handleSubmit(GetComplaintList)}>
                            <Row>
                                <Col md='4' sm='12'>
                                    <div className='mb-1'>
                                        <Label className='form-label' for='incomeDate'>
                                            From Date <spam style={{ color: 'red' }}>*</spam>
                                        </Label>
                                        <Controller
                                            control={control}
                                            id='incomeDate'
                                            name='incomeDate'
                                            render={({ field }) => (
                                                <Flatpickr
                                                    required
                                                    {...field}
                                                    // options={options1}
                                                    placeholder='YYYY-MM-DD '
                                                    className={classnames('form-control')}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                                <Col md='4' sm='12'>
                                    <div className='mb-1'>
                                        <Label className='form-label' for='outGoData'>
                                            To Date <spam style={{ color: 'red' }}>*</spam>
                                        </Label>
                                        <Controller
                                            control={control}
                                            id='outGoData'
                                            name='outGoData'
                                            render={({ field }) => (
                                                <Flatpickr
                                                    required
                                                    {...field}
                                                    options={optionsToDate}
                                                    placeholder='YYYY-MM-DD '
                                                    className={classnames('form-control')}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <div align='end'>
                                <Button outline color='secondary' className='me-1' onClick={resetData}>
                                    Reset
                                </Button>
                                <Button color='primary' className='me-1' type='submit'>
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </div>


            <Modal isOpen={reservationModal} toggle={() => setReservationModal(!reservationModal)} className="modal-xl">
                <ModalHeader toggle={() => setReservationModal(!reservationModal)} className="modal-xl">
                    Reservation Data
                </ModalHeader>
                <ModalBody className="modal-xl">

                    <Col md='3' sm='12' className='me-1'>
                        <Label className='form-label'>
                            Search
                        </Label>
                        <Input
                            type="text"
                            id="filter-text-box1"
                            placeholder="Filter..."
                            onInput={onFilterTextBoxChanged}
                        />
                    </Col>

                    <br></br>
                    {
                        reservationData &&
                        <div className="ag-theme-alpine" style={{ height: 550, width: 1000 }}>
                            <AgGridReact
                                ref={gridRef}
                                rowData={reservationData}
                                columnDefs={columnDefs2}
                                animateRows={true}
                                rowSelection="multiple"
                                paginationPageSize={10}
                                pagination={true}
                                defaultColDef={defaultColDef}
                                headerColor="ddw-primary"
                            />
                        </div>}
                    <br></br><br />
                </ModalBody>
            </Modal>


            {updateModal === true && complaintData &&
                <Modal isOpen={complaintData} toggle={() => setComplaintData(!complaintData)} className="modal-xl">
                    <ModalHeader toggle={() => setComplaintData(!complaintData)} className="modal-xl">
                        Update Complaint Page
                    </ModalHeader>
                    <ModalBody className="modal-xl">
                        <UpdateComplaint data={complaintData} toggleModal={toggleModal} />
                        <br></br>
                        <br></br>
                    </ModalBody>
                </Modal>
            }


            {closeModal === true && complaintData &&
                <Modal isOpen={complaintData} toggle={() => setComplaintData(!complaintData)} className="modal-xl">
                    <ModalHeader toggle={() => setComplaintData(!complaintData)} className="modal-xl">
                        Update Complaint Page
                    </ModalHeader>
                    <ModalBody className="modal-xl">
                        <CloseComplaint data={complaintData} toggleModal={toggleModal1} />
                        <br></br>
                        <br></br>
                    </ModalBody>
                </Modal>
            }


            <Col md='3' sm='12' className='me-1'>
                <Label className='form-label'>
                    Search
                </Label>
                <Input
                    type="text"
                    id="filter-text-box2"
                    placeholder="Filter..."
                    onInput={onFilterTextBoxChanged1}
                />
            </Col>
            <br></br>
            {
                complaintList &&
                <div className="ag-theme-alpine" style={{ height: 550, width: 1700 }}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={complaintList}
                        columnDefs={columnDefs3}
                        animateRows={true}
                        rowSelection="multiple"
                        paginationPageSize={10}
                        pagination={true}
                        defaultColDef={defaultColDef}
                        headerColor="ddw-primary"
                    />
                </div>}
        </div>
    )
}


export default Modalform
