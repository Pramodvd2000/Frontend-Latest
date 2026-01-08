// ** React Imports
import { useRef, useState } from "react";
// ** Reactstrap Imports
import {Button, Modal, ModalHeader, ModalBody,} from "reactstrap";
import Wizard from "@components/wizard";
// // ** Steps
// import CompanyInformation from "./companyInformation";
// import BTC from "./btc";
// import Booker from "./booker";
// import RateCodes from "./rateCode"
// // **Steps2
import EditCompanyInformation from "./editCompanyInformation";
// import EditBooker from "./editBooker";
// import EditBooker from "./editBookerDetails";
import EditBTC from "./editBtc"
// import RateCodeDetails from "./rateCode"
import { Card, Row, Col } from "reactstrap";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useEffect, useMemo, useCallback } from "react";
import API_URL from "../../../../../config";
// import EditbookerDetails from './editBooker'
// import RateCodeMap from "./rateCodeMap"
// import RateCodeBasicDetails from "./datagrid"


const WizardModern = (ReservationData) => {
  console.log(ReservationData.ReservationData)
    const ReservationDetails = (ReservationData.ReservationData)
    let x = ReservationData.ReservationData.companyID
    console.log(x)

  const [open, setOpen] = useState('1')
  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id); 
  };
  // console.log(data1) 
  const [filldata, setfilldata] = useState("");
  const [showEdit, editButton] = useState(false);
  const [show, actionButton] = useState(false);
  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Accounts Name",field: "accountName",suppressSizeToFit: true,maxWidth: 280,
      cellStyle: { textAlign: "center", backgroundColor: "#F1E39B" },
    },
    {
      headerName: "Account Type",  field: "accountType", suppressSizeToFit: true, maxWidth: 140,
      cellStyle: { textAlign: "center", backgroundColor: "pink" },
    },
    {
      headerName: "Country",  field: "countriesName",suppressSizeToFit: true, maxWidth: 120,
      cellStyle: { textAlign: "center", backgroundColor: "#F1E39B" },
    },
    {
      headerName: "State",  field: "state",  suppressSizeToFit: true, maxWidth: 110,
      cellStyle: { textAlign: "center", backgroundColor: "pink" },
    },
    {
      headerName: "City",   field: "city", suppressSizeToFit: true,
      maxWidth: 120, cellStyle: { textAlign: "center", backgroundColor: "#F1E39B" },
    },
    {
      headerName: "GST ID ",  field: "gstID",  suppressSizeToFit: true, maxWidth: 180,
      cellStyle: { textAlign: "center", backgroundColor: "pink" },
    },
    {
      headerName: "Action",field: "numAvlRooms",suppressSizeToFit: true, maxWidth: 120,
      cellRendererFramework: (params) => (
        <Button color="primary" onClick={() => actionButton(!show)}> View  </Button> ),
    },
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));



  //   //get Complete account details
  // useEffect(() => {
  //   fetchx(API_URL + "/getCompanyInformations?hotelID=1&companyid=314")
  //     .then((result) => result.json())
  //     .then((rowData) => setRowData(rowData["data"]));
  // }, []);

  const [rowData, setRowData] = useState(null);
  console.log(ReservationDetails)
console.log(ReservationDetails.companyID)
useEffect(() => {
  if (ReservationDetails.companyID !== null) {
    fetchx(API_URL+`/getCompanyInformations?hotelID=1&companyid=${ReservationDetails.companyID}`)
      .then((result) => {
        if (!result.ok) {
          throw new Error(`Request failed with status: ${result.status}`);
        }
        return result.json();
      })
      .then((data) => {
        if (data && data.data && data.data.length > 0) {
          setRowData(data.data[0]);
        } else {
          // Handle the case where no data is returned, e.g., setRowData to a default value
          setRowData(null); // You can also set it to an appropriate default value
        }
      })
      .catch((error) => {
        // Handle fetch errors here
        console.error('Error fetching data:', error);
        setRowData(null); // Set to null or another appropriate default value
      });
  }
}, [ReservationDetails.companyID]);   

