// ** Custom Components
import React, { useState } from 'react'
import "./frontDesk.scss"
// import ModalBasic from './changeRoom'
import TableWithData from './table'
import TopCards from './topcard'

const TableBordered = () => {
  return (
    
    <div className='frontdesk'>
      <TopCards/>
        <TableWithData/>
        {/* <ModalBasic/> */}
    </div>
  )
}

export default TableBordered
