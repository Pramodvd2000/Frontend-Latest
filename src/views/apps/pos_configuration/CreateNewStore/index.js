import React, { useState,useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Progress,
  Collapse
} from 'reactstrap';
import Swal from 'sweetalert2';
import Sessions from './sessions'; // Importing ready-made Sessions component
import AddTables from './AddTable'; // Importing ready-made AddTables component
import TransactionCode from './TransactionCode'; // Importing ready-made TransactionCode component
import API_URL from "../../../../config";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
let menuHeadOptions = []
let menuGroupOptions = []
let ServiceChargeTaxOptions = []
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

const RestaurantCreationForm = () => {
  // Form states
  const [activeStep, setActiveStep] = useState(1);
  const [APIStatus,setAPIStatus] = useState(false)
  const [LoadingVar,setLoadingVar] = useState(false)

  const [formStatus, setFormStatus] = useState({
    store: { completed: false, open: true },
    // categories: { completed: false, open: true },
    kot: { completed: true, open: false },
    sessions: { completed: false, open: false },
    tables: { completed: false, open: false },
    transactionCode: { completed: false, open: false }
  });

  const [refreshTransactionCode, setRefreshTransactionCode] = useState(false); // State to trigger refresh

  useEffect(() => {

    fetchx(API_URL+'/getPOSclassificationList')
    .then(result => result.json())
    .then(rowData => {
        menuHeadOptions = rowData['data'].map((item) => item.category);

          
    })

    fetchx(API_URL+'/getmenugrouplist')
    .then(result => result.json())
    .then(rowData => {
        menuGroupOptions = rowData['data'].map((item) => item.groupName);

          
    })

    fetchx(API_URL + '/gettransactioncodetaxpercentage?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      ServiceChargeTaxOptions = resp['data'].map((item) => item.taxPercentage);
      console.log('taxPercentage',ServiceChargeTaxOptions)
    })
    // getmenugrouplist
  },[]);  

  // Store form state
  const [storeForm, setStoreForm] = useState({
    storeID: '',
    restaurantName: '',
    tableCount: 0,
    inHouseGuests: false,
    kotPrint: false,
    kotIP:null,
    billDisplayCode: '',
    type:'',
    is_serviceCharge:false,
    ServicePer:'',
    ServiceChargeTax:''
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    category: '',
    taxPercentage: '',
    costPricePercentage: ''
  });

  // KOT form state
  const [kotForm, setKotForm] = useState({
    ip: '',
    menuHead: '',
    menuGroup: ''
  });
  
  // Categories dropdown options
  const categoryOptions = ['Fast Food', 'Fine Dining', 'Casual Dining', 'Cafe', 'Buffet'];
  
  // Tax percentage dropdown options
  const taxOptions = ['5%', '12%', '18%', '28%'];
  
  // Menu head dropdown options
//   getPOSclassificationList

//   const menuHeadOptions = ['Food', 'Beverages', 'Desserts', 'Alcohol'];
  
  // Menu group dropdown options
