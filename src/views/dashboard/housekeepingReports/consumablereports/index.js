/* eslint-disable no-unused-vars */
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import 'ag-grid-enterprise'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Card, CardHeader, Button, CardBody, Form, Row, Col, Label } from 'reactstrap'
import Moment from 'moment'
import { useForm, Controller } from 'react-hook-form'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import Houskeeping_URL from '../../../../housekeeping_config'
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import { es } from 'date-fns/locale'
const id = '1'


function App() {
    const [rowData, setRowData] = useState()
    const gridRef = useRef()
    const { reset, handleSubmit, control, watch } = useForm({})
    const groupDisplayType = 'singleColumn';
    const [open, setOpen] = useState(false);
    const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);


    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv()
    }, [])


    const CustomHeaderComponent = ({ displayName }) => {
        return (
            <div>{displayName}</div>
        );
    };


    // const [columnDefs] = useState([
    //     {
    //         headerName: 'Date', field: 'dateOfEntry', maxWidth: 200, rowGroup: true, hide: true,
    //     },
    //     { headerName: 'Floor Number', field: 'floorNumber', suppressSizeToFit: true, maxWidth: 140 },
    //     { headerName: 'Room No.', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 140 },
    //     { headerName: 'Added By', field: 'attendantName', suppressSizeToFit: true, maxWidth: 140 },
    //     {
    //         headerName: 'Laundry Price list', field: 'C4520699', aggFunc: 'sum',
    //         suppressSizeToFit: true, maxWidth: 170,
    //     },
    //     { headerName: 'Safe Tent Card', field: 'C4540998', aggFunc: 'sum', suppressSizeToFit: true, maxWidth: 150, },
    //     { headerName: 'GM Card', field: 'C4541047', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 140 },
    //     { headerName: 'Letter head', field: 'C4541037', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 140 },
    //     { headerName: 'Envelope Guest', field: 'C4541057', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 160 },
    //     { headerName: 'Note Pad ', field: 'C4541060', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 140 },
    //     { headerName: 'Guest Pen Black', field: 'C4530595', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 160 },
    //     { headerName: 'Pencil', field: 'C4530405', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 120 },
    //     { headerName: 'Environment Card', field: 'C4520176', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 170 },
    //     { headerName: 'Pillow Card', field: 'C4520533', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 160 },
    //     { headerName: 'Service Card', field: 'C4520692', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 160 },
    //     { headerName: 'Shoe Polish card', field: 'C4541046', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 170 },
    //     { headerName: 'Service attempt card', field: 'C4520693', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 190 },
    //     { headerName: 'Coffee Sachet 120 1GM', field: 'C1501048', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 200 },
    //     { headerName: 'Green Tea', field: 'C1500916', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 130 },
    //     { headerName: 'Englisht Tea', field: 'C1501009', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 140 },
    //     { headerName: 'Creamer 120', field: 'C1500310', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 140 },
    //     { headerName: 'Equal 100', field: 'C1501015', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 130 },
    //     { headerName: 'Sugar 100', field: 'C1500944', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 130 },
    //     { headerName: 'Water 500 ml', field: 'C220023', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 145 },
    //     { headerName: 'Lauandry bag', field: 'C4520600', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 145 },
    //     { headerName: 'Slipper', field: 'C4520004', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 130 },
    //     { headerName: 'Shoe mitt', field: 'C4520408', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 130 },
    //     { headerName: 'Shoe Shine', field: 'C4520591', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 130 },
    //     { headerName: 'Mosquito replent', field: 'C4640008', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 170 },
    //     { headerName: 'BO Body Wash 35ml', field: 'C4520703', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 180 },
    //     { headerName: 'BIO Body lotion 30ml', field: 'C4520705', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 190 },
    //     { headerName: 'BIO Bio - soap(50g)', field: 'C4520708', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 195 },
    //     { headerName: 'BIO Body Talcam Powder', field: 'C4520706' },
    //     { headerName: 'BIO Bubble Bath', field: 'C4520704', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 170 },
    //     { headerName: 'BIO Conditioner 30ml', field: 'C4520702', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 195 },
    //     { headerName: 'BIO Small soap 30g', field: 'C4520707', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 175 },
    //     { headerName: 'BIO Shampoo 30ml', field: 'C4520701', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 175 },
    //     { headerName: 'BIO Shower gel 30ml', field: 'C4520622', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 190 },
    //     { headerName: 'FE Conditioner 30ml', field: 'C4520621', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 190 },
    //     { headerName: 'FE Shampoo 30ml', field: 'C4520620', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 180 },
    //     { headerName: 'FE Shower gel', field: 'C4520629', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 180 },
    //     { headerName: 'FE Body lotion 30ml ', field: 'C4520623', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 190 },
    //     { headerName: 'FE Big soap BIG', field: 'C4520626', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 180 },
    //     { headerName: 'FE Small Soap SMALL', field: 'C4520625', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 190 },
    //     { headerName: 'Comb', field: 'C4520012', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 130 },
    //     { headerName: 'Cotton ball', field: 'C4520014', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 150 },
    //     { headerName: 'Dental kit', field: 'C4520015', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 150 },
    //     { headerName: 'Shaving kit', field: 'C4520051', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 150 },
    //     { headerName: 'Sewing kit', field: 'C4520049', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 150 },
    //     { headerName: 'Disposal Bag', field: 'C4510132', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 160 },
    //     { headerName: 'Loofa', field: 'C4710012', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 150 },
    //     { headerName: 'Shower cap', field: 'C4710009', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 150 },
    //     { headerName: 'Tissue box', field: 'C4520409', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 150 },
    //     { headerName: 'Toilet roll', field: 'C4520312', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 150 },
    //     { headerName: 'Vanity kit', field: 'C4520407', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 150 },
    //     { headerName: 'Manicure kit', field: 'C4710017', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 150 },
    //     { headerName: 'Mouth Wash', field: 'C4520116', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 150 },
    //     { headerName: 'Match Box', field: 'C4520039', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 150 },
    //     { headerName: 'Coconut Oil Parachute', field: 'C4520117', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 190 },
    //     { headerName: 'Sanitary Napkin', field: 'C4520048', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 170 },
    // ])



    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Date', field: 'dateOfEntry', maxWidth: 200, rowGroup: true, hide: true },
        { headerName: 'Floor Number', field: 'floorNumber', maxWidth: 140 },
        { headerName: 'Room No.', field: 'roomNumber', maxWidth: 140 },
        { headerName: 'Added By', field: 'attendantName', maxWidth: 140 },
    ])

    // Dynamically set headerComponentParams for each column definition
    columnDefs.forEach(columnDef => {
        columnDef.headerComponentFramework = CustomHeaderComponent;
        columnDef.headerComponentParams = {
            displayName: columnDef.headerName // Set displayName to headerName
        };
    });

    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ))


    const cellClickedListener = useCallback(event => {
        console.log('cellClicked', event)
    }, [])

    const gridOptions = {
        suppressAggFuncInHeader: true
    };

    useEffect(() => {
        setOpen(true);
        // Start a timer to check if the response takes more than 5 seconds
        const timeout = setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);
        fetchx(Houskeeping_URL + `/getConsumableCount`)
            .then(result => result.json())
            .then(rowData => {
                if(rowData.statuscode === 200){
                console.log("Row Data:", rowData); // Debugging
                let data = rowData.data
                const consumablesKeys = Object.keys(data[0].consumables);
                console.log("Consumables Keys:", consumablesKeys); // Debugging

                // Generate dynamic column definitions for consumables
                const dynamicColumns = consumablesKeys.map(key => ({
                    headerName: key,
                    field: key, // Use the key directly (no "consumables." prefix)
                    aggFunc: 'sum',
                    maxWidth: 160
                }));

                console.log("Dynamic Columns:", dynamicColumns); // Debugging

                // Combine fixed columns with dynamic columns
                setColumnDefs(prevColumns => [
                    ...prevColumns,
                    ...dynamicColumns
                ]);

                // Transform row data to flatten consumables
                const transformedData = data.map(row => {
                    const flattenedRow = {
                        ...row,
                        ...row.consumables // Flatten consumables into the row object
                    };
                    delete flattenedRow.consumables; // Remove the nested consumables object
                    return flattenedRow;
                });

                console.log("Transformed Data:", transformedData); // Debugging
                setRowData(transformedData);
                setOpen(false);

                // setRowData(rowData['data'])
            }else{
                setOpen(false);

            }
            })
    }, [])

    const resetFilter = useCallback(() => {
        handleResetFilter()
        setOpen(true);
        // Start a timer to check if the response takes more than 5 seconds
        const timeout = setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);
        fetchx(Houskeeping_URL + `/getConsumableCount`)
            .then(result => result.json())
            .then(rowData => {
                if(rowData.statuscode === 200){

                let data = rowData.data
                const consumablesKeys = Object.keys(data[0].consumables);
                console.log("Consumables Keys:", consumablesKeys); // Debugging

                // Generate dynamic column definitions for consumables
                const dynamicColumns = consumablesKeys.map(key => ({
                    headerName: key,
                    field: key, // Use the key directly (no "consumables." prefix)
                    aggFunc: 'sum',
                    maxWidth: 160
                }));

                console.log("Dynamic Columns:", dynamicColumns); // Debugging

                // Combine fixed columns with dynamic columns
                setColumnDefs(prevColumns => [
                    ...prevColumns,
                    ...dynamicColumns
                ]);

                // Transform row data to flatten consumables
                const transformedData = data.map(row => {
                    const flattenedRow = {
                        ...row,
                        ...row.consumables // Flatten consumables into the row object
                    };
                    delete flattenedRow.consumables; // Remove the nested consumables object
                    return flattenedRow;
                });

                console.log("Transformed Data:", transformedData); // Debugging
                setRowData(transformedData);
                setOpen(false);

            }
            else{
                setOpen(false);
            }
            })
    }, [])


    const onSubmit = data => {
        setOpen(true);
        // Start a timer to check if the response takes more than 5 seconds
        const timeout = setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);
        let fromDate = Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD")
        let toDate = Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
        fetchx(Houskeeping_URL + `/getConsumableCount?fromDate=${fromDate}&toDate=${toDate}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
        }).then(data => data.json())
            .then((res) => {
                if(res.statuscode === 200){

                // setRowData(res['data'])
                let data = res.data
                const consumablesKeys = Object.keys(data[0].consumables);
                console.log("Consumables Keys:", consumablesKeys); // Debugging

                // Generate dynamic column definitions for consumables
                const dynamicColumns = consumablesKeys.map(key => ({
                    headerName: key,
                    field: key, // Use the key directly (no "consumables." prefix)
                    aggFunc: 'sum',
                    maxWidth: 160
                }));

                console.log("Dynamic Columns:", dynamicColumns); // Debugging

                // Combine fixed columns with dynamic columns
                setColumnDefs(prevColumns => [
                    ...prevColumns,
                    ...dynamicColumns
                ]);

                // Transform row data to flatten consumables
                const transformedData = data.map(row => {
                    const flattenedRow = {
                        ...row,
                        ...row.consumables // Flatten consumables into the row object
                    };
                    delete flattenedRow.consumables; // Remove the nested consumables object
                    return flattenedRow;
                });

                console.log("Transformed Data:", transformedData); // Debugging
                setRowData(transformedData);
                setOpen(false);

            }
            else{
                    setOpen(false);

            }
            });
    }


    const handleResetFilter = () => {
        reset({
            frmdate: null,
            todate: null,
        });
    };


    return (
        <div>

            <Card>
                <CardHeader>
                    <h1>Consumables Count Report</h1>
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
                                                placeholder="YYYY-MM-DD "
                                                className={classnames("form-control", {
                                                })}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>

                            <div align="end" className="buttons">
                                <Button onClick={resetFilter} color='secondary' outline>Reset</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button className='me-1' color='primary' type='submit'>
                                    Submit
                                </Button>
                                <Button onClick={onBtnExport} color='primary'>Download Report</Button>
                            </div>
                        </Row>
                    </Form>
                </CardBody>
            </Card>

            <div className="ag-theme-alpine" style={{ height: 520 }}>

                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    groupDisplayType={groupDisplayType}
                    animateRows={true}
                    rowSelection='multiple'
                    onCellClicked={cellClickedListener}
                    paginationPageSize='10'
                    pagination='true'
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"
                    groupIncludeFooter={true}
                    groupIncludeTotalFooter={true}
                    gridOptions={gridOptions}

                />
            </div>
             <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                                                        Please wait while we are updating your reservation
                                                    </h1>
                                                    {showSecondaryMessage && (
                                                        <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                                                            We're processing your request, which may take a little longer due to additional data. Please be patient!
                                                        </h1>
                                                    )}
                                                    <CircularProgress color="inherit" />
                                                </div>
                                            </Backdrop>

        </div>
    )
}

export default App