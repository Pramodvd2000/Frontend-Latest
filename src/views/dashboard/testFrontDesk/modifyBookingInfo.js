
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
import API_URL from '../../../config';
import { tr } from 'date-fns/locale';
import Swal from 'sweetalert2'
import CompanyProfile from '../../../views/dashboard/reservation/companyProfile/index'
import AddBooker from '../../../views/dashboard/reservation/companyProfile/booker'

import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const defaultValues6 = {
  eta: '',
  etd: '',
  // extras: extraName[0].value,
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

const Origin = [
  { value: '1', label: 'Email' },
  { value: '2', label: 'Phone' },
  { value: '3', label: 'Walk-In' },
  { value: '4', label: 'House-Use' },
  { value: '5', label: 'Hotel-Reservation Office' },
  { value: '6', label: 'Online' }
]


// let Features = [
//   fetchx(API_URL + '/getPrefernceOptions?hotelID=1')
//     .then(result => result.json())
//     .then(resp => {
//       Features = resp['data']
//       //console.log(Features)
//     })
// ]


// let Agent = [
//   fetchx(API_URL + '/getAgentList?hotelID=1')
//     .then(result => result.json())
//     .then(resp => {
//       Agent = resp['data']
//       //console.log(Agent)
//     })
// ]

// let sourceCode = [
//   fetchx(API_URL + '/getSourceName?hotelID=1')
//     .then(result => result.json())
//     .then(resp => {
//       sourceCode = resp['data']
//     })
// ]

// let marketCode = [
//   fetchx(API_URL + '/getMarketName?hotelID=1')
//     .then(result => result.json())
//     .then(resp => {
//       marketCode = resp['data']
//     })
// ]


// let Booker = [
//   fetchx(API_URL + '/getBookerList?hotelID=1')
//     .then(result => result.json())
//     .then(resp => {
//       Booker = resp['data']
//       //console.log(Booker)
//     })
// ]

const ReservationTypes = [
  { value: 1, label: 'CC-Credit Card Gtd' },
  { value: 2, label: 'Company Gtd' },
  { value: 3, label: 'Travel Agent Gtd' },
  { value: 4, label: 'Deposit Paid' },
  { value: 5, label: 'Bank/Debit Card' },
  { value: 6, label: 'House Use/COMP/Day Use' },
  { value: 7, label: 'Inquiry Only' }
]


// let extraName = [
//   fetchx(API_URL + '/getExtraDescription?hotelID=1')
//     .then(result => result.json())
//     .then(resp => {
//       // //console.log(resp['data'])
//       extraName = resp['data']
//       //console.log(extraName)
//     })
// ]


// let accounts = [

//   fetchx(API_URL + '/getAccountName?hotelID=1')
//     .then(result => result.json())
//     .then(resp => {
//       // Booker = resp['data']
//       //console.log(resp['data'])

//     })
// ]

const ModifyBookingInfo = (data1) => {

  let navigate = useNavigate();

  //console.log(data1.data1.data1)

  // const [extraValue, setExtraOption] = useState([parseInt(data1.data1.data1.extraID)]);
  const [resTypeValue, setResTypeValue1] = useState(data1.data1.data1.reservationTypeID);
  const [originValue, setOriginValue] = useState(data1.data1.data1.originID);
  const [agentValue, setAgentValue] = useState(data1.data1.data1.agentID);
  const [sourceValue, setSourceValue] = useState(data1.data1.data1.sourceID);
  const [bookerValue, setBookerValue] = useState(data1.data1.data1.bookerID);
  const [bookerLabel, setBookerLabel] = useState(data1.data1.data1.bookerName);
  const [agentLabel, setAgentLabel] = useState(null);
  // const [preferenceValue, setPreferenceValue] = useState([parseInt(data1.data1.data1.preferenceID)])
  const [marketValue, setMarketValue] = useState(data1.data1.data1.marketID)
  const [commentValue, setCommentValue] = useState(data1.data1.data1.comments)
  const [billingValue, setBillingValue] = useState(data1.data1.data1.billingInstruction)
  const [etaValue, setETAValue] = useState(data1.data1.data1.ETA)
  const [etdValue, setETDValue] = useState(data1.data1.data1.ETD)
  const [GroupName, setGroupNameValue] = useState(data1.data1.data1.groupName)
  const [checkBoxValue1, setCheckBoxValue1] = useState(data1.data1.data1.noPost == 0 ? 0 : 1);
  const [checkboxChecked1, setCheckboxChecked1] = useState(data1.data1.data1.noPost == 0 ? false : true)
  const [checkBoxValue2, setCheckBoxValue2] = useState(data1.data1.data1.doNotMove == 0 ? 0 : 1);
  const [checkboxChecked2, setCheckboxChecked2] = useState(data1.data1.data1.doNotMove == 0 ? false : true)
  const [checkBoxValue3, setCheckBoxValue3] = useState(data1.data1.data1.printRate == 0 ? 0 : 1);
  const [checkboxChecked3, setCheckboxChecked3] = useState(data1.data1.data1.printRate == 0 ? false : true)
  const [bookerModal, setBookerModal] = useState(false);
  const [agentModal, setAgentModal] = useState(false);
  const [rowData, setRowData] = useState();
  const [company, setCompany] = useState();
  const [rowData2, setRowData2] = useState();
  const [extraName, setExtraName] = useState([])
  const [accounts, setAccounts] = useState([])
  const [Features, setFeatures] = useState([])
  const [Agent, setAgent] = useState([])
  const [sourceCode, setSourceCode] = useState([])
  const [marketCode, setMarketCode] = useState([])
  const [Booker, setBooker] = useState([])
  const [companyModal, setCompanyModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(data1.data1.data1.accountName);
  const [selectedCompanyID, setSelectedCompanyID] = useState(data1.data1.data1.companyID);
  const [companyProfile, setCompanyProfile] = useState(false)
  const [addBookerModal, setAddBookerModal] = useState(false)
  const [reload, setReload] = useState(true);


  //console.log(company)
  const handleSuccess = () => {
    return MySwal.fire({
      title: 'Booking Information',
      text: 'Booking Information Updated Successfully !!',
      icon: 'success',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    })
  }


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


  useEffect(() => {

    // fetchx(API_URL + `/getCompanyNames?hotelID=1`)
    //   .then(result => result.json())
    //   .then(rowData => {
    //     //console.log(rowData)
    //     setCompany(rowData['data'])
    //   })

    fetchx(API_URL + `/getCompanyNames?hotelID=1`)
      .then(result => result.json())
      .then(rowData => {
        setCompany(rowData['data'])
        // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
      })

    fetchx(API_URL + '/getExtraDescription?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        // //console.log(resp['data'])
        setExtraName(resp['data'])
        //console.log(extraName)
      })



    fetchx(API_URL + '/getAccountName?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        setAccounts(resp['data'])
        //console.log(resp['data'])

      })

    fetchx(API_URL + '/getPrefernceOptions?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        setFeatures(resp['data'])
        //console.log(Features)
      })



    fetchx(API_URL + '/getAgentList?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        setAgent(resp['data'])
        //console.log(Agent)
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
        //console.log(Booker)
      })
  }, []);


  function toggleModal() {
    fetchx(API_URL + `/getCompanyList?hotelID=1`)
      .then(result => result.json())
      .then(rowData => {
        setCompany(rowData['data'])
        // setAddress((rowData['data']['addressLine1'] + rowData['data']['addressLine2']))
      })
    // fetchx(API_URL + '/getAgents?hotelID=1')
    // .then(result => result.json())
    // .then(resp => {
    //   // Booker = resp['data']
    //   //console.log(resp['data'])
    //   setRowData2(resp['data']);

    // })

    setCompanyProfile(false)
  }

  function toggleModal2() {

    fetchx(API_URL + '/getBookerList?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        // Booker = resp['data']
        //console.log(resp['data'])
        setRowData(resp['data']);

      })
    setAddBookerModal(false)
    // setCompanyProfile(false)
  }

  const gridRef = useRef();
  const gridRef2 = useRef();
  const gridRef3 = useRef();

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



  // ExtraS
  const handleChange = (selectedOption) => {
    const selectedIds = selectedOption.map(option => option.value);
    //console.log(selectedIds)
    setExtraOption(selectedIds);
    //console.log(selectedOption.label);

  };

  const handleCheckboxChange1 = (event) => {
    const isChecked = event.target.checked;
    const checkboxValue1 = isChecked ? 1 : 0;
    //console.log(checkboxValue1)
    setCheckBoxValue1(checkboxValue1)
    setCheckboxChecked1(!checkboxChecked1)
  }

  const handleCheckboxChange2 = (event) => {
    const isChecked = event.target.checked;
    const checkboxValue2 = isChecked ? 1 : 0;
    //console.log(checkboxValue2)
    setCheckBoxValue2(checkboxValue2)
    setCheckboxChecked2(!checkboxChecked2)
  }

  const handleCheckboxChange3 = (event) => {
    const isChecked = event.target.checked;
    const checkboxValue3 = isChecked ? 1 : 0;
    //console.log(checkboxValue3)
    setCheckBoxValue3(checkboxValue3)
    setCheckboxChecked3(!checkboxChecked3)
  }

  // const defaultReason = {
  //   // value: parseInt(data1.data1.data1.extraID),
  //   value: [parseInt(data1.data1.data1.extraID)],
  //   label: data1.data1.data1.extra,
  // };

  const ExtraFromDatabase = data1.data1.data1.extra ? data1.data1.data1.extra.split(",").map((extra) => extra.trim()) : [];
  const ExtraIDFromDatabase = data1.data1.data1.extraID ? data1.data1.data1.extraID.split(",").map((id) => parseInt(id)) : [];

  const isExtra = ExtraFromDatabase != undefined && ExtraIDFromDatabase != undefined;

  const defaultReason = isExtra ? ExtraFromDatabase.map((extra, index) => ({
    value: parseInt(ExtraIDFromDatabase[index]),
    label: extra,
  }))
    : [];

  const [extraValue, setExtraOption] = useState(defaultReason.map((option) => option.value));



  // Market Code
  const handleChange1 = (selectedOption1) => {
    setResTypeValue1(selectedOption1.value);
    //console.log(selectedOption1.label);

  };

  const defaultReason1 = {
    value: data1.data1.data1.reservationTypeID,
    label: data1.data1.data1.reservationTypeDescription,
  };


  // Origin
  const handleChange2 = (selectedOption2) => {
    setOriginValue(selectedOption2.value);
    //console.log(selectedOption2.value);

  };

  const defaultReason2 = {
    value: data1.data1.data1.originID,
    label: data1.data1.data1.origin,
  };

  // Agent
  const handleChange3 = (selectedOption3) => {
    setAgentValue(selectedOption3.value);
    //console.log(selectedOption3.label);

  };

  const defaultReason3 = {
    value: data1.data1.data1.agentID,
    label: data1.data1.data1.accountName,
  };

  //Booker 
  const handleChange4 = (selectedOption4) => {
    setSourceValue(selectedOption4.value);

  };

  const defaultReason4 = {
    value: data1.data1.data1.sourceID,
    label: data1.data1.data1.sourceCode,
  };

  //Reservation Type 
  const handleChange5 = (selectedOption5) => {
    setBookerValue(selectedOption5.value);
    //console.log(selectedOption5.label);

  };

  const defaultReason5 = {
    value: data1.data1.data1.bookerID,
    label: data1.data1.data1.bookerName,
  };

  const handleChange6 = (selectedOption6) => {
    const selectedIds = selectedOption6.map(option => option.value);

    setPreferenceValue(selectedIds);
    //console.log(selectedIds);

  };

  // company selection
  const onCompanySelect = (rowData) => {
    //console.log(rowData)
    setSelectedCompany(rowData.accountName);
    setSelectedCompanyID(rowData.companyid);
    setCompanyModal(false);
  };

  // const preferenceFromDatabase = data1.data1.data1.preference.split(",");
  const preferenceFromDatabase = data1.data1.data1.preference ? data1.data1.data1.preference.split(",").map((preference) => preference.trim()) : [];
  const preferenceIDFromDatabase = data1.data1.data1.preferenceID ? data1.data1.data1.preferenceID.split(",").map((id) => parseInt(id)) : [];


  // const defaultReason6 = {
  //   value: data1.data1.data1.preferenceID,
  //   label: data1.data1.data1.preference.trim(),
  // };
  const isPreference = preferenceFromDatabase != undefined && preferenceIDFromDatabase != undefined;


  const defaultReason6 = isPreference ? preferenceFromDatabase.map((preference, index) => ({
    value: parseInt(preferenceIDFromDatabase[index]),
    label: preference,
  }))
    : [];

  const [preferenceValue, setPreferenceValue] = useState(defaultReason6.map((option) => option.value));


  const handleChange7 = (selectedOption7) => {
    setMarketValue(selectedOption7.value);
    //console.log(selectedOption7.label);

  };

  const defaultReason7 = {
    value: data1.data1.data1.marketID,
    label: data1.data1.data1.marketCode,
  };
  const handleChange8 = (event) => {
    // //console.log(event.target.value)
    setCommentValue(event.target.value);
    // //console.log(selectedOption8.label);

  };
  const handleChange9 = (event) => {
    // //console.log(event.target.value)
    setBillingValue(event.target.value);
    // //console.log(selectedOption8.label);

  };

  const handleChange10 = (event) => {
    // //console.log(event.target.value)
    setETAValue(event.target.value);
    // //console.log(selectedOption8.label);

  };
  const handleChange11 = (event) => {
    // //console.log(event.target.value)
    setETDValue(event.target.value);
    // //console.log(selectedOption8.label);

  };
  const handleChange12 = (event) => {
    // //console.log(event.target.value)
    setGroupNameValue(event.target.value);
    // //console.log(selectedOption8.label);

  };

  // //*Hooks
  // const {
  //   setError,
  //   formState: { errors }
  // } = useForm()

  // ** State
  const [data, setData] = useState(null)

  // ** Hooks
  const { reset, handleSubmit, control,formState: { errors } } = useForm({ defaultValues6 })


  useEffect(() => {
    fetchx(API_URL + '/getBookerList?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        // Booker = resp['data']
        //console.log(resp['data'])
        setRowData(resp['data']);

      })
  }, []);


  useEffect(() => {
    fetchx(API_URL + '/getAgents?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        // Booker = resp['data']
        //console.log(resp['data'])
        setRowData2(resp['data']);

      })
  }, []);


  useEffect(() => {
    const getByID = JSON.stringify({
      hotelID: 1,
      agentID: data1.data1.data1.agentID
    })
    fetchx(API_URL + '/getAgentByID', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: getByID
    })
      .then(result => result.json())
      .then(resp => {
        // Booker = resp['data']
        //console.log(resp['data'])
        let account = resp['data'][0]
        if (resp['data'].length) {
          setAgentLabel(account.accountName)
        }
        else {
          setAgentLabel(null)
        }
      })
  }, []);

  //onsubmit data post
  const onSubmit = data => {
    setData(data)
    const createmarketGroup = JSON.stringify({
      ETA: etaValue,
      ETD: etdValue,
      resType: resTypeValue,
      origin: originValue,
      agent: agentValue,
      source: sourceValue,
      booker: bookerValue,
      market: marketValue,
      comment: commentValue,
      billingInstructions: billingValue,
      features: preferenceValue == null ? null : preferenceValue,
      tempReservationID: data1.data1.data1.tempReservationID,
      reservationID: data1.data1.data1.id,
      extras: extraValue == null ? null : extraValue,
      groupName: GroupName || null,
      noPost: checkBoxValue1,
      dnm: checkBoxValue2,
      printRate: checkBoxValue3,
      sharingID: data1.data1.data1.sharingID,
      companyID: selectedCompanyID

    })
    //console.log(createmarketGroup)
    //console.log(extraValue.length, preferenceValue.length)
    let res = fetchx(API_URL + "/modifyBookingInformation", {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: createmarketGroup
    }).then((data) => data.json())
      .then((res) => {
        //console.log(res)
        handleSuccess()
        setTimeout(() => { navigate('/dashboard/frontdesk'); }, 500)
      })
    //  if(extraValue.length == 0 || preferenceValue.length == 0){
    //   setTimeout(() => { navigate('/dashboard/testFrontDesk'); }, 500)

    //  }
    // })

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
    console.log("cellClicked", event);
    // setfilldata(event["data"]);
    setBookerValue(event.data.id)
    setBookerLabel(event.data.name)
  }, []);

  const cellClickedListener2 = useCallback((event) => {
    //console.log("cellClicked", event);
    // setfilldata(event["data"]);
    setAgentValue(event.data.companyid)
    setAgentLabel(event.data.accountName)
  }, []);

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


  // to add booker
  function addBooker() {
    // ** Hooks
    const {
      setError,
      formState: { errors }
    } = useForm()




    // ** State
    const [data, setData] = useState(null);

    // ** Hooks
    const { reset, handleSubmit, control } = useForm({})


    const onSubmit = (data) => {
      setData(data);
      //console.log(data)
      {
        //console.log(data);
        let createasset = JSON.stringify({
          // "hotelID": data.hotelID,
          "accountID": data.company.value,
          "name": data.name,
          "emailID": data.emailID,
          "phone": data.phone,
          "addressLine1": data.addressLine1,
          "addressLine2": data.addressLine2,
          "country": data.country.value,
          "state": data.state.value,
          "city": data.city,
          "postalCode": data.postalCode,
          "isActive": data.isActive.value,
        });
        //console.log(createasset);
        let res = fetchx(API_URL + "/addbooker", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: createasset,
        }).then((res) => {
          //console.log(res);
          if (res['status'] == 200) {
            // setTimeout(() => {  window.location.reload(true); }, 4000);          

          }
        });

      }
    };
    const handleReset = () => {
      reset({
        accountID: "",
        name: "",
        emailID: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        country: null,
        state: null,
        city: "",
        postalCode: "",
        isActive: null,
      });
    };





  };

  //Search element
  const onFilterTextBoxChanged12 = useCallback(() => {
    gridRef3.current.api.setQuickFilter(
      document.getElementById('filter-text').value
    )
  }, [])

  // const [reload, setreload] = useState(true)
  // setTimeout(()=>{setreload(true)},1)

  const handleAgentClear = () => {
    setAgentValue(null)
    setAgentLabel(null)
    setReload(!reload); // Toggle the reload state to trigger a re-render
  };

  const handleCompanyClear = () => {
    setSelectedCompany(null);
    setSelectedCompanyID(null);
    setReload(!reload); // Toggle the reload state to trigger a re-render
  };

  const handleBookerClear = () => {
    setBookerValue(null);
    setBookerLabel(null);
    setReload(!reload); // Toggle the reload state to trigger a re-render
  };

  return (
    <div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {/* ETA */}
          <Col md='4' sm='8'>
            <div className='mb-1'>
              <Label className='form-label' for='eta'>
                ETA
              </Label>
              <Controller
                control={control}
                id='eta'
                name='eta'
                render={({ field }) =>
                  <Input type='time' placeholder='Agent' invalid={errors.eta && true}
                    defaultValue={data1.data1.data1.ETA}
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
                    defaultValue={data1.data1.data1.ETD}
                    {...field}
                    onChange={handleChange11}
                  />}
              />
            </div>
          </Col>

          {/* Reservation Types */}
          <Col md='4' sm='8'>
            <div className='mb-1'>
              <Label className='form-label' for='resType'>
                Reservation Type
              </Label>
              <Controller
                id='resType'
                control={control}
                name='resType'
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

                    // className={classnames('react-select', { 'is-invalid': data !== null && data.resType === null })}
                    // {...field}
                    onChange={handleChange1}
                  />
                )}
              />
            </div>
          </Col>



          {/* Source Options */}
          <Col md='4' sm='8'>
            <div className='mb-1'>
              <Label className='form-label' for='source'>
                Source
              </Label>
              <Controller
                // defaultValue={sourceCode[2]}
                id='source'
                control={control}
                name='source'
                render={({ field }) => (
                  <Select
                    // isMulti
                    defaultValue={defaultReason4}
                    isClearable
                    options={sourceCode}
                    classNamePrefix='select'
                    theme={selectThemeColors}
                    className={classnames('react-select', { 'is-invalid': data !== null && data.source === null })}
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
              <Label className='form-label' for='market'>
                Market
              </Label>
              <Controller
                id='market'
                control={control}
                name='market'
                render={({ field }) => (
                  <Select
                    // isMulti
                    defaultValue={defaultReason7}
                    isClearable
                    options={marketCode}
                    classNamePrefix='select'
                    theme={selectThemeColors}
                    className={classnames('react-select', { 'is-invalid': data !== null && data.market === null })}
                    {...field}
                    onChange={handleChange7}
                  />
                )}
              />
            </div>
          </Col>


          {/* Origin options */}
          <Col md='4' sm='8'>
            <div className='mb-1'>
              <Label className='form-label' for='origin'>
                Origin
              </Label>
              <Controller
                id='origin'
                control={control}
                name='origin'
                render={({ field }) => (
                  <Select
                    isClearable
                    required
                    defaultValue={defaultReason2}
                    options={Origin}
                    classNamePrefix='select'
                    theme={selectThemeColors}
                    className={classnames('react-select', { 'is-invalid': data !== null && data.origin === null })}
                    {...field}
                    onChange={handleChange2}
                  />
                )}
              />
            </div>
          </Col>

          {/* Extras Options */}
          <Col md='4' sm='8'>
            <div className='mb-1'>
              <Label className='form-label' for='extras' >
                Select Extra
              </Label>
              <Controller
                id='extras'
                control={control}
                name='extras'
                render={({ field }) => (
                  <Select
                    isMulti
                    isClearable
                    defaultValue={defaultReason}
                    options={extraName}
                    classNamePrefix='select'
                    theme={selectThemeColors}
                    className={classnames('react-select', { 'is-invalid': data !== null && data.extras === null })}
                    {...field}
                    onChange={handleChange}

                  />
                )}
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
                // defaultValue={DefaultAgent[0]}
                id='agent'
                control={control}
                name='agent'
                key={reload} // Use the reload state to force a re-render

                render={({ field }) => (
                  <Input
                    // required

                    // isClearable
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



          {/* Billing Instructions */}
          <Col md='4' sm='8'>
            <div className='mb-1'>
              <Label className='form-label' for='billingInstructions'>
                Billing Instructions
              </Label>
              <Controller
                // defaultValue=''
                control={control}
                id='billingInstructions'
                name='billingInstructions'
                render={({ field }) =>
                  <Input
                    placeholder='Comment'
                    invalid={errors.billingInstructions && true}
                    defaultValue={data1.data1.data1.billingInstruction}
                    {...field}
                    onChange={handleChange9}
                  />
                }
              />
            </div>
          </Col>



          {/* Features Options */}
          <Col md='4' sm='8'>
            <div className='mb-1'>
              <Label className='form-label' for='features'>
                Features / Preferences
              </Label>
              <Controller
                id='features'
                control={control}
                name='features'
                render={({ field }) => (
                  <Select
                    isMulti
                    isClearable
                    defaultValue={defaultReason6}
                    options={Features}
                    classNamePrefix='select'
                    theme={selectThemeColors}
                    className={classnames('react-select', { 'is-invalid': data !== null && data.features === null })}
                    {...field}
                    onChange={handleChange6}
                  />
                )}
              />
            </div>
          </Col>










          <Col md='4' sm='8'>
            <div className='mb-1'>
              <Label className='form-label' for='companyName'>
                Company Name
              </Label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
              <Input type="text" name='companyName' placeholder='Select agent'
                value={selectedCompany}
                onClick={() => setCompanyModal(!companyModal)}
              // <span>X</span>
              key={reload} // Use the reload state to force a re-render

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






          {/* Comments */}
          <Col md='4' sm='8'>
            <div className='mb-1'>
              <Label className='form-label' for='comment'>
                Comment
              </Label>
              <Controller
                control={control}
                id='comment'
                name='comment'
                render={({ field }) =>
                  <Input
                    placeholder='Comment'
                    invalid={errors.comment && true}
                    defaultValue={data1.data1.data1.comments}
                    {...field}
                    onInput={handleChange8}
                  />
                }
              />
            </div>
          </Col>






          {/* Group Name */}
          <Col md='4' sm='8'>
            <div className='mb-1'>
              <Label className='form-label' for='groupName'>
                Group Name
              </Label>
              <Controller
                // defaultValue=''
                control={control}
                id='groupName'
                name='groupName'
                render={({ field }) =>
                  <Input
                    placeholder='Group Name'
                    invalid={errors.groupName && true}
                    defaultValue={data1.data1.data1.groupName}
                    {...field}
                    onChange={handleChange12}
                  />
                }
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
                // defaultValue={localStorage.getItem('sourcecode')}
                id='booker'
                control={control}
                name='booker'
              key={reload} // Use the reload state to force a re-render

                render={({ field }) => (
                  <Input type="text" name='booker' placeholder='Select Booker'
                    // required
                    onClick={() => { setBookerModal(true) }}
                    // onChange={handleChange5}
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

          {/* Room Type to Charge */}
          <Col md='4' sm='8'>
            <div className='mb-1'>
              <Label className='form-label' for='roomToCharge'>
                Room To Charge
              </Label>
              <Controller
                // defaultValue=''
                control={control}
                id='roomToCharge'
                name='roomToCharge'
                render={({ field }) =>
                  <Input
                    disabled={true}
                    placeholder='Room To Charge'
                    invalid={errors.roomToCharge && true}
                    defaultValue={data1.data1.data1.roomType}
                    {...field}
                    onChange={handleChange12}
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
                    defaultValue={data1.data1.data1.blockCodeID}
                    {...field}
                    disabled={true}

                    onChange={handleChange9}
                  />
                }
              />
            </div>
          </Col>
          <Row>
            <Col md='3' sm='12' className='mb-1'>

              <div className='form-check form-check-inline'>
                <Input type='checkbox' id='basic-cb-unchecked' checked={checkboxChecked1} onChange={handleCheckboxChange1} />
                <Label for='noPost' className='form-check-label'>
                  No Post
                </Label>
              </div>
            </Col>
            <Col md='3' sm='12' className='mb-1'>

              <div className='form-check form-check-inline'>
                <Input type='checkbox' id='basic-cb-unchecked' checked={checkboxChecked2} onChange={handleCheckboxChange2} />
                <Label for='dnm' className='form-check-label'>
                  DNM
                </Label>
              </div>
            </Col>
            <Col md='3' sm='12' className='mb-1'>

              <div className='form-check form-check-inline'>
                <Input type='checkbox' id='basic-cb-unchecked' checked={checkboxChecked3} onChange={handleCheckboxChange3} />
                <Label for='dnm' className='form-check-label'>
                  print Rate
                </Label>
              </div>
            </Col>
          </Row>
          <br></br>
          <br></br>
          <br></br>
          {/* On submit buttons */}
          <div align='end' className='d-flex'>
            <Button className='me-1' color='primary' type='submit'>
              Submit
            </Button>
            <Button outline color='secondary' type='reset' onClick={handleReset}>
              Reset
            </Button>
          </div>


        </Row>
      </Form>


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

      {/* <div>
        <Modal
          isOpen={agentModal} toggle={() => setAgentModal(!agentModal)} className="modal-xl"
        >
          <ModalHeader className="bg-transparent" toggle={() => setAgentModal(!agentModal)}>Select Agent</ModalHeader>
          <ModalBody className="pb-3 px-sm-1 mx-20">
            <div>
              {addBooker}
            </div>
          </ModalBody>
        </Modal>
      </div> */}
    </div>
  )

}

export default ModifyBookingInfo