import React from 'react';
import { Button, Card, CardBody } from 'reactstrap';
import { BiSolidCopy } from "react-icons/bi";
import { GrInProgress } from "react-icons/gr";



const ScrollableButtonList = () => {
  const buttons = Array.from({ length: 1 }, (_, i) => `Folio#${i + 0}`);

  const cardStyle = {
    height: '640px',
    width: '100%',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
  };

  const cardBodyStyle = {
    overflowY: 'auto',
    flex: '1',
    height: '650px',
  };

  const folioRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    marginBottom: '8px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
      fontSize: '1.2rem'
  };

  const folioTextStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const folioIconStyle = {
    marginRight: '8px',
    fontSize: '1.2rem',
  };

  const closeButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.2rem',
  };

  const undoButtonContainerStyle = {
    padding: '8px',
    marginTop: 'auto',
  };

  const undoButtonStyle = {
    width: '100%',
    padding: '15px', // Increased padding for height
    fontSize: '1rem',
    fontWeight: '500',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    height: '50px', // Set a fixed height if needed
  };
  const undoButtonHoverStyle = {
    backgroundColor: '#c82333',
  };

  return (
    <Card style={cardStyle}>
      <CardBody style={cardBodyStyle}>
        {buttons.map((text, index) => (
          <div key={index} style={folioRowStyle}>
            <div style={folioTextStyle}>
            <BiSolidCopy style={{ marginRight: '8px' }} />
              <span>{text}</span>
              <GrInProgress style={{ marginLeft: '35px' }}  />

            </div>

          </div>
        ))}
      </CardBody>
      <div style={undoButtonContainerStyle}>
      <Button
          color='danger'
          style={undoButtonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = undoButtonHoverStyle.backgroundColor)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = undoButtonStyle.backgroundColor)}
        >
      <spam style={{fontSize:'15px'}}><strong>SPLIT BILL</strong></spam>
      </Button>
      </div>
    </Card>
  );
};

export default ScrollableButtonList;
