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
//import DatePicker from 'react-datepicker';
//import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios'; // Import your HTTP client library (e.g., axios)

//import TimePicker from 'react-time-picker';

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
import {AgGridReact} from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import {useRef, useEffect, useMemo, useCallback} from 'react';
const id = '1';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap'
import API_URL from '../../../config'
import { useNavigate } from 'react-router-dom';
// ** Third Party Components
//import Swal from 'sweetalert2'
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const defaultValues = {
    setDate: " ",
    setTime: "",
    reminder: "",
    remarks: "",
    status: "",
};

const WakeUpCall = (data1) => {
  const [open, setOpen] = useState('')
  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }
  const [idDetail, setIDDetails] = useState();
  const [value, onChange] = useState('');

  // AG Grid
  const [rowData, setRowData] = useState();
  const [checkboxChecked, setCheckboxChecked] = useState(true)
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [details,setDetails] = useState('')

  const gridRef = useRef();






 const [columnDefs, setColumnDefs] = useState([
    
    {headerName: 'Date',field: 'setDate', suppressSizeToFit: true, maxWidth: 160,editable:true },
    { headerName: 'Time', field: 'setTime', suppressSizeToFit: true, maxWidth: 160,editable:true  },
    { headerName: 'Reminder', field: 'reminder', suppressSizeToFit: true,   editable: true, maxWidth: 160  },
    { headerName: 'Remarks', field: 'remarks', suppressSizeToFit: true, editable: true, maxWidth: 160  },
    // { headerName: 'Status', field: 'status', suppressSizeToFit: true, editable: true, maxWidth: 160  },
    // { headerName: 'IsFollowUp', field: 'isFollowUp', suppressSizeToFit: true, editable: true, maxWidth: 160  },

    {
      headerName: 'Cancel',
      field: ' setDate',
      suppressSizeToFit: true,
      maxWidth: 125,
      cellRendererFramework: (params) => <Button color='primary' onClick={() => actionButton1(params)}> Cancel</Button>
    },
    {
      headerName: 'Save',
      field: ' setDate',
      suppressSizeToFit: true,
      maxWidth: 125,
      cellRendererFramework: (params) => <Button color='primary' onClick={() => actionButton1(params)}> Save</Button>
    }
  ]);

  const actionButton1 = (data) => {

   
    let createmarketGroup = JSON.stringify({
      "id": data.data.id,
      "hotelID": data.data.hotelID,

      "setDate": data.data.setDate,
      "setTime": data.data.setTime,
      "reminder":  data.data.reminder,
      "remarks": data.data.remarks,
     "status": data.data.status
     
        })
  
    let res =    fetchx(API_URL + `/updateWakeUpCallDetails?id=${data.data.id}&hotelID=${data.data.hotelID}`, {
        method: 'PUT',
        body: createmarketGroup,
        headers: {
          'Content-type': 'application/json'
        }
        
      })   .then((res) => {
        if (res.status === 200) {
          // Response status is 200 (OK)
          return res.json();
        } else {
          // Handle other status codes (e.g., error)
          throw new Error('API request failed');
        }
      })
      .then((post) => {
        const swalInstance = MySwal.fire({
          text: 'Wakeup Call Details Updated Successfully!',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          allowOutsideClick: false,
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
        navigate('')
  
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            navigate('');
          }
        });
        })
      .catch((err) => {
        console.log(err.message);
      });
  };
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
  }, []);

  useEffect(() => {
    fetchx(API_URL + `/getWakeUpCallDetais?hotelID=1&reservationID=${data1.data1.id}`)
      .then((result) => result.json())
      .then((rowData) => 
      setRowData(rowData["data"]));
  }, []);

  const onCellValueChanged = useCallback(event => {

    const updatedItem = JSON.stringify({
      reminder: event.data.reminder,
      remarks: event.data.remarks,
      status:event.data.status,
    })
    console.log(updatedItem)

  }, [])


  const [isFollowUp, setIsFollowUp] = useState('no'); // Default value when checkbox is not checked

  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked); // Toggle checkbox state

    // Update isFollowUp based on checkbox state
    setIsFollowUp(checkboxChecked ? 'no' : 'yes');
  };
  useEffect(() => {
    fetchx(API_URL + "/getReservationGuestDetails", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelID:'1',
            reservationID:data1.data1.id,
            guestID:data1.data1.id
            })
        }).then(result => result.json())
        .then(rowData => {
            setDetails(rowData['data'][0])           
          }).catch((error) => {
            console.log(error)
          })
    }, [])

  // ** State
  const [data, setData] = useState(null)
  const [bookingInfo, setBookingInfo] = useState();

  // ** Hooks
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
 

  const optionsToDate = {
    minDate: (details.arrivalDate),
    maxDate: (details.departureDate),
  };

  const optionsToDate1 = {
    minDate: (details.arrivalDate),
    maxDate: (details.departureDate),
  };

  let navigate = useNavigate();
  const onSubmit = data => {
    setData(data)   
      let createmarketGroup = JSON.stringify({  
          "hotelID":1,
          "reservationID":data1.data1.id,
          "guestID":data1.data1.guestID,
          "Time"   : data.setTime,
          "fromDate" : (Moment(String(new Date(data.arrivalDate[0]))).format('YYYY-MM-DD')),
          "toDate":(Moment(String(new Date(data.departureDate[0]))).format('YYYY-MM-DD')),
          "reminder" : data.reminder,
          "remarks" : data.remarks,
          "status" : data.status,
          "isFollowUp":isFollowUp
      })
      let res = fetchx(API_URL + '/addWakeUpCallDetails', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(result => result.json())
      .then((res) => {
          console.log(res);
          const swalInstance = MySwal.fire({
            text: 'wakeupcall Details added Successfully!',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'success',
            allowOutsideClick: false,
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });
          navigate('') 
         swalInstance.then((result) => {
          if (result.isConfirmed) {
            // fetchx(`http://122.166.2.21:14708/getWakeUpCallDetais?hotelID=1&reservationID=${data1.data1.id}`)
            fetchx(API_URL + `/getWakeUpCallDetais?hotelID=1&reservationID=${data1.data1.id}`)

              .then(result => result.json())
              .then(rowData => {
                setRowData(rowData['data1']);
              })
            setIDDetails(false);
          }
        });
      })
      .catch(error => {
        console.error("An error occurred:", error);
      });
          
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
             navigate('') 
          }
        });
      }
      // navigate('')    
      setIDDetails(false)

  }
  const navigatepage = () => {
    navigate('');
};  

  const handleReset = () => {
    reset({
     
      setTime: '',
      fromDate: '',
      toDate: '',
      //numberOfDays: '',
      // reminder: '',
      remarks:''
    })
  }

  return (
    <div>
    <Modal isOpen={idDetail} toggle={() => setIDDetails(!idDetail)} className='modal-lg'>
     <ModalHeader className='modal-lg' toggle={() => setIDDetails(!idDetail)}>
     Add New
     </ModalHeader>
     <ModalBody className='pb-3 px-sm-5 mx-20'>
     <div> 
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
             
             
              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='eta'>
                    Time
                  </Label>
                  <Controller
                    defaultValue='00:00'
                    control={control}
                    id='setTime'
                    name='setTime'
                    render={({ field }) => <Input type='time' placeholder='setTime' {...field} />}
                  />
                </div>
              </Col>


              
                  <Col md="4" sm="12">
                    <div className="mb-1">
                      <Label className="form-label" for="arrivalDate">
                        from Date <spam style={{ color: "red" }}>*</spam>
                      </Label>
                      <Controller
                        // defaultValue={details ? details.dropDate : ''}
                        control={control}
                        id="arrivalDate"
                        name="arrivalDate"
                        render={({ field }) => (
                          <Flatpickr
                            required
                            {...field}
                            options={optionsToDate1}
                            placeholder="YYYY-MM-DD "
                            className={classnames("form-control", {
                              // 'is-invalid': data !== null && data.dropDate1 === null
                            })}
                          />
                        )}
                      />
                    </div>
                    </Col>



                  <Col md="4" sm="12">
                    <div className="mb-1">
                      <Label className="form-label" for="departureDate">
                        to Date <spam style={{ color: "red" }}>*</spam>
                      </Label>
                      <Controller
                        control={control}
                        id="departureDate"
                        name="departureDate"
                        render={({ field }) => (
                          <Flatpickr
                            required
                            {...field}
                            options={optionsToDate}
                            placeholder="YYYY-MM-DD "
                            className={classnames("form-control", {
                            })}
                          />
                        )}
                      />
                    </div>
                    </Col>



                      <Col md="3" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="names">
                            Remarks
                          </Label>
                          <Controller
                            control={control}
                            id="remarks"
                            name="remarks"
                            render={({ field }) => (
                              <Input
                                // required
                                //disabled={true}
                                placeholder="remarks"

                                {...field}
                               
                                 />
                            )}
                          />
                        </div>
                      </Col>


                      <Col md='4' sm='8'>
                <br></br>
                <br></br>
                <div className='form-check form-check-inline' for="isFollowedUp">
                  <Input type='checkbox'
                  //  id='basic-cb-unchecked'
                   id="isFollowedUp"
                   name="isFollowedUp"
                    checked={checkboxChecked}
                    onChange={handleCheckboxChange} 

                    // onClick={onhandle} 
                    value={isFollowUp}/>
                  <Label for='pickUpRequired' className='form-check-label'>
                    Is Follow Up
                     

                  </Label>
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
         Add New
         </Button>
         <Button color='primary' className='me-1' type='button' onClick={navigatepage}>
            Exit
        </Button>
         </div>
</div>
</div>
  )
}

export default WakeUpCall

