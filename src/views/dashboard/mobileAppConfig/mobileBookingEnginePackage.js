// // // Import ag-grid
// // import 'ag-grid-enterprise'
// // import { AgGridReact } from 'ag-grid-react'
// // import '/node_modules/ag-grid-community/styles/ag-grid.css'
// // import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// // import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
// // import {
// //     Card, CardHeader, CardTitle, Label, Col, Input, Row, Button,
// //     Accordion, AccordionBody, AccordionHeader, AccordionItem,
// //     CardBody, Form, Modal, ModalBody, ModalHeader
// // } from 'reactstrap';
// // import API_URL from '../../../config';
// // import { useForm, Controller } from "react-hook-form";
// // import Select from "react-select";
// // import Swal from 'sweetalert2'
// // import withReactContent from 'sweetalert2-react-content'
// // const MySwal = withReactContent(Swal)

// // import Flatpickr from "react-flatpickr";
// // import "@styles/react/libs/flatpickr/flatpickr.scss";
// // import "@styles/react/libs/react-select/_react-select.scss";
// // import "@styles/react/pages/page-form-validation.scss";
// // import { selectThemeColors } from "@utils";


// // const BookingEnginePackage = () => {

// //     const [rowData, setRowData] = useState([]);
// //     const [open, setOpen] = useState('');
// //     const [openModal, setOpenModal] = useState(false);
// //     const [selectedRow, setSelectedRow] = useState(null);

// //     // dropdown options
// //     const [packageOptions, setPackageOptions] = useState([]);
// //     const [extraGroupOptions, setExtraGroupOptions] = useState([]);

// //     // base price flags
// //     const [insertIsBasePrice, setInsertIsBasePrice] = useState(false);
// //     const [editIsBasePrice, setEditIsBasePrice] = useState(false);

// //     const gridRef = useRef();

// //     // ── Forms ────────────────────────────────────────────────────────────────
// //     const {
// //         handleSubmit: handleInsertSubmit,
// //         control: insertControl,
// //         reset: resetInsert,
// //         watch: watchInsert,
// //         setValue: setInsertValue
// //     } = useForm({ defaultValues: { isBasePrice: false } });

// //     const {
// //         handleSubmit: handleEditSubmit,
// //         control: editControl,
// //         reset: resetEdit,
// //         watch: watchEdit,
// //         setValue: setEditValue
// //     } = useForm({ defaultValues: { isBasePrice: false } });

// //     // ── Alerts ───────────────────────────────────────────────────────────────
// //     const handleError = (message) => MySwal.fire({
// //         title: 'Error!', text: message, icon: 'error',
// //         customClass: { confirmButton: 'btn btn-danger' },
// //         allowOutsideClick: false, confirmButtonText: 'Close', buttonsStyling: false
// //     });

// //     const handleSuccess = (text = 'Operation completed successfully!') => MySwal.fire({
// //         title: 'Success!', text, icon: 'success',
// //         customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: false
// //     });

// //     // ── Default Col Def ──────────────────────────────────────────────────────
// //     const defaultColDef = useMemo(() => ({
// //         sortable: true, filter: true, wrapText: true, autoHeight: true,
// //         filterParams: { buttons: ['apply', 'reset'] }
// //     }), []);

// //     // ── Fetch Dropdowns ──────────────────────────────────────────────────────
// //     const fetchDropdowns = () => {
// //         // fetch package options
// //         fetchx(API_URL + '/getBookingEnginePackageList', {
// //             method: 'GET', headers: { 'Content-Type': 'application/json' }
// //         })
// //             .then(res => res.json())
// //             .then(resp => {
// //                 const opts = (resp.data || []).map(item => ({ label: item.packageName, value: item.packageID }));
// //                 setPackageOptions(opts);
// //             })
// //             .catch(err => console.error('Failed to load packages:', err));

// //         // fetch extra group options
// //         fetchx(API_URL + '/getExtraGroupList', {
// //             method: 'GET', headers: { 'Content-Type': 'application/json' }
// //         })
// //             .then(res => res.json())
// //             .then(resp => {
// //                 const opts = (resp.data || []).map(item => ({ label: item.extraGroupName, value: item.extraGroupID }));
// //                 setExtraGroupOptions(opts);
// //             })
// //             .catch(err => console.error('Failed to load extra groups:', err));
// //     };

// //     // ── Fetch Grid Data ──────────────────────────────────────────────────────
// //     const fetchData = () => {
// //         fetchx(API_URL + '/getBookingEnginePackage', {
// //             method: 'GET', headers: { 'Content-Type': 'application/json' }
// //         })
// //             .then(res => res.json())
// //             .then(resp => setRowData(resp.data || []))
// //             .catch(err => console.error('Failed to fetch grid data:', err));
// //     };

// //     useEffect(() => {
// //         fetchDropdowns();
// //         fetchData();
// //     }, []);

// //     // ── Column Definitions ───────────────────────────────────────────────────
// //     const [columnDefs] = useState([
// //         { headerName: 'ID', field: 'id', maxWidth: 80, cellStyle: { textAlign: 'center' } },
// //         { headerName: 'Hotel ID', field: 'hotelID', maxWidth: 100, cellStyle: { textAlign: 'center' } },
// //         { headerName: 'Package', field: 'bookingEnginePackage', minWidth: 150 },
// //         { headerName: 'Package ID', field: 'packageID', maxWidth: 110, cellStyle: { textAlign: 'center' } },
// //         { headerName: 'Extra Group ID', field: 'extraGroupID', maxWidth: 130, cellStyle: { textAlign: 'center' } },
// //         { headerName: 'Upsell', field: 'upsell', maxWidth: 100, cellStyle: { textAlign: 'center' } },
// //         { headerName: 'Start Date', field: 'startDate', maxWidth: 130, cellStyle: { textAlign: 'center' } },
// //         { headerName: 'End Date', field: 'endDate', maxWidth: 130, cellStyle: { textAlign: 'center' } },
// //         {
// //             headerName: 'isOterra Exclusive', field: 'isOterraExclusive', maxWidth: 150,
// //             cellStyle: { textAlign: 'center' },
// //             cellRendererFramework: (params) => (params.value ? 'Yes' : 'No')
// //         },
// //         { headerName: 'Min Nights', field: 'minNights', maxWidth: 120, cellStyle: { textAlign: 'center' } },
// //         {
// //             headerName: 'Is Weekend', field: 'isWeekEnd', maxWidth: 120,
// //             cellStyle: { textAlign: 'center' },
// //             cellRendererFramework: (params) => (params.value ? 'Yes' : 'No')
// //         },
// //         {
// //             headerName: 'Actions',
// //             cellRendererFramework: (params) => (
// //                 <Button color="primary" style={{ width: 100 }}
// //                     onClick={() => openEditModal(params.data)}>
// //                     Edit
// //                 </Button>
// //             ),
// //             suppressSizeToFit: true,
// //             cellStyle: { textAlign: 'center' },
// //             cellClass: 'vertical-center',
// //             maxWidth: 140
// //         }
// //     ]);

// //     // ── Cell Click listener ──────────────────────────────────────────────────
// //     const cellClickedListener = useCallback((params) => {
// //         if (!params.data) return;
// //         openEditModal(params.data);
// //     }, []);

// //     const openEditModal = (data) => {
// //         console.log('Edit Row:', data);
// //         setSelectedRow(data);

// //         const isBase = data.startDate === null && data.endDate === null && !data.minNights;
// //         setEditIsBasePrice(isBase);

