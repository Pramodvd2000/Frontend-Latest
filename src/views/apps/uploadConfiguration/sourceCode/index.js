// ** React Imports
import { useState } from 'react'
// ** Third Party Components
import Select from 'react-select'
import toast from 'react-hot-toast'
import classnames from 'classnames'
import Cleave from 'cleave.js/react'
import { Check } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, UncontrolledAccordion } from 'reactstrap'
// ** Custom Components
import Avatar from '@components/avatar'
// ** Utils
import { selectThemeColors } from '@utils'
// ** Reactstrap Imports
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input,InputGroup, InputGroupText, Modal, ModalBody, ModalHeader } from 'reactstrap'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useRef, useEffect, useMemo, useCallback} from 'react';
import API_URL2 from '../../../../config2'
import UploadDocs from "./uploadFile" 
import EditSourceCode from "./editSourceCode"
import {Edit2,Search,} from "react-feather";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import { useNavigate } from 'react-router-dom';
// const id = '1';
// API_URL2
// import App from './datagrid'
// import SourceCode from '../../otherTables/roomClass'
const defaultValues = {
  // hotelID: '',
  sourceCode: '',
  description: '',
  isActive: null,
  sourceGroupID: null
}
let SourceGroupID = [
  fetchx(API_URL2 + '/getSourceGroupForSourceCode?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      SourceGroupID = resp['data']
    })
  ]
   const colourOptions = [
       { value: '1', label: 'Active' },
      { value: '0', label: 'InActive' },
    ]
