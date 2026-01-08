import { useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import { Check } from "react-feather";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Avatar from "@components/avatar";
import { selectThemeColors } from "@utils";
import {Input,Card,Form,Label,Button,CardBody,CardTitle,CardHeader,InputGroup,Row,Col,Modal,ModalHeader,ModalBody} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback} from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap'
import API_URL2 from "../../../../config2";
const id = '1';
import EditMarketGroup from "./editReasonGroup"
import UploadDocs from "./uploadFile"
import {Edit2,Search,} from "react-feather";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import { useNavigate } from 'react-router-dom';
// let reasonGroupID = [
//   fetchx(API_URL2 + '/getForeignKeyReasonGroup?hotelID=1')
//     .then(result => result.json())
//     .then(resp => {
//       // console.log(resp['data'])
//       reasonGroupID = resp['data']
//       console.log(reasonGroupID)
//     })
// ]

const defaultValues = {
    reasonCode: '',
      description: "", 
      reasonGroupID:null,    
      isActive: null
};

const Extras = () => {
  const [open, setOpen] = useState('')
  const toggle = id => { open === id ? setOpen() : setOpen(id)  }  
  const [selectedValue, setSelectedOption] = useState('');
  const [rowData, setRowData] = useState();

  const gridRef = useRef();
  const [marketGroup, setMarketGroup] = useState();
  const [filldata, setfilldata] = useState(" ");
  let navigate = useNavigate();  

  const EditData = (rowData)=>{
    setfilldata(rowData);
    setMarketGroup(!marketGroup)
  }
  const [columnDefs, setColumnDefs] = useState([  
    {headerName: 'Reason Group',field: 'reasonGroup',suppressSizeToFit: true,cellStyle: {'text-align': 'center','background-color': '#F1E39B'}, maxWidth: 140 },
    {headerName: 'Description',field: 'description',suppressSizeToFit: true,cellStyle: {'text-align': 'center','background-color': 'pink'}, maxWidth: 140 },
    // {headerName: 'Reason Group',field: 'reasonGroup',suppressSizeToFit: true,cellStyle: {'text-align': 'center','background-color': '#F1E39B'}, maxWidth: 140 },   
    // {headerName: 'Is Active',field: 'isActive',suppressSizeToFit: true,cellStyle: {'text-align': 'center','background-color': 'pink'}, maxWidth: 140 },
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

    fetchx(API_URL2 + '/getReasonGroup?hotelID=1')
    .then(result => result.json())
    .then(rowData => {setRowData(rowData['data'])
    // console.log(rowData['data'])
    })
  }, []); 


  // ** State
  const [data, setData] = useState(null);
  const [value, setValue] = useState('')


  // ** Hooks
  const { reset, handleSubmit, control ,formState: { errors }
} = useForm({ defaultValues });

  // const onSubmit = (data) => {
  //   setData(data);
  //   // console.log(selectedValue)
  //   data['type']=selectedValue
  //   // console.log(data)
  //   // console.log(data.type)
  //   if (
  //     // data.hotelID !== null &&
  //     data.reasonGroup !== null 
 
  //         ) {
  //     // console.log(data);
  //     let createExtra = JSON.stringify({
  //       // "hotelID": data.hotelID,
  //       "reasonGroup": data.reasonGroup,
  //       "description": data.description,
  //       // "reasonGroupID": data.reasonID.value,        
  //       "isActive":1,
  //     });
  //     // console.log(createExtra);

  //     let res = fetchx(API_URL2 + "/addreasongroup", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: createExtra,
  //     }).then((res) => {
  //       // console.log(res);
  //       if(res['status']==200){
  //         fetchx(API_URL2 + '/getReasonGroup?hotelID=1')
  //         .then(result => result.json())
  //         .then(rowData => {setRowData(rowData['data'])
  //         // console.log(rowData['data'])
  //       })
  //       }      

        
  //     });
  //     toast(
  //       <div className="d-flex">
  //         <div className="me-1">
  //           <Avatar size="sm" color="success" icon={<Check size={12} />} />
  //         </div>
  //         <div className="d-flex flex-column">
  //           <h6>Form Submitted!</h6>
  //           <h4>Reason Group Added Successfull</h4>
  //         </div>
  //       </div>
  //     );
  //   }
  // };

   const onSubmit = (data) => {
    console.log(data);
    setData(data);
  
    let createsourcecode = JSON.stringify({
     // "hotelID": data.hotelID,
     "reasonGroup": data.reasonGroup,
     "description": data.description,
     // "reasonGroupID": data.reasonID.value,        
     "isActive":1,
    });
  
    console.log(createsourcecode);
  
    fetchx(API_URL2 + '/addreasongroup', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createsourcecode
    })
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        const swalInstance = MySwal.fire({
          text: 'reasongroup Added Successfully!',
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
  
        fetchx(API_URL2 + '/getReasonGroup?hotelID=' + id)
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
  

  const handleReset = () => {
    reset({
        reasonGroup: '',
        description: "", 
        // reasonGroupID:null,    
        isActive: null
    });
  };  

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);

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

  // Download Excel File
  const onBtnExport = () => {
   const params = {
     fileName: 'reasonGroup.xlsx',
     sheetName: 'Sheet1',
   };
   gridRef.current.api.exportDataAsExcel(params);
  };


  return (
    <div>

      
   <div>
        <Modal  isOpen={marketGroup} toggle={() => setMarketGroup(!marketGroup)}className="modal-lg"  >
          <ModalHeader className="modal-lg"toggle={() => setMarketGroup(!marketGroup)} >
           Edit Reason Group Details
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">            
            <EditMarketGroup data1={filldata} />
          </ModalBody>
        </Modal>
      </div>

      {hotelLive === 0 && (<Card>
      <CardHeader><h4><b> Add Reason Group</b></h4></CardHeader>
     </Card>)}
      {hotelLive === 0 && ( <p style={{color: "grey"}}> 
      <b><h4> Instructions:  </h4> </b>
      1.Please refer to the sample file before uploading the data. You can access the sample file by clicking the  <b>"Reason Group File" </b> button. Please ensure that data insertion follows the established pattern.<br/> Kindly refrain from altering the file structure.<br/>
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



       <div>
    {hotelLive === 1 && (<Accordion open={open} toggle={toggle}>
      <AccordionItem>
        <AccordionHeader targetId='1'><h4><b>Add Reason Group </b> </h4></AccordionHeader>
        <AccordionBody accordionId='1'>
       
        <Card>
      <CardHeader>
        <CardTitle tag="h4">Reason Group</CardTitle>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>       
          <Col md='3' sm='12' className='mb-1'>
            <div className='mb-1'>
             
            <Label className='form-label' for='reasonGroup'>
              Reason Group
            </Label>
            <InputGroup className="input-group-merge">
            <Controller
              defaultValue=''
              control={control}
              id='reasonGroup'
              name='reasonGroup'
              render={({ field }) => <Input required placeholder="Reason Group" className={classnames({
                "is-invalid": data !== null && (data.reasonGroup === null || !data.reasonGroup.length)
              })} {...field}/>}
            />
            </InputGroup>
            
          </div>
          </Col>
          <Col md='3' sm='12' className='mb-1'>
            <div className='mb-1'>
            <Label className='form-label' for='description'>
              Description
            </Label>
            <InputGroup className="input-group-merge">
            <Controller
              defaultValue=''
              control={control}
              id='description'
              name='description'
              render={({ field }) => <Input required placeholder="Description" className={classnames({
                "is-invalid": data !== null && (data.description === null || !data.description.length)
              })} {...field}/>}
            />
            </InputGroup>
          </div>
          </Col>
          {/* <Col md='3' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="groupID">
            Group ID
            </Label>
            <Controller
                  id='groupID'
                  control={control}
                  name='groupID'
                  render={({ field }) => (
                    <Select
                    isMulti
                      isClearable
                      options={groupID}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.groupID === null })}
                      {...field}
                    />
                  )}
                />
          </div>
          </Col> */}
          {/* <Col md='3' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="reasonID">
            Reason Group
            </Label>
            <Controller
                  id='reasonID'
                  control={control}
                  name='reasonID'
                  render={({ field }) => (
                    <Select
                    // isMulti
                      isClearable
                      options={reasonGroupID}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.reasonID === null })}
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
</div>

<br/>  
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
      {  hotelLive === 1 &&(<Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button>)}
      </div> 
   
      
        </Row>       
      </div>

      <br/>
      <br/>
    <div>
    <Card>
    <div className="ag-theme-alpine" style={{ height: 540}}>
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
    </Card>
    </div>    
    </div>
  );
};

export default Extras;


      // {/*  <Download Sample File/> */}
      // <div align="end" className="buttons">
      // {  <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button>}
      // </div>  