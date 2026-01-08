// // ** Router imports
// import { lazy } from 'react'

// // ** Router imports
// import { useRoutes, Navigate } from 'react-router-dom'

// // ** Layouts
// import BlankLayout from '@layouts/BlankLayout'

// // ** Hooks Imports
// import { useLayout } from '@hooks/useLayout'

// // ** Utils
// import { getUserData, getHomeRouteForLoggedInUser } from '../utility/Utils'

// // ** GetRoutes
// import { getRoutes } from './routes'
// import { useNavigate } from "react-router-dom"
// import { useEffect } from 'react'

// // ** Components
// const Error = lazy(() => import('../views/pages/misc/Error'))
// const Login = lazy(() => import('../views/pages/authentication/Login'))
// const NotAuthorized = lazy(() => import('../views/pages/misc/NotAuthorized'))
// const POSQRlogin = lazy(() => import('../views/apps/POSQRlogin'));
// const POSQRUI = lazy(() => import('../views/apps/POSQRUI'));
// const POSQRlogout = lazy(() => import('../views/apps/POSQRlogout'));


// const Router = () => {
//   // ** Hooks
//   const { layout } = useLayout()

//   const navigate = useNavigate()

//   // useEffect(() => {
//   //   const checkSession = () => {
//   //     // Parse cookies into an object
//   //     const cookies = document.cookie.split("; ").reduce((acc, curr) => {
//   //       const [key, value] = curr.split("=")
//   //       acc[key] = value
//   //       return acc
//   //     }, {})

//   //     // Check if session_token exists
//   //     if (!cookies.session_token) {
//   //       navigate("/login")
//   //       return
//   //     }

//   //     // Attempt to parse the session data from the cookie
//   //     try {
//   //       // Decode the cookie value before parsing
//   //       const sessionData = JSON.parse(decodeURIComponent(cookies.session_token))
//   //       console.log(sessionData)
//   //       // If an expiry property exists and the current time exceeds it, redirect to login
//   //       if (sessionData.expiry && Date.now() > sessionData.expiry) {
//   //         navigate("/login")
//   //       }
//   //     } catch (error) {
//   //       // If parsing fails, navigate to login for safety
//   //       navigate("/login")
//   //     }
//   //   }

//   //   // Check every 5 seconds
//   //   const interval = setInterval(checkSession, 2000)

//   //   // Listen for changes in local storage (note: storage event fires only in other tabs)
//   //   const handleStorageChange = () => checkSession()
//   //   window.addEventListener("storage", handleStorageChange)

//   //   return () => {
//   //     clearInterval(interval)
//   //     window.removeEventListener("storage", handleStorageChange)
//   //   }
//   // }, [navigate])



//   const allRoutes = getRoutes(layout)
//   const getHomeRoute = () => {
//     const user = getUserData()
//     if (user) {
//       return getHomeRouteForLoggedInUser(user.role)
//     } else {
//       return '/login'
//     }
//   }

//   const routes = useRoutes([
//     {
//       path: '/',
//       index: true,
//       element: <Navigate replace to={getHomeRoute()} />
//     },
//     {
//       path: '/login',
//       element: <BlankLayout />,
//       children: [{ path: '/login', element: <Login /> }]
//     },
//     {
//       path: '/apps/POSQRlogin',
//       element: <BlankLayout />,
//       children: [{ path: '/apps/POSQRlogin', element: <POSQRlogin /> }],
//     },
//     {
//       path: '/apps/POSQRUI',
//       element: <BlankLayout />,
//       children: [{ path: '/apps/POSQRUI', element: <POSQRUI /> }],
//     },
//     {
//       path: '/apps/POSQRlogout',
//       element: <BlankLayout />,
//       children: [{ path: '/apps/POSQRlogout', element: <POSQRlogout /> }],
//     },
//     {
//       path: '/auth/not-auth',
//       element: <BlankLayout />,
//       children: [{ path: '/auth/not-auth', element: <NotAuthorized /> }]
//     },
//     {
//       path: '*',
//       element: <BlankLayout />,
//       children: [{ path: '*', element: <Error /> }]
//     },
//     ...allRoutes
//   ])

