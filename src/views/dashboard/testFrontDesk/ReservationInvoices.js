
// ** React Imports
import { useState } from "react";
// ** Third Party Components;
import "cleave.js/dist/addons/cleave-phone.us";
import { format, addDays } from 'date-fns';
import classnames from "classnames";
import 'ag-grid-enterprise'
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
import API_URL from "../../../config";
import {Input,Card,Form,Label,Button,CardBody,CardTitle,CardHeader,InputGroup,InputGroupText,Row,Col,Modal,ModalBody,
    ModalHeader,
  } from "reactstrap";
  import Moment from 'moment'
  import { useForm, Controller } from "react-hook-form";

import toast from "react-hot-toast";
import { Check } from "react-feather";
import Avatar from "@components/avatar";
import { useNavigate } from "react-router-dom";
let TodayDate =[]
let is_test = false
const AvailabilityMatrix = () => {
    const navigate = useNavigate()

   
    // AG Grid
    const [rowData, setRowData] = useState();
    const [ConfirmInvReinstate, setConfirmInvReinstate] = useState(false)
    const [SelectedRow, setSelectedRow] = useState([])
    const [showErrorMsg,setshowErrorMsg] = useState(false)
    const [errorMsg,seterrorMsg] = useState('')
    const [ReasonSelect, setReasonSelect] = useState(false)
    const [ReasonCode,setReasonCode] =  useState()
    const [reasonCodeData,setreasonCodeData] = useState('')
    const [ReasonID,setReasonID] = useState('')
    const [ShowInvPDF,setShowInvPDF] = useState('')
    const [InvURL,setInvURL] = useState([])
    const [ReasonRemarks,setReasonRemarks] = useState('')
    const [ReloadReasonRemarks,setReloadReasonRemarks] = useState(true)
    const [Today,setToday] = useState([])
    const gridRef = useRef();
    const gridRef1 = useRef()
    const gridOptions = {
      defaultColDef: {
        flex: 1,
        minWidth: 150,
        filter: true,
        sortable: true,
        filterParams :{
          buttons : ['apply','reset']
          }
        // floatingFilter: true,
             
  
      },
  
    };

    useEffect(() => {
      fetchx(API_URL + "/getBusinessDate", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelID: 1,
            })
      }).then(result => result.json())
      .then(resp => {
          console.log(resp['data'])
          console.log(resp['data'][0]['businessDate'])
          setToday(resp['data'][0]['businessDate'])
          TodayDate = resp['data'][0]['businessDate']
        }).catch((error) => {
          console.log(error)
        })
    },[])
    const { reset, handleSubmit, control } = useForm({  })
    const reasonSelectListener = useCallback(event => {
        //console.log(event['data'])
      
        setReasonCode(event['data']['reasonCode'])
        setReasonRemarks(event['data']['description'])
        setReloadReasonRemarks(false)
        setTimeout(()=>{setReloadReasonRemarks(true)},10)
        setReasonID(event.data.id)
        setReasonSelect(!ReasonSelect)
    
      })
    const fetchxReasonCodeData =()=>{

        fetchx(API_URL + "/getReasonCodes", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelID: 1,
            groupID:7
              })
        }).then(result => result.json())
        .then(rowData => {
            //console.log(rowData['data'])
            setreasonCodeData(rowData['data'])
          }).catch((error) => {
            //console.log(error)
          })
        setReasonSelect(!ReasonSelect)
      }

      const [reasonCodecolumnDefs] = useState([
        { headerName: 'reasonCode', field: 'reasonCode', maxWidth:300 },
      
        { headerName: 'description', field: 'description' },
      
        {
          headerName: "Action",
          maxWidth: 140,
          cellRenderer: (event) => {
            return (<Button color='primary' onClick={()=>{setReasonSelect(!ReasonSelect)
                                                          setReasonID(event.data.id)
                                                                                    }}>Select</Button>)
          }
        },
      ])

      const getRowStyle = params => {
        //console.log(params)
        if (params.data && params.data.isCancelled === 1) {
          return { background: '#3598db' };
        }
        return null;
      };
    const [columnDefs, setColumnDefs] = useState([
        // {headerName: 'ID',field: 'id',suppressSizeToFit: true,maxWidth: 160},
        // {headerName: 'Hotel ID',field: 'hotelID',suppressSizeToFit: true},
        // {headerName: 'Room ID',field: 'roomID'},
        { headerName: 'ID', field: 'id', suppressSizeToFit: true, maxWidth: 100 },
        { headerName: 'Hotel ID', field: 'hotelID', maxWidth: 100 },
        { headerName: 'Invoice No', field: 'billNoDisplay', maxWidth: 130 },
        {
            headerName: 'Reinstate Invoice', cellRendererFramework: (params) => <Button color='primary' disabled = {!(params.data.invoiceDate == TodayDate)} style={{ width: 140 }} onClick={() => {
                if(Today!=[]){
                  console.log(TodayDate)
              console.log((params.data.invoiceDate) , TodayDate)
              setSelectedRow(params.data)
                setConfirmInvReinstate(true)
}

            }} >Reinstate Invoice</Button>, suppressSizeToFit: true, maxWidth: 180
        },
        {
            headerName: 'View Invoice', cellRendererFramework: (params) => <Button color='primary' style={{ width: 140 }} onClick={() => {
                // setSelectedRow(params.data)
                getFinalInvoice(params.data)


            }} >View Invoice</Button>, suppressSizeToFit: true, maxWidth: 180
        },
        { headerName: 'roomNumber', field: 'roomNumber', maxWidth: 100 },
        { headerName: 'guestName', field: 'guestName', maxWidth: 180 },
        { headerName: 'CompanyName', field: 'ResCompanyName', maxWidth: 180 },
        { headerName: 'invoiceAmount', field: 'invoiceAmount', maxWidth: 130 },
        { headerName: 'bookingID', field: 'bookingID', maxWidth: 100 },
        { headerName: 'invoiceDate', field: 'invoiceDate', maxWidth: 130 },
        { headerName: 'SettlementType', field: 'SettlementType', maxWidth: 160 },
        { headerName: 'BTCCompanyName', field: 'BTCCompanyName', maxWidth: 190 },
        { headerName: 'AgentName', field: 'AgentName', maxWidth: 190 },
        { headerName: 'Cancelled', field: 'isCancelled', maxWidth: 100 },
        { headerName: 'Folio No', field: 'folioID', maxWidth: 100 },


    ]);
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
        //console.log('cellClicked', event);
    }, []);

    useEffect(() => {



      if(localStorage.getItem('reservationID')!=null){
        //console.log('Setting reservationID in session storage',localStorage.getItem('reservationID'))
        sessionStorage.setItem('reservationID',localStorage.getItem('reservationID'))
        localStorage.removeItem('reservationID')
      
      }

        fetchx(API_URL + '/getInvoicesOfRes?hotelID=1&reservationID=' + sessionStorage.getItem('reservationID'))
            .then(result => result.json())
            .then(rowData => {
                // for(let i=0; i<10;i++){
                //console.log(rowData['data'])

                setRowData(rowData['data'])
            }
            )

    }, [Today]);


    // ** State
    const [data, setData] = useState(null);
    const getFinalInvoice =(data)=>{
      if(!is_test){
     
        fetchx(API_URL + "/gets3DocumentIDPMS", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelID: 1,
            DocName:'PMSInvoice',
            transactionID:'',
            reservationID:sessionStorage.getItem('reservationID'),
            billNo:data.billNo
              })
        }).then(result => result.json())
        .then(resp => {
            //console.log(resp)
            if(resp.statusCode==200){
              //console.log(resp)
              setInvURL(API_URL+'/images/'+resp['data'])
              //console.log(API_URL+'/images/'+resp['data'])
              setShowInvPDF(true)

              // setTimeout(()=>{navigate('/dashboard/testFrontDesk')
              // const newTab = window.open('about:blank', '_blank');
              //  newTab.location.href = API_URL+'/images/'+resp['data']
              // },1000)
            }
            
          }).catch((error) => {
            //console.log(error)
          })
        // setInvURL(rowData['url'])
        // setShowInvPDF(true)


      
        //Live server
  // let url = API_URL+'/getinvoices/PMSInvoice_'+sessionStorage.getItem('reservationID')+'_'+data.billNo+'.pdf'
 
        // let url = 'http://122.166.2.21//PMS_Invoice/Invoice/PMSInvoice_'+data['reservationID']+'_'+data['billNo']+'.pdf'
        // //console.log(url)
        // setInvURL(url)
        // setShowInvPDF(true)
        //       fetchx(API_URL +'/getInvoices?')
        //   .then(result => result.json())
        //   .then(rowData => {
        //     //console.log(rowData)
      
        //     if(rowData.statuscode==200){
             
            //   //console.log(rowData['url'])
            //   setInvURL(rowData['url'])
              // setShowInvPDF(true)
      
        //     }else{
        //         seterrorMsg(rowData.message)
        //         setshowErrorMsg(!showErrorMsg)
              
      
        //     }
        //   }).catch((error) => {
        //     //console.log(error)
        //   })
      }else{
        setInvURL(API_URL+'/imagepaths/PMS_Invoice/Invoice/PMSInvoice_'+data['reservationID']+'_'+data['billNo']+'.pdf')
              setShowInvPDF(true)

      }
      }
    const ReinstateInvoice = (data) => {
      setReasonRemarks(data.reasonRemarks)
        //console.log('Folio Reinstate')
        fetchx(API_URL + "/reInstateFolio", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hotelID: 1,
                reservationID: sessionStorage.getItem('reservationID'),
                roomID: sessionStorage.getItem('roomID'),
                folioNo:SelectedRow['folioID'],
                reasonID:ReasonID,
                reasonRemarks:ReasonRemarks
            })
        }).then(result => result.json())
            .then(resp => {
                //console.log(resp)
                if (resp.statusCode == 200) {
                    toast(
                        <div className="d-flex">
                            <div className="me-1">
                                <Avatar size="sm" color="success" icon={<Check size={12} />} />
                            </div>
                            <div className="d-flex flex-column">
                                <h6>Folio Reinstated Successfully</h6>
                                {/* <h4>Wait-List Added Successfully</h4> */}
                            </div>
                        </div>
                    );
                    setTimeout(() => { navigate('/dashboard/frontdesk') }, 1000)
                } else {
                    //set error msg
                    seterrorMsg(resp.message)
                    setshowErrorMsg(!showErrorMsg)
                    setConfirmInvReinstate(false)
                }

            }).catch((error) => {
                //console.log(error)
            })
    }

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef1.current.api.setQuickFilter(
          document.getElementById('filter-text-box').value
        )
      }, [])

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag="h4"><b>Invoices</b></CardTitle>
                </CardHeader>
            </Card>
            <div className="ag-theme-alpine" style={{ height: 460 }}>
                <AgGridReact
                    ref={gridRef}
                    // getRowStyle={getRowStyle}

                    rowData={rowData} columnDefs={columnDefs}
                    animateRows={true} rowSelection='multiple'
                    onCellClicked={cellClickedListener}
                    // paginationAutoPageSize = 'true'
                    paginationPageSize='10'
                    pagination='true'
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"

                />
            </div>
            {/* <App/> */}
            <Modal isOpen={ConfirmInvReinstate} toggle={() => setConfirmInvReinstate(!ConfirmInvReinstate)} className='modal-dialog-centered'>
                <ModalHeader className='modal-dialog-centered' toggle={() => setConfirmInvReinstate(!ConfirmInvReinstate)}>Do you want to ReInstate Invoice {SelectedRow['billNoDisplay']} ?</ModalHeader>
                <ModalBody >

                    <div>

                        <h5><b></b></h5>
                        {SelectedRow && <><h6>Guest Name : <b>{SelectedRow['guestName']}</b></h6>
                            <h6>Invoice No:   <b>{SelectedRow['billNoDisplay']}</b></h6>
                            <h6>Invoice Amount: <b>{SelectedRow['invoiceAmount']}</b></h6>
                            <h6>Invoice Date: <b>{SelectedRow['invoiceDate']}</b></h6>
                            <h6>Booking ID: <b>{SelectedRow['bookingID']}</b></h6>
                        </>}
                        <br></br>
                        <Form onSubmit={handleSubmit(ReinstateInvoice)}>
                        <Row>
          <Col md='6' sm='12' className='mb-1'>
       
                <Label className="form-label">
                Reason Code
                <Input required type="text" name='TransactionCode' value={ReasonCode}  onClick={fetchxReasonCodeData}/>
                </Label>
                </Col>
          {ReloadReasonRemarks && <Col md='6' sm='12' className='mb-1'>
          <div className="mb-1">
            <Label className="form-label" for="reasonRemarks">
            Reason Remarks
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
                name="reasonRemarks"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    defaultValue={ReasonRemarks}
                    // onChange={checkisCode}
                    id="reasonRemarks"
                    pattern="[Aa-Zz]*" title="Only Alphabets Allowed" required
                    // placeholder="Enter Store ID"
                    className={classnames("form-control", {
                      "is-invalid": data !== null && data.reasonRemarks === null,
                    })}
                  />
                )}
              />
            </InputGroup>
          </div>
          </Col>}
          </Row>
                        <div className="d-flex">

                            <Button className="me-1" color="primary" type='submit'>
                                Confirm
                            </Button>
                            <Button className="me-1" color="primary" onClick={() => {
                                setConfirmInvReinstate(false)
                            }}>
                                Cancel
                            </Button>


                        </div>
                        </Form>
                    </div>
                </ModalBody>
            </Modal>

            <Modal
        isOpen={showErrorMsg}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader className='bg-transparent' toggle={() => {
                setshowErrorMsg(!showErrorMsg);
              }}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h3 className='text-center mb-1'>{errorMsg}</h3>
          
            
          <div className="d-flex">
              <Button
               color='primary'
                onClick={() => {
                // window.location.reload()
                setshowErrorMsg(!showErrorMsg)
              }}
              >
                OK
              </Button>
           </div>

        </ModalBody>
      </Modal> 

             {/* Select Reason */}
             <Modal
        isOpen={ReasonSelect}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered modal-lg'
      >
        <ModalHeader className='bg-transparent' toggle={() => {
                setReasonSelect(!ReasonSelect);
              }}></ModalHeader>
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
                                    overlayNoRowsTemplate={'No record found'}
                                    ref={gridRef1}
                                    rowData={reasonCodeData}
                                    columnDefs={reasonCodecolumnDefs}
                                    animateRows={true}
                                    onCellClicked={reasonSelectListener}
                                    paginationPageSize='10'
                                    pagination='true'
                                    defaultColDef={defaultColDef}
                                    headerColor="ddw-primary"
                                    gridOptions={gridOptions}
                                  />
                                  </div>

              </ModalBody>
                  
                  </Modal>

                  <Modal isOpen={ShowInvPDF} toggle={() => setShowInvPDF(!ShowInvPDF)} style={{height:'200px'}} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowInvPDF(!ShowInvPDF)}>PMS Invoice</ModalHeader>
       
          <iframe style={{ height: '85vh' }} src={InvURL}> </iframe>
      </Modal>
        </div>
    );
};

export default AvailabilityMatrix;





