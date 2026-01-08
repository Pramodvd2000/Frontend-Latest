import React, { useState, useEffect } from "react";
import { AlertCircle } from "react-feather";
import Select from "react-select";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { Eye, EyeOff } from "react-feather";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  UncontrolledAccordion,
} from "reactstrap";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { selectThemeColors } from "@utils";

import {
  Input,
  Card,
  Form,
  Alert,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  InputGroup,
  InputGroupText,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useRef, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import UpdateButtons from "./UpdateButtons";
import API_URL from "../../../config";

const defaultValues = {
  usertype: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  storeid: "",
  passcode: "",
  email: "",
  password: "",
};

const ValidationThirdPartyComponents = () => {
  const [selectedUserType, setSelectedUserType] = useState(null);

  const { control, watch, reset, handleSubmit } = useForm();
  const userTypeValue = watch("usertype", null);
  useEffect(() => {
    const isSteward = userTypeValue === "Steward";
    reset({
      password: isSteward ? "" : defaultValues.password,
    });
  }, [userTypeValue, setSelectedUserType]);
  const [rowData, setRowData] = useState();
  const [namedata,setNameData] = useState();
  const [formData, setFormData] = useState({ firstName: null });
  //console.log(formData);
  const [showAlert, setShowAlert] = useState(false);
  // ** State
  const [open, setOpen] = useState("0");
  const [userLevel, setUserLevel] = useState();
  const [usersType, setUsersType] = useState();
  const [userId, setUserId] = useState();
  const [email, setEmail] = useState();
  const [contact, setContact] = useState();
  const [userStatus, setUserStatus] = useState();
  let navigate = useNavigate();
  const [show, actionButton] = useState(false);
  const [storeOptions, setStoreOptions] = useState([]);
  const [restaurantOptions, setRestaurantOptions] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);


  const MySwal = withReactContent(Swal);

  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id);
  };

  const gridRef = useRef();

  const userTypeFormatter = (params) => {
    switch (params.value) {
      case 1:
        return "PMS";
      case 2:
        return "POS";
      case 3:
        return "POS&PMS";
      case 4:
        return "ADMIN";
      case 5:
          return "IT ADMIN";
      default:
        return "UNKNOWN";
    }
  };

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
      headerName: "User Type",
      field: "userType",
      cellStyle: { "text-align": "center", "background-color": "#F1E39B" },
      headerClass: "text-center",
      valueFormatter: userTypeFormatter,
      maxWidth: 120,
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
        // const isDisabled = params.data.userType === 3 || params.data.userType === 4;
        return (
          <Button color="primary" onClick={() => getUserLevel(params)}>
            Action
          </Button>
        );
      },
    },
  ]);

  const getUserLevel = (params) => {
    if (params.data) {
      actionButton(!show);
    }
  };
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
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));
 

