import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Row,
  Col,
  Label,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
} from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import API_URL from '../../../config';

const MySwal = withReactContent(Swal);

const Block = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [voucherSelected, setVoucherSelected] = useState([]);
 // //console.log(voucherSelected);
  const gridBirthdayRef = useRef();
  const gridAnniversaryRef = useRef();
  const gridVoucherRef = useRef();

  const [birthdayData, setBirthdayData] = useState([]);
  const [anniversaryData, setAnniversaryData] = useState([]);
  const [voucherData, setVoucherData] = useState([]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    fetchx(`${API_URL}/getBirthdayDetails`)
      .then((res) => res.json())
      .then((data) => setBirthdayData(data.data));

    fetchx(`${API_URL}/getAnniversaryDetails`)
      .then((res) => res.json())
      .then((data) => setAnniversaryData(data.data));
  }, []);

  useEffect(() => {
    fetchx(`${API_URL}/getAllVoucher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => setVoucherData(data.data));
  }, []);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      paginationAutoPageSize: true,
      paginationPageSize: 10,
    }),
    []
  );

  const birthdayColumnDefs = [
    {
      headerName: 'Select',
      field: 'checkbox',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      maxWidth: 50,
    },
    { headerName: 'Membership No.', field: 'membershipNo', maxWidth: 200 },
    { headerName: 'Name', field: 'fullName', maxWidth: 200 },
    { headerName: 'DOB', field: 'dob', maxWidth: 200 },

    { headerName: 'Mobile', field: 'phoneNumber', maxWidth: 160 },
  ];

  const anniversaryColumnDefs = [
    {
      headerName: 'Select',
      field: 'checkbox',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      maxWidth: 50,
    },
    { headerName: 'ID', field: 'id', maxWidth: 120 },
    { headerName: 'Name', field: 'fullName', maxWidth: 200 },
    { headerName: 'Anniversary', field: 'anniversary', maxWidth: 200 },
    { headerName: 'Mobile', field: 'phoneNumber', maxWidth: 160 },
  ];

  const voucherColumnDefs = [
    {
      headerName: 'Select',
      field: 'checkbox',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly:true,
      maxWidth: 50,
    },
    { headerName: 'Voucher Code', field: 'voucherCode', maxWidth: 150 },
    { headerName: 'Description', field: 'description', maxWidth: 300,autoHeight: true,flex: 4 ,cellStyle: { 'white-space': 'normal' }  },
  ];

  const onSelectionChanged = (ref, setSelection) => {
    const selectedRows = ref.current.api.getSelectedRows();
   //console.log('Selected rows:', selectedRows);
    setSelection(selectedRows);
  };

  const onFilterTextBoxChanged = (ref) => {
    return () => {
      const filterText = document.getElementById('filter-text-box').value;
      ref.current.api.setQuickFilter(filterText);
    };
  };

  const onFilterVoucherTextBoxChanged = () => {
    const filterText = document.getElementById('filter-text-box-voucher').value;
    gridVoucherRef.current.api.setQuickFilter(filterText);
  };

  const handleSendAction = () => {
    setIsModalOpen(true);
  };

  const handleSendPromoVouchers = () => {
    if (voucherSelected.length === 0 || selectedRows.length === 0) {
      MySwal.fire({
        title: 'Error!',
        text: 'Please select at least one voucher and one Member',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (voucherSelected.length > 4) {
      MySwal.fire({
        title: 'Error!',
        text: 'Maximum 4 Vouchers are allowed to send at a time',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    const occasion = activeTab === '1' ? 'Birthday' : 'Anniversary';

    const requestData = {
      membershipDetails: selectedRows.map((row) => ({
        membershipid: row.id,
        phoneNumber: row.phoneNumber,
        Name:row.fullName,
      })),
      vouchers: voucherSelected.map((voucher) => ({
        voucherid: voucher.id,
        description: voucher.description,
      })),
      occasion,
    };
    //console.log(requestData);

    fetchx(`${API_URL}/sendPromoVouchers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          MySwal.fire({
            title: 'Success!',
            text: 'Promo vouchers sent successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          MySwal.fire({
            title: 'Error!',
            text: 'An error occurred while sending the promo vouchers.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      })
      .catch((error) => {
        MySwal.fire({
          title: 'Error!',
          text: `Error: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });

    setIsModalOpen(false); 
  };

  return (
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => toggleTab('1')}>
            Birthday
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => toggleTab('2')}>
            Anniversary
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId='1'>
          <Row>
            <Col md='3' sm='12'>
              <Label>Search</Label>
              <Input
                type='text'
                id='filter-text-box'
                placeholder='Filter...'
                onInput={onFilterTextBoxChanged(gridBirthdayRef)}
              />
            </Col>
          </Row>
          <Col style={{ marginBottom: '15px' }} className='d-flex justify-content-end'>
  <Button color='primary' onClick={handleSendAction}>
    Send Vouchers to Selected Guest
  </Button>
</Col>
          <div className='ag-theme-alpine' style={{ height: 520 }}>
            <AgGridReact
              ref={gridBirthdayRef}
              rowData={birthdayData}
              columnDefs={birthdayColumnDefs}
              animateRows
              rowSelection='multiple'
              suppressRowClickSelection
              defaultColDef={defaultColDef}
              onSelectionChanged={() => onSelectionChanged(gridBirthdayRef, setSelectedRows)}
            />
          </div>
        </TabPane>

        <TabPane tabId='2'>
          <Row>
            <Col md='3' sm='12'>
              <Label>Search</Label>
              <Input
                type='text'
                id='filter-text-box'
                placeholder='Filter...'
                onInput={onFilterTextBoxChanged(gridAnniversaryRef)}
                
              />
            </Col>
          </Row>
          <Col style={{ marginBottom: '15px' }} className='d-flex justify-content-end'>
            <Button color='primary' onClick={handleSendAction}>
              Send Vouchers to Selected Guest
            </Button>
          </Col>
          <div className='ag-theme-alpine' style={{ height: 520 }}>
            <AgGridReact
              ref={gridAnniversaryRef}
              rowData={anniversaryData}
              columnDefs={anniversaryColumnDefs}
              animateRows
              rowSelection='multiple'
              suppressRowClickSelection
              defaultColDef={defaultColDef}
             // onSelectionChanged={() => onSelectionChanged(gridVoucherRef, setVoucherSelected)}
             onSelectionChanged={() => onSelectionChanged(gridAnniversaryRef, setSelectedRows)}
            />
          </div>
        </TabPane>
      </TabContent>

      <Modal size='lg' isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
        <ModalHeader toggle={() => setIsModalOpen(false)}>Select a Voucher</ModalHeader>
        <ModalBody>
          <Form>
            <Row className='align-items-center justify-content-between'>
              <Col md='4' sm='12'>
                <Label>Search Vouchers</Label>
                <Input
                  type='text'
                  id='filter-text-box-voucher'
                  placeholder='Filter vouchers...'
                  onInput={onFilterVoucherTextBoxChanged}
                />
              </Col>
              <Col className='d-flex justify-content-end'>
                <Button color='primary' onClick={handleSendPromoVouchers}>
                  Send SMS
                </Button>
              </Col>
            </Row>
            <div className='ag-theme-alpine' style={{ height: 400, marginTop: 10 }}>
              <AgGridReact
                ref={gridVoucherRef}
                rowData={voucherData}
                columnDefs={voucherColumnDefs}
                rowSelection='multiple'
                suppressRowClickSelection
                animateRows
                defaultColDef={defaultColDef}
                onSelectionChanged={() => onSelectionChanged(gridVoucherRef, setVoucherSelected)}
              />
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Block;
