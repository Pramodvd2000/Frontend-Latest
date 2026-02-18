// // ** React Imports
// import { useState } from "react";
// import axios from "axios";
// // ** Third Party Components
// import Select from "react-select";
// import toast from "react-hot-toast";
// import classnames from "classnames";
// import Cleave from "cleave.js/react";
// import { Check } from "react-feather";
// import Flatpickr from "react-flatpickr";
// import "cleave.js/dist/addons/cleave-phone.us";
// import { useForm, Controller } from "react-hook-form";
// import Moment from 'moment';

// // ** Custom Components
// import Avatar from "@components/avatar";


// import API_URL from "../../../config";
// // ** Utils
// import { selectThemeColors } from "@utils";

// // ** Reactstrap Imports
// import {
//     Input, Card, Form, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, Modal, ModalBody, ModalHeader, InputGroupText, Row, Col,
//     Accordion, AccordionBody, AccordionHeader, AccordionItem
// } from "reactstrap";


// // ** Styles
// import "@styles/react/libs/flatpickr/flatpickr.scss";
// import "@styles/react/libs/react-select/_react-select.scss";
// import "@styles/react/pages/page-form-validation.scss";

// // Import ag-grid
// import 'ag-grid-enterprise'
// import { AgGridReact } from 'ag-grid-react'
// import '/node_modules/ag-grid-community/styles/ag-grid.css'
// import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// import { useRef, useEffect, useMemo, useCallback } from 'react';
// // ** Third Party Components
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
// import StopSell from './stopSell'
// import StopSellLogs from './stopSellLogs'
// const MySwal = withReactContent(Swal)
// const id = '1'
// const date = '2023-02-02'
// const roomID = '30'

// const activeoptions = [
//     { value: "1", label: "Active" },
//     { value: "0", label: "InActive" },
// ];



// const defaultValues = {
//     roomID: "",
//     numAvlRooms: "",
//     numSellCtrlRooms: "",
//     numOodRooms: "",
//     numOverbookedRooms: "",
//     sellLimit: "",
//     date: null,
//     roomTypeID: "",
// };


// let roomTypeID = [
//     fetchx(API_URL + '/getRoomInventoryRoomTypeID?hotelID=1')
//         .then(result => result.json())
//         .then(resp => {
//             // console.log(resp['data'])
//             roomTypeID = resp['data']
//             console.log(roomTypeID)
//         })
// ]



// const RoomInventory = () => {

//     const [open, setOpen] = useState('')
//     const [Today, setToday] = useState()



//     useEffect(() => {
//         const hotelIDData = JSON.stringify({
//             hotelID: 1
//         })
//         fetchx(API_URL + "/getBusinessDate", {
//             method: "POST",
//             headers: { 'Content-Type': 'application/json' },
//             body: hotelIDData
//         }).then((res) => res.json())
//             .then(postres => {
//                 const today = new Date(postres['data'][0]['businessDate']);
//                 const tomorrow = new Date(today);
//                 tomorrow.setDate(today.getDate() + 1);
//                 setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
//             })
//     }, []);

//     const toggle = id => {
//         open === id ? setOpen() : setOpen(id)
//     }

//     function CustomCellRenderer(props) {
//         const value = props.value;

//         // Split the value into the "5000" and "(9)" parts
//         const number = value.split("(")[0];
//         const suffix = value.split("(")[1].replace(")", "");

//         return (
//             <div>
//                 <span style={{ color: 'red' }}>{number}</span>
//                 <span style={{ color: 'green' }}> ({suffix})</span>
//             </div>
//         );
//     }
//     // AG Grid
//     const [rowData, setRowData] = useState();

//     const gridRef = useRef();

 


//     console.log(roomTypeID)
//     const defaultColDef = useMemo(() => (
//         {
//             sortable: true,
//             filter: true,
//             filterParams: {
//                 buttons: ['apply', 'reset']
//             }
//         }
//     ));

//     const cellClickedListener = useCallback(event => {
//         console.log('cellClicked', event);

//     }, []);

    
//     const [columnDefs, setColumnDefs] = useState([]);


//     useEffect(() => {
//         let createasset = JSON.stringify({
//             fromDate: fromDateFilter,
//             toDate: toDateFilter
//         });
    
//         let res = fetchx(API_URL + "/getRoomInventoryRates?hotelID=1", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: createasset,
//         })
//         .then(result => result.json())
//         .then(rowData => {
//             console.log(rowData['data']);
//             const lengthOfData = Object.keys(rowData['data']).length;
//             let tabledata = [];
    
//             if (lengthOfData !== 0) {
//                 let keylist = Object.keys(rowData['data']);
//                 keylist.forEach(element => {
//                     let myjson = { 'date': rowData['data'][element]['date'] };
    
//                     rowData['data'][element]['roomtype'].forEach((roomtype, i) => {
//                         myjson[roomtype] = { "count": rowData['data'][element]['roomcount'][i], "price": rowData['data'][element]['baseAmount'][i], "id": rowData['data'][element]['id'][i],"isStopSell": rowData['data'][element].isStopSell[i] };
//                     });
    
//                     tabledata.push(myjson);
//                 });
    
//                 console.log(tabledata);
//                 const roomTypes = rowData['data'][keylist[0]]['roomtype'];
    
//                 // Create dynamic columnDefs based on roomTypes
//                 const dynamicColumnDefs = [
//                     { headerName: 'Inventory Date', field: 'date', maxWidth: 150, filter: 'agDateColumnFilter' },
//                     ...roomTypes.map(roomType => ({
//                         headerName: `${roomType}(Avl)`,
//                         cellRendererFramework: CustomCellRenderer,
//                         // valueGetter: params => `${params.data[roomType].price} (${params.data[roomType].count})`,
//                         valueGetter: params => `${params.data[roomType].price} (${params.data[roomType].count}) ${params.data[roomType].isStopSell === 1 ? '🔴' : ''}`,

//                         maxWidth: 140,
//                         editable: true,
//                         valueSetter: params => {
//                             const newValInt = parseInt(params.newValue);
//                             const valueChanged = params.data[roomType].price !== newValInt;
//                             if (valueChanged) {
//                                 params.data[roomType].price = newValInt;
//                             }
//                             return valueChanged;
//                         },
                        
//                         cellStyle: params => {
//                             if (params.value !== 0) {
//                                 return { color: 'red' };
//                             } else if (params.data[roomType].price) {
//                                 return { color: 'green' };
//                             }
//                         }
//                     }))
//                 ];
    
//                 setColumnDefs(dynamicColumnDefs);
//                 setRowData(tabledata);
//             } else {
//                 setColumnDefs([]);
//                 setRowData([]);
//             }
//         });
//     }, []);
    
//     function getRoomInventoryRates(nullDate) {
//         // fetchx(API_URL + '/getRoomInventoryRates?hotelID=1')
//         let createasset;
//         if (nullDate) {
//             createasset = JSON.stringify({
//                 // fromDate: '2023-07-15',
//                 // toDate:'2023-07-16'
//                 fromDate: null,
//                 toDate: null
//             });
//         } else {
//             createasset = JSON.stringify({
//                 // fromDate: '2023-07-15',
//                 // toDate:'2023-07-16'
//                 fromDate: fromDateFilter,
//                 toDate: toDateFilter
//             });
//         }
       
    
//         let res = fetchx(API_URL + "/getRoomInventoryRates?hotelID=1", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: createasset,
//         })
//         .then(result => result.json())
//         .then(rowData => {
//             console.log(rowData['data']);
//             const lengthOfData = Object.keys(rowData['data']).length;
//             let tabledata = [];
    
