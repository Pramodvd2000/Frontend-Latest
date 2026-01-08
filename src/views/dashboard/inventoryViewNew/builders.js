// import {
//   START_YEAR,
//   NUM_OF_YEARS,
//   MONTH_NAMES,
//   MONTHS_PER_YEAR,
//   QUARTERS_PER_YEAR,
//   MONTHS_PER_QUARTER,
//   NUM_OF_MONTHS,
//   MAX_TRACK_START_GAP,
//   MAX_ELEMENT_GAP,
//   MAX_MONTH_SPAN,
//   MIN_MONTH_SPAN,
//   MAX_NUM_OF_SUBTRACKS,
// } from './constants'

// import { fill, hexToRgb, colourIsLight, addMonthsToYear, addMonthsToYearAsDate, nextColor, randomTitle } from './utils'

// export const buildQuarterCells = () => {
//   const v = []
//   for (let i = 0; i < QUARTERS_PER_YEAR * NUM_OF_YEARS; i += 1) {
//     const quarter = (i % 4) + 1
//     const startMonth = i * MONTHS_PER_QUARTER
//     const s = addMonthsToYear(START_YEAR, startMonth)
//     const e = addMonthsToYear(START_YEAR, startMonth + MONTHS_PER_QUARTER)
//     v.push({
//       id: `${s.year}-q${quarter}`,
//       title: `Q${quarter} ${s.year}`,
//       start: new Date(`${s.year}-${s.month}-01`),
//       end: new Date(`${e.year}-${e.month}-01`),
//     })
//   }
//   return v
// }

// export const buildMonthCells = () => {
//   const v = []
//   for (let i = 0; i < MONTHS_PER_YEAR * NUM_OF_YEARS; i += 1) {
//     const startMonth = i
//     const start = addMonthsToYearAsDate(START_YEAR, startMonth)
//     const end = addMonthsToYearAsDate(START_YEAR, startMonth + 1)
//     v.push({
//       id: `m${startMonth}`,
//       title: MONTH_NAMES[i % 12],
//       start,
//       end,
//     })
//   }
//   return v
// }

// export const buildTimebar = () => [
//   {
//     id: 'quarters',
//     title: 'Quarters',
//     cells: buildQuarterCells(),
//     style: {},
//   },
//   {
//     id: 'months',
//     title: 'Months',
//     cells: buildMonthCells(),
//     useAsGrid: true,
//     style: {},
//   },
// ]

// export const buildElement = ({ trackId, start, end, i }) => {
//   const bgColor = nextColor()
//   const color = colourIsLight(...hexToRgb(bgColor)) ? '#000000' : '#ffffff'
//   return {
//     id: `t-${trackId}-el-${i}`,
//     title: randomTitle(),
//     start,
//     end,
//     style: {
//       backgroundColor: `#${bgColor}`,
//       color,
//       borderRadius: '4px',
//       boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.25)',
//       textTransform: 'capitalize',
//     },
//   }
// }

// export const buildTrackStartGap = () => Math.floor(Math.random() * MAX_TRACK_START_GAP)
// export const buildElementGap = () => Math.floor(Math.random() * MAX_ELEMENT_GAP)

// export const buildElements = trackId => {
//   const v = []
//   let i = 1
//   let month = buildTrackStartGap()

//   while (month < NUM_OF_MONTHS) {
//     let monthSpan = Math.floor(Math.random() * (MAX_MONTH_SPAN - (MIN_MONTH_SPAN - 1))) + MIN_MONTH_SPAN

//     if (month + monthSpan > NUM_OF_MONTHS) {
//       monthSpan = NUM_OF_MONTHS - month
//     }

//     const start = addMonthsToYearAsDate(START_YEAR, month)
//     const end = addMonthsToYearAsDate(START_YEAR, month + monthSpan)
//     v.push(
//       buildElement({
//         trackId,
//         start,
//         end,
//         i,
//       })
//     )
//     const gap = buildElementGap()
//     month += monthSpan + gap
//     i += 1
//   }

//   return v
// }

// export const buildSubtrack = (trackId, subtrackId) => ({
//   id: `track-${trackId}-${subtrackId}`,
//   title: `Subtrack ${subtrackId}`,
//   elements: buildElements(subtrackId),
// })

