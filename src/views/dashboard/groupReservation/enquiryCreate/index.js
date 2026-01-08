import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'

import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Moment from 'moment'
import { useNavigate } from "react-router-dom"

// ** Reactstrap Imports
import { AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalHeader, ModalBody, Card, CardBody, Row, Col, Input, Form, Label, Accordion } from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import API_URL from '../../../../config'

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";


sessionStorage.removeItem('groupReservationID')
import CompanyProfile from './companyProfile/index'
import Booker from './companyProfile/booker'
import PackageCode from './packageConfig'


const defaultValues = {
    checkIn: null,
    checkOut: null,
    adult: null,
    children: null,
    cutof: null,
    quantity: null,
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


let paymentName = [
    fetchx(API_URL + '/getPayment?hotelID=1')
        .then(result => result.json())
        .then(resp => {
            paymentName = resp['data']
        })
]


let sourceCode = [
    fetchx(API_URL + '/getSourceName?hotelID=1')
        .then(result => result.json())
        .then(resp => {
            sourceCode = resp['data']
        })
]


let marketCode = [
    fetchx(API_URL + '/getMarketName?hotelID=1')
        .then(result => result.json())
        .then(resp => {
            marketCode = resp['data']
        })
]


let Agent = [
    fetchx(API_URL + '/getAgentList?hotelID=1')
        .then(result => result.json())
        .then(resp => {
            Agent = resp['data']
        })
]


let PackageCodes = [
    fetchx(API_URL + '/getPackageForGroup')
        .then(result => result.json())
        .then(resp => {
            PackageCodes = resp['data']
        })
]


let accountManagerList = [
    fetchx(API_URL + '/getAccountManagerList', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
    }).then(result => result.json())
        .then(resp => {
            accountManagerList = resp['data']
        })
]


let BookerList = [
    fetchx(API_URL + '/getAllBookerList', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
    }).then(result => result.json())
        .then(resp => {
            BookerList = resp['data']
        })
]


let OriginOptions = [
    fetchx(API_URL + '/getOriginOptions?hotelID=1')
        .then(result => result.json())
        .then(resp => {
            OriginOptions = resp['data']
        })
]


let ReservationTypeOptions = [
    fetchx(API_URL + '/getReservationTypes?hotelID=1')
        .then(result => result.json())
        .then(resp => {
            ReservationTypeOptions = resp['data']
        })
]


