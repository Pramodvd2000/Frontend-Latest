// ** React Imports
import { useState } from 'react'

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
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input, InputGroupText, Modal, ModalHeader, ModalBody } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from 'react';
// import './roomClass.scss'
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap'
import API_URL from '../../../../config'
import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import EditWeekend from './weekendedit';

const MySwal = withReactContent(Swal)

const dayOptions = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' }
];

const defaultValues = {
  // hotelID: '',
  roomClass: '',
  isActive: null,
}




const SourceCode = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [popUp, setPopUp] = useState(false);
  const [filldata, setfilldata] = useState({});

  const gridRef = useRef();
  // ** Hooks
  const {
    setError,
    formState: { errors },
  } = useForm();
  const lookupValue = (mappings, key) => {
    return mappings[key]
  }

  const colourMappings = {
    1: 'Active',
    0: '--',
    '': '--',
  }
  const extractKeys = (mappings) => {
    return Object.keys(mappings)
  }


  const [showEdit, editButton] = useState(false);


  const colourCodes = extractKeys(colourMappings)

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Weekdays', field: 'Weekdays', cellStyle: { 'text-align': 'center', 'background-color': '#F1E39B' }, headerClass: "text-center", suppressSizeToFit: true, maxWidth: 140 },
    // { headerName: 'Active Status', field: 'isActive' , cellStyle: { 'text-align': 'center', 'background-color': 'pink' }, maxWidth: 140,  },
    { headerName: 'Weekend', field: 'weekends', cellStyle: { 'text-align': 'center', 'background-color': 'pink' }, suppressSizeToFit: true, maxWidth: 150, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: colourCodes }, valueFormatter: (params) => { return lookupValue(colourMappings, params.value) }, filter: 'agSetColumnFilter' },
    {
      headerName: "Action", field: "numAvlRooms", suppressSizeToFit: true, maxWidth: 120,
      cellRendererFramework: (params) => (
        <Button color="primary" onClick={() => { setfilldata(params.data), editButton(true) }}> Edit  </Button>),
    },
  ]);

  const [newActiveStatus, setNewActiveStatus] = useState(null);
  const [roomClass, setRoomClassID] = useState(null);

  const onCellValueChanged = useCallback(event => {
    console.log('onCellValueChanged', event)
    console.log('data after changes is: ', event.data);
    console.log(event)
    let isActive = Number(event.data.isActive);
    console.log(isActive)
    console.log(event.data.isActive)

    let OldValue = oldValue
    console.log(oldValue)
    console.log(OldValue)

    let ID = event.data['id']
    const IDNumber = event.data.id;
    setRoomClassID(IDNumber);
    console.log(ID)
    console.log(event.data.id)


    let newActive = event.data.isActive;
    console.log(newActive)
    //  const oldRoomType = event.oldValue.split("(")[0];
    //   setPrice(newRoomType)
    //   setBasePriceID(ID)


    if (event.data.isActive !== oldValue) {
      const newActiveStatus = event.data.isActive;
      setNewActiveStatus(newActiveStatus);
      const oldActiveStatus = oldValue;
      // setFullData(RoomType,oldRoomType,newRoomType,event.data.date)
      setPopUp("Do You  Want to make room Class Status Change  ?");

    }

    const updatedItem = JSON.stringify({
      isActive: event.newValue.split("(")[0]
    })
    console.log(updatedItem)
    fetchx(API_URL + `/updateRoomClass?id=${event.data.id}`, {
      method: 'PUT',
      body: updatedItem,
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((post) => {
        // const swalInstance = MySwal.fire({
        //   text: 'Updated Active Status Successfully!',
        //   icon: 'success',
        //   buttonsStyling: false,
        //   confirmButtonText: 'Close',
        //   customClass: {
        //     confirmButton: 'btn btn-danger'
        //   }
        // });
        // swalInstance.then((result) => {
        //   if (result.isConfirmed) {
        // navigate('');
        //   }
        // }); 
        console.log(post)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }, [])

  console.log(newActiveStatus)
  console.log(roomClass)

  // const gridApi = useRef();

  function Confirm(event) {
    const updatedItem = JSON.stringify({
      isActive: newActiveStatus,
      id: roomClass
    })
    console.log(updatedItem)
    fetchx(API_URL + `/updateRoomClass`, {
      method: 'PUT',
      body: updatedItem,
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((post) => {
        const swalInstance = MySwal.fire({
          text: 'Updated Active Status Successfully!',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          allowOutsideClick: false,
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            navigate('');
          }
        });
        console.log(post)
        if (post.statusCode === 200) {
          setPopUp(false)
          fetchx(API_URL + '/getWeekendsByHotelID')
            .then(result => result.json())
            .then(rowData => {
              console.log(rowData['data'])
            }
            )
        }
      })
      .catch((err) => {
        console.log(err.message)
      })
  }


  const [oldValue, setOldValue] = useState(null);

  // const cellClickedListener = useCallback(event => {
  //     // console.log('cellClicked', event);
  //     console.log('cellClicked', event.data);
  //     console.log('cellClicked', event.data.isActive);
  //     const oldValue = event.data.isActive
  //     console.log(oldValue)
  // }, []);

  const cellClickedListener = useCallback(event => {
    console.log('cellClicked', event.data);
    console.log('cellClicked', event.data.isActive);

    const currentValue = event.data.isActive;
    console.log(currentValue);

    setOldValue(currentValue); // Update the state variable
  }, []);

  console.log("oldValue", oldValue)


  useEffect(() => {
    fetchx(API_URL + '/getWeekendsByHotelID')
      .then(result => result.json())
      .then(rowData => setRowData(rowData['data']))

  }, []);

  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      },
      columnDefs: columnDefs,
      rowData: rowData,
      defaultColDef: {
        headerClass: "text-center"
      }
    }
  ));
  // ** State
  const [data, setData] = useState(null)

  // ** Hooks
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  let navigate = useNavigate();
  const onSubmit = data => {
    setData(data)
    if (data.marketCode !== null && data.marketGroupID !== null) {
      console.log(data)
      let createmarketCode = JSON.stringify({
        "roomClass": data.roomClass,
        "isActive": 1,
      })
      console.log(createmarketCode)
      let res = fetchx(API_URL + "/addroomclass", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketCode
      }).then(data => data.json())
        .then((res) => {
          console.log(res)
          if (res['statusCode'] == 200) {
            fetchx(API_URL + '/getWeekendsByHotelID')
              .then(result => result.json())
              .then(rowData => {
                setRowData(rowData['data'])
                console.log(rowData['data'])
                const swalInstance = MySwal.fire({
                  text: 'Room Class Added Successfully!',
                  icon: 'success',
                  buttonsStyling: false,
                  confirmButtonText: 'Close',
                  allowOutsideClick: false,
                  customClass: {
                    confirmButton: 'btn btn-danger'
                  }
                });
                swalInstance.then((result) => {
                  if (result.isConfirmed) {
                    navigate('');
                  }
                });
              })
          }
          else {
            const swalInstance = MySwal.fire({
              text: res.message,
              icon: 'error',
              buttonsStyling: false,
              confirmButtonText: 'Close',
              allowOutsideClick: false,
              customClass: {
                confirmButton: 'btn btn-danger'
              }
            });
            swalInstance.then((result) => {
              if (result.isConfirmed) {
                navigate('');
              }
            });
          }
        });

    }
  }



  


  const handleReset = () => {
    reset({
      // hotelID: '',
      roomClass: '',
      isActive: null,
    })
  }
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);
  return (
    <div>
      <div className="disabled-animation-modal">
        <Modal
          isOpen={popUp}
          toggle={() => setPopUp(!popUp)}
          className="modal-sm"
        >
          {" "}
          {/*onClosed={onDiscard}*/}
          <ModalHeader
            className="modal-sm"
            toggle={() => {
              setPopUp(!popUp);
            }}
          >
            Need To Check..
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-2 mx-20">
            <div>
              <b>{popUp}</b>
              <br></br>
              <br></br>
              <div className="d-flex">
                <Button
                  color="primary"
                  className="me-1"
                  // className="text-center"
                  onClick={() => Confirm()}
                >
                  Confirm
                </Button>
                <Button
                  color="danger"
                  className="me-1"
                  // className="text-center"
                  onClick={() => {
                    setPopUp(false), navigate('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>

      {/* <div>
<UncontrolledAccordion>
      <AccordionItem>
        <AccordionHeader targetId='1'><h4><b>Add Weekends  </b></h4></AccordionHeader>
        <AccordionBody accordionId='1'>
        <Card>
      <CardHeader>
        <CardTitle tag='h4'>Weekends</CardTitle>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>          
           
           
            <Col md='6' sm='12'>
              <div className='mb-1'>
                <Label className='form-label' for='isActive'>
                  Select Weekends <spam style={{color:'red'}}>*</spam>
                </Label>
                <Controller
                  id='isActive'
                  control={control}
                  name='isActive'
                  render={({ field }) => (
                    <Select
                      isClearable
                      options={dayOptions}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.isActive === null })}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col>
           

            <div className='d-flex'>
              <Button className='me-1' color='primary' type='submit'>
                Submit
              </Button>
              <Button outline color='secondary' type='reset' onClick={handleReset}>
                Reset
              </Button>
            </div>
          </Row>
        </Form>
      </CardBody>
    </Card>    
        </AccordionBody>
      </AccordionItem>
      </UncontrolledAccordion>
</div> */}
      <br></br>
      <div>
        <Col md="3" sm="12" className="mb-1">
          <Label className="form-label" for="fullName">
            Search
          </Label>
          <Input
            type="text"
            id="filter-text-box"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
          />
        </Col>
      </div>
      <div>
        <Card>
          <div className="ag-theme-alpine" style={{ height: 540 }}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData} columnDefs={columnDefs}
              animateRows={true} rowSelection='multiple'
              onCellClicked={cellClickedListener}
              onCellValueChanged={onCellValueChanged}
              // paginationAutoPageSize = 'true'
              // singleClickEdit = 'true'
              paginationPageSize='10'
              pagination='true'
              defaultColDef={defaultColDef}
              headerColor="ddw-primary"

            />
          </div>

        </Card>
      </div>

  <Card>
                <div className="vertically-centered-modal">
                    <Modal
                        isOpen={showEdit}
                        toggle={() => editButton(!showEdit)}
                        // className="modal-lg"
                        className="modal-sm"

                    >
                        <ModalHeader toggle={() => editButton(!showEdit)}>
                            {/* Welcome... */}
                        </ModalHeader>
                        <ModalBody>
                            <Card>
                                <EditWeekend data1={filldata} />

                            </Card>
                        </ModalBody>

                    </Modal>
                </div>


            

            </Card>


      

    </div>
  )
}

export default SourceCode;
