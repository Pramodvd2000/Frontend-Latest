// // ** Third Party Components
// import { useState, useRef, Fragment, useEffect, useMemo, useCallback } from 'react'
// import Select from 'react-select'
// import classnames from 'classnames'
// import 'cleave.js/dist/addons/cleave-phone.us'
// import { useForm, Controller } from 'react-hook-form'
// // ** Utils
// import { selectThemeColors } from '@utils'
// // ** Reactstrap Imports
// import { Input, Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
// // ** Styles
// import '@styles/react/libs/flatpickr/flatpickr.scss'
// import '@styles/react/libs/react-select/_react-select.scss'
// import '@styles/react/pages/page-form-validation.scss'

// // Import ag-grid
// import 'ag-grid-enterprise'
// import { AgGridReact } from 'ag-grid-react'
// import '/node_modules/ag-grid-community/styles/ag-grid.css'
// import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// import './button.scss'
// import moment, { updateLocale } from 'moment/moment'
// import { useNavigate } from "react-router-dom";
// import API_URL from '../../../config'

// // ** Third Party Components
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'

// const MySwal = withReactContent(Swal)
// import Backdrop from '@mui/material/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress'



// const defaultValues = {
//   roomType: null,
//   rtc: '',
// }


// const defaultValues1 = {
//   reason: ''
// }


// let roomTypeID = [
//   // fetchx(API_URL + '/getRoomInventoryRoomTypeID?hotelID=1')
//   //   .then(result => result.json())
//   //   .then(resp => {
//   //     roomTypeID = resp['data']
//   //     //console.log(roomTypeID)
//   //   })
// ]



// let reason = [

//   // fetchx(API_URL + '/getReasonByID?reasonGroupID=4')
//   //   .then(result => result.json())
//   //   .then(resp => {
//   //     //console.log(resp['data'])
//   //     reason = resp['data']

//   // })

// ]

// const RoomTypeModification = (data1) => {
//   const [open, setOpen] = useState(false);
//   const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
//   let navigate = useNavigate();
//   const [UpdatedRate, setUpdatedRate] = useState(false)
//   const [result, setResult] = useState('')
//   const [reasons, setReason] = useState(false);
//   const [data, setData] = useState(null)
//   const [checkboxChecked, setCheckboxChecked] = useState(true)
//   const gridRef = useRef();
//   const { reset, handleSubmit, control } = useForm({ defaultValues })
//   const [selectedValue, setSelectedValue] = useState(data1.data1.data1.roomTypeID);
//   const [popUp, setPopUp] = useState();
//   const [checkBoxValue, setCheckBoxValue] = useState(1);
//   const [modal, setModal] = useState(false);
//   const [selectedReasonValue, setSelectedReasonValue] = useState();
//   const [rateSummaryModal, setRateSummaryModal] = useState(false)
//   const [displayRatesummary, setDisplayRateSummary] = useState(false)
//   const [totalTax, setTotalTax] = useState('')
//   const [totalWithoutTax, setTotalWithoutTax] = useState('')
//   const [oldRates, setOldRates] = useState(false)
//   const [roomTypeID, setRoomTypeID] = useState([])
//   const [reason, setReasonList] = useState([])
//   const [isUpdateWithRatesButton, setIsUpdateWithRatesButton] = useState(false);




//   const cellClickedListener = useCallback(event => {
//     //console.log('cellClicked', event)
//   })

//   const defaultColDef = useMemo(() => (
//     {
//       sortable: true,
//       filter: true,
//       filterParams: {
//         buttons: ['apply', 'reset']
//       }
//     }
//   ))

//   useEffect(() => {
//     fetchx(API_URL + '/getRoomInventoryRoomTypeID?hotelID=1')
//       .then(result => result.json())
//       .then(resp => {
//         // //console.log(resp['data'])
//         setRoomTypeID(resp['data'])
//         //console.log(roomTypeID)
//       })

//     fetchx(API_URL + '/getReasonByID?reasonGroupID=4')
//       .then(result => result.json())
//       .then(resp => {
//         //console.log(resp['data'])
//         setReasonList(resp['data'])

//       })
//   }, []);


