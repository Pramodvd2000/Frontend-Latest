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
import DASHBOARD_URL from '../../../dashboard'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import 'jspdf-autotable';
import Moment from 'moment'
import { useForm, Controller } from 'react-hook-form'
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'
import '../CustomAgGrid.css'; // Import custom CSS file for styling
import image1 from './YTComplaints.jpg'
import image2 from './GuestExp.jpg'
import Guestfeedback from '../guestFeedbackReport/osat'
import ComplaintTracker from '../guestComplaint/guestDashboard'

const MainDashboard = () => {
  const [DashboardRev, setDashboardRev] = useState([]);
  const [ForecastData, setForecastData] = useState([]);
  const [HLPData,setHLPData] =  useState([]);
  const [ArrivalVIPData,setArrivalVIPData] = useState([])
  const [VIPInHouse,setVIPInHouse] = useState([])
  const [GuestBirthday,setGuestBirthday] = useState([])
  const [ReceiveableData,setReceiveableData] = useState([])
  const [LoadingVar,setLoadingVar] = useState(false)
  const [reloadComplaintTracker,setreloadComplaintTracker] = useState(true)
  const [data, setData] = useState([]);


  const [Today, setToday] = useState([]);  
  const { reset, handleSubmit, control ,formState: { errors }
} = useForm({ });

  function formatNumberToIndianFormat(number) {
    if (isNaN(number)) return "Invalid Number";
    if(number==0 || number<999) return number
    // Convert to thousands if number is less than 1 lakh
    if (number < 100000) {
        return (number / 1000).toFixed(2) + 'k';
    }
    // Convert to lakhs if number is less than 1 crore
    if (number < 10000000) {
        return (number / 100000).toFixed(2) + ' L';
    }
    // Convert to crores
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
      let tempDate  = {"FromDate":rowData['data'][0].businessDate}
      setData(tempDate)
  })
  .catch((error) => {
      console.error('Error fetchxing business date:', error);
  });
}, []);

useEffect(() => {
  if(data.length!=0){
      setLoadingVar(true)
      getDashboardRevenue(data);
      getForecast(data);
      getHLPData(data);
      getArrivalVIP(data);
      getInHouseVIPData(data);
      getGuestBirthDay(data);
      getDashboardReceiveableData(data)
  }
}, [Today]);

const getDashboardRevenue = (data) => {

  fetchx(DASHBOARD_URL + `/getDashBoardRevenue?hotelID=1&date=${data.FromDate}`)
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
      setDashboardRev(formattedData);
      setLoadingVar(false)
    }
    
  })
  .catch((error) => {
      console.error('Error fetchxing dashboard revenue:', error);
  });


};




const getForecast =(data) =>{
  // fetchx(DASHBOARD_URL + `/getDashBoardForecast?hotelID=1&date=2024-01-18`)
  fetchx(DASHBOARD_URL + `/getDashBoardForecast?hotelID=1&date=${data.FromDate}`)

  .then((result) => result.json())
  .then((response) => {
      if(response['statusCode']==200){
        const formattedData1 = response.data.map(item => {
          const date = new Date(item.date);
          const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return { ...item, date: formattedDate };
      });
        const formattedData = formattedData1.map(item => {
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
    setForecastData(formattedData);
  }
  })
  .catch((error) => {
      console.error('Error fetchxing Forecast data:', error);
  });

}

const getHLPData = (data) =>{
  // http://122.166.2.21:14718/v8/getTotalEnergyConsumptionDetails?date=2024-04-25/
  fetchx(DASHBOARD_URL + `/getTotalEnergyConsumptionDetails?hotelID=1&date=${data.FromDate}`)
  // fetchx(API_URL + `/getTotalEnergyConsumptionDetails?date=2024-04-25`)



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
    setHLPData(formattedData);
  }
  })
  .catch((error) => {
      console.error('Error fetchxing Forecast data:', error);
  });
}


