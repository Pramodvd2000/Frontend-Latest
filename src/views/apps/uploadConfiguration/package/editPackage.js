import { useState } from 'react'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import { Input, Card, Form, Row, Col, Label, Button ,Modal,InputGroup} from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { useRef, useEffect} from 'react';
import API_URL2 from '../../../../config2'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import Flatpickr from "react-flatpickr";
import classnames from "classnames";
import Moment from 'moment';
import Select from 'react-select'
import { selectThemeColors } from '@utils'

const MySwal = withReactContent(Swal)

  const defaultValues = { 
    // block: ''
  }

  let groupID = [
    fetchx(API_URL2 +'/getforeignkeygroupid?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        console.log(resp['data'])
        groupID = resp['data']
        // console.log(groupID)
      })
    ]

   const editBlock = ({data1}) => {
    console.log(data1)
       
    const {setError,formState: { errors }} = useForm()
    const [rowData, setRowData] = useState();
    const [data, setData] = useState(null)
    const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
    let navigate = useNavigate();  
    const [flag,setflag] = useState(false)  
    const [reload, setreload] = useState(true)
 
    const [basePrice, setBasePrice] = useState('');
    const [taxPercentage, setTaxPercentage] = useState('');
    const [totalAmount, setTotalAmount] = useState();
    // const [reload, setreload] = useState(true);

      const [TransactionCodeData,setTransactionCodeData] = useState([])

      const defaultReason4 = {
        value: data1.groupID,
        label: data1.groupCode,
      }; 

      const handleBasePriceChange = (value) => {
        // console.log('Base Price:', value);
    setBasePrice(value);
    calculateTaxAmount(value, taxPercentage);
  };

  // Function to handle changes in the taxAmount input (percentage)
  const handleTaxPercentageChange = (value) => {
        // console.log('Tax Amt:', value);
    setTaxPercentage(value);
    calculateTaxAmount(basePrice, value);
  };

       // Function to calculate the tax amount
   const calculateTaxAmount = (basePrice, taxPercentage) => {
    const parsedBasePrice = parseFloat(basePrice);
    const parsedTaxPercentage = parseFloat(taxPercentage);

    if (!isNaN(parsedBasePrice) && !isNaN(parsedTaxPercentage)) {
      const taxAmount = (parsedBasePrice * parsedTaxPercentage) / 100;
      console.log('Tax Amount:', taxAmount);
    }

    if (!isNaN(parsedBasePrice) && !isNaN(parsedTaxPercentage)) {
      const taxAmount = (parsedBasePrice * parsedTaxPercentage) / 100;
      const totalAmounts = parsedBasePrice + taxAmount;
      console.log('Total Amount:', totalAmounts);
      setreload(false)
      setTimeout(() => {setreload(true)},1)
      setTotalAmount(totalAmounts);
      console.log(totalAmount)
    }
  };
console.log(totalAmount)

  useEffect(() => {
    // fetchx(API_URL2 + '/getRateCode?hotelID=1')
    //   .then(result => result.json())
    //   .then(rowData => setRowData(rowData['data']))

      fetchx(API_URL2 +"/getPackage?hotelID=1")
      .then((result) => result.json())

      .then((rowData) =>
      setTransactionCodeData(rowData["data"][0]['id']));
      
  }, []);

  console.log(TransactionCodeData) 
 
 
  const beginSellDate = watch('beginSellDate');
  // console.log(beginSellDate)
 const today = Moment().format('YYYY-MM-DD');
 const options = {
   minDate: today
 };
 const optionsToDate = {
   minDate: (Moment(String(new Date(beginSellDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
 };
   console.log(optionsToDate)

  const onSubmit = (data) => {
    console.log(data)
    setData(data);
    // if (data.firstName !== null && data.name !== null) {
      let createmarketGroup = JSON.stringify({
        "packageCode": data.packageCode,
        "description": data.description,
        // "beginSellDate":data.beginSellDate,
        // "endSellDate":data.endSellDate, 
        "beginSellDate": (Moment(String(new Date(data.beginSellDate))).format('YYYY-MM-DD')),
        "endSellDate": (Moment(String(new Date(data.endSellDate))).format('YYYY-MM-DD')),
        "basePrice": data.basePrice,
        "taxAmount":data.taxAmount,
        totalAmount: totalAmount,
        groupCode:data.groupCode.value,                                                      
        hotelID:data1.hotelID,
        id:data1.id
     })
     console.log(createmarketGroup)
      let columnsToUpdate = createmarketGroup
      let res = fetchx(API_URL2 + `/updatepackage?id=${data1.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: columnsToUpdate,
        }
      )
        .then((result) => result.json())
        .then((resp) => {
          console.log(resp)
                localStorage.setItem("id", data1["id"]);
                 if(resp['statusCode']==200){
            const swalInstance = MySwal.fire({
             text: 'Package Details Updated Successfully!',
             icon: 'success',
             buttonsStyling: false,
             confirmButtonText: 'Close',
             customClass: {
               confirmButton: 'btn btn-danger'
             }
         });
         swalInstance.then((result) => {
           if (result.isConfirmed) {      
             navigate('');
           }
         }); 
        
         }
         else{
            const swalInstance = MySwal.fire({
                text: 'Package Details Not Updated!',
                icon: 'success',
                buttonsStyling: false,
                confirmButtonText: 'Close',
                customClass: {
                  confirmButton: 'btn btn-danger'
                }
            });
            swalInstance.then((result) => {
              if (result.isConfirmed) {      
                navigate('');
              }
            });  
         }
    
        })
        .catch((error) => {
         //console.log(error);
        });
        //  }
  };


  return (
    <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Row>            
              <Col md='4' sm='12'>
                 <div className='mb-1'>
                   <Label className='form-label' for='packageCode'>
                     Package Code
                   </Label>
                   <InputGroup className='input-group-merge'>
                     
                     <Controller
                       id='packageCode'
                       name='packageCode'
                       control={control}
                       placeholder='packageCode'
                       render={({ field }) => 
                         <Input placeholder='packageCode'
                         defaultValue={data1.packageCode}

                         // pattern="[a-zA-Z ]*" title="Type Only Alphabets" 
                         required 
                          {...field} />}
                     />
                   </InputGroup>
                 </div>
               </Col>  

               <Col md='4' sm='12'>
                 <div className='mb-1'>
                   <Label className='form-label' for='description'>
                     Description
                   </Label>
                   <InputGroup className='input-group-merge'>
                     
                     <Controller
                       id='description'
                       name='description'
                       control={control}
                       placeholder='description'
                       render={({ field }) => 
                         <Input placeholder='description'
                         defaultValue={data1.description}

                         // pattern="[a-zA-Z ]*" title="Type Only Alphabets" 
                         required 
                          {...field} />}
                     />
                   </InputGroup>
                 </div>
               </Col>  

               {/* <Col md='4' sm='12'>
                 <div className='mb-1'>
                   <Label className='form-label' for='beginSellDate'>
                     Begin Sell Date
                   </Label>
                   <InputGroup className='input-group-merge'>
                     
                     <Controller
                       id='beginSellDate'
                       name='beginSellDate'
                       control={control}
                       placeholder='beginSellDate'
                       render={({ field }) => 
                         <Input placeholder='beginSellDate'
                         defaultValue={data1.beginSellDate}
                         

                         // pattern="[a-zA-Z ]*" title="Type Only Alphabets" 
                         required 
                          {...field} />}
                     />
                   </InputGroup>
                 </div>
               </Col>   */}

<Col md='4' sm='12'>
  <div className='mb-1'>
    <Label className='form-label' for='beginSellDate'>
      Begin Sell Date
    </Label>
    <InputGroup className='input-group-merge'>
      <Controller
        id='beginSellDate'
        name='beginSellDate'
        control={control}
        defaultValue={data1.beginSellDate}
        render={({ field }) => (
          <Flatpickr
            {...field}
            required
            options={optionsToDate}
            placeholder="YYYY-MM-DD"
            className={classnames('form-control', {
              'is-invalid': data !== null && data.beginSellDate === null
            })}
          />
        )}
      />
    </InputGroup>
  </div>
</Col>
{/* 
               <Col md='4' sm='12'>
                 <div className='mb-1'>
                   <Label className='form-label' for='endSellDate'>
                     End Sell Date
                   </Label>
                   <InputGroup className='input-group-merge'>
                     
                     <Controller
                       id='endSellDate'
                       name='endSellDate'
                       control={control}
                       placeholder='endSellDate'
                       render={({ field }) => 
                         <Input placeholder='endSellDate'
                         defaultValue={data1.endSellDate}

                         // pattern="[a-zA-Z ]*" title="Type Only Alphabets" 
                         required 
                          {...field} />}
                     />
                   </InputGroup>
                 </div>
               </Col>   */}

<Col md='4' sm='12'>
  <div className='mb-1'>
    <Label className='form-label' for='endSellDate'>
      End Sell Date
    </Label>
    <InputGroup className='input-group-merge'>
      <Controller
        id='endSellDate'
        name='endSellDate'
        control={control}
        defaultValue={data1.endSellDate}
        render={({ field }) => (
          <Flatpickr
            {...field}
            required
            options={optionsToDate}
            placeholder="YYYY-MM-DD"
            className={classnames('form-control', {
              'is-invalid': data !== null && data.endSellDate === null
            })}
          />
        )}
      />
    </InputGroup>
  </div>
</Col>


               {/* <Col md='4' sm='12'>
                 <div className='mb-1'>
                   <Label className='form-label' for='basePrice'>
                     Base Price
                   </Label>
                   <InputGroup className='input-group-merge'>
                     
                     <Controller
                       id='basePrice'
                       name='basePrice'
                       control={control}
                       placeholder='basePrice'
                       render={({ field }) => 
                         <Input placeholder='basePrice'
                         defaultValue={data1.basePrice}

                         // pattern="[a-zA-Z ]*" title="Type Only Alphabets" 
                         required 
                          {...field} />}
                     />
                   </InputGroup>
                 </div>
               </Col>  

               <Col md='4' sm='12'>
                 <div className='mb-1'>
                   <Label className='form-label' for='totalAmount'>
                     Total Amount
                   </Label>
                   <InputGroup className='input-group-merge'>
                     
                     <Controller
                       id='totalAmount'
                       name='totalAmount'
                       control={control}
                       placeholder='totalAmount'
                       render={({ field }) => 
                         <Input placeholder='totalAmount'
                         defaultValue={data1.totalAmount}

                         // pattern="[a-zA-Z ]*" title="Type Only Alphabets" 
                         required 
                          {...field} />}
                     />
                   </InputGroup>
                 </div>
               </Col>   */}

<Col md="3" sm="12">
        <div className="mb-1">
          <Label className="form-label" htmlFor="basePrice">
            Base Price <span style={{ color: 'red' }}>*</span>
          </Label>
          <Controller
            defaultValue={data1.basePrice}
            control={control}
            id="basePrice"
            name="basePrice"
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Base Price"

                // pattern="[0-9]{1,15}"
                // title="Base Price can contain numbers. It cannot contain alphabets and special characters."
                required
                invalid={errors.basePrice && true}
                {...field}
                onChange={(e) => {
                  // Capture the value and call the handler function
                  const value = e.target.value;
                  field.onChange(value);
                  handleBasePriceChange(value);
                }}
              />
            )}
          />
        </div>
      </Col>
                <Col md="3" sm="12">
                  <div className="mb-1">
                    <Label className="form-label" for="taxAmount">
                      Tax Percentage <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1.taxAmount}
                      control={control}
                      id="taxAmount"
                      name="taxAmount"
                      render={({ field }) => (
                     
                        <Input
                        type="text"
                        placeholder="Tax Amount"
                        // pattern="[0-9]{1,15}"
                        // title="Tax Amount can contain numbers. It cannot contain alphabets and special characters."
                        required
                        invalid={errors.taxAmount && true}
                        {...field}
                        onChange={(e) => {
                          // Capture the value and call the handler function
                          const value = e.target.value;
                          field.onChange(value);
                          handleTaxPercentageChange(value);
                        }}
                      />
                      )}
                    />
                  </div>
                </Col>

               { totalAmount && reload && 
               <Col md="3" sm="12">
                  <div className="mb-1">
                  <Label className="form-label" for="totalAmount">
                  total <spam style={{color:'red'}}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id="totalAmount"
                    name="totalAmount"
                    render={({ field }) => (
                      <Input
                      defaultValue={totalAmount}
                      required
                        placeholder="totalAmount"
                        invalid={errors.names && true}
                        {...field}
                      />
                    )}
                  />
                </div>
                </Col> 
                       }
                 { console.log(totalAmount)}  

               {/* <Col md='4' sm='12'>
                 <div className='mb-1'>
                   <Label className='form-label' for='groupCode'>
                     Group
                   </Label>
                   <InputGroup className='input-group-merge'>
                     
                     <Controller
                       id='groupCode'
                       name='groupCode'
                       control={control}
                       placeholder='groupCode'
                       render={({ field }) => 
                         <Input placeholder='groupCode'
                         defaultValue={data1.groupCode}

                         // pattern="[a-zA-Z ]*" title="Type Only Alphabets" 
                         required 
                          {...field} />}
                     />
                   </InputGroup>
                 </div>
               </Col>   */}

<Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="groupCode">
                  Group  </Label>
                  <Controller
                    id="groupCode"
                    control={control}
                    name="groupCode"
                    render={({ field }) => (
                      <Select
                        defaultValue={defaultReason4}
                        isClearable
                        options={groupID}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select", {
                          // "is-invalid": data !== null && data.marketGroupID1 === null,
                        })}
                        {...field}
                        // onChange={handleChange4}
                      />
                    )}
                  />
                </div>
              </Col>


              </Row>
            </div>

                          <br/>
           <div align='end' className='buttons'>
            <Button className="me-1" color="primary" type='submit' onClick={()=>setflag(true)}>
           Update And Exit
           </Button>
                    </div>           

          </Form>
    </div>
  )
}

export default editBlock;