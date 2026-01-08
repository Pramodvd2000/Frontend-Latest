
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

const AvailabilityMatrix = () => {

  // AG Grid
  const [rowData, setRowData] = useState();

  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
    // {headerName: 'ID',field: 'id',suppressSizeToFit: true,maxWidth: 160},
    // {headerName: 'Hotel ID',field: 'hotelID',suppressSizeToFit: true},
    // {headerName: 'Room ID',field: 'roomID'},
    {headerName: 'Inventory Date',field: 'date'},
    {headerName: 'KSUP',field: '0',maxWidth: 135},
    {headerName: 'TSUP',field: '1',maxWidth: 135},
    {headerName: 'KDLX',field: '2',maxWidth: 135},
    {headerName: 'TDLX',field: '3',maxWidth: 135},
    {headerName: 'KCLB',field: '4',maxWidth: 135},
    {headerName: 'TCLB',field: '5',maxWidth: 135},
    {headerName: 'EXE',field: '6',maxWidth: 135 },
    {headerName: 'Total',field: 'totalRoom',maxWidth: 135 }

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
    console.log('cellClicked', event);
  }, []);

  useEffect(() => {
    fetchx(API_URL + '/getinventory?hotelID=1')
    .then(result => result.json())
    .then(rowData =>{
      // for(let i=0; i<10;i++){
      console.log(rowData['data'])
      let tabledata =[]
      let keylist = Object.keys(rowData['data'])
      keylist.forEach(element =>{

        let myjson = {'date':rowData['data'][element]['date'],
        'totalRoom': rowData['data'][element]['totalRoom']}
        
        rowData['data'][element]['roomtype'].forEach((i,roomtype)=>{
             console.log(roomtype)
             myjson[roomtype] = rowData['data'][element]['roomcount'][i-1]
        })
        tabledata.push(myjson)
      })
console.log(tabledata)
setRowData(tabledata)
    }
    )
    
  }, []);
 

  // ** State
  const [data, setData] = useState(null);





  return (
    <div>
     <Card>
          <CardHeader>
            <CardTitle tag="h4"><b>Day wise inventory view</b></CardTitle>
          </CardHeader>
        </Card>
    <div className="ag-theme-alpine" style={{ height: 520}}>
        <AgGridReact 
            ref={gridRef}
            rowData={rowData} columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            // paginationAutoPageSize = 'true'
            paginationPageSize= '10'
            pagination = 'true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            
            />
      </div>
    {/* <App/> */}
    </div>
  );
};

export default AvailabilityMatrix;





