// ** React Imports
import { useState } from "react";
import Select from "react-select";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { selectThemeColors } from "@utils";
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input, InputGroupText, InputGroup,Modal,ModalHeader,ModalBody} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useRef, useEffect, useMemo, useCallback } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem,} from "reactstrap";
import API_URL2 from "../../../../config2";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import EditMarketGroup from "./editRoomStatus"
import UploadDocs from "./uploadFile"
import {Edit2} from "react-feather";
const MySwal = withReactContent(Swal)

const colourOptions = [
  { value: "1", label: "Smoking" },
  { value: "0", label: "NonSmoking" },
];

const roomStatus = [
  { value: "Inspected", label: "Inspected" },
  { value: "Dirty", label: "Dirty" },
  { value: "Clean", label: "Clean" },
];

const reservationStatus = [
  { value: "Arrival", label: "Arrival" },
  { value: "Reserved", label: "Reserved" },
  { value: "Not Reserved", label: "Not Reserved" },
  { value: "Checked In", label: "Checked In" },
  { value: "Due Out", label: "Due Out" },
];

const frontOfficeStatus = [
  { value: "Vacant", label: "Vacant" },
  { value: "Occupied", label: "Occupied" },
];

const defaultValues = {
  roomNumber: "",
  roomStatus: null,
  frontOfficeStatus: null,
  reservationStatus: null,
  isActive: null,
  floorID: null,
  smokingType: null,
  roomTypeID: null,
};

let blockID = [
  fetchx(API_URL2 + "/getfloorblockid?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      // console.log(resp['data'])
      blockID = resp["data"];
      // console.log(blockID);
    }),
];

let floorID = [
  fetchx(API_URL2 + "/getRoomFloorID?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      console.log(resp['data'])
      floorID = resp["data"];
      // console.log(floorID);
    }),
];

let roomTypeID = [
  fetchx(API_URL2 + "/getRoomRoomTypeID?hotelID=1")
    .then((result) => result.json())
    .then((resp) => {
      console.log(resp['data'])
      roomTypeID = resp["data"];
      // console.log(roomTypeID);
    }),
];

