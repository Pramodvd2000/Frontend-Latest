import { lazy } from "react";

const DashboardAnalytics = lazy(() =>
  import("../../views/dashboard/analytics")
);
const DashboardEcommerce = lazy(() => import("../../views/dashboard/ecommerce")
);


// const DashboardFrontDesk = lazy(() =>
//   import("../../views/dashboard/frontDesk")
// );
// const DashboardAvailability = lazy(() => import('../../views/dashboard/availability'))

const DashboardHouseUseDashboard = lazy(() =>
  import("../../views/dashboard/houseUseDashboard")
);

const MainDashboard = lazy(() => import('../../views/dashboard/MainDashboard'))
const ProductivityDashboard = lazy(() => import('../../views/dashboard/ProductivityDashboard'))
const RestaurantPerformance = lazy(() => import('../../views/dashboard/RestaurantPerformance'))

const InhouseGuestVipReports = lazy(() => import("../../views/dashboard/Reports/inhouseguestvip"));

const WakeUpCallreport = lazy(() => import("../../views/dashboard/Reports/wakeUpCallReport"));
const Forexreport = lazy(() => import("../../views/dashboard/Reports/forexReport"));


const CompanyWiseBills = lazy(() => import('../../views/dashboard/Reports/CompanyWiseBills'))
const DashboardAvailabilityMatrix = lazy(() =>
  import("../../views/dashboard/availabilityMatrix")
);
const DashboardRoomManagement = lazy(() =>
  import("../../views/dashboard/roomManagement")
);
// const DashboardOutOfOrder = lazy(() =>
//   import("../../views/dashboard/roomManagement/outOfOrder")
// );
const DashboardOutOFService = lazy(() =>
  import("../../views/dashboard/roomManagement/outOfService")
);

const ProductivityBusinessAgent = lazy(() => import("../../views/dashboard/Reports/productivityBusinessAgent"));

const DashboardRoomStatus = lazy(() =>
  import("../../views/dashboard/roomManagement/roomStatus")
);

const BTCInvoices = lazy(() => import("../../views/dashboard/BTCInvoices"));

const SalesReport = lazy(() => import('../../views/dashboard/POSReports/SalesReport'))
const VoidKOTReport = lazy(() => import('../../views/dashboard/POSReports/VoidKOTReport'))

const HousekeepingStatus = lazy(() =>
  import("../../views/dashboard/roomManagement/housekeepingview")
);

const DashboardOccupancy = lazy(() =>
  import("../../views/dashboard/occupancy/subMatrix")
);

const DashboardRoomStatusLogs = lazy(() =>
  import("../../views/dashboard/roomManagement/roomStatusLogs")
);
const DashboardRoomListView = lazy(() =>
  import("../../views/dashboard/roomManagement/roomListView")
);

const ResCancellation = lazy(() => import("../../views/dashboard/Reports/ResCancellation"));


const DashboardNigthAudit = lazy(() =>
  import("../../views/dashboard/nightAudit")
);
const DashboardNigthAuditCopy = lazy(() =>
  import("../../views/dashboard/nightAuditCopy")
);
// const DashboardFrontDeskTest = lazy(() =>
//   import("../../views/dashboard/TestAvailability")
// );
const DashboardTestFrontDesk = lazy(() => import('../../views/dashboard/testFrontDesk'))
const DashboardUnsettleBills = lazy(() =>
  import("../../views/dashboard/unSettledBills")
);
const DashboardRollOverReservation = lazy(() =>
  import("../../views/dashboard/rollOverReservation")
);

// const DashboardPrint = lazy(() => import('../../views/dashboard/print'))

// const ConfirmationCard = lazy(() => import('../../views/dashboard/TestAvailability/confirmationCardPrint'))

const InvoicePrint = lazy(() => import("../../views/dashboard/confirmationinvoice/print"));


const InvoicePrint1 = lazy(() => import("../../views/dashboard/registrationcardinvoice/print"));

const InvoicePrint6 = lazy(() => import("../../views/dashboard/eregistrationcardinvoice/print"));



const InvoicePrint2 = lazy(() => import("../../views/dashboard/proformacardinvoice/print"));

const InvoicePrint3 = lazy(() => import("../../views/dashboard/receiptinvoice/print"));


const InvoicePrint11 = lazy(() => import("../../views/dashboard/invoice2/print"));

const DashboardInventoryRates = lazy(() =>
  import("../../views/dashboard/inventoryRates")
);

