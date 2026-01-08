// // ** Custom Components
import React, { useEffect, useState } from 'react'
import ValidationThirdPartyComponents from './RoomCardShow'
// import ChangeRoomFloor from './changeRoomFloor'
// import "./roomChange.scss"
// import GetAvailability from './getAvailability'
// // import App from './fullCalender'
// import AvailabilityTable from './availabilityTable'
// imo
import { Nav,TabPane,NavItem,NavLink,TabContent, Table} from 'reactstrap'
import { Fragment } from 'react'
import API_URL from '../../../config'
import { type } from 'jquery'
// import RoomMove from './roomMove'
localStorage.removeItem('reservationStart')
localStorage.removeItem('reservationEnd')
const Availability = ({RoomData,roomAssign,toggleModal,assignUnassign,toggleCloseAssign,toggleModal2, reservationID}) => {
  const [active, setActive] = useState('')
  const [reload, setreload] = useState(true)
  const [roomData, setRoomData] = useState('')
  const [rowData, setRowData] = useState();
  let numFloors;
  useEffect(() => {
    fetchx(API_URL + '/getFloor?hotelID=1')
    .then(result => result.json())
    .then((rowData) => {
      numFloors = rowData['data'].length 
      const sortedData = rowData['data'].sort((a, b) => a.floor - b.floor);
setRowData(sortedData);
numFloors = rowData['data'].length 
   if (sortedData.length > 0) {
            setActive(sortedData[0].id.toString());
   }
    })
    .catch((err) => {
      //console.log(err.message);
   });
  }, []);
  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)  
      setreload(false)
      setTimeout(()=>{setreload(true)},1)
    }
  }
  useEffect(() => {
    setRoomData(RoomData) 
  })
  return (
    <div>
    <Fragment>
   
<Nav tabs className='tab'>
  {rowData && rowData.length > 0 ? (
    rowData.map((floorData, index) => {
      const floorID = floorData.id.toString();
      const floorIDNo = floorData.floor.toString();
      return (
        <NavItem key={floorID}>
          <NavLink
            active={active === floorID}
            onClick={() => {
              toggle(floorID);
            }}
          >
            Floor-{floorIDNo}
          </NavLink>
        </NavItem>
      );
    })
  ) : (
    <NavItem>
      <NavLink disabled>No Floors Available</NavLink>
    </NavItem>
  )}
</Nav>
    </Fragment>   
    {reload && <TabContent activeTab={active}>
        <TabPane tabId={active}>
        {active!='' && <ValidationThirdPartyComponents floorid={active} roomAssign={roomAssign} RoomData={RoomData} toggleModal={toggleModal} assignUnassign={assignUnassign} toggleCloseAssign={toggleCloseAssign} toggleModal2={toggleModal2} reservationID={reservationID}/>}
        </TabPane>
        </TabContent>}
    </div>
  )
}
export default Availability