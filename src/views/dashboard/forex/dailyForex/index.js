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
import { useNavigate } from 'react-router-dom';
// import API_URL from '../../../../config'
// import ExportFile from "./exportFile";
// import ImportFile from "./importFile";
// ** Custom Components
import Avatar from '@components/avatar'
import Moment from 'moment'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Card, Form, Row, Col, Label, Modal, ModalHeader, ModalBody, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText, Input } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
// AG Grid
import { AgGridReact } from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'
import { X, DownloadCloud } from 'react-feather'
import API_URL from '../../../../config'

const id = '1';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


const colourOptions = [
  { value: '1', label: 'Active' },
  { value: '0', label: 'InActive' },

]

const defaultValues = {

  currencyName: '',

  rateForTheDay: ''
}

let countryOptions = [
  fetchx(API_URL+"/getcountryDetails")
    .then(result => result.json())
    .then(resp => {
      countryOptions = resp['data']
     
    })
]


const DailyRateForex = () => {
  const [open, setOpen] = useState('')
  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }
  // AG Grid
  const [rowData, setRowData] = useState();
  const [show, setshow] = useState(false);
  const [value, setValue] = useState(null);
  const [showFile, setShowFile] = useState(false);
  

  const gridRef = useRef();



  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Currency', field: 'currencyName', suppressSizeToFit: true, cellStyle: { 'text-align': 'center', 'backgroundColor': 'pink' }, maxWidth: 180 },
    { headerName: 'Rate For The Day', field: 'rateForTheDay', suppressSizeToFit: true, cellStyle: { 'text-align': 'center', 'backgroundColor': '#F1E39B' }, maxWidth: 230, editable: true },
    {
      headerName: 'Action', suppressSizeToFit: true, cellStyle: { 'textAlign': 'center', 'backgroundColor': 'white' }, maxWidth: 160,
      cellRendererFramework: (params) => <Button color='primary' onClick={() => { handleselect(params) }}> Save </Button>
    },
  ]);
  let navigate = useNavigate();


  const handleselect = (event) => {
    setshow(true)
   

  }
 
const handleSuccess = () => {
  MySwal.fire({
    text: "Rate updated successfully",
    icon: 'success',
    buttonsStyling: false,
    confirmButtonText: 'Rate Updated Successfully',
    allowOutsideClick: false,
    customClass: {
      confirmButton: 'btn btn-success'
    }
  });
};

const onSelect = () => {
  if (value && value.currencyName && value.currencyID && value.rateForTheDay) {
    let createmarketGroup = JSON.stringify({
      "hotelID": 1,
      "currencyName": value.currencyName,
      "currencyID": value.currencyID,
      "rateForTheDay": value.rateForTheDay
    });
    fetchx(API_URL+"/updateRateForTheDay", {
      method: 'PUT',
      body: createmarketGroup,
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then((data) => data.json())
    .then((res) => {
      if (res.statusCode === 200) {
        handleSuccess(); // Show success message
        navigate('');
      } else {
        handleError(res.message); // Handle other cases, e.g., validation error
      }
    })
    .catch((error) => {
      console.error("Error during fetch:", error);
    });
  }
};

  const onCellValueChanged = useCallback(event => {
   
  })

  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));


  const cellClickedListener = useCallback(event => {
    const newValue = event.data; // Assuming event.data contains the new value
    setValue(newValue);
  }, []);
 

