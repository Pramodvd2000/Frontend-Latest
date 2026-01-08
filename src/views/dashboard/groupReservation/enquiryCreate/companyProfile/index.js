// ** React Imports
import { useRef, useState } from "react";
import Wizard from "@components/wizard";

// // ** Steps
import CompanyInformation from "./companyInformation";
import BTC from "./btc";
// import Booker from "./booker";

import "/node_modules/ag-grid-community/styles/ag-grid.css";
import "/node_modules/ag-grid-community/styles/ag-theme-alpine.css";


const WizardModern = ({toggleModal}) => {
  const [open, setOpen] = useState('1')

  // const [open, setOpen] = useState("");
  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id); 
  };
  // console.log(data1)

  // AGgrid
  // const [rowData, setRowData] = useState();
  const [filldata, setfilldata] = useState(" ");
  const gridRef = useRef();

  const ref = useRef(null);
   // Account Details Page
  const [stepper, setStepper] = useState(null);

  const steps = [
    {
      id: "companyInformation", 
      title: " Basic Company Information",
      subtitle: "Enter Your Company Information.",
      content: (
        <CompanyInformation
          toggleModal={toggleModal}
          data1={filldata}
          stepper={stepper}
          type="wizard-modern"
        />
      ),
    },
    {
      id: "btc",
      title: "BTC Details",
      subtitle: "Add BTC Details",
      // icon: <User size={18} />,
      content: <BTC data1={filldata} stepper={stepper} type="wizard-modern" toggleModal={toggleModal}/>,
    },
    // {
    //   id: "booker",
    //   title: "Booker",
    //   subtitle: "Enter Booker Details",
    //   // icon: <MapPin size={18} />,
    //   content: <Booker stepper={stepper} type="wizard-modern" />,
    // },
    
  ];

  return (
    <div>
      <div>
          <h4>
            <b> Create Company Information </b>{" "}
          </h4>
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