// //         resetEdit({
// //             packageID: data.packageID ? { label: data.bookingEnginePackage, value: data.packageID } : null,
// //             extraGroupID: data.extraGroupID ? { label: data.extraGroupID, value: data.extraGroupID } : null,
// //             upsell: data.upsell ?? '',
// //             startDate: data.startDate || '',
// //             endDate: data.endDate || '',
// //             isOterraExclusive: data.isOterraExclusive ? true : false,
// //             minNights: data.minNights ?? '',
// //             isWeekEnd: data.isWeekEnd ? true : false,
// //             isBasePrice: isBase
// //         });

// //         setOpenModal(true);
// //     };

// //     const toggle = (id) => { open === id ? setOpen('') : setOpen(id); };

// //     // ── INSERT Submit ────────────────────────────────────────────────────────
// //     const onInsertSubmit = (formData) => {
// //         console.log('Insert Form Data:', formData);

// //         const payload = JSON.stringify({
// //             packageID: formData.packageID?.value || null,
// //             extraGroupID: formData.extraGroupID?.value || null,
// //             upsell: formData.upsell || 0,
// //             startDate: insertIsBasePrice ? null : (formData.startDate || null),
// //             endDate: insertIsBasePrice ? null : (formData.endDate || null),
// //             isOterraExclusive: formData.isOterraExclusive ? 1 : 0,
// //             minNights: insertIsBasePrice ? null : (formData.minNights || null),
// //             isWeekEnd: formData.isWeekEnd ? 1 : 0
// //         });

// //         console.log('Insert Payload:', payload);

// //         fetchx(API_URL + '/addBookingEnginePackage', {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: payload
// //         })
// //             .then(res => res.json())
// //             .then(res => {
// //                 if (res.statusCode === 200) {
// //                     handleSuccess('App Only Package Added Successfully!');
// //                     resetInsert({ packageID: null, extraGroupID: null, upsell: '', startDate: '', endDate: '', isOterraExclusive: false, minNights: '', isWeekEnd: false, isBasePrice: false });
// //                     setInsertIsBasePrice(false);
// //                     setOpen('');
// //                     fetchData();
// //                 } else {
// //                     handleError(res.message);
// //                 }
// //             })
// //             .catch(err => { console.error('Insert Error:', err); handleError('Something went wrong.'); });
// //     };

// //     // ── UPDATE Submit ────────────────────────────────────────────────────────
// //     const onEditSubmit = (formData) => {
// //         if (!selectedRow) return;
// //         console.log('Edit Form Data:', formData);

// //         const payload = JSON.stringify({
// //             id: selectedRow.id,
// //             packageID: formData.packageID?.value || null,
// //             extraGroupID: formData.extraGroupID?.value || null,
// //             upsell: formData.upsell || 0,
// //             startDate: editIsBasePrice ? null : (formData.startDate || null),
// //             endDate: editIsBasePrice ? null : (formData.endDate || null),
// //             isOterraExclusive: formData.isOterraExclusive ? 1 : 0,
// //             minNights: editIsBasePrice ? null : (formData.minNights || null),
// //             isWeekEnd: formData.isWeekEnd ? 1 : 0
// //         });

// //         console.log('Update Payload:', payload);

// //         fetchx(API_URL + '/updateBookingEnginePackage', {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: payload
// //         })
// //             .then(res => res.json())
// //             .then(res => {
// //                 if (res.statusCode === 200) {
// //                     handleSuccess('App Only Package Updated Successfully!');
// //                     setOpenModal(false);
// //                     fetchData();
// //                 } else {
// //                     handleError(res.message);
// //                 }
// //             })
// //             .catch(err => { console.error('Update Error:', err); handleError('Something went wrong.'); });
// //     };

// //     // ── Shared Form Fields renderer ──────────────────────────────────────────
// //     const renderFormFields = (control, isBasePrice, setIsBasePrice, setValue, prefix = 'insert') => (
// //         <Row>
// //             {/* Package */}
// //             <Col md="4" sm="12" className="mb-1">
// //                 <Label className="form-label">Package <span className="text-danger">*</span></Label>
// //                 <Controller
// //                     name="packageID"
// //                     control={control}
// //                     rules={{ required: true }}
// //                     render={({ field }) => (
// //                         <Select
// //                             isClearable
// //                             options={packageOptions}
// //                             classNamePrefix="select"
// //                             theme={selectThemeColors}
// //                             className="react-select"
// //                             placeholder="Select Package"
// //                             {...field}
// //                         />
// //                     )}
// //                 />
// //             </Col>

// //             {/* Extra Group */}
// //             <Col md="4" sm="12" className="mb-1">
// //                 <Label className="form-label">Extra Group</Label>
// //                 <Controller
// //                     name="extraGroupID"
// //                     control={control}
// //                     render={({ field }) => (
// //                         <Select
// //                             isClearable
// //                             options={extraGroupOptions}
// //                             classNamePrefix="select"
// //                             theme={selectThemeColors}
// //                             className="react-select"
// //                             placeholder="Select Extra Group"
// //                             {...field}
// //                         />
// //                     )}
// //                 />
// //             </Col>

// //             {/* Upsell */}
// //             <Col md="4" sm="12" className="mb-1">
// //                 <Label className="form-label">Upsell</Label>
// //                 <Controller
// //                     name="upsell"
// //                     control={control}
// //                     defaultValue=""
// //                     render={({ field }) => (
// //                         <Input type="number" min={0} placeholder="Enter upsell amount" className="form-control" {...field} />
// //                     )}
// //                 />
// //             </Col>

// //             {/* Base Price Checkbox */}
// //             <Col md="12" sm="12" className="mb-1">
// //                 <div className="form-check">
// //                     <Input
// //                         type="checkbox"
// //                         id={`${prefix}-isBasePrice`}
// //                         className="form-check-input"
// //                         checked={isBasePrice}
// //                         onChange={(e) => {
// //                             setIsBasePrice(e.target.checked);
// //                             if (e.target.checked) {
// //                                 setValue('startDate', '');
// //                                 setValue('endDate', '');
// //                                 setValue('minNights', '');
// //                             }
// //                         }}
// //                     />
// //                     <Label className="form-check-label" for={`${prefix}-isBasePrice`}>
// //                         <b>Base Price</b> &nbsp;
// //                         <small className="text-muted">(disables Start Date, End Date & Min Nights)</small>
// //                     </Label>
// //                 </div>
// //             </Col>

// //             {/* Start Date */}
// //             <Col md="4" sm="12" className="mb-1">
// //                 <Label className="form-label">Start Date</Label>
// //                 <Controller
// //                     name="startDate"
// //                     control={control}
// //                     render={({ field }) => (
// //                         <Flatpickr
// //                             className={`form-control${isBasePrice ? ' bg-light' : ''}`}
// //                             disabled={isBasePrice}
// //                             placeholder="Select Start Date"
// //                             options={{ dateFormat: 'Y-m-d' }}
// //                             value={field.value || ''}
// //                             onChange={(date, dateStr) => field.onChange(dateStr)}
// //                             style={{ color: '#7e7b89', WebkitTextFillColor: '#7e7b89', opacity: 1 }}
// //                         />
// //                     )}
// //                 />
// //             </Col>

// //             {/* End Date */}
// //             <Col md="4" sm="12" className="mb-1">
// //                 <Label className="form-label">End Date</Label>
// //                 <Controller
// //                     name="endDate"
// //                     control={control}
// //                     render={({ field }) => (
// //                         <Flatpickr
// //                             className={`form-control${isBasePrice ? ' bg-light' : ''}`}
// //                             disabled={isBasePrice}
// //                             placeholder="Select End Date"
// //                             options={{ dateFormat: 'Y-m-d' }}
// //                             value={field.value || ''}
// //                             onChange={(date, dateStr) => field.onChange(dateStr)}
// //                             style={{ color: '#7e7b89', WebkitTextFillColor: '#7e7b89', opacity: 1 }}
// //                         />
// //                     )}
// //                 />
// //             </Col>

