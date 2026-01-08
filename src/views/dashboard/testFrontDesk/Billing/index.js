// ** Custom Components
import React, { useEffect, useState } from 'react'
// import ModalBasic from './changeRoom'
import {Button} from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import API_URL from "../../../../config";


import Billing from './Billing'

const TableBordered = () => {
  const [Today, setToday] = useState(null)



  useEffect(() => {

    if(Today===null){
        fetchx(API_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotelID: 1,
      })
    }).then(result => result.json())
      .then(resp => {
        setToday(resp['data'][0]['businessDate'])
      }).catch((error) => {
      })
    }

  },[Today])

  const navigate = useNavigate()
  // console.log(localStorage.getItem('reservationID'))
  if(localStorage.getItem('reservationID')!=null){
    // console.log('Setting reservationID in session s6torage',localStorage.getItem('reservationID'))
    sessionStorage.setItem('reservationID',localStorage.getItem('reservationID'))
    sessionStorage.setItem('FolioTabNo',0)
    sessionStorage.setItem('activeFolioState',0)
    localStorage.removeItem('reservationID')
  
  }
  return (
    <div>
   <div className='me-1' style={{ display: 'flex', alignItems: 'center' }}>
  <Button className='me-1' size='sm' outline style={{ marginRight: '1rem' }} color='primary' onClick ={() => navigate('/dashboard/frontdesk')}>
    Back
  </Button>
  <h4>Billing</h4>
</div><br></br>
      {Today!=null && <Billing Today={Today}  />}
      
        
    </div>
  )
}

export default TableBordered

