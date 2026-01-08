import React from 'react';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';

const ActivityBox = (data) => {
    console.log(data)
    let activityData = data.data[0]
    return (
      <Card className='h-100' >
      <CardHeader style={{ background: '#7367f0', color: '#FFF', padding: '10px'  }}>
        <CardTitle className='mb-0' style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            Activity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Rooms&nbsp;&nbsp;&nbsp;&nbsp;  Persons
          </CardTitle>
        </CardHeader>
        {/* <CardBody style={{ padding: '2px'}}> */}
        <CardBody style={{ padding: '2px', height: '100%', overflow: 'auto' }}>

  <ul className='list-unstyled mb-0'>
    {/* <li className='mb-2 d-flex justify-content-between'>
      <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft:'60%' }}>Rooms</span>
      <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto', paddingRight:'10px' }}>Persons</span>
    </li> */}
    <li className='mb-1 d-flex justify-content-between' style={{paddingLeft:'10px'}}>
      <div style={{ marginRight: '20px', width: '60%' }}>
        <strong style={{ fontSize: '16px', color: '#000000' }}>Stayover:</strong>
      </div>
      <div style={{ width: '15%' }}>
        <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{activityData.stayOverRooms}</span>
      </div>
      <div style={{ width: '10%' }}>
        <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{activityData.stayOverPersons}</span>
      </div>
    </li>

    <li className='mb-1 d-flex justify-content-between' style={{paddingLeft:'10px'}}>
    <div style={{ marginRight: '20px', width: '60%' }}>
                <strong style={{ fontSize: '16px', color: '#000000' }}>Arrivals Expected:</strong>
      </div>
      <div style={{ width: '15%' }}>
        <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{activityData.expArrivalRooms}</span>
      </div>
      <div style={{ width: '10%' }}>
        <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{activityData.expArrivalPersons}</span>
      </div>
    </li>
    <li className='mb-1 d-flex justify-content-between' style={{paddingLeft:'10px'}}>
    <div style={{ marginRight: '20px', width: '60%' }}>
                <strong style={{ fontSize: '16px', color: '#000000' }}>Arrivals Actual:</strong>
      </div>
      <div style={{ width: '15%' }}>
        <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{activityData.actualArrivalPersons}</span>
      </div>
      <div style={{ width: '10%' }}>
        <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{activityData.actualArrivalRooms}</span>
      </div>
    </li>
    <li className='mb-1 d-flex justify-content-between' style={{paddingLeft:'10px'}}>    
    <div style={{ marginRight: '20px', width: '60%' }}>
        <strong style={{ fontSize: '16px', color: '#000000' }}>Departures Expected:</strong>
      </div>
      <div style={{ width: '15%' }}>
        <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{activityData.expDepartureRooms}</span>
      </div>
      <div style={{ width: '10%' }}>
        <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{activityData.expDeparturePersons}</span>
      </div>
    </li>
    <li className='mb-1 d-flex justify-content-between' style={{paddingLeft:'10px'}}>
    <div style={{ marginRight: '20px', width: '60%' }}>
        <strong style={{ fontSize: '16px', color: '#000000' }}>Departures Actual:</strong>
      </div>
      <div style={{ width: '15%' }}>
        <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{activityData.actualDepartureRooms}</span>
      </div>
      <div style={{ width: '10%' }}>
        <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{activityData.actualDeparturePersons}</span>
      </div>
    </li>
  </ul>
</CardBody>


      </Card>
    );
  };
  

const ProjectionBox = ({data, rowData}) => {
    console.log(data,rowData)
    let roomData = data.room[0]
    console.log(roomData)
    let projectionData = rowData[0]
    console.log(projectionData)
    let maxOccupied = projectionData.stayOverRooms + projectionData.expArrivalRooms + projectionData.actualArrivalRooms + roomData.pendingRooms;
    let maxOccupiedPercentage = (maxOccupied * 100) / roomData.totalRooms
    let minAvailableTonight = roomData.totalRooms - (maxOccupied + roomData.outOfOrder)
  return (
    <Card className='h-100'>
      <CardHeader style={{ background: '#7367f0', color: '#FFF', padding: '10px'  }}>
        <CardTitle className='mb-0' style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          End Of Day Projection
        </CardTitle>
      </CardHeader>
      <CardBody style={{ padding: '20px' }}>
        <ul className='list-unstyled mb-0'>
          <li className='mb-1 d-flex justify-content-between'>
            <strong style={{ fontSize: '16px', color: '#000000', marginRight: '20px' }}>Min Available Tonight:</strong>
            <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{minAvailableTonight || 0}</span>
          </li>
          <li className='mb-1 d-flex justify-content-between'>
            <strong style={{ fontSize: '16px', color: '#000000', marginRight: '20px' }}>Max Occupied Tonight:</strong>
            <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{maxOccupied || 0}</span>
          </li>
          <li className='mb-1 d-flex justify-content-between'>
            <strong style={{ fontSize: '16px', color: '#000000', marginRight: '20px' }}>Max % Occupied Tonight:</strong>
            <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold', marginLeft: 'auto' }}>{maxOccupiedPercentage.toFixed(1) || 0}</span>
          </li>
        </ul>
      </CardBody>
    </Card>
  );
};

export { ActivityBox, ProjectionBox };