const RoomManagement = () => {
  const [open, setOpen] = useState("");
  const [popUp, setPopUp] = useState(false);
  const lookupValue = (mappings, key) => {  return mappings[key]}
  const colourMappings = {
    1: 'Active',
    0 : 'Inactive',
  }
  const extractKeys = (mappings) => {
    return Object.keys(mappings)
  }
  const colourCodes = extractKeys(colourMappings)
  const toggle = (id) => { open === id ? setOpen() : setOpen(id);  };
  const [rowData, setRowData] = useState();
  const gridRef = useRef();
  const [marketGroup, setMarketGroup] = useState();
  const [filldata, setfilldata] = useState(" ");

  const EditData = (rowData)=>{
    setfilldata(rowData);
    setMarketGroup(!marketGroup)
  }

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Room No.",
      field: "roomNumber",
      cellStyle: { "text-align": "center", "background-color": "#F1E39B" },
      maxWidth: 125,
    },
    {
      headerName: "Room Status",
      field: "roomStatus",
      cellStyle: { "text-align": "center", "background-color": "pink" },
      maxWidth: 140,
    },
    {
      headerName: "FO Status",
      field: "frontOfficeStatus",
      cellStyle: { "text-align": "center", "background-color": "#F1E39B" },
      suppressSizeToFit: true,
      maxWidth: 140,
    },
    {
      headerName: "Reservation Status",
      field: "reservationStatus",
      cellStyle: { "text-align": "center", "background-color": "pink" },
      maxWidth: 180,
    },
    {
      headerName: "Room Type",
      field: "roomType",
      cellStyle: { "text-align": "center", "background-color": "#F1E39B" },
      maxWidth: 125,
    },
    // {
    //   headerName: "Floor ",
    //   field: "floor",
    //   cellStyle: { "text-align": "center", "background-color": "pink" },
    //   maxWidth: 125,
    // },

    // {headerName: 'Active Status',field: 'isActive',cellStyle: {'text-align': 'center','background-color': '#F1E39B'},maxWidth: 125 },
    {headerName: 'Status', field: 'isActive', cellStyle: { 'text-align': 'center', 'background-color': 'pink' },suppressSizeToFit: true,maxWidth: 150,editable: true,cellEditor: 'agSelectCellEditor', cellEditorParams: {values: colourCodes }, valueFormatter: (params) => { return lookupValue(colourMappings, params.value)},filter: 'agSetColumnFilter'},
    // {headerName: 'Smoking Details',field: 'isSmokingDetails',cellStyle: {'text-align': 'center','background-color': 'pink'},maxWidth: 125 },
    // {
    //   headerName: "Block",
    //   field: "block",
    //   cellStyle: { "text-align": "center", "background-color": "#F1E39B" },
    //   maxWidth: 125,
    // },
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

  const [newActiveStatus, setNewActiveStatus] = useState(null);
          const [roomClass, setRoomClassID] = useState(null);

          const onCellValueChanged = useCallback(event => {
          let isActive=Number(event.data.isActive);
          let OldValue=oldValue  
          let ID=event.data['id']
          const IDNumber = event.data.id;
          setRoomClassID(IDNumber); 
          let newActive = event.data.isActive;
          if (event.data.isActive !== oldValue) {
           const newActiveStatus = event.data.isActive;
           setNewActiveStatus(newActiveStatus); 
           const oldActiveStatus = oldValue;
           setPopUp("Do You  Want to Change Room Status ?");
         } 

          const updatedItem = JSON.stringify({            
             isActive:event.newValue.split("(")[0]
             })
            //  console.log(updatedItem)
             fetchx(API_URL2+ `/updateRoom?id=${event.data.id}`, {
             method: 'PUT',
             body: updatedItem,
             headers: {
             'Content-type': 'application/json'
             }
             })
             .then((res) => res.json())
             .then((post) => {
              // const swalInstance = MySwal.fire({
              //   text: 'Updated Active Status Successfully!',
              //   icon: 'success',
              //   buttonsStyling: false,
              //   confirmButtonText: 'Close',
              //   customClass: {
              //     confirmButton: 'btn btn-danger'
              //   }
              // });
              // swalInstance.then((result) => {
              //   if (result.isConfirmed) {
                  // navigate('');
              //   }
              // }); 
            //  console.log(post)
             })
             .catch((err) => {
            //  console.log(err.message)
             })         
            }, [])

      function Confirm (event){
      const updatedItem = JSON.stringify({
        isActive:newActiveStatus, 
        id:roomClass
      })
      fetchx(API_URL2+ `/updateRoom`, {
      method: 'PUT',
      body: updatedItem,
      headers: {
      'Content-type': 'application/json'
      }
      })
      .then((res) => res.json())
      .then((post) => {
         const swalInstance = MySwal.fire({
          text: 'Updated Active Status Successfully!',
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
      if(post.statusCode === 200){
      setPopUp(false)
      fetchx(API_URL2 + '/room?hotelID=1')
      .then(result => result.json())
      .then(rowData =>{
      })
      }
      })
      .catch((err) => {
      // console.log(err.message)
      })
      }

 
    const [oldValue, setOldValue] = useState(null);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));

  const cellClickedListener = useCallback(event => {
       const currentValue = event.data.isActive;    
      setOldValue(currentValue); // Update the state variable
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

    fetchx(API_URL2 + "/room?hotelID=1")
      .then((result) => result.json())
      .then((rowData) => {
        setRowData(rowData["data"]);
        // console.log(rowData["data"]);
      });
  }, []);

  const {  setError,  formState: { errors },} = useForm();
  const [data, setData] = useState(null);
  const { reset, handleSubmit, control } = useForm({ defaultValues });
  let navigate = useNavigate();  
  const onSubmit = (data) => {
    setData(data);
    if (data.roomNumber !== null ) {
      let createmarketGroup = JSON.stringify({
        roomNumber: data.roomNumber,
        roomStatus:  data.roomStatus === null ? null : data.roomStatus.value,
        frontOfficeStatus: data.frontOfficeStatus === null ? null : data.frontOfficeStatus.value,
        reservationStatus: data.reservationStatus === null ? null : data.reservationStatus.value,
        isActive: 1,
        floorID: data.floorID === null ? null : data.floorID.value,
        isSmoking: data.smokingType === null ? null : data.smokingType.value,
        roomTypeID:  data.roomTypeID === null ? null : data.roomTypeID.value,
      });
      let res = fetchx(API_URL2+"/addRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: createmarketGroup,
      }).then(data => data.json())
      .then((res) => {
        // console.log(res);
        if(res["statuscode"] == 200) {       
           const swalInstance = MySwal.fire({
                text: 'Room Added Successfully!',
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
                   fetchx(API_URL2 + "/room?hotelID=1")
            .then((result) => result.json())
            .then((rowData) => {
              setRowData(rowData["data"]);
              // console.log(rowData["data"]);
      
            });
                  navigate('');
                }
              });
         
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
              navigate('');
            }
          });
        }
      });
    }
  };

  const handleReset = () => {
    reset({
      roomNumber: "",
      roomStatus: null,
      frontOfficeStatus: null,
      reservationStatus: null,
      isActive: null,
      floorID: null,
      smokingType: null,
      roomTypeID: null,
    });
  };

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);

 
  // Download Excel File
  const onBtnExport = () => {
   const params = {
     fileName: 'MarketGroup.xlsx',
     sheetName: 'Sheet1',
   };
   gridRef.current.api.exportDataAsExcel(params);
  };


  return (
    <div>

      
   <div>
        <Modal  isOpen={marketGroup} toggle={() => setMarketGroup(!marketGroup)}className="modal-lg"  >
          <ModalHeader className="modal-lg"toggle={() => setMarketGroup(!marketGroup)} >
           Edit Room Details
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">            
            <EditMarketGroup data1={filldata} />
          </ModalBody>
        </Modal>
      </div>

      {hotelLive === 0 && (<Card>
      <CardHeader><h4><b> Add Rooms</b></h4></CardHeader>
     </Card>)}
      {hotelLive === 0 && ( <p style={{color: "grey"}}> 
      <b><h4> Instructions:  </h4> </b>
      1.Please refer to the sample file before uploading the data. You can access the sample file by clicking the  <b>"Rooms File" </b> button. Please ensure that data insertion follows the established pattern.<br/> Kindly refrain from altering the file structure.<br/>
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

         <div className="disabled-animation-modal">
 <Modal isOpen={popUp} toggle={() => setPopUp(!popUp)} className="modal-sm" > 
 <ModalHeader
 className="modal-sm"
 toggle={() => {
 setPopUp(!popUp);
 }}
 >
 Need To Check..
 </ModalHeader>
 <ModalBody className="pb-3 px-sm-2 mx-20">
 <div>
 <b>{popUp}</b>
 <br></br>
 <br></br>
 <div className="d-flex">
 <Button
 color="primary"
 className="me-1"
 // className="text-center"
 onClick={() => Confirm()}
 >
 Confirm
 </Button>
 <Button
 color="danger"
 className="me-1"
 // className="text-center"
 onClick={() => {
  setPopUp(false) , navigate('');  
}}
 >
 Cancel
 </Button>
 </div>
 </div>
 </ModalBody>
 </Modal>
 </div>
      <div>
      { hotelLive === 1 && (<Accordion open={open} toggle={toggle}>
          <AccordionItem>                   
            <AccordionHeader targetId="1">
             
            <h4> <b>Add Room  </b> </h4> 
            </AccordionHeader>
           
            <AccordionBody accordionId="1">
           
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Room Status</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                      <Col md="4" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="roomNumber">
                            Room Number <spam style={{color:'red'}}>*</spam>
                          </Label>
                          <InputGroup className="input-group-merge">
                            <Controller
                              id="roomNumber"
                              name="roomNumber"
                              control={control}
                              render={({ field }) => (
                                <Cleave
                                // pattern="[0-9]*" title="Type Only Numbers" 
                                required

                                  placeholder="Room Number"
                                  {...field}
                                  className={classnames("form-control", {
                                    "is-invalid":
                                      data !== null &&
                                      (data.roomNumber === null ||
                                        !data.roomNumber.length),
                                  })}
                                />
                              )}
                            />
                          </InputGroup>
                        </div>
                      </Col>
                      <Col md="4" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="roomStatus">
                            Room Status
                          </Label>
                          <Controller
                            id="roomStatus"
                            control={control}
                            name="roomStatus"
                            render={({ field }) => (
                              <Select
                                isClearable
                                options={roomStatus}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  // "is-invalid":
                                    // data !== null && data.roomStatus === null,
                                })}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col md="4" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="frontOfficeStatus">
                            Front Office Status
                          </Label>
                          <Controller
                            id="frontOfficeStatus"
                            control={control}
                            name="frontOfficeStatus"
                            render={({ field }) => (
                              <Select
                                isClearable
                                options={frontOfficeStatus}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  // "is-invalid":
                                    // data !== null &&
                                    // data.frontOfficeStatus === null,
                                })}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col>

                      <Col md="4" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="reservationStatus">
                            Reservation Status
                          </Label>
                          <Controller
                            id="reservationStatus"
                            control={control}
                            name="reservationStatus"
                            render={({ field }) => (
                              <Select
                                isClearable
                                options={reservationStatus}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  // "is-invalid":
                                  //   data !== null &&
                                  //   data.reservationStatus === null,
                                })}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col>
                     
                      <Col md="4" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="floorID">
                            Floor <spam style={{color:'red'}}>*</spam>
                          </Label>
                          <Controller
                            id="floorID"
                            control={control}
                            name="floorID"
                            render={({ field }) => (
                              <Select
                              required
                                isClearable
                                options={floorID}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  // "is-invalid":
                                    // data !== null && data.floorID === null,
                                })}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col>

                      {/* <Col md="4" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="blockID">
                            Block ID
                          </Label>
                          <Controller
                            id="blockID"
                            control={control}
                            name="blockID"
                            render={({ field }) => (
                              <Select
                                isClearable
                                options={blockID}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  // "is-invalid":
                                  //   data !== null && data.blockID === null,
                                })}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col> */}
                      <Col md="4" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="smokingType">
                            Smoking Type <spam style={{color:'red'}}>*</spam>
                          </Label>
                          <Controller
                            id="smokingType"
                            control={control}
                            name="smokingType"
                            render={({ field }) => (
                              <Select
                              required
                                isClearable
                                options={colourOptions}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  "is-invalid":
                                    data !== null && data.smokingType === null,
                                })}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col>

                      <Col md="4" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="roomTypeID">
                            Room Type ID <spam style={{color:'red'}}>*</spam>
                          </Label>
                          <Controller
                            id="roomTypeID"
                            control={control}
                            name="roomTypeID"
                            render={({ field }) => (
                              <Select
                              required
                                isClearable
                                options={roomTypeID}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  // "is-invalid":
                                  //   data !== null && data.roomTypeID === null,
                                })}
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
      { hotelLive === 1 && (<Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button>)}
      </div>      
        </Row>       
      </div>

      <br/>
      <br/>
      <div>
        <Card>
          <div className="ag-theme-alpine" style={{ height: 540 }}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              animateRows={true}
              rowSelection="multiple"
              onCellClicked={cellClickedListener}
            onCellValueChanged={onCellValueChanged}
              // paginationAutoPageSize = 'true'
              paginationPageSize="10"
              pagination="true"
              defaultColDef={defaultColDef}
              headerColor="ddw-primary"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RoomManagement;