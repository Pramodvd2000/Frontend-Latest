import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import "/node_modules/ag-grid-community/styles/ag-grid.css";
import "/node_modules/ag-grid-community/styles/ag-theme-alpine.css";
import moment from "moment";
import Moment from "moment";
import Select from "react-select";
//import { Button } from "reactstrap";
import { selectThemeColors } from "@utils";
import API_URL from "../../../../config";
import Swal from "sweetalert2";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Card,
  Form,
  Label,
  CardBody,
  Row,
  Col,
  Input,
  Badge,
} from "reactstrap";

const getRoomInventoryRoomTypeID = async () => {
  const response = await fetch(API_URL + "/getRoomInventoryRoomTypeID");
  const data = await response.json();
  return data.status === "Success" ? data.data : [];
};

const getPackageDescription = async () => {
  const response = await fetch(API_URL + "/getPackageDescription");
  const data = await response.json();
  return data.status === "Success" ? data.data : [];
};

const fetchGroupDate = async (groupReservation, roomType) => {
  const response = await fetch(
    `${API_URL}/getGroupDate?groupReservation=${groupReservation}&roomType=${roomType}`
  );
  const data = await response.json();
  return data.status === "Success" ? data.data : [];
};

const fetchShoulderDates = async (groupReservation) => {
  const response = await fetch(
    API_URL + `/getShoulderDates?groupReservation=${groupReservation}`
  );
  const data = await response.json();
  return data.status === "Success" ? data.data : {};
};

