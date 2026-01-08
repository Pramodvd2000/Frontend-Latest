
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
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
// import './Assettable.css';
import 'ag-grid-enterprise'

import { useRef, useEffect, useMemo, useCallback} from 'react';
import API_URL from "../../../config";
import { Card, CardHeader, CardTitle, CardBody, Button } from 'reactstrap';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import logo from '@src/assets/images/logo/oterra.jpg';

const AvailabilityMatrix = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalGST, setTotalGST] = useState(0);
  const [roomCount, setRoomCount] = useState(0);

  const gridRef = useRef();

  const columnDefs = [
    { headerName: 'Room No.', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 130 },
    { headerName: 'Booking ID', field: 'bookingID', maxWidth: 200 },
    { headerName: 'Guest', field: 'guestName', maxWidth: 200 },
    { headerName: 'Room Type', field: 'roomType', maxWidth: 130 },
    { headerName: 'Description', field: 'description', maxWidth: 148 },
    { 
      headerName: 'Amount', 
      field: 'subTotal', 
      maxWidth: 158,
      aggFunc: 'sum',
      valueFormatter: params => {
        return typeof params.value === 'number' ? `${params.value.toFixed(2)}` : params.value;
      }
    },
    { 
      headerName: 'Total(Incl. GST)', 
      field: 'total', 
      maxWidth: 158,
      aggFunc: 'sum',
      valueFormatter: params => {
        return typeof params.value === 'number' ? `${params.value.toFixed(2)}` : params.value;
      }
    },
    { headerName: 'Comments', field: 'comments', width: 500 }
  ];

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    autoHeight: true,
    wrapText: true,
    filterParams: {
      buttons: ['apply', 'reset']
    }
  }), []);

  useEffect(() => {
    let unAssign = JSON.stringify({
      hotelID: 1
    });
    
    fetch(API_URL + "/getRoomPostings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: unAssign,
    })
      .then(result => result.json())
      .then(data => {
        setRowData(data['data']);
        // Calculate totals
        const totals = data['data'].reduce((acc, curr) => {
          acc.amount += Number(curr.subTotal) || 0;
          acc.gst += Number(curr.total) || 0;
          return acc;
        }, { amount: 0, gst: 0 });
        
        setTotalAmount(totals.amount);
        setTotalGST(totals.gst);
        setRoomCount(data['data'].length);
      });
  }, []);

  const downloadPDF = async () => {
    const columns = columnDefs.map((column) => column.headerName);
    const rows = rowData.map((row) => columnDefs.map((column) => row[column.field]));
  
    const doc = new jsPDF({ orientation: 'landscape' });
  
    try {
      // Add image with increased space
      doc.addImage(logo, 'JPEG', 143, 10, 15, 15);
  
      doc.setFont('Times-Roman');
      doc.setFontSize(12);
  
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString(); // Adjust the formatting as needed
      doc.text(`Date: ${formattedDate}`, 15, 40, { width: 500, align: 'left' });
  
      // Add text with increased space
      doc.setFont('times', 'bold');
      doc.text('THE OTERRA BENGALURU', 150, 30, { width: 500, align: 'center' });
      doc.setFont('times', 'normal');
  
      // Add additional space before 'Room Postings'
      doc.setFont('times', 'bold');
      doc.text('Room Postings', 150, 40, { width: 500, align: 'center' });

  
      // Adjusted startY and margin to center the table
      const startY = 50; // Adjust as needed
      const margin = { top: 10, right: 20, bottom: 10, left: 20 }; // Adjust as needed
  
      doc.autoTable({
        head: [columns],
        body: rows,
        startY,
        margin,
      });
  
      // Footer: Add totals at the bottom of the last page
      const finalY = doc.lastAutoTable.finalY + 10; // Get Y position after the table ends
  
      doc.setFont('times', 'bold');
      doc.text(`Total Room Count: ${roomCount}`, 50, finalY, { align: 'center' });
      doc.text(`Total Amount: ${totalAmount.toFixed(2)}`, 125, finalY , { align: 'center' });
      doc.text(`Total (Incl. GST): ${totalGST.toFixed(2)}`, 200, finalY , { align: 'center' });
  
      // Generate and save the PDF
      const pdfBlob = doc.output('blob');
      saveAs(pdfBlob, 'Room Postings.pdf');
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };
  
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4"><b>Room Postings</b></CardTitle>
          <Button className='me-1' color='primary' type='submit' onClick={downloadPDF}>
            Print PDF
          </Button>
        </CardHeader>
      </Card>
      <div className="ag-theme-alpine" style={{ width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection="multiple"
          defaultColDef={defaultColDef}
          domLayout='autoHeight'
          headerColor="ddw-primary"
          pinnedBottomRowData={[{
            roomNumber: 'Totals',
            guestName: `Room Count: ${roomCount}`,
            subTotal: totalAmount,
            total: totalGST
          }]}
        />
      </div>
    </div>
  );
};

export default AvailabilityMatrix;
