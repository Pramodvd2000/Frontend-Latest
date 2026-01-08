// import { useState } from 'react'
// import classnames from 'classnames'
// import Flatpickr from 'react-flatpickr'
// import 'cleave.js/dist/addons/cleave-phone.us'
// import { useForm, Controller } from 'react-hook-form'
// import Moment from 'moment'
// import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader,Input, InputGroup, InputGroupText } from 'reactstrap'
// import '@styles/react/libs/flatpickr/flatpickr.scss'
// import '@styles/react/libs/react-select/_react-select.scss'
// import '@styles/react/pages/page-form-validation.scss'
// import 'ag-grid-enterprise'
// import { AgGridReact } from 'ag-grid-react'
// import '/node_modules/ag-grid-community/styles/ag-grid.css'
// import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
// import { useRef, useEffect, useMemo, useCallback} from 'react';
// import DASHBOARD_URL from '../../../../dashboard'
// import Logo from '../oterra.jpg'
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// const defaultValues = { 
//   frmdate: ''
// }
// const Anniversary = () => {
//   const [rowData1, setRowData1] = useState();
//   const gridRef = useRef();
//   const [data, setData] = useState(null)
//   const [flag, setFlag] = useState(false)
//   const { reset, handleSubmit, control,watch } = useForm({ defaultValues })
//   const frmdate = watch('frmdate');
//   const optionsToDate = {
//     minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD')) 
//   };
//   const [flag1, setflag1] = useState(false)
//    const [columnDefs, setColumnDefs] = useState([
//     {headerName: 'Room No.',field: 'roomNumber',suppressSizeToFit: true, maxWidth: 130 },
//     {headerName: 'Guest Name ',field: 'guestName',suppressSizeToFit: true, maxWidth: 210 , wrapText: true,autoHeight:true,},
//     {headerName: 'Company',  field: 'accountName',suppressSizeToFit: true, maxWidth: 200 , wrapText: true,autoHeight:true,},
//     {headerName: 'Arrival Date',field: 'arrivalDate',suppressSizeToFit: true, maxWidth: 160 ,
//     cellRenderer: (params) => {
//       if (params.data && params.data.arrivalDate) {
//         const formattedDate = Moment(params.data.arrivalDate).format("DD.MM.YYYY");
//         return formattedDate;
//       } else {
//         return "";     
//       }
//     } },
//     {headerName: 'Anniversary',field: 'anniversary',suppressSizeToFit: true, maxWidth: 140,
//     cellRenderer: (params) => {
//       if (params.data && params.data.anniversary) {
//         const formattedDate = Moment(params.data.anniversary).format("DD.MM.YYYY");
//         return formattedDate;
//       } else {
//         return "";     
//       }
//     }  },
//     {headerName: 'Departure Date ',field: 'departureDate',suppressSizeToFit: true, maxWidth: 180,
//     cellRenderer: (params) => {
//       if (params.data && params.data.departureDate) {
//         const formattedDate = Moment(params.data.departureDate).format("DD.MM.YYYY");
//         return formattedDate;
//       } else {
//         return "";     
//       }
//     }  },
//   ]);

//   const defaultColDef = useMemo( ()=> (
//     {
//       sortable: true, 
//       filter: true,
//       filterParams :{
//         buttons : ['apply','reset']
//       }
//     }
//   ));


//   const [filterFromDate, setFilterFromDate] = useState(null);
//   const [filterToDate, setFilterToDate] = useState(null);
//   const [hotelAddress, sethotelAddress] = useState(null);  
//   const [hotelName, setHotelName] = useState(null);
//   useEffect(() => {
//     const hotelID = JSON.stringify({
//       hotelID: 1
//     })
//     fetchx(DASHBOARD_URL + "/getBusinessDate", {
//       method: "POST",
//       headers: { 'Content-Type': 'application/json' },
//       body: hotelID
//     }).then((res) => res.json())
//     .then(rowData => {
//       setRowData(rowData['data'])
//       console.log(rowData['data'][0])
//       console.log(rowData['data'][0].name)
//       sethotelAddress(rowData['data'][0].address)
//       setHotelName(rowData['data'][0].name)
//     })
//   },[])

