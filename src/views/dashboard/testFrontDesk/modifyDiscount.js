
// // ** Reactstrap Imports
// import {
//   AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalHeader, ModalBody, ModalFooter,
//   Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, Accordion, InputGroup, NavLink, UncontrolledAccordion
// } from 'reactstrap'

// // Import ag-grid
// import 'ag-grid-enterprise'
// import { AgGridReact } from 'ag-grid-react'
// import '/node_modules/ag-grid-community/styles/ag-grid.css'
// import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// import StayNotification from './stayNotification';
// import React, { Fragment, useState, Component, useRef, useEffect, useMemo, useCallback } from 'react'
// import API_URL from '../../../config'
// import { useNavigate } from "react-router-dom"
// import { useForm, Controller } from 'react-hook-form'
// let subTotal;
// let totalTaxGenerated;
// let total;
// let totalDiscount;
// // ** Third Party Components
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'

// const MySwal = withReactContent(Swal)

// function App(data1) {

//   const { reset1, handleSubmit, control, watch } = useForm({})
//   const [rowData, setRowData] = useState()
//   const gridRef = useRef();
//   const navigate = useNavigate()
//   const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
//   const [showAdditionalOptions1, setShowAdditionalOptions1] = useState(false);
//   const [showAdditionalOptions2, setShowAdditionalOptions2] = useState(false);
//   let [buttonSelect, setButtonSelect] = useState();
//   let [typeOfButton, settypeOfButton] = useState();
//   const [rate, setRate] = useState('');
//   const [showRates, setShowrates] = useState()
//   const [showButtons, setShowButtons] = useState(false);
//   const [rateSummaryModal, setRateSummaryModal] = useState(false)
//   const [displayRatesummary, setDisplayRateSummary] = useState(false)
//   const [UpdatedRate, setUpdatedRate] = useState(false)



//   if (data1.data1.data1.tempReservationID) {
//     useEffect(() => {
//       fetchx(API_URL + `/getCompleteReservation?reservationID=${data1.data1.data1.tempReservationID}`)
//         .then(result => result.json())
//         .then(rowData => {
//           //console.log(rowData['data'])
//           setRowData(rowData['data'])
//         })
//     }, [])
//   }

//   const handleInputChange = (e) => {
//     const inputValue = e.target.value;
//     //console.log(inputValue)
//     setRate(inputValue);
//     setShowButtons(inputValue.trim() !== '');
//   };


//   //Main radio Button
//   const handleRadioChange = (event) => {
//     //console.log(event)
//     setButtonSelect(event.target.value);
//     sessionStorage.setItem('radioButton', event.target.value)
//     setShowAdditionalOptions(true)
//   };


//   //percentage Radio Button
//   const handleRadioChange1 = (event) => {
//     settypeOfButton(event.target.value)
//     setShowAdditionalOptions2(false);
//     setShowAdditionalOptions1(true);
//   };


//   //amount Radio Button
//   const handleRadioChange2 = (event) => {
//     settypeOfButton(event.target.value)
//     setShowAdditionalOptions2(true);
//     setShowAdditionalOptions1(false);

//   };


//   // error handling for extra discount
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


//   //Discount/Upsell submit
//   const onSubmit = data => {
//     subTotal = 0;
//     totalTaxGenerated = 0;
//     total = 0;
//     totalDiscount = 0;


//     if ((rowData !== undefined && (rowData[0]['discountPercentage'] < 0 || rowData[0]['discountAmount'] < 0))) {
//       if (rowData !== undefined && (rowData[0]['discountPercentage'] < 0)) {
//         typeOfButton = 'Percentage'
//       }
//       if (rowData !== undefined && (rowData[0]['discountAmount'] < 0)) {
//         typeOfButton = 'Amount'
//       }
//       buttonSelect = 'Discount'
//     }


//     if ((rowData !== undefined && (rowData[0]['discountPercentage'] > 0 || rowData[0]['discountAmount'] > 0))) {
//       if (rowData !== undefined && (rowData[0]['discountPercentage'] > 0)) {
//         typeOfButton = 'Percentage'
//       }
//       if (rowData !== undefined && (rowData[0]['discountAmount'] > 0)) {
//         typeOfButton = 'Amount'
//       }
//       buttonSelect = 'Upsell'
//     }


