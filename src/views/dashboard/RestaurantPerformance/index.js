// ** React Imports
import { useState } from 'react'
import 'cleave.js/dist/addons/cleave-phone.us'
import {Row,Card,CardHeader,CardTitle,CardBody,Button,Modal,ModalBody,
  ModalHeader,Col,Label,Input,Form,InputGroup} from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
// import '/node_modules/ag-grid-community/styles/ag-theme-material.min.css'
import { useRef, useEffect, useMemo, } from 'react';
import { useForm, Controller } from 'react-hook-form'
import DASHBOARD_URL from '../../../dashboard';
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import Moment from 'moment'
import 'jspdf-autotable';
import SessionwiseRevenue from "./sessionwiseRevenueData.js"
import './CustomAgGrid.css'; // Import custom CSS file for styling
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'

const MainDashboard = () => {
  const [DashboardRev, setDashboardRev] = useState([]);
  const [DashboardRevPOS, setDashboardRevPOS] = useState([]);
  const [DashboardRevMOD, setDashboardRevMOD] = useState([]);
  const [DashboardRevTotal, setDashboardRevTotal] = useState([]);
  const [ForecastData, setForecastData] = useState([]);
  const [Today, setToday] = useState([]);  
  const [modificationLogs, setModificationLogs] = useState(false)
  const [storeName, setstoreName] = useState([]);
  const [data, setData] = useState(null);
  const optionsToDate = {
    maxDate : new Date().setDate(new Date(Today).getDate() - 1)
  };
  const [selectedDate, setSelectedDate] = useState(null);
  const [businessDate, setBusinessDate] = useState([]);  
  // const [selectedDate, setSelectedDate] = useState('2024-02-08');
  // const [businessDate, setBusinessDate] = useState('2024-02-08');  
  const [LoadingVar,setLoadingVar] = useState(false)





  function formatNumberToIndianFormat(number) {
    if (isNaN(number)) return "Invalid Number";
    if(number==0 || number<999) return number
    if (number < 100000) {
        return (number / 1000).toFixed(2) + 'k';
    }
    if (number < 10000000) {
        return (number / 100000).toFixed(2) + ' L';
    }
    return (number / 10000000).toFixed(2) + ' Cr';
}

useEffect(() => {
  const hotelID = JSON.stringify({
      hotelID: 1
  });

  fetchx(DASHBOARD_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelID
  })
  .then((res) => res.json())
  .then((rowData) => {
      setToday(rowData['data'][0].businessDate);
      setBusinessDate(rowData['data'][0].businessDate)
      setSelectedDate(rowData['data'][0].businessDate);
  })
  .catch((error) => {
      console.error('Error fetching business date:', error);
  });
}, []);
const ConfirmSubmit = (data) => {
  // console.log(data);
  if (data) {
    setData(data);
    const formattedDate = Moment(String(new Date(data.Date[0]))).format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
    setToday(formattedDate);
    setLoadingVar(true)

  }
};

useEffect(() => {
  if(Today.length!=0){
    setLoadingVar(true)
    getRestaurantPerformanceStore();
      getDashboardRevenue();
      getDashboardRevenuePOS();
      getDashboardRevenueMOD();
      getDashboardRevenueTotal();
  }
}, [Today]);


const getDashboardRevenue = () => {  
  fetchx(DASHBOARD_URL + `/getPMSRev?hotelID=1&date=${Today}`)
  // fetchx(DASHBOARD_URL + `/getDashBoardevenue?hotelID=1&date=2024-01-18`)

  .then((result) => result.json())
  .then((response) => {
    if(response['statusCode']==200){
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
    }
    setLoadingVar(false)

  })
  .catch((error) => {
      console.error('Error fetching dashboard revenue:', error);
  });

};

