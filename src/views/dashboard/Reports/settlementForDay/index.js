import { useState ,useEffect} from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader,  } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-enterprise';
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useRef,  useMemo, useCallback} from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)




const defaultValues = { 
    frmdate: ''
}

    const SettlementForDay = () => {
  const [rowData, setRowData] = useState();

    const [rowData1, setRowData1] = useState();
    const gridRef = useRef();
    const [data, setData] = useState(null)
    const [flag, setFlag] = useState(false)
    const { reset, handleSubmit, control } = useForm({ defaultValues })
    const [flag1, setflag1] = useState(false)

  const [hotelAddress, sethotelAddress] = useState(null);  
  const [hotelName, setHotelName] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [logoimage, setLogo] = useState(null);
  const [open,setOpen] = useState(false)
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [filterFromDate, setFilterFromDate] = useState(null);



  useEffect(() => {
  const hotelID = JSON.stringify({
    hotelID: 1
  })
  fetchx(DASHBOARD_URL + "/getBusinessDate", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: hotelID
  }).then((res) => res.json())
  .then(rowData => {
    setRowData(rowData['data'])

    sethotelAddress(rowData['data'][0].address)
    setHotelName(rowData['data'][0].name)
    setHotelNo(rowData['data'][0]['phoneNumber'])
    sethotelFax(rowData['data'][0]['fax'])
    setLogo(rowData['data'][0]['logo'])
  })
},[])
    const CustomHeaderComponentTotal= () => {
        return (
          <div>
            Total
          </div>
        );
      };
      const CustomHeaderComponentTotalCgst= () => {
        return (
          <div>
             CGST
          </div>
        );
      };
      const CustomHeaderComponentTotalSgst= () => {
        return (
          <div>
             SGST
          </div>
        );
      };
      const CustomHeaderComponentTotalSubTotal= () => {
        return (
          <div>
             SubTotal
          </div>
        );
      };
    //   function formatNumber(params) {
    //     var number = params.value;
    //     return Math.floor(number)
    //       .toString()
    //       .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    // }
    function formatNumber(params) {
      var number = params.value;
    
      // Check if the number is undefined or not a number
      if (typeof number !== 'number' || isNaN(number)) {
        return ''; // Return empty string for undefined or non-numeric values
      }
    
      // If the number is valid, proceed with formatting
      var formattedNumber = Math.floor(number).toFixed(2); // Limit to 2 decimal places
      return formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
     
    const columnDefs = [
        
        { headerName: 'TrxnDes', field: 'trxnDes', suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true, rowGroup: true,hide:true },
        // { headerName: 'Transaction ID', field: 'transactionId', suppressSizeToFit: true, maxWidth: 160 },
        { headerName: 'Guest Name', field: 'guestName', suppressSizeToFit: true, maxWidth: 170, wrapText: true, autoHeight: true },
        { headerName: 'Company', field: 'companyName', suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true },
        { headerName: 'Date', field: 'dateTime', suppressSizeToFit: true, maxWidth: 140 , cellRenderer: (params) => {
          if (params.data && params.data.dateTime) {
            const formattedDate = Moment(params.data.dateTime).format("DD.MM.YYYY");
            return formattedDate;
          } else {
            return "";
          }
        },
      },
        { headerName: 'Room Type', field: 'roomType', suppressSizeToFit: true, maxWidth: 140 },
        { headerName: 'Description', field: 'description', suppressSizeToFit: true, maxWidth: 140 , wrapText: true, autoHeight: true},
        { headerName: 'SubTotal', field: 'subTotal', suppressSizeToFit: true, maxWidth: 140,aggFunc: 'sum',valueFormatter: formatNumber,headerComponentFramework: CustomHeaderComponentTotalSubTotal  },
        { headerName: 'CGST', field: 'CGST', suppressSizeToFit: true, maxWidth: 140,aggFunc: 'sum',valueFormatter: formatNumber,headerComponentFramework: CustomHeaderComponentTotalCgst },
        { headerName: 'SGST', field: 'SGST', suppressSizeToFit: true, maxWidth: 140,aggFunc: 'sum',valueFormatter: formatNumber,headerComponentFramework: CustomHeaderComponentTotalSgst  },
        { headerName: 'Total', field: 'total', suppressSizeToFit: true, maxWidth: 160 ,aggFunc: 'sum',valueFormatter: formatNumber,headerComponentFramework: CustomHeaderComponentTotal},
      ];
      
      
    const groupDisplayType = 'singleColumn';

    const defaultColDef = useMemo( ()=> (
        {
        sortable: true, 
        }
    ));
    const cellClickedListener = useCallback( event => {
    }, []);

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
    const onSubmit = data => {
      if (!data.frmdate) {
        handleError("Please select a date.");
        return;
      } 
      
      setIsButtonClicked(true);
      setOpen(true);
      
      // setIsButtonClicked(true)
      // setOpen(true)
        setFlag(true)
        setData(data)
        const filterFromDate = Moment(data.frmdate[0]).format("YYYY-MM-DD");
        setFilterFromDate(filterFromDate);
        let createmarketGroup = JSON.stringify({
            "hotelID": 1,
            "date": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
        })
        if(flag1 ==true){

        let res = fetchx(DASHBOARD_URL+"/getPMSSettlementForDayData", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: createmarketGroup
        }).then(data => data.json())
        .then((res) => {
          setIsButtonClicked(false)
          if(res['statusCode'] == 200) {
            setOpen(false)
          const transactionsArray = res.data.map(item => item.transactions).flat();
           setRowData1(transactionsArray)
          }
        }); 
        } 
    }
