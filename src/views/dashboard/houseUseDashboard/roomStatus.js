import React from 'react';
import { Col, Card,CardBody,CardHeader,CardTitle } from 'reactstrap';

const RoomSummary = (data) => {
  console.log(data.room)
  let room=data.room[0]
  return (
    // <Col lg='4' md='12'>
      <Card className='h-60'>
        <CardHeader style={{ background: '#7367f0', color: '#FFF', padding: '10px'  }}>
          <CardTitle className='mb-0' style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            Room Summary
          </CardTitle>
        </CardHeader>
        <CardBody style={{ padding: '8px' }}>
          {/* <ul className='list-unstyled mb-0'> */}
          <ul className="list-unstyled mb-0" style={{ lineHeight: '1.0' }}>
            <li className='mb-1 d-flex justify-content-between'>
              <strong style={{ fontSize: '16px', color: '#000000', marginRight: '20px' }}>Total Physical Rooms:</strong>
              <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{room['totalRooms']}</span>
            </li>
            <li className='mb-1 d-flex justify-content-between'>
              <strong style={{ fontSize: '16px', color: '#000000' }}>Out Of Order:</strong>
              <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{room['outOfOrder']}</span>
            </li>
            <li className='mb-1 d-flex justify-content-between'>
              <strong style={{ fontSize: '16px', color: '#000000' }}>Out Of Service:</strong>
              <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{room['outOfService']}</span>
            </li>
            <li className='mb-1 d-flex justify-content-between'>
              <strong style={{ fontSize: '16px', color: '#000000' }}>Total Rooms To Sell:</strong>
              <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{room['totalRoomsToSell']}</span>
            </li>
            <li className='mb-1 d-flex justify-content-between'>
              <strong style={{ fontSize: '16px', color: '#000000' }}>Total Group Pending Rooms:</strong>
              <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{room['pendingRooms'] || 0}</span>
            </li>
          </ul>
        </CardBody>
      </Card>
    // </Col>
  );
};


export default RoomSummary
