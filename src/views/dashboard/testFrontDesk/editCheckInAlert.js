import { useState } from 'react'
import Select from 'react-select' 
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import API_URL from '../../../config'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const defaultValues = {
    alertCode: null,
    reservationAlert:'',
  
}

// let alertCode = [
//     fetchx(API_URL + '/getAlertCodesKey')
//       .then(result => result.json())
//       .then(resp => {
//         // //console.log(resp['data'])
//         alertCode = resp['data']
//         //console.log(alertCode)
//       })
//     ]



const EditCheckInAlert = (data1) => {
  const { setError, formState: { errors }} = useForm()
  const [rowData, setRowData] = useState();
  const gridRef = useRef();  
  const [result, setResult] = useState();
  const [data, setData] = useState(null)
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  const [value, setValue] = useState('')
  let navigate = useNavigate();  

  useEffect(() => {
      fetchx(API_URL + `/getCheckInAlerts?reservationID=${data1.data1.id}`)
        .then((result) => result.json())
        .then((resp) => {
         setResult(resp['data'][0]['checkInAlert']);
        });
    // }
  }, [data1.data1.id]); 
 
  const onSubmit = data => {
    setData(data)
    // if ( data.checkInAlert !== null) {
      let createmarketGroup = JSON.stringify({
        "reservationID": data1.data1.id,
        "sharingID":data1.data1.sharingID,
        "alertCode" : null, 
        "checkInAlert": data.description,
             })
      let res = fetchx(API_URL+ `/updateCheckInAlert` , {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then((res) => {
        if(res['status']==200){
          const swalInstance = MySwal.fire({
            text: 'CheckIn Alert edited Successfully!',
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
        
      });
     
  // }
  }

  const handleReset = () => {
    reset({     
      alertCode: null,
      reservationAlert:'',
    })
  }


  return (
    <div>
  

    <div>     
        <Card>
      <CardHeader>
        <CardTitle tag='h4'>Edit CheckIn Alerts</CardTitle>
      </CardHeader>
      <CardBody>
      <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>          
                  {/* <Col md='6' sm='12'>
                    <div className='mb-1'>
                      <Label className='form-label' for='alertCode'>
                      Alert Code <spam style={{color:'red'}}>*</spam>
                      </Label>
                      <Controller
                    id="alertCode"
                    control={control}
                    name="alertCode"
                    render={({ field }) => (
                      <Select
                        isClearable
                        options={alertCode}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select", {
                          "is-invalid": data !== null && data.alertCode === null,
                        })}
                        {...field}
                        
                      />
                    )}
                  />
                    </div>
                  </Col> */}
                  <Col md='6' sm='12'>
                      <div className='mb-1'>
                        <Label className='form-label' for='description'>
                          Description 
                        </Label>
                        <Controller
                          defaultValue={result}
                          control={control}
                          id='description'
                          name='description'
                          render={({ field }) => <Input placeholder='description'                     
                            invalid={errors.description && true} {...field} />}
                        />
                      </div>
                    </Col>
      
                  
                  <div className='d-flex'>
                    <Button className='me-1' color='primary' type='submit'>
                      Submit
                    </Button>
                    <Button outline color='secondary' type='reset' onClick={handleReset}>
                      Reset
                    </Button>
                  </div>
                </Row>
              </Form>
      </CardBody>
    </Card>

</div>   
    </div>
  )
}

export default EditCheckInAlert;
