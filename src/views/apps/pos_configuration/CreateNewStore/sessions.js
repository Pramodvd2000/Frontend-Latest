import { useState, useEffect } from "react";
import {
  Row, Card, CardHeader, CardTitle, CardBody, Button,
  Col, Label, Input, Form, InputGroup, FormFeedback,  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { selectThemeColors } from "@utils";
import classnames from "classnames";
import API_URL from "../../../../config";


// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import 'ag-grid-enterprise';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useRef, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
const SessionForm = ({onSubmit}) => {
  const [restaurants,setrestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);
  const { reset, handleSubmit, control, formState: { errors: errors1 } } = useForm({});
  const [data, setData] = useState(null);
  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [OverWriteModal,setOverWriteModal] = useState(false)
  const MySwal = withReactContent(Swal)
//   const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    if (selectedRestaurant) {
      setSessions([
        {
          sessionName: "",
          startTime: "00:00:00",
          endTime: "23:59:59"
        }
      ]);
    }
  }, [selectedRestaurant]);
  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'ID', field: 'id', suppressSizeToFit: true, maxWidth: 160, },
    { headerName: 'Store ID', field: 'storeID', suppressSizeToFit: true },
    { headerName: 'Store Name', field: 'restaurantName', suppressSizeToFit: true },
    { headerName: 'Session Name', field: 'sessionName' },
    { headerName: 'Session startTime', field: 'startTime', suppressSizeToFit: true ,editable: true},
    { headerName: 'Session endTime', field: 'endTime', suppressSizeToFit: true,editable: true },
    // {headerName: 'status',field: 'status'},

  ]);

  const gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
      flex: 1,
      minWidth: 150,
      filter: true,
      sortable: true,
      floatingFilter: true,
    },
  };


  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));


  useEffect(() => {
    // console.log("Clicked")
    // fetchx(API_URL + '/getSessionDetails?hotelID=' + 1)
    //   .then(result => result.json())
    //   .then(rowData => {
    //     setRowData(rowData['data'])
    //     // console.log(rowData['data'])
    //   })

    //   fetchx(API_URL+'/getStoreList?hotelID=1')
    //   .then(result => result.json())
    //   .then(rowData => {
    //    setrestaurants(rowData['data'])
     
    //   console.log(rowData['data'])
    //  })
  },[]);



  const cellClickedListener = useCallback(event => {
    // console.log('cellClicked', event);
  }, []);
  useEffect(() => {
    const newErrors = {};
    let isValid = true;

    if (!selectedRestaurant) {
      newErrors.restaurant = "Please select a restaurant";
      isValid = false;
    }

    sessions.forEach((session, index) => {
      if (!session.sessionName.trim()) {
        newErrors[`sessionName_${index}`] = "Session name is required";
        isValid = false;
      }
      if (!session.endTime) {
        newErrors[`endTime_${index}`] = "End time is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    setFormValid(isValid);
  }, [selectedRestaurant, sessions]);

  const addOneMinute = (timeStr) => {
    let [hours, minutes, seconds] = timeStr.split(':').map(Number);
    minutes += 1;
    if (minutes === 60) {
      minutes = 0;
      hours = (hours + 1) % 24;
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  const handleSuccess = (message) => {
    return MySwal.fire({
        text: message,
        icon: 'success',
        customClass: {
            confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
    })
}
  const handleError = (message) => {
    return MySwal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        customClass: {
            confirmButton: 'btn btn-danger'
        },
        allowOutsideClick: false,
        confirmButtonText: 'Close',
        confirmButtonColor: 'danger',
        buttonsStyling: false
    })
  }


  const updateSession = (index, key, value) => {
    const updatedSessions = [...sessions];
    updatedSessions[index][key] = value;

    if (key === "endTime") {
      const [hours, minutes] = value.split(':');
      updatedSessions[index].endTime = `${hours}:${minutes}:00`;

      if (index < sessions.length - 1) {
        const nextStartTime = addOneMinute(updatedSessions[index].endTime);
        updatedSessions[index + 1].startTime = nextStartTime;
      }

      if (index === sessions.length - 1) {
        const newStartTime = addOneMinute(updatedSessions[index].endTime);
        const newSession = {
          sessionName: "",
          startTime: newStartTime,
          endTime: "23:59:59"
        };
        updatedSessions.push(newSession);
      }
    }

    setSessions(updatedSessions);
  };


  const handleSubmitForm = (e) => {
    e.preventDefault(); // Uncomment this to prevent page reload

    console.log('submit and navigate',sessions)

    sessionStorage.setItem('SessionForm',JSON.stringify(sessions));

    // fetchx(API_URL+"/InsertPOSSessions", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     sessions: sessions
    //   })
    // }).then((response) => response.json())
    // .then((res) => {
    //   console.log(res)
    //   if(res['statusCode']==200){
    //     handleSuccess('Sessions added successfully')
    //     // Removed setRefreshTrigger since it's commented out in your state
    //     setSelectedRestaurant("")
        onSubmit() // Pass the sessions data to parent component
    //   } else {
    //     handleError('Could not add the sessions, Please try again')
    //   }
    // });
    
    // console.log({
    //   restaurant: selectedRestaurant,
    //   sessions: sessions
    // });
  };


  return (
    <div>
      <Form onSubmit={handleSubmitForm}>
        {(
          <div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Session Name</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session, index) => (
                    <tr key={index}>
                      <td>
                        <Input
                          value={session.sessionName}
                          onChange={(e) => updateSession(index, "sessionName", e.target.value)}
                          placeholder="Enter session name"
                          invalid={!!errors[`sessionName_${index}`]}
                        />
                        {errors[`sessionName_${index}`] && (
                          <FormFeedback>{errors[`sessionName_${index}`]}</FormFeedback>
                        )}
                      </td>
                      <td style={{ width: "550px" }}>
                        <Input
                          value={session.startTime}
                          disabled
                          className="bg-light"
                        />
                      </td>
                      <td style={{ width: "550px" }}>
                        <Input
                          type="time"
                          step="1"
                          value={session.endTime}
                          onChange={(e) => updateSession(index, "endTime", e.target.value)}
                          invalid={!!errors[`endTime_${index}`]}
                        />
                        {errors[`endTime_${index}`] && (
                          <FormFeedback>{errors[`endTime_${index}`]}</FormFeedback>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <Button
                type="submit" // Explicitly set type to submit
                color="primary"
                disabled={!formValid}
                className="me-1"
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

export default SessionForm;