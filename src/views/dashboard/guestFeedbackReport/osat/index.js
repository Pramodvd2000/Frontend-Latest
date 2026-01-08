import React, { useState, useEffect } from "react";
import GaugeChart from "react-gauge-chart";
import "./Chart1.css"; // Import custom CSS file for styling
import DASHBOARD_URL from '../../../../dashboard'

const Chart1 = () => {
    const [needleValue, setNeedleValue] = useState(); // Example needle value (60%)
    const [rowData, setRowData] = useState();

    useEffect(() => {
        fetchx(DASHBOARD_URL + "/getReportForOSAT")
            .then((result) => result.json())
            .then((rowData) => {
                setNeedleValue(rowData["data"]);
            });
    }, [])
    // Calculate the percentage value for the needle
    const needlePercent = needleValue / 100;

    return (
        <div>
            <div className="gauge-chart-container">
                {needleValue !== undefined && (
                    <div className="overlay">
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
                />
                }
            </div>
        </div>
    );
};

export default Chart1;
