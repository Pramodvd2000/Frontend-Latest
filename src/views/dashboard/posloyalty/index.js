// ** React Imports
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// ** Reactstrap Imports
import {Button, Modal,ModalHeader,ModalBody, ModalFooter, Alert,CardBody,Label,Input,Nav, TabContent,TabPane,NavItem,NavLink} from "reactstrap";

// ** Custom Components
import Wizard from "@components/wizard";
import Swal from 'sweetalert2'
// // ** Steps
//import BasicDetails from "./basicDetails";
import VoucherDetails from "./voucherDetails"

import { Card} from "reactstrap";

import { AgGridReact } from "ag-grid-react";
import "/node_modules/ag-grid-community/styles/ag-grid.css";
import "/node_modules/ag-grid-community/styles/ag-theme-alpine.css";
import { useForm, Controller } from "react-hook-form";

import { useEffect, useMemo, useCallback } from "react";
import {  Row, Col } from "reactstrap";
import {
  Accordion,
  UncontrolledAccordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem
} from "reactstrap";

// // ** Steps2
import EditBasicDetails from "./editbasicDetails";



import API_URL from "../../../config";
//import "./hover.scss";

const defaultValues = {
  // hotelID: '',
  floor: "",
  blockID: null,
};
localStorage.removeItem("id")

