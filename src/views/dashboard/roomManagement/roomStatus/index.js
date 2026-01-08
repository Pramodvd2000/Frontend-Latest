// // ** Custom Components
import React, { useEffect,useState } from 'react'
import ValidationThirdPartyComponents from './roomCardShow'
import { Nav, TabPane, NavItem, NavLink, TabContent, Table, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, Button, Modal, ModalBody, ModalHeader, Card, CardBody, CardHeader, CardTitle, Form, Row, Col, Label } from 'reactstrap'
import { MoreVertical, Edit, Trash, List, Grid } from 'react-feather'
import API_URL from '../../../../config'
import { Fragment } from 'react'
import RoomListView from './listView'
import { selectThemeColors } from '@utils'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import classnames from 'classnames'
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
const Availability = (roomAssign) => {
  const [active, setActive] = useState('')
  const [reload, setreload] = useState(true)
  const [gridViewList, setGridViewList] = useState(true)
  const [rowData, setRowData] = useState();
  const [openSyncRoom, setOpenSyncRoom] = useState();
  const [rooms, setRooms] = useState([])
  const [SelectedValue, setSelectedValue] = useState()


  const { control } = useForm({})

  const handleChange = (selectedOption) => {
    console.log(selectedOption)
    setSelectedValue(selectedOption.value);
    // if (selectedOption && selectedOption.value === data1.data1.data1.roomTypeID) {
    //   let msg = "Please select a different room type";
    //   handleError(msg)
    // }
  };


  const handleSuccess = (message) => {
    return MySwal.fire({
      title: 'Room Sync!!',
      text: message,
      icon: 'success',
    })
  }

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

  let numFloors;

 useEffect(() => {
 fetchx(API_URL + '/room?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        const filteredRooms = resp.data
          // .filter(room => room.someCondition)  // Apply your filter condition
          .sort((a, b) => a.roomNumber - b.roomNumber);  // Sorting as numbers

        const transformedRooms = filteredRooms.map(room => ({
          value: room.id,
          label: room.roomNumber
        }));

        // setTaluk(transformedTaluks);  
        setRooms(transformedRooms)
        //console.log(roomTypeID)
      })
  fetchx(API_URL + '/getFloor?hotelID=1')
    .then(result => result.json())
    .then((rowData) => {
      numFloors = rowData['data'].length;
      const sortedData = rowData['data'].sort((a, b) => a.floor - b.floor);
      console.log(sortedData);
      setRowData(sortedData);

      if (sortedData.length > 0) {
        const setTabFromStorage = sessionStorage.getItem('setTab');
        if (setTabFromStorage !== null) {
          const tabExists = sortedData.some(item => item.id.toString() === setTabFromStorage);
          setActive(tabExists ? setTabFromStorage : sortedData[0].id.toString());
        } else {
          setActive(sortedData[0].id.toString());
        }
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}, []);


  const toggle = tab => {
    if (active !== tab) {
      sessionStorage.removeItem('setTab')
      sessionStorage.setItem('setTab',tab)
      setActive(tab)
      //console.log(tab)
      setreload(false)
      setTimeout(() => { setreload(true) }, 1)
    }
  }



  function syncRooms(){
    console.log(SelectedValue)
    if(SelectedValue === undefined){
      return handleError("Please add room number to sync!!")
    }
    let createasset = JSON.stringify({
      "roomID": SelectedValue
    });
    //console.log(createasset);
    let res = fetchx(API_URL + "/syncRoomWiseInventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: createasset,
    }).then(data => data.json())
      .then((res) => {
        console.log(res);
        if (res.statusCode == 200) {
          setSelectedValue()
          if(typeof(res.data) === 'string'){
            setOpenSyncRoom(false)
          handleSuccess(res.data)
          }
          else{
            setOpenSyncRoom(false)
            setSelectedValue()
            handleSuccess("Successfully added")

          }
       
        }
      
      });
  }
  return (
    <div>
      <div className="d-flex justify-content-end">
        <UncontrolledDropdown>
          <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
            <MoreVertical size={20} />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem href='/' onClick={function(e) { e.preventDefault(); setGridViewList(false); }}>
              <List className='me-50' size={15} /> <span className='align-middle' >List View</span>
            </DropdownItem>
            <DropdownItem href='/' onClick={function(e) { e.preventDefault(); setGridViewList(true); }}>
              <Grid className='me-50' size={15} /> <span className='align-middle'>Grid View</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      {gridViewList === true && <div>
        <Fragment>
    


<Nav tabs className='tab'>
  {rowData && rowData.length > 0 ? (
    rowData.map((floorData, index) => {
      const floorID = floorData.id.toString();
      const floorIDNo = floorData.floor.toString();
      console.log(floorID)
      return (
        <NavItem key={floorID}>
          <NavLink
            active={active === floorID}
            onClick={() => {
              toggle(floorID);
            }}
          >
            Floor-{floorIDNo}
          </NavLink>
        </NavItem>
      );
    })
  ) : (
    <NavItem>
      <NavLink disabled>No Floors Available</NavLink>
    </NavItem>
  )}
       <div style={{ paddingLeft: '140px' }}>
              <Button color='primary' onClick={() => setOpenSyncRoom(true)}>Sync Room Reservation Status</Button>
            </div>
</Nav>
        </Fragment>

        {reload && <TabContent activeTab={active}>
          <TabPane tabId={active}>
            {active != '' && <ValidationThirdPartyComponents floorid={active} roomAssign={false} />}
          </TabPane>
        </TabContent>}



        <Modal isOpen={openSyncRoom} toggle={() => setOpenSyncRoom(!openSyncRoom)} className='modal-sm' centerd>
          <ModalHeader className='modal-sm' toggle={() => setOpenSyncRoom(!openSyncRoom)}>Sync Room Reservation Status</ModalHeader>
          <ModalBody className='pb-3 px-sm-1 mx-20'>
            <div>
              <Row>
                <Col md='6' sm='12'>
                  <Label className="form-label" for="isActive">
                    Select Room to Sync
                  </Label>
                  <Controller
                    id="isActive"
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <Select
                        required
                        isClearable
                        options={rooms}
                        classNamePrefix="select"
                        theme={selectThemeColors}
                        {...field}
                        onChange={handleChange} // Add onChange event handler
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row style={{paddingTop:'20px'}}>
                <Col md='6' sm='12'>
                  <div className="d-flex justify-content-start">
                    <Button className="me-1" color="primary" type="submit" onClick={()=> syncRooms()}>
                      Sync Room
                    </Button>
                  </div>
                </Col>
              </Row>

            </div>
          </ModalBody>
        </Modal>


      </div>
      }

      <div>
        {gridViewList === false && <RoomListView/>}
      </div>
    </div>
  )
}

export default Availability
