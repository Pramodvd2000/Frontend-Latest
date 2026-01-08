import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import API_URL from '../../../config';
import { format } from 'date-fns';
const BlockedDynamicPricingPage = () => {
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);

    useEffect(() => {
        fetchBlockedDynamicPricing();
    }, []);

    const fetchBlockedDynamicPricing = async () => {
        try {
            const confirmRate = JSON.stringify({});
            const res = await fetch(API_URL + "/getBlockedDynamicPricing", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: confirmRate
            });

            const result = await res.json();

            if (result.statusCode === 200) {
                const data = result.data;
                    data.sort((a, b) => a.roomTypeID - b.roomTypeID);

                const uniqueDates = [...new Set(data.map(item => item.inventory_date))];
                const uniqueRoomTypes = [...new Set(data.map(item => item.roomType))];

                // Transform data for vertical orientation
                const transformed = uniqueDates.map(date => {
                    const row = { inventory_date: date };
                    data.forEach(item => {
                        if (item.inventory_date === date) {
                            // row[item.roomType] = item.isOverRightAllowed;
                            row[item.roomType] = {
                                isOverRightAllowed: item.isOverRightAllowed,
                                baseAmount: item.baseAmount
                            };
                        }
                    });
                    return row;
                });

                // Build column definitions
                const columns = [
                    {
                        headerName: 'Inventory Date',
                        field: 'inventory_date',
                        pinned: 'left',
                        sortable: true,
                        cellRenderer: (params) => {
                            if (params.data && params.data.inventory_date) {
                                const formattedDate = format(new Date(params.data.inventory_date), 'dd MMM yy');
                                return formattedDate;
                            } else {
                                return "";
                            }
                        },
                        filter: true,
                        width: 160,
                        sort:'asc',

                        cellStyle: { fontWeight: 'bold' }
                    },
                    ...uniqueRoomTypes.map(roomType => ({
                        headerName: roomType,
                        field: roomType,
                        headerClass: 'header-center',

                        headerComponentParams: {
                            template: `<div style="text-align: center; width: 100%;">${roomType}</div>`
                        },
                        cellRenderer: params => {
                            const value = params.value;
                            if (!value) return '';

                            const { isOverRightAllowed, baseAmount } = value;

                            return isOverRightAllowed === 0
                                ? <span style={{ fontSize: '16px' }}>✅ {baseAmount}</span>
                                : isOverRightAllowed === 1
                                    ? <span style={{ fontSize: '16px', fontWeight: 'bold' }}>🚫 {baseAmount}</span>
                                    : '';
                        },
                        width: 160,
                        cellStyle: { textAlign: 'center', fontSize: '18px' }
                    }))

                ];

                setRowData(transformed);
                setColumnDefs(columns);
            }
        } catch (error) {
            console.error("Error fetching blocked dynamic pricing:", error);
        }
    };

    return (
        <div className="ag-theme-alpine" style={{ height: 540, width: '100%' }}>
            {/* <h3>Blocked Dynamic Pricing Overview</h3> */}
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
            // domLayout='autoHeight'
            />
        </div>
    );
};

export default BlockedDynamicPricingPage;
