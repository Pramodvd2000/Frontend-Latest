// ** React Imports
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// const Chat = lazy(() => import('../../views/apps/chat'))
// const Todo = lazy(() => import('../../views/apps/todo'))
// const Email = lazy(() => import('../../views/apps/email'))
// const Kanban = lazy(() => import('../../views/apps/kanban'))
// const Calendar = lazy(() => import('../../views/apps/calendar'))

const InvoiceAdd = lazy(() => import('../../views/apps/invoice/add'))
const InvoiceList = lazy(() => import('../../views/apps/invoice/list'))
const InvoiceEdit = lazy(() => import('../../views/apps/invoice/edit'))
const InvoicePrint = lazy(() => import('../../views/apps/invoice/print'))
const InvoicePreview = lazy(() => import('../../views/apps/invoice/preview'))
const AllPOSBills = lazy(() => import('../../views/apps/AllPOSBills'))
const BillingDetails = lazy(() => import('../../views/apps/BillingDetails'))
// const EcommerceShop = lazy(() => import('../../views/apps/ecommerce/shop'))
// const EcommerceDetail = lazy(() => import('../../views/apps/ecommerce/detail'))
// const EcommerceWishlist = lazy(() => import('../../views/apps/ecommerce/wishlist'))
// const EcommerceCheckout = lazy(() => import('../../views/apps/ecommerce/checkout'))
const UserManagement = lazy(() => import('../../views/dashboard/UserManagement'))

const OtherTables = lazy(() => import('../../views/apps/otherTables'))
const Configuration = lazy(() => import('../../views/apps/configuration'))
const EzeeHotelMapping = lazy(() => import('../../views/apps/ezee_configuration/hotel_mapping'))
const EzeePackageMapping = lazy(() => import('../../views/apps/ezee_configuration/package_mapping'))
const EzeeRoomTypeMapping = lazy(() => import('../../views/apps/ezee_configuration/roomtype_mapping'))
const GuestDetails = lazy(() => import('../../views/apps//guestProfile'))
const CompanyDetails = lazy(() => import('../../views/apps/companyProfile'))


const TransactionCode = lazy(() => import('../../views/apps/configuration/transactionCode'))
const Extras = lazy(() => import('../../views/apps/configuration/extras'))
const RoomType = lazy(() => import('../../views/apps/configuration/roomType'))
const Booker = lazy(() => import('../../views/apps/configuration/booker'))
// const OverbookingLimit = lazy(() => import('../../views/apps/configuration/overbookingLimit'))
// const Cancellation = lazy(() => import('../../views/apps/otherTables/cancellation'))
// const GroupReservationRoomType = lazy(() => import('../../views/apps/otherTables/groupReservationRoomType'))
// const Forex = lazy(() => import('../../views/apps/otherTables/forex'))
// const FixedCharge = lazy(() => import('../../views/apps/otherTables/fixedCharge'))
const Commission = lazy(() => import('../../views/apps/otherTables/commission'))
const RoomInventory = lazy(() => import('../../views/apps/otherTables/roomInventory'))
const RoomInventoryForecast = lazy(() => import('../../views/apps/otherTables/roomInventoryForecast'))
// const Extras = lazy(() => import('../../views/apps/otherTables/extras'))
const ReservationType = lazy(() => import('../../views/apps/otherTables/reservationType'))
// const RoomClass = lazy(() => import('../../views/apps/otherTables/roomClass'))
// const RoomsInventory = lazy(() => import('../../views/apps/roomsInventory'))
const Origin = lazy(() => import('../../views/apps/configuration/origin'))
const ReservationTypeData = lazy(() => import('../../views/apps/configuration/reservationType'))

// Nidhi Code
const Block = lazy(() => import('../../views/apps/configuration/block'))
// const CompanyProfile = lazy(() => import('../../views/apps/configuration/companyProfile'))

const Financial = lazy(() => import('../../views/apps/otherTables/financial'))
const Accounts = lazy(() => import('../../views/apps/otherTables/financial/accounts'))
const RoomClass = lazy(() => import('../../views/apps/configuration/roomClass'))
// const DisplayBills = lazy(() => import('../../views/apps/configuration/displayBills'))
const Floor = lazy(() => import('../../views/apps/configuration/floor'))
const RoomStatus = lazy(() => import('../../views/apps/configuration/roomStatus'))
const RateCategory = lazy(() => import('../../views/apps/configuration/rateCategory'))
const RateClass = lazy(() => import('../../views/apps/configuration/rateClass'))
const RateCode = lazy(() => import('../../views/apps/configuration/rateCode'))
const Reason = lazy(() => import('../../views/apps/configuration/reason'))
const ReasonGroup = lazy(() => import('../../views/apps/configuration/reasonGroup'))
const RateSetup = lazy(() => import('../../views/apps/configuration/rateSetup'))
const Group = lazy(() => import('../../views/apps/configuration/group'))
const PackageGroup = lazy(() => import('../../views/apps/configuration/packageGroup'))
const Package = lazy(() => import('../../views/apps/configuration/package'))
const Routing = lazy(() => import('../../views/apps/configuration/routing'))
const SubGroup = lazy(() => import('../../views/apps/configuration/subGroup'))
const Specials = lazy(() => import('../../views/apps/configuration/specials'))
const MarketCode = lazy(() => import('../../views/apps/configuration/marketCode'))
const MarketGroup = lazy(() => import('../../views/apps/configuration/marketGroup'))
const MembershipType = lazy(() => import('../../views/apps/configuration/membershipType'))
const MembershipLevel = lazy(() => import('../../views/apps/configuration/membershipLevel'))
const Vip = lazy(() => import('../../views/apps/configuration/vip'))
const Users = lazy(() => import('../../views/apps/configuration/users'))
const HotelDetails = lazy(() => import('../../views/apps/configuration/hotelDetails'))
const NightAudit = lazy(() => import('../../views/apps/configuration/nightAudit'))
const Tax = lazy(() => import('../../views/apps/configuration/tax'))
const SourceCode = lazy(() => import('../../views/apps/configuration/sourceCode'))
const SourceGroup = lazy(() => import('../../views/apps/configuration/sourceGroup'))
const PreferenceGroup = lazy(() => import('../../views/apps/configuration/preferenceGroup'))


