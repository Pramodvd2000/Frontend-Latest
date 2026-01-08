import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useForm, Controller } from "react-hook-form";

import API_URL from '../../../config'

// ** Reactstrap Imports
import { Col, Label, Input, Row, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

// import 'ag-grid-enterprise'
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { DateTime } from 'luxon';
import Moment from "moment";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";

import { format } from "date-fns";
import FeedBackShow from './feedbackShow';
const InventoryLogs = (data) => {

    const gridRef = useRef();
    const [logData, setLogData] = useState(false);
    const [Today, setToday] = useState()
    const [filldata, setfilldata] = useState()
    const [openFeedBackShow, setOpenFeedBackShow] = useState()


    const {
        reset,
        handleSubmit,
        control,
        formState: { errors },
        watch
    } = useForm({});
    // get modification log data
    useEffect(() => {
        const reservationData = JSON.stringify({
            //   reservationID: data.data.id
        })


        fetchx(API_URL + '/getReservationWithFeedBack',)
            .then((res) => res.json())
            .then(postres => {
                setLogData(postres['data'])
            }).catch((err) => {
                console.log(err)
            })

    }, []);


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

    const formatToIST = (dateString) => {
        if (dateString) {
            const date = DateTime.fromISO(dateString, { zone: 'utc' });
            const istDate = date.setZone('Asia/Kolkata');
            return istDate.toFormat('dd-MM-yyyy HH:mm:ss');
        }
        return 'No date available';
    };

    // Ag-grid options
    const gridOptions = {
        defaultColDef: {
            cellStyle: { whiteSpace: 'normal' }, // Allow text wrapping
            autoHeight: true, // Allow the cell to expand vertically
        },
    };


    const fromDate = watch('fromDate');
    const toDate = watch('toDate');
    const options = {
        minDate: Today
    };
    const optionsToDate = {
        minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
    };



    // Function to format date
    function formatDate(date) {
        const dateString = date.toString();

        // Check if the date string matches the format "MMM YYYY"
        const isMonthYearFormat = dateString.match(/^\w{3} \d{4}$/);

        if (isMonthYearFormat) {
            return dateString; // Return the date as is
        } else {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        }
    }


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


  

    
    useEffect(() => {
        
        // Call the function whenever both fromDate and toDate are filled
        if (fromDate !== undefined && toDate !== undefined) {
            if (Array.isArray(fromDate) && Array.isArray(toDate) &&
                fromDate.length !== 0 && toDate.length !== 0 &&
                fromDate[0] !== '' && toDate[0] !== '') {

                let fromDateFormat = fromDate !== '' ? format(new Date(fromDate), 'yyyy-MM-dd') : '';
                let toDateFormat = toDate !== '' ? format(new Date(toDate), 'yyyy-MM-dd') : '';
                fetch(API_URL + "/getReservationWithFeedBack?fromDate=" + fromDateFormat + "&toDate=" + toDateFormat)
                    .then((result) => result.json())
                    .then((rowData) => {
                        setLogData(rowData["data"]);
                        // console.log(rowData)
                    });
            }
            else {
                fetch(API_URL + "/getReservationWithFeedBack")
                    .then((result) => result.json())
                    .then((rowData) => {
                        setLogData(rowData["data"]);
                        // console.log(rowData)
                    });
            }
        }
    }, [fromDate, toDate]);




    //AG-GRID columns to show daily details
    const [columnDefs1, setColumnDefs1] = useState([

        { headerName: 'B ID', field: 'bookingID', width: 90 },
        { headerName: 'Guest', field: 'guestName', width: 160 },
        {
            headerName: "Comp/Agent",
            field: "accountName",
            suppressSizeToFit: true,
            maxWidth: 160,
        },
        {
            headerName: "Arrival",
            field: "arrivalDate",
            suppressSizeToFit: true,
            maxWidth: 120,
            cellRenderer: (params) => {
                if (params.data && params.data.arrivalDate) {
                    const formattedDate = format(new Date(params.data.arrivalDate), 'dd MMM yy');
                    return formattedDate;
                } else {
                    return "";
                }
            }
        },
        {
            headerName: "Departure",
            field: "departureDate",
            suppressSizeToFit: true,
            maxWidth: 120,
            cellRenderer: (params) => {
                if (params.data && params.data.departureDate) {
                    const formattedDate = format(new Date(params.data.departureDate), 'dd MMM yy');
                    return formattedDate;
                } else {
                    return "";
                }
            }
        },
        { headerName: 'Room', field: 'roomNumber', width: 110 },
        { headerName: 'Room Type', field: 'roomType', width: 130 },
        { headerName: 'Status', field: 'reservationStatus', width: 130 },
        {
            headerName: "Actions",
            cellRendererFramework: (params) => (
              <Button
                color=""
                style={{  backgroundColor:"#22F18B", color:"black" }}
                onClick={async () => {
                  try {
                    // Fetch data based on reservationID
                    const reservationID = params.data.id;
                    const response = await fetch(API_URL + `/getReservationForFrontDeskByResID?reservationID=${reservationID}`);
                    const rowData = await response.json();
      
                    // Update state with fetched data
      
                    setfilldata(rowData.data[0]);
      
                    // Toggle options after data is fetched
                    setOpenFeedBackShow(!openFeedBackShow);
                    CallAlerts(rowData.data[0])
                    // Store reservation ID in sessionStorage
                    sessionStorage.setItem('reser_ID', reservationID);
                  } catch (error) {
                    console.error("Error fetching reservation data:", error);
                  }
                }}
              >
                View Feedback
              </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            maxWidth: 180
          },
        { headerName: 'Grp ID', field: 'blockCodeID', width: 130 },


    ])


    // On search element
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById("filter-text-box").value
        );
    }, []);


    const customStyles = `
    .vertical-center {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    `;

    // Function to format date with time
    function formatDates(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const period = (hour >= 12) ? 'PM' : 'AM';

        const formattedTime = `${(hour % 12) || 12}:${minute} ${period}`;
        return `${day}.${month}.${year} ${formattedTime}`;
    }


    return (
        <div>
            <div>
                <h3>
                    Feedback
                </h3>
                <br></br>
                <div>
                    <Row>
                        <Col md="3" sm="12" className="mb-1">
                            <Label className="form-label" for="fullName">
                                Search
                            </Label>
                            <Input
                                type="text"
                                id="filter-text-box"
                                placeholder="Filter..."
                                onInput={onFilterTextBoxChanged}
                            />
                        </Col>
                        <Col md='2' sm='12' className='mb-1'>
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
                                            // required
                                            options={options}
                                            placeholder='YYYY-MM-DD'
                                            {...field}
                                            className='form-control'

                                        />
                                    )}
                                />
                            </div>
                        </Col>
                        <Col md='2' sm='12' className='mb-1'>
                            <div className='mb-1'>
                                <Label className='form-label' for='toDate'>
                                    To Date
                                </Label>
                                <Controller
                                    control={control}
                                    id='toDate'
                                    name='toDate'
                                    render={({ field }) => (
                                        <Flatpickr
                                            placeholder='YYYY-MM-DD'
                                            {...field}
                                            options={optionsToDate}
                                            // options={{ allowInput: true }}
                                            className='form-control'

                                        />
                                    )}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>


      
                <div className="ag-theme-alpine" style={{ height: '693px', width: '100%' }}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={logData}
                        columnDefs={columnDefs1}
                        animateRows={true}
                        defaultColDef={defaultColDef}
                        rowSelection='multiple'
                        pagination={true}
                        paginationPageSize='10'
                        gridOptions={gridOptions}
                        headerColor="ddw-primary"
                    />
                </div>
                <br />
            </div>
            <div>
            <Modal isOpen={openFeedBackShow} toggle={() => setOpenFeedBackShow(!openFeedBackShow)} className="modal-xl"  >
          <ModalHeader className="modal-xl" toggle={() => setOpenFeedBackShow(!openFeedBackShow)} >
            Feedback
          </ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
           {filldata &&  <FeedBackShow data1={filldata} />}
          </ModalBody>
        </Modal>
        </div>
        </div>
    )
}


export default InventoryLogs 