// //             {/* Min Nights */}
// //             <Col md="4" sm="12" className="mb-1">
// //                 <Label className="form-label">Min Nights</Label>
// //                 <Controller
// //                     name="minNights"
// //                     control={control}
// //                     defaultValue=""
// //                     render={({ field }) => (
// //                         <Input
// //                             type="number"
// //                             min={0}
// //                             placeholder="Enter min nights"
// //                             className={`form-control${isBasePrice ? ' bg-light' : ''}`}
// //                             disabled={isBasePrice}
// //                             {...field}
// //                         />
// //                     )}
// //                 />
// //             </Col>

// //             {/* isOterraExclusive */}
// //             <Col md="4" sm="12" className="mb-1">
// //                 <div className="form-check mt-2">
// //                     <Controller
// //                         name="isOterraExclusive"
// //                         control={control}
// //                         render={({ field }) => (
// //                             <Input
// //                                 type="checkbox"
// //                                 id={`${prefix}-isOterraExclusive`}
// //                                 className="form-check-input"
// //                                 checked={!!field.value}
// //                                 onChange={(e) => field.onChange(e.target.checked)}
// //                             />
// //                         )}
// //                     />
// //                     <Label className="form-check-label" for={`${prefix}-isOterraExclusive`}>
// //                         isOterra Exclusive
// //                     </Label>
// //                 </div>
// //             </Col>

// //             {/* isWeekEnd */}
// //             <Col md="4" sm="12" className="mb-1">
// //                 <div className="form-check mt-2">
// //                     <Controller
// //                         name="isWeekEnd"
// //                         control={control}
// //                         render={({ field }) => (
// //                             <Input
// //                                 type="checkbox"
// //                                 id={`${prefix}-isWeekEnd`}
// //                                 className="form-check-input"
// //                                 checked={!!field.value}
// //                                 onChange={(e) => field.onChange(e.target.checked)}
// //                             />
// //                         )}
// //                     />
// //                     <Label className="form-check-label" for={`${prefix}-isWeekEnd`}>
// //                         Is Weekend
// //                     </Label>
// //                 </div>
// //             </Col>
// //         </Row>
// //     );

// //     // ── Render ───────────────────────────────────────────────────────────────
// //     return (
// //         <div>
// //             {/* ── INSERT Accordion ── */}
// //             <Accordion open={open} toggle={toggle}>
// //                 <AccordionItem>
// //                     <AccordionHeader targetId="1">
// //                         <h4 className="mb-0 me-2"><b>App Only Package</b></h4>
// //                         <Button color="primary" style={{ width: 160 }}>Add New</Button>
// //                     </AccordionHeader>

// //                     <AccordionBody accordionId="1">
// //                         <Card>
// //                             <CardHeader>
// //                                 <CardTitle tag="h4">Add App Only Package</CardTitle>
// //                             </CardHeader>
// //                             <CardBody>
// //                                 <Form onSubmit={handleInsertSubmit(onInsertSubmit)}>
// //                                     {renderFormFields(insertControl, insertIsBasePrice, setInsertIsBasePrice, setInsertValue, 'insert')}
// //                                     <div className="d-flex mt-1">
// //                                         <Button className="me-1" color="primary" type="submit">Submit</Button>
// //                                         <Button outline color="secondary" type="button"
// //                                             onClick={() => {
// //                                                 resetInsert({ packageID: null, extraGroupID: null, upsell: '', startDate: '', endDate: '', isOterraExclusive: false, minNights: '', isWeekEnd: false, isBasePrice: false });
// //                                                 setInsertIsBasePrice(false);
// //                                             }}>
// //                                             Reset
// //                                         </Button>
// //                                     </div>
// //                                 </Form>
// //                             </CardBody>
// //                         </Card>
// //                     </AccordionBody>
// //                 </AccordionItem>
// //             </Accordion>

// //             {/* ── EDIT Modal ── */}
// //             <Modal isOpen={openModal} toggle={() => setOpenModal(!openModal)} className="modal-lg">
// //                 <ModalHeader toggle={() => setOpenModal(!openModal)}>
// //                     Edit App Only Package
// //                 </ModalHeader>
// //                 <ModalBody className="pb-3 px-sm-3">
// //                     <Form onSubmit={handleEditSubmit(onEditSubmit)}>
// //                         {renderFormFields(editControl, editIsBasePrice, setEditIsBasePrice, setEditValue, 'edit')}
// //                         <div className="d-flex mt-1">
// //                             <Button className="me-1" color="primary" type="submit">Submit</Button>
// //                             <Button outline color="secondary" type="button"
// //                                 onClick={() => {
// //                                     if (selectedRow) openEditModal(selectedRow); // reset to original
// //                                 }}>
// //                                 Reset
// //                             </Button>
// //                             <Button outline color="danger" className="ms-1" type="button"
// //                                 onClick={() => setOpenModal(false)}>
// //                                 Cancel
// //                             </Button>
// //                         </div>
// //                     </Form>
// //                 </ModalBody>
// //             </Modal>

// //             <br />

// //             {/* ── AG Grid ── */}
// //             <div className="ag-theme-alpine" style={{ height: 520 }}>
// //                 <AgGridReact
// //                     ref={gridRef}
// //                     rowData={rowData}
// //                     columnDefs={columnDefs}
// //                     animateRows={true}
// //                     rowSelection="multiple"
// //                     onCellClicked={cellClickedListener}
// //                     paginationPageSize="10"
// //                     pagination="true"
// //                     defaultColDef={defaultColDef}
// //                     headerColor="ddw-primary"
// //                     masterDetail={true}
// //                     onGridReady={(params) => { gridRef.current = params.api; }}
// //                 />
// //             </div>
// //         </div>
// //     );
// // };

// // export default BookingEnginePackage;

// // Import ag-grid
// import 'ag-grid-enterprise'
// import { AgGridReact } from 'ag-grid-react'
// import '/node_modules/ag-grid-community/styles/ag-grid.css'
// import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
// import {
//     Card, CardHeader, CardTitle, Label, Col, Input, Row, Button,
//     Accordion, AccordionBody, AccordionHeader, AccordionItem,
//     CardBody, Form, Modal, ModalBody, ModalHeader
// } from 'reactstrap';
// import API_URL from '../../../config';
// import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
// const MySwal = withReactContent(Swal)

// import Flatpickr from "react-flatpickr";
// import "@styles/react/libs/flatpickr/flatpickr.scss";
// import "@styles/react/libs/react-select/_react-select.scss";
// import "@styles/react/pages/page-form-validation.scss";
// import { selectThemeColors } from "@utils";
// import { format } from "date-fns";



// const BookingEnginePackage = () => {

//     const [rowData, setRowData] = useState([]);
//     const [open, setOpen] = useState('');
//     const [openModal, setOpenModal] = useState(false);
//     const [selectedRow, setSelectedRow] = useState(null);

//     // dropdown options
//     const [packageOptions, setPackageOptions] = useState([]);
//     const [extraGroupOptions, setExtraGroupOptions] = useState([]);

//     // base price flags
//     const [insertIsBasePrice, setInsertIsBasePrice] = useState(false);
//     const [editIsBasePrice, setEditIsBasePrice] = useState(false);

//     const gridRef = useRef();

