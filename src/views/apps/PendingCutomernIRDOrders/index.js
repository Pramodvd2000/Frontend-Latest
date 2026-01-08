// ** React Imports
// import { Document, Page } from 'react-pdf';

import { useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check, Calendar } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Fragment } from 'react'
import { format } from "date-fns";
import React, { Component } from 'react';

import { XCircle } from "react-feather";

import Moment from 'moment';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap'

import Avatar from "@components/avatar";
import 'ag-grid-enterprise'

// ** Utils
import { selectThemeColors } from "@utils";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
import logo from '@src/assets/images/logo/oterra.jpg';
let is_test = false

// ** Reactstrap Imports
import {
  Input,
  Card,
  Form,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  InputGroup,
  InputGroupText,
  Row,
  Col,
  Modal,
  CardText,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Table,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from 'react';
import API_URL from "../../../config";
import { width } from "@mui/system";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'


const ValidationThirdPartyComponents = () => {
  let navigate = useNavigate();
  const [rowData, setRowData] = useState();
  const [previewdata, setpreviewdata] = useState([]);
  const [isProcessingalert,setIsProcessingalert] = useState(false)
  const [FilterData,setFilterData] = useState([])
  const [open, setOpen] = useState('0')
  const [flag, setFlag] = useState(false)
  const [gridApi, setGridApi] = useState(null);
  const [ErrorMessage,setErrorMessage] = useState('')
  const [previewOrderModal,setPreviewOrderModal] = useState()
  const [confirmationCustomerOrder, setconfirmationCustomerOrder] = useState(false);
  const [voidBillModal, setvoidBillModal] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [ReasonOptions, setReasonOptions] = useState([])
  const [valueReason,setValueReason] = useState([])
  const [labelReason,setLabelReason] = useState([])
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedOrderID,setSelectedOrderID] = useState(null)
  const [selectedstoreID,setSelectedstoreID] = useState(null)
  const [selectedtableNo,setSelectedtableNo] = useState(null)
  const [selectedhotelID,setSelectedhotelID] = useState(null)



  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }
  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Outlet', field: 'restaurantName' },
    { headerName: 'Store ID', field: 'storeID' },
    { headerName: 'Date', field: 'dateTime' ,maxWidth: 180},
    { headerName: 'Order No', field: 'orderID', maxWidth: 120 },
    { headerName: 'Table No', field: 'tableNo' ,maxWidth: 120 },
    { headerName: 'Customer Name', field: 'guestName',maxWidth: 180 },
    { headerName: 'Status', field: 'status',maxWidth: 120 },
    // { headerName: 'Action', cellRendererFramework: (params) => {if(params.data.billStatus!=='cancelled'){ return (<Button color='primary' style={{ width: 128 }}  onClick={() => handleViewOrderData(item.orderID, item.storeID, item.tableNo)}>View Order Data</Button>) }}, suppressSizeToFit: true, maxWidth: 148 },
    {
      headerName: 'Action',
      cellRendererFramework: (params) => {
        if (params.data.billStatus !== 'cancelled') {
          return (
            <Button
              color="primary"
              style={{ width: 128 }}
              onClick={() =>
                handleViewOrderData(
                  params.data.hotelID,
                  params.data.orderID,
                  params.data.storeID,
                  params.data.tableNo,
                  params.data.id
                )
              }
            >
              View Order Data
            </Button>
          );
        }
        return null;
      },
      suppressSizeToFit: true,
      maxWidth: 148,
    }
    
  ]);

  const gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
      flex: 1,
      minWidth: 150,
      filter: true,
      sortable: true,
      floatingFilter: true,
    },
  };
  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      wrapText: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));

  const onGridReady = params => {
    setGridApi(params.api);
    gridRef.current = params.api;
};

  const [Today, setToday] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const fetchNotifications = async () => {
    fetch(API_URL + '/getPendingCustomerOrder?hotelID=10')
    .then(result => result.json())
    .then(data => {
      setIsProcessingalert(false);
      if (data['statuscode'] === 403 || !data['data'] || !Array.isArray(data['data'])) {
        // console.log("modifiedData403")

        MySwal.fire({
          text: data['message'],
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            setRowData([]);
          }
        });
      } else if (data['statuscode'] === 200) {
        setRowData(data['data']);
      }
    })
    .catch(error => {
      console.error(error);
      setRowData([]);
    });
  };
  
  useEffect(() => {
    fetchx(API_URL + "/getBusinessDatePOS", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hotelID: 1 })
    })
      .then((res) => res.json())
      .then(postres => {
        const businessDate = postres.data[0].businessDate;
        // console.log(businessDate)
        setToday(businessDate);
        setFlag(true)
        // Set the initial selected date to today
        setSelectedDate(businessDate);
      })
      .catch(error => {
        console.error("Error fetching business date:", error);
        // Handle the error as needed
      });
      setIsProcessingalert(true);
      fetch(API_URL + '/getPendingCustomerOrder?hotelID=10')
        .then(result => result.json())
        .then(data => {
          setIsProcessingalert(false);
          if (data['statuscode'] === 403 || !data['data'] || !Array.isArray(data['data'])) {
            console.log("modifiedData403")

            MySwal.fire({
              text: data['message'],
              buttonsStyling: false,
              confirmButtonText: 'Close',
              customClass: {
                confirmButton: 'btn btn-danger',
              },
            }).then((result) => {
              if (result.isConfirmed) {
                setRowData([]);
              }
            });
          } else if (data['statuscode'] === 200) {
            setRowData(data['data']);
          }
        })
        .catch(error => {
          console.error(error);
          setRowData([]);
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
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


 
  // ** Hooks
  const { reset, handleSubmit, control, formState: { errors }
  } = useForm({});


 
  const handleViewOrderData = (hotelID,orderID, storeID, tableNo,selectedNotification) => {
    sessionStorage.setItem('hotelID', hotelID);
    sessionStorage.setItem('orderID', orderID);
    sessionStorage.setItem('storeID', storeID);
    sessionStorage.setItem('tableNo', tableNo);
    setSelectedNotification(selectedNotification)
    setSelectedOrderID(orderID)
    setSelectedstoreID(storeID)
    setSelectedtableNo(tableNo)
    setSelectedhotelID(sessionStorage.getItem('hotelID'))
  
    fetch(API_URL + '/getPendingCustomerOrderByOrderID?hotelID=' + sessionStorage.getItem('hotelID') + '&storeID=' + sessionStorage.getItem('storeID') + '&orderID=' + sessionStorage.getItem('orderID') + '&tableNo=' + sessionStorage.getItem('tableNo'))
      .then(result => result.json())
      .then(resp => {
        if (resp['data'].length === 0) {
          MySwal.fire({
            text: "Please Add Items to Cart!!",
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-danger',
            },
          }).then((result) => {
            if (result.isConfirmed) {
              setPreviewOrderModal(false);
            }
          });
        } else {
          setpreviewdata(resp['data']);
          setPreviewOrderModal(true);
        }
      });
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
            // navigate('/apps/posconfiguration/Tableselection');          
          }
      });      })
      .catch((err) => {
          console.error(err);
      });
  }

  const handleOnSubMitVoidBill = async (data) => {
    setIsButtonClicked(true);
    try {
      const response = await fetch(`${API_URL}/cancelNotifications`, {
        method: "POST",
        body: JSON.stringify({
        notificationID: selectedNotification,
        orderID: selectedOrderID,
        storeID: selectedstoreID,
        tableNo: selectedtableNo,
        reason: data.reason,
        dropDownReason: labelReason,
        reasonID: valueReason
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
        setvoidBillModal(false);
        reset();
      });
      fetchNotifications();
      setPreviewOrderModal(false)
      setIsButtonClicked(false)
    } catch (error) {
      console.error("Error cancelling notification:", error);
    } finally {
      setconfirmationCustomerOrder(false);
    }
  };

  const handleCancelVoidBillClick = () => {
    setvoidBillModal(false);
    setconfirmationCustomerOrder(false);
    setIsButtonClicked(false)
  };

  const handleChange = (selectedOption) => {
    setValueReason(selectedOption.value);
    setLabelReason(selectedOption.label)
  };

  return (
    <div>

      <Card>
        <CardHeader>
          <CardTitle tag="h4"><b>Pending Customer Orders</b></CardTitle>
        </CardHeader>
      </Card>
     
      <Card>
        {flag == true &&

        <div className="ag-theme-alpine" style={{ height: 520 }}>
          <AgGridReact
            ref={gridRef}
            rowData={FilterData.length > 0 ? FilterData : rowData}
            columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            // onCellClicked={cellClickedListener}
            paginationAutoPageSize='true'
            paginationPageSize='10'
            pagination='true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            gridOptions={gridOptions}
            // getRowStyle={getRowStyle}
          onGridReady={onGridReady}

          />
          {ErrorMessage && <p>{ErrorMessage}</p>}
        </div>
        }

      </Card>


           
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isProcessingalert}>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
    Please wait... We're processing your request,      
    </h1>
      <h1 style={{ fontWeight: 'bold', color: 'white' }}>
        which may take a little longer due to additional data. Please be patient!
      </h1>
    <CircularProgress color="inherit" />
  </div>
</Backdrop>

<Modal
  isOpen={previewOrderModal}
  className='modal-dialog-centered modal-lg'
>
  <ModalHeader className='bg-transparent' toggle={() => setPreviewOrderModal(!previewOrderModal)}>
    Confirm KOT Generation for IRD, Table/RoomNo #{sessionStorage.getItem('tableNo')}
  </ModalHeader>
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
          {previewdata.length > 0 && previewdata !== '' && previewdata.map((row, index) => (
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
      <div align='end' className='buttons'>
        <Button outline color='secondary' className='me-1' type='submit' onClick={() => setPreviewOrderModal(!previewOrderModal)}>
          Cancel
        </Button>
        
        <Button className='me-1' color='danger' onClick={() => setconfirmationCustomerOrder(true)}>
          Close Order
        </Button>
        <Button className='me-1' color='primary' onClick={confirmOrderdata}>
          Confirm Order
        </Button>
      </div>
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
      <p>Do you want to proceed with canceling this order?</p>
    </div>
    <div className="button-container text-center">
      <Button className="me-1" color="danger" onClick={() => setconfirmationCustomerOrder(false)}>
        No
      </Button>
      <Button color="primary" className='bg-transparent' onClick={() => setvoidBillModal(true)}>
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
      <Col className='mb-2' sm='12'>
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
                className={classnames('react-select')}
                style={{ width: '100%' }}
                {...field}
                onChange={handleChange}
              />
            )}
          />
        </div>
      </Col>

      <Col sm='12' className='mb-2'>
        <div className="mb-1">
          <InputGroup className="input-group-merge">
            <Controller
              id='reason'
              name='reason'
              control={control}
              rules={{ required: 'Reason is Required' }}
              render={({ field }) => (
                <Input
                  type='text'
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

<Modal
  isOpen={confirmationCustomerOrder}
  onCancel={() => setconfirmationCustomerOrder(false)}
  centered
  footer={null}
>
  <ModalBody className='px-5 pb-2'>
    <div className='text-center mb-2'>
      <h1 className='demo-space-y'><b>Are you sure?</b></h1>
      <p>Do you want to proceed with canceling this order?</p>
    </div>
    <div className="button-container text-center">
      <Button className="me-1" color="danger" onClick={() => setconfirmationCustomerOrder(false)}>
        No
      </Button>
      <Button color="primary" className='bg-transparent' onClick={() => setvoidBillModal(true)}>
        Yes
      </Button>
    </div>
  </ModalBody>
</Modal>

    </div>

  );
};

export default ValidationThirdPartyComponents;
