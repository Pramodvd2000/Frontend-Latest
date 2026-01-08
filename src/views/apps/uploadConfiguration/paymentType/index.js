import { useState } from "react";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import {Card,CardHeader,Form,Row,Col,Label,Button,CardBody,Input,Modal,ModalHeader,ModalBody,} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import "/node_modules/ag-grid-community/styles/ag-grid.css";
import "/node_modules/ag-grid-community/styles/ag-theme-alpine.css";
import { useRef, useEffect, useMemo, useCallback } from "react";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, } from "reactstrap";
import API_URL2 from "../../../../config2";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import EditMarketGroup from "./editPaymentType"
import UploadDocs from "./uploadFile"
import {Edit2,Search,} from "react-feather";
const defaultValues = {
    paymentType: "",
    description: "",
};

const PaymentTypeCode = () => {
  const [rowData, setRowData] = useState();
  const [popUp, setPopUp] = useState(false);
  const gridRef = useRef();
  const {setError,formState: { errors },  } = useForm();
  const lookupValue = (mappings, key) => {
    return mappings[key];
  };

  const colourMappings = {
    1: "Active",
    0: "Inactive",
  };

  const colourMappings1 = {
    1: "Active",
    0: "Inactive",
  };
  const extractKeys = (mappings) => {
    return Object.keys(mappings);
  };
  const extractKeys1 = (mappings) => {
    return Object.keys(mappings);
  };
  const colourCodes = extractKeys(colourMappings);
  const colourCodes1 = extractKeys1(colourMappings1);

  const [marketGroup, setMarketGroup] = useState();
  const [filldata, setfilldata] = useState(" ");

  const EditData = (rowData)=>{
    setfilldata(rowData);
    setMarketGroup(!marketGroup)
  }
  const [columnDefs, setColumnDefs] = useState([
    { headerName: "Payment Type",  field: "paymentTypeCode",  cellStyle: { "text-align": "center", "background-color": "#F1E39B" },  headerClass: "text-center",  suppressSizeToFit: true,  maxWidth: 180},
    { headerName: "Description",  field: "description",  suppressSizeToFit: true,  cellStyle: { "text-align": "center", backgroundColor: "pink" },  maxWidth: 180,},
    { headerName: "Status", field: "isActive", cellStyle: { "text-align": "center", "background-color": "#F1E39B" }, suppressSizeToFit: true, maxWidth: 150, editable: true, cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: colourCodes },
      valueFormatter: (params) => {
        return lookupValue(colourMappings, params.value);
      },
      filter: "agSetColumnFilter",
    },
    { headerName: "POS Status", field: "isPOS", cellStyle: { "text-align": "center", "background-color": "#F1E39B" }, suppressSizeToFit: true, maxWidth: 150, editable: true, cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: colourCodes1 },
    valueFormatter: (params) => {
      return lookupValue(colourMappings1, params.value);
    },
    filter: "agSetColumnFilter",
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
  ]);
  const [newActiveStatus, setNewActiveStatus] = useState(null);
  const [roomClass, setRoomClassID] = useState(null);
  const onCellValueChanged = useCallback((event) => {
  let isActive = Number(event.data.isActive);
  let OldValue = oldValue;
  let ID = event.data["id"];
  const IDNumber = event.data.id;
  setRoomClassID(IDNumber);
  let newActive = event.data.isActive;
  if (event.data.isActive !== oldValue) {
    const newActiveStatus = event.data.isActive;
    setNewActiveStatus(newActiveStatus);
    const oldActiveStatus = oldValue;
    setPopUp("Do You  Want to Change Payment type Active Status ?");
  }
  const updatedItem = JSON.stringify({
    isActive: event.newValue.split("(")[0],
  });
    fetchx(API_URL2 + `/updateRoomClass?id=${event.data.id}`, {
      method: "PUT",
      body: updatedItem,
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((post) => {})
      .catch((err) => {
      });
  }, []);

  function Confirm(event) {
    const updatedItem = JSON.stringify({
      isActive: newActiveStatus,
      id: roomClass,
    });
    fetchx(API_URL2 + `/updateRoomClass`, {
      method: "PUT",
      body: updatedItem,
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((post) => {
        const swalInstance = MySwal.fire({
          text: "Updated Active Status Successfully!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Close",
          allowOutsideClick: false,
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            navigate("");
          }
        });
        if (post.statusCode === 200) {
          setPopUp(false);
          fetchx(API_URL2 + "/getPaymentType?hotelID=1")
            .then((result) => result.json())
            .then((rowData) => {
            });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function Confirm1(event) {
    const updatedItem = JSON.stringify({
      isActive: newActiveStatus,
      id: roomClass,
    });
    fetchx(API_URL2 + `/updateRoomClass`, {
      method: "PUT",
      body: updatedItem,
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((post) => {
        const swalInstance = MySwal.fire({
          text: "Updated POS Status Successfully!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Close",
          allowOutsideClick: false,
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            navigate("");
          }
        });
        if (post.statusCode === 200) {
          setPopUp(false);
          fetchx(API_URL2 + "/getPaymentType?hotelID=1")
            .then((result) => result.json())
            .then((rowData) => {
            });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const [oldValue, setOldValue] = useState(null);

  const cellClickedListener = useCallback((event) => {
    const currentValue = event.data.isActive;
    setOldValue(currentValue); 
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


    fetchx(API_URL2 + "/getPaymentType?hotelID=1")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData["data"]));
  }, []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
    columnDefs: columnDefs,
    rowData: rowData,
    defaultColDef: {
      headerClass: "text-center",
    },
  }));
  const [data, setData] = useState(null);
  const { reset, handleSubmit, control } = useForm({ defaultValues });
  let navigate = useNavigate();

  const onSubmit = (data) => {
    setData(data);
    if (data.marketCode !== null && data.marketGroupID !== null) {
      let createmarketCode = JSON.stringify({
        paymentType: data.paymentType,
        description: data.description,
        isActive: 1,
        isPOS:0,
        isCard:0,
      });
      let res = fetchx(API_URL2 + "/addPaymentType", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: createmarketCode,
      })
        .then((data) => data.json())
        .then((res) => {
          if (res["statusCode"] == 200) {
            fetchx(API_URL2 + "/getPaymentType?hotelID=1")
              .then((result) => result.json())
              .then((rowData) => {
                setRowData(rowData["data"]);
                const swalInstance = MySwal.fire({
                  text: "Payment Type `Added Successfully!",
                  icon: "success",
                  buttonsStyling: false,
                  confirmButtonText: "Close",
                  allowOutsideClick: false,
                  customClass: {
                    confirmButton: "btn btn-danger",
                  },
                });
                swalInstance.then((result) => {
                  if (result.isConfirmed) {
                    navigate("");
                  }
                });
              });
          } else {
            const swalInstance = MySwal.fire({
              text: res.message,
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Close",
              allowOutsideClick: false,
              customClass: {
                confirmButton: "btn btn-danger",
              },
            });
            swalInstance.then((result) => {
              if (result.isConfirmed) {
                navigate("");
              }
            });
          }
        });
    }
  };

  const handleReset = () => {
    reset({
      // hotelID: '',
      paymentType: "",
      description: "",
    //   isActive: null,
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
     fileName: 'PaymentType.xlsx',
     sheetName: 'Sheet1',
   };
   gridRef.current.api.exportDataAsExcel(params);
  };



  return (
    <div>
    
    <div>
        <Modal  isOpen={marketGroup} toggle={() => setMarketGroup(!marketGroup)}className="modal-lg"  >
          <ModalHeader className="modal-lg"toggle={() => setMarketGroup(!marketGroup)} >
           Edit Payment Type Details
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">            
            <EditMarketGroup data1={filldata} />
          </ModalBody>
        </Modal>
      </div>

      {hotelLive === 0 && (<Card>
      <CardHeader><h4><b> Add Payment Type</b></h4></CardHeader>
     </Card>)}
      {hotelLive === 0 && ( <p style={{color: "grey"}}> 
      <b><h4> Instructions:  </h4> </b>
      1.Please refer to the sample file before uploading the data. You can access the sample file by clicking the  <b>"Payment Type File" </b> button. Please ensure that data insertion follows the established pattern.<br/> Kindly refrain from altering the file structure.<br/>
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

    {/* Change Active Status Modal */}
      <div className="disabled-animation-modal">
        <Modal  isOpen={popUp}  toggle={() => setPopUp(!popUp)}  className="modal-sm" >
          <ModalHeader className="modal-sm" toggle={() => {   setPopUp(!popUp); }}  >
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
                    setPopUp(false), navigate("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>

      {/* Change POS Status Modal */}
      <div className="disabled-animation-modal">
        <Modal  isOpen={popUp}  toggle={() => setPopUp(!popUp)}  className="modal-sm" >
          <ModalHeader className="modal-sm" toggle={() => {   setPopUp(!popUp); }}  >
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
                  onClick={() => Confirm1()}
                >
                  Confirm
                </Button>
                <Button
                  color="danger"
                  className="me-1"
                  // className="text-center"
                  onClick={() => {
                    setPopUp(false), 
                    navigate("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>

       {/* Payment Type Form */}
      <div>
        { hotelLive === 1 && (<UncontrolledAccordion>
          <AccordionItem>
            <AccordionHeader targetId="1">
              <h4>
                <b>Add Payment Type </b>
              </h4>
            </AccordionHeader>
            <AccordionBody accordionId="1">
           
              <Card>
                <CardBody>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                      <Col md="6" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="paymentType">
                            Payment Type <spam style={{ color: "red" }}>*</spam>
                          </Label>
                          <Controller
                            defaultValue=""
                            control={control}
                            id="paymentType"
                            name="paymentType"
                            render={({ field }) => (
                              <Input
                                // pattern="[a-zA-Z ]*" title="Type Only Alphabets"
                                required
                                placeholder="Payment Type"
                                invalid={errors.paymentType && true}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col md="4" sm="12">
                        <div className="mb-1">
                          <Label className="form-label" for="description">
                            Description <spam style={{ color: "red" }}>*</spam>
                          </Label>
                          <Controller
                            defaultValue=""
                            control={control}
                            id="description"
                            name="description"
                            render={({ field }) => (
                              <Input
                                placeholder="Description"
                                required
                                invalid={errors.description && true}
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
        </UncontrolledAccordion>)}
      </div>
      <br></br>

     {/* Payment Type Search */}

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

     {/* Payment Type Ag Grid */}
 
    <div className="ag-theme-alpine" style={{ height: 540 }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        animateRows={true}
        rowSelection="multiple"
        onCellClicked={cellClickedListener}
        onCellValueChanged={onCellValueChanged}
        paginationPageSize="10"
        pagination="true"
        defaultColDef={defaultColDef}
        headerColor="ddw-primary"
      />
    </div>
 
    </div>
  );
};
export default PaymentTypeCode;