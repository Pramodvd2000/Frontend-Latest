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
  const [DashboardRev, setDashboardRev] = useState([]);
  const [AllMarketsData, setAllMarketsData] = useState([]);
  const [MarketsYesterday, setMarketsYesterday] = useState([]);
  const [MarketsToday, setMarketsToday] = useState([]);
  const [MarketsMonth, setMarketsMonth] = useState([]);
  const [MarketsYear, setMarketsYear] = useState([]);
  const [AllSourcesData, setAllSourcesData] = useState([]);
  const [SourcesYesterday, setSourcesYesterday] = useState([]);
  const [SourcesToday, setSourcesToday] = useState([]);
  const [SourcesMonth, setSourcesMonth] = useState([]);
  const [SourcesYear, setSourcesYear] = useState([]);
  const [AllAccountsData, setAllAccountsData] = useState([]);
  const [AccountsMonth, setAccountsMonth] = useState([]);
  const [AccountsYear, setAccountsYear] = useState([]);
  const [AllAccountsDataRoom, setAllAccountsDataRoom] = useState([]);
  const [AccountsMonthRoom, setAccountsMonthRoom] = useState([]);
  const [AccountsYearRoom, setAccountsYearRoom] = useState([]);
  const [AllAccountsDataFnB, setAllAccountsDataFnB] = useState([]);
  const [AccountsMonthFnB, setAccountsMonthFnB] = useState([]);
  const [AccountsYearFnB, setAccountsYearFnB] = useState([]);
  const [LoadingVar,setLoadingVar] = useState(false)
  const [data, setData] = useState([]);
  const [MarketFlatData,setMarketFlatData] = useState([])
  const [SourceFlatData,setSourceFlatData] = useState([])
  const [RoomAccountFlatData,setRoomAccountFlatData] = useState([])
  const [RoomAgentFlatData,setRoomAgentFlatData] = useState([])
  const [FnBAccountFlatData,setFnBAccountFlatData] = useState([])
  const [FnBAgentFlatData,setFnBAgentFlatData] = useState([])

  const [CompanyRoomAccountFlatDataByYear,setCompanyRoomAccountFlatDataByYear] = useState([])
  const [CompanyFnBAccountFlatDataByYear,setCompanyFnBAccountFlatDataByYear] = useState([])
  const [AgentRoomAccountFlatDataByYear,setAgentRoomAccountFlatDataByYear] = useState([])
  const [AgentFnBAccountFlatDataByYear,setAgentFnBAccountFlatDataByYear] = useState([])
  const [Today, setToday] = useState([]);  
  const [pinnedBottomRowData1, setPinnedBottomRowData1] = useState([]);
  const [pinnedBottomRowData2, setPinnedBottomRowData2] = useState([]);

// gowri 

const [datamonthwise, setDataMonthwise] = useState();
  const [datayearwise, setDataYearWise] = useState();
  const [dataAccountManagerwise, setDataManagerwise] = useState();
  const [accountData, setAccountData] = useState();


  const [managersflatdata, setManagerFlatData]= useState('')

  const [AllaccManagerData, setAllaccManagerData] = useState([]);
  const [AccManagerYesterday, setAccManagerYesterday] = useState([]);
  const [AccManagerToday, setAccManagerToday] = useState([]);
  const [AccManagerMonth, setAccManagerMonth] = useState([]);
  const [AccManagerYear, seAccManagerYear] = useState([]);
  const gridRef = useRef();
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
      getSourceProductivity(data)
      getAccountProductivity(data)
      getAgentProductivity(data)
      getAccountManagerProductivityy(data)
  }
}, [Today]);