////////////////// POS Configuration //////////////////////////////
const Storefront = lazy(() => import('../../views/apps/pos_configuration/storefront'))
const StoreFrontType = lazy(() => import('../../views/apps/pos_configuration/storefronttype'))
const Spa = lazy(() => import('../../views/apps/pos_configuration/spa'))
const Laundary = lazy(() => import('../../views/apps/pos_configuration/laundary'))
const MiniBar = lazy(() => import('../../views/apps/pos_configuration/miniBar'))
const RestaurantTable = lazy(() => import('../../views/apps/pos_configuration/restaurentTable'))
const MenuGroups = lazy(() => import('../../views/apps/pos_configuration/menuGroups'))
const Sessions = lazy(() => import('../../views/apps/pos_configuration/sessions'))
const MenuItems = lazy(() => import('../../views/apps/pos_configuration/menuItems'))
const FoodType = lazy(() => import('../../views/apps/pos_configuration/foodtype'))
const Orders = lazy(() => import('../../views/apps/AllOrders'))
const OrderType = lazy(() => import('../../views/apps/pos_configuration/orderType'))
const KOTdata = lazy(() => import('../../views/apps/pos_configuration/KOTdata'))
const Bills = lazy(() => import('../../views/apps/POSBills'))
const Addorder = lazy(() => import('../../views/apps/pos_configuration/Addorder'))
const SelectRestaurant = lazy(() => import('../../views/apps/pos_configuration/Restaurantselection'))
const SelectTable = lazy(() => import('../../views/apps/pos_configuration/Tableselection'))
const AddDiscCoupons = lazy(() => import('../../views/apps/pos_configuration/AddDiscCoupons'))
const Displaybill = lazy(() => import('../../views/apps/pos_configuration/DisplayBill'))
const UpdateMenuItem = lazy(() => import('../../views/apps/pos_configuration/UpdateMenu'))
const TempMenuItem = lazy(() => import('../../views/apps/pos_configuration/TempMenuItem'))
const ReservationTemplate = lazy(()=> import('../../views/apps/pos_configuration/ReservationTemplate'))
const AllTransactions = lazy(()=> import('../../views/apps/pos_configuration/Transactions'))
const Invoice = lazy(() => import('../../views/apps/pos_configuration/Invoice'))
const Previewbill = lazy(() => import('../../views/apps/pos_configuration/DummyBill'))
const Split = lazy(() => import('../../views/apps/pos_configuration/Split'))
const SplitPayment = lazy(() => import('../../views/apps/pos_configuration/SplitPayment'))
const KOTIPDetails = lazy(() => import('../../views/apps/pos_configuration/KOTIPDetails'))
const MenuHeader = lazy(() => import('../../views/apps/pos_configuration/MenuHeader'))
const AddStore = lazy(() => import('../../views/apps/pos_configuration/AddStore'))
const SubMenuItems = lazy(() => import('../../views/apps/pos_configuration/SubMenuItems'))
const Print = lazy(() => import('../../views/apps/Print'))
const PrintSplitPreview = lazy(() => import('../../views/apps/PrintSplitPreview'))
const Steward = lazy(() => import('../../views/apps/Steward'))

const POSInhouseGuest = lazy(() => import('../../views/apps/POSInhouseGuest'))
const KOTOrders = lazy(() => import('../../views/apps/KOTOrders'))
const DisplayBillPayment = lazy(() => import('../../views/apps/pos_configuration/DisplayBillPayment'))


// const POSBills = lazy(() => import('../../views/apps/POSBills'))

//////////////////////////////// POS Reports(By roopa) ////////////////////////////////////////////////

const FnBNCReport = lazy(() => import('../../views/dashboard/POSReports/FnBNCReport'))
const KOTReport = lazy(() => import('../../views/dashboard/POSReports/KOTReport'))
const DiscountReport = lazy(() => import('../../views/dashboard/POSReports/DiscountReport'))
const CancelBillReport = lazy(() => import('../../views/dashboard/POSReports/CancelBillReport'))
const CoverAnalysisReport = lazy(() => import('../../views/dashboard/POSReports/CoverAnalysisReport'))
const CollectionSummaryReport = lazy(() => import('../../views/dashboard/POSReports/CollectionSummaryReport'))
const ItemwiseSaleReport = lazy(() => import('../../views/dashboard/POSReports/ItemwiseSaleReport'))
const NCKotReport = lazy(() => import('../../views/dashboard/POSReports/NCKotReport'))
const ConsolidatedSalesSettelmentReport = lazy(() => import('../../views/dashboard/POSReports/ConsolidatedSalesSettelmentReport'))
const SettelmentSummaryReport = lazy(() => import('../../views/dashboard/POSReports/SettelmentSummaryReport'))
const ConsolidatedCollectionReport = lazy(() => import('../../views/dashboard/POSReports/ConsolidatedCollectionReport'))


const UserList = lazy(() => import('../../views/apps/user/list'))
const UserView = lazy(() => import('../../views/apps/user/view'))


const DashboardBanquet = lazy(() => import("../../views/dashboard/banquet"));
const DashboardRestaurantBanquet = lazy(() => import("../../views/dashboard/restaurantBanquet"));

