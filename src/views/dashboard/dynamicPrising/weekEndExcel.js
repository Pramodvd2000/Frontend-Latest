import React, { useRef, useState, useEffect } from 'react';
import { Button, Col, Input, Label, Row } from 'reactstrap';
import { Controller, useForm } from 'react-hook-form';
import { AgGridReact } from 'ag-grid-react';
import API_URL from '../../../config';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import ExcelJS from 'exceljs';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';
import Flatpickr from "react-flatpickr";
import Moment from 'moment';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { format } from 'date-fns';
import Select from "react-select";
import { selectThemeColors } from "@utils";
import "@styles/react/libs/react-select/_react-select.scss";
import classnames from "classnames";




const isActiveDropDown = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },

];


const MySwal = withReactContent(Swal);
const UploadGuestDetailsPage = () => {
    const { control, watch } = useForm();
    const fileInputRef = useRef(null);
    let navigate = useNavigate();

    const [fileName, setFileName] = useState('');
    const [fileData, setFileData] = useState(null);
    const [file, setFile] = useState(null);
    const [tempData, setTempData] = useState([]); // Replace with actual parsed Excel data
    const [isUpdateWithRatesButton, setIsUpdateWithRatesButton] = useState(false);
    const [columnDefs6, setColumnDefs6] = useState([]);
    const [isDynamic, setIsDynamic] = useState();
    const [reload, setReload] = useState(false);
    const [Today, setToday] = useState()

    const [open, setOpen] = useState(false);
    const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);

    useEffect(() => {
        const hotelIDData = JSON.stringify({
            hotelID: 1
        })
        fetchx(API_URL + "/getBusinessDate", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: hotelIDData
        }).then((res) => res.json())
            .then(postres => {
                const today = new Date(postres['data'][0]['businessDate']);
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
            })
    }, []);

    const gridRef2 = useRef();




    // error handling for same guest addition
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

    // Success modal for split reservation
    const handleSuccess = (message) => {
        return MySwal.fire(
            {
                title: "Success!",
                text: message,
                icon: "success",
            },
            // setBasicModal(false),
            setTimeout(() => {
                navigate("");
            }, 1000)
        );
    };


    // const handleFileUpload = (e) => {
    //   const file = e.target.files[0];
    //   console.log('File selected:', file);
    //   if (file) {
    //     // File parsing logic here
    //     // Example: parseExcel(file).then(setFileData)
    //     console.log('Uploaded file:', file.name);
    //     // Dummy data for grid testing
    //     setFileData([{ guestName: 'John Doe', roomType: 'Deluxe' }]);
    //   }
    // };
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log('File selected:', file.name);

        try {
            const buffer = await file.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);

            const worksheet = workbook.worksheets[0];
            const jsonData = [];

            worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                // Skip header row if needed (rowNumber === 1)
                if (rowNumber > 1) {
                    const rowData = {};
                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        const header = worksheet.getRow(1).getCell(colNumber).value;
                        rowData[header] = cell.value;
                    });
                    jsonData.push(rowData);
                }
            });

            console.log('Parsed data:', jsonData);
            setFileData(jsonData);
            setFile(file);

        } catch (error) {
            console.error('Error parsing file:', error);
            alert('Error parsing Excel file. Please check the format.');
        }
    };

    const handleFileUploadDynamicPricing = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log('File selected:', file.name);

        try {
            const buffer = await file.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);

            const worksheet = workbook.worksheets[0];
            const jsonData = [];

            worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                // Skip header row if needed (rowNumber === 1)
                if (rowNumber > 1) {
                    const rowData = {};
                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        const header = worksheet.getRow(1).getCell(colNumber).value;
                        rowData[header] = cell.value;
                    });
                    jsonData.push(rowData);
                }
            });

            console.log('Parsed data:', jsonData);
            setFileData(jsonData);
            setFile(file);

        } catch (error) {
            console.error('Error parsing file:', error);
            alert('Error parsing Excel file. Please check the format.');
        }
    };



    // const handleValidateAndFetchGridData = (data) => {
    //     console.log('Validating data:', data);

    //     // Validate data structure
    //     if (!Array.isArray(data)) {
    //         handleError('Invalid file format. Please upload a valid Excel template.');
    //         return;
    //     }

    //     if (data.length === 0) {
    //         handleError('The uploaded file contains no pricing data.');
    //         return;
    //     }


    //     // Validate date fields
    //     const fromDate = watch('fromDate');
    //     const toDate = watch('toDate');

    //     if (!fromDate) {
    //         handleError('Please select a valid Start Date.');
    //         return;
    //     }

    //     if (!toDate) {
    //         handleError('Please select a valid End Date.');
    //         return;
    //     }

    //     if (!isDynamic) {
    //         handleError('Please select whether Dynamic Pricing is Applicable.');
    //         return;
    //     }



    //     let hasErrors = false;
    //     const errorMessages = [];

    //     // Skip the first two rows (headers) and start from row 3 (index 2)
    //     const dataRows = data.slice(1); // Remove first two header rows

    //     if (dataRows.length === 0) {
    //         handleError('The uploaded file contains no data rows.');
    //         return;
    //     }

    //     dataRows.forEach((row, index) => {
    //         console.log('Validating row:', row);

    //         // Get the actual row number for error reporting (add 3 because we skipped 2 headers and arrays are 0-based)
    //         const rowNumber = index + 3;

    //         // Extract From Date and To Date for error context
    //         const fromDate = row['From Date'];
    //         const toDate = row['To Date'];

    //         // Check if both date columns are empty (indicating an empty row)
    //         if ((!fromDate || fromDate === '') && (!toDate || toDate === '')) {
    //             console.log(`Skipping empty row ${rowNumber}`);
    //             return; // Skip empty rows
    //         }

    //         // Validate required date fields
    //         if (!fromDate || fromDate === '') {
    //             hasErrors = true;
    //             errorMessages.push(`• Row ${rowNumber}: Missing "From Date"`);
    //         }

    //         if (!toDate || toDate === '') {
    //             hasErrors = true;
    //             errorMessages.push(`• Row ${rowNumber}: Missing "To Date"`);
    //         }

    //         // Validate date format if dates exist
    //         if (fromDate && fromDate !== '') {
    //             const fromDateObj = new Date(fromDate);
    //             if (isNaN(fromDateObj.getTime())) {
    //                 hasErrors = true;
    //                 errorMessages.push(`• Row ${rowNumber}: Invalid "From Date" format. Use YYYY-MM-DD`);
    //             }
    //         }

    //         if (toDate && toDate !== '') {
    //             const toDateObj = new Date(toDate);
    //             if (isNaN(toDateObj.getTime())) {
    //                 hasErrors = true;
    //                 errorMessages.push(`• Row ${rowNumber}: Invalid "To Date" format. Use YYYY-MM-DD`);
    //             }
    //         }

    //         // Validate date range if both dates exist
    //         if (fromDate && toDate && fromDate !== '' && toDate !== '') {
    //             const fromDateObj = new Date(fromDate);
    //             const toDateObj = new Date(toDate);
    //             if (fromDateObj > toDateObj) {
    //                 hasErrors = true;
    //                 errorMessages.push(`• Row ${rowNumber}: "From Date" cannot be after "To Date"`);
    //             }
    //         }

    //         // Get room class columns (exclude date columns)
    //         const roomClasses = Object.keys(row).filter(key =>
    //             key !== 'From Date' && key !== 'To Date' && key !== '__rowNum__'
    //         );

    //         // Check for empty values in room classes
    //         const emptyRoomClasses = roomClasses.filter(roomClass =>
    //             row[roomClass] === null || row[roomClass] === undefined || row[roomClass] === ''
    //         );

    //         // Check for invalid numbers in room classes
    //         const invalidRoomClasses = roomClasses.filter(roomClass =>
    //             row[roomClass] !== '' && row[roomClass] !== null && row[roomClass] !== undefined && isNaN(Number(row[roomClass]))
    //         );

    //         // Check for negative numbers
    //         const negativeRoomClasses = roomClasses.filter(roomClass =>
    //             row[roomClass] !== '' && row[roomClass] !== null && row[roomClass] !== undefined && !isNaN(Number(row[roomClass])) && Number(row[roomClass]) < 0
    //         );

    //         if (emptyRoomClasses.length > 0) {
    //             hasErrors = true;
    //             errorMessages.push(`• Row ${rowNumber}: Missing prices for ${emptyRoomClasses.join(', ')} (Dates: ${fromDate} to ${toDate})`);
    //         }

    //         if (invalidRoomClasses.length > 0) {
    //             hasErrors = true;
    //             errorMessages.push(`• Row ${rowNumber}: Invalid number format for ${invalidRoomClasses.join(', ')} (Dates: ${fromDate} to ${toDate})`);
    //         }

    //         if (negativeRoomClasses.length > 0) {
    //             hasErrors = true;
    //             errorMessages.push(`• Row ${rowNumber}: Negative prices not allowed for ${negativeRoomClasses.join(', ')} (Dates: ${fromDate} to ${toDate})`);
    //         }
    //     });

    //     // Check if we found any valid data rows after filtering
    //     const validDataRows = dataRows.filter(row => {
    //         const fromDate = row['From Date'];
    //         const toDate = row['To Date'];
    //         return fromDate && fromDate !== '' && toDate && toDate !== '';
    //     });

    //     if (validDataRows.length === 0) {
    //         handleError('No valid data rows found. Please check that you have entered dates and prices in the template.');
    //         return;
    //     }

    //     if (hasErrors) {
    //         handleError(
    //             `Dynamic pricing data validation issues:\n\n${errorMessages.join('\n')}\n\n` +
    //             `Please ensure:\n- All date ranges have valid From Date and To Date in YYYY-MM-DD format\n- All room classes have valid prices\n- Prices must be positive numbers\n- No empty cells in room price columns`
    //         );
    //     } else {
    //         setTempData(validDataRows);
    //         console.log('Dynamic pricing data validated successfully:', validDataRows);
    //     }
    // };

    const handleValidateAndFetchGridData = (data) => {
        console.log('Validating data', data);

        // Validate data structure
        if (!Array.isArray(data)) {
            handleError('Invalid file format. Please upload a valid Excel template.');
            return;
        }

        if (data.length === 0) {
            handleError('The uploaded file contains no pricing data.');
            return;
        }

                    // ✅ Check if "Occupancy %" column exists
    const firstRow = data[0];
    const headers = Object.keys(firstRow || {});
    console.log('Headers found:', headers);
    if (headers.includes('Occupancy %')) {
            setReload(true)
        setFileName('');
        setFileData(null);
        setTempData([]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        handleError('The uploaded Excel file must not contain an "Occupancy %" column.');
        return;
    }
    
        // Validate date fields
        const fromDate = watch('fromDate');
        const toDate = watch('toDate');

        if (!fromDate) {
            handleError('Please select a valid Start Date.');
            return;
        }

        if (!toDate) {
            handleError('Please select a valid End Date.');
            return;
        }

        if (!isDynamic) {
            handleError('Please select whether Dynamic Pricing is Applicable.');
            return;
        }

        let hasErrors = false;
        const errorMessages = [];

        data.forEach((row, index) => {
            console.log('Validating row:', row);

            // Get all columns (no Occupancy % column used)
            const roomClasses = Object.keys(row); // all columns remain

            // Check for empty values
            const emptyRoomClasses = roomClasses.filter(
                roomClass => row[roomClass] === null || row[roomClass] === undefined || row[roomClass] === ''
            );

            // Check for invalid numbers
            const invalidRoomClasses = roomClasses.filter(
                roomClass => row[roomClass] !== '' && isNaN(Number(row[roomClass]))
            );

            if (emptyRoomClasses.length > 0) {
                hasErrors = true;
                errorMessages.push(`• Missing prices for ${emptyRoomClasses.join(', ')} in row ${index + 1}`);
            }

            if (invalidRoomClasses.length > 0) {
                hasErrors = true;
                errorMessages.push(`• Invalid number format for ${invalidRoomClasses.join(', ')} in row ${index + 1}`);
            }
        });

        if (hasErrors) {
            handleError(
                `Pricing data validation issues:\n\n${errorMessages.join('\n')}\n\n` +
                `Please ensure: \n- All room classes have prices\n- Prices must be numbers\n- No empty cells`
            );
        } else {
            setTempData(data);
            console.log('Pricing data validated successfully');
        }
    };


    const handleValidateAndFetchGridDataWithDynamicPricing = (data) => {
        console.log('Validating data', data);
        // Validate data structure
        if (!Array.isArray(data)) {
            handleError('Invalid file format. Please upload a valid Excel template.');
            return;
        }

        if (data.length === 0) {
            handleError('The uploaded file contains no pricing data.');
            return;
        }


            // ✅ Check if "Occupancy %" column exists
    const firstRow = data[0];
    const headers = Object.keys(firstRow || {});
    console.log('Headers found:', headers);
    if (!headers.includes('Occupancy %')) {
            setReload(true)
        setFileName('');
        setFileData(null);
        setTempData([]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        handleError('The uploaded Excel file must contain an "Occupancy %" column.');
        return;
    }



        // Validate date fields
        const fromDate = watch('fromDate');
        const toDate = watch('toDate');

        if (!fromDate) {
            handleError('Please select a valid Start Date.');
            return;
        }

        if (!toDate) {
            handleError('Please select a valid End Date.');
            return;
        }

        if (!isDynamic) {
            handleError('Please select whether Dynamic Pricing is Applicable.');
            return;
        }


        let hasErrors = false;
        const errorMessages = [];

        data.forEach((row) => {
            console.log('Validating row:', row);
            const occupancy = row['Occupancy %'];

            // Get all columns except 'Occupancy %'
            const roomClasses = Object.keys(row).filter(key => key !== 'Occupancy %');

            // Check for empty values in room classes
            const emptyRoomClasses = roomClasses.filter(roomClass =>
                row[roomClass] === null || row[roomClass] === undefined || row[roomClass] === ''
            );

            // Check for invalid numbers in room classes
            const invalidRoomClasses = roomClasses.filter(roomClass =>
                row[roomClass] !== '' && isNaN(Number(row[roomClass]))
            );

            if (emptyRoomClasses.length > 0) {
                hasErrors = true;
                errorMessages.push(`• Missing prices for ${emptyRoomClasses.join(', ')} at ${occupancy}`);
            }

            if (invalidRoomClasses.length > 0) {
                hasErrors = true;
                errorMessages.push(`• Invalid number format for ${invalidRoomClasses.join(', ')} at ${occupancy}`);
            }
        });

        if (hasErrors) {
            handleError(
                `Pricing data validation issues:\n\n${errorMessages.join('\n')}\n\n` +
                `Please ensure: \n- All room classes have prices\n- Prices must be numbers\n- No empty cells`
            );
        } else {
            setTempData(data);
            console.log('Pricing data validated successfully');
        }
    };

    const uploadWeekendPrices = () => {
        setOpen(true);
        const timeout = setTimeout(() => {
            setShowSecondaryMessage(true);
        }, 5000);
        console.log("file", file)
        if (file) {
            setIsUpdateWithRatesButton(true)
            const formData = new FormData();
            formData.append('file', file); // `file` should be a File object from input
            formData.append('StartDate', format(new Date(watch('fromDate')), 'yyyy-MM-dd'));
            formData.append('EndDate', format(new Date(watch('toDate')), 'yyyy-MM-dd'));
            formData.append('IsDynamic', isDynamic);


            fetchx(API_URL + "/uploadWeekendExcel", {
                method: "POST",
                // headers: { 'Content-Type': 'application/json' },
                body: formData,
            }).then((res) => res.json())
                .then(response => {
                    if (response.statusCode === 200) {
                        // setIsUpdateWithRatesButton(false)
                        // setOpen(false);
                        handleSuccess("Successfully uploaded the file !!");
                    }
                    else{
                        handleError(response.message);
                    }
                    setOpen(false);
                    setIsUpdateWithRatesButton(false)

                })




            console.log('Creating reservations with data:', tempData);
        }
        // Call your backend API here
    };


    const defaultColDef = {
        sortable: true,
        resizable: true,
        filter: true,
        flex: 1,
    };

    const cellClickedListener2 = (params) => {
        console.log('Cell clicked', params);
    };


    const fromDate = watch('fromDate');


    //// For Disabling Past Date
    const options = {
        minDate: Today
    };
    const optionsToDate = {
        minDate: (Moment(String(new Date(fromDate))).format('YYYY-MM-DD')) // Set the minimum date as fromDate or today if fromDate is not selected
    };


    // useEffect(() => {
    //     if (tempData && tempData.length > 0) {
    //         const generatedColumnDefs = Object.keys(tempData[0]).map((key, index) => ({
    //             headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'), // Beautify header
    //             field: key,
    //             // editable: true,
    //             pinned: index === 0 ? 'left' : undefined, // Optionally pin first column
    //             width: 150,
    //         }));
    //         setColumnDefs6(generatedColumnDefs);
    //     }
    // }, [tempData]);




    useEffect(() => {
        if (tempData && tempData.length > 0) {
            const generatedColumnDefs = Object.keys(tempData[0]).map((key, index) => {
                let colDef = {
                    headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                    field: key,
                    pinned: index === 0 && isDynamic !== '0' ? 'left' : undefined, // pin first column only if isDynamic !== '0'
                    width: 150,
                    // cellStyle: { textAlign: 'center' },
                    cellStyle: isDynamic !== '0' ? { textAlign: 'center' } : undefined,
                    header: { textAlign: 'center !important' }
                };

                // ✅ Format "From Date" and "To Date" columns
                // if (key === 'From Date' || key === 'To Date') {
                //     colDef.valueFormatter = (params) => {
                //         if (!params.value) return '';
                //         return Moment(params.value).format('DD-MM-YYYY');
                //     };
                //     colDef.cellStyle = { textAlign: 'center' }; // Ensure date columns stay centered

                // }


                return colDef;
            });

            setColumnDefs6(generatedColumnDefs);
        }
    }, [tempData]);


    function DownloadSampleExcelByCondition() {
        if (isDynamic === "1") {
            // DownloadSampleExcel();
            console.log("dynamic")
            DownloadSampleExcelWithDynamicPricing();
        }
        if (isDynamic === "0") {
            console.log("not dynamic")
            DownloadSampleExcel();
            // handleError("Please select 'Yes' for Dynamic Pricing Applicable to download the sample excel.");
        }
        if (!isDynamic) {
            handleError("Please select whether Dynamic Pricing is Applicable to download the sample excel.");
        }
    }


    async function DownloadSampleExcel() {
        try {
            const response = await fetch(API_URL + '/dynamicPricingExcelSample', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const { data } = await response.json();
            console.log('Sample data fetched:', data);

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Weekend Pricing Sample');

            // ✅ Define columns with proper widths
            const columns = [
                // { header: 'From Date', key: 'from_date', width: 15 },
                // { header: 'To Date', key: 'to_date', width: 15 },
            ];

            data.forEach((item) => {
                if (item.roomClass) {
                    columns.push({
                        header: item.roomClass,
                        key: item.roomClass.replace(/\s+/g, '_').toLowerCase(),
                        width: 20,
                    });
                }
            });

            worksheet.columns = columns;

            // ✅ Insert date format row
            const dateFormatRow = worksheet.getRow(1);
            dateFormatRow.font = { bold: true, color: { argb: 'FF000000' } };

            // ✅ Make column headers bold (row 2)
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });

            // ✅ Add empty data rows
            const firstDataRow = 2;
            const totalRows = 100;

            for (let i = 0; i < totalRows; i++) {
                const row = {};
                columns.forEach((col) => (row[col.key] = ''));
                worksheet.addRow(row);
            }

            // ✅ Protect worksheet headers
            worksheet.protect('', {
                selectLockedCells: false,
                selectUnlockedCells: true,
                formatCells: false,
                formatColumns: false,
                formatRows: false,
                insertColumns: false,
                insertRows: false,
                insertHyperlinks: false,
                deleteColumns: false,
                deleteRows: false,
                sort: false,
                autoFilter: false,
                pivotTables: false,
            });

            // ✅ Unlock data cells
            for (let rowNum = firstDataRow; rowNum <= firstDataRow + totalRows - 1; rowNum++) {
                for (let colNum = 1; colNum <= columns.length; colNum++) {
                    const cell = worksheet.getCell(rowNum, colNum);
                    cell.protection = { locked: false };
                }
            }

            // ✅ Lock header rows (row 1 & 2)
            for (let rowNum = 1; rowNum <= 1; rowNum++) {
                for (let colNum = 1; colNum <= columns.length; colNum++) {
                    const cell = worksheet.getCell(rowNum, colNum);
                    cell.protection = { locked: true };
                }
            }

            const fromDateCol = 1;
            const toDateCol = 2;
            const firstRoomCol = 3;

            // ✅ Today's date in YYYY-MM-DD
            // const today = new Date().toISOString().split('T')[0];
            const today = Today;



            // ✅ Numeric validation for room class columns
            for (let colNum = firstRoomCol; colNum <= columns.length; colNum++) {
                for (let rowNum = firstDataRow; rowNum <= firstDataRow + totalRows - 1; rowNum++) {
                    const cell = worksheet.getCell(rowNum, colNum);

                    cell.dataValidation = {
                        type: 'decimal',
                        operator: 'greaterThanOrEqual',
                        showErrorMessage: true,
                        allowBlank: true,
                        errorTitle: 'Invalid Input',
                        error: 'Only numeric values are allowed.',
                        errorStyle: 'stop',
                        formulae: [0],
                    };

                    cell.numFmt = '#,##0';
                }
            }

            // ✅ Download Excel
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'WeekendPricing.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Error downloading sample Excel:', error);
            handleError('Failed to download the sample Excel. Please try again.');
        }
    }


    // With dynamic pricing applicable change
    async function DownloadSampleExcelWithDynamicPricing() {
        try {
            const response = await fetch(API_URL + '/dynamicPricingExcelSample', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const { data } = await response.json();
            console.log('Sample data fetched:', data);

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Dynamic Pricing Sample');

            // Build columns dynamically
            const columns = [{ header: 'Occupancy %', key: 'occupancy', width: 15 }];

            data.forEach((item) => {
                if (item.roomClass) {
                    columns.push({
                        header: item.roomClass,
                        key: item.roomClass.replace(/\s+/g, '_').toLowerCase(),
                        width: 20,
                    });
                }
            });

            worksheet.columns = columns;

            // Make headers bold
            const headerRow = worksheet.getRow(1);
            headerRow.eachCell((cell) => {
                cell.font = { bold: true };
            });


            // Add occupancy ranges from the image (locked)
            const occupancyRanges = [
                '<10%',
                '10% - 15%',
                '15% - 20%',
                '20% - 25%',
                '25% - 30%',
                '30% - 35%',
                '35% - 40%',
                '40% - 45%',
                '45% - 50%',
                '50% - 55%',
                '55% - 60%',
                '60% - 65%',
                '65% - 70%',
                '70% - 75%',
                '75% - 80%',
                '80% - 85%',
                '85% - 90%',
                '90% - 95%',
                '>95%'
            ];

            // Add occupancy ranges and empty data rows
            occupancyRanges.forEach(range => {
                const row = { occupancy: range };
                columns.slice(1).forEach(col => {
                    row[col.key] = ''; // Empty cells for other columns
                });
                worksheet.addRow(row);
            });

            // Add data validation for numbers only in data entry columns
            const firstDataRow = 2; // Row where data starts (after header)
            const lastDataRow = worksheet.rowCount;
            const firstDataCol = 2; // First data column (after occupancy)

            for (let colNum = firstDataCol; colNum <= columns.length; colNum++) {
                worksheet.getColumn(colNum).eachCell({ includeEmpty: true }, (cell, rowNum) => {
                    if (rowNum >= firstDataRow) {
                        cell.dataValidation = {
                            type: 'decimal',
                            operator: 'greaterThan',
                            showErrorMessage: true,
                            errorTitle: 'Invalid Input',
                            error: 'Please enter a number only',
                            errorStyle: 'stop',
                            formulae: [0] // Must be greater than 0
                        };
                    }
                });
            }

            // PROTECTION SETUP:
            // 1. First lock ALL cells by default
            worksheet.eachRow((row, rowNumber) => {
                row.eachCell((cell) => {
                    cell.protection = { locked: true };
                });
            });

            // 2. Unlock only the data cells (not headers or occupancy column)
            const occupancyCol = 1; // Occupancy is first column

            if (worksheet.rowCount >= firstDataRow) {
                for (let rowNum = firstDataRow; rowNum <= lastDataRow; rowNum++) {
                    const row = worksheet.getRow(rowNum);
                    row.eachCell((cell, colNumber) => {
                        // Unlock only if it's not the occupancy column
                        if (colNumber !== occupancyCol) {
                            cell.protection = { locked: false };
                        }
                    });
                }
            }

            // 3. Apply worksheet protection
            worksheet.protect('', {
                selectLockedCells: true,
                selectUnlockedCells: true,
                formatCells: false,
                formatColumns: false,
                formatRows: false,
                insertColumns: false,
                insertRows: true,
                insertHyperlinks: false,
                deleteColumns: false,
                deleteRows: true,
                sort: true,
                autoFilter: true,
                pivotTables: false
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'dynamicPricing.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading sample Excel:', error);
            handleError('Failed to download the sample Excel. Please try again.');
        }
    }


    const handleChange1 = (selectedOption1) => {
        setIsDynamic(selectedOption1.value);
        setReload(true)
        setFileName('');
        setFileData(null);
        setTempData([]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };






    return (
        <div className="container mt-3">
            <Row>
                <Col md='3' sm='12' className='mb-1'>
                    <div className="mb-1">
                        <Label className="form-label" for="fromDate">
                            From Date <spam style={{ color: "red" }}>*</spam>
                        </Label>
                        <Controller
                            control={control}
                            id='fromDate'
                            name='fromDate'
                            render={({ field }) => (
                                <Flatpickr
                                    required
                                    options={options}
                                    placeholder='YYYY-MM-DD'
                                    {...field}
                                    className='form-control'


                                />
                            )}
                        />
                    </div>
                </Col>

                <Col md='3' sm='12' className='mb-1'>
                    <div className='mb-1'>
                        <Label className='form-label' for='toDate'>
                            To Date <spam style={{ color: "red" }}>*</spam>
                        </Label>
                        <Controller
                            control={control}
                            id='toDate'
                            name='toDate'
                            render={({ field }) => (
                                <Flatpickr
                                    required
                                    placeholder='YYYY-MM-DD'
                                    {...field}
                                    options={optionsToDate}
                                    // options={{ allowInput: true }}
                                    className='form-control'

                                />
                            )}
                        />
                    </div>
                </Col>
                <Col md='3' sm='12' className='mb-1'>
                    <div className="mb-1">
                        <Label className="form-label" for="isDynamicApplicable">
                            Is Dynamic Pricing Applicable <spam style={{ color: "red" }}>*</spam>
                        </Label>
                        <Controller
                            required
                            id="isDynamicApplicable"
                            control={control}
                            name="isDynamicApplicable"
                            render={({ field }) => (
                                <Select
                                    required
                                    isClearable
                                    options={isActiveDropDown}
                                    classNamePrefix="select"
                                    theme={selectThemeColors}
                                    className={classnames("react-select")}
                                    {...field}
                                    onChange={handleChange1}
                                />
                            )}
                        />
                    </div>
                </Col>

                <Col md="4" sm="12" className="mb-3">
                    <Label className="form-label" htmlFor="attachments">
                        Upload Inventory Rates For Weekend Pricing <spam style={{ color: "red" }}>*</spam>
                    </Label>

                    <Controller
                        defaultValue=""
                        control={control}
                        name="attachments"
                        render={({ field }) => (
                            <Input
                                type="file"
                                accept=".xlsx, .xls"
                                placeholder={fileName || 'Upload file'}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    field.onChange(e);
                                    if (file) {
                                        if (isDynamic === "1") {
                                            setFileName(file.name);

                                            console.log("dynamic")
                                            handleFileUploadDynamicPricing(e)
                                        }
                                        if (isDynamic === "0") {
                                            setFileName(file.name);

                                            console.log("not dynamic")
                                            handleFileUpload(e); // this sets fileData internally
                                        }
                                        if (!isDynamic) {
                                            setFileName('');
                                            setFileData(null);
                                            e.target.value = ''; // clear the actual file input


                                            handleError("Please select whether Dynamic Pricing is Applicable before uploading.");
                                        }
                                    } else {
                                        setFileName('');
                                        setFileData(null);
                                    }
                                }}

                                innerRef={fileInputRef}
                            />
                        )}
                    />



                </Col>

                <Col md="4" sm="12" className="mb-3">

                    <Button
                        color="primary"
                        className="mt-2"
                        // onClick={DownloadSampleExcel}
                        onClick={() => window.open('/../apps/WeekendPricing', '_blank')}
                    >
                        Verify Weekend Configuration
                    </Button>

                </Col>


                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

                    <Button
                        color="primary"
                        className="mt-2"
                        disabled={!fileData || fileData.length === 0 || !fileName}
                        onClick={() => {
                            // const fromDate = watch("fromDate");
                            // const toDate = watch("toDate");

                            // if (!fromDate || !toDate) {
                            //     handleError("Please select both From Date and To Date before uploading.");
                            //     return;
                            // }
                            if (isDynamic === "1") {
                                console.log("dynamic")
                                handleValidateAndFetchGridDataWithDynamicPricing(fileData)
                            }
                            if (isDynamic === "0") {
                                console.log("not dynamic")
                                handleValidateAndFetchGridData(fileData)
                            }
                            if (!isDynamic) {
                                handleError("Please select whether Dynamic Pricing is Applicable before uploading.");
                            }
                        }}
                    >
                        Upload
                    </Button>

                    <Button
                        color="primary"
                        className="mt-2"
                        // onClick={DownloadSampleExcel}
                        onClick={DownloadSampleExcelByCondition}
                        disabled={!isDynamic}
                    >
                        Download Sample Excel
                    </Button>
                </div>
            </Row>

            {/* AG Grid Section */}
            {tempData && tempData.length > 0 &&
                <div className="ag-theme-alpine mt-4" style={{ height: 500 }}>
                    <AgGridReact
                        ref={gridRef2}
                        rowData={tempData}
                        columnDefs={columnDefs6}
                        defaultColDef={defaultColDef}
                        // pagination={true}
                        // paginationPageSize={10}
                        rowSelection="multiple"
                        animateRows={true}
                        // singleClickEdit={true}
                        onCellClicked={cellClickedListener2}
                        suppressPaginationPanel={true}   // 👈 hide pagination UI

                    />
                </div>
            }
            {/* Create Reservations Button */}
            {tempData && tempData.length !== 0 && <div className="mt-3" style={{ textAlign: 'right' }}>
                <Button
                    color="primary"
                    className="me-1"
                    onClick={uploadWeekendPrices}
                    disabled={isUpdateWithRatesButton}
                >
                    Confirm and Upload
                </Button>
            </div>}

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>Loading data, please wait...</h1>
                    {showSecondaryMessage && (
                        <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                            Loading records... This may take a few seconds if there's a lot of data.
                        </h1>
                    )}
                    <CircularProgress color="inherit" />
                </div>
            </Backdrop>


        </div>
    );
};

export default UploadGuestDetailsPage;
