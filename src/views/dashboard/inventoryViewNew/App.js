// /* eslint-disable import/no-unresolved */
// import React, { Component } from "react";
// import Timeline from "react-timelines";

// import "react-timelines/lib/css/style.css";

// import { START_YEAR, NUM_OF_YEARS, NUM_OF_TRACKS } from "./constants";

// import { buildTimebar, buildTrack } from "./builders";

// import { fill } from "./utils";

// const now = new Date("2025-01-01");

// const timebar = buildTimebar();

// // eslint-disable-next-line no-alert
// const clickElement = (element) =>
//   alert(`Clicked element\n${JSON.stringify(element, null, 2)}`);

// const MIN_ZOOM = 90;
// const MAX_ZOOM = 90;

// class App extends Component {
//   constructor(props) {
//     super(props);

//     const tracksById = fill(NUM_OF_TRACKS).reduce((acc, i) => {
//       const track = buildTrack(i + 1);
//       acc[track.id] = track;
//       return acc;
//     }, {});

//     this.state = {
//       open: false,
//       zoom: 90,
//       // eslint-disable-next-line react/no-unused-state
//       tracksById,
//       tracks: Object.values(tracksById),
//     };
//   }

//   handleToggleOpen = () => {
//     this.setState(({ open }) => ({ open: !open }));
//   };

//   handleZoomIn = () => {
//     this.setState(({ zoom }) => ({ zoom: Math.min(zoom + 1, MAX_ZOOM) }));
//   };

//   handleZoomOut = () => {
//     this.setState(({ zoom }) => ({ zoom: Math.max(zoom - 1, MIN_ZOOM) }));
//   };

//   handleToggleTrackOpen = (track) => {
//     this.setState((state) => {
//       const tracksById = {
//         ...state.tracksById,
//         [track.id]: {
//           ...track,
//           isOpen: !track.isOpen,
//         },
//       };

//       return {
//         tracksById,
//         tracks: Object.values(tracksById),
//       };
//     });
//   };

//   render() {
//     const { open, zoom, tracks } = this.state;
//     const start = new Date(`${START_YEAR}`);
//     const end = new Date(`${START_YEAR + NUM_OF_YEARS}`);
//     return (
//       <div className="app">
//         <h1 className="title">React Timelines</h1>
//         <Timeline
//           scale={{
//             start,
//             end,
//             zoom,
//             zoomMin: MIN_ZOOM,
//             zoomMax: MAX_ZOOM,
//           }}
//           isOpen={open}
//           toggleOpen={this.handleToggleOpen}
//           zoomIn={this.handleZoomIn}
//           zoomOut={this.handleZoomOut}
//           clickElement={clickElement}
//           clickTrackButton={(track) => {
//             // eslint-disable-next-line no-alert
//             alert(JSON.stringify(track));
//           }}
//           timebar={timebar}
//           tracks={tracks}
//           now={now}
//           toggleTrackOpen={this.handleToggleTrackOpen}
//           enableSticky
//           scrollToNow
//         />
//       </div>
//     );
//   }
// }

// export default App;


// /* eslint-disable import/no-unresolved */
// import React, { useEffect, useState } from "react";
// import Timeline from "react-timelines";
// import "react-timelines/lib/css/style.css";
// import { START_YEAR, NUM_OF_YEARS } from "./constants";
// import { buildTimebar, buildTrackFromApiData } from "./builders";
// import API_URL from "../../../config";
// import Moment from "moment";
// import { el } from "date-fns/locale";
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// import { format } from "date-fns";

// const MySwal = withReactContent(Swal);

// const now = new Date("2025-01-01");
// const MIN_ZOOM = 90;
// const MAX_ZOOM = 90;

// const App = () => {
//   const [open, setOpen] = useState(false);
//   const [zoom, setZoom] = useState(90);
//   const [tracks, setTracks] = useState([]);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   const timebar = buildTimebar();