const WizardModern = () => {

  const { setError, formState: { errors },} = useForm();
  const { reset, handleSubmit, control } = useForm({ defaultValues });
  const [open, setOpen] = useState("");
  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id);
  };

  const [activeTab, setActiveTab] = useState('active');
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };


  const [userId, setUserId] = useState();
  const [filldata, setfilldata] = useState({});
  //console.log(filldata);
  const [show, actionButton] = useState(false);
  const [showEdit, editButton] = useState(false);
  const [showExtend, extendButton] = useState(false);
  const [showVoucher,voucherButton] = useState(false);
  const [rowData, setRowData] = useState();
  const [rowData2, setRowData2] = useState();
  const gridRef = useRef();
  const gridRef2 = useRef();
  let navigate = useNavigate();
  const dateFormatter = (params) => {
    if (params.value) {
      const date = new Date(params.value);
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2); 
      const year = date.getFullYear(); 
        return `${day}-${month}-${year}`;
    }
    return '';
  };

  

  const [columnDefs] = useState([
    {headerName: 'Mem. ID ',field: 'guestID',hide:true,suppressSizeToFit: true,cellStyle: {'textAlign': 'left'}, maxWidth: 120 },
    {
      headerName: 'Name',
      suppressSizeToFit: true,
      field: 'fullName',
      
      width: 280,
     
    },
    // {headerName: 'Name ',field: 'fullName',suppressSizeToFit: true,cellStyle: {'textAlign': 'left'}, maxWidth: 300 },
    {headerName: 'Email ',field: 'email',suppressSizeToFit: true, width: 280 },
    {
      headerName: 'Mobile',
      field: 'phoneNumber',
      suppressSizeToFit: true,
      cellStyle: { 'textAlign': 'left' }
    },
    {headerName: "Action",field: "numAvlRooms", suppressSizeToFit: true, maxWidth: 180,cellRendererFramework: (params) => (
            <Button color="primary" onClick={() => {
                filldata.length != 0 && actionButton(!show); }}>Mem. Details
            </Button>
          ),
        },

        {headerName: "Vouchers",field: "numAvlRooms", suppressSizeToFit: true, maxWidth: 160,cellRendererFramework: (params) => (
            <Button color="primary" onClick={() => {
                filldata.length != 0 && voucherButton(!showVoucher); }}> Vouchers
            </Button>
          ),
        },
        {headerName: 'Mem. Expiry ',field: 'membershipExpiry',suppressSizeToFit: true,cellStyle: {'textAlign': 'left'}, maxWidth: 150,valueFormatter: dateFormatter},

  ])

  const [columnDefs2] = useState([
    {headerName: 'Mem. ID ',field: 'guestID',hide:true,suppressSizeToFit: true,cellStyle: {'textAlign': 'left'}, maxWidth: 120 },
    {
      headerName: 'Name',
      suppressSizeToFit: true,
      field: 'fullName',
      width: 280,
     
    },
    // {headerName: 'Name ',field: 'fullName',suppressSizeToFit: true,cellStyle: {'textAlign': 'left'}, maxWidth: 300 },
    {headerName: 'Email ',field: 'email',suppressSizeToFit: true, width: 280 },
    {
      headerName: 'Mobile',
      field: 'phoneNumber',
      suppressSizeToFit: true,
      cellStyle: { 'textAlign': 'left' }
    },
    {headerName: "Action",field: "numAvlRooms", suppressSizeToFit: true, maxWidth: 180,cellRendererFramework: (params) => (
            <Button color="primary" onClick={() => {
                filldata.length != 0 && actionButton(!show); }}>Mem. Details
            </Button>
          ),
        },

        {headerName: "Vouchers",field: "numAvlRooms", suppressSizeToFit: true, maxWidth: 160,cellRendererFramework: (params) => (
            <Button color="primary" onClick={() => {
                filldata.length != 0 && voucherButton(!showVoucher); }}> Vouchers
            </Button>
          ),
        },
        {headerName: 'Mem. Expiry ',field: 'membershipExpiry',suppressSizeToFit: true,cellStyle: {'textAlign': 'left'}, maxWidth: 150,valueFormatter: dateFormatter},

  ])
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));

  useEffect(() => {
    fetchx(API_URL + "/getActiveLoyaltyMembershipDetails")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData["data"]));
  }, []);

  useEffect(() => {
    fetchx(API_URL + "/getInactiveLoyaltyMembershipDetails")
      .then((result) => result.json())
      .then((rowData2) => setRowData2(rowData2["data"]));
  }, []);


  const cellClickedListener = useCallback((event) => {
    setfilldata(event["data"]);
    setUserId(event["data"]["guestID"]);
    
  }, []);



  const buttonListener = useCallback((e) => {
    gridRef.current.api.deselectAll();
  }, []);

  const [basicModal, setBasicModal] = useState(false);
  const [disabledModal, setDisabledModal] = useState(false);

  // ** Ref
  const ref = useRef(null);

  // ** State
  const [stepper, setStepper] = useState(null);

  // const steps = [
  //   {
  //     id: "basicDetails",
  //     title: "Basic Details",
  //     subtitle: "Enter Your Basic Details.",
  //     // icon: <FileText size={18} />,
  //     content: (
  //       <BasicDetails data1={filldata} stepper={stepper} type="wizard-modern" />
  //     ),
  //   },

  // ];

  const [stepper2, setstepper2] = useState(null);
  const steps2 = [
    {
      id: "editbasicDetails",
      title: "Basic Details",
      subtitle: "Edit Your Basic Details.",
      // icon: <FileText size={18} />,
      content: (
        <div>
        {Object.keys(filldata).length > 0 && <EditBasicDetails
          data1={filldata}

          stepper2={stepper2}
          type="wizard-modern"
        />}
        </div>
      ),
    },
  ];


  //console.log(filldata)
  const [stepper3, setstepper3] = useState(null);
  
  const phone = filldata["phoneNumber"];
 // //console.log(phone);
  const steps3 = [
    {
      id: "voucherDetails",
      title: "Voucher Details",
      subtitle: "Add and Redeem Your Voucher.",
   
      content: (
        <div>
          {Object.keys(filldata).length > 0 &&
        <VoucherDetails
          data1={filldata}
          stepper3={stepper3}
          type="wizard-modern"
        />
          }
                  </div>

      ),
    },
  ];
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);



