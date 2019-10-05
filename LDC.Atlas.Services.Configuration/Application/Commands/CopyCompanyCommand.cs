using LDC.Atlas.Services.Configuration.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public class CopyCompanyCommand : IRequest
    {
        public string CompanyId { get; set; }

        public bool IsCounterpartyRequired { get; set; }

        public bool IsTransactionDataSelected { get; set; }

        public string CompanyToCopy { get; set; }

        public CompanyConfiguration CompanyConfiguration { get; set; }

        public IEnumerable<CompanyUserProfile> CompanyUserProfile { get; set; }
    }
}
