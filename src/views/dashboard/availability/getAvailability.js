// ** React Imports
import { useState } from 'react'
import Moment from 'moment';
import {AgGridReact} from 'ag-grid-react';
import { useRef, useEffect, useMemo, useCallback} from 'react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';

// ** Third Party Components
import Select from 'react-select'
import toast from 'react-hot-toast'
import classnames from 'classnames'
import Cleave from 'cleave.js/react'
import { Check } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Alert, Input, Row, Col, Card, Form, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import DatePicker from 'react-flatpickr'


const roomTypeOptions = [
  { value: "1", label: "KSUP" },
  { value: "2", label: "TSUP" },
  { value: "3", label: "KDLX" },
  { value: "4", label: "TDLX" },
  { value: "5", label: "KCLB" },
  { value: "6", label: "PM" },
  { value: "7", label: "TCLB" },
  { value: "8", label: "EXE" },
];





const defaultValues = {
    checkIn: null,
    checkOut: null,
    roomType: null,
    

}

const ValidationThirdPartyComponents = () => {
  const gridRef = useRef();
  const [rowData, setRowData] = useState();

  const [columnDefs, setColumnDefs] = useState([

    {headerName: 'Date',field: 'date',},
    {headerName: 'Number of Avalable Rooms',field: 'numAvlRooms',},
    {headerName: 'Room Type',field: 'roomTypeID',},


  ]);
  const defaultColDef = useMemo( ()=> (
    {
      sortable: true, 
      filter: true,
      filterParams :{
      buttons : ['apply','reset']
      }
    }
  ));
  const cellClickedListener = useCallback( event => {
    console.log('cellClicked', event);
  }, []);

    // ** Hooks
    const {
        setError,
        formState: { errors }
    } = useForm()

    // ** State
    const [data, setData] = useState(null)

    // ** Hooks
    const { reset, handleSubmit, control } = useForm({ defaultValues })
    
    const onSubmit = data => {
      console.log(data)
        setData(data)
        if (data.checkIn!== null && data.checkOut!== null || data.roomType.value!==0) {
        var checkIn = (Moment(String(new Date(data.checkIn[0]))).format('YYYY-MM-DD'))
        var checkOut = (Moment(String(new Date(data.checkOut[0]))).format('YYYY-MM-DD'))
        var roomType = data.roomType.value    
        console.log(checkIn,checkOut,roomType)
            // let getAvailability = JSON.stringify({
            //     "checkIn": (Moment(String(new Date(data.checkIn[0]))).format('YYYY-MM-DD')),
            //     "checkOut": (Moment(String(new Date(data.checkOut[0]))).format('YYYY-MM-DD')),
            //     "roomType": data.roomType.value

            // })
            // console.log(getAvailability)
            let res = fetchx(API_URL + `/getroominventoryavailability?hotelID=1&roomTypeID=${roomType}&fromDate=${checkIn}&toDate=${checkOut}`)
                .then(result => result.json())
                .then(rowData => {setRowData(rowData['data'])
                    console.log(rowData['data'])
                    
                })
                if(checkIn<= new Date()){
                  <p>Please Enter a Valid Date</p>
                }

        }
      
    }
    const buttonListener = useCallback( e => {
      gridRef.current.api.deselectAll();
    }, []);


    const handleReset = () => {
        reset({
            checkIn: null,
            checkOut: null,


        })
    }

    return (
    
    <div>
    <Card>
      {/* <CardHeader>
        <CardTitle tag='h4'> </CardTitle>
      </CardHeader> */}
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md='2' sm='5'>
              <div className='mb-1'>
                <Label className='form-label' for='checkIn'>
                  Check In
                </Label>
                <Controller
                  control={control}
                  id='checkIn'
                  name='checkIn'
                  render={({ field }) => (
                    <Flatpickr
                      {...field}
                      options={{ allowInput: true }}  placeholder='YYYY-MM-DD '
                      className={classnames('form-control', {
                        'is-invalid': data !== null && data.checkIn === null
                      })}
                    />
                  )}
                />
              </div>

            </Col>

            <Col md='2' sm='5'>
              <div className='mb-1'>
                <Label className='form-label' for='checkOut'>
                  Check Out
                </Label>
                <Controller
                  control={control}
                  id='checkOut'
                  name='checkOut'
                  render={({ field }) => (
                    <Flatpickr
                      {...field}
                      options={{ allowInput: true }}  placeholder='YYYY-MM-DD '
                      className={classnames('form-control', {
                        'is-invalid': data !== null && data.checkOut === null
                      })}
                    />
                  )}
                />
              </div>
            </Col>
            <Col md='2' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="roomType">
            Room Type
            </Label>
            <Controller
              id="roomType"
              control={control}
              name="roomType"
              render={({ field }) => (
                <Select
                  isClearable
                  options={roomTypeOptions}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  // className={classnames("react-select", {
                  //   "is-invalid": data !== null && data.roomType === null,
                  // })}
                  {...field}
                />
              )}
            />
          </div>
          </Col>
            </Row>
          <div align='end' className='buttons'>          
          <Button outline  className='me-1' color='secondary' type='reset' onClick={handleReset}>
              Reset
            </Button>
            <Button color='primary' type='submit'>
              Search
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
    <div className="ag-theme-alpine" style={{ height: 520}}>
      <AgGridReact
            ref={gridRef}
            rowData={rowData} columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            // paginationAutoPageSize = 'true'
            paginationPageSize= '10'
            pagination = 'true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            
            />
</div>
    </div>
  )
}

export default ValidationThirdPartyComponents