// const onSubmit = (data) => {
//   setFlag(true);
//     const filterFromDate = Moment(data.frmdate[0]).format("DD.MM.YYYY");
//   const filterToDate = Moment(data.todate[0]).format("DD.MM.YYYY");
//   setFilterFromDate(filterFromDate);
//   setFilterToDate(filterToDate);
//   setData(data);
//   const createmarketGroup = JSON.stringify({
//     hotelID: 1,
//     startDate:  Moment(data.frmdate[0]).format("YYYY-MM-DD"),
//     endDate: Moment(data.todate[0]).format("YYYY-MM-DD"),
//   });

//   if (flag1 === true) {
//     fetchx(DASHBOARD_URL + "/getInHouseGuestAnniversary", {
//       method: "POST",
//       headers: { 'Content-Type': 'application/json' },
//       body: createmarketGroup,
//     })
//       .then((data) => data.json())
//       .then((res) => {
//         console.log(createmarketGroup)

//         console.log(res["data"])
//         setRowData1(res["data"]);
//         // printGrid(filterFromDate, filterToDate); // Pass values to printGrid function
//       });
//   }
// };
  
//    const printGrid = () => {
//     if (filterFromDate && filterToDate) {
//     const gridApi = gridRef.current && gridRef.current.api;
//     const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.arrivalDate)));

//     if (gridApi) {
//       const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
//       const headerRow = rowData.substring(0, rowData.indexOf('\n'));
//       const cleanHeaderRow = headerRow.replace(/"/g, '');
//       const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
//       const cleanData = dataRows.replace(/"/g, '');
//       const rows = cleanData.split('\n').map(row => row.split(','));
//       const pdf = new jsPDF({ orientation: 'landscape' });
//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const logoWidth = 15;
//       const xCenter = (pageWidth - logoWidth) / 2;
//       const logoHeight = 15;
//       const totalPages = uniqueArrivalDates.length;
//       let currentPage = 1; // Track the current page number

//       pdf.addImage(Logo, 'JPEG', xCenter, 10, logoWidth, logoHeight);
//       pdf.setFontSize(12); 
//       pdf.setFont('helvetica', 'bold');
//       pdf.text(`${hotelName}`, 135, 33);
//       pdf.text(`${hotelAddress}`, 100, 39);
//       pdf.text('InhouseGuest Anniversary Report', 120, 45);
//       // pdf.text('InhouseGuest Anniversary Report', 118, 39);
//       let dateY = 10;
   
//       const margin = { left: 10, right: 10 };
//       const currentDate = new Date();
//       const formattedDate = formatDates(currentDate);
//       const paddingFromRight = 100;
//       const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
//       pdf.text("Report Generated Time " + formattedDate, dateX, dateY);
//       const pageCenter = pdf.internal.pageSize.width / 2;

//       function formatDate(date) {
//         const day = date.getDate().toString().padStart(2, '0');
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const year = date.getFullYear();
//         return `${day}.${month}.${year}`;
//       }


//       function formatDates(date) {
//         const day = date.getDate().toString().padStart(2, '0');
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const year = date.getFullYear();
      
//         const hour = date.getHours().toString().padStart(2, '0');
//         const minute = date.getMinutes().toString().padStart(2, '0');
//         const period = (hour >= 12) ? 'PM' : 'AM';
      
//         const formattedTime = `${(hour % 12) || 12}:${minute} ${period}`;
//         return `${day}.${month}.${year} ${formattedTime}`;
//       }



//      uniqueArrivalDates
//      .sort((a, b) => new Date(a) - new Date(b))
//      .forEach((arrivalDate, index) => {
//        const rowsForDate = rowData1
//          .filter((row) => row.arrivalDate === arrivalDate)
//          .map((row) => {
//           const formattedArrival = formatDate(new Date(row.arrivalDate));
//           const formattedDeparture = formatDate(new Date(row.departureDate));
//           const formattedDob = formatDate(new Date(row.dob));
    
//           return {
//             ...row,
//             arrivalDate: formattedArrival,
//             departureDate: formattedDeparture,
//             dob: formattedDob,
//           };
//         })
//          .map((row) => columnDefs.map((column) => row[column.field]));
     
//        const columns = columnDefs.map((column) => column.headerName);
//              // Calculate the height of the table content
//     const tableHeight = 8;

//     // Check if the content fits on the current page
//     if (dateY + tableHeight > pdf.internal.pageSize.height - 20) {
//       // Move to the next page if the content exceeds the page height
//       pdf.addPage();
//       dateY = 10; // Reset the Y position for the new page
//       currentPage++; // Increment the current page number
//     }

