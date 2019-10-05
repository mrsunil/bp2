namespace LDC.Atlas.Authorization.Core.Common
{
    public static class AtlasPrivileges
    {
        public static class TradesPrivileges
        {
            // Level 1
            public const string Trades = "Trades";

            // Level 2
            public const string TradesPhysicals = "Physicals";
            public const string CostMatrices = "CostMatrices";
            public const string MainTab = "MainTab";
            public const string CostTab = "CostTab";
            public const string StatusTab = "StatusTab";
            public const string TrafficTab = "TrafficTab";
            public const string FxDeals = "FxDeals";

            // Level 3
            public const string AllocateDeallocate = "AllocateDeallocate";
            public const string CreateTrade = "CreateTrade";
            public const string ImageCreation = "ImageCreation";
            public const string DeleteCostInvoiceMarking = "DeleteCostInvoiceMarking";
            public const string DeleteInvoiceMarking = "DeleteInvoiceMarking";
            public const string DeleteCosts = "COSTSDEL";
            public const string AmendSnapshot = "AmendSnapshot";

            public const string GenerateContractAdvice = "GenerateContractAdvice";
            public const string CreateTrancheSplit = "CreateTrancheSplit";
            public const string ApproveTrade = "ApproveTrade";
            public const string TradeDeletion = "TradeDeletion";
            public const string BuyerCode = "BuyerCode";
            public const string SellerCode = "SellerCode";
            public const string CounterPartyReference = "CounterPartyReference";
            public const string Commodity = "Commodity";
            public const string CropYear = "CropYear";
            public const string QuantityCode = "QuantityCode";
            public const string Quantity = "Quantity";
            public const string QuantityContracted = "QuantityContracted";
            public const string ContractTerms = "ContractTerms";
            public const string PortTerms = "PortTerms";
            public const string Arbitration = "Arbitration";
            public const string Currency = "Currency";
            public const string PriceCode = "PriceCode";
            public const string ContractPrice = "ContractPrice";
            public const string ContractValue = "ContractValue";
            public const string PaymentTerms = "PaymentTerms";
            public const string PeriodType = "PeriodType";
            public const string FromDate = "FromDate";
            public const string ToDate = "ToDate";
            public const string PositionType = "PositionType";
            public const string PortOfOrigin = "PortOfOrigin";
            public const string PortOfDestination = "PortOfDestination";
            public const string MarketSector = "MarketSector";
            public const string InternalMemorandum = "InternalMemorandum";
            public const string ContractIssuedOn = "ContractIssuedOn";
            public const string OtherReference = "OtherReference";
            public const string VesselName = "VesselName";
            public const string BlDate = "BlDate";
            public const string BlReference = "BlReference";
            public const string GroupingNumber = "GroupingNumber";
            public const string QuantityForTraffic = "QuantityForTraffic";
            public const string QuantityCodeForTraffic = "QuantityCodeForTraffic";
            public const string EditingCostGrid = "EditingCostGrid";
            public const string DeleteCostMatrices = "DeleteCostMatrices";
            public const string SuperTradeEdition = "SuperTradeEdition";
            public const string DeleteFxDeal = "DeleteFxDeal";
            public const string CreateEditFxDeal = "CreateEditFxDeal";
            public const string CancelReverseTrade = "CancelReverseTrade";
            public const string CloseTrade = "CloseTrade";
        }

        public static class AdminPrivileges
        {
            // Level 1
            public const string Administration = "Administration";

            // Level 2
            public const string GlobalParameters = "GlobalParameters";
            public const string Profiles = "Profiles";
            public const string Users = "Users";
            public const string Operations = "Operations";

            // Level 3
            public const string CreateFunctionalObject = "CreateFunctionalObject";
            public const string AccessLock = "AccessLock";
            public const string InterfaceBuilder = "InterfaceBuilder";
            public const string InterfaceMonitoring = "InterfaceMonitoring";
        }

        public static class ChartersPrivileges
        {
            // Level 1
            public const string Charters = "Charters";

            // Level 2
            public const string CharterView = "ChartersView";

            // Level 3
            public const string AssignOrDeassignContract = "AssignOrDeassignContract";
        }

        public static class MasterDataPrivileges
        {
            // Level 1
            public const string MasterData = "MasterData";
        }

        public static class FinancialPrivileges
        {
            // Level 1
            public const string Financials = "Financials";

            // Level 2
            public const string MarketData = "MarketData";
            public const string CutOff = "CutOff";
            public const string PostingManagement = "POSTINGMGT";
            public const string AccountingEntries = "AccountingEntries";
            public const string InterfaceErrors = "InterfaceErrors";

            // Level 3
            public const string CreateFreeze = "CreateFreeze";
            public const string FrozenDatabase = "FrozenDatabase";
            public const string RecalculateFreeze = "RecalculateFrozenDatabase";
            public const string StartPosting = "STARTPOSTING";
            public const string AuthorizePosting = "AUTHORIZEPOSTING";
            public const string PostopClosed = "POSTOPCLOSED";
            public const string GenerateEndOfMonth = "GenerateEndOfMonth";
            public const string GenerateEndOfYear = "GenerateEndOfYear";
            public const string CloseReverseAccounting = "CloseRevAcc";
            public const string CloseOperation = "CloseOp";
            public const string ReverseOperation = "ReverseOp";
            public const string EditClosureSettingsDialog = "EditClosureSettingsDialog";
            public const string DeleteAccountingDocument = "DELETEACCOUNTINGDOCUMENT";
            public const string GeneratePostings = "GeneratePostings";
            public const string PostingInterface = "PostingInterface";
            public const string ReverseDocument = "ReverseDocument";
            public const string EditAccountingEntries = "EditAccountingEntries";
            public const string EditPostingManagement = "EditPostingManagement";
            public const string CreateEditDocument = "CreateEditDocument";
            public const string CreateDeleteMatchFlag = "CreateDeleteMatchFlag";
            public const string ResendNotPosted = "ResendNotPosted";
            public const string ResendError = "ResendError";
            public const string TagCancel = "TagCancel";
        }

        public static class ReportsPrivileges
        {
            // Level 1
            public const string Reports = "Reports";

            // Level 2
            public const string GlobalReports = "GlobalReports";

            // Level 3
            public const string TradeReport = "TradeReport";
            public const string TradeCostReport = "TradeCostReport";
            public const string TradeCostMovementReport = "TradeCostMovementReport";
            public const string PLReport = "PLReport";
            public const string LDREPManualAdjustmentReport = "LDREPManualAdjustmentReport";
            public const string AuditReport = "AuditReport";
            public const string ClientTransactionReport = "ClientTransactionReport";
            public const string NominalReport = "NominalReport";
            public const string EditReport = "EditReport";
            public const string FxExposureReport = "FxExposureReport";
        }

        public static class CashPrivileges
        {
            // Level 1
            public const string Cash = "Cash";

            // Level 2
            public const string CashPayment = "CashPayment";
            public const string CashReceipt = "CashReceipt";

            // Level 3
            public const string CPSIMPLE = "CPSIMPLE";
            public const string CRSIMPLE = "CRSIMPLE";
            public const string CPPICKTX = "CPPICKTX";
            public const string CRPICKTX = "CRPICKTX";
            public const string CPDIFFCLI = "CPDIFFCLI";
            public const string CPDIFFCCY = "CPDIFFCCY";
            public const string CRDIFFCCY = "CRDIFFCCY";
            public const string CPTraxEdit = "CPTraxEdit";
        }

        public static class ReferentialPrivileges
        {
            // Level 1
            public const string Referential = "Referential";

            // Level 2
            public const string TradingAndExecution = "TradingAndExecution";

            //Level 3
            public const string EditCounterparty = "EditCounterparty";
        }

        public static class InvoicesPrivileges
        {
            // Level 1
            public const string Invoices = "Invoices";

            // Level 2
            public const string InvoiceCreation = "InvoiceCreation";
        }

        public static class ApplicationInterfacesPrivileges
        {
            // Level 1
            public const string ApplicationInterfaces = "ApplicationInterfaces";

            // Level 2
            public const string GenericBackInterface = "GenericBackInterface";
            public const string Batches = "Batches";
            public const string Processor = "Processor";
        }

        public static class CreateTransactionDocument
        {
            public const string TransactionDocument = "TransactionDocument";
        }

        public static class UpdatePostingStatusPolicy
        {
            public const string PostingStatus = "PostingStatus";
        }

        public static class DeleteCostMatrixLinesPolicy
        {
            public const string DeleteCostMatrixLines = "DeleteCostMatrixLines";
        }
    }
}
