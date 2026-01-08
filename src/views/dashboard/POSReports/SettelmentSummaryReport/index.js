// ** React Imports
import { useState } from 'react'
import Select from "react-select";
import 'ag-grid-enterprise';
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Input, InputGroup, InputGroupText, Table } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { AgGridReact } from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import { useNavigate } from 'react-router-dom';

// ** Utils
import { selectThemeColors } from "@utils";
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Logo from '@src/assets/images/logo/oterra.jpg'
import { createRoot } from 'react-dom/client';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'


const MySwal = withReactContent(Swal)

const defaultValues = {
    frmdate: ''
}
const SettelmentSummaryReport = () => {
    // AG Grid
    const [rowData, setRowData] = useState([]);
    const gridRef = useRef();
    const { reset, handleSubmit, control } = useForm({ defaultValues });
    let navigate = useNavigate();
    const [flag, setFlag] = useState(false);
    const [data, setData] = useState(null);
    const [storeOptions, setStoreOptions] = useState([]);
    const [sessionTypeOptions, setsessionTypeOptions] = useState([]);
    const [paymentTypeOptions, setpaymentTypeOptions] = useState([]);
    const [filterFromDate, setFilterFromDate] = useState(null);
    const [filterToDate, setFilterToDate] = useState(null);
    const [hotelName, sethotelName] = useState('');
    const [hotelAddress, sethotelAddress] = useState('');
    const [hotelNo, setHotelNo] = useState(null);
    const [hotelFax, sethotelFax] = useState(null)
    const [image, setImage] = useState(null);
    const [logoimage, setLogo] = useState(null);
    const [filterResturant, setfilterResturant] = useState(null);
    const [filterSessionType, setfilterSessionType] = useState(null);
    const [filterPaymenttype, setfilterPaymenttype] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    function formatNumber(params) {
        var number = params.value;

        if (typeof number !== 'number' || isNaN(number)) {
            return '';
        }

        var formattedNumber = Math.floor(number).toFixed(2);
        return formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }

    const CustomHeaderComponentAmount = () => {
        return (
            <div>
                Amount
            </div>
        );
    };
    const CustomHeaderComponentTax = () => {
        return (
            <div>
                Tax/SC
            </div>
        );
    };
    const CustomHeaderComponentRoundoff = () => {
        return (
            <div>
                Roundoff
            </div>
        );
    };
    const CustomHeaderComponentDisc = () => {
        return (
            <div>
                Discount
            </div>
        );
    };
    const CustomHeaderComponentTotalamount = () => {
        return (
            <div>
                Total Amount
            </div>
        );
    };

    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Resturant', field: 'restaurantName', suppressSizeToFit: true, maxWidth: 200, rowGroup: true },
        { headerName: 'BillNo', field: 'billNoDisplay', suppressSizeToFit: true, maxWidth: 200 },
        { headerName: 'Table/Room', field: 'TableNo', suppressSizeToFit: true, maxWidth: 140 },
        // {headerName: 'Particulars',field: 'Amount',suppressSizeToFit: true, maxWidth: 170 },
        { headerName: 'Amount', field: 'Amount', suppressSizeToFit: true, maxWidth: 140, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentAmount },
        { headerName: 'Tax/SC', field: 'tax', suppressSizeToFit: true, maxWidth: 140, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTax },
        { headerName: 'Roundoff', field: 'roundOff', suppressSizeToFit: true, maxWidth: 160, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentRoundoff },
        { headerName: 'Discount', field: 'discount', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentDisc },
        { headerName: 'TotalAmount', field: 'totalAmount', suppressSizeToFit: true, maxWidth: 140, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTotalamount },
        { headerName: 'Remarks', field: 'renarks', suppressSizeToFit: true, maxWidth: 130 },
        { headerName: 'UserId', field: 'userID', suppressSizeToFit: true, maxWidth: 140 },
        { headerName: 'Payment Breakup', field: 'paymentmode', suppressSizeToFit: true, maxWidth: 190 },
        { headerName: 'Guest Type', field: 'guestType', suppressSizeToFit: true, maxWidth: 150 },
        // { headerName: 'Session Name', field: 'sessionName', suppressSizeToFit: true, maxWidth: 150 ,rowGroup: true},
        {
            headerName: 'Session Name',
            field: 'sessionName',
            suppressSizeToFit: true,
            maxWidth: 150,
            rowGroup: true,
            valueFormatter: ({ value }) => value ? value : 'PMS Trxns'
        },
        // { headerName: 'Bill DateTime', field: 'billDateTime', suppressSizeToFit: true, maxWidth: 200},
        {
            headerName: 'Bill DateTime  ', field: 'billDateTime', suppressSizeToFit: true, maxWidth: 170, cellRenderer: (params) => {
                if (params.data && params.data.billDateTime) {
                    const formattedDate = Moment(params.data.billDateTime).format("DD-MM-YYYY hh:mm:ss");
                    return formattedDate;
                } else {
                    return "";
                }
            }
        },

        // Add other columns based on your data
    ]);
    const groupDisplayType = 'singleColumn';


    const defaultColDef = {
        sortable: true,
        filter: true,
        filterParams: {
            buttons: ['apply', 'reset'],
        },
    };
    const autoGroupColumnDef = useMemo(() => {
        return {
            minWidth: 300,
            cellRendererParams: {
                footerValueGetter: (params) => {
                    const isRootLevel = params.node.level === -1;
                    if (isRootLevel) {
                        return 'Grand Total';
                    }
                    return `${params.value} Total`;
                },
            },
        };
    }, []);

    const cellClickedListener = (event) => {
        console.log('cellClicked', event);
    };

    useEffect(() => {
        // fetchx today's date from your API
        fetchx(DASHBOARD_URL + "/getBusinessDate", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hotelID: 1 })
        })
            .then((res) => res.json())
            .then(postres => {
                const hotelName1 = postres.data[0].name;
                const hotelAddress1 = postres.data[0].address;
                const logo = postres.data[0].logo
                const number = postres.data[0].phoneNumber
                const fax = postres.data[0].fax
                console.log(hotelName)
                console.log(postres)
                sethotelName(hotelName1);
                sethotelAddress(hotelAddress1);
                setHotelNo(number)
                sethotelFax(fax)
                setLogo(logo)

            })
            .catch(error => {
                console.error("Error fetchxing business date:", error);
            });
    }, []);
    useEffect(() => {
        fetchx(DASHBOARD_URL + '/getAllsession?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                const responseData = resp['data'];

                const sessionNames = responseData.map((item) => ({
                    label: item.sessionName,
                    value: item.sessionName,
                }));
                setsessionTypeOptions(sessionNames);
            })
            .catch(error => {
                console.error("Error fetchxing data:", error);
            });
    }, [])
    useEffect(() => {
        fetchx(DASHBOARD_URL + '/getPaymentType?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                const responseData = resp['data'];
                const activePaymentTypes = responseData.filter((item) => item.isActive === 1);

                const paymentTypes = activePaymentTypes.map((item) => ({
                    label: item.paymentTypeCode,
                    value: item.id,
                }));
                setpaymentTypeOptions(paymentTypes);
            })
            .catch(error => {
                console.error("Error fetchxing data:", error);
            });
    }, [])

    useEffect(() => {
        fetchx(DASHBOARD_URL + '/getStoreList?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                const responseData = resp['data'];

                // setStoreOptions(options);
                setStoreOptions(responseData);
            })
            .catch(error => {
                console.error("Error fetchxing data:", error);
            });
    }, [])
    const getSalessummaryData = (data) => {
        setIsButtonClicked(true)
        setLoading(true);

        const filterFromDate = Moment(data.frmdate[0]).format("DD-MM-YYYY");
        const filterToDate = Moment(data.todate[0]).format("DD-MM-YYYY");
        setFilterFromDate(filterFromDate);
        setFilterToDate(filterToDate);

        const storeIDs = Array.isArray(data.storeID) ? data.storeID.map((item) => item.value) : [];
        // const paymentTypes = Array.isArray(data.paymentType) ? data.paymentType.map((item) => item.label) : [];
        const paymentTypes = Array.isArray(data.paymentType)
            ? data.paymentType.map((item) => {
                if (item.label === "Post To Room") {
                    return "Guest";
                } else {
                    return item.label;
                }
            })
            : [];
        const sessionTypes = Array.isArray(data.sessionType) ? data.sessionType.map((item) => item.value) : [];
        const selectedResturants = data.storeID && data.storeID.map(item => item.label);
        setfilterResturant(selectedResturants)
        const selectedSessionType = data.sessionType && data.sessionType.map(item => item.label);
        setfilterSessionType(selectedSessionType)
        const selectedPaymentType = data.paymentType && data.paymentType.map(item => item.label);
        setfilterPaymenttype(selectedPaymentType)

        const createMarketGroupObj = {
            hotelID: 1,
            fromDate: Moment(String(new Date(data.frmdate[0]))).format('YYYY-MM-DD'),
            toDate: Moment(String(new Date(data.todate[0]))).format('YYYY-MM-DD'),
        };

        if (storeIDs && storeIDs.length > 0) {
            createMarketGroupObj.storeID = storeIDs;
        }

        if (paymentTypes && paymentTypes.length > 0) {
            createMarketGroupObj.paymentType = paymentTypes;
        }

        if (sessionTypes && sessionTypes.length > 0) {
            createMarketGroupObj.sessionType = sessionTypes;
        }
        console.log(createMarketGroupObj)
        setData(data);
        setFlag(true);

        fetchx(DASHBOARD_URL + '/getSettlementSummaryReport', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createMarketGroupObj),
        })
            .then((response) => response.json())
            .then((res) => {
                setIsButtonClicked(false)
                if (res['statusCode'] == 200) {
                    setLoading(false)
                setRowData(res.data); // Assuming your response has a property 'data' containing the row data
                }
            })
            .catch((error) => console.error('Error:', error));
    };

    const handleReset = () => {
        reset({});
    };

    const onBtnExport = () => {
        const params = {
            fileName: "SettlementSummary_Report.xlsx",
            sheetName: "Sheet1",
            processHeaderCallback: (params) => {
                return params.column.getColDef().headerName;
            },
            processCellCallback: (params) => {
                if (params.column && params.column.getColDef().aggFunc === 'sum') {
                    if (!isNaN(params.value)) {
                        return Number(params.value).toFixed(2);
                    }
                }
                return params.value;
            },
        };

        gridRef.current.api.exportDataAsExcel(params);
    };
    const printGrid = () => {

        const gridApi = gridRef.current && gridRef.current.api;

        if (gridApi) {

            const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
            const headerRow = rowData.substring(0, rowData.indexOf('\n'));
            const cleanHeaderRow = headerRow.replace(/"/g, '');
            const dataRows = rowData.substring(rowData.indexOf('\n') + 1);
            const cleanData = dataRows.replace(/"/g, '');
            const rows = cleanData.split('\n').map(row => row.split(','));
            const pdf = new jsPDF({ orientation: 'landscape' });

            // Calculate center for the logo

            const xLogo = 10; // X-coordinate for the logo
            const yLogo = 10;
            // Calculate center for the logo
            const pageWidth = pdf.internal.pageSize.getWidth();
            const logoWidth = 15;
            const xCenter = (pageWidth - logoWidth) / 2;
            // Add logo
            const logoHeight = 15;
            let dateY = 20;

            pdf.addImage(DASHBOARD_URL+`/imagepaths/${logoimage}`, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

            // pdf.addImage(Logo, "JPEG", xCenter, 10, logoWidth, logoHeight);
            const currentDate = new Date();
            const formattedDate = formatDateTimeWithAMPM(currentDate);
            const paddingFromRight = 85;
            const dateX = pageWidth - pdf.getStringUnitWidth(formattedDate) - paddingFromRight;
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.text("Generated Time " + formattedDate, dateX + 35, dateY - 7);


            //   // Handle other hotelIds if needed
            const setHotelInfo = (pdf, textToCenter, xLogo, logoWidth, yLogo, fontsize) => {
                // Set font size and style
                pdf.setFontSize(fontsize);
                pdf.setFont('helvetica', 'normal');

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

                // Draw the text on the PDF
                pdf.text(`${textToCenter}`, textStartX, yLogo); // Adjust the y position as needed
            };

            // Determine the width of the hotel name and address
            const hotelNameWidth = pdf.getStringUnitWidth(hotelName) * 14;
            const hotelAddressWidth = pdf.getStringUnitWidth(hotelAddress) * 12;

            // Set hotel name
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'normal');
            setHotelInfo(pdf, hotelName, xLogo, logoWidth, yLogo, 14);

            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            setHotelInfo(pdf, hotelAddress, xLogo, logoWidth, yLogo + 8, 12); // Adjust the y position as needed




            const textToCenter = "Settlement Summary Report";

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
            pdf.setFont('helvetica', 'bold')
            function formatDate(date) {
                if (!(date instanceof Date) || isNaN(date.getTime())) {
                    return '';
                }

                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}.${month}.${year}`;
            }


            const headers = cleanHeaderRow.split(',').map(value => value.trim());
            const modifiedHeaders = headers.map(header => {
                const matches = header.match(/sum\((.*)\)/i);
                return matches ? matches[1] : header;
            });
            const columnStyles = {
                0: { cellWidth: 21 },
                1: { cellWidth: 18 },
                2: { cellWidth: 18 },
                3: { cellWidth: 15 },
                4: { cellWidth: 18 },
                5: { cellWidth: 18 },
                6: { cellWidth: 15 },
                7: { cellWidth: 10 },
                8: { cellWidth: 21 },
                9: { cellWidth: 10 },
                10: { cellWidth: 21 },
                11: { cellWidth: 21 },
                12: { cellWidth: 21 },
                13: { cellWidth: 21 },
                14: { cellWidth: 21 },
            };

            const billDateTimeIndex = 14;

            if (billDateTimeIndex !== -1) {
                // Format billDateTime column in rows
                rows.forEach(row => {
                    const billDateTimeValue = new Date(row[billDateTimeIndex]);
                    row[billDateTimeIndex] = formatDate(billDateTimeValue);
                });
            }
            const columnsToFormat = [4, 5, 6, 7, 8];

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
                head: [modifiedHeaders],
                body: rows.map(row => row.map(value => value.trim())),
                startY: 35,
                columnStyles

            });
            dateY = pdf.autoTable.previous.finalY + 20;

            pdf.text(`Filter From Bill Date: ${filterFromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
            pdf.text(`To Bill Date: ${filterToDate}`, 10, dateY + 20, { width: 500, align: 'left' });
            pdf.save('Settlement Summary Report.pdf');
        } else {
        }
    };

    function formatDate(dateTimeString) {
        const date = new Date(dateTimeString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
    function formatDateTimeWithAMPM(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        let hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = (hours % 12) || 12; // Convert to 12-hour format
        const formattedHours = hours.toString().padStart(2, '0');

        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${day}.${month}.${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
    }

    const generateExcel = () => {
        if (filterFromDate && filterToDate) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Settlement Summary Report'); // Updated report name
    
            // Updated columns as per the new headers and keys
            const columns = [
                { header: 'Restaurant', key: 'restaurantName', width: 20 },
                { header: 'BillNo', key: 'billNoDisplay', width: 15 },
                { header: 'Table/Room', key: 'TableNo', width: 15 },
                { header: 'Amount', key: 'Amount', width: 15 },
                { header: 'Tax/SC', key: 'tax', width: 10 },
                { header: 'Roundoff', key: 'roundOff', width: 10 },
                { header: 'Discount', key: 'discount', width: 10 },
                { header: 'TotalAmount', key: 'totalAmount', width: 20 },
                { header: 'Remarks', key: 'remarks', width: 30 },
                { header: 'UserId', key: 'userID', width: 20 },
                { header: 'Payment Breakup', key: 'paymentmode', width: 20 },
                { header: 'Guest Type', key: 'guestType', width: 20 },
                { header: 'Session Name', key: 'sessionName', width: 20 },
                { header: 'Bill DateTime', key: 'billDateTime', width: 20 }
            ];
    
            worksheet.columns = columns;
    
            // Update report name and other static details
            worksheet.addRow(['Report Name:', 'Settlement Summary Report']);
            worksheet.addRow(['Filter From Bill Date:', filterFromDate]);
            worksheet.addRow(['To Date:', filterToDate]);
    
            let selectedFilterRestaurant = filterResturant && filterResturant.length !== 0
                ? filterResturant.toString()
                : 'All';
            let selectedFilterSessionType = filterSessionType && filterSessionType.length !== 0
                ? filterSessionType.toString()
                : 'All';
            let selectedFilterPaymentType = filterPaymenttype && filterPaymenttype.length !== 0
                ? filterPaymenttype.toString()
                : 'All';
    
            worksheet.addRow(['Filter Restaurants:', selectedFilterRestaurant]);
            worksheet.addRow(['Filter SessionName:', selectedFilterSessionType]);
            worksheet.addRow(['Filter PaymentType:', selectedFilterPaymentType]);
    
            worksheet.addRow([]);
    
            // Add header row with updated columns
            worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
    
            // Make specific rows bold
            for (let i = 1; i <= 7; i++) {
                worksheet.getRow(i).font = { bold: true };
            }
    
            worksheet.spliceRows(1, 1);

            // Process and format rowData
            rowData.sort((a, b) => a.storeID - b.storeID);
            let formattedRows = [];
    
            let totalAmount = 0;
            let totalTax = 0;
            let totalRoundOff = 0;
            let totalDiscount = 0;
            let grandTotal = 0;
    
            rowData.forEach((row) => {
                let formattedRow = {
                    restaurantName: row.restaurantName,
                    billNoDisplay: row.billNoDisplay,
                    TableNo: row.TableNo,
                    Amount: parseFloat(row.Amount),
                    tax: parseFloat(row.tax),
                    roundOff: parseFloat(row.roundOff).toFixed(2),
                    discount: parseFloat(row.discount),
                    totalAmount: parseFloat(row.totalAmount),
                    remarks: row.remarks,
                    userID: row.userID,
                    paymentmode: row.paymentmode,
                    guestType: row.guestType,
                    sessionName: row.sessionName,
                    billDateTime: row.billDateTime
                };
                formattedRows.push(formattedRow);
    
                // Accumulate totals
                totalAmount += formattedRow.Amount;
                totalTax += formattedRow.tax;
                totalRoundOff += parseFloat(formattedRow.roundOff);
                totalDiscount += formattedRow.discount;
                grandTotal += formattedRow.totalAmount;
            });
    
            formattedRows.forEach((row) => {
                worksheet.addRow(row);
            });
    
            // Add a totals row at the end
            worksheet.addRow([]); // Empty row before totals
            const totalsRow = worksheet.addRow([
                'Total',
                '', // empty cell for non-numeric fields
                '', // empty cell for non-numeric fields
                totalAmount,
                totalTax,
                totalRoundOff.toFixed(2),
                totalDiscount,
                grandTotal
            ]);
            totalsRow.font = { bold: true };
    
            // Adjust alignment for columns
            worksheet.columns.forEach((column, index) => {
                if ([3, 4, 5, 6, 7].includes(index)) { // Numeric columns
                    column.alignment = { vertical: 'middle', horizontal: 'right' };
                } else {
                    column.alignment = { vertical: 'middle', horizontal: 'left' };
                }
            });
    
            // Generate Excel file and prompt download
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 10);
            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/octet-stream' });
                // saveAs(blob, 'Settlement Summary Report.xlsx'); // Updated filename
                saveAs(blob, `Settlement Summary Report_${formattedDate}.xlsx`);
    
            }).catch((error) => {
                console.error('Error generating Excel file:', error);
            });
        }
    };
    
    
    
    

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>Settlement Summary Report</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(getSalessummaryData)}>
                        <Row>
                            <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='storeID'>
                                        Store Name <spam style={{ color: 'red' }}>*</spam>
                                    </Label>
                                    <Controller
                                        id="storeID"
                                        control={control}
                                        name="storeID"
                                        render={({ field }) => (
                                            <Select
                                                isMulti
                                                // required
                                                isClearable
                                                options={storeOptions}
                                                classNamePrefix="select"
                                                theme={selectThemeColors}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                            <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='sessionType'>
                                        Session Type
                                    </Label>
                                    <Controller
                                        id="sessionType"
                                        control={control}
                                        name="sessionType"
                                        render={({ field }) => (
                                            <Select
                                                isMulti
                                                // required
                                                isClearable
                                                options={sessionTypeOptions}
                                                classNamePrefix="select"
                                                theme={selectThemeColors}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                            <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='paymentType'>
                                        Payment Type
                                    </Label>
                                    <Controller
                                        id="paymentType"
                                        control={control}
                                        name="paymentType"
                                        render={({ field }) => (
                                            <Select
                                                isMulti
                                                // required
                                                isClearable
                                                options={paymentTypeOptions}
                                                classNamePrefix="select"
                                                theme={selectThemeColors}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                        </Row>
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

                            <div className='d-flex'>
                                {/* <Button className='me-1' color='primary' type='submit'>
                                    Submit
                                </Button> */}
                                 <Button className='me-1' color='primary' type='submit' disabled={isButtonClicked}>
                            {isButtonClicked ? 'Processing...' : 'Submit'}
                            </Button>
                                {/* <Button outline color='secondary' type='reset' onClick={handleReset}>
                                    Reset
                                </Button> */}
                                <span style={{ margin: '10px' }}></span>

                                {flag && (
                                    <div>
                                    {/* <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}>
                                        Download Excel
                                    </Button> */}
                                     <Button className='me-1' color='primary' onClick={generateExcel}>
                                        Download Excel
                                    </Button>
                                    <Button className='me-1' color='primary' onClick={printGrid}>
                                    Print PDF
                                    </Button>
                                    </div>
                                )}
                            </div>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
             {loading == true ? (
        //   <div style={{ textAlign: 'center', padding: '20px' }}>
        //     <h1 style={{ fontWeight: 'bold', color: 'grey' }}>Loading data, please wait...</h1>
        //   </div>
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
        ):(

            flag && (
  <div className='ag-theme-alpine'>
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}
      groupDisplayType={groupDisplayType}
      animateRows={true}
      rowSelection='multiple'
      onCellClicked={cellClickedListener}
      defaultColDef={defaultColDef}
      domLayout='autoHeight'
      ref={gridRef}
    //   groupIncludeTotalFooter={true}
    autoGroupColumnDef={autoGroupColumnDef}
    groupIncludeFooter={true}
    groupIncludeTotalFooter={true}

    />
  </div>
            )
)}
        </div>
    );
};

export default SettelmentSummaryReport;


