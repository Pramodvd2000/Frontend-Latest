import {useEffect,useRef ,useMemo} from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import { Input, Form, Modal, Label, CardTitle, CardHeader, ModalBody, ModalFooter, ModalHeader, InputGroup, InputGroupText, Row, Col } from "reactstrap";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiStarSmileLine } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import FeedbackForm from './feedbackform.js';
import API_URL from '../../../config';
import PreviewviewOrderpage from './previewOrder.js'
import { IoReloadOutline } from "react-icons/io5";
import GuestVisitHistory from './guestHistory.js';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import PreviewviewOrderpageconfirmed from './previewOrderPending.js';


const SideMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isFeedBackForm, setisFeedBackForm] = useState(false);
  const [previeworder,setprevieworder] = useState(null)
  const [previewdata, setpreviewdata] = useState([])
  const [itemCount, setItemCount] = useState(null);
  const [pastpreviewData,setpastpreviewData] = useState([])
  const [previousVisitModal,setPreviousVisitsModal] = useState(false)
  const [perviousVisitsRecords,setperviousVisitsRecords] = useState([])
  const [visitedcustomerName,setVisitedcustomerName] = useState([])
  const [confirmedprevieworder,setconfirmedprevieworder] = useState(null)


  useEffect(() => {
  //   fetchx(API_URL + '/getTempItemListCustomernIRD?hotelID=1&storeID=' + sessionStorage.getItem('storeID') + '&orderID=' + sessionStorage.getItem('orderID') + '&tableNo=' + sessionStorage.getItem('TableSelected'))
  //  .then(result => result.json())
  //  .then((resp) => {
  //    setpreviewdata(resp['data']);
  //    setItemCount(resp['data'].length)
     
  //  })
  //  .catch(error => {
  //    console.error('Error fetching data:', error);
  //  });

   }, []);

  const menuStyle = {
    position: 'fixed',
    top: 0,
    left: isOpen ? 0 : '-100%',
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    transition: 'left 0.3s ease-in-out',
    zIndex: 1000,
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: isOpen ? 'block' : 'none',
    zIndex: 999,
  };

  const headerStyle = {
    padding: '20px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  };

  const menuItemStyle = {
    padding: '15px 20px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const loginButtonStyle = {
    backgroundColor: '#e53935',
    color: '#fff',
    padding: '15px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: 'auto',
  };

  const handleLogin = () => {
    navigate('/apps/POSQRlogin');
  };

  const toggleFeedbackForm = () => {
    setisFeedBackForm((prev) => !prev);
  };

  const handlepreviewOrder = () => {
    fetch(API_URL + '/getPastKOTForCustomer?hotelID=1&storeID=' + sessionStorage.getItem('storeID') + '&orderID=' + sessionStorage.getItem('orderID') + '&tableNo=' + sessionStorage.getItem('TableSelected'))
    .then(result => result.json())
    .then((resp) => {
      // console.log("resp------")
      // console.log(resp)
      if (resp?.data?.length > 0 && resp['data'][0].status != 'created') {
        setpreviewdata(resp.data);
        setpastpreviewData(resp.data)
            // setprevieworder(true)
            setconfirmedprevieworder(true)

        // setPreviousVisitsModal(true);
      } else {
        const swalInstance = MySwal.fire({
          title: "No order generated yet",
          text: "No order generated yet",
          icon: 'error',
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
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }
  const handlePreviewsVisits = () => {
    fetch(`${API_URL}/getCustomerOrdersHistory?hotelID=1&storeID=${sessionStorage.getItem('storeID')}&guestPhoneNo=${visitedcustomerName}`)
    .then(result => result.json())
    .then((resp) => {
      // console.log("resp------")
      // console.log(resp)
      if (resp?.data?.length > 0 && resp['data'][0].status != 'created') {
        // setpreviewdata(resp.data);
        setpastpreviewData(resp.data)
        setPreviousVisitsModal(true);
      } else {
        const swalInstance = MySwal.fire({
          title: "No order generated yet",
          text: "No order generated yet",
          icon: 'error',
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
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }

  const handleCloseViewOrderClick = () => {
    // setprevieworder(false)
    setconfirmedprevieworder(false)
  }

  const handleclosevisitRecords = () => {
    setPreviousVisitsModal(false)
  }

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={menuStyle}>
        <div style={headerStyle}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#f0f0f0' }} />
          <div>
            <h3 className="text-lg font-medium">Hi, {sessionStorage.getItem('posGuesName')}</h3>
            {/* <p className="text-gray-500">{sessionStorage.getItem('mobileNumber')}</p> */}
          </div>
        </div>

        <div style={menuItemStyle} onClick={() => handlepreviewOrder()}>
          <FaRegUserCircle />
          <span>My Orders</span>
        </div>
        {/* <div style={menuItemStyle} onClick={() => handlePreviewsVisits()}>
        <IoReloadOutline/>
        <span>Previous Visits</span>
        </div> */}
        <div style={menuItemStyle} onClick={toggleFeedbackForm}>
          <RiStarSmileLine />
          <span>Feedback</span>
        </div>
        {/* <div style={menuItemStyle}>
          <RiStarSmileLine />
          <span>Rate Food</span>
        </div> */}

        {/* <div style={loginButtonStyle} onClick={handleLogin}>
          Login
        </div> */}
      </div>
      {isFeedBackForm && (
        <FeedbackForm
          isOpen={isFeedBackForm}
          onClose={() => setisFeedBackForm(false)}
        />
      )}

{/* {previeworder && (
      <Modal
        isOpen={previeworder}
        className="modal-dialog-centered modal-lg"
        style={{
          zIndex: 1060,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <PreviewviewOrderpage
          previeworder={previeworder}
          handleCloseViewOrderClick={handleCloseViewOrderClick}
          previewdata={pastpreviewData}
        />
      </Modal>
      
    )} */}
    {confirmedprevieworder && pastpreviewData.length > 0 && (
  <Modal
    isOpen={confirmedprevieworder}
    className="modal-dialog-centered modal-lg"
    style={{
      zIndex: 1060,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    }}
  >
    <PreviewviewOrderpageconfirmed
      previeworder={confirmedprevieworder}
      handleCloseViewOrderClick={handleCloseViewOrderClick}
      previewdata={pastpreviewData}
    />
  </Modal>
)}

    
    {previousVisitModal && (
       <Modal
       isOpen={previousVisitModal}
       className="modal-dialog-centered modal-lg"
       style={{
         zIndex: 1060,
         backgroundColor: 'rgba(0, 0, 0, 0.8)',
       }}
     >
       <GuestVisitHistory
         previeworder={previousVisitModal}
         handleclosevisitRecords={handleclosevisitRecords}
         previewdata={pastpreviewData}
       />
     </Modal>
    )}
    </>
  );
};

export default SideMenu;
