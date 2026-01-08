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
import Moment from 'moment';
import API_URL from '../../../config'
// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Input, Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText, Modal, ModalBody, ModalHeader } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import { useRef, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'react-feather'
import { useNavigate } from 'react-router-dom'
// const id = '1';
// import App from './datagrid'

const defaultValues = {
  membershipType: null,
  membershipNo: '',
  name: '',
  membershipSince: '',
  membershipLevel: null,
  expiryDate: null
}


const membershipType = [
  { value: "1", label: "OterraBlack" },
  { value: "2", label: "OterraGold" },
  { value: "3", label: "OterraSilver" },
  { value: "4", label: "OterraPlatinum" },
];

const levels = [
  { value: "1", label: "Black" },
  { value: "2", label: "Gold" },
  { value: "3", label: "Silver" },
  { value: "4", label: "Platinum" },
];



const Floor = ({ stepper, type, data3, data1 }) => {
  console.log(data1.membershipDetails)
  const [reload, setreload] = useState(true)
  const [load, setload] = useState(true)
  const [selectedValue, setSelectedValue] = useState()
  const [selectedValueType, setSelectedValueType] = useState()
  const [membershipType, setMembershipType] = useState()
  const [levels, setLevels] = useState()
  const [guestMembershipData, setGuestMembershipData] = useState()
  const [membershipSinceValue, setMembershipSince] = useState()
  const today = Moment().format('YYYY-MM-DD');
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [buttonClicked, setButtonClicked] = useState(false)


  let navigate = useNavigate()

  useEffect(() => {
    fetchx(API_URL + `/getGuestInformation?hotelID=1&guestID=${data1.id}`)
      .then((result) => result.json())
      .then((resp) => {
        if (resp.statusCode = 200) {

          setGuestMembershipData(resp["data"])
        }
      })


    fetchx(API_URL + "/getMembershipLevelDropDown")
      .then((result) => result.json())
      .then((resp) => {
        console.log(resp['data'])
        if (resp.statusCode = 200) {
          const formattedLevels = resp.data.map(item => ({
            value: item.id,  // Assuming 'id' is the unique identifier
            label: item.membershipLevel // Assuming 'name' is the display text
          }));
          setLevels(formattedLevels);
        }            // console.log(room)
      })
    fetchx(API_URL + "/getMembershipTypeDropDown")
      .then((result) => result.json())
      .then((resp) => {
        if (resp.statusCode = 200) {
          const formattedMember = resp.data.map(item => ({
            value: item.id,  // Assuming 'id' is the unique identifier
            label: item.membershipType // Assuming 'name' is the display text
          }));
          setMembershipType(formattedMember);
        }
        // console.log(resp['data'])
        // console.log(floor)
      })

  }, []);



  // Success modal
  const handleSuccess = (message) => {
    return MySwal.fire({
      title: 'Guest Update !!',
      text: message,
      icon: 'success',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    })
  }

  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }


  const handleChange = (selectedOption) => {
    setSelectedValueType(selectedOption.value);
    console.log(selectedOption.label)
    console.log(localStorage.getItem('data1.membershipDetails.membershipType'))
    localStorage.removeItem('data1.membershipDetails.membershipType')
    localStorage.setItem('data1.membershipDetails.membershipType', selectedOption.label);
    localStorage.setItem('data1.membershipDetails.membershipType', selectedOption.value);

    console.log(localStorage.getItem('data1.membershipDetails.membershipType'))
    console.log(localStorage.getItem('data1.membershipDetails.membershipType'))
    setreload(false)
    setTimeout(() => { setreload(true) }, 1)
  };

  const defaultReason = {
    value: guestMembershipData ? guestMembershipData[0].membershipTypeID : '',
    label: guestMembershipData ? guestMembershipData[0].membershipType : '',
  };

  const handleChange1 = (selectedOption) => {
    setSelectedValue(selectedOption.value);
    console.log(selectedOption.label)
    console.log(localStorage.getItem('data1.membershipDetails.membershipLevel'))
    localStorage.removeItem('data1.membershipDetails.membershipLevel')
    localStorage.setItem('data1.membershipDetails.membershipLevel', selectedOption.label);
    localStorage.setItem('data1.membershipDetails.membershipLevel', selectedOption.value);

    console.log(localStorage.getItem('data1.membershipDetails.membershipLevel'))
    console.log(localStorage.getItem('data1.membershipDetails.membershipLevel'))
    setreload(false)
    setTimeout(() => { setreload(true) }, 1)
  };



  const defaultReason1 = {
    value: guestMembershipData ? guestMembershipData[0].membershipLevelID : '',
    label: guestMembershipData ? guestMembershipData[0].membershipLevel : '',
  };


  // Option for arrival date
  const options = { maxDate: today };

  // console.log(data1.membershipDetails)

  // Ag Grid
  const [rowData, setRowData] = useState();

  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Membership Type', field: 'membershipType', suppressSizeToFit: true, maxWidth: 160 },
    { headerName: 'Membership No', field: 'membershipNo', suppressSizeToFit: true },
    { headerName: 'Name On Card', field: 'nameOnCard', suppressSizeToFit: true, maxWidth: 160 },
    { headerName: 'Membership Since', field: 'membershipSince', suppressSizeToFit: true, maxWidth: 160 },
    { headerName: 'Membership level', field: 'level', suppressSizeToFit: true },
    { headerName: 'Expiry Date', field: 'expiryDate', suppressSizeToFit: true, maxWidth: 160 },
  ]);

  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));

  const cellClickedListener = useCallback(event => {
    console.log('cellClicked', event);
  }, []);

  useEffect(() => {
    fetchx(API_URL + '/floor?hotelID=1&floor=1&blockID=1')
      .then(result => result.json())
      .then(rowData => setRowData(rowData['data']))
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
    // if (localStorage.getItem('guestID')!=null) {
    // Submit form data
    console.log('Submitting form data...',);
    setData(data)
    console.log(data)
    // if (
    //     data.membershipNo !== null &&
    //     data.expiryDate !== null
    // ) {

    if (data1?.id) {
      setButtonClicked(true)


               
                const guestID = data1?.id;
                const membershipType = selectedValueType || guestMembershipData?.[0]?.membershipTypeID || '';
                const membershipNo = data?.membershipNo1 || guestMembershipData?.[0]?.membershipNo || '';
                const nameOnCard = data?.name2 || guestMembershipData?.[0]?.nameOnCard || '';
                const membershipSince = membershipSinceValue !== undefined
                  ? membershipSinceValue
                  : guestMembershipData?.[0]?.membershipSince || '';
                const membershipLevel = selectedValue || guestMembershipData?.[0]?.membershipLevelID || '';
            
                let missingFields = [];
    
                if (!guestID) missingFields.push("guest Not Created!!");
                if (!membershipType) missingFields.push("Membership Type");
                if (!membershipNo) missingFields.push("Membership No");
                if (!nameOnCard) missingFields.push("Name On Card");
                if (!membershipSince) missingFields.push("Membership Since");
                if (!membershipLevel) missingFields.push("Membership Level");
    
                if (missingFields.length > 0) {
                    if (!guestID) {
                        handleError(`${missingFields.join(', ')}`);
                        setButtonClicked(false)
    
                        return;
                    }
                    handleError(`❌ Missing required fields: ${missingFields.join(', ')}`);
                    setButtonClicked(false)
    
                    return;
                }
    
    
    let createmarketGroup;
    // if(guestMembershipData.length > 0){
    //      createmarketGroup = JSON.stringify({
    //         "guestID": data1.membershipDetails.guestID,
    //         "membershipType": selectedValueType || guestMembershipData ? guestMembershipData[0].membershipTypeID : '',
    //         "membershipNo": data.membershipNo1  || guestMembershipData ? guestMembershipData[0].membershipNo : "",
    //         "nameOnCard": data.name2 || guestMembershipData ? guestMembershipData[0].nameOnCard : "",
    //         "membershipSince": (Moment(String(new Date(data.membershipSince1[0]))).format('YYYY-MM-DD')) || guestMembershipData ? Moment(String(new Date(guestMembershipData[0].membershipSince))).format('YYYY-MM-DD') : "",
    //         "membershipLevel": selectedValue || guestMembershipData ? guestMembershipData[0].membershipLevelID : '',
    //      })
    // }
    // else{
    //      createmarketGroup = JSON.stringify({
    //         "hotelID": data.hotelID,
    //         "guestID": data1.membershipDetails.guestID,
    //         "membershipType": selectedValueType,
    //         "membershipNo": data.membershipNo1,
    //         "nameOnCard": data.name2,
    //         "membershipSince": (Moment(String(new Date(data.membershipSince1[0]))).format('YYYY-MM-DD')),
    //         "membershipLevel": selectedValue,
    //     })
    // }

    if (guestMembershipData.length > 0) {
      console.log("If consition", data)
      createmarketGroup = JSON.stringify({
        "guestID": data1.id,
        "membershipType": selectedValueType || guestMembershipData[0]?.membershipTypeID || '',
        "membershipNo": data.membershipNo1 || guestMembershipData[0]?.membershipNo || "",
        "nameOnCard": data.name2 || guestMembershipData[0]?.nameOnCard || "",
        // "membershipSince": data.membershipSince1?.[0]
        //     ? Moment(data.membershipSince1[0]).format("YYYY-MM-DD")
        //     : guestMembershipData[0]?.membershipSince
        //         ? Moment(guestMembershipData[0].membershipSince).format("YYYY-MM-DD")
        //         : "",
        "membershipSince": membershipSinceValue !== undefined ? membershipSinceValue : guestMembershipData[0].membershipSince,


        "membershipLevel": selectedValue || guestMembershipData[0]?.membershipLevelID || '',
      });
      // console.log(Moment(new Date(membershipSinceValue[0])).format("YYYY-MM-DD"))
      console.log(membershipSinceValue)
      console.log(guestMembershipData)
      console.log(guestMembershipData[0].membershipSince)

    } else {
      console.log("else consition")

      createmarketGroup = JSON.stringify({
        "hotelID": data.hotelID,
        "guestID": data1.id,
        "membershipType": selectedValueType || '',
        "membershipNo": data.membershipNo1 || '',
        "nameOnCard": data.name2 || '',
        "membershipSince": data.membershipSince1?.[0]
          ? Moment(String(new Date(data.membershipSince1[0]))).format('YYYY-MM-DD')
          : '',
        "membershipLevel": selectedValue || '',
      });
    }


    console.log(createmarketGroup)
    localStorage.removeItem('guestID')

    console.log("hi")
    let res = fetchx(API_URL + `/updatemembershipdetails?id=${data1.id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then((res) => {
      console.log(res);
      if (res['status'] == 200) {
        fetchx(API_URL + '/getGuestProfileNew?hotelID=1')
          .then(result => result.json())
          .then(rowData => {
            setRowData(rowData['data'])
            navigate("");

            setButtonClicked(false)

            // console.log(rowData['data'])
          })
      }

    });
    toast(
      <div className='d-flex'>
        <div className='me-1'>
          <Avatar size='sm' color='success' icon={<Check size={12} />} />
        </div>
        <div className='d-flex flex-column'>
          <h6>Form Submitted!</h6>
          <h4>Membership Details Added Successfull</h4>
        </div>
      </div>
    )
    // }
    // } 
    // else {
    //     console.log('User is not logged in. Form data not submitted.');
    //     alert("Please Fill Basic Details First")
    //   }    


  }
  else {
      setButtonClicked(false)
      handleError(`Guest Not Created!!`);

  }

  }


  const handleDateChange = (selectedDates) => {
    if (selectedDates.length > 0) {
      const formattedDate = Moment(selectedDates[0]).format("YYYY-MM-DD");
      setMembershipSince(formattedDate); // Assuming you're using react-hook-form
      console.log(selectedDates)
    }
  };



  const handleReset = () => {
    reset({
      membershipType: null,
      membershipNo: '',
      name: '',
      membershipSince: '',
      membershipLevel: null,
      expiryDate: null
    })
  }

  function removeMembershipDetails() {

    let createmarketGroup = JSON.stringify({
      "guestID": data1.id,

    });


    let res = fetchx(API_URL + `/removeGuestMembershipDetails`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then(result => result.json())
      .then((res) => {
        console.log(res);
        if (res['statusCode'] == 200) {
          console.log(res)
          console.log(res['data'])
          if (typeof res['data'] === 'string') {
            handleError(res['data'])
            // navigate('')

          }
          else {
            handleSuccess("Membership Details Removed Successfully")
            navigate('')
          }

          // console.log(rowData['data'])

        }

      });
  }

  return (
    <div>
      <Card>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              {membershipType && <Col md='4' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="membershipType1">
                    Membership Type
                  </Label>
                  <Controller
                    id="membershipType1"
                    control={control}
                    name="membershipType1"
                    render={({ field }) => (
                      <Select
                        // required
                        isClearable
                        options={membershipType}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select", {
                          // "is-invalid": data !== null && data.membershipType === null,
                        })}
                        {...field}
                        onChange={handleChange}
                        defaultValue={defaultReason}

                      // value={data3.data2.membershipType}
                      // value={membershipType.find(
                      //     (type) => type.value === (guestMembershipData ? guestMembershipData[0].membershipType : "")
                      // )}
                      />
                    )}
                  />
                </div>
              </Col>}

              {guestMembershipData && <Col md='4' sm='12'>
                <div className='mb-1'>
                  <Label className='form-label' for='membershipNo1'>
                    Membership No
                  </Label>
                  <Controller

                    control={control}
                    id='membershipNo1'
                    name='membershipNo1'
                    render={({ field }) => <Input placeholder='Membership No' defaultValue={guestMembershipData && guestMembershipData.length > 0 ? guestMembershipData[0].membershipNo : ""}
                      invalid={errors.membershipNo1 && true} {...field}
                      // required
                    />}
                  />
                </div>
              </Col>}


              {guestMembershipData && <Col md='4' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='name2'>
                    Name On Card
                  </Label>
                  <Controller

                    control={control}
                    id='name2'
                    name='name2'
                    render={({ field }) => <Input placeholder='Name' invalid={errors.name2 && true} {...field}
                      defaultValue={guestMembershipData ? guestMembershipData[0].nameOnCard : ""}
                      // required
                    />}
                  />
                </div>
              </Col>}
              {guestMembershipData && <Col md='4' sm='12'>
                <div className='mb-1'>
                  <Label className='form-label' for='membershipSince1'>
                    Membership Since
                  </Label>
                  <Controller
                    defaultValue={guestMembershipData ? guestMembershipData[0].membershipSince : ""}
                    // defaultValue={guestMembershipData?.[0]?.membershipSince
                    //     ? Moment(guestMembershipData[0].membershipSince).format("YYYY-MM-DD")
                    //     : ""}
                    control={control}
                    id='membershipSince1'
                    name='membershipSince1'
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        // required
                        options={options} placeholder='YYYY-MM-DD '
                        className={classnames('form-control', {
                          // 'is-invalid': data !== null && data.membershipSince1 === null
                        })}
                        onChange={(selectedDates) => handleDateChange(selectedDates)}
                      />
                    )}
                  />
                </div>
              </Col>}



              {levels && <Col md='4' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="level1">
                    Level
                  </Label>
                  <Controller
                    id="level1"
                    control={control}
                    name="level1"
                    render={({ field }) => (
                      <Select
                        // required
                        defaultValue={defaultReason1}
                        isClearable
                        options={levels}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select", {
                          // "is-invalid": data !== null && data.level1 === null,
                        })}
                        {...field}
                        onChange={handleChange1}
                        value={levels.find(
                          (level) => level.value === (guestMembershipData ? guestMembershipData[0].membershipLevel : "")
                        )}

                      />
                    )}
                  />
                </div>
              </Col>}

              {/* <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='expiryDate1'>
                                        Expiry Date
                                    </Label>
                                    <Controller
                                      defaultValue={data3.data2.expiryDate} 
                                        control={control}
                                        id='expiryDate1'
                                        name='expiryDate1'
                                        render={({ field }) => (
                                            <Flatpickr
                                                {...field}
                                                options={{ allowInput: true }} placeholder='YYYY-MM-DD '
                                                className={classnames('form-control', {
                                                    'is-invalid': data !== null && data.expiryDate1 === null
                                                })}
                                            />
                                        )}
                                    />
                                </div>
                            </Col> */}
            </Row>
            <div className='d-flex'>
              <Button className='me-1' color='primary' type='submit' disabled={buttonClicked}>
                        Submit
                    </Button>
              <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                Reset
              </Button>
              {/* <Button className='me-1' color='primary' type='reset' onClick={() => { setConfirmSubmit(!confirmSubmit) }}>
                Remove
              </Button> */}
            </div>

            <br></br>
            <br></br>

            <div className='d-flex justify-content-between'>
              <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
                <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                <span className='align-middle d-sm-inline-block d-none'>Previous</span>
              </Button>

            </div>

          </Form>
        </CardBody>
      </Card>

      <Modal isOpen={confirmSubmit} toggle={() => setConfirmSubmit(!confirmSubmit)} className='modal-dialog-centered'>
        <ModalHeader className='bg-transparent' toggle={() => setConfirmSubmit(!confirmSubmit)}></ModalHeader>
        <ModalBody className='text-center mb-2'>

          <div className='text-center mb-2'>
            <h5><b>Do You Want to remove membership?</b></h5>

            <div className="button-container text-center">
              <Button className="me-1" color="primary" type='submit' onClick={() => removeMembershipDetails()}>
                Confirm
              </Button>
              <Button className="me-1" color="primary" onClick={() => setConfirmSubmit(false)}>
                Back
              </Button>

            </div>

          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default Floor;

