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

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'


const MySwal = withReactContent(Swal)

const defaultValues = {
    frmdate: ''
}



const CollectionSummaryReport = () => {

    // AG Grid
    const [rowData, setRowData] = useState();
    const [rowData1, setRowData1] = useState();
    const [flag, setFlag] = useState(false)
    const [filterFromDate, setFilterFromDate] = useState(null);
    const [filterToDate, setFilterToDate] = useState(null);
    const [filterResturant, setfilterResturant] = useState(null);
    const [filtersessionType, setfiltersessionType] = useState(null);
    const [filtersPaymentType, setfiltersPaymentType] = useState(null);
    
    const [hotelName, sethotelName] = useState('');
    const [hotelAddress, sethotelAddress] = useState('');
    const [data, setData] = useState(null)
    const [storeOptions, setStoreOptions] = useState([]);
    const [collectionData, setCollectionData] = useState([])
    const [sessionTypeOptions, setsessionTypeOptions] = useState([]);
    const [paymentTypeOptions, setpaymentTypeOptions] = useState([]);
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
    const CustomHeaderComponentpax = () => {
        return (
            <div>
                Pax
            </div>
        );
    };
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
                TaxAmt
            </div>
        );
    };
    const CustomHeaderComponentRoundoff = () => {
        return (
            <div>
                RoundOff
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
    const CustomHeaderComponentNetamount = () => {
        return (
            <div>
                Net Amount
            </div>
        );
    };
    const CustomHeaderComponentsetamount = () => {
        return (
            <div>
                Set Amount
            </div>
        );
    };


    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Store', field: 'RestaurantName', suppressSizeToFit: true, maxWidth: 200, rowGroup: true },

        // { headerName: 'Bill Date', field: 'BillDate', suppressSizeToFit: true, maxWidth: 200 },
        {
            headerName: 'Bill Date  ', field: 'BillDate', suppressSizeToFit: true, maxWidth: 170, cellRenderer: (params) => {
                if (params.data && params.data.BillDate) {
                    const formattedDate = Moment(params.data.BillDate).format("DD-MM-YYYY");
                    return formattedDate;
                } else {
                    return "";
                }
            }
        },
        { headerName: 'Bill No', field: 'billNoDisplay', suppressSizeToFit: true, maxWidth: 200 },
        { headerName: 'Table', field: 'tableNo', suppressSizeToFit: true, maxWidth: 140 },
        // { headerName: 'Particulars', field: 'Amount', suppressSizeToFit: true, maxWidth: 170 },
        { headerName: 'PAX', field: 'pax', suppressSizeToFit: true, maxWidth: 140, aggFunc: 'sum', headerComponentFramework: CustomHeaderComponentpax },
        { headerName: 'Amount', field: 'Amount', suppressSizeToFit: true, maxWidth: 140, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentAmount },
        { headerName: 'TaxAmt', field: 'TaxAmount', suppressSizeToFit: true, maxWidth: 160, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentTax },
        { headerName: 'Discount', field: 'amtDiscount', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentDisc },
        { headerName: 'Round off', field: 'roundOff', suppressSizeToFit: true, maxWidth: 140, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentRoundoff },
        { headerName: 'Net Amount', field: 'NetAmount', suppressSizeToFit: true, maxWidth: 130, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentNetamount },
        { headerName: 'PayMode', field: 'paymentmode', suppressSizeToFit: true, maxWidth: 140 },
        { headerName: 'Trxn ID', field: 'TransactionID', suppressSizeToFit: true, maxWidth: 190 },
        // { headerName: 'Set Amt', field: 'setAmount', suppressSizeToFit: true, maxWidth: 150, aggFunc: 'sum', valueFormatter: formatNumber, headerComponentFramework: CustomHeaderComponentsetamount },
        { headerName: 'Description', field: 'description', suppressSizeToFit: true, maxWidth: 150 },
        { headerName: 'Remarks', field: 'remarks', suppressSizeToFit: true, maxWidth: 200 },
        { headerName: 'User', field: 'userID', suppressSizeToFit: true, maxWidth: 200 },
        { headerName: 'Session Name', field: 'sessionName', suppressSizeToFit: true, maxWidth: 200 },


    ]);
    const groupDisplayType = 'singleColumn';


    const gridRef = useRef();
    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ));
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

    const cellClickedListener = useCallback(event => {
    }, []);


    // ** State


    // ** Hooks
    const { reset, handleSubmit, control } = useForm({ defaultValues })
    let navigate = useNavigate();
    const [hotelNo, setHotelNo] = useState(null);
    const [hotelFax, sethotelFax] = useState(null)
    const [image, setImage] = useState(null);
    const [logoimage, setLogo] = useState(null);

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
        fetchx(DASHBOARD_URL + '/getStoreList?hotelID=10')
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



    useEffect(() => {
        fetchx(DASHBOARD_URL + '/getAllsession?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                const responseData = resp['data'];
                console.log(responseData)
                const sessionNames = responseData.map((item) => ({
                    label: item.sessionName,
                    value: item.sessionName, // You can set this to the session name if needed
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
                    value: item.paymentTypeCode,
                }));
                setpaymentTypeOptions(paymentTypes);
            })
            .catch(error => {
                console.error("Error fetchxing data:", error);
            });
    }, [])

    const getCollectionData = data => {
        setIsButtonClicked(true)
        setLoading(true)
        const filterFromDate = Moment(data.frmdate[0]).format("DD-MM-YYYY");
        const filterToDate = Moment(data.todate[0]).format("DD-MM-YYYY");
        setFilterFromDate(filterFromDate);
        setFilterToDate(filterToDate);

        const storeIDs = Array.isArray(data.storeID) ? data.storeID.map(item => item.value) : [];
        const sessionTypes = Array.isArray(data.sessionType) ? data.sessionType.map(item => item.value) : [];
        const paymentTypes = Array.isArray(data.paymentType) ? data.paymentType.map(item => item.value) : [];
        let createmarketGroup;
        const selectedResturants = data.storeID && data.storeID.map(item => item.label);
        setfilterResturant(selectedResturants)
        const filtersessionTypes = Array.isArray(data.sessionType) ? data.sessionType.map(item => item.label) : [];
        setfiltersessionType(filtersessionTypes)
        const filterpaymentTypes = Array.isArray(data.paymentType) ? data.paymentType.map(item => item.label) : [];
        setfiltersPaymentType(filterpaymentTypes)
        createmarketGroup = JSON.stringify({
            "hotelID": 1,
            "storeID": storeIDs,
            // "sessionType":sessionTypes,
            "fromDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
            "toDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD"),
            "sessionType": sessionTypes,
            "paymentType": paymentTypes,

        })

        setData(data)
        setFlag(true)
        let res = fetchx(DASHBOARD_URL + "/getCollectionSummaryReport", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: createmarketGroup
        }).then(data => data.json())
            .then((res) => {
                setIsButtonClicked(false)
                if (res['statusCode'] == 200) {
                    setLoading(false)
                // Assuming res.data is an array of arrays (modifiedData)
                const modifiedData = res.data;
                setRowData(modifiedData);
                // setRowData(modifiedData);
                setCollectionData(modifiedData);
                }
            });
    }


    const handleReset = () => {
        reset({

            block: ''
        })
    }

    const onBtnExport = () => {
        const params = {
            fileName: "CollectionSummary_Report.xlsx",
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
        if (filterFromDate && filterToDate) {


            const gridApi = gridRef.current && gridRef.current.api;

            if (gridApi) {

                const rowData = gridApi.getDataAsCsv({ skipHeader: false, skipFooters: false, skipGroups: false });
                const headerRow = rowData.substring(0, rowData.indexOf('\n'));
                const cleanHeaderRow = headerRow.replace(/"/g, '');
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

                // pdf.addImage(Logo, 'JPEG', xLogo, yLogo, logoWidth, logoHeight);

                const margin = { left: 5, right: 5 };

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




                const textToCenter = "Collection Summary Report";

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
                        return ''; // Return empty string if date is not a valid Date object
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
                    0: { cellWidth: 15 },
                    1: { cellWidth: 18 },
                    2: { cellWidth: 18 },
                    3: { cellWidth: 15 },
                    4: { cellWidth: 15 },
                    5: { cellWidth: 13 },
                    6: { cellWidth: 18 },
                    7: { cellWidth: 18 },
                    8: { cellWidth: 10 },
                    9: { cellWidth: 18 },
                    10: { cellWidth: 21 },
                    11: { cellWidth: 21 },
                    12: { cellWidth: 15 },
                    13: { cellWidth: 15 },
                    14: { cellWidth: 15 },
                    15: { cellWidth: 15 },

                };

                const billDateTimeIndex = 2;

                if (billDateTimeIndex !== -1) {
                    // Format billDateTime column in rows
                    rows.forEach(row => {
                        const billDateTimeValue = new Date(row[billDateTimeIndex]);
                        row[billDateTimeIndex] = formatDate(billDateTimeValue);
                    });
                }
                const columnsToFormat = [6, 7, 8, 9, 10];

                rows.forEach(row => {
                    columnsToFormat.forEach(columnIndex => {
                        const value = row[columnIndex];
                        if (value !== undefined) {
                            row[columnIndex] = Number(value).toFixed(2);
                        }
                        if (!isNaN(Number(value))) {
                            row[columnIndex] = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value));
                        }
                    });
                });

                pdf.autoTable({
                    head: [modifiedHeaders],
                    body: rows.map(row => row.map(value => value.trim())),
                    startY: dateY + 20,
                    columnStyles

                });
                dateY = pdf.autoTable.previous.finalY + 20;

                pdf.text(`Filter From Bill Date: ${filterFromDate}`, 10, dateY + 10, { width: 500, align: 'left' });
                pdf.text(`To Bill Date: ${filterToDate}`, 10, dateY + 20, { width: 500, align: 'left' });
                pdf.save('Collection Summary Report.pdf');
            } else {
            }
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
            const worksheet = workbook.addWorksheet('Collection Summary Report');
    
            const columns = [
                { header: 'Store', key: 'RestaurantName', width: 20 },
                { header: 'Bill Date', key: 'BillDate', width: 15 },
                { header: 'Bill No', key: 'billNoDisplay', width: 15 },
                { header: 'Table', key: 'tableNo', width: 15 },
                { header: 'PAX', key: 'pax', width: 10 },
                { header: 'Amount', key: 'Amount', width: 15 },
                { header: 'TaxAmt', key: 'TaxAmount', width: 15 },
                { header: 'Discount', key: 'amtDiscount', width: 15 },
                { header: 'Round off', key: 'roundOff', width: 15 },
                { header: 'Net Amount', key: 'NetAmount', width: 15 },
                { header: 'PayMode', key: 'paymentmode', width: 15 },
                { header: 'Trxn ID', key: 'TransactionID', width: 20 },
                { header: 'Description', key: 'description', width: 30 },
                { header: 'Remarks', key: 'remarks', width: 30 },
                { header: 'User', key: 'userID', width: 20 }
            ];
            worksheet.columns = columns;
    
            worksheet.addRow(['Report Name:', 'Collection Summary Report']);
            worksheet.addRow(['Filter From Bill Date:', filterFromDate]);
            worksheet.addRow(['To Date:', filterToDate]);
    
            let selectedFilterResturant = filterResturant && filterResturant.length !== 0
                ? filterResturant.toString()
                : 'All';
    
            worksheet.addRow(['Filter Resturants:', selectedFilterResturant]);
            
            let selectedFilterSession = filtersessionType && filtersessionType.length !== 0
            ? filtersessionType.toString()
            : 'All';

             worksheet.addRow(['Filter Resturants:', selectedFilterSession]);

             let selectedFilterPaymentType = filtersPaymentType && filtersPaymentType.length !== 0
             ? filtersPaymentType.toString()
             : 'All';
 
              worksheet.addRow(['Filter Resturants:', selectedFilterPaymentType]);
            worksheet.addRow([]);
    
            worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
    
            worksheet.getRow(1).font = { bold: true }; 
            worksheet.getRow(2).font = { bold: true }; 
            worksheet.getRow(3).font = { bold: true }; 
            worksheet.getRow(4).font = { bold: true };
            worksheet.getRow(5).font = { bold: true };
            worksheet.getRow(6).font = { bold: true };
            worksheet.getRow(7).font = { bold: true };

    
            rowData.sort((a, b) => a.storeID - b.storeID);
            let formattedRows = []; 
    
            let totalAmount = 0;
            let totalTaxAmount = 0;
            let totalDiscount = 0;
            let totalRoundOff = 0;
            let totalNetAmount = 0;
    
            rowData.forEach((row) => {
                let formattedRow = {
                    RestaurantName: row.RestaurantName,
                    BillDate: row.BillDate,
                    billNoDisplay: row.billNoDisplay,
                    tableNo: row.tableNo,
                    pax: row.pax,
                    Amount: parseFloat(row.Amount),
                    TaxAmount: parseFloat(row.TaxAmount),
                    amtDiscount: parseFloat(row.amtDiscount),
                    roundOff: parseFloat(row.roundOff).toFixed(2),
                    NetAmount: parseFloat(row.NetAmount),
                    paymentmode: row.paymentmode,
                    TransactionID: row.TransactionID,
                    description: row.description,
                    remarks: row.remarks,
                    userID: row.userID
                };
    
                totalAmount += parseFloat(row.Amount);
                totalTaxAmount += parseFloat(row.TaxAmount);
                totalDiscount += parseFloat(row.amtDiscount);
                totalRoundOff += parseFloat(row.roundOff);
                totalNetAmount += parseFloat(row.NetAmount);
    
                formattedRows.push(formattedRow);
            });
    
            formattedRows.forEach((row) => {
                worksheet.addRow(row);
            });
            worksheet.spliceRows(1, 1);

            // Add total row at the end
            worksheet.addRow([]);
            worksheet.addRow({
                RestaurantName: 'Total',
                Amount: totalAmount.toFixed(2),
                TaxAmount: totalTaxAmount.toFixed(2),
                amtDiscount: totalDiscount.toFixed(2),
                roundOff: totalRoundOff.toFixed(2),
                NetAmount: totalNetAmount.toFixed(2)
            }).font = { bold: true };
    
            worksheet.columns.forEach((column, index) => {
                if ([3, 4, 5, 6, 7, 8, 9].includes(index)) {
                    column.alignment = { vertical: 'middle', horizontal: 'right' }; 
                } else {
                    column.alignment = { vertical: 'middle', horizontal: 'left' };
                }
            });
    
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 10);
    
            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/octet-stream' });
                saveAs(blob, `Collection_Summary_Report_${formattedDate}.xlsx`);
            }).catch((error) => {
                console.error('Error generating Excel file:', error);
            });
        }
    };
    
    


    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>Collection Summary Report</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(getCollectionData)}>
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
                                    {/* <Button
                                        className='me-1'
                                        color='primary'
                                        onClick={onBtnExport}
                                    >
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

                                {/* {flag && (
                                    <Button
                                        className='me-1'
                                        color='primary'
                                        onClick={downloadCSV}
                                    >
                                        Download CSV
                                    </Button>
                                )} */}
                            </div>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
            
             {loading == true ? (
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
                        // groupIncludeTotalFooter={true}
                        autoGroupColumnDef={autoGroupColumnDef}
                        groupIncludeFooter={true}
                        groupIncludeTotalFooter={true}
                    />
                </div>
            )
            )}


        </div>
    )
}

export default CollectionSummaryReport