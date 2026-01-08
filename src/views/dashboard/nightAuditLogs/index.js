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

import { useRef, useEffect, useMemo, useCallback } from 'react';
import DASHBOARD_URL from '../../../dashboard'
import Logo from '../oterra.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { format } from 'date-fns'


const defaultValues = {
    frmdate: ''
}

const NoShowReport = () => {

    // AG Grid
    const [rowData, setRowData] = useState();
    const [rowData1, setRowData1] = useState();
    const [filterFromDate, setFilterFromDate] = useState(null);
    const [filterToDate, setFilterToDate] = useState(null);

    const gridRef = useRef();
    const [data, setData] = useState(null)
    const [flag, setFlag] = useState(false)
    const { reset, handleSubmit, control, watch } = useForm({ defaultValues })
    const [flag1, setflag1] = useState(false)
    const [InvURL, setInvURL] = useState([])
    const [open, setOpen] = useState(false)
    const [isButtonClicked, setIsButtonClicked] = useState(false);



    const [columnDefs, setColumnDefs] = useState([


        {
            headerName: "Business Date",
            field: "businessDate",
            suppressSizeToFit: true,
            maxWidth: 120,
            cellRenderer: (params) => {
                if (params.data && params.data.businessDate) {
                    const formattedDate = format(new Date(params.data.businessDate), 'dd MMM yy');
                    return formattedDate;
                } else {
                    return "";
                }
            }
        },
                {
            headerName: "Notes",
            field: "notes",
            suppressSizeToFit: true,
            style: { marginLeft: '-2px' },
            maxWidth: 150
        },

        {
            headerName: "Started Night Audit",
            field: "startedNightAudit",
            suppressSizeToFit: true,
            maxWidth: 130,
            cellStyle: { textAlign: "center" },
            cellRenderer: (params) => params.value === "1" ? "Yes" : "No"
        },
           {
            headerName: "Unsettled POS Bills",
            field: "unSettleBills",
            suppressSizeToFit: true,
            maxWidth: 130,
            cellStyle: { textAlign: "center" },
            cellRenderer: (params) => params.value === "1" ? "Yes" : "No"
        },
        {
            headerName: "Country Check",
            field: "countryAndStateCheck",
            suppressSizeToFit: true,
            maxWidth: 150,
            cellStyle: { textAlign: "center" },
            cellRenderer: (params) => params.value === "1" ? "Yes" : "No"
        },
        {
            headerName: "Pending Arrivals",
            field: "arrivalsNotYetCheckedIn",
            suppressSizeToFit: true,
            maxWidth: 180,
            cellStyle: { textAlign: "center" },
            cellRenderer: (params) => params.value === "1" ? "Yes" : "No"
        },
        {
            headerName: "Pending Departures",
            field: "depaturesNotCheckedOut",
            suppressSizeToFit: true,
            maxWidth: 180,
            cellStyle: { textAlign: "center" },
            cellRenderer: (params) => params.value === "1" ? "Yes" : "No"
        },
             {
            headerName: "Room Posting",
            field: "postingRoomAndTax",
            suppressSizeToFit: true,
            maxWidth: 150,
            cellStyle: { textAlign: "center" },
            cellRenderer: (params) => params.value === "1" ? "Yes" : "No"
        },
        {
            headerName: "Fixed Charge Posting",
            field: "fixedChargePostingCheck",
            suppressSizeToFit: true,
            maxWidth: 190,
            cellStyle: { textAlign: "center" },
            cellRenderer: (params) => params.value === "1" ? "Yes" : "No"
        },
        {
            headerName: "Room Status Check",
            field: "roomStatusCheck",
            suppressSizeToFit: true,
            maxWidth: 150,
            cellStyle: { textAlign: "center" },
            cellRenderer: (params) => params.value === "1" ? "Yes" : "No"
        },
            {
            headerName: "Printing Reports",
            field: "printingReports",
            suppressSizeToFit: true,
            maxWidth: 140,
            cellStyle: { textAlign: "center" },
            cellRenderer: (params) => params.value === "1" ? "Yes" : "No"
        },
             {
            headerName: "Reservation Status Check",
            field: "reservationStatusCheck",
            suppressSizeToFit: true,
            maxWidth: 180,
            cellStyle: { textAlign: "center" },
            cellRenderer: (params) => params.value === "1" ? "Yes" : "No"
        },
        {
            headerName: "Rolling Business Date",
            field: "rollingBusinessDate",
            suppressSizeToFit: true,
            maxWidth: 160,
            cellStyle: { textAlign: "center" },
            cellRenderer: (params) => params.value === "1" ? "Yes" : "No"
        },

   
    
    ]);

    const frmdate = watch('frmdate');
    const optionsToDate = {
        minDate: (Moment(String(new Date(frmdate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
    };
    const defaultColDef = useMemo(() => (
        {
            sortable: true,
               wrapHeaderText: true,
    autoHeaderHeight: true
        }
    ));

    const [hotelAddress, sethotelAddress] = useState(null);
    const [hotelName, setHotelName] = useState(null);
    const [hotelNo, setHotelNo] = useState(null);
    const [hotelFax, sethotelFax] = useState(null)
    const [image, setImage] = useState(null);
    const [logoimage, setLogo] = useState(null);
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
    }, [])


    //     useEffect(() => {
    //   let createmarketGroup = JSON.stringify({
    //         // "hotelID": 1,
    //         // "fromDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
    //         // "toDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
    //     })

    //         let res = fetchx(DASHBOARD_URL + "/getNightAuditLogs", {
    //             method: "POST",
    //             headers: { 'Content-Type': 'application/json' },
    //             body: createmarketGroup
    //         }).then(data => data.json())
    //             .then((res) => {
    //                 setIsButtonClicked(false)
    //                 if (res['statusCode'] == 200) {
    //                     setOpen(false)
    //                     console.log(res);
    //                     console.log(res["data"][0]);
    //                     setRowData1(res["data"])
    //                 }
    //                 else {
    //                     setOpen(false)

    //                 }
    //             });
    // }, [])


    const onSubmit = data => {
        setIsButtonClicked(true)
        setOpen(true)
        const filterFromDate = Moment(data.frmdate[0]).format("DD.MM.YYYY");
        const filterToDate = Moment(data.todate[0]).format("DD.MM.YYYY");


        setFilterFromDate(filterFromDate);
        setFilterToDate(filterToDate);
        setFlag(true)

        setData(data)
        let createmarketGroup = JSON.stringify({
            "hotelID": 1,
            "fromDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
            "toDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
        })
        if (flag1 == true) {

            let res = fetchx(DASHBOARD_URL + "/getNightAuditLogs", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: createmarketGroup
            }).then(data => data.json())
                .then((res) => {
                    setIsButtonClicked(false)
                    if (res['statusCode'] == 200) {
                        setOpen(false)
                        console.log(res);
                        console.log(res["data"][0]);
                        setRowData1(res["data"])
                    }
                    else {
                        setOpen(false)

                    }
                });
        }

    }




    const generateExcel = () => {
        if (filterFromDate && filterToDate) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Reservation Stay Modified Report');

            const columns = [
                { header: 'Booking ID', key: 'bookingID', width: 20 },
                { header: 'Guest Name', key: 'guestName', width: 25 },
                { header: 'Company/Agent', key: 'accountName', width: 30 },
                { header: 'Arrival', key: 'arrivalDate', width: 20 },
                { header: 'Departure', key: 'departureDate', width: 20 },
                { header: 'Old Departure', key: 'oldValue', width: 20 },
                { header: 'New Departure', key: 'newValue', width: 20 },
                { header: 'Room Type/Rooms', key: 'roomTypeRooms', width: 25 },
                { header: 'Status', key: 'reservationStatus', width: 15 },
                { header: 'Sub ID', key: 'subBookingID', width: 15 },
                { header: 'Room No', key: 'roomNumber', width: 15 },
                { header: 'Group ID', key: 'blockCodeID', width: 15 },
                { header: 'Market', key: 'marketCode', width: 15 },
                { header: 'Source', key: 'sourceCode', width: 15 },
                { header: 'Reservation ID / Sharing ID', key: 'idSharingID', width: 25 },
                { header: 'Created By', key: 'createdByName', width: 20 },
                { header: 'Created At', key: 'createdAt', width: 20 }
            ];


            worksheet.columns = columns;

            worksheet.addRow(['Report Name:', 'Reservation Stay Modified Report']);
            worksheet.addRow(['Filter From Date:', filterFromDate]);
            worksheet.addRow(['To Date:', filterToDate]);
            worksheet.addRow();
            worksheet.addRow(columns.map(column => column.header)).font = { bold: true };

            for (let i = 1; i <= 5; i++) {
                worksheet.getRow(i).font = { bold: true };
            }

            worksheet.spliceRows(1, 1);

            const formattedData = (rowData1) => {
                return rowData1.map(item => ({
                    ...item,
                    arrivalDate: format(new Date(item.arrivalDate), 'dd MMM yy'),
                    departureDate: format(new Date(item.departureDate), 'dd MMM yy'),
                }));
            };

            const sanitizedData = formattedData(rowData1);

            sanitizedData.forEach((row) => {
                worksheet.addRow({
                    bookingID: row.isMain === 0 ? `${row.bookingID}*` : row.bookingID,
                    guestName: row.guestName,
                    accountName: row.accountName,
                    arrivalDate: row.arrivalDate,
                    departureDate: row.departureDate,
                    oldValue: row.oldValue ? format(new Date(row.oldValue), 'dd MMM yy') : '',
                    newValue: row.newValue ? format(new Date(row.newValue), 'dd MMM yy') : '',
                    roomTypeRooms: `${row.roomType || ''} - ${row.numberOfRooms || ''}`,
                    reservationStatus: row.reservationStatus,
                    subBookingID: row.subBookingID,
                    roomNumber: row.roomNumber,
                    blockCodeID: row.blockCodeID,
                    marketCode: row.marketCode,
                    sourceCode: row.sourceCode,
                    idSharingID: `${row.id}/${row.sharingID}`,
                    createdByName: row.createdByName,
                    createdAt: row.createdAt
                });
            });

            worksheet.columns.forEach((column) => {
                column.alignment = { vertical: 'middle', horizontal: 'left' };
            });

            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 10);

            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/octet-stream' });
                saveAs(blob, `Reservation Stay Modified_${formattedDate}.xlsx`);
            }).catch((error) => {
                console.error('Error generating Excel file:', error);
            });
        }
    };



    const cyrb53 = (str, seed = 0) => {
        let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
        for (let i = 0; i < str.length; i++) {
            const ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
        h2 = Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    };

    const getPastelColorFromString = (str) => {
        const hash = cyrb53(str);
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 80%)`; // Fixed saturation/lightness for pastel
    };
    const colorCache = {};

    const getRowStyle = (params) => {
        const sharingID = params.data?.sharingID?.toString() || '';
        if (!colorCache[sharingID]) {
            colorCache[sharingID] = getPastelColorFromString(sharingID);
        }
        return { backgroundColor: colorCache[sharingID] };
    };


//   const onExportExcel = () => {
// gridRef.current.api.exportDataAsCsv({
//   fileName: 'NightAuditReport.csv'
// });


// };

const onExportExcel = () => {
  gridRef.current.api.exportDataAsCsv({
    fileName: 'NightAuditReport.csv',
    processCellCallback: (params) => {
      if (params.value === "1") return "Yes";
      if (params.value === "0") return "No";
      return params.value; // normal values
    }
  });
};



    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>Night Audit Report</CardTitle>
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
                                                options={{ allowInput: true }}
                                                placeholder="YYYY-MM-DD "
                                                className={classnames("form-control", {
                                                })}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>

                            <Col md="3" sm="12">
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
                                                // options={optionsToDate}
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
                                <Button className='me-1' color='primary' type='submit' onClick={() => setflag1(true)} disabled={isButtonClicked}>
                                    {isButtonClicked ? 'Processing...' : 'Submit'}
                                </Button>
                                {/* <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                Reset
              </Button> */}
                                {/* {flag == true && */}
                                     <Button className='me-1' color='primary'   onClick={onExportExcel}> Download Excel </Button>
                                    {/* <Button
                                        className='me-1'
                                        color='primary'
                                        onClick={generateExcel}
                                    >
                                        Download Excel
                                    </Button> */}
                                {/* } */}
                                {/* {flag == true && <Button className='me-1' color='primary' onClick={printGrid}>Print PDF </Button>} */}
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
                                {flag == true &&

            <div className="ag-theme-alpine" >
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData1}
                    columnDefs={columnDefs}
                    animateRows={true} rowSelection='multiple'
                    defaultColDef={defaultColDef}
                    // getRowStyle={getRowStyle}

                    headerColor="ddw-primary"
                    domLayout='autoHeight'
                    paginationPageSize="10"
                    pagination="true"
                />
            </div>
}
        </div>
    )
}

export default NoShowReport