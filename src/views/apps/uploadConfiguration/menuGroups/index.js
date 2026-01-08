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
// import App from "./waitListDataTable";
import Moment from 'moment';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap'

// ** Custom Components
import Avatar from "@components/avatar";
import API_URL2 from "../../../../config2";
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import {Edit2,Search,} from "react-feather";


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
  import Editmenugroup from "./editmenugroup";
import UploadMenugroupCSV from "./uploadFile"

let menuHeadoptions = [];

fetchx(API_URL2+'/getMenuHeaderDetails?hotelID=1')

  .then(result => result.json())
  .then(resp => {
    const responseData = resp['data'];
    if (Array.isArray(responseData)) {
      menuHeadoptions = responseData.map(item => ({
        value: item.category,
        label: item.category,
      }));
    }
    sessionStorage.setItem('menuHeadoptions', JSON.stringify(menuHeadoptions));
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });

let storeOptions =[]
 fetchx(API_URL2+'/getStoreList?hotelID=1')
 .then(result => result.json())
 .then(rowData => {
  storeOptions = rowData['data']
     sessionStorage.setItem('storeOptions', JSON.stringify(storeOptions));

})

const defaultValues = {
  storeID: "",
  groupName: "",
  status: "",
};

const statusOptions = [
  { value: 'Enable', label: 'Enable' },
 { value: 'Disable', label: 'Disable' },
]


