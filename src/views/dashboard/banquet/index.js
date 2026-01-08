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
import OpenUpdateModal from './updateBanquet'
// ** Custom Components
import { DateTime } from 'luxon';



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
import { event } from "jquery";
import CompanyProfile from '../reservation/companyProfile/index'


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





const RoomInventory = () => {

    const [open, setOpen] = useState('')
    const [Today, setToday] = useState()
    const [companyModal, setCompanyModal] = useState(false)
    const [company, setCompany] = useState();
    const [companyProfile, setCompanyProfile] = useState(false)
    const [selectedCompany, setSelectedCompany] = useState();
    const [selectedCompanyID, setSelectedCompanyID] = useState();
    const [reload, setReload] = useState(true);

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
                if (postres.statusCode === 200) {
                    const today = new Date(postres['data'][0]['businessDate']);
                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);
                    setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
                }
            })
    }, []);

    const toggle = id => {
        open === id ? setOpen() : setOpen(id)
    }


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


    const handleCompanyClear = () => {
        setSelectedCompany(null);
        setSelectedCompanyID(null);
        setReload(!reload); // Toggle the reload state to trigger a re-render

    };

    const onFilterTextBoxChanged12 = useCallback(() => {
        gridRef3.current.api.setQuickFilter(
            document.getElementById('filter-text').value
        )
    }, [])


    function toggleModalCompany() {
        fetchx(API_URL + `/getCompanyNames?hotelID=1`)
            .then(result => result.json())
            .then(rowData => {
                setCompany(rowData['data'])
                // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
            })


        setCompanyProfile(false)
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
    const [rowData, setRowData] = useState();
    const [refresh, setRefresh] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [filldata, setfilldata] = useState();
    const [companyID, setCompanyID] = useState([]);


    const gridRef = useRef();


    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            autoHeight: true,
            wrapText: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ));

    const cellClickedListener = useCallback(event => {
        console.log('cellClicked', event);
        setfilldata(event.data)

    }, []);



    const formatToIST = (dateString) => {
        if (dateString) {
            // Convert the date string to a DateTime object in the UTC time zone
            const date = DateTime.fromISO(dateString, { zone: 'utc' });
            // Set the time zone to 'Asia/Kolkata' (IST) and format the date
            const istDate = date.setZone('Asia/Kolkata');
            console.log(istDate)
            return istDate.toFormat('dd-MM-yyyy HH:mm:ss');
        }
        return 'No date available';
    };


    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "Guest",
            field: "guestName",
            suppressSizeToFit: true,
            maxWidth: 160,
        },
        {
            headerName: "Company",
            field: "accountName",
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
            maxWidth: 130,
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
            maxWidth: 125,
        },
        {
            headerName: "Total Cost",
            field: "totalCost",
            suppressSizeToFit: true,
            maxWidth: 130,
        },
        {
            cellRendererFramework: (params) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Button
                        color="primary"
                        style={{ width: 128 }}
                        onClick={() => {
                            setOpenUpdate(params.data);
                        }}
                    >
                        Update
                    </Button>
                </div>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center', // A


            // cellRendererFramework: (params) => <Button color='primary' onClick={() => {setOpenGuestHistory(params.data),console.log(params)}}> Guest History </Button>,




        },

        {
            cellRendererFramework: (params) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Button
                        color="primary"
                        style={{ width: 128 }}
                        onClick={() => {
                            setOpenCancel(params.data);
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center', // A






        },
        {
            headerName: "Created At",
            field: "createdAt",
            suppressSizeToFit: true,
            maxWidth: 134,
            valueFormatter: params => { console.log(params), formatToIST(params.value) },

        },
        {
            headerName: "Created By",
            field: "userName",
            suppressSizeToFit: true,
            maxWidth: 130,
        },


    ]);



    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = customStyles;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);




    // CSS for vertical centering
    const customStyles = `
.vertical-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
`;



    const [price, setPrice] = useState();
    const [basePriceID, setBasePriceID] = useState();
    const [inventory_date, setDate] = useState();
    const [InvRoomTypeID, setRoomTypeID] = useState();



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
            })
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
    const [companyIDSelected, setCompanyIDSelected] = useState(null);
    const [dateSelected, setDateSelected] = useState(null);


    // ** Hooks
    const { reset, handleSubmit, control, watch, formState: { errors }
    } = useForm({ defaultValues });




    const handleChange = (selectedOption) => {

        // console.log(selectedOption.value)
        // setCompanyIDSelected(selectedOption.value)

        if (selectedOption == null) {
            setCompanyIDSelected(null)

        }
        else {
            setCompanyIDSelected(selectedOption.value)

        }
    };


    const handleChangeDate = (selectedOption) => {

        console.log(selectedOption)
        setDateSelected(selectedOption)
    };


    const onSubmit = (data) => {
        console.log(data)
        setData(data);
        console.log(data)

        console.log(dateSelected)
        if (dateSelected === null) {
            handleError("Please fill the event date");
            return
        }

        let createasset = JSON.stringify({
            noOfPeople: data.noPpl,
            guestName: data.guestName,
            // companyName: data.companyName,
            // companyName: companyIDSelected,
            companyName: selectedCompanyID,
            // eventDate: (Moment(String(new Date(data.eventDate))).format('YYYY-MM-DD')),
            eventDate: dateSelected !== null ? format(new Date(dateSelected), 'yyyy-MM-dd') : null,

            eventName: data.eventName,
            totalCost: data.totalCost,
        });
        console.log(createasset)
        let res = fetchx(API_URL + "/createBanquetBooking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: createasset,
        }).then((res) => {
            console.log(res);
            if (res['status'] == 200) {
                setSelectedCompanyID()
                console.log(res)
                let unAssign = JSON.stringify({
                    hotelID: 1
                });

                fetchx(API_URL + "/getBanquetBookingList", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: unAssign,
                })
                    .then(result => result.json())
                    .then(rowData => {
                        console.log(rowData.data)
                        if (rowData.statusCode === 200) {

                            setRowData(rowData['data'])
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
                handleReset()
                setOpen('')

                handleSuccess("Banquet Booking added successful!!")
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







    //// For Disabling Past Date
    // const today = Moment().format('YYYY-MM-DD');
    const options = {
        minDate: Today
    };



    const handleReset = () => {
        reset({
            noPpl: '',
            guestName: '',
            companyID: null,
            eventDate: null || '',
            eventName: '',
            totalCost: ''
        });
    };



    const handleSuccess = (message) => {
        return MySwal.fire({
            title: 'Banquet Booking Added!!',
            text: message,
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        })
    }

    const handleSuccessCancel = (message) => {
        return MySwal.fire({
            title: 'Banquet Booking Cancelled!!',
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





    const gridRef1 = useRef();
    const [rowData1, setRowData1] = useState();
    const [columnDefs1, setColumnDefs1] = useState([])



    useEffect(() => {
        let unAssign = JSON.stringify({
            hotelID: 1
        });

        fetchx(API_URL + "/getBanquetBookingList", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: unAssign,
        })
            .then(result => result.json())
            .then(rowData => {
                console.log(rowData.data)
                if (rowData.statusCode === 200) {

                    setRowData(rowData['data'])
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


    function confirmCancel() {
        let unAssign = JSON.stringify({
            rowID: openCancel.id
        });

        fetchx(API_URL + "/cancelBanquetBooking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: unAssign,
        })
            .then(result => result.json())
            .then(rowData => {
                console.log(rowData.data)
                if (rowData.statusCode === 200) {

                    let unAssign = JSON.stringify({
                        hotelID: 1
                    });

                    fetchx(API_URL + "/getBanquetBookingList", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: unAssign,
                    })
                        .then(result => result.json())
                        .then(rowData => {
                            console.log(rowData.data)
                            if (rowData.statusCode === 200) {

                                setRowData(rowData['data'])
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                        });
                    setOpenCancel(false)
                    handleSuccessCancel("Cancelled successfull!!")
                }
                else {
                    handleError(rowData.message)
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }


    const getRowStyle = params => {
        if (params.data && params.data.status === 'Cancelled') {
            return { background: '#3598db' };
        }

        return null;
    };


    function toggleModal() {
        setOpenUpdate(false)
        let unAssign = JSON.stringify({
            hotelID: 1
        });

        fetchx(API_URL + "/getBanquetBookingList", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: unAssign,
        })
            .then(result => result.json())
            .then(rowData => {
                console.log(rowData.data)
                if (rowData.statusCode === 200) {

                    setRowData(rowData['data'])
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }



    return (
        <div>
            <Card>
                {/* <CardBody> */}


                <Accordion open={open} toggle={toggle}>
                    <AccordionItem>
                        <AccordionHeader targetId='1'><h4><b>Create Banquet Booking</b></h4></AccordionHeader>
                        <AccordionBody accordionId='1'>
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h4">Banquet Booking</CardTitle>
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
                                                                    'is-invalid': data !== null && (data.noPpl === null || !data.noPpl.length)
                                                                })}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md='4' sm='12' className='mb-1'>
                                                <div className='mb-1'>
                                                    <Label className='form-label' for='guestName'>
                                                        Guest Name<spam style={{ color: 'red' }}>*</spam>
                                                    </Label>
                                                    <Controller
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
                                                                classNamePrefix="select"
                                                                theme={selectThemeColors}

                                                                {...field}
                                                                onChange={handleChange}

                                                            />
                                                        )}
                                                    /> */}
                                                </div>
                                            </Col>


                                            <Col md='4' sm='12' className='mb-1'>
                                                <div className="mb-1">
                                                    <Label className="form-label" for="eventDate">
                                                        Event Date <spam style={{ color: 'red' }}>*</spam>
                                                    </Label>
                                                    <Controller
                                                        control={control}
                                                        id='eventDate'
                                                        name='eventDate'

                                                        render={({ field }) => (
                                                            <Flatpickr

                                                                required
                                                                options={options}
                                                                {...field}

                                                                placeholder="YYYY-MM-DD"
                                                                className={classnames('form-control', {
                                                                    // 'is-invalid': data !== null && data.eventDate === null
                                                                    // 'is-invalid': errors.eventDate

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
                                                            id="totalCost"
                                                            name="totalCost"
                                                            control={control}
                                                            placeholder="Total Amount"
                                                            render={({ field }) => (
                                                                <Input
                                                                    pattern="[0-9]*\.?[0-9]+"
                                                                    title="Only Numbers Allowed" required
                                                                    placeholder="Base Amount"
                                                                    {...field}
                                                                    className={classnames("form-control", {
                                                                        "is-invalid":
                                                                            data !== null && (data.totalCost === null || !data.totalCost.length)
                                                                    })}
                                                                />
                                                            )}
                                                        />
                                                    </InputGroup>
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
                {/* </CardBody> */}
            </Card>

            <div>
                <Modal
                    isOpen={openUpdate}
                    toggle={() => setOpenUpdate(!openUpdate)}
                    className="modal-xl"
                >
                    <ModalHeader
                        className="bg-transparent"
                        toggle={() => setOpenUpdate(!openUpdate)}
                    ></ModalHeader>
                    <ModalBody className="pb-3 px-sm-1 mx-20">
                        <div>
                            {openUpdate && <OpenUpdateModal data1={openUpdate} toggleModal={toggleModal} />}
                        </div>
                    </ModalBody>
                </Modal>
            </div>


            <div>
                <Modal
                    isOpen={openCancel}
                    toggle={() => setOpenCancel(!openCancel)}
                    className='modal-dialog-centered'                >
                    <ModalHeader
                        className="bg-transparent"
                        toggle={() => setOpenCancel(!openCancel)}
                    ></ModalHeader>
                    <ModalBody className='px-5 pb-2'>
                        <div className='text-center mb-2'>
                            <h1 className='mb-1'>Confirm with cancellation?</h1>
                            {/* <p>you want to submit this form ? </p> */}
                        </div>
                        <Col>
                            <div className="button-container text-center">
                                <Button className="me-1" color="primary" type="submit" onClick={() => confirmCancel()}>
                                    Confirm
                                </Button>
                                <Button className="me-1" color="danger" onClick={() => setOpenCancel(false)} >
                                    Cancel
                                </Button>
                            </div>
                        </Col>
                    </ModalBody>
                </Modal>
            </div>



            <Card>
                <CardHeader>
                    <CardTitle tag="h4">All Banquet Bookings</CardTitle>
                </CardHeader>
                <CardBody>


                    <div className="ag-theme-alpine" style={{ height: 520 }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowData} columnDefs={columnDefs}
                            animateRows={true} rowSelection='multiple'
                            onCellClicked={cellClickedListener}
                            getRowStyle={getRowStyle}

                            // paginationAutoPageSize = 'true'

                            paginationPageSize='10'
                            pagination='true'
                            defaultColDef={defaultColDef}
                            headerColor="ddw-primary"
                            onGridReady={onGridReady}
                        />
                    </div>
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