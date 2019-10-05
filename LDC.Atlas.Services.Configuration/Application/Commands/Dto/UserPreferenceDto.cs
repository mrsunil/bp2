using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    public class UserPreferenceDto
    {
        public string DisplayName { get; set; }

        public string FavouriteLanguage { get; set; }

        public string DateFormat { get; set; }
    }
}
