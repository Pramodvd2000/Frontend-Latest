import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardBody, Button, Badge } from 'reactstrap';
import styled from "styled-components";
// import { NavbarColor } from "../pos_configuration/common/index.js";
import { Input, Form, Modal, Label, CardTitle, CardHeader, ModalBody, ModalFooter, ModalHeader, InputGroup, InputGroupText, Row, Col } from "reactstrap";
import { Alert, Table } from 'reactstrap'
import React, { Component } from 'react';
import { useForm, Controller, set } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// import { Select } from 'antd';
import vegIcon from '../../../assets/images/icons/veg.png';
import nonvegIcon from '../../../assets/images/icons/nonveg.png';
import eggIcon from '../../../assets/images/icons/egg.png';
import itemIcon from '../../../assets/images/icons/item/itemicon.png';
import chickenleg from '../../../assets/images/icons/item/chickenleg.png';
import frenchfries from '../../../assets/images/icons/item/frenchfries.png';
import hamburger from '../../../assets/images/icons/item/hamburger.png';
import icecream from '../../../assets/images/icons/item/icecream.png';
import soda from '../../../assets/images/icons/item/soda.png';
import border from '../../../assets/images/icons/item/border.png';
import smoke from '../../../assets/images/icons/item/smoke.png';
import liquor from '../../../assets/images/icons/item/liquor.svg';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';



import API_URL from '../../../config';
import { Search, Inbox, Camera, AlignCenter } from 'react-feather'


// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import "./App.css";

import { FaCartArrowDown } from "react-icons/fa";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { CgMenuBoxed } from "react-icons/cg";
import { FaCartPlus } from "react-icons/fa";

// pages
import ViewCartPage from './viewcart.js'
import PreviewviewOrderpage from './previewOrder.js'
import HelpScreen from './helpscreen.js';
import SideMenu from './sidemenu.js';
import PreviewviewOrderpageconfirmed from './previewOrderPending.js';







