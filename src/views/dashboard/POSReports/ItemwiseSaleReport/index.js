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

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'


const MySwal = withReactContent(Swal)

const defaultValues = {
    frmdate: ''
}



const ItemwiseSaleReport = () => {

    // AG Grid
    const [rowData, setRowData] = useState();
    const [rowData1, setRowData1] = useState();
    const [flag, setFlag] = useState(false)
    const [loading, setLoading] = useState(false); 
    const [isButtonClicked, setIsButtonClicked] = useState(false);



    // function formatNumber(params) {
    //     var number = params.value;
    //     return Math.floor(number)
    //       .toString()
    //       .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    // }
    function formatNumber(params) {
        var number = params.value;
      
        if (typeof number !== 'number' || isNaN(number)) {
          return ''; 
        }
      
        var formattedNumber = Math.floor(number).toFixed(2);
        return formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      }
    const CustomHeaderComponentRate = () => {
        return (
          <div>
            Rate
          </div>
        );
      };
      const CustomHeaderComponentQty = () => {
        return (
          <div>
          Quantity
          </div>
        );
      };
      const CustomHeaderComponentTotalAmount = () => {
        return (
          <div>
          TotalAmount
          </div>
        );
      };
      const CustomHeaderComponentItemDisc = () => {
        return (
          <div>
          Item Discount
          </div>
        );
      };
      const CustomHeaderComponentSellingPrice = () => {
        return (
          <div>
         Selling Price
          </div>
        );
      };

      const CustomHeaderComponentAmtAfterDisc = () => {
        return (
          <div>
        Amount
          </div>
        );
      };
      
      const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Restaurant Name', field: 'RestaurantName', suppressSizeToFit: true, rowGroup: true ,},
        { headerName: 'Session Name', field: 'Sessions', suppressSizeToFit: true, rowGroup: true,wrapText: true},
        { headerName: 'Classification', field: 'Classification', suppressSizeToFit: true,rowGroup: true ,wrapText: true},
        { headerName: 'Menu Name', field: 'MenuName', suppressSizeToFit: true, rowGroup: true,wrapText: true,autoHeight:true},
        { headerName: 'Item Name', field: 'ItemName', suppressSizeToFit: true,wrapText: true,autoHeight:true},
        { headerName: 'Rate', field: 'Rate', suppressSizeToFit: true,valueFormatter: formatNumber,aggFunc:'sum',headerComponentFramework: CustomHeaderComponentRate},
        { headerName: 'Item Discount', field: 'ItemDiscount', suppressSizeToFit: true,aggFunc:'sum',valueFormatter: formatNumber,headerComponentFramework: CustomHeaderComponentItemDisc},
        { headerName: 'Selling Price', field: 'SellingPrice', suppressSizeToFit: true,aggFunc:'sum',valueFormatter: formatNumber,headerComponentFramework: CustomHeaderComponentSellingPrice},
        { headerName: 'Quantity', field: 'Qty', suppressSizeToFit: true,aggFunc:'sum' ,headerComponentFramework: CustomHeaderComponentQty},
        { headerName: 'Amount', field: 'AmtAfterDisc', suppressSizeToFit: true,aggFunc:'sum',valueFormatter: formatNumber,headerComponentFramework: CustomHeaderComponentAmtAfterDisc},
        { headerName: 'Category', field: 'Category', suppressSizeToFit: true,wrapText: true},
        { headerName: 'Bill Number', field: 'BillNumber', suppressSizeToFit: true,wrapText: true,autoHeight:true},
        { headerName: 'Amt Before Disc', field: 'TotalAmount', suppressSizeToFit: true,aggFunc:'sum',valueFormatter: formatNumber,headerComponentFramework: CustomHeaderComponentTotalAmount},
        { headerName: 'ItemID', field: 'ItemID', suppressSizeToFit: true, wrapText: true},

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

    const cellClickedListener = useCallback(event => {
    }, []);

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


    // ** State
    const [data, setData] = useState(null)
    const [storeOptions, setStoreOptions] = useState([]);
    const [sessionTypeOptions, setsessionTypeOptions] = useState([]);
    const [classificationOptions, setclassificationOptions] = useState([]);

    const [itemsalesData, setItemsalesData] = useState([])
    const [filterFromDate, setFilterFromDate] = useState(null);
    const [filterToDate, setFilterToDate] = useState(null);
    const [filterResturant, setfilterResturant] = useState(null);
    const [filterSession, setfilterSession] = useState(null);
    const [filterClassification, setfilterClassification] = useState(null);


    // ** Hooks
    const { reset, handleSubmit, control } = useForm({ defaultValues })
    let navigate = useNavigate();


    useEffect(() => {
        fetchx(DASHBOARD_URL + '/getStoreList?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                const responseData = resp['data'];

                // setStoreOptions(options);
                setStoreOptions(responseData);
            })
            .catch(error => {
            });
    }, [])
    useEffect(() => {
        fetchx(DASHBOARD_URL + '/getAllsession?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                const responseData = resp['data'];
                const sessionNames = responseData.map((item) => ({
                    label: item.sessionName,
                    value: item.sessionName, // You can set this to the session name if needed
                }));
                setsessionTypeOptions(sessionNames);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [])

    useEffect(() => {
        fetchx(DASHBOARD_URL + '/getMenuHeaderDetails?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                const responseData = resp['data'];
                console.log(responseData)
                    const menuHeadoptions = responseData.map((item) => ({
                        label: item.category,
                        value: item.category,
                    }));
                  setclassificationOptions(menuHeadoptions);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [])



    const getItemsaleData = data => {
        setIsButtonClicked(true)
        setLoading(true)
        const storeIDs = Array.isArray(data.storeID) ? data.storeID.map(item => item.value) : [];
        const sessionTypes = Array.isArray(data.sessionType) ? data.sessionType.map((item) => item.value) : [];
        const classifications = Array.isArray(data.classification) ? data.classification.map((item) => item.value) : [];
        const filterFromDate = Moment(data.frmdate[0]).format("DD-MM-YYYY");
        const filterToDate = Moment(data.todate[0]).format("DD-MM-YYYY");
        setFilterFromDate(filterFromDate);
        setFilterToDate(filterToDate);
        const selectedResturants = data.storeID && data.storeID.map(item => item.label);
        setfilterResturant(selectedResturants)
        const selectedSessions =  data.sessionType && data.sessionType.map(item =>item.label)
        setfilterSession(selectedSessions);
        const selectedClassification=  data.classification && data.classification.map(item =>item.label)
        console.log(selectedClassification)
        setfilterClassification(selectedClassification);

        const createItemSaleGroup = {
            hotelID: 1,
            fromDate: Moment(String(new Date(data.frmdate[0]))).format('YYYY-MM-DD'),
            toDate: Moment(String(new Date(data.todate[0]))).format('YYYY-MM-DD'),
        };

        if (storeIDs && storeIDs.length > 0) {
            createItemSaleGroup.storeID = storeIDs;
        }

        if (sessionTypes && sessionTypes.length > 0) {
            createItemSaleGroup.sessionType = sessionTypes;
        }

        if (classifications && classifications.length > 0) {
            createItemSaleGroup.classification = classifications;
        }
      
        
        console.log(createItemSaleGroup)

        setData(data)
        setFlag(true)

        let res = fetchx(DASHBOARD_URL + "/getItemWiseSaleReport", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body:  JSON.stringify(createItemSaleGroup)
        }).then(data => data.json())
            .then((res) => {
                setIsButtonClicked(false)
                if (res['statusCode'] == 200) {
                    setLoading(false)
                    setFlag(true)

                setRowData(res['data'])
                setItemsalesData(res["data"])
                }
            });


    }

    const handleReset = () => {
        reset({

            block: ''
        })
    }


    // const onBtnExport = useCallback(() => {
    //     gridRef.current.api.exportDataAsCsv(params);
    // }, []);

    // const params = {
    //     fileName: 'ItemwiseSale_Report',
    // };
    const onBtnExport = () => {
        const params = {
          fileName: "Item wise Sale Report.xlsx",
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

      const generateExcel = () => {
        if (filterFromDate && filterToDate) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Itemwise Sale Report');
    
            const columns = [
                { header: 'Restaurant Name', key: 'RestaurantName', width: 20 },
                { header: 'Session Name', key: 'Sessions', width: 15 },
                { header: 'Classification', key: 'Classification', width: 15 },
                { header: 'Menu Name', key: 'MenuName', width: 15 },
                { header: 'Item Name', key: 'ItemName', width: 15 },
                { header: 'Rate', key: 'Rate', width: 10 },
                { header: 'Item Discount', key: 'ItemDiscount', width: 15 },
                { header: 'Selling Price', key: 'SellingPrice', width: 15 },
                { header: 'Quantity', key: 'Qty', width: 10 },
                { header: 'Amount', key: 'AmtAfterDisc', width: 15 },
                { header: 'Category', key: 'Category', width: 15 },
                { header: 'Bill Number', key: 'BillNumber', width: 15 },
                { header: 'Amt Before Disc', key: 'TotalAmount', width: 15 },
                { header: 'ItemID', key: 'ItemID', width: 10 }
            ];
    
            worksheet.columns = columns;
    
            worksheet.addRow(['Report Name:', 'Itemwise Sale Report']);
            worksheet.addRow(['Filter From Bill Date:', filterFromDate]);
            worksheet.addRow(['To Date:', filterToDate]);
    
            let selectedFilterResturant = filterResturant && filterResturant.length !== 0 ? filterResturant.toString() : 'All';
            let selectedFilterSession = filterSession && filterSession.length !== 0 ? filterSession.toString() : 'All';
            let selectedFilterClassification = filterClassification && filterClassification.length !== 0 ? filterClassification.toString() : 'All';
    
            worksheet.addRow(['Filter Restaurants:', selectedFilterResturant]);
            worksheet.addRow(['Filter Session Name:', selectedFilterSession]);
            worksheet.addRow(['Filter Classification Type:', selectedFilterClassification]);
    
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
            let totalRate = 0, totalItemDiscount = 0, totalSellingPrice = 0, totalQty = 0, totalAmtAfterDisc = 0, totalAmtBeforeDisc = 0;
    
            rowData.forEach((row) => {
                let formattedRow = {
                    RestaurantName: row.RestaurantName,
                    Sessions: row.Sessions,
                    Classification: row.Classification,
                    MenuName: row.MenuName,
                    ItemName: row.ItemName,
                    Rate: parseFloat(row.Rate),
                    ItemDiscount: parseFloat(row.ItemDiscount),
                    SellingPrice: parseFloat(row.SellingPrice),
                    Qty: parseInt(row.Qty),
                    AmtAfterDisc: parseFloat(row.AmtAfterDisc),
                    Category: row.Category,
                    BillNumber: row.BillNumber,
                    TotalAmount: parseFloat(row.TotalAmount),
                    ItemID: row.ItemID
                };
    
                // Accumulate totals
                totalRate += formattedRow.Rate;
                totalItemDiscount += formattedRow.ItemDiscount;
                totalSellingPrice += formattedRow.SellingPrice;
                totalQty += formattedRow.Qty;
                totalAmtAfterDisc += formattedRow.AmtAfterDisc;
                totalAmtBeforeDisc += formattedRow.TotalAmount;
    
                formattedRows.push(formattedRow);
            });
    
            formattedRows.forEach((row) => {
                worksheet.addRow(row);
            });

            worksheet.spliceRows(1, 1);
            worksheet.addRow([]);
            worksheet.addRow([]);
    
            // Add total row
            worksheet.addRow([
                'Total',
                '', '', '', '',
                totalRate,
                totalItemDiscount,
                totalSellingPrice,
                totalQty,
                totalAmtAfterDisc,
                '', '', 
                totalAmtBeforeDisc
            ]).font = { bold: true };
    
            worksheet.columns.forEach((column, index) => {
                if ([5, 6, 7, 8, 9, 12].includes(index)) {
                    column.alignment = { vertical: 'middle', horizontal: 'right' }; 
                } else {
                    column.alignment = { vertical: 'middle', horizontal: 'left' };
                }
            });
    
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 10);
    
            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/octet-stream' });
                saveAs(blob, `Itemwise Sale Report_${formattedDate}.xlsx`);
            }).catch((error) => {
                console.error('Error generating Excel file:', error);
            });
        }
    };
    
    
    
    
    


    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>Item Sale Report</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(getItemsaleData)}>
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
                                    <Label className='form-label' for='classification'>
                                        Classification
                                    </Label>
                                    <Controller
                                        id="classification"
                                        control={control}
                                        name="classification"
                                        render={({ field }) => (
                                            <Select
                                                isMulti
                                                // required
                                                isClearable
                                                options={classificationOptions}
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
                                {/* <Button className='me-1' color='primary' type='submit' disabled={loading}>
  Submit
</Button> */}
 <Button className='me-1' color='primary' type='submit' disabled={isButtonClicked}>
                {isButtonClicked ? 'Processing...' : 'Submit'}
                </Button>
                                <Button outline color='secondary' type='reset' onClick={handleReset}>
                                    Reset
                                </Button>
                                <span style={{ margin: '10px' }}></span>

                                {flag  == true && (
                                    // <Button
                                    //     className='me-1'
                                    //     color='primary'
                                    //     onClick={onBtnExport}
                                    // >
                                    //     Download Excel
                                    // </Button>
                                    <Button className='me-1' color='primary' onClick={generateExcel}>
                                    Download Excel
                                </Button>
                                )}
                            </div>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
          
            {loading == true ? (
        // <div style={{ textAlign: 'center', padding: '20px' }}>
        //   <h1 style={{ fontWeight: 'bold', color: 'grey' }}>Loading data, please wait...</h1>
        // </div>
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
                autoSizeColumns={true} 
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

export default ItemwiseSaleReport
