
import { AgGridReact } from 'ag-grid-react'

import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import './ReservationCard.scss';
// ** Reactstrap Imports
import { Card, CardBody, Modal, ModalBody, ModalHeader, Button } from 'reactstrap'
// import { FcPortraitMode } from "react-icons/fc";
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import API_URL from '../../../config';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// import './reservation.scss'

const MySwal = withReactContent(Swal)
import { useNavigate } from "react-router-dom"
import sadDogImage from './image.jpg'; // Replace with the actual path to your image
import warningImage from './DailyDetailsWarningImage.jpeg'; // Replace with the actual path to your image
function App({ toggleModal }) {

  const [filldata, setfilldata] = useState('')
  const [modal, setModal] = useState(false)
  const [displayRatesummary, setDisplayRateSummary] = useState(false)
  const navigate = useNavigate()
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const gridRef = useRef();


  function modalClose() {
    toggleModal()
  }


  const cellClickedListener = useCallback(event => {
  })


  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ))


  //AG-GRID columns to show rate summary
  const [columnDefs2, setColumnDefs2] = useState([
    { headerName: 'Date', field: 'Date', maxWidth: 120, sort: 'asc' },
    {
      headerName: 'Total Before Discount', field: 'totalBeforeDiscount', maxWidth: 200,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Total Discount', field: 'totalDiscount', maxWidth: 165,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Total After Discount', field: 'subTotal', maxWidth: 190,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Tax', field: 'totalTaxGenerated', suppressSizeToFit: true, maxWidth: 100, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },

    {
      headerName: 'Total With Tax', field: 'total', suppressSizeToFit: true, maxWidth: 150, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Base Price', field: 'baseprice', maxWidth: 120, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Extra Adult Price', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 165, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Child Price', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 125, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Package Rate', field: 'packageRevenue', suppressSizeToFit: true, maxWidth: 140, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    { headerName: 'PackageCode', field: 'packageCode', suppressSizeToFit: true, maxWidth: 140 },
  ])


  useEffect(() => {
    // fetchx(API_URL + `/getCompleteReservation?reservationID=1579`)

    fetchx(API_URL + `/getCompleteReservation?reservationID=${sessionStorage.getItem('reservationid')}`)
      .then(result => result.json())
      .then(rowData => {
        // console.log(rowData['data'])
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


  //Success card
  const handleSuccess = async (message) => {
    const arrivalDate = `<b>Arrival Date: </b>  ${message['arrivalDate']}`
    const departureDate = `<b>Departure Date: </b>${message['departureDate']}`
    const guestName = '<b>Guest Name: </b>' + filldata[0]['salutation'] + ' ' + filldata[0]['firstName'] + ' ' + filldata[0]['lastName']
    const bookingID = `<b>BookingID: </b>${message['bookingID']}`;
    const PAX = `<b>PAX : </b>${String(message['numberOfAdults']) + ' + ' + String(message['numberOfChildren'])}`

    await MySwal.fire({
      title: 'Reservation Created !!',
      html: `
        <p>${arrivalDate}</p>
        <p>${departureDate}</p>
        <p>${PAX}</p>
        <p>${guestName}</p>
        <p>${bookingID}</p>
        <p>Successfully Created Reservation</p>
      `,
      icon: 'success',
    });
    setTimeout(() => {
      navigate('/dashboard/frontdesk');
    }, 1000);
  };


  // const handleError = (message) => {
  //   return MySwal.fire({
  //     title: 'Error!',
  //     text: message,
  //     icon: 'error',
  //     html: message.replace(/\n/g, '<br />'),
  //     customClass: {
  //       confirmButton: 'btn btn-danger'
  //     },
  //     allowOutsideClick: false,
  //     confirmButtonText: 'Close',
  //     confirmButtonColor: 'danger',
  //     buttonsStyling: false
  //   })
  // }

  //   const handleError = (message) => {
  //   return MySwal.fire({
  //     title: 'Error!',
  //     text: message,
  //     icon: 'error',
  //     imageUrl: warningImage, // <-- Add your image here
  //     imageWidth: 500,
  //     imageHeight: 200,
  //     customClass: {
  //       confirmButton: 'btn btn-danger'
  //     },
  //     allowOutsideClick: false,
  //     confirmButtonText: 'Close',
  //     confirmButtonColor: 'danger',
  //     buttonsStyling: false
  //   })
  // }


  const handleError = (message) => {
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



  //On confirm reservation button
  const masterReservation = () => {
    setButtonDisabled(true);
    const createmarketGroup = JSON.stringify({
      reservationID: sessionStorage.getItem('reservationid'),
      hotelID: 1
    })
    fetchx(API_URL + "/addMasterReservation", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then((res) => res.json())
      .then(postres => {
        if (postres.statusCode === 200) {
          const createmarketGroup1 = JSON.stringify({
            tempReservationID: sessionStorage.getItem('reservationid'),
          })
          fetchx(API_URL + "/getReservationDetailsByTempID", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: createmarketGroup1
          }).then((response) => response.json())
            .then(details => {
              sessionStorage.clear();
              setButtonDisabled(false);
              handleSuccess(details['data'][0])
            })
        }
        else {
          handleError(postres.message);
        }
      })
  }


  return (
    <div>
      <Card>
        <CardBody>
          {filldata.length ? (
            <div className="reservation-card">

              {/* Stay Details */}
              <div className="section">
                <h3>Stay Details</h3>
                <div className="info-table">
                  <table>
                    <tbody>
                      <tr>
                        {/* <FcPortraitMode style={{color:'#9389f3'}} size={20} />  */}
                        <td>  Guest Name</td>
                        <td><b>{filldata[0]['salutation']} {filldata[0]['firstName']}  {filldata[0]['lastName']}</b></td>
                        <td>
                          {/* <FiArrowUpRight style={{color:'#9389f3'}} size={20} /> */}
                          Rate Code:</td>
                        <td><b>{filldata[0]['rateCode']}</b></td>
                      </tr>
                      <tr>
                        {/* <FcRightUp style={{color:'#9389f3'}} size={20} /> */}
                        <td> Arrival Date:</td>
                        <td><b>{filldata[0]['checkIn']}</b></td>
                        <td>
                          {/* <FiArrowUpRight style={{color:'#9389f3'}} size={20} />  */}
                          ETA:</td>
                        <td><b>{filldata[0]['ETA']}</b></td>
                      </tr>
                      <tr>
                        {/* <FcLeftDown style={{color:'#9389f3'}} size={20} />  */}
                        <td>  Departure Date:</td>
                        <td><b>{filldata[0]['checkOut']}</b></td>
                        <td>
                          {/* <FiArrowUpRight style={{color:'#9389f3'}} size={20} />  */}
                          ETD:</td>
                        <td><b>{filldata[0]['ETD']}</b></td>
                      </tr>
                      <tr>
                        <td>

                          {/* <FcConferenceCall style={{color:'#9389f3'}} size={20} />  */}
                          PAX:
                        </td>
                        <td>
                          <b>{filldata[0]['adults']} {" + "} {filldata[0]['children']}</b>
                        </td>
                        <td>
                          {/* <FcNumericalSorting12 style={{color:'#9389f3'}} size={20} />  */}
                          Number of Rooms:</td>
                        <td><b>{filldata[0]['quantity']}</b></td>
                      </tr>
                      <tr>
                        <td>Pickup Date:</td>
                        <td><b>{filldata[0]['pickUpDate']}</b></td>
                        <td>Pickup Time:</td>
                        <td><b>{filldata[0]['pickUpTime']}</b></td>

                      </tr>
                      <tr>
                        <td>Drop Date:</td>
                        <td><b>{filldata[0]['dropDate']}</b></td>
                        <td>Drop Time:</td>
                        <td><b>{filldata[0]['dropTime']}</b></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* <br></br><br></br>
              <h3>Pickup and Drop Details</h3>
              <div className="info-table">
                <table>
                  <tbody>
                    <tr>
                      <td>Pickup Date:</td>
                      <td><b>{filldata[0]['pickUpDate']}</b></td>                     
                      <td>Pickup Time:</td>
                      <td><b>{filldata[0]['pickUpTime']}</b></td>

                    </tr>
                    <tr>
                      <td>Drop Date:</td>
                      <td><b>{filldata[0]['dropDate']}</b></td>
                      <td>Drop Time:</td>
                      <td><b>{filldata[0]['dropTime']}</b></td>
                    </tr>

                  </tbody>
                </table>
              </div>
              <br>
              </br><br></br> */}
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
                        <td><b>{filldata[0]['ReservationType']}</b></td>
                        <td>Package:</td>
                        <td><b>{filldata[0]['packageCode']}</b></td>
                      </tr>
                      {/* <tr>
                      <td>Booker:</td>
                      <td>{filldata[0]['booker']}</td>
                    </tr> */}
                      <tr>
                        <td>Source:</td>
                        <td><b>{filldata[0]['sourceName']}</b></td>
                        <td>Market:</td>
                        <td><b>{filldata[0]['marketName']}</b></td>
                      </tr>
                      <tr>
                        <td>Extra Description:</td>
                        <td><b>{filldata[0]['extraName']}</b></td>
                        <td></td><td></td>
                      </tr>
                      <tr>
                        <td>Features:</td>
                        <td><b>{filldata[0]['preferenceName']}</b></td>
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
                        filldata[0]['paymentType'] === 'Credit Card' ? (
                          <><tr>
                            <td>Payment Type:</td>
                            <td><b>{filldata[0]['paymentType']}</b></td>
                          </tr><tr>
                              <td>Card Holder Name:</td>
                              <td><b>{filldata[0]['cardHolderName']}</b></td>
                            </tr><tr>
                              <td>Expiry Date:</td>
                              <td><b>{filldata[0]['expiryDate']}</b></td>
                            </tr></>

                        ) : (
                          <tr>
                            <td>Payment Type:</td>
                            <td><b>{filldata[0]['paymentType']}</b></td>
                          </tr>
                        )

                      }
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className="no-reservation">
              <h1>Please enter all the booking details !!!</h1>
              {/* <img src={sadDogImage} alt="Sad Dog" /> */}
            </div>
          )}

          <br></br>
          {filldata.length !== 0 && <><Button color='secondary' outline onClick={modalClose}>
            Cancel
          </Button> &nbsp; <Button color='primary' disabled={isButtonDisabled} className={isButtonDisabled ? "disabled-button" : ""} onClick={masterReservation}>
              Confirm Reservation
            </Button></>
          }
        </CardBody>
      </Card>


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
              <br></br>
              <Button color='primary' className='me-1' style={{ float: 'right' }} onClick={() => setModal(!modal)}>
                Back
              </Button>
            </div>
          </ModalBody>
        </Modal>
      }
    </div>

  )
}

export default App