//     const getNewRates = JSON.stringify({
//       hotelID: 1,
//       reservationID: data1.data1.data1.id,
//       buttonType: buttonSelect,
//       typeOfButton: typeOfButton,
//       tempReservationID: data1.data1.data1.tempReservationID,
//       rate: rate,
//       roomType: data1.data1.data1['roomType'],
//       reservationStatus: data1.data1.data1['reservationStatus']
//     })


//     fetchx(API_URL + "/modifyDiscount", {
//       method: "POST",
//       headers: { 'Content-Type': 'application/json' },
//       body: getNewRates
//     }).then((res) => res.json())
//       .then(postres => {
//         if (typeof (postres['data']) == 'string') {
//           handleError(postres['data'])
//           setUpdatedRate(false)
//           return;
//         }
//         else {
//           setShowrates(postres['data'])
//           let rateSummary = JSON.stringify({
//             rateSummary: postres['data'],
//             rateCode: data1.data1.data1['rateCodeID'],
//             roomTypeID: data1.data1.data1['roomTypeID']
//           })

//           //API to show rate summary
//           setUpdatedRate(postres['data'])
//           fetchx(API_URL + '/showRateSummary', {
//             method: 'POST',
//             body: rateSummary,
//             headers: {
//               'Content-type': 'application/json; charset=UTF-8'
//             }
//           })
//             .then((rateSummary) => rateSummary.json())
//             .then(displayRateSummary => {
//               //console.log(displayRateSummary['data'])
//               for (const item of displayRateSummary['data']) {
//                 subTotal += item.subTotal;
//                 totalTaxGenerated += item.totalTaxGenerated;
//                 total += item.total;
//                 totalDiscount += item.totalDiscount;
//               }
//               setDisplayRateSummary(displayRateSummary['data'])
//             })
//         }
//       })
//   }


//   //AG-GRID columns to show daily details
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


//   //AG-GRID columns to show rate summary
//   const [columnDefs2, setColumnDefs2] = useState([
//     { headerName: 'Date', field: 'Date', maxWidth: 120, sort: 'asc' },
//     { headerName: 'RoomType', field: 'roomType', suppressSizeToFit: true, maxWidth: 120 },
//     { headerName: 'Total Before Discount', field: 'totalBeforeDiscount', maxWidth: 195 },
//     { headerName: 'Total Discount', field: 'totalDiscount', maxWidth: 150 },
//     { headerName: 'Room Rate', field: 'roomRevenue', suppressSizeToFit: true, maxWidth: 140 },
//     { headerName: 'Package Rate', field: 'packageRevenue', suppressSizeToFit: true, maxWidth: 140 },
//     { headerName: 'Total After Discount', field: 'subTotal', suppressSizeToFit: true, maxWidth: 195 },
//     { headerName: 'Tax', field: 'totalTaxGenerated', suppressSizeToFit: true, maxWidth: 100 },
//     { headerName: 'Total With Tax', field: 'total', suppressSizeToFit: true, maxWidth: 150 },
//     { headerName: 'PackageCode', field: 'packageCode', suppressSizeToFit: true, maxWidth: 140 },
//     { headerName: 'Extra Adult Price', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 165 },
//     { headerName: 'Child Price', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 125 },
//   ])


//   // Rate summary modal
//   const handleRateSummary = () => {
//     setRateSummaryModal(true)
//   }


//   const defaultColDef = useMemo(() => (
//     {
//       sortable: true,
//       filter: true,
//       filterParams: {
//         buttons: ['apply', 'reset']
//       }
//     }
//   ));


//   const cellClickedListener = useCallback(event => {
//   }, []);



//   // On success modal open
//   const handleSuccess = () => {
//     return MySwal.fire({
//       title: 'Modify Discount!!',
//       text: 'Successfully modified discount',
//       icon: 'success',
//     },
//       setTimeout(() => { navigate('/dashboard/frontdesk') }, 1000)
//     )
//   }

//   // Final submit button function
//   const finalSubmit = () => {

