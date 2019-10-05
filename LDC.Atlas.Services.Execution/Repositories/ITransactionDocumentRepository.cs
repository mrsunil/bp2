using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Repositories
{
    public interface ITransactionDocumentRepository
    {
        /// <summary>
        /// For a given transaction doc, set its "isreversed" status to true, and create a reversal TD
        /// </summary>
        /// <param name="reversedTransactionDocumentId">Transaction id of the document to reverse</param>
        /// <param name="companyCode">Code of the working company</param>
        /// <param name="yearOfReversalDoc">Year associated to the reversal doc to create</param>
        /// <param name="yearNumberOfReversalDoc">Number associated to the reversal doc to create</param>
        /// <param name="documentReferenceOfReversalDoc">ref doc of the reversal to create</param>
        /// <param name="docDateOfReversal"></param>
        /// <returns></returns>
        Task<long> ReverseDocument(
            long reversedTransactionDocumentId,
            string companyCode,
            int yearOfReversalDoc,
            int yearNumberOfReversalDoc,
            string documentReferenceOfReversalDoc,
            DateTime docDateOfReversal);

        Task<RevaluationInformation> CreateRevaluation(
            string companyId,
            long? cashByPickingTransactionDocumentId,
            string currencyCode,
            long matchFlagId,
            DateTime glDate,
            DateTime paymentDocumentDate,
            DateTime documentDate
            );

        /// <summary>
        /// Delete a JL document which is either a revaluation either a manual JL
        /// </summary>
        /// <param name="transactionDocumentId"></param>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        Task DeleteManualJLOrRevaluation(
                long transactionDocumentId,
                string companyCode);

        /// <summary>
        /// Retrieve the list of Rate of exchange informations for the list of transactionDocumentId
        /// </summary>
        /// <param name="transactionDocumentIds">List of transactionDocumentId</param>
        /// <param name="companyCode">The company code</param>
        /// <returns>The list of Rate of exchange informations for the list of transactionDocumentId</returns>
        Task<IEnumerable<TransactionDocumentRateOfExchange>> GetTransactionDocumentRateOfExchangeList(IEnumerable<long> transactionDocumentIds, string companyCode);
    }
}
