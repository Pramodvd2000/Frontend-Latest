import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Col, Row, Button, Card, CardBody, CardTitle, CardHeader, Modal, ModalBody, ModalHeader, ModalFooter, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, Input } from 'reactstrap'

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import "../../dashboard/testFrontDesk/frontDesk.scss";
import VisaDetails from './visaDetails'; //./../dashboard/testFrontDesk
import GuestProfile from './editGuestDetails'
import { format } from "date-fns";
import API_URL from '../../../config';
import CancelReservation from './cancelReservation';
import StayModification from '../../../views/dashboard/testFrontDesk/stayNotification'
// import ActionModal from './actionModal'
import { useNavigate } from 'react-router-dom'
import { AiOutlineCheckCircle } from 'react-icons/ai';
// import { ComponentResolver } from 'ag-grid/dist/lib/components/framework/componentResolver';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import Moment from 'moment';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import { param } from 'jquery'
import Select from 'react-select';



const TableWith8Columns = (data) => {

    // const finalData = data.data;
    // console.log(data.data)
    const [finalData, setFinalData] = useState()

    useEffect(() => {
        // if(Today!==undefined){
        let columnsToUpdate = JSON.stringify({
            date: data.data,
            hotelID: 1
        })
        // console.log(columnsToUpdate)
        fetchx(API_URL + '/getNightAuditCheck', {

            // fetchx("http://122.166.2.21:14702/getNightAuditCheck", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: columnsToUpdate
        }).then(result => result.json())
            .then(rowData2 => {
                setFinalData(rowData2.data[0])
                if (rowData2.statusCode === 200) {
                    console.log(rowData2)
                }

            })
        // }

    }, [data.data]);
    // Define the checkmark and cancelmark variables
    //   const checkmark = <span style={{ color: 'green', fontSize: '24px' }}>✔</span>;
    //   const cancelmark = <span style={{ color: 'red', fontSize: '24px' }}>❌</span>;
    const checkmark = <span style={{ color: 'green', fontSize: '24px' }}>✔</span>;
    const cancelmark = <span style={{ color: 'red', fontSize: '24px' }}>❌</span>;
    return (
        <table className="table">
            <thead>
                <tr>
                    <th><b>Process</b></th>
                    <th><b>Status</b></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><b>Reservation Status</b></td>
                    <td>{finalData !== undefined && finalData.reservationStatusCheck === '1' ? checkmark : cancelmark}</td>
                </tr>
                <tr>
                    <td><b>Rolling Date</b></td>
                    <td>{finalData !== undefined && finalData.rollingBusinessDate === '1' ? checkmark : cancelmark}</td>
                </tr>
                <tr>
                    <td><b>Night Audit</b></td>
                    <td>{finalData !== undefined && finalData.rollingBusinessDate === '1' ? checkmark : cancelmark}</td>
                </tr>
                <tr>
                    <td><b>Reports</b></td>
                    <td>{finalData !== undefined && finalData.printingReports === '1' ? checkmark : cancelmark}</td>
                </tr>

                {/* Add more rows as needed */}
            </tbody>
        </table>
    );
};






let countryOptions = [
    fetchx(API_URL + "/getGuestProfileCountry?hotelID=1")
        .then((result) => result.json())
        .then((resp) => {
            // console.log(resp['data'])
            countryOptions = resp["data"];
            // setOptions(response.data);

            // console.log(vipID)
        }),
];





localStorage.removeItem('reservationID')

