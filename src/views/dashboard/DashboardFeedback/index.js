// import React, { useState, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";

// import API_URL from "../../../config";
// import { Col, Row, Card, CardBody, CardHeader, CardTitle } from 'reactstrap';

// const Dashboard = () => {
//   const [feedbackData, setFeedbackData] = useState([]);
//   console.log("Came inside")

//   useEffect(() => {
//     fetch(API_URL + "/getAddedFeedBackFOrDashboard")
//       .then((res) => res.json())
//       .then((postres) => {
//         if (postres.statusCode === 200) {
//           setFeedbackData(postres["data"]);

//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   const columns = [
//     { headerName: "Feedback Category", field: "name", flex: 2 },
//     { headerName: "Total Responses", field: "total", flex: 1 },
//     {
//       headerName: "Satisfaction (%)",
//       field: "percentage",
//       flex: 1,
//       cellStyle: { textAlign: "center" }
//     },
//   ];

//   console.log(feedbackData)

//   const CustomTick = (props) => {
//     const { x, y, payload } = props;
//     const words = payload.value.split(' '); // Splitting by space for wrapping

//     return (
//       <g transform={`translate(${x},${y}) rotate(-30)`}> {/* Rotates text at -30 degrees */}
//         <text textAnchor="end" fontSize={12} fill="#666">
//           {words.map((word, index) => (
//             <tspan key={index} x={0} dy={index * 12}>
//               {word}
//             </tspan>
//           ))}
//         </text>
//       </g>
//     );
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Feedback Dashboard</h2>

//       {/* AG Grid Table */}
//       {feedbackData.length > 0 && <div className="ag-theme-alpine" style={{ height: "300px", marginBottom: "20px" }}>
//         <AgGridReact
//           rowData={feedbackData}
//           columnDefs={columns}
//           pagination={true}
//           paginationPageSize={5}
//           domLayout="autoHeight"
//         />
//       </div>}

//       {/* Chart */}
//       {/* {feedbackData.length > 0 &&
//         <Card>
//           <CardBody>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={feedbackData}>
//               <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="percentage" fill="#8884d8" />
//             </BarChart>
//           </ResponsiveContainer>
//           </CardBody>
//         </Card>
//       } */}
//       {feedbackData.length > 0 && (
//   <Card>
//     <CardBody>
//       <ResponsiveContainer width="100%" height={400}>
//         <BarChart 
//           data={feedbackData} 
//           margin={{ bottom: 120 }}
//           barCategoryGap={feedbackData.length > 7 ? '20%' : '80%'} // Adjust bar width dynamically
//         >
//           <XAxis 
//             dataKey="name" 
//             tick={{ fontSize: 12 }} 
//             angle={-35} 
//             textAnchor="end" 
//             interval={0} 
//           />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="percentage" fill="#8884d8" />
//         </BarChart>
//       </ResponsiveContainer>
//     </CardBody>
//   </Card>



// )}

//     </div>
//   );
// };

// export default Dashboard;



// import React, { useState, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import GaugeChart from "react-gauge-chart"; // Import Gauge Chart
// import API_URL from "../../../config";
// import { Col, Row, Card, CardBody } from "reactstrap";

// const Dashboard = () => {
//   const [feedbackData, setFeedbackData] = useState([]);

//   useEffect(() => {
//     fetch(API_URL + "/getAddedFeedBackFOrDashboard")
//       .then((res) => res.json())
//       .then((postres) => {
//         if (postres.statusCode === 200) {
//           setFeedbackData(postres["data"]);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   const columns = [
//     { headerName: "Feedback Category", field: "name", flex: 2 },
//     { headerName: "Total Responses", field: "total", flex: 1 },
//     {
//       headerName: "Satisfaction (%)",
//       field: "percentage",
//       flex: 1,
//       cellStyle: { textAlign: "center" },
//     },
//   ];

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Feedback Dashboard</h2>

//       {/* AG Grid Table */}
//       {feedbackData.length > 0 && (
//         <div className="ag-theme-alpine" style={{ height: "300px", marginBottom: "20px" }}>
//           <AgGridReact
//             rowData={feedbackData}
//             columnDefs={columns}
//             pagination={true}
//             paginationPageSize={5}
//             domLayout="autoHeight"
//           />
//         </div>
//       )}

