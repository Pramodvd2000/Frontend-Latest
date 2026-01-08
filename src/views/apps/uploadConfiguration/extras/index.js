import { useState } from "react";
import Select from "react-select";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { selectThemeColors } from "@utils";
import {Input,Card,Form,Label,Button,CardBody,CardTitle,CardHeader,InputGroup,InputGroupText,Row,Col,Modal,ModalHeader,ModalBody, } from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import { useRef, useEffect, useMemo, useCallback} from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem,UncontrolledAccordion } from 'reactstrap'
import API_URL2 from "../../../../config2";
const id = '1';
import ExtraGroupMapping from "./datagrid"
import EditMarketGroup from "./editExtras"
import UploadDocs from "./uploadFile"
import {Edit2,Search,} from "react-feather";
const typeOptions = [
  { value: 'Percentage', label: 'Percentage' },
  { value: 'Amount', label: 'Amount' },
  { value: 'Pieces', label: 'Pieces' },
  { value: 'Trips', label: 'Trips' },
]

let groupsOption = [
  fetchx(API_URL2 + '/getforeignkeygroupid?hotelID=1')
    .then(result => result.json())
    .then(resp => {
      groupsOption = resp['data']
    })
  ]

  let subGroupOptions = [
    fetchx(API_URL2 + '/getforeignkeysubgroup?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        subGroupOptions = resp['data']
      })
    ]


const defaultValues = {
  // hotelID: "",
      extraCode: '',
      description: "",
      remarks: "",
      type: null,
      percentage: "",
      amount: "",
      pieces: '',
      trips: "",
      isActive: null
};

