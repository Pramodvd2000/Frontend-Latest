
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
import API_URL from "../../../../config";
import { Card, CardHeader, CardTitle, CardBody, Modal, ModalBody, ModalHeader, Button, Col, Row, Label, Input } from 'reactstrap'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'

const UnSettledBills = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [rowData1, setRowData1] = useState();
  const [openModal, setOpenModal] = useState();
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(null);
  const [open, setOpen] = useState(false);
  const [roomNumberFilter, setRoomNumberFilter] = useState('');


  const gridRef = useRef();
  const gridRef1 = useRef();

  const [columnDefs1, setColumnDefs1] = useState([
    { headerName: 'Room No.', field: 'roomNumber', maxWidth: 150 },
    { headerName: 'Room Type', field: 'roomType', maxWidth: 150 },
    { headerName: 'FO Status', field: 'frontOfficeStatus', maxWidth: 140 },
    { headerName: 'Room Status', field: 'roomStatus', maxWidth: 250 },
    { headerName: 'Floor', field: 'floorID', maxWidth: 250 },
    { headerName: 'Actions', cellRendererFramework: (params) => <Button color='primary' style={{ width: 128 }} onClick={() => { setSelectedRoomNumber(params.data.roomNumber); fetchRoomStatusLogs(params.data.roomNumber); }} >Change Logs</Button>, suppressSizeToFit: true },


  ]);

  const [columnDefs, setColumnDefs] = useState([
    // { headerName: 'ID', field: 'id', maxWidth: 100 },
    { headerName: 'Room No.', field: 'roomNumber', maxWidth: 150 },
    { headerName: 'Room Type', field: 'roomType', maxWidth: 150 },
    // { headerName: 'Old Status', field: 'oldRoomStatus', maxWidth: 140 },
    // { headerName: 'New Status', field: 'newRoomStatus', maxWidth: 250 },
    // { headerName: 'Description', field: 'statusDescription', width: 350 },
    {
      headerName: 'Description',
      field: 'statusDescription',
      width: 380,
      cellRenderer: function (params) {
        const data = params.data;
        // return `Room status modified from ${data.oldRoomStatus} to ${data.newRoomStatus}`;
        // return `Room status modified from ${data.oldRoomStatus} to ${data.newRoomStatus}`;
        // return "Room status modified from " + "**" + data.oldRoomStatus + "**" + " to " + "**" + data.newRoomStatus + "**";
        return (
          <div>
            Room status modified from <span style={{ fontWeight: 'bold' }}>{data.oldRoomStatus}</span> to <span style={{ fontWeight: 'bold' }}>{data.newRoomStatus}</span>
          </div>
        );
      }


    },


    { headerName: 'Modified By', field: 'userName', maxWidth: 250 },
    { headerName: 'Description', field: 'description', maxWidth: 250 },
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
  const defaultColDef1 = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));

  const cellClickedListener = useCallback(event => {
  }, []);
  const cellClickedListener1 = useCallback(event => {
  }, []);

  useEffect(() => {

    fetchx(API_URL + "/room")
      .then(result => result.json())
      .then(rowData => {

        const sortedData = rowData.data.sort((a, b) => a.roomNumber - b.roomNumber);
        setRowData1(sortedData);

      }
      )



  }, []);


  const fetchRoomStatusLogs = (roomNumber) => {
    setOpen(true)
    let unSettleData = JSON.stringify({
      hotelID: 1,
    });

    if (roomNumber) {
      unSettleData = JSON.stringify({
        ...JSON.parse(unSettleData),
        roomNumber: roomNumber
      });
    }

    fetchx(API_URL + "/getRoomStatusLogs", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: unSettleData
    }).then(result => result.json())
      .then(rowData => {
        if (rowData.statusCode === 200) {
          const filteredData = rowData.data.filter(item => item.roomNumber === roomNumber);
        
          const sortedData = filteredData.sort((a, b) => b.id - a.id);
          sortedData.forEach(item => {
            item.createdAtIST = new Date(item.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
          }); 
          setRowData(sortedData);
          setOpen(false)
          setOpenModal(true);

        }
        // setRowData(rowData['data']);
      })
      .catch(error => console.error("Error fetching room status logs:", error));
  };


  const onFilterTextBoxChanged1 = useCallback(() => {
    gridRef1.current.api.setQuickFilter(
      document.getElementById("filter-text-box2").value
    );
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box3").value
    );
  }, []);


  const handleInputChange = (e) => {
    setRoomNumberFilter(e.target.value);
    if (gridRef1.current) {
      const filterModel = gridRef1.current.api.getFilterModel();
      filterModel['roomNumber'] = {
        filter: e.target.value,
        type: 'text',
      };
      gridRef1.current.api.setFilterModel(filterModel);
    }
  };


  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4"><b>Room Status Logs</b></CardTitle>
        </CardHeader>
      </Card>
      <Row>
        {/* <Col md="2" sm="12" className="mb-1">
          <Label className="form-label" for="fullName">
            Room Number Filter:
          </Label>
          <Input
            type="text"
            id="roomNumberFilter"
            value={roomNumberFilter}
            onChange={handleInputChange}
            // onKeyPress={handleInputKeyPress}
            placeholder='Type room number'

          />
        </Col> */}
        <Col md="2" sm="12" className="mb-1">
          <Label className="form-label" for="fullName">
            Search
          </Label>
          <Input
            type="text"
            id="filter-text-box2"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged1}
          />
        </Col>
      </Row>
      <div className="ag-theme-alpine" style={{ width: '100%' }}>
        <AgGridReact
          ref={gridRef1}
          rowData={rowData1}
          columnDefs={columnDefs1}
          animateRows={true}
          rowSelection="multiple"
          onCellClicked={cellClickedListener1}
          domLayout='autoHeight' // Use autoHeight for dynamic height
          pagination={true}
          paginationPageSize={10}
          defaultColDef={defaultColDef1}
          headerColor="ddw-primary"
        // onPaginationChanged={(event) => onPageChanged(event.api.paginationGetCurrentPage() + 1)}

        />
      </div>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={() => setOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>
            Loading data ....
          </h2>

          <CircularProgress color="inherit" />
        </div>
      </Backdrop>

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
              rowData={rowData}
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





