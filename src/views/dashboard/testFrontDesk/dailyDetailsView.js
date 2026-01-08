import { AgGridReact } from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import React, { useState, useRef, useEffect, useMemo } from 'react'

import API_URL from '../../../config';


function DailyDetailsView(sharingID) {

    const [rowData, setRowData] = useState(false)
    const gridRef = useRef();


    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ));


    //daily details ag-grid
    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Date', field: 'date', suppressSizeToFit: true, maxWidth: 110 },
        { headerName: 'RoomType', field: 'roomType', suppressSizeToFit: true, maxWidth: 120 },
        {
            headerName: 'TotalBeforeDiscount', field: 'totalBeforeDiscount', suppressSizeToFit: true, maxWidth: 190, valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'Discount/Upsell', field: 'totalDiscountAmount', suppressSizeToFit: true, maxWidth: 180, valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'TotalAfterDiscount', field: 'totalRate', suppressSizeToFit: true, maxWidth: 180, valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        {
            headerName: 'PackageRate', field: 'packageRate', suppressSizeToFit: true, maxWidth: 140, valueFormatter: (params) => {
                return params.value.toFixed(2);
            }
        },
        { headerName: 'Package', field: 'packageCode', suppressSizeToFit: true, maxWidth: 120, filter: 'agSetColumnFilter' },
    ])

    useEffect(() => {
        const jsonbody = JSON.stringify({
            sharingID: sharingID.data
        })
        fetchx(API_URL + "/getDailyDetailsBySharingID", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: jsonbody
        }).then((res) => res.json())
            .then(postres => {
                setRowData(postres['data'])
            })
    }, []);


    return (
        <div>
            {
                rowData !== false &&
                <div>
                    <h3>Daily Details</h3>
                    <br></br>
                    <div className="ag-theme-alpine" style={{ height: 400 }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            animateRows={true}
                            rowSelection='multiple'
                            paginationPageSize='10'
                            defaultColDef={defaultColDef}
                            pagination="true"
                            headerColor="ddw-primary"
                        />
                    </div>
                    <br />
                    <br></br>
                    <br></br>
                </div>

            }
        </div>
    )
}


export default DailyDetailsView;
