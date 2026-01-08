import React, { useState } from "react";
import {
  Card,
  Form,
  Row,
  Col,
  Label,
  Button,
  CardBody,
  Input,
  InputGroup,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import "/node_modules/ag-grid-community/styles/ag-grid.css";
import "/node_modules/ag-grid-community/styles/ag-theme-alpine.css";
import { useRef, useEffect, useMemo, useCallback } from "react";
import API_URL from "../../../config.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import EditBlock from "./editBlock";
const MySwal = withReactContent(Swal);
import Select from "react-select";
import { selectThemeColors } from "@utils";
import classnames from "classnames";
import StewardMappedData from "./completedRequest.js";
import ServiceStatusModal from "./pendingRequest.js"


const defaultValues = {
  storeid: null,
  tableid: null,
  stewardID: null
};


const NewTabContent = ({ activeTab }) => {
  let navigate = useNavigate();
  const gridRef = useRef();
  // const [username, setUsername] = useState('');
  const [usersType, setUsersType] = useState();
  const [restaurantOptions, setRestaurantOptions] = useState([]);
 
  const [rowData, setRowData] = useState();
  const [show, actionButton] = useState(false);
  const [tableID, settableID] = useState();

  const [status,setStatus ] = useState();

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: true,
    };
  }, []);

  useEffect(() => {
    if (activeTab === '2') {
      fetchx(API_URL + "/getWhatsappServiceRequests")
        .then((result) => result.json())
        .then((rowData) => {
          const filteredData = rowData["data"].filter(
            (item) => item.status === "Completed"
          );
          setRowData(filteredData);
        });
    }
  }, [activeTab]);

  

  const handleUpdateSuccess = () => {
    actionButton(false); 
    fetchx(API_URL + "/getWhatsappServiceRequests")
      .then((result) => result.json())
      .then((rowData) => {
        setRowData(rowData["data"]); 
      })
      .catch((error) => {
        console.error("Error fetching updated data:", error);
      });
    
  
  };
  

  useEffect(() => {
    const fetchxRestaurantData = async () => {
      try {
        const response = await fetchx(API_URL + "/getGuestComplaintDepartmentOptions");
        const responseData = await response.json();

        if (
          responseData.status === "success" &&
          Array.isArray(responseData.data)
        ) {

          // console.log("responseData.data",responseData.data)
          setRestaurantOptions(
            responseData.data.map((restaurant) => ({
              value: restaurant.value,
              label: restaurant.label,
            }))
          );
        } else {
          console.error("Invalid or unsuccessful response: ", responseData);
        }
      } catch (error) {
        console.error("Error fetchxing restaurant data:", error);
      }
    };

    fetchxRestaurantData();
  }, []);



  useEffect(() => {
    fetchx(API_URL + "/getallstewardlist")
      .then((result) => result.json())
      .then((namedata) => {
        setUsersType(
          namedata.data.map((steward) => ({
            value: steward.user_id,
            label: steward.stewardName,
          }))
        );
      
      });
  }, []);
  


  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Department",
      field: "departmentName",
      cellStyle: { "text-align": "center" },
      headerClass: "text-center",
      maxWidth: 180,
      floatingFilter: true,
      suppressHeaderFilterButton: true,
    },
    {
      headerName: "Room No.",
      field: "roomNumber",
      cellStyle: { "text-align": "center" },
      headerClass: "text-center",
      maxWidth: 120,
      floatingFilter: true,
      suppressHeaderFilterButton: true,
    },
    {
      headerName: "Requested Items",
      field: "requestedItems",
      cellStyle: { 
        textAlign: "center", 
        whiteSpace: "normal"
      },
      wrapText: true,
      autoHeight: true, 
    },
    {
      headerName: "Status",
      field: "status",
      cellStyle: { "text-align": "center" },
      headerClass: "text-center",
      maxWidth: 120,
      cellRendererFramework: (params) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'Completed':
              return '#32CD32'; // Yellow
            default:
              return '#6C757D'; // Default gray
          }
        };

        return (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}>
            <div
              style={{
                backgroundColor: getStatusColor(params.value),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '16px',
                width: '100px', // Fixed width for all status buttons
                textAlign: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}
            >
              {params.value}
            </div>
          </div>
        );
      },
    },
    {
      headerName: "Comments",
      field: "comments",
      cellStyle: { "text-align": "center" },
      headerClass: "text-center",
      width: 180,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: "Completed By",
      field: "completedBy",
      cellStyle: { "text-align": "center" },
      headerClass: "text-center",
      maxWidth: 160,
      floatingFilter: true,
      suppressHeaderFilterButton: true,
    },
    {
      headerName: "Requested On",
      field: "createdAt",
      cellStyle: { textAlign: "center", whiteSpace: "normal" }, // Ensures wrapping
      headerClass: "text-center",
      maxWidth: 120,
      wrapText: true,
      autoHeight: true,
      autoHeaderHeight: true,
      wrapHeaderText: true,
      floatingFilter: true,
      suppressHeaderFilterButton: true,
      cellRendererFramework: (params) => {
        if (!params.value) return ""; // Handle empty values
    
        const dateObj = new Date(params.value);
        const formattedDate = dateObj
          .toLocaleDateString("en-GB") // Converts to dd-mm-yyyy
          .replace(/\//g, "-"); // Ensure format consistency
    
        const formattedTime = dateObj.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
    
        return (
          <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            {formattedDate} {formattedTime}
          </div>
        );
      },
    },
   
  ]);

  // const defaultColDef = useMemo(() => ({
  //   sortable: true,
  //   filter: true,
  //   filterParams: {
  //     buttons: ["apply", "reset"],
  //   },
  // }));

  
  const handleCancel = () => {
    // setUsername('');
  };

  
  const { reset, control,handleSubmit } = useForm({ defaultValues })


  return (
    <div>
      
      <br />
      <div className="ag-theme-alpine" style={{ height: 700 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection="multiple"
         // onCellClicked={cellClickedListener}
          // paginationAutoPageSize = 'true'
          paginationPageSize="10"
          pagination="true"
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
        />
      </div>
      <Modal
            isOpen={show}
            toggle={() => actionButton(!show)}
            className="modal-lg"
          >
            <ModalHeader
              className="modal-lg"  
              toggle={() => {
                actionButton(!show);
              }}
            >
              Update Table..
            </ModalHeader>
            <ModalBody className="pb-3 px-sm-2 mx-20">
              <StewardMappedData data1={tableID} currentStatus={status} onUpdateSuccess={handleUpdateSuccess} onCancel={handleCancel} />
            </ModalBody>
          </Modal>

    </div>
  );
};

const PendingRequestTab = () => {
  const [activeTab, setActiveTab] = useState('1');
  //console.log("active tab",activeTab)
  //console.log()
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  };
  

  const gridRef = useRef();
  const { reset, handleSubmit, control } = useForm({ defaultValues: defaultValues });
  let navigate = useNavigate();
  
  const [usersType, setUsersType] = useState();
  const [restaurantOptions, setRestaurantOptions] = useState([]);
 
  const [rowData, setRowData] = useState();

  console.log("rowData",rowData)
  const [show, actionButton] = useState(false);
  const [tableID, settableID] = useState();
  const [status,setStatus ] = useState();


  useEffect(() => {
    fetchx(API_URL + "/getWhatsappServiceRequests")
      .then((result) => result.json())
      .then((rowData) => {
        const filteredData = rowData["data"].filter(
          (item) => item.status !== "Completed"
        );
        setRowData(filteredData);
      });
  }, []);
  

  useEffect(() => {
    const fetchxRestaurantData = async () => {
      try {
        const response = await fetchx(API_URL + "/getGuestComplaintDepartmentOptions");
        const responseData = await response.json();

        if (
          responseData.status === "success" &&
          Array.isArray(responseData.data)
        ) {

          //console.log("responseData.data",responseData.data)
          setRestaurantOptions(
            responseData.data.map((restaurant) => ({
              value: restaurant.value,
              label: restaurant.label,
            }))
          );
        } else {
          console.error("Invalid or unsuccessful response: ", responseData);
        }
      } catch (error) {
        console.error("Error fetchxing restaurant data:", error);
      }
    };

    fetchxRestaurantData();
  }, []);


  
  useEffect(() => {
    fetchx(API_URL + "/getallstewardlist")
      .then((result) => result.json())
      .then((namedata) => {
        setUsersType(
          namedata.data.map((steward) => ({
            value: steward.user_id,
            label: steward.stewardName,
          }))
        );
      
      });
  }, []);

  const handleCancel = () => {
    actionButton(false);  
  };

  const handleUpdateSuccess = () => {
    actionButton(false);
    fetch(API_URL + "/getWhatsappServiceRequests")
      .then((result) => result.json())
      .then((rowData) => {
        const filteredData = rowData["data"].filter(
          (item) => item.status !== "Completed"
        );
        setRowData(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching updated data:", error);
      });
  };
  
  
  const getUserLevel = (params) => {
    console.log(params.data);
    if (params && params.data) {
      settableID(params.data.id);
      setStatus(params.data.status);
      actionButton(!show);
    } else {
      console.warn('Params.data is missing or undefined');
    }
  };

 

  // const [columnDefs, setColumnDefs] = useState([
  //   {
  //     headerName: "Department",
  //     field: "departmentName",
  //     cellStyle: { "text-align": "center" },
  //     headerClass: "text-center",
  //     maxWidth: 180,
  //     floatingFilter: true,
  //     suppressHeaderFilterButton: true,
  //   },
    
  //   {
  //     headerName: "Room No.",
  //     field: "roomNumber",
  //     cellStyle: { "text-align": "center" },
  //     headerClass: "text-center",
  //     maxWidth: 120,
  //     floatingFilter: true,
  //     suppressHeaderFilterButton: true,
  //   },
  //   {
  //     headerName: "Requested Items",
  //     field: "requestedItems",
  //     cellStyle: { 
  //       textAlign: "center", 
  //       whiteSpace: "normal"
  //     },
  //     wrapText: true,
  //     autoHeight: true, 
  //     floatingFilter: true,
  //     suppressHeaderFilterButton: true,
  //   },
  //   {
  //     headerName: "Status",
  //     field: "status",
  //     cellStyle: { "text-align": "center" },
  //     headerClass: "text-center",
  //     maxWidth: 120,
  //     floatingFilter: true,
  //     suppressHeaderFilterButton: true,
  //     cellRendererFramework: (params) => {
  //       const getStatusColor = (status) => {
  //         switch (status) {
  //           case 'In Progress':
  //             return '#FFC107'; // Yellow
  //           case 'Open':
  //             return '#DC3545'; // Red
  //           default:
  //             return '#6C757D'; // Default gray
  //         }
  //       };
  
  //       return (
  //         <div style={{
  //           display: 'flex',
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           height: '100%'
  //         }}>
  //           <div
  //             style={{
  //               backgroundColor: getStatusColor(params.value),
  //               color: 'white',
  //               padding: '4px 12px',
  //               borderRadius: '16px',
  //               width: '100px', // Fixed width for all status buttons
  //               textAlign: 'center',
  //               fontSize: '0.875rem',
  //               fontWeight: '500',
  //               whiteSpace: 'nowrap'
  //             }}
  //           >
  //             {params.value}
  //           </div>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     headerName: "Comments",
  //     field: "comments",
  //     cellStyle: { "text-align": "center" },
  //     headerClass: "text-center",
  //     width: 180,
  //     wrapText: true,
  //     autoHeight: true,
  //   },
  //   {
  //     headerName: "Assigned To",
  //     field: "attendedBy",
  //     cellStyle: { "text-align": "center" },
  //     headerClass: "text-center",
  //     maxWidth: 160,
  //     floatingFilter: true,
  //     suppressHeaderFilterButton: true,
  //   },
  
  //   {
  //     headerName: "Requested On",
  //     field: "createdAt",
  //     cellStyle: { textAlign: "center", whiteSpace: "normal" }, // Ensures wrapping
  //     headerClass: "text-center",
  //     maxWidth: 120,
  //     wrapText: true,
  //     autoHeight: true,
  //     autoHeaderHeight: true,
  //     wrapHeaderText: true,
  //     floatingFilter: true,
  //     suppressHeaderFilterButton: true,
  //     cellRendererFramework: (params) => {
  //       if (!params.value) return ""; // Handle empty values
    
  //       const dateObj = new Date(params.value);
  //       const formattedDate = dateObj
  //         .toLocaleDateString("en-GB") // Converts to dd-mm-yyyy
  //         .replace(/\//g, "-"); // Ensure format consistency
    
  //       const formattedTime = dateObj.toLocaleTimeString("en-GB", {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //         second: "2-digit",
  //       });
    
  //       return (
  //         <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
  //           {formattedDate} {formattedTime}
  //         </div>
  //       );
  //     },
  //   },
    
  
  //   {
  //     headerName: "Action",
  //     field: "action",
  //     suppressSizeToFit: true,
  //     maxWidth: 150,
  //     cellRendererFramework: (params) => {
  //       // Check if department is one of the specified departments
  //       const disableButton = ["Housekeeping", "Laundry", "Hotel"].includes(params.data.departmentName);
        
  //       return (
  //         <Button 
  //           color="primary" 
  //           onClick={() => getUserLevel(params)} 
  //           disabled={disableButton}
  //         >
  //           Action
  //         </Button>
  //       );
  //     },
  //   },
  // ]);
  
  
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Department",
      field: "departmentName",
      cellStyle: { "text-align": "center" },
      headerClass: "text-center",
      maxWidth: 180,
      floatingFilter: true,
      suppressHeaderFilterButton: true,
    },
    
    {
      headerName: "Room No.",
      field: "roomNumber",
      cellStyle: { "text-align": "center" },
      headerClass: "text-center",
      maxWidth: 120,
      floatingFilter: true,
      suppressHeaderFilterButton: true,
    },
    {
      headerName: "Requested Items",
      field: "requestedItems",
      cellStyle: { 
        textAlign: "center", 
        whiteSpace: "normal"
      },
      wrapText: true,
      autoHeight: true, 
      floatingFilter: true,
      suppressHeaderFilterButton: true,
    },
    {
      headerName: "Status",
      field: "status",
      cellStyle: { "text-align": "center" },
      headerClass: "text-center",
      maxWidth: 120,
      floatingFilter: true,
      suppressHeaderFilterButton: true,
      cellRendererFramework: (params) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'In Progress':
              return '#FFC107'; // Yellow
            case 'Open':
              return '#DC3545'; // Red
            default:
              return '#6C757D'; // Default gray
          }
        };
  
        return (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}>
            <div
              style={{
                backgroundColor: getStatusColor(params.value),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '16px',
                width: '100px', // Fixed width for all status buttons
                textAlign: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}
            >
              {params.value}
            </div>
          </div>
        );
      },
    },
    {
      headerName: "Comments",
      field: "comments",
      cellStyle: { "text-align": "center" },
      headerClass: "text-center",
      width: 180,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: "Assigned To",
      field: "attendedBy",
      cellStyle: { "text-align": "center" },
      headerClass: "text-center",
      maxWidth: 160,
      floatingFilter: true,
      suppressHeaderFilterButton: true,
    },
  
    {
      headerName: "Requested On",
      field: "createdAt",
      cellStyle: { textAlign: "center", whiteSpace: "normal" }, // Ensures wrapping
      headerClass: "text-center",
      maxWidth: 120,
      wrapText: true,
      autoHeight: true,
      autoHeaderHeight: true,
      wrapHeaderText: true,
      floatingFilter: true,
      suppressHeaderFilterButton: true,
      cellRendererFramework: (params) => {
        if (!params.value) return ""; // Handle empty values
    
        const dateObj = new Date(params.value);
        const formattedDate = dateObj
          .toLocaleDateString("en-GB") // Converts to dd-mm-yyyy
          .replace(/\//g, "-"); // Ensure format consistency
    
        const formattedTime = dateObj.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
    
        return (
          <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            {formattedDate} {formattedTime}
          </div>
        );
      },
    },
    
  
    {
      headerName: "Action",
      field: "action",
      suppressSizeToFit: true,
      maxWidth: 150,
      cellRendererFramework: (params) => {
        // Check if department is one of the specified departments
        const hideButton = ["Housekeeping", "Laundry", "Hotel"].includes(params.data.departmentName);
        
        // Return nothing (hide button) if hideButton is true
        if (hideButton) {
          return null;
        }
        
        // Otherwise show the button
        return (
          <Button color="primary" onClick={() => getUserLevel(params)}>
            Action
          </Button>
        );
      },
    },
  ]);
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));

  const cellClickedListener = useCallback((event) => { }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    const filterText = document
      .getElementById("filter-text-box")
      .value.toLowerCase();
    gridRef.current.api.setQuickFilter(filterText, { column: "userName" });
  }, []);

  return (
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={activeTab === '1' ? 'active' : ''}
            onClick={() => { toggleTab('1'); }}
          >
            Open/Inprogess Request
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === '2' ? 'active' : ''}
            onClick={() => { toggleTab('2'); }}
          >
            Completed Request
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <Card>
               
              </Card>
            </Col>
          </Row>

          {/* AgGrid for Table-Steward Mapping */}
          <Card>
          <CardBody >
          <Row>
            <Col sm="12">
              <div className="ag-theme-alpine" style={{ height: 520 }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={rowData}
                  columnDefs={columnDefs}
                  animateRows={true}
                  rowSelection="multiple"
                  onCellClicked={cellClickedListener}
                  paginationPageSize="10"
                  pagination="true"
                  defaultColDef={defaultColDef}
                  headerColor="ddw-primary"
                />
              </div>
            </Col>
          </Row>
          </CardBody>
          </Card>
        </TabPane>

        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <Card>
                <CardBody>
                  <NewTabContent activeTab={ activeTab }/>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </TabContent>

      <Modal
  isOpen={show}
  toggle={() => actionButton(!show)}
  className="modal-dialog-centered"
  size="md"
>
  <ModalBody>
    <ServiceStatusModal data1={tableID} currentStatus={status} onUpdateSuccess={handleUpdateSuccess} onCancel={handleCancel}/>
  </ModalBody>
</Modal>
    </div>
  );
};


export default PendingRequestTab;