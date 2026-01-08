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
import CancelForexCertificate from './cancelForexCertificate'
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
var active = true;

// import App from "./datagrid"
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
  const [showForexTemplates, setShowForexTemplates] = useState();
  const [forexCancellation, setForexCancellation] = useState();
  const [ShowForexPDF, setShowForexPDF] = useState(false)
  const [ForexURL, setForexURL] = useState([])



  let result = []
  let navigate = useNavigate();


  const [currencyAmount, setcurrencyAmount] = useState('');
  const gridRef = useRef();

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
  const [filterValue, setFilterValue] = useState('');

  const onFilterTextBoxChanged = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setQuickFilter(filterValue);
    }
  }, [gridRef, filterValue]);


  const [columnDefs2, setColumnDefs2] = useState([
    { headerName: 'Room', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 170 },
    { headerName: 'Guest Name', field: 'guestName', suppressSizeToFit: true, maxWidth: 300 },
    { headerName: 'BookingID', field: 'bookingID', suppressSizeToFit: true, maxWidth: 300 },
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

  const getForexCertificate = (data) => {
    if(!is_test){
      fetchx(API_URL + "/gets3DocumentIDPMS", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: 1,
          DocName: 'VoidForexCertificate',
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
      setForexURL(API_URL+"/imagepaths/PMS_BACKEND/CertificatesForex/VoidForexCertificate_" + data.hotelID + "_" + data.certificateNo + "_" + data.reservationID + ".pdf")
      setShowForexPDF(true)
      
    }
  }
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
    setCurrency(event['data']['id'])
    setRateForTheDay(event['data']['rateForTheDay'])
    setCurrencySearch(false);
  };

  const [info, setInfo] = useState('')

  const postForexRequest = (data) => {
    const apiUrl = API_URL + '/postCancelledForex'; // Replace with your server's API URL

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

  const onselect = (event) => {
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
        console.log('Response Data:', responseData);

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
  };

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
      headerName: 'Cancel', suppressSizeToFit: true, cellStyle: { 'textAlign': 'center', 'backgroundColor': 'white' }, maxWidth: 160,
      cellRendererFramework: (params) => <Button color='primary' onClick={() => { getForexCertificate(params.data) }}> View </Button>
    },

    { headerName: 'Currency', field: 'currencyName', cellStyle: { 'textAlign': 'center', 'backgroundColor': 'pink' }, maxWidth: 860 },
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
    fetchx(API_URL + '/getForexCancelDetails?hotelID=1&isCancelled=1')

      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
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

  }, []);
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
          swalInstance.then((result) => {
            if (result.isConfirmed) {
              navigate('');
              setForexTemplate(true)

              fetchx(API_URL + '/getForexCancelDetails?hotelID=1&isCancelled=1')
                .then((result) => result.json())
                .then((rowData) => {
                  setRowData(rowData["data"]);
                  navigate('');
                  setForexTemplate(true)

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

  const handleReset = () => {
    setshow(false)
    setData([])
    setSelectedRoom([])
    setSelectedCurrency([])
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

  return (
    <div>
      <div>
        <Modal isOpen={ForexTemplate} toggle={() =>
          setForexTemplate(!ForexTemplate)} className='modal-lg'>
          <ModalHeader className='modal-lg' toggle={() =>
            setForexTemplate(!ForexTemplate)}> </ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>

            <CancelForexCertificate data1={Filldata} />
          </ModalBody>
        </Modal>

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
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </Col>
      </div>


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

      <br></br>

      <div>
        <Card>
          <div className="ag-theme-alpine" style={{ height: 540 }}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData} columnDefs={columnDefs}
              animateRows={true} rowSelection='multiple'
              onCellClicked={cellClickedListener}
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
              <h6>Guest Name :<b>{SelectedRoom.firstName}</b></h6>
              <h6>Booking ID: <b>{SelectedRoom['bookingID']}</b></h6>
              <h6>Reservation Status :<b>{SelectedRoom.reservationStatus}</b></h6>
              <h6>Currency: <b>{SelectedCurrency.currencyName}</b></h6>
              <h6>Amount:<b>{data.amount}</b></h6>
              <h6>Rate For The Day: <b>{SelectedCurrency.rateForTheDay}</b></h6>
              <h6>Equivalent Amount: <b>{currencyAmount.equivalentAmount}</b></h6>
              <h6>CGST: <b>{currencyAmount.CGST}</b></h6>
              <h6>SGST: <b>{currencyAmount.SGST}</b></h6>
              <h6>Total: <b>{currencyAmount.total}</b></h6>
            </>)}

          <Row>
            <Col className='text-center mt-1' xs={12}>
              <Button className='me-1' color='primary' onClick={() => onSubmit()}>
                Confirm Forex
              </Button>
              <Button outline color='secondary' type='reset' onClick={() => { handleReset() }}>
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
