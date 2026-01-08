import { Button, Card, CardBody, Row, Col, Form, Label, Input, CardHeader } from 'reactstrap';
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Flatpickr from 'react-flatpickr';
import classnames from 'classnames';
import Moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import DASHBOARD_URL from '../../../../dashboard'
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import { AlignCenter } from 'react-feather';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'

// SweetAlert2 setup
const MySwal = withReactContent(Swal);

const HeaderCell = (props) => {
    const style = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: '100%',
        borderRight: '1px solid #ccc',
        height: '100%',
        boxSizing: 'border-box',
        borderBottom: props.isLastChild ? 'none' : '1px solid #ccc', // Add bottom border only for the top-level headers
    };

    return (
        <div style={style}>
            {props.displayName}
        </div>
    );
};

const LastHeaderCell = (props) => {
    const style = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: '8px',
        borderRight: 'none',
        height: '100%',
        boxSizing: 'border-box',
        borderBottom: props.isLastChild ? 'none' : '1px solid #ccc',
    };

    return (
        <div style={style}>
            {props.displayName}
        </div>
    );
};

const CompanyTracker = () => {
    const { handleSubmit, control } = useForm({});
    const gridRef1 = useRef();
    const [rowData, setRowData] = useState();
    const [open,setOpen] = useState(false)



    const formatNumberIndian = (params) => {
        const number = params.value;
        if (number == null || isNaN(number)) return '';
    
        const num = parseFloat(number);
    
        // Function to format integer part with Indian numbering system
        const addCommasIndian = (num) => {
            let len = num.length;
            if (len <= 3) return num;
    
            // Split into thousands and remaining part
            let lastThree = num.slice(-3);
            let otherParts = num.slice(0, -3);
    
            // Format the other parts
            otherParts = otherParts.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
            return otherParts + ',' + lastThree;
        };
    
        // Determine suffix and format
        let formattedNumber;
        if (num >= 10000000) {
            // For crore
            formattedNumber = (num / 10000000).toFixed(1) + ' cr';
        } else if (num >= 100000) {
            // For lakh
            formattedNumber = (num / 100000).toFixed(1) + ' Lakh';
        } else if (num >= 1000) {
            // For thousand
            formattedNumber = (num / 1000).toFixed(1) + ' k';
        } else {
            // For less than thousand
            formattedNumber = num.toFixed(2);
        }
    
        // Format with Indian commas
        const [integerPart, decimalPart] = formattedNumber.split('.');
        const formattedIntegerPart = addCommasIndian(integerPart);
    
        // Return formatted number with commas and suffix
        return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
    };
    
    
    


    const columnDefs = [
        {
            headerName: 'Account Name',
            field: 'ForecastedAccName',
            width: 230,
            headerComponentFramework: HeaderCell,
            pinned: "left",
            headerComponentParams: { isLastChild: false },
            // cellStyle: { paddingRight: '8px', borderRight: '1px solid #ccc'}
        },
        {
            headerName: 'Forecasted',
            field: 'ForecastedRNS',
            width: 230,
            align:'center',
            headerComponentFramework: HeaderCell,
            // pinned: "Right", 
            headerComponentParams: { isLastChild: false },
            cellStyle: { paddingRight: '8px', borderRight: '1px solid #ccc' }
        },
        {
            headerName: 'Number of Room Nights',
            children: [
                { headerName: 'MTD', field: 'nights', headerComponentFramework: HeaderCell },
                { headerName: 'YTD', field: 'YTDnights', headerComponentFramework: LastHeaderCell, cellStyle: { paddingRight: '8px', borderRight: '1px solid #ccc' } }
            ],
            width: 230,
            pinned: "Right",
            headerComponentFramework: HeaderCell,
            headerComponentParams: { isLastChild: false },
            // cellStyle: { paddingRight: '8px', borderRight: '1px solid #ccc' }
        },
        {
        headerName: 'Room Revenue(Meal Incl.)',
        children: [
            { 
                headerName: 'MTD', 
                field: 'roomRevenue', 
                headerComponentFramework: HeaderCell,
                valueFormatter: formatNumberIndian // Apply number formatter
            },
            { 
                headerName: 'YTD', 
                field: 'YTDroomRevenue', 
                headerComponentFramework: LastHeaderCell,
                cellStyle: { paddingRight: '8px', borderRight: '1px solid #ccc' },
                valueFormatter: formatNumberIndian // Apply number formatter
            }
        ],
        width: 230,
        headerComponentFramework: HeaderCell,
        headerComponentParams: { isLastChild: false }
    },
    {
        headerName: 'Average Room Revenue (ARR)',
        children: [
            { 
                headerName: 'MTD', 
                field: 'avgRoomRevenue', 
                headerComponentFramework: HeaderCell,
                valueFormatter: formatNumberIndian // Apply number formatter
            },
            { 
                headerName: 'YTD', 
                field: 'YTDavgRoomRevenue', 
                headerComponentFramework: LastHeaderCell,
                cellStyle: { paddingRight: '8px', borderRight: 'none' }, // No line for the last column
                valueFormatter: formatNumberIndian // Apply number formatter
            }
        ],
        width: 230,
        headerComponentFramework: HeaderCell,
        headerComponentParams: { isLastChild: true },
        filter:true,
        cellStyle: { paddingRight: '8px', borderRight: '1px solid #ccc' }
    }
    ];



    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        autoHeight: true,
        wrapText: true,
        filterParams: {
            buttons: ['apply', 'reset']
        }
    }), []);

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
        });
    };

    const GetComplaintList = (data) => {
        setOpen(true)
        if (data.incomeDate === undefined) {
            return handleError("Please select the from date");
        }
        let fromDate = Moment(String(new Date(data.incomeDate))).format('YYYY-MM-DD');
        fetch(DASHBOARD_URL + `/getAccForecastedDataForWhatsappImage?date=${fromDate}`)
            .then(result => result.json())
            .then(resp => {
                if(resp['statusCode'] == 200) {
                    setOpen(false)
                setRowData(resp['data']);
                }
            });
    };

    const onFilterTextBoxChanged2 = useCallback(() => {
        gridRef1.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        );
    }, []);

    return (
        <div>
            <div>
                <Card>
                    <CardHeader>
                        <h4>Select Dates</h4>
                    </CardHeader>
                    <CardBody>
                        <Form onSubmit={handleSubmit(GetComplaintList)}>
                            <Row>
                                <Col md='4' sm='12'>
                                    <div className='mb-1'>
                                        <Label className='form-label' for='incomeDate'>
                                            From Date <span style={{ color: 'red' }}>*</span>
                                        </Label>
                                        <Controller
                                            control={control}
                                            id='incomeDate'
                                            name='incomeDate'
                                            render={({ field }) => (
                                                <Flatpickr
                                                    required
                                                    placeholder='YYYY-MM-DD'
                                                    className={classnames('form-control')}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <div align='end'>
                                <Button color='primary' className='me-1' type='submit'>
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </div>

            {rowData &&
                <div>
                    <Row>
                        <Col md='3' sm='12' className='mb-1'>
                            <Label className='form-label' for='fullName'>
                                Search
                            </Label>
                            <Input
                                type="text"
                                id="filter-text-box"
                                placeholder="Filter..."
                                onInput={onFilterTextBoxChanged2}
                            />
                        </Col>
                    </Row>
                    <br />
                    <h4>
                        {rowData[0].month} month's company productivity
                    </h4>
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
    Please wait... We're processing your request,      
    </h1>
      <h1 style={{ fontWeight: 'bold', color: 'white' }}>
        which may take a little longer due to additional data. Please be patient!
      </h1>
    <CircularProgress color="inherit" />
  </div>
</Backdrop>
                    <div className="ag-theme-alpine" style={{ height: 540 }}>

                        <AgGridReact
                            ref={gridRef1}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            animateRows={true}
                            rowSelection="multiple"
                            pagination={true}
                            paginationPageSize={10}
                            defaultColDef={defaultColDef}
                            headerHeight={40} // Adjust as needed
                        />


                        {/* <AgGridReact
                            ref={gridRef1}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            animateRows={true}
                            rowSelection="multiple"
                            pagination={true}
                            paginationPageSize={10}
                            defaultColDef={defaultColDef}
                        /> */}
                    </div>
                </div>
            }
        </div>
    );
};

export default CompanyTracker;
