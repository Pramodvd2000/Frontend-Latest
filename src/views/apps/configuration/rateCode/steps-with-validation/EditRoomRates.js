import { useState, useEffect, useRef, useMemo } from 'react'
import { Fragment } from 'react'
import { useForm } from 'react-hook-form'
import API_URL from '../../../../../config'
import { ArrowRight } from 'react-feather'
import { Button, Form } from 'reactstrap'

// AG Grid Imports
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-enterprise'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import '@styles/react/libs/react-select/_react-select.scss'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const defaultValues = {}

const EditRoomRates = ({ stepper, rateCodeId, initialData }) => {
  const gridRef = useRef()
  const [rowData, setRowData] = useState([])
  
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
      valueParser: params => {
        if (params.newValue === '') return ''
        const newValue = parseFloat(params.newValue)
        return isNaN(newValue) ? '' : newValue
      }
    },
    {
      headerName: "Extra Adult Price",
      field: "extraAdultPrice",
      maxWidth: 180,
      editable: true,
      valueParser: params => {
        if (params.newValue === '') return ''
        const newValue = parseFloat(params.newValue)
        return isNaN(newValue) ? '' : newValue
      }
    },
    {
      headerName: "Extra Child Price",
      field: "extraChildPrice",
      maxWidth: 180,
      editable: true,
      valueParser: params => {
        if (params.newValue === '') return ''
        const newValue = parseFloat(params.newValue)
        return isNaN(newValue) ? '' : newValue
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
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  useEffect(() => {
    if (rateCodeId) {
      fetch(`${API_URL}/getAllRoomtypeDataForRateCode?hotelID=1&rateCodeID=${rateCodeId}`)
        .then(result => result.json())
        .then(data => {
          const processedData = data.data.map(row => ({
            ...row,
            oneAdultPrice: row.oneAdultPrice === null || row.oneAdultPrice === undefined ? '' : 
                          parseFloat(row.oneAdultPrice) === 0 ? 0 : 
                          parseFloat(row.oneAdultPrice) || '',
            extraAdultPrice: row.extraAdultPrice === null || row.extraAdultPrice === undefined ? '' : 
                           parseFloat(row.extraAdultPrice) === 0 ? 0 : 
                           parseFloat(row.extraAdultPrice) || '',
            extraChildPrice: row.extraChildPrice === null || row.extraChildPrice === undefined ? '' : 
                           parseFloat(row.extraChildPrice) === 0 ? 0 : 
                           parseFloat(row.extraChildPrice) || ''
          }))
          setRowData(processedData)
        })
    }
  }, [rateCodeId])

  const validateGridData = (gridData) => {
    return gridData.map(row => ({
      ...row,
      oneAdultPrice: row.oneAdultPrice === '' ? 0 : parseFloat(row.oneAdultPrice) || 0,
      extraAdultPrice: row.extraAdultPrice === '' ? 0 : parseFloat(row.extraAdultPrice) || 0,
      extraChildPrice: row.extraChildPrice === '' ? 0 : parseFloat(row.extraChildPrice) || 0
    }))
  }

  const getGridData = () => {
    const gridApi = gridRef.current.api
    const gridData = []
    gridApi.forEachNode(node => {
      if (node.data.oneAdultPrice !== '' || 
          node.data.extraAdultPrice !== '' || 
          node.data.extraChildPrice !== '') {
        gridData.push(node.data)
      }
    })
    return gridData
  }

  const handleUpdate = async () => {
    try {
      const gridApi = gridRef.current.api
      gridApi.stopEditing()
      
      await new Promise(resolve => setTimeout(resolve, 0))
      
      const gridData = getGridData()
      const validatedData = validateGridData(gridData)

      const response = await fetch(`${API_URL}/updateRateCodeRoomRateDetails`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rateCodeID: rateCodeId,
          accData: validatedData,
          isActive: 1,
          hotelID: 1
        })
      })
      
      if (response.ok) {
      //  setRowData(validatedData)
      fetch(`${API_URL}/getAllRoomtypeDataForRateCode?hotelID=1&rateCodeID=${rateCodeId}`)
      .then(result => result.json())
      .then(data => {
        const processedData = data.data.map(row => ({
          ...row,
          oneAdultPrice: row.oneAdultPrice === null || row.oneAdultPrice === undefined ? '' : 
                        parseFloat(row.oneAdultPrice) === 0 ? 0 : 
                        parseFloat(row.oneAdultPrice) || '',
          extraAdultPrice: row.extraAdultPrice === null || row.extraAdultPrice === undefined ? '' : 
                         parseFloat(row.extraAdultPrice) === 0 ? 0 : 
                         parseFloat(row.extraAdultPrice) || '',
          extraChildPrice: row.extraChildPrice === null || row.extraChildPrice === undefined ? '' : 
                         parseFloat(row.extraChildPrice) === 0 ? 0 : 
                         parseFloat(row.extraChildPrice) || ''
        }))
         setRowData(processedData)
        })
        await MySwal.fire({
          text: 'Room Rates Updated Successfully!',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      } else {
        throw new Error('Failed to update rate code details')
      }
    } catch (error) {
      console.error('Error updating rate code details:', error)
    }
  }

  const handleNext = () => {
    stepper.next()
  }

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>Edit Room Rates</h5>
        <small>Modify room rates for each type.</small>
      </div>
      
      <Form onSubmit={e => e.preventDefault()}>
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
          />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <Button color="secondary" outline onClick={() => stepper.previous()}>
            Previous
          </Button>
          <div className="d-flex gap-2">
            <Button
              type="button"
              color="primary"
              onClick={handleUpdate}
            >
              Update
            </Button>
            <Button
              type="button"
              color="primary"
              className="btn-next"
              onClick={handleNext}
            >
              Next
              <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
            </Button>
          </div>
        </div>
      </Form>
    </Fragment>
  )
}

export default EditRoomRates