const getDashboardReceiveableData = (data) => {

  fetchx(DASHBOARD_URL + `/getTop10Receivables?hotelID=1&date=${data.FromDate}`)
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
      setReceiveableData(formattedData);
    }
    // setLoadingVar(false)
  })
  .catch((error) => {
      console.error('Error fetchxing dashboard revenue:', error);
  });


};

const getArrivalVIP = (data) =>{

    // let res = fetchx("http://122.166.2.21:14718/v8/getArrivalVip", {
    // let res = fetchx(DASHBOARD_URL+"/getArrivalVipDashboard", {

    //   method: "POST",
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     "hotelID": 10,    
    //     "startDate": data.FromDate,
    //     "endDate":data.FromDate
    //   })
    // }).then(data => data.json())
    // .then((res) => {
      fetchx(DASHBOARD_URL + `/getArrivalVipDashboard?hotelID=1&date=${data.FromDate}`)
      // fetchx(`http://122.166.2.21:14718/v8/getTotalEnergyConsumptionDetails?date=2024-04-25`)
    
    
    
      .then((result) => result.json())
      .then((res) => {
      setArrivalVIPData(res["data"])
    });      
  
}

const getInHouseVIPData = (data) =>{
  // http://122.166.2.21:14718/v8/getTotalEnergyConsumptionDetails?date=2024-04-25/
  fetchx(DASHBOARD_URL + `/getInHouseVip?hotelID=1&date=${data.FromDate}`)
  // fetchx(`http://122.166.2.21:14718/v8/getTotalEnergyConsumptionDetails?date=2024-04-25`)



  .then((result) => result.json())
  .then((response) => {
      if(response['statusCode']==200){


        setVIPInHouse(response.data);
  }
  })
  .catch((error) => {
      console.error('Error fetchxing Forecast data:', error);
  });
}

const getGuestBirthDay = (data) =>{
  fetchx(DASHBOARD_URL + "/getInHouseGuestBirthday", {
  // fetchx("http://122.166.2.21:14718/v8/getInHouseGuestBirthday", {

    method: "POST",
    headers: { 'Content-Type': 'application/json' },
  })
    .then((data) => data.json())
    .then((res) => {
      setGuestBirthday(res["data"]);
    });
}
const optionsToDate = {

  // maxDate:Moment(new Date(Today)).subtract(1, 'days')
  // maxDate:Today
  maxDate : Today

};

// // Define the base proportions for each column
// const proportions = {
//   description: 25, // Adjust the proportions as needed
//   yesterday: 20,
//   today: 20,
//   mtd: 20,
//   ytd: 15
// };

// // Calculate the maxWidth for each column based on the screen width
// const screenWidth = window.innerWidth;
// const maxProportion = Math.max(...Object.values(proportions));
// const maxWidths = {};

