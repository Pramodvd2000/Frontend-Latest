import React, { useState, useMemo,useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import API_URL from '../../../config';


// Utility function to parse description
const parseDescription = (Data,type, subType,items, description) => {
  console.log(items)
  if (!description || description.length === 0) return '';

  const desc = description[0];
  
  switch (type) {
    case 'ORDER':
      if (subType === 'CREATE') {
        return `Order Creation: ${desc.Pax} Pax, Status: ${desc.Status}, Order Type: ${desc.OrderType}`;
      }
      break;
    
    case 'KOT':
      switch (subType) {
        case 'GENERATE':
          return `KOT Generation: ${desc.KOTNo}, ${desc.ItemCount} items, Order Type: ${desc.OrderType}`;
        case 'VOID':
          return `KOT Voided: KOT No. ${desc.KOTNo}, Reason: ${desc.Reason || 'Not specified'}`;
      }
      break;
      
    case 'ITEM':
      switch (subType) {
        case 'MODIFY_AFTER_KOT':
          return `Item Modified: KOT ${desc.KOTNo}, ${desc.ModifiedField} changed from ${desc.OldValue} to ${desc.NewValue}`;
        case 'MODIFY_ITEM':
          return `KOT ${desc.KOTNo}, Item ${items['modifiedItem'].itemName} Qty Modified:  from ${desc.OldValue} to ${desc.NewValue}`;
      }
      break;
    
    case 'TRANSFER':
      if (subType === 'TABLE') {
        return `Table Transfer: ${desc.ItemCount} items moved from Table ${desc.OldTableNo} to ${desc.NewTableNo} , Reason :${desc.Reason}`;
      }
      if (subType === 'ITEM') {
        return `Item Transfer: Item moved from Table ${desc.FromTableNo} to ${desc.ToTableNo} , Reason :${desc.Reason}`;
      }

      break;
      case 'SPLIT':
        if (subType === 'ITEM/EQUAL SPLIT') {
          return `${desc.Folio} for the main orderID : ${Data.orderID}`;
        }
        if (subType && /^SPLIT ORDER\s*\d*$/.test(subType.trim())) {

          return `Split Order Folio ${desc.Folio} having  ${desc.ItemsCount} items`;
        }
        if (subType === 'UNDO SPLIT') {
          return `${desc.Folio}`;
        }
  
        break;
        case 'DISCOUNT':
          if (subType && /APPLIED/.test(subType.toUpperCase())) {
            return `${desc.DiscountType} Discount applied, Total Discount : ${desc.DiscountAmount}`;
          }
          if (subType === 'REMOVED DISCOUNT') {
            return `Discount Removed for OrderID : ${Data.orderID} and Folio : ${Data.folioNo}`;
          }
    
          break;
          case 'PAYMENT':
      if (subType === 'PAID') {
        return `${desc.ReceivedAmt} paid by ${desc.PaymentType}, Bill Amount  : ${desc.AmountToBePaid}`;
      }
      if (subType === 'FULL PAYMENT VOID') {
        return `Full Payment Voided, Reason :${desc.reason}`;
      }
      if(subType === 'PART WISE PAYMENT VOID'){
        return `${desc.AmountReceived} paid by ${desc.PaymentType} is voided`;
      }
      break;

      case 'SERVICE CHARGE':
         return `${desc.Action}`;
        
        break;
        case 'BILL':
          if (subType === 'GENERATE') {
            return `Generated bill No : ${desc.billNoDisplay}`;
          }
          if (subType === 'RESETTLE') {
           return `Resettled bill : ${desc.billNoDisplay}`;
          }
          if (subType === 'VOID') {
            return `${Data.orderID} was voided , Reason : ${desc.Reason}`;
          }
    
          break;
  }

  return JSON.stringify(description);
};



// Render items as a formatted string
const formatItems = (items) => {
  if (!items) return '';
  
  if (Array.isArray(items)) {
    return items.map(item => 
      `${item.qty}x ${item.itemName}`
    ).join(', ');
  }
  
  if (items.modifiedItem) {
    return `Modified: ${items.modifiedItem.itemName} (${items.modifiedItem.oldQty} → ${items.modifiedItem.newQty})`;
  }
  
  return JSON.stringify(items);
};

const POSLogsGrid = ({data}) => {

    console.log("data",data)
  // Parse the JSON from the document content

  
  const [rowData, setRowData] = useState(() => {
    try {
      const docContent = document.querySelector('document').textContent;
      const parsedData = JSON.parse(docContent);
      return parsedData.data;
    } catch (error) {
      console.error('Error parsing data:', error);
      return [];
    }
  });

  const [columnDefs] = useState([
    // { 
    //   field: 'id', 
    //   headerName: 'Log ID', 
    //   width: 100 
    // },
    { 
      field: 'type', 
      headerName: 'Action', 
      width: 150,
      cellStyle: (params) => {
        switch(params.value) {
          case 'ORDER': return { backgroundColor: '#e6f2ff' };
          case 'KOT': return { backgroundColor: '#e6ffe6' };
          case 'ITEM': return { backgroundColor: '#fff2e6' };
          case 'TRANSFER': return { backgroundColor: '#f2e6ff' };
          case 'SPLIT': return { backgroundColor: '#F3F2E4' };
          case 'DISCOUNT': return { backgroundColor: '#EFD8E9' };
          case 'PAYMENT': return { backgroundColor: '#DAD5D5' };
          case 'SERVICE CHARGE': return { backgroundColor: '#F7BDBD' };
          case 'BILL': return { backgroundColor: '#BDEEC5' };


          default: return {};
        }
      }
    },
    { 
      field: 'subType', 
      headerName: 'Sub Action', 
      width: 150,
      autoHeight: true,
      wrapText: true 
    },
    { 
      field: 'orderID', 
      headerName: 'Order ID', 
      width: 120 
    },
    {
        field:'folioNo',
        headerName:'FolioNo',
        width:120
    },
    { 
      field: 'tableNo', 
      headerName: 'Table', 
      width: 100 
    },
    { 
      headerName: 'Items', 
      valueGetter: (params) => formatItems(params.data.items),
      width: 300,
      autoHeight: true,
      wrapText: true
    },
    { 
      headerName: 'Description', 
      valueGetter: (params) => parseDescription(
        params.data,
        params.data.type, 
        params.data.subType,
        params.data.items, 
        params.data.description
      ),
      width: 400,
      autoHeight: true,
      wrapText: true
    },
    { 
      field: 'CreatedUser', 
      headerName: 'Created By', 
      width: 200 
    },
    { 
      field: 'createdAt', 
      headerName: 'Created At', 
      width: 200 
    },

  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true
  }), []);
  useEffect(() => {

    fetchx(API_URL+`/getPOSActivityLogs?orderID=${data.orderID}`)
    .then(result => result.json())
    .then(rowData => {setRowData(rowData['data'])

  })
  .catch(error => {
    console.error("Error fetching data:", error);
  // });

    })
  },[]); 
  return (
    <div className="container mx-auto ">
      <div className="ag-theme-alpine" style={{ height: 760, width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={12}
        />
      </div>
    </div>
  );
};

export default POSLogsGrid;