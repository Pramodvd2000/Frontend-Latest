// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import Select from 'react-select'
import toast from 'react-hot-toast'
import classnames from 'classnames'
import Cleave from 'cleave.js/react'
import { Check } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'

// ** Custom Components 
import Avatar from '@components/avatar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input, InputGroup, InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import {useRef, useEffect, useMemo, useCallback} from 'react';
const id = '1';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap'
import API_URL from '../../../config'
import { useNavigate } from 'react-router-dom';
// ** Third Party Components
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
  const [open, setOpen] = useState('')
  const toggle = id => {
    open === id ? setOpen() : setOpen(id)                
  }
  const [idDetail, setIDDetails] = useState();

  // AG Grid
  const [rowData, setRowData] = useState();

  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
    
    {headerName: 'Reservation',field: 'reservationID', suppressSizeToFit: true,editable: true, maxWidth: 160 },
    { headerName: 'Visa Number', field: 'visaNumber', suppressSizeToFit: true, editable: true, maxWidth: 160  },
    { headerName: 'Issue Date', field: 'issueDate', suppressSizeToFit: true,   editable: true, maxWidth: 160  },
    { headerName: 'Expiry Date', field: 'ExpiryDate', suppressSizeToFit: true, editable: true, maxWidth: 160  },
    {
      headerName: 'Action',
      field: 'numAvlRooms',
      suppressSizeToFit: true,
      maxWidth: 125,
      cellRendererFramework: (params) => <Button color='primary' onClick={() => actionButton1(params)}> Save </Button>
    }
  ]);

  const actionButton1 = (rowval) => {
    console.log(rowval)

    console.log(rowval.data)
    let createmarketGroup = JSON.stringify({
    //   "guestID": rowval.data['guestID'],
      "visaNumber": rowval.data['visaNumber'],
      "issueDate": (rowval.data['issueDate']),
      "ExpiryDate": (rowval.data['ExpiryDate']),
        })
    console.log(createmarketGroup)
      console.log(data1.data1)
    let res =    fetchx(API_URL + `/updateVisa?reservationID=${rowval.data.reservationID}`, {
        method: 'PUT',
        body: createmarketGroup,
        headers: {
          'Content-type': 'application/json'
        }
      }) .then((res) => res.json())
      .then((post) => {
        const swalInstance = MySwal.fire({
            text: 'Visa Details Updated Successfully!',
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
        console.log(post)
        // navigate('')  
      })
      .catch((err) => {
        console.log(err.message)
      })
  }


  const defaultColDef = useMemo( ()=> (
    {
      sortable: true, 
      filter: true,
      filterParams :{
        buttons : ['apply','reset']
      }
    }
  ));


  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);
  console.log(data1.data1.guestID)
  useEffect(() => {
    fetchx(API_URL + `/getGuestVisaDetails?hotelID=1&guestProfileID=${data1.data1.id}`)
      .then((result) => result.json())
      .then((rowData) => 
      setRowData(rowData["data"]));
  }, []);

  const onCellValueChanged = useCallback(event => {
    console.log('onCellValueChanged', event)
    console.log('hiii')
    // const ID = event.data.id
    // const PCODE = event.data.packageCode
    console.log(event.data)
    const updatedItem = JSON.stringify({
      guestID: event.data.guestID,
      visaNumber: event.data.visaNumber,
      issueDate:event.data.issueDate,
      ExpiryDate:event.data.ExpiryDate,
      // idFile:event.data.idFile,
    })
    console.log(updatedItem)
    // fetchx(API_URL + `/getGuestVisaDetails?hotelID=1&guestProfileID=${data1.data1.guestID}`, {
    //   method: 'PUT',
    //   body: updatedItem,
    //   headers: {
    //     'Content-type': 'application/json'
    //   }
    // })
    //   .then((res) => res.json())
    //   .then((post) => {
    //     console.log(post)
    //     navigate('')  
    //   })
    //   .catch((err) => {
    //     console.log(err.message)
    //   })
  }, [])

  const [details,setDetails] = useState('')

  useEffect(() => {
    fetchx(API_URL + "/getReservationGuestDetails", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelID:'1',
            reservationID:data1.data1.reservationID,
            })
        }).then(result => result.json())
        .then(rowData => {
          // console.log(hotelID)
          // console.log(data1['data1']['id'])
            console.log(rowData['data'])
            setDetails(rowData['data'][0]) 
            console.log(rowData['data'][0]['guestID']) 
            console.log(rowData['data'][0]['printRate'])  

            // localStorage.setItem('guestID',(rowData['data'][0]['guestID']));            
          }).catch((error) => {
            console.log(error)
          })
    }, [])

    console.log(details)
  // ** State
  const [data, setData] = useState(null)
  const [bookingInfo, setBookingInfo] = useState();

  // ** Hooks
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
  const beginDate = watch('beginDate');
  console.log(beginDate)
 const today = Moment().format('YYYY-MM-DD');
 const options = {
   maxDate: today
 };
 const options1 = {
  minDate: today
};

  let navigate = useNavigate();
  const onSubmit = data => {
    setData(data)
    if ( data.reservation!== null && data.visaNumber!== null && data.guestProfileID!== null&& data.issueDate !== null & data.expiryDate !== null) {
      console.log(data)
      let createmarketGroup = JSON.stringify({        
        "reservationID"   : data1.data1.reservationID,
          "visaNumber" : data.visaNumber,
          "guestProfileID":details.guestID,
          "issueDate" : (Moment(String(new Date(data.issueDate[0]))).format('YYYY-MM-DD')),
          "ExpiryDate" : (Moment(String(new Date(data.expiryDate[0]))).format('YYYY-MM-DD')),
          // attachment: file.pdf
      })
      console.log(createmarketGroup)
      let res = fetchx(API_URL + "/visaDetails", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(result => result.json())
      .then((res) => {
        console.log(res);
        // navigate('') 
        if(res['statusCode'] == 200){
          const swalInstance = MySwal.fire({
            text: res.message,
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
              fetchx(API_URL + `/getGuestVisaDetails?hotelID=1&guestProfileID=${data1.data1.id}`)
          .then(result => result.json())
          .then(rowData => {setRowData(rowData['data'])
          console.log(rowData['data'])
  
        })
        setIDDetails(false)
            }
          });
          
        }
        if(res['statusCode'] == 403){

       
          const swalInstance = MySwal.fire({
          text: res.message,
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          allowOutsideClick: false,
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            setIDDetails(false)
          }
        });
      }
      });
      // toast(
      //   <div className='d-flex'>
      //     <div className='me-1'>
      //       <Avatar size='sm' color='success' icon={<Check size={12} />} />
      //     </div>
      //     <div className='d-flex flex-column'>
      //       <h6>Form Submitted!</h6>
      //       <h4>Visa Details Added Successfull</h4>
      //     </div>
      //   </div>
      // )
    }
  }

  const navigatepage = () => {
    navigate('');
};  

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
       <div>
      <Modal isOpen={bookingInfo} toggle={() => setBookingInfo(!bookingInfo)} className='modal-lg'>
       <ModalHeader className='modal-lg' toggle={() => setBookingInfo(!bookingInfo)}> Modify Booking Information</ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>         
         <div >
         
            </div>
        </ModalBody>
     </Modal>
    </div>

    <Modal isOpen={idDetail} toggle={() => setIDDetails(!idDetail)} className='modal-lg'>
     <ModalHeader className='modal-lg' toggle={() => setIDDetails(!idDetail)}>
     Add Visa Details
     </ModalHeader>
     <ModalBody className='pb-3 px-sm-5 mx-20'>
     <div> 
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
             
             

              <Col md='4' sm='12'>
                <div className='mb-1'>
                  <Label className='form-label' for='visaNumber'>
                    Visa Number
                  </Label>
                  <InputGroup className='input-group-merge'>
                  
                    <Controller
                      id='visaNumber'
                      name='visaNumber'
                      control={control}
                      placeholder='visaNumber'
                      render={({ field }) => (
                        <Cleave
                          {...field}
                          className={classnames('form-control', {
                            // 'is-invalid': data !== null && (data.visaNumber === null || !data.visaNumber.length)
                          })}
                        // options={{ phone: true, phoneRegionCode: 'US' }}y
                        />
                      )}
                    />
                  </InputGroup>
                </div>
              </Col>

              


              <Col md='4' sm='12'>
              <div className='mb-1'>
            <Label className='form-label' for='issueDate'>
              Issue Date
            </Label>
            <Controller
              control={control}
              id='issueDate'
              name='issueDate'
              render={({ field }) => (
                <Flatpickr
                  {...field}
                  options={options} 
                  className={classnames('form-control', {
                    'is-invalid': data !== null && data.issueDate === null
                  })}
                />
              )}
            />
          </div>        
              </Col>
              
              <Col md='4' sm='12'>
              <div className='mb-1'>
            <Label className='form-label' for='expiryDate'>
            Expiry Date
            </Label>
            <Controller
              control={control}
              id='expiryDate'
              name='expiryDate'
              render={({ field }) => (
                <Flatpickr
                  {...field}
                  options={options1} 
                  className={classnames('form-control', {
                    'is-invalid': data !== null && data.expiryDate === null
                  })}
                />
              )}
            />
          </div>
              </Col>
              <Col md='4' sm='12' className='mb-1'>
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
                        </Col>
              <div className='d-flex'>
              {/* <Button className='me-1' color='primary'   onClick={() =>{ setBookingInfo(!bookingInfo)}}>
                  View Visa Details
                </Button> */}
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
     </ModalBody>
     </Modal>