//   useEffect(() => {
//     const hotelIDData = JSON.stringify({
//       hotelID: 1
//     });
//     fetch(API_URL + "/getBusinessDate", {
//       method: "POST",
//       headers: { 'Content-Type': 'application/json' },
//       body: hotelIDData
//     }).then((res) => res.json())
//       .then(postres => {
//         const today = new Date(postres['data'][0]['businessDate']);
//         const rawDate = postres['data'][0]['businessDate'];
//         const year = new Date(rawDate).getFullYear();
//         const yearStart = new Date(`${year}-01-01`);
//         setStartDate(today);
//       });
//   }, []);

//   const handleToggleOpen = () => setOpen((prev) => !prev);
//   const handleZoomIn = () => setZoom((prev) => Math.min(prev + 1, MAX_ZOOM));
//   const handleZoomOut = () => setZoom((prev) => Math.max(prev - 1, MIN_ZOOM));

//   const handleBounceIn = (element) => {
//     return MySwal.fire({
//       title: 'Booking Details',
//       html: `
//         <div style="text-align: center; line-height: 1.8;">
//           <div><strong>Guest:</strong> ${element.title}</div>
//           <div><strong>Arrival:</strong> ${format(new Date(element.start), 'dd MMM yy')}</div>
//           <div><strong>Departure:</strong> ${format(new Date(element.end), 'dd MMM yy')}</div>
//         </div>
//       `,
//       customClass: {
//         confirmButton: 'btn btn-primary'
//       },
//       showClass: {
//         popup: 'animate__animated animate__bounceIn'
//       },
//       buttonsStyling: false
//     });
//   };

//   const clickElement = (element) => {
//     console.log(element.title);
//     console.log(format(new Date(element.start), 'dd MMM yy'));
//     console.log(format(new Date(element.end), 'dd MMM yy'));
//     handleBounceIn(element);
//   };

//   const handleToggleTrackOpen = (track) => {
//     setTracks((prevTracks) =>
//       prevTracks.map((t) =>
//         t.id === track.id ? { ...t, isOpen: !t.isOpen } : t
//       )
//     );
//   };

//   const fetchData = async (month, year) => {
//     try {
//       const res = await fetch(`${API_URL}/getOccupancyRoomWiseInventoryView`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ 
//           hotelID: 10,
//           month: month,
//           year: year
//         }),
//       });

//       const data = await res.json();
//       let formattedTracks = buildTrackFromApiData(data.data);
//       formattedTracks = formattedTracks.map((track, index) => ({
//         ...track,
//         isOpen: index === 0,
//       }));

//       setTracks(formattedTracks);
      
//       // Update the timeline range to show the selected month
//       const newStartDate = new Date(year, month - 1, 1);
//       const newEndDate = new Date(year, month, 0); // Last day of the month
//       setStartDate(newStartDate);
//       setEndDate(newEndDate);
//     } catch (error) {
//       console.error("Error fetching timeline data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData(selectedMonth, selectedYear);
//   }, [selectedMonth, selectedYear]);

//   // Generate month options
//   const monthOptions = Array.from({ length: 12 }, (_, i) => ({
//     value: i + 1,
//     label: new Date(0, i).toLocaleString('default', { month: 'long' })
//   }));

//   // Generate year options (current year ± 5 years)
//   const currentYear = new Date().getFullYear();
//   const yearOptions = Array.from({ length: 11 }, (_, i) => ({
//     value: currentYear - 5 + i,
//     label: currentYear - 5 + i
//   }));

//   return (
//     <div className="app">
//       <h1 className="title">Guest Calendar</h1>
      
//       {/* Filter Controls */}
//       <div className="timeline-filters" style={{ 
//         margin: '0 0 20px 0',
//         padding: '15px',
//         background: '#f8f9fa',
//         borderRadius: '4px',
//         display: 'flex',
//         gap: '10px',
//         alignItems: 'center'
//       }}>
//         <div className="filter-group">
//           <label htmlFor="month-select" style={{ marginRight: '5px' }}>Month:</label>
//           <select
//             id="month-select"
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//             className="form-control"
//             style={{ width: '150px' }}
//           >
//             {monthOptions.map(month => (
//               <option key={month.value} value={month.value}>
//                 {month.label}
//               </option>
//             ))}
//           </select>
//         </div>
        