//     const finalData = JSON.stringify({
//       tempReservationID: data1.data1.data1.tempReservationID,
//       reservationID: data1.data1.data1.id,
//       // dailyDetails: showRates,
//       sharingID: data1.data1.data1.sharingID,
//       reservationStatus: data1.data1.data1.reservationStatus,
//       // rateSummary: displayRatesummary,
//       quantity: data1.data1.data1.numberOfRooms,
//       buttonType: buttonSelect,
//       typeOfButton: typeOfButton,
//       rate: rate,
//       roomType: data1.data1.data1['roomType'],
//       rateCode: data1.data1.data1['rateCodeID'],
//       roomTypeID: data1.data1.data1['roomTypeID'],

//     })

//     fetchx(API_URL + '/updateDiscount', {
//       method: 'POST',
//       body: finalData,
//       headers: {
//         'Content-type': 'application/json; charset=UTF-8'
//       }
//     })
//       .then((res) => res.json())
//       .then(postres => {
//         if (postres.statusCode === 200) {
//           handleSuccess()
//         }
//       })
//   }

//   return (
//     <div>
//       <Form onSubmit={handleSubmit(onSubmit)}>

//         {/* Upsell and discount */}
//         <Row>
//           {
//             (rowData !== undefined && rowData[0]['discountPercentage'] == 0 && rowData[0]['discountAmount'] == 0) ? (
//               <Col className='name'>
//                 <div className='demo-inline-spacing'>
//                   <div className='form-check form-check-inline'>
//                     <Label className='form-check-label' for='ex1-active'>
//                       <Input type="radio" name='ex1Type' value="Discount" onChange={handleRadioChange} />
//                       Discount
//                     </Label>
//                   </div>
//                   <div className='form-check form-check-inline'>
//                     <Label className='form-check-label'>
//                       <Input type="radio" name='ex1Type' value="Upsell" onChange={handleRadioChange} />
//                       Upsell
//                     </Label>
//                   </div>
//                 </div>
//               </Col>
//             ) : (
//               (rowData !== undefined && (rowData[0]['discountPercentage'] < 0 || rowData[0]['discountAmount'] < 0)) ? (
//                 <div className='demo-inline-spacing'>
//                   <div className='form-check form-check-inline'>
//                     <Label className='form-check-label' for='ex1-active'>
//                       <Input type="radio" name='ex1Type' value="Discount" defaultChecked onChange={handleRadioChange} disabled />
//                       Discount
//                     </Label>
//                   </div>

//                   <div className='form-check form-check-inline'>
//                     <Label className='form-check-label'>
//                       <Input type="radio" name='ex1Type' value="Upsell" disabled />
//                       Upsell
//                     </Label>
//                   </div>
//                 </div>

//               ) : (
//                 <div className='demo-inline-spacing'>
//                   <div className='form-check form-check-inline'>
//                     <Label className='form-check-label' for='ex1-active'>
//                       <Input type="radio" name='ex1Type' value="Discount" onChange={handleRadioChange} disabled />
//                       Discount
//                     </Label>
//                   </div>
//                   <div className='form-check form-check-inline'>
//                     <Label className='form-check-label'>
//                       <Input type="radio" name='ex1Type' value="Upsell" defaultChecked onChange={handleRadioChange} disabled />
//                       Upsell
//                     </Label>
//                   </div>
//                 </div>
//               )
//             )

//           }

//         </Row>

//         {/* Default for percentage */}
//         {
//           (rowData !== undefined && rowData[0]['discountPercentage'] !== 0) &&
//           <div className='demo-inline-spacing'>
//             <div className='form-check form-check-inline'>
//               <Label className='form-check-label' for='ex1-active'>
//                 <Input type="radio" name='ex1' value="Percentage" defaultChecked onChange={handleRadioChange1} disabled />
//                 Percentage
//               </Label>
//             </div>
//             <div className='form-check form-check-inline'>
//               <Label className='form-check-label'>
//                 <Input type="radio" name='ex1' value="Amount" onChange={handleRadioChange2} disabled />
//                 Amount
//               </Label>
//             </div>
//           </div>
//         }


//         {/* Default for amount */}
//         {
//           (rowData !== undefined && rowData[0]['discountAmount'] !== 0) &&
//           <div className='demo-inline-spacing'>
//             <div className='form-check form-check-inline'>
//               <Label className='form-check-label' for='ex1-active'>
//                 <Input type="radio" name='ex1' value="Percentage" onChange={handleRadioChange1} disabled />
//                 Percentage
//               </Label></div>
//             <div className='form-check form-check-inline'>
//               <Label className='form-check-label'>
//                 <Input type="radio" name='ex1' value="Amount" defaultChecked onChange={handleRadioChange2} disabled />
//                 Amount
//               </Label>
//             </div>
//           </div>
//         }