console.log(rowData1)
    const handleReset = () => {
        reset({    
            frmdate: ''
        })
    }

    const onBtnExport = () => {
        const params = {
        fileName: 'Settlement For Day Report.xlsx',
        sheetName: 'Sheet1',
        };

        gridRef.current.api.exportDataAsExcel(params);
    };

    const printGrid = () => {
        const gridApi = gridRef.current && gridRef.current.api;
    
        if (gridApi) {
        const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
        const headerRow = rowData.substring(0, rowData.indexOf('\n'));
        // const cleanHeaderRow = headerRow.replace(/"/g, '');
        const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
        const cleanData = dataRows.replace(/"/g, '');
        const rows = cleanData.split('\n').map(row => row.split(','));
        const pdf = new jsPDF({ orientation: 'landscape' });
    
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
        const textToCenter = "Settlement For Day Report";

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
        // const dateY = 10;
        // pdf.text(formattedDate, dateX, dateY);

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
   const cleanHeaderRow = headerRow.replace(/"/g, '').replace(/sum\(([^)]+)\)/g, '$1');
         const columnsToFormat = [6,7,8,9];
    
            rows.forEach(row => {
              columnsToFormat.forEach(columnIndex => {
                const value = row[columnIndex];
                if (value !== undefined) {
                  row[columnIndex] = Number(value).toFixed(2);
                }
                if (!isNaN(Number(value))) {
                  // Format the number with maximumFractionDigits: 2
                  row[columnIndex] = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(Number(value));
                }
              });
            });
        pdf.autoTable({
            head: [cleanHeaderRow.split(',').map(value => value.trim())], 
            body: rows.map(row => row.map(value => value.trim())),
            startY: 45, 
            didParseCell: (data) => {
              if (data.column.index == 5 || data.column.index == 6 || data.column.index == 7|| data.column.index == 8  ) {
                data.cell.styles.halign = 'right';
              }
            }
        });
            pdf.save('Settlement For Day Report.pdf');
        } else {
        }
    };

    const generateExcel = () => {
      if(filterFromDate) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Settlement For Day Report');
    
      const columns = [
        { header: 'TrxnDes', key: 'trxnDes', width: 30 },
        { header: 'Guest Name', key: 'guestName', width: 25 },
        { header: 'Company', key: 'companyName', width: 25 },
        { header: 'Date', key: 'dateTime', width: 20 },
        { header: 'Room Type', key: 'roomType', width: 20 },
        { header: 'Description', key: 'description', width: 20 },
        { header: 'SubTotal', key: 'subTotal', width: 20 },
        { header: 'CGST', key: 'CGST', width: 20 },
        { header: 'SGST', key: 'SGST', width: 20 },
        { header: 'Total', key: 'total', width: 20 }
      ];
    
      worksheet.columns = columns;
    
      worksheet.addRow(['Report Name:', 'Settlement For Day Report']);
      worksheet.addRow(['From Date:', filterFromDate]);
      worksheet.addRow();
      worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
    
      for (let i = 1; i <= 3; i++) {
        worksheet.getRow(i).font = { bold: true };
      }
    
      worksheet.spliceRows(1, 1);
    
      const formattedData = (rowData1) => {
        return rowData1.map(item => ({
          ...item,
          dateTime: Moment(item.dateTime).format("DD-MM-YYYY")
        }));
      };
    
      const sanitizedData = formattedData(rowData1);
    
      sanitizedData.forEach((row) => {
        worksheet.addRow({
          trxnDes: row.trxnDes,
          guestName: row.guestName,
          companyName: row.companyName,
          dateTime: row.dateTime,
          roomType: row.roomType,
          description: row.description,
          subTotal: row.subTotal,
          CGST: row.CGST,
          SGST: row.SGST,
          total: row.total
        });
      });
    
      worksheet.columns.forEach((column, index) => {
        if ([7,8,9,10].includes(index + 1)) {
          column.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          column.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
    
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Settlement For Day Report_${formattedDate}.xlsx`);
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
    };
    

    return (
        <div>
        <Card>
        <CardHeader>
            <CardTitle tag='h4'>Settlement For Day Report</CardTitle>
        </CardHeader>
        <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
            
            <Col md="3" sm="12">
                <div className="mb-1">
                <Label className="form-label" for="frmdate">
                    Date
                </Label>
                <Controller
                    control={control}
                    id="frmdate"
                    name="frmdate"
                    render={({ field }) => (
                    <Flatpickr
                        {...field}
                        required
                        options={{ allowInput: true }} 
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                        })}
                    />
                    )}
                />
                </div>
            </Col>

                <div align="end" className="buttons">
                <Button className='me-1' color='primary' type='submit' onClick={()=>setflag1(true)} disabled={isButtonClicked}>
                {isButtonClicked ? 'Processing...' : 'Submit'} 
                </Button>
                {/* <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                    Reset
                </Button> */}
                { flag == true && 
                // <Button className='me-1' color='primary' onClick={onBtnExport}> Download Excel </Button>
                <Button
              className='me-1'
              color='primary'
              onClick={generateExcel}
              >
              Download Excel
              </Button>
                }
                { flag == true && <Button className='me-1' color='primary' onClick={printGrid}>Print PDF </Button>}
                </div>
            </Row>
            </Form>
        </CardBody>
        </Card>
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
    { flag == true &&
        <div className="ag-theme-alpine" >
            <AgGridReact 
                ref={gridRef}
                rowData={rowData1} 
                columnDefs={columnDefs}
                groupDisplayType={groupDisplayType}
                animateRows={true} 
                rowSelection='multiple'
                onCellClicked={cellClickedListener}
                defaultColDef={defaultColDef}
                headerColor="ddw-primary"
                domLayout='autoHeight'
                groupIncludeFooter={true}
                groupIncludeTotalFooter={true}
                />
        </div>
        } 
        </div>
    )
    }

export default SettlementForDay

// import { useState,useEffect } from 'react'
// import classnames from 'classnames'
// import Flatpickr from 'react-flatpickr'
// import 'cleave.js/dist/addons/cleave-phone.us'
// import { useForm, Controller } from 'react-hook-form'
// import Moment from 'moment'
// import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader,  } from 'reactstrap'
// import '@styles/react/libs/flatpickr/flatpickr.scss'
// import '@styles/react/libs/react-select/_react-select.scss'
// import '@styles/react/pages/page-form-validation.scss'
// import { AgGridReact } from 'ag-grid-react'
// import 'ag-grid-enterprise';
// import '/node_modules/ag-grid-community/styles/ag-grid.css'
// import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
// import { useRef,  useMemo, useCallback} from 'react';
// import DASHBOARD_URL from '../../../../dashboard'
// import Logo from '../oterra.jpg'
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// const defaultValues = { 
//     frmdate: ''
// }

//     const SettlementForDay = () => {
//     const [rowData, setRowData] = useState();
//     const [rowData1, setRowData1] = useState();
//     const gridRef = useRef();
//     const [data, setData] = useState(null)
//     const [flag, setFlag] = useState(false)
//     const { reset, handleSubmit, control } = useForm({ defaultValues })
//     const [flag1, setflag1] = useState(false)
//     const [hotelAddress, sethotelAddress] = useState(null);  
//     const [hotelName, setHotelName] = useState(null);
//     useEffect(() => {
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
  
//       sethotelAddress(rowData['data'][0].address)
//       setHotelName(rowData['data'][0].name)
//     })
//   },[])
//     const CustomHeaderComponentTotal= () => {
//         return (
//           <div>
//             Total
//           </div>
//         );
//       };
//       const CustomHeaderComponentTotalCgst= () => {
//         return (
//           <div>
//              CGST
//           </div>
//         );
//       };
//       const CustomHeaderComponentTotalSgst= () => {
//         return (
//           <div>
//              SGST
//           </div>
//         );
//       };
//       function formatNumber(params) {
//         var number = params.value;
//         return Math.floor(number)
//           .toString()
//           .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
//     }
//     const columnDefs = [
        
//         { headerName: 'TrxnDes', field: 'trxnDes', suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true, rowGroup: true,hide:true },
//         { headerName: 'Transaction ID', field: 'transactionId', suppressSizeToFit: true, maxWidth: 160 },
//         { headerName: 'Guest Name', field: 'guestName', suppressSizeToFit: true, maxWidth: 170, wrapText: true, autoHeight: true },
//         { headerName: 'Company', field: 'companyName', suppressSizeToFit: true, maxWidth: 140, wrapText: true, autoHeight: true },
//         { headerName: 'Date', field: 'dateTime', suppressSizeToFit: true, maxWidth: 140 },
//         { headerName: 'Room Type', field: 'roomType', suppressSizeToFit: true, maxWidth: 120 },
//         { headerName: 'Description', field: 'description', suppressSizeToFit: true, maxWidth: 140 , wrapText: true, autoHeight: true},
//         { headerName: 'CGST', field: 'CGST', suppressSizeToFit: true, maxWidth: 110,aggFunc: 'sum',valueFormatter: formatNumber,headerComponentFramework: CustomHeaderComponentTotalCgst },
//         { headerName: 'SGST', field: 'SGST', suppressSizeToFit: true, maxWidth: 110,aggFunc: 'sum',valueFormatter: formatNumber,headerComponentFramework: CustomHeaderComponentTotalSgst  },
//         { headerName: 'Total', field: 'total', suppressSizeToFit: true, maxWidth: 100 ,aggFunc: 'sum',valueFormatter: formatNumber,headerComponentFramework: CustomHeaderComponentTotal},
//       ];
      
      
//     const groupDisplayType = 'singleColumn';

//     const defaultColDef = useMemo( ()=> (
//         {
//         sortable: true, 
//         }
//     ));
//     const cellClickedListener = useCallback( event => {
//     }, []);

//     const onSubmit = data => {
//         setFlag(true)
//         setData(data)
//         let createmarketGroup = JSON.stringify({
//             "hotelID": 1,
//             "date": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
//         })
//         if(flag1 ==true){

//         let res = fetchx(DASHBOARD_URL+"/getPMSSettlementForDayData", {
//             method: "POST",
//             headers: { 'Content-Type': 'application/json' },
//             body: createmarketGroup
//         }).then(data => data.json())
//         .then((res) => {
//           const transactionsArray = res.data.map(item => item.transactions).flat();
//            setRowData1(transactionsArray)
//            console.log(transactionsArray)
//         }); 
//         } 
//     }
// console.log(rowData1)
//     const handleReset = () => {
//         reset({    
//             frmdate: ''
//         })
//     }

//     const onBtnExport = () => {
//         const params = {
//         fileName: 'Settlement For Day Report.xlsx',
//         sheetName: 'Sheet1',
//         };

//         gridRef.current.api.exportDataAsExcel(params);
//     };

//     const printGrid = () => {
//         // if (filterFromDate && filterToDate) {
//         const gridApi = gridRef.current && gridRef.current.api;
//         const uniqueArrivalDates = Array.from(new Set(rowData1.map((row) => row.arrivalDate)));
    
//         if (gridApi) {
//           const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
//           const headerRow = rowData.substring(0, rowData.indexOf('\n'));
//           const cleanHeaderRow = headerRow.replace(/"/g, '');
//           const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
//           const cleanData = dataRows.replace(/"/g, '');
//           const rows = cleanData.split('\n').map(row => row.split(','));
//           const pdf = new jsPDF({ orientation: 'landscape' });
//           const pageWidth = pdf.internal.pageSize.getWidth();
//           const logoWidth = 15;
//           const xCenter = (pageWidth - logoWidth) / 2;
//           const logoHeight = 15;
//           pdf.addImage(Logo, 'JPEG', xCenter, 6, logoWidth, logoHeight);
//           pdf.setFontSize(12); 
//           pdf.setFont('helvetica', 'bold');
//           pdf.text(`${hotelName}`, 135, 26);
//           pdf.text(`${hotelAddress}`, 100, 32);
//           pdf.text('Settlement For Day Report', 132, 39); 
//           let dateY = 10;
       
//           const margin = { left: 10, right: 10 };
//           const currentDate = new Date();
//           const formattedDate = formatDates(currentDate);
//           const paddingFromRight = 100;
//           const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
//           pdf.text("Report Generated Time " + formattedDate, dateX, dateY);
//           const pageCenter = pdf.internal.pageSize.width / 2;
//           function formatDate(date) {
//             const day = date.getDate().toString().padStart(2, '0');
//             const month = (date.getMonth() + 1).toString().padStart(2, '0');
//             const year = date.getFullYear();
//             return `${day}.${month}.${year}`;
//           }
    
    
//           function formatDates(date) {
//             const day = date.getDate().toString().padStart(2, '0');
//             const month = (date.getMonth() + 1).toString().padStart(2, '0');
//             const year = date.getFullYear();
          
//             const hour = date.getHours().toString().padStart(2, '0');
//             const minute = date.getMinutes().toString().padStart(2, '0');
//             const period = (hour >= 12) ? 'PM' : 'AM';
          
//             const formattedTime = `${(hour % 12) || 12}:${minute} ${period}`;
//             return `${day}.${month}.${year} ${formattedTime}`;
//           }
    
    
    
//          uniqueArrivalDates
//          .sort((a, b) => new Date(a) - new Date(b))
//          .forEach((arrivalDate, index) => {
//            const rowsForDate = rowData1
//              .filter((row) => row.arrivalDate === arrivalDate)
//              .map((row) => {
//               const formattedArrival = formatDate(new Date(row.arrivalDate));
//               const formattedDeparture = formatDate(new Date(row.departureDate));
//               const formattedPickUpDate = formatDate(new Date(row.createdAt));
//               // const isMain = row.isMain;    
    
//               return {
//                 ...row,
//                 arrivalDate: formattedArrival,
//                 departureDate: formattedDeparture,
//                 createdAt: formattedPickUpDate,
//                 // isMain: isMain
    
//               };
//             })
//              .map((row) => columnDefs.map((column) => row[column.field]));
         
//            const columns = columnDefs.map((column) => column.headerName);
//                  // Calculate the height of the table content
//         const tableHeight = 8;
//         let currentPage = 1; // Track the current page number
    
//         // Check if the content fits on the current page
//         if (dateY + tableHeight > pdf.internal.pageSize.height - 20) {
//           // Move to the next page if the content exceeds the page height
//           pdf.addPage();
//           dateY = 10; // Reset the Y position for the new page
//           currentPage++; // Increment the current page number
//         }
    
//             //  // Initialize totalCount before filtering rowsForDate
//             //  let totalRooms = rowsForDate.length;
    
//             //  // Filter rowsForDate to exclude rows where isMain is zero
//             //  const filteredRoomRows = rowsForDate.filter(row => row[9] !== 0);
     
//             //  // Calculate totalCount based on the filtered rows
//             //  totalRooms = filteredRoomRows.length;
//             //  console.log("totalRooms",totalRooms)
    
    
//            const totalCount = rowsForDate.length;
//            pdf.setFont('times', 'bold');
//            const formattedArrivalDate = formatDate(new Date(arrivalDate));
           
    
//            pdf.text(`Date: ${formattedArrivalDate}`, 10, dateY + 26, { width: 500, align: 'left' });  
//            const columnStyles = {
//             0: { columnWidth: 21 }, // Adjust the width as needed for each column
//             1: { columnWidth: 40 },
//             2: { columnWidth: 20 },
//             3: { columnWidth: 25 },
//             4: { columnWidth: 40 },
//             5: { columnWidth: 23 },
//             6: { columnWidth: 23 },
//             7: { columnWidth: 22 },
//             8: { columnWidth: 50 },
//             // 9: { columnWidth: 30 },
    
//           };   
         
//           // const filteredColumns = columns.filter(columnName => columnName !== 'isMain');
//         // console.log("filteredColumns",filteredColumns)
//            pdf.autoTable({
//              head: [columns],
//              body: rowsForDate,
//              startY: dateY + 30, 
//              columnStyles,
//            });
//           //  pdf.line(margin.left, pdf.autoTable.previous.finalY + 2, pdf.internal.pageSize.width - margin.right, pdf.autoTable.previous.finalY + 2);
    
//           pdf.line(
//             240, // Adjust X coordinate to start from where "Total drops" text starts
//             pdf.autoTable.previous.finalY, // Y-coordinate - adjust based on your layout
//             275, // Adjust X coordinate to end the line within the desired width
//             pdf.autoTable.previous.finalY // Y-coordinate for the line
//           ); 
          
//           // pdf.line(
//           //   40, // Adjust X coordinate to start from where "Total drops" text starts
//           //   pdf.autoTable.previous.finalY, // Y-coordinate - adjust based on your layout
//           //   80, // Adjust X coordinate to end the line within the desired width
//           //   pdf.autoTable.previous.finalY // Y-coordinate for the line
//           // ); 
    
    
//           pdf.setFont('times', 'roman');
//           // pdf.text(`Total Rooms : ${totalRooms}`,50, pdf.autoTable.previous.finalY + 5, { width: 500, align: 'left', });
    
//            pdf.text(`Total: ${totalCount}`, 260, pdf.autoTable.previous.finalY + 5, {
//              width: 500,
//              align: 'center',
//            });
      
//           // pdf.line(
//           //   40, // Adjust X coordinate to start from where "Total drops" text starts
//           //   pdf.autoTable.previous.finalY  + 8, // Y-coordinate - adjust based on your layout
//           //   80, // Adjust X coordinate to end the line within the desired width
//           //   pdf.autoTable.previous.finalY + 8 // Y-coordinate for the line
//           // ); 
//           pdf.line(240,
//             pdf.autoTable.previous.finalY + 8, // Y-coordinate - adjust based on your layout
//             275, // Adjust X coordinate to end the line within the desired width
//             pdf.autoTable.previous.finalY + 8 // Y-coordinate for the line
//           );
//           pdf.setFont('times', 'normal');  
//            dateY = pdf.autoTable.previous.finalY ;
    
//           });
    
//           dateY = pdf.autoTable.previous.finalY + 20;
//           const availableSpace = pdf.internal.pageSize.height - dateY;
    
//           // Check if the available space is enough for the content
//           if (availableSpace < 30) { // Adjust '30' based on your content height
//             pdf.addPage(); // Move to the next page
//             dateY = 10; // Set Y position for the new page
//           }
//         //    pdf.text(`Filter From Arrival Date: ${filterFromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
//         //    pdf.text(`To Arrival Date: ${filterToDate}`, 10, dateY + 20, { width: 500, align: 'left' });
        
//            for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
//             pdf.setPage(i); // Set the active page
//             pdf.setFontSize(10); // Set font size for page number
            
//             const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
//             const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
            
//             // Calculate position for center alignment
//             const xPos = pageCenter - (pageNumberWidth / 2);
//             const yPos = pdf.internal.pageSize.height - 10; // 10 units from the bottom
            
//             pdf.text(pageNumber, xPos, yPos);
//           }
    
//           // Save or display the PDF as needed
//           pdf.save('No Show Report.pdf');
//         } else {
//         }  
//         // }
    
//       };
    
//     // const printGrid = () => {
//     //     const gridApi = gridRef.current && gridRef.current.api;
    
//     //     if (gridApi) {
//     //     const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
//     //     const headerRow = rowData.substring(0, rowData.indexOf('\n'));
//     //     const cleanHeaderRow = headerRow.replace(/"/g, '');
//     //     const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
//     //     const cleanData = dataRows.replace(/"/g, '');
//     //     const rows = cleanData.split('\n').map(row => row.split(','));
//     //     const pdf = new jsPDF({ orientation: 'landscape' });
    
//     //     // Calculate center for the logo
//     //     const pageWidth = pdf.internal.pageSize.getWidth();
//     //     const logoWidth = 15;
//     //     const xCenter = (pageWidth - logoWidth) / 2;
//     //     // Add logo
//     //     const logoHeight = 15;
//     //     pdf.addImage(Logo, 'JPEG', xCenter, 10, logoWidth, logoHeight); // Adjust the coordinates and size as needed

//     //     // Add heading
//     //     pdf.setFontSize(12); // Set the font size to 12
//     //     pdf.setFont('helvetica', 'bold');
//     //     pdf.text('THE OTERRA BENGALURU', 120, 33);
//     //     pdf.text('Settlement For Day Report', 125, 39); 
//     //     const currentDate = new Date();
//     //     const formattedDate = formatDate(currentDate);
//     //     const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) * 12 - 10;
//     //     const dateY = 10;
//     //     pdf.text(formattedDate, dateX, dateY);
//     //     function formatDate(date) {
//     //         const day = date.getDate().toString().padStart(2, '0');
//     //         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     //         const year = date.getFullYear();
//     //         return `${day}/${month}/${year}`;
//     //     }
//     //     pdf.autoTable({
//     //         head: [cleanHeaderRow.split(',').map(value => value.trim())], 
//     //         body: rows.map(row => row.map(value => value.trim())),
//     //         startY: 45, 
//     //     });
//     //         pdf.save('Settlement For Day Report.pdf');
//     //     } else {
//     //     }
//     // };



//     return (
//         <div>
//         <Card>
//         <CardHeader>
//             <CardTitle tag='h4'>Settlement For Day Report</CardTitle>
//         </CardHeader>
//         <CardBody>
//             <Form onSubmit={handleSubmit(onSubmit)}>
//             <Row>
            
//             <Col md="3" sm="12">
//                 <div className="mb-1">
//                 <Label className="form-label" for="frmdate">
//                     Date
//                 </Label>
//                 <Controller
//                     control={control}
//                     id="frmdate"
//                     name="frmdate"
//                     render={({ field }) => (
//                     <Flatpickr
//                         {...field}
//                         options={{ allowInput: true }} 
//                         placeholder="YYYY-MM-DD "
//                         className={classnames("form-control", {
//                         })}
//                     />
//                     )}
//                 />
//                 </div>
//             </Col>

//                 <div align="end" className="buttons">
//                 <Button className='me-1' color='primary' type='submit' onClick={()=>setflag1(true)}>
//                     Submit
//                 </Button>
//                 <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
//                     Reset
//                 </Button>
//                 <Button className='me-1' color='primary' type='submit'  onClick={onBtnExport}> Download Excel </Button>
//                 <Button className='me-1' color='primary' type='submit'  onClick={printGrid}>Print PDF </Button>
//                 </div>
//             </Row>
//             </Form>
//         </CardBody>
//         </Card>
        
//     { flag == true &&
//         <div className="ag-theme-alpine" >
//             <AgGridReact 
//                 ref={gridRef}
//                 rowData={rowData1} 
//                 columnDefs={columnDefs}
//                 groupDisplayType={groupDisplayType}
//                 animateRows={true} 
//                 rowSelection='multiple'
//                 onCellClicked={cellClickedListener}
//                 defaultColDef={defaultColDef}
//                 headerColor="ddw-primary"
//                 domLayout='autoHeight'
//                 />
//         </div>
//         } 
//         </div>
//     )
//     }

// export default SettlementForDay