//         <div className="filter-group">
//           <label htmlFor="year-select" style={{ marginRight: '5px' }}>Year:</label>
//           <select
//             id="year-select"
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//             className="form-control"
//             style={{ width: '100px' }}
//           >
//             {yearOptions.map(year => (
//               <option key={year.value} value={year.value}>
//                 {year.label}
//               </option>
//             ))}
//           </select>
//         </div>
        
//         <button
//           onClick={() => fetchData(selectedMonth, selectedYear)}
//           className="btn btn-primary"
//           style={{ marginLeft: '10px' }}
//         >
//           Apply Filters
//         </button>
//       </div>

//       <Timeline
//         scale={{
//           start: startDate || new Date(selectedYear, selectedMonth - 1, 1),
//           end: endDate || new Date(selectedYear, selectedMonth, 0),
//           zoom,
//           zoomMin: MIN_ZOOM,
//           zoomMax: MAX_ZOOM,
//         }}
//         isOpen={open}
//         toggleOpen={handleToggleOpen}
//         clickElement={clickElement}
//         clickTrackButton={(track) => {
//           console.log("Track clicked:", track);
//         }}
//         timebar={timebar}
//         tracks={Array.isArray(tracks) ? tracks : []}
//         toggleTrackOpen={handleToggleTrackOpen}
//         enableSticky
//         scrollToNow
//       />
//     </div>
//   );
// };

// export default App;

// /* eslint-disable import/no-unresolved */
// import React, { useEffect, useState } from "react";
// import Timeline from "react-timelines";

// import "react-timelines/lib/css/style.css";

// import { START_YEAR, NUM_OF_YEARS } from "./constants";
// import { buildTimebar, buildTrackFromApiData } from "./builders";
// import API_URL from "../../../config";
// import Moment from "moment";
// import { el } from "date-fns/locale";
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
// import { format } from "date-fns";
// const MySwal = withReactContent(Swal)
// import Backdrop from '@mui/material/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress'
// const now = new Date("2025-01-01");
// const MIN_ZOOM = 90;
// const MAX_ZOOM = 90;

// const App = () => {
//   const [open, setOpen] = useState(false);
//   const [zoom, setZoom] = useState(90);
//   const [tracks, setTracks] = useState([]);
//   const [startDate, setStartDate] = useState(null);
// const [endDate, setEndDate] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);

//   const timebar = buildTimebar();


//    useEffect(() => {
//       const hotelIDData = JSON.stringify({
//         hotelID: 1
//       })
//       fetchx(API_URL + "/getBusinessDate", {
//         method: "POST",
//         headers: { 'Content-Type': 'application/json' },
//         body: hotelIDData
//       }).then((res) => res.json())
//         .then(postres => {
//           const today = new Date(postres['data'][0]['businessDate']);
//           const tomorrow = new Date(today);
//           tomorrow.setDate(today.getDate() + 1);
//           // setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
//           const rawDate = postres['data'][0]['businessDate'];
//           // const today = new Date(rawDate);
     
//           const year = new Date(rawDate).getFullYear();
    
//           const yearStart = new Date(`${year}-01-01`);
//           setStartDate(today);
   
    
//         })
//     }, []);

//   const handleToggleOpen = () => setOpen((prev) => !prev);
//   const handleZoomIn = () => setZoom((prev) => Math.min(prev + 1, MAX_ZOOM));
//   const handleZoomOut = () => setZoom((prev) => Math.max(prev - 1, MIN_ZOOM));


//   const handleBounceIn = (element) => {
//     return MySwal.fire({
//       title: 'Booking Details',
//       html: `
//            <div style="text-align: center; line-height: 1.8;">
//         <div><strong>Guest:</strong> ${element.title}</div>
//         <div><strong>Arrival:</strong> ${format(new Date(element.start), 'dd MMM yy')}</div>
//         <div><strong>Departure:</strong> ${format(new Date(element.end), 'dd MMM yy')}</div>
//       </div>

//       `,
//       customClass: {
//         confirmButton: 'btn btn-primary'
//       },
//       showClass: {
//         popup: 'animate__animated animate__bounceIn'
//       },
//       buttonsStyling: false
//     });
//   };
  

