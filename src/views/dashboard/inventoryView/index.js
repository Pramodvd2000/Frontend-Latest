// import React from 'react';
// import GuestCalendar from './calenderView';

// function App() {
//   return (
//     <div className="App">
//       <h1>Guest Stay Calendar</h1>
//       <GuestCalendar />
//     </div>
//   );
// }

// export default App;
// import React from "react";
// import Fullcalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";

// function Calendar() {
//   return (
//     <div>
//       <Fullcalendar
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//         initialView={"dayGridMonth"}
//         headerToolbar={{
//           start: "today prev,next", // will normally be on the left. if RTL, will be on the right
//           center: "title",
//           end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
//         }}
//         height={"90vh"}
//       />
//     </div>
//   );
// }

// export default Calendar;



// import React from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import styled from "styled-components";
// import "./Calender.css";

// // Styled container for better responsiveness
// const CalendarContainer = styled.div`
//   max-width: 1800px;
//   margin: auto;
//   padding: 10px;
//   background: #fff;
//   border-radius: 10px;
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
// `;

// function Calendar() {
//   return (
//     <CalendarContainer>
//       <FullCalendar
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//         initialView={"dayGridMonth"}
//         headerToolbar={{
//           start: "today prev,next",
//           center: "title",
//           end: "dayGridMonth,timeGridWeek,timeGridDay",
//         }}
//         height={"auto"} // Makes it flexible
//         editable={true} // Allows dragging events
//         selectable={true} // Enables selection
//         eventBackgroundColor="#007bff" // Event styling
//         eventBorderColor="#0056b3"
//         dayMaxEventRows={2} // Limits max events shown per day
//         eventTimeFormat={{
//           hour: "2-digit",
//           minute: "2-digit",
//           meridiem: false,
//         }}
//         contentHeight="auto" // Adjusts height dynamically
//       />
//     </CalendarContainer>
//   );
// }

// export default Calendar;


// import React from "react";
// import FullCalendar from "@fullcalendar/react";
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
// import interactionPlugin from "@fullcalendar/interaction";
// import styled from "styled-components";
// import "./Calender.css";
// import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
// import  API_URL from "../../../config";
// const CalendarContainer = styled.div`
//   max-width: 1800px;
//   margin: auto;
//   padding: 10px;
//   background: #fff;
//   border-radius: 10px;
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
// `;

// const rooms = [
//   { id: "202", title: "SUP - Inspected" },
//   { id: "19997", title: "WINTER - Clean" },
//   { id: "333", title: "TD - Clean" },
//   { id: "502", title: "SUP - Clean" },
//   { id: "120", title: "SUP - Inspected" },
//   { id: "101", title: "DLX - Dirty" },
// ];

// const events = [
//   {
//     id: "1",
//     resourceId: "202",
//     title: "Esquilin, Ivo",
//     start: "2025-03-24",
//     end: "2025-03-25",
//     color: "green",
//   },
//   {
//     id: "2",
//     resourceId: "19997",
//     title: "Walker, John",
//     start: "2025-03-24",
//     end: "2025-03-26",
//     color: "blue",
//   },
//   {
//     id: "3",
//     resourceId: "101",
//     title: "Carstens, Arthur",
//     start: "2025-03-24",
//     end: "2025-03-27",
//     color: "red",
//   },
// ];

// function Calendar() {

//   const [rowData, setRowData] = useState();


//   useEffect(() => {
//     let createasset = JSON.stringify({
    
//     });
//     console.log(createasset);
//     let res = fetchx(API_URL + "/getOccupancyRoomWiseInventoryView", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: createasset,
//     }).then((res) => {
//       setRowData(res['data'])
//       //console.log(rowData)

//     })
//   }, []);


//   console.log("Inside`")
//   return (
//     <CalendarContainer>
//       <FullCalendar
//         plugins={[resourceTimelinePlugin, interactionPlugin]}
//         initialView="resourceTimelineDay"
//         headerToolbar={{
//           left: "today prev,next",
//           center: "title",
//           right: "resourceTimelineDay,resourceTimelineWeek",
//         }}
//         resourceAreaHeaderContent="Room Info"
//         resources={rooms}
//         events={events}
//         slotLabelFormat={{
//           weekday: "short",
//           day: "2-digit",
//         }}
//         height="auto"
//         editable={true}
//         selectable={true}
//       />
//     </CalendarContainer>
//   );
// }

// export default Calendar;


// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
// import interactionPlugin from "@fullcalendar/interaction";
// import styled from "styled-components";
// import "./Calender.css";
// import API_URL from "../../../config";
// import Moment from "moment";
// const CalendarContainer = styled.div`
//   max-width: 1800px;
//   margin: auto;
//   padding: 10px;
//   background: #fff;
//   border-radius: 10px;
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
// `;

// function Calendar() {
//   const [rooms, setRooms] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [Today, setToday] = useState()



