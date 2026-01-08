import React, { Fragment, useState, Component, useRef, useEffect, useMemo, useCallback } from 'react'

import Profile from './profile'
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Moment from 'moment'
import { useNavigate } from "react-router-dom"

import * as ReactDOM from 'react-dom'
import GuestProfile from './guestProfile/index'
import CompanyProfile from './companyProfile/index'
import Booker from './companyProfile/booker'
import GuestDataGrid from './guestDatagrid'
import History from './guestHistory'
import warningImage from './DailyDetailsWarningImage.jpeg'; // Replace with the actual path to your image

let dailyCheck = 0;

// ** Reactstrap Imports
import {
  AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, Accordion, InputGroup, NavLink, UncontrolledAccordion
} from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

import ConfirmedDetails from "./confirmedDetails"

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'



import API_URL from '../../../config'

sessionStorage.removeItem('rateCodeCorporate')
sessionStorage.removeItem('amount')
sessionStorage.removeItem('radioType')
sessionStorage.removeItem('radioButton')
sessionStorage.removeItem('reservationid')
sessionStorage.removeItem('source')
sessionStorage.removeItem('guestProfileID')
sessionStorage.removeItem('package')
sessionStorage.removeItem('checkIn')
sessionStorage.removeItem('checkout')
sessionStorage.removeItem('companyID')
sessionStorage.removeItem('companyName')
sessionStorage.removeItem('adults')
sessionStorage.removeItem('children')
sessionStorage.removeItem('companyName')
sessionStorage.removeItem('quantity')
sessionStorage.removeItem('rateCodeIDs')
sessionStorage.removeItem('cardNumber')
sessionStorage.removeItem('cardHolderName')
sessionStorage.removeItem('expiryDate')
sessionStorage.removeItem('transactionID')
sessionStorage.removeItem('authorizationID')
sessionStorage.removeItem('amount')
sessionStorage.removeItem('paymentType')
sessionStorage.removeItem('pickupDate')
sessionStorage.removeItem('pickupTime')
sessionStorage.removeItem('pickupTransportType')
sessionStorage.removeItem('pickupLocation')
sessionStorage.removeItem('pickupRemarks')
sessionStorage.removeItem('dropDate')
sessionStorage.removeItem('dropTime')
sessionStorage.removeItem('dropTransportType')
sessionStorage.removeItem('dropLocation')
sessionStorage.removeItem('dropupRemarks')
sessionStorage.removeItem('AccountName')
sessionStorage.removeItem('packageName')
sessionStorage.removeItem('packageCode')
sessionStorage.removeItem('sourceID')
sessionStorage.removeItem('marketID')
sessionStorage.removeItem('resType')
sessionStorage.removeItem('Origin')
sessionStorage.removeItem('bookingCompanyName')
sessionStorage.removeItem('rateCodeCorporate')



const colourOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
]


// let colourOptions1 = [
//   fetchx(API_URL + '/getNumberOfRoomsOptions?hotelID=1')
//     .then(result => result.json())
//     .then(resp => {
//       colourOptions1 = resp['data']
//       console.log(colourOptions1)
//     })
// ]


const colourOptions1 = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10', label: '10' },
  { value: '11', label: '11' },
  { value: '12', label: '12' },
  { value: '13', label: '13' },
  { value: '14', label: '14' },
  { value: '15', label: '15' }
]


const children = [
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
]


const Origin = [
  { value: '1', label: 'Email' },
  { value: '2', label: 'Phone' },
  { value: '3', label: 'Walk-In' },
  { value: '4', label: 'House-Use' },
  { value: '5', label: 'Hotel-Reservation Office' },
  { value: '6', label: 'Online' }
]


let OriginOptions = [
  fetchx(API_URL + '/getOriginOptions?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      OriginOptions = resp['data']
    })
]


let ReservationTypeOptions = [
  fetchx(API_URL + '/getReservationTypes?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      ReservationTypeOptions = resp['data']
    })
]


let Features = [
  fetchx(API_URL + '/getPrefernceOptions?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      Features = resp['data']
    })
]


let paymentName = [
  fetchx(API_URL + '/getPayment?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      paymentName = resp['data']
    })
]


let sourceCode = [
  fetchx(API_URL + '/getSourceName?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      sourceCode = resp['data']
    })
]


let marketCode = [
  fetchx(API_URL + '/getMarketName?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      marketCode = resp['data']
    })
]


let Agent = [
  fetchx(API_URL + '/getAgentList?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      Agent = resp['data']
    })
]


let extraName = [
  fetchx(API_URL + '/getExtraDescription?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      extraName = resp['data']
    })
]


let TransportType = [
  fetchx(API_URL + '/getTransportTypeOptions?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      TransportType = resp['data']
    })
]


const defaultValues = {
  checkIn: null,
  checkOut: null,
  adult: null,
  children: null,
  quantity: null,
}


let PackageCodes = [
  fetchx(API_URL + '/getPackageCode')
    .then(result => result.json())
    .then(resp => {
      PackageCodes = resp['data']
    })
]


let accountManagerList = [
  fetchx(API_URL + '/getAccountManagerList', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
  }).then(result => result.json())
    .then(resp => {
      // console.log(resp['data'])
      accountManagerList = resp['data']
    })
]


let BookerList = [
  fetchx(API_URL + '/getAllBookerList', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
  }).then(result => result.json())
    .then(resp => {
      BookerList = resp['data']
    })
]


// const ImageUploader = () => {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileChange = (event) => {
//     console.log(event.target.files[0])
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleUpload = () => {
//     if (!selectedFile) {
//       alert('Please select a file before uploading.');
//       return;
//     }

//     const formData = new FormData();
//     const boundary = `--------------------------${Date.now()}`;
//     formData.append('file', selectedFile);
//     formData.append('hotelID', 1);
//     formData.append('source', 2);
//     formData.append('doctype', 3);
//     formData.append('docrefno', 10);

//     console.log(formData)

//     // fetchx(API_URL + '/resPaymentType', {
//     fetchx('http://13.234.187.190:14702/v4/imgupload', {

//       method: 'POST',
//       body: formData,
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//       });
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload Image</button>
//     </div>
//   );
// };


{/* <ImageUploader></ImageUploader> */ }


const Companydetails = () => {

  const defaultValues1 = {
    reservationid: '',
    source: '',
    companyID: '',
    packageID: null,
  }

  const [data, setData] = useState(null)
  const [source1, setsource] = useState('')
  const [filldata, setfilldata] = useState(false)
  const [rowData, setRowData] = useState()
  const [fullAddress, setAddress] = useState()
  const { reset, handleSubmit, control } = useForm({ defaultValues1 })
  const { setError, formState: { errors } } = useForm()
  const gridRef1 = useRef()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showDropdown1, setShowDropdown1] = useState(false)
  const [companyProfile, setCompanyProfile] = useState(false)
  const [basicModal, setBasicModal] = useState(false)
  const [validation, setValidation] = useState(false)


  //function to fetch the value of radio button
  function handleRadioChange(event) {
    if (event.target.value === 'corporate') {
      setShowDropdown(true)
      setShowDropdown1(false)
    } else {
      setfilldata(false)
      setShowDropdown(false)
      setShowDropdown1(true)
    }
    setsource(event.target.value)
  }

  //ag-grid cell clcked value
  const cellClickedListener = useCallback(event => {
    sessionStorage.setItem('companyName', event['data']['accountID'])
    sessionStorage.setItem('bookingCompanyName', event['data']['accountName'])
    sessionStorage.setItem('rateCodeIDs', event['data']['rateCodeID'])
    sessionStorage.setItem('AccountName', event['data']['accountName'])
    setfilldata(event['data']['accountName'])
  })


  //On submit function
  const onSubmit = data => {
    setData(data)
    if (source1 !== null && source1 !== '') {
      if (source1 === 'corporate' && data.companyID !== null) {
        const corporate = JSON.stringify({
          source: 2,
          companyID: sessionStorage.getItem('companyName'),
          packageID: data.packageID1 === undefined ? null : data.packageID1.value,
          guestProfileID: sessionStorage.getItem('guestProfileID')
        })
        const res = fetchx(API_URL + "/CompanyInformation", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: corporate
        }).then(result => result.json())
          .then(resp => {
            // console.log(resp['data'])
            const floorList = resp['data']['reservationid']
            sessionStorage.setItem('source', resp['data']['source'])
            sessionStorage.setItem('reservationid', floorList)
          }).catch((error) => {
            console.log(error)
          })
      }

      else {
        sessionStorage.setItem('packageName', data.packageID1.label)
        const company = JSON.stringify({
          source: 1,
          companyID: null,
          packageID: data.packageID1 === undefined ? null : data.packageID1.value,
          guestProfileID: sessionStorage.getItem('guestProfileID')
        })

        const res = fetchx(API_URL + "/CompanyInformation", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: company
        }).then(result => result.json())
          .then(resp => {
            sessionStorage.setItem('source', resp['data']['source'])
            const floorList = resp['data']['reservationid']
            sessionStorage.setItem('reservationid', floorList)
          }).catch((error) => {
            console.log(error)
          })
      }
    }

    else {
      setValidation(true)
    }
  }


  //API to get company list
  useEffect(() => {
    fetchx(API_URL + `/getCompanyList?hotelID=1`)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
        setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
      })
  }, [])


  //Ag-grid column definition
  const [columnDefs] = useState([
    { headerName: 'Company Name', field: 'accountName', maxWidth: 300 },
    { headerName: 'Rate Code', field: 'rateCodeIDs', maxWidth: 300 },
    { headerName: 'Address Line 1', field: 'addressLine1', maxWidth: 300 },
    { headerName: 'Address Line 2', field: 'addressLine2', maxWidth: 300 },
    { headerName: 'City', field: 'city', maxWidth: 110 },
    { headerName: 'State', field: 'state', maxWidth: 110 },
    { headerName: 'Country', field: 'country', maxWidth: 110 },
    {
      headerName: "Action",
      maxWidth: 140,
      cellRenderer: () => {
        return (<Button color='primary' onClick={onDiscard}>Select</Button>)
      }
    },
    { headerName: 'GSTID', field: 'gstID', maxWidth: 300 },

    { headerName: 'Mobile Number', field: 'phoneNumber', maxWidth: 300 },
    { headerName: 'Email ID', field: 'email', maxWidth: 300 },
    // {
    //   cellRenderer: () => {
    //     return (<Button color='primary' onClick={() => setAssign(!assign)} >View Profile</Button>)
    //   }
    // }
  ])


  //Search element
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef1.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    )
  }, [])


  //ag-grid column defn
  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ))


  //Modal close function
  const onDiscard = () => {
    setBasicModal(false)
  }


  function toggleModal() {
    fetchx(API_URL + `/getCompanyList?hotelID=1`)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
        setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
      })
    setCompanyProfile(false)
  }

  //on click of new company profile
  const onclickButton = () => {
    setCompanyProfile(true)
  }


  //reset function
  const handleReset = () => {
    setfilldata(false)
    reset({
      source: '',
      companyID: '',
      packageID: null
    })
  }


  return (
    <div>

      <Modal isOpen={companyProfile} toggle={() => setCompanyProfile(!companyProfile)} className='modal-xl'>
        <ModalHeader toggle={() => setCompanyProfile(!companyProfile)}>Company Profile</ModalHeader>
        <ModalBody>
          <CompanyProfile toggleModal={toggleModal} />
        </ModalBody>
      </Modal>

      <Card>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col className='name'>
                <div className='demo-inline-spacing'>
                  <div className='form-check'>

                    {/* FIT */}
                    <Label className='form-check-label' for='ex1-active'>
                      <Input required type="radio" name='ex1' value="fit" onChange={handleRadioChange} />
                      FIT
                    </Label>

                    <br></br>
                    <br></br>

                    {/* Corporate */}
                    <Label className='form-check-label'>
                      <Input type="radio" required name='ex1' value="corporate" onClick={() => setBasicModal(!basicModal)} onChange={handleRadioChange} />
                      Corporate
                    </Label>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Company input value */}
            <Row>
              <Col>
                <br></br>
                {/* <br></br> */}
                {
                  filldata !== false && <Label className='form-check-label'>
                    Company
                    <Input required type="text" name='companynam' value={filldata} onClick={() => setBasicModal(!basicModal)} />
                  </Label>
                }
              </Col>
            </Row>

            {showDropdown &&
              <div>
                <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-xl' onClosed={onDiscard}>
                  <ModalHeader toggle={() => setBasicModal(!basicModal)}>Company Profile Search</ModalHeader>
                  <ModalBody>
                    <div>
                      <Row className='mb-1'>
                        <Col md='3' sm='12' className='me-1'>
                          <Label className='form-label' for='fullName'>
                            Search
                          </Label>
                          <Input
                            type="text"
                            id="filter-text-box"
                            placeholder="Filter..."
                            onInput={onFilterTextBoxChanged}
                          />
                        </Col>
                        <Col md='3' sm='12' className='me-1'>
                          <br></br>
                          <div align='end' >
                            <Button color='primary' onClick={onclickButton}> Add New Company</Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div className="ag-theme-alpine" style={{ height: 520 }}>
                      <AgGridReact
                        ref={gridRef1}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        animateRows={true}
                        onCellClicked={cellClickedListener}
                        paginationPageSize='10'
                        pagination='true'
                        defaultColDef={defaultColDef}
                        headerColor="ddw-primary"
                      />
                    </div>
                  </ModalBody>
                </Modal>
              </div>
            }

            {
              showDropdown1 &&
              <Col md='4' sm='5'>
                <div className='mb-1'>
                  <Label className='form-label' for='packageID1'>
                    Select Package  <spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    id='packageID1'
                    control={control}
                    name='packageID1'
                    render={({ field }) => (
                      <Select
                        required
                        options={PackageCodes}
                        // disabled={isSubmitted}
                        isClearable
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select')}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>
            }

            <br></br>
            <div align='end'>
              <Button className='me-1' style={{ align: 'right' }} outline color='secondary' type='reset' onClick={handleReset} >
                Reset
              </Button>
              {(filldata || showDropdown1) && <Button className='me-1' color='primary' type='submit' style={{ align: 'right' }}>
                Submit
              </Button>}
            </div>

          </Form>
        </CardBody>
      </Card>

      {validation === true && <div>

        <Modal isOpen={validation} toggle={() => setValidation(!validation)} className={'modal-dialog-centered {modal-lg}'}>
          <ModalHeader className='modal-sm' toggle={() => setValidation(!validation)}>
            Alert !!!
          </ModalHeader>
          <ModalBody className='pb-3 px-sm-5 mx-20'>
            <p>
              Please select Company Type or choose FIT !
            </p>
          </ModalBody>
        </Modal>
      </div>
      }

    </div>
  )

}