//   const clickElement = (element) =>{
//     console.log(element.title)
//     console.log(format(new Date(element.start), 'dd MMM yy'))
//     console.log(format(new Date(element.end), 'dd MMM yy'))
//     handleBounceIn(element)
//     // alert(`Clicked element\n${JSON.stringify(element, null, 2)}`);
// }
//   const handleToggleTrackOpen = (track) => {
//     setTracks((prevTracks) =>
//       prevTracks.map((t) =>
//         t.id === track.id ? { ...t, isOpen: !t.isOpen } : t
//       )
//     );
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       // Start a timer to check if the response takes more than 5 seconds
//       const timeout = setTimeout(() => {
//           setShowSecondaryMessage(true);
//       }, 5000);
//       try {
//         const res = await fetch(`${API_URL}/getOccupancyRoomWiseInventoryView`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ hotelID: 10 }),
//         });

//         const data = await res.json();
//         let formattedTracks = buildTrackFromApiData(data.data);
//         // 👉 Open only the first floor/track, close others
//         formattedTracks = formattedTracks.map((track, index) => ({
//           ...track,
//           isOpen: index === 0, // Open first one, rest closed
//         }));
//         setLoading(false);

//         setTracks(formattedTracks);
//       } catch (error) {
//         console.error("Error fetching timeline data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // const start = new Date(`${START_YEAR}`);
//   const start = new Date(`${startDate}`);
//   const end = new Date(`${START_YEAR + NUM_OF_YEARS}`);
// console.log("start", start);
// console.log("start", end);
//   return (
//     <div className="app">
//       <h1 className="title">Guest Calendar View</h1>
//       <Timeline
//         scale={{
//           start,
//           end,
//           zoom,
//           zoomMin: MIN_ZOOM,
//           zoomMax: MAX_ZOOM,
//         }}
//         isOpen={open}
//         toggleOpen={handleToggleOpen}
//         // zoomIn={handleZoomIn}
//         // zoomOut={handleZoomOut}
//         clickElement={clickElement}
//         clickTrackButton={(track) => {
//           alert(JSON.stringify(track));
//         }}
//         timebar={timebar}
//         // tracks={tracks}
//         tracks={Array.isArray(tracks) ? tracks : []}

//         // now={now}
//         // now={startDate}
//         toggleTrackOpen={handleToggleTrackOpen}
//         enableSticky
//         scrollToNow
//       />

//               {/* BackDrop For messages */}
//                   <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
//                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                           <h1 style={{ fontWeight: 'bold', color: 'white' }}>
//                           Loading data, please wait...


//                           </h1>
//                           {showSecondaryMessage && (
//                               <h1 style={{ fontWeight: 'bold', color: 'white' }}>
//                                   Loading records... This may take a few seconds if there’s a lot of data.

//                               </h1>
//                           )}
//                           <CircularProgress color="inherit" />
//                       </div>
//                   </Backdrop>
      
//     </div>
    
//   );
// };

// export default App;


/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from "react";
import Timeline from "react-timelines";
import "react-timelines/lib/css/style.css";
import { START_YEAR, NUM_OF_YEARS } from "./constants";
import { buildTimebar, buildTrackFromApiData } from "./builders";
import API_URL from "../../../config";
import { format, startOfMonth, endOfMonth, addMonths } from "date-fns";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { FormControl, InputLabel, Select, MenuItem, Button, Box } from '@mui/material';

const MySwal = withReactContent(Swal);
const MIN_ZOOM = 90;
const MAX_ZOOM = 90;

