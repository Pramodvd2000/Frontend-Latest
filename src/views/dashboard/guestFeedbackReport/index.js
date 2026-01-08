import React, { useState, useEffect } from "react";
import { AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalHeader, ModalBody, Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, Accordion, UncontrolledAccordion } from 'reactstrap'
import DASHBOARD_URL from '../../../dashboard'

import GaugeChart from "react-gauge-chart";
import "./Chart1.css"; // Import custom CSS file for styling


const GuestFeedback = () => {

    const [open, setOpen] = useState(['1', '2', '3', '4', '5', '6']);
    const [needleValue, setNeedleValue] = useState(); // Example needle value (60%)
    const [rowData, setRowData] = useState();
    const [rowData1, setRowData1] = useState();
    const [rowData2, setRowData2] = useState();
    const [rowData3, setRowData3] = useState();
    const [rowData4, setRowData4] = useState();
    const [rowData5, setRowData5] = useState();
    const [rowData6, setRowData6] = useState();
    const [rowData7, setRowData7] = useState();
    const [rowData8, setRowData8] = useState();
    const [rowData9, setRowData9] = useState();
    const [rowData10, setRowData10] = useState();
    const [rowData11, setRowData11] = useState();
    const [rowData12, setRowData12] = useState();
    const [rowData13, setRowData13] = useState();
    const [rowData14, setRowData14] = useState();
    const [rowData15, setRowData15] = useState();
    const [rowData16, setRowData16] = useState();
    const [rowData17, setRowData17] = useState();
    const [rowData18, setRowData18] = useState();


    const toggle = id => {
        setOpen(prevOpen => {
            if (prevOpen.includes(id)) {
                return prevOpen.filter(item => item !== id);
            } else {
                return [...prevOpen, id];
            }
        });
    };


    useEffect(() => {
        fetchx(DASHBOARD_URL + "/getReportForOSAT")
            .then((result) => result.json())
            .then((rowData) => {
                setNeedleValue(rowData["data"]);
            });
        fetch(DASHBOARD_URL + "/getReportForFOA")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForFOD")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData1(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForFOTOE")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData2(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForRoomCondition")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData3(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForRoomClean")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData4(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForBathroomCondition")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData5(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForBathroomClean")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData6(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForInternet")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData7(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForSafety")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData8(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForBreakfastfFood")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData9(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForBreakfastfService")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData10(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForLunch")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData11(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForDinner")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData12(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForIRD")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData13(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForBarFood")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData14(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForBarPrice")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData15(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForBarService")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData16(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForOverAllBar")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData17(rowData["data"]);
            });

        fetch(DASHBOARD_URL + "/getReportForOverAllFB")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData18(rowData["data"]);
            });
    }, [])

    const needlePercent = needleValue / 100;
    const needlePercent1 = rowData / 100;
    const needlePercent2 = rowData1 / 100;
    const needlePercent3 = rowData2 / 100;
    const needlePercent4 = (needlePercent1 + needlePercent2 + needlePercent3) / 3
    const needlePercent5 = rowData3 / 100;
    const needlePercent6 = rowData4 / 100;
    const needlePercent7 = rowData5 / 100;
    const needlePercent8 = rowData6 / 100;
    const needlePercent9 = rowData7 / 100;
    const needlePercent10 = rowData8 / 100;
    const needlePercent11 = (needlePercent5 + needlePercent6 + needlePercent7 + needlePercent8) / 4
    const needlePercent12 = rowData9 / 100;
    const needlePercent13 = rowData10 / 100;
    const needlePercent14 = rowData11 / 100;
    const needlePercent15 = rowData12 / 100;
    const needlePercent16 = rowData13 / 100;
    const needlePercent17 = rowData14 / 100;
    const needlePercent18 = rowData15 / 100;
    const needlePercent19 = rowData16 / 100;
    const needlePercent20 = (needlePercent12 + needlePercent13) / 2
    const needlePercent21 = rowData17 / 100
    const needlePercent22 = rowData18 / 100

    const [tooltipData, setTooltipData] = useState(null);

    const handleMouseEnter = (event, segmentIndex) => {
        console.log("Hello")
        // Determine which segment the mouse is hovering over based on segmentIndex
        let segmentData;
        switch (segmentIndex) {
            case 0:
                segmentData = "0-35%";
                break;
            case 1:
                segmentData = "35-80%";
                break;
            case 2:
                segmentData = "80-100%";
                break;
            default:
                segmentData = "No data available";
        }

        // Set tooltipData with the corresponding data
        setTooltipData({
            segmentData: segmentData,
            clientX: event.clientX,
            clientY: event.clientY
        });
    };

    const handleMouseLeave = () => {
        setTooltipData(null);
    };

    return (
        <div>
            <Accordion open={open} toggle={toggle}>

                {/* Hotel */}
                <AccordionItem>
                    <AccordionHeader
                        targetId="1"
                    >
                        <h4><b> Hotel </b></h4>
                    </AccordionHeader>
                    <AccordionBody accordionId="1">
                        <Row md="12" sm="12">
                            <Col md="6" sm="12">
                                <div className="gauge-chart-container">
                                    {needleValue !== undefined && (
                                        <div style={{ marginLeft: '250px' }}>
                                            <h4>
                                                <b>OSAT = {(needlePercent * 100).toFixed(2)} %</b>
                                            </h4>
                                        </div>
                                    )}
                                    {/* Gauge chart */}
                                    {needleValue !== undefined && <GaugeChart
                                        id="gauge-chart1"
                                        percent={needlePercent} // Set the position of the needle based on percentage value
                                        hideText={false}
                                        textColor="transparent"
                                        needleBaseColor="#F35725"
                                        arcPadding={0.0}
                                        cornerRadius={0}
                                        arcWidth={0.50}
                                        formatTextValue={(value) => `${value}%`}
                                        needleColor="#2a2c36"
                                        colors={["#ff6384", "#ffce56", "#2b806a"]} // Red and yellow
                                        arcsLength={[0.35, 0.45, 0.20]} // Continuous red and yellow segments
                                        onMouseEnterSegment={(event, segmentIndex) => handleMouseEnter(event, segmentIndex)}
                                        onMouseLeaveSegment={handleMouseLeave}
                                    />
                                    }
                                    {tooltipData && (
                                        <div style={{ position: 'absolute', top: tooltipData.clientY, left: tooltipData.clientX }}>
                                            {tooltipData.segmentData}
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </AccordionBody>
                </AccordionItem>


                {/* Front Office */}
                <AccordionItem>
                    <AccordionHeader targetId="2">
                        <h4><b> Front Office </b></h4>
                    </AccordionHeader>
                    <AccordionBody accordionId="2">
                        <Row md="12" sm="12">
                            <Col md="6" sm="12">
                                {rowData !== undefined && (
                                    <div style={{ marginLeft: '320px' }}>
                                        <h4><b>Overall Front office = {(needlePercent4 * 100).toFixed(2)} %</b></h4>
                                    </div>
                                )}
                                {rowData !== undefined && (
                                    <GaugeChart
                                        id="gauge-chart1"
                                        percent={needlePercent4}
                                        hideText={false}
                                        textColor="transparent"
                                        needleBaseColor="#F35725"
                                        arcPadding={0.0}
                                        cornerRadius={0}
                                        arcWidth={0.50}
                                        formatTextValue={(value) => `${value}%`}
                                        needleColor="#2a2c36"
                                        colors={["#ff6384", "#ffce56", "#2b806a"]}
                                        arcsLength={[0.35, 0.45, 0.20]}
                                    />
                                )}

                            </Col>

                            <Col md="2" sm="12">
                                {rowData !== undefined && (
                                    <div style={{ marginLeft: '65px' }}>
                                        <h4><b>Arrival = {(needlePercent1 * 100).toFixed(2)} %</b></h4>
                                    </div>
                                )}
                                {rowData !== undefined && (
                                    <GaugeChart
                                        id="gauge-chart1"
                                        percent={needlePercent1}
                                        hideText={false}
                                        textColor="transparent"
                                        needleBaseColor="#F35725"
                                        arcPadding={0.0}
                                        cornerRadius={0}
                                        arcWidth={0.50}
                                        formatTextValue={(value) => `${value}%`}
                                        needleColor="#2a2c36"
                                        colors={["#ff6384", "#ffce56", "#2b806a"]}
                                        arcsLength={[0.35, 0.45, 0.20]}
                                    />
                                )}
                            </Col>

                            <Col md="2" sm="12">
                                {rowData1 !== undefined && (
                                    <div style={{ marginLeft: '60px' }}>
                                        <h4><b>Departure = {(needlePercent2 * 100).toFixed(2)} %</b></h4>
                                    </div>
                                )}
                                {rowData1 !== undefined && (
                                    <GaugeChart
                                        id="gauge-chart2"
                                        percent={needlePercent2}
                                        hideText={false}
                                        textColor="transparent"
                                        needleBaseColor="#F35725"
                                        arcPadding={0.0}
                                        cornerRadius={0}
                                        arcWidth={0.50}
                                        formatTextValue={(value) => `${value}%`}
                                        needleColor="#2a2c36"
                                        colors={["#ff6384", "#ffce56", "#2b806a"]}
                                        arcsLength={[0.35, 0.45, 0.20]}
                                    />
                                )}
                            </Col>

                            <Col md="2" sm="12">
                                {rowData2 !== undefined && (
                                    <div style={{ marginLeft: '75px' }}>
                                        <h4><b>Toe = {(needlePercent3 * 100).toFixed(2)} %</b></h4>
                                    </div>
                                )}
                                {rowData2 !== undefined && (
                                    <GaugeChart
                                        id="gauge-chart3"
                                        percent={needlePercent3}
                                        hideText={false}
                                        textColor="transparent"
                                        needleBaseColor="#F35725"
                                        arcPadding={0.0}
                                        cornerRadius={0}
                                        arcWidth={0.50}
                                        formatTextValue={(value) => `${value}%`}
                                        needleColor="#2a2c36"
                                        colors={["#ff6384", "#ffce56", "#2b806a"]}
                                        arcsLength={[0.35, 0.45, 0.20]}
                                    />
                                )}
                            </Col>

                        </Row>
                    </AccordionBody>
                </AccordionItem>

                {/* Rooms */}
                <AccordionItem>
                    <AccordionHeader targetId="3">
                        <h4><b> Rooms </b></h4>
                    </AccordionHeader>
                    <AccordionBody accordionId="3">
                        <Row md="12" sm="12">
                            {/* First gauge chart */}
                            <Col md="6" sm="12">
                                {rowData8 !== undefined && (
                                    <div style={{ marginLeft: '320px' }}>
                                        <h4><b>Overall Rooms = {(needlePercent11 * 100).toFixed(2)} %</b></h4>
                                    </div>
                                )}
                                {rowData8 !== undefined && (
                                    <GaugeChart
                                        id="gauge-chart1"
                                        percent={needlePercent11}
                                        hideText={false}
                                        textColor="transparent"
                                        needleBaseColor="#F35725"
                                        arcPadding={0.0}
                                        cornerRadius={0}
                                        arcWidth={0.50}
                                        formatTextValue={(value) => `${value}%`}
                                        needleColor="#2a2c36"
                                        colors={["#ff6384", "#ffce56", "#2b806a"]}
                                        arcsLength={[0.35, 0.45, 0.20]}
                                    />
                                )}
                            </Col>

                            {/* Second gauge chart */}
                            <Col md="6" sm="12">
                                {/* Third and fourth gauge charts */}
                                <Row>
                                    <Col md="6" sm="12">
                                        {rowData3 !== undefined && (
                                            <div style={{ marginLeft: '65px' }}>
                                                <h4><b>Room Condition = {(needlePercent5 * 100).toFixed(2)} %</b></h4>
                                            </div>
                                        )}
                                        {rowData3 !== undefined && (
                                            <GaugeChart
                                                id="gauge-chart2"
                                                percent={needlePercent5}
                                                hideText={false}
                                                textColor="transparent"
                                                needleBaseColor="#F35725"
                                                arcPadding={0.0}
                                                cornerRadius={0}
                                                arcWidth={0.50}
                                                formatTextValue={(value) => `${value}%`}
                                                needleColor="#2a2c36"
                                                colors={["#ff6384", "#ffce56", "#2b806a"]}
                                                arcsLength={[0.35, 0.45, 0.20]}
                                            />
                                        )}
                                    </Col>
                                    <Col md="6" sm="12">
                                        {rowData4 !== undefined && (
                                            <div style={{ marginLeft: '60px' }}>
                                                <h4><b>Room Cleanliness = {(needlePercent6 * 100).toFixed(2)} %</b></h4>
                                            </div>
                                        )}
                                        {rowData4 !== undefined && (
                                            <GaugeChart
                                                id="gauge-chart3"
                                                percent={needlePercent6}
                                                hideText={false}
                                                textColor="transparent"
                                                needleBaseColor="#F35725"
                                                arcPadding={0.0}
                                                cornerRadius={0}
                                                arcWidth={0.50}
                                                formatTextValue={(value) => `${value}%`}
                                                needleColor="#2a2c36"
                                                colors={["#ff6384", "#ffce56", "#2b806a"]}
                                                arcsLength={[0.35, 0.45, 0.20]}
                                            />
                                        )}
                                    </Col>
                                </Row>
                                <hr></hr>

                                {/* Fifth and sixth gauge charts */}
                                <Row>
                                    <Col md="6" sm="12">
                                        {rowData5 !== undefined && (
                                            <div style={{ marginLeft: '75px' }}>
                                                <h4><b>Bathroom Condition = {(needlePercent7 * 100).toFixed(2)} %</b></h4>
                                            </div>
                                        )}
                                        {rowData5 !== undefined && (
                                            <GaugeChart
                                                id="gauge-chart4"
                                                percent={needlePercent7}
                                                hideText={false}
                                                textColor="transparent"
                                                needleBaseColor="#F35725"
                                                arcPadding={0.0}
                                                cornerRadius={0}
                                                arcWidth={0.50}
                                                formatTextValue={(value) => `${value}%`}
                                                needleColor="#2a2c36"
                                                colors={["#ff6384", "#ffce56", "#2b806a"]}
                                                arcsLength={[0.35, 0.45, 0.20]}
                                            />
                                        )}
                                    </Col>
                                    <Col md="6" sm="12">
                                        {rowData6 !== undefined && (
                                            <div style={{ marginLeft: '75px' }}>
                                                <h4><b>Bathroom Cleanliness = {(needlePercent8 * 100).toFixed(2)} %</b></h4>
                                            </div>
                                        )}
                                        {rowData6 !== undefined && (
                                            <GaugeChart
                                                id="gauge-chart5"
                                                percent={needlePercent8}
                                                hideText={false}
                                                textColor="transparent"
                                                needleBaseColor="#F35725"
                                                arcPadding={0.0}
                                                cornerRadius={0}
                                                arcWidth={0.50}
                                                formatTextValue={(value) => `${value}%`}
                                                needleColor="#2a2c36"
                                                colors={["#ff6384", "#ffce56", "#2b806a"]}
                                                arcsLength={[0.35, 0.45, 0.20]}
                                            />
                                        )}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </AccordionBody>
                </AccordionItem>


                {/* Internet */}
                <AccordionItem>
                    <AccordionHeader
                        targetId="4"
                    >
                        <h4><b> Internet </b></h4>
                    </AccordionHeader>
                    <AccordionBody accordionId="4">
                        <div className="gauge-chart-container">
                            {rowData7 !== undefined && (
                                <div style={{ marginLeft: '250px' }}>
                                    <h4>
                                        <b>Internet = {(needlePercent9 * 100).toFixed(2)} %</b>
                                    </h4>
                                </div>
                            )}
                            {/* Gauge chart */}
                            {rowData7 !== undefined && <GaugeChart
                                id="gauge-chart1"
                                percent={needlePercent9} // Set the position of the needle based on percentage value
                                hideText={false}
                                textColor="transparent"
                                needleBaseColor="#F35725"
                                arcPadding={0.0}
                                cornerRadius={0}
                                arcWidth={0.50}
                                formatTextValue={(value) => `${value}%`}
                                needleColor="#2a2c36"
                                colors={["#ff6384", "#ffce56", "#2b806a"]} // Red and yellow
                                arcsLength={[0.35, 0.45, 0.20]} // Continuous red and yellow segments
                            />
                            }
                        </div>
                    </AccordionBody>
                </AccordionItem>


                {/* Food & Beverage */}
                <AccordionItem>
                    <AccordionHeader targetId="5">
                        <h4><b> Food & Beverages </b></h4>
                    </AccordionHeader>
                    <AccordionBody accordionId="5">
                        <Row md="12" sm="12">
                            {/* First gauge chart */}
                            <Col md="6" sm="12">
                                {rowData17 !== undefined && (
                                    <div style={{ marginLeft: '320px' }}>
                                        <h4><b>Overall Rooms = {(needlePercent22 * 100).toFixed(2)} %</b></h4>
                                    </div>
                                )}
                                {rowData17 !== undefined && (
                                    <GaugeChart
                                        id="gauge-chart1"
                                        percent={needlePercent22}
                                        hideText={false}
                                        textColor="transparent"
                                        needleBaseColor="#F35725"
                                        arcPadding={0.0}
                                        cornerRadius={0}
                                        arcWidth={0.50}
                                        formatTextValue={(value) => `${value}%`}
                                        needleColor="#2a2c36"
                                        colors={["#ff6384", "#ffce56", "#2b806a"]}
                                        arcsLength={[0.35, 0.45, 0.20]}
                                    />
                                )}
                            </Col>

                            {/* Second gauge chart */}
                            <Col md="6" sm="12">
                                {/* Third and fourth gauge charts */}
                                <Row>

                                    <Col md="4" sm="12">
                                        {needlePercent20 !== undefined && (
                                            <div style={{ marginLeft: '65px' }}>
                                                <h5><b>Breakfast = {(needlePercent20 * 100).toFixed(2)} %</b></h5>
                                            </div>
                                        )}
                                        {needlePercent20 !== undefined && (
                                            <GaugeChart
                                                id="gauge-chart2"
                                                percent={needlePercent20}
                                                hideText={false}
                                                textColor="transparent"
                                                needleBaseColor="#F35725"
                                                arcPadding={0.0}
                                                cornerRadius={0}
                                                arcWidth={0.50}
                                                formatTextValue={(value) => `${value}%`}
                                                needleColor="#2a2c36"
                                                colors={["#ff6384", "#ffce56", "#2b806a"]}
                                                arcsLength={[0.35, 0.45, 0.20]}
                                            />
                                        )}
                                    </Col>

                                    <Col md="4" sm="12">
                                        {rowData9 !== undefined && (
                                            <div style={{ marginLeft: '60px' }}>
                                                <h5><b>Breakfast Food = {(needlePercent12 * 100).toFixed(2)} %</b></h5>
                                            </div>
                                        )}
                                        {rowData9 !== undefined && (
                                            <GaugeChart
                                                id="gauge-chart3"
                                                percent={needlePercent12}
                                                hideText={false}
                                                textColor="transparent"
                                                needleBaseColor="#F35725"
                                                arcPadding={0.0}
                                                cornerRadius={0}
                                                arcWidth={0.50}
                                                formatTextValue={(value) => `${value}%`}
                                                needleColor="#2a2c36"
                                                colors={["#ff6384", "#ffce56", "#2b806a"]}
                                                arcsLength={[0.35, 0.45, 0.20]}
                                            />
                                        )}
                                    </Col>

                                    <Col md="4" sm="12">
                                        {rowData10 !== undefined && (
                                            <div style={{ marginLeft: '60px' }}>
                                                <h5><b>Breakfast Service = {(needlePercent13 * 100).toFixed(2)} %</b></h5>
                                            </div>
                                        )}
                                        {rowData10 !== undefined && (
                                            <GaugeChart
                                                id="gauge-chart3"
                                                percent={needlePercent13}
                                                hideText={false}
                                                textColor="transparent"
                                                needleBaseColor="#F35725"
                                                arcPadding={0.0}
                                                cornerRadius={0}
                                                arcWidth={0.50}
                                                formatTextValue={(value) => `${value}%`}
                                                needleColor="#2a2c36"
                                                colors={["#ff6384", "#ffce56", "#2b806a"]}
                                                arcsLength={[0.35, 0.45, 0.20]}
                                            />
                                        )}
                                    </Col>

                                </Row>
                                <hr></hr>


                                <Row>

                                    <Col md="4" sm="12">
                                        {rowData11 !== undefined && (
                                            <div style={{ marginLeft: '65px' }}>
                                                <h5><b>Lunch = {(needlePercent14 * 100).toFixed(2)} %</b></h5>
                                            </div>
                                        )}
                                        {rowData11 !== undefined && (
                                            <GaugeChart
                                                id="gauge-chart2"
                                                percent={needlePercent14}
                                                hideText={false}
                                                textColor="transparent"
                                                needleBaseColor="#F35725"
                                                arcPadding={0.0}
                                                cornerRadius={0}
                                                arcWidth={0.50}
                                                formatTextValue={(value) => `${value}%`}
                                                needleColor="#2a2c36"
                                                colors={["#ff6384", "#ffce56", "#2b806a"]}
                                                arcsLength={[0.35, 0.45, 0.20]}
                                            />
                                        )}
                                    </Col>

                                    <Col md="4" sm="12">
                                        {rowData12 !== undefined && (
                                            <div style={{ marginLeft: '60px' }}>
                                                <h5><b>Dinner = {(needlePercent15 * 100).toFixed(2)} %</b></h5>
                                            </div>
                                        )}
                                        {rowData12 !== undefined && (
                                            <GaugeChart
                                                id="gauge-chart3"
                                                percent={needlePercent15}
                                                hideText={false}
                                                textColor="transparent"
                                                needleBaseColor="#F35725"
                                                arcPadding={0.0}
                                                cornerRadius={0}
                                                arcWidth={0.50}
                                                formatTextValue={(value) => `${value}%`}
                                                needleColor="#2a2c36"
                                                colors={["#ff6384", "#ffce56", "#2b806a"]}
                                                arcsLength={[0.35, 0.45, 0.20]}
                                            />
                                        )}
                                    </Col>

                                    <Col md="4" sm="12">
                                        {rowData13 !== undefined && (
                                            <div style={{ marginLeft: '60px' }}>
                                                <h5><b>IRD = {(needlePercent16 * 100).toFixed(2)} %</b></h5>
                                            </div>
                                        )}
                                        {rowData13 !== undefined && (
                                            <GaugeChart
                                                id="gauge-chart3"
                                                percent={needlePercent16}
                                                hideText={false}
                                                textColor="transparent"
                                                needleBaseColor="#F35725"
                                                arcPadding={0.0}
                                                cornerRadius={0}
                                                arcWidth={0.50}
                                                formatTextValue={(value) => `${value}%`}
                                                needleColor="#2a2c36"
                                                colors={["#ff6384", "#ffce56", "#2b806a"]}
                                                arcsLength={[0.35, 0.45, 0.20]}
                                            />
                                        )}
                                    </Col>

                                </Row>
                                <hr></hr>


                                {/* Fifth and sixth gauge charts */}
                                <Row>
                                    <Col md="4" sm="12">
                                        {rowData17 !== undefined && (
                                            <div style={{ marginLeft: '75px' }}>
                                                <h5><b>Overall Bar = {(needlePercent21 * 100).toFixed(2)} %</b></h5>
                                            </div>
                                        )}
                                        {rowData17 !== undefined && (
                                            <GaugeChart
                                                id="gauge-chart4"
                                                percent={needlePercent21}
                                                hideText={false}
                                                textColor="transparent"
                                                needleBaseColor="#F35725"
                                                arcPadding={0.0}
                                                cornerRadius={0}
                                                arcWidth={0.50}
                                                formatTextValue={(value) => `${value}%`}
                                                needleColor="#2a2c36"
                                                colors={["#ff6384", "#ffce56", "#2b806a"]}
                                                arcsLength={[0.35, 0.45, 0.20]}
                                            />
                                        )}
                                    </Col>

                                    <Col md="8" sm="12">
                                        <Row>
                                            <Col md="6" sm="12">
                                                {rowData14 !== undefined && (
                                                    <div style={{ marginLeft: '60px' }}>
                                                        <h5><b>Bar Food = {(needlePercent17 * 100).toFixed(2)} %</b></h5>
                                                    </div>
                                                )}
                                                {rowData14 !== undefined && (
                                                    <GaugeChart
                                                        id="gauge-chart3"
                                                        percent={needlePercent17}
                                                        hideText={false}
                                                        textColor="transparent"
                                                        needleBaseColor="#F35725"
                                                        arcPadding={0.0}
                                                        cornerRadius={0}
                                                        arcWidth={0.50}
                                                        formatTextValue={(value) => `${value}%`}
                                                        needleColor="#2a2c36"
                                                        colors={["#ff6384", "#ffce56", "#2b806a"]}
                                                        arcsLength={[0.35, 0.45, 0.20]}
                                                    />
                                                )}
                                            </Col>

                                            <Col md="6" sm="12">
                                                {rowData15 !== undefined && (
                                                    <div style={{ marginLeft: '60px' }}>
                                                        <h5><b>Bar Price = {(needlePercent18 * 100).toFixed(2)} %</b></h5>
                                                    </div>
                                                )}
                                                {rowData15 !== undefined && (
                                                    <GaugeChart
                                                        id="gauge-chart3"
                                                        percent={needlePercent18}
                                                        hideText={false}
                                                        textColor="transparent"
                                                        needleBaseColor="#F35725"
                                                        arcPadding={0.0}
                                                        cornerRadius={0}
                                                        arcWidth={0.50}
                                                        formatTextValue={(value) => `${value}%`}
                                                        needleColor="#2a2c36"
                                                        colors={["#ff6384", "#ffce56", "#2b806a"]}
                                                        arcsLength={[0.35, 0.45, 0.20]}
                                                    />
                                                )}
                                            </Col>
                                        </Row>

                                        <hr></hr>
                                        <Row>
                                            <Col md="6" sm="12">
                                                {rowData16 !== undefined && (
                                                    <div style={{ marginLeft: '75px' }}>
                                                        <h5><b>Bar Service = {(needlePercent19 * 100).toFixed(2)} %</b></h5>
                                                    </div>
                                                )}
                                                {rowData16 !== undefined && (
                                                    <GaugeChart
                                                        id="gauge-chart5"
                                                        percent={needlePercent19}
                                                        hideText={false}
                                                        textColor="transparent"
                                                        needleBaseColor="#F35725"
                                                        arcPadding={0.0}
                                                        cornerRadius={0}
                                                        arcWidth={0.50}
                                                        formatTextValue={(value) => `${value}%`}
                                                        needleColor="#2a2c36"
                                                        colors={["#ff6384", "#ffce56", "#2b806a"]}
                                                        arcsLength={[0.35, 0.45, 0.20]}
                                                    />
                                                )}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </AccordionBody>
                </AccordionItem>


                {/* Safety */}
                <AccordionItem>
                    <AccordionHeader
                        targetId="6"
                    >
                        <h4><b> Safety </b></h4>
                    </AccordionHeader>
                    <AccordionBody accordionId="6">
                        <div className="gauge-chart-container">
                            {rowData8 !== undefined && (
                                <div style={{ marginLeft: '250px' }}>
                                    <h4>
                                        <b>Safety = {(needlePercent10 * 100).toFixed(2)} %</b>
                                    </h4>
                                </div>
                            )}
                            {/* Gauge chart */}
                            {rowData8 !== undefined && <GaugeChart
                                id="gauge-chart1"
                                percent={needlePercent10} // Set the position of the needle based on percentage value
                                hideText={false}
                                textColor="transparent"
                                needleBaseColor="#F35725"
                                arcPadding={0.0}
                                cornerRadius={0}
                                arcWidth={0.50}
                                formatTextValue={(value) => `${value}%`}
                                needleColor="#2a2c36"
                                colors={["#ff6384", "#ffce56", "#2b806a"]} // Red and yellow
                                arcsLength={[0.35, 0.45, 0.20]} // Continuous red and yellow segments
                            />
                            }
                        </div>
                    </AccordionBody>
                </AccordionItem>

            </Accordion>
        </div>
    );
};

export default GuestFeedback;