const Extra = ({ onSubmit1 }) => {
  const [data, setData] = useState(null)
  const gridRef1 = useRef()
  const [rowData, setRowData] = useState()
  const [basicModal, setBasicModal] = useState(false)
  const [agentModal, setAgentModal] = useState(false)
  const [companyModal, setCompanyModal] = useState(false)
  const [companyProfile, setCompanyProfile] = useState(false)
  const [checkboxChecked, setCheckboxChecked] = useState(true)
  const [checkboxChecked1, setCheckboxChecked1] = useState(false)
  const [selectedBooker, setSelectedBooker] = useState({});
  const [selectedAgent, setSelectedAgent] = useState({});
  const [selectedCompany, setSelectedCompany] = useState({});
  const [agentList, getAgentList] = useState()
  const [bookerList, getBookerList] = useState()
  const [companyProfile2, setCompanyProfile2] = useState(false)
  const [defaultOptionsSource, setDefaultOptionsSource] = useState([]);
  const [defaultOptionsMarket, setDefaultOptionsMarket] = useState([]);
  const [defaultOptionsExtras, setDefaultOptionsExtras] = useState([]);
  const [selectedOptionSource, setSelectedOptionSource] = useState(null);
  const [selectedOptionMarket, setSelectedOptionMarket] = useState(null);
  const [selectedOptionExtras, setSelectedOptionExtras] = useState(null);


  const defaultValues6 = {
    extras: null,
    source: null,
    agent: null,
    origin: null,
    AccountManager: null,
    market: null,
    comment: '',
    billingInstructions: '',
    eta: '',
    etd: '',
    resType: null,
    booker: null,
    companyName: null,
    features: null,
    blockCode: '',
    groupName: null,
    doNotMove: '',
    printRate: ''
  }

  const { reset, handleSubmit, control } = useForm({ defaultValues6 })


  // Default source
  useEffect(() => {
    const SourceParams = JSON.stringify({
      rateCodeID: sessionStorage.getItem('rateCodeCorporate'),
      hotelID: 1
    })

    const fetchData = async () => {
      try {
        const response = await fetchx(API_URL + '/getSourceCode', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: SourceParams
        });

        if (response.ok) {
          const data = await response.json();
          const defaultOptionsFromAPI = data['data'];
          setDefaultOptionsSource(defaultOptionsFromAPI);
          if (defaultOptionsFromAPI.length > 0) {
            setSelectedOptionSource(defaultOptionsFromAPI);
          }
        } else { }
      }
      catch (error) { }
    };

    fetchData();
  }, [sessionStorage.getItem('rateCodeCorporate')]);


  // Default market
  useEffect(() => {

    const MarketParams = JSON.stringify({
      rateCodeID: sessionStorage.getItem('rateCodeCorporate'),
      hotelID: 1
    })
    const fetchData = async () => {
      try {
        const response = await fetchx(API_URL + '/getDefaultMarketCode', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: MarketParams
        });

        if (response.ok) {
          const data = await response.json();
          const defaultOptionsFromAPI = data['data'];
          setDefaultOptionsMarket(defaultOptionsFromAPI);
          if (defaultOptionsFromAPI.length > 0) {
            setSelectedOptionMarket(defaultOptionsFromAPI);
          }
        } else { }
      } catch (error) { }
    };

    fetchData();
  }, [sessionStorage.getItem('rateCodeCorporate')]);


  // Default extras
  useEffect(() => {
    const ExtraParams = JSON.stringify({
      rateCodeID: sessionStorage.getItem('rateCodeCorporate'),
      hotelID: 1
    })
    const fetchData = async () => {
      try {
        const response = await fetchx(API_URL + '/getDefaultExtras', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: ExtraParams
        });

        if (response.ok) {
          const data = await response.json();
          const defaultOptionsFromAPI = data['data'];
          setDefaultOptionsExtras(defaultOptionsFromAPI);
          if (defaultOptionsFromAPI.length > 0) {
            setSelectedOptionExtras(defaultOptionsFromAPI);
          }
        } else { }
      } catch (error) { }
    };

    fetchData();
  }, [sessionStorage.getItem('rateCodeCorporate')]);


  //API to get company list
  useEffect(() => {

    fetchx(API_URL + `/getCompanyNames`)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
      })

    fetchx(API_URL + '/getAgentList?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        getAgentList(resp['data'])
      })

    fetchx(API_URL + '/getAllBookerList', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
    }).then(result => result.json())
      .then(resp => {
        getBookerList(resp['data'])
      })

  }, [])


  //ag-grid cell clcked value
  const cellClickedListener = useCallback(event => {
  })


  // Booker selection
  const onBookerSelect = (rowData) => {
    setSelectedBooker(rowData);
    setBasicModal(false);
  };


  // company selection
  const onCompanySelect = (rowData) => {
    setSelectedCompany(rowData);
    setCompanyModal(false);
  };


  // Booker selection
  const onAgentSelect = (rowData) => {
    setSelectedAgent(rowData);
    setAgentModal(false);
  };


  // Ag-grid column of agent
  const [columnDefsAgent] = useState([
    { headerName: 'Agent Name', field: 'accountName', width: 250 },
    { headerName: 'Address', field: 'address', width: 250 },
    {
      headerName: "Action",
      maxWidth: 140,
      cellRenderer: (params) => {
        return (
          <Button
            color='primary'
            onClick={() => onAgentSelect(params.data)}>
            Select
          </Button>
        )
      }
    },
    { headerName: 'Email ID', field: 'email', width: 230 },
  ])


  // Ag-grid column of company
  const [columnDefsCompany] = useState([
    { headerName: 'Company Name', field: 'accountName', width: 300 },
    {
      headerName: "Action",
      maxWidth: 140,
      cellRenderer: (params) => {
        return (
          <Button
            color='primary'
            onClick={() => onCompanySelect(params.data)}>
            Select
          </Button>
        )
      }
    },
    { headerName: 'Company Address', field: 'address', width: 300 },
    { headerName: 'Email ID', field: 'email', width: 300 },
    { headerName: 'Phone Number', field: 'phoneNumber', width: 200 },
    { headerName: 'GSTID', field: 'gstID', width: 300 },
  ])


  // Ag-grid column of booker
  const [columnDefs] = useState([
    { headerName: 'Booker Name', field: 'name', width: 200 },
    { headerName: 'Company Name', field: 'accountName', width: 300 },
    {
      headerName: "Action",
      maxWidth: 140,
      cellRenderer: (params) => {
        return (
          <Button
            color='primary'
            onClick={() => onBookerSelect(params.data)}>
            Select
          </Button>
        )
      }
    },
    { headerName: 'Email ID', field: 'emailID', width: 300 },
    { headerName: 'Booker Address', field: 'address', width: 300 },
  ])


  //on click of new booker profile
  const onclickButton = () => {
    setCompanyProfile(true)
  }


  //on click of new agent profile
  const onclickButton2 = () => {
    setCompanyProfile2(true)
  }


  //on click of new company profile
  const onclickButton3 = () => {
    setCompanyProfile(true)
  }


  // Agent onsubmit modal close
  function toggleModal() {
    fetchx(API_URL + '/getAgentList?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        getAgentList(resp['data'])
      })

    fetchx(API_URL + `/getCompanyNames`)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
      })

    setCompanyProfile(!companyProfile)

  }


  // booker onsubmit modal close
  function toggleModal2() {
    fetchx(API_URL + '/getAllBookerList', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
    }).then(result => result.json())
      .then(resp => {
        getBookerList(resp['data'])
      })

    setCompanyProfile2(!companyProfile2)
  }


  //Search element
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef1.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    )
  }, [])


  //ag-grid column defn
  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ))


  const handleAgentClear = () => {
    setSelectedAgent()
  };


  const handleBookerClear = () => {
    setSelectedBooker()
  };


  const handleCompanyClear = () => {
    setSelectedCompany()
  };


  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked)
  }


  const handleCheckboxChange1 = () => {
    setCheckboxChecked1(!checkboxChecked1)
  }


  //onsubmit data post
  const onSubmit = data => {

    setData(data)
    sessionStorage.setItem('sourceID', (selectedOptionSource.length === undefined ? selectedOptionSource.label : selectedOptionSource[0].label))
    sessionStorage.setItem('marketID', (selectedOptionMarket.length === undefined ? selectedOptionMarket.label : selectedOptionMarket[0].label))
    sessionStorage.setItem('resType', data.resTypeName.label)
    sessionStorage.setItem('Origin', data.originName.label)
    const createmarketGroup = JSON.stringify({
      reservationID: sessionStorage.getItem('reservationid'),
      extraDescription: (selectedOptionExtras == null ? null : selectedOptionExtras),
      source: (selectedOptionSource.length === undefined ? selectedOptionSource.value : selectedOptionSource[0].value),
      agent: (selectedAgent !== undefined ? selectedAgent.companyid : null),
      origin: (data.originName === undefined ? null : data.originName.value),
      AccountManager: (data.AccountManager === undefined ? null : data.AccountManager.value),
      market: (selectedOptionMarket.length === undefined ? selectedOptionMarket.value : selectedOptionMarket[0].value),
      comment: (data.comment1 || ''),
      billingInstructions: (data.billingInstructions || ''),
      ETA: data.eta,
      ETD: data.etd,
      resType: (data.resTypeName === undefined ? null : data.resTypeName.value),
      booker: (selectedBooker !== undefined ? selectedBooker.id : null),
      features: (data.features === undefined ? null : data.features),
      companyName: (selectedCompany !== undefined ? (selectedCompany.companyid || sessionStorage.getItem('companyName')) : null),
      blockCode: data.blockcode,
      groupName: (data.groupname === undefined ? null : data.groupname.value),
      doNotMove: checkboxChecked1,
      printRate: checkboxChecked,
    })

    fetchx(API_URL + "/addTempExtra", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then((res) => {
      onSubmit1();
      // console.log(res)
    })
  }


  //reset button function
  const handleReset = () => {
    reset({
      extras: null,
      source: null,
      agent: null,
      origin: null,
      AccountManager: null,
      market: null,
      comment: '',
      billingInstructions: '',
      eta: '',
      etd: '',
      resType: null,
      booker: null,
      features: null,
      companyName: null,
      blockCode: '',
      groupName: null,
      doNotMove: '',
      printRate: ''
    })
  }



  return (
    <div>


      {/* Agent modal */}
      <Modal isOpen={companyProfile} toggle={() => setCompanyProfile(!companyProfile)} className='modal-xl'>
        <ModalHeader toggle={() => setCompanyProfile(!companyProfile)}>Company Profile</ModalHeader>
        <ModalBody>
          <CompanyProfile toggleModal={toggleModal} />
        </ModalBody>
      </Modal>


      {/* Booker modal */}
      <Modal isOpen={companyProfile2} toggle={() => setCompanyProfile2(!companyProfile2)} className='modal-lg'>
        <ModalHeader toggle={() => setCompanyProfile2(!companyProfile2)}>Booker</ModalHeader>
        <ModalBody>
          <Booker toggleModal2={toggleModal2} />
        </ModalBody>
      </Modal>


      {/* Company modal */}
      <Modal isOpen={companyProfile} toggle={() => setCompanyProfile(!companyProfile)} className='modal-xl'>
        <ModalHeader toggle={() => setCompanyProfile(!companyProfile)}>Company Profile</ModalHeader>
        <ModalBody>
          <CompanyProfile toggleModal={toggleModal} />
        </ModalBody>
      </Modal>


      <Card>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>

              {/* ETA */}
              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='eta'>
                    ETA
                  </Label>
                  <Controller
                    defaultValue='15:00'
                    control={control}
                    id='eta'
                    name='eta'
                    render={({ field }) => <Input type='time' placeholder='Agent' {...field} />}
                  />
                </div>
              </Col>


              {/* ETD */}
              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='etd'>
                    ETD
                  </Label>
                  <Controller
                    defaultValue='12:00'
                    control={control}
                    id='etd'
                    name='etd'
                    render={({ field }) => <Input type='time' placeholder='Agent' {...field} />}
                  />
                </div>
              </Col>


              {/* Reservation Types */}
              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='resTypeName'>
                    Reservation Type<spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    id='resTypeName'
                    control={control}
                    name='resTypeName'
                    render={({ field }) => (
                      <Select
                        required
                        isClearable
                        options={ReservationTypeOptions}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select',)}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>


              {/* Source Options */}
              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='sourceName'>
                    Source <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    id='sourceName'
                    control={control}
                    name='sourceName'
                    render={({ field }) => (
                      <Select
                        required
                        isClearable
                        options={sourceCode}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select')}
                        {...field}
                        value={selectedOptionSource}
                        onChange={(option) => setSelectedOptionSource(option)}

                      />
                    )}
                  />
                </div>
              </Col>


              {/* Market Options */}
              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='marketName'>
                    Market<spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    id='marketName'
                    control={control}
                    name='marketName'
                    render={({ field }) => (
                      <Select
                        isClearable
                        required
                        options={marketCode}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select',)}
                        {...field}
                        value={selectedOptionMarket}
                        onChange={(option) => setSelectedOptionMarket(option)}
                      />
                    )}
                  />
                </div>
              </Col>


              {/* Origin options */}
              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='originName'>
                    Origin <spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    id='originName'
                    control={control}
                    name='originName'
                    render={({ field }) => (
                      <Select
                        isClearable
                        required
                        options={OriginOptions}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select',)}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>


              {/* Extra options */}
              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='extras' >
                    Select Extra
                  </Label>
                  <Controller
                    id='extras'
                    control={control}
                    name='extras'
                    render={({ field }) => (
                      <Select
                        isMulti
                        isClearable
                        options={extraName}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select',)}
                        {...field}
                        value={selectedOptionExtras}
                        onChange={(option) => setSelectedOptionExtras(option)}
                      />
                    )}
                  />
                </div>
              </Col>


              {/* Account Manager */}
              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='AccountManager'>
                    Account Manager
                  </Label>
                  <Controller
                    id='AccountManager'
                    control={control}
                    name='AccountManager'
                    render={({ field }) => (
                      <Select
                        isClearable
                        options={accountManagerList}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select',)}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>


              {/* Agent Options */}
              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='agent'>
                    Agent
                  </Label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>

                    <Input type="text" name='agent' placeholder='Select agent'
                      value={selectedAgent !== undefined ? selectedAgent.accountName : ''}
                      onClick={() => setAgentModal(!agentModal)}
                    />
                    <span
                      style={{
                        color: 'red',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        padding: '0',
                        fontSize: 'inherit',
                        marginLeft: '5px',
                      }}
                      size="sm"
                      onClick={handleAgentClear}
                    >
                      X
                    </span>
                  </div>
                </div>
              </Col>
              {
                agentModal &&
                <div>
                  <Modal isOpen={agentModal} toggle={() => setAgentModal(!agentModal)} className='modal-lg'>
                    <ModalHeader toggle={() => setAgentModal(!agentModal)}>Booker page</ModalHeader>
                    <ModalBody>
                      <div>
                        <Row className='mb-1'>
                          <Col md='3' sm='12' className='me-1'>
                            <Label className='form-label' for='fullName'>
                              Search
                            </Label>
                            <Input
                              type="text"
                              id="filter-text-box"
                              placeholder="Filter..."
                              onInput={onFilterTextBoxChanged}
                            />
                          </Col>
                          <Col md='3' sm='12' className='me-1'>
                            <br></br>
                            <div align='end' >
                              <Button color='primary' onClick={onclickButton}>Add Agent</Button>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="ag-theme-alpine" style={{ height: 520 }}>
                        <AgGridReact
                          ref={gridRef1}
                          rowData={agentList}
                          columnDefs={columnDefsAgent}
                          animateRows={true}
                          onCellClicked={cellClickedListener}
                          paginationPageSize='10'
                          pagination='true'
                          defaultColDef={defaultColDef}
                          headerColor="ddw-primary"
                        />
                      </div>
                    </ModalBody>
                  </Modal>
                </div>
              }


              {/* Group Name */}
              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='groupname'>
                    Group Name
                  </Label>
                  <Controller
                    id='groupname'
                    control={control}
                    name='groupname'
                    render={({ field }) => (
                      <Select
                        isClearable
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select',)}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>


              {/* Features Options */}
              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='features'>
                    Features / Preferences
                  </Label>
                  <Controller
                    id='features'
                    control={control}
                    name='features'
                    render={({ field }) => (
                      <Select
                        isMulti
                        isClearable
                        options={Features}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select',)}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>


              {/* Company Options */}
              {sessionStorage.getItem('AccountName') == null ?
                (
                  <Col md='4' sm='8'>
                    <div className='mb-1'>
                      <Label className='form-label' for='companyName'>
                        Company Name
                      </Label>
                      <div style={{ display: 'flex', alignItems: 'center' }}>

                        <Input type="text" name='companyName' placeholder='Select agent'
                          value={selectedCompany !== undefined ? selectedCompany.accountName : ''}
                          onClick={() => setCompanyModal(!companyModal)}
                        />
                        <span
                          style={{
                            color: 'red',
                            cursor: 'pointer',
                            border: 'none',
                            background: 'none',
                            padding: '0',
                            fontSize: 'inherit',
                            marginLeft: '5px',
                          }}
                          size="sm"
                          onClick={handleCompanyClear}
                        >
                          X
                        </span>
                      </div>
                    </div>
                  </Col>
                ) : (
                  <Col md='4' sm='8'>
                    <div className='mb-1'>
                      <Label className='form-label' for='companyName'>
                        Company Name
                      </Label>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Input type="text" name='companyName' placeholder='Select agent'
                          value={selectedCompany !== undefined ? (selectedCompany.accountName || sessionStorage.getItem('AccountName')) : ''}
                          onClick={() => setCompanyModal(!companyModal)}
                        />
                        <span
                          style={{
                            color: 'red',
                            cursor: 'pointer',
                            border: 'none',
                            background: 'none',
                            padding: '0',
                            fontSize: 'inherit',
                            marginLeft: '5px',
                          }}
                          size="sm"
                          onClick={handleCompanyClear}
                        >
                          X
                        </span>
                      </div>
                    </div>
                  </Col>
                )
              }
              {
                companyModal &&
                <div>
                  <Modal isOpen={companyModal} toggle={() => setCompanyModal(!companyModal)} className='modal-lg'>
                    <ModalHeader toggle={() => setCompanyModal(!companyModal)}>Company Profile page</ModalHeader>
                    <ModalBody>
                      <div>
                        <Row className='mb-1'>
                          <Col md='3' sm='12' className='me-1'>
                            <Label className='form-label' for='fullName'>
                              Search
                            </Label>
                            <Input
                              type="text"
                              id="filter-text-box"
                              placeholder="Filter..."
                              onInput={onFilterTextBoxChanged}
                            />
                          </Col>
                          <Col md='3' sm='12' className='me-1'>
                            <br></br>
                            <div align='end' >
                              <Button color='primary' onClick={onclickButton3}>Add Company</Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="ag-theme-alpine" style={{ height: 520 }}>
                        <AgGridReact
                          ref={gridRef1}
                          rowData={rowData}
                          columnDefs={columnDefsCompany}
                          animateRows={true}
                          onCellClicked={cellClickedListener}
                          paginationPageSize='10'
                          pagination='true'
                          defaultColDef={defaultColDef}
                          headerColor="ddw-primary"
                        />
                      </div>
                    </ModalBody>
                  </Modal>
                </div>
              }


              {/* Comments */}
              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='comment1'>
                    Comment
                  </Label>
                  <Controller
                    control={control}
                    id='comment1'
                    name='comment1'
                    render={({ field }) => <Input type='textarea' placeholder='Enter comments' {...field} />}
                  />
                </div>
              </Col>


              {/* Billing Instructions */}
              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='billingInstructions'>
                    Billing Instructions
                  </Label>
                  <Controller
                    defaultValue=''
                    control={control}
                    id='billingInstructions'
                    name='billingInstructions'
                    render={({ field }) => <Input type='textarea' placeholder='Enter billing instructions' {...field} />}
                  />
                </div>
              </Col>


              {/* Booker Options */}
              {/* <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='booker'>
                    Booker
                  </Label>
                  <Input type="text" name='booker' placeholder='Select booker'
                    value={selectedBooker.name}
                    onClick={() => setBasicModal(!basicModal)}
                  />
                </div>
              </Col> */}

              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='booker'>
                    Booker
                  </Label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Input
                      type="text"
                      name='booker'
                      placeholder='Select booker'
                      value={selectedBooker !== undefined ? selectedBooker.name : ''}
                      onClick={() => setBasicModal(!basicModal)}
                    /> &nbsp;&nbsp;
                    <span
                      style={{
                        color: 'red',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        padding: '0',
                        fontSize: 'inherit',
                        marginLeft: '5px',
                      }}
                      size="sm"
                      onClick={handleBookerClear}
                    >
                      X
                    </span>
                  </div>
                </div>
              </Col>

              {
                basicModal &&
                <div>
                  <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-lg'>
                    <ModalHeader toggle={() => setBasicModal(!basicModal)}>Booker page</ModalHeader>
                    <ModalBody>
                      <div>
                        <Row className='mb-1'>
                          <Col md='3' sm='12' className='me-1'>
                            <Label className='form-label' for='fullName'>
                              Search
                            </Label>
                            <Input
                              type="text"
                              id="filter-text-box"
                              placeholder="Filter..."
                              onInput={onFilterTextBoxChanged}
                            />
                          </Col>
                          <Col md='3' sm='12' className='me-1'>
                            <br></br>
                            <div align='end' >
                              <Button color='primary' onClick={onclickButton2}>Add booker</Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="ag-theme-alpine" style={{ height: 520 }}>
                        <AgGridReact
                          ref={gridRef1}
                          rowData={bookerList}
                          columnDefs={columnDefs}
                          animateRows={true}
                          onCellClicked={cellClickedListener}
                          paginationPageSize='10'
                          pagination='true'
                          defaultColDef={defaultColDef}
                          headerColor="ddw-primary"
                        />
                      </div>
                    </ModalBody>
                  </Modal>
                </div>
              }


              {/* Block Code */}
              <Col md='4' sm='8'>
                <div className='mb-1'>
                  <Label className='form-label' for='blockcode'>
                    Block Code
                  </Label>
                  <Controller
                    control={control}
                    id='blockcode'
                    name='blockcode'
                    render={({ field }) => <Input disabled placeholder='Block Code' {...field} />}
                  />
                </div>
              </Col>


              {/* Do Not Move */}
              <Col md='4' sm='8'>
                <br></br>
                <br></br>

                <div className='form-check form-check-inline'>
                  <Input disabled type='checkbox' id='basic-cb-unchecked' checked={checkboxChecked1}
                    onChange={handleCheckboxChange1} />
                  <Label for='pickUpRequired' className='form-check-label'>
                    Do Not Move
                  </Label>
                </div>
              </Col>


              {/* Print Rate */}
              <Col md='4' sm='8'>
                <br></br>
                <br></br>
                <div className='form-check form-check-inline'>
                  <Input type='checkbox' id='basic-cb-unchecked' checked={checkboxChecked} onChange={handleCheckboxChange} />
                  <Label for='pickUpRequired' className='form-check-label'>
                    Print Rate
                  </Label>
                </div>
              </Col>

            </Row>

            <br></br>
            <br></br>

            <Row>
              {/* On submit buttons */}
              <div align='end'>
                <Button className='me-1' outline color='secondary' type='reset' onClick={handleReset}>
                  Reset
                </Button>
                <Button className='me-1' style={{ align: 'end' }} color='primary' type='submit'>
                  Submit
                </Button>
              </div>

            </Row>

          </Form>
        </CardBody>
      </Card>

    </div>
  )

}


const Payment = ({ onSubmit2 }) => {

  const { setError, formState: { errors } } = useForm()
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
  const [selectionForCheck, setSelectionForCheck] = useState('');
  const [data, setData] = useState(null)


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('hotelID', 1);
  formData.append('source', 4);
  formData.append('doctype', 13);
  formData.append('docrefno', ("res_" + sessionStorage.getItem('reservationid')));


  //Default field values
  const defaultValues8 = {
    paymentTypeID: null,
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    authID: '',
    amount: '',
    transactionID: '',
    attachments: ''
  }


  const { reset, handleSubmit, control } = useForm({ defaultValues8 })


  //Handling the dropdown change regarding payment
  const handleOptionChange = (event) => {
    if (event) {
      sessionStorage.setItem('paymentType', event.label)
      setSelectedOption(event.value);
      setSelectedPaymentOption(event.paymentMode)
      setSelectionForCheck(event.label)
    }
    else {
      setSelectedOption('')
    }
  };

  //Flatpickr value
  const options = {
    minDate: sessionStorage.getItem('checkout'),
  }


  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      html: message.replace(/\n/g, '<br />'),
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }


  const handleWarning = () => {
    return MySwal.fire({
      title: 'Warning!',
      text: 'You have chosen payment type as BTC but not attached any document here, please dont forget to attach it later.',
      icon: 'warning',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    })
  }


  //Final Submit Function
  const onSubmit = data => {
    // console.log(data.expiryDate)
    setData(data)
    if (selectionForCheck == 'Cash' || selectionForCheck == 'BTC') {
      data.cardNumber = ''
      data.cardHolderName = ''
      data.expiryDate = ''
      data.transactionID = ''
      data.authID = ''
      data.amount = 0.00
    }
    if (selectionForCheck == 'ONLINE') {
      data.cardNumber = ''
      data.cardHolderName = ''
      data.expiryDate = ''
      data.authID = ''
      data.amount = 0.00
    }
    if (selectionForCheck == 'AMEX' || selectionForCheck == 'Credit Card') {
      data.transactionID = ''
    }


    if (formData.get('source')) {
      fetchx(API_URL + '/imgupload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
        })
    }

    const createmarketGroup = JSON.stringify({
      reservationID: (sessionStorage.getItem('reservationid') || 100),
      paymentTypeID: selectedOption,
      cardNumber: (data.cardNumber || ''),
      cardHolderName: (data.cardHolderName || ''),
      expiryDate: (data.expiryDate || ''),
      transactionID: (data.transactionID || ''),
      authorizationID: (data.authID || ''),
      amount: (data.amount || 0.00),
      attachments: null,
    })

    const converter = JSON.parse(createmarketGroup)
    sessionStorage.setItem('cardNumber', converter.cardNumber)
    sessionStorage.setItem('cardHolderName', converter.cardHolderName)
    sessionStorage.setItem('expiryDate', converter.expiryDate)
    sessionStorage.setItem('transactionID', converter.transactionID)
    sessionStorage.setItem('authorizationID', converter.authID)
    sessionStorage.setItem('amount', converter.amount)
    setData(createmarketGroup)
    fetchx(API_URL + "/resPaymentType", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then((res) => res.json())
      .then(postres => {
        if (postres.statusCode === 403) {
          return handleError(postres.message)
        }
        if (sessionStorage.getItem('paymentType') === 'BTC' && (selectedFile === null || selectedFile === undefined)) {
          handleWarning()
        }
        onSubmit2()
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  const handleReset = () => {
    reset({
      paymentTypeID: null,
      cardNumber: '',
      cardHolderName: '',
      expiryDate: '',
      authID: '',
      amount: '',
      transactionID: '',
      attachments: ''
    })
  }


  return (
    <div>
      <Card>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>

            {/* payment type selection */}
            <Row>
              <Col md='4' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='paymentType' >
                    Select Payment Type <spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    id='paymentType'
                    control={control}
                    name='paymentType'
                    render={({ field }) => (
                      <Select
                        required
                        isClearable
                        {...field}
                        options={paymentName}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select')}
                        onChange={handleOptionChange}
                      />
                    )}
                  />
                </div>
              </Col>


              <Col md='6' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='attachments'>
                    Reservation Attachments
                  </Label>
                  <Controller
                    defaultValue=''
                    control={control}
                    id='attachments'
                    name='attachments'
                    render={({ field }) => <Input type='file' placeholder='attachments'
                      onChange={handleFileChange}
                    />
                    }
                  />
                </div>
              </Col>
            </Row>

            {/* Selection Based on credit card and Amex Card */}
            <Row>
              {selectedPaymentOption === 2 && (
                <div>
                  <Row>
                    <Col md='4' sm='12' className='mb-1'>
                      <div className='mb-1'>
                        <Label className='form-label' for='cardNumber'>
                          Card Number
                        </Label>
                        <Controller
                          defaultValue=''
                          control={control}
                          id='cardNumber'
                          name='cardNumber'
                          render={({ field }) =>
                            <Input placeholder='Card Number'
                              minLength={15}
                              maxLength={16}
                              pattern='[0-9_]+'
                              title="Card Number should not contain alphabets and special characters."
                              invalid={errors.cardNumber && true} {...field}
                            />}
                        />
                      </div>
                    </Col>
                    <Col md='4' sm='12' className='mb-1'>
                      <div className='mb-1'>
                        <Label className='form-label' for='cardHolderName'>
                          Card Holder Name
                        </Label>
                        <Controller
                          defaultValue=''
                          control={control}
                          id='cardHolderName'
                          name='cardHolderName'
                          render={({ field }) =>
                            <Input
                              placeholder='Card Holder Name'
                              minLength={3}
                              maxLength={30}
                              pattern='^[A-Za-z. ]+$'
                              title="Card Holder Name should contain alphabets, spaces, and periods. Cannot contain numbers and other special characters."
                              {...field}
                            />
                          }
                        />
                      </div>
                    </Col>
                    <Col md='4' sm='12' className='mb-1'>
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
                              options={{
                                dateFormat: 'Y-m', // Format for the input's value, Year and Month
                                // noCalendar: true, // Disable the calendar
                              }}
                              placeholder='YYYY-MM'
                              className={classnames('form-control')}
                            />
                          )}
                        />
                      </div>
                    </Col>
                    <Col md='4' sm='12' className='mb-1'>
                      <div className='mb-1'>
                        <Label className='form-label' for='authID'>
                          Autorization ID
                        </Label>
                        <Controller
                          defaultValue=''
                          control={control}
                          id='authID'
                          name='authID'
                          render={({ field }) => <Input placeholder='Autorization ID'
                            // pattern='[0-9_]{1,17}'
                            // title="Card Number should not contain alphabets and special characters." 
                            {...field} />}
                        />
                      </div>
                    </Col>
                    <Col md='4' sm='12' className='mb-1'>
                      <div className='mb-1'>
                        <Label className='form-label' for='amount'>
                          Amount
                        </Label>
                        <Controller
                          defaultValue=''
                          control={control}
                          id='amount'
                          name='amount'
                          render={({ field }) => <Input placeholder='Amount'
                            // pattern='[0-9_]{1,17}'
                            // title="Card Number should not contain alphabets and special characters." 
                            {...field} />}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>)}
            </Row>

            {/* Selection based on Online payment */}
            <Row>
              {selectedPaymentOption === 3 && (
                <div>
                  <Row>
                    <Col md='4' sm='12' className='mb-1'>
                      <div className='mb-1'>
                        <Label className='form-label' for='transactionID'>
                          Transaction ID
                        </Label>
                        <Controller
                          defaultValue=''
                          control={control}
                          id='transactionID'
                          name='transactionID'
                          render={({ field }) => <Input placeholder='Transaction ID'
                            {...field} />}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>)}
            </Row>


            <br></br>
            {/* submit button */}
            <div align='end'>
              <Button className='me-1' outline color='secondary' type='reset' onClick={handleReset} style={{ align: 'end' }}>
                Reset
              </Button>
              <Button className='me-1' color='primary' type='submit'>
                Submit
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  )

}


const PickUpDetails = () => {

  const defaultValues9 = {
    pickUpDate: '',
    pickUpTime: '',
    pickUpStationCode: '',
    pickUpCarrierCode: '',
    pickUpTransportType: null,
    pickUpRemarks: '',

    dropDate: '',
    dropTime: '',
    dropStationCode: '',
    dropCarrierCode: '',
    dropTransportType: null,
    dropRemarks: ''
  }

  const { setError, formState: { errors } } = useForm()
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues9 })
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [checkboxChecked1, setCheckboxChecked1] = useState(false)

  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked)
  }

  const handleCheckboxChange1 = () => {
    setCheckboxChecked1(!checkboxChecked1)
  }


  //Flatpicker 
  const today = Moment().format('YYYY-MM-DD')
  const pickUpDate = watch('pickUpDate');

  const options = {
    minDate: sessionStorage.getItem('checkIn'),
    maxDate: sessionStorage.getItem('checkout')
  }


  const options1 = {
    minDate: sessionStorage.getItem('checkIn'),
    maxDate: sessionStorage.getItem('checkout')
  }


  const onSubmit = data => {
    // console.log(data)
    if (data.pickUpDate) {
      sessionStorage.setItem('pickupDate', Moment(String(new Date(data.pickUpDate[0]))).format('YYYY-MM-DD'))
    }
    if (data.dropDate) {
      sessionStorage.setItem('dropDate', Moment(String(new Date(data.dropDate[0]))).format('YYYY-MM-DD'))
    }
    if (data.pickUpTime) {
      sessionStorage.setItem('pickupTime', data.pickUpTime)
    }
    if (data.dropTime) {
      sessionStorage.setItem('dropTime', data.dropTime)
    }
    if (data.pickUpTransportType) {
      sessionStorage.setItem('pickupTransportType', data.pickUpTransportType.label)
    }
    if (data.dropTransportType) {
      sessionStorage.setItem('dropTransport', data.dropTransportType.label)
    }


    const createmarketGroup = JSON.stringify({
      reservationID: sessionStorage.getItem('reservationid'),
      pickUpDate: data.pickUpDate,
      pickUpTime: data.pickUpTime,
      pickUpStationCode: data.pickUpStationCode,
      pickUpCarrierCode: data.pickUpCarrierCode,
      pickUpTransportType: data.pickUpTransportType === undefined ? null : data.pickUpTransportType.value,
      pickUpRemarks: data.pickUpRemarks,
      dropDate: data.dropDate,
      dropTime: data.dropTime,
      dropStationCode: data.dropStationCode,
      dropCarrierCode: data.dropCarrierCode,
      dropTransportType: data.dropTransportType === undefined ? null : data.dropTransportType.value,
      dropRemarks: data.dropRemarks,
    })

    // console.log(createmarketGroup)
    const converter = JSON.parse(createmarketGroup)
    sessionStorage.setItem('pickupLocation', converter.pickUpStationCode)
    sessionStorage.setItem('dropLocation', converter.dropStationCode)
    sessionStorage.setItem('pickupRemarks', converter.pickUpRemarks)
    sessionStorage.setItem('dropRemarks', converter.dropRemarks)
    const res = fetchx(API_URL + "/pickUp", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then((res) => {
      // console.log(res)
    })
  }


  const handleReset = () => {
    reset({
      // pickUpRequired: null,
      pickUpDate: '',
      pickUpTime: '',
      pickUpStationCode: '',
      pickUpCarrierCode: '',
      pickUpTransportType: null,
      pickUpRemarks: '',

      // dropRequired: null,
      dropDate: '',
      dropTime: '',
      dropStationCode: '',
      dropCarrierCode: '',
      dropTransportType: null,
      dropRemarks: ''
    })
  }


  return (
    <div>
      <Card>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>

            {/* Pickup Details */}
            <Row>
              <Col md='4' sm='12'>
                <div className='form-check form-check-inline'>
                  <Input type='checkbox' id='basic-cb-unchecked' checked={checkboxChecked} onChange={handleCheckboxChange} />
                  <Label for='pickUpRequired' className='form-check-label'>
                    Pickup Required
                  </Label>
                </div>
              </Col>

              {checkboxChecked && (
                <Row>
                  <Col md='4' sm='12' className='mb-1'>
                    <div className='mb-1'>
                      <Label className='form-label' for='pickUpDate'>
                        PickUp Date <spam style={{ color: 'red' }}>*</spam>
                      </Label>
                      <Controller
                        control={control}
                        id='pickUpDate'
                        name='pickUpDate'
                        render={({ field }) => (
                          <Flatpickr
                            // defaultValue=''
                            required
                            {...field}
                            options={options}
                            placeholder='YYYY-MM-DD '
                            className={classnames('form-control')}
                          />
                        )}
                      />
                    </div>
                  </Col>
                  <Col md='4' sm='12' className='mb-1'>
                    <div className="mb-1">
                      <Label className="form-label" for="pickUpTime">
                        PickUp Time <spam style={{ color: 'red' }}>*</spam>
                      </Label>
                      <Controller
                        defaultValue=''
                        control={control}
                        id='pickUpTime'
                        name='pickUpTime'
                        render={({ field }) => <Input required
                          placeholder='pickUpTime'
                          type='time'
                          {...field} />}
                      />
                    </div>
                  </Col>
                  <Col md='4' sm='12' className='mb-1'>
                    <div className="mb-1">
                      <Label className="form-label" for="pickUpStationCode">
                        PickUp Locaton
                      </Label>
                      <Controller
                        defaultValue="Airport"
                        control={control}
                        id='pickUpStationCode'
                        name='pickUpStationCode'
                        render={({ field }) => <Input placeholder='StationCode'
                          {...field} />}
                      />
                    </div>
                  </Col>
                  <Col md='4' sm='12' className='mb-1'>
                    <div className="mb-1">
                      <Label className="form-label" for="pickUpCarrierCode">
                        Carrier Code
                      </Label>
                      <Controller
                        defaultValue=''
                        control={control}
                        id='pickUpCarrierCode'
                        name='pickUpCarrierCode'
                        render={({ field }) => <Input placeholder='Carrier  Code'

                          {...field} />}
                      />
                    </div>
                  </Col>

                  <Col md='4' sm='8'>
                    <div className='mb-1'>
                      <Label className='form-label' for='pickUpTransportType' >
                        Transport Type <spam style={{ color: 'red' }}>*</spam>
                      </Label>
                      <Controller
                        id='pickUpTransportType'
                        required
                        control={control}
                        name='pickUpTransportType'
                        render={({ field }) => (
                          <Select
                            defaultValue=''
                            isClearable
                            required
                            options={TransportType}
                            classNamePrefix='select'
                            theme={selectThemeColors}
                            className={classnames('react-select')}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </Col>

                  <Col md='4' sm='12' className='mb-1'>
                    <div className="mb-1">
                      <Label className="form-label" for="pickUpRemarks">
                        Remarks
                      </Label>
                      <Controller
                        defaultValue=''
                        control={control}
                        id='pickUpRemarks'
                        name='pickUpRemarks'
                        render={({ field }) => <Input placeholder='Remarks'
                          {...field} />}
                      />
                    </div>
                  </Col>
                </Row>
              )}
            </Row>

            <br></br>

            {/* Drop Details */}
            <Row>
              <Col md='4' sm='12'>
                <div className='form-check form-check-inline'>
                  <Input type='checkbox' id='basic-cb-unchecked' checked={checkboxChecked1} onChange={handleCheckboxChange1} />
                  <Label for='dropRequired' className='form-check-label'>
                    Drop  Required
                  </Label>
                </div>
              </Col>
              {checkboxChecked1 && (
                <Row>
                  <Col md='4' sm='12' className='mb-1'>
                    <div className='mb-1'>
                      <Label className='form-label' for='dropDate'>
                        Drop Date <spam style={{ color: 'red' }}>*</spam>
                      </Label>
                      <Controller
                        control={control}
                        id='dropDate'
                        name='dropDate'
                        render={({ field }) => (
                          <Flatpickr
                            // defaultValue=''
                            {...field}
                            required
                            options={options1}
                            placeholder='YYYY-MM-DD '
                            className={classnames('form-control')}
                          />
                        )}
                      />
                    </div>
                  </Col>
                  <Col md='4' sm='12' className='mb-1'>
                    <div className="mb-1">
                      <Label className="form-label" for="dropTime">
                        Drop Time <spam style={{ color: 'red' }}>*</spam>
                      </Label>
                      <Controller
                        defaultValue=''
                        control={control}
                        id='dropTime'
                        name='dropTime'
                        render={({ field }) => <Input
                          required
                          placeholder='dropTime'
                          type='time'
                          {...field} />}
                      />
                    </div>
                  </Col>
                  <Col md='4' sm='12' className='mb-1'>
                    <div className="mb-1">
                      <Label className="form-label" for="dropStationCode">
                        Drop Locaton
                      </Label>
                      <Controller
                        defaultValue=''
                        control={control}
                        id='dropStationCode'
                        name='dropStationCode'
                        render={({ field }) => <Input placeholder='Drop Location'
                          {...field} />}
                      />
                    </div>
                  </Col>
                  <Col md='4' sm='12' className='mb-1'>
                    <div className="mb-1">
                      <Label className="form-label" for="dropCarrierCode">
                        Carrier Code
                      </Label>
                      <Controller
                        defaultValue=''
                        control={control}
                        id='dropCarrierCode'
                        name='dropCarrierCode'
                        render={({ field }) => <Input placeholder='Carrier Code'
                          {...field} />}
                      />
                    </div>
                  </Col>
                  <Col md='4' sm='8' className='mb-1'>
                    <div className='mb-1'>
                      <Label className='form-label' for='dropTransportType' >
                        Transport Type <spam style={{ color: 'red' }}>*</spam>
                      </Label>
                      <Controller
                        id='dropTransportType'
                        control={control}
                        name='dropTransportType'
                        render={({ field }) => (
                          <Select
                            defaultValue=''
                            isClearable
                            required
                            options={TransportType}
                            classNamePrefix='select'
                            theme={selectThemeColors}
                            className={classnames('react-select')}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </Col>
                  <Col md='4' sm='12' className='mb-1'>
                    <div className="mb-1">
                      <Label className="form-label" for="dropRemarks">
                        Remarks
                      </Label>
                      <Controller
                        defaultValue=''
                        control={control}
                        id='dropRemarks'
                        name='dropRemarks'
                        render={({ field }) => <Input placeholder='Remarks'
                          {...field} />}
                      />
                    </div>
                  </Col>
                </Row>
              )}
            </Row>

            <br></br><br></br>

            <div align='end'>
              {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
              <Button className='me-1' outline color='secondary' type='reset' onClick={handleReset}>
                Reset
              </Button>
              <Button className='me-1' color='primary' type='submit' style={{ align: 'end' }}>
                Submit
              </Button>
            </div>


          </Form>
        </CardBody>
      </Card>
    </div>
  )

}


const AccordionUncontrolled = () => {
  const gridRef = useRef()
  const gridRefs = useRef()
  const navigate = useNavigate()
  const [rowData1, setRowData1] = useState()
  const [open, setOpen] = useState('1')
  const [show, actionButton] = useState(false)
  const [basicModal, setBasicModal] = useState(false)
  const [guestProfileModal, setGuestProfileModal] = useState(false)
  const [data, setData] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { reset1, handleSubmit, control, watch, getValues } = useForm({ defaultValues })
  const [rowData, setRowData] = useState()
  const [assign, setAssign] = useState(false)
  const [filldata, setfilldata] = useState('')
  const [Rate2, setRate2] = useState()
  const [ChildrenCheck, setChildrenCheck] = useState(false)
  const [Rate3, setRate3] = useState()
  const [toggleCount, setToggleCount] = useState(false)
  const [rowData4, setRowData4] = useState()
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
  const [showAdditionalOptions1, setShowAdditionalOptions1] = useState(false);
  const [showAdditionalOptions2, setShowAdditionalOptions2] = useState(false);
  const [buttonSelect, setButtonSelect] = useState();
  const [typeOfButton, settypeOfButton] = useState();
  const [arrivalDate, setArrivalDate] = useState();
  const [departureDate, setDepartureDate] = useState()
  const [guestHistory, setOpenGuestHistory] = useState();
  const [openManualPriceModal, setOpenManualPriceModal] = useState(false)
  const [confirmSubmit, setConfirmSubmit] = useState(false)

  const [rate, setRate] = useState('');
  const [showButtons, setShowButtons] = useState(false);

  //on button click select
  const actionButton1 = (rowval) => {
    dailyCheck = 1;
    sessionStorage.setItem('packageCode', rowval['data']['packageCode'])
    sessionStorage.setItem('rateCodeCorporate', rowval['data']['rateCodeID'])
    const createmarketGroup = JSON.stringify({
      hotelID: 1,
      reservationID: sessionStorage.getItem('reservationid'),
      ratecode: rowval['data']['rateCodeID'],
      checkIn: sessionStorage.getItem('checkIn'),
      checkOut: sessionStorage.getItem('checkout'),
      adults: sessionStorage.getItem('adults'),
      children: sessionStorage.getItem('children'),
      roomtypeid: rowval['data']['roomTypeID'],
      packageID: rowval['data']['packageID']
    })

    fetchx(API_URL + "/addstorerateCodeSelection", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then((res) => {
      fetchx(API_URL + `/showdetails?reservationID=${sessionStorage.getItem('reservationid')}`)
        .then(result => result.json())
        .then(rowData => {
          setRowData4(rowData['data'])
        })
    })
    setOpen('4')
  }


  const manualPriceFunction = (rowval) => {
    console.log(rowval)
    const manualPrice = getValues('manualPrice'); // Retrieve the manual price value
    console.log(manualPrice)
    rowval = rowval[0]
    dailyCheck = 1;
    sessionStorage.setItem('packageCode', rowval['packageCode'])
    sessionStorage.setItem('rateCodeCorporate', rowval['rateCodeID'])
    const createmarketGroup = JSON.stringify({
      hotelID: 1,
      reservationID: sessionStorage.getItem('reservationid'),
      ratecode: rowval['rateCodeID'],
      checkIn: sessionStorage.getItem('checkIn'),
      checkOut: sessionStorage.getItem('checkout'),
      adults: sessionStorage.getItem('adults'),
      children: sessionStorage.getItem('children'),
      roomtypeid: rowval['roomTypeID'],
      packageID: rowval['packageID'],
      isManual: 1,
      manualPrice: parseInt(manualPrice),
    })

    console.log(createmarketGroup)
    fetchx(API_URL + "/addstorerateCodeSelection", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then((res) => res.json())
      .then((res) => {
        if (res.statusCode === 200) {
          setOpenManualPriceModal(false)
          setConfirmSubmit(false)
          // fetchx(API_URL + `/showdetails?reservationID=${sessionStorage.getItem('reservationid')}`)
          //   .then(result => result.json())
          //   .then(rowData => {
          //     if (rowData.statusCode === 200) {

          //       setRowData4(rowData['data'])
          //     }
          //   })

          setTimeout(() => {
            fetchx(API_URL + `/showdetails?reservationID=${sessionStorage.getItem('reservationid')}`)
              .then((result) => result.json())
              .then((rowData) => {
                if (rowData.statusCode === 200) {
                  setRowData4(rowData['data']);
                }
              });
          }, 500); // Wait for 1 second before making the second call
        }

      })
    // setOpen('4')
  }


  const openGuestModal = (rowval) => {
    setAssign(!assign)
  }


  useEffect(() => {
    if (dailyCheck === 1) {
      fetchx(API_URL + `/showdetails?reservationID=${sessionStorage.getItem('reservationid')}`)
        .then(result => result.json())
        .then(rowData => {
          setRowData4(rowData['data'])
          dailyCheck = 0;
        })
    }
  }, [dailyCheck]);



  //ag-grid for rate select
  const [columnDefs1, setColumnDefs1] = useState([
    { headerName: 'RateCode', field: 'rateCode', suppressSizeToFit: true, maxWidth: 115 },
    { headerName: 'RoomType', field: 'roomType', suppressSizeToFit: true, maxWidth: 120 },
    {
      headerName: 'BaseRate', field: 'baseprice', suppressSizeToFit: true, maxWidth: 115, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    { headerName: 'Availability', field: 'numAvlRooms', suppressSizeToFit: true, maxWidth: 120 },
    // { headerName: 'Total(InclPKG)', field: 'fulltotal', suppressSizeToFit: true, maxWidth: 145 },
    {
      headerName: 'Breakup',
      field: 'numAvlRooms',
      suppressSizeToFit: true,
      maxWidth: 125,
      cellStyle: { "text-align": "center" },
      cellRendererFramework: (params) => <Button className='me-1' color='secondary' onClick={() => handleClick(params)}>Breakup </Button>
    },
    {
      headerName: 'Action',
      field: 'numAvlRooms',
      suppressSizeToFit: true,
      maxWidth: 125,
      cellRendererFramework: (params) => <Button color='primary' onClick={() => actionButton1(params)}> Select </Button>
    },
    { headerName: 'PKGCode', field: 'packageCode', suppressSizeToFit: true, maxWidth: 105 },
    {
      headerName: 'ExtraAdultPrice', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 150, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'ChildPrice', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 150, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },

  ])


  //daily details ag-grid
  const [columnDefs3, setColumnDefs3] = useState([
    { headerName: 'Date', field: 'inventory_date', suppressSizeToFit: true, maxWidth: 110 },
    { headerName: 'RateCode', field: 'rateCode', suppressSizeToFit: true, maxWidth: 120 },
    { headerName: 'RoomType', field: 'roomType', suppressSizeToFit: true, maxWidth: 120 },
    { headerName: 'Package', field: 'packageCode', suppressSizeToFit: true, maxWidth: 120, filter: 'agSetColumnFilter' },
    {
      headerName: 'TotalBeforeDiscount', field: 'totalBeforeDiscount', suppressSizeToFit: true, maxWidth: 190, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Discount/Upsell', field: 'totalDiscount', suppressSizeToFit: true, maxWidth: 180, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'TotalAfterDiscount', field: 'total', suppressSizeToFit: true, maxWidth: 180, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'BaseRate', field: 'baseprice', suppressSizeToFit: true, maxWidth: 140, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'ExtraAdultPrice', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 140, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'ChildPrice', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 140, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'PackageRate', field: 'packageRate', suppressSizeToFit: true, maxWidth: 140, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
  ])


  //Main radio Button
  const handleRadioChange = (event) => {
    setButtonSelect(event.target.value);
    sessionStorage.setItem('radioButton', event.target.value)
    setShowAdditionalOptions(true)
  };


  //percentage Radio Button
  const handleRadioChange1 = (event) => {
    settypeOfButton(event.target.value)
    setShowAdditionalOptions2(false);
    setShowAdditionalOptions1(true);
  };


  const openNextAccordion = () => {
    setOpen('5');
  };

  const openNextAccordion2 = () => {
    setOpen('7');
  };



  //amount Radio Button
  const handleRadioChange2 = (event) => {
    settypeOfButton(event.target.value)
    setShowAdditionalOptions2(true);
    setShowAdditionalOptions1(false);

  };


  //ag-grid column definition
  const defaultColDef1 = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ))


  //arrival details submit options
  const onSubmit = data => {
    setData(data)
    {
      let adultCount = data.adultCount.value;
      let childCount = data.childCount.value;
      let count = 3;
      if (data.adultCount.label === '3') {
        count = 3;
      }
      if (data.adultCount.label === '2') {
        count = 4
      }
      let totalCount = Number(adultCount) + Number(childCount);
      if (totalCount > count) {
        setToggleCount(false)
        let message = '<b>You have Exceeded PAX Count. \n Please Select adults or children properly. </b> \n (You can select maximum 2 adults and 2 children or maximum 3 adults)'
        handleError(message)
      }
      else {
        setToggleCount(true)
        setChildrenCheck(false)
        const createmarketGroup = JSON.stringify({
          hotelID: 1,
          reservationID: sessionStorage.getItem('reservationid'),
          source: sessionStorage.getItem('source'),
          companyID: sessionStorage.getItem('companyName'),
          checkIn: (Moment(String(new Date(data.coming))).format('YYYY-MM-DD')),
          checkOut: (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')),
          adults: data.adultCount.value,
          children: data.childCount.value,
          quantity: data.roomQuantity.value,
          rateCodeIDs: sessionStorage.getItem('rateCodeIDs')
        })
        const next = JSON.parse(createmarketGroup)
        sessionStorage.setItem('checkIn', next['checkIn'])
        sessionStorage.setItem('checkout', next['checkOut'])
        sessionStorage.setItem('adults', next['adults'])
        sessionStorage.setItem('children', next['children'])
        sessionStorage.setItem('quantity', next['quantity'])


        if (sessionStorage.getItem('source') === '1') {
          const createmarketGroup2 = JSON.stringify({
            hotelID: 1,
            reservationID: sessionStorage.getItem('reservationid'),
            source: sessionStorage.getItem('source'),
            companyID: sessionStorage.getItem('companyName'),
            checkIn: (Moment(String(new Date(data.coming))).format('YYYY-MM-DD')),
            checkOut: (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')),
            adults: data.adultCount.value,
            children: data.childCount.value,
            quantity: data.roomQuantity.value,
          })
          fetchx(API_URL + "/getRateCodeSelectionfit", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: createmarketGroup2
          }).then((res) => res.json())
            .then(postres => {
              setRate3(postres['data'])
            })
        }

        else {
          fetchx(API_URL + '/add_bookinfo_reservation', {
            method: 'POST',
            body: createmarketGroup,
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            }
          })
            .then((res) => res.json())
            .then(postres => {
              sessionStorage.setItem('marketcode', postres['data'][0]['marketCode'])
              sessionStorage.setItem('sourcecode', postres['data'][0]['sourceCode'])
              sessionStorage.setItem('ratecode', postres['data'][0]['rateCodeID'])
              sessionStorage.setItem('package', postres['data'][0]['packageCode'])
              setRowData1(postres['data'])
            })
            .catch((err) => {
              console.log(err.message)
            })

          const getFitRates = JSON.stringify({
            hotelID: 1,
            reservationID: sessionStorage.getItem('reservationid'),
            source: sessionStorage.getItem('source'),
            companyID: sessionStorage.getItem('companyName'),
            checkIn: (Moment(String(new Date(data.coming))).format('YYYY-MM-DD')),
            checkOut: (Moment(String(new Date(data.departure))).format('YYYY-MM-DD')),
            adults: data.adultCount.value,
            children: data.childCount.value,
            quantity: data.roomQuantity.value,
          })

          fetchx(API_URL + "/showFitRates", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: getFitRates
          }).then((res) => res.json())
            .then(postres => {
              setRate3(postres['data'])
            })

        }
      }
    }
    setIsSubmitted(true)
  }


  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setRate(inputValue);
    setShowButtons(inputValue.trim() !== '');
  };


  //Discount/Upsell submit
  const onSubmit1 = data => {

    sessionStorage.setItem('radioType', typeOfButton)
    sessionStorage.setItem('amounts', rate)

    const getNewRates = JSON.stringify({
      hotelID: 1,
      reservationID: sessionStorage.getItem('reservationid'),
      buttonType: buttonSelect,
      typeOfButton: typeOfButton,
      rate: rate
    })

    fetchx(API_URL + "/getUpdatedRateOfReservation", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: getNewRates
    }).then((res) => res.json())
      .then(postres => {
        if (postres.statusCode == 200) {
          if (typeof (postres['data']) === 'string') {
            handleError(postres['data'])
          }
          else {
            fetchx(API_URL + `/showdetails?reservationID=${sessionStorage.getItem('reservationid')}`)
              .then(result => result.json())
              .then(rowData => {
                setRowData4(rowData['data'])
              })
          }
        }
      })
  }


  //on click of breakup card show
  const handleClick = (event) => {

    const rateCodeID = JSON.stringify({
      ratecode: event['data']['rateCodeID'],
    })

    fetchx(API_URL + "/checkForFit", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: rateCodeID
    }).then((res) => res.json())
      .then(postres => {
        if (postres['data'].length >= 1) {
          const createmarketGroup = JSON.stringify({
            hotelID: 1,
            ratecode: event['data']['rateCodeID'],
            reservationID: sessionStorage.getItem('reservationid'),
            checkIn: sessionStorage.getItem('checkIn'),
            checkOut: sessionStorage.getItem('checkout'),
            adults: sessionStorage.getItem('adults'),
            children: sessionStorage.getItem('children'),
            roomtypeid: event['data']['roomTypeID']
          })
          fetchx(API_URL + "/rateCheckFit", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: createmarketGroup
          }).then((res) => res.json())
            .then(postres => {
              // console.log(postres['data'])
              setRate2(postres['data'])
            })
        }
        else {
          const createmarketGroup = JSON.stringify({
            hotelID: 1,
            ratecode: event['data']['rateCodeID'],
            checkIn: sessionStorage.getItem('checkIn'),
            checkOut: sessionStorage.getItem('checkout'),
            adults: sessionStorage.getItem('adults'),
            children: sessionStorage.getItem('children'),
            roomtypeid: event['data']['roomTypeID'],
            reservationID: sessionStorage.getItem('reservationid'),
            packageID: event['data']['packageID'],
          })
          fetchx(API_URL + "/rateCheck", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: createmarketGroup
          }).then((res) => res.json())
            .then(postres => {
              setRate2(postres['data'])
            })
        }
      })
    actionButton(true)
  }


  //cell click listener
  const cellClickedListener1 = useCallback(event => {
    // console.log('cellClicked', event)
    // console.log(typeof (sessionStorage.getItem('source')))
  }, [])


  //Reset button
  const handleReset1 = () => {
    window.location.reload()
  }


  //Accordian toggle button
  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }


  //Guest Profile search ag-grid Button
  const [columnDefs] = useState([
    {
      headerName: 'Guest Name',
      suppressSizeToFit: true,
      width: 280,
      valueGetter: function (params) {
        const salutation = params.data.s;
        const firstName = params.data.f;
        const lastName = params.data.l;
        const fullName = salutation ? `${salutation} ${firstName} ${lastName}` : `${firstName} ${lastName}`;
        return fullName;
      },
    },
    { headerName: 'Company', field: 'c', suppressSizeToFit: true, width: 250 },
    { headerName: 'Email ID', field: 'e', suppressSizeToFit: true, width: 220 },
    { headerName: 'No. Of Stays', field: 'stays', suppressSizeToFit: true, width: 100, cellClass: "center-cell" },

    {
      // headerName: "Action",
      maxWidth: 115,
      cellRenderer: () => {
        return (<Button required color='primary' onClick={() => setOpen('2')} >Proceed</Button>)
      }
    },
    {
      maxWidth: 140,
      cellRendererFramework: (params) => <Button color='primary' onClick={() => openGuestModal(params)}> View Profile </Button>
    },
    {
      cellRendererFramework: (params) => <Button color='primary' onClick={() => { setOpenGuestHistory(params.data) }}> Guest History </Button>,
      maxWidth: 140

    },
    { headerName: 'No. Of Nights', field: 'nights', suppressSizeToFit: true, width: 100, cellClass: "center-cell" },

  ])


  //Ag-grid column of break-up button
  const [columnDefs2] = useState([
    { headerName: 'Date', field: 'inventory_date', maxWidth: 128 },
    { headerName: 'RateCode', field: 'rateCode', suppressSizeToFit: true, maxWidth: 125 },
    { headerName: 'RoomType', field: 'roomType', suppressSizeToFit: true, maxWidth: 125 },
    { headerName: 'Package', field: 'packageCode', suppressSizeToFit: true, maxWidth: 125 },
    {
      headerName: 'BaseRate', field: 'baseprice', maxWidth: 125, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'PackageRate', field: 'packageRate', suppressSizeToFit: true, maxWidth: 140, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'ExtraAdultPrice', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 150, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'ChildrenPrice', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 140, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Total(InclPKG)', field: 'total', suppressSizeToFit: true, maxWidth: 150, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
  ])


  //AG-GRID default column defn
  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      wrapHeaderText: true,

      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ))


  //ag-grid cell clcked value
  const cellClickedListener = useCallback(event => {
    fetchx(API_URL + `/getAllGuestDetails?guestID=${event['data'].id}`)
      .then(result => result.json())
      .then(rowData => {
        setfilldata(rowData['data'][0])
      })
    sessionStorage.setItem('CompanyNameID', event['data']['accountName'])
    sessionStorage.setItem('guestProfileID', event['data']['id'])
    sessionStorage.setItem('companyID', event['data']['companyID'])
  })


  //API to get all the guests
  useEffect(() => {
    ReactDOM.render(<CardData />, document.getElementById("displayCard"))
    fetchx(API_URL + `/getGuestList`)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
      })

    const hotelID = JSON.stringify({
      hotelID: 1
    })
    fetchx(API_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelID
    }).then((res) => res.json())
      .then(postres => {
        const today = new Date(postres['data'][0]['businessDate']);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        setDepartureDate(tomorrow)
        setArrivalDate((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
      })

    // fetchx(API_URL + '/getNumberOfRoomsOptions?hotelID=1')
    //   .then(result => result.json())
    //   .then(resp => {
    //     setRoomsOptions(resp['data'])
    //     console.log(colourOptions1)
    //   })

  }, [])


  const onFilterTextBoxChanged1 = useCallback(() => {
    gridRefs.current.api.setQuickFilter(
      document.getElementById('filter-text-box1').value
    )
  }, [])


  //Flatpicker 
  const today = Moment().format('YYYY-MM-DD ')
  const checkIn = watch('coming');


  function toggleModal() {
    setBasicModal(!basicModal)
  }

  function checkFunction() {

    let checkDailyDetails = JSON.stringify({
      reservationID: sessionStorage.getItem('reservationid'),
    })
    //   fetchx(API_URL + "/updateRoomStatusInNightAudit", {
    fetchx(API_URL + "/checkBookingInfoPresentEachDay", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: checkDailyDetails
    }).then(result => result.json())
      .then(rowData => {
        if (rowData.statusCode === 200) {
          toggleModal()
        }
        else {
          handleErrorCheck(rowData['message'])
        }
      })
  }


  //Flatpickr date
  const options = {
    minDate: arrivalDate
  }


  //Flatpickr date
  const optionsToDate = {
    minDate: (checkIn === null ? arrivalDate : (Moment(String(new Date(checkIn))).format('YYYY-MM-DD'))) // Set the minimum date as fromDate or today if fromDate is not selected
  };


  //on click of new guest navigate
  const onclickButton = () => {
    setGuestProfileModal(true)
  }


  //On daily details proceed click
  const openNextAccordian = () => {
    setOpen('6')
  }


  // Horizontal line styling
  const horizontalLineStyle = {
    borderBottom: '0.1px dashed #000',
    margin: '10px 0',
  };


  //Guest details Crad update function
  function CardData() {
    return (
      <div>
        <br></br>


        {/* Guest details */}
        <b><h3>Guest Information</h3></b>
        <b> <small>Name :</small>  </b>&nbsp; {filldata['salutation']} {filldata['firstName']} {filldata['lastName']}<br></br>
        <div style={horizontalLineStyle}></div> {/* Add the horizontal line */}


        {/* Arrival details */}
        <b><h3>Arrival Details</h3></b>
        <b><small>Arrival:</small></b>&nbsp;{sessionStorage.getItem('checkIn')}<br></br>
        <b><small>Departure:</small></b>&nbsp;{sessionStorage.getItem('checkout')}<br></br>
        <b><small>PAX:</small></b>&nbsp;{sessionStorage.getItem('adults')}{" + "}{sessionStorage.getItem('children')}<br></br>
        <b><small>Rooms:</small></b>&nbsp;{sessionStorage.getItem('quantity')}<br></br>
        <div style={horizontalLineStyle}></div> {/* Add the horizontal line */}


        {/* Extras Details */}
        <b><h3>Other Information</h3></b>
        <b><small>Reservation Type:</small></b>&nbsp;{sessionStorage.getItem('resType')}<br></br>
        <b><small>Source:</small></b>&nbsp;{sessionStorage.getItem('sourceID')}<br></br>
        <b><small>Market:</small></b>&nbsp;{sessionStorage.getItem('marketID')}<br></br>
        <div style={horizontalLineStyle}></div> {/* Add the horizontal line */}


        {/* Discount information */}
        <b><h3>Discount/upsell </h3></b>
        <b><small>Upsell/Discount:</small></b>&nbsp;{sessionStorage.getItem('radioButton')}<br></br>
        <b><small>Type:</small></b>&nbsp;{sessionStorage.getItem('radioType')}<br></br>
        <b><small>Amount</small></b>&nbsp;{sessionStorage.getItem('amounts')}<br></br>
        <div style={horizontalLineStyle}></div> {/* Add the horizontal line */}


        {/* Payment Information */}
        <b><h3>Payment Information</h3></b>
        <b><small>Payment Type:</small></b>&nbsp;{sessionStorage.getItem('paymentType')}<br></br>
        <div style={horizontalLineStyle}></div> {/* Add the horizontal line */}

        {/* Pickup Details */}
        <b><h3>PickUpDrop Information</h3></b>
        <b><small>PickUp Date:</small></b>&nbsp;{sessionStorage.getItem('pickupDate')}<br></br>
        <b><small>Drop Date:</small></b>&nbsp;{sessionStorage.getItem('dropDate')}<br></br>
      </div>
    )
  }


  // error handling for same guest addition
  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      html: message.replace(/\n/g, '<br />'),
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }

  const handleErrorCheck = (message) => {
    return MySwal.fire({
      title: 'Error!',
      html: `<b>${message}</b>`,
      icon: 'error',
      imageUrl: warningImage,
      imageWidth: 800, // Increase image width
      imageHeight: 200, // Increase image height
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false,
      width: '1000px', // Adjust modal width if needed
      heightAuto: false // Ensure modal height adjusts to content
    });
  };



  return (
    <div>

      <Modal isOpen={guestProfileModal} toggle={() => setGuestProfileModal(!guestProfileModal)} className='modal-xl'>
        <ModalHeader toggle={() => setGuestProfileModal(!guestProfileModal)}>Guest Profile</ModalHeader>
        <ModalBody>
          <GuestProfile />
        </ModalBody>
      </Modal>


      {/* View Guest Profile */}
      <div>
        <Modal isOpen={assign} toggle={() => setAssign(!assign)} className='modal-lg'>
          <ModalHeader className='bg-transparent' toggle={() => setAssign(!assign)}></ModalHeader>
          {filldata && <ModalBody className='pb-3 px-sm-1 mx-20'>


            <Row>
              <Col>

                <Col>
                  <Row>
                    <Col>
                      <div className="mb-1">
                        <Row>
                          <UncontrolledAccordion defaultOpen='1'>
                            <AccordionItem>
                              <AccordionHeader
                                style={{ backgroundColor: "#F2E5D9" }}
                                targetId="1"
                              >
                                <b> Overview </b>
                              </AccordionHeader>
                              <AccordionBody accordionId="1">
                                <Row>
                                  <Col>
                                    <div>
                                      <h5>
                                        <b> Basic Details </b>
                                      </h5>
                                      <br></br>
                                      <h6> Name:<b>{filldata["salutation"]} {filldata["firstName"]} {filldata["lastName"]}
                                      </b> </h6>
                                      <h6>Email: <b>{filldata["email"]}</b>  </h6>
                                      <h6> Phone Number: <b> {filldata["phoneNumber"]}</b></h6>
                                    </div>
                                  </Col>

                                  <Col>
                                    <div>
                                      <h5>
                                        <b> Address Details</b>
                                      </h5>
                                      <br></br>

                                      <h6>
                                        Address One: <b>{filldata["addressOne"]}</b>
                                      </h6>
                                      <h6>
                                        Address Two: <b>{filldata["addressTwo"]}</b>
                                      </h6>

                                      <h6>
                                        Country: <b>{filldata["countryName"]}</b>
                                      </h6>
                                      <h6>
                                        State: <b>{filldata["state"]}</b>
                                      </h6>
                                      <h6>
                                        City: <b>{filldata["city"]}</b>
                                      </h6>
                                      <h6>
                                        PostalCode: <b>{filldata["postalCode"]}</b>
                                      </h6>
                                    </div>
                                  </Col>
                                </Row>
                              </AccordionBody>
                            </AccordionItem>
                          </UncontrolledAccordion>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <br></br>

                <Col>
                  <Row>
                    <Col>
                      <div className="mb-1">
                        <Row>
                          <UncontrolledAccordion defaultOpen='1'>
                            <AccordionItem>
                              <AccordionHeader
                                style={{ backgroundColor: "#F2E5D9" }}
                                targetId="1" >
                                <b> Company Details and GST </b>
                              </AccordionHeader>
                              <AccordionBody accordionId="1">
                                <Row>
                                  <Col>

                                    <Row>
                                      <Col> <h6>
                                        Company: <b>{filldata["accountName"]}</b>
                                      </h6> </Col>

                                      <Col> <h6> GST Number: <b>{filldata["gstID"]}</b> </h6>  </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </AccordionBody>
                            </AccordionItem>
                          </UncontrolledAccordion>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <br></br>

                <Col>
                  <Row>
                    <Col>
                      <div className="mb-1">
                        <Row>
                          <UncontrolledAccordion defaultOpen='1'>
                            <AccordionItem>
                              <AccordionHeader
                                style={{ backgroundColor: "#F2E5D9" }}
                                targetId="1" >
                                <b>  ID Details </b>
                              </AccordionHeader>
                              <AccordionBody accordionId="1">
                                <GuestDataGrid data1={filldata} />
                              </AccordionBody>
                            </AccordionItem>
                          </UncontrolledAccordion>
                        </Row>
                      </div>
                    </Col>
                  </Row>


                </Col>

                <br></br>

                <Col>
                  <Row>
                    <Col>
                      <div className="mb-1">
                        <Row>
                          <UncontrolledAccordion defaultOpen='1'>
                            <AccordionItem>
                              <AccordionHeader
                                style={{ backgroundColor: "#F2E5D9" }}
                                targetId="1" >
                                <b>Membership Details </b>
                              </AccordionHeader>
                              <AccordionBody accordionId="1">
                                <Row>
                                  <Col>
                                    <Row>
                                      {filldata &&
                                        <>
                                          {/* console.log(filldata["membershipType"]) */}
                                          <Col> <h6>Membership Type: {filldata["membershipType"]} </h6> </Col>
                                          <Col> <h6>Membership Number: {filldata["membershipNo"]} </h6> </Col>
                                          <Col> <h6> Membership Level: {filldata["membershipLevel"]}</h6> </Col>
                                        </>
                                      }
                                    </Row>

                                  </Col>
                                </Row>
                              </AccordionBody>
                            </AccordionItem>
                          </UncontrolledAccordion>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <br></br>

                <Col>
                  <Row>
                    <Col>
                      <div className="mb-1">
                        <Row>
                          <UncontrolledAccordion defaultOpen='1'>
                            <AccordionItem>
                              <AccordionHeader
                                style={{ backgroundColor: "#F2E5D9" }}
                                targetId="1" >
                                <b>Other Details </b>
                              </AccordionHeader>
                              <AccordionBody accordionId="1">
                                <Row>
                                  <Col>

                                    <Row>
                                      <Col> <h6>DOB: <b> {filldata["dob"]}</b> </h6></Col>
                                      <Col> <h6>Anniversary Date: <b>{filldata["anniversary"]}</b> </h6></Col>
                                      <Col> <h6> Guest Preference Notes: <b>{filldata["guestpreferencenotes"]} </b> </h6> </Col>

                                    </Row>
                                  </Col>
                                </Row>
                              </AccordionBody>
                            </AccordionItem>
                          </UncontrolledAccordion>
                        </Row>
                      </div>
                    </Col>
                  </Row>


                </Col>


              </Col>
            </Row>
          </ModalBody>}
        </Modal>
      </div>


      <Row>
        {/* Guest Card */}
        <Col md='3' sm='12'>
          <Card>
            <CardHeader style={{ background: '#8c82f2', textAlign: 'center' }}>
              <CardTitle>
                <h3 style={{ color: 'white', textAlign: 'center' }}>Stay Information</h3>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div id="displayCard"></div>
            </CardBody>
          </Card>
        </Col>

        <Col md='9' sm='12'>
          <Card >

            {/* Rate Breakup Modal */}
            <Modal isOpen={show} toggle={() => actionButton(!show)} className="modal-lg">
              <ModalHeader className='modal-lg' toggle={() => actionButton(!show)} >
                Rate Breakup
              </ModalHeader>
              <ModalBody>
                {(Rate2 !== "undefined") &&
                  <div className="ag-theme-alpine" style={{ width: 760, height: 520 }}>

                    <AgGridReact
                      ref={gridRef}
                      rowData={Rate2}
                      columnDefs={columnDefs2}
                      animateRows={true}
                      rowSelection='multiple'
                      onCellClicked={cellClickedListener1}
                      paginationPageSize='10'
                      pagination='true'
                      defaultColDef={defaultColDef}
                      headerColor="ddw-primary"
                    />
                  </div>
                }
              </ModalBody>
            </Modal>


            {/* {toggleCount &&  */}
            <Accordion className='accordion-margin' open={open} toggle={toggle}>

              {/* Guest Search Accordian */}
              <div>
                <AccordionItem open={open}>
                  <AccordionHeader targetId='1'> <h5><b>Guest Profile Search</b></h5></AccordionHeader>
                  <AccordionBody accordionId='1'>
                    <div>
                      <Row className='mb-1'>
                        <Col md='3' sm='12' className='mb-1'>
                          <Label className='form-label' for='fullName'>
                            Search
                          </Label>
                          <Input
                            type="text"
                            id="filter-text-box1"
                            placeholder="Filter..."
                            onInput={onFilterTextBoxChanged1}
                          />
                        </Col>
                        <Col md='8' sm='12' className='mb-1'>
                          <br></br>
                          &nbsp;&nbsp;&nbsp;
                          <Button color='primary' onClick={onclickButton} style={{ float: 'right' }}>
                            Add New Guest
                          </Button>
                        </Col>
                      </Row>
                    </div>
                    <div className="ag-theme-alpine" style={{ height: 520 }}>
                      <AgGridReact
                        ref={gridRefs}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        animateRows={true}
                        rowSelection='multiple'
                        onCellClicked={cellClickedListener}
                        paginationPageSize='10'
                        pagination='true'
                        defaultColDef={defaultColDef}
                        headerColor="ddw-primary"
                      />
                    </div>
                  </AccordionBody>
                </AccordionItem>
              </div>

              <div className="vertically-centered-modal">

                <Modal
                  isOpen={guestHistory}
                  toggle={() => setOpenGuestHistory(!guestHistory)}
                  className="modal-xl"
                >
                  <ModalHeader toggle={() => setOpenGuestHistory(!guestHistory)}>
                    Welcome...
                  </ModalHeader>
                  <ModalBody>
                    {guestHistory !== false && <History data1={guestHistory} />}

                  </ModalBody>

                </Modal>
              </div>

              {/* Corporate or Individual */}
              <div >
                <AccordionItem onSubmit={() => setOpen('3')}>
                  {/* onSubmit={() => setOpen('3')} > */}
                  <AccordionHeader targetId='2' toggle={toggle}> <h5><b>Company profile Search</b></h5></AccordionHeader>
                  <AccordionBody accordionId='2'>
                    <Companydetails />
                    {open === '2' && (ReactDOM.render(<CardData />, document.getElementById("displayCard")))}
                  </AccordionBody>
                </AccordionItem>
              </div>


              {/* Checkin and Checkout information */}
              <div>
                <AccordionItem>
                  <AccordionHeader targetId='3'>
                    <h5><b>Arrival Details</b></h5>
                  </AccordionHeader>
                  <AccordionBody accordionId='3'>
                    <div>
                      <Card>
                        <CardBody>
                          <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                              {
                                arrivalDate !== undefined && <Col md='4' sm='12'>
                                  <div className='mb-1'>
                                    <Label className='form-label' for='coming'>
                                      Arrival Date <spam style={{ color: 'red' }}>*</spam>
                                    </Label>
                                    <Controller
                                      control={control}
                                      id='coming'
                                      name='coming'
                                      defaultValue={arrivalDate}
                                      render={({ field }) => (
                                        <Flatpickr
                                          {...field}
                                          options={options}
                                          placeholder='YYYY-MM-DD '
                                          className={classnames('form-control', {
                                            'is-invalid': data !== null && data.coming === null
                                          })}
                                        />
                                      )}
                                    />
                                  </div>
                                </Col>
                              }

                              {
                                departureDate !== undefined &&
                                <Col md='4' sm='12'>
                                  <div className='mb-1'>
                                    <Label className='form-label' for='departure'>
                                      Departure Date <spam style={{ color: 'red' }}>*</spam>
                                    </Label>
                                    <Controller
                                      control={control}
                                      id='departure'
                                      name='departure'
                                      defaultValue={departureDate}
                                      render={({ field }) => (
                                        <Flatpickr
                                          {...field}
                                          options={optionsToDate}
                                          placeholder='YYYY-MM-DD '
                                          className={classnames('form-control', {
                                            'is-invalid': data !== null && data.departure === null
                                          })}
                                        />
                                      )}
                                    />
                                  </div>
                                </Col>
                              }

                              <Col md='4' sm='12'>
                                <div>
                                  <Label className='form-label' for='adultCount'>
                                    Adults <spam style={{ color: 'red' }}>*</spam>
                                  </Label>
                                  <Controller
                                    id='adultCount'
                                    control={control}
                                    name='adultCount'
                                    defaultValue={colourOptions[0]}
                                    render={({ field }) => (
                                      <Select
                                        isSubmitted
                                        isClearable
                                        required
                                        options={colourOptions}
                                        classNamePrefix='select'
                                        theme={selectThemeColors}
                                        className={classnames('react-select', { 'is-invalid': data !== null && data.adultCount === null })}
                                        {...field}
                                      />
                                    )}
                                  />
                                </div>
                              </Col>

                              <Col md='4' sm='5'>
                                <div className='mb-1'>
                                  <Label className='form-label' for='childCount'>
                                    Children <spam style={{ color: 'red' }}>*</spam>
                                  </Label>
                                  <Controller
                                    id='childCount'
                                    control={control}
                                    name='childCount'
                                    defaultValue={children[0]}
                                    render={({ field }) => (
                                      <Select
                                        required
                                        disabled={true}
                                        isClearable
                                        options={children}
                                        classNamePrefix='select'
                                        theme={selectThemeColors}
                                        className={classnames('react-select', { 'is-invalid': data !== null && data.childCount === null })}
                                        {...field}
                                      />
                                    )}
                                  />
                                </div>
                              </Col>

                              <Col md='4' sm='5'>
                                <div className='mb-1'>
                                  <Label className="form-label" for="roomQuantity">
                                    Number of rooms <spam style={{ color: 'red' }}>*</spam>
                                  </Label>
                                  <Controller
                                    id='roomQuantity'
                                    control={control}
                                    name='roomQuantity'
                                    defaultValue={colourOptions1[0]}
                                    render={({ field }) => (
                                      <Select
                                        required
                                        disabled={isSubmitted}
                                        isClearable
                                        options={colourOptions1}
                                        classNamePrefix='select'
                                        theme={selectThemeColors}
                                        className={classnames('react-select', { 'is-invalid': data !== null && data.roomQuantity === null })}
                                        {...field}
                                      />
                                    )}
                                  />
                                </div>
                              </Col>


                              <div align='end'>
                                <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset1}>
                                  Start Over
                                </Button>
                                <Button color='primary' className='me-1' type='submit'>
                                  Get Rates
                                </Button>
                              </div>
                            </Row>
                          </Form>
                        </CardBody>
                      </Card>

                      {rowData1 !== undefined && toggleCount &&
                        <div className="ag-theme-alpine" style={{ height: 220 }}>
                          <h3>
                            Contracted Rates
                          </h3>
                          <AgGridReact
                            ref={gridRef}
                            rowData={rowData1}
                            columnDefs={columnDefs1}
                            animateRows={true}
                            rowSelection='multiple'
                            onCellClicked={cellClickedListener1}
                            paginationPageSize='10'
                            defaultColDef={defaultColDef1}
                            headerColor="ddw-primary"
                          />
                        </div>}
                      {sessionStorage.getItem('source') === '2' && <div><br></br><br></br><br></br><br></br></div>}
                      {Rate3 !== undefined && toggleCount &&
                        <div className="ag-theme-alpine" style={{ height: 220 }}>
                          <h3>
                            FIT Rates
                          </h3>
                          <AgGridReact
                            ref={gridRef}
                            rowData={Rate3}
                            columnDefs={columnDefs1}
                            animateRows={true}
                            rowSelection='multiple'
                            onCellClicked={cellClickedListener1}
                            paginationPageSize='10'
                            defaultColDef={defaultColDef1}
                            headerColor="ddw-primary"
                          />
                        </div>}
                    </div>
                    {open === '3' && setTimeout(() => { ReactDOM.render(<CardData />, document.getElementById("displayCard")) })}
                  </AccordionBody>
                </AccordionItem>
              </div>


              {/* General Booking Information */}
              <div>
                <AccordionItem>
                  <AccordionHeader targetId='4'> <h5><b>Booking Information</b></h5> </AccordionHeader>
                  <AccordionBody accordionId='4'>
                    <Extra onSubmit1={openNextAccordion} />
                    {open === '2' && (ReactDOM.render(<CardData />, document.getElementById("displayCard")))}
                  </AccordionBody>
                </AccordionItem>
              </div>


              {/* Daily Details */}
              <div>
                <AccordionItem>
                  <AccordionHeader targetId='5'> <h5><b>Daily Details</b></h5> </AccordionHeader>
                  <AccordionBody accordionId='5'>
                    <div>
                      <Form onSubmit={handleSubmit(onSubmit1)}>
                        <Row>
                          <Col className='name'>
                            <div className='demo-inline-spacing'>
                              <div className='form-check form-check-inline'>
                                <Label className='form-check-label' for='ex1-active'>
                                  <Input type="radio" name='ex1Type' value="Discount" onChange={handleRadioChange} />
                                  Discount
                                </Label>
                              </div>
                              <div className='form-check form-check-inline'>
                                <Label className='form-check-label'>
                                  <Input type="radio" name='ex1Type' value="Upsell" onChange={handleRadioChange} />
                                  Upsell
                                </Label>
                              </div>
                              <div className='form-check form-check-inline'>

                                <Button color='primary' onClick={() => setOpenManualPriceModal(true)}> Manual Price </Button>
                              </div>
                            </div>

                          </Col>
                        </Row>
                        {
                          showAdditionalOptions &&
                          <Row>
                            <Col className='name'>
                              <div className='demo-inline-spacing'>
                                <div className='form-check form-check-inline'>
                                  <Label className='form-check-label' for='ex1-active'>
                                    <Input type="radio" name='ex1' value="Percentage" onChange={handleRadioChange1} />
                                    Percentage
                                  </Label>
                                </div>
                                <div className='form-check form-check-inline'>
                                  <Label className='form-check-label'>
                                    <Input type="radio" name='ex1' value="Amount" onChange={handleRadioChange2}
                                    />
                                    Amount
                                  </Label>
                                </div>
                              </div>
                            </Col>
                          </Row>
                          // </div>
                        }

                        {
                          showAdditionalOptions1 &&
                          <Col md='4' sm='8'>
                            <div >
                              <br></br>
                              <Label className='form-label' for='rate'>
                                Enter Percentage
                              </Label>
                              <Controller
                                defaultValue=''
                                control={control}
                                id='rate'
                                name='rate'
                                render={() =>
                                  <Input
                                    type="text"
                                    placeholder='Enter amount'
                                    value={rate}
                                    onChange={handleInputChange}
                                  // pattern="^(0|[1-9]|1[0-9]|2[0-9]|50)$"
                                  // title="only 0 to 30% is allowed"
                                  // onInput={(e) => {
                                  //   e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                  // }}
                                  />
                                }
                              />
                            </div>
                          </Col>
                        }

                        {
                          showAdditionalOptions2 &&
                          <Col md='4' sm='8'>
                            <div >
                              <br></br>
                              <Label className='form-label' for='rate'>
                                Enter Amount
                              </Label>
                              <Controller
                                defaultValue=''
                                control={control}
                                id='rate'
                                name='rate'
                                render={() => <Input
                                  type="text"
                                  placeholder='Enter amount'
                                  value={rate}
                                  // pattern="^(0|[1-9]\d{0,3}|6000)$"
                                  // title="only 0 to 30% is allowed"
                                  onChange={handleInputChange}
                                // onInput={(e) => {
                                //   e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                // }}
                                />
                                }
                              />
                            </div>
                          </Col>
                        }

                        {/* <div align='end'> */}
                        <br></br>
                        {showButtons &&
                          <div>
                            <Button className='me-1' color='secondary'>
                              Reset
                            </Button>
                            <Button className='me-1' color='primary' type='submit'>
                              Submit
                            </Button></div>}

                        {/* Daily Details AG-GRID */}
                        <div className="ag-theme-alpine" style={{ height: 320 }}>
                          <br></br>
                          <br></br>

                          <AgGridReact
                            ref={gridRef}
                            rowData={rowData4}
                            columnDefs={columnDefs3}
                            animateRows={true}
                            rowSelection='multiple'
                            paginationPageSize='10'
                            pagination='true'
                            defaultColDef={defaultColDef}
                            headerColor="ddw-primary"
                          />
                        </div>


                        <br></br>
                        <br></br>
                        <br></br>

                        {/* Proceed Button */}

                        <div align='end'>
                          <Button className='me-1' color='primary' onClick={openNextAccordian}>
                            Proceed Next
                          </Button>
                        </div>
                      </Form>
                    </div>
                    {/* {open === '5' && <DailyDetails id={sessionStorage.getItem('reservationid')} />} */}
                  </AccordionBody>
                </AccordionItem>
              </div>


              {/* Payment Information */}
              <div>
                <AccordionItem>
                  <AccordionHeader targetId='6'><h5><b>Payment Information</b></h5></AccordionHeader>
                  <AccordionBody accordionId='6'>
                    <Payment onSubmit2={openNextAccordion2} />
                    {open === '6' && setTimeout(() => { ReactDOM.render(<CardData />, document.getElementById("displayCard")) }, 500)}
                  </AccordionBody>
                </AccordionItem>
              </div>


              {/* PickUp and Drop */}
              <div>
                <AccordionItem onSubmit={() => setOpen('8')}>
                  <AccordionHeader targetId='7'><h5><b>Airport Pickup And Drop</b></h5></AccordionHeader>
                  <AccordionBody accordionId='7'>
                    <PickUpDetails />
                    {open === '7' && setTimeout(() => { ReactDOM.render(<CardData />, document.getElementById("displayCard")) }, 500)}
                  </AccordionBody>
                </AccordionItem>
              </div>

            </Accordion>
          </Card>

          {/* Final Submit Buttons */}
          <div align='end'>
            {/* <Button className='me-1' color='primary' align='end' onClick={() => setBasicModal(!basicModal)}> */}
            <Button className='me-1' color='primary' align='end' onClick={checkFunction}>
              Preview Reservations
            </Button>
          </div>
        </Col>

      </Row>

      {/* Confirmation page buttons */}
      <div className='demo-inline-spacing'>
        <div className='basic-modal'>
          <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-xl'>
            <ModalHeader toggle={() => setBasicModal(!basicModal)}>Reservation Page</ModalHeader>
            <ModalBody>
              <ConfirmedDetails toggleModal={toggleModal} />
            </ModalBody>
            {/* <ModalFooter>
              <Button color='secondary' outline onClick={modalClose}>
                Cancel
              </Button>
              <Button color='primary' onClick={masterReservation}>
                Confirm
              </Button>
            </ModalFooter> */}
          </Modal>
        </div>
      </div>

      <Modal
        isOpen={openManualPriceModal}
        toggle={() => setOpenManualPriceModal(!openManualPriceModal)}
        // toggle={openManualPriceModal}
        className='modal-dialog-centered'
      // style={{ maxWidth: '700px', width: '700px', margin: 'auto' }}
      >
        <ModalHeader toggle={() => setOpenManualPriceModal(!openManualPriceModal)}>
          Please Enter the Manual Price
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md='6' sm='12' className='mb-1'>
              <div className='mb-1'>
                <Label className='form-label' for='manualPrice'>
                  Manual Price
                </Label>
                <Controller
                  id='manualPrice'
                  name='manualPrice'
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <Input
                      required
                      {...field}
                      id='manualPrice'
                      placeholder='Please enter the amount'
                      className={classnames('form-control')}


                    />
                  )}
                />
              </div>
            </Col>
          </Row>
          <Row>

            <Col md="6" sm="12" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button className="me-1" color="primary" style={{ whiteSpace: 'nowrap' }} onClick={() => setConfirmSubmit(true)}>
                Continue
              </Button>
              <Button outline color="secondary" className="me-1" onClick={() => setOpenManualPriceModal(!openManualPriceModal)}>
                Cancel
              </Button>
            </Col>

          </Row>
        </ModalBody>
      </Modal>



      <Modal isOpen={confirmSubmit} toggle={() => setConfirmSubmit(!confirmSubmit)} className='modal-dialog-centered'>
        <ModalHeader className='bg-transparent' toggle={() => setConfirmSubmit(!confirmSubmit)}></ModalHeader>
        <ModalBody className='text-center mb-2'>

          <div className='text-center mb-2'>
            <h5><b>"This manual price will be applied to all days."</b></h5>

            <div className="button-container text-center">
              <Button className="me-1" color="primary" type='submit' onClick={() => manualPriceFunction(rowData4)}>
                Confirm
              </Button>
              <Button className="me-1" color="primary" onClick={() => { setConfirmSubmit(false), setOpenManualPriceModal(false) }}>
                Back
              </Button>

            </div>

          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}


export default AccordionUncontrolled
