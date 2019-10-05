using LDC.Atlas.Application.Core.Utils;
using LDC.Atlas.Document.Common.Entities;
using System;

namespace LDC.Atlas.Document.Common.Utils
{
    public static class PhysicalDocumentMessages
    {
        public static string GenerateErrorMessage(PhysicalDocumentType physicalDocumentType, PhysicalDocumentErrors errors)
        {
            switch (errors)
            {
                case PhysicalDocumentErrors.Format:
                    return $"The selected document can only be a Word (.doc or .docx). " +
                    $"The {EnumUtils.GetDisplayName(physicalDocumentType)} has not been created. " +
                    $"Please repeat the operation with another document or choose another option.";
                case PhysicalDocumentErrors.Size:
                    return $"The size of the selected document has to be inferior to 3MB. " +
                    $"The {EnumUtils.GetDisplayName(physicalDocumentType)} has not been created. " +
                    $"Please repeat the operation with another document or choose another option.";
                case PhysicalDocumentErrors.Unknown:
                case PhysicalDocumentErrors.Naming:
                case PhysicalDocumentErrors.General:
                default:
                    return $"The selected document format does not allow to add the Document reference. " +
                    $"The {EnumUtils.GetDisplayName(physicalDocumentType)} has not been created. " +
                    "Please repeat the operation with another document or choose another option.";
            }
        }
    }

    public enum PhysicalDocumentErrors
    {
        Unknown,
        Format,
        Size,
        Naming,
        General
    }
}