const cellClickedListener = useCallback(
  (event) => {
    if (event.colDef.field !== 'action') {
      event.preventDefault(); 
    } else {
      // const userType = event.data.userType;
      
      // if (userType === 3 || userType === 4) {
      //   return; 
      // }

      // console.log(event.data);
      setUserId(event.data.id);
      setEmail(event.data.email);
      setUserStatus(event.data.status);
      setContact(event.data.phone_number);

      fetchx(`${API_URL}/getuserlevel?userId=${event.data.id}`)
        .then((result) => {
          if (!result.ok) {
            throw new Error('Failed to fetch user level');
          }
          return result.json();
        })
        .then((rowData) => {
          if (
            rowData.data &&
            rowData.data.length > 0 &&
            rowData.data[0].level !== undefined
          ) {
            setUserLevel(rowData.data[0].level);
            setUsersType(rowData.data[0].userType);
            actionButton(!show);
          } else {
            console.error("Invalid data structure or 'level' property not found.");
          }
        })
        .catch((error) => {
          console.error('Error fetching user level:', error);
        });
    }
  },
  [] 
);

  useEffect(() => {
    fetchx(API_URL + "/getposUserDetails")
      .then((result) => result.json())
      .then((rowData) => {
        setRowData(rowData["data"]);
      });
     
  }, []);
  

  useEffect(() => {
    fetchx(API_URL + "/getposUserDetails")
      .then((result) => result.json())
      .then((namedata) => {
        const firstNames = namedata["data"].map((item) => item.first_name);
        setNameData(firstNames);
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

  useEffect(() => {
    fetchx(API_URL + "/getstoreid")
      .then((result) => result.json())
      .then((resp) => {
        const responseData = resp["data"];

        setStoreOptions(responseData);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {}, [selectedRestaurants]);

  const [data, setData] = useState(null);

  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const isSubmitDisabled = visible || showAlert;

  const handlePasswordInput = (e) => {
    const inputValue = e.target.value;
    const isValidInput = /^[a-zA-Z0-9$@#*]+$/.test(inputValue);
  
    if (isValidInput || inputValue === "") {
      setPassword(inputValue);
    }
  };

  useEffect(() => {
    if (selectedUserType?.value !== "Steward") {
      checkPasswordConditions();
    } else {
      setVisible(false);
    }
  }, [password, selectedUserType]);
  const checkPasswordConditions = () => {
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/\d/.test(password) ||
      !/[$@#*]/.test(password)
    ) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const handleInputChange = (event) => {
    const enteredFirstName = event.target.value.trim();
    const existingName = namedata.find(name =>
      name.toLowerCase() === enteredFirstName.toLowerCase()
    );
    if (existingName) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
    setFormData({ firstName: enteredFirstName });
  };

  const onSubmit = (data) => {
    setData(data);
  
    let posUserData = JSON.stringify({
      usertype: selectedUserType.value,
      firstName: formData.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      storeid: String(
        Array.isArray(data.storeid)
          ? data.storeid.map((item) => item.value)
          : []
      ),
      email: data.email,
      password: password,
      passcode: data.passcode,
    });
  
    fetch(API_URL + "/insertUser", {
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
        text: "User Added Successfully",
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
  
          fetch(API_URL + "/getstoreid")
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
        text: error.message || "Failed to add user",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-danger",
        },
      });
    });
  };

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

  const userType = [
    { value: "Steward", label: "Steward" },
    { value: "Outlet Manager", label: "Outlet Manager" },
    { value: "Frontdesk Manager", label: "Frontdesk Manager" },
    { value: "Frontdesk Associate", label: "Frontdesk Associate" },
  ];

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);

  return (
    <div>
      {userLevel !== undefined && usersType !== undefined && (
        <div>
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
              Update user..
            </ModalHeader>
            <ModalBody className="pb-3 px-sm-2 mx-20">
              <UpdateButtons
                data1={userLevel}
                data6={usersType}
                data2={userId}
                data3={email}
                data4={contact}
                data5={userStatus}
              />
            </ModalBody>
          </Modal>
        </div>
      )}

      <Card>
        <Accordion open={open} toggle={toggle}>
          <AccordionItem>
            <AccordionHeader targetId="1">Add User</AccordionHeader>
            <AccordionBody accordionId="1">
              <CardBody>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col md="4" sm="12" className="mb-1">
                      <div className="mb-1">
                        <Label className="form-label" for="usertype">
                          User Type<span className="text-danger">*</span>
                        </Label>
                        <Controller
                          id="usertype"
                          control={control}
                          name="usertype"
                          render={({ field }) => (
                            <Select
                              required
                              isClearable
                              options={userType}
                              classNamePrefix="select"
                              theme={selectThemeColors}
                              className={classnames("react-select", {
                                "is-invalid":
                                  data !== null && data.usertype === null,
                              })}
                              onChange={(selectedOption) => {
                                setSelectedUserType(selectedOption);
                                field.onChange(selectedOption);
                                handleReset();
                              }}
                            />
                          )}
                        />
                      </div>
                    </Col>

<Col md="4" sm="12" className="mb-1">
      <div className="mb-1">
        <Label className="form-label" for="firstName">
          First Name<span className="text-danger">*</span>
        </Label>
        <Input
          id="firstName"
          name="firstName"
          placeholder="Enter First Name"
          required
          onChange={handleInputChange}
          className={classnames("form-control", {
            "is-invalid": formData.firstName !== null && formData.firstName === null,
          })}
        />
        {showAlert && (
          <Alert color="danger" className="mt-2">
            <div className="alert-body">
              <AlertCircle size={15} />
              <span className="ms-1">First name already exists!</span>
            </div>
          </Alert>
        )}
      </div>
    </Col>

                    <Col md="4" sm="12" className="mb-1">
                      <div className="mb-1">
                        <Label className="form-label" for="lastName">
                          Last Name<span className="text-danger">*</span>
                        </Label>

                        <Controller
                          id="lastName"
                          name="lastName"
                          control={control}
                          placeholder="Last Name"
                          render={({ field }) => (
                            <Input
                              pattern="[aA-zZ]*"
                              title="Only Alphabets Allowed"
                              placeholder="Enter Last Name"
                              required
                              {...field}
                              className={classnames("form-control", {
                                "is-invalid":
                                  data !== null && data.lastName === null,
                              })}
                            />
                          )}
                        />
                      </div>
                    </Col>

                    <Col md="4" sm="12" className="mb-1">
                      <div className="mb-1">
                        <Label className="form-label" for="phoneNumber">
                          Phone Number<span className="text-danger">*</span>
                        </Label>
                        <InputGroup className="input-group-merge">
                          <Controller
                            id="phoneNumber"
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
                              <Cleave
                                {...field}
                                pattern="[0-9]*"
                                title="Only Numbers Allowed"
                                required
                                placeholder="Enter Phone Number"
                                options={{
                                  numeral: true,
                                  numeralThousandsGroupStyle: "none",
                                  numeralDecimalScale: 0,
                                  numeralIntegerScale: 10,
                                }}
                                className={classnames("form-control", {
                                  "is-invalid":
                                    data !== null && data.phoneNumber === null,
                                })}
                              />
                            )}
                          />
                        </InputGroup>
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
                              isMulti
                              isClearable
                              options={restaurantOptions}
                              classNamePrefix="select"
                              theme={selectThemeColors}
                              className={classnames("react-select", {
                                "is-invalid":
                                  data !== null && data.storeid === null,
                              })}
                              {...field}
                              isDisabled={
                                selectedUserType?.value ===
                                  "Frontdesk Associate" ||
                                selectedUserType?.value === "Frontdesk Manager"
                              }
                            />
                          )}
                        />
                      </div>
                    </Col>

                    <Col md="4" sm="12" className="mb-1">
                      <div className="mb-1">
                        <Label className="form-label" for="email">
                          Email<span className="text-danger">*</span>
                        </Label>
                        <InputGroup className="input-group-merge">
                          <Controller
                            id="email"
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <Cleave
                                {...field}
                                placeholder="Enter Email"
                                required
                                options={{ email: true }}
                                className={classnames("form-control", {
                                  "is-invalid":
                                    data !== null && data.email === null,
                                })}
                                style={{ textTransform: "lowercase" }}
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                maxLength="30"
                              />
                            )}
                          />
                        </InputGroup>
                      </div>
                    </Col>

                    <Col md="4" sm="12" className="mb-1">
                      <div className="mb-1">
                        <Label className="form-label" for="password">
                          Password<span className="text-danger">*</span>
                        </Label>
                        <InputGroup className="input-group-merge">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="Enter Password"
                            value={password}
                            maxLength={15}
                            required
                            autocomplete="new-password"
                            disabled={selectedUserType?.value === "Steward"}
                            onChange={(e) => {
                              handlePasswordInput(e);
                            }}
                          />
                          <InputGroupText
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <Eye size={20} />
                            ) : (
                              <EyeOff size={20} />
                            )}
                          </InputGroupText>
                        </InputGroup>
                      </div>
                      <Alert color="danger" isOpen={visible}>
                        <div className="alert-body">
                          <AlertCircle size={15} />{" "}
                          <span className="ms-1">
                            <p>Password must contain : </p>
                            <p>At least 8 characters</p>
                            <p>One Upper case letter</p>
                            <p>One Lower case letter</p>
                            <p>One Number</p>
                            <p>One Special character(Only $, @, #, * are allowed)</p>
                          </span>
                        </div>
                      </Alert>
                    </Col>

                    <Col md="4" sm="12" className="mb-1">
                      <div className="mb-1">
                        <Label className="form-label" for="passcode">
                          Passcode<span className="text-danger">*</span>
                        </Label>
                        <InputGroup className="input-group-merge">
                          <Controller
                            id="passcode"
                            name="passcode"
                            control={control}
                            render={({ field }) => (
                              <Cleave
                                {...field}
                                pattern="[0-9]*"
                                title="Only Numbers Allowed"
                                required
                                disabled={
                                  selectedUserType?.value ===
                                    "Frontdesk Associate" ||
                                  selectedUserType?.value ===
                                    "Frontdesk Manager"
                                }
                                placeholder="Enter Passcode"
                                options={{
                                  numeral: true,
                                  numeralThousandsGroupStyle: "none",
                                  numeralDecimalScale: 0,
                                  numeralIntegerScale: 5,
                                }}
                                className={classnames("form-control", {
                                  "is-invalid":
                                    data !== null && data.passcode === null,
                                })}
                              />
                            )}
                          />
                        </InputGroup>
                      </div>
                    </Col>

                    <div className="d-flex">
                      <Button
                        className="me-1"
                        color="primary"
                        type="submit"
                        disabled={isSubmitDisabled}

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
              </CardBody>
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      </Card>

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

      <Card>
        <div className="ag-theme-alpine" style={{ height: 620 }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            animateRows={true}
            rowSelection="multiple"
            onCellClicked={cellClickedListener}
            paginationAutoPageSize="true"
            paginationPageSize="15"
            pagination="true"
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            gridOptions={gridOptions}
          />
        </div>
      </Card>
    </div>
  );
};

export default ValidationThirdPartyComponents;
