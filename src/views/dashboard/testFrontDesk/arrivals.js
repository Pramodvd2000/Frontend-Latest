// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// import './Assettable.css';
import {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { Button, Modal, ModalBody, ModalHeader,Card,CardBody,CardHeader,Row,Col,Label,Input } from 'reactstrap';
import { format } from "date-fns";
import AssignRoom from './assignRoom';
// import ForCheckInIdDetails from './forCheckInIdDetails'
import { Check, Circle,Edit2,PlusCircle,Eye,ArrowRightCircle,AlertTriangle } from "react-feather";
import API_URL from '../../../config';
import CheckIn from './check-in';
import UnAssignRoom from './unAssign';
import AddSharer from "./addSharer";
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'


var Today = format(new Date(), "yyyy-MM-dd")


localStorage.removeItem('reservationStart');
localStorage.removeItem('reservationEnd');
function Arrivals() {
  const [rowData, setRowData] = useState();
  const [form, setSharer] = useState();
  const [checkIn, setCheckIn] = useState();
  const [show, setShow] = useState();
  const [assign, setAssign] = useState(false)
  const [filldata,setfilldata] = useState('');
  const [options, setOptions] = useState();
  const [unAssign, setUnAssign] = useState()
  const [cancelCheckIn, setCancelCheckIn] = useState();
  const [addSharer, setAddSharer] = useState(false);
  const [popUp, setPopUp] = useState();





  const gridRef = useRef();
  
  
  const [columnDefs, setColumnDefs] = useState([
    {headerName: 'BookingID',field: 'bookingID',suppressSizeToFit: true,maxWidth: 100},
    {headerName: 'Guest',field: 'firstName',suppressSizeToFit: true,maxWidth: 125},
    {headerName: 'Company',field: 'accountName',suppressSizeToFit: true,maxWidth: 140},
    {headerName: 'Arrival',field: 'arrivalDate',suppressSizeToFit: true,maxWidth: 140},
    {headerName: 'Departure',field: 'departureDate',suppressSizeToFit: true,maxWidth: 140},
    {headerName: 'Room Type',field: 'roomType',suppressSizeToFit: true,maxWidth: 130},
    {headerName: 'Status',field: 'reservationStatus',suppressSizeToFit: true,maxWidth: 130},
    {headerName: 'Room No.',field: 'roomNumber',suppressSizeToFit: true,maxWidth: 120},
    {headerName: 'Actions',cellRendererFramework: (params) => <Button color='primary'  style={{ width: 128}} onClick={() => setOptions(!options)} >Actions</Button>,suppressSizeToFit: true},
    {headerName: 'SubBookingID',field: 'subBookingID',suppressSizeToFit: true,maxWidth: 100},
    {headerName: 'Market Code',field: 'marketCode',suppressSizeToFit: true,maxWidth: 140},
    {headerName: 'Source Code',field: 'sourceCode',suppressSizeToFit: true,maxWidth: 140},
    {headerName: 'Account Name',field: 'accountName',suppressSizeToFit: true,maxWidth: 140},
    {headerName: 'Rate Code',field: 'rateCode',suppressSizeToFit: true,maxWidth: 140},
    {headerName: 'Origin',field: 'origin',suppressSizeToFit: true,maxWidth: 140},
  ]);


  const defaultColDef = useMemo( ()=> (
    {
      sortable: true, 
      filter: true,
      filterParams :{
      buttons : ['apply','reset']
      }
    }
  ));

  const cellClickedListener = useCallback( event => {
    //console.log('cellClicked', event);
  //console.log(event['data'])
  setfilldata(event['data'])
  localStorage.setItem('reservationStart',event['data']['arrivalDate']);
  localStorage.setItem('reservationEnd',event['data']['departureDate']);
  localStorage.setItem('reservationRoomType',event['data']['roomType']);


  }, []);

  useEffect(() => {
    fetchx(API_URL+'/getReservationForFrontDeskToday?Start='+Today)
    .then(result => result.json())
    .then(rowData => {setRowData(rowData['data'])
    //console.log(rowData)

})
  }, []);



  const buttonListener = useCallback( e => {
    gridRef.current.api.deselectAll();
  }, []);


  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box1').value
    );
  }, []);

  return (
    <div>
      {/* <button onClick={buttonListener}>Push Me</button> */}
      <div>
      <Col md='3' sm='12' className='mb-1'>
      <Label className='form-label' for='fullName'>
            Search
      </Label>
      <Input
            type="text"
            id="filter-text-box1"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
          />
          </Col>
      </div>
      <div id="myGrid"
          style={{
            boxSizing: "border-box",
            height:520
          }}
          className="ag-theme-alpine" >
        <AgGridReact 
            ref={gridRef}
            rowData={rowData} columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            paginationAutoPageSize = 'true'
            paginationPageSize= '10'
            pagination = 'true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            
            />
      </div>
  
      <div>
    <Modal isOpen={assign} toggle={() => setAssign(!assign)} className='modal-xl'>
        <ModalHeader className='modal-xl' toggle={() => setAssign(!assign)}></ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>
          <div>
            {/* <AssignRoom/> */}
            {filldata.length!=0 && <AssignRoom data1={filldata} />}
          </div>
        </ModalBody>
      </Modal>
      </div>
      <div>
        <Modal
          isOpen={addSharer}
          toggle={() => setAddSharer(!addSharer)}
          className="modal-xl"
        >
          <ModalHeader
            className="bg-transparent"
            toggle={() => setAddSharer(!addSharer)}
          ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              {/* {filldata.length!=0 &&  filldata.numberOfRooms > 1 ? (setPopUp("You have selected more then 1 room need to split the reservation")) : <AddSharer data1={filldata} />} */}
              {filldata.length != 0 && <AddSharer data1={filldata} />}
            </div>
          </ModalBody>
        </Modal>
      </div>
      <div>
    <Modal isOpen={checkIn} toggle={() => setCheckIn(!checkIn)} className='demo-inline-spacing'>
        <ModalHeader className='bg-transparent' toggle={() => setCheckIn(!checkIn)}></ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>
          <div>
          {filldata.length!=0 && <CheckIn data1={filldata} />}
          </div>
        </ModalBody>
      </Modal>
      </div>

{/* <div>
    <Modal isOpen={checkIn} toggle={() => setCheckIn(!checkIn)} className='modal-lg'>
        <ModalHeader className='modal-lg' toggle={() => setCheckIn(!checkIn)}></ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>
          <div>
          {filldata.length!=0 && <ForCheckInIdDetails data1={filldata}  />}
          </div>
        </ModalBody>
      </Modal>
      </div> */}
      <div>
    <Modal isOpen={unAssign} toggle={() => setUnAssign(!unAssign)} className='demo-inline-spacing'>
        <ModalHeader className='bg-transparent' toggle={() => setUnAssign(!unAssign)}></ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>
          <div>
          {filldata.length!=0 && <UnAssignRoom data1={filldata} />}
          </div>
        </ModalBody>
      </Modal>
      </div>
      <div></div>
      <div>
    <Modal isOpen={options} toggle={() => setOptions(!options)} className='modal-lg' >
        <ModalHeader className='modal-lg' toggle={() => {setOptions(!options) }}>I Want To..</ModalHeader>
        <ModalBody className='pb-3 px-sm-2 mx-20'>
          <div >
            <Card style={{backgroundColor:'#F2E5D9'}}>
              <Row className='cardBody'>
            <Col md='3' sm='12' className='mb-1'>
            <div><h5><Edit2 style={{height:'20px'}}/>Modify/Update</h5></div>
            <div>
                <div className='hoverUnderline' onClick={() =>{ setAssign(!assign)
                localStorage.removeItem('id')} }>Assign Room</div>
                <div onClick={() => setCheckIn(!checkIn)} className='hoverUnderline'>Begin CheckIn</div>
                {/* <div className='hoverUnderline'>Cancel CheckIn</div> */}
                <div className='hoverUnderline' onClick={() => setUnAssign(!unAssign)}>Un-Assign Room</div>
                {/* <div
                        className="hoverUnderline"
                        onClick={() => {
                          if (filldata.numberOfRooms > 1) {
                            setPopUp(
                              "You have selected more then 1 room need to split the reservation"
                            );
                          } else if (
                            filldata.arrivalDate < Today &&
                            filldata.departureDate < Today
                          ) {
                            setPopUp(
                              "You can't add sharer because you crossed the departure date"
                            );
                          } else {
                            setAddSharer(true);
                          }
                        }}
                      >
                        Add Sharer
                      </div> */}
                {/* <div className='hoverUnderline'>Modify Reservation</div> */}

                </div>
                </Col>
                <Col md='3' sm='12' className='mb-1'>
            <div><h5><PlusCircle style={{height:'20px'}}/>Create</h5></div>

                <div className='hoverUnderline'>Copy Reservation</div>
                <div className='hoverUnderline'>e-Sign Registration Card</div>
                <div className='hoverUnderline'>Registration Card</div>

                </Col>
                <Col md='3' sm='12' className='mb-1'>
            <div><h5><Eye style={{height:'20px'}}/>View</h5></div>

                <div className='hoverUnderline'>Changes Log</div>

                </Col>
                <Col md='3' sm='12' className='mb-1'>
            <div><h5><ArrowRightCircle style={{height:'20px'}}/>Go To</h5></div>

                <div className='hoverUnderline'>Profile</div>
                <div className='hoverUnderline'>Reservation</div>
                </Col>
                </Row>

                </Card> 

                <Row className='cardBody'>
                  <Col md='6' sm='12' className='mb-1'>
                    <h5>Reservation</h5>
                    <div className='hoverUnderline'><b>Confirmation Letter</b></div>
                    <div className='hoverUnderline'><b>Pro-Form Folio</b></div>
                    <div className='hoverUnderline'><b>Stay Details</b></div>
                    <br></br>
                    
                    <h5>Notifications</h5>
                    <div className='hoverUnderline'><AlertTriangle style={{height:'20px'}}/><b>Alerts</b></div>


                  </Col>
                  <Col md='6' sm='12' className='mb-1'>
                  <h5>Billing</h5>
                    <div className='hoverUnderline'><b>Deposit Cancellation</b></div>
                    <div className='hoverUnderline'><b>Payment instructions</b></div>
                    <br></br>
                    <h5>Profile</h5>
                    <div className='hoverUnderline'><b>Communication</b></div>
                    <div className='hoverUnderline'><b>Future & Past Stays</b></div>
                    <div className='hoverUnderline'><b>Preferences</b></div>

                    </Col>
                </Row>
          </div>
        </ModalBody>
      </Modal>  
      </div>
      {popUp && (
        <div className="disabled-animation-modal">
          <Modal
            isOpen={popUp}
            toggle={() => setPopUp(!popUp)}
            className="modal-sm"
          >
            {" "}
            {/*onClosed={onDiscard}*/}
            <ModalHeader
              className="modal-sm"
              toggle={() => {
                setPopUp(!popUp);
              }}
            >
              Need To Check..
            </ModalHeader>
            <ModalBody className="pb-3 px-sm-2 mx-20">
              <div>
                <b>{popUp}</b>
                <br></br>
                <br></br>
                <Button
                  color="primary"
                  className="text-center"
                  onClick={() => setPopUp(false)}
                >
                  Ok
                </Button>
              </div>
            </ModalBody>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default Arrivals;