const onConfirm = () => {
  const currentDate = new Date();
  const membershipExpiry = new Date(filldata.membershipExpiry);

  if (currentDate < membershipExpiry) {
    Swal.fire({
      title: 'Membership is currently active',
      text: 'Do you truly wish to extend your membership?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        actions: 'swal-actions',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        proceedWithExtension();
      }
    });

    // Add the 10px gap between the buttons using inline styles
    setTimeout(() => {
      const swalActions = document.querySelector('.swal2-actions');
      if (swalActions) {
        const confirmButton = swalActions.querySelector('.swal2-confirm');
        const cancelButton = swalActions.querySelector('.swal2-cancel');
        if (confirmButton && cancelButton) {
          confirmButton.style.marginRight = '20px';
        }
      }
    }, 0);
  } else {
    proceedWithExtension();
  }
};


const proceedWithExtension = () => {
  const requestData = {
    id: filldata.id, // Assume filldata.id has the required value
  };

  fetchx(API_URL + `/extendLoyaltyMembership?id=${filldata.membershipID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Membership extended successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        navigate("");
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to extend membership',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        title: 'Error!',
        text: `Failed to extend membership: ${error.message}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    });
};

const onEnable = () => {
    //console.log(filldata.id)
    const requestData = {
      id: filldata.id, 
    };
  
    fetchx(API_URL + `/updateLoyaltyMembershipStatus?id=${filldata.membershipID}&status=Active`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire({
            title: 'Success!',
            text: 'Membership activated successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          navigate("")
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to activate membership',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: `Failed to activate membership: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  };
  
  const onDisable = () => {
    const requestData = {
      id: filldata.id,
       // Assume filldata.id has the required value
    };
  
    fetchx(API_URL + `/updateLoyaltyMembershipStatus?id=${filldata.membershipID}&status=Inactive`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire({
            title: 'Success!',
            text: 'Membership disabled',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          navigate("")
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to Inactivate membership',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: `Failed to extend membership: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  };

  
  const onSubmit = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to extend membership by 1 Year!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, extend it!',
      customClass: {
        confirmButton: 'custom-confirm-btn',
        cancelButton: 'custom-cancel-btn'
      },
      didOpen: () => {
        const confirmBtn = document.querySelector('.custom-confirm-btn');
        const cancelBtn = document.querySelector('.custom-cancel-btn');
        if (confirmBtn && cancelBtn) {
          confirmBtn.style.marginRight = '10px';
          cancelBtn.style.marginLeft = '10px';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm(); // Call the function to extend membership
      }
    });
  };
  

  const onSubmitmem = () => {
    const isActive = filldata["isActive"];

    Swal.fire({
        title: "Do you want to make changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Enable",
        denyButtonText: `Disable`,
        didOpen: () => {
            const confirmButton = document.querySelector('.swal2-confirm');
            const denyButton = document.querySelector('.swal2-deny');
            const cancelButton = document.querySelector('.swal2-cancel');
            
            confirmButton.style.marginRight = '10px';
            denyButton.style.marginLeft = '10px'; 
            cancelButton.style.marginLeft = '10px'; 

            if (isActive === 0) {
                denyButton.disabled = true;
            } else if (isActive === 1) {
                confirmButton.disabled = true;
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            onEnable();
        } else if (result.isDenied) {
            onDisable();
        }
    });
};



  return (
    <div>
         <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={({ active: activeTab === 'active' })}
          //  className={activeTab === '1' ? 'active' : ''}
            onClick={() => { toggleTab('active'); }}
          >
            Active Membership details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={({ active: activeTab === 'inactive' })}
            onClick={() => { toggleTab('inactive'); }}
          >
            Inactive Membership details
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="active">
        <div>
        <br></br>
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
        <div className="ag-theme-alpine" style={{ height: 540 }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            animateRows={true}
            rowSelection="multiple"
            onCellClicked={cellClickedListener}
             paginationAutoPageSize = 'true'
            paginationPageSize="10"
            pagination="true"
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
          />
        </div>
      </div>
             
        </TabPane>
        <TabPane tabId="inactive">
        <div>
        <br></br>
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
        <div className="ag-theme-alpine" style={{ height: 540 }}>
          <AgGridReact
            ref={gridRef2}
            rowData={rowData2}
            columnDefs={columnDefs2}
            animateRows={true}
            rowSelection="multiple"
            onCellClicked={cellClickedListener}
             paginationAutoPageSize = 'true'
            paginationPageSize="10"
            pagination="true"
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
          />
        </div>
      </div>
             
        </TabPane>
      </TabContent>
    </div>
     
      

          {/* Add Guest Details */}
      <Card>
        <div className="vertically-centered-modal">
          <Modal
            isOpen={showEdit}
            toggle={() => editButton(!showEdit)}
            className="modal-xl"
          >
            <ModalHeader toggle={() => editButton(!showEdit)}>              
              Welcome...
            </ModalHeader>
            <ModalBody>
              <Card>
                <div className="modern-horizontal-wizard">
                  <Wizard
                    type="modern-horizontal"
                    ref={ref}
                    steps={steps2}
                    options={{
                      linear: false,
                    }}
                    instance={(el) => setstepper2(el)}
                  />
                </div>
              </Card>
            </ModalBody>
           
          </Modal>
        </div>
      </Card>

      {/* voucher details */}

      <Card>
        <div className="vertically-centered-modal">
          <Modal
            isOpen={showVoucher}
            toggle={() => voucherButton(!showVoucher)}
            className="modal-xl"
          >
            <ModalHeader toggle={() => voucherButton(!showVoucher)}>              
              Voucher Details...
            </ModalHeader>
            <ModalBody>
              <Card>
                <div className="modern-horizontal-wizard">
                  <Wizard
                    type="modern-horizontal"
                    ref={ref}
                    steps={steps3}
                    options={{
                      linear: false,
                    }}
                    instance={(el) => setstepper3(el)}
                  />
                </div>
              </Card>
            </ModalBody>
           
          </Modal>
        </div>
      </Card>

      <Card>
        <Modal
          isOpen={show}
          toggle={() => actionButton(!show)}
          className="modal-lg"
        >
          <ModalHeader toggle={() => actionButton(!show)}>
            {" "}
            View Membership Details...{" "}
          </ModalHeader>
          <ModalBody>
            {/* <Card> */}
            
              <div  className="d-flex justify-content-end">
                <Button
                  className="me-1"
                  color="primary"
                  onClick={() => {
                    filldata.length != 0 && editButton(!showEdit);
                  }}
                >
                  Edit
                </Button>
                <Button
                  className="me-1"
                  color="primary"
                  onClick={onSubmit}
                >
                 <span style={{ display: 'block' }}>Extend Mem.</span>
                {/* <span style={{ display: 'block' }}>Membership</span> */}
                </Button>
                <Button
                  className="me-1"
                  color="primary"
                 onClick={onSubmitmem}
                >
                     <span style={{ display: 'block' }}> Enable/disable</span>
                {/* <span style={{ display: 'block' }}>Membership</span> */}

                </Button>
              </div>
          
              <Card>
                <CardBody>
                <div>
      <div>
        {/* <p> <b><center>VIEW MEMBERSHIP DETAILS</center> </b> </p> */}
      </div>
      <Row>
        
        <Col>
         
            {/* <Form onSubmit={handleSubmit(onSubmit)}> */}
              <Col>
              <Row>
                <Col>
                  <div className="mb-1">
                    <Row>
                    <UncontrolledAccordion className='accordion-border' defaultOpen='1'>
                                <AccordionItem>
                    <AccordionHeader
                      style={{ backgroundColor: "#F2E5D9" }}
                      targetId="1"
                    >
                      <b> Overview </b>
                       </AccordionHeader>
                       <AccordionBody accordionId="1">
                      <Row>
                      <Col>
                          <div>
                            <h5>
                              <b>
                                Basic Details
                               
                              </b>
                            </h5>
                            <br></br>
                            {/* <h6> Name:<b>{filldata["salutation"] +  filldata["firstName"] 
                            + filldata["lastName"]
                            }</b> </h6> */}
                            <h6>
  Name: <b>{`${filldata.salutation} ${filldata.firstName} ${filldata.lastName}`}</b>
</h6>

                            <h6>Email: <b>{filldata["email"]}</b>  </h6>
                            <h6> Phone Number: <b>  {`${filldata.phoneNumber}`}</b></h6>
                          </div>
                        </Col>

                    <Col>
                      <div>
                        <h5>
                          <b> Address Details</b>
                        </h5>
                        <br></br>

                        <h6>
                          Address One: <b>{filldata["addressOne"]}</b>
                        </h6>
                        <h6>
                          Address Two: <b>{filldata["addressTwo"]}</b>
                        </h6>                       
                        <h6>
                          Country: <b>{filldata["countryName"]}</b>
                        </h6>
                        <h6>
                          State: <b>{filldata["state"]}</b>
                        </h6>
                        <h6>
                          City: <b>{filldata["city"]}</b>
                        </h6>
                        <h6>
                          Nationality: <b>{filldata["nationality"]}</b>
                        </h6>
                        <h6>
                          PostalCode: <b>{filldata["postalCode"]}</b>
                        </h6>
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
                    <Row>
                    <UncontrolledAccordion className='accordion-border' >
                      <AccordionItem>
                    <AccordionHeader
                      style={{ backgroundColor: "#F2E5D9" }}
                      targetId="1" >
                      <b> Company Details and GST </b>
                       </AccordionHeader>
                       <AccordionBody accordionId="1">
                      <Row>
                      <Col>
                     
                      <Row>
                          <Col> <h6>
                          Company: <b>{filldata["companyName"]}</b>
                        </h6> </Col>
                          
                          <Col> <h6> GST Number: <b>{filldata["gstID"]}</b> </h6>  </Col>
                          {/* <Col> <h6>VIP ID :<b>{filldata["vipType"]} </b> </h6>  </Col> */}
                          </Row>  
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
                    <Row>
                    <UncontrolledAccordion className='accordion-border' defaultOpen='1'>
                      <AccordionItem> 
                      <AccordionHeader
                      style={{ backgroundColor: "#F2E5D9" }}
                      targetId="1" >
                      <b>Membership Details </b>
                       </AccordionHeader>
                      <AccordionBody accordionId="1">
                      <Row>
                      <Col>
                         <Row>
                        
                        
                          <Col>
                            <h6>Membership Status: <b>{filldata["isActive"] === 1 ? 'Active' : 'Inactive'}</b></h6>
                          </Col>

                          <Col>
                           <h6>Membership Number: <b>{filldata["membershipNumber"]}</b></h6>
                          </Col>
                          </Row>
                          <Col>
                          <h6>Membership Expiry: <b>{filldata["membershipExpiry"]}</b></h6>
                        </Col>           
                         

                         
                                                
                         <br></br>
                       
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
                    <Row>
                    <UncontrolledAccordion className='accordion-border'>
                      <AccordionItem> 
                      <AccordionHeader
                      style={{ backgroundColor: "#F2E5D9" }}
                      targetId="1" >
                      <b>Other Details </b>
                       </AccordionHeader>
                      <AccordionBody accordionId="1">
                      <Row>
                      <Col>
                       {/* 
                    
                    */}
                         <Row>
                         <Col> <h6>DOB: <b> {filldata["dob"]}</b> </h6></Col>
                         <Col> <h6>Anniversary Date: <b>{filldata["anniversary"]}</b> </h6></Col>
                         <Col> <h6>Notes:<b>{filldata["notes"]} </b> </h6></Col>
                         <Col> <h6> Guest Preference Notes: <b>{filldata["guestpreferencenotes"]} </b> </h6> </Col>
                          
                          </Row>  
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

            {/* </Form> */}
          
        </Col>
      </Row>
      </div>
      </CardBody>
      </Card>
      </ModalBody>
      </Modal>
      </Card>


    </div>
  );
};

export default WizardModern;
