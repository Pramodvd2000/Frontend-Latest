// ** React Imports
import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import Select from "react-select";
import { selectThemeColors } from "@utils";
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

import { useRef, useEffect, useMemo, useCallback } from 'react';
import DASHBOARD_URL from '../../../../dashboard'
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
const MySwal = withReactContent(Swal)

const defaultValues = {
  frmdate: ''
}

const DepartureReport = () => {

  // AG Grid
  const [rowData1, setRowData1] = useState();
  const [flag, setFlag] = useState(false)

  const gridRef = useRef();

  const [hotelDetails, setHotelDetails] = useState(null);
  const [hotelAddress, setHotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [logoimage, setLogo] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [excelButton,setExcelButton] = useState(false);
  const [pdfButton,setPdfButton] = useState(false);

  const type = [
    { value: 'Early', label: 'Early' },
    { value: 'Late', label: 'Late' }  ]


  const [picker, setPicker] = useState(() => {
    const date = new Date()
    return date;
  });



  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      html: message.replace(/\n/g, '<br />'),
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }
  
    //API to get hotel details
    useEffect(() => {

      fetchx(DASHBOARD_URL + "/getBusinessDate", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json())
        .then(postres => {
          setHotelDetails(postres['data'])
          setHotelAddress(postres['data'][0]['address'])
          setHotelName(postres['data'][0]['name'])
          setHotelNo(postres['data'][0]['phoneNumber'])
          sethotelFax(postres['data'][0]['fax'])
          setLogo(postres['data'][0]['logo'])
        })
  
    }, [])

  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Confirmation Number', field: 'confirmationNumber', suppressSizeToFit: true, width: 150 , autoHeaderHeight: true ,wrapHeaderText: true },
    { headerName: 'Guest Name ', field: 'Name', suppressSizeToFit: true, width: 200, autoHeight: true,  autoHeaderHeight: true ,wrapHeaderText: true},
    { headerName: 'Company', field: 'accountName', suppressSizeToFit: true, maxWidth: 170 },
    { headerName: 'Number Of Rooms', field: 'numberOfRooms', suppressSizeToFit: true, maxWidth: 100 , autoHeight: true,  autoHeaderHeight: true ,wrapHeaderText: true},

    {
      headerName: 'Arrival Date', field: 'arrivalDate', suppressSizeToFit: true, width: 120 , autoHeaderHeight: true ,wrapHeaderText: true,
      cellRenderer: (params) => {
        if (params.data && params.data.arrivalDate) {
          const formattedDate = Moment(params.data.arrivalDate).format("DD.MM.YYYY");
          return formattedDate;
        } else {
          return "";
        }
      }
    },
   
    { headerName: 'Previous Departure', field: 'oldDeparture', suppressSizeToFit: true, width: 160 , autoHeaderHeight: true ,wrapHeaderText: true,
        cellRenderer: (params) => {
            if (params.data && params.data.oldDeparture) {
              const formattedDate = Moment(params.data.oldDeparture).format("DD.MM.YYYY");
              return formattedDate;
            } else {
              return "";
            }
          }
     },
     { headerName: 'Current Departure', field: 'newDeparture', suppressSizeToFit: true, width: 160 , autoHeaderHeight: true ,wrapHeaderText: true,
        cellRenderer: (params) => {
            if (params.data && params.data.newDeparture) {
              const formattedDate = Moment(params.data.newDeparture).format("DD.MM.YYYY");
              return formattedDate;
            } else {
              return "";
            }
          }
     },

     { headerName: 'Departure Modified Time', field: 'createdAt', suppressSizeToFit: true, width: 190 , autoHeaderHeight: true ,wrapHeaderText: true,
      cellRenderer: (params) => {
          if (params.data && params.data.createdAt) {
            const formattedDate = Moment(params.data.createdAt).format("DD.MM.YYYY HH:MM:SS");
            return formattedDate;
          } else {
            return "";
          }
        }
   },
   { headerName: 'Modofied By', field: 'createdUser', suppressSizeToFit: true, width: 200, autoHeight: true,  autoHeaderHeight: true ,wrapHeaderText: true},

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

  const cellClickedListener = useCallback(event => {
  }, []);


  // ** State
  const [data, setData] = useState(null)
  const [flag1, setflag1] = useState(false)

  // ** Hooks
  const { reset, handleSubmit, control } = useForm({ defaultValues })



  const onSubmit = async (data) => {
    if (!picker ) {
      setflag1(false);
      return handleError("Enter Departue date");
    }


    setPdfButton(true);
    setExcelButton(true);
    setIsLoading(true);
    setFlag(true);
    setData(data);

    let createmarketGroup = JSON.stringify({
      "hotelID": 1,
      "departureDate": Moment(new Date(picker)).format("YYYY-MM-DD"),
      //"endDate": Moment(new Date(todatepicker)).format("YYYY-MM-DD HH:mm:ss")
      "departureType": data.departureType.value

    });

    try {
      const response = await fetch(DASHBOARD_URL + "/fetchEarlyandLateDeparture", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: createmarketGroup
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      setRowData1(res["data"]);
      setflag1(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      handleError("Failed fetching data. Please try again.");
      setflag1(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setExcelButton(false);
    setPdfButton(false);
    setRowData1();
    reset({
      block: ''
    })
  }


 
  
  const printGrid = () => {
    if (!rowData1 || rowData1.length === 0) {
        return handleError("No records are present for printing");
    }

    const gridApi = gridRef.current && gridRef.current.api;
    const uniqueCancellationDates = Array.from(new Set(rowData1.map((row) => row.cancellationDate))); 

    if (gridApi) {
        const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
        const headerRow = rowData.substring(0, rowData.indexOf('\n')).replace(/"/g, '');
        const dataRows = rowData.substring(rowData.indexOf('\n') + 1).replace(/"/g, '');
        const rows = dataRows.split('\n').map(row => row.split(','));

        const pdf = new jsPDF({ orientation: 'landscape' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const logoWidth = 20, xLogo = 10, yLogo = 10, logoHeight = 20;
        let dateY = 20;

        pdf.addImage(DASHBOARD_URL + `/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

        const formatDate = (date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        };

        const formatDates = (date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hour = date.getHours().toString().padStart(2, '0');
            const minute = date.getMinutes().toString().padStart(2, '0');
            const period = hour >= 12 ? 'PM' : 'AM';
            const formattedTime = `${(hour % 12) || 12}:${minute} ${period}`;
            return `${day}.${month}.${year} ${formattedTime}`;
        };

        const currentDate = new Date();
        const formattedDate = formatDates(currentDate);
        const paddingFromRight = 85;
        const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
        pdf.setFontSize(8);
        pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        const setHotelInfo = (text, yOffset, fontSize) => {
            pdf.setFontSize(fontSize);
            const textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
            const textX = (pageWidth - textWidth) / 2;
            pdf.text(text, textX, yOffset);
        };

        setHotelInfo(hotelName, yLogo, 14);
        setHotelInfo(hotelAddress, yLogo + 8, 12);

        pdf.setFontSize(16);
        setHotelInfo("Early & Late Departure Report", yLogo + 16, 16);

        dateY = yLogo + 30;

      let totalNumberOfRooms = 0; // Initialize total number of rooms

      uniqueCancellationDates
          .sort((a, b) => new Date(a) - new Date(b))
          .forEach((cancellationDate) => {
              const rowsForDate = rowData1
                  .filter((row) => row.cancellationDate === cancellationDate)
                  .map((row) => {
                      totalNumberOfRooms += row.numberOfRooms; // Sum the total number of rooms
                      return {
                          bookingID: row.confirmationNumber,
                          guestName: row.Name,
                          accountName:row.accountName,
                          arrivalDate: formatDate(new Date(row.arrivalDate)),
                          oldDeparture: formatDate(new Date(row.oldDeparture)),
                          newDeparture: formatDate(new Date(row.newDeparture)),
                          dateTime: formatDates(new Date(row.dateTime)),
                          createdUser: row.createdUser,
                          numberOfRooms: row.numberOfRooms
                      };
                  });

              const columns = ['Confirmation Number', 'Guest Name', 'Company','Arrival Date', 'Previous Departure', 'Current Departure', 'Number of Rooms', 'Created At', 'Modified By'];

              pdf.setFontSize(12);
              pdf.text(`Departure Type: ${data.departureType.value}`, 14, dateY);
              pdf.text(`Departure Date: ${formatDate(new Date(picker))}`, 14, dateY + 7);

              pdf.autoTable({
                  head: [columns],
                  body: rowsForDate.map(row => [
                      row.bookingID, row.guestName, row.accountName, row.arrivalDate, 
                      row.oldDeparture, row.newDeparture, row.numberOfRooms,
                      row.dateTime, row.createdUser
                  ]),
                  startY: dateY + 14
              });

              dateY = pdf.autoTable.previous.finalY + 10;
          });

      // Add the total number of rooms at the bottom of the report
      pdf.setFontSize(12);
      pdf.text(`Total Number of Rooms: ${totalNumberOfRooms}`, 14, dateY + 10); // Display total number of rooms

      for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
          pdf.setPage(i);
          const pageNumber = `Page ${i} of ${pdf.internal.getNumberOfPages()}`;
          const pageNumberWidth = pdf.getStringUnitWidth(pageNumber) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
          const xPos = (pageWidth - pageNumberWidth) / 2;
          pdf.text(pageNumber, xPos, pdf.internal.pageSize.height - 10);
      }

      pdf.save('Early & Late Departure Report.pdf');
  }
};




  const onBtnExport = () => {
    
    const rowData = [];
    gridRef.current.api.forEachNode((node) => rowData.push(node.data));
  
    if (rowData.length === 0) {
      handleError("No data available for export.");
      return; 
    }
  
    const params = {
      fileName: 'Early & Late Departure Report.xlsx',
      sheetName: 'Sheet1',
    };
  
    gridRef.current.api.exportDataAsExcel(params);
  };
  

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Early and Late Departure Report </CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>

            <Col md='3' sm='12'>
                                <div className='mb-1'>
                                  <Label className='form-label' for='departureType'>
                                    Departure Type <spam style={{ color: 'red' }}>*</spam>
                                  </Label>
                                  <Controller
                                    id='departureType'
                                    control={control}
                                    name='departureType'
                                    defaultValue={type[0]}
                                    render={({ field }) => (
                                      <Select
                                        required
                                        disabled={true}
                                        isClearable
                                        options={type}
                                        classNamePrefix='select'
                                        theme={selectThemeColors}
                                        className={classnames('react-select', { 'is-invalid': data !== null && data.childCount === null })}
                                        {...field}
                                      />
                                    )}
                                  />
                                </div>
                              </Col>
            <Col md="3" sm="12">
        <div className="mb-1">
          <Label className="form-label" htmlFor="frmdate">
            Departure Date <spam style={{ color: 'red' }}>*</spam>
          </Label>
          <Controller
            control={control}
            id="frmdate"
            name="frmdate"
            render={({ field }) => (
              <Flatpickr
                value={picker}
                // data-enable-time
                id="frmdate"
                className="form-control"
                onChange={(date) => setPicker(date[0])} // Use date[0] for single date selection
              />
            )}
          />
        </div>
      </Col>

   
            

              <div align="end" className="buttons">
              

<Button 
                  className='me-1' 
                  color='primary' 
                  type='submit'
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
                <Button className='me-1' outline color='secondary' type='reset' onClick={handleReset}>
                  Reset
                </Button>
                {excelButton && <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}> Download Excel </Button>}
                {pdfButton && <Button className='me-1' color='primary' type='submit' onClick={printGrid}>Print PDF </Button>}
              </div>
            </Row>
          </Form>
        </CardBody>
      </Card>

      {flag == true && <div className="ag-theme-alpine" >
        <AgGridReact
          ref={gridRef}
          rowData={rowData1}
          columnDefs={columnDefs}
          animateRows={true} rowSelection='multiple'
          onCellClicked={cellClickedListener}
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
          domLayout='autoHeight'
        />
      </div>}

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>
            Processing your request, please hold on...
          </h2>
          <CircularProgress color="inherit" />
        </div>
      </Backdrop>
    </div>
  )
}

export default DepartureReport
