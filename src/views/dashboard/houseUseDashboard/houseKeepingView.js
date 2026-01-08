import React, { useState, useEffect } from 'react';
import API_URL from '../../../config';
import { ActivityBox, ProjectionBox } from './activityAndProjection'; // Adjust the import path
import { Col, Row, Card, CardBody, CardHeader,CardTitle } from 'reactstrap';

const YourDataFetchingComponent = (data) => {
  console.log(data)
  const [rowData, setRowData] = useState([]);
  const [rowData2, setRowData2] = useState();

  useEffect(() => {
    fetchx(API_URL + "/getHousekeepingStatus", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
    })
    .then((res) => res.json())
    .then(postres => {
        console.log(postres['data'])
      setRowData(postres['data']);
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
    });



    fetchx(API_URL + "/getActivityForDashboard", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
    })
    .then((res) => res.json())
    .then(postres => {
        // console.log(postres['data'])
        if(postres.statusCode === 200){
      setRowData2(postres['data']);
        }
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
    });
  }, []);

  // Creating an object to hold counts for each combination of room_status and front_office_status
  const counts = {};
  for (const item of rowData) {
    if (!counts[item.room_status]) {
      counts[item.room_status] = {};
    }
    counts[item.room_status][item.front_office_status] = item.count;
  }

  // Getting unique front_office_status values
  const frontOfficeStatuses = [...new Set(rowData.map((item) => item.front_office_status))];

  // Define CSS classes based on room status
  const getRowStyle = (roomStatus) => {
    switch (roomStatus) {
      case 'Clean':
        return { backgroundColor: 'rgba(32, 178, 227, 0.6)', color: '#111', fontWeight: 'bold' };
      case 'Inspected':
        return { backgroundColor: 'rgba(0, 255, 0, 0.6)', color: '#111', fontWeight: 'bold' };
      case 'Dirty':
        return { backgroundColor: 'rgba(255, 0, 0, 0.6)', color: '#111', fontWeight: 'bold' };
      case 'Out Of Order':
        return { backgroundColor: 'rgba(128, 128, 128, 0.6)', color: '#111', fontWeight: 'bold' };
      default:
        return { backgroundColor: 'rgba(255,146,42, 0.6)', color: '#111', fontWeight: 'bold' }; // Slightly darker light yellow
    }
  };
  

  // Rendering table headers for front_office_status
// const renderHeaders = () => {
//   const headerStyle = { fontWeight: 'bold', color: '#111' };

//   return (
//     <tr>
//       <th style={headerStyle}>Room Status&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
//       {frontOfficeStatuses.map((status, index) => (
//         if(index ===0 ){
//         <th key={index} style={headerStyle}>{status}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
//       }
//       else{
//         <th key={index} style={headerStyle}>{status}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>

//       }

        
//       )
//       )}
//     </tr>
//   );
// };




  // Rendering table headers for front_office_status
  const renderHeaders = () => {
    const headerStyle = { fontWeight: 'bold', color: '#FFF' };
  
    return (
      <tr>
        <th style={headerStyle}>
          <span style={{ whiteSpace: 'pre' }}>Room Status&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </th>
        {frontOfficeStatuses.map((status, index) => (
          <th key={index} style={headerStyle}>
            <span style={{ whiteSpace: 'pre' }}>{index === 0 ? `${status+'          '}` : `${status}`}</span>
          </th>
        ))}
      </tr>
    );
    
    
  };

  const renderRows = () => {
    return Object.keys(counts).map((roomStatus, index) => (
      <tr key={index} style={getRowStyle(roomStatus)}>
        <td style={{ color: '#111', fontWeight: 'bold' }}>{roomStatus}</td>
        {frontOfficeStatuses.map((foStatus, foIndex) => (
          <td key={foIndex} style={{ fontWeight: 'bold' }}>
            {counts[roomStatus][foStatus] || 0}
          </td>
        ))}
      </tr>
    ));
  };


  return (
    <div className="table-responsive">
            <Row>
      <Col lg='4' md='12'  style={{ height: '280px' }}>
        {rowData2 && <ActivityBox data={rowData2} /> }
      </Col>
      <Col lg='4' md='12'  style={{ height: '280px' }}>
        { data && rowData2 && <ProjectionBox data={data} rowData={rowData2}/>}
      </Col>
     
      <Col lg='4' md='12' >
        {/* <br></br>
        <strong style={{ fontSize: '16px', color: '#000000', marginRight: '20px' }}>Housekeeping Room Status</strong>
        <br></br>
        <br></br> */}
        <Card>

        <CardHeader style={{ background: '#7367f0', color: '#FFF', padding:'10px' }}>
          <CardTitle className='mb-0' style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          Housekeeping Room Status
          <table >
         
         {renderHeaders()}

         </table>
          </CardTitle>
        </CardHeader>
        <table className="table table-bordered"  style={{ height: '150px' }}>
          <tbody>{renderRows()}</tbody>
        </table>
        </Card>
      </Col>
    </Row>

    </div>
  );
};

export default YourDataFetchingComponent;
