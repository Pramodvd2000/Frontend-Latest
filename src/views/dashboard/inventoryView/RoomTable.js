
// // import { useState, useEffect, useCallback } from "react";
// // import { Scheduler } from "@bitnoi.se/react-scheduler";
// // import dayjs from "dayjs";
// // import isBetween from "dayjs/plugin/isBetween"; // Import the plugin

// // export default function Component() {
// //   const [filterButtonState, setFilterButtonState] = useState(0);
// //   const [isLoading, setIsLoading] = useState(false);

// //   const [range, setRange] = useState({
// //     startDate: new Date().toISOString(),
// //     endDate: new Date().toISOString()
// //   });

// //   const handleRangeChange = useCallback((newRange) => {
// //     setRange({
// //       startDate: newRange.startDate.toISOString(),
// //       endDate: newRange.endDate.toISOString(),
// //     });
// //   }, []);
// //   dayjs.extend(isBetween); // Extend dayjs with the plugin

// //   const filteredMockedSchedulerData = mockedSchedulerData.map((person) => ({
// //     ...person,
// //     data: person.data.filter(
// //       (project) =>
// //         dayjs(project.startDate).isBetween(range.startDate, range.endDate, null, "[]") ||
// //         dayjs(project.endDate).isBetween(range.startDate, range.endDate, null, "[]") ||
// //         (dayjs(project.startDate).isBefore(range.startDate) &&
// //           dayjs(project.endDate).isAfter(range.endDate))
// //     ),
// //   }));

// //   return (
// //     console.log('Hello World'),
// //     <section style={{ marginTop: "50px" }}>
// //       <Scheduler
// //         data={filteredMockedSchedulerData}
// //         isLoading={isLoading}
// //         onRangeChange={handleRangeChange}
// //         onTileClick={(clickedResource) => console.log(clickedResource)}
// //         onItemClick={(item) => console.log(item)}
// //         onFilterData={() => setFilterButtonState(1)}
// //         onClearFilterData={() => setFilterButtonState(0)}
// //         config={{
// //           zoom: 0,
// //           filterButtonState,
// //         }}
// //       />
// //     </section>
// //   );
// // }

// import { useState, useEffect, useCallback } from "react";

// import { Scheduler } from "@bitnoi.se/react-scheduler";
// import dayjs from "dayjs";
// import isBetween from "dayjs/plugin/isBetween";
// import API_URL from "../../../config";
// dayjs.extend(isBetween);

// export default function Component() {
//   const [filterButtonState, setFilterButtonState] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [MockedSchedulerData, setMockedSchedulerData] = useState([]);
//   const [range, setRange] = useState({
//     startDate: new Date().toISOString(),
//     endDate: new Date().toISOString(),
//   });

//   const handleRangeChange = useCallback((newRange) => {
//     setRange({
//       startDate: new Date(newRange.startDate).toISOString(),
//       endDate: new Date(newRange.endDate).toISOString(),
//     });
//   }, []);


//   const formatApiResponse = (apiData) => {
//     if (!Array.isArray(apiData)) return [];

//     const groupedRooms = apiData.reduce((acc, room) => {
//       const roomId = `room-${room.roomID?.toString() || Math.random()}`;
//       if (!acc[roomId]) {
//         acc[roomId] = {
//           id: roomId,
//           label: {
//             icon: "https://picsum.photos/24",
//             title: `Room ${room.roomNumber}`,
//             subtitle: room.roomType || "Unknown Type",
//           },
//           data: [],
//         };
//       }

//       acc[roomId].data.push({
//         id: room.reservationID?.toString() || `res-${Math.random()}`,
//         startDate: room.occupancy_date || "",
//         endDate: room.occupancy_date || "",
//         occupancy: room.occupancyDuration || 0,
//         title: `Booking for ${room.guestName || "Guest"}`,
//         subtitle: `Guest: ${room.guestName || "Unknown"}`,
//         description: room.purpose || "N/A",
//         bgColor: room.assignStatus === "Assigned" ? "rgb(76,175,80)" : "rgb(254,165,177)", // Green if assigned, pink otherwise
//       });

//       return acc;
//     }, {});

//     return Object.values(groupedRooms);
//   };
//   // Example usage inside fetchData function:
// useEffect(() => {
//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(API_URL + "/getOccupancyRoomWiseInventoryView", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ hotelID: 10 }),
//       });

