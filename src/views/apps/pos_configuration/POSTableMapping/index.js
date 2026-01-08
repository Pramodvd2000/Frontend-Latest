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
import API_URL from "../../../../config";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import EditBlock from "./editBlock";
const MySwal = withReactContent(Swal);
import Select from "react-select";
import { selectThemeColors } from "@utils";
import classnames from "classnames";
import StewardMappedData from "./stewardTablemapping.js";
import TableMappedData from "./tableStewardmapping.js"


const defaultValues = {
  storeid: null,
  tableid: null,
  stewardID: null
};


const NewTabContent = () => {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usersType, setUsersType] = useState();
  const [restaurantOptions, setRestaurantOptions] = useState([]);
  const [tableOptions, setTableOptions] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [data, setData] = useState(null);
  const [rowData, setRowData] = useState();
  const [show, actionButton] = useState(false);
  const [stewardID,setstewardID] = useState();


  
  useEffect(() => {
    fetchx(API_URL + "/getposstewardMappingDetails")
      .then((result) => result.json())
      .then((rowData) => {
        setRowData(rowData["data"]);
      });
     
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
  
  useEffect(() => {
    const fetchxRestaurantData = async () => {
      try {
        const response = await fetchx(API_URL + "/getstoreid");
        const responseData = await response.json();

        if (
          responseData.status === "success" &&
          Array.isArray(responseData.data)
        ) {
          setRestaurantOptions(
            responseData.data.map((restaurant) => ({
              value: restaurant.storeID,
              label: restaurant.restaurantName,
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

  useEffect(() => {}, [selectedRestaurants]);


  useEffect(() => {
    const fetchTableData = async () => {
      if (selectedRestaurant ) {
        try {
          // const response = await fetchx(`${API_URL}/v9/gettablecInfo?storeID=${selectedRestaurant.value}`);
          // const response = await fetchx(`${API_URL}/gettablecInfostorewise?storeID=${selectedRestaurant.value}`)
          const response = await fetchx(`${API_URL}/gettablecInfo?hotelID=10&storeID=${selectedRestaurant.value}&stewardID=${selectedUserType.value}`);
          // console.log(response)
          const responseData = await response.json();
          // console.log(responseData)
          if (
            responseData.status === "success" &&
            Array.isArray(responseData.data.tables)
          ) {
            setTableOptions(
              responseData.data.tables.map((table) => ({
                value: table.id,
                label: table.tableNo,
              }))
            );
            // {console.log(tableOptions)}
          } else {
            // console.error("Invalid or unsuccessful response: ", responseData);
            setTableOptions([]);
          }
        } catch (error) {
          // console.error("Error fetching table data:", error);
          setTableOptions([]);
        }
      } else {
        setTableOptions([]);
      }
    };

    fetchTableData();
  }, [selectedRestaurant]);
  const gridRef = useRef();

  const cellClickedListener = useCallback((event) => {}, []);


  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));
    

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "User ID",
      field: "id",
      hide: true,
    },

    {
      headerName: "First Name",
      field: "first_name",
      cellStyle: { "text-align": "center", "background-color": "#F1E39B" },
      headerClass: "text-center",
      maxWidth: 200,
    },
    {
      headerName: "Last Name",
      field: "last_name",
      cellStyle: { "text-align": "center", "background-color": "pink" },
      headerClass: "text-center",
      maxWidth: 200,
    },
    {
      headerName: "Phone",
      field: "phone_number",
      cellStyle: { "text-align": "center", "background-color": "#F1E39B" },
      headerClass: "text-center",
      maxWidth: 200,
    },
    {
      headerName: "Email",
      field: "email",
      cellStyle: { "text-align": "center", "background-color": "pink" },
      headerClass: "text-center",
      maxWidth: 200,
    },
    {
      headerName: "Status",
      field: "status",
      cellStyle: { "text-align": "center", "background-color": "pink" },
      headerClass: "text-center",
      maxWidth: 120,
    },
    {
      headerName: "Action",
      field: "action",
      suppressSizeToFit: true,
      maxWidth: 150,
      cellRendererFramework: (params) => {
        return (
          <Button color="primary" onClick={() => getUserLevel(params)}>
            Action
          </Button>
        );
      },
    },
  ]);

  const onSubmit = (data) => {
    // console.log(data)
    setData(data);

    let posUserData = JSON.stringify({
      hotelID: 10,
      storeID: selectedRestaurant.value,
      stewardID: selectedUserType.value,
      tableID: data.tableid.map(table => table.value)
    });
    // console.log("posUserData---------------")
    // console.log(posUserData)
    fetchx(API_URL + "/addStewardwiseTableMapping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: posUserData,
    })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((errorData) => {
          throw new Error(errorData.message || "Failed to add user");
        });
      }
      return res.json();
    })
    .then((data) => {
      const swalInstance = MySwal.fire({
        text: "Tablewise Steward Mapping added successfully",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Close",
        customClass: {
          confirmButton: "btn btn-danger",
        },
      });
  
      swalInstance.then((result) => {
        if (result.isConfirmed) {
          navigate("");
  
          fetchx(API_URL + "/getstoreid")
            .then((result) => result.json())
            .then((rowData) => {
              setRowData(rowData.data);
            });
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error.message);
      MySwal.fire({
        text: "Failed to add user",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-danger",
        },
      });
      reset();
    });
  };
  const handleCancel = () => {
    setUsername('');
  };

  
  const { reset, control,handleSubmit } = useForm({ defaultValues })
  const handleReset = () => {
    reset({
      userType: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      storeid: "",
      passcode: "",
      email: "",
      password: "",
    });
    setPassword("");
  };

  const getUserLevel = (params) => {
    if (params && params.data) {
      // console.log('Data:', params.data); // Log the row data
      setstewardID(params.data.stewardID); // Example of using the data
      actionButton(!show); // Toggle the action
    } else {
      console.warn('Params.data is missing or undefined');
    }
  };
  

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
              <Col md="4" sm="12" className="mb-1">
                <div className="mb-1">
                  <Label className="form-label" for="stewardID">
                    Steward List<span className="text-danger">*</span>
                  </Label>
                  <Controller
                    id="stewardID"
                    control={control}
                    name="stewardID"
                    render={({ field }) => (
                      <Select
                        required
                        isClearable
                        options={usersType}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select", {
                          "is-invalid": data !== null && data.stewardID === null,
                        })}
                        // value={field.value}  
                        {...field}
                        // onChange={(selectedOption) => {
                        //   console.log("selectedOption",selectedOption)
                        //   setSelectedUserType(selectedOption.value);
                        //   field.onChange(selectedOption); 
                        //   // handleReset();
                        // }}
                        onChange={(selectedOption) => {
                          setSelectedUserType(selectedOption);
                          field.onChange(selectedOption);
                        }}
                      />
                    )}
                  />
                </div>
              </Col>

