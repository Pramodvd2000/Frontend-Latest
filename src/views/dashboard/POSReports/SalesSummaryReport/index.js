// ** React Imports
import { useState } from 'react'
import { StrictMode } from 'react'

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
import { selectThemeColors } from "@utils";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Logo from '@src/assets/images/logo/oterra.jpg'
import { createRoot } from 'react-dom/client';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'


const defaultValues = {
    frmdate: ''
}



const SalesSummaryReport = () => {

    // AG Grid
    const [rowData, setRowData] = useState();
    const [flag, setFlag] = useState(false)
    const gridRef = useRef();
    const [data, setData] = useState(null)


    function formatNumber(params) {
        var number = params.value;

        if (typeof number !== 'number' || isNaN(number)) {
            return '';
        }

        var formattedNumber = Math.floor(number).toFixed(2);
        return formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }

    const [storeOptions, setStoreOptions] = useState([]);
    const [salesSummaryData, setSalesSummaryData] = useState([])
    //   const [salesSummaryData, setColSummaryData] = useState([])

    const [filterFromDate, setFilterFromDate] = useState(null);
    const [filterToDate, setFilterToDate] = useState(null);
    const [hotelName, sethotelName] = useState('');
    const [hotelAddress, sethotelAddress] = useState('');
    const [filterResturant, setfilterResturant] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [isButtonClicked, setIsButtonClicked] = useState(false);



    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            wrapText: true,
            autoHeight: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
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
        console.log('cellClicked', event);
    }, []);

    const { reset, handleSubmit, control } = useForm({ defaultValues })

    const headerTotalBills = () => {
        return (
            <div>
                Total Bills
            </div>
        );
    };
    const headerCovers = () => {
        return (
            <div>
                Covers
            </div>
        );
    };
    const headerBillAmount = () => {
        return (
            <div>
                Bill Amount
            </div>
        );
    };
    const headerDiscount = () => {
        return (
            <div>
                Discount
            </div>
        );
    };
    const headerGrossAmt = () => {
        return (
            <div>
                Gross Amt
            </div>
        );
    };
    const headerCGST = () => {
        return (
            <div>
                CGST
            </div>
        );
    };

    const headerSGST = () => {
        return (
            <div>
                SGST
            </div>
        );
    };
    const headerroundoff = () => {
        return (
            <div>
                RoundOff
            </div>
        );
    };
    const headerNetAmt = () => {
        return (
            <div>
                Net Amt
            </div>
        );
    };
    const headerrFoodWithTax = () => {
        return (
            <div>
                Food(With Tax)
            </div>
        );
    };
    const headerrLiquorWithTax = () => {
        return (
            <div>
                Liquor(With Tax)
            </div>
        );
    };
    const headerrSoftdrinkWithTax = () => {
        return (
            <div>
                Softdrink(With Tax)
            </div>
        );
    };
    const headerrSmokesWithTax = () => {
        return (
            <div>
                Smokes(With Tax)
            </div>
        );
    };
    const headerrOthersWithTax = () => {
        return (
            <div>
                Others(With Tax)
            </div>
        );
    };
    const headerrFoodWithoutTax = () => {
        return (
            <div>
                Food(Without Tax)
            </div>
        );
    };
    const headerrLiquorWithoutTax = () => {
        return (
            <div>
                Liquor(Without Tax)
            </div>
        );
    };
    const headerrSoftdrinkWithoutTax = () => {
        return (
            <div>
                Softdrink(Without Tax)
            </div>
        );
    };
    const headerrSmokesWithoutTax = () => {
        return (
            <div>
                Smokes(Without Tax)
            </div>
        );
    };
    const headerrOthersWithoutTax = () => {
        return (
            <div>
                Others(Without Tax)
            </div>
        );
    };
    const headerCASH = () => {
        return (
            <div>
                Cash
            </div>
        );
    };
    const headerrCreditCard = () => {
        return (
            <div>
                Credit Card
            </div>
        );
    };
    const headerrAmex = () => {
        return (
            <div>
                Amex
            </div>
        );
    };
    const headerrCompany = () => {
        return (
            <div>
                Company
            </div>
        );
    };
    const headerrOnlinePayment = () => {
        return (
            <div>
                Online Payment
            </div>
        );
    };
    const headerGuest = () => {
        return (
            <div>
                Guest
            </div>
        );
    };
    const headerRazorPay = () => {
        return (
            <div>
                Razor Pay
            </div>
        );
    };
    const headerAxisBank = () => {
        return (
            <div>
                AXIS Bank Cards
            </div>
        );
    };

    // headerComponentFramework: headerTotalBills,


    const columnDefs = [
        {
            headerName: 'Store Name', field: 'restaurantName', suppressSizeToFit: true, maxWidth: 130, rowGroup: true
        },
        {
            headerName: 'Bill Date', field: 'BillDate', suppressSizeToFit: true, maxWidth: 130,
            cellRenderer: (params) => {
                if (params.data && params.data.BillDate) {
                    const formattedDate = Moment(params.data.BillDate).format("DD-MM-YYYY hh:mm:ss");
                    return formattedDate;
                } else {
                    return "";
                }
            }
        },
        {
            headerName: 'Total Bills', field: 'TotalBills', suppressSizeToFit: true, maxWidth: 100,
            headerComponentFramework: headerTotalBills,

            aggFunc: 'sum',

        },
        {
            headerName: 'Covers', field: 'Covers', suppressSizeToFit: true, maxWidth: 100,
            headerComponentFramework: headerCovers,
            aggFunc: 'sum'
        },
        {
            headerName: 'Bill Amt', field: 'BillAmount', suppressSizeToFit: true, maxWidth: 130,
            headerComponentFramework: headerBillAmount,
            aggFunc: 'sum',
            valueFormatter: formatNumber

        },
        {
            headerName: 'Discount', field: 'Discount', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum',
            headerComponentFramework: headerDiscount,
            valueFormatter: formatNumber


        },
        {
            headerName: 'Gross Amt', field: 'GrossAmount', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum',
            headerComponentFramework: headerGrossAmt,
            valueFormatter: formatNumber
        },
        {
            headerName: 'CGST', field: 'CGST', suppressSizeToFit: true, maxWidth: 120,
            headerComponentFramework: headerCGST,
            aggFunc: 'sum',
            valueFormatter: formatNumber
        },
        {
            headerName: 'SGST', field: 'SGST', suppressSizeToFit: true, maxWidth: 120,
            headerComponentFramework: headerSGST,
            aggFunc: 'sum',
            valueFormatter: formatNumber
        },
        {
            headerName: 'RoundOff', field: 'TotalRoundOff', suppressSizeToFit: true, maxWidth: 120,
            aggFunc: 'sum',
            headerComponentFramework: headerroundoff,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Net Amt', field: 'NetAmount', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum',
            headerComponentFramework: headerNetAmt,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Food(With Tax)', field: 'FoodWithTax', suppressSizeToFit: true, maxWidth: 120,
            aggFunc: 'sum',
            headerComponentFramework: headerrFoodWithTax,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Liquor(With Tax)', field: 'LiquorWithTax', suppressSizeToFit: true, maxWidth: 120,
            aggFunc: 'sum',
            headerComponentFramework: headerrLiquorWithTax,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Softdrink(With Tax)', field: 'SoftDrinksWithTax', suppressSizeToFit: true, maxWidth: 120,
            aggFunc: 'sum',
            headerComponentFramework: headerrSoftdrinkWithTax,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Smokes(With Tax)', field: 'SmokesWithTax', suppressSizeToFit: true, maxWidth: 120,
            aggFunc: 'sum',
            headerComponentFramework: headerrSmokesWithTax,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Others(With Tax)', field: 'OthersWithTax', suppressSizeToFit: true, maxWidth: 120,
            aggFunc: 'sum',
            headerComponentFramework: headerrOthersWithTax,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Food(Without Tax)', field: 'FoodWithoutTax', suppressSizeToFit: true, maxWidth: 120,
            aggFunc: 'sum',
            headerComponentFramework: headerrFoodWithoutTax,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Liquor(Without Tax)', field: 'LiquorWithoutTax', suppressSizeToFit: true, maxWidth: 120,
            aggFunc: 'sum',
            headerComponentFramework: headerrLiquorWithoutTax,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Softdrink(Without Tax)', field: 'SoftDrinksWithoutTax', suppressSizeToFit: true, maxWidth: 120,
            aggFunc: 'sum',
            headerComponentFramework: headerrSoftdrinkWithoutTax,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Smokes(Without Tax)', field: 'SmokesWithoutTax', suppressSizeToFit: true, maxWidth: 120,
            aggFunc: 'sum',
            headerComponentFramework: headerrSmokesWithoutTax,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Others(Without Tax)', field: 'OthersWithoutTax', suppressSizeToFit: true, maxWidth: 120,
            aggFunc: 'sum',
            headerComponentFramework: headerrOthersWithoutTax,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Cash', field: 'Cash', suppressSizeToFit: true, maxWidth: 120,
            aggFunc: 'sum',
            headerComponentFramework: headerCASH,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Credit Card', field: 'Credit Card', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum',
            headerComponentFramework: headerrCreditCard,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Company', field: 'BTC', suppressSizeToFit: true, maxWidth: 120,
            aggFunc: 'sum',
            headerComponentFramework: headerrCompany,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Guest', field: 'Guest', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum',
            headerComponentFramework: headerGuest,
            valueFormatter: formatNumber
        },
        {
            headerName: 'AMEX', field: 'AMEX', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum',
            headerComponentFramework: headerrAmex,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Online', field: 'ONLINE', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum',
            headerComponentFramework: headerrOnlinePayment,
            valueFormatter: formatNumber
        },
        {
            headerName: 'Razor Pay', field: 'Razor Pay', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum',
            headerComponentFramework: headerRazorPay,
            valueFormatter: formatNumber
        },
        {
            headerName: 'AXIS Bank Cards', field: 'AXIS BANK CARDS', suppressSizeToFit: true, maxWidth: 120, aggFunc: 'sum',
            headerComponentFramework: headerAxisBank,
            valueFormatter: formatNumber
        }
    ];

    useEffect(() => {
        fetchx(DASHBOARD_URL + '/getStoreList?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                const responseData = resp['data'];
                setStoreOptions(responseData);
            })
            .catch(error => {
                console.error("Error fetchxing data:", error);
            });
    }, [])
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

                console.log(hotelName)
                console.log(postres)
                sethotelName(hotelName1);
                sethotelAddress(hotelAddress1);


            })
            .catch(error => {
                console.error("Error fetchxing business date:", error);
            });
    }, []);
    const getKotData = data => {
        setIsButtonClicked(true)
        setLoading(true);

        console.log(data)
        const filterFromDate = Moment(data.frmdate[0]).format("DD-MM-YYYY");
        const filterToDate = Moment(data.todate[0]).format("DD-MM-YYYY");


        setFilterFromDate(filterFromDate);
        setFilterToDate(filterToDate);
        const storeIDs = data.storeID && data.storeID.map(item => item.value);
        const selectedResturants = data.storeID && data.storeID.map(item => item.label);
    setfilterResturant(selectedResturants)
        let createmarketGroup;
        if (storeIDs && storeIDs.length === 0) {
            createmarketGroup = JSON.stringify({
                "hotelID": 10,
                "FromDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
                "ToDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
            })
        }
        else {
            console.log("In Else")
            createmarketGroup = JSON.stringify({
                "hotelID": 10,
                "storeID": storeIDs,
                "FromDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
                "ToDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
            })
        }
        console.log(storeIDs)

        setData(data)
        setFlag(true)

        console.log(createmarketGroup)

        let res = fetchx(DASHBOARD_URL + "/getSalesSummaryReportPOS", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: createmarketGroup
        }).then(data => data.json())
            .then((res) => {
                setIsButtonClicked(false)
                if (res['statuscode'] == 200) {
                    setLoading(false);
                console.log(res["data"]);
                setRowData(res.data);
                setSalesSummaryData(res["data"])
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
            fileName: "Sales Summary Report.xlsx",
            sheetName: "Sheet1",
            processHeaderCallback: (params) => {
                return params.column.getColDef().headerName;
            },
            processCellCallback: (params) => {
                // Check if the cell belongs to a column with an aggregation function of 'sum'
                if (params.column && params.column.getColDef().aggFunc === 'sum') {
                    // Check if the cell is in a group row and it's not the last row of the group
                    if (params.node && params.node.group && params.node.group.aggregated) {
                        // Return an empty string for total rows to exclude sum values
                        return '';
                    }
                }
                // Return the original value for other cells
                return params.value;
            }
        };

        gridRef.current.api.exportDataAsExcel(params);
    };

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
        if (filterFromDate && filterToDate && rowData.length > 0) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sales Summary Report');
    
            const firstRow = rowData[0];
            const columns = Object.keys(firstRow).map(key => ({
                header: key,
                key: key,
                width: 20
            }));
    
            worksheet.columns = columns;
    
            worksheet.addRow(['Report Name:', 'Sales Summary Report']);
            worksheet.addRow(['Filter From Bill Date:', filterFromDate]);
            worksheet.addRow(['To Date:', filterToDate]);
    
            let selectedFilterRestaurant = filterResturant && filterResturant.length !== 0
                ? filterResturant.toString()
                : 'All';
            
            worksheet.addRow(['Filter Restaurants:', selectedFilterRestaurant]);
            worksheet.addRow([]);
    
            worksheet.addRow(columns.map(column => column.header)).font = { bold: true };
    
            for (let i = 1; i <= 5; i++) {
                worksheet.getRow(i).font = { bold: true };
            }
    
            rowData.sort((a, b) => a.StoreID - b.StoreID);
    
            let totals = {
                TotalBills: 0,
                Covers: 0,
                BillAmount: 0,
                Discount: 0,
                GrossAmount: 0,
                CGST: 0,
                SGST: 0,
                TotalRoundOff: 0,
                NetAmount: 0,
                FoodWithTax: 0,
                LiquorWithTax: 0,
                SoftDrinksWithTax: 0,
                SmokesWithTax: 0,
                OthersWithTax: 0,
                FoodWithoutTax: 0,
                LiquorWithoutTax: 0,
                SoftDrinksWithoutTax: 0,
                SmokesWithoutTax: 0,
                OthersWithoutTax: 0,
                Guest: 0,
                BTC: 0,
                ONLINE: 0,
                Cash: 0,
                CreditCard: 0,
                AMEX: 0,
                PostToRoom: 0
            };
    
            rowData.forEach((row) => {
                let formattedRow = {};
                columns.forEach(column => {
                    const value = row[column.key] !== undefined ? row[column.key] : (columns.indexOf(column) <= 5 ? '' : 0);
                    formattedRow[column.key] = value;
    
                    // Sum totals for specific fields
                    if (totals.hasOwnProperty(column.key)) {
                        totals[column.key] += parseFloat(value) || 0; // Ensure value is treated as a number
                    }
                });
                worksheet.addRow(formattedRow);
            });
    
            worksheet.spliceRows(1, 1);
    
            // Add totals row
            worksheet.addRow([]);
            worksheet.addRow([]);
            const totalsRow = Object.keys(totals).map(key => totals[key]);
            worksheet.addRow(['Total','','','',...totalsRow]).font = { bold: true };
    
            worksheet.columns.forEach((column, index) => {
                if ([0, 1, 2, 3, 4, 5].includes(index)) {
                    column.alignment = { vertical: 'middle', horizontal: 'left' };
                } else {
                    column.alignment = { vertical: 'middle', horizontal: 'right' };
                }
            });
    
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 10);
            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/octet-stream' });
                saveAs(blob, `Sales Summary Report_${formattedDate}.xlsx`);
            }).catch((error) => {
                console.error('Error generating Excel file:', error);
            });
        }
    };
    
    

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>Sales Summary Report</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(getKotData)}>
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
                                        {/* <Button className='me-1' color='primary' type='submit' onClick={printGrid}>
                                            Print PDF
                                        </Button> */}
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
                        ref={gridRef}

                        rowData={rowData}
                        columnDefs={columnDefs}
                        animateRows={true}
                        rowSelection='multiple'
                        onCellClicked={cellClickedListener}
                        defaultColDef={defaultColDef}
                        domLayout='autoHeight'
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

export default SalesSummaryReport