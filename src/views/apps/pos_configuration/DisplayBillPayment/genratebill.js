// ** Reactstrap Imports
import InputNumber from 'rc-input-number'
import { Link } from 'react-router-dom'

import API_URL from "../../../../config";
import { Card, CardBody, CardHeader, CardTitle, CardText, Label, InputGroup, Input, Row, Container, Col, Table, Button, Modal, ModalHeader, ModalFooter, ModalBody, Form, InputGroupText,FormGroup ,ListGroupItem} from 'reactstrap';
import Cleave from "cleave.js/react";
import classnames from "classnames";
import { format } from "date-fns";
import { useEffect, useState } from 'react';
import logo from '@src/assets/images/logo/oterra.jpg';
import { useForm, Controller } from "react-hook-form";
import React, { Component } from 'react';
import { selectThemeColors } from "@utils";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Avatar from "@components/avatar";

// import { AiOutlineVerticalAlignBottom } from "react-icons/ai";
import Select from "react-select";
import { fontSize } from '@mui/system';
// import { RiVisualStudioLine } from 'react-icons';
import { HiStar } from "react-icons/hi";
import { FaChartPie } from "react-icons/fa";
import { MdPreview } from "react-icons/md";
import { LuLayoutList } from "react-icons/lu";
import { GrStar } from "react-icons/gr";
import { FaRupeeSign } from "react-icons/fa";
// import { VscPreview } from "react-icons/fa";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'

import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'


import DisplayBill from './dummy.js'
import CouponForm from './couponForm.js';
import RedemptionHistory from './redemptionHistory.js'
import { getOrderdata } from './index.js'; // Import the getOrderdata function
// import ScrollableButtonList from './scrollableButtonList';
import { VscPreview } from "react-icons/vsc";

import { BiSolidCopy } from "react-icons/bi";
import { GrInProgress } from "react-icons/gr";
import { ReactSortable } from 'react-sortablejs'
import { IoMdHome } from "react-icons/io";
import { BiRotateLeft } from "react-icons/bi";
import { FaRegWindowClose } from "react-icons/fa";
import {PlusSquare} from 'react-feather'
import { IoCheckmarkDoneCircle } from "react-icons/io5";



