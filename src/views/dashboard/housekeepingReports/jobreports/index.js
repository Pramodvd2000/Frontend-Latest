/* eslint-disable no-unused-vars */
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import 'ag-grid-enterprise'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Card, CardHeader, Button, Modal, ModalBody, ModalHeader, Spinner, CardBody, Form, Row, Col, Label } from 'reactstrap'
import Modalform from './modalForm'
import Houskeeping_URL from '../../../../housekeeping_config'
import Moment from 'moment'
import { useForm, Controller } from 'react-hook-form'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'

const id = '1'


function App() {
  const [show, setShow] = useState(false)
  const [rowData, setRowData] = useState()
  const gridRef = useRef()
  const { reset, handleSubmit, control, watch } = useForm({})


  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv()
  }, [])


  const [columnDefs] = useState([
    // { headerName: 'ID', field: 'id', suppressSizeToFit: true, Width: 100},
    {
      headerName: 'Room No.',
      field: 'roomNumber',
      suppressSizeToFit: true,
      maxWidth: 100,
      autoHeight: true,
      wrapHeaderText: true,
    },
    {
      headerName: 'Job Type',
      field: 'jobType',
      suppressSizeToFit: true,
      maxWidth: 160,
    },
    {
      headerName: 'Department',
      field: 'jobDepartment',
      suppressSizeToFit: true,
      maxWidth: 150,
    },
    {
      headerName: 'Created Date',
      field: 'createdTime',
      suppressSizeToFit: true,
      Width: 145,
    },
    {
      headerName: 'Job Name',
      field: 'jobName',
      suppressSizeToFit: true,
      Width: 230,
    },
    {
      headerName: 'Instruction',
      field: 'description',
      suppressSizeToFit: true,
      Width: 230,
    },
    {
      headerName: 'Job Location',
      field: 'floorAndRoom',
      filter: 'agMultiColumnFilter',
      // suppressSizeToFit: true,
      maxWidth: 160,
      valueGetter: function (params) {
        const floorNumber = params.data.actualFloorNumber;
        const roomNumber = params.data.roomNumber;

        // Check if both 'floorNumber' and 'roomNumber' are not empty
        if (floorNumber && roomNumber) {
          // Concatenate 'floorNumber' and 'roomNumber' with a delimiter
          return `${"R-" + roomNumber} (${"F-" + floorNumber})`;
        } else {
          // Return empty string if either 'floorNumber' or 'roomNumber' is empty
          return '';
        }
      }
    },
    {
      headerName: 'Start Time',
      field: 'startTime',
      suppressSizeToFit: true,
      Width: 60,
    },
    {
      headerName: 'End Time',
      field: 'endTime',
      suppressSizeToFit: true,
      Width: 60,
    },
    {
      headerName: 'Job Status',
      field: 'jobStatus',
      suppressSizeToFit: true,
      maxWidth: 120,
    },
    {
      headerName: 'taskID',
      field: 'taskID',
      suppressSizeToFit: true,
      maxWidth: 100,
    },
    {
      headerName: 'Created By',
      field: 'createdBy',
      suppressSizeToFit: true,
      maxWidth: 140,
    },
    {
      headerName: 'Assigned by',
      field: 'supervisorName',
      suppressSizeToFit: true,
      maxWidth: 155,
    },
    {
      headerName: 'Assigned to',
      field: 'assignedTo',
      suppressSizeToFit: true,
      maxWidth: 155,
    },
  ])


  const columnTypes = useMemo(() => {
    return {
      numberColumn: { width: 130, filter: 'agNumberColumnFilter' },
      medalColumn: { width: 100, columnGroupShow: 'open', filter: false },
      nonEditableColumn: { editable: false },
      dateColumn: {
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator: (filterLocalDateAtMidnight, cellValue) => {
            const dateParts = cellValue.split('/')
            const day = Number(dateParts[0])
            const month = Number(dateParts[1]) - 1
            const year = Number(dateParts[2])
            const cellDate = new Date(year, month, day)
            // Now that both parameters are Date objects, we can compare
            if (cellDate < filterLocalDateAtMidnight) {
              return -1
            } else if (cellDate > filterLocalDateAtMidnight) {
              return 1
            } else {
              return 0
            }
          }
        }
      }
    }
  }, [])


  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), [])


  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filterParams: {
        buttons: ['apply', 'reset']
      },
      floatingFilter: true,
      resizable: true,
      autoHeight: true,
      wrapText: true,
      menuTabs: ['filterMenuTab']
    }
  ))


  const cellClickedListener = useCallback(event => {
    // console.log('cellClicked', event)
  }, [])


  useEffect(() => {
    fetch(Houskeeping_URL + `/getJobsList?hotelID=${id}`)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
      })
  }, [])


  const resetFilter = useCallback(() => {
    handleResetFilter()
    fetch(Houskeeping_URL + `/getJobsList?hotelID=${id}`)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
      })
  }, [])


  const onSubmit = data => {
    let fromDate = Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD")
    let toDate = Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
    fetch(Houskeeping_URL + `/getJobsList?fromDate=${fromDate}&toDate=${toDate}`, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
    }).then(data => data.json())
      .then((res) => {
        setRowData(res['data'])
      });
  }


  const handleResetFilter = () => {
    reset({
      frmdate: null,
      todate: null,
    });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <h1>Jobs Report</h1>
          <Button color="primary" onClick={() => setShow(true)}>Add Guest Request</Button>
        </CardHeader>

        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="frmdate">
                    From Date
                  </Label>
                  <Controller
                    control={control}
                    id="frmdate"
                    name="frmdate"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="todate">
                    To Date
                  </Label>
                  <Controller
                    control={control}
                    id="todate"
                    name="todate"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <div align="end" className="buttons">
                <Button onClick={resetFilter} color='secondary' outline>Reset</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button className='me-1' color='primary' type='submit'>
                  Submit
                </Button>
                <Button onClick={onBtnExport} color='primary'>Download Report</Button>
              </div>
            </Row>
          </Form>
        </CardBody>

      </Card>
      <div style={containerStyle}>
        <div className="ag-theme-alpine" style={{ height: 520 }}>

          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            columnTypes={columnTypes}
            animateRows={true}
            rowSelection='multiple'
            onCellClicked={cellClickedListener}
            paginationPageSize='10'
            pagination='true'
            // sideBar={'filters'}
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
          />
        </div>
      </div>
      <div>
        <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-lg'>
          <ModalHeader className='bg-transparent' toggle={() => setShow(!show)} ></ModalHeader>
          <ModalBody className='px-sm-5 mx-50 pb-5'>
            <h2 className='address-title text-center mb-1'>Guest Request</h2>
            <Modalform />
            <div>
            </div>
          </ModalBody>
        </Modal>
      </div>

    </div>
  )
}

export default App
