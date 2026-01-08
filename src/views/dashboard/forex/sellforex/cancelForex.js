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
import API_URL from '../../../../config'
import { useNavigate } from 'react-router-dom'


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
import { AgGridReact } from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import { useRef, useEffect, useMemo, useCallback } from 'react';
const id = '1';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap'
// import CancelForexCertificate  from "./cancelForexCertificate"
// import API_URL from '../../../config'
// import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)



const defaultValues = {
  forexID: '',
  guestName: '',
  reasonText: '',
};


const ForexCancellation = (data1) => {
  let navigate = useNavigate()
  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }
  const [open, setOpen] = useState('')
  const [data, setData] = useState('')
  const [reason, setReason] = useState([])
  const [valueReason, setValueReason] = useState();
  const [show, setShow] = useState(true)
  const [guestName, setName] = useState([])
  const [forexID, setForexID] = useState([])
  const [forex, setForex] = useState()
  const [ForexCancelCertificate, setForexCancelCertificate] = useState([])
  const [Filldata, setFillData] = useState([])
  const [rowData, setRowData] = useState('');
  const[reasoncode,setreasoncode ]= useState()
  const[reasonlabel, setreasonlabel]= useState()
 const { reset, handleSubmit, control, formState: { errors }
  } = useForm({ defaultValues });

  useEffect(() => {
    fetchx(API_URL + "/getReasonByID?reasonGroupID=11")
      .then(result => result.json())
      .then(resp => {
        const reasonsArray = [];
        const data = resp['data'];

        for (let i = 0; i < data.length; i++) {
          const reason = data[i];
          reasonsArray.push({
            value: reason.value,
            label: reason.label,
          });
        }
      
          // Print only the 'value' property
      reasonsArray.forEach(reason => {
        console.log(reason.value);
      });
      const valuesArray = reasonsArray.map(reason => reason.value);
      const labelsArray = reasonsArray.map(reason => reason.label);
      setreasoncode(valuesArray)
      setreasonlabel(labelsArray)

        setReason(resp['data'])
      })
    }, [data1]);
    const[businessDate,setbusinessDate ] = useState()
    useEffect(() => {
      const hotelID = JSON.stringify({
        hotelID: 1
      })
      fetchx(API_URL + "/getBusinessDate", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: hotelID
      }).then((res) => res.json())
        .then(rowData => {
          const data = rowData.data
  
        const businessdate = new Date(data[0]["businessDate"]);
        const formattedBusinessDate = businessdate.toISOString().slice(0, 19).replace("T", " ");
              
        setbusinessDate(formattedBusinessDate)

        })
    }, [])

  useEffect(() => {

    if (data1 && data1.data1 && data1.data1.guestProfileID) {
      const guestProfileID = data1.data1.guestProfileID;
      console.log(guestProfileID)
      fetchx(API_URL +"/getGuestForexDetails?hotelID=1&guestProfileID=${guestProfileID}")
        .then(result => result.json())
        .then(resp => {
          const data = resp.data;
          for (let i = 0; i < data.length; i++) {
            const forexdata = data[i];

            const forexid = forexdata.id;
            const guestname = forexdata.firstName;

            setForexID(forexid);
            setName(guestname);


            // Add your logic or processing for each forexdata here
          }
        })
        .catch(error => {
          console.error("Error fetching forex data:", error);
        });
    }
  }, [data1]);

  function Cancel() {
    //setForex(false)
    setTimeout(() => { navigate('/apps/forex/sellforex'); }, 10)

  }
 const handleChange = (selectedOption) => {
    setValueReason(selectedOption.label);
  };

  const onSubmit = data => {
  
    if (data1?.data1) {
      let createDailyRateForex = JSON.stringify({
        "isCancelled": 1,
        "reason":valueReason,
        "id": data1.data1.id,

        "date":data1.data1.date,
        "hotelID": 1,
      });
  
      fetchx(API_URL + "/updateCancelForex", {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: createDailyRateForex
      })
        .then(async (res) => {
          navigate('');
  
          if (res.status === 200) {
            const swalInstance = MySwal.fire({
              text: 'Forex Cancelled Successfully!',
              icon: 'success',
              buttonsStyling: false,
              allowOutsideClick: false,
              confirmButtonText: 'Close',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            });
  
            swalInstance.then(async (result) => {
              if (result.isConfirmed) {
                const result = await fetchx(API_URL + `/getForexCancelData?hotelID=1&forexID=${data1.data1.id}`);
                const rowData = await result.json();
                setRowData(rowData["data"]);
              }
            });
          } else {
            const responseData = await res.json();
            const swalInstance = MySwal.fire({
              text: responseData.message,
              icon: 'error',
              buttonsStyling: false,
              confirmButtonText: 'Forex Cancellation Failed',
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
          }
        })
        .catch(error => {
          console.error('Error during fetch:', error);
          // Handle the error appropriately, e.g., show an error message to the user
        });
    }
  };
  
  return (
<div>
 <Card>
        <CardHeader>
          <CardTitle tag="h4">Cancel Forex Form </CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>

              <Col md='6' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="forexID">
                    Forex ID
                  </Label>
                  <Controller
                    id='forexID'
                    control={control}
                    name='forexID'
                    render={({ field }) => (
                      <Input
                        isClearable
                        options={forexID}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.forexID === null })}
                        {...field}
                        // disabled={true}
                        value={data1.data1.id}
                        readOnly
                      />
                    )}
                  />

                </div>
              </Col>


              <Col md='6' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="guestName">
                    Guest Name
                  </Label>
                  <Controller
                    id='guestName'
                    control={control}
                    name='guestName'
                    render={({ field }) => (
                      <Input
                        isClearable
                        options={guestName}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select', { 'is-invalid': data !== null && data.guestName === null })}
                        {...field}
                        // disabled={true}
                        value={data1.data1.guestName}
                        readOnly
                      />
                    )}
                  />

                </div>
              </Col>


              <Col md='6' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="reason">
                    Select Reason
                  </Label>
                  <Controller
                    control={control}
                    name="reasonCode"
                    render={({ field }) => (
                      <Select
                        required
                        isClearable
                        options={reason}
                        id='reasonCode'
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        {...field}
                        onChange={handleChange} // Add onChange event handler
                      />
                    )}
                  />
                </div>
              </Col>


              <Col md='6' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="reasonText">
                    Reason Text
                  </Label>
                  <Controller
                    id='reasonText'
                    control={control}
                    name='reasonText'
                    render={({ field }) => (
                      <Input
                        isClearable
                        type="text"
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        {...field}
                        // disabled={true}
                        value={valueReason}
                        onChange={(e) => setValueReason(e.target.value)}


                      />
                    )}
                  />

                </div>
              </Col>


              <div className="d-flex">
                <Button outline color='secondary' className='me-1' onClick={Cancel}>
                  Cancel
                </Button>
              
                <Button className="me-1" color="danger" type="submit" >
                  Cancel Forex
                </Button>

              </div>
           </Row>
          </Form>

        </CardBody>
      </Card>

    </div>
  )






};
export default ForexCancellation;