using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Trading.Application.Commands;
using LDC.Atlas.Services.Trading.Application.Queries;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Entities;
using LDC.Atlas.Services.Trading.Infrastructure.Policies;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Controllers
{
    [Route("api/v1/trading/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    public class TradeFavoritesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ISectionQueries _sectionQueries;

        public TradeFavoritesController(IMediator mediator, ISectionQueries sectionQueries)
        {
            _mediator = mediator;
            _sectionQueries = sectionQueries;
        }

        /// <summary>
        /// Returns the list of favorites.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<TradeFavoriteDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<TradeFavoriteDto>>> GetMyFavorites(string company)
        {
            var tradeFavorites = await _sectionQueries.GetFavoritesAsync(company);
            var response = new CollectionViewModel<TradeFavoriteDto>(tradeFavorites.ToList());
            return Ok(response);
        }

        /// <summary>
        /// Returns a trade favorite by its identifier.
        /// </summary>
        /// <param name="favoriteId">The trade favorite identifier.</param>
        [HttpGet("{favoriteId:long}")]
        [ProducesResponseType(typeof(PhysicalContractDtoDeprecated), StatusCodes.Status200OK)]
        public async Task<ActionResult<TradeFavoriteDetailDto>> GetTradeFavoriteById(long favoriteId)
        {
            var tradeFavorite = await _sectionQueries.GetTradeFavoriteByIdAsync(favoriteId);

            return Ok(tradeFavorite);
        }

        /// <summary>
        /// Creates a trade favorite.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="tradeFavoriteCommand">The trade favorite to create.</param>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policies.CreateTradePhysicalPolicy)]
        public async Task<IActionResult> CreateTradeFavorite(string company, [FromBody] CreateFavouriteCommand tradeFavoriteCommand)
        {
            List<TradeImageColumnDto> tradeImageSetupDetails = (await _sectionQueries.GetTradeImageFieldDetailsAsync(company)).Where(i => i.CopyAsFavorite).ToList();
            TradeFavoriteDetail tradeFavoriteTobeCreated = new TradeFavoriteDetail
            {
                Name = tradeFavoriteCommand.Name,
                Description = tradeFavoriteCommand.Description
            };
            var sectionObject = await _sectionQueries.GetSectionByIdAsync(tradeFavoriteCommand.SectionId, company, null);
            foreach (TradeImageColumnDto element in tradeImageSetupDetails)
            {
                switch (element.TradeFieldName)
                {
                    case "Type":
                        tradeFavoriteTobeCreated.ContractType = sectionObject.ContractType;

                        if (tradeFavoriteTobeCreated.ContractType == ContractType.Purchase)
                        {
                            tradeFavoriteTobeCreated.CounterpartyReference = sectionObject.SellerCode;
                        }
                        else if (tradeFavoriteTobeCreated.ContractType == ContractType.Sale)
                        {
                            tradeFavoriteTobeCreated.CounterpartyReference = sectionObject.BuyerCode;
                        }

                        tradeFavoriteTobeCreated.SellerCode = sectionObject.SellerCode;
                        tradeFavoriteTobeCreated.BuyerCode = sectionObject.BuyerCode;

                        break;
                    case "DepartmentId":
                        tradeFavoriteTobeCreated.DepartmentId = sectionObject.DepartmentId;
                        break;
                    case "CommodityId":
                        tradeFavoriteTobeCreated.CommodityId = sectionObject.CommodityId;
                        break;
                    case "CropYear":
                        tradeFavoriteTobeCreated.CropYear = sectionObject.CropYear;
                        break;
                    case "WeightUnitId":
                        tradeFavoriteTobeCreated.WeightUnitId = sectionObject.WeightUnitId;
                        break;
                    case "Quantity":
                        tradeFavoriteTobeCreated.Quantity = sectionObject.Quantity;
                        break;
                    case "PricingMethodId":
                        tradeFavoriteTobeCreated.PricingMethod = sectionObject.PricingMethod;
                        break;
                    case "CurrencyCode":
                        tradeFavoriteTobeCreated.Currency = sectionObject.Currency;
                        break;
                    case "PriceUnitId":
                        tradeFavoriteTobeCreated.PriceUnitId = sectionObject.PriceUnitId;
                        break;
                    case "Price":
                        tradeFavoriteTobeCreated.Price = sectionObject.Price;
                        break;
                    case "PaymentTermId":
                        tradeFavoriteTobeCreated.PaymentTermCode = sectionObject.PaymentTermCode;
                        break;
                    case "ContractTermId":
                        tradeFavoriteTobeCreated.ContractTermCode = sectionObject.ContractTermCode;
                        break;
                    case "TraderId":
                        tradeFavoriteTobeCreated.TraderId = sectionObject.Header.TraderId;
                        break;
                    case "ContractTermLocationId":
                        tradeFavoriteTobeCreated.ContractTermLocationCode = sectionObject.ContractTermLocationCode;
                        break;
                    case "ArbitrationId":
                        tradeFavoriteTobeCreated.ArbitrationCode = sectionObject.ArbitrationCode;
                        break;
                    case "PeriodTypeId":
                        tradeFavoriteTobeCreated.PeriodTypeId = sectionObject.PeriodTypeId;
                        break;
                    case "DeliveryPeriodStart":
                        tradeFavoriteTobeCreated.ShippingPeriod = sectionObject.ShippingPeriod;
                        tradeFavoriteTobeCreated.DeliveryPeriodEndDate = sectionObject.DeliveryPeriodEndDate;
                        tradeFavoriteTobeCreated.DeliveryPeriodStartDate = sectionObject.DeliveryPeriodStartDate;
                        break;
                    case "PositionMonthType":
                        tradeFavoriteTobeCreated.PositionMonthType = sectionObject.PositionMonthType;
                        break;
                    case "PortOriginId":
                        tradeFavoriteTobeCreated.PortOriginCode = sectionObject.PortOriginCode;
                        break;
                    case "PortDestinationId":
                        tradeFavoriteTobeCreated.PortDestinationCode = sectionObject.PortDestinationCode;
                        break;
                    case "MarketSectorId":
                        tradeFavoriteTobeCreated.MarketSectorId = (sectionObject.MarketSectorId != 0) ? (int?)sectionObject.MarketSectorId : null;
                        break;
                    default:
                        break;
                }
            }

            tradeFavoriteTobeCreated.ContractedValue = sectionObject.ContractedValue;
            tradeFavoriteTobeCreated.Costs = sectionObject.Costs;
            tradeFavoriteCommand.CompanyId = company;
            tradeFavoriteCommand.TradeFavoriteToBeCreated = tradeFavoriteTobeCreated;
            var tradeFavoriteId = await _mediator.Send(tradeFavoriteCommand);
            return Ok(tradeFavoriteId);
        }

        /// <summary>
        /// Checks if a trade favorite name exists.
        /// </summary>
        /// <param name="tradeFavoriteName">The trade favorite name.</param>
        [HttpHead("{tradeFavoriteName}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> CheckTradeFavoriteNameExists(string tradeFavoriteName)
        {
            var favoriteNameExists = await _sectionQueries.CheckTradeFavoriteNameExistsAsync(tradeFavoriteName);

            if (!favoriteNameExists)
            {
                return NoContent();
            }

            return Ok();
        }

        /// <summary>
        /// Deletes a trade favorite.
        /// </summary>
        /// <param name="favoriteId">The identifier of the trade favorite to delete.</param>
        /// <response code="204">Favorite deleted</response>
        [HttpDelete("{favoriteId:long}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteTradeFavorite(long favoriteId)
        {
            var command = new DeleteTradeFavoriteCommand
            {
                TradeFavoriteId = favoriteId
            };

            await _mediator.Send(command);

            return NoContent();
        }
    }
}