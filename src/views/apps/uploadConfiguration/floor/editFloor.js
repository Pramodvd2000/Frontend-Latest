
import { useState } from 'react'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import classnames from 'classnames'

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

  let blockID = [
    fetchx(API_URL2 + '/getfloorblockid?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        blockID = resp['data']
      })
    ]
    
   const editBlock = ({data1}) => {
       console.log(data1)
    const {setError,formState: { errors }} = useForm()
    const [data, setData] = useState(null)
    const { reset, handleSubmit, control } = useForm({ defaultValues })
    let navigate = useNavigate();  
    const [flag,setflag] = useState(false)  
   

      const defaultReason4 = {
        value: data1.blockID,
        label: data1.block,
      }; 
 
  const onSubmit = (data) => {
    setData(data);
      let createmarketGroup = JSON.stringify({
        // id: data1.id,
        "floor": data.floor1,
        "blockID": (data.blockID1 === undefined)
        ? data1.blockID
        : (data.blockID1 === null)
          ? null
          : data.blockID1.value,
          }); 
          
      let columnsToUpdate = createmarketGroup
      let res = fetchx(API_URL2 + `/updateFloor?id=${data1.id}`,
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
             text: 'Floor Details Updated Successfully!',
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
                text: 'Floor Details Not Updated!',
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
  };
 

  return (
    <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Row>            
              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="floor1">
                 Floor <spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    defaultValue={data1["floor"]}
                    control={control}
                    id="floor1"
                    name="floor1"
                    render={({ field }) => (
                      <Input
                        pattern='[0-9]{1,15}'
                        title="Floor can contain numbers. It cannnot contain alphabets and special characters." 
                        placeholder="Floor"
                        invalid={errors.floor1 && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>
                          

                   <Col md='4' sm='12'>
              <div className='mb-1'>
                <Label className='form-label' for='blockID1'>
                Block <spam style={{color:'red'}}>*</spam>
                </Label>
                <Controller
                id="blockID1"
                control={control}
                name="blockID1"
                render={({ field }) => (
                <Select
                 defaultValue={defaultReason4}
                required
                  isClearable
                  options={blockID}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  className={classnames("react-select", {
                    "is-invalid": data !== null && data.blockID1 === null,
                  })}
                  {...field}
                  
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