const UploadConfiguration = lazy(() => import('../../views/apps/uploadConfiguration'))
const UploadHotelDetails = lazy(() => import('../../views/apps/uploadConfiguration/hotelDetails'))
const UploadBlock = lazy(() => import('../../views/apps/uploadConfiguration/block'))
const UploadFloor = lazy(() => import('../../views/apps/uploadConfiguration/floor'))
const UploadRoomType = lazy(() => import('../../views/apps/uploadConfiguration/roomType'))
const UploadRoomClass = lazy(() => import('../../views/apps/uploadConfiguration/roomClass'))
const UploadRoomStatus = lazy(() => import('../../views/apps/uploadConfiguration/roomStatus'))
const UploadGroup = lazy(() => import('../../views/apps/uploadConfiguration/group'))
const UploadSubGroup = lazy(() => import('../../views/apps/uploadConfiguration/subGroup'))
const UploadTax = lazy(() => import('../../views/apps/uploadConfiguration/tax'))
const UploadTransactionCode = lazy(() => import('../../views/apps/uploadConfiguration/transactionCode'))
const UploadRateCategory = lazy(() => import('../../views/apps/uploadConfiguration/rateCategory'))
const UploadExtras = lazy(() => import('../../views/apps/uploadConfiguration/extras'))
const UploadMarketCode = lazy(() => import('../../views/apps/uploadConfiguration/marketCode'))
const UploadMarketGroup = lazy(() => import('../../views/apps/uploadConfiguration/marketGroup'))
const UploadSourceCode = lazy(() => import('../../views/apps/uploadConfiguration/sourceCode'))
const UploadSourceGroup = lazy(() => import('../../views/apps/uploadConfiguration/sourceGroup'))
const UploadPackage = lazy(() => import('../../views/apps/uploadConfiguration/package'))
const UploadRateCode = lazy(() => import('../../views/apps/uploadConfiguration/rateCode'))
const UploadReason = lazy(() => import('../../views/apps/uploadConfiguration/reason'))
const UploadReasonGroup = lazy(() => import('../../views/apps/uploadConfiguration/reasonGroup'))
const UploadMembershipType = lazy(() => import('../../views/apps/uploadConfiguration/membershipType'))
const UploadMembershipLevel = lazy(() => import('../../views/apps/uploadConfiguration/membershipLevel'))
const UploadBooker = lazy(() => import('../../views/apps/uploadConfiguration/booker'))
const UploadRateClass = lazy(() => import('../../views/apps/uploadConfiguration/rateClass'))
const UploadPreferenceGroup = lazy(() => import('../../views/apps/uploadConfiguration/preferenceGroup'))
const UploadSpecials = lazy(() => import('../../views/apps/uploadConfiguration/specials'))
const UploadVip = lazy(() => import('../../views/apps/uploadConfiguration/vip'))
const UploadUsers = lazy(() => import('../../views/apps/uploadConfiguration/users'))
const UploadOrigin = lazy(() => import('../../views/apps/uploadConfiguration/origin'))
const UploadReservationTypeData = lazy(() => import('../../views/apps/uploadConfiguration/reservationType'))
const UploadTransportType = lazy(() => import('../../views/apps/uploadConfiguration/transportType'))
const UploadPaymentType = lazy(() => import('../../views/apps/uploadConfiguration/paymentType')) 
const UploadMenuGroups = lazy(() => import('../../views/apps/uploadConfiguration/menuGroups'))
const UploadSessions = lazy(() => import('../../views/apps/uploadConfiguration/sessions'))
const UploadMenuItems = lazy(() => import('../../views/apps/uploadConfiguration/menuItems'))
const UploadAddorder = lazy(() => import('../../views/apps/uploadConfiguration/Addorder'))
const UploadUpdateMenuItem = lazy(() => import('../../views/apps/uploadConfiguration/UpdateMenu'))
const UploadTempMenuItem = lazy(() => import('../../views/apps/uploadConfiguration/TempMenuItem'))
const UploadKOTIPDetails = lazy(() => import('../../views/apps/uploadConfiguration/KOTIPDetails'))
const UploadMenuHeader = lazy(() => import('../../views/apps/uploadConfiguration/MenuHeader'))
const UploadAddStore = lazy(() => import('../../views/apps/uploadConfiguration/AddStore'))
const AccountGroupMap = lazy(() => import("../../views/apps/accountForcatedMapping"));
const UnMappedCompanies = lazy(() => import("../../views/apps/unMappedCompanies"))
const AddTable = lazy(() => import('../../views/apps/pos_configuration/AddTable'))
const POSTableMapping = lazy(() => import('../../views/apps/pos_configuration/POSTableMapping'))
const WhatsappRequest = lazy(() => import('../../views/apps/WhatsappRequests'))

const POSQRUI = lazy(() => import('../../views/apps/POSQRUI'))
const POSQRlogin = lazy(() => import('../../views/apps/POSQRlogin'))
const POSQRlogout = lazy(() => import('../../views/apps/POSQRlogout'))
const PendingCutomernIRDOrders = lazy(() => import('../../views/apps/PendingCutomernIRDOrders'))
const CreateRestaurant = lazy(() => import('../../views/apps/pos_configuration/CreateNewStore'))
const Industry = lazy(() => import('../../views/apps/configuration/industry'))
const WeekendPricing = lazy(() => import('../../views/apps/configuration/WeekendPricing'))


