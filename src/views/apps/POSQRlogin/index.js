import React, { useState, useRef, useEffect } from 'react';
import './LoginScreen.css';
import loginQRIcon from '../../../assets/images/icons/loginQR.png';
import API_URL from "../../../config";
import { useForm,Controller} from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Alert,
  Button,
  CardText,
  CardTitle,
  FormFeedback,
  UncontrolledTooltip
} from 'reactstrap'
import InputPasswordToggle from '@components/input-password-toggle'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import classnames from 'classnames'

const MySwal = withReactContent(Swal);

const LoginScreen = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isOtpFormVisible, setIsOtpFormVisible] = useState(false);
  const navigate = useNavigate();
  const [orderID, setOrderID] = useState(null);
  const [loginform,setloginform] = useState(null)
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control,register, handleSubmit, reset, setValue, watch , formState: { errors }} = useForm({
    defaultValues: {
      otp: ''
    }
  });

  const handleMobileChange = (event) => setMobileNumber(event.target.value);
  sessionStorage.setItem('mobileNumber',mobileNumber);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tableNumber = urlParams.get('tableNumber');
    const hotelId = urlParams.get('hotelId');
    const selctedstoreID = urlParams.get('storeID');
    const roomNo = urlParams.get('roomNo');
    const IRDOrderID = urlParams.get('orderID')
    sessionStorage.setItem('storeID', selctedstoreID);
    

    console.log("storeID===",selctedstoreID ,"hotelID==",hotelId,"tableNumber==",tableNumber)
    if (tableNumber && hotelId && selctedstoreID) {
      sessionStorage.setItem('TableSelected', tableNumber);
      // sessionStorage.setItem('storeID', selctedstoreID);
    } 
    else if (roomNo) {
      sessionStorage.setItem("orderID", IRDOrderID);
      sessionStorage.setItem("TableSelected", roomNo);
      const orderdata = JSON.stringify({
        hotelID: 10,
        storeID: sessionStorage.getItem("storeID"),
        tableNo: roomNo,
        pax: 1,
        orderType: "Normal",
        roomNo: roomNo,
        guestType: "Resident",
        dept: "",
        NCKOTType: "",
        reason: "",
      });

      fetch(API_URL + "/addHotelCustomernIRDSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: orderdata,
      })
        .then((res) => res.json())
        .then((postres) => {
          setShowWelcome(true);
          console.log(postres);
          // navigate("/apps/POSQRUI");
          setTimeout(() => {
            navigate("/apps/POSQRUI", { replace: true });
          }, 1000);
        })
        .catch((error) => {
          console.error("Error fetching business date:", error);
        });
    }  else {
      console.error('Missing tableNumber or hotelId in the URL');
    }
  }, []);

  useEffect(() => {
    checkTableOrderStatus();
  }, []);

  const otpInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];
  useEffect(() => {
    if (isOtpFormVisible && countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOtpFormVisible, countdown]);

  const handleResendOTP = async () => {
    otpInputRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.value = '';
      }
    });

    // Reset the form state
    reset({
      otp: Array(6).fill('')
    });
    try {
      const otpResponse = await fetch(API_URL + '/requestqrotp', {
        method: 'POST',
        body: JSON.stringify({
          "hotelID": 1,
          "storeID": sessionStorage.getItem('storeID'),
          "phoneNumber": mobileNumber.startsWith('+91') ? mobileNumber : `+91${mobileNumber}`,
          "tableNo": sessionStorage.getItem('TableSelected'),
        }),
        
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      const post = await otpResponse.json();
      if (post['statuscode'] === 200 || post['statusCode'] === 200) {
        setCountdown(60);
        setCanResend(false);
        const swalInstance = MySwal.fire({
          title: 'OTP Resent Successfully',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            icon: 'swal2-icon-custom'
          },
          width: '300px',
          html: `
            <style>
              .swal2-popup-custom {
                padding: 0.75rem !important;
              }
              .swal2-icon-custom {
                margin: 0.5rem auto !important;
                transform: scale(0.9) !important;
              }
              .swal2-title-custom {
                font-size: 14px !important;
                color: #333 !important;
                margin: 0.5rem 0 !important;
                padding: 0 !important;
              }
              .btn.btn-danger {
                background-color: #dc3545;
                color: white;
                padding: 10px 18px;
                border-radius: 4px;
                margin-top: 0.5rem;
                border: none;
                cursor: pointer;
                font-size: 14px;
              }
              .btn.btn-danger:hover {
                background-color: #bb2d3b;
              }
              .swal2-html-container {
                margin: 0.2rem 0 !important;
              }
            </style>
          `
        });
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
    }
  };
  const checkTableOrderStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/getTableOrderStatus?hotelID=1&storeID=${sessionStorage.getItem('storeID')}&tableNo=${sessionStorage.getItem('TableSelected')}`);
      const resp = await response.json();
      const tableOrderID = resp?.data?.TableOrderID;
      
      if (tableOrderID && tableOrderID !== 0) {
        setOrderID(tableOrderID);
        sessionStorage.setItem('orderID', tableOrderID);
      }
    } catch (err) {
      console.error('Error checking table status:', err);
    }
  };

  const handleNextClick = async () => {
    if (!mobileNumber) {
      const swalInstance = MySwal.fire({
        title: 'Please enter a valid phone number',
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Close',
        customClass: {
          confirmButton: 'btn btn-danger',
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          icon: 'swal2-icon-custom'
        },
        width: '300px',
        html: `
          <style>
            .swal2-popup-custom {
              padding: 0.75rem !important;
            }
            .swal2-icon-custom {
              margin: 0.5rem auto !important;
              transform: scale(0.9) !important;
            }
            .swal2-title-custom {
              font-size: 14px !important;
              color: #333 !important;
              margin: 0.5rem 0 !important;
              padding: 0 !important;
            }
            .btn.btn-danger {
              background-color: #dc3545;
              color: white;
              padding: 10px 18px;
              border-radius: 4px;
              margin-top: 0.5rem;
              border: none;
              cursor: pointer;
              font-size: 14px;
            }
            .btn.btn-danger:hover {
              background-color: #bb2d3b;
            }
            .swal2-html-container {
              margin: 0.2rem 0 !important;
            }
          </style>
        `
      });

      return;
    }
    try {
      const response = await fetch(`${API_URL}/getTableOrderStatus?hotelID=1&storeID=${sessionStorage.getItem('storeID')}&tableNo=${sessionStorage.getItem('TableSelected')}`);
      const resp = await response.json();
      const tableOrderID = resp?.data?.TableOrderID;
      if (tableOrderID && tableOrderID !== 0) {
        // console.log("Fetching order details...");
        
        fetchx(API_URL + '/checkPhoneNumberOrder?hotelID=1&storeID=' + sessionStorage.getItem('storeID') + '&phoneNumber=' + mobileNumber+'&tableNo=' +sessionStorage.getItem('TableSelected'))
        .then(result => result.json())
        .then((resp) => {
          if(resp['statuscode'] === 200 || resp['statusCode'] === 200) {
            // console.log(resp['data'])
            sessionStorage.setItem('userotp',resp['data']['userotp'])
            sessionStorage.setItem('posGuesName',resp['data']['posGuestName'])
            const swalInstance = MySwal.fire({
              title: resp['message'],
              // text: post['message'],
              icon: 'success',
              buttonsStyling: false,
              confirmButtonText: 'Close',
              customClass: {
                confirmButton: 'btn btn-danger',
                popup: 'swal2-popup-custom',
                title: 'swal2-title-custom',
                icon: 'swal2-icon-custom'
              },
              width: '300px',
              html: `
                <style>
                  .swal2-popup-custom {
                    padding: 0.75rem !important;
                  }
                  .swal2-icon-custom {
                    margin: 0.5rem auto !important;
                    transform: scale(0.9) !important;
                  }
                  .swal2-title-custom {
                    font-size: 14px !important;
                    color: #333 !important;
                    margin: 0.5rem 0 !important;
                    padding: 0 !important;
                  }
                  .btn.btn-danger {
                    background-color: #dc3545;
                    color: white;
                    padding: 10px 18px;
                    border-radius: 4px;
                    margin-top: 0.5rem;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                  }
                  .btn.btn-danger:hover {
                    background-color: #bb2d3b;
                  }
                  .swal2-html-container {
                    margin: 0.2rem 0 !important;
                  }
                </style>
              `
            });
            
            swalInstance.then((result) => {
              if (result.isConfirmed) {
                sessionStorage.setItem('orderID', tableOrderID);
                navigate('/apps/POSQRUI');
                return;
              }
            });
          }
          if(resp['statuscode'] === 403 || resp['statusCode'] === 403) {
            const swalInstance = MySwal.fire({
              title: resp['message'],
              icon: 'error',
              buttonsStyling: false,
              confirmButtonText: 'Close',
              customClass: {
                confirmButton: 'btn btn-danger',
                popup: 'swal2-popup-custom',
                title: 'swal2-title-custom',
                icon: 'swal2-icon-custom'
              },
              width: '300px',
              html: `
                <style>
                  .swal2-popup-custom {
                    padding: 0.75rem !important;
                  }
                  .swal2-icon-custom {
                    margin: 0.5rem auto !important;
                    transform: scale(0.9) !important;
                  }
                  .swal2-title-custom {
                    font-size: 14px !important;
                    color: #333 !important;
                    margin: 0.5rem 0 !important;
                    padding: 0 !important;
                  }
                  .btn.btn-danger {
                    background-color: #dc3545;
                    color: white;
                    padding: 10px 18px;
                    border-radius: 4px;
                    margin-top: 0.5rem;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                  }
                  .btn.btn-danger:hover {
                    background-color: #bb2d3b;
                  }
                  .swal2-html-container {
                    margin: 0.2rem 0 !important;
                  }
                </style>
              `
            });
            
            swalInstance.then((result) => {
              if (result.isConfirmed) {
                sessionStorage.setItem('orderID', tableOrderID);
                navigate('');
                return;
              }
            });
          }
        })
        .catch((err) => {
            console.error(err);
        });
      
       
      }
      
      else {
      const otpResponse = await fetch(API_URL + '/requestqrotp', {
        method: 'POST',
        body: JSON.stringify({
          "hotelID": 1,
          "storeID": sessionStorage.getItem('storeID'),
          "phoneNumber": mobileNumber,
          "tableNo": sessionStorage.getItem('TableSelected'),
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      const post = await otpResponse.json();
      if (post['statuscode'] === 200 || post['statusCode'] === 200) {
        reset();
        setIsOtpFormVisible(true);
      } else if (post['statuscode'] === 403 || post['statusCode'] === 403) {
        MySwal.fire({
          text: post.message,
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        });
      }
    }

    } catch (err) {
      console.error('Error:', err);
      MySwal.fire({
        text: 'An error occurred. Please try again.',
        buttonsStyling: false,
        confirmButtonText: 'Close',
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      });
    }
  };

  const handleOtpSubmit = async (data) => {
    const otpString = data.otp ? data.otp.join('') : '';
    
    // console.log('Full OTP:', otpString);
    // sessionStorage.setItem('userotp',otpString)
    sessionStorage.setItem('userotp',otpString)

    
    if (otpString.length !== 6) {
      MySwal.fire({
        text: 'Please enter a complete 6-digit OTP',
        buttonsStyling: false,
        confirmButtonText: 'Close',
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      });
      return;
    }
    try {
        const response = await fetch(API_URL + '/validateqrotp', {
          method: 'POST',
          body: JSON.stringify({
            "hotelID": 10,
            "otp": otpString,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
  
        const post = await response.json();
        if (post['statuscode'] === 200 || post['statusCode'] === 200) {
          setloginform(true)
        }
        if (post['statuscode'] === 403 || post['statusCode'] === 403) {
          const swalInstance = MySwal.fire({
            title: post['message'],
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-danger',
              popup: 'swal2-popup-custom',
              title: 'swal2-title-custom',
              icon: 'swal2-icon-custom'
            },
            width: '300px',
            html: `
              <style>
                .swal2-popup-custom {
                  padding: 0.75rem !important;
                }
                .swal2-icon-custom {
                  margin: 0.5rem auto !important;
                  transform: scale(0.9) !important;
                }
                .swal2-title-custom {
                  font-size: 14px !important;
                  color: #333 !important;
                  margin: 0.5rem 0 !important;
                  padding: 0 !important;
                }
                .btn.btn-danger {
                  background-color: #dc3545;
                  color: white;
                  padding: 10px 18px;
                  border-radius: 4px;
                  margin-top: 0.5rem;
                  border: none;
                  cursor: pointer;
                  font-size: 14px;
                }
                .btn.btn-danger:hover {
                  background-color: #bb2d3b;
                }
                .swal2-html-container {
                  margin: 0.2rem 0 !important;
                }
              </style>
            `
          }).then(() => {
            otpInputRefs.forEach((ref) => {
              if (ref.current) {
                ref.current.value = '';
              }
            });
        
            reset({
              otp: Array(6).fill(''),
            });
          });
          return;
        }
        
      } catch (err) {
        console.error('Error:', err);
      }
  };

  const handleUserDetails = async (data) => {
    const usercred = JSON.stringify({
      hotelid: 10,
      storeID: sessionStorage.getItem('storeID'),
      firstName: data.firstname,
      lastName: data.lastname,
      phoneNumber:sessionStorage.getItem('mobileNumber')
    })
    const fullName = `${data.firstname} ${data.lastname}`.trim();
    sessionStorage.setItem('posGuesName',fullName)
    // console.log("data------------")
    // console.log(usercred)
    fetchx(API_URL + "/updateusername", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: usercred
    }) .then(res => res.json())
    .then(resp => {
      if (resp['statuscode'] === 200 || resp['statusCode'] === 200) {
         let orderdata = {}
          let orderType = '';
          orderType = "Normal"
          orderdata = JSON.stringify({
            "hotelID": 1,
            "storeID": sessionStorage.getItem('storeID'),
            "tableNo": sessionStorage.getItem('TableSelected'),
            "pax": 1,
            "orderType": "Normal",
            "guestName": '',
            "roomNumber": '',
            "guestType": "NonResident",
            "dept": '',
            "NCKOTType": ''
          })
          let res = fetchx(API_URL + '/addHotelCustomernIRDOrderID', {
            method: 'POST',
            body: orderdata,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          })
            .then((res) => res.json())
            .then((post) => {
              if (post['statuscode'] === 200 || post['statusCode'] === 200) {
                sessionStorage.setItem('orderID', post['data']['orderID'])
             
                const swalInstance = MySwal.fire({
                  // title: post['message'],
                  title: 'Order created successfully',
                  icon: 'success',
                  buttonsStyling: false,
                  confirmButtonText: 'Close',
                  customClass: {
                    confirmButton: 'btn btn-danger',
                    popup: 'swal2-popup-custom',
                    title: 'swal2-title-custom',
                    icon: 'swal2-icon-custom'
                  },
                  width: '300px',
                  html: `
                    <style>
                      .swal2-popup-custom {
                        padding: 0.75rem !important;
                      }
                      .swal2-icon-custom {
                        margin: 0.5rem auto !important;
                        transform: scale(0.9) !important;
                      }
                      .swal2-title-custom {
                        font-size: 14px !important;
                        color: #333 !important;
                        margin: 0.5rem 0 !important;
                        padding: 0 !important;
                      }
                      .btn.btn-danger {
                        background-color: #dc3545;
                        color: white;
                        padding: 10px 18px;
                        border-radius: 4px;
                        margin-top: 0.5rem;
                        border: none;
                        cursor: pointer;
                        font-size: 14px;
                      }
                      .btn.btn-danger:hover {
                        background-color: #bb2d3b;
                      }
                      .swal2-html-container {
                        margin: 0.2rem 0 !important;
                      }
                    </style>
                  `
                });
                navigate('/apps/POSQRUI')
              }
              else if(post['statuscode'] === 403 || post['statusCode'] === 403) {
                const swalInstance = MySwal.fire({
                  title: post['message'],
                  icon: 'error',
                  buttonsStyling: false,
                  confirmButtonText: 'Close',
                  customClass: {
                    confirmButton: 'btn btn-danger',
                    popup: 'swal2-popup-custom',
                    title: 'swal2-title-custom',
                    icon: 'swal2-icon-custom'
                  },
                  width: '300px',
                  html: `
                    <style>
                      .swal2-popup-custom {
                        padding: 0.75rem !important;
                      }
                      .swal2-icon-custom {
                        margin: 0.5rem auto !important;
                        transform: scale(0.9) !important;
                      }
                      .swal2-title-custom {
                        font-size: 14px !important;
                        color: #333 !important;
                        margin: 0.5rem 0 !important;
                        padding: 0 !important;
                      }
                      .btn.btn-danger {
                        background-color: #dc3545;
                        color: white;
                        padding: 10px 18px;
                        border-radius: 4px;
                        margin-top: 0.5rem;
                        border: none;
                        cursor: pointer;
                        font-size: 14px;
                      }
                      .btn.btn-danger:hover {
                        background-color: #bb2d3b;
                      }
                      .swal2-html-container {
                        margin: 0.2rem 0 !important;
                      }
                    </style>
                  `
                });
                
                swalInstance.then((result) => {
                  if (result.isConfirmed) {
                  }
                });
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
      // console.log(resp)
      }

      if (resp['statuscode'] === 403 || resp['statusCode'] === 403) {
        const swalInstance = MySwal.fire({
          title: post['message'],
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            icon: 'swal2-icon-custom'
          },
          width: '300px',
          html: `
            <style>
              .swal2-popup-custom {
                padding: 0.75rem !important;
              }
              .swal2-icon-custom {
                margin: 0.5rem auto !important;
                transform: scale(0.9) !important;
              }
              .swal2-title-custom {
                font-size: 14px !important;
                color: #333 !important;
                margin: 0.5rem 0 !important;
                padding: 0 !important;
              }
              .btn.btn-danger {
                background-color: #dc3545;
                color: white;
                padding: 10px 18px;
                border-radius: 4px;
                margin-top: 0.5rem;
                border: none;
                cursor: pointer;
                font-size: 14px;
              }
              .btn.btn-danger:hover {
                background-color: #bb2d3b;
              }
              .swal2-html-container {
                margin: 0.2rem 0 !important;
              }
            </style>
          `
        });
        return;
      }

    })
  }

    const handleOtpPaste = (event) => {
      event.preventDefault();
      const pastedText = event.clipboardData.getData('text');
      const numericPaste = pastedText.replace(/\D/g, '');
      const pastedDigits = numericPaste.slice(0, 6).split('');
      
      pastedDigits.forEach((digit, index) => {
        if (index < 6) {
          otpInputRefs[index].current.value = digit;
          setValue(`otp[${index}]`, digit);
        }
      });
      const lastFilledIndex = pastedDigits.length - 1;
      if (lastFilledIndex < 5) {
        otpInputRefs[lastFilledIndex + 1].current.focus();
      }
    };

    const handleOtpInputChange = (index, event) => {
      const value = event.target.value.replace(/\D/g, ''); 
      setValue(`otp[${index}]`, value);  
      if (value.length === 1 && index < otpInputRefs.length - 1) {
        otpInputRefs[index + 1].current?.focus(); 
      } else if (value.length === 0 && index > 0) {
        otpInputRefs[index - 1].current?.focus();
      }
    };

  return (
    <div className="login-container">
        {showWelcome && (
          <>
      <div className="login-header">
        <img src={loginQRIcon} alt="Food Service" className="header-image" />
      </div>
      <h1>Welcome</h1>
      <p className="subtitle">Place your order and enjoy food.....</p>
      </>
        )}
      {!window.location.search.includes('roomNo') && (
        <>
{isOtpFormVisible && !loginform && (
        <form onSubmit={handleSubmit(handleOtpSubmit)}>
          <p>Please enter the PASSCODE</p>
          <div className="passcode-fields">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="passcode-field"
                ref={otpInputRefs[index]}
                onChange={(e) => handleOtpInputChange(index, e)}
                onPaste={handleOtpPaste}
                pattern="\d*"
                inputMode="numeric"
                style={{fontSize:'14px'}}
              />
            ))}
          </div>
          <div className="text-center mt-3 mb-2" style={{ color: '#666', fontSize: '14px' }}>
            {countdown > 0 ? (
              `Wait ${countdown} seconds to resend OTP`
            ) : (
              <Button 
                color="link" 
                className="p-0" 
                style={{ color: '#dc3545', textDecoration: 'none' }}
                onClick={handleResendOTP}
                disabled={!canResend}
              >
                Resend OTP
              </Button>
            )}
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>
      )}

{!isOtpFormVisible && (
        <div>
        <div className="form-group">
          <label htmlFor="mobile-number">Mobile Number</label>
          <input
            style={{width:'210px'}}
            type="tel"
            id="mobile-number"
            placeholder="+91 8892707195"
            value={mobileNumber}
            onChange={(e) => {
              const value = e.target.value;
              const regex = /^[0-9+ ]*$/;
              if (regex.test(value) || value === '') {
                handleMobileChange(e);
              }
            }}
            className="input-field"
          />
        </div>
          <button onClick={handleNextClick} className="next-button">Next</button>
        </div>
      )}
      {isOtpFormVisible && loginform && (
        <Form onSubmit={handleSubmit(handleUserDetails)}>

        <div className='mb-1'>
          <Label className='form-label' for='login-firstname' style={{fontSize:'16px'}}>
            First Name
          </Label>
          <Controller
            id='firstname'
            name='firstname'
            control={control}
            render={({ field }) => (
              <Input
              style={{width:'300px',height:'40px'}}
                autoFocus
                invalid={errors.firstname && true}
                {...field}
              />
            )}
          />
          {errors.firstname && <FormFeedback>{errors.firstname.message}</FormFeedback>}
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='login-lastname' style={{fontSize:'16px'}}>
            Last Name
          </Label>
          <Controller
            id='lastname'
            name='lastname'
            control={control}
            render={({ field }) => (
              <Input
              style={{width:'300px',height:'40px'}}
                autoFocus
                invalid={errors.lastname && true}
                {...field}
              />
            )}
          />
          {errors.lastname && <FormFeedback>{errors.lastname.message}</FormFeedback>}
        </div>

        <Button type='submit' color='danger' block  style={{width:'300px',height:'50px',marginTop:'30px'}}>
          Submit
        </Button>
      </Form>
      )}
              </>
              )}
            </div>
    
  );
};

export default LoginScreen;
