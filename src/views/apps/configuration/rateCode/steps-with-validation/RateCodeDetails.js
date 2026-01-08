import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Select from 'react-select'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import { useForm, Controller } from 'react-hook-form'
import { selectThemeColors } from '@utils'
import { Input, Form, Row, Col, Label, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { Fragment } from 'react'
//import { ArrowLeft } from 'react-feather'
import { ArrowLeft, ArrowRight } from 'react-feather'

import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import API_URL from '../../../../../config'
import Moment from 'moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)




let packages = [
  fetchx(API_URL + '/getRateCodePackageID?hotelID=1 ')
    .then(result => result.json())
    .then(resp => {
      packages = resp['data']
    })
]

let sources = [
  fetchx(API_URL + '/getRateCodeSourceID?hotelID=1 ')
    .then(result => result.json())
    .then(resp => {
      sources = resp['data']
    })
]

let marketCodes = [
  fetchx(API_URL + '/getRateCodeMarketID?hotelID=1 ')
    .then(result => result.json())
    .then(resp => {
      marketCodes = resp['data']
    })
]


let rateCategory = [
  fetchx(API_URL + '/getRateCodeRateCategory?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      rateCategory = resp['data']
    })
]



let transactionCode = [
  fetchx(API_URL + '/getRateCodeTransactionID?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      transactionCode = resp['data']
    })
]

let packagetransactionCode = [
  fetchx(API_URL + '/getRateCodeTransactionID?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      packagetransactionCode = resp['data']
    })
]


