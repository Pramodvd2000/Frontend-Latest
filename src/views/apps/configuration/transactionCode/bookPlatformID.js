import React, { useState, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Check } from "react-feather";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Avatar from "@components/avatar";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Form,
  Label,
  Button,
  Row,
  Col,
} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import API_URL from "../../../../config";
import { useNavigate } from "react-router-dom";
// ** Third Party Components
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const defaultValues = {
  transactionCode: "",
  description: "",
  groupID: null,
  subGroupID: null,
  baseRate: "",
  discountAllowed: null,
  hsn_sacCode: "",
};

const TransactionCode = () => {
    const [TransactionCode, setTransactionCode] = useState('')
    const [TrxnCodeIDSelected,setTrxnCodeIDSelected] = useState('')
    const [Description,setDescription] = useState('')
    const [filterText, setFilterText] = useState('');

  const [groupID, setGroupID] = useState([]);
  const [subGroupID, setSubGroupID] = useState([]);
  const [TransactionCodeSelect, setTransactionCodeSelect] = useState(false);
  const [editable, setEditable] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(null);
  const [TrxnRowData, setTrxnRowData] = useState([]);
  const gridRef1 = useRef();

  const navigate = useNavigate();


      const TrxnClickedListener = useCallback(event => {
        // console.log(event['data'])
        // setdefaultPrice('')
        // console.log('Price null')
        // handleReset()
        setTransactionCode(event['data']['transactionCode'])
        // setTrxnCodeIDSelected(event['data'['id']])
        sessionStorage.setItem('TransactionCodeID',event['data']['id'])
        setDescription(event['data']['description'])
        sessionStorage.setItem('TransactionCodeID',event['data']['id'])
        // setAmount('')
        // setTransactionCodeSelect(false)
  
    
      })
  // Fetch groupID and subGroupID
  useEffect(() => {
    fetch(`${API_URL}/getforeignkeygroupid?hotelID=1`)
      .then((res) => res.json())
      .then((resp) => setGroupID(resp.data))
      .catch((err) => console.error(err));

    fetch(`${API_URL}/getforeignkeysubgroup?hotelID=1`)
      .then((res) => res.json())
      .then((resp) => setSubGroupID(resp.data))
      .catch((err) => console.error(err));

      fetchx(API_URL + `/getTransactionCodeForBooksPlatformID?hotelID=1`)
      .then(result => result.json())
      .then(rowData => {
        setTrxnRowData(rowData['data'])
        // // console.log(rowData['data'])
        // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
      })
  }, []);

  const onFilterTextBoxChanged = useCallback((filter) => {
    const gridApi = gridRef1.current?.api;
    if (gridApi) {
      gridApi.setQuickFilter(filter);
    }
  }, []);

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = (formData) => {
    console.log(formData);
    console.log(TrxnCodeIDSelected)
    const payload = {
      
      transactionCodeID: TrxnCodeIDSelected.id,
      AccountsDescription: formData.Accountsdescription,
      account_platform_id: formData.accPlatformID,
      PaymentAccDesc:formData.PaymentAccDesc,
      PaymentAccID:formData.PaymentAccID,
      customer_platform_id: formData.customerPlatformID,
      customerName:formData.customerName

    };
    console.log(payload)

    fetch(`${API_URL}/addbooksPlatformID`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.statuscode === 200) {
          MySwal.fire({
            text: "Books Platform Added Successfully!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Close",
            allowOutsideClick: false,
            customClass: {
              confirmButton: "btn btn-danger",
            },
          }).then(() => navigate(""));
        } else {
          MySwal.fire({
            text: res.message,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Close",
            allowOutsideClick: false,
            customClass: {
              confirmButton: "btn btn-danger",
            },
          });
        }
      });
  };

  const handleReset = () => {
    reset(defaultValues);
  };
  const [TrxncolumnDefs] = useState([
    { headerName: 'transactionCode', field: 'transactionCode'},

    { headerName: 'description', field: 'description'},
    {
      headerName: "Action",
      
      cellRenderer: (params) => {
        return (<Button color='primary' onClick={()=>{setTrxnCodeIDSelected(params.data)
          setTransactionCodeSelect(false)}}>Select</Button>)
      }
    },
  ])

  const gridOptions = {
    defaultColDef: {
      flex: 1,
      // minWidth: 150,
      filter: true,
      sortable: true,
      // floatingFilter: true,
           

    },
  };
  return (
    <div>
      {showForm && (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>

            <Col md='4' sm='12'>
            <div className='mb-1'>
       
                <Label className="form-label">
                Code <spam style={{color:'red'}}>*</spam> </Label>
                <Input type="text" name='TransactionCode' value={TransactionCode} onClick={() => setTransactionCodeSelect(true)}/>
                
                </div>
                </Col>
                <Col md='4' sm='12' className='mb-1'>
                <Label className="form-label">
                Description <spam style={{color:'red'}}>*</spam> </Label>
                <Input type="text" name='Description' value={Description}/>
                
                
                </Col>
 <Col md="4" sm="12">
           <div className="mb-1">
             <Label className="form-label" for="Accountsdescription">
             Accounts Description <spam style={{color:'red'}}>*</spam>
             </Label>
             <Controller
               defaultValue=""
               control={control}
               id="Accountsdescription"
               name="Accountsdescription"
               render={({ field }) => (
                 <Input
                   placeholder="Accounts Description"
                   required
                   invalid={errors.Accountsdescription && true}
                   {...field}
                 />
               )}
             />
           </div>
         </Col>
         <Col md='4' sm='12'>
   <div className='mb-1'>
     <Label className='form-label' for='accPlatformID'>
     Accounts Platform ID <spam style={{color:'red'}}>*</spam>
     </Label>
     <Controller
       defaultValue=''
       control={control}
       id='accPlatformID'
       name='accPlatformID'
       render={({ field }) => <Input placeholder='Accounts Platform ID'
         // pattern='[0-9]{1,15}'
         // title="Books ID can contain numbers . It cannnot contain alphabets and special characters." 
         required
         invalid={errors.accPlatformID && true} {...field} />}
     />
   </div>
 </Col>
 <Col md='4' sm='12'>
   <div className='mb-1'>
     <Label className='form-label' for='PaymentAccID'>
     Payment Account ID 
     </Label>
     <Controller
       defaultValue=''
       control={control}
       id='PaymentAccID'
       name='PaymentAccID'
       render={({ field }) => <Input placeholder='Payment Account ID'
         // pattern='[0-9]{1,15}'
         // title="Books ID can contain numbers . It cannnot contain alphabets and special characters."
          
         invalid={errors.PaymentAccID && true} {...field} />}
     />
   </div>
 </Col>
 <Col md='4' sm='12'>
   <div className='mb-1'>
     <Label className='form-label' for='PaymentAccDesc'>
     Payment Account Description 
     </Label>
     <Controller
       defaultValue=''
       control={control}
       id='PaymentAccDesc'
       name='PaymentAccDesc'
       render={({ field }) => <Input placeholder='Payment Account Description'
         
         invalid={errors.PaymentAccDesc && true} {...field} />}
     />
   </div>
 </Col>
 <Col md='4' sm='12'>
   <div className='mb-1'>
     <Label className='form-label' for='customerPlatformID'>
     Customer Platform ID 
     </Label>
     <Controller
       defaultValue=''
       control={control}
       id='customerPlatformID'
       name='customerPlatformID'
       render={({ field }) => <Input placeholder='Customer Platform ID'
         // pattern='[0-9]{1,15}'
         // title="Books ID can contain numbers . It cannnot contain alphabets and special characters."
          
         invalid={errors.customerPlatformID && true} {...field} />}
     />
   </div>
 </Col>

 <Col md='4' sm='12'>
   <div className='mb-1'>
     <Label className='form-label' for='customerName'>
     customer Name 
     </Label>
     <Controller
       defaultValue=''
       control={control}
       id='customerName'
       name='customerName'
       render={({ field }) => <Input placeholder='customer Name'
         // pattern='[0-9]{1,15}'
         // title="Books ID can contain numbers . It cannnot contain alphabets and special characters."
          
         invalid={errors.customerName && true} {...field} />}
     />
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
      )}

       <div>
                        <Modal isOpen={TransactionCodeSelect} toggle={() => setTransactionCodeSelect(false)} className='modal-dialog-centered modal-lg' onClosed={()=>{ setTransactionCodeSelect(false)}}>
                            <ModalHeader toggle={() => setTransactionCodeSelect(false)}>Search and Select Code</ModalHeader>
                                <ModalBody>
                                    <div>
                                        <Row className='mb-1'>
                                            <Col md='6' sm='12' className='me-1'>
                                              <Label className='form-label' for='filter-text-box'>
                                                Search
                                              </Label>
                                              <Input
  type="text"
  id="filter-text-box"
  placeholder="Filter..."
  value={filterText}
  onChange={(e) => {
    setFilterText(e.target.value); // Update state
    onFilterTextBoxChanged(e.target.value); // Trigger filter
  }}
/>
                                            </Col>
                                            
                                        </Row>
                                    </div>
                                    <div className="ag-theme-alpine" style={{ height: 520 }}>
                                        <AgGridReact
                                          overlayNoRowsTemplate={'No record found'}
                                          ref={gridRef1}
                                          rowData={TrxnRowData}
                                          columnDefs={TrxncolumnDefs}
                                          animateRows={true}
                                          onCellClicked={TrxnClickedListener}
                                          paginationPageSize='10'
                                          pagination='true'
                                          // defaultColDef={defaultColDef}
                                          headerColor="ddw-primary"
                                          gridOptions={gridOptions}
                                        />
                                    </div>
                                </ModalBody>
                        </Modal>
                    </div>
    </div>
  );
};

export default TransactionCode;