console.log(rowData)




  // ** Ref
  const ref = useRef(null);
   // Account Details Page
  // const [stepper, setStepper] = useState(null);

  // const steps = [
  //   {
  //     id: "companyInformation", 
  //     title: " Basic Company Information",
  //     subtitle: "Enter Your Company Information.",
  //     content: (
  //       <CompanyInformation
  //         data1={filldata}
  //         stepper={stepper}
  //         type="wizard-modern"
  //       />
  //     ),
  //   },
  //   {
  //     id: "btc",
  //     title: "BTC Details",
  //     subtitle: "Add BTC Details",
  //     // icon: <User size={18} />,
  //     content: <BTC data1={filldata} stepper={stepper} type="wizard-modern" />,
  //   },
  //   {
  //     id: "booker",
  //     title: "Booker",
  //     subtitle: "Enter Booker Details",
  //     // icon: <MapPin size={18} />,
  //     content: <Booker stepper={stepper} type="wizard-modern" />,
  //   },
  //   {
  //     id: "RateCodeMap",
  //     title: "Mapping Rate Codes ",
  //     // subtitle: "Enter Booker Details",
  //     // icon: <MapPin size={18} />,
  //     content: <RateCodeMap data1={filldata}  stepper={stepper} type="wizard-modern" />,
  //   },
  //   // {
  //   //   id: "accRateCodeMap",
  //   //   title: "Account RateCode Mapping",
  //   //   // subtitle: "Enter Booker Details",
  //   //   // icon: <MapPin size={18} />,
  //   //   content: <AccountRateCodeMapping data1={filldata}  stepper={stepper} type="wizard-modern" />,
  //   // },    
  // ];
  //   //Edit Account Details Page
  const [stepper2, setstepper2] = useState(null);
  const steps2 = [
    {
      id: "companyInformation",
      title: "Company Information",
      subtitle: "Edit Your Company Information.",
      // icon: <FileText size={18} />,
      content: (
        <EditCompanyInformation
          data1={rowData}
          stepper2={stepper2}
          type="wizard-modern"
        />
      ),
    },
    {
      id: "btc",
      title: "BTC Details",
      subtitle: "Edit BTC Details",
      // icon: <User size={18} />,
      content: <EditBTC data1={rowData}  stepper2={stepper2} type="wizard-modern" />,
    },
    // {
    //   id: "editBooker",
    //   title: "Bookers",
    //   subtitle: "Edit Booker Details",
    //   // icon: <MapPin size={18} />,
    //   content: (
    //     <EditBooker data1={filldata}  stepper2={stepper2}  type="wizard-modern" />
    //   ),
    // },
    // {
    //   id: "rateCode",
    //   title: "RateCode",
    //   subtitle: "View Rate Code Details",
    //   // icon: <MapPin size={18} />,
    //   content: (
    //     <RateCodeDetails data1={filldata} stepper={stepper} type="wizard-modern" />
    //   ),
    // },  
  ];

  const onFilterTextBoxChanged = useCallback(() => {	
    gridRef.current.api.setQuickFilter(	
      document.getElementById("filter-text-box").value	
    );	
  }, []);

  return (
    <div>
      {/* /// Create Account Details /// */}
     
              {/* <div className="modern-horizontal-wizard">
                <Wizard
                  type="modern-horizontal"
                  ref={ref}
                  steps={steps}
                  options={{
                    linear: false,
                  }}
                  instance={(el) => setStepper(el)}
                />
              </div> */}
          
   
              <Card>
                <div className="modern-horizontal-wizard">
                  <Wizard
                    type="modern-horizontal"
                    ref={ref}
                    steps={steps2}
                    options={{
                      linear: false,
                    }}
                    instance={(el) => setstepper2(el)}
                  />
                </div>
              </Card>
          
    </div>
  );
};
export default WizardModern;