//      useEffect(() => {
//         const hotelIDData = JSON.stringify({
//           hotelID: 1
//         })
//         fetchx(API_URL + "/getBusinessDate", {
//           method: "POST",
//           headers: { 'Content-Type': 'application/json' },
//           body: hotelIDData
//         }).then((res) => res.json())
//           .then(postres => {
//             const today = new Date(postres['data'][0]['businessDate']);
//             const tomorrow = new Date(today);
//             tomorrow.setDate(today.getDate() + 1);
//             setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
//           })
//       }, []);
//     // ── Forms ────────────────────────────────────────────────────────────────
//     const {
//         handleSubmit: handleInsertSubmit,
//         control: insertControl,
//         reset: resetInsert,
//         watch: watchInsert,
//         setValue: setInsertValue
//     } = useForm({ defaultValues: { isBasePrice: false } });

//     const {
//         handleSubmit: handleEditSubmit,
//         control: editControl,
//         reset: resetEdit,
//         watch: watchEdit,
//         setValue: setEditValue
//     } = useForm({ defaultValues: { isBasePrice: false } });

//     // ── Alerts ───────────────────────────────────────────────────────────────
//     const handleError = (message) => MySwal.fire({
//         title: 'Error!', text: message, icon: 'error',
//         customClass: { confirmButton: 'btn btn-danger' },
//         allowOutsideClick: false, confirmButtonText: 'Close', buttonsStyling: false
//     });

//     const handleSuccess = (text = 'Operation completed successfully!') => MySwal.fire({
//         title: 'Success!', text, icon: 'success',
//         customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: false
//     });

//     // ── Default Col Def ──────────────────────────────────────────────────────
//     const defaultColDef = useMemo(() => ({
//         sortable: true, filter: true, wrapText: true, autoHeight: true,
//         filterParams: { buttons: ['apply', 'reset'] }
//     }), []);

//     // ── Fetch Dropdowns ──────────────────────────────────────────────────────
//     const fetchDropdowns = () => {
//         // fetch package options
//         fetchx(API_URL + '/getPackageCode', {
//             method: 'GET', headers: { 'Content-Type': 'application/json' }
//         })
//             .then(res => res.json())
//             .then(resp => {
//                 const opts = (resp.data || []).map(item => ({ label: item.label, value: item.value }));
//                 setPackageOptions(opts);
//             })
//             .catch(err => console.error('Failed to load packages:', err));

//         // fetch extra group options
//         fetchx(API_URL + '/getGroupExtra', {
//             method: 'GET', headers: { 'Content-Type': 'application/json' }
//         })
//             .then(res => res.json())
//             .then(resp => {
//                 const opts = (resp.data || []).map(item => ({ label: item.extraGroupName, value: item.id }));
//                 setExtraGroupOptions(opts);
//             })
//             .catch(err => console.error('Failed to load extra groups:', err));
//     };

//     // ── Fetch Grid Data ──────────────────────────────────────────────────────
//     const fetchData = () => {
//         fetchx(API_URL + '/getBookingEnginePackage', {
//             method: 'GET', headers: { 'Content-Type': 'application/json' }
//         })
//             .then(res => res.json())
//             .then(resp => setRowData(resp.data || []))
//             .catch(err => console.error('Failed to fetch grid data:', err));
//     };

//     useEffect(() => {
//         fetchDropdowns();
//         fetchData();
//     }, []);

//     // ── Column Definitions ───────────────────────────────────────────────────
//     const [columnDefs] = useState([
//         // { headerName: 'ID', field: 'id', maxWidth: 80, cellStyle: { textAlign: 'center' } },
//         // { headerName: 'Hotel ID', field: 'hotelID', maxWidth: 100, cellStyle: { textAlign: 'center' } },
//         { headerName: 'Package', field: 'bookingEnginePackage', minWidth: 150 },
//         { headerName: 'Package', field: 'packageCode', maxWidth: 110, cellStyle: { textAlign: 'center' } },
//         { headerName: 'Extra Group', field: 'extraGroupName', maxWidth: 130, cellStyle: { textAlign: 'center' } },
//         { headerName: 'Upsell', field: 'upsell', maxWidth: 100, cellStyle: { textAlign: 'center' } },
//         { headerName: 'Start Date', field: 'startDate', maxWidth: 130, cellStyle: { textAlign: 'center' },  cellRenderer: (params) => {
//                 if (params.data && params.data.startDate) {
//                   const formattedDate = format(new Date(params.data.startDate), 'dd MMM yy');
//                   return formattedDate;
//                 } else {
//                   return "";
//                 }
//               } },
//         { headerName: 'End Date', field: 'endDate', maxWidth: 130, cellStyle: { textAlign: 'center' }, cellRenderer: (params) => {
//                 if (params.data && params.data.endDate) {
//                   const formattedDate = format(new Date(params.data.endDate), 'dd MMM yy');
//                   return formattedDate;
//                 } else {
//                   return "";
//                 }
//               } },
//         {
//             headerName: 'Is Oterra Exclusive', field: 'isOterraExclusive', maxWidth: 180,
//             cellStyle: { textAlign: 'center' },
//             cellRendererFramework: (params) => (params.value ? 'Yes' : 'No')
//         },
//         { headerName: 'Min Nights', field: 'minNights', maxWidth: 140, cellStyle: { textAlign: 'center' } },
//         {
//             headerName: 'Is Weekend', field: 'isWeekEnd', maxWidth: 140,
//             cellStyle: { textAlign: 'center' },
//             cellRendererFramework: (params) => (params.value ? 'Yes' : 'No')
//         },
//         {
//             headerName: 'Actions',
//             cellRendererFramework: (params) => (
//                 <Button color="primary" style={{ width: 100 }}
//                     onClick={() => openEditModal(params.data)}>
//                     Edit
//                 </Button>
//             ),  
//             suppressSizeToFit: true,
//             cellStyle: { textAlign: 'center' },
//             cellClass: 'vertical-center',
//             maxWidth: 140
//         }
//     ]);

//     // ── Cell Click listener ──────────────────────────────────────────────────
//     const cellClickedListener = useCallback((params) => {
//         if (!params.data) return;
//         openEditModal(params.data);
//     }, []);

//     const openEditModal = (data) => {
//         console.log('Edit Row:', data);
//         setSelectedRow(data);

//         const isBase = data.startDate === null && data.endDate === null && !data.minNights;
//         setEditIsBasePrice(isBase);

//         resetEdit({
//             bookingEnginePackage: data.bookingEnginePackage || '',
//             packageID: data.packageID ? { label: data.packageCode, value: data.packageID } : null,
//             extraGroupID: data.extraGroupID ? { label: data.extraGroupName, value: data.extraGroupID } : null,
//             upsell: data.upsell ?? '',
//             startDate: data.startDate || '',
//             endDate: data.endDate || '',
//             isOterraExclusive: data.isOterraExclusive ? true : false,
//             minNights: data.minNights ?? '',
//             isWeekEnd: data.isWeekEnd ? true : false,
//             isBasePrice: isBase
//         });

//         setOpenModal(true);
//     };

//     const toggle = (id) => { open === id ? setOpen('') : setOpen(id); };

//     // ── INSERT Submit ────────────────────────────────────────────────────────
//     const onInsertSubmit = (formData) => {
//         console.log('Insert Form Data:', formData);

