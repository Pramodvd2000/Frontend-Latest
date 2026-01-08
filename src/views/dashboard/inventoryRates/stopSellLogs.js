
// ** React Imports
import { useState } from "react";
// ** Third Party Components;
import "cleave.js/dist/addons/cleave-phone.us";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
// import App from "./roomInventoryDataTable";
import { AgGridReact } from 'ag-grid-react';

import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';// import './Assettable.css';
import { useRef, useEffect, useMemo, useCallback } from 'react';
import API_URL from "../../../config";
import { Card, CardHeader, CardTitle, CardBody, Modal, ModalBody, ModalHeader, Button, Col, Row, Label, Input } from 'reactstrap'


const UnSettledBills = () => {

  // AG Grid
  const [rowData1, setRowData1] = useState();
  const [openModal, setOpenModal] = useState();


  const gridRef = useRef();



  const [columnDefs, setColumnDefs] = useState([
    // { headerName: 'ID', field: 'id', maxWidth: 100 },
    { headerName: 'From Date', field: 'fromDate', maxWidth: 120 },
    { headerName: 'To Date', field: 'toDate', maxWidth: 120 },
    { headerName: 'Room Type', field: 'roomType', maxWidth: 130 },
    { headerName: 'Status', field: 'status', maxWidth: 140 },
    { headerName: 'Modified By', field: 'userName', maxWidth: 140 },
    { headerName: 'Modified At', field: 'createdAt', maxWidth: 250 },

  ]);

  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      autoHeight: true,
      wrapText: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));


  const cellClickedListener = useCallback(event => {
  }, []);


  useEffect(() => {

    fetchx(API_URL + '/getStopSellLogs', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      .then(result => result.json())
      .then(rowData => {
        setRowData1(rowData.data);

      }
      )

  }, []);





  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box3").value
    );
  }, []);





  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4"><b>Stop Sell Logs</b></CardTitle>
        </CardHeader>
        <CardBody>
        <Row>
          <Col md="2" sm="12" className="mb-1">
          <Label className="form-label" for="fullName">
            Search
          </Label>
          <Input
            type="text"
            id="filter-text-box3"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
          />
        </Col>
          </Row>
          <div className="ag-theme-alpine" style={{ width: '100%' }}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData1}
              columnDefs={columnDefs}
              animateRows={true}
              rowSelection="multiple"
              onCellClicked={cellClickedListener}
              domLayout='autoHeight' // Use autoHeight for dynamic height
              pagination={true}
              paginationPageSize={10}
              defaultColDef={defaultColDef}
              headerColor="ddw-primary"

            />
          </div>
        </CardBody>
      </Card>


    

      <Modal isOpen={openModal} toggle={() => setOpenModal(!openModal)} className='modal-xl'>
        <ModalHeader className='modal-xl' toggle={() => setOpenModal(!openModal)}></ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20'>
          <Row>
          <Col md="2" sm="12" className="mb-1">
          <Label className="form-label" for="fullName">
            Search
          </Label>
          <Input
            type="text"
            id="filter-text-box3"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
          />
        </Col>
          </Row>
          <div className="ag-theme-alpine" style={{ width: '100%' }}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData1}
              columnDefs={columnDefs}
              animateRows={true}
              rowSelection="multiple"
              onCellClicked={cellClickedListener}
              domLayout='autoHeight' // Use autoHeight for dynamic height
              pagination={true}
              paginationPageSize={10}
              defaultColDef={defaultColDef}
              headerColor="ddw-primary"
            // onPaginationChanged={(event) => onPageChanged(event.api.paginationGetCurrentPage() + 1)}

            />
          </div>
        </ModalBody>
      </Modal>

      {/* <App/> */}
    </div>
  );
};

export default UnSettledBills;





