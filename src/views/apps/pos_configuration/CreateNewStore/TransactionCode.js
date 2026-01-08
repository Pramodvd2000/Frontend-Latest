import { useState, useRef, useEffect, useCallback } from "react";
import Select from "react-select";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { selectThemeColors } from "@utils";
import { Input, Card, Form, Label, Button, InputGroup, Row, Col } from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';

import API_URL from "../../../../config";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
const id = '1';

const defaultValues = {
  transactionCode: "",
  description: "",
  groupID: null,
  baseRate: "",
  taxPercentage: null,
  hsn_sacCode: "",
  costCenter: "",
  costCenterType: ""
};

const TransactionCode = ({is_serviceCharge, onSubmit }) => {
  const [open, setOpen] = useState('');
  const toggle = id => { open === id ? setOpen() : setOpen(id) };
  
  // State for form data management
  const [groupID, setGroupIDOptions] = useState([]);
  const [allMenuHeaderOptions, setAllMenuHeaderOptions] = useState([]);
  const [availableMenuHeaderOptions, setAvailableMenuHeaderOptions] = useState([]);
  const [taxPercentage, setTaxPercentageOptions] = useState([]);
  const [selectedMenuHeader, setSelectedMenuHeader] = useState(null);
  const gridRef = useRef();
  const [selectedTaxPercentage, setSelectedTaxPercentage] = useState([]);
  const [selectedtaxPerc,setselectedtaxPerc] = useState('');

  // State to store completed transaction codes
  const [completedForms, setCompletedForms] = useState([]);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [companyData, setCompanyData] = useState(null);

  // Check if all menu headers have been used
  useEffect(() => {
    if (allMenuHeaderOptions.length > 0 && availableMenuHeaderOptions.length === 0) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  }, [availableMenuHeaderOptions, allMenuHeaderOptions]);

  // ** Hooks
  const { reset, handleSubmit, control, setValue,formState: { errors } } = useForm({ defaultValues });
  let navigate = useNavigate();

  // Fetch group ID options
  useEffect(() => {
    fetch(API_URL + '/getforeignkeygroupid?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        setGroupIDOptions(resp['data']);
      });
  }, []);

  // Fetch Menu Header options
  useEffect(() => {
    fetch(API_URL + "/getMenuHeader", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(data => data.json())
      .then((res) => {
        if (res.statuscode == 200) {
          const menuOptions = Object.keys(res['data']).map((key) => ({
            value: key,
            label: key
          }));

          if(is_serviceCharge){
            menuOptions.push({value:'Service Charge',label:'Service Charge'})
          }
          setAllMenuHeaderOptions(menuOptions);
          setAvailableMenuHeaderOptions(menuOptions);
          // setAllMenuHeaderOptions([{value:'Food',label:'Food'}]);
          // setAvailableMenuHeaderOptions([{value:'Food',label:'Food'}]);
        }
      });
  }, []);

  // Fetch tax percentage options
  useEffect(() => {
    fetch(API_URL + '/gettransactioncodetaxpercentage?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        setTaxPercentageOptions(resp['data']);
      });
  }, []);
  const handleReset = () => {
    setCompletedForms([]); // Clear all completed transaction codes
    setAvailableMenuHeaderOptions([...allMenuHeaderOptions]); // Reset available menu headers
    setSelectedMenuHeader(null); // Reset selected menu header
    setselectedtaxPerc(''); // Reset selected tax percentage
    setSelectedTaxPercentage([]); // Reset selected tax option
    setCompanyData(null); // Clear tax-related data
    reset(defaultValues); // Reset form fields to default
  };
  // Error handling
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

  // Handle menu header selection
  const handleMenuHeaderChange = (selectedOption) => {
    setSelectedMenuHeader(selectedOption);
      // Get restaurant name from sessionStorage
  const StoreData = JSON.parse(sessionStorage.getItem('storeForm')) || '';
  console.log('StoreData',StoreData)
  const restaurantName = StoreData.restaurantName


  // If menu header is selected, update description
  if (selectedOption && restaurantName) {
    setValue('description', `${restaurantName} ${selectedOption.label}`);
  } else {
    setValue('description', '');
  }
  };

  const handleChange = (selectedOption) => {
    console.log(selectedOption)
    const selectedIds = selectedOption.value;
    setselectedtaxPerc(selectedOption.taxPercentage)
    const selectedIdsString = JSON.stringify(selectedIds); // Convert to a JSON string
    // console.log(selectedIdsString);
    // console.log(selectedIds.length);
    if (selectedIds.length === 0) {
      setCompanyData(null);
    } else {
      setCompanyData(selectedIds);

    }
  };
  // Form submission
  const FormSubmit = (data) => {
    if (!selectedMenuHeader) {
      handleError("Please select a Menu Header");
      return;
    }

    if (!data.transactionCode || !data.description || !data.groupID) {
      handleError("Please fill all required fields");
      return;
    }

    // Create new completed form object
    const newCompletedForm = {
      menuHeader: selectedMenuHeader.label,
      transactionCode: data.transactionCode,
      description: data.description,
      groupID: data.groupID.value,
      baseRate: data.baseRate || "0",
      taxID: companyData,
        taxPercentage:selectedtaxPerc,
      // taxPercentage: data.taxPercentage ? data.taxPercentage.taxPercentage : "",
      hsn_sacCode: data.hsnSacCode || "",
      costCenter: data.costCenter || "",
      costCenterType: data.costCenterType || ""
    };

    // Add to completed forms and remove the selected menu header from available options
    setCompletedForms([...completedForms, newCompletedForm]);
    setAvailableMenuHeaderOptions(availableMenuHeaderOptions.filter(
      option => option.value !== selectedMenuHeader.value
    ));
    
    // Reset form and selected menu header
    reset(defaultValues);
    setSelectedMenuHeader(null);
  };

  // Final submission of all forms
  const handleFinalSubmit = () => {
    // Here you would normally send all the completed forms data to the server
    console.log('forms filled ',completedForms)
    sessionStorage.setItem('TransactionCodeForm', JSON.stringify(completedForms));
    onSubmit();
  };

  return (
    <div>
      <div >
        {/* <h4><b>Transaction Code </b></h4> */}
        <p>Please create transaction codes for all menu headers ({completedForms.length}/{allMenuHeaderOptions.length} completed)</p>
      </div>

      {!isFormComplete && (
        <Card>
          <Form onSubmit={handleSubmit(FormSubmit)}>
            <Row>
              <Col md='4' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="MenuHeader">
                    Menu Header <span style={{color:'red'}}>*</span>
                  </Label>
                  <Select
                    isClearable
                    options={availableMenuHeaderOptions}
                    classNamePrefix='select'
                    theme={selectThemeColors}
                    className={classnames('react-select')}
                    value={selectedMenuHeader}
                    onChange={handleMenuHeaderChange}
                  />
                </div>
              </Col>

              <Col md='4' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="transactionCode">
                    Transaction Code <span style={{color:'red'}}>*</span>
                  </Label>
                  <InputGroup className="input-group-merge">
                    <Controller
                      id="transactionCode"
                      name="transactionCode"
                      control={control}
                      render={({ field }) => (
                        <Cleave
                          required
                          placeholder="Transaction Code"
                          {...field}
                          className={classnames("form-control")}
                        />
                      )}
                    />
                  </InputGroup>
                </div>
              </Col>

              {/* <Col md='4' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='description'>
                    Description <span style={{color:'red'}}>*</span>
                  </Label>
                  <InputGroup className="input-group-merge">
                    <Controller
                      defaultValue=''
                      control={control}
                      id='description'
                      name='description'
                      render={({ field }) => (
                        <Input 
                          placeholder="Description" 
                          required
                          className={classnames({})} 
                          {...field}
                        />
                      )}
                    />
                  </InputGroup>
                </div>
              </Col> */}

<Col md='4' sm='12' className='mb-1'>
  <div className='mb-1'>
    <Label className='form-label' for='description'>
      Description <span style={{color:'red'}}>*</span>
    </Label>
    <InputGroup className="input-group-merge">
      <Controller
        control={control}
        id='description'
        name='description'
        render={({ field }) => (
          <Input 
            placeholder="Description"
            disabled
            value={field.value} // Ensures it's updated dynamically

            {...field} // Automatically controlled by react-hook-form
          />
        )}
      />
    </InputGroup>
  </div>
</Col>

              <Col md='4' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="groupID">
                    Group <span style={{color:'red'}}>*</span>
                  </Label>
                  <Controller
                    id='groupID'
                    control={control}
                    name='groupID'
                    render={({ field }) => (
                      <Select
                        required
                        isClearable
                        options={groupID}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select')}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md='4' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="baseRate">
                    Base Rate
                  </Label>
                  <InputGroup className="input-group-merge">
                    <Controller
                      id="baseRate"
                      name="baseRate"
                      control={control}
                      render={({ field }) => (
                        <Cleave
                          placeholder="Base Rate"
                          {...field}
                          className={classnames("form-control")}
                        />
                      )}
                    />
                  </InputGroup>
                </div>
              </Col>

              <Col md='4' sm='12' className='mb-1'>
      <div className='mb-1'>
        <Label className='form-label' for='taxPercentage'>
        Tax Code <spam style={{color:'red'}}>*</spam>
        </Label>
        <Controller
              id='taxPercentage'
              control={control}
              name='taxPercentage'
              render={({ field }) => (
                <Select
                required
                // isMulti
                  isClearable
                  options={taxPercentage}
                  classNamePrefix='select'
                  theme={selectThemeColors}
                  // className={classnames('react-select', { 'is-invalid': data !== null && data.taxPercentage === null })}
                  // {...field}
                  value={selectedTaxPercentage}
                  onChange={(selectedOptions) => {
                    setSelectedTaxPercentage(selectedOptions);
                    // console.log(selectedOptions)
                    handleChange(selectedOptions);
                  }}
                />
              )}
            />
      </div>
      </Col>

              <Col md='4' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='costCenter'>
                    Cost Center
                  </Label>
                  <InputGroup className="input-group-merge">
                    <Controller
                      defaultValue=''
                      control={control}
                      id='costCenter'
                      name='costCenter'
                      render={({ field }) => (
                        <Input 
                          placeholder="Cost Center" 
                          className={classnames({})} 
                          {...field}
                        />
                      )}
                    />
                  </InputGroup>
                </div>
              </Col>

              <Col md='4' sm='12' className='mb-1'>
                <div className='mb-1'>
                  <Label className='form-label' for='costCenterType'>
                    Cost Center Type
                  </Label>
                  <InputGroup className="input-group-merge">
                    <Controller
                      defaultValue=''
                      control={control}
                      id='costCenterType'
                      name='costCenterType'
                      render={({ field }) => (
                        <Input 
                          placeholder="Cost Center Type" 
                          className={classnames({})} 
                          {...field}
                        />
                      )}
                    />
                  </InputGroup>
                </div>
              </Col>

              <Col md='4' sm='12' className='mb-1'>
                <div className="mb-1">
                  <Label className="form-label" for="hsnSacCode">
                    HSN SAC Code
                  </Label>
                  <InputGroup className="input-group-merge">
                    <Controller
                      defaultValue=''
                      id="hsnSacCode"
                      name="hsnSacCode"
                      control={control}
                      render={({ field }) => (
                        <Cleave
                          placeholder="HSNSAC Code"
                          {...field}
                          className={classnames("form-control")}
                        />
                      )}
                    />
                  </InputGroup>
                </div>
              </Col>

              <div className="d-flex justify-content-end mt-3">
              <Button style = {{marginRight:'10px'}} color="secondary" type="button" onClick={handleReset}>Reset</Button>

                <Button className="me-1" color="primary" type="submit">
                  Add Transaction Code
                </Button>
              </div>
            </Row>
          </Form>
        </Card>
      )}

      {/* Display completed transaction codes */}
      {completedForms.length > 0 && (
        <Card >
          <h5 className="mb-2">Transaction Codes</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Menu Header</th>
                  <th>Transaction Code</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {completedForms.map((form, index) => (
                  <tr key={index}>
                    <td>{form.menuHeader}</td>
                    <td>{form.transactionCode}</td>
                    <td>{form.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Final Submit Button - visible only when all menu headers have been used */}
      {isFormComplete && completedForms.length > 0 && (
        
        <div className="d-flex justify-content-end mt-3">
          <Button style = {{marginRight:'10px'}} color="secondary" type="button" onClick={handleReset}>Reset</Button>

          <Button color="success" onClick={handleFinalSubmit}>
            Submit All Transaction Codes
          </Button>
        </div>
      )}
       
    </div>
  );
};

export default TransactionCode;