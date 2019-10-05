using LDC.Atlas.DataAccess.DapperMapper;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Entities
{
    public class IntercoValidation
    {
        public IntercoValidation()
        {
            IntercoFields = new List<IntercoField>();
        }

        public string CompanyId { get; set; }

        public List<IntercoField> IntercoFields { get; set; }
    }

    public class IntercoField
    {
        public int GroupId { get; set; }

        public string Type { get; set; }

        public string Name { get; set; }

        public string Value { get; set; }

        public string MappingName { get; set; }
    }
}