// ** Icons Import
import { Mail, MessageSquare, Circle, Calendar, FileText, ShoppingCart, User, Shield, PlusCircle } from 'react-feather'

export default [
  {
    header: 'Configuration Pages'
  },


  {
    id: 'configuration',
    title: 'PMS Configuration',
    icon: <PlusCircle size={20} />,
    navLink: '/apps/configuration',
    children: [
      {
        id: 'hotelDetails',
        title: 'Hotel Details',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/hotelDetails'
      },
      {
        id: 'roomClass',
        title: 'Room Class',
        icon: <Circle size={12} />,
        navLink: '/apps/roomClass'
      },
      {
        id: 'WeekendPricing',
        title: 'Weekend',
        icon: <Circle size={12} />,
        navLink: '/apps/WeekendPricing'
      },
      {
        id: 'roomType',
        title: 'Room Type',
        icon: <Circle size={12} />,
        navLink: '/apps/configuration/roomType'
      },
      {
        id: 'industry',
        title: 'Industry',
        icon: <Circle size={12} />,
        navLink: '/apps/configuration/industry'
      },
      {
        id: 'roomStatus',
        title: 'Room Management',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/roomStatus'
      },
      {
        id: 'package',
        title: 'Package',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/package'
      },
      {
        id: 'transactionCode',
        title: 'Transaction Code',
        icon: <Circle size={12} />,
        navLink: '/apps/configuration/transactionCode'
      },
      {
        id: 'rateCode',
        title: 'Rate Code',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/rateCode'
      },

      {
        id: 'group',
        title: 'Revenue Group',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/group'
      },
      {
        id: 'subGroup',
        title: 'Sub Group',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/subGroup'
      },
      {
        id: 'rateCategory',
        title: 'Rate Category',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/rateCategory'
      },
      {
        id: 'tax',
        title: 'Tax ',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/tax'
      },
      {
        id: 'marketGroup',
        title: 'Market Group',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/marketGroup'
      },
      {
        id: 'marketCode',
        title: 'Market Code',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/marketCode'
      },
      {
        id: 'membershipType',
        title: 'Membership Type ',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/membershipType'
      },
      {
        id: 'membershipLevel',
        title: 'Membership Level ',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/membershipLevel'
      },
      {
        id: 'sourceGroup',
        title: 'Source Group',
        icon: <Circle size={12} />,
        navLink: '/apps/configuration/sourceGroup'
      },
      {
        id: 'sourceCode',
        title: 'Source Code',
        icon: <Circle size={12} />,
        navLink: '/apps/configuration/sourceCode'
      },
      // Nidhi Code
      {
        id: 'booker',
        title: 'Booker',
        icon: <Shield size={12} />,
        navLink: '/apps/configuration/booker'
      },
      {
        id: 'block',
        title: 'Block',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/block'
      },
      {
        id: 'floor',
        title: 'Floor',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/floor'
      },
      {
        id: 'rateClass',
        title: 'Rate Class',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/rateClass'
      },
      {
        id: 'preferencegrp',
        title: 'Preferences Group',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/preferenceGroup'
      },
      {
        id: 'specials',
        title: 'Guest Preferences',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/specials'
      },
      {
        id: 'users',
        title: 'Users',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/users'
      },
      {
        id: 'vip',
        title: 'VIP level',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/vip'
      },
      {
        id: 'extras',
        title: 'Extras ',
        icon: <Circle size={12} />,
        navLink: '/apps/configuration/extras'
      },
      {
        id: 'reason',
        title: 'Reason Code',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/reason'
      },
      {
        id: 'reason',
        title: 'Reason Group',
        icon: <Circle size={20} />,
        navLink: '/apps/configuration/reasonGroup'
      },
      {
        id: 'origin',
        title: 'Origin ',
        icon: <Circle size={12} />,
        navLink: '/apps/configuration/origin'
      },
      {
        id: 'reservationType',
        title: 'Reservation Type',
        icon: <Circle size={12} />,
        navLink: '/apps/configuration/reservationType'
      },
    ]
  },



  {
    id: 'posconfiguration',
    title: 'POS Configuration',
    icon: <PlusCircle size={20} />,
    navLink: '/apps/posconfiguration',
    children: [

      {
        id: 'CreateRestaurant',
        title: 'Create Restaurant',
        icon: <Circle size={12} />,
        navLink: '/apps/posconfiguration/CreateRestaurant'
      },
      {
        id: 'posTableMapping',
        title: 'Steward-Table Mapping',
        icon: <Circle size={12} />,
        navLink: '/apps/posconfiguration/POSTableMapping'
      },
      {
        id: 'addStore',
        title: 'Add Store',
        icon: <Circle size={12} />,
        navLink: '/apps/posconfiguration/AddStore'
      },
      {
        id: 'addTable',
        title: 'Add Table',
        icon: <Circle size={12} />,
        navLink: '/apps/posconfiguration/AddTable'
      },
      {
        id: 'AddTempMenu',
        title: 'Updated Menu Items',
        icon: <Circle size={12} />,
        navLink: '/apps/posconfiguration/AddTempMenuItem'
      },
      {
        id: 'UpdateMenu',
        title: 'Update Menu',
        icon: <Circle size={12} />,
        navLink: '/apps/posconfiguration/UpdateMenu'
      },
      {
        id: 'menuItems',
        title: 'Menu Items',
        icon: <Circle size={12} />,
        navLink: '/apps/posconfiguration/menuItems'
      },
      {
        id: 'menuGroups',
        title: 'Menu Groups',
        icon: <Circle size={12} />,
        navLink: '/apps/posconfiguration/menuGroups'
      },
      {
        id: 'MenuHeader',
        title: 'Menu Header',
        icon: <Circle size={12} />,
        navLink: '/apps/posconfiguration/MenuHeader'
      },
      {
        id: 'KOTIPDetails',
        title: 'KOT IP Details',
        icon: <Circle size={12} />,
        navLink: '/apps/posconfiguration/KOTIPDetails'
      },
      {
        id: 'Sessions',
        title: 'Sessions',
        icon: <Circle size={12} />,
        navLink: '/apps/posconfiguration/Sessions'
      },
      {
        id: 'Orders',
        title: 'All Orders',
        icon: <Circle size={12} />,
        navLink: '/apps/Orders'
      },
    ]
  },


  {
    id: 'ezee configuration',
    title: 'EZEE Mapping',
    icon: <PlusCircle size={20} />,
    children: [
      {
        id: 'hotelDetails',
        title: 'Hotel Mapping',
        icon: <Circle size={20} />,
        navLink: '/apps/ezeemapping/hotelmapping'
      },
      {
        id: 'packageDetails',
        title: 'Package Mapping',
        icon: <Circle size={20} />,
        navLink: '/apps/ezeemapping/packagemapping'
      },
      {
        id: 'roomTypeDetails',
        title: 'RoomType Mapping',
        icon: <Circle size={20} />,
        navLink: '/apps/ezeemapping/roomtypemapping'
      },
    ]
  },


  {
    id: 'guestProfile',
    title: 'Guest Details',
    icon: <PlusCircle size={20} />,
    navLink: '/apps/guestProfile'
  },


  {
    id: 'companyProfile',
    title: 'Company Profile',
    icon: <PlusCircle size={20} />,
    children: [
      {
        id: 'companyProfile',
        title: 'All Companies',
        icon: <Circle size={20} />,
        navLink: '/apps/companyProfile'
      },
      {
        id: 'companyProfile2',
        title: 'New Companies',
        icon: <Circle size={20} />,
        navLink: '/apps/unmappedcompanies'
      },
      {
        id: 'Account Group Map',
        title: 'Company Groups',
        icon: <Circle size={10} />,
        navLink: '/dashboard/accountmap'
      },
    ]
  },
  // Upload configuration
  // {
  //   id: 'uploadConfiguration',
  //   title: 'UploadConfiguration',
  //   icon: <PlusCircle size={20} />,
  //   navLink: '/apps/uploadConfiguration',
  //   children: [
  //     {
  //       id: 'hotelDetails',
  //       title: 'Hotel Details',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/hotelDetails'
  //     }, 
  //     {
  //       id: 'block',
  //     title: 'Block',
  //     icon: <Circle size={20} />,
  //     navLink: '/apps/uploadConfiguration/block'
  //     }, 

  //     {
  //       id: 'floor',
  //     title: 'Floor',
  //     icon: <Circle size={20} />,
  //     navLink: '/apps/uploadConfiguration/floor'
  //     }, 
  //     {
  //       id: 'roomClass',
  //       title: 'Room Class',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/roomClass'
  //     },
  //     {
  //       id: 'roomType',
  //       title: 'Room Type',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/roomType'
  //     },
  //     {
  //       id: 'roomStatus',
  //     title: 'Room Management',
  //     icon: <Circle size={20} />,
  //     navLink: '/apps/uploadConfiguration/roomStatus'
  //     }, 
  //     {
  //       id: 'group',
  //       title: 'Revenue Group',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/group'
  //     },   
  //     {
  //       id: 'subGroup',
  //       title: 'Sub Group',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/subGroup'
  //     },
  //     {
  //       id: 'tax',
  //       title: 'Tax ',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/tax'
  //     },
  //     {
  //       id: 'transactionCode',
  //       title: 'Transaction Code',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/transactionCode'
  //     },
  //     {
  //       id: 'rateCategory',
  //       title: 'Rate Category',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/rateCategory'
  //     },
  //     {
  //       id: 'extras',
  //       title: 'Extras ',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/extras'
  //     },
  //     {
  //       id: 'marketGroup',
  //       title: 'Market Group',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/marketGroup'
  //     }, 
  //     {
  //       id: 'marketCode',
  //       title: 'Market Code',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/marketCode'
  //     },
  //     {
  //       id: 'sourceGroup',
  //       title: 'Source Group',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/sourceGroup'
  //     },
  //     {
  //       id: 'sourceCode',
  //       title: 'Source Code',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/sourceCode'
  //     },
  //     {
  //       id: 'package',
  //       title: 'Package',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/package'
  //     }, 
  //     {
  //       id: 'rateCode',
  //       title: 'Rate Code',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/rateCode'
  //     },
  //     {
  //       id: 'reason',
  //       title: 'Reason Group',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/reasonGroup'
  //     }, 
  //     {
  //       id: 'reason',
  //       title: 'Reason Code',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/reason'
  //     },
  //          {
  //       id: 'membershipType',
  //       title: 'Membership Type ',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/membershipType'
  //     }, 
  //     {
  //       id: 'membershipLevel',
  //       title: 'Membership Level ',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/membershipLevel'
  //     },   

  //     // Nidhi Code
  //     {
  //       id: 'booker',
  //       title: 'Booker',
  //       icon: <Shield size={12} />,
  //       navLink: '/apps/uploadConfiguration/booker'
  //     },

  //     {
  //       id: 'rateClass',
  //       title: 'Rate Class',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/rateClass'
  //     },
  //     {
  //       id: 'preferencegrp',
  //       title: 'Preferences Group',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/preferenceGroup'
  //     },
  //     {
  //       id: 'specials',
  //       title: 'Guest Preferences',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/specials'
  //     },
  //     {
  //       id: 'users',
  //       title: 'Users',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/users'
  //     },
  //     {
  //       id: 'vip',
  //       title: 'VIP level',
  //       icon: <Circle size={20} />,
  //       navLink: '/apps/uploadConfiguration/vip'
  //     },   
  //     {
  //       id: 'origin',
  //       title: 'Origin ',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/origin'
  //     },
  //     {
  //       id: 'reservationType',
  //       title: 'Reservation Type',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/reservationType'
  //     },
  //     {
  //       id: 'transportType',
  //       title: 'Transport Type',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/transportType'
  //     },
  //     {
  //       id: 'paymentType',
  //       title: 'Payment Type',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/paymentType'
  //     },
  //     {
  //       id: 'addStore',
  //       title: 'Add Store',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/AddStore'
  //     },
  //     {
  //       id: 'Sessions',
  //       title: 'Sessions',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/Sessions'
  //     },
  //     {
  //       id: 'KOTIPDetails',
  //       title: 'KOT IP Details',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/KOTIPDetails'
  //     },
  //     {
  //       id: 'MenuHeader',
  //       title: 'Menu Header',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/MenuHeader'
  //     },
  //     {
  //       id: 'menuGroups',
  //       title: 'Menu Groups',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/menuGroups'
  //     },
  //     {
  //       id: 'menuItems',
  //       title: 'Menu Items',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/menuItems'
  //     },
  //    {
  //       id: 'AddTempMenu',
  //       title: 'Updated Menu Items',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/AddTempMenuItem'
  //     },
  //     {
  //       id: 'UpdateMenu',
  //       title: 'Update Menu',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/uploadConfiguration/UpdateMenu'
  //     },    
  //     {
  //       id: 'Orders',
  //       title: 'All Orders',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/Orders'
  //     },
  //   ]
  // },

  {
    id: 'UserManagement',
    title: 'User Management',
    icon: <User size={12} />,
    navLink: '/configuration/usermanagement'
  },
  {
    header: 'POS PAGES'
  },
  {
    id: 'banquet',
    title: 'Banquet Enquiry',
    icon: <Circle size={12} />,
    navLink: '/dashboard/banquet'
  },
  // {
  //   id: 'restaurantBanquet',
  //   title: 'Res Banquet Enquiry', 
  //   icon: <Circle size={12} />,
  //   navLink: '/dashboard/restaurantBanquet'
  // },
  {
    id: 'Steward',
    title: 'POS Users',
    icon: <Shield size={12} />,
    navLink: '/apps/Steward'
  },
  {
    id: 'POSBills',
    title: 'POS Bills',
    icon: <Shield size={12} />,
    navLink: '/apps/POSBills'
  },
  {
    id: 'AllPOSBills',
    title: 'All POS Bills',
    icon: <Shield size={12} />,
    navLink: '/apps/AllPOSBills'
  },
  {
    id: 'orders',
    title: 'ORDERS',
    icon: <Shield size={12} />,
    navLink: '/apps/KOTOrders'
  },
  {
    id: 'whatsappChatbotService',
    title: 'Whatsapp Service Requests',
    icon: <Shield size={12} />,
    navLink: '/apps/WhatsappRequests'
  },
  {
    id: 'POSInhouseGuest',
    title: 'Guest',
    icon: <Shield size={12} />,
    navLink: '/apps/POSInhouseGuest'
  },

  {
    id: 'posui',
    title: 'POS UI',
    icon: <Shield size={12} />,
    navLink: '/apps/POSQRUI'
  },
  {
    id: 'posloginui',
    title: 'POS QR LOGIN',
    icon: <Shield size={12} />,
    navLink: '/apps/POSQRlogin'
  },
  {
    id: 'customernIRDorders',
    title: 'Customers and Steward Orders',
    icon: <Circle size={12} />,
    navLink: '/apps/PendingCutomernIRDOrders'
  },
  {
    id: 'poslogoutui',
    title: 'POS QR LOGOUT',
    icon: <Circle size={12} />,
    navLink: '/apps/POSQRlogout'
  },

  {
    id: 'posloyal',
    title: 'POS Loyalty',
    icon: <Circle size={12} />,
    badge: 'light-warning',
    badgeText: '',
    children: [
      {
        id: 'newMembership',
        title: 'Create Mem.',
        icon: <Circle size={12} />,
        navLink: '/dashboard/newMembership'
      },
      {
        id: 'posloyalty',
        title: 'Mem. & Voucher',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posloyalty'
      },
      {
        id: 'posvoucher',
        title: 'Promo. Voucher',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posvoucher'
      },
    ]
  },

]
