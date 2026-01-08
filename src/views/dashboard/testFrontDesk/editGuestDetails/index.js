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
// import History from "./history";
import EditIdDetails from "./editIdDetails";
import EditMembershipDetails from "./editMembershipDetails";

// import ViewGuest from "./viewGuest";
// import classnames from "classnames";
// import "./hover.scss";

const defaultValues = {
  // hotelID: '',
  floor: "",
  blockID: null,
};

const WizardModern = (data2) => {
    console.log(data2)

  const {
    setError,
    formState: { errors },
  } = useForm();

  const { reset, handleSubmit, control } = useForm({ defaultValues });

  const [open, setOpen] = useState("");
  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id);
  };
  // console.log(data1)

  // AGgrid
  // const [rowData, setRowData] = useState();
  const [filldata, setfilldata] = useState({});
  const [filldata1, setfilldata1] = useState();
  const [filldata2, setfilldata2] = useState();
  // const gridRef = useRef();

  const [show, actionButton] = useState(false);
  const [showEdit, editButton] = useState(false);

  const [rowData, setRowData] = useState();
  const [data, setData] = useState(null);

  const gridRef = useRef();

//   useEffect(() => {
//     fetchx(API_URL + "/getGuestProfileNew?hotelID=1")
//       .then((result) => result.json())
//       .then((rowData) => setRowData(rowData["data"]));
//   }, []);

 

  console.log(filldata2);



  // console.log(filldata["membershipDetails"]);

  const buttonListener = useCallback((e) => {
    gridRef.current.api.deselectAll();
  }, []);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [basicModal, setBasicModal] = useState(false);
  const [disabledModal, setDisabledModal] = useState(false);

  // ** Ref
  const ref = useRef(null);

  // ** State
//   const [stepper, setStepper] = useState(null);

//   const steps = [
//     {
//       id: "basicDetails",
//       title: "Basic Details",
//       subtitle: "Enter Your Basic Details.",
//       // icon: <FileText size={18} />,
//       content: (
//         <BasicDetails data1={filldata} stepper={stepper} type="wizard-modern" />
//       ),
//     },
//     {
//       id: "idDetails",
//       title: "ID Details",
//       subtitle: "Add ID Details",
//       // icon: <User size={18} />,
//       content: (
//         <IDDetails data1={filldata} stepper={stepper} type="wizard-modern" />
//       ),
//     },
//     {
//       id: "membershipDetails",
//       title: "Membership Details",
//       subtitle: "Enter Membership Details",
//       // icon: <MapPin size={18} />,
//       content: (
//         <MembershipDetails
//           data1={filldata}
//           stepper={stepper}
//           type="wizard-modern"
//         />
//       ),
//     },
//   ];

  const [stepper2, setstepper2] = useState(null);
  const steps2 = [
    {
      id: "editbasicDetails",
      title: "Basic Details",
      subtitle: "Edit Your Basic Details.",
      // icon: <FileText size={18} />,
      content: (
        <EditBasicDetails
          data3={data2}
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
        <EditIdDetails
        data3={data2}
        stepper2={stepper2}
        type="wizard-modern"
        />
      ),
    },
    {
      id: "editMembershipDetails",
      title: "Membership Details",
      subtitle: "Edit Your Membership Details.",
      // icon: <FileText size={18} />,
      content: (
        <EditMembershipDetails
        data3={data2}
          stepper2={stepper2}
          type="wizard-modern"
        />
      ),
    },
    // {
    //   id: "history",
    //   title: "History Details",
    //   subtitle: "view History Details",
    //   // icon: <MapPin size={18} />,
    //   content: (
    //     <History data1={filldata} stepper2={stepper2} type="wizard-modern" />
    //   ),
    // },
  ];

  return (
    <div>

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
     

   
{/* 
      <Card>
        <Modal
          isOpen={show}
          toggle={() => actionButton(!show)}
          className="modal-xl"
        >
          <ModalHeader toggle={() => actionButton(!show)}>
             
            View Guest Profile... 
          </ModalHeader>
          <ModalBody>
            <Card>
              <div className="d-flex">
                <Button
                  className="me-1"
                  style={{ marginLeft: "auto" }}
                  color="primary"
                  onClick={() => {
                    filldata.length != 0 && editButton(!showEdit);
                  }}
                >
                  Edit
                </Button>
              </div>
              <Card>
                
     
              </Card>


            </Card>
          </ModalBody>
          
        </Modal>
      </Card> */}
 </div>
  );
};

export default WizardModern;
