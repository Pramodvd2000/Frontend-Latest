// ** React Imports
import { useState } from "react";

// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { selectThemeColors } from "@utils";
import Moment from "moment";

// ** Reactstrap Imports
import {
  Input,
  Form,
  Row,
  Col,
  Label,
  Button,
  InputGroup,
  Modal, ModalHeader, ModalBody,
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

import API_URL from "../../../../config";
import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
localStorage.removeItem("id")

const defaultValues = {
  IDType1: null,
  idNumber1: "",
  issueDate1: "",
  expiryDate1: "",
  issuePlace1: "",
  name1: "",
  idFile1: "",
};

const IDTypes = [
  { value: "adharCard", label: "Adhar Card" },
  { value: "panCard", label: "PanCard" },
  { value: "drivingLicense", label: "DrivingLicense" },
  { value: "passport", label: "Passport" },
];

const type = [
  { value: "Black", label: "Black" },
  { value: "Gold", label: "Gold" },
  { value: "Silver", label: "Silver" },
  { value: "Platinum", label: "Platinum" },
];

const Floor = ({ stepper, type, data1 }) => {
  const [idDetail, setIDDetails] = useState();

  // console.log(localStorage.getItem('id'))

  // const [selectedValue, setSelectedValue] = useState(data1.idDetails.IDType);
    // console.log(data1.id)
  const [reload, setreload] = useState(true);
  const [load, setload] = useState(true);

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption.label);
    // console.log(selectedOption.label);
    // console.log(localStorage.getItem("idDetails.IDType"));
    localStorage.removeItem("idDetails.IDType");
    localStorage.setItem("idDetails.IDType", selectedOption.label);
    localStorage.setItem("idDetails.IDType", selectedOption.value);
// console.log(localStorage.getItem("idDetails.IDType"));
    // console.log(localStorage.getItem("idDetails.IDType"));
    setreload(false);
    setTimeout(() => {
      setreload(true);
    }, 1);
  };

  
  // // console.log(data1)
  // // console.log(data1.idDetails.IDType)

  // Ag Grid
  const [rowData, setRowData] = useState();

  const gridRef = useRef();
  const lookupValue = (mappings, key) => {
    return mappings[key]
  }

  const colourMappings = {
    AdharCard: 'AdharCard',
    PanCard : 'PanCard',
    Passport: 'Passport',
  }
  const extractKeys = (mappings) => {
    return Object.keys(mappings)
  }
  const colourCodes = extractKeys(colourMappings)
  
  const [columnDefs, setColumnDefs] = useState([
    {headerName: "IDType", field: "IDType", suppressSizeToFit: true,maxWidth: 150,cellEditor: 'agSelectCellEditor', cellEditorParams: {values: colourCodes }, valueFormatter: (params) => { return lookupValue(colourMappings, params.value)},filter: 'agSetColumnFilter'},
    { headerName: "idNumber ", field: "idNumber", suppressSizeToFit: true ,maxWidth: 150,},
    { headerName: "Name",field: "nameOnDocument",suppressSizeToFit: true,maxWidth: 150,},    
    { headerName: "ExpiryDate ", field: "expiryDate", suppressSizeToFit: true,maxWidth: 150, },
    { headerName: "IssuePlace ", field: "issuePlace", suppressSizeToFit: true ,maxWidth: 150,},
    { headerName: "Document File ", field: "idFile", suppressSizeToFit: true ,maxWidth: 150,},
     ]);


     let navigate = useNavigate();

  const onCellValueChanged = useCallback(event => {
    // console.log('onCellValueChanged', event)
    // console.log(event.data)
    const updatedItem = JSON.stringify({
      guestID: event.data.guestID,
      IDType: event.data.IDType,
      idNumber:event.data.idNumber,
      issueDate:event.data.issueDate,
      expiryDate:event.data.expiryDate,
      issuePlace:event.data.issuePlace,
      nameOnDocument:event.data.nameOnDocument,
      idFile:event.data.idFile,
    })
    // console.log(updatedItem)
    fetchx(API_URL + `/updateiddetails?guestID=${event.data.guestID}`, {
      method: 'PUT',
      body: updatedItem,
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((post) => {
        // console.log(post)
        navigate('')  
      })
      .catch((err) => {
        // console.log(err.message)
      })
  }, [])



  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));

  const cellClickedListener = useCallback((event) => {
    // console.log("cellClicked", event);
  }, []);

  useEffect(() => {
    fetchx(API_URL + `/getiddetails?guestID=${localStorage.getItem("id")}`)
      .then((result) => result.json())
      .then((rowData) => 
      setRowData(rowData["data"]));
  }, []);

  // ** Hooks
  const {
    setError,
    formState: { errors },
  } = useForm();

  // ** State
  const [data, setData] = useState(null);

  const [selectedValue, setSelectedOption] = useState("");

  const handleDropdownChange = (event) => {
    setSelectedOption(event.value);

    // console.log(event.value); // print the selected value to console
    if (selectedValue == "drivingLicense") {
      // console.log("hi");
    }  
    else {
    }
  };



  // ** Hooks
  const { reset, handleSubmit, control,watch } = useForm({ defaultValues });
  const beginDate = watch('beginDate');
  // console.log(beginDate)
 const today = Moment().format('YYYY-MM-DD');
 const options = {
   minDate: today
 };
 const options1 = {
  maxDate: today
};

  const onSubmit = data => {
    // console.log(localStorage.getItem('guestID'))
if (localStorage.getItem('guestID')!=null) {
   // Submit form data
   // console.log('Submitting form data...', );
   // console.log(data.expiryDate );
   setData(data)
   data['IDType'] = selectedValue
   // console.log(data)
   if (
       data.IDType !== null &&
       data.name !== null
   ) {
       // console.log(data)
       let createmarketGroup = JSON.stringify({
           // "hotelID": data.hotelID,
           // "reservationID":localStorage.getItem('reservationid'),
           "guestID":localStorage.getItem('guestID'),
           "IDType": data.IDType,
           "idNumber": data.idNumber,
           "issueDate": (data.issueDate === undefined ? null : Moment(String(new Date(data.issueDate[0]))).format('YYYY-MM-DD')),
           "expiryDate": (data.expiryDate === undefined ? null : Moment(String(new Date(data.expiryDate[0]))).format('YYYY-MM-DD')),             
           "issuePlace":null,
           "nameOnDocument": data.name,
           "idFile": data.idFile,                
       })
       // console.log(createmarketGroup)
       //   localStorage.removeItem('guestID')
       // console.log("hi")
       let res = fetchx(API_URL + "/addIdDetails", {
           method: "POST",
           headers: { 'Content-Type': 'application/json' },
           body: createmarketGroup
       }).then(data => data.json())
       .then((res) => {
           // console.log(res);
           if (res['statusCode'] == 200) {
               fetchx(API_URL + `/getiddetails?guestID=${localStorage.getItem("guestID")}`)
                   .then(result => result.json())
                   .then(rowData => {
                       setRowData(rowData['data'])
                       // console.log(rowData['data'])
                       // console.log(localStorage.getItem('guestID'))
                       const swalInstance = MySwal.fire({
                        text: 'ID Details Added Successfully!',
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
                setIDDetails(false);
              }
            });
            // alert(res.message)
          }

       });
      //  toast(
      //      <div className='d-flex'>
      //          <div className='me-1'>
      //              <Avatar size='sm' color='success' icon={<Check size={12} />} />
      //          </div>
      //          <div className='d-flex flex-column'>
      //              <h6>Form Submitted!</h6>
      //              <h4>ID Details Added Successfull</h4>
      //          </div>
      //      </div>
      //  )
   }
 } else {
   // console.log(' Please Fill Basic Details ');
   // <alert> Please Fill Basic Details</alert>
   alert("Please Fill Basic Details First")
 }    
}

const navigatepage = () => {
    navigate('');
};

  // window.onload = function() {
  //     localStorage.clear();
  //   };

  const handleReset = () => {
    reset({
      IDType1: null,
      idNumber1: "",
      issueDate1: "",
      expiryDate: "",
      issuePlace1: "",
      name1: "",
      idFile1: "",
    });
  };
  const [modal, setModal] = useState(false);

  const handleModal = () => setModal(!modal);

  return (
    <div>
        <Modal isOpen={idDetail} toggle={() => setIDDetails(!idDetail)} className='modal-lg'>
         <ModalHeader className='modal-lg' toggle={() => setIDDetails(!idDetail)}>
         Add ID Details
         </ModalHeader>
         <ModalBody className='pb-3 px-sm-5 mx-20'>
         <div>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                            <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="IDType">
                                        ID Type <spam style={{color:'red'}}>*</spam>
                                    </Label>
                                    <Controller
                                        id="IDType"
                                        control={control}
                                        name="IDType"
                                        render={({ field }) => (
                                            <Select
                                            required
                                                theme={selectThemeColors}
                                                className='react-select'
                                                classNamePrefix='select'
                                                // defaultValue={colourOptions[1]}
                                                name='IDType'
                                                options={IDTypes}
                                                isClearable
                                                onChange={handleDropdownChange}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                            {selectedValue === 'adharCard' && (
                                <div>
                                   <Row>
                                   <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="idNumber">
                                        Adhar Number <spam style={{color:'red'}}>*</spam>
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='idNumber'
                                        name='idNumber'
                                        render={({ field }) => <Input placeholder='idNumber'
                                            // pattern='[0-9_]{1,15}'
                                            // title="ID Number can contain numbers . It cannnot contain alphabets and special characters." required
                                            invalid={errors.idNumber && true} {...field}
                                            // value={data1.idDetails.idNumber} 
                                            />}
                                    />
                                </div>
                            </Col>                                 
                           </Row>
                          </div>
                            )}
                            {selectedValue === 'panCard' && (
                                <div>
                                   <Row>
                                   <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="idNumber">
                                        Pan Number <spam style={{color:'red'}}>*</spam>
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='idNumber'
                                        name='idNumber'
                                        render={({ field }) => <Input placeholder='Pan Number'
                                            // pattern='[0-9_]{1,15}'
                                            // title="ID Number can contain numbers . It cannnot contain alphabets and special characters." required
                                            invalid={errors.idNumber && true} {...field}
                                            // value={data1.idDetails.idNumber} 
                                            />}
                                    />
                                </div>
                            </Col>                                 
                           </Row>
                          </div>
                            )}
                            {selectedValue === 'drivingLicense' && (
                                <div>
                                   <Row>
                                   <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="idNumber">
                                        DL  Number <spam style={{color:'red'}}>*</spam>
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='idNumber'
                                        name='idNumber'
                                        render={({ field }) => <Input placeholder='DL Number'
                                            // pattern='[0-9_]{1,15}'
                                            // title="ID Number can contain numbers . It cannnot contain alphabets and special characters." required
                                            invalid={errors.idNumber && true} {...field}
                                            />}
                                    />
                                </div>
                            </Col>
                                 
                                    <Col md='4' sm='12'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='expiryDate'>
                                                Expiry Date
                                            </Label>
                                            <Controller
                                                control={control}
                                                id='expiryDate'
                                                name='expiryDate'
                                                render={({ field }) => (
                                                    <Flatpickr
                                                        {...field}
                                                        options={options} placeholder='YYYY-MM-DD '
                                                        className={classnames('form-control', {
                                                            // 'is-invalid': data !== null && data.expiryDate === null
                                                        })}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>

                                   </Row>
                                </div>
                            )}

                              {selectedValue === 'passport' && (
                                <div>
                                    <Row>
                                      <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="idNumber">
                                       Passport Number <spam style={{color:'red'}}>*</spam>
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='idNumber'
                                        name='idNumber'
                                        render={({ field }) => <Input placeholder='idNumber'
                                            // pattern='[0-9_]{1,15}'
                                            // title="ID Number can contain numbers . It cannnot contain alphabets and special characters." required
                                            invalid={errors.idNumber && true} {...field}
                                            // value={data1.idDetails.idNumber} 
                                            />}
                                    />
                                </div>
                            </Col>
                             <Col md='3' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='issueDate'>
                                        Issue Date
                                    </Label>
                                    <Controller
                                        control={control}
                                        id='issueDate'
                                        name='issueDate'
                                        render={({ field }) => (
                                            <Flatpickr
                                                {...field}
                                                // value={data1.idDetails.idNumber} 
                                                options={options1} placeholder='YYYY-MM-DD '
                                                className={classnames('form-control', {
                                                    // 'is-invalid': data !== null && data.issueDate === null
                                                })}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                               <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="issuePlace">
                                        Issue Place
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='issuePlace'
                                        name='issuePlace'
                                        render={({ field }) => <Input placeholder='issuePlace'
                                            // pattern='[0-9_]{1,15}'
                                            // title="Adhar Number can contain numbers . It cannnot contain alphabets and special characters." required
                                            invalid={errors.issuePlace && true} {...field} />}
                                    />
                                </div>
                            </Col>
                                    <Col md='4' sm='12'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='expiryDate'>
                                                Expiry Date
                                            </Label>
                                            <Controller
                                                control={control}
                                                id='expiryDate'
                                                name='expiryDate'
                                                render={({ field }) => (
                                                    <Flatpickr
                                                        {...field}
                                                        options={options} placeholder='YYYY-MM-DD '
                                                        className={classnames('form-control', {
                                                            // 'is-invalid': data !== null && data.expiryDate === null
                                                        })}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                    </Row>
                                </div>
                            )}
                          
                          
                            <Col md='4' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='name'>
                                        Name On Card
                                    </Label>
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='name'
                                        name='name'
                                        render={({ field }) => <Input 
                                        placeholder='Name' invalid={errors.name && true} 
                                        {...field} 
                                        // value={data1.idDetails.name} 
                                        />}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Col md='4' sm='12' className='mb-1'>
                            <div className='mb-1'>
                                <Label className='form-label' for='idFile'>
                                    Upload idFile
                                </Label>
                                <InputGroup className="input-group-merge">
                                    <Controller
                                        defaultValue=''
                                        control={control}
                                        id='idFile'
                                        name='idFile'
                                        placeholder='Add idFile'
                                        render={({ field }) => <Input type='file'  className={classnames({
                                            // "is-invalid": data !== null && (data.idFile === null || !data.idFile.length)
                                        })} {...field} />}
                                    />
                                </InputGroup>
                            </div>
                        </Col>
                        <div className='d-flex'>
                            <Button className='me-1' color='primary'type="submit" >
                                Submit
                            </Button>
                            <Button outline color='secondary' type='reset' onClick={handleReset}>
                                Reset
                            </Button>
                        </div>                       
                    </Form>
        </div>
         </ModalBody>
         </Modal>


      {/* // AG Grid to Display ID Details */}
      <div className="ag-theme-alpine" style={{ height: 260 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData} columnDefs={columnDefs}
                    animateRows={true} 
                    rowSelection='multiple'
                    onCellClicked={cellClickedListener}
                    // paginationAutoPageSize = 'true'
                    onCellValueChanged={onCellValueChanged}
                    // paginationPageSize='10'
                    pagination='true'
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"

                />
            </div>
            <br></br>
            <br></br>


            <div align='end' className='buttons'>
             <Button color='primary' className='me-1' type='submit' onClick={() => {setIDDetails(!idDetail) }}>
             Add ID Details
             </Button>
             <Button color='primary' className='me-1' type='button' onClick={navigatepage}>
            Exit
        </Button>
             </div>
     
    </div>
  );
};

export default Floor;

