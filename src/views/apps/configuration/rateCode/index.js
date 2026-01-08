import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Card, Row, Col } from 'reactstrap'
import { Edit2 } from "react-feather"
import { AgGridReact } from 'ag-grid-react'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, UncontrolledAccordion } from 'reactstrap'
import API_URL from '../../../../config'
import RatesMap from './newRateMap'

// ** Custom Components
import Wizard from '@components/wizard'

// ** Steps
import AccountMap from './steps-with-validation/AccountMap'
import ExtrasMap from './steps-with-validation/ExtrasMap'
import RoomRates from './steps-with-validation/RoomRates'
import RateCodeDetails from './steps-with-validation/RateCodeDetails'

// For edit modals

import EditRateModal from './steps-with-validation/EditRateModal'

const WizardHorizontal = () => {
  // ** Refs
  const wizardRef = useRef(null)
  const gridRef = useRef()

  // ** State
  const [stepper, setStepper] = useState(null)
  const [open, setOpen] = useState('')
  const [rowData, setRowData] = useState([])
  const [filldata, setfilldata] = useState("")
  const [show, setShow] = useState(false)
  const [rateCodeId, setRateCodeId] = useState(null)

  //For edit Modal

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingRateCodeId, setEditingRateCodeId] = useState(null)

  const steps = [
    {
      id: 'account-details',
      title: 'Rate Code Details',
      subtitle: 'Enter Rate Code Details.',
      content: <RateCodeDetails stepper={stepper} rateCodeId={rateCodeId} setRateCodeId={setRateCodeId}/>
    },
    {
      id: 'personal-info',
      title: 'Add Room Rates',
      subtitle: 'Enter Room Rates',
      content: <RoomRates stepper={stepper} rateCodeId={rateCodeId}/>
    },
    {
      id: 'step-address',
      title: 'Map Account',
      subtitle: 'Add Account/Company',
      content: <AccountMap stepper={stepper} rateCodeId={rateCodeId}/>
    },
    {
      id: 'social-links',
      title: 'Map Extras',
      subtitle: 'Add Extras',
      content: <ExtrasMap stepper={stepper} rateCodeId={rateCodeId}/>
    }
  ]

  // Toggle function for accordion
  const toggle = id => {
    setOpen(prevOpen => (prevOpen === id ? '' : id))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/getRateCode?hotelID=1`)
        const result = await response.json()
        setRowData(result.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    
    fetchData()
  }, [])

  const cellClickedListener = useCallback((event) => {
    setfilldata(event.data)
  }, [])

  const actionButton = (data) => {
    setfilldata(data)
    setShow(!show)
  }


  const EditData = (data) => {
    setEditingRateCodeId(data.id) 
    setEditModalOpen(true)
  }

  const columnDefs = [
    {
      headerName: "Rate Code",
      field: "rateCode",
      suppressSizeToFit: true,
      maxWidth: 200,
      cellStyle: { textAlign: "center", backgroundColor: "#F1E39B" },
    },
    {
      headerName: "Description",
      field: "description",
      suppressSizeToFit: true,
      maxWidth: 240,
      cellStyle: { textAlign: "center", backgroundColor: "pink" },
    },
    {
      headerName: "Begin Date",
      field: "beginSellDate",
      suppressSizeToFit: true,
      maxWidth: 140,
      cellStyle: { textAlign: "center", backgroundColor: "#F1E39B" },
    },
    {
      headerName: "SellDate",
      field: "endSellDate",
      suppressSizeToFit: true,
      maxWidth: 140,
      cellStyle: { textAlign: "center", backgroundColor: "pink" },
    },
    {
      headerName: "Days Applicable",
      field: "daysApplicable",
      maxWidth: 160,
      cellStyle: { textAlign: "center", backgroundColor: "#F1E39B" },
    },
    {
      headerName: "Action",
      field: "numAvlRooms",
      suppressSizeToFit: true,
      maxWidth: 180,
      cellRenderer: (params) => (
        <Button color="primary" onClick={() => actionButton(params.data)}>         
          View Rates
        </Button>
      ),
    },
    {
      headerName: "Edit",
      field: "numAvlRooms",
      suppressSizeToFit: true,
      maxWidth: 120,
      cellRenderer: (params) => (
        <h5>
          <Edit2 
            style={{ height: "20px" }} 
            onClick={() => EditData(params.data)} 
            className="cursor-pointer"
          />                        
        </h5>
      ),
    },
  ]

  return (
    <><div>
      <Accordion className="accordion-margin" open={open} toggle={toggle}>
        <AccordionItem>
          <AccordionHeader targetId="wizard">Add New Rate Code</AccordionHeader>
          <AccordionBody accordionId="wizard">
            <div className="horizontal-wizard">
              <Wizard
                instance={setStepper}
                ref={wizardRef}
                steps={steps} />
            </div>
          </AccordionBody>
        </AccordionItem>
      </Accordion>

      <div className="mt-4">
        <div className="ag-theme-alpine" style={{ height: 540, width: 1200 }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            animateRows={true}
            rowSelection="multiple"
            onCellClicked={cellClickedListener}
            paginationPageSize={10}
            pagination={true}
            headerHeight={50} />
        </div>
      </div>

      {/* View Rate Details Modal */}
      <Card>
        <Modal isOpen={show} toggle={() => setShow(!show)} className="modal-lg">
          <ModalHeader toggle={() => setShow(!show)}>
            View Details
          </ModalHeader>
          <ModalBody>
            <Card>
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
                                  <b>Rate Code Basic Details</b>
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                  <Row>
                                    <Col>
                                      <div>
                                        <br />
                                        <h6>Rate Code: <b>{filldata.rateCode}</b></h6>
                                        <h6>Description: <b>{filldata.description}</b></h6>
                                        <h6>Begin Date: <b>{filldata.beginSellDate}</b></h6>
                                        <h6>Sell Date: <b>{filldata.endSellDate}</b></h6>
                                      </div>
                                    </Col>
                                    <Col>
                                      <div>
                                        <br />
                                        <h6>Market Code: <b>{filldata.marketCode}</b></h6>
                                        <h6>Source: <b>{filldata.sourceCode}</b></h6>
                                        <h6>Package: <b>{filldata.packageCode}</b></h6>
                                        <h6>Transaction Code: <b>{filldata.transactionCode}</b></h6>
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

                  <br />

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
                                  <b>RateCode Rates</b>
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                  <Row>
                                    <RatesMap data1={filldata} />
                                  </Row>
                                </AccordionBody>
                              </AccordionItem>
                            </UncontrolledAccordion>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Col>
              </Row>
              <br />
            </Card>
          </ModalBody>
        </Modal>
      </Card>
    </div><div>

        <EditRateModal
         className="modal-xl"
          isOpen={editModalOpen}
          toggle={() => setEditModalOpen(!editModalOpen)}
          rateCodeId={editingRateCodeId} />
      </div></>
  )
}

export default WizardHorizontal