useEffect(() => {
    fetchx(API_URL+"/getDailyRateForexInf?hotelID=1")
      .then(result => result.json())
      .then(rowData => 
      setRowData(rowData["data"])


 ) }, []);

  // ** State
  const [data, setData] = useState('')

  // ** Hooks
  const { reset, handleSubmit, control } = useForm({ defaultValues })



  
  const onSubmit = (data) => {
    setData(data);
    setShowFile(true);
    if (data && data.room !== null) {
  
      let createDailyRateForex = JSON.stringify({
        hotelID: 1,
        currencyID: data.currencyName.value,
        rateForTheDay: data.rateForTheDay,
      });
  
      fetchx(API_URL+"/addRateForTheDay", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createDailyRateForex
      })
      .then((res) => {
        navigate('');
  
        if (res.status === 200) {
          MySwal.fire({
            text: "Rate added successfully",
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Rate added Successfully',
            allowOutsideClick: false,
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });
          fetchx(API_URL+"/getDailyRateForexInf?hotelID=1")
            .then((result) => result.json())
            .then((rowData) => {
              setRowData(rowData["data"]);
            })
            .catch((error) => {
              console.error("Error during fetchx:", error);
            });
        } else {
          const swalInstance = MySwal.fire({
            text: res.message,
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Duplicate Entry For Country',
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
      .catch((error) => {
        console.error("Error during fetch:", error);
      });
    }
  };
 
  const handleReset = () => {
    setshow(false)
    reset({
      currencyName: '',
      rateForTheDay: ''
    })
    reset({
      projectlocation: '',
      csvfile: '',
    })
  }

  return (
    <div>
  
      <div>
        <Accordion open={open} toggle={toggle}>
          <AccordionItem>
            <AccordionHeader targetId='1'><h4><b>Add Daily Rate Forex</b> </h4></AccordionHeader>
            <AccordionBody accordionId='1'>
              <Card>
                <CardHeader>
                  <CardTitle tag='h4'>Daily Rate Forex</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>


                      <Col md='4' sm='12'>
                        <div className='mb-1'>
                          <Label className='form-label' for='currencyName'>
                            Currency<spam style={{ color: 'red' }}>*</spam>
                          </Label>
                          <Controller
                            id="currencyName"
                            control={control}
                            name="currencyName"
                            render={({ field }) => (
                              <Select
                                required
                                isClearable
                                options={countryOptions}
                                classNamePrefix="select"
                                theme={selectThemeColors}

                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col>

                      <Col md='4' sm='12'>
                        <div className='mb-1'>
                          <Label className='form-label' for='rateForTheDay'>
                            Rate For The Day<spam style={{ color: 'red' }}>*</spam>
                          </Label>
                          <InputGroup className='input-group-merge'>

                            <Controller
                              id='rateForTheDay'
                              name='rateForTheDay'
                              control={control}
                              render={({ field }) => (
                                <Input
                                  required
                                  onChange={handleselect}
                                  placeholder='rateForTheDay'

                                  {...field}
                          
                                />
                              )}
                            />
                          </InputGroup>
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
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      </div>

      <br></br>

      <div>
          <div className="ag-theme-alpine" style={{ height: 540 }}>
          
            <AgGridReact
              ref={gridRef}
              rowData={rowData} columnDefs={columnDefs}
              animateRows={true} rowSelection='multiple'
              onCellClicked={cellClickedListener}
              onCellValueChanged={onCellValueChanged}
              paginationPageSize='10'
              pagination='true'
              defaultColDef={defaultColDef}
              headerColor="ddw-primary"
              />
             
          </div>

          <Modal
            isOpen={show} toggle={() => setshow(!show)}
            className='modal-dialog-centered'
          >
            <ModalHeader toggle={() => setshow(!show)} className='bg-transparent'></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
              <h1 className='text-center mb-1'>Rate Update</h1>

              <>
                <h6>Currency :<b>{value!= undefined ? value.currencyName : null}</b></h6>
                <h6>Rate For The Day:<b>{value!= undefined ? value.rateForTheDay : null}</b></h6>
                
              </>

              <Row>
                <Col className='text-center mt-1' xs={12}>
                  <Button className='me-1' color='primary' type='submit' onClick={() => { onSelect() }}>
                    Confirm
                  </Button>
                  <Button outline color='secondary' type='reset' onClick={handleReset}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
      </div>

    
     
    </div>
  )
}

export default DailyRateForex;
