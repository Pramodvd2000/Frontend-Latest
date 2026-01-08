// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import {Button, Modal, ModalHeader, ModalBody, Card, CardBody, } from 'reactstrap'
import API_URL from '../../../config'
import {useState, useRef, useEffect, useMemo, useCallback} from 'react'

function App(data1) {
  const [filldata, setfilldata] = useState('')
  const modalClose = () => {setModal(false)}
  const [displayRatesummary, setDisplayRateSummary] = useState(false)
  const [modal, setModal] = useState(false)
  const [details,setDetails] = useState('')
  const gridRef = useRef();

  //new
  const [ReservationAlerts, setReservationAlerts] = useState([]);
  const [resAlert ,setResAlert]= useState(null);
  const [disResAlert ,setdisResAlert]= useState(false);
  const fetchReservationAlerts = async () => {
    try {
      const result = await fetchx(API_URL + `/getReservationAlerts?hotelID=10&reservationID=${data1.data1.id}`);
      const resp = await result.json();
      if(resp['data'][0]['reservationAlert'].length !== 0){
        setdisResAlert(true)
        setResAlertsetReservationAlerts(resp['data'][0]['reservationAlert']);
        setReservationAlerts(resp['data'][0]['reservationAlert']);
      }
      else{
        setdisResAlert(false)
      }
    } catch (error) {
      console.error('Error fetching reservation alerts:', error);
    }
  };
//-------------//
  const cellClickedListener = useCallback(event => {
  })

  const defaultColDef = useMemo(() => (
    { sortable: true,
      filter: true,
      filterParams: {
      buttons: ['apply', 'reset']
      }
    }
  ))

  //AG-GRID columns to show rate summary
  const [columnDefs2, setColumnDefs2] = useState([
    { headerName: 'Date', field: 'Date', maxWidth: 120, sort: 'asc' },
    { headerName: 'Base Price', field: 'baseprice', maxWidth: 120 },
    { headerName: 'Package Rate', field: 'packageRevenue', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Total', field: 'subTotal', suppressSizeToFit: true, maxWidth: 100 },
    { headerName: 'Tax', field: 'totalTaxGenerated', suppressSizeToFit: true, maxWidth: 100 },
    { headerName: 'Total With Tax', field: 'total', suppressSizeToFit: true, maxWidth: 150 },
    { headerName: 'PackageCode', field: 'packageCode', suppressSizeToFit: true, maxWidth: 140 },
    { headerName: 'Extra Adult Price', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 165 },
    { headerName: 'Child Price', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 125 },
  ])

useEffect(() => {
  fetchReservationAlerts();


  fetchx(API_URL + "/getReservationGuestDetails", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID:'1',
          reservationID:data1.data1.id,
          })
      }).then(result => result.json())
      .then(rowData => {
   
          setDetails(rowData['data'][0]) 
      }).catch((error) => {
        })
  }, [])


  useEffect(() => {
      fetchx(API_URL + `/getCompleteReservation?reservationID=${data1.data1.tempReservationID}`)
      .then(result => result.json())
      .then(rowData => {
        console.log("filldata",rowData['data'])
        setfilldata(rowData['data'])
      })
  }, []) 

  const openModal = () => {
    fetchx(API_URL + '/getFinalRates', {
      method: 'POST',
      body: JSON.stringify({
        dailyDetails: filldata
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then((res) => res.json())
      .then(postres => {
        setDisplayRateSummary(postres['data'])
      })
    setModal(true)
  }

  return (
    <div>
     
{/* new */}
<div>
        <Modal isOpen={disResAlert}
          toggle={() => setdisResAlert(!disResAlert)} className="modal-sm">
          <ModalHeader className="modal-lg" toggle={() => setdisResAlert(!disResAlert)} ></ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              {resAlert}
           <br/>
              <Button
                  color="primary"
                  className="me-1"
                  // className="text-center"
                  onClick={() => {
                    setdisResAlert(false);
                  }}
                >
                  OK
                </Button>
            </div>
          </ModalBody>
        </Modal>
      </div>




    <Card><CardBody>
      {/* {filldata.length  ? ( */}
        <div className="reservation-card">
       {/* Stay Details */}
       <div className="section">
              <h3>Stay Details</h3>
              <div className="info-table">
                <table>
                  <tbody>
                    <tr>
                      <td>  Guest Name</td>
                      <td><b>{details['salutation']} {details['firstName']}  {details['lastName']}</b></td>
                      <td> Rate Code:</td>
                      <td><b>{details['rateCode']}</b></td>
                    </tr>
                    <tr>
                      <td> Arrival Date:</td>
                      <td><b>{details['arrivalDate']}</b></td>
                      <td> ETA:</td>
                      <td><b>{details['ETA']}</b></td>
                    </tr>
                    <tr>
                      <td>  Departure Date:</td>
                      <td><b>{details['departureDate']}</b></td>
                      <td> ETD:</td>
                      <td><b>{details['ETD']}</b></td>
                    </tr>
                    <tr>
                      <td> PAX:  </td>
                      <td>
                        <b>{details['numberOfAdults']} {" + "} {details['numberOfChildren']}</b>
                      </td>
                      <td> Number of Rooms:</td>
                      <td><b>{details['numberOfRooms']}</b></td>
                    </tr>
                    <tr>
                      <td>Pickup Date:</td>
                      <td><b>{details['pickUpDate']}</b></td>                     
                      <td>Pickup Time:</td>
                      <td><b>{details['pickUpTime']}</b></td>
                    </tr>
                    <tr>
                      <td>Drop Date:</td>
                      <td><b>{details['dropDate']}</b></td>
                      <td>Drop Time:</td>
                      <td><b>{details['dropTime']}</b></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <br></br><br></br>
              <h3>Rate Details</h3>
              <div className="info-table">
                <table>
                  <td><a style={{ color: 'blue' }} onClick={openModal}>click here to view rate </a></td>
                </table>
              </div>
            </div>

            {/* Extras */}
            <div className="section">
              <h3>Extra Information</h3>
              <div className="info-table">
                <table>
                  <tbody>
                    <tr>
                      <td>Reservation Type:</td>
                      <td><b>{details['reservationTypeDescription']}</b></td>
                      <td>Package:</td>
                      <td><b>{details['packageCode']}</b></td>
                    </tr>
                    {/* <tr>
                      <td>Booker:</td>
                      <td>{details['booker']}</td>
                    </tr> */} 
                    <tr>
                      <td>Source:</td>
                      <td><b>{details['sourceCode']}</b></td>
                      <td>Market:</td>
                      <td><b>{details['marketCode']}</b></td>
                    </tr>
                    <tr>
                      <td>Extra Description:</td>
                      <td><b>{details['extra']}</b></td>
                      <td></td><td></td>
                    </tr>
                    <tr>
                      <td>Features:</td>
                      <td><b>{details['preferenceName']}</b></td>
                      <td></td><td></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <br></br><br></br><br></br>
              <h3>Payment Information</h3>
              <div className="info-table">
                <table>
                  <tbody>
                    {
                      details['paymentType'] === 'Credit Card' ? (
                        <><tr>
                          <td>Payment Type:</td>
                          <td><b>{details['paymentTypeCode']}</b></td>
                        </tr><tr>
                            <td>Card Holder Name:</td>
                            <td><b>{details['nameOnCard']}</b></td>
                          </tr><tr>
                            <td>Expiry Date:</td>
                            <td><b>{details['expiryDate']}</b></td>
                          </tr></>

                      ) : (
                        <tr>
                          <td>Payment Type:</td>
                          <td><b>{details['paymentTypeCode']}</b></td>
                        </tr>
                      )

                    }
                  </tbody>
                </table>
              </div>
            </div>
            {
        modal &&
        <Modal isOpen={modal} toggle={() => setModal(!modal)} className='modal-xl'>
          <ModalHeader className='modal-sm' toggle={() => setModal(!modal)}>
            Rate summary
          </ModalHeader>
          <ModalBody className='pb-3 px-sm-5 mx-20'>
            <div className="ag-theme-alpine" style={{ height: 385 }}>
              <AgGridReact
                ref={gridRef}
                rowData={displayRatesummary}
                columnDefs={columnDefs2}
                animateRows={true}
                rowSelection='multiple'
                onCellClicked={cellClickedListener}
                paginationPageSize='10'
                defaultColDef={defaultColDef}
                headerColor="ddw-primary"
              />
            </div>
            <div>
              <Button color='primary' className='me-1' style={{ float: 'right' }} onClick={modalClose}>
                Back
              </Button>
            </div>
          </ModalBody>
        </Modal>
      }
          </div> 
      </CardBody></Card>
    </div>
  )
}
export default App