//   return routes
// }

// export default Router


// ** Router imports
import { lazy } from 'react'

// ** Router imports
import { useRoutes, Navigate } from 'react-router-dom'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'

// ** Hooks Imports
import { useLayout } from '@hooks/useLayout'

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from '../utility/Utils'

// ** GetRoutes
import { getRoutes } from './routes'
import { useNavigate } from "react-router-dom"
import { useEffect } from 'react'
// import useSessionCheck from "../router/useSessionCheck";

// ** Components
const Error = lazy(() => import('../views/pages/misc/Error'))
const Login = lazy(() => import('../views/pages/authentication/Login'))
const NotAuthorized = lazy(() => import('../views/pages/misc/NotAuthorized'))
const POSQRlogin = lazy(() => import('../views/apps/POSQRlogin'));
const POSQRUI = lazy(() => import('../views/apps/POSQRUI'));
const POSQRlogout = lazy(() => import('../views/apps/POSQRlogout'));


const Router = () => {
  // ** Hooks
  const { layout } = useLayout()

  const navigate = useNavigate()

  // useEffect(() => {
  //   const checkSession = () => {
  //     // Parse cookies into an object
  //     const cookies = document.cookie.split("; ").reduce((acc, curr) => {
  //       const [key, value] = curr.split("=")
  //       acc[key] = value
  //       return acc
  //     }, {})

  //     // Check if session_token exists
  //     if (!cookies.session_token) {
  //       navigate("/login")
  //       return
  //     }

  //     // Attempt to parse the session data from the cookie
  //     try {
  //       // Decode the cookie value before parsing
  //       const sessionData = JSON.parse(decodeURIComponent(cookies.session_token))
  //       console.log(sessionData)
  //       // If an expiry property exists and the current time exceeds it, redirect to login
  //       if (sessionData.expiry && Date.now() > sessionData.expiry) {
  //         navigate("/login")
  //       }
  //     } catch (error) {
  //       // If parsing fails, navigate to login for safety
  //       navigate("/login")
  //     }
  //   }

  //   // Check every 5 seconds
  //   const interval = setInterval(checkSession, 2000)

  //   // Listen for changes in local storage (note: storage event fires only in other tabs)
  //   const handleStorageChange = () => checkSession()
  //   window.addEventListener("storage", handleStorageChange)

  //   return () => {
  //     clearInterval(interval)
  //     window.removeEventListener("storage", handleStorageChange)
  //   }
  // }, [navigate])



  const allRoutes = getRoutes(layout)
  const getHomeRoute = () => {
    const user = getUserData()
    if (user) {
      return getHomeRouteForLoggedInUser(user.role)
    } else {
      return '/login'
    }
  }

  // const isAuthenticated = useSessionCheck();
  // console.log("isAuthenticated",isAuthenticated)
  
  const routes = useRoutes([
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
      // element: isAuthenticated ? <Navigate replace to={getHomeRoute()} /> : <Navigate replace to="/login" />,

    },
    {
      path: '/login',
      element: <BlankLayout />,
      children: [{ path: '/login', element: <Login /> }]
    },

    {
      path: '/apps/POSQRlogin',
      element: <BlankLayout />,
      children: [{ path: '/apps/POSQRlogin', element: <POSQRlogin /> }],
    },
    {
      path: '/apps/POSQRUI',
      element: <BlankLayout />,
      children: [{ path: '/apps/POSQRUI', element: <POSQRUI /> }],
    },
    {
      path: '/apps/POSQRlogout',
      element: <BlankLayout />,
      children: [{ path: '/apps/POSQRlogout', element: <POSQRlogout /> }],
    },
    {
      path: '/auth/not-auth',
      element: <BlankLayout />,
      children: [{ path: '/auth/not-auth', element: <NotAuthorized /> }]
    },
    {
      path: '*',
      element: <BlankLayout />,
      children: [{ path: '*', element: <Error /> }]
    },
    ...allRoutes
  ])

  return routes
}

export default Router