//        const totalCount = rowsForDate.length;
//        pdf.setFont('times', 'bold');
//        const formattedArrivalDate = formatDate(new Date(arrivalDate));
       

//        pdf.text(`Date: ${formattedArrivalDate}`, 10, dateY + 26, { width: 500, align: 'left' });     
//        pdf.autoTable({
//          head: [columns],
//          body: rowsForDate,
//          startY: dateY + 31, 
//        });
//       //  pdf.line(margin.left, pdf.autoTable.previous.finalY + 2, pdf.internal.pageSize.width - margin.right, pdf.autoTable.previous.finalY + 2);

//       pdf.line(
//         240, // Adjust X coordinate to start from where "Total drops" text starts
//         pdf.autoTable.previous.finalY, // Y-coordinate - adjust based on your layout
//         275, // Adjust X coordinate to end the line within the desired width
//         pdf.autoTable.previous.finalY // Y-coordinate for the line
//       ); 

//        pdf.setFont('times', 'roman');
//        pdf.text(`Total : ${totalCount}`, 260, pdf.autoTable.previous.finalY + 5, {
//          width: 500,
//          align: 'center',
//        });
     
//       pdf.line(240,
//         pdf.autoTable.previous.finalY + 8, // Y-coordinate - adjust based on your layout
//         275, // Adjust X coordinate to end the line within the desired width
//         pdf.autoTable.previous.finalY + 8 // Y-coordinate for the line
//       );
//        pdf.setFont('times', 'normal');  
//        dateY = pdf.autoTable.previous.finalY - 3;
//       });


//       dateY = pdf.autoTable.previous.finalY + 10;
//       const availableSpace = pdf.internal.pageSize.height - dateY;
//       // Check if the available space is enough for the content
//       if (availableSpace < 30) { // Adjust '30' based on your content height
//         pdf.addPage(); // Move to the next page
//         dateY = 10; // Set Y position for the new page
//       }
//        pdf.text(`Filter From Arrival Date: ${filterFromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
//        pdf.text(`To Arrival Date: ${filterToDate}`, 10, dateY + 20, { width: 500, align: 'left' });
//        for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
//         pdf.setPage(i); // Set the active page
//         pdf.setFontSize(10); // Set font size for page number
        
//         const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
//         const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        
//         // Calculate position for center alignment
//         const xPos = pageCenter - (pageNumberWidth / 2);
//         const yPos = pdf.internal.pageSize.height - 10; // 10 units from the bottom
        
//         pdf.text(pageNumber, xPos, yPos);
//       }
//       // Save or display the PDF as needed
//       pdf.save('InhouseGuest Anniversary Report.pdf');
//     } else {
//     }  
//     }

//   };

//   const onBtnExport = () => {
//     const params = {
//       fileName: 'IHG Anniversary Report.xlsx',
//       sheetName: 'Sheet1',
//     };
//     gridRef.current.api.exportDataAsExcel(params);
//   };

//   return (
//     <div>
//        <Card>
//       <CardHeader>
//         <CardTitle tag='h4'>In House Guest Anniversary Report</CardTitle>
//       </CardHeader>
//       <CardBody>
//         <Form onSubmit={handleSubmit(onSubmit)}>
//           <Row>
          
//           <Col md="3" sm="12">
//             <div className="mb-1">
//               <Label className="form-label" for="frmdate">
//                 From Date
//               </Label>
//               <Controller
//                 control={control}
//                 id="frmdate"
//                 name="frmdate"
//                 render={({ field }) => (
//                   <Flatpickr
//                     {...field}
//                     options={{ allowInput: true }} 
//                     placeholder="YYYY-MM-DD "
//                     className={classnames("form-control", {
//                     })}
//                   />
//                 )}
//               />
//             </div>
//           </Col>

//           <Col md="3" sm="12">
//             <div className="mb-1">
//               <Label className="form-label" for="todate">
//                 To Date
//               </Label>
//               <Controller
//                 control={control}
//                 id="todate"
//                 name="todate"
//                 render={({ field }) => (
//                   <Flatpickr
//                     {...field}
//                     options={optionsToDate} 
//                     placeholder="YYYY-MM-DD "
//                     className={classnames("form-control", {
//                     })}
//                   />
//                 )}
//               />
//             </div>
//           </Col>