//             if (lengthOfData !== 0) {
//                 let keylist = Object.keys(rowData['data']);
//                 keylist.forEach(element => {
//                     let myjson = { 'date': rowData['data'][element]['date'] };
    
//                     rowData['data'][element]['roomtype'].forEach((roomtype, i) => {
//                         myjson[roomtype] = { "count": rowData['data'][element]['roomcount'][i], "price": rowData['data'][element]['baseAmount'][i], "id": rowData['data'][element]['id'][i],"isStopSell": rowData['data'][element].isStopSell[i] };
//                     });
    
//                     tabledata.push(myjson);
//                 });
    
//                 console.log(tabledata);
//                 const roomTypes = rowData['data'][keylist[0]]['roomtype'];
    
//                 // Create dynamic columnDefs based on roomTypes
//                 const dynamicColumnDefs = [
//                     { headerName: 'Inventory Date', field: 'date', maxWidth: 150, filter: 'agDateColumnFilter' },
//                     ...roomTypes.map(roomType => ({
//                         headerName: `${roomType}(Avl)`,
//                         cellRendererFramework: CustomCellRenderer,
//                         // valueGetter: params => `${params.data[roomType].price} (${params.data[roomType].count})`,
//                         valueGetter: params => `${params.data[roomType].price} (${params.data[roomType].count}) ${params.data[roomType].isStopSell === 1 ? '🔴' : ''}`,

//                         maxWidth: 140,
//                         editable: true,
//                         valueSetter: params => {
//                             const newValInt = parseInt(params.newValue);
//                             const valueChanged = params.data[roomType].price !== newValInt;
//                             if (valueChanged) {
//                                 params.data[roomType].price = newValInt;
//                             }
//                             return valueChanged;
//                         },
//                         cellStyle: params => {
//                             if (params.value !== 0) {
//                                 return { color: 'red' };
//                             } else if (params.data[roomType].price) {
//                                 return { color: 'green' };
//                             }
//                         }
//                     }))
//                 ];
    
//                 setColumnDefs(dynamicColumnDefs);
//                 setRowData(tabledata);
//             } else {
//                 setColumnDefs([]);
//                 setRowData([]);
//             }
//         });
//     }



//     const [price, setPrice] = useState();
//     const [basePriceID, setBasePriceID] = useState();


//     const onCellValueChanged = useCallback(event => {
       
//         let RoomType = String(event.colDef.headerName.slice(0, -5));

//         let ID = event.data[event.colDef.headerName.slice(0, -5)]['id']

//         let newRoomType = event.newValue.split("(")[0];
//         const oldRoomType = event.oldValue.split("(")[0];
//         setPrice(newRoomType)
//         setBasePriceID(ID)
//         // console.log(newRoomType)
//         if ((Number.isInteger(parseInt(newRoomType)) && parseInt(newRoomType) !== 0)) {

//             if (event.newValue.split("(")[0] !== event.oldValue.split("(")[0]) {
//                 const newRoomType = event.newValue.split("(")[0];
//                 const oldRoomType = event.oldValue.split("(")[0];
//                 // setFullData(RoomType,oldRoomType,newRoomType,event.data.date)
//                 setPopUp('Do You Want to Change ' + RoomType + ' Room Type Rate From ' + event.oldValue.split("(")[0] + ' to ' + event.newValue.split("(")[0] + ' for the date ' + event.data.date + ' ?');
//                 // console.log(fullData)


//             }
//         }
//         else {
//             handleError("Invalid BasePrice")
//             getRoomInventoryRates()

//         }

//     }, [])


//     // error handling for same guest addition
//     const handleError = (message) => {
//         return MySwal.fire({
//             title: 'Error!',
//             text: message,
//             icon: 'error',
//             customClass: {
//                 confirmButton: 'btn btn-danger',

//             },
//             allowOutsideClick: false,
//             confirmButtonText: 'Close',
//             confirmButtonColor: 'danger',
//             buttonsStyling: false
//         })
//     }


//     function Confirm() {
//         if ((Number.isInteger(parseInt(price)) && parseInt(price) !== 0)) {
//             const updatedItem = JSON.stringify({
//                 id: basePriceID,
//                 baseAmount: price
//             })
//             console.log(updatedItem)
//             fetchx(API_URL + `/updateRoomInventoryBasePrice`, {
//                 method: 'PUT',
//                 body: updatedItem,
//                 headers: {
//                     'Content-type': 'application/json'
//                 }
//             })
//                 .then((res) => res.json())
//                 .then((post) => {
//                     console.log(post)
//                     if (post.statusCode === 200) {
//                         // if()
//                         setPopUp(false)
//                         fetchx(API_URL + '/getRoomInventoryRates?hotelID=1')
//                             .then(result => result.json())
//                             .then(rowData => {
//                                 // for(let i=0; i<10;i++){
//                                 console.log(rowData['data'])
//                                 let tabledata = []
//                                 let keylist = Object.keys(rowData['data'])
//                                 // console.log(keylist)
//                                 keylist.forEach(element => {
//                                     // console.log(rowData['data'][element]['roomtype'])
//                                     // console.log(rowData['data'][element][0]['roomtype'])
//                                     let myjson = { 'date': rowData['data'][element]['date'] }
//                                     // console.log(rowData['data'][element]['baseAmount'])
//                                     console.log(rowData['data'][element]['id'][0])
//                                     rowData['data'][element]['roomtype'].forEach((roomtype, i) => {
//                                         // console.log(abc[0] , i)
//                                         console.log(i, roomtype)
//                                         myjson[roomtype] = { "count": rowData['data'][element]['roomcount'][i], "price": rowData['data'][element]['baseAmount'][i], "id": rowData['data'][element]['id'][i] }
//                                         // myjson['baseAmount'] = rowData['data'][element]['baseAmount'][i-1] 
//                                     })
//                                     tabledata.push(myjson)
//                                     // rowData['data'][element]['baseAmount'].forEach((baseAmount,i)=>{
//                                     // // console.log(roomtype)
//                                     // myjson[baseAmount] = rowData['data'][element]['baseAmount'][i]

//                                     // })
//                                     // tabledata.push(myjson)
//                                 })
//                                 console.log(tabledata)
//                                 setRowData(tabledata)
//                             }
//                             )

//                         // if length zero

//                     }
//                 })
//                 .catch((err) => {
//                     console.log(err.message)
//                 })
//         }
//         else {
//             handleError("Invalid BasePrice")
//             getRoomInventoryRates()

//         }
//     }



//     // ** State
//     const [data, setData] = useState(null);
//     const [popUp, setPopUp] = useState(false);
//     const [quickFilter, setQuickFilter] = useState('');
//     // const [fromDateFilter, setFromDate] = useState(null);
//     // const [toDateFilter, setToDate] = useState(null);
//     const [fromDateFilter, setFromDateFilter] = useState(null);
//     const [toDateFilter, setToDateFilter] = useState(null);
//     const [openStopSell, setOpenStopSell] = useState(false);
//     const [openStopSellLogs, setOpenStopSellLogs] = useState(false);


//     // ** Hooks
//     const { reset, handleSubmit, control, watch, formState: { errors }
//     } = useForm({ defaultValues });

//     const onSubmit = (data) => {
//         setData(data);
//         console.log(data)
//         if (
//             // data.hotelID !== null &&

//             data.baseAmount !== null &&
//             data.fromDate !== null &&
//             data.toDate !== null &&
//             data.roomTypeID !== null
//         ) {
//             console.log(data.baseAmount);
//             if ((Number.isInteger(parseInt(data.baseAmount)) && parseInt(data.baseAmount) !== 0)) {

