import {  useState } from "react";
import Select from "react-select";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";
import { Plus, Minus } from 'react-feather'
import { selectThemeColors } from "@utils";
import Moment from "moment";
import { Input, Card, Form, Row, Col, Label, Button, Modal, ModalHeader, ModalBody,} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useRef, useEffect, useMemo, useCallback } from "react";
import API_URL from "../../../config";

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Spinner } from 'reactstrap';
const MySwal = withReactContent(Swal)

const defaultValues = {
  IDType1: null,
  idNumber1: "",
  issueDate1: "",
  expiryDate1: "",
  issuePlace1: "",
  name1: "",
  idFile1: "",
};




const IDDetails = ({ stepper3, type, data1 }) => {
  //console.log(data1)
  const [idDetail, setIDDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [store,setStore] = useState(data1);
  const [reload, setreload] = useState(true);
  const [load, setload] = useState(true);
  const [voucherId,setVoucherId] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState([]);
  const [basicModal, setBasicModal] = useState(false)
  const [rowData, setRowData] = useState();
  const [rowData2, setRowData2] = useState();
  const [rowData3, setRowData3] = useState();
  const [redemptionModal, setRedemptionModal] = useState(false); 
  const gridRef = useRef(null);
  const gridRef1 = useRef()
  const gridRef3 = useRef(null)
  let navigate = useNavigate();
  const {setError,formState: { errors },} = useForm();
  const [data, setData] = useState(null);
  const today = Moment().format('YYYY-MM-DD');
  // const options = { minDate: today};
  // const options1 = { maxDate: today}; 
  // const [selectedValue, setSelectedOption] = useState("");
  // const [bookerList, getBookerList] = useState()

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [membershipId, setMembershipId] = useState(null);
  const lookupValue = (mappings, key) => { return mappings[key]}
 
  const extractKeys = (mappings) => {
    return Object.keys(mappings)
  }





  const onSelectionChanged = (ref, setSelection) => {
    const selectedRows = ref.current.api.getSelectedRows();
    //console.log("Selected rows:", selectedRows);
    setSelection(selectedRows);
  };

  const columnDefs3 = useMemo(() => [
    {
      headerName: "Voucher Code",
      field: "voucherCode",
      suppressSizeToFit: true,
      filter: true ,
      tooltipField: 'voucherdescription',
      maxWidth: 150,
    },
    {
      headerName: "Name",
      field: "Name", 
      suppressSizeToFit: true,
      tooltipField: 'voucherdescription',
      maxWidth: 150,
    },

    {
      headerName: "Voucher ID",
      field: "voucherId",
      suppressSizeToFit: true,
      hide: true,
      tooltipField: 'voucherdescription',
      maxWidth: 150,
    }, {
      headerName: "Membership ID",
      field: "membershipId", 
      suppressSizeToFit: true,
      hide: true,
      tooltipField: 'voucherdescription',
      maxWidth: 150,
    },
    {
      headerName: "Voucher Description",
      field: "voucherdescription",
      tooltipField: 'voucherdescription',
      maxWidth: 300,
    },
    {
      headerName: "Redeemed On",
      field: "RedeemedOn",
      tooltipField: 'voucherdescription',
      maxWidth: 150,
    },

    {
      headerName: "Resettle",
      field: "action",
      suppressSizeToFit: true,
      maxWidth: 140,
    
     cellRenderer: "resettleButtonRenderer",
    },
  ], []);

  // Function to handle opening/closing of the Redemption History modal
  const toggleRedemptionModal = () => setRedemptionModal(!redemptionModal);



  useEffect(() => {
    if (data1 && Object.keys(data1).length > 0) {
      setStore(data1);
    }
  }, [data1, setStore]);

  

const RedeemButton = (params) => {
  const [isLoading, setIsLoading] = useState(false);
  const isRedeemed = params.data.isExhausted === 1;
  const { data1 } = params.context;
  
  
  const style = document.createElement('style');
  style.innerHTML = `
    .swal2-actions {
      gap: 20px;
    }
      .swal2-confirm, .swal2-cancel {
    min-width: 100px; 
  }
  `;
  document.head.appendChild(style);
  

  const handleSingleRedeem = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to redeem this voucher?',
      icon: 'warning',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Yes!',
}).then((result) => {
if (result.isConfirmed) {
  //console.log(params.data);
  //console.log(params.data.redemptionType);
  fetchx(`${API_URL}/redeemMappedVoucher`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: params.data.id,
      validFrom: params.data.validFrom,
      validTo: params.data.validTo,
      membershipId: params.data.membershipId,
      guestId: data1.guestID,
      voucherType: params.data.redemptionType,
      quantity: params.data.quantity,
      voucherId: params.data.voucherId

    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      return response.json();
    })
    .then(() => {
      fetchx(`${API_URL}/getMembershipVoucher?id=${data1.guestID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .then((data) => {
          params.api.setRowData(data['data']);
        });

      Swal.fire({
        title: 'Redeemed!',
        text: 'Your voucher has been redeemed.',
        icon: 'success',
      });
    })
    .catch((error) => {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
      });
    });
}
});
};



const handleClick = () => {

  handleSingleRedeem();
  };

return (
<div>
<Button
  color='primary'
  onClick={handleClick}
  disabled={isRedeemed || isLoading}
>
  {isLoading ? <Spinner size='sm' /> : 'Redeem'}
</Button>
</div>
);
};

///Resettle//

const ResettleButton = (params) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data1 } = params.context;

  
  
  const style = document.createElement('style');
  style.innerHTML = `
    .swal2-actions {
      gap: 20px;
    }
      .swal2-confirm, .swal2-cancel {
    min-width: 100px; 
  }
  `;
  document.head.appendChild(style);
  

  const handleResettle = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to resettle this voucher?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        //console.log(params.data);
        fetchx(`${API_URL}/resettleRedeemedVoucher`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({   
            membershipId: params.data.membershipId,
            voucherId: params.data.voucherId
          }),
        })
          .then(async (response) => {
            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message);
            }
            return response.json();
          })
          .then(() => {
            return fetchx(`${API_URL}/getVoucherRedeemptionHistory?guestID=${data1.guestID}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            });
          })
          .then((res) => res.json())
          .then((data) => {
            setRowData3(data['data']);
  
            return fetchx(`${API_URL}/getMembershipVoucher?id=${data1.guestID}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            });
          })
          .then((res) => res.json())
          .then((data) => {
            setRowData(data['data']);
          })
          .then(() => {
            Swal.fire({
              title: 'Resettled!',
              text: 'Your voucher has been resettled.',
              icon: 'success',
            });
          })
          .catch((error) => {
            Swal.fire({
              title: 'Error!',
              text: error.message,
              icon: 'error',
            });
          });
      }
    });
  };
  



const handleClickResettle = () => {

  handleResettle();
  };

return (
<div>
<Button
  color='primary'
  onClick={handleClickResettle}
  disabled={isLoading}
>
  {isLoading ? <Spinner size='sm' /> : 'Resettle'}
</Button>
</div>
);
};




const columnDefs = useMemo(
    () => [
      {
        headerName: "Voucher Code",
        field: "voucherCode",
        suppressSizeToFit: true,
        tooltipField: 'description',
        maxWidth: 150,
        cellStyle: (params) => {
          if (params.data.isExhausted === 1) {
            return { backgroundColor: '#F1C40F' };
          }
          return null;
        }
      },

      {
        headerName: "Quantity",
        field: "quantity",
        suppressSizeToFit: true,
        tooltipField: 'description',
        maxWidth: 150,
        cellStyle: (params) => {
          if (params.data.isExhausted === 1) {
            return { backgroundColor: '#F1C40F' };
          }
          return null;
        }
      },
      {
        headerName: "Voucher ID",
        field: "voucherId",
        hide: true,
        tooltipField: 'description',
        maxWidth: 150,
        cellStyle: (params) => {
          if (params.data.isExhausted === 1) {
            return { backgroundColor: '#F1C40F' };
          }
          return null;
        }
      },

     
      {
        headerName: "Voucher Type ",
        field: "redemptionType",
        tooltipField: 'description',
        maxWidth: 300,
        cellStyle: (params) => {
          if (params.data.isExhausted === 1) {
            return { backgroundColor: '#F1C40F' };
          }
          return null;
        }
      },
      {
        headerName: "Voucher Description ",
        field: "description",
        tooltipField: 'description',
        maxWidth: 300,
        cellStyle: (params) => {
          if (params.data.isExhausted === 1) {
            return { backgroundColor: '#F1C40F' };
          }
          return null;
        }
      },
      {
        headerName: "Valid From",
        field: "validFrom",
        tooltipField: 'description',
        maxWidth: 150,
        cellStyle: (params) => {
          if (params.data.isExhausted === 1) {
            return { backgroundColor: '#F1C40F' };
          }
          return null;
        }
      },
      {
        headerName: "Valid Till",
        field: "validTo",
        tooltipField: 'description',
        maxWidth: 150,
        cellStyle: (params) => {
          if (params.data.isExhausted === 1) {
            return { backgroundColor: '#F1C40F' };
          }
          return null;
        }
      },
 

      {
        headerName: "Redeemed",
        field: "isExhausted",
        suppressSizeToFit: true,
        tooltipField: 'description',
        maxWidth: 150,
        valueFormatter: (params) => (params.value === 1 ? "Yes" : "No"),
        cellStyle: (params) => {
          if (params.data.isExhausted === 1) {
            return { backgroundColor: '#F1C40F' };
          }
          return null;
        }
      },
      {
        headerName: "Action",
        field: "action",
        suppressSizeToFit: true,
        maxWidth: 140,
       // cellRenderer: RedeemButton,
       cellRenderer: "redeemButtonRenderer",
      },

      
    ],
    []
  );


  
  const columnDefs2 = useMemo(() => [
    {
      headerName: 'Select',
      field: 'checkbox',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      maxWidth: 50,
    },
    { headerName: "Voucher Code", field: "voucherCode", suppressSizeToFit: true, maxWidth: 150 },
    { headerName: "Voucher Description", field: "description", tooltipField: 'description', maxWidth: 200, cellStyle: { 'white-space': 'normal' }, autoHeight: true, flex: 4 },
 
    { headerName: "Voucher Type", field: "redemptionType", suppressSizeToFit: true, maxWidth: 150 },
  ], []);

 
const cellClickedListener = useCallback((event) => {
    setVoucherId(event["data"]["id"]);
  }, []);

  


useEffect(() => {
 // //console.log(data1.id)
    fetchx(API_URL + `/getMembershipVoucher?id=${data1.guestID}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
    })
    .then(result => result.json())
    .then(resp => {
        setRowData(resp['data']);
        
        //console.log(resp['data']);
    });
}, [data1]); 

useEffect(() => {
  ////console.log(data1.id)
    fetchx(API_URL + `/getVoucherRedeemptionHistory?guestID=${data1.guestID}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
    })
    .then(result => result.json())
    .then(resp => {
        setRowData3(resp['data']);
        
        //console.log(resp['data']);
    });
}, [data1 && redemptionModal===true]); 

useEffect(() => {
    fetchx(API_URL + `/getAllVoucher`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
    })
    .then(result => result.json())
    .then(resp => {
        setRowData2(resp['data']);
     //   //console.log(resp['data']);
    });
}, [data1]); 

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset"],
    },
  }));


  const defaultColDef2 = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "clear"],
    },
  }), []);
  
  const defaultColDef3 = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ["apply", "reset", "cancel"],
    },
  }), []);



  const { reset, handleSubmit, control,watch } = useForm({ defaultValues });


  const onSubmit = (event) => {
    event.preventDefault();
  
    if (selectedRows.length === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'No voucher selected',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
  
    const requestData = {
      vouchers: selectedRows.map(voucher => ({
        voucherid: voucher.id,
        quantity: voucher.quantity,
        redemptionType: voucher.redemptionType
      })),
      membershipId: data1.membershipID,
      guestId: data1.guestID
    };
    //console.log(requestData);
  
    fetchx(API_URL + '/assignVouchersToMembers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        setFormSubmitted(true);
        setBasicModal(false);
        Swal.fire({
          title: 'Success!',
          text: 'Membership Voucher added successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        //console.log(data1.membershipID);
        return fetchx(API_URL + `/getMembershipVoucher?id=${data1.guestID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        throw new Error(data.message || 'Select Voucher before Submit');
      }
    })
    .then(response => response.json())
    .then(resp => {
      setRowData(resp.data);
      //console.log(resp.data);
      setSelectedRows([]);
    })
    .catch(error => {
      Swal.fire({
        title: 'Error!',
        text: `${error.message}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    });
  };
  





  const navigatepage = () => {
    navigate('');
};


  const handleSelect = (voucher) => {
    setSelectedVoucher(voucher);
    setBasicModal(false); 
  };

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef1.current.api.setQuickFilter(
      document.getElementById('filter-text-box2').value
    )
  }, [])

  const onFilterTextBoxChanged2 = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    )
  }, [])

  const onFilterTextBoxChanged3 = useCallback(() => {
    gridRef3.current.api.setQuickFilter(
      document.getElementById('filter-text-box3').value
    )
  }, [])

  
  const handleBookerClear = () => {
    setSelectedVoucher()
  };



  const handleReset = () => {
    reset({
      IDType1: null,
      idNumber1: "",
      issueDate1: "",
      expiryDate: "",
      issuePlace1: "",
      name1: "",
      idFile1: "",
    });
  };
  const [modal, setModal] = useState(false);
 

  const handleModal = () => setModal(!modal);

  return (
    <div>
      <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-lg'>
        <ModalHeader toggle={() => setBasicModal(!basicModal)}>All Vouchers</ModalHeader>
        <ModalBody>
          <div>
            <Row className='mb-1'>
              <Col md='3' sm='12' className='me-1'>
                <Label className='form-label' for='fullName'>
                  Search
                </Label>
                <Input
                  type='text'
                  id='filter-text-box2'
                  placeholder='Filter...'
                  onInput={onFilterTextBoxChanged}
                />
              </Col>
              <Col className='text-end'>
                <Button color='primary' onClick={onSubmit}>
                  Assign
                </Button>
              </Col>
            </Row>
          </div>
          <div className='ag-theme-alpine' style={{ height: 520 }}>
            <AgGridReact
              ref={gridRef1}
              rowData={rowData2}
              columnDefs={columnDefs2}
              animateRows={true}
              onCellClicked={cellClickedListener}
              rowSelection='multiple'
              //paginationPageSize={10}
             // pagination={true}
              defaultColDef={defaultColDef2}
              headerColor='ddw-primary'
              onSelectionChanged={() => onSelectionChanged(gridRef1, setSelectedRows)}
            />
          </div>
        </ModalBody>
      </Modal>

      <div>
        <Button color='primary' className='me-1' type='button' onClick={() => setBasicModal(!basicModal)}>
          Assign Voucher
        </Button>
      </div>
      <Modal isOpen={redemptionModal} toggle={toggleRedemptionModal} className='modal-lg'>
        <ModalHeader toggle={toggleRedemptionModal}>Redemption History</ModalHeader>
        <ModalBody>
        <div>
        <Col md="3" sm="12" className="mb-1">
          <Label className="form-label" for="fullName">
            Search
          </Label>
          <Input
            type="text"
            id="filter-text-box3"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged3}
          />
        </Col>
      </div>
          <div className='ag-theme-alpine' style={{ height: 500 }}>
            <AgGridReact
             ref={gridRef3}
              rowData={rowData3}
              columnDefs={columnDefs3}
              animateRows={true}
              pagination={true}
              paginationPageSize={10}
              defaultColDef={defaultColDef3}
              headerColor='ddw-primary'
              components={{ resettleButtonRenderer: ResettleButton}}
              context={{ data1 }}
            />
          </div>
        </ModalBody>
      </Modal>
      <div className="d-flex justify-content-end">
      <Col md="3" sm="12" className="d-flex justify-content-end me-1" >
        <Button color="primary" onClick={() => setRedemptionModal(true)}>
          Redeemption History
        </Button>
      </Col>
    </div>
      <br />
      <div>
        <Col md="3" sm="12" className="mb-1">
          <Label className="form-label" for="fullName">
            Search
          </Label>
          <Input
            type="text"
            id="filter-text-box"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged2}
          />
        </Col>
      </div>
      <div className='ag-theme-alpine' style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection='multiple'
          onCellClicked={cellClickedListener}
          paginationAutoPageSize={true}
          paginationPageSize={10}
          pagination={true}
          defaultColDef={defaultColDef}
          headerColor='ddw-primary'
          context={{ data1 }} 
          components={{ redeemButtonRenderer: RedeemButton  }} 
        />
      </div>
      <br />
      <br />
      <div align='end' className='buttons'>
        <Button color='primary' className='me-1' type='button' onClick={navigatepage}>
          Exit
        </Button>
      </div>
    </div>
  );
};

export default IDDetails;