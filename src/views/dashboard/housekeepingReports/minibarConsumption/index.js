// /* eslint-disable no-unused-vars */
// import { AgGridReact } from 'ag-grid-react'
// import 'ag-grid-community/styles/ag-grid.css'
// import 'ag-grid-community/styles/ag-theme-alpine.css'
// import 'ag-grid-enterprise'
// import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
// import { Card, CardHeader, Button, CardBody, Form, Row, Col, Label } from 'reactstrap'
// import Moment from 'moment'
// import { useForm, Controller } from 'react-hook-form'
// import classnames from 'classnames'
// import Flatpickr from 'react-flatpickr'
// import Houskeeping_URL from '../../../../housekeeping_config'
// // ** Styles
// import "@styles/react/libs/flatpickr/flatpickr.scss";
// import "@styles/react/libs/react-select/_react-select.scss";
// import "@styles/react/pages/page-form-validation.scss";

// const id = '1'


// function App() {
//     const [rowData, setRowData] = useState()
//     const gridRef = useRef()
//     const { reset, handleSubmit, control, watch } = useForm({})
//     const groupDisplayType = 'singleColumn';


//     const onBtnExport = useCallback(() => {
//         gridRef.current.api.exportDataAsCsv()
//     }, [])


//     const CustomHeaderComponent = ({ displayName }) => {
//         return (
//             <div>{displayName}</div>
//         );
//     };


//     const [columnDefs] = useState([
//         {
//             headerName: 'Date', field: 'dateOfEntry', maxWidth: 200, rowGroup: true, hide: true,
//         },
//         { headerName: 'Floor Number', field: 'floorNumber', suppressSizeToFit: true, maxWidth: 140 },
//         { headerName: 'Room No.', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 140 },
//         { headerName: 'Added By', field: 'attendantName', suppressSizeToFit: true, maxWidth: 140 },
//         { headerName: 'Choice of chips', field: 'C4900001', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 160 }, 
//         { headerName: 'Snicker chocolate', field: 'C4900002', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 160 }, 
//         { headerName: 'Cadbury Oreo biscuit', field: 'C4900003', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 160 }, 
//         { headerName: 'Cadbury dairy milk', field: 'C4900004', suppressSizeToFit: true, aggFunc: 'sum', maxWidth: 160 }, 
//         { headerName: 'Salted roasted cashew nuts(50gm)', field: 'C4900005', suppressSizeToFit: true, aggFunc: 'sum', Width: 220 }, 
//         { headerName: 'Salted roasted almonds(50gm)', field: 'C4900006', suppressSizeToFit: true, aggFunc: 'sum', Width: 190 }, 
//         { headerName: 'Salted roasted pistachios(50gm)', field: 'C4900007', suppressSizeToFit: true, aggFunc: 'sum', Width: 210 }, 
//         { headerName: 'Coke(300ml)', field: 'C4900008', suppressSizeToFit: true, aggFunc: 'sum', Width: 160 }, 
//         { headerName: 'Sprite(300ml)', field: 'C4900009', suppressSizeToFit: true, aggFunc: 'sum', Width: 160 }, 
//         { headerName: 'Redbull(300ml)', field: 'C4900010', suppressSizeToFit: true, aggFunc: 'sum', Width: 160 }, 
//         { headerName: 'Sparkling water(330ml)', field: 'C4900011', suppressSizeToFit: true, aggFunc: 'sum', Width: 160 }, 
//         { headerName: 'Canned (orange or mango) Juice(180ml)', field: 'C4900012', suppressSizeToFit: true, aggFunc: 'sum', Width: 220 }, 
//         { headerName: 'Beer(300ml)', field: 'C4900013', suppressSizeToFit: true, aggFunc: 'sum', Width: 120 }, 
//     ])


//     // Dynamically set headerComponentParams for each column definition
//     columnDefs.forEach(columnDef => {
//         columnDef.headerComponentFramework = CustomHeaderComponent;
//         columnDef.headerComponentParams = {
//             displayName: columnDef.headerName // Set displayName to headerName
//         };
//     });

