





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
import 'ag-grid-enterprise'
import classnames from "classnames";


import { useRef, useEffect, useMemo, useCallback } from 'react';
import API_URL from "../../../config";
// import {Card,CardHeader,CardTitle,CardBody} from 'reactstrap'
import {
  Input, Card, Form, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, Modal, ModalBody, ModalHeader, InputGroupText, Row, Col,
  Accordion, AccordionBody, AccordionHeader, AccordionItem
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import Moment from 'moment';
import Select from "react-select";
import { selectThemeColors } from "@utils";
import Flatpickr from "react-flatpickr";

import YourComponent from "./dynamicTableEdit";
import UploadExcel from "./uploadExcel";
import UploadWeekEndExcel from "./weekEndExcel";
import OverightBlocking from "./overightBlocking";
import DynamicPricingDayWise from "./dynamicPricingDayWise";
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
const MySwal = withReactContent(Swal)







const MyGrid = () => {
  const [rowData, setRowData] = useState([]);

  const handleSuccess = (message) => {
    return MySwal.fire({
      title: 'Dynamic Pricing',
      text: message,
      icon: 'success',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    });
  };

  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-danger',
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    });
  };

  const columnDefs = [
    { headerName: 'Room Class', field: 'roomClass' },
    { headerName: 'Range From', field: 'occupancyFrom', width: 150, editable: true, type: 'number' },
    { headerName: 'Range To', field: 'occupancyTo', width: 100, editable: true, type: 'number' },
    { headerName: 'Base Amount', field: 'baseAmount', width: 150, editable: true, type: 'number' },
    {
      headerName: 'Actions',
      cellRendererFramework: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Button
            color="primary"
            style={{ width: 130 }}
            onClick={() => {
              console.log(params);
              forFinalChange(params.data);
            }}
          >
            Change
          </Button>
        </div>
      ),
      suppressSizeToFit: true,
      cellStyle: { textAlign: 'center' },
      cellClass: 'vertical-center',
    },
  ];

  function forFinalChange(data) {
    console.log(data);

    const idArray = JSON.parse(data.id_array);

    const unAssign = JSON.stringify({
      IDs: idArray,
      fromRange: data.occupancyFrom,
      toRange: data.occupancyTo,
      baseAmount: data.baseAmount,
      roomClassID: data.roomClassID,
    });

    fetchx(API_URL + "/updateDynamicPricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: unAssign,
    })
      .then(result => result.json())
      .then(data => {
        if (data.statusCode === 200) {
          handleSuccess("Dynamic Price updated successfully!!");
        }
      });
  }

  useEffect(() => {
    const unAssign = JSON.stringify({ hotelID: 1 });

    fetchx(API_URL + "/getDynamicPrising", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: unAssign,
    })
      .then(result => result.json())
      .then(data => setRowData(data.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  const cellClickedListener = useCallback(event => {
    console.log('cellClicked', event);

  }, []);



  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));

  const RemarksWithDownloadRenderer = (props) => {
    const { remarks, fileData, fileName } = props.data;

    if (!fileData || !fileName) return <span>{remarks}</span>;

    // Convert base64 to Blob
    const byteCharacters = atob(fileData);
    const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = URL.createObjectURL(blob);

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>{remarks}</span>
        <a href={url} download={fileName} style={{ color: '#007bff', textDecoration: 'underline' }}>
          Download
        </a>
      </div>
    );
  };


  // 2nd Ag Grid

  const gridRef1 = useRef();
  const [rowData1, setRowData1] = useState();
  const [openModal, setOpenModal] = useState();
  const [openWeekEndModal, setOpenWeekEndModal] = useState();
  const [openLogs, setOpenLogs] = useState();
  const [openOveright, setOpenOveright] = useState();

  const [columnDefs1, setColumnDefs1] = useState([
    { headerName: 'Room Class', field: 'roomClass', maxWidth: 250 },
    { headerName: 'Room Type', field: 'roomType', maxWidth: 250 },
    { headerName: 'Remarks', field: 'remarks', width: 600, cellRenderer: RemarksWithDownloadRenderer, },
    //     {
    //   headerName: 'Download',
    //   field: 'fileData',
    //   cellRenderer: DownloadCellRenderer,
    //   maxWidth: 130
    // },
    { headerName: 'Created At', field: 'createdAt', width: 180 },
    { headerName: 'Created By', field: 'createdByUser', width: 140 },

  ]);