const DashboardSellControlRooms = lazy(() =>
  import("../../views/dashboard/sellControlRooms")
);

const Reservation = lazy(() => import("../../views/dashboard/reservation"));
const DashboardRoomPosting = lazy(() =>
  import("../../views/dashboard/roomPosting")
);

//Nayana
/////////////////////////////// Post Transactions /////////////////////////////////////

const Billing = lazy(() => import('../../views/dashboard/testFrontDesk/Billing'))
const BillTemplate = lazy(() => import('../../views/dashboard/testFrontDesk/BillTemplate'))
const PaymentReceipt = lazy(() => import('../../views/dashboard/testFrontDesk/PaymentReceipt'))

const Transactions = lazy(() => import("../../views/dashboard/AllTransactions"));
const Invoices = lazy(() => import("../../views/dashboard/AllInvoices"));
const Payments = lazy(() => import("../../views/dashboard/AllPayments"));
const PaidOuts = lazy(() => import("../../views/dashboard/AllPaidOuts"));
//////////////////////////////// Reports ////////////////////////////////////////////////
const FlashReport = lazy(() => import('../../views/dashboard/Reports/FlashReport'))
const HistoryForecast = lazy(() => import('../../views/dashboard/Reports/HistoryForecast'))
const ZOHOPosting = lazy(() => import('../../views/dashboard/Reports/ZOHOBook_Posting'))
const ZOHOInvoicePosting = lazy(() => import('../../views/dashboard/Reports/ZOHO_Invoice_Posting'))
const GuestLedger = lazy(() => import('../../views/dashboard/Reports/GuestLedger'))
// const RevenueWithTax = lazy(() => import('../../views/dashboard/Reports/RevenueWithTax'))
const PlanReport = lazy(() => import('../../views/dashboard/Reports/PlanReport'))

const OnHoldFolioBilling = lazy(() => import('../../views/dashboard/testFrontDesk/OnHoldInvBilling'))
const OnHoldFolio = lazy(() => import('../../views/dashboard/testFrontDesk/OnHoldFolio'))
const DashboardLostAndFoundItems = lazy(() => import('../../views/dashboard/lostAndFoundItem'))
const BooksInvPosting = lazy(() => import("../../views/dashboard/BooksInvPosting"));
const BooksJVPosting = lazy(() => import("../../views/dashboard/BooksJVPosting"));

// Nidhi//
// const Reports = lazy(() => import("../../views/dashboard/reports"));
const InhouseGuestBirthdays = lazy(() => import("../../views/dashboard/Reports/inhouseGuestBirthdays"));
const InhouseGuestAnniversary = lazy(() => import("../../views/dashboard/Reports/inhouseGuestAnniversary"));
const InhouseGuestCompany = lazy(() => import("../../views/dashboard/Reports/inhouseGuestCompany"));
const InhouseGuestNationality = lazy(() => import("../../views/dashboard/Reports/inhouseGuestNationality"));
const InhouseGuestRoom = lazy(() => import("../../views/dashboard/Reports/inHouseGuestRoom"));
const NoShow = lazy(() => import("../../views/dashboard/Reports/noShow"));
const AirportPickUps = lazy(() => import("../../views/dashboard/Reports/airportPickUps"));
const AirportDrops = lazy(() => import("../../views/dashboard/Reports/airportDrops"));
const Cancellation = lazy(() => import("../../views/dashboard/Reports/cancellation"));
const InhouseGuestReports = lazy(() => import("../../views/dashboard/Reports/inHouseGuest"));
const CformReport = lazy(() => import("../../views/dashboard/Reports/cformReport"));
const ArrivalReports = lazy(() => import("../../views/dashboard/Reports/arrivalsReport"));
const ArrivalsVipReports = lazy(() => import("../../views/dashboard/Reports/arrivalsVip"));
const AllowanceReports = lazy(() => import("../../views/dashboard/Reports/allowanceReport"));
const ExtraBed = lazy(() => import("../../views/dashboard/Reports/extraBed"));
const GuestBalance = lazy(() => import("../../views/dashboard/Reports/guestBalanceReport"));
const VaccantRoom = lazy(() => import("../../views/dashboard/Reports/vaccantRooms"));
const NoShowReport = lazy(() => import("../../views/dashboard/Reports/noShow"));
const DepartureReport = lazy(() => import("../../views/dashboard/Reports/departurereport"));
const FOSettlementUserreport = lazy(() => import("../../views/dashboard/Reports/fosettlementuser"));
const SettelmentSummaryForDay = lazy(() => import("../../views/dashboard/Reports/settlementForDay"));
const PaidOutreport = lazy(() => import("../../views/dashboard/Reports/paidoutReport"));
const MarketProductivityReport = lazy(() => import('../../views/dashboard/Reports/marketProductivityReport'))
const SourceProductivityReport = lazy(() => import('../../views/dashboard/Reports/sourceProductivity'))
const RevenueWithTax = lazy(() => import('../../views/dashboard/Reports/RevenueWithTax'))
const TrailBalance = lazy(() => import("../../views/dashboard/Reports/trailBalance"));
const DashboardRoomDiscrepancy = lazy(() => import("../../views/dashboard/roomManagement/discrepancy"));
const AdvanceReceivedReport = lazy(() => import("../../views/dashboard/Reports/AdvanceReceivedReport"));
const AdvanceSettledReport = lazy(() => import("../../views/dashboard/Reports/AdvanceSettledReport"));