//         {/* Input for percentage */}
//         {
//           (rowData !== undefined && rowData[0]['discountPercentage'] !== 0) &&
//           <Col md='4' sm='8'>
//             <div>
//               <br></br>
//               <Label className='form-label' htmlFor='rate'>
//                 Enter Percentage
//               </Label>
//               <Controller
//                 control={control}
//                 id='rate'
//                 name='rate'
//                 render={() => (
//                   <Input
//                     type="text"
//                     placeholder='Enter percentage'
//                     defaultValue={Math.abs(rowData[0]['discountPercentage'])}
//                     onChange={handleInputChange}
//                   />
//                 )}
//               />
//             </div>
//           </Col>
//         }


//         {/* Input for amount */}
//         {
//           (rowData !== undefined && rowData[0]['discountAmount'] !== 0) &&
//           <Col md='4' sm='8'>
//             <div >
//               <br></br>
//               <Label className='form-label' for='rate'>
//                 Enter Amount
//               </Label>
//               <Controller
//                 control={control}
//                 id='rate'
//                 name='rate'
//                 render={() => <Input
//                   type="text"
//                   placeholder='Enter amount'
//                   defaultValue={Math.abs(rowData[0]['discountAmount'])}
//                   onChange={handleInputChange}
//                 />
//                 }
//               />
//             </div>
//           </Col>
//         }

//         {
//           showAdditionalOptions &&
//           <Row>
//             <Col className='name'>
//               <div className='demo-inline-spacing'>
//                 <div className='form-check form-check-inline'>
//                   <Label className='form-check-label' for='ex1-active'>
//                     <Input type="radio" name='ex1' value="Percentage" onChange={handleRadioChange1} />
//                     Percentage
//                   </Label>
//                 </div>
//                 <div className='form-check form-check-inline'>
//                   <Label className='form-check-label'>
//                     <Input type="radio" name='ex1' value="Amount" onChange={handleRadioChange2}
//                     />
//                     Amount
//                   </Label>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//           // </div>
//         }

//         {
//           showAdditionalOptions1 &&
//           <Col md='4' sm='8'>
//             <div >
//               <br></br>
//               <Label className='form-label' for='rate'>
//                 Enter Percentage
//               </Label>
//               <Controller
//                 defaultValue=''
//                 control={control}
//                 id='rate'
//                 name='rate'
//                 render={() =>
//                   <Input
//                     type="text"
//                     placeholder='Enter amount'
//                     value={rate}
//                     onChange={handleInputChange}
//                   />
//                 }
//               />
//             </div>
//           </Col>
//         }

//         {
//           showAdditionalOptions2 &&
//           <Col md='4' sm='8'>
//             <div >
//               <br></br>
//               <Label className='form-label' for='rate'>
//                 Enter Amount
//               </Label>
//               <Controller
//                 defaultValue=''
//                 control={control}
//                 id='rate'
//                 name='rate'
//                 render={() => <Input
//                   type="text"
//                   placeholder='Enter amount'
//                   value={rate}
//                   onChange={handleInputChange}
//                 />
//                 }
//               />
//             </div>
//           </Col>
//         }

//         <br></br>
//         <div>
//           <Button className='me-1' color='secondary'>
//             Reset
//           </Button>
//           <Button className='me-1' color='primary' type='submit'>
//             Apply
//           </Button>
//         </div>

//         <br></br><br></br><br></br>

//         {
//           UpdatedRate !== false &&
//           <div>
//             <h4>Modified Daily details</h4><br></br>
//             <div className="ag-theme-alpine" style={{ height: 220 }}>
//               <AgGridReact
//                 ref={gridRef}
//                 rowData={showRates}
//                 columnDefs={columnDefs}
//                 animateRows={true}
//                 rowSelection='multiple'
//                 onCellClicked={cellClickedListener}
//                 paginationPageSize='10'
//                 defaultColDef={defaultColDef}
//                 headerColor="ddw-primary"
//               />
//             </div>
//             <br />
//             <div align='end' className='buttons' >
//               <Button color='primary' className='me-1' type='submit' onClick={handleRateSummary}>
//                 View Rate Summary
//               </Button>
//             </div>
//           </div>
//         }

