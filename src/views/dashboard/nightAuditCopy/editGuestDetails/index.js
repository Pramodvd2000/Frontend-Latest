// ** React Imports
import { useRef, useState } from "react";
import { Fragment } from "react";

// ** Reactstrap Imports
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  CardBody,
} from "reactstrap";

// ** Custom Components
import Wizard from "@components/wizard";


// ** Icons Imports
import { FileText, User, MapPin, Link } from "react-feather";
import { Card  ,
   CardTitle,} from "reactstrap";

import { Check, Circle,Edit2,PlusCircle,Eye,ArrowRightCircle,AlertTriangle } from "react-feather";

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

import { Popover, PopoverHeader, PopoverBody } from "reactstrap";
import Select from "react-select";

// import ViewGuest from "./viewGuest";
// import classnames from "classnames";
// import "./hover.scss";

import { selectThemeColors } from "@utils";
const salutations = [
  { value: "Mr", label: "Mr." },
  { value: "Mrs", label: "Mrs." },
  { value: "Ms", label: "Ms." },
  { value: "Dr", label: "Dr." },
  { value: "Mast.", label: "Mast.." },
  { value: "Prof", label: "Prof." },
  { value: "Capt", label: "Capt." },
  { value: "Wg Cdr.", label: "Wg Cdr." },
  { value: "Major.", label: "Major." },
  { value: "Brig", label: "Brig." },
  { value: "Col.", label: "Col." },
  { value: "Lt Col", label: "Lt Col" },
  { value: "Lt", label: "Lt." },
  { value: "Maj Gen.", label: "Maj Gen" },
];
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
  const [autofill, setautofill] = useState(false);
  const [editable, seteditable] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [enableEditBtn, setenableEditBtn] = useState(true);
  // const gridRef = useRef();

  const [show, actionButton] = useState(false);
  const [showEdit, editButton] = useState(false);

  const [rowData, setRowData] = useState();
  const [data, setData] = useState(null);

  const gridRef = useRef();
//   const [columnDefs, setColumnDefs] = useState([
//     // { headerName: 'Salutation', field: 'salutation', suppressSizeToFit: true, maxWidth:190 },
//     // { headerName: 'Name', field: 'name', suppressSizeToFit: true, maxWidth: 160 },

//     {
//       headerName: "Name",
//       field: "fullName",
//       valueGetter(params) {
//         return params.data.salutation + " " + params.data.name;
//       },
//       suppressMenu: true,
//       suppressSizeToFit: true,
//       maxWidth: 120,
//       cellStyle: { textAlign: "center", backgroundColor: "#F1E39B" },
//     },
//     {
//       headerName: "Email",
//       field: "email",
//       suppressSizeToFit: true,
//       maxWidth: 220,
//       cellStyle: { textAlign: "center", backgroundColor: "pink" },
//     },
//     {
//       headerName: "Phone Number",
//       field: "phoneNumber",
//       suppressSizeToFit: true,
//       maxWidth: 120,
//       cellStyle: { textAlign: "center", backgroundColor: "#F1E39B" },
//     },
//     {
//       headerName: "Company",
//       field: "accountName",
//       suppressSizeToFit: true,
//       maxWidth: 120,
//       cellStyle: { textAlign: "center", backgroundColor: "pink" },
//     },
//     {
//       headerName: "GST ID ",
//       field: "gstID",
//       suppressSizeToFit: true,
//       maxWidth: 110,
//       cellStyle: { textAlign: "center", backgroundColor: "#F1E39B" },
//     },
//     {
//       headerName: "Nationality",
//       field: "nationality",
//       suppressSizeToFit: true,
//       maxWidth: 90,
//       cellStyle: { textAlign: "center", backgroundColor: "pink" },
//     },
//     {
//       headerName: "DOB ",
//       field: "dob",
//       suppressSizeToFit: true,
//       maxWidth: 110,
//       cellStyle: { textAlign: "center", backgroundColor: "#F1E39B" },
//     },
//     {
//       headerName: "Address One",
//       field: "addressOne",
//       suppressSizeToFit: true,
//       maxWidth: 160,
//       cellStyle: { textAlign: "center", backgroundColor: "pink" },
//     },
//     {
//       headerName: "Action",
//       field: "numAvlRooms",
//       suppressSizeToFit: true,
//       maxWidth: 140,
//       cellRendererFramework: (params) => (
//         <Button
//           color="primary"
//           onClick={() => {
//             filldata.length != 0 && actionButton(!show);
//           }}
//         >
//            
//           View 
//         </Button>
//       ),
//     },
//     ,
//   ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));

//   useEffect(() => {
//     fetchx(API_URL + "/getGuestProfileNew?hotelID=1")
//       .then((result) => result.json())
//       .then((rowData) => setRowData(rowData["data"]));
//   }, []);

  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
    // console.log(event["data"]);
    setfilldata(event["data"]);
    console.log(event["rowIndex"]);
    // console.log(event["data"]["id"]);
    // console.log(event["data"]["idDetails"]); 
    setfilldata1(event["data"]["idDetails"])  
    // console.log(event["data"]["idDetails"]["idType"]);
    setfilldata2(event["data"]["membershipDetails"])  
    console.log(event["data"]["membershipDetails"]["membershipType"]);
    setautofill(true);
    setShowForm(false);
    seteditable(true);
    setTimeout(() => {
      setShowForm(true);
    }, 200);
    setenableEditBtn(false);
  }, []);

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
