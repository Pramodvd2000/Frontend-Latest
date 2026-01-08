import React, { Fragment, useState, useRef, useEffect, useMemo, useCallback } from 'react'

// import Profile from './profile'
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Moment from 'moment'

import API_URL from '../../../config'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

// ** Reactstrap Imports
import { Button, Spinner, Modal, ModalHeader, ModalBody, Card, CardBody, Row, Col, Form, Label, NavLink, Input, CardHeader } from 'reactstrap'

import { useNavigate } from "react-router-dom"


// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

localStorage.removeItem("NewCheckInDate")
localStorage.removeItem("NewCheckOutDate")
localStorage.removeItem("NewAdultCount")
localStorage.removeItem("NewChildrenCount")
localStorage.removeItem("NewQuantityCount")


const AdultOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' }
]


const childrenOptions = [
    { value: '0', label: '0' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
]


const RoomQuantityOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' }
]


const defaultValues = {
    checkIn: '',
    checkOut: '',
    adults: null,
    children: null,
    quantity: null
}

const LoadingModal = () => (
    <div className="loading-modal">
        <p>Loading...</p>
    </div>
);



// const StayNotification = (data1,checkDep) => {
    const StayNotification = (data1,checkDep) => {
    console.log(data1,checkDep)
    const { setError, formState: { errors }, setValue } = useForm();


    const DefaultOptionAdults = {
        value: data1['data1'][0]["numberOfAdults"],
        label: data1['data1'][0]["numberOfAdults"]
    }


    const DefaultOptionChild = {
        value: data1['data1'][0]["numberOfChildren"],
        label: data1['data1'][0]["numberOfChildren"]
    }


    const DefaultOptionQuantity = {
        value: data1['data1'][0]["numberOfRooms"],
        label: data1['data1'][0]["numberOfRooms"]
    }


    const gridRef = useRef();


    const cellClickedListener = useCallback(event => {
        console.log('cellClicked', event)
    })


    const [stayNotification, setStayNotification] = useState();
    const [data, setData] = useState(null)
    const navigate = useNavigate()
    const [UpdatedRate, setUpdatedRate] = useState(false)
    const [displayRatesummary, setDisplayRateSummary] = useState(false)
    const [ChildrenCheck, setChildrenCheck] = useState(false)
    const [modal, setModal] = useState(false)
    const [rateSummaryModal, setRateSummaryModal] = useState(false)
    const [rowData, setRowData2] = useState()
    const [loading, setLoading] = useState(false);


    const { reset1, handleSubmit, control, watch } = useForm({ defaultValues })

    const modalClose = () => {
        setRateSummaryModal(false)
        setStayNotification(false);
        setModal(false)
    }

    //Flatpicker
    const today = Moment().format('YYYY-MM-DD')
    const coming = watch('coming');


    let optionsToDate = {
        minDate: (Moment(String(new Date(coming))).format('YYYY-MM-DD') === "Invalid date" ? today : Moment(String(new Date(coming))).format('YYYY-MM-DD'))
    };


    let options = {
        minDate: today
    }


    if (data1['data1'][0]["isMain"] == 0) {
        options = {
            minDate: data1['data1'][1][0]['arrivalDate'],
            maxDate: data1['data1'][1][0]['departureDate']
        }
        optionsToDate = {
            minDate: (data1['data1'][1][0]['arrivalDate'] > today ? data1['data1'][1][0]['arrivalDate'] : today),
            maxDate: data1['data1'][1][0]['departureDate']
        }
    }


    const handleRateSummary = () => {
        setRateSummaryModal(true)
    }


    const handleSuccess = () => {
        return MySwal.fire({
            title: 'Reservation!!',
            text: 'Successfully updated Reservation',
            icon: 'success',
        },
            // setBasicModal(false),
            setTimeout(() => { navigate('/dashboard/nightAudit') }, 1000)
        )
    }


    const onSubmit = data => {

        localStorage.setItem('checkDate1', (data.coming === undefined ? data1['data1'][0]['arrivalDate'] : (Moment(String(new Date(data.coming))).format('YYYY-MM-DD'))))
        localStorage.setItem('checkDate2', (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')))

        if (data.coming === undefined) {
            localStorage.setItem("NewCheckInDate", data1['data1'][0]['arrivalDate'])
        }
        else {
            localStorage.setItem("NewCheckInDate", (Moment(String(new Date(data.coming))).format('YYYY-MM-DD')))
        }
        localStorage.setItem("NewCheckOutDate", (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')))
        localStorage.setItem("NewAdultCount", (data.adult === undefined ? data1['data1'][0]["numberOfAdults"] : data.adult.label))
        localStorage.setItem("NewChildrenCount", (data.child === undefined ? data1['data1'][0]["numberOfChildren"] : data.child.label))
        localStorage.setItem("NewQuantityCount", (data.room === undefined ? data1['data1'][0]["numberOfRooms"] : data.room.label))
        setData(data)
        let adultCount = (data.adult === undefined ? data1['data1'][0]["numberOfAdults"] : data.adult.label);
        let childCount = (data.child === undefined ? data1['data1'][0]["numberOfChildren"] : data.child.label);
        let count = 3;
        if ((data.adult === undefined ? data1['data1'][0]["numberOfAdults"] : data.adult.label) === '2') {
            count = 4
        }
        else if ((data.adult === undefined ? data1['data1'][0]["numberOfAdults"] : data.adult.label) === '3') {
            count = 3;
        }
        let totalCount = Number(adultCount) + Number(childCount);
        if (totalCount > count) {
            setUpdatedRate(false)
            setChildrenCheck(true)
        }
        else {
            setStayNotification(false)
            setChildrenCheck(false)
            const CheckAvailablity = JSON.stringify({
                hotelID: 1,
                tempReservationID: data1['data1'][0]['tempReservationID'],
                reservationID: data1['data1'][0]['id'],
                roomTypeID: data1['data1'][0]['roomToCharge'],
                source: data1['data1'][0]['Type'],
                companyID: data1['data1'][0]['companyID'],
                checkIn: (data.coming === undefined ? data1['data1'][0]['arrivalDate'] : (Moment(String(new Date(data.coming))).format('YYYY-MM-DD'))),
                checkOut: (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')),
                adults: (data.adult === undefined ? data1['data1'][0]["numberOfAdults"] : data.adult.label),
                children: (data.child === undefined ? data1['data1'][0]["numberOfChildren"] : data.child.label),
                quantity: (data.room === undefined ? data1['data1'][0]["numberOfRooms"] : data.room.label),
            })

            //send data and take updated dates
            fetchx(API_URL + '/updateStayInformation', {
                method: 'PUT',
                body: CheckAvailablity,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            })
                .then((res) => res.json())
                .then(postres => {
                    console.log(((postres['data'])))
                    //If rooms are not available on dates, throw error
                    if (typeof (postres['data']) === 'string') {
                        setUpdatedRate(false)
                        setModal(postres['data'])
                    }
                    else {
                        if ((Moment(String(new Date(data.coming))).format('YYYY-MM-DD')) === data1['data1'][0]['arrivalDate']) {
                            setModal("Please Modify Arrival Date to Roll Over")
                        }
                        else {
                            const GetRateCode = JSON.stringify({
                                hotelID: 1,
                                tempReservationID: data1['data1'][0]['tempReservationID'],
                                source: data1['data1'][0]['Type'],
                                rateCode: data1['data1'][0]['rateCodeID'],
                                checkIn: postres['data']['newArrival'],
                                checkin1: (data.coming === undefined ? data1['data1'][0]['arrivalDate'] : (Moment(String(new Date(data.coming))).format('YYYY-MM-DD'))),
                                checkout1: (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')),
                                checkOut: postres['data']['newDeparture'],
                                adults: postres['data']['newAdult'],
                                children: postres['data']['newChild'],
                                roomTypeID: data1['data1'][0]['roomToCharge'],
                                quantity: (data.room === undefined ? data1['data1'][0]["numberOfRooms"] : data.room.label),
                                isMain: data1['data1'][0]['isMain'],
                                packageID: data1['data1'][0]['packageID'],
                                mainReservationID: data1['data1'][1]['tempReservationID'],
                                mainReservationCheckIn: data1['data1'][1]['arrivalDate'],
                                mainReservationCheckOut: data1['data1'][1]['departureDate'],
                                sharingID: data1['data1'][0]['sharingID'],
                                mainReservationTempID: data1['data1'][1]['id'],
                            })

                            //API to get updated rates (Daily Details)
                            fetchx(API_URL + '/getUpdatedRateForStayModification', {
                                method: 'POST',
                                body: GetRateCode,
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8'
                                }
                            })
                                .then((rateCode) => rateCode.json())
                                .then(rateCodeSelection => {
                                    console.log(rateCodeSelection)
                                    if (typeof (rateCodeSelection['data']) === "string") {
                                        setUpdatedRate(false)
                                        setModal(rateCodeSelection['data'])
                                    }
                                    else {
                                        let rateSummary = JSON.stringify({
                                            rateSummary: rateCodeSelection['data'],
                                            rateCode: data1['data1'][0]['rateCodeID'],
                                            roomTypeID: data1['data1'][0]['roomTypeID']
                                        })

                                        //API to show rate summary
                                        setUpdatedRate(rateCodeSelection['data'])
                                        fetchx(API_URL + '/showRateSummary', {
                                            method: 'POST',
                                            body: rateSummary,
                                            headers: {
                                                'Content-type': 'application/json; charset=UTF-8'
                                            }
                                        })
                                            .then((rateSummary) => rateSummary.json())
                                            .then(displayRateSummary => {
                                                console.log(displayRateSummary['data'])
                                                setDisplayRateSummary(displayRateSummary['data'])
                                            })
                                    }
                                })
                                .catch((err) => {
                                    console.log(err.message)
                                })
                        }
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }


    const getRowStyle = params => {
        const rowDate = new Date(params.data.inventory_date);
        let date = new Date(localStorage.getItem('checkDate2'))
        date.setDate(date.getDate() - 1);
        let oneLessDate = Moment(new Date(date)).format("YYYY-MM-DD")
        if (rowDate >= new Date(localStorage.getItem('checkDate1')) && rowDate <= new Date(oneLessDate) && !data1['data1'][0]['isMain']) {
            return { backgroundColor: 'yellow' }; // Set your desired background color
        }
        return null;
    };


    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ))


    //AG-GRID columns to show daily details
    const [columnDefs1, setColumnDefs1] = useState([
        { headerName: 'Date', field: 'inventory_date', maxWidth: 128, sort: 'asc' },
        { headerName: 'Base Rate', field: 'baseprice', maxWidth: 125 },
        { headerName: 'Package Rate', field: 'packageRate', maxWidth: 125 },
        { headerName: 'Extra Adult Price', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 140 },
        { headerName: 'Children Price', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 140 },
        { headerName: 'Total Rate', field: 'total', suppressSizeToFit: true, maxWidth: 125 },
        { headerName: 'RoomType', field: 'roomType', suppressSizeToFit: true, maxWidth: 125 },
        { headerName: 'Package', field: 'packageCode', suppressSizeToFit: true, maxWidth: 125 },
    ])


    //AG-GRID columns to show rate summary
    const [columnDefs2, setColumnDefs2] = useState([
        { headerName: 'Date', field: 'Date', maxWidth: 120, sort: 'asc' },
        { headerName: 'RoomType', field: 'roomType', suppressSizeToFit: true, maxWidth: 120 },
        { headerName: 'Base Price', field: 'baseprice', maxWidth: 120 },
        // { headerName: 'Room Rate', field: 'roomRevenue', suppressSizeToFit: true, maxWidth: 125 },
        { headerName: 'Package Rate', field: 'packageRevenue', suppressSizeToFit: true, maxWidth: 140 },
        { headerName: 'Total', field: 'subTotal', suppressSizeToFit: true, maxWidth: 100 },
        { headerName: 'Tax', field: 'totalTaxGenerated', suppressSizeToFit: true, maxWidth: 100 },
        { headerName: 'Total With Tax', field: 'total', suppressSizeToFit: true, maxWidth: 150 },
        { headerName: 'PackageCode', field: 'packageCode', suppressSizeToFit: true, maxWidth: 140 },
        { headerName: 'Extra Adult Price', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 165 },
        { headerName: 'Child Price', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 125 },
    ])


    const handleReset1 = () => {
        window.location.reload()
    }


    const finalSubmit = () => {
        console.log(UpdatedRate)
        const finalData = JSON.stringify({
            tempReservationID: data1['data1'][0]['tempReservationID'],
            reservationID: data1['data1'][0]['id'],
            dailyDetails: UpdatedRate,
            sharingID: data1['data1'][0]['sharingID'],
            checkIn: localStorage.getItem("NewCheckInDate"),
            checkOut: localStorage.getItem("NewCheckOutDate"),
            adults: localStorage.getItem("NewAdultCount"),
            children: localStorage.getItem("NewChildrenCount"),
            quantity: localStorage.getItem("NewQuantityCount"),
            isMain: data1['data1'][0]['isMain'],
            mainReservationID: data1['data1'][1]['tempReservationID'],
            mainReservationCheckIn: data1['data1'][1]['arrivalDate'],
            mainReservationCheckOut: data1['data1'][1]['departureDate'],
            mainReservationTempID: data1['data1'][1]['id'],
            roomID: data1['data1'][1]['room']
        })
        fetchx(API_URL + '/updateStayDetailsOfReservation', {
            method: 'POST',
            body: finalData,
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
            // console.log(finalData)
            .then((res) => res.json())
            .then(postres => {
                console.log(postres)
                if (postres.statusCode === 200) {
                    handleSuccess()
                    const finalData = JSON.stringify({
                        reservationID: data1['data1'][0]['id'],
                        reservationStatus: "Roll Over"

                    })
                    fetchx(API_URL + '/updateReservationTableStatus', {
                        method: 'POST',
                        body: finalData,
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8'
                        }

                    }).then((res) => res.json())
                        .then(postres => {
                            console.log(postres)
                        })
                }
            })
    }


    return (
        <div>

            {/* Form to take new dates */}
            <Card>
                <CardHeader>
                    <CardHeader tag={'h4'}>Stay Modification</CardHeader>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            {
                                data1['data1'][0]["reservationStatus"] === "Checked In" ? (
                                    <Col md='4' sm='12'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='coming'>
                                                Arrival Date
                                            </Label>
                                            <Controller
                                                control={control}
                                                id='coming'
                                                name='coming'
                                                render={({ field }) => (
                                                    <Flatpickr
                                                        options={options}
                                                        placeholder='YYYY-MM-DD '
                                                        className={classnames('form-control')}
                                                        {...field}
                                                        disabled={true}
                                                        value={data1['data1'][0]["arrivalDate"] === today ? today : data1['data1'][0]["arrivalDate"]}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                ) : (
                                    <Col md='4' sm='12'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='coming'>
                                                Arrival Date
                                            </Label>
                                            <Controller
                                                control={control}
                                                id='coming'
                                                name='coming'
                                                defaultValue={data1['data1'][0]["arrivalDate"]}
                                                render={({ field }) => (
                                                    <Flatpickr
                                                        options={options}
                                                        placeholder='YYYY-MM-DD '
                                                        className={classnames('form-control')}
                                                        {...field}
                                                    // disabled={true}
                                                    // value={data1['data1'][0]['data1']["departureDate"]}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                )
                            }


                            {/* Departure Date */}
                            <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='departure'>
                                        Departure Date
                                    </Label>
                                    <Controller
                                        control={control}
                                        id='departure'
                                        name='departure'
                                        defaultValue={data1['data1'][0]["departureDate"]}
                                        render={({ field }) => (
                                            <Flatpickr
                                                // disabled={isSubmitted}
                                                options={optionsToDate}
                                                placeholder='YYYY-MM-DD '
                                                className={classnames('form-control')}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>

                            {/* Adult, children and number of rooms */}
                            {
                                (data1['data1'][0]["subBookingID"] === null && data1['data1'][0]["isMain"] === 1) ? (
                                    <>
                                        <Col md='4' sm='8'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='adult' >
                                                    Adults
                                                </Label>
                                                <Controller
                                                    defaultValue={DefaultOptionAdults}
                                                    id='adult'
                                                    control={control}
                                                    name='adult'
                                                    render={({ field }) => (
                                                        <Select
                                                            isClearable
                                                            options={AdultOptions}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select')}
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>
                                        <Col md='4' sm='8'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='child'>
                                                    Children
                                                </Label>
                                                <Controller
                                                    id='child'
                                                    control={control}
                                                    name='child'
                                                    defaultValue={DefaultOptionChild}
                                                    render={({ field }) => (
                                                        <Select
                                                            isClearable
                                                            options={childrenOptions}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select')}
                                                            {...field} />
                                                    )} />
                                            </div>
                                        </Col>
                                        <Col md='4' sm='8'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='room'>
                                                    Number Of Rooms
                                                </Label>
                                                <Controller
                                                    id='room'
                                                    control={control}
                                                    name='room'
                                                    defaultValue={DefaultOptionQuantity}
                                                    render={({ field }) => (
                                                        <Select
                                                            isClearable
                                                            options={RoomQuantityOptions}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select')}
                                                            {...field} />
                                                    )} />
                                            </div>
                                        </Col></>
                                ) : (
                                    <>
                                        <Col md='4' sm='8'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='adult'>
                                                    Adults
                                                </Label>
                                                <Controller
                                                    id='adult'
                                                    control={control}
                                                    name='adult'
                                                    render={({ field }) => (
                                                        <Input
                                                            isClearable
                                                            options={AdultOptions}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select')}
                                                            {...field}
                                                            disabled={true}
                                                            value={data1['data1'][0]["numberOfAdults"]} />
                                                    )} />
                                            </div>
                                        </Col>
                                        <Col md='4' sm='8'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='child'>
                                                    Children
                                                </Label>
                                                <Controller
                                                    id='child'
                                                    control={control}
                                                    name='child'
                                                    render={({ field }) => (
                                                        <Input
                                                            isClearable
                                                            options={childrenOptions}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select')}
                                                            {...field}
                                                            disabled={true}
                                                            value={data1['data1'][0]["numberOfChildren"]} />
                                                    )} />
                                            </div>
                                        </Col>
                                        <Col md='4' sm='8'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='room'>
                                                    Number Of Rooms
                                                </Label>
                                                <Controller
                                                    id='room'
                                                    control={control}
                                                    name='room'
                                                    render={({ field }) => (
                                                        <Input
                                                            isClearable
                                                            options={RoomQuantityOptions}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select')}
                                                            {...field}
                                                            disabled={true}
                                                            value={data1['data1'][0]["numberOfRooms"]} />
                                                    )} />
                                            </div>
                                        </Col></>
                                )
                            }

                            <div align='end' className='buttons'>
                                <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset1}>
                                    Start Over
                                </Button>
                                <Button color='primary' className='me-1' type='submit' onClick={() => { setStayNotification(!stayNotification) }}>
                                    Get Rates
                                </Button>
                            </div>


                        </Row>
                    </Form>
                </CardBody>
            </Card>


            {/* modal to throw error if count exceeds */}
            {
                ChildrenCheck === true &&
                <Modal isOpen={stayNotification} toggle={() => setStayNotification(!stayNotification)} className={'modal-dialog-centered {modal-lg}'}>
                    <ModalHeader className='modal-sm' toggle={() => setStayNotification(!stayNotification)}>
                        PAX Modification
                    </ModalHeader>
                    <ModalBody className='pb-3 px-sm-5 mx-20'>
                        <p>
                            You have Exceeded PAX Count more than three.<br></br>
                            Please Select adults or children properly
                        </p>
                        <div>
                            <Button color='primary' className='me-1' style={{ float: 'right' }} onClick={modalClose}>
                                Back
                            </Button>
                        </div>
                    </ModalBody>
                </Modal>
            }


            {/* Daily details table */}
            {
                UpdatedRate !== false &&
                <div>
                    <div className="ag-theme-alpine" style={{ height: 220 }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={UpdatedRate}
                            columnDefs={columnDefs1}
                            animateRows={true}
                            getRowStyle={getRowStyle}
                            rowSelection='multiple'
                            onCellClicked={cellClickedListener}
                            paginationPageSize='10'
                            defaultColDef={defaultColDef}
                            headerColor="ddw-primary"
                        />
                    </div>
                    <br />
                    <div align='end' className='buttons' >
                        <Button color='primary' className='me-1' type='submit' onClick={handleRateSummary}>
                            Continue
                        </Button>
                    </div>
                </div>
            }


            {/* Rate summary table */}
            {
                rateSummaryModal === true &&
                <Modal isOpen={rateSummaryModal} toggle={() => setRateSummaryModal(!rateSummaryModal)} className='modal-xl'>
                    <ModalHeader toggle={() => setRateSummaryModal(!rateSummaryModal)}>
                        Rate Summary Of Modified Reservation
                    </ModalHeader>
                    <ModalBody className='pb-3 px-sm-5 mx-20'>

                        <div className="ag-theme-alpine" style={{ height: 385 }}>
                            <AgGridReact
                                ref={gridRef}
                                rowData={displayRatesummary}
                                columnDefs={columnDefs2}
                                animateRows={true}
                                rowSelection='multiple'
                                onCellClicked={cellClickedListener}
                                paginationPageSize='10'
                                defaultColDef={defaultColDef}
                                headerColor="ddw-primary"
                            />
                        </div>

                        <br></br>
                        {/* <br></br> */}
                        <div>
                            <Button color='primary' className='me-1' style={{ float: 'right' }} onClick={finalSubmit}>
                                Confirm
                            </Button>
                            <Button outline color='secondary' className='me-1' style={{ float: 'right' }} onClick={modalClose}>
                                Cancel
                            </Button>
                        </div>
                    </ModalBody>
                </Modal>
            }


            {/* Modal for any alert */}
            {
                modal.length &&
                <Modal isOpen={modal} toggle={() => setModal(!modal)} className={'modal-dialog-centered {modal-lg}'}>
                    <ModalHeader className='modal-sm' toggle={() => setModal(!modal)}>
                        Alert !!!!
                    </ModalHeader>
                    <ModalBody className='pb-3 px-sm-5 mx-20'>
                        <p>
                            <b> {modal}</b>
                        </p>
                        <div>
                            <Button color='primary' className='me-1' style={{ float: 'right' }} onClick={modalClose}>
                                Back
                            </Button>
                        </div>
                    </ModalBody>
                </Modal>
            }



        </div>
    )
}


export default StayNotification 