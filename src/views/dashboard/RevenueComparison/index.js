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
import {  useCallback } from 'react';
import '../CustomAgGrid.css'; // Import custom CSS file for styling
import './custom.css'
const MainDashboard = () => {

  const [LoadingVar,setLoadingVar] = useState(false)
  const [data, setData] = useState([]);
  const [MarketFlatData,setMarketFlatData] = useState([])
  const [RevenueCompData,setRevenueCompData] = useState([])
  const [Today, setToday] = useState([]);  



  const { reset, handleSubmit, control ,formState: { errors }
} = useForm({ });

//   function formatNumberToIndianFormat(number) {
//     if(number>=0){
//     if (isNaN(number)) return "Invalid Number";
//     if(number==0 || (number<999)) return number
//     // Convert to thousands if number is less than 1 lakh
//     if (number < 100000 ) {
//         return (number / 1000).toFixed(2) + 'k';
//     }
//     // Convert to lakhs if number is less than 1 crore
//     if (number < 10000000) {
//         return (number / 100000).toFixed(2) + ' L';
//     }
//   //   if (number>-1000000) {
//   //     return (number / 10000).toFixed(2) + ' L';
//   // }
//   //   if (number>-100000) {
//   //     return (number / 1000).toFixed(2) + 'k';
//   // }
//     // Convert to crores
//     return (number / 10000000).toFixed(2) + ' Cr';
//   }else{
//     if (isNaN(number)) return "Invalid Number";
//     if (number < -1000000000) {
//       return (number / 10000000).toFixed(2) + ' Cr';
//   }
//    // Convert to lakhs if number is less than 1 crore
//    if (number < -10000000) {
//     return (number / 100000).toFixed(2) + ' L';
// }
// if (number < -100000 ) {
//   return (number / 1000).toFixed(2) + 'k';
// }

//     if(number==0 || (number<-999)) return number
//     // Convert to thousands if number is less than 1 lakh
  
    
//     return number;
//   }
// }
function formatNumberToIndianFormat(number) {
  if(number>=0){
  if (isNaN(number)) return "Invalid Number";
  if(number==0 || (number<999)) return number
  // Convert to thousands if number is less than 1 lakh
  if (number < 100000 ) {
      return (number / 1000).toFixed(2) + 'k';
  }
  // Convert to lakhs if number is less than 1 crore
  if (number < 10000000) {
      return (number / 100000).toFixed(2) + ' L';
  }
  // Convert to crores
  return (number / 10000000).toFixed(2) + ' Cr';
}else{
  number= Math.abs(number)
  if (isNaN(number)) return "Invalid Number";
  if(number==0 || (number<999)) return number
  // Convert to thousands if number is less than 1 lakh
  if (number < 100000 ) {
      return (-1)*(number / 1000).toFixed(2) + 'k';
  }
  // Convert to lakhs if number is less than 1 crore
  if (number < 10000000) {
      return (-1)*(number / 100000).toFixed(2) + ' L';
  }

  return (-1)*(number / 10000000).toFixed(2) + ' Cr';
}
}

useEffect(() => {
  const hotelID = JSON.stringify({
      hotelID: 1
  });

  fetch(DASHBOARD_URL + "/getBusinessDate", {
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
      console.error('Error fetching business date:', error);
  });
}, []);

useEffect(() => {
  if(data.length!=0){
      setLoadingVar(true)
      getMarketProductivity(data)

  }
}, [Today]);


// Function to add prefix to keys in an object
function addPrefix(obj, prefix) {
  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[`${prefix}${key}`] = obj[key];
    }
  }
  return newObj;
}
// Function to flatten an array of objects based on subGroupID and subGroupName
function flattenArray(arr) {
    const result = {};
    arr.forEach(item => {
      const key = item.ActualRevenue_subGroupID === null ? 'ActualRevenue_Description' : `ActualRevenue_${item.ActualRevenue_subGroupID}`;
      result[key] = { ...result[key], ...item };
    });
    return result;
  }


