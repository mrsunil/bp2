using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public class CreateAccountingLinesFileUploadCommand
    {
        public IFormFile File{ get; set; }

        public bool IsAccuralSelected { get; set; }
        public bool IsMTMSelected { get; set; }

     

    }
}
