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
import Flatpickr from 'react-flatpickr'
import classnames from "classnames";
import Moment from 'moment'


  const defaultValues = { 
    block: ''
  }
   const editBlock = ({data1}) => {
    console.log(data1)
       

  //        const frmdate = watch('frmdate');
  // const optionsToDate = {
  //   minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD'))
  // };

    const {setError,formState: { errors }} = useForm()
    const [rowData, setRowData] = useState();
    const [data, setData] = useState(null)
    const { reset, handleSubmit, control , watch} = useForm({ defaultValues })
    let navigate = useNavigate();  
    const [flag,setflag] = useState(false)  
    const [reload, setreload] = useState(true)

      const [TransactionCodeData,setTransactionCodeData] = useState([])


  useEffect(() => {
    fetchx(API_URL2 + '/getTax?hotelID=1')
      .then(result => result.json())
      .then(rowData => setRowData(rowData['data']))

      // fetchx(API_URL2 +"/getAccomadationTransactionCode?hotelID=1")
      // .then((result) => result.json())
      // .then((rowData) => setTransactionCodeData(rowData["data"][0]['id']));
  }, []);


  const onSubmit = (data) => {
    console.log(data)
    setData(data);
    if (data.firstName !== null && data.name !== null) {
      let createmarketGroup = JSON.stringify({
        // id: data1.id,
        "taxName": data.taxName1,
        "taxCode": data.taxCode1,
        "appliesFrom": Moment(String(new Date(data.appliesFrom))).format("YYYY-MM-DD"),
        "postingType": data.postingType1,
        "taxPercentage": data.taxPercentage1,
        "noOfSlabs": data.noOfSlabs1,
        "applyTaxOnRackRate": data.applyTaxOnRackRate1,
        "id":data1.id,
        "hotelID":data1.hotelID

          }); 
      console.log(createmarketGroup)
      let columnsToUpdate = createmarketGroup
      let res = fetchx(API_URL2 + `/updateTaxData?id=${data1.id}`,
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
             text: 'Tax Details Updated Successfully!',
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
                text: 'Tax Details Not Updated!',
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
                    <Label className='form-label' for='taxName1'>
                    Tax Name <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["taxName"]}
                      control={control}
                      id='taxName1'
                      name='taxName1'
                      render={({ field }) => <Input 
                      placeholder='taxName' 
                        invalid={errors.taxName1 && true} {...
                        field} />}
                    />
                  </div>
                </Col>     


                    <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='taxCode1'>
                    TaxCode <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["taxCode"]}
                      control={control}
                      id='taxCode1'
                      name='taxCode1'
                      render={({ field }) => <Input 
                      placeholder='taxCode1' 
                        invalid={errors.taxCode1 && true} {...
                        field} />}
                    />
                  </div>
                </Col>   


       

    <Col md="3" sm="12">
      <div className="mb-1">
        <Label className="form-label" for="appliesFrom">
          Applies From
        </Label>
        <Controller
          defaultValue={data1["appliesFrom"]}
          control={control}
          id="appliesFrom"
          name="appliesFrom"
          render={({ field }) => (
            <Flatpickr
              {...field}
              options={{ allowInput: true }}
              placeholder="YYYY-MM-DD"
              className={classnames("form-control", {
                // 'is-invalid': data !== null && data.dob === null
              })}
            />
          )}
        />
      </div>
    </Col>



                     <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='postingType1'>
                    Posting Type<spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["postingType"]}
                      control={control}
                      id='postingType1'
                      name='postingType1'
                      render={({ field }) => <Input 
                      placeholder='postingType' 
                        invalid={errors.postingType1 && true} {...
                        field} />}
                    />
                  </div>
                </Col> 


      
                            <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='taxPercentage1'>
                    Tax Percentage <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["taxPercentage"]}
                      control={control}
                      id='taxPercentage1'
                      name='taxPercentage1'
                      render={({ field }) => <Input 
                      placeholder='taxPercentage' 
                        invalid={errors.taxPercentage1 && true} {...
                        field} />}
                    />
                  </div>
                </Col> 



                            <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='noOfSlabs1'>
                    No Of Slabs <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["noOfSlabs"]}
                      control={control}
                      id='noOfSlabs1'
                      name='noOfSlabs1'
                      render={({ field }) => <Input 
                      placeholder='noOfSlabs' 
                        invalid={errors.noOfSlabs1 && true} {...
                        field} />}
                    />
                  </div>
                </Col> 






                            <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='applyTaxOnRackRate1'>
                    Apply Rack On Rate <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["applyTaxOnRackRate"]}
                      control={control}
                      id='applyTaxOnRackRate1'
                      name='applyTaxOnRackRate1'
                      render={({ field }) => <Input 
                      placeholder='applyTaxOnRackRate' 
                        invalid={errors.applyTaxOnRackRate1 && true} {...
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

        //      <Col md='3' sm='12'>
                //   <div className='mb-1'>
                //     <Label className='form-label' for='appliesFrom'>
                //     Applies From <spam style={{color:'red'}}>*</spam>
                //     </Label>
                //     <Controller
                //       defaultValue={data1["appliesFrom"]}
                //       control={control}
                //       id='appliesFrom'
                //       name='appliesFrom'
                //       render={({ field }) => <Input 
                //       placeholder='appliesFrom' 
                //         invalid={errors.appliesFrom && true} {...
                //         field} />}
                //     />
                //   </div>
                // </Col> 