// for (const [key, value] of Object.entries(proportions)) {
//   maxWidths[key] = (value / maxProportion) * screenWidth;
// }

    // { headerName: 'Description', field: 'Description', suppressSizeToFit: true, maxWidth: maxWidths.description, wrapText: true, autoHeight: true },
    // { headerName: 'Yesterday', field: 'YesterdayTotal', suppressSizeToFit: true, maxWidth: maxWidths.yesterday },
    // { headerName: 'Today', field: 'TodayTotal', suppressSizeToFit: true, maxWidth: maxWidths.today, wrapText: true, autoHeight: true },
    // { headerName: 'MTD', field: 'MonthTotal', suppressSizeToFit: true, maxWidth: maxWidths.mtd, wrapText: true, autoHeight: true },
    // { headerName: 'YTD', field: 'MonthTotal', suppressSizeToFit: true, maxWidth: maxWidths.ytd }


    // {headerName: 'Date',       field: 'date',  suppressSizeToFit: true, maxWidth: 120,wrapText: true,autoHeight:true,},
    // {headerName: 'OCC',    field: 'TotalOcc', suppressSizeToFit: true, maxWidth: 90 },
    // {headerName: 'OCC%', field: 'OccPercentage',  suppressSizeToFit: true, maxWidth: 110,wrapText: true,autoHeight:true,},
    // {headerName: 'ADR',     field: 'AvgRate',suppressSizeToFit: true, maxWidth: 125,wrapText: true,autoHeight:true,},
    // {headerName: 'Revenue ',field: 'Revenue' ,suppressSizeToFit: true, maxWidth: 135 },


  const gridRef = useRef();
   const [RevColDef, setRevColDef] = useState([
    // {headerName: 'Description',       field: 'Description',  suppressSizeToFit: true, maxWidth: 170,wrapText: true,autoHeight:true,},
    // {headerName: 'Yesterday',    field: 'YesterdayTotal', suppressSizeToFit: true, maxWidth: 130 },
    // {headerName: 'Today', field: 'TodayTotal',  suppressSizeToFit: true, maxWidth: 128,wrapText: true,autoHeight:true,},
    // {headerName: 'MTD',     field: 'MonthTotal',suppressSizeToFit: true, maxWidth: 150,wrapText: true,autoHeight:true,},
    // {headerName: 'YTD ',field: 'MonthTotal' ,suppressSizeToFit: true, maxWidth: 150 },

    { headerName: '', field: 'Description', suppressSizeToFit: true, flex: 1, wrapText: true, autoHeight: true },
  { headerName: 'Yesterday', field: 'YesterdayTotal', suppressSizeToFit: true, flex: 1 },
  { headerName: 'Today', field: 'TodayTotal', suppressSizeToFit: true, flex: 1, wrapText: true, autoHeight: true },
  { headerName: 'MTD', field: 'MonthTotal', suppressSizeToFit: true, flex: 1, wrapText: true, autoHeight: true },
  { headerName: 'YTD', field: 'YearTotal', suppressSizeToFit: true, flex: 1 }

  
  ]);

  const [ForecastColDef, setForecastColDef] = useState([
    {headerName: 'Date',       field: 'date',  suppressSizeToFit: true,  width:'120px',wrapText: true,autoHeight:true,},
    {headerName: 'OCC',    field: 'TotalOcc', suppressSizeToFit: true,  width:'105px', },
    {headerName: 'OCC%', field: 'OccPercentage',  suppressSizeToFit: true, width:'125px',wrapText: true,autoHeight:true,},
    {headerName: 'ADR',     field: 'AvgRate',suppressSizeToFit: true, flex: 1,wrapText: true,autoHeight:true,},
    {headerName: 'Rev',field: 'Revenue' ,suppressSizeToFit: true,  flex: 1, },

  ]);

  const [HLPColDef, setHLPColDef] = useState([
    {headerName: '',       field: 'energyType',  suppressSizeToFit: true,  flex: 1,wrapText: true,autoHeight:true,},
    {headerName: 'Today',    field: 'dayConsumption', suppressSizeToFit: true,  flex: 1, },
    {headerName: 'MTD ',field: 'monthConsumption' ,suppressSizeToFit: true,  flex: 1, },
    {headerName: 'YTD',     field: 'yearConsumption',suppressSizeToFit: true, flex: 1,wrapText: true,autoHeight:true,},

  ]);



  const [VIPArrivalColDef, setVIPArrivalColDef] = useState([
    {headerName: 'Name (Room No)',       field: 'NameRoomNo',  suppressSizeToFit: true,  width:'400px',wrapText: true,autoHeight:true,},
    // {headerName: 'room Np',    field: 'roomNumber', suppressSizeToFit: true,  flex: 1, },
    // {headerName: 'accountName',     field: 'accountName',suppressSizeToFit: true, flex: 1,wrapText: true,autoHeight:true,},
    {headerName: 'Level ',field: 'vipLevel' ,suppressSizeToFit: true,  flex: 1, },

  ]);

  const [VIPInHouseColDef, setVIPInHouseColDef] = useState([
    {headerName: 'Name (Room No)',       field: 'NameRoomNo',  suppressSizeToFit: true,   width:'400px',wrapText: true,autoHeight:true,},
    // {headerName: 'room No',    field: 'roomNumber', suppressSizeToFit: true,  flex: 1, },
    // {headerName: 'accountName',     field: 'accountName',suppressSizeToFit: true, flex: 1,wrapText: true,autoHeight:true,},
    {headerName: 'Level ',field: 'vipLevel' ,suppressSizeToFit: true,  flex: 1, },

  ]);

  const [GuestBirthdayColDef, setGuestBirthdayColDef] = useState([
    {headerName: 'Name ',       field: 'guestName',  suppressSizeToFit: true,  flex: 1,wrapText: true,autoHeight:true,},
    {headerName: 'room No',    field: 'roomNumber', suppressSizeToFit: true,  flex: 1, },
    

  ]);

  const [ReceiveableColDef, setReceiveableColDefs] = useState([
    {headerName: 'Company',       field: 'contact_name',  suppressSizeToFit: true,  flex: 2,wrapText: true,autoHeight:true,},
  
    {headerName: 'Amount',    field: 'outstanding_receivable_amount', suppressSizeToFit: true,  flex: 1, },

    

  ]);

  // ReceiveableColDef

  const defaultColDef = useMemo( ()=> (
    {
      sortable: true,
      filter: true,
      filterParams: {
          buttons: ['apply', 'reset']
      }
  }
  ));
  const onGridReady = (params) => {
    gridRef.current = params.api;
  };
  const getRowStyle = params => {
    if (params.data && params.data.Highlight === true) {
    // if (params.data && params.data.AllBooksReqExists === 0 ) {

      return { background: '#147331', fontWeight: 'bold', rowHeight:60 };
    }
    if (params.data && params.data.HighlightHeader === true) {
        // if (params.data && params.data.AllBooksReqExists === 0 ) {
    
          return { background: '#DA9800', fontWeight: 'bold' , 'text-decoration': 'underline'};
        }
    return null;
  };








  const ConfirmSubmit = (data) => {
    console.log(data)
    setData(data)
    data.FromDate=(Moment(String(new Date(data.FromDate[0]))).format('YYYY-MM-DD'))

setLoadingVar(true)
setreloadComplaintTracker(false)
getDashboardRevenue(data);
      getForecast(data);
      getHLPData(data);
      getArrivalVIP(data);
      getInHouseVIPData(data);
      getGuestBirthDay(data);
      getDashboardReceiveableData(data)
      setTimeout(() => {
        setreloadComplaintTracker(true)

      }, 100)


  }


  function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', options);

    // Extract day and month
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });

    // Add suffix to day
    const suffix = getDaySuffix(day);

    // Format the date with the suffix
    const formatted = `${day}${suffix} ${month} ${date.getFullYear()}`;
    
    return formatted;
}

