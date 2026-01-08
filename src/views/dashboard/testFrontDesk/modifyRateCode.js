// ** Third Party Components
import {useState, useRef,Fragment,useEffect,useMemo, useCallback,} from "react";
import Select from "react-select";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { Input,Card,Form, Row,Col, Label,Button, CardBody, Modal,ModalHeader,ModalBody, ModalFooter} from "reactstrap";
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import "./button.scss";


const defaultValues = {
  rateCode1: null,
};

const RateCodeSelection = () => {
    const [basicModal, setBasicModal] = useState(false)

  // AG Grid
  const [rowData, setRowData] = useState();

  const gridRef = useRef();

  const [selectedOption, setSelectedOption] = useState("");

  //   const [show, actionButton] = useState(false);
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Rate Code",
      field: "rateCode",
      suppressSizeToFit: true,
      maxWidth: 140,
    },
    {
      headerName: "Description",
      field: "description",
      suppressSizeToFit: true,
      maxWidth: 140,
    },
    {
      headerName: "Begin Date",
      field: "beginSellDate",
      suppressSizeToFit: true,
      maxWidth: 140,
    },
    {
      headerName: "SellDate",
      field: "endSellDate",
      suppressSizeToFit: true,
      maxWidth: 140,
    },
    { headerName: "Days Applicable", field: "daysApplicable", maxWidth: 250 },
    //   { headerName: 'PrintRate', field: 'printRate', maxWidth: 140  },
    // {
    //   headerName: "Action",
    //   field: "numAvlRooms",
    //   suppressSizeToFit: true,
    //   maxWidth: 180,
    //   cellRendererFramework: (params) => (
    //     <Button color="primary"> Select </Button>
    //   ),
    // },
    {
        headerName: "Action",
        maxWidth: 140,
        cellRendererFramework: () => {
          return (<Button color='primary' onClick={onDiscard}>Select</Button>)
        }
      },
  ]);

  const defaultColDef = useMemo(() => ({
    suppressSizeToFit: true,
    autoHeight: true,
    resizable: true,
    // editable: true,
    sortable: true,
    filter: true,
    singleClickEdit: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));

  //Modal close function
  const onDiscard = () => {
    setBasicModal(false)
  }

  const cellClickedListener = useCallback((event) => {
    //console.log("cellClicked", event);
    //console.log(event["data"]);
    // //console.log(event['rowIndex'])
    localStorage.setItem("id", event["data"]["id"]);
    //console.log(event["data"]["id"]);
  }, []);

  useEffect(() => {
    fetchx(API_URL + "/RateCode?hotelID=1")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData["data"]));
    // //console.log(rowData)
  }, []);

  return (
    <div>
      <div className="ag-theme-alpine" style={{ height: 400 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection="multiple"
          onCellClicked={cellClickedListener}
          // paginationAutoPageSize = 'true'
          paginationPageSize="10"
          pagination="true"
          singleClickEdit="true"
          defaultColDef={defaultColDef}
          headerColor="ddw-primary"
        />
      </div>
    </div>
  );
};

const RateCodeModification = (data1) => {
  const [basicModal, setBasicModal] = useState(false);
  const [UpdatedRate, setUpdatedRate] = useState(false);
  const [data, setData] = useState(null);
  const gridRef = useRef();
  const [filldata, setfilldata] = useState(false)
  const [source, setsource] = useState('')


  const { reset, handleSubmit, control } = useForm({ defaultValues });
  const [details, setDetails] = useState("");

  //AG Grid
  const cellClickedListener = useCallback(event => {
    //console.log(event['data'])
    setfilldata(event['data']['accountName'])
  })

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "Date", field: "inventory_date", maxWidth: 128 },
    { headerName: "Base Price", field: "baseprice", maxWidth: 125 },
    {
      headerName: "RoomType",
      field: "roomType",
      suppressSizeToFit: true,
      maxWidth: 125,
    },
    {
      headerName: "Total Price",
      field: "total",
      suppressSizeToFit: true,
      maxWidth: 125,
    },
    {
      headerName: "Package",
      field: "packageCode",
      suppressSizeToFit: true,
      maxWidth: 125,
    },
    {
      headerName: "Children Price",
      field: "childrenprice",
      suppressSizeToFit: true,
      maxWidth: 140,
    },
  ]);

  const onSubmit = (data) => {
    setData(data);
    if (data.packageName !== null) {
      let createmarketGroup = JSON.stringify({
        tempReservationID: data1.data1.data1.tempReservationID,
        // "newRoomTypeID": data.roomType.value
      });
      //console.log(createmarketGroup);
      fetchx(API_URL + "/getRoomTypeModifiedRates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: createmarketGroup,
      })
        .then((data) => data.json())
        .then((res) => {
          setUpdatedRate(res["data"]);
        });
    }
  };

  const handleClick = () => {
    let res = fetchx(API_URL + "/getRoomTypeModifiedRates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // newRoomTypeID: data.roomType.value,
        tempReservationID: data1.data1.data1.tempReservationID,
        newRoomTypeID: data.roomType.value,
        reservationID: 2,
        oldRoomTypeID: 1,
        quantity: 2,
        checkBox: 1,
        rateData: 1,
      }),
    })
      .then((data) => data.json())
      .then((res) => {
        //console.log(res["data"]);
        //console.log(res["data"][0]["RoomTypeWiseDetails"]);
        setUpdatedRate(res["data"]);
      });
  };


  //Modal close function
  const onDiscard = () => {
    setBasicModal(false)
  }

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col>
            <br></br>
            <Label className="form-check-label">
              Select RateCode
              <Input
                type="text"
                name="companynam"
                value={data1.data1.data1.rateCode}
                onClick={() => setBasicModal(!basicModal)}
              />
            </Label>
          </Col>
          <Row>
            <Col>
            <br></br>
            {
                filldata && <Label className='form-check-label'>
                Company
                <Input type="text" name='companynam' value={filldata} onClick={() => setBasicModal(!basicModal)}/>
                </Label>
            }
            </Col>
          </Row>


          {/*  Button to Get Rates */}
          <Row>
            <div align="end" className="buttons">
              <Button color="primary" className="me-1" type="submit">
                Get Rates
              </Button>
            </div>
          </Row>

            {/*  Modal to Select Rate Code */}

          <div>
            <Modal isOpen={basicModal}toggle={() => setBasicModal(!basicModal)} className="modal-xl" onClosed={onDiscard}            >
              <ModalHeader toggle={() => setBasicModal(!basicModal)}>
                RateCode Selection
              </ModalHeader>
              <ModalBody>
                <RateCodeSelection />
              </ModalBody>
            </Modal>
          </div>


            {/* Ag-grid for rates display */}
            {UpdatedRate !== false &&
              <div className="ag-theme-alpine" style={{ height: 220 }}>
                  <AgGridReact
                    ref={gridRef}
                    rowData={UpdatedRate}
                    columnDefs={columnDefs}
                    animateRows={true}
                    rowSelection='multiple'
                    onCellClicked={cellClickedListener}
                    paginationPageSize='10'
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"
                  />
                <br />
                <br />
                

                <div align='end' className='buttons'>
                <Button color='primary' className='me-1'>
                  Submit
                </Button>
              </div>
              </div>
            }
       
        </Row>
        <br></br>
      </Form>
    </div>
  );
};

export default RateCodeModification;
