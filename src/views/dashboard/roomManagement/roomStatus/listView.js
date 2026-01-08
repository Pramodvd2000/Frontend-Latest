// ** React Imports
import { Fragment, useState } from "react";
import axios from "axios";
// ** Third Party Components
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import Moment from 'moment';
import { format } from "date-fns";
import Select from "react-select";
import classnames from "classnames";
// ** Utils
import { selectThemeColors } from "@utils";

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
    Col,
    Modal,
    ModalBody,
    ModalHeader,
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

import { useNavigate } from "react-router-dom";

import { useRef, useEffect, useMemo, useCallback } from 'react';
import API_URL from "../../../../config";

const id = '1';




const defaultValues = {

}

const roomStatus = [

    { value: 'Dirty', label: 'Dirty' },
    { value: 'Inspected', label: 'Inspected' },
    { value: 'Clean', label: 'Clean' }

]


const RoomListView = () => {
    var Today = format(new Date(), "dd-MM-yyyy")
    //console.log(Today)

    // AG Grid
    const [rowData, setRowData] = useState();
    const [outService, setOutService] = useState();
    const [room, setRoom] = useState([]);
    const [roomIDs, setRoomID] = useState()
    const [roomStatusChange, setRoomStatus] = useState()
    const [modaldata, setmodaldata] = useState('')
    const [roomIDStatus, setRoomIDStatus] = useState()




    let navigate = useNavigate();



    const gridRef2 = useRef();

    useEffect(() => {
        fetchx(API_URL + '/room?hotelID=' + id)
            .then(result => result.json())
            .then(outService => {
                setOutService(outService['data'])
                //console.log(outService['data'])
            })
    }, []);


    const [columnDefsOutService, setColumnDefsOutOfService] = useState([

        { headerName: 'Room Number', field: 'roomNumber', checkboxSelection: true, headerCheckboxSelection: true, maxWidth: 150, sort:'asc'},
        { headerName: 'Room Status', field: 'roomStatus', maxWidth: 150 },
        { headerName: 'Front Office Status', field: 'frontOfficeStatus', maxWidth: 150 },
        { headerName: 'Reservation Status', field: 'reservationStatus', maxWidth: 150 },
        { headerName: 'Room Type', field: 'roomType', maxWidth: 150 },
        {
            headerName: 'Floor', field: 'floorID', maxWidth: 150, filter: 'agMultiColumnFilter',

            filterParams: {
                filters: [
                    {
                        filter: 'agTextColumnFilter',
                        display: 'accordion',
                        title: 'Expand Me for Text Filters'
                    },
                    {
                        filter: 'agSetColumnFilter',
                        display: 'accordion'
                    }
                ]
            }
        },


    ]);

    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            // filter: true,
            filterParams: {
                buttons: ['apply', 'reset']
            },
            floatingFilter: true
        }
    ));








    const cellClickedListener = useCallback(event => {
        //console.log('cellClicked', event);
        //console.log(event['data'])
        //console.log(event['rowIndex'])
        //console.log(event['data'])
        if (event['data']['roomStatus'] === 'Out Of Order') {
            let msg = 'Room is already Out of Order release the room first'
            setPopUp(msg)
        }
        else if (event['data']['roomStatus'] === 'Out Of Service') {
            let msg = 'Room is already Out of Service release the room first'
            setPopUp(msg)
        }
        setmodaldata(event['data'])

    }, []);




    // ** State
    const [data, setData] = useState(null);
    const [popUp, setPopUp] = useState();
    const [selectedValue, setSelectedOption] = useState(null);




    // ** Hooks
    const { reset, handleSubmit, control, watch, formState: { errors }
    } = useForm({ defaultValues });




    //// OncheckBox Click
    const onSelectionChanged = (event) => {
        let allRooms = event.api.getSelectedRows()
        //console.log(allRooms)
        //     for(let i=0; i<allRooms.length; i++){
        //     if (allRooms[i]['roomStatus'] === 'Out Of Order') {
        //         let msg = 'Room is already Out of Order release the room first'
        //         setPopUp(msg)
        //     }
        //     else if (allRooms[i]['roomStatus'] === 'Out Of Service') {
        //         let msg = 'Room is already Out of Service release the room first'
        //         setPopUp(msg)
        //     }
        // }
        let roomArr = [];
        let roomIDArr = [];
        let roomIDStatus = [];

        const filterInstance = gridRef2.current.api.getFilterInstance("floorID");
        const filterModel = filterInstance.getModel();
        //console.log(filterInstance);
        if (filterInstance.activeFilterIndices.length != 0) {
            let FloorNo = filterModel['filterModels'][0]['filter'];
            //console.log(FloorNo)


            allRooms.forEach(element => {
                if (FloorNo !== null) {
                    if (FloorNo == element.floorID) {
                        roomArr.push(element.roomNumber)
                        roomIDArr.push(element.id)
                        roomIDStatus.push([element.roomStatus, element.id])
                        // roomIDStatus.push(element.id)

                    }
                }
            });
            //console.log(roomArr)
            //console.log(roomIDArr)
            //console.log(roomIDStatus)

        }
        else {

            allRooms.forEach(element => {

                roomArr.push(element.roomNumber)
                roomIDArr.push(element.id)
                roomIDStatus.push([element.roomStatus, element.id])
                // roomIDStatus.push(element.id)

                //console.log(element.id)

                //console.log(roomArr)
                //console.log(roomIDArr)
            });
        }
        setRoomID(roomIDArr)
        setRoom(roomArr)
        setRoomIDStatus(roomIDStatus)
        if (allRooms.length === 0) {
            setRoomID()
            setRoom()
            setRoomIDStatus()

        }
    }

    //console.log(roomIDStatus)
    //console.log(roomIDs)
    //console.log(room)


    const onSubmit = (data) => {
        setData(data);
        //console.log(data)
        // if(roomIDStatus)
        //console.log(data);
        if (selectedValue === null || selectedValue === undefined || selectedValue === '') {
            let ErrorMessage = "Please Select Room Status"
            setPopUp(ErrorMessage)
          }
          else{
        //console.log(roomIDs)
        let changeRoomStatus = JSON.stringify({
            // "hotelID": data.hotelID,
            "roomStatus": selectedValue,
            "roomID": roomIDs
        });
        //console.log(changeRoomStatus);
        let res = fetchx(API_URL + "/updateMultipleRoomStatus", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: changeRoomStatus,
        }).then(data => data.json())
            .then((res) => {
                //console.log(res);
                if (res.statusCode == 200) {
                    fetchx(API_URL + '/room?hotelID=1')
                        .then(result => result.json())
                        .then(outService => {
                            setOutService(outService['data'])
                            //console.log(outService['data'])
                        })
                    setRoomStatus(false)
                }
                else {
                    //console.log(res.data)
                    setPopUp(res.data)

                }
            });
        }

    };


    const handleDropdownChange = (event) => {
        setSelectedOption(event.value);
    }







    const rowClassRules = {
        // apply green to 2008
        'rag-green-outer': function (params) { return params.data.year === 2008; },

        // apply amber 2004
        'rag-amber-outer': function (params) { return params.data.year === 2004; },

        // apply red to 2000
        'rag-red-outer': function (params) { return params.data.year === 2000; }
    };


    const getRowStyle = params => {
        if (params.data && params.data.roomStatus === 'Dirty') {
            if (params.data && params.data.frontOfficeStatus === 'Occupied') {
                return { background: '#0247FE' };
            } else {
                return { background: '#FF2400' };
            }
        } else  if (params.data && params.data.frontOfficeStatus === 'Occupied') {
            return { background: '#0247FE' };
        }
        else if (params.data && params.data.roomStatus === 'Out Of Order') {
            return { background: '#808080' };
        } else if (params.data && params.data.roomStatus === 'Out Of Service') {
            return { background: 'yellow' };
        } else if (params.data && params.data.roomStatus === 'Out Of Order') {
            return { background: 'lightgrey' };
        } else if (params.data && params.data.roomStatus === 'Clean') {
            return { background: '#0247FE' };
        } else if (params.data && params.data.roomStatus === 'Inspected') {
            return { background: '#00FF00' };
        }
        return null;
    };




    return (
        <div>
            <div>
                <Fragment>
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">List View of Rooms</CardTitle>
                                {roomIDs && (modaldata['roomStatus'] !== 'Out Of Order' && modaldata['roomStatus'] !== 'Out Of Service') && <Button className="d-flex justify-content-end" color="primary" onClick={() => setRoomStatus(true)}>Change Room Status</Button>}

                            </CardHeader>
                        </Card>

                        <div className="ag-theme-alpine" style={{ height: 520 }}>
                            <AgGridReact
                                ref={gridRef2}
                                rowData={outService} columnDefs={columnDefsOutService}
                                animateRows={true}
                                onCellClicked={cellClickedListener}
                                // paginationAutoPageSize = 'true'
                                onGridReady={params => {
                                    params.api.sizeColumnsToFit();
                                }}
                                getRowStyle={getRowStyle}
                                rowSelection='multiple'
                                onSelectionChanged={onSelectionChanged}
                                rowMultiSelectWithClick={true}
                                paginationPageSize='10'
                                pagination='true'
                                defaultColDef={defaultColDef}
                                headerColor="ddw-primary"

                            />
                        </div>
                    </div>



                </Fragment>
            </div>

            <Modal isOpen={roomStatusChange} toggle={() => setRoomStatus(!roomStatusChange)} className='demo-inline-spacing'>

                <ModalHeader className='bg-transparent' toggle={() => setRoomStatus(!roomStatusChange)}></ModalHeader>

                <ModalBody className='pb-3 px-sm-1 mx-20'>
                    <div>
                        {/* {modaldata.length != 0 && */}
                        <>
                            <div>
                                <h2>Room Data  </h2>
                                <br></br>
                                {room && <h5>
                                    Room Number:{" "}
                                    {room.map((num) => (
                                        <b>{num} </b>
                                    ))}
                                </h5>}
                                {/* <h5>Room Type           :   <b>{modaldata['roomType']}  </b></h5>
                                <h5>Room Status         : <b>{modaldata['roomStatus']}</b> </h5>
                                <h5>Front Office Status : <b>{modaldata['frontOfficeStatus']}</b></h5> */}
                            </div>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <br></br>
                                <Col md='6' sm='12' className='mb-1'>
                                    <div className='mb-1'>

                                        <Controller
                                            id='roomStatus'
                                            control={control}
                                            name='roomStatus'
                                            render={({ }) => (
                                                <Select
                                                    required
                                                    isClearable
                                                    options={roomStatus}
                                                    classNamePrefix='select'
                                                    theme={selectThemeColors}
                                                    className={classnames('react-select', { 'is-invalid': data !== null && data.roomStatus === null })}
                                                    onChange={handleDropdownChange}

                                                />
                                            )
                                            }
                                        />
                                    </div>
                                </Col>

                                <Col md='4' sm='12' className='mb-1'>
                                    <div className="d-flex">
                                        <Button className="me-1" color="primary" >
                                            {/* onClick={Alert} */}
                                            Submit
                                        </Button>
                                    </div>
                                </Col>

                                {/* <Modal isOpen={confirmSubmit} toggle={() => setConfirmSubmit(!confirmSubmit)} className='modal-dialog-centered'>
                    <ModalHeader className='bg-transparent' toggle={() => setConfirmSubmit(!confirmSubmit)}></ModalHeader>
                    <ModalBody className='text-center mb-2'>

                    <div className='text-center mb-2'>
                        <h5><b>"Do You Want to Change Room Status from {localStorage.getItem('roomstatus')} to {selectedValue} for Room Number {localStorage.getItem('roomno')} ?"</b></h5>

                        <div className="button-container text-center">
                          <Button className="me-1" color="primary" type='submit' onClick={onSubmit}>
                            Confirm
                          </Button>
                          <Button className="me-1" color="primary" onClick={() => setConfirmSubmit(false)}>
                            Back
                          </Button>

                        </div>

                      </div>
                    </ModalBody>
                  </Modal> */}
                            </Form>
                        </>
                        {/* } */}
                    </div>
                </ModalBody>
            </Modal>
            {popUp &&
                <div className='disabled-animation-modal'>
                    <Modal isOpen={popUp} toggle={() => setPopUp(!popUp)} className='modal-sm'  >   {/*onClosed={onDiscard}*/}
                        <ModalHeader className='modal-sm' toggle={() => {
                            setPopUp(!popUp)
                        }}>Need To Check..</ModalHeader>
                        <ModalBody className='pb-3 px-sm-2 mx-20'>
                            <div>
                                <b>{popUp}</b>
                                <br></br>
                                <br></br>
                                <Button color="primary" className='text-center' onClick={() => setPopUp(false)} >
                                    Ok
                                </Button>
                            </div>
                        </ModalBody>
                    </Modal>

                </div>
            }

        </div>
    );
};

export default RoomListView;
