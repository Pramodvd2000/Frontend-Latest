// ** React Imports
import { useState, useRef, useEffect, useMemo, useCallback, useContext } from 'react';

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, CardTitle, CardHeader } from 'reactstrap'

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Demo Components
import RoomSummary from './roomStatus'
import ChartWiseView from './chartWiseView'
import OccupancySummary from './occupancySummary'
import ComplementryAndHouseUse from './complementryHouseUse'
import Housekeepingview from './houseKeepingView'
import API_URL from '../../../config';


// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'

const EcommerceDashboard = () => {
  // ** Context
  const { colors } = useContext(ThemeColors)

  // ** vars
  const trackBgColor = '#e9ecef'

  const [room, setRoomID] = useState([])


  useEffect(() => {
    const hotelIDData = JSON.stringify({
      hotelID: 1
    })
    fetchx(API_URL + "/roomDetailsForDashboard", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelIDData
    }).then((res) => res.json())
      .then((resp) => {
        // console.log(resp['data'])
        setRoomID(resp["data"])
        // console.log(room)
      })

      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
      
  }, []);


  return (
    <div id='dashboard-ecommerce' >
      <Row>
        {/* <Col lg='4' md='12'>
      <Card>
        <CardHeader style={{background: '#20B2E3', color: '#20B2E3' }}>
          <CardTitle className='mb-0' style={{ fontWeight: 'bold', fontSize: '1.2rem', color:'#FFF' }}>
            Room Summary
          </CardTitle>
        </CardHeader>
        <CardBody>
          <ul className='list-unstyled mb-0'>
            <br></br>
            <li className='mb-3 d-flex justify-content-between'>
              <strong style={{ fontSize: '16px', color: '#000000', marginRight: '20px' }}>Total Physical Rooms:</strong>
              <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold' , marginLeft: 'auto'}}>270</span>
            </li>
            <li className='mb-3 d-flex justify-content-between'>
              <strong style={{ fontSize: '16px', color: '#000000' }}>Out Of Order:</strong>
              <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold' , marginLeft: 'auto'}}>1</span>
            </li>
            <li className='mb-3 d-flex justify-content-between'>
              <strong style={{ fontSize: '16px', color: '#000000' }}>Out Of Service:</strong>
              <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold' , marginLeft: 'auto'}}>2</span>
            </li>
            <li className='mb-3 d-flex justify-content-between'>
              <strong style={{ fontSize: '16px', color: '#000000' }}>Total Rooms To Sell:</strong>
              <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold' , marginLeft: 'auto'}}>254</span>
            </li>
          </ul>
        </CardBody>
      </Card>
    </Col> */}

        <Col lg='4' md='8' style={{margin:'0'}}>
          {room.length !== 0 && <RoomSummary room={room} />}
        </Col>

        <Col lg='4' md='12'>
          {room.length !== 0 && <OccupancySummary room={room} />}
        </Col>

        <Col lg='4' md='4'   >

          {room.length !== 0 && <ChartWiseView room={room} />}
        </Col>
        <Col  >
        {room.length !== 0 && <ComplementryAndHouseUse room={room} />}
        </Col>
        {/* <Col lg='4' md='12'> */}
          {room.length !== 0 && <Housekeepingview room={room}  />}
        {/* </Col> */}
      </Row>



    </div>
  )
}

export default EcommerceDashboard
