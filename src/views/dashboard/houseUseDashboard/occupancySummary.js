import React from 'react';
import { Col, Card,CardBody,CardHeader,CardTitle } from 'reactstrap';

const RoomSummary = (data) => {
  let room=data.room[0]
  return (
    <Card className='h-60'>
        <CardHeader style={{background: '#7367f0', color: '#20B2E3', padding: '5px'  }}>
          <CardTitle className='mb-0' style={{ fontWeight: 'bold', fontSize: '1.2rem', color:'#FFF' }}>
          Occupancy Summary 
          </CardTitle>
        </CardHeader>
        <CardBody>
          <ul className='list-unstyled mb-0'>
            <br></br>
            <br></br>
            {/* <br></br> */}

            <li className='mb-1 d-flex justify-content-between'>
              <strong style={{ fontSize: '16px', color: '#000000', marginRight: '20px' }}>  Occupied Rooms </strong>
              <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold' , marginLeft: 'auto'}}> {room.occupiedRooms} </span>
            
            </li>
            <br></br>
            <br></br>
            {/* <br></br> */}

            <li className='mb-1 d-flex justify-content-between'>
              <strong style={{ fontSize: '16px', color: '#000000' }}>  Occupied Rooms Percentage </strong>
              <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold' , marginLeft: 'auto'}}> {room.occupiedRoomsPercentage.toFixed(2)}</span>
            </li>
            
          </ul>
        </CardBody>
      </Card>
  );
};


export default RoomSummary
