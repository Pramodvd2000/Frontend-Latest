// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import API_URL from '../../../config';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Label, Accordion, InputGroup, NavLink } from 'reactstrap'
import { useNavigate } from "react-router-dom";
import Moment from 'moment';
import { useForm, Controller } from 'react-hook-form'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import CryptoJS from "crypto-js";


const DailyDetails = ({ data1, toggleModal }) => {

  const [open, setOpen] = useState(false);
  const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
  // On success modal open
  const handleSuccess = () => {
    return MySwal.fire({
      title: 'Daily Details Modification!!',
      text: 'Successfully modified Daily Details',
      icon: 'success',
    })
  }


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

  const [cancel, setCancel] = useState(null)
  const [packages, setPackage] = useState(null)
  const { reset1, handleSubmit, control, watch } = useForm({})

  function Cancel() {
    // Call the toggleModal function to close the modal
    // props.toggleModal();
    toggleModal();
  }
  // useEffect(() => {
  //   let CancelRate = JSON.stringify({
  //     rateCodeID: data1.data1.rateCodeID,
  //     reservationID: data1.data1.id,
  //     tempReservationID: data1.data1.tempReservationID,
  //     fromDate: data1.data1.arrivalDate,
  //     toDate: data1.data1.departureDate,
  //     sharingID: data1.data1.sharingID,
  //     // retriveRate :dailyRatesOld

  //   })
  //   //console.log(CancelRate)
  //   fetchx(API_URL + "/cancelRates", {
  //     // fetchx("http://122.166.2.21:14702/cancelRates", {
  //     method: "PUT",
  //     headers: { 'Content-Type': 'application/json' },
  //     body: CancelRate
  //   }).then(result => result.json())
  //     .then(res => {
  //       //console.log(res)
  //       if (res.statusCode === 200) {
  //         let getDailyDetails = JSON.stringify({
  //           fromDate: data1.data1.arrivalDate,
  //           toDate: data1.data1.departureDate,
  //           reservationID: data1.data1.id,
  //           fullData: null,
  //           checkOld: 1
  //         })
  //         fetchx(API_URL + "/fetchDailyDetails", {
  //           method: "POST",
  //           headers: { 'Content-Type': 'application/json' },
  //           body: getDailyDetails
  //         }).then(result => result.json())
  //           .then(rowData => {
  //             setRowData(rowData['data'])
  //             setCancel(1)
  //             setTimeout(() => {
  //             }, 0);
  //             //console.log(rowData)
  //           }).catch((error) => {
  //             //console.log(error)
  //           })
  //       }
  //     })

  //   fetchx(API_URL + '/getPackageCode')
  //     .then(result => result.json())
  //     .then(resp => {
  //       setPackage(resp['data'])
  //     })

  // }, [data1.data1]);


  let navigate = useNavigate();
  // function App() {
  const [rowData, setRowData] = useState()
  const [onChange, setOnChange] = useState()
  const [details, setDetails] = useState('')
  const [date, setDate] = useState(null)
  const [popUp, setPopUp] = useState();
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedRates, setConfirmedRates] = useState(false);
  const [dailyRatesOld, setDailyRatesOld] = useState()
  const [resData, setResData] = useState()
  const [edit, setEdit] = useState(false)
  const [Today, setToday] = useState()
  const [changeableData, setChangeableData] = useState([])



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
        // const today = new Date(postres['data'][0]['businessDate']);
        const businessToday = (Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD'));
        // const tomorrow = new Date(today);
        // tomorrow.setDate(today.getDate() + 1);
        setToday((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))


        if (postres.statusCode === 200) {
          const newColumnDefs = [
            { headerName: 'Date', field: 'inventory_date', maxWidth: 150, sort: 'asc' },
            { headerName: 'RateCode', field: 'rateCode', suppressSizeToFit: true, maxWidth: 120 },
            { headerName: 'Room Type', field: 'roomType', maxWidth: 130 },
            {
              headerName: 'Package', field: 'packageCode',
              editable: params => {
                // const rateCodeID = params.data.rateCodeID;
                const rateCodeID = params.data.rateCode;
                // if (rateCodeID === 'Rack Rate') {
                if (rateCodeID.trim().toLowerCase() === 'rack rate') {

                  const inventoryDate = Moment(params.data.inventory_date).format('YYYY-MM-DD');
                  const today = businessToday;
                  const isEditable = inventoryDate >= today;
                  if (!isEditable) {
                    handleError("You can't modify for old dates");
                  }
                  return isEditable;
                }
              },
              cellEditor: 'agSelectCellEditor', cellEditorParams: { values: colourCodes }, valueFormatter: (params) => { return lookupValue(colourMappings, params.value) }, filter: 'agSetColumnFilter', maxWidth: 110
            },
            { headerName: 'Total Before Discount', field: 'totalBeforeDiscount', maxWidth: 195 },
            { headerName: 'Total Discount', field: 'totalDiscount', suppressSizeToFit: true, maxWidth: 150 },
            { headerName: 'Total After Discount', field: 'total', suppressSizeToFit: true, maxWidth: 195 },
            {
              headerName: 'Adult', field: 'adults',
              editable: params => {
                const inventoryDate = Moment(params.data.inventory_date).format('YYYY-MM-DD');
                const today = businessToday;
                const isEditable = inventoryDate >= today;
                if (!isEditable) {
                  handleError("You can't modify for old dates");
                }
                return isEditable;
              },
              cellEditor: 'agSelectCellEditor', cellEditorParams: { values: adultCode }, valueFormatter: (params) => { return lookupValue(adultMappings, params.value) }, filter: 'agSetColumnFilter', maxWidth: 110
            },
            {
              headerName: 'Children', field: 'children',
              editable: params => {
                const inventoryDate = Moment(params.data.inventory_date).format('YYYY-MM-DD');
                const today = businessToday;
                const isEditable = inventoryDate >= today;
                if (!isEditable) {
                  handleError("You can't modify for old dates");
                }
                return isEditable;
              },
              cellEditor: 'agSelectCellEditor', cellEditorParams: { values: childCode }, valueFormatter: (params) => { return lookupValue(childMappings, params.value) }, filter: 'agSetColumnFilter', maxWidth: 110
            },
            { headerName: 'BasePrice', field: 'baseprice', maxWidth: 125, },
            { headerName: 'Package Rate', field: 'packageRate', maxWidth: 140, },
            { headerName: 'Extra Adult Rate', field: 'extraadultprice', suppressSizeToFit: true, maxWidth: 170 },
            { headerName: 'Children Rate', field: 'childrenprice', suppressSizeToFit: true, maxWidth: 150 },
            { headerName: 'Source ', field: 'sourceCode', suppressSizeToFit: true, maxWidth: 120 },
            { headerName: 'MarketCode', field: 'marketCode', maxWidth: 120 },

          ]

          setColumnDefs(newColumnDefs);
        }

      })
  }, []);



  useEffect(() => {
    let getDailyDetails = JSON.stringify({
      fromDate: data1.data1.arrivalDate,
      toDate: data1.data1.departureDate,
      reservationID: data1.data1.id,
      fullData: null,
      checkOld: 1
    })
    //console.log(getDailyDetails)
    fetchx(API_URL + "/fetchDailyDetails", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: getDailyDetails
    }).then(result => result.json())
      .then(rowData => {
        // //console.log(hotelID)
        // //console.log(data1['data1']['reservationID'])
        //console.log(rowData['data'])
        setRowData(rowData['data'])
        setConfirmedRates(rowData['data'])
        //console.log(rowData)
      }).catch((error) => {
        //console.log(error)
      })
  }, [])


  useEffect(() => {
  })
  //console.log(details['ETA'])
  //console.log(data1)


  const [updatedrowData, setupdatedRowData] = useState([])

  const gridRef = useRef()

  const colourMappings = {
    EP: 'EP',
    CP: 'CP',
    MAP: 'MAP',
    AP: 'AP'
  }
  const childMappings = {
    0: 0,
    1: 1,
    2: 2,
  }

  const adultMappings = {

    1: 1,
    2: 2,
    3: 3
  }

  const extractKeys = (mappings) => {
    return Object.keys(mappings)
  }

  const lookupValue = (mappings, key) => {
    return mappings[key]
  }

  const colourCodes = extractKeys(colourMappings)
  const childCode = extractKeys(childMappings)
  const adultCode = extractKeys(adultMappings)



  const [columnDefs, setColumnDefs] = useState([])

  //console.log(Today)

  const [columnDefs1, setColumnDefs1] = useState([
    { headerName: 'Date', field: 'inventory_date', maxWidth: 150, sort: 'asc' },
    { headerName: 'RateCode', field: 'rateCode', suppressSizeToFit: true, maxWidth: 120 },
    { headerName: 'Room Type', field: 'roomType', maxWidth: 130 },
    { headerName: 'Package', field: 'packageCode', maxWidth: 110 },


    { headerName: 'RoomRate', field: 'baseprice', maxWidth: 125, },
    { headerName: 'Package Rate', field: 'packageRate', maxWidth: 140, },
    { headerName: 'Total', field: 'total', maxWidth: 100, },

    { headerName: 'Adult', field: 'adults', maxWidth: 110 },
    { headerName: 'Children', field: 'children', maxWidth: 110 },
    { headerName: 'Source ', field: 'sourceCode', suppressSizeToFit: true, maxWidth: 120 },
    { headerName: 'MarketCode', field: 'marketCode', maxWidth: 120 },

  ])


  // For Ezeee
  const [columnDefs2, setColumnDefs2] = useState([
    { headerName: 'Date', field: 'date', maxWidth: 150 },
    { headerName: 'RateCode', field: 'rateCode', suppressSizeToFit: true, maxWidth: 120 },
    { headerName: 'Room Type', field: 'roomType', maxWidth: 130 },
    { headerName: 'Package', field: 'packageCode', maxWidth: 110 },
    { headerName: 'Total Before Discount', field: 'totalBeforeDiscount', maxWidth: 195, },
    { headerName: 'Total Discount', field: 'totalDiscountAmount', maxWidth: 150, },
    { headerName: 'Total After Discount', field: 'totalRate', maxWidth: 195, },

    // { headerName: 'Total', field: 'totalRate', maxWidth: 100, },
    { headerName: 'Adult', field: 'adults', maxWidth: 110 },
    { headerName: 'RoomRate', field: 'roomRate', maxWidth: 125, },
    { headerName: 'Package Rate', field: 'packageRate', maxWidth: 140, },
    { headerName: 'Children', field: 'children', maxWidth: 110 },
    { headerName: 'Source ', field: 'sourceCode', suppressSizeToFit: true, maxWidth: 120 },
    { headerName: 'MarketCode', field: 'marketCode', maxWidth: 120 },

  ])

  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      // editable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ))

  const cellClickedListener = useCallback(event => {
    //console.log('cellClicked', event)
    //console.log(event['data']['date'])
    setDate(event['data']['date'])
    setEdit(true)
  }, [])


  const buttonListener = useCallback(e => {
    gridRef.current.api.deselectAll()
  }, [])



  if (data1.data1.subBookingID != null || data1.data1.subBookingID != 0) {
    useEffect(() => {
      let getDailyDetails = JSON.stringify({
        fromDate: data1.data1.arrivalDate,
        toDate: data1.data1.departureDate,
        reservationID: data1.data1.id,
      })
      fetchx(API_URL + "/getDailyDetailsByDateAndResID", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: getDailyDetails
      }).then(result => result.json())
        .then(res => {
          setResData(res['data'])
          //console.log(res)
        }).catch((error) => {
          //console.log(error)
        })
    }, []);

  }


  const onCellValueChanged = useCallback(event => {
    //console.log('onCellValueChanged', event)
    const changedRowData = event.data;
    console.log(changedRowData)

    const allRows = [];
    // gridRef.current.api.forEachNode(node => {console.log(node.data),allRows.push(node.data)});
    //console.log(allRows)
    // const changedRowData = event.data;
    // allRows.push(changedRowData)
    const requiredKeys = ["id", "packageCode", "adults", "children", "inventory_date", "sharingID", "packageID"]; // Define required keys

    const filteredRowData = Object.fromEntries(
      Object.entries(changedRowData).filter(([key]) => requiredKeys.includes(key))
    );

    allRows.push(filteredRowData);

    // setChangeableData((prevRows) => {
    //   const rowMap = new Map();

    //   // Add previous rows to the map
    //   prevRows.forEach(row => rowMap.set(row.id, row));

    //   // Override with new rows (latest version)
    //   allRows.forEach(row => rowMap.set(row.id, row));

    //   // Convert back to an array
    //   return Array.from(rowMap.values());
    // });

    setChangeableData((prevRows = []) => {
      const rowMap = new Map();

      // Add previous rows to the map
      prevRows.forEach(row => rowMap.set(row.inventory_date, row));

      // Override with new rows (latest version)
      allRows.forEach(row => rowMap.set(row.inventory_date, row));

      // Convert back to an array
      return Array.from(rowMap.values());
    });


    // Send the changed row data as JSON
    //console.log('Changed Row JSON:', JSON.stringify(changedRowData));
    //console.log(event.data.date)
    console.log(gridRef.current.api)
    const ID = event.data.id
    const PCODE = event.data.packageCode
    const adultCount = event.data.adults
    const childCount = event.data.children

    let totCount = 0;
    if (parseInt(event.data.adults) === 3) {
      //console.log("A3")
      totCount = 3
    }
    else if (parseInt(event.data.adults) === 2) {
      //console.log("A2")
      totCount = 4
    }
    //console.log(totCount)
    // For Pop Up     
    if ((parseInt(event.data.adults) + parseInt(event.data.children)) > totCount && parseInt(event.data.adults) != 1) {
      handleError("Invalid Counts")
      setChangeableData([])
      setOnChange()

      let getDailyDetails = JSON.stringify({
        fromDate: data1.data1.arrivalDate,
        toDate: data1.data1.departureDate,
        reservationID: data1.data1.id,
        fullData: allRows,
        checkOld: 1
      })
      fetchx(API_URL + "/fetchDailyDetails", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: getDailyDetails
      }).then(result => result.json())
        .then(rowData => {
          const updatedData = rowData['data'];

          // Collect current grid data
          const gridData = [];
          gridRef.current.api.forEachNode(node => gridData.push(node.data));

          // Find missing data (exists in allRows but not in gridData)
          const missingData = allRows.filter(row =>
            !gridData.some(gridRow => gridRow.id === row.id)
          );

          console.log("Missing Data in Grid:", missingData);

          const finalData = [...updatedData, ...missingData];

          console.log(finalData)
          setRowData(rowData['data'])
          //console.log(rowData)
        }).catch((error) => {
          //console.log(error)
        })
    }
    // For Pop Up     

    else if (data1.data1.rateCode.trim().toLowerCase() !== 'rack rate' && data1.data1.packageCode != PCODE && adultCount.length == undefined && childCount.length == undefined) {
      handleError("You can't modify package for corporates")
      let getDailyDetails = JSON.stringify({
        fromDate: data1.data1.arrivalDate,
        toDate: data1.data1.departureDate,
        reservationID: data1.data1.id,
        fullData: allRows,
        checkOld: 1
      })
      fetchx(API_URL + "/fetchDailyDetails", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: getDailyDetails
      }).then(result => result.json())
        .then(rowData => {
          const updatedData = rowData['data'];

          const gridData = [];
          gridRef.current.api.forEachNode(node => gridData.push(node.data));

          // Find missing data (exists in allRows but not in gridData)
          const missingData = gridData.filter(row =>
            !allRows.some(gridRow => gridRow.inventory_date === row.inventory_date)
          );

          console.log("Missing Data in Grid:", missingData);
          console.log("Data in Grid:", gridData, allRows);

          const finalData = [...updatedData, ...missingData];

          console.log(finalData)

          setRowData(finalData)
          //console.log(rowData)
        }).catch((error) => {
          //console.log(error)
        })
    }
    else {
      //console.log("INNNNNNNNNNNNNNN")
      //   const updatedItem = JSON.stringify({
      //     // id: ID,
      //     packageCode: PCODE,
      //     "packageRate": event.data.packageRate,
      //     "Adults": event.data.adults,
      //     "Childrens": event.data.children,
      //     "inventory_date": event.data.inventory_date,
      //     "rateCodeID": data1.data1.rateCodeID,
      //     "roomTypeID": event.data.roomTypeID,
      //     "reservationID": data1.data1.tempReservationID,
      //     "source": data1.data1.Type,
      //     "basePrice": event.data.baseprice,    
      //     "sharingID": data1.data1.sharingID
      //   })
      //   //console.log(updatedItem)
      //   fetchx(API_URL + `/modifyBookingInfoRates`, { 
      //     // fetchx(`http://122.166.2.21:14702/modifyBookingInfoRates`, {
      //     method: 'PUT',
      //     body: updatedItem,
      //     headers: {
      //       'Content-type': 'application/json'
      //     }
      //   })
      //     .then((res) => res.json())
      //     .then((post) => {
      //       //console.log(post.data)
      //       setDailyRatesOld(post.data)
      //       if (post.statusCode === 200) {
      let getDailyDetail = JSON.stringify({
        fromDate: data1.data1.arrivalDate,
        toDate: data1.data1.departureDate,
        reservationID: data1.data1.id,
        fullData: allRows,
        checkOld: 0,
        //     packageCode: PCODE,


      })
      //console.log(getDailyDetail)
      fetchx(API_URL + "/fetchDailyDetails", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: getDailyDetail
      }).then(result => result.json())
        .then(rowData => {
          //console.log(rowData)
          const updatedData = rowData['data'];

          const gridData = [];
          gridRef.current.api.forEachNode(node => gridData.push(node.data));

          // Find missing data (exists in allRows but not in gridData)
          const missingData = gridData.filter(row =>
            !allRows.some(gridRow => gridRow.inventory_date === row.inventory_date)
          );

          console.log("Missing Data in Grid:", missingData);
          console.log("Data in Grid:", gridData, allRows);

          const finalData = [...updatedData, ...missingData];

          console.log(updatedData)
          console.log(finalData)
          const errorMsg = "Sharer present for that day you can't decrease the adult count";

          if (!finalData.includes(errorMsg)) {
            setRowData(finalData);
          setOnChange(finalData)
          }
          // setRowData(finalData)

          // If Error
          if (typeof (rowData['data'][0]) === 'string') {
            handleError(rowData['data'][0])

            let getDailyDetails = JSON.stringify({
              fromDate: data1.data1.arrivalDate,
              toDate: data1.data1.departureDate,
              reservationID: data1.data1.id,
              fullData: allRows,
              checkOld: 1
            })
            fetchx(API_URL + "/fetchDailyDetails", {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: getDailyDetails
            }).then(result => result.json())
              .then(rowData => {
                const updatedData = rowData['data'];

                const gridData = [];
                gridRef.current.api.forEachNode(node => gridData.push(node.data));

                // Find missing data (exists in allRows but not in gridData)
                const missingData = gridData.filter(row =>
                  !allRows.some(gridRow => gridRow.inventory_date === row.inventory_date)
                );

                console.log("Missing Data in Grid:", missingData);
                console.log("Data in Grid:", gridData, allRows);

                const finalData = [...updatedData, ...missingData];

                console.log(finalData)
                setRowData()

                setRowData(finalData)
                // setRowData(rowData['data'])
                //console.log(rowData)
              }).catch((error) => {
                //console.log(error)
              })
          }
          //console.log(rowData)
        }).catch((error) => {
          //console.log(error)

        })
    }
    //       else {
    //         setPopUp(post.message)

    //         if (post.message) {
    //           let getDailyDetails = JSON.stringify({
    //             fromDate: data1.data1.arrivalDate,
    //             toDate: data1.data1.departureDate,
    //             reservationID: data1.data1.id,
    //           })
    //           fetchx(API_URL + "/fetchDailyDetails", {
    //             method: "POST",
    //             headers: { 'Content-Type': 'application/json' },
    //             body: getDailyDetails
    //           }).then(result => result.json())
    //             .then(rowData => {
    //               setRowData(rowData['data'])
    //               //console.log(rowData)
    //             }).catch((error) => {
    //               //console.log(error)
    //             })
    //         }

    //       }
    //     })
    //     .catch((err) => {
    //       //console.log(err.message)
    //     })
    // }
    setEdit(true)
  }, [])


  console.log(changeableData)

  // // To retrive rates
  // function CancelRates() {
  //   // //console.log('cellClicked', event)
  //   // //console.log(rowData[0]['inventory_date']

  //   let CancelRate = JSON.stringify({
  //     rateCodeID: data1.data1.rateCodeID,
  //     reservationID: data1.data1.id,
  //     tempReservationID: data1.data1.tempReservationID,
  //     fromDate: data1.data1.arrivalDate,
  //     toDate: data1.data1.departureDate,
  //     sharingID: data1.data1.sharingID,
  //     // retriveRate :dailyRatesOld

  //   })
  //   //console.log(CancelRate)
  //   fetchx(API_URL + "/cancelRates", {
  //     // fetchx("http://122.166.2.21:14702/cancelRates", {
  //     method: "PUT",
  //     headers: { 'Content-Type': 'application/json' },
  //     body: CancelRate
  //   }).then(result => result.json())
  //     .then(res => {
  //       //console.log(res)
  //       if (res.statusCode === 200) {
  //         let getDailyDetails = JSON.stringify({
  //           fromDate: data1.data1.arrivalDate,
  //           toDate: data1.data1.departureDate,
  //           reservationID: data1.data1.id,
  //           fullData: null,
  //           checkOld: 1
  //         })
  //         fetchx(API_URL + "/fetchDailyDetails", {
  //           method: "POST",
  //           headers: { 'Content-Type': 'application/json' },
  //           body: getDailyDetails
  //         }).then(result => result.json())
  //           .then(rowData => {
  //             setRowData(rowData['data'])
  //             setTimeout(() => {
  //               gridRef.current.refreshCells({ force: true }); // Refresh the grid
  //             }, 0);
  //             //console.log(rowData)
  //           }).catch((error) => {
  //             //console.log(error)
  //           })
  //       }
  //     })
  //   // .catch((error) => {
  //   // //console.log(error)
  //   // })

  // }




  // Final Submit
  function ConfirmRates() {
    let confirmRate = JSON.stringify({
      tempReservationID: data1.data1.tempReservationID,
      reservationID: data1.data1.id,
      sharingID: data1.data1.sharingID
    })
    //console.log(confirmRate)
    fetchx(API_URL + "/updateDailyDetailsRates", {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: confirmRate
    }).then(result => result.json())
      .then(res => {
        //console.log(res)
        if (res.statusCode === 200) {
          // setPopUp("Rates Updated Successfully")
          setTimeout(() => { navigate('/dashboard/frontdesk'); }, 200)

        }
      })
  }

  // PopUp
  function ConfirmSetData() {
    // let getDailyDetails = JSON.stringify({
    //   fromDate: data1.data1.arrivalDate,
    //   toDate: data1.data1.departureDate,
    //   reservationID: data1.data1.id,
    //   fullData: null,
    //   checkOld: 1
    // })
    // fetchx(API_URL + "/fetchDailyDetails", {
    //   method: "POST",
    //   headers: { 'Content-Type': 'application/json' },
    //   body: getDailyDetails
    // }).then(result => result.json())
    //   .then(rowData => {
    //     setConfirmedRates(rowData['data'])
    //     //console.log(rowData['data'])
    //   }).catch((error) => {
    //     //console.log(error)
    //   })
    setConfirmedRates(onChange)

    { confirmedRates && setConfirmed(true) }
  }

  //console.log(onChange)

  function ConfirmFinalSubmit() {

    //console.log(open)
    setOpen(true)
    //console.log(open)

    const timeout = setTimeout(() => {
      setShowSecondaryMessage(true);
    }, 5000);




    // let getDailyDetails = JSON.stringify({
    //   finalJson: onChange,
    //   hotelID: 1,

    // })

    function encryptData(data, secretKey) {
      // Using CryptoJS for encryption (you'll need to import this library)
      const jsonString = JSON.stringify(data);
      // Use AES encryption
      const encrypted = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
      return encrypted;
    }

    // Then modify your original code to use encryption
    let getDailyDetails = JSON.stringify({
      finalJson: changeableData,
      hotelID: 1,
    });
    console.log(getDailyDetails)
    fetchx(API_URL + "/updateDailyDetailsRates", {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: getDailyDetails
    }).then(result => result.json())
      .then(rowData => {
        // setConfirmedRates(rowData['data'])
        //console.log(rowData)
        if (rowData.statusCode === 200) {
          // setOpen(false)
          handleSuccess()
          setTimeout(() => { navigate('/dashboard/frontdesk'); }, 200)

        }
        else {
          // setOpen(false)
          setShowSecondaryMessage(true)
          handleError("Error Occured")
        }
      }).catch((error) => {
        //console.log(error)
      })
    { confirmedRates && setConfirmed(true) }
  }



  function ModifPackage() {
    //console.log("Hello")
    let confirmRate = JSON.stringify({

      sharingID: data1.data1.sharingID,
      packageID: watch('packageID1').value,
      rateCodeID: data1.data1.rateCodeID,
      tempReservationID: data1.data1.tempReservationID,
      reservationID: data1.data1.id
    })
    //console.log(confirmRate)
    // fetchx("http://122.166.2.21:14702/modifyAllDayPackage", {
    fetchx(API_URL + "/modifyAllDayPackage", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: confirmRate
    }).then(result => result.json())
      .then(res => {
        //console.log(res)
        if (res.statusCode === 200) {
          // setPopUp("Rates Updated Successfully")
          let getDailyDetails = JSON.stringify({
            fromDate: data1.data1.arrivalDate,
            toDate: data1.data1.departureDate,
            reservationID: data1.data1.id,
          })
          fetchx(API_URL + "/fetchDailyDetails", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: getDailyDetails
          }).then(result => result.json())
            .then(rowData => {
              //console.log(rowData)
              setRowData(rowData['data'])
              setConfirmedRates(rowData['data'])
              setTimeout(() => {
                gridRef.current.refreshCells({ force: true }); // Refresh the grid
              }, 0);
              //console.log(rowData)

            }).catch((error) => {
              //console.log(error)
            })
          setConfirmed(true)

        }
        else {
          handleError(res.message)
        }

      })
  }


  return (
    <div>
      {(data1.data1.subBookingID === null || data1.data1.subBookingID === 0) && <div>
        <div className="ag-theme-alpine" style={{ height: 320 }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            animateRows={true}
            rowSelection='multiple'
            onCellClicked={cellClickedListener}
            onCellValueChanged={onCellValueChanged}
            singleClickEdit={true}
            paginationPageSize='10'
            pagination='true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"

          />
        </div>
        <br></br>
        {/* <Col md='4' sm='5'>
          <div className='mb-1'>
            <Label className='form-label' for='packageID1'>
              <h4> Modify all day package </h4>
            </Label>
            <Controller
              id='packageID1'
              control={control}
              name='packageID1'
              render={({ field }) => (
                <Select
                  required
                  options={packages}
                  // disabled={isSubmitted}
                  isClearable
                  classNamePrefix='select'
                  theme={selectThemeColors}
                  className={classnames('react-select')}
                  {...field}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    setEdit(false); // Set setEdit to false when the value changes
                  }}                                                // value={edit===true ? null : field.value}
                />
              )}
            />
          </div>
        </Col> */}
        {/* <Row className="justify-content-center">
        <Col md='6' className="text-center">
          <Button className='me-1' color='primary' onClick={ConfirmSetData}>
            Proceed
          </Button>
          <Button className='me-1' outline onClick={CancelRates}>
            Reset
          </Button>
        </Col>
      </Row> */}
        <div className="d-flex flex-row justify-content-center">
          {(edit === true || (watch('packageID1') === undefined || watch('packageID1') === null)) ?
            <Button className='me-1' color='primary' onClick={() => onChange !== undefined ? ConfirmSetData() : handleError("No data is modified")}>
              Proceed
            </Button>
            :
            <Button className='me-1' color='primary' onClick={ModifPackage}>
              Submit
            </Button>}
          <Button className='me-1' outline onClick={Cancel}>
            Cancel
          </Button>
        </div>

        <Modal isOpen={confirmed} toggle={() => setConfirmed(!confirmed)} className='modal-xl'
        > {/*onClosed={onDiscard}*/}
          <ModalHeader className='modal-xl' toggle={() => {
            setConfirmed(!confirmed);
          }}>Confirm Rates..</ModalHeader>
          <ModalBody className='pb-3 px-sm-2 mx-20'>
            <div>
              <div className="ag-theme-alpine" style={{ height: 320 }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={confirmedRates}
                  columnDefs={columnDefs1}
                  animateRows={true}
                  rowSelection='multiple'
                  onCellClicked={cellClickedListener}
                  singleClickEdit={true}
                  paginationPageSize='10'
                  pagination='true'
                  defaultColDef={defaultColDef}
                  headerColor="ddw-primary"

                />
              </div>
              <br></br>
              <Row className="justify-content-center">
                <Col md='6' className="text-center">
                  <Button className='me-1' color='primary' onClick={ConfirmFinalSubmit} > {/*onClick={ConfirmRates}*/}
                    Update Rates
                  </Button>
                  <Button className='me-1' outline color='danger' onClick={() => { CancelRates(), setConfirmed(false) }} >
                    Close
                  </Button>
                </Col>
              </Row>


              <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                    Please wait while we are updating your reservation
                  </h1>
                  {showSecondaryMessage && (
                    <h1 style={{ fontWeight: 'bold', color: 'white' }}>
                      We're processing your request, which may take a little longer due to additional data. Please be patient!
                    </h1>
                  )}
                  <CircularProgress color="inherit" />
                </div>
              </Backdrop>

            </div>
          </ModalBody>
        </Modal>
      </div>}

      {(data1.data1.subBookingID != null) && resData &&
        <div className="ag-theme-alpine" style={{ height: 320 }}>
          <AgGridReact
            ref={gridRef}
            rowData={resData}
            columnDefs={columnDefs2}
            animateRows={true}
            rowSelection='multiple'
            onCellClicked={cellClickedListener}
            onCellValueChanged={onCellValueChanged}
            singleClickEdit={true}
            paginationPageSize='10'
            pagination='true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"

          />
        </div>
      }






      {popUp &&
        <div className='disabled-animation-modal'>
          <Modal isOpen={popUp} toggle={() => setPopUp(!popUp)} className='modal-sm' >
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
  )
}
export default DailyDetails;