//         const payload = JSON.stringify({
//             bookingEnginePackage: formData.bookingEnginePackage || '',
//             packageID: formData.packageID?.value || null,
//             extraGroupID: formData.extraGroupID?.value || null,
//             upsell: formData.upsell || 0,
//             startDate: insertIsBasePrice ? null : (formData.startDate || null),
//             endDate: insertIsBasePrice ? null : (formData.endDate || null),
//             isOterraExclusive: formData.isOterraExclusive ? 1 : 0,
//             minNights: insertIsBasePrice ? 0 : (formData.minNights || 0),
//             isWeekEnd: formData.isWeekEnd ? 1 : 0
//         });

//         console.log('Insert Payload:', payload);

//         fetchx(API_URL + '/addBookingEnginePackage', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: payload
//         })
//             .then(res => res.json())
//             .then(res => {
//                 if (res.statusCode === 200) {
//                     handleSuccess('Booking Engine Package Added Successfully!');
//                     resetInsert({ bookingEnginePackage: '', packageID: null, extraGroupID: null, upsell: '', startDate: '', endDate: '', isOterraExclusive: false, minNights: '', isWeekEnd: false, isBasePrice: false });
//                     setInsertIsBasePrice(false);
//                     setOpen('');
//                     fetchData();
//                 } else {
//                     handleError(res.message);
//                 }
//             })
//             .catch(err => { console.error('Insert Error:', err); handleError('Something went wrong.'); });
//     };

//     // ── UPDATE Submit ────────────────────────────────────────────────────────
//     const onEditSubmit = (formData) => {
//         if (!selectedRow) return;
//         console.log('Edit Form Data:', formData);

//         const payload = JSON.stringify({
//             id: selectedRow.id,
//             bookingEnginePackage: formData.bookingEnginePackage || '',
//             packageID: formData.packageID?.value || null,
//             extraGroupID: formData.extraGroupID?.value || null,
//             upsell: formData.upsell || 0,
//             startDate: editIsBasePrice ? null : (formData.startDate || null),
//             endDate: editIsBasePrice ? null : (formData.endDate || null),
//             isOterraExclusive: formData.isOterraExclusive ? 1 : 0,
//             minNights: editIsBasePrice ? 0 : (formData.minNights || 0),
//             isWeekEnd: formData.isWeekEnd ? 1 : 0
//         });

//         console.log('Update Payload:', payload);

//         fetchx(API_URL + '/updateBookingEnginePackage', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: payload
//         })
//             .then(res => res.json())
//             .then(res => {
//                 if (res.statusCode === 200) {
//                     handleSuccess('Booking Engine Package Updated Successfully!');
//                     setOpenModal(false);
//                     fetchData();
//                 } else {
//                     handleError(res.message);
//                 }
//             })
//             .catch(err => { console.error('Update Error:', err); handleError('Something went wrong.'); });
//     };

//     // ── Shared Form Fields renderer ──────────────────────────────────────────
//     const renderFormFields = (control, isBasePrice, setIsBasePrice, setValue, prefix = 'insert') => (
//         <Row>
//             {/* Package Name - text input */}
//             <Col md="4" sm="12" className="mb-1">
//                 <Label className="form-label">Package Name <span className="text-danger">*</span></Label>
//                 <Controller
//                     name="bookingEnginePackage"
//                     control={control}
//                     defaultValue=""
//                     rules={{ required: true }}
//                     render={({ field }) => (
//                         <Input
//                             type="text"
//                             placeholder="Enter package name"
//                             className="form-control"
//                             {...field}
//                         />
//                     )}
//                 />
//             </Col>

//             {/* Package ID - dropdown */}
//             <Col md="4" sm="12" className="mb-1">
//                 <Label className="form-label">Package ID <span className="text-danger">*</span></Label>
//                 <Controller
//                     name="packageID"
//                     control={control}
//                     rules={{ required: true }}
//                     render={({ field }) => (
//                         <Select
//                             isClearable
//                             options={packageOptions}
//                             classNamePrefix="select"
//                             theme={selectThemeColors}
//                             className="react-select"
//                             placeholder="Select Package ID"
//                             {...field}
//                         />
//                     )}
//                 />
//             </Col>

//             {/* Extra Group */}
//             <Col md="4" sm="12" className="mb-1">
//                 <Label className="form-label">Extra Group</Label>
//                 <Controller
//                     name="extraGroupID"
//                     control={control}
//                     render={({ field }) => (
//                         <Select
//                             isClearable
//                             options={extraGroupOptions}
//                             classNamePrefix="select"
//                             theme={selectThemeColors}
//                             className="react-select"
//                             placeholder="Select Extra Group"
//                             {...field}
//                         />
//                     )}
//                 />
//             </Col>

//             {/* Upsell */}
//             <Col md="4" sm="12" className="mb-1">
//                 <Label className="form-label">Upsell</Label>
//                 <Controller
//                     name="upsell"
//                     control={control}
//                     defaultValue=""
//                     render={({ field }) => (
//                         <Input type="number" min={0} placeholder="Enter upsell amount" className="form-control" {...field} />
//                     )}
//                 />
//             </Col>


//             {/* Base Price Checkbox */}
//             <Col md="4" sm="12" className="mb-1">
//                 <div className="form-check">
//                     <Input
//                         type="checkbox"
//                         id={`${prefix}-isBasePrice`}
//                         className="form-check-input"
//                         checked={isBasePrice}
//                         onChange={(e) => {
//                             setIsBasePrice(e.target.checked);
//                             if (e.target.checked) {
//                                 setValue('startDate', '');
//                                 setValue('endDate', '');
//                                 setValue('minNights', '');
//                             }
//                         }}
//                     />
//                     <Label className="form-check-label" for={`${prefix}-isBasePrice`}>
//                         <b>Base Price</b> &nbsp;
//                         <small className="text-muted">(disables Start Date, End Date & Min Nights)</small>
//                     </Label>
//                 </div>
//             </Col>

//             {/* Start Date */}
//             <Col md="4" sm="12" className="mb-1">
//                 <Label className="form-label">Start Date</Label>
//                 <Controller
//                     name="startDate"
//                     control={control}
//                     render={({ field }) => (
//                         <Flatpickr
//                             className={`form-control${isBasePrice ? ' bg-light' : ''}`}
//                             disabled={isBasePrice}
//                             placeholder="Select Start Date"
//                             options={{ dateFormat: 'Y-m-d' }}
//                             value={field.value || ''}
//                             onChange={(date, dateStr) => field.onChange(dateStr)}
//                             style={{ color: '#918e9b', WebkitTextFillColor: '#918e9b', opacity: 1 }}
//                         />
//                     )}
//                 />
//             </Col>

//             {/* End Date */}
//             <Col md="4" sm="12" className="mb-1">
//                 <Label className="form-label">End Date</Label>
//                 <Controller
//                     name="endDate"
//                     control={control}
//                     render={({ field }) => (
//                         <Flatpickr
//                             className={`form-control${isBasePrice ? ' bg-light' : ''}`}
//                             disabled={isBasePrice}
//                             placeholder="Select End Date"
//                             options={{ dateFormat: 'Y-m-d' }}
//                             value={field.value || ''}
//                             onChange={(date, dateStr) => field.onChange(dateStr)}
//                             style={{ color: '#918e9b', WebkitTextFillColor: '#918e9b', opacity: 1 }}
//                         />
//                     )}
//                 />
//             </Col>

//             {/* Min Nights */}
//             <Col md="4" sm="12" className="mb-1">
//                 <Label className="form-label">Min Nights</Label>
//                 <Controller
//                     name="minNights"
//                     control={control}
//                     defaultValue=""
//                     render={({ field }) => (
//                         <Input
//                             type="number"
//                             min={0}
//                             placeholder="Enter min nights"
//                             className={`form-control${isBasePrice ? ' bg-light' : ''}`}
//                             disabled={isBasePrice}
//                             {...field}
//                         />
//                     )}
//                 />
//             </Col>

