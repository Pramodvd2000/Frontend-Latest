import { useState } from 'react'
import Select from 'react-select'
import classnames from 'classnames'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import { selectThemeColors } from '@utils'
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

import { useRef, useEffect, useMemo, useCallback } from 'react';
import API_URL from '../../../../../config'
import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
// import App from './datagrid'

const defaultValues = {
    isBtcApproved:null,
    creditLimit: '',
    tenure: '',
    attachment:'',

}


const btcApproved = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ];


const Floor = ({ stepper2, type, data1 }) => {
    const [selectedValue,  setSelectedValue] = useState('');
    const [reload, setreload] = useState(true)
  const [load, setload] = useState(true)

    // console.log(data1)
  //BTC Approved
  const handleChange = (selectedOption) => {
      setSelectedValue(selectedOption.value);
      console.log(selectedOption.value)
      console.log(localStorage.getItem('isBTCApproved'))
      localStorage.removeItem('isBTCApproved')
      localStorage.setItem('isBTCApproved', selectedOption.label);
      localStorage.setItem('isBTCApproved', selectedOption.value);
  
      console.log(localStorage.getItem('isBTCApproved'))
      console.log(localStorage.getItem('isBTCApproved'))
      setreload(false)
      setTimeout(()=>{setreload(true)},1)
    };

    const defaultReason = {
        value: data1 && data1.isBTCApproved,
        label: data1 && data1.isBTCApproved,    
      };
    // Ag Grid
    const [rowData, setRowData] = useState();


    // useEffect(() => {
    //     fetchx(API_URL + '/floor?hotelID=1&floor=1&blockID=1')
    //         .then(result => result.json())
    //         .then(rowData => setRowData(rowData['data']))
    // }, []);


    // ** Hooks
    const {
        setError,
        formState: { errors }
    } = useForm()



    // ** State
    const [data, setData] = useState(null)

    // ** Hooks
    const { reset, handleSubmit, control } = useForm({ defaultValues })

    let navigate = useNavigate();
    const [flag,setflag] = useState(false)
    const onSubmit = data => {
        console.log("flag",flag)

        setData(data)
        console.log(data)
        if (
            data.maskedCVVCVC !== null &&
            data.expiryDate !== null
        ) {
            console.log(data)
            let createmarketGroup = JSON.stringify({
                // "hotelID": data.hotelID,
                // "companyid": data1.companyid,
                "isBtcApproved": selectedValue === '' ? null :selectedValue,
                "creditLimit": data.creditLimit1,
                "tenure	": data.tenure1,
                "attachment": data.idFile,                
            })
            console.log(createmarketGroup)
            console.log("hi")
            let res = fetchx(API_URL + `/updataccounts?companyid=companyid=${ data1.companyid}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: createmarketGroup
            }).then((res) => {
                console.log(res);
                if (res['status'] == 200) {
                    fetchx(API_URL + '/getCompanyInformations?hotelID=1&companyid=${ReservationDetails.companyID}')
                        .then(result => result.json())
                        .then(rowData => {
                            setRowData(rowData['data'])
                            console.log(rowData['data'])
                            console.log(flag==true)
          console.log(flag)
          console.log(flag==false)
         if(flag==true){
            const swalInstance = MySwal.fire({
       text: 'Company BTC Details Edited Successfully!',
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
         //  navigate('');
          console.log('Save and exit after form submit')
         
         }
         else if(flag==false){
          const swalInstance = MySwal.fire({
            text: 'Company BTC Details Updated Successfully. Edit Booker Details!',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          });
          swalInstance.then((result) => {
            if (result.isConfirmed) {      
              stepper2.next(); 
            }
          }); 
        
         console.log('Save and next after form submit')
        }
                        })
                }

            });
            
        }
    }

    const handleReset = () => {
        reset({
            isBtcApproved:null,
            creditLimit: '',
            tenure: '',
            attachment:'',
        })
    }

    return (
        <div>
            <Card>               
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>                        
                          {data1 && <Col md="4" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="btcApproved">
                  BTC Approved
                  </Label>
                  <Controller
                    // defaultValue={defaultReason}
                    id="btcApproved"
                    control={control}
                    name="btcApproved"
                    render={({ field }) => (
                      <Select
                        isClearable
                        defaultValue={defaultReason}
                        options={btcApproved}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select", )}
                        {...field}
                        onChange={handleChange} 
                      />
                    )}
                  />
                </div>
              </Col> } 
                            { data1 &&<Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="creditLimit">
                                        Credit Limit
                                    </Label>
                                    <Controller
                                        defaultValue={data1["creditLimit"]}
                                        control={control}
                                        id='creditLimit1'
                                        name='creditLimit1'
                                        render={({ field }) => <Input placeholder='Credit Limit' invalid={errors.creditLimit1 && true} {...field} />}
                                    />
                                </div>
                            </Col>}
                             {data1 &&<Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='tenure1'>
                                    Tenure(In Days)
                                    </Label>
                                    <Controller
                                        defaultValue={data1["tenure"]}
                                        control={control}
                                        id='tenure1'
                                        name='tenure1'
                                        render={({ field }) => <Input placeholder='Masked Card Number' invalid={errors.tenure1 && true} {...field} />}
                                    />
                                </div>
                            </Col>}
                            {data1 &&<Col md='4' sm='12' className='mb-1'>
                            <div className='mb-1'>
                                <Label className='form-label' for='idFile'>
                                     Attachment
                                </Label>
                                <InputGroup className="input-group-merge">
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='idFile'
                                        name='idFile'
                                        placeholder='Add idFile'
                                        render={({ field }) => <Input type='file'  className={classnames({
                                            // "is-invalid": data !== null && (data.idFile === null || !data.idFile.length)
                                        })} {...field} />}
                                    />
                                </InputGroup>
                            </div>
                        </Col>}
                          
                        </Row>
                        <div className='d-flex justify-content-between'>
           <div className='d-flex'>
           {/* <Button className='me-1' color='primary' type='submit' onClick={()=>setflag(false)}>
           Save And Next
           </Button> */}
           <Button className="me-1" color="primary" type='submit' onClick={()=>setflag(true)}>
           Save And Exit
           </Button>
           <Button outline color='secondary' type='reset' onClick={handleReset}>
           Reset
           </Button>
           </div>           
            </div>

                    </Form>
                </CardBody>
            </Card>
           
        </div>
    )
}

export default Floor;
