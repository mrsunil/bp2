﻿using LDC.Atlas.Services.MasterData.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Application.Command
{
    public class CurrencyUpdateCommands : IRequest
    {
        public List<Currency> MasterDataList { get; set; }
    }
}
