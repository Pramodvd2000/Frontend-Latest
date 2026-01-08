// import React, { Fragment, useState, useRef, useEffect, useMemo, useCallback } from 'react'

// // import Profile from './profile'
// import { useForm, Controller } from 'react-hook-form'
// import Flatpickr from 'react-flatpickr'
// import classnames from 'classnames'
// import Select from 'react-select'
// import { selectThemeColors } from '@utils'
// import Moment from 'moment'

// import API_URL from '../../../config'

// // ** Third Party Components
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'

// const MySwal = withReactContent(Swal)
// import Backdrop from '@mui/material/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress'


// // ** Reactstrap Imports
// import { Button, Spinner, Modal, ModalHeader, ModalBody, Card, CardBody, Row, Col, Form, Label, NavLink, Input } from 'reactstrap'

// import { useNavigate } from "react-router-dom"

// // import 'ag-grid-enterprise'
// import 'ag-grid-enterprise'
// import { AgGridReact } from 'ag-grid-react'
// import '/node_modules/ag-grid-community/styles/ag-grid.css'
// import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// sessionStorage.removeItem("NewCheckInDate")
// sessionStorage.removeItem("NewCheckOutDate")
// sessionStorage.removeItem("NewAdultCount")
// sessionStorage.removeItem("NewChildrenCount")
// sessionStorage.removeItem("NewQuantityCount")


// // Dropdown options for adult field
// const AdultOptions = [
//     { value: '1', label: '1' },
//     { value: '2', label: '2' },
//     { value: '3', label: '3' }
// ]


// // Dropdown options for adult field
// const AdultOptions2 = [
//     { value: '1', label: '1' },
//     { value: '2', label: '2' },
//     { value: '3', label: '3' },
// ]


// // Dropdown options for children field
// const childrenOptions = [
//     { value: '0', label: '0' },
//     { value: '1', label: '1' },
//     { value: '2', label: '2' },
// ]


// // Dropdown options for number of rooms field
// const RoomQuantityOptions = [
//     { value: '1', label: '1' },
//     { value: '2', label: '2' },
//     { value: '3', label: '3' },
//     { value: '4', label: '4' },
//     { value: '5', label: '5' },
//     { value: '6', label: '6' },
//     { value: '7', label: '7' },
//     { value: '8', label: '8' }, 
//     { value: '9', label: '9' },
//     { value: '10', label: '10' },
//     { value: '11', label: '11' },
//     { value: '12', label: '12' },
//     { value: '13', label: '13' },
//     { value: '14', label: '14' },
//     { value: '15', label: '15' }
// ]


// const defaultValues = {
//     checkIn: '',
//     checkOut: '',
//     adults: null,
//     children: null,
//     quantity: null
// }


// let subTotal;
// let totalTaxGenerated;
// let total;
// let totalDiscount;
// let totalCostOfStay;


// const StayNotification = (data1) => {
//     const gridRef = useRef();
//     const { setError, formState: { errors }, setValue } = useForm();
//     const [open, setOpen] = useState(false);
//     const [adultCount, setAdultCount] = useState(false)
//     const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
//     const [stayNotification, setStayNotification] = useState();
//     const [data, setData] = useState(null)
//     const navigate = useNavigate()
//     const [UpdatedRate, setUpdatedRate] = useState(false)
//     const [displayRatesummary, setDisplayRateSummary] = useState(false)
//     const [rateSummaryModal, setRateSummaryModal] = useState(false)
//     const { reset1, handleSubmit, control, watch } = useForm({ defaultValues })
//     const [arrivalDate, setArrivalDate] = useState();
//     const [departureDate, setDepartureDate] = useState()


//     // Default adult option loading
//     const DefaultOptionAdults = {
//         value: data1['data1'][0]['data1']["numberOfAdults"],
//         label: data1['data1'][0]['data1']["numberOfAdults"]
//     }


//     //Default Children option loading 
//     const DefaultOptionChild = {
//         value: data1['data1'][0]['data1']["numberOfChildren"],
//         label: data1['data1'][0]['data1']["numberOfChildren"]
//     }


//     // Default number of rooms options loading
//     const DefaultOptionQuantity = {
//         value: data1['data1'][0]['data1']["numberOfRooms"],
//         label: data1['data1'][0]['data1']["numberOfRooms"]
//     }


//     // get sharingID count
//     useEffect(() => {

//         fetchx(API_URL + '/getReservationBySharingID', {
//             method: 'POST',
//             body: JSON.stringify({ sharingID: data1.data1[0].data1.sharingID }),
//             headers: {
//                 'Content-type': 'application/json; charset=UTF-8'
//             }
//         })
//             .then((res) => res.json())
//             .then(postres => {
//                 setAdultCount(postres['data'].length)
//             });

//         const hotelID = JSON.stringify({
//             hotelID: 1
//         })

//         fetchx(API_URL + "/getBusinessDate", {
//             method: "POST",
//             headers: { 'Content-Type': 'application/json' },
//             body: hotelID
//         }).then((res) => res.json())
//             .then(postres => {
//                 const today = new Date(postres['data'][0]['businessDate']);
//                 const tomorrow = new Date(today);
//                 tomorrow.setDate(today.getDate() + 1);
//                 setDepartureDate(tomorrow)
//                 setArrivalDate((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
//             })
//     }, []);


//     // on click listener
//     const cellClickedListener = useCallback(event => {
//         // console.log('cellClicked', event)
//     })


//     // Modal close button.
//     const modalClose = () => {
//         setRateSummaryModal(false)
//         setStayNotification(false);
//         setModal(false)
//     }


//     // error handling for same guest addition
//     const handleError = (message) => {
//         return MySwal.fire({
//             title: 'Error!',
//             text: message,
//             icon: 'error',
//             html: message.replace(/\n/g, '<br />'),
//             customClass: {
//                 confirmButton: 'btn btn-danger'
//             },
//             allowOutsideClick: false,
//             confirmButtonText: 'Close',
//             confirmButtonColor: 'danger',
//             buttonsStyling: false
//         })
//     }


//     //Flatpicker
//     // const today = Moment().format('YYYY-MM-DD')
//     const coming = watch('coming');

//     let optionsToDate;

//     if((data1['data1'][0]['data1']["reservationStatus"] == 'Checked In' || data1['data1'][0]['data1']["reservationStatus"] == 'Due Out') && data1['data1'][0]['data1']["isMain"] !== 0){
//         optionsToDate = {
//             minDate:  arrivalDate
//          }
//     }

//     if((data1['data1'][0]['data1']["reservationStatus"] == 'Due In' || data1['data1'][0]['data1']["reservationStatus"] == 'Reserved') && data1['data1'][0]['data1']["isMain"] !== 0){
//         // console.log(data1['data1'][0]['data1']["arrivalDate"], arrivalDate, Moment(String(new Date(coming))).format('YYYY-MM-DD'))
//         optionsToDate = {
//             minDate:  Moment(String(new Date(coming))).format('YYYY-MM-DD') === 'Invalid date' ? data1['data1'][0]['data1']["arrivalDate"] : Moment(String(new Date(coming))).format('YYYY-MM-DD')
//          }
//     }




//     let options;
//     if(data1.data2 && data1.data2 == 1 && departureDate!== undefined){

//     // Option for arrival date
//     options = {
//         minDate: arrivalDate,
//         maxDate: departureDate // Set maxDate to limit it to one day up to tomorrow
//     };
    
// }else{
//      options = {
//         minDate: arrivalDate
//     }
// }


//     if ((data1['data1'][0]['data1']["reservationStatus"] == 'Checked In' || data1['data1'][0]['data1']["reservationStatus"] == 'Due Out') && data1['data1'][0]['data1']["isMain"] == 0) {
//         optionsToDate = {
//             maxDate: data1['data1'][1][0]['departureDate']
//         }
//     }


//     // Options for arrival date and departure date for sharer
//     if ((data1['data1'][0]['data1']["reservationStatus"] == 'Due In' || data1['data1'][0]['data1']["reservationStatus"] == 'Reserved') && data1['data1'][0]['data1']["isMain"] == 0) {
//         options = {
//             minDate: data1['data1'][1][0]['arrivalDate'] < arrivalDate ? arrivalDate : data1['data1'][1][0]['arrivalDate'],
//             maxDate: data1['data1'][1][0]['departureDate']
//         }
//         optionsToDate = {
//             minDate: Moment(String(new Date(coming))).format('YYYY-MM-DD') === 'Invalid date' ? data1['data1'][0]['data1']["departureDate"] : Moment(String(new Date(coming))).format('YYYY-MM-DD'),
//             maxDate: data1['data1'][1][0]['departureDate']
//         }
//     }


//     // Rate summary modal
//     const handleRateSummary = () => {
//         setRateSummaryModal(true)
//     }


//     // On success modal open
//     const handleSuccess = () => {
//         return MySwal.fire({
//             title: 'Modify Reservation!!',
//             text: 'Successfully updated Reservation',
//             icon: 'success',
//         },
//             setTimeout(() => { navigate('') }, 1000)
//         )
//     }