//         {
//           rateSummaryModal === true &&
//           <div>
//             <Modal isOpen={rateSummaryModal} toggle={() => setRateSummaryModal(!rateSummaryModal)} className='modal-xl'>
//               <ModalHeader toggle={() => setRateSummaryModal(!rateSummaryModal)}>
//                 Rate Summary Of Modified Reservation
//               </ModalHeader>
//               <ModalBody className='pb-3 px-sm-5 mx-20'>

//                 <div className="ag-theme-alpine" style={{ height: 385 }}>
//                   <AgGridReact
//                     ref={gridRef}
//                     rowData={displayRatesummary}
//                     columnDefs={columnDefs2}
//                     animateRows={true}
//                     rowSelection='multiple'
//                     onCellClicked={cellClickedListener}
//                     paginationPageSize='10'
//                     defaultColDef={defaultColDef}
//                     headerColor="ddw-primary"
//                   />
//                 </div>
//                 <div>
//                   <br></br><br></br>
//                   <h3><strong>Total Without Tax :- </strong>{subTotal}</h3>
//                   <h3><strong>Total Tax :-        </strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{totalTaxGenerated}</h3>
//                   <h3><strong>Total With Tax :- </strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{total}</h3>


//                 </div>


//                 <br></br>
//                 {/* <br></br> */}
//                 <div>
//                   <Button color='primary' className='me-1' style={{ float: 'right' }} onClick={finalSubmit}>
//                     {/* onClick={finalSubmit} */}
//                     Confirm
//                   </Button>
//                   <Button outline color='secondary' className='me-1' style={{ float: 'right' }} >
//                     {/* onClick={modalClose} */}
//                     Cancel
//                   </Button>
//                 </div>
//               </ModalBody>
//             </Modal>
//           </div>
//         }

//       </Form>

//     </div>
//   );
// }

// export default App;