const GroupReservation = () => {

    const navigate = useNavigate()
    const [open, setOpen] = useState('1')
    const [data, setData] = useState(null)
    const { reset1, handleSubmit, control, watch, errors } = useForm({ defaultValues })
    const [arrivalDate, setArrivalDate] = useState();
    const [departureDate, setDepartureDate] = useState()
    const [yesterday, setYesterday] = useState()
    const gridRef1 = useRef()
    const [rowData, setRowData] = useState()
    const [rowData1, setRowData1] = useState()
    const [basicModal, setBasicModal] = useState(false)
    const [rateCodeModal, setRateCodeModal] = useState(false)
    const [agentModal, setAgentModal] = useState(false)
    const [companyModal, setCompanyModal] = useState(false)
    const [companyProfile, setCompanyProfile] = useState(false)
    const [selectedBooker, setSelectedBooker] = useState({});
    const [selectedRateCode, setSelectedRateCode] = useState({});
    const [selectedAgent, setSelectedAgent] = useState({});
    const [selectedCompany, setSelectedCompany] = useState({});
    const [agentList, getAgentList] = useState()
    const [bookerList, getBookerList] = useState()
    const [companyProfile2, setCompanyProfile2] = useState(false)
    const [defaultOptionsSource, setDefaultOptionsSource] = useState([]);
    const [defaultOptionsMarket, setDefaultOptionsMarket] = useState([]);
    const [selectedOptionSource, setSelectedOptionSource] = useState(null);
    const [selectedOptionMarket, setSelectedOptionMarket] = useState(null);
    const [checkIndateState, setCheckInDateState] = useState();
    const [checkOutdateState, setCheckOutDateState] = useState();
    const [adultCountState, setAdultCountState] = useState();
    const [childrenCountState, setChildrenCountState] = useState();
    const [cutOfDatedateState, setCutOfDateState] = useState();
    const [numberOfRoomsState, setNumberOfRoomsState] = useState();
    const [latestInventory, setLatestInventory] = useState();
    const [options2, setOptions] = useState();
    const [options3, setOptions2] = useState();
    const gridRef = useRef(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
    const [selectionForCheck, setSelectionForCheck] = useState('');
    const [extraName, setExtraName] = useState();
    const [selectedOptionExtras, setSelectedOptionExtras] = useState(null);
    const [Features, setFeatureOptions] = useState(null);
    const [packageModal, setPackageModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState();
    const [openPackageModal, setOpenPackageModal] = useState(false)
    const [packageData, setPackageData] = useState()
    const [groupNameModal, setGroupNameModal] = useState(false);
    const [groupNameData, setGroupNameData] = useState()
    const [selectedGroupName, setSelectedGroupName] = useState();
    const [openGroupModal, setOpenGroupModal] = useState(false)


    const toggle = id => {
        open === id ? setOpen() : setOpen(id)
    }




    const checkIn = watch('coming');
    const checkIn1 = watch('incomeDate')
    const shStartDate = watch('shStartDate');
    const shEndDate = watch('shEndDate')
    //Flatpickr condition for Arrival date
    const options = {
        minDate: arrivalDate
    }


    //Flatpickr condition for Arrival date
    // const options1 = {
    //     minDate: arrivalDate
    // }


    // //Flatpickr condition for departure date
    // const optionsToDate = {
    //     minDate: (checkIn === null ? arrivalDate : (Moment(String(new Date(checkIn))).format('YYYY-MM-DD'))) // Set the minimum date as fromDate or today if fromDate is not selected
    // };

    // Flatpickr condition for Arrival Date (coming)
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
        minDate: arrivalDate
    }


    //Flatpickr condition for shoulder end date
    const optionsShoulderEnd = {
        minDate: (shStartDate === null ? arrivalDate : (Moment(String(new Date(shStartDate))).format('YYYY-MM-DD'))) // Set the minimum date as fromDate or today if fromDate is not selected
    };

    console.log(optionsShoulderEnd)

    //Flatpickr condition for departure date
    const optionsToDate1 = {
        minDate: (checkIn1 === null ? arrivalDate : (Moment(String(new Date(checkIn1))).format('YYYY-MM-DD'))) // Set the minimum date as fromDate or today if fromDate is not selected
    };


    // Flatpickr condition for cut of date
    const optionForYesterDay = {
        minDate: (arrivalDate),
        maxDate: ((checkIn == undefined || checkIn == arrivalDate) ? arrivalDate : (Moment(String(new Date(checkIn))).subtract(1, 'days').format('YYYY-MM-DD')))
    }


    // Booker selection
    const onBookerSelect = (rowData) => {
        setSelectedBooker(rowData);
        setBasicModal(false);
    };


    // Booker selection
    const onRateCodeSelect = (rowData) => {
        setSelectedRateCode(rowData);
        setRateCodeModal(false);
    };


    // company selection
    const onCompanySelect = (rowData) => {
        setSelectedCompany(rowData);
        setCompanyModal(false);
    };


    // Booker selection
    const onAgentSelect = (rowData) => {
        setSelectedAgent(rowData);
        setAgentModal(false);
    };


    // company selection
    const onPackageSelect = (rowData) => {
        setSelectedPackage(rowData);
        setPackageModal(false);
    };




    // To clear selected agent
    const handleAgentClear = () => {
        setSelectedAgent()
    };


    // To clear selected booker
    const handleBookerClear = () => {
        setSelectedBooker()
    };




    // To clear selected booker
    const handlePackageClear = () => {
        setSelectedPackage()
    };


    // To clear selected booker
    const handleRateCodeClear = () => {
        setSelectedRateCode()
    };


    // To clear selected company
    const handleCompanyClear = () => {
        setSelectedCompany()
    };


    //on click of new booker profile
    const onclickButton = () => {
        setCompanyProfile(true)
    }


    //on click of new agent profile
    const onclickButton2 = () => {
        setCompanyProfile2(true)
    }


    //on click of new company profile
    const onclickButton3 = () => {
        setCompanyProfile(true)
    }


const onGroupSelect = (rowData) => {
        setSelectedGroupName(rowData);
        setGroupNameModal(false);
    };

    //on click of new company profile
    const onclickButton4 = () => {
        setOpenPackageModal(true)
    }

 const handleGroupNameClear = () => {
        setSelectedGroupName()
    };

    //on click of new company profile
    const onclickButton5 = () => {
        setCompanyProfile(true)
    }


    //ag-grid cell clcked value
    const cellClickedListener = useCallback(event => {
    })


    //ag-grid column defn
    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ))


    // Ag-grid column of agent
    const [columnDefsAgent] = useState([
        { headerName: 'Agent Name', field: 'accountName', width: 250 },
        { headerName: 'Address', field: 'address', width: 250 },
        {
            headerName: "Action",
            maxWidth: 140,
            cellRenderer: (params) => {
                return (
                    <Button
                        color='primary'
                        onClick={() => onAgentSelect(params.data)}>
                        Select
                    </Button>
                )
            }
        },
        { headerName: 'Email ID', field: 'email', width: 230 },
    ])


    // Ag-grid column of company
    const [columnDefsCompany] = useState([
        { headerName: 'Company Name', field: 'accountName', width: 300 },
        {
            headerName: "Action",
            maxWidth: 140,
            cellRenderer: (params) => {
                return (
                    <Button
                        color='primary'
                        onClick={() => onCompanySelect(params.data)}>
                        Select
                    </Button>
                )
            }
        },
        { headerName: 'Company Address', field: 'address', width: 300 },
        { headerName: 'Email ID', field: 'email', width: 300 },
        { headerName: 'Phone Number', field: 'phoneNumber', width: 200 },
        { headerName: 'GSTID', field: 'gstID', width: 300 },
    ])


    // Ag-grid column of company
    const [columnDefsPackage] = useState([
        { headerName: 'Package Code', field: 'packageCode', width: 145 },
        { headerName: 'Description', field: 'description', width: 300 },
        {
            headerName: "Action",
            maxWidth: 140,
            cellRenderer: (params) => {
                return (
                    <Button
                        color='primary'
                        onClick={() => onPackageSelect(params.data)}>
                        Select
                    </Button>
                )
            }
        },
        { headerName: 'Start Date', field: 'beginSellDate', width: 140 },
        { headerName: 'End Date', field: 'endSellDate', width: 140 },
        { headerName: 'Breakfast', field: 'breakfast', width: 140 },
        { headerName: 'Lunch', field: 'lunch', width: 140 },
        { headerName: 'Dinner', field: 'dinner', width: 140 },
        { headerName: 'Total', field: 'basePrice', width: 140 },

    ])


    // Ag-grid column of company
    const [columnDefsGroup] = useState([
        { headerName: 'Group Name', field: 'accountName', width: 250 },
        { headerName: 'Email ID', field: 'email', width: 200 },
        {
            headerName: "Action",
            maxWidth: 140,
            cellRenderer: (params) => {
                return (
                    <Button
                        color='primary'
                        onClick={() => onGroupSelect(params.data)}>
                        Select
                    </Button>
                )
            }
        },
        { headerName: 'Address', field: 'address', width: 250 },
        { headerName: 'GST ID', field: 'gstID', width: 200 },
        { headerName: 'Phone Number', field: 'phoneNumber', width: 200 },

    ])


    // Ag-grid column of booker
    const [columnDefs] = useState([
        { headerName: 'Booker Name', field: 'name', width: 200 },
        { headerName: 'Company Name', field: 'accountName', width: 300 },
        {
            headerName: "Action",
            maxWidth: 140,
            cellRenderer: (params) => {
                return (
                    <Button
                        color='primary'
                        onClick={() => onBookerSelect(params.data)}>
                        Select
                    </Button>
                )
            }
        },
        { headerName: 'Email ID', field: 'emailID', width: 300 },
        { headerName: 'Booker Address', field: 'address', width: 300 },
    ])


    //Ag-grid column definition
    const [columnDefsRateCode] = useState([
        { headerName: 'Company Name', field: 'accountName', maxWidth: 300 },
        { headerName: 'Rate Code', field: 'rateCodeIDs', maxWidth: 300 },
        {
            headerName: "Action",
            maxWidth: 140,
            cellRenderer: (params) => {
                return (
                    <Button
                        color='primary'
                        onClick={() => onRateCodeSelect(params.data)}>
                        Select
                    </Button>
                )
            }
        },
        { headerName: 'Address Line 1', field: 'addressLine1', maxWidth: 300 },
        { headerName: 'Address Line 2', field: 'addressLine2', maxWidth: 300 },
        { headerName: 'City', field: 'city', maxWidth: 110 },
        { headerName: 'State', field: 'state', maxWidth: 110 },
        { headerName: 'Country', field: 'country', maxWidth: 110 },
        { headerName: 'GSTID', field: 'gstID', maxWidth: 300 },

        { headerName: 'Mobile Number', field: 'phoneNumber', maxWidth: 300 },
        { headerName: 'Email ID', field: 'email', maxWidth: 300 },
        // {
        //   cellRenderer: () => {
        //     return (<Button color='primary' onClick={() => setAssign(!assign)} >View Profile</Button>)
        //   }
        // }
    ])


    const [columnDefs2] = useState([
        {
            headerName: "Room Type",
            field: "roomType",
            suppressSizeToFit: true,
            maxWidth: 140
        },
        {
            headerName: "Availability",
            field: "min_availability",
            suppressSizeToFit: true,
            maxWidth: 130,
        },

    ]);


    // Agent onsubmit modal close
    function toggleModal() {
        fetchx(API_URL + '/getAgentList?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                getAgentList(resp['data'])
            })

        fetchx(API_URL + `/getCompanyNames`)
            .then(result => result.json())
            .then(rowData => {
                setRowData(rowData['data'])
            })


        fetchx(API_URL + `/getGroupsFromAccounts`)
            .then(result => result.json())
            .then(rowData => {
                setGroupNameData(rowData['data'])
            })

        setCompanyProfile(!companyProfile)

    }


    // Agent onsubmit modal close
    function packageToggle() {
        fetchx(API_URL + '/getPackageForGroup')
            .then(result => result.json())
            .then(resp => {
                setPackageData(resp['data'])
            })

        setOpenPackageModal(!openPackageModal)

    }


    // booker onsubmit modal close
    function toggleModal2() {
        fetchx(API_URL + '/getAllBookerList', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
        }).then(result => result.json())
            .then(resp => {
                getBookerList(resp['data'])
            })

        setCompanyProfile2(!companyProfile2)
    }


    //API to get company list
    useEffect(() => {

     



        fetchx(API_URL + `/getCompanyNames`)
            .then(result => result.json())
            .then(rowData => {
                setRowData(rowData['data'])
            })

        fetchx(API_URL + '/getAgentList?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                getAgentList(resp['data'])
            })

        fetchx(API_URL + '/getAllBookerList', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
        }).then(result => result.json())
            .then(resp => {
                getBookerList(resp['data'])
            })

        fetchx(API_URL + `/getCompanyList?hotelID=1`)
            .then(result => result.json())
            .then(rowData => {
                setRowData1(rowData['data'])
            })

        fetchx(API_URL + '/getExtraDescription?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setExtraName(resp['data'])
            })

        fetchx(API_URL + '/getPrefernceOptions?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setFeatureOptions(resp['data'])
            })

        fetchx(API_URL + '/getPackageForGroup')
            .then(result => result.json())
            .then(resp => {
                setPackageData(resp['data'])
            })


        fetchx(API_URL + `/getGroupsFromAccounts`)
            .then(result => result.json())
            .then(rowData => {
                setGroupNameData(rowData['data'])
            })
    }, [])


    // Default dates setting based on business date
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
                const Yesterday = new Date(today);
                Yesterday.setDate(today.getDate() - 1);
                tomorrow.setDate(today.getDate() + 1);
                setYesterday(Yesterday)
                setDepartureDate(tomorrow)
                setArrivalDate((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
            })
    }, [])


    // Default source
    useEffect(() => {
        const SourceParams = JSON.stringify({
            rateCodeID: sessionStorage.getItem('rateCodeCorporate'),
            hotelID: 1
        })

        const fetchData = async () => {
            try {
                const response = await fetchx(API_URL + '/getSourceCode', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: SourceParams
                });

                if (response.ok) {
                    const data = await response.json();
                    const defaultOptionsFromAPI = data['data'];
                    setDefaultOptionsSource(defaultOptionsFromAPI);
                    if (defaultOptionsFromAPI.length > 0) {
                        setSelectedOptionSource(defaultOptionsFromAPI);
                    }
                } else { }
            }
            catch (error) { }
        };

        fetchData();
    }, [sessionStorage.getItem('rateCodeCorporate')]);


    // Default market
    useEffect(() => {

        const MarketParams = JSON.stringify({
            rateCodeID: sessionStorage.getItem('rateCodeCorporate'),
            hotelID: 1
        })
        const fetchData = async () => {
            try {
                const response = await fetchx(API_URL + '/getDefaultMarketCode', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: MarketParams
                });

                if (response.ok) {
                    const data = await response.json();
                    const defaultOptionsFromAPI = data['data'];
                    setDefaultOptionsMarket(defaultOptionsFromAPI);
                    if (defaultOptionsFromAPI.length > 0) {
                        setSelectedOptionMarket(defaultOptionsFromAPI);
                    }
                } else { }
            } catch (error) { }
        };

        fetchData();
    }, [sessionStorage.getItem('rateCodeCorporate')]);


    // error handling
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


    // On success modal open
    const handleSuccess = (message) => {
        const swal = MySwal.fire({
            text: message,
            icon: 'success',
            showConfirmButton: false // Hide the confirm button
        });

        setTimeout(() => {
            swal.close(); // Close the success modal
            setOpen('2'); // Open the next accordion
        }, 2000);
    }


    // On success modal open
    const handleFinalSubmit = (message) => {
        return MySwal.fire({
            title: 'Group Reservation',
            text: message,
            icon: 'success',
        }),
            setTimeout(() => { navigate('/dashboard/groupreservation/allgroupreservations') }, 1000)
    }


    //Search element
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef1.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        )
    }, [])

    

    //On submit function
    const onSubmit = data => {

        if (data.coming.length === 0) {
            return handleError("Please select the arrival date")
        }
        if (data.departure.length === 0) {
            return handleError("Please select the departure date")
        }
        if ((Moment(String(new Date(data.departure))).format('YYYY-MM-DD')) < (Moment(String(new Date(data.coming))).format('YYYY-MM-DD'))) {
            return handleError("Please select the departure date")
        }
        setData(data)
        {
            // let adultCount = data.adultCount.value;
            // let childCount = data.childCount.value;
            // let count = 3;
            // if (data.adultCount.label === '3') {
            //     count = 3;
            // }
            // if (data.adultCount.label === '2') {
            //     count = 4
            // }
            // let totalCount = Number(adultCount) + Number(childCount);
            // if (totalCount > count) {
            //     let message = '<b>You have Exceeded PAX Count. \n Please Select adults or children properly. </b> \n (You can select maximum 2 adults and 2 children or maximum 3 adults)'
            //     return handleError(message)
            // }
            // else {
            const availabilityCheck = JSON.stringify({
                shoulderStartDate: (Moment(String(new Date(data.shStartDate))).format('YYYY-MM-DD')),
                shoulderEndDate: (Moment(String(new Date(data.shEndDate))).format('YYYY-MM-DD')),
                checkInDate: (Moment(String(new Date(data.coming))).format('YYYY-MM-DD')),
                checkOutDate: (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')),
                cutOfDate: (Moment(String(new Date(data.cutOfDate))).format('YYYY-MM-DD')),
                adults: data.adultCount.value,
                children: data.childCount.value,
                numberOfRooms: Number(data.roomQuantity),
            })

            setCheckInDateState(Moment(String(new Date(data.coming))).format('YYYY-MM-DD'))
            setCheckOutDateState(Moment(String(new Date(data.departure))).format('YYYY-MM-DD'))
            setCutOfDateState(Moment(String(new Date(data.cutOfDate))).format('YYYY-MM-DD'))
            setAdultCountState(data.adultCount.value)
            setChildrenCountState(data.childCount.value)
            setNumberOfRoomsState(Number(data.roomQuantity))

                fetchx(API_URL + "/checkAvailabilityForGroupReservation", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: availabilityCheck
                }).then((res) => res.json())
                    .then(postres => {
                        if (postres['data'] == 1) {
                            MySwal.fire({
                                title: "Confirmation Required",
                                text: "Rooms are available, Do you want to continue?",
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
                                    handleSuccess("Please proceed to make a booking.")
                                }
                                else {

                                }
                            })
                        }
                        else {
                            handleError(postres['data'])
                        }
                    })
            // }
        }
    }


    //On submit function for other details
    const submitExtraDetails = data => {

        if (selectionForCheck == 'Cash' || selectionForCheck == 'BTC') {
            data.cardNumber = ''
            data.cardHolderName = ''
            data.expiryDate = ''
            data.transactionID = ''
            data.authID = ''
            data.amount = 0.00
        }
        if (selectionForCheck == 'ONLINE') {
            data.cardNumber = ''
            data.cardHolderName = ''
            data.expiryDate = ''
            data.authID = ''
            data.amount = 0.00
        }
        if (selectionForCheck == 'AMEX' || selectionForCheck == 'Credit Card') {
            data.transactionID = ''
        }

        const otherDetails = JSON.stringify({
            shoulderStartDate: (Moment(String(new Date(data.shStartDate))).format('YYYY-MM-DD')),
            shoulderEndDate: (Moment(String(new Date(data.shEndDate))).format('YYYY-MM-DD')),
            groupID: selectedGroupName.companyid,
            checkInDate: checkIndateState,
            checkOutDate: checkOutdateState,
            cutOfDate: cutOfDatedateState,
            adults: adultCountState,
            children: childrenCountState,
            numberOfRooms: numberOfRoomsState,
            groupName: selectedGroupName.accountName,
            reservationType: data.resTypeName.value,
            paymentType: selectedOption,
            // roomRate: data.rate,
            companyName: (selectedCompany !== undefined ? (selectedCompany.companyid || sessionStorage.getItem('companyName')) : null),
            sourceName: (selectedOptionSource.length === undefined ? selectedOptionSource.value : selectedOptionSource[0].value),
            marketName: (selectedOptionMarket.length === undefined ? selectedOptionMarket.value : selectedOptionMarket[0].value),
            originName: (data.originName === undefined ? null : data.originName.value),
            eta: data.eta,
            etd: data.etd,
            agentName: (selectedAgent !== undefined ? selectedAgent.companyid : null),
            accountManagerName: (data.AccountManager === undefined ? null : data.AccountManager.value),
            // packageName: data.packageID.value,
            bookerName: (selectedBooker !== undefined ? selectedBooker.id : null),
            comments: (data.comment1 || ''),
            billingInstructions: (data.billingInstructions || ''),
            cardNumber: data.cardNumber,
            cardHolderName: data.cardHolderName,
            expiryDate: (Moment(String(new Date(data.expiryDate))).format('YYYY-MM')),
            transactionID: data.transactionID,
            authID: data.authID,
            amount: data.amount,
            extraDesc: selectedOptionExtras,
            features: (data.features === undefined ? null : data.features),
         //   accountID: selectedGroupName.companyid
        })

        fetchx(API_URL + "/createEnqiryForGroupReservation", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: otherDetails
        }).then((res) => res.json())
            .then(postres => {
                if (postres.statusCode == 200) {
                    handleFinalSubmit(postres.message)
                }
                else {
                    handleError(postres['data'])
                }
            })
    }


    //Reset button
    const handleReset1 = () => {
        window.location.reload()
    }


    const getCurrentInventory = data => {
        let arrivalDate = (Moment(String(new Date(data.incomeDate))).format('YYYY-MM-DD'))
        let departureDate = (Moment(String(new Date(data.outGoData))).format('YYYY-MM-DD'))
        fetchx(API_URL + `/getLatestInventory?arrivalDate=${arrivalDate}&departureDate=${departureDate}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            // body: availabilityCheck
        }).then((res) => res.json())
            .then(postres => {
                setLatestInventory(postres['data'])
            })
    }


    //Handling the dropdown change regarding payment
    const handleOptionChange = (event) => {
        if (event) {
            sessionStorage.setItem('paymentType', event.label)
            setSelectedOption(event.value);
            setSelectedPaymentOption(event.paymentMode)
            setSelectionForCheck(event.label)
        }
        else {
            setSelectedOption('')
        }
    };

    return (
        <div>

            {/* Agent modal */}
            <Modal isOpen={companyProfile} toggle={() => setCompanyProfile(!companyProfile)} className='modal-xl'>
                <ModalHeader toggle={() => setCompanyProfile(!companyProfile)}>Company Profile</ModalHeader>
                <ModalBody>
                    <CompanyProfile toggleModal={toggleModal} />
                </ModalBody>
            </Modal>


            {/* Booker modal */}
            <Modal isOpen={companyProfile2} toggle={() => setCompanyProfile2(!companyProfile2)} className='modal-lg'>
                <ModalHeader toggle={() => setCompanyProfile2(!companyProfile2)}>Booker</ModalHeader>
                <ModalBody>
                    <Booker toggleModal2={toggleModal2} />
                </ModalBody>
            </Modal>


            {/* Company modal */}
            <Modal isOpen={companyProfile} toggle={() => setCompanyProfile(!companyProfile)} className='modal-xl'>
                <ModalHeader toggle={() => setCompanyProfile(!companyProfile)}>Company Profile</ModalHeader>
                <ModalBody>
                    <CompanyProfile toggleModal={toggleModal} />
                </ModalBody>
            </Modal>


            {/* Package Modal */}
            <Modal isOpen={openPackageModal} toggle={() => setOpenPackageModal(!openPackageModal)} className='modal-xl'>
                <ModalHeader toggle={() => setOpenPackageModal(!openPackageModal)}>Package Addition</ModalHeader>
                <ModalBody>
                    <PackageCode packageToggle={packageToggle} />
                </ModalBody>
            </Modal>


            {/* Group modal */}
            <Modal isOpen={openGroupModal} toggle={() => setOpenGroupModal(!openGroupModal)} className='modal-xl'>
                <ModalHeader toggle={() => setOpenGroupModal(!openGroupModal)}>Company Profile</ModalHeader>
                <ModalBody>
                    <CompanyProfile toggleModal={toggleModal} />
                </ModalBody>
            </Modal>


            <div align='end'>
                <Button color='primary' className='me-1' onClick={() => { setOptions(!options2) }}>
                    Check Availability
                </Button>
            </div>


            {/* Check availability between dates */}
            <Modal isOpen={options2} toggle={() => setOptions(!options2)} className="modal-lg">
                <ModalHeader toggle={() => setOptions(!options2)} className="modal-lg">
                    Availability check
                </ModalHeader>
                <ModalBody className="modal-lg">
                    <Card>
                        <CardBody>
                            <Form onSubmit={handleSubmit(getCurrentInventory)}>
                                <br></br>
                                <Row>
                                    {
                                        arrivalDate !== undefined &&
                                        <Col md='4' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='incomeDate'>
                                                    Arrival Date <spam style={{ color: 'red' }}>*</spam>
                                                </Label>
                                                <Controller
                                                    control={control}
                                                    id='incomeDate'
                                                    name='incomeDate'
                                                    defaultValue={arrivalDate}
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
                                        departureDate !== undefined &&
                                        <Col md='4' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='outGoData'>
                                                    Departure Date <spam style={{ color: 'red' }}>*</spam>
                                                </Label>
                                                <Controller
                                                    control={control}
                                                    id='outGoData'
                                                    name='outGoData'
                                                    defaultValue={departureDate}
                                                    render={({ field }) => (
                                                        <Flatpickr
                                                            required
                                                            {...field}
                                                            options={optionsToDate1}
                                                            placeholder='YYYY-MM-DD '
                                                            className={classnames('form-control', {
                                                                'is-invalid': data !== null && data.outGoData === null
                                                            })}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>
                                    }
                                </Row>
                                <div align='end'>
                                    <Button color='primary' className='me-1' type='submit' onClick={() => { setOptions2(!options3) }}>
                                        Check Availability
                                    </Button>
                                </div>
                            </Form>
                            <br></br>
                            <br />
                            {
                                latestInventory &&
                                <div className="ag-theme-alpine" style={{ height: 400, width: 450 }}>
                                    <p>     Total Availability : {latestInventory[0].total_min_availability}</p>
                                    <AgGridReact
                                        ref={gridRef}
                                        rowData={latestInventory}
                                        columnDefs={columnDefs2}
                                        animateRows={true}
                                        rowSelection="multiple"
                                        paginationPageSize={10}
                                        pagination={true}
                                        defaultColDef={defaultColDef}
                                        headerColor="ddw-primary"
                                    />
                                </div>}
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>

            <br></br>
            <br></br>

            {/* enquriy card*/}
            <Card>
                <Accordion className='accordion-margin' open={open} toggle={toggle}>
                    <div>

                        {/* Arrival Details */}
                        <AccordionItem open={open}>
                            <AccordionHeader targetId='1'> <h4><b>Arrival Details</b></h4></AccordionHeader>
                            <AccordionBody accordionId='1'>
                                <div>
                                    <Card>
                                        <CardBody>
                                            <Form onSubmit={handleSubmit(onSubmit)}>
                                                <Row>
                                                    <Row>
                                                        <Col md="6" sm="12">
                                                            {
                                                                arrivalDate !== undefined &&
                                                                // <Col md='3' sm='12'>
                                                                <div className='mb-1'>
                                                                    <Label className='form-label' for='shStartDate'>
                                                                        Shoulder Start Date <spam style={{ color: 'red' }}>*</spam>
                                                                    </Label>
                                                                    <Controller
                                                                        control={control}
                                                                        id='shStartDate'
                                                                        name='shStartDate'
                                                                        defaultValue={arrivalDate}
                                                                        render={({ field }) => (
                                                                            <Flatpickr
                                                                                required
                                                                                {...field}
                                                                                options={optionsShoulderStart}
                                                                                placeholder='YYYY-MM-DD '
                                                                                className={classnames('form-control')}
                                                                            />
                                                                        )}
                                                                    />
                                                                </div>
                                                            }
                                                        </Col>
                                                        <Col md="6" sm="12">

                                                            {
                                                                departureDate !== undefined &&
                                                                // <Col md='3' sm='12'>
                                                                <div className='mb-1'>
                                                                    <Label className='form-label' for='shEndDate'>
                                                                        Shoulder End Date <spam style={{ color: 'red' }}>*</spam>
                                                                    </Label>
                                                                    <Controller
                                                                        control={control}
                                                                        id='shEndDate'
                                                                        name='shEndDate'
                                                                        defaultValue={departureDate}
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

                                                            }
                                                        </Col>

                                                    </Row>

                                                    <Row>
                                                        <Col md="6" sm="12">
                                                            {
                                                                arrivalDate !== undefined &&
                                                                // <Col md='3' sm='12'>
                                                                <div className='mb-1'>
                                                                    <Label className='form-label' for='coming'>
                                                                        Arrival Date <spam style={{ color: 'red' }}>*</spam>
                                                                    </Label>
                                                                    <Controller
                                                                        control={control}
                                                                        id='coming'
                                                                        name='coming'
                                                                        defaultValue={arrivalDate}
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
                                                            }
                                                        </Col>
                                                        <Col md="6" sm="12">

                                                            {
                                                                departureDate !== undefined &&
                                                                // <Col md='3' sm='12'>
                                                                <div className='mb-1'>
                                                                    <Label className='form-label' for='departure'>
                                                                        Departure Date <spam style={{ color: 'red' }}>*</spam>
                                                                    </Label>
                                                                    <Controller
                                                                        control={control}
                                                                        id='departure'
                                                                        name='departure'
                                                                        defaultValue={departureDate}
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
                                                            }
                                                        </Col>
                                                        </Row>


                                                        {
                                                            yesterday &&
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


                                                    <Col md='3' sm='12'>
                                                        <div className='mb-1'>
                                                            <Label className='form-label' for='roomQuantity'>
                                                                Number of rooms <span style={{ color: 'red' }}>*</span>
                                                            </Label>
                                                            <Controller
                                                                control={control}
                                                                id='roomQuantity'
                                                                name='roomQuantity'
                                                                render={({ field }) =>
                                                                    <Input required type='text'
                                                                        pattern='^(1[0-9]|[2-9]\d+|\d{3,})$'
                                                                        title='Please enter number of rooms greater than or equal to 10'
                                                                        placeholder='Enter number of rooms' {...field} />}
                                                            />
                                                        </div>
                                                    </Col>


                                                    <div align='end'>
                                                        <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset1}>
                                                            Start Over
                                                        </Button>
                                                        <Button color='primary' className='me-1' type='submit'>
                                                            Get Availability
                                                        </Button>
                                                    </div>
                                                </Row>
                                            </Form>
                                        </CardBody>
                                    </Card>
                                </div>
                            </AccordionBody>
                        </AccordionItem>

                        {/* Booking information */}
                        <AccordionItem>
                            <AccordionHeader targetId='2' toggle={toggle}><h4><b>Booking Information</b></h4></AccordionHeader>
                            <AccordionBody accordionId='2'>

                                <Form onSubmit={handleSubmit(submitExtraDetails)}>
                                    <Row>


                                        {/* Group Name */}
                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='groupname'>
                                                    Group Name <span style={{ color: 'red' }}>*</span>
                                                </Label>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Input
                                                        type="text"
                                                        name='groupname'
                                                        required
                                                        placeholder='Select group name'
                                                        value={selectedGroupName !== undefined ? selectedGroupName.accountName : ''}
                                                        onClick={() => setGroupNameModal(!groupNameModal)}
                                                    /> &nbsp;&nbsp;
                                                    <span
                                                        style={{
                                                            color: 'red',
                                                            cursor: 'pointer',
                                                            border: 'none',
                                                            background: 'none',
                                                            padding: '0',
                                                            fontSize: 'inherit',
                                                            marginLeft: '5px',
                                                        }}
                                                        size="sm"
                                                        onClick={handleGroupNameClear}
                                                    >
                                                        X
                                                    </span>
                                                </div>
                                            </div>
                                        </Col>


                                        {/* Reservation Types */}
                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='resTypeName'>
                                                    Reservation Type <spam style={{ color: 'red' }}>*</spam>
                                                </Label>
                                                <Controller
                                                    id='resTypeName'
                                                    control={control}
                                                    name='resTypeName'
                                                    render={({ field }) => (
                                                        <Select
                                                            required
                                                            isClearable
                                                            options={ReservationTypeOptions}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select',)}
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>


                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='paymentType' >
                                                    Select Payment Type <spam style={{ color: 'red' }}>*</spam>
                                                </Label>
                                                <Controller
                                                    id='paymentType'
                                                    control={control}
                                                    name='paymentType'
                                                    render={({ field }) => (
                                                        <Select
                                                            required
                                                            isClearable
                                                            {...field}
                                                            options={paymentName}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select')}
                                                            onChange={handleOptionChange}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>

                                        {/* Company selection */}
                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='companyName'>
                                                    Company Name
                                                </Label>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>

                                                    <Input type="text" name='companyName' placeholder='Select agent'
                                                        value={selectedCompany !== undefined ? selectedCompany.accountName : ''}
                                                        onClick={() => setCompanyModal(!companyModal)}
                                                    />
                                                    <span
                                                        style={{
                                                            color: 'red',
                                                            cursor: 'pointer',
                                                            border: 'none',
                                                            background: 'none',
                                                            padding: '0',
                                                            fontSize: 'inherit',
                                                            marginLeft: '5px',
                                                        }}
                                                        size="sm"
                                                        onClick={handleCompanyClear}
                                                    >
                                                        X
                                                    </span>
                                                </div>
                                            </div>
                                        </Col>


                                        {selectedPaymentOption === 2 && <>
                                            <Col md='3' sm='12' className='mb-1'>
                                                <div className='mb-1'>
                                                    <Label className='form-label' for='cardNumber'>
                                                        Card Number
                                                    </Label>
                                                    <Controller
                                                        defaultValue=''
                                                        control={control}
                                                        id='cardNumber'
                                                        name='cardNumber'
                                                        render={({ field }) =>
                                                            <Input placeholder='Card Number'
                                                                minLength={15}
                                                                maxLength={16}
                                                                pattern='[0-9_]+'
                                                                title="Card Number should not contain alphabets and special characters."
                                                                // invalid={errors.cardNumber && true} 
                                                                {...field}
                                                            />}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md='3' sm='12' className='mb-1'>
                                                <div className='mb-1'>
                                                    <Label className='form-label' for='cardHolderName'>
                                                        Card Holder Name
                                                    </Label>
                                                    <Controller
                                                        defaultValue=''
                                                        control={control}
                                                        id='cardHolderName'
                                                        name='cardHolderName'
                                                        render={({ field }) =>
                                                            <Input
                                                                placeholder='Card Holder Name'
                                                                minLength={3}
                                                                maxLength={30}
                                                                pattern='^[A-Za-z. ]+$'
                                                                title="Card Holder Name should contain alphabets, spaces, and periods. Cannot contain numbers and other special characters."
                                                                {...field}
                                                            />
                                                        }
                                                    />
                                                </div>
                                            </Col>
                                            <Col md='3' sm='12' className='mb-1'>
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
                                                                options={{
                                                                    ...options,
                                                                    dateFormat: 'Y-m', // Format for the input's value, Year and Month
                                                                    // noCalendar: true, // Disable the calendar
                                                                }}
                                                                placeholder='YYYY-MM'
                                                                className={classnames('form-control')}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md='3' sm='12' className='mb-1'>
                                                <div className='mb-1'>
                                                    <Label className='form-label' for='authID'>
                                                        Autorization ID
                                                    </Label>
                                                    <Controller
                                                        defaultValue=''
                                                        control={control}
                                                        id='authID'
                                                        name='authID'
                                                        render={({ field }) => <Input placeholder='Autorization ID'
                                                            // pattern='[0-9_]{1,17}'
                                                            // title="Card Number should not contain alphabets and special characters." 
                                                            {...field} />}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md='3' sm='12' className='mb-1'>
                                                <div className='mb-1'>
                                                    <Label className='form-label' for='amount'>
                                                        Amount
                                                    </Label>
                                                    <Controller
                                                        defaultValue=''
                                                        control={control}
                                                        id='amount'
                                                        name='amount'
                                                        render={({ field }) => <Input placeholder='Amount'
                                                            // pattern='[0-9_]{1,17}'
                                                            // title="Card Number should not contain alphabets and special characters." 
                                                            {...field} />}
                                                    />
                                                </div>
                                            </Col>
                                        </>
                                        }

                                        {/* Selection based on Online payment */}
                                        {selectedPaymentOption === 3 &&
                                            <>
                                                <Col md='3' sm='12' className='mb-1'>
                                                    <div className='mb-1'>
                                                        <Label className='form-label' for='transactionID'>
                                                            Transaction ID
                                                        </Label>
                                                        <Controller
                                                            defaultValue=''
                                                            control={control}
                                                            id='transactionID'
                                                            name='transactionID'
                                                            render={({ field }) => <Input placeholder='Transaction ID'
                                                                {...field} />}
                                                        />
                                                    </div>
                                                </Col>
                                            </>
                                        }


                                        {
                                            companyModal &&
                                            <div>
                                                <Modal isOpen={companyModal} toggle={() => setCompanyModal(!companyModal)} className='modal-lg'>
                                                    <ModalHeader toggle={() => setCompanyModal(!companyModal)}>Company Profile page</ModalHeader>
                                                    <ModalBody>
                                                        <div>
                                                            <Row className='mb-1'>
                                                                <Col md='3' sm='12' className='me-1'>
                                                                    <Label className='form-label' for='fullName'>
                                                                        Search
                                                                    </Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="filter-text-box"
                                                                        placeholder="Filter..."
                                                                        onInput={onFilterTextBoxChanged}
                                                                    />
                                                                </Col>
                                                                <Col md='3' sm='12' className='me-1'>
                                                                    <br></br>
                                                                    <div align='end' >
                                                                        <Button color='primary' onClick={onclickButton3}>Add Company</Button>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        <div className="ag-theme-alpine" style={{ height: 520 }}>
                                                            <AgGridReact
                                                                ref={gridRef1}
                                                                rowData={rowData}
                                                                columnDefs={columnDefsCompany}
                                                                animateRows={true}
                                                                onCellClicked={cellClickedListener}
                                                                paginationPageSize='10'
                                                                pagination='true'
                                                                defaultColDef={defaultColDef}
                                                                headerColor="ddw-primary"
                                                            />
                                                        </div>
                                                    </ModalBody>
                                                </Modal>
                                            </div>
                                        }


                                        {/* Source Options */}
                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='sourceName'>
                                                    Source <span style={{ color: 'red' }}>*</span>
                                                </Label>
                                                <Controller
                                                    id='sourceName'
                                                    control={control}
                                                    name='sourceName'
                                                    render={({ field }) => (
                                                        <Select
                                                            required
                                                            isClearable
                                                            options={sourceCode}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select')}
                                                            {...field}
                                                            value={selectedOptionSource}
                                                            onChange={(option) => setSelectedOptionSource(option)}

                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>


                                        {/* Market Options */}
                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='marketName'>
                                                    Market<spam style={{ color: 'red' }}>*</spam>
                                                </Label>
                                                <Controller
                                                    id='marketName'
                                                    control={control}
                                                    name='marketName'
                                                    render={({ field }) => (
                                                        <Select
                                                            isClearable
                                                            required
                                                            options={marketCode}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select',)}
                                                            {...field}
                                                            value={selectedOptionMarket}
                                                            onChange={(option) => setSelectedOptionMarket(option)}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>


                                        {/* Origin options */}
                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='originName'>
                                                    Origin <spam style={{ color: 'red' }}>*</spam>
                                                </Label>
                                                <Controller
                                                    id='originName'
                                                    control={control}
                                                    name='originName'
                                                    render={({ field }) => (
                                                        <Select
                                                            isClearable
                                                            required
                                                            options={OriginOptions}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select',)}
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>


                                        {/* Booker Options */}
                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='booker'>
                                                    Booker
                                                </Label>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Input
                                                        type="text"
                                                        name='booker'
                                                        placeholder='Select booker'
                                                        value={selectedBooker !== undefined ? selectedBooker.name : ''}
                                                        onClick={() => setBasicModal(!basicModal)}
                                                    /> &nbsp;&nbsp;
                                                    <span
                                                        style={{
                                                            color: 'red',
                                                            cursor: 'pointer',
                                                            border: 'none',
                                                            background: 'none',
                                                            padding: '0',
                                                            fontSize: 'inherit',
                                                            marginLeft: '5px',
                                                        }}
                                                        size="sm"
                                                        onClick={handleBookerClear}
                                                    >
                                                        X
                                                    </span>
                                                </div>
                                            </div>
                                        </Col>


                                        {/* Package Selection */}
                                        {/* <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='packageID'>
                                                    Package Type <span style={{ color: 'red' }}>*</span>
                                                </Label>
                                                <Controller
                                                    id='packageID'
                                                    control={control}
                                                    name='packageID'
                                                    render={({ field }) => (
                                                        <Select
                                                            required
                                                            isClearable
                                                            options={PackageCodes}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select',)}
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col> */}


                                        {/* Room rate for the day */}
                                        {/* <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='rate'>
                                                    Room Rate <spam style={{ color: 'red' }}>*</spam>
                                                </Label>
                                                <Controller
                                                    control={control}
                                                    id='rate'
                                                    name='rate'
                                                    render={({ field }) =>
                                                        <Input required type='text' placeholder='Enter rate for a night' {...field} />}
                                                />
                                            </div>
                                        </Col> */}


                                        {/* Extras */}
                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='extras' >
                                                    Select Extra
                                                </Label>
                                                <Controller
                                                    id='extras'
                                                    control={control}
                                                    name='extras'
                                                    render={({ field }) => (
                                                        <Select
                                                            isMulti
                                                            isClearable
                                                            options={extraName}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select',)}
                                                            {...field}
                                                            value={selectedOptionExtras}
                                                            onChange={(option) => setSelectedOptionExtras(option)}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>


                                        {/* Agent Options */}
                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='agent'>
                                                    Agent
                                                </Label>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>

                                                    <Input type="text" name='agent' placeholder='Select agent'
                                                        value={selectedAgent !== undefined ? selectedAgent.accountName : ''}
                                                        onClick={() => setAgentModal(!agentModal)}
                                                    />
                                                    <span
                                                        style={{
                                                            color: 'red',
                                                            cursor: 'pointer',
                                                            border: 'none',
                                                            background: 'none',
                                                            padding: '0',
                                                            fontSize: 'inherit',
                                                            marginLeft: '5px',
                                                        }}
                                                        size="sm"
                                                        onClick={handleAgentClear}
                                                    >
                                                        X
                                                    </span>
                                                </div>
                                            </div>
                                        </Col>


                                        {/* Preferences */}
                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='features'>
                                                    Features / Preferences
                                                </Label>
                                                <Controller
                                                    id='features'
                                                    control={control}
                                                    name='features'
                                                    render={({ field }) => (
                                                        <Select
                                                            isMulti
                                                            isClearable
                                                            options={Features}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select',)}
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>


                                        {/* ETA */}
                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='eta'>
                                                    ETA
                                                </Label>
                                                <Controller
                                                    defaultValue='15:00'
                                                    control={control}
                                                    id='eta'
                                                    name='eta'
                                                    render={({ field }) => <Input type='time' placeholder='Agent' {...field} />}
                                                />
                                            </div>
                                        </Col>


                                        {/* ETD */}
                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='etd'>
                                                    ETD
                                                </Label>
                                                <Controller
                                                    defaultValue='12:00'
                                                    control={control}
                                                    id='etd'
                                                    name='etd'
                                                    render={({ field }) => <Input type='time' placeholder='Agent' {...field} />}
                                                />
                                            </div>
                                        </Col>


                                        {
                                            agentModal &&
                                            <div>
                                                <Modal isOpen={agentModal} toggle={() => setAgentModal(!agentModal)} className='modal-lg'>
                                                    <ModalHeader toggle={() => setAgentModal(!agentModal)}>Booker page</ModalHeader>
                                                    <ModalBody>
                                                        <div>
                                                            <Row className='mb-1'>
                                                                <Col md='3' sm='12' className='me-1'>
                                                                    <Label className='form-label' for='fullName'>
                                                                        Search
                                                                    </Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="filter-text-box"
                                                                        placeholder="Filter..."
                                                                        onInput={onFilterTextBoxChanged}
                                                                    />
                                                                </Col>
                                                                <Col md='3' sm='12' className='me-1'>
                                                                    <br></br>
                                                                    <div align='end' >
                                                                        <Button color='primary' onClick={onclickButton}>Add Agent</Button>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>

                                                        <div className="ag-theme-alpine" style={{ height: 520 }}>
                                                            <AgGridReact
                                                                ref={gridRef1}
                                                                rowData={agentList}
                                                                columnDefs={columnDefsAgent}
                                                                animateRows={true}
                                                                onCellClicked={cellClickedListener}
                                                                paginationPageSize='10'
                                                                pagination='true'
                                                                defaultColDef={defaultColDef}
                                                                headerColor="ddw-primary"
                                                            />
                                                        </div>
                                                    </ModalBody>
                                                </Modal>
                                            </div>
                                        }


                                        {/* Account Manager */}
                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='AccountManager'>
                                                    Account Manager
                                                </Label>
                                                <Controller
                                                    id='AccountManager'
                                                    control={control}
                                                    name='AccountManager'
                                                    render={({ field }) => (
                                                        <Select
                                                            isClearable
                                                            options={accountManagerList}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select',)}
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>


                                        {
                                            rateCodeModal &&
                                            <div>
                                                <Modal isOpen={rateCodeModal} toggle={() => setRateCodeModal(!rateCodeModal)} className='modal-lg'>
                                                    <ModalHeader toggle={() => setRateCodeModal(!rateCodeModal)}>Rate Code</ModalHeader>
                                                    <ModalBody>
                                                        <div>
                                                            <Row className='mb-1'>
                                                                <Col md='3' sm='12' className='me-1'>
                                                                    <Label className='form-label' for='fullName'>
                                                                        Search
                                                                    </Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="filter-text-box"
                                                                        placeholder="Filter..."
                                                                        onInput={onFilterTextBoxChanged}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        <div className="ag-theme-alpine" style={{ height: 520 }}>
                                                            <AgGridReact
                                                                ref={gridRef1}
                                                                rowData={rowData1}
                                                                columnDefs={columnDefsRateCode}
                                                                animateRows={true}
                                                                onCellClicked={cellClickedListener}
                                                                paginationPageSize='10'
                                                                pagination='true'
                                                                defaultColDef={defaultColDef}
                                                                headerColor="ddw-primary"
                                                            />
                                                        </div>
                                                    </ModalBody>
                                                </Modal>
                                            </div>
                                        }


                                        {
                                            basicModal &&
                                            <div>
                                                <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-lg'>
                                                    <ModalHeader toggle={() => setBasicModal(!basicModal)}>Booker page</ModalHeader>
                                                    <ModalBody>
                                                        <div>
                                                            <Row className='mb-1'>
                                                                <Col md='3' sm='12' className='me-1'>
                                                                    <Label className='form-label' for='fullName'>
                                                                        Search
                                                                    </Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="filter-text-box"
                                                                        placeholder="Filter..."
                                                                        onInput={onFilterTextBoxChanged}
                                                                    />
                                                                </Col>
                                                                <Col md='3' sm='12' className='me-1'>
                                                                    <br></br>
                                                                    <div align='end' >
                                                                        <Button color='primary' onClick={onclickButton2}>Add booker</Button>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        <div className="ag-theme-alpine" style={{ height: 520 }}>
                                                            <AgGridReact
                                                                ref={gridRef1}
                                                                rowData={bookerList}
                                                                columnDefs={columnDefs}
                                                                animateRows={true}
                                                                onCellClicked={cellClickedListener}
                                                                paginationPageSize='10'
                                                                pagination='true'
                                                                defaultColDef={defaultColDef}
                                                                headerColor="ddw-primary"
                                                            />
                                                        </div>
                                                    </ModalBody>
                                                </Modal>
                                            </div>
                                        }


                                        {/* Comments */}
                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='comment1'>
                                                    Comment
                                                </Label>
                                                <Controller
                                                    control={control}
                                                    id='comment1'
                                                    name='comment1'
                                                    render={({ field }) => <Input type='textarea' placeholder='Enter comments' {...field} />}
                                                />
                                            </div>
                                        </Col>


                                        {/* Billing Instructions */}
                                        <Col md='3' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='billingInstructions'>
                                                    Billing Instructions
                                                </Label>
                                                <Controller
                                                    defaultValue=''
                                                    control={control}
                                                    id='billingInstructions'
                                                    name='billingInstructions'
                                                    render={({ field }) => <Input type='textarea' placeholder='Enter billing instructions' {...field} />}
                                                />
                                            </div>
                                        </Col>

                                    </Row>

                                    <br></br>
                                    <br></br>

                                    <Row>
                                        {/* On submit buttons */}
                                        <div align='end'>
                                            <Button className='me-1' outline color='secondary' type='reset'>
                                                Reset
                                            </Button>
                                            <Button className='me-1' style={{ align: 'end' }} color='primary' type='submit'>
                                                Create Enquiry
                                            </Button>
                                        </div>
                                    </Row>
                                </Form>

                            </AccordionBody>
                        </AccordionItem>

                    </div>

                    {
                        groupNameModal &&
                        <div>
                            <Modal isOpen={groupNameModal} toggle={() => setGroupNameModal(!groupNameModal)} className='modal-xl'>
                                <ModalHeader toggle={() => setGroupNameModal(!groupNameModal)}>Company Profile</ModalHeader>
                                <ModalBody>
                                    <div>
                                        <Row className='mb-1'>
                                            <Col md='3' sm='12' className='me-1'>
                                                <Label className='form-label' for='fullName'>
                                                    Search
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="filter-text-box"
                                                    placeholder="Filter..."
                                                    onInput={onFilterTextBoxChanged}
                                                />
                                            </Col>
                                            <Col md='3' sm='12' className='me-1'>
                                                <br></br>
                                                <div align='end' >
                                                    <Button color='primary' onClick={onclickButton5}>Add New Group</Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="ag-theme-alpine" style={{ height: 520 }}>
                                        <AgGridReact
                                            ref={gridRef1}
                                            rowData={groupNameData}
                                            columnDefs={columnDefsGroup}
                                            animateRows={true}
                                            onCellClicked={cellClickedListener}
                                            paginationPageSize='10'
                                            pagination='true'
                                            defaultColDef={defaultColDef}
                                            headerColor="ddw-primary"
                                        />
                                    </div>
                                </ModalBody>
                            </Modal>
                        </div>
                    }

                </Accordion>
            </Card>
        </div>
    )
}


export default GroupReservation;