//   const handleChange = (selectedOption) => {
//     setSelectedValue(selectedOption.value);
//     if (selectedOption && selectedOption.value === data1.data1.data1.roomTypeID) {
//       let msg = "Please select a different room type";
//       handleError(msg)
//     }
//   };


//   const handleChangeReason = (selectedOption) => {
//     setSelectedReasonValue(selectedOption.value);
//   }


//   //ag-grid for daily details
//   const [columnDefs, setColumnDefs] = useState([
//     { headerName: 'Date', field: 'inventory_date', maxWidth: 120, sort: 'asc' },
//     { headerName: 'Room Type', field: 'roomType', maxWidth: 125 },
//     { headerName: 'Total Before Discount', field: 'totalBeforeDiscount', maxWidth: 195 },
//     { headerName: 'Total Discount', field: 'totalDiscount', maxWidth: 150 },
//     { headerName: 'Total After Discount', field: 'total', suppressSizeToFit: true, maxWidth: 195 },
//     { headerName: 'Base Rate', field: 'baseprice', suppressSizeToFit: true, maxWidth: 140 },
//     { headerName: 'Extra Adult Rate', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 125 },
//     { headerName: 'Children Rate', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 125 },
//     { headerName: 'Package Rate', field: 'packageRate', suppressSizeToFit: true, maxWidth: 125 },
//   ])


//   //ag-grid for rate summary
//   const [columnDefs2, setColumnDefs2] = useState([
//     { headerName: 'Date', field: 'Date', maxWidth: 120 },
//     { headerName: 'RoomType', field: 'roomType', suppressSizeToFit: true, maxWidth: 120 },
//     { headerName: 'Base Price', field: 'baseprice', maxWidth: 120 },
//     { headerName: 'Room Rate', field: 'roomRevenue', suppressSizeToFit: true, maxWidth: 125 },
//     { headerName: 'Package Rate', field: 'packageRevenue', suppressSizeToFit: true, maxWidth: 140 },
//     { headerName: 'Total', field: 'subTotal', suppressSizeToFit: true, maxWidth: 100 },
//     { headerName: 'Tax', field: 'totalTaxGenerated', suppressSizeToFit: true, maxWidth: 100 },
//     { headerName: 'Total With Tax', field: 'total', suppressSizeToFit: true, maxWidth: 150 },
//     { headerName: 'PackageCode', field: 'packageCode', suppressSizeToFit: true, maxWidth: 140 },
//     { headerName: 'Extra Adult Price', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 165 },
//     { headerName: 'Child Price', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 125 },
//   ])


//   const handleCheckboxChange = (event) => {
//     const isChecked = event.target.checked;
//     const checkboxValue = isChecked ? 1 : 0;
//     setCheckBoxValue(checkboxValue)
//     setCheckboxChecked(!checkboxChecked)
//   }


//   // On submit function
//   const onSubmit = data => {
//     setData(data)
//     let createmarketGroup = JSON.stringify({
//       "tempReservationID": data1.data1.data1.tempReservationID,
//       "newRoomTypeID": selectedValue,
//       "reservationID": data1.data1.data1.id
//     })

//     fetchx(API_URL + "/getRoomTypeModifiedRates", {
//       method: "POST",
//       headers: { 'Content-Type': 'application/json' },
//       body: createmarketGroup
//     }).then((data) => data.json())
//       .then((UpdatedRate) => {
//         if(UpdatedRate.statusCode === 200){
//           setResult(UpdatedRate['data'])
//           const modifiedResult = UpdatedRate['data'].map((row) => {
//             const inventory_date = moment(row.inventory_date).format('YYYY-MM-DD');
//             return {
//               ...row,
//               inventory_date,
//             };
//           });
//           setUpdatedRate(modifiedResult)
//         }
//         else{
//           handleError(UpdatedRate.message)

//         }

     
//       });
//   }


//   // Function to view rate summary
//   const handleClick = () => {

//     let rateSummary = JSON.stringify({
//       "rateSummary": UpdatedRate
//     })

