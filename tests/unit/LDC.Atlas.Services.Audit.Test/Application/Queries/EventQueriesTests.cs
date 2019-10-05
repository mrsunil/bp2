using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Audit.Application.Queries;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;

namespace LDC.Atlas.Services.Audit.Test.Application.Queries
{
    public class EventQueriesTests : IDisposable
    {
        private MockRepository mockRepository;

        private Mock<IDapperContext> mockDapperContext;

        public EventQueriesTests()
        {
            this.mockRepository = new MockRepository(MockBehavior.Strict);

            this.mockDapperContext = this.mockRepository.Create<IDapperContext>();
        }

        public void Dispose()
        {
            this.mockRepository.VerifyAll();
        }

        private EventQueries CreateEventQueries()
        {
            return new EventQueries(
                this.mockDapperContext.Object);
        }

        [Fact]
        public async Task GetEventsAsync_StateUnderTest_ExpectedBehavior()
        {
            // Arrange
            var eventQueries = this.CreateEventQueries();

            // Act
            var result = await eventQueries.GetEventsAsync();

            // Assert
            Assert.True(false);
        }

        [Fact]
        public async Task GetEventHistoryAsync_StateUnderTest_ExpectedBehavior()
        {
            // Arrange
            var eventQueries = this.CreateEventQueries();
            long eventId = 0;
            string company = null;

            // Act
            var result = await eventQueries.GetEventHistoryAsync(
                eventId,
                company);

            // Assert
            Assert.True(false);
        }

        [Fact]
        public async Task GetEventsBySearch_StateUnderTest_ExpectedBehavior()
        {
            // Arrange
            var eventQueries = this.CreateEventQueries();
            int interfaceType = 1;
            int interfaceStatus = 1;
            System.DateTime? fromDate = null;
            System.DateTime? toDate = null;
            string documentReference = null;
            int? offset = null;
            int? limit = null;

            // Act
            var result = await eventQueries.GetEventsBySearch(
                interfaceType,
                interfaceStatus,
                fromDate,
                toDate,
                documentReference,
                offset,
                limit);

            // Assert
            Assert.True(false);
        }
    }
}
