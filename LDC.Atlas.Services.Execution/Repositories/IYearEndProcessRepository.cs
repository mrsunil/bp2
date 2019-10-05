using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public interface IYearEndProcessRepository
    {
        Task<YearEndProcessExistance> CheckYearEndProcessExistence(string company, int year);

        Task<bool> ReverseYearEndDocument(string company, int year);

        Task<List<YearEndProcessResponse>> CreateAccountingDocumentForYearEndPAndLBookings(string company, int year, long? id);

        Task<List<YearEndProcessResponse>> CreateAccountingDocumentForYearEndBalanceSheetBankAndLedger(string company, int year);

        Task<List<YearEndProcessResponse>> CreateAccountingDocumentForYearEndBalanceSheetCustomerAndVendor(string company, int year);

        Task UpdateYearEndSetup(string company, int year);
    }
}
