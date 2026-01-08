// ** Reactstrap Imports
import { Table, Badge, Button, Row, Col,Input, Form, Label, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap'

// ** React Imports
import { Fragment, useState } from 'react'
import "./roomselection.scss"



const TableBordered = () => {

   // ** States
   const [basicModal, setBasicModal] = useState(false)
   const [centeredModal, setCenteredModal] = useState(false)
   const [disabledModal, setDisabledModal] = useState(false)
   const [disabledAnimation, setDisabledAnimation] = useState(false)

  return (
    <div>
    <h2 >Availability from 12-14-2022 to 12-16-2022 for 2 Rooms(3 Adults and 2 Children) 
</h2>
    <Table bordered responsive>         
      <thead>
        <tr>
        <th>Room Type</th>
          <th>Base Rate</th>
          <th>Total Rate</th>
          <th>BreakUp</th>
          <th>Availability</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
              <span className='align-middle fw-bold'>Dulex</span>
          </td>
          <td>5000</td>
          <td>
            15000
          </td>
          <td>
            <Button className='me-1' color='light-secondary' type='submit' onClick={e => setBasicModal(!basicModal)}>
            View BreakUp
            </Button>
          </td>
          
          <td>
            20
          </td>          
          <td>
            <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
              Add
            </Button>
          </td>          
        </tr>

        <tr>
          <td>
            <span className='align-middle fw-bold'>Dulex with BF</span>
          </td>
          <td>7000</td>
          <td>
            21500
          </td>
          <td>
            <Button className='me-1' color='light-secondary' type='submit' onClick={e => setBasicModal(!basicModal)}>
            View BreakUp
            </Button>
          </td>
          <td>
            11
          </td>
          <td>
          <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
                  Add
            </Button>  
          </td>
          
        </tr>

        <tr>
          <td>            
            <span className='align-middle fw-bold'>Suite</span>
          </td>
          <td>9000</td>
          <td>
            28500
          </td>
          <td>
            <Button className='me-1' color='light-secondary' type='submit' onClick={e => setBasicModal(!basicModal)}>
            View BreakUp
            </Button>
          </td>
          <td>
            8
          </td>
          <td>
          <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
                  Add
          </Button>  
          </td>          
        </tr>
        <tr>
          <td>            
            <span className='align-middle fw-bold'>Suite with BF</span>
          </td>
          <td>13000</td>
          <td>
            38540
          </td>
          <td>
            <Button className='me-1' color='light-secondary' type='submit' onClick={e => setBasicModal(!basicModal)}>
            View BreakUp
            </Button>
          </td>
          <td>
            6
          </td>
          <td>
          <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
                  Add
                </Button>  
          </td>         
        </tr>
      </tbody>
    </Table>


    {/* modals */}

    <div className='demo-inline-spacing'>
      <div className='basic-modal'>
        {/* <Button color='primary' outline onClick={() => setBasicModal(!basicModal)}>
          Basic Modal
        </Button> */}

        <div>

        <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
          <ModalHeader color='primary' toggle={() => setBasicModal(!basicModal)}>Amount BreakUp</ModalHeader>
          <ModalBody className='color'>
            <p>Day-1  5000/-</p>
            <p>Day-2  5000/-</p>
            <p>Day-3  5000/-</p>
          </ModalBody>
         
          <ModalFooter >
            <Button color='primary' onClick={() => setBasicModal(!basicModal)}>
              Ok
            </Button>
          </ModalFooter>
        </Modal>
        </div>
      </div>
      <div className='vertically-centered-modal'>
        {/* <Button color='primary' outline onClick={() => setCenteredModal(!centeredModal)}>
          Vertically Centered
        </Button> */}
        <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered'>
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Vertically Centered</ModalHeader>
          <ModalBody>
          <Form>
          <Row>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' aria-required for='nameMulti'>
                Hotel ID
              </Label>
              <Input type='number' name='Hotel ID' id='nameMulti' placeholder='Hotel ID' />
            </Col>     
            
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='CompanyMulti'>
                Floor
              </Label>
              <Input type='number' name='Floor' id='CompanyMulti' placeholder=' Floor' />
            </Col>  
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='CompanyMulti'>
                BlockId
              </Label>
              <Input type='number' name='BlockId' id='CompanyMulti' placeholder='BlockId ' />
            </Col>          
            <Col sm='12'>
            </Col>
          </Row>
        </Form>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => setCenteredModal(!centeredModal)}>
              Submit
            </Button>{' '}
            <Button outline color='primary' onClick={() => setCenteredModal(!centeredModal)}>
              Reset
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <div className='disabled-backdrop-modal'>
        <Fragment>
          {/* <Button color='primary' outline onClick={() => setDisabledModal(!disabledModal)}>
            Disabled Backdrop
          </Button> */}
          <Modal
            isOpen={disabledModal}
            toggle={() => setDisabledModal(!disabledModal)}
            className='modal-dialog-centered'
            backdrop={false}
          >
            <ModalHeader toggle={() => setDisabledModal(!disabledModal)}>Disabled Backdrop</ModalHeader>
            <ModalBody>
              Candy oat cake topping topping chocolate cake. Icing pudding jelly beans I love chocolate carrot cake
              wafer candy canes. Biscuit croissant fruitcake bonbon soufflé.
            </ModalBody>
            <ModalFooter>
              <Button color='primary' onClick={() => setDisabledModal(!disabledModal)}>
                Accept
              </Button>{' '}
            </ModalFooter>
          </Modal>
        </Fragment>
      </div>
      <div className='disabled-animation-modal'>
        {/* <Button color='primary' outline onClick={() => setDisabledAnimation(!disabledAnimation)}>
          Disabled Animation
        </Button> */}
        <Modal
          isOpen={disabledAnimation}
          toggle={() => setDisabledAnimation(!disabledAnimation)}
          className='modal-dialog-centered'
          fade={false}
        >
          <ModalHeader toggle={() => setDisabledAnimation(!disabledAnimation)}>Disabled Fade</ModalHeader>
          <ModalBody>
            Chocolate bar jelly dragée cupcake chocolate bar I love donut liquorice. Powder I love marzipan donut candy
            canes jelly-o. Dragée liquorice apple pie candy biscuit danish lemon drops sugar plum.
            <Alert className='mt-1' color='success'>
              <div className='alert-body'>Well done! You successfully read this important alert message.</div>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => setDisabledAnimation(!disabledAnimation)}>
              Accept
            </Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    </div>
    </div>
  )
}

export default TableBordered