//     fetchx(API_URL + "/showRateSummary", {
//       method: "POST",
//       headers: { 'Content-Type': 'application/json' },
//       body: rateSummary
//     }).then((data) => data.json())
//       .then((displayRatesummary) => {
//         setDisplayRateSummary(displayRatesummary['data'])
//         let totalWithTax = 0;
//         let totalWithOutTax = 0;
//         for (let i = 0; i < displayRatesummary['data'].length; i++) {
//           totalWithTax = totalWithTax + displayRatesummary['data'][i]['total'];
//           totalWithOutTax = totalWithOutTax + displayRatesummary['data'][i]['subTotal']
//         }
//         setTotalTax(totalWithTax)
//         setTotalWithoutTax(totalWithOutTax)
//       })
//     setModal(true)
//   }


//   // error handling for same guest addition
//   const handleError = (message) => {
//     return MySwal.fire({
//       title: 'Error!',
//       text: message,
//       icon: 'error',
//       customClass: {
//         confirmButton: 'btn btn-danger'
//       },
//       allowOutsideClick: false,
//       confirmButtonText: 'Close',
//       confirmButtonColor: 'danger',
//       buttonsStyling: false
//     })
//   }


//   // On success modal open
//   const handleSuccess = () => {
//     return MySwal.fire({
//       title: 'Room Type Modification!!',
//       text: 'Successfully modified room type',
//       icon: 'success',
//     })
//   }


//   // On final submit update rates
//   const UpdateRates = () => {
//     setIsUpdateWithRatesButton(true)
//     setOpen(true);
//     // Start a timer to check if the response takes more than 5 seconds
//     const timeout = setTimeout(() => {
//       setShowSecondaryMessage(true);
//     }, 5000);

//     if(selectedReasonValue === undefined){
//       handleError("Please select reason!!")
//       setIsUpdateWithRatesButton(false)
//       return
//     }

//     var reasonInputElement = document.getElementById('reasonText');
//     let updaterates = JSON.stringify({
//       "newRoomTypeID": selectedValue,
//       "reservationID": data1.data1.data1.id,
//       "oldRoomTypeID": data1.data1.data1.roomTypeID,
//       "fromDate": data1.data1.data1.arrivalDate,
//       "toDate": data1.data1.data1.departureDate,
//       "quantity": data1.data1.data1.numberOfRooms,
//       "checkBox": checkBoxValue,
//       // "rateData": result,
//       "hotelID": data1.data1.data1.hotelID,
//       "sharingID": data1.data1.data1.sharingID,
//       "fromRoomTypeID": data1.data1.data1.roomTypeID,
//       "toRoomTypeID": selectedValue,
//       "reasonID": selectedReasonValue,
//       "reasonText": reasonInputElement ? reasonInputElement.value : null
//     })
//     fetchx(API_URL + "/RoomTypeModifyRates", {
//       method: "PUT",
//       headers: { 'Content-Type': 'application/json' },
//       body: updaterates
//     })
//       .then((data) => data.json())
//       .then((res) => {
//         if (res.statusCode === 200) {
//           setOpen(false);
//           setIsUpdateWithRatesButton(false)
//           handleSuccess()
//           setTimeout(() => { navigate('/dashboard/frontdesk'); }, 1000)
//         }
//         else if (res.message) {
//           setIsUpdateWithRatesButton(false)
//           handleError(res.message)
//         }
//       })
//   }


//   // function to set popup
//   function variable() {
//     setPopUp(false)
//   }


//   return (
//     <div>
//       {reasons === true &&
//         <Modal isOpen={reasons} toggle={() => setReason(!reasons)} className=''>
//           <ModalHeader className='modal-lg' toggle={() => setReason(!reasons)}></ModalHeader>
//           <ModalBody className='pb-3 px-sm-1 mx-20'>
//             {/* <Reasons /> */}
//           </ModalBody>
//         </Modal>
//       }

//       <Card>
//         <CardBody>
//           <Form onSubmit={handleSubmit(onSubmit)}>

//             <Row>
//               &nbsp;&nbsp;Previous RoomType: {data1.data1.data1.roomType}
//               <br></br>
//               <br></br>
//             </Row>

//             <Row>
//               <Col md='6' sm='12'>
//                 <Label className="form-label" for="isActive">
//                   Change Room Type
//                 </Label>
//                 <Controller
//                   id="isActive"
//                   control={control}
//                   name="isActive"
//                   render={({ field }) => (
//                     <Select
//                       required
//                       isClearable
//                       options={roomTypeID}
//                       classNamePrefix="select"
//                       theme={selectThemeColors}
//                       {...field}
//                       onChange={handleChange} // Add onChange event handler
//                     />
//                   )}
//                 />
//               </Col>
//             </Row>
//             <br></br>


