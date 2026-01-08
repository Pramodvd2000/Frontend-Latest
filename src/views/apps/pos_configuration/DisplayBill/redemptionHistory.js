import React, { useState, useRef, useEffect, useCallback } from 'react'
import API_URL from "../../../../config";
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { Modal, ModalHeader,Label, ModalBody, ModalFooter, Button, Form, Row, Col, InputGroup, Input } from 'reactstrap';



const redemptionhistory = ({ isOpen1, onClose1 ,phoneNumberRedemption}) => {
  // console.log(phoneNumberRedemption)

  // let redemptionPhonenumber = sessionStorage.getItem('phoneNumberRedemption');
  const gridRef = useRef();
  const [logData, setLogData] = useState(false)
  // useEffect(() => {
  //   // fetchx(API_URL + '/getRedeemptionHistoryOfVouchersByPhoneNumber?phoneNumber=8971774048')
  //   console.log(API_URL + `/getRedeemptionHistoryOfVouchersByPhoneNumber?phoneNumber=${redemptionPhonenumber}`)
  //   fetchx(API_URL + `/getRedeemptionHistoryOfVouchersByPhoneNumber?phoneNumber=${redemptionPhonenumber}`)


  //   .then(result => result.json())

  //   .then(resp => {
  //     setLogData(resp['data'])
  //   })

  // }, []);
  useEffect(() => {
    if (phoneNumberRedemption) {
      fetch(`${API_URL}/getRedeemptionHistoryOfVouchersByPhoneNumber?phoneNumber=${phoneNumberRedemption}`)
        .then(result => result.json())
        .then(resp => {
          setLogData(resp.data);
        })
        .catch(error => {
          console.error('Error fetching redemption history:', error);
        });
    }
  }, [phoneNumberRedemption]);


  // Ag-grid options
  const gridOptions = {
    defaultColDef: {
      cellStyle: { whiteSpace: 'normal' }, // Allow text wrapping
      autoHeight: true, // Allow the cell to expand vertically
    },
  };




  //AG-GRID columns to show daily details
  const [columnDefs1, setColumnDefs1] = useState([
    {
      headerName: 'Voucher Code', field: 'voucherCode', maxWidth: 150
    },
    {
      headerName: 'Description', field: 'description', maxWidth: 250
    },
    {
      headerName: 'Voucher Type', field: 'VoucherType', maxWidth: 150
    },
    {
      headerName: 'Redeemed Date', field: 'RedeemedDateTime', maxWidth: 200
    },

  ])


  // On search element
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);




  return (
    <div>
    
      <Modal isOpen={isOpen1} 
      className='modal-lg'
      toggle={onClose1}

      >
      {/* <ModalHeader>Redemption History</ModalHeader> */}
      <ModalBody>
      <h3>
          Redemption History
        </h3>
        <br></br>
        {/* <div>
          <Col md="3" sm="12" className="mb-1">
            <Label className="form-label" for="fullName">
              Search
            </Label>
            <Input
              type="text"
              id="filter-text-box"
              placeholder="Filter..."
              onInput={onFilterTextBoxChanged}
            />
          </Col>
        </div> */}

        {/* <div className="ag-theme-alpine" style={{ height: '693px', width: '100%' }}> */}
        <div className="ag-theme-alpine" style={{ height: '550px', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={logData}
            columnDefs={columnDefs1}
            animateRows={true}
            rowSelection='multiple'
            pagination={true}
            paginationPageSize='10'
            gridOptions={gridOptions}
            headerColor="ddw-primary"
          />
        </div>
      </ModalBody>
    </Modal>
    </div>
  )
}


export default redemptionhistory 