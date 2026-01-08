import React, { Fragment, useState, Component, useRef, useEffect, useMemo, useCallback } from 'react'

import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Moment from 'moment'
import { useNavigate } from "react-router-dom"
import EditFixedCharges from "./editFixedCharges"
import toast from "react-hot-toast";
import Avatar from "@components/avatar";
import { Check } from "react-feather";

import * as ReactDOM from 'react-dom'

// ** Reactstrap Imports
import {
  AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, Accordion, InputGroup, NavLink
} from 'reactstrap'
import API_URL from '../../../config'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

let frequencyOptions = [
  { value: "Once", label: "Once" },
  { value: "Daily", label: "Daily" },

]

let defaultValues = {
  Supplements: "",
  remarks: "",
  FromDate: "",
  ToDate: "",
  Amount: "",
  TransactionCode: "",
  Description: "",
  frequency2: ""

}


const FixedCharges = () => {
// let a = ['2023-08-01T18:30:00.000Z']

// // // //console.log((Moment(String(new Date(a[0]))).format('YYYY-MM-DD')))
  let defaultReason = {}

  const [data, setData] = useState([])
  const [ReasonSelect, setReasonSelect] = useState(false)
  const [TransactionCodeSelect, setTransactionCodeSelect] = useState(true)
  const [TransactionCode, setTransactionCode] = useState('')
  const [Description, setDescription] = useState('')
  const gridRef1 = useRef()
  const [rowData, setRowData] = useState()
  const [Amount, setAmount] = useState('')
  const [defaultAmount, setdefaultAmount] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [AddnewFixedCharge, setAddnewFixedCharge] = useState(false)
  const [AllFixedCharges, setAllFixedCharges] = useState([])
  const [open, setOpen] = useState('0')
  const [editcharges, seteditcharges] = useState(false)
  const [SelectedRowData, setSelectedRowData] = useState([])
  const [New, setNew] = useState(false)
  const [Edit, setEdit] = useState(false)
  const [Frequency, setFrequency] = useState();
  const [ShowPreview, setShowPreview] = useState(false)
  const [defaultPrice, setdefaultPrice] = useState('')
  const [ConfirmDelete, setConfirmDelete] = useState(false)
  const [errorMsg, seterrorMsg] = useState('')
  const [showErrorMsg, setshowErrorMsg] = useState(false)
  const [Today,setToday] = useState()
  const [ReservationDetails,setReservationDetails] = useState([])


  //Ag-grid column definition
  const [columnDefs] = useState([
    { headerName: 'transactionCode', field: 'transactionCode', maxWidth: 300 },
    // { headerName: 'Address', field: "description", valueGetter(params) {
    //     return params.data.addressLine1 + ' ' + params.data.addressLine2;
    //   },suppressSizeToFit: true, maxWidth: 600 },
    { headerName: 'description', field: 'description' },
    // { headerName: 'Mobile Number', field: 'phoneNumber', maxWidth:300 },
    // { headerName: 'Email ID', field: 'email', maxWidth:300 },
    // { headerName: 'Country', field: 'country', maxWidth:300 },
    {
      headerName: "Action",
      maxWidth: 140,
      cellRenderer: () => {
        return (<Button color='primary' >Select</Button>)
      }
    },
    // {
    //   cellRenderer: () => {
    //     return (<Button color='primary' onClick={() => setAssign(!assign)} >View Profile</Button>)
    //   }
    // }
  ])





  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
  // // // //console.log('hii')  
  const handleReset = () => {
    // // //console.log('Reset form fields')
    reset({
      Supplements: "",
      remarks: "",
      FromDate: "",
      ToDate: "",
      Amount: "",
      TransactionCode: "",
      Description: "",
      frequency2: "",
      Additionaldesc:''
    });
  };
  const [FixedChargescolumnDefs] = useState([
    // { headerName: 'id', field: 'id', maxWidth: 100 },

    // { headerName: 'hotelID', field: 'hotelID', maxWidth: 100 },
    { headerName: 'TrxnCode', field: 'transactionCode', maxWidth: 110 },
    { headerName: 'Trxn Desc', field: 'description', maxWidth: 210 },
    { headerName: 'beginDate', field: 'beginDate', maxWidth: 110 },
    { headerName: 'endDate', field: 'endDate', maxWidth: 110 },
    { headerName: 'Amount', field: 'amount', maxWidth: 100 },
    {
      headerName: "Edit",
      maxWidth: 90,
      cellRenderer: (event) => {
        return (<Button style={{width:'70px'}} color='primary' onClick={() => {
          setEdit(true)
          setNew(false)
          setOpen('1')
        }}>Edit</Button>)
      }
    },
    {
      headerName: "Cancel",
      maxWidth: 110,
      cellRenderer: (event) => {
        return (<Button style={{width:'90px'}} color='primary' onClick={() => {
          setConfirmDelete(true)
        }}>Cancel</Button>)
      }
    },
    { headerName: 'reservationID', field: 'reservationID', maxWidth: 110 },
    { headerName: 'frequency', field: 'frequency', maxWidth: 110 },
   
    


    
    { headerName: 'supplement', field: 'supplement', maxWidth: 110 },
    { headerName: 'remarks', field: 'remarks', maxWidth: 110 },



  ])

  const ShowEditForm = (event) => {
    // // //console.log(event.data)
    setSelectedRowData(event.data)
    setTimeout(() => {
      if (SelectedRowData.length != 0) {
        // // //console.log(SelectedRowData)
        seteditcharges(!editcharges)
      }
    }, 1000)

    // seteditcharges(!editcharges)
  }
  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }
  useEffect(() => {

    // // //console.log('In useEffect')

    sessionStorage.setItem('reservationID' , localStorage.getItem('reservationID'))
    // localStorage.removeItem('reservationID')
    fetchx(API_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
          })
    }).then(result => result.json())
    .then(resp => {
        //console.log(resp['data'])
        setToday(resp['data'][0]['businessDate'])
      }).catch((error) => {
        //console.log(error)
      })

      fetchx(API_URL + "/getReservationDetails", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            hotelID:1,
            reservationID:sessionStorage.getItem('reservationID')
          })
      }).then(result => result.json())
      .then(rowData => {
          //console.log(rowData['data'])
          setReservationDetails(rowData['data'][0])
        }).catch((error) => {
          //console.log(error)
        })
    // ReactDOM.render(<CardData />, document.getElementById("displayCard"))
    fetchx(API_URL + `/getAllTransactionCode?hotelID=1`)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
        // // // //console.log(rowData['data'])
        // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
      })


    fetchx(API_URL + '/getfixedcharge?hotelID=1&reservationID=' + sessionStorage.getItem('reservationID'))
      .then(result => result.json())
      .then(resp => {
        // // //console.log(resp['data'])
        setAllFixedCharges(resp['data'])
      })

  }, [])
  const cellClickedListener1 = useCallback(event => {
    // // //console.log(event['data'])
    // setSelectedRowData(event.data)
    // // // //console.log(SelectedRowData)
    // seteditcharges(!editcharges)
    // handleReset()
    setTransactionCode(event['data']['transactionCode'])
    sessionStorage.setItem('TransactionCodeID', event['data']['id'])
    setDescription(event['data']['description'])
    sessionStorage.setItem('TransactionCodeID', event['data']['id'])
    // setAmosunt('')
    setTransactionCodeSelect(false)

  })

  const cellClickedListener2 = useCallback(event => {
    // // //console.log(event['data'])
    setTransactionCode(event['data']['transactionCode'])
    sessionStorage.setItem('TransactionCodeID', event['data']['transactionCodeID'])
    setDescription(event['data']['description'])
    setAmount('')
    setTransactionCodeSelect(false)
    setSelectedRowData(event.data)
    // setEdit(false)
    // setTimeout(() => { setEdit(true), 1 })
    // //console.log(SelectedRowData)

    seteditcharges(!editcharges)
    // handleReset()


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

  const DeleteFixedCharge = () => {
    // //console.log('In delete')
    let res = fetchx(API_URL + `/updatefixedcharge?id=${SelectedRowData.id}&ModifyStatus=Cancel&reservationID=${sessionStorage.getItem('reservationID')}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isCancelled: 1

      })
    })
      .then((result) => result.json())
      .then((resp) => {

        // //console.log(resp);
        // //console.log(resp["data"])
        if (resp.statusCode == 200) {
          toast(
            <div className="d-flex">
              <div className="me-1">
                <Avatar size="sm" color="success" icon={<Check size={12} />} />
              </div>
              <div className="d-flex flex-column">
                <h6>Fixed Charges Deleted Successfully</h6>
                {/* <h4>Wait-List Added Successfully</h4> */}
              </div>
            </div>
          );

        } else {
          seterrorMsg(resp.message)
          setshowErrorMsg(!showErrorMsg)
        }
        handleReset()
        setConfirmDelete(!ConfirmDelete)

        fetchx(API_URL + '/getfixedcharge?hotelID=1&reservationID=' + sessionStorage.getItem('reservationID'))
          .then(result => result.json())
          .then(resp => {
            // //console.log(resp['data'])
            // setConfirmDelete(!ConfirmDelete)
            setAllFixedCharges(resp['data'])
          })
        // setFolioCount(rowData['data'])
      }).catch((error) => {
        // //console.log(error)
      })


      .catch((error) => {
        // //console.log(error);
      });
  }
  const onSubmit = () => {
    // //console.log(data)
    // //console.log(typeof(data.FromDate))
    let createmarketGroup = JSON.stringify({
      supplement: data.Supplements,
      remarks: data.remarks,
      // beginDate:(Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD')),
      // endDate: (Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD')),
      beginDate:(typeof(data.FromDate)== 'object' ? (Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD')) : data.FromDate),
      endDate: (typeof(data.ToDate)== 'object' ? (Moment(String((data.ToDate[0]))).format('YYYY-MM-DD')) :data.ToDate),
      amount: data.Amount,
      transactionCodeID: sessionStorage.getItem('TransactionCodeID'),
      // frequency: data.frequency2.value,
      frequency: 'Daily',
      description:Description


    });
    // //console.log(createmarketGroup)
    if (SelectedRowData.length != 0) {
      let res = fetchx(API_URL + `/updatefixedcharge?id=${SelectedRowData.id}&ModifyStatus=Edit&reservationID=${sessionStorage.getItem('reservationID')}&previousFromDate=${SelectedRowData['beginDate']}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: createmarketGroup,
      })
        .then((result) => result.json())
        .then((resp) => {

          // //console.log(resp);
          // //console.log(resp["data"])
          if (resp.statusCode == 200) {
            toast(
              <div className="d-flex">
                <div className="me-1">
                  <Avatar size="sm" color="success" icon={<Check size={12} />} />
                </div>
                <div className="d-flex flex-column">
                  <h6>Fixed Charges Updated Successfully</h6>
                  {/* <h4>Wait-List Added Successfully</h4> */}
                </div>
              </div>
            );
            setShowPreview(false)

          } 
          else {
            // //console.log('error')
            seterrorMsg(resp.message)
            setshowErrorMsg(!showErrorMsg)
          }
          handleReset()
          // setShowPreview(!ShowPreview)
          setTransactionCode('')
          setDescription('')
          setOpen('0')
          fetchx(API_URL + '/getfixedcharge?hotelID=1&reservationID=' + sessionStorage.getItem('reservationID'))
            .then(result => result.json())
            .then(resp => {
              // //console.log(resp['data'])
              setShowPreview(false)
              setAllFixedCharges(resp['data'])
            })
          // setFolioCount(rowData['data'])
        }).catch((error) => {
          // //console.log(error)
        })


        .catch((error) => {
          // //console.log(error);
        });
    } else if((Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD'))=='Invalid date' || (Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD'))=='Invalid date'){
        seterrorMsg('Invalid Date')
        setshowErrorMsg(!showErrorMsg)
      }else{
    //  //console.log(JSON.stringify({
    //   hotelID: 1,
    //   reservationID: sessionStorage.getItem('reservationID'),
    //   // frequency: data.frequency2.value,
    //   frequency: 'Daily',

    //   beginDate: (Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD')),
    //   endDate: (Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD')),
    //   transactionCodeID: sessionStorage.getItem('TransactionCodeID'),
    //   amount: data.Amount,
    //   quantity: 1,
    //   remarks: data.remarks,
    //   supplement: data.Supplements,
    //   description:Description
    // }))
      fetchx(API_URL + "/addfixedcharge", {
        
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: 1,
          reservationID: sessionStorage.getItem('reservationID'),
          // frequency: data.frequency2.value,
          frequency: 'Daily',

          beginDate: (Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD')),
          endDate: (Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD')),
          transactionCodeID: sessionStorage.getItem('TransactionCodeID'),
          amount: data.Amount,
          quantity: 1,
          remarks: data.remarks,
          supplement: data.Supplements,
          description:Description
        })
      }).then(result => result.json())
        .then(rowData => {
          // //console.log(rowData['data'])
          if (rowData.statusCode == 200) {
            toast(
              <div className="d-flex">
                <div className="me-1">
                  <Avatar size="sm" color="success" icon={<Check size={12} />} />
                </div>
                <div className="d-flex flex-column">
                  <h6>Fixed Charges Added Successfully</h6>
                  {/* <h4>Wait-List Added Successfully</h4> */}
                </div>
              </div>
            );
          } else {
            seterrorMsg(rowData.message)
            setshowErrorMsg(!showErrorMsg)
          }
          handleReset()
          setTransactionCode('')
          setDescription('')
          setShowPreview(false)

          setOpen('0')
          fetchx(API_URL + '/getfixedcharge?hotelID=1&reservationID=' + sessionStorage.getItem('reservationID'))
            .then(result => result.json())
            .then(resp => {
              // //console.log(resp['data'])
              setAllFixedCharges(resp['data'])
            })
          // setFolioCount(rowData['data'])
        }).catch((error) => {
          // //console.log(error)
        })

    }
  }
  function getButtonsUsingForLoop(data) {
    // //console.log(data)
    const array = []

    for (var i = 0; i < data.length; i++) {
      // //console.log(data[i])
      array.push(
        //     <Button color ={color} className="me-0.5" style={{ 'margin-right' : '10px',height:'80px',width:'80px',
        //     'margin-bottom' :'10px'}}
        //     id={tableid}
        //     name="bt"
        //     >
        //     {i}
        //   </Button>
        <Card style={{
          'margin-right': '10px', height: '280px', width: '280px',
          'margin-bottom': '10px'
        }}>

          <p style={{ 'margin-left': '10px' }}><b>From Date : </b>{data[i]['beginDate']}</p>
          <p style={{ 'margin-left': '10px' }}><b>To Date   : </b>{data[i]['endDate']}</p>
          <p style={{ 'margin-left': '10px' }}><b>Transaction Desc : </b>{data[i]['transactionCodeID']}</p>
          <p style={{ 'margin-left': '10px' }}><b>Frequency : </b>{data[i]['frequency']}</p>
          <p style={{ 'margin-left': '10px' }}><b>Amount : </b>{data[i]['amount']}</p>
          <p style={{ 'margin-left': '10px' }}><b>Supplements : </b>{data[i]['supplement']}</p>
          <p style={{ 'margin-left': '10px' }}><b></b></p>

        </Card>
      )
    }

    return array
  }
  //Search element
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef1.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    )
  }, [])
  const today = Moment(new Date(Today)).format('YYYY-MM-DD')
  const FromDate = watch('FromDate');
  let AddNewDateoptions = {
    
    // minDate: today
}
  if(ReservationDetails.hasOwnProperty('arrivalDate')){
    //console.log('Insideee')
    if(Today>ReservationDetails['arrivalDate']){
      AddNewDateoptions = {
    
        minDate: Today,
        maxDate: Moment(ReservationDetails['departureDate']).subtract(1, 'days').format('YYYY-MM-DD')
      }
    }else{
      AddNewDateoptions = {
    
        minDate: ReservationDetails['arrivalDate'],
        maxDate: Moment(ReservationDetails['departureDate']).subtract(1, 'days').format('YYYY-MM-DD')
      }
    }

}
let EditDateoptions = {
 
}
if(SelectedRowData.length != 0 ){
   EditDateoptions = {
    minDate: SelectedRowData['beginDate'],
    maxDate: SelectedRowData['endDate']

  }
}


  const optionsToDate = {
    minDate: (Moment(String(new Date(FromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
  };
  const handleChange = (selectedOption) => {
    const selectedIds = selectedOption.map(option => option.value);
    // //console.log(selectedIds)
    // //console.log(selectedOption.label);

  };

  const handleChange123 = (selectedOption) => {
    // //console.log("=================>")
    // //console.log(selectedOption)
    // const selectedIds = selectedOption.map(option => option.value);
    // // //console.log(selectedIds)
    // // //console.log(selectedOption.label);

  };

  const customNoRowsOverlay = (
    <div
      className="ag-overlay-no-rows-center"
      style={{ backgroundColor: '#f9f9f9', padding: '10px' }}
    >
      <span>No data available.</span>
    </div>
  );
  const ConfirmSubmit = (data) => {
    // console.log(data)
    const fromDate = Moment(data.FromDate); // Convert to a moment object
    const toDate = Moment(data.ToDate); // Convert to a moment object
    
    // console.log((Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD')), (Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD')));
    // console.log((Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD'))>(Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD')))
    if ((Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD'))>(Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD'))) {
      seterrorMsg('From Date cannot be less than To Date');
      setshowErrorMsg(true); // Toggle error message visibility
    } else {
      setshowErrorMsg(false); // Hide error message if condition is valid
    // }
    // //console.log(data)
    setData(data)
    //console.log(data.Additionaldesc!=undefined,data.Additionaldesc!='',data.Additionaldesc!=null)
    if(data.Additionaldesc!='' && data.Additionaldesc!=null &&  data.Additionaldesc!=undefined){
      //console.log('Modifying descr')
      setDescription(data.Additionaldesc)
    }
    // //console.log(document.getElementById('Amount').value)
    // setquantity(document.getElementById('quantity').value)
    let updatedBasePrice = document.getElementById('Amount').value
    setdefaultPrice(document.getElementById('Amount').value)
    const company = JSON.stringify({
      hotelID: 1,
      transactionCode: sessionStorage.getItem('TransactionCodeID'),
      Price: data.Amount
    })
    // //console.log(company)
    fetchx(API_URL + "/getTransactionCodeTaxesbyTrxnCodeID", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: company
    }).then(result => result.json())
      .then(rowData => {
        // //console.log(rowData['data'])
        let tax = rowData['data']
        let taxDetails = {}
        // let taxPercentage = 0
        taxDetails['sgstAmt'] = 0
        taxDetails['cgstAmt'] = 0
        taxDetails['vatAmt'] = 0
        let qty = 1
        // //console.log(qty)
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
        // //console.log(taxDetails)
        setShowPreview(!ShowPreview)

      }).catch((error) => {
        // //console.log(error)
      })
    }
  }
  const EditForm = () => {
    if (Edit) {
      setFrequency(SelectedRowData.frequency)
       defaultReason = {
        value: SelectedRowData.frequency,
        label: SelectedRowData.frequency,
      };
      // //console.log(defaultReason)
      // //console.log(SelectedRowData)
      defaultValues = {
        Supplements: SelectedRowData.supplement,
        remarks: SelectedRowData.remarks,
        FromDate: SelectedRowData.beginDate,
        ToDate: SelectedRowData.endDate,
        Amount: SelectedRowData.amount,
        TransactionCode: SelectedRowData.transactionCode,
        Description: SelectedRowData.description,
        frequency: SelectedRowData.frequency,
        frequency2:{
          value: SelectedRowData.frequency,
          label: SelectedRowData.frequency,
        }

      }

    }
    const { reset, handleSubmit, control, watch } = useForm({ defaultValues })


    if (New) {
      defaultValues = {
        Supplements: "",
        remarks: "",
        FromDate: "",
        ToDate: "",
        Amount: "",
        TransactionCode: "",
        Description: "",
        frequency2: ""

      }
    }
    // // //console.log(defaultReason)


    return (
      <Card>
        <CardBody>
          <Form onSubmit={handleSubmit(ConfirmSubmit)}>
            <Row>
           <Row>
            <Col md='6' sm='12' >
                

                <Label className="form-label">
                  Code
                  <Input  style={{width:'330px'}} required disabled={SelectedRowData.length != 0} type="text" name='TransactionCode' value={TransactionCode} onClick={() => {
                    setTransactionCodeSelect(true)
                    setShowDropdown(true)
                  }} />
                </Label>
            
              </Col>
              <Col md='6' sm='12' >
                <Label className="form-label">
                  Description
                  <Input style={{width:'340px'}} disabled={SelectedRowData.length != 0} type="text" name='Description' value={Description} />
                </Label>
              </Col>
              </Row>
              {/* <Col md='4' sm='12'>
                <div>
                  <Label className='form-label' for='frequency2'>
                    Frequency <spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    id='frequency2'
                    control={control}
                    name='frequency2'
                    render={({ field }) => (
                      <Select
                        required
                        // isClearable
                        defaultValue={defaultReason}
                        isClearable
                        options={frequencyOptions}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.frequency2 === null })}
                        {...field}
                      // onChange={handleChange123}

                      />
                    )}
                  />
                </div>
              </Col> */}
              <Col md='4' sm='12'>
                <div className='mb-1'>
                  <Label className='form-label' for='FromDate'>
                    From Date<spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id='FromDate'
                    name='FromDate'
                    render={({ field }) => (
                      <Flatpickr
                        // disabled={isSubmitted}
                        required
                        {...field}
                        options={Edit ? EditDateoptions : AddNewDateoptions}
                        placeholder='YYYY-MM-DD '
                        className={classnames('form-control', {
                          'is-invalid': data !== null && data.FromDate === null
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md='4' sm='12'>
                <div className='mb-1'>
                  <Label className='form-label' for='ToDate'>
                    To Date <spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id='ToDate'
                    name='ToDate'

                    render={({ field }) => (
                      <Flatpickr

                        // disabled={isSubmitted}
                        {...field}
                        required
                        options={Edit ? EditDateoptions : AddNewDateoptions}
                        placeholder='YYYY-MM-DD '
                        className={classnames('form-control', {
                          'is-invalid': data !== null && data.ToDate === null
                        })}
                      />
                    )}
                  />
                </div>
              </Col>


{/* 
<Col md='8' sm='12'>
                  <div className="mb-1">
                  <Label className='form-label' for='frequency'>
                    Frequency 
                  </Label> 
                    <Controller
                      id="frequency"
                      control={control}
                      name="frequency"
                      render={({ field }) => (
                        <Select
                          required
                          defaultValue={defaultReason}
                          isClearable
                          options={frequencyOptions}
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          {...field}
                          // onChange={handleChange} // Add onChange event handler
                        // value={selectedValue || defaultReason}
                        // onChange={(selectedOption) => {
                        //   handleChange(selectedOption);
                        //   field.onChange(selectedOption);
                        // }}
                        />
                      )}
                    />
                  </div>
                </Col> */}

              <Col md='4' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="Amount">
                    Amount
                  </Label>
                  <InputGroup className="input-group-merge">
                    {/* <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && (data.Items === null || !data.Items.length)
                })}
              ></InputGroupText> */}
                    <Controller

                      name="Amount"
                      control={control}

                      render={({ field }) => (
                        <Input
                          required
                          id="Amount"
                          // pattern="[aA-zZ]*" title="Only Alphabets Allowed" 
                          // required
                          // placeholder="Enter Items"
                          {...field}
                          className={classnames("form-control", {
                            // "is-invalid":
                            //   data !== null && (data.Amount === null || !data.Amount.length)
                          })}
                        />
                      )}
                    />
                  </InputGroup>
                </div>
              </Col>
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
                  <Label className="form-label" for="remarks">
                    remarks
                  </Label>
                  <InputGroup className="input-group-merge">
                    {/* <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && (data.Items === null || !data.Items.length)
                })}
              ></InputGroupText> */}
                    <Controller
                      id="remarks"
                      name="remarks"
                      control={control}

                      render={({ field }) => (
                        <Input
                          // pattern="[aA-zZ]*" title="Only Alphabets Allowed" 
                          // required
                          // placeholder="Enter Items"
                          {...field}
                          className={classnames("form-control", {
                            // "is-invalid":
                            //   data !== null && (data.remarks === null || !data.remarks.length)
                          })}
                        />
                      )}
                    />
                  </InputGroup>
                </div>
              </Col>
              <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Additionaldesc">
            Additional description
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
                id="Additionaldesc"
                name="Additionaldesc"
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
              <div align='end'>
                <Button color='primary' className='me-1' type='submit'>
                  Save
                </Button>
                <Button outline className='me-1' color='secondary' onClick={() => {
                  handleReset()
                  setTransactionCode('')
                  setDescription('')
                  setOpen('0')
                  setSelectedRowData([])
                }} type='reset'>
                  Cancel
                </Button>

              </div>
            </Row>
          </Form>
        </CardBody>
      </Card>)
  }
  return (
    <>
      {/* <Button color='primary' onClick={()=>setAddnewFixedCharge(true)}>New</Button><br></br><br></br> */}
      {ReservationDetails.hasOwnProperty('arrivalDate') && 
         <>
         <Row>
            <Col sm='6'>
              <h5>Guest Name : <b>{ReservationDetails['salutation']+' '}{ReservationDetails['firstName']+' '}{ReservationDetails['lastName']}</b></h5>
              <h5>Confirmation No : <b>{ReservationDetails['bookingID']}</b></h5>
              <h5>Arrival : <b>{ReservationDetails['arrivalDate']}</b></h5>
            </Col>
            
            <Col sm='6'>
            <h5>Company : <b>{ReservationDetails['accountName']}</b></h5>
            <h5>Balance(INR) : <b>{ReservationDetails['balance']}</b></h5>
            <h5>Departure : <b>{ReservationDetails['departureDate']}</b></h5>
            </Col>
            {/* <Col sm='2'>
            
            
            
            </Col> */}
        </Row>
         
        <div style={{'border-bottom': '1px solid #E8E8E8','margin-bottom': '10px'}} ></div>
   
        
              
         </>}
      {
        <Accordion open={open} toggle={toggle}>
          <AccordionItem>
            <AccordionHeader targetId='1'><b></b><Button style={{ textAlign: 'left' }} color='primary' onClick={() => {
              setSelectedRowData([])
              setTransactionCode('')
              setDescription('')
              handleReset()
              setData([])
              // setOpen('1')
              setEdit(false)
              setNew(true)
            }}>Add Fixed Charge</Button></AccordionHeader>
            <AccordionBody accordionId='1'>
              {/* <Card>
<CardBody>
  <Form onSubmit={handleSubmit(onSubmit)}>
    <Row>

     <Col md='4' sm='12'>
        <div className='mb-1'>
          <Label className='form-label' for='FromDate'>
            From Date<spam style={{ color: 'red' }}>*</spam>
          </Label>
          <Controller
            control={control}
            id='FromDate'
            name='FromDate'
            render={({ field }) => (
              <Flatpickr
                // disabled={isSubmitted}
                required
                {...field}
                options={options}
                placeholder='YYYY-MM-DD '
                className={classnames('form-control', {
                  'is-invalid': data !== null && data.FromDate === null
                })}
              />
            )}
          />
        </div>
      </Col>

      <Col md='4' sm='12'>
        <div className='mb-1'>
          <Label className='form-label' for='ToDate'>
            To Date <spam style={{ color: 'red' }}>*</spam>
          </Label>
          <Controller
            control={control}
            id='ToDate'
            name='ToDate'
            
            render={({ field }) => (
              <Flatpickr
              
                // disabled={isSubmitted}
                {...field}
                required
                options={optionsToDate}
                placeholder='YYYY-MM-DD '
                className={classnames('form-control', {
                  'is-invalid': data !== null && data.ToDate === null
                })}
              />
            )}
          />
        </div>
      </Col>

      <Col md='4' sm='12'>
        <div>
          <Label className='form-label' for='frequency'>
            Frequency <spam style={{ color: 'red' }}>*</spam>
          </Label>
          <Controller
            id='frequency'
            control={control}
            name='frequency'
            render={({ field }) => (
              <Select
                isSubmitted
                isClearable
                required
                options={frequencyOptions}
                classNamePrefix='select'
                theme={selectThemeColors}
                className={classnames('react-select', { 'is-invalid': data !== null && data.frequency === null })}
                {...field}
              />
            )}
          />
        </div>
      </Col>
      <Col md='4' sm='12' className='mb-1'>
       
       <Label className="form-label">
       Code
       <Input required type="text" name='TransactionCode' value={TransactionCode} onClick={() => {setTransactionCodeSelect(true)
    setShowDropdown(true)}}/>
       </Label>
       </Col>
       <Col md='4' sm='12' className='mb-1'>
       <Label className="form-label">
       Description
       <Input  type="text" name='Description' value={Description}/>
       </Label>
       </Col>

<Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Amount">
            Amount
            </Label>
            <InputGroup className="input-group-merge">
   
              <Controller
                id="Amount"
                name="Amount"
                control={control}
                
                render={({ field }) => (
                  <Input
                  required
                  // pattern="[aA-zZ]*" title="Only Alphabets Allowed" 
                  // required
                  // placeholder="Enter Items"
                    {...field}
                    className={classnames("form-control", {
                      // "is-invalid":
                      //   data !== null && (data.Amount === null || !data.Amount.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
<Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="Supplements">
            Supplements
            </Label>
            <InputGroup className="input-group-merge">

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
            <Label className="form-label" for="remarks">
            remarks
            </Label>
            <InputGroup className="input-group-merge">
          
              <Controller
                id="remarks"
                name="remarks"
                control={control}
                
                render={({ field }) => (
                  <Input
                  // pattern="[aA-zZ]*" title="Only Alphabets Allowed" 
                  // required
                  // placeholder="Enter Items"
                    {...field}
                    className={classnames("form-control", {
                      // "is-invalid":
                      //   data !== null && (data.remarks === null || !data.remarks.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>

      <div align='end'>
      <Button color='primary' className='me-1' type='submit'>
         Add Charges
        </Button>
        <Button outline className='me-1' color='secondary' onClick={()=>{
          handleReset()
          setTransactionCode('')
          setDescription('')
          setOpen('0')
        }} type='reset'>
          Cancel
        </Button>
        
      </div>
    </Row>
  </Form>
</CardBody>
</Card> */}
              {New && <EditForm />}
              {SelectedRowData.length != 0 && Edit && <EditForm />}
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      }

      {/* Select Reason */}
      {showDropdown &&
        (
          <div>
            <Modal isOpen={TransactionCodeSelect} toggle={() => setTransactionCodeSelect(!TransactionCodeSelect)} className='modal-dialog-centered modal-lg' >
              <ModalHeader toggle={() => setTransactionCodeSelect(!TransactionCodeSelect)}>Search and Select Code</ModalHeader>
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
                    overlayNoRowsTemplate={'No record found'}
                    ref={gridRef1}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    animateRows={true}
                    onCellClicked={cellClickedListener1}
                    paginationPageSize='10'
                    pagination='true'
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"
                  />
                </div>
              </ModalBody>
            </Modal>
          </div>
        )
      }

      <div className="ag-theme-alpine" style={{ height: 280 }}>
        <AgGridReact
        overlayNoRowsTemplate={'No record found'}
          ref={gridRef1}
          rowData={AllFixedCharges}
          columnDefs={FixedChargescolumnDefs}
          animateRows={true}
          paginationPageSize='10'
          pagination='true'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
          onCellClicked={cellClickedListener2}

        />
      </div>
      <Modal isOpen={ShowPreview} toggle={() => setShowPreview(!ShowPreview)} className='modal-dialog-centered' >
        <ModalHeader className='modal-dialog-centered' toggle={() => {
          setShowPreview(!ShowPreview)
          setOpen('0')
        }}></ModalHeader>
        <ModalBody >
          <h2 className='text-center mb-1'>Preview</h2>
          {data.length != 0 && <div >
            {/* <h6>Transaction Code : <b>{TransactionCode}</b></h6> */}
            <h6>Description : <b>{Description}</b></h6>
            <h6>Amount :<b>{data.Amount}</b></h6>
            <h6>Supplements : <b>{data.Supplements}</b></h6>
            <h6>Remarks : <b>{data.remarks}</b></h6>
            <h6>CGST: <b>{Amount['cgstAmt']}</b></h6>
            <h6>SGST: <b>{Amount['sgstAmt']}</b></h6>
            <h6>Total: <b>{Amount['totalAmount']}</b></h6>
          </div>}

          <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' onClick={onSubmit}>
                Confirm
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                  setShowPreview(!ShowPreview)
                  setOpen('0')

                  // window.location.reload()
                  // setShow(!show)
                  // setPostCharges(!PostCharges)
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>


      {/* Delete Fixed Charges */}
      <Modal isOpen={ConfirmDelete} toggle={() => setConfirmDelete(!ConfirmDelete)} className='modal-dialog-centered' >
        <ModalHeader className='modal-dialog-centered' toggle={() => {
          setConfirmDelete(!ConfirmDelete)
        }}></ModalHeader>
        <ModalBody >
          <h2 className='text-center mb-1'>Preview</h2>
          {SelectedRowData.length != 0 && <div >
            {/* <h6>Transaction Code : <b>{TransactionCode}</b></h6> */}
            <h6>Description : <b>{Description}</b></h6>
            <h6>Amount :<b>{SelectedRowData.amount}</b></h6>
            <h6>Supplements : <b>{SelectedRowData.supplement}</b></h6>
            <h6>Remarks : <b>{SelectedRowData.remarks}</b></h6>

          </div>}

          <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary' onClick={DeleteFixedCharge}>
                Delete
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                  setConfirmDelete(!ConfirmDelete)

                  // window.location.reload()
                  // setShow(!show)
                  // setPostCharges(!PostCharges)
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={showErrorMsg}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent' toggle={() => {
          setshowErrorMsg(!showErrorMsg);
        }}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <p className='text-center mb-1' style={{ color: '#FF0000' }}>Alert : Please Rectify and try again!!!</p>
          <h3 className='text-center mb-1'>{errorMsg}</h3>

          {/* <h6>Room No : {TrnxSelected.description}</h6>
            <h6>Booking ID : {TrnxSelected.total}</h6>
            <h6>Guest Name : {TrnxSelected.date}</h6> */}

          {/* {data.Folio!=undefined && <h6>Folio No: <b>{data.Folio.value}</b></h6>} */}

          <Row>
            <Col className='text-center mt-1' xs={12}>
              {/* <Button type='submit' className='me-1' color='primary' onClick={TransferTransaction}>
               OK
              </Button> */}
              <Button
                color='primary'
                onClick={() => {
                  // window.location.reload()
                  setshowErrorMsg(!showErrorMsg)
                }}
              >
                OK
              </Button>
            </Col>
          </Row>

        </ModalBody>
      </Modal>
      {/* {AllFixedCharges.length!=0 && getButtonsUsingForLoop(AllFixedCharges)}   */}
      {/* {SelectedRowData.length!=0 && <Modal isOpen={editcharges} toggle={() => seteditcharges(!editcharges)} className='modal-lg' >
        <ModalHeader className='modal-lg' toggle={() => {seteditcharges(!editcharges) }}></ModalHeader>
        <ModalBody className='pb-3 px-sm-2 mx-20'>
          <div >
            <EditFixedCharges Editdata={''}/>
            </div>
            </ModalBody>
      </Modal>} */}
    </>
  )
}
export default FixedCharges
