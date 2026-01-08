import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import DASHBOARD_URL from '../../../../dashboard'
import { Row, Col, Form, Button, Label, InputGroup, InputGroupText, Input, Modal, ModalBody, ModalHeader, Card, CardHeader, CardBody, Accordion, AccordionBody, AccordionItem, AccordionHeader } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import classnames from 'classnames'

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import Moment from 'moment'
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const BarChart = () => {

    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [data4, setData4] = useState([]);
    const { reset1, handleSubmit, control, watch, setValue } = useForm({})
    const [open, setOpen] = useState([]);
    const [arrivalDate, setArrivalDate] = useState();


    const toggle = id => {
        setOpen(prevOpen => {
            if (prevOpen.includes(id)) {
                return prevOpen.filter(item => item !== id);
            } else {
                return [...prevOpen, id];
            }
        });

    };


    const checkIn = watch('incomeDate');


    // Function to destroy a chart by its ID
    const destroyChart = chartId => {
        const chart = Chart.getChart(chartId);
        if (chart) {
            chart.destroy();
        }
    };


    // error handling
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


    //On submit function
    const onSubmit = data => {
        console.log(data.incomeDate, data.outGoData)
        if (data.incomeDate === undefined) {
            return handleError("Please select the from date")
        }
        if (data.outGoData === undefined) {
            return handleError("Please select the to date")
        }
        if ((Moment(String(new Date(data.departure))).format('YYYY-MM-DD')) < (Moment(String(new Date(data.coming))).format('YYYY-MM-DD'))) {
            return handleError("Please select the to date")
        }
        let fromDate = (Moment(String(new Date(data.incomeDate))).format('YYYY-MM-DD'))
        let toDate = (Moment(String(new Date(data.outGoData))).format('YYYY-MM-DD'))

        // Destroy existing charts before creating new ones
        destroyChart("barChart");
        destroyChart("barChart1");
        destroyChart("barChart2");
        destroyChart("barChart3");
        destroyChart("barChart4");
        fetchData(fromDate, toDate);
    }


    //Flatpickr condition for departure date
    const optionsToDate = {
        minDate: (checkIn === null ? arrivalDate : (Moment(String(new Date(checkIn))).format('YYYY-MM-DD'))) // Set the minimum date as fromDate or today if fromDate is not selected
    };


    useEffect(() => {
        const hotelID = JSON.stringify({
            hotelID: 1
        })
        fetchx(DASHBOARD_URL + "/getBusinessDate", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: hotelID
        }).then((res) => res.json())
            .then(postres => {
                const today = new Date(postres['data'][0]['businessDate']);
                const tomorrow = new Date(today);
                const Yesterday = new Date(today);
                Yesterday.setDate(today.getDate() - 1);
                tomorrow.setDate(today.getDate() + 1);
                setArrivalDate((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
            })

        fetchData();
    }, []);


    const fetchData = (startDate, endDate) => {

        destroyChart("barChart");
        destroyChart("barChart1");
        destroyChart("barChart2");
        destroyChart("barChart3");
        destroyChart("barChart4");

        fetch(DASHBOARD_URL + `/getTopTenComplaintList?startDate=${startDate}&endDate=${endDate}`)
            .then((response) => response.json())
            .then((data) => {
                const processedData = processData(data.data);
                setData(processedData);
                createChart(processedData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        fetch(DASHBOARD_URL + `/getAllComplaintStatus?startDate=${startDate}&endDate=${endDate}`)
            .then((response) => response.json())
            .then((data) => {
                const processedData = processData1(data.data);
                setData1(processedData);
                createChart1(processedData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        fetch(DASHBOARD_URL + `/getAllComplaintSourceWise?startDate=${startDate}&endDate=${endDate}`)
            .then((response) => response.json())
            .then((data) => {
                const processedData = processData2(data.data);
                setData2(processedData);
                createChart2(processedData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        fetch(DASHBOARD_URL + `/getAllComplaintBasedOnRecovery?startDate=${startDate}&endDate=${endDate}`)
            .then((response) => response.json())
            .then((data) => {
                const processedData = processData3(data.data);
                setData3(processedData);
                createChart3(processedData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });


        fetch(DASHBOARD_URL + `/getAllComplaintBasedOnDepartment?startDate=${startDate}&endDate=${endDate}`)
            .then((response) => response.json())
            .then((data) => {
                const processedData = processData4(data.data);
                setData4(processedData);
                createChart4(processedData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };


    const processData = (data) => {
        // Process data as needed to extract labels and values
        const labels = data.map((item) => item.complaint);
        const values = data.map((item) => item.occurrence);
        return { labels, values };
    };


    const processData1 = (data) => {
        // Process data as needed to extract labels and values
        const labels = data.map((item) => item.compalintStatus);
        const values = data.map((item) => item.occurrence);
        return { labels, values };
    };


    const processData2 = (data) => {
        // Process data as needed to extract labels and values
        const labels = data.map((item) => item.sourceName);
        const values = data.map((item) => item.occurrence);
        return { labels, values };
    };


    const processData3 = (data) => {
        // Process data as needed to extract labels and values
        const labels = data.map((item) => item.action);
        const values = data.map((item) => item.occurrence);
        return { labels, values };
    };


    const processData4 = (data) => {
        // Process data as needed to extract labels and values
        const labels = data.map((item) => item.departmentName);
        const values = data.map((item) => item.occurrence);
        return { labels, values };
    };


    // Inside createChart functions, remove hardcoded height and width settings
    const createChart = ({ labels, values }) => {
        const ctx = document.getElementById("barChart");

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Occurrence",
                        data: values,
                        backgroundColor: "#4472c4",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true, // Make the chart responsive
                maintainAspectRatio: false, // Disable aspect ratio so that fixed dimensions are used
                plugins: {
                    title: {
                        display: true,
                        text: "Top 10 Complaints",
                        font: {
                            size: 16,
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Occurrence",
                        },
                    },
                    x: {
                        title: {
                            display: true,
                        },
                    },
                },
            },
        });
    };


    const createChart1 = ({ labels, values }) => {
        const ctx = document.getElementById("barChart1");

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Occurance",
                        data: values,
                        backgroundColor: "#4472c4",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true, // Make the chart responsive
                maintainAspectRatio: false, // Disable aspect ratio so that fixed dimensions are used
                plugins: {
                    title: {
                        display: true,
                        text: "YTD Complaint Status", // Title text
                        font: {
                            size: 16, // Adjust title font size
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Occurance",
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            // text: "Status",
                        },
                    },
                },
            },
        });
    };


    const createChart2 = ({ labels, values }) => {
        const ctx = document.getElementById("barChart2");

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Occurance",
                        data: values,
                        backgroundColor: "#4472c4",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true, // Make the chart responsive
                maintainAspectRatio: false, // Disable aspect ratio so that fixed dimensions are used
                plugins: {
                    title: {
                        display: true,
                        text: "YTD Source", // Title text
                        font: {
                            size: 16, // Adjust title font size
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Occurance",
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            // text: "sourceName",
                        },
                    },
                },
            },
        });
    };


    const createChart3 = ({ labels, values }) => {
        const ctx = document.getElementById("barChart3");

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Occurance",
                        data: values,
                        backgroundColor: "#4472c4",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true, // Make the chart responsive
                maintainAspectRatio: false, // Disable aspect ratio so that fixed dimensions are used
                plugins: {
                    title: {
                        display: true,
                        text: "YTD Serive Recovery", // Title text
                        font: {
                            size: 16, // Adjust title font size
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Occurance",
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            // text: "sourceName",
                        },
                    },
                },
            },
        });
    };


    const createChart4 = ({ labels, values }) => {
        const ctx = document.getElementById("barChart4");

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Occurance",
                        data: values,
                        backgroundColor: "#4472c4",
                        borderColor: "#4472c4",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true, // Make the chart responsive
                maintainAspectRatio: false, // Disable aspect ratio so that fixed dimensions are used
                plugins: {
                    title: {
                        display: true,
                        text: "YTD Department Wise Complaints", // Title text
                        font: {
                            size: 16, // Adjust title font size
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Occurance",
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            // text: "departmentName",
                        },
                    },
                },
            },
        });
    };


    const resetData = () => {
        destroyChart("barChart");
        destroyChart("barChart1");
        destroyChart("barChart2");
        destroyChart("barChart3");
        destroyChart("barChart4");
        fetchData();
        setValue('incomeDate', null)
        setValue('outGoData', null)
    }


    return (

        <div>
            <div>
                <Card>
                    <Accordion open={open} toggle={toggle}>
                        <AccordionItem>
                            <AccordionHeader
                                targetId="1"
                            >
                                <h4><b> Select Dates </b></h4>
                            </AccordionHeader>
                            <AccordionBody accordionId="1">
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col md='4' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='incomeDate'>
                                                    From Date <spam style={{ color: 'red' }}>*</spam>
                                                </Label>
                                                <Controller
                                                    control={control}
                                                    id='incomeDate'
                                                    name='incomeDate'
                                                    render={({ field }) => (
                                                        <Flatpickr
                                                            required
                                                            {...field}
                                                            // options={options1}
                                                            placeholder='YYYY-MM-DD '
                                                            className={classnames('form-control')}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>
                                        <Col md='4' sm='12'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='outGoData'>
                                                    To Date <spam style={{ color: 'red' }}>*</spam>
                                                </Label>
                                                <Controller
                                                    control={control}
                                                    id='outGoData'
                                                    name='outGoData'
                                                    render={({ field }) => (
                                                        <Flatpickr
                                                            required
                                                            {...field}
                                                            options={optionsToDate}
                                                            placeholder='YYYY-MM-DD '
                                                            className={classnames('form-control', {
                                                                'is-invalid': data !== null && data.outGoData === null
                                                            })}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <div align='end'>
                                        <Button outline color='secondary' className='me-1' onClick={resetData}>
                                            Reset
                                        </Button>
                                        <Button color='primary' className='me-1' type='submit'>
                                            Submit
                                        </Button>
                                    </div>
                                </Form>
                            </AccordionBody>
                        </AccordionItem>
                    </Accordion>
                </Card>
            </div>


            <Card>

                <Row>
                    <Col md='6' sm='12'>

                        <div style={{ width: "100%", height: "400px", padding: "20px" }}>
                            <canvas id="barChart"></canvas>
                        </div>

                        {/* <div style={{ width: "100%", float: "left", padding: "20px" }}> 
                            <canvas id="barChart" style={{ height: "300px" }}></canvas> 
                        </div> */}
                    </Col>
                    <Col md='6' sm='12'>
                        <div style={{ width: "100%", height: "400px", float: "left", padding: "10px" }}> {/* Adjust width, float, and padding */}
                            <canvas id="barChart4" style={{ height: "400px" }}></canvas> {/* Adjust height */}
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col md='4' sm='12'>
                        <div style={{ width: "100%", height: "400px", float: "left", padding: "20px" }}> {/* Adjust width, float, and padding */}
                            <canvas id="barChart1" style={{ height: "300px" }}></canvas> {/* Adjust height */}
                        </div>
                    </Col>
                    <Col md='4' sm='12'>
                        <div style={{ width: "100%", float: "left", padding: "10px" }}> {/* Adjust width, float, and padding */}
                            <canvas id="barChart2" style={{ height: "400px" }}></canvas> {/* Adjust height */}
                        </div>
                    </Col>
                    <Col md='4' sm='12'>
                        <div style={{ width: "100%", float: "left", padding: "10px" }}> {/* Adjust width, float, and padding */}
                            <canvas id="barChart3" style={{ height: "400px" }}></canvas> {/* Adjust height */}
                        </div>
                    </Col>
                </Row>

            </Card>
        </div>

    );
};

export default BarChart;