const RateCodeDetails = ({ stepper, rateCodeId, setRateCodeId }) => {

  console.log("rateCodeId in Rate Code details Page",rateCodeId)
 // const navigate = useNavigate()
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedValue, setSelectedValue] = useState()
  const [transactionData, setTransactionData] = useState([])
  const [rateCodes, setRateCode] = useState(false)
  const [rowData2, setRowData2] = useState()
  const gridRef = useRef()
  const [selectedCompany, setSelectedCompany] = useState({})
  const [selectedValue1, setSelectedValue1] = useState([])
  const [TransactionCodeData, setTransactionCodeData] = useState([])
  //const [rateCodeId, setRateCodeId] = useState(null)
  const [data, setData] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  console.log("rateCodeId",rateCodeId)

  const { 
    reset, 
    handleSubmit, 
    control, 
    watch,
    formState: { errors } // Add this to properly track form errors
  } = useForm({ 
    //defaultValues,
    mode: 'onChange' // Enable real-time validation
  })
  const onSubmit = async (formData) => {
    try {
      // Validate required fields
      if (!formData.rateCode || !formData.description || !formData.rateCategory || 
          !formData.beginDate || !formData.sellDate || !selectedPackage) {
        MySwal.fire({
          title: 'Error',
          text: 'Please fill in all required fields',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        })
        return
      }

      const createrateCode = {
        rateCode: formData.rateCode,
        description: formData.description,
        beginSellDate: formData.beginDate ? Moment(formData.beginDate[0]).format('YYYY-MM-DD') : null,
        endSellDate: formData.sellDate ? Moment(formData.sellDate[0]).format('YYYY-MM-DD') : null,
        marketID: formData.marketCode?.value || null,
        sourceID: formData.source?.value || null,
        packageID: selectedPackage.value,
        tansactionCodeID: TransactionCodeData,
        packageTransactionCodeID: selectedValue1,
        printRate: 1,
        discount: 0,
        discountAmount: 200,
        discountPercentage: 10,
        dayUse: 0,
        complementary: 0,
        houseUse: 0,
        daysApplicable: 1,
        isActive: 1,
        rateCategoryID: formData.rateCategory?.value || null,
        hotelID: 1,
        accData: transactionData?.accountID
      }

      const response = await fetch(`${API_URL}/addRateCodeDetails`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createrateCode)
      })

      const result = await response.json()

      if (result.statusCode === 200) {
        setRateCodeId(result.data)
        await MySwal.fire({
          text: 'Rate Code Added Successfully!',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
        setIsSubmitted(true) // Set submission status to true
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      MySwal.fire({
        title: 'Error',
        text: error.message || 'Something went wrong',
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Close',
        customClass: {
          confirmButton: 'btn btn-danger'
        }
      })
    }
  }

  useEffect(() => {
    fetch(API_URL + "/getAccomadationTransactionCode?hotelID=1")
      .then((result) => result.json())
      .then((rowData) => setTransactionCodeData(rowData["data"][0]['id']))

    fetch(API_URL + "/getCompleteAccountDetails?hotelID=1")
      .then((result) => result.json())
      .then((rowData) => setRowData2(rowData["data"]))
  }, [])

  const [columnDefs2] = useState([
    { headerName: 'Account ID', field: 'accountID', maxWidth: 100 },
    { headerName: 'Company Name', field: 'accountName', maxWidth: 300 },
    { headerName: 'Address Line 1', field: 'addressLine1', maxWidth: 300 },
    { headerName: 'Address Line 2', field: 'addressLine2', maxWidth: 300 },
    { headerName: 'City', field: 'city', maxWidth: 110 },
    { headerName: 'State', field: 'state', maxWidth: 110 },
    { headerName: 'Country', field: 'country', maxWidth: 110 },
    {
      headerName: "Action",
      maxWidth: 140,
      cellRenderer: (params) => {
        return (<Button color='primary' onClick={() => cellClickedListener1(params)}>Select</Button>)
      }
    }
  ])

  const onFilterTextBoxChanged2 = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    )
  }, [])

  const cellClickedListener1 = (event) => {
    setTransactionData(event['data'])
    setSelectedCompany(event['data'])
    setRateCode(false)
  }

  const defaultColDef = useMemo(() => ({
    suppressSizeToFit: true,
    autoHeight: true,
    resizable: true,
    sortable: true,
    filter: true,
    singleClickEdit: true,
    filterParams: {
      buttons: ["apply", "reset"]
    }
  }), [])

  const packagetransactionCode = (selectedPackage) => {
    fetch(API_URL + `/getPackageTransactionCode?id=${selectedPackage.value}&hotelID=1`)
      .then(result => result.json())
      .then(resp => {
        setSelectedValue(resp['data'][0]['description'])
        setSelectedValue1(resp['data'][0]['transactionCodeID'])
      })
  }

  const beginDate = watch('beginDate')
  const today = Moment().format('YYYY-MM-DD')
  const options = {
    minDate: today
  }
  const optionsToDate = {
    minDate: (Moment(String(new Date(beginDate))).format('YYYY-MM-DD'))
  }



  const handleReset = () => {
    reset(defaultValues)
    setSelectedCompany({})
    setSelectedPackage(null)
    setSelectedValue('')
  }

  const handleCompanyClear = () => {
    setSelectedCompany()
  }

  return (
    <Fragment>
    <div className='content-header'>
        <h5 className='mb-0'>Rate Code Details</h5>
        <small className='text-muted'>Enter Rate Code Details.</small>
      </div>

      <div>
        <Modal isOpen={rateCodes} toggle={() => setRateCode(!rateCodes)} className='modal-xl'>
          <ModalHeader className='modal-lg' toggle={() => setRateCode(!rateCodes)}> View Transaction Codes</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <div>
              <Row className='mb-1'>
                <Col md="3" sm="12" className="mb-1">
                  <Label className="form-label" for="fullName">
                    Search
                  </Label>
                  <Input
                    type="text"
                    id="filter-text-box"
                    placeholder="Filter..."
                    onInput={onFilterTextBoxChanged2}
                  />
                </Col>
              </Row>
              <Row>
                <div className="ag-theme-alpine" style={{ height: 540 }}>
                  <AgGridReact
                    ref={gridRef}
                    rowData={rowData2}
                    columnDefs={columnDefs2}
                    animateRows={true}
                    rowSelection="multiple"
                    onCellClicked={cellClickedListener1}
                    paginationPageSize="10"
                    pagination="true"
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"
                  />
                </div>
              </Row>
            </div>
          </ModalBody>
        </Modal>
      </div>
      
      <Form onSubmit={handleSubmit(onSubmit)} className="needs-validation">
      <div>
        <Row>              
                <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='rateCode'>
                      Rate Code <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue=''
                      control={control}
                      id='rateCode'
                      name='rateCode'
                      render={({ field }) => <Input 
                      // pattern="[a-zA-Z  ]*" title="Type Only Alphabets" 
                      disabled={isSubmitted}
                      placeholder='Rate Code'
                         required
                        //invalid={errors.rateCode && true} 
                        {...field} />}
                    />
                  </div>
                </Col>
                <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='description'>
                      Description <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue=''
                      control={control}
                      id='description'
                      name='description'
                      render={({ field }) => <Input
                      required
                      disabled={isSubmitted}
                       placeholder='Description' 
                       // invalid={errors.description && true} 
                        {...
                        field} />}
                    />
                  </div>
                </Col>
                <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='rateCategory'>
                      Rate Category <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      id='rateCategory'
                      control={control}
                      name='rateCategory' sources
                      render={({ field }) => (
                        <Select
                        required
                          isClearable
                          options={rateCategory}
                          isDisabled={isSubmitted}
                          classNamePrefix='select'
                          theme={selectThemeColors}
                          className={classnames('react-select', { 'is-invalid': data !== null && data.rateCategory === null })}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='marketCode'>
                      Market Code
                    </Label>
                    <Controller
                      id='marketCode'
                      control={control}
                      name='marketCode'
                      render={({ field }) => (
                        <Select
                          isClearable
                          options={marketCodes}
                          isDisabled={isSubmitted}
                          classNamePrefix='select'
                          theme={selectThemeColors}
                          className={classnames('react-select', { 
                            // 'is-invalid': data !== null && data.marketCode === null 
                          })
                          }
                          {...field}
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='source'>
                      Source
                    </Label>
                    <Controller
                      id='source'
                      control={control}
                      name='source'
                      render={({ field }) => (
                        <Select
                          isClearable
                          options={sources}
                          classNamePrefix='select'
                          isDisabled={isSubmitted}
                          theme={selectThemeColors}
                          className={classnames('react-select', { 
                            // 'is-invalid': data !== null && data.source === null
                           })}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col md='3' sm='12'>
                  <div className='mb-1'>
                    <Label className='form-label' for='beginDate'>
                      Begin Date <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      control={control}
                      id='beginDate'
                      name='beginDate'
                     
                      render={({ field }) => (
                       
                        <Flatpickr
                        required
                          {...field}
                          disabled ={isSubmitted}
                          options={options}
                          placeholder='YYYY-MM-DD '
                          className={classnames('form-control', {
                            'is-invalid': data !== null && data.beginDate === null
                          })}
                        />
                      )}
                    />
                  </div>
                </Col>
                
                <Col md='3' sm='12'>
                <div className='mb-1'>
                            <Label className='form-label' for='sellDate'>
                            Sell Date <spam style={{color:'red'}}>*</spam>
                            </Label>
                            <Controller
                              control={control}
                              id='sellDate'
                              name='sellDate'
                             
                              render={({ field }) => (
                                <Flatpickr
                                required
                                disabled ={isSubmitted}
                                  placeholder='YYYY-MM-DD'
                                  {...field}
                                  options={optionsToDate}
                                  // options={{ allowInput: true }}
                                  className={classnames('form-control', {
                                    'is-invalid': data !== null && data.sellDate === null
                                  })}
                                />
                              )}
                            />
                          </div>
               
                </Col>                
                <Col md='3' sm='12'>
                    <div className='mb-1'>
                      <Label className='form-label' htmlFor='package'>
                        Package <spam style={{color:'red'}}>*</spam>
                      </Label>
                      <Controller
                        id='package'
                        control={control}
                        name='package'
                        render={({ field }) => (
                          <Select
                            isClearable
                            options={packages}
                            classNamePrefix='select'
                            isDisabled={isSubmitted}
                            theme={selectThemeColors}
                            className={classnames('react-select', {
                              'is-invalid': data !== null && data.package === null
                            })}
                            // {...field}
                            onChange={(selectedOption) => {
                              // Update the selectedPackage state with the selected value
                              setSelectedPackage(selectedOption);
                              packagetransactionCode(selectedOption)
                            }}
                          />
                        )}
                      />
                    </div>
                  </Col>
                
                 <Col md="3" sm="12">
                  <div className="mb-1">
                    <Label className="form-label" for="pkgtransactionCode">
                     Package Transaction Code
                    </Label>
                    <Controller
                      control={control}
                      id="pkgtransactionCode"
                      name="pkgtransactionCode"
                      render={({ field }) => (
                        <Input
                        // defaultValue={selectedValue['description'] }
                          disabled={true}
                          placeholder="pkgtransactionCode"
                          //invalid={errors.names && true}
                          {...field}
                          value={selectedValue}
                        />
                      )}
                    />
                  </div>
                      </Col> 


                      
                 {transactionData && (
  <Col md="3" sm="12">
    <div className="mb-1">
      <Label className="form-label" for="accName">
        Accounts
      </Label>
      <Controller
        required
        control={control}
        id="accName"
        name="accName"
        render={({ field }) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              onClick={() => setRateCode(!rateCodes)}
              placeholder="Company Name"
              disabled={isSubmitted}
              invalid={errors.accName && true}
              {...field}
              value={selectedCompany !== undefined ? selectedCompany.accountName : ''}
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
        )}
      />
    </div>
  </Col>
)}

              </Row>
        </div>

        <div className='d-flex justify-content-between'>
          <Button 
            color='primary' 
            className='btn-prev' 
            outline 
            onClick={() => stepper.previous()}
            disabled={isSubmitted}
          >
            <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button>
          <div>
            {!isSubmitted ? (
              <Button 
                color='primary' 
                className='me-1' 
                type='submit'
              >
                Submit and Proceed
              </Button>
            ) : (
              <Button 
                color='primary' 
                className='me-1' 
                onClick={() => stepper.next()}
              >
                <span className='align-middle d-sm-inline-block d-none'>Next</span>
                <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
              </Button>
            )}
          </div>
        </div>
      </Form>
    </Fragment>
  )
}

export default RateCodeDetails