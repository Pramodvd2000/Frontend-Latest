import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import API_URL from '../../../config';
import {
    Input, Card, Form, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, Modal, ModalBody, ModalHeader, InputGroupText, Row, Col,
    Accordion, AccordionBody, AccordionHeader, AccordionItem
} from "reactstrap";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router-dom'

const MySwal = withReactContent(Swal)
function YourComponent() {
    const navigate = useNavigate()
    const [rowData2, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);
    const [popUp, setPopUp] = useState(false);
    const [popUpData, setPopUpData] = useState(false);
    const [popUp2, setPopUp2] = useState(false);
    const [popUpData2, setPopUpData2] = useState();


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


    const handleSuccess = (message) => {
        return MySwal.fire({
            title: 'Dynamic Pricing',
            text: message,
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        })
    }




    let roomClassIds = []; // Store unique roomClassID for each roomClass




    useEffect(() => {
        const unAssign = JSON.stringify({ hotelID: 1 });

        fetchx(API_URL + "/getDynamicPrising", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: unAssign,
        })
            .then(result => result.json())
            .then(data => {
                const roomClassData = {};

                // Group data by roomClass
                data.data.forEach(row => {
                    const roomClass = row.roomClass;
                    if (!roomClassData[roomClass]) {
                        roomClassData[roomClass] = {
                            roomClass,
                            roomClassID: row.roomClassID,
                            id_array: row.id_array ? row.id_array : [],
                            occupancyRanges: {},
                            sameRangeids: {}, // Change to an object to store sameRangeids by range
                        };
                    }

                    const occupancyRange = `${row.occupancyFrom}-${row.occupancyTo}`;
                    roomClassData[roomClass].occupancyRanges[occupancyRange] = row.baseAmount;

                    // Store sameRangeids for each range
                    if (!roomClassData[roomClass].sameRangeids[occupancyRange]) {
                        roomClassData[roomClass].sameRangeids[occupancyRange] = [];
                    }
                    roomClassData[roomClass].sameRangeids[occupancyRange].push(...row.sameRangeids);
                });


                console.log(roomClassData)
                // Prepare new row data and column definitions
                const newRowData = Object.values(roomClassData).map(roomClass => {
                    const row = { roomClass: roomClass.roomClass, roomClassID: roomClass.roomClassID, id_array: roomClass.id_array, sameRangeids: roomClass.sameRangeids };
                    Object.keys(roomClass.occupancyRanges).forEach(range => {
                        row[range] = roomClass.occupancyRanges[range] || 0; // Set default to 0 if range is missing
                    });
                    return row;
                });

                // Add an empty row at the beginning
                // const emptyRow = { roomClass: 'Room Class' };
                // Object.keys(roomClassData).forEach(roomClass => {
                //     Object.keys(roomClassData[roomClass].occupancyRanges).forEach(range => {
                //         emptyRow[range] = `${range}`;
                //     });
                // });

                // newRowData.unshift(emptyRow);

                const uniqueOccupancyRanges = new Set(
                    Object.values(roomClassData)
                        .flatMap(roomClass => Object.keys(roomClass.occupancyRanges))
                );

                const newColumnDefs = [
                    { headerName: 'Room Class', field: 'roomClass', pinned: 'left' },
                    ...Array.from(uniqueOccupancyRanges).map(range => ({
                        headerName: `Occupancy ${range}`,
                        field: range,
                        editable: true, // Set editable to true only if it's not the roomClass column
                        width: 130, // Set a fixed width for the occupancy columns
                    })),
                ];

                setColumnDefs(newColumnDefs);
                setRowData(newRowData);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);




    function getDynamicPrising() {
        const unAssign = JSON.stringify({ hotelID: 1 });

        fetchx(API_URL + "/getDynamicPrising", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: unAssign,
        })
            .then(result => result.json())
            .then(data => {
                const roomClassData = {};


                // Group data by roomClass
                data.data.forEach(row => {
                    console.log(row)
                    const roomClass = row.roomClass;
                    if (!roomClassData[roomClass]) {
                        roomClassData[roomClass] = {
                            roomClass,
                            roomClassID: row.roomClassID, // Store roomClassID
                            id_array: row.id_array ? row.id_array : [], // Parse id_array into an array or set it as an empty array if undefined
                            occupancyRanges: {},
                            sameRangeids: row.sameRangeids

                        };
                        roomClassIds.push(row.roomClassID); // Store unique roomClassID for each roomClass

                    }

                    const occupancyRange = `${row.occupancyFrom}-${row.occupancyTo}`;
                    roomClassData[roomClass].occupancyRanges[occupancyRange] = row.baseAmount;
                });

                console.log(roomClassData)
                // Find unique occupancy ranges
                const uniqueOccupancyRanges = new Set(
                    Object.values(roomClassData)
                        .flatMap(roomClass => Object.keys(roomClass.occupancyRanges))
                );
                console.log(uniqueOccupancyRanges)

                // Prepare new row data and column definitions
                const newRowData = Object.values(roomClassData).map(roomClass => {
                    const row = { roomClass: roomClass.roomClass, roomClassID: roomClass.roomClassID, id_array: roomClass.id_array, sameRangeids: roomClass.sameRangeids };
                    uniqueOccupancyRanges.forEach(range => {
                        row[range] = roomClass.occupancyRanges[range] || 0; // Set default to 0 if range is missing
                    });
                    return row;
                });

                // Add an empty row at the beginning
                const emptyRow = { roomClass: 'Room Class' };
                let sameRangeIDs = []

                uniqueOccupancyRanges.forEach(range => {
                    emptyRow[range] = `${range}`;

                    // Object.values(roomClassData).forEach(roomClass => {
                    //     const sameRangeids = roomClass.sameRangeids || [];
                    //     console.log(sameRangeids)
                    //     // emptyRow[range].sameRangeids.push(...sameRangeids); // Push sameRangeids to the emptyRow
                    //     sameRangeIDs.push(...sameRangeids); // Push sameRangeids to the emptyRow

                    // });

                    Object.values(roomClassData).forEach(roomClass => {
                        const sameRangeids = roomClass.sameRangeids || [];
                        sameRangeIDs.push(...sameRangeids); // Push sameRangeids to the sameRangeIDs array
                        // emptyRow[range] = emptyRow[range].concat(sameRangeids); // Concatenate sameRangeids to the emptyRow array
                    });

                    console.log(sameRangeIDs)
                });

                // Extract numbers from sameRangeIDs and push them to specific range in emptyRow
                // sameRangeIDs.forEach(id => {
                //     const range = id.split('_')[1]; // Assuming sameRangeids are in the format "someNumber_rangeID"
                //     emptyRow[range].push(Number(id.split('_')[0])); // Push the number to the corresponding range in emptyRow
                // });

                console.log(emptyRow)
                newRowData.unshift(emptyRow);

                const newColumnDefs = [
                    { headerName: 'Room Class', field: 'roomClass', pinned: 'left' },
                    ...Array.from(uniqueOccupancyRanges).map(range => ({
                        headerName: `Occupancy ${range}`,
                        field: range,
                        editable: true, // Set editable to true only if it's not the roomClass column
                    })),
                ];

                setColumnDefs(newColumnDefs);
                setRowData(newRowData);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // const onCellValueChanged = (event) => {
    //     console.log(event)
    //     const { data, colDef, newValue } = event; // Extracting data from the event
    //     const { field: range } = colDef; // Extracting the range from the column definition

    //     // Check if the changed cell is not in the header row (roomClass)
    //     if (data.roomClass !== 'Room Class') {
    //         console.log(data)
    //         const roomClass = data.roomClass;
    //         const roomClassId = data.roomClassID; // Get the roomClassID for the roomClass
    //         const id_array = [data.id_array]; // Get the roomClassID for the roomClass
    //         console.log(`Changed value for roomClass: ${roomClass}, roomClassID: ${roomClassId}, range: ${range}, new value: ${newValue}, id: ${id_array}`);
    //         // Now you have roomClassID, roomClass, and range for the changed cell
    //         // You can perform any further operations here
    //     }
    // };

    function rangeSubmit(data) {
        console.log(data)
        const unAssign = JSON.stringify({
            oldOccupancyFrom: data.oldOccupancyFrom,
            oldOccupancyTo: data.oldOccupancyTo,
            newOccupancyFrom: data.newOccupancyFrom,
            newOccupancyTo: data.newOccupancyTo,
            nextoldOccupancyFrom: data.nextoldOccupancyFrom,
            nextnewOccupancyFrom: data.nextnewOccupancyFrom,
            sameRangeids: data.sameRangeids
        });

        fetchx(API_URL + "/updateDynamicPricingRangeEdit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: unAssign,
        })
            .then(result => result.json())
            .then(data => {
                console.log(data)
                if (data.statusCode === 200) {
                    navigate('')
                    handleSuccess('Updated successfully!!')

                }
                // getDynamicPrising()

            })
    }

    function baseAmountSubmit(data) {
        const unAssign = JSON.stringify({
            baseAmount: data.newValue,
            roomClassID: data.roomClassID,
            id_array: data.id_array,
            occupancyFrom: data.oldOccupancyFrom,
            occupancyTo: data.oldOccupancyTo
        });
        fetchx(API_URL + "/updateDynamicPricingAmountEdit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: unAssign,
        })
            .then(result => result.json())
            .then(data => {
                navigate('')
                handleSuccess('Updated successfully!!')
                setPopUpData2()
            })
    }

    const onCellValueChanged = (event) => {
        console.log(event);
        const { column, data, colDef, newValue, oldValue, rowIndex } = event; // Extracting data from the event
        const { field: range } = colDef; // Extracting the range from the column definition





        // for range Edit
        //         if (rowIndex === 0) {
        //             console.log(event)
        //             const [oldOccupancyFrom, oldOccupancyTo] = range.split('-').map(Number);
        //             const [newOccupancyFrom, newOccupancyTo] = newValue.split('-').map(Number);

        //             console.log(oldOccupancyFrom, oldOccupancyTo, newOccupancyFrom, newOccupancyTo)
        //             // Check if the old and new values are different
        //             if (range !== newValue) {
        //                 const ranges = Object.keys(data).filter(key => key !== 'roomClass'); // Get all ranges except 'roomClass'
        //                 const rangeIndex = ranges.indexOf(colDef.field); // Find the index of the changed range


        //                 // if (oldOccupancyFrom !== newOccupancyFrom || oldOccupancyTo !== newOccupancyTo) {

        //                 //     console.log('Old value:', range);
        //                 //     console.log('New value:', newValue);
        //                 //     if (rowIndex === 0) {
        //                 //         const range = column.colId; // Assuming column IDs match occupancy ranges
        //                 //         const roomClassData = rowData2;
        //                 //         console.log(roomClassData)
        //                 //         const sameRangeids = roomClassData[1]['sameRangeids'];
        //                 //         console.log(`Same Range IDs for ${range}:`, sameRangeids);
        //                 //         setPopUpData({oldOccupancyFrom: oldOccupancyFrom,
        //                 //             oldOccupancyTo: oldOccupancyTo,
        //                 //             newOccupancyFrom: newOccupancyFrom,
        //                 //             newOccupancyTo: newOccupancyTo,
        //                 //             sameRangeids: JSON.parse(sameRangeids)})
        //                 //         setPopUp('Do you want to change range from ' + range + ' to ' + newValue + ' ?');

        //                 //         // Perform further actions with sameRangeids as needed
        //                 //     }
        //                 //     // Perform further operations here
        //                 // }

        //                 if (rangeIndex !== -1) {
        //                     const newRangeValues = newValue.split('-').map(Number); // Extract new range values
        //                     const nextRange = data[ranges[rangeIndex + 1]]; // Get the range next to the changed range
        //                     console.log(nextRange)
        //                     if (nextRange === undefined) {
        //                         handleError("Don't exceed the limit.");
        //                         getDynamicPrising()
        //                         return
        //                     }
        //                     const nextOccupancyFrom = nextRange.split('-').map(Number); // Extract the next range's start value
        //                     console.log(nextOccupancyFrom[0])
        //                     if (nextRange) {
        //                         const nextRangeValues = nextRange.split('-').map(Number); // Extract values of the next range
        //                         const updatedStart = newRangeValues[1] + 1; // Update the start of the next range
        //                         const updatedEnd = nextRangeValues[1] + (updatedStart - nextRangeValues[0]); // Update the end of the next range
        //                         const nextOldOccupancyFrom = newRangeValues[1]; // Update the start of the next range
        //                         const roomClassData = rowData2;

        //                         // const sameRangeids = roomClassData[1]['sameRangeids'];
        //                         const occupancyRangeKey = `${oldOccupancyFrom}-${oldOccupancyTo}`;

        //                         const sameRangeids = roomClassData[1]['sameRangeids'][occupancyRangeKey];


        //                         let maxOccupancyTo = -Infinity;
        //                         Object.keys(data).forEach(key => {
        //                             if (key !== 'roomClass') {
        //                                 const range = key.split('-').map(Number);
        //                                 const occupancyTo = range[1];
        //                                 if (occupancyTo > maxOccupancyTo) {
        //                                     maxOccupancyTo = occupancyTo;
        //                                 }
        //                             }
        //                         });

        // console.log(maxOccupancyTo) 

        //                         // Check if the new end value exceeds the maximum limit (267)
        //                         if (updatedEnd > maxOccupancyTo) {
        //                             handleError("The upper limit cannot exceed " + maxOccupancyTo + ".");
        //                             return;
        //                         }

        //                         // Construct the new value for the next range
        //                         const newNextRangeValue = `${updatedStart}-${updatedEnd}`;
        //                         console.log(nextRangeValues, newNextRangeValue)
        //                         setPopUpData({
        //                             oldOccupancyFrom: oldOccupancyFrom,
        //                             oldOccupancyTo: oldOccupancyTo,
        //                             newOccupancyFrom: newOccupancyFrom,
        //                             newOccupancyTo: newOccupancyTo,
        //                             sameRangeids: sameRangeids,
        //                             nextnewOccupancyFrom: updatedStart,
        //                             nextoldOccupancyFrom: nextOccupancyFrom[0]
        //                         })
        //                         if (isNaN(newOccupancyFrom) || isNaN(newOccupancyTo)) {
        //                             handleError("Range cannot be null!!")
        //                             getDynamicPrising()

        //                         }
        //                         else {
        //                             setPopUp('Do you want to change range from ' + nextRange + ' to ' + newNextRangeValue + ' ?');
        //                             setRowData(prevRowData => {
        //                                 const updatedRowData = { ...prevRowData[0], [ranges[rangeIndex + 1]]: newNextRangeValue }; // Update only the next range in the current row data
        //                                 return [updatedRowData, ...prevRowData.slice(1)]; // Update only the row at index 0
        //                             });
        //                         }
        //                         // Show confirmation message
        //                         // Perform further actions

        //                         // Update the rowData state only for rowIndex 0 with the new value for the next range

        //                     } else {
        //                         handleError("Don't exceed the limit.");
        //                         getDynamicPrising()
        //                     }
        //                 } else {
        //                     handleError("Invalid range index.");
        //                 }
        //             }
        //             else {
        //                 handleError("No Change has been made")
        //             }
        //         }
        // else {
        // Amount edit
        const { field } = colDef;

        const roomClass = data.roomClass;
        const roomClassId = data.roomClassID; // Get the roomClassID for the roomClass
        const id_array = data.id_array; // Get the id_array for the roomClass

        const [oldOccupancyFrom, oldOccupancyTo] = field.split('-').map(Number);

        console.log("Old Occupancy From:", oldOccupancyFrom);
        console.log("Old Occupancy To:", oldOccupancyTo);

        if (!isNaN(newValue) && !isNaN(oldValue)) {
            console.log(`Changed value for roomClass: ${roomClass}, roomClassID: ${roomClassId}, range: ${range}, new value: ${newValue}, id: ${id_array}`);
            console.log(newValue, oldValue, roomClassId)
            setPopUp2('Do you want to change amount from ' + oldValue + ' to ' + newValue + ' for room class ' + roomClass + ' ?');
            setPopUpData2({ newValue: newValue, roomClassID: roomClassId, id_array: id_array, oldOccupancyFrom: oldOccupancyFrom, oldOccupancyTo: oldOccupancyTo })

        } else {
            handleError('Invalid amount');
        }

        // }

        // }
    };

    const defaultColDef = useMemo(() => ({
        sortable: true,
        autoHeight: true,
        wrapText: true,
        wrapHeaderText: true,


    }));


    const cellClickedListener = (event) => {
        console.log(event)
        const { column, value, rowIndex } = event;
        // Check if it's the first row and get the sameRangeids for the clicked occupancy range
        if (rowIndex === 0) {
            const range = column.colId; // Assuming column IDs match occupancy ranges
            const roomClassData = rowData2;
            console.log(roomClassData)
            const sameRangeids = roomClassData[1]['sameRangeids'];
            console.log(`Same Range IDs for ${range}:`, sameRangeids);
            // Perform further actions with sameRangeids as needed
        }
    };
    return (
        <div>
            <div className="ag-theme-alpine" style={{ height: 400 }}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData2}
                    singleClickEdit={true} // Enable one-click editing
                    onCellClicked={cellClickedListener}
                    onCellValueChanged={onCellValueChanged}
                    defaultColDef={defaultColDef}
                />
            </div>
            {popUp && (
                <div className='modal-dialog-centered'>
                    <Modal
                        isOpen={popUp}
                        toggle={() => setPopUp(!popUp)}
                        className='modal-dialog-centered'
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
                                        onClick={() => rangeSubmit(popUpData)}
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        color="danger"
                                        className="me-1"
                                        // className="text-center"
                                        onClick={() => { setPopUp(false) }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            )}

            {popUp2 && (
                <div className="disabled-animation-modal">
                    <Modal
                        isOpen={popUp2}
                        toggle={() => setPopUp2(!popUp2)}
                        className="modal-sm"
                    >
                        {" "}
                        {/*onClosed={onDiscard}*/}
                        <ModalHeader
                            className="modal-sm"
                            toggle={() => {
                                setPopUp2(!popUp2);
                            }}
                        >
                            Need To Check..
                        </ModalHeader>
                        <ModalBody className="pb-3 px-sm-2 mx-20">
                            <div>
                                <b>{popUp2}</b>
                                <br></br>
                                <br></br>
                                <div className="d-flex">
                                    <Button
                                        color="primary"
                                        className="me-1"
                                        // className="text-center"
                                        onClick={() => { popUpData2 && baseAmountSubmit(popUpData2) }}
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        color="danger"
                                        className="me-1"
                                        // className="text-center"
                                        onClick={() => { setPopUp2(false) }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            )}
        </div>
    );
}

export default YourComponent;
