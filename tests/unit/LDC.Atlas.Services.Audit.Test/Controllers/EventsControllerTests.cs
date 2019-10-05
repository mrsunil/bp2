using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Audit.Application.Queries;
using LDC.Atlas.Services.Audit.Controllers;
using MediatR;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;

namespace LDC.Atlas.Services.Audit.Test.Controllers
{
    public class EventsControllerTests : IDisposable
    {
        private MockRepository mockRepository;

        private Mock<IEventQueries> mockEventQueries;

        public EventsControllerTests()
        {
            this.mockRepository = new MockRepository(MockBehavior.Strict);
            this.mockEventQueries = this.mockRepository.Create<IEventQueries>();
        }

        public void Dispose()
        {
            this.mockRepository.VerifyAll();
        }

        private EventsController CreateEventsController()
        {
            return new EventsController(
                this.mockEventQueries.Object);
        }

        [Fact]
        public async Task GetEvents_StateUnderTest_ExpectedBehavior()
        {
            // Arrange
            var eventsController = this.CreateEventsController();
            PagingOptions pagingOptions = null;

            // Act
            var result = await eventsController.GetEvents(
                pagingOptions);

            // Assert
            Assert.True(false);
        }

        [Fact]
        public async Task GetEvents_StateUnderTest_ExpectedBehavior1()
        {
            // Arrange
            var eventsController = this.CreateEventsController();
            string company = null;
            long eventId = 0;
            PagingOptions pagingOptions = null;

            // Act
            var result = await eventsController.GetEvents(
                company,
                eventId,
                pagingOptions);

            // Assert
            Assert.True(false);
        }

        [Fact]
        public async Task GetSearchEvents_StateUnderTest_ExpectedBehavior()
        {
            // Arrange
            var eventsController = this.CreateEventsController();
            int interfaceType = 0;
            int interfaceStatus = 0;
            System.DateTime? fromDate = null;
            System.DateTime? toDate = null;
            string documentReference = null;
            PagingOptions pagingOptions = null;

            // Act
            var result = await eventsController.GetSearchEvents(
                interfaceType,
                interfaceStatus,
                fromDate,
                toDate,
                documentReference,
                pagingOptions);

            // Assert
            Assert.True(false);
        }

        [Fact]
        public async Task GetTransactionDetailsByAccountingId_StateUnderTest_ExpectedBehavior()
        {
            // Arrange
            var eventsController = this.CreateEventsController();
            string company = null;
            long accountingId = 0;

            // Act
            var result = await eventsController.GetTransactionDetailsByAccountingId(
                company,
                accountingId);

            // Assert
            Assert.True(false);
        }

        [Fact]
        public async Task GetCashDetailsByCashId_StateUnderTest_ExpectedBehavior()
        {
            // Arrange
            var eventsController = this.CreateEventsController();
            string company = null;
            long cashId = 0;

            // Act
            var result = await eventsController.GetCashDetailsByCashId(
                company,
                cashId);

            // Assert
            Assert.True(false);
        }

    }
}
