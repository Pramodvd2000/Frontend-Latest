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
const MySwal = withReactContent(Swal)

  const defaultValues = { 
    block: ''
  }
   const editBlock = ({data1}) => {
    console.log(data1)
       
    const {setError,formState: { errors }} = useForm()
    const [rowData, setRowData] = useState();
    const [data, setData] = useState(null)
    const { reset, handleSubmit, control } = useForm({ defaultValues })
    let navigate = useNavigate();  
    const [flag,setflag] = useState(false)  
    const [reload, setreload] = useState(true)

      const [TransactionCodeData,setTransactionCodeData] = useState([])


  useEffect(() => {
    fetchx(API_URL2+ '/getbooker?hotelID=1')
      .then(result => result.json())
      .then(rowData => setRowData(rowData['data']))

      // fetchx(API_URL2+"/getAccomadationTransactionCode?hotelID=1")
      // .then((result) => result.json())
      // .then((rowData) => setTransactionCodeData(rowData["data"][0]['id']));
  }, []);


  const onSubmit = (data) => {
    console.log(data)
    setData(data);
    if (data.firstName !== null && data.name !== null) {
      let createmarketGroup = JSON.stringify({
        // id: data1.id,
        "name": data.name1,
        "emailID": data.emailID1,
        "phone": data.phone1,
        "addressLine1": data.addressLine11,
        "addressLine2": data.addressLine21,
        "country": data.country1,
        "state": data.state1,
        "city": data.city1,
        "postalCode": data.postalCode1,

          }); 
      let columnsToUpdate = createmarketGroup
      let res = fetchx(API_URL2+ `/updateebooker?id=${data1.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: columnsToUpdate,
        }
      )
        .then((result) => result.json())
        .then((resp) => {
                localStorage.setItem("id", data1["id"]);
                 if(resp['statusCode']==200){
            const swalInstance = MySwal.fire({
             text: 'Booker Details Updated Successfully!',
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
                text: 'Booker Details Not Updated!',
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
         }
  };
 

  return (
    <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Row>            
              
           


                         <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='name1'>
                    Name <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["name"]}
                      control={control}
                      id='name1'
                      name='name1'
                      render={({ field }) => <Input 
                      placeholder='name' 
                        invalid={errors.name1 && true} {...
                        field} />}
                    />
                  </div>
                </Col>     

          <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='emailID1'>
                    EmailID <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["emailID"]}
                      control={control}
                      id='emailID1'
                      name='emailID1'
                      render={({ field }) => <Input 
                      placeholder='emailID' 
                        invalid={errors.emailID1 && true} {...
                        field} />}
                    />
                  </div>
                </Col>     

          <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='phone1'>
                    Phone <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["phone"]}
                      control={control}
                      id='phone1'
                      name='phone1'
                      render={({ field }) => <Input 
                      placeholder='phone1' 
                        invalid={errors.phone1 && true} {...
                        field} />}
                    />
                  </div>
                </Col>     

          <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='addressLine11'>
                    AddressLine1 <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["addressLine1"]}
                      control={control}
                      id='addressLine11'
                      name='addressLine11'
                      render={({ field }) => <Input 
                      placeholder='addressLine1' 
                        invalid={errors.addressLine11 && true} {...
                        field} />}
                    />
                  </div>
                </Col>     

          <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='addressLine21'>
                    AddressLine2 <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["addressLine2"]}
                      control={control}
                      id='addressLine21'
                      name='addressLine21'
                      render={({ field }) => <Input 
                      placeholder='addressLine2' 
                        invalid={errors.addressLine21 && true} {...
                        field} />}
                    />
                  </div>
                </Col>     

          <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='country1'>
                    Country <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["country"]}
                      control={control}
                      id='country1'
                      name='country1'
                      render={({ field }) => <Input 
                      placeholder='country' 
                        invalid={errors.country1 && true} {...
                        field} />}
                    />
                  </div>
                </Col>     

          <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='state1'>
                    State <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["state"]}
                      control={control}
                      id='state1'
                      name='state1'
                      render={({ field }) => <Input 
                      placeholder='state' 
                        invalid={errors.state1 && true} {...
                        field} />}
                    />
                  </div>
                </Col>     

          <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='city1'>
                    City <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["city"]}
                      control={control}
                      id='city1'
                      name='city1'
                      render={({ field }) => <Input 
                      placeholder='city' 
                        invalid={errors.city1 && true} {...
                        field} />}
                    />
                  </div>
                </Col>     

          <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='postalCode1'>
                    PostalCode <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["postalCode"]}
                      control={control}
                      id='postalCode1'
                      name='postalCode1'
                      render={({ field }) => <Input 
                      placeholder='postalCode' 
                        invalid={errors.postalCode1 && true} {...
                        field} />}
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