useEffect(() => {
  if (openLogs === true) {
    const unAssign = JSON.stringify({
      hotelID: 1
    });

    fetchx(API_URL + "/getDynamicPricingLogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: unAssign,
    })
      .then(result => result.json())
      .then(rowData => {
        setRowData1(rowData.data);
      });
  }
}, [openLogs]);


  const defaultColDef1 = useMemo(() => (
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


  return (
    <div>
      {/* <h2>Dynamic Pricing</h2>
      <p style={{color:"blue"}}>Double click to edit!!</p>
<Button color='primary' style={{align:'align-end'}}>Upload</Button> */}
      {/* <div style={{ display: 'flex', alignItems: 'center', gap: '500px' }}>
        <h2 style={{ margin: 0 }}>Dynamic Pricing</h2>
        <Button color='primary' onClick={() => setOpenModal(!openModal)}>Upload Sheet</Button>
        <Button color='primary' onClick={() => setOpenModal(!openModal)}>Disable Rate Update</Button>
      </div> */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Dynamic Pricing</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button color='primary' onClick={() => setOpenModal(!openModal)}>Upload Sheet</Button>
          <Button color='primary' onClick={() => setOpenWeekEndModal(!openWeekEndModal)}>Weekend Upload Sheet</Button>
          <Button color='primary' onClick={() => setOpenLogs(!openLogs)}>Change Logs</Button>
          <Button color='primary' onClick={() => setOpenOveright(!openOveright)}>Block Dynamic Pricing</Button>
        </div>
      </div>

      {/* <p style={{ color: "blue" }}>Double click to edit!!</p> */}

      {/* <div className="ag-theme-alpine" style={{ height: 800 }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          singleClickEdit={true} // Enable one-click editing
          onCellClicked={cellClickedListener}
          //  onCellValueChanged={onCellValueChanged}
           defaultColDef={defaultColDef}
         



        />
      </div> */}
      {/* <YourComponent /> */}
      <DynamicPricingDayWise/>
      {/* <br></br>
      <h2>Dynamic Price Change Logs</h2>
      <div className="ag-theme-alpine" style={{ width: '100%' }}>
        <AgGridReact
          ref={gridRef1}
          rowData={rowData1}
          columnDefs={columnDefs1}
          animateRows={true}
          rowSelection="multiple"
          // onCellClicked={cellClickedListener1}
          domLayout='autoHeight' // Use autoHeight for dynamic height
          defaultColDef={defaultColDef1}
          headerColor="ddw-primary"
          paginationPageSize='10'
          pagination='true'
        />
      </div> */}


      <Modal isOpen={openModal} toggle={() => setOpenModal(!openModal)} className="modal-xl">
        <ModalHeader toggle={() => setOpenModal(!openModal)} className="modal-xl">
          Excel Upload
        </ModalHeader>
        <ModalBody className="modal-xl">

          <UploadExcel />

        </ModalBody>
      </Modal>


  <Modal isOpen={openWeekEndModal} toggle={() => setOpenWeekEndModal(!openWeekEndModal)} className="modal-xl">
        <ModalHeader toggle={() => setOpenWeekEndModal(!openWeekEndModal)} className="modal-xl">
          Weekend Excel Upload
        </ModalHeader>
        <ModalBody className="modal-xl">

          <UploadWeekEndExcel />

        </ModalBody>
      </Modal>


      <Modal isOpen={openLogs} toggle={() => setOpenLogs(!openLogs)} className="modal-xl">
        <ModalHeader toggle={() => setOpenLogs(!openLogs)} className="modal-xl">
          Excel Upload
        </ModalHeader>
        <ModalBody className="modal-xl">

          <br></br>
          <h2>Dynamic Price Change Logs</h2>
          <div className="ag-theme-alpine" style={{ width: '100%' }}>
            <AgGridReact
              ref={gridRef1}
              rowData={rowData1}
              columnDefs={columnDefs1}
              animateRows={true}
              rowSelection="multiple"
              // onCellClicked={cellClickedListener1}
              domLayout='autoHeight' // Use autoHeight for dynamic height
              defaultColDef={defaultColDef1}
              headerColor="ddw-primary"
              paginationPageSize='10'
              pagination='true'
            />
          </div>
        </ModalBody>
      </Modal>


      <Modal isOpen={openOveright} toggle={() => setOpenOveright(!openOveright)} className="modal-xl">
        <ModalHeader toggle={() => setOpenOveright(!openOveright)} className="modal-xl">
          Block Dynamic Pricing
        </ModalHeader>
        <ModalBody className="modal-xl">

          <OverightBlocking />

        </ModalBody>
      </Modal>
    </div>
  );
};

export default MyGrid;


