import React, { useState } from 'react';
import { CgMenuBoxed } from "react-icons/cg";
import { RxCrossCircled } from "react-icons/rx";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import API_URL from '../../../config';
const MySwal = withReactContent(Swal);


const HelpScreen = ({ toggleHelpScreen }) => {
  const [selectedOptions, setSelectedOptions] = useState(['Call Steward', 'Get Bill', 'Clean Table', 'Get Water']);

  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };
  const generateNotificationMessage = (option,tableNo ) => {
    const messageMap = {
      'Get Bill': `Table ${tableNo} has requested the bill.`,
      'Call Steward': `Table ${tableNo} has requested your assistance at the table.`,
      'Clean Table': `Table ${tableNo} has requested the table to be cleaned.`,
      'Get Water': `Table ${tableNo} has requested water to be served.`
    };
    return messageMap[option] || `Table ${tableNo} has requested: ${option}`;
  };

  const handleRquestbutton = async () => {
    let tableNo = sessionStorage.getItem("TableSelected")
    const messages = selectedOptions.map(option => 
      generateNotificationMessage(option, tableNo)
    );

    const requestData = {
      hotelID: 10,
      storeID: 1,
      orderID: sessionStorage.getItem("orderID"),
      tableNo: sessionStorage.getItem("TableSelected"),
      bodymsg: messages.join(' | ')
    };

    try {
        let response = fetchx(API_URL + '/sendUserNotification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
      .then((res) => res.json())
      .then((post) => {
        // console.log("post")
        // console.log(post)
        const swalInstance = MySwal.fire({
          title: post['message'],
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            icon: 'swal2-icon-custom'
          },
          width: '300px',
          html: `
            <style>
              .swal2-popup-custom {
                padding: 0.75rem !important;
              }
              .swal2-icon-custom {
                margin: 0.5rem auto !important;
                transform: scale(0.9) !important;
              }
              .swal2-title-custom {
                font-size: 14px !important;
                color: #333 !important;
                margin: 0.5rem 0 !important;
                padding: 0 !important;
              }
              .btn.btn-danger {
                background-color: #dc3545;
                color: white;
                padding: 10px 18px;
                border-radius: 4px;
                margin-top: 0.5rem;
                border: none;
                cursor: pointer;
                font-size: 14px;
              }
              .btn.btn-danger:hover {
                background-color: #bb2d3b;
              }
              .swal2-html-container {
                margin: 0.2rem 0 !important;
              }
            </style>
          `
        });
      })
    } catch (error) {
      console.error('There was a problem with the request:', error);
      alert('Failed to send request. Please try again.');
    }

    toggleHelpScreen();
  };

  return (
    <>
      <div 
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 40 }}
        onClick={toggleHelpScreen}
      />
      
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderRadius: '30px 30px 0 0', zIndex: 50, paddingBottom: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', paddingBottom: '2px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#525252' }}>Need Help?</h2>
          <RxCrossCircled style={{ width: '24px', height: '24px' }} onClick={toggleHelpScreen} aria-label="Close" />
        </div>

        <div style={{ padding: '16px' }}>
          {['Call Steward', 'Get Bill', 'Clean Table', 'Get Water'].map(option => (
            <div key={option} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <input 
                type="checkbox" 
                style={{ width: '20px', height: '20px', border: '1px solid #ccc', borderRadius: '3px', marginRight: '8px' }}
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionClick(option)} 
              />
              <label style={{ color: '#525252' }}>{option}</label> 
            </div>
          ))}

          <div style={{ marginTop: '16px', backgroundColor: '#f0f0f0', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#525252', fontWeight: '500' }}>Your Table PASSCODE</div>
                <div style={{ color: '#999', fontSize: '12px' }}>Order with friends</div>
              </div>
              <div style={{ backgroundColor: '#ffd700', padding: '8px 16px', borderRadius: '8px', color: '#000', fontWeight: 'bold', fontSize: '18px' }}>
                {sessionStorage.getItem('userotp')}
              </div>
            </div>
          </div>

          <button 
            style={{ width: '100%', backgroundColor: '#e13f3f', color: 'white', padding: '16px', borderRadius: '8px', marginTop: '16px', cursor: 'pointer' }}
            onClick={handleRquestbutton}
          >
            SEND REQUEST
          </button>
        </div>
      </div>
    </>
  );
};

export default HelpScreen;