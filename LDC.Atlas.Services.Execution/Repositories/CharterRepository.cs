using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Repositories
{
    public class CharterRepository : BaseRepository, ICharterRepository
    {
        public CharterRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(typeof(Charter), new ColumnAttributeTypeMapper<Charter>());
        }

        public async Task AssignSectionsToCharterAsync(long? charterId, IEnumerable<long> sectionsId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CharterID", charterId);
            queryParameters.Add("@sectionIds", ToArrayTvp(sectionsId));
            queryParameters.Add("@companyId", company);

            await ExecuteNonQueryAsync(StoredProcedureNames.AssignSectionsToCharter, queryParameters, true);
        }

        public async Task<long> AddCharterAsync(Charter charter, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CharterCode", charter.CharterCode);
            queryParameters.Add("@Description", charter.Description);
            queryParameters.Add("@VesselId", charter.VesselId);
            queryParameters.Add("@M_TransportType", charter.TransportTypeCode);
            queryParameters.Add("@M_LoadingLocation", charter.LoadingLocationCode);
            queryParameters.Add("@DepartureDate", charter.DepartureDate);
            queryParameters.Add("@M_DischargeLocation", charter.DischargeLocationCode);
            queryParameters.Add("@ArrivalDate", charter.ArrivalDate);
            queryParameters.Add("@companyId", company);
            queryParameters.Add("@CharterManagerId", charter.CharterManagerId == 0 ? null : charter.CharterManagerId);
            queryParameters.Add("@Memo", charter.Memo);
            queryParameters.Add("@DepartmentId", charter.DepartmentId);
            queryParameters.Add("@WeightUnitId", charter.WeightUnitId);
            queryParameters.Add("@CurrencyCode", charter.Currency);
            queryParameters.Add("@BLDate", charter.BlDate);
            queryParameters.Add("@BLRef", charter.BLRef);
            var createdCharter = await ExecuteQueryFirstOrDefaultAsync<Charter>(StoredProcedureNames.CreateCharter, queryParameters, true);

            return createdCharter.CharterId.Value;
        }

        public async Task UpdateCharterAsync(Charter charter, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@I_Charter", charter.CharterId);
            queryParameters.Add("@CharterCode", charter.CharterCode);
            queryParameters.Add("@Description", charter.Description);
            queryParameters.Add("@VesselId", charter.VesselId);
            queryParameters.Add("@M_TransportType", charter.TransportTypeCode);
            queryParameters.Add("@M_LoadingLocation", charter.LoadingLocationCode);
            queryParameters.Add("@DepartureDate", charter.DepartureDate);
            queryParameters.Add("@M_DischargeLocation", charter.DischargeLocationCode);
            queryParameters.Add("@ArrivalDate", charter.ArrivalDate);
            queryParameters.Add("@company", company);
            queryParameters.Add("@CharterManagerId", charter.CharterManagerId);
            queryParameters.Add("@Memo", charter.Memo);
            queryParameters.Add("@DepartmentId", charter.DepartmentId);
            queryParameters.Add("@WeightUnitId", charter.WeightUnitId);
            queryParameters.Add("@CurrencyCode", charter.Currency);
            queryParameters.Add("@BLDate", charter.BlDate);
            queryParameters.Add("@BLRef", charter.BLRef);
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateCharter, queryParameters, true);
        }

        public async Task UpdateSectionTrafficAsync(Charter charter, string company, bool isDeassignSectionRequest)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionTrafficList", ToArrayTVP(charter.SectionsAssigned));
            queryParameters.Add("@IsDeassignment", isDeassignSectionRequest);
            queryParameters.Add("@CompanyId", company);
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateSectionTraffic, queryParameters, true);
        }

        public async Task UpdateVesselInformationAsync(IEnumerable<SectionTraffic> sectionsTraffic, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionTrafficList", ToArrayTVPVessel(sectionsTraffic));
            queryParameters.Add("@CompanyId", company);
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateSectionTraffic, queryParameters, true);
        }

        public async Task RemoveSectionsFromCharterAsync(long? charterId, IEnumerable<long> sectionsId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@charterId", charterId);
            queryParameters.Add("@sectionIds", ToArrayTvp(sectionsId));
            queryParameters.Add("@CompanyId", company);
            await ExecuteNonQueryAsync(StoredProcedureNames.RemoveSectionFromCharter, queryParameters, true);
        }

        public async Task<bool> CheckCharterExistsAsync(string company, string charterRef)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@company", company);
            queryParameters.Add("@charterRef", charterRef);

            var exists = await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.CheckCharterReferenceExists, queryParameters);

            return exists;
        }

        public async Task<Charter> GetSectionsAssignedToCharter(long charterId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@companyId", company);
            queryParameters.Add("@charterID", charterId);

            var exists = await ExecuteQueryFirstOrDefaultAsync<Charter>(StoredProcedureNames.GetSectionsAssignedToCharter, queryParameters);

            return exists;
        }

        public async Task DeleteCharterAsync(string company, long charterId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@companyId", company);
            queryParameters.Add("@charterID", charterId);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteCharter, queryParameters, true);
        }

        public async Task UpdateSectionTrafficDetailsAsync(SectionTraffic sectionTraffic, string company, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionTrafficList", ToSingleTVP(sectionTraffic));
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@TrafficUpdate", true);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateSectionTraffic, queryParameters, true);
        }

        /// <summary>
        /// Update the charter status as open/close
        /// </summary>
        /// <param name="company">The company identifier</param>
        /// <param name="charterIds">List of charter id to update status</param>
        /// <param name="charterStatusId">Charter status to update for charters</param>
        /// <param name="dataVersionId">Data version Id identifier</param>
        public async Task UpdateCharterStatusAsync(string company, long[] charterIds, int charterStatusId, int? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@CharterId", AddValuesToUDTTSection(charterIds, "[dbo].[UDTT_BigIntList]"));
            queryParameters.Add("@DataVersionId", dataVersionId);
            queryParameters.Add("@CharterStatusId", charterStatusId);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateCharterStatus, queryParameters, true);
        }

        private static DataTable ToArrayTvp(IEnumerable<long> values)
        {
            var table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_BigIntList]");

            var sectionId = new DataColumn("Value", typeof(long));
            table.Columns.Add(sectionId);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[sectionId] = value;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private DataTable ToArrayTVPVessel(IEnumerable<SectionTraffic> values)
        {
            var table = new DataTable();
            table.SetTypeName("[Logistic].[UDTT_SectionTraffic]");

            var sectionId = new DataColumn("[SectionId]", typeof(long));
            table.Columns.Add(sectionId);

            var dataVersionId = new DataColumn("[DataVersionId]", typeof(int));
            table.Columns.Add(dataVersionId);

            var blDate = new DataColumn("[BlDate]", typeof(DateTime));
            table.Columns.Add(blDate);

            var bLRef = new DataColumn("[BLReference]", typeof(string));
            table.Columns.Add(bLRef);

            var vessel = new DataColumn("[VesselCode]", typeof(string));
            table.Columns.Add(vessel);

            var contextInformation = new DataColumn("[ContextInformation]", typeof(string));
            table.Columns.Add(contextInformation);

            var portOrigin = new DataColumn("[PortOriginCode]", typeof(string));
            table.Columns.Add(portOrigin);

            var portDestination = new DataColumn("[PortDestinationCode]", typeof(string));
            table.Columns.Add(portDestination);

            var shippingStatusCode = new DataColumn("[ShippingStatusCode]", typeof(string));
            table.Columns.Add(shippingStatusCode);


            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[sectionId] = value.SectionId;
                    row[blDate] = value.BLDate.HasValue ? value.BLDate : (object)DBNull.Value;
                    row[bLRef] = value.BLReference;
                    row[vessel] = value.VesselCode;
                    row[portOrigin] = value.PortOrigin;
                    row[portDestination] = value.PortDestination;
                    row[shippingStatusCode] = value.ShippingStatusCode;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private DataTable ToArrayTVP(IEnumerable<SectionsAssignedToCharterRecord> values)
        {
            var table = new DataTable();
            table.SetTypeName("[Logistic].[UDTT_SectionTraffic]");

            var sectionId = new DataColumn("[SectionId]", typeof(string));
            table.Columns.Add(sectionId);

            var dataVersionId = new DataColumn("[DataVersionId]", typeof(int));
            table.Columns.Add(dataVersionId);

            var blDate = new DataColumn("[BlDate]", typeof(DateTime));
            table.Columns.Add(blDate);

            var bLRef = new DataColumn("[BLReference]", typeof(string));
            table.Columns.Add(bLRef);

            var vessel = new DataColumn("[VesselCode]", typeof(string));
            table.Columns.Add(vessel);

            var contextInformation = new DataColumn("[ContextInformation]", typeof(string));
            table.Columns.Add(contextInformation);

            var portOrigin = new DataColumn("[PortOriginCode]", typeof(string));
            table.Columns.Add(portOrigin);

            var portDestination = new DataColumn("[PortDestinationCode]", typeof(string));
            table.Columns.Add(portDestination);

            var shippingStatusCode = new DataColumn("[ShippingStatusCode]", typeof(string));
            table.Columns.Add(shippingStatusCode);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[sectionId] = value.SectionId;
                    row[dataVersionId] = DBNull.Value;
                    row[blDate] = value.BlDate.HasValue ? value.BlDate : (object)DBNull.Value;
                    row[bLRef] = value.BLRef;
                    row[portOrigin] = value.PortOrigin;
                    row[portDestination] = value.PortDestination;
                    row[vessel] = value.Vessel;
                    row[shippingStatusCode] = value.ShippingStatusCode;

                    if (value.RemoveSectionTrafficInfo != null)
                    {
                        if (value.RemoveSectionTrafficInfo == true && value.InvoicingStatus == InvoicingStatus.Uninvoiced)
                        {
                            row[blDate] = DBNull.Value;
                            row[bLRef] = null;
                        }

                        row[vessel] = null;
                    }

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private DataTable ToSingleTVP(SectionTraffic value)
        {
            var table = new DataTable();
            table.SetTypeName("[Logistic].[UDTT_SectionTraffic]");

            var sectionId = new DataColumn("[SectionId]", typeof(string));
            table.Columns.Add(sectionId);

            var dataVersionId = new DataColumn("[DataVersionId]", typeof(int));
            table.Columns.Add(dataVersionId);

            var blDate = new DataColumn("[BlDate]", typeof(DateTime));
            table.Columns.Add(blDate);

            var bLRef = new DataColumn("[BLReference]", typeof(string));
            table.Columns.Add(bLRef);

            var vessel = new DataColumn("[VesselCode]", typeof(string));
            table.Columns.Add(vessel);

            var contextInformation = new DataColumn("[ContextInformation]", typeof(string));
            table.Columns.Add(contextInformation);

            var portOrigin = new DataColumn("[PortOriginCode]", typeof(string));
            table.Columns.Add(portOrigin);

            var portDestination = new DataColumn("[PortDestinationCode]", typeof(string));
            table.Columns.Add(portDestination);

            var shippingStatusCode = new DataColumn("[ShippingStatusCode]", typeof(string));
            table.Columns.Add(shippingStatusCode);

            if (value != null)
            {
                var row = table.NewRow();
                row[sectionId] = value.SectionId;
                row[dataVersionId] = 0;
                row[contextInformation] = null;
                row[blDate] = value.BLDate.HasValue ? value.BLDate : (object)DBNull.Value;
                row[bLRef] = value.BLReference;
                row[vessel] = value.VesselCode;
                row[portOrigin] = null;
                row[portDestination] = null;
                row[shippingStatusCode] = value.ShippingStatusCode;
                table.Rows.Add(row);
            }

            return table;
        }

        private static DataTable AddValuesToUDTTSection(long[] charterIds, string typeName)
        {
            var table = new DataTable();
            table.SetTypeName(typeName);

            var sectionId = new DataColumn("CharterId", typeof(long));
            table.Columns.Add(sectionId);

            if (charterIds != null)
            {
                foreach (var value in charterIds)
                {
                    var row = table.NewRow();
                    row[sectionId] = value;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static class StoredProcedureNames
        {
            internal const string CreateCharter = "[Logistic].[usp_CreateCharter]";
            internal const string AssignSectionsToCharter = "[Logistic].[usp_AssignSectionToCharter]";
            internal const string RemoveSectionFromCharter = "[Logistic].[usp_UnassignSectionFromCharter]";
            internal const string CheckCharterReferenceExists = "[Logistic].[GET_CharterReferenceExists]";
            internal const string DeleteCharter = "[Logistic].[usp_DeleteCharter]";
            internal const string GetSectionsAssignedToCharter = "[Logistic].[usp_ListSectionsAssignedToCharter]";
            internal const string UpdateCharter = "[Logistic].[usp_UpdateCharter]";
            internal const string UpdateSectionTraffic = "[Logistic].[usp_UpdateSectionTraffic]";
            internal const string UpdateCharterStatus = "[Logistic].[usp_UpdateCharterStatus]";
        }
    }
}