//     // On submit function
//     const onSubmit = data => {

//         subTotal = 0;
//         totalTaxGenerated = 0;
//         total = 0;
//         totalDiscount = 0;
//         totalCostOfStay = 0;
//         sessionStorage.setItem('checkDate1', (data.coming === undefined ? data1['data1'][0]['data1']['arrivalDate'] : (Moment(String(new Date(data.coming))).format('YYYY-MM-DD'))))
//         sessionStorage.setItem('checkDate2', (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')))

//         if (data.coming === undefined) {
//             sessionStorage.setItem("NewCheckInDate", data1['data1'][0]['data1']['arrivalDate'])
//         }
//         else {
//             sessionStorage.setItem("NewCheckInDate", (Moment(String(new Date(data.coming))).format('YYYY-MM-DD')))
//         }
//         sessionStorage.setItem("NewCheckOutDate", (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')))
//         sessionStorage.setItem("NewAdultCount", (data.adult === undefined ? data1['data1'][0]['data1']["numberOfAdults"] : data.adult.label))
//         sessionStorage.setItem("NewChildrenCount", (data.child === undefined ? data1['data1'][0]['data1']["numberOfChildren"] : data.child.label))
//         sessionStorage.setItem("NewQuantityCount", (data.room === undefined ? data1['data1'][0]['data1']["numberOfRooms"] : data.room.label))
//         setData(data)
//         let adultCount = (data.adult === undefined ? data1['data1'][0]['data1']["numberOfAdults"] : data.adult.label);
//         let childCount = (data.child === undefined ? data1['data1'][0]['data1']["numberOfChildren"] : data.child.label);
//         let count = 3;
//         if ((data.adult === undefined ? data1['data1'][0]['data1']["numberOfAdults"] : Number(data.adult.label)) === 2) {
//             count = 4
//         }
//         else if ((data.adult === undefined ? data1['data1'][0]['data1']["numberOfAdults"] : Number(data.adult.label)) === 3) {
//             count = 3;
//         }
//         let totalCount = Number(adultCount) + Number(childCount);
//         if (totalCount > count) {
//             setUpdatedRate(false)
//             let message = '<b>You have Exceeded PAX Count. \n Please Select adults or children properly. </b> \n (You can select maximum 2 adults and 2 children or maximum 3 adults)'
//             handleError(message)
//         }
//         else {
//             setStayNotification(false)
//             // setChildrenCheck(false)
//             const CheckAvailablity = JSON.stringify({
//                 hotelID: 1,
//                 tempReservationID: data1['data1'][0]['data1']['tempReservationID'],
//                 reservationID: data1['data1'][0]['data1']['id'],
//                 roomTypeID: data1['data1'][0]['data1']['roomTypeID'],
//                 source: data1['data1'][0]['data1']['Type'],
//                 companyID: data1['data1'][0]['data1']['companyID'],
//                 checkIn: (data.coming === undefined ? data1['data1'][0]['data1']['arrivalDate'] : (Moment(String(new Date(data.coming))).format('YYYY-MM-DD'))),
//                 checkOut: (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')),
//                 adults: (data.adult === undefined ? data1['data1'][0]['data1']["numberOfAdults"] : data.adult.label),
//                 children: (data.child === undefined ? data1['data1'][0]['data1']["numberOfChildren"] : data.child.label),
//                 quantity: (data.room === undefined ? data1['data1'][0]['data1']["numberOfRooms"] : data.room.label),
//             })

//             //send data and take updated dates
//             fetchx(API_URL + '/updateStayInformation', {
//                 method: 'PUT',
//                 body: CheckAvailablity,
//                 headers: {
//                     'Content-type': 'application/json; charset=UTF-8'
//                 }
//             })
//                 .then((res) => res.json())
//                 .then(postres => {

//                     //If rooms are not available on dates, throw error
//                     if (typeof (postres['data']) === 'string') {
//                         setUpdatedRate(false)
//                         handleError(postres['data'])
//                     }
//                     else {
//                         const GetRateCode = JSON.stringify({
//                             tempReservationID: data1['data1'][0]['data1']['tempReservationID'],
//                             source: data1['data1'][0]['data1']['Type'],
//                             checkIn: postres['data']['newArrival'],
//                             checkin1: (data.coming === undefined ? data1['data1'][0]['data1']['arrivalDate'] : (Moment(String(new Date(data.coming))).format('YYYY-MM-DD'))),
//                             checkout1: (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')),
//                             checkOut: postres['data']['newDeparture'],
//                             adults: postres['data']['newAdult'],
//                             children: postres['data']['newChild'],
//                             quantity: (data.room === undefined ? data1['data1'][0]['data1']["numberOfRooms"] : data.room.label),
//                             isMain: data1['data1'][0]['data1']['isMain'],
//                             mainReservationID: data1['data1'][1][0]['tempReservationID'],
//                             mainReservationCheckIn: data1['data1'][1][0]['arrivalDate'],
//                             mainReservationCheckOut: data1['data1'][1][0]['departureDate'],
//                             sharingID: data1['data1'][0]['data1']['sharingID'],
//                             mainReservationTempID: data1['data1'][1][0]['id'],
//                         })

//                         //API to get updated rates (Daily Details)
//                         fetchx(API_URL + '/getUpdatedRateForStayModification', {
//                             method: 'POST',
//                             body: GetRateCode,
//                             headers: {
//                                 'Content-type': 'application/json; charset=UTF-8'
//                             }
//                         })
//                             .then((rateCode) => rateCode.json())
//                             .then(rateCodeSelection => {
//                                 if (typeof (rateCodeSelection['data']) === "string") {
//                                     setUpdatedRate(false)
//                                     handleError(rateCodeSelection['data'])
//                                 }
//                                 else {
//                                     let rateSummary = JSON.stringify({
//                                         rateSummary: rateCodeSelection['data'],
//                                         rateCode: data1['data1'][0]['data1']['rateCodeID'],
//                                         roomTypeID: data1['data1'][0]['data1']['roomTypeID']
//                                     })

//                                     //API to show rate summary
//                                     setUpdatedRate(rateCodeSelection['data'])
//                                     fetchx(API_URL + '/showRateSummary', {
//                                         method: 'POST',
//                                         body: rateSummary,
//                                         headers: {
//                                             'Content-type': 'application/json; charset=UTF-8'
//                                         }
//                                     })
//                                         .then((rateSummary) => rateSummary.json())
//                                         .then(displayRateSummary => {
//                                             for (const item of displayRateSummary['data']) {
//                                                 subTotal = subTotal + item.subTotal;
//                                                 totalTaxGenerated = totalTaxGenerated + item.totalTaxGenerated;
//                                                 total = total + item.total;
//                                                 totalDiscount = totalDiscount + item.totalDiscount;
//                                             }
//                                             totalCostOfStay = total * sessionStorage.getItem("NewQuantityCount")
//                                             setDisplayRateSummary(displayRateSummary['data'])
//                                         })
//                                 }
//                             })
//                             .catch((err) => {
//                                 console.log(err.message)
//                             })
//                     }
//                 })
//                 .catch((err) => {
//                     console.log(err)
//                 })
//         }
//     }


//     // For sharer highlighting date part
//     const getRowStyle = params => {
//         let rowDate = new Date(params.data.inventory_date);
//         let checkDate1 = new Date(sessionStorage.getItem('checkDate1'));
//         let checkDate2 = new Date(sessionStorage.getItem('checkDate2'));
    
//         // Check if rowDate is on the specified day
//         if (checkDate1.toDateString() === checkDate2.toDateString() && rowDate.getTime() === checkDate1.getTime() && !data1['data1'][0]['data1']['isMain']) {
//             return { backgroundColor: 'yellow' };
//         }
    
//         // Check if rowDate is between checkDate1 and the day before checkDate2 (inclusive) and isMain is false
//         let dayBeforeCheckDate2 = new Date(checkDate2);
//         dayBeforeCheckDate2.setDate(dayBeforeCheckDate2.getDate() - 1);
        
//         if (rowDate >= checkDate1 && rowDate <= dayBeforeCheckDate2 && !data1['data1'][0]['data1']['isMain']) {
//             return { backgroundColor: 'yellow' };
//         }
    
//         return null;
//     };


//     const defaultColDef = useMemo(() => (
//         {
//             sortable: true,
//             filter: true,
//             filterParams: {
//                 buttons: ['apply', 'reset']
//             },
//         }
//     ))


