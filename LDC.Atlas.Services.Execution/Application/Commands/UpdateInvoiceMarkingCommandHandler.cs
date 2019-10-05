using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Execution.Entities;
using LDC.Atlas.Services.Execution.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class UpdateInvoiceMarkingCommandHandler : IRequestHandler<UpdateInvoiceMarkingCommand>,
        IRequestHandler<DeleteInvoiceMarkingCommand>, IRequestHandler<UpdateInvoiceMarkingPostingStatusCommand>, IRequestHandler<UpdateInvoiceMarkingPercentLinesCommand>
    {
        private readonly ILogger<UpdateInvoiceMarkingCommandHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IFreezeRepository _freezeRepository;
        private readonly IAuthorizationService _authorizationService;

        public UpdateInvoiceMarkingCommandHandler(
            ILogger<UpdateInvoiceMarkingCommandHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IInvoiceRepository invoiceRepository,
            IFreezeRepository freezeRepository,
            IAuthorizationService authorizationService)
        {
            _invoiceRepository = invoiceRepository ?? throw new ArgumentNullException(nameof(invoiceRepository));
            _freezeRepository = freezeRepository ?? throw new ArgumentNullException(nameof(freezeRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
        }

        public async Task<Unit> Handle(UpdateInvoiceMarkingCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                if (request.DataVersionId != null)
                {
                    var freezeDate = await _freezeRepository.GetFreezeNotClosedAsync(request.Company, request.DataVersionId.Value);

                    if (freezeDate == null)
                    {
                        throw new AtlasBusinessException($"Contracts cannot be updated in a freeze if the month is closed.");
                    }
                }

                List<InvoiceMarking> newInvoices = new List<InvoiceMarking>();

                var invoiceStatus = request.InvoiceStatusId;

                if (request.Invoices.ToList().Count == 0 && invoiceStatus != null && request.SectionId != null) // Dorine
                {
                    // Even if there is no invoice marking, the invoicing status can be changed from the trade page
                    await _invoiceRepository.UpdateInvoicingStatusAsync((int)request.SectionId, (int)invoiceStatus, request.Company, request.DataVersionId);
                }
                else
                {
                    foreach (var item in request.Invoices)
                    {
                        if (item.Quantity > 0 && item.CostId == null)
                        {
                            item.InvoiceAmount = item.Quantity * item.Price;
                        }

                        item.CompanyId = request.Company;

                        if (item.InvoiceMarkingId != null)
                        {
                            await _invoiceRepository.UpdateInvoiceMarkingAsync(item, invoiceStatus, request.Company);
                        }
                        else
                        {
                            newInvoices.Add(item);
                        }
                    }

                    if (newInvoices.Count > 0)
                    {
                        await _invoiceRepository.AddInvoiceMarkingAsync(newInvoices, invoiceStatus, request.Company);
                    }
                }

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(DeleteInvoiceMarkingCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _invoiceRepository.DeleteInvoiceMarkingAsync(request.Company, request.InvoiceMarkingId);

                _unitOfWork.Commit();

                _logger.LogInformation("Invoice Marking with id {Atlas_InvoiceMarkingId} deleted.", request.InvoiceMarkingId);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<Unit> Handle(UpdateInvoiceMarkingPostingStatusCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _invoiceRepository.UpdateInvoiceMarkingPostingStatusAsync(request.TransactionDocumentId, request.PostingStatusId, request.Company);

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        /// <summary>
        /// Update invoice Percent in Cost invoice marking dialog
        /// </summary>
        public async Task<Unit> Handle(UpdateInvoiceMarkingPercentLinesCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _invoiceRepository.UpdateInvoiceMarkingPercentLines(request.InvoiceMarkingPercentLines, request.Company, request.DataVersionId);
                _unitOfWork.Commit();
                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
