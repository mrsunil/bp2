using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace LDC.Atlas.Application.Core.Utils
{
    public static class EnumUtils
    {
        public static string GetDisplayName(this Enum enumValue)
        {
            return enumValue.GetType()?
                    .GetMember(enumValue.ToString())?
                    .First()?
                    .GetCustomAttribute<DisplayAttribute>()?
                    .Name
                    ?? Enum.GetName(enumValue.GetType(), enumValue);
        }
    }
}
