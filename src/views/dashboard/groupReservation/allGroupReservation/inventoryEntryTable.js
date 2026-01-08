// ** React Imports
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
// ** Third Party Components
import { AgGridReact } from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';

import 'ag-grid-enterprise';
import API_URL from "../../../../config";
import { Card, CardBody, Button } from 'reactstrap';
import Moment from "moment";
import "./inventoryChange.css";
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from "react-router-dom"

const MySwal = withReactContent(Swal)
const RollOverData = ({ filldata, closeInventoryModal, tabState }) => {
    console.log(tabState)
    // AG Grid
    const navigate = useNavigate()

    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);
    const [apiData, setApiData] = useState();
    const [totalCount, setTotalCount] = useState();

    const gridRef = useRef();


    const handleSuccess = (message) => {
        return MySwal.fire({
            title: 'Group Inventory!!',
            text: message,
            icon: 'success',
        })
    }

    const handleSuccessTentative = async (message) => {
        await MySwal.fire({
            title: 'Tentative Booking',
            text: message,
            icon: 'success',
        });
        setTimeout(() => { navigate('/dashboard/groupreservation/allgroupreservations') }, 500);
    }

    const handleError = (message) => {
        return MySwal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            html: message.replace(/\n/g, '<br />'),
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            allowOutsideClick: false,
            confirmButtonText: 'Close',
            confirmButtonColor: 'danger',
            buttonsStyling: false
        })
    }

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeaderHeight: true,
        filterParams: {
            buttons: ['apply', 'reset']
        }
    }));

    const cellClickedListener = useCallback(event => {
        console.log('Cell clicked', event);
    }, []);

    useEffect(() => {
        const unAssign = JSON.stringify({
            groupID: filldata.id
        });

        fetch(API_URL + "/getRoomInventoryForAddingRoomInvGroupReservation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: unAssign,
        })
            .then(result => result.json())
            .then(data => {
                const roomData = data['data'];
                setApiData(data.data)
                processRoomData(roomData);
            });



    }, [filldata]);


    function getTotalCount(finalData) {
        fetch(API_URL + '/getreleaseGroupRoomInventory', {
            method: 'POST',
            body: JSON.stringify({
                "groupID": filldata.id,

            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((res) => res.json())
            .then((post) => {
                if (post['statusCode'] == 200) {
                    console.log(finalData)
                    const uniqueDates = Array.from(
                        new Set(
                            finalData.flatMap((item) =>
                                Object.keys(item)
                                    .filter((key) => key.match(/^\d{4}-\d{2}-\d{2}_/)) // Match keys starting with a date
                                    .map((key) => key.split('_')[0]) // Extract only the date part
                            )
                        )
                    );

                    console.log(uniqueDates);


                    const filteredData = post.data.filter(
                        (item) => uniqueDates.includes(item.inventory_date) &&
                            !((item.requiredRooms === 0 || item.requiredRooms === null) && item.pendingRooms === 0 && item.bookedRooms === 0)
                    );
                    const sortedData = filteredData.sort((a, b) => new Date(a.inventory_date) - new Date(b.inventory_date));

                    const groupedData = post.data.reduce((acc, item) => {
                        acc[item.inventory_date] = acc[item.inventory_date] || [];
                        acc[item.inventory_date].push(item);
                        return acc;
                    }, {});
                    const inventoryDates = Object.keys(groupedData);

                    const dateColumns = inventoryDates.flatMap((date) => console.log(date))

                    console.log(filteredData)
                    console.log(groupedData)
                    console.log(sortedData)
                    console.log(filteredData)
                    console.log(post.data)
                    // Calculate totals
                    const totals = filteredData.reduce(
                        (acc, curr) => {
                            acc.bookedRooms += curr.bookedRooms || 0;
                            acc.pendingRooms += curr.pendingRooms || 0;
                            acc.requiredRooms += curr.requiredRooms || 0;
                            return acc;
                        },
                        { bookedRooms: 0, pendingRooms: 0, requiredRooms: 0 }
                    );

                    setTotalCount(totals)
                    console.log('Sorted Data:', sortedData);
                    console.log('Total Values:', totals);
                    console.log('Full Data:', post.data);

                    //   setInventoryblockmodal(true)
                    //   seinventoryData(sortedData)
                }

            })

    }


    function RefreshGetApi() {
        const unAssign = JSON.stringify({
            groupID: filldata.id
        });

        fetch(API_URL + "/getRoomInventoryForAddingRoomInvGroupReservation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: unAssign,
        })
            .then(result => result.json())
            .then(data => {
                if (data.statusCode === 200) {
                    const roomData = data['data'];
                    setApiData(data.data);
                    processRoomData(roomData);
                }
            });
    }




    const processRoomData = (data) => {
        const dates = [...new Set(data.map(item => item.inventory_date))];


        const columns = [
            {
                headerName: 'Type/Date',
                field: 'roomType',
                pinned: 'left',
                suppressSizeToFit: true,
                maxWidth: 120,
                cellStyle: { textAlign: 'center', fontWeight: 'bold' },
            },

            ...dates
                .sort((a, b) => new Date(a) - new Date(b))
                .flatMap(date => {
                    const formattedDate = Moment(date).format('MMM DD, YYYY');
                    return [
                        {
                            headerName: formattedDate,
                            headerClass: 'header-center',
                            pinned: 'right',
                            headerStyle: {
                                border: '1px solid #black',
                                backgroundColor: '#f5f5f5',
                            },
                            children: [
                                {
                                    headerName: 'Avl',
                                    field: `${date}_available`,
                                    width: 70,
                                    cellRenderer: (params) => {
                                        const avlRooms = params.data[`${date}_available`] || 0;
                                        const isTotalRow = params.data.roomType === "Total";

                                        return (
                                            <span style={{
                                                // color: avlRooms === 0 ? '#e74c3c' : '#2ecc71',
                                                color: isTotalRow ? '#000' : avlRooms === 0 ? '#e74c3c' : '#2ecc71',

                                                // fontWeight: 'bold',
                                                fontWeight: isTotalRow ? 'bold' : 'normal',

                                                display: 'inline-block',
                                                width: '100%',
                                                padding: '4px',
                                                borderRadius: '4px',
                                                // backgroundColor: avlRooms === 0 ? '#f9e0e0' : '#e0f9e0'
                                                // backgroundColor: isTotalRow ? '#9AA6B2' : avlRooms === 0 ? '#f9e0e0' : '#e0f9e0',
                                                backgroundColor: isTotalRow ? '#b9b5b7' : avlRooms === 0 ? '#f9e0e0' : '#e0f9e0',

                                            }}>
                                                {avlRooms}
                                            </span>
                                        );
                                    },
                                    cellStyle: {
                                        textAlign: 'center'
                                    },
                                    suppressMenu: true,
                                },
                                {
                                    headerName: 'Booked',
                                    field: `${date}_required`,
                                    width: 110,
                                    editable: false,
                                    cellEditor: 'agTextCellEditor',
                                    singleClickEdit: true, // Enable single-click edit for this column

                                    cellEditorParams: {
                                        maxLength: 3
                                    },
                                    cellRenderer: (params) => {
                                        // console.log(params)
                                        const requiredRooms = params.data[`${date}_required`] || null;
                                        const isTotalRow = params.data.roomType === "Total";
                                        const inventoryDate = new Date(date);
                                        const businessDate = new Date(params.data.businessDate);
                                        console.log(inventoryDate, businessDate, inventoryDate < businessDate)
                                        const isPastDate = inventoryDate < businessDate;
                                        return (
                                            <input
                                                type="number"
                                                defaultValue={requiredRooms}
                                                // defaultValue={isTotalRow ? requiredRooms : null}
                                                placeholder={isTotalRow ? requiredRooms : "Enter"}
                                                readOnly={isTotalRow || isPastDate}
                                                // placeholder="Enter"
                                                onChange={(e) => {
                                                    console.log(e)
                                                    const newValue = e.target.value ? parseInt(e.target.value) : 0;
                                                    params.data[`${date}_required`] = newValue;
                                                    // setRowData((prevData) => {
                                                    //     const updatedData = prevData.map(row => {
                                                    //         if (row.roomType === params.data.roomType) {
                                                    //             return { ...row, [`${date}_required`]: newValue };
                                                    //         }
                                                    //         return row;
                                                    //     });
                                                    //     return updatedData;
                                                    // });
                                                }}

                                                style={{
                                                    width: '60px',
                                                    textAlign: 'center',
                                                    // border: '1px solid #ccc',
                                                    // border: isTotalRow ? '1px solid #9AA6B2' : '1px solid #ccc',
                                                    border: isTotalRow ? '1px solid #b9b5b7' : '1px solid #ccc',

                                                    borderRadius: '4px',
                                                    padding: '4px',
                                                    outline: 'none',
                                                    boxShadow: 'none',
                                                    boxSizing: 'border-box',
                                                    // backgroundColor: isTotalRow ? '#9AA6B2' : '#fff',
                                                    backgroundColor: isTotalRow ? '#b9b5b7' : '#fff',

                                                    fontWeight: isTotalRow ? 'bold' : 'normal',

                                                }}
                                            />
                                        );
                                    },
                                    cellStyle: {
                                        textAlign: 'center',
                                        // borderRight: '2px solid #ccc'
                                    },
                                    headerStyle: {
                                        textAlign: 'center',
                                        borderRight: '2px solid #ccc'
                                    }
                                },
                                {
                                    headerName: 'Picked',
                                    field: `${date}_booked`,
                                    width: 90,
                                    cellRenderer: (params) => {
                                        const avlRooms = params.data[`${date}_booked`] || 0;
                                        const isTotalRow = params.data.roomType === "Total";

                                        return (
                                            <span style={{
                                                // color: avlRooms === 0 ? '#e74c3c' : '#2ecc71',
                                                // color: isTotalRow ? '#000' : avlRooms === 0 ? '#e74c3c' : '#2ecc71',
                                                color: isTotalRow ? '#000' : avlRooms === 0 ? '#000' : '#000',

                                                // fontWeight: 'bold',
                                                fontWeight: isTotalRow ? 'bold' : 'normal',

                                                display: 'inline-block',
                                                width: '100%',
                                                padding: '4px',
                                                borderRadius: '4px',
                                                // backgroundColor: avlRooms === 0 ? '#f9e0e0' : '#e0f9e0'
                                                // backgroundColor: isTotalRow ? '#9AA6B2' : avlRooms === 0 ? '#f9e0e0' : '#e0f9e0',
                                                backgroundColor: isTotalRow ? '#b9b5b7' : avlRooms === 0 ? 'rgb(196,205,241)' : 'rgb(196,205,241)',

                                            }}>
                                                {avlRooms}
                                            </span>
                                        );
                                    },
                                    cellStyle: {
                                        textAlign: 'center'
                                    },
                                    suppressMenu: true,
                                },
                                {
                                    headerName: 'Pending',
                                    field: `${date}_pending`,
                                    width: 90,
                                    cellRenderer: (params) => {
                                        const avlRooms = params.data[`${date}_pending`] || 0;
                                        const isTotalRow = params.data.roomType === "Total";

                                        return (
                                            <span style={{
                                                // color: avlRooms === 0 ? '#e74c3c' : '#2ecc71',
                                                // color: isTotalRow ? '#000' : avlRooms === 0 ? '#e74c3c' : '#2ecc71',
                                                // color: isTotalRow ? '#000' : avlRooms === 0 ? '#e74c3c' : '#2ecc71',

                                                // fontWeight: 'bold',
                                                fontWeight: isTotalRow ? 'bold' : 'normal',

                                                display: 'inline-block',
                                                width: '100%',
                                                padding: '4px',
                                                borderRadius: '4px',
                                                // backgroundColor: avlRooms === 0 ? '#f9e0e0' : '#e0f9e0'
                                                // backgroundColor: isTotalRow ? '#9AA6B2' : avlRooms === 0 ? '#f9e0e0' : '#e0f9e0',
                                                backgroundColor: isTotalRow ? '#b9b5b7' : avlRooms === 0 ? 'rgb(255,178,178)' : 'rgb(255,178,178)',
                                                // border: isTotalRow ? '1px solid #b9b5b7' : '1px solid #ccc',

                                            }}>
                                                {avlRooms}
                                            </span>
                                        );
                                    },
                                    cellStyle: {
                                        textAlign: 'center',
                                        borderRight: '2px solid #ccc'

                                    },
                                    suppressMenu: true,
                                },











                            ],
                        }
                    ];
                })

        ];

        setColumnDefs(columns);

        const groupedData = {};
        data.forEach(item => {
            const dateKey = item.inventory_date;
            if (!groupedData[item.roomType]) {
                groupedData[item.roomType] = { roomType: item.roomType };
            }
            groupedData[item.roomType][`${dateKey}_available`] = Number(item.avlRooms);
            groupedData[item.roomType][`${dateKey}_required`] = Number(item.requiredRooms) || 0;
            groupedData[item.roomType][`${dateKey}_pending`] = Number(item.pendingRooms);
            groupedData[item.roomType][`${dateKey}_booked`] = Number(item.bookedRooms);
            groupedData[item.roomType][`businessDate`] = item.businessDate;
        });

        const finalData = Object.values(groupedData);

        // Compute total row
        const totalRow = { roomType: "Total" };
        dates.forEach((date) => {
            const availableField = `${date}_available`;
            const requiredField = `${date}_required`;
            const pendingRooms = `${date}_pending`;
            const bookedRooms = `${date}_booked`;

            totalRow[availableField] = finalData.reduce((sum, row) => sum + (row[availableField] || 0), 0);
            totalRow[requiredField] = finalData.reduce((sum, row) => sum + (row[requiredField] || 0), 0);
            totalRow[pendingRooms] = finalData.reduce((sum, row) => sum + (row[pendingRooms] || 0), 0);
            totalRow[bookedRooms] = finalData.reduce((sum, row) => sum + (row[bookedRooms] || 0), 0);
        });

        // Append total row to data
        const updatedData = [...finalData, totalRow];


        getTotalCount(updatedData)
        setRowData(updatedData);


    };



    // const handleConvertToTentative = () => {
    //     const apiMap = apiData.reduce((acc, item) => {
    //         if (!acc[item.roomType]) {
    //             acc[item.roomType] = {};
    //         }
    //         acc[item.roomType][item.inventory_date] = item.avlRooms;
    //         return acc;
    //     }, {});

    //   // Create a new array to store the updated data
    //  const updatedRowData = rowData.map(room => {
    //      // Create a shallow copy of each room object
    //      const updatedRoom = { ...room };

    //      for (const key in updatedRoom) {
    //          if (key.endsWith("_required")) {
    //              const datePart = key.split("_")[0];
    //              if (apiMap[updatedRoom.roomType] && apiMap[updatedRoom.roomType][datePart] !== undefined) {
    //                  updatedRoom[key] = apiMap[updatedRoom.roomType][datePart];
    //              }
    //          }
    //      }
    //      return updatedRoom;
    //  });

    //  // Log the updated data
    //  console.log("Final JSON data:", JSON.stringify(updatedRowData, null, 2));
    // };


    const convertToTentative = () => {

        // const currentGridData = [];
        // gridRef3.current.api.forEachNode((node) => currentGridData.push(node.data));

        // console.log("User-entered grid data:", currentGridData);

        if (filldata['status'] === 'Tentative') {
            return handleError("Already converted to Tentative !!")
        }
        else if (filldata['status'] === 'Cancelled') {
            return handleError("This Operation is not allowed !!")
        }
        else {
            const groupData = JSON.stringify({
                // reservationID: sessionStorage.getItem('groupReservationID'),
                reservationID: filldata.id,
                status: 'Tentative'
            })
            // fetchx(API_URL + "/confirmationForTentative", {
            //     method: "POST",
            //     headers: { 'Content-Type': 'application/json' },
            //     body: groupData
            // }).then(result => result.json())
            //     .then(resp => {
            //         if (resp.statusCode === 403) {
            //             return handleError(resp['data']);
            //         }
            MySwal.fire({
                title: "Confirmation Required",
                // text: resp['data'], // Display message from response
                icon: "question",
                buttonsStyling: false,
                showCancelButton: true,
                confirmButtonText: "Yes, Continue",
                cancelButtonText: "No",
                reverseButtons: true,
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'btn btn-primary ms-1',
                    cancelButton: 'btn btn-outline-danger ms-1'
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    handleConvertToTentative()
                    fetchx(API_URL + "/updateStatusToTentative", {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: groupData
                    }).then(result => result.json())
                        .then(resp => {
                            if (resp.statusCode === 200) {
                                handleSuccessTentative(resp['message'])
                                setTimeout(() => {
                                    navigate('');
                                }, 1000);
                            }
                        }).catch((error) => {
                            handleError(error);
                        });
                }
            })
            // })
        }
    }



    // const handleConvertToTentative = () => {
    //     const enterEvent = new KeyboardEvent('keydown', {
    //         key: 'Enter',
    //         code: 'Enter',
    //         keyCode: 13,
    //         which: 13,
    //         bubbles: true
    //     });
    //     document.dispatchEvent(enterEvent);



    //     // Step 1: Create a lookup map from rowData for quick access to the requiredRooms values.
    //     const rowDataMap = rowData.reduce((acc, room) => {
    //         acc[room.roomType] = acc[room.roomType] || {};

    //         // Map dates to their requiredRooms values
    //         for (const key in room) {
    //             if (key.endsWith("_required")) {
    //                 const datePart = key.split("_")[0];  // Extract date part
    //                 acc[room.roomType][datePart] = room[key];
    //             }
    //         }

    //         return acc;
    //     }, {});

    //     // Step 2: Update `requiredRooms` in apiData based on the map
    //     const updatedApiData = apiData.map(item => {
    //         const requiredRooms = rowDataMap[item.roomType]?.[item.inventory_date];

    //         // Update requiredRooms only if we have a matching entry in rowData
    //         if (requiredRooms !== undefined) {
    //             return { ...item, requiredRooms };
    //         }

    //         // Return item unchanged if no matching date/roomType in rowData
    //         return item;
    //     });

    //     // Log the updated apiData

    //     console.log("Final JSON data:", JSON.stringify(updatedApiData, null, 2));
    //     console.log(updatedApiData)



    //     if(updatedApiData){

    //     const updatingData = JSON.stringify({
    //         groupID: filldata.id,
    //         invData:updatedApiData
    //     });

    //     fetch(API_URL + "/UpdateGroupReservationAvlInventory", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: updatingData,
    //     })
    //         .then(result => result.json())
    //         .then(data => {
    //             if(data.statusCode === 200){
    //                 setRowData([])
    //                  RefreshGetApi()

    //                 // if(tabState === 'enquiry'){
    //                 //     convertToTentative()
    //                 // }
    //                 handleSuccess("Group Inventory Updated!!")
    //             }
    //             else{
    //                 // RefreshGetApi()

    //                 console.log(data.message)
    //                 handleError(data.message)

    //             }
    //         });
    //     }
    // };


    // const gridOptions = {
    //     rowHeight: 36,
    // };

    const handleConvertToTentative = () => {
        const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true
        });
        document.dispatchEvent(enterEvent);

        // Step 1: Create a lookup map from rowData for quick access to the requiredRooms values.
        const rowDataMap = rowData.reduce((acc, room) => {
            acc[room.roomType] = acc[room.roomType] || {};

            // Map dates to their requiredRooms values
            for (const key in room) {
                if (key.endsWith("_required")) {
                    const datePart = key.split("_")[0];  // Extract date part
                    acc[room.roomType][datePart] = room[key];
                }
            }

            return acc;
        }, {});

        // Step 2: Validate `requiredRooms` to ensure no negative values exist
        const hasNegativeValues = Object.values(rowDataMap).some(roomTypeData =>
            Object.values(roomTypeData).some(value => value < 0)
        );

        if (hasNegativeValues) {
            handleError("Error: Negative values are not allowed in required rooms.");
            return; // Stop the function execution
        }

        // Step 3: Update `requiredRooms` in apiData based on the map
        // const updatedApiData = apiData.map(item => {
        //     const requiredRooms = rowDataMap[item.roomType]?.[item.inventory_date];

        //     // Update requiredRooms only if we have a matching entry in rowData
        //     if (requiredRooms !== undefined) {
        //         return { ...item, requiredRooms };
        //     }

        //     // Return item unchanged if no matching date/roomType in rowData
        //     return item;
        // });

        const updatedApiData = apiData.map(item => {
            const requiredRooms = rowDataMap[item.roomType]?.[item.inventory_date];

            if (requiredRooms !== undefined) {
                let changeType = null;

                // New value entered where it was empty/zero
                if ((!item.requiredRooms || item.requiredRooms === 0) && requiredRooms > 0) {
                    changeType = "added";
                }
                // Existing value modified
                else if (item.requiredRooms > 0 && requiredRooms !== item.requiredRooms) {
                    changeType = "edited";
                }

                return {
                    ...item,
                    requiredRooms,
                    changeType
                    // ...(changeType ? { changeType } : {})   // only include if edited/added
                };
            }

            return item;
        });


        // Log the updated apiData
        console.log("Final JSON data:", JSON.stringify(updatedApiData, null, 2));
        console.log(updatedApiData);

        // Step 4: Send data to the API if validation passes
        if (updatedApiData) {
            const updatingData = JSON.stringify({
                groupID: filldata.id,
                invData: updatedApiData
            });

            fetch(API_URL + "/UpdateGroupReservationAvlInventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: updatingData,
            })
                .then(result => result.json())
                .then(data => {
                    if (data.statusCode === 200) {
                        setTimeout(() => {
                            navigate('');
                        }, 1000);
                        setRowData([]);
                        RefreshGetApi();
                        handleSuccess("Group Inventory Updated!!");
                    } else {
                        console.log(data.message);
                        handleError(data.message);
                    }
                });
        }
    };


    // const gridOptions = {
    //     rowHeight: 36,
    // };

    const gridOptions = {
        rowHeight: 36,
        columnDefs: columnDefs,
        onGridReady: (params) => {
            console.log(params)
            console.log("Grid is ready");
        },
        getRowStyle: (params) => {
            if (params.data?.roomType === "Total") {
                return {
                    // backgroundColor: '#9AA6B2', // Gold background
                    backgroundColor: '#b9b5b7', // Gold background
                    fontWeight: 'bold',
                    color: '#000000', // Black text for contrast
                };
            }
            return null;
        }


    };


    const calculateTotals = (rowData) => {
        const dateRoomTypeMap = new Map();

        rowData.forEach((room) => {
            const roomType = room.roomType;

            Object.keys(room).forEach((key) => {
                if (key.endsWith("_required")) {
                    const date = key.split("_")[0]; // Extract date from key
                    const value = room[key] || 0;   // Ensure value is numeric

                    // Create a unique key for (date, roomType)
                    const uniqueKey = `${date}_${roomType}`;

                    if (!dateRoomTypeMap.has(uniqueKey)) {
                        dateRoomTypeMap.set(uniqueKey, 0);
                    }

                    dateRoomTypeMap.set(uniqueKey, dateRoomTypeMap.get(uniqueKey) + value);
                }
            });
        });

        // Convert Map values to array for calculations
        const requiredRoomsPerDay = [...dateRoomTypeMap.values()];

        // Total required rooms
        const totalRequiredRooms = requiredRoomsPerDay.reduce((sum, value) => sum + value, 0);

        // Max required rooms on any single day
        const maxRequiredRooms = Math.max(...requiredRoomsPerDay, 0);

        // Number of unique nights (unique dates)
        const uniqueDates = new Set([...dateRoomTypeMap.keys()].map((key) => key.split("_")[0]));
        const noOfNights = uniqueDates.size;

        return { totalRequiredRooms, maxRequiredRooms, noOfNights };
    };


    // Call the function with rowData
    const { totalRequiredRooms, noOfNights, maxRequiredRooms } = calculateTotals(rowData);



    return (
        <Card style={{ height: '100%' }}>
            <CardBody style={{ height: '100%' }}>
                <div className="ag-theme-alpine custom-rollover-theme" style={{ width: '100%', height: '100%' }}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        animateRows={true}
                        gridOptions={gridOptions}
                        rowSelection="multiple"
                        onCellClicked={cellClickedListener}
                        domLayout='autoHeight'
                        defaultColDef={defaultColDef}
                    />
                </div>
                <div style={{ marginTop: '10px' }} align='end'>
                    {/* {tabState && tabState ==='enquiry' && <Button color='primary' className='me-1' onClick={handleConvertToTentative}>Convert to Tentative</Button>}
                    <Button color='primary' className='me-1' onClick={handleConvertToTentative}>Block Inventory</Button> */}
                    {tabState && tabState === 'enquiry' ? <Button color='primary' className='me-1' onClick={convertToTentative}>Convert to Tentative</Button> :
                        <Button color='primary' className='me-1' onClick={handleConvertToTentative}>Block Inventory</Button>}
                    <Button outline className='me-1' color='secondary' onClick={() => closeInventoryModal()}> Close</Button>

                </div>
                {/* {totalCount && <div>
                    <p>Booked Rooms: {totalCount.bookedRooms} </p>
                    <p>Pending Rooms: {totalCount.pendingRooms} </p>
                    <p>Required Rooms: {totalCount.requiredRooms} </p>
                </div>} */}
                {totalCount && (
                    <div>
                        <p style={{ fontWeight: 'bold', margin: '5px 0', fontSize: '18px' }}>
                            No. of Rooms: <span style={{ fontWeight: 'normal', fontSize: '18px' }}>{maxRequiredRooms}</span>
                        </p>

                        <p style={{ fontWeight: 'bold', margin: '5px 0', fontSize: '18px' }}>
                            Total No. Nights: <span style={{ fontWeight: 'normal', fontSize: '18px' }}>{noOfNights}</span>
                        </p>

                        <p style={{ fontWeight: 'bold', margin: '5px 0', fontSize: '18px' }}>
                            Total Booked Nights: <span style={{ fontWeight: 'normal', fontSize: '18px' }}>{totalCount.requiredRooms}</span>
                        </p>
                        <p style={{ fontWeight: 'bold', margin: '5px 0', fontSize: '18px' }}>
                            Total Picked Nights: <span style={{ fontWeight: 'normal', fontSize: '18px' }}>{totalCount.bookedRooms}</span>
                        </p>
                        <p style={{ fontWeight: 'bold', margin: '5px 0', fontSize: '18px' }}>
                            Total Pending Nights: <span style={{ fontWeight: 'normal', fontSize: '18px' }}>{totalCount.pendingRooms}</span>
                        </p>

                    </div>
                )}


            </CardBody>
        </Card>
    );
};

export default RollOverData;
