// ** React Imports
import { useState } from 'react'
import { Fragment } from 'react'
// import { Nav, NavItem, NavLink } from 'reactstrap'
// ** Third Party Components
import Select from 'react-select'
import toast from 'react-hot-toast'
import classnames from 'classnames'
import Cleave from 'cleave.js/react'
import { Check } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../../config'
// import ForexCancellation from './cancelForex'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import Moment from 'moment'
let is_test = false


// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText, Input } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
// AG Grid
import { AgGridReact } from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import { useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Accordion, AccordionBody, AccordionHeader, AccordionItem, Modal, ModalBody,
  ModalHeader,
} from 'reactstrap'
//import { useNavigate } from 'react-router-dom'
const id = '1';
import ForexTemplates from "./forextempalate"
import ForexCancellation from './cancelForex'

//import { cO } from 'chart.js/dist/chunks/helpers.core'
const MySwal = withReactContent(Swal)
let bookingData;
let currencyRate;
let AmtJSON = {}
var active = true

const colourOptions = [
  { value: '1', label: 'Active' },
  { value: '0', label: 'In Active' },

]
let InHouseGuestOptions = []

let currencyCodeOptions = []
const defaultValues = {
  //date:'',
  room: '',
  reservationID: '',
  guestProfileID: '',
  currencyName: '',
  rateForTheDay: ' ',
  amount: '',
  equivalentAmount: ''
}

