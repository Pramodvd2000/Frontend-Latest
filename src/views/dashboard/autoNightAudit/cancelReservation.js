
// ** React Imports
import { useState } from "react";
import axios from "axios";
// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Moment from 'moment';
import { useNavigate } from "react-router-dom";
// ** Custom Components
import Avatar from "@components/avatar";
import { Nav, TabPane, NavItem, NavLink, TabContent, Table } from 'reactstrap'
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import { Input, Card, Form, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText, Row, Col, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { Fragment } from 'react'

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from 'react';
import API_URL from "../../../config";


// let PaymentOptions = []
// const GetPaymentData = JSON.stringify({
//   hotelID: 1,
// })
// fetchx(API_URL + "/getPaymentTransactionCodes", {
//   method: "POST",
//   headers: { 'Content-Type': 'application/json' },
//   body: GetPaymentData
// }).then(result => result.json())
//   .then(rowData => {
//     console.log(rowData['data'])
//     // setFolioCount(rowData['data'])
//     PaymentOptions = rowData['data']
//   }).catch((error) => {
//     console.log(error)
//   })

let Roomarr = []


let FolioOptions = []



// let reason = [

//   fetchx(API_URL + '/getReasonByID?reasonGroupID=3')
//     .then(result => result.json())
//     .then(resp => {
//       console.log(resp['data'])
//       reason = resp['data']

//     })

// ]






const CancelReservation = ({ data1 }) => {
  //console.log(data1.data1.sharingID)
  let navigate = useNavigate();
  // const today = Moment().format('YYYY-MM-DD');
const [Today, setToday] = useState()



  useEffect(() => {
    const hotelIDData = JSON.stringify({
    hotelID: 1
    })
    fetchx(API_URL + "/getBusinessDate", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: hotelIDData
    }).then((res) => res.json())
    .then(postres => {
    const today = new Date(postres['data'][0]['businessDate']);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
    })
    }, []);



  const [selectedValue, setSelectedValue] = useState("");
  const [RoomData, setRoomData] = useState("");
  const [popUp, setPopUp] = useState();
  const [refresh, setRefresh] = useState(false);
  const [reason, setReason] = useState([]);
  const [PaymentOptions, setPaymentOptions] = useState([]);


  useEffect(() => {
    fetchx(API_URL + '/getReasonByID?reasonGroupID=8')
      .then(result => result.json())
      .then(resp => {
        //console.log(resp['data'])
        setReason(resp['data'])

      })

    const GetPaymentData = JSON.stringify({
      hotelID: 1,
    })
    fetchx(API_URL + "/getPaymentTransactionCodes", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: GetPaymentData
    }).then(result => result.json())
      .then(rowData => {
        //console.log(rowData['data'])
        // setFolioCount(rowData['data'])
        setPaymentOptions(rowData['data'])
      }).catch((error) => {
        //console.log(error)
      })
  }, []);

  const handleSelectChange = (event) => {
    Roomarr = []
    //console.log("In this function")
    if (event) {
      //console.log("Here")
      setSelectedValue(event.value);
      //console.log(event.value)
      for (let i = 0; i < 1; i++) {
        //console.log(RoomData[event.value])
        for (let j = 0; j < JSON.parse(RoomData[event.value]).length; j++) {
          //console.log()
          let RoomNumber = { 'value': JSON.parse(RoomData[event.value])[j], 'label': JSON.parse(RoomData[event.value])[j] }
          Roomarr.push(RoomNumber)
        }
      }
      //console.log(Roomarr);
    }
  };

  useEffect(() => {
    fetchx(API_URL + '/getRoomNumberByFloorID')
      .then(result => result.json())
      .then(resp => {
        //console.log(resp['data'])


        setRoomData(resp['data'])

      })
  }, []);







  // Hooks
  const {
    clearErrors
  } = useForm({})

  // AG Grid
  const [rowData, setRowData] = useState();


  // ** State
  const [data, setData] = useState(null);
  const [checkIn, setCheckIn] = useState(true);
  const [checkinSharer, setCheckinSharer] = useState();
  const [checkBoxValue, setCheckBoxValue] = useState(0);
  const [checkboxChecked, setCheckboxChecked] = useState(true)
  const [checkBoxValue2, setCheckBoxValue2] = useState(0);
  const [checkboxChecked2, setCheckboxChecked2] = useState(false)
  const [valueReason, setValueReason] = useState();
  const [labelReason, setLabelReason] = useState();
  const [PostCharges, setPostCharges] = useState(false)
  const [transData, setTransData] = useState()
  const [TransactionCode, setTransactionCode] = useState('')
  const [Description, setDescription] = useState('')
  const [show, setShow] = useState(false)
  const [FolioCount, setFolioCount] = useState('')
  const [defaultPrice, setdefaultPrice] = useState('')
  const gridRef = useRef()
  const [Amount, setAmount] = useState('')
  const [ShowPaymentPreview, setShowPaymentPreview] = useState(false)
  const [defaultAmount, setdefaultAmount] = useState('')
  const [cancelConfirm, setCancelConfirm] = useState()
  const [cancelSharer, setCancelSharer] = useState(false);

  // ** Hooks
  const { reset, handleSubmit, control, watch, formState: { errors }
  } = useForm({});





  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const checkboxValue = isChecked ? 1 : 0;
    //console.log(checkboxValue)
    setCheckBoxValue(checkboxValue)
    setCheckboxChecked(!checkboxChecked)
    // 
    setCheckBoxValue2(0)
    setCheckboxChecked2(false)
  }

  const handleCheckboxChange2 = (event) => {
    const isChecked = event.target.checked;
    const checkboxValue = isChecked ? 1 : 0;
    //console.log(checkboxValue)
    setCheckBoxValue2(checkBoxValue)
    setCheckboxChecked2(!checkboxChecked2)
    // 
    setCheckBoxValue(0)
    setCheckboxChecked(false)
  }

  //   useEffect(() => {
  //   fetchx(API_URL + `/getAllTransactionCode?hotelID=1`)
  //   .then(result => result.json())
  //   .then(rowData => {
  //     setRowData(rowData['data'])
  //     // //console.log(rowData['data'])
  //     // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
  //   })

  //   fetchx(API_URL + "/getFolioCount", {
  //     method: "POST",
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       hotelID: 1,
  //       reservationID: sessionStorage.getItem('reservationID')
  //     })
  //   }).then(result => result.json())
  //     .then(rowData => {
  //       //console.log(rowData['data'])
  //       setFolioCount(rowData['data'])
  //       FolioOptions = rowData['data']
  //     }).catch((error) => {
  //       //console.log(error)
  //     })
  // }, []);


  const onSubmit = (data) => {
    setData(data);
    //console.log(data1.data1)

    let createasset = JSON.stringify({
      hotelID: data1.data1.hotelID,
      reservationID: data1.data1.id,
      sharingID: data1.data1.sharingID,
      withRates: 1,
      withOutRates: 1,
      reason: valueReason,
      reasonText: document.getElementById('reasonText').value,
      noShow: labelReason,
      onlySharer: 0

    });

    // //console.log(data1.data1['SubBookingId'])


    //console.log(createasset);
    let res = fetchx(API_URL + "/cancelReservation", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: createasset,
    }).then(data => data.json())
      .then((res) => {
        //console.log(res);
        //console.log(res.statusCode);
        if (res.statusCode === 200) {
          handleSuccess()
          setTimeout(() => { navigate(''); }, 1000)

        }
        else {
          handleError(res.message)
        }
      }).then(res => console.log(res))
      .then((res) => {
        // console.log(res);

      })


  };





  const handleChange = (selectedOption) => {
    setValueReason(selectedOption.value);
    setLabelReason(selectedOption.label)
    //console.log(selectedOption.label)
  };

  function Cancel() {
    // alert("Do You Really Want To CheckIn")
    setTimeout(() => { navigate(''); }, 10)

  }

  function variable() {
    // onDiscard
    setPopUp(false)
    // setTimeout(() => { navigate('/dashboard/testFrontDesk'); }, 500)

  }




  const AddCharges = () => {
    let folioNo = ''
    // if(data.Folio!=undefined){
    //   folioNo = data.Folio.value
    // }

    const POSTdata = JSON.stringify({
      hotelID: 1,
      transactionCode: 1,
      type: 'Bill',
      reservationID: data1.data1.id,
      folioNo: 1,
      baseAmt: document.getElementById('Price').value,
      supplement: watch('Supplements') === undefined ? null : watch('Supplements'),
      remarks: watch('reference') === undefined ? null : watch('reference'),
      posBillNo: '',
      description: Description,
      discountPercentage: 0,
      isDeposit: 0,
      quantity: 1

    })
    //console.log('POST Trxn===========================')
    //console.log(POSTdata)
    const res = fetchx(API_URL + "/postTransaction", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: POSTdata
    }).then(result => result.json())
      .then(resp => {
        //console.log(resp)
        if (resp.statusCode == 200) {
          // setTimeout(()=>{window.location.reload()},2000)
          // ReloadContent()
          // setTimeout(() => { navigate('/dashboard/testFrontDesk/Billing') }, 10)
          const company = JSON.stringify({
            hotelID: 1,
            reservationID: data1.data1.id,
            folio: 0
          })
          //console.log(company)
          fetchx(API_URL + "/getTransactionOfReservationID", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: company
          }).then(result => result.json())
            .then(rowData => {

              for (let i = 0; i < rowData['data'].length; i++) {
                rowData['data'][i]['Newtotal'] = rowData['data'][i]['total']
              }
              setTransData(rowData['data'])
            }).catch((error) => {
              //console.log(error)
            })

          let POSTdata = JSON.stringify({
            hotelID: 1,
            reservationID: data1.data1.id,
            folioNo: 1,
            is_payment: 0,
            BTCAccID: null
          })
          //console.log(POSTdata)

          // fetchx("http://122.166.2.21:14780/SettleFolio", {
            fetchx(API_URL + "/SettleFolio", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: POSTdata
          }).then(result => result.json())
            .then(rowData => {
              //console.log(rowData['data'])
              if (rowData.statusCode == 200) {

                getFinalInvoice()

                // }

              } else {
                handleError(rowData.message)
                // setShow(false)
              }

            }).catch((error) => {
              //console.log(error)
            })


        }
      }).catch((error) => {
        //console.log(error)
      })


    // handleReset()
    // setShow(!show)
    setPostCharges(!PostCharges)


  }

  const checkisCode = (event) => {
    //console.log("hello")
    //console.log(watch('Amount'))
    //console.log(document.getElementById('Price').value)
    // setquantity(document.getElementById('quantity').value)
    let updatedBasePrice = document.getElementById('Price').value
    // if (TransactionCode == '' && Description == '') {
    //   alert('Select the Transaction Code')
    //   setdefaultPrice('')
    // } else {
    setdefaultPrice(watch('Amount'))
    const company = JSON.stringify({
      hotelID: 1,
      transactionCode: 1,
      Price: updatedBasePrice
    })
    //console.log(company)
    fetchx(API_URL + "/getTransactionCodeTaxesbyTrxnCodeID", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: company
    }).then(result => result.json())
      .then(rowData => {
        //console.log(rowData['data'])
        let tax = rowData['data']
        let taxDetails = {}
        // let taxPercentage = 0
        taxDetails['sgstAmt'] = 0
        taxDetails['cgstAmt'] = 0
        taxDetails['vatAmt'] = 0
        let qty = 1
        //console.log(qty)
        for (let j = 0; j < tax.length; j++) {
          // let taxPercentage=parseFloat(tax[j]['taxPercentage'])
          if (tax[j]['taxName'].includes("VAT")) {
            taxDetails['vatAmt'] = (qty * (parseFloat(updatedBasePrice) * parseFloat(tax[j]['taxPercentage'])) / 100).toFixed(2)
            // tax[j]['taxAmt'] = ((parseFloat(updatedBasePrice)*parseFloat(tax[j]['taxPercentage']))/100).toFixed(2)

          } else if (tax[j]['taxName'].includes("CGST")) {
            taxDetails['cgstAmt'] = (qty * (parseFloat(updatedBasePrice) * parseFloat(tax[j]['taxPercentage'])) / 100).toFixed(2)
            // tax[j]['taxAmt'] = ((parseFloat(updatedBasePrice)*parseFloat(tax[j]['taxPercentage']))/100).toFixed(2)
          } else if (tax[j]['taxName'].includes("SGST")) {
            taxDetails['sgstAmt'] = (qty * (parseFloat(updatedBasePrice) * parseFloat(tax[j]['taxPercentage'])) / 100).toFixed(2)
            // tax[j]['taxAmt'] = ((parseFloat(updatedBasePrice)*parseFloat(tax[j]['taxPercentage']))/100).toFixed(2)
          }

        }



        taxDetails['totalAmount'] = ((parseFloat(updatedBasePrice) * qty) + parseFloat(taxDetails['cgstAmt']) + parseFloat(taxDetails['sgstAmt']) + parseFloat(taxDetails['vatAmt'])).toFixed(2)

        setAmount(taxDetails)
        //console.log(taxDetails)
        // setReservationData(rowData['data'])
      }).catch((error) => {
        //console.log(error)
      })
    // }
  }

  // Post payment
  const ConfirmPostPayments = data => {
    //console.log('hiiiiiiiiiiiiiiiii')
    setData(data)
    //console.log(data)
    setShowPaymentPreview(true)
  }


  const AddPayment = (data) => {

    // setData(data)
    // //console.log(data)
    let folioNo = ''
    // if (data.Folio != undefined) {
    //   folioNo = data.Folio.value
    if (data1.data1.balance != 0) {
      //console.log("1")
      handleError("You can't cancel reservation because balance is pending")
    }
    else if (data1.data1.arrivalDate < Today) {
      //console.log("2")

      handleError("You can't cancel reservation because arrival date already passed")
    }
    else if (data1.data1.reservationStatus === 'Checked In') {
      //console.log("3")

      handleError("You cant't cancel reservation because guest already Checked In")
    }
    else {
      //console.log(watch('Payment'))
      //console.log(document.getElementById('Price').value)
      //console.log(watch('Supplements'))
      //console.log(watch('reference'))
      // }
      const POSTdata = JSON.stringify({
        hotelID: 1,
        transactionCode: watch('Payment').value,
        type: 'Payments',
        reservationID: data1.data1.id,
        folioNo: 1,
        baseAmt: Amount['totalAmount'],
        supplement: watch('Supplements') === undefined ? null : watch('Supplements'),
        remarks: watch('reference') === undefined ? null : watch('reference'),
        posBillNo: '',
        description: watch('Payment').label,
        discountPercentage: 0,
        isDeposit: 0,
        quantity: 1

      })
      //console.log(POSTdata)
      const res = fetchx(API_URL + "/postTransaction", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: POSTdata
      }).then(result => result.json())
        .then(resp => {
          //console.log(resp)
          if (resp.statusCode == 200) {
            sessionStorage.setItem('TransactionID', resp.data)

            setShowPaymentPreview(!ShowPaymentPreview)
            // setPostPayments(!PostPayments)
            // setshowPaymentReceipt(!showPaymentReceipt)
            // ReloadContent()
            // setTimeout(() => { navigate('/dashboard/testFrontDesk/Billing') }, 10)
            AddCharges()
            // setCancelConfirm(true)
            setCancelSharer(true)
            // setTimeout(()=>{window.location.reload()},2000)
          }
        }).catch((error) => {
          //console.log(error)
        })
    }

  }


    // On success modal open
    const handleSuccess = () => {
      return MySwal.fire({
        title: 'Cancel Reservation!!',
        text: 'Successfully cancelled the reservation',
        icon: 'success',
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

  const getFinalInvoice = () => {
    http://122.166.2.21:14780
    fetchx(API_URL +'/getInvoiceJSON?hotelID=1&reservationID='+data1.data1.id+'&folioNo=1')

    // fetchx('http://122.166.2.21:14780/getInvoiceJSON?hotelID=1&reservationID=' + data1.data1.id + '&folioNo=1')
      .then(result => result.json())
      .then(rowData => {
        //console.log(rowData)

        if (rowData.statuscode == 200) {
          //console.log(rowData['url'])
          // setInvURL(rowData['url'])
          // setShowInvPDF(true)
          fetchx(API_URL + "/gets3DocumentIDPMS", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              hotelID: 1,
              DocName:'PMSInvoice',
              transactionID:'',
              reservationID:data1.data1.id,
              billNo:rowData['data']['ReservationDetails']['BillNoGenerated']
                })
          }).then(result => result.json())
          .then(resp => {
              //console.log(resp)
              if(resp.statusCode==200){
                //console.log(resp)
                //console.log(API_URL+'/images/'+resp['data'])
                setTimeout(() => {
                  const newTab = window.open('about:blank', '_blank');
                  newTab.location.href = API_URL+'/images/'+resp['data']
                }, 1000)
               
              }
              
            }).catch((error) => {
              //console.log(error)
            })

        }

      })
  }
  // For Ag grid Transactions 

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Description', field: 'description' },
    { headerName: 'BaseAmount', field: 'base_amount', maxWidth: 120 },
    { headerName: 'Total', field: 'total', maxWidth: 120 },
    { headerName: 'FolioNo', field: 'folioNumber', suppressSizeToFit: true, maxWidth: 100, },
    { headerName: 'remarks', field: 'remarks', suppressSizeToFit: true, maxWidth: 200 },
    { headerName: 'supplement', field: 'supplement', maxWidth: 130 },
    { headerName: 'Date', field: 'date', maxWidth: 150 },
    { headerName: 'Created At', field: 'createdAt' },
    { headerName: 'transactionType', field: 'transaction_type', maxWidth: 150 },
  ]);

  const cellClickedListener = useCallback(event => {
    var column = event.column;
    var colDef = column.getColDef();
    var isEditable = colDef.editable;

  }, []);

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
  ));

  useEffect(() => {
    const company = JSON.stringify({
      hotelID: 1,
      reservationID: data1.data1.id,
      folio: 0
    })
    //console.log(company)
    fetchx(API_URL + "/getTransactionOfReservationID", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: company
    }).then(result => result.json())
      .then(rowData => {

        for (let i = 0; i < rowData['data'].length; i++) {
          rowData['data'][i]['Newtotal'] = rowData['data'][i]['total']
        }
        setTransData(rowData['data'])
      }).catch((error) => {
        //console.log(error)
      })
  }, []);


  function onlySharerCancel() {
    let createasset = JSON.stringify({
      hotelID: data1.data1.hotelID,
      reservationID: data1.data1.id,
      sharingID: data1.data1.sharingID,
      withRates: 1,
      withOutRates: 1,
      reason: valueReason,
      reasonText: document.getElementById('reasonText').value,
      noShow: labelReason,
      onlySharer: 1

    });

    // //console.log(data1.data1['SubBookingId'])


    //console.log(createasset);
    let res = fetchx(API_URL + "/cancelReservation", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: createasset,
    }).then(data => data.json())
      .then((res) => {
        //console.log(res);
        //console.log(res.statusCode);
        if (res.statusCode === 200) {
          setTimeout(() => { navigate(''); }, 1000)

        }
        else {
          handleError(res.message)
        }
      }).then(res => console.log(res))
      .then((res) => {
        console.log(res);

      })


  }

  return (
    <div>
      {/* <Modal isOpen={checkIn} toggle={() => setCheckIn(!checkIn)} className='demo-inline-spacing'>
        <ModalHeader className='bg-transparent' toggle={() => setCheckIn(!checkIn)}></ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'> */}
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Cancel Reservation / No Show</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>


              <Col md='3' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="SubBookingId">
                    Booking Id
                  </Label>
                  <Controller
                    id='SubBookingId'
                    control={control}
                    name='SubBookingId'
                    render={({ field }) => (
                      <Input
                        isClearable
                        // options={subBookingId}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.SubBookingId === null })}
                        {...field}
                        disabled={true}
                        value={data1.data1['bookingID']}
                      />
                    )}
                  />

                </div>
              </Col>


              <Col md='3' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='fullName'>
                    Guest Name
                  </Label>
                  <Controller
                    id='fullName'
                    control={control}
                    name='fullName'
                    render={({ field }) => (
                      <Input
                        isClearable
                        // options={fullName}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.fullName === null })}
                        {...field}
                        disabled={true}
                        value={data1.data1['firstName']}

                      />
                    )}
                  />
                </div>
              </Col>

              <Col md='3' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='assignedRoomType'>
                    Assigned Room Type
                  </Label>
                  <Controller
                    id='assignedRoomType'
                    control={control}
                    name='assignedRoomType'
                    render={({ field }) => (
                      <Input
                        isClearable
                        // options={assignedRoomType}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.assignedRoomType === null })}
                        disabled={true}
                        {...field}
                        value={data1.data1['roomType']}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md='3' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='RoomNumber'>
                    Selected Room
                  </Label>
                  <Controller
                    id='RoomNumber'
                    control={control}
                    name='RoomNumber'
                    render={({ field }) => (
                      <Input
                        isClearable
                        disabled={true}
                        options={Roomarr}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.RoomNumber === null })}
                        {...field}
                        value={data1.data1['roomNumber']}

                      />
                    )}
                  />
                </div>
              </Col>


              <Col md='3' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='start'>
                    Arrival Date
                  </Label>
                  <Controller
                    id='start'
                    name='start'
                    control={control}
                    render={({ field }) => (
                      <Input
                        required
                        placeholder='start'
                        {...field}
                        disabled={true}
                        // className={classnames('form-control', {
                        //   'is-invalid': data !== null && (data.start === null || !data.start.length)
                        // })}
                        value={data1.data1['arrivalDate']}
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md='3' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='end'>
                    Departure Date
                  </Label>
                  <Controller
                    id='end'
                    name='end'
                    control={control}
                    render={({ field }) => (
                      <Input
                        required
                        placeholder='End'
                        {...field}
                        disabled={true}
                        // className={classnames('form-control', {
                        //   'is-invalid': data !== null && (data.end === null || !data.end.length)
                        // })}
                        value={data1.data1['departureDate']}
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md='3' sm='12' >
                <div className="mb-1">
                  <Label className="form-label" for="reason">
                    Select Reason <spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    id='reason'
                    control={control}
                    name="reason"
                    render={({ field }) => (
                      <Select
                      required
                        isClearable
                        options={reason}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames('react-select',)}
                        {...field}
                        onChange={handleChange} // Add onChange event handler
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md='3' sm='12' className='mb-1'>
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
                        // required
                        {...field}
                    id='reasonText'

                        placeholder='Reason Remarks'
                        className={classnames('form-control')}
                      //   value={document.getElementById('reason') ? document.getElementById('reason') : null
                      //  }
                      // value={labelReason ? labelReason : null}
                      // value={field.value === labelReason ? labelReason : field.value}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md='3' sm='12' className='mb-1'>

                <div className='form-check form-check-inline'>
                  <Input type='checkbox' id='basic-cb-unchecked' checked={checkboxChecked} onChange={handleCheckboxChange} />
                  <Label for='noPost' className='form-check-label'>
                    Without Charges
                  </Label>
                </div>
              </Col>
              <Col md='3' sm='12' className='mb-1'>

                {data1.data1.isMain === 1 && <div className='form-check form-check-inline'>
                  <Input type='checkbox' id='basic-cb-unchecked' checked={checkboxChecked2} onChange={handleCheckboxChange2} />
                  <Label for='noPost' className='form-check-label'>
                    With Charges
                  </Label>
                </div>}
              </Col>

              {checkboxChecked === true && checkboxChecked2 === false && <div className="d-flex">
                <Button className="me-1" color="danger"  onClick={() => {if (valueReason === null || valueReason === undefined) { handleError("Please Select the Reason") }
                  else { setCancelSharer(true) }}} > {/*type="submit" */}
                
                   No Show Without Charges
                </Button>
                <Button outline color='secondary' className='me-1' onClick={Cancel}>
                  Cancel
                </Button>
              </div>}
              {checkboxChecked2 === true && <div className="d-flex">
                <Button color="primary" onClick={() => {
                  if (valueReason === null || valueReason === undefined) { handleError("Please Select the Reason") }
                  else { setPostCharges(true) }
                }} >
                  No Show With Charges
                </Button>
                {/* <Button outline color='secondary' className='me-1' onClick={Cancel}>
                  Cancel
                </Button> */}
              </div>}
              {
                refresh &&
                setTimeout(() => { navigate(''); }, 1000)


              }

            </Row>
            <div className='disabled-animation-modal'>
              <Modal isOpen={cancelConfirm} toggle={() => setCancelConfirm(!cancelConfirm)} className='modal-sm'  >
                <ModalHeader className='modal-sm' toggle={() => {
                  setCancelConfirm(!cancelConfirm)
                }}>Need To Check..</ModalHeader>
                <ModalBody className='px-5 pb-2'>
                  <div className='text-center mb-2'>
                    <h1 className='mb-1'>Cancel Reservation / No Show ?</h1>
                  </div>
                  <Col>
                    <div className="button-container text-center">
                      <Button className="me-1" color="primary" type="submit" onClick={handleSubmit(onSubmit)}>
                        Yes
                      </Button>
                      <Button className="me-1" color="danger" onClick={() => setCancelConfirm(false)} >
                        No
                      </Button>
                    </div>
                  </Col>
                </ModalBody>
              </Modal>

            </div>
          </Form>

        </CardBody>
      </Card>
      {/* </ModalBody>
      </Modal> */}



      {popUp &&
        <div className='disabled-animation-modal'>
          <Modal isOpen={popUp} toggle={() => setPopUp(!popUp)} className='modal-sm'  >   {/*onClosed={onDiscard}*/}
            <ModalHeader className='modal-sm' toggle={() => {
              setPopUp(!popUp)
            }}>Need To Check..</ModalHeader>
            <ModalBody className='pb-3 px-sm-2 mx-20'>
              <div>
                <b>{popUp}</b>
                <br></br>
                <br></br>
                <Button color="primary" className='text-center' onClick={() => setPopUp(false)} >
                  Ok
                </Button>
              </div>
            </ModalBody>
          </Modal>

        </div>
      }







      {/* Post Charges */}

      <Modal isOpen={PostCharges} toggle={() => setPostCharges(!PostCharges)} className='modal-dialog-centered modal-lg'>
        <ModalHeader toggle={() => setPostCharges(!PostCharges)}>Post Charges to Room No. {sessionStorage.getItem('RoomNo')}</ModalHeader>
        <ModalBody>
          <div>
            <Fragment>
              <Nav tabs className='tab'>
              </Nav>
            </Fragment>
            <Form onSubmit={handleSubmit(ConfirmPostPayments)}>
              <Row>

                {/* <Col md='4' sm='12' className='mb-1'>
                    <div className="mb-1">
                      <Label className="form-label" for="Folio">
                        Select Folio
                      </Label>
                      <Controller
                        id="Folio"
                        control={control}
                        name="Folio"
                        render={({ field }) => (
                          <Select
                            // required
                            isClearable
                            options={FolioOptions}
                            classNamePrefix="select"
                            theme={selectThemeColors}
                            className={classnames("react-select", {
                              "is-invalid": data !== null && data.Folio === null,
                            })}
                            {...field}

                          />
                        )}
                      />
                    </div>
                  </Col> */}
                <Col md='4' sm='12' className='mb-1'>
                  <div className="mb-1">
                    <Label className="form-label" for="Payment">
                      Payment Mode
                    </Label>
                    <Controller
                      id="Payment"
                      control={control}
                      name="Payment"
                      render={({ field }) => (
                        <Select
                          required
                          isClearable
                          options={PaymentOptions}
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          className={classnames("react-select", {
                            "is-invalid": data !== null && data.Payment === null,
                          })}
                          {...field}

                        />
                      )}
                    />
                  </div>
                </Col>
                <Col md='4' sm='12' className='mb-1'>
                  <div className="mb-1">
                    <Label className="form-label" for="Amount">
                      Amount
                    </Label>
                    <InputGroup className="input-group-merge">

                      <Controller
                        name="Amount"
                        control={control}
                        render={({ field }) => (
                          <Cleave
                            {...field}
                            id="Price"
                            value={defaultAmount}
                            onChange={checkisCode}
                            pattern="[0-9.0-9]*" title="Only Numbers Allowed" required
                            // placeholder="Enter Price"
                            className={classnames("form-control", {
                              "is-invalid": data !== null && data.Amount === null,
                            })}
                          />
                        )}
                      />
                    </InputGroup>
                  </div>
                </Col>
                {Amount && PostCharges != false &&
                  <>
                    <Col md='4' sm='12' className='mb-1'>
                      <div className="mb-1">
                        <Label className="form-label" for="Amount">
                          CGST
                        </Label>
                        <InputGroup className="input-group-merge">

                          <Controller
                            name="Amount"
                            control={control}
                            render={({ field }) => (
                              <Input disabled={true} value={Amount['cgstAmt']} />

                            )}
                          />
                        </InputGroup>
                      </div>
                    </Col>  <Col md='4' sm='12' className='mb-1'>
                      <div className="mb-1">
                        <Label className="form-label" for="Amount">
                          SGST
                        </Label>
                        <InputGroup className="input-group-merge">

                          <Controller
                            name="Amount"
                            control={control}
                            render={({ field }) => (
                              <Input disabled={true} value={Amount['sgstAmt']} />

                            )}
                          />
                        </InputGroup>
                      </div>
                    </Col>  <Col md='4' sm='12' className='mb-1'>
                      <div className="mb-1">
                        <Label className="form-label" for="Amount">
                          Total With Tax
                        </Label>
                        <InputGroup className="input-group-merge">

                          <Controller
                            name="Amount"
                            control={control}
                            render={({ field }) => (
                              <Input disabled={true} value={Amount['totalAmount']} />
                            )}
                          />
                        </InputGroup>
                      </div>
                    </Col>
                  </>}
                {/* <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="quantity">
              Quantity
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
              
                
                name="quantity"
                control={control}
                render={({ field }) => (
                  <Cleave
                    {...field}
                    value={1}
                    onChange={checkisCode}
                    id="quantity"
                    pattern="[0-9]*" title="Only Numbers Allowed" required
                    // placeholder="Enter Store ID"
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.quantity === null,
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col> */}
                <Col md='4' sm='12' className='mb-1'>
                  <div className="mb-1">
                    <Label className="form-label" for="Supplements">
                      Supplements
                    </Label>
                    <InputGroup className="input-group-merge">
                      {/* <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && (data.Items === null || !data.Items.length)
                })}
              ></InputGroupText> */}
                      <Controller
                        id="Supplements"
                        name="Supplements"
                        control={control}

                        render={({ field }) => (
                          <Input
                            // pattern="[aA-zZ]*" title="Only Alphabets Allowed"
                            // required
                            // placeholder="Enter Items"
                            {...field}
                            className={classnames("form-control", {
                              // "is-invalid":
                              //   data !== null && (data.Supplements === null || !data.Supplements.length)
                            })}
                          />
                        )}
                      />
                    </InputGroup>
                  </div>
                </Col>
                <Col md='4' sm='12' className='mb-1'>
                  <div className="mb-1">
                    <Label className="form-label" for="reference">
                      Reference
                    </Label>
                    <InputGroup className="input-group-merge">
                      {/* <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && (data.Items === null || !data.Items.length)
                })}
              ></InputGroupText> */}
                      <Controller
                        id="reference"
                        name="reference"
                        control={control}

                        render={({ field }) => (
                          <Input
                            // pattern="[aA-zZ]*" title="Only Alphabets Allowed"
                            // required
                            // placeholder="Enter Items"
                            {...field}
                            className={classnames("form-control", {
                              // "is-invalid":
                              //   data !== null && (data.reference === null || !data.reference.length)
                            })}
                          />
                        )}
                      />
                    </InputGroup>
                  </div>
                </Col>



                <br></br>
                <div >
                  {/* <Button className='me-1' style={{align:'right'}} color='primary' type='submit'>
                Post Charges
              </Button> */}
                  <Button className="me-1" color="primary" type="submit" >
                    Add
                  </Button>
                  <Button className="me-1" color="primary" type="submit" onClick={() => { setPostCharges(!PostCharges) }} >
                    Cancel
                  </Button>
                </div>
              </Row>
            </Form>
          </div>

        </ModalBody>
      </Modal>

      {/* Post Charges Confirm */}




      {/* Confirm Payments */}
      <Modal
        isOpen={ShowPaymentPreview}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Preview Payments</h1>
          {ShowPaymentPreview && <>
            {data.Folio != undefined && <h6>Folio No: <b>{data.Folio.value}</b></h6>}
            <h6>Guest Name : <b>{data1.data1['firstName']}</b></h6>
            <h6> Ph No. :<b>{data1.data1['phoneNumber']}</b></h6>
            <h6>Room No. : <b>{data1.data1['room']}</b></h6>
            {/* <h6>Transaction Code : <b>{TransactionCode}</b></h6> */}
            <h6>Payment Mode : <b>{watch('Payment').label}</b></h6>
            <h6>Payment Amount : <b>{document.getElementById('Price').value ? document.getElementById('Price').value : null}</b></h6>
            <h6>Supplements : <b>{watch('Supplements')}</b></h6>
            <h6>Reference : <b>{watch('reference')}</b></h6>
            <h6>CGST: <b>{Amount['cgstAmt']}</b></h6>
            <h6>SGST: <b>{Amount['sgstAmt']}</b></h6>
            <h6>Total: <b>{Amount['totalAmount']}</b></h6>

          </>}
          <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' onClick={AddPayment}>
                Confirm
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                  // window.location.reload()
                  setShowPaymentPreview(!ShowPaymentPreview)
                  setPostCharges(!PostCharges)
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>


      {/* Ag grid Transactions */}
      <div className="ag-theme-alpine" style={{ marginLeft: 20, marginRight: 20, height: 250 }}>
        {transData && <AgGridReact
          ref={gridRef}
          rowData={transData} columnDefs={columnDefs}
          // getRowStyle={getRowStyle}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          // onCellValueChanged={onCellValueChanged}
          // onCellDoubleClicked = {(event)=> (event.colDef.field!='extras' && event.data.transaction_type!='Payments' && expandParentRow(event.data))}
          // onCellDoubleClicked = {(event)=> (expandParentRow(event.data))}
          paginationAutoPageSize='true'
          paginationPageSize='10'
          pagination='true'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
        // gridOptions={gridOptions}
        // onGridReady={onGridReady}

        />}
      </div>


      {/* For modal confirm popUp */}
      <div className='disabled-animation-modal'>
        <Modal isOpen={cancelSharer} toggle={() => setCancelSharer(!cancelSharer)} className='modal-dialog-centered'>
          <ModalHeader className='bg-transparent' toggle={() => setCancelSharer(!cancelSharer)}></ModalHeader>
          <ModalBody className='px-5 pb-2'>
            <div className='text-center mb-2'>
              {data1.data1.isMain === 0 && <h1 className='mb-1'>Only Sharer will get cancelled / No Show</h1>}
              {data1.data1.isMain === 1 && <h1 className='mb-1'>Main Reservation along with Sharer will get cancelled / No Show</h1>}
              {/* <p>you want to submit this form ? </p> */}
            </div>
            <Col>
              <div className="button-container text-center">
                {data1.data1.isMain === 1 && <Button className="me-1" color="primary" type="submit" onClick={handleSubmit(onSubmit)} >
                  Confirm
                </Button>}
                {data1.data1.isMain === 0 && <Button className="me-1" color="primary" type="submit" onClick={onlySharerCancel} >
                  Confirm
                </Button>}
                <Button className="me-1" color="danger" onClick={() => setCancelSharer(false)} >
                  Cancel
                </Button>
              </div>
            </Col>
          </ModalBody>

        </Modal>
      </div>
    </div>
  );
};

export default CancelReservation;



