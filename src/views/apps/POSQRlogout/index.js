import React, { useState, useRef, useEffect } from 'react';
import './LogoutScreen.css';
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

const LogoutScreen = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isOtpFormVisible, setIsOtpFormVisible] = useState(false);
  const navigate = useNavigate();
  const [orderID, setOrderID] = useState(null);
  const [loginform,setloginform] = useState(null)
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef(null);




  return (
    <div className="login-container">
      <div className="login-header">
        <img src={loginQRIcon} alt="Food Service" className="header-image" />
      </div>
      <h1>Welcome</h1>
      <p className="subtitle"> ✅ Thank you! Your order has been placed successfully.</p>

    </div>
  );
};

export default LogoutScreen;