// export const buildTrack = trackId => {
//   const tracks = fill(Math.floor(Math.random() * MAX_NUM_OF_SUBTRACKS) + 1).map(i => buildSubtrack(trackId, i + 1))
//   return {
//     id: `track-${trackId}`,
//     title: `Track ${trackId}`,
//     elements: buildElements(trackId),
//     tracks,
//     // hasButton: true,
//     // link: 'www.google.com',
//     isOpen: false,
//   }
// }





import {
  START_YEAR,
  NUM_OF_YEARS,
  MONTH_NAMES,
  MONTHS_PER_YEAR,
  QUARTERS_PER_YEAR,
  MONTHS_PER_QUARTER,
  NUM_OF_MONTHS,
  MAX_TRACK_START_GAP,
  MAX_ELEMENT_GAP,
  MAX_MONTH_SPAN,
  MIN_MONTH_SPAN,
  MAX_NUM_OF_SUBTRACKS,
} from "./constants";

import {
  fill,
  hexToRgb,
  colourIsLight,
  addMonthsToYear,
  addMonthsToYearAsDate,
  nextColor,
  randomTitle,
} from "./utils";
import API_URL from "../../../config";
import { useEffect, useState } from "react";
export const buildQuarterCells = () => {
  const v = [];
  for (let i = 0; i < QUARTERS_PER_YEAR * NUM_OF_YEARS; i += 1) {
    const quarter = (i % 4) + 1;
    const startMonth = i * MONTHS_PER_QUARTER;
    const s = addMonthsToYear(START_YEAR, startMonth);
    const e = addMonthsToYear(START_YEAR, startMonth + MONTHS_PER_QUARTER);
    v.push({
      id: `${s.year}-q${quarter}`,
      title: `Q${quarter} ${s.year}`,
      start: new Date(`${s.year}-${s.month}-01`),
      end: new Date(`${e.year}-${e.month}-01`),
    });
  }
  return v;
};

export const buildMonthCells = () => {
  const v = [];
  for (let i = 0; i < MONTHS_PER_YEAR * NUM_OF_YEARS; i += 1) {
    const startMonth = i;
    const start = addMonthsToYearAsDate(START_YEAR, startMonth);
    const end = addMonthsToYearAsDate(START_YEAR, startMonth + 1);
    v.push({
      id: `m${startMonth}`,
      title: MONTH_NAMES[i % 12],
      start,
      end,
    });
  }
  return v;
};

export const buildDayCells = () => {
  const days = [];
  const startDate = new Date(`${START_YEAR}-01-01`);
  const endDate = new Date(`${START_YEAR + NUM_OF_YEARS}-01-01`);

  let currentDate = new Date(startDate);

  let i = 0;
  while (currentDate < endDate) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);

    days.push({
      id: `day-${i}`,
      title: currentDate.toDateString().slice(4, 10), // Ex: Jan 01
      start: new Date(currentDate),
      end: new Date(nextDate),
    });

    currentDate = nextDate;
    i++;
  }

  return days;
};

export const buildTimebar = () => [
  {
    id: "days",
    // title: "Rooms",
    title: <div style={{ textAlign: 'center' }}>Rooms</div>,

    cells: buildDayCells(),
    useAsGrid: true,
    style: {},
  },
];

export const buildElement = ({ trackId, start, end, i }) => {
  const bgColor = nextColor();
  const color = colourIsLight(...hexToRgb(bgColor)) ? "#000000" : "#ffffff";
  return {
    id: `t-${trackId}-el-${i}`,
    title: randomTitle(),
    start,
    end,
    style: {
      backgroundColor: `#${bgColor}`,
      color,
      borderRadius: "4px",
      boxShadow: "1px 1px 0px rgba(0, 0, 0, 0.25)",
      textTransform: "capitalize",
    },
  };
};

export const buildTrackStartGap = () =>
  Math.floor(Math.random() * MAX_TRACK_START_GAP);
export const buildElementGap = () =>
  Math.floor(Math.random() * MAX_ELEMENT_GAP);

export const buildElements = (trackId) => {
  const v = [];
  let i = 1;
  let month = buildTrackStartGap();

  while (month < NUM_OF_MONTHS) {
    let monthSpan =
      Math.floor(Math.random() * (MAX_MONTH_SPAN - (MIN_MONTH_SPAN - 1))) +
      MIN_MONTH_SPAN;

    if (month + monthSpan > NUM_OF_MONTHS) {
      monthSpan = NUM_OF_MONTHS - month;
    }

    const start = addMonthsToYearAsDate(START_YEAR, month);
    const end = addMonthsToYearAsDate(START_YEAR, month + monthSpan);
    v.push(
      buildElement({
        trackId,
        start,
        end,
        i,
      })
    );
    const gap = buildElementGap();
    month += monthSpan + gap;
    i += 1;
  }

  return v;
};

