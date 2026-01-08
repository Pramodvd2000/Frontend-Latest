
// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import API_URL from '../../../config'

function App(data1) {
  // console.log(data1)
  // console.log(data1.data1.data1)

  // const [extradetails,setExtraDetails] = useState('')

  useEffect(() => {
    fetchx(API_URL + `/getRateSummary?hotelID=1&sharingID=${data1.data1.data1.sharingID}`)
    .then(result => result.json())
    .then(rowData => setRowData(rowData['data']))
  }, []);




  const [rowData, setRowData] = useState();

  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
    {headerName: "Date ",field: "date",suppressSizeToFit: true,maxWidth: 130,},
    {headerName: "Rate Code ",field: "rateCode",suppressSizeToFit: true,maxWidth: 120,},
    { headerName: "Room Rate", field: "roomRevenue"    ,maxWidth: 120 },
    { headerName: 'Package Rate', field: 'packageRevenue'  ,maxWidth: 130 },
    { headerName: 'Room Tax', field: 'roomTax',maxWidth: 120 },
    { headerName: "Package Tax ", field: "packageTax"  ,maxWidth: 140 },
    { headerName: "SubTotal", field: "subTotal"     ,maxWidth: 125 },
    { headerName: 'Total Tax', field:'totalTaxGenerated'  ,maxWidth: 125 },
    { headerName: 'TotalCostOfStay', field: 'total' ,maxWidth: 140 }
        
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
    // console.log('cellClicked', event);
  }, []);

  const buttonListener = useCallback( e => {
    gridRef.current.api.deselectAll();
  }, []);

  return (
    <div>
      {/* <button onClick={buttonListener}>Push Me</button> */}
      <div className="ag-theme-alpine" style={{ height: 400}}>
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
    </div>
  );
}

export default App;