//   useEffect(() => {
//       const hotelIDData = JSON.stringify({
//           hotelID: 1
//       })
//       fetchx(API_URL + "/getBusinessDate", {
//           method: "POST",
//           headers: { 'Content-Type': 'application/json' },
//           body: hotelIDData
//       }).then((res) => res.json())
//           .then(postres => {
//               const today = new Date(postres['data'][0]['businessDate']);
//               const tomorrow = new Date(today);
//               tomorrow.setDate(today.getDate() + 1);
//               setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
//           })
//   }, []);


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let response = await fetch(API_URL + "/getOccupancyRoomWiseInventoryView", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             hotelID: 10,   // Change as needed
//             // month: new Date().getMonth() + 1, // Default: Current Month
//             // year: new Date().getFullYear(),   // Default: Current Year
//           }),
//         });

//         let data = await response.json();
//         console.log(data)
//         if (Array.isArray(data.data)) {
//           // Extract room info
//           const updatedRooms = data.data.map((room) => ({
//             id: room.roomID.toString(),
//             title: `${room.roomNumber} - ${room.roomStatus}`,
//           }));

//           // Extract event info
//           console.log("Type of data.data:", typeof data.data);
// console.log("Is data.data an array?", Array.isArray(data.data));
// console.log("Data before filtering:", data.data);

//           // const updatedEvents = data.data.filter((room) => { 
//           //   console.log(room.mainReservationID), room.mainReservationID !== null
//           // })
//           const updatedEvents = data.data.filter((room) => {
//             console.log("Room:", room);
//             console.log("mainReservationID:", room.mainReservationID);
//             return room.mainReservationID !== null;
//           });
//           console.log("Filtered Data:", updatedEvents);
          
//           // updatedEvents.map((room) => ( console.log(room),{
              
//           //     id: room.reservationID?.toString() || `temp-${room.roomID}`,
//           //     resourceId: room.roomID.toString(),
//           //     title: room.guestName || "Guest",
//           //     start: room.occupancy_date,
//           //     end: room.occupancy_date, // Modify for multi-day stays
//           //     color: room.assignStatus === "Assigned" ? "green" : "red",
//           //   }));
//           // const formattedEvents = updatedEvents.map((room) => ({
//           //   id: room.reservationID?.toString() || `temp-${room.roomID}`,
//           //   resourceId: room.roomID.toString(),
//           //   title: room.guestName || "Guest",
//           //   start: room.occupancy_date,
//           //   end: room.occupancy_date, // Modify for multi-day stays if needed
//           //   color: room.assignStatus === "Assigned" ? "green" : "red",
//           // }));
//           const formattedEvents = Object.values(
//             updatedEvents.reduce((acc, room) => {
//               const resID = room.reservationID?.toString() || `temp-${room.roomID}`;
//               if (!acc[resID]) {
//                 acc[resID] = {
//                   id: resID,
//                   resourceId: room.roomID.toString(),
//                   title: room.guestName || "Guest",
//                   start: room.occupancy_date,
//                   end: room.occupancy_date, // This will be updated
//                   color: room.assignStatus === "Assigned" ? "green" : "red",
//                 };
//               } else {
//                 // Update the start and end date to cover the full stay
//                 acc[resID].start = acc[resID].start < room.occupancy_date ? acc[resID].start : room.occupancy_date;
//                 acc[resID].end = acc[resID].end > room.occupancy_date ? acc[resID].end : room.occupancy_date;
//               }
//               return acc;
//             }, {})
//           );
          
          
//           console.log("Final Events:", formattedEvents);
//           setEvents(formattedEvents);
          
// console.log(formattedEvents)
//           setRooms(updatedRooms);
//           // setEvents(updatedEvents);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);



//  ;
  
  
//   return (
//     <CalendarContainer>
//       {/* <FullCalendar
//         plugins={[resourceTimelinePlugin, interactionPlugin]}
//         initialView="resourceTimelineDay"
//         headerToolbar={{
//           left: "today prev,next",
//           center: "title",
//           right: "resourceTimelineDay,resourceTimelineWeek",
//         }}
//         resourceAreaHeaderContent="Room Info"
//         resources={rooms}
//         events={events}
//         slotLabelFormat={{
//           weekday: "short",
//           day: "2-digit",
//         }}
//         height="auto"
//         editable={true}
//         selectable={true}
//       /> */}
//       return (
//   <CalendarContainer>
//     {Today && (
//       <FullCalendar
//         plugins={[resourceTimelinePlugin, interactionPlugin]}
//         initialView="resourceTimelineDay"
//         initialDate={Today} // Set initial date dynamically
//         headerToolbar={{
//           left: "today prev,next",
//           center: "title",
//           right: "resourceTimelineDay,resourceTimelineWeek",
//         }}
//         resourceAreaHeaderContent="Room Info"
//         resources={rooms}
//         events={events}
//         slotLabelFormat={{
//           weekday: "short",
//           day: "2-digit",
//         }}
//         height="auto"
//         editable={true}
//         selectable={true}
//       />
//     )}
//   </CalendarContainer>
// );

//     </CalendarContainer>
//   );
// }

// export default Calendar;




// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
// import interactionPlugin from "@fullcalendar/interaction";
// import styled from "styled-components";
// import "./Calender.css";
// import API_URL from "../../../config";
// import Moment from "moment";
// const CalendarContainer = styled.div`
//   max-width: 1800px;
//   margin: auto;
//   padding: 10px;
//   background: #fff;
//   border-radius: 10px;
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
// `;

// function Calendar() {
//   const [rooms, setRooms] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [Today, setToday] = useState()



//   useEffect(() => {
//       const hotelIDData = JSON.stringify({
//           hotelID: 1
//       })
//       fetchx(API_URL + "/getBusinessDate", {
//           method: "POST",
//           headers: { 'Content-Type': 'application/json' },
//           body: hotelIDData
//       }).then((res) => res.json())
//           .then(postres => {
//               const today = new Date(postres['data'][0]['businessDate']);
//               const tomorrow = new Date(today);
//               tomorrow.setDate(today.getDate() + 1);
//               setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
//           })
//   }, []);


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let response = await fetch(API_URL + "/getOccupancyRoomWiseInventoryView", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             hotelID: 10,   // Change as needed
//             // month: new Date().getMonth() + 1, // Default: Current Month
//             // year: new Date().getFullYear(),   // Default: Current Year
//           }),
//         });

//         let data = await response.json();
//         console.log(data)
//         if (Array.isArray(data.data)) {
//           // Extract room info
//           const updatedRooms = data.data.map((room) => ({
//             id: room.roomID.toString(),
//             title: `${room.roomNumber} - ${room.roomStatus}`,
//           }));

//           // Extract event info
//           console.log("Type of data.data:", typeof data.data);
// console.log("Is data.data an array?", Array.isArray(data.data));
// console.log("Data before filtering:", data.data);

       
//           const updatedEvents = data.data
//           // .filter((room) => {
//           //   console.log("Room:", room);
//           //   console.log("mainReservationID:", room.mainReservationID);
//           //   return room.mainReservationID !== null;
//           // });
//           console.log("Filtered Data:", updatedEvents);
         
//           const filteredEvents = updatedEvents.filter((room) => room.mainReservationID !== null);

//           const formattedEvents = Object.values(
//             filteredEvents.reduce((acc, room) => {
//               const resID = room.reservationID?.toString() || `temp-${room.roomID}`;
//               if (!acc[resID]) {
//                 acc[resID] = {
//                   id: resID,
//                   resourceId: room.roomID.toString(),
//                   title: room.guestName,
//                   start: room.occupancy_date,
//                   end: room.occupancy_date, // This will be updated
//                   color: room.assignStatus === "Assigned" ? "green" : "red",
//                 };
//               } else {
//                 // Update the start and end date to cover the full stay
//                 acc[resID].start = acc[resID].start < room.occupancy_date ? acc[resID].start : room.occupancy_date;
//                 acc[resID].end = acc[resID].end > room.occupancy_date ? acc[resID].end : room.occupancy_date;
//               }
//               return acc;
//             }, {})
//           );
          
          
//           console.log("Final Events:", formattedEvents);
//           setEvents(formattedEvents);
          
// console.log(formattedEvents)
//           setRooms(updatedRooms);
//           // setEvents(updatedEvents);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);



//  ;
  
  
//   return (
//     <CalendarContainer>
  
//     {Today && (
//       <FullCalendar
//         plugins={[resourceTimelinePlugin, interactionPlugin]}
//         initialView="resourceTimelineDay"
//         initialDate={Today} // Set initial date dynamically
//         headerToolbar={{
//           left: "today prev,next",
//           center: "title",
//           right: "resourceTimelineDay,resourceTimelineWeek",
//         }}
//         resourceAreaHeaderContent="Room Info"
//         resources={rooms}
//         events={events}
//         slotLabelFormat={{
//           weekday: "short",
//           day: "2-digit",
//         }}
//         height="auto"
//         editable={true}
//         selectable={true}
//       />
//     )}

//     </CalendarContainer>
//   );
// }

// export default Calendar;


// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
// import interactionPlugin from "@fullcalendar/interaction";
// import styled from "styled-components";
// import "./Calender.css";
// import API_URL from "../../../config";
// import Moment from "moment";
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
// const MySwal = withReactContent(Swal)
// const CalendarContainer = styled.div`
//   max-width: 1800px;
//   margin: auto;
//   padding: 20px;
//   background: #f8f9fa;
//   border-radius: 10px;
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
// `;

// const EventStyle = styled.div`
//   padding: 5px;
//   font-size: 14px;
//   color: #fff;
//   text-align: center;
//   border-radius: 5px;
//   cursor: pointer;
// `;

// function Calendar() {
//   const [rooms, setRooms] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [Today, setToday] = useState();


//   const handleSuccess = (event) => {
//     return MySwal.fire({
//       title: `Guest - ${event.title}`,
//       html: `
//         <b>Arrival Date:</b> ${Moment(event.start).format('DD-MM-YYYY')} <br/>
//         <b>Departure Date:</b> ${Moment(event.end).format('DD-MM-YYYY')} <br/>
//       `,
//       // <b>Status:</b> ${event.extendedProps.status}

//       showConfirmButton: true,
//     });
//   };
//   useEffect(() => {
//     const hotelIDData = JSON.stringify({ hotelID: 1 });

//     fetch(API_URL + "/getBusinessDate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: hotelIDData,
//     })
//       .then((res) => res.json())
//       .then((postres) => {
//         const today = Moment(postres.data[0].businessDate).format("YYYY-MM-DD");
//         setToday(today);
//       });
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let response = await fetch(API_URL + "/getOccupancyRoomWiseInventoryView", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ hotelID: 10 }),
//         });

//         let data = await response.json();
//         console.log(data);

//         if (Array.isArray(data.data)) {
//           const updatedRooms = data.data.map((room) => ({
//             id: room.roomID.toString(),
//             title: `${room.roomNumber} - ${room.roomStatus}`,
//           }));

//           const filteredEvents = data.data.filter((room) => room.mainReservationID !== null);

//           const formattedEvents = Object.values(
//             filteredEvents.reduce((acc, room) => {
//               const resID = room.reservationID?.toString() || `temp-${room.roomID}`;
//               if (!acc[resID]) {
//                 acc[resID] = {
//                   id: resID,
//                   resourceId: room.roomID.toString(),
//                   title: room.guestName || "Guest",
//                   start: room.occupancy_date,
//                   end: room.occupancy_date,
//                   color: room.assignStatus === "Assigned" ? "#28a745" : "#dc3545",
//                   extendedProps: {
//                     guestName: room.guestName,
//                     checkIn: room.occupancy_date,
//                     checkOut: room.end_date,
//                     assignStatus: room.assignStatus,
//                   },
//                 };
//               } else {
//                 acc[resID].start = acc[resID].start < room.occupancy_date ? acc[resID].start : room.occupancy_date;
//                 acc[resID].end = acc[resID].end > room.occupancy_date ? acc[resID].end : room.occupancy_date;
//               }
//               return acc;
//             }, {})
//           );

//           console.log("Final Events:", formattedEvents);
//           setEvents(formattedEvents);
//           setRooms(updatedRooms);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const renderEventContent = (eventInfo) => {
//     return (
//       <EventStyle style={{ backgroundColor: eventInfo.event.extendedProps.color }}>
//         {eventInfo.event.title}
//       </EventStyle>
//     );
//   };

//   return (
//     <CalendarContainer>
//       {Today && (
//         <FullCalendar
//           plugins={[resourceTimelinePlugin, interactionPlugin]}
//           initialView="resourceTimelineDay"
//           initialDate={Today}
//           headerToolbar={{
//             left: "today prev,next",
//             center: "title",
//             right: "resourceTimelineDay,resourceTimelineWeek",
//           }}
//           resourceAreaHeaderContent="Room Info"
//           resources={rooms}
//           events={events}
//           slotLabelFormat={{ weekday: "short", day: "2-digit" }}
//           height="auto"
//           editable={true}
//           selectable={true}
//           eventContent={renderEventContent}
//           // eventClick={(info) => {
//           //   alert(
//           //     `Guest: ${info.event.extendedProps.guestName}\nCheck-in: ${info.event.extendedProps.checkIn}\nCheck-out: ${info.event.extendedProps.checkOut}\nStatus: ${info.event.extendedProps.assignStatus}`
//           //   );
//           // }}
//           eventClick={(info) => handleSuccess(info.event)} 

//         />
//       )}
//     </CalendarContainer>
//   );
// }

// export default Calendar;



// import React, { useState } from "react";
// import Scheduler, { SchedulerData, ViewTypes } from "react-big-scheduler";
// import "react-big-scheduler/lib/css/style.css";
// import moment from "moment";
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

// function App() {
//   return <SchedulerComponent />;
// }

// const SchedulerComponent = () => {
//   const [schedulerData, setSchedulerData] = useState(
//     new SchedulerData(moment().format("YYYY-MM-DD"), ViewTypes.Week)
//   );

//   // Define resources
//   schedulerData.setResources([
//     { id: "resource0", name: "Resource0" },
//     { id: "resource1", name: "Resource1" },
//     { id: "resource2", name: "Resource2" },
//     { id: "resource3", name: "Resource3" },
//     { id: "resource4", name: "Resource4" },
//     { id: "resource5", name: "Resource5" }
//   ]);

//   // Define events
//   schedulerData.setEvents([
//     {
//       id: 1,
//       start: "2025-03-18 10:00:00",
//       end: "2025-03-18 12:00:00",
//       resourceId: "resource0",
//       title: "I am finished",
//       bgColor: "gray"
//     },
//     {
//       id: 2,
//       start: "2025-03-18 14:00:00",
//       end: "2025-03-18 16:00:00",
//       resourceId: "resource1",
//       title: "I am locked",
//       bgColor: "red"
//     },
//     {
//       id: 3,
//       start: "2025-03-19 08:00:00",
//       end: "2025-03-21 17:00:00",
//       resourceId: "resource1",
//       title: "R1 has many tasks",
//       bgColor: "lightblue"
//     },
//     {
//       id: 4,
//       start: "2025-03-22 08:00:00",
//       end: "2025-03-22 17:00:00",
//       resourceId: "resource1",
//       title: "R1 has recurring tasks",
//       bgColor: "pink"
//     },
//     {
//       id: 5,
//       start: "2025-03-22 10:00:00",
//       end: "2025-03-22 16:00:00",
//       resourceId: "resource3",
//       title: "I am exceptional",
//       bgColor: "salmon"
//     }
//   ]);

//   // Navigation Handlers
//   const handlePrevClick = () => {
//     schedulerData.prev();
//     setSchedulerData(new SchedulerData(schedulerData.startDate, schedulerData.viewType));
//   };

//   const handleNextClick = () => {
//     schedulerData.next();
//     setSchedulerData(new SchedulerData(schedulerData.startDate, schedulerData.viewType));
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <Scheduler
//         schedulerData={schedulerData}
//         prevClick={handlePrevClick}
//         nextClick={handleNextClick}
//         onSelectDate={() => {}}
//         onViewChange={() => {}}
//         eventItemClick={() => {}}
//       />
//     </DndProvider>
//   );
// };

// export default App;



// import React, { useRef } from "react";
// import FullCalendar from "@fullcalendar/react";
// import interactionPlugin from "@fullcalendar/interaction";
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
// import "@fullcalendar/common/main.css"; 
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";
// import "@fullcalendar/resource-timeline/main.css";



// const CalendarComponent = () => {
//   const calendarRef = useRef(null);

//   return (
//     <div style={{ maxWidth: "900px", margin: "40px auto" }}>
//       <FullCalendar
//         ref={calendarRef}
//         plugins={[interactionPlugin, resourceTimelinePlugin]}
//         initialView="resourceTimelineDay"
//         timeZone="UTC"
//         aspectRatio={2.5}
//         headerToolbar={{
//           left: "prev,next",
//           center: "title",
//           right: "resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth",
//         }}
//         editable={true}
//         resourceLabelText="Rooms"
//         resources="https://fullcalendar.io/demo-resources.json?with-nesting&with-colors"
//         events="https://fullcalendar.io/demo-events.json?single-day&for-resource-timeline"
//       />
//     </div>
//   );
// };

// export default CalendarComponent;








// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
// import interactionPlugin from "@fullcalendar/interaction";
// import styled from "styled-components";
// import "./Calender.css";
// import API_URL from "../../../config";
// import Moment from "moment";
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
// import CalendarView from '../CalenderView';
// const MySwal = withReactContent(Swal)
// const CalendarContainer = styled.div`
//   max-width: 1800px;
//   margin: auto;
//   padding: 20px;
//   background: #f8f9fa;
//   border-radius: 10px;
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
// `;

// const EventStyle = styled.div`
//   padding: 5px;
//   font-size: 14px;
//   color: #fff;
//   text-align: center;
//   border-radius: 5px;
//   cursor: pointer;
// `;

// function Calendar() {
//   const [rooms, setRooms] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [Today, setToday] = useState();


//   const handleSuccess = (event) => {
//     return MySwal.fire({
//       title: `Guest - ${event.title}`,
//       html: `
//         <b>Arrival Date:</b> ${Moment(event.start).format('DD-MM-YYYY')} <br/>
//         <b>Departure Date:</b> ${Moment(event.end).format('DD-MM-YYYY')} <br/>
//       `,
//       // <b>Status:</b> ${event.extendedProps.status}

//       showConfirmButton: true,
//     });
//   };
//   useEffect(() => {
//     const hotelIDData = JSON.stringify({ hotelID: 1 });

//     fetch(API_URL + "/getBusinessDate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: hotelIDData,
//     })
//       .then((res) => res.json())
//       .then((postres) => {
//         const today = Moment(postres.data[0].businessDate).format("YYYY-MM-DD");
//         setToday(today);
//       });
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let response = await fetch(API_URL + "/getOccupancyRoomWiseInventoryView", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ hotelID: 10 }),
//         });

