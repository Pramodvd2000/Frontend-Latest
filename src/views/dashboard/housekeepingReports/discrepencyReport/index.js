import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useRef, useEffect, useMemo, useCallback } from 'react';
import Houskeeping_URL from '../../../../housekeeping_config'

const defaultValues = {
  frmdate: ''
}

const discrepencyReport = () => {
  const [rowData1, setRowData1] = useState();
  const gridRef = useRef();
  const [flag, setFlag] = useState(false)
  const [flag1, setflag1] = useState(false)
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })



  

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Floor', field: 'floor', suppressSizeToFit: true, width: 100 },
    { headerName: 'Room Number', field: 'roomNumber', suppressSizeToFit: true, width: 140 },
    { headerName: 'Room Type', field: 'roomType', suppressSizeToFit: true, width: 140 },
    { headerName: 'FO Status', field: 'frontOfficeStatus', suppressSizeToFit: true, width: 140 },
    { headerName: 'Room Status', field: 'roomStatus', suppressSizeToFit: true, width: 140 },
    { headerName: 'Res. Status', field: 'reservationStatus', suppressSizeToFit: true, width: 140 },
    { headerName: 'FO PAX', field: 'frontOfficePAX', suppressSizeToFit: true, width: 140 },
    { headerName: 'HK PAX', field: 'housekeepingPAX', suppressSizeToFit: true, width: 140 },
    { headerName: 'Discrepency', field: 'discrepancy', suppressSizeToFit: true, width: 140 },
    { headerName: 'Status', field: 'status', suppressSizeToFit: true, width: 140 },
    { headerName: 'Disc. Date', field: 'discrepancyDate', suppressSizeToFit: true, width: 140 },
    { headerName: 'Remarks', field: 'remarks', suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true, },
    
  ]);

  const defaultColDef = useMemo(() => (
    {
      sortable: true,
    }
  ));

  const cellClickedListener = useCallback(event => {
  }, []);


const onSubmit = async (data) => {
    const filterFromDate = Moment(data.frmdate[0]).format("YYYY-MM-DD");
    const filterToDate = Moment(data.todate[0]).format("YYYY-MM-DD");
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
    setFlag(true);
    setflag1(true);
    
    const params = new URLSearchParams({
      fromDate: filterFromDate,
      toDate: filterToDate
    }).toString();

    try {
      const response = await fetchx(`${Houskeeping_URL}/getRoomInformationForDiscrepancy?${params}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      setRowData1(result["data"]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleReset = () => {
    reset({
      frmdate: '',
      todate: '',
    })
  }
  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD')) 
  };

  const onBtnExport = () => {
    const params = {
      fileName: 'Discrepency Report.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };


  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Discrepency Report</CardTitle>
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
                        options={{ allowInput: true }}
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
                <Button className='me-1' color='primary' type='submit' onClick={() => setflag1(true)}>
                  Submit
                </Button>
                
                {flag == true && <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button>}
                {/* {flag == true && <Button className='me-1' color='primary' type='submit' onClick={handleReset}>Reset </Button>} */}
              </div>
            </Row>
          </Form>
        </CardBody>
      </Card>
      {flag == true && <div className="ag-theme-alpine" >
        <AgGridReact
          ref={gridRef}
          rowData={rowData1}
          columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
          domLayout='autoHeight'
        />
      </div>}
    </div>
  )
}


export default discrepencyReport