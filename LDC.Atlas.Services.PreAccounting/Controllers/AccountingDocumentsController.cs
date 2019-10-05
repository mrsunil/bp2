using AutoMapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.MasterData.Common.Entities;
using LDC.Atlas.Services.PreAccounting.Application.Commands;
using LDC.Atlas.Services.PreAccounting.Application.Queries;
using LDC.Atlas.Services.PreAccounting.Application.Queries.Dto;
using LDC.Atlas.Services.PreAccounting.Entities;
using LDC.Atlas.Services.PreAccounting.Infrastructure.Policies;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Controllers
{
    [Route("api/v1/preaccounting/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class AccountingDocumentsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IIdentityService _identityService;
        private readonly IAccountingDocumentQueries _accountingDocumentQueries;
        private readonly IMasterDataService _masterDataService;
        private readonly IMapper _mapper;


        public AccountingDocumentsController(IMediator mediator, IIdentityService identityService, IGridService gridQueries, IAccountingDocumentQueries accountingDocumentQueries, IMasterDataService masterDataService, IMapper mapper)
        {
            _mediator = mediator;
            _identityService = identityService;
            _accountingDocumentQueries = accountingDocumentQueries;
            _mapper = mapper;
            _masterDataService = masterDataService ?? throw new ArgumentNullException(nameof(masterDataService));
        }


        /// <summary>
        /// Returns the list of accounting documents for posting.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpPost("postingManagement")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<PostingSummaryDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<PostingSummaryDto>>> GetPostingManagement(
      string company,
      EntitySearchRequest searchRequest)
        {
            var searchResult = await _accountingDocumentQueries.GetPostingManagementAccountingDocAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Returns an accounting document by its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="accountingId">The accounting document identifier.</param>
        [HttpGet("{accountingId}")]
        [ProducesResponseType(typeof(CollectionViewModel<AccountingDocumentDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<AccountingDocumentDto>>> GetAccountingDocumentsByAccountingId(string company, int accountingId)
        {
            List<long> accountingIds = new List<long> { accountingId };

            var accountingDocuments = await _accountingDocumentQueries.GetAccountingDocumentsByAccountingIdsAsync(accountingIds, company);

            var response = new CollectionViewModel<AccountingDocumentDto>(accountingDocuments.ToList());

            return Ok(response);
        }

        [HttpPost("accountingDocumentData")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<AccountingDocumentLineDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<AccountingDocumentLineDto>>> GetAccoutingDocumentDataList(
    string company,
    EntitySearchRequest searchRequest)
        {
            var searchResult = await _accountingDocumentQueries.GetAccoutingDocumentDataListAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Searches in the list of accounting entries.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("search")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<AccountingSearchResultDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<AccountingSearchResultDto>>> SearchAccountingEntries(
            string company,
            AdditionalEntitySearchRequest<bool> searchRequest)
        {
            var searchResult = await _accountingDocumentQueries.SearchAccountingEntriesAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Creates an accounting document.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="document">The document to create (accounting header and lines).</param>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<SectionPostingStatus>> CreateAccountingDocument(string company, CreateAccountingDocumentCommand document)
        {
            document.Company = company;

            var response = await _mediator.Send(document);

            return Ok(response);
        }

        /// <summary>
        /// Update Accounting Document Status As Posted.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="document">document to update accounting document status to posted.</param>
        [HttpPost("statustoposted")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UpdateAccountingDocumentStatusToPosted(string company, UpdateAccountingDocumentStatusToPostedCommand document)
        {
            document.Company = company;

            await _mediator.Send(document);

            return NoContent();
        }

        [HttpPost("processheldandmappingerrordocument")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> ProcessHeldAndMappingErrorDocument(string company)
        {
            await _mediator.Send(new ProcessHeldAndMappingErrorDocumentCommand { Company = company });

            return NoContent();
        }

        /// <summary>
        /// Delete Accounting Document Status.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="document">document to delete accounting document status</param>
        [HttpPost("statustodeleted")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.DeleteAccountingDocumentPolicy)]
        public async Task<IActionResult> UpdateAccountingDocumentStatusToDeleted(string company, UpdateAccountingDocumentStatusToDeletedCommand document)
        {
            document.Company = company;

            await _mediator.Send(document);

            return NoContent();
        }

        /// <summary>
        /// Authorize documents for sanity checks.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="document">Authorize for posting.</param>
        [HttpPost("authorizeforposting")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.AuthorizePostingPolicy)]
        public async Task<IActionResult> AuthorizeForPostingDocument(string company, AuthorizeForPostingCommand document)
        {
            document.Company = company;

            await _mediator.Send(document);

            return NoContent();
        }

        [HttpPost("{isAuthorizedControlEnabled}/updateaccountingdocument")]
        [ProducesResponseType(typeof(CollectionViewModel<SectionPostingStatus>), StatusCodes.Status200OK)]
        public async Task<ActionResult<SectionPostingStatus>> UpdateAccoutingDocumentData(string company, [FromBody, Required] UpdateAccountingDocumentCommand document, bool isAuthorizedControlEnabled)
        {
            document.Company = company;

            var getFieldsConfiguration = await _accountingDocumentQueries.GetPreAccountingFieldsConfiguration(company);

            List<ItemConfigurationPropertiesDto> fieldList = new List<ItemConfigurationPropertiesDto>();

            foreach (var item in getFieldsConfiguration)
            {
                fieldList.Add(new ItemConfigurationPropertiesDto()
                {
                    DefaultValue = item.DefaultValue,
                    DisplayName = item.DisplayName,
                    Format = item.Format,
                    Id = item.Id,
                    IsMandatory = item.IsMandatory,
                });
            }

            document.FieldsConfigurations = fieldList;

            document.AccountingDocumentLines.ToList().ForEach(lines => lines.FieldsConfigurations = fieldList);

            document.IsAuthorizedControlEnabled = isAuthorizedControlEnabled;

            var accountingData = await _mediator.Send(document);

            return Ok(accountingData);
        }

        [HttpPost("startstopposting")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [Authorize(Policies.StartPostingPolicy)]
        public async Task<ActionResult<bool>> StartStopPostingProcess(string company, [FromBody, Required] StartStopPostingProcessCommand request)
        {
            request.Company = company;

            var response = await _mediator.Send(request);

            return Ok(response);
        }

        [HttpGet("postingactivestatus")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [Authorize(Policies.StartPostingPolicy)]
        public async Task<ActionResult<bool>> GetPostingProcessActiveStatus(string company)
        {
            var response = await _accountingDocumentQueries.GetPostingProcessActiveStatusAsync(company);

            return Ok(response);
        }

        [HttpPost("documentContextualSearch")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<TransactionDocumentSearchResultDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<TransactionDocumentSearchResultDto>>> SearchTransactionDocumentEntries(
            string company,
            EntitySearchRequest searchRequest)
        {
            var searchResult = await _accountingDocumentQueries.SearchTransactionDocumentEntriesAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of documents for document matching.
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="counterpartyId">The counterparty identifier.</param>
        /// <param name="department">The department of the document.</param>
        /// <param name="currency">Currency of the documents.</param>
        /// <param name="bitEdit">Boolean value to check if edit or create.</param>
        /// <param name="matchFlagId">return the existing matchflag.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("getdocumentsformatching")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<DocumentMatchingDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<DocumentMatchingDto>>> DocumentsToMatch(string company, [FromQuery] long counterpartyId,
            [FromQuery] string department, [FromQuery] string currency, bool bitEdit, long? matchFlagId, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _accountingDocumentQueries.GetDocumentToMatchAsync(company, counterpartyId, department, currency, bitEdit, matchFlagId, pagingOptions.Offset.Value, pagingOptions.Limit.Value);

            var response = new PaginatedCollectionViewModel<DocumentMatchingDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);

            return Ok(response);
        }

        [HttpPost("{isReversalDocument}/documentReferenceContextualSearch")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<DocumentReferenceSearchResultDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.ReverseDocumentPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<DocumentReferenceSearchResultDto>>> SearchDocumentReferenceEntries(
           string company,
           EntitySearchRequest searchRequest,
           bool isReversalDocument)
        {
            var searchResult = await _accountingDocumentQueries.SearchDocumentReferenceEntriesAsync(company, searchRequest, isReversalDocument);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        [HttpGet("accoutingDocData/{docRefId}")]
        [ProducesResponseType(typeof(CollectionViewModel<AccountingDocumentDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<AccountingDocumentDto>>> GetAccountingDocumentsAllByAccountingId(string company, int docRefId)
        {
            List<AccountingDocumentDto> accountingDocuments = new List<AccountingDocumentDto>();
            var accountingDocument = await _accountingDocumentQueries.GetAccountingDocumentByDocRefIdsAsync(docRefId, company);
            accountingDocuments.Add(accountingDocument);

            var response = new CollectionViewModel<AccountingDocumentDto>(accountingDocuments);

            return Ok(response);
        }

        [HttpGet("accountingLinesAllData/{accountingId}")]
        [ProducesResponseType(typeof(CollectionViewModel<ReversalAccountingDocumentDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<ReversalAccountingDocumentDto>>> GetAccountingAllLinesbyAccountingId(string company, int accountingId)
        {
            var accountingDocumentList = await _accountingDocumentQueries.GetAllAccountingIdsAsync(accountingId, company);

            var accountingIds = accountingDocumentList.Select(x => x.AccountingId);

            var accountingDocument = await _accountingDocumentQueries.GetAccountingLinesAsync(accountingIds, company);

            var response = new CollectionViewModel<ReversalAccountingDocumentDto>(accountingDocument.ToList());

            return Ok(response);
        }


        [HttpPost("accountingLinesData")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<AccountingSearchResultDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<AccountingSearchResultDto>>> SearchAccountingLinesbyAccountingId(
           string company,
           EntitySearchRequest searchRequest)
        {
            var searchResult = await _accountingDocumentQueries.GetAccountingLinesByAccountIdAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        [HttpGet("transactionDetail/{accountingId}")]
        [ProducesResponseType(typeof(CollectionViewModel<TransactionDetailDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<TransactionDetailDto>>> GeTransactionDetailbyAccountingId(string company, int accountingId)
        {
            List<long> accountingIds = new List<long> { accountingId };

            var accountingDocument = await _accountingDocumentQueries.GetTransactionDetailAsync(accountingIds, company);

            var response = new CollectionViewModel<TransactionDetailDto>(accountingDocument.ToList());

            return Ok(response);
        }

        [HttpPost("searchClientReport")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<TransactionReportSearchDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.ClientTransationReport)]
        public async Task<ActionResult<PaginatedCollectionViewModel<TransactionReportSearchDto>>> SearchClientReport(
            string company,
            [FromBody] AdditionalEntitySearchRequest<TransactionReportCommand> searchRequest)
        {
            var searchResult = await _accountingDocumentQueries.SearchClientReportAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        [HttpPost("searchNominalReport")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<TransactionReportSearchDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.NominalReport)]
        public async Task<ActionResult<PaginatedCollectionViewModel<TransactionReportSearchDto>>> SearchNominalReport(
            string company,
            [FromBody] AdditionalEntitySearchRequest<TransactionReportCommand> searchRequest)
        {
            var searchResult = await _accountingDocumentQueries.SearchNominalReportAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Get error message for display in interface.
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="statusList">List of status filtered</param>
        /// <param name="processNameList">List of process filtered</param>
        /// <param name="dateBegin">date of begining</param>
        /// <param name="dateEnd">date of ending</param>
        /// <param name="userName">name of user</param>
        [HttpGet("getErrorMessages")]
        [ProducesResponseType(typeof(IEnumerable<ProcessMessageDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<ProcessMessageDto>>> GetErrorMessages(
            string company,
            [FromQuery] string statusList,
            [FromQuery] string processNameList,
            [FromQuery] System.DateTime? dateBegin,
            [FromQuery] System.DateTime? dateEnd,
            [FromQuery] string userName)
        {

            IEnumerable<ProcessMessageDto> displayErrorMessages = await _accountingDocumentQueries.GetErrorMessages(company, statusList.Split(',').Select(int.Parse).ToArray(), processNameList.Split(',').ToArray(), dateBegin, dateEnd, userName);

            return Ok(displayErrorMessages);
        }

        [HttpPost("fileupload")]
        [DisableRequestSizeLimit]
        [ProducesResponseType(typeof(ValidatedAccountingImport), StatusCodes.Status200OK)]
        public async Task<ActionResult<ValidatedAccountingImport>> FileUpload([FromForm, Required] CreateAccountingLinesFileUploadCommand command, string company)
        {
            var lines = new List<string>();
            using (var reader = new StreamReader(command.File.OpenReadStream()))
            {
                while (reader.Peek() >= 0)
                {
                    lines.Add(await reader.ReadLineAsync());
                }
            }

            var dataReadFromCsv = lines
                                    .Skip(1)
                                    .Select((l, i) => AccountingCsvLine.ParseFromCsv(l, i, command.IsAccuralSelected, command.IsMTMSelected))
                                    .ToList();

            var accountingImporter = new AccountingCsvImporter(_masterDataService, _accountingDocumentQueries, company, _mapper);

            var validatedResult = await accountingImporter.ProcessManualAccountingImport(dataReadFromCsv, command.IsMTMSelected, company);

            return Ok(validatedResult);

        }

        internal class AccountingValidationError
        {
            public AccountingValidationError(AccountingCsvLine csvLine, string errorCode)
            {
                AccountingCheckCsvLine = csvLine;
                ErrorCode = errorCode;
            }

            public AccountingCsvLine AccountingCheckCsvLine { get; private set; }

            public string ErrorCode { get; private set; }
        }

        internal class AccountingCsvImporter
        {
            private IMasterDataService _masterDataService;
            private IAccountingDocumentQueries _accountingDocumentQueries;
            private IMapper _mapper;
            private string company;
            private static readonly IDictionary<string, string> _errorMessages = new Dictionary<string, string>
            {
                { "invalid_nominalaccount", "Invalid Nominal Account"},
                { "invalid_ClientAccount_BasedOn_NominalAccount","Invalid Client Account Based On NominalAccount" },
                { "invalid_AccountType_BasedOn_NominalAccount" ,"Invalid AccountType Based On NominalAccount"},
                { "invalid_CostType_BasedOn_NominalAccount" ,"Invalid CostType Based On NominalAccount"},
                { "invalid_AccountType_BasedOn_NominalAccount_Mandatory_MTM","Invalid CostType Based On NominalAccount for MTM for Mandatory ClientAccount " },
                { "invalid_AccountType_BasedOn_NominalAccount_Notmandatory_MTM","Invalid CostType Based On NominalAccount for MTM " },
                { "invalid_clientaccountid","Invalid Client Account Id" },
                { "invalid_costaccount", "Invalid Cost Account"},
                { "invalid_accountlineid","Invalid Account Line Id" },
                { "invalid_departmentid","Invalid Account Department Id" },
                { "invalid_associatedaccountid","Invalid Associated Account Id" },
                { "invalid_commodityaccount", "Invalid Commodity Id"},
                { "invalid_charterManager", "Invalid Charter Mananger"},
                { "invalid_settlementcurrencylist","Invalid Settlement Currency" },
                { "invalid_provinceid","Invalid Province Id" },
                { "invalid_secondaryDocumentReference","Invalid Secondary Document Reference" },
                { "invalid_sectionId","Invalid  SectionId " },
                {"invalid_value_contractreference","Invalid Value for Deal Number and Settlement Currency" },
                { "invalid_dealNumber","Invalid DealNumber" },
                { "invalid_value_dealNumber","Invalid Value for Contract Reference and Commodity" }

            };

            public AccountingCsvImporter(IMasterDataService masterDataService, IAccountingDocumentQueries accountingDocumentQueries, string company, IMapper mapper)
            {
                _masterDataService = masterDataService;
                _accountingDocumentQueries = accountingDocumentQueries;
                _mapper = mapper;
                this.company = company;
            }

            internal async Task<ValidatedAccountingImport> ProcessManualAccountingImport(List<AccountingCsvLine> csvAccountingData, bool IsMTMSelected, string company)
            {
                ValidatedAccountingImport validatedAccountingImport = new ValidatedAccountingImport();
                List<AccountingDocumentImport> accountingRecordList = new List<AccountingDocumentImport>();
                IEnumerable<NominalAccount> nominalAccount = (await _masterDataService.GetNominalAccountsAsync(company)).ToList();
                List<AccountingCsvLine> goodDataList = new List<AccountingCsvLine>();
                IEnumerable<Counterparty> counterParty = (await _masterDataService.GetCounterpartiesAsync(company)).ToList();
                IEnumerable<AccountLineTypes> accountLineTypes = (await _masterDataService.GetAllAsync()).ToList();
                IEnumerable<CostType> costType = (await _masterDataService.GetCostTypesAsync(company)).ToList();
                IEnumerable<Department> departmentId = (await _masterDataService.GetDepartmentsAsync(company)).ToList();
                IEnumerable<Commodity> commodity = (await _masterDataService.GetCommoditiesAsync(company)).ToList();
                string[] chartercompany = new string[1];
                chartercompany[0] = company;
                IEnumerable<CharterManager> charterManager = (await _masterDataService.GetCharterManagersAsync(chartercompany)).ToList();
                IEnumerable<Currency> settlementCurrencyList = (await _masterDataService.GetCurrenciesAsync()).ToList();
                IEnumerable<Province> provinces = (await _masterDataService.GetProvincesAsync()).ToList();
                EntitySearchRequest request = new EntitySearchRequest { Clauses = null, Limit = 214748647, Offset = 0, SortColumns = null };
                var searchResultTransactionDocumentEntries = await _accountingDocumentQueries.SearchTransactionDocumentEntriesAsync(company, request);
                IEnumerable<TransactionDocumentSearch> searchResultTransactionDocument;
                searchResultTransactionDocument = _mapper.Map<IEnumerable<TransactionDocumentSearch>>(searchResultTransactionDocumentEntries);
                IEnumerable<SectionSearchResult> searchResultSectionId = await _accountingDocumentQueries.SearchSectionsAsync(company, request);
                IEnumerable<FxDealSearchResult> searchResultFxDeal = await _accountingDocumentQueries.SearchFxDealsAsync(company, request);


                var validatedAccounting = ValidateData(IsMTMSelected, csvAccountingData, nominalAccount, counterParty, accountLineTypes, costType, departmentId, charterManager, commodity, settlementCurrencyList, searchResultTransactionDocument, provinces, searchResultSectionId, searchResultFxDeal);

                foreach (var data in validatedAccounting.GoodData.LineNumber.ToList())
                {
                    var accontingValueListImport = csvAccountingData.Where(x => x.LineNumber == data).FirstOrDefault();
                    if (accontingValueListImport != null)
                    {
                        goodDataList.Add(accontingValueListImport);
                    }
                }
                validatedAccountingImport.GoodDataList = goodDataList;
                validatedAccountingImport.GoodData = validatedAccounting.GoodData;
                validatedAccountingImport.BlockerData = validatedAccounting.BlockerData;

                return validatedAccountingImport;
            }

            private static ValidatedAccountingImport ValidateData(
                 bool isMTMSelected,
                List<AccountingCsvLine> csvLines,
                IEnumerable<NominalAccount> nominalAccount,
                IEnumerable<Counterparty> counterParty,
                IEnumerable<AccountLineTypes> accountLineType,
                IEnumerable<CostType> costType,
                IEnumerable<Department> departmentId,
                IEnumerable<CharterManager> charterManagers,
                IEnumerable<Commodity> commodity,
                IEnumerable<Currency> settlementCurrencyList,
                IEnumerable<TransactionDocumentSearch> searchResultTransactionDocument,
                IEnumerable<Province> provinces,
                IEnumerable<SectionSearchResult> searchResultSectionId,
                IEnumerable<FxDealSearchResult> searchResultFxDeal


                )
            {
                ValidatedAccountingImport validatedAccountingImport = new ValidatedAccountingImport
                {
                    GoodData = new AccountingImportReportData

                    {
                        ErrorCode = "Good data",
                        ErrorMessage = "Following Accounting Line are Ready for Import",
                        LineNumber = new List<int>()
                    },
                    BlockerData = new List<AccountingImportReportData>(),
                };

                List<AccountingValidationError> validationErrors = new List<AccountingValidationError>();

                foreach (var csvLine in csvLines)
                {
                    bool isValidLine = ValidateNominalAccount(validationErrors, csvLine, nominalAccount, counterParty, accountLineType, costType, isMTMSelected)
                     && ValidateClientAccountId(validationErrors, csvLine, counterParty)
                     && ValidateAssociatedAccountId(validationErrors, csvLine, counterParty)
                     && ValidateCostAccount(validationErrors, csvLine, costType)
                     && ValidateAccountLineTypeId(validationErrors, csvLine, isMTMSelected, accountLineType)
                     && ValidateDepartmentId(validationErrors, csvLine, departmentId)
                     && ValidateCommodityAccount(validationErrors, csvLine, commodity)
                     && ValidateCharterManager(validationErrors, csvLine, charterManagers)
                     && ValidateSettlementCurrencyList(validationErrors, csvLine, settlementCurrencyList)
                     && ValidateTransactionDocument(validationErrors, csvLine, searchResultTransactionDocument)
                     && Validateprovinces(validationErrors, csvLine, provinces)
                     && ValidateSectionId(validationErrors, csvLine, searchResultSectionId)
                     && ValidateFxDeal(validationErrors, csvLine, searchResultFxDeal);

                    if (isValidLine)
                    {
                        validatedAccountingImport.GoodData.LineNumber.Add(csvLine.LineNumber);
                    }
                }


                foreach (var group in validationErrors.GroupBy(v => v.ErrorCode).ToList())
                {
                    var accountingImportReportData = new AccountingImportReportData
                    {
                        ErrorCode = group.Key,
                        ErrorMessage = _errorMessages[group.Key],
                        LineNumber = group.Select(item => item.AccountingCheckCsvLine.LineNumber).ToList()
                    };

                    validatedAccountingImport.BlockerData.Add(accountingImportReportData);
                }

                return validatedAccountingImport;
            }




            private static bool ValidateNominalAccount(List<AccountingValidationError> validationerrors, AccountingCsvLine csvline, IEnumerable<NominalAccount> nominalAccounts, IEnumerable<Counterparty> counterparty, IEnumerable<AccountLineTypes> accountLineType, IEnumerable<CostType> costType, bool isMTMSelected)
            {
                if (!nominalAccounts.Any(nominalAccount => nominalAccount.NominalAccountNumber == csvline.AccountReferenceId || csvline.AccountReferenceId == null || csvline.AccountReferenceId.Trim() == string.Empty))
                {
                    validationerrors.Add(new AccountingValidationError(csvline, "invalid_nominalaccount"));

                    return false;
                }
                else
                {
                    // check business rules if valid nominal account found
                    if (!string.IsNullOrEmpty(csvline.AccountReferenceId))
                    {

                        var matchingNominalAccount = nominalAccounts.Where(x => x.NominalAccountNumber == csvline.AccountReferenceId).FirstOrDefault();
                        if (matchingNominalAccount != null)
                        {
                            if (matchingNominalAccount.ClientAccountMandatory == 1)
                            {
                                // Business rules for Client Account
                                if (!string.IsNullOrEmpty(csvline.ClientAccountId)){
                                    if (!counterparty.Any(counterparties => counterparties.CounterpartyCode != csvline.ClientAccountId))
                                    {
                                        validationerrors.Add(new AccountingValidationError(csvline, "invalid_ClientAccount_BasedOn_NominalAccount"));
                                        return false;
                                    }
                                }
                                // Business rules for Account Line Type mtm
                                if (isMTMSelected)
                                {
                                    if (!string.IsNullOrEmpty(csvline.AccountLineTypeId))
                                    {
                                        if (csvline.AccountLineTypeId != AccountLineType.B.ToString())
                                        {
                                            validationerrors.Add(new AccountingValidationError(csvline, "invalid_AccountType_BasedOn_NominalAccount_Mandatory_MTM"));
                                            return false;
                                        }
                                    }
                                }


                                // Business rules for Account Line Type
                                if (!isMTMSelected && !string.IsNullOrEmpty(csvline.AccountLineTypeId)) {
                                    if (csvline.AccountLineTypeId != AccountLineType.C.ToString() || csvline.AccountLineTypeId != AccountLineType.V.ToString())
                                {
                                        validationerrors.Add(new AccountingValidationError(csvline, "invalid_AccountType_BasedOn_NominalAccount"));
                                        return false;
                                    }
                                }
                               
                                    // Business rules for Cost Type
                                    if (!string.IsNullOrEmpty(csvline.CostTypeId))
                                {
                                    var matchingCostType = costType.Where(costtypes => costtypes.CostTypeId.ToString() == csvline.CostTypeId).FirstOrDefault();
                                    if (matchingCostType != null)
                                    {
                                        if (matchingCostType.NominalAccountCode != matchingNominalAccount.NominalAccountNumber || matchingCostType.OtherAcc != matchingNominalAccount.NominalAccountNumber)
                                        {
                                            validationerrors.Add(new AccountingValidationError(csvline, "invalid_CostType_BasedOn_NominalAccount"));
                                            return false;
                                        }
                                    }
                                }
                            }
                            if (isMTMSelected && matchingNominalAccount.ClientAccountMandatory != 1)
                            {
                                if (!string.IsNullOrEmpty(csvline.AccountLineTypeId))
                                {
                                    if (csvline.AccountLineTypeId != AccountLineType.L.ToString())
                                    {
                                        validationerrors.Add(new AccountingValidationError(csvline, "invalid_AccountType_BasedOn_NominalAccount_Notmandatory_MTM"));
                                        return false;
                                    }
                                }
                            }

                        }
                    }

                    return true;
                }
            }
            private static bool ValidateClientAccountId(List<AccountingValidationError> validationerrors, AccountingCsvLine csvline, IEnumerable<Counterparty> counterparties)
            {
                if (!counterparties.Any(counterparty => counterparty.CounterpartyCode == csvline.ClientAccountId || csvline.ClientAccountId == null || csvline.ClientAccountId.Trim() == string.Empty))
                {
                    validationerrors.Add(new AccountingValidationError(csvline, "invalid_clientaccountid"));

                    return false;
                }

                return true;
            }
            private static bool ValidateAssociatedAccountId(List<AccountingValidationError> validationerrors, AccountingCsvLine csvline, IEnumerable<Counterparty> counterparties)
            {
                if (!counterparties.Any(counterparty => counterparty.CounterpartyCode == csvline.AssociatedAccountId || csvline.AssociatedAccountId == null || csvline.AssociatedAccountId.Trim() == string.Empty))
                {
                    validationerrors.Add(new AccountingValidationError(csvline, "invalid_associatedaccountid"));

                    return false;
                }

                return true;
            }
            private static bool ValidateAccountLineTypeId(List<AccountingValidationError> validationerrors, AccountingCsvLine csvline, bool isMTMSelected, IEnumerable<AccountLineTypes> accountLineTypes)
            {

              
                if (!accountLineTypes.Any(accountLineType => accountLineType.AccountLineTypeCode == csvline.AccountLineTypeId || csvline.AccountLineTypeId == null || csvline.AccountLineTypeId.Trim() == string.Empty))
                {

                    validationerrors.Add(new AccountingValidationError(csvline, "invalid_accountlineid"));

                    return false;
                }

                return true;
            }
            private static bool ValidateCostAccount(List<AccountingValidationError> validationerrors, AccountingCsvLine csvline, IEnumerable<CostType> costTypes)
            {
                if (!costTypes.Any(costType => costType.CostTypeCode == csvline.CostTypeId || csvline.CostTypeId == null || csvline.CostTypeId.Trim() == string.Empty))
                {
                    validationerrors.Add(new AccountingValidationError(csvline, "invalid_costaccount"));

                    return false;
                }

                return true;
            }
            private static bool ValidateDepartmentId(List<AccountingValidationError> validationerrors, AccountingCsvLine csvline, IEnumerable<Department> departmentIds)
            {
                if (!departmentIds.Any(departmentId => departmentId.DepartmentCode == csvline.DepartmentId || csvline.DepartmentId == null || csvline.DepartmentId.Trim() == string.Empty))
                {
                    validationerrors.Add(new AccountingValidationError(csvline, "invalid_departmentid"));

                    return false;
                }

                return true;
            }
            private static bool ValidateCommodityAccount(List<AccountingValidationError> validationerrors, AccountingCsvLine csvline, IEnumerable<Commodity> commodityAccounts)
            {
                if (!commodityAccounts.Any(commodityAccount => commodityAccount.PrincipalCommodity == csvline.CommodityId || csvline.CommodityId == null || csvline.CommodityId.Trim() == string.Empty))
                {
                    validationerrors.Add(new AccountingValidationError(csvline, "invalid_commodityaccount"));

                    return false;
                }

                return true;
            }
            private static bool ValidateCharterManager(List<AccountingValidationError> validationerrors, AccountingCsvLine csvline, IEnumerable<CharterManager> charterManagers)
            {
                if (charterManagers.Count() > 0)
                {
                    if (!charterManagers.Any(charterManager => charterManager.CharterCode == csvline.CharterId || csvline.CharterId == null || csvline.CharterId.Trim() == string.Empty))
                    {

                        validationerrors.Add(new AccountingValidationError(csvline, "invalid_charterManager"));

                        return false;
                    }
                    return true;
                }

                return true;
            }
            private static bool ValidateSettlementCurrencyList(List<AccountingValidationError> validationerrors, AccountingCsvLine csvline, IEnumerable<Currency> settlementCurrencyLists)
            {
                if (!settlementCurrencyLists.Any(settlementCurrencyList => settlementCurrencyList.CurrencyCode == csvline.SettlementCurrency || csvline.SettlementCurrency == null || csvline.SettlementCurrency.Trim() == string.Empty))
                {

                    validationerrors.Add(new AccountingValidationError(csvline, "invalid_settlementcurrencylist"));

                    return false;
                }

                return true;
            }
            private static bool Validateprovinces(List<AccountingValidationError> validationerrors, AccountingCsvLine csvline, IEnumerable<Province> provinces)
            {
                if (!provinces.Any(province => province.StateCode == csvline.ProvinceId || csvline.ProvinceId == null || csvline.ProvinceId.Trim() == string.Empty))
                {

                    validationerrors.Add(new AccountingValidationError(csvline, "invalid_provinceid"));

                    return false;
                }

                return true;
            }
            private static bool ValidateTransactionDocument(List<AccountingValidationError> validationerrors, AccountingCsvLine csvline, IEnumerable<TransactionDocumentSearch> searchResultTransactionDocuments)
            {
                if (searchResultTransactionDocuments.Count() > 0)
                {
                    if (!searchResultTransactionDocuments.Any(searchResultTransactionDocument => searchResultTransactionDocument.DocRef == csvline.SecondaryDocumentReference || csvline.SecondaryDocumentReference == null || csvline.SecondaryDocumentReference.Trim() == string.Empty))
                    {

                        validationerrors.Add(new AccountingValidationError(csvline, "invalid_secondaryDocumentReference"));

                        return false;
                    }
                    return true;
                }

                return true;

            }
            private static bool ValidateSectionId(List<AccountingValidationError> validationerrors, AccountingCsvLine csvline, IEnumerable<SectionSearchResult> searchResultSectionIds)
            {
                if (searchResultSectionIds.Count() > 0)
                {
                    if (!searchResultSectionIds.Any(searchResultSectionId => searchResultSectionId.ContractLabel == csvline.SectionId || csvline.SectionId == null || csvline.SectionId.Trim() == string.Empty))
                    {

                        validationerrors.Add(new AccountingValidationError(csvline, "invalid_sectionId"));

                        return false;
                    }
                    if (!string.IsNullOrEmpty(csvline.SectionId))
                    {
                        if(!(string.IsNullOrEmpty(csvline.DealNumber) && string.IsNullOrEmpty(csvline.SettlementCurrency)))
                        {
                            validationerrors.Add(new AccountingValidationError(csvline, "invalid_value_contractreference"));
                            return false;
                        }

                    }


                }

                return true;
            }
            private static bool ValidateFxDeal(List<AccountingValidationError> validationerrors, AccountingCsvLine csvline, IEnumerable<FxDealSearchResult> searchResultFxDeals)
            {
                if (searchResultFxDeals.Count() > 0)
                {
                    if (!searchResultFxDeals.Any(searchResultFxDeal => searchResultFxDeal.DealNumber == csvline.DealNumber || csvline.DealNumber == null || csvline.DealNumber.Trim() == string.Empty))
                    {
                        validationerrors.Add(new AccountingValidationError(csvline, "invalid_dealNumber"));

                        return false;
                    }
                    if (!string.IsNullOrEmpty(csvline.DealNumber))
                    {
                       
                       if(!(string.IsNullOrEmpty(csvline.SectionId) && string.IsNullOrEmpty(csvline.CommodityId)))
                        {
                            validationerrors.Add(new AccountingValidationError(csvline, "invalid_value_dealNumber"));
                            return false;
                        }

                    }
                }

                return true;

            }


        }

    }
}