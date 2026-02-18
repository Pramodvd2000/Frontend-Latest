
// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { format } from "date-fns";
import { Card, CardHeader, CardText, CardTitle, Label, Col, Input, Row, Button, Accordion, AccordionBody, AccordionHeader, AccordionItem, CardBody, Form, InputGroup, Modal, ModalBody, ModalHeader } from 'reactstrap';
import API_URL from '../../../config';
import { useForm, Controller } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import Moment from 'moment';
import Select from "react-select";
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

import classnames from "classnames";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
// import {
//     Input, Card, Form, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, Modal, ModalBody, ModalHeader, InputGroupText, Row, Col,
//     Accordion, AccordionBody, AccordionHeader, AccordionItem
// } from "reactstrap";
import { selectThemeColors } from "@utils";
import { useNavigate } from 'react-router-dom';



let roomTypeID = [
    fetchx(API_URL + '/getRoomInventoryRoomTypeID?hotelID=1')
        .then(result => result.json())
        .then(resp => {
            // console.log(resp['data'])
            roomTypeID = resp['data']
            console.log(roomTypeID)
        })
]


const SubMatrix = (props) => {

    const [rowData, setRowData] = useState();
    const [data, setData] = useState(null);
    const [open, setOpen] = useState('')
    const [openModal, setOpenModal] = useState();
    const [selectedRow, setSelectedRow] = useState(null);

    let navigate = useNavigate();
    // ** Hooks
    const { reset, handleSubmit, control, watch, formState: { errors }
    } = useForm({});

    // INSERT (Accordion)
    const {
        handleSubmit: handleInsertSubmit,
        control: insertControl,
        reset: resetInsert
    } = useForm();


    const gridRef = useRef();


    // error handling for same guest addition
    const handleError = (message) => {
        return MySwal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            customClass: {
                confirmButton: 'btn btn-danger',

            },
            allowOutsideClick: false,
            confirmButtonText: 'Close',
            confirmButtonColor: 'danger',
            buttonsStyling: false
        })
    }


    const handleSuccess = () => {
        return MySwal.fire({
            title: 'Room Details Updated',
            text: 'Room Details Updated Successfully !!',
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        })
    }



    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            wrapText: true,
            autoHeight: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ));

    const normalizeToString = (value) => {
        if (!value) return "";
        if (Array.isArray(value)) return value.join(",");
        return String(value);
    };


    const toBullets = (value) => {
        const str = normalizeToString(value);

        return str
            .split(",")
            .map(v => v.trim())
            .filter(Boolean)
            .map(v => `• ${v}`)
            .join("\n");
    };

    const cellClickedListener = useCallback((params) => {
        if (!params.data) return;
        console.log("Clicked Row Data:", params.data);
        setSelectedRow(params.data);

        reset({
            roomTypeID: {
                label: params.data.roomType,
                value: params.data.roomTypeID
            },
            // roomTypeName: params.data.roomTypeName,
            // description: params.data.description,
            // roomDetails: params.data.roomDetails // ✅ FIX HERE
            roomDetails: toBullets(params.data.roomDetails) // ✅ bullets


        });

        setOpenModal(true);
    }, []);


    const fetchData = () => {
        let confirmRate = JSON.stringify({
        })
        console.log(confirmRate)
        fetchx(API_URL + "/getWebRoomDetailsDetails", {
            // fetchx("http://122.166.2.21:14702/getOccupancyRoomWise", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: confirmRate
        }).then(result => result.json())
            .then(res => {
                // var rowData = res.data;
                const mappedData = res.data.map(item => ({
                    ...item,
                    roomDetails: item.roomDetailsName.map(a => a.roomDetails) // only array of strings for grid
                }));
                console.log("Mapped Data:", mappedData);
                setRowData(mappedData);
                // setRowData(res['data'])

            }, []);

        // })
    }

    useEffect(() => {
        fetchData()
    }, []);



    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Room Type', field: 'roomType', maxWidth: 130, cellStyle: { textAlign: 'center' } },

        // { headerName: 'roomDetails', field: 'roomDetails', maxWidth: 180 },

        {
            headerName: 'Room Details',
            field: 'roomDetails',
            autoHeight: true,
            cellRendererFramework: (params) => {
                const details = params.value || [];
                return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {details.map((item, index) => (
                            <span key={index} style={{ lineHeight: '18px' }}>
                                • {item}
                            </span>
                        ))}
                    </div>
                );
            },
            width: 400,
        },
        {
            headerName: "Actions",
            cellRendererFramework: (params) => (
                <Button
                    color="primary"
                    style={{ width: 100 }}
                    onClick={() => {
                        setOpenModal(!openModal)
                    }}
                >
                    Edit
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center',
            maxWidth: 140
        },

    ]);


    const toggle = id => {
        open === id ? setOpen() : setOpen(id)
    }


    const cleanRoomDetails = (value) =>
        (value || '') // if value is undefined or null, use empty string
            .split('\n')
            .map(line => line.replace(/^•\s*/, '').trim())
            .filter(Boolean);


    const onSubmit = (formData) => {
        // setData(data);
        console.log(formData)
        const roomDetailsArray = cleanRoomDetails(formData.roomDetails);
        console.log(roomDetailsArray);
        if (
            // data.hotelID !== null &&

            formData.roomTypeID !== null &&
            formData.roomDetails !== null
        ) {

            let createasset = JSON.stringify({
                // "hotelID": data.hotelID,

                "roomTypeID": formData.roomTypeID.value,
                "roomDetails": roomDetailsArray,
            });
            console.log(createasset);
            let res = fetchx(API_URL + "/addWebRoomDetails", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: createasset,
            }).then(result => result.json())
                .then((res) => {
                    console.log(res);
                    if (res['statusCode'] === 200) {

                        handleSuccess("Updated Successfully")
                        navigate('');

                    }
                    else {
                        handleError(res.message)
                    }
                });


        }
    };




    const handleFinalUpload = useCallback(async () => {
        console.log("Child final upload called");

        // Use refs to get current values
        const currentVisaFiles = visaFilesRef.current;
        const currentIdFiles = idFilesRef.current;
        const currentVisaImages = visaImagesRef.current;
        const currentIdImages = idImagesRef.current;

        console.log("Current files:", {
            visaFiles: currentVisaFiles,
            idFiles: currentIdFiles,
            visaImages: currentVisaImages,
            idImages: currentIdImages
        });

        const hasNewVisa = currentVisaFiles.length > 0;
        const hasNewID = currentIdFiles.length > 0;
        const hasExistingDocs = currentVisaImages.length > 0 || currentIdImages.length > 0;

        console.log("hasNewVisa:", hasNewVisa, "hasNewID:", hasNewID, "hasExistingDocs:", hasExistingDocs);

        if (!hasNewVisa && !hasNewID && !hasExistingDocs) {
            handleError('Please upload at least one document before proceedingss.');
            return;
        }

        // Upload new files
        for (const f of currentVisaFiles) await uploadFile(f, 2, 12);
        for (const f of currentIdFiles) await uploadFile(f, 4, 13);

        // await fetchImageUrls();

        // if (onUpload) {
        //   onUpload(true, { visaDocs: currentVisaImages, idDocs: currentIdImages });
        // }

        // refresh()
        // onBack();
    }, []); // ✅ Empty deps because function uses refs, not state


    const updateData = () => {
        if (!selectedRow) return;
        console;
        const roomDetailsValue = watch('roomDetails') || '';

        const currentDetails = roomDetailsValue
            .split('\n')
            .map(line => line.replace(/^•\s*/, '').trim())
            .filter(Boolean);

        const existingDetails = selectedRow.roomDetailsName || [];
        console.log("existingDetails:", existingDetails);
        const usedIds = new Set();
        const updatedDetails = [];
        console.log("Current Details:", currentDetails);
        // ---- PHASE 1: Match by exact text (SAFE) ----
        currentDetails.forEach(text => {
            const match = existingDetails.find(
                a => a.roomDetails === text && !usedIds.has(a.id)
            );

            console.log("Matching Detail:", text, "Found Match:", match);
            if (match) {
                usedIds.add(match.id);
                updatedDetails.push({ id: match.id, roomDetails: text });
            } else {
                updatedDetails.push({ roomDetails: text }); // temporary
            }
        });
        console.log("After Phase 1 - Updated Details:", updatedDetails);

        // ---- PHASE 2: Assign remaining IDs to edited items ----
        const remainingExisting = existingDetails.filter(a => !usedIds.has(a.id));
        let remainingIndex = 0;

        for (let i = 0; i < updatedDetails.length; i++) {
            if (!updatedDetails[i].id && remainingExisting[remainingIndex]) {
                updatedDetails[i] = {
                    id: remainingExisting[remainingIndex].id,
                    roomDetails: updatedDetails[i].roomDetails
                };
                usedIds.add(remainingExisting[remainingIndex].id);
                remainingIndex++;
            }
        }

        // ---- DELETED IDs: ONLY truly removed ones ----
        const deletedIds = existingDetails
            .filter(a => !usedIds.has(a.id))
            .map(a => a.id);

        console.log("Updated Details:", updatedDetails);
        console.log("Deleted IDs:", deletedIds);

        const updatePayload = JSON.stringify({
            roomTypeID: watch('roomTypeID')?.value || null,
            roomDetails: updatedDetails,
            deletedIds: deletedIds
        });

        fetchx(API_URL + "/updateWebroomDetailsDetails", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: updatePayload
        })
            .then(res => res.json())
            .then(res => {
                if (res.statusCode === 200) {
                    fetchData();
                    setOpenModal(false);
                    handleSuccess("Updated Successfully");
                } else {
                    handleError(res.message);
                }
            });
    };






    return (
        <div>
            <Accordion open={open} toggle={toggle}>
                <AccordionItem>
                    {/* <AccordionHeader targetId='1'><h4><b>Room Type Wise</b></h4> <Button color="primary" style={{ width: 100 }}
                    // onClick={async () => {

                    // }}
                    >
                        Edit
                    </Button></AccordionHeader> */}

                    <AccordionHeader targetId="1">
                        <h4 className="mb-0 me-2">
                            <b>Room Details</b>
                        </h4>
                        <Button color="primary" style={{ width: 160 }}>
                            Add New
                        </Button>
                    </AccordionHeader>


                    <AccordionBody accordionId='1'>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Room Details</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleInsertSubmit(onSubmit)}>
                                    <Row>

                                        <Col md='4' sm='12' className='mb-1'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='roomTypeID'>
                                                    Room Type ID
                                                </Label>
                                                <Controller
                                                    id='roomTypeID'
                                                    control={insertControl}
                                                    name='roomTypeID'
                                                    render={({ field }) => (
                                                        <Select
                                                            required
                                                            isClearable
                                                            options={roomTypeID}
                                                            classNamePrefix='select'
                                                            theme={selectThemeColors}
                                                            className={classnames('react-select', { 'is-invalid': data !== null && data.roomTypeID === null })}
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>

                                       <Col md='4' sm='12' className='mb-1'>
                                                                   <div className='mb-1'>
                                                                       <Label className='form-label' for='webImageUpload'>
                                                                           Upload webImageUpload
                                                                       </Label>
                                                                       <InputGroup className="input-group-merge">
                                                                           <Controller
                                                                               defaultValue=''
                                                                               control={control}
                                                                               id='webImageUpload'
                                                                               name='webImageUpload'
                                                                               placeholder='Add webImageUpload'
                                                                               render={({ field }) => <Input type='file'  className={classnames({
                                                                                   // "is-invalid": data !== null && (data.webImageUpload === null || !data.webImageUpload.length)
                                                                               })} {...field} />}
                                                                           />
                                                                       </InputGroup>
                                                                   </div>
                                                               </Col>



                                       
                                        {/* <Col md='4' sm='12' className='mb-1'> */}
                                        <div className="d-flex">
                                            <Button className="me-1" color="primary" type="submit">
                                                Submit
                                            </Button>
                                            <Button
                                                outline
                                                color="secondary"
                                                type="reset"
                                            // onClick={handleReset}
                                            >
                                                Reset
                                            </Button>

                                        </div>
                                        {/* </Col> */}
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </AccordionBody>
                </AccordionItem>
            </Accordion>

            <Modal isOpen={openModal} toggle={() => setOpenModal(!openModal)} className='modal-lg'>
                <ModalHeader className='modal-lg' toggle={() => setOpenModal(!openModal)}>Room Type Wise</ModalHeader>
                <ModalBody className='pb-3 px-sm-1 mx-20'>
                    <Row>

                        <Col md='4' sm='12' className='mb-1'>
                            <div className='mb-1'>
                                <Label className='form-label' for='roomTypeID'>
                                    Room Type ID
                                </Label>
                                <Controller
                                    id='roomTypeID'
                                    control={control}
                                    name='roomTypeID'
                                    render={({ field }) => (
                                        <Select
                                            isDisabled
                                            isClearable
                                            options={roomTypeID}
                                            classNamePrefix='select'
                                            theme={selectThemeColors}
                                            className={classnames('react-select', { 'is-invalid': data !== null && data.roomTypeID === null })}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </Col>






                        <Col md='4' sm='12' className='mb-1'>
                            <div className="mb-1">
                                <Label className="form-label" for="roomDetails">
                                    Room Details Details
                                </Label>
                                <InputGroup className="input-group-merge">

                                    {/* <Controller
                                        id="roomDetails"
                                        name="roomDetails"
                                        control={control}
                                        placeholder="Room Type Name roomDetails"
                                        render={({ field }) => (
                                            <Input
                                                type="textarea"

                                                required
                                                placeholder="Room Type Name roomDetails"
                                                {...field}
                                                className={classnames("form-control", {
                                                    "is-invalid":
                                                        data !== null && (data.roomDetails === null || !data.roomDetails.length)
                                                })}
                                            />
                                        )}
                                    /> */}
                                    <Controller
                                        name="roomDetails"
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <Input
                                                type="textarea"
                                                rows={6}
                                                value={field.value || ""}
                                                placeholder="• Add Amenities here"
                                                // onKeyDown={(e) => {
                                                //     if (e.key === "Enter") {
                                                //         e.preventDefault();

                                                //         const value = field.value || "";
                                                //         const newValue = value.endsWith("\n") || value === ""
                                                //             ? `${value}• `
                                                //             : `${value}\n• `;

                                                //         field.onChange(newValue);
                                                //     }
                                                // }}

                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();

                                                        const textarea = e.target;
                                                        const start = textarea.selectionStart;
                                                        const end = textarea.selectionEnd;
                                                        const value = field.value || "";

                                                        const before = value.slice(0, start);
                                                        const after = value.slice(end);

                                                        const insert = before.endsWith("\n") || before === ""
                                                            ? "• "
                                                            : "\n• ";

                                                        const newValue = before + insert + after;

                                                        field.onChange(newValue);

                                                        // Move cursor to correct position
                                                        setTimeout(() => {
                                                            const pos = before.length + insert.length;
                                                            textarea.setSelectionRange(pos, pos);
                                                        }, 0);
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    let value = e.target.value || "";

                                                    // ensure first bullet exists
                                                    if (value && !value.startsWith("•")) {
                                                        value = `• ${value}`;
                                                    }

                                                    field.onChange(value);
                                                }}
                                            />
                                        )}
                                    />

                                </InputGroup>
                            </div>
                        </Col>

                        {/* <Col md='4' sm='12' className='mb-1'> */}
                        <div className="d-flex">
                            <Button className="me-1" color="primary" onClick={() => updateData()}>
                                Submit
                            </Button>
                            <Button
                                outline
                                color="secondary"
                                type="reset"
                            // onClick={handleReset}
                            >
                                Reset
                            </Button>

                        </div>
                        {/* </Col> */}
                    </Row>
                </ModalBody>
            </Modal>

            <div>
                <Row>

                </Row>
            </div>
            <br></br>

            {/* <button onClick={buttonListener}>Push Me</button> */}
            <div className="ag-theme-alpine" style={{ height: 520 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData} columnDefs={columnDefs}
                    animateRows={true} rowSelection='multiple'
                    onCellClicked={cellClickedListener}
                    // paginationAutoPageSize = 'true'
                    onGridReady={params => {
                        gridRef.current = params.api;
                    }}
                    paginationPageSize='10'
                    pagination='true'
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"
                    masterDetail={true}

                />
            </div>
        </div>
    );
}

export default SubMatrix;