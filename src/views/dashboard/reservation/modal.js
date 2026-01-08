// ** React Imports
import {  useState } from 'react'

// ** Reactstrap Imports
import {  Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const ModalBasic = () => {
  // ** States
  const [basicModal, setBasicModal] = useState(false)
  const [centeredModal, setCenteredModal] = useState(false)
 

  return (
    <div className='demo-inline-spacing'>

      <div className='basic-modal'>
        <Button color='primary' outline onClick={() => setBasicModal(!basicModal)}>
          First
        </Button>
        <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
          <ModalHeader toggle={() => setBasicModal(!basicModal)}>Basic Modal</ModalHeader>
          <ModalBody>
            
           <p> Welcome... </p>
           <p>Your our New Customer. Please do fill Your Details</p>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => setBasicModal(!basicModal)}>
              Continue
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      <div className='basic-modal'>
        <Button color='primary' outline onClick={() => setBasicModal(!basicModal)}>
          Second
        </Button>
        <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
          <ModalHeader toggle={() => setBasicModal(!basicModal)}>Basic Modal</ModalHeader>
          <ModalBody>
            
           <p> Welcome... </p>
           <p>Your our Existing Customer. Please do Check Your Details</p>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => setBasicModal(!basicModal)}>
              Continue
            </Button>
          </ModalFooter>
        </Modal>
      </div>



    </div>
  )
}
export default ModalBasic