//                 let createasset = JSON.stringify({
//                     // "hotelID": data.hotelID,

//                     "baseAmount": data.baseAmount,
//                     "fromDate": (Moment(String(new Date(data.fromDate[0]))).format('YYYY-MM-DD')),
//                     "toDate": (Moment(String(new Date(data.toDate[0]))).format('YYYY-MM-DD')),
//                     "roomTypeID": data.roomTypeID.value,
//                 });
//                 console.log(createasset);
//                 let res = fetchx(API_URL + "/updateRoomInventoryByForm", {
//                     method: "PUT",
//                     headers: { "Content-Type": "application/json" },
//                     body: createasset,
//                 }).then((res) => {
//                     console.log(res);
//                     if (res['status'] == 200) {
                   
//                         getRoomInventoryRates()
//                         setOpen('')
                    
//                         toast(
//                             <div className="d-flex">
//                                 <div className="me-1">
//                                     <Avatar size="sm" color="success" icon={<Check size={12} />} />
//                                 </div>
//                                 <div className="d-flex flex-column">
//                                     <h6>Form Submitted!</h6>
//                                     <h4>Rates Modified Successfully</h4>
//                                 </div>
//                             </div>
//                         );
//                     }
//                 });
//             }
//             else {
//                 handleError("Invalid BasePrice")
//             }

//         }
//     };

//     //// For Filter
//     // const onFilterTextBoxChanged1 = useCallback((newValue) => {
//     // console.log(newValue)
//     // gridRef.current.api.setFilterModel({ 
//     // date: {
//     // type: 'inRange',
//     // dateFrom: '15-8-2023',
//     // dateTo: '18-8-2023',
//     // },});

//     // }, []);

//     const [gridApi, setGridApi] = useState(null);
//     const [dateFilters, setDateFilters] = useState({ fromDate: null, toDate: null });

//     const onGridReady = (params) => {
//         setGridApi(params.api);
//     };

//     const applyDateFilters = () => {
//         const dateFilterModel = {
//             type: 'date',
//             // dateFrom: Moment(dateFilters.fromDate).format('DD-MM-YYYY'),
//             // dateTo: Moment(dateFilters.toDate).format('DD-MM-YYYY'),
//             dateFrom: '15-7-2023',
//             dateTo: '16-7-2023',
//         };

//         gridApi.setFilterModel({
//             date: [dateFilterModel],
//         });
//         console.log(dateFilterModel)
//         gridApi.refreshCells()
//     };

//     const clearDateFilters = () => {
//         setDateFilters({ fromDate: null, toDate: null });
//         gridApi.setFilterModel(null);
//     };






//     // const formattedFromDate = '1-8-2023'
//     // const formattedToDate = '10-8-2023'

//     // console.log("Formatted From Date:", formattedFromDate);
//     // console.log("Formatted To Date:", formattedToDate);

//     // const gridApi = gridRef.current.api;
//     // gridApi.setFilterModel({
//     // date: {
//     // type: 'inRange',
//     // dateFrom: formattedFromDate,
//     // dateTo: formattedToDate,
//     // },
//     // });

//     // gridApi.onFilterChanged();
//     // }, [fromDateFilter, toDateFilter]);

//     const fromDate = fromDateFilter;
//     console.log(fromDate)
//     //// For Disabling Past Date
//     // const today = Moment().format('YYYY-MM-DD');
//     const options = {
//         minDate: Today
//     };
//     const optionsToDate = {
//         minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
//     };


//     const handleReset = () => {
//         reset({
//             baseAmount: "",
//             fromDate: null,
//             toDate: null,
//             roomTypeID: null,
//         });
//     };




//     return (
//         <div>
//             <Accordion open={open} toggle={toggle}>
//                 <AccordionItem>
//                     <AccordionHeader targetId='1'><h4><b>Room Inventory Rates</b></h4></AccordionHeader>
//                     <AccordionBody accordionId='1'>
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle tag="h4">Room Inventory Rates</CardTitle>
//                             </CardHeader>
//                             <CardBody>
//                                 <Form onSubmit={handleSubmit(onSubmit)}>
//                                     <Row>


//                                         {/* <Col md='4' sm='12' className='mb-1'>
//  <div className="mb-1">
//  <Label className="form-label" for="basePrice">
//  Base Price
//  </Label>
//  <InputGroup className="input-group-merge">

//  <Controller
//  id="basePrice"
//  name="basePrice"
//  control={control}
//  placeholder="Base Price"
//  render={({ field }) => (
//  <Input
//  pattern="[0-9]*" title="Only Numbers Allowed" required
//  placeholder=""
//  {...field}
//  className={classnames("form-control", {
//  "is-invalid":
//  data !== null && (data.basePrice === null || !data.basePrice.length)
//  })}
//  />
//  )}
//  />
//  </InputGroup>
//  </div>
//  </Col> */}
//                                         <Col md='4' sm='12' className='mb-1'>
//                                             <div className="mb-1">
//                                                 <Label className="form-label" for="baseAmount">
//                                                     Base Amount
//                                                 </Label>
//                                                 <InputGroup className="input-group-merge">

//                                                     <Controller
//                                                         id="baseAmount"
//                                                         name="baseAmount"
//                                                         control={control}
//                                                         placeholder="Base Amount"
//                                                         render={({ field }) => (
//                                                             <Input
//                                                                 pattern="[0-9]*" title="Only Numbers Allowed" required
//                                                                 placeholder="Base Amount"
//                                                                 {...field}
//                                                                 className={classnames("form-control", {
//                                                                     "is-invalid":
//                                                                         data !== null && (data.baseAmount === null || !data.baseAmount.length)
//                                                                 })}
//                                                             />
//                                                         )}
//                                                     />
//                                                 </InputGroup>
//                                             </div>
//                                         </Col>

//                                         {Today !== undefined && <Col md='4' sm='12' className='mb-1'>
//                                             <div className="mb-1">
//                                                 <Label className="form-label" for="fromDate">
//                                                     From Date
//                                                 </Label>
//                                                 <Controller
//                                                     control={control}
//                                                     id='fromDate'
//                                                     name='fromDate'
//                                                     render={({ field }) => (
//                                                         <Flatpickr
//                                                             required
//                                                             placeholder="YYYY-MM-DD"
//                                                             options={options}

//                                                             {...field}
//                                                             // options={{ allowInput: true }} 
//                                                             className={classnames('form-control', {
//                                                                 'is-invalid': data !== null && data.fromDate === null
//                                                             })}
//                                                         />
//                                                     )}
//                                                 />
//                                             </div>
//                                         </Col>}
//                                         {Today !== undefined && <Col md='4' sm='12' className='mb-1'>
//                                             <div className="mb-1">
//                                                 <Label className="form-label" for="toDate">
//                                                     To Date
//                                                 </Label>
//                                                 <Controller
//                                                     control={control}
//                                                     id='toDate'
//                                                     name='toDate'
//                                                     render={({ field }) => (
//                                                         <Flatpickr
//                                                             required
//                                                             placeholder="YYYY-MM-DD"
//                                                             {...field}
//                                                             // options={{ allowInput: true }} 
//                                                             options={optionsToDate}
//                                                             className={classnames('form-control', {
//                                                                 'is-invalid': data !== null && data.toDate === null
//                                                             })}
//                                                         />
//                                                     )}
//                                                 />
//                                             </div>
//                                         </Col>
//                                         }
//                                         <Col md='4' sm='12' className='mb-1'>
//                                             <div className='mb-1'>
//                                                 <Label className='form-label' for='roomTypeID'>
//                                                     Room Type ID
//                                                 </Label>
//                                                 <Controller
//                                                     id='roomTypeID'
//                                                     control={control}
//                                                     name='roomTypeID'
//                                                     render={({ field }) => (
//                                                         <Select
//                                                             isClearable
//                                                             options={roomTypeID}
//                                                             classNamePrefix='select'
//                                                             theme={selectThemeColors}
//                                                             className={classnames('react-select', { 'is-invalid': data !== null && data.roomTypeID === null })}
//                                                             {...field}
//                                                         />
//                                                     )}
//                                                 />
//                                             </div>
//                                         </Col>