export const buildSubtrack = (trackId, subtrackId) => ({
  id: `track-${trackId}-${subtrackId}`,
  title: `Subtrack ${subtrackId}`,
  elements: buildElements(subtrackId),
});

const randomNames = [
  "Abhishek Gupta",
  "Riya Sharma",
  "John Doe",
  "Emily Brown",
  "Amit Kumar",
  "Sara Khan",
  "Rahul Jain",
  "Priya Das",
  "Kevin Paul",
  "Sneha Roy",
  "Arjun Mehta",
  "Tina D’Souza",
];

const getRandomJanDate = () => {
  const start = new Date(`${START_YEAR}-01-01`);
  const end = new Date(`${START_YEAR}-01-31`);
  const timeDiff = end.getTime() - start.getTime();
  const randomTime = start.getTime() + Math.random() * timeDiff;
  const date = new Date(randomTime);
  date.setHours(0, 0, 0, 0);
  return date;
};

const buildRandomRoomElement = (roomNo) => {
  const guest = randomNames[Math.floor(Math.random() * randomNames.length)];
  const start = getRandomJanDate();
  const end = new Date(start);
  const stayLength = Math.floor(Math.random() * 3) + 1; // 1–3 nights
  end.setDate(start.getDate() + stayLength);

  // Make sure the stay does not go beyond Jan 31
  if (end.getMonth() !== 0) {
    end.setMonth(0);
    end.setDate(31);
  }

  return {
    id: `room-${roomNo}-${guest.replace(" ", "-").toLowerCase()}`,
    title: guest,
    start,
    end,
    style: {
      backgroundColor: "#3f51b5",
      color: "#ffffff",
      transform: "skew(-20deg)",
      padding: "6px 12px",
      border: "1px solid #3f51b5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%", // optional, depends on your layout
    },
  };
};

export const buildTrack = (trackId) => {
  const floorTitle = `Floor ${trackId}`;
  const rooms = Array.from({ length: 10 }, (_, i) => 100 * trackId + i + 1);

  const tracks = rooms.map((roomNo) => ({
    id: `track-${trackId}-room-${roomNo}`,
    title: `Room ${roomNo}`,
    elements: [buildRandomRoomElement(roomNo)],
  }));

  return {
    id: `track-${trackId}`,
    title: floorTitle,
    elements: [],
    tracks,
    isOpen: true,
  };
};


// Helper function to generate background color for rooms (optional)
const getRoomBackgroundColor = (roomNumber) => {
  const colors = ['#f39c12', '#27ae60', '#8e44ad', '#e67e22', '#1abc9c'];
  const hash = [...roomNumber].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length]; // Generates color based on room number
};

