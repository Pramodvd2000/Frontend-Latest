import React, { Fragment, useState, Component, useRef, useEffect, useMemo, useCallback } from 'react'

import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Moment from 'moment'
import { useNavigate } from "react-router-dom"

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import * as ReactDOM from 'react-dom'

// ** Reactstrap Imports
import {
    AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, Accordion, InputGroup, NavLink
  } from 'reactstrap'
  import API_URL from '../../../config'
  let frequencyOptions =[
    {value:"Once" , label:"Once"},
    {value:"Daily" , label:"Daily"},

  ]

let defaultValues =[]
  const EditFixedCharges = ({Editdata}) => {
    //console.log(Editdata)

if(Editdata.length!=0){
  defaultValues = {
    Supplements: Editdata.Supplements,
    remarks: Editdata.remarks,
    FromDate : Editdata.beginDate,
    ToDate : Editdata.endDate,
    Amount : Editdata.amount,
    TransactionCode:Editdata.transactionCode,
    Description : Editdata.description,
    frequency : Editdata.frequency

  }
}else{
  defaultValues = {
    Supplements: "",
    remarks: "",
    FromDate : "",
    ToDate : "",
    Amount : "",
    TransactionCode:"",
    Description : "",
    frequency : ""

  }
}



    const { reset, handleSubmit, control, watch  } = useForm({defaultValues})
    const [data, setData] = useState(null)
    const [ReasonSelect, setReasonSelect] = useState(false)
    const [TransactionCodeSelect, setTransactionCodeSelect] = useState(true)
    const [TransactionCode, setTransactionCode] = useState(Editdata.transactionCode)
    const [Description,setDescription] = useState(Editdata.description)
    const gridRef1 = useRef()
    const [rowData, setRowData] = useState()
    const [Amount,setAmount] = useState('')
    const [defaultAmount,setdefaultAmount] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [AddnewFixedCharge,setAddnewFixedCharge] = useState(false)
    const [AllFixedCharges,setAllFixedCharges] = useState([])
    const [open, setOpen] = useState('0')
    const [selectedValue, setSelectedValue] = useState(Editdata.frequency);

    // setTransactionCode(Editdata.transactionCode)
  //Ag-grid column definition
  const [columnDefs] = useState([
    { headerName: 'transactionCode', field: 'transactionCode', maxWidth:300 },
    // { headerName: 'Address', field: "description", valueGetter(params) {
    //     return params.data.addressLine1 + ' ' + params.data.addressLine2;
    //   },suppressSizeToFit: true, maxWidth: 600 },
    { headerName: 'description', field: 'description', maxWidth:300 },
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

  const [FixedChargescolumnDefs] = useState([
    { headerName: 'hotelID', field: 'hotelID', maxWidth:100 },
    {headerName:'reservationID' , field:'reservationID', maxWidth:110 },
    {headerName:'frequency' , field:'frequency', maxWidth:110 },
    {headerName:'beginDate' , field:'beginDate', maxWidth:110 },
    {headerName:'endDate' , field:'endDate', maxWidth:110 },
    {
        headerName: "Edit",
        maxWidth: 140,
        cellRenderer: (event) => {
          return (<Button color='primary' onClick={()=>{}}>Edit</Button>)
        }
      },
  
   
  ]) 
  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }
  useEffect(() => {

    //console.log('In useEffect')

    // ReactDOM.render(<CardData />, document.getElementById("displayCard"))
    fetchx(API_URL + `/getAllTransactionCode?hotelID=1`)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
        // //console.log(rowData['data'])
        // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
      })


      fetchx(API_URL + '/getfixedcharge?hotelID=1&reservationID='+localStorage.getItem('reservationID'))
      .then(result => result.json())
      .then(resp => {
        //console.log(resp['data'])
        setAllFixedCharges(resp['data'])
      })

  }, [])  
  const cellClickedListener = useCallback(event => {
    //console.log(event['data'])
    //console.log('Price null')
    // handleReset()
    setTransactionCode(event['data']['transactionCode'])
    sessionStorage.setItem('TransactionCodeID',event['data']['id'])
    setDescription(event['data']['description'])
    sessionStorage.setItem('TransactionCodeID',event['data']['id'])
    setAmount('')
    setTransactionCodeSelect(false)

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
    const onSubmit = data => {
        //console.log(data)
        let createmarketGroup = JSON.stringify({
          supplement: data.Supplements,
          remarks: data.remarks,
          beginDate : data.beginDate,
          endDate : data.endDate,
          amount : data.amount,
          transactionCodeID:sessionStorage.getItem('TransactionCodeID'),
          frequency : data.frequency.value
    
        });
        //console.log(createmarketGroup);
        //console.log("hi");
        if(Editdata.length!=0){
          let res = fetchx(API_URL + `/updatefixedcharge?id=${Editdata.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: createmarketGroup,
          })
            .then((result) => result.json())
            .then((resp) => {
            
              //console.log(resp);
              //console.log(resp["data"])
              
            })
            .catch((error) => {
              //console.log(error);
            });
        }else{
        
// //console.log(JSON.stringify({
//   hotelID: 1,
//   reservationID:localStorage.getItem('reservationID'),
//   frequency:data.frequency.value,
//   beginDate:(Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD')), 
//   endDate:(Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD')), 
//   transactionCodeID:1, 
//   amount:data.Amount,
//   quantity:1,
//   remarks:data.remarks,
//   supplement:data.Supplements
//     }))

    if(data.remarks==undefined){
      data.remarks=""
    }
    if(data.Supplements==undefined){
      data.Supplements=""
    }
        // "/addfixedcharge"
        fetchx(API_URL + "/addfixedcharge", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hotelID: 1,
                reservationID:localStorage.getItem('reservationID'),
                frequency:data.frequency.value,
                beginDate:(Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD')), 
                endDate:(Moment(String(new Date(data.ToDate[0]))).format('YYYY-MM-DD')), 
                transactionCodeID:1, 
                amount:data.Amount,
                quantity:1,
                remarks:data.remarks,
                supplement:data.Supplements
                  })
          }).then(result => result.json())
          .then(rowData => {
              //console.log(rowData['data'])
              fetchx(API_URL + '/getfixedcharge?hotelID=1&reservationID='+localStorage.getItem('reservationID'))
              .then(result => result.json())
              .then(resp => {
                //console.log(resp['data'])
                // setAllFixedCharges(resp['data'])
              })
              // setFolioCount(rowData['data'])
            }).catch((error) => {
              //console.log(error)
            })
          }

    }

    const handleChange = (selectedOption) => {
      setSelectedValue(selectedOption.value);
      //console.log(selectedOption.value)

    };
    function getButtonsUsingForLoop(data) {
        //console.log(data)
        const array = []
    
        for(var i = 0; i < data.length; i++){
        //console.log(data[i])
          array.push(
        //     <Button color ={color} className="me-0.5" style={{ 'margin-right' : '10px',height:'80px',width:'80px',
        //     'margin-bottom' :'10px'}}
        //     id={tableid}
        //     name="bt"
        //     >
        //     {i}
        //   </Button>
        <Card  style={{ 'margin-right' : '10px',height:'280px',width:'280px',
            'margin-bottom' :'10px'}}>
                
            <p style={{ 'margin-left' : '10px'}}><b>From Date : </b>{data[i]['beginDate']}</p>
            <p style={{ 'margin-left' : '10px'}}><b>To Date   : </b>{data[i]['endDate']}</p>
            <p style={{ 'margin-left' : '10px'}}><b>Transaction Desc : </b>{data[i]['transactionCodeID']}</p>
            <p style={{ 'margin-left' : '10px'}}><b>Frequency : </b>{data[i]['frequency']}</p>
            <p style={{ 'margin-left' : '10px'}}><b>Amount : </b>{data[i]['amount']}</p>
            <p style={{ 'margin-left' : '10px'}}><b>Supplements : </b>{data[i]['supplement']}</p>
            <p style={{ 'margin-left' : '10px'}}><b></b></p>

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
    const today = Moment().format('YYYY-MM-DD')
    const FromDate = watch('FromDate');

    const options = {
        minDate: today
      }
    
    
      const optionsToDate = {
        minDate: (Moment(String(new Date(FromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
      };

      const defaultReason = {
        value: Editdata.frequency,
        label: Editdata.frequency,
      };
    return (
<>
{/* <Button color='primary' onClick={()=>setAddnewFixedCharge(true)}>New</Button><br></br><br></br> */}

{ 
    // <Accordion open={open} toggle={toggle}>
    //   <AccordionItem>
    //     <AccordionHeader targetId='1'><b></b></AccordionHeader>
    //     <AccordionBody accordionId='1'>
<Card>
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
                defaultValue={defaultReason}

                options={frequencyOptions}
                classNamePrefix='select'
                theme={selectThemeColors}
                className={classnames('react-select', { 'is-invalid': data !== null && data.frequency === null })}
                {...field}
              />
            )}
          />
          {/* <Controller
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
                          onChange={handleChange} // Add onChange event handler

                        />
                      )}
                    /> */}
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
              {/* <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && (data.Items === null || !data.Items.length)
                })}
              ></InputGroupText> */}
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

      <div align='end'>
      <Button color='primary' className='me-1' type='submit'>
         Save 
        </Button>
        <Button outline className='me-1' color='secondary' type='reset'>
          Cancel
        </Button>
        
      </div>
    </Row>
  </Form>
</CardBody>
</Card>
// </AccordionBody>
//       </AccordionItem>
//       </Accordion>
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
                                    ref={gridRef1}
                                    rowData={rowData}
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
            )
            }

                            

            {/* {AllFixedCharges.length!=0 && getButtonsUsingForLoop(AllFixedCharges)}   */}

</>
)
  }
  export default EditFixedCharges