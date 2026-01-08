import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, Row, Col, InputGroup, Input } from 'reactstrap';
import API_URL from "../../../../config";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Cleave from "cleave.js/react";


const MySwal = withReactContent(Swal)
const CouponForm = ({ isOpen, onClose, voucher }) => {
  localStorage.setItem('selectedVoucherData',JSON.stringify(voucher))

  let navigate = useNavigate();
  
  sessionStorage.setItem('MemeberShipID',voucher.membershipId);
  sessionStorage.setItem('voucherCode',voucher.voucherCode)


  // let voucherData = sessionStorage.getItem('VoucherData');
  // const voucher = JSON.parse(voucherData);

  if (!voucher || voucher.length === 0) {
    return null;
  }
  const membershipId = voucher.membershipId;
  const mappedVoucherId = voucher.mappedVoucherId;
  const voucherCode = voucher.voucherCode;
  const VoucherType = voucher.VoucherType;
  const voucherId = voucher.voucherId;
  const guestId = voucher.guestID;
  const quantity = voucher.quantity;
  const [amount, setAmount] = useState(''); 
  const [reason, setReason] = useState('');
  const [memeberShipIDInvoice, setmemeberShipIDInvoice] = useState(mappedVoucherId);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    let foodDisc = parseFloat(event.target.elements.Food.value);
    foodDisc = isNaN(foodDisc) ? 0 : foodDisc;
  
    let liquorDisc = parseFloat(event.target.elements.Liquor.value);
    liquorDisc = isNaN(liquorDisc) ? 0 : liquorDisc;
  
    let softdrinksDisc = parseFloat(event.target.elements.SoftDrinks.value);
    softdrinksDisc = isNaN(softdrinksDisc) ? 0 : softdrinksDisc;
  
    let smokesDisc = parseFloat(event.target.elements.Smokes.value);
    smokesDisc = isNaN(smokesDisc) ? 0 : smokesDisc;
  
    let othersDisc = parseFloat(event.target.elements.Others.value);
    othersDisc = isNaN(othersDisc) ? 0 : othersDisc;
  
    const reason = event.target.elements.discountReason.value;


    if (foodDisc === undefined) {
      foodDisc = 0;
    }
    if (liquorDisc === undefined) {
      liquorDisc = 0;
    }
    if (softdrinksDisc === undefined) {
      softdrinksDisc = 0;
    }
    if (smokesDisc === undefined) {
      smokesDisc = 0;
    }
    if (othersDisc === undefined) {
      othersDisc = 0;
    }

    if (foodDisc >= 100 || liquorDisc >= 100 || softdrinksDisc >= 100 || smokesDisc >= 100 || othersDisc >= 100) {
      balError = true;
      const swalInstance = MySwal.fire({
        text: "Percentage cannot be greater than 100",
        buttonsStyling: false,
        confirmButtonText: 'Close',
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      });
      swalInstance.then((result) => {
        if (result.isConfirmed) {
          setdiscountModal(false)
          navigate('')
        }
      });
    }
    const discType = "Category";
    const valueFormat = "Percentage";

    // const voucherDiscData = JSON.stringify({
    //     id:mappedVoucherId,
    //     hotelID: 1,
    //     membershipId: membershipId,
    //     voucherType: VoucherType,
    //     quantity: quantity,
    //     voucherId: voucherId,
    //     guestId: guestId
    //   });
    //   let result = fetchx(API_URL + '/redeemMappedVoucher', {
    //     method: 'POST',
    //     body: voucherDiscData,
    //     headers: {
    //       'Content-type': 'application/json; charset=UTF-8',
    //     },
    //   })
        // .then((result) => result.json())
        // .then(result => {
  
          // if (result['statusCode'] == 200) {
            // onClose()
            const discData = JSON.stringify({
              hotelID: '1',
              storeID: localStorage.getItem('storeID'),
              orderID: localStorage.getItem('orderID'),
              tableNo: localStorage.getItem('TableSelected'),
              discType: discType,
              description: JSON.stringify({ 'food': foodDisc, 'softDrinks': softdrinksDisc, 'liquor': liquorDisc, 'smokes': smokesDisc, 'others': othersDisc }),
              valueFormat: valueFormat,
              FolioNo: '0',
              reason: reason,
              membershipID: membershipId,
              voucherCode: mappedVoucherId
            });

              let res = fetchx(API_URL + '/applyDiscount', {
                  method: 'POST',
                  body: discData,
                  headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                  },
                })
                  .then((res) => res.json())
                  .then(result => {            
                    if (result['statuscode'] == 200) {
                      onClose();
                      const swalInstance = MySwal.fire({
                      
                        text: 'Coupon applied successfully!!',
                        icon: 'success',
                        buttonsStyling: false,
                        confirmButtonText: 'Close',
                        customClass: {
                          confirmButton: 'btn btn-danger'
                        }
                      });
                      swalInstance.then((result) => {
                        if (result.isConfirmed) {
                          navigate('/apps/posconfiguration/DisplayBill');
                        }
                      });
            
                    }
            
                  })
  
          // }
          // if (result.statusCode === 403) {
          //   const swalInstance = MySwal.fire({
          //     text: result.message,
          //     icon: 'error',
          //     buttonsStyling: false,
          //     confirmButtonText: 'Close',
          //     customClass: {
          //       confirmButton: 'btn btn-danger'
          //     }
          //   });
          
          //   swalInstance.then((result) => {
          //     if (result.isConfirmed) {
          //       onClose();
          //     }
          //   });
          // }
          
        // })

  
  };

  const { reset, handleSubmit, control, formState: { errors }
  } = useForm();

  return (
    // <Modal isOpen={isOpen} style={{ maxWidth: '650px' }}>
    //   <ModalHeader>
    //     <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Discount Order</span>
    //   </ModalHeader>
    //   <ModalBody>
    //     <Form onSubmit={handleFormSubmit}>
    //       <Row className="mt-2">
    //         <Col sm="8">
    //           <InputGroup className="input-group-merge">
    //             <Input
    //               id="discountValue"
    //               name="discountValue"
    //               placeholder={discType === 'Amount' ? 'Enter the amount' : 'Enter the percentage'}
    //               required
    //               className="form-control"
    //             />
    //           </InputGroup>
    //         </Col>
    //         <Col>
    //           <Button
    //             color={discType === 'Amount' ? 'primary' : 'secondary'}
    //             onClick={() => setDiscType('Amount')}
    //             style={{ width: '40%', marginRight: '5px' }}
    //           >
    //             Amt
    //           </Button>
    //           <Button
    //             color={discType === 'Percentage' ? 'primary' : 'secondary'}
    //             onClick={() => setDiscType('Percentage')}
    //             style={{ width: '40%' }}
    //           >
    //             %
    //           </Button>
    //         </Col>
    //       </Row>
    //       <Row className="mt-2">
    //         <Col sm="12">
    //           <InputGroup className="input-group-merge">
    //             <Input
    //               id="discountReason"
    //               name="discountReason"
    //               placeholder="Enter Reason For Discount"
    //               required
    //               className="form-control"
    //             />
    //           </InputGroup>
    //         </Col>
    //       </Row>
    //       <ModalFooter>
    //         <Button outline onClick={onClose}>Cancel</Button>
    //         <Button type="submit" color="primary">Submit</Button>
    //       </ModalFooter>
    //     </Form>
    //   </ModalBody>
    // </Modal>

<Modal isOpen={isOpen} style={{ maxWidth: '650px' }}>
      <ModalHeader>
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Discount Order</span>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleFormSubmit}>
          <Row>
            <Col>
              <InputGroup className="input-group-merge">
                <Controller
                  id="Food"
                  name="Food"
                  control={control}
                  render={({ field }) => (
                    <Cleave
                      pattern="[0-9]*"
                      title="Only Numbers Allowed"
                      placeholder="Food%"
                      {...field}
                      className="form-control"
                    />
                  )}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="input-group-merge">
                <Controller
                  id="SoftDrinks"
                  name="SoftDrinks"
                  control={control}
                  render={({ field }) => (
                    <Cleave
                      pattern="[0-9]*"
                      title="Only Numbers Allowed"
                      placeholder="SoftDrink%"
                      {...field}
                      className="form-control"
                    />
                  )}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="input-group-merge">
                <Controller
                  id="Liquor"
                  name="Liquor"
                  control={control}
                  render={({ field }) => (
                    <Cleave
                      pattern="[0-9]*"
                      title="Only Numbers Allowed"
                      placeholder="Liquor%"
                      {...field}
                      className="form-control"
                    />
                  )}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="input-group-merge">
                <Controller
                  id="Smokes"
                  name="Smokes"
                  control={control}
                  render={({ field }) => (
                    <Cleave
                      pattern="[0-9]*"
                      title="Only Numbers Allowed"
                      placeholder="Smokes%"
                      {...field}
                      className="form-control"
                    />
                  )}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="input-group-merge">
                <Controller
                  id="Others"
                  name="Others"
                  control={control}
                  render={({ field }) => (
                    <Cleave
                      pattern="[0-9]*"
                      title="Only Numbers Allowed"
                      placeholder="Others%"
                      {...field}
                      className="form-control"
                    />
                  )}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col sm="12">
              <InputGroup className="input-group-merge">
                <Input
                  id="discountReason"
                  name="discountReason"
                  placeholder="Enter Reason For Discount"
                  required
                  className="form-control"
                />
              </InputGroup>
            </Col>
          </Row>
          <ModalFooter>
            {/* <Button outline onClick={onClose}>Cancel</Button> */}
            <Button outline onClick={() => {
              localStorage.removeItem('selectedVoucherData');
              onClose();
            }}>
              Cancel
            </Button>
            <Button type="submit" color="primary">Submit</Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>

  );
};

export default CouponForm;
