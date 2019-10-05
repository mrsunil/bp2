namespace LDC.Atlas.Document.Common.OpenXml
{
    public interface IWordDocument
    {
        void AddCustomXmlPart<T>(T metadata);

        T GetCustomXmlPart<T>();

        byte[] GetFile();

        bool SearchAndReplace(string searchPattern, string replacement);
    }
}