<Col md="4" sm="12" className="mb-1">
          <div className="mb-1">
            <Label className="form-label" for="storeid">
              Map Store<span className="text-danger">*</span>
            </Label>
            <Controller
              id="storeid"
              name="storeid"
              control={control}
              render={({ field }) => (
                <Select
                  required
                  isClearable
                  options={restaurantOptions}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  className={classnames("react-select", {
                    "is-invalid": data !== null && data.storeid === null,
                  })}
                  {...field}
                  onChange={(selectedOption) => {
                    // console.log(selectedOption)
                    setSelectedRestaurant(selectedOption);
                    field.onChange(selectedOption);
                  }}
                />
              )}
            />
          </div>
        </Col>

              <Col md="4" sm="12" className="mb-1">
                <div className="mb-1">
                  <Label className="form-label" for="tableid">
                    Map Table<span className="text-danger">*</span>
                  </Label>
                  <Controller
                    id="tableid"
                    name="tableid"
                    control={control}
                    render={({ field }) => (
                      <Select
                        required
                        isMulti
                        isClearable
                        options={tableOptions}
                        value={field.value}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames("react-select", {
                          "is-invalid": data !== null && data.tableid === null,
                        })}
                        {...field}
                        onChange={(selectedOptions) => {
                          field.onChange(selectedOptions);
                        }}
                      />
                    )}
                  />
                </div>
              </Col>

              <div className="d-flex">
                <Button
                  className="me-1"
                  color="primary"
                  type="submit"
                >
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
      <br />
      <div className="ag-theme-alpine" style={{ height: 700 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection="multiple"
          onCellClicked={cellClickedListener}
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
              {/* <UpdateButtons
                data1={userLevel}
                data6={usersType}
                data2={userId}
                data3={email}
                data4={contact}
                data5={userStatus}
              /> */}
              <StewardMappedData data1={stewardID}/>
            </ModalBody>
          </Modal>

    </div>
  );
};

