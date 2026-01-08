import React, { useState, useRef, useEffect } from 'react';
import './LoginScreen.css';
import loginQRIcon from '../../../assets/images/icons/loginQR.png';
import API_URL from "../../../config";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from "react-router-dom";


const MySwal = withReactContent(Swal);

const LoginScreen = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isOtpFormVisible, setIsOtpFormVisible] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      otp: ''
    }
  });

  useEffect(() => {
    const queryString = window.location.search;
    console.log("queryString")
    console.log(queryString)
    const urlParams = new URLSearchParams(queryString);
    const tableNumber = urlParams.get('tableNumber');
    const hotelId = urlParams.get('hotelId');
    if (tableNumber && hotelId) {
      console.log(`Table Number: ${tableNumber}, Hotel ID: ${hotelId}`);
      sessionStorage.setItem('TableSelected', tableNumber);
    } else {
      console.error('Missing tableNumber or hotelId in the URL');
    }
  }, []);

  // Refs for OTP input fields
  const otpInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // Handle mobile number change
  const handleMobileChange = (event) => setMobileNumber(event.target.value);

  // Handle OTP input navigation and formatting
  // const handleOtpInputChange = (index, event) => {
  //   const value = event.target.value;
    
  //   // Allow only numbers
  //   if (!/^\d*$/.test(value)) {
  //     event.target.value = value.replace(/\D/g, '');
  //     return;
  //   }

  //   // Set the value in the form
  //   setValue(`otp[${index}]`, value);

  //   // Auto-move to next input if a digit is entered
  //   if (value.length === 1 && index < 5) {
  //     otpInputRefs[index + 1].current.focus();
  //   }

  //   // Auto-move to previous input if backspace is pressed and current input is empty
  //   if (value.length === 0 && index > 0) {
  //     otpInputRefs[index - 1].current.focus();
  //   }
  // };
  const handleOtpInputChange = (index, event) => {
    const value = event.target.value.replace(/\D/g, ''); // Allow only numbers
    setValue(`otp[${index}]`, value);  
    if (value.length === 1 && index < otpInputRefs.length - 1) {
      otpInputRefs[index + 1].current?.focus(); // Move to the next field
    } else if (value.length === 0 && index > 0) {
      otpInputRefs[index - 1].current?.focus(); // Move to the previous field
    }
  };
  // Handle OTP paste
  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text');
    
    // Only allow numeric paste
    const numericPaste = pastedText.replace(/\D/g, '');
    
    // Distribute pasted digits across OTP inputs
    const pastedDigits = numericPaste.slice(0, 6).split('');
    
    pastedDigits.forEach((digit, index) => {
      if (index < 6) {
        otpInputRefs[index].current.value = digit;
        setValue(`otp[${index}]`, digit);
      }
    });

    // Focus on last filled input
    const lastFilledIndex = pastedDigits.length - 1;
    if (lastFilledIndex < 5) {
      otpInputRefs[lastFilledIndex + 1].current.focus();
    }
  };

  // Handle Next click for mobile number
  const handleNextClick = async () => {
    if (!mobileNumber) {
      MySwal.fire({
        text: 'Please enter a valid phone number',
        buttonsStyling: false,
        confirmButtonText: 'Close',
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      });
      return;
    }
    try {
      const response = await fetch(API_URL + '/requestqrotp', {
        method: 'POST',
        body: JSON.stringify({
          "hotelID": 1,
          "phoneNumber": mobileNumber,
          "tableNo": sessionStorage.getItem('TableSelected'),
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const post = await response.json();
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
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Handle OTP submission
  const handleOtpSubmit = async (data) => {
    // Combine OTP digits into a single string
    const otpString = data.otp ? data.otp.join('') : '';
    
    console.log('Full OTP:', otpString);
    
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
            "hotelID": 1,
            "otp": otpString,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
  
        const post = await response.json();
        
        if (post['statuscode'] === 200 || post['statusCode'] === 200) {
          // setTimeout(() => { navigate('/apps/POSQRUI') }, 100);  
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
          let res = fetchx(API_URL + '/addHotelOrderID', {
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
                  text: 'Order Created!!',
                  icon: 'success',
                  buttonsStyling: false,
                  confirmButtonText: 'Close',
                  customClass: {
                    confirmButton: 'btn btn-danger'
                  }
                });
                navigate('/apps/POSQRUI')
                // setTimeout(() => { navigate('/apps/POSQRUI') }, 100);  
              }
              else if(post['statuscode'] === 403 || post['statusCode'] === 403) {
                // const swalInstance = MySwal.fire({
                //   text: post.message,
                //   icon: 'error',
                //   buttonsStyling: false,
                //   confirmButtonText: 'Close',
                //   customClass: {
                //     confirmButton: 'btn btn-danger'
                //   }
                // });

                const swalInstance = MySwal.fire({
                  title: post['message'],
                  // text: post['message'],
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
        }
        if (post['statuscode'] === 403 || post['statusCode'] === 403) {
          MySwal.fire({
            text: post.message,
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-danger',
            },
          });
          return;
        }
      } catch (err) {
        console.error('Error:', err);
      }

    // Add your OTP verification logic here
    // For example:
    // verifyOtp(otpString);
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <img src={loginQRIcon} alt="Food Service" className="header-image" />
      </div>
      <h1>Welcome</h1>
      <p className="subtitle">Before Enjoying Food Services Please Register First</p>

      {isOtpFormVisible && (
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
                // {...register(`otp[${index}]`)}
                onChange={(e) => handleOtpInputChange(index, e)}
                onPaste={handleOtpPaste}
                pattern="\d*"
                inputMode="numeric"
                style={{fontSize:'14px'}}
              />
            ))}
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>
      )}

      {!isOtpFormVisible && (
        <div>
          <div className="form-group">
            <label htmlFor="mobile-number">Mobile Number</label>
            <input
              type="tel"
              id="mobile-number"
              placeholder="+91 8892707195"
              value={mobileNumber}
              onChange={handleMobileChange}
              className="input-field"
            />
          </div>
          <button onClick={handleNextClick} className="next-button">Next</button>
        </div>
      )}

      <p className="footer-text">
        By Logging In Or Registering, You Have Agreed To
        <a href="/terms" className="terms-link"> The Terms And Conditions</a> and
        <a href="/privacy" className="terms-link"> Privacy Policy</a>.
      </p>
    </div>
  );
};

export default LoginScreen;