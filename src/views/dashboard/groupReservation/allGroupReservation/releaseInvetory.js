import { useState, useEffect } from "react";
import "./inventorygrid.css";
import { Input, Form, Label, CardTitle, CardHeader, ModalFooter, InputGroup, InputGroupText, Row, Col, Button } from "reactstrap";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import API_URL from "../../../../config";
import Moment from "moment";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from "react-router-dom"

const MySwal = withReactContent(Swal)

const Block = ({ filldata, closeReleaseInventoryModal }) => {


  const navigate = useNavigate()


  const [inventoryblockmodal, setInventoryblockmodal] = useState(false);
  const [inventoryData, seinventoryData] = useState([])
  const [isUpdated, setIsUpdated] = useState(false);



  const handleSuccess = (message) => {
    return MySwal.fire({
      title: message,
      text: "Inventory release successfull!!",
      icon: 'success',
    })
  }


  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      html: message.replace(/\n/g, '<br />'),
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      allowOutsideClick: false,
      confirmButtonText: 'Close',
      confirmButtonColor: 'danger',
      buttonsStyling: false
    })
  }




  const groupedData = inventoryData.reduce((acc, item) => {
    acc[item.inventory_date] = acc[item.inventory_date] || [];
    acc[item.inventory_date].push(item);
    return acc;
  }, {});

  const inventoryDates = Object.keys(groupedData);

  // Get all unique room types across all inventory data
  const roomTypes = [...new Set(inventoryData.map((item) => item.roomType))];

  useEffect(() => {

    fetch(API_URL + '/getreleaseGroupRoomInventory', {
      method: 'POST',
      body: JSON.stringify({
        "groupID": filldata.id,

      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((post) => {
        if (post['statusCode'] == 200) {
          const filteredData = post.data.filter(
            (item) => !((item.requiredRooms === 0 || item.requiredRooms === null) && item.pendingRooms === 0 && item.bookedRooms === 0)
        );
        
          const sortedData = filteredData.sort((a, b) => new Date(a.inventory_date) - new Date(b.inventory_date));


          console.log(post.data)
          setInventoryblockmodal(true)
          seinventoryData(sortedData)
        }

      })
      .catch((err) => {
        console.error(err);
      });

  }, []);




  function handleRelease(){
    setIsUpdated(true)

    fetchx(API_URL + "/releaseGroupRoomInventory", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "groupID": filldata.id })
  }).then(result => result.json())
      .then(rowData => {
        if(rowData.statusCode === 200){
    setIsUpdated(false)

          navigate('')
          handleSuccess("Inventory has been successfully released!")
        }
        else{
    setIsUpdated(false)

          handleError("Failed to release inventory. Please try again later.")
        }
      })
  }
  const createColumnDefs = () => {
    const dateColumns = inventoryDates.flatMap((date) => [
      {
        headerName: Moment(date).format('DD-MM-YYYY'),
        headerClass: 'centered-date-header', // Specific class for date headers
        headerComponentParams: {
          template: `<div class="centered-date-header">${date}</div>`, // Inline centering
        },
        headerStyle: {
          border: '1px solid #black',
          backgroundColor: '#f5f5f5',
        },
        children: [
          {
            headerName: 'Booked',
            field: `${date}_booked`,
            cellClass: 'booked-highlight',
            headerClass: 'center-header',
            width: '120px'
          },
          {
            headerName: 'Picked',
            field: `${date}_allotted`,
            cellClass: 'required-highlight',
            headerClass: 'center-header',
            width: '120px'
          },
          {
            headerName: 'Pending',
            field: `${date}_pending`,
            cellClass: 'pending-highlight',
            headerClass: 'center-header',
            width: '120px',
            cellStyle: {
              textAlign: 'center',
              borderRight: '2px solid #ccc'
            },
            headerStyle: {
              textAlign: 'center',
              borderRight: '2px solid #ccc'
            }

          },

        ],
      },
    ]);

    return [
      {
        headerName: 'Type/Date',
        field: 'roomType',
        pinned: 'left',
        cellClass: 'fixed-roomtype',
        suppressMovable: true // Prevent column reordering
      },
      ...dateColumns,
    ];
  };



  const createRowData = () => {
    const rows = roomTypes.map((roomType) => {
      const row = { roomType };
      inventoryDates.forEach((date) => {
        const currentData = groupedData[date].find((d) => d.roomType === roomType) || {
          bookedRooms: '0',
          requiredRooms: '0',
          pendingRooms: '0',
        };

        // row[`${date}_booked`] = currentData.bookedRooms;
        // row[`${date}_allotted`] = currentData.requiredRooms;
        // row[`${date}_pending`] = currentData.pendingRooms;

        row[`${date}_booked`] = currentData.requiredRooms;
        row[`${date}_allotted`] = currentData.bookedRooms;
        row[`${date}_pending`] = currentData.pendingRooms;
      });
      return row;
    });

    const totalRow = { roomType: 'TOTAL' };
    inventoryDates.forEach((date) => {
      const totals = groupedData[date].reduce(
        (acc, item) => {
          // acc.booked += parseInt(item.bookedRooms, 10) || 0;
          // acc.required += parseInt(item.requiredRooms, 10) || 0;
          // acc.pending += parseInt(item.pendingRooms, 10) || 0;
          acc.booked += parseInt(item.requiredRooms, 10) || 0;
          acc.required += parseInt(item.bookedRooms, 10) || 0;
          acc.pending += parseInt(item.pendingRooms, 10) || 0;
          return acc;
        },
        { booked: 0, required: 0, pending: 0 }
      );

      totalRow[`${date}_booked`] = totals.booked;
      totalRow[`${date}_allotted`] = totals.required;
      totalRow[`${date}_pending`] = totals.pending;
    });

    return [...rows, totalRow];
  };


  return (
    <>



      <br></br>
    

      <div className="release-pending-inventory">
        {/* <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Release Pending Inventory</h2>
        <p style={{ fontSize: '12px' }}>Wash out the pending room inventory</p> */}
        {inventoryData &&
          <div className="ag-theme-alpine" style={{ height: 400, width: '100%', overflowX: 'auto' }}>
            <AgGridReact
              columnDefs={createColumnDefs()}
              rowData={createRowData()}
              defaultColDef={{
                resizable: true,
                sortable: true,
                cellClass: 'bordered-date-group',
              }}
              enableRangeSelection={true}
              suppressHorizontalScroll={false}
              domLayout="autoHeight"
              headerHeight={50}
              rowHeight={30}
              rowClassRules={{
                'total-row': (params) => params.data.roomType === 'TOTAL',
              }}
              suppressColumnVirtualisation={true}
              suppressScrollOnNewData={true}
              suppressScrollBar={false}
              enableBrowserTooltips={true}
            />
          </div>
        }
        {/* <div className="d-flex justify-content-end">
          <button className="release-button">Release Inventory</button>
        </div> */}
        {/* <Button outline className='me-1' color='secondary' onClick={() => close()}> Close</Button> */}
        <div style={{ marginTop: '10px' }} align='end'>

        <Button color='primary' className='me-1' onClick={handleRelease} disabled={isUpdated}>Release Inventory</Button>
        <Button outline className='me-1' color='secondary' onClick={() => closeReleaseInventoryModal()}> Close</Button>
        </div>
      </div>

    </>
  );
};

export default Block;
