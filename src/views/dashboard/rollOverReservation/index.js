
// ** React Imports
import { useState } from "react";
// ** Third Party Components;
import "cleave.js/dist/addons/cleave-phone.us";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
// import App from "./roomInventoryDataTable";
import {AgGridReact} from 'ag-grid-react';

import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';// import './Assettable.css';
import 'ag-grid-enterprise'

import { useRef, useEffect, useMemo, useCallback} from 'react';
import API_URL from "../../../config";
import {Card,CardHeader,CardTitle,CardBody} from 'reactstrap'

const rollOverData = () => {

  // AG Grid
  const [rowData, setRowData] = useState();

  const gridRef = useRef();

    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Room No.', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 100 },
        { headerName: 'Booking ID', field: 'bookingID', maxWidth: 130 },
        { headerName: 'Guest', field: 'guestName', maxWidth: 200 },
        {
          headerName: "Comp/Agent",
          field: "accountName",
          suppressSizeToFit: true,
          maxWidth: 132,
        },
        { headerName: 'Room Type', field: 'roomType', maxWidth: 130 },
        // { headerName: 'Date', field: 'date', maxWidth: 140 },
        { headerName: 'Arrival Date', field: 'arrivalDate', maxWidth: 148 },
        { headerName: 'Departure Date', field: 'departureDate', maxWidth: 148 },
        { headerName: 'Rollover Date', field: 'originalDate', maxWidth: 148 },
        { headerName: 'Actual Date', field: 'actualArrival', maxWidth: 148 },
        { headerName: 'Rate for Rollover Date (Incl. GST)', field: 'rateForThatDay', width: 300 },
        // { headerName: 'Total(Incl. GST)', field: 'total', maxWidth: 158 },

    ]);

  const defaultColDef = useMemo( ()=> ( 
    {
      sortable: true,   
      filter: true,
      autoHeight: true,
      wrapText: true,
      filterParams :{
      buttons : ['apply','reset']
      }
    }
  ));

  const cellClickedListener = useCallback( event => {
  }, []);

  useEffect(() => {
    let unAssign = JSON.stringify({
        hotelID: 1
    });
    let res = fetchx(API_URL + "/getIsRollOverReservationData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: unAssign,
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
            <CardTitle tag="h4"><b>Rollover Reservations</b></CardTitle>
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

export default rollOverData;