//         let data = await response.json();
//         console.log(data);

//         if (Array.isArray(data.data)) {
//           const updatedRooms = data.data.map((room) => ({
//             id: room.roomID.toString(),
//             title: `${room.roomNumber} - ${room.roomStatus}`,
//           }));

//           const filteredEvents = data.data.filter((room) => room.mainReservationID !== null);

//           const formattedEvents = Object.values(
//             filteredEvents.reduce((acc, room) => {
//               const resID = room.reservationID?.toString() || `temp-${room.roomID}`;
//               if (!acc[resID]) {
//                 acc[resID] = {
//                   id: resID,
//                   resourceId: room.roomID.toString(),
//                   title: room.guestName || "Guest",
//                   start: room.occupancy_date,
//                   end: room.occupancy_date,
//                   color: room.assignStatus === "Assigned" ? "#28a745" : "#dc3545",
//                   extendedProps: {
//                     guestName: room.guestName,
//                     checkIn: room.occupancy_date,
//                     checkOut: room.end_date,
//                     assignStatus: room.assignStatus,
//                   },
//                 };
//               } else {
//                 acc[resID].start = acc[resID].start < room.occupancy_date ? acc[resID].start : room.occupancy_date;
//                 acc[resID].end = acc[resID].end > room.occupancy_date ? acc[resID].end : room.occupancy_date;
//               }
//               return acc;
//             }, {})
//           );

