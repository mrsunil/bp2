using AutoMapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.PreAccounting.Entities;
using LDC.Atlas.Services.PreAccounting.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public partial class UpdateAccountingDocumentStatusToDeletedCommandHandler : IRequestHandler<UpdateAccountingDocumentStatusToDeletedCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        private readonly IAccountingDocumentRepository _accountingDocumentRepository;

        public UpdateAccountingDocumentStatusToDeletedCommandHandler(
          ILogger<UpdateAccountingDocumentStatusToDeletedCommandHandler> logger,
          IUnitOfWork unitOfWork,
          IMapper mapper,
          IAccountingDocumentRepository accountingDocumentRepository)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _mapper = mapper;
            _accountingDocumentRepository = accountingDocumentRepository;
        }

        public async Task<Unit> Handle(UpdateAccountingDocumentStatusToDeletedCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                // Only document within following status can be deleted: PostingStatus.Held, PostingStatus.Incomplete
                // Only document within following type can be deleted:  DocumentType.MTA, DocumentType.MJL

                var documents = request.AccountingDocuments.Select(d => new AccountingDocumentStatus { AccountingId = d.AccountingId }).ToList();

                await _accountingDocumentRepository.UpdateAccountingDocumentsStatus(request.Company, documents, (int)PostingStatus.Deleted);

                _logger.LogInformation($"Deleting documents {string.Join(",", documents.Select(d => d.AccountingId))}.");

                _unitOfWork.Commit();
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }
    }
}