const Extras = () => {
  const [open, setOpen] = useState('')
  const toggle = id => {open === id ? setOpen() : setOpen(id)}
  let navigate = useNavigate();  
  const [selectedValue, setSelectedOption] = useState('');
  const [rowData, setRowData] = useState();
  const [extraData, setExtraData] = useState();
  const gridRef = useRef();
  const [show, actionButton] = useState(false);
  const [data, setData] = useState(null);
  const [value, setValue] = useState('')
  const { reset, handleSubmit, control ,formState: { errors }} = useForm({ defaultValues });
  const [filldata, setfilldata] = useState({});

  const handleDropdownChange = (event) => {
    setSelectedOption(event.value);

    if (selectedValue == 'Percentage') {
        //         setitemOptions([{ value: "1", label: "Active" }]) 
    }
    else if (selectedValue == 'Amount') {
        
        //         setitemOptions([{ value: "1", label: "Active" }]) 
    }
    else if (selectedValue == 'Pieces') {
      
      //         setitemOptions([{ value: "1", label: "Active" }]) 
  }
    else if (selectedValue == 'Trips') {
        
        //         setitemOptions([{ value: "1", label: "Active" }]) 
    }
    else  {
        
        //         setitemOptions({ value: "0", label: "InActive" })
    }
};


    const [marketGroup, setMarketGroup] = useState();

  const EditData = (rowData)=>{
    setfilldata(rowData);
    setMarketGroup(!marketGroup)
  }
  const [columnDefs, setColumnDefs] = useState([
    {headerName: 'Extra Code',field: 'extraCode',suppressSizeToFit: true,cellStyle: {'text-align': 'center','background-color': '#F1E39B'}, maxWidth: 140 },
    {headerName: 'Description',field: 'description',suppressSizeToFit: true,cellStyle: {'text-align': 'center','background-color': 'pink'}, maxWidth: 140 },
    {headerName: 'Type',field: 'type',suppressSizeToFit: true,cellStyle: {'text-align': 'center','background-color': '#F1E39B'}, maxWidth: 140 },
    {
      headerName: "Action",field: "numAvlRooms",suppressSizeToFit: true, maxWidth: 120,
      cellRendererFramework: (params) => (
        <Button color="primary" onClick={() => actionButton(!show)}> View  </Button> ),
    },
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
    // {headerName: 'Percentage',field: 'percentage'},
    // {headerName: 'Amount',field: 'amount'},
    // {headerName: 'Pieces',field: 'pieces'},
    // {headerName: 'Trips',field: 'trips'},
    // {headerName: 'Is Active',field: 'isActive',suppressSizeToFit: true,cellStyle: {'text-align': 'center','background-color': 'pink'}, maxWidth: 140 },
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
    console.log(event["data"])
    setExtraData(event['data'])
    setfilldata(event['data']['id'])
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

    fetchx(API_URL2 + '/getextra?hotelID=1')
    .then(result => result.json())
    .then(rowData => {
      setRowData(rowData['data'])
    })
  }, []); 


  const onSubmit = (data) => { 
    const groupsData = data.groups.map(group => group.value);
    const subGroupData = data.subgroups.map(group => group.value);  

    setData(data);
    data['type']=selectedValue
      if (data.extraCode !== null  ) {
      let createExtra = JSON.stringify({
        "extraCode": data.extraCode,
        "description": data.description,
        "remarks": data.remarks,
        "type": data.type,
        "percentage": data.percentage,
        "amount": data.amount,
        "pieces": data.pieces,
        "trips": data.trips,
        "isActive":1,
        "groupsData": groupsData,
        "subGroupData":  (subGroupData !== undefined) ? subGroupData : null,
        "isAllOutlets":(data.subgroups !== undefined) ? 0 : 1,
        "hotelID": data.hotelID,
      });

      let res = fetchx(API_URL2 + "/addextra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: createExtra,
      }).then((res) => {
        // navigate('');
        // if(res['status']==200){
        //   fetchx(API_URL2 + '/getextra?hotelID='+id)
        //   .then(result => result.json())
        //   .then(rowData => {setRowData(rowData['data'])
        // })
        // }      
            console.log(res)
            if(res.status==200){
          const swalInstance = MySwal.fire({
            text: 'Extras Added Successfully!',
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

          fetchx(API_URL2 + '/getextra?hotelID='+id)
          .then(result => result.json())
          .then(rowData => {setRowData(rowData['data'])
        })

          // if(data.taxPercentage.length >= 1){
            //console.log(data.taxPercentage.length)
            // setTimeout(() => {            
            // for(let i=0;i<data.taxPercentage.length;i++){
              //console.log(data.taxPercentage[i].value)
              //console.log(rowData)
              //console.log(rowData.length)
              //console.log(rowData['data'])

              //console.log(rowData['data'][0]['id'])
             
            //  let createtax = JSON.stringify({
            //    "transactionCodeID": rowData['data'][0]['id'],
            //    "taxID": data.taxPercentage[i].value
               
            //  });
            //  //console.log(createtax)
            //  let res = fetchx(API_URL2 + "/addtransactioncodetaxes", {
            //       method: "POST",
            //       headers: { "Content-Type": "application/json" },
            //       body: createtax,
            //     }).then((res) => {
            //       //console.log(res);
            //     })
  
          // }
        // }

    
        }
      });
      
    }
  };

  const handleChange = event => {
    setValue(event.target.value)
  }

  const handleReset = () => {
    reset({
      // hotelID: "",
      extraCode: '',
      description: "",
      // groupID: null,
      // subGroupID: null,
      remarks: "",
      type: null  ,
      percentage: "",
      amount: "",
      pieces: '',
      trips: "",
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
     fileName: 'Extras.xlsx',
     sheetName: 'Sheet1',
   };
   gridRef.current.api.exportDataAsExcel(params);
  };


  return (
    <div>
      
   <div>
        <Modal  isOpen={marketGroup} toggle={() => setMarketGroup(!marketGroup)}className="modal-lg"  >
          <ModalHeader className="modal-lg"toggle={() => setMarketGroup(!marketGroup)} >
           Edit Extras Details
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">            
            <EditMarketGroup data1={filldata} />
          </ModalBody>
        </Modal>
      </div>

      {hotelLive === 0 && (<Card>
      <CardHeader><h4><b> Add Extras</b></h4></CardHeader>
     </Card>)}
      {hotelLive === 0 && ( <p style={{color: "grey"}}> 
      <b><h4> Instructions:  </h4> </b>
      1.Please refer to the sample file before uploading the data. You can access the sample file by clicking the  <b>"Extras File" </b> button. Please ensure that data insertion follows the established pattern.<br/> Kindly refrain from altering the file structure.<br/>
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



{/* View Modal */}
   <Card>
        <Modal
          isOpen={show}
          toggle={() => actionButton(!show)}
          className="modal-lg">
          <ModalHeader toggle={() => actionButton(!show)}>         
          Extra Code Details Information...
          </ModalHeader>
          <ModalBody>
            <div>
              {/* <div className="d-flex">
                <Button className="me-1" style={{ marginLeft: "auto" }} color="primary" onClick={() => {filldata.length != 0 && editButton(!showEdit); }} >
                  Edit
                </Button>
              </div> */}
              <Card>
                <div>                  
                    <p><b><center>View Details</center> </b> </p>                  
                  <Row>
                   
                    <Col>
                      <Col>
                        <Row>
                          <Col>
                            <div className="mb-1">
                            <Row>
                            <UncontrolledAccordion defaultOpen='1'>
                                <AccordionItem>
                    <AccordionHeader
                      style={{ backgroundColor: "#F2E5D9" }}
                      targetId="1"
                    >
                      <b>  Extra  Details </b>
                       </AccordionHeader>
                       <AccordionBody accordionId="1">
                       
                      <Row>
                      <Col>
                          <div>
                            <br></br>
                            <Row>
                              <Col>
                              { extraData&& <h6>Extra Code:<b> {extraData["extraCode"]} </b></h6>}
                              </Col>
                              <Col>
                              { extraData&& <h6>Description:<b>{extraData["description"]}</b></h6>}
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                              { extraData&& <h6>Type:       <b>{extraData["type"]} </b></h6>}
                              </Col>
                              <Col>
                              { extraData&& <h6>Remarks:<b>{extraData["remarks"]}</b></h6>}
                              </Col>
                            </Row>
                            <Row>
                            <Col>
                            { extraData&& <h6>Percentage:<b> {extraData["percentage"]} </b></h6>}                           
                            </Col> 
                            <Col>
                            { extraData&& <h6>Amount:<b>{extraData["amount"]}</b></h6>}
                            </Col> 
                            <Col>
                            { extraData&& <h6>Pieces:       <b>{extraData["pieces"]} </b></h6>}
                            </Col>  
                            </Row>         
                         </div>
                        </Col>
                      </Row>

                      
 
                      </AccordionBody>
                     </AccordionItem>
                   </UncontrolledAccordion>
                    </Row>  
                            </div>
                          </Col>
                        </Row>
                      </Col>

                      <br></br>
                      <Col>
                        <Row>
                          <Col>
                            <div className="mb-1">
                              <UncontrolledAccordion >
                                <AccordionItem>
                                  <AccordionHeader
                                    style={{ backgroundColor: "#F2E5D9" }}
                                    targetId="1"
                                  >
                                    <b> Mapping Details</b>
                                  </AccordionHeader>
                                  <AccordionBody accordionId="1">
                                  <ExtraGroupMapping data1={filldata}/>
                                  </AccordionBody>
                                </AccordionItem>
                              </UncontrolledAccordion>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <br></br>
                    </Col>
                  </Row>
                </div>
              </Card>
            </div>
          </ModalBody>
        </Modal>
      </Card>



       <div>
  {hotelLive === 1 && (  <Accordion open={open} toggle={toggle}>
      <AccordionItem>
        <AccordionHeader targetId='1'><h4><b>Add Extras </b> </h4></AccordionHeader>
        <AccordionBody accordionId='1'>
              <Card>
      <CardHeader>
        <CardTitle tag="h4">Extras</CardTitle>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>       
          <Col md='3' sm='12' className='mb-1'>
            <div className='mb-1'>
             
            <Label className='form-label' for='extraCode'>
              Extra Code
            </Label>
            <InputGroup className="input-group-merge">
            <Controller
              defaultValue=''
              control={control}
              id='extraCode'
              name='extraCode'
              render={({ field }) => <Input required placeholder="Extra Code" className={classnames({
                "is-invalid": data !== null && (data.extraCode === null || !data.extraCode.length)
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
         
          <Col md='3' sm='12' className='mb-1'>
            <div className='mb-1'>
            <Label className='form-label' for='remarks'>
              Remarks
            </Label>
            <InputGroup className="input-group-merge">
            <Controller
              defaultValue=''
              control={control}
              id='remarks'
              name='remarks'
              render={({ field }) => <Input placeholder="Remarks" className={classnames({
                "is-invalid": data !== null && (data.remarks === null || !data.remarks.length)
              })} {...field}/>}
            />
            </InputGroup>
          </div>
          </Col>

             <Col md='3' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="type">
            type
            </Label>
            <Controller
                  id='type'
                  control={control}
                  name='type'
                  render={({ field }) => (
                    <Select
                      name="type"
                      className="react-select"
                      options={typeOptions}
                      classNamePrefix='select'
                      theme={selectThemeColors}
                      // className={classnames('react-select', { 'is-invalid': data !== null && data.type === null })}
                      
                      isClearable
                      onChange={handleDropdownChange}
                      
                    />
                  )}
                />
          </div>
          </Col>
          {selectedValue === 'Percentage' && (
          <Col md='3' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="percentage">
             Percentage
            </Label>
            <InputGroup className="input-group-merge">
              <InputGroupText
                className={classnames({
                  "is-invalid": data !== null && (data.percentage === null || !data.percentage.length)
                })}
              ></InputGroupText>
              <Controller
                id="percentage"
                name="percentage"
                control={control}
                render={({ field }) => (
                  <Cleave
                  // pattern="[0-9]*" title="Type Only Numbers"
                  placeholder="Percentage"
                    {...field}
                    className={classnames("form-control", {
                      "is-invalid":
                        data !== null && (data.percentage === null || !data.percentage.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          )}
          {selectedValue === 'Amount' && (
          <Col md='3' sm='12' className='mb-1'>
          <div className='mb-1'>
            <Label className='form-label' for='amount'>
            Amount
            </Label>
            <InputGroup className='input-group-merge'>
              <InputGroupText
                className={classnames({
                  'is-invalid': data !== null && (data.amount=== null || !data.amount.length)
                })}
              >
              </InputGroupText>
              <Controller
                id='amount'
                name='amount'
                control={control}
                render={({ field }) => (
                  <Cleave
                 // pattern="[0-9]*" title="Type Only Numbers"
                  placeholder='Amount'
                    {...field}
                    className={classnames('form-control', {
                      'is-invalid': data !== null && (data.amount === null || !data.amount.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          )}
          {selectedValue === 'Pieces' && (
          <Col md='3' sm='12' className='mb-1'>
          <div className='mb-1'>
            <Label className='form-label' for='pieces'>
            Pieces
            </Label>
            <InputGroup className='input-group-merge'>
              <InputGroupText
                className={classnames({
                  'is-invalid': data !== null && (data.pieces=== null || !data.pieces.length)
                })}
              >
              </InputGroupText>
              <Controller
                id='pieces'
                name='pieces'
                control={control}
                render={({ field }) => (
                  <Cleave
                  placeholder='Pieces'
                    {...field}
                    className={classnames('form-control', {
                      'is-invalid': data !== null && (data.pieces === null || !data.pieces.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          )}
          {selectedValue === 'Trips' && (
          <Col md='3' sm='12' className='mb-1'>
          <div className='mb-1'>
            <Label className='form-label' for='trips'>
            Trips
            </Label>
            <InputGroup className='input-group-merge'>
              <InputGroupText
                className={classnames({
                  'is-invalid': data !== null && (data.trips=== null || !data.trips.length)
                })}
              >
              </InputGroupText>
              <Controller
                id='trips'
                name='trips'
                control={control}
                render={({ field }) => (
                  <Cleave
                  placeholder='Trips'
                    {...field}
                    className={classnames('form-control', {
                      'is-invalid': data !== null && (data.trips === null || !data.trips.length)
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>
          )}
          
          <Col md="3" sm="12">
                  <div className="mb-1">
                    <Label className="form-label" for="groups">
                      Select Groups
                    </Label>
                    <Controller
                      id="groups"
                      control={control}
                      name="groups"
                      render={({ field }) => (
                        <Select
                          isMulti
                          isClearable
                          options={groupsOption}
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          className={classnames("react-select")}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col md="3" sm="12">
                  <div className="mb-1">
                    <Label className="form-label" for="subgroups">
                      Select Sub Groups
                    </Label>
                    <Controller
                      id="subgroups"
                      control={control}
                      name="subgroups"
                      render={({ field }) => (
                        <Select
                          isMulti
                          isClearable
                          options={subGroupOptions}
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          className={classnames("react-select")}
                          {...field}
                        />
                      )}
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
        {/* <Button className='me-1' outline color='secondary' onClick={() => handleDownload('origin.csv')}>Extras File</Button> */}
        {hotelLive === 1 && (<Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button>)}
      </div>      
        </Row>       
      </div>

      <br/>
      <br/>
  {/* AG Grid */}
    <div className="ag-theme-alpine" style={{ height: 540}}>
        <AgGridReact 
            ref={gridRef}
            rowData={rowData} columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            paginationPageSize= '10'
            pagination = 'true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            
            />
      </div>
  
    </div>
  );
};

export default Extras;