const getDashboardRevenuePOS = () => {
  
  fetchx(DASHBOARD_URL + `/getPOSRev?hotelID=1&date=${Today}`)

  .then((result) => result.json())
  .then((response) => {
    if(response['statusCode']==200){
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
      // console.log(formattedData)
      setDashboardRevPOS(formattedData);
    }
    setLoadingVar(false)

  })
  .catch((error) => {
      console.error('Error fetching dashboard revenue:', error);
  });

};

const getDashboardRevenueMOD = () => {
  fetchx(DASHBOARD_URL + `/getMODRev?hotelID=1&date=${Today}`)
  .then((result) => result.json())
  .then((response) => {
    if(response['statusCode']==200){
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
      setDashboardRevMOD(formattedData);
    }
    setLoadingVar(false)

  })
  .catch((error) => {
      console.error('Error fetching dashboard revenue:', error);
  });

};

const getDashboardRevenueTotal = () => {
  fetchx(DASHBOARD_URL + `/getPOSandPMSRevFinal?hotelID=1&date=${Today}`)
  // fetchx(DASHBOARD_URL + `/getDashBoardRevenue?hotelID=1&date=2024-01-18`)
  .then((result) => result.json())
  .then((response) => {
    if(response['statusCode']==200){
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
      setDashboardRevTotal(formattedData);
    }
    setLoadingVar(false)

  })
  .catch((error) => {
      console.error('Error fetching dashboard revenue:', error);
  });

};