function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
        return 'th';
    }
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}
  return (
    <div>
<Form onSubmit={handleSubmit(ConfirmSubmit)}>
  <Row className='justify-content-end'>
  <Col md='6' sm='12' className='justify-content-right' style={{'white-space': 'nowrap'}}>
  {data.length!=0 && <h1><b>Dashboard Of {formatDate(data.FromDate)}</b></h1>}
</Col>
<Col md='2' sm='8'></Col>
    <Col md='3' sm='8'>
      <div className='mb-1'>
        <Label className='form-label' for='FromDate'>
          Date<spam style={{ color: 'red' }}>*</spam>
        </Label>
        <Controller
          control={control}
          id='FromDate'
          name='FromDate'
          required
          render={({ field }) => (
            <Flatpickr
              {...field}
              options={optionsToDate}
              placeholder='YYYY-MM-DD '
              className={classnames('form-control', {
                'is-invalid': data !== null && data.FromDate === null
              })}
            />
          )}
        />
      </div>
    </Col>
    <Col md='auto' sm='8' style ={{marginTop:'20px'}}>
      <div className='d-flex align-items-end justify-content-end'>
        <Button color='primary' className='me-1' type='submit'>
          Submit
        </Button>
      </div>
    </Col>
  </Row>
</Form>


    {/* <h4> In House Guest Report</h4>
          <div align="end" className="buttons">
          <Button className='me-1' color='primary' type='submit'  onClick={onBtnExport}> Download Excel </Button>
          <Button className='me-1' color='primary' type='submit'  onClick={printGrid}>Print PDF </Button>
              </div> */}
                <Row>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
            
              <div style={{ width: '35%', padding: '10px' }}>
              <Card>
        <CardBody>
        {/* <img
  style={{ width: '100%', height: 'auto', maxHeight: '25%' }} // Adjust maxHeight as needed
  // src={image2}
  alt={'test'}
  className="card-img-top"
/> */}
  <Guestfeedback />

        </CardBody>
      </Card>
        <Card>
        <CardBody>
        {/* <img
  style={{ width: '100%', height: 'auto', maxHeight: '25%' }} // Adjust maxHeight as needed
  src={image1}
  alt={'test'}
  className="card-img-top"
/> */}
{console.log(reloadComplaintTracker)}
{data.FromDate!=undefined && reloadComplaintTracker && <ComplaintTracker Date={data.FromDate}/>}

        </CardBody>
      </Card>
        <Card>
            <CardHeader>
                <CardTitle tag="h4"><b>10 Day Forecast</b></CardTitle>
            </CardHeader>
            <CardBody>
                <div id='grid1' style={{ width: '100%', height: '100%' }} className="ag-theme-alpine-dark custom-ag-grid">
                  {ForecastData.length!=0 && 
                  <AgGridReact 
                 ref={gridRef}
                 rowData={ForecastData} 
                 getRowStyle={getRowStyle}
                 columnDefs={ForecastColDef}
                 animateRows={true} 
                 rowSelection='multiple'           
                 defaultColDef={defaultColDef}
                 headerColor="ddw-primary"
                 domLayout='autoHeight'
                 rowHeight={40} // Set the row height
                //  className="ag-theme-custom" // Apply the custom class here
             />
            } 
                </div>
            </CardBody>
        </Card>
    </div>
    
    <div style={{ width: '40%', padding: '10px' }}>
        <Card>
            <CardHeader>
                <CardTitle tag="h4"><b>Revenue Snapshot </b></CardTitle>
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
            rowHeight={30} // Set the row height
        />
    }