//           console.log("Final Events:", formattedEvents);
//           setEvents(formattedEvents);
//           setRooms(updatedRooms);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
// <CalendarView/>
//   );
// }

// export default Calendar;





// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
// import interactionPlugin from "@fullcalendar/interaction";
// import styled from "styled-components";
// import "./Calender.css";
// import API_URL from "../../../config";
// import Moment from "moment";
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
// const MySwal = withReactContent(Swal)
// const CalendarContainer = styled.div`
//   max-width: 1800px;
//   margin: auto;
//   padding: 20px;
//   background: #f8f9fa;
//   border-radius: 10px;
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
// `;

// const EventStyle = styled.div`
//   padding: 5px;
//   font-size: 14px;
//   color: #fff;
//   text-align: center;
//   border-radius: 5px;
//   cursor: pointer;
// `;

// function Calendar() {
//   const [rooms, setRooms] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [Today, setToday] = useState();


//   const handleSuccess = (event) => {
//     return MySwal.fire({
//       title: `Guest - ${event.title}`,
//       html: `
//         <b>Arrival Date:</b> ${Moment(event.start).format('DD-MM-YYYY')} <br/>
//         <b>Departure Date:</b> ${Moment(event.end).format('DD-MM-YYYY')} <br/>
//       `,
//       // <b>Status:</b> ${event.extendedProps.status}

//       showConfirmButton: true,
//     });
//   };
//   useEffect(() => {
//     const hotelIDData = JSON.stringify({ hotelID: 1 });

//     fetch(API_URL + "/getBusinessDate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: hotelIDData,
//     })
//       .then((res) => res.json())
//       .then((postres) => {
//         const today = Moment(postres.data[0].businessDate).format("YYYY-MM-DD");
//         setToday(today);
//       });
//   }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       let response = await fetch(API_URL + "/getOccupancyRoomWiseInventoryView", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ hotelID: 10 }),
  //       });

  //       let data = await response.json();
  //       console.log(data);

  //       if (Array.isArray(data.data)) {
  //         const updatedRooms = data.data.map((room) => ({
  //           id: room.roomID.toString(),
  //           title: `${room.roomNumber} - ${room.roomStatus}`,
  //         }));

  //         const filteredEvents = data.data.filter((room) => room.mainReservationID !== null);

  //         const formattedEvents = Object.values(
  //           filteredEvents.reduce((acc, room) => {
  //             const resID = room.reservationID?.toString() || `temp-${room.roomID}`;
  //             if (!acc[resID]) {
  //               acc[resID] = {
  //                 id: resID,
  //                 resourceId: room.roomID.toString(),
  //                 title: room.guestName || "Guest",
  //                 start: room.occupancy_date,
  //                 end: room.occupancy_date,
  //                 color: room.assignStatus === "Assigned" ? "#28a745" : "#dc3545",
  //                 extendedProps: {
  //                   guestName: room.guestName,
  //                   checkIn: room.occupancy_date,
  //                   checkOut: room.end_date,
  //                   assignStatus: room.assignStatus,
  //                 },
  //               };
  //             } else {
  //               acc[resID].start = acc[resID].start < room.occupancy_date ? acc[resID].start : room.occupancy_date;
  //               acc[resID].end = acc[resID].end > room.occupancy_date ? acc[resID].end : room.occupancy_date;
  //             }
  //             return acc;
  //           }, {})
  //         );

  //         console.log("Final Events:", formattedEvents);
  //         setEvents(formattedEvents);
  //         setRooms(updatedRooms);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

//   const renderEventContent = (eventInfo) => {
//     return (
//       <EventStyle style={{ backgroundColor: eventInfo.event.extendedProps.color }}>
//         {eventInfo.event.title}
//       </EventStyle>
//     );
//   };

//   return (
//     <CalendarContainer>
//       {Today && (
//         <FullCalendar
//           plugins={[resourceTimelinePlugin, interactionPlugin]}
//           initialView="resourceTimelineDay"
//           initialDate={Today}
//           headerToolbar={{
//             left: "today prev,next",
//             center: "title",
//             right: "resourceTimelineDay,resourceTimelineWeek",
//           }}
//           resourceAreaHeaderContent="Room Info"
//           resources={rooms}
//           events={events}
//           slotLabelFormat={{ weekday: "short", day: "2-digit" }}
//           height="auto"
//           editable={true}
//           selectable={true}
//           eventContent={renderEventContent}
//           // eventClick={(info) => {
//           //   alert(
//           //     `Guest: ${info.event.extendedProps.guestName}\nCheck-in: ${info.event.extendedProps.checkIn}\nCheck-out: ${info.event.extendedProps.checkOut}\nStatus: ${info.event.extendedProps.assignStatus}`
//           //   );
//           // }}
//           eventClick={(info) => handleSuccess(info.event)} 

//         />
//       )}
//     </CalendarContainer>
//   );
// }

// export default Calendar;



// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
// import interactionPlugin from "@fullcalendar/interaction";
// import styled from "styled-components";
// import "./Calender.css";
// import API_URL from "../../../config";
// import Moment from "moment";
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// const MySwal = withReactContent(Swal);

// const CalendarContainer = styled.div`
//   max-width: 1800px;
//   margin: auto;
//   padding: 20px;
//   background: #f8f9fa;
//   border-radius: 10px;
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
// `;

// const EventStyle = styled.div`
//   padding: 5px;
//   font-size: 14px;
//   color: #fff;
//   text-align: center;
//   border-radius: 5px;
//   cursor: pointer;
//   margin: 1px;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// `;

// function Calendar() {
//   const [rooms, setRooms] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [today, setToday] = useState("");

//   const handleSuccess = (event) => {
//     return MySwal.fire({
//       title: `Guest - ${event.title}`,
//       html: `
//         <b>Arrival Date:</b> ${Moment(event.start).format('DD-MM-YYYY')} <br/>
//         <b>Departure Date:</b> ${Moment(event.end).format('DD-MM-YYYY')} <br/>
//       `,
//       showConfirmButton: true,
//     });
//   };

//   useEffect(() => {
//     const hotelIDData = JSON.stringify({ hotelID: 1 });

//     fetch(API_URL + "/getBusinessDate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: hotelIDData,
//     })
//       .then((res) => res.json())
//       .then((postres) => {
//         const today = Moment(postres.data[0].businessDate).format("YYYY-MM-DD");
//         setToday(today);
//       });
//   }, []);




//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let response = await fetch(API_URL + "/getOccupancyRoomWiseInventoryView", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ hotelID: 10 }),
//         });

//         let data = await response.json();
//         console.log(data);

//         if (Array.isArray(data.data)) {
//           const updatedRooms = data.data.map((room) => ({
//             id: room.roomID.toString(),
//             title: `${room.roomNumber} - ${room.roomStatus}`,
//           }));

//           const filteredEvents = data.data.filter((room) => room.mainReservationID !== null);

//           const formattedEvents = Object.values(
//             filteredEvents.reduce((acc, room) => {
//               const resID = room.reservationID?.toString() || `temp-${room.roomID}`;
//               if (!acc[resID]) {
//                 acc[resID] = {
//                   id: resID,
//                   resourceId: room.roomID.toString(),
//                   title: room.guestName || "Guest",
//                   start: room.occupancy_date,
//                   end: room.occupancy_date,
//                   color: room.assignStatus === "Assigned" ? "#28a745" : "#dc3545",
//                   extendedProps: {
//                     guestName: room.guestName,
//                     checkIn: room.occupancy_date,
//                     checkOut: room.end_date,
//                     assignStatus: room.assignStatus,
//                   },
//                 };
//               } else {
//                 acc[resID].start = acc[resID].start < room.occupancy_date ? acc[resID].start : room.occupancy_date;
//                 acc[resID].end = acc[resID].end > room.occupancy_date ? acc[resID].end : room.occupancy_date;
//               }
//               return acc;
//             }, {})
//           );