// Gowri
const LongStayGuestreport = lazy(() => import("../../views/dashboard/Reports/longStayGuestReport"));
const HouseUseGuestreport = lazy(() => import("../../views/dashboard/Reports/houseUseGuestReport"));
const FOSettlementbillwise = lazy(() => import("../../views/dashboard/Reports/fosettlementbillwise"));
const CashsettlementReport = lazy(() => import("../../views/dashboard/Reports/cashsettlement"));
const RoomStatusReport = lazy(() => import("../../views/dashboard/Reports/roomstatus"));
const MultipleBillSettlement = lazy(() => import("../../views/dashboard/Reports/multipleBillsettlement"));

//////////////////////////////// POS Reports ////////////////////////////////////////////////

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
const POSGuestDetails = lazy(() => import('../../views/dashboard/POSReports/posGuestDetail'))
const SellForex = lazy(() => import('../../views/dashboard/forex/sellforex'))
const DailyForex = lazy(() => import('../../views/dashboard/forex/dailyForex'))
const MultipleBillPOSReport = lazy(() => import("../../views/dashboard/POSReports/multipleforpos"));
const PaymentForDayReport = lazy(() => import("../../views/dashboard/POSReports/PaymentForDay"));
const SalesSummaryReport = lazy(() => import('../../views/dashboard/POSReports/SalesSummaryReport'))
const ReprintKOTReport = lazy(() => import("../../views/dashboard/POSReports/reprintKOTreport"));
const POStipsfordaReport = lazy(() => import("../../views/dashboard/POSReports/postipsforday"));
const CompanyProductivityReport = lazy(() => import("../../views/dashboard/Reports/CompnayProductivityReport"));
const StewardSale = lazy(() => import('../../views/dashboard/POSReports/StewardSale'))

const TaskReport = lazy(() => import('../../views/dashboard/housekeepingReports/taskreports'))
const AttendentTaskHoursReport = lazy(() => import('../../views/dashboard/housekeepingReports/attendentTaskHour'))
const JobReport = lazy(() => import('../../views/dashboard/housekeepingReports/jobreports'))
const ConsumableReport = lazy(() => import('../../views/dashboard/housekeepingReports/consumablereports'))
const TaskStatusReport = lazy(() => import('../../views/dashboard/housekeepingReports/taskStatusReport'))
const MinibarConsumption = lazy(() => import('../../views/dashboard/housekeepingReports/minibarConsumption'))
const DiscrepancyReport = lazy(() => import('../../views/dashboard/housekeepingReports/discrepencyReport'))


const Radiuswifiserver = lazy(() => import('../../views/dashboard/radiuswifiserver'))
const DashboardDynamicPrising = lazy(() => import("../../views/dashboard/dynamicPrising"));
const GuestFeedbackOSAT = lazy(() => import('../../views/dashboard/guestFeedbackReport'))


const GuestComplaint = lazy(() => import('../../views/dashboard/guestComplaint/complaintData'));
const GuestComplaintDashboard = lazy(() => import('../../views/dashboard/guestComplaint/complaintDashboard'));
const RevenueComparison = lazy(() => import('../../views/dashboard/RevenueComparison'))


