import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Bell, X ,} from 'react-feather';
import { Button, Badge, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown ,Form,Row,Col,Label,InputGroup,Input} from 'reactstrap';
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import API_URL from "../../../../config";
import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Avatar from '@components/avatar'
import { useNavigate } from "react-router-dom";
import { WEBSOCKET_PORT } from "../../../../config"
import toast from 'react-hot-toast'
// import { X } from 'react-feather'
import { useForm, Controller, set } from "react-hook-form";
// import { Card, Select } from 'antd';
import Select from "react-select";

import { selectThemeColors } from "@utils";
import classnames from "classnames";



// ** Third Party Components
const MySwal = withReactContent(Swal)



const NotificationDropdown = () => {
  let navigate = useNavigate();
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [previewOrderModal,setPreviewOrderModal] = useState()
  const [previewdata, setpreviewdata] = useState('')
  const [confirmationCustomerOrder,setconfirmationCustomerOrder] = useState()
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggleDropdown = () => setDropdownOpen(prevState => !prevState)
  const [hotelID, setHotelID] = useState(null) // Add state for hotelID
  const [voidBillModal, setvoidBillModal] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [managerList,setManagerList] = useState([]);
  const [ReasonOptions, setReasonOptions] = useState([])
  const [reasonCode, setReasonCode] = useState([])
  const [valueReason,setValueReason] = useState([])
  const [labelReason,setLabelReason] = useState([])

  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // Month is zero-based
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${day}-${month}-${year} ${hours} : ${minutes} : ${seconds}`
  }
  sessionStorage.setItem("hotelID",10)
  sessionStorage.setItem("storeID",5)

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        API_URL+ '/getPendingNotifications?hotelID=' +
          sessionStorage.getItem('hotelID') +
          '&storeID=' +
          sessionStorage.getItem('storeID')
      );
      const data = await response.json();
      // console.log(data);

      const filteredNotifications = data.data
  .filter((item) => item.status === 'pending') 
  .map((item) => ({
    id: item.id, 
    orderID: item.orderID,
    storeID: item.storeID,
    tableNo: item.tableNo,
    avatarContent: item.tableNo ? item.tableNo : item.createdAt.substring(0, 2).toUpperCase(),
    color: 'light-primary',
    subtitle: `A new order was created at Table No ${item.tableNo} (Order ID: ${item.orderID}), requested at ${formatDate(item.createdAt)}.`,
    title: (
      <p className="media-heading">
        <span className="fw-bolder">Order Created for Table/Room No {item.tableNo}</span>
      </p>
    ),
  }));
  
      setNotifications(filteredNotifications);
      setUnreadCount(filteredNotifications.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  const handleNavigateToRequests = () => {
    setDropdownOpen(false) // Close dropdown
    navigate('/apps/PendingCutomernIRDOrders')
  }
  const showNotificationToast = (messageData) => {
    // console.log("departmentName",messageData)
    // const avatarContent = messageData ? messageData.substring(0, 2).toUpperCase() : 'IRD Notifications'
    const avatarContent = messageData?.message 
    ? messageData.message.substring(0, 2).toUpperCase() 
    : 'IRD Notifications';

    
    toast(
      t => (
        <div 
          className='w-100 d-flex align-items-center justify-content-between'
          onClick={() => {
            handleNavigateToRequests()
            toast.dismiss(t.id)
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className='d-flex align-items-center'>
            <Avatar 
              // content={avatarContent}
              content='IRD'
              color="light-primary"
              className='me-1'
            />
            <div>
              <p className='mb-0'><strong>New Service Request</strong></p>
              <small>Request for IRD</small>
            </div>
          </div>
          <X 
            size='14' 
            onClick={(e) => {
              e.stopPropagation()
              toast.dismiss(t.id)
            }} 
          />
        </div>
      ),
     
      {
        duration: Infinity,
        style: {
          minWidth: '300px',
          marginTop: '25px'
        },
        position: 'top-right', // You can adjust this to position the toast // This will move the toast 6rem down from its default position
      }
    )
  }
  const fetchBusinessDate = async () => {
    try {
      const response = await fetch(API_URL + '/getBusinessDate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const postres = await response.json()
      setHotelID(postres.data[0].id)
    } catch (error) {
      console.error('Error fetching business date:', error)
    }
  }
  const getAllStewardList = async () => {
      fetchx(API_URL + '/getPOSManagerslist?hotelID=1&storeID=' + sessionStorage.getItem('storeID'))
        .then(result => result.json())
        .then(data => {
          console.log(data);
          setManagerList(data['data']);
        })
        .catch(error => {
          console.error('Error fetching POS Managers list:', error);
          setManagerList([]); 
        });

        fetch(API_URL + '/getReasonCodes', {
          method: 'POST',
          body: JSON.stringify({
              groupID: 12,
          }),
          headers: {
              'Content-type': 'application/json; charset=UTF-8'
          }
      })
          .then((res) => res.json())
          .then((resp) => {
            console.log(resp)
              const transformedOptions = resp.data.map(reason => ({
                  label: reason.description,
                  value: reason.id,
              }));
              setReasonOptions(transformedOptions);
              console.log(transformedOptions)
              // setReasonOptions(resp.data);
          })
          .catch((error) => {
              console.error('Error:', error);
          });
  }
  useEffect(() => {
    fetchNotifications();
    fetchBusinessDate()
    getAllStewardList();
    // const socket = new WebSocket('ws://localhost:4000/');
    const socket = new WebSocket(WEBSOCKET_PORT)

    socket.onopen = () => {
      console.log('WebSocket connection opened!')
      socket.send('Hello from the client!')
    }

    socket.onmessage = (event) => {
      console.log('Message from server:', event.data)
      try {
        const messageData = JSON.parse(event.data)

        if (messageData?.type === "New KOT") {
          console.log("New KOT message received, fetching notifications...");
          console.log("messageData",typeof(messageData?.hotelID))
          console.log("messageData",typeof(hotelID))

          if (Number(messageData?.hotelID) !== Number(hotelID)) {
            showNotificationToast(messageData);
            fetchNotifications();
        }
        
                  // showNotificationToast(messageData)

          // fetchNotifications();
          
        }
  
      } catch (error) {
        console.log('Error parsing message:', error)
      }
    }
    

    return () => {
      socket.close()
    }
  }, [])

  const handleViewOrderData = (orderID, storeID, tableNo) => {
    sessionStorage.setItem('orderID', orderID);
  sessionStorage.setItem('storeID', storeID);
  sessionStorage.setItem('tableNo', tableNo);
    // console.log("orderID, storeID, tableNo-----")
    // console.log(orderID, storeID, tableNo)
    fetchx(API_URL + '/getPendingCustomerOrderByOrderID?hotelID='+sessionStorage.getItem('hotelID')+'&storeID=' + sessionStorage.getItem('storeID') + '&orderID=' + sessionStorage.getItem('orderID') + '&tableNo=' + sessionStorage.getItem('tableNo'))
    .then(result => result.json())
    .then(resp => {
        if (resp['data'].length === 0) {
            const swalInstance = MySwal.fire({
                text: "Please Add Items to Cart!!",
                buttonsStyling: false,
                confirmButtonText: 'Close',
                customClass: {
                    confirmButton: 'btn btn-danger',
                },
            });
            swalInstance.then((result) => {
                if (result.isConfirmed) {
                }
            });
            setPreviewOrderModal(false)
        } else {
          
            setpreviewdata(resp['data']);
            setPreviewOrderModal(true)
          }
    })
  }


  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar component='li' className='media-list scrollable-container' options={{ wheelPropagation: false }}>
        {notifications.map((item, index) => {
          // {console.log(item)}
          return (
            <a key={index} className='d-flex' href='/' onClick={(e) => e.preventDefault()}>
              <div className='list-item d-flex align-items-start'>
                <div className='me-1'>
                  <Avatar content={item.avatarContent} color={item.color} />
                </div>
                <div className='list-item-body flex-grow-1'>
                  {item.title}
                  <small className='notification-text'>{item.subtitle}</small>
                </div>
                <Button color='primary' size='sm' className='me-1' onClick={() => handleViewOrderData(item.orderID, item.storeID, item.tableNo)}>
                  View
                </Button>
                <Button color='danger' size='sm' onClick={() => handleCancelOrderData(item.id,item.orderID, item.storeID, item.tableNo)}>
                  Cancel
                </Button>
              </div>
            </a>
          );
        })}
      </PerfectScrollbar>
    );
  };
  
  const confirmOrderdata = () => {
    fetchx(API_URL + '/confirmHotelOrder', {
      method: 'POST',
      body: JSON.stringify({
          "hotelID": sessionStorage.getItem('hotelID'),
          "storeID": sessionStorage.getItem('storeID'),
          "orderID": sessionStorage.getItem('orderID'),
          "tableNo": sessionStorage.getItem('tableNo'),
      }),
      headers: {
          'Content-type': 'application/json; charset=UTF-8',
      },
  })
      .then((res) => res.json())
      .then((post) => {
        const swalInstance = MySwal.fire({
          text: post['message'],
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
              confirmButton: 'btn btn-danger',
          },
      });
      swalInstance.then((result) => {
          if (result.isConfirmed) {
            setPreviewOrderModal(false)
            fetchNotifications();
            navigate('/apps/posconfiguration/Tableselection');          }
      });      })
      .catch((err) => {
          // Handle fetch error here
          console.error(err);
      });
  }

  // const handleCancelOrderData = (orderID, storeID, tableNo) => {
  //   setconfirmationCustomerOrder(true)
  // }

  const handleCancelOrderData = (notificationID,orderID, storeID, tableNo) => {
    setSelectedNotification({ notificationID,orderID, storeID, tableNo });
    setconfirmationCustomerOrder(true);
};


  const cancelNotifications = async () => {
    setvoidBillModal(true)
    // if (!selectedNotification) return;

    // try {
    //     const response = await fetch(`${API_URL}/cancelNotifications`, {
    //         method: "POST",
    //         body: JSON.stringify({
    //             notificationID : selectedNotification.notificationID,
    //             orderID: selectedNotification.orderID,
    //             storeID: selectedNotification.storeID,
    //             tableNo: selectedNotification.tableNo,
    //         }),
    //         headers: { "Content-Type": "application/json" },
    //     });

    //     const result = await response.json();

    //     MySwal.fire({
    //         text: result.message,
    //         icon: result.success ? "success" : "error",
    //         confirmButtonText: "Close",
    //         customClass: { confirmButton: 'btn btn-primary' },
    //     });

    //     // Refresh notifications
    //     fetchNotifications();
    // } catch (error) {
    //     console.error("Error cancelling notification:", error);
    // } finally {
    //   setconfirmationCustomerOrder(false);
    // }
};
    // ** Hooks
const { reset, handleSubmit, control, formState: { errors }
} = useForm({});

const handleCancelVoidBillClick = () => {
  reset();
  setvoidBillModal(false)
  setIsButtonClicked(false)
}

const handleOnSubMitVoidBill = async (data) => {
  console.log("data",data)
  setIsButtonClicked(true)
     if (!selectedNotification) return;
      console.log(JSON.stringify({
        notificationID : selectedNotification.notificationID,
        orderID: selectedNotification.orderID,
        storeID: selectedNotification.storeID,
        tableNo: selectedNotification.tableNo,
        reason:data.reason,
        dropDownReason:labelReason,
        reasonID:valueReason
    }))
    try {
        const response = await fetch(`${API_URL}/cancelNotifications`, {
            method: "POST",
            body: JSON.stringify({
                notificationID : selectedNotification.notificationID,
                orderID: selectedNotification.orderID,
                storeID: selectedNotification.storeID,
                tableNo: selectedNotification.tableNo,
                reason:data.reason,
                dropDownReason:labelReason,
                reasonID:valueReason
            }),
            headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        MySwal.fire({
          text: result.message,
          icon: result.success ? "success" : "error",
          confirmButtonText: "Close",
          customClass: { confirmButton: "btn btn-primary" },
        }).then(() => {
          // Close modal only after the user clicks "Close"
          setvoidBillModal(false);
          reset();
        });

        // Refresh notifications
        fetchNotifications();
    } catch (error) {
        console.error("Error cancelling notification:", error);
    } finally {
      setconfirmationCustomerOrder(false);
    }
}


const handleChange1 = (selectedOption1) => {
  console.log(selectedOption1);

  setReasonCode(selectedOption1);

};


const handleChange = (selectedOption) => {
  setValueReason(selectedOption.value);
  setLabelReason(selectedOption.label)
  // setValueReason(selectedOption.value);
  // setLabelReason(selectedOption.value)
  console.log(selectedOption)
  console.log(selectedOption.value)
  console.log(selectedOption.label)
};

  return (
    <>
    <UncontrolledDropdown tag='li' className='dropdown-notification nav-item me-25'>
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={(e) => e.preventDefault()}>
        <Bell size={24} color='green' />
        {unreadCount > 0 && (
  <Badge pill color='danger' className='badge-up'>
    {unreadCount}
  </Badge>
)}
      </DropdownToggle>

      <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 me-auto'>POS order Notifications</h4>
            <Badge tag='div' color='light-primary' pill>
              {unreadCount} New
            </Badge>
          </DropdownItem>
        </li>
        {renderNotificationItems()}
        <li className='dropdown-menu-footer'>
          <Button color='primary' block>
            Read all notifications
          </Button>
        </li>
      </DropdownMenu>
      
    </UncontrolledDropdown>
    <Modal
    isOpen={previewOrderModal}
    className='modal-dialog-centered modal-lg'
>
    <ModalHeader className='bg-transparent' toggle={() => setPreviewOrderModal(!previewOrderModal)}>Confirm KOT Generation for IRD, Table/RoomNo #{sessionStorage.getItem('tableNo')}</ModalHeader>
    <ModalBody className='px-sm-5 mx-50 pb-5'>
        <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table responsive>
                <thead>
                    <tr>
                        <th style={{ whiteSpace: 'nowrap' }}>Menuitem</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Quantity</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Unit Price</th>
                    </tr>
                </thead>
                <tbody>
                    {previewdata !== '' && previewdata.map((row, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td style={{ whiteSpace: 'nowrap' }}>
                                    {row.itemName}
                                    {row.specialInstruction && (
                                        <div style={{ fontSize: '15px', fontStyle: 'italic', marginTop: '1px' }}>
                                            <strong>{`(SPL INS: ${row.specialInstruction})`}</strong>
                                        </div>
                                    )}
                                </td>
                                <td style={{ whiteSpace: 'nowrap' }}><b>{row.qty}</b></td>
                                <td style={{ whiteSpace: 'nowrap' }}>{row.unitPrice}</td>
                            </tr>
                            {row.breakCourse === "true" && (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center' }}>----------------------------------------------------------</td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
        </div>
        <div align='end' className='buttons'>
            <Button outline color='secondary' className='me-1' type='submit' onClick={() => { setPreviewOrderModal(!previewOrderModal) }}>
                Cancel
            </Button>
            <Button className='me-1' color='primary' onClick={confirmOrderdata}>
                Confirm Order
            </Button>
        </div>
    </ModalBody>
</Modal>

<Modal
                        isOpen={confirmationCustomerOrder}
                        onCancel={() => setconfirmationCustomerOrder(false)}
                        centered
                        footer={null}
                    >
                        <ModalBody className='px-5 pb-2'>
                            <div className='text-center mb-2'>
                                <h1 className='demo-space-y'><b>Are you sure?</b></h1>
                                <p>Do you want to proceed?</p>
                            </div>
                            <div className="button-container text-center">
                            <Button className="me-1"  color="danger" onClick={() => setconfirmationCustomerOrder(false)}>
                                    No
                                </Button>
                                <Button  color="primary" className='bg-transparent' onClick={cancelNotifications}>
                                    Yes
                                </Button>
                            </div>
                        </ModalBody>
                    </Modal>

                    <Modal
                isOpen={voidBillModal}
                className='modal-dialog-centered'
                centered
                footer={null}
            >
                <ModalHeader>
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Cancel Order</span>
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(handleOnSubMitVoidBill)}>
                    <Col className='mb-2' sm='12' >
                <div className="mb-1">
                  <Label className="form-label" for="reason1">
                    Select Reason <spam style={{ color: 'red' }}>*</spam>
                  </Label>
                  <Controller
                    id='reason1'
                    control={control}
                    name="reason1"
                    render={({ field }) => (
                      <Select
                      required
                        isClearable
                        options={ReasonOptions}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        className={classnames('react-select',)}
                        style={{ width: '100%'}}
                        {...field}
                        onChange={handleChange} // Add onChange event handler
                      />
                    )}
                  />
                </div>
              </Col>
                   
                    <Col sm='12' className='mb-2' >
                        <div className="mb-1" >
                            <InputGroup className="input-group-merge">
                                <Controller
                                    id='reason'
                                    name='reason'
                                    control={control}
                                    rules={{ required: 'Reason is Required' }}
                                    render={({ field }) => (
                                        <Input
                                            type='text' // Changed from 'type="type"'
                                            required
                                            placeholder='Give Reason for void KOT'
                                            style={{ width: '90%', height: '100px', margin: '0 auto' }}
                                            {...field}
                                        />
                                    )}
                                />
                            </InputGroup>
                            {errors.reason && <span className='text-danger'>Reason is required</span>}
                        </div>
                    </Col>
                    <div align='end' className='buttons'>
                        <Button outline className='me-1' color='secondary' onClick={handleCancelVoidBillClick}>
                            CANCEL
                        </Button>
                        <Button color='primary' className='me-1' type="submit" disabled={isButtonClicked}>
                        {isButtonClicked ? 'Processing...' : 'Submit'}
                        </Button>
                    </div>
                    </Form>
                </ModalBody>

            </Modal>              

    </>
  )
}

export default NotificationDropdown
