import { useState,useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import styled from "styled-components";
import "./inventorygrid.css";
import { Input, Form, Label, CardTitle, CardHeader, ModalFooter, InputGroup, InputGroupText, Row, Col,Card,CardBody,Table,Button} from "reactstrap";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import API_URL from "../../../config";
import React from 'react';

// icons
import { FaArrowLeft } from "react-icons/fa";
import border from '../../../assets/images/icons/item/border.png';
import itemIcon from '../../../assets/images/icons/item/itemicon.png';

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import { useNavigate } from "react-router-dom";
import { useForm, Controller, set } from "react-hook-form";


// import ViewBillPage from './viewBill.js'
import PreviewviewOrderpage from './previewOrder.js'
import HelpScreen from './helpscreen.js';


const Previewviewcartpage = ({confirmorder,previewdata,handleCloseViewBillClick}) => {
let navigate = useNavigate();
let data = previewdata;
const [previeworder,setprevieworder] = useState(null)
const [previewData, setPreviewData] = useState(previewdata);
const [opensplInst, setOpensplInst] = useState(false)
const [addCartData, setaddCartData] = useState(null)
const [isHelpVisible, setHelpVisible] = useState(false);
const [pastpreviewData,setpastpreviewData] = useState([])


const calculateOrderTotalPrev = (previewData) => {
  let total = 0;
  previewData.forEach(item => {
    total += parseFloat(item.unitPrice) * item.qty;
  });
  return total.toFixed(2);
}

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

  // ** Hooks
const { reset, handleSubmit, control, formState: { errors }
} = useForm({});

const handlePlaceorder = (previewData) => {   
  fetchx(API_URL + '/confirmPOSIRDOrder', {
    method: 'POST',
    body: JSON.stringify({
      "hotelID": 1,
      "storeID": previewData[0].storeID,
      "tableNo": previewData[0].tableNo,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((res) => res.json())
    .then((post) => {
      // if (post['statuscode']) {
      //   const swalInstance = MySwal.fire({
      //     text: post['message'],
      //     icon: 'success',
      //     buttonsStyling: false,
      //     confirmButtonText: 'Close',
      //     customClass: {
      //       confirmButton: 'btn btn-danger'
      //     }
      //   });
      //   swalInstance.then((result) => {
      //     if (result.isConfirmed) {
      //       setprevieworder(true)           
      //     }
      //   });
      // }
      if (post['statuscode'] == 200 || post['statusCode'] == 200) {
        const swalInstance = MySwal.fire({
          title: 'Order Placed Successfully',
          text: post['message'],
          icon: 'success',
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
        
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            // setprevieworder(true);
            fetch(API_URL + '/getTempItemListCustomernIRD?hotelID=1&storeID=' + sessionStorage.getItem('storeID') + '&orderID=' + sessionStorage.getItem('orderID') + '&tableNo=' + sessionStorage.getItem('TableSelected'))
            .then(result => result.json())
            .then((resp) => {
              if(resp['statuscode'] == 200 || resp['statusCode'] == 200) {
              setpastpreviewData(resp.data)
              setprevieworder(true);            
              }
           
            })
            .catch((err) => {
              console.error(err);
            });
          }
        });
      }
      if (post['statuscode'] == 403 || post['statusCode'] == 403) {
        const swalInstance = MySwal.fire({
          title: post['message'],
          text: post['message'],
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
    .catch((err) => {
      console.error(err);
    });
}

const handleCloseViewOrderClick = () => {
  setprevieworder(false)
  handleCloseViewBillClick();
}

const handleQuantityChange = (item, change) => {
  const newQuantity = item.qty + change;
  if (newQuantity < 0) return;

  fetch(`${API_URL}/updateIRDItemQty`, {
    method: "PUT",
    body: JSON.stringify({
      hotelID: 10,
      storeID: 1,
      orderID: sessionStorage.getItem("orderID"),
      tableNo: sessionStorage.getItem("TableSelected"),
      itemID: item.itemID,
      subItemID: 0,
      qty: newQuantity,
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((res) => res.json())
    .then((resp) => {
      fetchx(API_URL + '/getTempItemListCustomernIRD?hotelID=1&storeID=' + sessionStorage.getItem('storeID') + '&orderID=' + sessionStorage.getItem('orderID') + '&tableNo=' + sessionStorage.getItem('TableSelected'))
      .then(result => result.json())
      .then((resp) => {
        setPreviewData(resp['data']);

      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    })
    .catch((err) => console.error("Error updating quantity:", err));
};

function splinst(row, index) {
  setOpensplInst(true)
  sessionStorage.setItem('itemID', row.itemID)
  // console.log(row.itemID)
}

const handleOrderRowClick = () => {
  handleSubmit((data) => {
      setaddCartData(data)
      let cartData = {};
      if (sessionStorage.getItem('TableSelected') != null) {
          const basePrice = data.baseprice ? parseFloat(data.baseprice).toFixed(2) : '';
          cartData = JSON.stringify({
              "hotelID": 1,
              "storeID": sessionStorage.getItem('storeID'),
              "orderID": sessionStorage.getItem('orderID'),
              "tableNo": sessionStorage.getItem('TableSelected'),
              "itemID": sessionStorage.getItem('itemID'),
              "specialInstruction": data.specialInstruction,
              "subItemID": 0,
          });
      }
      let res = fetchx(API_URL + '/updateItemInstruction', {
          method: 'PUT',
          body: cartData,
          headers: {
              'Content-type': 'application/json; charset=UTF-8',
          },
      })
          .then((res) => res.json())
          .then((post) => {

            fetchx(API_URL + '/getTempItemListCustomernIRD?hotelID=1&storeID=' + sessionStorage.getItem('storeID') + '&orderID=' + sessionStorage.getItem('orderID') + '&tableNo=' + sessionStorage.getItem('TableSelected'))
            .then(result => result.json())
            .then((resp) => {
              setPreviewData(resp['data']);
              reset();
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
              if (post['statuscode'] == 200) {
                  setOpensplInst(false)
                  
                  const swalInstance = MySwal.fire({
                    title: 'special Instruction Added!!',
                    text: post['message'],
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
                  swalInstance.then((result) => {
                      if (result.isConfirmed) {
                        setOpensplInst(false)
                      }
                  });
              }
              else {
                setOpensplInst(false)
              }
          })
  })();
}

const toggleHelpScreen = () => {
  // setHelpVisible(!isHelpVisible);
};

  return (
    <>
       <Modal
        isOpen={confirmorder}
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

<Card style={{ marginTop: '5px', padding: '20px', width: '100%', height: '80px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
      <FaArrowLeft style={{ marginRight: '5px' }} onClick={() => handleCloseViewBillClick()} /> My Cart
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

<CardBody style={{ marginTop: '100px' }}>
<div className="item-total"><span>Item({previewData.length})</span></div>
  {/* <div style={{ maxHeight: '610px', overflowY: 'auto' }}> */}
  <div style={{ maxHeight: '450px', overflowY: 'auto' ,marginTop:'10px'}}>
    <Container>
  <div className="menu-item-container">
  {previewData.map((item, index) => (
  <div className="menu-item" key={index}>
    {/* <div className="menu-item-image-container">
      <img src={itemIcon} alt="Dish Image" className="menu-item-image" />
    </div> */}
    {/* <div className="menu-item-content">
      <div className="menu-item-info" style={{ display: "grid", gridTemplateColumns: "3fr 1fr", alignItems: "center", width: "100%" }}>
  <h3 className="menu-item-name" style={{ margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.itemName}</h3>
  <p className="menu-item-pricecart" style={{ fontWeight: "bold", textAlign: "right", whiteSpace: "nowrap" }}> ₹{item.unitPrice}</p>
  </div>
      <p className="menu-item-description">Test item instruction...</p>
      <div className="menu-item-actions">
        <span
          className={
            item.specialInstruction
              ? "menu-item-instructions special-instruction"
              : "menu-item-instructions"
          }
          onClick={() => splinst(item, index)}
        >
          {item.specialInstruction ? (
            <strong>{`(SPL INS: ${item.specialInstruction})`}</strong>
          ) : (
            "Add instruction"
          )}
        </span>

        <div className="quantity-control">
          <button className="quantity-btn" onClick={() => handleQuantityChange(item, -1)}>-</button>
          <span className="quantity-value">{item.qty}</span>
          <button className="quantity-btn" onClick={() => handleQuantityChange(item, 1)}>+</button>
        </div>
      </div>
    </div> */}
     <div className="menu-item-content">
      <div className="menu-item-info" style={{ display: "grid", gridTemplateColumns: "3fr 1fr", alignItems: "center", width: "100%" }}>
  {/* <h3 className="menu-item-name" style={{ marginBottom: -5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.itemName}</h3> */}
  <h3 className="menu-item-name" style={{ marginBottom: -3, whiteSpace: "normal",overflowWrap: "break-word", textOverflow: "ellipsis"}}>
  {item.itemName}
</h3>
  <h3 className="menu-item-pricecart" style={{ marginBottom: -3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}> ₹{item.unitPrice}</h3>
  </div>
      {/* <p className="menu-item-descriptioncart">Test item instruction...</p> */}
      <p className="menu-item-descriptioncart">
  {item.itemDescription !== null && item.itemDescription !== undefined && item.itemDescription !== "0" && item.itemDescription.toString().trim() !== "" 
    ? item.itemDescription 
    : " "}
</p>
      <div className="menu-item-actions">
        <span
          className={
            item.specialInstruction
              ? "menu-item-instructions special-instruction"
              : "menu-item-instructions"
          }
          onClick={() => splinst(item, index)}
        >
          {item.specialInstruction ? (
            <strong>{`(SPL INS: ${item.specialInstruction})`}</strong>
          ) : (
            "Add instruction"
          )}
        </span>

        <div className="quantity-control">
          <button className="quantity-btn" onClick={() => handleQuantityChange(item, -1)}>-</button>
          <span className="quantity-value">{item.qty}</span>
          <button className="quantity-btn" onClick={() => handleQuantityChange(item, 1)}>+</button>
        </div>
      </div>
    </div>
  </div>
))}
  </div>
</Container>
  </div>
</CardBody>
{!isHelpVisible && (
 <FooterCard1
 style={{
   position: 'fixed',
   bottom: 0,       
   left: 0,
   width: '100%',     
   backgroundColor: 'white', 
   zIndex: 1050,     
   padding: '15px 20px',  
   boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
   display: 'flex',
   flexDirection: 'column',
   gap: '5px',
   minHeight: '110px',
 }}
>
 <div style={{ 
  fontSize: '13px', 
  fontWeight: 'bold', 
  color: '#ff4b3a', 
  textAlign: 'left', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px', 
  width: '100%', 
  marginLeft: '-20px', 
  paddingLeft: '0',
  whiteSpace: 'nowrap', 
  overflow: 'hidden', 
  textOverflow: 'ellipsis'
}}>
{previewData[0].status === 'pending' && (
  <>
⚠️Your order is Placed and waiting for confirmation.....
</>
)}
</div>


 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
   <div style={{ display: 'flex', flexDirection: 'column' }}>
     <span style={{ fontSize: '14px' }}>Total</span>
     <OrderTotal style={{ fontSize: '16px', fontWeight: 'bold' }}>₹{calculateOrderTotalPrev(previewData)}</OrderTotal>
   </div>
   <button
     style={{
       padding: '12px 20px',
       backgroundColor: '#4CAF50',
       color: 'white',
       fontSize: '16px',
       border: 'none',
       borderRadius: '5px',
     }}
     onClick={() => handlePlaceorder(previewData)}
   > 
     Order Now
   </button>
 </div>
</FooterCard1>



  )}
      {isHelpVisible && <HelpScreen toggleHelpScreen={toggleHelpScreen} />}

      </Modal>
      {previeworder && (
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
    )} 
        <Modal
                isOpen={opensplInst}
                toggle={() => setOpensplInst(false)}
                className='modal-dialog-centered'
                onCancel={() => setOpensplInst(false)}
                centered
                footer={null}
            >
                <div className='text-center mb-2' style={{ backgroundColor: 'red', height: '50px', position: 'relative' }}>
                    <ModalHeader>
                        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Add Item Instructions</span>
                    </ModalHeader>
                </div>
                <ModalBody>
                <Form onSubmit={handleSubmit(handleOrderRowClick)}>

                    <Col sm='12' className='mb-1'>
                        <div className="mb-1">
                            <InputGroup className="input-group-merge">
                                <Controller
                                    id='specialInstruction'
                                    name='specialInstruction'
                                    control={control}
                                    rules={{ required: 'Special instruction is required' }}
                                    render={({ field }) => (
                                        <Input
                                            type='text'
                                            required
                                            placeholder='Enter specialInstruction'
                                            style={{ width: '90%', height: '100px', margin: '0 auto' }}
                                            maxLength={20}
                                            {...field}
                                        />
                                    )}
                                />
                            </InputGroup>
                            {errors.specialInstruction && <span className='text-danger'>Special instruction is required</span>}
                        </div>
                    </Col>
                    <div align='end'>
                        <Button style={{ align: 'right', 'margin-right': '10px', 'margin-bottom': '10px' }} className="bg-transparent" onClick={() => { setOpensplInst(!opensplInst) }}>CANCEL</Button>
                        
                        <Button type='submit' color="primary" style={{ align: 'left', 'margin-right': '10px', 'margin-bottom': '10px' }} onClick={handleOrderRowClick}>SUBMIT</Button>
                    </div>
                    
                </Form>
                </ModalBody>
            </Modal>
    </>
  );
};

export default Previewviewcartpage;
