// ** React Imports
import { useState } from "react";
import axios from "axios";
// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
// import App from "./extrasDataTable";
import API_URL2 from '../../../../config2'
// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {
  Input,
  Card,
  Form,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  InputGroup,
  InputGroupText,
  Row,
  Col,
  Modal,ModalHeader,ModalBody
} from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from "react";
import Moment from "moment";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap'
import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import EditTax from "./editTax"
import UploadDocs from "./uploadFile"
import {Edit2,Search,} from "react-feather";
const MySwal = withReactContent(Swal)
const id = "1";

const taxoptions = [
  { value: "beforeDiscount", label: "Before Discount" },
  { value: "afterDiscount", label: "After Discount" },
];

const slaboptions = [
  { value: "flatAmount", label: "Flat Amount" },
  { value: "flatPercentage", label: "Flat Percentage" },
  { value: "Slab", label: "Slab" },
];

const activeoptions = [
  { value: "1", label: "Active" },
  { value: "0", label: "InActive" },
];

const guestStatus = [
  { value: "1", label: "Active" },
  { value: "0", label: "InActive" },
];

const defaultValues = {
  // hotelID: "",
  taxName: "",
  taxCode: "",
  appliesFrom: "",
  exemptAfter: "",
  postingType: null,
  amount: "",
  applyOnPax: "",
  taxPercentage: "",
  noOFSlabs: "",
  fromAmount: "",
  toAmount: "",
  percentage: "",
  // applyTax: "",
  // applyTaxOnRackRate: "",
  note: "",
  isActive: null,
};