const GroupReservation = lazy(() => import("../../views/dashboard/groupReservation/enquiryCreate"))
const AllGroupReservations = lazy(() => import("../../views/dashboard/groupReservation/allGroupReservation"))
const CompanryTracker = lazy(() => import('../../views/dashboard/Reports/companiesTracker'))
const MealPlanReport = lazy(() => import("../../views/dashboard/Reports/mealPlanReport"))
const GuestComplaintConfiguration = lazy(() => import('../../views/dashboard/guestComplaint/configuration'));
const NewPosLoyaltyMembership = lazy(() => import('../../views/dashboard/newMembership'))
const PosLoyalty = lazy(() => import('../../views/dashboard/posloyalty'))
const PosVoucher = lazy(() => import('../../views/dashboard/posvoucher'))
const ReservationPickupReport = lazy(() => import("../../views/dashboard/Reports/reservationPickupReport"));
// const AccountManagerWiseSaleReport = lazy(() => import("../../views/dashboard/Reports/accountManagerwiseSaleReport"));
const EarlyDepartureReport = lazy(() => import("../../views/dashboard/Reports/earlydepartureReport"));
const ReservationWiseRevenue = lazy(() => import("../../views/dashboard/Reports/ReservationWiseRevenue"));
const InHouseCaptureRatioReport = lazy(() => import('../../views/dashboard/POSReports/IHGRatio'));
const GuestComplaintReport = lazy(() => import('../../views/dashboard/guestComplaint/complainDataReport'));
const InvoicesSummary = lazy(() => import("../../views/dashboard/InvoicesSummary"));
// const DashboardFeedBack = lazy(() => import('../../views/dashboard/feedBack'));
const DashboardFeedBack = lazy(() => import('../../views/dashboard/feedBack'));
const DashboardForFeedBack = lazy(() => import("../../views/dashboard/DashboardFeedback"));
const InventoryView = lazy(() => import('../../views/dashboard/inventoryView'));
const InventoryViewNew = lazy(() => import('../../views/dashboard/inventoryViewNew'));
const GuestMembership = lazy(() => import("../../views/dashboard/Reports/guestMembership"));
const DashboardReservationLogs = lazy(() => import('../../views/dashboard/modificationLog'));
const GroupRevenueTransactions = lazy (() => import("../../views/dashboard/Reports/GroupRevenueTransactions"))
const PastGuestNationality = lazy(() => import("../../views/dashboard/Reports/pastGuestNationality"));
const ReservationStayLogs = lazy(() => import("../../views/dashboard/Reports/reservationStayLogs"));
const InventoryLedger = lazy(() => import("../../views/dashboard/inventoryLedger"));
const GuestDetails = lazy(() => import('../../views/apps//guestProfile'))
const DashboardAutoNigthAudit = lazy(() =>  import("../../views/dashboard/autoNightAudit"));
const DashboardNigthAuditLogs = lazy(() =>  import("../../views/dashboard/nightAuditLogs"));
const RoomTypeWiseDetails = lazy(() =>  import("../../views/dashboard/BookingEngineConfig/roomTypeWiseDetails"));
const RoomAmeneties = lazy(() =>  import("../../views/dashboard/BookingEngineConfig/roomAmeneties"));
const RoomDetails = lazy(() =>  import("../../views/dashboard/BookingEngineConfig/roomDetails"));
const RoomTypeImages = lazy(() =>  import("../../views/dashboard/BookingEngineConfig/roomTypeImages"));

