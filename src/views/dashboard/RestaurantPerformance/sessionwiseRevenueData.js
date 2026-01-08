import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import "cleave.js/dist/addons/cleave-phone.us";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import { AgGridReact } from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import DASHBOARD_URL from "../../../dashboard";
import { Row, Card, CardHeader, CardTitle, CardBody, Button, Modal, ModalBody,
  ModalHeader, Col, Label, Input, Form, InputGroup } from 'reactstrap';
import './CustomAgGrid.css'; // Import custom CSS file for styling
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const SessionwiseRevenue = ({ data1, date }) => {

  // Ag Grid
  const [rowData, setRowData] = useState();
  const [DashboardRev, setDashboardRev] = useState([]);``
  const [LoadingVar, setLoadingVar] = useState(false);

  const gridRef = useRef();

  const CustomYearRevenue = () => (
    <div>Year Revenue</div>
  );

  const CustomMonthRevenue = () => (
    <div>Month Revenue</div>
  );

  const CustomDayRevenue = () => (
    <div>Yesturday Revenue</div>
  );

  function formatNumberToIndianFormat(number) {
    if (isNaN(number)) return "Invalid Number";
    if (number == 0 || number < 999) return number;
    if (number < 100000) return (number / 1000).toFixed(2) + 'k';
    if (number < 10000000) return (number / 100000).toFixed(2) + ' L';
    return (number / 10000000).toFixed(2) + ' Cr';
  }

  const sumAggregation = (values) => {
    let sum = 0;
    if (values && values.values.length > 0) {
      values.values.forEach((value, index) => {
        if (index !== 5 && index !== 6 && index !== 7 && index !== 8 && index !== 9 && index !== 10 && index !== 11 && index !== 12 && index !== 13) {
          let numericValue = 0;
          if (typeof value === 'string') {
            if (value.includes('k')) numericValue = parseFloat(value.replace(/[^\d.]/g, '')) * 1000;
            else if (value.includes('L')) numericValue = parseFloat(value.replace(/[^\d.]/g, '')) * 100000;
            else if (value.includes('Cr')) numericValue = parseFloat(value.replace(/[^\d.]/g, '')) * 10000000;
            else numericValue = parseFloat(value.replace(/[^\d.]/g, ''));
          } else if (typeof value === 'number') numericValue = value;
          sum += numericValue;
        }
      });
    }
    return formatNumberToIndianFormat(sum);
  };

  const [RevColDef, setRevColDef] = useState([
    { headerName: 'Session Name', cellRenderer: 'agGroupCellRenderer', showRowGroup: true, width: 400, 
      cellRendererParams: {
        innerRenderer: (params) => (
          <div style={{ fontSize: '24px', width: 'auto' }}>
            {params.value}
          </div>
        ),
        suppressCount: true
      }
    },
    { headerName: "Session Name", field: "sessionName", rowGroup: true, wrapText: true, autoHeight: true, hide: true },
    { headerName: "Category", field: "category", suppressSizeToFit: true, flex: 1, wrapText: true, autoHeight: true, cellStyle: { whiteSpace: 'normal' } },
    { headerName: 'Day Revenue', field: 'date_revenue', suppressSizeToFit: true, flex: 1, wrapText: true, autoHeight: true, aggFunc: sumAggregation, headerComponentFramework: CustomDayRevenue },
    { headerName: 'Month Revenue', field: 'month_revenue', suppressSizeToFit: true, flex: 1, wrapText: true, autoHeight: true, aggFunc: sumAggregation, headerComponentFramework: CustomMonthRevenue },
    { headerName: 'Year Revenue', field: 'year_revenue', suppressSizeToFit: true, flex: 1, aggFunc: sumAggregation, headerComponentFramework: CustomYearRevenue }
  ]);

  const defaultColDef = useMemo(() => ({}), []);

  const onGridReady = (params) => {
    gridRef.current = params.api;
  };

  const getRowStyle = params => {
    if (params.data && params.data.Highlight === true) {
      return { background: '#147331', fontWeight: 'bold', rowHeight: 60 };
    }
    if (params.data && params.data.HighlightHeader === true) {
      return { background: '#DA9800', fontWeight: 'bold', 'text-decoration': 'underline' };
    }
    return null;
  };

  const cellClickedListener = useCallback((event) => {
    //console.log("cellClicked", event);
  }, []);

  useEffect(() => {
    if (data1) {
      setLoadingVar(true);

      let fetchUrl;
      if (data1 === 'Laundry') {
        fetchUrl = `/getDashBoardRevenueForSessionLaundry?hotelID='1'&date=${date}&storeIdData=${data1}`;
      } else if (data1 === 'SPA') {
        fetchUrl = `/getDashBoardRevenueForSessionSpa?hotelID='1'&date=${date}&storeIdData=${data1}`;
      } else if (['Alloro', '24@43', 'IN ROOM DINING', 'Terminus', 'Minibar', 'East', 'Banquet', 'AHARA'].includes(data1)) {
        fetchUrl = `/getDashBoardRevenueForSession?hotelID='1'&date=${date}&storeIdData=${data1}`;
      }

      fetch(DASHBOARD_URL + fetchUrl)
        .then((result) => result.json())
        .then((response) => {
          const formattedData = response.data.map(item => {
            const formattedItem = {};
            for (const key in item) {
              if (typeof item[key] === 'number') {
                formattedItem[key] = formatNumberToIndianFormat(item[key]);
              } else {
                formattedItem[key] = item[key];
              }
            }
            return formattedItem;
          });
          setDashboardRev(formattedData);
          setLoadingVar(false); // Set LoadingVar to false after processing the data
        })
        .catch((error) => {
          console.error(`Error fetching ${data1} data:`, error);
          setLoadingVar(false); // Ensure setLoadingVar is called in case of error too
        });
    }
  }, [data1, date]);

  const groupDisplayType = 'custom';

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4"><b>Session Revenue</b></CardTitle>
        </CardHeader>
        <CardBody>
          <div id='grid2' style={{ width: '100%', height: '100%' }} className="ag-theme-alpine-dark custom-ag-grid">
            {DashboardRev.length !== 0 && 
              <AgGridReact 
                ref={gridRef}
                onGridReady={onGridReady}
                rowData={DashboardRev}
                getRowStyle={getRowStyle}
                columnDefs={RevColDef}
                animateRows={true}
                rowSelection='multiple'
                defaultColDef={defaultColDef}
                headerColor="ddw-primary"
                domLayout='autoHeight'
                rowHeight={30}
                groupDisplayType={groupDisplayType}
              />
            }
          </div>
        </CardBody>
      </Card>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={LoadingVar}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ fontWeight: 'bold', color: 'white' }}>
            Please wait... We're processing your request,
          </h1>
          <h1 style={{ fontWeight: 'bold', color: 'white' }}>
            which may take a little longer due to additional data. Please be patient!
          </h1>
          <CircularProgress color="inherit" />
        </div>
      </Backdrop>
    </div>
  );
};

export default SessionwiseRevenue;