//       {/* Gauge Charts */}
//       {feedbackData.length > 0 && (
//         <Row>
//           {feedbackData.map((item, index) => (
//             <Col md={4} key={index}>
//               <Card className="text-center mb-3">
//                 <CardBody>
//                   <h5>{item.name}</h5>
//                   <GaugeChart
//                     id={`gauge-chart-${index}`}
//                     percent={item.percentage / 100} // Convert percentage to decimal
//                     hideText={false}
//                     textColor="transparent"
//                     needleBaseColor="#F35725"
//                     arcPadding={0.0}
//                     cornerRadius={0}
//                     arcWidth={0.5}
//                     formatTextValue={(value) => `${value}%`}
//                     needleColor="#2a2c36"
//                     colors={["#ff6384", "#ffce56", "#2b806a"]} // Red, Yellow, Green
//                     arcsLength={[0.35, 0.45, 0.2]} // Color distribution
//                   />
// <h6>Satisfaction: {Number(item.percentage).toFixed(2)}%</h6>
// </CardBody>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


// import React, { useState, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import GaugeChart from "react-gauge-chart"; // Import Gauge Chart
// import API_URL from "../../../config";
// import { Col, Row, Card, CardBody } from "reactstrap";

// const Dashboard = () => {
//   const [feedbackData, setFeedbackData] = useState([]);

//   useEffect(() => {
//     fetch(API_URL + "/getAddedFeedBackFOrDashboard")
//       .then((res) => res.json())
//       .then((postres) => {
//         if (postres.statusCode === 200) {
//           setFeedbackData(postres["data"]);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   // Group feedback data by departmentName
//   const groupedData = feedbackData.reduce((acc, item) => {
//     const { departmentName } = item;
//     if (!acc[departmentName]) {
//       acc[departmentName] = [];
//     }
//     acc[departmentName].push(item);
//     return acc;
//   }, {});

//   const columns = [
//     { headerName: "Department", field: "departmentName", flex: 2 },
//     { headerName: "Feedback Category", field: "name", flex: 2 },
//     { headerName: "Total Responses", field: "total", flex: 1 },
//     {
//       headerName: "Satisfaction (%)",
//       field: "percentage",
//       flex: 1,
//       cellStyle: { textAlign: "center" },
//     },
//   ];

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Feedback Dashboard</h2>

//       {/* AG Grid Table */}
//       {/* {feedbackData.length > 0 && (
//         <div className="ag-theme-alpine" style={{ height: "300px", marginBottom: "20px" }}>
//           <AgGridReact
//             rowData={feedbackData}
//             columnDefs={columns}
//             pagination={true}
//             paginationPageSize={5}
//             domLayout="autoHeight"
//           />
//         </div>
//       )} */}

//       {/* Gauge Charts Grouped by Department */}
//       {Object.keys(groupedData).map((department, index) => (
//         <div key={index} style={{ marginBottom: "30px" }}>
//           <h4>{department}</h4>
//           <Row>
//             {groupedData[department].map((item, idx) => (
//               <Col md={4} key={idx}>
//                 <Card className="text-center mb-3">
//                   <CardBody>
//                     <h5>{item.name}</h5>
//                     <GaugeChart
//                       id={`gauge-chart-${department}-${idx}`}
//                       percent={item.percentage / 100} // Convert percentage to decimal
//                       hideText={false}
//                       textColor="transparent"
//                       needleBaseColor="#F35725"
//                       arcPadding={0.0}
//                       cornerRadius={0}
//                       arcWidth={0.5}
//                       formatTextValue={(value) => `${value}%`}
//                       needleColor="#2a2c36"
//                       colors={["#ff6384", "#ffce56", "#2b806a"]} // Red, Yellow, Green
//                       arcsLength={[0.35, 0.45, 0.2]} // Color distribution
//                     />
//                     <h6>Satisfaction: {Number(item.percentage).toFixed(2)}%</h6>
//                   </CardBody>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Dashboard;


// import React, { useState, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import GaugeChart from "react-gauge-chart"; // Import Gauge Chart
// import API_URL from "../../../config";
// import { Col, Row, Card, CardBody } from "reactstrap";

