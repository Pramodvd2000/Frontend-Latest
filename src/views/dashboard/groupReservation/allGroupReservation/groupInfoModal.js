import React, { useState, useEffect ,useRef} from 'react';
import { 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Card, 
  Row, 
  Col, 
  UncontrolledAccordion, 
  AccordionItem, 
  AccordionHeader, 
  AccordionBody 
} from 'reactstrap';
import Wizard from "@components/wizard";

import EditbookerDetails from '../../../apps/companyProfile/viewBooker';
import RateCodeBasicDetails from '../../../apps/companyProfile/datagrid';
import EditCompanyInformation from "../../../apps/companyProfile/editCompanyInformation";
import RateCodeDetails from "../../../apps/companyProfile/rateCode"
import EditBooker from "../../../apps/companyProfile/editBookerDetails";
import EditBTC from "../../../apps/companyProfile/editBtc"
import API_URL from '../../../../config';

const GroupInformationModal = ({ 
  reservationData, 
  isOpen, 
  toggle, 
  onSave 
}) => {
  const [companyDetails, setCompanyDetails] = useState(null);
  const [stepper, setStepper] = useState(null);
  const [stepper2, setstepper2] = useState(null);
  const [showEdit, editButton] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const ref = useRef(null);

  console.log("companyDetails",companyDetails)

  // Fetch company details when modal opens and groupID changes
  useEffect(() => {
    if (reservationData?.groupID) { // Safe chaining to prevent undefined error
      const fetchCompanyDetails = async () => {
        try {
          const response = await fetchx(
            API_URL + `/getIndividualAccountDetails?companyID=${reservationData.groupID}`
          );
          const data = await response.json();
          setCompanyDetails(data.data[0]); // Assuming first item is the company details
        } catch (error) {
          console.error("Error fetching company details:", error);
        }
      };
  
      fetchCompanyDetails();
    }
  }, [reservationData]); // Watch the whole object instead of just `groupID`
  


  const steps2 = [
    {
      id: "companyInformation",
      title: "Company Information",
      subtitle: "Edit Your Company Information.",
      // icon: <FileText size={18} />,
      content: (
        <EditCompanyInformation
          data1={companyDetails}
          stepper2={stepper2}
          type="wizard-modern"
        />
      ),
    },
    {
      id: "btc",
      title: "BTC Details",
      subtitle: "Edit BTC Details",
      // icon: <User size={18} />,
      content: <EditBTC data1={companyDetails}  stepper2={stepper2} type="wizard-modern" />,
    },
    {
      id: "editBooker",
      title: "Bookers",
      subtitle: "Edit Booker Details",
      // icon: <MapPin size={18} />,
      content: (
        <EditBooker data1={companyDetails}  stepper2={stepper2}  type="wizard-modern" />
      ),
    },
    {
      id: "rateCode",
      title: "RateCode",
      subtitle: "View Rate Code Details",
      // icon: <MapPin size={18} />,
      content: (
        <RateCodeDetails data1={companyDetails} stepper={stepper} type="wizard-modern" />
      ),
    },  
  ];


  // Toggle full details view
  const toggleFullDetails = () => {
    setShowFullDetails(!showFullDetails);
  };

  if (!companyDetails) {
    return null; // Or a loading spinner
  }

  return (
    <>


<Card>
        <div className="vertically-centered-modal">
          <Modal
            isOpen={showEdit}
            toggle={() => editButton(!showEdit)}
            className="modal-xl"
          >
            <ModalHeader toggle={() => editButton(!showEdit)}>
              Account Information
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



      {/* Full Details Modal */}
      <Modal 
        isOpen={isOpen} 
        toggle={toggle} 
        className="modal-lg"
      >
        <ModalHeader  toggle={toggle} >         
          Account Information
        </ModalHeader>
        <ModalBody>
          <div>
          <div className="d-flex">
                <Button
                  className="me-1"
                  style={{ marginLeft: "auto" }}
                  color="primary"
                  onClick={() => {
                    companyDetails.length != 0 && editButton(!showEdit); }} >
                  Edit
                </Button>
              </div>
            <Card>
              <div>                  
                <p><b><center>VIEW PROFILE</center></b></p>                  
                <Row>
                  <Col>
                    {/* Overview Accordion */}
                    <UncontrolledAccordion defaultOpen='1'>
                      <AccordionItem>
                        <AccordionHeader
                          style={{ backgroundColor: "#F2E5D9" }}
                          targetId="1"
                        >
                          <b>Overview</b>
                        </AccordionHeader>
                        <AccordionBody accordionId="1">
                          <Card> 
                            <div className="d-flex p-1 border">
                              <Row>
                                <Col md="6" sm="12" className="mb-1">
                                  <h5><b>Company Basic Details</b></h5>
                                  <h6>Account Name: <b>{companyDetails.accountName}</b></h6>
                                  <h6>Email: <b>{companyDetails.email}</b></h6>
                                  <h6>Phone Number: <b>{companyDetails.phoneNumber}</b></h6>
                                </Col>

                                <Col md="6" sm="12" className="mb-1">
                                  <h5><b>Address Details</b></h5>
                                  <h6>Address One: <b>{companyDetails.addressLine1}</b></h6>
                                  <h6>Address Two: <b>{companyDetails.addressLine2}</b></h6>
                                  <h6>Country: <b>{companyDetails.name}</b></h6>
                                  <h6>State: <b>{companyDetails.state}</b></h6>
                                  <h6>City: <b>{companyDetails.city}</b></h6>
                                  <h6>PostalCode: <b>{companyDetails.postalCode}</b></h6>
                                </Col>
                              </Row>
                            </div>                                  
                          </Card>
                        </AccordionBody>
                      </AccordionItem>
                    </UncontrolledAccordion>

                    {/* Account Details Accordion */}
                    <UncontrolledAccordion>
                      <AccordionItem>
                        <AccordionHeader
                          style={{ backgroundColor: "#F2E5D9" }}
                          targetId="1"
                        >
                          <b>Account Details</b>
                        </AccordionHeader>
                        <AccordionBody accordionId="1">
                          <Card>
                            <Row>
                              <Col>
                                <h6>Account Type: <b>{companyDetails.accountType}</b></h6>
                                <h6>GST ID: <b>{companyDetails.gstID}</b></h6>
                                <h6>IATA: <b>{companyDetails.IATA}</b></h6>
                                <h6>Secondary Email: <b>{companyDetails.secondaryEmail}</b></h6>
                                <h6>Notes: <b>{companyDetails.notes}</b></h6>
                                <h6>Account Manager: <b>{companyDetails.AccountAssociateName}</b></h6>
                                <h6>Financial Associate: <b>{companyDetails.financialAssociateName}</b></h6>
                              </Col>
                            </Row>
                          </Card>
                        </AccordionBody>
                      </AccordionItem>
                    </UncontrolledAccordion>

                    {/* BTC Details Accordion */}
                    <UncontrolledAccordion>
                      <AccordionItem>
                        <AccordionHeader
                          style={{ backgroundColor: "#F2E5D9" }}
                          targetId="1"
                        >
                          <b>BTC Details</b>
                        </AccordionHeader>
                        <AccordionBody accordionId="1">
                          <Row>
                            <Col>
                              <h6>BTC Approved: <b>{companyDetails.isBTCApproved === 1 ? 'YES' : 'NO'}</b></h6>
                              <h6>Credit Limit: <b>{companyDetails.creditLimit}</b></h6>
                              <h6>Tenure: <b>{companyDetails.tenure}</b></h6>
                            </Col>
                          </Row>
                        </AccordionBody>
                      </AccordionItem>
                    </UncontrolledAccordion>

                    {/* Booker Details Accordion */}
                    <UncontrolledAccordion>
                      <AccordionItem>
                        <AccordionHeader
                          style={{ backgroundColor: "#F2E5D9" }}
                          targetId="1"
                        >
                          <b>Booker Details</b>
                        </AccordionHeader>
                        <AccordionBody accordionId="1">
                          <EditbookerDetails data1={companyDetails}/>
                        </AccordionBody>
                      </AccordionItem>
                    </UncontrolledAccordion>

                    {/* Rate Code Details Accordion */}
                    <UncontrolledAccordion>
                      <AccordionItem>
                        <AccordionHeader
                          style={{ backgroundColor: "#F2E5D9" }}
                          targetId="1"
                        >
                          <b>Rate Code Details</b>
                        </AccordionHeader>
                        <AccordionBody accordionId="1">
                          <Card>
                            <RateCodeBasicDetails data1={companyDetails}/>
                          </Card>
                        </AccordionBody>
                      </AccordionItem>
                    </UncontrolledAccordion>
                  </Col>
                </Row>
              </div>
            </Card>
          </div>
        </ModalBody>
       
      </Modal>
    </>
  );
};

export default GroupInformationModal;