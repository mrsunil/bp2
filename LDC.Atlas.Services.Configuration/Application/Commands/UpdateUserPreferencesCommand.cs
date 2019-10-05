using LDC.Atlas.Services.Configuration.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    public class UpdateUserPreferencesCommand : IRequest
    {
        public UserPreferencesSetup UserPreferencesSetup { get; set; }
    }
}
