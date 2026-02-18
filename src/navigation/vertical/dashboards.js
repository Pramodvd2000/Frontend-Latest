// ** Icons Import
import { Home, Circle, Monitor, PieChart, Calendar, UserCheck, CreditCard, Menu, BarChart, DollarSign, User, CheckSquare, Twitch, PlusCircle, UserPlus } from 'react-feather'

export default [

  //Front desk Tab
  {
    id: 'testFrontDesk',
    title: 'Front Desk',
    icon: <UserCheck size={12} />,
    navLink: '/dashboard/frontdesk'
  },


  {
    id: 'GM Dashboard',
    title: 'GM Dashboard',
    icon: <Circle size={12} />,
    children: [
      {
        id: 'Dashboard',
        title: 'Dashboard',
        icon: <Circle size={12} />,
        navLink: '/MainDashboard'
      },
      {
        id: 'RestaurantPerformance',
        title: 'POS Dashboard',
        icon: <Monitor size={12} />,
        navLink: '/dashboard/RestaurantPerformance'
      },
      {
        id: 'Productivity Dashboard',
        title: 'Productivity',
        icon: <Circle size={12} />,
        navLink: '/ProductivityDashboard'
      },
      {
        id: 'RevenueComparison',
        title: 'Rev Comparison',
        icon: <Circle size={12} />,
        navLink: '/RevenueComparison'
      },
      {
        id: 'Guest Complaint',
        title: 'Guest Complaint',
        icon: <Circle size={12} />,
        navLink: '/dashboard/guestcomplaintdashboard'
      },
      {
        id: 'Guest Feedback',
        title: 'Guest Feedback',
        icon: <Circle size={12} />,
        navLink: '/dashboard/guestfeedback'
      },
      // {
      //   id: 'Meter',
      //   title: 'Meters Reading',
      //   icon: <Circle size={12} />,
      //   children: [
      //     {
      //       id: 'homePage',
      //       title: 'HomePage',
      //       icon: <Circle size={10} />,
      //       navLink: '/dashboard/meters/homePage'
      //     },
      //     {
      //       id: 'dashboard',
      //       title: 'Dashboard',
      //       icon: <Circle size={10} />,
      //       navLink: '/dashboard/meters/dashboard'
      //     },
      //     {
      //       id: 'energyMeters',
      //       title: 'Energy Meter',
      //       icon: <Circle size={10} />,
      //       navLink: '/dashboard/meters/energyMeters'
      //     },
      //     {
      //       id: 'waterMeters',
      //       title: 'Water Meter',
      //       icon: <Circle size={12} />,
      //       navLink: '/dashboard/meters/waterMeters'
      //     },
      //     {
      //       id: 'gasMeters',
      //       title: 'Gas Meter',
      //       icon: <Circle size={12} />,
      //       navLink: '/dashboard/meters/gasMeters'
      //     },
      //   ]
      // },
    ]
  },

  {
    id: 'houseUseDashboard',
    title: 'Dashboard',
    icon: <Monitor size={12} />,
    navLink: '/dashboard/houseUseDashboard'
  },
  {
    id: 'guestProfile1',
    title: 'Guest Details',
    icon: <UserPlus size={20} />,
    navLink: '/dashboard/guestProfile'
  },


  // {
  //   id: 'feedback',
  //   title: 'Feedback',
  //   icon: <Twitch size={12} />,
  //   navLink: '/dashboard/feedback'
  // },;

  {
    id: 'feedBackMain',
    title: 'Feedback',
    icon: <Twitch size={12} />,
    navLink: '/dashboard/feedback',
    children: [
      {
        id: 'feedback',
        title: 'Feedback',
        icon: <Twitch size={12} />,
        navLink: '/dashboard/feedback',
        exact: true
      },
      {
        id: 'feedbackDash',
        title: 'Feedback Dash',
        icon: <Twitch size={12} />,
        navLink: '/dashboard/DashboardFeedback',

      }
    ],
  },

  // Room Management Tab
  {
    id: 'roomManagement',
    title: 'Room Management',
    icon: <Circle size={12} />,
    navLink: '/dashboard/roomManagement',
    children: [
      {
        id: 'outOfService',
        title: 'OOO / OOS ',
        icon: <Circle size={12} />,
        navLink: '/dashboard/roomManagement/outOfService'
      },
      {
        id: 'roomStatus',
        title: 'Room Status',
        icon: <Circle size={12} />,
        navLink: '/dashboard/roomManagement/roomStatus'
      },
      {
        id: 'roomListView',
        title: 'Room status List',
        icon: <Circle size={12} />,
        navLink: '/dashboard/roomManagement/roomListView'
      },
      {
        id: 'housekeepinview',
        title: 'HK Status',
        icon: <Circle size={12} />,
        navLink: '/dashboard/roomManagement/housekeepingstatus'
      },
      {
        id: 'discrepancy',
        title: 'Discrepancy',
        icon: <Circle size={12} />,
        navLink: '/dashboard/roomManagement/discrepancy'
      },
      {
        id: 'roomStatusLogs',
        title: 'Room Logs',
        icon: <Circle size={12} />,
        navLink: '/dashboard/roomManagement/roomStatusLogs'
      },
      {
        id: 'lostandFound',
        title: 'Lost and Found',
        icon: <Circle size={12} />,
        navLink: '/dashboard/lostAndFoundItems'
      },
    ].sort((a, b) => a.title.localeCompare(b.title))
  },

  // Reservation Tab
  {
    id: 'Reservation',
    title: 'Reservation',
    icon: <CheckSquare size={12} />,
    children: [
      {
        id: 'reservation',
        title: 'Create Reservation',
        icon: <Circle size={10} />,
        navLink: '/dashboard/reservation'
      },
      // Roll over screen
      {
        id: 'Reservation',
        title: 'Roll Overs',
        icon: <Circle size={12} />,
        navLink: '/dashboard/rolloverreservation'
      },
      {
        id: 'ReservationLogs',
        title: 'Reservation Logs',
        icon: <Circle size={12} />,
        navLink: '/dashboard/modificationLog'
      },
    ]
  },

  {
    id: 'Group Reservation',
    title: 'Group Reservation',
    icon: <Circle size={12} />,
    children: [
      {
        id: 'groupreservation',
        title: 'Create Enquiry',
        icon: <Circle size={10} />,
        navLink: '/dashboard/groupreservation/createenquiry'
      },
      {
        id: 'groupreservation',
        title: 'All Reservations',
        icon: <Circle size={10} />,
        navLink: '/dashboard/groupreservation/allgroupreservations'
      },
    ]
  },

  // Inventory Tab
  {
    id: 'Inventory',
    title: 'Inventory',
    icon: <Calendar size={12} />,
    // navLink:
    children: [
      // {
      //   id: 'availabilityMatrix',
      //   title: 'Inventory',
      //   icon: <Circle size={12} />,
      //   navLink: '/dashboard/availabilityMatrix'
      // },
      {
        id: 'inventoryView',
        title: 'Inventory View',
        icon: <Circle size={12} />,
        navLink: '/dashboard/inventoryView'
      },
      {
        id: 'inventoryView',
        title: 'Inventory New',
        icon: <Circle size={12} />,
        navLink: '/dashboard/inventoryViewNew'
      },
      {
        id: 'sellControlRooms',
        title: 'INV & Sell CTRL',
        icon: <Circle size={12} />,
        navLink: '/dashboard/sellControlRooms'
      },
      {
        id: 'occupancy',
        title: 'Occupancy',
        icon: <Circle size={12} />,
        navLink: '/dashboard/occupancy'
      },
      {
        id: 'inventoryRates',
        title: 'Inventory Rates',
        icon: <Circle size={12} />,
        navLink: '/dashboard/inventoryRates'
      },
      {
        id: 'dynamicPrising',
        title: 'Dynamic Pricing',
        icon: <Circle size={12} />,
        navLink: '/dashboard/dynamicPricing'
      },
      {
        id: 'inventoryLedger',
        title: 'Inventory Ledger',
        icon: <Circle size={12} />,
        navLink: '/dashboard/inventoryLedger'
      },
    ].sort((a, b) => a.title.localeCompare(b.title))
  },


  //Billing Tab
  {
    id: 'BillingDetails',
    title: 'Billing Details',
    icon: <CreditCard size={12} />,
    children: [
      {
        id: 'Transactions',
        title: 'All Transactions',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Transactions'
      },
      {
        id: 'AllInvoices',
        title: ' All Invoices',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Invoices',
      },
      {
        id: 'BTCInvoices',
        title: ' BTC Invoices',
        icon: <Circle size={12} />,
        navLink: '/dashboard/BTCInvoices',
      },
      {
        id: 'InvoicesSummary',
        title: ' Invoices Summary',
        icon: <Circle size={12} />,
        navLink: '/dashboard/InvoicesSummary',
      },
      {
        id: 'AllPayments',
        title: ' All Payments',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Payments'
      },
      {
        id: 'AllPaidOuts',
        title: ' All PaidOuts',
        icon: <Circle size={12} />,
        navLink: '/dashboard/PaidOuts'
      },
      {
        id: 'OnHoldFolio',
        title: 'On Hold Folios',
        icon: <Circle size={12} />,
        navLink: '/dashboard/OnHoldFolio'
      },
      // Room posting 
      {
        id: 'roomPosting',
        title: 'Room Posting',
        icon: <Circle size={12} />,
        navLink: '/dashboard/roomPosting'
      },

      // Unsettled-bills
      {
        id: 'unSettledBills',
        title: 'Unsettled Bills',
        icon: <Circle size={12} />,
        navLink: '/dashboard/unSettledBills'
      },
    ].sort((a, b) => a.title.localeCompare(b.title))
  },


  //zoho books
  {
    id: 'zohobooks',
    title: 'Zoho Books',
    icon: <CreditCard size={12} />,
    children: [
      {
        id: 'BooksInvPosting',
        title: 'Invoice Posting',
        icon: <Circle size={12} />,
        navLink: '/dashboard/BooksInvPosting',
      },
      {
        id: 'BooksJVPosting',
        title: 'Journal Posting',
        icon: <Circle size={12} />,
        navLink: '/dashboard/BooksJVPosting',
      },
    ]
  },

  //Night audit 



  {
    id: 'nightAudit',
    title: 'Night Audit',
    icon: <CreditCard size={12} />,
    children: [
      {
        id: 'nightAudit',
        title: 'Night Audit',
        icon: <Circle size={12} />,
        navLink: '/dashboard/nightAudit'
      },
      {
        id: 'autoNightAudit',
        title: 'Day Close',
        icon: <Circle size={12} />,
        navLink: '/dashboard/autoNightAudit'
      },

      {
        id: 'nightAuditLogs',
        title: 'Night Audit Logs',
        icon: <Circle size={12} />,
        navLink: '/dashboard/nightAuditLogs'
      },
      {
        id: 'nightAuditCopy',
        title: 'Night Audit New',
        icon: <Circle size={12} />,
        navLink: '/dashboard/nightAuditCopy'
      },
    ]
  },

  
  {
    id: 'BookingEngineConfig',
    title: 'Booking Engine Config',
    icon: <CreditCard size={12} />,
    children: [
      {
        id: 'Room Type Wise Details',
        title: 'Room Type Wise Details',
        icon: <Circle size={12} />,
        navLink: '/dashboard/BookingEngineConfig/roomTypeWiseDetails'
      },
      {
        id: 'Room Ameneties',
        title: 'Room Ameneties',
        icon: <Circle size={12} />,
        navLink: '/dashboard/BookingEngineConfig/roomAmeneties'
      },

      {
        id: 'Room Details',
        title: 'Room Details',
        icon: <Circle size={12} />,
        navLink: '/dashboard/BookingEngineConfig/roomDetails'
      },
      {
        id: 'Room Type Images',
        title: 'Room Type Images',
        icon: <Circle size={12} />,
        navLink: '/dashboard/BookingEngineConfig/roomTypeImages'
      },
    ]
  },

  // Forex tab
  {
    id: 'Forex',
    title: 'Forex',
    icon: <DollarSign size={12} />,
    children: [
      {
        id: 'sell forex',
        title: 'Forex Details',
        icon: <Circle size={10} />,
        navLink: '/dashboard/forex/sellforex'
      },
      {
        id: 'daily forex',
        title: 'Daily Forex Rates',
        icon: <Circle size={10} />,
        navLink: '/dashboard/forex/dailyforex'
      },
    ].sort((a, b) => a.title.localeCompare(b.title))
  },

  {

    id: 'radiuswifiserver',
    title: 'Radius Wifi Server',
    icon: <Circle size={12} />,
    navLink: '/dashboard/radiuswifiserver'

  },

  // PMS Reports
  {
    id: 'Reports',
    title: 'PMS Reports',
    icon: <BarChart size={12} />,
    children: [
      {
        id: 'Reservation Stay Logs',
        title: 'Res. Stay Logs',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/reservationStayLogs'
      },
      {
        id: 'Flash Report',
        title: 'Flash Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/FlashReport'
      },
      {
        id: 'Group Transactions',
        title: 'Group Transactions ',
        icon: <Circle size={12} />,
        navLink: '/dashboard/GroupTransactions'
      },
      // {
      //   id: 'accountManagerWiseSaleReport',
      //   title: 'AccountManager Report',
      //   icon: <Circle size={12} />,
      //   navLink: '/dashboard/Reports/accountManagerWiseSaleReport'
      // },
      {
        id: 'earlydepartureReport',
        title: 'Early & Late Dep.',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/earlydepartureReport'
      },
      {
        id: 'Company Report',
        title: 'Companies Tracker',
        icon: <Circle size={12} />,
        navLink: '/dashboard/companytracker'
      },
      {
        id: 'CompanyWiseBills',
        title: 'Company Wise Bills',
        icon: <Circle size={12} />,
        navLink: '/dashboard/CompanyWiseBills'
      },
      {
        id: 'History Forecast Report',
        title: 'History Forecast ',
        icon: <Circle size={12} />,
        navLink: '/dashboard/HistoryForecast'
      },
      {
        id: 'ZOHO Book Posting',
        title: 'ZOHO Posting',
        icon: <Circle size={12} />,
        navLink: '/dashboard/ZOHOPosting'
      },
      {
        id: 'ZOHO Invoice',
        title: 'ZOHO Invoice',
        icon: <Circle size={12} />,
        navLink: '/dashboard/ZOHOInvoicePosting'
      },
      {
        id: 'Guest Ledger Report',
        title: 'Guest Ledger',
        icon: <Circle size={12} />,
        navLink: '/dashboard/GuestLedger'
      },
      {
        id: 'advance Settled Report',
        title: 'Advance Settled',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/advancesettledreport'
      },
      {
        id: 'Advance Received Report',
        title: 'Advance Received',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/advancereceivedreport'
      },
      {
        id: 'Plan Report',
        title: 'Plan Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/PlanReport'
      },
      {
        id: 'marketProductivity Report',
        title: 'Market Productivity',
        icon: <Circle size={12} />,
        navLink: '/dashboard/marketProductivityReport'
      },
      {
        id: 'source Productivity Report',
        title: 'Source Productivity',
        icon: <Circle size={12} />,
        navLink: '/dashboard/sourceProductivity'
      },
      {
        id: 'productivityBusinessAgent',
        title: 'Prod Business Agent',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/productivityBusinessAgent'
      },
      {
        id: 'ReservationWiseRevenue',
        title: 'Resv Wise Revenue',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/ReservationWiseRevenue'
      },
      {
        id: 'CompnayProductivityReport',
        title: 'CO. Productivity',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/CompanyProductivityReport'
      },
      {
        id: 'airportPickups',
        title: 'Airport PickUps',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/airportPickUps'
      },
      {
        id: 'airportDrops',
        title: 'Airport Drops',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/airportDrops'
      },
      {
        id: 'inhouseGuestBirthdays',
        title: 'Guest Birthday',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/inhouseGuestBirthdays'
      },
      {
        id: 'guestMembership',
        title: 'Guest Membership',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/guestMembership'
      },
      {
        id: 'Meal Plan Report',
        title: 'Meal Plan Revenue',
        icon: <Circle size={12} />,
        navLink: '/reports/mealplanreport'
      },
      {
        id: 'wakeUpCallReport',
        title: 'WakeUp Call',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/wakeUpCallReport'
      },
      {
        id: 'forexReport',
        title: 'Forex Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/forexReport'
      },
      {
        id: 'inhouseGuestReport',
        title: 'IHG VIP',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/inhouseguestvip'
      },
      {
        id: 'inhouseGuestAnniversary',
        title: 'IHG Anniversary',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/inhouseGuestAnniversary'
      },
      {
        id: 'inhouseGuestCompany',
        title: 'IHG Company',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/inhouseGuestCompany'
      },
      {
        id: 'inhouseGuestNationality',
        title: 'IHG Nationality',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/inhouseGuestNationality'
      },
      {
        id: 'pastGuestNationality',
        title: 'Guest Nationality',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/pastGuestNationality'
      },
      {
        id: 'inhouseGuestReport',
        title: 'IH Guest',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/inHouseGuest'
      },
      {
        id: 'settlementForDay',
        title: 'Settlement For Day',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/settlementForDay'
      },
      {
        id: 'inhouseGuestRoomReport',
        title: 'IH Guest Room',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/inHouseGuestRoom'
      },
      {
        id: 'cformReport',
        title: 'C Form Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/cformReport'
      },
      {
        id: 'arrivalReport',
        title: 'Arrivals Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/arrivalsReport'
      },
      {
        id: 'resCancellation Report',
        title: 'Resv Cancellation',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/ResCancellation'
      },
      {
        id: 'arrivalVipReport',
        title: 'VIP Arrivals',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/arrivalsVip'
      },
      {
        id: 'departurereport',
        title: 'Departure Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/departurereport'
      },
      {
        id: 'cancellation',
        title: 'Cancellation',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/cancellation'
      },
      {
        id: 'vaccantroomReport',
        title: 'Vaccant Room',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/vaccantRooms'
      },
      {
        id: 'guestBalanceReport',
        title: 'Guest Balance',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/guestBalanceReport'
      },
      {
        id: 'extraReport',
        title: 'Extra Bed Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/extraBed'
      },
      {
        id: 'allowance Report',
        title: 'Allowance Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/allowanceReport'
      },
      {
        id: 'trailBalance',
        title: 'Trail Balance',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/trailBalance'
      },
      {
        id: 'paidoutReport',
        title: 'Paidout Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/paidoutReport'
      },
      {
        id: 'fosettlementuser',
        title: 'FO settlement user',
        icon: <Circle size={12} />,

        navLink: '/dashboard/Reports/fosettlementuser'
      },
      {
        id: 'Revenue With Tax',
        title: 'Revenue With Tax',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/RevenueWithTax'
      },
      {
        id: 'reservationPickupReport',
        title: 'Res. Entry Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/reservationPickupReport'
      },
      {
        id: 'noshow Report',
        title: 'Noshow Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/noShow'
      },

      /////////////////////gouri///////////////////////////
      {
        id: 'longStayGuestReport',
        title: 'Long Stay Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/longStayGuestReport'
      },
      {
        id: 'houseUseGuestReport',
        title: 'Houseuse Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/houseUseGuestReport'
      },
      {
        id: 'fosettlementbillwise',
        title: 'FO settlement bill',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/fosettlementbillwise'
      },
      {
        id: 'cashsettlement',
        title: 'Cash settlement',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/cashsettlement'
      },

      {
        id: 'roomstatus',
        title: 'Room Status',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/roomstatus'
      },
      {
        id: 'multipleBillsettlement',
        title: 'Multiple settlement',
        icon: <Circle size={12} />,
        navLink: '/dashboard/Reports/multipleBillsettlement'
      },
    ].sort((a, b) => a.title.localeCompare(b.title))
  },

  // POS Reports
  {
    id: 'POS Reports',
    title: 'POS Reports',
    icon: <PieChart size={12} />,
    children: [
      {
        id: 'InHouseCaptureRatio',
        title: 'IH Capture Ratio',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/InHouseCaptureRatio'
      },

      {
        id: 'FnBNCReport',
        title: 'FnB NC Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/FnBNCReport'
      },
      {
        id: 'KOTReport',
        title: 'KOT Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/KOTReport'
      },
      {
        id: 'DiscountReport',
        title: 'Discount Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/DiscountReport'
      },
      {
        id: 'CancelBillReport',
        title: 'Cancel Bill Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/CancelBillReport'
      },
      {
        id: 'CoverAnalysisReport',
        title: 'Cover Analysis',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/CoverAnalysisReport'
      },
      {
        id: 'CollectionSummaryReport',
        title: 'Collection Summary',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/CollectionSummaryReport'
      },
      {
        id: 'ItemwiseSaleReport',
        title: 'Item Sale Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/ItemwiseSaleReport'
      },
      {
        id: 'Stewardsale',
        title: 'Steward Sale',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/StewardSale'
      },
      {
        id: 'NCKotReport',
        title: 'NC Kot Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/NCKotReport'
      },
      {
        id: 'ConsolidatedSalesSettelmentReport',
        title: 'Consolidated  Sales',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/ConsolidatedSalesSettelmentReport'
      },
      {
        id: 'SettelmentSummaryReport',
        title: 'Settelment Summary',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/SettelmentSummaryReport'
      },
      {
        id: 'ConsolidatedCollectionReport',
        title: 'Consolidated Collection',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/ConsolidatedCollectionReport'
      },
      {
        id: 'SalesReport',
        title: 'Sales For The Day',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/SalesReport'
      },
      {
        id: 'VoidKOTReport',
        title: 'Void KOT Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/VoidKOTReport'
      },
      {
        id: 'PosGuestDetails',
        title: 'POS Guest Details',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/posguestdetails'
      },
      {
        id: 'multipleforpos',
        title: 'Multiple Settlement',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/multipleforpos'
      },
      {
        id: 'PaymentForDay',
        title: 'Payment For Day',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/PaymentForDay'
      },
      {
        id: 'SalesSummaryReport',
        title: 'Sales Summary',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/SalesSummaryReport'
      },
      {
        id: 'reprintKOTreport',
        title: 'Reprint KOT Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/reprintKOTreport'
      },
      {
        id: 'postipsforday',
        title: 'Tips Summary Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/posreports/postipsforday'
      },
    ].sort((a, b) => a.title.localeCompare(b.title))
  },

  // Guest Complaint Form
  {
    id: 'Guest Complaint',
    title: 'Guest Complaint',
    icon: <Circle size={12} />,
    children: [
      {
        id: 'configuration',
        title: 'Configuration',
        icon: <Circle size={10} />,
        navLink: '/dashboard/departmentconfiguration'
      },
      {
        id: 'Guest Complaint',
        title: 'Complaint Form',
        icon: <Circle size={10} />,
        navLink: '/dashboard/guestcomplaint'
      },
      {
        id: 'Guest Complaint',
        title: 'Dashboard',
        icon: <Circle size={10} />,
        navLink: '/dashboard/guestcomplaintdashboard'
      },
      {
        id: 'Guest Complaint',
        title: 'GCT Report',
        icon: <Circle size={10} />,
        navLink: '/dashboard/complainDataReport'
      },

    ]
  },

  // Housekeeping Reports
  {
    id: 'Housekeeping Reports',
    title: 'HK Reports',
    icon: <BarChart size={12} />,
    children: [
      {
        id: 'Task Report',
        title: 'Tasks Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/housekeepingreports/tasksReport'
      },
      {
        id: 'Attendent Report',
        title: 'Attendent Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/housekeepingreports/attendentTaskHour'
      },
      {
        id: 'Jobs Report',
        title: 'Jobs Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/housekeepingreports/jobsReport'
      },
      {
        id: 'Consumable Report',
        title: 'Consumable Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/housekeepingreports/consumablesReport'
      },
      {
        id: 'Task Status Report',
        title: 'Task Status Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/housekeepingreports/taskstatusreport'
      },
      {
        id: 'Minibar Consumption Report',
        title: 'Minibar Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/housekeepingreports/minibarreport'
      },
      {
        id: 'Discrepancy',
        title: 'Discrepancy Report',
        icon: <Circle size={12} />,
        navLink: '/dashboard/housekeepingreports/discrepancyreport'
      },
    ]
  }

]
