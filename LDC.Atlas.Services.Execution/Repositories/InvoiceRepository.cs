using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Repositories
{
    public class InvoiceRepository : BaseRepository, IInvoiceRepository
    {
        public InvoiceRepository(IDapperContext dapperContext)
                 : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                typeof(InvoiceMarking),
                new ColumnAttributeTypeMapper<InvoiceMarking>());

            SqlMapper.SetTypeMap(
               typeof(InvoiceRecord),
                new ColumnAttributeTypeMapper<InvoiceRecord>());
            SqlMapper.SetTypeMap(
                typeof(InvoiceLineRecord),
                new ColumnAttributeTypeMapper<InvoiceLineRecord>());
        }

        public async Task UpdateInvoiceMarkingAsync(InvoiceMarking invoiceMarking, int? invoiceStatus, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();

            queryParameters.Add("@InvoiceMarkingId", invoiceMarking.InvoiceMarkingId);
            queryParameters.Add("@SectionId", invoiceMarking.SectionId);
            queryParameters.Add("@CostId", invoiceMarking.CostId);
            queryParameters.Add("@CostTypeCode", invoiceMarking.CostType);
            queryParameters.Add("@InvoiceLineId", invoiceMarking.InvoiceLineId);
            queryParameters.Add("@InvoiceDate", invoiceMarking.InvoiceDate);
            queryParameters.Add("@InvoicingStatusId", invoiceStatus);
            queryParameters.Add("@PostingStatusId", invoiceMarking.PostingStatusId);
            queryParameters.Add("@Quantity", invoiceMarking.Quantity);
            queryParameters.Add("@CurrencyCode", invoiceMarking.CurrencyCode);
            queryParameters.Add("@InvoiceAmount", invoiceMarking.InvoiceAmount);
            queryParameters.Add("@InvoicePercent", invoiceMarking.InvoicePercent);
            queryParameters.Add("@DueDate", invoiceMarking.DueDate);
            queryParameters.Add("@PaymentTermCode", invoiceMarking.PaymentTermCode);
            queryParameters.Add("@PaidAmount", invoiceMarking.PaidAmount);
            queryParameters.Add("@CustomerRef", invoiceMarking.CustomerReference);
            queryParameters.Add("@PaidPercentage", invoiceMarking.PaidPercentage);
            queryParameters.Add("@CashMatchDate", invoiceMarking.CashMatchDate);
            queryParameters.Add("@RemainingAmount", invoiceMarking.RemainingAmount);
            queryParameters.Add("@InvoiceReference", invoiceMarking.InvoiceReference);
            queryParameters.Add(DataVersionIdParameter, invoiceMarking.DataVersionId);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateInvoiceMarking, queryParameters, true);
        }

        public async Task<InvoiceMarking> AddInvoiceMarkingAsync(IEnumerable<InvoiceMarking> invoiceMarking, int? invoiceStatus, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();

            queryParameters.Add("@InvoicingStatusId", invoiceStatus);
            queryParameters.Add("@InvoiceMarking", ConvertToInvoiceMarkingUDTT(invoiceMarking, company));
            var sec = await ExecuteQueryFirstOrDefaultAsync<InvoiceMarking>(StoredProcedureNames.CreateInvoiceMarking, queryParameters, true);
            return sec;
        }

        public async Task UpdateInvoiceMarkingPostingStatusAsync(long transactionDocumentId, int postingStatusId, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add("@PostingStatusId", postingStatusId);
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateInvoiceMarkingPostingStatus, queryParameters, true);
        }

        private static DataTable ConvertToInvoiceMarkingUDTT(IEnumerable<InvoiceMarking> invoiceMarking, string company)
        {
            var udtt = new DataTable();
            udtt.SetTypeName("[Invoicing].[UDTT_InvoiceMarking]");

            var invoiceMarkingId = new DataColumn("[InvoiceMarkingId]", typeof(long));
            udtt.Columns.Add(invoiceMarkingId);

            var sectionId = new DataColumn("SectionId", typeof(long));
            udtt.Columns.Add(sectionId);

            var costId = new DataColumn("CostId", typeof(long));
            udtt.Columns.Add(costId);

            var costType = new DataColumn("[CostTypeCode]", typeof(string));
            udtt.Columns.Add(costType);

            var invoiceLineId = new DataColumn("InvoiceLineId", typeof(long));
            udtt.Columns.Add(invoiceLineId);

            var invoiceDate = new DataColumn("InvoiceDate", typeof(DateTime));
            udtt.Columns.Add(invoiceDate);

            var invoiceReference = new DataColumn("InvoiceReference", typeof(string));
            udtt.Columns.Add(invoiceReference);

            var postingStatusId = new DataColumn("PostingStatusId", typeof(long));
            udtt.Columns.Add(postingStatusId);

            var quantity = new DataColumn("Quantity", typeof(decimal));
            udtt.Columns.Add(quantity);

            var currencyCode = new DataColumn("CurrencyCode", typeof(string));
            udtt.Columns.Add(currencyCode);

            var invoiceAmount = new DataColumn("InvoiceAmount", typeof(decimal));
            udtt.Columns.Add(invoiceAmount);

            var invoicePercent = new DataColumn("InvoicePercent", typeof(decimal));
            udtt.Columns.Add(invoicePercent);

            var dueDate = new DataColumn("DueDate", typeof(DateTime));
            udtt.Columns.Add(dueDate);

            var paymentTermCode = new DataColumn("PaymentTermCode", typeof(string));
            udtt.Columns.Add(paymentTermCode);

            var paidAmount = new DataColumn("PaidAmount", typeof(decimal));
            udtt.Columns.Add(paidAmount);

            var customerRef = new DataColumn("CustomerRef", typeof(string));
            udtt.Columns.Add(customerRef);

            var paidPercentage = new DataColumn("PaidPercentage", typeof(decimal));
            udtt.Columns.Add(paidPercentage);

            var cashMatchDate = new DataColumn("CashMatchDate", typeof(DateTime));
            udtt.Columns.Add(cashMatchDate);

            var remainingAmount = new DataColumn("RemainingAmount", typeof(decimal));
            udtt.Columns.Add(remainingAmount);

            var companyId = new DataColumn("CompanyId", typeof(string));
            udtt.Columns.Add(companyId);

            foreach (var invoices in invoiceMarking)
            {
                var row = udtt.NewRow();

                row[invoiceMarkingId] = invoices.InvoiceMarkingId ?? (object)DBNull.Value;
                row[sectionId] = invoices.SectionId;
                row[costId] = invoices.CostId ?? (object)DBNull.Value;
                row[costType] = invoices.CostType ?? (object)DBNull.Value;
                row[invoiceLineId] = invoices.InvoiceLineId ?? (object)DBNull.Value;
                row[invoiceDate] = invoices.InvoiceDate ?? (object)DBNull.Value;
                row[invoiceReference] = invoices.InvoiceReference ?? (object)DBNull.Value;
                row[postingStatusId] = invoices.PostingStatusId ?? (object)DBNull.Value;
                row[quantity] = invoices.Quantity ?? (object)DBNull.Value;
                row[currencyCode] = invoices.CurrencyCode ?? (object)DBNull.Value;
                row[invoiceAmount] = invoices.InvoiceAmount ?? (object)DBNull.Value;
                row[invoicePercent] = invoices.InvoicePercent ?? (object)DBNull.Value;
                row[dueDate] = invoices.DueDate ?? (object)DBNull.Value;
                row[paymentTermCode] = invoices.PaymentTermCode ?? (object)DBNull.Value;
                row[paidAmount] = invoices.PaidAmount ?? (object)DBNull.Value;
                row[customerRef] = invoices.CustomerReference ?? (object)DBNull.Value;
                row[paidPercentage] = invoices.PaidPercentage ?? (object)DBNull.Value;
                row[cashMatchDate] = invoices.CashMatchDate ?? (object)DBNull.Value;
                row[remainingAmount] = invoices.RemainingAmount ?? (object)DBNull.Value;
                row[companyId] = company;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        public async Task DeleteInvoiceMarkingAsync(string company, long invoiceMarkingId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@InvoiceMarkingId ", invoiceMarkingId);
            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteInvoiceMarking, queryParameters, true);
        }

        public async Task CreateInvoiceAsync(InvoiceRecord invoice, IEnumerable<InvoiceLineRecord> invoiceLines)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@R_ExternalInvoice", invoice.ExternalInvoiceRef);
            queryParameters.Add("@TotalGoodsValue", invoice.TotalGoodsValue);
            queryParameters.Add("@TotalInvoiceValue", invoice.TotalInvoiceValue);
            queryParameters.Add("@InvoiceDate", invoice.InvoiceDate);
            queryParameters.Add("@DueDate", invoice.DueDate);
            queryParameters.Add("@M_Currency", invoice.Currency);
            queryParameters.Add("@E_InvoiceType", (int)invoice.InvoiceType);
            queryParameters.Add("@CompanyId", invoice.CompanyId);
            queryParameters.Add("@M_CounterParty", invoice.CounterpartyCode);
            queryParameters.Add("@M_PaymentTerms", invoice.PaymentTerms);
            queryParameters.Add("@E_QuantityToInvoiceType", invoice.QuantityToInvoiceType);
            queryParameters.Add("@ExternalInhouse", (int)invoice.ExternalInhouse);
            queryParameters.Add("@TotalInvoiceQuantity", invoice.TotalGoodsValue);
            queryParameters.Add("@Template", invoice.Template);
            queryParameters.Add("@InvoiceLines", ToArrayTVP(invoiceLines));
            queryParameters.Add("@PhysicalDocumentId", null);
            queryParameters.Add("@DocumentReference", invoice.DocumentReference);
            queryParameters.Add("@YearNumber", invoice.YearNumber);
            queryParameters.Add("@Year", invoice.InvoiceDate.Year);
            queryParameters.Add("@TransactionDocumentTypeId", invoice.TransactionDocumentTypeId);
            queryParameters.Add("@AuthorizedForPosting", invoice.AuthorizedForPosting);

            queryParameters.Add("@InvoicedocumentTypeId", (int)invoice.InvoiceDocumentType);
            queryParameters.Add("@BankAccountId", invoice.BankAccountId);
            queryParameters.Add("@AgreementDate", invoice.AgreementDate);
            queryParameters.Add("@TransactionDocumentId", 0, DbType.Int64, ParameterDirection.Output);
            queryParameters.Add("@PricingOptionId", invoice.PricingOptionId);
            queryParameters.Add(DataVersionIdParameter, null);

            InvoiceRecord savedInvoice = new InvoiceRecord();
            using (
                var grid = await ExecuteQueryMultipleAsync(
                    StoredProcedureNames.CreateInvoice,
                    queryParameters,
                    true))
            {
                savedInvoice = (await grid.ReadAsync<InvoiceRecord>()).First();
                savedInvoice.Document = (await grid.ReadAsync<DocumentRecord>()).First();
            }

            savedInvoice.InvoiceLabel = invoice.DocumentReference;

            invoice.CostAlternativeCode = savedInvoice.CostAlternativeCode;
            invoice.DepartmentAlternativeCode = savedInvoice.DepartmentAlternativeCode;
            invoice.C2CCode = savedInvoice.C2CCode;
            invoice.TaxInterfaceCode = savedInvoice.TaxInterfaceCode;
            invoice.NominalAlternativeAccount = savedInvoice.NominalAlternativeAccount;
            invoice.InvoiceId = savedInvoice.InvoiceId;
            invoice.InvoiceLabel = savedInvoice.InvoiceLabel;
            invoice.ExternalInvoiceRef = savedInvoice.ExternalInvoiceRef;
            invoice.TotalGoodsValue = savedInvoice.TotalGoodsValue;
            invoice.TotalInvoiceValue = savedInvoice.TotalInvoiceValue;
            invoice.InvoiceDate = savedInvoice.InvoiceDate;
            invoice.DueDate = savedInvoice.DueDate;
            invoice.Currency = savedInvoice.Currency;
            invoice.InvoiceType = savedInvoice.InvoiceType;
            invoice.CounterpartyCode = savedInvoice.CounterpartyCode;
            invoice.PaymentTerms = savedInvoice.PaymentTerms;
            invoice.QuantityToInvoiceType = savedInvoice.QuantityToInvoiceType;
            invoice.ExternalInhouse = savedInvoice.ExternalInhouse;
            invoice.TotalInvoiceQuantity = savedInvoice.TotalInvoiceQuantity;
            invoice.TransactionDocumentId = savedInvoice.TransactionDocumentId;
        }

        /// <summary>
        /// Creates a reversal for a given document AND set the "isreversed" flag to "true"
        /// for this document
        /// </summary>
        /// <param name="invoice">The invoice that has to be reverted</param>
        public async Task<InvoiceRecord> CreateReversalInvoiceAsync(InvoiceRecord invoice)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", invoice.TransactionDocumentId);
            queryParameters.Add("@DocumentTypeId", invoice.TransactionDocumentTypeId);
            queryParameters.Add("@DocumentDate", invoice.InvoiceDate);
            queryParameters.Add("@DocumentReference", invoice.DocumentReference);
            queryParameters.Add("@YearNumberForReversed", invoice.YearNumber);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", invoice.CompanyId);
            queryParameters.Add("@InsertedTransactionDocumentId", 0, DbType.Int64, ParameterDirection.Output);

            InvoiceRecord savedInvoice = new InvoiceRecord();
            using (
                var grid = await ExecuteQueryMultipleAsync(
                    StoredProcedureNames.CreateReversalInvoice,
                    queryParameters,
                    true))
            {
                savedInvoice = (await grid.ReadAsync<InvoiceRecord>()).First();
                if (!grid.IsConsumed)
                {
                    savedInvoice.Document = (await grid.ReadAsync<DocumentRecord>()).FirstOrDefault();
                    savedInvoice.IsPosted = (await grid.ReadAsync<bool>()).First();
                }
            }

            savedInvoice.CompanyId = invoice.CompanyId;
            return savedInvoice;
        }

        public async Task UpdateInvoicePhysicalDocument(long invoiceId, long physicalDocumentId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@InvoiceId", invoiceId);
            queryParameters.Add("@PhysicalDocumentId ", physicalDocumentId);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateInvoicePhysicalDocument, queryParameters, true);
        }

        public async Task<int> GetInvoiceDocumentReferenceValues(string companyId, int transactionDocumentTypeId, int year)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@TransactionDocumentTypeId", transactionDocumentTypeId);
            queryParameters.Add("@Year", year);
            queryParameters.Add("@TransactionTypeYearCounter", 0, DbType.Int32, ParameterDirection.Output);
            await ExecuteNonQueryAsync(StoredProcedureNames.GetDocumentReferenceValue, queryParameters);
            var transactionTypeYearCounter = queryParameters.Get<int>("@TransactionTypeYearCounter");
            return transactionTypeYearCounter;
        }

        public async Task<IEnumerable<CostLine>> AddCostsToTrade(IEnumerable<CostLine> costLines, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@Cost", ConvertToCostUDTT(costLines, company));
            queryParameters.Add("@CompanyId", company);
            var sec = await ExecuteQueryAsync<CostLine>(StoredProcedureNames.CreateCost, queryParameters, true);
            return sec;
        }

        private static DataTable ConvertToCostUDTT(IEnumerable<CostLine> costLines, string company)
        {
            DataTable udtt = new DataTable();
            udtt.SetTypeName("[Trading].[UDTT_Cost]");

            DataColumn costId = new DataColumn("CostId", typeof(long));
            udtt.Columns.Add(costId);

            DataColumn sectionId = new DataColumn("SectionId", typeof(long));
            udtt.Columns.Add(sectionId);

            DataColumn costTypeCode = new DataColumn("CostTypeCode", typeof(string));
            udtt.Columns.Add(costTypeCode);

            DataColumn description = new DataColumn("Description", typeof(string));
            udtt.Columns.Add(description);

            DataColumn supplierCode = new DataColumn("SupplierCode", typeof(string));
            udtt.Columns.Add(supplierCode);

            DataColumn costDirectionId = new DataColumn("CostDirectionId", typeof(int));
            udtt.Columns.Add(costDirectionId);

            DataColumn currencyCode = new DataColumn("CurrencyCode", typeof(string));
            udtt.Columns.Add(currencyCode);

            DataColumn rateTypeId = new DataColumn("RateTypeId", typeof(int));
            udtt.Columns.Add(rateTypeId);

            DataColumn priceUnitId = new DataColumn("PriceUnitId", typeof(long));
            udtt.Columns.Add(priceUnitId);

            DataColumn rate = new DataColumn("Rate", typeof(decimal));
            udtt.Columns.Add(rate);

            DataColumn inPL = new DataColumn("InPL", typeof(bool));
            udtt.Columns.Add(inPL);

            DataColumn noAct = new DataColumn("NoAct", typeof(bool));
            udtt.Columns.Add(noAct);

            DataColumn invoiceStatus = new DataColumn("InvoiceStatus", typeof(short));
            udtt.Columns.Add(invoiceStatus);

            DataColumn narrative = new DataColumn("Narrative", typeof(string));
            udtt.Columns.Add(narrative);

            DataColumn costMatrixLineId = new DataColumn("CostMatrixLineId", typeof(long));
            udtt.Columns.Add(costMatrixLineId);

            DataColumn costMatrixName = new DataColumn("CostMatrixName", typeof(string));
            udtt.Columns.Add(costMatrixName);

            DataColumn origEstPMT = new DataColumn("OrigEstPMT", typeof(decimal));
            udtt.Columns.Add(origEstPMT);

            DataColumn origEstRateTypeId = new DataColumn("OrigEstRateTypeId", typeof(int));
            udtt.Columns.Add(origEstRateTypeId);

            DataColumn origEstPriceUnitId = new DataColumn("OrigEstPriceUnitId", typeof(long));
            udtt.Columns.Add(origEstPriceUnitId);

            DataColumn origEstCurrencyCode = new DataColumn("OrigEstCurrencyCode", typeof(string));
            udtt.Columns.Add(origEstCurrencyCode);

            DataColumn origEstRate = new DataColumn("OrigEstRate", typeof(decimal));
            udtt.Columns.Add(origEstRate);
            DataColumn companyId = new DataColumn("CompanyId", typeof(string));
            udtt.Columns.Add(companyId);

            DataColumn isDraft = new DataColumn("IsDraft", typeof(bool));
            udtt.Columns.Add(isDraft);

            DataColumn createdDateTime = new DataColumn("CreatedDateTime", typeof(DateTime));
            udtt.Columns.Add(createdDateTime);

            DataColumn createdBy = new DataColumn("CreatedBy", typeof(string));
            udtt.Columns.Add(createdBy);

            DataColumn modifiedDateTime = new DataColumn("ModifiedDateTime", typeof(DateTime));
            udtt.Columns.Add(modifiedDateTime);

            DataColumn modifiedBy = new DataColumn("ModifiedBy", typeof(string));
            udtt.Columns.Add(modifiedBy);

            foreach (var costLine in costLines)
            {
                var row = udtt.NewRow();

                row[costId] = costLine.CostId;
                row[sectionId] = costLine.SectionId;
                row[costTypeCode] = costLine.CostTypeCode;
                row[description] = costLine.Description;
                row[supplierCode] = costLine.SupplierCode;
                row[costDirectionId] = costLine.CostDirectionId;
                row[currencyCode] = costLine.CurrencyCode;
                row[rateTypeId] = costLine.RateTypeId;
                row[priceUnitId] = costLine.PriceUnitId == null ? (object)DBNull.Value : costLine.PriceUnitId;
                row[rate] = costLine.Rate;
                row[inPL] = costLine.InPNL;
                row[noAct] = costLine.NoAction;
                row[invoiceStatus] = costLine.InvoiceStatus;
                row[narrative] = costLine.Narrative;
                row[costMatrixLineId] = costLine.CostMatrixLineId;
                row[origEstPMT] = costLine.OriginalEstimatedPMTValue == null ? (object)DBNull.Value : costLine.OriginalEstimatedPMTValue;
                row[origEstRateTypeId] = costLine.OriginalEstRateTypeId == null ? (object)DBNull.Value : costLine.OriginalEstRateTypeId;
                row[origEstPriceUnitId] = costLine.OriginalEstPriceUnitId == null ? (object)DBNull.Value : costLine.OriginalEstPriceUnitId;
                row[origEstCurrencyCode] = costLine.OriginalEstCurrencyCode;
                row[origEstRate] = costLine.OriginalEstRate == null ? (object)DBNull.Value : costLine.OriginalEstRate;
                row[companyId] = company;
                row[isDraft] = costLine.IsDraft;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        private static DataTable ToArrayTVP(IEnumerable<InvoiceLineRecord> values)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[Invoicing].[UDTT_InvoiceLine]");

            DataColumn sectionId = new DataColumn("SectionId", typeof(long));
            table.Columns.Add(sectionId);

            DataColumn dataVersionId = new DataColumn("DataVersionID", typeof(int));
            table.Columns.Add(dataVersionId);

            DataColumn costId = new DataColumn("CostId", typeof(long));
            table.Columns.Add(costId);

            DataColumn invoiceId = new DataColumn("InvoiceId", typeof(long));
            table.Columns.Add(invoiceId);

            DataColumn invoiceLineId = new DataColumn("LineNumber", typeof(int));
            table.Columns.Add(invoiceLineId);

            DataColumn lineQuantity = new DataColumn("Quantity", typeof(decimal));
            table.Columns.Add(lineQuantity);

            DataColumn weightUnitId = new DataColumn("WeightUnitId", typeof(long));
            table.Columns.Add(weightUnitId);

            DataColumn price = new DataColumn("Price", typeof(decimal));
            table.Columns.Add(price);

            DataColumn priceUnitId = new DataColumn("PriceUnitId", typeof(long));
            table.Columns.Add(priceUnitId);

            DataColumn currencyCode = new DataColumn("CurrencyCode", typeof(string));
            table.Columns.Add(currencyCode);

            DataColumn vatCode = new DataColumn("VATCode", typeof(string));
            table.Columns.Add(vatCode);

            DataColumn invoiceLineVat = new DataColumn("VATAmount", typeof(decimal));
            table.Columns.Add(invoiceLineVat);

            DataColumn lineAmount = new DataColumn("LineAmount", typeof(decimal));
            table.Columns.Add(lineAmount);

            DataColumn invoicePercent = new DataColumn("InvoicePercent", typeof(decimal));
            table.Columns.Add(invoicePercent);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    if (value.SectionId != null)
                    {
                        row[sectionId] = value.SectionId;
                    }
                    else
                    {
                        row[sectionId] = DBNull.Value;
                    }

                    row[dataVersionId] = DBNull.Value;

                    if (value.CostId != null)
                    {
                        row[costId] = value.CostId;
                    }
                    else
                    {
                        row[costId] = DBNull.Value;
                    }

                    if (value.InvoiceId != null)
                    {
                        row[invoiceId] = value.InvoiceId;
                    }
                    else
                    {
                        row[invoiceId] = DBNull.Value;
                    }

                    if (value.WeightUnitId != null)
                    {
                        row[weightUnitId] = value.WeightUnitId;
                    }
                    else
                    {
                        row[weightUnitId] = DBNull.Value;
                    }

                    if (value.PriceUnitId != null)
                    {
                        row[priceUnitId] = value.PriceUnitId;
                    }
                    else
                    {
                        row[priceUnitId] = DBNull.Value;
                    }

                    row[invoiceLineId] = value.LineNumber;
                    row[lineQuantity] = value.Quantity;
                    row[price] = value.Price;
                    row[currencyCode] = value.CurrencyCode;
                    row[vatCode] = value.VATCode;
                    row[invoiceLineVat] = value.VATAmount;
                    row[lineAmount] = value.LineAmount;
                    row[invoicePercent] = value.InvoicePercent;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        public async Task<TransactionCreationResponse> CreateTransactionDocument(int transactionDocumentTypeId, DateTime docDate, string currencyCode, bool authorizedForPosting, long? physicalDocumentId, string docRefrence, int yearNumber, int docYear, string company, bool toInterface)
        {
            TransactionCreationResponse response = new TransactionCreationResponse();
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@DocumentDate", docDate);
            queryParameters.Add("@CurrencyCode", currencyCode);
            queryParameters.Add("@TransactionDocumentTypeId", transactionDocumentTypeId);
            queryParameters.Add("@AuthorizedForPosting", authorizedForPosting);
            queryParameters.Add("@PhysicalDocumentId", physicalDocumentId);
            queryParameters.Add("@DocumentReference", docRefrence);
            queryParameters.Add("@YearNumber", yearNumber);
            queryParameters.Add("@Year", docYear);
            queryParameters.Add("@ToInterface", toInterface);
            queryParameters.Add("@TransactionDocumentId", response.TransactionDocumentId, DbType.Int64, ParameterDirection.Output);
            await ExecuteNonQueryAsync(StoredProcedureNames.GenerateTransactionDocument, queryParameters, true);
            response.TransactionDocumentId = queryParameters.Get<long>("@TransactionDocumentId");
            return response;
        }

        public async Task InsertReversalTransactionMapping(long transactionDocumentId, long reversalTransactionDocumentId, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add("@ReversalTransactionDocumentId", reversalTransactionDocumentId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            await ExecuteNonQueryAsync(StoredProcedureNames.CreateReversalTransactionMapping, queryParameters, true);
        }

        public async Task AddUpdateMatchFlagForDocumentReversal(long transactionDocumentId, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add("@CompanyId", company);
            await ExecuteNonQueryAsync(StoredProcedureNames.AddMatchFlagForDocumentReversal, queryParameters, true);
        }

        public async Task<InvoiceRecord> GetInvoiceByIdAsync(long id)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@InvoiceId", id);

            InvoiceRecord result;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetInvoiceById, queryParameters))
            {
                result = (await grid.ReadAsync<InvoiceRecord>()).FirstOrDefault();
                var invoiceLines = await grid.ReadAsync<InvoiceLineRecord>();
                result.InvoiceLines = invoiceLines;
            }

            return result;
        }

        /// <summary>
        /// Update the flag IsReversed in the "reversed" transaction document
        /// </summary>
        /// <param name="transactionDocumentId">transactionDocumentId of the REVERSED document (not the Reversal)</param>
        /// <param name="company">the company code</param>
        public async Task UpdateDocumentTypeForDocumentReversal(long transactionDocumentId, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add("@CompanyId", company);
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateDocumentTypeForDocumentReversal, queryParameters, true);
        }

        public async Task<InvoiceRecord> CreateDraftReversalInvoice(InvoiceRecord invoice)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", invoice.TransactionDocumentId);
            queryParameters.Add("@DocumentTypeId", invoice.TransactionDocumentTypeId);
            queryParameters.Add("@DocumentDate", invoice.InvoiceDate);
            queryParameters.Add("@DocumentReference", invoice.DocumentReference);
            queryParameters.Add("@YearNumberForReversed", invoice.YearNumber);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", invoice.CompanyId);

            var draftInvoice = await ExecuteQueryAsync<InvoiceRecord>(StoredProcedureNames.CreateDraftReversalInvoice, queryParameters, true);
            return draftInvoice.FirstOrDefault();
        }

        public async Task UpdateInvoicingStatusAsync(long sectionId, int invoiceStatusId, string company, long? dataVersionId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@InvoiceStatusId", invoiceStatusId);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);
            queryParameters.Add("@CompanyId", company);
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateInvoicingStatus, queryParameters, true);
        }
        public async Task<IEnumerable<InvoiceMarkingPercentLines>> UpdateInvoiceMarkingPercentLines(IEnumerable<InvoiceMarkingPercentLines> invoiceMarkingPercentLines, string company, long? dataVersionId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@InvoicePercent", ConvertToInvoiceMarkingPercentUDTT(invoiceMarkingPercentLines));
            queryParameters.Add(DataVersionIdParameter, dataVersionId);
            queryParameters.Add("@CompanyId", company);
            var sec = await ExecuteQueryAsync<InvoiceMarkingPercentLines>(StoredProcedureNames.UpdateInvoicePercent, queryParameters, true);
            return sec;
        }

        private static DataTable ConvertToInvoiceMarkingPercentUDTT(IEnumerable<InvoiceMarkingPercentLines> invoicePercentMarkingLines)
        {
            DataTable udtt = new DataTable();
            udtt.SetTypeName("[Trading].[UDTT_InvoicePercent]");
            DataColumn invoiceLineId = new DataColumn("[InvoiceLineId]", typeof(long));
            udtt.Columns.Add(invoiceLineId);
            DataColumn invoicePercent = new DataColumn("[InvoicePercent]", typeof(decimal));
            udtt.Columns.Add(invoicePercent);

            foreach (var invoiceMarkingPercent in invoicePercentMarkingLines)
            {
                var row = udtt.NewRow();
                if (invoiceMarkingPercent != null)
                {
                    row[invoiceLineId] = invoiceMarkingPercent.InvoiceLineId;
                    row[invoicePercent] = invoiceMarkingPercent.InvoicePercent;
                    udtt.Rows.Add(row);
                }
            }

            return udtt;
        }

        private static class StoredProcedureNames
        {
            internal const string UpdateInvoiceMarking = "[Invoicing].[usp_UpdateInvoiceMarking]";
            internal const string CreateInvoiceMarking = "[Invoicing].[usp_CreateInvoiceMarking]";
            internal const string UpdateInvoiceMarkingPostingStatus = "[Invoicing].[usp_UpdateInvoiceMarkingPostingStatus]";
            internal const string DeleteInvoiceMarking = "[Invoicing].[usp_DeleteInvoiceMarking]";
            internal const string CreateInvoice = "[Invoicing].[usp_CreateInvoice]";
            internal const string CreateReversalInvoice = "[Invoicing].[usp_CreateReversalInvoice]";
            internal const string GetDocumentReferenceValue = "[Invoicing].[usp_GetDocumentReferenceValue]";
            internal const string GenerateTransactionDocument = "[Invoicing].[usp_CreateTransactionDocument]";
            internal const string CreateReversalTransactionMapping = "[Invoicing].[usp_CreateReversalTransactionMapping]";
            internal const string AddMatchFlagForDocumentReversal = "[Invoicing].[usp_AddMatchFlagForDocumentReversal]";
            internal const string UpdateInvoicePhysicalDocument = "[Invoicing].[usp_UpdateInvoicePhysicalDocument]";
            internal const string CreateCost = "[Trading].[usp_CreateCost]";
            internal const string GetInvoiceById = "[Invoicing].[usp_GetInvoiceById]";
            internal const string UpdateDocumentTypeForDocumentReversal = "[Invoicing].[usp_UpdateDocumentTypeReversal]";
            internal const string CreateDraftReversalInvoice = "[Invoicing].[usp_CreateDraftReversalInvoice]";
            internal const string UpdateInvoicingStatus = "[Invoicing].[usp_UpdateInvoicingStatus]";
            internal const string UpdateInvoicePercent = "[Invoicing].[usp_UpdateInvoicePercent]";
        }
    }
}
