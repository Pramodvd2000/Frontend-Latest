import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import { useNavigate } from 'react-router-dom';
import API_URL from "../../../../config";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const Floor = ({ data1 }) => {
  console.log("data1", data1);
  
  const [idDetail, setIDDetails] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [tableID, settableID] = useState(data1); 
  const [show1, actionButton1] = useState(false);
  const [completeData, setCompleteData] = useState([]);
  const [tableIdData, settableIdData] = useState([]);

  const gridRef = useRef();
  const navigate = useNavigate();

  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
    setCompleteData(event.data);
    settableIdData([event.data.rateCodeID]); // Change the logic as per your needs
  }, []);

  useEffect(() => {
    console.log("tableID=====",tableID)
    if (tableID) {
      fetchx(`${API_URL}/getStewardListTablewise?tableID=${tableID}&hotelID=10`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched data:", data); 
          if (data.data && Array.isArray(data.data)) {
            setRowData(data.data);
          } else {
            console.error("Response is not an array", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching table list stewardwise:", error);
        });
    }
  }, [tableID]);

  const columnDefs = useMemo(() => [
    {
      headerName: "Restaurant Name",
      field: "restaurantName",
      suppressSizeToFit: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 300
    },
    {
        headerName: "Table No",
        field: "tableNo",
        suppressSizeToFit: true,
        maxWidth: 140
      },
    {
      headerName: "Steward Name",
      field: "stewardName",
      suppressSizeToFit: true,
      maxWidth: 250
    }
  ], []);


  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }), []);

  const navigatepage = async () => {
    try {
      const response = await fetchx(API_URL + "/getTablewiseStewardMappingDetails");
      const result = await response.json();
      setRowData(result["data"]);
      navigate(''); // Consider placing this after setting state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const handleBulkDelete = () => {
    const selectedRows = gridRef.current.api.getSelectedRows(); // Get selected rows
    console.log('selectedRows',selectedRows)
    const idsToDelete = selectedRows.map(row => row.stewardID); // Collect the ids of the selected rows
    
    if (idsToDelete.length > 0) {
      const updatedItem = JSON.stringify({
        hotelID: 1,
        stewardIDs: idsToDelete,
        tableNo: tableID,
      });
      console.log("updatedItem",updatedItem)
      fetchx(API_URL + `/deleteTableStewardMap`, {      
        method: "POST",
        body: updatedItem,
        headers: { "Content-type": "application/json" },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
          fetchx(API_URL + `/getStewardListTablewise?tableID=${tableID}&hotelID=10`)
          .then((result) => result.json())
          .then((rowData) => setRowData(rowData["data"]));
            const swalInstance = MySwal.fire({
            text: "Removed Steward Mapped Successfully!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Close",
            allowOutsideClick: false,
            customClass: {
              confirmButton: "btn btn-danger",
            },
          });
          swalInstance.then((result) => {
            if (result.isConfirmed) {
              actionButton1(false);
            }
          });
        })
    
        .catch((err) => {
        });
    } else {
      // alert("No rows selected for deletion");
      const swalInstance = MySwal.fire({
        text: "No rows selected for deletion!",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Close",
        allowOutsideClick: false,
        customClass: {
          confirmButton: "btn btn-danger",
        },
      });
      swalInstance.then((result) => {
        if (result.isConfirmed) {
        }
      });
    }
  };

  return (
    <div>
      <Modal isOpen={idDetail} toggle={() => setIDDetails(!idDetail)} className='modal-xl'>
        <ModalHeader className='modal-lg' toggle={() => setIDDetails(!idDetail)}>
          Add Table
        </ModalHeader>
        <ModalBody className='pb-3 px-sm-5 mx-20'>
          {/* Add your modal content here */}
        </ModalBody>
      </Modal>

      <div className="ag-theme-alpine" style={{ height: 220 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData} 
          columnDefs={columnDefs}
          animateRows={true} 
          rowSelection='multiple'
          // onCellValueChanged={onCellValueChanged}
          paginationPageSize={10}
          pagination={true}
          defaultColDef={defaultColDef}
          onCellClicked={cellClickedListener}
        />
      </div>
      <br />
      <div align='end' className='buttons'>
        <Button color='primary' className='me-1' type='button' onClick={navigatepage}>
          Exit
        </Button>
        <Button color='danger' className='me-1' type='button' onClick={handleBulkDelete}>
          Remove Selected Rate Codes
        </Button>
      </div>

      <div>
        <Modal isOpen={show1} toggle={() => actionButton1(!show1)} className="modal-sm">
          <ModalHeader toggle={() => actionButton1(!show1)}>Need To Check..</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>         
            <div>
              <b> "Do You Want to Remove Attached Table ?";</b>
              <br />
              <br />
              <div className="d-flex">
                <Button
                  color="primary"
                  className="me-1"
                  onClick={() => handleBulkDelete()}
                >
                  Confirm
                </Button>
                <Button
                  color="danger"
                  className="me-1"
                  onClick={() => actionButton1(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div> 
    </div>
  );
};

export default Floor;
