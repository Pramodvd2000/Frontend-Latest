import { useState,useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import styled from "styled-components";
import "./inventorygrid.css";
import { Input, Form, Label, CardTitle, CardHeader, ModalFooter, InputGroup, InputGroupText, Row, Col,Card,CardBody,Table,Button} from "reactstrap";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import API_URL from "../../../config";
import React from 'react';
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import border from '../../../assets/images/icons/item/border.png';
import itemIcon from '../../../assets/images/icons/item/itemicon.png';
import ViewBillPage from './viewBill.js'
import HelpScreen from './helpscreen.js';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)


const PreviewviewOrderpage = ({previeworder,handleCloseViewOrderClick,previewdata}) => {
let navigate = useNavigate();
let data = previewdata;
const [isViewBillVisible, setIsViewBillVisible] = useState(false);
const [orderData,setOrderData] = useState(null)
const [isHelpVisible, setHelpVisible] = useState(false);
const [compleorderData,setcompleorderData] = useState([])

useEffect(() => {
  const billfetch = JSON.stringify({
    "hotelID": 1,
    "storeID": sessionStorage.getItem('storeID'),
    "orderID": sessionStorage.getItem('orderID'),
    "tableNo": sessionStorage.getItem('TableSelected'),
  });
  fetchx(API_URL+'/getOrderDetails', {
    method: 'POST',
    body: billfetch,
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((res) => res.json())
    .then((post) => {
      if (post['statuscode'] == 200) {
          setOrderData(post['data'])
      }
      else[
        setOrderData(null)
      ]
    })
    .catch((err) => {
      console.log(err.message);
    });
}, []);

const calculateOrderTotalPrev = (previewdata) => {
  if (!Array.isArray(previewdata)) return "0.00";

  let total = previewdata.reduce((sum, item) => 
      sum + (parseFloat(item.unitPrice) || 0) * (item.qty || 0), 0
  );

  return total.toFixed(2);
}

  // const handleViewBillClick = () => {
  //   // setIsViewBillVisible(true);
  //     // onClick={() => {
  //         navigate('/apps/POSQRlogout');
  //       // }}
  // };

  const handleViewBillClick = () => {
    fetch(API_URL + '/getTempItemListCustomernIRD?hotelID=1&storeID=' + sessionStorage.getItem('storeID') + '&orderID=' + sessionStorage.getItem('orderID') + '&tableNo=' + sessionStorage.getItem('TableSelected'))
      .then(result => result.json())
      .then((resp) => {
        // console.log(resp['data']);
        setcompleorderData(resp['data']);
  
        if (resp['data'].length === 0 || (resp['data'][0]?.status !== 'pending' && resp['data'][0]?.status !== 'created')) {
          navigate('/apps/POSQRlogout');
        } else {
          MySwal.fire({
            title: 'Your order is Placed and waiting for confirmation.....',
            text: "Your order is Placed and waiting for confirmation.....",
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-danger',
              popup: 'swal2-popup-custom',
              title: 'swal2-title-custom',
              icon: 'swal2-icon-custom'
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
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
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };
  
  const handleCloseViewBillClick = () => {
    // console.log("closebuttons")
    setIsViewBillVisible(false);
  };
  

const Container = styled.div`
  position: relative;
`;

const FooterCard1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* Push items to the sides */
  padding: 8px 16px;
  background-color: #f8f8f8;
  height: 80px; 
`;

const OrderTotal = styled.h4`
margin: 0;
font-weight: bold; 
font-size: 18px; 
font-family: Arial, sans-serif;
color:red
`;

const toggleHelpScreen = () => {
  // setHelpVisible(!isHelpVisible);
};


  return (
    <>
        <Modal
        isOpen={previeworder}
        className="modal-dialog-centered modal-fullscreen"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 1050, 
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >  
   {/* <Card style={{ marginTop: '5px', padding: '20px', paddingLeft: '-20px', width: '100%',height:'60px' }}>
  <div style={{ justifyContent: 'space-between', width: '100px' }}>
    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }} onClick={() => handleCloseViewOrderClick()}>
      <FaArrowLeft style={{ marginRight: '5px' }} /> My Order
    </span>
    <div style={{ display: 'flex', alignItems: 'center',marginLeft: '240px'}}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF4B3A',
        color: 'white',
        fontWeight: 'bold',
        padding: '10px 10px',
        borderRadius: '5px',
        marginRight: '10px',
        marginTop:'-30px'
      }}>
        T:{sessionStorage.getItem('TableSelected')}
      </div>
      <img src={border} alt="Food Service Icon" style={{ width: '40px', height: '40px', borderRadius: '20%' ,marginTop:'-30px'
}}  onClick={() =>toggleHelpScreen()} />
    </div>
  </div>
</Card> */}

<Card style={{ marginTop: '6px', padding: '20px', paddingLeft: '-20px', width: '100%',height:'66px' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
<span  style={{ fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }} onClick={() => handleCloseViewOrderClick()}>
      <FaArrowLeft style={{ marginRight: '5px' }} /> My Order
    </span>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FF4B3A',
          color: 'white',
          fontWeight: 'bold',
          padding: '10px 10px',
          borderRadius: '5px',
          marginRight: '10px',
        }}
      >
        T:{sessionStorage.getItem('TableSelected')}
      </div>
      <img
        src={border}
        alt="Food Service Icon"
        style={{ width: '40px', height: '40px', borderRadius: '20%' }}
        onClick={() => toggleHelpScreen()}
      />
    </div>
  </div>
</Card>
<CardBody style={{ marginTop: '80px', }}>
<div style={{ maxHeight: '310px', overflowY: 'auto' }}>
  {/* <Container>
    <div className="order-item-container">
      {(
        previewdata && previewdata.length > 0 
          ? previewdata.flatMap(kot => kot.items) 
          : []
      ).map((item, index) => (
        <div className="order-item" key={item.id || index}>
          <div className="order-item-content" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="order-item-name" style={{ margin: 0 }}>
                {item.itemName || "Unknown Item"}
              </h3>
              <span className="order-item-qty" style={{ fontWeight: 'bold' }}>
                {item.qty}
              </span>
            </div>
            <span className="order-item-price" style={{ fontWeight: 'bold', marginTop: '2px' }}>
              ₹{item.amount || "0.00"}
            </span>
          </div>
        </div>
      ))}
    </div>
  </Container> */}
  <Container>
  <div className="order-item-container">
    {(() => {
      if (!previewdata || previewdata.length === 0) return [];

      // Check if any record has KOTNo (confirmed orders)
      const hasKOTOrders = previewdata.some(kot => kot.KOTNo);

      // If KOT orders exist, show only those items
      if (hasKOTOrders) {
        return previewdata.flatMap(kot => kot.items || []);
      } 

      // If no KOT orders, show unconfirmed orders
      return previewdata;
    })().map((item, index) => (
      <div className="order-item" key={item.id || index}>
        <div className="order-item-content" style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="order-item-name" style={{ margin: 0 }}>
              {item.itemName || "Unknown Item"}
            </h3>
            <span className="order-item-qty" style={{ fontWeight: 'bold' }}>
              {item.qty}
            </span>
          </div>
          <span className="order-item-price" style={{ fontWeight: 'bold', marginTop: '2px' }}>
            ₹{item.amount || item.unitPrice || "0.00"}
          </span>
        </div>
      </div>
    ))}
</div>

    </Container>
  </div>
</CardBody>
{!isHelpVisible && (
  <CardBody style={{ marginTop: '-80px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginRight: '20px' }}>
    <div style={{ fontWeight: 'bold', fontSize: '16px', marginLeft: '20px' }}>Payment Summary</div>
  </div>
  <div style={{ maxHeight: '310px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', marginLeft: '20px', marginRight: '20px' }}>
      <div>Sub Total</div>
      {/* <div>
        ₹
        {orderData && orderData.length !== 0
          ? orderData.subtotal
          : calculateOrderTotalPrev(previewdata)}
      </div> */}
      <div>
  ₹
  {/* {orderData && orderData.length !== 0
    ? (orderData.subtotal * 1.18).toFixed(2)
    : (calculateOrderTotalPrev(previewdata) * 1.18).toFixed(2)} */}
  {/* {orderData && orderData.length !== 0
    ? Number(orderData.subtotal).toFixed(2)
    : Number(calculateOrderTotalPrev(previewdata) || 0).toFixed(2)} */}
    {Number(calculateOrderTotalPrev(previewdata) || 0).toFixed(2) }


  <span> (Excl. GST)</span>
</div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', marginLeft: '20px', marginRight: '20px' }}>
      <div>GST</div>
      <div>
        
        {orderData && orderData.length !== 0
          ? orderData.serviceCharge
          : "Applicable"}
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', marginLeft: '20px', marginRight: '20px' }}>
      <div>Discount</div>
      <div>
        ₹
        {orderData && orderData.length !== 0
          ? orderData.TotalDiscount
          : 0}
      </div>
    </div>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      borderBottom: '1px solid #ccc',
      width: '100%',
      marginRight: '20px',
    }}>
      <div></div>
      <div></div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', marginLeft: '20px', marginRight: '20px' }}>
      <div>Status</div>
      <div style={{ color: 'red' }}>Unpaid</div>
    </div>
  </div>
</CardBody>
  )}
{!isHelpVisible && (

<FooterCard1
    style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'white',
      zIndex: 1050,
      padding: '10px',
      boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
    }}
  >
    <div style={{ marginLeft: '20px', marginBottom: '60px', fontSize: '14px' }}>
      <span>Total</span>
    </div>
 
    <div style={{ marginLeft: '-40px', marginRight: '20px' }}>
  {/* <OrderTotal>₹{previewdata?.length ? calculateOrderTotalPrev(previewdata) : orderData?.total || 0}</OrderTotal> */}
  {/* <OrderTotal> {orderData && orderData.length !== 0
    ? Number(orderData.total).toFixed(2)
    : Number(calculateOrderTotalPrev(previewdata) || 0).toFixed(2)}</OrderTotal> */}
    <OrderTotal>{Number(calculateOrderTotalPrev(previewdata) || 0).toFixed(2)}</OrderTotal>
</div>

    {/* <button
      style={{
        width: '80%',
        padding: '12px',
        backgroundColor: '#4CAF50',
        color: 'white',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        marginTop: '10px',
        marginBottom: '10px',
        marginLeft: '10%',
      }}
      onClick={handleViewBillClick}
      
    >
      View Bill
    </button>
   */}
   <button
  style={{
    width: '282px',
    height: '48px',
    padding: '0',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: '10%',
  }}
  onClick={handleViewBillClick}
>
  Close Order
</button>

  </FooterCard1>
)}
    {isHelpVisible && <HelpScreen toggleHelpScreen={toggleHelpScreen} />}
   {isViewBillVisible && (
      <Modal
        isOpen={isViewBillVisible}
        className="modal-dialog-centered modal-lg"
        style={{
          zIndex: 1060,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
          <ViewBillPage
          isViewBillVisible={isViewBillVisible}
          handleCloseViewBillClick={handleCloseViewBillClick}
          previewdata={previewdata?.length ? previewdata : orderData?.items || []}
        />
            </Modal>
    )}

      </Modal>

   
    </>
  );
};

export default PreviewviewOrderpage;
