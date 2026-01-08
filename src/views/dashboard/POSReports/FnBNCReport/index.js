// ** React Imports
import { useState } from 'react'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'
import Moment from 'moment'
import { Card, Form, Row, Col, Label, Button, CardBody, CardTitle, CardHeader, Modal, ModalBody, ModalHeader, Table } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/pages/page-form-validation.scss'
import { AgGridReact } from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import DASHBOARD_URL from '../../../../dashboard'
import { useNavigate } from 'react-router-dom';
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'



const MySwal = withReactContent(Swal)

const defaultValues = {
  frmdate: ''
}

const FnBNCReport = () => {

  // AG Grid
  const [rowData, setRowData] = useState();
  const [rowData1, setRowData1] = useState();
  const [flag, setFlag] = useState(false)
  const [combinedData, setcombinedData] = useState();
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [isButtonClicked, setIsButtonClicked] = useState(false);





  const gridRef = useRef();
  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));




  // ** State
  const [data, setData] = useState(null)

  // ** Hooks
  const { reset, handleSubmit, control } = useForm({ defaultValues })
  let navigate = useNavigate();

  const onSubmit = data => {
    setIsButtonClicked(true)
    setLoading(true); // Start loading
  
    setData(data);
    setFlag(true);
    let createmarketGroup = JSON.stringify({
      "hotelID": 1,
      "fromDate": Moment(String(new Date(data.frmdate[0]))).format("YYYY-MM-DD"),
      "toDate": Moment(String(new Date(data.todate[0]))).format("YYYY-MM-DD")
    });
  
    const filterFromDate = Moment(data.frmdate[0]).format("DD-MM-YYYY");
    const filterToDate = Moment(data.todate[0]).format("DD-MM-YYYY");
    setFilterFromDate(filterFromDate);
    setFilterToDate(filterToDate);
  
    fetchx(DASHBOARD_URL + "/getFnBNCReport", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    })
      .then(response => response.json())
      .then(res => {
        setIsButtonClicked(false)
        if (res['statusCode'] == 200) {
          setLoading(false); 
          setRowData1(res["data"]);
          const startDateEntry = {
            name: 'Start Date',
            totalAmount: Moment(String(new Date(data.frmdate[0]))).format("DD-MM-YYYY")
          };
          
          const endDateEntry = {
            name: 'End Date',
            totalAmount: Moment(String(new Date(data.todate[0]))).format("DD-MM-YYYY")
          };
          const combinedData1 = [startDateEntry, endDateEntry, ...res["data"]];
          const updatedCombinedData = combinedData1.map(item => ({
            ...item,
            name: item.name === 'Sales &amp; Marketing' ? 'Sales and Marketing' : item.name
          }));
          setcombinedData(updatedCombinedData);
        } else {
          MySwal.fire({
            title: 'Error!',
            text: 'Failed to fetch data, please try again.',
            icon: 'error',
            confirmButtonText: 'Okay'
          });
        }
        // Stop loading after handling success or failure
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // setLoading(false); // Stop loading on error
        MySwal.fire({
          title: 'Error!',
          text: 'Failed to fetch data, please check your connection and try again.',
          icon: 'error',
          confirmButtonText: 'Okay'
        });
      });
  }

  const handleReset = () => {
    reset({
      frmdate: '',
      todate: '',
    })
  }
  const onBtnExport = () => {
    const csvData = [];
  
    // Extract header names
    const headerData = combinedData.map((item) => item.name);
    csvData.push(headerData.join(','));
    // Extract data values
    const rowData = combinedData.map((item) => item.totalAmount);
    csvData.push(rowData.join(','));
  
    const csvString = csvData.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FnbNCReport.csv';

    a.click();

    window.URL.revokeObjectURL(url);
  };

  const generateExcel = () => {
    if (filterFromDate && filterToDate) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('FnB NC Report');

        // Assuming rowData1 contains objects with 'name' and 'totalAmount'
        const names = rowData1.map(row => row.name);
        const totalAmounts = rowData1.map(row => row.totalAmount);

        // Define columns with dynamic headers
        const columns = names.map(name => ({
            header: name,
            key: name,
            width: 20
        }));

        worksheet.columns = columns;

        // Adding report title and filters
        worksheet.addRow(['Report Name:', 'FnB NC Report']);
        worksheet.addRow(['Filter From Bill Date:', filterFromDate]);
        worksheet.addRow(['To Date:', filterToDate]);

        worksheet.addRow([]);

        // Add header row with dynamic column headers
        worksheet.addRow(names).font = { bold: true };
        for (let i = 1; i <= 4; i++) {
          worksheet.getRow(i).font = { bold: true };
      }

        // Add a single data row with totalAmounts
        worksheet.addRow(totalAmounts);

        worksheet.spliceRows(1, 1);

        // Adjust column alignment
        worksheet.columns.forEach((column) => {
            column.alignment = { vertical: 'middle', horizontal: 'right' };
        });

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            // saveAs(blob, 'FnB NC Report.xlsx'); 
            saveAs(blob, `FnB NC Report_${formattedDate}.xlsx`);

        }).catch((error) => {
            console.error('Error generating Excel file:', error);
        });
    }
};




  return (
    <div>



      <Card>
        <CardHeader>
          <CardTitle tag='h4'>F&B NC Summary Report</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="frmdate">
                    From Date
                  </Label>
                  <Controller
                    control={control}
                    id="frmdate"
                    name="frmdate"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        required
                        options={{ allowInput: true }}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col md="3" sm="12">
                <div className="mb-1">
                  <Label className="form-label" for="todate">
                    To Date
                  </Label>
                  <Controller
                    control={control}
                    id="todate"
                    name="todate"
                    render={({ field }) => (
                      <Flatpickr
                        {...field}
                        required
                        options={{ allowInput: true }}
                        placeholder="YYYY-MM-DD "
                        className={classnames("form-control", {
                        })}
                      />
                    )}
                  />
                </div>
              </Col>

              <div className='d-flex'>
              <Button className='me-1' color='primary' type='submit' disabled={isButtonClicked}>
                                {isButtonClicked ? 'Processing...' : 'Submit'}
                                </Button>
                {/* <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                  Reset
                </Button> */}

                {/* <Button className='me-1' color='primary' type='submit' onClick={onBtnExport}>
                  Download
                </Button> */}
                <Button className='me-1' color='primary' onClick={generateExcel}>
                      Download Excel
                      </Button>
              </div>
            </Row>
          </Form>
        </CardBody>
      </Card>
      {loading == true ? (
        // <div style={{ textAlign: 'center', padding: '20px' }}>
        //   <h1 style={{ fontWeight: 'bold', color: 'grey' }}>Loading data, please wait...</h1>
        // </div>
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
      ) : (
        flag && combinedData && (
          <Table className="m-0" style={{ width: '100%' }} bordered responsive>
            <tbody>
              <tr>
                {combinedData.map((item, index) => (
                  <React.Fragment key={index}>
                    <td><b>{item.name}</b></td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                {combinedData.map((item, index) => (
                  <React.Fragment key={index}>
                    <td>{item.totalAmount}</td>
                  </React.Fragment>
                ))}
              </tr>
            </tbody>
          </Table>
        )
      )}
    </div>
  )
}

export default FnBNCReport