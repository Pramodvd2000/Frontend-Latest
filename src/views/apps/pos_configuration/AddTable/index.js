// ** React Imports
import { useState } from "react";
// import axios from "axios";
// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Moment from 'moment';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap'

// ** Custom Components
import Avatar from "@components/avatar";
import API_URL from "../../../../config";
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";

import EditTable from "./editTable";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Custom Components
import Wizard from "@components/wizard";

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
  Modal,
  ModalHeader,
  ModalBody,
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

import { useRef, useEffect, useMemo, useCallback} from 'react';
  // // ** Steps


let menuHeadoptions = [];





let storeOptions =[]
 fetchx(API_URL+'/getStoreList?hotelID=1')
 .then(result => result.json())
 .then(rowData => {
  storeOptions = rowData['data']
     sessionStorage.setItem('storeOptions', JSON.stringify(storeOptions));

//  console.log(storeOptions)
})






const defaultValues = {
  storeID: "",
  groupName: "",
  status: "",
  startTableNo: "",
    endTableNo: "",
};

const statusOptions = [
  { value: 'Enable', label: 'Enable' },
 { value: 'Disable', label: 'Disable' },
]


let id=1;
const AddTable = () => {
  const [rowData, setRowData] = useState();
// ** State
const [open, setOpen] = useState('0')
const [show, actionButton] = useState(false);
const [filldata, setfilldata] = useState({});
const [showEdit, editButton] = useState(false);

const MySwal = withReactContent(Swal)

let navigate = useNavigate();

  // ** State
  const [stepper, setStepper] = useState(null);



 // ** Ref
 const ref = useRef(null);
 const [stepper2, setstepper2] = useState(null);

const toggle = id => {
  open === id ? setOpen() : setOpen(id)
}

  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
    {headerName: 'Store Name',field: 'restaurantName',suppressSizeToFit: true,maxWidth: 150, },
    {headerName: 'tableNo',field: 'tableNo'},
    {headerName: 'tableStatus',field:'tableStatus'},
    {headerName: 'isActive',field: 'isActive'},
    {
      headerName: "Action",field: "numAvlRooms",suppressSizeToFit: true, maxWidth: 120,
      cellRendererFramework: (params) => {
        // Check if tableStatus is 'vacant'
        if (params.data.tableStatus === "vacant") {
          return (
            <Button color="primary" onClick={() => EditData(params.data)}>
              Edit
            </Button>
          );
        }
        // Return null or any placeholder if tableStatus is not 'vacant'
        return null;
      },
    },

  ]);
  const gridApiRef = useRef(null);

  const gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
      flex: 1,
      minWidth: 150,
      filter: true,
      sortable: true,
      floatingFilter: true,
    },
  };
  const defaultColDef = useMemo( ()=> (
    {
      sortable: true, 
      filter: true,
      filterParams :{
      buttons : ['apply','reset']
      }
    }
  ));

  const EditData = (rowData) =>{
    setfilldata(rowData)
    editButton(!showEdit)

  }

  const cellClickedListener = useCallback( event => {
    // console.log('cellClicked', event);
    setfilldata(event["data"]);
  }, []);
  let menuGroupOptions = []
  useEffect(() => {

    fetchx(API_URL+'/getAllTablesPOS?hotelID=1')
    .then(result => result.json())
    .then(rowData => {setRowData(rowData['data'])

  })
  .catch(error => {
    console.error("Error fetching data:", error);
  // });

    })
  },[]);  

  // ** State
  const [data, setData] = useState(null);

  // ** Hooks
  const { reset, handleSubmit, control ,formState: { errors }
} = useForm({ defaultValues });

  const onSubmit = (data) => {
    setData(data);
    console.log(data)

    if(parseInt(data.startTableNo) >parseInt(data.endTableNo)){
       return handleError('Start table number cannot be more than end table number')
    }

      let menugroup = JSON.stringify({
        "hotelID":1,
        "storeID": data.storeID.value,
        "prefix":data.Prefix,
        "StartsWith": data.startTableNo,
        "EndsWith": data.endTableNo,
      
      });
      console.log(menugroup);
      let res = fetchx(API_URL+"/addPOSTables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: menugroup,
      }).then((resp) => {
        console.log('Resp is',resp)
        
    if(resp['status']==200){

      const swalInstance = MySwal.fire({
          text: "POS Tables Added Successfully",
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
              navigate('')
          fetchx(API_URL+'/getAllTablesPOS')
          .then(result => result.json())
          .then(rowData => {setRowData(rowData['data'])
          })
          }
        });
   
      }else{
        
        handleError('Could not add the Tables to the store. Check if table already exists')
    }
      });
     
    }


    // error handling for same guest addition
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
  const handleReset = () => {
    reset({
      storeID: "",
      groupName: "",
      activeItemCount: "",
      menuHead:"",
      status:"",
      startTableNo: "",
    endTableNo: "",

    });
  };


  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);
  return (
    <div>
    <Card>
    <Accordion open={open} toggle={toggle}>
      <AccordionItem>
        <AccordionHeader targetId='1'>Add Table</AccordionHeader>
        <AccordionBody accordionId='1'>

      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
         

          <Col md='4' sm='12'>
          <div className='mb-1'>
            <Label className='form-label' for='storeID'>
            Store Name <spam style={{color:'red'}}>*</spam>
            </Label>
            <Controller
              id="storeID"
              control={control}
              name="storeID"
              render={({ field }) => (
                <Select
                required
                  isClearable
                  options={storeOptions}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  className={classnames("react-select", {
                    "is-invalid": data !== null && data.storeID === null,
                  })}
                  {...field}
                />
              )}
            />
          </div>
          </Col>

          <Col md="4" sm="12" className="mb-1">
  <div className="mb-1">
    <Label className="form-label" for="Prefix">
    Prefix 
    </Label>

    <Controller
      id="Prefix"
      name="Prefix"
      control={control}
      placeholder="Prefix"
      render={({ field }) => (
        <Input
          placeholder="Enter Prefix"
          {...field}
          className={classnames("form-control", {
            "is-invalid": data !== null && data.Prefix === null,
          })}
        />
      )}
    />
  </div>
</Col>

          <Col md="4" sm="12" className="mb-1">
  <div className="mb-1">
    <Label className="form-label" for="startTableNo">
      Start Table No <spam style={{color:'red'}}>*</spam>
    </Label>

    <Controller
      id="startTableNo"
      name="startTableNo"
      control={control}
      placeholder="Start Table No"
      render={({ field }) => (
        <Input
          type="number"
          step="1" // Ensures only whole numbers are allowed
          placeholder="Enter Start Table No"
          required
          {...field}
          className={classnames("form-control", {
            "is-invalid": data !== null && data.startTableNo === null,
          })}
        />
      )}
    />
  </div>
</Col>

<Col md="4" sm="12" className="mb-1">
  <div className="mb-1">
    <Label className="form-label" for="endTableNo">
      End Table No <spam style={{color:'red'}}>*</spam>
    </Label>

    <Controller
      id="endTableNo"
      name="endTableNo"
      control={control}
      placeholder="End Table No"
      render={({ field }) => (
        <Input
          type="number"
          step="1" // Ensures only whole numbers are allowed
          placeholder="Enter End Table No"
          required
          {...field}
          className={classnames("form-control", {
            "is-invalid": data !== null && data.endTableNo === null,
          })}
        />
      )}
    />
  </div>
</Col>

          
          
          

          
          <div className="d-flex">
            <Button className="me-1" color="primary" type="submit" >
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
      </AccordionBody>
      </AccordionItem>
      </Accordion>
    </Card>
    <Card>
        <div className="vertically-centered-modal">
          <Modal
            isOpen={showEdit}
            toggle={() => editButton(!showEdit)}
            // className="modal-lg"
            className="modal-xl"

          >
            <ModalHeader toggle={() => editButton(!showEdit)}>             
              {/* Welcome... */}
            </ModalHeader>
            <ModalBody>
              <Card>
              <EditTable data1={filldata} >
                
              </EditTable>
              </Card>
            </ModalBody>
           
          </Modal>
        </div>
      </Card>
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
    <Card>
    <div className="ag-theme-alpine" style={{ height: 520}}>
        <AgGridReact 
            ref={gridRef}
            rowData={rowData} columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            paginationAutoPageSize = 'true'
            paginationPageSize= '10'
            pagination = 'true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            gridOptions={gridOptions}
            // onGridReady={onGridReady}
            
            />
      </div>
      </Card>
    {/* <App/> */}
    </div>
  );
};

export default AddTable;
