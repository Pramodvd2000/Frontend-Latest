// // // import { Outlet } from 'react-router-dom';
// // // import Layout from '@layouts/VerticalLayout';
// // // import { useEffect, useState } from 'react';
// // // import navigation from '@src/navigation/vertical';
// // // import DASHBOARD_URL from '../dashboard'
// // // import API_URL from '../config'

// // // import { useNavigate } from "react-router-dom"
// // // import { useDispatch } from 'react-redux';
// // // import { handleLogout } from '@store/authentication';

// // // const VerticalLayout = (props) => {
// // //   const navigate = useNavigate()
// // //   const [menuData, setMenuData] = useState(navigation); // Initialize with default navigation data
// // //   const idsToFind = ['GM Dashboard', 'Reports', 'POS Reports']; // Replace these with actual ids
// // //   const POSIDs = ['POS', 'Steward', 'POSBills', 'AllPOSBills', 'orders', 'POSInhouseGuest', 'POS Reports'];
// // //   const updatedMenuData = [];
// // //   const idsToFindForLevel4 = ['Reports', 'POS Reports'];
// // //   const dispatch = useDispatch();


// // //       // Function to get cookie value by name
// // //       // const getCookie = (name) => {
// // //       //   const cookieString = document.cookie
// // //       //     .split('; ')
// // //       //     .find(row => row.startsWith(name + '='));
// // //       //   return cookieString ? cookieString.split('=')[1] : null;
// // //       // };



// // //   useEffect(() => {

// // //         // // 🔹 Check if session token is expired before making API call
// // //         // const authToken = getCookie('authToken'); // Replace with your actual cookie name
// // //         // const expiryTime = getCookie('expiryTime'); // Assuming expiry time is also stored in cookies

// // //         // console.log("authToken",authToken)
// // //         //  console.log("expiryTime",expiryTime)
// // //         // if (!authToken || (expiryTime && new Date(expiryTime) < new Date())) {
// // //         //   console.warn("Session expired. Redirecting to login.");
// // //         //   dispatch(handleLogout());
// // //         //   navigate('/login');
// // //         //   return;
// // //         // }



// // //     const hotelIDData = JSON.stringify({
// // //       hotelID: 1
// // //     });
// // //     fetch(API_URL + "/getBusinessDate", {
// // //       method: "POST",
// // //       headers: { 'Content-Type': 'application/json' },
// // //       body: hotelIDData
// // //     })
// // //     .then((res) => res.json())
// // //     .then(resp => {
// // //       if (resp.userrole === 2) {
// // //         idsToFind.forEach(id => {
// // //           const foundItem = navigation.find(item => item.id === id);
// // //           if (foundItem) {
// // //             updatedMenuData.push(foundItem);
// // //           }
// // //         });
// // //         setMenuData(updatedMenuData); 
// // //       }
// // //       else if(resp.userrole === 3){
// // //         POSIDs.forEach(id => {
// // //           const foundItem = navigation.find(item => item.id === id);
// // //           if (foundItem) {
// // //             updatedMenuData.push(foundItem);
// // //           }
// // //         });
// // //         setMenuData(updatedMenuData);
// // //       } 
// // //       else if (resp.userrole === 4) {
// // //         idsToFindForLevel4.forEach(id => {
// // //           const foundItem = navigation.find(item => item.id === id);
// // //           if (foundItem) {
// // //             updatedMenuData.push(foundItem);
// // //           }
// // //         });

// // //         setMenuData(updatedMenuData); 
// // //         navigate('/dashboard/FlashReport');
// // //       } 
// // //       else {
// // //         let filteredNavigation = navigation.filter(item => item.id !== 'GM Dashboard');
// // //         console.log(resp.data[0].id)
// // //         if (resp.data[0].id !== 10) {
// // //           filteredNavigation = filteredNavigation.filter(item => item.id !== 'Group Reservation');
// // //         } 
// // //         setMenuData(filteredNavigation);
// // //       }
// // //     })
// // //     .catch((error) => {
// // //       console.error('Error fetching data:', error);
// // //     });
// // //   }, []); // Empty dependency array to run this effect only once on component mount