//       const data = await response.json();
//       console.log("API Response:", data);

//       const formattedData = formatApiResponse(data.data);
//       console.log("Formatted Data:", formattedData);

//       setMockedSchedulerData(formattedData);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setMockedSchedulerData([]);
//     }
//     setIsLoading(false);
//   };

//   fetchData();
// }, []);

// const filteredMockedSchedulerData = MockedSchedulerData.map((person) => ({
//   ...person,
//   data: person.data.filter(
//     (project) =>
//       dayjs(project.startDate).isBetween(range.startDate, range.endDate, null, "[]") ||
//       dayjs(project.endDate).isBetween(range.startDate, range.endDate, null, "[]") ||
//       (dayjs(project.startDate).isBefore(range.startDate) &&
//         dayjs(project.endDate).isAfter(range.endDate))
//   ),
// }));


// console.log(MockedSchedulerData)
//   return (
//     <div style={{
//       display: "flex",
//       justifyContent: "center",
//       padding: "20px",
//       backgroundColor: "#f5f5f5",
//     }}>
//       <div style={{
//         width: "800px",  // Fixed width
//         height: "500px", // Fixed height
//         overflow: "hidden",
//         border: "1px solid #ddd",
//         borderRadius: "8px",
//         boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//       }}>
//         <Scheduler
//           data={filteredMockedSchedulerData}
//           isLoading={isLoading}
//           onRangeChange={handleRangeChange}
//           config={{
//             zoom: 0,
//             filterButtonState,
//           }}
//           style={{
//             width: "100% !important",
//             height: "100% !important",
//             minWidth: "0 !important", // Prevents flex/grid issues
//             maxWidth: "0 !important", // Prevents flex/grid issues
//           }}
//         />
//       </div>
//     </div>
//   );
// }
// const mockedSchedulerData = [
//   {
//     "id": "room-101",
//     "label": {
//       "icon": "https://picsum.photos/24",
//       "title": "Room 101",
//       "subtitle": "Deluxe Suite"
//     },
//     "data": [
//       {
//         "id": "8b71a8a5-33dd-4fc8-9caa-b4a584ba3762",
//         "startDate": "2023-04-13T15:31:24.272Z",
//         "endDate": "2023-08-28T10:28:22.649Z",
//         "occupancy": 3600,
//         "title": "Booking A",
//         "subtitle": "Guest: John Doe",
//         "description": "Stayed for business trip",
//         "bgColor": "rgb(254,165,177)"
//       },
//       {
//         "id": "22fbe237-6344-4c8e-affb-64a1750f33bd",
//         "startDate": "2023-10-07T08:16:31.123Z",
//         "endDate": "2023-11-15T21:55:23.582Z",
//         "occupancy": 2852,
//         "title": "Booking B",
//         "subtitle": "Guest: Jane Smith",
//         "description": "Vacation stay",
//         "bgColor": "rgb(254,165,177)"
//       }
//     ]
//   },
//   {
//     "id": "room-102",
//     "label": {
//       "icon": "https://picsum.photos/24",
//       "title": "Room 102",
//       "subtitle": "Executive Suite"
//     },
//     "data": [
//       {
//         "id": "3601c1cd-f4b5-46bc-8564-8c983919e3f5",
//         "startDate": "2023-03-30T22:25:14.377Z",
//         "endDate": "2023-09-01T07:20:50.526Z",
//         "occupancy": 1800,
//         "title": "Booking C",
//         "subtitle": "Guest: Michael Johnson",
//         "bgColor": "rgb(254,165,177)"
//       },
//       {
//         "id": "b088e4ac-9911-426f-aef3-843d75e714c2",
//         "startDate": "2023-10-28T10:08:22.986Z",
//         "endDate": "2023-10-30T12:30:30.150Z",
//         "occupancy": 11111,
//         "title": "Booking D",
//         "subtitle": "Guest: Emily Davis",
//         "description": "Conference stay",
//         "bgColor": "rgb(254,165,177)"
//       }
//     ]
//   }


// ];

// import { useState, useEffect, useCallback } from "react";
// import { Scheduler } from "@bitnoi.se/react-scheduler";
// import dayjs from "dayjs";
// import isBetween from "dayjs/plugin/isBetween";
// import API_URL from "../../../config";
// dayjs.extend(isBetween);


