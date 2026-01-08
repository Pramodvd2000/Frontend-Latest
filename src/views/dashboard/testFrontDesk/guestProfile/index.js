// ** React Imports
import { useRef, useState } from "react";

// ** Custom Components
import Wizard from "@components/wizard";

// // ** Steps
import BasicDetails from "./basicDetails";
import IDDetails from "./idDetails";
// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useForm, Controller } from "react-hook-form";

const defaultValues = {
  floor: "",
  blockID: null,
};

const WizardModern = ({ toggleModal }) => {

  const {
    setError,
    formState: { errors },
  } = useForm();

  const { reset, handleSubmit, control } = useForm({ defaultValues });

  const [open, setOpen] = useState("");
  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id);
  };

  const [filldata, setfilldata] = useState({});

  // ** Ref
  const ref = useRef(null);

  // ** State
  const [stepper, setStepper] = useState(null);

  const steps = [
    {
      id: "basicDetails",
      title: "Basic Details",
      subtitle: "Enter Your Basic Details.",
      // icon: <FileText size={18} />,
      content: (
        <BasicDetails data1={filldata} toggleModal={toggleModal} stepper={stepper} type="wizard-modern" />
      ),
    },
    {
      id: "idDetails",
      title: "ID Details",
      subtitle: "Add ID Details",
      // icon: <User size={18} />,
      content: (
        <IDDetails data1={filldata} stepper={stepper} type="wizard-modern" />
      ),
    },
    // {
    //   id: "membershipDetails",
    //   title: "Membership Details",
    //   subtitle: "Enter Membership Details",
    //   // icon: <MapPin size={18} />,
    //   content: (
    //     <MembershipDetails
    //       data1={filldata}
    //       stepper={stepper}
    //       type="wizard-modern"
    //     />
    //   ),
    // },
  ];


  return (
    <div>
      <div>
          <div className="modern-horizontal-wizard">
            <Wizard
              type="modern-horizontal"
              ref={ref}
              steps={steps}
              options={{
                linear: false,
              }}
              instance={(el) => setStepper(el)}
            />
          </div>
      </div>
    </div>
  );
};

export default WizardModern;