</div>
            </CardBody>
        </Card>

        <Card>
          <CardHeader>
              <CardTitle tag="h4"><b>RECEIVABLES TOP 20 COMPANIES</b></CardTitle>
          </CardHeader>
          <CardBody>
          <div id='grid2' style={{ width: '100%', height: 300 }} className="ag-theme-alpine-dark custom-ag-grid">
  {/* {ReceiveableData.length !== 0 &&  */}
      {/* <AgGridReact 
          ref={gridRef}
          onGridReady={onGridReady}
          rowData={ReceiveableData} 
          getRowStyle={getRowStyle}
          columnDefs={ReceiveableColDef}
          animateRows={true} 
          rowSelection='multiple'           
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
          domLayout='autoHeight'
          rowHeight={30} // Set the row height
      /> */}

<AgGridReact
                  ref={gridRef}
                  rowData={ReceiveableData}
                  columnDefs={ReceiveableColDef}
                  animateRows={true}
                  paginationAutoPageSize="true"
                  paginationPageSize="10"
                  pagination="true"
                  headerColor="ddw-primary"
                  rowHeight={30} // Set the row height
                  // gridOptions={gridOptions}
                />
  {/* } */}

  
</div>
          </CardBody>
      </Card>
    </div>

    <div style={{ width: '30%', padding: '10px' }}>
        <Card>
            <CardHeader>
                <CardTitle tag="h4"><b>HLP </b></CardTitle>
            </CardHeader>
            <CardBody>
            <div id='grid2' style={{ width: '100%', height: 250 }}  className="ag-theme-alpine-dark custom-ag-grid">
    {/* {HLPData.length !== 0 &&  */}
        {/* <AgGridReact 
            ref={gridRef}
            onGridReady={onGridReady}
            rowData={HLPData} 
            getRowStyle={getRowStyle}
            columnDefs={HLPColDef}
            animateRows={true} 
            rowSelection='multiple'           
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            domLayout='autoHeight'
            rowHeight={30} // Set the row height
        /> */}
        <AgGridReact
                  ref={gridRef}
                  rowData={HLPData}
                  columnDefs={HLPColDef}
                  animateRows={true}
                  paginationAutoPageSize="true"
                  paginationPageSize="10"
                  pagination="true"
                  headerColor="ddw-primary"
                  rowHeight={30} // Set the row height
                  // gridOptions={gridOptions}
                />
    {/* } */}
    
