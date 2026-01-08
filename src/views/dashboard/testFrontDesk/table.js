// ** Custom Components
import React, { Fragment, useState, useEffect } from 'react'
import "./frontDesk.scss"
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Input, Form, Label, CardText,CardFooter , Nav,TabPane,NavItem,NavLink,TabContent, Table} from 'reactstrap'
// import{Card, CardHeader, CardTitle, CardBody,} from 'react'
// ** Icons Imports
// import { MoreVertical, Edit, Trash, Search, CheckSquare } from 'react-feather'
// import AddSharer from './addSharer'
// import ModalBasic from './changeRoom'
// import Others from './others'
// import ButtonOption from './addSharer'
// import { render } from 'react-dom'
// import { ReactDOM } from 'react'
// import Buttons from './otherButtons'
import "./roomChange.scss"
// import ChangeRoom from './changeRoomForm1'
// import ChangeRoomFloor from './changeRoomFloor'
// import ChangeRoomlastForm from './ChangeRoomformlast'
import AllReservation from './allReservation'
// import Arrivals from './arrivals'
import Departures from './departures'
import InHouseGuest from './inHouseGuest'
import Today from './today'
import Tomorrow from './tomorrow'
// import AssignRoom from './assignRoom'
import StayOver from './stayOver'
import TomarrowDep from './tomarrowDep'
import AllDefiniteReservations from './allGroupReservation'
import AdvanceSearch from './advanceSearch'
import API_URL from '../../../config'


const TableWithData = () => {
  // ** State
  // const [active, setActive] = useState('4')
  // const [arrivalTab, setArrivalTab] = useState('6'); 

  const [active, setActive] = useState(sessionStorage.getItem('activeTab') || '4');
  const [arrivalTab, setArrivalTab] = useState(sessionStorage.getItem('arrivalTab') || '6');
  const [hotelID, sethotelID] = useState()
      
// console.log(sessionStorage.getItem('setActiveTab'))
  
useEffect(() => {
  sessionStorage.setItem('activeTab', active);
  sessionStorage.setItem('arrivalTab', arrivalTab);
}, [active, arrivalTab]);
      
// console.log(sessionStorage.getItem('setActiveTab'))
  
useEffect(() => {
  const hotelIDData = JSON.stringify({
    hotelID: 1
  });
  fetch(API_URL + "/getBusinessDate", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: hotelIDData
  })
    .then((res) => res.json())
    .then(resp => {
      if (resp.data[0].id === 10) {
        sethotelID(resp.data[0].id)
      }
    })
})

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
      if (tab === '2') {
        setArrivalTab('6');

      }
      else  if (tab === '3') {
        setArrivalTab('8');

      }
    }
  }
  return (
    <div>
    <Fragment>
      
      <Nav tabs filled>
      <NavItem>
          <NavLink
            active={active === '4'}
            onClick={() => {
              toggle('4')
            }}
          >
            IN-HOUSE GUESTS
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            ARRIVALS
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            DEPARTURES
          </NavLink>
        </NavItem>
      <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            ALL RESERVATIONS
          </NavLink>
        </NavItem>
      
        
        
        <NavItem>
          <NavLink
            active={active === '5'}
            onClick={() => {
              toggle('5')
            }}
          >
            STAYOVERS
          </NavLink>
        </NavItem>

       { hotelID &&  <NavItem>
          <NavLink
            active={active === '8'}
            onClick={() => {
              toggle('8')
            }}
          >
            GROUP BOOKINGS
          </NavLink>
        </NavItem>}


        <NavItem>
          <NavLink
            active={active === '15'}
            onClick={() => {
              toggle('15')
            }}
          >
            ADVANCED SEARCH
          </NavLink>
        </NavItem>
       


      </Nav>
     {active==='2' && <Nav tabs filled>
      <NavItem>
          <NavLink
            active={arrivalTab === '6'}
            onClick={() => {
              toggle('2');
              setArrivalTab('6');
            }}
          >
            TODAY
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
              active={arrivalTab === '7'}
              onClick={() => {
                toggle('2');
                setArrivalTab('7');
            }}
          >
            TOMORROW
          </NavLink>
        </NavItem>
      </Nav>}

      {active==='3' && <Nav tabs filled>
      <NavItem>
          <NavLink
            active={arrivalTab === '8'}
            onClick={() => {
              toggle('3');
              setArrivalTab('8');
            }}
          >
            TODAY
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
              active={arrivalTab === '9'}
              onClick={() => {
                toggle('3');
                setArrivalTab('9');
            }}
          >
            TOMORROW
          </NavLink>
        </NavItem>
      </Nav>}
      
    </Fragment>
  

       {/*  All Reservations */}

       {active==='1' && <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <AllReservation/>
        </TabPane>
        </TabContent>}


        {/* Arrivals */}

        {/* <TabContent activeTab={active}>
        <TabPane tabId='2'>
          <Arrivals/>
        </TabPane>
        </TabContent> */}


        {/* Departures */}

        {/* <TabContent activeTab={active}>
        <TabPane tabId='3'> */}
          { active==='3' && arrivalTab=== '8' && <Departures/>}
        {/* </TabPane>
        </TabContent> */}
          { active==='3' && arrivalTab=== '9' && <TomarrowDep/>}

         {/* In House Guests */}

         {active==='4' && <TabContent activeTab={active}>
        <TabPane tabId='4'>
          <InHouseGuest/>
        </TabPane>
        </TabContent>}


         {/* Today */}

         {/* <TabContent activeTab={active}>
        <TabPane tabId='6'> */}
          {active==='2' && arrivalTab === '6' && <Today/>}
        {/* </TabPane>
        </TabContent> */}


           {/* Tomorrow */}

           {/* <TabContent activeTab={active}>
        <TabPane tabId='7'> */}
        {active==='2' && arrivalTab === '7' && <Tomorrow/>}
        {/* </TabPane>
        </TabContent> */}

        {/* StayOver */}
        {active==='5' && 
        <TabContent activeTab={active}>
        <TabPane tabId='5'>
          <StayOver/>
        </TabPane>
        </TabContent>}

         {active==='8' && 
        <TabContent activeTab={active}>
        <TabPane tabId='8'>
          <AllDefiniteReservations />
        </TabPane>
        </TabContent>}

         {/*  All Reservations */}

       {active==='15' && <TabContent activeTab={active}>
        <TabPane tabId='15'>
          <AdvanceSearch/>
        </TabPane>
        </TabContent>}
</div>
  )
}
export default TableWithData