//     //AG-GRID columns to show daily details
//     const [columnDefs1, setColumnDefs1] = useState([
//         { headerName: 'Date', field: 'inventory_date', maxWidth: 120, sort: 'asc' },
//         { headerName: 'Room Type', field: 'roomType', maxWidth: 125 },
//         {
//             headerName: 'Total Before Discount', field: 'totalBeforeDiscount', maxWidth: 195,
//             valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//         {
//             headerName: 'Total Discount', field: 'totalDiscount', maxWidth: 150,
//             valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//         {
//             headerName: 'Total After Discount', field: 'total', suppressSizeToFit: true, maxWidth: 195,
//             valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//         {
//             headerName: 'Base Rate', field: 'baseprice', suppressSizeToFit: true, maxWidth: 140,
//             valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//         {
//             headerName: 'Extra Adult Rate', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 125,
//             valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//         {
//             headerName: 'Children Rate', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 125,
//             valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//         {
//             headerName: 'Package Rate', field: 'packageRate', suppressSizeToFit: true, maxWidth: 125, valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//     ])


//     //AG-GRID columns to show rate summary
//     const [columnDefs2, setColumnDefs2] = useState([
//         { headerName: 'Date', field: 'Date', maxWidth: 120, sort: 'asc' },
//         { headerName: 'RoomType', field: 'roomType', suppressSizeToFit: true, maxWidth: 120 },
//         {
//             headerName: 'Total Before Discount', field: 'totalBeforeDiscount', maxWidth: 195,
//             valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//         {
//             headerName: 'Total Discount', field: 'totalDiscount', maxWidth: 150,
//             valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//         {
//             headerName: 'Total After Discount', field: 'subTotal', suppressSizeToFit: true, maxWidth: 195,
//             valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//         {
//             headerName: 'Tax', field: 'totalTaxGenerated', suppressSizeToFit: true, maxWidth: 100,
//             valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//         {
//             headerName: 'Total With Tax', field: 'total', suppressSizeToFit: true, maxWidth: 150,
//             valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//         {
//             headerName: 'Room Rate', field: 'roomRevenue', suppressSizeToFit: true, maxWidth: 140,
//             valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//         {
//             headerName: 'Package Rate', field: 'packageRevenue', suppressSizeToFit: true, maxWidth: 140,
//             valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//         {
//             headerName: 'Extra Adult Price', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 165,
//             valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//         {
//             headerName: 'Child Price', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 125,
//             valueFormatter: (params) => {
//                 return params.value.toFixed(2);
//             }
//         },
//         { headerName: 'PackageCode', field: 'packageCode', suppressSizeToFit: true, maxWidth: 140 },
//     ])


//     // On reset button function
//     const handleReset1 = () => {
//         window.location.reload()
//     }


//     // Final submit button function
//     const finalSubmit = () => {

//         if(data1.data2 && data1.data2 == 1){
//             let createasset = JSON.stringify({
//                 "hotelID": 1,
//                 "sharingID": data1['data1'][0]['data1']['sharingID'],
          
//               });
//               console.log(createasset);
//               let result = fetchx(API_URL+"/rollOverData", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: createasset,
//               }).then(data => data.json())
//               .then((res) => {
//                 console.log(res)       
//               })
//         }


//         setOpen(true);
//         // Start a timer to check if the response takes more than 5 seconds
//         const timeout = setTimeout(() => {
//             setShowSecondaryMessage(true);
//         }, 5000);
//         const finalData = JSON.stringify({
//             tempReservationID: data1['data1'][0]['data1']['tempReservationID'],
//             reservationID: data1['data1'][0]['data1']['id'],
//             dailyDetails: UpdatedRate,
//             sharingID: data1['data1'][0]['data1']['sharingID'],
//             checkIn: sessionStorage.getItem("NewCheckInDate"),
//             checkOut: sessionStorage.getItem("NewCheckOutDate"),
//             adults: sessionStorage.getItem("NewAdultCount"),
//             children: sessionStorage.getItem("NewChildrenCount"),
//             quantity: sessionStorage.getItem("NewQuantityCount"),
//             isMain: data1['data1'][0]['data1']['isMain'],
//             mainReservationID: data1['data1'][1][0]['tempReservationID'],
//             mainReservationCheckIn: data1['data1'][1][0]['arrivalDate'],
//             mainReservationCheckOut: data1['data1'][1][0]['departureDate'],
//             mainReservationTempID: data1['data1'][1][0]['id'],
//             roomID: data1['data1'][1][0]['room'],
//             hotelID: 1
//         })
//         fetchx(API_URL + '/updateStayDetailsOfReservation', {
//             method: 'POST',
//             body: finalData,
//             headers: {
//                 'Content-type': 'application/json; charset=UTF-8'
//             }
//         })
//             .then((res) => res.json())
//             .then(postres => {
//                 if (postres.statusCode === 200) {

//                     if(data1.data2 && data1.data2 == 1){
//                         let createasset = JSON.stringify({
//                             "hotelID": 1,
//                             "reservationID": data1['data1'][0]['data1']['id'],
                      
//                           });
//                           console.log(createasset);
//                           let result = fetchx(API_URL+"/updateIsRollOverInReservation", {
//                             method: "POST",
//                             headers: { "Content-Type": "application/json" },
//                             body: createasset,
//                           }).then(data => data.json())
//                           .then((res) => {
//                             console.log(res)       
//                           })
//                     }
//                     setOpen(false);
//                     handleSuccess()
//                 }
//             })
//     }


//     return (
//         <div>

//             {/* Form to take new dates */}
//             <Card>
//                 <CardBody>
//                     <Form onSubmit={handleSubmit(onSubmit)}>
//                         <Row>
//                             {
//                                 (data1['data1'][0]['data1']["reservationStatus"] === "Checked In" || data1['data1'][0]['data1']["reservationStatus"] === "Due Out") ? (
//                                     <Col md='4' sm='12'>
//                                         <div className='mb-1'>
//                                             <Label className='form-label' for='coming'>
//                                                 Arrival Date
//                                             </Label>
//                                             <Controller
//                                                 control={control}
//                                                 id='coming'
//                                                 name='coming'
//                                                 render={({ field }) => (
//                                                     <Input
//                                                         options={options}
//                                                         placeholder='YYYY-MM-DD '
//                                                         className={classnames('form-control')}
//                                                         {...field}
//                                                         disabled={true}
//                                                         value={data1['data1'][0]['data1']["arrivalDate"]}
//                                                     />
//                                                 )}
//                                             />
//                                         </div>
//                                     </Col>
//                                 ) : (
//                                     <Col md='4' sm='12'>
//                                         <div className='mb-1'>
//                                             <Label className='form-label' for='coming'>
//                                                 Arrival Date
//                                             </Label>
//                                             <Controller
//                                                 control={control}
//                                                 id='coming'
//                                                 name='coming'
//                                                 defaultValue={data1['data1'][0]['data1']["arrivalDate"] < arrivalDate ? arrivalDate : data1['data1'][0]['data1']["arrivalDate"]}
//                                                 render={({ field }) => (
//                                                     <Flatpickr
//                                                         options={options}
//                                                         placeholder='YYYY-MM-DD '
//                                                         className={classnames('form-control')}
//                                                         {...field}
//                                                     />
//                                                 )}
//                                             />
//                                         </div>
//                                     </Col>
//                                 )
//                             }


//                             {/* Departure Date */}
//                             {(data1.data2 && data1.data2 == 1) ?
//                                 <Col md='4' sm='12'>
//                                     <div className='mb-1'>
//                                         <Label className='form-label' for='departure'>
//                                             Departure Date
//                                         </Label>
//                                         <Controller
//                                             control={control}
//                                             id='departure'
//                                             name='departure'
//                                             defaultValue={data1['data1'][0]['data1']["departureDate"]}
//                                             render={({ field }) => (
//                                                 <Input
//                                                     disabled={true}
//                                                     options={optionsToDate}
//                                                     placeholder='YYYY-MM-DD '
//                                                     className={classnames('form-control')}
//                                                     {...field}
//                                                 />
//                                             )}
//                                         />
//                                     </div>

//                                 </Col>
//                                 : <Col md='4' sm='12'>
//                                     <div className='mb-1'>
//                                         <Label className='form-label' for='departure'>
//                                             Departure Date
//                                         </Label>
//                                         <Controller
//                                             control={control}
//                                             id='departure'
//                                             name='departure'
//                                             defaultValue={data1['data1'][0]['data1']["departureDate"]}
//                                             render={({ field }) => (
//                                                 <Flatpickr
//                                                     options={optionsToDate}
//                                                     placeholder='YYYY-MM-DD '
//                                                     className={classnames('form-control')}
//                                                     {...field}
//                                                 />
//                                             )}
//                                         />
//                                     </div>
//                                 </Col>
//                             }

