import { Fragment, useRef, useState, useMemo, useCallback , useEffect} from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ArrowLeft, ArrowRight } from 'react-feather'
import API_URL from '../../../../../config'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Form,
  Row,
  Col,
  Label
} from 'reactstrap'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const CompanyDetails = ({ rateCodeId, onCompanyMap }) => {
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [rowData, setRowData] = useState([])
  const [filldata, setFilldata] = useState(false)
  const gridRef1 = useRef()

  const defaultValues = {
    reservationid: '',
    source: '',
    companyID: '',
    packageID: null
  }

  const { reset, handleSubmit } = useForm({ defaultValues })

  const onSubmit = () => {
    if (selectedCompanies.length > 0) {
      const mappingData = {
        accountID: selectedCompanies.map(company => company.accountID),
        rateCodeID: rateCodeId,
        hotelID: 1
      }

      // API call here with mappingData
      onCompanyMap(mappingData)
    }
  }

  useEffect(() => {
    fetch(`${API_URL}/getCompanyList?hotelID=1`)
      .then(result => result.json())
      .then(response => {
        setRowData(response.data)
      })
  }, [])

  const columnDefs = [
    { headerName: 'Company Name', field: 'accountName', checkboxSelection: true, headerCheckboxSelection: true, maxWidth: 400 },
    { headerName: 'Address Line 1', field: 'addressLine1', maxWidth: 300 },
    { headerName: 'Address Line 2', field: 'addressLine2', maxWidth: 300 },
    { headerName: 'City', field: 'city', maxWidth: 110 },
    { headerName: 'State', field: 'state', maxWidth: 110 },
    { headerName: 'Country', field: 'country', maxWidth: 110 }
  ]

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef1.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    )
  }, [])

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ['apply', 'reset']
    }
  }), [])

  const handleReset = () => {
    setFilldata(false)
    reset(defaultValues)
  }

  const onSelectionChanged = (event) => {
    const selectedRows = event.api.getSelectedRows()
    setSelectedCompanies(selectedRows)
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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
      </Row>

      <div className="ag-theme-alpine" style={{ height: 520 }}>
        <AgGridReact
          ref={gridRef1}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={true}
          onGridReady={params => {
            params.api.sizeColumnsToFit()
          }}
          rowSelection='multiple'
          onSelectionChanged={onSelectionChanged}
          rowMultiSelectWithClick={true}
          paginationPageSize='10'
          pagination='true'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
        />
      </div>

      <div className='button' align='end'>
        <Button className='me-1' outline color='secondary' type='reset' onClick={handleReset}>
          Reset
        </Button>
        <Button className='me-1' color='primary' type='submit'>
          Submit
        </Button>
      </div>
    </Form>
  )
}

const AccountMap = ({ stepper, rateCodeId }) => {
  const [mappedAccounts, setMappedAccounts] = useState([])
  const [showAddCompany, setShowAddCompany] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const gridRef = useRef()

  const columnDefs = [
    { headerName: 'Company', field: 'accountName', maxWidth: 100 },
    { headerName: 'Rate Code', field: 'rateCode', maxWidth: 100 },
    { headerName: 'Description', field: 'description', maxWidth: 135 },
    { headerName: 'Begin Sell Date', field: 'beginSellDate', maxWidth: 150 },
    { headerName: 'End Sell Date', field: 'endSellDate', maxWidth: 150 },
    { headerName: 'Package Code', field: 'packageCode', maxWidth: 150 },
    { headerName: 'Market Code', field: 'marketCode', maxWidth: 135 },
    { headerName: 'Source Code', field: 'sourceCode', maxWidth: 135 },
    {
      headerName: 'Action',
      maxWidth: 140,
      cellRenderer: params => (
        <Button color="primary" onClick={() => handleRemoveClick(params.data)}>
          Remove
        </Button>
      )
    }
  ]

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ['apply', 'reset']
    }
  }), [])

  useEffect(() => {
    fetchMappedAccounts()
  }, [rateCodeId])

  const fetchMappedAccounts = () => {
    fetch(`${API_URL}/getRatecodeAccount?hotelID=1&rateCodeID=${rateCodeId}`)
      .then(res => res.json())
      .then(data => {
        setMappedAccounts(data.data)
      })
  }

  const handleRemoveClick = (account) => {
    setSelectedAccount(account)
    setShowRemoveConfirm(true)
  }

  const handleRemoveConfirm = () => {
    if (selectedAccount) {
      fetch(`${API_URL}/deleteAccontRateCodeMap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedAccount.id,
          hotelID: 1,
          accountID: selectedAccount.accountID,
          rateCodeID: selectedAccount.rateCodeID
        })
      })
        .then(res => res.json())
        .then(() => {
          fetchMappedAccounts()
          setShowRemoveConfirm(false)
          MySwal.fire({
            text: 'Removed Account Mapped Successfully!',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          })
        })
    }
  }

  const handleCompanyMap = (mappingData) => {
    fetch(`${API_URL}/addAccountRateCodeMapping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mappingData)
    })
      .then(res => res.json())
      .then(() => {
        setShowAddCompany(false)
        fetchMappedAccounts()
        MySwal.fire({
          text: 'Accounts Mapped Successfully!',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        })
      })
  }

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>Account Mapping</h5>
        <small>Map Account/Company.</small>
      </div>

      <Button className='me-1 mb-1' color='primary' onClick={() => setShowAddCompany(true)}>
        Add Accounts
      </Button>

      <div className="ag-theme-alpine" style={{ height: 150 }}>
        <AgGridReact
          ref={gridRef}
          rowData={mappedAccounts}
          columnDefs={columnDefs}
          animateRows={true}
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
        />
      </div>

      <div className='d-flex justify-content-between mt-2'>
        <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
          <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
          <span className='align-middle d-sm-inline-block d-none'>Previous</span>
        </Button>
        <Button color='primary' className='btn-next' onClick={() => stepper.next()}>
          <span className='align-middle d-sm-inline-block d-none'>Next</span>
          <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
        </Button>
      </div>

      {/* Add Company Modal */}
      <Modal isOpen={showAddCompany} toggle={() => setShowAddCompany(!showAddCompany)} className='modal-xl'>
        <ModalHeader toggle={() => setShowAddCompany(!showAddCompany)}>
          Add RateCodes
        </ModalHeader>
        <ModalBody>
          <CompanyDetails rateCodeId={rateCodeId} onCompanyMap={handleCompanyMap} />
        </ModalBody>
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal isOpen={showRemoveConfirm} toggle={() => setShowRemoveConfirm(!showRemoveConfirm)} className='modal-sm'>
        <ModalHeader toggle={() => setShowRemoveConfirm(!showRemoveConfirm)}>
          Need To Check..
        </ModalHeader>
        <ModalBody>
          <b>Do You Want to Remove Attached Company?</b>
          <div className="d-flex mt-2">
            <Button color="primary" className="me-1" onClick={handleRemoveConfirm}>
              Confirm
            </Button>
            <Button color="danger" className="me-1" onClick={() => setShowRemoveConfirm(false)}>
              Cancel
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default AccountMap