const PreviewPayment = ({ billdata, print }) => {
  const [orderdata, setorderdata] = useState(billdata);
  const [data, setdata] = useState(billdata);
  const [alltableData, setallTableData] = useState(orderdata.AllFolioData[0].items);


  // let invBalance2 = data['total']
  // let totalDiscount1 = data['TotalDiscount']
  // let finalBalanceAmt1 = data['Balance']

  let selectedpaxTable = data.pax

  // const itemsCount = data.items.length;
  const [invBalance1, setinvBalance1] = useState(data['total'])
  const [totalDiscount, settotalDiscount] = useState(data['TotalDiscount'])
  const [finalBalanceAmt, setfinalBalanceAmt] = useState(data['Balance'])
  const [isservicecharge, setIsservicecharge] = useState(data['isServiceCharge']);

  let navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [recievedPayment, setrecievedPayment] = useState([]);
  const [showBreakCourse, setShowBreakCourse] = useState(false);
  const [inhouseGuestOptions, setInhouseGuestOptions] = useState([]);
  const [btcCompanyOptions, setbtcCompanyOptions] = useState([])
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [paymentInfoModal, setpaymentInfoModal] = useState(false)
  const [openInvoice, setopenInvoice] = useState(false)
  const [discountModal, setdiscountModal] = useState(false)
  const [isAmountActive, setIsAmountActive] = useState(true);
  const [isPercentageActive, setIsPercentageActive] = useState(false);
  const [isClassificationActive, setisClassificationActive] = useState(false)
  const [isCouponActive, setisCouponActive] = useState(false)
  const [isItemDisActive, setisItemDisActive] = useState(false)
  const [inhouseGuestDetails, setinhouseGuestDetails] = useState([])
  const [btcCompanyDetails, setbtcCompanyDetails] = useState([])
  const [inhouseGuestModal, setinhouseGuestModal] = useState(false)
  const [btcCompanyModal, setbtcCompanyModal] = useState(false)
  const [selectedRoomNumber, setselectedRoomNumber] = useState([])
  const [selectedRoomNumber1, setselectedRoomNumber1] = useState([])
  const [selectedCompany, setselectedCompany] = useState([])
  const [selectedGuest, setSelectedGuest] = useState([])
  const [selectedbtcCompany, setselectedbtcCompany] = useState([])
  const [discountModal1, setdiscountModal1] = useState(false)
  const [openPreviewBill, setopenPreviewBill] = useState(false)
  const [balanceValue, setBalanceValue] = useState(data['Balance']);
  const [showAlert, setshowAlert] = useState(false);
  const MySwal = withReactContent(Swal)
  const [searchRoomORGuest, setsearchRoomORGuest] = useState('');
  const [searchCompany, setsearchCompany] = useState('');
  const [reload, setreload] = useState(true);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
  const [PaymentOptions, setPaymentOptions] = useState([]);
  const [tipsAmount, setTipsAmount] = useState(0);
  const [tipstotalAmount, settipstotalAmount] = useState(0)
  const [roomDiscount, setRoomDiscount] = useState(false);
  const [logoimage, setLogo] = useState(null);
  const [hotelAddress, setHotelAddress] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [hotelNo, setHotelNo] = useState(null);
  const[hotelFax,sethotelFax] = useState(null)
  const [image, setImage] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [CINNumber, setCINNumber] = useState(null);
  const [FSSAINumber, setFSSAINumber] = useState(null);
  const [GSTINNumber, setGSTINNumber] = useState(null);
  const [firmdata, setfirmdata] = useState(null);
  const [faxdata, setfaxdata] = useState(null);
  const [websitedata, setwebsitedata] = useState(null);
  const [postalcodedata, setpostalcodedata] = useState(null);
  const [voidpaymentModal, setvoidpaymentModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vouchers, setVouchers] = useState([]); 
  const [voucher, setVoucher] = useState(null);
  const [voucherDiscountModal,setVoucherDiscountModal] = useState(false)
  const [voucherDiscountModal1,setVoucherDiscountModal1] = useState(false)
  const [redemptionhistoryModal,setredemptionhistoryModal] = useState(false)
  const [discountType, setDiscountType] = useState('amt'); 
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [confirmationSingleVoucherModal,setconfirmationSingleVoucherModal] = useState(false)
  const [confirmationMultiVoucherModal,setconfirmationMultiVoucherModal] = useState(false)
  const [redemptionhistory,setRedemptionhistory] = useState([])
  const [couponModal, setcouponModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [phoneNumberRedemption,setphoneNumberRedemption] = useState('')
  const [servicechargeInfoModal, setservicechargeInfoModal] = useState(false);
  const[logostatus, setlogostatus] = useState()
  const [imagelogo, setimage] = useState()
  const [isProcessing, setIsProcessing] = useState(false);
  const [balanceError, setBalanceError] = useState('');

  //split changes
  const [splitModal,setsplitModal] = useState(false);
  const [activeButton, setActiveButton] = useState('amount');
  const [isEqualSplit, setIsEqualSplit] = useState(false)
  const [isItemSplit,setisItemSplit] = useState(false)
  const [modalContent, setModalContent] = useState('');
  const [cards, setCards] = useState([]);
  const [splitData, setSplitData] = useState(false)
  const [splitDatastatus, setSplitDatastatus] = useState(orderdata.splitStatus)
  const [isClassificationSplit, setIsClassificationsSplit] = useState(false)
  const [selectedOption, setSelectedOption] = useState('LIQUOR+OTHERS');
  const [classificationData, setClassificationData] = useState([]);
  const [OpenSpltCnt,setOpenSpltCnt] = useState([])
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showSpltModal, setshowSpltModal] = useState(false);
  const tableDataString = localStorage.getItem('tableData');
  // const tableData = JSON.parse(tableDataString);
  // const MySwal = withReactContent(Swal)
  const [IndexOfQtyToBeSplit, setIndexOfQtyToBeSplit] = useState([])
  const [loading, setLoading] = useState(false);
  const [isProcessingalert, setIsProcessingalert] = useState(false)
  // const [isProcessing, setIsProcessing] = useState(false);
  const [restoreorder,setrestoreorder] = useState(false)
  const [opensplitModal,setopensplitModal] = useState(false)
  const [closesplitprocess,setclosesplitprocess] = useState(false)
  const [closesplitprocesstable,setclosesplitprocesstable] = useState(false)
  const [resetopensplit,setresetopensplit] = useState(false)
  const [FolioNumber, setFolioNumber] = useState(0)
  const [previewFolioData,setpreviewFolioData] = useState([])
  const [finishsplitconfirmation,setfinishsplitconfirmation] = useState(false)
  const [activefolioButton, setActivefolioButton] = useState(0);
  const [paymentStatus,setpaymentStatus] = useState(null)
  const [billGeneratedStatus,setbillGeneratedStatus] = useState(null)
  const [confirmamtvoid,setconfirmamtvoid] = useState(false)
  const [recievedPaymentvoid,setrecievedPaymentvoid] = useState(0)
  const [OrderPaymentDetailsID,setOrderPaymentDetailsID] = useState(0)
  const [confirmremovedisc,setconfirmremovedisc] = useState(false)
  const [confirmBackButtonClick,setconfirmBackButtonClick] = useState(false)
  const [roomDiscConfirm,setroomDiscConfirm] = useState(false)
  const [selectedGuestinRoomDisc,setselectedGuestinRoomDisc] = useState([])
  const [roomdisctoshow,setroomdisctoshow] = useState([])


  const list0 = Object.entries(alltableData).map(([key, value]) => ({
    id: value.id,
    content: value.itemName,
    qty: value.qty
  }))
  let list1 = []
  let list2 = []
  let list3 = []
  let list4 = []
  let list5 = []
  let list6 = []
  let list7 = []
  let list8 = []
  let list9 = []
  let list10 = []
  let list11 = []
  let list12 = []
  let list13 = []
  let list14 = []
  let list15 = []

  const array = {
    list0, list1, list2, list3, list4, list5, list6, list7, list8, list9, list10, list11, list12, list13, list14, list15
  }
  const [listArr0, setListArr0] = useState(array.list0)
  const [listArr1, setListArr1] = useState(array.list1)
  const [listArr2, setListArr2] = useState(array.list2)
  const [listArr3, setListArr3] = useState(array.list3)
  const [listArr4, setListArr4] = useState(array.list4)
  const [listArr5, setListArr5] = useState(array.list5)
  const [listArr6, setListArr6] = useState(array.list6)
  const [listArr7, setListArr7] = useState(array.list7)
  const [listArr8, setListArr8] = useState(array.list8)
  const [listArr9, setListArr9] = useState(array.list9)
  const [listArr10, setListArr10] = useState(array.list10)
  const [listArr11, setListArr11] = useState(array.list11)
  const [listArr12, setListArr12] = useState(array.list12)
  const [listArr13, setListArr13] = useState(array.list13)
  const [listArr14, setListArr14] = useState(array.list14)
  const [listArr15, setListArr15] = useState(array.list15)
  

  const [selectedFolio, setSelectedFolio] = useState(0);
  const [folioData, setFolioData] = useState([]); 

//New Split-------------------------------------------------------//
  function checkSplitStatus () {
    return fetchx(API_URL + '/checkSplitStatus', {
      method: 'POST',
      body: JSON.stringify({
        hotelID: 1,
        storeID: localStorage.getItem('storeID'),
        orderID: localStorage.getItem('orderID'),
        tableNo: localStorage.getItem('TableSelected'),
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((res) => res.json())
    .then((resp) => {
      setSplitDatastatus(resp['data'])
    });
  }
  const [serviceCharge,setserviceCharge] = useState(0)
  const [subTotal,setsubTotal] = useState(0)
  const fetchOrderDetails = () => {
    const billfetch = JSON.stringify({
      hotelID: 1,
      storeID: localStorage.getItem('storeID'),
      orderID: localStorage.getItem('orderID'),
      tableNo: localStorage.getItem('TableSelected'),
    });
  
    fetch(API_URL + '/getPOSOrderDetails', {
      method: 'POST',
      body: billfetch,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((post) => {
        if (post['statuscode'] === 200) {
          const billdata = post['data']; 
          setorderdata(billdata); 
          setallTableData(billdata.AllFolioData[0].items)
          if (billdata.AllFolioData && billdata.AllFolioData.length > 0) {
            let folioDataTemp = {};
            billdata.AllFolioData.forEach(folio => {
              folioDataTemp[folio.FolioNo] = folio;
            });
  
            const firstFolio = billdata.AllFolioData[0].FolioNo;
            console.log(firstFolio)
            const firstFolioData = folioDataTemp[firstFolio];
  
            setfinalBalanceAmt(firstFolioData['Balance']);
            setBalanceValue(firstFolioData['Balance']);
            setsubTotal(firstFolioData['subtotal'])
            setinvBalance1(firstFolioData['total']);
            setserviceCharge(firstFolioData['serviceCharge']);
            setIsservicecharge(firstFolioData['isServiceCharge'])  
            setTableData(firstFolioData['items']);
            setFolioNumber(firstFolio)
            allPaymentData(firstFolio)
            settotalDiscount(firstFolioData['TotalDiscount'])
            setpreviewFolioData(firstFolioData)
            setActivefolioButton(firstFolio)
            setpaymentStatus(firstFolioData['paymentCompleted'])
            setbillGeneratedStatus(firstFolioData['BillGenerated'])
          }
        } else {
          setorderdata(null);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  
  
  useEffect(() => {
    fetchOrderDetails(); 
  }, [billdata.AllFolioData]); 
  //New Split---------------------------------------------------------//

  function allPaymentData (FolioNumber) {
    fetchx(API_URL + '/getAllTransactions?hotelID=1&storeID=' + localStorage.getItem('storeID') + '&orderID=' + localStorage.getItem('orderID') + '&tableNo=' + localStorage.getItem('TableSelected') + '&FolioNo=' + FolioNumber)
    .then(result => result.json())
    .then((resp) => {
      setrecievedPayment(resp['data'])
    });
  }

  useEffect(() => {
      const savedVoucherData = localStorage.getItem('selectedVoucherData');
      if (savedVoucherData) {
        const parsedVoucher = JSON.parse(savedVoucherData);
        setVoucher(parsedVoucher); // Set the single voucher object
      }
      checkSplitStatus();
    }, []);

  useEffect(() => {
    const hotelID = JSON.stringify({
      hotelID: 10
    })
    fetchx(API_URL + "/getHotelConfigByhotelID", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelID
    }).then((res) => res.json())
    .then(response => {
      setimage(response["data"][0]["netZeroLogoName"])
              setlogostatus(response["data"][0]["isNetZeroLogo"])

    })
  },[])
  
  useEffect(() => {
    fetchx(API_URL + "/getBusinessDatePOS", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())
      .then(postres => {
        setHotelDetails(postres['data'])
        setHotelAddress(postres['data'][0]['address'])
        setHotelName(postres['data'][0]['name'])
        setHotelNo(postres['data'][0]['phoneNumber'])
        sethotelFax(postres['data'][0]['fax'])
        setLogo(postres['data'][0]['logo'])
        setCINNumber(postres['data'][0]['CINNumber'])
        setGSTINNumber(postres['data'][0]['GSTIN'])
        setFSSAINumber(postres['data'][0]['FSSAINumber'])
        setfirmdata(postres['data'][0]['firm'])
        setfaxdata(postres['data']['0']['fax'])
        setwebsitedata(postres['data']['0']['website'])
        setpostalcodedata(postres['data']['0']['postalcode'])


        
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [])

  useEffect(() => {
    fetchx(API_URL + '/getPOSPayment?hotelID=1')
      .then(result => result.json())
      .then(resp => {
        const responseData = resp['data'];
        const paymentTypes = responseData.map((item) => ({
          label: item.label,
          value: item.label,
        }));
        setPaymentOptions(paymentTypes);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [])



  if (tableData.length != 0) {
    const tableDataString = JSON.stringify(tableData);
    localStorage.setItem("tableData", tableDataString);

  }

  const defaultValues = {
    balance: data['Balance'],
    PaymentType: null,
    tableno: localStorage.getItem('tableNumber'),
    orderNumber: localStorage.getItem('orderID'),
    guestname: "",
    gstNo: "",
    mobileNo: " ",

  };
  // if(selectedPaymentType.value ==='Cash'){
  //   sessionStorage.removeItem('selectedInHGuest');
  // }
  const handlePaymentTypeChange = (selectedOption) => {
    if (balanceValue != 0.00) {
      setSelectedPaymentType(selectedOption);

    }
    else {
      const swalInstance = MySwal.fire({
        text: "Amount paid.Cannot select other payments. ",
        buttonsStyling: false,
        confirmButtonText: 'Close',
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      });
      swalInstance.then((result) => {
        if (result.isConfirmed) {
          setSelectedPaymentType(null);

        }
      });
    }

   
    if (selectedOption.value === "Post To Room" && balanceValue != 0.00) {
      setRoomDiscount(true)
      setinhouseGuestModal(true)
        setsearchRoomORGuest('')
        setselectedRoomNumber('')
    }

    // else {
    //   sessionStorage.removeItem('selectedInHGuest');
    // }
    if (selectedOption.value === 'BTC' && balanceValue != 0.00) {
      setbtcCompanyModal(true)
      setsearchCompany('')
      setselectedCompany('')
    }
    if (selectedOption.value !== 'Post To Room') {
      // sessionStorage.removeItem('selectedInHGuest')

      // if(roomDiscount) {
      const removeDiscount = JSON.stringify({
        "hotelID": 1,
        "storeID": localStorage.getItem('storeID'),
        "orderID": localStorage.getItem('orderID'),
        "tableNo": localStorage.getItem('TableSelected'),
        "FolioNo": FolioNumber,
      });
      console.log(removeDiscount)
      let res = fetchx(API_URL + '/revokePOSDiscounts', {
        method: 'POST',
        body: removeDiscount,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((res) => res.json())
        .then(result => {
          console.log()
          if (result['statuscode'] == 200) {
            // allPaymentData(FolioNumber);
            const billfetch = JSON.stringify({
              hotelID: 1,
              storeID: localStorage.getItem('storeID'),
              orderID: localStorage.getItem('orderID'),
              tableNo: localStorage.getItem('TableSelected'),
            });
            fetch(API_URL + '/getPOSOrderDetails', {
              method: 'POST',
              body: billfetch,
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            })
              .then((res) => res.json())
              .then((post) => {
                if (post['statuscode'] === 200) {
                  const billdata = post['data'];
                  setorderdata(billdata);
                  setallTableData(billdata.AllFolioData[0].items)
                  if (billdata.AllFolioData && billdata.AllFolioData.length > 0) {
                    let folioDataTemp = {};
                    billdata.AllFolioData.forEach((folio) => {
                      folioDataTemp[folio.FolioNo] = folio;
                    });
                    const selectedFolio = folioDataTemp[FolioNumber]; 
                    if (selectedFolio) {
                      console.log(selectedFolio)
                      setfinalBalanceAmt(selectedFolio['Balance']);
                      setBalanceValue(selectedFolio['Balance']);
                      setsubTotal(selectedFolio['subtotal']);
                      setinvBalance1(selectedFolio['total']);
                      setserviceCharge(selectedFolio['serviceCharge']);
                      setIsservicecharge(selectedFolio['isServiceCharge']);
                      setTableData(selectedFolio['items']);
                      setFolioNumber(FolioNumber); 
                      allPaymentData(FolioNumber); 
                      settotalDiscount(selectedFolio['TotalDiscount']);
                      setpreviewFolioData(selectedFolio)
                    }
                  }
                  allPaymentData(FolioNumber);

                } else {
                  setorderdata(null);
                }
              })
              .catch((err) => {
                console.log(err.message);
              });
          }

        })
        .catch(error => {
          // Handle any errors that occur during the API call
          // console.error('API error:', error);
        });
      // }

 
      // getOrderdata(setData);
      allPaymentData(FolioNumber);


    }

  };
  const handleCancelPayButtonClick = () => {
    setIsProcessing(false)
    setpaymentInfoModal(false)
  }


  const handlePayButtonClick = () => {
    setIsProcessing(true);
    let paymentType = selectedPaymentType.value
    let paymentData = {};
    let paymentData1 = " ";
    let inhouseRoomNo = " ";
    if (paymentType === 'Post To Room') {
      // paymentData = paymentType.replace(`"paymentType":"${paymentType}"`, '"paymentType":"guest"');
      paymentData1 = "Guest";
      inhouseRoomNo = selectedRoomNumber

    }
    else if (paymentType === 'BTC') {
      // paymentData = paymentType.replace(`"paymentType":"${paymentType}"`, '"paymentType":"guest"');
      paymentData1 = "BTC";
      inhouseRoomNo = selectedbtcCompany.companyid
      sessionStorage.setItem('companyid', inhouseRoomNo)
    }
    else {
      paymentData1 = selectedPaymentType.value;

    }
    handleSubmit((data1) => {

      // console.log(data1)
      const invBalance = data['Balance'];
      let balError = false
      if (balanceValue < 0) {
        balError = true
        const swalInstance = MySwal.fire({
          text: "Balance amount cannot be negative",
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            setpaymentInfoModal(false)
            setIsProcessing(false)

          }
        });
      }
      if (parseFloat(finalBalanceAmt) > parseFloat(balanceValue)) {
        balError = true
        const swalInstance = MySwal.fire({
          text: "Balance amount cannot be greater than the actual amount",
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            setpaymentInfoModal(false)
            setIsProcessing(false)
          }
        });
      }

      if (!balError) {
    
      paymentData = JSON.stringify({
        "hotelID": 1,
        "storeID": localStorage.getItem('storeID'),
        "orderID": localStorage.getItem('orderID'),
        "tableNo": localStorage.getItem('TableSelected'),
        "actualAmt": balanceValue,  
        "recievedAmt": finalBalanceAmt,
        "paymentType": paymentData1,
        "FolioNo": FolioNumber,
        "TranxDetails": (paymentType === 'Post To Room' || paymentType === 'BTC') 
          ? "" 
          : (data1?.transactionID ? String(data1.transactionID) : ""),
        "roomNo": (paymentType === 'Post To Room' || paymentType === 'BTC') ? inhouseRoomNo : null,
        // "tips": data1['tips'] !== undefined ? data1['tips'] : 0,
        "tips": data1['tips'] === '' || data1['tips'] === undefined ? 0 : data1['tips']

      });
    }      
      let res = fetchx(API_URL + '/amountSettled', {
        method: 'POST',
        body: paymentData,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((res) => res.json())
        .then((post) => {
          reset({
            tips: '',
            transactionID: ""
          });
          if (post.statusCode == 403 || post.statuscode == 403) {
            const swalInstance = MySwal.fire({
              text: post.message,
              buttonsStyling: false,
              confirmButtonText: 'Close',
              customClass: {
                confirmButton: 'btn btn-danger',
              },
            });
            swalInstance.then((result) => {
              if (result.isConfirmed) {
                setIsProcessing(false)
                setpaymentInfoModal(false);
                setpaymentInfoModal(false);
                // getOrderdata(setdata);
              }
            });
          }
          if (post.statusCode == 200 || post.statuscode == 200) {
            setIsProcessing(false)
            reset({
              tips: '',
              transactionID: ""
            });
            // setBalanceValue(post['data']['Balance'])
            // setfinalBalanceAmt(post['data']['Balance'])
            setSelectedPaymentType(null)
            // setTimeout(() => { navigate('/apps/posconfiguration/DisplayBill') }, 100);
            setpaymentInfoModal(false);
            // getOrderdata(setData);
            // const billfetchforpayment = JSON.stringify({
            //   "hotelID": 1,
            //   "storeID": localStorage.getItem('storeID'),
            //   "orderID": localStorage.getItem('orderID'),
            //   "tableNo": localStorage.getItem('TableSelected'),
            //   // "discID":0,
            //   // "billType":'DummyInvoice',
            //   // "paymentType":'Cash',
            //   // "FolioNo":0
            // })
            // fetchx(API_URL+'/getOrderDetails', {
            //   method: 'POST',
            //   body: billfetchforpayment,
            //   headers: {
            //     'Content-type': 'application/json; charset=UTF-8',
            //   },
            // })
            //   .then((res) => res.json())
            //   .then((post) => {
            //     if (post['statuscode'] == 200) {
            //       setfinalBalanceAmt(post['data']['Balance'])
            //       setinvBalance1(post['data']['total'])
            //       setBalanceValue(post['data']['Balance'])        
            //     }
            //     else[
            //       setData(null)
            //     ]
            //     // console.log(post)
            //   })
            //   .catch((err) => {
            //     console.log(err.message);
            //   });
            const billfetch = JSON.stringify({
              hotelID: 1,
              storeID: localStorage.getItem('storeID'),
              orderID: localStorage.getItem('orderID'),
              tableNo: localStorage.getItem('TableSelected'),
            });
            fetch(API_URL + '/getPOSOrderDetails', {
              method: 'POST',
              body: billfetch,
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            })
              .then((res) => res.json())
              .then((post) => {
                if (post['statuscode'] === 200) {
                  const billdata = post['data'];
                  setorderdata(billdata);
                  setallTableData(billdata.AllFolioData[0].items)
                  if (billdata.AllFolioData && billdata.AllFolioData.length > 0) {
                    let folioDataTemp = {};
                    billdata.AllFolioData.forEach((folio) => {
                      folioDataTemp[folio.FolioNo] = folio;
                    });
                    const selectedFolio = folioDataTemp[FolioNumber]; 
                    if (selectedFolio) {
                      setfinalBalanceAmt(selectedFolio['Balance']);
                      setBalanceValue(selectedFolio['Balance']);
                      setsubTotal(selectedFolio['subtotal']);
                      setinvBalance1(selectedFolio['total']);
                      setserviceCharge(selectedFolio['serviceCharge']);
                      setIsservicecharge(selectedFolio['isServiceCharge']);
                      setTableData(selectedFolio['items']);
                      setFolioNumber(FolioNumber); 
                      allPaymentData(FolioNumber); 
                      setpaymentStatus(selectedFolio['paymentCompleted'])
                    }
                  }
                } else {
                  // setorderdata(null);
                }
              })
              .catch((err) => {
                console.log(err.message);
              });
            allPaymentData(FolioNumber);

          }


        })
    })();

  }
  // const handlePayButtonClick1 = () => {
  //   if (selectedPaymentType) {
  //     setpaymentInfoModal(true);
  //   } else {
  //     const swalInstance = MySwal.fire({
  //       text: "Please select at least one payment!",
  //       buttonsStyling: false,
  //       confirmButtonText: 'Close',
  //       customClass: {
  //         confirmButton: 'btn btn-danger',
  //       },
  //     });

  //     swalInstance.then((result) => {
  //       if (result.isConfirmed) {
  //         // navigate('')
  //       }
  //     });
  //   }
  // };
  const handlePayButtonClick1 = () => {
    if (!selectedPaymentType) {
      MySwal.fire({
        text: "Please select at least one payment!",
        buttonsStyling: false,
        confirmButtonText: 'Close',
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      });
      return;
    }
  
    if (!finalBalanceAmt || finalBalanceAmt === '0' || finalBalanceAmt === '') {
      setBalanceError('Please add amount');
      return;
    }
  
    setBalanceError(''); // Clear error if amount is valid
    setpaymentInfoModal(true);
  };

  const handleInvoiceClick = () => {
    const invBalance = balanceValue;
    if (invBalance == 0.00) {
      setopenInvoice(true)
    } else {
      // return MySwal.fire({
      //   title: 'Please Complete the Payment!!',
      //   customClass: {
      //     confirmButton: 'btn btn-primary'
      //   },
      //   buttonsStyling: false
      // })
      MySwal.fire({
        text: "Please Complete the Payment!!",
        buttonsStyling: false,
        confirmButtonText: 'ok',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
      return;
    }
  };

  useEffect(() => {
    fetchx(API_URL + '/getInHouseGuests', {
      method: 'POST',
      body: JSON.stringify({
        "hotelID": 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then(resp => {
        const data = resp.data;
        setinhouseGuestDetails(data);
        for (let i = 0; i < data.length; i++) {
          data[i]['value'] = data[i]['roomNumber']
          data[i]['label'] = data[i]['roomNumber'] + '(' + data[i]['name'] + ')'
        }
        // console.log(data)
        setInhouseGuestOptions(data)

      })
    setTableData(orderdata['AllFolioData'][0]['items'])
    setallTableData(orderdata.AllFolioData[0].items)


    fetchx(API_URL + '/getAllTransactions?hotelID=1&storeID=' + localStorage.getItem('storeID') + '&orderID=' + localStorage.getItem('orderID') + '&tableNo=' + localStorage.getItem('TableSelected') + '&FolioNo=' + data['FolioNo'])
      .then(result => result.json())
      .then((resp) => {
        // console.log(resp['data']);



        setrecievedPayment(resp['data'])
      });

    fetchx(API_URL + '/getBTCCompaniesPOS?hotelID=1')
      .then(result => result.json())
      .then((resp) => {
        const data = resp.data;
        setbtcCompanyDetails(data);
        for (let i = 0; i < data.length; i++) {
          data[i]['value'] = data[i]['accountName']
          data[i]['label'] = data[i]['accountName']
        }
        setbtcCompanyOptions(data)
      });

  }, [])
  if (data != '') {
  }
  function handleCancelInvForm() {
    setopenInvoice(false)
  }
  function openInvoiceForm() {
    setopenInvoice(true)
  }
  const handleInvForm = () => {
    if (!isButtonClicked) {
      setOpen(true)
      const timeout = setTimeout(() => {
        setShowSecondaryMessage(true);
      }, 5000);

      setIsButtonClicked(true);
      handleSubmit((formData) => {
        const invbill = JSON.stringify({
          "hotelID": 1,
          "storeID": localStorage.getItem('storeID'),
          "orderID": localStorage.getItem('orderID'),
          "tableNo": localStorage.getItem('TableSelected'),
          "FolioNo": FolioNumber,
          "guestName": formData["emailBasic"],
          "guestCompanyGSTno": formData["gstNo"],
          "mobileNo": formData["mobileNo"],
          "pax": formData['pax']
        })

        setTimeout(() => {
          fetchx(API_URL + '/generateBill', {
            method: 'POST',
            body: invbill,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          })
            .then((res) => res.json())
            .then((post) => {
              // console.log(post)
              localStorage.setItem('BillNo', post['data']['BillNo'])
              if (post['statuscode'] == 200) {

                sessionStorage.removeItem('selectedInHGuest')

                // fetchx(API_URL + '/generateEbill', {
                //   method: 'POST',
                //   body: JSON.stringify({
                //     "hotelID": 1,
                //     "storeID": localStorage.getItem('storeID'),
                //     "orderID": localStorage.getItem('orderID'),
                //     "billNo": post['data']['BillNo'],
                //     "signature": ''

                //   }),
                //   headers: {
                //     'Content-type': 'application/json; charset=UTF-8',
                //   },
                // })
                //   .then((res) => res.json())
                //   .then((resp) => {
                //     if (resp.statuscode === 200) {

                      setTimeout(() => { navigate('/apps/POSconfiguration/Invoice') }, 2000)
                      setOpen(false);
                      setShowSecondaryMessage(false)
                    // }

                  // })
                  // .catch((err) => {
                  // });


              }
              if (post['statusCode'] === 403 || post['statuscode'] === 403) {
                console.log("403 Error - Redirecting");
                setTimeout(() => {
                  navigate('/apps/posconfiguration/Tableselection');
                }, 100);
    
                setShowSecondaryMessage(false); 
              }
            })
            .catch((err) => {
            });
        }, 1000)
      })();
    }
  }
  const handleAMTClick = () => {
    // localStorage.removeItem('selectedVoucherData')
    setSelectedVoucher(null)
    setIsAmountActive(true);
    setIsPercentageActive(false);
    setisCouponActive(false)
    setisItemDisActive(false)
    setisClassificationActive(false)
  }
  const handlePercentageClick = () => {
    // localStorage.removeItem('selectedVoucherData')
    setSelectedVoucher(null)
    setIsAmountActive(false);
    setIsPercentageActive(true);
    setisCouponActive(false)
    setisItemDisActive(false)
    setisClassificationActive(false)
    // console.log("Hello----------------------")
  }
 
  const handleClassification = () => {
    // localStorage.removeItem('selectedVoucherData')
    setSelectedVoucher(null)
    setIsAmountActive(false);
    setIsPercentageActive(false);
    setisCouponActive(false)
    setisItemDisActive(false)
    setisClassificationActive(true)
  }
  const handlecouponClick = () => {
    setIsAmountActive(false);
    setIsPercentageActive(false);
    setisCouponActive(true)
    setisItemDisActive(false)
    setisClassificationActive(false)
  }

  // const handlecouponNextClick = () => {
  //   console.log(phoneNumber)
  //   setcouponModal(true)
  //   setVouchers('Complimentary dinner for 2 guest at 24@43')
  // }

  const handleCancelDiscountModal = () => {
    reset();
    setIsProcessing(false)
    setdiscountModal(false)
  }

  const handlecouponNextClick = () => {
    handleSubmit((formData) => {
      const { phoneNumber } = formData;
      // fetchx(`http://192.168.3.90:14709/v8/getMappedLoyaltyVouchersByPhoneNumber?phoneNumber=${phoneNumber}`)
      // fetchx(`http://192.168.3.90:14709/v8/getMappedLoyaltyVouchersByPhoneNumber?phoneNumber=8971774048`)
      // fetchx(API_URL + '/getMappedLoyaltyVouchersByPhoneNumber?phoneNumber=8971774048')
      fetchx(API_URL + `/getMappedLoyaltyVouchersByPhoneNumber?phoneNumber=${phoneNumber}`)


      .then(result => result.json())

      .then(resp => {
       if(resp['statusCode'] == 200) {
        setGuestName(resp['data'][0]['fullName'])
        setPhoneNumber(resp['data'][0]['phoneNumber'])
        const filteredVouchers = resp['data'].filter(voucher => voucher.isExhausted === 0);
        if (filteredVouchers.length > 0) {
          setVouchers(filteredVouchers);
        }
        // setVouchers(resp['data']); 
        setcouponModal(true);
      }
      if (resp['statusCode'] == 403) {
        const swalInstance = MySwal.fire({
          text: resp['message'],
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        });
       
      }

      })
          
        
    })();
  };

  const handleRedemptionhistory = () => {
    handleSubmit((formData) => {
      const { phoneNumber } = formData;
      setphoneNumberRedemption(phoneNumber)
      // sessionStorage.setItem('phoneNumberRedemption',phoneNumber)
      setredemptionhistoryModal(true);
    })();
  }

  const handleCouponDiscountModal =() => {
    setdiscountModal(false)
    reset();
  }

  const handleApplyClick = (voucher) => {
    // sessionStorage.setItem('VoucherData', JSON.stringify(voucher));
    if(voucher.VoucherType == 'Single') {
      setconfirmationSingleVoucherModal(true)
    }
    if(voucher.VoucherType == 'Multi') {
      // setVoucherDiscountModal(true)
      setVoucherDiscountModal1(true);

    }
    setSelectedVoucher(voucher);


   
  };
  const handleModalClose = (updatedOrderData) => {
    reset();
    setcouponModal(false)
    setdiscountModal(false)
    if (updatedOrderData) {
      if (updatedOrderData.AllFolioData && updatedOrderData.AllFolioData.length > 0) {
        let folioDataTemp = {};
        updatedOrderData.AllFolioData.forEach((folio) => {
          folioDataTemp[folio.FolioNo] = folio;
        });
        const selectedFolio = folioDataTemp[FolioNumber]; 
        if (selectedFolio) {
          setfinalBalanceAmt(selectedFolio['Balance']);
          setBalanceValue(selectedFolio['Balance']);
          setsubTotal(selectedFolio['subtotal']);
          setinvBalance1(selectedFolio['total']);
          setserviceCharge(selectedFolio['serviceCharge']);
          setIsservicecharge(selectedFolio['isServiceCharge']);
          setTableData(selectedFolio['items']);
          setFolioNumber(FolioNumber); 
          allPaymentData(FolioNumber); 
          settotalDiscount(selectedFolio['TotalDiscount'])
          setpreviewFolioData(selectedFolio)
        }
      }
      setorderdata(updatedOrderData);
    }
    // localStorage.removeItem('selectedVoucherData')
    setVoucherDiscountModal1(false);
    setconfirmationSingleVoucherModal(false)
    setSelectedVoucher(null)
  };

  const handleModalClose1 = () => {
    setredemptionhistoryModal(false);
  };

  const toggleConfirmationVoucherModal = () =>{
    setSelectedVoucher(null)
    setconfirmationSingleVoucherModal(false)
  }
  const toggleConfirmationMultiVoucherModal = () => {
    setSelectedVoucher(null)
    setconfirmationMultiVoucherModal(false)
  }
  const handleDiscountTypeChange = (type) => {
    setDiscountType(type);
  };

  const handlecouponCancel = () => {
    setVoucherDiscountModal1(false)  
    setconfirmationSingleVoucherModal(false)  
  }

  const handleConfirm = () =>{
    setVoucherDiscountModal1(true)

  }

  const toggle = () => {
    setcouponModal(!couponModal);
  };


  const onSubmitDisc = (data) => {
    setIsProcessing(true)
    let balError = false
    // console.log(data)
    // console.log("=======================data=======================================")
    let discData = {};

    if (isPercentageActive) {
      const discType = "Percentage";
      const percentage = data.percentage;
      // console.log(percentage)
      if (parseFloat(percentage) >= 100) {
        balError = true;
        // alert("Percentage cannot be greater than 100");
        const swalInstance = MySwal.fire({
          text: "Percentage cannot be greater than 100",
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            setdiscountModal(false)
            navigate('')
          }
        });
      }
      // console.log('Percentage:', percentage);
      if (!balError) {
        discData = JSON.stringify({
          "hotelID": 1,
          "storeID": localStorage.getItem('storeID'),
          "orderID": localStorage.getItem('orderID'),
          "tableNo": localStorage.getItem('TableSelected'),
          "discType": discType,
          "description": JSON.stringify({ 'Percentage': percentage }),
          "valueFormat": discType,
          "FolioNo": FolioNumber,
        });
      }
      // console.log(discData)
    }

    if (isAmountActive) {
      // console.log(balanceValue)
      const discType = "Amount";
      const amount = data.amount;
      // console.log(amount)
      if (parseFloat(data.amount) >= parseFloat(balanceValue)) {
        balError = true
        // alert("Percentage cannot be greater than 100");
        const swalInstance = MySwal.fire({
          text: "Discount amount cannot be greater than the actual amount",
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            setdiscountModal(false)
            reset();
            setIsProcessing(false)
          }
        });
      }
      if (parseFloat(data.amount) < 0) {
        balError = true
        // alert("Percentage cannot be greater than 100");
        const swalInstance = MySwal.fire({
          text: "Discount amount cannot be negative",
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            setdiscountModal(false)
            reset();
            setIsProcessing(false)

            // navigate('')
          }
        });
      }
      if (!balError) {
        discData = JSON.stringify({
          "hotelID": 1,
          "storeID": localStorage.getItem('storeID'),
          "orderID": localStorage.getItem('orderID'),
          "tableNo": localStorage.getItem('TableSelected'),
          "discType": discType,
          "description": JSON.stringify({ 'Amount': amount }),
          "valueFormat": discType,
          "FolioNo": FolioNumber,
        });
      }
    }
 
    if (isClassificationActive) {
     
      let foodDisc = data.Food;
      let liquorDisc = data.Liquor;
      let softdrinksDisc = data.SoftDrinks;
      let smokesDisc = data.Smokes;
      let othersDisc = data.Others;
      if (foodDisc === undefined) {
        foodDisc = 0;
      }
      if (liquorDisc === undefined) {
        liquorDisc = 0;
      }
      if (softdrinksDisc === undefined) {
        softdrinksDisc = 0;
      }
      if (smokesDisc === undefined) {
        smokesDisc = 0;
      }
      if (othersDisc === undefined) {
        othersDisc = 0;
      }

      if (foodDisc >= 100 || liquorDisc >= 100 || softdrinksDisc >= 100 || smokesDisc >= 100 || othersDisc >= 100) {
        balError = true;
        // alert("Percentage cannot be greater than 100");
        const swalInstance = MySwal.fire({
          text: "Percentage cannot be greater than 100",
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            setdiscountModal(false)
            navigate('')
          }
        });
      }

      const discType = "Category";
      const valueFormat = "Percentage";
      if (!balError) {
        discData = JSON.stringify({
          "hotelID": 1,
          "storeID": localStorage.getItem('storeID'),
          "orderID": localStorage.getItem('orderID'),
          "tableNo": localStorage.getItem('TableSelected'),
          "discType": discType,
          "description": JSON.stringify({ 'food': foodDisc, 'softDrinks': softdrinksDisc, 'liquor': liquorDisc, 'smokes': smokesDisc, 'others': othersDisc }),
          "valueFormat": valueFormat,
          "FolioNo": FolioNumber,
        });
      }
    }

    // console.log(discData)
    let res = fetchx(API_URL + '/applyDiscount', {
      method: 'POST',
      body: discData,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then(result => {    
        let selectedFolio1 = ''
        if(result['statusCode'] == 200 || result['statuscode'] == 200) {
          const billdata = result['data'];
          if (billdata) {
                    settotalDiscount(billdata.TotalDiscount)
                }

          const billfetch = JSON.stringify({
            hotelID: 1,
            storeID: localStorage.getItem('storeID'),
            orderID: localStorage.getItem('orderID'),
            tableNo: localStorage.getItem('TableSelected'),
          });
          fetch(API_URL + '/getPOSOrderDetails', {
            method: 'POST',
            body: billfetch,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          })
            .then((res) => res.json())
            .then((post) => {
              if (post['statuscode'] === 200) {
                const billdata = post['data'];
                setorderdata(billdata);
                setallTableData(billdata.AllFolioData[0].items)
                if (billdata.AllFolioData && billdata.AllFolioData.length > 0) {
                  let folioDataTemp = {};
                  billdata.AllFolioData.forEach((folio) => {
                    folioDataTemp[folio.FolioNo] = folio;
                  });
                  const selectedFolio = folioDataTemp[FolioNumber]; 
                  if (selectedFolio) {
                    setfinalBalanceAmt(selectedFolio['Balance']);
                    setBalanceValue(selectedFolio['Balance']);
                    setsubTotal(selectedFolio['subtotal']);
                    setinvBalance1(selectedFolio['total']);
                    setserviceCharge(selectedFolio['serviceCharge']);
                    setIsservicecharge(selectedFolio['isServiceCharge']);
                    setTableData(selectedFolio['items']);
                    setFolioNumber(FolioNumber); 
                    allPaymentData(FolioNumber); 
                    settotalDiscount(selectedFolio['TotalDiscount']);
                    setpreviewFolioData(selectedFolio)
                    const swalInstance = MySwal.fire({
                      title: (
                        <div>
                          <FaRupeeSign style={{ fontSize: '20px', marginRight: '5px' }} />
                          <strong>{selectedFolio['TotalDiscount']}</strong>
                        </div>
                      ),
                      text: 'Discount applied successfully!!',
                      icon: 'success',
                      buttonsStyling: false,
                      confirmButtonText: 'Close',
                      customClass: {
                        confirmButton: 'btn btn-danger',
                      },
                      allowOutsideClick: false,
                      allowEscapeKey: false
          
                    });
                    swalInstance.then((swalResult) => {
                      if (swalResult.isConfirmed) {
                        setIsProcessing(false)
                        setdiscountModal(false)
                        reset();
                        // navigate('/apps/posconfiguration/DisplayBill');
                        setdiscountModal1(false);
                        reset();
                      }
                    });
                  }
                }
              } else {
                setorderdata(null);
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
     
        } else if(result['statusCode'] == 403) { 
          reset();
          setIsProcessing(false)
          setdiscountModal(false);
          const swalInstance = MySwal.fire({
            text: result['message'],
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-danger',
            },
            allowOutsideClick: false,
            allowEscapeKey: false

          }).then((swalResult) => {
            if (swalResult.isConfirmed) {
              setdiscountModal(false);
              reset(); // Assuming reset is defined elsewhere
            }
          });
        } else {
          // Handle other status codes if needed
        }
      })
      .catch(error => {
        console.error('API error:', error); // Added error logging
      });
  }

  const handleGuestSelect = (guest) => {
    setselectedGuestinRoomDisc(guest)
  setRoomDiscount(true)
   

    const inHRoomNo = guest.roomNumber
    const reservationID = guest.reservationID

    sessionStorage.setItem('inHRoomNo1', inHRoomNo)
    sessionStorage.setItem('selectedIHRoomNo', reservationID)
    sessionStorage.setItem('selectedIHRoomNo1', inHRoomNo)


    sessionStorage.setItem('selectedInHGuest', guest.name)

    setselectedRoomNumber(reservationID)   
    setselectedRoomNumber1(inHRoomNo)

    setSelectedGuest(guest);
    
    if(roomDiscount) {
    const billfetch = JSON.stringify({
      "hotelID": 1,
      "storeID": localStorage.getItem('storeID'),
      "orderID": localStorage.getItem('orderID'),
      "tableNo": localStorage.getItem('TableSelected'),
      "FolioNo": FolioNumber,
      "roomNo": guest.reservationID

    })
      fetchx(API_URL + '/getRoomDiscountPOS', {
        method: 'POST',
        body: billfetch,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((res) => res.json())
        .then((post) => {
          // console.log(post)
          if (post.statuscode === 200) {
            const totalDiscountValue = Number(post.data.TotalDiscount); // Convert to number

            setroomdisctoshow(post.data.TotalDiscount)
            if (totalDiscountValue !== 0) {
              setroomDiscConfirm(true);
            }
            else if(totalDiscountValue == 0){
              setroomDiscConfirm(false)
              settotalDiscount(post.data.TotalDiscount)
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
      }

  }
  const handleBTCCompanySelect = (company) => {
    const inBtcCompany = company.accountName
    // const inBtcCompany = company.accountName
    setselectedCompany(inBtcCompany)
    setselectedbtcCompany(company);
  }
  const toggleModal = () => {
    setdiscountModal(!discountModal);
  };
  const toggleModalsplit = () => {
    setsplitModal(!splitModal);
    setActiveButton(null)
  };
  const toggleModal1 = () => {
    setopenPreviewBill(!openPreviewBill)
  }
  const handlePreview = (data) => {
    setopenPreviewBill(true)
  }
  const handleSplit = () => {

    if (balanceValue == 0.00 || balanceValue < invBalance1) {
      const swalInstance = MySwal.fire({
        text: "Payment Initiated,you can not split bill!",
        buttonsStyling: false,
        confirmButtonText: 'Close',
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      });
      swalInstance.then((result) => {
        if (result.isConfirmed) {
          // navigate('/apps/posconfiguration/DisplayBill');
        }
      });
    }
    else {
      setsplitModal(true)
      // navigate('/apps/posconfiguration/Split')
    }
  }
  const handleChange = (e) => {
    setfinalBalanceAmt(e.target.value);
  };

  const handleTipsChange = (value) => {
    const parsedtips1 = parseFloat(value).toFixed(2);
    const isValidNumber = !isNaN(parsedtips1) && isFinite(parsedtips1);
    setTipsAmount(isValidNumber ? parsedtips1 : 0);
    // calculateTaxAmount(value, balanceValue);
    // setTipsAmount(parsedtips1);
  };
  const handelvoidpayment = () => {
    setvoidpaymentModal(true)
    reset();
  }
  const handleOnSubMitvoidpayment = (data) => {
    fetchx(API_URL + '/voidPOSPayment', {
      method: 'PUT',
      body: JSON.stringify({
        "hotelID": 1,
        "storeID": localStorage.getItem('storeID'),
        "orderID": localStorage.getItem('orderID'),
        "FolioNo": FolioNumber,
        "tableNo": localStorage.getItem('TableSelected'),
        "billNo":0,
        "reason": data.reason,

      }),

      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((post) => {
        if (post['statuscode'] == 200) {
          reset();
          const swalInstance = MySwal.fire({
            title: 'Payment Voided',
            text: 'Payment Voided Successfully!!',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-danger'
            },
            allowOutsideClick: false,
            allowEscapeKey: false
          });
          // setTimeout(() => { navigate('') }, 1000);
            // fetchOrderDetails()
            setvoidpaymentModal(false)
          reset();
          const billfetch = JSON.stringify({
            hotelID: 1,
            storeID: localStorage.getItem('storeID'),
            orderID: localStorage.getItem('orderID'),
            tableNo: localStorage.getItem('TableSelected'),
          });
          fetch(API_URL + '/getPOSOrderDetails', {
            method: 'POST',
            body: billfetch,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          })
            .then((res) => res.json())
            .then((post) => {
              if (post['statuscode'] === 200) {
                const billdata = post['data'];
                setorderdata(billdata);
                setallTableData(billdata.AllFolioData[0].items)
                if (billdata.AllFolioData && billdata.AllFolioData.length > 0) {
                  let folioDataTemp = {};
                  billdata.AllFolioData.forEach((folio) => {
                    folioDataTemp[folio.FolioNo] = folio;
                  });
                  const selectedFolio = folioDataTemp[FolioNumber]; 
                  if (selectedFolio) {
                    setfinalBalanceAmt(selectedFolio['Balance']);
                    setBalanceValue(selectedFolio['Balance']);
                    setsubTotal(selectedFolio['subtotal']);
                    setinvBalance1(selectedFolio['total']);
                    setserviceCharge(selectedFolio['serviceCharge']);
                    setIsservicecharge(selectedFolio['isServiceCharge']);
                    setTableData(selectedFolio['items']);
                    setFolioNumber(FolioNumber); 
                    allPaymentData(FolioNumber); 
                    setpaymentStatus(selectedFolio['paymentCompleted'])
                    setbillGeneratedStatus(selectedFolio['BillGenerated'])
                    setpreviewFolioData(selectedFolio)
                  }
                }
              } else {
                // setorderdata(null);
              }
              allPaymentData(FolioNumber);

            })
            .catch((err) => {
              console.log(err.message);
            });

        }
        if(post['statuscode'] == 403 || post['statusCode'] == 403) {
          setvoidpaymentModal(false)
          const swalInstance = MySwal.fire({
            text: post['message'],
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
                confirmButton: 'btn btn-danger'
            }
        });
        swalInstance.then((result) => {
            if (result.isConfirmed) {
              // navigate('')
            }
        });
        }


      })
      .catch((err) => {
        console.log(err.message);
      });
  }


  const handleCancelVoidBillClick = () => {
    setvoidpaymentModal(false)
  }

  const confirmhandleBackButtonClick = () =>{
    const billfetch = JSON.stringify({
      hotelID: 1,
      storeID: localStorage.getItem('storeID'),
      orderID: localStorage.getItem('orderID'),
      tableNo: localStorage.getItem('TableSelected'),
    });
    fetch(API_URL + '/getPOSOrderDetails', {
      method: 'POST',
      body: billfetch,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((post) => {
        if (post['statuscode'] === 200) {
          const billdata = post['data'];
          if(billdata.splitStatus == true){
            setconfirmBackButtonClick(true)
          }
          if(billdata.splitStatus == false) {
            const removeDiscountonBack = JSON.stringify({
              "hotelID": 1,
              "storeID": localStorage.getItem('storeID'),
              "orderID": localStorage.getItem('orderID'),
              "tableNo": localStorage.getItem('TableSelected'),
              "FolioNo": FolioNumber,
            });
            fetchx(API_URL + '/revokePOSDiscounts', {
              method: 'POST',
              body: removeDiscountonBack,
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            })
              .then((res) => res.json())
              .then((post) => {
                if (post.statuscode === 200) {
                  navigate('/apps/posconfiguration/Addorder')
                }
        
              })
              .catch((err) => {
                console.log(err.message);
              });
          }
        } else {
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const handleBackButtonClick = () => {
    const removeDiscountonBack = JSON.stringify({
      "hotelID": 1,
      "storeID": localStorage.getItem('storeID'),
      "orderID": localStorage.getItem('orderID'),
      "tableNo": localStorage.getItem('TableSelected'),
      "FolioNo": FolioNumber,
    });
    fetchx(API_URL + '/revokePOSDiscounts', {
      method: 'POST',
      body: removeDiscountonBack,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((post) => {
        if (post.statuscode === 200) {
          navigate('/apps/posconfiguration/Tableselection')
        }

      })
      .catch((err) => {
        console.log(err.message);
      });
  }


  const handleaddserviceCharge = () => {
    const addservicechargedata = JSON.stringify({
      "hotelID": 1,
      "storeID": parseInt(localStorage.getItem('storeID')),
      "orderID": parseInt(localStorage.getItem('orderID')),
      "tableNo": parseInt(localStorage.getItem('TableSelected')),
      "folioNo": FolioNumber,
    });
    fetchx(API_URL + '/addPOSServiceCharge', {
      method: 'PUT',
      body: addservicechargedata,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((post) => {
        if (post.statusCode === 200) {
          const swalInstance = MySwal.fire({
            text: post['message'],
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            setservicechargeInfoModal(false);
            const billfetch = JSON.stringify({
              hotelID: 1,
              storeID: localStorage.getItem('storeID'),
              orderID: localStorage.getItem('orderID'),
              tableNo: localStorage.getItem('TableSelected'),
            });
            fetch(API_URL + '/getPOSOrderDetails', {
              method: 'POST',
              body: billfetch,
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            })
              .then((res) => res.json())
              .then((post) => {
                if (post['statuscode'] === 200) {
                  const billdata = post['data'];
                  setorderdata(billdata);
                  setallTableData(billdata.AllFolioData[0].items)
                  if (billdata.AllFolioData && billdata.AllFolioData.length > 0) {
                    let folioDataTemp = {};
                    billdata.AllFolioData.forEach((folio) => {
                      folioDataTemp[folio.FolioNo] = folio;
                    });
                    const selectedFolio = folioDataTemp[FolioNumber]; 
                    if (selectedFolio) {
                      setfinalBalanceAmt(selectedFolio['Balance']);
                      setBalanceValue(selectedFolio['Balance']);
                      setsubTotal(selectedFolio['subtotal']);
                      setinvBalance1(selectedFolio['total']);
                      setserviceCharge(selectedFolio['serviceCharge']);
                      setIsservicecharge(selectedFolio['isServiceCharge']);
                      setTableData(selectedFolio['items']);
                      setFolioNumber(FolioNumber); 
                      allPaymentData(FolioNumber); 
                      setpreviewFolioData(selectedFolio)
                    }
                  }
                } else {
                  setorderdata(null);
                }
              })
              .catch((err) => {
                console.log(err.message);
              });
          }
        });
        
        }
        if (post.statusCode === 403) {
          const swalInstance = MySwal.fire({
            text: post['message'],
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        swalInstance.then((result) => {
            if (result.isConfirmed) {
              setservicechargeInfoModal(false)
              // navigate('')
            }
        });
        }

      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const handleremoveserviceCharge = () =>{
    const removeservicechargedata = JSON.stringify({
      "hotelID": 10,
      "storeID": parseInt(localStorage.getItem('storeID')),
      "orderID": parseInt(localStorage.getItem('orderID')),
      "tableNo": parseInt(localStorage.getItem('TableSelected')),
      "folioNo": FolioNumber,
    });
    fetchx(API_URL + '/removePOSServiceCharge', {
      method: 'PUT',
      body: removeservicechargedata,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((post) => {
        if (post.statusCode === 200) {
          const swalInstance = MySwal.fire({
            text: post['message'],
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            allowOutsideClick: false,
            allowEscapeKey: false

        });
        swalInstance.then((result) => {
          if (result.isConfirmed) {
            setservicechargeInfoModal(false);
            const billfetch = JSON.stringify({
              hotelID: 1,
              storeID: localStorage.getItem('storeID'),
              orderID: localStorage.getItem('orderID'),
              tableNo: localStorage.getItem('TableSelected'),
            });
            fetch(API_URL + '/getPOSOrderDetails', {
              method: 'POST',
              body: billfetch,
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            })
              .then((res) => res.json())
              .then((post) => {
                if (post['statuscode'] === 200) {
                  const billdata = post['data'];
                  setorderdata(billdata);
                  setallTableData(billdata.AllFolioData[0].items)
                  if (billdata.AllFolioData && billdata.AllFolioData.length > 0) {
                    let folioDataTemp = {};
                    billdata.AllFolioData.forEach((folio) => {
                      folioDataTemp[folio.FolioNo] = folio;
                    });
        
                    // Use the selected folio number instead of defaulting to the first one
                    const selectedFolio = folioDataTemp[FolioNumber]; // FolioNumber should be the selected folio number
        
                    if (selectedFolio) {
                      // Set the selected folio data in the state
                      setfinalBalanceAmt(selectedFolio['Balance']);
                      setBalanceValue(selectedFolio['Balance']);
                      setsubTotal(selectedFolio['subtotal']);
                      setinvBalance1(selectedFolio['total']);
                      setserviceCharge(selectedFolio['serviceCharge']);
                      setIsservicecharge(selectedFolio['isServiceCharge']);
                      setTableData(selectedFolio['items']);
                      setFolioNumber(FolioNumber); // Maintain the selected folio number
        
                      // Set the selected folio data itself
                      console.log(selectedFolio)
        
                      allPaymentData(FolioNumber); // Handle additional data as required
                      setpreviewFolioData(selectedFolio)
                    }
                  }
                } else {
                  setorderdata(null);
                }
              })
              .catch((err) => {
                console.log(err.message);
              });
          }
        });
        }
        if (post.statusCode === 403) {
          const swalInstance = MySwal.fire({
            text: post['message'],
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        swalInstance.then((result) => {
            if (result.isConfirmed) {
              setservicechargeInfoModal(false)
              // navigate('')
            }
        });
        }

      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType); // Set the active button type
    if(buttonType == 'equalsplit') {
      // handleEqualSplit();
      setIsEqualSplit(true)
    }
    if(buttonType == 'Classification') {
      setIsClassificationsSplit(true)
    }
    if(buttonType == 'openItem'){
      setisItemSplit(true)
    }
  }
  
  const { reset, handleSubmit, control, formState: { errors }
  } = useForm({ defaultValues });

  const cardBodyStyle = {
    overflowY: 'auto',
    flex: '1',
    height: '150px',
  };

  const undoButtonContainerStyle = {
    padding: '8px',
    marginTop: 'auto',
  };
  const undoButtonStyle = {
    width: '100%',
    padding: '15px', // Increased padding for height
    fontSize: '1rem',
    fontWeight: '500',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    height: '50px', // Set a fixed height if needed
  };

const handleFolioClick = (folioNo) => {
  setSelectedPaymentType(null)
  setActivefolioButton(folioNo)
  setFolioNumber(folioNo)
  console.log('Folio clicked:', folioNo);

  const removeDiscount = JSON.stringify({
    "hotelID": 1,
    "storeID": localStorage.getItem('storeID'),
    "orderID": localStorage.getItem('orderID'),
    "tableNo": localStorage.getItem('TableSelected'),
    "FolioNo": folioNo,
  });

  let res = fetchx(API_URL + '/revokePOSDiscounts', {
    method: 'POST',
    body: removeDiscount,
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((res) => res.json())
    .then(result => {
      if (result['statuscode'] == 200) {
        const billfetch = JSON.stringify({
          hotelID: 1,
          storeID: localStorage.getItem('storeID'),
          orderID: localStorage.getItem('orderID'),
          tableNo: localStorage.getItem('TableSelected'),
        });
      
        fetch(API_URL + '/getPOSOrderDetails', {
          method: 'POST',
          body: billfetch,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then((res) => res.json())
          .then((post) => {
            if (post['statuscode'] === 200) {
              const billdata = post['data']; 
              console.log(billdata)
              setorderdata(billdata); 
              let folioDataTemp = {}
              billdata.AllFolioData.forEach(folio => {
              folioDataTemp[folio.FolioNo] = folio;
              console.log(folioDataTemp[folio.FolioNo])
            });
            console.log(folioDataTemp)
            // console.log(folioDataTemp[folioNo].TotalDiscount)
            setFolioData(folioDataTemp)
            // console.log(folioDataTemp)
            setfinalBalanceAmt(folioDataTemp[folioNo]['Balance']);
            setBalanceValue(folioDataTemp[folioNo]['Balance']);
            setinvBalance1(folioDataTemp[folioNo]['total']);
            setserviceCharge(folioDataTemp[folioNo]['serviceCharge']);
            setTableData(folioDataTemp[folioNo]['items'])
            setsubTotal(folioDataTemp[folioNo]['subtotal']);
            setIsservicecharge(folioDataTemp[folioNo]['isServiceCharge'])  
            allPaymentData(folioNo);
            settotalDiscount(folioDataTemp[folioNo].TotalDiscount)
            setpreviewFolioData(folioDataTemp[folioNo])
            setpaymentStatus(folioDataTemp[folioNo]['paymentCompleted'])
            setbillGeneratedStatus(folioDataTemp[folioNo]['BillGenerated'])
            } else {
              // setorderdata(null);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
      else {
        const billfetch = JSON.stringify({
          hotelID: 1,
          storeID: localStorage.getItem('storeID'),
          orderID: localStorage.getItem('orderID'),
          tableNo: localStorage.getItem('TableSelected'),
        });
      
        fetch(API_URL + '/getPOSOrderDetails', {
          method: 'POST',
          body: billfetch,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then((res) => res.json())
          .then((post) => {
            if (post['statuscode'] === 200) {
              const billdata = post['data']; 
              setorderdata(billdata); 
              let folioDataTemp = {}
              billdata.AllFolioData.forEach(folio => {
              folioDataTemp[folio.FolioNo] = folio;
            });
            setFolioData(folioDataTemp)
            setfinalBalanceAmt(folioDataTemp[folioNo]['Balance']);
            setBalanceValue(folioDataTemp[folioNo]['Balance']);
            setinvBalance1(folioDataTemp[folioNo]['total']);
            setserviceCharge(folioDataTemp[folioNo]['serviceCharge']);
            setTableData(folioDataTemp[folioNo]['items'])
            setsubTotal(folioDataTemp[folioNo]['subtotal']);
            setIsservicecharge(folioDataTemp[folioNo]['isServiceCharge'])  
            allPaymentData(folioNo);
            settotalDiscount(folioDataTemp[folioNo]['TotalDiscount'])
            setpreviewFolioData(folioDataTemp[folioNo])
            setpaymentStatus(folioDataTemp[folioNo]['paymentCompleted'])
            setbillGeneratedStatus(folioDataTemp[folioNo]['BillGenerated'])
            } else {
              // setorderdata(null);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      }

    })
    .catch(error => {
      // Handle any errors that occur during the API call
      // console.error('API error:', error);
    });


};

//   const ScrollableButtonList = () => {
//     let buttons = [];
//     const folioNumbers = orderdata.AllFolioData.map(folio => 'Folio#'+folio.FolioNo);
//     buttons= folioNumbers

//     const cardStyle = {
//       height: '640px',
//       width: '100%',
//       marginBottom: '10px',
//       display: 'flex',
//       flexDirection: 'column',
//     };
  
//     const cardBodyStyle = {
//       overflowY: 'auto',
//       flex: '1',
//       height: '650px',
//     };
  
//     const folioRowStyle = {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       padding: '12px',
//       marginBottom: '8px',
//       border: '1px solid #ccc',
//       borderRadius: '6px',
//       backgroundColor: '#f8f9fa',
//         fontSize: '1.2rem'
//     };
  
//     const folioTextStyle = {
//       display: 'flex',
//       alignItems: 'center',
//     };
  
//     const folioIconStyle = {
//       marginRight: '8px',
//       fontSize: '1.2rem',
//     };
  
//     const closeButtonStyle = {
//       backgroundColor: 'transparent',
//       border: 'none',
//       fontSize: '1.2rem',
//     };
  
//     const undoButtonContainerStyle = {
//       padding: '8px',
//       marginTop: 'auto',
//     };
  
//     const undoButtonStyle = {
//       width: '100%',
//       padding: '15px', // Increased padding for height
//       fontSize: '1rem',
//       fontWeight: '500',
//       color: 'white',
//       border: 'none',
//       borderRadius: '4px',
//       height: '50px', // Set a fixed height if needed
//     };
//     const undoButtonHoverStyle = {
//       backgroundColor: '#c82333',
//     };
//     return (
//       <Card style={cardStyle} >
//       <CardBody style={cardBodyStyle}>
//       {buttons.map((text, index) => {
//     const folioNumber = text.split('#')[1]; // Extract folio number

//     return (
//       <div 
      
//         key={index} 
//         style={{
//           ...folioRowStyle,
//           backgroundColor: activefolioButton == folioNumber ? 'yellow' : 'transparent',
//         }} 
        
//         onClick={() => handleFolioClick(folioNumber)} // Pass the folioNumber to the handler
//       >
//         <div style={folioTextStyle}>
//           <BiSolidCopy style={{ marginRight: '8px' }} />
//           <span>{text}</span>
//           <GrInProgress style={{ marginLeft: '35px' }} />
//         </div>
//       </div>
//     );
//   })}
// </CardBody>

//       <div style={undoButtonContainerStyle}>
//         <Button
//           color='danger'
//           style={undoButtonStyle}
//           onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = undoButtonHoverStyle.backgroundColor)}
//           onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = undoButtonStyle.backgroundColor)}
//           onClick={() => {
//             if (splitDatastatus === false) {
//               handleSplit(); // Trigger handleSplit when 'SPLIT BILL'
//             } else {
//               setrestoreorder(true); // Trigger setrestoreorder(true) when 'UNDO SPLIT'
//             }
//           }}
//         >
//           <span style={{ fontSize: '15px' }}>
//             <strong>{splitDatastatus === false ? 'SPLIT BILL' : 'UNDO SPLIT'}</strong>
//           </span>
//         </Button>
//       </div>
//     </Card>

//     );
//   };


const ScrollableButtonList = () => {
  let buttons = [];
  const folioNumbers = orderdata.AllFolioData.map(folio => 'Folio#' + folio.FolioNo);
  buttons = folioNumbers;

  const cardStyle = {
    height: '640px',
    width: '100%',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
  };

  const cardBodyStyle = {
    overflowY: 'auto',
    flex: '1',
    height: '650px',
  };

  const folioRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    marginBottom: '8px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
    fontSize: '1.2rem',
  };

  const folioTextStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const closeButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.2rem',
  };

  const undoButtonContainerStyle = {
    padding: '8px',
    marginTop: 'auto',
  };

  const undoButtonStyle = {
    width: '100%',
    padding: '15px',
    fontSize: '1rem',
    fontWeight: '500',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    height: '50px',
  };

  const undoButtonHoverStyle = {
    backgroundColor: '#c82333',
  };

  return (
    <Card style={cardStyle}>
      <CardBody style={cardBodyStyle}>
        {orderdata.AllFolioData.map((folio, index) => {
          const folioNumber = folio.FolioNo;

          return (
            <div
              key={index}
              style={{
                ...folioRowStyle,
                backgroundColor: activefolioButton == folioNumber ? 'yellow' : 'transparent',
              }}
              onClick={() => handleFolioClick(folioNumber)}
            >
              <div style={folioTextStyle}>
                <BiSolidCopy style={{ marginRight: '8px' }} />
                <strong><span>{'Folio#' + folioNumber}</span></strong>
                {folio.BillGenerated ? (
                  <IoCheckmarkDoneCircle style={{ marginLeft: '35px', fontSize: '24px',color: 'green' }} />
                ) : (
                  <GrInProgress style={{ marginLeft: '35px' }} />
                )}
              </div>
            </div>
          );
        })}
      </CardBody>

      <div style={undoButtonContainerStyle}>
        <Button
          color="primary"
          style={undoButtonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = undoButtonHoverStyle.backgroundColor)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = undoButtonStyle.backgroundColor)}
          onClick={() => {
            if (splitDatastatus === false) {
              handleSplit();
            } else {
              setrestoreorder(true);
            }
          }}
        >
          <span style={{ fontSize: '15px' }}>
            <strong>{splitDatastatus === false ? 'SPLIT BILL' : 'UNDO SPLIT'}</strong>
          </span>
        </Button>
      </div>
    </Card>
  );
};


  const handleFormSubmit = (data) => {
    const data1 = data['EqualSplit']
    if(data1){
      setIsProcessingalert(true)
    setLoading(true);
    }
    const tableData1 = tableData;
    const subordersData = {};
   
    Object.keys(data1).forEach((index) => {
      const equalSplitValue = data["EqualSplit"];
      const splitGroups = {};
    
      tableData1.forEach((item) => {
        const dividedQty = item.qty / equalSplitValue;
        for (let j = 1; j <= equalSplitValue; j++) {
          const splitNumber = j.toString();
          if (!splitGroups[splitNumber]) {
            splitGroups[splitNumber] = [];
          }
          splitGroups[splitNumber].push({
            "id": item.id,
            "qty": parseFloat(dividedQty.toFixed(2))
          });
        }
      });
    
      Object.assign(subordersData, splitGroups);
    });
    const subordersDataArray = [subordersData];
    const subordersDataJSON = JSON.stringify(subordersDataArray);
    setCards([...cards, data1]);
    
    fetchx(API_URL + '/splitorder', {
      method: 'POST',
      body: JSON.stringify({
        "hotelID": 10,
        "storeID": localStorage.getItem('storeID'),
        "orderID": localStorage.getItem('orderID'),
        "tableNo": localStorage.getItem('TableSelected'),
        "splitType": "split",
        "suborders": subordersDataJSON,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then(resp => {
        setsplitModal(false)
        fetchOrderDetails();  
        if (resp['statuscode'] == 200) {
          ScrollableButtonList();
          reset();
          setIsProcessingalert(false)
          setLoading(false);
          const splitData = resp.data;
          setSplitDatastatus(true)
          setIsEqualSplit(false)
          fetchOrderDetails();        }
        if (resp.statusCode === 403 || resp.statuscode === 403) {
          reset();
          setLoading(false);
          setIsProcessingalert(false)
          const swalInstance = MySwal.fire({
            text: data['message'],
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-danger',
            },
          });
          swalInstance.then((result) => {
            if (result.isConfirmed) {
              setIsEqualSplit(false)
            }
          });
        }

      })
      .catch((err) => {
        console.log(err.message);
      });


  };

  const closeModal = () => {
    setIsEqualSplit(false);
    setsplitModal(false)
    reset();
  };

   const handleEqualSplit = () => {
    // console.log(cardArray.length)
    // console.log(rightColumn.length)
    // if (cardArray.length === 0 && cardArray1.length === 0) {
    if (cardArray.length === 0 && rightColumn.length === 0) {

      setIsEqualSplit(true);
    } else {
      // alert("You can't click this button when cardArray is not empty.");
      const swalInstance = MySwal.fire({
        text: "Split is Already Done",
        buttonsStyling: false,
        confirmButtonText: 'Close',
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      });
    }
    // setIsEqualSplit(true)
  }

  const UndoSplit = () => {
    setSelectedPaymentType(null)
    fetchx(API_URL + '/restoreOriginalOrder', {
      method: 'PUT',
      body: JSON.stringify({
        "hotelID": 1,
        "storeID": localStorage.getItem('storeID'),
        "orderID": localStorage.getItem('orderID'),
        "tableNo": localStorage.getItem('TableSelected'),
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then(resp => {
        setrestoreorder(false)
        const removeDiscount = JSON.stringify({
          "hotelID": 1,
          "storeID": localStorage.getItem('storeID'),
          "orderID": localStorage.getItem('orderID'),
          "tableNo": localStorage.getItem('TableSelected'),
          "FolioNo": FolioNumber,
        });
  
        let res = fetchx(API_URL + '/revokePOSDiscounts', {
          method: 'POST',
          body: removeDiscount,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then((res) => res.json())
          .then(result => {
            if (result['statuscode'] == 200) {
  
            }
  
          })
          .catch(error => {
            // Handle any errors that occur during the API call
            // console.error('API error:', error);
          });
          fetchOrderDetails();
          const billfetch = JSON.stringify({
            hotelID: 1,
            storeID: localStorage.getItem('storeID'),
            orderID: localStorage.getItem('orderID'),
            tableNo: localStorage.getItem('TableSelected'),
          });
        
          fetch(API_URL + '/getPOSOrderDetails', {
            method: 'POST',
            body: billfetch,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          })
            .then((res) => res.json())
            .then((post) => {
              if (post['statuscode'] === 200) {
                const billdata = post['data']; 
                setorderdata(billdata); 
                setallTableData(billdata.AllFolioData[0].items)
              } else {
                setorderdata(null);
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
        if (resp['statuscode'] == 200) {
          const splitData = resp.data;
          setSplitData('')
          setSplitDatastatus(false)
          ScrollableButtonList();
        }
        if(resp.statusCode == 403 || resp.statuscode == 403) {
            const swalInstance = MySwal.fire({
              text: resp.message,
              buttonsStyling: false,
              confirmButtonText: 'Close',
              customClass: {
                confirmButton: 'btn btn-danger',
              },
            });

            swalInstance.then((result) => {
              if (result.isConfirmed) {
                // navigate('')
              }
            });
        }

      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const handleClassificationSplit1 = (event) => {
    setLoading(true)
    // console.log('Selected option:', selectedOption);
    let splitBy;
    if (selectedOption === "LIQUOR+OTHERS") {
      splitBy = {
        "Food": 1,
        "Liquor": 2,
        "SoftDrinks": 1,
        "Smokes": 1,
        "Others": 1
      };
    } else if (selectedOption === "LIQUOR+SMOKES+OTHERS") {
      splitBy = {
        "Food": 1,
        "Liquor": 2,
        "SoftDrinks": 1,
        "Smokes": 3,
        "Others": 1
      };
    } else {
      
    }
  
    // console.log(JSON.stringify({
    //   "hotelID": 1,
    //   "storeID": localStorage.getItem('storeID'),
    //   "orderID": localStorage.getItem('orderID'),
    //   "tableNo": localStorage.getItem('TableSelected'),
    //   "splitBy": splitBy,
    // }))
    fetchx(API_URL + '/splitByCategory', {
      method: 'POST',
      body: JSON.stringify({
        "hotelID": 1,
        "storeID": localStorage.getItem('storeID'),
        "orderID": localStorage.getItem('orderID'),
        "tableNo": localStorage.getItem('TableSelected'),
        "splitBy": JSON.stringify(splitBy),
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then(resp => {
        // console.log(resp)
        if (resp['statuscode'] == 200) {
          setsplitModal(false)
          setLoading(false)
          const classificationData = resp.data;
          setSplitData(classificationData)
          setIsClassificationsSplit(false)
          setSplitDatastatus(true)
          ScrollableButtonList();
          fetchOrderDetails();
        }

      })
  };

  const closeClassificationModal = () => {
    setIsClassificationsSplit(false)
    setsplitModal(false)
  }

  const closeQtyMOdal = () => {
    setshowSpltModal(false)
  }

  const closeItemModal = () => {
    setisItemSplit(false)
    setsplitModal(false)
  }

  const handleOpenSplit = (data) => {
    const openSplt = data.itemsplit;
  
    if (openSplt > 10) {
      MySwal.fire({
        title: 'Warning!',
        text: ' No of Split Cannot Exceed 10',
        icon: 'warning',
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
      });
    } else {
      setsplitModal(false)
      setOpenSpltCnt(openSplt);
      setisItemSplit(false);
      setopensplitModal(true)
    }
  };

  const closeopensplitModalModal = () => {
    setopensplitModal(false)
  }
  const leftColumn = [];
  const rightColumn = [];
  const createOpenCards = () => {
    // const leftColumn = [];
    // const rightColumn = [];

    for (let k = 0; k <= OpenSpltCnt; k++) {
      const idAndItemNamesArray = tableData.map(({ id, itemName }) => ({
        id,
        itemName,
      }));

      const items = k === 0 ? idAndItemNamesArray.map(({ itemName }) => itemName) : [];

      const card = (
        <Card
          key={`${k}`}
          className="me-0.5"
          style={{
            // height: k === 0 ? '400px' : '300px',  // Adjust the height for the left column card
            height: k === 0 ? '700px' : '300px',  // Adjust the height for the left column card

            width: '100%',
            marginBottom: '10px',
          }}
        >
          <CardHeader
            style={{
              fontSize: '16px',
              width: '100%',
              height: '50px',
              textAlign: 'center',
              fontWeight: 'bold',
              backgroundColor: '#7367f0',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            {k === 0 ? (
              <>
                <Col style={{ marginBottom: '10%' }} sm="4">Item</Col>
                <Col style={{ marginBottom: '10%' }} sm="4">Total Qty</Col>
                <Col style={{ marginBottom: '10%' }} sm="4">Action</Col>
              </>
            ) : (
              <>
                Folio Number# {localStorage.getItem('orderID') + '/' + (k + 0)}
              </>
            )}
          </CardHeader>
          <CardBody style={{ overflowY: 'auto', maxHeight: k === 0 ? '350px' : '100%' }}>
            <Row id={`dd-with-handle-${k}`}>
              <Col sm="12">
                {k === 0 && items.length > 0 && (
                  <ReactSortable
                    tag="ul"
                    className="list-group sortable"
                    group="shared-handle-group"
                    handle=".handle"
                    list={listArr0}
                    setList={setListArr0}
                  >
                    {listArr0.map((item, index) => (
                      
                      <ListGroupItem className="d-flex align-items-center">
                      {/* <ListGroupItem key={item.id} className="d-flex align-items-center"> */}

                      <span className="handle">
                        <PlusSquare />
                      </span>
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleItemSelected(item, index)}>SplitQty</Button>
                        </Col>
                      </ListGroupItem>
                    ))}
                  </ReactSortable>
                )}
                {k === 1 && (
                  <ReactSortable
                    tag='ul'
                    className='list-group sortable'
                    group='shared-handle-group'
                    handle='.handle'
                    list={listArr1}
                    setList={setListArr1}
                  >
                    {listArr1.map((item, index) => (
                      <ListGroupItem className="d-flex align-items-center">
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleRemoveItem(item, index, k)}>Remove</Button>
                        </Col>
                      </ListGroupItem>
                    ))}
                  </ReactSortable>
                )}
                {k === 2 && (
                <ReactSortable
                  tag='ul'
                  className='list-group sortable'
                  group='shared-handle-group'
                  handle='.handle'
                  list={listArr2}
                  setList={setListArr2}
                >
                 
                  {listArr2.map((item, index) => (
                    <ListGroupItem className="d-flex align-items-center">
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleRemoveItem(item, index, k)}>Remove</Button>
                        </Col>
                      </ListGroupItem>
                  ))}

                </ReactSortable>
              )}
              {k === 3 && (
                <ReactSortable
                  tag='ul'
                  className='list-group sortable'
                  group='shared-handle-group'
                  handle='.handle'
                  list={listArr3}
                  setList={setListArr3}
                >
                 
                  {listArr3.map((item, index) => (
                    <ListGroupItem className="d-flex align-items-center">
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleRemoveItem(item, index, k)}>Remove</Button>
                        </Col>
                      </ListGroupItem>
                  ))}
                </ReactSortable>
              )}
              {k === 4 && (
                <ReactSortable
                  tag='ul'
                  className='list-group sortable'
                  group='shared-handle-group'
                  handle='.handle'
                  list={listArr4}
                  setList={setListArr4}
                >
                   {listArr4.map((item, index) => (
                    <ListGroupItem className="d-flex align-items-center">
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleRemoveItem(item, index, k)}>Remove</Button>
                        </Col>
                      </ListGroupItem>
                  ))}
                </ReactSortable>
              )}
              {k === 5 && (
                <ReactSortable
                  tag='ul'
                  className='list-group sortable'
                  group='shared-handle-group'
                  handle='.handle'
                  list={listArr5}
                  setList={setListArr5}
                >
                   {listArr5.map((item, index) => (
                    <ListGroupItem className="d-flex align-items-center">
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleRemoveItem(item, index, k)}>Remove</Button>
                        </Col>
                      </ListGroupItem>
                  ))}
                </ReactSortable>
              )}
              {k === 6 && (
                <ReactSortable
                  tag='ul'
                  className='list-group sortable'
                  group='shared-handle-group'
                  handle='.handle'
                  list={listArr6}
                  setList={setListArr6}
                >
                 {listArr6.map((item, index) => (
                  <ListGroupItem className="d-flex align-items-center">
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleRemoveItem(item, index, k)}>Remove</Button>
                        </Col>
                      </ListGroupItem>
                  ))}
                </ReactSortable>
              )}
              {k === 7 && (
                <ReactSortable
                  tag='ul'
                  className='list-group sortable'
                  group='shared-handle-group'
                  handle='.handle'
                  list={listArr7}
                  setList={setListArr7}
                >
                 {listArr7.map((item, index) => (
                  <ListGroupItem className="d-flex align-items-center">
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleRemoveItem(item, index, k)}>Remove</Button>
                        </Col>
                      </ListGroupItem>
                  ))}
                </ReactSortable>
              )}
              {k === 8 && (
                <ReactSortable
                  tag='ul'
                  className='list-group sortable'
                  group='shared-handle-group'
                  handle='.handle'
                  list={listArr8}
                  setList={setListArr8}
                >
                  {listArr8.map((item, index) => (
                    <ListGroupItem className="d-flex align-items-center">
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleRemoveItem(item, index, k)}>Remove</Button>
                        </Col>
                      </ListGroupItem>
                  ))}
                </ReactSortable>
              )}
              {k === 9 && (
                <ReactSortable
                  tag='ul'
                  className='list-group sortable'
                  group='shared-handle-group'
                  handle='.handle'
                  list={listArr9}
                  setList={setListArr9}
                >
                  {listArr9.map((item, index) => (
                    <ListGroupItem className="d-flex align-items-center">
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleRemoveItem(item, index, k)}>Remove</Button>
                        </Col>
                      </ListGroupItem>
                  ))}
                </ReactSortable>
              )}
              {k === 10 && (
                <ReactSortable
                  tag='ul'
                  className='list-group sortable'
                  group='shared-handle-group'
                  handle='.handle'
                  list={listArr10}
                  setList={setListArr10}
                >
                 {listArr10.map((item, index) => (
                  <ListGroupItem className="d-flex align-items-center">
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleRemoveItem(item, index, k)}>Remove</Button>
                        </Col>
                      </ListGroupItem>
                  ))}
                </ReactSortable>
              )}
              {k === 11 && (
                <ReactSortable
                  tag='ul'
                  className='list-group sortable'
                  group='shared-handle-group'
                  handle='.handle'
                  list={listArr11}
                  setList={setListArr11}
                >
                  {listArr11.map((item, index) => (
                    <ListGroupItem className="d-flex align-items-center">
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleRemoveItem(item, index, k)}>Remove</Button>
                        </Col>
                      </ListGroupItem>
                  ))}
                </ReactSortable>
              )}
              {k === 12 && (
                <ReactSortable
                  tag='ul'
                  className='list-group sortable'
                  group='shared-handle-group'
                  handle='.handle'
                  list={listArr12}
                  setList={setListArr12}
                >
                   {listArr12.map((item, index) => (
                    <ListGroupItem className="d-flex align-items-center">
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleRemoveItem(item, index, k)}>Remove</Button>
                        </Col>
                      </ListGroupItem>
                  ))}
                </ReactSortable>
              )}{k === 13 && (
                <ReactSortable
                  tag='ul'
                  className='list-group sortable'
                  group='shared-handle-group'
                  handle='.handle'
                  list={listArr13}
                  setList={setListArr13}
                >
                  {listArr13.map((item, index) => (
                    <ListGroupItem className="d-flex align-items-center">
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleRemoveItem(item, index, k)}>Remove</Button>
                        </Col>
                      </ListGroupItem>
                  ))}
                </ReactSortable>
              )}
              {k === 14 && (
                <ReactSortable
                  tag='ul'
                  className='list-group sortable'
                  group='shared-handle-group'
                  handle='.handle'
                  list={listArr14}
                  setList={setListArr14}
                >
                  {listArr14.map((item, index) => (
                    <ListGroupItem className="d-flex align-items-center">
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleRemoveItem(item, index, k)}>Remove</Button>
                        </Col>
                      </ListGroupItem>
                  ))}
                </ReactSortable>
              )}
              {k === 15 && (
                <ReactSortable
                  tag='ul'
                  className='list-group sortable'
                  group='shared-handle-group'
                  handle='.handle'
                  list={listArr15}
                  setList={setListArr15}
                >
                  {listArr15.map((item, index) => (
                    <ListGroupItem className="d-flex align-items-center">
                        <Col sm="4">{item.content}</Col>
                        <Col sm="4" className="text-center">{item.qty}</Col>
                        <Col className="text-center">
                          <Button onClick={() => handleRemoveItem(item, index, k)}>Remove</Button>
                        </Col>
                      </ListGroupItem>
                  ))}
                </ReactSortable>
              )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      );

      if (k === 0) {
        leftColumn.push(card);
      } else {
        rightColumn.push(card);
      }
    }
    const rightColumnCards = [];
    for (let i = 0; i < rightColumn.length; i += 2) {
      rightColumnCards.push(
        <div key={i} style={{ display: 'flex', marginBottom: '10px' }}>
          {rightColumn.slice(i, i + 2).map((card, index) => (
            <div key={index} style={{ width: '48%', marginRight: index === 0 ? '10px' : 0, marginBottom: '10px' }}>
              {card}
            </div>
          ))}
        </div>
      );
    }
  

    return (
      <div style={{ display: 'flex', overflowX: 'auto' }}>
        <div style={{ marginRight: '20px', width: '31%' }}>
          {leftColumn}
        </div>
        <div style={{ width: '68%', maxHeight: '600px', overflowY: 'auto' }}>
          {rightColumnCards}
        </div>
      </div>
    );
  };

  const handlecloseopenSplit = () => {
    setclosesplitprocess(true)
  }

  const handlecloseopenSplit1 = () => {
    setListArr0(list0)
    setListArr1([])
    setListArr2([])
    setListArr3([])
    setListArr4([])
    setListArr5([])
    setListArr6([])
    setListArr7([])
    setListArr8([])
    setListArr9([])
    setListArr10([])
    setListArr11([])
    setListArr12([])
    setListArr13([])
    setListArr14([])
    setListArr15([])
  }

  const handleclickIoMdHome = () => {
    setclosesplitprocesstable(true)
  }

  const handleclickBiRotateLeft = () => {
    setresetopensplit(true)
  }
  const handleresetopensplit = () => {
    setresetopensplit(false)
    setListArr0(list0)
    setListArr1([])
    setListArr2([])
    setListArr3([])
    setListArr4([])
    setListArr5([])
    setListArr6([])
    setListArr7([])
    setListArr8([])
    setListArr9([])
    setListArr10([])
    setListArr11([])
    setListArr12([])
    setListArr13([])
    setListArr14([])
    setListArr15([])
  }

  const handleItemSelected = (selectedItem, index) => {
    // console.log(selectedItem)
    setSelectedItemId(selectedItem.id);
    // console.log(index)
    setIndexOfQtyToBeSplit(index)
    setshowSpltModal(true);

  };

  const handleSpltqty = (splitValue) => {
    
    const selectedItem = listArr0.find((item, index) => item.id === selectedItemId && index === IndexOfQtyToBeSplit);

    if (!selectedItem) {
      // Handle the case where the selected item is not found
      console.error("Selected item not found.");
      return;
    }

    const { qty } = selectedItem;
    // console.log(qty)
    // const noofSplt = splitValue.noofSplt;
    const noofSplt = parseInt(splitValue.noofSplt);

    if (isNaN(noofSplt) || noofSplt <= 0) {
      console.error("Invalid number of splits.");
      const swalInstance = MySwal.fire({
        text: "noofSplt amount cannot be zero",
        buttonsStyling: false,
        confirmButtonText: 'Close',
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      });
      swalInstance.then((result) => {
        if (result.isConfirmed) {
          setshowSpltModal(false)
        }
      });
      return;
    }
  
    
    // console.log(noofSplt)
    const splitQty = parseFloat((qty / noofSplt).toFixed(2));

    const updatedList = listArr0.reduce((acc, item, index) => {
      if (index === IndexOfQtyToBeSplit && item.id === selectedItemId) {
        for (let i = 0; i < noofSplt; i++) {
          acc.push({ ...item, qty: splitQty });
        }
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
    // console.log(updatedList)
    setListArr0(updatedList);
    setshowSpltModal(false);
  };

  const handleRemoveItem = (item, index, k) => {
    switch (k) {
      case 0:
        const updatedListArr0 = listArr0.filter((_, i) => i !== index);
        // setListArr0(updatedListArr0);
        // console.log(updatedListArr0); // Log the updated state
        break;
      case 1:
        const updatedListArr1 = listArr1.filter((_, i) => i !== index);
        setListArr1(updatedListArr1);
        setListArr0([...listArr0, item]); // Adding the item to listArr0
        // console.log(updatedListArr1); // Log the updated state
        break;
      // Other cases...
          case 2:
        const updatedListArr2 = listArr2.filter((_, i) => i !== index);
        setListArr2(updatedListArr2);
        setListArr0([...listArr0, item]);
        break;
      case 3:
        const updatedListArr3 = listArr3.filter((_, i) => i !== index);
        setListArr3(updatedListArr3);
        setListArr0([...listArr0, item]);
        break;
      case 4:
        const updatedListArr4 = listArr4.filter((_, i) => i !== index);
        setListArr4(updatedListArr4);
        setListArr0([...listArr0, item]);
        break;
      case 5:
        const updatedListArr5 = listArr5.filter((_, i) => i !== index);
        setListArr5(updatedListArr5);
        setListArr0([...listArr0, item]);
        break;
      case 6:
        const updatedListArr6 = listArr6.filter((_, i) => i !== index);
        setListArr6(updatedListArr6);
        setListArr0([...listArr0, item]);
        break;
      case 7:
        const updatedListArr7 = listArr7.filter((_, i) => i !== index);
        setListArr7(updatedListArr7);
        setListArr0([...listArr0, item]);
        break;
      case 8:
        const updatedListArr8 = listArr8.filter((_, i) => i !== index);
        setListArr8(updatedListArr8);
        setListArr0([...listArr0, item]);
        break;
      case 9:
        const updatedListArr9 = listArr9.filter((_, i) => i !== index);
        setListArr9(updatedListArr9);
        setListArr0([...listArr0, item]);
        break;
      case 10:
        const updatedListArr10 = listArr10.filter((_, i) => i !== index);
        setListArr10(updatedListArr10);
        setListArr0([...listArr0, item]);
        break;
      case 11:
        const updatedListArr11 = listArr11.filter((_, i) => i !== index);
        setListArr11(updatedListArr11);
        setListArr0([...listArr0, item]);
        break;
      case 12:
        const updatedListArr12 = listArr12.filter((_, i) => i !== index);
        setListArr12(updatedListArr12);
        setListArr0([...listArr0, item]);
        break;
      case 13:
        const updatedListArr13 = listArr13.filter((_, i) => i !== index);
        setListArr13(updatedListArr13);
        setListArr0([...listArr0, item]);
        break;
      case 14:
        const updatedListArr14 = listArr14.filter((_, i) => i !== index);
        setListArr14(updatedListArr14);
        setListArr0([...listArr0, item]);
        break;
      case 15:
        const updatedListArr15 = listArr15.filter((_, i) => i !== index);
        setListArr15(updatedListArr15);
        setListArr0([...listArr0, item]);
        break;
      default:
        break;
    }
  };

  const splitconfirmation = () => {
    setfinishsplitconfirmation(true)
  }
  const handleSplitNext = () => {
    let DataJSON={}
    let Data=[]
    for(var i=0;i<OpenSpltCnt;i++)  {

      let tempArr =[]
      let folioNo = i+1
      let tempCardData =[]
      if(folioNo==1){
        // console.log("folioNo==1")
        tempCardData = listArr1
      }else if(folioNo==2){
        // console.log("folioNo==2")
        tempCardData = listArr2
      }else if(folioNo==3){
        // console.log("folioNo==3")
        tempCardData = listArr3
      }else if(folioNo==4){
        // console.log("folioNo==4")
        tempCardData = listArr4
      }else if(folioNo==5){
        // console.log("folioNo==5")
        tempCardData = listArr5
      }else if(folioNo==6){
        // console.log("folioNo==6")
        tempCardData = listArr6
      }else if(folioNo==7){
        // console.log("folioNo==7")
        tempCardData = listArr7
      }else if(folioNo==8){
        // console.log("folioNo==8")
        tempCardData = listArr8
      }else if(folioNo==9){
        // console.log("folioNo==9")
        tempCardData = listArr9
      }else if(folioNo==10){
        // console.log("folioNo==10")
        tempCardData = listArr10
      }
      else if(folioNo==11){
        // console.log("folioNo==11")
        tempCardData = listArr11
      }else if(folioNo==12){
        // console.log("folioNo==12")
        tempCardData = listArr12
      }else if(folioNo==13){
        // console.log("folioNo==13")
        tempCardData = listArr13
      }
      else if(folioNo==14){
        // console.log("folioNo==14")
        tempCardData = listArr14
      }else if(folioNo==15){
        // console.log("folioNo==15")
        tempCardData = listArr15
      }
      // console.log(tempCardData)
      for (let index in tempCardData) {
        // console.log(index)
        tempArr.push({ id: tempCardData[index]['id'], qty: tempCardData[index]['qty'] });
      }

      // console.log(tempArr)
      DataJSON[i]=tempArr
    }

// console.log(DataJSON)

// console.log(DataJSON)
    Data.push(DataJSON)
    const resultJson = Data.map((item) => {
      const newItem = {};
      let currentKey = 1;
    
      for (const key in item) {
        if (item[key].length > 0) {
          newItem[currentKey.toString()] = item[key];
          currentKey++;
        }
      }
    
      return newItem;
    });
    
  
    const subordersData = JSON.stringify({
      "hotelID": 1,
      "storeID": localStorage.getItem('storeID'),
      "orderID": localStorage.getItem('orderID'),
      "tableNo": localStorage.getItem('TableSelected'),
      "splitType": "split",
      "suborders": JSON.stringify(resultJson),
    })
  //  console.log(subordersData)
      fetchx(API_URL+'/splitorder', {
          method: 'POST',
          body: subordersData,
          headers: {
              'Content-type': 'application/json; charset=UTF-8',
          },
      })
      .then((res) => res.json())
      .then(resp => {
        console.log(resp)
        setopensplitModal(false)
        handlecloseopenSplit1();
        if (resp['statuscode'] == 200) {
          setSplitDatastatus(true)
          setfinishsplitconfirmation(false)
          reset();
          setopensplitModal(false)
          setIsProcessing(false)
          const splitData = resp.data;
          setSplitData(splitData)
          setisItemSplit(false)
          fetchOrderDetails();
          //  const billfetch = JSON.stringify({
          //   hotelID: 1,
          //   storeID: localStorage.getItem('storeID'),
          //   orderID: localStorage.getItem('orderID'),
          //   tableNo: localStorage.getItem('TableSelected'),
          // });
  
          // fetch(API_URL + '/getOrderDetailsSplit', {
          //   method: 'POST',
          //   body: billfetch,
          //   headers: {
          //     'Content-type': 'application/json; charset=UTF-8',
          //   },
          // })
          //   .then((res) => res.json())
          //   .then((post) => {
          //     if (post['statuscode'] === 200) {
          //       const billdata = post['data']; 
          //       setorderdata(billdata); 
          //       setallTableData(billdata.AllFolioData[0].items)
          //       if (billdata.AllFolioData && billdata.AllFolioData.length > 0) {
          //         let folioDataTemp = {};
          //         billdata.AllFolioData.forEach(folio => {
          //           folioDataTemp[folio.FolioNo] = folio;
          //         });
        
          //         const firstFolio = billdata.AllFolioData[0].FolioNo;
          //         const firstFolioData = folioDataTemp[firstFolio];
        
          //         setfinalBalanceAmt(firstFolioData['Balance']);
          //         setBalanceValue(firstFolioData['Balance']);
          //         setsubTotal(firstFolioData['subtotal'])
          //         setinvBalance1(firstFolioData['total']);
          //         setserviceCharge(firstFolioData['serviceCharge']);
          //         setIsservicecharge(firstFolioData['isServiceCharge'])  
          //         setTableData(firstFolioData['items']);
          //         setFolioNumber(firstFolio)
          //         allPaymentData(firstFolio)
          //         settotalDiscount(firstFolioData['TotalDiscount'])
          //         setpreviewFolioData(firstFolioData)
          //         setpaymentStatus(firstFolioData['paymentCompleted'])
          //         setbillGeneratedStatus(firstFolioData['BillGenerated'])

          //       }
          //     } else {
          //       // setorderdata(null);
          //     }
          //   })
          //   .catch((err) => {
          //     console.log(err.message);
          //   });

        }
        if ((resp['statusCode'] == 403) || resp['statuscode'] == 403) {
          setIsProcessing(false)
          const swalInstance = MySwal.fire({
            text: resp['message'],
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-danger',
            },
          });
          swalInstance.then((result) => {
            if (result.isConfirmed) {
              setIsProcessing(false)
              // navigate('/apps/posconfiguration/Tableselection');
            }
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  const handleAmtRowvoid = (row) => {
    console.log(row.id)
    setconfirmamtvoid(true)
    setrecievedPaymentvoid(row.RecievedAmt)
    setOrderPaymentDetailsID(row.id)
  }

  const handleAmtvoid = () => {
    fetchx(API_URL + '/voidPartWisePayment', {
      method: 'PUT',
      body: JSON.stringify({
        "hotelID": 1,
        "storeID": localStorage.getItem('storeID'),
        "orderID": localStorage.getItem('orderID'),
        "FolioNo": FolioNumber,
        "tableNo": localStorage.getItem('TableSelected'),
        "OrderPaymentDetailsID": OrderPaymentDetailsID,
      }),

      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((post) => {
        if (post['statuscode'] == 200) {
          reset();
          setconfirmamtvoid(false)
          const swalInstance = MySwal.fire({
            title: 'Payment Voided',
            text: 'Payment Voided Successfully!!',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-danger'
            },
            allowOutsideClick: false,
            allowEscapeKey: false
          });
          // setTimeout(() => { navigate('') }, 1000);
            // fetchOrderDetails()
            setvoidpaymentModal(false)
          allPaymentData(FolioNumber);
          reset();
          const billfetch = JSON.stringify({
            hotelID: 1,
            storeID: localStorage.getItem('storeID'),
            orderID: localStorage.getItem('orderID'),
            tableNo: localStorage.getItem('TableSelected'),
          });
          fetch(API_URL + '/getPOSOrderDetails', {
            method: 'POST',
            body: billfetch,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          })
            .then((res) => res.json())
            .then((post) => {
              if (post['statuscode'] === 200) {
                const billdata = post['data'];
                setorderdata(billdata);
                setallTableData(billdata.AllFolioData[0].items)
                if (billdata.AllFolioData && billdata.AllFolioData.length > 0) {
                  let folioDataTemp = {};
                  billdata.AllFolioData.forEach((folio) => {
                    folioDataTemp[folio.FolioNo] = folio;
                  });
                  const selectedFolio = folioDataTemp[FolioNumber]; 
                  if (selectedFolio) {
                    setfinalBalanceAmt(selectedFolio['Balance']);
                    setBalanceValue(selectedFolio['Balance']);
                    setsubTotal(selectedFolio['subtotal']);
                    setinvBalance1(selectedFolio['total']);
                    setserviceCharge(selectedFolio['serviceCharge']);
                    setIsservicecharge(selectedFolio['isServiceCharge']);
                    setTableData(selectedFolio['items']);
                    setFolioNumber(FolioNumber); 
                    allPaymentData(FolioNumber); 
                    setpaymentStatus(selectedFolio['paymentCompleted'])
                    setbillGeneratedStatus(selectedFolio['BillGenerated'])
                  }
                }
              } else {
                setorderdata(null);
              }
            })
            .catch((err) => {
              console.log(err.message);
            });

        }
        if(post['statuscode'] == 403 || post['statusCode'] == 403) {
          setconfirmamtvoid(false)
          const swalInstance = MySwal.fire({
            text: post['message'],
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
                confirmButton: 'btn btn-danger'
            }
        });
        swalInstance.then((result) => {
            if (result.isConfirmed) {
              // navigate('')
            }
        });
        }


      })
      .catch((err) => {
        console.log(err.message);
      });  }

      const handleRemoveDiscountConfirm = () => {
        setconfirmremovedisc(true)
      }

      const handleRemoveDiscount = () => {
        const removeDiscount = JSON.stringify({
          "hotelID": 1,
          "storeID": localStorage.getItem('storeID'),
          "orderID": localStorage.getItem('orderID'),
          "tableNo": localStorage.getItem('TableSelected'),
          "FolioNo": FolioNumber,
        });
        console.log(removeDiscount)
        let res = fetchx(API_URL + '/revokePOSDiscounts', {
          method: 'POST',
          body: removeDiscount,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then((res) => res.json())
          .then(result => {
            console.log(result)
            if (result['statuscode'] == 200) {
              // allPaymentData(FolioNumber);
              const billfetch = JSON.stringify({
                hotelID: 1,
                storeID: localStorage.getItem('storeID'),
                orderID: localStorage.getItem('orderID'),
                tableNo: localStorage.getItem('TableSelected'),
              });
              fetch(API_URL + '/getPOSOrderDetails', {
                method: 'POST',
                body: billfetch,
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                },
              })
                .then((res) => res.json())
                .then((post) => {
                  if (post['statuscode'] === 200) {
                    setconfirmremovedisc(false)
                    const billdata = post['data'];
                    setorderdata(billdata);
                    setallTableData(billdata.AllFolioData[0].items)
                    if (billdata.AllFolioData && billdata.AllFolioData.length > 0) {
                      let folioDataTemp = {};
                      billdata.AllFolioData.forEach((folio) => {
                        folioDataTemp[folio.FolioNo] = folio;
                      });
                      const selectedFolio = folioDataTemp[FolioNumber]; 
                      if (selectedFolio) {
                        setfinalBalanceAmt(selectedFolio['Balance']);
                        setBalanceValue(selectedFolio['Balance']);
                        setsubTotal(selectedFolio['subtotal']);
                        setinvBalance1(selectedFolio['total']);
                        setserviceCharge(selectedFolio['serviceCharge']);
                        setIsservicecharge(selectedFolio['isServiceCharge']);
                        setTableData(selectedFolio['items']);
                        setFolioNumber(FolioNumber); 
                        allPaymentData(FolioNumber); 
                        settotalDiscount(selectedFolio['TotalDiscount']);
                        setpreviewFolioData(selectedFolio)
                      }
                    }
                    allPaymentData(FolioNumber);
  
                  } else {
                    setorderdata(null);
                  }
                })
                .catch((err) => {
                  console.log(err.message);
                });
            }
            if (result['statuscode'] == 403 || result['statusCode'] == 403) {
              const swalInstance = MySwal.fire({
                text: result['message'],
                buttonsStyling: false,
                confirmButtonText: 'Close',
                customClass: {
                  confirmButton: 'btn btn-danger',
                },
                allowOutsideClick: false,
            allowEscapeKey: false
              });
              swalInstance.then((result) => {
                if (result.isConfirmed) {
                  setconfirmremovedisc(false)

                }
              });
            }
  
          })
          .catch(error => {
            // Handle any errors that occur during the API call
            // console.error('API error:', error);
          });
        // }
  
   
        // getOrderdata(setData);
        allPaymentData(FolioNumber);
      }

      const handleRemoveDiscountApplied = () => {
        setroomDiscConfirm(false)
        handleRemoveDiscount();
        // console.log("click on No-----")
      }

      const handleAddRoomDiscount = () => {
        // console.log(selectedGuestinRoomDisc);
        // console.log("for adding room disc");
        if (totalDiscount !== 0) {
            const billfetch = JSON.stringify({
              "hotelID": 1,
              "storeID": localStorage.getItem('storeID'),
              "orderID": localStorage.getItem('orderID'),
              "tableNo": localStorage.getItem('TableSelected'),
              "FolioNo": FolioNumber,
                "roomNo": selectedGuestinRoomDisc.reservationID,
                "applyDiscount":1
            });
            // console.log("billfetch----------------",billfetch)
            fetchx(API_URL + '/applyRoomDiscountPOS', {
                method: 'POST',
                body: billfetch,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            .then((res) => res.json())
            .then((post) => {
                if (post.statuscode === 200) {
                    settotalDiscount(post.data.TotalDiscount);
                    const swalInstance = MySwal.fire({
                        title: `₹${post.data.TotalDiscount}`,
                        text: "Discount applied successfully!!",
                        icon: 'success',
                        buttonsStyling: false,
                        confirmButtonText: 'Close',
                        customClass: {
                            confirmButton: 'btn btn-danger',
                            popup: 'swal2-popup-custom',
                            title: 'swal2-title-custom',
                            icon: 'swal2-icon-custom'
                        },
                        allowOutsideClick: true, 
                        allowEscapeKey: true,    
                        willClose: () => {
                          setroomDiscConfirm(false)
                            const billfetch = JSON.stringify({
                                hotelID: 1,
                                storeID: localStorage.getItem('storeID'),
                                orderID: localStorage.getItem('orderID'),
                                tableNo: localStorage.getItem('TableSelected'),
                            });
                            fetch(API_URL + '/getPOSOrderDetails', {
                                method: 'POST',
                                body: billfetch,
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                },
                            })
                            .then((res) => res.json())
                            .then((post) => {
                                if (post['statuscode'] === 200) {
                                    const billdata = post['data'];
                                    setorderdata(billdata);
                                    setallTableData(billdata.AllFolioData[0].items);
                                    if (billdata.AllFolioData && billdata.AllFolioData.length > 0) {
                                        let folioDataTemp = {};
                                        billdata.AllFolioData.forEach((folio) => {
                                            folioDataTemp[folio.FolioNo] = folio;
                                        });
                                        const selectedFolio = folioDataTemp[FolioNumber];
                                        if (selectedFolio) {
                                            setfinalBalanceAmt(selectedFolio['Balance']);
                                            setBalanceValue(selectedFolio['Balance']);
                                            setsubTotal(selectedFolio['subtotal']);
                                            setinvBalance1(selectedFolio['total']);
                                            setserviceCharge(selectedFolio['serviceCharge']);
                                            setIsservicecharge(selectedFolio['isServiceCharge']);
                                            setTableData(selectedFolio['items']);
                                            setFolioNumber(FolioNumber);
                                            allPaymentData(FolioNumber);
                                            settotalDiscount(selectedFolio['TotalDiscount']);
                                            setpreviewFolioData(selectedFolio);
                                        }
                                    }
                                } else {
                                    setorderdata(null);
                                }
                            })
                            .catch((err) => {
                                console.log(err.message);
                            });
                        }
                    });
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
        }
    };

  return typeof (data) != 'undefined' ? (
    <>
     
      {balanceValue === 0.00 || balanceValue < invBalance1 ? (
        <Button.Ripple
          color="primary"
          outline
          size="sm"
          style={{ marginBottom: '10px' }}
          onClick={() => {
            const swalInstance = MySwal.fire({
              text: "Payment Initiated,you can not go back!",
              buttonsStyling: false,
              confirmButtonText: 'Close',
              customClass: {
                confirmButton: 'btn btn-danger',
              },
            });

            swalInstance.then((result) => {
              if (result.isConfirmed) {
                // navigate('')
              }
            });
          }}
        >
          Back
        </Button.Ripple>
      ) : (
        <Button.Ripple
          color="primary"
          outline
          size="sm"
          style={{ marginBottom: '10px' }}

          // onClick={() => navigate('/apps/posconfiguration/addorder')}
          onClick={confirmhandleBackButtonClick}

        >
          Back
        </Button.Ripple>
      )}

      <Card className='invoice-preview-card' style={{ backgroundColor: '', width: '100%', height: '85px' }}>
        <CardBody className='invoice-padding pt-2'>
          <Row>
            <Col md='7' sm='12' className='mb-1'>
              <div className="mb-1">
                <CardText className='mb-25' style={{ color: 'black', fontSize: '15px' }}>
                  <strong>Payment Table Number #{localStorage.getItem('TableSelected')}</strong>
                </CardText>

              </div>
            </Col>
            {/* <Col md='5' sm='12' className='mb-1'>
              <div className="mb-1">
                <CardText className='mb-25' style={{ color: 'black', fontSize: '12px' }}>
                  <Row>
                    <Col md='3' sm='12' className='text-center'
                    onClick={() => setservicechargeInfoModal(true)} 
                    >
                      <div>
                        <LuLayoutList style={{ color: 'black', fontSize: '25px' }} /><br />
                        <strong>Service Charge</strong>
                      </div>
                    </Col>
                    <Col md='3' sm='12' className='text-center'>
                      <div>
                        <MdPreview style={{ color: 'black', fontSize: '25px' }} onClick={() => handlePreview(data)} /><br />
                        <strong><center>Preview Bill</center></strong>
                      </div>
                    </Col>
                    <Col md='3' sm='12' className='text-center' onClick={() => {
                      if (balanceValue == 0.00 || balanceValue < invBalance1) {
                        const swalInstance = MySwal.fire({
                          text: "Payment Initiated,you can not add discount!",
                          buttonsStyling: false,
                          confirmButtonText: 'Close',
                          customClass: {
                            confirmButton: 'btn btn-danger',
                          },
                        });
                        swalInstance.then((result) => {
                          if (result.isConfirmed) {
                            // navigate('/apps/posconfiguration/DisplayBill');
                          }
                        });

                      }
                      else {
                        setdiscountModal(true);
                      }
                    }}>
                      <div>
                        <GrStar style={{ color: 'black', fontSize: '25px' }} /><br />
                        <strong>Discounts</strong>
                      </div>
                    </Col>
                    <Col md='3' sm='12' className='text-center' onClick={handleSplit}>
                      <div>
                        <FaChartPie style={{ color: 'black', fontSize: '25px' }} /><br />
                        <strong>Split</strong>
                      </div>
                    </Col>
                  </Row>
                </CardText>
              </div>
            </Col> */}
      <Col md='5' sm='12' className='mb-1 d-flex justify-content-end'>
      <Button
          color='primary'
          className="bg-transparent"
          style={{ padding: '10px 40px', fontSize: '18px' }} 
          onClick={() => navigate('/apps/posconfiguration/Tableselection')}
        >
          Close
        </Button>
             </Col>
          </Row>
        </CardBody>
      </Card>
      <Row style={{marginTop:'-20px'}}>
      <Col sm='2'>
        <ScrollableButtonList />
      </Col>

        <Col sm='6'>
          <Form onSubmit={handleSubmit(handlePayButtonClick)}>
            <Row>
             
              {/* <Col md='4' sm='12' className='mb-1'>
                <InputGroup className="input-group-merge">
                  <Controller
                    id="balance"
                    name="balance"
                    // defaultValue={data['Balance']}
                    defaultValue={finalBalanceAmt}
                    control={control}
                    render={({ field }) => (
                      <Cleave
                        {...field}
                        pattern="[0-9]*" title="Only Numbers Allowed"
                        required
                        className={classnames("form-control", {
                          // "is-invalid": data !== null && data.balance === null,
                        })}
                        value={finalBalanceAmt} // Use the balanceValue from state here
                        onChange={handleChange} // Pass the handleChange function here
                        readOnly={selectedPaymentType && (selectedPaymentType.value === "Post To Room" || selectedPaymentType.value === "BTC")}

                      />
                    )}
                  />
                </InputGroup>
              </Col> */}
              <Card className='invoice-preview-card' style={{ backgroundColor: '', width: '100%', height: '300px' }}>
              <CardHeader style={{marginLeft:'-4.0%',marginRight:'-4.2%'}}><strong>Payment Information</strong></CardHeader>
              <CardBody style={{marginLeft:'-4.2%',marginRight:'-4.2%'}}>
                <Row>
              <Col md='6' sm='12' className='mb-1'>
                <InputGroup className="input-group-merge">
                  <Controller
                    id="balance"
                    name="balance"
                    defaultValue={finalBalanceAmt}
                    control={control}
                    render={({ field }) => (
                      <Cleave
                        {...field}
                         type='text'
                         options={{
                          numeral: true,               // Enables numeral formatting
                          numeralDecimalScale: 2,      // Allows up to 2 decimal places
                          numeralThousandsGroupStyle: 'none', // No thousand separators
                          numeralPositiveOnly: true,   // Only positive numbers
                        }}
                        className="form-control"
                        value={finalBalanceAmt}
                        onChange={(e) => {
                          field.onChange(e);
                          handleChange(e);
                          setBalanceError(''); // Clear error on change
                        }}
                        readOnly={selectedPaymentType && (selectedPaymentType.value === "Post To Room" || selectedPaymentType.value === "BTC")}
                      />
                    )}
                  />
                </InputGroup>
                {balanceError && <small className="text-danger">{balanceError}</small>}
              </Col>
              <Col md='6' sm='12' className='mb-1'>
                <div className="mb-1">

                  <InputGroup className="input-group-merge">

                    <Controller
                      id="tips"
                      name="tips"
                      control={control}
                      placeholder="tips"
                      render={({ field }) => (
                        <Cleave
                        type='number'
                          pattern="[0-9]*" title="Only Numbers Allowed"
                          placeholder="Enter tips"
                          required
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value);
                            handleTipsChange(value);
                          }}
                          className={classnames("form-control", {
                            "is-invalid": data !== null && data.pax === null,
                          })}
                        />
                      )}
                    />
                  </InputGroup>
                </div>
              </Col>
              </Row>

              <Col md='12' sm='12' className='mb-1'>
                <div className='mb-1'>

                  <Controller
                    id='PaymentType'
                    name='PaymentType'
                    control={control}
                    render={({ field }) => (
                      <Select
                        isClearable
                        name='PaymentType'
                        className='react-select'
                        options={PaymentOptions}
                        classNamePrefix='PaymentType'
                        theme={selectThemeColors}
                        value={selectedPaymentType}
                       
                        onChange={(selectedOption) => {
                          setSelectedPaymentType(selectedOption);
                          handlePaymentTypeChange(selectedOption);
                        }}
                     
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          maxHeight: '150px',
                          overflowY: 'auto',
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: '150px',
                          overflowY: 'auto',
                        }),
                        control: (provided) => ({
                          ...provided,
                          height: '40px',
                        }),
                      }}
                      menuPlacement="auto" 
                      isSearchable
                      />
                      
                    )}
                  />
                </div>
              </Col>
              <Row>
              {selectedPaymentType?.value === 'Post To Room' && inhouseGuestDetails ? (
                <>
                  <Modal
                    isOpen={inhouseGuestModal}
                   
                    className='modal-dialog-centered modal-lg'
                    onCancel={() => setinhouseGuestModal(false)}
                    centered
                    footer={null}
                  >

                    <ModalBody style={{ height: '600px' }}>
                      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', paddingLeft: '40px' }}>
                        <Input
                          type="text"
                          placeholder="Search guest or room..."
                          value={searchRoomORGuest}
                          onChange={(e) => setsearchRoomORGuest(e.target.value)}
                          style={{
                            width: '50%',
                            marginRight: '5px',
                          }}
                        />
                      </div>

                      <div
                        style={{
                          paddingTop: '5px',
                          maxHeight: '450px',
                          overflowY: 'auto',
                          display: 'flex',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                        }}
                      >

                        {inhouseGuestDetails
                          .filter((guest) =>
                            guest.name.toLowerCase().includes(searchRoomORGuest.toLowerCase()) ||
                            guest.roomNumber.toString().includes(searchRoomORGuest)
                          )
                          .map((guest, index) => (
                            <div key={index} style={{ width: '23%', padding: '10px', height: '140px', boxSizing: 'border-box' }}>
                              <Button
                                color="primary"
                                onClick={() => {
                                  handleGuestSelect(guest);
                                  setinhouseGuestModal(false);
                                }}
                                style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', textAlign: 'left' }}
                              >
                                <div style={{ textAlign: 'center' }}>
                                  <p>{guest.name}</p>
                                  <p>{guest.roomNumber}</p>
                                </div>
                              </Button>
                            </div>
                          ))}
                      </div>
                    </ModalBody>
                  </Modal>
                  <Col md='6' sm='12' className='mb-1'>

                    <InputGroup className="input-group-merge">
                      <Controller
                        id="inhouseGuest"
                        name="inhouseGuest"
                        control={control}
                        placeholder="inhouseGuest"
                        render={({ field }) => (
                          <Cleave
                            {...field}
                            value={selectedRoomNumber1}

                            disabled
                            required
                            className={classnames("form-control", {
                            })}
                          />
                        )}
                      />
                    </InputGroup>

                  </Col>
                </>
              ) : selectedPaymentType?.value === 'Post To Room' ? (
                <>
                  {inhouseGuestModal && (
                    <Modal
                      isOpen={inhouseGuestModal}
                      toggle={() => setinhouseGuestModal(!inhouseGuestModal)}
                      className='modal-dialog-centered'
                      onCancel={() => {
                        setinhouseGuestModal(false);
                        alert('An error occurred while fetching guest details.');
                      }}
                      centered
                      footer={null}
                    >
                      <div className='text-center mb-2' style={{ backgroundColor: 'red', height: '50px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ModalHeader style={{ color: 'white', fontWeight: 'bold', width: '100%', height: '100%', background: 'red', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          Guest Details
                        </ModalHeader>
                      </div>
                      <ModalBody style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }} >
                        <strong><p>In-house rooms are not available</p></strong>
                      </ModalBody>
                    </Modal>
                  )}

                </>
              ) : selectedPaymentType?.value === 'BTC' && btcCompanyDetails ? (

                <>
                  <Modal
                    isOpen={btcCompanyModal}
                    className='modal-dialog-centered modal-lg'
                    onCancel={() => setbtcCompanyModal(false)}
                    centered
                    footer={null}
                  >
                   
                    <ModalBody style={{ height: '600px' }}>
                      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', paddingLeft: '40px' }}>
                        <Input
                          type="text"
                          placeholder="Search Company..."
                          value={searchCompany}
                          onChange={(e) => setsearchCompany(e.target.value)}
                          style={{
                            width: '50%',
                            marginRight: '5px',
                          }}
                        />
                      </div>
                      <div style={{
                        paddingTop: '5px',
                        maxHeight: '450px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                      }}>

                       
                        {btcCompanyDetails
                          .filter((company) =>
                            company.accountName.toLowerCase().includes(searchCompany.toLowerCase())
                          )
                          .map((company, index) => (
                            <div key={index} style={{ width: '23%', padding: '10px', height: '140px', boxSizing: 'border-box' }}>
                              <Button
                                color="primary"
                                onClick={() => {
                                  handleBTCCompanySelect(company);
                                  setbtcCompanyModal(false);
                                }}
                                style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', textAlign: 'left' }}
                              >
                                <div style={{ textAlign: 'center' }}>
                                  <p>{company.accountName}</p>
                                </div>
                              </Button>
                            </div>
                          ))}
                      </div>
                    </ModalBody>
                  </Modal>
                  <Col md='6' sm='12' className='mb-1'>

                    <InputGroup className="input-group-merge">
                      <Controller
                        id="btcCompany"
                        name="btcCompany"
                        control={control}
                        placeholder="btcCompany"
                        render={({ field }) => (
                          <Cleave
                            {...field}
                            // value={selectedRoomNumber}
                            value={selectedCompany}
                            // pattern="[0-9]*" title="Only Numbers Allowed"

                            disabled
                            required
                            className={classnames("form-control", {
                              // "is-invalid": data !== null && data.balance === null,
                            })}
                          // value={data['Balance']}
                          />
                        )}
                      />
                    </InputGroup>

                  </Col>
                </>
              ) : selectedPaymentType?.value === 'BTC' ? (
                // Show an alert and close the modal
                <>
                  {btcCompanyModal && (
                    <Modal
                      isOpen={btcCompanyModal}
                      toggle={() => setbtcCompanyModal(!btcCompanyModal)}
                      className='modal-dialog-centered'
                      onCancel={() => {
                        setbtcCompanyModal(false);
                        alert('An error occurred while fetching guest details.');
                      }}
                      centered
                      footer={null}
                    >
                      <div className='text-center mb-2' style={{ backgroundColor: 'red', height: '50px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ModalHeader style={{ color: 'white', fontWeight: 'bold', width: '100%', height: '100%', background: 'red', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          Company Details
                        </ModalHeader>
                      </div>
                      <ModalBody style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }} >
                        <strong><p>BTC Company Details are not available</p></strong>
                      </ModalBody>
                    </Modal>
                  )}
                  <Col md='6' sm='12' className='mb-1'>
                    {/* ... InputGroup and Controller here ... */}
                  </Col>
                </>
              ) : (
                <Col sm='6' className='mb-1'>
                  <div className='mb-1'>
                    <InputGroup className="input-group-merge">
                      <Controller
                        id="transactionID"
                        name="transactionID"
                        control={control}
                        placeholder="Transaction ID"
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Transaction ID"
                          // className={classnames("form-control", {
                          //   "is-invalid": data !== null && data['Balance'] === null,
                          // })}
                          />
                        )}
                      />
                    </InputGroup>
                  </div>
                </Col>
              )}
              <Col sm='6'>
                {/* <Button color='success' size='lg' block onClick={handlePayButtonClick}>
                  PAY
                </Button> */}
                {/* {balanceValue == 0.00 ? ( */}
                  {paymentStatus == true ? (
                  <Button color='success' size='lg' disabled style={{ width: '100%' }}>
                    PAID
                  </Button>
                ) : (
                  <Button color='danger' size='lg' onClick={handlePayButtonClick1} style={{ width: '100%' }}>
                    Make Payment
                  </Button>
                )}
              </Col>
              </Row>
              <Col sm='12' style={{ paddingBottom: '20px' }}>
                {recievedPayment.length !== 0 && (
                  <Button color="danger" onClick={handelvoidpayment}>Void Full Payment</Button>
                )}
              </Col>
              </CardBody>
              </Card>
              <Card style={{ width: '100%', height: '310px' }}>
      <CardBody style={{ marginLeft: '-1.5%', marginRight: '-1.5%', padding: 0 }}>
        <Col sm='12'>
          <div style={{ position: 'relative', height: '310px', overflow: 'hidden' }}>
            <Table className="m-0" responsive>
              <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
                <tr>
                  <th style={{ padding: '10px 10px 10px 0', fontSize: '16px', textAlign: 'left', minWidth: '100px' }}>Mode</th>
                  <th style={{ padding: '10px 10px 10px 0', fontSize: '16px', textAlign: 'left', minWidth: '100px' }}>Amount</th>
                  <th style={{ padding: '10px 10px 10px 0', fontSize: '16px', textAlign: 'left', minWidth: '100px' }}>Room/BTC</th>
                  <th style={{ padding: '10px 10px 10px 0', fontSize: '16px', textAlign: 'left', minWidth: '100px' }}>Tips</th>
                  <th style={{ padding: '10px 10px 10px 0', fontSize: '16px', textAlign: 'left', minWidth: '150px' }}>Transaction ID</th>
                  <th style={{ padding: '10px 10px 10px 0', fontSize: '16px', textAlign: 'left', minWidth: '90px' }}>Action</th>

                </tr>
              </thead>
            </Table>
            <div style={{ overflowY: 'auto', height: 'calc(310px - 48px)' }}> {/* 48px is approximate header height */}
              <Table className="m-0" responsive>
                <tbody>
                  {/* {recievedPayment.map((row, index) => ( */}
                  {Array.isArray(recievedPayment) && recievedPayment.map((row, index) => (
                    <tr key={index}>
                      <td style={{ padding: '10px 10px 10px 0', fontSize: '16px', minWidth: '100px' }}>{row.paymentType}</td>
                      <td style={{ padding: '10px 10px 10px 0', fontSize: '16px', minWidth: '100px' }}>{row.RecievedAmt}</td>
                      <td style={{ padding: '10px 10px 10px 0', fontSize: '16px', minWidth: '100px' }}>{row.roomNo}</td>
                      <td style={{ padding: '10px 10px 10px 0', fontSize: '16px', minWidth: '100px' }}>{row.tips}</td>
                      <td style={{ padding: '10px 10px 10px 0', fontSize: '16px', minWidth: '150px' }}>{row.TranxDetails}</td>
                      <td style={{ padding: '10px 10px 10px 0', fontSize: '16px', minWidth: '90px' }}>
                      <Button
                        onClick={() => (handleAmtRowvoid(row))} // Add your void logic here
                      >
                        Void
                      </Button>
                    </td>
                </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </CardBody>
    </Card>

            </Row>
          </Form>

        </Col>
        <Col lg='4' >
        <Card className='invoice-preview-card' style={{ backgroundColor: '', width: '100%', height: '640px' }}>

          <div style={{ height: '40vh', maxWidth: '100vw',overflowY: 'auto' }}>
            <Table>
            <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
            <tr>
                  <th colSpan={4} style={{ textAlign: 'left', fontSize: '16px', textTransform: 'none' }}><strong><span style={{marginLeft:'-20px'}}>Folio#{FolioNumber}</span></strong></th>
                  <th colSpan={2} style={{ textAlign: 'right', fontSize: '16px',textTransform: 'none'  }}  onClick={() => handlePreview(previewFolioData)} ><strong>{<VscPreview size={24} style={{marginLeft:'60px'}}/>}</strong></th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ height: '30px' }}></tr> 
                { tableData.map((row, index) => (
                  <React.Fragment key={index}>
                    <tr key={index}>
                    <td colSpan={4} style={{ textAlign: 'left', paddingLeft: '20px' }} id={`itemName${index}`}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <strong style={{ textAlign: 'left', wordBreak: 'break-word', maxWidth: '100%' }}>
                          {row.itemName}
                        </strong>
                        <span style={{ fontSize: '12px', marginTop: '4px' }}>Qty: {row.qty}</span>
                      </div>
                    </td>
                      <td colSpan={2} style={{ textAlign: 'right', color: 'red',
        fontWeight: 'bold',}} id={"Price" + index}><span style={{marginLeft:'50px'}}></span>₹{(row.Price).toFixed(2)}<br /></td>
                    </tr>
                    {row.showBreakCourse && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center' }}>------------------------------------------------------------------------</td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </div>
          <br></br>
          <CardBody style={{margin:'-4.5%'}}>
            <br></br>
            <Table>
          <tbody>
          <React.Fragment>
          <tr>
              <td colSpan={4} style={{ textAlign: 'left' }} >
              <strong><span style={{ marginLeft: '-20px' }}>Sub Total</span></strong>
              </td>
              <td colSpan={2} style={{ textAlign: 'right' }} >
              <strong><span>₹{subTotal}</span></strong><br />
              </td>
            </tr>
            <tr>
              <td colSpan={4} style={{ textAlign: 'left' }} >
              <strong><span style={{ marginLeft: '-20px' }}>Service Charge</span></strong>
              <strong><span className="text-danger" style={{ marginLeft: '20px' }} onClick={() => setservicechargeInfoModal(true)} 
              >{isservicecharge ? '(Remove)' : '(Add)'}</span></strong>
              </td>
              <td colSpan={2} style={{ textAlign: 'right' }} >
              <strong><span>₹{parseFloat(serviceCharge).toFixed(2)}</span></strong><br />
              </td>
            </tr>
            <tr>
            <td colSpan={6} style={{ padding: '10px 0' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '15px 10px',
                backgroundColor: '#E5E5E5',
                borderRadius: '5px',
                margin:'1%'
              }}>
           <span style={{ color: '#006102', fontSize: '14px' }}>
            {totalDiscount > 0 ? `Discount: -₹${totalDiscount}` : 'No Discount added'}
            </span>
              
            {/* <Button 
                color="primary"
                  variant="outline"
                  style={{
                    backgroundColor: '#ffeb3b',
                    color: '#F7F6D9',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginTop:'-15px',
                    marginBottom: '-15px',
                    marginRight: '-10px',
                    height: '60px', 
                    width: '100px',

                  }}
                  onClick={() => setdiscountModal(true)}

                >
                  Add
                </Button> */}
{totalDiscount > 0 ? (
  <Button
    color="primary"
    variant="outline"
    style={{
      backgroundColor: '#ffeb3b',
      color: '#F7F6D9',
      border: 'none',
      borderRadius: '5px',
      fontSize: '14px',
      fontWeight: 'bold',
      marginTop: '-15px',
      marginBottom: '-15px',
      marginRight: '-10px',
      height: '60px',
      width: '110px',
    }}
    onClick={() => {
      handleRemoveDiscountConfirm();
    }}
  >
    Remove
  </Button>
) : (
  <Button
    color="primary"
    variant="outline"
    style={{
      backgroundColor: '#ffeb3b',
      color: '#F7F6D9',
      border: 'none',
      borderRadius: '5px',
      fontSize: '14px',
      fontWeight: 'bold',
      marginTop: '-15px',
      marginBottom: '-15px',
      marginRight: '-10px',
      height: '60px',
      width: '100px',
    }}
    // onClick={() => setdiscountModal(true)}
    onClick={() => {
      if (paymentStatus) {
        MySwal.fire({
          text: "Payment Initiated, Cannot perform this action",
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
          allowOutsideClick: false,
          allowEscapeKey: false
        });
      } else if (selectedPaymentType) {
        setdiscountModal(true);
      } else {
        MySwal.fire({
          text: "Please select a payment type!!",
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
          allowOutsideClick: false,
          allowEscapeKey: false
        });
      }
    }}
    
  >
    Add
  </Button>
)}

              </div>
            </td>
          </tr>
      <tr>
      <td colSpan={4} style={{ textAlign: 'left' }} >
      <strong><span style={{ marginLeft: '-20px' }}>Total Balance</span></strong>
      </td>
      <td colSpan={2} style={{ textAlign: 'right' }} >
      <strong><span>₹{invBalance1}</span></strong><br />
      </td>
    </tr>
      </React.Fragment>
      </tbody>
      </Table>
      </CardBody>
      <div style={undoButtonContainerStyle}>
      <Button
      // color='danger'
      color={billGeneratedStatus == false ? 'primary' : 'success'}
      style={undoButtonStyle}
      // onClick={handleInvoiceClick}
      onClick={() => {
        if (billGeneratedStatus == false) {
          handleInvoiceClick();
        }
      }}
      >
      {/* <spam style={{fontSize:'15px'}}><strong>GENERATE BILL</strong></spam> */}
      <spam style={{ fontSize: '15px' }}>
        <strong>{billGeneratedStatus == false > 0 ? 'GENERATE BILL' : 'COMPLETED'}</strong>
      </spam>
      </Button>
      </div>
      </Card>
      </Col>
      </Row>
      <Modal
        isOpen={paymentInfoModal}
        onCancel={() => setpaymentInfoModal(false)}
        centered
        footer={null}
      >
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h1 className='demo-space-y'><b>Payment Information</b></h1>

            <p>
              You are paying the Amount: <FaRupeeSign />
              <strong>
                {parseFloat(finalBalanceAmt).toFixed(2)} + Tips: <FaRupeeSign />
                {parseFloat(tipsAmount).toFixed(2)} ={' '}
                <FaRupeeSign />{(parseFloat(finalBalanceAmt) + parseFloat(tipsAmount)).toFixed(2)}
              </strong>
            </p>
          

          </div>
         
          <div className="button-container text-center">


          {/* <Button className="me-1"  color="danger" onClick={() => setpaymentInfoModal(false)}>
              No
            </Button> */}
            {/* <Button  className='bg-transparent' color="primary" type='submit' onClick={handlePayButtonClick} >
              Yes
            </Button> */}
             <Button className="me-1"  color="danger" onClick={handleCancelPayButtonClick}>
              No
            </Button>
               <Button  className='bg-transparent' color="primary" type='submit' disabled={isProcessing} onClick={handlePayButtonClick} >
              {isProcessing ? 'Processing...' : 'Yes'}
            </Button>


          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={openInvoice}
        // toggle={() => setopenInvoice(!openInvoice)}
        className='modal-lg'

        onCancel={() => setopenInvoice(false)}
        centered
        footer={null}
      >


        <ModalHeader className='modal-lg'>Generate Invoice
        </ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20' >
          <Card>
            <CardBody>
              <Form onSubmit={handleSubmit(handleInvForm)}>
                <Row>
                  <Col md='4' sm='12' className='mb-1' >
                    <Label className="form-label" for="tableno">
                      Table Number<span className='text-danger'>*</span>
                    </Label>
                    <InputGroup className="input-group-merge">
                      <Controller
                        id="tableno"
                        name="tableno"
                        control={control}
                        render={({ field }) => (
                          <Cleave
                            {...field}
                            pattern="[0-9]*"
                            title="Only Numbers Allowed"
                            required
                            className={classnames("form-control", {
                            })}
                            value={localStorage.getItem('TableSelected')}
                            readOnly
                            style={{ fontWeight: 'bold' }}
                          />
                        )}
                      />
                    </InputGroup>
                  </Col>

                  <Col md='4' sm='12' className='mb-1'>
                    <Label className="form-label" for="orderNumber">
                      Order Number<span className='text-danger'>*</span>
                    </Label>
                    <InputGroup className="input-group-merge">
                      <Cleave
                        options={{ numeral: true }}
                        className="form-control"
                        value={localStorage.getItem('orderID')}
                        readOnly
                        style={{ fontWeight: 'bold' }}
                      />
                    </InputGroup>
                  </Col>

                  <Col md='4' sm='12' className='mb-1' >
                    <Label className="form-label" for="balance">
                      Amount Paid<span className='text-danger'>*</span>
                    </Label>
                    <InputGroup className="input-group-merge">
                      <Controller
                        id="balance"
                        name="balance"
                        control={control}
                        placeholder="hotel ID"
                        render={({ field }) => (
                          <Cleave
                            {...field}
                            pattern="[0-9]*" title="Only Numbers Allowed"
                            required
                            className={classnames("form-control", {
                            })}
                            value={invBalance1}
                            readOnly
                            style={{ fontWeight: 'bold' }}
                          />
                        )}
                      />
                    </InputGroup>

                  </Col>
                </Row>
                <Row>
                 
                  <Col md="6" sm="12">
                    <div className="mb-1">
                      <Label className="form-label" for="emailBasic">
                        Guest Name
                      </Label>
                      <Controller
                        defaultValue={sessionStorage.getItem('selectedInHGuest') !== null ? sessionStorage.getItem('selectedInHGuest') : ' '}
                        control={control}
                        id="emailBasic"
                        name="emailBasic"
                        render={({ field }) => (
                          <Input
                            placeholder="guest name"
                            invalid={errors.emailBasic && true}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </Col>


                  <Col md='6' sm='12' className='mb-1'>
                    <div className="mb-1">
                      <Label className="form-label" for="pax">
                        pax
                      </Label>
                      <Controller
                        defaultValue={selectedpaxTable}
                        control={control}
                        id="pax"
                        name="pax"
                        render={({ field }) => (
                          <Input
                            placeholder="Enter pax"
                            invalid={errors.pax && true}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm='12' md='6' className='mb-1'>
                    <div className="mb-1">
                      <Label className="form-label" htmlFor="gstNo">
                        GST Number
                      </Label>
                      <InputGroup className="input-group-merge">
                        <Controller
                          id="gstNo"
                          name="gstNo"
                          control={control}
                          render={({ field }) => (
                            <Input
                              placeholder="GST NO.."
                              {...field}
                              pattern="[A-Z 0-9]*"
                              className={classnames("form-control", {
                              })}
                            />
                          )}
                        />
                      </InputGroup>
                    </div>
                  </Col>

                  <Col sm='12' md='6' className='mb-1'>
                    <div className="mb-1">
                      <Label className="form-label" for="mobileNo">
                        Mobile Number
                      </Label>
                      <InputGroup className="input-group-merge">

                        <Controller
                          id="mobileNo"
                          name="mobileNo"
                          control={control}
                          render={({ field }) => (
                            <Input
                              placeholder="986......"
                              {...field}
                              className={classnames("form-control", {
                              })}
                            />
                          )}
                        />
                      </InputGroup>
                    </div>
                  </Col>
                </Row>
               
                <div align='end' className='buttons'>
                  <Button outline className='me-1' color='secondary' onClick={handleCancelInvForm}>
                    CANCEL
                  </Button>
                  {/* <Button color='primary' className='me-1' onClick={handleInvForm}>
                    SUBMIT
                  </Button> */}
                  <Button
                    color='primary'
                    className='me-1'
                    onClick={handleInvForm}
                    disabled={isButtonClicked}
                  >
                    {isButtonClicked ? 'Processing...' : 'SUBMIT'}
                  </Button>
                </div>
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
              </Form>
            </CardBody>
          </Card>
        </ModalBody>

      </Modal>
      {/* Modal for Discounts */}
      <Modal isOpen={discountModal} 
      // toggle={toggleModal} 
      style={{ maxWidth: '650px' }}>
        <div className='text-center mb-2' style={{ backgroundColor: 'red', height: '50px', position: 'relative' }}>
          <ModalHeader>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}> Discount Order</span>
          </ModalHeader>
        </div>
        {/* <CardText className='mb-25' style={{ color: 'black', fontSize: '15px' }}>
          <Container style={{ marginBottom: '20px' }}>
            <Row className="justify-content-between">
              <Col md='2' sm='12' className='text-center'>
                <Button className="align-items-center" onClick={handleAMTClick}
                  id="Amount"
                  name="Amount">
                  <GrStar style={{ color: 'black', fontSize: '25px' }} />
                  Amount
                </Button>
              </Col>
              <Col md='3' sm='12' className='text-center'>
                <Button className="align-items-center" onClick={handlePercentageClick}
                  id="Percentage"
                  name="Percentage">
                  <GrStar style={{ color: 'black', fontSize: '25px' }} />
                  Percentage
                </Button>
              </Col>
              <Col md='3' sm='12' className='text-center'>
                <Button className="align-items-center" onClick={handleClassification}>
                  <GrStar style={{ color: 'black', fontSize: '25px' }} />
                  Classification
                </Button>
              </Col>
              <Col md='2' sm='12' className='text-center'>
                <Button className="align-items-center" onClick={handlecouponClick}>

                  <GrStar style={{ color: 'black', fontSize: '25px' }} />
                  Coupon
                </Button>
              </Col>
              <Col md='2' sm='12' className='text-center'>

                <Button className="align-items-center">
                  <GrStar style={{ color: 'black', fontSize: '25px' }} />
                  <br />
                  Item
                </Button>
              </Col>
            </Row>
          </Container>
        </CardText> */}
        <CardText className='mb-25' style={{ color: 'black', fontSize: '15px' }}>
  <Container style={{ marginBottom: '20px' }}>
    <Row className="justify-content-between">
      <Col md='2' sm='12' className='text-center'>
        <Button.Ripple 
          color={activeButton === 'amount' ? 'primary' : 'secondary'}
          className="align-items-center" 
          onClick={() => {
            handleButtonClick('amount');
            handleAMTClick();
          }}
          id="Amount"
          name="Amount">
          <GrStar style={{ color: 'black', fontSize: '25px' }} />
          Amount
        </Button.Ripple>
      </Col>
      <Col md='3' sm='12' className='text-center'>
        <Button.Ripple 
          color={activeButton === 'percentage' ? 'primary' : 'secondary'}
          className="align-items-center" 
          onClick={() => {
            handleButtonClick('percentage');
            handlePercentageClick();
          }}
          id="Percentage"
          name="Percentage">
          <GrStar style={{ color: 'black', fontSize: '25px' }} />
          Percentage
        </Button.Ripple>
      </Col>
      <Col md='3' sm='12' className='text-center'>
        <Button.Ripple 
          color={activeButton === 'classification' ? 'primary' : 'secondary'}
          className="align-items-center" 
          onClick={() => {
            handleButtonClick('classification');
            handleClassification();
          }}>
          <GrStar style={{ color: 'black', fontSize: '25px' }} />
          Classification
        </Button.Ripple>
      </Col>
      <Col md='2' sm='12' className='text-center'>
        <Button.Ripple 
          color={activeButton === 'coupon' ? 'primary' : 'secondary'}
          className="align-items-center" 
          onClick={() => {
            handleButtonClick('coupon');
            handlecouponClick();
          }}>
          <GrStar style={{ color: 'black', fontSize: '25px' }} />
          Coupon
        </Button.Ripple>
      </Col>
      <Col md='2' sm='12' className='text-center'>
        <Button.Ripple 
          color={activeButton === 'item' ? 'primary' : 'secondary'}
          className="align-items-center" 
          onClick={() => handleButtonClick('item')}>
          <GrStar style={{ color: 'black', fontSize: '25px' }} />
          <br />
          Item
        </Button.Ripple>
      </Col>
    </Row>
  </Container>
</CardText>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmitDisc)}>
            <Row>
              <Col sm='12' md='12' className='mb-1'>
                <div className="mb-1">
                  <InputGroup className="input-group-merge">
                    {(isAmountActive || isItemDisActive) && (
                      <Controller
                        id="amt"
                        name="amount"
                        control={control}
                        render={({ field }) => (
                          <Input
                            required
                            placeholder="Enter the value"
                            {...field}
                            className="form-control"
                          />
                        )}
                      />
                    )}
                    {(isCouponActive) && (
                      <Controller
                        id="phoneNumber"
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                          <Input
                            required
                            placeholder="Enter the Phone Number"
                            {...field}
                            className="form-control"
                          />
                        )}
                      />
                    )}
                    {isPercentageActive && (
                      <Controller
                        id="percentage"
                        name="percentage"
                        control={control}
                        render={({ field }) => (
                          <Input
                            required
                            placeholder="Enter the Percentage"
                            {...field}
                            className="form-control"
                          />
                        )}
                      />
                    )}


                  </InputGroup>
                </div>
              </Col>
            </Row>
            {isClassificationActive && (
              <Row>
                <Col sm='2' md='2' className='mb-1' l>
                  <InputGroup className="input-group-merge">
                    <Controller
                      id="Food"
                      name="Food"
                      control={control}
                      render={({ field }) => (
                        <Cleave
                          pattern="[0-9]*" title="Only Numbers Allowed"
                          placeholder="Food%"
                          {...field}
                          className={classnames("form-control", {
                            // "is-invalid":
                            //     data !== null && (data.noOfPeople === null || !data.noOfPeople.length)
                          })}
                        />
                      )}
                    />
                  </InputGroup>
                </Col>
                <Col sm='2' md='3' className='mb-1' l>
                  <InputGroup className="input-group-merge">
                    <Controller
                      id="SoftDrinks"
                      name="SoftDrinks"
                      control={control}
                      render={({ field }) => (
                        <Cleave
                          pattern="[0-9]*" title="Only Numbers Allowed"
                          placeholder="SoftDrink%"
                          {...field}
                          className={classnames("form-control", {
                            // "is-invalid":
                            //     data !== null && (data.noOfPeople === null || !data.noOfPeople.length)
                          })}
                        />
                      )}
                    />
                  </InputGroup>
                </Col>
                <Col sm='2' md='2' className='mb-1' l>
                  <InputGroup className="input-group-merge">
                    <Controller
                      id="Liquor"
                      name="Liquor"
                      control={control}
                      render={({ field }) => (
                        <Cleave
                          pattern="[0-9]*" title="Only Numbers Allowed"
                          placeholder="Liquor%"
                          {...field}
                          className={classnames("form-control", {
                            // "is-invalid":
                            //     data !== null && (data.noOfPeople === null || !data.noOfPeople.length)
                          })}
                        />
                      )}
                    />
                  </InputGroup>
                </Col>
                <Col sm='2' md='2' className='mb-1' l>
                  <InputGroup className="input-group-merge">
                    <Controller
                      id="Smokes"
                      name="Smokes"
                      control={control}
                      render={({ field }) => (
                        <Cleave
                          pattern="[0-9]*" title="Only Numbers Allowed"
                          placeholder="Smokes%"
                          {...field}
                          className={classnames("form-control", {
                            // "is-invalid":
                            //     data !== null && (data.noOfPeople === null || !data.noOfPeople.length)
                          })}
                        />
                      )}
                    />
                  </InputGroup>
                </Col>
                <Col sm='2' md='2' className='mb-1' l>
                  <InputGroup className="input-group-merge">
                    <Controller
                      id="Others"
                      name="Others"
                      control={control}
                      render={({ field }) => (
                        <Cleave
                          pattern="[0-9]*" title="Only Numbers Allowed"
                          placeholder="Others%"
                          {...field}
                          className={classnames("form-control", {
                            // "is-invalid":
                            //     data !== null && (data.noOfPeople === null || !data.noOfPeople.length)
                          })}
                        />
                      )}
                    />
                  </InputGroup>
                </Col>
              </Row>
            )}
            {!isCouponActive && (
            <Row>
              <Col md='12' sm='12' className='mb-1'>
                <InputGroup className="input-group-merge">
                  <Controller
                    id="DiscReason"
                    name="DiscReason"
                    control={control}
                    render={({ field }) => (
                      <Cleave
                        pattern="[aA-zZ]*" title="Only Alphabets Allowed"
                        placeholder="Enter Reason For Discount"

                        {...field}
                        required
                        className={classnames("form-control", {
                          "is-invalid": data !== null && data.guestName === null,
                        })}
                      />
                    )}
                  />
                </InputGroup>
              </Col>
            </Row>
            )}
            {!isCouponActive && (

            <Row>
              <Col md='6' sm='12' className='text-center'>
                {/* <Button type="submit" className="me-1" color="warning" style={{ width: "100%" }}>
                Submit
              </Button> */}
                {/* <div align='center'> */}
                {/* <Button type='submit' style={{ align: 'right', 'margin-right': '10px', 'margin-bottom': '10px' }} className='me-1' onClick={() => { setOpencart(!openCart) }} color='primary' >CANCEL</Button> */}
                {/* <Button style={{ align: 'right', 'margin-right': '10px', 'margin-bottom': '10px', width: '98%' }} className='me-1' onClick={() => { setdiscountModal(!discountModal) }}  >CANCEL</Button> */}
                <Button outline className='me-1' style={{ align: 'right', 'margin-right': '10px', 'margin-bottom': '10px', width: '98%' }} color='secondary' onClick={handleCancelDiscountModal }>
                CANCEL
                </Button>

                {/* </div> */}
              </Col>
              <Col>
                {/* <Button type="submit" className="me-1" color="primary" style={{ align: 'left', 'margin-right': '10px', 'margin-bottom': '10px', width: '99%' }}>
                  Submit
                </Button> */}
                 <Button type="submit" className="me-1" color="primary" style={{ align: 'left', 'margin-right': '10px', 'margin-bottom': '10px', width: '99%' }} disabled={isProcessing}>
                 {isProcessing ? 'Processing...' : 'Submit'}
                </Button>
              </Col>
            </Row>
            )}
            {/* {isCouponActive && (
              <Col className="d-flex justify-content-center">
                <Button 
                  type="submit" 
                  className="me-1 btn-lg" 
                  color="primary" 
                  style={{ margin: '10px', width: '35%' }}
                  onClick={handlecouponNextClick}

                >
                  Next
                </Button>
              </Col>
            )} */}

            {isCouponActive && (
              <div align='end' className='buttons'>
                                    <Button className='me-1' color='dark' onClick={handleRedemptionhistory}>
                                    Redemption History
                                    </Button>
                                    {/* <Button outline className='me-1' color='secondary' onClick={() => { setdiscountModal(!discountModal) }}> */}
                                    <Button outline className='me-1' color='secondary' onClick={handleCouponDiscountModal }>

                                        CANCEL
                                    </Button>
                                    <Button color='primary' className='me-1'   
                                    onClick={handlecouponNextClick}>
                                        Next
                                    </Button>
                                </div>
            )}

          </form>
        </ModalBody>
      </Modal>

      <Modal isOpen={couponModal} 
       toggle={() => setcouponModal(!couponModal)}
       style={{ maxWidth: '650px' }}
      >
        <ModalHeader>Guest Details</ModalHeader>
        <ModalBody>
        <Form>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="guestName">Guest Name</Label>
                  <Input type="text" name="guestName" id="guestName" value={guestName} readOnly />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="phoneNumber">Phone Number</Label>
                  <Input type="tel" name="phoneNumber" id="phoneNumber" value={phoneNumber} readOnly />
                </FormGroup>
              </Col>
            </Row>
          </Form>
          {/* <Card>
          <CardTitle>Please Select Vouchers from below</CardTitle>
          </Card>
          {vouchers.map((voucher, index) => (
        <Card key={index} style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <CardBody >
            <CardText>{voucher.description}</CardText>
            <Button color="success">Apply</Button>
          </CardBody>
        </Card>
      ))} */}
      {/*<Card className="mt-0">
      <CardHeader>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}> Please Select Vouchers from below</span>
          </CardHeader>
          <CardBody style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {vouchers.map((voucher, index) => (
              <Card key={index}>
                <CardBody>
                  <CardText>{voucher.description}</CardText>

                  <Button color="success" onClick={()=>handleApplyClick(voucher)}>Apply</Button>
                </CardBody>
              </Card>
            ))}
          </CardBody>
        </Card>*/}
         <Card className="mt-0">
      <CardHeader>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}> Please Select Vouchers from below</span>
          </CardHeader>
          <CardBody style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {vouchers.map((voucher, index) => (
              <Card key={index}>
                <CardBody>
                  <CardText>{voucher.description}</CardText>

                  {/* <Button color="success" onClick={()=>handleApplyClick(voucher)}>Apply</Button> */}
                  {/* {voucher.isExhausted === 1 ? (
                    <Button color="success" disabled>Applied</Button>
                  ) : (
                    <Button color="success" onClick={() => handleApplyClick(voucher)}>Apply</Button>
                    
                  )} */}
                   <div className="row align-items-center">
                    <div className="col">
                      {voucher.isExhausted === 1 ? (
                        <Button color="success" disabled>Applied</Button>
                      ) : (
                        <Button color="success" onClick={() => handleApplyClick(voucher)}>Apply</Button>
                      )}
                    </div>
                    <div className="col text-right">
                      <span style={{ color: 'red' ,textAlign: 'right' }}>Expiry : {voucher.validTo} </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </CardBody>
        </Card>
        
        </ModalBody>
        <ModalFooter>
        <Button color="secondary" onClick={toggle}>Cancel</Button>

          {/* <Button color="primary">Submit</Button> */}
        </ModalFooter>
      </Modal>

      {/* <Modal isOpen={voucherDiscountModal} style={{ maxWidth: '650px' }}>
      <ModalHeader>
      <span style={{ fontSize: '24px', fontWeight: 'bold' }}> Discount Order</span>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>

          <Row className="mt-2">
            <Col sm="8">
              <InputGroup className="input-group-merge">
                <Input
                  id="discountValue"
                  name="discountValue"
                  placeholder={discountType === 'amt' ? 'Enter the amount' : 'Enter the percentage'} 
                  required
                  className="form-control"
                />
              </InputGroup>
            </Col>
            <Col>
              <Button
                color={discountType === 'amt' ? 'primary' : 'secondary'} 
                onClick={() => handleDiscountTypeChange('amt')}
                style={{ width: '40%' ,marginRight: '5px' }}
              >
                Amt
              </Button>
              <Button
                color={discountType === '%' ? 'primary' : 'secondary'} 
                onClick={() => handleDiscountTypeChange('%')}
                style={{ width: '40%' }}
              >
                 %
              </Button>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col sm="12">
              <InputGroup className="input-group-merge">
                <Input
                  id="discountReason"
                  name="discountReason"
                  placeholder="Enter Reason For Discount"
                  required
                  className="form-control"
                />
              </InputGroup>
            </Col>
          </Row>
         
          <ModalFooter>
        <Button color="secondary" onClick={handlecouponCancel}>Cancel</Button>

          <Button type="submit" color="primary">Submit</Button>
        </ModalFooter>
        </Form>
      </ModalBody>
    </Modal> */}
   <div>
  {selectedVoucher && (
    <CouponForm
      voucher={{ selectedVoucher, FolioNumber }}
      isOpen={voucherDiscountModal1}
      onClose={handleModalClose}
    />
  )}
</div>


    <div>

       {/* <RedemptionHistory data={sessionStorage.getItem('phoneNumberRedemption')} */}
       {phoneNumberRedemption && (
       <RedemptionHistory phoneNumberRedemption={phoneNumberRedemption}
        isOpen1={redemptionhistoryModal}
        onClose1={handleModalClose1}
      />
       )}
    </div>
      {/* For Applied Discount popup modal */}

      <Modal isOpen={discountModal1} toggle={() => setdiscountModal1(false)} className="modal-dialog-centered" style={{ width: '20%' }}>
        <ModalHeader toggle={() => setdiscountModal(false)}></ModalHeader>
        <ModalBody style={{ height: '30vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
              <FaRupeeSign style={{ fontSize: '20px' }} />
              <strong>{totalDiscount}</strong>
            </p>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>Discount applied successfully!!</p>
          </div>
        </ModalBody>
        <ModalFooter style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0' }}>
          <Button color="warning" size="lg" style={{ width: '300px', height: '50px' }} onClick={() => { setdiscountModal1(false); handleSubmit(onSubmitDisc) }}>Close</Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={openPreviewBill}
        toggle={toggleModal1}
        size="lg"
        className='modal-dialog-centered'
        onCancel={() => setopenPreviewBill(false)}
        centered
        footer={null}
      >
        <ModalHeader toggle={toggleModal1} className='text-center'>
        </ModalHeader>
        <ModalBody className='pb-3 px-sm-1 mx-20 '  >
          <div>
            {previewFolioData.length != 0 && 
            <Card className='invoice-preview-card'>
              <CardHeader className="text-center d-flex justify-content-center">
                <CardTitle tag="h2"><b>Information Invoice</b></CardTitle>
              </CardHeader>

              <CardBody className='invoice-padding pb-0'>
                <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
                  <div>
                  
                    <div style={{ paddingTop: '5px' }}>
                      <a href="https://www.theoterra.com/net_zero_hotel" target="_blank" rel="noopener noreferrer">
                      <img style={{ width: '80px', height: '80px', display: 'block', marginBottom: '20px' }} src={API_URL+`/imagepaths/${logoimage}`} alt="Hotel Logo" onError={(e) => { console.log('Error loading image:', e); }} />
                  </a>
                    </div>
                    <h6 className='mb-25'>Guest Name: {previewFolioData['guestName']}</h6>

                    <h6 className='mb-25'>Room Number:{localStorage.getItem('selectedRoom')} </h6>
                    <h6 className='mb-0'>Pax : {data['pax']} </h6>
                  </div>
                  <div className='mt-md-1 mt-3'>
                    <h4>Outlet Name: <span>{localStorage.getItem('RestaurantSelected')}</span></h4>
                    <h6 className='invoice-number'>FSSAI No: {FSSAINumber}</h6>
                    <h6>Table Number:{localStorage.getItem('TableSelected')}</h6>
                    <h6>User : {previewFolioData['stewardName']}</h6>

                  </div>
                </div>
              </CardBody>
              <Table responsive>
                <thead>
                  <tr>
                    <th className='py-1'>Item Name</th>
                    <th className='py-1'>Quantity</th>
                    <th className='py-1'>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {previewFolioData['items'].map((row, index) => (

                    <tr className='border-bottom'>
                      <td className='py-1'>
                        <p className='card-text fw-bold mb-25' id={"itemID" + index}> {row.itemName}</p>
                      </td>
                      <td className='py-1'>
                        <span className='fw-bold'>{row.qty}</span>
                      </td>
                      <td className='py-1'>
                        <span className='fw-bold'>{row.Price.toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <CardBody className='invoice-padding pb-0'>
                <Row className='invoice-sales-total-wrapper'>
                  <Col className='mt-md-0 mt-3' md='6' order={{ md: 1, lg: 2 }}>

                  </Col>
                  <Col className='d-flex justify-content-end' md='6' order={{ md: 2, lg: 1 }}>
                    <div className='invoice-total-wrapper'>
                      <div className='invoice-total-item'>
                      </div>
                      <div className='invoice-total-item'>
                      </div>
                     
                      {previewFolioData.classDiscDisplay.map((item, index) => (
                        <div key={index} className='invoice-total-item'>
                          <p className='invoice-total-title'><strong>{item.item.toUpperCase()} : {item.value}</strong></p>
                        </div>
                      ))}
                      
                      <div className='invoice-total-item'>
                        <p className='invoice-total-title'><strong>AMOUNT : {previewFolioData.total}</strong></p>
                      </div>
                      <div style={{ 'border-bottom': '1px solid #E8E8E8', 'margin-bottom': '10px' }} ></div>

                    </div>
                  </Col>
                </Row>

              </CardBody>

              <div style={{ 'border-bottom': '1px solid #E8E8E8', 'margin-bottom': '10px' }} ></div>


      <CardBody className='invoice-padding pt-0'>
  <Row>
    <Col sm='10'>
      <span>
        <strong><p>GSTIN No. {GSTINNumber}</p></strong>
        <p>CIN: {CINNumber}</p>
        <p>{hotelName} </p>
        <p>{firmdata}</p>
        <p>{hotelAddress} {postalcodedata} India</p>
        <p> T:+{hotelNo}  F: +{faxdata}  W: {websitedata}</p>
      </span>
    </Col>
    <Col sm='2' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      {logostatus === 1 ? (
        <a href="https://www.theoterra.com/net_zero_hotel" target="_blank" rel="noopener noreferrer">
        <img src={API_URL + `/imagepaths/${imagelogo}`} alt="NatZero Logo" style={{ width: '100px', height: '80px' }} />
        </a>
      ) : (
        <div> </div>
      )}
    </Col>
  </Row>
</CardBody>
            </Card>
            }
              {/* <Button color='secondary' tag={Link} to='/apps/Print' target='_blank' block outline className='me-1' > */}
              <div className='d-flex justify-content-center'>
              <Button color='secondary' onClick={() => navigate('/apps/Print', { state: { previewData: previewFolioData } })} outline className='me-1' style={{ width: '100%' }}
              >                
                Print
              </Button>
            </div>
          </div>
        </ModalBody>


      </Modal>
      <Modal
        isOpen={showAlert}
        toggle={() => setshowAlert(!showAlert)}
        className='modal-dialog-centered'
        onCancel={() => setshowAlert(false)}
        centered
        footer={null}
      >
        <ModalBody className='px-5 pb-2' toggle={() => setshowAlert(!showAlert)}>
          <div className='text-center mb-2'>
            <h3 className='demo-space-y'><b>Please complete the Payment!!</b></h3>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={voidpaymentModal}
        // toggle={() => setvoidpaymentModal(false)}
        className='modal-dialog-centered'
        onCancel={() => setvoidpaymentModal(false)}
        centered
        footer={null}
      >
        <ModalHeader>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Void Payment!!!</span>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(handleOnSubMitvoidpayment)}>
            <Col sm='12' className='mb-1' >
              <div className="mb-1">
                <InputGroup className="input-group-merge">
                  <Controller
                    id='reason'
                    name='reason'
                    control={control}
                    rules={{ required: 'Reason is Required' }}
                    render={({ field }) => (
                      <Input
                        type='text' // Changed from 'type="type"'
                        required
                        placeholder='Give Reason for void KOT'
                        style={{ width: '90%', height: '100px', margin: '0 auto' }}
                        {...field}
                      />
                    )}
                  />
                </InputGroup>
                {errors.reason && <span className='text-danger'>Reason is required</span>}
              </div>
            </Col>

            <div align='end' className='buttons'>
              <Button outline className='me-1' color='secondary' onClick={handleCancelVoidBillClick}>
                CANCEL
              </Button>
              <Button color='primary' className='me-1' type="submit">
                SUBMIT
              </Button>
            </div>
          </Form>
        </ModalBody>
        {/* </div> */}

      </Modal>

      <Modal isOpen={confirmationSingleVoucherModal} toggle={toggleConfirmationVoucherModal}>
        <ModalHeader toggle={toggleConfirmationVoucherModal}>Confirm Redemption</ModalHeader>
        <ModalBody>
          This is a one-time redeemable voucher and cannot be Undone or reused Again. Do you still want to proceed?
        </ModalBody>
        <ModalFooter>
          {/* <Button outline onClick={toggleConfirmationVoucherModal}>Cancel</Button> */}
          <Button outline onClick={() => {
              localStorage.removeItem('selectedVoucherData');
              toggleConfirmationVoucherModal();
            }}>
              Cancel
            </Button>
          <Button color="primary" onClick={handleConfirm}>Proceed</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={confirmationMultiVoucherModal} toggle={toggleConfirmationMultiVoucherModal}>
        <ModalHeader toggle={toggleConfirmationMultiVoucherModal}>Confirm Redemption</ModalHeader>
        <ModalBody>
        This voucher can be used multiple times. Once applied, it can be redeemed again. Do you want to proceed with the redemption?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleConfirmationMultiVoucherModal}>Cancel</Button>
          <Button color="primary" onClick={handleConfirm}>Proceed</Button>
        </ModalFooter>
      </Modal>
      
      <Modal
        isOpen={servicechargeInfoModal}
        onCancel={() => setservicechargeInfoModal(false)}
        centered
        footer={null}
      >
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h2 className='demo-space-y'><b>Service Charge</b></h2>
            <h3>
              Do you want to {isservicecharge ? 'Remove' : 'Add'} service charge for, Table #{localStorage.getItem('TableSelected')}
            </h3>
          </div>

          <div className="button-container text-center">
            <Button className="me-1" color="danger" onClick={() => setservicechargeInfoModal(false)}>
              No
            </Button>

            <Button 
              color="primary" 
              className='bg-transparent' 
              onClick={isservicecharge ? handleremoveserviceCharge : handleaddserviceCharge}>
              Yes
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal 
        isOpen={splitModal} 
        // toggle={toggleModalsplit} 
        className="modal-dialog-centered"
        style={{ maxWidth: '650px' }} 
      >
        <div className='text-center mb-2' style={{ backgroundColor: 'red', height: '50px', position: 'relative' }}>
          <ModalHeader>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}> Split Bill</span>
            <Button 
              close 
              onClick={toggleModalsplit} 
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
            </Button>
          </ModalHeader>
        </div>
  
        <ModalBody>
      <CardText>
        <Container style={{ marginBottom: '20px' }}>
          <Row className="justify-content-between">
            <Col md='4' className='text-center'>
              <Button.Ripple
                color={activeButton === 'equalsplit' ? 'primary' : 'secondary'} // Change color based on active state
                className="d-flex flex-column align-items-center"
                onClick={() => handleButtonClick('equalsplit')}
                style={{
                  width: '180px',
                  height: '60px',
                  margin: '0 5px',
                  fontSize: '16px'
                }}
              >
                <GrStar style={{ color: 'black', fontSize: '30px' }} />
                <span>Equal Split</span>
              </Button.Ripple>
            </Col>
            <Col md='4' className='text-center'>
              <Button.Ripple
                color={activeButton === 'Classification' ? 'primary' : 'secondary'} // Change color based on active state
                className="d-flex flex-column align-items-center"
                onClick={() => handleButtonClick('Classification')}
                style={{
                  width: '180px',
                  height: '60px',
                  margin: '0 5px',
                  fontSize: '16px'
                }}
              >
                <GrStar style={{ color: 'black', fontSize: '30px' }} />
                <span>Classification</span>
              </Button.Ripple>
            </Col>
            <Col md='4' className='text-center'>
              <Button.Ripple
                color={activeButton === 'openItem' ? 'primary' : 'secondary'} // Change color based on active state
                className="d-flex flex-column align-items-center"
                onClick={() => handleButtonClick('openItem')}
                style={{
                  width: '180px',
                  height: '60px',
                  margin: '0 5px',
                  fontSize: '16px'
                }}
              >
                <GrStar style={{ color: 'black', fontSize: '30px' }} />
                <span>Open Item</span>
              </Button.Ripple>
            </Col>
          </Row>
        </Container>
      </CardText>
    </ModalBody>
      </Modal>

      <Modal isOpen={isEqualSplit} 
        // toggle={closeModal} 
        centered>
          <ModalHeader 
          // toggle={closeModal} 
          style={{ fontWeight: 'bold', fontSize: '20px' }}>Split Order
          </ModalHeader>

          {/* <Form onSubmit={handleSubmit(handleInvForm)}> */}
          <ModalBody>
            <Form onSubmit={handleSubmit(handleFormSubmit)}>
              <Row>
                <Col sm='12' md='12' className='mb-1'>
                  <div className="mb-1">

                    <InputGroup className="input-group-merge">
                      <Controller
                        id="EqualSplit"
                        name="EqualSplit"
                        control={control}
                        render={({ field }) => (
                          <Cleave
                          type='number'
                            pattern="[0-9]*" title="Only Numbers Allowed"
                            placeholder="Total Number of Splits"
                            {...field}
                            className={classnames("form-control", {
                            })}
                          />
                        )}
                      />
                    </InputGroup>
                  </div>
                </Col></Row>
             
              <div align='end' className='buttons'>
                <Button outline className='me-1' color='secondary' onClick={closeModal}>
                  CANCEL
                </Button>
                <Button color='primary' className='me-1' disabled={loading}>
                  {/* SUBMIT */}
                  {loading ? "Processing..." : "SUBMIT"}
                </Button>
              </div>
             
            </Form>
          </ModalBody>

        </Modal>


        <Modal
        isOpen={restoreorder}
        onCancel={() => setrestoreorder(false)}
        centered
        footer={null}
      >
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h2 className='demo-space-y'><b>Restore Order</b></h2>
            <h3>
              Do you want to restore the order?
            </h3>
          </div>

          <div className="button-container text-center">
            <Button className="me-1" color="danger" onClick={() => setrestoreorder(false)}>
              No
            </Button>

            <Button 
              color="primary" 
              className='bg-transparent' 
              onClick={UndoSplit}>
              Yes
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={isClassificationSplit}  centered>
        <ModalHeader  style={{ fontWeight: 'bold', fontSize: '30px' }}>Split Bill
        </ModalHeader>
        {/* <Form onSubmit={handleSubmit(handleInvForm)}> */}
        <ModalBody>
        <Form onSubmit={handleSubmit(handleClassificationSplit1)}>
          <Row>
            <Col sm="12" md="6" className="mb-2">
              <FormGroup check>
                <Label check style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <Input
                    type="radio"
                    name="liquor"
                    value="LIQUOR+OTHERS"
                    checked={selectedOption === "LIQUOR+OTHERS"}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  {/* LIQUOR+OTHERS */}
                  Liquor Bill+Others Bill(Food/SoftDrinks/Smokes/Others)
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="12" md="6" className="mb-2">
              <FormGroup check>
                <Label check style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <Input
                    type="radio"
                    name="liquorsmokes"
                    value="LIQUOR+SMOKES+OTHERS"
                    checked={selectedOption === "LIQUOR+SMOKES+OTHERS"}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  {/* LIQUOR+SMOKES+OTHERS */}
                  Liquor Bill+Smoke Bill+Others Bill(Food/SoftDrinks)
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <Row>

            {/* <Col sm="12" md="6" className="mb-2">
              <Button className="bg-transparent" style={{ width: "100%", backgroundColor: "gray" }} onClick={closeClassificationModal} >
                CANCEL
              </Button>
            </Col>
            <Col sm="12" md="6" className="mb-2">
              <Button className="me-1" color="danger" style={{ width: "100%" }}>
                SUBMIT
              </Button>
            </Col> */}
            <div align='end' className='buttons'>
              <Button outline className='me-1' color='secondary' onClick={closeClassificationModal}>
                CANCEL
              </Button>
              <Button color='primary' className='me-1' disabled={loading} >
              {loading ? "Processing..." : "SUBMIT"}
              </Button>
            </div>
          </Row>
          
        </Form>
        </ModalBody>
      </Modal>

      <Modal isOpen={isItemSplit}  centered>
        <ModalHeader style={{ fontWeight: 'bold', fontSize: '20px' }}>Split Order
        </ModalHeader>

        {/* <Form onSubmit={handleSubmit(handleInvForm)}> */}
        <ModalBody>
          <Form onSubmit={handleSubmit(handleOpenSplit)}>
            <Row>
              <Col sm='12' md='12' className='mb-1'>
                <div className="mb-1">
                  <InputGroup className="input-group-merge">
                    <Controller
                      id="itemsplit"
                      name="itemsplit"
                      control={control}
                      render={({ field }) => (
                        <Cleave
                          pattern="[0-9]*"
                          title="Only Numbers Allowed"
                          placeholder="Total Number of Splits for items"
                          {...field}
                          className={classnames("form-control", {
                            // "is-invalid":
                            //     data !== null && (data.noOfPeople === null || !data.noOfPeople.length)
                          })}
                        />
                      )}
                    />
                  </InputGroup>
                </div>
              </Col>
            </Row>
            {/* <Row>

            <Col sm="12" md="6" className="mb-2">
              <Button className="bg-transparent" style={{ width: "100%", backgroundColor: "gray" }} onClick={closeItemModal} >
                CANCEL
              </Button>
            </Col>
            <Col sm="12" md="6" className="mb-2">
              <Button className="me-1" color="danger" style={{ width: "100%" }}>
                SUBMIT
              </Button>
            </Col>
          </Row> */}
            <div align='end' className='buttons'>
              <Button outline className='me-1' color='secondary' onClick={closeItemModal}>
                CANCEL
              </Button>
              <Button color='primary' className='me-1'  >
                SUBMIT
              </Button>
            </div>
            {/* <div style={{ backgroundColor: 'yellow', height: '50px', position: 'relative' }}>
              <ModalHeader onClick={handleCartClick} style={{ color: 'white', fontWeight: 'bold', width: '100%', height: '100%', background: 'yellow', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>AddItem</ModalHeader>
          </div> */}
          </Form>
        </ModalBody>

      </Modal>

      <Modal isOpen={opensplitModal}           
      className="modal-xl">
  
      <ModalBody className="pb-0 px-sm-2 mx-30">
       
      <Card className='invoice-preview-card' style={{ backgroundColor: '', width: '100%', height: '65px' ,marginBottom:'20px'}}>
        <CardBody className='invoice-padding pt-2'>
          <Row>
            <Col md='7' sm='12' className='mb-1'>
              <div className="mb-1">
                <CardText className='mb-25' style={{ color: 'black', fontSize: '15px' }}>
                  <strong>Item Split</strong>
                </CardText>

              </div>
            </Col>
  
          <Col className='mb-1 d-flex justify-content-end' style={{ padding: '1px 40px', fontSize: '28px' }} 
            >
          <div className="mb-1">
          <CardText className='mb-25' style={{ color: 'black', fontSize: '30px' }}>
          {listArr0.length === 0 && (
          <Button style={{width:'90px',marginRight:'35px', borderRadius: '10px'}} onClick={splitconfirmation}>Finish</Button>
          )}
          <span><IoMdHome style={{width:'30px'}} onClick={handleclickIoMdHome}/></span>
          <span style={{marginLeft:'30px'}} onClick={handleclickBiRotateLeft}><BiRotateLeft/></span>
          <span style={{marginLeft:'30px'}} onClick={handlecloseopenSplit}><FaRegWindowClose/></span>
          </CardText>
          </div>
          </Col>
             
          </Row>
        </CardBody>
      </Card>
      {createOpenCards()}
      </ModalBody>
    </Modal>

    <Modal
        isOpen={closesplitprocess}
        onCancel={() => setclosesplitprocess(false)}
        centered
        footer={null}
      >
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h2 className='demo-space-y'><b>Close</b></h2>
            <h3>
              Do you want to close split process?
            </h3>
          </div>

          <div className="button-container text-center">
            <Button className="me-1" color="danger" onClick={() => setclosesplitprocess(false)}>
              No
            </Button>
            <Button 
              color="primary" 
              className='bg-transparent' 
              onClick={() => navigate('/apps/posconfiguration/addorder')}
              >
              Yes
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={closesplitprocesstable}
        onCancel={() => setclosesplitprocesstable(false)}
        centered
        footer={null}
      >
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h2 className='demo-space-y'><b>Close</b></h2>
            <h3>
              Do you want to go table page?
            </h3>
          </div>

          <div className="button-container text-center">
            <Button className="me-1" color="danger" onClick={() => setclosesplitprocesstable(false)}>
              No
            </Button>
            <Button 
              color="primary" 
              className='bg-transparent' 
              onClick={() => navigate('/apps/posconfiguration/Tableselection')}
              >
              Yes
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={resetopensplit}
        onCancel={() => setresetopensplit(false)}
        centered
        footer={null}
      >
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h2 className='demo-space-y'><b>Reset</b></h2>
            <h3>
              Do you want to reset open split?
            </h3>
          </div>

          <div className="button-container text-center">
            <Button className="me-1" color="danger" onClick={() => setresetopensplit(false)}>
              No
            </Button>
            <Button 
              color="primary" 
              className='bg-transparent' 
              onClick={handleresetopensplit}
              >
              Yes
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={showSpltModal} toggle={closeQtyMOdal} centered>
        <ModalHeader toggle={closeQtyMOdal} style={{ fontWeight: 'bold', fontSize: '20px' }}>Split Qty
        </ModalHeader>

        {/* <Form onSubmit={handleSubmit(handleInvForm)}> */}
        <ModalBody>
          <Form onSubmit={handleSubmit(handleSpltqty)}>
            <Row>
              <Col sm='12' md='12' className='mb-1'>
                <div className="mb-1">

                  <InputGroup className="input-group-merge">
                    <Controller
                      id="noofSplt"
                      name="noofSplt"
                      control={control}
                      render={({ field }) => (
                        <Cleave
                          pattern="[0-9]*" title="Only Numbers Allowed"
                          placeholder="Total Number of Splits"
                          {...field}
                          className={classnames("form-control", {
                            // "is-invalid":
                            //     data !== null && (data.noOfPeople === null || !data.noOfPeople.length)
                          })}
                        />
                      )}
                    />
                  </InputGroup>
                </div>
              </Col></Row>
            <div align='end' className='buttons'>
              <Button outline className='me-1' color='secondary' onClick={closeQtyMOdal}>
                CANCEL
              </Button>
              <Button color='primary' className='me-1' >
                SUBMIT
              </Button>
            </div>

          </Form>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={finishsplitconfirmation}
        onCancel={() => setfinishsplitconfirmation(false)}
        centered
        footer={null}
      >
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h2 className='demo-space-y'><b>Finish Split</b></h2>
            <h3>
              Do you want to proceed now??
            </h3>
          </div>

          <div className="button-container text-center">
            <Button className="me-1" color="danger" onClick={() => setfinishsplitconfirmation(false)}>
              No
            </Button>
            <Button 
              color="primary" 
              className='bg-transparent' 
              onClick={handleSplitNext}
              >
              Yes
            </Button>
          </div>
        </ModalBody>
      </Modal>
      
      <Modal
        isOpen={confirmamtvoid}
        onCancel={() => setconfirmamtvoid(false)}
        centered
        footer={null}
      >
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h2 className='demo-space-y'><b>Void Payment</b></h2>
            <h3>
              {/* Do you want to void payment for Amount ?? */}
              Do you want to void payment for Amount {recievedPaymentvoid}?

            </h3>
          </div>

          <div className="button-container text-center">
            <Button className="me-1" color="danger" onClick={() => setconfirmamtvoid(false)}>
              No
            </Button>
            <Button 
              color="primary" 
              className='bg-transparent' 
              onClick={handleAmtvoid}
              >
              Yes
            </Button>
          </div>
        </ModalBody>
      </Modal>
      
      <Modal
        isOpen={confirmremovedisc}
        onCancel={() => setconfirmremovedisc(false)}
        centered
        footer={null}
      >
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h2 className='demo-space-y'><b>Remove Discount</b></h2>
            <h3>
              {/* Do you want to void payment for Amount ?? */}
              Do you want to remove discount ?

            </h3>
          </div>

          <div className="button-container text-center">
            <Button className="me-1" color="danger" onClick={() => setconfirmremovedisc(false)}>
              No
            </Button>
            <Button 
              color="primary" 
              className='bg-transparent' 
              onClick={handleRemoveDiscount}
              >
              Yes
            </Button>
          </div>
        </ModalBody>
      </Modal>

      
      <Modal
        isOpen={confirmBackButtonClick}
        onCancel={() => setconfirmBackButtonClick(false)}
        centered
        footer={null}
      >
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h2 className='demo-space-y'><b>Split Alert!!!</b></h2>
            <h3>
              {/* Do you want to void payment for Amount ?? */}
              Do you want to table page ?

            </h3>
          </div>

          <div className="button-container text-center">
            <Button className="me-1" color="danger" onClick={() => setconfirmBackButtonClick(false)}>
              No
            </Button>
            <Button 
              color="primary" 
              className='bg-transparent' 
              onClick={handleBackButtonClick}
              >
              Yes
            </Button>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={roomDiscConfirm}
        onCancel={() => setroomDiscConfirm(false)}
        centered
        footer={null}
      >
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h2 className='demo-space-y'><b>Confirmation</b></h2>
            <h3>
              {/* Do you want to void payment for Amount ?? */}
              This room has a discount of {`₹${roomdisctoshow}`}. Do you want to apply it?

            </h3>
          </div>

          <div className="button-container text-center">
            {/* <Button className="me-1" color="danger" onClick={() => setroomDiscConfirm(false)}> */}
            <Button className="me-1" color="danger" onClick={() => handleRemoveDiscountApplied()}>

              No
            </Button>
            <Button 
              color="primary" 
              className='bg-transparent' 
              onClick={handleAddRoomDiscount}
              >
              Yes
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  ) : null
}

export default PreviewPayment