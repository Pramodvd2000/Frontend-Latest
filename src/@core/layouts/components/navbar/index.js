// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import NavbarUser from './NavbarUser'
import NavbarBookmarks from './NavbarBookmarks'
import API_URL from '../../../../config'
import React, { useState, useRef } from 'react'
import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleLogout } from '@store/authentication';
// import { useNavigate } from "react-router-dom"



const scrollAnimation = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(-100%);
  }
`;

const RunningMessage = styled.span`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  color: red; /* Set text color to red */
  font-size: 20px; /* Set font size to 24 pixels */
  animation: ${scrollAnimation} 10s linear infinite;
  position: absolute; /* Set position to absolute */
  top: 35px; /* Adjust top value to your desired position */
  left: 20; /* Adjust left value to your desired position */

`;

const CardContainer = styled.div`
  width: 300px; /* Set the width of the card */
  overflow: hidden;
`;


const ThemeNavbar = props => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props
  const location = useLocation();
  const dispatch = useDispatch();
  const [activeRoute, setActiveRoute] = useState('');
  const [Today, setToday] = useState()

  

  useEffect(() => {
    const hotelIDData = JSON.stringify({
      hotelID: 1
    })
    fetchx(API_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelIDData
    }).then((res) => res.json())
      .then(postres => {
        //console.log(postres)
        if (postres.statusCode === 401) {
          dispatch(handleLogout())
        }
        else {
          const today = new Date(postres['data'][0]['businessDate']);
          const tomorrow = new Date(today);

          tomorrow.setDate(today.getDate() + 1);
          let formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: '2-digit', year: 'numeric' });
          setToday(formattedDate);

        }
      })
  }, [location]);


  const keyframes = `
      @keyframes marquee {
        % {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }
    `;


  return (
    <Fragment>
      <div className='bookmark-wrapper d-flex align-items-center' >

        <NavbarBookmarks setMenuVisibility={setMenuVisibility} />
        {/* <h4>NSOFT AMI Dashboard</h4> */}
        <h2 style={{ color: 'blue' }}>
          {/* <p> */}

          {Today}
          {/* </p> */}
        </h2>

        {/* {nightAuditRunning && <RunningMessage>Warning!! - Night Audit is currently running. Please wait until it's finished...</RunningMessage>} */}

      </div>
      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  )
}

export default ThemeNavbar