const Forex = () => {

  const [businessDate, setbusinessDate] = useState(null)

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
        if (rowData.statusCode === 200) {


          const todate = new Date(data[0]["businessDate"]);


          const Today = Moment(todate).format('YYYY-MM-DD');

          setbusinessDate(Today)

        }

      })


  }, [])

  const [open, setOpen] = useState('')

  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }
  // AG Grid
  const [rowData, setRowData] = useState('');
  const [rowData2, setRowData2] = useState('');
  const [AllCurrency, setAllCurrency] = useState('');
  const [data, setData] = useState([])
  const [show, setshow] = useState(false);
  const { reset, handleSubmit, control } = useForm({ defaultValues })

  const [RoomSearch, setRoomSearch] = useState(false);
  const [SelectedRoom, setSelectedRoom] = useState(false)
  const [SelectedCurrency, setSelectedCurrency] = useState([])
  const [bookingID, setbookingID] = useState('')
  const [roomNumber, setroomNumber] = useState('')
  const [firstName, setfirstName] = useState('')
  const [arrivalDate, setarrivalDate] = useState('')
  const [departureDate, setdepartureDate] = useState('')
  const [reservationStatus, setreservationStatus] = useState('')
  const [Currency, setCurrency] = useState('')
  const [CurrencySearch, setCurrencySearch] = useState(false)
  const [RateForTheDay, setRateForTheDay] = useState('')
  const [showErrorMsg, setshowErrorMsg] = useState(false)

  const [guestDetails, setGuestDetails] = useState('')
  const [ForexTemplate, setForexTemplate] = useState('')
  const [forexCancellation, setForexCancellation] = useState();
  const [ShowForexPDF, setShowForexPDF] = useState(false)
  const [ForexURL, setForexURL] = useState([])
  const [currencyAmount, setcurrencyAmount] = useState('');

  let navigate = useNavigate();


  const gridRef = useRef();
  const gridRef1 = useRef();

  // //API to get all the guests
  useEffect(() => {
    fetchx(API_URL + '/getReservationForFrontDeskInHouseGuest')
      .then(result => result.json())
      .then(rowData => {
        setRowData2(rowData['data'])
        setGuestDetails(rowData['data'])
      })
  }, [])

  //Search element
  const onFilter = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter').value
    )
  }, [])

  const [columnDefs2, setColumnDefs2] = useState([
    { headerName: 'Room', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 170 },
    { headerName: 'Guest Name', field: 'guestName', suppressSizeToFit: true, maxWidth: 300 },
    { headerName: 'Booking ID', field: 'bookingID', suppressSizeToFit: true, maxWidth: 300 },
    {
      headerName: 'Actions', field: 'room', suppressSizeToFit: true, maxWidth: 300,
      cellRendererFramework: (params) => <Button color='primary' onClick={() => OnSelectRoom(params)}> Select </Button>
    },
    {
      headerName: "Arrival",
      field: "arrivalDate",
      suppressSizeToFit: true,
      maxWidth: 140,
      cellRenderer: (params) => {
        // Ensure the arrivalDate field exists in the row data        
        if (params.data && params.data.arrivalDate) {
          // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
          const formattedDate = Moment(params.data.arrivalDate).format("DD-MM-YYYY");
          return formattedDate;
        } else {
          return ""; // Handle cases where the data is missing or invalid        
        }
      }
    },

    {
      headerName: 'Departure  ', field: 'departureDate', suppressSizeToFit: true, maxWidth: 170, cellRenderer: (params) => {
        // Ensure the arrivalDate field exists in the row data        
        if (params.data && params.data.arrivalDate) {
          // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
          const formattedDate = Moment(params.data.arrivalDate).format("DD-MM-YYYY");
          return formattedDate;
        } else {
          return ""; // Handle cases where the data is missing or invalid        
        }
      }
    },
    { headerName: 'Reservation Status', field: 'reservationStatus', suppressSizeToFit: true, maxWidth: 300 }

  ])

  const [CurrencyColumnDefs, setCurrencyColumnDefs] = useState([
    { headerName: 'id', field: 'id', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Currency', field: 'currencyName', suppressSizeToFit: true, maxWidth: 300 },
    { headerName: 'Rate For The Day', field: 'rateForTheDay', suppressSizeToFit: true, maxWidth: 300 },
    {
      headerName: 'Actions', suppressSizeToFit: true, maxWidth: 300,
      cellRendererFramework: (params) => <Button color='primary' onClick={() => OnSelectCurrency(params)}> Select </Button>
    },
  ])


  //ag-grid cell clcked value
  const cellClickedListener1 = useCallback(event => {

    localStorage.setItem('room', event['data']['room'])
    localStorage.setItem('reservationID', event['data']['reservationID'])
    localStorage.setItem('guestName', event['data']['guestName'])
    localStorage.setItem('arrivalDate', event['data']['arrivalDate'])
    localStorage.setItem('departureDate', event['data']['departureDate'])
    localStorage.setItem('reservationStatus', event['data']['reservationStatus'])
  })

  const cellClickedListener2 = useCallback(event => {

    localStorage.setItem('name', event['data']['name'])
    localStorage.setItem('rateForTheDay', event['data']['rateForTheDay'])

  })


  const OnSelectRoom = (event) => {
    setSelectedRoom(event['data'])
    const bookingData = event['data']['bookingID']; // Assuming 'data' is a property of 'event'
    console.log(bookingData);
    setbookingID(event['data']['bookingID'])
    setroomNumber(event['data']['roomNumber'])
    setfirstName(event['data']['guestName'])
    setarrivalDate(event['data']['arrivalDate'])
    setdepartureDate(event['data']['departureDate'])
    setreservationStatus(event['data']['reservationStatus'])
    setRoomSearch(false);
  };

  const OnSelectCurrency = (event) => {
    setSelectedCurrency(event.data)
    const currencyRate = event['data']['rateForTheDay'];
    const currencycode = event['data']['id'];
    setCurrency(event['data']['currencyID'])
    setRateForTheDay(event['data']['rateForTheDay'])
    setCurrencySearch(false);
  };


  const postForexRequest = (data) => {
    const apiUrl = API_URL + '/postForex'; // Replace with your server's API URL

    const headers = {
      'Content-Type': 'application/json',
    };

    return fetchx(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error:', error);
        throw error;
      });
  };

  const handleselect = (event) => {
    setFillData(event['data'])
    //setForexTemplate(true)
    const hotelID = event.data.hotelID; // Replace with your desired value
    const certificateNo = event.data.certificateNo;
    const reservationID = event.data.reservationID;

    const data1 = {
      hotelID: hotelID,
      reservationID: reservationID,
      guestProfileID: event.data.guestProfileID,
      certificateNo: certificateNo,
    };


    // Make the POST request
    postForexRequest(data1)
      .then(responseData => {

        if (responseData.status === 'success') {
          const certificateURL = responseData.url;
          if (certificateURL) {
            // Open the URL in a new tab
            const newTab = window.open(certificateURL, '_blank');
            if (newTab) {
              newTab.focus(); // Ensure the new tab is in focus
            } else {
              console.error('Failed to open a new tab.');
            }
            console.log('Certificate URL:', certificateURL);
          } else {
            console.error('No certificate URL found in the server response.');
          }
        } else {
          console.error('Server response indicates failure.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const getForexCertificate = (data) => {
    if(!is_test){
      fetchx(API_URL + "/gets3DocumentIDPMS", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: 1,
          DocName: 'ForexCertificate',
          transactionID: data.id,

        })
      }).then(result => result.json())
        .then(resp => {
          if (resp.statusCode == 200) {
            setForexURL(API_URL + '/images/' + resp['data'])
            setShowForexPDF(true)
          }

        }).catch((error) => {
          console.log(error)
        })
    } else {
      setForexURL(API_URL+"/imagepaths/PMS_BACKEND/CertificatesForex/ForexCertificate_" + data.hotelID + "_" + data.certificateNo + "_" + data.reservationID + ".pdf")
      setShowForexPDF(true)
     
    }
  }

  const [formattedBusinessDate, setFormattedBusinessDate] = useState()

  useEffect(() => {
    const formattedBusinessDate = businessDate ? new Date(businessDate) : null;
    setFormattedBusinessDate(formattedBusinessDate);
  }, [businessDate]);

  const onselect = (event) => {
    const eventDate = new Date(event.data.date);
    const formattedDate = formatDate(eventDate);
    if (event.data.todate !== null && event.data.todate === formattedDate) {
      // Show modal or perform action for valid condition
      setForexCancellation(true);
    } else {
      // Display a popup message for invalid condition
      setShowModal(true)
      // navigate('');
    }
  };


  const formatDate = (date) => {
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
  }


  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'C.Number', field: 'certificateNo', cellStyle: { 'textAlign': 'center', 'backgroundColor': 'pink' }, maxWidth: 160 },
    {
      headerName: "Date",
      field: "date",
      suppressSizeToFit: true,
      cellStyle: { 'textAlign': 'center', 'backgroundColor': '#F1E39B' },
      maxWidth: 140,
      cellRenderer: (params) => {
        // Ensure the arrivalDate field exists in the row data        
        if (params.data && params.data.date) {
          // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
          const formattedDate = Moment(params.data.date).format("DD-MM-YYYY");
          return formattedDate;
        } else {
          return ""; // Handle cases where the data is missing or invalid        
        }
      }
    },

    { headerName: 'Guest Name', field: 'guestName', cellStyle: { 'textAlign': 'center', 'backgroundColor': 'pink' }, maxWidth: 210 },
    { headerName: 'Room', field: 'room', suppressSizeToFit: true, cellStyle: { 'textAlign': 'center', 'backgroundColor': '#F1E39B' }, maxWidth: 160 },
    { headerName: 'Booking ID', field: 'bookingID', suppressSizeToFit: true, cellStyle: { 'textAlign': 'center', 'backgroundColor': 'pink' }, maxWidth: 160 },
    { headerName: 'Total Amount', field: 'total', cellStyle: { 'textAlign': 'center', 'backgroundColor': '#F1E39B' }, maxWidth: 160 },

    {
      headerName: 'View Certificate', suppressSizeToFit: true, cellStyle: { 'textAlign': 'center', 'backgroundColor': 'white' }, maxWidth: 160,
      cellRendererFramework: (params) => <Button color='primary' onClick={() => { getForexCertificate(params.data) }}> View </Button>
    },
    {
      headerName: 'Cancel', suppressSizeToFit: true, cellStyle: { 'textAlign': 'center', 'backgroundColor': 'white' }, maxWidth: 160,
      cellRendererFramework: (params) => <Button color='primary' onClick={() => { onselect(params) }}> Cancel </Button>
    },
    { headerName: 'Currency', field: 'currencyName', cellStyle: { 'textAlign': 'center', 'backgroundColor': 'pink' }, maxWidth: 180 },
    { headerName: 'Rate For The Day', field: 'rateForTheDay', cellStyle: { 'textAlign': 'center', 'backgroundColor': '#F1E39B' }, maxWidth: 190 },
    { headerName: 'Amount', field: 'amount', cellStyle: { 'textAlign': 'center', 'backgroundColor': 'pink' }, maxWidth: 160 },
    { headerName: 'Eqvt Amount', field: 'equivalentAmount', cellStyle: { 'textAlign': 'center', 'backgroundColor': '#F1E39B' }, maxWidth: 160 },
    { headerName: 'CGST', field: 'CGST', cellStyle: { 'textAlign': 'center', 'backgroundColor': 'pink' }, maxWidth: 160 },
    { headerName: 'SGST', field: 'SGST', cellStyle: { 'textAlign': 'center', 'backgroundColor': '#F1E39B' }, maxWidth: 160 },
  ]);

  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));


  const [Filldata, setFillData] = useState(" ")
  const cellClickedListener = useCallback(event => {

    setFillData(event['data'])

  }, []);

  useEffect(() => {
    fetchx(API_URL + '/getForexCompleteDetails?hotelID=1')

      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
      })


    fetchx(API_URL + '/getReservationForFrontDeskInHouseGuest')
      .then(result => result.json())
      .then(resp => {
        for (let i = 0; i < resp['data'].length; i++) {
          resp['data'][i]['value'] = resp['data'][i]['roomNumber']
          resp['data'][i]['label'] = resp['data'][i]['roomNumber']

        }
        InHouseGuestOptions = resp['data']

      })

    fetchx(API_URL + '/getDailyRateForexInf?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        setAllCurrency(resp['data'])
        for (let i = 0; i < resp['data'].length; i++) {
          resp['data'][i]['value'] = resp['data'][i]['currencyID']
          resp['data'][i]['label'] = resp['data'][i]['currencyName']

        }
        currencyCodeOptions = resp['data']

      })

  }, [businessDate]);

  const [amount, setAmount] = useState()
  const handleAmountChange = (value) => {
    setAmount(value);
    let equivalentAmount = value * SelectedCurrency['rateForTheDay']
    let CGST = 0;
    let SGST = 0;

    if (equivalentAmount < 25000) {
      CGST = 22.50;
      SGST = 22.50;
    } else {
      CGST = (equivalentAmount * 0.09) * 0.01;
      SGST = (equivalentAmount * 0.09) * 0.01;
    }

    let total = Math.floor(equivalentAmount - CGST - SGST);

    // Calculate roundoffTotalAmount with only two decimal places
    let roundOff = ((equivalentAmount - CGST - SGST) - total).toFixed(2);
    AmtJSON['equivalentAmount'] = equivalentAmount.toFixed(2)
    AmtJSON['CGST'] = CGST.toFixed(2)
    AmtJSON['SGST'] = SGST.toFixed(2)
    AmtJSON['total'] = total,
      AmtJSON['roundOff'] = roundOff
    setcurrencyAmount(AmtJSON)

  };

  const confirmFormSubmit = (data) => {
    setData(data);
    setshow(!show)

  }
  const onSubmit = () => {
    setData(data);
    setshow(!show)
    if (data && data.room !== null) {
      let createrateCode = JSON.stringify({
        "hotelID": 1,
        "room": roomNumber,
        "reservationID": SelectedRoom['id'],
        "guestProfileID": SelectedRoom['guestID'],
        "currencyID": Currency,
        "rateForTheDay": RateForTheDay,
        "amount": data.amount,
        "equivalentAmount": AmtJSON['equivalentAmount'],
        "CGST": AmtJSON['CGST'],
        "SGST": AmtJSON['SGST'],
        "total": AmtJSON['total'],
        "roundOff": AmtJSON['roundOff']

      });

      let res = fetchx(API_URL + "/addForexInf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: createrateCode,
      }).then((res) => {

        if (res["status"] == 200) {
          const swalInstance = MySwal.fire({
            text: 'Data submitted Successfully!',
            icon: 'success',
            buttonsStyling: false,
            allowOutsideClick: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });
          navigate('');
          swalInstance.then((result) => {
            if (result.isConfirmed) {
              navigate('');
              setForexTemplate(true)

              fetchx(API_URL + '/getForexCompleteDetails?hotelID=?')
                .then((result) => result.json())
                .then((rowData) => {
                  setRowData(rowData["data"]);
                  navigate('');
                  //setForexTemplate(true)

                });
            }
          });

        }
        else {
          const swalInstance = MySwal.fire({
            text: res.message,
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Data Not Submitted',
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

      });
    }
  }

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box4').value
    );
  }, []);

  const handleReset = () => {

    setData([])
    setSelectedRoom([])
    setSelectedCurrency([])
    setcurrencyAmount([])
    setRateForTheDay([])

    reset({
      room: '',
      reservationID: '',
      firstName: '',
      currencyName: '',
      rateForTheDay: '',
      amount: '',
      equivalentAmount: ''

    })
  }
  const onCancel = () => {
    setshow(false)
    setData([])

  }
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div>
        <Modal isOpen={ForexTemplate} toggle={() =>
          setForexTemplate(!ForexTemplate)} className='modal-lg'>
          <ModalHeader className='modal-lg' toggle={() =>
            setForexTemplate(!ForexTemplate)}> </ModalHeader>
          <ModalBody className='pb-3 px-sm mx=10'>

            <ForexTemplates data1={Filldata} />
          </ModalBody>
        </Modal>
      </div>

      <div>
        <Col md='3' sm='12' className='mb-1'>
          <Label className='form-label' for='fullName'>
            Search
          </Label>
          <Input
            type="text"
            id="filter-text-box4"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
          />
        </Col>
      </div>

      <div>
        <Modal
          isOpen={forexCancellation}
          toggle={() => setForexCancellation(!forexCancellation)}
          className="modal-xl"
        >
          <ModalHeader
            className="bg-transparent"
            toggle={() => setForexCancellation(!forexCancellation)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              <ForexCancellation data1={Filldata} />

            </div>
          </ModalBody>
        </Modal>
      </div>

      <Modal
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
        className='modal-dialog-centered'
      >

        <ModalHeader className='bg-transparent' toggle={() => {
          setShowModal(!showModal);
        }}></ModalHeader>
        <ModalBody className='px-sm-3 mx-3 pb-3'>
          <h1 className='text-center mb-1'>{showModal}</h1>
          <p className='text-center'>
            <h5 className="font-weight-900">Past Forex cannot be cancelled</h5>
          </p>

          <Row>
            <Col className='text-center mt-1' xs={12}>

              <Button
                color='primary'
                onClick={() => {
                  // window.location.reload()
                  setShowModal(!showModal)
                }}
              >
                OK

              </Button>
            </Col>
          </Row>

        </ModalBody>

      </Modal>


      {/* Select Rooms */}
      <div>
        <Modal isOpen={RoomSearch} toggle={() =>
          setRoomSearch(!RoomSearch)} className='modal-lg'>
          <ModalHeader className='modal-lg' toggle={() =>
            setRoomSearch(!RoomSearch)}> View Guest</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <Row className='mb-1'>
              <Col md='3' sm='12' className='me-1'>
                <Label className='form-label' for='fullName'>
                  Search
                </Label>
                <Input
                  type="text"
                  id="filter"
                  placeholder="Filter..."
                  onInput={onFilter}
                />
              </Col>

            </Row>
            <div className="ag-theme-alpine" style={{ height: 520 }}>
              <AgGridReact
                ref={gridRef}
                rowData={rowData2}
                columnDefs={columnDefs2}
                animateRows={true}
                rowSelection='multiple'
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


      {/* Select currency */}

      <div>
        <Modal isOpen={CurrencySearch} toggle={() =>
          setCurrencySearch(!CurrencySearch)} className='modal-lg'>
          <ModalHeader className='modal-lg' toggle={() =>
            setCurrencySearch(!CurrencySearch)}> View Currency</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <Row className='mb-1'>
              <Col md='3' sm='12' className='me-1'>
                <Label className='form-label' for='fullName'>
                  Search
                </Label>
                <Input
                  type="text"
                  id="filter"
                  placeholder="Filter..."
                  onInput={onFilter}
                />
              </Col>

            </Row>
            <div className="ag-theme-alpine" style={{ height: 520 }}>
              <AgGridReact
                ref={gridRef}
                rowData={AllCurrency}
                columnDefs={CurrencyColumnDefs}
                animateRows={true}
                rowSelection='multiple'
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

      <div>
        <Accordion open={open} toggle={toggle}>
          <AccordionItem>
            <AccordionHeader targetId='1'><h4><b>Sell Forex </b> </h4></AccordionHeader>
            <AccordionBody accordionId='1'>
              <Card>
                <CardHeader>
                  <CardTitle tag='h4'>Forex</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={handleSubmit(confirmFormSubmit)}>
                    <Row>

                      <Col md='4' sm='12'>
                        <div className='mb-1'>
                          <Label className='form-check-label'>
                            Room Number

                            <Input
                              name='Room'
                              value={SelectedRoom['roomNumber']} onClick={() => setRoomSearch(!RoomSearch)}
                              readOnly
                            />

                          </Label>


                        </div>
                      </Col>

                      <Col md="3" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="guestName">
                            Guest Name
                          </Label>
                          <Controller
                            control={control}
                            id="guestName"
                            name="guestName"
                            render={({ field }) => (
                              <Input
                                required
                                disabled={true}
                                placeholder="guestName"
                                {...field}
                                value={SelectedRoom['guestName']}
                              />
                            )}
                          />
                        </div>
                      </Col>

                      <Col md="3" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="names">
                            Booking ID
                          </Label>
                          <Controller

                            control={control}
                            id="bookingID"
                            name="bookingID"
                            render={({ field }) => (
                              <Input
                                disabled={true}
                                required
                                placeholder="reservationID"
                                {...field}
                                value={SelectedRoom['bookingID']}
                              />
                            )}
                          />
                        </div>
                      </Col>


                      <Col md='4' sm='12'>
                        <div className='mb-1'>
                          <Label className='form-check-label'>
                            Currency
                            <Input required
                              name='Currency'
                              value={SelectedCurrency['currencyName']} onClick={() => setCurrencySearch(true)}
                              readOnly
                            />
                          </Label>


                        </div>
                      </Col>



                      <Col md='4' sm='12'>
                        <div className='mb-1'>
                          <Label className='form-label' for='amount'>
                            Rate For The Day
                          </Label>
                          <InputGroup className='input-group-merge'>

                            <Controller
                              id='rateForTheDay'
                              name='rateForTheDay'
                              control={control}

                              render={({ field }) => (
                                <Input
                                  required
                                  placeholder='rateForTheDay'
                                  disabled={true}

                                  {...field}
                                  value={RateForTheDay}

                                />
                              )}
                            />
                          </InputGroup>
                        </div>
                      </Col>

                      <Col md='4' sm='12'>
                        <div className='mb-1'>
                          <Label className='form-label' for='amount'>
                            Currency Amount
                          </Label>
                          <InputGroup className='input-group-merge'>
                            <Controller
                              id='amount'
                              name='amount'
                              control={control}
                              render={({ field }) => (
                                <Input
                                  disabled={SelectedCurrency.length == 0}
                                  type="text"
                                  placeholder="amount"
                                  pattern="[0-9]{1,15}"
                                  title="Amount can contain numbers. It cannot contain alphabets and
                                special characters."
                                  required
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value);
                                    handleAmountChange(value);
                                  }}
                                />
                              )}
                            />
                          </InputGroup>
                        </div>
                      </Col>



                      <Col md='4' sm='12'>
                        <div className='mb-1'>
                          <Label className='form-label' for='amount'>
                            Equivalent Amount(INR)
                          </Label>
                          <InputGroup className='input-group-merge'>

                            <Controller
                              id='equivalentAmount'
                              name='equivalentAmount'
                              control={control}

                              render={({ field }) => (
                                <Input
                                  disabled={true}
                                  required
                                  placeholder='equivalentAmount'
                                  {...field}
                                  value={currencyAmount['equivalentAmount']}
                                  readOnly
                                />
                              )}
                            />
                          </InputGroup>
                        </div>
                      </Col>

                      <div className='d-flex'>
                        <Button className='me-1' color='primary' type='submit' >
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
        <Card>
          <div className="ag-theme-alpine" style={{ height: 540 }}>
            <AgGridReact
              ref={gridRef1}
              rowData={rowData} columnDefs={columnDefs}
              animateRows={true} rowSelection='multiple'
              onCellClicked={cellClickedListener}
              // paginationAutoPageSize = 'true'
              paginationPageSize='10'
              pagination='true'
              defaultColDef={defaultColDef}
              headerColor="ddw-primary"

            />
          </div>

        </Card>
      </div>

      <Modal
        isOpen={show} toggle={() => setshow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader toggle={() => setshow(!show)} className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Preview Forex</h1>
          {data && data.length !== 0 && (
            <>
              <h6>Room Number: {SelectedRoom.roomNumber}</h6>
              {/* <h6>Date:<b>{data.date}</b></h6> */}
              <h6>Guest Name :<b>{SelectedRoom.guestName}</b></h6>
              <h6>Booking ID: <b>{SelectedRoom['bookingID']}</b></h6>
              <h6>Reservation Status :<b>{SelectedRoom.reservationStatus}</b></h6>
              <h6>Currency: <b>{SelectedCurrency.currencyName}</b></h6>
              <h6>Foreign Amount:<b>{data.amount}</b></h6>
              <h6>Rate For The Day: <b>{SelectedCurrency.rateForTheDay}</b></h6>
              <h6>Equivalent Amount(INR): <b>{currencyAmount.equivalentAmount}</b></h6>
              <h6>CGST: <b>{currencyAmount.CGST}</b></h6>
              <h6>SGST: <b>{currencyAmount.SGST}</b></h6>
              <h6>Total Amount given to the guest: <b>{currencyAmount.total}</b></h6>
              <h6>Roundoff: <b>{currencyAmount.roundOff}</b></h6>
            </>)}

          <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button className='me-1' color='primary' onClick={() => onSubmit()}>
                Confirm Forex
              </Button>
              <Button outline color='secondary' type='reset' onClick={() => { onCancel() }}>
                Cancel
              </Button>
            </Col>
          </Row>
        </ModalBody>


      </Modal>



      <Modal
        isOpen={showErrorMsg}
        toggle={() => setshowErrorMsg(!showErrorMsg)}
        className='modal-dialog-centered'
      >

        <ModalHeader className='bg-transparent' toggle={() => {
          setshowErrorMsg(!showErrorMsg);
        }}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h3 className='text-center mb-1'>{showErrorMsg}</h3>

          <Row>
            <Col className='text-center mt-1' xs={12}>

              <Button
                color='primary'
                onClick={() => {
                  // window.location.reload()
                  setshowErrorMsg(!showErrorMsg)
                }}
              >
                OK
              </Button>
            </Col>
          </Row>

        </ModalBody>

      </Modal>

      <Modal isOpen={ShowForexPDF} toggle={() => setShowForexPDF(!ShowForexPDF)} style={{ height: '200px' }} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowForexPDF(!ShowForexPDF)}>PMS Invoice</ModalHeader>

        <iframe style={{ height: '85vh' }} src={ForexURL}> </iframe>
      </Modal>
    </div>
  );
}
export default Forex
