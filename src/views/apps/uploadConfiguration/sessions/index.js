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
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, UncontrolledAccordion } from 'reactstrap'
import {Edit2,Search,} from "react-feather";

// ** Custom Components
import Avatar from "@components/avatar";
import API_URL2 from "../../../../config2";
import withReactContent from 'sweetalert2-react-content'

import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import Editsession from "./editsession"
import UploadSessionCSV from "./uploadFile"

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
  Col, Modal, ModalBody, ModalHeader
} from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import 'ag-grid-enterprise';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';

const SessionOptions = [
  { value: "Lunch", label: "Lunch" },
  { value: "Breakfast", label: "Breakfast" },
  { value: "Dinner", label: "Dinner" },

];


const isAllowanceOptions = [
  { value: "1", label: "Yes" },
  { value: "0", label: "No" },
];

const discountAllowedOptions = [
  { value: "1", label: "Yes" },
  { value: "0", label: "No" },

];

const activeoptions = [
  { value: "1", label: "Active" },
  { value: "0", label: "InActive" },
];



const defaultValues = {
  storeID: "",
  sessionName: "",
  status: "",
};

const colourOptions = [
  { value: 'Enable', label: 'Enable' },
  { value: 'Disable', label: 'Disable' },
]


let id = 1;
const ValidationThirdPartyComponents = () => {
  const [rowData, setRowData] = useState();
  // ** State
  const [open, setOpen] = useState('0')
  const [updatedrowData, setupdatedRowData] = useState([]);
  const [showsavebtn,setshowsavebtn] = useState(false)
  const [showPrevbtn,setshowPrevbtn] = useState(false)



const MySwal = withReactContent(Swal)
let navigate = useNavigate();


  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }

  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
    // { headerName: 'ID', field: 'id', suppressSizeToFit: true, maxWidth: 160,cellStyle: { 'text-align': 'center', 'background-color': '#F1E39B' } },
    { headerName: 'Store ID', field: 'storeID', suppressSizeToFit: true, cellStyle: { 'text-align': 'center', 'background-color': 'pink' } },
    { headerName: 'Store Name', field: 'restaurantName', suppressSizeToFit: true, cellStyle: { 'text-align': 'center', 'background-color': '#F1E39B' } },
    { headerName: 'Session Name', field: 'sessionName',cellStyle: { 'text-align': 'center', 'background-color': 'pink' } },
    { headerName: 'Session startTime', field: 'startTime', suppressSizeToFit: true ,editable: true, cellStyle: { 'text-align': 'center', 'background-color': '#F1E39B' }},
    { headerName: 'Session endTime', field: 'endTime', suppressSizeToFit: true,editable: true, cellStyle: { 'text-align': 'center', 'background-color': 'pink' } },
    // {headerName: 'status',field: 'status'},
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
  const [filldata, setfilldata] = useState({});


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
    // console.log('cellClicked', event);
  }, []);


  const updatedRowsList = []

  const onCellValueChanged = useCallback( event => {
    // console.log('onCellValueChanged', event);
    updatedRowsList[event.data.id] = event.data
    setupdatedRowData(updatedRowsList);

  }, []);
  const [hotelLive, sethotelLive] = useState(null);


  useEffect(() => {
    // console.log("Clicked")
    fetchx(API_URL2 + '/getSessionDetails?hotelID=' + id)
      .then(result => result.json())
      .then(rowData => {
        setRowData(rowData['data'])
        // console.log(rowData['data'])
      })

      fetchx(API_URL2 + "/getBusinessDate", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json())
        .then(postres => {
          console.log(postres["data"][0]["id"])
          sethotelLive(postres['data'][0]["isLive"])
         
        })

  }, []);

  function ReloadTable() {
   
    setRowData(updatedrowData)
    setshowsavebtn(true)
    setshowPrevbtn(true)
  }


  function handlePreviewChanges () {
    updatedrowData.forEach(data => {
      // console.log(data)
    const updateditem = JSON.stringify({
      "hotelID":data['hotelID'],
      "storeID":data['storeID'],
      "sessionName":data['sessionName'],
      "startTime":data['startTime'],
      "endTime":data['endTime'],
      "id":data['id']
    })
   

    // console.log(updateditem)
    fetchx(API_URL2+'/updateSessionDetails', {
  method: 'PUT',
  body: updateditem,
  headers: {
     'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((res) => res.json())
  .then((post) => {
      // console.log(post)
      if(post['statusCode'] == 200) {
        const swalInstance = MySwal.fire({
          text: 'Session Details updated Successfully!',
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
      }
  })
  .catch((err) => {
     console.log(err.message);
  });
  
})

  }
  function handlePrevbtn () {
    navigate('');
  }
  // ** State
  const [data, setData] = useState(null);

  // ** Hooks
  const { reset, handleSubmit, control, formState: { errors }
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    setData(data);
    // console.log(data)
    if (
      data.storeID !== null &&
      data.sessionName !== null &&
      // data.status.value !== null
      data.startTime !== null &&
      data.endTime !== null 
    ) {
      // console.log(data);
      let createasset = JSON.stringify({
        "hotelID" : 1,
        "storeID": data.storeID.value,
        "sessionName": data.sessionName,
        "status": "created",
        "startTime" : data.startTime,
        "endTime" : data.endTime,
      });
      // console.log(createasset);
      let res = fetchx(API_URL2 + "/addsession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: createasset,
      }).then((res) => {
        // console.log(res);
        if (res['status'] == 200) {

          const swalInstance = MySwal.fire({
            text: "Session Details Added Successfully",
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
            // fetchx(API_URL2 + '/getSessionDetails?hotelID=' + id)
            fetchx(API_URL2 + '/getSessionDetails?hotelID=1')

            .then(result => result.json())
            .then(rowData => {
              setRowData(rowData['data'])
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
      sessionName: "",
      status: "",
    });
  };

  const storeOptions = JSON.parse(sessionStorage.getItem('storeOptions'));
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);



  const onBtnExport = () => {
    const params = {
      fileName: 'Sessions.xlsx',
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


const handleDownload = async () => {
  // setShowForexPDF(true)
  try {
    const response = await fetchx(API_URL2 + '/downloadcsvfile', {
      method: 'GET',
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
    link.download = 'store.csv'; // Set the desired filename
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
           Edit Session Details
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">            
            <Editsession data1={filldata} />
          </ModalBody>
        </Modal>
      </div> 

      {hotelLive === 0 && (<Card>
      <CardHeader><h4><b> Add Sessions</b></h4></CardHeader>
     </Card>)}
      {hotelLive === 0 && ( <p style={{color: "grey"}}> 
      <b><h4> Instructions:  </h4> </b>
      1.Please refer to the sample file before uploading the data. You can access the sample file by clicking the  <b>"Session File" </b> button. Please ensure that data insertion follows the established pattern.<br/> Kindly refrain from altering the file structure.<br/>
      2.Before adding new data, please ensure to delete all existing data in the CSV file except for the header row.<br/>
      3.If a duplicate entry is found, please remove the existing data and insert the .csv file without any duplicates.<br/>
      4.Please click the "Edit" <Edit2 style={{ height: "10px" }} />button to modify the data. Once data is inserted, it cannot be edited through the CSV file.<br/>
      5.Finally, remember to save the file in .csv format for proper upload.<br/>
    </p>)}
    <br/>


    {hotelLive === 0 && (
        <div> 
          <br/>
          <UploadSessionCSV/>
      </div>)}

      { hotelLive === 1 && (<UncontrolledAccordion>

      {/* <Card> */}
        <Accordion open={open} toggle={toggle}>
          <AccordionItem>
            <AccordionHeader targetId='1'>Add Sessions</AccordionHeader>
            <AccordionBody accordionId='1'>
 
              <CardBody>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col md="4" sm="12" className="mb-1">
                      <div className="mb-1">
                        <Label className="form-label" for="storeID">
                          store Name <spam style={{ color: "red" }}>*</spam>
                        </Label>
                        <Controller
                          id="storeID"
                          control={control}
                          name="storeID"
                          render={({ field }) => (
                            <Select
                              isClearable
                              // defaultValue={defaultStatus2}
                              // options={sessionStorage.getItem('storeOptions')}
                              options={storeOptions}
                              classNamePrefix="select"
                              theme={selectThemeColors}
                              className={classnames("react-select",)}
                              {...field}
                            // onChange={handleChange1}
                            />
                          )}
                        />
                      </div>
                    </Col>

          
                    <Col md='4' sm='12' className='mb-1'>
                      <div className="mb-1">
                        <Label className="form-label" for="sessionName">
                          Session Name
                        </Label>
                       
                          <Controller
                            id="sessionName"
                            name="sessionName"
                            control={control}
                            placeholder="sessionName"
                            render={({ field }) => (
                              <Cleave
                                pattern="[aA-zZ]*" title="Only Alphabets Allowed"
                                placeholder="Enter sessionName"
                                required
                                {...field}
                                className={classnames("form-control", {
                                  "is-invalid": data !== null && data.sessionName === null,
                                })}
                              />
                            )}
                          />
                      </div>
                    </Col>
                    <Col md="4" sm="8">
                      <div className="mb-1">
                        <Label className="form-label" for="startTime">
                          Session StartTime <spam style={{ color: "red" }}>*</spam>
                        </Label>
                        <Controller
                          // defaultValue=''
                          control={control}
                          id="startTime"
                          name="startTime"
                          render={({ field }) => (
                            <Input
                              required
                              type="time"
                              placeholder="ETD"
                              invalid={errors.startTime && true}
                              // defaultValue={details.pickUpTime}
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </Col>
                    <Col md="4" sm="8">
                      <div className="mb-1">
                        <Label className="form-label" for="endTime">
                          Session Endtime <spam style={{ color: "red" }}>*</spam>
                        </Label>
                        <Controller
                          // defaultValue=''
                          control={control}
                          id="endTime"
                          name="endTime"
                          render={({ field }) => (
                            <Input
                              required
                              type="time"
                              placeholder="ETD"
                              invalid={errors.endTime && true}
                              // defaultValue={details.pickUpTime}
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
              </CardBody>
              {/* } */}

 
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      {/* </Card> */}
      </UncontrolledAccordion>)}

      <Row>

{/* Search Bar */}
<br/>  <br/> <br/>


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
{ hotelLive === 1 && (<Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button>)}

  </div>     
        </Row>       
      </div>

      <br/>
      <br/>


      </Row>


      <br/>
      <br/>

      {/* <Card> */}
        <div className="ag-theme-alpine" style={{ height: 520 }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData} columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            onCellValueChanged = {onCellValueChanged}
            paginationAutoPageSize='true'
            paginationPageSize='10'
            pagination='true'
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
