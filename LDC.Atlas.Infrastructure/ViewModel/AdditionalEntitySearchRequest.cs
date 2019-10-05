using System;
using System.Collections.Generic;
using System.Text;

namespace LDC.Atlas.Infrastructure.ViewModel
{
   public class AdditionalEntitySearchRequest<T> : EntitySearchRequest
    {
        public T AdditionalParameters { get; set; }
    }
}