const getRestaurantPerformanceStore = () => {
  fetchx(DASHBOARD_URL + `/getRestaurantPerformance?hotelID=1&date=${Today}`)
    .then((result) => result.json())
    .then((response) => {
      if (response.statusCode === 200) {
        // alert("Hi------");
        console.log("Inserted new Data Datewise")
      }
      else {
        console.log("No Data")
          // alert("Hello----")
      }
      setLoadingVar(false)

    })
    .catch((error) => {
      console.error('Error fetching dashboard revenue:', error);
    });
};

   
  const gridRef = useRef();

   const [RevColDef, setRevColDef] = useState([
    { headerName: 'Description', field: 'Description', suppressSizeToFit: true, flex: 1, wrapText: true, autoHeight: true },
    { headerName: 'Yesterday', field: 'YesterdayTotal', suppressSizeToFit: true, flex: 1 },
  // { headerName: 'Today', field: 'TodayTotal', suppressSizeToFit: true, flex: 1, wrapText: true, autoHeight: true },
    { headerName: 'MTD', field: 'MonthTotal', suppressSizeToFit: true, flex: 1, wrapText: true, autoHeight: true },
    { headerName: 'YTD', field: 'YearTotal', suppressSizeToFit: true, flex: 1 }
  ]);
  const [RevPOSColDef, setRevPOSColDef] = useState([
    { field: 'Description', suppressSizeToFit: true, flex: 1,  
    cellRendererFramework: (params) => {
      const fAndBDescriptions = ['Alloro', '24@43','IN ROOM DINING', 'Terminus', 'Minibar', 'East', 'Banquet', 'AHARA','Laundry','SPA'];
      if (params.data && fAndBDescriptions.includes(params.data.Description)) {
        return (
          <div 
            className="year-total-cell" 
            style={{ cursor: 'pointer', maxWidth: 180 }}
            onClick={() => handleViewDetails(params)}
          >
            {params.value}
          </div>
        );
      } else {
        return params.value; 
      }
    },
  },
    { field: 'YesterdayTotal', suppressSizeToFit: true, flex: 1 , 
     cellRendererFramework: (params) => {
      const fAndBDescriptions = ['Alloro', '24@43','IN ROOM DINING', 'Terminus', 'Minibar', 'East', 'Banquet', 'AHARA','Laundry','SPA'];
      if (params.data && fAndBDescriptions.includes(params.data.Description)) {
        return (
          <div 
            className="year-total-cell" 
            style={{ cursor: 'pointer', maxWidth: 180 }}
            onClick={() => handleViewDetails(params)}
          >
            {params.value}
          </div>
        );
      } else {
        return params.value; 
      }
    },},
    { field: 'MonthTotal', suppressSizeToFit: true, flex: 1,  
    cellRendererFramework: (params) => {
      const fAndBDescriptions = ['Alloro', '24@43','IN ROOM DINING', 'Terminus', 'Minibar', 'East', 'Banquet', 'AHARA','Laundry','SPA'];
      if (params.data && fAndBDescriptions.includes(params.data.Description)) {
        return (
          <div 
            className="year-total-cell" 
            style={{ cursor: 'pointer', maxWidth: 180 }}
            onClick={() => handleViewDetails(params)}
          >
            {params.value}
          </div>
        );
      } else {
        return params.value; 
      }
    },
   },
    { 
      field: 'YearTotal', 
      suppressSizeToFit: true, 
      flex: 1, 
      cellRendererFramework: (params) => {
        const fAndBDescriptions = ['Alloro', '24@43','IN ROOM DINING', 'Terminus', 'Minibar', 'East', 'Banquet', 'AHARA','Laundry','SPA'];
        if (params.data && fAndBDescriptions.includes(params.data.Description)) {
          return (
            <div 
              className="year-total-cell" 
              style={{ cursor: 'pointer', maxWidth: 180 }}
              onClick={() => handleViewDetails(params)}
            >
              {params.value}
            </div>
          );
        } else {
          return params.value; 
        }
      },
    }
  ]);
  const [RevMODColDef, setRevMODColDef] = useState([
    { headerName: '', field: 'Description', suppressSizeToFit: true, flex: 1, wrapText: true, autoHeight: true },
    { headerName: '', field: 'YesterdayTotal', suppressSizeToFit: true, flex: 1 },
    // { headerName: 'Today', field: 'TodayTotal', suppressSizeToFit: true, flex: 1, wrapText: true, autoHeight: true },
    { headerName: '', field: 'MonthTotal', suppressSizeToFit: true, flex: 1, wrapText: true, autoHeight: true },
    { headerName: '', field: 'YearTotal', suppressSizeToFit: true, flex: 1 }
  ]);
  const [RevTotalColDef, setRevTotalColDef] = useState([
    { headerName: '', field: 'Description', suppressSizeToFit: true, flex: 1, wrapText: true, autoHeight: true },
    { headerName: '', field: 'YesterdayTotal', suppressSizeToFit: true, flex: 1 },
    // { headerName: 'Today', field: 'TodayTotal', suppressSizeToFit: true, flex: 1, wrapText: true, autoHeight: true },
    { headerName: '', field: 'MonthTotal', suppressSizeToFit: true, flex: 1, wrapText: true, autoHeight: true },
    { headerName: '', field: 'YearTotal', suppressSizeToFit: true, flex: 1 }
  ]);


  const defaultColDef = useMemo( ()=> (
    {
      sortable: true,
      filter: true,
      filterParams: {
          buttons: ['apply', 'reset']
      }
  }
  ));
  let defaultValues = {  }
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })


  const onGridReady = (params) => {
    gridRef.current = params.api;
  };
  const getRowStyle = params => {
    if (params.data && params.data.Highlight === true) {
      return { background: '#147331', fontWeight: 'bold', rowHeight:60 };
    }
    if (params.data && params.data.HighlightHeader === true) {    
          return { background: '#DA9800', fontWeight: 'bold' , 'text-decoration': 'underline'};
        }
    return null;
  };

  const handleViewDetails =(params)=> {
    setstoreName(params.data['Description'])
    setModificationLogs(true)
  }
 


  return (
    <div>  
    <Modal isOpen={modificationLogs} toggle={() => setModificationLogs(!modificationLogs)} style={{ maxWidth: '1600px' }}>
  <ModalHeader toggle={() => setModificationLogs(!modificationLogs)}></ModalHeader>
  <ModalBody className="pb-3 px-sm-1 mx-20">
    <div>
      {/* {console.log("storeName",storeName)} */}
      {/* {storeName && <SessionwiseRevenue data1={storeName} />} */}
      {storeName && selectedDate && <SessionwiseRevenue data1={storeName} date={selectedDate} />}

    </div>
  </ModalBody>
</Modal> 
 <Card>
                {/* <CardHeader>
                    <CardTitle tag='h4'>Collection Summary Report</CardTitle>
                </CardHeader> */}
<CardBody>
<Form onSubmit={handleSubmit(ConfirmSubmit)}>
  <Row>
    <Col md='4' sm='12'>
      <div className='mb-1'>
      <Label className='form-label' for='Date' style={{ fontSize: '16px' }}>
          Date<spam style={{ color: 'red' }}>*</spam>
        </Label>
        <Controller
          control={control}
          id='Date'
          name='Date'
          required
          render={({ field }) => (
            <Flatpickr
              {...field}
              options={{ maxDate: businessDate }} // Prevent selecting future dates
              value={selectedDate} // Set the selected date as the value
              className='form-control'
              placeholder='Select date'
            />
          )}
        />
      </div>
    </Col>
   
    <div align="end" className="buttons">
                <Button className='me-1' color='primary' type='submit'>
                    Submit
                </Button>
                
                </div>
  </Row>
</Form>  
</CardBody>
</Card>



    <Row>             
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '10px' }}>

        <div style={{ width: '100%' }}>
          <div id='grid1' style={{ width: '100%', height: '100%' }} className="ag-theme-alpine-dark custom-ag-grid">
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
                rowHeight={30} // Set the row height
              />
            }
          </div>
        </div>   
      </div>
    </Row>
    <Row>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '10px' }}>
        <div style={{ width: '100%' }}>
          <div id='grid3' style={{ width: '100%', height: '100%' }} className="ag-theme-alpine-dark custom-ag-grid">
            {DashboardRevPOS.length !== 0 && 
              <AgGridReact 
                ref={gridRef}
                onGridReady={onGridReady}
                rowData={DashboardRevPOS} 
                getRowStyle={getRowStyle}
                columnDefs={RevPOSColDef}
                animateRows={true} 
                rowSelection='multiple'           
                defaultColDef={defaultColDef}
                domLayout='autoHeight'
                rowHeight={30} // Set the row height
                headerHeight={0}
              />
            }
          </div>
        </div>
      </div>
    </Row>
    <Row>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '10px' }}>
        <div style={{ width: '100%' }}>
          <div id='grid2' style={{ width: '100%', height: '100%' }} className="ag-theme-alpine-dark custom-ag-grid">
            {DashboardRevMOD.length !== 0 && 
              <AgGridReact 
                ref={gridRef}
                onGridReady={onGridReady}
                rowData={DashboardRevMOD} 
                getRowStyle={getRowStyle}
                columnDefs={RevPOSColDef}
                animateRows={true} 
                rowSelection='multiple'           
                defaultColDef={defaultColDef}
                domLayout='autoHeight'
                rowHeight={30} // Set the row height
                headerHeight={0}
              />
            }
          </div>
        </div>
      </div>
    </Row>
    <Row>
  <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '10px' }}>
    <div id='grid4' style={{ width: '100%', height: '23px' }} className="ag-theme-alpine-dark custom-ag-grid">
      {DashboardRevTotal.length !== 0 && (
        <AgGridReact
          ref={gridRef}
          onGridReady={onGridReady}
          rowData={DashboardRevTotal}
          getRowStyle={getRowStyle}
          columnDefs={RevTotalColDef}
          animateRows={true}
          rowSelection="multiple"
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
          domLayout="autoHeight"
          rowHeight={30} // Set the row height
          headerHeight={0}
        />
      )}
    </div>
  </div>
</Row>

<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={LoadingVar}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                    Please wait... We're processing your request,
                    </h1>
                    {(
                      <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                       which may take a little longer due to additional data. Please be patient!
                      </h1>
                    )}
                    <CircularProgress color="inherit" />
                  </div>
                </Backdrop>
  
  </div>

  )
}

export default MainDashboard