const SourceCode = () => {
  const [open, setOpen] = useState('0')
    let navigate = useNavigate();  

  // ** Hooks
  const {
    setError,
    formState: { errors }
  } = useForm()
  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }
  // window.location.reload(true);
  // Ag Grid
  const [rowData, setRowData] = useState();
  const gridRef = useRef();
  const [columnDefs, setColumnDefs] = useState([
    // { headerName: 'Hotel ID', field: 'hotelID', suppressSizeToFit: true, maxWidth: 160 },
    { headerName: 'Source Code', field: 'sourceCode', suppressSizeToFit: true ,cellStyle: {'text-align': 'center','background-color': '#F1E39B'}, headerClass: "text-center" },
    { headerName: 'Description', field: 'description',cellStyle: {'text-align': 'center','background-color': 'pink'}, headerClass: "text-center"  },
    // { headerName: 'Active Status', field: 'isActive' },
    { headerName: 'Source Group', field: 'sourceGroup',cellStyle: {'text-align': 'center','background-color': '#F1E39B'}, headerClass: "text-center" },
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
  }, []);
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

    fetchx(API_URL2 + '/getSource?hotelID=1')
    .then(result => result.json())
    .then(rowData => setRowData(rowData['data']))
  }, []);
  
  // ** State
  const [data, setData] = useState(null)
  // ** Hooks
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  const [value, setValue] = useState('')


  // const onSubmit = data => {
  //   setData(data)
  //   // console.log(data)
  //   if ( 
  //     data.sourceCode!==null && data.sourceGroupID!==null
  //      ) {
  //     // console.log(data)
  //     let createsourcecode = JSON.stringify({
  //       // "hotelID": data.hotelID,
  //       "sourceCode": data.sourceCode,
  //       "description": data.description,
  //       "isActive": 1,
  //       "sourceGroupID": data.sourceGroupID.value
  //     })
  //     // console.log(createsourcecode)
  //     // console.log("hi")
  //     let res = fetchx(API_URL2 + "/addSource", {
  //       method: "POST",
  //       headers: { 'Content-Type': 'application/json' },
  //       body: createsourcecode
  //     }).then((res) => {
  //       // console.log(res);
  //       if(res['status']==200){
  //         fetchx(API_URL2 + '/getSource?hotelID=1')
  //         .then(result => result.json())
  //         .then(rowData => {setRowData(rowData['data'])
  //         // console.log(rowData['data'])
  //       })
  //       }
        
  //     });
  //     toast(
  //       <div className='d-flex'>
  //         <div className='me-1'>
  //           <Avatar size='sm' color='success' icon={<Check size={12} />} />
  //         </div>
  //         <div className='d-flex flex-column'>
  //           <h6>Form Submitted!</h6>
  //           <h4>Source Code Added Successfull</h4>
  //         </div>
  //       </div>
  //     )
  //   }
  // }

  const onSubmit = (data) => {
  console.log(data);
  setData(data);

  let createsourcecode = JSON.stringify({
     // "hotelID": data.hotelID,
     "sourceCode": data.sourceCode,
     "description": data.description,
     "isActive": 1,
     "sourceGroupID": data.sourceGroupID.value
  });

  console.log(createsourcecode);

  fetchx(API_URL2 + '/addSource', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: createsourcecode
  })
  .then((res) => {
    console.log(res);
    if (res.status === 200) {
      const swalInstance = MySwal.fire({
        text: 'SourceCode Added Successfully!',
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

      fetchx(API_URL2 + '/getSource?hotelID=' + id)
        .then(result => result.json())
        .then(rowData => {
          setRowData(rowData['data']);
        })
        .catch(error => {
          // Handle error if fetch fails
          console.error('Error fetching source group:', error);
        });
    }
  })
  .catch(error => {
    // Handle error if fetch fails
    console.error('Error adding source group:', error);
  });
};


  const handleChange = event => {
    setValue(event.target.value)
  }
  const handleReset = () => {
    reset({
      // hotelID: '',
      sourceCode: '',
      description: '',
      isActive: null,
      sourceGroupID: null
    })
  }
  const onBtnExport = () => {
    const params = {
      fileName: 'Store.xlsx',
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
    const response = await fetch(API_URL2 + '/downloadcsvfile', {
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
const [filldata, setfilldata] = useState({});
const onFilterTextBoxChanged = useCallback(() => {
  gridRef.current.api.setQuickFilter(
    document.getElementById("filter-text-box").value
  );
}, []);
  return (
    <div>
<div>
        <Modal  isOpen={marketGroup} toggle={() => setMarketGroup(!marketGroup)}className="modal-lg"  >
          <ModalHeader className="modal-lg"toggle={() => setMarketGroup(!marketGroup)} >
           Edit Source Code Details
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">            
            <EditSourceCode data1={filldata} />
          </ModalBody>
        </Modal>
      </div>

      
      {hotelLive === 0 && (<Card>
      <CardHeader><h4><b> Add Source Code</b></h4></CardHeader>
     </Card>)}
      {hotelLive === 0 && ( <p style={{color: "grey"}}> 
      <b><h4> Instructions:  </h4> </b>
      1.Please refer to the sample file before uploading the data. You can access the sample file by clicking the  <b>"Source Code File" </b> button. Please ensure that data insertion follows the established pattern.<br/> Kindly refrain from altering the file structure.<br/>
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


      {/* <Card> */}
      {hotelLive === 1 &&(  <Accordion open={open} toggle={toggle}>
          <AccordionItem>
            <AccordionHeader targetId='1'>Add Source Code</AccordionHeader>
            <AccordionBody accordionId='1'>
          
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Source Code</CardTitle>
      </CardHeader>
      <CardBody>
     
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>           
              <Col md='4' sm='12'>
              <div className='mb-1'>
                <Label className='form-label' for='sourceCode'>
                  Source Code
                </Label>
                <InputGroup className='input-group-merge'>
                  
                  <Controller
                    id='sourceCode'
                    name='sourceCode'
                    control={control}
                    render={({ field }) => (
                      <Input
                      placeholder='Source Code'
                      // pattern="[Aa-zZ]" title="Type Only Alphabets" 
                      required 
                        {...field}
                        className={classnames('form-control', {
                          'is-invalid': data !== null && (data.sourceCode === null || !data.sourceCode.length)
                        })}
                      />
                    )}
                  />
                </InputGroup>
              </div>
            </Col>
            <Col md='4' sm='12'>
              <div className='mb-1'>
                <Label className='form-label' for='description'>
                  Description
                </Label>
                <InputGroup className='input-group-merge'>
                  
                  <Controller
                    id='description'
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <Input
                      required
                      placeholder='Description'
                      // pattern="[A-Za-z0-9_]{1,15}"
                      // title="Description should not contain special characters and should only contain 15 characters"
                        {...field}
                        className={classnames('form-control', {
                          // 'is-invalid': data !== null && (data.description === null || !data.description.length)
                        })}
                      />
                    )}
                  />
                </InputGroup>
              </div>
            </Col>
            {/* <Col md='4' sm='12'>
              <div className='mb-1'>
                <Label className='form-label' for='isActive'>
                  Active Status
                </Label>
                <Controller
                  id='isActive'
                  control={control}
                  name='isActive'
                  render={({ field }) => (
                    <Select
                    required
                      isClearable
                      options={colourOptions}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.isActive === null })}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col> */}
            <Col  md='4' sm='12'>
          <div className='mb-1'>
            <Label className='form-label' for='sourceGroupID'>
            Source Group
            </Label>
            <Controller
              id="sourceGroupID"
              control={control}
              name="sourceGroupID"
              render={({ field }) => (
                <Select
                // pattern="[0-9]*" title="Type Only Numbers" 
                required
                isClearable
                  options={SourceGroupID}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  className={classnames("react-select", {
                    "is-invalid": data !== null && data.sourceGroupID === null,
                  })}
                  {...field}
                  
                />
              )}
            />
          </div>
          </Col>
            
            <div className='d-flex'>
              <Button className='me-1' color='primary' type='submit'>
                Submit
              </Button>
              <Button outline color='secondary' type='reset' onClick={handleReset}>
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
      {/* </Card> */}
       
      
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
            // paginationAutoPageSize = 'true'
            paginationPageSize= '10'
            pagination = 'true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            
            />
      </div>
    {/* <App/> */}
    </div>
  )
}
export default SourceCode;
