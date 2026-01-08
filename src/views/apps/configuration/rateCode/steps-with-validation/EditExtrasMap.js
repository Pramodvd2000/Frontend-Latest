import { Fragment, useState, useRef, useMemo, useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import Select from "react-select"
import classnames from "classnames"
import { selectThemeColors } from "@utils"

// ** Third Party Components
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-enterprise'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// ** Reactstrap Imports
import {
  Label, Row, Col, Button, Form, Input, FormFeedback,
  Card, CardBody, CardTitle, CardHeader,
  Modal, ModalHeader, ModalBody
} from 'reactstrap'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import { useNavigate } from 'react-router-dom'

import API_URL from '../../../../../config'

const defaultValues = {
  extraCode: "",
  description: "",
  remarks: "",
  type: null,
  percentage: "",
  amount: "",
  pieces: "",
  trips: "",
  isActive: null,
  extras: null
}

const EditExtrasMap = ({ stepper, rateCodeId, initialData }) => {
  // ** States
  const [rowData, setRowData] = useState([])
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [addExtrasModal, setAddExtrasModal] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [extraName, setExtraName] = useState([])
  const [isModified, setIsModified] = useState(false)
  let navigate = useNavigate()
  
  const gridRef = useRef()

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Grid Columns
  const columnDefs = useMemo(() => [
    {
      headerName: "Rate Code",
      field: "rateCode",
      suppressSizeToFit: true,
      maxWidth: 140
    },
    {
      headerName: "Extra Code", 
      field: "extraCode",
      suppressSizeToFit: true,
      maxWidth: 140
    },
    {
      headerName: "Extra Description",
      field: "description", 
      suppressSizeToFit: true,
      maxWidth: 240
    },
    {
      headerName: "Action",
      field: "numAvlRooms",
      suppressSizeToFit: true,
      maxWidth: 140,
      cellRendererFramework: (params) => (
        <Button color="primary" onClick={() => {
          setSelectedData(params.data)
          setShowRemoveModal(true)
        }}>
          Remove
        </Button>
      )
    }
  ], [])

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"]
    }
  }), [])

  // ** Effects
  useEffect(() => {
    // Fetch extra descriptions
    fetch(`${API_URL}/getExtraDescription?hotelID=1`)
      .then(res => res.json())
      .then(resp => {
        setExtraName(resp.data)
      })

    // Fetch rate code extras
    fetch(`${API_URL}/getreservationRateCodeExtra?hotelID=1&rateCodeID=${rateCodeId}`)
      .then(res => res.json())
      .then(resp => {
        setRowData(resp.data)
      })
  }, [rateCodeId])

  // ** Handlers
  const handleAddExtras = (data) => {
    const createExtra = {
      rateCodeID: rateCodeId,
      extraID: data.extras,
      hotelID: 1
    }

    fetch(`${API_URL}/addRateCodeExtas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createExtra)
    })
      .then(res => {
        if (res.status === 200) {
          setIsModified(true)
          // Refresh grid data
          fetch(`${API_URL}/getreservationRateCodeExtra?hotelID=1&rateCodeID=${rateCodeId}`)
            .then(res => res.json())
            .then(resp => {
              setRowData(resp.data)
            })

          MySwal.fire({
            text: 'RateCode Extras Updated Successfully!',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-primary'
            }
          }).then(result => {
            if (result.isConfirmed) {
              setAddExtrasModal(false)
            }
          })
        }
      })
  }

  const handleUpdate = () => {
    if (isModified) {
      MySwal.fire({
        title: 'Success!',
        text: 'Extras mapping has been updated successfully',
        icon: 'success',
        customClass: {
          confirmButton: 'btn btn-primary'
        }
      })
    } else {
      MySwal.fire({
        title: 'No Changes',
        text: 'No modifications have been made to update',
        icon: 'info',
        customClass: {
          confirmButton: 'btn btn-primary'
        }
      })
    }
  }

  const handleRemoveExtra = () => {
    const payload = {
      id: selectedData.id,
      hotelID: 1,
      rateCodeID: selectedData.rateCodeID,
      extraID: selectedData.extraID
    }

    fetch(`${API_URL}/deleteRateCodeExtras`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        setIsModified(true)
        // Refresh grid data
        fetch(`${API_URL}/getreservationRateCodeExtra?hotelID=1&rateCodeID=${rateCodeId}`)
          .then(res => res.json())
          .then(resp => {
            setRowData(resp.data)
          })

        MySwal.fire({
          text: "Successfully Removed Mapped Extra!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Close",
          customClass: {
            confirmButton: "btn btn-primary"
          }
        }).then(result => {
          if (result.isConfirmed) {
            setShowRemoveModal(false)
          }
        })
      })
  }

  const handleReset = () => {
    reset(defaultValues)
  }

  return (
    <Fragment>
      {/* Remove Extra Modal */}
      <Modal isOpen={showRemoveModal} toggle={() => setShowRemoveModal(!showRemoveModal)} className="modal-sm">
        <ModalHeader toggle={() => setShowRemoveModal(!showRemoveModal)}>Confirm Removal</ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>
          <div>
            <b>Do you want to remove this extra?</b>
            <br /><br />
            <div className="d-flex">
              <Button color="primary" className="me-1" onClick={handleRemoveExtra}>
                Confirm
              </Button>
              <Button color="danger" className="me-1" onClick={() => setShowRemoveModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* Add Extras Modal */}
      <Modal isOpen={addExtrasModal} toggle={() => setAddExtrasModal(!addExtrasModal)} className="modal-sm">
        <ModalHeader toggle={() => setAddExtrasModal(!addExtrasModal)}>Add Extras</ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Rate Code Extras</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit(handleAddExtras)}>
                <Row>
                  <Col md="12" sm="12">
                    <div className="mb-1">
                      <Label className="form-label" for="extras">
                        Select Extra
                      </Label>
                      <Controller
                        id="extras"
                        control={control}
                        name="extras"
                        render={({ field }) => (
                          <Select
                            isMulti
                            isClearable
                            options={extraName}
                            classNamePrefix="select"
                            theme={selectThemeColors}
                            className={classnames("react-select")}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </Col>
                  <div align='end' className='buttons'>
                    <Button className="me-1" color="primary" type="submit">
                      Submit
                    </Button>
                    <Button outline color="secondary" type="reset" onClick={handleReset}>
                      Reset
                    </Button>
                  </div>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </ModalBody>
      </Modal>

      {/* Main Content */}
      <div>
        <Button className='me-1' color='primary' type='button' onClick={() => setAddExtrasModal(true)}>
          Add Extras
        </Button>
      </div>
      <br/>
      
      <Card>
        <div className="ag-theme-alpine" style={{ height: 240 }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            animateRows={true}
            rowSelection="multiple"
            paginationPageSize={10}
            pagination={true}
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
          />
        </div>
      </Card>

      <div className='d-flex justify-content-between mt-2'>
        <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
          <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
          <span className='align-middle d-sm-inline-block d-none'>Previous</span>
        </Button>
      </div>
    </Fragment>
  )
}

export default EditExtrasMap