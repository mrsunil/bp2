using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    public class RetentionPolicyDto
    {
        public string WeekendDay { get; set; }

        public long DailyFreezeRetention { get; set; }

        public long WeeklyFreezeRetention { get; set; }

        public long MonthlyFreezeRetention { get; set; }
    }
}