//             {
//               selectedValue != data1.data1.data1.roomTypeID && <Row>
//                 <Col >
//                   <div className='form-check form-check-inline'>
//                     <Input type='checkbox' id='basic-cb-unchecked' checked={checkboxChecked} onChange={handleCheckboxChange} />
//                     <Label for='rtc? ' className='form-check-label'>
//                       Do you want to update with rates?
//                     </Label>
//                   </div>
//                 </Col>
//               </Row>
//             }

//             <br></br>

//             {/* get rates button */}
//             {
//               checkBoxValue === 0 &&
//               <div>
//                 <Col md='6' sm='12' className='mb-1'>
//                   <div className="mb-1">
//                     <Label className="form-label" for="reason">
//                       Select Reason
//                     </Label>
//                     <Controller
//                       control={control}
//                       name="reason"
//                       render={({ field }) => (
//                         <Select
//                           required
//                           isClearable
//                           options={reason}
//                           id='reason'
//                           classNamePrefix="select"
//                           theme={selectThemeColors}
//                           {...field}
//                           onChange={handleChangeReason} // Add onChange event handler
//                         />
//                       )}
//                     />
//                   </div>
//                 </Col>
//                 <Col md='6' sm='12' className='mb-1'>
//                   <div className='mb-1'>
//                     <Label className='form-label' for='reasonText'>
//                       Reason Remarks
//                     </Label>
//                     <Controller
//                       id='reasonText'
//                       name='reasonText'
//                       control={control}
//                       render={({ field }) => (
//                         <Input
//                           id='reasonText'
//                           required
//                           {...field}
//                           placeholder='Reason Remarks'
//                           className={classnames('form-control'
//                             // , {
//                             //   'is-invalid': data !== null && (data.reasonText === null || !data.reasonText.length)
//                             // }
//                           )}
//                         />
//                       )}
//                     />
//                   </div>
//                 </Col>
//               </div>
//             }

//             <Row>
//               {checkBoxValue != 0 && selectedValue != data1.data1.data1.roomTypeID &&
//                 <div align='end' className='buttons'>
//                   <Button color='primary' className='me-1' type='submit' >
//                     Get Rates
//                   </Button>
//                 </div>
//               }
//             </Row>
//             <br></br>
//             <br></br>


//             {/* Ag-grid for rates display */}
//             {
//               UpdatedRate !== false && checkBoxValue != 0 && selectedValue != data1.data1.data1.roomTypeID &&
//               <div className="ag-theme-alpine" style={{ height: 220 }}>
//                 <AgGridReact
//                   ref={gridRef}
//                   rowData={UpdatedRate}
//                   columnDefs={columnDefs}
//                   animateRows={true}
//                   rowSelection='multiple'
//                   onCellClicked={cellClickedListener}
//                   paginationPageSize='10'
//                   defaultColDef={defaultColDef}
//                   headerColor="ddw-primary"
//                 />
//                 <br />
//                 <br />
//                 <br />

//                 <div align='end' className='buttons'>
//                   <Button color='primary' className='me-1' onClick={handleClick}>
//                     Continue
//                   </Button>
//                 </div>
//               </div>
//             }


//             {
//               checkBoxValue === 0 &&
//               <div align='end' className='buttons'>
//                 <Button color='primary' className='me-1' onClick={() => setOldRates(true)}>
//                   Continue
//                 </Button>
//               </div>
//             }

//           </Form>
//         </CardBody>
//       </Card>

//       <div className='disabled-animation-modal'>
//         <Modal isOpen={oldRates} toggle={() => setOldRates(!oldRates)} className='modal-dialog-centered'>
//           <ModalHeader className='bg-transparent' toggle={() => setOldRates(!oldRates)}></ModalHeader>
//           <ModalBody className='px-5 pb-2'>
//             <div className='text-center mb-2'>
//               <h1 className='mb-1'>Continue with old rates only?</h1>
//             </div>
//             <Col>
//               <div className="button-container text-center">
//                 <Button className="me-1" color="primary" type="submit" onClick={UpdateRates} disabled={isUpdateWithRatesButton}>
//                   Confirm
//                 </Button>
//                 <Button className="me-1" color="danger" onClick={() => setOldRates(false)} >
//                   Cancel
//                 </Button>
//               </div>
//             </Col>
//           </ModalBody>