// const Dashboard = () => {
//   const [feedbackData, setFeedbackData] = useState([]);

//   useEffect(() => {
//     fetch(API_URL + "/getAddedFeedBackFOrDashboard")
//       .then((res) => res.json())
//       .then((postres) => {
//         if (postres.statusCode === 200) {
//           setFeedbackData(postres["data"]);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   // Group feedback data by departmentName
//   const groupedData = feedbackData.reduce((acc, item) => {
//     const { departmentName } = item;
//     if (!acc[departmentName]) {
//       acc[departmentName] = [];
//     }
//     acc[departmentName].push(item);
//     return acc;
//   }, {});

//   const columns = [
//     { headerName: "Department", field: "departmentName", flex: 2 },
//     { headerName: "Feedback Category", field: "name", flex: 2 },
//     { headerName: "Total Responses", field: "total", flex: 1 },
//     {
//       headerName: "Satisfaction (%)",
//       field: "percentage",
//       flex: 1,
//       cellStyle: { textAlign: "center" },
//     },
//   ];

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Feedback Dashboard</h2>

//       {/* Gauge Charts Grouped by Department */}
//       {Object.keys(groupedData).map((department, index) => (
//         <div key={index} style={{ marginBottom: "30px" }}>
//           <h4>{department}</h4>
//           <Row>
//             {groupedData[department].map((item, idx) => (
//               <Col md={4} key={idx} style={{ display: "flex", padding: "0 10px" }}>
//                 <Card className="text-center mb-3" style={{ width: "100%" }}>
//                   <CardBody>
//                     <h5>{item.name}</h5>
//                     <GaugeChart
//                       id={`gauge-chart-${department}-${idx}`}
//                       percent={item.percentage / 100} // Convert percentage to decimal
//                       hideText={false}
//                       textColor="transparent"
//                       needleBaseColor="#F35725"
//                       arcPadding={0.0}
//                       cornerRadius={0}
//                       arcWidth={0.5}
//                       formatTextValue={(value) => `${value}%`}
//                       needleColor="#2a2c36"
//                       colors={["#ff6384", "#ffce56", "#2b806a"]} // Red, Yellow, Green
//                       arcsLength={[0.35, 0.45, 0.2]} // Color distribution
//                     />
//                     <h6>Satisfaction: {Number(item.percentage).toFixed(2)}%</h6>
//                   </CardBody>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import GaugeChart from "react-gauge-chart";
import API_URL from "../../../config";
import { Card, CardBody } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { Label, Input, Row, Col } from "reactstrap";
import Moment from 'moment';
import { format } from 'date-fns';
const Dashboard = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [Today, setToday] = useState()


  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
    watch
  } = useForm({});

  useEffect(() => {
    const hotelIDData = JSON.stringify({
      hotelID: 1
    })
    fetchx(API_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelIDData
    }).then((res) => res.json())
      .then(postres => {
        const today = new Date(postres['data'][0]['businessDate']);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
      })
  }, []);


  const fromDate = watch('fromDate');
  const toDate = watch('toDate');
  const options = {
    minDate: Today
  };
  const optionsToDate = {
    minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
  };

  useEffect(() => {
    fetch(API_URL + "/getAddedFeedBackFOrDashboard")
      .then((res) => res.json())
      .then((postres) => {
        if (postres.statusCode === 200) {
          setFeedbackData(postres["data"]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {

    // Call the function whenever both fromDate and toDate are filled
    if (fromDate !== undefined && toDate !== undefined) {
      setFeedbackData([])

      if (Array.isArray(fromDate) && Array.isArray(toDate) &&
        fromDate.length !== 0 && toDate.length !== 0 &&
        fromDate[0] !== '' && toDate[0] !== '') {
        let fromDateFormat = fromDate !== '' ? format(new Date(fromDate), 'yyyy-MM-dd') : '';
        let toDateFormat = toDate !== '' ? format(new Date(toDate), 'yyyy-MM-dd') : '';
        fetch(API_URL + "/getAddedFeedBackFOrDashboard?fromDate=" + fromDateFormat + "&toDate=" + toDateFormat)
          .then((result) => result.json())
          .then((rowData) => {
            setFeedbackData(rowData["data"]);
            // console.log(rowData)
          });
      }
      else {
        fetch(API_URL + "/getAddedFeedBackFOrDashboard")
          .then((result) => result.json())
          .then((rowData) => {
            setFeedbackData(rowData["data"]);
            // console.log(rowData)
          });
      }
    }
  }, [fromDate, toDate]);




  // Mock data based on the image
  // const mockData = [
  //   { departmentName: "Hotel", name: "Overall Satisfaction", percentage: 80.00 },
  //   { departmentName: "Hotel", name: "Overall sustainability initiatives by the hotel", percentage: 60.00 },
  //   { departmentName: "Front Office", name: "Overall Arrival Experience", percentage: 82.86 },
  //   { departmentName: "Housekeeping", name: "Overall Room Experience", percentage: 78.50 },
  //   // Add more mock data as needed
  // ];

  const mockData = feedbackData.map(item => item.name);

  // Use mock data if feedbackData is empty
  const displayData = feedbackData.length > 0 ? feedbackData : mockData;

  // Group feedback data by departmentName
  const groupedData = displayData.reduce((acc, item) => {
    const { departmentName } = item;
    if (!acc[departmentName]) {
      acc[departmentName] = [];
    }
    acc[departmentName].push(item);
    return acc;
  }, {});


  
  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "20px", color: "#333" }}>Feedback Dashboard</h2>

      {/* Departments with Gauge Charts */}
      {/* {Object.keys(groupedData).map((department, index) => (
        <div key={index} style={{ marginBottom: "30px" }}>
          <h3 style={{ 
            color: "#555", 
            marginBottom: "15px", 
            fontSize: "20px", 
            fontWeight: "500" 
          }}>
            {department}
          </h3>
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "20px", 
            marginBottom: "10px" 
          }}>
            {groupedData[department].map((item, idx) => (
              <Card 
                key={idx} 
                style={{ 
                  width: "420px", 
                  borderRadius: "8px", 
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)", 
                  border: "none" 
                }}
              >
                <CardBody className="text-center">
                  <h5 style={{ 
                    fontSize: "16px", 
                    marginBottom: "15px", 
                    color: "#444",
                    textAlign: "center"
                  }}>
                    {item.name}
                  </h5>
                  <GaugeChart
                    id={`gauge-chart-${department}-${idx}`}
                    percent={item.percentage / 100}
                    hideText={true}
                    needleBaseColor="#ff6900"
                    needleColor="#333"
                    arcPadding={0.02}
                    cornerRadius={3}
                    arcWidth={0.25}
                    colors={["#ff6384", "#ffce56", "#2b806a"]}
                    arcsLength={[0.33, 0.33, 0.34]}
                    marginInPercent={0.05}
                    animate={true}
                  />
                  <p style={{ 
                    marginTop: "10px", 
                    fontSize: "15px", 
                    color: "#555", 
                    fontWeight: "500"
                  }}>
               <h6>Satisfaction: {Number(item.percentage).toFixed(2)}%</h6>

                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      ))} */}

      {/* <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "start" }}>
  {Object.keys(groupedData).map((department, index) => (
    <div key={index} style={{ marginBottom: "30px" }}>
      <h3
        style={{
          color: "#555",
          marginBottom: "15px",
          fontSize: "20px",
          fontWeight: "500",
          width: "100%", // Ensures header does not interfere with flex layout
        }}
      >
        {department}
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {groupedData[department].map((item, idx) => (
          <Card
            key={idx}
            style={{
              width: "420px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <CardBody className="text-center">
              <h5
                style={{
                  fontSize: "16px",
                  marginBottom: "15px",
                  color: "#444",
                  textAlign: "center",
                }}
              >
                {item.name}
              </h5>
              <GaugeChart
                id={`gauge-chart-${department}-${idx}`}
                percent={item.percentage / 100}
                hideText={true}
                needleBaseColor="#ff6900"
                needleColor="#333"
                arcPadding={0.02}
                cornerRadius={3}
                arcWidth={0.25}
                colors={["#ff6384", "#ffce56", "#2b806a"]}
                arcsLength={[0.33, 0.33, 0.34]}
                marginInPercent={0.05}
                animate={true}
              />
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "15px",
                  color: "#555",
                  fontWeight: "500",
                }}
              >
                <h6>Satisfaction: {Number(item.percentage).toFixed(2)}%</h6>
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  ))}
</div> */}


      <div>
        <Row>

          <Col md='2' sm='12' className='mb-1'>
            <div className="mb-1">
              <Label className="form-label" for="fromDate">
                From Date
              </Label>
              <Controller
                control={control}
                id='fromDate'
                name='fromDate'
                render={({ field }) => (
                  <Flatpickr
                    // required
                    options={options}
                    placeholder='YYYY-MM-DD'
                    {...field}
                    className='form-control'

                  />
                )}
              />
            </div>
          </Col>
          <Col md='2' sm='12' className='mb-1'>
            <div className='mb-1'>
              <Label className='form-label' for='toDate'>
                To Date
              </Label>
              <Controller
                control={control}
                id='toDate'
                name='toDate'
                render={({ field }) => (
                  <Flatpickr
                    placeholder='YYYY-MM-DD'
                    {...field}
                    options={optionsToDate}
                    // options={{ allowInput: true }}
                    className='form-control'

                  />
                )}
              />
            </div>
          </Col>
        </Row>
      </div>

      {Object.keys(groupedData).length > 0 ? (

        // <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        //   {groupedData && Object.keys(groupedData).map((department, index) => (
        //     <div key={index} style={{ width: "100%", marginBottom: "30px" }}>
        //       {/* Department Name Centered */}
        //       <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
        //         <h3
        //           style={{
        //             color: "#555",
        //             fontSize: "20px",
        //             fontWeight: "500",
        //             textAlign: "center",
        //             color: '#0000ff'
        //           }}
        //         >
        //           {department}
        //         </h3>
        //       </div>

        //       {/* Gauge Charts in a Row */}
        //       <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
        //         {console.log(groupedData)}
        //         {groupedData && groupedData[department].map((item, idx) => (
        //           <Card
        //             key={idx}
        //             style={{
        //               width: "420px",
        //               borderRadius: "8px",
        //               boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        //               border: "none",
        //             }}
        //           >
        //             <CardBody className="text-center">
        //               <h5
        //                 style={{
        //                   fontSize: "16px",
        //                   marginBottom: "15px",
        //                   color: "#444",
        //                   textAlign: "center",
        //                 }}
        //               >
        //                 {item.name}
        //               </h5>
        //               <GaugeChart
        //                 id={`gauge-chart-${department}-${idx}`}
        //                 percent={item.percentage / 100}
        //                 hideText={true}
        //                 needleBaseColor="#ff6900"
        //                 needleColor="#333"
        //                 arcPadding={0.02}
        //                 cornerRadius={3}
        //                 arcWidth={0.25}
        //                 colors={["#ff6384", "#ffce56", "#2b806a"]}
        //                 arcsLength={[0.33, 0.33, 0.34]}
        //                 marginInPercent={0.05}
        //                 animate={true}
        //               />
        //               <p
        //                 style={{
        //                   marginTop: "10px",
        //                   fontSize: "15px",
        //                   color: "#555",
        //                   fontWeight: "500",
        //                 }}
        //               >
        //                 <h6>Satisfaction: {Number(item.percentage).toFixed(2)}%</h6>
        //               </p>
        //             </CardBody>
        //           </Card>
        //         ))}
        //       </div>
        //     </div>

        //   ))}
        // </div>

//         <div
//   style={{
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "20px",
//     justifyContent: "center",
//   }}
// >
//   {Object.keys(groupedData).flatMap((department) =>
//     groupedData[department].map((item, idx) => (
//       <Card
//         key={`${department}-${idx}`}
//         style={{
//           width: "420px",
//           borderRadius: "8px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//           border: "none",
//         }}
//       >
//         <CardBody className="text-center">
//           <h5
//             style={{
//               fontSize: "16px",
//               marginBottom: "15px",
//               color: "#444",
//               textAlign: "center",
//             }}
//           >
//             {department} - {item.name}
//           </h5>
//           <GaugeChart
//             id={`gauge-chart-${department}-${idx}`}
//             percent={item.percentage / 100}
//             hideText={true}
//             needleBaseColor="#ff6900"
//             needleColor="#333"
//             arcPadding={0.02}
//             cornerRadius={3}
//             arcWidth={0.25}
//             colors={["#ff6384", "#ffce56", "#2b806a"]}
//             arcsLength={[0.33, 0.33, 0.34]}
//             marginInPercent={0.05}
//             animate={true}
//           />
//           <p
//             style={{
//               marginTop: "10px",
//               fontSize: "15px",
//               color: "#555",
//               fontWeight: "500",
//             }}
//           >
//             <h6>Satisfaction: {Number(item.percentage).toFixed(2)}%</h6>
//           </p>
//         </CardBody>
//       </Card>
//     ))
//   )}
// </div>


<div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "start" }}>
  {Object.entries(groupedData).map(([department, charts]) => (
    <Card
      key={department}
      style={{
        width: "max-content",
        minWidth: "460px",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        border: "1px solid #ddd",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Department Name - Centered above its charts */}
      <div
        style={{
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "bold",
          textTransform: "uppercase",
          color: "#0000ff",
          marginBottom: "15px",
        }}
      >
        {department}
      </div>

      {/* Gauge Charts inside the Department Card */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "flex-start" }}>
        {charts.map((item, idx) => (
          <Card
            key={`${department}-${idx}`}
            style={{
              width: "420px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border: "none",
              textAlign: "center",
            }}
          >
            <CardBody>
              <h5 style={{ fontSize: "16px", marginBottom: "15px", color: "#444" }}>
                {item.name}
              </h5>
              <GaugeChart
                id={`gauge-chart-${department}-${idx}`}
                percent={item.percentage / 100}
                hideText={true}
                needleBaseColor="#ff6900"
                needleColor="#333"
                arcPadding={0.02}
                cornerRadius={3}
                arcWidth={0.25}
                colors={["#ff6384", "#ffce56", "#2b806a"]}
                arcsLength={[0.33, 0.33, 0.34]}
                marginInPercent={0.05}
                animate={true}
              />
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "15px",
                  color: "#555",
                  fontWeight: "500",
                }}
              >
                <h6>Satisfaction: {Number(item.percentage).toFixed(2)}%</h6>
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </Card>
  ))}
</div>


// {/* <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "start" }}>
// {Object.entries(groupedData).map(([department, charts]) => (
//   <Card
//     key={department}
//     style={{
//       width: `${charts.length * 440}px`, // Adjust width dynamically
//       minWidth: "460px",
//       padding: "20px",
//       borderRadius: "12px",
//       boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
//       border: "1px solid #ddd",
//       background: "#fff",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//     }}
//   >
//     {/* Department Name - Centered above its charts */}
//     <div
//       style={{
//         textAlign: "center",
//         fontSize: "20px",
//         fontWeight: "bold",
//         textTransform: "uppercase",
//         color: "#0000ff",
//         marginBottom: "15px",
//       }}
//     >
//       {department}
//     </div>

//     {/* Gauge Charts inside the Department Card */}
//     <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
//       {charts.map((item, idx) => (
//         <Card
//           key={`${department}-${idx}`}
//           style={{
//             width: "420px",
//             borderRadius: "8px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//             border: "none",
//             textAlign: "center",
//           }}
//         >
//           <CardBody>
//             <h5 style={{ fontSize: "16px", marginBottom: "15px", color: "#444" }}>
//               {item.name}
//             </h5>
//             <GaugeChart
//               id={`gauge-chart-${department}-${idx}`}
//               percent={item.percentage / 100}
//               hideText={true}
//               needleBaseColor="#ff6900"
//               needleColor="#333"
//               arcPadding={0.02}
//               cornerRadius={3}
//               arcWidth={0.25}
//               colors={["#ff6384", "#ffce56", "#2b806a"]}
//               arcsLength={[0.33, 0.33, 0.34]}
//               marginInPercent={0.05}
//               animate={true}
//             />
//             <p
//               style={{
//                 marginTop: "10px",
//                 fontSize: "15px",
//                 color: "#555",
//                 fontWeight: "500",
//               }}
//             >
//               <h6>Satisfaction: {Number(item.percentage).toFixed(2)}%</h6>
//             </p>
//           </CardBody>
//         </Card>
//       ))}
//     </div>
//   </Card>
// ))}
// </div> */}

// {/* <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "start" }}>
// {Object.entries(groupedData).map(([department, charts]) => (
//   <div
//     key={department}
//     style={{
//       display: "flex",
//       flexWrap: "wrap",
//       gap: "20px",
//       alignItems: "center",
//       position: "relative",
//     }}
//   >
//     {/* Department Name - Centered above all its charts */}
//     <div
//       style={{
//         width: `${charts.length * 420}px`, // Adjust width dynamically
//         textAlign: "center",
//         position: "absolute",
//         top: "-25px", // Moves name above charts
//         left: "50%",
//         transform: "translateX(-50%)",
//         fontSize: "18px",
//         fontWeight: "bold",
//         textTransform: "uppercase",
//         color: '#0000ff'      }}
//     >
//       {department}
//     </div>

//     {/* Gauge Charts */}
//     {charts.map((item, idx) => (
//       <Card
//         key={`${department}-${idx}`}
//         style={{
//           width: "420px",
//           borderRadius: "8px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//           border: "none",
//           textAlign: "center",
//         }}
//       >
//         <CardBody>
//           <h5 style={{ fontSize: "16px", marginBottom: "15px", color: "#444" }}>
//             {item.name}
//           </h5>
//           <GaugeChart
//             id={`gauge-chart-${department}-${idx}`}
//             percent={item.percentage / 100}
//             hideText={true}
//             needleBaseColor="#ff6900"
//             needleColor="#333"
//             arcPadding={0.02}
//             cornerRadius={3}
//             arcWidth={0.25}
//             colors={["#ff6384", "#ffce56", "#2b806a"]}
//             arcsLength={[0.33, 0.33, 0.34]}
//             marginInPercent={0.05}
//             animate={true}
//           />
//           <p
//             style={{
//               marginTop: "10px",
//               fontSize: "15px",
//               color: "#555",
//               fontWeight: "500",
//             }}
//           >
//             <h6>Satisfaction: {Number(item.percentage).toFixed(2)}%</h6>
//           </p>
//         </CardBody>
//       </Card>
//     ))}
//   </div>
// ))}
// </div> */}
// {/* <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "start" }}>
//   {Object.keys(groupedData).map((department) => (
//     <div key={department} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//       {/* Department Title - Centered above charts */}
//       <h4
//         style={{
//           fontSize: "18px",
//           marginBottom: "10px",
//           fontWeight: "bold",
//           textTransform: "uppercase",
//           color: "#333",
//           width: "100%",
//           textAlign: "center",
//         }}
//       >
//         {department}
//       </h4>

//       {groupedData[department].map((item, idx) => (
//         <Card
//           key={`${department}-${idx}`}
//           style={{
//             width: "420px",
//             borderRadius: "8px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//             border: "none",
//             textAlign: "center",
//           }}
//         >
//           <CardBody>
//             <h5 style={{ fontSize: "16px", marginBottom: "15px", color: "#444" }}>
//               {item.name}
//             </h5>
//             <GaugeChart
//               id={`gauge-chart-${department}-${idx}`}
//               percent={item.percentage / 100}
//               hideText={true}
//               needleBaseColor="#ff6900"
//               needleColor="#333"
//               arcPadding={0.02}
//               cornerRadius={3}
//               arcWidth={0.25}
//               colors={["#ff6384", "#ffce56", "#2b806a"]}
//               arcsLength={[0.33, 0.33, 0.34]}
//               marginInPercent={0.05}
//               animate={true}
//             />
//             <p
//               style={{
//                 marginTop: "10px",
//                 fontSize: "15px",
//                 color: "#555",
//                 fontWeight: "500",
//               }}
//             >
//               <h6>Satisfaction: {Number(item.percentage).toFixed(2)}%</h6>
//             </p>
//           </CardBody>
//         </Card>
//       ))}
//     </div>
//   ))}
// </div> */}

      ) : (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
          fontSize: "20px",
          color: "#999"
        }}>
          <b style={{ color: '#0000ff' }}> No Data Available</b>
        </div>
      )}
    </div>
  );
};

export default Dashboard;