//             {/* isOterraExclusive */}
//             <Col md="4" sm="12" className="mb-1">
//                 <div className="form-check mt-2">
//                     <Controller
//                         name="isOterraExclusive"
//                         control={control}
//                         render={({ field }) => (
//                             <Input
//                                 type="checkbox"
//                                 id={`${prefix}-isOterraExclusive`}
//                                 className="form-check-input"
//                                 checked={!!field.value}
//                                 onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                         )}
//                     />
//                     <Label className="form-check-label" for={`${prefix}-isOterraExclusive`}>
//                         isOterra Exclusive
//                     </Label>
//                 </div>
//             </Col>

//             {/* isWeekEnd */}
//             <Col md="4" sm="12" className="mb-1">
//                 <div className="form-check mt-2">
//                     <Controller
//                         name="isWeekEnd"
//                         control={control}
//                         render={({ field }) => (
//                             <Input
//                                 type="checkbox"
//                                 id={`${prefix}-isWeekEnd`}
//                                 className="form-check-input"
//                                 checked={!!field.value}
//                                 onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                         )}
//                     />
//                     <Label className="form-check-label" for={`${prefix}-isWeekEnd`}>
//                         Is Weekend
//                     </Label>
//                 </div>
//             </Col>
//         </Row>
//     );

//     // ── Render ───────────────────────────────────────────────────────────────
//     return (
//         <div>
//             {/* ── INSERT Accordion ── */}
//             <Accordion open={open} toggle={toggle}>
//                 <AccordionItem>
//                     <AccordionHeader targetId="1">
//                         <h4 className="mb-0 me-2"><b>Booking Engine Package</b></h4>
//                         <Button color="primary" style={{ width: 160 }}>Add New</Button>
//                     </AccordionHeader>

//                     <AccordionBody accordionId="1">
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle tag="h4">Add Booking Engine Package</CardTitle>
//                             </CardHeader>
//                             <CardBody>
//                                 <Form onSubmit={handleInsertSubmit(onInsertSubmit)}>
//                                     {renderFormFields(insertControl, insertIsBasePrice, setInsertIsBasePrice, setInsertValue, 'insert')}
//                                     <div className="d-flex mt-1">
//                                         <Button className="me-1" color="primary" type="submit">Submit</Button>
//                                         <Button outline color="secondary" type="button"
//                                             onClick={() => {
//                                                 resetInsert({ bookingEnginePackage: '', packageID: null, extraGroupID: null, upsell: '', startDate: '', endDate: '', isOterraExclusive: false, minNights: '', isWeekEnd: false, isBasePrice: false });
//                                                 setInsertIsBasePrice(false);
//                                             }}>
//                                             Reset
//                                         </Button>
//                                     </div>
//                                 </Form>
//                             </CardBody>
//                         </Card>
//                     </AccordionBody>
//                 </AccordionItem>
//             </Accordion>

//             {/* ── EDIT Modal ── */}
//             <Modal isOpen={openModal} toggle={() => setOpenModal(!openModal)} className="modal-lg">
//                 <ModalHeader toggle={() => setOpenModal(!openModal)}>
//                     Edit Booking Engine Package
//                 </ModalHeader>
//                 <ModalBody className="pb-3 px-sm-3">
//                     <Form onSubmit={handleEditSubmit(onEditSubmit)}>
//                         {renderFormFields(editControl, editIsBasePrice, setEditIsBasePrice, setEditValue, 'edit')}
//                         <div className="d-flex mt-1">
//                             <Button className="me-1" color="primary" type="submit">Submit</Button>
//                             {/* <Button outline color="secondary" type="button"
//                                 onClick={() => {
//                                     if (selectedRow) openEditModal(selectedRow); // reset to original
//                                 }}>
//                                 Reset
//                             </Button> */}
//                             <Button outline color="danger" className="ms-1" type="button"
//                                 onClick={() => setOpenModal(false)}>
//                                 Cancel
//                             </Button>
//                         </div>
//                     </Form>
//                 </ModalBody>
//             </Modal>

//             <br />

//             {/* ── AG Grid ── */}
//             <div className="ag-theme-alpine" style={{ height: 520 }}>
//                 <AgGridReact
//                     ref={gridRef}
//                     rowData={rowData}
//                     columnDefs={columnDefs}
//                     animateRows={true}
//                     rowSelection="multiple"
//                     onCellClicked={cellClickedListener}
//                     paginationPageSize="10"
//                     pagination="true"
//                     defaultColDef={defaultColDef}
//                     headerColor="ddw-primary"
//                     masterDetail={true}
//                     onGridReady={(params) => { gridRef.current = params.api; }}
//                 />
//             </div>
//         </div>
//     );
// };

// export default BookingEnginePackage;

import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
    Card, CardHeader, CardTitle, Label, Col, Input, Row, Button,
    Accordion, AccordionBody, AccordionHeader, AccordionItem,
    CardBody, Form, Modal, ModalBody, ModalHeader
} from 'reactstrap';
import API_URL from '../../../config';
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import { selectThemeColors } from "@utils";
import { format } from "date-fns";
import Moment from 'moment';