const App = () => {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(90);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const timebar = buildTimebar();

  // Handler functions
  const handleToggleOpen = () => setOpen(prev => !prev);
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, MAX_ZOOM));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, MIN_ZOOM));

  const handleBounceIn = (element) => {
    return MySwal.fire({
      title: 'Booking Details',
      html: `
        <div style="text-align: center; line-height: 1.8;">
          <div><strong>Guest:</strong> ${element.title}</div>
          <div><strong>Arrival:</strong> ${format(new Date(element.start), 'dd MMM yy')}</div>
          <div><strong>Departure:</strong> ${format(new Date(element.end), 'dd MMM yy')}</div>
        </div>
      `,
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      showClass: {
        popup: 'animate__animated animate__bounceIn'
      },
      buttonsStyling: false
    });
  };

  const clickElement = (element) => {
    handleBounceIn(element);
  };

  const handleToggleTrackOpen = (track) => {
    setTracks(prevTracks =>
      prevTracks.map(t =>
        t.id === track.id ? { ...t, isOpen: !t.isOpen } : t
      )
    );
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  // const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
  const years = Array.from({ length: 10 }, (_, i) => 2023 + i);
  useEffect(() => {
    const hotelIDData = JSON.stringify({ hotelID: 1 });
    fetch(API_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelIDData
    }).then((res) => res.json())
      .then(postres => {
        const today = new Date(postres['data'][0]['businessDate']);
        setStartDate(today);
        setSelectedMonth(today.getMonth() + 1);
        setSelectedYear(today.getFullYear());
        fetchData();
      });
  }, []);


  const fetchData = async (month = null, year = null) => {
    setLoading(true);
    setShowSecondaryMessage(false);
    
    const timeout = setTimeout(() => {
      setShowSecondaryMessage(true);
    }, 5000);
    
    try {
      const requestBody = { hotelID: 10 };
      console.log("Request Body:", requestBody);
      console.log(" Body:", month,year);
      if (month && year) {
        requestBody.month = month;
        requestBody.year = year;
      }
      console.log("Request Body:", requestBody);


      const res = await fetch(`${API_URL}/getOccupancyRoomWiseInventoryView`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      let formattedTracks = buildTrackFromApiData(data.data);
      formattedTracks = formattedTracks.map((track, index) => ({
        ...track,
        isOpen: index === 0,
      }));
      setTracks(formattedTracks);
      
      if (month && year) {
        const monthStart = startOfMonth(new Date(year, month - 1));
        const monthEnd = endOfMonth(new Date(year, month - 1));
        const bufferStart = addMonths(monthStart, -1);
        const bufferEnd = addMonths(monthEnd, 1);
        setStartDate(bufferStart);
      }
    } catch (error) {
      console.error("Error fetching timeline data:", error);
      MySwal.fire({
        title: 'Error',
        text: 'Failed to fetch data',
        icon: 'error'
      });
    } finally {
      setLoading(false);
      clearTimeout(timeout);
    }
  };

  const handleApplyFilter = () => {
    if (selectedMonth && selectedYear) {
      fetchData(selectedMonth, selectedYear);
    } else {
      fetchData();
    }
  };

  const getTimelineRange = () => {
    if (selectedMonth && selectedYear) {
      const monthStart = startOfMonth(new Date(selectedYear, selectedMonth));
      const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth));
      return {
        start: addMonths(monthStart, -1),
        end: addMonths(monthEnd, 1)
      };
    }
    
    return {
      start: startDate || new Date(`${START_YEAR}`),
      end: new Date(`${START_YEAR + NUM_OF_YEARS}`)
    };
  };

  const { start, end } = getTimelineRange();

  return (
    <>
    <div className="app">
      <h1 className="title">Guest Calendar View</h1>
      
      {/* Filter controls and timeline component */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap', height: '20px', }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth}
            label="Month"
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            label="Year"
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button variant="contained" onClick={handleApplyFilter}>
          Apply Filter
        </Button> 
      </Box>

      <Timeline
        scale={{ start, end, zoom, zoomMin: MIN_ZOOM, zoomMax: MAX_ZOOM }}
        isOpen={open}
        toggleOpen={handleToggleOpen}
        clickElement={clickElement}
        timebar={timebar}
        tracks={Array.isArray(tracks) ? tracks : []}
        toggleTrackOpen={handleToggleTrackOpen}
        enableSticky
        scrollToNow
      />

     
    </div>
     <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
       <h1 style={{ fontWeight: 'bold', color: 'white' }}>Loading data, please wait...</h1>
       {showSecondaryMessage && (
         <h1 style={{ fontWeight: 'bold', color: 'white' }}>
           Loading records... This may take a few seconds if there's a lot of data.
         </h1>
       )}
       <CircularProgress color="inherit" />
     </div>
   </Backdrop>
   </>
  );
};

export default App;