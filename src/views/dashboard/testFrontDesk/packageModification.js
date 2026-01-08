// ** Third Party Components
import { useState, useRef, Fragment, useEffect, useMemo, useCallback } from 'react'
import Select from 'react-select'
import classnames from 'classnames'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
// ** Utils
import { selectThemeColors } from '@utils'
// ** Reactstrap Imports
import { Input, Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
// AG Grid
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import './button.scss'
import API_URL from '../../../config'
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
import { AgGridReact } from 'ag-grid-react'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import { useNavigate } from "react-router-dom";

const defaultValues = {
  packageName: ''
}

let subTotal;
let totalTaxGenerated;
let total;
let totalDiscount;
let totalCostOfStay;


const PackageModification = (data1) => {
  const [open, setOpen] = useState(false);
  const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
  const [details, setDetails] = useState('')
  const [packageName, setPackageName] = useState([])
  const [UpdatedRate, setUpdatedRate] = useState(false)
  const [reasons, setReason] = useState(false);
  const [data, setData] = useState(null)
  const [checkboxChecked, setCheckboxChecked] = useState(true)
  const gridRef = useRef();
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  const [checkBoxValue, setCheckBoxValue] = useState(1);
  const [reason, setReasonList] = useState([])
  const [selectedReasonValue, setSelectedReasonValue] = useState();
  const [oldRates, setOldRates] = useState(false)
  const [modal, setModal] = useState(false);
  const [displayRatesummary, setDisplayRateSummary] = useState(false)
  const [newPackageID, setNewPackageID] = useState(false)

  let navigate = useNavigate();


  useEffect(() => {
    fetchx(API_URL + '/getPackageDescription?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        setPackageName(resp['data'])
      })

    fetchx(API_URL + "/getReservationGuestDetails", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: '1',
        reservationID: data1.data1['data1']['id'],
      })
    }).then(result => result.json())
      .then(rowData => {
        setDetails(rowData['data'][0])
      }).catch((error) => {
      })

    fetchx(API_URL + '/getReasonByID?reasonGroupID=4')
      .then(result => result.json())
      .then(resp => {
        setReasonList(resp['data'])
      })
  }, [])


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


  const handleChangeReason = (selectedOption) => {
    setSelectedReasonValue(selectedOption.value);
  }


  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Date', field: 'inventory_date', maxWidth: 120, sort: 'asc' },
    { headerName: 'Room Type', field: 'roomType', maxWidth: 125 },
    {
      headerName: 'Total Before Discount', field: 'totalBeforeDiscount', maxWidth: 195,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Total Discount', field: 'totalDiscount', maxWidth: 150,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Total After Discount', field: 'total', suppressSizeToFit: true, maxWidth: 195,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Base Rate', field: 'baseprice', suppressSizeToFit: true, maxWidth: 140,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Extra Adult Rate', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 125,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Children Rate', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 125,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Package Rate', field: 'packageRate', suppressSizeToFit: true, maxWidth: 125, valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Package Code', field: 'packageCode', suppressSizeToFit: true, maxWidth: 125
    },
  ])


  //AG-GRID columns to show rate summary
  const [columnDefs2, setColumnDefs2] = useState([
    { headerName: 'Date', field: 'Date', maxWidth: 120, sort: 'asc' },
    { headerName: 'RoomType', field: 'roomType', suppressSizeToFit: true, maxWidth: 120 },
    {
      headerName: 'Total Before Discount', field: 'totalBeforeDiscount', maxWidth: 195,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Total Discount', field: 'totalDiscount', maxWidth: 150,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Total After Discount', field: 'subTotal', suppressSizeToFit: true, maxWidth: 195,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Tax', field: 'totalTaxGenerated', suppressSizeToFit: true, maxWidth: 100,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Total With Tax', field: 'total', suppressSizeToFit: true, maxWidth: 150,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Room Rate', field: 'roomRevenue', suppressSizeToFit: true, maxWidth: 140,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Package Rate', field: 'packageRevenue', suppressSizeToFit: true, maxWidth: 140,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Extra Adult Price', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 165,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    {
      headerName: 'Child Price', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 125,
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      }
    },
    { headerName: 'PackageCode', field: 'packageCode', suppressSizeToFit: true, maxWidth: 140 },
  ])


  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const checkboxValue = isChecked ? 1 : 0;
    setCheckBoxValue(checkboxValue)
    setCheckboxChecked(!checkboxChecked)
  }


  const handlePackageChange = (event) => {
    if (event.value === data1.data1.data1.packageID) {
      handleError("Please select different package from previous !!!")
    }
    setNewPackageID(event.value)
  }


  // error handling for same guest addition
  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }


  // On success modal open
  const handleSuccess = () => {
    return MySwal.fire({
      title: "Package Modification!!",
      text: 'Successfully modified package type',
      icon: 'success',
    })
  }


  const onSubmit = data => {

    subTotal = 0;
    totalTaxGenerated = 0;
    total = 0;
    totalDiscount = 0;
    totalCostOfStay = 0;

    // Reject message for same package selection
    if (newPackageID === data1.data1.data1.packageID) {
      handleError("Please select different package from previous !!!")
      return;
    }

    // For different package selection
    else {
      var reasonInputElement = document.getElementById('reasonText');
      setData(data)
      if (newPackageID == false) {
        handleError("Please select the package first")
      }
      else {
        let createmarketGroup = JSON.stringify({
          reservationID: data1.data1.data1.id,
          sharingID: data1.data1.data1.sharingID,
          tempReservationID: data1.data1.data1.tempReservationID,
          isMain: data1.data1.data1.isMain,
          rateFlag: checkboxChecked,
          newPackageID: newPackageID,
          reasonID: selectedReasonValue,
          reasonText: reasonInputElement ? reasonInputElement.value : null
        })
        fetchx(API_URL + "/getNewRatesForPackage", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: createmarketGroup
        }).then((data) => data.json())
          .then((res) => {
            if (typeof (res['data']) === 'string') {
              setUpdatedRate(false)
              handleError(res['data'])
            }
            else {
              setUpdatedRate(res['data'])
            }
          });
      }
    }
  }


  // On final submit update rates
  const UpdateRates = () => {

    setOpen(true);

    // Start a timer to check if the response takes more than 5 seconds
    const timeout = setTimeout(() => {
      setShowSecondaryMessage(true);
    }, 5000);

    var reasonInputElement = document.getElementById('reasonText');
    let updaterates = JSON.stringify({
      reservationID: data1.data1.data1.id,
      sharingID: data1.data1.data1.sharingID,
      tempReservationID: data1.data1.data1.tempReservationID,
      isMain: data1.data1.data1.isMain,
      rateFlag: checkboxChecked,
      newPackageID: newPackageID,
      reasonID: selectedReasonValue,
      reasonText: reasonInputElement ? reasonInputElement.value : null,
      numberOfRooms: data1.data1.data1.numberOfRooms,
      oldPackageID: data1.data1.data1.packageID
    })
    fetchx(API_URL + "/modifyPackageOfReservation", {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: updaterates
    })
      .then((data) => data.json())
      .then((res) => {
        if (res.statusCode === 200) {
          setOpen(false);
          handleSuccess()
          setTimeout(() => { navigate('/dashboard/frontdesk'); }, 1000)
        }
        else if (res.message) {
          handleError(res.message)
        }
      })
  }


  // Function to view rate summary
  const handleClick = () => {

    let rateSummary = JSON.stringify({
      "rateSummary": UpdatedRate
    })

    fetchx(API_URL + "/showRateSummary", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: rateSummary
    }).then((data) => data.json())
      .then((displayRatesummary) => {
        for (const item of displayRatesummary['data']) {
          subTotal = subTotal + item.subTotal;
          totalTaxGenerated = totalTaxGenerated + item.totalTaxGenerated;
          total = total + item.total;
          totalDiscount = totalDiscount + item.totalDiscount;
        }
        setDisplayRateSummary(displayRatesummary['data'])
      })
    setModal(true)
  }


  // Function to handle error messages for not entered data
  const openNextModal = () => {
    if (newPackageID == false) {
      handleError("Please select the package first")
      return;
    }
    if (selectedReasonValue == undefined) {
      handleError("Please select the reason")
      return;
    }
    if (newPackageID === data1.data1.data1.packageID) {
      handleError("Please select different package from previous !!!")
      return;
    }
    else {
      setOldRates(true)
    }
  }


  return (
    <div>

      <Card>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>


            <Row>
              &nbsp;&nbsp;Previous Package: {details.packageCode}
              <br></br>
              <br></br>
            </Row>


            <Row>
              <Col md='6' sm='12'>
                <div className='mb-1'>
                  <Label className='form-label' for='packages' >
                    Select Packages <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Controller
                    id='packages'
                    control={control}
                    name='packages'
                    render={({ field }) => (
                      <Select
                        isClearable
                        options={packageName}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select')}
                        {...field}
                        onChange={handlePackageChange}
                      />
                    )}
                  />
                </div>
              </Col>
            </Row>
            <br></br>


            <Row>
              <Col >
                <div className='form-check form-check-inline'>
                  <Input type='checkbox' id='basic-cb-unchecked' checked={checkboxChecked} onChange={handleCheckboxChange} />
                  <Label for='rtc? ' className='form-check-label'>
                    Modify package with rates
                  </Label>
                </div>
              </Col>
            </Row>
            <br></br>

            {/* get rates button */}
            <Row>
              {checkBoxValue !== 0 &&
                <div align='end' className='buttons'>
                  <Button color='primary' className='me-1' type='submit' >
                    Get Rates
                  </Button>
                </div>
              }
            </Row>

            <br></br>
            <br></br>
            {
              checkBoxValue === 0 &&
              <div>

                <Col md='6' sm='12' className='mb-1'>
                  <div className="mb-1">
                    <Label className="form-label" for="reason">
                      Select Reason <span style={{ color: 'red' }}> * </span>
                    </Label>
                    <Controller
                      control={control}
                      name="reason"
                      render={({ field }) => (
                        <Select
                          isClearable
                          options={reason}
                          id='reason'
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          {...field}
                          onChange={handleChangeReason}
                        />
                      )}
                    />
                  </div>
                </Col>

                <Col md='6' sm='12' className='mb-1'>
                  <div className='mb-1'>
                    <Label className='form-label' for='reasonText'>
                      Reason Remarks
                    </Label>
                    <Controller
                      id='reasonText'
                      name='reasonText'
                      control={control}
                      render={({ field }) => (
                        <Input
                          id='reasonText'
                          {...field}
                          placeholder='Reason Remarks'
                          className={classnames('form-control'
                          )}
                        />
                      )}
                    />
                  </div>
                </Col>

                <div align='end' className='buttons'>
                  <Button color='primary' className='me-1' type='submit' onClick={openNextModal} >
                    Update package
                  </Button>
                </div>

              </div>
            }

            {/* Final confirmation card */}
            <div className='disabled-animation-modal'>
              <Modal isOpen={oldRates} toggle={() => setOldRates(!oldRates)} className='modal-dialog-centered'>
                <ModalHeader className='bg-transparent' toggle={() => setOldRates(!oldRates)}></ModalHeader>
                <ModalBody className='px-5 pb-2'>
                  <div className='text-center mb-2'>
                    <h1 className='mb-1'>Continue with old rates only?</h1>
                  </div>
                  <Col>
                    <div className="button-container text-center">
                      <Button className="me-1" color="primary" onClick={UpdateRates} >
                        Confirm
                      </Button>
                      <Button className="me-1" color="danger" onClick={() => setOldRates(false)} >
                        Cancel
                      </Button>
                    </div>
                  </Col>
                </ModalBody>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={() => setOpen(false)}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                      Please wait while we are updating your reservation
                    </h1>
                    {showSecondaryMessage && (
                      <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                        We're processing your request, which may take a little longer due to additional data. Please be patient!
                      </h1>
                    )}
                    <CircularProgress color="inherit" />
                  </div>
                </Backdrop>
              </Modal>
            </div>

            {/* Ag-grid for rates display */}
            {
              UpdatedRate !== false && checkBoxValue !== 0 &&
              <div className="ag-theme-alpine" style={{ height: 220 }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={UpdatedRate}
                  columnDefs={columnDefs}
                  animateRows={true}
                  rowSelection='multiple'
                  onCellClicked={cellClickedListener}
                  paginationPageSize='10'
                  defaultColDef={defaultColDef}
                  headerColor="ddw-primary"
                />
                <br />
                <br />
                <br />

                <div align='end'>
                  <Button color='primary' className='me-1' onClick={handleClick}>
                    View rate summary
                  </Button>
                </div>
              </div>
            }

          </Form>
        </CardBody>
      </Card>

      {
        modal !== false &&
        <Modal isOpen={modal} toggle={() => setModal(!modal)} className='modal-xl'  >
          <ModalBody className='pb-3 px-sm-2 mx-20'>
            <ModalHeader className='modal-sm' toggle={() => {
              setModal(!modal)
            }}>Rate Summary Of modified package type
            </ModalHeader>
            {checkBoxValue != 0 &&
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

            }

            <div>
              <br></br><br></br>
              <h3><strong>Total Without Tax &nbsp;&nbsp;&nbsp;&nbsp;: </strong>&nbsp;&nbsp;&nbsp;&nbsp;{(parseFloat(subTotal).toFixed(2))}</h3>
              <h3><strong>Total Tax &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:        </strong>&nbsp;&nbsp;&nbsp;&nbsp;{(parseFloat(totalTaxGenerated).toFixed(2))}</h3>
              <h3><strong>Total With Tax &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </strong>&nbsp;&nbsp;&nbsp;{(parseFloat(total).toFixed(2))}</h3>


            </div>
            <br></br>
            <div>
            <Button color="primary" className='me-1' style={{ float: 'right' }} onClick={UpdateRates}>
              Update Package
            </Button>
            <Button color="secondary" outline className='me-1' style={{ float: 'right' }} onClick={() => setModal(false)}>
              cancel
            </Button>
            </div>

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={() => setOpen(false)}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                  Please wait while we are updating your reservation
                </h1>
                {showSecondaryMessage && (
                  <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                    We're processing your request, which may take a little longer due to additional data. Please be patient!
                  </h1>
                )}
                <CircularProgress color="inherit" />
              </div>
            </Backdrop>

          </ModalBody>

        </Modal>
      }
    </div>
  )
}

export default PackageModification