const Block = () => {
  let navigate = useNavigate();
  const [menuheader, setMenuheader] = useState([]);
  const [confirmorder, setConfirmOrder] = useState(false);
  const [previewdata, setpreviewdata] = useState([])
  const [opensplInst, setOpensplInst] = useState(false)
  const [addCartData, setaddCartData] = useState(null)
  const [searchQuery, setSearchQuery] = useState('');
  const [rowDataOnFetch, setrowDataOnFetch] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [activemenugroup, setActivemenugroup] = useState(0);
  const [previeworder, setprevieworder] = useState(null)
  const [isViewBillVisible, setIsViewBillVisible] = useState(false);
  const [itemCount, setItemCount] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHelpVisible, setHelpVisible] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [pastpreviewData,setpastpreviewData] = useState([])
  const [confirmedprevieworder,setconfirmedprevieworder] = useState(null)





  useEffect(() => {
    // console.log(rowDataOnFetch)
    const handleBeforeUnload = (e) => {
      if (rowDataOnFetch.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    const handlePopState = () => {
      // console.log("orderID",sessionStorage.getItem('orderID'))
      if (rowDataOnFetch.length > 0) {
        const confirmLeave = window.confirm(
          'You are currently logged in. Are you sure you want to leave this page?'
        );
        if (!confirmLeave) {
          window.history.pushState(null, '', window.location.pathname);
        } else {
          navigate('/apps/POSQRlogout');
        }
      }
    };

    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [rowDataOnFetch, navigate]);


  useEffect(() => {
    const newQuantities = {};
    previewdata.forEach(item => {
      newQuantities[item.itemID] = item.qty;
    });
    setQuantities(newQuantities);
  }, [previewdata]);
  
  // useEffect(() => {
  //   fetch(`${API_URL}/getIRDMenuHeaderDetails?hotelID=1`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data.data)
  //       let categories = data.data.map((item) => ({
  //         label: item.category,
  //         alt: item.category,
  //         src: getIconByCategory(item.category),
  //       }));
  //       categories = categories.sort((a, b) => {
  //         if (a.label === 'Other') return 1;
  //         if (b.label === 'Other') return -1;
  //         return 0;
  //       });

  //       setMenuheader(categories);
  //     })
  //     .catch((error) => console.error('Error fetching menu groups:', error));
  // }, []);

  useEffect(() => {
    fetch(`${API_URL}/getIRDMenuHeaderDetails?hotelID=1`)
      .then((response) => response.json())
      .then((data) => {
        let categories = data.data.map((item) => ({
          label: item.category,
          alt: item.category,
          src: getIconByCategory(item.category),
        }));
  
        const desiredOrder = ["Food", "SoftDrinks", "Liquor", "Smokes", "Others"];
  
        categories.sort((a, b) => {
          const indexA = desiredOrder.indexOf(a.label);
          const indexB = desiredOrder.indexOf(b.label);
          
          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          
          return indexA - indexB;
        });

        setMenuheader(categories);
      })
      .catch((error) => console.error('Error fetching menu groups:', error));
  }, []);

  const getIconByCategory = (category) => {
    switch (category) {
      case 'SoftDrinks':
        return soda;
      case 'Food':
        return hamburger;
      case 'Smokes':
        return smoke;
      case 'Starters':
        return chickenleg;
      case 'Liquor':
        return liquor;
      default:
        return soda;
    }
  };


  useEffect(() => {
    fetchx(API_URL + '/getIRDstoremenuitems?hotelID=1&storeID=' + sessionStorage.getItem('storeID'))
      .then((result) => result.json())
      .then((rowData) => {
        setrowDataOnFetch(rowData['data']);
        const initialFoodItems = rowData.data.filter(item => item.foodType === 'Food');
        setFilteredItems(initialFoodItems);
      });
  }, []);

  useEffect(() => {
    fetchx(API_URL + '/getTempItemListCustomernIRD?hotelID=1&storeID=' + sessionStorage.getItem('storeID') + '&orderID=' + sessionStorage.getItem('orderID') + '&tableNo=' + sessionStorage.getItem('TableSelected'))
      .then(result => result.json())
      .then((resp) => {
        setpreviewdata(resp['data']);
        setItemCount(resp['data'].length)

      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  const handleViewCartClick = () => {
    setIsLoading(true)
    // console.log("32423423423423")
    fetchx(API_URL + '/getTempItemListCustomernIRD?hotelID=1&storeID=' + sessionStorage.getItem('storeID') + '&orderID=' + sessionStorage.getItem('orderID') + '&tableNo=' + sessionStorage.getItem('TableSelected'))
      .then(result => result.json())
      .then((resp) => {
        setIsLoading(false)
        if (resp['statuscode'] == 200 && resp['data'].length != 0) {
          setpreviewdata(resp['data']);
          setConfirmOrder(true);
        setItemCount(resp["data"].length);
        }
        if (resp['statuscode'] == 200 && resp['data'].length === 0) {
          //   const swalInstance = MySwal.fire({
          //     text:'Please add menu items to your cart',
          //     icon: 'error',
          //     buttonsStyling: false,
          //     confirmButtonText: 'Close',
          //     customClass: {
          //         confirmButton: 'btn btn-danger'
          //     }

          // });
          const swalInstance = MySwal.fire({
            title: 'Please add menu items to your cart',
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
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handlepreviewOrder = () => {
    // fetch(API_URL + '/getTempItemListCustomernIRD?hotelID=1&storeID=' + sessionStorage.getItem('storeID') + '&orderID=' + sessionStorage.getItem('orderID') + '&tableNo=' + sessionStorage.getItem('TableSelected'))
    fetch(API_URL + '/getPastKOTForCustomer?hotelID=1&storeID=' + sessionStorage.getItem('storeID') + '&orderID=' + sessionStorage.getItem('orderID') + '&tableNo=' + sessionStorage.getItem('TableSelected'))
      .then(result => result.json())
      .then((resp) => {
        if (resp?.data?.length > 0 && resp['data'][0].status != 'created') {
          // setpreviewdata(resp.data);
          setpastpreviewData(resp.data)
          // setprevieworder(true);
          setconfirmedprevieworder(true)
        } else {
          // alert("No order generated yet");
          // let message = resp.message
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
  };

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
      let res = fetchx(API_URL + '/updateIRDItemInstruction', {
        method: 'PUT',
        body: cartData,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((res) => res.json())
        .then((post) => {

          if (post['statuscode'] == 200) {
            setOpensplInst(false)


            const swalInstance = MySwal.fire({
              text: 'special Instruction Added!!',
              icon: 'success',
              buttonsStyling: false,
              confirmButtonText: 'Close',
              customClass: {
                confirmButton: 'btn btn-danger'
              }
            });
            swalInstance.then((result) => {
              if (result.isConfirmed) {
                setOpensplInst(false)
                fetchx(API_URL + '/getTempItemListCustomernIRD?hotelID=1&storeID=' + sessionStorage.getItem('storeID') + '&orderID=' + sessionStorage.getItem('orderID') + '&tableNo=' + sessionStorage.getItem('TableSelected'))
                  .then(result => result.json())
                  .then((resp) => {
                    setpreviewdata(resp['data']);
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }
            });

          }
          else {
            setOpensplInst(false)
          }
        })
    })();
  }

  function splinst(row,) {
    setOpensplInst(true)
    sessionStorage.setItem('itemID', row.itemID)
  }


  const confirmSubmit = () => {
    setShowModal(false);
    if (selectedItems) {
      const selectedDItem = selectedItems;

      fetchx(API_URL + '/additemCustomernIRD', {
        method: 'POST',
        body: JSON.stringify({
          "hotelID": selectedDItem.hotelID,
          "storeID": selectedDItem.storeID,
          "orderID": sessionStorage.getItem('orderID'),
          "tableNo": sessionStorage.getItem('TableSelected'),
          "itemID": selectedDItem.itemID,
          "subItemID": 0,
          "itemName": selectedDItem.itemName,
          "qty": 1,
          "unitPrice": selectedDItem.basePrice
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((res) => res.json())
        .then((post) => {
          // console.log(post)
          fetchx(API_URL + '/getTempItemListCustomernIRD?hotelID=1&storeID=' + sessionStorage.getItem('storeID') + '&orderID=' + sessionStorage.getItem('orderID') + '&tableNo=' + sessionStorage.getItem('TableSelected'))
            .then(result => result.json())
            .then((resp) => {
              setpreviewdata(resp['data']);
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };


  const { reset, handleSubmit, control, formState: { errors }
  } = useForm({});
  const [open, setOpen] = useState([])


  const toggle = id => {
    setOpen(prevOpen => {
      if (prevOpen.includes(id)) {
        return prevOpen.filter(openId => openId !== id);
      } else {
        return [...prevOpen, id];
      }
    });
  };


  // const FooterCard = styled.div`
  //   background: #fff;
  //   width: 100%;
  //   max-width: 1445px;
  //   background-color: #f8f9fa;
  //   border-top: 1px solid #dee2e6;
  //   height: 75px; 
  //   padding: 8px;
  //   position: fixed; 
  //   bottom: 0; 
  //   left: 0; 
  //   right: 0; 
  // `;

  // const FooterCard = styled.div`
  //   background: #fff;
  //   width: 100%;
  //   max-width: 1445px;
  //   background-color: #f8f9fa;
  //   // border-top: 1px solid #dee2e6;
  //   height: 70px; 
  //   padding: 3px;
  //   position: fixed; 
  //   bottom: 0; 
  //   left: 0; 
  //   right: 0; 
  // `;

  const FooterCard = styled.div`
  background: #fff;
  width: 100%;
  max-width: 1445px;
  background-color: #f8f9fa;
  height: 70px; 
  padding: 3px;
  position: fixed; 
  bottom: 0; 
  left: 0; 
  right: 0; 
`;

  const Container = styled.div`
  position: relative;
`;

  const handleItemClick = (index) => {
    setActivemenugroup(index);
  };


  const handleCloseViewBillClick = () => {
    fetch(
      `${API_URL}/getTempItemListCustomernIRD?hotelID=1&storeID=${sessionStorage.getItem(
        "storeID"
      )}&orderID=${sessionStorage.getItem(
        "orderID"
      )}&tableNo=${sessionStorage.getItem("TableSelected")}`
    )
      .then((result) => result.json())
      .then((resp) => {
        setpreviewdata(resp["data"]);
        setItemCount(resp["data"].length);
      })
      .catch((err) => console.error(err));
    setIsViewBillVisible(false);
    setConfirmOrder(false)
  };

  const handleCloseViewOrderClick = () => {
  // setprevieworder(false)
  setconfirmedprevieworder(false)
    setConfirmOrder(false)
    setIsViewBillVisible(false);
  }



  const handleAddToCart = (item) => {
    setIsLoading(true);
    fetch(`${API_URL}/additemCustomernIRD`, {
      method: "POST",
      body: JSON.stringify({
        hotelID: 10,
        storeID: 1,
        orderID: sessionStorage.getItem("orderID"),
        tableNo: sessionStorage.getItem("TableSelected"),
        itemID: item.itemID,
        subItemID: 0,
        itemName: item.itemName,
        qty: 1, // Start with quantity 1 when adding to cart
        unitPrice: item.basePrice,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((post) => {
        setIsLoading(false);
        if (post["statuscode"] === 200) {
          // Update the state to reflect the addition of the item
          setQuantities((prev) => ({
            ...prev,
            [item.itemID]: 1, // Set quantity to 1 when adding to cart
          }));

          // Fetch the updated cart data
          fetch(
            `${API_URL}/getTempItemListCustomernIRD?hotelID=1&storeID=${sessionStorage.getItem(
              "storeID"
            )}&orderID=${sessionStorage.getItem(
              "orderID"
            )}&tableNo=${sessionStorage.getItem("TableSelected")}`
          )
            .then((result) => result.json())
            .then((resp) => {
              setpreviewdata(resp["data"]);
              setItemCount(resp["data"].length);
            })
            .catch((err) => console.error(err));
        }
        if (post["statuscode"] === 403 || post["statusCode"] === 403) {
          setIsLoading(false);
          const message = post['message'];

          const swalInstance = MySwal.fire({
            title: message,
            text: message,
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
      .catch((err) => console.error(err));
  };

  const handleQuantityChange = (item, change) => {
    const newQuantity = (quantities[item.itemID] || 0) + change;

    if (newQuantity <= 0) {
      // If the quantity is zero or less, remove the item from the cart
      setIsLoading(true);
      fetch(`${API_URL}/updateIRDItemQty`, {
        method: "PUT",
        body: JSON.stringify({
          hotelID: 10,
          storeID: 1,
          orderID: sessionStorage.getItem("orderID"),
          tableNo: sessionStorage.getItem("TableSelected"),
          itemID: item.itemID,
          subItemID: 0,
          qty: 0, // Set quantity to 0 to remove the item
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((post) => {
          setIsLoading(false);
          if (post["statuscode"] === 200) {
            // Update the state to reflect the removal of the item
            setQuantities((prev) => {
              const newQuantities = { ...prev };
              delete newQuantities[item.itemID];
              return newQuantities;
            });

            // Fetch the updated cart data
            fetch(
              `${API_URL}/getTempItemListCustomernIRD?hotelID=1&storeID=${sessionStorage.getItem(
                "storeID"
              )}&orderID=${sessionStorage.getItem(
                "orderID"
              )}&tableNo=${sessionStorage.getItem("TableSelected")}`
            )
              .then((result) => result.json())
              .then((resp) => {
                setpreviewdata(resp["data"]);
                setItemCount(resp["data"].length);
              })
              .catch((err) => console.error("Error fetching data:", err));
          }
        })
        .catch((err) => console.error("Error updating quantity:", err));
    } else {
      // If the quantity is greater than zero, update the quantity
      setIsLoading(true);
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
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((post) => {
          setIsLoading(false);
          if (post["statuscode"] === 200) {
            // Update the state with the new quantity
            setQuantities((prev) => ({
              ...prev,
              [item.itemID]: newQuantity,
            }));

            // Fetch the updated cart data
            fetch(
              `${API_URL}/getTempItemListCustomernIRD?hotelID=1&storeID=${sessionStorage.getItem(
                "storeID"
              )}&orderID=${sessionStorage.getItem(
                "orderID"
              )}&tableNo=${sessionStorage.getItem("TableSelected")}`
            )
              .then((result) => result.json())
              .then((resp) => {
                setpreviewdata(resp["data"]);
                setItemCount(resp["data"].length);
              })
              .catch((err) => console.error("Error fetching data:", err));
          }
        })
        .catch((err) => console.error("Error updating quantity:", err));
    }
  };

  const handleMenuClick = (category, index) => {
    setIsLoading(true);
    setActivemenugroup(index);

    setTimeout(() => {
      const filtered = rowDataOnFetch.filter(item => item.foodType === category);
      setFilteredItems(filtered);
      setIsLoading(false);
    }, 0);
  };

  const handleSearchInputChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchQuery(searchValue);

    const filteredItems = rowDataOnFetch.filter(item =>
      item.itemName && item.itemName.toLowerCase().includes(searchValue)
    );

    setFilteredItems(filteredItems); // Assuming you have a state to hold the filtered results
  };

  const toggleHelpScreen = () => {
    // console.log("toggle.........")
    // setHelpVisible(!isHelpVisible);
  };

  const toggleSideMenu = () => {
    // console.log("toggled")
    setIsSideMenuOpen((prev) => !prev);
  };

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <DotLottieReact
              src="https://lottie.host/97999e3f-b774-4bfe-8e62-918a7d89badf/6VjiMpbsWe.lottie"
              loop
              autoplay
              style={{ width: '100px', height: '100px', margin: '0 auto' }}
            />
            <div style={{ marginTop: '-10px' }}>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#898989' }}>Please wait do not click any buttons</p>
            </div>
          </div>
        </div>
      )}

      {/* <Card style={{ height: '230px', width: '90%', overflow: 'hidden', position: 'fixed', top: '0', zIndex: 1000, marginBottom: '-20px' }}> */}
      {/* <Card style={{ height: '230px', width: '100%', overflow: 'hidden', position: 'fixed', marginBottom: '-10px',marginLeft:'-25px' }}> */}
      <Card style={{ height: '200px', width: '100%', overflow: 'hidden', position: 'fixed', marginBottom: '-10px', marginLeft: '-25px' }}>


        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          marginTop: '25px',
          marginLeft: '20px'
        }}>

          <span style={{
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            marginRight: '30px' // Controls space between "IN ROOM DINING" and "T: ..."
          }}>
            <CgMenuBoxed
              style={{ fontSize: '30px', marginRight: '10px', cursor: 'pointer' }}
              onClick={() => toggleSideMenu()}
            />
            IN ROOM DINING
          </span>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px' // Controls spacing between "T: ..." and the image
          }}>
            <div style={{
              backgroundColor: '#FF4B3A',
              color: 'white',
              fontWeight: 'bold',
              padding: '10px 10px',
              borderRadius: '5px',
              whiteSpace: 'nowrap'
            }}>
              T:{sessionStorage.getItem('TableSelected')}
            </div>

            <img
              onClick={() => toggleHelpScreen()}
              src={border}
              alt="Food Service Icon"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '20%'
              }}
            />
          </div>
        </div>


        <div className="search-container" style={{
          display: 'flex',
          // width: '90%',
          width: '92%',
          marginLeft: '18px',
          marginTop: '-30px',
        }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              marginRight: '10px',
              marginTop: '50px',
              backgroundColor: '#eeeeee'
            }}
          />
          <i className="fas fa-search"></i>
        </div>
        <div class="card-body">
          <div
            className="menu-group"
            // style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '-4px' }}
            style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '-10px' }}
          >
     {menuheader
  .sort((a, b) => {
    if (a.label === "Others") return 1;
    if (b.label === "Others") return -1;
    return 0;
  }).map((item, index) => (
          <div
            key={index}
            className="menu-group-item"
            onClick={() => handleMenuClick(item.label,index)}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '10px',
              backgroundColor: activemenugroup === index ? '#ffe13c' : '#f6f2ef',
              borderRadius: '5px',
              flex: 1,
              justifyContent: 'center',
              paddingLeft:'20px',
              paddingTop:'20px',
              paddingBottom:'0px',
              paddingRight:'20px'
            }}
          >
            <img
              src={item.src}
              alt={item.alt}
              style={{ marginRight: '12px', width: '25px', height: '20px',marginTop:'-5px',marginLeft:'10px' }}
              // style={{ marginRight: '10px', width: '35px', height: '35px' }}
            />
            <span style={{textAlign:'center',marginLeft:'-5px',marginTop:'-7px',marginRight:'-5px'}}>{item.label}</span>
          </div>
        ))}
    </div>
</div>
</Card>
{/* <CardBody style={{ marginTop: '230px' }}> */}
<CardBody style={{ marginTop: '185px' }}>
  {/* <div
    style={{
      maxHeight: '90%', 
      overflowY: 'auto',
      position: 'fixed',
      marginLeft:'-30px'
      
    }}
  > */}
        <div
          style={{
    // maxHeight: '90%',
    maxHeight: 'calc(100vh - 380px)',
            overflowY: 'auto',
            position: 'fixed',
            left: -10,
            right: -10,
            margin: '0 auto',
            padding: '0px',
            boxSizing: 'border-box',
          }}
        >
          <Container>
            <div className="menu-item-container" style={{ marginLeft: '2%' }}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div className="menu-item" key={index}>
                    <div className="menu-item-content">
                      <div className="menu-item-info">
                        <h3 className="menu-item-name">{item.itemName}</h3>
                        {/* <p className="menu-item-description">
                    Test item instruction......
                  </p> */}
                        <p className="menu-item-description">
                          {item.itemDescription !== null && item.itemDescription !== undefined && item.itemDescription !== "0" && item.itemDescription.toString().trim() !== ""
                            ? item.itemDescription
                            : " "}
                        </p>

                      </div>
                      <div className="menu-item-actions">
                        <span className="menu-item-price">₹{item.basePrice}</span>
                        {quantities[item.itemID] ? (
                          <div
                            className="quantity-control"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              backgroundColor: '#fceee4',
                            }}
                          >
                            <button
                              className="quantity-btn"
                              onClick={() => handleQuantityChange(item, -1)}
                            >
                              -
                            </button>
                            <span
                              className="quantity-value"
                              style={{ fontSize: '16px', fontWeight: 'bold' }}
                            >
                              {quantities[item.itemID]}
                            </span>
                            <button
                              className="quantity-btn"
                              onClick={() => handleQuantityChange(item, 1)}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            className="add-btn"
                            style={{
                              backgroundColor: '#fceee4',
                              color: '#D32F2F',
                              border: '1px solid #fceee4',
                              borderRadius: '40px',
                              padding: '6px 17px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: 'bold',
                            }}
                            onClick={() => handleAddToCart(item)}
                          >
                            <FaCartPlus size={18} /> Add
                          </button>
                        )}
                      </div>
                    </div>
                    {/* <div className="menu-item-image-container">
                <img src={itemIcon} alt="Dish Image" className="menu-item-image" />
              </div> */}
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    width: '100%',
                    backgroundColor: '#f8f8f8',
                    borderRadius: '5px',
                    fontSize: '16px',
                    color: '#666',
                    marginRight: '220px'
                  }}
                >
                  No Items Present
                </div>
              )}
            </div>
          </Container>
        </div>
      </CardBody>
      {!isHelpVisible && (
        <FooterCard>
          <div className="footer-nav">
            <div className="nav-item">
              <BsFillGrid3X3GapFill />
              <span>Menu</span>
            </div>
            <div
              className="nav-item"
              style={{
                position: "relative",
                display: "inline-block",
                textAlign: "center",
              }}
              onClick={() => handleViewCartClick()}
            >


              <div style={{ position: "relative", display: "inline-block" }}>
                <FaCartArrowDown size={30} color="#fff" />
                {itemCount > 0 && (
                  <Badge
                    pill
                    color="#fff"
                    style={{
                      position: "absolute",
                      top: "-9px",
                      right: "-17px",
                      fontSize: "12px",
                      padding: "4px 8px",
                      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
                      color: "#000",
                      backgroundColor: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    {itemCount}
                  </Badge>
                )}
              </div>

              <span style={{ color: "#fff", fontSize: "14px", marginTop: "0px", display: "block" }}>Cart</span>
            </div>

            <div className="nav-item" onClick={() => handlepreviewOrder()}>
              <CgMenuBoxed />
              <span>Order</span>
            </div>
          </div>
        </FooterCard>
      )}
      {isHelpVisible && <HelpScreen toggleHelpScreen={toggleHelpScreen} />}

      <Modal
        isOpen={confirmorder}
        className="modal-dialog-centered modal-lg"
        style={{
          zIndex: 1060,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <ViewCartPage
          confirmorder={confirmorder}
          handleCloseViewBillClick={handleCloseViewBillClick}
          previewdata={previewdata}
        />
      </Modal>

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

          <div align='center'>
            <Button type='submit' color="primary" style={{ align: 'left', 'margin-right': '10px', 'margin-bottom': '10px' }} onClick={handleOrderRowClick}>SUBMIT</Button>

            <Button style={{ align: 'right', 'margin-right': '10px', 'margin-bottom': '10px' }} className='me-1' onClick={() => { setOpensplInst(!opensplInst) }} color='primary' >CANCEL</Button>
          </div>
        </Form>
      </Modal>



      <Modal
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        centered
        footer={null}
      >
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h1 className='demo-space-y'><b>Are you sure?</b></h1>
            <p>Do you want to proceed?</p>
            {selectedItems && (
              <table style={{ margin: '10px auto' }}>
                <thead>
                  <tr style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <th style={{ paddingRight: '20px' }}>ItemID</th>
                    <th style={{ paddingRight: '20px' }}>Menu Item</th>
                    <th>Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ paddingRight: '20px' }}>{selectedItems.itemID}</td>
                    <td style={{ paddingRight: '20px' }}><b>{selectedItems.itemName}</b></td>
                    <td style={{ paddingRight: '20px' }}>{selectedItems.basePrice}</td>

                  </tr>
                </tbody>
              </table>


            )}

          </div>
          <div className="button-container text-center">
            <Button className="me-1" color="primary" onClick={confirmSubmit}>
              Yes
            </Button>
            <Button className='bg-transparent' color="danger" onClick={() => setShowModal(false)}>
              No
            </Button>
          </div>
        </ModalBody>
      </Modal>
{/* 
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
      
    )} */}

{confirmedprevieworder && (
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
      <SideMenu style={{height: '230px'}} isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />


    </>
  );
};

export default Block;