//                             {/* Adult, children and number of rooms */}
//                             {
//                                 (data1['data1'][0]['data1']["subBookingID"] === null && data1['data1'][0]['data1']["isMain"] === 1) ? (
//                                     <>
//                                         {(adultCount == 1 && adultCount !== false) &&
//                                             <>
//                                                 <Col md='4' sm='8'>
//                                                     <div className='mb-1'>
//                                                         <Label className='form-label' for='adult'>
//                                                             Adults
//                                                         </Label>
//                                                         <Controller
//                                                             defaultValue={DefaultOptionAdults}
//                                                             id='adult'
//                                                             control={control}
//                                                             name='adult'
//                                                             render={({ field }) => (
//                                                                 <Select
//                                                                     isClearable
//                                                                     options={AdultOptions}
//                                                                     classNamePrefix='select'
//                                                                     theme={selectThemeColors}
//                                                                     className={classnames('react-select')}
//                                                                     {...field} />
//                                                             )} />
//                                                     </div>
//                                                 </Col>
//                                                 <Col md='4' sm='8'>
//                                                     <div className='mb-1'>
//                                                         <Label className='form-label' for='child'>
//                                                             Children
//                                                         </Label>
//                                                         <Controller
//                                                             id='child'
//                                                             control={control}
//                                                             name='child'
//                                                             defaultValue={DefaultOptionChild}
//                                                             render={({ field }) => (
//                                                                 <Select
//                                                                     isClearable
//                                                                     options={childrenOptions}
//                                                                     classNamePrefix='select'
//                                                                     theme={selectThemeColors}
//                                                                     className={classnames('react-select')}
//                                                                     {...field} />
//                                                             )} />
//                                                     </div>
//                                                 </Col>
//                                                 {(data1['data1'][0]['data1']["reservationStatus"] === 'Checked In' || data1['data1'][0]['data1']["reservationStatus"] === 'Due Out') ?
//                                                     <>
//                                                         <Col md='4' sm='8'>
//                                                             <div className='mb-1'>
//                                                                 <Label className='form-label' for='room'>
//                                                                     Number Of Rooms
//                                                                 </Label>
//                                                                 <Controller
//                                                                     id='room'
//                                                                     control={control}
//                                                                     name='room'
//                                                                     render={({ field }) => (
//                                                                         <Input
//                                                                             isClearable
//                                                                             options={RoomQuantityOptions}
//                                                                             classNamePrefix='select'
//                                                                             theme={selectThemeColors}
//                                                                             className={classnames('react-select')}
//                                                                             {...field}
//                                                                             disabled={true}
//                                                                             value={data1['data1'][0]['data1']["numberOfRooms"]}
//                                                                         />
//                                                                     )} />
//                                                             </div>
//                                                         </Col> </> :
//                                                     <>
//                                                         <Col md='4' sm='8'>
//                                                             <div className='mb-1'>
//                                                                 <Label className='form-label' for='room'>
//                                                                     Number Of Rooms
//                                                                 </Label>
//                                                                 <Controller
//                                                                     id='room'
//                                                                     control={control}
//                                                                     name='room'
//                                                                     defaultValue={DefaultOptionQuantity}
//                                                                     render={({ field }) => (
//                                                                         <Select
//                                                                             isClearable
//                                                                             options={RoomQuantityOptions}
//                                                                             classNamePrefix='select'
//                                                                             theme={selectThemeColors}
//                                                                             className={classnames('react-select')}
//                                                                             {...field} />
//                                                                     )} />
//                                                             </div>
//                                                         </Col>
//                                                     </>
//                                                 }
//                                             </>
//                                         }
//                                         {(adultCount == 2 && adultCount !== false) &&
//                                             <>
//                                                 <Col md='4' sm='8'>
//                                                     <div className='mb-1'>
//                                                         <Label className='form-label' for='adult'>
//                                                             Adults
//                                                         </Label>
//                                                         <Controller
//                                                             defaultValue={DefaultOptionAdults}
//                                                             id='adult'
//                                                             control={control}
//                                                             name='adult'
//                                                             render={({ field }) => (
//                                                                 <Select
//                                                                     isClearable
//                                                                     options={AdultOptions2}
//                                                                     classNamePrefix='select'
//                                                                     theme={selectThemeColors}
//                                                                     className={classnames('react-select')}
//                                                                     {...field} />
//                                                             )} />
//                                                     </div>
//                                                 </Col>
//                                                 <Col md='4' sm='8'>
//                                                     <div className='mb-1'>
//                                                         <Label className='form-label' for='child'>
//                                                             Children
//                                                         </Label>
//                                                         <Controller
//                                                             id='child'
//                                                             control={control}
//                                                             name='child'
//                                                             defaultValue={DefaultOptionChild}
//                                                             render={({ field }) => (
//                                                                 <Select
//                                                                     isClearable
//                                                                     options={childrenOptions}
//                                                                     classNamePrefix='select'
//                                                                     theme={selectThemeColors}
//                                                                     className={classnames('react-select')}
//                                                                     {...field} />
//                                                             )} />
//                                                     </div>
//                                                 </Col>
//                                                 {(data1['data1'][0]['data1']["reservationStatus"] === 'Checked In' || data1['data1'][0]['data1']["reservationStatus"] === 'Due Out') ?
//                                                     <>
//                                                         <Col md='4' sm='8'>
//                                                             <div className='mb-1'>
//                                                                 <Label className='form-label' for='room'>
//                                                                     Number Of Rooms
//                                                                 </Label>
//                                                                 <Controller
//                                                                     id='room'
//                                                                     control={control}
//                                                                     name='room'
//                                                                     render={({ field }) => (
//                                                                         <Input
//                                                                             isClearable
//                                                                             options={RoomQuantityOptions}
//                                                                             classNamePrefix='select'
//                                                                             theme={selectThemeColors}
//                                                                             className={classnames('react-select')}
//                                                                             {...field}
//                                                                             disabled={true}
//                                                                             value={data1['data1'][0]['data1']["numberOfRooms"]}
//                                                                         />
//                                                                     )} />
//                                                             </div>
//                                                         </Col> 
//                                                         </> 
//                                                         :
//                                                     <>
//                                                         <Col md='4' sm='8'>
//                                                             <div className='mb-1'>
//                                                                 <Label className='form-label' for='room'>
//                                                                     Number Of Rooms
//                                                                 </Label>
//                                                                 <Controller
//                                                                     id='room'
//                                                                     control={control}
//                                                                     name='room'
//                                                                     defaultValue={DefaultOptionQuantity}
//                                                                     render={({ field }) => (
//                                                                         <Select
//                                                                             isClearable
//                                                                             options={RoomQuantityOptions}
//                                                                             classNamePrefix='select'
//                                                                             theme={selectThemeColors}
//                                                                             className={classnames('react-select')}
//                                                                             {...field} />
//                                                                     )} />
//                                                             </div>
//                                                         </Col>
//                                                     </>
//                                                 }
//                                             </>
//                                         }
//                                         {(adultCount == 3 && adultCount !== false) &&
//                                             <>
//                                                 <Col md='4' sm='8'>
//                                                     <div className='mb-1'>
//                                                         <Label className='form-label' for='adult'>
//                                                             Adults
//                                                         </Label>
//                                                         <Controller
//                                                             id='adult'
//                                                             control={control}
//                                                             name='adult'
//                                                             render={({ field }) => (
//                                                                 <Input
//                                                                     isClearable
//                                                                     options={AdultOptions}
//                                                                     classNamePrefix='select'
//                                                                     theme={selectThemeColors}
//                                                                     className={classnames('react-select')}
//                                                                     {...field}
//                                                                     disabled={true}
//                                                                     value={data1['data1'][0]['data1']["numberOfAdults"]} />
//                                                             )} />
//                                                     </div>
//                                                 </Col>
//                                                 <Col md='4' sm='8'>
//                                                     <div className='mb-1'>
//                                                         <Label className='form-label' for='child'>
//                                                             Children
//                                                         </Label>
//                                                         <Controller
//                                                             id='child'
//                                                             control={control}
//                                                             name='child'
//                                                             render={({ field }) => (
//                                                                 <Input
//                                                                     isClearable
//                                                                     options={childrenOptions}
//                                                                     classNamePrefix='select'
//                                                                     theme={selectThemeColors}
//                                                                     className={classnames('react-select')}
//                                                                     {...field}
//                                                                     disabled={true}
//                                                                     value={data1['data1'][0]['data1']["numberOfChildren"]} />
//                                                             )} />
//                                                     </div>
//                                                 </Col>
//                                                 {(data1['data1'][0]['data1']["reservationStatus"] === 'Checked In' || data1['data1'][0]['data1']["reservationStatus"] === 'Due Out') ? 
//                                                 <> 
//                                                 <Col md='4' sm='8'>
//                                                     <div className='mb-1'>
//                                                         <Label className='form-label' for='room'>
//                                                             Number Of Rooms
//                                                         </Label>
//                                                         <Controller
//                                                             id='room'
//                                                             control={control}
//                                                             name='room'
//                                                             render={({ field }) => (
//                                                                 <Input
//                                                                     isClearable
//                                                                     options={RoomQuantityOptions}
//                                                                     classNamePrefix='select'
//                                                                     theme={selectThemeColors}
//                                                                     className={classnames('react-select')}
//                                                                     {...field} 
//                                                                     disabled={true}
//                                                                     value={data1['data1'][0]['data1']["numberOfRooms"]}
//                                                                     />
//                                                             )} />
//                                                     </div>
//                                                 </Col> </>: 
//                                                 <> 
//                                                 <Col md='4' sm='8'>
//                                                     <div className='mb-1'>
//                                                         <Label className='form-label' for='room'>
//                                                             Number Of Rooms
//                                                         </Label>
//                                                         <Controller
//                                                             id='room'
//                                                             control={control}
//                                                             name='room'
//                                                             defaultValue={DefaultOptionQuantity}
//                                                             render={({ field }) => (
//                                                                 <Select
//                                                                     isClearable
//                                                                     options={RoomQuantityOptions}
//                                                                     classNamePrefix='select'
//                                                                     theme={selectThemeColors}
//                                                                     className={classnames('react-select')}
//                                                                     {...field} />
//                                                             )} />
//                                                     </div>
//                                                 </Col>
//                                                 </>
//                                                 }
//                                             </>
//                                         }
//                                     </>
//                                 ) :
//                                     (
//                                         <>
//                                             <Col md='4' sm='8'>
//                                                 <div className='mb-1'>
//                                                     <Label className='form-label' for='adult'>
//                                                         Adults
//                                                     </Label>
//                                                     <Controller
//                                                         id='adult'
//                                                         control={control}
//                                                         name='adult'
//                                                         render={({ field }) => (
//                                                             <Input
//                                                                 isClearable
//                                                                 options={AdultOptions}
//                                                                 classNamePrefix='select'
//                                                                 theme={selectThemeColors}
//                                                                 className={classnames('react-select')}
//                                                                 {...field}
//                                                                 disabled={true}
//                                                                 value={data1['data1'][0]['data1']["numberOfAdults"]} />
//                                                         )} />
//                                                 </div>
//                                             </Col>
//                                             <Col md='4' sm='8'>
//                                                 <div className='mb-1'>
//                                                     <Label className='form-label' for='child'>
//                                                         Children
//                                                     </Label>
//                                                     <Controller
//                                                         id='child'
//                                                         control={control}
//                                                         name='child'
//                                                         render={({ field }) => (
//                                                             <Input
//                                                                 isClearable
//                                                                 options={childrenOptions}
//                                                                 classNamePrefix='select'
//                                                                 theme={selectThemeColors}
//                                                                 className={classnames('react-select')}
//                                                                 {...field}
//                                                                 disabled={true}
//                                                                 value={data1['data1'][0]['data1']["numberOfChildren"]} />
//                                                         )} />
//                                                 </div>
//                                             </Col>
//                                             <Col md='4' sm='8'>
//                                                 <div className='mb-1'>
//                                                     <Label className='form-label' for='room'>
//                                                         Number Of Rooms
//                                                     </Label>
//                                                     <Controller
//                                                         id='room'
//                                                         control={control}
//                                                         name='room'
//                                                         render={({ field }) => (
//                                                             <Input
//                                                                 isClearable
//                                                                 options={RoomQuantityOptions}
//                                                                 classNamePrefix='select'
//                                                                 theme={selectThemeColors}
//                                                                 className={classnames('react-select')}
//                                                                 {...field}
//                                                                 disabled={true}
//                                                                 value={data1['data1'][0]['data1']["numberOfRooms"]} />
//                                                         )} />
//                                                 </div>
//                                             </Col>
//                                         </>
//                                     )
//                             }

