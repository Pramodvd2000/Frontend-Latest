import { useState,useEffect } from "react";
import Select from "react-select";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { selectThemeColors } from "@utils";
import {Input,Card,Form,Label,Button,InputGroup,Row,Col,} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import API_URL from "../../../../config";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const discountAllowedOptions = [
  { value: 0, label: "No" },
  { value: 1, label: "Yes" },
];

const defaultValues = {
  transactionCode: "",
  description: "",
  groupID: null,
  subGroupID: null,
  baseRate: "",
  discountAllowed: null,
  hsn_sacCode: "",
};

let groupID = [
  fetchx(API_URL + "/getforeignkeygroupid?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      // console.log(resp['data'])
      groupID = resp["data"];
      // console.log(groupID);
    }),
];

let subGroupID = [
  fetchx(API_URL + "/getforeignkeysubgroup?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      // console.log(resp['data'])
      subGroupID = resp["data"];
      // console.log(subGroupID);
    }),
];



const TransactionCode = (data1) => {
  console.log(data1.data1);
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(null);
  const [taxPercentage, setTaxPercentageOptions] = useState([]);
  const [selectedtaxPerc,setselectedtaxPerc] = useState('');
 const [companyData, setCompanyData] = useState(null);
 const [selectedTaxPercentage, setSelectedTaxPercentage] = useState([]);
  // ** Hooks
  const { reset, handleSubmit, control, formState: { errors },} = useForm({ defaultValues });
  let navigate = useNavigate();
  const [selectedValue,  setSelectedValue] =  useState(data1.data1.groupID);

  //Country And Nationality
    const defaultReason = {
    value: data1.data1.groupID,
    label: data1.data1.groupCode,    
  };
  //Salutation
  const defaultReason1 = {
    value: data1.data1.subGroupID,
    label: data1.data1.subGroup,    
  };

  let defaultReason2;
  

  if(data1.data1.discountAllowed == 1){
    defaultReason2 = {
      value: data1.data1.discountAllowed,
      label: "Yes",    
    };
  }
  else{
    defaultReason2 = {
      value: data1.data1.discountAllowed,
      label: "No",    
    };
  }
 
  useEffect(() => {
    fetchx(API_URL + '/gettransactioncodetaxpercentage?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        setTaxPercentageOptions(resp['data']);
        setselectedtaxPerc(data1.data1.taxPercentage)

// Find the default option based on the matching taxPercentage
const defaultOption = resp['data'].find(option => option.taxPercentage === data1.data1.taxPercentage);
console.log(defaultOption)
setCompanyData(defaultOption.value)
// Set the default selected value
setSelectedTaxPercentage(defaultOption || null);
      })
  }, []);


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
    navigate('');
}

  
  const onSubmit = (data) => {
    // console.log(data.grpName)
    // console.log(data.subGrpname)

    console.log(data)

    setData(data);
    data["accountType"] = selectedValue;
    if (data.accountType !== null && data.accountName !== null) {
      // console.log(data);
      let createmarketGroup = JSON.stringify({
        id: data1.data1.id,
        transactionCode: data.transactionCode1,
        description: data.description1,
        groupID: data.grpName.value === undefined ? data1.data1.groupID : data.grpName.value,
        subGroupID: data.subGrpname === undefined ? data1.data1.subGroupID : data.subGrpname.value,
        baseRate: data.baseRate1,
        discountAllowed: data.discAllowed === undefined ? data1.data1.discountAllowed : data.discAllowed.value,
        hsn_sacCode: data.hsnSacCode1,
        costCenter:data.costCenter,
        costCenterType:data.costCenterType,
        taxID: companyData,
        taxPercentage:selectedtaxPerc,    
        });
      // console.log(createmarketGroup);
      // console.log("hi");
      let res = fetchx(API_URL + `/updateTransactionCode`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: createmarketGroup,
      })
        .then((result) => result.json())
        .then((resp) => {  
          if(resp['statusCode']==200){

             
       
            const swalInstance = MySwal.fire({
       text: 'Transaction Code  Details Updated Successfully!',
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
    }   else{
      handleError('Could not update transaction code')
    }
        })
        .catch((error) => {
          console.log(error);
        });     
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
  const handleReset = () => {
    reset({
      transactionCode: "",
      description: "",
      groupID: null,
      subGroupID: null,
      baseRate: "",
      discountAllowed: null,
      hsn_sacCode: "",
    });
  };

  function InputForm() {
    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="transactionCode1">
                Transaction Code <spam style={{ color: "red" }}>*</spam>
              </Label>
              <Controller
                defaultValue={data1.data1.transactionCode}
                control={control}
                id="transactionCode1"
                name="transactionCode1"
                render={({ field }) => (
                  <Input
                    required
                    placeholder="Name"
                    invalid={errors.transactionCode1 && true}
                    {...field}
                  />
                )}
              />
            </div>
          </Col>
          <Col md="3" sm="12" className="mb-1">
            <div className="mb-1">
              <Label className="form-label" for="description1">
                Description <spam style={{ color: "red" }}>*</spam>
              </Label>
              <InputGroup className="input-group-merge">
                <Controller
                  defaultValue={data1.data1.description}
                  control={control}
                  id="description1"
                  name="description1"
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
          </Col>
         
          <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="grpName">
                  Group <spam style={{ color: "red" }}>*</spam>
                  </Label>
                  <Controller
                    // defaultValue={defaultReason}
                    id="grpName"
                    control={control}
                    name="grpName"
                    defaultValue={defaultReason}
                    render={({ field }) => (
                      <Select
                      required
                        isClearable
                        options={groupID}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select")}
                        {...field}
                        // onChange={handleChange} 

                      />
                    )}
                  />
                </div>
              </Col> 
              
          <Col md="3" sm="12" className="mb-1">
            <div className="mb-1">
              <Label className="form-label" for="subGrpname">
                Sub Group <spam style={{ color: "red" }}>*</spam>
              </Label>
              <Controller
                id="subGrpname"
                control={control}
                name="subGrpname"
                render={({ field }) => (
                  <Select
                  required
                  isClearable
                  defaultValue={defaultReason1}
                  options={subGroupID}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  className={classnames("react-select", )}
                  {...field}
                  // onChange={handleChange1} 
                />
              )}
            />
          </div>
        </Col>

          <Col md="3" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="baseRate1">
                Base Rate 
              </Label>
              <Controller
                defaultValue={data1.data1.baseRate}
                control={control}
                id="baseRate1"
                name="baseRate1"
                render={({ field }) => (
                  <Input
                    
                    placeholder="Base Rate"
                    invalid={errors.baseRate1 && true}
                    {...field}
                  />
                )}
              />
            </div>
          </Col>



         
          <Col md='3' sm='12' className='mb-1'>
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
          <Col md="3" sm="12" className="mb-1">
            <div className="mb-1">
              <Label className="form-label" for="costCenter">
                Cost Center 
              </Label>
              <InputGroup className="input-group-merge">
                <Controller
                  id="costCenter"
                  name="costCenter"
                  control={control}
                  defaultValue={data1.data1.costCenter}
                  render={({ field }) => (
                    <Cleave
                      
                      placeholder="Cost Center"
                      {...field}
                      className={classnames("form-control", {})}
                    />
                  )}
                />
              </InputGroup>
            </div>
          </Col>
          <Col md="3" sm="12" className="mb-1">
            <div className="mb-1">
              <Label className="form-label" for="costCenterType">
                Cost Center Type 
              </Label>
              <InputGroup className="input-group-merge">
                <Controller
                  id="costCenterType"
                  name="costCenterType"
                  control={control}
                  defaultValue={data1.data1.costCenterType}
                  render={({ field }) => (
                    <Cleave
                      
                      placeholder="Cost Center Type"
                      {...field}
                      className={classnames("form-control", {})}
                    />
                  )}
                />
              </InputGroup>
            </div>
          </Col>
          <Col md="3" sm="12" className="mb-1">
            <div className="mb-1">
              <Label className="form-label" for="hsnSacCode1">
                HSN SAC Code 
              </Label>
              <InputGroup className="input-group-merge">
                <Controller
                  id="hsnSacCode1"
                  name="hsnSacCode1"
                  control={control}
                  defaultValue={data1.data1.hsn_sacCode}
                  render={({ field }) => (
                    <Cleave
                      
                      placeholder="HSN SAC Code"
                      {...field}
                      className={classnames("form-control", {})}
                    />
                  )}
                />
              </InputGroup>
            </div>
          </Col>
          <div className="d-flex">
            <Button className="me-1" color="primary" type="submit">
              Submit
            </Button>
            <Button
              outline
              color="secondary"
              type="reset"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </Row>
      </Form>
    );
  }
  return (
    <div>
      <div>
        <h4>
          <b> Transaction Code </b>
        </h4>
        {/* <Button.Ripple color='warning' disabled = {enableEditBtn} size='sm' onClick={EnableEdit}>Edit</Button.Ripple> */}
        {showForm && <InputForm />}
      </div>
    </div>
  );
};
export default TransactionCode;