using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public class InvoiceMarkingRepository : BaseRepository, IInvoiceMarkingRepository
    {
        public InvoiceMarkingRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<InvoiceMarkingDto> AddInvoiceMarkingAsync(IEnumerable<InvoiceMarkingDto> invoiceMarking, int? invoiceStatus, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();

            queryParameters.Add("@InvoicingStatusId", invoiceStatus);
            queryParameters.Add("@RecalcQuantityAndAmount", false); // Calculation has already been done
            queryParameters.Add("@InvoiceMarking", ConvertToInvoiceMarkingUDTT(invoiceMarking, company));
            var sec = await ExecuteQueryFirstOrDefaultAsync<InvoiceMarkingDto>(StoredProcedureNames.CreateInvoiceMarking, queryParameters, true);
            return sec;
        }

        public async Task UpdateInvoiceMarkingAsync(InvoiceMarkingDto invoiceMarking, int? invoiceStatus, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();

            queryParameters.Add("@InvoiceMarkingId", invoiceMarking.InvoiceMarkingId);
            queryParameters.Add("@SectionId", invoiceMarking.SectionId);
            queryParameters.Add("@CostId", invoiceMarking.CostId);
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
            queryParameters.Add("@PaidPercentage", invoiceMarking.PaidPercentage);
            queryParameters.Add("@CashMatchDate", invoiceMarking.CashMatchDate);
            queryParameters.Add("@RemainingAmount", invoiceMarking.RemainingAmount);
            queryParameters.Add("@InvoiceReference", invoiceMarking.InvoiceReference);
            queryParameters.Add(DataVersionIdParameter, invoiceMarking.DataVersionId);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateInvoiceMarking, queryParameters, true);
        }

        private static DataTable ConvertToInvoiceMarkingUDTT(IEnumerable<InvoiceMarkingDto> invoiceMarking, string company)
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
                row[sectionId] = invoices.SectionId ?? (object)DBNull.Value;
                row[costId] = invoices.CostId ?? (object)DBNull.Value;
                row[invoiceLineId] = invoices.InvoiceLineId;
                row[invoiceDate] = invoices.InvoiceDate;
                row[invoiceReference] = invoices.InvoiceReference;
                row[postingStatusId] = invoices.PostingStatusId ?? (object)DBNull.Value;
                row[quantity] = invoices.Quantity;
                row[currencyCode] = invoices.CurrencyCode;
                row[invoiceAmount] = invoices.InvoiceAmount;
                row[invoicePercent] = invoices.InvoicePercent;
                row[dueDate] = invoices.DueDate ?? (object)DBNull.Value;
                row[paymentTermCode] = invoices.PaymentTermCode;
                row[paidAmount] = invoices.PaidAmount;
                row[paidPercentage] = invoices.PaidPercentage;
                row[cashMatchDate] = invoices.CashMatchDate ?? (object)DBNull.Value;
                row[remainingAmount] = invoices.RemainingAmount;
                row[companyId] = company;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        private static class StoredProcedureNames
        {
            internal const string CreateInvoiceMarking = "[Invoicing].[usp_CreateInvoiceMarking]";
            internal const string UpdateInvoiceMarking = "[Invoicing].[usp_UpdateInvoiceMarking]";
        }
    }
}
