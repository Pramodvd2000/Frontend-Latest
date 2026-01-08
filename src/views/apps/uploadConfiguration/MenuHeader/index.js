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

// ** Custom Components
import Wizard from "@components/wizard";

// // ** Steps
import Editmenuheader from "./editmenuheader";


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
  Modal,
  ModalHeader,
  ModalBody
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
import UploadDocs from "./uploadFile";
import {Edit2,Search,} from "react-feather";

import { useRef, useEffect, useMemo, useCallback} from 'react';
// const ref = useRef(null);


const defaultValues = {
  category: "",
  costPrice: "",
  taxPercentage: "",
};

const colourOptions = [
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

 // ** Ref
 const ref = useRef(null);
 const [stepper2, setstepper2] = useState(null);
const toggle = id => {
  open === id ? setOpen() : setOpen(id)
}

  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
   
    {headerName: 'Category',field: 'category', cellStyle: {'textAlign': 'center','backgroundColor': '#F1E39B'}, maxWidth: 140 },
    {headerName: 'Cost Price',field: 'costPrice', cellStyle: {'textAlign': 'center','backgroundColor': 'pink'}, maxWidth: 140 },
    {headerName: 'Tax Percentage',field: 'taxPercentage', cellStyle: {'textAlign': 'center','backgroundColor': '#F1E39B'}, maxWidth: 140 },
    {
      headerName: "Action",field: "numAvlRooms",suppressSizeToFit: true, maxWidth: 120,
      cellRendererFramework: (params) => (
        // <Button color="primary" onClick={() => editButton(!show)}> Edit  </Button> ),
        <Edit2 style={{ height: "20px" }}  onClick={() =>{EditData(params.data)}} align='end' />                        

       ),
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



  const cellClickedListener = useCallback( event => {
    console.log('cellClicked', event);
    setfilldata(event["data"]);

  }, []);

  const [hotelLive, sethotelLive] = useState(null);
  
  useEffect(() => {

    fetchx(API_URL2 + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())
      .then(postres => {
        sethotelLive(postres['data'][0]["isLive"])
       
      })

      
    fetchx(API_URL2+'/getMenuHeaderallDetails?hotelID=1')
    .then(result => result.json())
    .then(rowData => {setRowData(rowData['data'])
    console.log(rowData['data'])
    })
  },[]);  

  console.log(rowData)
  // ** State
  const [data, setData] = useState(null);

  // ** Hooks
  const { reset, handleSubmit, control ,formState: { errors }
} = useForm({ defaultValues });

  const onSubmit = (data) => {
    setData(data);
    console.log(data)
    if (
      data.category !== null &&
      data.costPrice !== null &&
      data.taxPercentage !== null
          ) {
      console.log(data);
      let createasset = JSON.stringify({
        "hotelID":id,
        "category": data.category,
        "costPrice": data.costPrice,
        "taxPercentage": data.taxPercentage,
      });
      console.log(createasset);
      let res = fetchx(API_URL2+"/addMenuHeaderDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: createasset,
      })
      .then(result => result.json())
      .then((res) => {
        if(res['statusCode'] == 200){

      const swalInstance = MySwal.fire({
          text: "Menu Header Added Successfully",
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
       
          fetchx(API_URL2+"/getMenuHeaderallDetails", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              hotelID: 1,
            })
          })
          .then(result => result.json())
          .then(rowData => {setRowData(rowData['data'])
          console.log(rowData['data'])
          })
          }
        });
      }
      if(res['statusCode'] == 403){
        const swalInstance = MySwal.fire({
          // text: res[''],
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
              navigate('')
      
          }
        });
      }
      });
      
     
    }
  };

  const handleReset = () => {
    reset({
      category: "",
      costPrice: "",
      taxPercentage: "",
    });
  };
  
  const steps = [
    {
      // id: "menuheader ",
      // title: "Menuheader",
      // subtitle: "Menu Header  Details.",
      
      // icon: <FileText size={18} />,
      content: (
        <Editmenuheader data1={filldata} stepper={stepper} type="wizard-modern" />
      ),
    },
   
  ];
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);

   // Download Excel File
   const onBtnExport = () => {
    const params = {
      fileName: 'MenuHeader.xlsx',
      sheetName: 'Sheet1',
    };
    gridRef.current.api.exportDataAsExcel(params);
   };
 
   const [marketGroup, setMarketGroup] = useState();

  //  const EditData = (rowData)=>{
  //    setfilldata(rowData);
  //    setMarketGroup(!marketGroup)
  //  }
  const EditData = (rowData) =>{
    setfilldata(rowData)
    // editButton(!showEdit)
    setMarketGroup(!marketGroup)

    
  }
      
       // Download Sample File
       const handleDownload = async (filename) => {
        try {
          const response = await fetch(API_URL2 + '/downloadcsvfile', {
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
           Edit Menuheader Details
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">            
            <Editmenuheader data1={filldata} />
          </ModalBody>
        </Modal>
      </div>

      {hotelLive === 0 && (<Card>
      <CardHeader><h4><b> Add Menu Header</b></h4></CardHeader>
     </Card>)}
      {hotelLive === 0 && ( <p style={{color: "grey"}}> 
      <b><h4> Instructions:  </h4> </b>
      1.Please refer to the sample file before uploading the data. You can access the sample file by clicking the  <b>" Menu Header File" </b> button. Please ensure that data insertion follows the established pattern.<br/> Kindly refrain from altering the file structure.<br/>
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
    
    {hotelLive === 1 &&(<Accordion open={open} toggle={toggle}>
      <AccordionItem>
        <AccordionHeader targetId='1'>Add MenuHeader</AccordionHeader>
        <AccordionBody accordionId='1'>

      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
        
          <Col md='4' sm='12' className='mb-1'>
                      <div className="mb-1">
                        <Label className="form-label" for="category">
                        Category
                        </Label>
                         
                          <Controller
                            id="category"
                            name="category"
                            control={control}
                            placeholder="category"
                            render={({ field }) => (
                              <Input
                                //   pattern="[aA-zZ]*" title="Only Alphabets Allowed" 
                                placeholder="Enter category"
                                required
                                {...field}
                                className={classnames("form-control", {
                                  "is-invalid": data !== null && data.category === null,
                                })}
                              />
                            )}
                          />
                      </div>
                    </Col>

          <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="costPrice">
            Cost Price
            </Label>
            <InputGroup className="input-group-merge">
             
              <Controller
                id="costPrice"
                name="costPrice"
                control={control}
                
                render={({ field }) => (
                  <Cleave
                  pattern="[0-9]*" title="Type Only Numbers" 
                  required

                  placeholder="cost Price..."
                    {...field}
                    className={classnames("form-control", {
                      "is-invalid":
                        data !== null && (data.costPrice === null || !data.costPrice.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>


          <Col md='4' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="taxPercentage">
            Tax Percentage
            </Label>
            <InputGroup className="input-group-merge">
            
              <Controller
                id="taxPercentage"
                name="taxPercentage"
                control={control}
                
                render={({ field }) => (
                  <Cleave
                  pattern="[0-9]*" title="Type Only Numbers" 
                  required

                  placeholder="Tax Percentage.."
                    {...field}
                    className={classnames("form-control", {
                      "is-invalid":
                        data !== null && (data.taxPercentage === null || !data.taxPercentage.length)
                    })}
                  />
                )}
              />
            </InputGroup>
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
 {/*  <Download Sample File/> */}
      <div align="end" className="buttons">
        
       {hotelLive === 1 &&( <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button>)}
      </div>  
        
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

      <Card>
        <div className="vertically-centered-modal">

          <Modal
            isOpen={showEdit}
            toggle={() => editButton(!showEdit)}
            // className="modal-lg"
            className="modal-xl"

          >
            {/* <ModalHeader toggle={() => editButton(!showEdit)}>             
              Welcome...
            </ModalHeader> */}
             
            <ModalBody>
              <Card>
                <div className="modern-horizontal-wizard">
                  <Wizard
                    type="modern-horizontal"
                    ref={ref}
                    steps={steps}
                    options={{
                      linear: false,
                    }}
                    instance={(el) => setstepper2(el)}
                  />
                </div>
              </Card>
            </ModalBody>
           
          </Modal>
      
        </div>

      </Card>
      
    {/* <App/> */}
    </div>
  );
};

export default ValidationThirdPartyComponents;

    // {/*  <Download Sample File/> */}
    //        <div align="end" className="buttons">
    //     {/* <Button className='me-1' outline color='secondary' onClick={() => handleDownload('origin.csv')}>Extras File</Button> */}
    //     {hotelLive === 1 && (<Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button>)}
    //     {/* <Button className='me-1' outline color='secondary' onClick={() => handleDownload('MenuHeader.csv')}>MenuHeader File</Button> */}

    //   </div> 



    // <div align="end" className="buttons">
    //   <Button className='me-1' outline color='secondary' onClick={() => handleDownload('MenuHeader.csv')}>MenuHeader File</Button>
    //     <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button>
    //   </div>