
// ** React Imports
import { useState } from "react";
// ** Third Party Components;
import "cleave.js/dist/addons/cleave-phone.us";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback} from 'react';
import API_URL from "../../../config";
import {Card,CardHeader,CardTitle,CardBody} from 'reactstrap'

const UnSettledBills = () => {

  // AG Grid
  const [rowData, setRowData] = useState();

  const gridRef = useRef();

    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Restaurant Name', field: 'restaurantName', maxWidth: 250 },
        { headerName: 'Table No', field: 'tableNo', maxWidth: 250 },
        { headerName: 'Order ID', field: 'orderID', maxWidth: 140 },
        { headerName: 'Date Time', field: 'dateTime', maxWidth: 250 },

    ]);

  const defaultColDef = useMemo( ()=> ( 
    {
      sortable: true,   
      filter: true,
      filterParams :{
      buttons : ['apply','reset']
      }
    }
  ));

  const cellClickedListener = useCallback( event => {
  }, []);

  useEffect(() => {
    let unSettleData = JSON.stringify({
        hotelID: 1
    })
    fetchx(API_URL + "/getPOSUnsettledOrders", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: unSettleData
    }).then(result => result.json())
    .then(rowData =>{
      // for(let i=0; i<10;i++){
   
setRowData(rowData['data'])
    }
    )
    
  }, []);
 





  return (
    <div>
     <Card>
          <CardHeader>
            <CardTitle tag="h4"><b>Unsettled Bills</b></CardTitle>
          </CardHeader>
        </Card>
        <div className="ag-theme-alpine" style={{ width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        animateRows={true}
        rowSelection="multiple"
        onCellClicked={cellClickedListener}
        domLayout='autoHeight' // Use autoHeight for dynamic height
        defaultColDef={defaultColDef}
        headerColor="ddw-primary"
      />
    </div>
    {/* <App/> */}
    </div>
  );
};

export default UnSettledBills;





