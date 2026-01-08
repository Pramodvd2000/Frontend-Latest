
import { useState } from 'react'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import { Input, Card, Form, Row, Col, Label, Button } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
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
    const [data, setData] = useState(null)
    const { reset, handleSubmit, control } = useForm({ defaultValues })
    let navigate = useNavigate();  
    const [flag,setflag] = useState(false)  
    
  const onSubmit = (data) => {
    setData(data);
      let createmarketGroup = JSON.stringify({
        "id": data1.id,
        "preferenceGroup": data.prefernceGroup1,
        "description":  data.description1,
     
          }); 
      let columnsToUpdate = createmarketGroup
      let res = fetchx(API_URL2 + `/updateGuestPreferernceGroup?id=${data1.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: columnsToUpdate,
        }
      )
        .then((result) => result.json())
        .then((resp) => {
                 if(resp['statusCode']==200){
            const swalInstance = MySwal.fire({
             text: 'Preference Group Details Updated Successfully!',
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
                text: 'Preference Group Details Not Updated!',
                icon: 'error',
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
        
  };
 
  return (
    <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Row>            
              
            <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="prefernceGroup1">
                  Preference Group <spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    defaultValue={data1["preferenceGroup"]}
                    control={control}
                    id="prefernceGroup1"
                    name="prefernceGroup1"
                    render={({ field }) => (
                      <Input
                        required
                        placeholder="Preference Group"
                        invalid={errors.prefernceGroup1 && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='description1'>
                      Description <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue={data1["description"]}
                      control={control}
                      id='description1'
                      name='description1'
                      render={({ field }) => <Input 
                      placeholder='Description' 
                        invalid={errors.description1 && true} {...
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