let id=1;
const ValidationThirdPartyComponents = () => {
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
  const lookupValue = (mappings, key) => {
    return mappings[key]
  }
  const colourMappings = {
    1: 'Enable',
    0 : 'Disable',
  }
  const extractKeys = (mappings) => {
    return Object.keys(mappings)
  }
  const colourCodes = extractKeys(colourMappings)


 // ** Ref
 const ref = useRef(null);
 const [stepper2, setstepper2] = useState(null);

const toggle = id => {
  open === id ? setOpen() : setOpen(id)
}

  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
    {headerName: 'ID',field: 'id',suppressSizeToFit: true,maxWidth: 100,   cellStyle: { 'text-align': 'center', 'background-color': '#F1E39B' } },
    {headerName: 'Store ID',field: 'storeID',suppressSizeToFit: true,maxWidth: 100,  cellStyle: { 'text-align': 'center', 'background-color': 'pink' }, },
    {headerName: 'Store Name',field: 'restaurantName',suppressSizeToFit: true,maxWidth: 150,   cellStyle: { 'text-align': 'center', 'background-color': '#F1E39B' },},
    {headerName: 'Group name',field: 'groupName',   cellStyle: { 'text-align': 'center', 'background-color': 'pink' },},
    {headerName: 'Active item count',field:'activeItemCount',   cellStyle: { 'text-align': 'center', 'background-color': '#F1E39B' },},
    {headerName: 'Menu head',field:'menuHead',   cellStyle: { 'text-align': 'center', 'background-color': 'pink' },},
    
    {headerName: 'status', field: 'status',suppressSizeToFit: true,maxWidth: 150,editable: true,cellStyle: { 'text-align': 'center', 'background-color': '#F1E39B' },cellEditor: 'agSelectCellEditor', cellEditorParams: {values: colourCodes }, valueFormatter: (params) => { return lookupValue(colourMappings, params.value)},filter: 'agSetColumnFilter'},      

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

    
  const [marketGroup, setMarketGroup] = useState();

  const EditData = (rowData)=>{
    setfilldata(rowData);
    setMarketGroup(!marketGroup)
  }
     

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

  const cellClickedListener = useCallback( event => {
    // console.log('cellClicked', event);
    setfilldata(event["data"]);
  }, []);
  let menuGroupOptions = []
  const [hotelLive, sethotelLive] = useState(null);
  
  useEffect(() => {

    fetchx(API_URL2 + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())
      .then(postres => {
        sethotelLive(postres['data'][0]["isLive"])
       
      })  
    fetchx(API_URL2+'/getmenugroup?hotelID=1')
    .then(result => result.json())
    .then(rowData => {setRowData(rowData['data'])
       const responseData = rowData['data'];
    if (Array.isArray(responseData)) {
      menuGroupOptions = responseData.map(item => ({
        value: item.groupName,
        label: item.groupName,
      }));
    }
    sessionStorage.setItem('menuGroupOptions', JSON.stringify(menuGroupOptions));
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
    if (
      data.storeID !== null &&
      data.groupName !== null &&
      data.status.value !== null &&
     data.menuHead.value !== null

          ) {
      let menugroup = JSON.stringify({
        "hotelID":1,
        "storeID": data.storeID.value,
        "groupName": data.groupName,
        // "status": data.status.value,
        "status": "Enable",

        "activeItemCount":10,
        "menuHead":data.menuHead.value,
      });
      let res = fetchx(API_URL2+"/addmenugroup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: menugroup,
      }).then((res) => {
   
    if(res['status']==200){

      const swalInstance = MySwal.fire({
          text: "Menu Group Added Successfully",
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
          //   setpaymentInfoModal(false)
          fetchx(API_URL2+'/getmenugroup?hotelID=1')
          .then(result => result.json())
          .then(rowData => {setRowData(rowData['data'])
          // console.log(rowData['data'])
          })
          }
        });
   
      }
      });
     
    }
  };

  const handleReset = () => {
    reset({
      storeID: "",
      groupName: "",
      activeItemCount: "",
      menuHead:"",
      status:"",

    });
  };

 
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);

  const onBtnExport = () => {
    const params = {
      fileName: 'Menu Groups.xlsx',
      sheetName: 'Sheet1',
    };

    gridRef.current.api.exportDataAsExcel(params);
  };


  const [showModal, setShowModal] = useState(false);
  const [showcard, setshowcard] = useState('')
  const [files, setFiles] = useState('')
  
 const handleFile = () => {
  setFiles((prevShowcard) => !prevShowcard);

  setshowcard(false)
}
   
 const handleAddCard = () => {
  setshowcard((prevShowcard) => !prevShowcard);
  setFiles(false)
  
}


const handleDownload = async (filename) => {
  try {
    const response = await fetchx(API_URL2 + '/downloadcsvfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filename })
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    // Convert the response to blob
    const blob = await response.blob();

    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename; // Set the desired filename
    document.body.appendChild(link);

    // Click the link to start the download
    link.click();

    // Cleanup: remove the anchor element and revoke the temporary URL
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    // Handle error
    console.error('Error downloading file:', error.message);
  }
};
  return (
    <div>


<div>
        <Modal  isOpen={marketGroup} toggle={() => setMarketGroup(!marketGroup)}className="modal-lg"  >
          <ModalHeader className="modal-lg"toggle={() => setMarketGroup(!marketGroup)} >
           Edit Menu Group Details
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">            
            <Editmenugroup data1={filldata} />
          </ModalBody>
        </Modal>
      </div>

      {hotelLive === 0 && (<Card>
      <CardHeader><h4><b> Add Menu Group</b></h4></CardHeader>
     </Card>)}
      {hotelLive === 0 && ( <p style={{color: "grey"}}> 
      <b><h4> Instructions:  </h4> </b>
      1.Please refer to the sample file before uploading the data. You can access the sample file by clicking the  <b>" Menu Group File" </b> button. Please ensure that data insertion follows the established pattern.<br/> Kindly refrain from altering the file structure.<br/>
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
          <UploadMenugroupCSV/>
      </div>)}


  {hotelLive === 1 &&(  <Card>
    <Accordion open={open} toggle={toggle}>
      <AccordionItem>
        <AccordionHeader targetId='1'>Add Menu Groups</AccordionHeader>
        <AccordionBody accordionId='1'>

          
<Input required type="radio" name='ex1' value="fit" onChange={handleAddCard} />
                Add manually
              <span>&nbsp;&nbsp;</span>    <span></span>
              
             
              <Input required type="radio" name='ex1' value="fit" onChange={handleFile} />
                Upload file 


{showcard &&
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

         

          <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="groupName">
              MenuGroup Name
            </Label>
       
              <Controller
                id="groupName"
                name="groupName"
                control={control}
                placeholder="groupName"
                render={({ field }) => (
                  <Input
                  // pattern="[aA-zZ]*" title="Only Alphabets Allowed" 
                  placeholder="Enter groupName"
                  required
                    {...field}
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.groupName === null,
                    })}
                  />
                )}
              />
          </div>
          </Col>
        
            <Col md='4' sm='12'>
          <div className='mb-1'>
            <Label className='form-label' for='menuHead'>
            Menu head <spam style={{color:'red'}}>*</spam>
            </Label>
            <Controller
              id="menuHead"
              control={control}
              name="menuHead"
              render={({ field }) => (
                <Select
                required
                  isClearable
                  options={menuHeadoptions}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  className={classnames("react-select", {
                    "is-invalid": data !== null && data.menuHead === null,
                  })}
                  {...field}
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
      </CardBody>}


      {files && (
<div>
<br/>
<UploadMenugroupCSV/>
</div>)}


      </AccordionBody>
      </AccordionItem>
      </Accordion>
    </Card>)}
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
              <Editmenugroup data1={filldata} >
                
              </Editmenugroup>
              </Card>
            </ModalBody>
           
          </Modal>
        </div>
      </Card>


      <br/>  
      {hotelLive === 1 &&(<p style={{color: "grey"}}> 
      <b><h4> Instructions:  </h4> </b>
      1.Please refer to the sample file before uploading the data. You can access the sample file by clicking the  <b>"MenuGroup File" </b> button. Please ensure that data insertion follows the established pattern. Kindly refrain from altering the file structure.<br/>
      2.Before adding new data, please ensure to delete all existing data in the CSV file except for the header row.<br/>
      3.If a duplicate entry is found, please remove the existing data and insert the .csv file without any duplicates.<br/>
      4.Finally, remember to save the file in .csv format for proper upload.<br/>
    </p>)}

{/* Search Bar */}
<div>
        <Row>
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
 {/*  <Download Sample File/> */}
      <div align="end" className="buttons">
        
       {hotelLive === 1 &&( <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button>)}
      </div>  
    
        </Row>       
      </div>

      <br/>
      <br/>

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
      {/* </Card> */}
    {/* <App/> */}
    </div>
  );
};

export default ValidationThirdPartyComponents;


   
      //   {/*  <Download Sample File/> */}
      // <div align="end" className="buttons">
      // {/* <Button className='me-1' outline color='secondary' onClick={() => handleDownload('Menugroup.csv')}>MenuGroup File</Button>         */}
      //  {hotelLive === 1 &&( <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button>)}
      //  <Button className='me-1' outline color='secondary' onClick={() => handleDownload('Menugroup.csv')}>MenuGroup File</Button>

      // </div>  
