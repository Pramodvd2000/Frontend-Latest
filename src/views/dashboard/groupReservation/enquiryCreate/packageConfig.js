// ** React Imports
import { useState } from "react";
import Select from "react-select";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import API_URL from "../../../../config";
import { selectThemeColors } from "@utils";
import { Input, Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Modal, ModalHeader, ModalBody } from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useRef, useEffect, useMemo, useCallback } from "react";
import Moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


const defaultValues = {
    packageCode: "",
    description: "",
    beginSellDate: "",
    endSellDate: "",
    basePrice: "",
    taxAmount: "",
    totalAmount: "",
    calculationRule: "",
    postingRhythm: "",
    rateInclusion: "",
    isActive: null,
    packageGroupID: null,
    transactionCodeID: null,
};


let packages = [
    fetchx(API_URL + "/getGroupForPackage?hotelID=1 ")
        .then((result) => result.json())
        .then((resp) => {
            packages = resp["data"];
        }),
];


const PackageCode = ({packageToggle}) => {
    const [data, setData] = useState(null);
    const { reset, handleSubmit, control, watch, formState: { errors }, setValue } = useForm({ defaultValues });
    const [transactionData, setTransactionData] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState();
    const [packageModal, setPackageModal] = useState(false);
    let navigate = useNavigate();
    const gridRef1 = useRef(null)


    function closeModal() {
        packageToggle()
    }

    useEffect(() => {
        fetch(API_URL + "/gettransactioncode?hotelID=1")
            .then((result) => result.json())
            .then((rowData) => {
                let filteredData = rowData.data.filter(item =>
                    item.description.includes('24@43 Package Meal') && !item.description.includes('Revoke')
                );
                setTransactionData(filteredData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);



    const beginSellDate = watch('beginSellDate');
    const today = Moment().format('YYYY-MM-DD');
    const options = {
        minDate: today
    };


    const optionsToDate = {
        minDate: (Moment(String(new Date(beginSellDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
    };


    const [columnDefs2, setColumnDefs2] = useState([
        { headerName: 'Trxn Code', field: 'transactionCode', suppressSizeToFit: true, maxWidth: 140 },
        { headerName: 'Description', field: 'description', suppressSizeToFit: true, width: 220 },
        { headerName: 'Group', field: 'groupCode', suppressSizeToFit: true, width: 130 },
        { headerName: 'Sub Group', field: 'subGroup', suppressSizeToFit: true, maxWidth: 130 },
        {
            headerName: "Action",
            maxWidth: 140,
            cellRenderer: (params) => {
                return (
                    <Button
                        color='primary'
                        onClick={() => onPackageSelect(params.data)}>
                        Select
                    </Button>
                )
            }
        },
    ]);


    //Search element
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef1.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        )
    }, [])


    //ag-grid column defn
    const defaultColDef = useMemo(() => (
        {
            sortable: true,
            filter: true,
            filterParams: {
                buttons: ['apply', 'reset']
            }
        }
    ))


    // company selection
    const onPackageSelect = (rowData) => {
        setSelectedPackage(rowData);
        setPackageModal(false);
    };


    // error handling for same guest addition
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


    // On success modal open
    const handleSuccess = (message) => {
        const swal = MySwal.fire({
            text: message,
            icon: 'success',
            showConfirmButton: false // Hide the confirm button
        });

        setTimeout(() => {
        }, 1000);
    }


    const onSubmit = (data) => {
        setData(data);
        if (data.beginSellDate === undefined || data.beginSellDate === '') {
            return handleError("Please select begin sell date")
        }
        if (data.endSellDate === undefined || data.endSellDate === '') {
            return handleError("Please select the end sell date")
        }
        if ((Moment(String(new Date(data.endSellDate))).format('YYYY-MM-DD')) < (Moment(String(new Date(data.beginSellDate))).format('YYYY-MM-DD'))) {
            return handleError("Please select the end sell date date")
        }

        let fromDate = (Moment(String(new Date(data.beginSellDate))).format('YYYY-MM-DD'))
        let toDate = (Moment(String(new Date(data.endSellDate))).format('YYYY-MM-DD'))
        let packageGroup = JSON.stringify({
            packageCode: data.packageCode,
            description: data.description,
            beginSellDate: fromDate,
            endSellDate: toDate,
            breakFast: data.breakfast,
            lunch: data.lunch,
            dinner: data.dinner,
            totlaBase: data.total,
            calculationRule: 1,
            postingRhythm: 1,
            rateInclusion: 1,
            isActive: 1,
            packageGroupID: data.package.value,
            transactionCodeID: selectedPackage,
        });


        fetchx(API_URL + "/addpackageForGroup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: packageGroup,
        }).then(data => data.json())
            .then((res) => {
                closeModal()
                handleSuccess("Successfully added the package type")
            });
    };


    const handleReset = () => {
        reset({
            packageCode: "",
            description: "",
            beginSellDate: "",
            endSellDate: "",
            basePrice: "",
            taxAmount: "",
            totalAmount: "",
            calculationRule: "",
            postingRhythm: "",
            rateInclusion: "",
            isActive: null,
            packageGroupID: null,
            transactionCodeID: null,
        });
    };


    // To clear selected booker
    const handlePackageClear = () => {
        setSelectedPackage()
    };


    // Watch the values of breakfast, lunch, and dinner
    const breakfast = watch('breakfast');
    const lunch = watch('lunch');
    const dinner = watch('dinner');

    // Update the total whenever breakfast, lunch, or dinner changes
    useEffect(() => {
        const total =
            (parseFloat(breakfast) || 0) +
            (parseFloat(lunch) || 0) +
            (parseFloat(dinner) || 0);
        setValue('total', total.toFixed(2));
    }, [breakfast, lunch, dinner, setValue]);


    return (
        <div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4">Package Addition</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <Row>

                                    {/* Package Code */}
                                    <Col md="3" sm="12">
                                        <div className="mb-1">
                                            <Label className="form-label" for="packageCode">
                                                Package Code <spam style={{ color: 'red' }}>*</spam>
                                            </Label>
                                            <Controller
                                                defaultValue=""
                                                control={control}
                                                id="packageCode"
                                                name="packageCode"
                                                render={({ field }) => (
                                                    <Input
                                                        placeholder="Package Code"
                                                        required
                                                        invalid={errors.packageCode && true}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    {/* Description */}
                                    <Col md="3" sm="12">
                                        <div className="mb-1">
                                            <Label className="form-label" for="description">
                                                Description <spam style={{ color: 'red' }}>*</spam>
                                            </Label>
                                            <Controller
                                                defaultValue=""
                                                control={control}
                                                id="description"
                                                name="description"
                                                render={({ field }) => (
                                                    <Input
                                                        placeholder="Description"
                                                        required
                                                        invalid={errors.description && true}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    {/* Begin sell date */}
                                    <Col md="3" sm="12">
                                        <div className="mb-1">
                                            <Label className="form-label" for="beginSellDate">
                                                Begin Sell Date <spam style={{ color: 'red' }}>*</spam>
                                            </Label>
                                            <Controller
                                                control={control}
                                                id="beginSellDate"
                                                name="beginSellDate"
                                                render={({ field }) => (
                                                    <Flatpickr
                                                        {...field}
                                                        required
                                                        options={options}
                                                        placeholder="YYYY-MM-DD "
                                                        className={classnames('form-control', {
                                                            'is-invalid': data !== null && data.beginSellDate === null
                                                        })}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    {/* End sell date */}
                                    <Col md="3" sm="12">
                                        <div className="mb-1">
                                            <Label className="form-label" for="endSellDate">
                                                End Sell Date <spam style={{ color: 'red' }}>*</spam>
                                            </Label>
                                            <Controller
                                                control={control}
                                                id="endSellDate"
                                                name="endSellDate"
                                                render={({ field }) => (
                                                    <Flatpickr
                                                        required
                                                        {...field}
                                                        options={optionsToDate}
                                                        placeholder="YYYY-MM-DD "
                                                        className={classnames("form-control", {
                                                            "is-invalid":
                                                                data !== null && data.endSellDate === null,
                                                        })}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    {/* Breakfast */}
                                    <Col md="3" sm="12">
                                        <div className="mb-1">
                                            <Label className="form-label" htmlFor="breakfast">
                                                Breakfast Price <span style={{ color: 'red' }}>*</span>
                                            </Label>
                                            <Controller
                                                defaultValue=""
                                                control={control}
                                                id="breakfast"
                                                name="breakfast"
                                                render={({ field }) => (
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter breakfast price"
                                                        required
                                                        {...field}
                                                    // onChange={(e) => {
                                                    //     const value = e.target.value;
                                                    //     field.onChange(value);
                                                    //     handleBasePriceChange(value);
                                                    // }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    {/* Lunch */}
                                    <Col md="3" sm="12">
                                        <div className="mb-1">
                                            <Label className="form-label" htmlFor="lunch">
                                                Lunch Price <span style={{ color: 'red' }}>*</span>
                                            </Label>
                                            <Controller
                                                defaultValue=""
                                                control={control}
                                                id="lunch"
                                                name="lunch"
                                                render={({ field }) => (
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter lunch price"
                                                        required
                                                        invalid={errors.basePrice && true}
                                                        {...field}
                                                    // onChange={(e) => {
                                                    //     const value = e.target.value;
                                                    //     field.onChange(value);
                                                    //     handleBasePriceChange(value);
                                                    // }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    {/* Dinner */}
                                    <Col md="3" sm="12">
                                        <div className="mb-1">
                                            <Label className="form-label" htmlFor="dinner">
                                                Dinner price <span style={{ color: 'red' }}>*</span>
                                            </Label>
                                            <Controller
                                                defaultValue=""
                                                control={control}
                                                id="dinner"
                                                name="dinner"
                                                render={({ field }) => (
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter dinner price"
                                                        required
                                                        {...field}
                                                    // onChange={(e) => {
                                                    //     const value = e.target.value;
                                                    //     field.onChange(value);
                                                    //     handleBasePriceChange(value);
                                                    // }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    {/* Total base price */}
                                    <Col md="3" sm="12">
                                        <div className="mb-1">
                                            <Label className="form-label" htmlFor="total">
                                                Total Price <span style={{ color: 'red' }}>*</span>
                                            </Label>
                                            <Controller
                                                control={control}
                                                id="total"
                                                name="total"
                                                render={({ field }) => (
                                                    <Input
                                                        type="text"
                                                        placeholder="Base Price"
                                                        disabled
                                                        required
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    {/* Group Code */}
                                    <Col md="3" sm="12">
                                        <div className="mb-1">
                                            <Label className="form-label" for="package">
                                                Group Code <spam style={{ color: 'red' }}>*</spam>
                                            </Label>
                                            <Controller
                                                id="package"
                                                control={control}
                                                name="package"
                                                render={({ field }) => (
                                                    <Select
                                                        required
                                                        isClearable
                                                        options={packages}
                                                        classNamePrefix="select"
                                                        theme={selectThemeColors}
                                                        className={classnames("react-select")}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    {/* Calculation rule */}
                                    <Col md="3" sm="12">
                                        <div className="mb-1">
                                            <Label className="form-label" for="calculationRule">
                                                Calculation Rule
                                            </Label>
                                            <Controller
                                                control={control}
                                                id="calculationRule"
                                                name="calculationRule"
                                                render={({ field }) => (
                                                    <Input
                                                        disabled
                                                        placeholder="Calculation Rule"
                                                        invalid={errors.calculationRule && true}
                                                        {...field}
                                                        value={"Per Adult"}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    {/* Posting Rhythm */}
                                    <Col md="3" sm="12">
                                        <div className="mb-1">
                                            <Label className="form-label" for="postingRythm">
                                                Posting Rhythm
                                            </Label>
                                            <Controller
                                                defaultValue="Post Every Night"
                                                control={control}
                                                id="postingRythm"
                                                name="postingRythm"
                                                render={({ field }) => (
                                                    <Input
                                                        disabled
                                                        placeholder="Posting Rhythm"
                                                        invalid={errors.postingRythm && true}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    {/* Rate inclusion */}
                                    <Col md="3" sm="12">
                                        <div className="mb-1">
                                            <Label className="form-label" for="rateInclusion">
                                                Rate Inclusion
                                            </Label>
                                            <Controller
                                                control={control}
                                                id="rateInclusion"
                                                name="rateInclusion"
                                                render={({ field }) => (
                                                    <Input
                                                        disabled
                                                        placeholder="Rate Inclusion"
                                                        invalid={errors.rateInclusion && true}
                                                        {...field}
                                                        value={"True"}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    {/* Transaction code */}
                                    <Col md='3' sm='12'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='transactionCode'>
                                                Transaction Code <span style={{ color: 'red' }}>*</span>
                                            </Label>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Input
                                                    required
                                                    type="text"
                                                    name='transactionCode'
                                                    placeholder='Select transaction code'
                                                    value={selectedPackage !== undefined ? selectedPackage.description : ''}
                                                    onClick={() => setPackageModal(!packageModal)}
                                                /> &nbsp;&nbsp;
                                                <span
                                                    style={{
                                                        color: 'red',
                                                        cursor: 'pointer',
                                                        border: 'none',
                                                        background: 'none',
                                                        padding: '0',
                                                        fontSize: 'inherit',
                                                        marginLeft: '5px',
                                                    }}
                                                    size="sm"
                                                    onClick={handlePackageClear}
                                                >
                                                    X
                                                </span>
                                            </div>
                                        </div>
                                    </Col>


                                    {
                                        packageModal &&
                                        <div>
                                            <Modal isOpen={packageModal} toggle={() => setPackageModal(!packageModal)} className='modal-lg'>
                                                <ModalHeader toggle={() => setPackageModal(!packageModal)}>Transaction Code</ModalHeader>
                                                <ModalBody>
                                                    <div>
                                                        <Row className='mb-1'>
                                                            <Col md='3' sm='12' className='me-1'>
                                                                <Label className='form-label' for='fullName'>
                                                                    Search
                                                                </Label>
                                                                <Input
                                                                    type="text"
                                                                    id="filter-text-box"
                                                                    placeholder="Filter..."
                                                                    onInput={onFilterTextBoxChanged}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="ag-theme-alpine" style={{ height: 520 }}>
                                                        <AgGridReact
                                                            ref={gridRef1}
                                                            rowData={transactionData}
                                                            columnDefs={columnDefs2}
                                                            animateRows={true}
                                                            paginationPageSize='10'
                                                            pagination='true'
                                                            defaultColDef={defaultColDef}
                                                            headerColor="ddw-primary"
                                                        />
                                                    </div>
                                                </ModalBody>
                                            </Modal>
                                        </div>
                                    }

                                </Row>
                            </div>

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

                        </Form>
                    </CardBody>
                </Card>
            </div>

        </div>
    );
};


export default PackageCode;