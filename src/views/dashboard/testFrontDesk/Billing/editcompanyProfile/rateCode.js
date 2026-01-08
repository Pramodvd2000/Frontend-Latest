// ** React Imports
import { useRef, useState } from "react";
import { Button,  Modal,  ModalHeader,  ModalBody,} from "reactstrap";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useEffect, useMemo, useCallback } from "react";
import "./hover.scss";
import API_URL from "../../../config";
import { useNavigate } from 'react-router-dom';

 const RateCodeRoomRates = (ratecodeViewRates) => {
  console.log(ratecodeViewRates)
  console.log(ratecodeViewRates.ratecodeViewRates)

  const [rowData, setRowData] = useState();
  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Rate Code ",
      field: "rateCode",
      suppressSizeToFit: true,
      maxWidth: 130, },
    { headerName: "Room Type ", field: "roomType", suppressSizeToFit: true, maxWidth: 130,},
    { headerName: "One Adult Price", field: "oneAdultPrice"     ,maxWidth: 160 }, 
    { headerName: "Extra Adult Price ", field: "extraAdultPrice",maxWidth: 160 },
    { headerName: "Extra Child Price", field: "extraChildPrice" ,maxWidth: 160 },
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));

  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);
  useEffect(() => {
    console.log("Hiiiiiiiiiiiiiiii");
    fetchx(API_URL + `/getAccRatecodeRoomRate?id=${ratecodeViewRates.ratecodeViewRates}`)
    .then((result) => result.json())
    .then((rowData) => {
      console.log(rowData)
      setRowData(rowData["data"]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

  }, [ratecodeViewRates]);

  return (
    <div>
      {/* <button onClick={buttonListener}>Push Me</button> */}
      <div className="ag-theme-alpine" style={{ height: 250 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection="multiple"
          onCellClicked={cellClickedListener}
          // paginationAutoPageSize = 'true'
          // paginationPageSize="10"
          // pagination = 'true'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
        />
      </div>
    </div>
  );
};
  


const RateCodeBasicDetails = (data1) => {
    console.log(data1)
    const [rowData, setRowData] = useState();
    const gridRef = useRef();
    const [show, actionButton] = useState(false);
    let navigate = useNavigate();

    const [columnDefs, setColumnDefs] = useState([
      {headerName: "Rate Code ",field: "rateCode", suppressSizeToFit: true, maxWidth: 100,},
      { headerName: "Description", field: "description"    ,maxWidth: 135 },
      { headerName: 'BeginSellDate', field: 'beginSellDate',maxWidth: 150 },
      { headerName: 'End Sell Date', field: 'endSellDate'  ,maxWidth: 150 },
      { headerName: "Package Code ", field: "packageCode"  ,maxWidth: 150 },
      { headerName: "Market Code", field: "marketCode"     ,maxWidth: 135 },
      { headerName: 'Source Code ', field:'sourceCode'     ,maxWidth: 135 },
      {headerName: "Action",field: "numAvlRooms", suppressSizeToFit: true, maxWidth: 140,cellRendererFramework: (params) => (
        <Button color="primary" onClick={() => {
           actionButton(!show); }}> View
        </Button>
      ),
    },
    ]);
  
    const defaultColDef = useMemo(() => ({
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ["apply", "reset"],
      },
    }));

    const [rateCodeID, setRateCodeID] = useState([]);
    const rates = [];
    const cellClickedListener = useCallback((event) => {
      console.log("cellClicked", event);
     rates.push(event.data.rateCodeID);
     setRateCodeID(rates);
    }, []);

    console.log(rateCodeID[0])
    const rcViewRates = rateCodeID[0];

    useEffect(() => {
      console.log(localStorage.getItem["id"]);
      fetchx(API_URL + `/getAccRatecode?hotelID=1&accountID=${data1.data1.companyid}`)
        .then((result) => result.json())
        .then((rowData) => setRowData(rowData["data"]));
      console.log(rowData);
    }, []);
    console.log(rowData);
   
    const navigatepage = () => {
      navigate('');
  };

  
    return (
      <div>
     { console.log(rateCodeID[0])}
     { console.log(rcViewRates)}

        <div>
        <Modal isOpen={show} toggle={() => actionButton(!show)} className="modal-lg">
          <ModalHeader toggle={() => actionButton(!show)}> Modify RateCode Details </ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>         
             <RateCodeRoomRates ratecodeViewRates={rcViewRates}/>        
          </ModalBody>
         </Modal>
        </div>    

        <div className="ag-theme-alpine" style={{ height: 150 }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            animateRows={true}
            rowSelection="multiple"
            onCellClicked={cellClickedListener}
            // paginationAutoPageSize = 'true'
            // paginationPageSize="10"
            // pagination = 'true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
          />
        </div>
        <br/>
        <div align='end' className='buttons'>                         
        <Button color="primary" className="me-1" type="button" onClick={navigatepage}>
            Exit
        </Button>
             </div>
      </div>
    );
  };

  export default RateCodeBasicDetails;