const BookingEnginePackage = () => {

    const [rowData, setRowData] = useState([]);
    const [open, setOpen] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // dropdown options
    const [packageOptions, setPackageOptions] = useState([]);
    const [extraGroupOptions, setExtraGroupOptions] = useState([]);

    // base price flags
    const [insertIsBasePrice, setInsertIsBasePrice] = useState(false);
    const [editIsBasePrice, setEditIsBasePrice] = useState(false);
    const [today, setToday] = useState('');

    const gridRef = useRef();
    // Fetch business date to use as minDate for start date
    useEffect(() => {
        const hotelIDData = JSON.stringify({ hotelID: 1 });
        fetchx(API_URL + '/getBusinessDate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: hotelIDData
        })
            .then(res => res.json())
            .then(postres => {
                setToday(Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD'));
            })
            .catch(err => console.error('Failed to fetch business date:', err));
    }, []);



    // ── Forms ────────────────────────────────────────────────────────────────
    const {
        handleSubmit: handleInsertSubmit,
        control: insertControl,
        reset: resetInsert,
        watch: watchInsert,
        setValue: setInsertValue
    } = useForm({ defaultValues: { isBasePrice: false } });

    const {
        handleSubmit: handleEditSubmit,
        control: editControl,
        reset: resetEdit,
        watch: watchEdit,
        setValue: setEditValue
    } = useForm({ defaultValues: { isBasePrice: false } });

    // ── Alerts ───────────────────────────────────────────────────────────────
    const handleError = (message) => MySwal.fire({
        title: 'Error!', text: message, icon: 'error',
        customClass: { confirmButton: 'btn btn-danger' },
        allowOutsideClick: false, confirmButtonText: 'Close', buttonsStyling: false
    });

    const handleSuccess = (text = 'Operation completed successfully!') => MySwal.fire({
        title: 'Success!', text, icon: 'success',
        customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: false
    });

    // ── Default Col Def ──────────────────────────────────────────────────────
    const defaultColDef = useMemo(() => ({
        sortable: true, filter: true, wrapText: true, autoHeight: true,
        filterParams: { buttons: ['apply', 'reset'] }
    }), []);

    // ── Fetch Dropdowns ──────────────────────────────────────────────────────
    const fetchDropdowns = () => {
        // fetch package options
        fetchx(API_URL + '/getPackageCode', {
            method: 'GET', headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(resp => {
                const opts = (resp.data || []).map(item => ({ label: item.label, value: item.value }));
                setPackageOptions(opts);
            })
            .catch(err => console.error('Failed to load packages:', err));

        // fetch extra group options
        fetchx(API_URL + '/getGroupExtra', {
            method: 'GET', headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(resp => {
                const opts = (resp.data || []).map(item => ({ label: item.extraGroupName, value: item.id }));
                setExtraGroupOptions(opts);
            })
            .catch(err => console.error('Failed to load extra groups:', err));
    };

    // ── Fetch Grid Data ──────────────────────────────────────────────────────
    const fetchData = () => {
        fetchx(API_URL + '/getBookingEnginePackage', {
            method: 'GET', headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(resp => setRowData(resp.data || []))
            .catch(err => console.error('Failed to fetch grid data:', err));
    };

    useEffect(() => {
        fetchDropdowns();
        fetchData();
    }, []);

    // ── Column Definitions ───────────────────────────────────────────────────
    const [columnDefs] = useState([
        // { headerName: 'ID', field: 'id', maxWidth: 80, cellStyle: { textAlign: 'center' } },
        // { headerName: 'Hotel ID', field: 'hotelID', maxWidth: 100, cellStyle: { textAlign: 'center' } },
        { headerName: 'Package', field: 'bookingEnginePackage', minWidth: 150 },
        { headerName: 'Package', field: 'packageCode', maxWidth: 110, cellStyle: { textAlign: 'center' } },
        { headerName: 'Extra Group', field: 'extraGroupName', maxWidth: 130, cellStyle: { textAlign: 'center' } },
        { headerName: 'Upsell', field: 'upsell', maxWidth: 100, cellStyle: { textAlign: 'center' } },
        { headerName: 'Start Date', field: 'startDate', maxWidth: 130, cellStyle: { textAlign: 'center' },  cellRenderer: (params) => {
                if (params.data && params.data.startDate) {
                  const formattedDate = format(new Date(params.data.startDate), 'dd MMM yy');
                  return formattedDate;
                } else {
                  return "";
                }
              } },
        { headerName: 'End Date', field: 'endDate', maxWidth: 130, cellStyle: { textAlign: 'center' }, cellRenderer: (params) => {
                if (params.data && params.data.endDate) {
                  const formattedDate = format(new Date(params.data.endDate), 'dd MMM yy');
                  return formattedDate;
                } else {
                  return "";
                }
              } },
        {
            headerName: 'Is Oterra Exclusive', field: 'isOterraExclusive', maxWidth: 180,
            cellStyle: { textAlign: 'center' },
            cellRendererFramework: (params) => (params.value ? 'Yes' : 'No')
        },
        { headerName: 'Min Nights', field: 'minNights', maxWidth: 140, cellStyle: { textAlign: 'center' } },
        {
            headerName: 'Is Weekend', field: 'isWeekEnd', maxWidth: 140,
            cellStyle: { textAlign: 'center' },
            cellRendererFramework: (params) => (params.value ? 'Yes' : 'No')
        },
        {
            headerName: 'Actions',
            cellRendererFramework: (params) => (
                <Button color="primary" style={{ width: 100 }}
                    onClick={() => openEditModal(params.data)}>
                    Edit
                </Button>
            ),  
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            maxWidth: 140
        }
    ]);

    // ── Cell Click listener ──────────────────────────────────────────────────
    const cellClickedListener = useCallback((params) => {
        if (!params.data) return;
        openEditModal(params.data);
    }, []);

    const openEditModal = (data) => {
        console.log('Edit Row:', data);
        setSelectedRow(data);

        const isBase = data.startDate === null && data.endDate === null && !data.minNights;
        setEditIsBasePrice(isBase);

        resetEdit({
            bookingEnginePackage: data.bookingEnginePackage || '',
            packageID: data.packageID ? { label: data.packageCode, value: data.packageID } : null,
            extraGroupID: data.extraGroupID ? { label: data.extraGroupName, value: data.extraGroupID } : null,
            upsell: data.upsell ?? '',
            startDate: data.startDate || '',
            endDate: data.endDate || '',
            isOterraExclusive: data.isOterraExclusive ? true : false,
            minNights: data.minNights ?? '',
            isWeekEnd: data.isWeekEnd ? true : false,
            isBasePrice: isBase
        });

        setOpenModal(true);
    };

    const toggle = (id) => { open === id ? setOpen('') : setOpen(id); };

    // ── INSERT Submit ────────────────────────────────────────────────────────
    const onInsertSubmit = (formData) => {
        console.log('Insert Form Data:', formData);

        const payload = JSON.stringify({
            bookingEnginePackage: formData.bookingEnginePackage || '',
            packageID: formData.packageID?.value || null,
            extraGroupID: formData.extraGroupID?.value || null,
            upsell: formData.upsell || 0,
            startDate: insertIsBasePrice ? null : (formData.startDate || null),
            endDate: insertIsBasePrice ? null : (formData.endDate || null),
            isOterraExclusive: formData.isOterraExclusive ? 1 : 0,
            minNights: insertIsBasePrice ? 0 : (formData.minNights || 0),
            isWeekEnd: formData.isWeekEnd ? 1 : 0
        });

        console.log('Insert Payload:', payload);

        fetchx(API_URL + '/addBookingEnginePackage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload
        })
            .then(res => res.json())
            .then(res => {
                if (res.statusCode === 200) {
                    handleSuccess('Booking Engine Package Added Successfully!');
                    resetInsert({ bookingEnginePackage: '', packageID: null, extraGroupID: null, upsell: '', startDate: '', endDate: '', isOterraExclusive: false, minNights: '', isWeekEnd: false, isBasePrice: false });
                    setInsertIsBasePrice(false);
                    setOpen('');
                    fetchData();
                } else {
                    handleError(res.message);
                }
            })
            .catch(err => { console.error('Insert Error:', err); handleError('Something went wrong.'); });
    };

    // ── UPDATE Submit ────────────────────────────────────────────────────────
    const onEditSubmit = (formData) => {
        if (!selectedRow) return;
        console.log('Edit Form Data:', formData);

        const payload = JSON.stringify({
            id: selectedRow.id,
            bookingEnginePackage: formData.bookingEnginePackage || '',
            packageID: formData.packageID?.value || null,
            extraGroupID: formData.extraGroupID?.value || null,
            upsell: formData.upsell || 0,
            startDate: editIsBasePrice ? null : (formData.startDate || null),
            endDate: editIsBasePrice ? null : (formData.endDate || null),
            isOterraExclusive: formData.isOterraExclusive ? 1 : 0,
            minNights: editIsBasePrice ? 0 : (formData.minNights || 0),
            isWeekEnd: formData.isWeekEnd ? 1 : 0
        });

        console.log('Update Payload:', payload);

        fetchx(API_URL + '/updateBookingEnginePackage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload
        })
            .then(res => res.json())
            .then(res => {
                if (res.statusCode === 200) {
                    handleSuccess('Booking Engine Package Updated Successfully!');
                    setOpenModal(false);
                    fetchData();
                } else {
                    handleError(res.message);
                }
            })
            .catch(err => { console.error('Update Error:', err); handleError('Something went wrong.'); });
    };

    // ── Shared Form Fields renderer ──────────────────────────────────────────
    const renderFormFields = (control, isBasePrice, setIsBasePrice, setValue, prefix = 'insert', watchedStartDate = '') => (
        <Row>
            {/* Package Name - text input */}
            <Col md="4" sm="12" className="mb-1">
                <Label className="form-label">Package Name <span className="text-danger">*</span></Label>
                <Controller
                    name="bookingEnginePackage"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input
                            type="text"
                            placeholder="Enter package name"
                            className="form-control"
                            {...field}
                        />
                    )}
                />
            </Col>

            {/* Package ID - dropdown */}
            <Col md="4" sm="12" className="mb-1">
                <Label className="form-label">Package ID <span className="text-danger">*</span></Label>
                <Controller
                    name="packageID"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select
                            isClearable
                            options={packageOptions}
                            classNamePrefix="select"
                            theme={selectThemeColors}
                            className="react-select"
                            placeholder="Select Package ID"
                            {...field}
                        />
                    )}
                />
            </Col>

            {/* Extra Group */}
            <Col md="4" sm="12" className="mb-1">
                <Label className="form-label">Extra Group</Label>
                <Controller
                    name="extraGroupID"
                    control={control}
                    render={({ field }) => (
                        <Select
                            isClearable
                            options={extraGroupOptions}
                            classNamePrefix="select"
                            theme={selectThemeColors}
                            className="react-select"
                            placeholder="Select Extra Group"
                            {...field}
                        />
                    )}
                />
            </Col>

            {/* Upsell */}
            <Col md="4" sm="12" className="mb-1">
                <Label className="form-label">Upsell</Label>
                <Controller
                    name="upsell"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <Input type="number" min={0} placeholder="Enter upsell amount" className="form-control" {...field} />
                    )}
                />
            </Col>


          

            {/* Start Date */}
            <Col md="4" sm="12" className="mb-1">
                <Label className="form-label">Start Date</Label>
                <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                        <Flatpickr
                            className={`form-control${isBasePrice ? ' bg-light' : ''}`}
                            disabled={isBasePrice}
                            placeholder="Select Start Date"
                            options={{ dateFormat: 'Y-m-d', minDate: today || 'today' }}
                            value={field.value || ''}
                           // onChange={(date, dateStr) => field.onChange(dateStr)}
                            onChange={(date, dateStr) => { field.onChange(dateStr); setValue('endDate', ''); }}
                            style={{ color: '#918e9b', WebkitTextFillColor: '#918e9b', opacity: 1 }}
                        />
                    )}
                />
            </Col>

            {/* End Date */}
            <Col md="4" sm="12" className="mb-1">
                <Label className="form-label">End Date</Label>
                <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                        <Flatpickr
                            className={`form-control${isBasePrice ? ' bg-light' : ''}`}
                            disabled={isBasePrice}
                            placeholder="Select End Date"
                            options={{ dateFormat: 'Y-m-d', minDate: watchedStartDate || today || 'today' }}
                            value={field.value || ''}
                            onChange={(date, dateStr) => field.onChange(dateStr)}
                            style={{ color: '#918e9b', WebkitTextFillColor: '#918e9b', opacity: 1 }}
                        />
                    )}
                />
            </Col>
  {/* Base Price Checkbox */}
            <Col md="12" sm="12" className="mb-1">
                <div className="form-check">
                    <Input
                        type="checkbox"
                        id={`${prefix}-isBasePrice`}
                        className="form-check-input"
                        checked={isBasePrice}
                        onChange={(e) => {
                            setIsBasePrice(e.target.checked);
                            if (e.target.checked) {
                                setValue('startDate', '');
                                setValue('endDate', '');
                                setValue('minNights', '');
                            }
                        }}
                    />
                    <Label className="form-check-label" for={`${prefix}-isBasePrice`}>
                        <b>Base Price</b> &nbsp;
                        <small className="text-muted">(disables Start Date, End Date & Min Nights)</small>
                    </Label>
                </div>
            </Col>
            {/* Min Nights */}
            <Col md="4" sm="12" className="mb-1">
                <Label className="form-label">Min Nights</Label>
                <Controller
                    name="minNights"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <Input
                            type="number"
                            min={0}
                            placeholder="Enter min nights"
                            className={`form-control${isBasePrice ? ' bg-light' : ''}`}
                            disabled={isBasePrice}
                            {...field}
                        />
                    )}
                />
            </Col>

            {/* isOterraExclusive */}
            <Col md="4" sm="12" className="mb-1">
                <div className="form-check mt-2">
                    <Controller
                        name="isOterraExclusive"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="checkbox"
                                id={`${prefix}-isOterraExclusive`}
                                className="form-check-input"
                                checked={!!field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        )}
                    />
                    <Label className="form-check-label" for={`${prefix}-isOterraExclusive`}>
                        isOterra Exclusive
                    </Label>
                </div>
            </Col>

            {/* isWeekEnd */}
            <Col md="4" sm="12" className="mb-1">
                <div className="form-check mt-2">
                    <Controller
                        name="isWeekEnd"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="checkbox"
                                id={`${prefix}-isWeekEnd`}
                                className="form-check-input"
                                checked={!!field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        )}
                    />
                    <Label className="form-check-label" for={`${prefix}-isWeekEnd`}>
                        Is Weekend
                    </Label>
                </div>
            </Col>
        </Row>
    );

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div>
            {/* ── INSERT Accordion ── */}
            <Accordion open={open} toggle={toggle}>
                <AccordionItem>
                    <AccordionHeader targetId="1">
                        <h4 className="mb-0 me-2"><b>Booking Engine Package</b></h4>
                        <Button color="primary" style={{ width: 160 }}>Add New</Button>
                    </AccordionHeader>

                    <AccordionBody accordionId="1">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Add Booking Engine Package</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleInsertSubmit(onInsertSubmit)}>
                                    {renderFormFields(insertControl, insertIsBasePrice, setInsertIsBasePrice, setInsertValue, 'insert', watchInsert('startDate'))}
                                    <div className="d-flex mt-1">
                                        <Button className="me-1" color="primary" type="submit">Submit</Button>
                                        <Button outline color="secondary" type="button"
                                            onClick={() => {
                                                resetInsert({ bookingEnginePackage: '', packageID: null, extraGroupID: null, upsell: '', startDate: '', endDate: '', isOterraExclusive: false, minNights: '', isWeekEnd: false, isBasePrice: false });
                                                setInsertIsBasePrice(false);
                                            }}>
                                            Reset
                                        </Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </AccordionBody>
                </AccordionItem>
            </Accordion>

            {/* ── EDIT Modal ── */}
            <Modal isOpen={openModal} toggle={() => setOpenModal(!openModal)} className="modal-lg">
                <ModalHeader toggle={() => setOpenModal(!openModal)}>
                    Edit Booking Engine Package
                </ModalHeader>
                <ModalBody className="pb-3 px-sm-3">
                    <Form onSubmit={handleEditSubmit(onEditSubmit)}>
                        {renderFormFields(editControl, editIsBasePrice, setEditIsBasePrice, setEditValue, 'edit', watchEdit('startDate'))}
                        <div className="d-flex mt-1">
                            <Button className="me-1" color="primary" type="submit">Submit</Button>
                            {/* <Button outline color="secondary" type="button"
                                onClick={() => {
                                    if (selectedRow) openEditModal(selectedRow); // reset to original
                                }}>
                                Reset
                            </Button> */}
                            <Button outline color="danger" className="ms-1" type="button"
                                onClick={() => setOpenModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>

            <br />

            {/* ── AG Grid ── */}
            <div className="ag-theme-alpine" style={{ height: 520 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    animateRows={true}
                    rowSelection="multiple"
                    onCellClicked={cellClickedListener}
                    paginationPageSize="10"
                    pagination="true"
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"
                    masterDetail={true}
                    onGridReady={(params) => { gridRef.current = params.api; }}
                />
            </div>
        </div>
    );
};

export default BookingEnginePackage;