const PillFilled = () => {
    const navigate = useNavigate()
    // const [active, setActive] = useState('1')
    const [active, setActive] = useState();

    // const [active, setActive] = useState('1')
    const [startNightAudit, setStartNightAudit] = useState(false)
    const [modalOpen, setModalOpen] = useState(false);
    const [showCard, setShowCard] = useState(false);

    const [Today, setToday] = useState()

    const [open, setOpen] = useState(false);
    const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);

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
        // sessionStorage.removeItem('NightAuditTab')

        // sessionStorage.setItem('NightAuditTab', active);
        if (active == '1') { }
        { active == '1' && setDisableCountry(false) }
        { active == '2' && setDisableArrival(false) }
        { active == '3' && setDisableDeparture(false) }
        { active == '4' && setDisableUnsettleBillData(false) }
        { active == '5' && setDisableRoomPosting(false) }
        { active == '6' && setDisableFixedPosting(false) }
        { active == '7' && setDisableRoomStatus(false) }
        { active == '8' && setDisableReservationStatus(false) }




        // sessionStorage.setItem('arrivalTab', arrivalTab);
    }, [active]);

    const toggle = tab => {
        setActive(tab)
    }

    const [popUp, setPopUp] = useState();




    const CustomDropdown = ({ rowData }) => {
        const [selectedOption, setSelectedOption] = useState('');

        const handleSuccess = (message) => {
            return MySwal.fire({
                title: 'Night Audit !!',
                text: message,
                icon: 'success',
                customClass: {
                    confirmButton: 'btn btn-primary'
                },
                buttonsStyling: false
            })
        }

        const handleOptionChange = (e) => {
            const selectedValue = e.target.value;
            setSelectedOption(selectedValue);
            updateGuestProfile(selectedValue);
        };

        const dropdownStyle = {
            padding: '8px 12px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            outline: 'none',
            backgroundColor: '#fff',
            color: '#333',
            transition: 'border-color 0.3s ease',
            width: '150px' // Adjust width as needed

        };

        const optionStyle = {
            backgroundColor: '#fff',
            color: '#333',
        };

        const hoverStyle = {
            borderColor: '#007bff',
        };

        const updateGuestProfile = (selectedValue) => {
            let getDailyDetails = JSON.stringify({
                nationality: selectedValue
            });

            fetchx(API_URL + "/updateguestprofile?id=" + rowData.id, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: getDailyDetails
            })
                .then(result => result.json())
                .then(rowData => {
                    if (rowData.statusCode === 200) {
                        handleSuccessNationality('Guest Nationality Added Successfully');

                        RefreshFunction();


                    }
                })
                .catch(error => {
                    console.error('Error updating guest profile:', error);
                    // Handle error here
                });
        };

        return (
            <select
                style={{ ...dropdownStyle, ...(countryOptions && hoverStyle) }}
                value={selectedOption}
                onChange={handleOptionChange}
            >
                <option style={optionStyle} value="" disabled={!selectedOption}>
                    {selectedOption ? 'Type to Search...' : 'Select Option'}
                </option>
                {countryOptions.map(option => (
                    <option key={option.value} style={optionStyle} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    };



    // Success modal
    const handleSuccess = (message) => {
        return MySwal.fire({
            title: 'Night Audit !!',
            text: message,
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        })
    }
    const handleSuccessNationality = (message) => {
        return MySwal.fire({
            title: 'Guest Nationality Added !!',
            text: message,
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        })
    }

    // error handling for same guest addition
    const handleError = (message) => {
        return MySwal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            allowOutsideClick: false,
            confirmButtonText: 'Close',
            confirmButtonColor: 'danger',
            buttonsStyling: false
        })
    }

    // For disable tab
    const [disableCountry, setDisableCountry] = useState(true);
    const [disableArrival, setDisableArrival] = useState(true);
    const [disableDeparture, setDisableDeparture] = useState(true);
    const [disableUnSettleBillData, setDisableUnsettleBillData] = useState(true);
    const [disableRoomPosting, setDisableRoomPosting] = useState(true);
    const [disableFixedPosting, setDisableFixedPosting] = useState(true);
    const [disableRoomStatus, setDisableRoomStatus] = useState(true);
    const [disableReports, setDisableReports] = useState(true);
    const [disableReservationStatus, setDisableReservationStatus] = useState(true);



    const [nightAuditData, setNightAuditData] = useState();
    const [getNightAudit, setGetNightAudit] = useState();



    useEffect(() => {
        if (Today !== undefined) {
            let columnsToUpdate = JSON.stringify({
                date: Today,
                hotelID: 1
            })
            console.log(columnsToUpdate)
            fetchx(API_URL + "/getNightAuditCheck", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: columnsToUpdate
            }).then(result => result.json())
                .then(rowData2 => {
                    console.log(rowData2.data)
                    if (rowData2.statusCode === 200) {
                        setGetNightAudit(rowData2.data[0])

                        if (rowData2 && rowData2.length !== 0 && rowData2.data.length !== 0 && rowData2.data[0].startedNightAudit === "1") {
                            setStartNightAudit(true)

                            setActive(active === undefined ? '4' : active)
                        }
                        console.log(rowData2.data.length)
                        if (rowData2.data.length !== 0) {
                            console.log(rowData2.data[0])
                            if (rowData2.data[0]['countryAndStateCheck'] === '0') {
                                setActive('1')
                                setDisableRoomPosting(true)
                                setDisableFixedPosting(true)
                                setDisableRoomStatus(true)
                                setDisableReports(true)
                                setDisableReservationStatus(true)
                            }
                            else if (rowData2.data[0]['arrivalsNotYetCheckedIn'] === '0') {
                                setActive('2')
                                setDisableRoomPosting(true)
                                setDisableFixedPosting(true)
                                setDisableRoomStatus(true)
                                setDisableReports(true)
                                setDisableReservationStatus(true)
                            }
                            else if (rowData2.data[0]['depaturesNotCheckedOut'] === '0') {
                                setActive('3')
                                setDisableRoomPosting(true)
                                setDisableFixedPosting(true)
                                setDisableRoomStatus(true)
                                setDisableReports(true)
                                setDisableReservationStatus(true)
                            }
                            else if (rowData2.data[0]['unSettleBills'] === '0') {
                                setActive('4')
                                setDisableRoomPosting(true)
                                setDisableFixedPosting(true)
                                setDisableRoomStatus(true)
                                setDisableReports(true)
                                setDisableReservationStatus(true)
                            }
                            else if (rowData2.data[0]['postingRoomAndTax'] === '0') {
                                setActive('5')
                                setDisableRoomPosting(false)
                                setDisableFixedPosting(true)
                                setDisableRoomStatus(true)
                                setDisableReports(true)
                                setDisableReservationStatus(true)

                            }
                            else if (rowData2.data[0]['fixedChargePostingCheck'] === '0') {
                                setActive('6')
                                setDisableFixedPosting(false)
                                setDisableRoomPosting(true)
                                setDisableRoomStatus(true)
                                setDisableReports(true)
                                setDisableReservationStatus(true)

                            }
                            else if (rowData2.data[0]['roomStatusCheck'] === '0') {
                                setActive('7')
                                setDisableRoomStatus(false)
                                setDisableRoomPosting(true)
                                setDisableFixedPosting(true)
                                setDisableReports(true)
                                setDisableReservationStatus(true)

                            }
                            else if (rowData2.data[0]['printingReports'] === '0') {
                                setActive('9')
                                setDisableReports(false)
                                setDisableRoomPosting(true)
                                setDisableFixedPosting(true)
                                setDisableRoomStatus(true)
                                setDisableReservationStatus(true)

                            }
                            // else if (rowData2.data[0]['rollingBusinessDate'] === '0') {
                            //     setActive('8')
                            // }
                        }
                        if (rowData2.data.length !== 0 && rowData2.data[0]['rollingBusinessDate'] === '1') {
                            // console.log(active)

                            // setActive('8')
                            setDisableCountry(true)
                            setDisableArrival(true)
                            setDisableDeparture(true)
                            setDisableRoomPosting(true)
                            setDisableFixedPosting(true)
                            setDisableRoomStatus(true)
                            setDisableReservationStatus(false)
                            handleError("Night Audit Already Completed !!")
                        }
                    }
                })

        }

    }, [Today !== undefined]);;



    function RefreshGetNightAuditFunction() {
        console.log('refresh done')
        let columnsToUpdate = JSON.stringify({
            date: Today,
            hotelID: 1
        })
        console.log(columnsToUpdate)
        fetchx(API_URL + "/getNightAuditCheck", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: columnsToUpdate
        }).then(result => result.json())
            .then(rowData2 => {
                // console.log(rowData2.data[0]['fixedChargePostingCheck'])
                // console.log(rowData2.data[0]['startedNightAudit'])
                // if(rowData2.data[0]['startedNightAudit'] === '1'){
                //     setStartNightAudit(true)
                //     setActive('1s')
                // }
                if (rowData2.statusCode === 200) {
                    setGetNightAudit(rowData2.data[0])

                    if (rowData2 && rowData2.length !== 0 && rowData2.data.length !== 0 && rowData2.data[0].startedNightAudit === "1") {
                        setStartNightAudit(true)

                        setActive(active === undefined ? '4' : active)
                    }
                    if (rowData2.length !== 0) {
                        console.log(rowData2.data[0])
                        if (rowData2.data[0]['countryAndStateCheck'] === '0') {
                            setActive('1')
                            setDisableRoomPosting(true)
                            setDisableFixedPosting(true)
                            setDisableRoomStatus(true)
                            setDisableReports(true)
                            setDisableReservationStatus(true)
                        }
                        else if (rowData2.data[0]['arrivalsNotYetCheckedIn'] === '0') {
                            setActive('2')
                            setDisableRoomPosting(true)
                            setDisableFixedPosting(true)
                            setDisableRoomStatus(true)
                            setDisableReports(true)
                            setDisableReservationStatus(true)
                        }
                        else if (rowData2.data[0]['depaturesNotCheckedOut'] === '0') {
                            setActive('3')
                            setDisableRoomPosting(true)
                            setDisableFixedPosting(true)
                            setDisableRoomStatus(true)
                            setDisableReports(true)
                            setDisableReservationStatus(true)
                        }
                        else if (rowData2.data[0]['unSettleBills'] === '0') {
                            setActive('4')
                            setDisableRoomPosting(true)
                            setDisableFixedPosting(true)
                            setDisableRoomStatus(true)
                            setDisableReports(true)
                            setDisableReservationStatus(true)
                        }
                        else if (rowData2.data[0]['postingRoomAndTax'] === '0') {
                            setActive('5')
                            setDisableRoomPosting(false)
                            setDisableFixedPosting(true)
                            setDisableRoomStatus(true)
                            setDisableReports(true)
                            setDisableReservationStatus(true)
                        }
                        else if (rowData2.data[0]['fixedChargePostingCheck'] === '0') {
                            setActive('6')
                            setDisableFixedPosting(false)
                            setDisableRoomPosting(true)
                            setDisableRoomStatus(true)
                            setDisableReports(true)
                            setDisableReservationStatus(true)
                        }
                        else if (rowData2.data[0]['roomStatusCheck'] === '0') {
                            setActive('7')
                            setDisableRoomStatus(false)
                            setDisableRoomPosting(true)
                            setDisableFixedPosting(true)
                            setDisableReports(true)
                            setDisableReservationStatus(true)
                        }
                        else if (rowData2.data[0]['printingReports'] === '0') {
                            setActive('9')
                            setDisableReports(false)
                            setDisableRoomPosting(true)
                            setDisableFixedPosting(true)
                            setDisableRoomStatus(true)
                            setDisableReservationStatus(true)
                        }
                        // else if (rowData2.data[0]['rollingBusinessDate'] === '0') {
                        //     setActive('8')
                        // }
                    }
                    if (rowData2.data.length !== 0 && rowData2.data[0]['rollingBusinessDate'] === '1') {
                        // console.log(active)

                        // setActive('8')
                        setDisableCountry(true)
                        setDisableArrival(true)
                        setDisableDeparture(true)
                        setDisableRoomPosting(true)
                        setDisableFixedPosting(true)
                        setDisableRoomStatus(true)
                        setDisableReservationStatus(false)
                        handleError("Night Audit Already Completed !!")
                    }
                }
            })

        // }

    }

    function CheckPendingSteps(step) {


        let unAssign = JSON.stringify({
            step: step
        });
        let res = fetchx(API_URL + "/nightAuditStepCheck", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: unAssign,
        }).then(result => result.json())
            .then(rowData => {
                //  console.log(rowData['data'].length)
                condition = true
                if (rowData['statusCode'] === 200) {
                    // setRoomPosting(rowData['data'])
                    return true
                }
                else if (rowData['statusCode'] === 403) {
                    RefreshGetNightAuditFunction()
                    handleError(rowData['message'])
                    return false;
                }
                return false;


            })

    }

    function UpdateEachStep(fieldName, fieldValue) {

        let columnsToUpdate = JSON.stringify({
            [fieldName]: fieldValue
        })
        fetchx(API_URL + "/updateNightAudit?date=" + Today, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: columnsToUpdate
        }).then(result => result.json())
            .then(rowData2 => {
                console.log(rowData2)
                if (rowData2.statusCode === 200) {
                    // setDisableRoomStatus(true)
                    // setDisableReservationStatus(false)
                    // setActive('8')
                    let columnsToUpdate = JSON.stringify({
                        date: Today,
                        hotelID: 1
                    })
                    console.log(columnsToUpdate)
                    fetchx(API_URL + "/getNightAuditCheck", {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: columnsToUpdate
                    }).then(result => result.json())
                        .then(rowData2 => {

                            if (rowData2.statusCode === 200) {
                                setGetNightAudit(rowData2.data[0])
                            }
                        })
                }
            })


    }


    // 1) For country check
    const [rowData, setRowData] = useState();
    const [checkCountry, setCheckCountry] = useState();
    const [visaDetails, setVisaDetails] = useState();
    const [guestData, setGuestData] = useState();
    const [guestProfile, setOpenGuestProfile] = useState();
    const [confirmNationality, confirmGuestNationality] = useState(false);
    const [OpenGuestProfileFullEdit, setOpenGuestProfileFullEdit] = useState();
    const [countryCheckSkip, setCountryCheckSkip] = useState();
    const [gridOptions, setGridOptions] = useState({
        // Other grid options...
        editable: true, // Make the grid editable
    });
    const gridRef = useRef();
    const gridRefCountry = useRef();

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Guest', cellRenderer: (params) => {
                const fullName = `${params.data.salutation} ${params.data.firstName} ${params.data.lastName}`;
                return <div>{fullName}</div>;
            }, maxWidth: 250
        },
        { headerName: 'Email', field: 'email', maxWidth: 250 },
        { headerName: 'Phone Number', field: 'phoneNumber', suppressSizeToFit: true, maxWidth: 140 },
        { headerName: 'Nationality', field: 'countryName', width: 140 },

        { headerName: 'Remarks', field: 'remarksStatus' },
        {
            headerName: 'Add Nationality',
            cellRendererFramework: (params) => <CustomDropdown rowData={params.data} />,
            width: 200,
        },
        // { headerName: 'Actions', cellRendererFramework: (params) => <Button color='primary' style={{ width: 150 }} onClick={() => setOpenGuestProfile(true)} >ADD Nationality</Button>, Width: 250 },
        { headerName: 'Actions', cellRendererFramework: (params) => <Button color='primary' style={{ width: 150 }} onClick={() => setOpenGuestProfileFullEdit(true)} >View Profile</Button>, Width: 250 },


    ]);


    // guest Profile nationality addition
    const [columnDefsCountry, setColumnDefsCountry] = useState([
        { headerName: 'Nationality', field: 'label', width: 140 },

        {
            headerName: 'Select',
            cellRendererFramework: (params) => {
                console.log(params); // Logging all params
                return (
                    <Button
                        color='primary'
                        style={{ width: 150 }}
                        onClick={() => confirmGuestNationality(params.data.value)} // Log params.value directly here
                    >
                        Select
                    </Button>
                );
            },
            width: 200
        }



    ]);
    // const [columnDefsCountry, setColumnDefsCountry] = useState([
    //     { headerName: 'Nationality', field: 'label', width: 140 },

    //     {
    //         headerName: 'Select',
    //         cellRendererFramework: (params) => {
    //             console.log(params); // Logging all params

    //             const handleConfirmNationality = () => {
    //                 if (params.data && params.data.value && guestData && guestData.id) {
    //                     let getDailyDetails = JSON.stringify({
    //                         nationality: params.data.value
    //                     });
    //                     fetchx(`${API_URL}/updateguestprofile?id=${guestData.id}`, {
    //                         method: "PUT",
    //                         headers: { 'Content-Type': 'application/json' },
    //                         body: getDailyDetails
    //                     }).then(result => result.json())
    //                         .then(rowData => {
    //                             console.log('added success');
    //                             handleSuccess('Guest Nationality Added Successfully');
    //                             RefreshFunction();
    //                             setOpenGuestProfile(false);
    //                             //    setTimeout(() => { navigate(''); }, 1000)
    //                         });
    //                 }
    //             };


    //             return (
    //                 <Button
    //                     color='primary'
    //                     style={{ width: 150 }}
    //                     onClick={handleConfirmNationality}
    //                 >
    //                     Select
    //                 </Button>
    //             );
    //         },
    //         width: 200
    //     }
    // ]);


    console.log(confirmNationality)

    // guest Profile nationality addition
    // useEffect(() => {
    //     if (confirmNationality !== false) {
    //         let getDailyDetails = JSON.stringify({
    //             nationality: confirmNationality
    //         })
    //         fetchx(API_URL + "/updateguestprofile?id=" + guestData.id, {
    //             method: "PUT",
    //             headers: { 'Content-Type': 'application/json' },
    //             body: getDailyDetails
    //         }).then(result => result.json())
    //             .then(rowData => {
    //                 console.log('added success')
    //                 handleSuccess('Guest Nationality Added Successfully')
    //                 RefreshFunction()
    //                 setOpenGuestProfile(false)
    //                 //    setTimeout(() => { navigate(''); }, 1000)

    //             })
    //     }
    // }, [confirmNationality !== false]);

    useEffect(() => {
        if (confirmNationality !== false && guestData && guestData.id) {
            let getDailyDetails = JSON.stringify({
                nationality: confirmNationality
            })
            fetchx(API_URL + "/updateguestprofile?id=" + guestData.id, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: getDailyDetails
            }).then(result => result.json())
                .then(rowData => {
                    if (rowData.statusCode === 200) {
                        console.log('added success')
                        handleSuccess('Guest Nationality Added Successfully')
                        RefreshFunction()
                        setOpenGuestProfile(false)
                        //    setTimeout(() => { navigate(''); }, 1000)
                        confirmGuestNationality(false)
                    }

                })
        }
    }, [confirmNationality, guestData]);


    const cellClickedListener = useCallback(event => {
        console.log('cellClicked', event);
        setGuestData(event['data'])
    }, []);
    const cellClickedCountry = useCallback(event => {
        console.log('cellClicked', event);
        // setGuestData(event['data'])
    }, []);

    const onFilterTextBoxChanged = useCallback(() => {
        gridRefCountry.current.api.setQuickFilter(
            document.getElementById('filter-text-box2').value
        );
    }, []);

    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            // autoHeight: true,
            // wrapText: true,
            filterParams: {
                buttons: ['apply', 'reset']
            },
        }
    ));


    useEffect(() => {
        if (active === '1') {
            let getDailyDetails = JSON.stringify({
                hotelID: 1
            })
            fetchx(API_URL + "/checkCountryNightAudit", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: getDailyDetails
            }).then(result => result.json())
                .then(rowData => {
                    setRowData(rowData['data'])
                    AddToNightAudit()
                    setDisableCountry(false)

                    if (rowData['data'].length === 0) {


                        // AddToNightAudit()
                        let getDailyDetails = JSON.stringify({
                            countryAndStateCheck: 1
                        })
                        fetchx(API_URL + "/updateNightAudit?date=" + Today, {
                            method: "PUT",
                            headers: { 'Content-Type': 'application/json' },
                            body: getDailyDetails
                        }).then(result => result.json())
                            .then(rowData2 => {
                                console.log(rowData2)
                                if (rowData.statusCode === 200) {
                                    // setActive('2')
                                    // setDisableCountry(true)
                                    // setDisableArrival(false)

                                }
                            })

                    }
                    else {
                        // setDisableCountry(false)
                    }
                })
        }
    }, [active == '1' && Today]);


    function AddToNightAudit() {
        let getDailyDetails = JSON.stringify({
            hotelID: 1,
            startedNightAudit: 1,
            CountryCheck: 0,
            arrivalPending: 0,
            departurePending: 0,
            roomStatusCheck: 0,
            rollingBusinessDate: 0,
            fixedChargePosting: 0,
            roomPosting: 0,
            printingReports: 0,
            reservationStatusCheck: 0,
            unSettleBills: 0
        })
        fetchx(API_URL + "/addToNightAudit", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: getDailyDetails
        }).then(result => result.json())
            .then(rowData => {
                console.log(rowData)
            })
    }


    // 2) For pending arrivals

    const [pendingArr, setPendingArr] = useState();
    const [pendingArrival, setPendingArrival] = useState();
    const [noShowWithCharge, setNoShowWithCharge] = useState();
    const [noShowWithOutCharge, setNoShowWithOutCharge] = useState();
    const [filldata, setfilldata] = useState();
    const [rollOver, setRollOver] = useState();
    const [mainResData, setMainResData] = useState();
    const [isRollOverButton, setIsRollOverButton] = useState();


    const gridRef1 = useRef();

    const [columnDefs1, setColumnDefs1] = useState([
        { headerName: 'Booking ID', field: 'bookingID', maxWidth: 100 },

        {
            headerName: 'Guest', field: 'guestName', maxWidth: 150
        },
        { headerName: 'Room No.', field: 'roomNumber', maxWidth: 100 },
        { headerName: 'Company', field: 'accountName', maxWidth: 250 },
        {
            headerName: 'Arrival Date', field: 'arrivalDate',
            cellRenderer: (params) => {
                // Ensure the arrivalDate field exists in the row data        
                if (params.data && params.data.arrivalDate) {
                    // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
                    const formattedDate = format(new Date(params.data.arrivalDate), 'dd MMM  yy');
                    return formattedDate;
                } else {
                    return ""; // Handle cases where the data is missing or invalid        
                }
            }
            , maxWidth: 140
        },
        {
            headerName: 'Departure Date', field: 'departureDate',
            cellRenderer: (params) => {
                // Ensure the arrivalDate field exists in the row data        
                if (params.data && params.data.arrivalDate) {
                    // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
                    const formattedDate = format(new Date(params.data.departureDate), 'dd MMM  yy');
                    return formattedDate;
                } else {
                    return ""; // Handle cases where the data is missing or invalid        
                }
            }
            , suppressSizeToFit: true, maxWidth: 140
        },
        { headerName: 'Room Type', field: 'roomType', maxWidth: 140 },
        // { headerName: 'Actions', cellRendererFramework: (params) => <Button color='primary' style={{ width: 128 }} onClick={() => setPendingArrival(!pendingArrival)} >Actions</Button>, suppressSizeToFit: true },
        // { headerName: 'Actions', cellRendererFramework: (params) => {<Button color='primary' style={{ width: 160 }} onClick={() => setNoShowWithCharge(true)} >Cancel / No Show </Button>,<Button color='primary' style={{ width: 128 }} onClick={() => setRollOver(true)} >Roll Over</Button>}, width: 200 },
        {
            headerName: 'Actions',
            cellRendererFramework: (params) => (
                <div>
                    <Button className="me-1" color='primary' style={{ width: 160 }} onClick={() => setNoShowWithCharge(true)}>
                        Cancel / No Show
                    </Button>
                    <Button color='primary' style={{ width: 128 }} onClick={() => setRollOver(params.data)}>
                        Roll Over
                    </Button>
                </div>
            ),
            width: 340
        },
        // { headerName: 'Actions', cellRendererFramework: (params) => <Button color='primary' style={{ width: 128 }} onClick={() => setRollOver(true)} >Roll Over</Button>, suppressSizeToFit: true },
        { headerName: 'Status', field: 'reservationStatus', maxWidth: 120 },

    ]);

    const cellClickedArrival = useCallback(event => {
        console.log('cellClicked', event);
        // setfilldata(event['data'])
        let a = {}
        a['data1'] = event['data']
        setfilldata(a)
    }, []);

    const defaultColDef1 = useMemo(() => (
        {
            sortable: true,
            filter: true,
            autoHeight: true,
            wrapText: true,
            filterParams: {
                buttons: ['apply', 'reset']
            },
        }
    ));


    useEffect(() => {
        if (active === '2') {

            fetchx(API_URL + '/getReservationForFrontDeskToday?Start=' + Today)
                .then(result => result.json())
                .then(rowData => {
                    setPendingArr(rowData['data'])
                    setDisableArrival(false)
                    if (rowData['data'].length === 0) {
                        // setActive('3')
                        let getDailyDetails = JSON.stringify({
                            arrivalsNotYetCheckedIn: 1
                        })
                        fetchx(API_URL + "/updateNightAudit?date=" + Today, {
                            method: "PUT",
                            headers: { 'Content-Type': 'application/json' },
                            body: getDailyDetails
                        }).then(result => result.json())
                            .then(rowData2 => {
                                console.log(rowData2)
                                if (rowData.statusCode === 200) {
                                    // setDisableArrival(true)
                                    // setDisableDeparture(false)
                                    // setActive('3')

                                }
                            })
                    }
                })
        }

    }, [active == '2' && Today]);

    useEffect(() => {

        if (filldata) {
            console.log(filldata.data1['sharingID'])

            fetchx(API_URL + `/getMainReservationDetails?sharingID=${filldata.data1['sharingID']}`)
                .then(result => result.json())
                .then(rowData2 => {
                    console.log(rowData2['data'])
                    setMainResData(rowData2['data'])

                })
        }
    }, [filldata]);



    function RollOverApi() {
        if (filldata) {
            setIsRollOverButton(true)
            let createasset = JSON.stringify({
                "hotelID": 1,
                "sharingID": filldata.data1['sharingID'],

            });
            let result = fetchx(API_URL + "/rollOverData", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: createasset,
            }).then(data => data.json())
                .then((res) => {
                    if (res.statusCode === 200) {

                        let getDailyDetails = JSON.stringify({
                            reservationID: filldata.data1.id
                        })
                        fetchx(API_URL + "/rollOverReservation", {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            body: getDailyDetails
                        }).then(result => result.json())
                            .then(rowData2 => {
                                if (rowData2.statuscode === 200) {
                                    setIsRollOverButton(false)

                                    let isRollOver = JSON.stringify({
                                        "hotelID": 1,
                                        "reservationID": filldata.data1['id'],

                                    });
                                    let resultUpdate = fetchx(API_URL + "/updateIsRollOverInReservation", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: isRollOver,
                                    }).then(data => data.json())
                                        .then((res) => {
                                        })
                                    handleSuccess("Reservation RolledOver!!")
                                    setPendingArrival(false)
                                    setRollOver(false)
                                    RefreshFunction()
                                }
                                else {
                                    handleError(rowData2.message)
                                }
                            })
                    }
                    else {
                        handleError("Error Occurred!!")

                    }
                })
        }
    }

    // 2) For pending Departure


    const [pendingDep, setPendingDep] = useState();
    const [pendingDeparture, setPendingDeparture] = useState();
    const [stayModify, setStayModify] = useState();


    const gridRef2 = useRef();

    const [columnDefs2, setColumnDefs2] = useState([
        // {
        //     headerName: 'Guest', field: 'firstName', maxWidth: 200
        // },
        { headerName: 'Booking ID', field: 'bookingID', maxWidth: 100 },

        {
            headerName: 'Guest', field: 'guestName', maxWidth: 150
        },
        { headerName: 'Room No.', field: 'roomNumber', maxWidth: 100 },

        { headerName: 'Company', field: 'accountName', maxWidth: 250 },
        {
            headerName: 'Arrival Date', field: 'arrivalDate',
            cellRenderer: (params) => {
                // Ensure the arrivalDate field exists in the row data        
                if (params.data && params.data.arrivalDate) {
                    // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
                    const formattedDate = format(new Date(params.data.arrivalDate), 'dd MMM  yy');
                    return formattedDate;
                } else {
                    return ""; // Handle cases where the data is missing or invalid        
                }
            }
            , maxWidth: 140
        },
        {
            headerName: 'Departure Date', field: 'departureDate',
            cellRenderer: (params) => {
                // Ensure the arrivalDate field exists in the row data        
                if (params.data && params.data.departureDate) {
                    // Assuming arrivalDate is in "YYYY-MM-DD" format, you can format it to "DD-MM-YYYY"          
                    const formattedDate = format(new Date(params.data.departureDate), 'dd MMM  yy');
                    return formattedDate;
                } else {
                    return ""; // Handle cases where the data is missing or invalid        
                }
            }
            , suppressSizeToFit: true, maxWidth: 140
        },
        { headerName: 'Room Type', field: 'roomType', maxWidth: 140 },
        { headerName: 'Status', field: 'reservationStatus', maxWidth: 100 },

        // { headerName: 'Actions', cellRendererFramework: (params) => <Button color='primary' style={{ width: 128 }} onClick={() => setPendingDeparture(!pendingDeparture)} >Actions</Button>, suppressSizeToFit: true },
        {
            headerName: 'Actions', cellRendererFramework: (params) => <Button color='primary' style={{ width: 128 }} onClick={() => {
                const reservationID = params.data.id; // Assuming the reservation ID is stored in the 'id' field of the data
                localStorage.setItem('reservationID', reservationID); setTimeout(() => { window.open('/dashboard/frontdesk/Billing') }, 600)
            }} >Billing</Button>, width: 180
        },
        { headerName: 'Actions', cellRendererFramework: (params) => <Button color='primary' style={{ width: 128 }} onClick={() => setStayModify(true)} >Modify Stay</Button>, width: 180 },

    ]);

    const cellClickedDeparture = useCallback(event => {
        console.log('cellClicked', event);
        // setfilldata(event['data'])
        let a = {}
        a['data1'] = event['data']
        setfilldata(a)
        localStorage.setItem('reservationID', event['data']['id'])

    }, []);

    const defaultColDef2 = useMemo(() => (
        {
            sortable: true,
            filter: true,
            // autoHeight: true,
            // wrapText: true,
            filterParams: {
                buttons: ['apply', 'reset']
            },
        }
    ));


    useEffect(() => {
        if (active === '3') {

            fetchx(API_URL + '/getReservationForFrontDeskDeparturesNewNightAudit?End=' + Today)
                .then(result => result.json())
                .then(rowData => {
                    setPendingDep(rowData['data'])
                    if (rowData['data'].length === 0) {
                        // setActive('5')

                        let getDailyDetails = JSON.stringify({
                            depaturesNotCheckedOut: 1
                        })
                        fetchx(API_URL + "/updateNightAudit?date=" + Today, {
                            method: "PUT",
                            headers: { 'Content-Type': 'application/json' },
                            body: getDailyDetails
                        }).then(result => result.json())
                            .then(rowData2 => {
                                console.log(rowData2)
                                if (rowData2.statusCode === 200) {
                                    // setDisableDeparture(true)
                                    // setDisableRoomPosting(false)
                                    // setDisableUnsettleBillData(false)
                                    // setActive('4')

                                }

                            })
                    }

                })
        }

    }, [active == '3' && Today]);







    // 3) Room Status Change

    const [roomData, setRoomStatus] = useState();
    const [confirmRoomStatus, setConfirmRoomStatus] = useState();
    const [roomStatusLength, setRoomStatusLength] = useState();
    const [isRoomStatusButton, setIsRoomStatusButton] = React.useState(false);


    const gridRef3 = useRef();

    const [columnDefs3, setColumnDefs3] = useState([
        {
            headerName: 'Room Number', field: 'roomNumber', maxWidth: 160, sort: 'asc'
        },
        { headerName: 'Current Room Status', field: 'roomStatus', maxWidth: 200 },
        { headerName: 'New Room Status', field: 'NewRoomStatus', maxWidth: 200 },
        { headerName: 'Current Reservation Status', field: 'reservationStatus', suppressSizeToFit: true, maxWidth: 250 },
        { headerName: 'New ReservationStatus', field: 'NewReservationStatus', maxWidth: 200 },
        // { headerName: 'Status', field: 'reservationStatus' },

    ]);

    const cellClickedRoomStatus = useCallback(event => {
        console.log('cellClicked', event);
        // setfilldata(event['data'])
        // sessionStorage.setItem('reservationID', event['data']['id'])

    }, []);

    const defaultColDef3 = useMemo(() => (
        {
            sortable: true,
            filter: true,
            autoHeight: true,
            wrapText: true,
            filterParams: {
                buttons: ['apply', 'reset']
            },
        }
    ));


    useEffect(() => {
        if (active === '7') {

            const runFixedChargeCheck = async () => {

                const canProceed = await CheckPendingSteps('roomStatusCheck');

                if (!canProceed) {
                    // clearTimeout(timeout);
                    setOpen(false); // Close the modal if needed
                    return; // Do not proceed to generate reports
                }
            }
            runFixedChargeCheck();

            // CheckPendingSteps('roomStatusCheck').then((canProceed) => {
            //     if (!canProceed) {
            //         clearTimeout(timeout);
            //         setOpen(false); // Close modal
            //         return;
            //     }

            let getDailyDetails = JSON.stringify({
                hotelID: 1,
                CheckUpdate: 0,
            })
            //   fetchx(API_URL + "/updateRoomStatusInNightAudit", {
            fetchx(API_URL + "/updateRoomStatusInNightAudit", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: getDailyDetails
            }).then(result => result.json())
                .then(rowData => {


                    console.log(rowData)
                    setRoomStatus(rowData['data'])
                    const hasAnyNonNullValue = rowData['data'].some(room => {
                        return room.NewReservationStatus !== null || room.NewRoomStatus !== null;
                    });
                    console.log(hasAnyNonNullValue)
                    setRoomStatusLength(hasAnyNonNullValue)


                    if (hasAnyNonNullValue === false) {
                        // setActive('8')

                        let columnsToUpdate = JSON.stringify({
                            roomStatusCheck: 1
                        })
                        fetchx(API_URL + "/updateNightAudit?date=" + Today, {
                            method: "PUT",
                            headers: { 'Content-Type': 'application/json' },
                            body: columnsToUpdate
                        }).then(result => result.json())
                            .then(rowData2 => {
                                console.log(rowData2)
                                if (rowData2.statusCode === 200) {
                                    // setDisableRoomStatus(true)
                                    // setDisableReservationStatus(false)
                                    // setActive('8')
                                }
                            })
                    }


                })
            // });
            // CheckPendingSteps('roomStatusCheck')

        }
    }, [active === '7' && Today]);



    // Room Status Final Submit 
    function RoomStatusSubmit() {
        setIsRoomStatusButton(true);

        console.log("Function Called")
        setOpen(true);
        // Start a timer to check if the response takes more than 5 seconds
        const timeout = setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);
        CheckPendingSteps('roomStatusCheck')

        let roomUpdate = JSON.stringify({
            hotelID: 1,
            CheckUpdate: 1,
        })
        //   fetchx(API_URL + "/updateRoomStatusInNightAudit", {
        fetchx(API_URL + "/updateRoomStatusInNightAudit", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: roomUpdate
        }).then(result => result.json())
            .then(rowData => {
                console.log(rowData)
                // setRoomStatus(rowData['data'])
                if (rowData.statusCode === 200) {
                    // setActive('8')
                    setActive('9')
                    setDisableRoomStatus(true)
                    setDisableReports(false)

                    let getDailyDetails = JSON.stringify({
                        hotelID: 1,
                        CheckUpdate: 0,
                    })
                    //   fetchx(API_URL + "/updateRoomStatusInNightAudit", {
                    fetchx(API_URL + "/updateRoomStatusInNightAudit", {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: getDailyDetails
                    }).then(result => result.json())
                        .then(rowData => {
                            console.log(rowData)
                            setRoomStatus(rowData['data'])
                            if (rowData.statusCode === 200) {
                                setConfirmRoomStatus(false)
                                setOpen(false);

                                // const hasAnyPending = rowData['data'].filter(
                                //     room => room.NewReservationStatus === null || room.NewRoomStatus === null
                                // ).length > 0;
                                // console.log(hasAnyPending)
                                // setRoomStatusLength(hasAnyPending)
                                const hasAnyNonNullValue = rowData['data'].some(room => {
                                    return room.NewReservationStatus !== null || room.NewRoomStatus !== null;
                                });
                                console.log(hasAnyNonNullValue)
                                setRoomStatusLength(hasAnyNonNullValue)
                                if (rowData['data'].length === 0 || hasAnyNonNullValue === false) {
                                    // setActive('8')

                                    let columnsToUpdate = JSON.stringify({
                                        roomStatusCheck: 1
                                    })
                                    console.log(columnsToUpdate)
                                    fetchx(API_URL + "/updateNightAudit?date=" + Today, {
                                        method: "PUT",
                                        headers: { 'Content-Type': 'application/json' },
                                        body: columnsToUpdate
                                    }).then(result => result.json())
                                        .then(rowData2 => {
                                            console.log(rowData2)
                                            if (rowData2.statusCode === 200) {
                                                setActive('9')
                                                setDisableRoomStatus(true)
                                                setDisableReports(false)
                                            }

                                        })
                                }
                            }

                        })
                }
                else {
                    handleError(rowData.message)
                    setOpen(false);
                    setShowSecondaryMessage(false)
                    setDisableRoomStatus(false)
                    setConfirmRoomStatus(false)
                    RefreshGetNightAuditFunction()
                }

            })
    }


    function RoomStatusSubmitOnProceed() {
        setIsRoomStatusButton(true);

        console.log("Function Called")
        setOpen(true);
        // Start a timer to check if the response takes more than 5 seconds
        const timeout = setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);

        let roomUpdate = JSON.stringify({
            hotelID: 1,
            CheckUpdate: 2,
        })
        //   fetchx(API_URL + "/updateRoomStatusInNightAudit", {
        fetchx(API_URL + "/updateRoomStatusInNightAudit", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: roomUpdate
        }).then(result => result.json())
            .then(rowData => {
                console.log(rowData)
                // setRoomStatus(rowData['data'])
                if (rowData.statusCode === 200) {
                    setOpen(false);
                    setShowSecondaryMessage(false);
                    setActive('9')
                    setDisableRoomStatus(true)
                    setDisableReports(false)
                    UpdateEachStep("roomStatusCheck", 1)



                }
                // if (rowData.statusCode === 200) {
                //     // setActive('8')
                //     let getDailyDetails = JSON.stringify({
                //         hotelID: 1,
                //         CheckUpdate: 0,
                //     })
                //     //   fetchx(API_URL + "/updateRoomStatusInNightAudit", {
                //     fetchx(API_URL + "/updateRoomStatusInNightAudit", {
                //         method: "POST",
                //         headers: { 'Content-Type': 'application/json' },
                //         body: getDailyDetails
                //     }).then(result => result.json())
                //         .then(rowData => {
                //             console.log(rowData)
                //             setRoomStatus(rowData['data'])
                //             if (rowData.statusCode === 200) {
                //                 setConfirmRoomStatus(false)
                //                 setOpen(false);

                //                 // const hasAnyPending = rowData['data'].filter(
                //                 //     room => room.NewReservationStatus === null || room.NewRoomStatus === null
                //                 // ).length > 0;
                //                 // console.log(hasAnyPending)
                //                 // setRoomStatusLength(hasAnyPending)
                //                 const hasAnyNonNullValue = rowData['data'].some(room => {
                //                     return room.NewReservationStatus !== null || room.NewRoomStatus !== null;
                //                 });
                //                 console.log(hasAnyNonNullValue)
                //                 setRoomStatusLength(hasAnyNonNullValue)
                //                 if (rowData['data'].length === 0 || hasAnyNonNullValue === false) {
                //                     // setActive('8')

                //                     let columnsToUpdate = JSON.stringify({
                //                         roomStatusCheck: 1
                //                     })
                //                     console.log(columnsToUpdate)
                //                     fetchx(API_URL + "/updateNightAudit?date=" + Today, {
                //                         method: "PUT",
                //                         headers: { 'Content-Type': 'application/json' },
                //                         body: columnsToUpdate
                //                     }).then(result => result.json())
                //                         .then(rowData2 => {
                //                             console.log(rowData2)
                //                             if(rowData2.statusCode===200){
                //                             setActive('8')
                //                             setDisableRoomStatus(true)
                //                             setDisableReports(false)
                //                         }

                //                         })
                //                 }
                //             }

                //         })
                // }

            })
    }






    // 5) Room Posting
    let condition = true; // Your condition here

    const [roomPosting, setRoomPosting] = useState([]);
    const [roomPostingCheck, setRoomPostingCheck] = useState([]);
    const [confirmRoomPosting, setConfirmRoomPosting] = useState();
    const [roomPostingDetails, setRoomPostingData] = useState();
    const [isRoomPostingButton, setIsRoomPostingButton] = useState(false);
    const [shouldApplyRowStyle, setShouldApplyRowStyle] = useState(false); // State to control row styling setConfirmRoomPostingLastStep
    const [confirmRoomPostingLastStep, setConfirmRoomPostingLastStep] = useState(false);



    const gridRef5 = useRef();

    const [columnDefs5, setColumnDefs5] = useState([
        { headerName: 'Room No.', field: 'roomNumber', suppressSizeToFit: true, maxWidth: 130 },

        { headerName: 'Guest', field: 'guestName', maxWidth: 200 },
        { headerName: 'Room Type', field: 'roomType', maxWidth: 130 },
        // { headerName: 'Date', field: 'date', maxWidth: 140 },
        { headerName: 'Description', field: 'description', maxWidth: 148 },
        { headerName: 'Amount', field: 'subTotal', maxWidth: 158 },
        { headerName: 'Total(Incl. GST)', field: 'total', maxWidth: 158 },

    ]);

    const cellClickedRoomPosting = useCallback(event => {
        console.log('cellClicked', event);
        setRoomPostingData(event['data'])

    }, []);

    const defaultColDef5 = useMemo(() => (
        {
            sortable: true,
            filter: true,
            // autoHeight: true,
            // wrapText: true,
            filterParams: {
                buttons: ['apply', 'reset']
            },
        }
    ));


    useEffect(() => {
        if (active === '5') {

            setOpen(true);
            // Start a timer to check if the response takes more than 5 seconds
            const timeout = setTimeout(() => {
                setShowSecondaryMessage(true);
            }, 5000);
            const runFixedChargeCheck = async () => {

                const canProceed = await CheckPendingSteps('postingRoomAndTax');

                if (!canProceed) {
                    // clearTimeout(timeout);
                    // setOpen(false); // Close the modal if needed
                    setConfirmRoomPosting(false)
                    setConfirmRoomPostingLastStep(false)
                    return; // Do not proceed to generate reports
                }
            }
            runFixedChargeCheck();

            let unAssign = JSON.stringify({
                hotelID: 1
            });
            let res = fetchx(API_URL + "/getRoomPostings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: unAssign,
            }).then(result => result.json())
                .then(rowData => {
                    //  console.log(rowData['data'].length)
                    condition = true
                    if (rowData['statusCode'] === 200) {
                        setRoomPosting(rowData['data'])

                    }
                    else if (rowData['statusCode'] === 403) {
                        RefreshGetNightAuditFunction()
                        handleError(rowData['message'])
                    }


                })

            CheckPendingSteps('postingRoomAndTax')



        }
    }, [active === '5']);




    // Room Posting Final Submit 
    function ConfirmRoomPosting() {
        setOpen(true);
        // Start a timer to check if the response takes more than 5 seconds
        const timeout = setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);
        setIsRoomPostingButton(true)

        console.log("Hellooo", roomPosting)
        if (roomPosting.length > 0) {
            console.log("Hellooo")

            let roomUpdate = JSON.stringify({
                roomPostings: roomPosting,
            })
            console.log(roomUpdate)
            fetchx(API_URL + "/roomPostingNightAudit", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: roomUpdate
            }).then(result => result.json())
                .then(rowData => {
                    console.log(rowData)
                    if (rowData.statusCode === 200) {
                        // setOpen(false);
                        setIsRoomPostingButton(false)

                        setConfirmRoomPosting(false)
                        UpdateEachStep("postingRoomAndTax", 1)
                        let unAssign = JSON.stringify({
                            hotelID: 1
                        });



                        let columnsToUpdate = JSON.stringify({
                            postingRoomAndTax: 1
                        })
                        console.log(columnsToUpdate)
                        fetchx(API_URL + "/updateNightAudit?date=" + Today, {
                            method: "PUT",
                            headers: { 'Content-Type': 'application/json' },
                            body: columnsToUpdate
                        }).then(result => result.json())
                            .then(rowData2 => {
                                console.log(rowData2)
                                if (rowData2.statusCode === 200) {
                                    // setActive('6')
                                    // setDisableRoomPosting(true)
                                    // setDisableFixedPosting(false)
                                    setIsRoomPostingButton(false)
                                    ConfirmRoomPostingLast()
                                    // setOpen(false);
                                    // setShowSecondaryMessage(false)


                                }
                            })

                    }
                    else {
                        handleError(rowData.message)
                        setOpen(false);
                        setShowSecondaryMessage(false)
                        setIsRoomPostingButton(false)
                        RefreshGetNightAuditFunction()
                    }

                })

            fetchx(API_URL + "/GetRoomChargesPostedForReservation")
                .then(result => result.json())
                .then(rowData => {
                    if (rowData.statusCode === 200) {
                        condition = false

                        setRoomPostingCheck(rowData['data'])
                        // setOpen(false);
                        setConfirmRoomPosting(false)
                    }
                })
        }
    }


    function ConfirmRoomPostingLast() {
        condition = false
        setOpen(true);
        // Start a timer to check if the response takes more than 5 seconds
        const timeout = setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);
        setIsRoomPostingButton(true)
        setShouldApplyRowStyle(true); // Set to true after the function call


        fetchx(API_URL + "/GetRoomChargesPostedForReservation")
            .then(result => result.json())
            .then(rowData => {
                if (rowData.statusCode === 200) {
                    setRoomPosting(rowData['data'])
                    setOpen(false)
                    setShowSecondaryMessage(false)
                }
            })
    }

    function getRowStyle(params) {
        if (!shouldApplyRowStyle) return {}; // Return empty object if shouldApplyRowStyle is false

        const row = params.data;
        if (row.subTotal === null && row.total === null) {
            return { color: 'red' };
        } else {
            return { color: 'green' };
        }
    }


    // 6) For unsettle bills
    // let Today = format(new Date(), "yyyy-MM-dd")

    const [unSettleBills, setUnSettleBills] = useState();
    // const [pendingArrival, setPendingArrival] = useState();
    // const [noShowWithCharge, setNoShowWithCharge] = useState();
    // const [noShowWithOutCharge, setNoShowWithOutCharge] = useState();
    // const [filldata, setfilldata] = useState();
    // const [rollOver, setRollOver] = useState();
    // const [mainResData, setMainResData] = useState();

    const gridRef6 = useRef();

    const [columnDefs6, setColumnDefs6] = useState([
        // {headerName: 'Store ID', field: 'storeID', maxWidth: 200},
        { headerName: 'Restaurant Name', field: 'restaurantName', maxWidth: 250 },
        { headerName: 'Table No', field: 'tableNo', maxWidth: 250 },
        { headerName: 'Order ID', field: 'orderID', maxWidth: 140 },
        { headerName: 'Date Time', field: 'dateTime', maxWidth: 250 },

    ]);

    const cellClickedUnSettleBills = useCallback(event => {
        console.log('cellClicked', event);
        // setfilldata(event['data'])
        let a = {}
        // a['data1'] = event['data']
        // setfilldata(a)
    }, []);

    const defaultColDef6 = useMemo(() => (
        {
            sortable: true,
            filter: true,
            // autoHeight: true,
            // wrapText: true,
            filterParams: {
                buttons: ['apply', 'reset']
            },
        }
    ));


    useEffect(() => {
        if (active === '4') {

            let unSettleData = JSON.stringify({
                hotelID: 1
            })
            fetchx(API_URL + "/getPOSUnsettledOrders", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: unSettleData
            }).then(result => result.json())
                .then(rowData => {
                    setUnSettleBills(rowData['data'])
                    if (rowData['data'].length === 0) {

                        // setActive('5')
                        let getDailyDetails = JSON.stringify({
                            unSettleBills: 1
                        })
                        fetchx(API_URL + "/updateNightAudit?date=" + Today, {
                            method: "PUT",
                            headers: { 'Content-Type': 'application/json' },
                            body: getDailyDetails
                        }).then(result => result.json())
                            .then(rowData2 => {
                                console.log(rowData2)
                                if (rowData.statusCode === 200) {
                                    // setDisableUnsettleBillData(true)
                                    // setDisableRoomPosting(false)
                                    // setActive('5')

                                }
                            })
                    }

                })
        }

    }, [active == '4' && Today]);








    // 4) Fixed Charge Posting

    const [fixedCharge, setFixedCharge] = useState();
    const [fixedChargeNull, setFixedChargeNull] = useState(false);
    const [confirmFixedChargePosting, setConfirmFixedChargePosting] = useState();
    const [isFixedChargePostingButton, setIsFixedChargePostingButton] = useState(false);
    const [isGenerateReportButton, setIsGenerateReportButton] = useState(false);


    const gridRef4 = useRef();

    const [columnDefs4, setColumnDefs4] = useState([
        { headerName: 'Guest', field: 'guestName', maxWidth: 200 },

        {
            headerName: 'Room Number', field: 'roomNumber', maxWidth: 140, sort: 'asc'
        },
        { headerName: 'Room Type', field: 'roomType', maxWidth: 130 },
        { headerName: 'beginDate', field: 'beginDate', suppressSizeToFit: true, maxWidth: 130 },
        { headerName: 'End Date', field: 'endDate', maxWidth: 130 },
        { headerName: 'transactionCode', field: 'transactionCode', maxWidth: 158 },
        { headerName: 'Description', field: 'description', maxWidth: 180 },
        { headerName: 'Amount', field: 'amount', maxWidth: 180 },

    ]);

    const cellClickedFixedChargePosting = useCallback(event => {
        console.log('cellClicked', event);
        // setfilldata(event['data'])
        sessionStorage.setItem('reservationID', event['data']['id'])

    }, []);

    const defaultColDef4 = useMemo(() => (
        {
            sortable: true,
            filter: true,
            autoHeight: true,
            wrapText: true,
            filterParams: {
                buttons: ['apply', 'reset']
            },
        }
    ));


    useEffect(() => {
        if (active === '6') {
            // CheckPendingSteps('fixedChargePostingCheck')
            const runFixedChargeCheck = async () => {

                const canProceed = await CheckPendingSteps('fixedChargePostingCheck');

                if (!canProceed) {
                    // clearTimeout(timeout);
                    setOpen(false); // Close the modal if needed
                    return; // Do not proceed to generate reports
                }
            }
            runFixedChargeCheck();

            fetchx(API_URL + "/getFixedChargesForDay?hotelID=1&date=" + Today)
                .then(result => result.json())
                .then(rowData => {
                    console.log(rowData)
                    if (rowData.statusCode === 200) {

                        setFixedCharge(rowData['data'])
                        if (rowData['data'].length === 0) {
                            // setActive('7')
                            // setDisableFixedPosting(true)
                            // setDisableRoomStatus(false)

                            // let columnsToUpdate = JSON.stringify({
                            //     fixedChargePostingCheck: 1
                            // })
                            // console.log(columnsToUpdate)
                            // fetchx(API_URL + "/updateNightAudit?date=" + Today, {
                            //     method: "PUT",
                            //     headers: { 'Content-Type': 'application/json' },
                            //     body: columnsToUpdate
                            // }).then(result => result.json())
                            //     .then(rowData2 => {
                            //         console.log(rowData2)
                            //         if (rowData2.statusCode === 200) {
                            //             // setActive('7')
                            //             // setDisableFixedPosting(true)
                            //             // setDisableRoomStatus(false)
                            //             setOpen(false);
                            //             // setConfirmFixedChargePosting(false)

                            //         }
                            //     })

                        }
                    }
                    if (rowData.statusCode === 200) {
                        let columnsToUpdate = JSON.stringify({
                            date: Today,
                            hotelID: 1
                        })
                        fetchx(API_URL + "/getNightAuditCheck", {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            body: columnsToUpdate
                        }).then(result => result.json())
                            .then(rowData2 => {
                                setNightAuditData(rowData2.data[0])
                                // console.log(rowData2.data[0].fixedChargePostingCheck)
                                if (rowData2.data[0].fixedChargePostingCheck === '1') {
                                    // console.log(active)
                                    // setActive('7')
                                    // setDisableFixedPosting(true)
                                    // setDisableRoomStatus(false)
                                }
                            })
                    }

                })


        }
    }, [active === '6' && Today]);
    // console.log(active)

    // Fixed Charge Final Submit 
    function FixedChargesPosting() {
        console.log("Function Called")
        setOpen(true);
        // Start a timer to check if the response takes more than 5 seconds
        const timeout = setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);
        setIsFixedChargePostingButton(true)
        let roomUpdate = JSON.stringify({
            hotelID: 1,
            date: Today,
        })
        //   fetchx(API_URL + "/updateRoomStatusInNightAudit", {
        fetchx(API_URL + "/postFixedCharges", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: roomUpdate
        }).then(result => result.json())
            .then(rowData => {
                console.log(rowData)
                setRoomStatus(rowData['data'])

                if (rowData.statusCode === 200) {
                    // setActive('8')
                    setFixedChargeNull(true)
                    setActive('7')
                    UpdateEachStep("fixedChargePostingCheck", 1)
                    // setDisableFixedPosting(true)
                    // setDisableRoomStatus(false)

                    let columnsToUpdate = JSON.stringify({
                        fixedChargePostingCheck: 1
                    })
                    console.log(columnsToUpdate)
                    fetchx(API_URL + "/updateNightAudit?date=" + Today, {
                        method: "PUT",
                        headers: { 'Content-Type': 'application/json' },
                        body: columnsToUpdate
                    }).then(result => result.json())
                        .then(rowData2 => {
                            console.log(rowData2)
                            if (rowData2.statusCode === 200) {
                                setActive('7')
                                setDisableFixedPosting(true)
                                setDisableRoomStatus(false)
                                setOpen(false);
                                setConfirmFixedChargePosting(false)

                            }
                        })

                    // fetchx("http://122.166.2.21:14780/getFixedChargesForDay?hotelID=1&date=" + Today)
                    //     .then(result => result.json())
                    //     .then(rowData => {
                    //         console.log(rowData)
                    //         setFixedCharge(rowData['data'])
                    //         if (rowData.statusCode === 200) {
                    //             setActive('7')
                    //             setDisableFixedPosting(true)
                    //             setDisableRoomStatus(false)
                    //             setConfirmFixedChargePosting(false)
                    //         }

                    //     })
                }
                else {
                    handleError(rowData.message)
                    setOpen(false);
                    setShowSecondaryMessage(false)
                    setIsFixedChargePostingButton(false)
                    setConfirmFixedChargePosting(false)

                    RefreshGetNightAuditFunction()
                }

            })
    }

    // console.log(active)






    // For Reservation Status and For rolling date and inventory increase
    useEffect(() => {
        if (active === '8') {
         ;
            // Start a timer to check if the response takes more than 5 seconds
            const timeout = setTimeout(() => {
                setShowSecondaryMessage(true);
            }, 5000);
            const runFixedChargeCheck = async () => {

                const canProceed = await CheckPendingSteps('printingReports');

                if (!canProceed) {
                    // clearTimeout(timeout);
                    // setOpen(false); // Close the modal if needed
                    return; // Do not proceed to generate reports
                }
            }
            runFixedChargeCheck();
            setOpen(true)
            let resStatus = JSON.stringify({
                hotelID: 1,
            })
            //   fetchx(API_URL + "/updateRoomStatusInNightAudit", {
            fetchx(API_URL + "/reservationStatusNightAudit", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: resStatus
            }).then(result => result.json())
                .then(rowData => {
                    if (rowData.statusCode === 200) {

                        let getDailyDetails = JSON.stringify({
                            reservationStatusCheck: 1
                        })
                        console.log(getDailyDetails)
                        fetchx(API_URL + "/updateNightAudit?date=" + Today, {
                            method: "PUT",
                            headers: { 'Content-Type': 'application/json' },
                            body: getDailyDetails
                        }).then(result => result.json())
                            .then(rowData2 => {
                                console.log(rowData2)
                                if (rowData2.statusCode === 200) {
                                    // setShowCard(true)

                                    let finalNightAudit = JSON.stringify({
                                        hotelID: 1,
                                    })
                                    //   fetchx(API_URL + "/updateRoomStatusInNightAudit", {
                                    fetchx(API_URL + "/nightAuditFinalStep", {
                                        method: "POST",
                                        headers: { 'Content-Type': 'application/json' },
                                        body: finalNightAudit
                                    }).then(result => result.json())
                                        .then(rowData => {
                                            setOpen(false)
                                            setShowSecondaryMessage(false)
                                            console.log(rowData)
                                            if (rowData.statusCode === 200) {
                                                // setActive('8')
                                                setShowCard(true)

                                                UpdateEachStep("reservationStatusCheck", 1)
                                                setShowCard(true)
                                                handleSuccess("Successfully Done Night Audit !!")
                                                // sessionStorage.removeItem('NightAuditTab')
                                                setTimeout(() => { navigate('/dashboard/frontDesk'); }, 4000)
                                            }
                                            else {
                                                // setPopUp(rowData.message)
                                                handleError(rowData.message)
                                                setOpen(false);
                                                setShowSecondaryMessage(false)
                                                RefreshGetNightAuditFunction()


                                            }
                                        })

                                    let columnsToUpdate = JSON.stringify({
                                        date: Today,
                                        hotelID: 1
                                    })
                                    fetchx(API_URL + "/getNightAuditCheck", {
                                        method: "POST",
                                        headers: { 'Content-Type': 'application/json' },
                                        body: columnsToUpdate
                                    }).then(result => result.json())
                                        .then(rowData2 => {
                                            // setNightAuditData(rowData2.data[0])
                                            // console.log(rowData2.data[0].fixedChargePostingCheck)
                                            if (rowData2.data[0].rollingBusinessDate === '1') {
                                                // console.log(active)
                                                setNightAuditData(rowData2.data[0])


                                                //  handleError("Night Audit Already Completed !!")
                                            }
                                        })
                                }
                            })


                    }

                })
        }
    }, [active == '8' && Today]);



    // For Refresh Aggrid
    function RefreshFunction() {
        console.log('RefreshFunction called');

        let getDailyDetails = JSON.stringify({
            hotelID: 1
        })
        fetchx(API_URL + "/checkCountryNightAudit", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: getDailyDetails
        }).then(result => result.json())
            .then(rowData => {
                if (rowData.statusCode === 200) {

                    setRowData(rowData['data'])
                    let getDailyDetails = JSON.stringify({
                        countryAndStateCheck: 1
                    })
                    fetchx(API_URL + "/updateNightAudit?date=" + Today, {
                        method: "PUT",
                        headers: { 'Content-Type': 'application/json' },
                        body: getDailyDetails
                    }).then(result => result.json())
                        .then(rowData2 => {
                            console.log(rowData2)
                            if (rowData.statusCode === 200) {
                                // setActive('2')
                                // setDisableCountry(true)
                                // setDisableArrival(false)

                            }
                        })
                }
            })

        fetchx(API_URL + '/getReservationForFrontDeskToday?Start=' + Today)
            .then(result => result.json())
            .then(rowData => {
                if (rowData.statusCode === 200) {
                    console.log("Called")
                    setPendingArr(rowData['data'])
                }
            })

        fetchx(API_URL + '/getReservationForFrontDeskDeparturesNewNightAudit?End=' + Today)
            .then(result => result.json())
            .then(rowData => {
                if (rowData.statusCode === 200) {

                    setPendingDep(rowData['data'])
                }
            })

        let unSettleData = JSON.stringify({
            hotelID: 1
        })
        fetchx(API_URL + "/getPOSUnsettledOrders", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: unSettleData
        }).then(result => result.json())
            .then(rowData => {
                if (rowData.statusCode === 200) {

                    setUnSettleBills(rowData['data'])
                }
            })


        if (shouldApplyRowStyle === true) {
            // setConfirmRoomPostingLastStep(true)
            fetch(API_URL + "/GetRoomChargesPostedForReservation")
                .then(result => result.json())
                .then(rowData => {
                    if (rowData.statusCode === 200) {
                        condition = false

                        setRoomPostingCheck(rowData['data'])
                        setConfirmRoomPosting(false)
                    }
                })

        }
        else {
            let unAssign = JSON.stringify({
                hotelID: 1
            });
            let res = fetch(API_URL + "/getRoomPostings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: unAssign,
            }).then(result => result.json())
                .then(rowData => {
                    condition = true
                    if (rowData.statusCode === 200) {
                        setRoomPosting(rowData['data'])
                    }

                })
        }

        fetchx(API_URL + "/GetRoomChargesPostedForReservation")
            .then(result => result.json())
            .then(rowData => {
                if (rowData.statusCode === 200) {

                    condition = false

                    setRoomPostingCheck(rowData['data'])
                    setOpen(false);
                    setConfirmRoomPosting(false)
                }
            })


        fetchx(API_URL + "/getFixedChargesForDay?hotelID=1&date=" + Today)
            .then(result => result.json())
            .then(rowData => {
                console.log(rowData)
                if (rowData.statusCode === 200) {

                    setFixedCharge(rowData['data'])
                }
            })

        let getDailyDetail = JSON.stringify({
            hotelID: 1,
            CheckUpdate: 0,
        })
        //   fetchx(API_URL + "/updateRoomStatusInNightAudit", {
        fetchx(API_URL + "/updateRoomStatusInNightAudit", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: getDailyDetail
        }).then(result => result.json())
            .then(rowData => {
                if (rowData.statusCode === 200) {
                    setRoomStatus(rowData['data'])
                }
            })

    }



    useEffect(() => {
        if (active === '9') {
            const runFixedChargeCheck = async () => {

                const canProceed = await CheckPendingSteps('printingReports');

                if (!canProceed) {
                    // clearTimeout(timeout);
                    setOpen(false); // Close the modal if needed
                    return; // Do not proceed to generate reports
                }
            }
            runFixedChargeCheck();
        }
    }, [active == '9' && Today]);

    async function generateReports() {
        setIsGenerateReportButton(true)
        setOpen(true);
        // Start a timer to check if the response takes more than 5 seconds
        const timeout = setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);

        const runFixedChargeCheck = async () => {

            const canProceed = await CheckPendingSteps('printingReports');

            if (!canProceed) {
                // clearTimeout(timeout);
                // setOpen(false); // Close the modal if needed
                return; // Do not proceed to generate reports
            }
        }
        runFixedChargeCheck();

        let getDailyDetail = JSON.stringify({
            hotelID: 1,
            Today: Today,
        })
        //   fetchx(API_URL + "/updateRoomStatusInNightAudit", {
        fetchx(API_URL + "/generateReportsNightAudit", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: getDailyDetail
        }).then(result => result.json())
            .then(rowData => {
                if (rowData.statusCode === 200) {
                    UpdateEachStep("printingReports", 1)
                    setIsGenerateReportButton(false)

                    setOpen(false);
                    // handleSuccess("Reports generated successfull")
                    setActive('8')
                    setDisableReports(true)
                    setDisableReservationStatus(false)
                }
                else {
                    handleError(rowData.message)
                    setOpen(false);
                    setShowSecondaryMessage(false)
                    setDisableReports(false)
                    setIsGenerateReportButton(false)
                    RefreshGetNightAuditFunction()
                }
            })
        // }, [active == '9' && Today]);

    }

    console.log(condition)

    const getNextDate = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    return (
        <React.Fragment>

            {/* Tab component */}
            {startNightAudit == true &&
                <div className="container-fluid">

                    <div className="row">
                        <div className="col">
                            <Nav pills fill style={{ overflowX: 'auto' }}>
                                <NavItem style={{ flex: 1 }}>
                                    <NavLink
                                        active={active === '4'}
                                        onClick={() => {
                                            toggle('4')
                                        }}
                                    // disabled={disableUnSettleBillData}

                                    >
                                        POS Pending Bills
                                    </NavLink>
                                    {getNightAudit && getNightAudit.unSettleBills === '1' && <AiOutlineCheckCircle
                                        style={{
                                            fontSize: '24px',
                                            color: 'green',
                                        }}
                                        className="attractive-checkmark" />}
                                </NavItem>
                                <NavItem style={{ flex: 1 }}>
                                    <NavLink
                                        active={active === '1'}
                                        onClick={() => {
                                            toggle('1')
                                        }}
                                    // disabled={disableCountry}
                                    // disabled={rowData.length === undefined}
                                    >
                                        Nationality
                                    </NavLink>
                                    {/* {active !== '1' && rowData && rowData.length === 0 &&  */}
                                    {getNightAudit && getNightAudit.countryAndStateCheck === '1' &&
                                        <AiOutlineCheckCircle
                                            style={{
                                                fontSize: '24px',
                                                color: 'green',
                                            }}
                                            className="attractive-checkmark" />}

                                </NavItem>
                                <NavItem style={{ flex: 1 }}>
                                    <NavLink
                                        active={active === '2'}
                                        onClick={() => {
                                            toggle('2')
                                        }}
                                    // disabled={disableArrival}
                                    >
                                        Pending Arrivals
                                    </NavLink>
                                    {/* {pendingArr && active !== '2' && pendingArr.length === 0 && disableArrival === true && */}
                                    {getNightAudit && getNightAudit.arrivalsNotYetCheckedIn === '1' &&
                                        <AiOutlineCheckCircle
                                            style={{
                                                fontSize: '24px',
                                                color: 'green',
                                            }}
                                            className="attractive-checkmark" />}
                                </NavItem>
                                {/* <NavItem>
                                <NavLink disabled>Disabled</NavLink>
                            </NavItem> */}
                                <NavItem style={{ flex: 1 }}>
                                    <NavLink
                                        active={active === '3'}
                                        onClick={() => {
                                            toggle('3')
                                        }}
                                    // disabled={disableDeparture}

                                    >
                                        Pending Departures
                                    </NavLink>
                                    {/* {active !== '3' && pendingDep && pendingDep.length === 0 && disableDeparture === true &&  */}
                                    {getNightAudit && getNightAudit.depaturesNotCheckedOut === '1' &&

                                        <AiOutlineCheckCircle
                                            style={{
                                                fontSize: '24px',
                                                color: 'green',
                                            }}
                                            className="attractive-checkmark" />}
                                </NavItem>
                                {/* <NavItem style={{ flex: 1 }}>
                                    <NavLink
                                        active={active === '4'}
                                        onClick={() => {
                                            toggle('4')
                                        }}
                                        disabled={disableUnSettleBillData}

                                    >
                                        Unsettled Bills
                                    </NavLink>
                                    {getNightAudit && getNightAudit.unSettleBills === '1' && <AiOutlineCheckCircle
                                        style={{
                                            fontSize: '24px',
                                            color: 'green',
                                        }}
                                        className="attractive-checkmark" />}
                                </NavItem> */}
                                <NavItem style={{ flex: 1 }}>
                                    <NavLink
                                        active={active === '5'}
                                        onClick={() => {
                                            toggle('5')
                                        }}
                                        disabled={disableRoomPosting}

                                    >
                                        Room Postings
                                    </NavLink>
                                    {/* {active !== '5' && roomPosting && roomPosting.length === 0 && disableRoomPosting == true && */}
                                    {getNightAudit && getNightAudit.postingRoomAndTax === '1' &&

                                        <AiOutlineCheckCircle
                                            style={{
                                                fontSize: '24px',
                                                color: 'green',
                                            }}
                                            className="attractive-checkmark" />}
                                </NavItem>
                                <NavItem style={{ flex: 1 }}>
                                    <NavLink
                                        active={active === '6'}
                                        onClick={() => {
                                            toggle('6')
                                        }}
                                        disabled={disableFixedPosting}

                                    >
                                        Fixed Charge Postings
                                    </NavLink>
                                    {/* {active !== '6' && (fixedChargeNull === true || (fixedCharge && fixedCharge.length === 0)) && disableFixedPosting === true */}
                                    {/* {active !== '6' && nightAuditData && nightAuditData['fixedChargePostingCheck'] === '1' && disableFixedPosting === true &&  */}
                                    {getNightAudit && getNightAudit.fixedChargePostingCheck === '1' &&

                                        <AiOutlineCheckCircle
                                            style={{
                                                fontSize: '24px',
                                                color: 'green',
                                            }}
                                            className="attractive-checkmark" />}
                                </NavItem>
                                <NavItem style={{ flex: 1 }}>
                                    <NavLink
                                        active={active === '7'}
                                        onClick={() => {
                                            toggle('7')
                                        }}
                                        disabled={disableRoomStatus}

                                    >
                                        Room Status
                                    </NavLink>
                                    {/* {active !== '7' && roomStatusLength === false && disableRoomStatus === true &&  */}
                                    {getNightAudit && getNightAudit.roomStatusCheck === '1' &&

                                        <AiOutlineCheckCircle
                                            style={{
                                                fontSize: '24px',
                                                color: 'green',
                                            }}
                                            className="attractive-checkmark" />}
                                </NavItem>
                                <NavItem style={{ flex: 1 }}>
                                    <NavLink
                                        active={active === '9'}
                                        onClick={() => {
                                            toggle('9')
                                        }}
                                        disabled={disableReports}

                                    >
                                        Reports
                                    </NavLink>
                                    {/* {active !== '7' && roomStatusLength === false && disableRoomStatus === true &&  */}
                                    {getNightAudit && getNightAudit.printingReports === '1' &&

                                        <AiOutlineCheckCircle
                                            style={{
                                                fontSize: '24px',
                                                color: 'green',
                                            }}
                                            className="attractive-checkmark" />}
                                </NavItem>
                                <NavItem style={{ flex: 1 }}>
                                    <NavLink
                                        active={active === '8'}
                                        onClick={() => {
                                            toggle('8')
                                        }}
                                        disabled={disableReservationStatus}

                                    >
                                        {/* Room Reservation Status */}
                                        Other Process
                                    </NavLink>
                                    {/* {active !== '8' &&  */}
                                    {getNightAudit && getNightAudit.rollingBusinessDate === '1' &&

                                        <AiOutlineCheckCircle
                                            style={{
                                                fontSize: '24px',
                                                color: 'green',
                                            }}
                                            className="attractive-checkmark" />}
                                </NavItem>
                            </Nav>
                        </div>
                    </div>
                </div>

            }

            {startNightAudit === false &&
                <div className="bg-white min-vh-100 d-flex justify-content-center align-items-center">
                    <Card className="w-50 text-center p-4 shadow-lg rounded">
                        <CardBody>
                            <h4 >Start Night Audit Process</h4>
                            <div>
                                <Button color="primary" onClick={() => setModalOpen(true)}>
                                    Start
                                </Button>{' '}
                            </div>
                        </CardBody>
                    </Card>
                    <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} centered>
                        <ModalHeader toggle={() => setModalOpen(!modalOpen)} className="text-center">
                            Night Audit Confirmation
                        </ModalHeader>
                        <ModalBody className="text-center">
                            <h4> <b> Confirm to start Night Audit</b></h4>
                        </ModalBody>
                        <ModalFooter className="justify-content-center">
                            {/* <Button color="primary" onClick={() => (setStartNightAudit(true), setActive('1'), AddToNightAudit())}> */}
                            <Button color="primary" onClick={() => (setStartNightAudit(true), setActive('4'), AddToNightAudit())}>
                                Confirm
                            </Button>
                            <Button color="secondary" onClick={() => setModalOpen(!modalOpen)}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>
            }


            {/* </div

            }  */}



            {/* Country Check */}

            <TabContent className='py-50' activeTab={active}>
                <TabPane tabId='1'>
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h4">Guest Details</CardTitle>
                            <Button outline color="primary" onClick={RefreshFunction}>
                                <span style={{ marginRight: '8px' }}>↻</span>
                                Refresh
                            </Button>
                        </CardHeader>
                        <CardBody>
                            <div>
                                <div className="ag-theme-alpine" style={{ height: 450 }}>
                                    <AgGridReact
                                        ref={gridRef}
                                        rowData={rowData} columnDefs={columnDefs}
                                        animateRows={true} rowSelection='multiple'
                                        onCellClicked={cellClickedListener}
                                        //  //  paginationAutoPageSize='true'
                                        paginationPageSize='10'
                                        pagination='true'
                                        overlayNoRowsTemplate={'No records found'}
                                        defaultColDef={defaultColDef}
                                        headerColor="ddw-primary"
                                        gridOptions={gridOptions}


                                    />
                                </div>
                            </div>
                            <br></br>
                            <div align='end'>
                                <Button className='me-1' color='primary' align='end'
                                    //  onClick={() => { (rowData && rowData.length === 0) ? {setActive('2'), setDisableCountry(true),
                                    //      setDisableArrival(false)} : handleError("Complete Existing Process") }}
                                    onClick={() => {

                                        if (rowData && rowData.length === 0) {
                                            setActive('2');
                                            setDisableCountry(true);
                                            setDisableArrival(false);
                                            UpdateEachStep("countryAndStateCheck", 1)

                                            // } else {
                                            //     handleError("Complete Existing Process");
                                        }
                                        else {
                                            setCountryCheckSkip(true)

                                        }
                                    }}
                                >
                                    Proceed
                                </Button>

                            </div>
                        </CardBody>

                    </Card>
                </TabPane>
            </TabContent>

            {/* Check Country */}
            <div className="disabled-animation-modal">
                <Modal
                    isOpen={checkCountry}
                    toggle={() => setCheckCountry(!checkCountry)}
                    className="modal-dialog-centered"
                >
                    {" "}
                    {/*onClosed={onDiscard}*/}
                    <ModalHeader
                        className="modal-sm"
                        toggle={() => {
                            setCheckCountry(!checkCountry);
                        }}
                    >
                        Need To Check..
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <div>
                            <div >
                                <Card style={{ backgroundColor: '#F2E5D9' }}>
                                    <Row className='cardBody'>
                                        <Col md='3' sm='12' className='mb-1'>
                                            <div
                                                onClick={() => setOpenGuestProfile(!guestProfile)}
                                                className="hoverUnderline"
                                            >
                                                Modify Guest Details
                                            </div>
                                            {/* </Col>
                                    
                                        <Col md='3' sm='12' className='mb-1'> */}

                                            <div
                                                onClick={() => setVisaDetails(!visaDetails)}
                                                className="hoverUnderline"
                                            >
                                                Add Visa Details
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={visaDetails}
                    toggle={() => setVisaDetails(!visaDetails)}
                    className="modal-xl"
                >
                    <ModalHeader
                        className="bg-transparent"
                        toggle={() => setVisaDetails(!visaDetails)}
                    ></ModalHeader>
                    <ModalBody className="pb-3 px-sm-1 mx-20">
                        <div>
                            {/* data1={filldata} */}
                            <VisaDetails data1={guestData} />
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={guestProfile}
                    toggle={() => setOpenGuestProfile(!guestProfile)}
                    className="modal-xm"
                >
                    <ModalHeader
                        className="bg-transparent"
                        toggle={() => setOpenGuestProfile(!guestProfile)}
                    ></ModalHeader>
                    <ModalBody className="pb-3 px-sm-1 mx-20">
                        <div>
                            {/* data1={filldata} */}
                            {/* {guestData && guestData.length!== 0 && <GuestProfile data1={guestData} />} */}
                            <div>
                                <Col md='5' sm='12' className='mb-1'>
                                    <Label className='form-label' for='fullName'>
                                        Search
                                    </Label>
                                    <Input
                                        type="text"
                                        id="filter-text-box2"
                                        placeholder="Filter..."
                                        onInput={onFilterTextBoxChanged}
                                    />
                                </Col>
                            </div>
                            {countryOptions &&
                                <div className="ag-theme-alpine" style={{ height: 450 }}>

                                    <AgGridReact rowData={countryOptions}
                                        columnDefs={columnDefsCountry}
                                        ref={gridRefCountry}
                                        animateRows={true} rowSelection='multiple'
                                        onCellClicked={cellClickedCountry}
                                        //  paginationAutoPageSize='true'
                                        paginationPageSize='10'
                                        pagination='true'
                                        overlayNoRowsTemplate={'No records found'}
                                        defaultColDef={defaultColDef1}
                                        headerColor="ddw-primary"
                                    />
                                </div>
                            }

                        </div>
                    </ModalBody>
                </Modal>
            </div>


            <Modal isOpen={countryCheckSkip} toggle={() => setCountryCheckSkip(!countryCheckSkip)} className='modal-dialog-centered'>
                <ModalHeader className='bg-transparent' toggle={() => setCountryCheckSkip(!countryCheckSkip)}></ModalHeader>
                <ModalBody className='px-5 pb-2'>
                    <div className='text-center mb-2'>
                        <h1 class='mb-1'>Continue without adding nationality?</h1>
                        {/* <p>you want to submit this form ? </p> */}
                    </div>
                    <Col>
                        <div className="button-container text-center">
                            <Button className="me-1" color="primary" type="submit" onClick={() => {
                                setActive('2')
                                setDisableCountry(true)
                                setDisableArrival(false)
                                setCountryCheckSkip(false)
                                UpdateEachStep("countryAndStateCheck", 1)


                            }} >
                                Confirm
                            </Button>
                            <Button className="me-1" color="danger" onClick={() => setCountryCheckSkip(false)} >
                                Cancel
                            </Button>
                        </div>
                    </Col>
                </ModalBody>

            </Modal>


            <div>
                <Modal
                    isOpen={OpenGuestProfileFullEdit}
                    toggle={() => setOpenGuestProfileFullEdit(!OpenGuestProfileFullEdit)}
                    className="modal-xl"
                >
                    <ModalHeader
                        className="bg-transparent"
                        toggle={() => setOpenGuestProfileFullEdit(!OpenGuestProfileFullEdit)}
                    ></ModalHeader>
                    <ModalBody className="pb-3 px-sm-1 mx-20">
                        <div>
                            {/* data1={filldata} */}
                            {guestData && guestData.length !== 0 && <GuestProfile data1={guestData} />}

                        </div>
                    </ModalBody>
                </Modal>
            </div>








            {/* Pending Arrivals */}
            <TabContent className='py-50' activeTab={active}>

                <TabPane tabId='2' style={{ marginTop: '-16px' }}>
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h4">Pending Arrivals</CardTitle>
                            <Button outline color="primary" onClick={RefreshFunction}>
                                <span style={{ marginRight: '8px' }}>↻</span>
                                Refresh
                            </Button>
                        </CardHeader>
                        <CardBody>
                            <div>
                                <div className="ag-theme-alpine" style={{ height: 450 }}>
                                    <AgGridReact
                                        ref={gridRef1}
                                        rowData={pendingArr} columnDefs={columnDefs1}
                                        animateRows={true} rowSelection='multiple'
                                        onCellClicked={cellClickedArrival}
                                        //  paginationAutoPageSize='true'
                                        paginationPageSize='10'
                                        pagination='true'
                                        overlayNoRowsTemplate={'No records found'}
                                        defaultColDef={defaultColDef1}
                                        headerColor="ddw-primary"

                                    />
                                </div>
                            </div>
                            <br></br>
                            <div align='end'>
                                <Button className='me-1' color='primary' align='end'
                                    // onClick={() => { (pendingArr && pendingArr.length === 0) ? setActive('3') : handleError("Complete Existing Process") }}
                                    onClick={() => {
                                        RefreshFunction()

                                        if (pendingArr && pendingArr.length === 0) {
                                            setActive('3');
                                            setDisableArrival(true);
                                            setDisableDeparture(false);
                                            UpdateEachStep("arrivalsNotYetCheckedIn", 1)

                                        } else {
                                            handleError("Complete Existing Process");
                                        }
                                    }}
                                >
                                    Proceed
                                </Button>
                            </div>
                        </CardBody>

                    </Card>
                </TabPane>
            </TabContent>



            {/* BackDrop For messages */}
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                        Please wait night audit is in progress...
                    </h1>
                    {showSecondaryMessage && (
                        <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                            We're processing your request, which may take a little longer due to additional data. Please be patient!
                        </h1>
                    )}
                    <CircularProgress color="inherit" />
                </div>
            </Backdrop>



            <Modal
                isOpen={pendingArrival}
                toggle={() => setPendingArrival(!pendingArrival)}
                className="modal-dialog-centered"
            >
                <ModalHeader
                    className="modal-sm"
                    toggle={() => {
                        setPendingArrival(!pendingArrival);
                    }}
                >
                    Need To Check..
                </ModalHeader>
                <ModalBody className="pb-3 px-sm-2 mx-20">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {/* First Section */}
                        <div style={{ flex: 1, marginRight: '16px' }}>
                            <Card style={{ backgroundColor: '#F2E5D9' }}>
                                <Row className='cardBody'>
                                    <Col md='3' sm='12' className='mb-1'>
                                        <div
                                            onClick={() => setNoShowWithCharge(!noShowWithCharge)}
                                            className="hoverUnderline"
                                        >
                                            {/* No Show with 
                                          / without Charges */}
                                            <span style={{ display: 'inline-block' }}>
                                                No Show with Charge <br /> / without Charge
                                            </span>
                                        </div>
                                        {/* <div
                                            onClick={() => setNoShowWithOutCharge(!noShowWithOutCharge)}
                                            className="hoverUnderline"
                                        >
                                            No Show without Charges
                                        </div> */}
                                    </Col>
                                </Row>
                            </Card>
                        </div>

                        {/* Second Section */}
                        <div style={{ flex: 1 }}>
                            <Card style={{ backgroundColor: '#F2E5D9' }}>
                                <Row className='cardBody'>
                                    <Col md='3' sm='12' className='mb-1'>
                                        <div
                                            onClick={() => setRollOver(!rollOver)}
                                            className="hoverUnderline"
                                        >
                                            Roll Over
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            {/* No Show With Charges */}
            {noShowWithCharge && <div>
                <Modal isOpen={noShowWithCharge} toggle={() => setNoShowWithCharge(!noShowWithCharge)} className='modal-xl'>
                    <ModalHeader className='bg-transparent' toggle={() => setNoShowWithCharge(!noShowWithCharge)}></ModalHeader>
                    <ModalBody className='pb-3 px-sm-1 mx-20'>
                        <div>
                            {filldata && filldata.length != 0 && <CancelReservation data1={filldata} isCharge={1} />}
                        </div>
                    </ModalBody>
                </Modal>
            </div>}

            {/* No Show With Out Charges */}
            {noShowWithOutCharge && <div>
                <Modal isOpen={noShowWithOutCharge} toggle={() => setNoShowWithOutCharge(!noShowWithOutCharge)} className='modal-xl'>
                    <ModalHeader className='bg-transparent' toggle={() => setNoShowWithOutCharge(!noShowWithOutCharge)}></ModalHeader>
                    <ModalBody className='pb-3 px-sm-1 mx-20'>
                        <div>
                            {filldata && filldata.length != 0 && <CancelReservation data1={filldata} isCharge={0} />}
                        </div>
                    </ModalBody>
                </Modal>
            </div>}

            {/* Roll Over */}
            {rollOver && <div>
                {console.log(rollOver)}
                <Modal isOpen={rollOver} toggle={() => setRollOver(!rollOver)} className='modal-xm' centered>
                    <ModalHeader className='bg-transparent' toggle={() => setRollOver(!rollOver)}></ModalHeader>

                    <ModalBody className='pb-3 px-sm-1 mx-20'>
                        {rollOver && rollOver.length != 0 && ((rollOver.arrivalDate !== rollOver.departureDate) ? (<div>
                            <div className='text-center mb-2'>

                                <h3>
                                    {rollOver.guestName} ({rollOver.bookingID}) is going to roll over from{' '}
                                    <strong>{format(new Date(rollOver.arrivalDate), 'MMM dd yyyy')}</strong> to{' '}
                                    <strong>{format(new Date(getNextDate(rollOver.arrivalDate)), 'MMM dd yyyy')}</strong>.
                                </h3>
                            </div>
                            <Col>
                                <div className="button-container text-center">
                                    <Button className="me-1" color="primary" type="submit" onClick={() => RollOverApi()} disabled={isRollOverButton} >
                                        Confirm
                                    </Button>
                                    <Button className="me-1" color="danger" onClick={() => setRollOver(false)} >
                                        Cancel
                                    </Button>
                                </div>
                            </Col>
                        </div>
                        ) : (
                            rollOver && rollOver.length !== 0 && (
                                // handleError("Same day you can't make rollover ! put it in no show"),
                                handleError("Rollover cannot be processed for same-day bookings. Please mark it as a no-show."),
                                setRollOver(false)
                            )
                        ))
                        }

                    </ModalBody>
                </Modal>
            </div>}









            {/* Pending Departures */}

            <TabContent className='py-50' activeTab={active}>

                <TabPane tabId='3' style={{ marginTop: '-28px' }}>
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h4">Pending Departure</CardTitle>
                            <Button outline color="primary" onClick={RefreshFunction}>
                                <span style={{ marginRight: '8px' }}>↻</span>
                                Refresh
                            </Button>
                        </CardHeader>
                        <CardBody>
                            <div>
                                <div className="ag-theme-alpine" style={{ height: 450 }}>
                                    <AgGridReact
                                        ref={gridRef2}
                                        rowData={pendingDep} columnDefs={columnDefs2}
                                        animateRows={true} rowSelection='multiple'
                                        onCellClicked={cellClickedDeparture}
                                        //  paginationAutoPageSize='true'
                                        paginationPageSize='10'
                                        pagination='true'
                                        overlayNoRowsTemplate={'No records found'}
                                        defaultColDef={defaultColDef1}
                                        headerColor="ddw-primary"

                                    />
                                </div>
                            </div>
                            <br></br>
                            <div align='end'>
                                <Button className='me-1' color='primary' align='end'
                                    //  onClick={() => { (pendingDep && pendingDep.length === 0) ? setActive('4') : handleError("Complete Existing Process") }}
                                    onClick={() => {
                                        RefreshFunction()

                                        if (pendingDep && pendingDep.length === 0) {
                                            // setActive('4');
                                            setActive('5');
                                            setDisableDeparture(true);
                                            // setDisableUnsettleBillData(false);
                                            setDisableRoomPosting(false);
                                            UpdateEachStep("depaturesNotCheckedOut", 1)


                                        } else {

                                            handleError("Complete Existing Process");
                                        }
                                    }}
                                >
                                    Proceed
                                </Button>
                            </div>
                        </CardBody>

                    </Card>
                </TabPane>
            </TabContent>


            <Modal
                isOpen={pendingDeparture}
                toggle={() => setPendingDeparture(!pendingDeparture)}
                className="modal-dialog-centered"
            >
                <ModalHeader
                    className="modal-sm"
                    toggle={() => {
                        setPendingDeparture(!pendingDeparture);
                    }}
                >
                    Need To Check..
                </ModalHeader>
                <ModalBody>
                    {/* <ActionModal/> */}
                    <div style={{ flex: 1, marginRight: '16px' }}>
                        <Card style={{ backgroundColor: '#F2E5D9' }}>
                            <Row className='cardBody'>
                                <Col md='3' sm='12' className='mb-1'>
                                    <div
                                        onClick={() => { setTimeout(() => { window.open('/dashboard/frontdesk/Billing') }, 400) }}
                                        className="hoverUnderline"
                                    >
                                        Billing
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </div>

                    {/* Second Section */}
                    <div style={{ flex: 1 }}>
                        <Card style={{ backgroundColor: '#F2E5D9' }}>
                            <Row className='cardBody'>
                                <Col md='3' sm='12' className='mb-1'>
                                    <div
                                        onClick={() => setStayModify(!stayModify)}
                                        className="hoverUnderline"
                                    >
                                        Stay Modification
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </ModalBody>
            </Modal>

            {/* Stay Modification */}
            {stayModify && mainResData && <div>
                <Modal isOpen={stayModify} toggle={() => setStayModify(!stayModify)} className='modal-xl'>
                    <ModalHeader className='bg-transparent' toggle={() => setStayModify(!stayModify)}></ModalHeader>
                    <ModalBody className='pb-3 px-sm-1 mx-20'>
                        <div>
                            {filldata && filldata.length != 0 && <StayModification data1={[filldata, mainResData]} data2={0} />}
                        </div>
                    </ModalBody>
                </Modal>
            </div>}


            {/* Room Status Change */}
            <TabContent className='py-50' activeTab={active}>
                <TabPane tabId='7' style={{ marginTop: '-42px' }}>
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h4">Room Status Change</CardTitle>
                            <Button outline color="primary" onClick={RefreshFunction}>
                                <span style={{ marginRight: '8px' }}>↻</span>
                                Refresh
                            </Button>
                        </CardHeader>
                        <CardBody>
                            <div>
                                <div className="ag-theme-alpine" style={{ height: 450 }}>
                                    <AgGridReact
                                        ref={gridRef3}
                                        rowData={roomData} columnDefs={columnDefs3}
                                        animateRows={true} rowSelection='multiple'
                                        onCellClicked={cellClickedRoomStatus}
                                        //  paginationAutoPageSize='true'
                                        paginationPageSize='10'
                                        pagination='true'
                                        overlayNoRowsTemplate={'No records found'}
                                        defaultColDef={defaultColDef3}
                                        headerColor="ddw-primary"

                                    />
                                </div>
                            </div>
                            <br></br>
                            <div align='end'>
                                <Button className='me-1' color='primary' align='end'
                                    //  onClick={() => (roomStatusLength && roomStatusLength !== false ) ? setConfirmRoomStatus(true) : setActive('8')}

                                    onClick={() => {
                                        RefreshFunction()
                                        RefreshGetNightAuditFunction()
                                        if (roomStatusLength && roomStatusLength.length !== false) {
                                            setConfirmRoomStatus(true)
                                            UpdateEachStep("roomStatusCheck", 1)


                                        } else {
                                            // setActive('8');

                                            RoomStatusSubmitOnProceed()
                                            // setActive('9');
                                            setDisableRoomStatus(true);
                                            setDisableReports(false);
                                            // setDisableReservationStatus(false);
                                            //   handleError("Complete Existing Process");
                                        }
                                    }}
                                >
                                    Proceed
                                </Button>
                            </div>
                        </CardBody>

                    </Card>
                </TabPane>


            </TabContent>
            {/* For Room Status Confirmation */}
            <Modal isOpen={confirmRoomStatus} toggle={() => setConfirmRoomStatus(!confirmRoomStatus)} className='modal-dialog-centered'>
                <ModalHeader className='bg-transparent' toggle={() => setConfirmRoomStatus(!confirmRoomStatus)}></ModalHeader>
                <ModalBody className='px-5 pb-2'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>Confirm with new Status?</h1>
                        {/* <p>you want to submit this form ? </p> */}
                    </div>
                    <Col>
                        <div className="button-container text-center">
                            <Button className="me-1" color="primary" type="submit" onClick={RoomStatusSubmit} disabled={isRoomStatusButton}>
                                Confirm
                            </Button>
                            <Button className="me-1" color="danger" onClick={() => setConfirmRoomStatus(false)} >
                                Cancel
                            </Button>
                        </div>
                    </Col>
                </ModalBody>

            </Modal>







            {/* Fixed Charge Posting */}
            <TabContent className='py-50' activeTab={active}>

                <TabPane tabId='6' style={{ marginTop: '-56px' }}>
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h4">Fixed Charge Posting</CardTitle>
                            <Button outline color="primary" onClick={RefreshFunction}>
                                <span style={{ marginRight: '8px' }}>↻</span>
                                Refresh
                            </Button>
                        </CardHeader>
                        <CardBody>
                            <div>
                                <div className="ag-theme-alpine" style={{ height: 450 }}>
                                    <AgGridReact
                                        ref={gridRef4}
                                        rowData={fixedCharge} columnDefs={columnDefs4}
                                        animateRows={true} rowSelection='multiple'
                                        onCellClicked={cellClickedFixedChargePosting}
                                        //  paginationAutoPageSize='true'
                                        paginationPageSize='10'
                                        pagination='true'
                                        overlayNoRowsTemplate={'No records found'}
                                        defaultColDef={defaultColDef4}
                                        headerColor="ddw-primary"

                                    />
                                </div>
                            </div>
                            <br></br>
                            <div align='end'>
                                <Button className='me-1' color='primary' align='end'
                                    // onClick={() => fixedCharge && fixedCharge.length === 0 ? setActive('7') : setConfirmFixedChargePosting(true)}

                                    onClick={() => {
                                        RefreshFunction()
                                        RefreshGetNightAuditFunction()
                                        if (fixedCharge && fixedCharge.length === 0) {
                                            setActive('7');
                                            setDisableFixedPosting(true);
                                            setDisableRoomStatus(false);
                                            UpdateEachStep("fixedChargePostingCheck", 1)
                                        } else {
                                            //   handleError("Complete Existing Process");
                                            setConfirmFixedChargePosting(true)
                                        }
                                    }}
                                >
                                    Proceed
                                </Button>
                            </div>
                        </CardBody>

                    </Card>
                </TabPane>

            </TabContent>

            {/* For Fixed Charge Confirmation */}
            <Modal isOpen={confirmFixedChargePosting} toggle={() => setConfirmFixedChargePosting(!confirmFixedChargePosting)} className='modal-dialog-centered'>
                <ModalHeader className='bg-transparent' toggle={() => setConfirmFixedChargePosting(!confirmFixedChargePosting)}></ModalHeader>
                <ModalBody className='px-5 pb-2'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>Confirm With Fixed Charge Posting?</h1>
                        {/* <p>you want to submit this form ? </p> */}
                    </div>
                    <Col>
                        <div className="button-container text-center">
                            <Button className="me-1" color="primary" type="submit" onClick={FixedChargesPosting} disabled={isFixedChargePostingButton} >
                                Confirm
                            </Button>
                            <Button className="me-1" color="danger" onClick={() => setConfirmFixedChargePosting(false)} >
                                Cancel
                            </Button>
                        </div>
                    </Col>
                </ModalBody>

            </Modal>





            {/* Room Posting */}
            <TabContent className='py-50' activeTab={active}>

                <TabPane tabId='5' style={{ marginTop: '-70px' }}>
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h4">Room Posting </CardTitle> <h4> {Today !== undefined && shouldApplyRowStyle === false && format(new Date(Today), "dd-MM-yyyy")}</h4>
                            <Button outline color="primary" onClick={RefreshFunction}>
                                <span style={{ marginRight: '8px' }}>↻</span>
                                Refresh
                            </Button>
                        </CardHeader>
                        <CardBody>
                            <div>
                                {shouldApplyRowStyle === true &&
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '-10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                                            <span style={{ marginRight: '10px', color: 'red' }}>■</span> {/* Red square */}
                                            <span style={{ color: 'red' }}>Not Posted</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '10px', color: 'green' }}>■</span> {/* Green square */}
                                            <span style={{ color: 'green' }}>Posted</span>
                                        </div>
                                        <div style={{ textAlign: 'center', fontSize: '1.5rem', color: 'black', paddingLeft: '7%' }}>
                                            {
                                                Today !== undefined && (
                                                    <div>
                                                        Please verify if there are any pending room postings for the date : {' '}
                                                        {(() => {
                                                            let formattedDate = new Date(Today).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                month: 'short',
                                                                day: '2-digit',
                                                                year: 'numeric'
                                                            });
                                                            // return format(new Date(formattedDate), 'EE dd MMM yy');
                                                            return (
                                                                <span style={{ color: 'blue' }}>{formattedDate}</span>

                                                            );
                                                        })()}
                                                    </div>
                                                )
                                            }

                                        </div>

                                    </div>

                                }



                                <div className="ag-theme-alpine" style={{ height: 450 }}>
                                    <AgGridReact
                                        ref={gridRef5}
                                        // rowData={roomPosting} 

                                        rowData={condition ? roomPosting : roomPostingCheck}
                                        columnDefs={columnDefs5}
                                        animateRows={true} rowSelection='multiple'
                                        onCellClicked={cellClickedRoomPosting}
                                        //  paginationAutoPageSize='true'
                                        paginationPageSize='10'
                                        pagination='true'
                                        overlayNoRowsTemplate={'No records found'}
                                        defaultColDef={defaultColDef5}
                                        headerColor="ddw-primary"
                                        getRowStyle={getRowStyle} // Apply custom row styling


                                    />
                                </div>
                            </div>
                            <br></br>
                            <div align='end'>
                                {console.log(shouldApplyRowStyle)}
                                {shouldApplyRowStyle === false &&
                                    <Button className='me-1' color='primary' align='end'
                                        //  onClick={() => setConfirmRoomPosting(true)}
                                        onClick={() => {
                                            RefreshFunction()
                                            RefreshGetNightAuditFunction()
                                            if (roomPosting && roomPosting.length === 0) {
                                                console.log("1 - if")
                                                ConfirmRoomPostingLast()
                                                // setConfirmRoomPostingLastStep(true)
                                                // setActive('6');
                                                // setDisableRoomPosting(true);
                                                // setDisableFixedPosting(false);
                                            } else {
                                                console.log("1 - else")

                                                //   handleError("Complete Existing Process");
                                                setConfirmRoomPosting(true)
                                                // setConfirmRoomPostingLastStep(true)

                                            }
                                        }}
                                    >

                                        Proceed
                                    </Button>}
                                {shouldApplyRowStyle === true &&
                                    <Button className='me-1' color='primary' align='end'
                                        //  onClick={() => setConfirmRoomPosting(true)}
                                        onClick={() => {
                                            // if (roomPosting && roomPosting.length === 0) {
                                            //     console.log("2 - if")
                                            setConfirmRoomPostingLastStep(true)
                                            UpdateEachStep("postingRoomAndTax", 1)

                                            // } else {
                                            //     console.log("2 - else")

                                            // setConfirmRoomPosting(true)
                                            // setConfirmRoomPostingLastStep(true)


                                            // }
                                        }}
                                    >

                                        Proceed
                                    </Button>}
                            </div>
                        </CardBody>

                    </Card>
                </TabPane>




                {/* Un-Settle Bills */}
                <TabContent className='py-50' activeTab={active}>

                    <TabPane tabId='4' style={{ marginTop: '-77px' }}>
                        <Card>
                            <CardHeader>
                                {/* <CardTitle tag="h4">Un-Settled Bills</CardTitle> */}
                                <CardTitle tag="h4">POS Unsettled Bills</CardTitle>
                                <Button outline color="primary" onClick={RefreshFunction}>
                                    <span style={{ marginRight: '8px' }}>↻</span>
                                    Refresh
                                </Button>
                                {/* <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'black', paddingLeft: '10%' }}>
                                            Please verify if there are any pending room postings for the date :- {Today !== undefined && format(new Date(Today), 'E MMM dd yyyy')}
                                        </div> */}
                            </CardHeader>
                            <CardBody>
                                <div>
                                    <div className="ag-theme-alpine" style={{ height: 450 }}>
                                        <AgGridReact
                                            ref={gridRef6}
                                            rowData={unSettleBills} columnDefs={columnDefs6}
                                            animateRows={true} rowSelection='multiple'
                                            onCellClicked={cellClickedUnSettleBills}
                                            //  paginationAutoPageSize='true'
                                            paginationPageSize='10'
                                            pagination='true'
                                            overlayNoRowsTemplate={'No records found'}
                                            defaultColDef={defaultColDef6}
                                            headerColor="ddw-primary"

                                        />
                                    </div>
                                </div>
                                <br></br>
                                <div align='end'>
                                    <Button className='me-1' color='primary' align='end'
                                        // onClick={() => { (unSettleBills !== undefined && unSettleBills.length === 0) ? setActive('5') : handleError("Complete Existing Process") }}
                                        onClick={() => {
                                            if (unSettleBills !== undefined && unSettleBills.length === 0) {
                                                // setActive('5');
                                                setActive('1');
                                                setDisableCountry(false)

                                                setDisableUnsettleBillData(true);
                                                UpdateEachStep("unSettleBills", 1)
                                                // setDisableRoomPosting(false);
                                            } else {
                                                handleError("Complete Existing Process");
                                            }
                                        }}
                                    >
                                        Proceed
                                    </Button>
                                </div>
                            </CardBody>

                        </Card>
                    </TabPane>
                </TabContent>



            </TabContent>

            {/* For Room Posting Confirmation */}
            <Modal isOpen={confirmRoomPosting} toggle={() => setConfirmRoomPosting(!confirmRoomPosting)} className='modal-dialog-centered'>
                <ModalHeader className='bg-transparent' toggle={() => setConfirmRoomPosting(!confirmRoomPosting)}></ModalHeader>
                <ModalBody className='px-5 pb-2'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>Confirm With Room Posting?</h1>
                        {/* <p>you want to submit this form ? </p> */}
                    </div>
                    <Col>
                        <div className="button-container text-center">
                            <Button className="me-1" color="primary" type="submit" onClick={ConfirmRoomPosting} disabled={isRoomPostingButton}>
                                Confirm
                            </Button>
                            <Button className="me-1" color="danger" onClick={() => setConfirmRoomPosting(false)} >
                                Cancel
                            </Button>
                        </div>
                    </Col>
                </ModalBody>

            </Modal>

            <Modal isOpen={confirmRoomPostingLastStep} toggle={() => setConfirmRoomPostingLastStep(!confirmRoomPostingLastStep)} className='modal-dialog-centered'>
                <ModalHeader className='bg-transparent' toggle={() => setConfirmRoomPostingLastStep(!confirmRoomPostingLastStep)}></ModalHeader>
                <ModalBody className='px-5 pb-2'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>Continue to next step?</h1>
                        {/* <p>you want to submit this form ? </p> */}
                    </div>
                    <Col>
                        <div className="button-container text-center">
                            <Button className="me-1" color="primary" type="submit" onClick={() => {

                                setActive('6')
                                setDisableRoomPosting(true)
                                setDisableFixedPosting(false)
                                setConfirmRoomPostingLastStep(false)
                                CheckPendingSteps('postingRoomAndTax')

                            }} >
                                Confirm
                            </Button>
                            <Button className="me-1" color="danger" onClick={() => setConfirmRoomPostingLastStep(false)} >
                                Cancel
                            </Button>
                        </div>
                    </Col>
                </ModalBody>

            </Modal>



            {/* For Error Message */}
            {popUp &&
                <div className='disabled-animation-modal'>
                    <Modal isOpen={popUp} toggle={() => setPopUp(!popUp)} className='modal-sm'  >   {/*onClosed={onDiscard}*/}
                        <ModalHeader className='modal-sm' toggle={() => {
                            setPopUp(!popUp)
                        }}>Need To Check..</ModalHeader>
                        <ModalBody className='pb-3 px-sm-2 mx-20'>
                            <div>
                                <b>{popUp}</b>
                                <br></br>
                                <br></br>
                                <Button color="primary" className='text-center' onClick={() => setPopUp(false)} >
                                    Ok
                                </Button>
                            </div>
                        </ModalBody>
                    </Modal>

                </div>
            }


            <TabContent className='py-50' activeTab={active}>
                <TabPane tabId='9' style={{ marginTop: '-120px' }}>
                    <div className="bg-white min-vh-100 d-flex justify-content-center align-items-center" style={{ marginTop: '-160px' }}>

                        <Card className="w-50 text-center p-4 shadow-lg rounded">
                            <CardBody>
                                <h4 >Report generation process</h4>
                                <div>
                                    <Button color="primary" onClick={generateReports} disabled={isGenerateReportButton}>
                                        Generate reports
                                    </Button>{' '}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </TabPane>
            </TabContent>



            <TabContent className='py-50' activeTab={active}>
                <TabPane tabId='8'>
                    <Card>
                        {/* <CardHeader>
                            <CardTitle tag="h4">Night Audit Status</CardTitle>
                        </CardHeader> */}
                        <CardBody>
                            {Today !== undefined && showCard === true && <TableWith8Columns data={Today} />}
                            <br></br>

                        </CardBody>

                    </Card>
                </TabPane>
            </TabContent>
        </React.Fragment>
    )
}
export default PillFilled