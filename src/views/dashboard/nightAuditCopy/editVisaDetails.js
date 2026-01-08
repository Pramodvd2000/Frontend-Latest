import { useState } from 'react'
import classnames from 'classnames'
import Cleave from 'cleave.js/react'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import {Form, Row, Col, Label, Button, Input, InputGroup,} from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import {useRef, useEffect} from 'react';
import API_URL from '../../../config'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const defaultValues = { 
  reservation: '',
  visaNumber: '',
  guestProfileID: '',
  issueDate: null,
  expiryDate: null,
  attachment:'',
}

const VisaDetails = (data1) => {
  console.log(data1.data1)
   // ** State
   const [data, setData] = useState(null)
   // ** Hooks
   const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
   const beginDate = watch('beginDate');
   console.log(beginDate)
  const today = Moment().format('YYYY-MM-DD');
  const options = {maxDate: today };
   const options1 = {  minDate: today}; 
   let navigate = useNavigate();
 
   const [idDetail, setIDDetails] = useState();
  // AG Grid
  const [rowData, setRowData] = useState();
  const [visaDetails, setVisaDetails] = useState();
  const gridRef = useRef();
  const [details,setDetails] = useState('')

   useEffect(() => {
     fetchx(API_URL + `/getGuestVisaDetails?hotelID=1&guestProfileID=${data1.data1.guestID}`)
       .then((result) => result.json())
       .then((rowData) => 
       setVisaDetails(rowData["data"][0]));
   }, []);
   console.log(visaDetails)

  //  useEffect(() => {
  //   if (visaDetails) {
  //     console.log(Array.isArray(visaDetails) ? visaDetails.length : 0);
  //   } else {
  //     console.log('visaDetails is not set yet.');
  //   }
  // }, [visaDetails]);
  useEffect(() => {
    fetchx(API_URL + "/getReservationGuestDetails", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelID:'1',
            reservationID:data1.data1.id,
            })
        }).then(result => result.json())
        .then(rowData => {
          //  console.log(rowData['data'])
            setDetails(rowData['data'][0])                 
          }).catch((error) => {
            console.log(error)
          })
    }, [])
    console.log(details)
 
  // const onSubmit = (data) => {
  //   setData(data)
  //   console.log("*************************")
  //   console.log(data)
  //   if ( data.reservation!== null && data.visaNumber!== null && data.guestProfileID!== null&& data.issueDate !== null & data.expiryDate !== null) {
  //     let createmarketGroup = JSON.stringify({        
  //         "reservationID"   : data1.data1.id,
  //         "visaNumber" : data.visaNumber1,
  //         "guestProfileID":data1.data1.guestID,
  //         "issueDate" : (Moment(String(new Date(data.beginDate1[0]))).format('YYYY-MM-DD')),
  //         "ExpiryDate" : (Moment(String(new Date(data.endDate1[0]))).format('YYYY-MM-DD')),
  //         // attachment: file.pdf
  //     })
  //     console.log(createmarketGroup)
  //     let res = fetchx(API_URL + `/updateVisaDetails`, {
  //       method: "PUT",
  //       headers: { 'Content-Type': 'application/json' },
  //       body: createmarketGroup
  //     }).then(result => result.json())
  //     .then((res) => {
  //       console.log(res);
  //       // navigate('') 
  //       if(res['statusCode'] == 200){
  //         const swalInstance = MySwal.fire({
  //           text: res.message,
  //           icon: 'success',
  //           buttonsStyling: false,
  //           confirmButtonText: 'Close',
  //           allowOutsideClick: false,
  //           customClass: {
  //             confirmButton: 'btn btn-danger'
  //           }
  //         });
  //         swalInstance.then((result) => {
  //           if (result.isConfirmed) {
  //             fetchx(API_URL + `/getGuestVisaDetails?hotelID=1&guestProfileID=${data1.data1.guestID}`)
  //         .then(result => result.json())
  //         .then(rowData => {setRowData(rowData['data'])
  //         console.log(rowData['data'])
  
  //       })
  //           }
  //         });
          
  //       }
  //       if(res['statusCode'] == 403){

       
  //         const swalInstance = MySwal.fire({
  //         text: res.message,
  //         icon: 'error',
  //         buttonsStyling: false,
  //         confirmButtonText: 'Close',
  //         allowOutsideClick: false,
  //         customClass: {
  //           confirmButton: 'btn btn-danger'
  //         }
  //       });
  //       swalInstance.then((result) => {
  //         if (result.isConfirmed) {
  //           setIDDetails(false)
  //         }
  //       });
  //     }
  //     });
   
  //   }
  // }


  const onSubmit = data => { 
    console.log(data)
    setData(data)
    if ( data.reservation!== null) {
      let createmarketGroup = JSON.stringify({                
        "reservationID"   : data1.data1.id,
        "visaNumber" : data.visaNumber1,
        "guestProfileID":data1.data1.guestID,
        "issueDate" : (Moment(String(new Date(data.beginDate1[0]))).format('YYYY-MM-DD')),
        "ExpiryDate" : (Moment(String(new Date(data.endDate1[0]))).format('YYYY-MM-DD')),
          // attachment: file.pdf
      })
      console.log(createmarketGroup)
      let res = fetchx(API_URL +`/updateVisaDetails`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(result => result.json())
      .then((res) => {
        console.log(res);
        // navigate('') 
        if(res['statusCode'] == 200){
          const swalInstance = MySwal.fire({
            text: "Visa Details Updated Successfully",
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
              fetchx(API_URL + `/getGuestVisaDetails?hotelID=1&guestProfileID=${data1.data1.guestID}`)
          .then(result => result.json())
          .then(rowData => {setRowData(rowData['data'])
          console.log(rowData['data'])
          navigate('');
        })
        // setIDDetails(false)
            }
          });
          
        }
      //   if(res['statusCode'] == 403){       
      //     const swalInstance = MySwal.fire({
      //     text: res.message,
      //     icon: 'error',
      //     buttonsStyling: false,
      //     confirmButtonText: 'Close',
      //     allowOutsideClick: false,
      //     customClass: {
      //       confirmButton: 'btn btn-danger'
      //     }
      //   });
      //   swalInstance.then((result) => {
      //     if (result.isConfirmed) {
      //       // setIDDetails(false)
      //     }
      //   });
      // }
      });
     
    }
  }


  const handleReset = () => {
    reset({
     
      reservation: '',
      visaNumber: '',
      guestProfileID: '',
      issueDate: null,
      expiryDate: null,
      attachment:''
    })
  }

  return (
     <div> 
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>  
                { console.log(visaDetails)}
                        

              {visaDetails && <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="visaNumber1">
                  Visa Number <spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    defaultValue={visaDetails.visaNumber}
                    control={control}
                    id="visaNumber1"
                    name="visaNumber1"
                    render={({ field }) => (
                      <Input
                        required
                        placeholder="Visa Number"
                        // invalid={errors.visaNumber1 && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>}

              {visaDetails && 
              <Col md="3" sm="12">
              <div className="mb-1">
                <Label className="form-label" for="beginDate1">
                  Issue Date
                </Label>
                <Controller
                  defaultValue={visaDetails.issueDate}
                  control={control}
                  id="beginDate1"
                  name="beginDate1"
                  render={({ field }) => (
                    <Flatpickr
                      {...field}
                      options={options}
                      placeholder="YYYY-MM-DD "
                      className={classnames("form-control", {
                        // 'is-invalid': data !== null && data.beginDate1 === null
                      })}
                    />
                  )}
                />
              </div>
            </Col>
              
              }
              
             
             { visaDetails && <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="endDate1">
                  Expiry Date
                  </Label>
                  <Controller
                    defaultValue={visaDetails.ExpiryDate}
                    control={control}
                    id="endDate1"
                    name="endDate1"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        options={options1}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                          // 'is-invalid': data !== null && data.beginDate1 === null
                        })}
                      />
                    )}
                  />
                </div>
              </Col>}
              {/* <Col md='4' sm='12' className='mb-1'>
                  <div className='mb-1'>
                      <Label className='form-label' for='attachment'>
                          Upload File
                      </Label>
                      <InputGroup className="input-group-merge">
                          <Controller
                              defaultValue=''
                              control={control}
                              id='attachment'
                              name='attachment'
                              placeholder='Add Attachment'
                              render={({ field }) => <Input type='file'  className={classnames({
                                  // "is-invalid": data !== null && (data.attachment === null || !data.attachment.length)
                              })} {...field} />}
                          />
                      </InputGroup>
                  </div>
              </Col> */}
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
      </div>
        )
}
export default VisaDetails