const getMarketProductivity =(data) =>{
  // fetch(DASHBOARD_URL + `/getDashBoardForecast?hotelID=1&date=2024-01-18`)
  fetch(DASHBOARD_URL + `/getDashboardMarketProductivity?hotelID=1&date=${data.FromDate}`)

  .then((result) => result.json())
  .then((response) => {
      if(response['statusCode']==200){
        const formattedYesterday = response.data.Yesterday.map(item => {
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
      const formattedToday = response.data.Today.map(item => {
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
    const formattedMonth = response.data.Month.map(item => {
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
  const formattedYear = response.data.Year.map(item => {
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
    setAllMarketsData(response.data.AllMarkets);
    setMarketsYesterday(formattedYesterday);
    setMarketsToday(formattedToday)
    setMarketsMonth(formattedMonth)
    setMarketsYear(formattedYear)

  }
  // setLoadingVar(false)

  const allMarkets = response.data["AllMarkets"];
  const yesterday = response.data["Yesterday"];
  const today = response.data["Today"];
  const month = response.data["Month"];
  const year = response.data["Year"];
  
  const flattenedMarketData = [];
  
  // Iterate over each market
  for (let i = 0; i < allMarkets.length; i++) {
      const marketData = mergeMarketData(i, allMarkets, yesterday, today, month, year);
      flattenedMarketData.push(marketData);
  }
  

// setPinnedBottomRowData([totals]);
for(let i=0;i<flattenedMarketData.length;i++){
  console.log(flattenedMarketData[i])
  for (const key in flattenedMarketData[i]) {
    console.log(key)
    console.log(flattenedMarketData[i][key])
    console.log(typeof flattenedMarketData[i][key])

    if (typeof flattenedMarketData[i][key] === 'number') {
      flattenedMarketData[i][key] = formatNumberToIndianFormat(flattenedMarketData[i][key]);
      console.log(flattenedMarketData[i][key])
    }
  }
 
}


setMarketFlatData(flattenedMarketData)

  })
  .catch((error) => {
      console.error('Error fetching Forecast data:', error);
  });

}

const mergeMarketData = (marketIndex, allMarkets, yesterday, today, month, year) => {
  const marketData = {};
  const formattedItem = {};
  // Get data for AllMarkets
  if (allMarkets[marketIndex]) {
      for (const key in allMarkets[marketIndex]) {
        
          marketData[`AllMarkets_${key}`] = allMarkets[marketIndex][key];
      }
  }

  // Get data for Yesterday
  if (yesterday[marketIndex]) {
      for (const key in yesterday[marketIndex]) {
        if (typeof yesterday[marketIndex][key] === 'number') {
          // Format the number if it's a number
          marketData[`Yesterday_${key}`] = (yesterday[marketIndex][key]);
      } else {
          // Otherwise, keep the value as it is
          marketData[`Yesterday_${key}`] = yesterday[marketIndex][key];
      }
          // marketData[`Yesterday_${key}`] = yesterday[marketIndex][key];
          
      }
  }

  // Get data for Today
  if (today[marketIndex]) {
      for (const key in today[marketIndex]) {
        if (typeof today[marketIndex][key] === 'number') {
          // Format the number if it's a number
          marketData[`Today_${key}`] = (today[marketIndex][key]);
      } else {
          // Otherwise, keep the value as it is
          marketData[`Today_${key}`] = today[marketIndex][key];
      }
          // marketData[`Today_${key}`] = today[marketIndex][key];
      }
  }

  // Get data for Month
  if (month[marketIndex]) {
      for (const key in month[marketIndex]) {
        if (typeof month[marketIndex][key] === 'number') {
          // Format the number if it's a number
          marketData[`Month_${key}`] = (month[marketIndex][key]);
      } else {
          // Otherwise, keep the value as it is
          marketData[`Month_${key}`] = month[marketIndex][key];
      }
          // marketData[`Month_${key}`] = month[marketIndex][key];
      }
  }

  // Get data for Year
  if (year[marketIndex]) {
      for (const key in year[marketIndex]) {
        if (typeof year[marketIndex][key] === 'number') {
          // Format the number if it's a number
          marketData[`Year_${key}`] = (year[marketIndex][key]);
      } else {
          // Otherwise, keep the value as it is
          marketData[`Year_${key}`] = year[marketIndex][key];
      }
          // marketData[`Year_${key}`] = year[marketIndex][key];
      }
  }

  return marketData;
};

const getSourceProductivity =(data) =>{
  
  // fetch(DASHBOARD_URL + `/getDashBoardForecast?hotelID=1&date=2024-01-18`)
  fetch(DASHBOARD_URL + `/getDashboardSourceProductivity?hotelID=1&date=${data.FromDate}`)

  .then((result) => result.json())
  .then((response) => {
      if(response['statusCode']==200){
        const formattedYesterday = response.data.Yesterday.map(item => {
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
      const formattedToday = response.data.Today.map(item => {
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
    const formattedMonth = response.data.Month.map(item => {
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
  const formattedYear = response.data.Year.map(item => {
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
    setAllSourcesData(response.data.AllSources);
    setSourcesYesterday(formattedYesterday);
    setSourcesToday(formattedToday)
    setSourcesMonth(formattedMonth)
    setSourcesYear(formattedYear)

  }
  setLoadingVar(false)

  const allSources = response.data["AllSources"];
  const yesterday = response.data["Yesterday"];
  const today = response.data["Today"];
  const month = response.data["Month"];
  const year = response.data["Year"];
  
  const flattenedSourceData = [];
  
  // Iterate over each market
  for (let i = 0; i < allSources.length; i++) {
      const sourceData = mergeSourceData(i, allSources, yesterday, today, month, year);
      flattenedSourceData.push(sourceData);
  }
  
  console.log(flattenedSourceData);

setSourceFlatData(flattenedSourceData)
  })
  .catch((error) => {
      console.error('Error fetching Forecast data:', error);
  });

}


const mergeSourceData = (sourceIndex, allSources, yesterday, today, month, year) => {
  const sourceData = {};
  const formattedItem = {};
  // Get data for AllSources
  if (allSources[sourceIndex]) {
      for (const key in allSources[sourceIndex]) {
        
        sourceData[`AllSources_${key}`] = allSources[sourceIndex][key];
      }
  }

  // Get data for Yesterday
  if (yesterday[sourceIndex]) {
      for (const key in yesterday[sourceIndex]) {
        if (typeof yesterday[sourceIndex][key] === 'number') {
          // Format the number if it's a number
          sourceData[`Yesterday_${key}`] = formatNumberToIndianFormat(yesterday[sourceIndex][key]);
      } else {
          // Otherwise, keep the value as it is
          sourceData[`Yesterday_${key}`] = yesterday[sourceIndex][key];
      }
          // sourceData[`Yesterday_${key}`] = yesterday[sourceIndex][key];
          
      }
  }

  // Get data for Today
  if (today[sourceIndex]) {
      for (const key in today[sourceIndex]) {
        if (typeof today[sourceIndex][key] === 'number') {
          // Format the number if it's a number
          sourceData[`Today_${key}`] = formatNumberToIndianFormat(today[sourceIndex][key]);
      } else {
          // Otherwise, keep the value as it is
          sourceData[`Today_${key}`] = today[sourceIndex][key];
      }
          // sourceData[`Today_${key}`] = today[sourceIndex][key];
      }
  }

  // Get data for Month
  if (month[sourceIndex]) {
      for (const key in month[sourceIndex]) {
        if (typeof month[sourceIndex][key] === 'number') {
          // Format the number if it's a number
          sourceData[`Month_${key}`] = formatNumberToIndianFormat(month[sourceIndex][key]);
      } else {
          // Otherwise, keep the value as it is
          sourceData[`Month_${key}`] = month[sourceIndex][key];
      }
          // sourceData[`Month_${key}`] = month[sourceIndex][key];
      }
  }

  // Get data for Year
  if (year[sourceIndex]) {
      for (const key in year[sourceIndex]) {
        if (typeof year[sourceIndex][key] === 'number') {
          // Format the number if it's a number
          sourceData[`Year_${key}`] = formatNumberToIndianFormat(year[sourceIndex][key]);
      } else {
          // Otherwise, keep the value as it is
          sourceData[`Year_${key}`] = year[sourceIndex][key];
      }
          // sourceData[`Year_${key}`] = year[sourceIndex][key];
      }
  }

  return sourceData;
};

const getAccountProductivity =(data) =>{
  
  // fetch(DASHBOARD_URL + `/getDashboardAccountProductivity?hotelID=1&date=2024-01-18`)
  fetch(DASHBOARD_URL + `/getDashboardAccountProductivity?hotelID=1&date=${data.FromDate}`)

  .then((result) => result.json())
  .then((response) => {
      if(response['statusCode']==200){
       
    const allRoomAccounts = response.data.Room["AllAccounts"];
    const Roommonth = response.data.Room["Month"];
    const Roomyear = response.data.Room["Year"];
    
    const flattenedRoomAccountData = [];
    
    // Iterate over each market
    for (let i = 0; i < allRoomAccounts.length; i++) {
        const AccountData = mergeAccountData(i, allRoomAccounts, Roommonth, Roomyear);
        flattenedRoomAccountData.push(AccountData);
    }
    
    console.log(flattenedRoomAccountData);
  
  setRoomAccountFlatData(flattenedRoomAccountData)

// Company Year top 10

const CompanyallRoomAccountsByYear = response.data.RoomByYear["AllAccounts"];
const CompanyRoommonthByYear = response.data.RoomByYear["Month"];
const CompanyRoomyearByYear = response.data.RoomByYear["Year"];

const CompanyflattenedRoomAccountDataByYear = [];
console.log(CompanyallRoomAccountsByYear)
console.log(allRoomAccounts)
// Iterate over each market
for (let i = 0; i < allRoomAccounts.length; i++) {
    const AccountData = mergeAccountData(i, CompanyallRoomAccountsByYear, CompanyRoommonthByYear, CompanyRoomyearByYear);
    CompanyflattenedRoomAccountDataByYear.push(AccountData);
}


setCompanyRoomAccountFlatDataByYear(CompanyflattenedRoomAccountDataByYear)

  const allFnBAccounts = response.data.FnB["AllAccounts"];
  const FnBmonth = response.data.FnB["Month"];
  const FnByear = response.data.FnB["Year"];
  
  const flattenedFnBAccountData = [];
  
  // Iterate over each market
  for (let i = 0; i < allFnBAccounts.length; i++) {
      const AccountData = mergeAccountData(i, allFnBAccounts, FnBmonth, FnByear);
      flattenedFnBAccountData.push(AccountData);
  }
  
  console.log(flattenedFnBAccountData);

setFnBAccountFlatData(flattenedFnBAccountData)

// Company FnB By Year
const CompanyallFnBAccountsByYear = response.data.FnBByYear["AllAccounts"];
const CompanyFnBmonthByYear = response.data.FnBByYear["Month"];
const CompanyFnByearByYear = response.data.FnBByYear["Year"];

const CompanyflattenedFnBAccountDataByYear = [];

// Iterate over each market
for (let i = 0; i < CompanyallFnBAccountsByYear.length; i++) {
    const AccountData = mergeAccountData(i, CompanyallFnBAccountsByYear, CompanyFnBmonthByYear, CompanyFnByearByYear);
    CompanyflattenedFnBAccountDataByYear.push(AccountData);
}


setCompanyFnBAccountFlatDataByYear(CompanyflattenedFnBAccountDataByYear)


  }
  })
  .catch((error) => {
      console.error('Error fetching Forecast data:', error);
  });

}


const getAgentProductivity =(data) =>{
  
  // fetch(DASHBOARD_URL + `/getDashboardAccountProductivity?hotelID=1&date=2024-01-18`)
  fetch(DASHBOARD_URL + `/getDashboardAgentProductivity?hotelID=1&date=${data.FromDate}`)

  .then((result) => result.json())
  .then((response) => {
      if(response['statusCode']==200){
       
    const allRoomAccounts = response.data.Room["AllAccounts"];
    const Roommonth = response.data.Room["Month"];
    const Roomyear = response.data.Room["Year"];
    
    const flattenedRoomAccountData = [];
    
    // Iterate over each market
    for (let i = 0; i < allRoomAccounts.length; i++) {
        const AccountData = mergeAccountData(i, allRoomAccounts, Roommonth, Roomyear);
        flattenedRoomAccountData.push(AccountData);
    }
    
    console.log(flattenedRoomAccountData);
  
  setRoomAgentFlatData(flattenedRoomAccountData)

// Company Year top 10

const CompanyallRoomAccountsByYear = response.data.RoomByYear["AllAccounts"];
const CompanyRoommonthByYear = response.data.RoomByYear["Month"];
const CompanyRoomyearByYear = response.data.RoomByYear["Year"];

const CompanyflattenedRoomAccountDataByYear = [];
console.log(CompanyallRoomAccountsByYear)
console.log(allRoomAccounts)
// Iterate over each market
for (let i = 0; i < allRoomAccounts.length; i++) {
    const AccountData = mergeAccountData(i, CompanyallRoomAccountsByYear, CompanyRoommonthByYear, CompanyRoomyearByYear);
    CompanyflattenedRoomAccountDataByYear.push(AccountData);
}


setAgentRoomAccountFlatDataByYear(CompanyflattenedRoomAccountDataByYear)

  const allFnBAccounts = response.data.FnB["AllAccounts"];
  const FnBmonth = response.data.FnB["Month"];
  const FnByear = response.data.FnB["Year"];
  
  const flattenedFnBAccountData = [];
  
  // Iterate over each market
  for (let i = 0; i < allFnBAccounts.length; i++) {
      const AccountData = mergeAccountData(i, allFnBAccounts, FnBmonth, FnByear);
      flattenedFnBAccountData.push(AccountData);
  }
  
  console.log(flattenedFnBAccountData);

setFnBAgentFlatData(flattenedFnBAccountData)

// Company FnB By Year
const CompanyallFnBAccountsByYear = response.data.FnBByYear["AllAccounts"];
const CompanyFnBmonthByYear = response.data.FnBByYear["Month"];
const CompanyFnByearByYear = response.data.FnBByYear["Year"];

const CompanyflattenedFnBAccountDataByYear = [];

// Iterate over each market
for (let i = 0; i < CompanyallFnBAccountsByYear.length; i++) {
    const AccountData = mergeAccountData(i, CompanyallFnBAccountsByYear, CompanyFnBmonthByYear, CompanyFnByearByYear);
    CompanyflattenedFnBAccountDataByYear.push(AccountData);
}


setAgentFnBAccountFlatDataByYear(CompanyflattenedFnBAccountDataByYear)


  }
  })
  .catch((error) => {
      console.error('Error fetching Forecast data:', error);
  });

}


const mergeAccountData = (accountIndex, allAccounts, month, year) => {
  const accountData = {};
  const formattedItem = {};
  // Get data for allAccounts
  if (allAccounts[accountIndex]) {
      for (const key in allAccounts[accountIndex]) {
        
        accountData[`AllAccounts_${key}`] = allAccounts[accountIndex][key];
      }
  }

  // Get data for Month
  if (month[accountIndex]) {
      for (const key in month[accountIndex]) {
        if (typeof month[accountIndex][key] === 'number') {
          // Format the number if it's a number
          accountData[`Month_${key}`] = formatNumberToIndianFormat(month[accountIndex][key]);
      } else {
          // Otherwise, keep the value as it is
          accountData[`Month_${key}`] = month[accountIndex][key];
      }
          // accountData[`Month_${key}`] = month[accountIndex][key];
      }
  }

  // Get data for Year
  if (year[accountIndex]) {
      for (const key in year[accountIndex]) {
        if (typeof year[accountIndex][key] === 'number') {
          // Format the number if it's a number
          accountData[`Year_${key}`] = formatNumberToIndianFormat(year[accountIndex][key]);
      } else {
          // Otherwise, keep the value as it is
          accountData[`Year_${key}`] = year[accountIndex][key];
      }
          // accountData[`Year_${key}`] = year[accountIndex][key];
      }
  }

  return accountData;
};


const optionsToDate = {

  maxDate : Today

};
// Grid options
// const gridOptions = {
//   enableCellTextSelection: true,
//   suppressAggAtRootLevel: true,
//   groupIncludeFooter: true,
//   groupIncludeTotalFooter: true,
//   // Configure the aggregation for the footer row
//   autoGroupColumnDef: {
//       headerName: 'Totals',
//       cellRenderer: 'agGroupCellRenderer',
//       footerValueGetter: (params) => {
//           const { field, api } = params.column.colDef;
//           const total = api.getValue(field, params.node);
//           return total !== undefined ? total : '';
//       }
//   },
//   onGridReady: (params) => {
//       params.api.setRowData(MarketFlatData);
//   }
// };

const CustomFooterCellRenderer = (params) => {
  if (params.node.rowPinned) {
      if (params.colDef.field === 'AllMarkets_Allmarkets') {
          return 'Total';
      }
      return params.value;
  }
  return params.value;
};

  const [NewMarketColDef, setNewMarketColDef] = useState([
    { headerName: '',
    headerClass: 'main-header vertical-line', // Apply custom class to main header
     children: [
    // {headerName: 'Markets', field: 'AllMarkets_Allmarkets', headerClass: 'additional-header vertical-line',cellClassRules: 'vertical-line',  suppressSizeToFit: true,flex:1,autoHeight:true,},
    { 
      headerName: 'Markets', 
      headerClass: 'additional-header vertical-line',
      field: 'AllMarkets_Allmarkets', 
      cellClass: params => 'vertical-line-cell',
      suppressSizeToFit: true,  
     width:'200px',
      autoHeight: true ,
      cellRendererFramework: CustomFooterCellRenderer
  },
     ]},
    
     { headerName: 'TODAY',
     headerClass: 'main-header vertical-line', // Apply custom class to main header
      children: [
    {headerName: 'OCC', field: 'Today_nights', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'130px',autoHeight:true},
    {headerName: 'Room Rev', field: 'Today_roomRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true},
    {headerName: 'F&B Rev', field: 'Today_fnbRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true, width:'180px',autoHeight:true},
    {headerName: 'ARR', field: 'Today_avgRoomRevenue', headerClass: 'additional-header vertical-line', cellClass: 'vertical-line',  suppressSizeToFit: true, flex:1,autoHeight:true},
     ]},
     { headerName: 'MTD',
     headerClass: 'main-header vertical-line', // Apply custom class to main header
      children: [
    {headerName: 'OCC', field: 'Month_nights', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'130px',autoHeight:true,},
    {headerName: 'Room Rev', field: 'Month_roomRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
    {headerName: 'F&B Rev', field: 'Month_fnbRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true, width:'180px',autoHeight:true,},
    {headerName: 'ARR', field: 'Month_avgRoomRevenue', headerClass: 'additional-header vertical-line', cellClass: 'vertical-line',  suppressSizeToFit: true, flex:1,autoHeight:true,},
     ]},
     { headerName: 'YTD',
     headerClass: 'main-header vertical-line', // Apply custom class to main header
      children: [
    {headerName: 'OCC', field: 'Year_nights', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'130px',autoHeight:true,},
    {headerName: 'Room Rev', field: 'Year_roomRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
    {headerName: 'F&B Rev', field: 'Year_fnbRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true, width:'180px',autoHeight:true,},
    {headerName: 'ARR', field: 'Year_avgRoomRevenue', headerClass: 'additional-header vertical-line', cellClass: 'vertical-line',  suppressSizeToFit: true, flex:1,autoHeight:true,},
     ]}

  ]);


// source col defs
const [NewSourceColDef, setNewSourceColDef] = useState([
  { headerName: '',
  headerClass: 'main-header vertical-line', // Apply custom class to main header
   children: [
  // {headerName: 'Markets', field: 'AllMarkets_Allmarkets', headerClass: 'additional-header vertical-line',cellClassRules: 'vertical-line',  suppressSizeToFit: true,flex:1,autoHeight:true,},
  { 
    headerName: 'Sources', 
    headerClass: 'additional-header vertical-line',
    field: 'AllSources_Allsource', 
    cellClass: params => 'vertical-line-cell',
    suppressSizeToFit: true,  
   width:'250px', 
    autoHeight: true 
},
   ]},
  
   { headerName: 'TODAY',
   headerClass: 'main-header vertical-line', // Apply custom class to main header
    children: [
  {headerName: 'OCC', field: 'Today_nights', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'130px',autoHeight:true,},
  {headerName: 'Room Rev', field: 'Today_roomRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
  {headerName: 'F&B Rev', field: 'Today_fnbRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true, width:'180px',autoHeight:true,},
  {headerName: 'ARR', field: 'Today_avgRoomRevenue', headerClass: 'additional-header vertical-line', cellClass: 'vertical-line',  suppressSizeToFit: true, flex:1,autoHeight:true,},
   ]},
   { headerName: 'MTD',
   headerClass: 'main-header vertical-line', // Apply custom class to main header
    children: [
  {headerName: 'OCC', field: 'Month_nights', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'130px',autoHeight:true,},
  {headerName: 'Room Rev', field: 'Month_roomRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
  {headerName: 'F&B Rev', field: 'Month_fnbRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true, width:'180px',autoHeight:true,},
  {headerName: 'ARR', field: 'Month_avgRoomRevenue', headerClass: 'additional-header vertical-line', cellClass: 'vertical-line',  suppressSizeToFit: true, flex:1,autoHeight:true,},
   ]},
   { headerName: 'YTD',
   headerClass: 'main-header vertical-line', // Apply custom class to main header
    children: [
  {headerName: 'OCC', field: 'Year_nights', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'130px',autoHeight:true,},
  {headerName: 'Room Rev', field: 'Year_roomRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
  {headerName: 'F&B Rev', field: 'Year_fnbRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true, width:'180px',autoHeight:true,},
  {headerName: 'ARR', field: 'Year_avgRoomRevenue', headerClass: 'additional-header vertical-line', cellClass: 'vertical-line',  suppressSizeToFit: true, flex:1,autoHeight:true,},
   ]}

]);


// accounts room col defs
const [NewRoomAccColDef, setNewRoomAccColDef] = useState([
  { headerName: '',
  headerClass: 'main-header vertical-line', // Apply custom class to main header
   children: [
  // {headerName: 'Markets', field: 'AllMarkets_Allmarkets', headerClass: 'additional-header vertical-line',cellClassRules: 'vertical-line',  suppressSizeToFit: true,flex:1,autoHeight:true,},
  { 
    headerName: 'Accounts', 
    headerClass: 'additional-header vertical-line',
    field: 'AllAccounts_Allaccount', 
    cellClass: params => 'vertical-line-cell',
    suppressSizeToFit: true,  
    width:'700px', 
    autoHeight: true 
},
   ]},
  
   { headerName: 'MTD',
   headerClass: 'main-header vertical-line', // Apply custom class to main header
    children: [
  {headerName: 'OCC', field: 'Month_nights', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'130px',autoHeight:true,},
  {headerName: 'Room Rev', field: 'Month_roomRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
  {headerName: 'F&B Rev', field: 'Month_fnbRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true, width:'180px',autoHeight:true,},
  {headerName: 'ARR', field: 'Month_avgRoomRevenue', headerClass: 'additional-header vertical-line', cellClass: 'vertical-line',  suppressSizeToFit: true, flex:1,autoHeight:true,},
   ]},
   { headerName: 'YTD',
   headerClass: 'main-header vertical-line', // Apply custom class to main header
    children: [
  {headerName: 'OCC', field: 'Year_nights', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'130px',autoHeight:true,},
  {headerName: 'Room Rev', field: 'Year_roomRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
  {headerName: 'F&B Rev', field: 'Year_fnbRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true, width:'180px',autoHeight:true,},
  {headerName: 'ARR', field: 'Year_avgRoomRevenue', headerClass: 'additional-header vertical-line', cellClass: 'vertical-line',  suppressSizeToFit: true, flex:1,autoHeight:true,},
   ]}

]);


//accounts FnB
const [NewFnBAccColDef, setNewFnBAccColDef] = useState([
  { headerName: '',
  headerClass: 'main-header vertical-line', // Apply custom class to main header
   children: [
  // {headerName: 'Markets', field: 'AllMarkets_Allmarkets', headerClass: 'additional-header vertical-line',cellClassRules: 'vertical-line',  suppressSizeToFit: true,flex:1,autoHeight:true,},
  { 
    headerName: 'Accounts', 
    headerClass: 'additional-header vertical-line',
    field: 'AllAccounts_Allaccount', 
    cellClass: params => 'vertical-line-cell',
    suppressSizeToFit: true,  
    width:'700px', 
    autoHeight: true 
},
   ]},
  
   { headerName: 'MTD',
   headerClass: 'main-header vertical-line', // Apply custom class to main header
    children: [
 
  {headerName: 'F&B Rev', field: 'Month_fnbRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true, felx:1,autoHeight:true,},
 
   ]},
   { headerName: 'YTD',
   headerClass: 'main-header vertical-line', // Apply custom class to main header
    children: [
 
  {headerName: 'F&B Rev', field: 'Year_fnbRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true, flex:1,autoHeight:true,},
 
   ]}

]);



  const [AllMarketColDef, setAllMarketColDef] = useState([
    {headerName: 'Markets', field: 'Allmarkets', headerClass: 'additional-header',  suppressSizeToFit: true,  flex: 1,autoHeight:true,},
  ]);
  const [AllSourceColDef, setAllSourceColDef] = useState([
    {headerName: 'Sources', field: 'Allsource', headerClass: 'additional-header',  suppressSizeToFit: true,  flex: 1,autoHeight:true,},
  ]);
  const [AllAccountColDef, setAllAccountColDef] = useState([
    {headerName: 'Accounts', field: 'accountName', headerClass: 'additional-header',  suppressSizeToFit: true,  flex: 1,autoHeight:true,},
  ]);
//  ColDef
  const [TodayColDef, setTodayColDef] = useState([
    { headerName: 'TODAY',
    headerClass: 'main-header', // Apply custom class to main header
     children: [
    {headerName: 'OCC', field: 'nights', headerClass: 'additional-header',  suppressSizeToFit: true,  width:'130px',autoHeight:true,},
    {headerName: 'Room Rev', field: 'roomRevenue', headerClass: 'additional-header',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
    {headerName: 'F&B Rev', field: 'fnbRevenue', headerClass: 'additional-header',  suppressSizeToFit: true, width:'140px',autoHeight:true,},
    {headerName: 'ARR', field: 'avgRoomRevenue', headerClass: 'additional-header',  suppressSizeToFit: true, flex:1,autoHeight:true,},
    ]}
  ]);
  const [MonthColDef, setMonthColDef] = useState([
    { headerName: 'MTD', headerClass: 'main-header',  children: [
    {headerName: 'OCC', field: 'nights', headerClass: 'additional-header',  suppressSizeToFit: true,  width:'130px',autoHeight:true,},
    {headerName: 'Room Rev', field: 'roomRevenue', headerClass: 'additional-header',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
    {headerName: 'F&B Rev', field: 'fnbRevenue', headerClass: 'additional-header',  suppressSizeToFit: true, width:'140px',autoHeight:true,},
    {headerName: 'ARR', field: 'avgRoomRevenue', headerClass: 'additional-header',  suppressSizeToFit: true, flex:1,autoHeight:true,},
    ]}
  ]);

  const [fnBMonthColDef, setfnBMonthColDef] = useState([
    { headerName: 'MTD', headerClass: 'main-header',  children: [
   
    {headerName: 'F&B Revenue', field: 'fnbRevenue', headerClass: 'additional-header',  suppressSizeToFit: true, flex:1,autoHeight:true,},
   
    ]}
  ]);

  const [YearColDef, setYearColDef] = useState([
    { headerName: 'YTD', headerClass: 'main-header',  children: [
    {headerName: 'OCC', field: 'nights', headerClass: 'additional-header',  suppressSizeToFit: true,  width:'130px',autoHeight:true,},
    {headerName: 'Room Rev', field: 'roomRevenue', headerClass: 'additional-header',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
    {headerName: 'F&B Rev', field: 'fnbRevenue', headerClass: 'additional-header',  suppressSizeToFit: true, width:'140px',autoHeight:true,},
    {headerName: 'ARR', field: 'avgRoomRevenue', headerClass: 'additional-header',  suppressSizeToFit: true, flex:1,autoHeight:true,},
    ]}
  ]);
  const [fnBYearColDef, setfnBYearColDef] = useState([
    { headerName: 'YTD', headerClass: 'main-header',  children: [
   
    {headerName: 'F&B Revenue', field: 'fnbRevenue', headerClass: 'additional-header',  suppressSizeToFit: true, flex:1,autoHeight:true,},
   
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
getMarketProductivity(data)
getSourceProductivity(data)
getAccountProductivity(data)
getAgentProductivity(data)


getAccountManagerProductivityy(data)

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



// gowri



const getAccountManagerProductivityy =(data) =>{

  fetch(DASHBOARD_URL + `/getDashboardAccountManagerProductivity?hotelID=1&date=${data.FromDate}`)

  .then((result) => result.json())
  .then((response) => {
      if(response['statusCode']==200){
       
   




const allManagers = response.data["AllAccountManagers"];
const previousday = response.data["Yesterday"];
const today = response.data["Today"];
const month = response.data["Month"];
const year = response.data["Year"];

const flattenedManagerData = [];

// Iterate over each market
for (let i = 0; i < allManagers.length; i++) {
    const managersData = mergeAccountManagerData(i, allManagers, previousday, today, month, year);
    flattenedManagerData.push(managersData);
}
console.log(flattenedManagerData);

setManagerFlatData(flattenedManagerData)
      }
// setLoadingVar(false)
})

.catch((error) => {
    console.error('Error fetching Forecast data:', error);
});

}


const mergeAccountManagerData = (managerIndex,allManagers, yesterday, today, month, year) => {
  const managerData = {};
  const formattedItem = {};
  // Get data for AllMarkets
  if (allManagers[managerIndex]) {
      for (const key in allManagers[managerIndex]) {
        
        managerData[`accountManagerID_${key}`] = allManagers[managerIndex][key];
      }
  }

  // Get data for Yesterday
  if (yesterday[managerIndex]) {
      for (const key in yesterday[managerIndex]) {
        if (typeof yesterday[managerIndex][key] === 'number') {
          // Format the number if it's a number
          managerData[`previous_${key}`] = formatNumberToIndianFormat(yesterday[managerIndex][key]);
      } else {
          // Otherwise, keep the value as it is
          managerData[`previous_${key}`] = yesterday[managerIndex][key];
      }
          // marketData[`Yesterday_${key}`] = yesterday[marketIndex][key];
          
      }
  }

  // Get data for Today
  if (today[managerIndex]) {
      for (const key in today[managerIndex]) {
        if (typeof today[managerIndex][key] === 'number') {
          // Format the number if it's a number
          managerData[`day_${key}`] = formatNumberToIndianFormat(today[managerIndex][key]);
      } else {
          // Otherwise, keep the value as it is
          managerData[`day_${key}`] = today[managerIndex][key];
      }
          // marketData[`Today_${key}`] = today[marketIndex][key];
      }
  }

  // Get data for Month
  if (month[managerIndex]) {
      for (const key in month[managerIndex]) {
        if (typeof month[managerIndex][key] === 'number') {
          // Format the number if it's a number
          managerData[`month_${key}`] = formatNumberToIndianFormat(month[managerIndex][key]);
      } else {
          // Otherwise, keep the value as it is
          managerData[`month_${key}`] = month[managerIndex][key];
      }
          // marketData[`Month_${key}`] = month[marketIndex][key];
      }
  }

  // Get data for Year
  if (year[managerIndex]) {
      for (const key in year[managerIndex]) {
        if (typeof year[managerIndex][key] === 'number') {
          // Format the number if it's a number
          managerData[`ytd_${key}`] = formatNumberToIndianFormat(year[managerIndex][key]);
      } else {
          // Otherwise, keep the value as it is
          managerData[`ytd_${key}`] = year[managerIndex][key];
      }
          // marketData[`Year_${key}`] = year[marketIndex][key];
      }
  }

  return managerData;
};





const [NewAccountManagerColDef, setNewAccountManagerColDef] = useState([
  { headerName: '',
  headerClass: 'main-header vertical-line', // Apply custom class to main header
   children: [
  // {headerName: 'Markets', field: 'AllMarkets_Allmarkets', headerClass: 'additional-header vertical-line',cellClassRules: 'vertical-line',  suppressSizeToFit: true,flex:1,autoHeight:true,},
  { 
    headerName: 'Managers', 
    headerClass: 'additional-header vertical-line',
    field: 'accountManagerID_first_name', 
    cellClass: params => 'vertical-line-cell',
    suppressSizeToFit: true,  
   width:'200px',
    autoHeight: true 
},
   ]},
  
   { headerName: 'TODAY',
   headerClass: 'main-header vertical-line', // Apply custom class to main header
    children: [
  {headerName: 'OCC', field: 'day_nights', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'130px',autoHeight:true,},
  {headerName: 'Room Rev', field: 'day_roomRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
  {headerName: 'F&B Rev', field: 'day_fnbRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true, width:'180px',autoHeight:true,},
  {headerName: 'ARR', field: 'day_avgRoomRevenue', headerClass: 'additional-header vertical-line', cellClass: 'vertical-line',  suppressSizeToFit: true, flex:1,autoHeight:true,},
   ]},
   { headerName: 'MTD',
   headerClass: 'main-header vertical-line', // Apply custom class to main header
    children: [
  {headerName: 'OCC', field: 'month_nights', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'130px',autoHeight:true,},
  {headerName: 'Room Rev', field: 'month_roomRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
  {headerName: 'F&B Rev', field: 'month_fnbRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true, width:'180px',autoHeight:true,},
  {headerName: 'ARR', field: 'month_avgRoomRevenue', headerClass: 'additional-header vertical-line', cellClass: 'vertical-line',  suppressSizeToFit: true, flex:1,autoHeight:true,},
   ]},
   { headerName: 'YTD',
   headerClass: 'main-header vertical-line', // Apply custom class to main header
    children: [
  {headerName: 'OCC', field: 'ytd_nights', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'130px',autoHeight:true,},
  {headerName: 'Room Rev', field: 'ytd_roomRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true,  width:'180px',autoHeight:true,},
  {headerName: 'F&B Rev', field: 'ytd_fnbRevenue', headerClass: 'additional-header', cellClass: 'vertical-line',  suppressSizeToFit: true, width:'180px',autoHeight:true,},
  {headerName: 'ARR', field: 'ytd_avgRoomRevenue', headerClass: 'additional-header vertical-line', cellClass: 'vertical-line',  suppressSizeToFit: true, flex:1,autoHeight:true,},
   ]}

]);


const getAccountManagerWiseSales = (date,accountManagerID) =>{
  // getAccountManagerWiseSales
  fetch(DASHBOARD_URL + `/getAccountManagerWiseSales?hotelID=1&date=${date}&accountManagerID=${accountManagerID}`)

  .then((result) => result.json())
  .then((response) => {
      if(response['statusCode']==200){
      
     

const totals1 = {
  nights: formatNumberToIndianFormat(response.data.Month.reduce((sum, row) => sum + (row.nights || 0), 0)),
  roomRevenue: formatNumberToIndianFormat(response.data.Month.reduce((sum, row) => sum + (row.roomRevenue || 0), 0)),
  fnbRevenue:formatNumberToIndianFormat(response.data.Month.reduce((sum, row) => sum + (row.fnbRevenue || 0), 0)),
  avgRoomRevenue:formatNumberToIndianFormat(response.data.Month.reduce((sum, row) => sum + (row.roomRevenue || 0), 0)/response.data.Month.reduce((sum, row) => sum + (row.nights || 0), 0)),
  first_name: 'Total'
};

// totals1['avgRoomRevenue'] = formatNumberToIndianFormat(totals1['roomRevenue']/totals1['nights'])
// totals1['nights'] = formatNumberToIndianFormat(totals1['nights'])
// totals1['roomRevenue'] = formatNumberToIndianFormat(totals1['roomRevenue'])
// totals1['fnbRevenue'] = formatNumberToIndianFormat(totals1['fnbRevenue'])





setPinnedBottomRowData1([totals1]);
const formattedMonth = response.data.Month.map(item => {
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
setDataMonthwise(formattedMonth);

const totals2 = {
  nights: formatNumberToIndianFormat(response.data.Year.reduce((sum, row) => sum + (row.nights || 0), 0)),
  roomRevenue: formatNumberToIndianFormat(response.data.Year.reduce((sum, row) => sum + (row.roomRevenue || 0), 0)),
  fnbRevenue: formatNumberToIndianFormat(response.data.Year.reduce((sum, row) => sum + (row.fnbRevenue || 0), 0)),
  avgRoomRevenue: formatNumberToIndianFormat(response.data.Year.reduce((sum, row) => sum + (row.roomRevenue || 0), 0)/response.data.Year.reduce((sum, row) => sum + (row.nights || 0), 0)),
  first_name: 'Total'
};


setPinnedBottomRowData2([totals2]);
const formattedYear = response.data.Year.map(item => {
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
 
    setDataYearWise(formattedYear);
   




      }
// setLoadingVar(false)
})

.catch((error) => {
    console.error('Error fetching Forecast data:', error);
});
}


const cellClickedListener = useCallback(event => {
  console.log(event)
  getAccountManagerWiseSales(event.data.day_date,event.data.accountManagerID_id)

  setAccountData(true);

}, []); // Ensure to include all dependencies in the dependencies array


const [ColDef2, setColDef2] = useState([
  {headerName: 'Account Manager', field: 'first_name',  suppressSizeToFit: true,  width:'300px',wrapText: true,autoHeight:true},

  {headerName: 'Company', field: 'accountName',  suppressSizeToFit: true,  width:'450px',wrapText: true,autoHeight:true},

  {headerName: 'OCC', field: 'nights',  suppressSizeToFit: true, width:'180px',wrapText: true,autoHeight:true},
  {headerName: 'Room Rev', field: 'roomRevenue',  suppressSizeToFit: true, flex:1,wrapText: true,autoHeight:true},
  {headerName: 'F&B Rev', field: 'fnbRevenue',  suppressSizeToFit: true, flex:1,wrapText: true,autoHeight:true},
  {headerName: 'ARR', field: 'avgRoomRevenue',  supprssSizeToFit: true,width:'180px',wrapText: true,autoHeight:true},

]);




  return (
    <div>
      <Form onSubmit={handleSubmit(ConfirmSubmit)}>
        <Row className='justify-content-end'>

        <Col md='6' sm='12' className='justify-content-right' style={{'white-space': 'nowrap'}}>
  {data.length!=0 && <h1><b>Productivity Dashboard Of {formatDate(data.FromDate)}</b></h1>}
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
                    <CardTitle><h2 style={{marginBottom: '20px' ,textDecoration:'underline'}}><b>Market Productivity</b></h2></CardTitle>
                  </CardHeader>
                  <CardBody>
      <div id='grid1' style={{ height: '100%' }} className="ag-theme-alpine-dark custom-ag-grid">
      { MarketFlatData.length !=0 && <AgGridReact
                              ref={gridRef}
                              // gridOptions = {gridOptions}
                              rowData={MarketFlatData}
                              getRowStyle={getRowStyle}
                              // columnDefs={ColDef}
                              columnDefs={NewMarketColDef.map(colDef => ({...colDef}))}
                              animateRows={true}
                              rowSelection='multiple'
                              // autoGroupColumnDef={autoGroupColumnDef}
                              // groupIncludeFooter={true}
                              // groupIncludeTotalFooter={true}
                              defaultColDef={defaultColDef}
                              headerColor="ddw-primary"
                              domLayout='autoHeight'
                              pinnedBottomRowData={pinnedBottomRowData1}
                              rowHeight={40} // Set the row height
                            />}
                            </div>
                            </CardBody>
                </Card>
                {/* Source Productivity */}

                <Card>
                  <CardHeader>
                    <CardTitle><h2 style={{marginBottom: '20px' ,textDecoration:'underline'}}><b>Source Productivity</b></h2></CardTitle>
                  </CardHeader>
                  <CardBody>
      <div id='grid1' style={{ height: '100%' }} className="ag-theme-alpine-dark custom-ag-grid">
      { SourceFlatData.length !=0 && <AgGridReact
                              ref={gridRef}
                              rowData={SourceFlatData}
                              getRowStyle={getRowStyle}
                              // columnDefs={ColDef}
                              columnDefs={NewSourceColDef.map(colDef => ({...colDef}))}
                              animateRows={true}
                              rowSelection='multiple'
                              defaultColDef={defaultColDef}
                              pinnedBottomRowData={pinnedBottomRowData2}

                              headerColor="ddw-primary"
                              domLayout='autoHeight'
                              rowHeight={40} // Set the row height
                            />}
                            </div>
                            </CardBody>
                </Card>
                {/* Account Productivity */}
                <Card>
                  <CardHeader>
                    <CardTitle><h2 style={{marginBottom: '20px' ,textDecoration:'underline'}}><b>Company Productivity Top 20 In Month</b></h2>
                    <h2  style={{marginLeft: '28px' ,textDecoration:'underline'}}><b>Room</b></h2></CardTitle>
                  </CardHeader>
                  <CardBody>
      <div id='grid1' style={{ height: '100%' }} className="ag-theme-alpine-dark custom-ag-grid">
      { RoomAccountFlatData.length !=0 && <AgGridReact
                              ref={gridRef}
                              rowData={RoomAccountFlatData}
                              getRowStyle={getRowStyle}
                              // columnDefs={ColDef}
                              columnDefs={NewRoomAccColDef.map(colDef => ({...colDef}))}
                              animateRows={true}
                              rowSelection='multiple'
                              defaultColDef={defaultColDef}
                              headerColor="ddw-primary"
                              domLayout='autoHeight'
                              rowHeight={40} // Set the row height
                            />}
                            </div>
                            </CardBody>
<CardTitle> <h2  style={{marginLeft: '28px' ,textDecoration:'underline'}}><b>Food & Beverages</b></h2></CardTitle>
                            <CardBody>
      <div id='grid1' style={{ height: '60%' ,width:'60%' }} className="ag-theme-alpine-dark custom-ag-grid">
      { FnBAccountFlatData.length !=0 && <AgGridReact
                              ref={gridRef}
                              rowData={FnBAccountFlatData}
                              getRowStyle={getRowStyle}
                              // columnDefs={ColDef}
                              columnDefs={NewFnBAccColDef.map(colDef => ({...colDef}))}
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
                {/* Company Productivity By Year */}
                <Card>
                  <CardHeader>
                    <CardTitle><h2 style={{marginBottom: '20px' ,textDecoration:'underline'}}><b>Company Productivity Top 20 In Year</b></h2>
                    <h2  style={{marginLeft: '28px' ,textDecoration:'underline'}}><b>Room</b></h2></CardTitle>
                  </CardHeader>
                  <CardBody>
      <div id='grid1' style={{ height: '100%' }} className="ag-theme-alpine-dark custom-ag-grid">
      { CompanyRoomAccountFlatDataByYear.length !=0 && <AgGridReact
                              ref={gridRef}
                              rowData={CompanyRoomAccountFlatDataByYear}
                              getRowStyle={getRowStyle}
                              // columnDefs={ColDef}
                              columnDefs={NewRoomAccColDef.map(colDef => ({...colDef}))}
                              animateRows={true}
                              rowSelection='multiple'
                              defaultColDef={defaultColDef}
                              headerColor="ddw-primary"
                              domLayout='autoHeight'
                              rowHeight={40} // Set the row height
                            />}
                            </div>
                            </CardBody>
<CardTitle> <h2  style={{marginLeft: '28px' ,textDecoration:'underline'}}><b>Food & Beverages</b></h2></CardTitle>
                            <CardBody>
      <div id='grid1' style={{ height: '60%' ,width:'60%' }} className="ag-theme-alpine-dark custom-ag-grid">
      { CompanyFnBAccountFlatDataByYear.length !=0 && <AgGridReact
                              ref={gridRef}
                              rowData={CompanyFnBAccountFlatDataByYear}
                              getRowStyle={getRowStyle}
                              // columnDefs={ColDef}
                              columnDefs={NewFnBAccColDef.map(colDef => ({...colDef}))}
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
{/* Agent Productivity By Month */}
                <Card>
                  <CardHeader>
                    <CardTitle><h2 style={{marginBottom: '20px' ,textDecoration:'underline'}}><b>Agent Productivity Top 20 In Month</b></h2>
                    <h2  style={{marginLeft: '28px' ,textDecoration:'underline'}}><b>Room</b></h2></CardTitle>
                  </CardHeader>
                  <CardBody>
      <div id='grid1' style={{ height: '100%' }} className="ag-theme-alpine-dark custom-ag-grid">
      { RoomAgentFlatData.length !=0 && <AgGridReact
                              ref={gridRef}
                              rowData={RoomAgentFlatData}
                              getRowStyle={getRowStyle}
                              // columnDefs={ColDef}
                              columnDefs={NewRoomAccColDef.map(colDef => ({...colDef}))}
                              animateRows={true}
                              rowSelection='multiple'
                              defaultColDef={defaultColDef}
                              headerColor="ddw-primary"
                              domLayout='autoHeight'
                              rowHeight={40} // Set the row height
                            />}
                            </div>
                            </CardBody>
<CardTitle> <h2  style={{marginLeft: '28px' ,textDecoration:'underline'}}><b>Food & Beverages</b></h2></CardTitle>
                            <CardBody>
      <div id='grid1' style={{ height: '60%' ,width:'60%' }} className="ag-theme-alpine-dark custom-ag-grid">
      { FnBAgentFlatData.length !=0 && <AgGridReact
                              ref={gridRef}
                              rowData={FnBAgentFlatData}
                              getRowStyle={getRowStyle}
                              // columnDefs={ColDef}
                              columnDefs={NewFnBAccColDef.map(colDef => ({...colDef}))}
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
              {/* Agent Productivity By Year */}

                <Card>
                  <CardHeader>
                    <CardTitle><h2 style={{marginBottom: '20px' ,textDecoration:'underline'}}><b>Agent Productivity Top 20 In Year</b></h2>
                    <h2  style={{marginLeft: '28px' ,textDecoration:'underline'}}><b>Room</b></h2></CardTitle>
                  </CardHeader>
                  <CardBody>
      <div id='grid1' style={{ height: '100%' }} className="ag-theme-alpine-dark custom-ag-grid">
      { AgentRoomAccountFlatDataByYear.length !=0 && <AgGridReact
                              ref={gridRef}
                              rowData={AgentRoomAccountFlatDataByYear}
                              getRowStyle={getRowStyle}
                              // columnDefs={ColDef}
                              columnDefs={NewRoomAccColDef.map(colDef => ({...colDef}))}
                              animateRows={true}
                              rowSelection='multiple'
                              defaultColDef={defaultColDef}
                              headerColor="ddw-primary"
                              domLayout='autoHeight'
                              rowHeight={40} // Set the row height
                            />}
                            </div>
                            </CardBody>
<CardTitle> <h2  style={{marginLeft: '28px' ,textDecoration:'underline'}}><b>Food & Beverages</b></h2></CardTitle>
                            <CardBody>
      <div id='grid1' style={{ height: '60%' ,width:'60%' }} className="ag-theme-alpine-dark custom-ag-grid">
      { AgentFnBAccountFlatDataByYear.length !=0 && <AgGridReact
                              ref={gridRef}
                              rowData={AgentFnBAccountFlatDataByYear}
                              getRowStyle={getRowStyle}
                              // columnDefs={ColDef}
                              columnDefs={NewFnBAccColDef.map(colDef => ({...colDef}))}
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
{/* Sales Productivity */}


<Card>
                  <CardHeader>
                  <CardTitle>
      <h2 style={{ marginBottom: '20px', textDecoration: 'underline', display: 'inline' }}>
        <b>Sales Productivity</b>
      </h2>
      <h4 style={{ color: 'blue', display: 'inline', marginLeft: '10px' }}>
        (Click on the row to view in detail)
      </h4>
    </CardTitle>
                  </CardHeader>
                  <CardBody>
      <div id='grid1' style={{ height: '100%' }} className="ag-theme-alpine-dark custom-ag-grid">
      {/* { managersflatdata.length !=0 &&  */}
      {console.log(managersflatdata)}
      <AgGridReact
                              ref={gridRef}
                              rowData={managersflatdata}
                              getRowStyle={getRowStyle}
                              // columnDefs={ColDef}
                              columnDefs={NewAccountManagerColDef.map(colDef => ({...colDef}))}
                              onCellClicked={cellClickedListener}
                             
                              animateRows={true}
                              rowSelection='multiple'
                              defaultColDef={defaultColDef}
                              headerColor="ddw-primary"
                              domLayout='autoHeight'
                              rowHeight={40} // Set the row height
                            />
                            {/* } */}
                            </div>
                            </CardBody>
                </Card>



                <div>
        <Modal isOpen={accountData} toggle={() =>
          setAccountData(!accountData)} className='modal-xl'>
          <ModalHeader className='modal-lg' toggle={() =>
            setAccountData(!accountData)}> </ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
     <div style={{ width: '100%', padding: '10px' , marginBottom: '10px' }}>
        <Card>
            <CardHeader>
                <CardTitle tag="h4"><b>Month Data</b></CardTitle>
            </CardHeader>
            <CardBody>
            <div id='grid2' style={{ width: '100%', height: '100%' }} className="ag-theme-alpine-dark custom-ag-grid">
        <AgGridReact 
            ref={gridRef}
            onGridReady={onGridReady}
            rowData={datamonthwise} 
            // groupIncludeFooter={true}
            // groupIncludeTotalFooter={true}
            getRowStyle={getRowStyle}
            columnDefs={ColDef2}
            pinnedBottomRowData={pinnedBottomRowData1}

            animateRows={true} 
            rowSelection='multiple'           
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            domLayout='autoHeight'
            rowHeight={30} // Set the row height
        />
</div>
            </CardBody>
        </Card>
    </div>   

    <div style={{ width: '100%', padding: '10px' , marginBottom: '10px' }}>
        <Card>
            <CardHeader>
                <CardTitle tag="h4"><b>Year Data</b></CardTitle>
            </CardHeader>
            <CardBody>
            <div id='grid2' style={{ width: '100%', height: '100%' }} className="ag-theme-alpine-dark custom-ag-grid">
        <AgGridReact 
            ref={gridRef}
            onGridReady={onGridReady}
            rowData={datayearwise} 
            getRowStyle={getRowStyle}
            // groupIncludeFooter={true}
            // groupIncludeTotalFooter={true}
            columnDefs={ColDef2}
            pinnedBottomRowData={pinnedBottomRowData2}

            animateRows={true} 
            rowSelection='multiple'           
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            domLayout='autoHeight'
            rowHeight={30} // Set the row height
        />
</div>
            </CardBody>
        </Card>
    </div>   
            {/* <CancelForexCertificate data1={Filldata} /> */}
          </ModalBody>
        </Modal>

      </div>
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