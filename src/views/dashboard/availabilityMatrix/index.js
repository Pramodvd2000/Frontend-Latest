// ** Custom Components
import React, { useState } from 'react'
import AvailabilityMatrix from './availabilityMatrix'
import SubMatrix from './subMatrix'
import {UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'
import { MoreVertical, List, Grid } from 'react-feather'

const Availability = () => {
  const [open, setOpen] = useState(true)

  return (
    <div className='availability'>
      <div className="d-flex justify-content-end">
        <UncontrolledDropdown>
          <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
            <MoreVertical size={20} />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem href='/' onClick={function(e) { e.preventDefault(); setOpen(true); }}>
              <List className='me-50' size={15} /> <span className='align-middle' >Inventory View</span>
            </DropdownItem>
            <DropdownItem href='/' onClick={function(e) { e.preventDefault(); setOpen(false); }}>
              <Grid className='me-50' size={15} /> <span className='align-middle'>Occupancy View</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        {/* <AvailabilityMatrix/> */}
      </div>
      {open === true && <AvailabilityMatrix/>}
        {open === false &&  <SubMatrix/>}
    </div>
  )
}

export default Availability