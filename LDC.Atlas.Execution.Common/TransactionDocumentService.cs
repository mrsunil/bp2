using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.Execution.Common.Entities;
using LDC.Atlas.Execution.Common.Queries;
using LDC.Atlas.Execution.Common.Repositories;
using LDC.Atlas.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Execution.Common
{
    public class TransactionDocumentService : ITransactionDocumentService
    {
        private readonly IDistributedCache _distributedCache;
        private readonly ITransactionDataRepository _transactionDataRepository;
        private readonly IAccountingSetUpQueries _accountingQueries;
        private readonly IAuthorizationService _authorizationService;
        private readonly IIdentityService _identityService;
        private readonly IProcessMessageService _processMessageService;

        public TransactionDocumentService(IDistributedCache distributedCache,
            ITransactionDataRepository transactionDataRepository,
            IIdentityService identityService,
            IAuthorizationService authorizationService,
            IAccountingSetUpQueries accountingQueries,
            IProcessMessageService processMessageService)
        {
            _transactionDataRepository = transactionDataRepository;
            _distributedCache = distributedCache ?? throw new ArgumentNullException(nameof(distributedCache));
            _authorizationService = authorizationService;
            _identityService = identityService;
            _accountingQueries = accountingQueries;
            _processMessageService = processMessageService;
        }

        public async Task<TransactionCreationResponse> CreateTransactionDocument(TransactionDocument transactionDocument)
        {
            string documentLabel = string.Empty;
            string year = string.Empty;
            int transactionDocumentTypeId = transactionDocument.TransactionDocumentTypeId;
            int documentReferenceYear = 0;
            string documentReferenceYearValue = string.Empty;
            CommonRules commonRules = new CommonRules(_accountingQueries, _authorizationService, _identityService);
            documentReferenceYear = await commonRules.GetDocumentReferenceYear(transactionDocument.DocumentDate, transactionDocument.Company);
            documentReferenceYearValue = documentReferenceYear.ToString(System.Globalization.CultureInfo.InvariantCulture).Substring(2, 2);
            documentLabel = Enum.GetName(typeof(MasterDocumentType), transactionDocumentTypeId);
            year = DateTime.UtcNow.Year.ToString(CultureInfo.InvariantCulture).Substring(2, 2);


            int referencenumber = await _transactionDataRepository.GetInvoiceDocumentReferenceValues(transactionDocument.Company, transactionDocumentTypeId, documentReferenceYear);
            int yearNumber = referencenumber;
            int docYear = DateTime.UtcNow.Year;

            string documentReference = string.Concat(documentLabel, year, string.Format(CultureInfo.InvariantCulture, "{0:D5}", referencenumber));

            var objResponse = await _transactionDataRepository.CreateTransactionDocument(
                transactionDocument.TransactionDocumentTypeId,
                transactionDocument.DocumentDate,
                transactionDocument.CurrencyCode,
                transactionDocument.AuthorizedForPosting,
                transactionDocument.PhysicalDocumentId,
                documentReference,
                yearNumber,
                documentReferenceYear,
                transactionDocument.Company,
                transactionDocument.ToInterface);


            // Creation of the "reversal" record
            if (transactionDocument.TransactionDocumentId > 0)
            {
                // create mapping between main and reversed document
                await _transactionDataRepository.InsertReversalTransactionMapping(transactionDocument.TransactionDocumentId, objResponse.TransactionDocumentId, transactionDocument.Company);

                // Update of the status "isreversed" for the original document
                await _transactionDataRepository.UpdateDocumentTypeForDocumentReversal(transactionDocument.TransactionDocumentId, transactionDocument.Company);
            }

            if (objResponse.TransactionDocumentId > 0)
            {
                objResponse.DocumentReference = documentReference;
            }

            return objResponse;
        }

        public async Task CreateFxDealSettlementMapping(long transactionDocumentId, long fxDealId, string company, int fxSettlementDocumentType)
        {
            await _transactionDataRepository.CreateFxDealSettlementMapping(transactionDocumentId, fxDealId, company, fxSettlementDocumentType);
        }

        public async Task EnqueueMessage(string contextInfo, string company)
        {
            var content = new JObject();
            content.Add(new JProperty("docId", contextInfo));
            content.Add(new JProperty("postOpClosedPolicy", true));
            ProcessMessage message = new ProcessMessage​
            {
                ProcessTypeId = (int)ProcessType.AtlasAccountingDocumentProcessor,
                CompanyId = company,
                Content = content.ToString(),
            };

            await _processMessageService.SendMessage(message);
        }
    }
}