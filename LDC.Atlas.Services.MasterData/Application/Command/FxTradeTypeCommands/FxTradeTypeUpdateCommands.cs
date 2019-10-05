using LDC.Atlas.Services.MasterData.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Application.Command
{
    public class FxTradeTypeGlobalUpdateCommands : FxTradeTypeCommands, IRequest
    {
       public string Company { get; set; }
    }

    public class FxTradeTypeLocalUpdateCommands : FxTradeTypeCommands, IRequest
    {
        public string Company { get; set; }
    }
}