//           <div align="end" className="buttons">
//               <Button className='me-1' color='primary' type='submit' onClick={()=>setflag1(true)}>
//                 Submit
//               </Button>
//               {flag == true &&  <Button className='me-1' color='primary' type='submit'  onClick={onBtnExport}> Download Excel </Button>}
//               {flag == true && <Button className='me-1' color='primary' type='submit'  onClick={printGrid}>Print PDF </Button>}
//             </div>
//           </Row>
//         </Form>
//       </CardBody>
//     </Card>
//              <br></br>  <br/>     
//       {flag == true &&  <div className="ag-theme-alpine" >
//         <AgGridReact 
//             ref={gridRef}
//             rowData={rowData1} 
//             columnDefs={columnDefs}
//             animateRows={true} rowSelection='multiple'
//             defaultColDef={defaultColDef}
//             headerColor="ddw-primary"
//             domLayout='autoHeight'
//             />
//       </div>}
//     </div>
//   )
// }

// export default Anniversary

// ** React Imports
import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input, InputGroup, InputGroupText } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import Select from 'react-select';
import { selectThemeColors } from '@utils'
import { useRef, useEffect, useMemo, useCallback } from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import 'ag-grid-enterprise';
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const defaultValues = {
  frmdate: ''
}

let optionsStatus = [
  { value: 'Checked In', label: 'Checked In' },
  { value: 'Due Out', label: 'Due Out' },
  { value: 'Due In', label: 'Due In' },
]

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const Anniversary = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [rowData1, setRowData1] = useState();
  const gridRef = useRef();
  const [data, setData] = useState(null)
  const [flag, setFlag] = useState(false)
  const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
  const frmdate = watch('frmdate');
  const optionsToDate = {
    minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD'))
  };
  const [flag1, setflag1] = useState(false)

  const [hotelDetails, setHotelDetails] = useState(null);
  const [hotelAddress, setHotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [statusOptions, setStatusOptions] = useState();
  const [dateOption, setDateOption] = useState();
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [open,setOpen] = useState(false)
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);



  //API to get hotel details
  useEffect(() => {

    fetchx(DASHBOARD_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())
      .then(postres => {
        setFilterFromDate(postres['data'][0]['businessDate'])
        setHotelDetails(postres['data'])
        setHotelAddress(postres['data'][0]['address'])
        setHotelName(postres['data'][0]['name'])
        setHotelNo(postres['data'][0]['phoneNumber'])
        sethotelFax(postres['data'][0]['fax'])
        setLogo(postres['data'][0]['logo'])
      })
    setOpen(true)
    fetchx(DASHBOARD_URL + "/getInHouseGuestAnniversary", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
    })
      .then((data) => data.json())
      .then((res) => {
        if(res['statusCode'] == 200) {
          setOpen(false)
        setRowData1(res["data"]);
        }
      });

  }, [])

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Room No.', field: 'roomNumber', suppressSizeToFit: true, width: 130 },
    { headerName: 'Guest Name ', field: 'guestName', suppressSizeToFit: true, width: 270, wrapText: true, autoHeight: true, },
    { headerName: 'Company/TA', field: 'accountName', suppressSizeToFit: true, width: 270, wrapText: true, autoHeight: true },
    {
      headerName: 'Arrival Date', field: 'arrivalDate', suppressSizeToFit: true, width: 160,
      cellRenderer: (params) => {
        if (params.data && params.data.arrivalDate) {
          const formattedDate = Moment(params.data.arrivalDate).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    {
      headerName: 'Anniversary Date', field: 'anniversary', suppressSizeToFit: true, width: 180,
      cellRenderer: (params) => {
        if (params.data && params.data.anniversary) {
          const formattedDate = Moment(params.data.anniversary).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
    {
      headerName: 'Departure Date ', field: 'departureDate', suppressSizeToFit: true, width: 160,
      cellRenderer: (params) => {
        if (params.data && params.data.departureDate) {
          const formattedDate = Moment(params.data.departureDate).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      }
    },

  ]);

  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));


  // error handling for same guest addition
  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }


  const onSubmit = (data) => {

    if ((data.resstatus == undefined || data.resstatus.length == 0) && data.frmdate == '') {
      handleError("Please select any one of the filter !!!")
      return;
    }
    else{
      setOpen(true)
      setIsButtonClicked(true)
    }
    setData(data);
    const status = Array.isArray(data.resstatus) ? data.resstatus.map(item => item.value) : [];
    const statusArray = Array.isArray(data.resstatus) ? data.resstatus.map(item => item.label) : [];
    setStatusOptions(statusArray)
    const filterFromDate = Moment(data.frmdate[0]).format("DD.MM.YYYY");
    setFilterFromDate(filterFromDate);
    if(data.frmdate !== undefined){
      setDateOption(Moment(String(new Date(data.frmdate[0]))).format('YYYY-MM-DD'))
    }
    const createmarketGroup = JSON.stringify({
      hotelID: 1,
      startDate: data.frmdate == '' ? undefined : Moment(String(new Date(data.frmdate[0]))).format('YYYY-MM-DD'),
      statusList: status.length !== 0 ? JSON.stringify(status) : undefined,
    });

    if (flag1 === true) {
      fetchx(DASHBOARD_URL + "/getInHouseGuestAnniversary", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup,
      })
        .then((data) => data.json())
        .then((res) => {
          setIsButtonClicked(false)
          if(res['statusCode'] == 200) {
            setOpen(false)
          setRowData1(res["data"]);
          }
        });
    }
  };


  const onBtnExport = () => {
    const params = {
      fileName: 'IHG Anniversary Report.xlsx',
      sheetName: 'Sheet1',
    };
    gridRef.current.api.exportDataAsExcel(params);
  };

  const printGrid = () => {
    const gridApi = gridRef.current && gridRef.current.api;
    const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.arrivalDate)));

    if (gridApi) {
      const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
      const headerRow = rowData.substring(0, rowData.indexOf('\n'));
      const cleanHeaderRow = headerRow.replace(/"/g, '');
      const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
      const cleanData = dataRows.replace(/"/g, '');
      const rows = cleanData.split('\n').map(row => row.split(','));
      const pdf = new jsPDF({ orientation: 'landscape' });
      // const pageWidth = pdf.internal.pageSize.getWidth();
      // const logoWidth = 15;
      // const xCenter = (pageWidth - logoWidth) / 2;
      // const logoHeight = 15;
      // const totalPages = uniqueArrivalDates.length;
      // let currentPage = 1; // Track the current page number

      // pdf.addImage(Logo, 'JPEG', xCenter, 10, logoWidth, logoHeight);
      // pdf.setFontSize(12);
      // pdf.setFont('helvetica', 'bold');
      // pdf.text(`${hotelName}`, 137, 33);
      // pdf.text(`${hotelAddress}`, 90, 39);
      // pdf.text("Inhouseguest Anniversary Report", 118, 46);
      // let dateY = 20;

      // const margin = { left: 10, right: 10 };
      // const currentDate = new Date();
      // const formattedDate = formatDates(currentDate);
      // const paddingFromRight = 100;
      // const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
      // pdf.text("Report Generated Time " + formattedDate, dateX, dateY);
      // const pageCenter = pdf.internal.pageSize.width / 2;


      const pageWidth = pdf.internal.pageSize.getWidth();
      const logoWidth = 20;
      const xLogo = 10; // X-coordinate for the logo
      const yLogo = 10; // Y-coordinate for the logo
      const logoHeight = 20;
      let dateY = 20;

    
      pdf.addImage(DASHBOARD_URL+`/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

      const margin = { left: 10, right: 10 };
      const currentDate = new Date();
      const formattedDate = formatDates(currentDate);
      const paddingFromRight = 85;
      const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo,fontSize) => {
        // Set font size and style
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', 'normal');
        
        const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const pageCenter = pdf.internal.pageSize.width / 2;
        const halfTextWidth = textWidth / 2;
        let textStartX = pageCenter - halfTextWidth;
          if (textStartX < 0) {
            textStartX = 0; // Set a minimum X-coordinate
        } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
            textStartX = pdf.internal.pageSize.width - textWidth; // Adjust to fit within the page
        }
      
        // Draw the text on the PDF
        pdf.text(`${textToCenter}`, textStartX, yLogo);
      };
      
      // Set hotel name
      setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo,14);
      setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8,12); 
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      
      const textToCenter = "InHouse Guest Anniversary Report";

      // Set font size and style
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      
      // Calculate the width of the text
      const textWidth = pdf.getStringUnitWidth(textToCenter) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      
      // Calculate the starting X-coordinate to center the text
      const pageCenter = pdf.internal.pageSize.width / 2;
      const halfTextWidth = textWidth / 2;
      
      // Adjust the starting X-coordinate based on the text length
      let textStartX = pageCenter - halfTextWidth;
      
      // Ensure the text doesn't overflow the page
      if (textStartX < 0) {
        textStartX = 0; // Set a minimum X-coordinate
      } else if (textStartX + textWidth > pdf.internal.pageSize.width) {
        textStartX = pdf.internal.pageSize.width - textWidth; // Adjust to fit within the page
      }
      
      // Y-coordinate for the text element
      const textY = yLogo + 16;
      
      // Draw the text at the calculated center position
      pdf.text(textToCenter, textStartX, textY);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');

      dateY = 10;

      function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
      }


      function formatDates(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const period = (hour >= 12) ? 'PM' : 'AM';

        const formattedTime = `${(hour % 12) || 12}:${minute} ${period}`;
        return `${day}.${month}.${year} ${formattedTime}`;
      }



      uniqueArrivalDates
        .sort((a, b) => new Date(a) - new Date(b))
        .forEach((arrivalDate, index) => {
          const rowsForDate = rowData1
            .filter((row) => row.arrivalDate === arrivalDate)
            .map((row) => {
              const formattedArrival = formatDate(new Date(row.arrivalDate));
              const formattedDeparture = formatDate(new Date(row.departureDate));
              const formattedDob = formatDate(new Date(row.dob));

              return {
                ...row,
                arrivalDate: formattedArrival,
                departureDate: formattedDeparture,
                dob: formattedDob,
              };
            })
            .map((row) => columnDefs.map((column) => row[column.field]));

          const columns = columnDefs.map((column) => column.headerName);
          // Calculate the height of the table content
          const tableHeight = 8;

          // Check if the content fits on the current page
          if (dateY + tableHeight > pdf.internal.pageSize.height - 20) {
            // Move to the next page if the content exceeds the page height
            pdf.addPage();
            dateY = 10; // Reset the Y position for the new page
            currentPage++; // Increment the current page number
          }

          const totalCount = rowsForDate.length;
          pdf.setFont('times', 'bold');
          const formattedArrivalDate = formatDate(new Date(arrivalDate));


          pdf.text(`Date: ${formattedArrivalDate}`, 10, dateY + 37, { width: 500, align: 'left' });
          pdf.autoTable({
            head: [columns],
            body: rowsForDate,
            startY: dateY + 40,
          });

          pdf.line(
            240, // Adjust X coordinate to start from where "Total drops" text starts
            pdf.autoTable.previous.finalY, // Y-coordinate - adjust based on your layout
            285, // Adjust X coordinate to end the line within the desired width
            pdf.autoTable.previous.finalY // Y-coordinate for the line
          );

          pdf.setFont('times', 'roman');
          pdf.text(`Total Anniversary: ${totalCount}`, 260, pdf.autoTable.previous.finalY + 7, {
            width: 500,
            align: 'center',
          });

          pdf.line(
            240, // Adjust X coordinate to start from where "Total drops" text starts
            pdf.autoTable.previous.finalY + 10, // Y-coordinate - adjust based on your layout
            285, // Adjust X coordinate to end the line within the desired width
            pdf.autoTable.previous.finalY + 10 // Y-coordinate for the line
          );
          pdf.setFont('times', 'normal');
          dateY = pdf.autoTable.previous.finalY - 10;
        });

      dateY = pdf.autoTable.previous.finalY + 15;

      const availableSpace = pdf.internal.pageSize.height - dateY;

      // Check if the available space is enough for the content
      if (availableSpace < 30) { // Adjust '30' based on your content height
        pdf.addPage(); // Move to the next page
        dateY = 10; // Set Y position for the new page
      }

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Filter Selected Date: ${(dateOption == undefined ? '' : formatDate(new Date (dateOption)))}`, 10, dateY + 10, { width: 500, align: 'left' });
      pdf.text(`Status: ${(statusOptions == undefined ? '' : statusOptions)}`, 10, dateY + 20, { width: 500, align: 'left' });
      for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
        pdf.setPage(i); // Set the active page
        pdf.setFontSize(10); // Set font size for page number

        const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
        const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;

        // Calculate position for center alignment
        const xPos = pageCenter - (pageNumberWidth / 2);
        const yPos = pdf.internal.pageSize.height - 10; // 10 units from the bottom

        pdf.text(pageNumber, xPos, yPos);
      }
      // Save or display the PDF as needed
      pdf.save('Inhouseguest Anniversary Report.pdf');
    } else {
    }
    // }

  };

  const generateExcel = () => {
    if (filterFromDate) {
      const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('In House Guest Anniversary Report');

    const columns = [
        { header: 'Room No.', key: 'roomNumber', width: 20 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Company/TA', key: 'accountName', width: 30 },
        { header: 'Arrival Date', key: 'arrivalDate', width: 20 },
        { header: 'Anniversary Date', key: 'anniversary', width: 20 },
        { header: 'Departure Date', key: 'departureDate', width: 20 },
    ];

    worksheet.columns = columns;
    worksheet.addRow(['Report Name:', 'In House Guest Anniversary Report']);
    worksheet.addRow(['Filter From Date:', filterFromDate]);

    let selectedFilterStatus = Array.isArray(statusOptions) && statusOptions.length > 0
        ? statusOptions.join(', ')
        : 'All';
    worksheet.addRow(['Filter Status:', selectedFilterStatus]);
    worksheet.addRow();
    worksheet.addRow(columns.map(column => column.header)).font = { bold: true };

    for (let i = 1; i <= 5; i++) {
        worksheet.getRow(i).font = { bold: true };
    }

    worksheet.spliceRows(1, 1);

    const formattedData = (rowData1) => {
        return rowData1.map(item => ({
            ...item,
            arrivalDate: Moment(item.arrivalDate).format("DD.MM.YYYY"),
            anniversary: Moment(item.anniversary).format("DD.MM.YYYY"),
            departureDate: Moment(item.departureDate).format("DD.MM.YYYY"),
        }));
    };

    const sanitizedData = formattedData(rowData1);

    sanitizedData.forEach((row) => {
        const newRow = {};
        columns.forEach(col => {
            newRow[col.key] = row[col.key] || '';
        });

        worksheet.addRow(newRow);
    });

    worksheet.columns.forEach((column, index) => {
        if ([6, 7, 8].includes(index + 1)) {
            column.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
            column.alignment = { vertical: 'middle', horizontal: 'left' };
        }
    });

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);

    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `In House Guest Anniversary Report_${formattedDate}.xlsx`);
    }).catch((error) => {
        console.error('Error generating Excel file:', error);
    });
  }
};


  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>In House Guest Anniversary Report</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="frmdate">
                    From Date
                  </Label>
                  <Controller
                    control={control}
                    id="frmdate"
                    name="frmdate"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        required
                        // options={{ }}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              {/* <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="todate">
                    To Date
                  </Label>
                  <Controller
                    control={control}
                    id="todate"
                    name="todate"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        options={optionsToDate}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                        })}
                      />
                    )}
                  />
                </div>
              </Col> */}

              <Col md='3' sm='12'>
                <div className='mb-1'>
                  <Label className='form-label' for='resstatus'>
                    Status
                  </Label>
                  <Controller
                    id="resstatus"
                    control={control}
                    name="resstatus"
                    render={({ field }) => (
                      <Select
                        isMulti
                        isClearable
                        options={optionsStatus}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Col>

            </Row>
            <br></br>
            <div align="end" className="buttons">
              <Button className='me-1' color='primary' type='submit' onClick={() => setflag1(true)} disabled={isButtonClicked}>
              {isButtonClicked ? 'Processing...' : 'Submit'} 

              </Button>
              {/* <Button className='me-1' color='primary' onClick={onBtnExport}> Download Excel </Button> */}
              <Button
                className='me-1'
                color='primary'
                onClick={generateExcel}
              >
                Download Excel
                </Button>
              <Button className='me-1' color='primary' onClick={printGrid}>Print PDF </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
      <br />

      <br />

      {/* {flag == true &&  */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
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

      <div className="ag-theme-alpine" >
        <AgGridReact
          ref={gridRef}
          rowData={rowData1}
          columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
          domLayout='autoHeight'

        />
      </div>
      {/* } */}
    </div>
  )
}

export default Anniversary