//                             <div align='end'>
//                                 <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset1}>
//                                     Start Over
//                                 </Button>
//                                 <Button color='primary' className='me-1' type='submit' onClick={() => { setStayNotification(!stayNotification) }}>
//                                     Get New Rates
//                                 </Button>
//                             </div>


//                         </Row>
//                     </Form>
//                 </CardBody>
//             </Card>


//             {/* Daily details table */}
//             {
//                 UpdatedRate !== false &&
//                 <div>
//                     <div className="ag-theme-alpine" style={{ height: 220 }}>
//                         <AgGridReact
//                             ref={gridRef}
//                             rowData={UpdatedRate}
//                             columnDefs={columnDefs1}
//                             animateRows={true}
//                             getRowStyle={getRowStyle}
//                             rowSelection='multiple'
//                             onCellClicked={cellClickedListener}
//                             paginationPageSize='10'
//                             defaultColDef={defaultColDef}
//                             headerColor="ddw-primary"
//                         />
//                     </div>
//                     <br />
//                     <div align='end' className='buttons' >
//                         <Button color='primary' className='me-1' type='submit' onClick={handleRateSummary}>
//                             View Rate Summary
//                         </Button>
//                     </div>
//                 </div>
//             }


//             {/* Rate summary table */}
//             {
//                 rateSummaryModal === true &&
//                 <div>
//                     <Modal isOpen={rateSummaryModal} toggle={() => setRateSummaryModal(!rateSummaryModal)} className='modal-xl'>
//                         <ModalHeader toggle={() => setRateSummaryModal(!rateSummaryModal)}>
//                             Rate Summary Of Modified Reservation
//                         </ModalHeader>
//                         <ModalBody className='pb-3 px-sm-5 mx-20'>

//                             <div className="ag-theme-alpine" style={{ height: 385 }}>
//                                 <AgGridReact
//                                     ref={gridRef}
//                                     rowData={displayRatesummary}
//                                     columnDefs={columnDefs2}
//                                     animateRows={true}
//                                     rowSelection='multiple'
//                                     getRowStyle={getRowStyle}
//                                     onCellClicked={cellClickedListener}
//                                     paginationPageSize='10'
//                                     defaultColDef={defaultColDef}
//                                     headerColor="ddw-primary"
//                                 />
//                             </div>
//                             <div>
//                                 <br></br><br></br>
//                                 <h3><strong>Total Without Tax &nbsp;&nbsp;&nbsp;&nbsp;: </strong>&nbsp;&nbsp;&nbsp;&nbsp;{(parseFloat(subTotal).toFixed(2))}</h3>
//                                 <h3><strong>Total Tax &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:        </strong>&nbsp;&nbsp;&nbsp;&nbsp;{(parseFloat(totalTaxGenerated).toFixed(2))}</h3>
//                                 <h3><strong>Total With Tax &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </strong>&nbsp;&nbsp;&nbsp;{(parseFloat(total).toFixed(2))}</h3>
//                                 <h3><strong>Total Cost Of Stay &nbsp;&nbsp;&nbsp;&nbsp;: </strong>&nbsp;&nbsp;&nbsp;{(parseFloat(totalCostOfStay).toFixed(2))}</h3>


//                             </div>


//                             <br></br>
//                             {/* <br></br> */}
//                             <div>
//                                 <Button color='primary' className='me-1' style={{ float: 'right' }} onClick={finalSubmit}>
//                                     Update Reservation
//                                 </Button>
//                                 <Button outline color='secondary' className='me-1' style={{ float: 'right' }} onClick={modalClose}>
//                                     Cancel
//                                 </Button>
//                                 <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
//                                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                                         <h1 style={{ fontWeight: 'bold', color: 'white' }}>
//                                             Please wait while we are updating your reservation
//                                         </h1>
//                                         {showSecondaryMessage && (
//                                             <h1 style={{ fontWeight: 'bold', color: 'white' }}>
//                                                 We're processing your request, which may take a little longer due to additional data. Please be patient!
//                                             </h1>
//                                         )}
//                                         <CircularProgress color="inherit" />
//                                     </div>
//                                 </Backdrop>

//                             </div>
//                         </ModalBody>
//                     </Modal>
//                 </div>
//             }

//         </div>
//     )
// }


// export default StayNotification 


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
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'


// ** Reactstrap Imports
import { Button, Spinner, Modal, ModalHeader, ModalBody, Card, CardBody, Row, Col, Form, Label, NavLink, Input } from 'reactstrap'

import { useNavigate } from "react-router-dom"

// import 'ag-grid-enterprise'
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

sessionStorage.removeItem("NewCheckInDate")
sessionStorage.removeItem("NewCheckOutDate")
sessionStorage.removeItem("NewAdultCount")
sessionStorage.removeItem("NewChildrenCount")
sessionStorage.removeItem("NewQuantityCount")


// Dropdown options for adult field
const AdultOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' }
]


// Dropdown options for adult field
const AdultOptions2 = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
]


// Dropdown options for children field
const childrenOptions = [
    { value: '0', label: '0' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
]


// Dropdown options for number of rooms field
const RoomQuantityOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' }, 
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: '13', label: '13' },
    { value: '14', label: '14' },
    { value: '15', label: '15' }
]


const defaultValues = {
    checkIn: '',
    checkOut: '',
    adults: null,
    children: null,
    quantity: null
}


let subTotal;
let totalTaxGenerated;
let total;
let totalDiscount;
let totalCostOfStay;