//                                         {/* <Col md='4' sm='12' className='mb-1'> */}
//                                         <div className="d-flex">
//                                             <Button className="me-1" color="primary" type="submit">
//                                                 Submit
//                                             </Button>
//                                             <Button
//                                                 outline
//                                                 color="secondary"
//                                                 type="reset"
//                                                 onClick={handleReset}
//                                             >
//                                                 Reset
//                                             </Button>
//                                         </div>
//                                         {/* </Col> */}
//                                     </Row>
//                                 </Form>
//                             </CardBody>
//                         </Card>
//                     </AccordionBody>
//                 </AccordionItem>
//             </Accordion>


//             <Row>
//                 <Col md='3' sm='12' className='mb-1'>
//                     <Label className='form-label' for='fullName'>
//                         From Date
//                     </Label>
//                     <Flatpickr
//                         isClearable
//                         // options={{
//                         // dateFormat: "j-n-Y",
//                         // }}
//                         options={options}
//                         type="text"
//                         className='form-control'
//                         value={fromDateFilter}
//                         id="filter-text-box1"
//                         placeholder="Filter..."
//                         // onInput={onFilterTextBoxChanged1}
//                         // value={quickFilter} // Bind the value to the state
//                         onInput={(event) => {
//                             setFromDateFilter(event.target.value); // Update the state when the input changes
//                             // onFilterTextBoxChanged1(event.target.value); // Call your existing filter handler
//                         }}

//                     />
//                 </Col>
//                 <Col md='3' sm='12' className='mb-1'>
//                     <Label className='form-label' for='fullName'>
//                         To Date
//                     </Label>
//                     <Flatpickr

//                         // options={{
//                         // dateFormat: "j-n-Y",
//                         // }}
//                         value={toDateFilter}
//                         options={optionsToDate}
//                         type="text"
//                         className='form-control'

//                         id="filter-text-box2"
//                         placeholder="Filter..."
//                         // onInput={onFilterTextBoxChanged1}
//                         // value={quickFilter} // Bind the value to the state
//                         onInput={(event) => {
//                             setToDateFilter(event.target.value); // Update the state when the input changes
//                             // onFilterTextBoxChanged1(event.target.value); // Call your existing filter handler
//                         }}

//                     />
      


//                 </Col>

//     \
//                 <Col md='6' sm='12' className='mt-2'>
//                     <Button color='primary' className='me-1' onClick={() => getRoomInventoryRates()}>
//                         Apply Filter
//                     </Button>
//                     {/* </Col> */}
//                     {/* {(toDateFilter !== null && fromDateFilter !== null) && getRoomInventoryRates()} */}
//                     {/* <Col md='6' sm='12' className='mb-1'> */}
//                     <Button
//                         // color='link'
//                         className='me-1'
                     
//                         onClick={function (e) { e.preventDefault(); setFromDateFilter(null); setToDateFilter(null); getRoomInventoryRates(1) }}
//                     >
//                         Reset Filter
//                     </Button>
//                     <Button className="me-1" color="primary" onClick={() => setOpenStopSell(true)}>
//                         Stop Sell
//                     </Button>
//                     <Button className="me-1" color="primary" onClick={() => setOpenStopSellLogs(true)}>
//                         Stop Sell Logs
//                     </Button>
//                 </Col>
//             </Row>





//             <Modal
//                         isOpen={openStopSell}
//                         toggle={() => setOpenStopSell(!openStopSell)}
//                         className="modal-lg"
//                         centered
//                     >
//                         {" "}
//                         {/*onClosed={onDiscard}*/}
//                         <ModalHeader
//                             className="modal-lg"
//                             toggle={() => {
//                                 setOpenStopSell(!openStopSell);
//                             }}
//                         >
//                         </ModalHeader>
//                         <ModalBody className="pb-3 px-sm-2 mx-20">
//                             <div>
//                                 {Today  && <StopSell Today={Today} getRoomInventoryRates={getRoomInventoryRates} closeStopSell={closeStopSell}/>}
//                             </div>
//                         </ModalBody>
//                     </Modal>



//                     <Modal
//                         isOpen={openStopSellLogs}
//                         toggle={() => setOpenStopSellLogs(!openStopSellLogs)}
//                         className="modal-lg"
//                         centered
//                     >
//                    <ModalHeader
//                             className="modal-lg"
//                             toggle={() => {
//                                 setOpenStopSellLogs(!openStopSellLogs);
//                             }}
//                         >
//                         </ModalHeader>
//                         <ModalBody className="pb-3 px-sm-2 mx-20">
//                             <div>
//                                 {Today  && <StopSellLogs/>}
//                             </div>
//                         </ModalBody>
//                     </Modal>





//             <div className="ag-theme-alpine" style={{ height: 520 }}>
//                 <AgGridReact
//                     ref={gridRef}
//                     rowData={rowData} columnDefs={columnDefs}
//                     animateRows={true} rowSelection='multiple'
//                     onCellClicked={cellClickedListener}
//                     // paginationAutoPageSize = 'true'
//                     onCellValueChanged={onCellValueChanged}
//                     paginationPageSize='10'
//                     pagination='true'
//                     defaultColDef={defaultColDef}
//                     headerColor="ddw-primary"
//                     onGridReady={onGridReady}
//                 />
//             </div>
//             {popUp && (
//                 <div className="disabled-animation-modal">
//                     <Modal
//                         isOpen={popUp}
//                         toggle={() => setPopUp(!popUp)}
//                         className="modal-sm"
//                     >
//                         {" "}
//                         {/*onClosed={onDiscard}*/}
//                         <ModalHeader
//                             className="modal-sm"
//                             toggle={() => {
//                                 setPopUp(!popUp);
//                             }}
//                         >
//                             Need To Check..
//                         </ModalHeader>
//                         <ModalBody className="pb-3 px-sm-2 mx-20">
//                             <div>
//                                 <b>{popUp}</b>
//                                 <br></br>
//                                 <br></br>
//                                 <div className="d-flex">
//                                     <Button
//                                         color="primary"
//                                         className="me-1"
//                                         // className="text-center"
//                                         onClick={() => Confirm()}
//                                     >
//                                         Confirm
//                                     </Button>
//                                     <Button
//                                         color="danger"
//                                         className="me-1"
//                                         // className="text-center"
//                                         onClick={() => { setPopUp(false), getRoomInventoryRates() }}
//                                     >
//                                         Cancel
//                                     </Button>
//                                 </div>
//                             </div>
//                         </ModalBody>
//                     </Modal>
//                 </div>
//             )}
//             {/* <App/> */}
//         </div>
//     );
// };

// export default RoomInventory;











// ** React Imports
import { useState } from "react";
import axios from "axios";
// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Moment from 'moment';

// ** Custom Components
import Avatar from "@components/avatar";