// // //   return (
// // //     <Layout menuData={menuData} {...props}>
// // //       <Outlet />
// // //     </Layout>
// // //   );
// // // };

// // // export default VerticalLayout;


// // import { Outlet, useNavigate } from 'react-router-dom';
// // import Layout from '@layouts/VerticalLayout';
// // import { useEffect, useState } from 'react';
// // import navigation from '@src/navigation/vertical';
// // import API_URL from '../config';
// // import { useDispatch } from 'react-redux';
// // import { handleLogout } from '@store/authentication';

// // const VerticalLayout = (props) => {
// //   const navigate = useNavigate();
// //   const [menuData, setMenuData] = useState(navigation); // Default navigation data
// //   const dispatch = useDispatch();
// // console.log(navigation)
// //   useEffect(() => {
// //     const hotelIDData = JSON.stringify({ hotelID: 1 });

// //     fetch(API_URL + "/getBusinessDate", {
// //       method: "POST",
// //       headers: { 'Content-Type': 'application/json' },
// //       body: hotelIDData
// //     })
// //       .then((res) => res.json())
// //       .then(resp => {
// //         let updatedMenuData = [];

// //         if (resp.userrole === 2) {
// //           updatedMenuData = navigation.filter(item => ['GM Dashboard', 'Reports', 'POS Reports'].includes(item.id));
// //         } else if (resp.userrole === 3) {
// //           updatedMenuData = navigation.filter(item => ['POS', 'Steward', 'POSBills', 'AllPOSBills', 'orders', 'POSInhouseGuest', 'POS Reports'].includes(item.id));
// //         } else if (resp.userrole === 4) {
// //           updatedMenuData = navigation.filter(item => ['Reports', 'POS Reports'].includes(item.id));
// //           navigate('/dashboard/FlashReport');
// //         } else {
// //           updatedMenuData = navigation.filter(item => item.id !== 'GM Dashboard');
// //           if (resp.data[0].id !== 10) {
// //             updatedMenuData = updatedMenuData.filter(item => item.id !== 'Group Reservation');
// //           }
// //           if (resp.data[0].id !== 10) {
// //             updatedMenuData = updatedMenuData.filter(item => item.id !== 'dynamicPrising');
// //           }
// //         }

// //         setMenuData(updatedMenuData);

// //         // Navigate to the first available menu item
// //         if (updatedMenuData.length > 0) {
// //           const firstMenuItem = updatedMenuData[0];

// //           if (firstMenuItem.children && firstMenuItem.children.length > 0) {
// //             console.log(firstMenuItem.children[0])
// //             navigate(firstMenuItem.children[0].navLink || '/dashboard'); // Navigate to first child
// //           } else {
// //             console.log(firstMenuItem.navLink)

// //             navigate(firstMenuItem.navLink || '/dashboard'); // Navigate to first item's navLink
// //           }


// //           console.log(updatedMenuData[0] ,'/dashboard')
// //           navigate(updatedMenuData[0] || '/dashboard');
// //         }
// //       })
// //       .catch((error) => {
// //         console.error('Error fetching data:', error);
// //       });
// //   }, []); // Run once on mount

// //   return (
// //     <Layout menuData={menuData} {...props}>
// //       <Outlet />
// //     </Layout>
// //   );
// // };

// // export default VerticalLayout;



// import { Outlet } from 'react-router-dom';
// import Layout from '@layouts/VerticalLayout';
// import { useEffect, useState } from 'react';
// import navigation from '@src/navigation/vertical';
// import DASHBOARD_URL from '../dashboard'
// import API_URL from '../config'

// import { useNavigate } from "react-router-dom"
// import { useDispatch } from 'react-redux';
// import { handleLogout } from '@store/authentication';

