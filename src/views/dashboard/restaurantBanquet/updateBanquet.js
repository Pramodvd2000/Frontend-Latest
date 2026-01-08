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
import { format } from "date-fns";

// ** Custom Components


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
import CompanyProfile from '../../../views/dashboard/reservation/companyProfile/index'


const MySwal = withReactContent(Swal)

const activeoptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "InActive" },
];



const defaultValues = {
    noPpl: '',
    guestName: '',
    companyName: '',
    eventDate: null,
    eventName: '',
    totalCost: '',
};






const RoomInventory = ({ data1, toggleModal }) => {
    console.log(data1)
    const [open, setOpen] = useState('')
    const [Today, setToday] = useState()
    const [companyID, setCompanyID] = useState([]);

    const [companyIDSelected, setCompanyIDSelected] = useState(data1.companyName);

    const [companyModal, setCompanyModal] = useState(false)
    const [company, setCompany] = useState();
    const [companyProfile, setCompanyProfile] = useState(false)
    const [selectedCompany, setSelectedCompany] = useState(data1.accountName);
    const [selectedCompanyID, setSelectedCompanyID] = useState(data1.companyID);
    const [reload, setReload] = useState(true);
    const [storeOptions, setStoreOptions] = useState([]);



    const gridRef3 = useRef();





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


    useEffect(() => {
        fetchx(API_URL + "/getGuestProfileCompanyID?hotelID=10")
            .then((result) => result.json())
            .then((resp) => {
                setCompanyID(resp["data"]);
            });

        fetchx(API_URL + `/getCompanyNames?hotelID=1`)
            .then(result => result.json())
            .then(rowData => {
                setCompany(rowData['data'])
                // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
            })

        fetchx(API_URL + '/getStoreList?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                const responseData = resp['data'];

                // setStoreOptions(options);
                setStoreOptions(responseData);
            })



    }, [])


    const handleChange = (selectedOption) => {

        console.log(selectedOption)
        if (selectedOption == null) {
            setCompanyIDSelected(null)

        }
        else {
            setCompanyIDSelected(selectedOption.value)

        }
    };


    const toggle = id => {
        open === id ? setOpen() : setOpen(id)
    }

    function CustomCellRenderer(props) {
        const value = props.value;

        // Split the value into the "5000" and "(9)" parts
        const number = value.split("(")[0];
        const suffix = value.split("(")[1].replace(")", "");

        return (
            <div>
                <span style={{ color: 'red' }}>{number}</span>
                <span style={{ color: 'green' }}> ({suffix})</span>
            </div>
        );
    }
    // AG Grid
    const [refresh, setRefresh] = useState(false);

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
        console.log('cellClicked', event);

    }, []);


    const cellClickedListener1 = useCallback(event => {
        console.log('cellClicked', event);

    }, []);

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "Guest",
            field: "guestName",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
        {
            headerName: "Company",
            field: "companyName",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
        {
            headerName: "No. of people",
            field: "noOfPeople",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
        {
            headerName: "Event Date",
            field: "eventDate",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
        {
            headerName: "Event Name",
            field: "eventName",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
        {
            headerName: "Status",
            field: "status",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
        {
            headerName: "Total Cost",
            field: "totalCost",
            suppressSizeToFit: true,
            maxWidth: 140,
        },
        {
            cellRendererFramework: (params) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Button
                        color="primary"
                        style={{ width: 128 }}
                    //   onClick={() => {
                    //     setOptions(!options);
                    //   }}
                    >
                        Update
                    </Button>
                </div>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center', // A






        },

        {
            cellRendererFramework: (params) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Button
                        color="primary"
                        style={{ width: 128 }}
                    //   onClick={() => {
                    //     setOptions(!options);
                    //   }}
                    >
                        Cancel
                    </Button>
                </div>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center', // A






        },


    ]);



    const [columnDefsCompany] = useState([
        { headerName: 'Company Name', field: 'accountName', width: 300 },
        {
            headerName: "Action",
            maxWidth: 140,
            cellRenderer: (params) => {
                { console.log(params) }

                return (
                    <Button
                        color='primary'
                        onClick={() => onCompanySelect(params.data)}>
                        Select
                    </Button>
                )
            }
        },
        { headerName: 'Company Address', field: 'address', width: 300 },
        { headerName: 'Email ID', field: 'email', width: 300 },
        { headerName: 'Phone Number', field: 'phoneNumber', width: 200 },
        { headerName: 'GSTID', field: 'gstID', width: 300 },
    ])



    const defaultColDefCompany = useMemo(() => ({
        sortable: true,
        filter: true,
        filterParams: {
            buttons: ["apply", "reset"],
        },
    }));



    const onCompanySelect = (rowData) => {
        //console.log(rowData)
        setSelectedCompany(rowData.accountName);
        setSelectedCompanyID(rowData.companyid);
        setCompanyModal(false);
    };



    const onFilterTextBoxChanged12 = useCallback(() => {
        gridRef3.current.api.setQuickFilter(
            document.getElementById('filter-text').value
        )
    }, [])


    const handleCompanyClear = () => {
        setSelectedCompany(null);
        setSelectedCompanyID(null);
        setReload(!reload);
    };


    function toggleModalCompany() {
        fetchx(API_URL + `/getCompanyList?hotelID=1`)
            .then(result => result.json())
            .then(rowData => {
                setCompany(rowData['data'])
                // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
            })


        setCompanyProfile(false)
    }





    // error handling for same guest addition
    const handleError = (message,) => {
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






    // ** State
    const [data, setData] = useState(null);
    const [popUp, setPopUp] = useState(false);
    const [popUpForRemove, setPopUpForRemove] = useState(false);
    const [popUpForRemoveData, setPopUpForRemoveData] = useState();
    const [quickFilter, setQuickFilter] = useState('');
    // const [fromDateFilter, setFromDate] = useState(null);
    // const [toDateFilter, setToDate] = useState(null);
    const [fromDateFilter, setFromDateFilter] = useState(null);
    const [toDateFilter, setToDateFilter] = useState(null);
    const [dateSelected, setDateSelected] = useState(null);


    // ** Hooks
    // const { reset, handleSubmit, control, watch, formState: { errors }
    // } = useForm({ defaultValues });
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            noPpl: data1 ? data1.noOfPeople : '' // Initialize default values
        }
    });


    const defaultReason1 = {
        value: data1.companyName,
        label: data1.accountName,
    };

    const defaultReason2 = {
        value: data1.storeID,
        label: data1.restaurantName,
    };

    const [storeSelected, setStoreSelected] = useState(defaultReason2);



    const onSubmit = (data) => {
        setData(data);
        console.log(data)
        console.log(dateSelected)

        // if(dateSelected === null){
        //     handleError("Please fill the date!!");
        //     return
        // }
        let createasset = JSON.stringify({
            noOfPeople: data.noPpl,
            guestName: data.guestName,
            // companyName: companyIDSelected,
            companyName: selectedCompanyID,
            // eventDate: (Moment(String(new Date(data.eventDate))).format('YYYY-MM-DD')),
            eventDate: dateSelected === null ? (Moment(String(new Date(data1.eventDate))).format('YYYY-MM-DD')) : (Moment(String(new Date(dateSelected))).format('YYYY-MM-DD')),
            // eventDate: format(new Date(data.eventDate), 'yyyy-MM-dd'),

            eventName: data.eventName,
            totalCost: data.totalCost,
            rowID: data1.id,
            storeID: storeSelected.value
        });
        console.log(createasset)
        let res = fetchx(API_URL + "/updateRestaurantBanquetBooking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: createasset,
        }).then(data => data.json())
            .then((res) => {
                console.log(res);
                if (res['statusCode'] == 200) {
                    console.log(res)
                    toggleModal()
                    handleSuccess("Banquet Booking updated successful!!")
                }
                else {
                    handleError(res.message)
                }
            });



    };



    const [gridApi, setGridApi] = useState(null);
    const [dateFilters, setDateFilters] = useState({ fromDate: null, toDate: null });

    const onGridReady = (params) => {
        setGridApi(params.api);
    };


    const clearDateFilters = () => {
        setDateFilters({ fromDate: null, toDate: null });
        gridApi.setFilterModel(null);
    };


    const handleChangeDate = (selectedOption) => {

        console.log(selectedOption)
        setDateSelected(selectedOption)
    };

    

    const handleChangeStoreID = (selectedOption) => {

        console.log(selectedOption)
        setStoreSelected(selectedOption)
    };


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
            noPpl: '',
            guestName: '',
            companyName: '',
            eventDate: null,
            eventName: '',
            totalCost: '',
        });
    };



    const handleSuccess = (message) => {
        return MySwal.fire({
            title: 'Banquet Booking Modified!!',
            text: message,
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        })
    }


    const handleSuccess1 = (message) => {
        return MySwal.fire({
            title: 'Room inventory rates!!',
            text: message,
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        })
    }















    return (
        <div>

            <Card>
                <CardHeader>
                    <CardTitle tag="h4">Modify Restaurant Booking</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>

                            <Col md='4' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='noPpl'>
                                        No. of people <spam style={{ color: 'red' }}>*</spam>
                                    </Label>
                                    <Controller
                                        defaultValue={data1["noOfPeople"]}

                                        id='noPpl'
                                        name='noPpl'
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id='noPpl'

                                                {...field}
                                                pattern="[0-9]*" title="Only Numbers Allowed" required

                                                placeholder='No. of people'
                                                className={classnames('form-control', {
                                                    // 'is-invalid': data !== null && (data.noPpl === null || !data.noPpl.length)
                                                })}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                            <Col md='4' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='guestName'>
                                        Guest Name <spam style={{ color: 'red' }}>*</spam>
                                    </Label>
                                    <Controller
                                        defaultValue={data1["guestName"]}

                                        id='guestName'
                                        name='guestName'
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id='guestName'
                                                required
                                                {...field}
                                                placeholder='Reason Remarks'
                                                className={classnames('form-control', {
                                                    'is-invalid': data !== null && (data.guestName === null || !data.guestName.length)
                                                })}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>
                            {/* <Col md='4' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='companyName'>
                                        Company Name
                                    </Label>
                                    <Controller
                                        defaultValue={data1["companyName"]}

                                        id='companyName'
                                        name='companyName'
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id='companyName'
                                                // required
                                                {...field}
                                                placeholder='Reason Remarks'
                                                className={classnames('form-control', {
                                                    // 'is-invalid': data !== null && (data.companyName === null || !data.companyName.length)
                                                })}
                                            />
                                        )}
                                    />
                                </div>
                            </Col> */}

                            <Col md='4' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className="form-label" for="companyID">
                                        Company Name
                                    </Label>
                                    {/* <Controller
                                        id="companyID"
                                        control={control}
                                        name="companyID"
                                        render={({ field }) => (
                                            <Select
                                                // isMulti
                                                // required
                                                isClearable
                                                options={companyID}
                                                defaultValue={defaultReason1}

                                                classNamePrefix="select"
                                                theme={selectThemeColors}

                                                {...field}
                                                onChange={handleChange}

                                            />
                                        )}
                                    /> */}

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Input type="text" name='companyName' placeholder='Select Company'
                                            value={selectedCompany}
                                            onClick={() => setCompanyModal(!companyModal)}
                                            key={reload}
                                        />

                                        <span
                                            style={{
                                                color: 'red',
                                                cursor: 'pointer',
                                                border: 'none',
                                                background: 'none',
                                                padding: '0',
                                                fontSize: 'inherit',
                                                marginLeft: '5px',
                                            }}
                                            size="sm"
                                            onClick={handleCompanyClear}
                                        >
                                            X
                                        </span>


                                    </div>
                                </div>
                            </Col>

                            <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="eventDate">
                                        Event Date <spam style={{ color: 'red' }}>*</spam>
                                    </Label>
                                    <Controller
                                        defaultValue={data1["eventDate"]}

                                        control={control}
                                        id='eventDate'
                                        name='eventDate'
                                        rules={{ required: true }}

                                        render={({ field }) => (
                                            <Flatpickr
                                                {...field}

                                                required
                                                options={options}

                                                placeholder="YYYY-MM-DD"
                                                className={classnames('form-control', {
                                                    'is-invalid': data !== null && data.eventDate === null
                                                })}

                                                onChange={handleChangeDate}

                                            />
                                        )}
                                    />

                                </div>
                            </Col>



                            <Col md='4' sm='12' className='mb-1'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='eventName'>
                                        Event Name <spam style={{ color: 'red' }}>*</spam>
                                    </Label>
                                    <Controller
                                        defaultValue={data1["eventName"]}

                                        id='eventName'
                                        name='eventName'
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id='eventName'
                                                required
                                                {...field}
                                                placeholder='Reason Remarks'
                                                className={classnames('form-control', {
                                                    'is-invalid': data !== null && (data.eventName === null || !data.eventName.length)
                                                })}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>

                            <Col md='4' sm='12' className='mb-1'>
                                <div className="mb-1">
                                    <Label className="form-label" for="totalCost">
                                        Total Cost <spam style={{ color: 'red' }}>*</spam>
                                    </Label>
                                    <InputGroup className="input-group-merge">

                                        <Controller
                                            defaultValue={data1["totalCost"]}

                                            id="totalCost"
                                            name="totalCost"
                                            control={control}
                                            placeholder="Total Amount"
                                            render={({ field }) => (
                                                <Input
                                                    pattern="[0-9]*\.?[0-9]+"
                                                    title="Only Numbers Allowed" required
                                                    placeholder="Total Amount"
                                                    {...field}
                                                    className={classnames("form-control", {
                                                        // "is-invalid":
                                                        //     data !== null && (data.totalCost === null || !data.totalCost.length)
                                                    })}
                                                />
                                            )}
                                        />
                                    </InputGroup>
                                </div>
                            </Col>
                            <Col md='4' sm='12'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='storeID'>
                                    Restaurant Name <spam style={{ color: 'red' }}>*</spam>
                                    </Label>
                                    <Controller
                                        id="storeID"
                                        control={control}
                                        name="storeID"
                                        render={({ field }) => (
                                            <Select
                                                // isMulti
                                                required
                                                isClearable
                                                defaultValue={defaultReason2}

                                                options={storeOptions}
                                                classNamePrefix="select"
                                                theme={selectThemeColors}
                                                {...field}
                                                onChange={handleChangeStoreID}

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




            {
                companyModal &&
                <div>
                    <Modal isOpen={companyModal} toggle={() => setCompanyModal(!companyModal)} className='modal-lg'>
                        <ModalHeader toggle={() => setCompanyModal(!companyModal)}>Company Profile page</ModalHeader>
                        <ModalBody>
                            <div>
                                <Row className='mb-1'>
                                    <Col md='3' sm='12' className='me-1'>
                                        <Label className='form-label' for='fullName'>
                                            Search
                                        </Label>
                                        <Input
                                            type="text"
                                            id="filter-text"
                                            placeholder="Filter..."
                                            onInput={onFilterTextBoxChanged12}
                                        />
                                    </Col>
                                    <Col md='3' sm='12' className='me-1'>
                                        <br></br>
                                        <div align='end' >
                                            <Button color='primary' onClick={() => setCompanyProfile(true)}>Add Company</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="ag-theme-alpine" style={{ height: 520 }}>
                                <AgGridReact
                                    ref={gridRef3}
                                    rowData={company}
                                    columnDefs={columnDefsCompany}
                                    animateRows={true}
                                    onCellClicked={cellClickedListener}
                                    paginationPageSize='10'
                                    pagination='true'
                                    defaultColDef={defaultColDefCompany}
                                    headerColor="ddw-primary"
                                />
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            }





            <Modal isOpen={companyProfile} toggle={() => setCompanyProfile(!companyProfile)} className='modal-xl'>
                <ModalHeader toggle={() => setCompanyProfile(!companyProfile)}>Company Profile</ModalHeader>
                <ModalBody>
                    <CompanyProfile toggleModal={toggleModalCompany} />
                </ModalBody>
            </Modal>








            {/* <App/> */}
        </div>
    );
};

export default RoomInventory;