</div>
            </CardBody>
        </Card>
        <Card>
          <CardHeader>
              <CardTitle tag="h4"><b>VIP Arrivals </b></CardTitle>
          </CardHeader>
          <CardBody>
          <div id='grid2' style={{ width: '100%', height: 300 }} className="ag-theme-alpine-dark custom-ag-grid">
  {/* {ArrivalVIPData.length !== 0 &&  */}
      {/* <AgGridReact 
          ref={gridRef}
          onGridReady={onGridReady}
          rowData={ArrivalVIPData} 
          getRowStyle={getRowStyle}
          columnDefs={VIPArrivalColDef}
          animateRows={true} 
          rowSelection='multiple'           
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
          domLayout='autoHeight'
          paginationAutoPageSize="true"
          paginationPageSize="4"
          rowHeight={30} // Set the row height
      /> */}

<AgGridReact
                  ref={gridRef}
                  rowData={ArrivalVIPData}
                  columnDefs={VIPArrivalColDef}
                  animateRows={true}
                  paginationAutoPageSize="true"
                  paginationPageSize="10"
                  pagination="true"
                  headerColor="ddw-primary"
                  rowHeight={30} // Set the row height
                  // gridOptions={gridOptions}
                />
  {/* } */}
</div>
          </CardBody>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle tag="h4"><b>VIP InHouse </b></CardTitle>
          </CardHeader>
          <CardBody>
          <div id='grid2' style={{ width: '100%', height: 300 }} className="ag-theme-alpine-dark custom-ag-grid">
  {/* {VIPInHouse.length !== 0 &&  */}
      {/* <AgGridReact 
          ref={gridRef}
          onGridReady={onGridReady}
          rowData={VIPInHouse} 
          getRowStyle={getRowStyle}
          columnDefs={VIPInHouseColDef}
          animateRows={true} 
          rowSelection='multiple'           
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
          domLayout='autoHeight'
          rowHeight={30} // Set the row height
      /> */}

<AgGridReact
                  ref={gridRef}
                  rowData={VIPInHouse}
                  columnDefs={VIPInHouseColDef}
                  animateRows={true}
                  paginationAutoPageSize="true"
                  paginationPageSize="10"
                  pagination="true"
                  headerColor="ddw-primary"
                  rowHeight={30} // Set the row height
                  // gridOptions={gridOptions}
                />
  {/* } */}
</div>
          </CardBody>
      </Card>

      {/* GuestBirthdayColDef */}
      <Card>
          <CardHeader>
              <CardTitle tag="h4"><b>Guest Birthday </b></CardTitle>
          </CardHeader>
          <CardBody>
          <div id='grid2' style={{ width: '100%', height: 300 }} className="ag-theme-alpine-dark custom-ag-grid">
  {/* {GuestBirthday.length !== 0 &&  */}
      {/* <AgGridReact 
          ref={gridRef}
          onGridReady={onGridReady}
          rowData={GuestBirthday} 
          getRowStyle={getRowStyle}
          columnDefs={GuestBirthdayColDef}
          animateRows={true} 
          rowSelection='multiple'           
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
          domLayout='autoHeight'
          rowHeight={30} // Set the row height
      /> */}

<AgGridReact
                  ref={gridRef}
                  rowData={GuestBirthday}
                  columnDefs={GuestBirthdayColDef}
                  animateRows={true}
                  paginationAutoPageSize="true"
                  paginationPageSize="10"
                  pagination="true"
                  headerColor="ddw-primary"
                  rowHeight={30} // Set the row height
                  // gridOptions={gridOptions}
                />
  {/* } */}
</div>
          </CardBody>
      </Card>
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