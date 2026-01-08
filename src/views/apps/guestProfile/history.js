import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import { Input, Card, Form, Row, Col, Label, Button, Modal, ModalHeader, ModalBody, } from "reactstrap";
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Edit2, PlusCircle, Eye, ArrowRightCircle, File } from 'react-feather';
import API_URL from "../../../config";
import Attachments from '../../dashboard/testFrontDesk/attachments';
import ReservationActionsModal from "./ReservationActionsModal";




function App(data1) {
  console.log("history", data1.data1)
  console.log("history", data1.data1.id)

  const [rowData, setRowData] = useState();
  const [options, setOptions] = useState();
  const [filldata, setfilldata] = useState("");
  const [stayNotification, setStayNotification] = useState();
  const [details, setDetails] = useState()
  const [popUp, setPopUp] = useState();
  const [pytDetails, setPytDetails] = useState();


  let navigate = useNavigate();

  const gridRef = useRef();
  const navigatepage = () => {
    navigate('');
  };

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'BookingID', field: 'bookingID', suppressSizeToFit: true, maxWidth: 125, },
    { headerName: 'Arrival Date', field: 'arrivalDate', suppressSizeToFit: true, maxWidth: 130, },
    { headerName: 'Departure Date', field: 'departureDate', suppressSizeToFit: true, maxWidth: 160, },
    { headerName: 'Room Type', field: 'roomType', suppressSizeToFit: true, maxWidth: 130, },
    { headerName: 'Room', field: 'room', suppressSizeToFit: true, maxWidth: 100, },
    { headerName: 'Rate Code', field: 'rateCode', suppressSizeToFit: true, maxWidth: 120, },
    { headerName: 'Rate', field: 'rate', suppressSizeToFit: true, maxWidth: 100, },
    { headerName: 'Total Cost of Stay', field: 'totalCostOfStay', suppressSizeToFit: true, maxWidth: 170, },
    { headerName: 'Package', field: 'packageCode', suppressSizeToFit: true, maxWidth: 105, },

    {
      headerName: "Actions",
      cellRendererFramework: (params) => (
        <Button
          color="primary"
          style={{ width: 100 }}
          onClick={async () => {
            try {
              // Fetch data based on reservationID
              const reservationID = params.data.id;
              const response = await fetch(API_URL + `/getReservationForFrontDeskByResID?reservationID=${reservationID}`);
              const rowData = await response.json();

              // Update state with fetched data

              setfilldata(rowData.data[0]);

              // Toggle options after data is fetched
              setOptions(!options);
              // CallAlerts(rowData.data[0])
              // Store reservation ID in sessionStorage
              // <ReservationActionsModal />
              sessionStorage.setItem('reser_ID', reservationID);
            } catch (error) {
              console.error("Error fetching reservation data:", error);
            }
          }}
        >
          Actions
        </Button>
      ),
      suppressSizeToFit: true,
      cellStyle: { textAlign: 'center' },
      cellClass: 'vertical-center',
      maxWidth: 120
    },
    { headerName: 'Agent', field: 'accountType', suppressSizeToFit: true, maxWidth: 130, },
    { headerName: 'Company', field: 'accountName', suppressSizeToFit: true, maxWidth: 170, },
    { headerName: 'Reservation Status', field: 'reservationStatus', suppressSizeToFit: true },
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

  // const cellClickedListener = useCallback( event => {
  //   console.log('cellClicked', event);
  // }, []);

  useEffect(() => {
    fetchx(API_URL + `/getGuestHistoryDetails?guestID=${data1.data1.id}&reservationStatus=Checked Out `)
      .then(result => result.json())
      .then(rowData => setRowData(rowData['data']))
  }, []);
  console.log(localStorage.getItem("id"))

  const buttonListener = useCallback(e => {
    gridRef.current.api.deselectAll();
  }, []);


  const cellClickedListener = useCallback((event) => {



    fetchx(API_URL + "/getReservationGuestDetails", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: '1',
        reservationID: event['data']['id'],
      })
    })
      .then(result => result.json())
      .then(rowData => {
        //console.log(rowData['data']);
        setDetails(rowData['data'][0]);
        //console.log(rowData['data'][0]['guestID']);

        fetchx(API_URL + `/getResPaymentInformations?hotelID=1&reservationID=${event['data']['tempReservationID']}`)
          .then((result) => result.json())
          .then((rowData) => {
            setPytDetails(rowData["data"][0]);
            //console.log(rowData["data"]);
          })
          .catch((error) => {
            //console.log(error);
          });
      })
      .catch((error) => {
        //console.log(error);
      });


    // setfilldata(event["data"]);
    localStorage.setItem("data1", JSON.stringify(event["data"]));
    localStorage.setItem("reservationStart", event["data"]["arrivalDate"]);
    localStorage.setItem("reservationEnd", event["data"]["departureDate"]);
    localStorage.setItem("reservationRoomType", event["data"]["roomType"]);
    localStorage.setItem("SubBookingId", event["data"]["SubBookingId"]);
    localStorage.setItem("reservationGuest", event["data"]["End"]);
    localStorage.setItem("reservationID", event["data"]["id"]);
    sessionStorage.setItem("reservationID", event["data"]["id"]);
  }, []);


  return (
    <div>
      {/* <button onClick={buttonListener}>Push Me</button> */}
      <div className="ag-theme-alpine" style={{height: 520, width: "100%"}}>
        <AgGridReact
          ref={gridRef}
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

      <br />
      <br />
      <div align='end' className='buttons'>

        <Button color='primary' className='me-1' type='button' onClick={navigatepage}>
          Exit
        </Button>
      </div>

      {options && filldata &&
        <ReservationActionsModal isOpen={options} toggle={() => setOptions(!options)} filldata={filldata} details={details} pytDetails={pytDetails} />
      }


    </div>
  );
}

export default App;