//     const defaultColDef = useMemo(() => (
//         {
//             sortable: true,
//             filterParams: {
//                 buttons: ['apply', 'reset']
//             }
//         }
//     ))


//     const cellClickedListener = useCallback(event => {
//         console.log('cellClicked', event)
//     }, [])

//     const gridOptions = {
//         suppressAggFuncInHeader: true
//     };

//     useEffect(() => {
//         fetch(Houskeeping_URL + `/getMinibarConsumptionReport`)
//             .then(result => result.json())
//             .then(rowData => {
//                 setRowData(rowData['data'])
//             })
//     }, [])

//     const resetFilter = useCallback(() => {
//         handleResetFilter()
//         fetch(Houskeeping_URL + `/getMinibarConsumptionReport`)
//             .then(result => result.json())
//             .then(rowData => {
//                 setRowData(rowData['data'])
//             })
//     }, [])


//     const onSubmit = data => {
//         let fromDate = Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD")
//         let toDate = Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
//         fetch(Houskeeping_URL + `/getMinibarConsumptionReport?fromDate=${fromDate}&toDate=${toDate}`, {
//             method: "GET",
//             headers: { 'Content-Type': 'application/json' },
//         }).then(data => data.json())
//             .then((res) => {
//                 setRowData(res['data'])
//             });
//     }


//     const handleResetFilter = () => {
//         reset({
//             frmdate: null,
//             todate: null,
//         });
//     };


//     return (
//         <div>

//             <Card>
//                 <CardHeader>
//                     <h1>Minibar Consumption Report</h1>
//                 </CardHeader>


//                 <CardBody>
//                     <Form onSubmit={handleSubmit(onSubmit)}>
//                         <Row>
//                             <Col md="3" sm="12">
//                                 <div className="mb-1">
//                                     <Label className="form-label" for="frmdate">
//                                         From Date
//                                     </Label>
//                                     <Controller
//                                         control={control}
//                                         id="frmdate"
//                                         name="frmdate"
//                                         render={({ field }) => (
//                                             <Flatpickr
//                                                 {...field}
//                                                 placeholder="YYYY-MM-DD "
//                                                 className={classnames("form-control", {
//                                                 })}
//                                             />
//                                         )}
//                                     />
//                                 </div>
//                             </Col>

//                             <Col md="3" sm="12">
//                                 <div className="mb-1">
//                                     <Label className="form-label" for="todate">
//                                         To Date
//                                     </Label>
//                                     <Controller
//                                         control={control}
//                                         id="todate"
//                                         name="todate"
//                                         render={({ field }) => (
//                                             <Flatpickr
//                                                 {...field}
//                                                 placeholder="YYYY-MM-DD "
//                                                 className={classnames("form-control", {
//                                                 })}
//                                             />
//                                         )}
//                                     />
//                                 </div>
//                             </Col>

//                             <div align="end" className="buttons">
//                                 <Button onClick={resetFilter} color='secondary' outline>Reset</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                                 <Button className='me-1' color='primary' type='submit'>
//                                     Submit
//                                 </Button>
//                                 <Button onClick={onBtnExport} color='primary'>Download Report</Button>
//                             </div>
//                         </Row>
//                     </Form>
//                 </CardBody>
//             </Card>

//             <div className="ag-theme-alpine" style={{ height: 520 }}>

//                 <AgGridReact
//                     ref={gridRef}
//                     rowData={rowData}
//                     columnDefs={columnDefs}
//                     groupDisplayType={groupDisplayType}
//                     animateRows={true}
//                     rowSelection='multiple'
//                     onCellClicked={cellClickedListener}
//                     paginationPageSize='10'
//                     pagination='true'
//                     defaultColDef={defaultColDef}
//                     headerColor="ddw-primary"
//                     groupIncludeFooter={true}
//                     groupIncludeTotalFooter={true}
//                     gridOptions={gridOptions}

//                 />
//             </div>

//         </div>
//     )
// }

