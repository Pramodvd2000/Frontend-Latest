import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import EditWizard from './EditWizard'

const EditRateModal = ({ isOpen, toggle, rateCodeId }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-xl">
      <ModalHeader toggle={toggle}>
        Edit Rate Code
      </ModalHeader>
      <ModalBody>
        <EditWizard rateCodeId={rateCodeId} onComplete={toggle} />
      </ModalBody>
    </Modal>
  )
}

export default EditRateModal