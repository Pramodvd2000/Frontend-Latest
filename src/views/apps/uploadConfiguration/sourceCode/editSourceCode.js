
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

  
  let SourceGroupID = [
    fetchx(API_URL2 + '/getSourceGroupForSourceCode?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        SourceGroupID = resp['data']
      })
    ]
   const editBlock = ({data1}) => {
    console.log(data1)
       
    const {setError,formState: { errors }} = useForm()
    const [rowData, setRowData] = useState();
    const [data, setData] = useState(null)
    const { reset, handleSubmit, control } = useForm({ defaultValues })
    let navigate = useNavigate();  
    const [flag,setflag] = useState(false)  
  
  const defaultReason4 = {
    value: data1.sourceGroupID,
    label: data1.sourceGroup,
  }; 

  const onSubmit = (data) => {
    setData(data);
      let createmarketGroup = JSON.stringify({
        "id": data1.id,
        "sourceCode": data.sourceCode1,
        "description":  data.description1,
        sourceGroupID: (data.sourceGroupID1 === undefined)
        ? data1.sourceGroupID
        : (data.sourceGroupID1 === null)
          ? null
          : data.sourceGroupID1.value,
          }); 
      let columnsToUpdate = createmarketGroup
      let res = fetchx(API_URL2 + `/updateSourceCodes?id=${data1.id}`,
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
             text: 'source Code Details Updated Successfully!',
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
                text: 'source Code Details Not Updated!',
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
                  <Label className="form-label" for="sourceCode1">
                  Source Code <spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    defaultValue={data1["sourceCode"]}
                    control={control}
                    id="sourceCode1"
                    name="sourceCode1"
                    render={({ field }) => (
                      <Input
                        required
                        placeholder="Name"
                        invalid={errors.sourceCode1 && true}
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
                  <Label className="form-label" for="sourceGroupID1">
                  Source Group
                  </Label>
                  <Controller
                    id="sourceGroupID1"
                    control={control}
                    name="sourceGroupID1"
                    render={({ field }) => (
                      <Select
                        defaultValue={defaultReason4}
                        isClearable
                        options={SourceGroupID}
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