//         </Modal>
//       </div>

//       {/* Rate summary of room type modification */}
//       {
//         modal !== false &&
//         <Modal isOpen={modal} toggle={() => setModal(!modal)} className='modal-xl'  >
//           <ModalBody className='pb-3 px-sm-2 mx-20'>
//             <ModalHeader className='modal-sm' toggle={() => {
//               setModal(!modal)
//             }}>Rate Summary Of Room Type Modified Reservation
//             </ModalHeader>
//             {checkBoxValue != 0 && <div className="ag-theme-alpine" style={{ height: 385 }}>
//               <AgGridReact
//                 ref={gridRef}
//                 rowData={displayRatesummary}
//                 columnDefs={columnDefs2}
//                 animateRows={true}
//                 rowSelection='multiple'
//                 onCellClicked={cellClickedListener}
//                 paginationPageSize='10'
//                 defaultColDef={defaultColDef}
//                 headerColor="ddw-primary"
//               />
//             </div>}
//             <br />
//             <br />
//             <br />
//             <p><h3>Total Without Tax = {totalWithoutTax} Rs</h3></p>
//             <p><h3>Total With Tax = {totalTax} Rs</h3></p>
//             <br />
//             <br />
//             <br />

//             <Button color="secondary" outline className='me-1' onClick={() => setModal(false)}>
//               cancel
//             </Button>
//             <Button color="primary" className='me-1' onClick={UpdateRates} disabled={isUpdateWithRatesButton}
// >
//               Confirm
//             </Button>

//             <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={()=> setOpen(false)}>
//               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                 <h1 style={{ fontWeight: 'bold', color: 'white' }}>
//                   Please wait while we are updating your reservation
//                 </h1>
//                 {showSecondaryMessage && (
//                   <h1 style={{ fontWeight: 'bold', color: 'white' }}>
//                     We're processing your request, which may take a little longer due to additional data. Please be patient!
//                   </h1>
//                 )}
//                 <CircularProgress color="inherit" />
//               </div>
//             </Backdrop>

//           </ModalBody>

//         </Modal>
//       }

//     </div >
//   )
// }

// export default RoomTypeModification



