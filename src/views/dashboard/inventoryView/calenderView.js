// import React from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// // Setup the localizer by providing the moment object
// const localizer = momentLocalizer(moment);

// // Sample data for guest stays
// const guestStays = [
//   {
//     id: 1,
//     guestName: 'John Doe',
//     start: new Date(2023, 9, 15), // October 15, 2023
//     end: new Date(2023, 9, 18),   // October 18, 2023
//   },
//   {
//     id: 2,
//     guestName: 'Jane Smith',
//     start: new Date(2023, 9, 20), // October 20, 2023
//     end: new Date(2023, 9, 25),   // October 25, 2023
//   },
// ];

// // Custom event component to display guest name
// const EventComponent = ({ event }) => {
//   return (
//     <div>
//       <strong>{event.guestName}</strong>
//     </div>
//   );
// };

// const GuestCalendar = () => {
//   return (
//     <div style={{ height: '500px' }}>
//       <Calendar
//         localizer={localizer}
//         events={guestStays}
//         startAccessor="start"
//         endAccessor="end"
//         components={{
//           event: EventComponent, // Use custom event component
//         }}
//         defaultView="month"
//         views={['month', 'week', 'day']}
//       />
//     </div>
//   );
// };

// export default GuestCalendar;