<div>
<Row>
            <Col md='3' sm='12'>
            Arrival  :<b> {details['arrivalDate'] +' '+details['ETA']}    </b> <br></br>
            Departure:<b> {details['departureDate'] +' '+' '+' '+ details['ETA']}  </b> <br></br>
            </Col>
            <Col md='3' sm='12'>
            Adults   :    <b> {details['numberOfAdults']}                      </b> <br></br>
            Children :    <b> {details['numberOfChildren']}                    </b> <br></br>
            </Col>
            <Col md='3' sm='12'>
            Number Of Rooms :    <b> {details['numberOfRooms']}                </b> <br></br>
            Package :         <b> {details['packageCode']}                     </b><br></br>
            Rate: <b>{details['totalCostOfStay']}                               </b><br></br>
            </Col>
            <Col md='3' sm='12'>
            GuestName :   <b> {details["salutation"]  + details["firstName"] + details["lastName"]}</b><br></br> 
            Company Name :<b> {details['accountName']}                     </b> <br></br>
            </Col>

        </Row>

        <div className="ag-theme-alpine" style={{ height: 220 }}>
            <AgGridReact
                ref={gridRef}
                rowData={rowData} columnDefs={columnDefs}
                animateRows={true} 
                rowSelection='multiple'
                onCellClicked={cellClickedListener}
                // paginationAutoPageSize = 'true'
                onCellValueChanged={onCellValueChanged}
                // paginationPageSize='10'
                // pagination='true'
                defaultColDef={defaultColDef}
                headerColor="ddw-primary"

            />
        </div>

        <br></br>
        <br></br>


        <div align='end' className='buttons'>
         <Button color='primary' className='me-1' type='submit' onClick={() => {setIDDetails(!idDetail) }}>
         Add Visa Details
         </Button>
         <Button color='primary' className='me-1' type='button' onClick={navigatepage}>
            Exit
        </Button>
         </div>
</div>

  {/* // AG Grid to Display ID Details */}
  
        
  {/* <br></br>
  <br></br>
  <div className="d-flex justify-content-between">
    <Button
      color="primary"
      className="btn-prev"
      onClick={() => stepper.previous()}
    >
      <ArrowLeft
        size={14}
        className="align-middle me-sm-25 me-0"
      ></ArrowLeft>
      <span className="align-middle d-sm-inline-block d-none">
        Previous
      </span>
    </Button>
    <Button
      color="primary"
      className="btn-next"
      onClick={() => stepper.next()}
    >
      <span className="align-middle d-sm-inline-block d-none">Next</span>
      <ArrowRight
        size={14}
        className="align-middle ms-sm-25 ms-0"
      ></ArrowRight>
    </Button>
  </div> */}
</div>
  )
}

export default VisaDetails