using System.Collections.ObjectModel;

namespace LDC.Atlas.Services.PreAccounting.Entities.Bold
{
    public static class FakeCommercialInvoiceRoot
    {
        public static CommercialInvoiceRoot NewCommercialInvoiceRoot()
        {
            return new CommercialInvoiceRoot
            {
                commercialInvoice = new CommercialInvoice
                {
                    SenderId = "ATLAS",
                    InvoiceHeader = new InvoiceHeader
                    {
                        DocumentId = "FromAtlasV2",
                        LegalEntity = "myLegalEntity",
                        ReferenceId = "default",
                        TypeCode = "myTypeCode",
                        TransactionDate = "2018-02-16",
                        DocumentDate = "2018-02-16",
                        CancellationInvoiceIndicator = "myCancellationInvoiceIndicator",
                        TransactionCurreny = "myTranscactionCurrency",
                        DmsId = "myDmsId",
                        Acknowledgement = "true",
                    },
                    InvoiceSublgItem = new ObservableCollection<InvoiceSublgItem>
                    {
                        NewInvoiceSublgItem()
                    },
                    InvoiceLgItem = new ObservableCollection<InvoiceLgItem>
                    {
                        NewInvoiceLgItem()
                    },
                    InvoiceTaxItem = new ObservableCollection<InvoiceTaxItem>
                    {
                        NewInvoiveTaxItem()
                    }
                }
            };
        }

        public static InvoiceSublgItem NewInvoiceSublgItem()
        {
            return new InvoiceSublgItem
            {
                ItemID = "myItemId",
                SubledgerType = "mySubledgerType",
                DebitCard = "myDebitCard",
                CounterpartyId = "myCounterpartyId",
                BusinessDate = "myBusinessDate",
                ProfitCenter = "myProfitCenter",
                InvoiceDueDate = "invoiceDueDate",
                PaymentTerm = "myPaymentTerm",
                ContractTrader = "myContractTrader",
                IntercoPartnerId = "myIntercoPartnerId",
                State = "myState",
                Branch = "myBranch",
                Quantity = "1000",
                Unit = "myUnit",
                VesselName = "myVesselName",
                Incoterms = "myIncoterms",
                Location = "myLocation",
                AmountTransactionCurr = "MyAmountTransactionCurr",
            };
        }

        public static InvoiceLgItem NewInvoiceLgItem()
        {
            return new InvoiceLgItem
            {
                ItemId = "myItemId",
                BusinessDate = "2018-02-16",
                ProfitCenter = "myProfitCenter",
                GlAccount = "myGlAccount",
                CounterpartyId = "myCounterpartyId",
                ContractId = "myContractId",
                ContractItemId = "myContractItemId",
                ContractTrader = "myCOntractTrader",
                Fimmo = "myFimmo",
                Stase = "myStase",
                Branch = "myBranch",
                DischargeCountry = "myDischarge",
                DischargePort = "myDischargePort",
                LoadCountry = "myLoadCountry",
                LoadPort = "myLoadPort",
                Quantity = "1000",
                Unit = "myUnit",
                UnitPrice = "myUnitPrice",
                VesselName = "myVesselName",
                Incoterm = "myIncoterm",
                Location = "myLocation",
                AmountTransactionCurr = "100.5"
            };
        }

        public static InvoiceTaxItem NewInvoiveTaxItem()
        {
            return new InvoiceTaxItem()
            {
                AmountCountryCurr = "myAmountCountryCurr",
                AmountFuncCurr = "myAmountFuncCurr",
                AmountGroupCurr = "myAmountGroupCurr",
                AmountTransactionCurr = "myAmountTransactionCurr",
                Commodity = "myCommodity",
                ContractId = "myContractId",
                ContractItemId = "myContractItemId",
                CountryCurrency = "myCountryCurrency",
                CropYear = "myCropYear",
                FunctCurrency = "myFunctCurrency",
                GroupCurrency = "myGroupCurrency",
                InterCoPartnerId = "myInterCoPartnerId",
                ProfitCenter = "myProfitCenter"
            };
        }
    }
}
