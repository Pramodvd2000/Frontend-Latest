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

const BarChart = ({Date}) => {
console.log(Date)
    const [data, setData] = useState([]);
    const { reset1, handleSubmit, control, watch, setValue } = useForm({})

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


    useEffect(() => {
        if(Date!=undefined){
            fetchData();
        }
        
    }, []);


    const fetchData = (startDate, endDate) => {

        destroyChart("barChart");

        fetch(DASHBOARD_URL + `/getTopTenComplaintList?startDate=${Date}&endDate=${Date}`)
            .then((response) => response.json())
            .then((data) => {
                const processedData = processData(data.data);
                setData(processedData);
                createChart(processedData);
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



    return (

        <div>


            <Card>

                <Row>
                    <Col md='12' sm='12'>
                        <div style={{ width: '100%', height: "50vh", padding: "5px" }}>
                            <canvas id="barChart"></canvas>
                        </div>
                    </Col>
                </Row>

            </Card>
        </div>

    );
};

export default BarChart;
