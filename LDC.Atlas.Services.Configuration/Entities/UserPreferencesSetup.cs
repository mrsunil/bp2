using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class UserPreferencesSetup
    {
        public int UserId { get; set; }

        public int? DateFormatId { get; set; }

        public int? FavouriteLanguageId { get; set; }

    }
}