const DashboardRoutes = [
  {
    path: '/dashboard/BookingEngineConfig/roomTypeWiseDetails',
    element: <RoomTypeWiseDetails />
  },
   {
    path: '/dashboard/BookingEngineConfig/roomTypeImages',
    element: <RoomTypeImages />
  },
  {
    path: '/dashboard/BookingEngineConfig/roomAmeneties',
    element: <RoomAmeneties />
  },
  {
    path: '/dashboard/BookingEngineConfig/roomDetails',
    element: <RoomDetails />
  },
   {
    path: '/dashboard/groupreservation/createenquiry',
    element: <GroupReservation />
  },
  {
    path: '/dashboard/departmentconfiguration',
    element: <GuestComplaintConfiguration />
  },
  {
    path: '/reports/mealplanreport',
    element: <MealPlanReport />,
    meta: {
      appLayout: false,
      className: 'configuration-application'
    }
  },
    {
    element: <GuestDetails />,
    path: '/dashboard/guestProfile',
    meta: {
      appLayout: false,
      className: 'configuration-application'
    }
  },
  {
    path: '/dashboard/GroupTransactions',
    element: <GroupRevenueTransactions/>
  },
  {
    path: '/dashboard/groupreservation/allgroupreservations',
    element: <AllGroupReservations />
  },
  {
    path: '/dashboard/companytracker',
    element: <CompanryTracker />

  },
  {
    path: '/RevenueComparison',
    element: <RevenueComparison />
  },
  {
    path: '/dashboard/newMembership',
    element: <NewPosLoyaltyMembership />
  },
  {
    path: '/dashboard/posloyalty',
    element: <PosLoyalty />
  },
  {
    path: '/dashboard/posvoucher',
    element: <PosVoucher />
  },
  {
    path: '/dashboard/guestcomplaint',
    element: <GuestComplaint />
  },
  {
    path: '/dashboard/guestcomplaintdashboard',
    element: <GuestComplaintDashboard />
  },
  {
    path: "/dashboard/analytics",
    element: <DashboardAnalytics />,
  },
  {
    path: "/dashboard/ecommerce",
    element: <DashboardEcommerce />,
  },
  {
    path: "/dashboard/guestfeedback",
    element: <GuestFeedbackOSAT />,
  },
  {
    path: "/dashboard/Reports/ReservationWiseRevenue",
    element: <ReservationWiseRevenue />,
  },
  {
    path: '/dashboard/radiuswifiserver',
    element: <Radiuswifiserver />

  },
  {
    path: "/dashboard/inventoryView",
    element: <InventoryView />,
  },
   {
    path: "/dashboard/inventoryLedger",
    element: <InventoryLedger/>,
  },
  {
    path: "/dashboard/inventoryViewNew",
    element: <InventoryViewNew />,
  },
  {
    path: "/dashboard/dynamicPricing",
    element: <DashboardDynamicPrising />,
  },
  // {
  //   path: '/dashboard/print',
  //   element: <DashboardPrint />
  // },
  {
    path: '/dashboard/frontdesk',
    element: <DashboardTestFrontDesk />
  },
  {
    path: "/dashboard/feedback",
    element: <DashboardFeedBack />,
  },
  {
    path: "/dashboard/DashboardFeedback",
    element: <DashboardForFeedBack />,
  },
  {
    path: "/dashboard/houseUseDashboard",
    element: <DashboardHouseUseDashboard />,
  },
  {
    path: '/dashboard/RestaurantPerformance',
    element: <RestaurantPerformance />,
  },
  {
    path: '/MainDashboard',
    element: <MainDashboard />
  },
  {
    path: '/ProductivityDashboard',
    element: <ProductivityDashboard />
  },

  {
    path: '/dashboard/BooksInvPosting',
    element: <BooksInvPosting />
  },

  // {
  //   path: "/dashboard/TestAvailability",
  //   element: <DashboardFrontDeskTest />,
  // },
  // {
  //   path: '/dashboard/TestAvailability/confirmationCardPrint',
  //   element: <ConfirmationCard />
  // },
  // {
  //   path: "/dashboard/Reports/accountManagerwiseSaleReport",
  //   element: <AccountManagerWiseSaleReport/>,
  // },
  {
    element: <TaskReport />,
    path: '/dashboard/housekeepingreports/tasksReport'
  },
  {
    element: <AttendentTaskHoursReport />,
    path: '/dashboard/housekeepingreports/attendentTaskHour'
  },
  {
    element: <JobReport />,
    path: '/dashboard/housekeepingreports/jobsReport'
  },
  {
    element: <ConsumableReport />,
    path: '/dashboard/housekeepingreports/consumablesReport'
  },
  {
    element: <TaskStatusReport />,
    path: '/dashboard/housekeepingreports/taskstatusreport'
  },
  {
    element: <MinibarConsumption />,
    path: '/dashboard/housekeepingreports/minibarreport'
  },
  {
    element: <DiscrepancyReport />,
    path: '/dashboard/housekeepingreports/discrepancyreport'
  },
  {
    path: "/dashboard/roomManagement",
    element: <DashboardRoomManagement />,
  },
  {
    path: '/dashboard/CompanyWiseBills',
    element: <CompanyWiseBills />
  },
  {
    path: "/dashboard/Reports/reservationPickupReport",
    element: <ReservationPickupReport />,
  },
  // {
  //   path: "/dashboard/roomManagement/outOfOrder",
  //   element: <DashboardOutOfOrder />,
  // },
  {
    path: "/dashboard/roomManagement/outOfService",
    element: <DashboardOutOFService />,
  },
  {
    path: "/dashboard/roomManagement/roomListView",
    element: <DashboardRoomListView />,
  },
  {
    path: "/dashboard/roomManagement/housekeepingstatus",
    element: <HousekeepingStatus />,
  },
  {
    path: '/dashboard/BooksJVPosting',
    element: <BooksJVPosting />
  },
  {
    path: "/dashboard/roomManagement/roomStatusLogs",
    element: <DashboardRoomStatusLogs />,
  },
  {
    path: "/dashboard/roomManagement/discrepancy",
    element: <DashboardRoomDiscrepancy />,
  },
  {
    path: '/dashboard/Reports/advancereceivedreport',
    element: <AdvanceReceivedReport />
  },
  {
    path: '/dashboard/Reports/reservationStayLogs',
    element: <ReservationStayLogs />
  },
  {
    path: '/dashboard/Reports/advancesettledreport',
    element: <AdvanceSettledReport />
  },
  {
    path: "/dashboard/nightAudit",
    element: <DashboardNigthAudit />,
  },
    {
    path: "/dashboard/autoNightAudit",
    element: <DashboardAutoNigthAudit />,
  },
      {
    path: "/dashboard/nightAuditLogs",
    element: <DashboardNigthAuditLogs />,
  },
  {
    path: "/dashboard/nightAuditCopy",
    element: <DashboardNigthAuditCopy />,
  },

  {
    path: "/dashboard/availabilityMatrix",
    element: <DashboardAvailabilityMatrix />,
  },
  {
    path: "/dashboard/roomManagement/roomStatus",
    element: <DashboardRoomStatus />,
  },

  {
    path: "/dashboard/forex/sellforex",
    element: <SellForex />,
  },
  {
    path: "/dashboard/forex/dailyforex",
    element: <DailyForex />,
  },
  {
    path: '/dashboard/BTCInvoices',
    element: <BTCInvoices />
  },
  {
    path: '/dashboard/InvoicesSummary',
    element: <InvoicesSummary />
  },

  //Hrishikesh code
  {
    path: "/dashboard/reservation",
    element: <Reservation />,
  },
  {
    path: '/dashboard/lostAndFoundItems',
    element: <DashboardLostAndFoundItems />
  },


  {
    path: "/dashboard/inventoryRates",
    element: <DashboardInventoryRates />,
  },
  {
    path: "/dashboard/occupancy",
    element: <DashboardOccupancy />,
  },
  {
    path: "/dashboard/roomPosting",
    element: <DashboardRoomPosting />,
  },
  {
    path: "/dashboard/unSettledBills",
    element: <DashboardUnsettleBills />,
  },
  {
    path: "/dashboard/rolloverreservation",
    element: <DashboardRollOverReservation />,
  },

  {
    path: "/dashboard/modificationLog",
    element: <DashboardReservationLogs />,
  },


  {
    path: "/dashboard/confirmationinvoice/print",
    element: <InvoicePrint />,
    meta: {
      layout: "blank",
    },
  },


  {
    path: "/dashboard/registrationcardinvoice/print",
    element: <InvoicePrint1 />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/dashboard/eregistrationcardinvoice/print",
    element: <InvoicePrint6 />,
    meta: {
      layout: "blank",
    },
  },

  {
    path: "/dashboard/receiptinvoice/print",
    element: <InvoicePrint3 />,
    meta: {
      layout: "blank",
    },
  },


  {
    path: "/dashboard/proformacardinvoice/print",
    element: <InvoicePrint2 />,
    meta: {
      layout: "blank",
    },
  },

  {
    path: "/dashboard/invoice2/print",
    element: <InvoicePrint11 />,
    meta: {
      layout: "blank",
    },
  },

  //Nayana
  ////////////////////////// Post Transactions /////////////////////////////
  {
    path: '/dashboard/frontdesk/Billing',
    element: <Billing />
  },
  {
    path: '/dashboard/frontdesk/BillTemplate',
    element: <BillTemplate />,
    meta: {
      layout: 'blank'
    }
  },
  // {
  //   path: '/dashboard/testFrontDesk/PaymentReceipt',
  //   element: <PaymentReceipt/>
  // },
  {
    path: '/dashboard/frontdesk/PaymentReceipt',
    element: <PaymentReceipt />,
    meta: {
      layout: 'blank'
    }
  },
  {
    path: '/dashboard/Transactions',
    element: <Transactions />
  },
  {
    path: '/dashboard/Invoices',
    element: <Invoices />
  },
  {
    path: '/dashboard/Payments',
    element: <Payments />
  },
  {
    path: '/dashboard/PaidOuts',
    element: <PaidOuts />
  },
  {
    path: '/dashboard/FlashReport',
    element: <FlashReport />
  },
  {
    path: '/dashboard/HistoryForecast',
    element: <HistoryForecast />
  },
  {
    path: '/dashboard/ZOHOPosting',
    element: <ZOHOPosting />
  },
  {
    path: '/dashboard/ZOHOInvoicePosting',
    element: <ZOHOInvoicePosting />
  },
  {
    path: '/dashboard/GuestLedger',
    element: <GuestLedger />
  },
  {
    path: '/dashboard/PlanReport',
    element: <PlanReport />
  },
  {
    path: '/dashboard/marketProductivityReport',
    element: <MarketProductivityReport />
  },
  {
    path: '/dashboard/sourceProductivity',
    element: <SourceProductivityReport />
  },
  {
    path: '/dashboard/complainDataReport',
    element: <GuestComplaintReport />
  },
  {
    path: "/dashboard/Reports/productivityBusinessAgent",
    element: <ProductivityBusinessAgent />,
  },
  {
    path: "/dashboard/Reports/earlydepartureReport",
    element: <EarlyDepartureReport />,
  },
  {
    path: "/dashboard/Reports/CompanyProductivityReport",
    element: <CompanyProductivityReport />,
  },
  //////////Nidhi
  {
    path: "/dashboard/Reports/inhouseGuestBirthdays",
    element: <InhouseGuestBirthdays />,
  },

  {
    path: "/dashboard/Reports/guestMembership",
    element: <GuestMembership />,
  },
  {
    path: "/dashboard/Reports/inhouseGuestAnniversary",
    element: <InhouseGuestAnniversary />,
  },
  {
    path: "/dashboard/Reports/inhouseGuestCompany",
    element: <InhouseGuestCompany />,
  },
  {
    path: "/dashboard/Reports/inhouseGuestNationality",
    element: <InhouseGuestNationality />,
  },
  {
    path: "/dashboard/Reports/pastGuestNationality",
    element: <PastGuestNationality />,
  },
  {
    path: "/dashboard/Reports/inHouseGuestRoom",
    element: <InhouseGuestRoom />,
  },
  {
    path: "/dashboard/Reports/noShow",
    element: <NoShow />,
  },
  {
    path: "/dashboard/Reports/ResCancellation",
    element: <ResCancellation />,
  },
  {
    path: "/dashboard/Reports/settlementForDay",
    element: <SettelmentSummaryForDay />,
  },
  {
    path: "/dashboard/Reports/airportPickUps",
    element: <AirportPickUps />,
  },
  {
    path: "/dashboard/Reports/airportDrops",
    element: <AirportDrops />,
  },
  {
    path: "/dashboard/Reports/cancellation",
    element: <Cancellation />,
  },
  {
    path: "/dashboard/Reports/inHouseGuest",
    element: <InhouseGuestReports />,
  },
  {
    path: '/dashboard/Reports/RevenueWithTax',
    element: <RevenueWithTax />
  },
  {
    path: "/dashboard/Reports/cformReport",
    element: <CformReport />,
  },
  {
    path: "/dashboard/Reports/arrivalsReport",
    element: <ArrivalReports />,
  },
  {
    path: "/dashboard/Reports/arrivalsVip",
    element: <ArrivalsVipReports />,
  },
  {
    path: "/dashboard/Reports/cancellation",
    element: <Cancellation />,
  },
  {
    path: '/dashboard/Reports/inhouseguestvip',
    element: <InhouseGuestVipReports />
  },

  {
    path: "/dashboard/Reports/allowanceReport",
    element: <AllowanceReports />,
  },
  {
    path: "/dashboard/Reports/vaccantRooms",
    element: <VaccantRoom />,
  },
  {
    path: "/dashboard/Reports/guestBalanceReport",
    element: <GuestBalance />,
  },
  {
    path: "/dashboard/Reports/extraBed",
    element: <ExtraBed />,
  },
  {
    path: "/dashboard/Reports/trailBalance",
    element: <TrailBalance />,
  },
  {
    path: "/dashboard/Reports/noShow",
    element: <NoShow />,
  },
  {
    path: "/dashboard/Reports/fosettlementuser",

    element: <FOSettlementUserreport />,
  },
  {
    path: "/dashboard/Reports/paidoutReport",
    element: <PaidOutreport />,
  },
  {
    path: "/dashboard/Reports/wakeUpCallReport",
    element: <WakeUpCallreport />,
  },
  {
    path: "/dashboard/Reports/forexReport",
    element: <Forexreport />,
  },
  {
    path: "/dashboard/Reports/departurereport",
    element: <DepartureReport />,
  },
  //////////////////////////gouri////////////////////////////////
  {
    path: "/dashboard/Reports/longStayGuestReport",
    element: <LongStayGuestreport />,
  },
  {
    path: "/dashboard/Reports/houseUseGuestReport",
    element: <HouseUseGuestreport />,
  },
  {
    path: "/dashboard/Reports/cashsettlement",
    element: <CashsettlementReport />,
  },
  {
    path: "/dashboard/Reports/fosettlementbillwise",
    element: <FOSettlementbillwise />,
  },

  {
    path: "/dashboard/Reports/roomstatus",
    element: <RoomStatusReport />,
  },
  {
    path: "/dashboard/Reports/multipleBillsettlement",
    element: <MultipleBillSettlement />,
  },

  {
    path: '/dashboard/posreports/FnBNCReport',
    element: <FnBNCReport />
  },
  {
    path: '/dashboard/posreports/InHouseCaptureRatio',
    element: <InHouseCaptureRatioReport />
  },
  {
    path: '/dashboard/posreports/KOTReport',
    element: <KOTReport />
  },
  {
    path: '/dashboard/posreports/DiscountReport',
    element: <DiscountReport />
  },
  {
    path: '/dashboard/posreports/CancelBillReport',
    element: <CancelBillReport />
  },
  {
    path: '/dashboard/posreports/CoverAnalysisReport',
    element: <CoverAnalysisReport />
  },
  {
    path: '/dashboard/posreports/CollectionSummaryReport',
    element: <CollectionSummaryReport />
  },

  {
    path: "/dashboard/sellControlRooms",
    element: <DashboardSellControlRooms />,
  },

  {
    path: '/dashboard/posreports/ItemwiseSaleReport',
    element: <ItemwiseSaleReport />
  },
  {
    path: '/dashboard/posreports/NCKotReport',
    element: <NCKotReport />
  },
  {
    path: '/dashboard/posreports/ConsolidatedSalesSettelmentReport',
    element: <ConsolidatedSalesSettelmentReport />
  },
  {
    path: '/dashboard/posreports/SettelmentSummaryReport',
    element: <SettelmentSummaryReport />
  },
  {
    path: '/dashboard/posreports/ConsolidatedCollectionReport',
    element: <ConsolidatedCollectionReport />
  },
  {
    path: '/dashboard/posreports/SalesReport',
    element: <SalesReport />
  },
  {
    path: '/dashboard/posreports/VoidKOTReport',
    element: <VoidKOTReport />
  },
  {
    path: '/dashboard/posreports/posguestdetails',
    element: <POSGuestDetails />
  },
  {
    path: "/dashboard/posreports/multipleforpos",
    element: <MultipleBillPOSReport />,
  }, {
    path: "/dashboard/posreports/PaymentForDay",
    element: <PaymentForDayReport />,
  },
  {
    path: '/dashboard/posreports/SalesSummaryReport',
    element: <SalesSummaryReport />
  },
  {
    path: "/dashboard/posreports/reprintKOTreport",
    element: <ReprintKOTReport />,
  },
  {
    path: "/dashboard/posreports/postipsforday",
    element: <POStipsfordaReport />,
  },
  {
    path: '/dashboard/posreports/StewardSale',
    element: <StewardSale />
  },
  {
    path: '/dashboard/OnHoldFolio',
    element: <OnHoldFolio />
  },
  {
    path: '/dashboard/OnHoldFolioBilling',
    element: <OnHoldFolioBilling />
  },
  // {
  //   path: '/dashboard/GuestLedger',
  //   element: <GuestLedger/>
  // },
  // {
  //   path: '/dashboard/RevenueWithTax',
  //   element: <RevenueWithTax/>
  // },
];

export default DashboardRoutes;