const StayNotification = (data1) => {
    const gridRef = useRef();
    const { setError, formState: { errors }, setValue } = useForm();
    const [open, setOpen] = useState(false);
    const [adultCount, setAdultCount] = useState(false)
    const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
    const [stayNotification, setStayNotification] = useState();
    const [data, setData] = useState(null)
    const navigate = useNavigate()
    const [UpdatedRate, setUpdatedRate] = useState(false)
    const [displayRatesummary, setDisplayRateSummary] = useState(false)
    const [rateSummaryModal, setRateSummaryModal] = useState(false)
    const { reset1, handleSubmit, control, watch } = useForm({ defaultValues })
    const [arrivalDate, setArrivalDate] = useState();
    const [departureDate, setDepartureDate] = useState()
    const [packageName, setPackageName] = useState([])
    const [newPackageID, setNewPackageID] = useState()
    const [newPackageName, setNewPackageName] = useState()
    const [openPackageNewDate, setOpenPackageNewDate] = useState(false)
    const [newDateRange, setNewDateRange] = useState(null);
    const [isClicked, setDisableSubmit] = useState(false);




    // Default adult option loading
    const DefaultOptionAdults = {
        value: data1['data1'][0]['data1']["numberOfAdults"],
        label: data1['data1'][0]['data1']["numberOfAdults"]
    }


    //Default Children option loading 
    const DefaultOptionChild = {
        value: data1['data1'][0]['data1']["numberOfChildren"],
        label: data1['data1'][0]['data1']["numberOfChildren"]
    }


    // Default number of rooms options loading
    const DefaultOptionQuantity = {
        value: data1['data1'][0]['data1']["numberOfRooms"],
        label: data1['data1'][0]['data1']["numberOfRooms"]
    }


    // get sharingID count
    useEffect(() => {

        // getPackageDescription
        fetchx(API_URL + '/getPackageCode?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setPackageName(resp['data'])
            })

        fetchx(API_URL + '/getReservationBySharingID', {
            method: 'POST',
            body: JSON.stringify({ sharingID: data1.data1[0].data1.sharingID }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
            .then((res) => res.json())
            .then(postres => {
                setAdultCount(postres['data'].length)
            });

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


    // on click listener
    const cellClickedListener = useCallback(event => {
        // console.log('cellClicked', event)
    })


    // Modal close button.
    const modalClose = () => {
        setRateSummaryModal(false)
        setStayNotification(false);
        setModal(false)
    }


    // error handling for same guest addition
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


    //Flatpicker
    // const today = Moment().format('YYYY-MM-DD')
    const coming = watch('coming');
    const departure = watch('departure');

    let optionsToDate;

    if((data1['data1'][0]['data1']["reservationStatus"] == 'Checked In' || data1['data1'][0]['data1']["reservationStatus"] == 'Due Out') && data1['data1'][0]['data1']["isMain"] !== 0){
        optionsToDate = {
            minDate:  arrivalDate
         }
    }

    if((data1['data1'][0]['data1']["reservationStatus"] == 'Due In' || data1['data1'][0]['data1']["reservationStatus"] == 'Reserved') && data1['data1'][0]['data1']["isMain"] !== 0){
        // console.log(data1['data1'][0]['data1']["arrivalDate"], arrivalDate, Moment(String(new Date(coming))).format('YYYY-MM-DD'))
        optionsToDate = {
            minDate:  Moment(String(new Date(coming))).format('YYYY-MM-DD') === 'Invalid date' ? data1['data1'][0]['data1']["arrivalDate"] : Moment(String(new Date(coming))).format('YYYY-MM-DD')
         }
    }




    let options;
    if(data1.data2 && data1.data2 == 1 && departureDate!== undefined){

    // Option for arrival date
    options = {
        minDate: arrivalDate,
        maxDate: departureDate // Set maxDate to limit it to one day up to tomorrow
    };
    
}else{
     options = {
        minDate: arrivalDate
    }
}


    if ((data1['data1'][0]['data1']["reservationStatus"] == 'Checked In' || data1['data1'][0]['data1']["reservationStatus"] == 'Due Out') && data1['data1'][0]['data1']["isMain"] == 0) {
        optionsToDate = {
            maxDate: data1['data1'][1][0]['departureDate']
        }
    }


    // Options for arrival date and departure date for sharer
    if ((data1['data1'][0]['data1']["reservationStatus"] == 'Due In' || data1['data1'][0]['data1']["reservationStatus"] == 'Reserved') && data1['data1'][0]['data1']["isMain"] == 0) {
        options = {
            minDate: data1['data1'][1][0]['arrivalDate'] < arrivalDate ? arrivalDate : data1['data1'][1][0]['arrivalDate'],
            maxDate: data1['data1'][1][0]['departureDate']
        }
        optionsToDate = {
            minDate: Moment(String(new Date(coming))).format('YYYY-MM-DD') === 'Invalid date' ? data1['data1'][0]['data1']["departureDate"] : Moment(String(new Date(coming))).format('YYYY-MM-DD'),
            maxDate: data1['data1'][1][0]['departureDate']
        }
    }


    // Rate summary modal
    const handleRateSummary = () => {
        setRateSummaryModal(true)
    }


    // On success modal open
    const handleSuccess = () => {
        return MySwal.fire({
            title: 'Modify Reservation!!',
            text: 'Successfully updated Reservation',
            icon: 'success',
        },
            setTimeout(() => { navigate('') }, 1000)
        )
    }

    // On submit function
    const onSubmit = data => {




        if (newPackageID === undefined && data1['data1'][0]['data1']['isMain'] === 1 && data1['data1'][0]['data1']['rateCodeIsFit'] !== null &&
            ((Moment(new Date(coming)).format('YYYY-MM-DD') >= Moment(new Date(data1['data1'][1][0]['departureDate'])).format('YYYY-MM-DD') ||
                Moment(new Date(departure)).format('YYYY-MM-DD') > Moment(new Date(data1['data1'][1][0]['departureDate'])).format('YYYY-MM-DD')) || (Moment(new Date(coming)).format('YYYY-MM-DD') < Moment(new Date(data1['data1'][1][0]['arrivalDate'])).format('YYYY-MM-DD')))
                && !(
                    Moment(new Date(coming)).format('YYYY-MM-DD') === Moment(new Date(departure)).format('YYYY-MM-DD') && 
                    Moment(new Date(coming)).format('YYYY-MM-DD') === Moment(new Date(data1['data1'][1][0]['departureDate'])).format('YYYY-MM-DD') &&
                    Moment(new Date(coming)).format('YYYY-MM-DD') !== Moment(new Date(data1['data1'][1][0]['arrivalDate'])).format('YYYY-MM-DD')
                  )
                  &&
                  data1['data1'][0]['data1']['blockCodeID'] === null
            ) {

            return setOpenPackageNewDate(!openPackageNewDate);
        }


        subTotal = 0;
        totalTaxGenerated = 0;
        total = 0;
        totalDiscount = 0;
        totalCostOfStay = 0;
        sessionStorage.setItem('checkDate1', (data.coming === undefined ? data1['data1'][0]['data1']['arrivalDate'] : (Moment(String(new Date(data.coming))).format('YYYY-MM-DD'))))
        sessionStorage.setItem('checkDate2', (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')))

        if (data.coming === undefined) {
            sessionStorage.setItem("NewCheckInDate", data1['data1'][0]['data1']['arrivalDate'])
        }
        else {
            sessionStorage.setItem("NewCheckInDate", (Moment(String(new Date(data.coming))).format('YYYY-MM-DD')))
        }
        sessionStorage.setItem("NewCheckOutDate", (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')))
        sessionStorage.setItem("NewAdultCount", (data.adult === undefined ? data1['data1'][0]['data1']["numberOfAdults"] : data.adult.label))
        sessionStorage.setItem("NewChildrenCount", (data.child === undefined ? data1['data1'][0]['data1']["numberOfChildren"] : data.child.label))
        sessionStorage.setItem("NewQuantityCount", (data.room === undefined ? data1['data1'][0]['data1']["numberOfRooms"] : data.room.label))
        setData(data)
        let adultCount = (data.adult === undefined ? data1['data1'][0]['data1']["numberOfAdults"] : data.adult.label);
        let childCount = (data.child === undefined ? data1['data1'][0]['data1']["numberOfChildren"] : data.child.label);
        let count = 3;
        if ((data.adult === undefined ? data1['data1'][0]['data1']["numberOfAdults"] : Number(data.adult.label)) === 2) {
            count = 4
        }
        else if ((data.adult === undefined ? data1['data1'][0]['data1']["numberOfAdults"] : Number(data.adult.label)) === 3) {
            count = 3;
        }
        let totalCount = Number(adultCount) + Number(childCount);
        if (totalCount > count) {
            setUpdatedRate(false)
            let message = '<b>You have Exceeded PAX Count. \n Please Select adults or children properly. </b> \n (You can select maximum 2 adults and 2 children or maximum 3 adults)'
            handleError(message)
        }
        else {
            setStayNotification(false)
            // setChildrenCheck(false)
            const CheckAvailablity = JSON.stringify({
                hotelID: 1,
                tempReservationID: data1['data1'][0]['data1']['tempReservationID'],
                reservationID: data1['data1'][0]['data1']['id'],
                roomTypeID: data1['data1'][0]['data1']['roomTypeID'],
                source: data1['data1'][0]['data1']['Type'],
                companyID: data1['data1'][0]['data1']['companyID'],
                checkIn: (data.coming === undefined ? data1['data1'][0]['data1']['arrivalDate'] : (Moment(String(new Date(data.coming))).format('YYYY-MM-DD'))),
                checkOut: (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')),
                adults: (data.adult === undefined ? data1['data1'][0]['data1']["numberOfAdults"] : data.adult.label),
                children: (data.child === undefined ? data1['data1'][0]['data1']["numberOfChildren"] : data.child.label),
                quantity: (data.room === undefined ? data1['data1'][0]['data1']["numberOfRooms"] : data.room.label),
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

                    //If rooms are not available on dates, throw error
                    if (typeof (postres['data']) === 'string') {
                        setUpdatedRate(false)
                        handleError(postres['data'])
                    }
                    else {
                        const GetRateCode = JSON.stringify({
                            checkin1: (data.coming === undefined ? data1['data1'][0]['data1']['arrivalDate'] : (Moment(String(new Date(data.coming))).format('YYYY-MM-DD'))),
                            checkout1: (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')),
                            mainReservationID: data1['data1'][1][0]['tempReservationID'],
                            sharingID: data1['data1'][0]['data1']['sharingID'],
                            reservationID: data1['data1'][0]['data1']['id'],
                            newPackageID: newPackageID,
                            source: data1['data1'][0]['data1']['Type'],

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
                                if (typeof (rateCodeSelection['data']) === "string") {
                                    setUpdatedRate(false)
                                    handleError(rateCodeSelection['data'])
                                }
                                else {
                                    let rateSummary = JSON.stringify({
                                        rateSummary: rateCodeSelection['data'],
                                        rateCode: data1['data1'][0]['data1']['rateCodeID'],
                                        roomTypeID: data1['data1'][0]['data1']['roomTypeID']
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
                                            for (const item of displayRateSummary['data']) {
                                                subTotal = subTotal + item.subTotal;
                                                totalTaxGenerated = totalTaxGenerated + item.totalTaxGenerated;
                                                total = total + item.total;
                                                totalDiscount = totalDiscount + item.totalDiscount;
                                            }
                                            totalCostOfStay = total * sessionStorage.getItem("NewQuantityCount")
                                            setDisplayRateSummary(displayRateSummary['data'])
                                        })
                                }
                            })
                            .catch((err) => {
                                console.log(err.message)
                            })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }


    // For sharer highlighting date part
    const getRowStyle = params => {
        let rowDate = new Date(params.data.inventory_date);
        let checkDate1 = new Date(sessionStorage.getItem('checkDate1'));
        let checkDate2 = new Date(sessionStorage.getItem('checkDate2'));
    
        // Check if rowDate is on the specified day
        if (checkDate1.toDateString() === checkDate2.toDateString() && rowDate.getTime() === checkDate1.getTime() && !data1['data1'][0]['data1']['isMain']) {
            return { backgroundColor: 'yellow' };
        }
    
        // Check if rowDate is between checkDate1 and the day before checkDate2 (inclusive) and isMain is false
        let dayBeforeCheckDate2 = new Date(checkDate2);
        dayBeforeCheckDate2.setDate(dayBeforeCheckDate2.getDate() - 1);
        
        if (rowDate >= checkDate1 && rowDate <= dayBeforeCheckDate2 && !data1['data1'][0]['data1']['isMain']) {
            return { backgroundColor: 'yellow' };
        }
    
        return null;
    };


    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            filterParams: {
                buttons: ['apply', 'reset']
            },
        }
    ))


    //AG-GRID columns to show daily details
    const [columnDefs1, setColumnDefs1] = useState([
        { headerName: 'Date', field: 'inventory_date', maxWidth: 120, sort: 'asc' },
        { headerName: 'Room Type', field: 'roomType', maxWidth: 125 },
        {
            headerName: 'Total Before Discount', field: 'totalBeforeDiscount', maxWidth: 195,
            valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'Total Discount', field: 'totalDiscount', maxWidth: 150,
            valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'Total After Discount', field: 'total', suppressSizeToFit: true, maxWidth: 195,
            valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'Base Rate', field: 'baseprice', suppressSizeToFit: true, maxWidth: 140,
            valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'Extra Adult Rate', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 125,
            valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'Children Rate', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 125,
            valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'Package Rate', field: 'packageRate', suppressSizeToFit: true, maxWidth: 125, valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
    ])


    //AG-GRID columns to show rate summary
    const [columnDefs2, setColumnDefs2] = useState([
        { headerName: 'Date', field: 'Date', maxWidth: 120, sort: 'asc' },
        { headerName: 'RoomType', field: 'roomType', suppressSizeToFit: true, maxWidth: 120 },
        {
            headerName: 'Total Before Discount', field: 'totalBeforeDiscount', maxWidth: 195,
            valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'Total Discount', field: 'totalDiscount', maxWidth: 150,
            valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'Total After Discount', field: 'subTotal', suppressSizeToFit: true, maxWidth: 195,
            valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'Tax', field: 'totalTaxGenerated', suppressSizeToFit: true, maxWidth: 100,
            valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'Total With Tax', field: 'total', suppressSizeToFit: true, maxWidth: 150,
            valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'Room Rate', field: 'roomRevenue', suppressSizeToFit: true, maxWidth: 140,
            valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'Package Rate', field: 'packageRevenue', suppressSizeToFit: true, maxWidth: 140,
            valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'Extra Adult Price', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 165,
            valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'Child Price', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 125,
            valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        { headerName: 'PackageCode', field: 'packageCode', suppressSizeToFit: true, maxWidth: 140 },
    ])


    // On reset button function
    const handleReset1 = () => {
        window.location.reload()
    }



    const handlePackageChange = (event) => {
        // if (event.value === data1['data1'][1][0].packageID) {
        //     return handleError("Please select different package from previous !!!")
        // }
        console.log(event.value)
        console.log(event.label)
        setNewPackageID(event.value)
        setNewPackageName(event.label)
        setOpenPackageNewDate(false)
    }



    const handlePackageClear = () => {


        setUpdatedRate(false)

        setNewPackageID()
        setNewPackageName()
        setOpenPackageNewDate(false)
    }



    // Final submit button function
    const finalSubmit = () => {

        if (data1.data2 && data1.data2 == 1) {
            let createasset = JSON.stringify({
                "hotelID": 1,
                "sharingID": data1['data1'][0]['data1']['sharingID'],
          
              });
              console.log(createasset);
              let result = fetchx(API_URL+"/rollOverData", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: createasset,
              }).then(data => data.json())
              .then((res) => {
                console.log(res)       
              })
        }
setDisableSubmit(true)
        setOpenPackageNewDate(false)

        setOpen(true);
        // Start a timer to check if the response takes more than 5 seconds
        const timeout = setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);
        const finalData = JSON.stringify({
            reservationID: data1['data1'][0]['data1']['id'],
            checkIn: sessionStorage.getItem("NewCheckInDate"),
            checkOut: sessionStorage.getItem("NewCheckOutDate"),
            newPackageID: newPackageID,

        })
        fetchx(API_URL + '/updateStayDetailsOfReservation', {
            method: 'POST',
            body: finalData,
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
            .then((res) => res.json())
            .then(postres => {
                if (postres.statusCode === 200) {

                    if(data1.data2 && data1.data2 == 1){
                        let createasset = JSON.stringify({
                            "hotelID": 1,
                            "reservationID": data1['data1'][0]['data1']['id'],
                      
                          });
                          console.log(createasset);
                          let result = fetchx(API_URL+"/updateIsRollOverInReservation", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: createasset,
                          }).then(data => data.json())
                          .then((res) => {
                            console.log(res)       
                          })
                    }
                    setOpen(false);
                    handleSuccess()
                    setDisableSubmit(false)

                }
                else {
                    console.log(postres)
                    setOpen(false);
                    setDisableSubmit(false)
                    handleError(postres['message'])
                }
            })
    }





    const getNewDateRange = (a, b, c, d) => {
        console.log(a,b,c,d)
        const existingStart = new Date(a);
        const existingEnd = new Date(b);
        const newStart = new Date(c);
        const newEnd = new Date(d);
    
        console.log(existingStart,existingEnd,newStart,newEnd)
        // If the new range starts after the existing range ends, return the new range
        if (newStart >= existingEnd) {
            return {
                startDate: newStart.toISOString().split('T')[0],
                endDate: newEnd.toISOString().split('T')[0]
            };
        }
    
        // If the new range ends before or on the existing range start, return the new range
        if (newEnd <= existingStart) {
            return {
                startDate: newStart.toISOString().split('T')[0],
                endDate: newEnd.toISOString().split('T')[0]
            };
        }
    
        // For overlapping ranges, return the overlapping part
        const overlapStart = new Date(Math.max(existingStart, newStart));
        const overlapEnd = new Date(Math.min(existingEnd, newEnd));
    
        console.log(overlapStart,overlapEnd)
        return {
            startDate: overlapStart.toISOString().split('T')[0],
            endDate: overlapEnd.toISOString().split('T')[0]
        };
    };
     
      
      
      
      // Example usag      
      

      useEffect(() => {
        if(coming !== undefined && departure !== undefined){
        const result = getNewDateRange(data1['data1'][1][0]['arrivalDate'], data1['data1'][1][0]['departureDate'], Moment(new Date(coming)).format('YYYY-MM-DD'), Moment(new Date(departure)).format('YYYY-MM-DD'));
        setNewDateRange(result); // Set the result to state
        }
      }, [data1['data1'][1][0]['arrivalDate'], data1['data1'][1][0]['departureDate'], Moment(new Date(coming)).format('YYYY-MM-DD'), Moment(new Date(departure)).format('YYYY-MM-DD')]);
   


      


    useEffect(() => {

        //     if (data1['data1'][0]['data1']['isMain'] === 1 &&
        //         (Moment(new Date(coming)).format('YYYY-MM-DD') >= Moment(new Date(data1['data1'][1][0]['departureDate'])).format('YYYY-MM-DD') ||
        //             Moment(new Date(departure)).format('YYYY-MM-DD') > Moment(new Date(data1['data1'][1][0]['departureDate'])).format('YYYY-MM-DD'))) {
        //         setOpenPackageNewDate(!openPackageNewDate)

        //     }
        setUpdatedRate(false)
        setNewPackageID()
        setNewPackageName()

    }, [coming, departure]);



    return (
        <div>

            {/* Form to take new dates */}
            <Card>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                    {data1.data1[0].data1.blockCodeID !== null && <div className="date-info">
                            <p>
                                <strong>Shoulder Start Date:</strong> {Moment(new Date(data1.data1[0].data1.shoulderStartDate)).format('DD-MM-YYYY')}
                                <span style={{ marginLeft: "30px" }}></span>

                                <strong>Shoulder End Date:</strong> {Moment(new Date(data1.data1[0].data1.shoulderEndDate)).format('DD-MM-YYYY')}
                            </p>
                        </div>}
                        <Row>
                            {
                                (data1['data1'][0]['data1']["reservationStatus"] === "Checked In" || data1['data1'][0]['data1']["reservationStatus"] === "Due Out") ? (
                                    <Col md='4' sm='12'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='coming'>
                                                Arrival Date
                                            </Label>
                                            <Controller
                                                control={control}
                                                id='coming'
                                                name='coming'
                                                defaultValue={data1['data1'][0]['data1']["arrivalDate"] < arrivalDate ? arrivalDate : data1['data1'][0]['data1']["arrivalDate"]}
                                                render={({ field }) => (
                                                    <Input
                                                        options={options}
                                                        placeholder='YYYY-MM-DD '
                                                        className={classnames('form-control')}
                                                        {...field}
                                                        disabled={true}
                                                        value={data1['data1'][0]['data1']["arrivalDate"]}
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
                                                defaultValue={data1['data1'][0]['data1']["arrivalDate"] < arrivalDate ? arrivalDate : data1['data1'][0]['data1']["arrivalDate"]}
                                                render={({ field }) => (
                                                    <Flatpickr
                                                        options={options}
                                                        placeholder='YYYY-MM-DD '
                                                        className={classnames('form-control')}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                )
                            }


                            {/* Departure Date */}
                            {(data1.data2 && data1.data2 == 1) ?
                                <Col md='4' sm='12'>
                                    <div className='mb-1'>
                                        <Label className='form-label' for='departure'>
                                            Departure Date
                                        </Label>
                                        <Controller
                                            control={control}
                                            id='departure'
                                            name='departure'
                                            defaultValue={data1['data1'][0]['data1']["departureDate"]}
                                            render={({ field }) => (
                                                <Input
                                                    disabled={true}
                                                    options={optionsToDate}
                                                    placeholder='YYYY-MM-DD '
                                                    className={classnames('form-control')}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </div>

                                </Col>
                                : <Col md='4' sm='12'>
                                    <div className='mb-1'>
                                        <Label className='form-label' for='departure'>
                                            Departure Date
                                        </Label>
                                        <Controller
                                            control={control}
                                            id='departure'
                                            name='departure'
                                            defaultValue={data1['data1'][0]['data1']["departureDate"]}
                                            render={({ field }) => (
                                                <Flatpickr
                                                    options={optionsToDate}
                                                    placeholder='YYYY-MM-DD '
                                                    className={classnames('form-control')}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                            }






                            <Modal isOpen={openPackageNewDate} toggle={() => setOpenPackageNewDate(openPackageNewDate)} className='modal-sm' centered>
                            <ModalHeader>Package  {newDateRange && `${Moment(new Date(newDateRange.startDate)).format('DD-MM-YYYY')} to ${Moment(new Date(newDateRange.endDate)).format('DD-MM-YYYY')}`}</ModalHeader>
                            <ModalBody>
                                    <Col md='8' sm='12'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='packages' >
                                                Select Packages <span style={{ color: 'red' }}>*</span>
                                            </Label>
                                            <Controller
                                                id='packages'
                                                control={control}
                                                name='packages'
                                                render={({ field }) => (
                                                    <Select
                                                        required
                                                        isClearable
                                                        options={packageName}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select')}
                                                        {...field}
                                                        onChange={handlePackageChange}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                </ModalBody>
                            </Modal>



                            {/* <  <div align='end'>
                                <span> {newPackageName} </span>
                                <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset1}>
                                    Start Over
                                </Button>
                                <Button color='primary' className='me-1' type='submit' onClick={() => { setStayNotification(!stayNotification) }}>
                                    Get New Rates
                                </Button>
                            </div>> */}


                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold' }}>{newPackageName}   {newPackageName &&  <span
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
                                    onClick={handlePackageClear}
                                >
                                    X
                                </span>}</span>
                                <div>
                                    <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset1}>
                                        Start Over
                                    </Button>
                                    <Button color='primary' className='me-1' type='submit'
                                        onClick={() => { setStayNotification(!stayNotification) }}
                                    // onClick={() => {
                                    // Apply the condition here
                                    // if (newPackageID === undefined && data1['data1'][0]['data1']['isMain'] === 1 &&
                                    //     (Moment(new Date(coming)).format('YYYY-MM-DD') >= Moment(new Date(data1['data1'][1][0]['departureDate'])).format('YYYY-MM-DD') ||
                                    //         Moment(new Date(departure)).format('YYYY-MM-DD') > Moment(new Date(data1['data1'][1][0]['departureDate'])).format('YYYY-MM-DD'))) {
                                    //     setOpenPackageNewDate(!openPackageNewDate);
                                    // } else if (newPackageID !== undefined) {
                                    //     setStayNotification(!stayNotification);
                                    // }
                                    // }}
                                    >
                                        Get New Rates
                                    </Button>
                                </div>
                            </div>


                        </Row>
                    </Form>
                </CardBody>
            </Card>


            {/* Daily details table */}
            {
                UpdatedRate !== false &&
                <div>
                    <div className="ag-theme-alpine" style={{ height: 300 }}>
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
                            View Rate Summary
                        </Button>
                    </div>
                </div>
            }


            {/* Rate summary table */}
            {
                rateSummaryModal === true &&
                <div>
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
                                    getRowStyle={getRowStyle}
                                    onCellClicked={cellClickedListener}
                                    paginationPageSize='10'
                                    defaultColDef={defaultColDef}
                                    headerColor="ddw-primary"
                                />
                            </div>
                            <div>
                                <br></br><br></br>
                                <h3><strong>Total Without Tax &nbsp;&nbsp;&nbsp;&nbsp;: </strong>&nbsp;&nbsp;&nbsp;&nbsp;{(parseFloat(subTotal).toFixed(2))}</h3>
                                <h3><strong>Total Tax &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:        </strong>&nbsp;&nbsp;&nbsp;&nbsp;{(parseFloat(totalTaxGenerated).toFixed(2))}</h3>
                                <h3><strong>Total With Tax &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </strong>&nbsp;&nbsp;&nbsp;{(parseFloat(total).toFixed(2))}</h3>
                                <h3><strong>Total Cost Of Stay &nbsp;&nbsp;&nbsp;&nbsp;: </strong>&nbsp;&nbsp;&nbsp;{(parseFloat(totalCostOfStay).toFixed(2))}</h3>


                            </div>


                            <br></br>
                            {/* <br></br> */}
                            <div>
                            {/* disabled={close}n */}
                                {/* <Button color='primary' className='me-1' style={{ float: 'right' }} onClick={finalSubmit} disabled={isClicked}> */}
                                <Button color='primary' className='me-1' style={{ float: 'right' }} onClick={finalSubmit}>
                                    Update Reservation
                                </Button>
                                <Button outline color='secondary' className='me-1' style={{ float: 'right' }} onClick={modalClose}>
                                    Cancel
                                </Button>
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

                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            }

        </div>
    )
}


export default StayNotification 