// export default function Component() {
//   const [filterButtonState, setFilterButtonState] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [rooms, setRooms] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [range, setRange] = useState({
//     startDate: new Date().toISOString(),
//     endDate: new Date().toISOString(),
//   });

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     setIsLoading(true);
//   //     try {
//   //       let response = await fetch(API_URL + "/getOccupancyRoomWiseInventoryView", {
//   //         method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify({ hotelID: 10 }),
//   //       });

//   //       let data = await response.json();
//   //       console.log("API Response:", data);

//   //       if (Array.isArray(data.data)) {
//   //         // 1️⃣ Create a list of unique rooms
//   //         const updatedRooms = data.data.map((room) => ({
//   //           id: room.roomID.toString(),
//   //           title: `${room.roomNumber} - ${room.roomStatus}`,
//   //         }));

//   //         // 2️⃣ Group reservations by `mainReservationID`
//   //         const groupedReservations = data.data.reduce((acc, room) => {
//   //           if (!room.mainReservationID) return acc;

//   //           const resID = room.reservationID?.toString() || `temp-${room.roomID}`;

//   //           if (!acc[room.mainReservationID]) {
//   //             acc[room.mainReservationID] = {
//   //               id: resID,
//   //               resourceId: room.roomNumber.toString(),
//   //               title: room.guestName || "Guest",
//   //               start: room.occupancy_date,
//   //               end: room.occupancy_date,
//   //               backgroundColor: room.assignStatus === "Assigned" ? "#28a745" : "#dc3545",
//   //               extendedProps: {
//   //                 guestName: room.guestName,
//   //                 checkIn: room.occupancy_date,
//   //                 checkOut: room.occupancy_date,
//   //                 assignStatus: room.assignStatus,
//   //               },
//   //             };
//   //           } else {
//   //             // Update start & end dates
//   //             acc[room.mainReservationID].start = dayjs(room.occupancy_date).isBefore(acc[room.mainReservationID].start)
//   //               ? room.occupancy_date
//   //               : acc[room.mainReservationID].start;
//   //             acc[room.mainReservationID].end = dayjs(room.occupancy_date).isAfter(acc[room.mainReservationID].end)
//   //               ? room.occupancy_date
//   //               : acc[room.mainReservationID].end;
//   //           }
//   //           return acc;
//   //         }, {});

//   //         // 3️⃣ Convert grouped reservations to array
//   //         const formattedEvents = Object.values(groupedReservations);

//   //         console.log("Final Events:", formattedEvents);
//   //         setEvents(formattedEvents);
//   //         setRooms(updatedRooms);
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching data:", error);
//   //     }
//   //     setIsLoading(false);
//   //   };

//   //   fetchData();
//   // }, []);



// useEffect(() => {
//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       let response = await fetch(API_URL + "/getOccupancyRoomWiseInventoryView", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ hotelID: 10 }),
//       });

//       let data = await response.json();
//       console.log("API Response:", data);

//       if (Array.isArray(data.data)) {
//         const updatedRooms = data.data.map((room) => ({
//           id: room.roomID?.toString() || `room-${Math.random()}`,
//           title: `${room.roomNumber} - ${room.roomStatus}`,
//         }));

//         const groupedReservations = data.data.reduce((acc, room) => {
//           if (!room.mainReservationID) return acc;

//           const resID = room.reservationID?.toString() || `temp-${room.roomID}`;

//           if (!acc[room.mainReservationID]) {
//             acc[room.mainReservationID] = {
//               id: resID,
//               resourceId: room.roomNumber?.toString() || "",
//               title: room.guestName || "Guest",
//               start: room.occupancy_date || "",
//               end: room.occupancy_date || "",
//               backgroundColor: room.assignStatus === "Assigned" ? "#28a745" : "#dc3545",
//               extendedProps: {
//                 guestName: room.guestName || "N/A",
//                 checkIn: room.occupancy_date || "",
//                 checkOut: room.occupancy_date || "",
//                 assignStatus: room.assignStatus || "Unknown",
//               },
//             };
//           } else {
//             acc[room.mainReservationID].start = dayjs(room.occupancy_date).isBefore(acc[room.mainReservationID].start)
//               ? room.occupancy_date
//               : acc[room.mainReservationID].start;
//             acc[room.mainReservationID].end = dayjs(room.occupancy_date).isAfter(acc[room.mainReservationID].end)
//               ? room.occupancy_date
//               : acc[room.mainReservationID].end;
//           }
//           return acc;
//         }, {});

