// ** Custom Components
import React, { useState } from 'react'
// import ModalBasic from './changeRoom'


import Billing from './OnHoldBilling'

const TableBordered = () => {
  console.log(localStorage.getItem('reservationID'))
  if(localStorage.getItem('reservationID')!=null){
    console.log('Setting reservationID in session s6torage',localStorage.getItem('reservationID'))
    sessionStorage.setItem('reservationID',localStorage.getItem('reservationID'))
    sessionStorage.setItem('FolioTabNo',0)
    localStorage.removeItem('reservationID')
  
  }
  console.log('In index')
  return (
    <div>
    <h4>Billing</h4>

      <Billing/>
        
    </div>
  )
}

export default TableBordered