// const VerticalLayout = (props) => {
//   const navigate = useNavigate()
//   const [menuData, setMenuData] = useState(navigation); // Initialize with default navigation data
//   const idsToFind = ['GM Dashboard', 'Reports', 'POS Reports']; // Replace these with actual ids
//   const POSIDs = ['POS', 'Steward', 'POSBills', 'AllPOSBills', 'orders', 'POSInhouseGuest', 'POS Reports'];
//   const updatedMenuData = [];
//   const idsToFindForLevel4 = ['Reports', 'POS Reports'];
//   const dispatch = useDispatch();


//   // Function to get cookie value by name
//   // const getCookie = (name) => {
//   //   const cookieString = document.cookie
//   //     .split('; ')
//   //     .find(row => row.startsWith(name + '='));
//   //   return cookieString ? cookieString.split('=')[1] : null;
//   // };



//   useEffect(() => {

//     // // 🔹 Check if session token is expired before making API call
//     // const authToken = getCookie('authToken'); // Replace with your actual cookie name
//     // const expiryTime = getCookie('expiryTime'); // Assuming expiry time is also stored in cookies

//     // console.log("authToken",authToken)
//     //  console.log("expiryTime",expiryTime)
//     // if (!authToken || (expiryTime && new Date(expiryTime) < new Date())) {
//     //   console.warn("Session expired. Redirecting to login.");
//     //   dispatch(handleLogout());
//     //   navigate('/login');
//     //   return;
//     // }

//     function filterNavItems(items) {
//       return items
//         .filter(item => item.id !== 'dynamicPrising')
//         .map(item => ({
//           ...item,
//           children: item.children ? filterNavItems(item.children) : undefined
//         }));
//     }

//     const hotelIDData = JSON.stringify({
//       hotelID: 1
//     });
//     fetch(API_URL + "/getBusinessDate", {
//       method: "POST",
//       headers: { 'Content-Type': 'application/json' },
//       body: hotelIDData
//     })
//       .then((res) => res.json())
//       .then(resp => {
//         if (resp.userrole === 2) {
//           idsToFind.forEach(id => {
//             const foundItem = navigation.find(item => item.id === id);
//             if (foundItem) {
//               updatedMenuData.push(foundItem);
//             }
//           });
//           setMenuData(updatedMenuData);
//         }
//         else if (resp.userrole === 3) {
//           POSIDs.forEach(id => {
//             const foundItem = navigation.find(item => item.id === id);
//             if (foundItem) {
//               updatedMenuData.push(foundItem);
//             }
//           });
//           setMenuData(updatedMenuData);
//         }
//         else if (resp.userrole === 4) {
//           idsToFindForLevel4.forEach(id => {
//             const foundItem = navigation.find(item => item.id === id);
//             if (foundItem) {
//               updatedMenuData.push(foundItem);
//             }
//           });

//           setMenuData(updatedMenuData);
//           navigate('/dashboard/FlashReport');
//         }
//         else {
//           let filteredNavigation = navigation.filter(item => item.id !== 'GM Dashboard');
//           console.log(resp.data[0].id)
//           if (resp.data[0].id !== 10) {
//             filteredNavigation = filteredNavigation.filter(item => item.id !== 'Group Reservation');
//             filteredNavigation = filterNavItems(filteredNavigation);
//           }

//           if (resp.data[0].isAutoNIghtAudit !== 1) {
//             filteredNavigation = filteredNavigation.map(item => {
//               if (item.id === 'nightAudit') {
//                 return {
//                   ...item,
//                   children: item.children.filter(child => child.id !== 'autoNightAudit')  // remove Day Close
//                 };
//               }
//               return item;
//             });

//             filteredNavigation = filterNavItems(filteredNavigation);
//           }


//           setMenuData(filteredNavigation);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//       });
//   }, []); // Empty dependency array to run this effect only once on component mount


//   return (
//     <Layout menuData={menuData} {...props}>
//       <Outlet />
//     </Layout>
//   );
// };

// export default VerticalLayout;



import { Outlet } from 'react-router-dom';
import Layout from '@layouts/VerticalLayout';
import { useEffect, useState } from 'react';
import navigation from '@src/navigation/vertical';
import DASHBOARD_URL from '../dashboard'
import API_URL from '../config'

import { useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux';
import { handleLogout } from '@store/authentication';

const VerticalLayout = (props) => {
  const navigate = useNavigate()
  const [menuData, setMenuData] = useState(navigation); // Initialize with default navigation data
  const idsToFind = ['GM Dashboard', 'Reports', 'POS Reports']; // Replace these with actual ids
  const POSIDs = ['POS', 'Steward', 'POSBills', 'AllPOSBills', 'orders', 'POSInhouseGuest', 'POS Reports'];
  const updatedMenuData = [];
  const idsToFindForLevel4 = ['Reports', 'POS Reports'];
  const dispatch = useDispatch();


      // Function to get cookie value by name
      // const getCookie = (name) => {
      //   const cookieString = document.cookie
      //     .split('; ')
      //     .find(row => row.startsWith(name + '='));
      //   return cookieString ? cookieString.split('=')[1] : null;
      // };
  
      

  useEffect(() => {

        // // 🔹 Check if session token is expired before making API call
        // const authToken = getCookie('authToken'); // Replace with your actual cookie name
        // const expiryTime = getCookie('expiryTime'); // Assuming expiry time is also stored in cookies
 
        // console.log("authToken",authToken)
        //  console.log("expiryTime",expiryTime)
        // if (!authToken || (expiryTime && new Date(expiryTime) < new Date())) {
        //   console.warn("Session expired. Redirecting to login.");
        //   dispatch(handleLogout());
        //   navigate('/login');
        //   return;
        // }

       function filterNavItems(items, hotelID) {
      console.log(items)
      console.log("filterNavItems called", items)
      return items
     
        .filter(item => {
          // Remove only if hotelID is NOT 10
          if (hotelID !== 10 && item.id === 'dynamicPrising') return false;
          return true;
        })
        .map(item => {
          const filteredChildren = item.children ? filterNavItems(item.children, hotelID) : [];

          return filteredChildren.length > 0
            ? { ...item, children: filteredChildren }
            : { ...item };
        });
    }

    const hotelIDData = JSON.stringify({
      hotelID: 1
    });
    fetch(API_URL + "/getBusinessDate", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: hotelIDData
    })
    .then((res) => res.json())
    .then(resp => {
      if (resp.userrole === 2) {
        idsToFind.forEach(id => {
          const foundItem = navigation.find(item => item.id === id);
          if (foundItem) {
            updatedMenuData.push(foundItem);
          }
        });
        setMenuData(updatedMenuData); 
      }
      else if(resp.userrole === 3){
        POSIDs.forEach(id => {
          const foundItem = navigation.find(item => item.id === id);
          if (foundItem) {
            updatedMenuData.push(foundItem);
          }
        });
        setMenuData(updatedMenuData);
      } 
      else if (resp.userrole === 4) {
        idsToFindForLevel4.forEach(id => {
          const foundItem = navigation.find(item => item.id === id);
          if (foundItem) {
            updatedMenuData.push(foundItem);
          }
        });
    
        setMenuData(updatedMenuData); 
        navigate('/dashboard/FlashReport');
      } 
      else {
        let filteredNavigation = navigation.filter(item => item.id !== 'GM Dashboard');
        console.log(resp.data[0].id)
        if (resp.data[0].id !== 10 || resp.data[0].id !== 14) {
          filteredNavigation = filteredNavigation.filter(item => item.id !== 'Group Reservation');
            filteredNavigation = filterNavItems(filteredNavigation, resp.data[0].id)


        } 

        if (resp.data[0].isAutoNIghtAudit !== 1) {
          filteredNavigation = filteredNavigation.map(item => {
            if (item.id === 'nightAudit') {
              return {
                ...item,
                children: item.children.filter(child => child.id !== 'autoNightAudit')  // remove Day Close
              };
            }
            return item;
          });

            filteredNavigation = filterNavItems(filteredNavigation, resp.data[0].id);
        }
        
        setMenuData(filteredNavigation);
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []); // Empty dependency array to run this effect only once on component mount


  return (
    <Layout menuData={menuData} {...props}>
      <Outlet />
    </Layout>
  );
};

export default VerticalLayout;