const TaxCode = () => {
  const [open, setOpen] = useState('')
  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }
  // AG Grid
  const [rowData, setRowData] = useState();
  const [marketGroup, setMarketGroup] = useState();

  const gridRef = useRef();
  const [popUp, setPopUp] = useState(false);
  const [filldata, setfilldata] = useState(" ");

  const lookupValue = (mappings, key) => {
    return mappings[key]
  }

  const colourMappings = {
    1: 'Active',
    0 : 'Inactive',
  }
  const extractKeys = (mappings) => {
    return Object.keys(mappings)
  }
  const colourCodes = extractKeys(colourMappings)

  const EditData = (rowData)=>{
    console.log(rowData)
    setfilldata(rowData);
    setMarketGroup(!marketGroup)
  }

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "Tax Name", field: "taxName", suppressSizeToFit: true,cellStyle: {'text-align': 'center','background-color': '#F1E39B'}, maxWidth: 160,  },
    { headerName: "Tax Code", field: "taxCode", suppressSizeToFit: true,cellStyle: {'text-align': 'center','background-color': 'pink'}, maxWidth:140 },
    { headerName: "Applies From", field: "appliesFrom", suppressSizeToFit: true, cellStyle: {'text-align': 'center','background-color': '#F1E39B'}, maxWidth:140 },
    // { headerName: "Exempt After",
    //   field: "exemptAfter",
    //   suppressSizeToFit: true,cellStyle: {'text-align': 'center','background-color': 'pink'}, maxWidth:140 },
    { headerName: "Posting Type", field: "postingType",cellStyle: {'text-align': 'center','background-color': 'pink'}, maxWidth:140  },
    // { headerName: "Amount", field: "Amount",cellStyle: {'text-align': 'center','background-color': 'pink'}, maxWidth:140  },
    // { headerName: "Apply On Pax", field: "applyOnPax", suppressSizeToFit: true,cellStyle: {'text-align': 'center','background-color': '#F1E39B'}, maxWidth:140  },
    { headerName: "Tax Percentage", field: "taxPercentage" ,cellStyle: {'text-align': 'center','background-color': '#F1E39B'}, maxWidth:140 },
    { headerName: "No OF Slabs", field: "noOfSlabs" ,cellStyle: {'text-align': 'center','background-color': 'pink'}, maxWidth:140 },
    // { headerName: "Apply Tax", field: "applyTax",cellStyle: {'text-align': 'center','background-color': '#F1E39B'}, maxWidth:140  },
    { headerName: "Apply Tax On RackRate", field: "applyTaxOnRackRate" ,cellStyle: {'text-align': 'center','background-color': '#F1E39B'}, maxWidth:200 },
    // { headerName: "Note", field: "note" ,cellStyle: {'text-align': 'center','background-color': 'pink'}, maxWidth:140 },
    
    {headerName: 'Status', field: 'isActive', cellStyle: { 'text-align': 'center', 'background-color': 'pink' },suppressSizeToFit: true,maxWidth: 150,editable: true,cellEditor: 'agSelectCellEditor', cellEditorParams: {values: colourCodes }, valueFormatter: (params) => { return lookupValue(colourMappings, params.value)},filter: 'agSetColumnFilter'},
    {
      headerName: "Action",
      field: "numAvlRooms",
      suppressSizeToFit: true,
      maxWidth: 120,
      cellRendererFramework: (params) => (
        <h5 >
        <Edit2 style={{ height: "20px" }}  onClick={() =>{EditData(params.data)}} align='end' />                        
      </h5>
      ),
    },
  ]);
  const { reset, handleSubmit, control ,watch} = useForm({ defaultValues });

  const beginDate = watch('beginDate');
  // console.log(beginDate)
 const today = Moment().format('YYYY-MM-DD');
 const options = {
   minDate: today
 };
 const optionsToDate = {
   minDate: (Moment(String(new Date(beginDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
 };
  
  const [newActiveStatus, setNewActiveStatus] = useState(null);
  const [roomClass, setRoomClassID] = useState(null);

  const onCellValueChanged = useCallback(event => {
    // console.log('onCellValueChanged', event)
    // console.log('data after changes is: ', event.data);
  //  console.log(event)
   let isActive=Number(event.data.isActive);
  //  console.log(isActive)
  //  console.log(event.data.isActive)
 
   let OldValue=oldValue  
  //  console.log(oldValue)
  //  console.log(OldValue)
 
     let ID=event.data['id']
     const IDNumber = event.data.id;
     setRoomClassID(IDNumber); 
  //  console.log(ID)
  //  console.log(event.data.id)
   

    let newActive = event.data.isActive;
    // console.log(newActive)
  //  const oldRoomType = event.oldValue.split("(")[0];
  //   setPrice(newRoomType)
  //   setBasePriceID(ID)
   
    
    if (event.data.isActive !== oldValue) {
      const newActiveStatus = event.data.isActive;
      setNewActiveStatus(newActiveStatus); 
                 const oldActiveStatus = oldValue;
    // setFullData(RoomType,oldRoomType,newRoomType,event.data.date)
    setPopUp("Do You  Want to Change Tax Status ?");
    
    } 

  const updatedItem = JSON.stringify({            
     isActive:event.newValue.split("(")[0]
     })
    //  console.log(updatedItem)
     fetchx(API_URL2+ `/updateConfigtaxes?id=${event.data.id}`, {
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
    //  console.log(post)
     })
     .catch((err) => {
    //  console.log(err.message)
     })         
    }, [])

// console.log(newActiveStatus)
// console.log(roomClass)

// const gridApi = useRef();

function Confirm (event){
const updatedItem = JSON.stringify({
isActive:newActiveStatus, 
id:roomClass
})
// console.log(updatedItem)
fetchx(API_URL2+ `/updateConfigtaxes`, {
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
// console.log(post)
if(post.statusCode === 200){
setPopUp(false)
fetchx(API_URL2 + '/getTax?hotelID=' + id)
.then(result => result.json())
.then(rowData =>{
// console.log(rowData['data'])     
}
)
}
})
.catch((err) => {
// console.log(err.message)
})
}


      // Download Excel File
      const onBtnExport = () => {
        const params = {
          fileName: 'Tax.xlsx',
          sheetName: 'Sheet1',
        };
        gridRef.current.api.exportDataAsExcel(params);
       };

const [oldValue, setOldValue] = useState(null);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));

  const cellClickedListener = useCallback(event => {
    // console.log('cellClicked', event.data);
    // console.log('cellClicked', event.data.isActive);
    
    const currentValue = event.data.isActive;
    // console.log(currentValue);
    
    setOldValue(currentValue); // Update the state variable
}, []);
// console.log("oldValue",oldValue)

const [hotelLive, sethotelLive] = useState(null);
  
useEffect(() => {

  fetchx(API_URL2 + "/getBusinessDate", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json())
    .then(postres => {
      console.log(postres["data"][0]["id"])
      sethotelLive(postres['data'][0]["isLive"])
     
    })
    fetchx(API_URL2 + "/getTax?hotelID=" + id)
      .then((result) => result.json())
      .then((rowData) => {
        setRowData(rowData["data"]);
        // console.log(rowData["data"]);
      });
  }, []);

  console.log(rowData)
  const [selectedValue, setSelectedOption] = useState("");

  const handleDropdownChange = (event) => {
    setSelectedOption(event.value);

    // console.log(event.value); // print the selected value to console
    if (selectedValue == "flatAmount") {
      // console.log("hi");
      //         setitemOptions([{ value: "1", label: "Active" }])
    } else if (selectedValue == "flatPercentage") {
      // console.log("hi");
      //         setitemOptions([{ value: "1", label: "Active" }])
    } else if (selectedValue == "Slab") {
      // console.log("hi");
      //         setitemOptions([{ value: "1", label: "Active" }])
    } else {
      //         setitemOptions({ value: "0", label: "InActive" })
    }
  };

  // ** Hooks
  const {
    setError,
    formState: { errors },
  } = useForm();

  // ** State
  const [data, setData] = useState(null);

  // ** Hooks
  let navigate = useNavigate();  

  const onSubmit = (data) => {
    setData(data);
    data["postingType"] = selectedValue;
    // console.log(data);
    if (
      // data.hotelID !== null &&
      data.taxName !== null &&
      data.taxCode !== null 
   
    ) {
      // console.log(data);
      let createExtra = JSON.stringify({
        // "hotelID": data.hotelID,
        taxName: data.taxName,
        taxCode: data.taxCode,
        appliesFrom:(data.appliesFrom === null ? null : Moment(String(new Date(data.appliesFrom[0]))).format("YYYY-MM-DD" )),
        exemptAfter: data.exemptAfter,
        postingType: data.postingType,
        amount: data.amount,
        applyOnPax: 1,
        taxPercentage: data.taxPercentage === '' ? null : data.taxPercentage,
        noOFSlabs: data.noOFSlabs,       
        // applyTax: data.applyTax,
        // applyTaxOnRackRate: data.applyTaxOnRackRate,
        note: data.note,
        isActive: 1,
      });
      // console.log(createExtra);
      let res = fetchx(API_URL2 + "/addTax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: createExtra,
      }).then(data => data.json())
      .then((res) => {
        console.log(res);
        if (res["statuscode"] == 200) {
          fetchx(API_URL2 + "/getTax?hotelID=1")
            .then((result) => result.json())
            .then((rowData) => {
              setRowData(rowData["data"]);
              // console.log(rowData["data"]);
              const swalInstance = MySwal.fire({
                text: 'Tax Added Successfully!',
                icon: 'success',
                buttonsStyling: false,
                confirmButtonText: 'Close',
                allowOutsideClick: false, 
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              });
              swalInstance.then((result) => {
                if (result.isConfirmed) {
                  navigate('');
                }
              });
              // console.log();
              let createtax = JSON.stringify({
                // "hotelID": data.hotelID,
                fromAmount: data.fromAmount,
                toAmount: data.toAmount,
                percentage: data.slabstaxPercentage === '' ? null : data.slabstaxPercentage,
                taxID: rowData["data"][0]["id"],

                // "transactionCodeID": rowData['data'][0]['id'],
              });
              // console.log(createtax);
              let res = fetchx(API_URL2 + "/addTaxGeneration", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: createtax,
              }).then(data => data.json())
              .then((res) => {
                // console.log(res);
                const swalInstance = MySwal.fire({
                  text: 'Tax Added Successfully!',
                  icon: 'success',
                  buttonsStyling: false,
                  confirmButtonText: 'Close',
                  allowOutsideClick: false, 
                  customClass: {
                    confirmButton: 'btn btn-success'
                  }
                });
                swalInstance.then((result) => {
                  if (result.isConfirmed) {
                    navigate('');
                  }
                });
              });
            });
        }
        else{
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
      // toast(
      //   <div className="d-flex">
      //     <div className="me-1">
      //       <Avatar size="sm" color="success" icon={<Check size={12} />} />
      //     </div>
      //     <div className="d-flex flex-column">
      //       <h6>Form Submitted!</h6>
      //       <h4>Tax Added Successfull</h4>
      //     </div>
      //   </div>
      // );
    }
  };

  const handleReset = () => {
    reset({
      // hotelID: "",
      taxName: "",
      taxCode: "",
      appliesFrom: "",
      exemptAfter: "",
      postingType: null,
      amount: "",
      applyOnPax: "",
      taxPercentage: "",
      noOFSlabs: "",
      fromAmount: "",
      toAmount: "",
      percentage: "",
      // applyTax: null,
      // applyTaxOnRackRate: "",
      note: "",
      isActive: null,
    });
  };

  const [message, setValue] = useState("");

  const handleChange = (event) => {
    console.log("Fetching values");
    console.log(event.value);
    console.log(document.getElementById("noOFSlabs").value);
    // handleTextboxClick()
    handleTextboxClick(document.getElementById("noOFSlabs").value);
    setValue(event.target.value);
  };


  const Textbox = () => {
    return (
      <div>



        <Col md="2" sm="5" className="mb-1">
          <div className="mb-1">
            {/* <Label className='form-label' for='taxName'>
 Tax Name
 </Label> */}
            <Controller
              defaultValue=""
              control={control}
              id="taxName"
              name="taxName"
              render={({ field }) => (
                <Input
                  placeholder="slab"
                  // pattern="[A-Za-z_]{1,15}"
                  // title="Tax Name can contain alphabets . It cannnot contain numbers and special characters."
                  required
                  invalid={errors.taxName && true}
                  {...field}
                />
              )}
            />
          </div>
        </Col>
      </div>
    );
  };
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
  setPopUp(false) , navigate('');  
}}
 >
 Cancel
 </Button>
 </div>
 </div>
 </ModalBody>
 </Modal>
 </div>  

 <div>
        <Modal  isOpen={marketGroup} toggle={() => setMarketGroup(!marketGroup)}className="modal-lg"  >
          <ModalHeader className="modal-lg"toggle={() => setMarketGroup(!marketGroup)} >
           Edit Tax Details
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">            
            <EditTax data1={filldata} />
          </ModalBody>
        </Modal>
      </div>
  
 {hotelLive === 0 && (<Card>
      <CardHeader><h4><b> Add Tax</b></h4></CardHeader>
     </Card>)}
      {hotelLive === 0 && ( <p style={{color: "grey"}}> 
      <b><h4> Instructions:  </h4> </b>
      1.Please refer to the sample file before uploading the data. You can access the sample file by clicking the  <b>"Tax File" </b> button. Please ensure that data insertion follows the established pattern.<br/> Kindly refrain from altering the file structure.<br/>
      2.Before adding new data, please ensure to delete all existing data in the CSV file except for the header row.<br/>
      3.If a duplicate entry is found, please remove the existing data and insert the .csv file without any duplicates.<br/>
      4.Please click the "Edit" <Edit2 style={{ height: "10px" }} />button to modify the data. Once data is inserted, it cannot be edited through the CSV file.<br/>
      5.Finally, remember to save the file in .csv format for proper upload.<br/>
    </p>)}
    <br/>
    {/* Upload Document */}
           
    {hotelLive === 0 && (
        <div> 
          <br/>
          <UploadDocs/>
      </div>)}


      
   {hotelLive === 1 &&( <Accordion open={open} toggle={toggle}>
      <AccordionItem>
        <AccordionHeader targetId='1'><h4><b>Add Tax Code </b> </h4></AccordionHeader>
        <AccordionBody accordionId='1'>
        <Card>
        <CardHeader>
          <CardTitle tag="h4">Tax Code</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
            
              <Col md="3"sm="12" className="mb-1">
                <div className="mb-1">
                  <Label className="form-label" for="taxName">
                    Tax Name <spam style={{color:'red'}}>*</spam>
                  </Label>
                  <Controller
                    defaultValue=""
                    control={control}
                    id="taxName"
                    name="taxName"
                    render={({ field }) => (
                      <Input
                        placeholder="Tax Name"                       
                        required
                        invalid={errors.taxName && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3"sm="12" className="mb-1">
                <div className="mb-1">
                  <Label className="form-label" for="taxCode">
                    Tax Code <spam style={{color:'red'}}>*</spam>
                  </Label>
                  <Controller
                    defaultValue=""
                    control={control}
                    id="taxCode"
                    name="taxCode"
                    render={({ field }) => (
                      <Input
                        placeholder="Tax Code"
                        // pattern="[0-9_]{1,15}"
                        // title="Tax Code can contain numbers . It cannnot contain alphabets and special characters."
                        required
                        invalid={errors.taxCode && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3"sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="appliesFrom">
                    Applies From <spam style={{color:'red'}}>*</spam>
                  </Label>
                  <Controller
                    control={control}
                    id="appliesFrom"
                    name="appliesFrom"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        options={options}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                          "is-invalid":
                            data !== null && data.appliesFrom === null,
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3"sm="12" className="mb-1">
                <div className="mb-1">
                  <Label className="form-label" for="exemptAfter">
                    Exempt After <spam style={{color:'red'}}>*</spam>
                  </Label>
                  <Controller
                    defaultValue=""
                    control={control}
                    id="exemptAfter"
                    name="exemptAfter"
                    render={({ field }) => (
                      <Input
                        placeholder="Exempt After"
                        // pattern="[0-9_]{1,15}"
                        // title="Exempt After can contain numbers . It cannnot contain alphabets and special characters."
                        required
                        invalid={errors.exemptAfter && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3"sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="postingType">
                    Posting Type <spam style={{color:'red'}}>*</spam>
                  </Label>
                  <Controller
                    id="postingType"
                    control={control}
                    name="postingType"
                    render={({ field }) => (
                      <Select
                        theme={selectThemeColors}
                        className="react-select"
                        classNamePrefix="select"
                        // defaultValue={colourOptions[1]}
                        name="postingType"
                        options={slaboptions}
                        isClearable
                        onChange={handleDropdownChange}
                      />
                    )}
                  />
                </div>
              </Col>

              {selectedValue === "flatAmount" && (
                <Col md="3"sm="12" className="mb-1">
                  <div className="mb-1">
                    <Label className="form-label" for="amount">
                      Amount <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue=""
                      control={control}
                      id="amount"
                      name="amount"
                      render={({ field }) => (
                        <Input
                          placeholder="Amount"
                          // pattern="[0-9_]{1,15}"
                          // title="Amount can contain numbers . It cannnot contain alphabets and special characters."
                          required
                          invalid={errors.amount && true}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </Col>
              )}

              {selectedValue === "flatPercentage" && (
                <Col md="3"sm="12" className="mb-1">
                  <div className="mb-1">
                    <Label className="form-label" for="taxPercentage">
                      taxPercentage <spam style={{color:'red'}}>*</spam>
                    </Label>
                    <Controller
                      defaultValue=""
                      control={control}
                      id="taxPercentage"
                      name="taxPercentage"
                      render={({ field }) => (
                        <Input
                          placeholder="taxPercentage"
                          // pattern="[0-9]*"
                          // title="Type Only Numbers"
                          required
                          invalid={errors.taxPercentage && true}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </Col>
              )}

              {selectedValue === "Slab" && (
                <div>
                  <Col md="3"sm="12" className="mb-1">
                    <div className="mb-1">
                      <Label className="form-label" for="noOFSlabs">
                        No OF Slabs <spam style={{color:'red'}}>*</spam>
                      </Label>
                      <Controller
                        defaultValue=""
                        control={control}
                        id="noOFSlabs"
                        name="noOFSlabs"
                        render={({ field }) => (
                          <Input
                            placeholder="noOFSlabs"
                            // pattern="[0-9_]{1,15}"
                            // title="No OF Slabs can contain numbers . It cannnot contain alphabets and special characters."
                            required
                            id="noOFSlabs"
                            invalid={errors.noOFSlabs && true}
                            {...field}
                            onChange={handleChange}
                            value={2}
                          />
                        )}
                      />
                    </div>
                  </Col>
                  <Row>
                    <Row>
                      <Col md="2" sm="12" className="mb-1">
                        <div className="mb-1">
                          <Label className="form-label" for="fromAmount">
                            From <spam style={{color:'red'}}>*</spam>
                          </Label>
                          <Controller
                            defaultValue=""
                            control={control}
                            id="fromAmount"
                            name="fromAmount"
                            render={({ field }) => (
                              <Input
                                placeholder="From Amount"
                                // pattern="[0-9]*" title="Type Only Numbers"
                                invalid={errors.fromAmount && true}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col md="2" sm="12" className="mb-1">
                        <div className="mb-1">
                          <Label className="form-label" for="toAmount">
                            To <spam style={{color:'red'}}>*</spam>
                          </Label>
                          <Controller
                            defaultValue=""
                            control={control}
                            id="toAmount"
                            name="toAmount"
                            render={({ field }) => (
                              <Input
                                placeholder="To Amount"
                                // pattern="[0-9]*" title="Type Only Numbers"
                                invalid={errors.toAmount && true}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col>
                      {/* <Col md="2" sm="12" className="mb-1">
                        <div className="mb-1">
                          <Label
                            className="form-label"
                            for="slabstaxPercentage"
                          >
                            Tax Percentage <spam style={{color:'red'}}>*</spam>
                          </Label>
                          <Controller
                            defaultValue=""
                            control={control}
                            id="slabstaxPercentage"
                            name="slabstaxPercentage"
                            render={({ field }) => (
                              <Input
                                placeholder="Tax Percentage"
                                pattern="[0-9]*"
                                title="Type Only Numbers"
                                invalid={errors.slabstaxPercentage && true}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col> */}
                    </Row>

                  </Row>
                </div>
              )}
{/* 
              <Col md="3"sm="12" className="mb-1">
                <div className="mb-1">
                  <Label className="form-label" for="applyOnPax">
                    Apply On Pax <spam style={{color:'red'}}>*</spam>
                  </Label>
                  <Controller
                    defaultValue="1"
                    control={control}
                    id="applyOnPax"
                    name="applyOnPax"
                    render={({ field }) => (
                      <Input
                        placeholder=" Apply On Pax"
                        pattern="[0-9]*" title="Type Only Numbers" required 
                        invalid={errors.applyOnPax && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col> */}

              {/* <Col md="3"sm="12" className="mb-1">
                <div className="mb-1">
                  <Label className="form-label" for="applyTax">
                    Apply Tax <spam style={{color:'red'}}>*</spam>
                  </Label>
                  <Controller
                    defaultValue=""
                    control={control}
                    id="applyTax"
                    name="applyTax"
                    render={({ field }) => (
                      <Input
                        placeholder=" Apply On Tax"
                        pattern="[0-9]*" title="Type Only Numbers" required 
                        invalid={errors.applyTax && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col> */}
              {/* <Col md="3"sm="12" className="mb-1">
                <div className="mb-1">
                  <Label className="form-label" for="applyTaxOnRackRate">
                    Apply Tax On Rack Rate <spam style={{color:'red'}}>*</spam>
                  </Label>
                  <Controller
                    defaultValue=""
                    control={control}
                    id="applyTaxOnRackRate"
                    name="applyTaxOnRackRate"
                    render={({ field }) => (
                      <Input
                        placeholder=" Apply Tax On Rack Rate"
                        pattern="[0-9]*" title="Type Only Numbers" required 
                        invalid={errors.applyTaxOnRackRate && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col> */}

              <Col md="3"sm="12" className="mb-1">
                <div className="mb-1">
                  <Label className="form-label" for="note">
                    Note <spam style={{color:'red'}}>*</spam>
                  </Label>
                  <Controller
                    defaultValue=""
                    control={control}
                    id="note"
                    name="note"
                    render={({ field }) => (
                      <Input
                        placeholder=" Note"
                        // pattern="[A-Za-z_]{1,15}"
                        // title=" Note can contain alphabets . It cannnot contain numbers and special characters."
                        required
                        invalid={errors.note && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

              {/* <Col md="3"sm="12" className="mb-1">
                <div className="mb-1">
                  <Label className="form-label" for="isActive">
                    Is Active <spam style={{color:'red'}}>*</spam>
                  </Label>
                  <Controller
                    id="isActive"
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <Select
                        required
                        isClearable
                        options={activeoptions}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select", {
                          "is-invalid": data !== null && data.isActive === null,
                        })}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col> */}

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
        </CardBody>
      </Card>
        </AccordionBody>
      </AccordionItem>
      </Accordion>)}


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

        {/*  <Download Sample File/> */}
      <div align="end" className="buttons">
        
       {hotelLive === 1 &&( <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button>)}
      </div>  
    <div>
    <Card>
    <div className="ag-theme-alpine" style={{ height: 540}}>
        <AgGridReact 
            ref={gridRef}
            rowData={rowData} columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            onCellValueChanged={onCellValueChanged}
            // paginationAutoPageSize = 'true'
            paginationPageSize= '10'
            pagination = 'true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            
            />
      </div>
    </Card>
    </div>  
    </div>
  );
};

export default TaxCode;
