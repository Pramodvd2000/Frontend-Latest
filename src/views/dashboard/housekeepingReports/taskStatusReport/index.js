/* eslint-disable no-unused-vars */
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import 'ag-grid-enterprise'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Card, CardHeader, Button, Modal, ModalBody, ModalHeader, Spinner, CardBody, Form, Row, Col, Label } from 'reactstrap'
import Moment from 'moment'
// import './buttonstyle.scss' 
import { useForm, Controller } from 'react-hook-form'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'

const id = '1'
import Houskeeping_URL from '../../../../housekeeping_config'

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";


function App() {
  const [show, setShow] = useState(false)
  const [show1, setShow1] = useState(false)
  const [rowData, setRowData] = useState()
  const { reset, handleSubmit, control, watch } = useForm({})

  const gridRef = useRef()


  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
  };


  const formatToIST = (dateString) => {
    if (dateString) {
      const date = DateTime.fromISO(dateString, { zone: 'utc' });
      const istDate = date.setZone('Asia/Kolkata');
      return istDate.toFormat('dd-MM-yyyy HH:mm:ss');
    }
    return 'No date available';
  };

  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv()
  }, [])

  const [columnDefs] = useState([
    {
      headerName: 'Task ID',
      field: 'taskID',
      filter: 'agMultiColumnFilter',
      suppressSizeToFit: true,
      maxWidth: 150,
    },
    {
      headerName: 'Task Type',
      field: 'taskType',
      filter: 'agMultiColumnFilter',
      suppressSizeToFit: true,
      maxWidth: 150,
    },
    {
      headerName: 'Task Location',
      field: 'floorAndRoom',
      filter: 'agMultiColumnFilter',
      // suppressSizeToFit: true,
      Width: 160,
      valueGetter: function (params) {
        const floorNumber = params.data.floorNumber;
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
      headerName: 'Task Name',
      field: 'taskName',
      filter: 'agMultiColumnFilter',
      suppressSizeToFit: true,
      Width: 200,
    },
    {
        headerName: 'Create Date',
        field: 'createdTime',
        filter: 'agMultiColumnFilter',
        suppressSizeToFit: true,
        maxWidth: 150,
      },
    {
      headerName: 'Status Change',
      field: 'statusChange',
      filter: 'agMultiColumnFilter',
      suppressSizeToFit: true,
      maxWidth: 180,
    },
    {
      headerName: 'Time',
      field: 'statusChangedTime',
      filter: 'agMultiColumnFilter',
      suppressSizeToFit: true,
      maxWidth: 150,
      cellRenderer: (params) => {
        if (params.data && params.data.statusChangedTime) {
          return formatToIST(params.data.statusChangedTime);
        }
      }, 
      // cellRenderer: (params) => {
      //   const gmtDate = new Date(params.value);
      //   const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
      //   const istDate = new Date(gmtDate.getTime() + istOffset);
      //   return istDate.toISOString().slice(0, 19).replace('T', ' ');
      // }
    },
    {
      headerName: 'Attendant Name',
      field: 'attendantName',
      filter: "agMultiColumnFilter",
      suppressSizeToFit: true,
      maxWidth: 180,
    },
    {
        headerName: 'Supervisor Name',
        field: 'supervisorName',
        filter: "agMultiColumnFilter",
        suppressSizeToFit: true,
        maxWidth: 180,
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
    console.log('cellClicked', event)
  }, [])


  useEffect(() => {
    fetchx(Houskeeping_URL + `/getTaskStatusReport?hotelID=${id}`)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
      })
  }, [])


  const resetFilter = useCallback(() => {
    handleResetFilter()
    fetchx(Houskeeping_URL + `/getTaskStatusReport?hotelID=${id}`)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
      })
  }, [])


  const onSubmit = data => {
    let fromDate = Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD")
    let toDate = Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
    fetchx(Houskeeping_URL + `/getTaskStatusReport?startDate=${fromDate}&endDate=${toDate}`, {
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
          <h1>Tasks Status logs</h1>
          <div style={{ margin: '10px 0' }}>

          </div>
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
                        options={optionsToDate}
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
            animateRows={true}
            columnTypes={columnTypes}
            rowSelection='multiple'
            onCellClicked={cellClickedListener}
            paginationPageSize='10'
            pagination='true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
          />
        </div>
      </div>
    </div>
  )
}

export default App