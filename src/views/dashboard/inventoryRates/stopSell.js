// import React, { useState } from 'react';
// import {
//   TabContent, TabPane, Nav, NavItem, NavLink,
//   Card, CardBody, Button, Row, Col, Label, Form
// } from 'reactstrap';
// import classnames from 'classnames';
// import { useForm, Controller } from 'react-hook-form';
// import Flatpickr from 'react-flatpickr';
// import 'flatpickr/dist/themes/material_green.css';
// import Select from 'react-select';
// import Moment from 'moment';
// import './custom-tabs.css'; // Import the custom CSS file

// const RoomInventory = ({ Today }) => {
//   const { control, watch, formState: { errors } } = useForm({});
//   const [activeTab, setActiveTab] = useState('1');
//   const [data, setData] = useState(null);

//   const toggle = tab => {
//     if (activeTab !== tab) setActiveTab(tab);
//   };

//   const fromDate = watch('fromDate');
//   const options = {
//     minDate: Today
//   };
//   const optionsToDate = {
//     minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD'))
//   };

//   let roomTypeID = []; // Mock data, replace with actual data fetching logic

//   return (
//     <div>
//       <Nav tabs className="custom-tabs">
//         <NavItem>
//           <NavLink
//             className={classnames({ active: activeTab === '1' })}
//             onClick={() => { toggle('1'); }}
//           >
//             Stop Sell
//           </NavLink>
//         </NavItem>
//         <NavItem>
//           <NavLink
//             className={classnames({ active: activeTab === '2' })}
//             onClick={() => { toggle('2'); }}
//           >
//             Remove
//           </NavLink>
//         </NavItem>
//       </Nav>
//       <TabContent activeTab={activeTab}>
//         <TabPane tabId="1">
//           <Card>
//             <CardBody>
//               <Form>
//                 <Row>
//                   {Today !== undefined && (
//                     <Col md='4' sm='12' className='mb-1'>
//                       <Label className="form-label" for="fromDate">From Date</Label>
//                       <Controller
//                         control={control}
//                         id='fromDate'
//                         name='fromDate'
//                         render={({ field }) => (
//                           <Flatpickr
//                             required
//                             placeholder="YYYY-MM-DD"
//                             options={options}
//                             {...field}
//                             className={classnames('form-control', { 'is-invalid': data !== null && data.fromDate === null })}
//                           />
//                         )}
//                       />
//                     </Col>
//                   )}
//                   {Today !== undefined && (
//                     <Col md='4' sm='12' className='mb-1'>
//                       <Label className="form-label" for="toDate">To Date</Label>
//                       <Controller
//                         control={control}
//                         id='toDate'
//                         name='toDate'
//                         render={({ field }) => (
//                           <Flatpickr
//                             required
//                             placeholder="YYYY-MM-DD"
//                             {...field}
//                             options={optionsToDate}
//                             className={classnames('form-control', { 'is-invalid': data !== null && data.toDate === null })}
//                           />
//                         )}
//                       />
//                     </Col>
//                   )}
//                   <Col md='4' sm='12' className='mb-1'>
//                     <Label className='form-label' for='roomTypeID'>Room Type ID</Label>
//                     <Controller
//                       id='roomTypeID'
//                       control={control}
//                       name='roomTypeID'
//                       render={({ field }) => (
//                         <Select
//                           isClearable
//                           options={roomTypeID}
//                           classNamePrefix='select'
//                           className={classnames('react-select', { 'is-invalid': data !== null && data.roomTypeID === null })}
//                           {...field}
//                         />
//                       )}
//                     />
//                   </Col>
//                   <div className="d-flex">
//                     <Button className="me-1" color="primary" type="submit">Submit</Button>
//                     <Button outline color="secondary" type="reset">Reset</Button>
//                   </div>
//                 </Row>
//               </Form>
//             </CardBody>
//           </Card>
//         </TabPane>
//         <TabPane tabId="2">
//           <Card>
//             <CardBody>
//               <CardTitle tag="h4">Remove</CardTitle>
//               {/* Add content for the Remove tab here */}
//             </CardBody>
//           </Card>
//         </TabPane>
//       </TabContent>
//     </div>
//   );
// };

// export default RoomInventory;

import React, { useState } from 'react';
import {
  TabContent, TabPane, Nav, NavItem, NavLink,
  Card, CardTitle, CardBody, Button, Row, Col, Label, Form, Input
} from 'reactstrap';
import classnames from 'classnames';
import { useForm, Controller } from 'react-hook-form';
import Flatpickr from 'react-flatpickr';
// import 'flatpickr/dist/themes/material_green.css';
import Select from 'react-select';
import Moment from 'moment';
import API_URL from '../../../config';
import { format } from 'date-fns';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'

