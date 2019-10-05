using DocumentFormat.OpenXml.Packaging;
using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Serialization;

namespace LDC.Atlas.Document.Common.OpenXml
{
    public class WordDocument : IWordDocument
    {
        private const string AtlasNamespace = "http://schemas.ldc.com/atlas";
        private byte[] _file;

        public WordDocument(byte[] file)
        {
            _file = file ?? throw new ArgumentNullException(nameof(file));
        }

        public virtual bool SearchAndReplace(string searchPattern, string replacement)
        {
            bool isMatch;

            using (MemoryStream memoryStream = new MemoryStream())
            {
                memoryStream.Write(_file, 0, _file.Length);
                // https://docs.microsoft.com/en-us/office/open-xml/how-to-search-and-replace-text-in-a-document-part
                using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(memoryStream, true))
                {
                    string docText = null;
                    using (StreamReader sr = new StreamReader(wordDoc.MainDocumentPart.GetStream()))
                    {
                        docText = sr.ReadToEnd();
                    }

                    Regex regexText = new Regex(searchPattern);

                    isMatch = regexText.IsMatch(docText);

                    docText = regexText.Replace(docText, replacement);

                    using (StreamWriter sw = new StreamWriter(wordDoc.MainDocumentPart.GetStream(FileMode.Create)))
                    {
                        sw.Write(docText);
                    }
                }

                //memoryStream.Position = 0;
                //var result = memoryStream.ToArray();
                //memoryStream.Flush();

                memoryStream.Seek(0, SeekOrigin.Begin);
                _file = memoryStream.ToArray();

                return isMatch;
            }
        }

        public virtual void AddCustomXmlPart<T>(T metadata)
        {
            // AddCustomXmlPart
            // https://msdn.microsoft.com/en-us/library/office/bb456489.aspx?f=255&MSPPError=-2147217396
            using (MemoryStream memoryStream = new MemoryStream())
            {
                memoryStream.Write(_file, 0, _file.Length);
                using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(memoryStream, true))
                {
                    MainDocumentPart mainPart = wordDoc.MainDocumentPart;

                    // Try to find existing cutom XML part
                    CustomXmlPart myXmlPart = null;
                    foreach (var xmlPart in mainPart.CustomXmlParts)
                    {
                        var exists = false;
                        using (XmlTextReader xReader = new XmlTextReader(xmlPart.GetStream(FileMode.Open, FileAccess.Read)))
                        {
                            xReader.MoveToContent();
                            exists = xReader.NamespaceURI.Equals(AtlasNamespace, StringComparison.InvariantCultureIgnoreCase);
                        }

                        if (exists)
                        {
                            myXmlPart = xmlPart;
                            break;
                        }
                    }

                    // If there is no cutom XML part, we create it
                    if (myXmlPart == null)
                    {
                        myXmlPart = mainPart.AddCustomXmlPart(CustomXmlPartType.CustomXml, "atlas");
                    }

                    MemoryStream memoryStream2 = new MemoryStream();
                    {
                        StreamWriter stringwriter = new StreamWriter(memoryStream2);
                        {
                            XmlSerializer serializer = new XmlSerializer(metadata.GetType(), AtlasNamespace);
                            serializer.Serialize(stringwriter, metadata);
                            stringwriter.Flush();
                            memoryStream2.Seek(0, SeekOrigin.Begin);
                            myXmlPart.FeedData(memoryStream2);
                        }
                    }

                    memoryStream2.Seek(0, SeekOrigin.Begin);
                }

                memoryStream.Seek(0, SeekOrigin.Begin);
                _file = memoryStream.ToArray();
            }
        }

        public virtual T GetCustomXmlPart<T>()
        {
            using (MemoryStream memoryStream = new MemoryStream(_file))
            {
                using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(memoryStream, false))
                {
                    MainDocumentPart mainPart = wordDoc.MainDocumentPart;
                    CustomXmlPart myXmlPart = null;
                    foreach (var xmlPart in mainPart.CustomXmlParts)
                    {
                        var exists = false;
                        using (XmlTextReader xReader = new XmlTextReader(xmlPart.GetStream(FileMode.Open, FileAccess.Read)))
                        {
                            xReader.MoveToContent();
                            exists = xReader.NamespaceURI.Equals(AtlasNamespace, StringComparison.InvariantCultureIgnoreCase);
                        }

                        if (exists)
                        {
                            myXmlPart = xmlPart;
                            break;
                        }
                    }

                    if (myXmlPart != null)
                    {
                        var xmlReader = XmlReader.Create(myXmlPart.GetStream(FileMode.Open, FileAccess.Read));
                        XmlSerializer serializer = new XmlSerializer(typeof(T), AtlasNamespace);
                        var metadata = (T)serializer.Deserialize(xmlReader);

                        return metadata;
                    }
                }
            }

            return default(T);
        }

        public byte[] GetFile()
        {
            return _file;
        }
    }
}