//         const formattedEvents = Object.values(groupedReservations);
//         console.log("Updated Rooms:", updatedRooms);
//         console.log("Formatted Events:", formattedEvents);

//         setEvents(formattedEvents);
//         setRooms(updatedRooms);
//       } else {
//         setEvents([]); // Ensure events is always an array
//         setRooms([]);  // Ensure rooms is always an array
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setEvents([]); // Handle error cases by resetting state
//       setRooms([]);
//     }
//     setIsLoading(false);
//   };

//   fetchData();
// }, []);


//   const handleRangeChange = useCallback((newRange) => {
//     setRange({
//       startDate: new Date(newRange.startDate).toISOString(),
//       endDate: new Date(newRange.endDate).toISOString(),
//     });
//   }, []);

//   // 4️⃣ Filter events based on selected range
//   // const filteredEvents = events.filter(
//   //   (event) =>
//   //     dayjs(event.start).isBetween(range.startDate, range.endDate, null, "[]") ||
//   //     dayjs(event.end).isBetween(range.startDate, range.endDate, null, "[]") ||
//   //     (dayjs(event.start).isBefore(range.startDate) && dayjs(event.end).isAfter(range.endDate))
//   // );

//   const filteredEvents = events.filter((event) => {
//     const eventStart = dayjs(event.start).startOf("day");
//     const eventEnd = dayjs(event.end).startOf("day");
//     const rangeStart = dayjs(range.startDate).startOf("day");
//     const rangeEnd = dayjs(range.endDate).startOf("day");

//     return (
//       eventStart.isBetween(rangeStart, rangeEnd, null, "[]") ||
//       eventEnd.isBetween(rangeStart, rangeEnd, null, "[]") ||
//       (eventStart.isBefore(rangeStart) && eventEnd.isAfter(rangeEnd))
//     );
//   });

//   console.log(filteredEvents)

//   console.log()
//   return (
//     <div style={{
//       display: "flex",
//       justifyContent: "center",
//       padding: "20px",
//       backgroundColor: "#f5f5f5",
//     }}>
//       <div style={{
//         width: "800px",
//         height: "500px",
//         overflow: "hidden",
//         border: "1px solid #ddd",
//         borderRadius: "8px",
//         boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//       }}>
//         {rooms && filteredEvents &&
//           // <Scheduler
//           //   resources={rooms} // Left column with room numbers
//           //   data={filteredEvents || []} // Events based on mainReservationID
//           //   isLoading={isLoading}
//           //   onRangeChange={handleRangeChange}
//           //   config={{
//           //     zoom: 0,
//           //     filterButtonState,
//           //   }}
//           //   // style={{
//           //   //   width: "100% !important",
//           //   //   height: "100% !important",
//           //   //   minWidth: "0 !important",
//           //   //   maxWidth: "0 !important",
//           //   // }}

//           //   style={{
//           //     width: "100%",
//           //     height: "100%",
//           //     minWidth: "0",
//           //     maxWidth: "none",
//           //   }}

//           // />
//           <Scheduler
//             resources={rooms.length > 0 ? rooms : []} // Ensure it's always an array
//             data={filteredEvents.length > 0 ? filteredEvents : []} // Ensure it's always an array
//             isLoading={isLoading}
//             onRangeChange={handleRangeChange}
//             config={{ zoom: 0, filterButtonState }}
//             style={{ width: "100%", height: "100%", minWidth: "0", maxWidth: "none" }}
//           />

//         }
//       </div>
//     </div>
//   );
// }




import { useState, useEffect, useCallback } from "react";

import { Scheduler } from "@bitnoi.se/react-scheduler";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import API_URL from "../../../config";
import './Calendar.css'
import minMax from "dayjs/plugin/minMax";  // Import the minMax plugin
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
dayjs.extend(isBetween);
dayjs.extend(minMax);  // Extend dayjs with minMax

