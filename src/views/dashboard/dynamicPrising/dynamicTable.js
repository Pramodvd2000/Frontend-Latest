import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const MyAgGrid = ({ data }) => {
    console.log(data)
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const rowData = {};

  // Group data by room class and concatenate base amounts
  data.forEach(({ roomClass, baseAmount, occupancyFrom, occupancyTo }) => {
    if (!rowData[roomClass]) {
      rowData[roomClass] = {
        roomClass,
        baseAmounts: [],
        occupancyRanges: [],
      };
    }

    rowData[roomClass].baseAmounts.push(baseAmount);
    rowData[roomClass].occupancyRanges.push(`${occupancyFrom}-${occupancyTo}`);
  });

  // Convert aggregated data into rows
  const rowDataArray = Object.values(rowData).map(({ roomClass, baseAmounts, occupancyRanges }) => ({
    roomClass,
    baseAmounts: baseAmounts.join(' '),
    occupancyRanges: occupancyRanges.join(' '),
  }));

  const columnDefs = [
    { headerName: 'Room Class', field: 'roomClass', minWidth: 150 },
    { headerName: 'Occupancy Range', field: 'occupancyRanges', minWidth: 150 },
    { headerName: 'Base Amounts', field: 'baseAmounts', minWidth: 150 },
  ];

  const defaultColDef = {
    editable: false,
    sortable: true,
    flex: 1,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  useEffect(() => {
    if (gridApi) {
      gridApi.sizeColumnsToFit();
    }
  }, [gridApi]);

  return (
    <div className="ag-theme-alpine" style={{ height: 520 }}>
      <AgGridReact
        rowData={rowDataArray}
        columnDefs={columnDefs}
        animateRows={true}
        rowSelection="multiple"
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        onGridReady={onGridReady}
      />
    </div>
  );
};

export default MyAgGrid;