const getMarketProductivity =(data) =>{
  // fetch(DASHBOARD_URL + `/getDashBoardForecast?hotelID=1&date=2024-01-18`)
  fetch(DASHBOARD_URL + `/getRevComparisonData?hotelID=1&date=${data.FromDate}`)

  .then((result) => result.json())
  .then((response) => {
      if(response['statusCode']==200){
       
        const actualRevenue = response.data.ActualRevenue;
        const budgetRevenue = response.data.BudgetRevenue;
        const actualVSbudgetRevenue = response.data.ActualVSBudget;

        
        // Initialize an empty array to store the merged objects
        const mergedData = [];
        
        // Iterate over each object in ActualRevenue
        actualRevenue.forEach(actual => {
            // Find the corresponding object in BudgetRevenue
            const budget = budgetRevenue.find(budget => budget.subGroupID === actual.subGroupID && budget.subGroupName === actual.Description);
            const actualVSbudget = actualVSbudgetRevenue.find(budget => budget.subGroupID === actual.subGroupID && budget.Description === actual.Description);



            // Merge the objects
            const mergedObj = {
              "ActualRevenue_subGroupID": actual.subGroupID !== null ? actual.subGroupID : 0,
              "ActualRevenue_Description": actual.Description !== null ? actual.Description : "",
              "ActualRevenue_YesterdayTotal": actual.YesterdayTotal !== null ? actual.YesterdayTotal : 0,
              "ActualRevenue_TodayTotal": actual.TodayTotal !== null ? actual.TodayTotal : 0,
              "ActualRevenue_MonthTotal": actual.MonthTotal !== null ? actual.MonthTotal : 0,
              "ActualRevenue_YearTotal": actual.YearTotal !== null ? actual.YearTotal : 0,
              "ActualRevenue_HighlightHeader": actual.HighlightHeader !== null ? actual.HighlightHeader : false,
              "ActualRevenue_Highlight": actual.Highlight !== null ? actual.Highlight : false
               
            };

            if (actualVSbudgetRevenue) {

              mergedObj["ActualVSBudget_subGroupID"] = actualVSbudget.subGroupID !== null ? actualVSbudget.subGroupID : 0;
              mergedObj["ActualVSBudget_Description"] = actualVSbudget.Description !== null ? actualVSbudget.Description : "";
              mergedObj["ActualVSBudget_YesterdayTotal"] = actualVSbudget.YesterdayTotal !== null ? actualVSbudget.YesterdayTotal : 0;
              mergedObj["ActualVSBudget_TodayTotal"] = actualVSbudget.TodayTotal !== null ? actualVSbudget.TodayTotal : 0;
              mergedObj["ActualVSBudget_MonthTotal"] = actualVSbudget.MonthTotal !== null ? actualVSbudget.MonthTotal : 0;
              mergedObj["ActualVSBudget_YearTotal"] = actualVSbudget.YearTotal !== null ? actualVSbudget.YearTotal : 0;
              mergedObj["ActualVSBudget_HighlightHeader"] = actualVSbudget.HighlightHeader !== null ? actualVSbudget.HighlightHeader : false;
              mergedObj["ActualVSBudget_Highlight"] = actualVSbudget.Highlight !== null ? actualVSbudget.Highlight : false;
              }
        
            if (budget) {
              mergedObj["BudgetRevenue_subGroupID"] = budget.subGroupID !== null ? budget.subGroupID : 0;
              mergedObj["BudgetRevenuehotelID"] = budget.hotelID !== null ? budget.hotelID : 0;
              mergedObj["BudgetRevenue_subGroupName"] = budget.subGroupName !== null ? budget.subGroupName : "";
              mergedObj["BudgetRevenue_DayRevenue"] = budget.DayRevenue !== null ? budget.DayRevenue : 0;
              
              mergedObj["BudgetRevenue_month"] = budget.month !== null ? budget.month : "";
              mergedObj["BudgetRevenue_monthRevenue"] = budget.monthRevenue !== null ? budget.monthRevenue : 0;
              mergedObj["BudgetRevenue_NewMonthRevenue"] = budget.NewMonthRevenue !== null ? budget.NewMonthRevenue : 0;
              mergedObj["BudgetRevenue_Year"] = budget.Year !== null ? budget.Year : "";
              mergedObj["BudgetRevenue_YearRevenue"] = budget.YearRevenue !== null ? budget.YearRevenue : 0;
              mergedObj["BudgetRevenue_NewYearRevenue"] = budget.NewYearRevenue !== null ? budget.NewYearRevenue : 0;
              mergedObj["BudgetRevenue_HighlightHeader"] = budget.HighlightHeader !== null ? budget.HighlightHeader : false;
            } else {
                // Insert the keys of BudgetRevenue with empty or 0 values
                mergedObj["BudgetRevenue_subGroupID"] = null;
                mergedObj["BudgetRevenuehotelID"] = null;
                mergedObj["BudgetRevenue_subGroupName"] = null;
                mergedObj["BudgetRevenue_DayRevenue"] =0;

                mergedObj["BudgetRevenue_month"] = 0;
                mergedObj["BudgetRevenue_monthRevenue"] = 0;
                mergedObj["BudgetRevenue_NewMonthRevenue"] = 0;

                mergedObj["BudgetRevenue_Year"] = 0;
                mergedObj["BudgetRevenue_YearRevenue"] = 0;
                mergedObj["BudgetRevenue_NewYearRevenue"] =  0;

                mergedObj["BudgetRevenue_HighlightHeader"] = false;
            }
        
            // Push the merged object to the array
            mergedData.push(mergedObj);
        });
        
        console.log(mergedData);
        const formattedmergedData = mergedData.map(item => {
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
        setRevenueCompData(formattedmergedData)
      }
      setLoadingVar(false)
  })
  .catch((error) => {
      console.error('Error fetching Forecast data:', error);
  });

}



const optionsToDate = {

  maxDate : Today

};



  const gridRef = useRef();

  const [ColDef, setColDef] = useState([
    { headerName: '',
    headerClass: 'main-header vertical-line', // Apply custom class to main header
     children: [
    // {headerName: 'Markets', field: 'AllMarkets_Allmarkets', headerClass: 'additional-header vertical-line',cellClassRules: 'vertical-line',  suppressSizeToFit: true,flex:1,autoHeight:true,},
    { 
      headerName: '', 
      headerClass: 'additional-header vertical-line',
      field: 'ActualRevenue_Description', 
      cellClass: params => 'vertical-line-cell',
      suppressSizeToFit: true,  
     width:'300px',
      autoHeight: true 
  },
     ]},
    
     { headerName: 'ACTUAL',
     headerClass: 'main-header vertical-line', // Apply custom class to main header
      children: [
    {headerName: 'Yesterday', field: 'ActualRevenue_YesterdayTotal', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
    {headerName: 'MTD', field: 'ActualRevenue_MonthTotal', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
    {headerName: 'YTD', field: 'ActualRevenue_YearTotal', headerClass: 'additional-header vertical-line', cellClass: 'vertical-line',  suppressSizeToFit: true, width:'180px',autoHeight:true,},
     ]},
     { headerName: 'BUDGET',
     headerClass: 'main-header vertical-line', // Apply custom class to main header
      children: [
    {headerName: 'Yesterday', field: 'BudgetRevenue_DayRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
    {headerName: 'MTD', field: 'BudgetRevenue_NewMonthRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
    {headerName: 'YTD', field: 'BudgetRevenue_NewYearRevenue', headerClass: 'additional-header vertical-line', cellClass: 'vertical-line',  suppressSizeToFit: true, width:'180px',autoHeight:true,},
     ]},
     { headerName: 'BUDGET VARIANCE',
     headerClass: 'main-header vertical-line', // Apply custom class to main header
      children: [
    {headerName: 'Yesterday', field: 'ActualVSBudget_YesterdayTotal', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
    {headerName: 'MTD', field: 'ActualVSBudget_MonthTotal', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true, width:'180px',autoHeight:true,},
    {headerName: 'YTD', field: 'ActualVSBudget_YearTotal', headerClass: 'additional-header vertical-line', cellClass: 'vertical-line',  suppressSizeToFit: true, flex:1,autoHeight:true,},
     ]}

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
  const onGridReady = (params) => {
    gridRef.current = params.api;
  };
  const getRowStyle = params => {
    if (params.data && params.data.ActualRevenue_Highlight === true) {
    // if (params.data && params.data.AllBooksReqExists === 0 ) {

      return { background: '#147331', fontWeight: 'bold', rowHeight:60 };
    }
    if (params.data && params.data.ActualRevenue_HighlightHeader === true) {
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
getMarketProductivity(data)

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


const cellClickedListener = useCallback(event => {
  console.log(event)


}, []); // Ensure to include all dependencies in the dependencies array



  return (
    <div>
      <Form onSubmit={handleSubmit(ConfirmSubmit)}>
        <Row className='justify-content-end'>

        <Col md='6' sm='12' className='justify-content-right' style={{'white-space': 'nowrap'}}>
  {data.length!=0 && <h1><b>Revenue Comparison Of {formatDate(data.FromDate)}</b></h1>}
</Col>
{/* <Col md='3' sm='8'></Col> */}
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
          <Col md='auto' sm='8' style={{ marginTop: '20px' }}>
            <div className='d-flex align-items-end justify-content-end'>
              <Button color='primary' className='me-1' type='submit'>
                Submit
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
            {/* Market Productivity */}
      <Card>
                  <CardHeader>
                    {/* <CardTitle><h2 style={{marginBottom: '20px' ,textDecoration:'underline'}}><b>Revenue Comparison</b></h2></CardTitle> */}
                  </CardHeader>
                  <CardBody>
      <div id='grid1' style={{ height: '100%' }} className="ag-theme-alpine-dark custom-ag-grid">
      { RevenueCompData.length !=0 && <AgGridReact
                              ref={gridRef}
                              rowData={RevenueCompData}
                              getRowStyle={getRowStyle}
                              // columnDefs={ColDef}
                              columnDefs={ColDef.map(colDef => ({...colDef}))}
                              animateRows={true}
                              rowSelection='multiple'
                              defaultColDef={defaultColDef}
                              headerColor="ddw-primary"
                              domLayout='autoHeight'
                              rowHeight={40} // Set the row height
                            />}
                            </div>
                            </CardBody>
                </Card>


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