//           console.log("Final Events:", formattedEvents);
//           setEvents(formattedEvents);
//           setRooms(updatedRooms);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const renderEventContent = (eventInfo) => {
//     return (
//       <EventStyle style={{ backgroundColor: eventInfo.event.backgroundColor }}>
//         {eventInfo.event.title}
//       </EventStyle>
//     );
//   };

//   return (
//     <CalendarContainer>
//       {today && (
//         <FullCalendar
//           plugins={[resourceTimelinePlugin, interactionPlugin]}
//           initialView="resourceTimelineDay"
//           initialDate={today}
//           headerToolbar={{
//             left: "today prev,next",
//             center: "title",
//             right: "resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth",
//           }}
//           resourceAreaHeaderContent="Resources"
//           resources={rooms}
//           events={events}
//           resourceAreaWidth="150px"
//           resourceOrder="title"
//           slotMinWidth="50"
//           slotDuration="24:00:00"
//           slotLabelInterval="24:00:00"
//           slotLabelFormat={{
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//             weekday: "short",
//           }}
//           height="auto"
//           editable={true}
//           selectable={true}
//           eventContent={renderEventContent}
//           eventClick={(info) => handleSuccess(info.event)}
//           resourceLabelContent={(resource) => {
//             return (
//               <div style={{ padding: "5px" }}>
//                 {resource.resource.title}
//               </div>
//             );
//           }}
//         />
//       )}
//     </CalendarContainer>
//   );
// }

// export default Calendar;


// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
// import interactionPlugin from "@fullcalendar/interaction";
// import styled from "styled-components";
// import "./Calendar.css";
// import API_URL from "../../../config";
// import Moment from "moment";
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// const MySwal = withReactContent(Swal);

// const CalendarContainer = styled.div`
//   max-width: 1800px;
//   margin: auto;
//   padding: 20px;
//   background: #f8f9fa;
//   border-radius: 10px;
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
// `;

// const EventStyle = styled.div`
//   padding: 5px;
//   font-size: 14px;
//   color: #fff;
//   text-align: center;
//   border-radius: 5px;
//   cursor: pointer;
//   margin: 1px;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   border: 1px solid rgba(255, 255, 255, 0.3);
// `;

// function Calendar() {
  // const [rooms, setRooms] = useState([]);
  // const [events, setEvents] = useState([]);
  // const [today, setToday] = useState("");

  // const handleSuccess = (event) => {
  //   return MySwal.fire({
  //     title: `Guest - ${event.title}`,
  //     html: `
  //       <b>Arrival Date:</b> ${Moment(event.start).format('DD-MM-YYYY')} <br/>
  //       <b>Departure Date:</b> ${Moment(event.end).format('DD-MM-YYYY')} <br/>
  //     `,
  //     showConfirmButton: true,
  //   });
  // };

  // useEffect(() => {
  //   const hotelIDData = JSON.stringify({ hotelID: 1 });

  //   fetch(API_URL + "/getBusinessDate", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: hotelIDData,
  //   })
  //     .then((res) => res.json())
  //     .then((postres) => {
  //       const today = Moment(postres.data[0].businessDate).format("YYYY-MM-DD");
  //       setToday(today);
  //     });
  // }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       let response = await fetch(API_URL + "/getOccupancyRoomWiseInventoryView", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ hotelID: 10 }),
  //       });

  //       let data = await response.json();
  //       console.log(data);

  //       if (Array.isArray(data.data)) {
  //         const updatedRooms = data.data.map((room) => ({
  //           id: room.roomID.toString(),
  //           title: `${room.roomNumber} - ${room.roomStatus}`,
  //         }));

  //         const filteredEvents = data.data.filter((room) => room.mainReservationID !== null);

  //         const formattedEvents = Object.values(
  //           filteredEvents.reduce((acc, room) => {
  //             const resID = room.reservationID?.toString() || `temp-${room.roomID}`;
  //             if (!acc[resID]) {
  //               acc[resID] = {
  //                 id: resID,
  //                 resourceId: room.roomID.toString(),
  //                 title: room.guestName || "Guest",
  //                 start: room.occupancy_date,
  //                 end: room.occupancy_date,
  //                 backgroundColor: room.assignStatus === "Assigned" ? "#28a745" : "#dc3545",
  //                 extendedProps: {
  //                   guestName: room.guestName,
  //                   checkIn: room.occupancy_date,
  //                   checkOut: room.end_date,
  //                   assignStatus: room.assignStatus,
  //                 },
  //               };
  //             } else {
  //               acc[resID].start = acc[resID].start < room.occupancy_date ? acc[resID].start : room.occupancy_date;
  //               acc[resID].end = acc[resID].end > room.occupancy_date ? acc[resID].end : room.occupancy_date;
  //             }
  //             return acc;
  //           }, {})
  //         );

  //         console.log("Final Events:", formattedEvents);
  //         setEvents(formattedEvents);
  //         setRooms(updatedRooms);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // const renderEventContent = (eventInfo) => {
  //   return (
  //     <EventStyle style={{ backgroundColor: eventInfo.event.backgroundColor }}>
  //       {eventInfo.event.title}
  //     </EventStyle>
  //   );
  // };

//   return (
//     <CalendarContainer>
//       {today && (
//         <FullCalendar
//           plugins={[resourceTimelinePlugin, interactionPlugin]}
//           initialView="resourceTimelineDay"
//           initialDate={today}
//           headerToolbar={{
//             left: "today prev,next",
//             center: "title",
//             right: "resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth",
//           }}
//           resourceAreaHeaderContent="Rooms"
//           resources={rooms}
//           events={events}
//           resourceAreaWidth="200px"
//           resourceOrder="title"
//           slotMinWidth="100"
//           slotDuration="24:00:00"
//           slotLabelInterval="24:00:00"
//           slotLabelFormat={{
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//             weekday: "short",
//           }}
//           height="auto"
//           editable={true}
//           selectable={true}
//           eventContent={renderEventContent}
//           eventClick={(info) => handleSuccess(info.event)}
//           resourceLabelContent={(resource) => {
//             return (
//               <div style={{ 
//                 padding: "8px",
//                 borderBottom: "1px solid #e0e0e0",
//                 fontWeight: "bold"
//               }}>
//                 {resource.resource.title}
//               </div>
//             );
//           }}
//           dayHeaderContent={(arg) => {
//             return (
//               <div style={{
//                 padding: "5px",
//                 textAlign: "center",
//                 fontWeight: "bold"
//               }}>
//                 {arg.text}
//               </div>
//             );
//           }}
//         />
//       )}
//     </CalendarContainer>
//   );
// }

// export default Calendar;


// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
// import interactionPlugin from "@fullcalendar/interaction";
// import styled from "styled-components";
// import "./Calender.css";
// import API_URL from "../../../config";
// import Moment from "moment";
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// const MySwal = withReactContent(Swal);

// const CalendarContainer = styled.div`
//   max-width: 1800px;
//   margin: auto;
//   padding: 10px;
//   background: #f8f9fa;
// `;

// const EventStyle = styled.div`
//   padding: 2px;
//   font-size: 12px;
//   color: #fff;
//   text-align: center;
//   border-radius: 3px;
//   cursor: pointer;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   line-height: 1.2;
// `;

// function Calendar() {
//   // ... (keep your existing state and effect hooks)

//   const [rooms, setRooms] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [today, setToday] = useState("");

//   const handleSuccess = (event) => {
//     return MySwal.fire({
//       title: `Guest - ${event.title}`,
//       html: `
//         <b>Arrival Date:</b> ${Moment(event.start).format('DD-MM-YYYY')} <br/>
//         <b>Departure Date:</b> ${Moment(event.end).format('DD-MM-YYYY')} <br/>
//       `,
//       showConfirmButton: true,
//     });
//   };

//   useEffect(() => {
//     const hotelIDData = JSON.stringify({ hotelID: 1 });

//     fetch(API_URL + "/getBusinessDate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: hotelIDData,
//     })
//       .then((res) => res.json())
//       .then((postres) => {
//         const today = Moment(postres.data[0].businessDate).format("YYYY-MM-DD");
//         setToday(today);
//       });
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let response = await fetch(API_URL + "/getOccupancyRoomWiseInventoryView", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ hotelID: 10 }),
//         });

//         let data = await response.json();
//         console.log(data);

//         if (Array.isArray(data.data)) {
//           const updatedRooms = data.data.map((room) => ({
//             id: room.roomID.toString(),
//             title: `${room.roomNumber} - ${room.roomStatus}`,
//           }));