export const buildTrackFromApiData = (data) => {
  if (!Array.isArray(data)) return [];

  const groupedByFloor = {};

  data.forEach(item => {
    const floor = item.floor ?? 0;
    const room = item.roomNumber ?? 'Unknown';

    if (!groupedByFloor[floor]) groupedByFloor[floor] = {};
    if (!groupedByFloor[floor][room]) groupedByFloor[floor][room] = [];

    groupedByFloor[floor][room].push(item);
  });



  
  const tracks = Object.entries(groupedByFloor).map(([floor, rooms], floorIndex) => {
    const subTracks = Object.entries(rooms)
      .map(([roomNumber, entries]) => {

      
        // create timeline elements for all valid reservations
        const elements = entries
          .filter(entry =>
            entry.arrivalDate &&
            entry.departureDate &&
            !isNaN(new Date(entry.arrivalDate)) &&
            !isNaN(new Date(entry.departureDate))
          )
          .map(entry => {
            return {
              id: `element-${floor}-${roomNumber}-${entry.reservationID}`,
              start: new Date(entry.arrivalDate),
              end: new Date(entry.departureDate),
              title: `${entry.guestName ?? "Guest"} (${entry.bookingID ?? "?"})`,
              style: {
                backgroundColor: "#2e86de",

                color: "white",
                borderRadius: "4px",
              },
            };
          });

        if (elements.length === 0) return null; // skip rooms with no valid elements

        return {
          id: `room-${roomNumber}`,
          title: `Room ${roomNumber}`,
          elements,
          tracks: [],
      
        };
      })
      .filter(Boolean); // remove nulls

    return {
      id: `floor-${floor}`,
      title: `Floor ${floor}`,
      isOpen: floorIndex === 0,
      tracks: subTracks,
      elements: [],
    };
  });



  // const tracks = Object.entries(groupedByFloor).map(([floor, rooms], floorIndex) => {
  //   const subTracks = Object.entries(rooms)
  //     .map(([roomNumber, entries]) => {
  //       // Ensure entries is an array, even if it's undefined or null
  //       if (!Array.isArray(entries)) return null;
  
  //       // create timeline elements for all valid reservations and status changes
  //       const elements = entries
  //         .flatMap(entry => {
  //           const elements = [];
  
  //           // Check for valid reservation elements
  //           if (entry.arrivalDate && entry.departureDate &&
  //               !isNaN(new Date(entry.arrivalDate)) &&
  //               !isNaN(new Date(entry.departureDate))) {
  //             elements.push({
  //               id: `element-${floor}-${roomNumber}-${entry.reservationID}`,
  //               start: new Date(entry.arrivalDate),
  //               end: new Date(entry.departureDate),
  //               title: `${entry.guestName ?? "Guest"} (${entry.bookingID ?? "?"})`,
  //               style: {
  //                 backgroundColor: "#2e86de",
  //                 color: "white",
  //                 borderRadius: "4px",
  //               },
  //             });
  //           }
  
  //           // Check for "Out Of Service" status
  //           if (entry.status === "Out Of Service" && entry.occupancyDate) {
  //             elements.push({
  //               id: `out-of-service-${floor}-${roomNumber}-${entry.reservationID}`,
  //               start: new Date(entry.occupancyDate),
  //               end: new Date(entry.occupancyDate), // Assuming the end time is the same day for status
  //               title: "Out Of Service",
  //               style: {
  //                 backgroundColor: "#ff9f43", // Orange color for Out of Service
  //                 color: "white",
  //                 borderRadius: "4px",
  //               },
  //             });
  //           }
  
  //           // Check for "Out Of Order" status
  //           if (entry.status === "Out Of Order" && entry.occupancyDate) {
  //             elements.push({
  //               id: `out-of-order-${floor}-${roomNumber}-${entry.reservationID}`,
  //               start: new Date(entry.occupancyDate),
  //               end: new Date(entry.occupancyDate), // Assuming the end time is the same day for status
  //               title: "Out Of Order",
  //               style: {
  //                 backgroundColor: "#82868b", // Gray color for Out of Order
  //                 color: "white",
  //                 borderRadius: "4px",
  //               },
  //             });
  //           }
  
  //           return elements;
  //         })
  //         .filter(Boolean); // remove any null or undefined elements
  
  //       if (elements.length === 0) return null; // skip rooms with no valid elements
  
  //       return {
  //         id: `room-${roomNumber}`,
  //         title: `Room ${roomNumber}`,
  //         elements,
  //         tracks: [],
  //       };
  //     })
  //     .filter(Boolean); // remove nulls
  
  //   return {
  //     id: `floor-${floor}`,
  //     title: `Floor ${floor}`,
  //     isOpen: floorIndex === 0,
  //     tracks: subTracks,
  //     elements: [],
  //   };
  // });
  
  
  return tracks;
};






// export const buildTrack = (trackId) => {
//   const floorTitle = `Floor ${trackId}`;

//   let tracks = [];
//   if (trackId === 1) {
//     // Only for Floor 1, create Room 101
//     tracks = [
//       {
//         id: `track-${trackId}-room-101`,
//         title: `Room 101`,
//         elements: [
//           {
//             id: `room-101-abhishek`,
//             title: `Abhishek Gupta`,
//             start: new Date(`${START_YEAR}-01-01`),
//             end: new Date(`${START_YEAR}-01-05`), // 1 day duration
//             style: {
//               backgroundColor: "#3f51b5",
//               color: "#ffffff",
//               fontWeight: "bold",
//               borderRadius: "4px",
//             },
//           },
//         ],
//       },
//     ];
//   }

//   return {
//     id: `track-${trackId}`,
//     title: floorTitle,
//     elements: buildElements(trackId), // you can skip this if not needed
//     tracks,
//     isOpen: true, // expand to show Room 101
//   };
// };