// ** Third Party Components
import { useState, useRef, Fragment, useEffect, useMemo, useCallback } from 'react'
import Select from 'react-select'
import classnames from 'classnames'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
// ** Utils
import { selectThemeColors } from '@utils'
// ** Reactstrap Imports
import { Input, Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import './button.scss'
import moment, { updateLocale } from 'moment/moment'
import { useNavigate } from "react-router-dom";
import API_URL from '../../../config'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'



const defaultValues = {
  roomType: null,
  rtc: '',
}


const defaultValues1 = {
  reason: ''
}


let roomTypeID = [
  // fetchx(API_URL + '/getRoomInventoryRoomTypeID?hotelID=1')
  //   .then(result => result.json())
  //   .then(resp => {
  //     roomTypeID = resp['data']
  //     //console.log(roomTypeID)
  //   })
]



let reason = [

  // fetchx(API_URL + '/getReasonByID?reasonGroupID=4')
  //   .then(result => result.json())
  //   .then(resp => {
  //     //console.log(resp['data'])
  //     reason = resp['data']

  // })

]

const RoomTypeModification = (data1) => {
  const [open, setOpen] = useState(false);
  const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
  let navigate = useNavigate();
  const [UpdatedRate, setUpdatedRate] = useState(false)
  const [result, setResult] = useState('')
  const [reasons, setReason] = useState(false);
  const [data, setData] = useState(null)
  const [checkboxChecked, setCheckboxChecked] = useState(true)
  const gridRef = useRef();
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  const [selectedValue, setSelectedValue] = useState(data1.data1.data1.roomTypeID);
  const [popUp, setPopUp] = useState();
  const [checkBoxValue, setCheckBoxValue] = useState(1);
  const [modal, setModal] = useState(false);
  const [selectedReasonValue, setSelectedReasonValue] = useState();
  const [rateSummaryModal, setRateSummaryModal] = useState(false)
  const [displayRatesummary, setDisplayRateSummary] = useState(false)
  const [totalTax, setTotalTax] = useState('')
  const [totalWithoutTax, setTotalWithoutTax] = useState('')
  const [oldRates, setOldRates] = useState(false)
  const [roomTypeID, setRoomTypeID] = useState([])
  const [reason, setReasonList] = useState([])
  const [isUpdateWithRatesButton, setIsUpdateWithRatesButton] = useState(false);




  const cellClickedListener = useCallback(event => {
    //console.log('cellClicked', event)
  })

  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ))

  useEffect(() => {
    fetchx(API_URL + '/getRoomInventoryRoomTypeID?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        // //console.log(resp['data'])
        setRoomTypeID(resp['data'])
        //console.log(roomTypeID)
      })

    fetchx(API_URL + '/getReasonByID?reasonGroupID=4')
      .then(result => result.json())
      .then(resp => {
        //console.log(resp['data'])
        setReasonList(resp['data'])

      })
  }, []);


  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption.value);
    if (selectedOption && selectedOption.value === data1.data1.data1.roomTypeID) {
      let msg = "Please select a different room type";
      handleError(msg)
    }
  };


  const handleChangeReason = (selectedOption) => {
    setSelectedReasonValue(selectedOption.value);
  }


  //ag-grid for daily details
  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Date', field: 'inventory_date', maxWidth: 120, sort: 'asc' },
    { headerName: 'Room Type', field: 'roomType', maxWidth: 125 },
    { headerName: 'Total Before Discount', field: 'totalBeforeDiscount', maxWidth: 195 },
    { headerName: 'Total Discount', field: 'totalDiscount', maxWidth: 150 },
    { headerName: 'Total After Discount', field: 'total', suppressSizeToFit: true, maxWidth: 195 },
    { headerName: 'Base Rate', field: 'baseprice', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Extra Adult Rate', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 125 },
    { headerName: 'Children Rate', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 125 },
    { headerName: 'Package Rate', field: 'packageRate', suppressSizeToFit: true, maxWidth: 125 },
  ])


  //ag-grid for rate summary
  const [columnDefs2, setColumnDefs2] = useState([
    { headerName: 'Date', field: 'Date', maxWidth: 120 },
    { headerName: 'RoomType', field: 'roomType', suppressSizeToFit: true, maxWidth: 120 },
    { headerName: 'Base Price', field: 'baseprice', maxWidth: 120 },
    { headerName: 'Room Rate', field: 'roomRevenue', suppressSizeToFit: true, maxWidth: 125 },
    { headerName: 'Package Rate', field: 'packageRevenue', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Total', field: 'subTotal', suppressSizeToFit: true, maxWidth: 100 },
    { headerName: 'Tax', field: 'totalTaxGenerated', suppressSizeToFit: true, maxWidth: 100 },
    { headerName: 'Total With Tax', field: 'total', suppressSizeToFit: true, maxWidth: 150 },
    { headerName: 'PackageCode', field: 'packageCode', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Extra Adult Price', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 165 },
    { headerName: 'Child Price', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 125 },
  ])


  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const checkboxValue = isChecked ? 1 : 0;
    setCheckBoxValue(checkboxValue)
    setCheckboxChecked(!checkboxChecked)
  }


  // On submit function
  const onSubmit = data => {
    setData(data)
    let createmarketGroup = JSON.stringify({
      "tempReservationID": data1.data1.data1.tempReservationID,
      "newRoomTypeID": selectedValue,
      "reservationID": data1.data1.data1.id
    })

    fetchx(API_URL + "/getRoomTypeModifiedRates", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then((data) => data.json())
      .then((UpdatedRate) => {
        if(UpdatedRate.statusCode === 200){
          setResult(UpdatedRate['data'])
          const modifiedResult = UpdatedRate['data'].map((row) => {
            const inventory_date = moment(row.inventory_date).format('YYYY-MM-DD');
            return {
              ...row,
              inventory_date,
            };
          });
          setUpdatedRate(modifiedResult)
        }
        else{
          handleError(UpdatedRate.message)

        }

     
      });
  }


  // Function to view rate summary
  const handleClick = () => {

    let rateSummary = JSON.stringify({
      "rateSummary": UpdatedRate
    })

    fetchx(API_URL + "/showRateSummary", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: rateSummary
    }).then((data) => data.json())
      .then((displayRatesummary) => {
        setDisplayRateSummary(displayRatesummary['data'])
        let totalWithTax = 0;
        let totalWithOutTax = 0;
        for (let i = 0; i < displayRatesummary['data'].length; i++) {
          totalWithTax = totalWithTax + displayRatesummary['data'][i]['total'];
          totalWithOutTax = totalWithOutTax + displayRatesummary['data'][i]['subTotal']
        }
        setTotalTax(totalWithTax)
        setTotalWithoutTax(totalWithOutTax)
      })
    setModal(true)
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


  // On success modal open
  const handleSuccess = () => {
    return MySwal.fire({
      title: 'Room Type Modification!!',
      text: 'Successfully modified room type',
      icon: 'success',
    })
  }


  // On final submit update rates
  const UpdateRates = () => {
    setIsUpdateWithRatesButton(true)
    setOpen(true);
    // Start a timer to check if the response takes more than 5 seconds
    const timeout = setTimeout(() => {
      setShowSecondaryMessage(true);
    }, 5000);

    var reasonInputElement = document.getElementById('reasonText');
    let updaterates = JSON.stringify({
      "newRoomTypeID": selectedValue,
      "reservationID": data1.data1.data1.id,
      "oldRoomTypeID": data1.data1.data1.roomTypeID,
      "fromDate": data1.data1.data1.arrivalDate,
      "toDate": data1.data1.data1.departureDate,
      "quantity": data1.data1.data1.numberOfRooms,
      "checkBox": checkBoxValue,
      "rateData": result,
      "hotelID": data1.data1.data1.hotelID,
      "sharingID": data1.data1.data1.sharingID,
      "fromRoomTypeID": data1.data1.data1.roomTypeID,
      "toRoomTypeID": selectedValue,
      "reasonID": selectedReasonValue,
      "reasonText": reasonInputElement ? reasonInputElement.value : null
    })
    fetchx(API_URL + "/RoomTypeModifyRates", {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: updaterates
    })
      .then((data) => data.json())
      .then((res) => {
        if (res.statusCode === 200) {
          setOpen(false);
          setIsUpdateWithRatesButton(false)
          handleSuccess()
          setTimeout(() => { navigate('/dashboard/frontdesk'); }, 1000)
        }
        else if (res.message) {
          setIsUpdateWithRatesButton(false)
          handleError(res.message)
        }
      })
  }


  // function to set popup
  function variable() {
    setPopUp(false)
  }


  return (
    <div>
      {reasons === true &&
        <Modal isOpen={reasons} toggle={() => setReason(!reasons)} className=''>
          <ModalHeader className='modal-lg' toggle={() => setReason(!reasons)}></ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            {/* <Reasons /> */}
          </ModalBody>
        </Modal>
      }

      <Card>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>

            <Row>
              &nbsp;&nbsp;Previous RoomType: {data1.data1.data1.roomType}
              <br></br>
              <br></br>
            </Row>

            <Row>
              <Col md='6' sm='12'>
                <Label className="form-label" for="isActive">
                  Change Room Type
                </Label>
                <Controller
                  id="isActive"
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <Select
                      required
                      isClearable
                      options={roomTypeID}
                      classNamePrefix="select"
                      theme={selectThemeColors}
                      {...field}
                      onChange={handleChange} // Add onChange event handler
                    />
                  )}
                />
              </Col>
            </Row>
            <br></br>


            {
              selectedValue != data1.data1.data1.roomTypeID && <Row>
                <Col >
                  <div className='form-check form-check-inline'>
                    <Input type='checkbox' id='basic-cb-unchecked' checked={checkboxChecked} onChange={handleCheckboxChange} />
                    <Label for='rtc? ' className='form-check-label'>
                      Do you want to update with rates?
                    </Label>
                  </div>
                </Col>
              </Row>
            }

            <br></br>

            {/* get rates button */}
            {
              checkBoxValue === 0 &&
              <div>
                <Col md='6' sm='12' className='mb-1'>
                  <div className="mb-1">
                    <Label className="form-label" for="reason">
                      Select Reason
                    </Label>
                    <Controller
                      control={control}
                      name="reason"
                      render={({ field }) => (
                        <Select
                          required
                          isClearable
                          options={reason}
                          id='reason'
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          {...field}
                          onChange={handleChangeReason} // Add onChange event handler
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col md='6' sm='12' className='mb-1'>
                  <div className='mb-1'>
                    <Label className='form-label' for='reasonText'>
                      Reason Remarks
                    </Label>
                    <Controller
                      id='reasonText'
                      name='reasonText'
                      control={control}
                      render={({ field }) => (
                        <Input
                          id='reasonText'
                          required
                          {...field}
                          placeholder='Reason Remarks'
                          className={classnames('form-control'
                            // , {
                            //   'is-invalid': data !== null && (data.reasonText === null || !data.reasonText.length)
                            // }
                          )}
                        />
                      )}
                    />
                  </div>
                </Col>
              </div>
            }

            <Row>
              {checkBoxValue != 0 && selectedValue != data1.data1.data1.roomTypeID &&
                <div align='end' className='buttons'>
                  <Button color='primary' className='me-1' type='submit' >
                    Get Rates
                  </Button>
                </div>
              }
            </Row>
            <br></br>
            <br></br>


            {/* Ag-grid for rates display */}
            {
              UpdatedRate !== false && checkBoxValue != 0 && selectedValue != data1.data1.data1.roomTypeID &&
              <div className="ag-theme-alpine" style={{ height: 220 }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={UpdatedRate}
                  columnDefs={columnDefs}
                  animateRows={true}
                  rowSelection='multiple'
                  onCellClicked={cellClickedListener}
                  paginationPageSize='10'
                  defaultColDef={defaultColDef}
                  headerColor="ddw-primary"
                />
                <br />
                <br />
                <br />

                <div align='end' className='buttons'>
                  <Button color='primary' className='me-1' onClick={handleClick}>
                    Continue
                  </Button>
                </div>
              </div>
            }


            {
              checkBoxValue === 0 &&
              <div align='end' className='buttons'>
                <Button color='primary' className='me-1' onClick={() => setOldRates(true)}>
                  Continue
                </Button>
              </div>
            }

          </Form>
        </CardBody>
      </Card>

      <div className='disabled-animation-modal'>
        <Modal isOpen={oldRates} toggle={() => setOldRates(!oldRates)} className='modal-dialog-centered'>
          <ModalHeader className='bg-transparent' toggle={() => setOldRates(!oldRates)}></ModalHeader>
          <ModalBody className='px-5 pb-2'>
            <div className='text-center mb-2'>
              <h1 className='mb-1'>Continue with old rates only?</h1>
            </div>
            <Col>
              <div className="button-container text-center">
                <Button className="me-1" color="primary" type="submit" onClick={UpdateRates} disabled={isUpdateWithRatesButton}>
                  Confirm
                </Button>
                <Button className="me-1" color="danger" onClick={() => setOldRates(false)} >
                  Cancel
                </Button>
              </div>
            </Col>
          </ModalBody>

        </Modal>
      </div>

      {/* Rate summary of room type modification */}
      {
        modal !== false &&
        <Modal isOpen={modal} toggle={() => setModal(!modal)} className='modal-xl'  >
          <ModalBody className='pb-3 px-sm-2 mx-20'>
            <ModalHeader className='modal-sm' toggle={() => {
              setModal(!modal)
            }}>Rate Summary Of Room Type Modified Reservation
            </ModalHeader>
            {checkBoxValue != 0 && <div className="ag-theme-alpine" style={{ height: 385 }}>
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
            </div>}
            <br />
            <br />
            <br />
            <p><h3>Total Without Tax = {totalWithoutTax} Rs</h3></p>
            <p><h3>Total With Tax = {totalTax} Rs</h3></p>
            <br />
            <br />
            <br />

            <Button color="secondary" outline className='me-1' onClick={() => setModal(false)}>
              cancel
            </Button>
            <Button color="primary" className='me-1' onClick={UpdateRates} disabled={isUpdateWithRatesButton}
>
              Confirm
            </Button>

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={()=> setOpen(false)}>
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

          </ModalBody>

        </Modal>
      }

    </div >
  )
}

export default RoomTypeModification