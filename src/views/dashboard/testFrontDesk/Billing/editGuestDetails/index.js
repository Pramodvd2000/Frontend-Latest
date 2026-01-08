// ** React Imports
import { useRef, useState } from "react";
import Wizard from "@components/wizard";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useForm, Controller } from "react-hook-form";
import { useEffect, useMemo, useCallback } from "react";
// // ** Steps2
import EditBasicDetails from "./editbasicDetails";
import EditIdDetails from "./editIdDetails";
// import EditMembershipDetails from "./editMembershipDetails";
import API_URL from "../../../../../config";
const defaultValues = {
  // hotelID: '',
  floor: "",
  blockID: null,
};

let dailyCheck = 0;


const WizardModern = (ReservationData) => {
    console.log(ReservationData.ReservationData)
    const ReservationDetails = (ReservationData.ReservationData)
    let x = ReservationData.ReservationData.guestID
    console.log(x)

  const {
    setError,
    formState: { errors },
  } = useForm();

  const { reset, handleSubmit, control } = useForm({ defaultValues });

  const [open, setOpen] = useState("");
  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id);
  };

  // AGgrid
  // const [rowData, setRowData] = useState();
  const [filldata, setfilldata] = useState({});

  // const gridRef = useRef();


  // const [rowData, setRowData] = useState(null); // Set initial state to null or an appropriate default value


  // if(x !== null){
  //   fetchx(API_URL + `/getGuestInformation?hotelID=1&guestID=${ReservationDetails.guestID}`)
  //     .then((result) => result.json())
  //     .then((data) => {
  //       if (data && data.data && data.data.length > 0) {
  //         setRowData(data.data[0]);
  //       } else {
  //         // Handle the case where no data is returned, e.g., setRowData to a default value
  //         setRowData(null); // You can also set it to an appropriate default value
  //       }
  //     })
  //     .catch((error) => {
  //       // Handle any fetch errors here
  //       console.error('Error fetching data:', error);
  //       setRowData(null); // Set to null or another appropriate default value
  //     });
  // }

  const [rowData, setRowData] = useState(null);

useEffect(() => {
  if (ReservationDetails.guestID !== null) {
    fetchx(API_URL + `/getGuestInformation?hotelID=1&guestID=${ReservationDetails.guestID}`)
      .then((result) => {
        if (!result.ok) {
          throw new Error(`Request failed with status: ${result.status}`);
        }
        return result.json();
      })
      .then((data) => {
        if (data && data.data && data.data.length > 0) {
          setRowData(data.data[0]);
        } else {
          // Handle the case where no data is returned, e.g., setRowData to a default value
          setRowData(null); // You can also set it to an appropriate default value
        }
      })
      .catch((error) => {
        // Handle fetch errors here
        console.error('Error fetching data:', error);
        setRowData(null); // Set to null or another appropriate default value
      });
  }
}, [ReservationDetails.guestID]); // This will only trigger when guestID changes

// Rest of your component code

  // useEffect(() => {
  //   console.log(ReservationDetails.guestID);
  
  //   if (ReservationDetails.guestID !== null) { // Check if guestID is not null
  //     fetchx(API_URL + `/getGuestInformation?hotelID=1&guestID=${ReservationDetails.guestID}`)
  //       .then((result) => result.json())
  //       .then((data) => {
  //         if (data && data.data && data.data.length > 0) {
  //           setRowData(data.data[0]);
  //         } else {
  //           // Handle the case where no data is returned, e.g., setRowData to a default value
  //           setRowData(null); // You can also set it to an appropriate default value
  //         }
  //       })
  //       .catch((error) => {
  //         // Handle any fetch errors here
  //         console.error('Error fetching data:', error);
  //         setRowData(null); // Set to null or another appropriate default value
  //       });
  //   }
  // }, [ReservationDetails.guestID]); 

console.log(rowData)
  // ** Ref
  const ref = useRef(null);
//State
  const [stepper2, setstepper2] = useState(null);
  const steps2 = [
    {
      id: "editbasicDetails",
      title: "Basic Details",
      subtitle: "Edit Your Basic Details.",
      // icon: <FileText size={18} />,
      content: (
        <EditBasicDetails
          data1={rowData}
          stepper2={stepper2}
          type="wizard-modern"
        />
      ),
    },
   {
     id: "editIdDetails",
      title: "ID Details",
     subtitle: "Edit Your ID Details.",
      // icon: <FileText size={18} />,
     content: (
       <EditIdDetails  data1={rowData}
       stepper2={stepper2}
       type="wizard-modern"
       />
     ),
   },
    // {
    //   id: "editMembershipDetails",
    //   title: "Membership Details",
    //   subtitle: "Edit Your Membership Details.",
    //   // icon: <FileText size={18} />,
    //   content: (
    //     <EditMembershipDetails
    //     data3={data2}
    //       stepper2={stepper2}
    //       type="wizard-modern"
    //     />
    //   ),
    // },
  
  ];

  return (
    <div>
      {console.log(rowData)}
     <div className="modern-horizontal-wizard">
                  <Wizard
                    type="modern-horizontal"
                    ref={ref}
                    steps={steps2}
                    options={{
                      linear: false,
                    }}
                    instance={(el) => setstepper2(el)}
                  />
                </div>
 </div>
  );
};
export default WizardModern;