const MySwal = withReactContent(Swal)


let roomTypeID = [
  fetchx(API_URL + '/getRoomInventoryRoomTypeID?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      // console.log(resp['data'])
      roomTypeID = resp['data']
      console.log(roomTypeID)
    })
]



const RoomInventory = ({ Today, getRoomInventoryRates, closeStopSell }) => {
  const { control, watch, formState: { errors }, handleSubmit } = useForm({});
  const [activeTab, setActiveTab] = useState('1');
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);

  const [isSwitchOn, setIsSwitchOn] = useState(false);


  const handleSuccess = (message) => {
    return MySwal.fire({
      title: 'Stop Sell!!',
      text: message,
      icon: 'success',
    })
  }


  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      html: message.replace(/\n/g, '<br />'),
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }

  const handleSwitchChange = () => {
    setIsSwitchOn((prevState) => {
      const newState = !prevState;
      console.log(newState); // Log the new state here
      return newState;
    });
  };



  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const fromDate = watch('fromDate');
  const options = {
    minDate: Today
  };
  const optionsToDate = {
    minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD'))
  };


  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event);
    console.log(event)
  };



  // For Stop Sell Add
  const onSubmit = data => {
    console.log(document.getElementById('ex1-active').value)
    console.log(document.getElementById('ex1-inactive').value)
    setOpen(true)
    if (data.fromDate === undefined) {
      setOpen(false)
      handleError("Please add the from date!!");
      return;
    }
    else if (data.toDate === undefined) {
      setOpen(false)

      handleError("Please add the to date!!");
      return;
    }

    console.log(selectedValue)
    let addStopSell;
    if (selectedValue === 'on') {
      addStopSell = JSON.stringify({
        isStopSell: 1,
        fromDate: format(new Date(data.fromDate), 'yyyy-MM-dd'),
        toDate: format(new Date(data.toDate), 'yyyy-MM-dd'),
        roomTypeID: data.roomTypeID.value
      });
    }
    else {
      addStopSell = JSON.stringify({
        isStopSell: 0,
        fromDate: format(new Date(data.fromDate), 'yyyy-MM-dd'),
        toDate: format(new Date(data.toDate), 'yyyy-MM-dd'),
        roomTypeID: data.roomTypeID.value
      });
    }

    console.log(addStopSell)
    fetchx(API_URL + '/updateRoomInventoryStopSell', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: addStopSell,
    })
      .then((res) => res.json())
      .then((postres) => {
        console.log(postres)
        if (postres.statusCode === 200) {
          setOpen(false)
          getRoomInventoryRates()

          if (selectedValue === 'on') {
            handleSuccess('Successfully added stop sell!!')
          }
          else {
            handleSuccess('Successfully removed stop sell!!')
          }
          closeStopSell()
        }

      })
      .catch((error) => {
        //console.log(error);
      });
  }


  // For Stop Sell Add
  const onSubmitRemove = data => {

    const removeStopSell = JSON.stringify({
      isStopSell: 0,
      fromDate: format(new Date(data.fromDate), 'yyyy-MM-dd'),
      toDate: format(new Date(data.toDate), 'yyyy-MM-dd'),
      roomTypeID: data.roomTypeID.value
    });


    fetchx(API_URL + '/updateRoomInventoryStopSell', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: removeStopSell,
    })
      .then((res) => res.json())
      .then((postres) => {
        console.log(postres)
        getRoomInventoryRates()
        closeStopSell()

      })
      .catch((error) => {
        //console.log(error);
      });
  }




  return (
    <div>
      {/* <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => { toggle('1'); }}
          >
            Stop Sell
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => { toggle('2'); }}
          >
            Remove
          </NavLink>
        </NavItem>
      </Nav> */}
      {/* <TabContent activeTab={activeTab}>
        <TabPane tabId="1"> */}
      <Card>
        <CardBody>
          <CardTitle tag="h4">Stop Sell</CardTitle>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              {Today !== undefined && (
                <Col md='4' sm='12' className='mb-1'>
                  <Label className="form-label" for="fromDate">From Date</Label>
                  <Controller
                    control={control}
                    id='fromDate'
                    name='fromDate'
                    render={({ field }) => (
                      <Flatpickr
                        required
                        placeholder="YYYY-MM-DD"
                        options={options}
                        {...field}
                        className={classnames('form-control', { 'is-invalid': data !== null && data.fromDate === null })}
                      />
                    )}
                  />
                </Col>
              )}
              {Today !== undefined && (
                <Col md='4' sm='12' className='mb-1'>
                  <Label className="form-label" for="toDate">To Date</Label>
                  <Controller
                    control={control}
                    id='toDate'
                    name='toDate'
                    // rules={{ required: 'To Date is required' }} // Adding validation rules here

                    render={({ field }) => (
                      <Flatpickr
                        required
                        placeholder="YYYY-MM-DD"
                        {...field}
                        options={optionsToDate}
                        className={classnames('form-control', { 'is-invalid': data !== null && data.toDate === null })}
                      />
                    )}
                  />
                </Col>
              )}
              <Col md='4' sm='12' className='mb-1'>
                <Label className='form-label' for='roomTypeID'>Room Type ID</Label>
                <Controller
                  id='roomTypeID'
                  control={control}
                  name='roomTypeID'
                  render={({ field }) => (
                    <Select
                      required
                      isClearable
                      options={roomTypeID}
                      classNamePrefix='select'
                      className={classnames('react-select', { 'is-invalid': data !== null && data.roomTypeID === null })}
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col>
                {/* <div className='form-switch form-check-primary'>
                  <Input
                    type='switch'
                    id='switch-primary'
                    name='primary'
                    checked={isSwitchOn}
                    onChange={handleSwitchChange}
                  />
                  <span style={{ marginLeft: '10px' }}>{isSwitchOn ? 'Add' : 'Remove'}</span>
                </div> */}
                <div style={{ display: 'flex', gap: '20px' }}>

                  <div className='form-check'>
                    <Input type='radio' id='ex1-active' name='ex1' required onChange={() => handleChange('on')}
                    />
                    <Label className='form-check-label' for='ex1-active'>
                      Stop Sell On
                    </Label>
                  </div>
                  <div className='form-check'>
                    <Input type='radio' name='ex1' id='ex1-inactive' required onChange={() => handleChange('off')}
                    />
                    <Label className='form-check-label' for='ex1-inactive'>
                      Stop Sell Off
                    </Label>
                  </div>
                </div>
              </Col>

              <br></br>
              <br></br>
              <div className="d-flex">
                <Button className="me-1" color="primary" type="submit">Submit</Button>
                <Button outline color="secondary" type="reset">Reset</Button>
              </div>

            </Row>
          </Form>
        </CardBody>
      </Card>


      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={() => setOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>
            Processing your request, please hold on..."
          </h2>

          <CircularProgress color="inherit" />
        </div>
      </Backdrop>

      {/* </TabPane>
        <TabPane tabId="2"> */}
      {/* <Card>
            <CardBody>
              <CardTitle tag="h4">Remove</CardTitle>
              <Form onSubmit={handleSubmit(onSubmitRemove)}>
                <Row>
                  {Today !== undefined && (
                    <Col md='4' sm='12' className='mb-1'>
                      <Label className="form-label" for="fromDate">From Date</Label>
                      <Controller
                        control={control}
                        id='fromDate'
                        name='fromDate'
                        render={({ field }) => (
                          <Flatpickr
                            required
                            placeholder="YYYY-MM-DD"
                            options={options}
                            {...field}
                            className={classnames('form-control', { 'is-invalid': data !== null && data.fromDate === null })}
                          />
                        )}
                      />
                    </Col>
                  )}
                  {Today !== undefined && (
                    <Col md='4' sm='12' className='mb-1'>
                      <Label className="form-label" for="toDate">To Date</Label>
                      <Controller
                        control={control}
                        id='toDate'
                        name='toDate'
                        render={({ field }) => (
                          <Flatpickr
                            required
                            placeholder="YYYY-MM-DD"
                            {...field}
                            options={optionsToDate}
                            className={classnames('form-control', { 'is-invalid': data !== null && data.toDate === null })}
                          />
                        )}
                      />
                    </Col>
                  )}
                  <Col md='4' sm='12' className='mb-1'>
                    <Label className='form-label' for='roomTypeID'>Room Type ID</Label>
                    <Controller
                      id='roomTypeID'
                      control={control}
                      name='roomTypeID'
                      render={({ field }) => (
                        <Select
                          isClearable
                          options={roomTypeID}
                          classNamePrefix='select'
                          className={classnames('react-select', { 'is-invalid': data !== null && data.roomTypeID === null })}
                          {...field}
                        />
                      )}
                    />



                  </Col>
                  
                  <div className="d-flex">
                    <Button className="me-1" color="primary" type="submit">Submit</Button>
                    <Button outline color="secondary" type="reset">Reset</Button>
                  </div>
                </Row>
              </Form>
            </CardBody>
          </Card> */}
      {/* </TabPane>
      </TabContent> */}
    </div >
  );
};

export default RoomInventory;

