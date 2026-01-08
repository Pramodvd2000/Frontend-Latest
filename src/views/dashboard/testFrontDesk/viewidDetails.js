

// const Floor = ({ data1 }) => {
//   //console.log(data1.data1)
//   const [rowData1, setRowData1] = useState();
//   const gridRef = useRef();
//   const [rowData, setRowData] = useState();
//   // Get ID Details
//   // useEffect(() => {
//   //   fetchx(API_URL + `/getiddetails?guestID=${data1.data1.id}`)
//   //     .then((result) => result.json())
//   //     .then((rowData) => 
//   //     setRowData(rowData["data"]));
//   // }, []);
//   useEffect(() => {
//     // if (data1.data1.id !== undefined) {
//       fetchx(API_URL + `/getiddetails?guestID=31876`)
//         .then((result) => result.json())
//         .then((rowData) => setRowData(rowData["data"]));
//     // }
//   }, [data1.data1.id]); 

//         //console.log(rowData)


import { useState } from "react";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from "react";
import API_URL from "../../../config";

const Floor = ({ data1 }) => {
  //console.log(data1)
  const [rowData1, setRowData1] = useState();
  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  // Get Booker Details
  useEffect(() => {
    fetchx(API_URL + `/getiddetails?guestID=${data1.data1.guestID}`)
      .then((result) => result.json())
      .then((rowData) => {
        //console.log(rowData);
        setRowData1(rowData["data"]);
      });
  }, [data1.data1.guestID]); 

  // Get Booker Details
  const [columnDefs, setColumnDefs] = useState([
    { headerName: "Name",field: "nameOnDocument",suppressSizeToFit: true,maxWidth: 120,editable: true,},    
    {headerName: "IDType", field: "IDType", suppressSizeToFit: true,maxWidth: 120,editable: true},
    { headerName: "Id Number ", field: "idNumber", suppressSizeToFit: true ,maxWidth: 150,editable: true,},
    { headerName: "ExpiryDate ", field: "expiryDate", suppressSizeToFit: true,maxWidth: 140,editable: true, },
     ]);


     // ON CELL VALUE CHANGE
     
  const onCellValueChanged = useCallback(event => {
    //console.log('onCellValueChanged', event)
    //console.log(event.data)
  }, [])



  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));

  const cellClickedListener = useCallback((event) => {
    //console.log("cellClicked", event);
  }, []);


  return (
    <div>    
            {/* // AG Grid to Display ID Details */}
      <div className="ag-theme-alpine" style={{ height: 220 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData1} 
                    columnDefs={columnDefs}
                    animateRows={true} 
                    rowSelection='multiple'
                    onCellClicked={cellClickedListener}
                    // paginationAutoPageSize = 'true'
                    onCellValueChanged={onCellValueChanged}
                    paginationPageSize='10'
                    pagination='true'
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"

                />
            </div>
                
    </div>
  );
};

export default Floor;