// ** React Imports
import { useState } from 'react'
// ** Third Party Components
import Select from 'react-select'
import classnames from 'classnames'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
// ** Utils
import { selectThemeColors } from '@utils'
// ** Reactstrap Imports
import { Input, Card, Form, Row, Col, Label, Button, CardBody,  InputGroup, } from 'reactstrap'
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
import API_URL from "../../../config";
import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
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

const Floor = ({ stepper, type }) => {
    // Ag Grid
    const [rowData, setRowData] = useState();
  
    useEffect(() => {
        fetchx(API_URL +"/getCompleteAccountDetails?hotelID=1")
            .then(result => result.json())
            .then(rowData => setRowData(rowData['data']))
    }, []);

    const {setError,formState: { errors } } = useForm()
    let companyInfoJSON = localStorage.getItem('companyData');
    let companyInfo = JSON.parse(companyInfoJSON);

console.log(companyInfo);

if (companyInfo) {
    console.log(companyInfo.accountName);
}

    // ** State
    const [data, setData] = useState(null)

    // ** Hooks
    const { reset, handleSubmit, control } = useForm({ defaultValues })
    let navigate = useNavigate();  
   
const [flag,setflag] = useState(false)

const onSubmit = data => {
    console.log("flag",flag)
    let companyInfoJSON = localStorage.getItem('companyData');
    let companyInfo = companyInfoJSON ? JSON.parse(companyInfoJSON) : null;

    console.log(data);

    if (
        data.maskedCVVCVC !== null &&
        data.expiryDate !== null
    ) {
        console.log(data);

        let createmarketGroup = {};

        if (companyInfo) {
            createmarketGroup = {
                "accountName": companyInfo.accountName,
                "addressLine1": companyInfo.addressLine1,
                "accountType": companyInfo.accountType,
                "commision": companyInfo.commision,
                "accountManagerID": companyInfo.accountManagerID,
                "email": companyInfo.email,
                "addressLine2": companyInfo.addressLine2,
                "gstID": companyInfo.gstID,
                "financialAssociateID": companyInfo.financialAssociateID,
                "secondaryEmail": companyInfo.secondaryEmail,
                "country": companyInfo.country,
                "isActive": companyInfo.isActive,
                "notes": companyInfo.notes,
                "phoneNumber": companyInfo.phoneNumber,
                "state": companyInfo.state,
                "IATA": companyInfo.IATA,
                "postalCode": companyInfo.postalCode,
                "city": companyInfo.city,
            };
        }

        createmarketGroup = {
            ...createmarketGroup,
            "isBtcApproved": data.isBtcApproved.value,
            "creditLimit": data.creditLimit,
            "tenure": data.tenure,
            "attachment": data.idFile
        };

        console.log(createmarketGroup);

        // Send the data to the server using fetch
        fetchx(API_URL + "/addAccounts", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createmarketGroup)
        })
        .then(result => result.json())
        .then(resp => {
            localStorage.setItem("companyData", JSON.stringify(resp["data"]));
            console.log(resp);
            // const swalInstance = MySwal.fire({
            //     text: 'Company Added Successfully!',
            //     icon: 'success',
            //     buttonsStyling: false,
            //     confirmButtonText: 'Close',
            //     customClass: {
            //         confirmButton: 'btn btn-danger'
            //     }
            // });
            // swalInstance.then((result) => {
            //     if (result.isConfirmed) {
            //         navigate('');
            //     }
            // }); 
            console.log(flag==true)
            console.log(flag)
            console.log(flag==false)
           if(flag==true){
             const swalInstance = MySwal.fire({
               text: 'Company Details Added Successfully!',
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
              text: 'Company Details Added Successfully! Please add Booker Details',
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
                stepper.next(); 
              }
            }); 
          //  stepper.next(); 
           console.log('Save and next after form submit')
          }
        })
        .catch((error) => {
            console.log(error);
        });
    }
};

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
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                        <Col md='4' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="isBtcApproved">
                    BTC Approved
                  </Label>
                  <Controller
                    id="isBtcApproved"
                    control={control}
                    name="isBtcApproved"
                    render={({ field }) => (
                      <Select
                        required
                        isClearable
                        options={btcApproved}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select", {
                          "is-invalid": data !== null && data.isBtcApproved === null,
                        })}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>
                            <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="creditLimit">
                                        Credit Limit
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='creditLimit'
                                        name='creditLimit'
                                        render={({ field }) => <Input placeholder='Credit Limit' invalid={errors.creditLimit && true} {...field} />}
                                    />
                                </div>
                            </Col>
                            <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='tenure'>
                                    Tenure(In Days)
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='tenure'
                                        name='tenure'
                                        render={({ field }) => <Input placeholder='Masked Card Number' invalid={errors.tenure && true} {...field} />}
                                    />
                                </div>
                            </Col>
                            <Col md='4' sm='12' className='mb-1'>
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
                                            "is-invalid": data !== null && (data.idFile === null || !data.idFile.length)
                                        })} {...field} />}
                                    />
                                </InputGroup>
                            </div>
                        </Col>
                          
                        </Row>
                        <div className='d-flex justify-content-between'>
                        <div className='d-flex'>
                        <Button className='me-1' color='primary' type='submit' onClick={()=>setflag(false)}>
                        Save And Next
                        </Button>
                        <Button className="me-1" color="primary" type='submit' onClick={()=>setflag(true)}>
                          Create Company
                        </Button>
                        <Button outline color='secondary' type='reset' onClick={handleReset}>
                        Reset
                        </Button>
                        </div> 
                    </div>
                    </Form>  
        </div>
    )
}
export default Floor;