import API_URL from "../../../config";
// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {
    Input, Card, Form, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, Modal, ModalBody, ModalHeader, InputGroupText, Row, Col,
    Accordion, AccordionBody, AccordionHeader, AccordionItem
} from "reactstrap";


// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from 'react';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

import StopSell from './stopSell'
import StopSellLogs from './stopSellLogs'
import InventoryLogs from "../sellControlRooms/inventoryLogs";

const id = '1'
const date = '2023-02-02'
const roomID = '30'

const activeoptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "InActive" },
];



const defaultValues = {
    roomID: "",
    numAvlRooms: "",
    numSellCtrlRooms: "",
    numOodRooms: "",
    numOverbookedRooms: "",
    sellLimit: "",
    date: null,
    roomTypeID: "",
};


let roomTypeID = [
    fetchx(API_URL + '/getRoomInventoryRoomTypeID?hotelID=1')
        .then(result => result.json())
        .then(resp => {
            // console.log(resp['data'])
            roomTypeID = resp['data']
            console.log(roomTypeID)
        })
]



const RoomInventory = () => {

    const [open, setOpen] = useState('')
    const [Today, setToday] = useState()



    useEffect(() => {
        const hotelIDData = JSON.stringify({
            hotelID: 1
        })
        fetchx(API_URL + "/getBusinessDate", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: hotelIDData
        }).then((res) => res.json())
            .then(postres => {
                const today = new Date(postres['data'][0]['businessDate']);
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
            })
    }, []);

    const toggle = id => {
        open === id ? setOpen() : setOpen(id)
    }

    function CustomCellRenderer(props) {
        const value = props.value;
        // Split the value into the "5000" and "(9)" parts
        const number = value.split("(")[0];
        const suffix = value.split("(")[1].replace(")", "");
        console.log(props)
        const isStopSell = props.data.isStopSell === 1;
console.log(isStopSell)
        return (
            <div>
                <span style={{ color: 'red' }}>{number}</span>
                <span style={{ color: 'green' }}> ({suffix})</span>
            {/* {isStopSell ? '🔴' : ''} */}

            </div>
        );
    }
    // AG Grid
    const [rowData, setRowData] = useState();

    const gridRef = useRef();




    console.log(roomTypeID)
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
        console.log('cellClicked', event);

    }, []);


    const [columnDefs, setColumnDefs] = useState([]);


    useEffect(() => {
        let createasset = JSON.stringify({
            fromDate: fromDateFilter,
            toDate: toDateFilter
        });

        let res = fetchx(API_URL + "/getRoomInventoryRates?hotelID=1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: createasset,
        })
            .then(result => result.json())
            .then(rowData => {
                console.log(rowData['data']);
                const lengthOfData = Object.keys(rowData['data']).length;
                let tabledata = [];

                if (lengthOfData !== 0) {
                    let keylist = Object.keys(rowData['data']);
                    keylist.forEach(element => {
                        let myjson = { 'date': rowData['data'][element]['date'] };

                        rowData['data'][element]['roomtype'].forEach((roomtype, i) => {
                            myjson[roomtype] = { "count": rowData['data'][element]['roomcount'][i], "price": rowData['data'][element]['baseAmount'][i], "id": rowData['data'][element]['id'][i],"isStopSell": rowData['data'][element].isStopSell[i] };
                        });

                        tabledata.push(myjson);
                    });

                    console.log(tabledata);
                    const roomTypes = rowData['data'][keylist[0]]['roomtype'];



                    let roomTypesWithIDs = keylist.map(element => {
                        return rowData['data'][element]['roomtype'].map((roomtype, i) => {
                            return {
                                roomType: roomtype,
                                roomTypeID: rowData['data'][element]['roomTypeID'][i] // Assuming roomTypeID is part of the data
                            };
                        });
                    });
            
                    // Flatten array of arrays
                    roomTypesWithIDs = roomTypesWithIDs.flat();
            
                    // Remove duplicates based on roomTypeID and sort by roomTypeID
                    const sortedRoomTypes = Array.from(new Set(roomTypesWithIDs.map(item => item.roomTypeID)))
                        .map(id => roomTypesWithIDs.find(item => item.roomTypeID === id))
                        .sort((a, b) => a.roomTypeID - b.roomTypeID);

                        
                        
                    // Create dynamic columnDefs based on roomTypes
                    const dynamicColumnDefs = [
                        { headerName: 'Inventory Date', field: 'date', maxWidth: 180, filter: 'agDateColumnFilter',    valueFormatter: (params) => {
                            return params.value ? Moment(params.value, 'D-M-YYYY').format('DD MMM YYYY, ddd') : '';
                          }
                         },                        // ...roomTypes.map(roomType => {
                            ...sortedRoomTypes.map(({ roomType }) => {

                            console.log(roomType)
                            // const isStopSell = params.data[roomType].isStopSell === 1;
                            return {

                            headerName: `${roomType}(Avl)`,
                            // headerName: `${roomType}(Avl) ${tabledata.some(row => row[roomType]?.isStopSell === 1) ? '🔴' : ''}`, // Append red dot if isStopSell === 1

                            cellRendererFramework: CustomCellRenderer,
                            // valueGetter: params => `${params.data[roomType].price} (${params.data[roomType].count}) `+`${params.data[roomType].isStopSell ===1  ? '🔴' : ''`,
                            valueGetter: params => `${params.data[roomType].price} (${params.data[roomType].count}) ${params.data[roomType].isStopSell === 1 ? '🔴' : ''}`,

                            maxWidth: 140,
                            editable: true,
                            valueSetter: params => {
                                const newValInt = parseInt(params.newValue);
                                const valueChanged = params.data[roomType].price !== newValInt;
                                if (valueChanged) {
                                    params.data[roomType].price = newValInt;
                                }
                                return valueChanged;
                            },
                            cellStyle: params => {
                                if (params.value !== 0) {
                                    return { color: 'red' };
                                } else if (params.data[roomType].price) {
                                    return { color: 'green' };
                                }
                            },
                        }
                     
                        })
                    ];

                    setColumnDefs(dynamicColumnDefs);
                    setRowData(tabledata);
                } else {
                    setColumnDefs([]);
                    setRowData([]);
                }
            });
    }, []);

    function getRoomInventoryRates(nullDate) {
        // fetchx(API_URL + '/getRoomInventoryRates?hotelID=1')
        let createasset;
        if (nullDate) {
            createasset = JSON.stringify({
                // fromDate: '2023-07-15',
                // toDate:'2023-07-16'
                fromDate: null,
                toDate: null
            });
        } else {
            createasset = JSON.stringify({
                // fromDate: '2023-07-15',
                // toDate:'2023-07-16'
                fromDate: fromDateFilter,
                toDate: toDateFilter
            });
        }


        let res = fetchx(API_URL + "/getRoomInventoryRates?hotelID=1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: createasset,
        })
            .then(result => result.json())
            .then(rowData => {
                console.log(rowData['data']);
               

                const lengthOfData = Object.keys(rowData['data']).length;
                let tabledata = [];

                if (lengthOfData !== 0) {
                    let keylist = Object.keys(rowData['data']);
                    keylist.forEach(element => {
                        let myjson = { 'date': rowData['data'][element]['date'] };

                        rowData['data'][element]['roomtype'].forEach((roomtype, i) => {
                            myjson[roomtype] = { "count": rowData['data'][element]['roomcount'][i], "price": rowData['data'][element]['baseAmount'][i], "id": rowData['data'][element]['id'][i],"isStopSell": rowData['data'][element].isStopSell[i]  };
                        });

                        tabledata.push(myjson);
                    });

                    console.log(tabledata);
                    const roomTypes = rowData['data'][keylist[0]]['roomtype'];



                    let roomTypesWithIDs = keylist.map(element => {
                        return rowData['data'][element]['roomtype'].map((roomtype, i) => {
                            return {
                                roomType: roomtype,
                                roomTypeID: rowData['data'][element]['roomTypeID'][i] // Assuming roomTypeID is part of the data
                            };
                        });
                    });
            
                    // Flatten array of arrays
                    roomTypesWithIDs = roomTypesWithIDs.flat();
            
                    // Remove duplicates based on roomTypeID and sort by roomTypeID
                    const sortedRoomTypes = Array.from(new Set(roomTypesWithIDs.map(item => item.roomTypeID)))
                        .map(id => roomTypesWithIDs.find(item => item.roomTypeID === id))
                        .sort((a, b) => a.roomTypeID - b.roomTypeID);

                        
                        
                    // Create dynamic columnDefs based on roomTypes
                    const dynamicColumnDefs = [
                        { headerName: 'Inventory Date', field: 'date', maxWidth: 180, filter: 'agDateColumnFilter',    valueFormatter: (params) => {
                            return params.value ? Moment(params.value, 'D-M-YYYY').format('DD MMM YYYY, ddd') : '';
                          }
                         },                        // ...roomTypes.map(roomType => {
                            ...sortedRoomTypes.map(({ roomType }) => {

                            console.log(roomType)
                            // const isStopSell = params.data[roomType].isStopSell === 1;
                            return {

                            headerName: `${roomType}(Avl)`,
                            // headerName: `${roomType}(Avl) ${tabledata.some(row => row[roomType]?.isStopSell === 1) ? '🔴' : ''}`, // Append red dot if isStopSell === 1

                            cellRendererFramework: CustomCellRenderer,
                            valueGetter: params => `${params.data[roomType].price} (${params.data[roomType].count}) ${params.data[roomType].isStopSell === 1 ? '🔴' : ''}`,

                            maxWidth: 140,
                            editable: true,
                            valueSetter: params => {
                                const newValInt = parseInt(params.newValue);
                                const valueChanged = params.data[roomType].price !== newValInt;
                                if (valueChanged) {
                                    params.data[roomType].price = newValInt;
                                }
                                return valueChanged;
                            },
                            cellStyle: params => {
                                if (params.value !== 0) {
                                    return { color: 'red' };
                                } else if (params.data[roomType].price) {
                                    return { color: 'green' };
                                }
                            },
                        }
                     
                        })
                    ];

                    setColumnDefs(dynamicColumnDefs);
                    setRowData(tabledata);
                } else {
                    setColumnDefs([]);
                    setRowData([]);
                }
            });
    }



    const [price, setPrice] = useState();
    const [basePriceID, setBasePriceID] = useState();


    const onCellValueChanged = useCallback(event => {

        let RoomType = String(event.colDef.headerName.slice(0, -5));
  
        let ID = event.data[event.colDef.headerName.slice(0, -5)]['id']
      
        let newRoomType = event.newValue.split("(")[0];
        const oldRoomType = event.oldValue.split("(")[0];
        setPrice(newRoomType)
        setBasePriceID(ID)
        console.log(newRoomType)
        if ((Number.isInteger(parseInt(newRoomType)) && parseInt(newRoomType) !== 0)) {

            if (event.newValue.split("(")[0] !== event.oldValue.split("(")[0]) {
                const newRoomType = event.newValue.split("(")[0];
                const oldRoomType = event.oldValue.split("(")[0];
                // setFullData(RoomType,oldRoomType,newRoomType,event.data.date)
                setPopUp('Do You Want to Change ' + RoomType + ' Room Type Rate From ' + event.oldValue.split("(")[0] + ' to ' + event.newValue.split("(")[0] + ' for the date ' + event.data.date + ' ?');
                console.log(fullData)


            }
        }
        else {
            handleError("Invalid BasePrice")
            getRoomInventoryRates()

        }

    }, [])


    // error handling for same guest addition
    const handleError = (message) => {
        return MySwal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            customClass: {
                confirmButton: 'btn btn-danger',

            },
            allowOutsideClick: false,
            confirmButtonText: 'Close',
            confirmButtonColor: 'danger',
            buttonsStyling: false
        })
    }


    function Confirm() {
        if ((Number.isInteger(parseInt(price)) && parseInt(price) !== 0)) {
            const updatedItem = JSON.stringify({
                id: basePriceID,
                baseAmount: price
            })
            console.log(updatedItem)
            fetchx(API_URL + `/updateRoomInventoryBasePrice`, {
                method: 'PUT',
                body: updatedItem,
                headers: {
                    'Content-type': 'application/json'
                }
            })
                .then((res) => res.json())
                .then((post) => {
                    console.log(post)
                    if (post.statusCode === 200) {
                        // if()
                        setPopUp(false)
                        let createasset = JSON.stringify({
                            fromDate: fromDateFilter,
                            toDate: toDateFilter
                        });
                
                        let res = fetchx(API_URL + "/getRoomInventoryRates?hotelID=1", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: createasset,
                        })
                            .then(result => result.json())
                            .then(rowData => {
                                console.log(rowData['data']);
                                const lengthOfData = Object.keys(rowData['data']).length;
                                let tabledata = [];
                
                                if (lengthOfData !== 0) {
                                    let keylist = Object.keys(rowData['data']);
                                    keylist.forEach(element => {
                                        let myjson = { 'date': rowData['data'][element]['date'] };
                
                                        rowData['data'][element]['roomtype'].forEach((roomtype, i) => {
                                            myjson[roomtype] = { "count": rowData['data'][element]['roomcount'][i], "price": rowData['data'][element]['baseAmount'][i], "id": rowData['data'][element]['id'][i],"isStopSell": rowData['data'][element].isStopSell[i] };
                                        });
                
                                        tabledata.push(myjson);
                                    });
                
                                    console.log(tabledata);
                                    const roomTypes = rowData['data'][keylist[0]]['roomtype'];
                
                
                
                                    let roomTypesWithIDs = keylist.map(element => {
                                        return rowData['data'][element]['roomtype'].map((roomtype, i) => {
                                            return {
                                                roomType: roomtype,
                                                roomTypeID: rowData['data'][element]['roomTypeID'][i] // Assuming roomTypeID is part of the data
                                            };
                                        });
                                    });
                            
                                    // Flatten array of arrays
                                    roomTypesWithIDs = roomTypesWithIDs.flat();
                            
                                    // Remove duplicates based on roomTypeID and sort by roomTypeID
                                    const sortedRoomTypes = Array.from(new Set(roomTypesWithIDs.map(item => item.roomTypeID)))
                                        .map(id => roomTypesWithIDs.find(item => item.roomTypeID === id))
                                        .sort((a, b) => a.roomTypeID - b.roomTypeID);
                
                                        
                                        
                                    // Create dynamic columnDefs based on roomTypes
                                    const dynamicColumnDefs = [
                                        { headerName: 'Inventory Date', field: 'date', maxWidth: 180, filter: 'agDateColumnFilter',    valueFormatter: (params) => {
                                            return params.value ? Moment(params.value, 'D-M-YYYY').format('DD MMM YYYY, ddd') : '';
                                          }
                                         },                                        // ...roomTypes.map(roomType => {
                                            ...sortedRoomTypes.map(({ roomType }) => {
                
                                            console.log(roomType)
                                            // const isStopSell = params.data[roomType].isStopSell === 1;
                                            return {
                
                                            headerName: `${roomType}(Avl)`,
                                            // headerName: `${roomType}(Avl) ${tabledata.some(row => row[roomType]?.isStopSell === 1) ? '🔴' : ''}`, // Append red dot if isStopSell === 1
                
                                            cellRendererFramework: CustomCellRenderer,
                                            // valueGetter: params => `${params.data[roomType].price} (${params.data[roomType].count}) `+`${params.data[roomType].isStopSell ===1  ? '🔴' : ''`,
                                            valueGetter: params => `${params.data[roomType].price} (${params.data[roomType].count}) ${params.data[roomType].isStopSell === 1 ? '🔴' : ''}`,
                
                                            maxWidth: 140,
                                            editable: true,
                                            valueSetter: params => {
                                                const newValInt = parseInt(params.newValue);
                                                const valueChanged = params.data[roomType].price !== newValInt;
                                                if (valueChanged) {
                                                    params.data[roomType].price = newValInt;
                                                }
                                                return valueChanged;
                                            },
                                            cellStyle: params => {
                                                if (params.value !== 0) {
                                                    return { color: 'red' };
                                                } else if (params.data[roomType].price) {
                                                    return { color: 'green' };
                                                }
                                            },
                                        }
                                     
                                        })
                                    ];
                
                                    setColumnDefs(dynamicColumnDefs);
                                    setRowData(tabledata);
                                } else {
                                    setColumnDefs([]);
                                    setRowData([]);
                                }
                            });

                        // if length zero

                    }
                })
                .catch((err) => {
                    console.log(err.message)
                })
        }
        else {
            handleError("Invalid BasePrice")
            getRoomInventoryRates()

        }
    }



    // ** State
    const [data, setData] = useState(null);
    const [popUp, setPopUp] = useState(false);
    const [openStopSell, setOpenStopSell] = useState(false);
    const [openStopSellLogs, setOpenStopSellLogs] = useState(false);
    const [invLogs, setOpenLogs] = useState(false);
    
    const [quickFilter, setQuickFilter] = useState('');
    // const [fromDateFilter, setFromDate] = useState(null);
    // const [toDateFilter, setToDate] = useState(null);
    const [fromDateFilter, setFromDateFilter] = useState(null);
    const [toDateFilter, setToDateFilter] = useState(null);


    // ** Hooks
    const { reset, handleSubmit, control, watch, formState: { errors }
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        setData(data);
        console.log(data)
        if (
            // data.hotelID !== null &&

            data.baseAmount !== null &&
            data.fromDate !== null &&
            data.toDate !== null &&
            data.roomTypeID !== null
        ) {
            console.log(data.baseAmount);
            if ((Number.isInteger(parseInt(data.baseAmount)) && parseInt(data.baseAmount) !== 0)) {

                let createasset = JSON.stringify({
                    // "hotelID": data.hotelID,

                    "baseAmount": data.baseAmount,
                    "fromDate": (Moment(String(new Date(data.fromDate[0]))).format('YYYY-MM-DD')),
                    "toDate": (Moment(String(new Date(data.toDate[0]))).format('YYYY-MM-DD')),
                    "roomTypeID": data.roomTypeID.value,
                });
                console.log(createasset);
                let res = fetchx(API_URL + "/updateRoomInventoryByForm", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: createasset,
                }).then((res) => {
                    console.log(res);
                    if (res['status'] == 200) {
                 
                        getRoomInventoryRates()
                        setOpen('')
                       
                        toast(
                            <div className="d-flex">
                                <div className="me-1">
                                    <Avatar size="sm" color="success" icon={<Check size={12} />} />
                                </div>
                                <div className="d-flex flex-column">
                                    <h6>Form Submitted!</h6>
                                    <h4>Rates Modified Successfully</h4>
                                </div>
                            </div>
                        );
                    }
                });
            }
            else {
                handleError("Invalid BasePrice")
            }

        }
    };

    //// For Filter
    // const onFilterTextBoxChanged1 = useCallback((newValue) => {
    // console.log(newValue)
    // gridRef.current.api.setFilterModel({ 
    // date: {
    // type: 'inRange',
    // dateFrom: '15-8-2023',
    // dateTo: '18-8-2023',
    // },});

    // }, []);

    const [gridApi, setGridApi] = useState(null);
    const [dateFilters, setDateFilters] = useState({ fromDate: null, toDate: null });

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const applyDateFilters = () => {
        const dateFilterModel = {
            type: 'date',
            // dateFrom: Moment(dateFilters.fromDate).format('DD-MM-YYYY'),
            // dateTo: Moment(dateFilters.toDate).format('DD-MM-YYYY'),
            dateFrom: '15-7-2023',
            dateTo: '16-7-2023',
        };

        gridApi.setFilterModel({
            date: [dateFilterModel],
        });
        console.log(dateFilterModel)
        gridApi.refreshCells()
    };

    const clearDateFilters = () => {
        setDateFilters({ fromDate: null, toDate: null });
        gridApi.setFilterModel(null);
    };






    // const formattedFromDate = '1-8-2023'
    // const formattedToDate = '10-8-2023'

    // console.log("Formatted From Date:", formattedFromDate);
    // console.log("Formatted To Date:", formattedToDate);

    // const gridApi = gridRef.current.api;
    // gridApi.setFilterModel({
    // date: {
    // type: 'inRange',
    // dateFrom: formattedFromDate,
    // dateTo: formattedToDate,
    // },
    // });

    // gridApi.onFilterChanged();
    // }, [fromDateFilter, toDateFilter]);

    const fromDate = fromDateFilter;
    console.log(fromDate)
    //// For Disabling Past Date
    // const today = Moment().format('YYYY-MM-DD');
    const options = {
        minDate: Today
    };
    const optionsToDate = {
        minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
    };


    const handleReset = () => {
        reset({
            baseAmount: "",
            fromDate: null,
            toDate: null,
            roomTypeID: null,
        });
    };