const copyRoomRates = async (
  groupReservation,
  sourceRoomType,
  targetRoomType
) => {
  try {
    //console.log(groupReservation, sourceRoomType, targetRoomType)

    const response = await fetch(`${API_URL}/copyroomrates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupReservation,
        sourceRoomType,
        targetRoomType,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error copying room rates:", error);
    throw error;
  }
};

const fetchRoomRateStatus = async (groupReservationId) => {
  try {
    const response = await fetch(API_URL + "/roomRateStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupReservation: groupReservationId }),
    });
    const data = await response.json();
    return data.status === "Success" ? data.data : {};
  } catch (error) {
    console.error("Error fetching room rate status:", error);
    return {};
  }
};

const RoomRatePage = ({ reservationData }) => {
  const [roomData, setRoomData] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [roomTypeRates, setRoomTypeRates] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [gridApi1, setGridApi1] = useState(null);
  const [isSaveAllEnabled, setIsSaveAllEnabled] = useState(false);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(null);
  const [isApplyForAllDateEnabled, setIsApplyForAllDateEnabled] =
    useState(false);
  const [roomRateStatus, setRoomRateStatus] = useState({});
  const [options2, setOptions2] = useState();
  const [selectedSourceRoom, setSelectedSourceRoom] = useState(null);
  const gridRef1 = useRef(null);
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [tempReservationModal, setTempReservationModal] = useState(false);
  const [tempReservationData, setTempReservationData] = useState([]);
  const [tempReservationIDs, setTempReservationIDs] = useState([]);

  //   console.log(roomData, "roomdata");

  //   console.log("selectedReservations", selectedReservations);
  const [applySuccess, setApplySuccess] = useState(false);

  //console.log(roomData);

  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
    };
  }, []);

  const toggleTempReservationModal = () => {
    setTempReservationModal((prev) => !prev);

    // Reset selectedReservations when closing the modal
    if (tempReservationModal) {
      setSelectedReservations([]);
    }
  };
  const refreshRoomRateStatus = async () => {
    const status = await fetchRoomRateStatus(reservationData.id);
    setRoomData((prevData) =>
      prevData.map((room) => ({
        ...room,
        status: status[room.id],
      }))
    );
    setRoomRateStatus(status);
  };

  const handleUpdateRates = async () => {
    // Check if any reservations are selected
    if (selectedReservations.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Please select at least one reservation",
        icon: "error",
      });
      return;
    }

    try {
      // Extract reservation IDs from selected reservations
      const reservationIDs = selectedReservations.map(
        (reservation) => reservation.id
      );

      const requestBody = {
        reservationIDs: reservationIDs,
        groupID: reservationData.id,
      };

      const response = await fetch(
        `${API_URL}/updateGroupReservationWithRates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        Swal.fire({
          title: "Success",
          text: result.message || "Reservations updated successfully",
          icon: "success",
        });

        // Close the modal
        setTempReservationModal(false);
      } else {
        Swal.fire({
          title: "Error",
          text: result.message || "Failed to update reservations",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating reservations:", error);
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred",
        icon: "error",
      });
    }
  };

  const handleRoomRateChange = (selectedOption) => {
    // Update the selected source room
    setSelectedSourceRoom(selectedOption);

    // If a room is selected, trigger the save function
    if (selectedOption) {
      handleSaveCopyRates(selectedOption.value);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const [rooms, packages, status] = await Promise.all([
        getRoomInventoryRoomTypeID(),
        getPackageDescription(),
        fetchRoomRateStatus(reservationData.id),
      ]);

      const formattedRooms = rooms.map((room) => ({
        id: room.value,
        description: room.label,
        editable: false,
        selected: false,
        roomRate: "",
        status: status[room.value],
      }));

      const formattedPackages = packages.map((pack) => ({
        id: pack.value,
        description: pack.label,
      }));

      setRoomData(formattedRooms);
      setPackageData(formattedPackages);
      setRoomRateStatus(status);
    };
    fetchData();
  }, [reservationData.id, applySuccess]);

  const handleApplyForAllDate = async () => {
    if (!isApplyForAllDateEnabled || !selectedRoomTypeId || !dates[0]) return;
   // console.log("dates[0]",dates[0])
   let dateFormatted = Moment(dates[0]).format('DD-MM-YYYY');
  // console.log("arrivalDateFormatted",dateFormatted)

    const result = await Swal.fire({
      title: "Confirm",
      text: `Note: This will apply the same rates of ${dateFormatted} to all dates in this category`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      didOpen: () => {
        const actions = document.querySelector(".swal2-actions");
        if (actions) {
          const buttons = actions.querySelectorAll("button");
          buttons.forEach((button) => {
            button.style.margin = "0 10px";
            button.style.width = "100px";
          });
        }
      },
    });

    if (result.isConfirmed) {
      try {
        const firstDate = dates[0];
        const rateData = {
          oneAdultPrice: 0,
          twoAdultPrice: 0,
          threeAdultPrice: 0,
          fourAdultPrice: 0,
          extraAdultPrice: 0,
          extraChildPrice: 0,
          packageId: 0,
          packageRate: 0, // Add this line
        };

        gridApi.forEachNode((node) => {
          const data = node.data;
          switch (data.type) {
            case "1 Adult":
              rateData.oneAdultPrice = parseFloat(data[firstDate]) || 0;
              break;
            case "2 Adult":
              rateData.twoAdultPrice = parseFloat(data[firstDate]) || 0;
              break;
            case "3 Adult":
              rateData.threeAdultPrice = parseFloat(data[firstDate]) || 0;
              break;
            case "4 Adult":
              rateData.fourAdultPrice = parseFloat(data[firstDate]) || 0;
              break;
            case "Ex Adult":
              rateData.extraAdultPrice = parseFloat(data[firstDate]) || 0;
              break;
            case "Ex Child":
              rateData.extraChildPrice = parseFloat(data[firstDate]) || 0;
              break;
            case "Package":
              const selectedPackage = packageData.find(
                (pkg) => pkg.description === data[firstDate]
              );
              rateData.packageId = selectedPackage ? selectedPackage.id : 0;
              break;
            case "Package Rate":
              rateData.packageRate = parseFloat(data[firstDate]) || 0;
              break;
          }
        });

        const requestBody = {
          groupReservation: reservationData.id,
          RoomType: selectedRoomTypeId,
          roomrate: [rateData],
        };

        const response = await fetch(`${API_URL}/copyRoomRatesToAllDate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (data.status === "Success") {
          Swal.fire({
            title: "Success",
            text: "Rates applied to all dates successfully",
            icon: "success",
          });

          setApplySuccess((prev) => !prev);

          handleRowClick({
            data: {
              id: selectedRoomTypeId,
              description: selectedRoomType,
            },
          });
        } else {
          throw new Error(data.message || "Failed to apply rates");
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.message || "Failed to apply rates to all dates",
          icon: "error",
        });
      }
    }
  };
  //   const prepareApiData = () => {
  //     const rateData = [];
  //     dates.forEach((date) => {
  //       const dateData = {
  //         groupdate: date,
  //         oneAdultPrice:
  //           parseFloat(roomTypeRates.find((r) => r.type === "1 Adult")[date]) ||
  //           0,
  //         twoAdultPrice:
  //           parseFloat(roomTypeRates.find((r) => r.type === "2 Adult")[date]) ||
  //           0,
  //         threeAdultPrice:
  //           parseFloat(roomTypeRates.find((r) => r.type === "3 Adult")[date]) ||
  //           0,
  //         fourAdultPrice:
  //           parseFloat(roomTypeRates.find((r) => r.type === "4 Adult")[date]) ||
  //           0,
  //         extraAdultPrice:
  //           parseFloat(roomTypeRates.find((r) => r.type === "Ex Adult")[date]) ||
  //           0,
  //         extraChildPrice:
  //           parseFloat(roomTypeRates.find((r) => r.type === "Ex Child")[date]) ||
  //           0,
  //         packageId:
  //           packageData.find(
  //             (pkg) =>
  //               pkg.description ===
  //               roomTypeRates.find((r) => r.type === "Package")[date]
  //           )?.id || 0,
  //       };
  //       rateData.push(dateData);
  //     });

  //     return {
  //       groupReservation: reservationData.id,
  //       roomType: selectedRoomTypeId,
  //       roomrate: rateData,
  //     };
  //   };

  const prepareApiData = () => {
    const rateData = [];
    dates.forEach((date) => {
      const dateData = {
        groupdate: date,
        oneAdultPrice:
          parseFloat(roomTypeRates.find((r) => r.type === "1 Adult")[date]) ||
          0,
        twoAdultPrice:
          parseFloat(roomTypeRates.find((r) => r.type === "2 Adult")[date]) ||
          0,
        threeAdultPrice:
          parseFloat(roomTypeRates.find((r) => r.type === "3 Adult")[date]) ||
          0,
        fourAdultPrice:
          parseFloat(roomTypeRates.find((r) => r.type === "4 Adult")[date]) ||
          0,
        extraAdultPrice:
          parseFloat(roomTypeRates.find((r) => r.type === "Ex Adult")[date]) ||
          0,
        extraChildPrice:
          parseFloat(roomTypeRates.find((r) => r.type === "Ex Child")[date]) ||
          0,
        packageId:
          packageData.find(
            (pkg) =>
              pkg.description ===
              roomTypeRates.find((r) => r.type === "Package")[date]
          )?.id || 0,
        packageRate:
          parseFloat(
            roomTypeRates.find((r) => r.type === "Package Rate")[date]
          ) || 0, // Add this line
      };
      rateData.push(dateData);
    });

    return {
      groupReservation: reservationData.id,
      roomType: selectedRoomTypeId,
      roomrate: rateData,
    };
  };
  const handleSaveAll = async () => {
    if (!isSaveAllEnabled) return;

    try {
      const apiData = prepareApiData();

      //console.log("apiData", apiData);

      // Add tempReservationIDs to the request
      apiData.tempReservationIDs = tempReservationIDs;

      const response = await fetch(
        `${API_URL}/addDayWiseRoomandRateDetailsForGroup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      const result = await response.json();

      if (result.status === "Success") {
        await refreshRoomRateStatus();
        Swal.fire({
          title: "Success",
          text: "Room rates saved successfully",
          icon: "success",
          allowOutsideClick: false,
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#dc3545",
          html: `
            <p>Room rate updated successfully. Do you want to apply the changes to existing reservations if present?</p>
            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px;">
              <button id="confirmBtn" class="swal2-confirm swal2-styled" style="min-width: 80px;">Yes</button>
              <button id="cancelBtn" class="swal2-cancel swal2-styled" style="min-width: 80px;">No</button>
            </div>
          `,
          didOpen: () => {
            document.getElementById("confirmBtn").addEventListener("click", () => {
              Swal.close();
              applyRes();
            });
            document.getElementById("cancelBtn").addEventListener("click", () => {
              Swal.close();
              setIsSaveAllEnabled(false);
              setTempReservationIDs([]);
              setOptions2(false);
            });
          },
          showConfirmButton: false,
          showCancelButton: false,
        });
      }
      
     
      else {
        throw new Error(result.message || "Failed to save room rates");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to save room rates",
        icon: "error",
      });
    }
  };

  const handleCellValueChanged = (params) => {
    const allData = [];
    params.api.forEachNode((node) => {
      if (node.data.type !== "Package Rate") {
        allData.push(node.data);
      }
    });
  
    const columnFillCount = {};
    const totalRows = allData.length;
  
    dates.forEach((date) => {
      columnFillCount[date] = 0;
    });
  
    allData.forEach((row) => {
      dates.forEach((date) => {
        if (row[date] != null && row[date] !== "") {
          columnFillCount[date]++;
        }
      });
    });
  
    console.log("Column Fill Count:", columnFillCount);
    
    const isFirstColumnEdited = params.column && params.column.colId === dates[0];
    const isFirstColumnFilled = columnFillCount[dates[0]] === totalRows;
    
    const isApplyEnabled = (dates.length > 1 && isFirstColumnFilled && isFirstColumnEdited)
    console.log("isFirstColumnEdited",isFirstColumnEdited)
    setIsApplyForAllDateEnabled(isApplyEnabled);
  
    const areAllColumnsFilled = dates.every(
      (date) => columnFillCount[date] === totalRows
    );
  
    setIsSaveAllEnabled(areAllColumnsFilled);
  };

  const handleSaveCopyRates = async (sourceRoomDescription) => {
    // Validate target room selection
    const selectedRow = roomData.find((room) => room.selected);
    if (!selectedRow) {
      Swal.fire({
        title: "Error",
        text: "Please select a target room type first",
        icon: "error",
      });
      return;
    }

    // Validate source room description
    if (!sourceRoomDescription) {
      Swal.fire({
        title: "Error",
        text: "Please select a room type to copy rates from",
        icon: "error",
      });
      return;
    }

    // Find source room by description
    const sourceRoom = roomData.find(
      (room) => room.description === sourceRoomDescription
    );
    if (!sourceRoom) {
      Swal.fire({
        title: "Error",
        text: "Invalid source room type",
        icon: "error",
      });
      return;
    }

    // Confirm action with user
    const result = await Swal.fire({
      title: "Confirm Copy",
      text: `Do you wish to copy room rates from ${sourceRoomDescription} to ${selectedRow.description} ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      didOpen: () => {
        const actions = document.querySelector(".swal2-actions");
        if (actions) {
          const buttons = actions.querySelectorAll("button");
          buttons.forEach((button) => {
            button.style.margin = "0 10px";
            button.style.width = "100px"; // Add spacing between buttons
          });
        }
      },
    });

    if (result.isConfirmed) {
      try {
        const response = await copyRoomRates(
          reservationData.id,
          sourceRoom.id,
          selectedRow.id
        );

        if (response.status === "Success") {
          Swal.fire({
            title: "Success",
            text: "Room rates copied successfully",
            icon: "success",
          });

          setApplySuccess((prev) => !prev);
          handleRowClick({ data: selectedRow });
        } 
        else {
          Swal.fire({
            title: "Error",
            text: response.message || "Failed to copy room rates",
            icon: "error",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to copy room rates",
          icon: "error",
        });
      }
    }
  };

  // Custom row style function

  const applyRes = async () => {
    try {
      const response = await fetch(
        `${API_URL}/fetchGroupReservationWithRates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            blockCodeID: reservationData.id,
          }),
        }
      );

      const result = await response.json();

      if (result.data) {
        // Open modal with temporary reservations
        setTempReservationData(result.data);

        setTempReservationModal(true);
      } else {
        // If no temp reservations, proceed with existing flow
        setTempReservationData(result.data);
      }
    } catch (error) {
      console.error("Error fetching temporary reservations:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch reservations",
        icon: "error",
      });
    }
  };

  const handleRowClick = async (params) => {
    const roomTypeId = params.data.id;
    const roomTypeLabel = params.data.description;

    // Update selected row and editability
    setSelectedRoomTypeId(roomTypeId);
    setSelectedRowId(roomTypeId);
    const updatedRoomData = roomData.map((room) => ({
      ...room,
      editable: room.id === roomTypeId,
      selected: room.id === roomTypeId, // Update selected state
    }));
    setRoomData(updatedRoomData);

    setSelectedRoomType(roomTypeLabel);
    setOptions2(true);
    const groupData = await fetchGroupDate(reservationData.id, roomTypeId);

    const shoulderDatesResponse = await fetchShoulderDates(reservationData.id);

    if (shoulderDatesResponse.length > 0) {
      const { shoulderStartDate, shoulderEndDate } = shoulderDatesResponse[0];
      const formattedShoulderStartDate = shoulderStartDate.split("T")[0];
      const formattedShoulderEndDate = shoulderEndDate.split("T")[0];
      generateDateRows(
        groupData,
        formattedShoulderStartDate,
        formattedShoulderEndDate
      );
    }
  };

  const tempReservationColumnDefs = [
    {
      headerCheckboxSelection: true,

      checkboxSelection: true,

      width: 50,

      suppressMenu: true,

      resizable: false,
    },



    {

        headerName: "Room Type",

        field: "roomType",

        maxWidth: 130,

        autoHeaderHeight: true,

        wrapHeaderText: true,

        filter: 'agTextColumnFilter', 

      },

    {

      headerName: "Guest Name",

      field: "fullName",

      maxWidth: 150,

      autoHeaderHeight: true,

      wrapHeaderText: true,

    },

    {

      headerName: "Booking ID",

      field: "bookingID",

      maxWidth: 130,

      autoHeaderHeight: true,

      wrapHeaderText: true,

    },

    

    {

      headerName: "Arrival Date",

      field: "arrivalDate",

      maxWidth: 140,

      autoHeaderHeight: true,

      wrapHeaderText: true,

      cellRenderer: (params) => {

        if (params.data && params.data.arrivalDate) {

          const formattedDate = Moment(params.data.arrivalDate).format(

            "DD-MM-YYYY"

          );

          return formattedDate;

        } else {

          return "";

        }

      },

    },

    {

      headerName: "Departure Date",

      field: "departureDate",

      suppressSizeToFit: true,

      maxWidth: 140,

      autoHeaderHeight: true,

      wrapHeaderText: true,

      cellRenderer: (params) => {

        if (params.data && params.data.departureDate) {

          const formattedDate = Moment(params.data.departureDate).format(

            "DD-MM-YYYY"

          );

          return formattedDate;

        } else {

          return "";

        }

      },

    },

  ];
  const getRowStyle = (params) => {
    if (params.data.selected) {
      return { backgroundColor: "#C1C1C1", color: "black" };
    }
    return null;
  };

  const generateDateRows = (
    groupData = [],
    shoulderStartDate,
    shoulderEndDate
  ) => {
    const startDate = moment(shoulderStartDate);
    const endDate = moment(shoulderEndDate);
    const datesArray = [];
    let currentDate = startDate;

    while (currentDate.isBefore(endDate)) {
      datesArray.push(currentDate.format("YYYY-MM-DD"));
      currentDate.add(1, "day");
    }

    setDates(datesArray);

    const initialRates = [
      { type: "1 Adult" },
      { type: "2 Adult" },
      { type: "3 Adult" },
      { type: "4 Adult" },
      { type: "Ex Adult" },
      { type: "Ex Child" },
      { type: "Package" },
      { type: "Package Rate" },
    ];

    const populatedRates = initialRates.map((rateRow) => {
      const newRow = { ...rateRow };
      datesArray.forEach((date) => {
        const matchingData = groupData.find(
          (data) => data.groupdate.split("T")[0] === date
        );

        if (matchingData) {
          switch (rateRow.type) {
            case "1 Adult":
              newRow[date] = matchingData.oneAdultPrice || 0;
              break;
            case "2 Adult":
              newRow[date] = matchingData.twoAdultPrice || 0;
              break;
            case "3 Adult":
              newRow[date] = matchingData.threeAdultPrice || 0;
              break;
            case "4 Adult":
              newRow[date] = matchingData.fourAdultPrice || 0;
              break;
            case "Ex Adult":
              newRow[date] = matchingData.extraAdultPrice || 0;
              break;
            case "Ex Child":
              newRow[date] = matchingData.extraChildPrice || 0;
              break;
            case "Package":
              const selectedPackage = packageData.find(
                (pkg) => pkg.id === matchingData.packageId
              );
              newRow[date] = selectedPackage
                ? selectedPackage.description
                : "Select";
              break;
            case "Package Rate":
              newRow[date] = matchingData.packageRate || 0;
              break;
            default:
              newRow[date] = 0;
          }
        } else {
          newRow[date] = "";
        }
      });
      return newRow;
    });

    setRoomTypeRates(populatedRates);
  };

  const cellStyle = {
    width: "100px",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "3px",
    padding: "1px",
    outline: "none",
    boxShadow: "none",
  };

  const columnDefs2 = [
    {
      headerName: "Type/Date",
      field: "type",
      headerClass: "ag-left-header",
    },
    ...dates.map((date) => {
      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date
          .toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          .replace(/ (\d{4})$/, "$1");
      };

      const baseColumn = {
        headerName: formatDate(date),
        field: date,
        headerClass: "ag-left-header",
    
        editable: true,
        cellStyle: cellStyle,
        maxWidth: 150,
        valueFormatter: (params) => {
          // console.log(params)
          if (params.value === "" || params.value === undefined) {
            if (params?.data?.type === "Package") {
              return "Select";
            }
            return "";
          }
          return params.value;
        },

        cellEditorSelector: (params) => {
          if (params?.data?.type === "Package") {
            return {
              component: "agSelectCellEditor",
              params: {
                values: packageData.map((pkg) => pkg.description),
                defaultValue: packageData[0]?.description,
                allowTyping: false,
                filterList: true,
                highlightMatch: true,
                valueListMaxHeight: 220,
              },
            };
          }
          return null;
        },
        onCellValueChanged: async (params) => {
          if (params.data.type === "Package") {
            try {
              const selectedPackage = packageData.find(
                (pkg) => pkg.description === params.newValue
              );

              // if (!selectedPackage) {
              //     console.warn('Selected package not found');
              //     return;
              // }

              // Make API call to get package rate
              const response = await fetch(
                API_URL + "/getPackageRateForGroupReservation",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    packageID: selectedPackage.id,
                  }),
                }
              );

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const result = await response.json();

              let newRate;
              if (result.status === "success") {
                if (typeof result.data === "object" && result.data !== null) {
                  newRate = result.data.rate;
                } else if (typeof result.data === "number") {
                  newRate = result.data;
                } else {
                  console.error("Unexpected rate data format:", result.data);
                  throw new Error("Invalid rate format in response");
                }

                newRate = Number(newRate).toFixed(2);

                const currentColumn = params.column.colId;

                let packageRateRow = null;
                params.api.forEachNode((node) => {
                  if (node.data.type === "Package Rate") {
                    packageRateRow = node;
                  }
                });

                if (packageRateRow) {
                  packageRateRow.setDataValue(currentColumn, newRate);

                  params.api.refreshCells({
                    rowNodes: [packageRateRow],
                    columns: [currentColumn],
                    force: true,
                  });

                  setTimeout(() => {
                    params.api.flashCells({
                      rowNodes: [packageRateRow],
                      columns: [currentColumn],
                    });
                  }, 100);
                } else {
                  console.error("Package Rate row not found");
                }
              } else {
                throw new Error("API returned unsuccessful status");
              }
            } catch (error) {
              console.error("Error updating package rate:", error);
              alert("Failed to update package rate. Please try again.");
            }
          }
        },
      };

      return baseColumn;
    }),
  ];

  const gridOptions = {
    columnDefs: columnDefs2,
    rowData: roomTypeRates,
    onGridReady: (params) => {
      gridApi = params.api;
    },
    stopEditingWhenCellValueChanges: true,
    enableCellChangeFlash: true,
    stopEditingWhenCellsLoseFocus: true,
    suppressPropertyNamesCheck: true,
  };

  const onGridReady = (params) => {
    gridRef1.current = params.api;
    // Apply default sort
    gridRef1.current.setSortModel([
      {
        colId: "description",
        sort: "asc",
      },
    ]);
  };

  const columnDefs1 = [
    {
      headerName: "Room Type",
      field: "description",
      sortable: true,
      sort: "asc",
      comparator: (valueA, valueB, nodeA, nodeB) => {
        return nodeA.data.id - nodeB.data.id;
      },
      cellStyle: (params) => {
        if (params.data.selected) {
          return { color: "white" };
        }
        return null;
      },
    },

    {
      headerName: "Rate Creation Status",
      field: "status",
      cellStyle: (params) => {
        const baseStyle = params.data.selected ? { color: "white" } : {};
        return {
          ...baseStyle,
          color: params.value === "Completed" ? "green" : "red",
          fontWeight: "bold",
        };
      },
    },
    {
      headerName: "Action",
      cellRendererFramework: (params) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button color="primary" onClick={() => handleRowClick(params)}>
            View/Create
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h3>Group Rate Plan</h3>
          <p>
            Please create group rate plan before further addition of reservation
          </p>

          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "30px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {reservationData.status === "Definite" && (
              <Button color="primary" onClick={applyRes}>
                Apply Rates to Reservation
              </Button>
            )}
          </div>
        </div>
      </div>

      <div
        className="ag-theme-alpine"
        style={{ height: 400, marginTop: "10px", width: "100%" }}
      >
        <AgGridReact
          ref={gridRef1}
          rowData={roomData}
          columnDefs={columnDefs1}
          rowSelection="single"
          singleClickEdit={true}
          getRowStyle={getRowStyle}
          enableSorting={true}
          onGridReady={onGridReady}
        />
      </div>

      <Modal
        isOpen={options2}
        toggle={() => setOptions2(!options2)}
        className="modal-dialog-centered"
        style={{ maxWidth: "700px", width: "700px", margin: "auto" }}
      >
        <ModalHeader
          toggle={() => setOptions2(!options2)}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Add Room Rates
        </ModalHeader>
        <ModalBody>
          {selectedRoomType && roomData && (
            <div style={{ marginTop: "20px", position: "relative" }}>
              <h1>
                <b>{selectedRoomType}</b>
              </h1>
              <p>Add Room rates for this room category</p>

              {/* Container for the dropdown and Save All button */}
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {/* Dropdown for "Copy Room Rates" */}
                <Select
                  style={{ width: "200px" }}
                  value={selectedSourceRoom}
                  onChange={handleRoomRateChange}
                  options={roomData
                    .filter(
                      (room) =>
                        room.id !== selectedRoomTypeId && // Exclude current room type
                        room.status === "Completed" // Only include rooms with 'Completed' status
                    )
                    .map((room) => ({
                      value: room.description,
                      label: room.description,
                    }))}
                  placeholder="Copy Room Rates"
                  isClearable
                />

                {/* "Save All" Button */}
                <Button
                  color="success"
                  disabled={!isSaveAllEnabled}
                  onClick={handleSaveAll}
                >
                  Save All
                </Button>
              </div>

              {/* AG Grid container */}
              <div
                className="ag-theme-alpine"
                style={{ height: 400, width: "100%", marginTop: "10px" }}
              >
                <AgGridReact
                  rowData={roomTypeRates}
                  gridOptions={gridOptions}
                  columnDefs={columnDefs2}
                  rowSelection="single"
                  onCellValueChanged={handleCellValueChanged}
                  onGridReady={(params) => setGridApi(params.api)}
                  singleClickEdit={true}
                />
              </div>

              {/* Button and text container */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                  gap: "10px",
                }}
              >
                <Button
                  color="success"
                  style={{ marginLeft: "150px" }}
                  disabled={!isApplyForAllDateEnabled}
                  onClick={handleApplyForAllDate}
                >
                  Apply for all Date
                </Button>
                <p style={{ color: "red", margin: 0 }}>*</p>
                <p style={{ margin: 0 }}>
                  It will apply the same rates to all dates in this category
                </p>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>

      {/* Temporary Reservations Modal */}
      <Modal
        isOpen={tempReservationModal}
        //toggle={() => setTempReservationModal(!tempReservationModal)}
        toggle={toggleTempReservationModal}
        className="modal-dialog-centered modal-lg"
        // style={{ maxWidth: '700px', width: '700px', margin: 'auto' }}
      >
        <ModalHeader toggle={toggleTempReservationModal}>
          Select Reservations
        </ModalHeader>
        <ModalBody>
          <div
            className="ag-theme-alpine"
            style={{ height: 500, width: "100%" }}
          >
            <AgGridReact
              rowData={tempReservationData}
              columnDefs={tempReservationColumnDefs}
              rowSelection="multiple"
              suppressRowClickSelection={true} // This can help prevent unintended deselections
              onSelectionChanged={(params) => {
                const selectedRows = params.api.getSelectedRows();
                setSelectedReservations(selectedRows);
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <Button
              color="primary"
              onClick={handleUpdateRates}
              disabled={selectedReservations.length === 0}
            >
              Update Rates
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default RoomRatePage;