// export default App

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
import "@styles/react/libs/flatpickr/flatpickr.scss"
import "@styles/react/libs/react-select/_react-select.scss"
import "@styles/react/pages/page-form-validation.scss"

const id = '1'

function App() {
    const [rowData, setRowData] = useState([])
    const gridRef = useRef()
    const { reset, handleSubmit, control, watch } = useForm({})
    const groupDisplayType = 'singleColumn'

    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv()
    }, [])

    const CustomHeaderComponent = ({ displayName }) => {
        return <div>{displayName}</div>
    }

    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Date', field: 'dateOfEntry', maxWidth: 200, rowGroup: true, hide: true },
        { headerName: 'Floor Number', field: 'floorNumber', maxWidth: 140 },
        { headerName: 'Room No.', field: 'roomNumber', maxWidth: 140 },
        { headerName: 'Added By', field: 'attendantName', maxWidth: 140 },
    ])

    // const defaultColDef = useMemo(() => ({
    //     sortable: true,
    //     filterParams: {
    //         buttons: ['apply', 'reset']
    //     }
    // }), [])

    const defaultColDef = useMemo(() => ({
        sortable: true,
        resizable: true,
        autoHeight: true,  // Enable auto height for column headers
        wrapHeaderText: true,
        filterParams: {
            buttons: ['apply', 'reset']
        }
    }), []);

    const cellClickedListener = useCallback(event => {
        console.log('cellClicked', event)
    }, [])

    const gridOptions = {
        suppressAggFuncInHeader: true
    }

    // useEffect(() => {
    //     fetch(Houskeeping_URL + `/getMinibarConsumptionReport`)
    //         .then(result => result.json())
    //         .then(data => {
    //             if (data && data.length > 0) {
    //                 // Extract consumables keys from the first row
    //                 const consumablesKeys = Object.keys(data[0].consumables)

    //                 // Generate dynamic column definitions for consumables
    //                 const dynamicColumns = consumablesKeys.map(key => ({
    //                     headerName: key,
    //                     field: `consumables.${key}`,
    //                     aggFunc: 'sum',
    //                     maxWidth: 160
    //                 }))

    //                 // Combine fixed columns with dynamic columns
    //                 setColumnDefs(prevColumns => [
    //                     ...prevColumns,
    //                     ...dynamicColumns
    //                 ])

    //                 // Transform row data to flatten consumables
    //                 const transformedData = data.map(row => ({
    //                     ...row,
    //                     ...row.consumables
    //                 }))

    //                 setRowData(transformedData)
    //             }
    //         })
    //         .catch(error => console.error('Error fetching data:', error))
    // }, [])

    useEffect(() => {
        fetch(Houskeeping_URL + `/getMinibarConsumptionReport`)
            .then(result => result.json())
            .then(data => {
                console.log("API Response:", data); // Debugging
                data = data.data
                if (data && data.length > 0) {
                    // Extract consumables keys from the first row
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
                } else {
                    console.warn("No data returned from API");
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const resetFilter = useCallback(() => {
        handleResetFilter()
        fetch(Houskeeping_URL + `/getMinibarConsumptionReport`)
            .then(result => result.json())
            .then(data => {
                if (data && data.length > 0) {
                    const transformedData = data.map(row => ({
                        ...row,
                        ...row.consumables
                    }))
                    setRowData(transformedData)
                }
            })
    }, [])

    const onSubmit = data => {
        let fromDate = Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD")
        let toDate = Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
        fetch(Houskeeping_URL + `/getMinibarConsumptionReport?fromDate=${fromDate}&toDate=${toDate}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.statuscode === 200) {
                    data = data.data
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
                }
            })
    }

    const handleResetFilter = () => {
        reset({
            frmdate: null,
            todate: null,
        })
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <h1>Minibar Consumption Report</h1>
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
                                                placeholder="YYYY-MM-DD"
                                                className={classnames("form-control")}
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
                                                placeholder="YYYY-MM-DD"
                                                className={classnames("form-control")}
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
        </div>
    )
}

export default App