const Block = () => {
  const [activeTab, setActiveTab] = useState('1');
  const toggleTab = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const gridRef = useRef();
  const { reset, handleSubmit, control } = useForm({ defaultValues: defaultValues });
  let navigate = useNavigate();
  const [rateCode, setrateCode] = useState();
  const [filldata, setfilldata] = useState(" ");
  const [usersType, setUsersType] = useState();
  const [restaurantOptions, setRestaurantOptions] = useState([]);
  const [tableOptions, setTableOptions] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [data, setData] = useState(null);
  const [rowData, setRowData] = useState();
  const [show, actionButton] = useState(false);
  const [stewardID, setstewardID] = useState();
  const [tableID, settableID] = useState();
  const [selectedTable, setSelectedTable] = useState(null);
  const [notAssignedStewards, setNotAssignedStewards] = useState([]);

  useEffect(() => {
    const fetchNotAssignedStewards = async () => {
      if (selectedTable) {
        try {
          const response = await fetchx(`${API_URL}/getallnotassignedstewardlist?hotelID=10&storeID=${selectedRestaurant.value}&tableID=${selectedTable.value}`);
          const responseData = await response.json();
          if (responseData.status === 'success' && Array.isArray(responseData.data)) {
            setUsersType(
              responseData.data.map((steward) => ({
                value: steward.user_id,
                label: steward.stewardName,
              }))
            );
          } else {
            console.error('Invalid or unsuccessful response: ', responseData);
            setUsersType([]);
          }
        } catch (error) {
          console.error('Error fetching steward data:', error);
          setUsersType([]);
        }
      }
    };

    fetchNotAssignedStewards();
  }, [selectedTable]);

  useEffect(() => {
    fetchx(API_URL + "/getTablewiseStewardMappingDetails")
      .then((result) => result.json())
      .then((rowData) => {
        setRowData(rowData["data"]);
      });
  }, []);

  useEffect(() => {
    const fetchxRestaurantData = async () => {
      try {
        const response = await fetchx(API_URL + "/getstoreid");
        const responseData = await response.json();

        if (
          responseData.status === "success" &&
          Array.isArray(responseData.data)
        ) {
          setRestaurantOptions(
            responseData.data.map((restaurant) => ({
              value: restaurant.storeID,
              label: restaurant.restaurantName,
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

  useEffect(() => { }, [selectedRestaurants]);

  useEffect(() => {
    const fetchTableData = async () => {
      if (selectedRestaurant) {
        try {
          const response = await fetchx(`${API_URL}/gettablecInfostorewise?storeID=${selectedRestaurant.value}`);
          const responseData = await response.json();
          if (
            responseData.status === "success" &&
            Array.isArray(responseData.data.tables)
          ) {
            setTableOptions(
              responseData.data.tables.map((table) => ({
                value: table.id,
                label: table.tableNo,
              }))
            );
          } else {
            console.error("Invalid or unsuccessful response: ", responseData);
            setTableOptions([]);
          }
        } catch (error) {
          console.error("Error fetching table data:", error);
          setTableOptions([]);
        }
      } else {
        setTableOptions([]);
      }
    };

    fetchTableData();
  }, [selectedRestaurant]);

  const getUserLevel = (params) => {
    console.log(params.data);
    if (params && params.data) {
      settableID(params.data.tableID);
      actionButton(!show);
    } else {
      console.warn('Params.data is missing or undefined');
    }
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Table Number",
      field: "tableNo",
      cellStyle: { "text-align": "center", "background-color": "#F1E39B" },
      headerClass: "text-center",
      maxWidth: 120,
    },
    {
      headerName: "StoreID",
      field: "storeID",
      cellStyle: { "text-align": "center", "background-color": "#F1E39B" },
      headerClass: "text-center",
      maxWidth: 120,
    },
    {
      headerName: "Resturant Name",
      field: "restaurantName",
      cellStyle: { "text-align": "center", "background-color": "pink" },
      headerClass: "text-center",
      maxWidth: 190,
    },
    {
      headerName: "Table status",
      field: "tableStatus",
      cellStyle: { "text-align": "center", "background-color": "#F1E39B" },
      headerClass: "text-center",
      maxWidth: 120,
    },
    {
      headerName: "Assigned stewards",
      field: "assigned_stewards",
      cellStyle: { "text-align": "center", "background-color": "pink" },
      headerClass: "text-center",
      width: 600,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: "Action",
      field: "action",
      suppressSizeToFit: true,
      maxWidth: 150,
      cellRendererFramework: (params) => {
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

  const onSubmit = (formData) => {
    console.log('Raw Form Data:', formData);

    if (!formData.storeid || !formData.tableid || !formData.stewardID) {
      MySwal.fire({
        text: "Please fill in all required fields",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-danger",
        },
      });
      return;
    }

    const posUserData = JSON.stringify({
      hotelID: 10,
      storeID: formData.storeid.value,
      stewardID: formData.stewardID.map(steward => steward.value),
      tableID: formData.tableid.value
    });

    console.log("Processed data being sent:", posUserData);

    fetch(API_URL + "/addTablewiseStewardMapping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: posUserData,
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            throw new Error(errorData.message || "Failed to add user");
          });
        }
        return res.json();
      })
      .then((data) => {
        MySwal.fire({
          text: "Tablewise Steward Mapping added successfully",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Close",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            reset(defaultValues);  // Reset form to default values
            navigate("");
            fetchx(API_URL + "/getstoreid")
              .then((result) => result.json())
              .then((rowData) => {
                setRowData(rowData.data);
              });
          }
        });
      })
      .catch((error) => {
        console.error("Error:", error.message);
        MySwal.fire({
          text: "Failed to add user",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
        reset();
      });
  };

  const handleReset = () => {
    reset(defaultValues);
    setSelectedRestaurant(null);
    setSelectedUserType(null);
    setSelectedTable(null);
  };

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
            Table-Steward Mapping
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === '2' ? 'active' : ''}
            onClick={() => { toggleTab('2'); }}
          >
            Steward-Table Mapping
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <Card>
                <CardBody>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                      <Col md="4" sm="12" className="mb-1">
                        <div className="mb-1">
                          <Label className="form-label" for="storeid">
                            Map Store<span className="text-danger">*</span>
                          </Label>
                          <Controller
                            id="storeid"
                            name="storeid"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isClearable
                                options={restaurantOptions}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  "is-invalid": data !== null && data.storeid === null,
                                })}
                                onChange={(val) => {
                                  field.onChange(val);
                                  setSelectedRestaurant(val);
                                }}
                              />
                            )}
                          />
                        </div>
                      </Col>

                      <Col md="4" sm="12" className="mb-1">
                        <div className="mb-1">
                          <Label className="form-label" for="tableid">
                            Map Table<span className="text-danger">*</span>
                          </Label>
                          <Controller
                            id="tableid"
                            name="tableid"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isClearable
                                options={tableOptions}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  "is-invalid": data !== null && data.tableid === null,
                                })}
                                onChange={(val) => {
                                  field.onChange(val);
                                  setSelectedTable(val);
                                }}
                              />
                            )}
                          />
                        </div>
                      </Col>

                      <Col md="4" sm="12" className="mb-1">
                        <div className="mb-1">
                          <Label className="form-label" for="stewardID">
                            Steward List<span className="text-danger">*</span>
                          </Label>
                          <Controller
                            id="stewardID"
                            name="stewardID"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isMulti
                                isClearable
                                options={usersType}
                                classNamePrefix="select"
                                theme={selectThemeColors}
                                className={classnames("react-select", {
                                  "is-invalid": data !== null && data.stewardID === null,
                                })}
                                onChange={(val) => {
                                  field.onChange(val);
                                  setSelectedUserType(val);
                                }}
                              />
                            )}
                          />
                        </div>
                      </Col>

                      <div className="d-flex">
                        <Button className="me-1" color="primary" type="submit">
                          Submit
                        </Button>
                        <Button outline color="secondary" type="reset" onClick={handleReset}>
                          Reset
                        </Button>
                      </div>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* AgGrid for Table-Steward Mapping */}
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
        </TabPane>

        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <Card>
                <CardBody>
                  <NewTabContent />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </TabContent>

      <Modal
        isOpen={show}
        toggle={() => actionButton(!show)}
        className="modal-xl"
      >
        <ModalHeader
          className="modal-lg"
          toggle={() => {
            actionButton(!show);
          }}
        >
          Update Steward..
        </ModalHeader>
        <ModalBody className="pb-3 px-sm-2 mx-20">
          <TableMappedData data1={tableID} />
        </ModalBody>
      </Modal>
    </div>
  );
};


export default Block;