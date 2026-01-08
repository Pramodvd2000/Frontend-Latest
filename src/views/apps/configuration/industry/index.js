// ** React Imports
import { useState } from "react";
import axios from "axios";
// ** Third Party Components
import Select from "react-select";
import toast from "react-hot-toast";
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Check } from "react-feather";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
// import App from "./roomTypeDataTable";
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

// ** Custom Components
import Avatar from "@components/avatar";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Modal, ModalHeader, ModalBody } from 'reactstrap'
// ** Utils
import { selectThemeColors } from "@utils";
import API_URL from "../../../../config";
// ** Reactstrap Imports
import {
    Input,
    Card,
    Form,
    Label,
    Button,
    CardBody,
    CardTitle,
    CardHeader,
    InputGroup,
    InputGroupText,
    Row,
    Col
} from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";

// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import EditIndustry from './editIndustry';

const MySwal = withReactContent(Swal)




const defaultValues = {
    // hotelID: "",
    industry: "",

}


let roomClassID = [
    fetchx(API_URL + '/getroomtyperoomclassid?hotelID=1')
        .then(result => result.json())
        .then(resp => {
            // console.log(resp['data'])
            roomClassID = resp['data']
            // console.log(roomClassID)
        })
]



const RoomType = () => {
    const [open, setOpen] = useState('')
    const [popUp, setPopUp] = useState(false);
    const [filldata, setfilldata] = useState({});

    const [showEdit, editButton] = useState(false);

    const lookupValue = (mappings, key) => {
        return mappings[key]
    }

    const colourMappings = {
        1: 'Active',
        0: 'Inactive',
    }
    const extractKeys = (mappings) => {
        return Object.keys(mappings)
    }
    const colourCodes = extractKeys(colourMappings)

    const toggle = id => {
        open === id ? setOpen() : setOpen(id)
    }
    // AG Grid
    const [rowData, setRowData] = useState();

    const gridRef = useRef();


    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Industry', field: 'industry', cellStyle: { 'text-align': 'center', 'background-color': '#F1E39B' }, headerClass: "text-center", maxWidth: 130 },
        { headerName: 'Created By', field: 'createdByName', cellStyle: { 'text-align': 'center', 'background-color': 'pink' }, headerClass: "text-center", maxWidth: 180 },
        {
  headerName: 'Status',
  field: 'isActive',
  maxWidth: 180,
  headerClass: "text-center",
  cellStyle: { textAlign: 'center', backgroundColor: '#F1E39B' },
  valueFormatter: (params) => params.value === 0 ? 'In Active' : 'Active'
},
        { headerName: 'Created At', field: 'createdAt', cellStyle: { 'text-align': 'center', 'background-color': 'pink' }, headerClass: "text-center", maxWidth: 180 },
        
        {
            headerName: "Action", field: "numAvlRooms", suppressSizeToFit: true, maxWidth: 120,
            cellRendererFramework: (params) => (
                <Button color="primary" onClick={() => {setfilldata(params.data), editButton(true)}}> Edit  </Button>),
        },
    ]);
    const [newActiveStatus, setNewActiveStatus] = useState(null);
    const [roomClass, setRoomClassID] = useState(null);

    const onCellValueChanged = useCallback(event => {
        // console.log('onCellValueChanged', event)
        // console.log('data after changes is: ', event.data);
        //  console.log(event)
        let isActive = Number(event.data.isActive);
        //  console.log(isActive)
        //  console.log(event.data.isActive)

        let OldValue = oldValue
        //  console.log(oldValue)
        //  console.log(OldValue)

        let ID = event.data['id']
        const IDNumber = event.data.id;
        setRoomClassID(IDNumber);
        //  console.log(ID)
        //  console.log(event.data.id)


        let newActive = event.data.isActive;
        // console.log(newActive)
        //  const oldRoomType = event.oldValue.split("(")[0];
        //   setPrice(newRoomType)
        //   setBasePriceID(ID)


        if (event.data.isActive !== oldValue) {
            const newActiveStatus = event.data.isActive;
            setNewActiveStatus(newActiveStatus);
            const oldActiveStatus = oldValue;
            // setFullData(RoomType,oldRoomType,newRoomType,event.data.date)
            setPopUp('Do You  Want to make room Type Status Change ?');

        }

        const updatedItem = JSON.stringify({
            isActive: event.newValue.split("(")[0]
        })
        //  console.log(updatedItem)
        fetchx(API_URL + `/updateRoomType?id=${event.data.id}`, {
            method: 'PUT',
            body: updatedItem,
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((post) => {
                // const swalInstance = MySwal.fire({
                //   text: 'Updated Active Status Successfully!',
                //   icon: 'success',
                //   buttonsStyling: false,
                //   confirmButtonText: 'Close',
                //   customClass: {
                //     confirmButton: 'btn btn-danger'
                //   }
                // });
                // swalInstance.then((result) => {
                //   if (result.isConfirmed) {
                // navigate('');
                //   }
                // }); 
                //  console.log(post)
            })
            .catch((err) => {
                //  console.log(err.message)
            })
    }, [])

    // console.log(newActiveStatus)
    // console.log(roomClass)

    // const gridApi = useRef();

    function Confirm(event) {
        const updatedItem = JSON.stringify({
            isActive: newActiveStatus,
            id: roomClass
        })
        // console.log(updatedItem)
        fetchx(API_URL + `/updateRoomType`, {
            method: 'PUT',
            body: updatedItem,
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((post) => {
                const swalInstance = MySwal.fire({
                    text: 'Updated Active Status Successfully!',
                    icon: 'success',
                    buttonsStyling: false,
                    confirmButtonText: 'Close',
                    allowOutsideClick: false,
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    }
                });
                swalInstance.then((result) => {
                    if (result.isConfirmed) {
                        navigate('');
                    }
                });
                // console.log(post)
                if (post.statusCode === 200) {
                    setPopUp(false)
                    fetchx(API_URL + '/getroomclass?hotelID=1')
                        .then(result => result.json())
                        .then(rowData => {
                            // console.log(rowData['data'])     
                        }
                        )
                }
            })
            .catch((err) => {
                // console.log(err.message)
            })
    }


    const [oldValue, setOldValue] = useState(null);

    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ));

    const cellClickedListener = useCallback(event => {
        // console.log('cellClicked', event.data);
        // console.log('cellClicked', event.data.isActive);

        const currentValue = event.data.isActive;
        // console.log(currentValue);

        setOldValue(currentValue); // Update the state variable
    }, []);
    console.log("oldValue", oldValue)


    useEffect(() => {
        fetchx(API_URL + '/getIndustriesByHotel')
            .then(result => result.json())
            .then(rowData => {
                setRowData(rowData['data'])
                // console.log(rowData['data'])
            })
    }, []);

    // ** State
    const [data, setData] = useState(null);
    const [value, setValue] = useState('')


    // ** Hooks
    const { reset, handleSubmit, control, formState: { errors }
    } = useForm({ defaultValues });
    let navigate = useNavigate();
    const onSubmit = (data) => {
        setData(data);
        // console.log(data)
        if (
            // data.hotelID !== null &&
            data.industry !== null
        ) {
            // console.log(data);
            let createasset = JSON.stringify({
                // "hotelID": data.hotelID,
                "industry": data.industry,


            });
            // console.log(createasset);
            let res = fetchx(API_URL + "/addIndustry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: createasset,
            }).then(data => data.json())
                .then((res) => {
                    // console.log(res);
                    if (res['statusCode'] == 200) {
                        fetchx(API_URL + '/getIndustriesByHotel')
                            .then(result => result.json())
                            .then(rowData => {
                                setRowData(rowData['data'])
                                // console.log(rowData['data'])
                                const swalInstance = MySwal.fire({
                                    text: 'Industry Added Successfully!',
                                    icon: 'success',
                                    buttonsStyling: false,
                                    confirmButtonText: 'Close',
                                    allowOutsideClick: false,
                                    customClass: {
                                        confirmButton: 'btn btn-danger'
                                    }
                                });
                                swalInstance.then((result) => {
                                    if (result.isConfirmed) {
                                        navigate('');
                                    }
                                });
                            })
                    }
                    // else {
                    //     const swalInstance = MySwal.fire({
                    //         text: res.message,
                    //         icon: 'error',
                    //         buttonsStyling: false,
                    //         confirmButtonText: 'Close',
                    //         allowOutsideClick: false,
                    //         customClass: {
                    //             confirmButton: 'btn btn-danger'
                    //         }
                    //     });
                    //     swalInstance.then((result) => {
                    //         if (result.isConfirmed) {
                    //             navigate('');
                    //         }
                    //     });
                    // }
                    else {
                        const errorMessage = res.message && res.message.includes("Duplicate entry")
                            ? "Duplicate entry"
                            : res.message;

                        const swalInstance = MySwal.fire({
                            text: errorMessage,
                            icon: 'error',
                            buttonsStyling: false,
                            confirmButtonText: 'Close',
                            allowOutsideClick: false,
                            customClass: {
                                confirmButton: 'btn btn-danger'
                            }
                        });

                        swalInstance.then((result) => {
                            if (result.isConfirmed) {
                                navigate('');
                            }
                        });
                    }


                });
            // toast(
            //   <div className="d-flex">
            //     <div className="me-1">
            //       <Avatar size="sm" color="success" icon={<Check size={12} />} />
            //     </div>
            //     <div className="d-flex flex-column">
            //       <h6>Form Submitted!</h6>
            //      <h4>Room Type Submitted Successfull</h4>
            //     </div>
            //   </div>
            // );
        }
    };


    const handleChange = event => {
        setValue(event.target.value)
    }

    const handleReset = () => {
        reset({
            // hotelID: "",
            industry: "",

        });
    };
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById("filter-text-box").value
        );
    }, []);
    return (
        <div>
            <div className="disabled-animation-modal">
                <Modal
                    isOpen={popUp}
                    toggle={() => setPopUp(!popUp)}
                    className="modal-sm"
                >
                    {" "}
                    {/*onClosed={onDiscard}*/}
                    <ModalHeader
                        className="modal-sm"
                        toggle={() => {
                            setPopUp(!popUp);
                        }}
                    >
                        Need To Check..
                    </ModalHeader>
                    <ModalBody className="pb-3 px-sm-2 mx-20">
                        <div>
                            <b>{popUp}</b>
                            <br></br>
                            <br></br>
                            <div className="d-flex">
                                <Button
                                    color="primary"
                                    className="me-1"
                                    // className="text-center"
                                    onClick={() => Confirm()}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    color="danger"
                                    className="me-1"
                                    // className="text-center"
                                    onClick={() => {
                                        setPopUp(false), navigate('');
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>

            <div>
                <Card>
                    <Accordion open={open} toggle={toggle}>
                        <AccordionItem>
                            <AccordionHeader targetId='1'><h4><b> Add Industry</b></h4></AccordionHeader>
                            <AccordionBody accordionId='1'>
                                <Card>
                                    <CardHeader>
                                        <CardTitle tag="h4">Industry</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                            <Row>
                                                <Col md='4' sm='12'>
                                                    <div >
                                                        <Label className="form-label" for="industry">
                                                            Industry <spam style={{ color: 'red' }}>*</spam>
                                                        </Label>
                                                        <InputGroup className="input-group-merge">
                                                            <Controller
                                                                id='industry'
                                                                name='industry'
                                                                control={control}
                                                                placeholder='industry'
                                                                render={({ field }) => <Input placeholder="Type Industry"
                                                                    //  pattern="[a-zA-Z]*" title="Type Only Alphabets" 
                                                                    required
                                                                    className={classnames({
                                                                        "is-invalid": data !== null && (data.industry === null || !data.industry.length)
                                                                    })} {...field} />}


                                                            />
                                                        </InputGroup>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <br></br>
                                            <Row>
                                                <Col md='6' sm='12' className='mb-1'>
                                                    <div className="d-flex">
                                                        <Button className="me-1" color="primary" type="submit">
                                                            Submit
                                                        </Button>
                                                        <Button
                                                            outline
                                                            color="secondary"
                                                            type="reset"
                                                            onClick={handleReset}
                                                        >
                                                            Reset
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </AccordionBody>
                        </AccordionItem>
                    </Accordion>
                </Card>
            </div>
            <div>
                <Col md="3" sm="12" className="mb-1">
                    <Label className="form-label" for="fullName">
                        Search
                    </Label>
                    <Input
                        type="text"
                        id="filter-text-box"
                        placeholder="Filter..."
                        onInput={onFilterTextBoxChanged}
                    />
                </Col>
            </div>
            <div className="ag-theme-alpine" style={{ height: 540 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData} columnDefs={columnDefs}
                    animateRows={true} rowSelection='multiple'
                    onCellClicked={cellClickedListener}
                    onCellValueChanged={onCellValueChanged}

                    // paginationAutoPageSize = 'true'
                    paginationPageSize='10'
                    pagination='true'
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"

                />
            </div>



            <Card>
                <div className="vertically-centered-modal">
                    <Modal
                        isOpen={showEdit}
                        toggle={() => editButton(!showEdit)}
                        // className="modal-lg"
                        className="modal-sm"

                    >
                        <ModalHeader toggle={() => editButton(!showEdit)}>
                            {/* Welcome... */}
                        </ModalHeader>
                        <ModalBody>
                            <Card>
                                <EditIndustry data1={filldata} />

                            </Card>
                        </ModalBody>

                    </Modal>
                </div>
            </Card>


            {/* <App/> */}
        </div>
    );
};

export default RoomType;
