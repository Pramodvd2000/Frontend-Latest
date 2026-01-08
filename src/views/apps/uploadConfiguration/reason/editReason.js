
import { useState } from 'react'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import classnames from "classnames";
import Cleave from "cleave.js/react";
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

  
  let reasonGroupID = [
    fetchx(API_URL2 + '/getForeignKeyReasonGroup?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        // console.log(resp['data'])
        reasonGroupID = resp['data']
        // console.log(reasonGroupID)
      })
  ]

   const editReason = ({data1}) => {
    console.log(data1)
       
    const {setError,formState: { errors }} = useForm()
    const [rowData, setRowData] = useState();
    const [data, setData] = useState(null)
    const { reset, handleSubmit, control } = useForm({ defaultValues })
    let navigate = useNavigate();  
    const [flag,setflag] = useState(false)  
  
  const defaultReason4 = {
    value: data1.reasonGroupID,
    label: data1.reasonGroup,
  }; 

  const onSubmit = (data) => {
    console.log(data)
    setData(data);
      let createmarketGroup = JSON.stringify({
        "id": data1.id,
        "reasonCode": data.reasonCode1,
        "description": data.description1,
        reasonGroupID: (data.reasonGroupID1 === undefined)
        ? data1.reasonGroupID
        : (data.reasonGroupID1 === null)
          ? null
          : data.reasonGroupID1.value,
          }); 
      let columnsToUpdate = createmarketGroup
      let res = fetchx(API_URL2 + `/updateReasonCode?id=${data1.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: columnsToUpdate,
        }
      )
        .then((result) => result.json())
        .then((resp) => {''
                 if(resp['statusCode']==200){
            const swalInstance = MySwal.fire({
             text: 'Reason Code Details Updated Successfully!',
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
                text: 'Reason Code Details Not Updated!',
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
                  <Label className="form-label" for="reasonCode1">
                  Reason Code <spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    defaultValue={data1["reasonCode"]}
                    control={control}
                    id="reasonCode1"
                    name="reasonCode1"
                    render={({ field }) => (
                      <Input
                        required
                        placeholder="Name"
                        invalid={errors.reasonCode1 && true}
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
          
            <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="reasonGroupID1">
                  Reason Group
                  </Label>
                  <Controller
                    id="reasonGroupID1"
                    control={control}
                    name="reasonGroupID1"
                    render={({ field }) => (
                      <Select
                        defaultValue={defaultReason4}
                        isClearable
                        options={reasonGroupID}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select", {
                          // "is-invalid": data !== null && data.reasonGroupID1 === null,
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

export default editReason;