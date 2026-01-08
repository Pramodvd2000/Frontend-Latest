import React, { useState, useEffect } from 'react';
import API_URL from '../../../../config';

const YourDataFetchingComponent = () => {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    fetchx(API_URL + "/getHousekeepingStatus", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
    })
    .then((res) => res.json())
    .then(postres => {
        // console.log(postres['data'])
      setRowData(postres['data']);
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
const renderHeaders = () => {
  const headerStyle = { fontWeight: 'bold', color: '#111' };

  return (
    <tr>
      <th style={headerStyle}>Room Status</th>
      {frontOfficeStatuses.map((status, index) => (
        <th key={index} style={headerStyle}>{status}</th>
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
      <h1>Housekeeping Room Status</h1><br></br>
      <table className="table table-bordered">
        <thead>{renderHeaders()}</thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
};

export default YourDataFetchingComponent;