//   const menuGroupOptions = ['Starters', 'Main Course', 'Sides', 'Hot Drinks', 'Cold Drinks'];

  // Handle store form input changes
  const handleStoreInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStoreForm({
      ...storeForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle category form input changes
  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate costPricePercentage to allow only numbers
    if (name === 'costPricePercentage' && value !== '' && !/^\d+$/.test(value)) {
      return;
    }
    
    setCategoryForm({
      ...categoryForm,
      [name]: value
    });
  };

  // Handle KOT form input changes
  const handleKotInputChange = (e) => {
    const { name, value } = e.target;
    setKotForm({
      ...kotForm,
      [name]: value
    });
  };

  // Mark step as completed and open next step
  const completeStep = (step, nextStep) => {
    const updatedFormStatus = { ...formStatus };
    
    // Mark current step as completed and closed
    updatedFormStatus[step] = { completed: true, open: false };
    
    // Open next step if available
    if (nextStep && updatedFormStatus[nextStep]) {
      updatedFormStatus[nextStep] = { ...updatedFormStatus[nextStep], open: true };
    }
    
    setFormStatus(updatedFormStatus);
    if (nextStep) {
      setActiveStep(getStepNumber(nextStep));
    }
  };

  // Get step number from step key
  const getStepNumber = (step) => {
    const stepMap = {
      store: 1,
      categories: 2,
      kot: 3,
      sessions: 4,
      tables: 5,
      transactionCode: 6
    };
    return stepMap[step] || 1;
  };

  // Handle store form submission
  const handleStoreSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!storeForm.restaurantName || storeForm.tableCount <= 0 || !storeForm.billDisplayCode) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill all required fields',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    // Submit form logic here
    console.log('Store form submitted:', storeForm);
    sessionStorage.setItem('storeForm',JSON.stringify(storeForm))
    const nextStep = 'sessions';
    setRefreshTransactionCode((prev) => !prev);  // Toggle state to trigger re-render

    // Mark store form as completed and open categories form
    completeStep('store', nextStep);
  };

  // Handle category form submission
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!categoryForm.category || !categoryForm.taxPercentage || categoryForm.costPricePercentage === '') {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill all required fields',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    // Submit form logic here
    console.log('Category form submitted:', categoryForm);
    
    // Determine next step based on kotPrint flag
    const nextStep = storeForm.kotPrint ? 'kot' : 'sessions';
    
    // Mark categories form as completed and open next form
    completeStep('categories', nextStep);
  };

  // Handle KOT form submission
  const handleKotSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!kotForm.ip || !kotForm.menuHead) {
      Swal.fire({
        title: 'Error!',
        text: 'IP and Menu Head are required fields',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    // Submit form logic here
    console.log('KOT form submitted:', kotForm);
    
    // Mark KOT form as completed and open sessions form
    completeStep('kot', 'sessions');
  };

  // Handle Sessions form submission
  const handleSessionsSubmit = () => {
    // Submit form logic here
    // e.preventDefault();
    console.log('Sessions form submitted:');
    
    // Mark sessions form as completed and open tables form
    completeStep('sessions', 'tables');
  };

  // Handle Tables form submission
  const handleTablesSubmit = (tablesData) => {
    // Submit form logic here
    console.log('Tables form submitted:', tablesData);
    
    // Mark tables form as completed and open transaction code form
    completeStep('tables', 'transactionCode');
  };

  // Handle Transaction Code form submission
  const handleTransactionCodeSubmit = () => {
    // Submit form logic here
    console.log('Transaction Code form submitted:');
    
    // Mark transaction code form as completed
    completeStep('transactionCode', null);
    
   
  };

  // Calculate overall progress
  const calculateProgress = () => {
    const totalSteps = Object.keys(formStatus).length;
    const completedSteps = Object.values(formStatus).filter(status => status.completed).length;
    return (completedSteps / totalSteps) * 100;
  };

  // Custom styles to reduce spacing between rows
  const customStyles = {
    formGroup: {
    //   marginBottom: '0.5rem', // Reduced from default
    },
    row: {
      marginBottom: '-2.25rem', // Adding a small margin between rows
    },
    cardBody: {
      padding: '0.75rem', // Reduced padding in card body
    },
    button: {
      marginTop: '0.5rem', // Reduced margin top for buttons
    }
  };

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
    });
  };


//   const CreateStore = () =>{
//     console.log(storeForm)
//     console.log(kotForm)
//     console.log(JSON.parse(sessionStorage.getItem('TableForm')))
//     console.log(JSON.parse(sessionStorage.getItem('SessionForm')))
//     console.log(JSON.parse(sessionStorage.getItem('TransactionCodeForm')))


//     let restaurantData = JSON.stringify({
//       "hotelID": 1,
//       "storeID": storeForm.storeID,
//       'restaurantName': storeForm.restaurantName,
//       'tableCount': storeForm.tableCount,
//       'is_serviceCharge':storeForm.is_serviceCharge == true ? 1 :  0,
//       'ServiceChargePer':storeForm.ServicePer,
//       'ServiceChargeTaxPer':storeForm.ServiceChargeTax,
//       "status": "Enable",
//       'IRD': storeForm.inHouseGuests ? 'Enable' : 'Disable',
//       'KOTprint': storeForm.kotPrint ? 'Enable' : 'Disable',
//       'KOTIP':storeForm.kotIP,
//       "DisplayCode": storeForm.billDisplayCode,
//       "sessions":JSON.stringify(sessionStorage.getItem('SessionForm')),
//       "type":storeForm.type,
//       "createTable":JSON.stringify(sessionStorage.getItem('TableForm')),
//       "CreateTrxnCode":JSON.stringify(sessionStorage.getItem('TransactionCodeForm')),
//       "KOTIPConfig":JSON.stringify(kotForm)