export default function Component() {
  const [filterButtonState, setFilterButtonState] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [MockedSchedulerData, setMockedSchedulerData] = useState([]);
  const [open, setOpen] = useState(false);
  const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
  const [range, setRange] = useState({
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
  });

  const handleRangeChange = useCallback((newRange) => {
    setRange({
      startDate: new Date(newRange.startDate).toISOString(),
      endDate: new Date(newRange.endDate).toISOString(),
    });
  }, []);




  const formatApiResponse = (apiResponse) => {
    if (!Array.isArray(apiResponse)) {
      console.error("formatApiResponse Error: Expected an array but received", apiResponse);
      return [];
    }

    const groupedData = {};

    apiResponse.forEach((item) => {
      if (!item) {
        console.error("Skipping undefined item in API response:", item);
        return;
      }

      const { mainReservationID, roomID, roomNumber, roomType, guestName, purpose, assignStatus, arrivalDate, departureDate } = item;

      if (!groupedData[roomID]) {
        groupedData[roomID] = {
          id: `room-${roomID}`,
          label: {
            icon: "https://picsum.photos/24",
            title: `Room ${roomNumber}`,
            subtitle: roomType,
          },
          data: [],
        };
      }

      const startDate = arrivalDate ? new Date(arrivalDate).toISOString() : "";
      const endDate = departureDate ? new Date(departureDate).toISOString() : "";

      groupedData[roomID].data.push({
        id: mainReservationID || null,
        roomID: `room-${roomID}`,
        roomNumber,
        roomType,
        startDate,
        endDate,
        occupancy: item.occupancyDuration,
        title: guestName || "Guest",
        subtitle: guestName || "Guest",
        description: purpose || "N/A",
        bgColor: assignStatus === "Assigned" ? "rgb(76,175,80)" : "rgb(254,165,177)",
        style: {
          border: "1px solid #ddd",
        }
      });
    });

    return Object.values(groupedData);
  };




  useEffect(() => {
    const fetchData = async () => {
      setOpen(true);
      // Start a timer to check if the response takes more than 5 seconds
      const timeout = setTimeout(() => {
        setShowSecondaryMessage(true);
      }, 5000);

      setIsLoading(true);
      try {
        const response = await fetch(API_URL + "/getOccupancyRoomWiseInventoryView", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hotelID: 10 }),
        });

        const data = await response.json();
        console.log("API Response:", data);
        setOpen(false);
        setShowSecondaryMessage(false);
        const formattedData = formatApiResponse(data.data);
        console.log("Formatted Data:", formattedData);
        // Remove duplicates within each room's data array
        const uniqueData = formattedData.map((room) => {
          const uniqueRoomData = room.data.reduce((acc, curr) => {
            const exists = acc.some(
              (item) =>
                item.roomNumber === curr.roomNumber &&
                item.reservationID === curr.reservationID &&
                item.startDate === curr.startDate &&
                item.endDate === curr.endDate
            );

            if (!exists) {
              acc.push(curr);
            }
            return acc;
          }, []);

          return { ...room, data: uniqueRoomData }; // Update the room's data array with unique values
        });

        setMockedSchedulerData(uniqueData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMockedSchedulerData([]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const filteredMockedSchedulerData = MockedSchedulerData.map((person) => ({
    ...person,
    data: person.data.filter(
      (project) =>
        dayjs(project.startDate).isBetween(range.startDate, range.endDate, null, "[]") ||
        dayjs(project.endDate).isBetween(range.startDate, range.endDate, null, "[]") ||
        (dayjs(project.startDate).isBefore(range.startDate) &&
          dayjs(project.endDate).isAfter(range.endDate))
    ),
  }));
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };


  console.log(MockedSchedulerData)
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      padding: "20px",
      backgroundColor: "#f5f5f5",
      marginTop: "200rem",
    }}>
      <div style={{
        width: "800px",  // Fixed width
        height: "500px", // Fixed height
        overflow: "hidden",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginTop: "200rem",
      }}>
        <Scheduler
          data={filteredMockedSchedulerData}
          isLoading={isLoading}
          onRangeChange={handleRangeChange}
          onEventClick={handleEventClick}
          config={{
            zoom: 1,
            filterButtonState,
          }}
          style={{
            width: "100% !important",
            height: "100% !important",
            minWidth: "0 !important", // Prevents flex/grid issues
            maxWidth: "0 !important", // Prevents flex/grid issues
          }}
        />

        {/* BackDrop For messages */}
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ fontWeight: 'bold', color: 'white' }}>
            Processing your request. Please wait...
            </h1>
            {showSecondaryMessage && (
              <h1 style={{ fontWeight: 'bold', color: 'white' }}>
        This may take a little longer due to additional data. Thank you for your patience!
        </h1>
            )}
            <CircularProgress color="inherit" />
          </div>
        </Backdrop>

      </div>
    </div>
  );
}
