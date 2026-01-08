import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Button, Card, CardTitle, CardBody, Row, Col } from 'reactstrap';
import { Printer, RefreshCw } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../../config'
import { format } from 'date-fns';
import { handleLogout } from '@store/authentication';
import { useDispatch } from 'react-redux';
const StyledTopCards = styled.div`
  /* Add your global styles here if needed */
  .cardContainer {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .card {
    background-color: #fff; /* Change to your desired default color */
    height: 60px;
  }
  .cardTitle {
    color: white;
    margin-bottom: 0;
    font-weight: bold;
  }
  .headerContainer {
    display: flex;
    background-color: rgb(85, 79, 149);
    color: white;
    padding: 6px;
    font-weight: 600;
    align-items: center;
    justify-content: space-between;
  }
  .buttonContainer {
    display: flex;
    align-items: center;
  }
  .printButton,
  .refreshButton,
  .newReservationButton {
    color: white;
    margin-right: 10px;
    cursor: pointer;
  }
  .newReservationButton {
    background-color: #ff8f00;
    border: none;
    box-shadow: 0px 0px 5px 0px #17a2b8;
  }
`;
// const HighlightedCount = styled.span`
//   ${(props) => props.highlight && css`
//     background-color: ${props.cardColor || '#ff8f00'}; /* Use the card's color or a default color for highlighting */
//     color: white;
//     padding: 3px 6px;
//     border-radius: 4px;
//     font-weight: bold;
//   `}
// `;
const HighlightedCount = ({ highlight, cardColor, count }) => (
  <span style={{ backgroundColor: highlight ? 'yellow' : cardColor, color: highlight ? 'black' : 'white', padding: '3px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
  {/* </span> <span style={{ backgroundColor: highlight ? '#ADD8E6' : cardColor, color: 'white', padding: '3px 6px', borderRadius: '4px', fontWeight: 'bold' }}> */}
  {count}
</span>
);
const TopCards = () => {
  const [Today, setToday] = useState("");
  const [rowData, setRowData] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const hotelIDData = JSON.stringify({
      hotelID: 1
    });
    fetch(API_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelIDData
    }).then((res) => res.json())
      .then(postres => {
        if (postres.statusCode === 401) {
          dispatch(handleLogout());
          window.reload()
        } else {
          const today = new Date(postres['data'][0]['businessDate']);
          setToday(format(today, 'E MMM dd yyyy'));
        }
      });
  }, [dispatch]);
  useEffect(() => {
    fetch(API_URL + '/getAvailabilitryCount')
      .then(result => result.json())
      .then((rowData) => {
        setRowData(rowData['data'][0]);
      })
      .catch((err) => {
        // Handle error
      });
  }, []);
  function Refresh() {
    setTimeout(() => { navigate('/dashboard/groupreservation/allgroupreservations'); }, 100);
  }
  function NewReservation() {
    setTimeout(() => { navigate('/dashboard/groupreservation/createenquiry'); }, 10);
  }
  const cardData = [
    { name: 'ARRIVALS', color: '#78909C', count: rowData && rowData.length !== 0 && rowData['arrivalCount'] },
    { name: 'DEPARTURES', color: '#90A4AE', count: rowData && rowData.length !== 0 && rowData['departureCount'] },
    { name: 'AVAILABLE ROOMS', color: '#795548', count: rowData && rowData.length !== 0 && rowData['numAvlRooms'] },
    { name: 'OCCUPIED ROOMS', color: '#0277BD', count: rowData && rowData.length !== 0 && rowData['occupiedCount'] },
  ];
  return (
    <StyledTopCards>
      {/* <Row className="cardContainer">
        {cardData.map((card, index) => (
          <Col key={index}>
            <Card className="card" style={{ backgroundColor: card.color }}>
              <CardBody>
                <CardTitle tag="h4" className="cardTitle">
                  {card.name} 
                  {' '}
                  <HighlightedCount highlight={card.count !== undefined} cardColor={card.color} count={card.count} />
                </CardTitle>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row> */}
      <h1 className="headerContainer">
        <div>Group Reservations</div>
        <div className="buttonContainer">
          <Printer size={18} className="printButton" onClick={() => window.print()} />
          <RefreshCw size={18} className="refreshButton" onClick={Refresh} />
          <Button color="#ff8f00" onClick={NewReservation} className="newReservationButton">
            New Enquiry
          </Button>
        </div>
      </h1>
    </StyledTopCards>
  );
};
export default TopCards;