//           const filteredEvents = data.data.filter((room) => room.mainReservationID !== null);

//           const formattedEvents = Object.values(
//             filteredEvents.reduce((acc, room) => {
//               const resID = room.reservationID?.toString() || `temp-${room.roomID}`;
//               if (!acc[resID]) {
//                 acc[resID] = {
//                   id: resID,
//                   resourceId: room.roomID.toString(),
//                   title: room.guestName || "Guest",
//                   start: room.occupancy_date,
//                   end: room.occupancy_date,
//                   backgroundColor: room.assignStatus === "Assigned" ? "#28a745" : "#dc3545",
//                   extendedProps: {
//                     guestName: room.guestName,
//                     checkIn: room.occupancy_date,
//                     checkOut: room.end_date,
//                     assignStatus: room.assignStatus,
//                   },
//                 };
//               } else {
//                 acc[resID].start = acc[resID].start < room.occupancy_date ? acc[resID].start : room.occupancy_date;
//                 acc[resID].end = acc[resID].end > room.occupancy_date ? acc[resID].end : room.occupancy_date;
//               }
//               return acc;
//             }, {})
//           );

//           console.log("Final Events:", formattedEvents);
//           setEvents(formattedEvents);
//           setRooms(updatedRooms);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const renderEventContent = (eventInfo) => {
//     return (
//       <EventStyle style={{ backgroundColor: eventInfo.event.backgroundColor }}>
//         {eventInfo.event.title}
//       </EventStyle>
//     );
//   };
//   return (
//     <CalendarContainer>
//       {today && (
//         <FullCalendar
//           plugins={[resourceTimelinePlugin, interactionPlugin]}
//           initialView="resourceTimelineDay"
//           initialDate={today}
//           headerToolbar={{
//             left: "today prev,next",
//             center: "title",
//             right: "resourceTimelineDay,resourceTimelineWeek",
//           }}
//           resourceAreaHeaderContent="Rooms"
//           resources={rooms}
//           events={events}
//           resourceAreaWidth="120px"  // Reduced from 200px
//           resourceOrder="title"
//           slotMinWidth="40"  // Reduced from 100
//           slotDuration="24:00:00"
//           slotLabelInterval="24:00:00"
//           slotLabelFormat={{
//             day: "numeric",
//             weekday: "short",
//           }}
//           height="auto"
//           resourceLabelContent={(resource) => {
//             return (
//               <div style={{ 
//                 padding: "3px",
//                 fontSize: "12px",
//                 lineHeight: "1.2"
//               }}>
//                 {resource.resource.title}
//               </div>
//             );
//           }}
//           dayHeaderContent={(arg) => {
//             return (
//               <div style={{
//                 padding: "2px",
//                 fontSize: "12px",
//                 lineHeight: "1.2"
//               }}>
//                 {arg.text}
//               </div>
//             );
//           }}
//           eventContent={renderEventContent}
//           eventClick={(info) => handleSuccess(info.event)}
//           resourceAreaColumns={[
//             {
//               field: 'title',
//               headerContent: 'Rooms',
//               width: '120px'
//             }
//           ]}
//           resourceLabelDidMount={({ el }) => {
//             el.style.padding = '2px';
//           }}
//         />
//       )}
//     </CalendarContainer>
//   );
// }

// export default Calendar;



// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
// import interactionPlugin from "@fullcalendar/interaction";
// import styled from "styled-components";
// import "./Calender.css";
// import API_URL from "../../../config";
// import Moment from "moment";
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
// import Scheduler from "react-big-scheduler";
// import SchedulerCalender from '../schedularCalender'
// const MySwal = withReactContent(Swal)
// const CalendarContainer = styled.div`
//   max-width: 1800px;
//   margin: auto;
//   padding: 20px;
//   background: #f8f9fa;
//   border-radius: 10px;
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
// `;

// const EventStyle = styled.div`
//   padding: 5px;
//   font-size: 14px;
//   color: #fff;
//   text-align: center;
//   border-radius: 5px;
//   cursor: pointer;
// `;

// function Calendar() {
//   const [rooms, setRooms] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [Today, setToday] = useState();


//   const handleSuccess = (event) => {
//     return MySwal.fire({
//       title: `Guest - ${event.title}`,
//       html: `
//         <b>Arrival Date:</b> ${Moment(event.start).format('DD-MM-YYYY')} <br/>
//         <b>Departure Date:</b> ${Moment(event.end).format('DD-MM-YYYY')} <br/>
//       `,
//       // <b>Status:</b> ${event.extendedProps.status}

//       showConfirmButton: true,
//     });
//   };
//   useEffect(() => {
//     const hotelIDData = JSON.stringify({ hotelID: 1 });

//     fetch(API_URL + "/getBusinessDate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: hotelIDData,
//     })
//       .then((res) => res.json())
//       .then((postres) => {
//         const today = Moment(postres.data[0].businessDate).format("YYYY-MM-DD");
//         setToday(today);
//       });
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let response = await fetch(API_URL + "/getOccupancyRoomWiseInventoryView", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ hotelID: 10 }),
//         });

//         let data = await response.json();
//         console.log(data);

//         if (Array.isArray(data.data)) {
//           const updatedRooms = data.data.map((room) => ({
//             id: room.roomID.toString(),
//             title: `${room.roomNumber} - ${room.roomStatus}`,
//           }));

//           const filteredEvents = data.data.filter((room) => room.mainReservationID !== null);

//           const formattedEvents = Object.values(
//             filteredEvents.reduce((acc, room) => {
//               const resID = room.reservationID?.toString() || `temp-${room.roomID}`;
//               if (!acc[resID]) {
//                 acc[resID] = {
//                   id: resID,
//                   resourceId: room.roomID.toString(),
//                   title: room.guestName || "Guest",
//                   start: room.occupancy_date,
//                   end: room.occupancy_date,
//                   color: room.assignStatus === "Assigned" ? "#28a745" : "#dc3545",
//                   extendedProps: {
//                     guestName: room.guestName,
//                     checkIn: room.occupancy_date,
//                     checkOut: room.end_date,
//                     assignStatus: room.assignStatus,
//                   },
//                 };
//               } else {
//                 acc[resID].start = acc[resID].start < room.occupancy_date ? acc[resID].start : room.occupancy_date;
//                 acc[resID].end = acc[resID].end > room.occupancy_date ? acc[resID].end : room.occupancy_date;
//               }
//               return acc;
//             }, {})
//           );

//           console.log("Final Events:", formattedEvents);
//           setEvents(formattedEvents);
//           setRooms(updatedRooms);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const renderEventContent = (eventInfo) => {
//     return (
//       <EventStyle style={{ backgroundColor: eventInfo.event.extendedProps.color }}>
//         {eventInfo.event.title}
//       </EventStyle>
//     );
//   };

//   return (
//     // <CalendarContainer>
//     //   {Today && (
//     //     <FullCalendar
//     //       plugins={[resourceTimelinePlugin, interactionPlugin]}
//     //       initialView="resourceTimelineDay"
//     //       initialDate={Today}
//     //       headerToolbar={{
//     //         left: "today prev,next",
//     //         center: "title",
//     //         right: "resourceTimelineDay,resourceTimelineWeek",
//     //       }}
//     //       resourceAreaHeaderContent="Room Info"
//     //       resources={rooms}
//     //       events={events}
//     //       slotLabelFormat={{ weekday: "short", day: "2-digit" }}
//     //       height="auto"
//     //       editable={true}
//     //       selectable={true}
//     //       eventContent={renderEventContent}
//     //       // eventClick={(info) => {
//     //       //   alert(
//     //       //     `Guest: ${info.event.extendedProps.guestName}\nCheck-in: ${info.event.extendedProps.checkIn}\nCheck-out: ${info.event.extendedProps.checkOut}\nStatus: ${info.event.extendedProps.assignStatus}`
//     //       //   );
//     //       // }}
//     //       eventClick={(info) => handleSuccess(info.event)} 

//     //     />
//     //   )}
//     // </CalendarContainer>
//     <SchedulerCalender/>
//   );
// }

// export default Calendar;


import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import styled from "styled-components";
import "./Calendar.css";
import API_URL from "../../../config";
import Moment from "moment";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const CalendarContainer = styled.div`
  max-width: 1800px;
  margin: auto;
  padding: 10px;
  background: #f8f9fa;
`;