function closeStopSell (){
setOpenStopSell(!openStopSell)
}


    return (
        <div>
            <Accordion open={open} toggle={toggle}>
                <AccordionItem>
                    <AccordionHeader targetId='1'><h4><b>Room Inventory Rates</b></h4></AccordionHeader>
                    <AccordionBody accordionId='1'>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Room Inventory Rates</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>


                  
                                        <Col md='4' sm='12' className='mb-1'>
                                            <div className="mb-1">
                                                <Label className="form-label" for="baseAmount">
                                                    Base Amount
                                                </Label>
                                                <InputGroup className="input-group-merge">

                                                    <Controller
                                                        id="baseAmount"
                                                        name="baseAmount"
                                                        control={control}
                                                        placeholder="Base Amount"
                                                        render={({ field }) => (
                                                            <Input
                                                                pattern="[0-9]*" title="Only Numbers Allowed" required
                                                                placeholder="Base Amount"
                                                                {...field}
                                                                className={classnames("form-control", {
                                                                    "is-invalid":
                                                                        data !== null && (data.baseAmount === null || !data.baseAmount.length)
                                                                })}
                                                            />
                                                        )}
                                                    />
                                                </InputGroup>
                                            </div>
                                        </Col>

                                        {Today !== undefined && <Col md='4' sm='12' className='mb-1'>
                                            <div className="mb-1">
                                                <Label className="form-label" for="fromDate">
                                                    From Date
                                                </Label>
                                                <Controller
                                                    control={control}
                                                    id='fromDate'
                                                    name='fromDate'
                                                    render={({ field }) => (
                                                        <Flatpickr
                                                            required
                                                            placeholder="YYYY-MM-DD"
                                                            options={options}

                                                            {...field}
                                                            // options={{ allowInput: true }} 
                                                            className={classnames('form-control', {
                                                                'is-invalid': data !== null && data.fromDate === null
                                                            })}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>}
                                        {Today !== undefined && <Col md='4' sm='12' className='mb-1'>
                                            <div className="mb-1">
                                                <Label className="form-label" for="toDate">
                                                    To Date
                                                </Label>
                                                <Controller
                                                    control={control}
                                                    id='toDate'
                                                    name='toDate'
                                                    render={({ field }) => (
                                                        <Flatpickr
                                                            required
                                                            placeholder="YYYY-MM-DD"
                                                            {...field}
                                                            // options={{ allowInput: true }} 
                                                            options={optionsToDate}
                                                            className={classnames('form-control', {
                                                                'is-invalid': data !== null && data.toDate === null
                                                            })}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>
                                        }
                                        <Col md='4' sm='12' className='mb-1'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='roomTypeID'>
                                                    Room Type ID
                                                </Label>
                                                <Controller
                                                    id='roomTypeID'
                                                    control={control}
                                                    name='roomTypeID'
                                                    render={({ field }) => (
                                                        <Select
                                                            isClearable
                                                            options={roomTypeID}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select', { 'is-invalid': data !== null && data.roomTypeID === null })}
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>

                                        {/* <Col md='4' sm='12' className='mb-1'> */}
                                        <div className="d-flex">
                                            <Button className="me-1" color="primary" type="submit">
                                                Submit
                                            </Button>
                                            <Button
                                                outline
                                                color="secondary"
                                                type="reset"
                                                onClick={handleReset}
                                            >
                                                Reset
                                            </Button>

                                        </div>
                                        {/* </Col> */}
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </AccordionBody>
                </AccordionItem>
            </Accordion>


            <Row>
                <Col md='3' sm='12' className='mb-1'>
                    <Label className='form-label' for='fullName'>
                        From Date
                    </Label>
                    <Flatpickr
                        isClearable
                        // options={{
                        // dateFormat: "j-n-Y",
                        // }}
                        options={options}
                        type="text"
                        className='form-control'
                        value={fromDateFilter}
                        id="filter-text-box1"
                        placeholder="Filter..."
                        // onInput={onFilterTextBoxChanged1}
                        // value={quickFilter} // Bind the value to the state
                        onInput={(event) => {
                            setFromDateFilter(event.target.value); // Update the state when the input changes
                            // onFilterTextBoxChanged1(event.target.value); // Call your existing filter handler
                        }}

                    />
                </Col>
                <Col md='3' sm='12' className='mb-1'>
                    <Label className='form-label' for='fullName'>
                        To Date
                    </Label>
                    <Flatpickr

                        // options={{
                        // dateFormat: "j-n-Y",
                        // }}
                        value={toDateFilter}
                        options={optionsToDate}
                        type="text"
                        className='form-control'

                        id="filter-text-box2"
                        placeholder="Filter..."
                        // onInput={onFilterTextBoxChanged1}
                        // value={quickFilter} // Bind the value to the state
                        onInput={(event) => {
                            setToDateFilter(event.target.value); // Update the state when the input changes
                            // onFilterTextBoxChanged1(event.target.value); // Call your existing filter handler
                        }}

                    />
             


                </Col>

            
                <Col md='6' sm='12' className='mt-2'>
                    <Button color='primary' className='me-1' onClick={() => getRoomInventoryRates()}>
                        Apply Filter
                    </Button>
                    {/* </Col> */}
                    {/* {(toDateFilter !== null && fromDateFilter !== null) && getRoomInventoryRates()} */}
                    {/* <Col md='6' sm='12' className='mb-1'> */}
                    <Button
                        // color='link'
                        className='me-1'
                     
                        onClick={function (e) { e.preventDefault(); setFromDateFilter(null); setToDateFilter(null); getRoomInventoryRates(1) }}
                    >
                        Reset Filter
                    </Button>
                    <Button className="me-1" color="primary" onClick={() => setOpenStopSell(true)}>
                        Stop Sell
                    </Button>
                    <Button className="me-1" color="primary" onClick={() => setOpenStopSellLogs(true)}>
                        Stop Sell Logs
                    </Button>
                    <Button
                                color='primary'
                                className='me-1'
                                onClick={() => setOpenLogs(true)}
                            >
                                Logs
                            </Button>
                </Col>

            </Row>






                    <Modal
                        isOpen={openStopSell}
                        toggle={() => setOpenStopSell(!openStopSell)}
                        className="modal-lg"
                        centered
                    >
                        {" "}
                        {/*onClosed={onDiscard}*/}
                        <ModalHeader
                            className="modal-lg"
                            toggle={() => {
                                setOpenStopSell(!openStopSell);
                            }}
                        >
                        </ModalHeader>
                        <ModalBody className="pb-3 px-sm-2 mx-20">
                            <div>
                                {Today  && <StopSell Today={Today} getRoomInventoryRates={getRoomInventoryRates} closeStopSell={closeStopSell}/>}
                            </div>
                        </ModalBody>
                    </Modal>

                    <Modal
                        isOpen={invLogs}
                        toggle={() => setOpenLogs(!invLogs)}
                        style={{ maxWidth: '1400px', maxHeight: '60vh' }}
                    >
                        <ModalHeader toggle={() => setOpenLogs(!invLogs)} className='bg-transparent'></ModalHeader>
                        <ModalBody className='px-sm-4'>
                            <InventoryLogs />

                        </ModalBody>
                    </Modal>

                    <Modal
                        isOpen={openStopSellLogs}
                        toggle={() => setOpenStopSellLogs(!openStopSellLogs)}
                        className="modal-lg"
                        centered
                    >
                   <ModalHeader
                            className="modal-lg"
                            toggle={() => {
                                setOpenStopSellLogs(!openStopSellLogs);
                            }}
                        >
                        </ModalHeader>
                        <ModalBody className="pb-3 px-sm-2 mx-20">
                            <div>
                                {Today  && <StopSellLogs/>}
                            </div>
                        </ModalBody>
                    </Modal>


            <div className="ag-theme-alpine" style={{ height: 520 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData} columnDefs={columnDefs}
                    animateRows={true} rowSelection='multiple'
                    onCellClicked={cellClickedListener}
                    // paginationAutoPageSize = 'true'
                    onCellValueChanged={onCellValueChanged}
                    paginationPageSize='10'
                    pagination='true'
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"
                    onGridReady={onGridReady}
                />
            </div>
            {popUp && (
                <div className="disabled-animation-modal">
                    <Modal
                        isOpen={popUp}
                        toggle={() => setPopUp(!popUp)}
                        className="modal-sm"
                    >
                        {" "}
                        {/*onClosed={onDiscard}*/}
                        <ModalHeader
                            className="modal-sm"
                            toggle={() => {
                                setPopUp(!popUp);
                            }}
                        >
                            Need To Check..
                        </ModalHeader>
                        <ModalBody className="pb-3 px-sm-2 mx-20">
                            <div>
                                <b>{popUp}</b>
                                <br></br>
                                <br></br>
                                <div className="d-flex">
                                    <Button
                                        color="primary"
                                        className="me-1"
                                        // className="text-center"
                                        onClick={() => Confirm()}
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        color="danger"
                                        className="me-1"
                                        // className="text-center"
                                        onClick={() => { setPopUp(false), getRoomInventoryRates() }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            )}




            {/* <App/> */}
        </div >
    );
};

export default RoomInventory;