//     });
//     let res = fetchx(API_URL + '/addrestaurant', {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: restaurantData,
//     }).then((res) => {
//       if (res['statusCode'] == 200) {

//  // Show success message
//  Swal.fire({
//   title: 'Success!',
//   text: 'Restaurant creation completed!',
//   icon: 'success',
//   confirmButtonText: 'OK'
// });
       
//       }else{
//         handleError(res['message'] || 'Could not Create the store')
//       }
//     });

//   }

const CreateStore = () => {
  setAPIStatus(true)
  setLoadingVar(true)
  console.log(storeForm)
  console.log(kotForm)
  console.log(JSON.parse(sessionStorage.getItem('TableForm')))
  console.log(JSON.parse(sessionStorage.getItem('SessionForm')))
  console.log(JSON.parse(sessionStorage.getItem('TransactionCodeForm')))

  let restaurantData = JSON.stringify({
    "hotelID": 1,
    "storeID": storeForm.storeID,
    'restaurantName': storeForm.restaurantName,
    'tableCount': storeForm.tableCount,
    'is_serviceCharge': storeForm.is_serviceCharge == true ? 1 : 0,
    'ServiceChargePer': storeForm.ServicePer,
    'ServiceChargeTaxPer': storeForm.ServiceChargeTax,
    "status": "Enable",
    'IRD': storeForm.inHouseGuests ? 'Enable' : 'Disable',
    'KOTprint': storeForm.kotPrint ? 'Enable' : 'Disable',
    'KOTIP': storeForm.kotIP,
    "DisplayCode": storeForm.billDisplayCode,
    "sessions": JSON.stringify(sessionStorage.getItem('SessionForm')),
    "type": storeForm.type,
    "createTable": JSON.stringify(sessionStorage.getItem('TableForm')),
    "CreateTrxnCode": JSON.stringify(sessionStorage.getItem('TransactionCodeForm')),
    "KOTIPConfig": JSON.stringify(kotForm)
  });

  fetchx(API_URL + '/addrestaurant', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: restaurantData,
  }).then(result => result.json())
    .then(resp => {
      setAPIStatus(false)
      setLoadingVar(false)
      console.log(resp)
    if (resp.statusCode == 200) {
      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'Restaurant creation completed!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          // Reset all form states
          setStoreForm({
            storeID: '',
            restaurantName: '',
            tableCount: 0,
            inHouseGuests: false,
            kotPrint: false,
            kotIP: null,
            billDisplayCode: '',
            type: '',
            is_serviceCharge: false,
            ServicePer: '',
            ServiceChargeTax: ''
          });

          setKotForm({
            ip: '',
            menuHead: '',
            menuGroup: ''
          });

          // Reset form status
          setFormStatus({
            store: { completed: false, open: true },
            kot: { completed: true, open: false },
            sessions: { completed: false, open: false },
            tables: { completed: false, open: false },
            transactionCode: { completed: false, open: true }
          });

          // Reset active step
          setActiveStep(1);

          // Clear session storage
          sessionStorage.removeItem('TableForm');
          sessionStorage.removeItem('SessionForm');
          sessionStorage.removeItem('TransactionCodeForm');
        }
      });
    } else {
      handleError(resp.message || 'Could not Create the store');
    }
  }).catch((error) => {
    handleError('An error occurred while creating the restaurant');
    console.error(error);
  });
  
};
  return (
    <div>
      <h2 className="mb-1">Create Restaurant</h2>
      
      <Row>
        <Col md={12}>
          {/* Store Information Form */}
          <Card className="mb-2">
            <CardHeader className="d-flex justify-content-between align-items-center" onClick={() => {
              if (formStatus.store.completed) {
                setFormStatus({
                  ...formStatus,
                  store: { ...formStatus.store, open: !formStatus.store.open }
                });
              }
            }} style={{ cursor: formStatus.store.completed ? 'pointer' : 'default' }}>
              <h5 className="mb-0">1. Store Information</h5>
              {formStatus.store.completed && (
                <span>
                  {formStatus.store.open ? '▼' : '►'}
                </span>
              )}
            </CardHeader>
            <Collapse isOpen={formStatus.store.open}>
              <CardBody style={customStyles.cardBody}>
              <Form onSubmit={handleStoreSubmit}>
  <Row style={customStyles.row}>
    <Col md={3}>
      <FormGroup style={customStyles.formGroup}>
        <Label for="restaurantName">Restaurant Name*</Label>
        <Input
          type="text"
          name="restaurantName"
          id="restaurantName"
          value={storeForm.restaurantName}
          onChange={handleStoreInputChange}
          required
        />
      </FormGroup>
    </Col>

    <Col md={3}>
      <FormGroup style={customStyles.formGroup}>
        <Label for="tableCount">Table Count*</Label>
        <Input
          type="number"
          name="tableCount"
          id="tableCount"
          value={storeForm.tableCount}
          onChange={handleStoreInputChange}
          min="1"
          required
        />
      </FormGroup>
    </Col>

    <Col md={3}>
      <FormGroup style={customStyles.formGroup}>
        <Label for="billDisplayCode">Bill Display Code*</Label>
        <Input
          type="text"
          name="billDisplayCode"
          id="billDisplayCode"
          value={storeForm.billDisplayCode}
          onChange={handleStoreInputChange}
          required
        />
      </FormGroup>
    </Col>

    <Col md={3}>
      <FormGroup style={customStyles.formGroup}>
        <Label for="type">Type*</Label>
        <Select
          name="type"
          id="type"
          options={[
            { value: 'POS', label: 'POS' },
            { value: 'MOD', label: 'MOD' }
          ]}
          value={storeForm.type ? { value: storeForm.type, label: storeForm.type } : null}
          onChange={(selectedOption) => {
            handleStoreInputChange({
              target: { name: 'type', value: selectedOption ? selectedOption.value : '' }
            });
          }}
          classNamePrefix="select"
          className={!storeForm.type ? 'is-invalid' : ''}
          required
        />
      </FormGroup>
    </Col>
  </Row>

  <Row style={customStyles.row}>
    <Col md={2}>
      <FormGroup check style={{ paddingTop: '30px' }}>
        <Label check>
          <Input
            type="checkbox"
            name="inHouseGuests"
            checked={storeForm.inHouseGuests}
            onChange={handleStoreInputChange}
          />{' '}
          Enable In-House Guests
        </Label>
      </FormGroup>
    </Col>

    <Col md={2}>
      <FormGroup check style={{ paddingTop: '30px' }}>
        <Label check>
          <Input
            type="checkbox"
            name="kotPrint"
            checked={storeForm.kotPrint}
            onChange={handleStoreInputChange}
          />{' '}
          Enable KOT Print
        </Label>
      </FormGroup>
    </Col>

    <Col md={2}>
      <FormGroup check style={{ paddingTop: '30px' }}>
        <Label check>
          <Input
            type="checkbox"
            name="is_serviceCharge"
            checked={!!storeForm.is_serviceCharge}
            onChange={(e) =>
              handleStoreInputChange({
                target: { name: 'is_serviceCharge', value: e.target.checked }
              })
            }
          />{' '}
          Enable Service Charge
        </Label>
      </FormGroup>
    </Col>
  </Row>

  {/* Show KOT IP if KOT Print is enabled */}
  {storeForm.kotPrint && (
    <Row style={{ paddingTop: '50px' }}>
      <Col md={3}>
        <FormGroup>
          <Label for="kotIP">KOT IP</Label>
          <Input
            type="text"
            name="kotIP"
            id="kotIP"
            value={storeForm.kotIP || ''}
            onChange={handleStoreInputChange}
            required={storeForm.kotPrint}
          />
        </FormGroup>
      </Col>
    </Row>
  )}

  {/* Show Service Charge Fields if Service Charge is enabled */}
  {storeForm.is_serviceCharge && (
    <Row style={{ paddingTop: storeForm.kotPrint ? '0px' : '60px' }}>
      <Col md={3}>
        <FormGroup>
          <Label for="ServicePer">Service Charge %</Label>
          <Input
            type="number"
            name="ServicePer"
            id="ServicePer"
            value={storeForm.ServicePer || ''}
            onChange={handleStoreInputChange}
            step="0.01"
            required
          />
        </FormGroup>
      </Col>

      <Col md={3}>
        <FormGroup>
          <Label for="ServiceChargeTax">Service Charge Tax %</Label>
          <Select
            name="ServiceChargeTax"
            id="ServiceChargeTax"
            options={[
              { value: '0', label: '0%' },
              { value: '5', label: '5%' },
              { value: '10', label: '10%' },
              { value: '15', label: '15%' },
              { value: '18', label: '18%' }
            ]}
            value={storeForm.ServiceChargeTax ? { value: storeForm.ServiceChargeTax, label: `${storeForm.ServiceChargeTax}%` } : null}
            onChange={(selectedOption) => {
              handleStoreInputChange({
                target: { name: 'ServiceChargeTax', value: selectedOption ? selectedOption.value : '' }
              });
            }}
            classNamePrefix="select"
            required
          />
        </FormGroup>
      </Col>
    </Row>
  )}

  <div className="d-flex justify-content-end mt-2" style={{ paddingRight: '12px' }}>
    <Button color="primary">Save</Button>
  </div>
</Form>


              </CardBody>
            </Collapse>
          </Card>
          
          {/* Store Categories Form */}
          {/* <Card className="mb-2">
            <CardHeader className="d-flex justify-content-between align-items-center" onClick={() => {
              if (formStatus.categories.completed) {
                setFormStatus({
                  ...formStatus,
                  categories: { ...formStatus.categories, open: !formStatus.categories.open }
                });
              }
            }} style={{ cursor: formStatus.categories.completed ? 'pointer' : 'default' }}>
              <h5 className="mb-0">2. Store Categories</h5>
              {formStatus.categories.completed && (
                <span>
                  {formStatus.categories.open ? '▼' : '►'}
                </span>
              )}
            </CardHeader>
            <Collapse isOpen={formStatus.categories.open}>
              <CardBody style={customStyles.cardBody}>
                <Form onSubmit={handleCategorySubmit}>
                  <Row style={customStyles.row}>
                    <Col md={3}>
                      <FormGroup style={customStyles.formGroup}>
                        <Label for="category">Category*</Label>
                        <Input
                          type="select"
                          name="category"
                          id="category"
                          value={categoryForm.category}
                          onChange={handleCategoryInputChange}
                          required
                        >
                          <option value="">Select a category</option>
                          {categoryOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup style={customStyles.formGroup}>
                        <Label for="taxPercentage">Tax Percentage*</Label>
                        <Input
                          type="select"
                          name="taxPercentage"
                          id="taxPercentage"
                          value={categoryForm.taxPercentage}
                          onChange={handleCategoryInputChange}
                          required
                        >
                          <option value="">Select tax percentage</option>
                          {taxOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup style={customStyles.formGroup}>
                        <Label for="costPricePercentage">Cost Price Percentage*</Label>
                        <Input
                          type="text"
                          name="costPricePercentage"
                          id="costPricePercentage"
                          value={categoryForm.costPricePercentage}
                          onChange={handleCategoryInputChange}
                          placeholder="Numbers only"
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
<div className="d-flex justify-content-end mt-2">

                  <Button color="primary" >Save</Button>
                  </div>
                  </Col>
                  </Row>
                </Form>
              </CardBody>
            </Collapse>
          </Card> */}
          
          {/* KOT Settings Form - Conditional */}
          {/* {storeForm.kotPrint && (
            <Card className="mb-2">
              <CardHeader className="d-flex justify-content-between align-items-center" onClick={() => {
                if (formStatus.kot.completed) {
                  setFormStatus({
                    ...formStatus,
                    kot: { ...formStatus.kot, open: !formStatus.kot.open }
                  });
                }
              }} style={{ cursor: formStatus.kot.completed ? 'pointer' : 'default' }}>
                <h5 className="mb-0">2. KOT IP Configuration</h5>
                {formStatus.kot.completed && (
                  <span>
                    {formStatus.kot.open ? '▼' : '►'}
                  </span>
                )}
              </CardHeader>
              <Collapse isOpen={formStatus.kot.open}>
                <CardBody style={customStyles.cardBody}>
                  <Form onSubmit={handleKotSubmit}>
                    <Row style={customStyles.row}>
                      <Col md={3}>
                        <FormGroup style={customStyles.formGroup}>
                          <Label for="ip">IP Address*</Label>
                          <Input
                            type="text"
                            name="ip"
                            id="ip"
                            value={kotForm.ip}
                            onChange={handleKotInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup style={customStyles.formGroup}>
                          <Label for="menuHead">Menu Head*</Label>
                          <Input
                            type="select"
                            name="menuHead"
                            id="menuHead"
                            value={kotForm.menuHead}
                            onChange={handleKotInputChange}
                            required
                          >
                            <option value="">Select Menu Head</option>
                            {menuHeadOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup style={customStyles.formGroup}>
                          <Label for="menuGroup">Menu Group</Label>
                          <Input
                            type="select"
                            name="menuGroup"
                            id="menuGroup"
                            value={kotForm.menuGroup}
                            onChange={handleKotInputChange}
                          >
                            <option value="">None</option>
                            {menuGroupOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                      <div className="d-flex justify-content-end mt-2">

<Button color="primary" >Save</Button>
</div>          </Col> </Row>       </Form>
                </CardBody>
              </Collapse>
            </Card>
          )} */}
          
          {/* Sessions Form */}
          <Card className="mb-2">
            <CardHeader className="d-flex justify-content-between align-items-center" onClick={() => {
              if (formStatus.sessions.completed) {
                setFormStatus({
                  ...formStatus,
                  sessions: { ...formStatus.sessions, open: !formStatus.sessions.open }
                });
              }
            }} style={{ cursor: formStatus.sessions.completed ? 'pointer' : 'default' }}>
              <h5 className="mb-0">{storeForm.kotPrint ? '2' : '2'}. Sessions</h5>
              {formStatus.sessions.completed && (
                <span>
                  {formStatus.sessions.open ? '▼' : '►'}
                </span>
              )}
            </CardHeader>
            <Collapse isOpen={formStatus.sessions.open}>
              <CardBody style={customStyles.cardBody}>
                {/* Imported Sessions component */}
                <Sessions onSubmit={handleSessionsSubmit} />
              </CardBody>
            </Collapse>
          </Card>
          
          {/* Tables Form */}
          <Card className="mb-2">
            <CardHeader className="d-flex justify-content-between align-items-center" onClick={() => {
              if (formStatus.tables.completed) {
                setFormStatus({
                  ...formStatus,
                  tables: { ...formStatus.tables, open: !formStatus.tables.open }
                });
              }
            }} style={{ cursor: formStatus.tables.completed ? 'pointer' : 'default' }}>
              <h5 className="mb-0">{storeForm.kotPrint ? '3' : '3'}. Tables</h5>
              {formStatus.tables.completed && (
                <span>
                  {formStatus.tables.open ? '▼' : '►'}
                </span>
              )}
            </CardHeader>
            <Collapse isOpen={formStatus.tables.open}>
              <CardBody style={customStyles.cardBody}>
                {/* Imported AddTables component */}
                <AddTables onSubmit={handleTablesSubmit} />
              </CardBody>
            </Collapse>
          </Card>
          
          {/* Transaction Code Form */}
          <Card className="mb-2">
            <CardHeader className="d-flex justify-content-between align-items-center" onClick={() => {
              if (formStatus.transactionCode.completed) {
                setFormStatus({
                  ...formStatus,
                  transactionCode: { ...formStatus.transactionCode, open: !formStatus.transactionCode.open }
                });
              }
            }} style={{ cursor: formStatus.transactionCode.completed ? 'pointer' : 'default' }}>
              <h5 className="mb-0">{storeForm.kotPrint ? '4' : '4'}. Transaction Code</h5>
              {formStatus.transactionCode.completed && (
                <span>
                  {formStatus.transactionCode.open ? '▼' : '►'}
                </span>
              )}
            </CardHeader>
            <Collapse isOpen={formStatus.transactionCode.open}>
              <CardBody style={customStyles.cardBody}>
                {/* Imported TransactionCode component */}
                <TransactionCode         key={refreshTransactionCode}  // Changing the key forces a re-render
 is_serviceCharge={storeForm.is_serviceCharge} onSubmit={handleTransactionCodeSubmit} />
              </CardBody>
            </Collapse>
          </Card>
        </Col>
      </Row>

      <div className="d-flex justify-content-end mt-2">

<Button disabled={!(formStatus.transactionCode.completed) || APIStatus} onClick = {()=>{CreateStore()}} color="primary" >Submit</Button>
</div>   

<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={LoadingVar}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                    Please wait... We're processing your request,
                    </h1>
                    {(
                      <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                       which may take a little longer due to additional data. Please be patient!
                      </h1>
                    )}
                    <CircularProgress color="inherit" />
                  </div>
                </Backdrop>
    </div>
  );
};

export default RestaurantCreationForm;