const EventStyle = styled.div`
  padding: 2px;
  font-size: 12px;
  color: #fff;
  text-align: center;
  border-radius: 3px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
  margin: 0 1px;
`;

function Calendar() {
  // ... (keep your existing state and effect hooks)

  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
  const [today, setToday] = useState("");

  const handleSuccess = (event) => {
    return MySwal.fire({
      title: `Guest - ${event.title}`,
      html: `
        <b>Arrival Date:</b> ${Moment(event.start).format('DD-MM-YYYY')} <br/>
        <b>Departure Date:</b> ${Moment(event.end).format('DD-MM-YYYY')} <br/>
      `,
      showConfirmButton: true,
    });
  };

  useEffect(() => {
    const hotelIDData = JSON.stringify({ hotelID: 1 });

    fetch(API_URL + "/getBusinessDate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: hotelIDData,
    })
      .then((res) => res.json())
      .then((postres) => {
        const today = Moment(postres.data[0].businessDate).format("YYYY-MM-DD");
        setToday(today);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(API_URL + "/getOccupancyRoomWiseInventoryView", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hotelID: 10 }),
        });

        let data = await response.json();
        console.log(data);

        if (Array.isArray(data.data)) {
          const updatedRooms = data.data.map((room) => ({
            id: room.roomID.toString(),
            title: `${room.roomNumber} - ${room.roomStatus}`,
          }));

          const filteredEvents = data.data.filter((room) => room.mainReservationID !== null);

          const formattedEvents = Object.values(
            filteredEvents.reduce((acc, room) => {
              const resID = room.reservationID?.toString() || `temp-${room.roomID}`;
              if (!acc[resID]) {
                acc[resID] = {
                  id: resID,
                  resourceId: room.roomID.toString(),
                  title: room.guestName || "Guest",
                  start: room.occupancy_date,
                  end: room.occupancy_date,
                  backgroundColor: room.assignStatus === "Assigned" ? "#28a745" : "#dc3545",
                  extendedProps: {
                    guestName: room.guestName,
                    checkIn: room.occupancy_date,
                    checkOut: room.end_date,
                    assignStatus: room.assignStatus,
                  },
                };
              } else {
                acc[resID].start = acc[resID].start < room.occupancy_date ? acc[resID].start : room.occupancy_date;
                acc[resID].end = acc[resID].end > room.occupancy_date ? acc[resID].end : room.occupancy_date;
              }
              return acc;
            }, {})
          );

          console.log("Final Events:", formattedEvents);
          setEvents(formattedEvents);
          setRooms(updatedRooms);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderEventContent = (eventInfo) => {
    return (
      <EventStyle style={{ backgroundColor: eventInfo.event.backgroundColor }}>
        {eventInfo.event.title}
      </EventStyle>
    );
  };
  return (
    <CalendarContainer>
      {today && (
        <FullCalendar
          plugins={[resourceTimelinePlugin, interactionPlugin]}
          initialView="resourceTimelineDay"
          initialDate={today}
          headerToolbar={{
            left: "today prev,next",
            center: "title",
            right: "resourceTimelineDay,resourceTimelineWeek",
          }}
          resourceAreaHeaderContent="Rooms"
          resources={rooms}
          events={events}
          resourceAreaWidth="120px"
          resourceOrder="title"
          slotMinWidth="40"
          slotDuration="24:00:00"
          slotLabelInterval="24:00:00"
          slotLabelFormat={{
            day: "numeric",
            weekday: "short",
          }}
          height="auto"
          resourceLabelContent={(resource) => {
            return (
              <div style={{ 
                padding: "3px",
                fontSize: "12px",
                lineHeight: "1.2",
                borderRight: "1px solid #e0e0e0" // Add vertical line to resource labels
              }}>
                {resource.resource.title}
              </div>
            );
          }}
          dayHeaderContent={(arg) => {
            return (
              <div style={{
                padding: "2px",
                fontSize: "12px",
                lineHeight: "1.2",
                borderRight: "1px solid #e0e0e0" // Add vertical line to day headers
              }}>
                {arg.text}
              </div>
            );
          }}
          eventContent={renderEventContent}
          eventClick={(info) => handleSuccess(info.event)}
          resourceAreaColumns={[
            {
              field: 'title',
              headerContent: 'Rooms',
              width: '120px'
            }
          ]}
          resourceLabelDidMount={({ el }) => {
            el.style.padding = '2px';
          }}
        />
      )}
    </CalendarContainer>
  );
}

export default Calendar;

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App





// import {
//   Datepicker,
//   Eventcalendar,
//   Input,
//   Popup,
//   setOptions,
// } from '@mobiscroll/react';
// import { useCallback, useMemo, useRef, useState } from 'react';

// setOptions({
//   theme: 'ios',
//   themeVariant: 'light'
// });

// const defaultEvents = [
//   {
//     start: '2025-03-28T00:00',
//     end: '2025-03-31T00:00',
//     title: 'Design Homepage',
//     resource: 'alice',
//     progress: 100,
//   },
//   {
//     start: '2025-03-28T00:00',
//     end: '2025-04-01T00:00',
//     title: 'Create Wireframes',
//     resource: 'bob',
//     progress: 100,
//   },
//   {
//     start: '2025-03-30T00:00',
//     end: '2025-04-04T00:00',
//     title: 'Develop Frontend',
//     resource: 'charlie',
//     progress: 45,
//   },
//   {
//     start: '2025-03-30T00:00',
//     end: '2025-04-04T00:00',
//     title: 'Develop Backend',
//     resource: 'dave',
//     progress: 35,
//   },
//   {
//     start: '2025-04-04T00:00',
//     end: '2025-04-08T00:00',
//     title: 'Test Website',
//     resource: 'erin',
//     progress: 0,
//   },
//   {
//     start: '2025-04-01T00:00',
//     end: '2025-04-08T00:00',
//     title: 'Fix Bugs',
//     resource: 'frank',
//     progress: 0,
//   },
//   {
//     start: '2025-04-08T00:00',
//     end: '2025-04-11T00:00',
//     title: 'Deploy Website',
//     resource: 'george',
//     progress: 0,
//   },
// ];

// const myResources = [
//   {
//     id: 'gro1',
//     name: 'Designer Team',
//     color: '#76e083',
//     eventCreation: false,
//     children: [
//       {
//         id: 'alice',
//         name: 'Alice',
//         title: 'Designer',
//         color: '#1dab2f',
//       },
//       {
//         id: 'bob',
//         name: 'Bob',
//         title: 'Designer',
//         color: '#76e083',
//       },
//     ],
//   },
//   {
//     id: 'gro2',
//     name: 'Development Team',
//     color: '#ff1717',
//     eventCreation: false,
//     children: [
//       {
//         id: 'charlie',
//         name: 'Charlie',
//         title: 'Frontend Developer',
//         color: '#4981d6',
//       },
//       {
//         id: 'dave',
//         name: 'Dave',
//         title: 'Backend Developer',
//         color: '#f7961e',
//       },
//       {
//         id: 'frank',
//         name: 'Frank',
//         title: 'Full-Stack Developer',
//         color: '#34c8e0',
//       },
//       {
//         id: 'george',
//         name: 'George',
//         title: 'DevOps Engineer',
//         color: '#e25dd2',
//       },
//     ],
//   },

//   {
//     id: 'gro3',
//     name: 'QA Team',
//     color: '#d6d145',
//     eventCreation: false,
//     children: [
//       {
//         id: 'erin',
//         name: 'Erin',
//         title: 'QA Tester',
//         color: '#d6d145',
//       },
//     ],
//   },
// ];

// function App() {
//   const [myEvents, setMyEvents] = useState(defaultEvents);
//   const [tempEvent, setTempEvent] = useState(null);
//   const [isPopupOpen, setPopupOpen] = useState(false);
//   const [isEdit, setEdit] = useState(false);
//   const [startInput, startInputRef] = useState(null);
//   const [endInput, endInputRef] = useState(null);
//   const [popupAnchor, setPopupAnchor] = useState(null);
//   const [popupEventTitle, setTitle] = useState('');
//   const [popupEventDate, setDate] = useState([]);
//   const [popupEventResource, setResource] = useState('');
//   const [popupEventProgress, setProgress] = useState(0);

//   const isDraggingProgress = useRef(false);

//   const myView = useMemo(() => ({ timeline: { type: 'month', eventList: true } }), []);

//   const loadPopupForm = useCallback((event) => {
//     setTitle(event.title);
//     setDate([event.start, event.end]);
//     setResource(event.resource);
//     setProgress(event.progress || 0);
//   }, []);

//   const updateEvent = useCallback(
//     (updatedEvent) => {
//       // Update the event in the list
//       const index = myEvents.findIndex((event) => event.id === updatedEvent.id);
//       const newEventList = [...myEvents];
//       newEventList.splice(index, 1, updatedEvent);
//       setMyEvents(newEventList);
//     },
//     [myEvents],
//   );

//   const saveEvent = useCallback(() => {
//     const newEvent = {
//       id: tempEvent.id,
//       title: popupEventTitle,
//       start: popupEventDate[0],
//       end: popupEventDate[1],
//       resource: popupEventResource,
//       progress: popupEventProgress,
//     };
//     if (isEdit) {
//       updateEvent(newEvent);
//     } else {
//       // Add the new event to the list
//       setMyEvents([...myEvents, newEvent]);
//     }
//     setPopupOpen(false);
//   }, [isEdit, myEvents, popupEventDate, popupEventTitle, popupEventProgress, popupEventResource, tempEvent, updateEvent]);

//   const popupHeaderText = useMemo(() => (isEdit ? 'Edit event' : 'New Event'), [isEdit]);

//   const popupButtons = useMemo(
//     () =>
//       isEdit
//         ? [
//             'cancel',
//             {
//               handler: saveEvent,
//               keyCode: 'enter',
//               text: 'Save',
//               cssClass: 'mbsc-popup-button-primary',
//             },
//           ]
//         : [
//             'cancel',
//             {
//               handler: saveEvent,
//               keyCode: 'enter',
//               text: 'Add',
//               cssClass: 'mbsc-popup-button-primary',
//             },
//           ],
//     [isEdit, saveEvent],
//   );

//   const popupResponsive = useMemo(
//     () => ({
//       medium: {
//         display: 'anchored',
//         width: 400,
//         fullScreen: false,
//         touchUi: false,
//       },
//     }),
//     [],
//   );

//   const datepickerResponsive = useMemo(
//     () => ({
//       medium: {
//         touchUi: false,
//       },
//     }),
//     [],
//   );

//   const handleEventCreated = useCallback(
//     (args) => {
//       setEdit(false);
//       setTempEvent(args.event);
//       loadPopupForm(args.event);
//       setPopupAnchor(args.target);
//       setPopupOpen(true);
//     },
//     [loadPopupForm],
//   );

//   const handleEventClick = useCallback(
//     (args) => {
//       if (isDraggingProgress.current) {
//         return;
//       }
//       setEdit(true);
//       setTempEvent({ ...args.event });
//       loadPopupForm(args.event);
//       setPopupAnchor(args.domEvent.target);
//       setPopupOpen(true);
//     },
//     [loadPopupForm, isDraggingProgress],
//   );

//   const handleTitleChange = useCallback((ev) => {
//     setTitle(ev.target.value);
//   }, []);

//   const handleDateChange = useCallback((args) => {
//     setDate(args.value);
//   }, []);

//   const handleProgressChange = useCallback((ev) => {
//     setProgress(ev.target.value);
//   }, []);

//   const handlePopupClose = useCallback(() => {
//     if (!isEdit) {
//       // Refresh the list, if add popup was canceled, to remove the temporary event
//       setMyEvents([...myEvents]);
//     }
//     setPopupOpen(false);
//   }, [isEdit, myEvents]);

//   const handleEventUpdated = useCallback(
//     (args) => {
//       updateEvent(args.event);
//     },
//     [updateEvent],
//   );

//   const handleProgressArrowMouseDown = useCallback(
//     (e) => {
//       const progressArrow = e.target.closest('.mds-progress-arrow');

//       if (!progressArrow) {
//         return;
//       }

//       e.stopPropagation();

//       isDraggingProgress.current = true;

//       const progressBar = progressArrow.closest('.mds-progress-bar');
//       const progressLabel = progressArrow.closest('.mds-progress-event').querySelector('.mds-progress-label');
//       const eventContainerWidth = progressBar.parentElement.offsetWidth;
//       const initialMouseX = e.pageX;
//       const initialProgress = parseFloat(progressBar.style.width.replace('%', ''));

//       let newProgress;

//       const handleMouseMove = (e) => {
//         const mouseXOffset = e.pageX - initialMouseX;

//         newProgress = Math.round(initialProgress + (mouseXOffset / eventContainerWidth) * 100);
//         newProgress = Math.max(0, Math.min(100, newProgress));

//         progressBar.style.width = `${newProgress}%`;
//         progressLabel.textContent = `${newProgress}%`;
//       };

//       const handleMouseUp = () => {
//         document.removeEventListener('mousemove', handleMouseMove);
//         document.removeEventListener('mouseup', handleMouseUp);

//         const eventId = progressArrow.dataset.eventId;
//         const eventToUpdate = myEvents.find((event) => event.id === eventId);
//         eventToUpdate.progress = newProgress;
//         updateEvent(eventToUpdate);

//         setTimeout(() => {
//           isDraggingProgress.current = false;
//         }, 100);
//       };

//       document.addEventListener('mousemove', handleMouseMove);
//       document.addEventListener('mouseup', handleMouseUp);
//     },
//     [myEvents, updateEvent],
//   );

//   const renderCustomEvent = useCallback(
//     (event) => (
//       <div className="mds-progress-event" style={{ background: event.color }}>
//         <div className="mds-progress-bar" style={{ width: `${event.original.progress || 0}%` }}>
//           <div className="mds-progress-arrow" data-event-id={event.original.id}></div>
//         </div>
//         <div className="mds-progress-event-content">
//           <div className="mds-progress-event-title">{event.original.title}</div>
//         </div>
//         <div className="mds-progress-label" key={event.original.progress || 0}>
//           {event.original.progress || 0}%
//         </div>
//       </div>
//     ),
//     [],
//   );

//   const renderCustomResource = useCallback(
//     (resource) => (
//       <div>
//         <div className="mds-progress-employee-name">{resource.name}</div>
//         {resource.title && <div className="mds-progress-employee-title">{resource.title}</div>}
//       </div>
//     ),
//     [],
//   );

//   return (
//     <div onMouseDownCapture={handleProgressArrowMouseDown}>
//       <Eventcalendar
//         class="mds-progress-calendar"
//         view={myView}
//         data={myEvents}
//         resources={myResources}
//         clickToCreate={true}
//         dragToCreate={true}
//         dragToMove={true}
//         dragToResize={true}
//         onEventClick={handleEventClick}
//         onEventCreated={handleEventCreated}
//         onEventUpdated={handleEventUpdated}
//         renderResource={renderCustomResource}
//         renderScheduleEvent={renderCustomEvent}
//       />
//       <Popup
//         display="bottom"
//         fullScreen={true}
//         contentPadding={false}
//         headerText={popupHeaderText}
//         anchor={popupAnchor}
//         buttons={popupButtons}
//         isOpen={isPopupOpen}
//         onClose={handlePopupClose}
//         responsive={popupResponsive}
//       >
//         <div className="mbsc-form-group">
//           <Input label="Title" value={popupEventTitle} onChange={handleTitleChange} />
//         </div>
//         <div className="mbsc-form-group">
//           <Input ref={startInputRef} label="Starts" />
//           <Input ref={endInputRef} label="Ends" />
//           <Datepicker
//             select="range"
//             touchUi={true}
//             startInput={startInput}
//             endInput={endInput}
//             showRangeLabels={false}
//             responsive={datepickerResponsive}
//             onChange={handleDateChange}
//             value={popupEventDate}
//           />
//         </div>
//         <div className="mbsc-form-group">
//           <label className="mbsc-flex mbsc-align-items-center mbsc-padding">
//             <span>Progress</span>
//             <input
//               className="mds-popup-progress-slider mbsc-flex-1-0"
//               type="range"
//               min="0"
//               max="100"
//               value={popupEventProgress}
//               onChange={handleProgressChange}
//             />
//             <span className="mds-popup-progress-label">{popupEventProgress}%</span>
//           </label>
//         </div>
//       </Popup>
//     </div>
//   );
// }

// export default App;