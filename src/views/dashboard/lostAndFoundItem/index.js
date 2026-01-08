import { useState } from "react";
import Select from "react-select";

import classnames from "classnames";
import Cleave from "cleave.js/react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'


import Flatpickr from "react-flatpickr";
import "cleave.js/dist/addons/cleave-phone.us";
import { useForm, Controller } from "react-hook-form";

import moment from 'moment';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, UncontrolledAccordion } from 'reactstrap'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {
  Input,
  Card,
  Form,
  Label,
  Button,
  CardBody,
  InputGroup,
  InputGroupText,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import API_URL from "../../../config";




const defaultValues = {
  itemName: "",
  guestName: "",
  roomNumber: "",
  phoneNumber: "",
  email: "",
  dateofLost: "",
  address: "",
  itemImage: "",
  status: "",
  itemDescription: "",
  comments: ""
};


const LostItems = () => {
  const [rowData, setRowData] = useState();
  const [open, setOpen] = useState('0')
  let navigate = useNavigate();
  const [show, actionButton] = useState(false);
  const [filldata, setfilldata] = useState({});
  //console.log("filldata",filldata)
  const imageInputRef = useRef();
  const MySwal = withReactContent(Swal)
  const gridRef = useRef();
  const [data, setData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { reset, handleSubmit, control } = useForm({ defaultValues });
  const [images, setImages] = useState([]);
  // const [IDForImage, setIDForImage] = useState(null);
  const [guestModalShow, setGuestModalShow] = useState(false)
  const [guestModalShow1, setGuestModalShow1] = useState(false)
  const [guestType, setGuestType] = useState()
  const [guestSet, setGuest] = useState()
  const [roomNumber, setRoomNumber] = useState()

  //console.log("guestSet",guestSet)
  const [guestData, setGuestData] = useState()
  const [chargableAmount, setCharagableAmount] = useState(false)
  const [recoveryOption, setRecoveryOption] = useState()
  const [guestID, setGuestID] = useState()
  const [roomID, setRoomID] = useState()
  const [residentTrue, serResidentTrue] = useState(false)
  const [nonResidentTrue, setNonResidentTrue] = useState(false)
  const [selectTypeOfGuest, setSelectTypeOfGuest] = useState(false)
  const [arrivalDate, setArrivalDate] = useState();
  const [reservationData, setReservationData] = useState()
  const [reservationModal, setReservationModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
   const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);

  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }

  const locationOptions = [
    { value:"Lobby",label:"Lobby"},
    {value:"Pool area",label:"Pool area"},
    {value:"Public area",label:"Public area"},
    { value:"Restaurant",label:"Restaurant"},
      {value:"Room",label:"Room"},   
  ]


  let GuestTypeSelection = [
    { value: 'Resident', label: 'Resident' },
    { value: 'Non-Resident', label: 'Non-Resident' }
]

let RoomNumberOptions = [
  { value: 'Checked In', label: 'Checked In' },
  { value: 'Checked Out', label: 'Checked Out' }
]


  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  const GuestType = (event) => {
    setGuestType()
    setGuest()
    setRoomNumber()
    setReservationData()
    setGuestModalShow(false)
    setGuestModalShow1(false)
    setSelectTypeOfGuest(false)
    if (event !== null && event.value === 'Resident') {
        serResidentTrue(true)
        setNonResidentTrue(false)
        setGuestType(event.value)
        setGuestModalShow1(false)
        setGuestModalShow(true)
        setSelectTypeOfGuest(true)
        return;
    }
    else if (event !== null && event.value === 'Non-Resident') {
        serResidentTrue(false)
        setNonResidentTrue(true)
        setGuestType(event.value)
        setGuestModalShow(false)
        setGuestModalShow1(true)
        setSelectTypeOfGuest(true)
        return
    }
    else {
        setGuestType()
        setGuest()
        setReservationData()
        setGuestModalShow(false)
        setRoomNumber()
        setGuestModalShow1(false)
        setSelectTypeOfGuest(false)
    }
}

   // Type of guest selection 
   const GuestSelection = (event) => {
    setRoomNumber()
    setGuest()
  
    if (event == null) {
        setSelectTypeOfGuest(false)
        return
    }
    setSelectTypeOfGuest(true)
    fetch(API_URL + `/getReservationDetailsForGuestComplaint?status=${event.value}`)
        .then(result => result.json())
        .then(resp => {
            setReservationModal(true)
            setReservationData(resp['data'])
        })
}

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };


  useEffect(() => {
    fetchx(API_URL + '/getLostandFoundItemDetails?hotelID=20')
      .then(result => result.json())
      .then(lostItemData => {
        const formattedData = lostItemData['data'].map(item => ({
          ...item,
          dateofLost: moment(item.dateofLost).format('DD.MM.YYYY'),
        }));
        setRowData(formattedData);
      })
      .catch(error => {
        console.error('Error fetching Lost Item Details:', error);
      });
  }, []);


  const handleClick = (event) => {
    getImageUrls(event['data']['id']);
    // setIDForImage(event['data']['id'])
    actionButton(true)
  }


  const actionButton1 = (rowval) => {
    console.log("rowval",rowval.data)
    setGuestData(rowval.data.id)
    setGuest(rowval.data.s ? rowval.data.s + " " + rowval.data.f + " " + rowval.data.l : rowval.data.f + " " + rowval.data.l)
    setGuestID(rowval.data.guestID)
    setRoomNumber(rowval.data.roomNumber)
    setRoomID(rowval.data.roomID)
    setReservationModal(false)
}


  const getImageUrls = async (id) => {

    try {
      const response = await fetchx(API_URL + `/getS3ImageID?hotelID=10&source=9&documentTypeID=15&docReferenceID=lost_items_${id}`);
      const data = await response.json();
      const imageIDs = data['data'];

      // fetchx each image URL separately
      const imageUrls = await Promise.all(imageIDs.map(async (imageID) => {
        const imageResponse = await fetchx(API_URL + `/images/${imageID['documentID']}`);
        const blob = await imageResponse.blob();
        if (blob.type !== 'text/html') {
          // Create a URL for the blob data
          const fileUrl = URL.createObjectURL(blob);
          return fileUrl;
        }
        return null; // Skip non-image data
      }));

      // Filter out null values (non-image data)
      const filteredImageUrls = imageUrls.filter(url => url !== null);

      // Set the images state with the filtered image URLs
      setImages(filteredImageUrls);

      console.log('All images fetchxed successfully');
    } catch (error) {
      console.error('Error fetchxing images:', error);
    }
  };


  // useEffect(() => {
  //   getImageUrls();
  // }, [IDForImage !== null]);

  const [columnDefs2] = useState([
    {
        headerName: "Room Number",
        field: "roomNumber",
        suppressSizeToFit: true,
        maxWidth: 140
    },
    {
        headerName: 'Guest Name',
        suppressSizeToFit: true,
        width: 280,
        valueGetter: function (params) {
            const salutation = params.data.s;
            const firstName = params.data.f;
            const lastName = params.data.l;
            const fullName = salutation ? `${salutation} ${firstName} ${lastName}` : `${firstName} ${lastName}`;
            return fullName;
        },
    },
    {
        headerName: "Check-In Date",
        field: 'arrivalDate',
        suppressSizeToFit: true,
        maxWidth: 170
    },
    {
        headerName: "Check-Out Date",
        field: 'departureDate',
        suppressSizeToFit: true,
        maxWidth: 170
    },
    {
        headerName: 'Action',
        field: 'numAvlRooms',
        suppressSizeToFit: true,
        maxWidth: 125,
        cellRendererFramework: (params) => <Button color='primary' onClick={() => actionButton1(params)}> Select </Button>
    },
]);



  const handleStatusUpdate = (params, api) => {
    const { data } = params;

    Swal.fire({
      title: 'Update Status',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ms-1',
        popup: 'custom-swal-popup',
      },
      didOpen: () => {
        const modalElement = document.querySelector('.custom-swal-popup');
        if (modalElement) {
          modalElement.style.width = '500px';
          modalElement.style.height = 'auto';
        }
  
        const statusDropdown = document.getElementById('statusDropdown');
        const currentStatus = data.status;
        const itemstatus = data.category;
  
        const disableOption = (value) => {
          const option = statusDropdown.querySelector(`option[value="${value}"]`);
          if (option) {
            option.disabled = true;
            option.classList.add('disabled-option');
          }
        };
  
        const removeOption = (value) => {
          const option = statusDropdown.querySelector(`option[value="${value}"]`);
          if (option) {
            option.remove();
          }
        };
  
        if (itemstatus === 'Found') {
          removeOption('Found');
          removeOption('Not Found');
        }
  
        if (currentStatus === 'Found') {
          disableOption('Not Found');
        } else if (currentStatus === 'Shipped') {
          disableOption('Not Found');
          disableOption('Found');
        } else if (currentStatus === 'Delivered') {
          disableOption('Not Found');
          disableOption('Found');
          disableOption('Shipped');
        }
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <label style="text-align: center;">Status <span style="color: red;">*</span> :</label>
          <select id="statusDropdown" class="swal2-select">
            <option value="" selected>Select an option</option>
            <option value="Found">Found</option>
            <option value="Not Found">Not Found</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
          <br />
          
          <div id="additionalFields" style="display: none; width: 80%;">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <label id="additionalField1Label"></label>
              <input type="text" id="additionalField1" class="swal2-input">
            </div>
            <br />
            <div style="display: flex; flex-direction: column; align-items: center;">
              <label id="additionalField2Label"></label>
              <input type="text" id="additionalField2" class="swal2-input">
            </div>
          </div>
          
          <div id="foundByField" style="display: none; width: 80%;">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <label for="foundBy">Found By <span style="color: red;">*</span> :</label>
              <input type="text" id="foundBy" class="swal2-input">
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center;">
          <label style="text-align: center;">Comments :</label>
          <textarea id="commentsTextarea" class="swal2-textarea"></textarea>
          <br />
        </div>
      `,
      preConfirm: () => {
        const status = document.getElementById('statusDropdown').value;
        const additionalField1 = document.getElementById('additionalField1').value;
        const additionalField2 = document.getElementById('additionalField2').value;
        const foundBy = document.getElementById('foundBy').value;
  
        if (!status) {
          Swal.showValidationMessage('Status is required');
          return false;
        }
  
        if ((status === 'Shipped' || status === 'Delivered') && (!additionalField1 || !additionalField2)) {
          Swal.showValidationMessage('Kindly fill mandatory fields');
          return false;
        }
  
        if (status === 'Found' && !foundBy) {
          Swal.showValidationMessage('Found By is required');
          return false;
        }
  
        const comments = document.getElementById('commentsTextarea').value;
  
        return updateStatusOnServer(data.id, status, comments, additionalField1, additionalField2, foundBy)
          .then(() => {
            params.node.setDataValue('status', status);
            params.node.setDataValue('comments', comments);
            if (status === 'Found') {
              params.node.setDataValue('foundBy', foundBy);
            } else {
              params.node.setDataValue('additionalField1', additionalField1);
              params.node.setDataValue('additionalField2', additionalField2);
            }
  
            api.refreshCells({
              columns: ['status', 'comments'],
              rowNodes: [params.node],
              force: true,
            });
          })
          .catch((error) => {
            Swal.fire({
              text: 'Error updating status',
              icon: 'error',
              buttonsStyling: false,
              confirmButtonText: 'Close',
              customClass: {
                confirmButton: 'btn btn-danger',
              },
            });
          });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          text: 'Status updated successfully',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        });
      }
    });
  
    document.getElementById('statusDropdown').addEventListener('change', (event) => {
      const selectedStatus = event.target.value;
      const additionalFieldsContainer = document.getElementById('additionalFields');
      const foundByField = document.getElementById('foundByField');
  
      document.getElementById('additionalField1').value = '';
      document.getElementById('additionalField2').value = '';
      document.getElementById('foundBy').value = '';
      additionalFieldsContainer.style.display = 'none';
      foundByField.style.display = 'none';
  
      if (selectedStatus === 'Shipped' || selectedStatus === 'Delivered') {
        const field1Label = document.getElementById('additionalField1Label');
        const field2Label = document.getElementById('additionalField2Label');
  
        field1Label.innerText = selectedStatus === 'Shipped' ? 'Shipped By :' : 'Delivered By :';
        field2Label.innerText = selectedStatus === 'Shipped' ? 'Shipped To :' : 'Delivered To :';
  
        field1Label.innerHTML += ' <span style="color: red;">*</span>';
        field2Label.innerHTML += ' <span style="color: red;">*</span>';
  
        additionalFieldsContainer.style.display = 'block';
      } else if (selectedStatus === 'Found') {
        foundByField.style.display = 'block';
      }
    });
  };
  
  const style = document.createElement('style');
  style.innerHTML = `
    .disabled-option {
      background-color: grey;
    color: white;
    }
  `;
  document.head.appendChild(style);
  
  
  

  const updateStatusOnServer = async (id, status, comments,additionalField1,additionalField2,foundBy, api) => {
    try {
      const response = await fetchx(API_URL + '/updateLostandFounditemStatus', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status,
          comments,
          additionalField1,
          additionalField2,
          foundBy,
        }),
      });

      if (response.ok) {
        Swal.fire({
          text: 'Status updated successfully !!',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        });

        if (api) {
          api.refreshCells({
            columns: ['status', 'comments'], 
            rowNodes: [params.node], 
            force: true, 
          });
        }
        navigate("");
      } else {

        Swal.fire({
          text: 'Failed to update status',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        });
        
      }
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  };


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Lost/Found',
      field: 'category',
      headerClass: "text-center",
      maxWidth: 150
    },
    {
      headerName: 'Item Name',
      field: 'itemName',
      headerClass: "text-center",
      maxWidth: 200
    },
    {
      headerName: 'Guest Type',
      field: 'guestType',
      headerClass: "text-center",
      maxWidth: 150
    },

    {
      headerName: 'Guest Name',
      field: 'guestName',
      headerClass: "text-center",
      maxWidth: 200
    },
    {
      headerName: 'Reported Date',
      field: 'dateofLost',
      cellStyle: { 'text-align': 'left', 'background-color': 'white' },
      headerClass: "text-center",
      maxWidth: 150

    },
   
    {
      headerName: 'Status',
      field: 'status',
      cellStyle: { 'text-align': 'left', 'background-color': 'white' },
      headerClass: "text-center",
      maxWidth: 150

    },
    {
      headerName: 'Update',
      field: 'status',
      cellStyle: { 'text-align': 'left', 'background-color': 'white' },
      headerClass: "text-center",
      maxWidth: 150,
      cellRendererFramework: (params) => (
        <div>
          <Button color="primary" onClick={() => handleStatusUpdate(params)}>Update</Button>
        </div>
      ),
    },
    {
      headerName: "Action", field: "numAvlRooms", suppressSizeToFit: true, maxWidth: 120,
      cellRendererFramework: (params) => (
        <Button color="primary" onClick={() => handleClick(params)}> View  </Button>),
    },
   
  ]);


  const gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
      flex: 1,
      minWidth: 150,
      filter: true,
      sortable: true,
      floatingFilter: true,
    },
  };


  const defaultColDef = useMemo(() => (
    {
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['apply', 'reset']
      }
    }
  ));

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

  const cellClickedListener = useCallback(event => {
    setfilldata(event["data"]);
  }, []);


  // const onSubmit = (data) => {
  //   if (guestType === undefined) {
  //     return handleError("Please select guest type")
  // }
  // else if (selectTypeOfGuest === false || (guestType === 'Resident' && guestID == null)) {
  //     return handleError("Please select guest")
  // }
  //   setData(data);
  //   console.log("data.location.value",data.location.value)
  //   const LostItemDetails = JSON.stringify({
  //     reservationID: residentTrue === false ? null : guestData,
  //     guestType: guestType,
  //     guestID: residentTrue === false ? null : guestID,
  //     category: data.category.value,
  //     itemName: data.itemName,
  //     location: data.location.value,
  //     foundby : data.foundby,
  //     guestName: (residentTrue === false ? data.guestName : ''),
  //     roomNumber: residentTrue === false ? null : roomID,
  //     phoneNumber: (residentTrue === false ? (data.phoneNumber || '') : ''),
  //     email: data.email,
  //     dateofLost: formatDate(new Date(data.dateofLost)),
  //     status: data.status.value,
  //     address: data.address,
  //     itemDescription: data.itemDescription,
  //     comments: data.comments
  //   })

  //   // Make the fetchx request with FormData
  //   fetchx(API_URL + '/insertIntoLostandFoundItems', {
  //     method: "POST",
  //     headers: { 'Content-Type': 'application/json' },
  //     body: LostItemDetails,
  //   })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         return res.json();
  //       } else {
  //         throw new Error("Item not added successfully");
  //       }
  //     })
  //     .then((responseData) => {
  //       const formData = new FormData();
  //       formData.append('file', selectedFile);
  //       formData.append('hotelID', 10);
  //       formData.append('source', 9);
  //       formData.append('doctype', 15);
  //       formData.append('docrefno', ("lost_items_" + responseData['data']));

  //       if (selectedFile !== null) {
  //         fetchx(API_URL + '/imgupload', {
  //           method: 'POST',
  //           body: formData,
  //         })
  //           .then((response) => response.json())
  //           .then((result) => {
  //             console.log("Document upload successfully !!")
  //           })
  //       }
  //       const swalInstance = MySwal.fire({
  //         text: "Item Added Successfully",
  //         icon: 'success',
  //         buttonsStyling: false,
  //         confirmButtonText: 'Close',
  //         customClass: {
  //           confirmButton: 'btn btn-danger'
  //         }
  //       });

  //       swalInstance.then((result) => {
  //         if (result.isConfirmed) {

  //           navigate('');
  //           fetchx(API_URL + `/getLostandFoundItemDetails?hotelID=20`)
  //             .then(result => result.json())
  //             .then(rowData => {
  //               setRowData(rowData['data'])
  //             });
  //         }
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // };
  const onSubmit = (data) => {
    if (guestType === undefined) {
      return handleError("Please select guest type");
    } else if (selectTypeOfGuest === false || (guestType === 'Resident' && guestID == null)) {
      return handleError("Please select guest");
    }
  
    setIsLoading(true);
    setShowSecondaryMessage(true)  // Show loading
  
    const LostItemDetails = JSON.stringify({
      reservationID: residentTrue === false ? null : guestData,
      guestType: guestType,
      guestID: residentTrue === false ? null : guestID,
      category: data.category.value,
      itemName: data.itemName,
      location: data.location.value,
      foundby: data.foundby,
      guestName: (residentTrue === false ? data.guestName : ''),
      roomNumber: residentTrue === false ? null : roomID,
      phoneNumber: (residentTrue === false ? (data.phoneNumber || '') : ''),
      email: data.email,
      dateofLost: formatDate(new Date(data.dateofLost)),
      status: data.status.value,
      address: data.address,
      itemDescription: data.itemDescription,
      comments: data.comments
    });
  
    fetchx(API_URL + '/insertIntoLostandFoundItems', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: LostItemDetails,
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("Item not added successfully");
        }
      })
      .then(() => {
        setIsLoading(false); 
        setShowSecondaryMessage(false) // Hide loading on success
        MySwal.fire({
          text: "Item Added Successfully",
          icon: 'success',
          confirmButtonText: 'Close',
          customClass: { confirmButton: 'btn btn-danger' }
        });
        navigate('');
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);  // Hide loading on error
        setShowSecondaryMessage(false)
        handleError("Failed to add item. Please try again.");
      });
  };
  

  const handleReset = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    reset({
      itemName: "",
      location:"",
      guestName: "",
      roomNumber: "",
      phoneNumber: "",
      email: "",
      dateofLost: "",
      itemImage: "",
      status: "",
      itemDescription: ""
    });
  };


  // const onFilterTextBoxChanged = useCallback(() => {
  //   gridRef.current.api.setQuickFilter(
  //     document.getElementById("filter-text-box").value
  //   );
  // }, []);


  const onFilterTextBoxChanged = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.api.setQuickFilter(document.getElementById("filter-text-box").value);
    }
  }, []);

  const onFilterTextBoxChanged1 = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.api.setQuickFilter(document.getElementById("filter-text-box1").value);
    }
  }, []);
  

  // view attachment part
  const handleViewImageClick = (fileData, index) => {
    window.open(fileData, '_blank', 'width=1000,height=800');
  };


  const categoryType = [
    { value: "Found", label: "Found" },
    { value: "Lost", label: "Lost" },
  ];



  return (
    <div>
      <Card>
        <Accordion className='accordion-border' open={open} toggle={toggle}>
          <AccordionItem>
            <AccordionHeader targetId='1'>Report Lost/Found items</AccordionHeader>
            <AccordionBody accordionId='1'>
              <CardBody>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>

                      <Col md='4' sm='12' className='mb-1'>
                              <div className="mb-1">
                                <Label className="form-label" for="category">
                                  Category<span className="text-danger">*</span>
                                </Label>
                                <Controller
                                  id="category"
                                  control={control}
                                  name="category"
                                  render={({ field }) => (
                                    <Select
                                      required
                                      isClearable
                                      options={categoryType}
                                      classNamePrefix="select"
                                      theme={selectThemeColors}
                                      className={classnames("react-select", {
                                        "is-invalid": data !== null && data.category === null,
                                      })}
                                      {...field}
                                      onChange={(selectedOption) => {
                                        handleCategoryChange(selectedOption);
                                        field.onChange(selectedOption);
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </Col>

                    {/* Item name */}
                    <Col md='4' sm='12' className='mb-1'>
                      <div className="mb-1">
                        <Label className="form-label" for="itemName">
                          Item Name<span className="text-danger">*</span>
                        </Label>

                        <Controller
                          id="itemName"
                          name="itemName"
                          control={control}
                          placeholder="Item Name"
                          render={({ field }) => (
                            <Input
                              required
                              placeholder="Enter Item Name"
                              maxLength="20"
                              {...field}
                              className={classnames("form-control", {
                                "is-invalid": data !== null && data.itemName === null,
                              })}
                            />
                          )}
                        />
                      </div>
                    </Col>

                  

                    <Col md='4' sm='12' className='mb-1'>
        <div className="mb-1">
          <Label className="form-label" for="location">
            Location<span className="text-danger">*</span>
          </Label>
          <Controller
            id="location"
            control={control}
            name="location"
            render={({ field }) => (
              <Select
                required
                isClearable
                options={locationOptions}
                classNamePrefix="select"
                theme={selectThemeColors}
                className={classnames("react-select", {
                  "is-invalid": data !== null && data.category === null,
                })}
                {...field}
                onChange={(selectedOption) => {
                  handleCategoryChange(selectedOption);
                  field.onChange(selectedOption);
                }}
              />
            )}
          />
        </div>
      </Col>

                    <Col md='4' sm='12' className='mb-1'>
                      <div className="mb-1">
                        <Label className="form-label" for="foundby">
                          Reported By
                        </Label>

                        <Controller
                          id="foundby"
                          name="foundby"
                          control={control}
                          placeholder="Name"
                          render={({ field }) => (
                            <Input
                              
                              placeholder="Enter Name"
                              maxLength="20"
                              {...field}
                              className={classnames("form-control", {
                                "is-invalid": data !== null && data.foundby === null,
                              })}
                            />
                          )}
                        />
                      </div>
                    </Col>

            
                                                       <Col md='4' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='guestType'>
                                                Guest Type <span style={{ color: 'red' }}> * </span>
                                            </Label>
                                            <Controller
                                                id='guestType'
                                                control={control}
                                                name='guestType'
                                                render={({ }) => (
                                                    <Select
                                                        required
                                                        isClearable
                                                        options={GuestTypeSelection}
                                                        onChange={GuestType}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select')}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>


                                    {/* Guest selection */}
                                    {guestModalShow === true && <Col md='4' sm='12' className='mb-1'>
                                        <div className='mb-1'>
                                            <Label className='form-label' for='roomNumber'>
                                                Select Guest <span style={{ color: 'red' }}> * </span>
                                            </Label>
                                            <Controller
                                                id='roomNumber'
                                                control={control}
                                                name='roomNumber'
                                                render={({ field }) => (
                                                    <Select
                                                        required
                                                        isClearable
                                                        options={RoomNumberOptions}
                                                        classNamePrefix='select'
                                                        theme={selectThemeColors}
                                                        className={classnames('react-select')}
                                                        onChange={GuestSelection}
                                                    // {...field}

                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>}


                                    {/* Guest name for non-resident guest */}
                                    {
                                        guestModalShow1 === true &&
                                        <Col md='4' sm='12' className='mb-1'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='guestName'>
                                                    Guest Name <span style={{ color: 'red' }}> * </span>
                                                </Label>
                                                <Controller
                                                    id='guestName'
                                                    name='guestName'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            required
                                                            className={classnames('form-control')}
                                                            placeholder='Enter guest name' {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>
                                    }


                                    {/* Email ID for non-resident guest */}
                                    {
                                        guestModalShow1 === true &&
                                        <Col md='4' sm='12' className='mb-1'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='emailID'>
                                                    Email ID
                                                </Label>
                                                <Controller
                                                    id='emailID'
                                                    name='emailID'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            // required
                                                            className={classnames('form-control')}
                                                            placeholder='Enter guest email id' {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>
                                    }


                                    {/* Phone number for non-resident guest */}
                                    {
                                        guestModalShow1 === true &&
                                        <Col md='4' sm='12' className='mb-1'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='phoneNumber'>
                                                    Phone Number
                                                </Label>
                                                <Controller
                                                    id='phoneNumber'
                                                    name='phoneNumber'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            // required
                                                            className={classnames('form-control')}
                                                            placeholder='Enter guest mobile number' {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </Col>
                                    }


                                    {/* Guest name */}
                                    {
                                        guestSet && guestModalShow === true &&
                                        <Col md='4' sm='12' className='mb-1'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='guestName'>
                                                    Guest Name
                                                </Label>
                                                <InputGroup className='input-group-merge'>
                                                    <Controller
                                                        id='guestName'
                                                        name='guestName'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                disabled
                                                                value={guestSet}
                                                                className={classnames('form-control')}
                                                            />
                                                        )}
                                                    />
                                                </InputGroup>
                                            </div>
                                        </Col>
                                    }


                                    {/* Room number */}
                                    {roomNumber && guestModalShow === true &&
                                        <Col md='4' sm='12' className='mb-1'>
                                            <div className='mb-1'>
                                                <Label className='form-label' for='guestRoomNumber'>
                                                    Room Number
                                                </Label>
                                                <InputGroup className='input-group-merge'>
                                                    <Controller
                                                        id='guestRoomNumber'
                                                        name='guestRoomNumber'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                disabled
                                                                value={roomNumber}
                                                                className={classnames('form-control')}
                                                            />
                                                        )}
                                                    />
                                                </InputGroup>
                                            </div>
                                        </Col>
                                    }


                    {/* Date of loss */}
                    <Col md='4' sm='12' className='mb-1'>
                      <div className="mb-1">
                        <Label className="form-label" for="dateofLost">
                          Date <span className="text-danger">*</span>
                        </Label>
                        <Controller
                          control={control}
                          id='dateofLost'
                          name='dateofLost'
                          render={({ field }) => (
                            <Flatpickr
                              placeholder="DD-MM-YYYY"
                              required
                              {...field}
                              options={{
                                allowInput: true,
                                maxDate: new Date().toISOString().split('T')[0]
                              }}
                              className={classnames('form-control', {
                                'is-invalid': data !== null && data.dateofLost === null
                              })}
                            />
                          )}
                        />
                      </div>
                    </Col>

                    {/* Item Image */}
                    <Col md='4' sm='12' className='mb-1'>
                      <div className='mb-1'>
                        <Label className='form-label' for='attachments'>
                          Item Image
                        </Label>
                        <Controller
                          defaultValue=''
                          control={control}
                          id='attachments'
                          name='attachments'
                          render={({ field }) => <Input type='file' placeholder='attachments'
                            onChange={handleFileChange}
                          />
                          }
                        />
                      </div>
                    </Col>


                    {/* Address*/}
                    <Col md='4' sm='12' className='mb-1'>
                      <div className="mb-1">
                        <Label className="form-label" for="address">
                          Address
                        </Label>

                        <Controller
                          id="address"
                          name="address"
                          control={control}
                          placeholder="Address"
                          render={({ field }) => (
                            <Input
                              placeholder="Enter Address"
                              maxLength="50"
                              //required
                              {...field}
                              className={classnames("form-control", {
                                "is-invalid": data !== null && data.address === null,
                              })}
                            />
                          )}
                        />
                      </div>
                    </Col>

                    {/* Item Description */}
                    <Col md='4' sm='12' className='mb-1'>
                      <div className="mb-1">
                        <Label className="form-label" for="itemDescription">
                          Item Description<span className="text-danger">*</span>
                        </Label>
                        <Controller
                          id="itemDescription"
                          name="itemDescription"
                          control={control}
                          render={({ field }) => (
                            <Input
                              // required
                              type="textarea"
                              placeholder="Enter Item Description"
                              {...field}
                              rows={3}
                              className={classnames("form-control", {
                                "is-invalid": data !== null && data.itemDescription === null,
                              })}
                            />

                          )}
                        />
                      </div>
                    </Col>

                    {/* Comments */}
                    <Col md='4' sm='12' className='mb-1'>
                      <div className="mb-1">
                        <Label className="form-label" for="comments">
                          Commments
                        </Label>
                        <Controller
                          id="comments"
                          name="comments"
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="textarea"
                              placeholder="Comments"
                              {...field}
                              rows={3}
                              className={classnames("form-control", {
                                "is-invalid": data !== null && data.itemDescription === null,
                              })}
                            />

                          )}
                        />
                      </div>
                    </Col>

                    <div className="d-flex">
                      <Button className="me-1" color="primary" foodtype="submit" >
                        Submit
                      </Button>
                      <Button
                        outline
                        color="secondary"
                        foodtype="reset"
                        onClick={handleReset}
                      >
                        Reset
                      </Button>
                    </div>

                  </Row>
                </Form>
              </CardBody>
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      </Card>


      {/* Search box */}
      <div>
        <Col md="3" sm="12" className="mb-1">
          <Label className="form-label" for="fullName">
            Search
          </Label>
          <Input
            type="text"
            id="filter-text-box"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
          />
        </Col>
      </div>

      {/* Ag-grid for lost item list */}
      <Card>
        <div className="ag-theme-alpine" style={{ height: 450 }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData} columnDefs={columnDefs}
            animateRows={true} rowSelection='multiple'
            onCellClicked={cellClickedListener}
            paginationAutoPageSize='true'
            paginationPageSize='15'
            pagination='true'
            defaultColDef={defaultColDef}
            headerColor="ddw-primary"
            gridOptions={gridOptions}
          />
        </div>
      </Card>

      {/* View details */}
      <Card>

<Modal 
    isOpen={reservationModal} 
    toggle={() => setReservationModal(!reservationModal)} 
    className="modal-xl"
    backdrop="static"       // Disable close on outside click
    keyboard={false}
>
    <ModalHeader 
        //toggle={() => setReservationModal(!reservationModal)}// Remove close button
        className="modal-xl"
    >
        Reservation Data
    </ModalHeader>
    <ModalBody className="modal-xl">

        <Col md='4' sm='12' className='me-1'>
            <Label className='form-label'>
                Search
            </Label>
            <Input
                type="text"
                id="filter-text-box1"
                placeholder="Filter..."
                onChange={onFilterTextBoxChanged1}
            />
        </Col>

        <br />
        {reservationData && (
            <div className="ag-theme-alpine" style={{ height: 550, width: 1000 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={reservationData}
                    columnDefs={columnDefs2}
                    animateRows={true}
                    rowSelection="multiple"
                    paginationPageSize={10}
                    pagination={true}
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"
                />
            </div>
        )}
        <br /><br />
    </ModalBody>
</Modal>


        <Modal
          isOpen={show}
          toggle={() => actionButton(!show)}
          className="modal-lg">
          <ModalHeader toggle={() => actionButton(!show)}>
            View Item Details...
          </ModalHeader>

          <ModalBody>
            <div>
              <div className="d-flex" style={{ paddingBottom: '20px' }}>
              </div>
              <Card>
                <div className="mb-1">
                  <Row>
                    <UncontrolledAccordion defaultOpen='1'>
                      <AccordionItem>
                        <AccordionHeader
                          style={{ backgroundColor: "#F2E5D9" }}
                          targetId="1"
                        >
                          <b> Item Details </b>
                        </AccordionHeader>

                        <AccordionBody accordionId="1">
                          <br></br>
                          <Row>
                      <Col md="6">
                        <h5>Category : <b>{filldata["category"]}</b></h5>
                        <h5>Item Name : <b>{filldata["itemName"]}</b></h5>
                        <h5>Reported By : <b>{filldata["foundby"]}</b></h5>
                        <h5>Location : <b>{filldata["location"]}</b></h5>
                        <h5>Shipped/Delivered By : <b>{filldata["ShippedOrDeliverBy"]}</b></h5>
                        <h5>Shipped/Delivered To : <b>{filldata["ShippedOrDeliverTo"]}</b></h5>
                        <h5>Comments : <b>{filldata["comments"]}</b></h5>
                        <h5>Item Description : <b>{filldata["itemDescription"]}</b></h5>
                        
                      </Col>
                      <Col md="6">
                        <h5>Guest Type : <b>{filldata["guestType"]}</b></h5>
                        <h5>Guest Name : <b>{filldata["guestName"]}</b></h5>
                        <h5>Room Number : <b>{filldata["roomNumber"]}</b></h5>
                        <h5>Phone Number : <b>{filldata["phoneNumber"]}</b></h5>
                        <h5>Email : <b>{filldata["email"]}</b></h5>
                        <h5>Address : <b>{filldata["address"]}</b></h5>
                        <h5>Date : <b>{filldata["dateofLost"]}</b></h5>
                        <h5>Status : <b>{filldata["status"]}</b></h5>
                        
                        
                      </Col>
                    </Row>

                          {images.map((imageData, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                              <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Item Image {index + 1}:- &nbsp;&nbsp;</h4>
                              <br />
                              <Button onClick={() => handleViewImageClick(imageData)} color='primary'>View Image {index + 1}</Button>
                              <br></br><br></br><br></br>
                            </div>
                          ))}
                        </AccordionBody>
                      </AccordionItem>
                    </UncontrolledAccordion>
                  </Row>
                </div>
              </Card>
            </div>
          </ModalBody>
        </Modal>
      </Card>
      {isLoading && (
   <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
     <h1 style={{ fontWeight: 'bold', color: 'white' }}>
       Please wait Invoice is Generating..
     </h1>
     {showSecondaryMessage && (
       <h1 style={{ fontWeight: 'bold', color: 'white' }}>
         We're processing your request, which may take a little longer due to additional data. Please be patient!
       </h1>
     )}
     <CircularProgress color="inherit" />
   </div>
 </Backdrop>
)}


    </div>

    
  );
};

export default LostItems;









