import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Select from 'react-select'
import classnames from 'classnames'
import { Fragment } from 'react'
import { useForm, Controller } from 'react-hook-form'
import API_URL from '../../../../../config'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Label, Row, Col, Button, Form, Input, FormFeedback } from 'reactstrap'

// AG Grid Imports
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-enterprise'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

// Styles
import '@styles/react/libs/react-select/_react-select.scss'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const defaultValues = {
}

const RoomRates = ({ stepper, rateCodeId }) => {
  const gridRef = useRef()
  const [rowData, setRowData] = useState([])
  const [gridApi, setGridApi] = useState(null)

  const numberValueParser = params => {
    const newValue = parseFloat(params.newValue)
    if (isNaN(newValue)) return ''
    if (newValue < 0) return params.oldValue // Prevent negative values
    return newValue
  }

  const columnDefs = useMemo(() => [
    {
      headerName: "Room Type",
      field: "roomType",
      suppressSizeToFit: true,
      maxWidth: 130
    },
    {
      headerName: "One Adult Price",
      field: "oneAdultPrice",
      maxWidth: 160,
      editable: true,
      valueParser: numberValueParser,
      cellStyle: params => {
        if (params.value < 0) return { backgroundColor: '#ffebee' }
      }
    },
    {
      headerName: "Extra Adult Price",
      field: "extraAdultPrice",
      maxWidth: 180,
      editable: true,
      valueParser: numberValueParser,
      cellStyle: params => {
        if (params.value < 0) return { backgroundColor: '#ffebee' }
      }
    },
    {
      headerName: "Extra Child Price",
      field: "extraChildPrice",
      maxWidth: 180,
      editable: true,
      valueParser: numberValueParser,
      cellStyle: params => {
        if (params.value < 0) return { backgroundColor: '#ffebee' }
      }
    }
  ], [])

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"]
    }
  }), [])

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onGridReady = useCallback((params) => {
    setGridApi(params.api)
  }, [])

  useEffect(() => {
    if (rateCodeId) {
      fetch(`${API_URL}/getAllRoomtypeDataForRateCode?hotelID=1&rateCodeID=${rateCodeId}`)
        .then(result => result.json())
        .then(data => {
          const processedData = data.data.map(row => ({
            ...row,
            oneAdultPrice: '',
            extraAdultPrice: '',
            extraChildPrice: ''
          }))
          setRowData(processedData)
        })
    }
  }, [rateCodeId])

  const hasEnteredRates = (row) => {
    return (
      (row.oneAdultPrice && parseFloat(row.oneAdultPrice) > 0) ||
      (row.extraAdultPrice && parseFloat(row.extraAdultPrice) > 0) ||
      (row.extraChildPrice && parseFloat(row.extraChildPrice) > 0)
    )
  }

  const validateGridData = (gridData) => {
    // Filter rows that have at least one rate entered
    const filledRows = gridData.filter(hasEnteredRates)

    if (filledRows.length === 0) {
      throw new Error('Please enter at least one rate')
    }

    // Process only the rows with data
    const validatedData = filledRows.map(row => ({
      ...row,
      oneAdultPrice: parseFloat(row.oneAdultPrice) || 0,
      extraAdultPrice: parseFloat(row.extraAdultPrice) || 0,
      extraChildPrice: parseFloat(row.extraChildPrice) || 0,
      roomTypeID: row.roomTypeID // Ensure we keep the roomTypeID
    }))

    return validatedData
  }

  const getGridData = () => {
    const gridData = []
    gridApi.forEachNode(node => {
      gridData.push(node.data)
    })
    return gridData
  }

  const onSubmit = async () => {
    try {
      // First, ensure any ongoing edits are completed
      gridApi.stopEditing()
      
      // Small delay to ensure the edit is completed
      await new Promise(resolve => setTimeout(resolve, 0))
      
      // Now get the grid data
      const gridData = getGridData()
      
      try {
        const validatedData = validateGridData(gridData)
        
        const response = await fetch(`${API_URL}/updateRateCodeRoomRateDetails`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rateCodeID: rateCodeId,
            accData: validatedData, // Only sending rows with entered rates
            isActive: 1,
            hotelID: 1
          })
        })
        
        if (response.ok) {
          await MySwal.fire({
            text: 'Room Rates Added Successfully!',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          })
          stepper.next()
        } else {
          throw new Error('Failed to update rate code details')
        }
      } catch (error) {
        await MySwal.fire({
          title: 'Error',
          text: error.message || 'Please enter valid rates',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Ok',
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        })
      }
    } catch (error) {
      console.error('Error updating rate code details:', error)
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>Add Room Rates</h5>
        <small>Enter rates for the room types. Only rooms with entered rates will be saved.</small>
      </div>
      
      <Form onSubmit={handleFormSubmit}>
        <div className="ag-theme-alpine" style={{ height: 350, marginBottom: '2rem' }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            rowSelection="multiple"
            singleClickEdit={true}
            headerColor="ddw-primary"
            stopEditingWhenCellsLoseFocus={false}
            onGridReady={onGridReady}
          />
        </div>

        <div className='d-flex justify-content-between'>
          <Button 
            type='button' 
            color='primary' 
            className='btn-prev' 
            onClick={() => stepper.previous()}
          >
            <ArrowLeft size={14} className='align-middle me-sm-25 me-0' />
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button>
          
          <Button type='submit' color='primary' className='btn-next'>
            <span className='align-middle d-sm-inline-block d-none'>Update and Next</span>
            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0' />
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}

export default RoomRates