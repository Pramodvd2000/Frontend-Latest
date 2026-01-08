
// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Button, Form, Label, Input, InputGroup, InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardTitle, CardBody, Row, Col } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Moment from 'moment'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import { useNavigate } from "react-router-dom"
import API_URL from '../../../../config';
import { tr } from 'date-fns/locale';
import Swal from 'sweetalert2'
import CompanyProfile from '../../reservation/companyProfile/index'
import AddBooker from '../../reservation/companyProfile/booker'

import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const defaultValues6 = {
    eta: '',
    etd: '',
    resType: null,
    origin: '',
    agent: null,
    source: null,
    booker: null,
    features: null,
    package: '',
    market: null,
    comment: '',
    billingInstructions: '',
}


const ModifyBookingInfoForRes = ( { data1, onClose, callDefiniteReservation } ) => {
     console.log(data1)

    const defaultValues = {
        eta: '',
        etd: '',
        extras: null,
        resType: null,
        origin: null,
        agent: null,
        source: null,
        booker: null,
        features: null,
        package: '',
        market: null,
        comment: '',
        billingInstructions: '',
        companyID: ''
    }


    let navigate = useNavigate();
    const [data, setData] = useState(null)
    const { reset, handleSubmit, control, formState: { errors }, watch } = useForm({ defaultValues })
    const [resTypeValue, setResTypeValue1] = useState(data1.reservationTypeID);
    const [originValue, setOriginValue] = useState(data1.originID);
    const [payment, setPayment] = useState(data1.paymentTypeID);
    const [accountManagerValue, setAccountManagerValue] = useState(data1.accountManagerID);
    const [agentValue, setAgentValue] = useState(data1.agentID);
    const [sourceValue, setSourceValue] = useState(data1.sourceID);
    const [bookerValue, setBookerValue] = useState(data1.bookerID);
    const [bookerLabel, setBookerLabel] = useState(data1.bookerName);
    const [selectedCompany, setSelectedCompany] = useState(() => {
        const accountName = data1.accountName;
        if (accountName && accountName.includes('C-')) {
            return accountName.split('C-')[1].split('TA-')[0].trim().replace(',', '');
        }
        return null;
    });

    const [agentLabel, setAgentLabel] = useState(() => {
        const accountName = data1.accountName;
        if (accountName && accountName.includes('TA-')) {
            return accountName.split('TA-')[1].trim();
        }
        return null;
    });

    const [marketValue, setMarketValue] = useState(data1.marketID)
    const [commentValue, setCommentValue] = useState(data1.comments)
    const [billingValue, setBillingValue] = useState(data1.billingInstruction)
    const [etaValue, setETAValue] = useState(data1.ETA)
    const [etdValue, setETDValue] = useState(data1.ETD)
    const [GroupName, setGroupNameValue] = useState(data1.groupName)
    const [bookerModal, setBookerModal] = useState(false);
    const [agentModal, setAgentModal] = useState(false);
    const [rowData, setRowData] = useState();
    const [company, setCompany] = useState();
    const [rowData2, setRowData2] = useState();
    const [accounts, setAccounts] = useState([])
    const [Agent, setAgent] = useState([])
    const [sourceCode, setSourceCode] = useState([])
    const [marketCode, setMarketCode] = useState([])
    const [Booker, setBooker] = useState([])
    const [companyModal, setCompanyModal] = useState(false)
   // const [selectedCompany, setSelectedCompany] = useState(data1.accountName);
    const [selectedCompanyID, setSelectedCompanyID] = useState(data1.companyID);
    const [companyProfile, setCompanyProfile] = useState(false)
    const [addBookerModal, setAddBookerModal] = useState(false)
    const [reload, setReload] = useState(true);
    const [ReservationTypes, setReservationTypeOption] = useState(true);
    const [Origin, setOriginOption] = useState(true);
    const [paymentOption, setPaymentOption] = useState(true);
    const [accountManagerOption, setAccountManagerOptions] = useState(true);
    const gridRef = useRef();
    const gridRef2 = useRef();
    const gridRef3 = useRef();
    const [yesterday, setYesterday] = useState()
    const [defaultYesterday, setDefaultYesterday] = useState()
    const [arrivalDate, setArrivalDate] = useState(data1.cutOfDate);
    const [extraName, setExtraName] = useState([])
    const [Features, setFeatures] = useState([])
    const [groupNameModal, setGroupNameModal] = useState(false);
    const [selectedGroupName, setSelectedGroupName] = useState();
    const [groupNameData, setGroupNameData] = useState()
    const gridRef1 = useRef()

    const [tempReservationModal, setTempReservationModal] = useState(false);
    const [tempReservationData, setTempReservationData] = useState([]);
    const [selectedReservations, setSelectedReservations] = useState([]);

    //console.log("selectedReservations",selectedReservations)

    const ExtraFromDatabase = data1.extra ? data1.extra.split(",").map((extra) => extra.trim()) : [];
    const ExtraIDFromDatabase = data1.extraID ? data1.extraID.split(",").map((id) => parseInt(id)) : [];
    const isExtra = ExtraFromDatabase != undefined && ExtraIDFromDatabase != undefined;
    const preferenceFromDatabase = data1.preference ? data1.preference.split(",").map((preference) => preference.trim()) : [];
    const preferenceIDFromDatabase = data1.preferenceID ? data1.preferenceID.split(",").map((id) => parseInt(id)) : [];
    const isPreference = preferenceFromDatabase != undefined && preferenceIDFromDatabase != undefined;

    const defaultReason = isExtra ? ExtraFromDatabase.map((extra, index) => ({
        value: parseInt(ExtraIDFromDatabase[index]),
        label: extra,
    })) : [];

    const [extraValue, setExtraOption] = useState(defaultReason.map((option) => option.value));


    const defaultReason6 = isPreference ? preferenceFromDatabase.map((preference, index) => ({
        value: parseInt(preferenceIDFromDatabase[index]),
        label: preference,
    })) : [];

    const [preferenceValue, setPreferenceValue] = useState(defaultReason6.map((option) => option.value));



    // ExtraS
    const handleChange = (selectedOption) => {
        const selectedIds = selectedOption.map(option => option.value);
        setExtraOption(selectedIds);
    };

    const handleGroupNameClear = () => {
        setSelectedGroupName()
    };

    
    
  const toggleTempReservationModal = () => {
    setTempReservationModal(prev => !prev);
    
    // Reset selectedReservations when closing the modal
    if (tempReservationModal) {
      setSelectedReservations([]);
    }
  };

  const tempReservationColumnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
      suppressMenu: true,
      resizable: false,
    },
    {
      headerName: "Guest Name",
      field: "fullName",
      maxWidth: 150,
      autoHeaderHeight: true,
      wrapHeaderText: true,
    },
    {
      headerName: "Booking ID",
      field: "bookingID",
      maxWidth: 130,
      autoHeaderHeight: true,
      wrapHeaderText: true,
    },
    {
      headerName: "Sharing ID",
      field: "sharingID",
      maxWidth: 130,
      autoHeaderHeight: true,
      wrapHeaderText: true,
    },

    {
      headerName: "Arrival Date",
      field: "arrivalDate",
      maxWidth: 140,
      autoHeaderHeight: true,
      wrapHeaderText: true,
      cellRenderer: (params) => {
        if (params.data && params.data.arrivalDate) {
          const formattedDate = Moment(params.data.arrivalDate).format(
            "DD-MM-YYYY"
          );
          return formattedDate;
        } else {
          return "";
        }
      },
    },
    {
      headerName: "Departure Date",
      field: "departureDate",
      suppressSizeToFit: true,
      maxWidth: 140,
      autoHeaderHeight: true,
      wrapHeaderText: true,
      cellRenderer: (params) => {
        if (params.data && params.data.departureDate) {
          const formattedDate = Moment(params.data.departureDate).format(
            "DD-MM-YYYY"
          );
          return formattedDate;
        } else {
          return "";
        }
      },
    },
  ];


    // Preference
    const handleChange19 = (selectedOption6) => {
        const selectedIds = selectedOption6.map(option => option.value);
        setPreferenceValue(selectedIds);
    };


    const handleSuccess = () => {
        MySwal.fire({
            title: 'Booking Information',
            text: 'Booking Information Updated Successfully !!',
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        }).then(() => {
            // Close the modal after showing success message
           if (onClose) {
                onClose();
                callDefiniteReservation()
            }
        });
    };


    useEffect(() => {
        const hotelID = JSON.stringify({
            hotelID: 1
        })
        fetchx(API_URL + "/getBusinessDate", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: hotelID
        }).then((res) => res.json())
            .then(postres => {
                const today = new Date(postres['data'][0]['businessDate']);
                const tomorrow = new Date(today);
                const Yesterday = new Date(today);
                let arrivalDayback = new Date(data1.arrivalDate);
                arrivalDayback.setDate(arrivalDayback.getDate() - 1);
                setDefaultYesterday(arrivalDayback)
                Yesterday.setDate(today.getDate() - 1);
                setYesterday(Yesterday)
                setArrivalDate((Moment(String(new Date(postres['data'][0]['businessDate']))).format('YYYY-MM-DD')))
            })
    }, [])


    useEffect(() => {

        fetchx(API_URL + `/getGroupsFromAccounts`)
        .then(result => result.json())
        .then(rowData => {
            setGroupNameData(rowData['data'])
        })
    
    // setCompanyProfile(!companyProfile)
    
    // }


        fetchx(API_URL + '/getExtraDescription?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setExtraName(resp['data'])
            })


        fetchx(API_URL + '/getPrefernceOptions?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setFeatures(resp['data'])
            })

        fetchx(API_URL + `/getCompanyNames?hotelID=1`)
            .then(result => result.json())
            .then(rowData => {
                setCompany(rowData['data'])
            })

        fetchx(API_URL + '/getAccountName?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setAccounts(resp['data'])
            })


        fetchx(API_URL + '/getAgentList?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setAgent(resp['data'])
            })

        fetchx(API_URL + '/getSourceName?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setSourceCode(resp['data'])
            })


        fetchx(API_URL + '/getMarketName?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setMarketCode(resp['data'])
            })



        fetchx(API_URL + '/getBookerList?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setBooker(resp['data'])
            })

        fetchx(API_URL + '/getOriginOptions?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setOriginOption(resp['data'])
            })

        fetchx(API_URL + '/getReservationTypes?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setReservationTypeOption(resp['data'])
            })

        fetchx(API_URL + '/getPayment?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setPaymentOption(resp['data'])
            })


        fetchx(API_URL + '/getAccountManagerList', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
        }).then(result => result.json())
            .then(resp => {
                setAccountManagerOptions(resp['data'])
            })

        fetchx(API_URL + '/getBookerList?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setRowData(resp['data']);
            })


        fetchx(API_URL + '/getAgents?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setRowData2(resp['data']);
            })

        const getByID = JSON.stringify({
            hotelID: 1,
            agentID: data1.travelAgentID
        })
        fetchx(API_URL + '/getAgentByID', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: getByID
        })
            .then(result => result.json())
            .then(resp => {
                let account = resp['data'][0]
                if (resp['data'].length) {
                    setAgentLabel(account.accountName)
                }
                else {
                    setAgentLabel(null)
                }
            })

    }, []);


    function toggleModal() {
        fetchx(API_URL + `/getCompanyList?hotelID=1`)
            .then(result => result.json())
            .then(rowData => {
                setCompany(rowData['data'])
            })
        setCompanyProfile(false)
    }


    function toggleModal2() {
        fetchx(API_URL + '/getBookerList?hotelID=1')
            .then(result => result.json())
            .then(resp => {
                setRowData(resp['data']);
            })
        setAddBookerModal(false)
    }

    const onclickButton5 = () => {
        setCompanyProfile(true)
    }

    const onGroupSelect = (rowData) => {
        setSelectedGroupName(rowData);
        setGroupNameModal(false);
    };


    const checkIn = watch('coming');


    // Flatpickr condition for cut of date
    const optionForYesterDay = {
        minDate: (arrivalDate),
        maxDate: (data1.arrivalDate > arrivalDate ? defaultYesterday : arrivalDate)
    }


    const [columnDefsGroup] = useState([
        { headerName: 'Group Name', field: 'accountName', width: 250 },
        { headerName: 'Email ID', field: 'email', width: 200 },
        {
            headerName: "Action",
            maxWidth: 140,
            cellRenderer: (params) => {
                return (
                    <Button
                        color='primary'
                        onClick={() => onGroupSelect(params.data)}>
                        Select
                    </Button>
                )
            }
        },
        { headerName: 'Address', field: 'address', width: 250 },
        { headerName: 'GST ID', field: 'gstID', width: 200 },
        { headerName: 'Phone Number', field: 'phoneNumber', width: 200 },

    ])


    const handleUpdateRates = async () => {
        // Check if any reservations are selected
        if (selectedReservations.length === 0) {
          Swal.fire({
            title: "Error",
            text: "Please select at least one reservation",
            icon: "error",
          });
          return;
        }
      
        try {

          const sharingIDs = selectedReservations.map(reservation => reservation.sharingID);
          const reservationIDs =  selectedReservations.map(reservation => reservation.id);
      
          const requestBody = {
            reservationIDs:reservationIDs,
            sharingIDs: sharingIDs,
            reservationID: data1.id
          };
      
          const response = await fetch(`${API_URL}/modifyBookingInfoOfGroupReservations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
          });
      
          const result = await response.json();
      
          if (result.statusCode === 200) {
            Swal.fire({
              title: "Success",
              text: result.message || "Reservations updated successfully",
              icon: "success",
            });
      
            // Close the modal
            setTempReservationModal(false);
          } else {
            Swal.fire({
              title: "Error",
              text: result.message || "Failed to update reservations",
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Error updating reservations:", error);
          Swal.fire({
            title: "Error",
            text: "An unexpected error occurred",
            icon: "error",
          });
        }
      };


    // Ag-grid column for booker
    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Booker Name', field: 'name', suppressSizeToFit: true, maxWidth: 250 },
        { headerName: 'Email', field: 'emailID', suppressSizeToFit: true, maxWidth: 250 },
        { headerName: 'Phone', field: 'phone', suppressSizeToFit: true, maxWidth: 250 },
        { headerName: 'Country', field: 'country', suppressSizeToFit: true, maxWidth: 250 },
        {
            headerName: "Actions", cellRendererFramework: (params) => (
                <Button color="primary" onClick={() => setBookerModal(false)} >
                    Select
                </Button>
            ),
            suppressSizeToFit: true,
        },
    ]);


    // Ag-grid column for agent
    const [columnDefs2, setColumnDefs2] = useState([
        { headerName: 'Account Name', field: 'accountName', maxWidth: 250 },
        { headerName: 'Account Type', field: 'accountType', maxWidth: 150 },
        { headerName: 'Email', field: 'email', maxWidth: 150 },
        { headerName: 'Phone', field: 'phoneNumber', maxWidth: 150 },
        { headerName: 'Adress 1', field: 'addressLine1', maxWidth: 250 },
        { headerName: 'Address 2', field: 'addressLine2', maxWidth: 250 },
        {
            headerName: "Actions", cellRendererFramework: (params) => (
                <Button color="primary" onClick={() => setAgentModal(false)} >
                    Select
                </Button>
            ),
            // suppressSizeToFit: true,
        },
    ]);


    // Ag-grid column of company
    const [columnDefsCompany] = useState([
        { headerName: 'Company Name', field: 'accountName', width: 300 },
        {
            headerName: "Action",
            maxWidth: 140,
            cellRenderer: (params) => {
                { console.log(params) }

                return (
                    <Button
                        color='primary'
                        onClick={() => onCompanySelect(params.data)}>
                        Select
                    </Button>
                )
            }
        },
        { headerName: 'Company Address', field: 'address', width: 300 },
        { headerName: 'Email ID', field: 'email', width: 300 },
        { headerName: 'Phone Number', field: 'phoneNumber', width: 200 },
        { headerName: 'GSTID', field: 'gstID', width: 300 },
    ])


    // Default reason for reservation type
    const defaultReason1 = {
        value: data1.reservationTypeID,
        label: data1.reservationTypeDescription,
    };


    const defaultReason2 = {
        value: data1.originID,
        label: data1.origin,
    };


    const defaultReason4 = {
        value: data1.sourceID,
        label: data1.sourceCode,
    };


    const defaultReason5 = {
        value: data1.bookerID,
        label: data1.bookerName,
    };


    const defaultReason7 = {
        value: data1.marketID,
        label: data1.marketCode,
    };


    // Default reason for payment type
    const defaultReason10 = {
        value: data1.paymentTypeID,
        label: data1.paymentTypeCode,
    };


    // Default reason for account manager
    const defaultReason11 = {
        value: data1.accountManagerID,
        label: data1.accountManagerName,
    };



    // Origin handle change
    const handleChange2 = (selectedOption2) => {
        setOriginValue(selectedOption2.value);
    };


    //Source handle change 
    const handleChange4 = (selectedOption4) => {
        setSourceValue(selectedOption4.value);
    };


    //Reservation Type handle change
    const handleChange5 = (selectedOption5) => {
        setResTypeValue1(selectedOption5.value);
    };


    const handleChange6 = (selectedOption6) => {
        setPayment(selectedOption6.value);
    };


    const handleChange13 = (selectedOption6) => {
        setAccountManagerValue(selectedOption6.value);
    };


    // company selection
    // const onCompanySelect = (rowData) => {
    //     setSelectedCompany(rowData.accountName);
    //     setSelectedCompanyID(rowData.companyid);
    //     setCompanyModal(false);
    // };


    const handleChange7 = (selectedOption7) => {
        setMarketValue(selectedOption7.value);
    };


    const handleChange8 = (event) => {
        setCommentValue(event.target.value);
    };


    const handleChange9 = (event) => {
        setBillingValue(event.target.value);
    };


    const handleChange10 = (event) => {
        setETAValue(event.target.value);
    };


    const handleChange11 = (event) => {
        setETDValue(event.target.value);
    };


    const handleChange12 = (event) => {
        setGroupNameValue(event.target.value);
    };


    // error handling
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


    //onsubmit data post
    const onSubmit = data => {
        setData(data)
       
        const createmarketGroup = JSON.stringify({
            
            resType: resTypeValue,
            paymentType: payment,
            companyID: selectedCompanyID,
            source: sourceValue,
            market: marketValue,
            origin: originValue,
            ETA: etaValue,
            ETD: etdValue,
            agent: agentValue,
            accountManager: accountManagerValue,
            booker: bookerValue,
            comment: commentValue,
            billingInstructions: billingValue,
            reservationID: data1.id,
            extras: extraValue == null ? null : extraValue,
            features: preferenceValue == null ? null : preferenceValue,
            sharingID: data1.sharingID,
            noPost: data1.noPost,
            dnm: data1.doNotMove ,
            printRate : data1.printRate,
            tempReservationID : data1.tempReservationID,
            groupName : data1.groupName,

        })

        

        fetchx(API_URL + "/ModifyBookingInformation", {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: createmarketGroup
        }).then((data) => data.json())
            .then((res) => {
                if (res.statusCode == 403 ) {
                    return handleError(res.data)
                }

                handleSuccess()
                
                //setTimeout(() => { navigate('/dashboard/groupreservation/allgroupreservations') }, 500)
            })
    }

    //reset button function
    const handleReset = () => {
        reset({
            eta: '',
            etd: '',
            extras: null,
            resType: null,
            origin: null,
            agent: null,
            source: null,
            booker: null,
            features: null,
            package: '',
            market: null,
            comment: '',
            billingInstructions: '',
            companyID: ''
        })
    }


    const cellClickedListener = useCallback((event) => {
        setBookerValue(event.data.id)
        setBookerLabel(event.data.name)
    }, []);


    // const cellClickedListener2 = useCallback((event) => {
    //     setAgentValue(event.data.companyid)
    //     setAgentLabel(event.data.accountName)
    // }, []);


    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        filterParams: {
            buttons: ["apply", "reset"],
        },
    }));


    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById("filter-text-boxs").value
        );
    }, []);


    const onFilterTextBoxChanged2 = useCallback(() => {
        gridRef2.current.api.setQuickFilter(
            document.getElementById("filter-text-boxser").value
        );
    }, []);


    //Search element
    const onFilterTextBoxChanged12 = useCallback(() => {
        gridRef3.current.api.setQuickFilter(
            document.getElementById('filter-text').value
        )
    }, [])


    // Clear agent selection
    // const handleAgentClear = () => {
    //     setAgentValue(null)
    //     setAgentLabel(null)
    //     setReload(!reload); // Toggle the reload state to trigger a re-render
    // };


    // Clear company selection
    // const handleCompanyClear = () => {
    //     setSelectedCompany(null);
    //     setSelectedCompanyID(null);
    //     setReload(!reload); // Toggle the reload state to trigger a re-render
    // };
    const onCompanySelect = (rowData) => {
        setSelectedCompany(rowData.accountName);
        setSelectedCompanyID(rowData.companyid);
        setCompanyModal(false);
    };

    // Modified agent click listener
    const cellClickedListener2 = useCallback((event) => {
        setAgentValue(event.data.companyid);
        setAgentLabel(event.data.accountName);
    }, []);

    // Modified clear handlers
    const handleAgentClear = () => {
        setAgentValue(null);
        setAgentLabel(null);
        setReload(!reload);
    };

    const handleCompanyClear = () => {
        setSelectedCompany(null);
        setSelectedCompanyID(null);
        setReload(!reload);
    };


    // Clear booker selection
    const handleBookerClear = () => {
        setBookerValue(null);
        setBookerLabel(null);
        setReload(!reload); // Toggle the reload state to trigger a re-render
    };

   


    return (
        <div>
<Card>

  <CardBody
    style={{
      paddingTop: "40px", // Add space before the second section
    }}
  >
    
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>


                            {/* Reservation Types */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='reservationType'>
                                        Reservation Type
                                    </Label>
                                    <Controller
                                        id='reservationType'
                                        control={control}
                                        name='reservationType'
                                        render={({ field }) => (
                                            <Select
                                                isClearable
                                                required
                                                options={ReservationTypes}
                                                classNamePrefix='select'
                                                defaultValue={defaultReason1}
                                                theme={selectThemeColors}
                                                className={classnames('react-select')}
                                                {...field}
                                                onChange={handleChange5}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>


                            {/* payment Types */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='paymentType'>
                                        Payment Type
                                    </Label>
                                    <Controller
                                        id='paymentType'
                                        control={control}
                                        name='paymentType'
                                        render={({ field }) => (
                                            <Select
                                                isClearable
                                                required
                                                options={paymentOption}
                                                classNamePrefix='select'
                                                defaultValue={defaultReason10}
                                                theme={selectThemeColors}
                                                className={classnames('react-select')}
                                                {...field}
                                                onChange={handleChange6}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>


                            {/* Company name */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='companyName'>
                                        Company Name
                                    </Label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Controller
                                            id='agent'
                                            control={control}
                                            name='agent'
                                            key={reload} // Use the reload state to force a re-render
                                            render={({ field }) => (
                                                <Input type="text" name='companyName' placeholder='Select company'
                                                    value={selectedCompany}
                                                    onClick={() => setCompanyModal(!companyModal)}
                                                />
                                            )}
                                        />
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
                                            onClick={handleCompanyClear}
                                        >
                                            X
                                        </span>
                                    </div>

                                </div>
                            </Col>


                            {/* Source Options */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='sourceOption'>
                                        Source
                                    </Label>
                                    <Controller
                                        id='sourceOption'
                                        control={control}
                                        name='sourceOption'
                                        render={({ field }) => (
                                            <Select
                                                // isMulti
                                                defaultValue={defaultReason4}
                                                isClearable
                                                options={sourceCode}
                                                classNamePrefix='select'
                                                theme={selectThemeColors}
                                                className={classnames('react-select', { 'is-invalid': data !== null && data.sourceOption === null })}
                                                {...field}
                                                onChange={handleChange4}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>


                            {/* Market Options */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='marketOption'>
                                        Market
                                    </Label>
                                    <Controller
                                        id='marketOption'
                                        control={control}
                                        name='marketOption'
                                        render={({ field }) => (
                                            <Select
                                                // isMulti
                                                required
                                                defaultValue={defaultReason7}
                                                isClearable
                                                options={marketCode}
                                                classNamePrefix='select'
                                                theme={selectThemeColors}
                                                className={classnames('react-select', { 'is-invalid': data !== null && data.marketOption === null })}
                                                {...field}
                                                onChange={handleChange7}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>

                            {/* Extras Options */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='extras1' >
                                        Select Extra
                                    </Label>
                                    <Controller
                                        id='extras1'
                                        control={control}
                                        name='extras1'
                                        render={({ field }) => (
                                            <Select
                                                isMulti
                                                isClearable
                                                options={extraName}
                                                defaultValue={defaultReason}
                                                classNamePrefix='select'
                                                theme={selectThemeColors}
                                                className={classnames('react-select')}
                                                {...field}
                                                onChange={handleChange}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>


                            {/* Features Options */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='features1'>
                                        Features / Preferences
                                    </Label>
                                    <Controller
                                        id='features1'
                                        control={control}
                                        name='features1'
                                        render={({ field }) => (
                                            <Select
                                                isMulti
                                                isClearable
                                                defaultValue={defaultReason6}
                                                options={Features}
                                                classNamePrefix='select'
                                                theme={selectThemeColors}
                                                className={classnames('react-select')}
                                                {...field}
                                                onChange={handleChange19}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>


                            {/* Origin options */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='originOptions'>
                                        Origin
                                    </Label>
                                    <Controller
                                        id='originOptions'
                                        control={control}
                                        name='originOptions'
                                        render={({ field }) => (
                                            <Select
                                                isClearable
                                                required
                                                defaultValue={defaultReason2}
                                                options={Origin}
                                                classNamePrefix='select'
                                                theme={selectThemeColors}
                                                className={classnames('react-select', { 'is-invalid': data !== null && data.originOptions === null })}
                                                {...field}
                                                onChange={handleChange2}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>


                            {/* ETA */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='eta1'>
                                        ETA
                                    </Label>
                                    <Controller
                                        control={control}
                                        id='eta1'
                                        name='eta1'
                                        render={({ field }) =>
                                            <Input type='time' placeholder='Agent' invalid={errors.eta && true}
                                                defaultValue={data1.ETA}
                                                {...field}
                                                onChange={handleChange10}
                                            />}
                                    />
                                </div>
                            </Col>


                            {/* ETD */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='etd1'>
                                        ETD
                                    </Label>
                                    <Controller
                                        // defaultValue=''
                                        control={control}
                                        id='etd1'
                                        name='etd1'
                                        render={({ field }) =>
                                            <Input type='time' placeholder='ETD'
                                                invalid={errors.etd1 && true}
                                                defaultValue={data1.ETD}
                                                {...field}
                                                onChange={handleChange11}
                                            />}
                                    />
                                </div>
                            </Col>


                            {/* Agent Options */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='agent'>
                                        Agent
                                    </Label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Controller
                                            id='agent'
                                            control={control}
                                            name='agent'
                                            key={reload} // Use the reload state to force a re-render

                                            render={({ field }) => (
                                                <Input
                                                    onClick={() => setAgentModal(true)}
                                                    value={agentLabel ? agentLabel : null}
                                                />
                                            )}
                                        />
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
                                            onClick={handleAgentClear}
                                        >
                                            X
                                        </span>
                                    </div>


                                </div>
                            </Col>


                            {/* Account manager */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='paymentType'>
                                        Account Manager
                                    </Label>
                                    <Controller
                                        id='paymentType'
                                        control={control}
                                        name='paymentType'
                                        render={({ field }) => (
                                            <Select
                                                isClearable
                                                required
                                                options={accountManagerOption}
                                                classNamePrefix='select'
                                                defaultValue={defaultReason11}
                                                theme={selectThemeColors}
                                                className={classnames('react-select')}
                                                {...field}
                                                onChange={handleChange13}
                                            />
                                        )}
                                    />
                                </div>
                            </Col>


                            {/* Booker Options */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='booker'>
                                        Booker
                                    </Label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Controller
                                            id='booker'
                                            control={control}
                                            name='booker'
                                            key={reload} // Use the reload state to force a re-render

                                            render={({ field }) => (
                                                <Input type="text" name='booker' placeholder='Select Booker'
                                                    // required
                                                    onClick={() => { setBookerModal(true) }}
                                                    value={bookerLabel ? bookerLabel : null}

                                                />
                                            )}
                                        />
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
                                            onClick={handleBookerClear}
                                        >
                                            X
                                        </span>
                                    </div>
                                </div>
                            </Col>


                            {/* Comments */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='comment1'>
                                        Comment
                                    </Label>
                                    <Controller
                                        control={control}
                                        id='comment1'
                                        name='comment1'
                                        render={({ field }) =>
                                            <Input
                                                type='textarea'
                                                placeholder='Comment'
                                                invalid={errors.comment && true}
                                                defaultValue={data1.comments}
                                                {...field}
                                                onInput={handleChange8}
                                            />
                                        }
                                    />
                                </div>
                            </Col>


                            {/* Billing Instructions */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='billingInstructions1'>
                                        Billing Instructions
                                    </Label>
                                    <Controller
                                        // defaultValue=''
                                        control={control}
                                        id='billingInstructions1'
                                        name='billingInstructions1'
                                        render={({ field }) =>
                                            <Input
                                                type='textarea'
                                                placeholder='Comment'
                                                invalid={errors.billingInstructions && true}
                                                defaultValue={data1.billingInstruction}
                                                {...field}
                                                onChange={handleChange9}
                                            />
                                        }
                                    />
                                </div>
                            </Col>


                            {/* BLOCK CODE */}
                            <Col md='4' sm='8'>
                                <div className='mb-1'>
                                    <Label className='form-label' for='blockCode'>
                                        Block Code
                                    </Label>
                                    <Controller
                                        control={control}
                                        id='blockCode'
                                        name='blockCode'
                                        render={({ field }) =>
                                            <Input
                                                // placeholder=''
                                                invalid={errors.blockCode && true}
                                                defaultValue={data1.blockCodeID}
                                                {...field}
                                                disabled={true}

                                                onChange={handleChange9}
                                            />
                                        }
                                    />
                                </div>
                            </Col>
                            <br></br>
                            <br></br>
                            <br></br>
                            {/* On submit buttons */}
                            <div align='end'>
                                <Button outline className='me-1' color='secondary' type='reset' onClick={handleReset}>
                                    Reset
                                </Button>
                                <Button className='me-1' color='primary' type='submit'>
                                    Update
                                </Button>
                            </div>


                        </Row>
                    </Form>
                </CardBody>
            </Card>

     


            {/* Booker modal */}
            <div>
                <Modal
                    isOpen={bookerModal} toggle={() => setBookerModal(!bookerModal)} className="modal-xl"
                >
                    <ModalHeader className="bg-transparent" toggle={() => setBookerModal(!bookerModal)}>Select Booker</ModalHeader>
                    <ModalBody className="pb-3 px-sm-1 mx-20">
                        <div>
                            <Card>
                                <CardHeader>
                                    <Button color='primary' className="d-flex justify-content-end" onClick={() => setAddBookerModal(true)} >Add New Booker</Button>
                                </CardHeader>
                            </Card>              <div>
                                <Col md="3" sm="12" className="mb-1">
                                    <Label className="form-label" for="fullName">
                                        Search
                                    </Label>
                                    <Input
                                        type="text"
                                        id="filter-text-boxs"
                                        placeholder="Filter..."
                                        onInput={onFilterTextBoxChanged}
                                    />
                                </Col>
                            </div>

                            {/* <button onClick={buttonListener}>Push Me</button> */}
                            <div className="ag-theme-alpine" style={{ height: 520 }}>
                                <AgGridReact
                                    ref={gridRef}
                                    rowData={rowData}
                                    columnDefs={columnDefs}
                                    animateRows={true}
                                    rowSelection="multiple"
                                    onCellClicked={cellClickedListener}
                                    paginationAutoPageSize="true"
                                    paginationPageSize="10"
                                    pagination="true"
                                    defaultColDef={defaultColDef}
                                    headerColor="ddw-primary"
                                />
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>

            {/* Agent */}
            <div>
                <Modal
                    isOpen={agentModal} toggle={() => setAgentModal(!agentModal)} className="modal-xl"
                >
                    <ModalHeader className="bg-transparent" toggle={() => setAgentModal(!agentModal)}>Select Agent</ModalHeader>
                    <ModalBody className="pb-3 px-sm-1 mx-20">
                        <div>
                            <Card>
                                <CardHeader>
                                    <Button color='primary' className="d-flex justify-content-end" onClick={() => setCompanyProfile(true)}>Add New Agent</Button>
                                </CardHeader>
                            </Card>
                            <div>
                                <Col md="3" sm="12" className="mb-1">
                                    <Label className="form-label" for="fullName">
                                        Search
                                    </Label>
                                    <Input
                                        type="text"
                                        id="filter-text-boxser"
                                        placeholder="Filter..."
                                        onInput={onFilterTextBoxChanged2}
                                    />
                                </Col>
                            </div>

                            <div className="ag-theme-alpine" style={{ height: 520 }}>
                                <AgGridReact
                                    ref={gridRef2}
                                    rowData={rowData2}
                                    columnDefs={columnDefs2}
                                    animateRows={true}
                                    rowSelection="multiple"
                                    onCellClicked={cellClickedListener2}
                                    paginationAutoPageSize="true"
                                    paginationPageSize="10"
                                    pagination="true"
                                    defaultColDef={defaultColDef}
                                    headerColor="ddw-primary"
                                />
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>

            {/* Company Modal */}
            {
                companyModal &&
                <div>
                    <Modal isOpen={companyModal} toggle={() => setCompanyModal(!companyModal)} className='modal-lg'>
                        <ModalHeader toggle={() => setCompanyModal(!companyModal)}>Company Profile page</ModalHeader>
                        <ModalBody>
                            <div>
                                <Row className='mb-1'>
                                    <Col md='3' sm='12' className='me-1'>
                                        <Label className='form-label' for='fullName'>
                                            Search
                                        </Label>
                                        <Input
                                            type="text"
                                            id="filter-text"
                                            placeholder="Filter..."
                                            onInput={onFilterTextBoxChanged12}
                                        />
                                    </Col>
                                    <Col md='3' sm='12' className='me-1'>
                                        <br></br>
                                        <div align='end' >
                                            <Button color='primary' onClick={() => setCompanyProfile(true)}>Add Company</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="ag-theme-alpine" style={{ height: 520 }}>
                                <AgGridReact
                                    ref={gridRef3}
                                    rowData={company}
                                    columnDefs={columnDefsCompany}
                                    animateRows={true}
                                    onCellClicked={cellClickedListener}
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

{
                        groupNameModal &&
                        <div>
                            <Modal isOpen={groupNameModal} toggle={() => setGroupNameModal(!groupNameModal)} className='modal-xl'>
                                <ModalHeader toggle={() => setGroupNameModal(!groupNameModal)}>Company Profile</ModalHeader>
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
                                            <Col md='3' sm='12' className='me-1'>
                                                <br></br>
                                                <div align='end' >
                                                    <Button color='primary' onClick={onclickButton5}>Add New Group</Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="ag-theme-alpine" style={{ height: 520 }}>
                                        <AgGridReact
                                            ref={gridRef1}
                                            rowData={groupNameData}
                                            columnDefs={columnDefsGroup}
                                            animateRows={true}
                                           // onCellClicked={cellClickedListener}
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

            {/* Company modal */}
            <Modal isOpen={companyProfile} toggle={() => setCompanyProfile(!companyProfile)} className='modal-xl'>
                <ModalHeader toggle={() => setCompanyProfile(!companyProfile)}>Company Profile</ModalHeader>
                <ModalBody>
                    <CompanyProfile toggleModal={toggleModal} />
                </ModalBody>
            </Modal>


            {/* Booker modal */}
            <Modal isOpen={addBookerModal} toggle={() => setAddBookerModal(!addBookerModal)} className='modal-lg'>
                <ModalHeader toggle={() => setAddBookerModal(!addBookerModal)}>Booker</ModalHeader>
                <ModalBody>
                    <AddBooker toggleModal2={toggleModal2} />
                </ModalBody>
            </Modal>

            {/* Temporary Reservations Modal */}
      <Modal
        isOpen={tempReservationModal}
        //toggle={() => setTempReservationModal(!tempReservationModal)}
        toggle={toggleTempReservationModal}
        className="modal-dialog-centered modal-lg"
        // style={{ maxWidth: '700px', width: '700px', margin: 'auto' }}
      >
        <ModalHeader
         toggle={toggleTempReservationModal}
        >
          Select Reservations
        </ModalHeader>
        <ModalBody>
          <div
            className="ag-theme-alpine"
            style={{ height: 500, width: "100%" }}
          >
            <AgGridReact
              rowData={tempReservationData}
              columnDefs={tempReservationColumnDefs}
              rowSelection="multiple"
              suppressRowClickSelection={true} // This can help prevent unintended deselections
              onSelectionChanged={(params) => {
                const selectedRows = params.api.getSelectedRows();
                setSelectedReservations(selectedRows);
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <Button 
                color="primary" 
                onClick={handleUpdateRates}
                disabled={selectedReservations.length === 0}
                >
                Update
                </Button>
          </div>
        </ModalBody>
      </Modal>
        </div>
    )

}

export default ModifyBookingInfoForRes
