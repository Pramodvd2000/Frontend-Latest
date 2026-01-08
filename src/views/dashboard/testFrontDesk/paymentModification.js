

// ** React Imports
import { useState, useEffect } from 'react'
import Moment from "moment";
// ** Third Party Components
import Select from 'react-select'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
// ** Utils
import { selectThemeColors } from '@utils'
// ** Reactstrap Imports
import { Input, Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText } from 'reactstrap'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import API_URL from '../../../config'

import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)



const defaultValues8 = {
    paymentTypeID: null,
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv:'',
    transactionID:'',
    BTCType:null,
  }

  let paymentName = [
    // fetchx(API_URL + '/getPayment?hotelID=1')
    //   .then(result => result.json())
    //   .then(resp => {
    //     paymentName = resp['data']
    //   })
  ]


  // BTC Types
  const BTCTypes = [
    {label:"RBTC", value:"4"},
    {label:"EBTC", value:"5"},
    {label:"RFLBTC", value:"6"},
    {label:"RAIRPBTC", value:"7"},
    {label:"RTCC", value:"8"},
  ]


const PaymentModification = (data1) => {
  //console.log(data1)
  let navigate = useNavigate();  
  const {
    setError,
    formState: { errors },
  } = useForm();
  const [details, setDetails] = useState('');
  const [paymentName, setPaymentName] = useState([]);
  const [paymentType, setPaymentType] = useState([]);

  const [rowData2, setRowData2] = useState('');
  const { register, handleSubmit, control } = useForm();
  const [selectedOption, setSelectedOption] = useState('');
  const [BTCOptions, setBTCOptions] = useState('');
  const today = Moment().format('YYYY-MM-DD');

  const options = {
    minDate: today
  };
  
  
      const defaultReason = {
        value: details.paymentTypeCode,
        label: details.paymentTypeCode,    
      };
    //console.log(defaultReason)

  useEffect(() => {
    fetchx(API_URL + '/getPayment?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        setPaymentName(resp['data']);
        console.log(paymentName)
        console.log(resp['data'])

      });
  }, []);

  useEffect(() => {
    fetchx(API_URL + "/getReservationGuestDetails", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: '1',
        reservationID: data1['data1']['data1']['id'],
      })
    })
      .then(result => result.json())
      .then(rowData => {
        //console.log(rowData['data']);
        setDetails(rowData['data'][0]);
        //console.log(rowData['data'][0]['guestID']);

        fetchx(API_URL + `/getResPaymentInformations?hotelID=1&reservationID=${rowData['data'][0]['tempReservationID']}`)
          .then((result) => result.json())
          .then((rowData2) => {
            setRowData2(rowData2["data"][0]);
            //console.log(rowData2["data"]);
          })
          .catch((error) => {
            //console.log(error);
          });
      })
      .catch((error) => {
        //console.log(error);
      });
  }, [data1]);

  //console.log(details);
  //console.log(rowData2);

  const handleOptionChange = (event) => {
    if (event) {
      console.log(event)
      setPaymentType(event.value)
      setSelectedOption(event.paymentMode);
      console.log(event)
    } else {
      setSelectedOption('');
    }
  };

  //console.log(selectedOption)

  const handleBTCOption = (event) => {
    //console.log(event);
    if (event) {
      setBTCOptions(event.label);
    } else {
      setBTCOptions('');
    }
  };

  const onSubmit = (data) => {
    data["paymentTypeID1"] = selectedOption;
    //console.log(data);
    if (data.paymentTypeID !== null) {
      let paymentTypeID;
    
      if (data.paymentTypeID1 === '') {
          paymentTypeID = details.paymentTypeID;
      } else {
          paymentTypeID = paymentType;
      }
  
      const createmarketGroup = JSON.stringify({
          "reservationID": data1.data1.data1.id,
          "tempReservationID": data1.data1.data1.tempReservationID,
          "paymentTypeID": paymentTypeID,
          "cardNumber": (data.cardNumber || ''),
          "cardHolderName": (data.cardHolderName || ''),
          "cvv": (data.cvv || ''),
          "expiryDate": Array.isArray(data.expiryDate) && data.expiryDate[0]
              ? Moment(String(new Date(data.expiryDate[0]))).format('YYYY-MM-DD')
              : null,
          "transactionID": (data.transactionID || ''),
          "BTCType": (BTCOptions || ''),
      });
      //console.log(createmarketGroup);
      const res = fetchx( API_URL+ "/updateresPaymentModification", {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup,
      }).then((res) => {
        //console.log(res);
        const swalInstance = MySwal.fire({
          text: 'Payment Modification done Successfully!',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          allowOutsideClick: false, 
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            navigate('');
          }
        }); 
      });
    }
  };

  const handleReset = () => {
    reset({
      paymentTypeID: null,
      cardNumber: '',
      cardHolderName: '',
      expiryDate: '',
      cvv:'',
      transactionID:'',
      BTCTypeID:null,
    })
  }

  return (
    <div>

<Card>
  <h5>Payment Type Code: {rowData2.paymentTypeCode}</h5>
  
  {rowData2.cardHolderName && <h5>Card Holder Name: {rowData2.cardHolderName}</h5>}
  
  {rowData2.cardNumber && <h5>Card Number: {rowData2.cardNumber}</h5>}
  
  {rowData2.expiryDate && <h5>Expiry Date: {rowData2.expiryDate}</h5>}
  
  
  {/* <h5>Amount: {rowData2.amount}</h5> */}
  
  {rowData2.upiID && <h5>Transaction ID: {rowData2.upiID}</h5>}
</Card>


    <Card>
    <CardBody>
      <Form onSubmit={handleSubmit(onSubmit)}>

        {/* payment type selection */}
        <Row>
        {/* <Col className='mb-1' md='4 ' sm='12'>
              <Label className='form-label'>Select Payment Type</Label>
              <Select
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                onChange={handleOptionChange}
                options={paymentName}
                isClearable
              />
            </Col> */}
           {/* { selectedOption && */}
             <Col md='6' sm='12' className='mb-1'>
            { details.paymentTypeCode && <div className='mb-1'>
                <Label className='form-label' for='paymentTypeID1' >
                  Select Payment Type
                </Label>
                <Controller
                  id='paymentTypeID1'
                  control={control}
                  name='paymentTypeID1'
                  render={({field}) => (
                    <Select
                      // value={selectedOption}
                      // defaultValue = {defaultReason}
                      isClearable
                      options={paymentName}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 
                        // 'is-invalid': data !== null && data.paymentTypeID1 === null 
                      })}
                      {...field}
                      onChange={handleOptionChange}

                    />
                  )}
                />
              </div>}
            </Col>                  
        </Row>

        {/* Selection Based on credit card and Amex Card */}
        <Row>
          { (selectedOption === 2 ) && (
            <div>
                <Row>
                    <Col md='4' sm='12' className='mb-1'>
                      <div className='mb-1'>
                        <Label className='form-label' for='cardNumber'>
                          Card Number
                        </Label>
                        <Controller
                          // defaultValue={details.cardNumber}
                          control={control}
                          id='cardNumber'
                          name='cardNumber'
                          render={({ field }) => <Input placeholder='Card Number'
                          // pattern='[0-9]{3}' 
                          // title='Card Number should be a 16-digit number.'
                          maxLength='16' 
                            // invalid={errors.cardNumber && true} 
                            {...field} />}
                        />
                      </div>
                    </Col>
                    <Col md='4' sm='12' className='mb-1'>
                      <div className='mb-1'>
                        <Label className='form-label' for='cardHolderName'>
                          Card Holder Name
                        </Label>
                        <InputGroup className="input-group-merge">
                          <Controller
                            // defaultValue={details.nameOnCard}
                            control={control}
                            id='cardHolderName'
                            name='cardHolderName'
                            render={({ field }) => <Input placeholder='Card Holder Name'
                          
                              // invalid={errors.cardNumber && true}
                              {...field} />}
                          />
                        </InputGroup>
                      </div>
                    </Col>
                    <Col md='4' sm='12' className='mb-1'>
                      <div className='mb-1'>
                        <Label className='form-label' for='cvv'>
                          CVV
                        </Label>
                        <Controller
                          // defaultValue={details.CVV}
                          control={control}
                          id='cvv'
                          name='cvv'
                          render={({ field }) => <Input placeholder='cvv'
                          pattern='[0-9]{3}' 
                          title='CVV should be a 3-digit number.'
                          maxLength='3' 
                            // invalid={errors.cardNumber && true} 
                            {...field} />}
                        />
                      </div>
                    </Col>
                    <Col md='4' sm='12' className='mb-1'>
                      <div className='mb-1'>
                        <Label className='form-label' for='expiryDate'>
                          Expiry Date
                        </Label>
                        <Controller
                        // defaultValue={details.expiryDate} 
                          control={control}
                          id='expiryDate'
                          name='expiryDate'
                          render={({ field }) => (
                            <Flatpickr
                              {...field}
                              options={options}
                              placeholder='YYYY-MM-DD '
                              className={classnames('form-control', {
                                // 'is-invalid': data !== null && data.expiryDate === null
                              })}
                            />
                          )}
                        />
                      </div>
                    </Col>
                </Row>
            </div>)}
        </Row>
        {/* <h1>Transaction ID: {rowData2.upiID}</h1>
        {/* Selection based on Online payment */}
       
        {/* {(selectedOption === 9 || details.paymentTypeID === 9 ) && rowData2.upiID && <Col md="4" sm="12" className="mb-1">
                    <div className="mb-1">
                      <Label className="form-label" for="transactionID">
                      Transaction ID
                      </Label>
                      <Controller
                        control={control}
                        id="transactionID"
                        name="transactionID"
                        render={({ field }) => (
                          <Input
                            placeholder="StationCode"
                            invalid={errors.transactionID && true}
                            {...field}
                            defaultValue={rowData2.upiID}
                          />
                        )}
                      />
                    </div>
                  </Col>} */}

               { (selectedOption === 3 )  && (
                 <Col md="4" sm="12" className="mb-1">
                   <div className="mb-1">
                     <Label className="form-label" for="transactionID">
                       Transaction ID
                     </Label>
                     <Controller
                       control={control}
                       id="transactionID"
                       name="transactionID"
                       render={({ field }) => (
                         <Input
                           placeholder="Transaction ID" // Corrected placeholder value
                           invalid={errors.transactionID && true}
                           {...field}
                          //  defaultValue={rowData2.upiID}
                         />
                       )}
                     />
                   </div>
                 </Col>
               )}



         {/* Selection based on BTC */}
         {/* <Row>
          {(selectedOption === 15 )&&(
            <div>
                <Row>
                    <Col md='4' sm='12' className='mb-1'>
                        <div className='mb-1'>
                            <Label className='form-label' for='BTCType' >
                              Select BTC Types
                            </Label>
                            <Controller
                              id='BTCType'
                              control={control}
                              name='BTCType'
                              render={({}) => (
                                <Select
                                  isClearable
                                  onChange={handleBTCOption}
                                  options={BTCTypes}
                                  classNamePrefix='select'
                                  theme={selectThemeColors}
                                  className={classnames('react-select', { 
                                    'is-invalid': data !== null && data.BTCType === null
                                   })}
                                />
                              )}
                            />
                        </div>
                    </Col>
                </Row>
            </div>)}
        </Row> */}


        <br></br>
          {/* submit button */}
        <div className='d-flex'>
          <Button className='me-1' color='primary' type='submit'>
            Submit
          </Button>
          <Button outline color='secondary' type='reset' onClick={handleReset}>
            Reset
          </Button>
        </div>
      </Form>
    </CardBody>
  </Card>
    </div>
  );
};

export default PaymentModification;