// ** Reactstrap Imports
import {
  AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, Accordion, InputGroup, NavLink, UncontrolledAccordion
} from 'reactstrap'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import StayNotification from './stayNotification';
import React, { Fragment, useState, Component, useRef, useEffect, useMemo, useCallback } from 'react'
import API_URL from '../../../config'
import { useNavigate } from "react-router-dom"
import { useForm, Controller } from 'react-hook-form'
let subTotal;
let totalTaxGenerated;
let total;
let totalDiscount;
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function App(data1) {

  const { reset1, handleSubmit, control, watch } = useForm({})
  const [rowData, setRowData] = useState()
  const gridRef = useRef();
  const navigate = useNavigate()
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
  const [showAdditionalOptions1, setShowAdditionalOptions1] = useState(false);
  const [showAdditionalOptions2, setShowAdditionalOptions2] = useState(false);
  let [buttonSelect, setButtonSelect] = useState();
  let [typeOfButton, settypeOfButton] = useState();
  const [rate, setRate] = useState('');
  const [showRates, setShowrates] = useState()
  const [showButtons, setShowButtons] = useState(false);
  const [rateSummaryModal, setRateSummaryModal] = useState(false)
  const [displayRatesummary, setDisplayRateSummary] = useState(false)
  const [UpdatedRate, setUpdatedRate] = useState(false)



  if (data1.data1.data1.tempReservationID) {
    useEffect(() => {
      fetchx(API_URL + `/getCompleteReservation?reservationID=${data1.data1.data1.tempReservationID}`)
        .then(result => result.json())
        .then(rowData => {
          //console.log(rowData['data'])
          setRowData(rowData['data'])
        })
    }, [])
  }

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    //console.log(inputValue)
    setRate(inputValue);
    setShowButtons(inputValue.trim() !== '');
  };


  //Main radio Button
  const handleRadioChange = (event) => {
    //console.log(event)
    setButtonSelect(event.target.value);
    sessionStorage.setItem('radioButton', event.target.value)
    setShowAdditionalOptions(true)
  };


  //percentage Radio Button
  const handleRadioChange1 = (event) => {
    settypeOfButton(event.target.value)
    setShowAdditionalOptions2(false);
    setShowAdditionalOptions1(true);
  };


  //amount Radio Button
  const handleRadioChange2 = (event) => {
    settypeOfButton(event.target.value)
    setShowAdditionalOptions2(true);
    setShowAdditionalOptions1(false);

  };


  // error handling for extra discount
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


  //Discount/Upsell submit
  const onSubmit = data => {
    subTotal = 0;
    totalTaxGenerated = 0;
    total = 0;
    totalDiscount = 0;


    if ((rowData !== undefined && (rowData[0]['discountPercentage'] < 0 || rowData[0]['discountAmount'] < 0))) {
      if (rowData !== undefined && (rowData[0]['discountPercentage'] < 0)) {
        typeOfButton = 'Percentage'
      }
      if (rowData !== undefined && (rowData[0]['discountAmount'] < 0)) {
        typeOfButton = 'Amount'
      }
      buttonSelect = 'Discount'
    }


    if ((rowData !== undefined && (rowData[0]['discountPercentage'] > 0 || rowData[0]['discountAmount'] > 0))) {
      if (rowData !== undefined && (rowData[0]['discountPercentage'] > 0)) {
        typeOfButton = 'Percentage'
      }
      if (rowData !== undefined && (rowData[0]['discountAmount'] > 0)) {
        typeOfButton = 'Amount'
      }
      buttonSelect = 'Upsell'
    }


    const getNewRates = JSON.stringify({
      hotelID: 1,
      reservationID: data1.data1.data1.id,
      buttonType: buttonSelect,
      typeOfButton: typeOfButton,
      tempReservationID: data1.data1.data1.tempReservationID,
      rate: rate,
      roomType: data1.data1.data1['roomType'],
      reservationStatus: data1.data1.data1['reservationStatus']
    })


    fetchx(API_URL + "/modifyDiscount", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: getNewRates
    }).then((res) => res.json())
      .then(postres => {
        if (typeof (postres['data']) == 'string') {
          handleError(postres['data'])
          setUpdatedRate(false)
          return;
        }
        else {
          setShowrates(postres['data'])
          let rateSummary = JSON.stringify({
            rateSummary: postres['data'],
            rateCode: data1.data1.data1['rateCodeID'],
            roomTypeID: data1.data1.data1['roomTypeID']
          })

          //API to show rate summary
          setUpdatedRate(postres['data'])
          fetchx(API_URL + '/showRateSummary', {
            method: 'POST',
            body: rateSummary,
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            }
          })
            .then((rateSummary) => rateSummary.json())
            .then(displayRateSummary => {
              //console.log(displayRateSummary['data'])
              for (const item of displayRateSummary['data']) {
                subTotal += item.subTotal;
                totalTaxGenerated += item.totalTaxGenerated;
                total += item.total;
                totalDiscount += item.totalDiscount;
              }
              setDisplayRateSummary(displayRateSummary['data'])
            })
        }
      })
  }


  //AG-GRID columns to show daily details
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


  //AG-GRID columns to show rate summary
  const [columnDefs2, setColumnDefs2] = useState([
    { headerName: 'Date', field: 'Date', maxWidth: 120, sort: 'asc' },
    { headerName: 'RoomType', field: 'roomType', suppressSizeToFit: true, maxWidth: 120 },
    { headerName: 'Total Before Discount', field: 'totalBeforeDiscount', maxWidth: 195 },
    { headerName: 'Total Discount', field: 'totalDiscount', maxWidth: 150 },
    { headerName: 'Room Rate', field: 'roomRevenue', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Package Rate', field: 'packageRevenue', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Total After Discount', field: 'subTotal', suppressSizeToFit: true, maxWidth: 195 },
    { headerName: 'Tax', field: 'totalTaxGenerated', suppressSizeToFit: true, maxWidth: 100 },
    { headerName: 'Total With Tax', field: 'total', suppressSizeToFit: true, maxWidth: 150 },
    { headerName: 'PackageCode', field: 'packageCode', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Extra Adult Price', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 165 },
    { headerName: 'Child Price', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 125 },
  ])


  // Rate summary modal
  const handleRateSummary = () => {
    setRateSummaryModal(true)
  }


  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));


  const cellClickedListener = useCallback(event => {
  }, []);



  // On success modal open
  const handleSuccess = () => {
    return MySwal.fire({
      title: 'Modify Discount!!',
      text: 'Successfully modified discount',
      icon: 'success',
    },
      setTimeout(() => { navigate('/dashboard/frontdesk') }, 1000)
    )
  }

  // Final submit button function
  const finalSubmit = () => {

    const finalData = JSON.stringify({
      tempReservationID: data1.data1.data1.tempReservationID,
      reservationID: data1.data1.data1.id,
      dailyDetails: showRates,
      sharingID: data1.data1.data1.sharingID,
      reservationStatus: data1.data1.data1.reservationStatus,
      rateSummary: displayRatesummary,
      quantity: data1.data1.data1.numberOfRooms,
    })

    fetchx(API_URL + '/updateDiscount', {
      method: 'POST',
      body: finalData,
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then((res) => res.json())
      .then(postres => {
        if (postres.statusCode === 200) {
          handleSuccess()
        }
      })
  }

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>

        {/* Upsell and discount */}
        <Row>
          {
            (rowData !== undefined && rowData[0]['discountPercentage'] == 0 && rowData[0]['discountAmount'] == 0) ? (
              <Col className='name'>
                <div className='demo-inline-spacing'>
                  <div className='form-check form-check-inline'>
                    <Label className='form-check-label' for='ex1-active'>
                      <Input type="radio" name='ex1Type' value="Discount" onChange={handleRadioChange} />
                      Discount
                    </Label>
                  </div>
                  <div className='form-check form-check-inline'>
                    <Label className='form-check-label'>
                      <Input type="radio" name='ex1Type' value="Upsell" onChange={handleRadioChange} />
                      Upsell
                    </Label>
                  </div>
                </div>
              </Col>
            ) : (
              (rowData !== undefined && (rowData[0]['discountPercentage'] < 0 || rowData[0]['discountAmount'] < 0)) ? (
                <div className='demo-inline-spacing'>
                  <div className='form-check form-check-inline'>
                    <Label className='form-check-label' for='ex1-active'>
                      <Input type="radio" name='ex1Type' value="Discount" defaultChecked onChange={handleRadioChange} disabled />
                      Discount
                    </Label>
                  </div>

                  <div className='form-check form-check-inline'>
                    <Label className='form-check-label'>
                      <Input type="radio" name='ex1Type' value="Upsell" disabled />
                      Upsell
                    </Label>
                  </div>
                </div>

              ) : (
                <div className='demo-inline-spacing'>
                  <div className='form-check form-check-inline'>
                    <Label className='form-check-label' for='ex1-active'>
                      <Input type="radio" name='ex1Type' value="Discount" onChange={handleRadioChange} disabled />
                      Discount
                    </Label>
                  </div>
                  <div className='form-check form-check-inline'>
                    <Label className='form-check-label'>
                      <Input type="radio" name='ex1Type' value="Upsell" defaultChecked onChange={handleRadioChange} disabled />
                      Upsell
                    </Label>
                  </div>
                </div>
              )
            )

          }

        </Row>

        {/* Default for percentage */}
        {
          (rowData !== undefined && rowData[0]['discountPercentage'] !== 0) &&
          <div className='demo-inline-spacing'>
            <div className='form-check form-check-inline'>
              <Label className='form-check-label' for='ex1-active'>
                <Input type="radio" name='ex1' value="Percentage" defaultChecked onChange={handleRadioChange1} disabled />
                Percentage
              </Label>
            </div>
            <div className='form-check form-check-inline'>
              <Label className='form-check-label'>
                <Input type="radio" name='ex1' value="Amount" onChange={handleRadioChange2} disabled />
                Amount
              </Label>
            </div>
          </div>
        }


        {/* Default for amount */}
        {
          (rowData !== undefined && rowData[0]['discountAmount'] !== 0) &&
          <div className='demo-inline-spacing'>
            <div className='form-check form-check-inline'>
              <Label className='form-check-label' for='ex1-active'>
                <Input type="radio" name='ex1' value="Percentage" onChange={handleRadioChange1} disabled />
                Percentage
              </Label></div>
            <div className='form-check form-check-inline'>
              <Label className='form-check-label'>
                <Input type="radio" name='ex1' value="Amount" defaultChecked onChange={handleRadioChange2} disabled />
                Amount
              </Label>
            </div>
          </div>
        }


        {/* Input for percentage */}
        {
          (rowData !== undefined && rowData[0]['discountPercentage'] !== 0) &&
          <Col md='4' sm='8'>
            <div>
              <br></br>
              <Label className='form-label' htmlFor='rate'>
                Enter Percentage
              </Label>
              <Controller
                control={control}
                id='rate'
                name='rate'
                render={() => (
                  <Input
                    type="text"
                    placeholder='Enter percentage'
                    defaultValue={Math.abs(rowData[0]['discountPercentage'])}
                    onChange={handleInputChange}
                  />
                )}
              />
            </div>
          </Col>
        }


        {/* Input for amount */}
        {
          (rowData !== undefined && rowData[0]['discountAmount'] !== 0) &&
          <Col md='4' sm='8'>
            <div >
              <br></br>
              <Label className='form-label' for='rate'>
                Enter Amount
              </Label>
              <Controller
                control={control}
                id='rate'
                name='rate'
                render={() => <Input
                  type="text"
                  placeholder='Enter amount'
                  defaultValue={Math.abs(rowData[0]['discountAmount'])}
                  onChange={handleInputChange}
                />
                }
              />
            </div>
          </Col>
        }

        {
          showAdditionalOptions &&
          <Row>
            <Col className='name'>
              <div className='demo-inline-spacing'>
                <div className='form-check form-check-inline'>
                  <Label className='form-check-label' for='ex1-active'>
                    <Input type="radio" name='ex1' value="Percentage" onChange={handleRadioChange1} />
                    Percentage
                  </Label>
                </div>
                <div className='form-check form-check-inline'>
                  <Label className='form-check-label'>
                    <Input type="radio" name='ex1' value="Amount" onChange={handleRadioChange2}
                    />
                    Amount
                  </Label>
                </div>
              </div>
            </Col>
          </Row>
          // </div>
        }

        {
          showAdditionalOptions1 &&
          <Col md='4' sm='8'>
            <div >
              <br></br>
              <Label className='form-label' for='rate'>
                Enter Percentage
              </Label>
              <Controller
                defaultValue=''
                control={control}
                id='rate'
                name='rate'
                render={() =>
                  <Input
                    type="text"
                    placeholder='Enter amount'
                    value={rate}
                    onChange={handleInputChange}
                  />
                }
              />
            </div>
          </Col>
        }

        {
          showAdditionalOptions2 &&
          <Col md='4' sm='8'>
            <div >
              <br></br>
              <Label className='form-label' for='rate'>
                Enter Amount
              </Label>
              <Controller
                defaultValue=''
                control={control}
                id='rate'
                name='rate'
                render={() => <Input
                  type="text"
                  placeholder='Enter amount'
                  value={rate}
                  onChange={handleInputChange}
                />
                }
              />
            </div>
          </Col>
        }

        <br></br>
        <div>
          <Button className='me-1' color='secondary'>
            Reset
          </Button>
          <Button className='me-1' color='primary' type='submit'>
            Apply
          </Button>
        </div>

        <br></br><br></br><br></br>

        {
          UpdatedRate !== false &&
          <div>
            <h4>Modified Daily details</h4><br></br>
            <div className="ag-theme-alpine" style={{ height: 220 }}>
              <AgGridReact
                ref={gridRef}
                rowData={showRates}
                columnDefs={columnDefs}
                animateRows={true}
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
                    onCellClicked={cellClickedListener}
                    paginationPageSize='10'
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"
                  />
                </div>
                <div>
                  <br></br><br></br>
                  <h3><strong>Total Without Tax :- </strong>{subTotal}</h3>
                  <h3><strong>Total Tax :-        </strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{totalTaxGenerated}</h3>
                  <h3><strong>Total With Tax :- </strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{total}</h3>


                </div>


                <br></br>
                {/* <br></br> */}
                <div>
                  <Button color='primary' className='me-1' style={{ float: 'right' }} onClick={finalSubmit}>
                    {/* onClick={finalSubmit} */}
                    Confirm
                  </Button>
                  <Button outline color='secondary' className='me-1' style={{ float: 'right' }} >
                    {/* onClick={modalClose} */}
                    Cancel
                  </Button>
                </div>
              </ModalBody>
            </Modal>
          </div>
        }

      </Form>

    </div>
  );
}

export default App;