const AppRoutes = [

  {
    element: <UploadConfiguration />,
    path: '/apps/uploadConfiguration',
    meta: {
      appLayout: false,
      className: 'configuration-application'
    }
  },
  {
    element:<UnMappedCompanies />, 
    path: '/apps/unmappedcompanies'
  },
  {
    path: '/dashboard/accountmap',
    element: <AccountGroupMap />
  },
  {
    element: <UploadHotelDetails />,
    path: '/apps/uploadConfiguration/hotelDetails',
    meta: {
      appLayout: false,
      className: 'hotelDetails-application'
    }
  },
  {
    element: <CreateRestaurant />,
    path: '/apps/POSconfiguration/CreateRestaurant',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <UploadBlock />,
    path: '/apps/uploadConfiguration/block',
    meta: {
      appLayout: false,
      className: 'block-application'
    }
  },
  {
    element: <UploadFloor />,
    path: '/apps/uploadConfiguration/floor',
    meta: {
      // appLayout: true,
      className: 'floor-application'
    }
  },
  {
    element: <UploadRoomClass />,
    path: '/apps/uploadConfiguration/roomClass',
    meta: {
      // appLayout: true,
      className: 'reservationType-application' 
    }
  },
  {
    element: <UploadRoomType/>,
    path: '/apps/uploadConfiguration/roomType',
    meta: {
      // appLayout: true,
      className: 'configuration-application'
    }
  },
  {
    element: <WhatsappRequest />,
    path: '/apps/WhatsappRequests',
  },

  {
    element: <UploadRoomStatus />,
    path: '/apps/uploadConfiguration/roomStatus',
    meta: {
      appLayout: false,
      className: 'roomStatus-application'
    }
  },
  {
    element: <UploadGroup />,
    path: '/apps/uploadConfiguration/group',
    meta: {
      appLayout: false,
      className: 'Group-application'
    }
  },
  {
    element: <UploadSubGroup />,
    path: '/apps/uploadConfiguration/subGroup',
    meta: {
      appLayout: false,
      className: 'subGroup-application'
    }
  },
  {
    element: <UploadTax />,
    path: '/apps/uploadConfiguration/tax',
    meta: {
      appLayout: false,
      className: 'block-application'
    }
  },
  {
    element: <UploadTransactionCode/>,
    path: '/apps/uploadConfiguration/transactionCode',
    meta: {
      // appLayout: true,
      className: 'configuration-application'
    }
  },
  {
    element: <UploadRateCategory />,
    path: '/apps/uploadConfiguration/rateCategory',
    meta: {
      appLayout: false,
      className: 'rateCategory-application'
    }
  },
  {
    element: <UploadExtras />,
    path: '/apps/uploadConfiguration/extras',
    meta: {
      // appLayout: true,
      className: 'configuration-application'
    }
  },
  {
    element: <UploadMarketGroup />,
    path: '/apps/uploadConfiguration/marketGroup',
    meta: {
      appLayout: false,
      className: 'marketGroup-application'
    }
  },
  {
    element: <UploadMarketCode />,
    path: '/apps/uploadConfiguration/marketCode',
    meta: {
      appLayout: false,
      className: 'marketCode-application'
    }
  },
  {
    element: <UploadSourceGroup />,
    path: '/apps/uploadConfiguration/sourceGroup',
    meta: {
      appLayout: false,
      className: 'block-application'
    }
  },
  {
    element: <UploadSourceCode />,
    path: '/apps/uploadConfiguration/sourceCode',
    meta: {
      appLayout: false,
      className: 'block-application'
    }
  },
  {
    element: <UploadPackage />,
    path: '/apps/uploadConfiguration/package',
    meta: {
      appLayout: false,
      className: 'packageGroup-application'
    }
  },
  {
    element: <UploadRateCode />,
    path: '/apps/uploadConfiguration/rateCode',
    meta: {
      appLayout: false,
      className: 'rateCode-application'
    }
  },
  {
    element: <UploadReasonGroup />,
    path: '/apps/uploadConfiguration/reasonGroup',
    meta: {
      // appLayout: true,
      className: 'extraGroup-application' 
    }
  },
  {
    element: <UploadReason />,
    path: '/apps/uploadConfiguration/reason',
    meta: {
      // appLayout: true,
      className: 'extraGroup-application' 
    }
  },
  {
    element: <UploadMembershipType />,
    path: '/apps/uploadConfiguration/membershipType',
    meta: {
      appLayout: false,
      className: 'marketGroup-application'
    }
  },
  {
    element: <UploadMembershipLevel />,
    path: '/apps/uploadConfiguration/membershipLevel',
    meta: {
      appLayout: false,
      className: 'marketGroup-application'
    }
  },
  {
    element: <UploadBooker/>,
    path: '/apps/uploadConfiguration/booker',
    meta: {
      // appLayout: true,
      className: 'booker-application'
    }
  },

  {
    element: <UploadRateClass />,
    path: '/apps/uploadConfiguration/rateClass',
    meta: {
      appLayout: false,
      className: 'rateClass-application'
    }
  },
  {
    element: <UploadPreferenceGroup />,
    path: '/apps/uploadConfiguration/preferenceGroup',
    meta: {
      appLayout: false,
      className: 'marketGroup-application'
    }
  },
  {
    element: <UploadSpecials />,
    path: '/apps/uploadConfiguration/specials',
    meta: {
      appLayout: false,
      className: 'specials-application'
    }
  },
  {
    element: <UploadUsers />,
    path: '/apps/uploadConfiguration/users',
    meta: {
      appLayout: false,
      className: 'user-application'
    }
  },
  {
    element: <UploadVip />,
    path: '/apps/uploadConfiguration/vip',
    meta: {
      appLayout: false,
      className: 'visaDetails-application'
    }
  },
  {
    element: <UploadOrigin />,
    path: '/apps/uploadConfiguration/origin',
  },
  {
    element: <UploadReservationTypeData />,
    path: '/apps/uploadConfiguration/reservationType',
  },
  {
    element: <UploadTransportType />,
    path: '/apps/uploadConfiguration/transportType',
    meta: {
      appLayout: false,
      className: 'marketGroup-application'
    }
  },
  {
    element: <UploadPaymentType />,
    path: '/apps/uploadConfiguration/paymentType',
    meta: {
      appLayout: false,
      className: 'marketGroup-application'
    }
  },


  {
    element: <UploadAddStore />,
    path: '/apps/uploadConfiguration/AddStore',
    meta: {
      // appLayout: true,
      className: 'uploadConfiguration-application'
    }
  },

  {
    element: <UploadSessions />,
    path: '/apps/uploadConfiguration/sessions',
    meta: {
      // appLayout: true,
      className: 'uploadConfiguration-application'
    }
  },
  {
    element: <UploadKOTIPDetails />,
    path: '/apps/uploadConfiguration/KOTIPDetails',
    meta: {
      // appLayout: true,
      className: 'uploadConfiguration-application'
    }
  },
  {
    element: <UploadMenuHeader />,
    path: '/apps/uploadConfiguration/MenuHeader',
    meta: {
      // appLayout: true,
      className: 'uploadConfiguration-application'
    }
  },

  {
    element: <UploadMenuGroups />,
    path: '/apps/uploadConfiguration/menuGroups',
    meta: {
      // appLayout: true,
      className: 'uploadConfiguration-application'
    }
  },


  {
    element: <UploadMenuItems />,
    path: '/apps/uploadConfiguration/menuItems',
    meta: {
      // appLayout: true,
      className: 'uploadConfiguration-application'
    }
  },
  {
    element: <UploadTempMenuItem />,
    path: '/apps/uploadConfiguration/AddTempMenuItem',
    meta: {
      // appLayout: true,
      className: 'uploadConfiguration-application'
    }
  }, 
  {
    element: <UploadUpdateMenuItem />,
    path: '/apps/uploadConfiguration/UpdateMenu',
    meta: {
      // appLayout: true,
      className: 'uploadConfiguration-application'
    }
  }, 

  {
    element: <UploadAddorder />,
    path: '/apps/uploadConfiguration/Addorder',
    meta: {
      // appLayout: true,
      className: 'uploadConfiguration-application'
    }
  },
  {
    element: <OtherTables />,
    path: '/apps/otherTables',
    meta: {
      // appLayout: false,
      className: 'hotelDetails-application'
    }
  },
  {
    path: "/dashboard/banquet",
    element: <DashboardBanquet />,
  },
  {
    path: "/dashboard/restaurantBanquet",
    element: <DashboardRestaurantBanquet />,
  },
  // {
  //   element: <DisplayBills />,
  //   path: '/apps/configuration/displayBills',
  //   meta: {
  //     appLayout: false,
  //     className: 'block-application'
  //   }
  // },
  {
    element: <Block />,
    path: '/apps/configuration/block',
    meta: {
      appLayout: false,
      className: 'block-application'
    }
  },
  {
    path: '/configuration/usermanagement',
    element: <UserManagement/>
  },
  {
    element: <SourceCode />,
    path: '/apps/configuration/sourceCode',
    meta: {
      appLayout: false,
      className: 'block-application'
    }
  },
  {
    element: <SourceGroup />,
    path: '/apps/configuration/sourceGroup',
    meta: {
      appLayout: false,
      className: 'block-application'
    }
  },
 
  {
    element: <Tax />,
    path: '/apps/configuration/tax',
    meta: {
      appLayout: false,
      className: 'block-application'
    }
  },
  {
    element: <GuestDetails />,
    path: '/apps/guestProfile',
    meta: {
      appLayout: false,
      className: 'configuration-application'
    }
  },
  {
    element: <CompanyDetails />,
    path: '/apps/companyProfile',
    meta: {
      appLayout: false,
      className: 'configuration-application'
    }
  },
  {
    element: <EzeeHotelMapping />,
    path: '/apps/ezeemapping/hotelmapping',
  },
  {
    element: <EzeePackageMapping />,
    path: '/apps/ezeemapping/packagemapping',
  },  
  {
    element: <EzeeRoomTypeMapping />,
    path: '/apps/ezeemapping/roomtypemapping',
  },
  
  {
    element: <Origin />,
    path: '/apps/configuration/origin',
  },
  {
    element: <ReservationTypeData />,
    path: '/apps/configuration/reservationType',
  },
  {
    element: <Configuration />,
    path: '/apps/configuration',
    meta: {
      appLayout: false,
      className: 'configuration-application'
    }
  },
  {
    element: <TransactionCode/>,
    path: '/apps/configuration/transactionCode',
    meta: {
      // appLayout: true,
      className: 'configuration-application'
    }
  },
  // {
  //   element: <OverbookingLimit/>,
  //   path: '/apps/configuration/overbookingLimit',
  //   meta: {
  //     // appLayout: true,
  //     className: 'configuration-application'
  //   }
  // },
  {
    element: <Booker/>,
    path: '/apps/configuration/booker',
    meta: {
      // appLayout: true,
      className: 'booker-application'
    }
  },
  {
    element: <RoomType/>,
    path: '/apps/configuration/roomType',
    meta: {
      // appLayout: true,
      className: 'configuration-application'
    }
  },
    {
    element: <Industry/>,
    path: '/apps/configuration/industry',
    meta: {
      // appLayout: true,
      className: 'configuration-application'
    }
  },
  {
    element: <Extras />,
    path: '/apps/configuration/extras',
    meta: {
      // appLayout: true,
      className: 'configuration-application'
    }
  },
  {
    element: <Reason />,
    path: '/apps/configuration/reason',
    meta: {
      // appLayout: true,
      className: 'extraGroup-application' 
    }
  },
  {
    element: <ReasonGroup />,
    path: '/apps/configuration/reasonGroup',
    meta: {
      // appLayout: true,
      className: 'extraGroup-application' 
    }
  },
  // {
  //   element: <Cancellation />,
  //   path: '/apps/cancellation',
  //   meta: {
  //     // appLayout: true,
  //     className: 'cancellation-application'
  //   }
  // },
  // {
  //   element: <GroupReservationRoomType />,
  //   path: '/apps/groupReservationRoomType',
  //   meta: {
  //     // appLayout: true,
  //     className: 'GroupReservationRoomType-application' 
  //   }
  // },
  // {
  //   element: <Forex />,
  //   path: '/apps/forex',
  //   meta: {
  //     // appLayout: true,
  //     className: 'forex-application' 
  //   }
  // },
  // {
  //   element: <FixedCharge />,
  //   path: '/apps/fixedCharge',
  //   meta: {
  //     // appLayout: true,
  //     className: 'fixedCharge-application' 
  //   }
  // },
  {
    element: <Commission />,
    path: '/apps/commission',
    meta: {
      // appLayout: true,
      className: 'fixedCharge-application' 
    }
  },
  {
    element: <RoomInventory />,
    path: '/apps/roomInventory',
    meta: {
      // appLayout: true,
      className: 'fixedCharge-application' 
    }
  },
  {
    element: <RoomInventoryForecast />,
    path: '/apps/roomInventoryForecast',
    meta: {
      // appLayout: true,
      className: 'fixedCharge-application' 
    }
  },
  
  {
    element: <ReservationType />,
    path: '/apps/reservationType',
    meta: {
      // appLayout: true,
      className: 'reservationType-application' 
    }
  },
  {
    element: <RoomClass />,
    path: '/apps/roomClass',
    meta: {
      // appLayout: true,
      className: 'reservationType-application' 
    }
  },
    {
    element: <WeekendPricing />,
    path: '/apps/WeekendPricing',
    meta: {
      // appLayout: true,
      className: 'reservationType-application' 
    }
  },
  // {
  //   element: <RoomsInventory />,
  //   path: '/apps/roomsInventory',
  //   meta: {
  //     // appLayout: true,
  //     className: 'roomsInventory-application' 
  //   }
  // },
  // {
  //   element: <SplitTransaction />,
  //   path: '/apps/splitTrasaction',
  //   meta: {
  //     // appLayout: true,
  //     className: 'splitTransaction-application' 
  //   }
  // },
  // {
  //   element: <Ticket />,
  //   path: '/apps/ticket',
  //   meta: {
  //     // appLayout: true,
  //     className: 'ticket-application' 
  //   }
  // },
  // {
  //   element: <TicketCategory />,
  //   path: '/apps/ticketCategory',
  //   meta: {
  //     // appLayout: true,
  //     className: 'ticketCategory-application' 
  //   }
  // },
  // {
  //   element: <WaitList />,
  //   path: '/apps/waitList',
  //   meta: {
  //     // appLayout: true,
  //     className: 'waitList-application' 
  //   }
  // },
  // {
  //   element: <Documents />,
  //   path: '/apps/documents',
  //   meta: {
  //     // appLayout: true,
  //     className: 'documents-application' 
  //   }
  // },
  // {
  //   element: <DocumentType />,
  //   path: '/apps/documentType',
  //   meta: {
  //     // appLayout: true,
  //     className: 'documentType-application' 
  //   }
  // },
  // {
  //   element: <Transaction />,
  //   path: '/apps/transaction',
  //   meta: {
  //     // appLayout: true,
  //     className: 'transaction-application' 
  //   }
  // },
  // {
  //   element: <RoomWiseInventory />,
  //   path: '/apps/roomWiseInventory',
  //   meta: {
  //     // appLayout: true,
  //     className: 'RoomWiseInventory-application' 
  //   }
  // },


  // Nidhi Code
  {
    element: <Financial />,
    path: '/apps/financial',
    meta: {
      appLayout: false,
      className: 'financial-application'
    }
  },
  {
    element: <Accounts />,
    path: '/apps/financial/accounts',
    meta: {
       appLayout: false,
      className: 'accounts-application'
    }
  },
  // {
  //   element: <Configuration />,
  //   path: '/apps/configuration',
  //   meta: {
  //     appLayout: true,
  //     className: 'configuration-application'
  //   }
  // },
  // {
  //   element: <Room />,
  //   path: '/apps/configuration/room',
  //   meta: {
  //     // appLayout: true,
  //     className: 'room-application'
  //   }
  // },
  {
    element: <Floor />,
    path: '/apps/configuration/floor',
    meta: {
      // appLayout: true,
      className: 'floor-application'
    }
  },
  // {
  //   element: <Folio />,
  //   path: '/apps/configuration/folio',
  //   meta: {
  //     appLayout: false,
  //     className: 'folio-application'
  //   }
  // },
  {
    element: <Block />,
    path: '/apps/configuration/block',
    meta: {
      appLayout: false,
      className: 'block-application'
    }
  },
  {
    element: <RoomStatus />,
    path: '/apps/configuration/roomStatus',
    meta: {
      appLayout: false,
      className: 'roomStatus-application'
    }
  },
  {
    element: <Routing />,
    path: '/apps/configuration/routing',
    meta: {
      appLayout: false,
      className: 'routing-application'
    }
  },
  {
    element: <NightAudit />,
    path: '/apps/configuration/nightAudit',
    meta: {
      appLayout: false,
      className: 'nightAudit-application'
    }
  },
  {
    element: <RateCategory />,
    path: '/apps/configuration/rateCategory',
    meta: {
      appLayout: false,
      className: 'rateCategory-application'
    }
  },
  {
    element: <RateSetup />,
    path: '/apps/configuration/rateSetup',
    meta: {
      // appLayout: true,
      className: 'rateSetup-application'
    }
  },
  {
    element: <RateClass />,
    path: '/apps/configuration/rateClass',
    meta: {
      appLayout: false,
      className: 'rateClass-application'
    }
  },
  {
    element: <RateCode />,
    path: '/apps/configuration/rateCode',
    meta: {
      appLayout: false,
      className: 'rateCode-application'
    }
  },
  {
    element: <Group />,
    path: '/apps/configuration/group',
    meta: {
      appLayout: false,
      className: 'Group-application'
    }
  },
  {
    element: <PackageGroup />,
    path: '/apps/configuration/packageGroup',
    meta: {
      appLayout: false,
      className: 'packageGroup-application'
    }
  },
  {
    element: <Package />,
    path: '/apps/configuration/package',
    meta: {
      appLayout: false,
      className: 'packageGroup-application'
    }
  },
  {
    element: <SubGroup />,
    path: '/apps/configuration/subGroup',
    meta: {
      appLayout: false,
      className: 'subGroup-application'
    }
  },
  {
    element: <Specials />,
    path: '/apps/configuration/specials',
    meta: {
      appLayout: false,
      className: 'specials-application'
    }
  },
  {
    element: <Users />,
    path: '/apps/configuration/users',
    meta: {
      appLayout: false,
      className: 'user-application'
    }
  },
  {
    element: <MarketCode />,
    path: '/apps/configuration/marketCode',
    meta: {
      appLayout: false,
      className: 'marketCode-application'
    }
  },
  {
    element: <MarketGroup />,
    path: '/apps/configuration/marketGroup',
    meta: {
      appLayout: false,
      className: 'marketGroup-application'
    }
  },
  {
    element: <MembershipType />,
    path: '/apps/configuration/membershipType',
    meta: {
      appLayout: false,
      className: 'marketGroup-application'
    }
  },
  {
    element: <MembershipLevel />,
    path: '/apps/configuration/membershipLevel',
    meta: {
      appLayout: false,
      className: 'marketGroup-application'
    }
  },
  {
    element: <Vip />,
    path: '/apps/configuration/vip',
    meta: {
      appLayout: false,
      className: 'visaDetails-application'
    }
  },
  {
    element: <PreferenceGroup />,
    path: '/apps/configuration/preferenceGroup',
    meta: {
      appLayout: false,
      className: 'marketGroup-application'
    }
  },
 
  {
    element: <HotelDetails />,
    path: '/apps/configuration/hotelDetails',
    meta: {
      appLayout: false,
      className: 'hotelDetails-application'
    }
  },
  {
    element: <POSQRUI />,
    path: '/apps/POSQRUI',
    meta: {
      layout: "blank",
    },
  },
  {
    element: <POSQRlogout />,
    path: '/apps/POSQRlogout',
    meta: {
      layout: "blank",
    },
  },
  {
    element: <POSQRlogin />,
    path: '/apps/POSQRlogin',
    meta: {
      layout: "blank",
    },
  },
 {
    element: <PendingCutomernIRDOrders />,
    path: '/apps/PendingCutomernIRDOrders',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  
  // {
  //   element: <Email />,
  //   path: '/apps/email/:folder',
  //   meta: {
  //     appLayout: true,
  //     className: 'email-application'
  //   }
  // },
  // {
  //   element: <Email />,
  //   path: '/apps/email/label/:label',
  //   meta: {
  //     appLayout: true,
  //     className: 'email-application'
  //   }
  // },
  // {
  //   element: <Email />,
  //   path: '/apps/email/:filter'
  // },
  // {
  //   path: '/apps/chat',
  //   element: <Chat />,
  //   meta: {
  //     appLayout: true,
  //     className: 'chat-application'
  //   }
  // },
  // {
  //   element: <Todo />,
  //   path: '/apps/todo',
  //   meta: {
  //     appLayout: true,
  //     className: 'todo-application'
  //   }
  // },
  // {
  //   element: <Todo />,
  //   path: '/apps/todo/:filter',
  //   meta: {
  //     appLayout: true,
  //     className: 'todo-application'
  //   }
  // },
  // {
  //   element: <Todo />,
  //   path: '/apps/todo/tag/:tag',
  //   meta: {
  //     appLayout: true,
  //     className: 'todo-application'
  //   }
  // },
  // {
  //   element: <Calendar />,
  //   path: '/apps/calendar'
  // },
  // {
  //   element: <Kanban />,
  //   path: '/apps/kanban',
  //   meta: {
  //     appLayout: true,
  //     className: 'kanban-application'
  //   }
  // },
  {
    element: <InvoiceList />,
    path: '/apps/invoice/list'
  },
  {
    element: <InvoicePreview />,
    path: '/apps/invoice/preview/:id'
  },
  {
    path: '/apps/invoice/preview',
    element: <Navigate to='/apps/invoice/preview/4987' />
  },
  {
    element: <InvoiceEdit />,
    path: '/apps/invoice/edit/:id'
  },
  {
    path: '/apps/invoice/edit',
    element: <Navigate to='/apps/invoice/edit/4987' />
  },
  {
    element: <InvoiceAdd />,
    path: '/apps/invoice/add'
  },
  {
    path: '/apps/invoice/print',
    element: <InvoicePrint />,
    meta: {
      layout: 'blank'
    }
  },
  /////////// POS configuration ////////////////////
  {
    element: <Storefront />,
    path: '/apps/POSconfiguration/storefront',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <POSTableMapping />,
    path: '/apps/POSconfiguration/POSTableMapping',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <Print />,
    path: '/apps/Print',
    meta: {
      layout: 'blank'
    }
  },
  {
    element: <PrintSplitPreview />,
    path: '/apps/PrintSplitPreview',
    meta: {
      layout: 'blank'
    }
  },
  {
    element: <StoreFrontType/>,
    path: '/apps/POSconfiguration/storefronttype',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <Spa />,
    path: '/apps/POSconfiguration/spa',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <Laundary />,
    path: '/apps/POSconfiguration/laundary',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <MiniBar />,
    path: '/apps/POSconfiguration/miniBar',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <RestaurantTable />,
    path: '/apps/POSconfiguration/restaurentTable',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <Sessions />,
    path: '/apps/POSconfiguration/sessions',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <MenuGroups />,
    path: '/apps/POSconfiguration/menuGroups',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <SubMenuItems />,
    path: '/apps/POSconfiguration/SubMenuItems',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <KOTIPDetails />,
    path: '/apps/POSconfiguration/KOTIPDetails',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <MenuHeader />,
    path: '/apps/POSconfiguration/MenuHeader',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <AddStore />,
    path: '/apps/POSconfiguration/AddStore',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <AddTable />,
    path: '/apps/POSconfiguration/AddTable',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <MenuItems />,
    path: '/apps/POSconfiguration/menuItems',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <FoodType />,
    path: '/apps/POSconfiguration/foodtype',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <Orders />,
    path: '/apps/POSconfiguration/orders',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <OrderType />,
    path: '/apps/POSconfiguration/orderType',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <KOTdata />,
    path: '/apps/POSconfiguration/KOTdata',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <Bills />,
    path: '/apps/POSconfiguration/bills',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <Addorder />,
    path: '/apps/POSconfiguration/Addorder',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },  
  {
    element: <SelectRestaurant />,
    path: '/apps/POSconfiguration/Restaurantselection',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  }, 
  {
    element: <SelectTable />,
    path: '/apps/POSconfiguration/Tableselection',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  }, 
  {
    element: <AddDiscCoupons />,
    path: '/apps/POSconfiguration/AddDiscCoupons',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  }, 
  {
    element: <Displaybill />,
    path: '/apps/POSconfiguration/DisplayBill',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  }, 
  {
    element: <DisplayBillPayment />,
    path: '/apps/POSconfiguration/DisplayBillPayment',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <Invoice />,
    path: '/apps/POSconfiguration/Invoice',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  }, 
  {
    element: <Previewbill />,
    path: '/apps/POSconfiguration/DummyBill',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  }, 
  {
    element: <Split />,
    path: '/apps/POSconfiguration/Split',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <SplitPayment />,
    path: '/apps/POSconfiguration/SplitPayment',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <UpdateMenuItem />,
    path: '/apps/POSconfiguration/UpdateMenu',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  }, 
  {
    element: <TempMenuItem />,
    path: '/apps/POSconfiguration/AddTempMenuItem',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  }, 
  {
    element: <ReservationTemplate />,
    path: '/apps/POSconfiguration/ReservationTemplate',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <AllTransactions />,
    path: '/apps/POSconfiguration/AllTransactions',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <Bills />,
    path: '/apps/POSBills',
    meta: {
      appLayout: false,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <Orders />,
    path: '/apps/Orders',
    meta: {
      // appLayout: true,
      className: 'posconfiguration-application'
    }
  },
  {
    element: <Steward />,
    path: '/apps/Steward',
    meta: {
      appLayout: false,
      className: 'email-application'
    }
  },
  {
    element: <AllPOSBills />,
    path: '/apps/AllPOSBills',
    meta: {
      appLayout: false,
      className: 'email-application'
    }
  },
   {
    element: <BillingDetails />,
    path: '/apps/BillingDetails',
    meta: {
      appLayout: false,
      className: 'email-application'
    }
  },
  // {
  //   element: <EcommerceShop />,
  //   path: '/apps/ecommerce/shop',
  //   meta: {
  //     className: 'ecommerce-application'
  //   }
  // },
  // {
  //   element: <EcommerceWishlist />,
  //   path: '/apps/ecommerce/wishlist',
  //   meta: {
  //     className: 'ecommerce-application'
  //   }
  // },
  // {
  //   path: '/apps/ecommerce/product-detail',
  //   element: <Navigate to='/apps/ecommerce/product-detail/apple-i-phone-11-64-gb-black-26' />,
  //   meta: {
  //     className: 'ecommerce-application'
  //   }
  // },
  // {
  //   path: '/apps/ecommerce/product-detail/:product',
  //   element: <EcommerceDetail />,
  //   meta: {
  //     className: 'ecommerce-application'
  //   }
  // },
  // {
  //   path: '/apps/ecommerce/checkout',
  //   element: <EcommerceCheckout />,
  //   meta: {
  //     className: 'ecommerce-application'
  //   }
  // },
  // {
  //   element: <UserList />,
  //   path: '/apps/user/list'
  // },
  // {
  //   path: '/apps/user/view',
  //   element: <Navigate to='/apps/user/view/1' />
  // },
  // {
  //   element: <UserView />,
  //   path: '/apps/user/view/:id'
  // },
  // {
  //   element: <Roles />,
  //   path: '/apps/roles'
  // },
  // {
  //   element: <Permissions />,
  //   path: '/apps/permissions'
  // },
  {
    path: '/dashboard/posreports/posreports/FnBNCReport',
    element: <FnBNCReport/>
  },
  {
    path: '/dashboard/posreports/KOTReport',
    element: <KOTReport/>
  },
  {
    path: '/dashboard/posreports/DiscountReport',
    element: <DiscountReport/>
  },
  {
    path: '/dashboard/posreports/CancelBillReport',
    element: <CancelBillReport/>
  },
  {
    path: '/dashboard/posreports/CoverAnalysisReport',
    element: <CoverAnalysisReport/>
  },
  {
    path: '/dashboard/posreports/CollectionSummaryReport',
    element: <CollectionSummaryReport/>
  },
  {
    path: '/dashboard/posreports/ItemwiseSaleReport',
    element: <ItemwiseSaleReport/>
  },
  {
    path: '/dashboard/posreports/NCKotReport',
    element: <NCKotReport/>
  },
  {
    path: '/dashboard/posreports/ConsolidatedSalesSettelmentReport',
    element: <ConsolidatedSalesSettelmentReport/>
  },
  {
    path: '/dashboard/posreports/SettelmentSummaryReport',
    element: <SettelmentSummaryReport/>
  },
  {
    path: '/dashboard/posreports/ConsolidatedCollectionReport',
    element: <ConsolidatedCollectionReport/>
  },
  {
    element: <POSInhouseGuest />,
    path: '/apps/POSInhouseGuest',
  },
  {
    element: <KOTOrders />,
    path: '/apps/KOTOrders',
  },
]

export default AppRoutes

