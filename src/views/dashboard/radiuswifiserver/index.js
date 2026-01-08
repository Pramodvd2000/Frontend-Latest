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
import API_URL from '../../../config';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import EditBlock from "./editBlock";
const MySwal = withReactContent(Swal);

const defaultValues = {
  username: "",
  password: "",
};

const NewTabContent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetchx(API_URL+`/getRadiuswifiPassword?username=${username}`);
      const responseData = await response.json();

      if (responseData.status === 'success') {
        setPassword(responseData.data.password);

        Swal.fire({
          icon: 'success',
          title: `Success`,
          html: `<h2>Existing Password is : <b>${responseData.data.password}</b></h2>`,
        });
      } else {
        
        if (responseData.message === 'Username is required') {
          Swal.fire({
            icon: 'info',
            title: 'Username Not Found',
            text: 'Please provide a valid username.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: responseData.message,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch data from GET API', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch data from server.',
      });
    }
  };
  const handleCancel = () => {
    setUsername('');
  };

  return (
    <div>
      <Form onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
        <Row>
          <Col md="4" sm="12">
            <div className="mb-1">
              <Label className="form-label" for="username">
                Username<span className="text-danger">*</span>
              </Label>
              <Input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </Col>
        </Row>
        <div align="start" className="buttons">
          <Button className="me-1" color="primary" type="submit">
            Submit
          </Button>{' '}
          <Button color="secondary" onClick={handleCancel}>
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
};

const Block = () => {
  const [activeTab, setActiveTab] = useState('1');
  const toggleTab = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  };

  const [rowData, setRowData] = useState();
  const gridRef = useRef();
  const [data, setData] = useState(null);
  const { reset, handleSubmit, control } = useForm({ defaultValues });
  let navigate = useNavigate();
  const [rateCode, setrateCode] = useState();
  const [filldata, setfilldata] = useState(" ");

  const EditData = (rowData) => {
    setfilldata(rowData);
    setrateCode(!rateCode);
  };

  useEffect(() => {
    fetchx(API_URL + "/getRoomWifiDetails")
      .then((result) => result.json())
      .then((rowData) => {
        setRowData(rowData.data);
      });
  }, []);

  const [columnDefs, setColumnDefs] = useState([
    { 
      headerName: "Room Number",
      field: "roomNumber",
      cellStyle: { textAlign: "center", backgroundColor: "pink" },
      headerClass: "text-center",
      maxWidth: 150,
    },
        {
      headerName: "User Name",
      field: "userName",
      cellStyle: { textAlign: "center", backgroundColor: "#F1E39B" },
      headerClass: "text-center",
      maxWidth: 150,
    },
    {
      headerName: "Password",
      field: "password",
      cellStyle: { textAlign: "center", backgroundColor: "pink" },
      headerClass: "text-center",
      maxWidth: 200,
    },
    {
      headerName: "Created At",
      field: "createdAt",
      cellStyle: { textAlign: "center", backgroundColor: "#F1E39B" },
      headerClass: "text-center",
      maxWidth: 200,
    },
    {
      headerName: "Modified At",
      field: "modifiedAt",
      cellStyle: { textAlign: "center", backgroundColor: "pink" },
      headerClass: "text-center",
      maxWidth: 200,
    },
    {
      headerName: "Action",
      field: "numAvlRooms",
      suppressSizeToFit: true,
      maxWidth: 120,
      cellRendererFramework: (params) => (
        <Button color="primary" size="sm" onClick={() => EditData(params.data)}>
          Update
        </Button>
      ),
    },
   
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));
  

  const cellClickedListener = useCallback((event) => {}, []);

  const onSubmit = (data) => {
    if (data.username.length) {
      let createmarketGroup = JSON.stringify({
        username: data.username,
        password: data.password,
      });
  
      fetchx(API_URL + "/insertIntoRoomWifi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: createmarketGroup,
      })
        .then((data) => data.json())
        .then((res) => {
          if (res["statusCode"] === 200) {
            fetchx(API_URL + "/getRoomWifiDetails")
              .then((result) => result.json())
              .then((rowData) => {
                setRowData(rowData["data"]);
                const swalInstance = MySwal.fire({
                  text: "Username Added Successfully!",
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
      block: "",
    });
  };
  const onFilterTextBoxChanged = useCallback(() => {
    const filterText = document
      .getElementById("filter-text-box")
      .value.toLowerCase();
    gridRef.current.api.setQuickFilter(filterText, { column: "userName" });
  }, []);

  return (
    <div>
      <div>
        <Modal
          isOpen={rateCode}
          toggle={() => setrateCode(!rateCode)}
          className="modal-lg"
        >
          <ModalHeader
            className="modal-lg"
            toggle={() => setrateCode(!rateCode)}
          >
            Update Password
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <EditBlock data1={filldata} />
          </ModalBody>
        </Modal>
      </div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={activeTab === '1' ? 'active' : ''}
            onClick={() => { toggleTab('1'); }}
          >
            Add Radius Wifi Server
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === '2' ? 'active' : ''}
            onClick={() => { toggleTab('2'); }}
          >
            Get Existing Radius Wifi Password
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
                    <Col md="4" sm="12">
                      <div className="mb-1">
                        <Label className="form-label" for="username">
                          User Name<span className="text-danger">*</span>
                        </Label>
                        <InputGroup className="input-group-merge">
                          <Controller
                            id="username"
                            name="username"
                            control={control}
                            placeholder="User Name"
                            render={({ field }) => (
                              <Input
                                placeholder="User Name"
                                maxLength={10}
                                pattern="[A-Za-z0-9]+"
                                title="Username must contain only alphabets and numbers"
                                required
                                {...field}
                              />
                            )}
                          />
                        </InputGroup>
                      </div>
                    </Col>

                    <Col md="4" sm="12">
                      <div className="mb-1">
                        <Label className="form-label" for="password">
                          Password<span className="text-danger">*</span>
                        </Label>
                        <InputGroup className="input-group-merge">
                          <Controller
                            id="password"
                            name="password"
                            control={control}
                            render={({ field }) => (
                              <Input
                                placeholder="Password"
                                maxLength={10}
                                pattern="[A-Za-z0-9@#$%*]+"
                                title="Password must contain only alphabets, numbers, and the characters @#$%*"
                                required
                                {...field}
                              />
                            )}
                          />
                        </InputGroup>
                      </div>
                    </Col>

                    <div align="start" className="buttons">
                      <Button className="me-1" color="primary" type="submit">
                        Submit
                      </Button>
                      <Button
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
        </Row>
      </div>

      <br />
      <div className="ag-theme-alpine" style={{ height: 520 }}>
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
    </div>
  );
};

export default Block;