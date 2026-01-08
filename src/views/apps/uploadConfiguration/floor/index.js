import { useState } from 'react'
import Select from 'react-select'
import classnames from 'classnames'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import API_URL2 from '../../../../config2'
import { selectThemeColors } from '@utils'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input,InputGroup, InputGroupText,Modal,ModalHeader,ModalBody  } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useRef, useEffect, useMemo, useCallback} from 'react';
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import UploadDocs from "./uploadFile"
const MySwal = withReactContent(Swal)
import EditFloor from "./editFloor"
import {Edit2,Search,} from "react-feather";
const defaultValues = {
  // hotelID: '',
  floor:'',
  blockID: null
  
}


let blockID = [
fetchx(API_URL2 + '/getfloorblockid?hotelID=1')
  .then(result => result.json())
  .then(resp => {
    blockID = resp['data']
  })
]



const Floor = () => {
  const { setError, formState: { errors } } = useForm()
  const [rowData, setRowData] = useState();
  const gridRef = useRef();
  const [data, setData] = useState(null)
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  const [value, setValue] = useState('')
  let navigate = useNavigate();  
  const [marketGroup, setMarketGroup] = useState();
  const [filldata, setfilldata] = useState(" ");

  const EditData = (rowData)=>{
    setfilldata(rowData);
    setMarketGroup(!marketGroup)
  }
  const [columnDefs, setColumnDefs] = useState([
    // {headerName: 'Hotel ID',field: 'hotelID',suppressSizeToFit: true,maxWidth: 160},
    {headerName: 'Floor ',field: 'floor',suppressSizeToFit: true,cellStyle: {'text-align': 'center','background-color': '#F1E39B'}, maxWidth: 140 },
    {headerName: 'Block',field: 'block',suppressSizeToFit: true,cellStyle: {'text-align': 'center','background-color': 'pink'}, maxWidth: 140 },
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


    fetchx( API_URL2 + '/getFloor?hotelID=1&floor=1&blockID=1')
    .then(result => result.json())
    .then(rowData => setRowData(rowData['data']))
  }, []);
  

  const onSubmit = data => {
    setData(data)
    if ( 
      data.floor !== null &&
      data.blockID !== null
       ) {
      let createmarketGroup = JSON.stringify({
        // "hotelID": data.hotelID,
        "floor": data.floor,
        "blockID": data.blockID.value
             })
          let res = fetchx(API_URL2 + "/addFloor", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      }).then(data => data.json())
      .then((res) => {
        // console.log(res);
        if(res['statusCode']==200){
          fetchx( API_URL2 +  '/getFloor?hotelID=1&floor=1&blockID=1')
          .then(result => result.json())
          .then(rowData => {setRowData(rowData['data'])
          // console.log(rowData['data'])
          const swalInstance = MySwal.fire({
            text: 'Floor Added Successfully!',
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
        else{ const swalInstance = MySwal.fire({
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
        });}
      });
    
    }
  }

  const handleReset = () => {
    reset({
      // hotelID: '',
      floor:'',
      blockID: null
    })
  }
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
  const handleDownload = async () => {
    try {
      const response = await fetch(API_URL2 + '/downloadcsvfile', {
        method: 'GET',
      });

      // let createmarketGroup = JSON.stringify({
      //   "fileName": floor.csv,       
      // })
  
      //   let res = fetchx(API_URL2 + "/downloadcsvfile", {
      //     method: "POST",
      //     headers: { 'Content-Type': 'application/json' },
      //     body: createmarketGroup
      //   }).then(data => data.json())
      //     .then((res) => {
  
      //       setRowData1(res["data"])
      //     });
  
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
      link.download = 'block.csv'; // Set the desired filename
      document.body.appendChild(link);
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
     fileName: 'Floor.xlsx',
     sheetName: 'Sheet1',
   };
   gridRef.current.api.exportDataAsExcel(params);
  };

  return (
    <div>
  
  <div>
        <Modal  isOpen={marketGroup} toggle={() => setMarketGroup(!marketGroup)}className="modal-lg"  >
          <ModalHeader className="modal-lg"toggle={() => setMarketGroup(!marketGroup)} >
           Edit Floor Details
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">            
            <EditFloor data1={filldata} />
          </ModalBody>
        </Modal>
      </div>

      {hotelLive === 0 && (<Card>
      <CardHeader><h4><b> Add Floor</b></h4></CardHeader>
     </Card>)}
      {hotelLive === 0 && ( <p style={{color: "grey"}}> 
      <b><h4> Instructions:  </h4> </b>
      1.Please refer to the sample file before uploading the data. You can access the sample file by clicking the  <b>"Floor File" </b> button. Please ensure that data insertion follows the established pattern.<br/> Kindly refrain from altering the file structure.<br/>
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
    { hotelLive === 1 && (<UncontrolledAccordion>
      <AccordionItem>
      <AccordionHeader targetId='1'><h4><b> Add Floor</b></h4></AccordionHeader>
       <AccordionBody accordionId='1'>  
             <Card>
                  <CardBody>
                   <Form onSubmit={handleSubmit(onSubmit)}>
                     <Row>          
                         <Col md='4' sm='12'>
                       <div className='mb-1'>
                         <Label className='form-label' for='floor'>
                           Floor <spam style={{color:'red'}}>*</spam>
                         </Label>
                         <Controller
                           defaultValue=''
                           control={control}
                           id='floor'
                           name='floor'
                           render={({ field }) => <Input placeholder='Floor'
                             pattern='[0-9]{1,15}'
                             title="Floor can contain numbers . It cannnot contain alphabets and special characters." required
                             invalid={errors.floor && true} {...field} />}
                         />
                       </div>
                     </Col>
                          

                   <Col md='4' sm='12'>
              <div className='mb-1'>
                <Label className='form-label' for='FloorID'>
                BlockID <spam style={{color:'red'}}>*</spam>
                </Label>
                <Controller
                id="blockID"
                control={control}
                name="blockID"
                render={({ field }) => (
                <Select
                required
                  isClearable
                  options={blockID}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  className={classnames("react-select", {
                    "is-invalid": data !== null && data.blockID === null,
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

                {/* Upload Document */}
           
         </AccordionBody>
      </AccordionItem>
      </UncontrolledAccordion>)}
</div>

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
      { hotelLive === 1 && ( <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button>)}
      </div>      
        </Row>       
      </div>

      <br/>
      <br/>

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
  )
}

export default Floor;